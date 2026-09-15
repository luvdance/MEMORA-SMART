/**
 * ASSESSMENTS · EXCEL ESSENTIALS
 *
 * SERVER ONLY. See the header of m1-data-foundations.js for the full contract
 * and the writing style. Never import this from anything under src/.
 * `npm run validate:content` enforces it.
 */

export const ASSESSMENTS = {
  /* ═══════════════════════════════════════════════════════════════════ */
  "l5-what-excel-is-for": {
    lessonId: "l5-what-excel-is-for",
    passMark: 70,
    questions: [
      {
        id: "q5-1",
        type: "mcq",
        difficulty: 1,
        atomId: "a-workbook",
        prompt: "A colleague emails you Sales_2026.xlsx. What have they sent?",
        options: [
          { id: "a", text: "A worksheet" },
          { id: "b", text: "A workbook" },
          { id: "c", text: "A cell range" },
          { id: "d", text: "A ribbon" },
        ],
        correct: "b",
        explanation:
          "The workbook is the file. It is the thing you save, send and open, and it may contain many worksheets inside it.",
        whyWrong: {
          a: "A worksheet is one tab inside the file. You cannot email a single tab on its own. You email the workbook that holds it.",
          c: "A range is a block of cells, such as B2:B50. That is much smaller than a file.",
          d: "The ribbon is the strip of buttons at the top of the Excel window. It is not something you send.",
        },
      },
      {
        id: "q5-2",
        type: "mcq",
        difficulty: 2,
        atomId: "a-worksheet",
        prompt:
          "You need to track twelve months of sales and compare them. What is the better structure?",
        options: [
          { id: "a", text: "Twelve separate workbooks, one per month" },
          { id: "b", text: "One workbook with twelve worksheets" },
          { id: "c", text: "One worksheet with twelve workbooks inside it" },
          { id: "d", text: "It makes no difference" },
        ],
        correct: "b",
        explanation:
          "One workbook with one sheet per month. Sheets exist so that a single file stays organised instead of twelve scattered across a folder. Comparing months then means switching tabs, not opening windows.",
        whyWrong: {
          a: "This is the common instinct and it is what makes comparison painful. You cannot easily total or compare across twelve open files.",
          c: "Workbooks cannot sit inside worksheets. The containment runs the other way: a workbook contains worksheets.",
          d: "It makes a very large difference the moment you try to compare January with June.",
        },
      },
      {
        id: "q5-3",
        type: "mcq",
        difficulty: 1,
        atomId: "a-rows-columns-cells",
        prompt: "Which statement is correct?",
        options: [
          {
            id: "a",
            text: "Columns are numbered and run across. Rows are lettered and run down",
          },
          {
            id: "b",
            text: "Columns are lettered and run down. Rows are numbered and run across",
          },
          { id: "c", text: "Both columns and rows are lettered" },
          { id: "d", text: "Rows and columns mean the same thing in Excel" },
        ],
        correct: "b",
        explanation:
          "Columns run down the screen and carry letters: A, B, C. Rows run across and carry numbers: 1, 2, 3. A cell sits where one of each meets.",
        whyWrong: {
          a: "This is exactly reversed, and it is the most common mix-up. Say it the wrong way round on a call and the other person edits the wrong part of the sheet.",
          c: "Only columns use letters. If both did, an address like B4 would be ambiguous.",
          d: "They are perpendicular and carry different meanings. A row is normally one record. A column is one kind of fact.",
        },
      },
      {
        id: "q5-4",
        type: "scenario",
        difficulty: 3,
        atomId: "a-excel-is-a-grid",
        prompt:
          "Someone has typed sales notes freely across the sheet wherever there was space, rather than in consistent columns. Why is this a problem beyond looking untidy?",
        options: [
          { id: "a", text: "It is only an appearance problem" },
          {
            id: "b",
            text: "Excel cannot total, sort or group values it cannot identify as a column",
          },
          { id: "c", text: "The file will be too large" },
          { id: "d", text: "Excel will refuse to save the file" },
        ],
        correct: "b",
        explanation:
          "The grid is what makes the data machine-readable. Excel can add every price because it knows which cells are the price column. Scatter the values and that ability disappears.",
        whyWrong: {
          a: "Tidiness is the visible symptom. The real cost is that every automated feature stops working: sorting, filtering and pivot tables all depend on the grid.",
          c: "File size is unaffected by where you type. The problem is structural, not storage.",
          d: "Excel will save it happily. That is precisely the danger, because nothing warns you.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "l6-cell-addresses": {
    lessonId: "l6-cell-addresses",
    passMark: 70,
    questions: [
      {
        id: "q6-1",
        type: "mcq",
        difficulty: 1,
        atomId: "a-cell-address",
        prompt: "What is the address of the cell where column D meets row 7?",
        options: [
          { id: "a", text: "7D" },
          { id: "b", text: "D7" },
          { id: "c", text: "D:7" },
          { id: "d", text: "7:D" },
        ],
        correct: "b",
        explanation:
          "Column letter first, then row number. Always D7, never 7D.",
        whyWrong: {
          a: "The order is reversed. Excel will not recognise 7D as an address at all.",
          c: "A colon means a range, as in D1:D7. On its own, D:7 is not valid.",
          d: "This is both reversed and using range syntax. Neither part is right.",
        },
      },
      {
        id: "q6-2",
        type: "mcq",
        difficulty: 2,
        atomId: "a-a-range",
        prompt: "What does B2:B500 mean?",
        options: [
          { id: "a", text: "B2 minus B500" },
          { id: "b", text: "Every cell in column B from row 2 down to row 500" },
          { id: "c", text: "Two cells only: B2 and B500" },
          { id: "d", text: "A rectangle 500 columns wide" },
        ],
        correct: "b",
        explanation:
          "The colon means through. It names a continuous block from the top-left corner to the bottom-right one. Here that is 499 cells in a single column.",
        whyWrong: {
          a: "That is what the hyphen does. B2-B500 subtracts, and it is a common typo that silently produces a wrong number.",
          c: "A comma names individual cells, as in B2,B500. The colon names everything in between as well.",
          d: "Column B is one column. The range runs down through rows, not across through columns.",
        },
      },
      {
        id: "q6-3",
        type: "mcq",
        difficulty: 2,
        atomId: "a-formula-bar",
        prompt:
          "Cell D2 displays 600,000. The formula bar shows =B2*C2. What does that tell you?",
        options: [
          { id: "a", text: "Someone typed 600,000 into D2" },
          {
            id: "b",
            text: "D2 calculates its value from B2 and C2, and updates when either changes",
          },
          { id: "c", text: "The cell is broken" },
          { id: "d", text: "D2 contains text, not a number" },
        ],
        correct: "b",
        explanation:
          "The cell shows the answer. The formula bar shows the working. Because the value is calculated, changing the price in B2 updates D2 automatically.",
        whyWrong: {
          a: "If it had been typed, the formula bar would show 600000 rather than a formula. That difference is exactly what the formula bar is for.",
          c: "Nothing is broken. This is Excel working as intended.",
          d: "A formula returning a product returns a number. Text would not multiply.",
        },
      },
      {
        id: "q6-4",
        type: "scenario",
        difficulty: 3,
        atomId: "a-formula-bar",
        prompt:
          "A cell displays 1,200 but your total is slightly off. Where do you look first, and why?",
        options: [
          { id: "a", text: "The Ribbon, to change the number format" },
          {
            id: "b",
            text: "The formula bar, because the cell may hold 1,200.4999 rounded for display, or text that only looks numeric",
          },
          { id: "c", text: "The Name Box, to confirm the address" },
          { id: "d", text: "Nowhere. A displayed number is always the stored number" },
        ],
        correct: "b",
        explanation:
          "What a cell displays and what it stores are different things. The formula bar shows the truth, which is why it is the first place to look when a total does not reconcile.",
        whyWrong: {
          a: "Changing the format changes only the display. If the underlying value is wrong or is text, formatting hides the problem rather than finding it.",
          c: "The Name Box tells you where you are, not what the cell contains.",
          d: "This assumption is the reason the total is off. Display and storage routinely differ.",
        },
      },
      {
        id: "q6-5",
        type: "mcq",
        difficulty: 1,
        atomId: "a-name-box",
        prompt: "You are lost around row 40,000. What is the fastest way back to A1?",
        options: [
          { id: "a", text: "Scroll up" },
          { id: "b", text: "Type A1 into the Name Box and press Enter" },
          { id: "c", text: "Close and reopen the workbook" },
          { id: "d", text: "Delete the rows above you" },
        ],
        correct: "b",
        explanation:
          "The Name Box is not only a display. Type any address into it and Excel jumps straight there. Ctrl+Home does the same thing.",
        whyWrong: {
          a: "It works eventually. Forty thousand rows is a long scroll when one keystroke would do it.",
          c: "That is slow, and you would lose any unsaved work.",
          d: "Never delete data to navigate. You would destroy 40,000 records just to move the cursor.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "l7-entering-data-properly": {
    lessonId: "l7-entering-data-properly",
    passMark: 70,
    questions: [
      {
        id: "q7-1",
        type: "mcq",
        difficulty: 2,
        atomId: "a-one-record-per-row",
        prompt:
          "Which layout will work correctly with sorting, filtering and pivot tables?",
        options: [
          {
            id: "a",
            text: "One column called Details containing “Musa did Ikeja in 28 mins”",
          },
          {
            id: "b",
            text: "Separate columns for Date, Rider, Area and Minutes, one delivery per row",
          },
          {
            id: "c",
            text: "One row per rider, with every delivery listed across the columns",
          },
          { id: "d", text: "Whichever is easiest to read" },
        ],
        correct: "b",
        explanation:
          "One record per row, one kind of fact per column. Every tool downstream assumes this shape, including pivot tables, Power BI and Pandas.",
        whyWrong: {
          a: "Everything is trapped in one text field. You cannot total the minutes or group by area without splitting it apart first.",
          c: "This spreads one kind of fact across many columns. Adding an eleventh delivery would mean adding a column, which no tool expects.",
          d: "Readability matters, but a layout a human likes and a layout a computer can use are often different. Here the computer comes first.",
        },
      },
      {
        id: "q7-2",
        type: "mcq",
        difficulty: 2,
        atomId: "a-headers-once",
        prompt:
          "Why should you not put a merged “SALES REPORT 2026” banner across row 1 above your headers?",
        options: [
          { id: "a", text: "It uses too much memory" },
          {
            id: "b",
            text: "Excel expects a single header row at the top, so it treats your real headers as data",
          },
          { id: "c", text: "Merged cells are not allowed in Excel" },
          { id: "d", text: "It only matters when printing" },
        ],
        correct: "b",
        explanation:
          "Sorting, filtering and pivot tables all look for column names in the first row. A decorative banner pushes the real headers down and breaks all three. Put the title in the sheet name instead.",
        whyWrong: {
          a: "Memory is not the issue. The problem is structural.",
          c: "They are allowed, which is why this trap catches so many people. Excel lets you do it and then quietly misbehaves.",
          d: "It affects every automated feature on screen, long before anything is printed.",
        },
      },
      {
        id: "q7-3",
        type: "scenario",
        difficulty: 3,
        atomId: "a-consistency",
        prompt:
          "The company delivers to 6 areas, but grouping your sheet by Area produces 14 distinct values. What happened, and where do you fix it?",
        options: [
          { id: "a", text: "The company expanded, so accept the 14" },
          {
            id: "b",
            text: "Inconsistent entry split 6 real areas into 14. Fix it in the Clean step before analysing",
          },
          { id: "c", text: "Excel has a bug" },
          { id: "d", text: "Re-enter the entire dataset from scratch" },
        ],
        correct: "b",
        explanation:
          "Spelling variants, stray spaces and capitalisation have split real areas apart. This is the Ikeja problem. It belongs in step 2, Clean, before a single conclusion is drawn.",
        whyWrong: {
          a: "Accepting them means every grouped total is wrong, and nothing on screen will tell you.",
          c: "Excel is behaving correctly. “Ikeja” and “ikeja ” genuinely are different text values.",
          d: "Far too drastic. Cleaning tools fix this in minutes, and retyping risks new errors.",
        },
      },
      {
        id: "q7-4",
        type: "mcq",
        difficulty: 2,
        atomId: "a-numbers-as-numbers",
        prompt:
          "Your SUM over a column of prices returns 0. The values are visible and sit on the left of their cells. What is wrong?",
        options: [
          { id: "a", text: "The formula is written incorrectly" },
          {
            id: "b",
            text: "The values are text rather than numbers, and the left alignment is the clue",
          },
          { id: "c", text: "The column is hidden" },
          { id: "d", text: "SUM cannot handle more than 100 cells" },
        ],
        correct: "b",
        explanation:
          "Excel puts real numbers on the right and text on the left by default. Values typed with a currency symbol or a stray space become text, and SUM ignores text, so it returns 0.",
        whyWrong: {
          a: "Possible in general, but the left alignment points squarely at a data type problem rather than a syntax one.",
          c: "A hidden column still totals normally. Hiding affects display, not calculation.",
          d: "SUM handles hundreds of thousands of cells without difficulty.",
        },
      },
      {
        id: "q7-5",
        type: "scenario",
        difficulty: 3,
        atomId: "a-no-blank-rows",
        prompt:
          "You sort a 500-row sheet and only the first 200 rows move. What is almost certainly wrong?",
        options: [
          { id: "a", text: "Excel limits sorting to 200 rows" },
          {
            id: "b",
            text: "There is a blank row around row 201, and Excel treated it as the end of the table",
          },
          { id: "c", text: "The remaining rows are locked" },
          { id: "d", text: "The file is corrupted" },
        ],
        correct: "b",
        explanation:
          "Excel decides where your data ends by looking for the first fully blank row. One left in for visual separation will silently cut your table in half.",
        whyWrong: {
          a: "There is no such limit. Excel sorts a million rows without complaint.",
          c: "Locked cells produce a warning message. This failure is silent, which points to the table boundary problem.",
          d: "A corrupt file usually will not open at all. This one is working. It simply disagrees with you about where the data stops.",
        },
      },
    ],
  },
};

export default ASSESSMENTS;
