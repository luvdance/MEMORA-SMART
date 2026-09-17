/**
 * MODULE · CAPSTONE — BUSINESS INTELLIGENCE & SALES ANALYTICS (m4-capstone)
 * Month 4 — the last module of the course.
 *
 * One company, one quarter of data, one question from one stakeholder — and
 * the same dataset carried through Excel, Power BI and Python until all three
 * return the same number. That reconciliation is the whole point of putting
 * the capstone last: a learner who can make three tools agree understands the
 * analysis, not the buttons.
 *
 * THE SCENARIO IS BUILT AROUND A TRAP, DELIBERATELY
 * Adanna Foods beat its revenue target (₦3,033,500 against ₦2,900,000) and its
 * margin is thin (11.30%). Every naive answer to "which channel should we
 * push" and "which product should we drop" is WRONG on this data:
 *
 *   · Wholesale is 68.9% of revenue and only 43.0% of margin.
 *   · Online is 10.1% of revenue and 21.1% of margin.
 *   · Tomato Paste is LAST on revenue (₦241,700) and THIRD on margin naira
 *     (₦61,200) — so the obvious product to drop is one of the better earners.
 *   · Palm Oil is SECOND on revenue (₦937,000) and last on margin rate (7.79%).
 *
 * A learner who ranks by revenue gives the opposite of the right advice. That
 * is the exam.
 *
 * AND THE DIRTY DATA FLATTERS THE COMPANY
 * Read the export as it arrives and margin looks like 13.19%. Clean it and it
 * is 11.30%. The six defects do not merely add noise — they hide the problem
 * the MD is asking about, which is why stage one is the whole job.
 *
 * EVERY FIGURE IS ENGINE-VERIFIED. The spreadsheet engine, the pivot engine,
 * the Power Query engine, the model and DAX engines and CPython (pandas 3.0.5,
 * matplotlib 3.11.2) were each run against these exact constants, and all six
 * agree: revenue ₦3,033,500, cost ₦2,690,700, margin ₦342,800, 18 orders.
 * `npm run validate:content` re-runs the lot on every build.
 *
 * CLIENT-SAFE. Knowledge-check answers live in lib/academy/assessments/.
 */

export const SECTION_ID = "s18-capstone";

/**
 * THE RAW EXPORT — 20 rows, six defects, exactly as the source system produced
 * it. Do NOT tidy this constant. The mess is the exam paper.
 *
 *   row 4   " Wholesale"      leading space   → SUMIFS silently drops ₦346,500
 *   row 10  ORD-2108 repeated duplicate line  → revenue overstated ₦100,000
 *   row 13  "68600"           number as text  → ISNUMBER is the only detector
 *   row 18  Cost blank        missing COGS    → margin overstated ₦44,000
 *   row 19  "online"          lowercase       → harmless; SUMIFS ignores case
 *   row 21  no Order number   keyless line    → cannot be joined or trusted
 */
const RAW = {
  A1: "Order", B1: "Channel", C1: "Product", D1: "Units", E1: "Amount", F1: "Cost",
  A2: "ORD-2101", B2: "Wholesale", C2: "Palm Oil 5L", D2: 60, E2: 462000, F2: 432000,
  A3: "ORD-2102", B3: "Wholesale", C3: "Rice 25kg", D3: 12, E3: 366000, F3: 336000,
  A4: "ORD-2103", B4: " Wholesale", C4: "Palm Oil 5L", D4: 45, E4: 346500, F4: 324000,
  A5: "ORD-2104", B5: "Wholesale", C5: "Semolina 10kg", D5: 25, E5: 297500, F5: 275000,
  A6: "ORD-2105", B6: "Wholesale", C6: "Groundnut Oil 5L", D6: 40, E6: 344000, F6: 324000,
  A7: "ORD-2106", B7: "Wholesale", C7: "Rice 25kg", D7: 9, E7: 274500, F7: 252000,
  A8: "ORD-2107", B8: "Retail", C8: "Rice 25kg", D8: 4, E8: 136000, F8: 112000,
  A9: "ORD-2108", B9: "Retail", C9: "Tomato Paste", D9: 8, E9: 100000, F9: 76000,
  A10: "ORD-2108", B10: "Retail", C10: "Tomato Paste", D10: 8, E10: 100000, F10: 76000,
  A11: "ORD-2109", B11: "Retail", C11: "Palm Oil 5L", D11: 10, E11: 84000, F11: 72000,
  A12: "ORD-2110", B12: "Retail", C12: "Semolina 10kg", D12: 6, E12: 84000, F12: 66000,
  A13: "ORD-2111", B13: "Retail", C13: "Groundnut Oil 5L", D13: 7, E13: "68600", F13: 56700,
  A14: "ORD-2112", B14: "Retail", C14: "Tomato Paste", D14: 5, E14: 62500, F14: 47500,
  A15: "ORD-2113", B15: "Retail", C15: "Rice 25kg", D15: 3, E15: 102000, F15: 84000,
  A16: "ORD-2114", B16: "Online", C16: "Tomato Paste", D16: 6, E16: 79200, F16: 57000,
  A17: "ORD-2115", B17: "Online", C17: "Rice 25kg", D17: 2, E17: 71000, F17: 56000,
  A18: "ORD-2116", B18: "Online", C18: "Semolina 10kg", D18: 4, E18: 59200, F18: "",
  A19: "ORD-2117", B19: "online", C19: "Groundnut Oil 5L", D19: 5, E19: 52000, F19: 40500,
  A20: "ORD-2118", B20: "Online", C20: "Palm Oil 5L", D20: 5, E20: 44500, F20: 36000,
  A21: "", B21: "Online", C21: "Palm Oil 5L", D21: 5, E21: 44500, F21: 36000,
};

/**
 * THE CLEANED ANALYSIS SHEET — 18 orders, rows 2 to 19. Margin (column F) is
 * deliberately EMPTY: the learner fills it with the drag handle.
 * Revenue ₦3,033,500 · Cost ₦2,690,700 · Margin ₦342,800 (11.30%)
 */
const CLEAN = {
  A1: "Order", B1: "Channel", C1: "Units", D1: "Amount", E1: "Cost", F1: "Margin",
  A2: "ORD-2101", B2: "Wholesale", C2: 60, D2: 462000, E2: 432000,
  A3: "ORD-2102", B3: "Wholesale", C3: 12, D3: 366000, E3: 336000,
  A4: "ORD-2103", B4: "Wholesale", C4: 45, D4: 346500, E4: 324000,
  A5: "ORD-2104", B5: "Wholesale", C5: 25, D5: 297500, E5: 275000,
  A6: "ORD-2105", B6: "Wholesale", C6: 40, D6: 344000, E6: 324000,
  A7: "ORD-2106", B7: "Wholesale", C7: 9, D7: 274500, E7: 252000,
  A8: "ORD-2107", B8: "Retail", C8: 4, D8: 136000, E8: 112000,
  A9: "ORD-2108", B9: "Retail", C9: 8, D9: 100000, E9: 76000,
  A10: "ORD-2109", B10: "Retail", C10: 10, D10: 84000, E10: 72000,
  A11: "ORD-2110", B11: "Retail", C11: 6, D11: 84000, E11: 66000,
  A12: "ORD-2111", B12: "Retail", C12: 7, D12: 68600, E12: 56700,
  A13: "ORD-2112", B13: "Retail", C13: 5, D13: 62500, E13: 47500,
  A14: "ORD-2113", B14: "Retail", C14: 3, D14: 102000, E14: 84000,
  A15: "ORD-2114", B15: "Online", C15: 6, D15: 79200, E15: 57000,
  A16: "ORD-2115", B16: "Online", C16: 2, D16: 71000, E16: 56000,
  A17: "ORD-2116", B17: "Online", C17: 4, D17: 59200, E17: 44000,
  A18: "ORD-2117", B18: "Online", C18: 5, D18: 52000, E18: 40500,
  A19: "ORD-2118", B19: "Online", C19: 5, D19: 44500, E19: 36000,
};

