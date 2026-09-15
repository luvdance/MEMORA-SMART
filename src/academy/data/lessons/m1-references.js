/**
 * MODULE · FORMULAS & CORE FUNCTIONS (m1-formulas-functions)
 * Lesson 2 — "Relative and Absolute References"
 *
 * Placed immediately after the first formula, because every later lesson
 * depends on it. A learner who does not understand what $ does cannot build a
 * percentage-share column, cannot lock a lookup range, and will produce a
 * column of #DIV/0! the first time they fill a formula down.
 *
 * ── EXAM ALIGNMENT ────────────────────────────────────────────────────────
 * Maps to Microsoft Office Specialist: Excel Associate (MO-210), objective
 * "Perform calculations by using formulas and functions", specifically
 * inserting references in formulas and using relative, absolute and mixed
 * cell references. Also underpins PL-300 data modelling, where the same
 * absolute/relative thinking reappears as row context.
 * ──────────────────────────────────────────────────────────────────────────
 *
 * CLIENT-SAFE. Knowledge-check answers live in lib/academy/assessments/.
 */

export const SECTION_ID = "s3-formulas";

/** Regional sales, used for the share-of-total work. Total is 2,000,000. */
const SHARE = {
  A1: "Region", B1: "Sales", C1: "Share",
  A2: "Lagos", B2: 900000,
  A3: "Abuja", B3: 500000,
  A4: "Kano", B4: 360000,
  A5: "Port Harcourt", B5: 240000,
  A6: "TOTAL", B6: "=SUM(B2:B5)",
};

