/**
 * EXAM BANK · DOMAIN 1 — DATA QUALITY AND PREPARATION
 *
 * SERVER ONLY. Carries the answer key.
 *
 * The domain that decides whether the other four are worth marking. Items here
 * test whether a candidate checks data before trusting it, and whether they
 * can tell a defect that changes the numbers from one that merely looks untidy.
 *
 * `topic` is the exclusivity key: a paper never takes two items with the same
 * topic, so no item gives away another's answer.
 *
 * All case figures verified — see cases.js for the computed set.
 */

export const ITEMS = [
  /* ── core (difficulty 3-4) ──────────────────────────────────────────── */
  {
    id: "x-d1-001",
    domain: "d1-quality",
    difficulty: 3,
    topic: "blank-vs-zero",
    skill: "Blanks against zero",
    caseId: null,
    type: "mcq",
    prompt:
      "A satisfaction column has 40 responses and 6 blanks. You replace the blanks with 0 so the column is 'complete'. What have you done to the average?",
    options: [
      { id: "a", text: "Pulled it down by adding six responses that nobody gave" },
      { id: "b", text: "Improved it, because the column now has no gaps" },
      { id: "c", text: "Nothing — Excel ignores zeros in an average" },
      { id: "d", text: "Pulled it up, because zero is the neutral value" },
    ],
    correct: "a",
    explanation:
      "A blank means 'we do not know'; zero is a measurement. Filling blanks with zero invents six of the worst possible scores and changes both the numerator and the denominator.",
  },
  {
    id: "x-d1-002",
    domain: "d1-quality",
    difficulty: 4,
    topic: "leading-space",
    skill: "Exact text matching",
    caseId: "adanna",
    type: "mcq",
    prompt:
      "Suppose one Channel value in this export were stored as \" Wholesale\" with a leading space. You total revenue for each of the three channels with SUMIFS and add the three results. What would you observe?",
    options: [
      { id: "a", text: "The three subtotals would no longer add up to the grand total of the Amount column" },
      { id: "b", text: "SUMIFS would return an error for Wholesale" },
      { id: "c", text: "Nothing — SUMIFS trims spaces before comparing" },
      { id: "d", text: "The grand total of the Amount column would fall" },
    ],
    correct: "a",
    explanation:
      "SUMIFS compares text exactly, so the spaced row matches no criterion and drops out of every channel subtotal while remaining in the column's SUM. Comparing the parts with the whole is what exposes it.",
  },
  {
    id: "x-d1-003",
    domain: "d1-quality",
    difficulty: 3,
    topic: "duplicates",
    skill: "Duplicate detection",
    caseId: null,
    type: "mcq",
    prompt:
      "An export of 240 orders contains one order line that appears twice, identical in every column. What is the effect on the reported figures?",
    options: [
      { id: "a", text: "Revenue, cost and order count are all overstated, and no error appears anywhere" },
      { id: "b", text: "Only the order count is affected" },
      { id: "c", text: "Excel automatically ignores the second copy" },
      { id: "d", text: "The average order value is unchanged" },
    ],
    correct: "a",
    explanation:
      "A duplicated row is counted in every aggregate it participates in. Nothing flags it, which is why you check the count of distinct order numbers against the row count.",
  },
  {
    id: "x-d1-004",
    domain: "d1-quality",
    difficulty: 4,
    topic: "text-number",
    skill: "Numbers stored as text",
    caseId: null,
    type: "mcq",
    prompt:
      "One value in an Amount column sits against the left edge of its cell while every other value sits right. Which check identifies the problem most reliably?",
    options: [
      { id: "a", text: "ISNUMBER on that cell" },
      { id: "b", text: "Comparing COUNT with COUNTA over the column" },
      { id: "c", text: "Checking the cell's number format" },
      { id: "d", text: "Sorting the column and looking at the ends" },
    ],
    correct: "a",
    explanation:
      "ISNUMBER asks the question directly. COUNT against COUNTA catches blanks and some junk but a tidy numeric string can slip past both, and number format describes display rather than stored type.",
  },
  {
    id: "x-d1-005",
    domain: "d1-quality",
    difficulty: 4,
    topic: "keyless-row",
    skill: "Rows without a key",
    caseId: null,
    type: "mcq",
    prompt:
      "A sales export ends with a row that has no order number but carries an amount and a channel. What should you do with it?",
    options: [
      { id: "a", text: "Remove it and record the removal, because a row with no key cannot be joined, deduplicated or traced back" },
      { id: "b", text: "Keep it — the amount is real revenue" },
      { id: "c", text: "Assign it the next order number in sequence" },
      { id: "d", text: "Leave it and filter it out in each report" },
    ],
    correct: "a",
    explanation:
      "Without a key the row cannot be verified against the source system or matched to a customer, and it will silently survive any deduplication. Removing it and documenting that you did is the defensible action.",
  },
  {
    id: "x-d1-006",
    domain: "d1-quality",
    difficulty: 3,
    topic: "case-sensitivity",
    skill: "Which defects change numbers",
    caseId: null,
    type: "mcq",
    prompt:
      'A Channel column contains both "Online" and "online". Your SUMIFS totals are correct, but the Power BI report shows two legend entries. What is the right reading?',
    options: [
      { id: "a", text: "SUMIFS and COUNTIFS ignore case, so the totals are fine — but the values should still be standardised before they reach a visual" },
      { id: "b", text: "The totals must be wrong; SUMIFS is case sensitive" },
      { id: "c", text: "Power BI is faulty and should be refreshed" },
      { id: "d", text: "Nothing needs changing in either place" },
    ],
    correct: "a",
    explanation:
      "Excel's conditional functions are case insensitive; Power BI groups distinct strings. Knowing which defects move numbers and which only affect presentation is what stops you wasting a morning.",
  },
  {
    id: "x-d1-007",
    domain: "d1-quality",
    difficulty: 4,
    topic: "missing-cost-effect",
    skill: "Missing values in a derived column",
    caseId: "solar",
    type: "mcq",
    prompt:
      "Suppose one job's Install cost were missing rather than recorded. You compute gross margin as Price minus Install cost across all twelve jobs. What happens?",
    options: [
      { id: "a", text: "That job reads as pure profit, so the company's gross margin is overstated and nothing errors" },
      { id: "b", text: "The margin column returns an error on that row, making it easy to spot" },
      { id: "c", text: "The job is excluded from the total automatically" },
      { id: "d", text: "Gross margin is understated" },
    ],
    correct: "a",
    explanation:
      "Price minus a blank is Price. The row contributes its full value as margin, which pushes the overall rate up — a defect that flatters the business and therefore goes unquestioned.",
  },
  {
    id: "x-d1-008",
    domain: "d1-quality",
    difficulty: 4,
    topic: "denominator-definition",
    skill: "KPI definition",
    caseId: "zuri",
    type: "mcq",
    prompt:
      "Dr Balogun asks for 'the no-show rate'. You can divide no-shows by all appointments booked, or by appointments that were not cancelled. Why does the choice matter here?",
    options: [
      { id: "a", text: "The two denominators give different rates, so the definition must be stated with the figure or two people will report different numbers from the same data" },
      { id: "b", text: "It does not matter, because cancellations are rare" },
      { id: "c", text: "Only the first is a valid rate" },
      { id: "d", text: "Both give the same answer once rounded" },
    ],
    correct: "a",
    explanation:
      "Two cancellations sit between the two definitions, so the rate differs depending on which you choose. Neither is wrong; publishing one without saying which is.",
  },
  {
    id: "x-d1-009",
    domain: "d1-quality",
    difficulty: 3,
    topic: "profile-completeness",
    skill: "Profiling before analysing",
    caseId: null,
    type: "mcq",
    prompt:
      "You receive a new dataset with 3,000 rows and eleven columns. What is the first thing you do?",
    options: [
      { id: "a", text: "Profile it — row count, column types, blanks per column, and the range of each numeric column" },
      { id: "b", text: "Build the pivot table the stakeholder asked for" },
      { id: "c", text: "Sort by the largest value to see the top customers" },
      { id: "d", text: "Write the summary formulas, then check the data if a figure looks odd" },
    ],
    correct: "a",
    explanation:
      "Profiling takes minutes and determines whether anything built afterwards is worth reading. Option d is the common habit and it means defects surface only when they happen to produce a number you personally find surprising.",
  },
  {
    id: "x-d1-010",
    domain: "d1-quality",
    difficulty: 3,
    topic: "dedupe-key",
    skill: "Choosing a deduplication key",
    caseId: null,
    type: "mcq",
    prompt:
      "You remove duplicates from an order table. Which column should the deduplication key be?",
    options: [
      { id: "a", text: "The order number, because it is meant to be unique per order" },
      { id: "b", text: "The customer name, so each customer appears once" },
      { id: "c", text: "The amount, because two identical amounts indicate a repeat" },
      { id: "d", text: "Every column at once, always" },
    ],
    correct: "a",
    explanation:
      "Deduplicate on the business key. Keying on customer name would delete genuine repeat orders, and keying on amount would delete unrelated orders that happen to cost the same.",
  },
  {
    id: "x-d1-011",
    domain: "d1-quality",
    difficulty: 4,
    topic: "reconcile-total",
    skill: "Reconciliation",
    caseId: null,
    type: "mcq",
    prompt:
      "Your regional breakdown sums to ₦48.2m but the revenue column totals ₦49.7m. What does the ₦1.5m gap most likely mean?",
    options: [
      { id: "a", text: "Some rows match none of your region criteria — a spelling variant, a blank, or a region you did not list" },
      { id: "b", text: "Rounding across the regions" },
      { id: "c", text: "The revenue column contains an error" },
      { id: "d", text: "Nothing; breakdowns are not expected to tie to totals" },
    ],
    correct: "a",
    explanation:
      "A breakdown must reconcile with its own total. A gap of that size is rows falling outside every criterion, which is exactly what a reconciliation check is for.",
  },

  /* ── advanced (difficulty 5) ───────────────────────────────────────── */
  {
    id: "x-d1-051",
    domain: "d1-quality",
    difficulty: 5,
    topic: "dirty-data-direction",
    skill: "Direction of a data defect",
    caseId: null,
    type: "mcq",
    prompt:
      "An uncleaned export reports a 13.19% margin. After removing a duplicated order and supplying one missing cost, the margin is 11.30%. Why is a defect that flatters the business more dangerous than one that does not?",
    options: [
      { id: "a", text: "Nobody in the business has a reason to question a favourable number, so it is published and acted on" },
      { id: "b", text: "It is not — the size of the error is what matters, not its direction" },
      { id: "c", text: "Because favourable errors are always larger" },
      { id: "d", text: "Because auditors only check downward errors" },
    ],
    correct: "a",
    explanation:
      "An unflattering figure gets challenged by the people it reflects on, which surfaces the defect. A flattering one is welcomed. Direction changes the probability of detection, not the arithmetic.",
  },
  {
    id: "x-d1-052",
    domain: "d1-quality",
    difficulty: 5,
    topic: "outlier-rule-apply",
    skill: "Applying an outlier rule honestly",
    caseId: "logistics",
    type: "mcq",
    prompt:
      "You apply the 1.5 × IQR rule to the delay column and it flags exactly one delivery, DEL-511, which was held at a checkpoint for two weeks. What is the defensible treatment?",
    options: [
      { id: "a", text: "Report the figures both with and without it, and state the reason it was excluded" },
      { id: "b", text: "Delete the row, because the rule flagged it" },
      { id: "c", text: "Keep it silently, because it is a genuine delivery" },
      { id: "d", text: "Adjust the fence until nothing is flagged" },
    ],
    correct: "a",
    explanation:
      "The delay is real, so deleting it hides a genuine service failure; burying it in an average hides it differently. Showing both figures with the documented cause lets the reader judge.",
  },
  {
    id: "x-d1-053",
    domain: "d1-quality",
    difficulty: 5,
    topic: "type-coercion",
    skill: "Tool-specific coercion",
    caseId: null,
    type: "mcq",
    prompt:
      "The same column of amounts, one of which is stored as text, is totalled in Excel, in Power Query and in pandas. What should you expect?",
    options: [
      { id: "a", text: "The three tools may not agree, so the column must be explicitly typed before any of them is trusted" },
      { id: "b", text: "All three coerce text to numbers identically" },
      { id: "c", text: "All three raise an error and refuse to total" },
      { id: "d", text: "All three silently skip the text value" },
    ],
    correct: "a",
    explanation:
      "Coercion behaviour differs by tool and by version, which is precisely why you fix the type rather than learning each tool's default. A figure that changes when you change tool is a typing problem.",
  },
  {
    id: "x-d1-054",
    domain: "d1-quality",
    difficulty: 5,
    topic: "quality-note",
    skill: "Documenting a clean",
    caseId: null,
    type: "mcq",
    prompt:
      "You corrected six defects before analysing. What belongs in the deliverable?",
    options: [
      { id: "a", text: "A quality note listing each defect, what you did about it, and what it was worth in the numbers" },
      { id: "b", text: "Nothing — the cleaned data speaks for itself" },
      { id: "c", text: "A note that the data was cleaned" },
      { id: "d", text: "The original file only, so the client can check" },
    ],
    correct: "a",
    explanation:
      "Every number you changed is a number someone may reconcile against their own system. The note is what turns an unexplained discrepancy into evidence that you did the job.",
  },
  {
    id: "x-d1-055",
    domain: "d1-quality",
    difficulty: 5,
    topic: "cancelled-vs-noshow",
    skill: "Distinguishing similar statuses",
    caseId: "zuri",
    type: "mcq",
    prompt:
      "A junior analyst reports Zuri's 'missed appointments' by counting every appointment that was not attended. Why is that figure not what Dr Balogun asked for?",
    options: [
      { id: "a", text: "It merges cancellations with no-shows, and only a no-show wastes the slot — so the number overstates the problem he can act on" },
      { id: "b", text: "It is exactly what he asked for" },
      { id: "c", text: "It undercounts, because cancellations should be weighted double" },
      { id: "d", text: "It is wrong only because the fee values differ by clinic" },
    ],
    correct: "a",
    explanation:
      "A cancelled appointment releases the slot for someone else; a no-show burns it. Collapsing the two answers a different question from the one the brief asks.",
  },
];

export default ITEMS;
