/**
 * MODULE · PIVOT TABLES & AGGREGATION (m2-pivots)
 * Month 2 — Excel Data Analysis
 *
 * The highest-leverage skill in Excel, and the one most often half-learned.
 * Most people can make a pivot table. Far fewer can say why Count appeared
 * instead of Sum, why their Grand Total is smaller than it should be, or what
 * the Filters area actually does to the numbers underneath.
 *
 * TEACHING APPROACH
 * A pivot cannot be taught with a formula, because the whole point is that you
 * build it by MOVING FIELDS. So most atoms here carry a live PivotSim: the
 * learner drags Month, State, Category and Amount between the four areas and
 * watches the table rebuild. Reading "drag State into Rows" teaches nobody.
 *
 * EVERY NUMBER IN THIS FILE IS COMPUTED, NOT INVENTED. The figures quoted in
 * the tables come from lib/academy/pivot.js run against SALES below, and the
 * content validator recomputes them on every build. If a row here disagrees
 * with the simulator the learner is using, that is a bug and the build fails.
 *
 * THE RUNNING DATASET — twelve orders across three months, three states,
 * three categories and four reps. Small enough to verify by hand, wide enough
 * that rows, columns, filters and grouping all have something to bite on.
 *   Grand total 618,000 · Lagos 276,000 · Abuja 215,000 · Kano 127,000
 *
 * CLIENT-SAFE. Knowledge-check answers live in lib/academy/assessments/.
 */

export const SECTION_ID = "s6-pivots";

/**
 * Twelve orders. Deliberately clean — this module is about aggregation, not
 * cleaning, and a learner debugging a pivot should never be wondering whether
 * the data is broken as well.
 */
