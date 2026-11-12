/**
 * VIRTUAL ASSISTANT · MODULE 5 · PRODUCTIVITY AND OFFICE APPLICATIONS
 *
 * Curriculum 5.1 – 5.7 and the practical 5.P. Word and Google Docs, Excel
 * and Google Sheets (data, formatting, sorting, filtering, formulas),
 * PowerPoint and Google Slides, PDFs, and collaborative workflows; then a
 * business report, an expense spreadsheet and a client presentation.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Spreadsheet model answers live in
 * lib/academy/desk/sheetSolutions.mjs; assessment answers in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

export const SECTION_ID = "va-s5-office";

/** March expenses for Brightwave Foods' CEO office. Total ₦251,000. */
const EXPENSES = {
  A1: "Date", B1: "Item", C1: "Category", D1: "Amount (₦)", E1: "Check",
  A2: "2026-03-02", B2: "Printer ink", C2: "Office", D2: 18500,
  A3: "2026-03-04", B3: "Flight Lagos–Abuja", C3: "Travel", D3: 96000,
  A4: "2026-03-06", B4: "Team lunch", C4: "Meals", D4: 42000,
  A5: "2026-03-09", B5: "Uber to client", C5: "Travel", D5: 7800,
  A6: "2026-03-12", B6: "Zoom subscription", C6: "Software", D6: 15500,
  A7: "2026-03-15", B7: "Hotel, Abuja", C7: "Travel", D7: 65000,
  A8: "2026-03-18", B8: "Paper and pens", C8: "Office", D8: 6200,
  A9: "Total", B9: "", C9: "", D9: "",
};
const LOCKED = ["A1", "B1", "C1", "D1", "E1", "A2", "B2", "C2", "D2", "A3", "B3", "C3", "D3", "A4", "B4", "C4", "D4", "A5", "B5", "C5", "D5", "A6", "B6", "C6", "D6", "A7", "B7", "C7", "D7", "A8", "B8", "C8", "D8", "A9"];

/** April expenses for the practical. Office total ₦61,700. */
const APRIL = {
  A1: "Date", B1: "Item", C1: "Category", D1: "Amount (₦)",
  A2: "2026-04-01", B2: "Office chairs (2)", C2: "Office", D2: 48000,
  A3: "2026-04-03", B3: "Bolt rides", C3: "Travel", D3: 12400,
  A4: "2026-04-07", B4: "Canva Pro", C4: "Software", D4: 9500,
  A5: "2026-04-10", B5: "Client dinner", C5: "Meals", D5: 55000,
  A6: "2026-04-14", B6: "Printer paper", C6: "Office", D6: 7200,
  A7: "2026-04-21", B7: "Flight to Accra", C7: "Travel", D7: 610000,
  A8: "2026-04-25", B8: "Stapler and files", C8: "Office", D8: 6500,
  F1: "Category", G1: "Total",
  F2: "Office", G2: "",
};

/* ── Lesson 29 lab: a short business report ───────────────────────────── */
const REPORT_BRIEF = `Your client, **Mrs Adaeze Nwosu** (CEO, Brightwave Foods), asked: *"Are we wasting money on office supplies? Give me a one-page report."* You compared the last three months:

- January ₦142,000, February ₦156,000, March ₦171,000: up 20% in two months.
- 40% of spending was on printer ink and paper. The office prints about 2,600 pages a month, mostly internal reports that are read once.
- Supplies are bought in small amounts from a nearby shop at retail prices. A wholesale supplier (OfficeMart) offers the same items about 15% cheaper with free delivery for orders over ₦100,000.
- There is no one responsible for ordering; anyone buys when something runs out.

Write the report with Word-style structure: the title, then **Executive summary**, **Findings** (with a table of the three months), and **Recommendations** (numbered).`;

const REPORT_DOC = `# Office supplies spending review, January–March 2026

## Executive summary

## Findings

| Month | Spending (₦) |
|---|---|

## Recommendations
`;

const REPORT_DONE = `# Office supplies spending review, January–March 2026

## Executive summary

Office supplies spending rose 20% in two months, from ₦142,000 in January to ₦171,000 in March. Most of the increase comes from printing and from buying small amounts at retail prices. Three simple changes could cut spending by about a quarter.

## Findings

| Month | Spending (₦) |
|---|---|
| January | 142,000 |
| February | 156,000 |
| March | 171,000 |

- Printer ink and paper made up 40% of spending. The office prints about 2,600 pages a month, mostly internal reports read once.
- Supplies are bought in small amounts from a nearby shop at retail prices.
- No one is responsible for ordering, so items are bought whenever they run out.

## Recommendations

1. Order supplies monthly from OfficeMart, which is about 15% cheaper and delivers free for orders over ₦100,000.
2. Share internal reports as PDFs or Google Docs instead of printing them, with a target of halving printing.
3. Make one person responsible for ordering, using a simple monthly stock checklist.
`;

/* ── Lesson 32 lab: a slide outline ──────────────────────────────────── */
const SLIDES_BRIEF = `Mrs Nwosu will present the office supplies findings at the **management meeting** in a **5-minute slot**. Turn your report from lesson 29 into a slide outline she can build in PowerPoint or Google Slides.

Rules from this lesson: **6 to 8 slides**; a title slide first and a "next steps" or decision slide last; **one idea per slide**; **no more than 4 bullets per slide and no more than 10 words per bullet**; each slide has **speaker notes** that say what she will say.`;

