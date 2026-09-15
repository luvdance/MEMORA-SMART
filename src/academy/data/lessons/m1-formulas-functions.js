/**
 * MODULE · FORMULAS & CORE FUNCTIONS (m1-formulas-functions)
 * Section 1 — "Making Excel Do the Work"
 *
 * The first module where the learner types formulas rather than reading about
 * them. Most atoms carry an `exercise`: a live grid, a task, and an expected
 * result the app checks with the same engine that powers the cells.
 *
 * EXERCISE SHAPE
 *   data            the starting sheet, { A1: "Product", B2: 1200, ... }
 *   rows / cols     grid size
 *   target          the cell the learner must fill in
 *   expected        the value their formula must produce
 *   mustUseFormula  reject a typed-in constant
 *   mustUse         require a named function, e.g. "SUM"
 *   lockedCells     cells they may not edit
 *   hint            shown when the answer is wrong
 *
 * Checking is by RESULT, not by string, so =B2*C2 and =C2*B2 both pass.
 *
 * CLIENT-SAFE. Answers to knowledge checks live in lib/academy/assessments/.
 * House style is documented in m1-data-foundations.js.
 */

export const SECTION_ID = "s3-formulas";

/** The shop sheet reused across the module, so the data stays familiar. */
const SHOP = {
  A1: "Product", B1: "Price", C1: "Qty", D1: "Total",
  A2: "Rice", B2: 1200, C2: 500,
  A3: "Garri", B3: 800, C3: 320,
  A4: "Milk", B4: 450, C4: 210,
  A5: "Biscuits", B5: 150, C5: 90,
};

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════ */
  {
    id: "l8-your-first-formula",
    moduleId: "m1-formulas-functions",
    sectionId: SECTION_ID,
    order: 1,
    title: "Your First Formula",
    subtitle: "The equals sign changes everything",
    estimatedMinutes: 9,
    intro:
      "Until now you have been typing facts into cells. A formula is different: it tells Excel to work something out. There is a working spreadsheet in this lesson, so you will be typing real formulas and seeing real answers, mistakes included.",

    atoms: [
      {
        id: "a-equals-sign",
        title: "Everything starts with =",
        explain:
          "Type 1200 into a cell and Excel stores the number 1200. Type =1000+200 and Excel stores a calculation and shows you 1200. The equals sign is what tells Excel to stop reading and start calculating.",
        why: "Forget the equals sign and Excel treats your formula as text. The cell will literally display SUM(B2:B5) instead of a number, sitting on the left of the cell like any other text.",
        exercise: {
          data: { A1: "Type a formula in B1", B1: "" },
          rows: 3,
          cols: 2,
          target: "B1",
          expected: 1400,
          mustUseFormula: true,
          task: "Double-click cell B1 and make Excel calculate 1200 + 200. Do not type the answer: write it as a formula.",
          hint: "Start with = then the sum, like =1000+400.",
          successMessage:
            "That is a formula. Notice the cell shows the answer while the formula bar above still shows what you typed.",
        },
      },
      {
        id: "a-operators",
        title: "The operators",
        explain:
          "Excel uses + to add, - to subtract, * to multiply, / to divide and ^ for powers. The asterisk is multiplication, not the letter x.",
        why: "Typing 5 x 3 gives an error because Excel does not know what x means. This trips up almost everyone once.",
        table: {
          caption: "The five you will use constantly.",
          headers: ["Symbol", "Does", "Example", "Result"],
          rows: [
            ["+", "Add", "=200+150", "350"],
            ["-", "Subtract", "=200-150", "50"],
            ["*", "Multiply", "=200*3", "600"],
            ["/", "Divide", "=600/3", "200"],
            ["^", "Power", "=5^2", "25"],
          ],
        },
        mistake:
          "Using x for multiplication. Excel will show #NAME? because it thinks x is a name it does not recognise.",
      },
      {
        id: "a-cell-refs-in-formulas",
        title: "Point at cells, do not retype numbers",
        explain:
          "Instead of =1200*500 you write =B2*C2. Excel looks up whatever is in those cells and multiplies them.",
        why: "This is the single habit that makes a spreadsheet worth building. Change the price in B2 and every formula that pointed at it updates by itself. Retype the number instead and you will be hunting for stale figures for the rest of your life.",
        exercise: {
          data: { ...SHOP },
          rows: 6,
          cols: 4,
          target: "D2",
          expected: 600000,
          mustUseFormula: true,
          lockedCells: ["A1", "B1", "C1", "D1", "A2", "B2", "C2"],
          task: "The shop sheet is below. In cell D2, work out the total value of the rice stock by multiplying its price by its quantity. Point at the cells rather than typing the numbers.",
          hint: "The price is in B2 and the quantity is in C2.",
          successMessage:
            "Exactly. Now change B2 to a different price and watch D2 update on its own.",
        },
      },
      {
        id: "a-order-of-operations",
        title: "Excel does multiplication before addition",
        explain:
          "=2+3*4 gives 14, not 20, because multiplication happens first. Brackets override that: =(2+3)*4 gives 20.",
        why: "Most wrong answers in a spreadsheet are not typing errors, they are missing brackets. When a total looks odd, check the order before you check the data.",
        exercise: {
          data: { A1: "Give me 20 using 2, 3 and 4", B1: "" },
          rows: 3,
          cols: 2,
          target: "B1",
          expected: 20,
          mustUseFormula: true,
          task: "In B1, write a formula using 2, 3 and 4 that returns 20. You will need brackets.",
          hint: "=2+3*4 gives 14. Force the addition to happen first.",
          successMessage: "Brackets first, then the multiplication. That is the whole rule.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  {
    id: "l9-core-functions",
    moduleId: "m1-formulas-functions",
    sectionId: SECTION_ID,
    order: 2,
    title: "The Functions You Will Use Every Day",
    subtitle: "SUM, AVERAGE, MIN, MAX, COUNT",
    estimatedMinutes: 12,
    intro:
      "A function is a ready-made formula with a name. Five of them cover most of what an analyst does in a week, and you will type every one of them in this lesson.",

    atoms: [
      {
        id: "a-what-is-a-function",
        title: "What a function is",
        explain:
          "A function has a name, then brackets, then what it should work on. =SUM(B2:B5) means add up everything from B2 to B5.",
        why: "You could write =B2+B3+B4+B5 instead. With four cells that is fine. With four hundred it is not, and adding a row later would silently break it.",
        table: {
          caption: "The anatomy of a function.",
          headers: ["Part", "In =SUM(B2:B5)", "What it means"],
          rows: [
            ["Equals sign", "=", "This cell calculates something"],
            ["Name", "SUM", "Which job to do"],
            ["Brackets", "( )", "What to do it on goes inside"],
            ["Argument", "B2:B5", "The range to add up"],
          ],
        },
      },
      {
        id: "a-sum",
        title: "SUM",
        explain: "Adds every number in a range and ignores any text or blank cells it finds.",
        why: "It is the most used function in Excel by a wide margin. Every total you have ever seen in a report started here.",
        exercise: {
          data: { ...SHOP, A7: "Total stock value", D2: "=B2*C2", D3: "=B3*C3", D4: "=B4*C4", D5: "=B5*C5" },
          rows: 8,
          cols: 4,
          target: "D7",
          expected: 964000,
          mustUseFormula: true,
          mustUse: "SUM",
          lockedCells: ["D2", "D3", "D4", "D5"],
          task: "Column D already holds the total for each product. In D7, use SUM to add up all four totals.",
          hint: "The totals run from D2 down to D5.",
          successMessage:
            "₦964,000 of stock. Adding a fifth product row inside that range would be picked up automatically.",
        },
      },
      {
        id: "a-average",
        title: "AVERAGE",
        explain:
          "Adds the numbers and divides by how many there were. =AVERAGE(B2:B5) gives the mean price.",
        why: "It quietly ignores empty cells rather than counting them as zero, which is almost always what you want and is the opposite of what a hand-written division would do.",
        exercise: {
          data: { ...SHOP, A7: "Average price" },
          rows: 8,
          cols: 4,
          target: "B7",
          expected: 650,
          mustUseFormula: true,
          mustUse: "AVERAGE",
          task: "In B7, work out the average price across the four products.",
          hint: "The prices are in B2 to B5.",
          successMessage:
            "650. Try it the long way with =(B2+B3+B4+B5)/4 and you will get the same number, with more places to go wrong.",
        },
      },
      {
        id: "a-min-max",
        title: "MIN and MAX",
        explain:
          "MIN returns the smallest number in a range and MAX the largest. =MAX(C2:C5) tells you the biggest quantity you stock.",
        why: "They are how you find the extremes without sorting the whole sheet, which matters once a sort would disturb other people's formulas.",
        exercise: {
          data: { ...SHOP, A7: "Cheapest product price" },
          rows: 8,
          cols: 4,
          target: "B7",
          expected: 150,
          mustUseFormula: true,
          mustUse: "MIN",
          task: "In B7, find the price of the cheapest product.",
          hint: "MIN works on the same price range, B2 to B5.",
          successMessage: "150, the biscuits. MAX would have given you 1200.",
        },
      },
      {
        id: "a-count-counta",
        title: "COUNT and COUNTA, which are not the same",
        explain:
          "COUNT counts cells containing numbers. COUNTA counts cells that are not empty, whatever is in them.",
        why: "This is a favourite exam question and a common real-world bug. Run COUNT down a column of product names and you get 0, because names are not numbers.",
        table: {
          caption: "Same range, different answers.",
          headers: ["Range", "Holds", "COUNT", "COUNTA"],
          rows: [
            ["A2:A5", "Four product names", "0", "4"],
            ["B2:B5", "Four prices", "4", "4"],
            ["A2:A8", "Four names, three blanks", "0", "4"],
          ],
        },
        exercise: {
          data: { ...SHOP, A7: "How many products?" },
          rows: 8,
          cols: 4,
          target: "B7",
          expected: 4,
          mustUseFormula: true,
          mustUse: "COUNTA",
          task: "In B7, count how many products are listed. The names are in column A, so choose your function carefully.",
          hint: "Names are text. COUNT only counts numbers.",
          successMessage:
            "COUNTA is right, because product names are text. COUNT would have returned 0 here.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  {
    id: "l10-if-and-errors",
    moduleId: "m1-formulas-functions",
    sectionId: SECTION_ID,
    order: 5,
    title: "IF, and What Excel Does When Things Go Wrong",
    subtitle: "Making a cell decide, and reading error codes",
    estimatedMinutes: 11,
    intro:
      "So far every formula has done the same thing every time. IF lets a cell decide for itself. Then we will deliberately break some formulas, because knowing what each error code means saves hours later.",

    atoms: [
      {
        id: "a-if",
        title: "IF",
        explain:
          "IF asks a question and gives one answer when it is true and another when it is false. =IF(C2<100,\"Reorder\",\"OK\") checks whether the quantity is under 100.",
        why: "It turns a sheet of numbers into something that tells you what to do. A stock list with a Reorder column is useful to a shopkeeper; a stock list of quantities is homework.",
        table: {
          caption: "The three parts, separated by commas.",
          headers: ["Part", "In the example", "Means"],
          rows: [
            ["The question", "C2<100", "Is the quantity under 100?"],
            ["If yes", '"Reorder"', "Show this when true"],
            ["If no", '"OK"', "Show this when false"],
          ],
        },
        exercise: {
          data: { ...SHOP, D1: "Status" },
          rows: 6,
          cols: 4,
          target: "D5",
          expected: "Reorder",
          mustUseFormula: true,
          mustUse: "IF",
          task: "Biscuits are down to 90 units. In D5, write a formula that shows Reorder when the quantity in C5 is below 100, and OK otherwise.",
          hint: 'Text needs quote marks: =IF(C5<100,"Reorder","OK")',
          successMessage:
            "Now copy that idea down the column and the sheet tells you what to buy.",
        },
      },
      {
        id: "a-error-codes",
        title: "Reading Excel's error codes",
        explain:
          "When Excel cannot work something out it shows a short code starting with a hash. Each one means something specific.",
        why: "An error is Excel telling you precisely what went wrong. Learning four codes turns a frustrating afternoon into a thirty-second fix.",
        table: {
          caption: "The four you will meet first.",
          headers: ["Code", "Means", "Usual cause"],
          rows: [
            ["#DIV/0!", "You divided by zero", "The divisor cell is empty or zero"],
            ["#NAME?", "Excel does not recognise a name", "A misspelled function, or x used for multiply"],
            ["#VALUE!", "Wrong kind of value", "Doing arithmetic on text"],
            ["#REF!", "The reference is gone", "A row or column the formula used was deleted"],
          ],
        },
        exercise: {
          data: { A1: "Sales", B1: "Days", C1: "Per day", A2: 5000, B2: 0 },
          rows: 4,
          cols: 3,
          target: "C2",
          expected: "#DIV/0!",
          mustUseFormula: true,
          task: "Divide the sales in A2 by the days in B2, in cell C2. B2 is zero, so this will fail on purpose. Write the formula and see which error Excel gives.",
          hint: "=A2/B2. The point of this exercise is the error, not the answer.",
          successMessage:
            "#DIV/0!. In a real sheet you would wrap it: =IF(B2=0,\"No data\",A2/B2).",
        },
      },
      {
        id: "a-formula-vs-display",
        title: "What the cell holds is not what the cell shows",
        explain:
          "A cell displaying 600,000 might hold the number, or it might hold =B2*C2. Click it and read the formula bar to find out which.",
        why: "This is how you audit someone else's spreadsheet. A hard-typed number that looks calculated is the most common way a report goes quietly wrong.",
        sheet: {
          data: {
            A1: "Typed", B1: "Calculated",
            A2: 600000, B2: "=1200*500",
            A3: "Click each and read the bar above",
          },
          rows: 4,
          cols: 2,
        },
        practice: {
          prompt:
            "Both cells show 600000. Click A2, then B2, and watch the formula bar. What is the difference, and why does it matter?",
          answer:
            "A2 holds a typed number and will never change. B2 holds a calculation and updates when its inputs do. If the price changes, A2 becomes silently wrong while B2 stays correct.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