export const SALES = {
  headers: ["Order", "Month", "State", "Category", "Rep", "Amount", "Units"],
  rows: [
    ["ORD-1", "Jan", "Lagos", "Electronics", "Ada", 45000, 3],
    ["ORD-2", "Jan", "Abuja", "Groceries", "Musa", 62000, 12],
    ["ORD-3", "Jan", "Lagos", "Groceries", "Ada", 38000, 9],
    ["ORD-4", "Feb", "Kano", "Electronics", "Chuka", 51000, 2],
    ["ORD-5", "Feb", "Lagos", "Electronics", "Ada", 47000, 4],
    ["ORD-6", "Feb", "Abuja", "Fashion", "Musa", 98000, 6],
    ["ORD-7", "Mar", "Kano", "Groceries", "Chuka", 43000, 11],
    ["ORD-8", "Mar", "Lagos", "Fashion", "Ngozi", 56000, 5],
    ["ORD-9", "Mar", "Abuja", "Electronics", "Musa", 55000, 3],
    ["ORD-10", "Mar", "Lagos", "Groceries", "Ngozi", 49000, 14],
    ["ORD-11", "Jan", "Kano", "Fashion", "Chuka", 33000, 4],
    ["ORD-12", "Feb", "Lagos", "Groceries", "Ngozi", 41000, 10],
  ],
};

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════ */
  {
    id: "l26-pivot-anatomy",
    moduleId: "m2-pivots",
    sectionId: SECTION_ID,
    order: 1,
    title: "What a Pivot Table Actually Is",
    subtitle: "The four areas, and what each one does to your data",
    estimatedMinutes: 16,
    intro:
      "A pivot table answers 'total X, broken down by Y' without you writing anything. Once you understand the four areas you can build any summary in about eight seconds, and you will stop writing thirty SUMIFS formulas to do work Excel will do for free.",

    atoms: [
      {
        id: "a-what-a-pivot-is",
        title: "A pivot table is a summary you assemble by moving fields",
        explain:
          "Give Excel a table where every row is one record. Drop a field into Rows and it becomes the list down the side. Drop a number into Values and Excel aggregates it for each of those rows. That is the entire idea.",
        why: "Last module you answered 'total sales by state' with three separate SUMIFS formulas. That works for three states. It does not work for thirty-six, it breaks when a new state appears, and it has to be rewritten every time someone asks a slightly different question. A pivot answers all of those with the same four seconds of dragging.",
        analogy:
          "It is a card sorter. You have twelve order cards; Rows decides which pile each card goes into, and Values decides what gets added up within each pile. Changing the question means re-sorting the piles, not rewriting anything.",
        table: {
          caption: "The same question, two ways.",
          headers: ["Approach", "Effort for 3 groups", "Effort for 36 groups", "When the data changes"],
          rows: [
            ["SUMIFS per group", "3 formulas", "36 formulas", "Rewrite or fill down carefully"],
            ["Pivot table", "Drag 2 fields", "Drag 2 fields", "Right-click, Refresh"],
          ],
          note: "The pivot's effort does not grow with the number of groups. That is the whole reason it is the highest-leverage skill in Excel.",
        },
      },
      {
        id: "a-four-areas",
        title: "The four areas",
        explain:
          "Rows becomes the down-the-side axis. Columns becomes the across-the-top axis. Values is the body of the table, always aggregated. Filters narrows the source data BEFORE any of the other three see it.",
        why: "Almost every pivot problem is a field in the wrong area. A field in Filters silently removes rows from every total on the sheet; the same field in Rows shows you those rows as a breakdown. Same field, opposite effect, and nothing on screen tells you which you chose.",
        table: {
          caption: "What each area does to the field you put in it.",
          headers: ["Area", "Effect", "Put here"],
          rows: [
            ["Filters", "Removes rows from the whole calculation", "A field you want to restrict by, not see"],
            ["Columns", "Splits the table sideways", "A field with few values — months, categories"],
            ["Rows", "Splits the table downwards", "The main thing you are breaking down by"],
            ["Values", "Gets aggregated into the body", "The number you want totalled or counted"],
          ],
          note: "Rule of thumb: the field with more distinct values goes in Rows, the one with fewer goes in Columns. A pivot with 36 columns is unreadable; the same pivot with 36 rows scrolls fine.",
        },
      },
      {
        id: "a-first-pivot",
        title: "Build your first pivot",
        explain:
          "Put State in Rows and Amount in Values. Excel groups the twelve orders into three states and totals the amount within each. Nothing has been typed and nothing in the source data has changed.",
        why: "This single arrangement — one category in Rows, one number in Values — answers a genuinely large share of the questions you will ever be asked. Learn it properly and everything else in this module is a variation on it.",
        pivotExercise: {
          source: SALES,
          task:
            "Drag State into Rows and Amount into Values, and make sure it is summarised by Sum. You are answering: what is the total order value in each state?",
          expect: { row: "State", value: "Amount", agg: "sum" },
          successMessage:
            "Lagos 276,000, Abuja 215,000, Kano 127,000, and a Grand Total of 618,000. Three numbers that would have taken three SUMIFS formulas, from two drags.",
        },
        table: {
          caption: "What you should be looking at.",
          headers: ["State", "Sum of Amount"],
          rows: [
            ["Abuja", "215,000"],
            ["Kano", "127,000"],
            ["Lagos", "276,000"],
            ["Grand Total", "618,000"],
          ],
          note: "Always read the Grand Total first. 618,000 is the total of all twelve orders, so nothing has been accidentally filtered out.",
        },
      },
      {
        id: "a-pivot-vs-formulas",
        title: "When NOT to use a pivot",
        explain:
          "Pivots summarise. They do not clean, they do not calculate row by row, and they do not belong in a cell another formula needs to read reliably. For a single number that feeds a report, a SUMIFS is often the better tool.",
        why: "A pivot moves. Add a state and every cell below shifts down, so any formula pointing at a pivot cell now points at the wrong thing. This is the most common way a 'finished' dashboard quietly breaks a month later.",
        table: {
          caption: "Choosing between them.",
          headers: ["Situation", "Use"],
          rows: [
            ["Exploring — what does this data look like?", "Pivot"],
            ["A breakdown that may change shape", "Pivot"],
            ["One fixed KPI cell a chart reads", "SUMIFS"],
            ["A calculation per row of the source", "A formula column"],
            ["Anything a colleague will edit monthly", "Pivot, plus a written refresh step"],
          ],
        },
        mistake:
          "Pointing a formula at a pivot table cell by clicking it. Excel inserts GETPIVOTDATA or a fixed reference, and either one breaks the moment the pivot changes shape.",
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  {
    id: "l27-values-and-aggregation",
    moduleId: "m2-pivots",
    sectionId: SECTION_ID,
    order: 2,
    title: "The Values Area and Aggregation",
    subtitle: "Sum, Count, Average — and why Count keeps appearing",
    estimatedMinutes: 17,
    intro:
      "The Values area is where pivots go wrong most often, and the failure is never an error message. It is a plausible number produced by the wrong aggregation, which nobody notices until someone asks why revenue is 12.",

    atoms: [
      {
        id: "a-value-field",
        title: "Every Values field is aggregated",
        explain:
          "You cannot put a raw number in a pivot. Anything in Values is summarised — by Sum, Count, Average, Max or Min — across all the rows in that group. The header always tells you which: 'Sum of Amount', 'Count of Order'.",
        why: "Reading that header is a habit worth building. 'Count of Amount' at the top of a column of small integers is Excel telling you plainly that your revenue figures are actually a headcount, and it is the single most common pivot error in the world.",
        table: {
          caption: "The same field, four aggregations, four different questions.",
          headers: ["Aggregation", "Lagos", "Abuja", "Kano", "Answers"],
          rows: [
            ["Sum of Amount", "276,000", "215,000", "127,000", "How much money?"],
            ["Count of Amount", "6", "3", "3", "How many orders?"],
            ["Average of Amount", "46,000", "71,667", "42,333", "How big is a typical order?"],
            ["Max of Amount", "56,000", "98,000", "51,000", "What was the biggest single order?"],
          ],
          note: "All four are correct. Only one answers the question you were asked, and the column header is the only thing that tells the reader which.",
        },
      },
      {
        id: "a-sum-vs-count",
        title: "Sum and Count answer different questions",
        explain:
          "Sum adds the values. Count counts how many rows there were. Lagos sums to 276,000 across 6 orders; Abuja sums to 215,000 across 3. Lagos sells more in total, Abuja sells more per order.",
        why: "Ranking states by total and ranking them by order count can produce different winners, and both are defensible answers to 'which state is doing best'. Deciding which one the question meant is your job, not the pivot's.",
        pivotExercise: {
          source: SALES,
          task:
            "Put State in Rows and Order in Values, then set the aggregation to Count. You are answering: how many orders did each state place?",
          expect: { row: "State", value: "Order", agg: "count" },
          successMessage:
            "Lagos 6, Abuja 3, Kano 3, total 12. Put this beside the totals from the last lesson and you can see Abuja's 215,000 comes from only three orders — so its typical order is far larger.",
        },
        table: {
          caption: "Total against count, side by side.",
          headers: ["State", "Sum of Amount", "Count of Order", "Average"],
          rows: [
            ["Lagos", "276,000", "6", "46,000"],
            ["Abuja", "215,000", "3", "71,667"],
            ["Kano", "127,000", "3", "42,333"],
          ],
          note: "Lagos wins on total. Abuja wins on order size. Report only one and you have answered half the question.",
        },
      },
      {
        id: "a-count-trap",
        title: "Why Excel gives you Count when you wanted Sum",
        explain:
          "Excel defaults to Sum for a field it reads as numeric and Count for anything else. If even ONE cell in your Amount column is text — a blank typed as 'N/A', a number with a stray space — Excel treats the whole field as text and silently gives you Count.",
        why: "This is the failure that makes people distrust pivot tables. The pivot is not broken and Excel is not guessing: it is telling you that your Amount column is not entirely numeric. Fix the column, refresh, and Sum comes back.",
        table: {
          caption: "Diagnosing it.",
          headers: ["Symptom", "Cause", "Fix"],
          rows: [
            ["Header says 'Count of Amount'", "A non-numeric cell in the column", "Find it with COUNTA minus COUNT"],
            ["Totals are small whole numbers", "You are counting rows, not money", "Change the aggregation, then check the column"],
            ["Some rows total, others do not", "Numbers stored as text in those rows", "Convert the column, then Refresh"],
          ],
          note: "The profiling check from lesson 21 — COUNTA(range) minus COUNT(range) — finds the offending cells in one formula.",
        },
        mistake:
          "Right-clicking and switching Count to Sum without looking at the column. The aggregation is now right, but the text cells still contribute nothing, so your total is quietly too low.",
      },
      {
        id: "a-average-in-pivots",
        title: "Averages in pivots, and the Grand Total trap",
        explain:
          "A pivot's Grand Total for an Average column is the average of ALL the underlying rows — not the average of the averages shown above it. Those two numbers are different whenever the groups are different sizes.",
        why: "Analysts get caught by this in meetings. Lagos averages 46,000, Abuja 71,667 and Kano 42,333; those three numbers average to 53,333. The Grand Total says 51,500, because it averages the twelve actual orders. The Grand Total is the correct figure, and it is the one you should quote.",
        table: {
          caption: "Average of Amount, with the two ways of totalling it.",
          headers: ["State", "Average of Amount", "Orders"],
          rows: [
            ["Lagos", "46,000", "6"],
            ["Abuja", "71,667", "3"],
            ["Kano", "42,333", "3"],
            ["Grand Total (correct)", "51,500", "12"],
            ["Average of the three averages (wrong)", "53,333", "—"],
          ],
          note: "618,000 ÷ 12 = 51,500. The Grand Total weights each order equally, which is what an average of order value means.",
        },
        mistake:
          "Copying the three group averages into a report and averaging them yourself. You have given every state equal weight regardless of how many orders it placed, which is a different statistic with a different meaning.",
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  {
    id: "l28-columns-and-filters",
    moduleId: "m2-pivots",
    sectionId: SECTION_ID,
    order: 3,
    title: "Columns, Filters and Slicers",
    subtitle: "Two dimensions at once, and narrowing what feeds them",
    estimatedMinutes: 17,
    intro:
      "One field in Rows gives you a list. Add a field to Columns and you get a grid — a cross-tabulation, which is where pivots stop being a faster SUM and start showing you things you could not otherwise see.",

    atoms: [
      {
        id: "a-columns-crosstab",
        title: "Columns: the second dimension",
        explain:
          "Put State in Rows and Category in Columns, and each cell becomes the total where both are true. Lagos Electronics is 92,000; Abuja Fashion is 98,000. You are now reading two breakdowns at once.",
        why: "A cross-tab answers questions a single list cannot. 'Lagos sells 276,000' is useful. 'Lagos sells 128,000 of groceries but Abuja sells 98,000 of fashion from three orders' tells you where to send which stock, and no one-dimensional summary would have shown it.",
        pivotExercise: {
          source: SALES,
          task:
            "Put State in Rows, Category in Columns and Amount in Values as a Sum. You are building a grid of sales by state and product type.",
          expect: { row: "State", column: "Category", value: "Amount", agg: "sum" },
          successMessage:
            "Nine numbers and two sets of totals from three drags. Lagos Groceries is the biggest cell at 128,000, and Abuja Fashion is 98,000 from a single order.",
        },
        table: {
          caption: "Sum of Amount — State down the side, Category across the top.",
          headers: ["State", "Electronics", "Fashion", "Groceries", "Grand Total"],
          rows: [
            ["Abuja", "55,000", "98,000", "62,000", "215,000"],
            ["Kano", "51,000", "33,000", "43,000", "127,000"],
            ["Lagos", "92,000", "56,000", "128,000", "276,000"],
            ["Grand Total", "198,000", "187,000", "233,000", "618,000"],
          ],
          note: "Both the row totals and the column totals add to 618,000. Any cross-tab whose two totals disagree has a filter you have forgotten about.",
        },
      },
      {
        id: "a-filters-area",
        title: "Filters removes rows before anything is counted",
        explain:
          "A field in Filters restricts the source data. Set Month to Mar and the pivot recalculates from only the four March orders — every cell, every total, the Grand Total included.",
        why: "This is the most dangerous area in a pivot, because a filter set last week looks exactly like no filter at all. The Grand Total drops from 618,000 to 203,000 and nothing on the sheet shouts about it. Check the Filters area before you trust any pivot you did not build this morning.",
        table: {
          caption: "The same pivot, unfiltered and filtered to March.",
          headers: ["State", "All months", "Month = Mar"],
          rows: [
            ["Abuja", "215,000", "55,000"],
            ["Kano", "127,000", "43,000"],
            ["Lagos", "276,000", "105,000"],
            ["Grand Total", "618,000", "203,000"],
          ],
          note: "Four of the twelve orders survive the filter. The shape of the table is identical, which is exactly why this catches people out.",
        },
        pivotExercise: {
          source: SALES,
          task:
            "Put State in Rows, Amount in Values as a Sum, then put Month in Filters and set it to Mar. Watch the Grand Total change.",
          expect: { row: "State", value: "Amount", agg: "sum", filter: "Month", filterValue: "Mar" },
          successMessage:
            "203,000 instead of 618,000, from four of the twelve orders. The caption above the table tells you how many rows survived — always read it.",
        },
      },
      {
        id: "a-filter-vs-row",
        title: "The same field in Filters or in Rows",
        explain:
          "Month in Filters shows you ONE month and hides the rest. Month in Rows shows you EVERY month as a breakdown. The first answers 'how did March go'; the second answers 'how do the months compare'.",
        why: "Learners routinely put a field in Filters when they meant Rows, then wonder why they cannot see the trend. If you want to compare things, they belong on an axis. Filters is for things you want to exclude, not things you want to study.",
        table: {
          caption: "Month, placed two ways.",
          headers: ["Placement", "You see", "Grand Total"],
          rows: [
            ["Month in Filters, set to Mar", "One month's totals", "203,000"],
            ["Month in Rows", "Jan 178,000, Feb 237,000, Mar 203,000", "618,000"],
          ],
          note: "Only the second arrangement lets you see that February was the strongest month. A filter would have hidden that entirely.",
        },
        mistake:
          "Filtering to one value to 'focus', then reporting the Grand Total as if it covered the whole dataset. This is how a quarterly figure gets reported as an annual one.",
      },
      {
        id: "a-pivot-slicers",
        title: "Slicers and timelines",
        explain:
          "A slicer is the Filters area turned into visible buttons. Same effect on the data, but the current selection is on screen where a reader can see it. A timeline is a slicer built for dates.",
        why: "Everything wrong with the Filters area is a visibility problem, and slicers fix it. On any pivot someone else will read, put the filter on a slicer. One slicer can also control several pivots at once, which is what makes a multi-chart dashboard feel like a single interactive report.",
        table: {
          caption: "Filters area against a slicer.",
          headers: ["", "Filters area", "Slicer"],
          rows: [
            ["Current selection visible?", "Only if you look in the box", "Yes, always on screen"],
            ["Controls several pivots?", "No", "Yes, via Report Connections"],
            ["Good for a dashboard?", "No", "Yes"],
            ["Built from", "Insert → PivotTable Fields", "Insert → Slicer"],
          ],
          note: "The simulator here uses a Filters dropdown, which behaves identically. In real Excel, put it on a slicer the moment anyone else will read the sheet.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  {
    id: "l29-grouping",
    moduleId: "m2-pivots",
    sectionId: SECTION_ID,
    order: 4,
    title: "Grouping",
    subtitle: "Turning 365 dates into 12 months, and prices into bands",
    estimatedMinutes: 15,
    intro:
      "A pivot on raw dates gives you one row per day, which is not a summary, it is the original data wearing a new hat. Grouping is how you turn that into something a person can read.",

    atoms: [
      {
        id: "a-why-group",
        title: "Why grouping exists",
        explain:
          "A pivot creates one row for every distinct value. A year of daily orders becomes 365 rows. Grouping collapses those into months or quarters, so the table shows a pattern instead of a list.",
        why: "The purpose of a summary is to be smaller than the thing it summarises. If your pivot has as many rows as your source data, the field you chose has too many distinct values and grouping is the fix.",
        table: {
          caption: "Distinct values decide your row count.",
          headers: ["Field in Rows", "Rows produced", "Readable?"],
          rows: [
            ["Order ID", "One per order", "No — that is the source data"],
            ["Order date, raw", "One per day", "No"],
            ["Order date, grouped by month", "12", "Yes"],
            ["State", "3", "Yes"],
          ],
          note: "Anything over about 25 rows stops being a summary and starts being a list you have to scroll.",
        },
      },
      {
        id: "a-date-grouping",
        title: "Date grouping",
        explain:
          "Right-click any date in the Rows area and choose Group. Excel offers Years, Quarters, Months and Days, and you can pick several at once to get a Year → Quarter → Month hierarchy you can expand and collapse.",
        why: "This is the single most-used pivot feature in business. Almost every report anyone asks you for is 'this thing, by month' — and grouping means you never add a helper column for it.",
        table: {
          caption: "The same order dates, grouped three ways.",
          headers: ["Grouping", "Rows", "Answers"],
          rows: [
            ["Days", "One per trading day", "When exactly did that spike happen?"],
            ["Months", "Jan 178,000 · Feb 237,000 · Mar 203,000", "How are we trending?"],
            ["Quarters", "One row for Q1", "How did the quarter close?"],
            ["Years + Quarters", "A collapsible hierarchy", "Both, in one table"],
          ],
          note: "Group by Years AND Months together. Grouping by month alone merges January 2025 and January 2026 into one row, which is a genuinely expensive mistake.",
        },
        mistake:
          "Grouping by Months only on a multi-year dataset. Every January collapses into a single row and the year-on-year comparison you were asked for silently becomes impossible.",
      },
      {
        id: "a-number-grouping",
        title: "Grouping numbers into bands",
        explain:
          "Numbers group too. Right-click a numeric field in Rows, choose Group, and set a start, an end and an interval. Order values become bands of 20,000, ages become decades, and a continuous field becomes a distribution you can read.",
        why: "This is how you turn 'here are 500 order values' into 'most of our orders are between 40,000 and 60,000'. It is a histogram built without a chart, and it answers the shape question from the exploratory module directly.",
        pivotExercise: {
          source: SALES,
          task:
            "Real Excel would let you group Amount into bands. Here, get as close as you can: put Category in Rows and Amount in Values, summarised by Average, to see which product type carries the biggest typical order.",
          expect: { row: "Category", value: "Amount", agg: "average" },
          successMessage:
            "Electronics 49,500, Fashion 62,333, Groceries 46,600. Fashion has the highest typical order value even though it has the smallest total — the kind of reversal a total alone would never show you.",
        },
        table: {
          caption: "Average of Amount by Category.",
          headers: ["Category", "Sum", "Count", "Average"],
          rows: [
            ["Electronics", "198,000", "4", "49,500"],
            ["Fashion", "187,000", "3", "62,333"],
            ["Groceries", "233,000", "5", "46,600"],
            ["Grand Total", "618,000", "12", "51,500"],
          ],
          note: "Groceries sells the most in total and the least per order. Fashion is the reverse. Totals and averages rank these categories in opposite orders.",
        },
      },
      {
        id: "a-grouping-mistakes",
        title: "What grouping breaks",
        explain:
          "Grouping needs a clean field. One text entry in a date column and Excel refuses to group at all, usually with a message about the selection not being valid. Blanks cause the same failure.",
        why: "The error message names the symptom rather than the cause, so people assume the feature is broken. It is not: the column is mixed, and the profiling habit from lesson 21 finds the offending cell in seconds.",
        table: {
          caption: "Grouping failures and their real causes.",
          headers: ["What Excel says", "What is actually wrong"],
          rows: [
            ["Cannot group that selection", "A text value or blank sits in the date column"],
            ["Dates appear as numbers", "The column is numeric, not date-typed"],
            ["Months merge across years", "You grouped by Months without Years"],
            ["Grouping applies to another pivot too", "Both pivots share one data cache — expected"],
          ],
          note: "The last one surprises people. Two pivots built from the same source share a cache, so grouping one groups the other.",
        },
        mistake:
          "Fixing the text cell in the source and expecting the pivot to notice. It will not until you Refresh — the pivot reads its cache, not your sheet.",
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  {
    id: "l30-calculated-fields-and-charts",
    moduleId: "m2-pivots",
    sectionId: SECTION_ID,
    order: 5,
    title: "Calculated Fields, Charts and Refresh",
    subtitle: "Making a pivot do arithmetic, and keeping it honest",
    estimatedMinutes: 17,
    intro:
      "Three things finish the module: getting a pivot to calculate something your source data does not contain, charting it, and the refresh discipline that stops a pivot quietly going stale.",

    atoms: [
      {
        id: "a-calculated-field",
        title: "Calculated fields",
        explain:
          "A calculated field adds a new Values column defined by a formula over OTHER fields — price per unit, margin, conversion rate. It lives in the pivot, not in your source data.",
        syntax: {
          pattern:
            "PivotTable Analyze → Fields, Items & Sets → Calculated Field\n\nName:    Price per unit\nFormula: = Amount / Units",
          args: [
            ["Name", "What the new column will be called. It appears in the Field List like any other field."],
            ["Formula", "An expression using FIELD NAMES, not cell references. =Amount/Units is valid; =F2/G2 is not."],
          ],
          returns: "A new field you can drag into Values like any other.",
          note: "The critical gotcha: a calculated field operates on the SUM of each field, not row by row. It computes SUM(Amount)/SUM(Units) for the group, which is a weighted average — usually what you want, but never the average of the per-row ratios.",
        },
        why: "Without this you would add a helper column to the source data, which means editing the original file — something you often cannot do, and should not do to a file someone else owns.",
        table: {
          caption: "Price per unit as a calculated field.",
          headers: ["State", "Sum of Amount", "Sum of Units", "= Amount / Units"],
          rows: [
            ["Abuja", "215,000", "21", "10,238"],
            ["Kano", "127,000", "17", "7,471"],
            ["Lagos", "276,000", "45", "6,133"],
            ["Grand Total", "618,000", "83", "7,446"],
          ],
          note: "Each figure is the group's total amount divided by the group's total units. Abuja sells fewer, pricier items; Lagos sells more, cheaper ones.",
        },
        mistake:
          "Expecting a calculated field to average the per-row ratios. It divides the totals instead, so a small order with a wild ratio barely moves it — which is usually correct, but only if you know that is what happened.",
      },
      {
        id: "a-pivot-charts",
        title: "Pivot charts",
        explain:
          "A pivot chart is a chart bound to a pivot table. Change the pivot and the chart follows; filter the chart and the pivot follows. They are two views of one thing.",
        why: "This is what makes an Excel dashboard interactive without a single line of code. One slicer, wired to three pivot charts, gives a reader a report they can explore themselves — and it updates on Refresh rather than on you rebuilding it.",
        table: {
          caption: "Choosing the chart for the pivot.",
          headers: ["Pivot shape", "Chart", "Why"],
          rows: [
            ["One category in Rows", "Bar chart", "Easiest to compare lengths"],
            ["Dates grouped in Rows", "Line chart", "Shows the trend between points"],
            ["Rows and Columns cross-tab", "Clustered or stacked column", "Two dimensions at once"],
            ["Parts of a whole, few slices", "Bar, still", "Pie charts are hard to read and hard to compare"],
          ],
          note: "If a chart type needs a legend to be understood, a bar chart with labels usually beats it.",
        },
        mistake:
          "Building a pie chart of sales by state because there are only three. A bar chart answers 'which is biggest, and by how much' at a glance, and a pie chart makes the reader estimate angles.",
      },
      {
        id: "a-refresh",
        title: "Refresh — the step everyone forgets",
        explain:
          "A pivot reads a cached copy of your data, taken when the pivot was created. Edit the source and the pivot will not change until you Refresh. Add ROWS to the source and even Refresh is not enough — the range itself has to include them.",
        why: "This is how a pivot silently goes stale and reports last month's numbers with this month's date on the slide. It shows no error, because from its own point of view nothing is wrong.",
        table: {
          caption: "What each situation needs.",
          headers: ["What changed", "What to do"],
          rows: [
            ["A value in an existing row", "Right-click → Refresh"],
            ["New rows added below", "Change Data Source, or make the source a Table first"],
            ["A column renamed", "Change Data Source and re-add the field"],
            ["Nothing, but the figures look old", "Refresh anyway, then check the Filters area"],
          ],
          note: "Format your source as a Table (Ctrl+T) BEFORE building the pivot. A Table grows automatically, so new rows are included on a plain Refresh and this whole class of problem disappears.",
        },
        mistake:
          "Pasting new data under the old and refreshing. The pivot's range still ends where it did, so the new rows are invisible and the totals are confidently wrong.",
      },
      {
        id: "a-getpivotdata",
        title: "GETPIVOTDATA, and why your reference broke",
        explain:
          "Click a pivot cell while writing a formula and Excel inserts GETPIVOTDATA rather than a cell reference. It looks alarming, but it is more robust than the reference it replaced: it asks for a value by NAME, so it survives the pivot changing shape.",
        syntax: {
          pattern:
            '=GETPIVOTDATA(data_field, pivot_table, [field1, item1], ...)',
          args: [
            ["data_field", 'The Values field you want, in quotes — "Amount".'],
            ["pivot_table", "Any cell inside the pivot, usually its top-left corner such as $A$3."],
            ["[field1, item1], ...", 'Which slice you want, in pairs — "State","Lagos". Omit them for the Grand Total.', "optional"],
          ],
          returns: "The value from that pivot cell, found by name rather than by position.",
          note: "It returns #REF! when the slice you asked for is not visible — a state that is filtered out, or a field no longer in the pivot. That error is correct behaviour: the number you asked for genuinely is not there.",
        },
        table: {
          caption: "Two ways to read the Lagos total.",
          headers: ["Formula", "Survives a new state being added?"],
          rows: [
            ["=B5", "No — rows shift and B5 is now a different state"],
            ['=GETPIVOTDATA("Amount",$A$3,"State","Lagos")', "Yes — it asks for Lagos by name"],
          ],
          note: "You can switch the automatic insertion off in PivotTable Analyze → Options. Do that only when you understand what you are giving up.",
        },
      },
      {
        id: "a-pivot-checklist",
        title: "The checklist before you send a pivot",
        explain:
          "Five checks, thirty seconds: read the Grand Total, read every Values header, look in the Filters area, Refresh, and confirm the source range covers all your rows.",
        why: "Every pivot failure in this module is caught by one of those five. Running them by reflex is the difference between a pivot you can defend and one that has been wrong since Tuesday.",
        table: {
          caption: "The pre-flight check.",
          headers: ["Check", "Catches"],
          rows: [
            ["Grand Total matches a known figure", "Filters, stale cache, missing rows"],
            ["Every header says the aggregation you meant", "Count-instead-of-Sum"],
            ["Filters area is empty or intended", "A filter left on from last week"],
            ["Refreshed just now", "Edits the pivot has not seen"],
            ["Source range covers every row", "Rows pasted below the range"],
          ],
          note: "The first check is the strongest. If your Grand Total equals a number you already trust from another method, almost nothing else can be badly wrong.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },
];