/**
 * The same sheet once the learner has built the margin column in task 4, so
 * the atoms after it can total a column that exists. Margin values, not
 * formulas: the exercise below them reads F2:F19 and must not depend on
 * whether the previous atom's fill is still on screen.
 * Margin total ₦342,800 · Wholesale ₦147,500 · Retail ₦122,900 · Online ₦72,400
 */
const FILLED = {
  ...CLEAN,
  F2: 30000,
  F3: 30000,
  F4: 22500,
  F5: 22500,
  F6: 20000,
  F7: 22500,
  F8: 24000,
  F9: 24000,
  F10: 12000,
  F11: 18000,
  F12: 11900,
  F13: 15000,
  F14: 18000,
  F15: 22200,
  F16: 15000,
  F17: 15200,
  F18: 11500,
  F19: 8500,
};

/** The same 18 orders as a table, for the pivot. Margin is pre-computed here. */
const SOURCE = {
  headers: ["Order", "Month", "Channel", "Product", "Category", "Units", "Amount", "Cost", "Margin"],
  rows: [
    ["ORD-2101", "Jul", "Wholesale", "Palm Oil 5L", "Oils", 60, 462000, 432000, 30000],
    ["ORD-2102", "Jul", "Wholesale", "Rice 25kg", "Grains", 12, 366000, 336000, 30000],
    ["ORD-2103", "Aug", "Wholesale", "Palm Oil 5L", "Oils", 45, 346500, 324000, 22500],
    ["ORD-2104", "Aug", "Wholesale", "Semolina 10kg", "Grains", 25, 297500, 275000, 22500],
    ["ORD-2105", "Sep", "Wholesale", "Groundnut Oil 5L", "Oils", 40, 344000, 324000, 20000],
    ["ORD-2106", "Sep", "Wholesale", "Rice 25kg", "Grains", 9, 274500, 252000, 22500],
    ["ORD-2107", "Jul", "Retail", "Rice 25kg", "Grains", 4, 136000, 112000, 24000],
    ["ORD-2108", "Jul", "Retail", "Tomato Paste", "Condiments", 8, 100000, 76000, 24000],
    ["ORD-2109", "Aug", "Retail", "Palm Oil 5L", "Oils", 10, 84000, 72000, 12000],
    ["ORD-2110", "Sep", "Retail", "Semolina 10kg", "Grains", 6, 84000, 66000, 18000],
    ["ORD-2111", "Jul", "Retail", "Groundnut Oil 5L", "Oils", 7, 68600, 56700, 11900],
    ["ORD-2112", "Aug", "Retail", "Tomato Paste", "Condiments", 5, 62500, 47500, 15000],
    ["ORD-2113", "Sep", "Retail", "Rice 25kg", "Grains", 3, 102000, 84000, 18000],
    ["ORD-2114", "Jul", "Online", "Tomato Paste", "Condiments", 6, 79200, 57000, 22200],
    ["ORD-2115", "Aug", "Online", "Rice 25kg", "Grains", 2, 71000, 56000, 15000],
    ["ORD-2116", "Aug", "Online", "Semolina 10kg", "Grains", 4, 59200, 44000, 15200],
    ["ORD-2117", "Sep", "Online", "Groundnut Oil 5L", "Oils", 5, 52000, 40500, 11500],
    ["ORD-2118", "Sep", "Online", "Palm Oil 5L", "Oils", 5, 44500, 36000, 8500],
  ],
};

/** The raw export again, as a Power Query source. 20 rows in, 18 out. */
const PQ_SOURCE = {
  headers: ["Order", "Channel", "Product", "Units", "Amount", "Cost"],
  rows: [
    ["ORD-2101", "Wholesale", "Palm Oil 5L", 60, 462000, 432000],
    ["ORD-2102", "Wholesale", "Rice 25kg", 12, 366000, 336000],
    ["ORD-2103", " Wholesale", "Palm Oil 5L", 45, 346500, 324000],
    ["ORD-2104", "Wholesale", "Semolina 10kg", 25, 297500, 275000],
    ["ORD-2105", "Wholesale", "Groundnut Oil 5L", 40, 344000, 324000],
    ["ORD-2106", "Wholesale", "Rice 25kg", 9, 274500, 252000],
    ["ORD-2107", "Retail", "Rice 25kg", 4, 136000, 112000],
    ["ORD-2108", "Retail", "Tomato Paste", 8, 100000, 76000],
    ["ORD-2108", "Retail", "Tomato Paste", 8, 100000, 76000],
    ["ORD-2109", "Retail", "Palm Oil 5L", 10, 84000, 72000],
    ["ORD-2110", "Retail", "Semolina 10kg", 6, 84000, 66000],
    ["ORD-2111", "Retail", "Groundnut Oil 5L", 7, "68600", 56700],
    ["ORD-2112", "Retail", "Tomato Paste", 5, 62500, 47500],
    ["ORD-2113", "Retail", "Rice 25kg", 3, 102000, 84000],
    ["ORD-2114", "Online", "Tomato Paste", 6, 79200, 57000],
    ["ORD-2115", "Online", "Rice 25kg", 2, 71000, 56000],
    ["ORD-2116", "Online", "Semolina 10kg", 4, 59200, 44000],
    ["ORD-2117", "online", "Groundnut Oil 5L", 5, 52000, 40500],
    ["ORD-2118", "Online", "Palm Oil 5L", 5, 44500, 36000],
    ["", "Online", "Palm Oil 5L", 5, 44500, 36000],
  ],
};

/**
 * The product lookup, from the purchasing system — which spells one product
 * differently from the sales export. One character, and four order rows worth
 * ₦937,000 fall out of every category total.
 */
const PRODUCTS = {
  name: "Products",
  headers: ["Product", "Category", "Brand"],
  rows: [
    ["Rice 25kg", "Grains", "Adanna"],
    ["Palm Oil 5Ltr", "Oils", "Adanna"],
    ["Tomato Paste", "Condiments", "Adanna"],
    ["Semolina 10kg", "Grains", "Adanna"],
    ["Groundnut Oil 5L", "Oils", "Hausa Gold"],
  ],
};

/** The same lookup with the spelling corrected — used for the DAX lesson. */
const PRODUCTS_FIXED = {
  ...PRODUCTS,
  rows: PRODUCTS.rows.map((r) => (r[0] === "Palm Oil 5Ltr" ? ["Palm Oil 5L", r[1], r[2]] : r)),
};

const ORDERS_FACT = {
  name: "Orders",
  headers: ["Order", "Channel", "Product", "Amount", "Margin"],
  rows: SOURCE.rows.map((r) => [r[0], r[2], r[3], r[6], r[8]]),
};

/**
 * For the orphan lesson the breakdown is labelled by CATEGORY, because that is
 * where the damage shows: the four unmatched Palm Oil rows land under (Blank)
 * and ₦937,000 leaves the category totals.
 */
const MODEL = {
  dim: PRODUCTS,
  fact: ORDERS_FACT,
  dimCol: "Product",
  factCol: "Product",
  labelColumn: "Category",
  measureColumn: "Amount",
};

/**
 * The DAX lessons use the corrected lookup and label by PRODUCT, one row per
 * product — which is the grain the measures are being read at.
 */
