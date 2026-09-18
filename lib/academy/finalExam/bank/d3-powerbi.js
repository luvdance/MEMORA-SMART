/**
 * EXAM BANK · DOMAIN 3 — POWER BI: PREPARATION, MODELLING AND DAX
 *
 * SERVER ONLY. Carries the answer key.
 *
 * Power BI's failures are quiet ones: a relationship that builds cleanly but
 * strands a third of the revenue, a measure that returns 100% on every row, a
 * month axis sorted alphabetically. Every item here targets a failure that
 * produces a plausible wrong number rather than an error message.
 */

export const ITEMS = [
  /* ── core (difficulty 3-4) ──────────────────────────────────────────── */
  {
    id: "x-d3-001",
    domain: "d3-powerbi",
    difficulty: 3,
    topic: "pq-vs-manual",
    skill: "Why Power Query rather than manual cleaning",
    caseId: null,
    type: "mcq",
    prompt:
      "You will receive the same badly-formatted export every month. Why clean it in Power Query rather than in the sheet?",
    options: [
      { id: "a", text: "The steps become a recipe that reruns on refresh, and the Applied Steps list documents every change you made" },
      { id: "b", text: "Power Query is faster than Excel at arithmetic" },
      { id: "c", text: "Power Query can fix defects Excel cannot detect" },
      { id: "d", text: "It avoids having to look at the data" },
    ],
    correct: "a",
    explanation:
      "Repeatability and an audit trail are the whole argument. Manual cleaning must be redone and remembered every month, and leaves no record of what was changed.",
  },
  {
    id: "x-d3-002",
    domain: "d3-powerbi",
    difficulty: 4,
    topic: "pq-row-count",
    skill: "Reading the Applied Steps row count",
    caseId: null,
    type: "mcq",
    prompt:
      "Your Applied Steps show the row count going 500 → 500 → 500 → 486 → 480. Why read the count after every step rather than only at the end?",
    options: [
      { id: "a", text: "To confirm each drop removed the rows you intended — a step that removes more than expected is how a refresh quietly loses data" },
      { id: "b", text: "Because falling row counts always indicate a problem" },
      { id: "c", text: "Because the final count should match the original" },
      { id: "d", text: "Only the final count matters" },
    ],
    correct: "a",
    explanation:
      "A final count of 480 could come from removing 20 duplicates or from removing 20 good rows. The sequence is the diagnosis, and next month's data runs through the same recipe.",
  },
  {
    id: "x-d3-003",
    domain: "d3-powerbi",
    difficulty: 3,
    topic: "star-schema",
    skill: "Fact and dimension tables",
    caseId: null,
    type: "mcq",
    prompt:
      "In a star schema, which table holds the order lines with their amounts?",
    options: [
      { id: "a", text: "The fact table — it holds the measurable events, one row per transaction" },
      { id: "b", text: "The dimension table, because orders are a dimension of the business" },
      { id: "c", text: "Either; the distinction is presentational" },
      { id: "d", text: "A bridge table" },
    ],
    correct: "a",
    explanation:
      "Facts are the events you measure; dimensions are the descriptive lists you slice them by. Getting this the wrong way round produces a model whose filters travel in the wrong direction.",
  },
  {
    id: "x-d3-004",
    domain: "d3-powerbi",
    difficulty: 4,
    topic: "orphan-keys",
    skill: "Orphan keys and the (Blank) row",
    caseId: null,
    type: "mcq",
    prompt:
      "Your orders say \"Palm Oil 5L\" and the product catalogue says \"Palm Oil 5Ltr\". You build the relationship on product name. What do you see?",
    options: [
      { id: "a", text: "The relationship builds with correct cardinality, and the unmatched orders collect under a (Blank) category row — with no error anywhere" },
      { id: "b", text: "Power BI matches them, since the names are nearly identical" },
      { id: "c", text: "The relationship cannot be created" },
      { id: "d", text: "The report total is unaffected" },
    ],
    correct: "a",
    explanation:
      "Key matching is exact and there is no fuzzy fallback. The (Blank) row is the only warning, and every category total is short by the value of those rows.",
  },
  {
    id: "x-d3-005",
    domain: "d3-powerbi",
    difficulty: 4,
    topic: "measure-vs-column",
    skill: "Measures against calculated columns",
    caseId: null,
    type: "mcq",
    prompt:
      "You need margin percent that responds to whatever a user slices by. Measure or calculated column?",
    options: [
      { id: "a", text: "A measure — it is evaluated in the filter context of each cell, so it recalculates as the user slices" },
      { id: "b", text: "A calculated column, because it is stored and therefore faster" },
      { id: "c", text: "A calculated column, because percentages are row-level" },
      { id: "d", text: "Either; they behave identically" },
    ],
    correct: "a",
    explanation:
      "A column is computed once per row at refresh and then averaged or summed like any other column, which is wrong for a ratio. A measure divides the aggregated numerator by the aggregated denominator in each cell.",
  },
  {
    id: "x-d3-006",
    domain: "d3-powerbi",
    difficulty: 4,
    topic: "all-function",
    skill: "ALL and percent of total",
    caseId: null,
    type: "mcq",
    prompt:
      "A % of Total column reads 100% on every row. What is wrong?",
    options: [
      { id: "a", text: "The denominator is being filtered by the same row context as the numerator — it needs CALCULATE with ALL to hold the total constant" },
      { id: "b", text: "The percentage format is misconfigured" },
      { id: "c", text: "The relationship is broken" },
      { id: "d", text: "DIVIDE cannot compute shares" },
    ],
    correct: "a",
    explanation:
      "Every row is dividing a number by itself. It looks like a formatting fault and is not, which is why it costs people whole afternoons.",
  },
  {
    id: "x-d3-007",
    domain: "d3-powerbi",
    difficulty: 3,
    topic: "divide-function",
    skill: "DIVIDE against the slash",
    caseId: null,
    type: "mcq",
    prompt:
      "Why write DIVIDE([Margin], [Revenue]) rather than [Margin] / [Revenue]?",
    options: [
      { id: "a", text: "DIVIDE returns a blank instead of an error when the denominator is zero or blank" },
      { id: "b", text: "DIVIDE is more numerically precise" },
      { id: "c", text: "The slash operator does not work between measures" },
      { id: "d", text: "DIVIDE automatically formats the result as a percentage" },
    ],
    correct: "a",
    explanation:
      "A category with no revenue is common in a sliced report. DIVIDE keeps the visual clean where the operator would scatter errors across it.",
  },
  {
    id: "x-d3-008",
    domain: "d3-powerbi",
    difficulty: 4,
    topic: "date-table-sort",
    skill: "Month sort order",
    caseId: null,
    type: "mcq",
    prompt:
      "Your line chart's axis reads Apr, Aug, Dec, Feb, Jan... What is the cause and the fix?",
    options: [
      { id: "a", text: "The month is text and is sorting alphabetically; sort it by a month-number column, ideally from a proper date table" },
      { id: "b", text: "The visual needs refreshing" },
      { id: "c", text: "The data is in the wrong order in the source and must be re-sorted there" },
      { id: "d", text: "Line charts cannot display months" },
    ],
    correct: "a",
    explanation:
      "Text sorts as text. Sort By Column against a numeric month, or a date table, fixes it everywhere at once rather than per visual.",
  },
  {
    id: "x-d3-009",
    domain: "d3-powerbi",
    difficulty: 4,
    topic: "cardinality",
    skill: "Reading detected cardinality",
    caseId: null,
    type: "mcq",
    prompt:
      "You join a product list to an order table and Power BI detects many-to-many rather than one-to-many. What does that tell you?",
    options: [
      { id: "a", text: "The product list has duplicate keys, so it is not a clean dimension yet" },
      { id: "b", text: "It is the normal result for this kind of join" },
      { id: "c", text: "The order table is missing rows" },
      { id: "d", text: "Nothing — cardinality is a display setting" },
    ],
    correct: "a",
    explanation:
      "One-to-many requires the key to be unique on the dimension side. Many-to-many means it is not, and filters will behave in ways nobody expects until the duplicates are resolved.",
  },
  {
    id: "x-d3-010",
    domain: "d3-powerbi",
    difficulty: 3,
    topic: "filter-direction",
    skill: "Default filter direction",
    caseId: null,
    type: "mcq",
    prompt:
      "In a one-to-many relationship from Products to Orders, which way does a filter travel by default?",
    options: [
      { id: "a", text: "From Products to Orders — from the one side to the many side" },
      { id: "b", text: "From Orders to Products" },
      { id: "c", text: "Both ways" },
      { id: "d", text: "Neither, until you enable cross-filtering" },
    ],
    correct: "a",
    explanation:
      "Selecting a product filters its orders. The reverse is off by default, and that asymmetry is deliberate: enabling both directions can make totals ambiguous.",
  },
  {
    id: "x-d3-011",
    domain: "d3-powerbi",
    difficulty: 4,
    topic: "distinctcount",
    skill: "COUNTROWS against DISTINCTCOUNT",
    caseId: null,
    type: "mcq",
    prompt:
      "You need the number of CUSTOMERS who ordered, from an order table where a customer may appear many times. Which measure?",
    options: [
      { id: "a", text: "DISTINCTCOUNT on the customer id column" },
      { id: "b", text: "COUNTROWS on the order table" },
      { id: "c", text: "COUNT on the customer id column" },
      { id: "d", text: "SUM of a customer flag column" },
    ],
    correct: "a",
    explanation:
      "COUNTROWS counts orders, not people. The gap between the two is repeat business, and reporting one as the other overstates your customer base.",
  },
  {
    id: "x-d3-012",
    domain: "d3-powerbi",
    difficulty: 4,
    topic: "remove-other-columns",
    skill: "Remove Other Columns",
    caseId: null,
    type: "mcq",
    prompt:
      "Why prefer Remove Other Columns to Remove Columns when trimming a query?",
    options: [
      { id: "a", text: "It records the columns you want to keep, so a new column in next month's export does not silently join the model" },
      { id: "b", text: "It is faster to execute" },
      { id: "c", text: "It preserves the original column order" },
      { id: "d", text: "There is no practical difference" },
    ],
    correct: "a",
    explanation:
      "Remove Columns names the columns to drop, so anything new arrives uninvited. Remove Other Columns names what you want, which is the version that survives a changing source.",
  },
  {
    id: "x-d3-013",
    domain: "d3-powerbi",
    difficulty: 3,
    topic: "kpi-card-choice",
    skill: "Choosing a visual for one number",
    caseId: null,
    type: "mcq",
    prompt:
      "You need to show revenue against target on a report header. Which visual?",
    options: [
      { id: "a", text: "A card with the figure and its comparison to target" },
      { id: "b", text: "A gauge, because it shows progress toward a threshold" },
      { id: "c", text: "A single-bar chart" },
      { id: "d", text: "A pie with two slices: achieved and remaining" },
    ],
    correct: "a",
    explanation:
      "A gauge takes several times the space of a card to convey one number and a threshold, and a needle is harder to read precisely than the digits. A two-slice pie is the weakest of the four.",
  },

  /* ── advanced (difficulty 5) ───────────────────────────────────────── */
  {
    id: "x-d3-051",
    domain: "d3-powerbi",
    difficulty: 5,
    topic: "orphan-fix",
    skill: "Fixing an orphan key properly",
    caseId: null,
    type: "mcq",
    prompt:
      "A (Blank) category row is holding ₦937,000 of real revenue because one product name is spelled differently in the lookup table. What is the correct fix?",
    options: [
      { id: "a", text: "Correct the key at the source, or add a Power Query step that maps it, so the join works on every future refresh" },
      { id: "b", text: "Filter the (Blank) row out of the visual" },
      { id: "c", text: "Delete the unmatched orders, since they do not match the catalogue" },
      { id: "d", text: "Switch the relationship to many-to-many" },
    ],
    correct: "a",
    explanation:
      "Filtering hides real revenue and removes the only warning that the join is failing. Deleting the orders destroys genuine data to match a typo. Many-to-many does not create a match for a key that does not exist.",
  },
  {
    id: "x-d3-052",
    domain: "d3-powerbi",
    difficulty: 5,
    topic: "total-row-ratio",
    skill: "Why a Total row is not the mean of the rows",
    caseId: null,
    type: "mcq",
    prompt:
      "A matrix shows Margin % per product of 11.53%, 7.79%, 9.34%, 12.64% and 25.32%, with 11.30% on the Total row. A colleague says the total is wrong because the five average about 13.3%. What do you tell them?",
    options: [
      { id: "a", text: "The Total row is total margin over total revenue; averaging the five rates would give each product equal weight regardless of its size" },
      { id: "b", text: "They are right — the total should be the mean of the rows" },
      { id: "c", text: "It is a rounding artefact" },
      { id: "d", text: "The measure is missing an ALL" },
    ],
    correct: "a",
    explanation:
      "The measure is re-evaluated in the Total row's filter context, over every row of the fact table. That is the correct behaviour of a ratio measure and the reason not to build ratios as calculated columns.",
  },
  {
    id: "x-d3-053",
    domain: "d3-powerbi",
    difficulty: 5,
    topic: "bidirectional-risk",
    skill: "Bidirectional filtering",
    caseId: null,
    type: "mcq",
    prompt:
      "A colleague enables bidirectional cross-filtering on several relationships to make some slicers behave. What is the risk?",
    options: [
      { id: "a", text: "Filters can travel by more than one path, making some totals ambiguous and hard to reason about" },
      { id: "b", text: "It slows the report but the numbers stay correct" },
      { id: "c", text: "It has no effect unless you also change the cardinality" },
      { id: "d", text: "It breaks the relationship entirely" },
    ],
    correct: "a",
    explanation:
      "Once filters can travel in both directions across multiple joins, the engine may have several routes between two tables. Turn it on deliberately and narrowly, never as a general fix.",
  },
  {
    id: "x-d3-054",
    domain: "d3-powerbi",
    difficulty: 5,
    topic: "pq-blank-row-column",
    skill: "Choosing the column for Remove Blank Rows",
    caseId: null,
    type: "mcq",
    prompt:
      "You add a Remove Blank Rows step keyed on a Warranty cost column, where a blank legitimately means 'no claim was made'. What happens?",
    options: [
      { id: "a", text: "Every job with no warranty claim is deleted, removing the most profitable jobs from the analysis" },
      { id: "b", text: "Only rows that are entirely blank are removed" },
      { id: "c", text: "Nothing, because blanks in a numeric column are treated as zero" },
      { id: "d", text: "The step fails and the query errors" },
    ],
    correct: "a",
    explanation:
      "Blank Removal keys on the column you choose. A blank that carries meaning is not a missing row, and keying on it silently deletes the cleanest part of the dataset.",
  },
  {
    id: "x-d3-055",
    domain: "d3-powerbi",
    difficulty: 5,
    topic: "grain-mismatch",
    skill: "Aggregation grain",
    caseId: null,
    type: "mcq",
    prompt:
      "You join a monthly target table to a daily sales fact table on month, then put Target on a card beside Revenue. The target looks far too large. Why?",
    options: [
      { id: "a", text: "The monthly target is repeating across every fact row it matches, so summing it multiplies the target by the number of sales rows in the month" },
      { id: "b", text: "The relationship direction is reversed" },
      { id: "c", text: "The target table needs a date column" },
      { id: "d", text: "Targets cannot be modelled in Power BI" },
    ],
    correct: "a",
    explanation:
      "This is a grain mismatch. Keep targets in their own table at their own grain and relate both to a shared date dimension, rather than letting a one-per-month value be summed once per transaction.",
  },
];

export default ITEMS;