const SLIDES_DOC = `# Slide outline: office supplies review

## Slide 1:
- Notes:
`;

const SLIDES_DONE = `# Slide outline: office supplies review

## Slide 1: Office supplies spending review
- January to March 2026
- Notes: Thank everyone and say this takes five minutes and ends with one decision.

## Slide 2: Spending rose 20% in two months
- January ₦142,000
- March ₦171,000
- Notes: Show the chart of the three months and point out the steady rise.

## Slide 3: Printing is 40% of spending
- About 2,600 pages a month
- Mostly internal reports read once
- Notes: Explain that most printed pages are never used again.

## Slide 4: We pay retail prices
- Small purchases from a nearby shop
- No one responsible for ordering
- Notes: Explain why buying whenever something runs out costs more.

## Slide 5: Three changes cut costs
- Order monthly from OfficeMart, 15% cheaper
- Share reports digitally, halve printing
- One person owns ordering
- Notes: Walk through each change and its effect.

## Slide 6: Decision needed today
- Approve the three changes from May
- Notes: Ask the team to approve and name who will own ordering.
`;

/* ── Lesson 34 lab: the practical report and deck ─────────────────────── */
const PRAC_BRIEF = `Your client is **Mr Kunle Adebayo**, founder of **Greenline Solar**. He wants a **client update pack** for a hotel customer, **Lakeview Hotel, Abuja**, where Greenline installed solar power in March. Facts:

- System: 60 kW of solar panels and a 120 kWh battery bank, installed 3–14 March 2026.
- Diesel generator use fell from about 14 hours a day in February to **3 hours a day** in April.
- Diesel spending fell from **₦4.8 million** in February to **₦1.1 million** in April.
- Two issues: an inverter fault on 19 March (fixed in 6 hours under warranty) and dust on panels reducing output in early April (cleaning now scheduled every two weeks).
- Next steps: a quarterly maintenance visit on 15 June; a proposal to add 20 kW for the new conference wing, to be sent by 30 May.

Prepare (1) a short report and (2) a slide outline for a 10-minute review meeting with the hotel's general manager, **Mrs Ruth Danladi**.`;

const PRAC_DOC = `# Lakeview Hotel solar update

## Report

### Executive summary

### Results

| Measure | February | April |
|---|---|---|

### Issues and fixes

### Next steps

## Slides

### Slide 1:
- Notes:
`;