const MODEL_FIXED = { ...MODEL, dim: PRODUCTS_FIXED, labelColumn: "Product" };

const CHANNELS = ["Wholesale", "Retail", "Online"];
const REV_SHARE = [68.9, 21.0, 10.1];
const MAR_SHARE = [43.0, 35.9, 21.1];
const CH_REVENUE = [2090500, 637100, 305900];
const CH_MARGIN = [147500, 122900, 72400];

/** The pandas frame, identical to the sheet. Used by every code atom. */
const SETUP = `import pandas as pd

orders = pd.DataFrame({
    "order":   ["ORD-2101","ORD-2102","ORD-2103","ORD-2104","ORD-2105","ORD-2106",
                "ORD-2107","ORD-2108","ORD-2109","ORD-2110","ORD-2111","ORD-2112","ORD-2113",
                "ORD-2114","ORD-2115","ORD-2116","ORD-2117","ORD-2118"],
    "month":   ["Jul","Jul","Aug","Aug","Sep","Sep","Jul","Jul","Aug","Sep","Jul","Aug","Sep",
                "Jul","Aug","Aug","Sep","Sep"],
    "channel": ["Wholesale"]*6 + ["Retail"]*7 + ["Online"]*5,
    "product": ["Palm Oil 5L","Rice 25kg","Palm Oil 5L","Semolina 10kg","Groundnut Oil 5L","Rice 25kg",
                "Rice 25kg","Tomato Paste","Palm Oil 5L","Semolina 10kg","Groundnut Oil 5L","Tomato Paste","Rice 25kg",
                "Tomato Paste","Rice 25kg","Semolina 10kg","Groundnut Oil 5L","Palm Oil 5L"],
    "units":   [60, 12, 45, 25, 40, 9, 4, 8, 10, 6, 7, 5, 3, 6, 2, 4, 5, 5],
    "amount":  [462000, 366000, 346500, 297500, 344000, 274500,
                136000, 100000, 84000, 84000, 68600, 62500, 102000,
                79200, 71000, 59200, 52000, 44500],
    "cost":    [432000, 336000, 324000, 275000, 324000, 252000,
                112000, 76000, 72000, 66000, 56700, 47500, 84000,
                57000, 56000, 44000, 40500, 36000],
})
orders["margin"] = orders["amount"] - orders["cost"]
`;

