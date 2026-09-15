/**
 * MODULE · EXCEL ESSENTIALS (m1-excel-essentials)
 * Section 1 — "Meeting Excel"
 *
 * Written in the same voice as the Week 1 material: Nigerian context, a
 * concrete scenario first, the vocabulary second. The learner has not opened
 * Excel before this module, so nothing is assumed, not even what a spreadsheet
 * is for.
 *
 * CLIENT-SAFE. Answers live in lib/academy/assessments/.
 * House style and the atom shape are documented in m1-data-foundations.js.
 */

export const SECTION_ID = "s2-meeting-excel";

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════ */
  {
    id: "l5-what-excel-is-for",
    moduleId: "m1-excel-essentials",
    sectionId: SECTION_ID,
    order: 1,
    title: "What Excel Is Actually For",
    subtitle: "The notebook, upgraded",
    estimatedMinutes: 7,
    intro:
      "You already met the shopkeeper with her notebook. Excel is that notebook, except it can add up a column in an instant, sort three years of sales in one click, and never makes an arithmetic mistake. Everything in this module is about making that swap.",

    atoms: [
      {
        id: "a-excel-is-a-grid",
        title: "Excel is a grid, and that is the whole idea",
        explain:
          "Open Excel and you get a grid of empty boxes. That is deliberate. The shopkeeper's notebook had invisible columns. She wrote the product in roughly the same place on each line and the price on the right. Excel simply makes those columns real.",
        why: "Once the columns are real, the computer can work with them. It can add every number in the price column because it knows which boxes are the price column. The notebook could never do that.",
        analogy:
          "A notebook is a pile of sentences. A spreadsheet is a table where every row means the same kind of thing.",
        mistake:
          "Treating Excel like a blank page and typing wherever there is space. The grid only helps if you respect it. One kind of thing per column, one record per row.",
      },
      {
        id: "a-workbook",
        title: "The workbook",
        explain:
          "A workbook is the file itself. The thing you save, email and open. When someone sends you an .xlsx file, they have sent you a workbook.",
        why: "Getting the vocabulary right early saves confusion later, because a workbook and a worksheet are different things and people use the words interchangeably when they should not.",
        example:
          "Sales_2026.xlsx is one workbook.\nIt might contain twelve months of data, but it is still one file.",
      },
      {
        id: "a-worksheet",
        title: "The worksheet",
        explain:
          "A worksheet, also called a sheet or a tab, is one page inside the workbook. Look at the bottom of the Excel window and you will see the tabs: Sheet1, Sheet2, and so on. You can rename them, add more, and delete them.",
        why: "Sheets are how you keep one file organised instead of ten files scattered across a folder. One workbook with one sheet per month is far easier to manage than twelve separate files.",
        table: {
          caption: "One workbook, many worksheets.",
          headers: ["Level", "Name", "What it is"],
          rows: [
            ["Workbook", "Sales_2026.xlsx", "The file you save and send"],
            ["Worksheet", "January", "One tab inside that file"],
            ["Worksheet", "February", "Another tab in the same file"],
            ["Worksheet", "March", "And another"],
          ],
        },
        mistake:
          "Creating a new workbook for every month. You then cannot compare months without opening twelve windows. Sheets exist precisely to avoid this.",
        practice: {
          prompt:
            "A colleague says \"send me the worksheet.\" What should you actually ask them?",
          answer:
            "Whether they want the whole file, which is the workbook, or just the data from one tab, which is a worksheet. They usually mean the file, but the distinction matters once a workbook has twelve sheets in it.",
        },
      },
      {
        id: "a-rows-columns-cells",
        title: "Rows, columns and cells",
        explain:
          "Columns run down and are labelled with letters: A, B, C. Rows run across and are numbered: 1, 2, 3. A cell is a single box, where one column meets one row.",
        why: "Every single thing you will do in Excel happens in a cell or a group of cells. This is the atom of the entire tool.",
        table: {
          caption: "Every box is named by its column letter and its row number.",
          variant: "spreadsheet",
          headers: ["", "", ""],
          rows: [
            ["A1", "B1", "C1"],
            ["A2", "B2", "C2"],
            ["A3", "B3", "C3"],
          ],
          note: "Read down for the column letter, across for the row number. B2 sits where column B meets row 2.",
        },
        analogy:
          "It is the same system as seats in a cinema or a stadium. Row 14, seat C. Only one seat matches both.",
        mistake:
          "Mixing up rows and columns when speaking to someone. Columns are lettered and vertical. Rows are numbered and horizontal. Say the wrong one and the person on the other end fixes the wrong thing.",
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  {
    id: "l6-cell-addresses",
    moduleId: "m1-excel-essentials",
    sectionId: SECTION_ID,
    order: 2,
    title: "Cell Addresses",
    subtitle: "How Excel knows what you mean",
    estimatedMinutes: 7,
    intro:
      "Every cell has a name, and that name is how you talk to Excel. Get comfortable here and formulas will feel obvious later, because a formula is nothing more than a sentence made of cell addresses.",

    atoms: [
      {
        id: "a-cell-address",
        title: "The cell address",
        explain:
          "A cell address is its column letter followed by its row number. The cell where column B meets row 4 is called B4. Always the letter first, then the number.",
        why: "This is how you refer to a value without retyping it. Instead of writing ₦1,200 into a formula, you point at the cell that already holds it. When the price changes, everything that used it updates by itself.",
        table: {
          variant: "spreadsheet",
          caption: "A small sheet. B2 holds 1200 and C2 holds 500.",
          headers: ["Product", "Price", "Qty"],
          rows: [
            ["Rice", "1200", "500"],
            ["Garri", "800", "320"],
          ],
        },
        practice: {
          prompt:
            "In the sheet above, which cell holds the word \"Qty\", and which holds 500?",
          answer:
            "C1 holds \"Qty\", because it is column C, row 1. C2 holds 500, the same column one row down.",
        },
      },
      {
        id: "a-a-range",
        title: "A range",
        explain:
          "A range is a block of cells, written as the top-left corner, a colon, then the bottom-right corner. B2:B50 means every cell from B2 down to B50. A1:C10 means a rectangle three columns wide and ten rows deep.",
        why: "You almost never add up one cell. You add up a column of three hundred prices, and a range is how you say \"all of those\" in four characters.",
        table: {
          caption: "The same three cells, written three different ways.",
          headers: ["You write", "Excel reads it as", "How many cells"],
          rows: [
            ["B2:B4", "B2 through B4, everything in between", "3"],
            ["B2,B4", "B2 and B4 only, skipping B3", "2"],
            ["B2-B4", "B2 minus B4, a subtraction", "0 (it is a calculation)"],
          ],
          note: "The third one is the typo that costs people an afternoon. It returns a number, so nothing looks broken.",
        },
        example: "=SUM(B2:B500) adds every price from row 2 to row 500.",
        mistake:
          "Writing B2-B50 with a hyphen instead of B2:B50 with a colon. The hyphen means subtract, so Excel will quietly calculate something completely different.",
      },
      {
        id: "a-name-box",
        title: "The Name Box",
        explain:
          "The small box just above column A, on the left. It always shows the address of the cell you have selected. Click any cell and watch it change.",
        why: "It is the fastest way to confirm where you actually are, and in a sheet with 50,000 rows that matters. You can also type an address into it and press Enter to jump straight there.",
        practice: {
          prompt:
            "You are lost somewhere around row 40,000. How do you get back to the top instantly?",
          answer:
            "Type A1 into the Name Box and press Enter. Ctrl+Home does the same thing.",
        },
      },
      {
        id: "a-formula-bar",
        title: "The Formula Bar",
        explain:
          "The long bar across the top, to the right of the Name Box. It shows what is really inside the selected cell, which is not always what the cell displays.",
        why: "This is the single most useful diagnostic tool in Excel. A cell might display 1,200 while the formula bar shows =B2*C2. The cell shows the answer. The formula bar shows the working.",
        table: {
          caption: "What the cell shows is not always what the cell holds.",
          headers: ["Cell", "Displays", "Formula bar shows", "Meaning"],
          rows: [
            ["D2", "600,000", "=B2*C2", "Calculated. Updates when B2 or C2 changes"],
            ["D3", "600,000", "600000", "Typed by hand. Will never update"],
            ["D4", "1,200", "1200.4999", "Rounded for display only"],
          ],
        },
        mistake:
          "Trusting what a cell displays. A cell showing 1,200 might contain 1,200.4999 rounded for display, or text that merely looks like a number. The formula bar tells you the truth.",
      },
      {
        id: "a-the-ribbon",
        title: "The Ribbon",
        explain:
          "The wide strip of buttons across the top, organised into tabs: Home, Insert, Page Layout, Formulas, Data, Review, View. Everything Excel can do lives under one of those tabs.",
        why: "You do not need to memorise it. You need to know that Data holds sorting and filtering, Insert holds charts and pivot tables, and Home holds formatting. That is about 90% of what you will use for the next two months.",
        table: {
          caption: "Where to look, by the kind of job you are doing.",
          headers: ["Tab", "Holds", "You will use it for"],
          rows: [
            ["Home", "Formatting, sorting shortcuts", "Almost everything, daily"],
            ["Insert", "Charts, pivot tables, images", "Months 1 and 2"],
            ["Data", "Sort, filter, remove duplicates", "Every cleaning job"],
            ["Formulas", "Function library, auditing", "Tracing a wrong result"],
            ["View", "Freeze panes, zoom", "Large sheets"],
          ],
        },
        mistake:
          "Hunting through every tab for a feature. Read the tab names first. They are grouped by what you are trying to do, and the right one is usually obvious once you ask what kind of job this is.",
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  {
    id: "l7-entering-data-properly",
    moduleId: "m1-excel-essentials",
    sectionId: SECTION_ID,
    order: 3,
    title: "Entering Data Without Creating a Mess",
    subtitle: "The habits that save you weeks later",
    estimatedMinutes: 9,
    intro:
      "Remember that cleaning is 60 to 70% of an analyst's work. A large share of that work exists because someone entered the data carelessly. This lesson is about being the person who does not cause that.",

    atoms: [
      {
        id: "a-one-record-per-row",
        title: "One record per row, one thing per column",
        explain:
          "Every row should describe one complete thing. One sale, one delivery, one student. Every column should hold one kind of fact about it: the date, the amount, the area.",
        why: "Every tool you will ever use, from pivot tables to Power BI to Pandas, assumes this shape. Break it and nothing downstream works properly.",
        table: {
          caption: "This works. Every column holds one kind of fact.",
          headers: ["Date", "Rider", "Area", "Minutes"],
          rows: [
            ["03/06", "Musa", "Ikeja", "28"],
            ["03/06", "Ada", "Ajah", "47"],
          ],
        },
        mistake:
          "Putting two facts in one column, such as \"Musa (Ikeja)\", because it looked tidy at the time. You will spend an hour splitting it later. The same goes for a single Details column holding a whole sentence: you cannot total it, sort it or group by it.",
      },
      {
        id: "a-headers-once",
        title: "Headers go in row 1, once",
        explain:
          "The first row holds your column names and nothing else. No title banner above it, no blank spacer row beneath it, no repeated header halfway down.",
        why: "Excel's sorting, filtering and pivot tables all look for a single header row at the top. A decorative title in row 1 means Excel treats your real headers as data.",
        table: {
          caption: "What Excel thinks your column names are.",
          headers: ["Row", "Correct sheet", "Sheet with a title banner"],
          rows: [
            ["1", "Date · Rider · Area  (the headers)", "SALES REPORT 2026"],
            ["2", "03/06 · Musa · Ikeja", "Date · Rider · Area"],
            ["3", "03/06 · Ada · Ajah", "03/06 · Musa · Ikeja"],
          ],
          note: "On the right, Excel reads the banner as your header row. Your real column names become just another row of data, and sorting breaks.",
        },
        mistake:
          "Adding a merged \"SALES REPORT 2026\" cell across the top because it looks professional. It breaks every automated feature in the program. Put the title in the sheet name instead.",
      },
      {
        id: "a-consistency",
        title: "Be relentlessly consistent",
        explain:
          "Pick one spelling and one format and never vary. Not \"Ikeja\", \"ikeja\" and \"IKEJA\". Not 03/06/2026 in one row and \"June 3\" in the next.",
        why: "This is the Ikeja problem from the delivery dataset. To a computer, three spellings are three different areas, so your totals silently split and every chart is wrong while looking perfectly fine.",
        table: {
          caption: "Grouping by area on inconsistently entered data.",
          headers: ["Value stored", "Deliveries counted"],
          rows: [
            ["Ikeja", "12"],
            ["ikeja", "8"],
            ["Ikeja·(trailing space)", "3"],
          ],
          note: "One real area, reported as three. The true total was 23.",
        },
        practice: {
          prompt:
            "You inherit a sheet where the Area column has 14 distinct values but the company only delivers to 6 areas. What has happened, and which workflow step do you fix it in?",
          answer:
            "Inconsistent entry. Spelling variants, stray spaces and capitalisation have split 6 real areas into 14. You fix it in step 2, Clean, before any analysis. Otherwise every grouped result is wrong.",
        },
      },
      {
        id: "a-numbers-as-numbers",
        title: "Numbers must be numbers",
        explain:
          "A number typed with a currency symbol, a space, or as \"1,200 naira\" is text, not a number. Excel will refuse to add it up. Numbers stored as text usually sit on the left of the cell, while real numbers sit on the right.",
        why: "It is the most common reason a SUM returns zero or a wildly wrong figure. The left alignment is the fastest way to spot it before it costs you an afternoon.",
        table: {
          caption: "How to tell at a glance.",
          headers: ["What you typed", "Excel stores it as", "Sits", "SUM includes it?"],
          rows: [
            ["1200", "Number", "Right", "Yes"],
            ["₦1200", "Text", "Left", "No"],
            ["1,200 naira", "Text", "Left", "No"],
          ],
        },
        mistake:
          "Typing the naira sign into the cell. Type 1200 and use Excel's currency formatting to display it as ₦1,200. The cell then looks right and still adds up.",
      },
      {
        id: "a-no-blank-rows",
        title: "No blank rows inside your data",
        explain:
          "Do not leave an empty row to visually separate sections. If you need separation, use a new sheet or a category column.",
        why: "Excel decides where your table ends by looking for the first blank row. Put one in the middle and half your data silently stops being included in sorts, filters and pivot tables.",
        table: {
          caption: "Where Excel stops reading.",
          headers: ["Row", "Contents", "Included in a sort?"],
          rows: [
            ["200", "03/06 · Musa · Ikeja", "Yes"],
            ["201", "(left blank for spacing)", "This is where Excel stops"],
            ["202", "04/06 · Ada · Ajah", "No"],
            ["500", "30/06 · Ngozi · Yaba", "No"],
          ],
        },
        practice: {
          prompt:
            "You sort a 500-row sheet and only the first 200 rows move. What is almost certainly wrong?",
          answer:
            "There is a blank row at about row 201. Excel treated that as the end of the table and sorted only what came before it.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