const PRAC_DONE = `# Lakeview Hotel solar update

## Report

### Executive summary

Greenline Solar installed a 60 kW solar system with a 120 kWh battery bank at Lakeview Hotel between 3 and 14 March 2026. By April, generator use had fallen from about 14 to 3 hours a day and diesel spending from ₦4.8 million to ₦1.1 million a month. Two early issues were fixed, and maintenance is scheduled.

### Results

| Measure | February | April |
|---|---|---|
| Generator hours per day | 14 | 3 |
| Diesel spending (₦) | 4,800,000 | 1,100,000 |

### Issues and fixes

- Inverter fault on 19 March: fixed in 6 hours under warranty.
- Dust on panels reduced output in early April: cleaning is now scheduled every two weeks.

### Next steps

1. Quarterly maintenance visit on 15 June.
2. Proposal to add 20 kW for the new conference wing, sent by 30 May.

## Slides

### Slide 1: Lakeview Hotel solar review
- Installed 3–14 March 2026
- Notes: Welcome Mrs Danladi and outline the ten minutes.

### Slide 2: Diesel spending down 77%
- ₦4.8 million in February
- ₦1.1 million in April
- Notes: Highlight the monthly saving of ₦3.7 million.

### Slide 3: Generator hours down to 3 a day
- From about 14 hours in February
- Notes: Explain that the batteries now cover most nights.

### Slide 4: Two issues, both fixed
- Inverter fault fixed in 6 hours
- Panels now cleaned every two weeks
- Notes: Reassure her that both were handled quickly.

### Slide 5: Next steps
- Maintenance visit on 15 June
- Conference wing proposal by 30 May
- Notes: Ask whether she would like the 20 kW proposal.
`;

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 29 · 5.1 – 5.2
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "va-l29-word-docs",
    moduleId: "va-m5-office",
    sectionId: SECTION_ID,
    order: 1,
    covers: ["5.1", "5.2"],
    title: "Microsoft Word and Google Docs",
    subtitle: "Creating, formatting and structuring documents, and writing them together",
    estimatedMinutes: 45,
    intro:
      "Letters, reports, proposals, minutes and templates: a VA produces documents every day. The difference between amateur and professional is structure, consistency and how you collaborate.",

    atoms: [
      {
        id: "a-va-word",
        title: "Word essentials: formatting, tables, templates and reports",
        explain:
          "In Microsoft Word, build documents with structure, not decoration. Use Styles (Home > Styles): Title, Heading 1, Heading 2 and Normal. Styles keep formatting consistent, let you restyle a whole document at once, create the Navigation Pane outline and generate a table of contents (References > Table of Contents). Insert tables (Insert > Table) for figures and comparisons, with a header row, and keep them simple. Add headers and footers with the company name, page numbers (Insert > Page Number) and dates. Save documents you produce often as templates (.dotx) so every letter or report starts correctly. Turn on Track Changes (Review > Track Changes) when others review your work, so every edit can be accepted or rejected. A business report usually has: a title, an executive summary (the conclusion in a few sentences), an introduction or background, findings with evidence, recommendations, and appendices for detail.",
        table: {
          caption: "Word features you will use weekly.",
          headers: ["Need", "Feature"],
          rows: [
            ["Consistent headings", "Styles: Heading 1, Heading 2"],
            ["Automatic contents page", "References > Table of Contents"],
            ["Page numbers and company name on every page", "Insert > Header, Footer, Page Number"],
            ["Show every edit for approval", "Review > Track Changes"],
            ["Reuse a layout", "Save as Word Template (.dotx)"],
            ["Final copy for sending", "File > Save As > PDF"],
          ],
        },
      },
      {
        id: "a-va-gdocs",
        title: "Google Docs: collaborative document creation",
        explain:
          "Google Docs is built for working together in real time. Share a document with a link instead of sending attachments, so there is one version. Use comments (Ctrl+Alt+M) to ask questions, and @mention a person in a comment to notify them or assign them a task. Switch to Suggesting mode (the pencil icon, top right) when you edit someone else's document: your changes appear as suggestions they can accept or reject, the Google equivalent of Track Changes. Version history (File > Version history) shows every change and lets you restore an earlier version or name a version (\"Sent to client 12 March\"). Docs saves automatically, works offline if you enable it, and opens and exports Word files (File > Download > Microsoft Word), so you can work with clients who use Word.",
        decision: {
          scenario: "Your client has written a proposal in Google Docs and asks you to \"tidy up the wording\" before she sends it.",
          question: "How should you edit it?",
          options: [
            { id: "a", text: "Use Suggesting mode so she can see and accept or reject each change", why: "Right. It is her document and her name on it: suggestions let her stay in control." },
            { id: "b", text: "Edit directly and say nothing", whyWrong: "She cannot see what changed and may send something she has not approved." },
            { id: "c", text: "Download it, edit in Word and email it back", whyWrong: "That creates a second version and loses the shared history." },
            { id: "d", text: "Rewrite it from scratch in a new document", whyWrong: "She asked for tidying, not a new proposal." },
          ],
          correct: "a",
        },
      },
      {
        id: "a-va-report-lab",
        title: "Writing a structured business report",
        explain:
          "Write Mrs Nwosu's one-page report. The Markdown headings here are the same as Word's Heading styles: when you build it in Word, \"##\" becomes Heading 1.",
        writingLab: {
          task:
            "Executive summary: 2 to 4 sentences with the 20% rise and the bottom line. Findings: the table with the three months and their figures, then at least three bullet findings (printing share, retail buying, no one responsible). Recommendations: three numbered actions, each starting with a verb, including OfficeMart and digital sharing. 120 to 320 words.",
          brief: REPORT_BRIEF,
          doc: REPORT_DOC,
          tests: [
            { label: "Executive summary: 2 to 4 sentences with the rise", check: String.raw`const s = section('Executive summary') || ''; const n = sentences(s).length; return n >= 2 && n <= 4 && /20\s?%/.test(s);`, fail: "Write a 2 to 4 sentence summary that states the 20% rise and your conclusion." },
            { label: "A table of the three months", check: String.raw`const r = rows(section('Findings') || ''); return r.length === 3 && /jan/i.test(r[0][0]) && /142/.test(r[0][1]) && /156/.test(r[1][1]) && /171/.test(r[2][1]);`, fail: "Complete the table: January 142,000, February 156,000, March 171,000." },
            { label: "At least three findings as bullets", check: String.raw`const b = bullets(section('Findings') || '').join(' '); return bullets(section('Findings') || '').length >= 3 && /40\s?%/.test(b) && /retail/i.test(b) && /(no one|nobody|responsible)/i.test(b);`, fail: "Add bullet findings for the 40% printing share, retail buying and no one being responsible." },
            { label: "Three numbered recommendations starting with verbs", check: String.raw`const n = numbered(section('Recommendations') || ''); return n.length === 3 && n.every((x) => isAction(x) || /^(order|share|make|appoint|reduce|switch|buy|print|assign)/i.test(x));`, fail: "Write exactly three numbered recommendations, each starting with a verb (Order, Share, Make…)." },
            { label: "Recommendations use the evidence", check: String.raw`const r = section('Recommendations') || ''; return /officemart/i.test(r) && /15\s?%/.test(r) && /(pdf|digital|google docs|instead of printing|share)/i.test(r);`, fail: "Recommend OfficeMart (15% cheaper) and sharing reports digitally instead of printing." },
            { label: "120 to 320 words", check: String.raw`return words(doc) >= 120 && words(doc) <= 320;`, fail: "Keep the report between 120 and 320 words: one page." },
          ],
          solution: REPORT_DONE,
          hint: "Write the executive summary last: once the findings and recommendations are clear, summarise them in three sentences.",
          successMessage: "A one-page report a CEO can read in two minutes and act on.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 30 · 5.3
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "va-l30-sheets-basics",
    moduleId: "va-m5-office",
    sectionId: SECTION_ID,
    order: 2,
    covers: ["5.3"],
    title: "Excel and Google Sheets: Data, Formatting, Sorting and Filtering",
    subtitle: "Entering and organising data so it can be trusted, sorted, filtered and read",
    estimatedMinutes: 40,
    intro:
      "Expense trackers, contact lists, order logs, lead lists: half of a VA's records live in spreadsheets. Set them up well and everything else (formulas, reports) becomes easy.",

    atoms: [
      {
        id: "a-va-sheet-basics",
        title: "How a spreadsheet is organised",
        explain:
          "A spreadsheet is a grid of cells. Columns are lettered (A, B, C), rows are numbered (1, 2, 3), and each cell has an address: B3 is column B, row 3. A range is a block of cells written with a colon: D2:D8 is D2 down to D8. A workbook (the file) holds several sheets (tabs). Organise data as a table: one header row with a clear name for each column, then one row per record (one expense, one contact), and one kind of value per column (all dates in the Date column, only numbers in the Amount column). Do not leave blank rows inside the table or merge cells in it; they break sorting and filtering. Keep raw data on one sheet and summaries or charts on another.",
      },
      {
        id: "a-va-sheet-format",
        title: "Data entry and formatting",
        explain:
          "Formatting makes data readable without changing it. Apply number formats instead of typing symbols: Currency or Number with thousands separators for money (Format > Number in Sheets; Home > Number in Excel), Percent for rates, Date for dates. Make the header row bold and freeze it (View > Freeze > 1 row) so it stays visible as you scroll. Wrap long text, align numbers to the right, and keep fonts consistent. Use data validation (Data > Data validation) to create drop-down lists (Category: Office, Travel, Meals) so everyone enters the same words. Conditional formatting (Format > Conditional formatting) colours cells automatically by a rule, for example red for any expense over ₦50,000.",
      },
      {
        id: "a-va-sort-filter",
        title: "Sorting and filtering",
        explain:
          "Sorting reorders rows by a column (A to Z, smallest to largest, oldest to newest). Always sort the whole table, not one column, or the rows get scrambled: select a cell in the table and use Data > Sort range (Sheets) or Data > Sort (Excel) with \"data has header row\" ticked. Filtering hides rows that do not match, without deleting them: Data > Create a filter (Sheets) or Data > Filter (Excel) adds a button to each header, so you can show only Travel expenses or only March. In shared Google Sheets, use filter views so your filter does not change what everyone else sees. Remove duplicates with Data > Data cleanup > Remove duplicates (Sheets) or Data > Remove Duplicates (Excel), after making a copy.",
        mistake:
          "Selecting only the Amount column and sorting it. The amounts move but the items stay put, so every expense now has the wrong amount. Sort the whole table.",
      },
      {
        id: "a-va-sheet-desk",
        title: "Which spreadsheet feature solves it?",
        explain:
          "Your client's expense sheet has problems. Choose the feature that solves each one.",
        deskLab: {
          app: "tasks",
          title: "Brightwave expense sheet: requests",
          task: "Choose the spreadsheet feature that solves each request.",
          fields: [{ key: "feature", label: "Feature", type: "select", options: ["Sort the whole table", "Filter (or a filter view)", "Freeze the header row", "Data validation drop-down", "Conditional formatting", "Currency number format", "Remove duplicates"] }],
          items: [
            { id: "s1", title: "Show the largest expenses at the top", expect: { feature: "Sort the whole table" } },
            { id: "s2", title: "See only Travel expenses for a moment, without deleting anything", expect: { feature: "Filter (or a filter view)" } },
            { id: "s3", title: "The column headings disappear when you scroll down 300 rows", expect: { feature: "Freeze the header row" } },
            { id: "s4", title: "Staff type \"travel\", \"Travel\" and \"trvl\" in the Category column", expect: { feature: "Data validation drop-down" }, why: "A drop-down list forces everyone to choose the same category name." },
            { id: "s5", title: "Make any expense over ₦50,000 turn red automatically", expect: { feature: "Conditional formatting" } },
            { id: "s6", title: "Amounts show as 96000 instead of ₦96,000.00", expect: { feature: "Currency number format" } },
            { id: "s7", title: "The same receipt was entered twice by two people", expect: { feature: "Remove duplicates" } },
          ],
          solution: {
            s1: { feature: "Sort the whole table" }, s2: { feature: "Filter (or a filter view)" }, s3: { feature: "Freeze the header row" }, s4: { feature: "Data validation drop-down" },
            s5: { feature: "Conditional formatting" }, s6: { feature: "Currency number format" }, s7: { feature: "Remove duplicates" },
          },
          successMessage: "Seven problems, seven features. Now try each one in a real Google Sheet.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 31 · 5.4
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "va-l31-formulas",
    moduleId: "va-m5-office",
    sectionId: SECTION_ID,
    order: 3,
    covers: ["5.4"],
    title: "Basic Spreadsheet Formulas",
    subtitle: "SUM, AVERAGE, ROUND, MAX, IF and SUMIF on a real expense sheet",
    estimatedMinutes: 50,
    intro:
      "Formulas turn a list into answers: the total, the average, what needs approval, how much went on travel. These six cover most of what clients ask a VA to calculate.",

    atoms: [
      {
        id: "a-va-formula-basics",
        title: "How formulas work",
        explain:
          "Every formula starts with an equals sign. =1200+300 calculates with numbers, but formulas are most useful with cell references: =D2+D3 adds whatever is in D2 and D3, and updates automatically when those cells change. The operators are + (add), - (subtract), * (multiply), / (divide); multiplication and division happen before addition and subtraction unless you use brackets: =(D2+D3)*2. Functions do bigger jobs: =SUM(D2:D8) adds a whole range. Type the function name, an opening bracket, the range (or click and drag to select it), and a closing bracket, then press Enter. The cell shows the result; the formula bar shows the formula. When you copy a formula down a column, references move with it (D2 becomes D3); add dollar signs to fix one ($D$9) when every row must point at the same cell. These formulas work the same in Excel and Google Sheets.",
      },
      {
        id: "a-va-sum",
        title: "SUM: the month's total",
        explain:
          "=SUM(range) adds every number in the range. Below is Mrs Nwosu's March expense sheet. Cell D9 should hold the total of the amounts in D2 to D8.",
        exercise: {
          data: { ...EXPENSES },
          rows: 9,
          cols: 5,
          target: "D9",
          expected: 251000,
          mustUseFormula: true,
          mustUse: "SUM",
          lockedCells: LOCKED,
          task: "In D9, use SUM to total the amounts in D2 to D8.",
          hint: "=SUM(D2:D8)",
          successMessage: "₦251,000. Change any amount and the total updates by itself.",
        },
      },
      {
        id: "a-va-average",
        title: "AVERAGE, ROUND and MAX",
        explain:
          "=AVERAGE(range) gives the mean. Averages often have long decimals, so wrap them in ROUND: =ROUND(AVERAGE(D2:D8),0) rounds to whole naira (the 0 is the number of decimal places). =MAX(range) and =MIN(range) give the largest and smallest values. Here, put the average expense, rounded to whole naira, in D9.",
        exercise: {
          data: { ...EXPENSES, A9: "Average" },
          rows: 9,
          cols: 5,
          target: "D9",
          expected: 35857,
          mustUseFormula: true,
          mustUse: "AVERAGE",
          lockedCells: LOCKED,
          task: "In D9, calculate the average of D2:D8, rounded to 0 decimal places.",
          hint: "Put AVERAGE inside ROUND: =ROUND(AVERAGE(D2:D8),0)",
          successMessage: "₦35,857: the typical expense this month.",
        },
      },
      {
        id: "a-va-if",
        title: "IF: flag what needs approval",
        explain:
          "=IF(test, value if true, value if false) makes a decision. Mrs Nwosu's rule: any expense over ₦50,000 needs her approval. =IF(D3>50000,\"Needs approval\",\"OK\") shows \"Needs approval\" for the flight. Text in a formula goes in double quotes. In column E (Check), write the formula for the flight in row 3.",
        exercise: {
          data: { ...EXPENSES },
          rows: 9,
          cols: 5,
          target: "E3",
          expected: "Needs approval",
          mustUseFormula: true,
          mustUse: "IF",
          lockedCells: LOCKED,
          task: "In E3, use IF to show \"Needs approval\" if D3 is over 50000, otherwise \"OK\".",
          hint: "=IF(D3>50000,\"Needs approval\",\"OK\")",
          successMessage: "Fill it down column E and every large expense flags itself.",
        },
      },
      {
        id: "a-va-sumif",
        title: "SUMIF: total by category",
        explain:
          "=SUMIF(range to check, criterion, range to add) adds only the rows that match. =SUMIF(C2:C8,\"Travel\",D2:D8) checks the categories in C and adds the matching amounts from D. Its partner =COUNTIF(C2:C8,\"Travel\") counts the matching rows. Put March's total travel spending in D9.",
        exercise: {
          data: { ...EXPENSES, A9: "Travel total" },
          rows: 9,
          cols: 5,
          target: "D9",
          expected: 168800,
          mustUseFormula: true,
          mustUse: "SUMIF",
          lockedCells: LOCKED,
          task: "In D9, use SUMIF to total the Travel amounts.",
          hint: "=SUMIF(C2:C8,\"Travel\",D2:D8)",
          successMessage: "₦168,800 on travel: two-thirds of the month's spending, which is exactly what a CEO wants to know.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 32 · 5.5
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "va-l32-slides",
    moduleId: "va-m5-office",
    sectionId: SECTION_ID,
    order: 4,
    covers: ["5.5"],
    title: "PowerPoint and Google Slides",
    subtitle: "Designing and formatting presentations that are clear and easy to present",
    estimatedMinutes: 40,
    intro:
      "Clients often hand a VA their notes and say \"make it into slides\". Good slides support the speaker; bad slides compete with them.",

    atoms: [
      {
        id: "a-va-slide-design",
        title: "Presentation design principles",
        explain:
          "One idea per slide, stated in the slide title as a sentence (\"Spending rose 20% in two months\" rather than \"Spending\"). Few words: no more than about four bullets of up to ten words each; the detail belongs in the speaker notes and the speaker's voice. Large text (titles about 36 pt, body at least 24 pt) and strong contrast (dark text on light backgrounds or the reverse). One consistent theme: the client's colours and fonts, used on every slide. Visuals over text: a simple chart, photo or icon explains faster than a paragraph; label charts clearly and highlight the one number that matters. Structure the deck: a title slide, the main points in a logical order, and a final slide with the decision or next steps. A rough guide is one slide per minute of talking.",
        samples: [
          { label: "A wall of text", tone: "bad", text: "Spending\n- In January we spent 142,000 naira and then in February it went up to 156,000 naira and in March it was 171,000 which is a 20% increase which is mainly because of printing and buying at retail prices from the shop" },
          { label: "One idea, few words", tone: "good", text: "Spending rose 20% in two months\n- January ₦142,000\n- March ₦171,000" },
        ],
      },
      {
        id: "a-va-slide-tools",
        title: "PowerPoint and Google Slides features",
        explain:
          "Both tools work the same way. Choose a theme (Design in PowerPoint; Theme in Slides) or the client's template, then edit the master (View > Slide Master; View > Theme builder) to set fonts, colours and the logo once for every slide. Use layouts (Title, Title and Content, Section Header, Two Content) rather than drawing text boxes everywhere, so everything lines up. Add speaker notes below each slide; in Presenter View the speaker sees their notes while the audience sees only the slides. Insert charts from Excel or Google Sheets (linked, so they update). Use transitions and animations sparingly, if at all. Export as PDF to send for reading, and share the editable file as a link for collaboration.",
        decision: {
          scenario: "Your client sends a 9-page Word document and asks for slides for a 6-minute talk.",
          question: "How many slides should you aim for?",
          options: [
            { id: "a", text: "About six to eight slides, with the detail in the speaker notes", why: "Right. Roughly one slide per minute, with the document's detail in the notes rather than on screen." },
            { id: "b", text: "Nine slides, one per page of the document", whyWrong: "Pages are not ideas; you would end up pasting text onto slides." },
            { id: "c", text: "Thirty slides so nothing is missed", whyWrong: "Five seconds per slide: the audience cannot follow." },
            { id: "d", text: "One slide with all the text", whyWrong: "Unreadable." },
          ],
          correct: "a",
        },
      },
      {
        id: "a-va-slides-lab",
        title: "Outlining a deck",
        explain:
          "Outline Mrs Nwosu's five-minute deck. Building the slides is quick once the outline is right; most bad decks come from skipping this step.",
        writingLab: {
          task:
            "Write 6 to 8 slides as \"## Slide N: title\" headings. Slide 1 is the title slide; the last slide is a decision or next-steps slide. Every slide has 1 to 4 content bullets of at most 10 words each, plus a \"- Notes:\" bullet with what she will say. Slide titles of slides 2 onwards should be sentences of at least four words that state the point.",
          brief: SLIDES_BRIEF,
          doc: SLIDES_DOC,
          tests: [
            { label: "6 to 8 slides", check: String.raw`const s = sections('Slide '); return s.length >= 6 && s.length <= 8;`, fail: "Write 6 to 8 slides, each as a \"## Slide N: title\" heading." },
            { label: "1 to 4 short bullets per slide", check: String.raw`return sections('Slide ').every((x) => { const b = bullets(x.text).filter((t) => !/^notes:/i.test(t)); return b.length >= 1 && b.length <= 4 && b.every((t) => words(t) <= 10); });`, fail: "Give every slide 1 to 4 content bullets, each 10 words or fewer." },
            { label: "Speaker notes on every slide", check: String.raw`return sections('Slide ').every((x) => words(field(x.text, 'Notes') || '') >= 5);`, fail: "Add a \"- Notes:\" line of at least five words to every slide." },
            { label: "Titles state the point", check: String.raw`const s = sections('Slide '); return s.length > 1 && s.slice(1).every((x) => words(x.heading.replace(/^Slide \d+:\s*/, '')) >= 3);`, fail: "From slide 2 on, make each title a short statement of the point (\"Printing is 40% of spending\")." },
            { label: "Title slide first, decision or next steps last", check: String.raw`const s = sections('Slide '); const last = s[s.length - 1] || { heading: '', text: '' }; return s.length > 0 && /(review|office supplies)/i.test(s[0].heading) && /(decision|next steps|approve|ask)/i.test(last.heading + ' ' + last.text);`, fail: "Start with a title slide and end with the decision or next steps you need." },
          ],
          solution: SLIDES_DONE,
          hint: "Take each finding and recommendation from your report: each becomes one slide whose title is the point.",
          successMessage: "A five-minute deck with one idea per slide and notes the speaker can rely on.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 33 · 5.6 – 5.7
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "va-l33-pdf-collab",
    moduleId: "va-m5-office",
    sectionId: SECTION_ID,
    order: 5,
    covers: ["5.6", "5.7"],
    title: "PDFs and Collaborative Workflows",
    subtitle: "Creating, converting, editing and managing PDFs, and working on documents as a team",
    estimatedMinutes: 40,
    intro:
      "Clients sign, send and store PDFs constantly, and teams lose hours to \"which version is the latest?\". Both are problems a good VA quietly solves.",

    atoms: [
      {
        id: "a-va-pdf",
        title: "PDF creation, conversion, editing and management",
        explain:
          "PDF (Portable Document Format) keeps a document's layout identical on every device, so it is the standard for final documents, contracts, invoices and forms. Create a PDF from Word (File > Save As > PDF), Google Docs (File > Download > PDF) or any app through Print > Save as PDF (Microsoft Print to PDF on Windows). Convert a PDF to an editable document by opening it in Word or Google Docs (complex layouts may need tidying) or with Adobe Acrobat. Edit or annotate PDFs (highlight, comment, fill in forms, add text) with Acrobat Reader, the Edge browser or Preview on a Mac. Merge several PDFs into one, split one, reorder pages, compress large files and protect a file with a password in Acrobat or tools such as iLovePDF and Smallpdf. Collect signatures with an e-signature service (DocuSign, Adobe Acrobat Sign, Dropbox Sign), which records who signed and when. Never upload confidential documents to free online converters without the client's agreement; use desktop tools for those.",
      },
      {
        id: "a-va-collab",
        title: "Collaborative document workflows",
        explain:
          "When several people work on a document, agree a workflow so it does not turn into chaos. Keep one source of truth: a single shared file in Google Drive, OneDrive or SharePoint, shared by link, not copies by email. Name an owner who has the final say and an approver if different. Agree who edits directly and who comments or suggests. Use comments and @mentions for questions and assignments, and resolve comments when done. Use Suggesting mode (Docs) or Track Changes (Word) for reviews. Set review deadlines. When a version goes out (to a client, to print), name it in version history or save a PDF named with the convention (2026-04-02_Lakeview_Report_v03.pdf). Microsoft 365 files in OneDrive or SharePoint support the same real-time co-editing as Google Docs.",
        decision: {
          scenario: "Three managers must give feedback on a proposal by Thursday. Last time, each edited a different emailed copy and it took a day to merge them.",
          question: "What workflow do you set up?",
          options: [
            { id: "a", text: "One shared document link in Suggesting mode (or Track Changes), with each manager @mentioned and a Thursday deadline", why: "Right. One source of truth, visible suggestions, clear owners and a deadline." },
            { id: "b", text: "Email each manager a copy and merge the three versions yourself", whyWrong: "That repeats last time's problem." },
            { id: "c", text: "Give everyone Editor access with no other instructions", whyWrong: "Edits overwrite each other with no record of who wanted what." },
            { id: "d", text: "Print three copies", whyWrong: "Slow, and the feedback still has to be retyped." },
          ],
          correct: "a",
        },
      },
      {
        id: "a-va-pdf-desk",
        title: "PDF and collaboration requests",
        explain:
          "Choose the right action for each request your client sends this week.",
        deskLab: {
          app: "files",
          title: "Document requests · Greenline Solar",
          task: "Choose the right action for each request.",
          fields: [{ key: "action", label: "Action", type: "select", options: ["Export as PDF", "Merge into one PDF", "Compress the PDF", "Send for e-signature", "Open in Word or Docs to convert", "Share one link in Suggesting mode", "Use a desktop tool, not a free website"] }],
          items: [
            { id: "p1", title: "Send the final client report; the layout must not change", expect: { action: "Export as PDF" } },
            { id: "p2", title: "Give the accountant April's 12 receipts as a single file", expect: { action: "Merge into one PDF" } },
            { id: "p3", title: "A 38 MB scanned contract will not attach to an email to a supplier who cannot use links", expect: { action: "Compress the PDF" } },
            { id: "p4", title: "A customer and Mr Adebayo, in different cities, must both sign the installation contract", expect: { action: "Send for e-signature" } },
            { id: "p5", title: "Reuse the text of last year's proposal, which only exists as a PDF", expect: { action: "Open in Word or Docs to convert" } },
            { id: "p6", title: "The sales and operations heads both need to review the new price list draft", expect: { action: "Share one link in Suggesting mode" } },
            { id: "p7", title: "Merge the staff payslips PDF for the auditor", expect: { action: "Use a desktop tool, not a free website" }, hint: "What is in this PDF?", why: "Payslips are confidential: do not upload them to free online converters." },
          ],
          solution: {
            p1: { action: "Export as PDF" }, p2: { action: "Merge into one PDF" }, p3: { action: "Compress the PDF" }, p4: { action: "Send for e-signature" },
            p5: { action: "Open in Word or Docs to convert" }, p6: { action: "Share one link in Suggesting mode" }, p7: { action: "Use a desktop tool, not a free website" },
          },
          hint: "For each, ask what the end result must be, and whether the file is confidential.",
          successMessage: "The right tool for each job, and confidential files kept off free websites.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 34 · 5.P
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "va-l34-practical",
    moduleId: "va-m5-office",
    sectionId: SECTION_ID,
    order: 6,
    covers: ["5.P"],
    title: "Practical: Report, Expense Sheet and Presentation",
    subtitle: "A client update pack for Greenline Solar",
    estimatedMinutes: 75,
    intro:
      "Three deliverables a client might ask for in one week: an expense spreadsheet, a business report and a presentation. Produce all three.",

    atoms: [
      {
        id: "a-va-m5-expense",
        title: "The expense spreadsheet",
        explain:
          "Here is Greenline Solar's April expense sheet. Build the category summary on the right: in G2, total the Office expenses with SUMIF. (When you rebuild this in Google Sheets for your portfolio, add the other categories below it, a grand total and an approval check column with IF.)",
        exercise: {
          data: { ...APRIL },
          rows: 8,
          cols: 7,
          target: "G2",
          expected: 61700,
          mustUseFormula: true,
          mustUse: "SUMIF",
          lockedCells: ["A1", "B1", "C1", "D1", "F1", "G1", "F2", "D2", "D3", "D4", "D5", "D6", "D7", "D8", "C2", "C3", "C4", "C5", "C6", "C7", "C8"],
          task: "In G2, total the amounts in D2:D8 whose category in C2:C8 matches F2 (Office).",
          hint: "You can point at F2 instead of typing the word: =SUMIF(C2:C8,F2,D2:D8)",
          successMessage: "₦61,700 on office costs. Pointing at F2 means the same formula works for every category you add below.",
        },
      },
      {
        id: "a-va-m5-pack",
        title: "The report and the slide outline",
        explain:
          "Write the Lakeview Hotel update: a short report and a slide outline for the review meeting with Mrs Danladi. Then build both properly, the report in Word or Google Docs with heading styles and the deck in PowerPoint or Google Slides, and export them as PDFs for your portfolio.",
        writingLab: {
          task:
            "Report: an executive summary (2 to 4 sentences); a results table with generator hours and diesel spending for February and April; both issues and their fixes as bullets; the two next steps numbered with their dates. Slides: 4 to 7 slides as \"### Slide N: title\", each with 1 to 4 bullets of at most 10 words and a \"- Notes:\" line; the last slide covers next steps.",
          brief: PRAC_BRIEF,
          doc: PRAC_DOC,
          tests: [
            { label: "Executive summary of 2 to 4 sentences", check: String.raw`const s = section('Executive summary') || ''; const n = sentences(s).length; return n >= 2 && n <= 4 && /(60 kW|solar)/i.test(s);`, fail: "Summarise the installation and its results in 2 to 4 sentences." },
            { label: "Results table: hours and diesel, February and April", check: String.raw`const r = rows(section('Results') || ''); const t = r.map((x) => x.join(' ')).join(' | '); return r.length >= 2 && /14/.test(t) && /\b3\b/.test(t) && /4[,.]?8|4,800,000/.test(t) && /1[,.]?1|1,100,000/.test(t);`, fail: "Fill the table: generator hours (14 → 3) and diesel spending (₦4.8 million → ₦1.1 million)." },
            { label: "Both issues and fixes", check: String.raw`const b = bullets(section('Issues') || '').join(' '); return bullets(section('Issues') || '').length >= 2 && /inverter/i.test(b) && /6 hours/i.test(b) && /dust/i.test(b) && /(two weeks|2 weeks|fortnight)/i.test(b);`, fail: "List both issues with their fixes: the inverter (fixed in 6 hours) and the dust (cleaning every two weeks)." },
            { label: "Next steps numbered with dates", check: String.raw`const n = numbered(section('Next steps') || '').join(' '); return numbered(section('Next steps') || '').length >= 2 && /15 June/i.test(n) && /30 May/i.test(n);`, fail: "Number the next steps with their dates: maintenance on 15 June, proposal by 30 May." },
            { label: "4 to 7 slides with short bullets and notes", check: String.raw`const s = sections('Slide '); return s.length >= 4 && s.length <= 7 && s.every((x) => { const b = bullets(x.text).filter((t) => !/^notes:/i.test(t)); return b.length >= 1 && b.length <= 4 && b.every((t) => words(t) <= 10) && words(field(x.text, 'Notes') || '') >= 4; });`, fail: "Write 4 to 7 slides, each with 1 to 4 bullets of 10 words or fewer and a Notes line." },
            { label: "The last slide covers next steps", check: String.raw`const s = sections('Slide '); const last = s[s.length - 1]; return !!last && /(next|maintenance|proposal)/i.test(last.heading + ' ' + last.text);`, fail: "End the deck with the next steps." },
          ],
          solution: PRAC_DONE,
          hint: "Write the report first; then each section becomes one or two slides.",
          successMessage: "A spreadsheet, a report and a deck: a complete client update pack for your portfolio.",
        },
      },
    ],

    task: {
      title: "Module 5 practical: build the files",
      intro: "Turn the practice into real, polished files.",
      prompts: [
        "Rebuild the April expense sheet in Google Sheets: a header row frozen, currency format, a Category drop-down, SUMIF totals for every category, a grand total, an IF approval column and conditional formatting for amounts over ₦50,000.",
        "Build the Lakeview report in Word or Google Docs with heading styles, a table and page numbers, and export it as a PDF named with the convention.",
        "Build the deck in PowerPoint or Google Slides from your outline, with a consistent theme and speaker notes, and export it as a PDF.",
        "Share the Google Doc with a friend in Comment mode and ask for two suggestions; accept or reject each.",
      ],
      closing: "Module 6 turns to research: finding reliable information, building verified lead lists and keeping a CRM accurate.",
    },

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