export const LESSONS = [
  {
    id: "l21-references",
    moduleId: "m1-formulas-functions",
    sectionId: SECTION_ID,
    order: 2,
    title: "Relative and Absolute References",
    subtitle: "The dollar sign, and why your filled column breaks without it",
    estimatedMinutes: 15,
    examObjectives: [
      "MO-210 · Insert references in formulas",
      "MO-210 · Use relative, absolute and mixed references",
    ],
    intro:
      "This is the concept that separates people who can write a formula from people who can build a spreadsheet. It takes fifteen minutes to learn and it will save you from the single most common error in Excel.",

    atoms: [
      {
        id: "a-what-copying-does",
        title: "What happens when you copy a formula",
        explain:
          "Excel does not remember that D2 contains \"=B2*C2\". It remembers \"multiply the cell two to my left by the cell one to my left\". Copy that to D3 and it applies the same instruction from the new position, which reads as =B3*C3.",
        why: "Once you see a formula as a set of DIRECTIONS rather than a set of addresses, everything about copying, filling and the dollar sign follows from it. Without that model, references shifting looks like Excel misbehaving.",
        analogy:
          "It is like telling someone \"the shop is two streets left\". Give the same instruction to a person standing somewhere else and they arrive somewhere else. That is a relative reference. \"The shop is at 14 Awolowo Road\" works from anywhere. That is absolute.",
        table: {
          caption: "The same formula, copied down.",
          headers: ["Cell", "Shows", "The instruction Excel stored"],
          rows: [
            ["D2", "=B2*C2", "Two left, times one left"],
            ["D3", "=B3*C3", "The same instruction, new position"],
            ["D4", "=B4*C4", "The same instruction again"],
          ],
        },
      },
      {
        id: "a-relative-reference",
        title: "Relative references, the default",
        explain:
          "A plain reference like B2 is relative. It shifts when the formula is copied, in whatever direction you copied it. Down one row, the row number rises by one. Right one column, the letter advances by one.",
        why: "This is what you want almost all of the time, and it is why one formula can serve four hundred rows. If references never moved, filling down would put the same answer in every row.",
        exercise: {
          data: {
            A1: "Product", B1: "Price", C1: "Qty", D1: "Total",
            A2: "Rice", B2: 1200, C2: 500, D2: "=B2*C2",
            A3: "Garri", B3: 800, C3: 320,
            A4: "Milk", B4: 450, C4: 210,
          },
          rows: 5,
          cols: 4,
          allowFill: true,
          target: "D4",
          expected: 94500,
          mustUseFormula: true,
          task: "D2 holds =B2*C2. Select D2 and press Fill down, then click D4 and read the formula bar to see what Excel wrote there.",
          hint: "Select D2 first. The Fill down button is above the grid.",
          successMessage:
            "D4 holds =B4*C4. You wrote one formula and Excel adjusted it for every row. That is a relative reference doing its job.",
        },
      },
      {
        id: "a-absolute-reference",
        title: "Absolute references, and the $",
        explain:
          "A dollar sign locks a part of a reference so it cannot move. $B$2 stays pointing at B2 however far you copy it. The first $ locks the column, the second locks the row.",
        why: "The moment a formula needs to refer to ONE fixed cell for every row, a tax rate, an exchange rate, a grand total, a relative reference will slide off it and your column fills with wrong answers or errors.",
        table: {
          caption: "Filling =B2*E1 down, with and without locking.",
          headers: ["Written as", "In row 3 becomes", "Result"],
          rows: [
            ["=B2*E1", "=B3*E2", "Wrong. E2 is not the rate"],
            ["=B2*$E$1", "=B3*$E$1", "Correct. The rate stays put"],
          ],
        },
        example:
          "Press F4 while the cursor is on a reference to cycle through the four states:\n\n  B2  ->  $B$2  ->  B$2  ->  $B2  ->  back to B2\n\nThat is far quicker than typing the dollar signs by hand.",
        mistake:
          "Adding dollar signs to everything to be safe. Lock only what must not move. Locking a reference that should shift means every row calculates the first row's answer, which looks plausible and is completely wrong.",
      },
      {
        id: "a-mixed-reference",
        title: "Mixed references",
        explain:
          "You can lock just one half. $B2 keeps the column fixed and lets the row move. B$2 keeps the row fixed and lets the column move.",
        why: "This is what makes a multiplication grid or a cross-tab work: one formula written once in the corner and filled across AND down. The column reference locks to the row labels, the row reference locks to the column headers, and every cell in the grid computes correctly.",
        table: {
          caption: "The four states of a reference.",
          headers: ["Written", "Column", "Row", "Use it for"],
          rows: [
            ["B2", "Moves", "Moves", "The normal case"],
            ["$B$2", "Locked", "Locked", "One fixed cell: a rate, a total"],
            ["$B2", "Locked", "Moves", "Filling across, reading down one column"],
            ["B$2", "Moves", "Locked", "Filling down, reading across one row"],
          ],
        },
      },
      {
        id: "a-locking-ranges",
        title: "Locking a range inside a function",
        explain:
          "A range takes dollar signs the same way a single cell does. =SUM($B$2:$B$5) refers to that block of cells no matter where the formula is copied. Without the locks it becomes =SUM(B3:B6) one row down, quietly shifting off the bottom of your data.",
        why: "Any function that compares each row against a fixed list needs this: SUMIF, COUNTIF, AVERAGEIF, VLOOKUP and XLOOKUP all take a range that must stay still while the row being tested moves. It is the most common reason a lookup works in the first row and fails in every row below.",
        table: {
          caption: "A COUNTIF filled down, with and without a locked range.",
          headers: ["Row", "=COUNTIF(B2:B5,A2)", "=COUNTIF($B$2:$B$5,A2)"],
          rows: [
            ["2", "Searches B2:B5", "Searches B2:B5"],
            ["3", "Searches B3:B6", "Searches B2:B5"],
            ["4", "Searches B4:B7", "Searches B2:B5"],
          ],
          note: "In the left column the search window slides down and the answers become nonsense. The right column always searches the same list.",
        },
        mistake:
          "Writing a lookup that works perfectly in the first row and returns #N/A further down. The range slid. Lock it.",
      },
      {
        id: "a-percentage-share",
        title: "Percentage share, where a group divides 100%",
        explain:
          "When several rows together make up a whole, each row's share is its value divided by the total of all of them. Lagos sold 900,000 out of 2,000,000, so Lagos is 900000/2000000, which is 0.45, displayed as 45%.",
        why: "Share-of-total is one of the most requested figures in business: market share, share of revenue by region, share of spend by category, percentage of a budget used. It is also the textbook reason absolute references exist, because the total must stay locked while the numerator moves down the column.",
        table: {
          caption: "Four regions dividing one 100%.",
          headers: ["Region", "Sales", "Formula", "Share"],
          rows: [
            ["Lagos", "900,000", "=B2/$B$6", "45%"],
            ["Abuja", "500,000", "=B3/$B$6", "25%"],
            ["Kano", "360,000", "=B4/$B$6", "18%"],
            ["Port Harcourt", "240,000", "=B5/$B$6", "12%"],
            ["TOTAL", "2,000,000", "", "100%"],
          ],
          note: "The numerator changes every row. The denominator never does. That is exactly what $B$6 expresses. The shares must add to 100%, and if they do not, your total is wrong or a row is missing.",
        },
        mistake:
          "Writing =B2/B6 and filling down. Row 3 becomes =B3/B7, which divides by an empty cell and gives #DIV/0!. The first row looks right, which is why the error survives to the report.",
        exercise: {
          data: { ...SHARE },
          rows: 7,
          cols: 3,
          allowFill: true,
          target: "C2",
          expected: 0.45,
          mustUseFormula: true,
          mustFormat: "percent",
          lockedCells: ["A2", "B2", "A6", "B6"],
          task: "In C2, work out Lagos's share of total sales. Lock the total so the formula would survive being filled down, then format C2 as a percentage.",
          hint: "The total is in B6. Lock it with dollar signs, or press F4 while the cursor is on it.",
          successMessage:
            "45%. Because you locked B6, filling this down gives 25%, 18% and 12%, and the four add to exactly 100%.",
        },
      },
      {
        id: "a-open-excel-refs",
        title: "Now do it in the real Excel",
        explain:
          "This simulator teaches the idea. Excel itself has the fill handle, the F4 key and the keyboard shortcuts you will actually use at work.",
        why: "An employer will not ask whether you understand absolute references. They will watch you build something. Muscle memory only comes from the real application, and the concepts you have just learned transfer exactly.",
        example:
          "Open Excel, or Google Sheets, or LibreOffice Calc, and spend ten minutes:\n\n  1. Type four numbers in B2:B5 and a =SUM in B6.\n  2. In C2 write =B2/B6 and fill it down. Watch it break.\n  3. Change it to =B2/$B$6 and fill again. Watch it work.\n  4. Select C2:C5 and press Ctrl+Shift+% to format as percentages.\n  5. Put your cursor on a reference and press F4 four times.\n\nDoing this once in the real application is worth more than reading it three times.",
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
