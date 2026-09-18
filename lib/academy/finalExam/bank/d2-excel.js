/**
 * EXAM BANK · DOMAIN 2 — EXCEL ANALYSIS AND REPORTING
 *
 * SERVER ONLY. Carries the answer key.
 *
 * Half of this domain is `formula` items: the candidate is shown the case
 * sheet read-only and must WRITE a working formula, which the server then
 * evaluates with the same engine that powers the lessons. That is the closest
 * this exam gets to a performance test, and it is why `expected` never leaves
 * the server.
 *
 * Every `expected` below was produced by running the formula against the case
 * sheet in lib/academy/spreadsheet/engine.js — not by hand.
 *
 * `mustUse` stops a candidate typing the literal answer into the cell. It
 * matches the function name followed by an optional dotted suffix, so MEDIAN
 * is satisfied by MEDIAN( and RANK by RANK.EQ(.
 */

export const ITEMS = [
  /* ── core (difficulty 3-4) ──────────────────────────────────────────── */
  {
    id: "x-d2-001",
    domain: "d2-excel",
    difficulty: 3,
    topic: "sumifs-single",
    skill: "SUMIFS with one criterion",
    caseId: "adanna",
    type: "formula",
    prompt:
      "Total the revenue taken through the Wholesale channel. Channels are in B2:B19 and amounts in E2:E19.",
    target: "E21",
    hintRange: "B2:B19 and E2:E19",
    expected: 2090500,
    mustUse: "SUMIFS",
  },
  {
    id: "x-d2-002",
    domain: "d2-excel",
    difficulty: 4,
    topic: "countifs-two",
    skill: "COUNTIFS with two criteria",
    caseId: "zuri",
    type: "formula",
    prompt:
      "How many appointments were booked by Phone AND ended as a No-show? Booking channels are in C2:C21 and statuses in D2:D21.",
    target: "E23",
    hintRange: "C2:C21 and D2:D21",
    expected: 5,
    mustUse: "COUNTIFS",
  },
  {
    id: "x-d2-003",
    domain: "d2-excel",
    difficulty: 4,
    topic: "averageifs",
    skill: "AVERAGEIFS",
    caseId: "adanna",
    type: "formula",
    prompt:
      "What is the average order value for the Online channel, rounded to 2 decimal places? Channels are in B2:B19, amounts in E2:E19.",
    target: "E21",
    hintRange: "B2:B19 and E2:E19",
    expected: 61180,
    mustUse: "AVERAGEIFS",
  },
  {
    id: "x-d2-004",
    domain: "d2-excel",
    difficulty: 4,
    topic: "sumifs-two",
    skill: "SUMIFS with two criteria",
    caseId: "zuri",
    type: "formula",
    prompt:
      "What is the total fee value of appointments at the Ikeja clinic that were Attended? Clinics are in B2:B21, statuses in D2:D21, fees in E2:E21.",
    target: "E23",
    hintRange: "B2:B21, D2:D21 and E2:E21",
    expected: 126000,
    mustUse: "SUMIFS",
  },
  {
    id: "x-d2-005",
    domain: "d2-excel",
    difficulty: 4,
    topic: "margin-rate-formula",
    skill: "Deriving a rate from two totals",
    caseId: "solar",
    type: "formula",
    prompt:
      "Compute the company's NET margin as a percentage, rounded to 2 decimal places: price less install cost less warranty cost, over price. Prices are in E2:E13, install costs in F2:F13, warranty costs in G2:G13.",
    target: "E15",
    hintRange: "E2:E13, F2:F13 and G2:G13",
    expected: 21.32,
    mustUse: "ROUND",
  },
  {
    id: "x-d2-006",
    domain: "d2-excel",
    difficulty: 3,
    topic: "sumifs-warranty",
    skill: "SUMIFS on a derived cost",
    caseId: "solar",
    type: "formula",
    prompt:
      "Total the warranty cost incurred on SME jobs. Packages are in D2:D13 and warranty costs in G2:G13.",
    target: "E15",
    hintRange: "D2:D13 and G2:G13",
    expected: 880000,
    mustUse: "SUMIFS",
  },
  {
    id: "x-d2-007",
    domain: "d2-excel",
    difficulty: 4,
    topic: "averageifs-route",
    skill: "AVERAGEIFS on a subset",
    caseId: "logistics",
    type: "formula",
    prompt:
      "What is the mean ACTUAL delivery time in days on the Lagos-Kano route, rounded to 2 decimal places? Routes are in B2:B17 and actual days in D2:D17.",
    target: "D19",
    hintRange: "B2:B17 and D2:D17",
    expected: 10,
    mustUse: "AVERAGEIFS",
  },
  {
    id: "x-d2-008",
    domain: "d2-excel",
    difficulty: 3,
    topic: "median-column",
    skill: "MEDIAN",
    caseId: "logistics",
    type: "formula",
    prompt:
      "What is the median actual delivery time across all sixteen deliveries? Actual days are in D2:D17.",
    target: "D19",
    hintRange: "D2:D17",
    expected: 4,
    mustUse: "MEDIAN",
  },
  {
    id: "x-d2-009",
    domain: "d2-excel",
    difficulty: 4,
    topic: "rate-from-counts",
    skill: "A rate from two counts",
    caseId: "zuri",
    type: "formula",
    prompt:
      "What percentage of Ikeja's appointments were no-shows, rounded to 1 decimal place? Clinics are in B2:B21 and statuses in D2:D21.",
    target: "E23",
    hintRange: "B2:B21 and D2:D21",
    expected: 20,
    mustUse: "COUNTIFS",
  },
  {
    id: "x-d2-010",
    domain: "d2-excel",
    difficulty: 3,
    topic: "absolute-refs",
    skill: "Absolute references when filling",
    caseId: null,
    type: "mcq",
    prompt:
      "In F2 you write =E2/E20, where E20 holds the grand total, then fill down to F19. What happens?",
    options: [
      { id: "a", text: "Every row after the first divides by the wrong cell, because E20 shifts to E21, E22 and so on" },
      { id: "b", text: "It works, because Excel knows E20 is a total" },
      { id: "c", text: "It returns #REF! on every row" },
      { id: "d", text: "It works, but only for the first ten rows" },
    ],
    correct: "a",
    explanation:
      "A relative reference moves with the fill. The denominator must be locked as $E$20, and the shares below the first row are otherwise quietly wrong rather than obviously broken.",
  },
  {
    id: "x-d2-011",
    domain: "d2-excel",
    difficulty: 4,
    topic: "pivot-count-vs-sum",
    skill: "Pivot aggregation",
    caseId: null,
    type: "mcq",
    prompt:
      "You drag Amount into a pivot's Values area and it summarises as Count rather than Sum. What is the most likely cause?",
    options: [
      { id: "a", text: "The column contains at least one non-numeric value, such as a blank or a number stored as text" },
      { id: "b", text: "Pivot tables always default to Count" },
      { id: "c", text: "The field was dragged into Rows first" },
      { id: "d", text: "The source range is a table rather than a range" },
    ],
    correct: "a",
    explanation:
      "Excel picks Count when it cannot treat the column as fully numeric. The default is a data-quality signal, not a preference to change.",
  },
  {
    id: "x-d2-012",
    domain: "d2-excel",
    difficulty: 4,
    topic: "weighted-vs-mean-rate",
    skill: "Averaging rates",
    caseId: null,
    type: "mcq",
    prompt:
      "Three product lines have margin rates of 25%, 12% and 8%. A colleague reports the company margin as 15%, the average of the three. Why is that wrong?",
    options: [
      { id: "a", text: "Rates must be weighted by revenue — the company rate is total margin over total revenue, so a large low-rate line dominates" },
      { id: "b", text: "It is right, as long as all three lines exist" },
      { id: "c", text: "The average should be the median instead" },
      { id: "d", text: "It is wrong only if a line made a loss" },
    ],
    correct: "a",
    explanation:
      "An unweighted mean of ratios gives a line with ₦200,000 of revenue the same say as one with ₦20m. The company rate comes from summing the numerators and denominators separately.",
  },
  {
    id: "x-d2-013",
    domain: "d2-excel",
    difficulty: 3,
    topic: "kpi-definition-target",
    skill: "KPI against target",
    caseId: null,
    type: "mcq",
    prompt:
      "A KPI card reads '₦3,033,500'. What single addition makes it useful to a reader?",
    options: [
      { id: "a", text: "Its comparison — against target, against last quarter, or both" },
      { id: "b", text: "A larger font" },
      { id: "c", text: "The number of rows behind it" },
      { id: "d", text: "A gauge visual instead of a card" },
    ],
    correct: "a",
    explanation:
      "A bare figure makes the reader judge it from memory. The comparison is what turns a number into information; the card is the right visual for it.",
  },

  /* ── advanced (difficulty 5) ───────────────────────────────────────── */
  {
    id: "x-d2-051",
    domain: "d2-excel",
    difficulty: 5,
    topic: "sme-net-rate",
    skill: "Comparing two rates you derived",
    caseId: "solar",
    type: "formula",
    prompt:
      "Compute the SME package's NET margin as a percentage, rounded to 2 decimal places: SME price less SME install cost less SME warranty cost, over SME price. Packages are in D2:D13, prices E2:E13, install costs F2:F13, warranty costs G2:G13.",
    target: "E15",
    hintRange: "D2:D13, E2:E13, F2:F13 and G2:G13",
    expected: 18.5,
    mustUse: "SUMIFS",
  },
  {
    id: "x-d2-052",
    domain: "d2-excel",
    difficulty: 5,
    topic: "sumifs-vs-pivot",
    skill: "Choosing formulas or a pivot",
    caseId: null,
    type: "mcq",
    prompt:
      "You need a revenue-by-channel-by-month grid that a colleague will re-cut several ways during a meeting. Formulas or a pivot table?",
    options: [
      { id: "a", text: "A pivot — it re-cuts by dragging, where a formula grid needs rewriting for every new arrangement" },
      { id: "b", text: "Formulas, because they update automatically" },
      { id: "c", text: "A pivot, because formulas cannot cross-tabulate" },
      { id: "d", text: "Formulas, because pivots do not refresh" },
    ],
    correct: "a",
    explanation:
      "Both are correct and both refresh. The deciding factor is how often the arrangement will change: exploration favours a pivot, a fixed report that feeds other cells favours formulas.",
  },
  {
    id: "x-d2-053",
    domain: "d2-excel",
    difficulty: 5,
    topic: "share-gap-excel",
    skill: "Share of revenue against share of margin",
    caseId: "adanna",
    type: "mcq",
    prompt:
      "You have computed that Wholesale is 68.9% of revenue and 43.0% of margin. Which single line best communicates the finding to the Head of Sales?",
    options: [
      { id: "a", text: "Wholesale does 69% of the work for 43% of the profit" },
      { id: "b", text: "Wholesale's revenue share exceeds its margin share by 25.9 percentage points" },
      { id: "c", text: "Wholesale is the largest channel by revenue" },
      { id: "d", text: "Wholesale's margin rate is 7.06%" },
    ],
    correct: "a",
    explanation:
      "It carries both figures in one comparison a non-analyst can act on. Option b is the same fact expressed so the reader must work out what a point of share means; d is true but omits the scale that makes it matter.",
  },
  {
    id: "x-d2-054",
    domain: "d2-excel",
    difficulty: 5,
    topic: "iferror-misuse",
    skill: "When not to wrap in IFERROR",
    caseId: null,
    type: "mcq",
    prompt:
      "A lookup column shows #N/A on 40 of 500 rows. A colleague wraps it in IFERROR(..., 0). What has that achieved?",
    options: [
      { id: "a", text: "It has hidden 40 unmatched rows and turned them into zeros that will be summed and averaged as real values" },
      { id: "b", text: "It has fixed the lookup" },
      { id: "c", text: "Nothing; IFERROR does not affect totals" },
      { id: "d", text: "It has correctly excluded the unmatched rows" },
    ],
    correct: "a",
    explanation:
      "#N/A was the report that 40 keys did not match. Replacing it with zero destroys that signal and injects 40 fabricated measurements. IFERROR is for errors you have diagnosed, not for tidying a screen.",
  },
  {
    id: "x-d2-055",
    domain: "d2-excel",
    difficulty: 5,
    topic: "phone-channel-finding",
    skill: "Reading a subgroup rate",
    caseId: "zuri",
    type: "mcq",
    prompt:
      "You cut Zuri's no-shows by booking channel and find that every no-show in the dataset was a Phone booking, while App and Walk-in have none at all. What is the correct next step?",
    options: [
      { id: "a", text: "Report it as the strongest signal in the data and propose a confirmation call or reminder for phone bookings, noting it rests on twenty appointments" },
      { id: "b", text: "Report that phone bookings cause no-shows" },
      { id: "c", text: "Discard it — a 100% concentration must be a data error" },
      { id: "d", text: "Recommend removing phone booking entirely" },
    ],
    correct: "a",
    explanation:
      "A clean concentration in one channel is highly actionable and the sample is small, so the recommendation is a targeted, cheap intervention plus the caveat — not a causal claim or a decision to close a channel.",
  },
];

export default ITEMS;