const PLOT = ["pandas", "matplotlib"];
const PANDAS = ["pandas"];

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════ */
  {
    id: "l84-capstone-brief",
    moduleId: "m4-capstone",
    sectionId: SECTION_ID,
    order: 1,
    title: "Capstone — The Brief and the Audit",
    subtitle: "Six defects, and the one that hides the answer",
    estimatedMinutes: 22,
    intro:
      "From here you are not being taught, you are being asked. Read the brief, then audit the export before you compute a single business figure — because on this data the dirty version does not merely differ from the truth, it points the other way.",

    atoms: [
      {
        id: "a-cap-brief",
        title: "The brief",
        explain:
          "You are the analyst at Adanna Foods, a food distributor. Mrs Okonkwo, the Head of Sales, forwards you last quarter's order export with a note: \"We beat the revenue target, but the MD says our margins are thinning. Which channel should we push in Q4, and is there a product we should drop?\"",
        why: "Two questions, and neither is answered by the number everyone reaches for. Revenue will tell you which channel is biggest; it will not tell you which one is worth having. Keep that distinction in view for the rest of this module, because every wrong answer in it comes from ranking on revenue.",
        table: {
          caption: "What you deliver, and which module it came from.",
          headers: ["Stage", "Deliverable", "Built with"],
          rows: [
            ["1. Audit and clean", "A data-quality note listing every defect and what it cost", "Module 1, lesson 21, lesson 36"],
            ["2. Excel analysis", "A margin column and a KPI block", "Modules 1 and 2"],
            ["3. Power BI", "A refreshable query, a model and measures", "Module 3"],
            ["4. Python", "A notebook that reproduces the lot", "Module 4"],
            ["5. The memo", "Three findings, one recommendation, stated limits", "Lessons 35, 71, 83"],
          ],
          note: "Stage 1 decides whether the other four are worth reading. On this export it also decides whether your headline is 13.19% or 11.30%.",
        },
        mistake:
          "Starting with the dashboard because it is the enjoyable part. Every tile will be confidently wrong, and the error will be invisible to everyone in the room including you.",
      },
      {
        id: "a-cap-reconcile",
        title: "Task 1 — make the parts add up to the whole",
        explain:
          "Before trusting any breakdown, total it and compare with the grand total. Add the three channel subtotals from this export and they do not reach the revenue figure — and the gap is the size of the problem.",
        why: "This is the cheapest audit in analysis and almost nobody does it. A breakdown that does not reconcile with its own total is telling you a row has been dropped, and the tool will never volunteer that.",
        exercise: {
          data: RAW,
          rows: 24,
          cols: 6,
          target: "E23",
          expected: 1744000,
          mustUseFormula: true,
          mustUse: "SUMIFS",
          task: 'In E23, total the Amount column for Wholesale using the data exactly as it stands. Channels are in B2:B21 and amounts in E2:E21.',
          hint: "The range to total comes first, then the range to test, then \"Wholesale\" in double quotes.",
          successMessage:
            "₦1,744,000 — and it is wrong. Wholesale really took ₦2,090,500. B4 holds \" Wholesale\" with a leading space, so SUMIFS never matched ORD-2103 and quietly dropped ₦346,500. Add the three channel subtotals (₦1,744,000 + ₦737,100 + ₦350,400 = ₦2,831,500) against the ₦3,178,000 this sheet totals, and that ₦346,500 gap is exactly what the reconciliation catches.",
        },
        table: {
          caption: "The six defects, and what each one does.",
          headers: ["Row", "Defect", "Effect on the numbers", "Found with"],
          rows: [
            ["4", '" Wholesale" — leading space', "Drops ₦346,500 from Wholesale, silently", "TRIM, or LEN vs LEN(TRIM)"],
            ["10", "ORD-2108 duplicated", "Overstates revenue by ₦100,000", "COUNTIFS on the order number"],
            ["13", '"68600" stored as text', "Ignored by some functions, not others", "ISNUMBER"],
            ["18", "Cost missing", "Overstates margin by ₦44,000", "COUNTBLANK"],
            ["19", '"online" lowercase', "Nothing — SUMIFS ignores case", "EXACT, only if case matters"],
            ["21", "No order number", "A line that cannot be joined or trusted", "COUNTBLANK on the key"],
          ],
          note: "Row 19 earns its place on this list. Knowing which mess is harmless stops you spending a morning fixing something that was never broken.",
        },
      },
      {
        id: "a-cap-blanks",
        title: "Task 2 — find the missing cost",
        explain:
          "Margin is Amount minus Cost, so a blank Cost does not produce an error — it produces a line that looks pure profit. Count the gaps before you build the margin column on top of them.",
        why: "This is the defect that matters most here, and it is the least visible. A missing cost makes an order look 100% profitable, which pushes the blended margin UP. The dirty data flatters the company, so nobody in the business has any reason to question it.",
        exercise: {
          data: RAW,
          rows: 24,
          cols: 6,
          target: "F23",
          expected: 1,
          mustUseFormula: true,
          mustUse: "COUNTBLANK",
          task: "In F23, count how many orders are missing a Cost. Costs are in F2:F21.",
          hint: "One function, one range — the same one you used to profile a column in lesson 21.",
          successMessage:
            "One gap, on ORD-2116. Its ₦59,200 of revenue currently carries no cost at all, so it reads as ₦59,200 of pure margin. Left alone it inflates total margin by ₦44,000 — and ₦44,000 on ₦342,800 is not a rounding difference, it is 13% of the company's entire quarterly profit.",
        },
      },
      {
        id: "a-cap-cost-of-dirt",
        title: "Task 3 — price the dirty data",
        explain:
          "Now compute the headline the export gives you if you do not clean it. Margin percent is revenue minus cost, over revenue — on the data exactly as it arrived.",
        why: "You are about to discover why this stage is not optional. The MD believes margins are thinning; the raw export says they are comfortable. One of them is reading the defects.",
        exercise: {
          data: RAW,
          rows: 24,
          cols: 6,
          target: "E24",
          expected: 13.19,
          mustUseFormula: true,
          mustUse: "ROUND",
          task: "In E24, work out the margin percent from the raw data: revenue minus cost, divided by revenue, times 100 — rounded to 2 decimal places. Amounts are in E2:E21 and costs in F2:F21.",
          hint: "=ROUND((SUM(...)-SUM(...))/SUM(...)*100,2). Use the full ranges including every defective row.",
          successMessage:
            "13.19%. The true figure, once the export is cleaned, is 11.30% — so the dirty data overstates the company's margin by 1.89 percentage points and points you at the wrong conclusion. That gap is the whole reason the MD and the sales report disagree, and finding it is the single most valuable thing you will do in this capstone.",
        },
        kpis: [
          { label: "Margin %, raw export", value: "13.19%", compare: "flattering, and wrong", direction: "up" },
          { label: "Margin %, cleaned", value: "11.30%", compare: "what the MD is seeing", direction: "down" },
          { label: "Overstated by", value: "1.89 pts", compare: "from three defects", direction: "flat" },
        ],
        mistake:
          "Reporting the raw figure because it is the one the export produced and it makes the quarter look good. The defects are yours to find; once the finance team reconciles against the ledger, the gap is yours to explain.",
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  {
    id: "l85-capstone-excel",
    moduleId: "m4-capstone",
    sectionId: SECTION_ID,
    order: 2,
    title: "Capstone — The Excel Analysis Layer",
    subtitle: "A margin column, a KPI block, and the finding hiding behind revenue",
    estimatedMinutes: 26,
    intro:
      "The sheet below is the cleaned export: 18 orders, no duplicates, no missing costs, every channel spelled one way. Column F is empty and waiting for you.",

    atoms: [
      {
        id: "a-cap-fill-margin",
        title: "Task 4 — build the margin column",
        explain:
          "Margin is Amount minus Cost. Write it once in F2, then grab the small square at the bottom-right of the cell and drag it down to F19. Watch the row references move with you.",
        why: "This is the single most-used gesture in Excel, and it is the reason a computed column is safer than 18 typed numbers: change one cost and every figure downstream updates. It is also exactly what a calculated column does in Power BI and what an assignment does in pandas — the same idea, three times.",
        exercise: {
          data: CLEAN,
          rows: 22,
          cols: 6,
          allowFill: true,
          target: "F19",
          expected: 8500,
          mustUseFormula: true,
          task: "Put =D2-E2 in F2, then drag the fill handle down to F19 so every order has a margin. The checker looks at F19.",
          hint: "Click F2, type the formula, press Enter, then click F2 again and drag the small square at its bottom-right corner down the column.",
          successMessage:
            "₦8,500 on ORD-2118, and the whole column filled in one drag. The total margin is ₦342,800 on ₦3,033,500 of revenue — 11.30%, which is the MD's complaint confirmed in one column.",
        },
      },
      {
        id: "a-cap-kpi-layer",
        title: "Task 5 — the KPI block",
        explain:
          "Five numbers answer \"how did the quarter go\": revenue, margin, margin percent, average order value, and revenue against target. Compute the margin percent first, because it is the one the MD asked about.",
        why: "A KPI is a definition before it is a number. \"Margin %\" has to mean margin over revenue, stated once, or two people will compute it two ways — over cost, or per order averaged — and get different answers from the same sheet.",
        exercise: {
          data: FILLED,
          rows: 22,
          cols: 6,
          target: "D21",
          expected: 11.3,
          mustUseFormula: true,
          mustUse: "ROUND",
          task: "The margin column from task 4 is already in place. In D21, compute margin percent for the quarter: total margin over total revenue, times 100, rounded to 1 decimal place.",
          hint: "=ROUND(SUM(F2:F19)/SUM(D2:D19)*100,1)",
          successMessage:
            "11.3%. Revenue beat target at 104.6% (₦3,033,500 against ₦2,900,000) and the margin on it is 11.3% — both true, and only one of them is in the sales report. This is the sentence the whole memo is built on.",
        },
        kpis: [
          { label: "Revenue", value: "₦3,033,500", compare: "104.6% of target", direction: "up", note: "Target ₦2,900,000" },
          { label: "Gross margin", value: "₦342,800", compare: "11.3% of revenue", direction: "down" },
          { label: "Orders", value: "18", compare: "AOV ₦168,528", direction: "flat" },
        ],
        table: {
          caption: "The KPI definitions. Write these down before you compute them.",
          headers: ["KPI", "Definition", "This quarter"],
          rows: [
            ["Revenue", "SUM of Amount, cleaned rows only", "₦3,033,500"],
            ["Cost of sales", "SUM of Cost", "₦2,690,700"],
            ["Gross margin", "Revenue − Cost of sales", "₦342,800"],
            ["Margin %", "Gross margin ÷ Revenue", "11.30%"],
            ["AOV", "Revenue ÷ order count", "₦168,527.78"],
            ["Target attainment", "Revenue ÷ ₦2,900,000", "104.6%"],
          ],
          note: "Six rows, and the third and fourth are the ones that make this analysis different from the sales report. Nobody at Adanna Foods had computed them.",
        },
      },
      {
        id: "a-cap-channel-margin",
        title: "Task 6 — margin rate by channel",
        explain:
          "Now split the two figures by channel. SUMIFS the margin and the revenue for one channel, divide, and you have its margin rate.",
        why: "Wholesale is the biggest channel by a wide margin and the worst by this measure. A single blended 11.30% would have hidden that completely — which is the argument for always cutting a rate by the dimension the business can act on.",
        exercise: {
          data: FILLED,
          rows: 22,
          cols: 6,
          target: "D22",
          expected: 7.06,
          mustUseFormula: true,
          mustUse: "SUMIFS",
          task: "In D22, compute the margin rate for Wholesale: its total margin over its total revenue, times 100, rounded to 2 decimal places. Channels are in B2:B19.",
          hint: "Two SUMIFS, one over the other: =ROUND(SUMIFS(F2:F19,B2:B19,\"Wholesale\")/SUMIFS(D2:D19,B2:B19,\"Wholesale\")*100,2)",
          successMessage:
            "7.06%. Retail runs at 19.29% and Online at 23.67% — Online earns more than three times Wholesale's rate on every naira it takes. Mrs Okonkwo asked which channel to push; you now have the answer, and it is not the big one.",
        },
        table: {
          caption: "The three channels on every measure that matters.",
          headers: ["Channel", "Revenue", "Margin", "Margin %", "Orders", "AOV"],
          rows: [
            ["Wholesale", "₦2,090,500", "₦147,500", "7.06%", "6", "₦348,417"],
            ["Retail", "₦637,100", "₦122,900", "19.29%", "7", "₦91,014"],
            ["Online", "₦305,900", "₦72,400", "23.67%", "5", "₦61,180"],
            ["Total", "₦3,033,500", "₦342,800", "11.30%", "18", "₦168,528"],
          ],
          note: "Read the first column and Wholesale wins outright. Read the fourth and the ranking reverses exactly. Both columns are correct; only one of them answers the question asked.",
        },
      },
      {
        id: "a-cap-share-gap",
        title: "Task 7 — the number that goes in the memo",
        explain:
          "Wholesale takes 68.9% of the revenue. Work out what share of the MARGIN it contributes, and the gap between those two percentages is your headline.",
        why: "A share-of-revenue against share-of-margin comparison is the most persuasive single line in a commercial analysis, because it needs no explanation. Sixty-nine percent of the work for forty-three percent of the profit is a sentence anyone in the room can act on.",
        exercise: {
          data: FILLED,
          rows: 22,
          cols: 6,
          target: "D23",
          expected: 43,
          mustUseFormula: true,
          mustUse: "SUMIFS",
          task: "In D23, compute Wholesale's share of total margin as a percentage, rounded to 1 decimal place.",
          hint: "=ROUND(SUMIFS(F2:F19,B2:B19,\"Wholesale\")/SUM(F2:F19)*100,1)",
          successMessage:
            "43.0%, against a 68.9% share of revenue — a 25.9 point gap. Online is the mirror image: 10.1% of revenue and 21.1% of margin. That is the finding, and it took four formulas.",
        },
        charts: [
          {
            type: "column",
            title: "Share of revenue against share of margin, by channel",
            categories: CHANNELS,
            series: [
              { name: "Share of revenue", values: REV_SHARE },
              { name: "Share of margin", values: MAR_SHARE },
            ],
            valueSuffix: "%",
            caption:
              "Wholesale is the only channel whose revenue bar towers over its margin bar. Retail and Online both punch above their weight — Online contributes twice the margin share its revenue share would suggest.",
          },
        ],
        mistake:
          "Presenting the revenue chart alone because it is the one that was asked for. Revenue by channel is a true chart that recommends the opposite of the right action, and that is far more dangerous than a chart which is obviously wrong.",
      },
      {
        id: "a-cap-pivot-mix",
        title: "Task 8 — why the rates differ at all",
        explain:
          "You know Wholesale earns 7.06% and Online 23.67%. Now cross product against channel and look at where each product actually sells. Put Product in Rows, Channel in Columns and Amount in Values.",
        why: "This is the atom that turns a description into an explanation. The product margin rates you found in the DAX table are not really telling you about products — they are telling you about channel mix, and that changes what you recommend.",
        pivotExercise: {
          source: SOURCE,
          wells: "excel",
          task:
            "Drag Product into Rows, Channel into Columns and Amount into Values as a Sum. You are asking: how much of each product goes through each channel?",
          expect: { row: "Product", column: "Channel", value: "Amount", agg: "sum" },
          successMessage:
            "Fifteen numbers and two sets of totals from three drags. Look at the two extremes: Palm Oil sells ₦808,500 of its ₦937,000 through Wholesale — 86% — and Tomato Paste sells nothing through Wholesale at all.",
        },
        table: {
          caption: "Wholesale share of each product, against its margin rate.",
          headers: ["Product", "Through Wholesale", "Share of its revenue", "Margin rate"],
          rows: [
            ["Palm Oil 5L", "₦808,500", "86.3%", "7.79%"],
            ["Groundnut Oil 5L", "₦344,000", "74.0%", "9.34%"],
            ["Rice 25kg", "₦640,500", "67.5%", "11.53%"],
            ["Semolina 10kg", "₦297,500", "67.5%", "12.64%"],
            ["Tomato Paste", "₦0", "0.0%", "25.32%"],
          ],
          note: "Read the last two columns together: the more of a product that goes through Wholesale, the thinner its margin rate — almost exactly in order. Rice and Semolina are effectively tied on mix at 67.5%, so the small gap between their rates is something else. The two extremes are the case: Palm Oil is a wholesale product earning wholesale margins, and Tomato Paste's excellent 25.32% is partly the fact that it never goes through Wholesale at all.",
        },
        mistake:
          "Concluding from the DAX table that Palm Oil is an unprofitable product and Tomato Paste a brilliant one. On this data the product ranking is largely a channel ranking wearing a different label — which is why the recommendation is about wholesale pricing rather than about the product range.",
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  {
    id: "l86-capstone-powerbi",
    moduleId: "m4-capstone",
    sectionId: SECTION_ID,
    order: 3,
    title: "Capstone — The Power BI Layer",
    subtitle: "Clean it once, model it, then measure it",
    estimatedMinutes: 24,
    intro:
      "Excel answered the question for this quarter. Power BI answers it for every quarter from now on, because the cleaning becomes a recipe that reruns on refresh. Same data, same answers — and one new defect that only a model can show you.",

    atoms: [
      {
        id: "a-cap-pq-clean",
        title: "Task 9 — the cleaning recipe",
        explain:
          "Build the whole audit from lesson 84 as Applied Steps. Twenty rows go in. Watch the row count as each step lands, and stop when the output matches your Excel sheet.",
        why: "Everything you did by hand in Excel, you did once. This recipe runs on next quarter's export automatically — and the Applied Steps list is a written record of every change you made to the data, which is the documentation stage-one demands.",
        queryExercise: {
          source: PQ_SOURCE,
          task:
            "Produce a clean table of exactly 18 rows where Channel has no stray spaces and one consistent capitalisation, Amount is fully numeric, the duplicated order is gone, and the line with no order number is gone. Watch the row count in the Applied Steps list as you work.",
          expect: {
            headers: ["Order", "Channel", "Product", "Units", "Amount", "Cost"],
            rows: 18,
            numericColumn: "Amount",
            trimmedColumn: "Channel",
          },
          successMessage:
            "Eighteen rows, revenue ₦3,033,500, cost ₦2,690,700 — identical to your Excel sheet, which is the reconciliation that proves both are right. The row count told the story: 20 in, 19 after removing the duplicate order, 18 after dropping the keyless line.",
        },
        table: {
          caption: "The recipe, and what each step was for.",
          headers: ["Step", "Fixes", "Rows after"],
          rows: [
            ["Trim Channel", 'The " Wholesale" leading space', "20"],
            ["Capitalise Each Word on Channel", 'The "online" lowercase row', "20"],
            ["Change Type on Amount → number", 'The "68600" text value', "20"],
            ["Remove Duplicates on Order", "The repeated ORD-2108", "19"],
            ["Remove Blank Rows on Order", "The line with no order number", "18"],
          ],
          note: "The first three steps change values and no rows; the last two change rows. That is why you read the row count after every step — a step that removes rows you did not expect it to remove is the most common way a refresh quietly loses data.",
        },
      },
      {
        id: "a-cap-model-orphan",
        title: "Task 10 — join the product lookup, and read the warning",
        explain:
          "Purchasing keeps the product catalogue with its categories. Join it to your orders on the product name, then look at what does not match.",
        why: "This is the defect no amount of staring at the orders export would reveal, because the orders are fine. The mismatch lives BETWEEN two systems, and only building the relationship exposes it.",
        modelExercise: {
          ...MODEL,
          task:
            "Click Product in Products and Product in Orders to join the two tables. Read the cardinality that gets detected, and then read the warning underneath it carefully.",
          expect: { dimCol: "Product", factCol: "Product", cardinality: "one-to-many" },
          successMessage:
            "One-to-many, Products to Orders — correct. Now the warning: four order rows carry \"Palm Oil 5L\", and the catalogue spells it \"Palm Oil 5Ltr\". Those four rows are orphans worth ₦937,000 of revenue and ₦73,000 of margin, and every category total is missing them. Oils reads ₦464,600 when it should read ₦1,401,600.",
        },
        table: {
          caption: "What one character costs, per category.",
          headers: ["Category", "With the mismatch", "After fixing the spelling"],
          rows: [
            ["Oils", "₦464,600", "₦1,401,600"],
            ["Grains", "₦1,390,200", "₦1,390,200"],
            ["Condiments", "₦241,700", "₦241,700"],
            ["Shown in the report", "₦2,096,500", "₦3,033,500"],
          ],
          note: "The report total drops by ₦937,000 — 31% of the quarter — and no error appears anywhere. In Power BI those rows land under a (Blank) category row, which is the signal to look for every single time you build a relationship.",
        },
        mistake:
          "Fixing it by deleting the (Blank) row from the visual. The rows are real orders; the catalogue is what is wrong. Correct the spelling at the source, or add a step in Power Query that maps it — never hide the evidence that a join is failing.",
      },
      {
        id: "a-cap-dax-measures",
        title: "Task 11 — the measures",
        explain:
          "Three measures carry the entire analysis: Revenue, Margin, and Margin % as a ratio of the two. Written once, they answer per product, per channel, per month and for the company, depending only on what filters the visual.",
        why: "Look at the Margin % column against the Revenue column. Rice and Palm Oil are neck and neck on revenue — ₦949,500 and ₦937,000 — and Palm Oil earns barely two thirds of Rice's margin at 7.79% against 11.53%. Tomato Paste is last on revenue and first on rate at 25.32%.",
        dax: {
          model: MODEL_FIXED,
          measures: [
            { name: "Revenue", kind: "sum", column: "Amount", dax: "Revenue = SUM(Orders[Amount])" },
            { name: "Margin", kind: "sum", column: "Margin", dax: "Margin = SUM(Orders[Margin])" },
            {
              name: "Margin %",
              kind: "ratio",
              of: "Margin",
              over: "Revenue",
              format: "percent",
              dax: "Margin % = DIVIDE([Margin], [Revenue])",
            },
          ],
          allowToggle: false,
          caption:
            "Read the row counts: Rice evaluates over 5 order rows, Tomato Paste over 3, the Total row over all 18. One definition of Margin %, five different answers, and a Total of 11.30% that is not the average of the five — because it is margin over revenue for the whole company, not a mean of the rates.",
        },
        table: {
          caption: "Products ranked by revenue, with their margin rank beside it.",
          headers: ["Product", "Revenue", "Margin", "Margin %", "Revenue rank", "Margin rank"],
          rows: [
            ["Rice 25kg", "₦949,500", "₦109,500", "11.53%", "1", "1"],
            ["Palm Oil 5L", "₦937,000", "₦73,000", "7.79%", "2", "2"],
            ["Groundnut Oil 5L", "₦464,600", "₦43,400", "9.34%", "3", "5"],
            ["Semolina 10kg", "₦440,700", "₦55,700", "12.64%", "4", "4"],
            ["Tomato Paste", "₦241,700", "₦61,200", "25.32%", "5", "3"],
          ],
          note: "Mrs Okonkwo asked whether there is a product to drop. The obvious candidate on revenue is Tomato Paste, last at ₦241,700 — and it is the third largest margin earner in the range. Drop it and the company loses ₦61,200 of profit to save ₦241,700 of turnover.",
        },
      },
      {
        id: "a-cap-dax-all",
        title: "Task 12 — percent of total, and the bug that returns 100%",
        explain:
          "A share-of-total measure needs a denominator that ignores the row's own filter. Tick the toggle to remove ALL(Products) and watch every row report 100%.",
        why: "You have met this bug before, and it is here because a percent-of-total is exactly what the memo needs: Rice at 31.30% of revenue, Palm Oil at 30.89%. If those columns ever read 100% down the page, the denominator is being filtered along with the numerator.",
        dax: {
          model: MODEL_FIXED,
          measures: [
            { name: "Revenue", kind: "sum", column: "Amount", dax: "Revenue = SUM(Orders[Amount])" },
            {
              name: "All Revenue",
              kind: "sumAll",
              column: "Amount",
              dax: "All Revenue = CALCULATE(SUM(Orders[Amount]), ALL(Products))",
              daxBroken: "All Revenue = SUM(Orders[Amount])          ← ALL() removed",
            },
            {
              name: "% of Total",
              kind: "ratio",
              of: "Revenue",
              over: "All Revenue",
              format: "percent",
              dax: "% of Total = DIVIDE([Revenue], [All Revenue])",
            },
          ],
          allowToggle: true,
          caption:
            "With ALL(Products), All Revenue stays at ₦3,033,500 on every row and the shares read 31.30%, 30.89%, 7.97%, 14.53% and 15.32%. Remove it and the denominator shrinks to each row's own revenue, so every share is 100% — a bug that looks like a formatting problem and is not.",
        },
        mistake:
          "Seeing a column of 100% and assuming the percentage format is wrong. The format is fine; the denominator collapsed. That distinction is worth remembering because it costs people whole afternoons.",
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  {
    id: "l87-capstone-python",
    moduleId: "m4-capstone",
    sectionId: SECTION_ID,
    order: 4,
    title: "Capstone — The Python Deep-Dive",
    subtitle: "Reproduce the lot in twelve lines, then go further than a pivot can",
    estimatedMinutes: 24,
    intro:
      "Third tool, same numbers. If pandas does not return ₦3,033,500 and ₦342,800, one of your three analyses is wrong and you now know to find out which. Then you use Python for what the other two cannot do: test whether volume is actually buying you anything.",

    atoms: [
      {
        id: "a-cap-py-reconcile",
        title: "Task 13 — reconcile against Excel and Power BI",
        explain:
          "Four lines: the order count, the revenue, the margin and the margin percent. These are the four figures your other two tools produced.",
        codeExercise: {
          code: SETUP + '\nprint(len(orders))\nprint(orders["amount"].sum())\nprint(orders["margin"].sum())\nprint(round(orders["margin"].sum() / orders["amount"].sum() * 100, 2))\n',
          question:
            "Eighteen cleaned orders. What are the four lines — count, revenue, margin, and margin percent to 2 decimal places?",
          expectedOutput: "18\n3033500\n342800\n11.3",
          runnable: true,
          packages: PANDAS,
          hint: "The figures are the ones your Excel KPI block produced. Note what round() does to a trailing zero.",
          successMessage:
            "18, ₦3,033,500, ₦342,800, 11.3% — three tools, one answer. Note the last line prints 11.3 and not 11.30: round() returns a number, and a number has no trailing zero. That is a formatting job for the report, not a maths error.",
        },
        why: "A three-way reconciliation is the strongest evidence you can put in a portfolio. It says the numbers are not an artefact of one tool's defaults, and it is the reason this capstone repeats itself deliberately.",
      },
      {
        id: "a-cap-py-channel",
        title: "Task 14 — the channel table, in five lines",
        explain:
          "groupby with a named aggregation gives you the whole channel analysis at once, and an assignment adds the rate. Five lines for what took four SUMIFS and a pivot.",
        codeExercise: {
          code: SETUP + '\nby_ch = orders.groupby("channel").agg(\n    revenue=("amount", "sum"),\n    margin=("margin", "sum"),\n)\nby_ch["margin_pct"] = (by_ch["margin"] / by_ch["revenue"] * 100).round(2)\nprint(by_ch.sort_values("revenue", ascending=False))\n',
          question:
            "Wholesale ₦2,090,500, Retail ₦637,100, Online ₦305,900, sorted by revenue descending. What does the table print?",
          expectedOutput:
            "           revenue  margin  margin_pct\nchannel\nWholesale  2090500  147500        7.06\nRetail      637100  122900       19.29\nOnline      305900   72400       23.67",
          runnable: true,
          packages: PANDAS,
          hint: "Three rows and three columns, with channel as the index. The margin rates are the ones your SUMIFS produced.",
          successMessage:
            "The same three rates: 7.06%, 19.29%, 23.67%. Sorted by revenue the margin rate runs backwards down the column, which is the entire finding visible in one glance — and this is the version that goes in the notebook, because the next person can re-run it.",
        },
        why: "Named aggregation is worth the extra typing: revenue=(\"amount\", \"sum\") states what the output column is called, so the table needs no explaining. Compare it with the multi-level column mess that .agg([\"sum\"]) produces.",
      },
      {
        id: "a-cap-py-corr",
        title: "Task 15 — does volume buy you anything?",
        explain:
          "Wholesale moves 191 of the quarter's 256 units. Test whether units predict revenue, then whether units predict margin — and watch the two answers diverge.",
        codeExercise: {
          code: SETUP + '\nprint(round(orders["units"].corr(orders["amount"]), 3))\nprint(round(orders["units"].corr(orders["margin"]), 3))\nprint(round(orders["amount"].corr(orders["cost"]), 3))\n',
          question:
            "Three correlations: units against amount, units against margin, and amount against cost. What prints?",
          expectedOutput: "0.848\n0.514\n1.0",
          runnable: true,
          packages: PANDAS,
          hint: "The first is strong. The second is much weaker. The third should make you suspicious rather than pleased.",
          successMessage:
            "0.848, 0.514 and 1.0 — and all three matter. Units strongly predict revenue and only weakly predict margin, which is the statistical form of \"volume is not buying us profit\". And the 1.0 is the trap from lesson 82: cost is essentially amount times a constant on this data, so correlating them discovers nothing.",
        },
        why: "This is the one finding neither Excel nor the dashboard produced, and it is the one that turns a description into an argument. The business case for pushing wholesale volume rests on volume converting to profit, and on this quarter's data it barely does.",
        table: {
          caption: "Reading the three coefficients.",
          headers: ["Pair", "r", "What it licenses you to say"],
          rows: [
            ["units ~ amount", "0.848", "Bigger orders do contain more units here"],
            ["units ~ margin", "0.514", "Volume is a much weaker guide to profit"],
            ["amount ~ cost", "1.0", "Nothing — one is derived from the other"],
          ],
          note: "None of these establishes cause. They are consistent with a wholesale pricing policy that trades margin for volume, which is a hypothesis to put to Mrs Okonkwo, not a conclusion to publish.",
        },
      },
      {
        id: "a-cap-py-chart",
        title: "Task 16 — the chart that carries the memo",
        explain:
          "Share of revenue beside share of margin, one pair of bars per channel, sorted, labelled and starting at zero. Press Run and change something.",
        code: {
          code: SETUP + '\nimport matplotlib.pyplot as plt\n\nby_ch = orders.groupby("channel")[["amount", "margin"]].sum()\nrev_share = (by_ch["amount"] / by_ch["amount"].sum() * 100)\nmar_share = (by_ch["margin"] / by_ch["margin"].sum() * 100)\norder = rev_share.sort_values(ascending=False).index\n\nx = range(len(order))\nfig, ax = plt.subplots(figsize=(6.5, 3.4))\nax.bar([i - 0.2 for i in x], rev_share[order], width=0.4, label="Share of revenue", color="#3b52f0")\nax.bar([i + 0.2 for i in x], mar_share[order], width=0.4, label="Share of margin", color="#d97706")\nax.set_xticks(list(x))\nax.set_xticklabels(list(order))\nax.set_ylim(0)\nax.set_ylabel("% of company total")\nax.set_title("Wholesale earns far less margin than its revenue suggests")\nax.legend(frameon=False)\nax.spines[["top", "right"]].set_visible(False)\nprint([round(v, 1) for v in rev_share[order]])\nprint([round(v, 1) for v in mar_share[order]])\n',
          expectedOutput: "[68.9, 21.0, 10.1]\n[43.0, 35.9, 21.1]",
          runnable: true,
          packages: PLOT,
        },
        why: "Every rule from the visualisation modules is in those fourteen lines: two series so a legend is required, one colour each, sorted by the primary measure, a zero baseline because these are bars, and a title that states the finding. Try ax.set_ylim(35) and watch how much more dramatic — and how much less honest — the same data looks.",
      },
      {
        id: "a-cap-py-scatter",
        title: "Task 17 — and the chart that proves it",
        explain:
          "Order value across, order margin up, coloured by channel. Three clusters appear, and the largest orders are not at the top.",
        code: {
          code: SETUP + '\nimport matplotlib.pyplot as plt\n\nfig, ax = plt.subplots(figsize=(6, 3.2))\nfor ch, colour in [("Wholesale", "#3b52f0"), ("Retail", "#d97706"), ("Online", "#0d9488")]:\n    part = orders[orders["channel"] == ch]\n    ax.scatter(part["amount"], part["margin"], s=55, label=ch, color=colour)\nax.set_xlabel("Order value (NGN)")\nax.set_ylabel("Order margin (NGN)")\nax.set_title("Big orders are not the profitable ones")\nax.legend(frameon=False)\nax.spines[["top", "right"]].set_visible(False)\nprint("points:", len(orders))\n',
          expectedOutput: "points: 18",
          runnable: true,
          packages: PLOT,
        },
        why: "The blue cluster sits far to the right and no higher than the rest: ORD-2101 is the quarter's largest order at ₦462,000 and returns ₦30,000 of margin, while ORD-2114 at ₦79,200 returns ₦22,200. Colouring by channel is what turns a vague cloud into three groups with different economics.",
        mistake:
          "Running the IQR outlier rule on this column and excluding the big orders. The fence sits at ₦625,575 and nothing exceeds it, so the rule says there are no outliers — the wholesale orders are genuinely large, not erroneous. Apply the rule; do not overrule it because a value looks big.",
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  {
    id: "l88-capstone-deliver",
    moduleId: "m4-capstone",
    sectionId: SECTION_ID,
    order: 5,
    title: "Capstone — The Memo and the Portfolio",
    subtitle: "One chart, three findings, one recommendation, stated limits",
    estimatedMinutes: 22,
    intro:
      "Everything so far was analysis. This is the part Mrs Okonkwo actually reads, and the part a hiring manager judges you on. Four atoms, and none of them involves a new function.",

    atoms: [
      {
        id: "a-cap-chart-choice",
        title: "Task 18 — choose the chart she needs",
        explain:
          "You have one slide. Mrs Okonkwo asked which channel to push in Q4. Pick the chart that answers that question with the least work from her.",
        chartChoice: {
          question:
            "Which chart answers \"which channel should we push?\" — not which chart is prettiest, and not which one she asked for?",
          correct: "paired",
          options: [
            {
              id: "paired",
              label: "Share of revenue beside share of margin",
              chart: {
                type: "column",
                categories: CHANNELS,
                series: [
                  { name: "Share of revenue", values: REV_SHARE },
                  { name: "Share of margin", values: MAR_SHARE },
                ],
                valueSuffix: "%",
              },
            },
            {
              id: "revenue",
              label: "Revenue by channel",
              chart: {
                type: "bar",
                categories: CHANNELS,
                series: [{ name: "Revenue", values: CH_REVENUE }],
                valuePrefix: "₦",
              },
              whyWrong:
                "Correct data, and it recommends the wrong action. Wholesale's bar is three times the next one, so the slide says \"push Wholesale\" — the channel earning 7.06%. A true chart that leads to a bad decision is the most dangerous thing in this course.",
            },
            {
              id: "margin",
              label: "Margin by channel",
              chart: {
                type: "bar",
                categories: CHANNELS,
                series: [{ name: "Margin", values: CH_MARGIN }],
                valuePrefix: "₦",
              },
              whyWrong:
                "Better, and still incomplete. Wholesale contributes the most margin in naira (₦147,500), so on its own this chart still points at Wholesale. The finding only appears when margin is set against the revenue it took to earn it.",
            },
            {
              id: "pie",
              label: "Pie of revenue share",
              chart: {
                type: "pie",
                categories: CHANNELS,
                series: [{ name: "Share", values: REV_SHARE }],
                valueSuffix: "%",
              },
              whyWrong:
                "One measure, drawn as angles, for three categories that a bar chart handles better — and it shows the revenue side only, which is the half that misleads. Two of the three slices are also close enough that judging them by angle is guesswork.",
            },
          ],
          successMessage:
            "The paired chart, because the finding IS the comparison. Wholesale's revenue bar towers over its margin bar; Online's does the opposite. No other arrangement of these numbers makes the recommendation visible without a paragraph of explanation.",
        },
        why: "Note that the question Mrs Okonkwo asked and the chart she needs are different things. Answering the literal request with a revenue chart would have been defensible, easy, and wrong.",
      },
      {
        id: "a-cap-memo",
        title: "Task 19 — write the memo",
        explain:
          "Three findings, one recommendation, and the arithmetic behind it. Each finding is one sentence with its figure attached; the recommendation is one action with its expected effect.",
        why: "Nobody will read your workbook, your model or your notebook. They will read five sentences, and those five sentences are where all the work either lands or evaporates.",
        example: `TO: Mrs Okonkwo, Head of Sales
RE: Q3 channel and product performance
DATA: 18 orders, Jul-Sep. Revenue reconciled at ₦3,033,500 across Excel,
      Power BI and Python. Six data defects corrected; see the quality note.

1. We beat the revenue target and the margin is thin. Revenue was
   ₦3,033,500 against a ₦2,900,000 target (104.6%), at a gross margin of
   11.30% (₦342,800).

2. Wholesale carries the quarter and earns the least on it. It is 68.9% of
   revenue but only 43.0% of margin, at a 7.06% margin rate against
   Retail's 19.29% and Online's 23.67%.

3. Volume is not converting to profit. Units correlate with revenue at
   r = 0.85 but with margin at only r = 0.51.

RECOMMENDATION: reprice wholesale Palm Oil rather than chase volume. It
took ₦808,500 of wholesale revenue at a 6.5% margin. A 5% price rise, if
volume holds, adds ₦40,425 of margin and lifts the company rate from
11.30% to 12.47% - more than the whole Online channel contributed.

DO NOT drop Tomato Paste. It is last on revenue (₦241,700) and third on
margin (₦61,200), at the best rate in the range (25.32%).

LIMITS: one quarter, 18 orders, three months. The monthly figures fall from
₦1,211,800 to ₦901,000 but three points is not a trend. The repricing
figure assumes volume holds, which this data cannot test.`,
        table: {
          caption: "Where each line of the memo came from.",
          headers: ["Memo line", "Produced by", "Verified in"],
          rows: [
            ["Revenue and attainment", "SUM and a target divide", "All three tools"],
            ["Margin 11.30%", "The filled margin column", "Excel, DAX, pandas"],
            ["68.9% against 43.0%", "Two SUMIFS over two totals", "Excel and pandas"],
            ["r = 0.85 and r = 0.51", "Series.corr()", "Python only"],
            ["+₦40,425 and 12.47%", "A modelled 5% price rise", "Python"],
            ["Tomato Paste ranks", "Pivot and DAX measures", "Power BI and pandas"],
          ],
          note: "Six lines, six different places the figure came from, and every one of them re-runnable by whoever doubts you. That is what makes a memo defensible rather than merely confident.",
        },
      },
      {
        id: "a-cap-limits",
        title: "Task 20 — what you may not claim",
        explain:
          "The analysis supports four statements and tempts you into four more. The difference between the columns below is most of what separates a trusted analyst from a clever one.",
        why: "Every technical step in this capstone can be checked by someone else. The claims cannot, which makes them the only place your judgement is genuinely visible — and the one place an overstatement does lasting damage.",
        table: {
          caption: "Four temptations, and what the data actually supports.",
          headers: ["Do not write", "Write instead"],
          rows: [
            ["Wholesale is unprofitable", "Wholesale runs at a 7.06% margin rate, against 19.29% Retail and 23.67% Online"],
            ["Discounting drives wholesale volume", "Wholesale carries the volume and the lowest rate; the cause is not established here"],
            ["Q4 revenue will fall below ₦900,000", "Revenue fell from ₦1,211,800 in July to ₦901,000 in September; three months cannot support a forecast"],
            ["Online is our best channel", "Online has the best margin rate on 5 orders and 10.1% of revenue — too few orders to conclude it would hold at scale"],
          ],
          note: "That last row is the one people miss. Online's 23.67% is the best rate in the business and it rests on five orders, so the honest recommendation is to TEST growing it, not to bet the quarter on it.",
        },
        mistake:
          "Writing the causal version because the hedged one sounds weak. The hedged one survives the meeting, the follow-up questions and the next quarter's data. Confidence you cannot defend is the most expensive thing you can put in a memo.",
      },
      {
        id: "a-cap-portfolio",
        title: "Task 21 — what goes in the portfolio",
        explain:
          "Five artefacts, and a README that explains what you found rather than what you used. Publish them where a hiring manager can open them in one click.",
        why: "This is the last atom of the course, so it is worth being blunt: nobody is going to take your word for what you can do. The five files below are the evidence, and the README is the only part most people will read — so it leads with the finding, not the tooling.",
        table: {
          caption: "The five deliverables, and what each one proves about you.",
          headers: ["Artefact", "Contains", "What it demonstrates"],
          rows: [
            ["Cleaned dataset + quality note", "18 rows, and all six defects with what each cost", "You audit before you analyse"],
            ["Excel workbook", "The margin column and the KPI block", "You can work where the business works"],
            ["Power BI file", "The query recipe, the model, the measures", "You build something that refreshes"],
            ["Python notebook", "The reconciliation, the correlations, the charts", "You can reproduce and go further"],
            ["The memo", "Three findings, one recommendation, stated limits", "You can be trusted with a conclusion"],
          ],
          note: "The quality note is the one people leave out and the one that impresses most, because it is the only artefact that shows you found something nobody told you to look for.",
        },
        example: `README — Adanna Foods Q3 channel and margin analysis

FINDING: the company beat its revenue target at 104.6% and earns 11.30%
gross margin. Wholesale is 68.9% of revenue and 43.0% of margin. The
recommendation is a targeted wholesale price rise, not volume growth.

Revenue reconciles at ₦3,033,500 across Excel, Power BI and Python.
Six data defects were found and corrected before analysis; reading the
export as delivered overstates margin by 1.89 points, at 13.19%.

Tools: Excel (SUMIFS, pivots), Power BI (Power Query, star schema, DAX),
Python (pandas, matplotlib). Data: 18 orders, Jul-Sep, anonymised.`,
        mistake:
          "A README that opens with \"This project uses pandas, Power BI and Excel\". Every applicant's does. Open with what you found, because that is the sentence that distinguishes you — and put the tool list at the bottom where it belongs.",
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },
];
