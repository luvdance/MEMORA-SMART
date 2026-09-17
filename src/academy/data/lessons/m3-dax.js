/**
 * MODULE · DAX FROM ZERO (m3-dax)
 * Month 3 — Power BI
 *
 * The module summary promises DAX "built up slowly, not dumped on you", and
 * that is the whole design here. Most DAX material opens with CALCULATE, which
 * is like opening a driving course with a handbrake turn.
 *
 * THE ORDER MATTERS
 *   1. Measures vs calculated columns — the wrong choice here poisons everything
 *   2. The four aggregations, which cover most real work
 *   3. Filter context — the idea that makes DAX hard, taught by watching it
 *   4. CALCULATE, which only makes sense once you can see the context it changes
 *   5. Variables and time intelligence
 *
 * HOW RELATIONSHIPS FIT IN
 * The user asked for DAX and relationships together, and they belong together:
 * a measure has no idea which rows to add up until a filter reaches it along a
 * relationship. Every filter in this module travels the one-to-many join built
 * in the last one, and RELATED and USERELATIONSHIP are here because they are
 * DAX reaching across those joins deliberately.
 *
 * VERIFIED: every figure below was computed by lib/academy/dax.js and is
 * re-checked by the content validator.
 *   Lagos 186,000 (4 orders) · Abuja 215,000 (3) · Kano 94,000 (2)
 *   Total 495,000 (9) · average order 55,000
 *   % of total: Lagos 37.58 · Abuja 43.43 · Kano 18.99
 *   Orders over 50,000: Lagos 56,000 · Abuja 215,000 · Kano 51,000 · all 322,000
 *
 * CLIENT-SAFE. Knowledge-check answers live in lib/academy/assessments/.
 */

export const SECTION_ID = "s12-dax";

const STATES = {
  name: "States",
  headers: ["StateCode", "StateName"],
  rows: [["LA", "Lagos"], ["AB", "Abuja"], ["KN", "Kano"]],
};

/**
 * Nine orders, no orphans — the modelling module already taught what a broken
 * key does, and a learner debugging their first measure should not also be
 * wondering whether the data is wrong.
 *
 * Note that all three Abuja orders exceed 50,000. That is deliberate: it makes
 * the CALCULATE atom produce a figure identical to Abuja's plain total, which
 * is a genuine finding rather than a coincidence and is worth pointing out.
 */
const ORDERS = {
  name: "Orders",
  headers: ["Order", "StateCode", "Amount"],
  rows: [
    ["ORD-1", "LA", 45000],
    ["ORD-2", "AB", 62000],
    ["ORD-3", "LA", 38000],
    ["ORD-4", "KN", 51000],
    ["ORD-5", "LA", 47000],
    ["ORD-6", "AB", 98000],
    ["ORD-7", "KN", 43000],
    ["ORD-8", "LA", 56000],
    ["ORD-9", "AB", 55000],
  ],
};

const MODEL = {
  dim: STATES,
  fact: ORDERS,
  dimCol: "StateCode",
  factCol: "StateCode",
  labelColumn: "StateName",
};

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════ */
  {
    id: "l52-measures-vs-columns",
    moduleId: "m3-dax",
    sectionId: SECTION_ID,
    order: 1,
    title: "Measures and Calculated Columns",
    subtitle: "The first decision, and the one people get wrong",
    estimatedMinutes: 16,
    intro:
      "DAX gives you two places to write a calculation, and they are not interchangeable. Choosing wrongly does not produce an error — it produces a slow file and a number that will not respond to your slicers.",

    atoms: [
      {
        id: "a-dax-two-places",
        title: "A column is computed once. A measure is computed constantly.",
        explain:
          "A calculated column is evaluated for every row when the data refreshes, and the answer is stored. A measure is evaluated when a visual asks for it, against whatever that visual is filtered to, and nothing is stored.",
        why: "That difference decides everything. A stored column cannot respond to a slicer, because it was calculated before the slicer existed. A measure recalculates every time anything changes, which is exactly what a dashboard needs.",
        table: {
          caption: "The same two words, two behaviours.",
          headers: ["", "Calculated column", "Measure"],
          rows: [
            ["Evaluated", "Once, per row, on refresh", "Every time a visual asks"],
            ["Stored in the file?", "Yes — it costs memory", "No"],
            ["Responds to a slicer?", "No", "Yes"],
            ["Works row by row", "Yes", "No — it aggregates"],
            ["Can you slice BY it?", "Yes, it is a real column", "No"],
          ],
          note: "The last two rows are the practical test. If you need to group or filter BY the result, you need a column. If you need a number that reacts, you need a measure.",
        },
      },
      {
        id: "a-dax-which-one",
        title: "Choosing between them",
        explain:
          "Default to a measure. Reach for a calculated column only when you need to slice, group or filter by the result — a band, a flag, a category derived from a number.",
        why: "Beginners default to columns because a column looks like a spreadsheet and the result is visible in Table view. That instinct produces files that are large, slow and full of numbers that ignore the slicers, which is the worst of both.",
        table: {
          caption: "Real cases.",
          headers: ["You want", "Use", "Why"],
          rows: [
            ["Total revenue on a card", "Measure", "Must react to every slicer"],
            ["Revenue ÷ orders", "Measure", "The ratio depends on what is filtered"],
            ["An 'order size' band to group by", "Calculated column", "You slice BY it"],
            ["A yes/no flag for large orders", "Calculated column", "You filter BY it"],
            ["Line total = price × quantity per row", "Column, or better, Power Query", "Row-by-row, and Power Query is cheaper"],
          ],
          note: "The last row matters: if a row-level calculation can be done in Power Query, do it there. It costs less than a calculated column and it is recorded as a step.",
        },
        mistake:
          "Writing a calculated column for total revenue. It computes a per-row value, so the card shows the last row's figure or an error, and no slicer changes it.",
      },
      {
        id: "a-dax-writing-one",
        title: "Writing your first measure",
        explain:
          "Right-click the table in the Data pane, choose New measure, and type a name followed by an equals sign and an expression. The measure belongs to the model, not to the visual that uses it.",
        syntax: {
          pattern: "Revenue = SUM(Orders[Amount])",
          args: [
            ["Revenue", "The measure name. It appears in the field list and as a default chart title, so name it for a reader — 'Revenue', not 'M1'."],
            ["=", "Everything after this is the expression, re-evaluated per cell."],
            ["Orders[Amount]", "A fully qualified column: table name, then column in square brackets."],
          ],
          returns: "A single value, recalculated in every cell that uses it.",
          note: "Always qualify COLUMNS with their table (Orders[Amount]) and never qualify MEASURES ([Revenue]). That convention is what lets a reader tell them apart at a glance, and it is worth adopting from your first measure.",
        },
        why: "Write the measure once and every visual in the file can use it. Ten visuals sharing one Revenue measure means a change to the definition updates all ten — which is the same argument as one filled-down formula versus four hundred typed ones.",
      },
      {
        id: "a-dax-divide",
        title: "DIVIDE, not the slash",
        explain:
          "DIVIDE handles division by zero for you, returning blank instead of an error. The slash operator returns an error that then propagates into every visual reading that measure.",
        syntax: {
          pattern: "DIVIDE(numerator, denominator, [alternate result])",
          args: [
            ["numerator", "The top of the fraction — usually another measure."],
            ["denominator", "The bottom. This is the one that might be zero or blank."],
            ["[alternate result]", "What to return instead of blank when the denominator is zero. Omit it for blank, which is usually right.", "optional"],
          ],
          returns: "The quotient, or blank (or your alternate) when the denominator is zero or blank.",
          note: "Prefer blank over 0. A blank cell renders as empty and is excluded from averages; a 0 looks like a real measurement and quietly drags every average down — the same lesson as IFERROR in Month 2.",
        },
        table: {
          caption: "A state with no orders yet.",
          headers: ["Written as", "Result", "What the report shows"],
          rows: [
            ["SUM(Amount) / COUNTROWS(Orders)", "Error", "The error spreads to every visual"],
            ["DIVIDE(SUM(Amount), COUNTROWS(Orders))", "(blank)", "An empty cell, excluded from averages"],
            ["DIVIDE(..., ..., 0)", "0", "Looks like a real zero average — usually wrong"],
          ],
        },
        mistake:
          "Using DIVIDE with a third argument of 0 because blank looks untidy. You have replaced 'we do not know' with 'it is zero', which is the Month 2 blank-versus-zero mistake in a new language.",
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  {
    id: "l53-aggregations",
    moduleId: "m3-dax",
    sectionId: SECTION_ID,
    order: 2,
    title: "The Aggregations You Will Actually Use",
    subtitle: "SUM, COUNTROWS, AVERAGE, DISTINCTCOUNT",
    estimatedMinutes: 15,
    intro:
      "Four functions cover the overwhelming majority of real measures. You already know what they mean from Excel — what is new is that each one answers a different question about the same rows.",

    atoms: [
      {
        id: "a-dax-four",
        title: "The four, and what each one counts",
        explain:
          "SUM adds a column. COUNTROWS counts rows of a table. AVERAGE means a column. DISTINCTCOUNT counts how many different values a column holds.",
        syntax: {
          pattern:
            "Revenue        = SUM(Orders[Amount])\nOrder Count    = COUNTROWS(Orders)\nAvg Order      = AVERAGE(Orders[Amount])\nStates Selling = DISTINCTCOUNT(Orders[StateCode])",
          args: [
            ["SUM(table[column])", "Takes a COLUMN. Blanks are ignored."],
            ["COUNTROWS(table)", "Takes a TABLE, not a column — that is the difference from Excel's COUNT."],
            ["AVERAGE(table[column])", "Takes a column. Blanks are ignored; zeros are not."],
            ["DISTINCTCOUNT(table[column])", "Counts distinct values. Blank counts as one value if present."],
          ],
          returns: "One number, evaluated under the current filter.",
          note: "COUNTROWS takes a table where the others take a column. Passing it a column is the most common DAX syntax error a beginner hits, and the message is not especially helpful.",
        },
        table: {
          caption: "The same nine orders, four questions.",
          headers: ["Measure", "Total row", "Answers"],
          rows: [
            ["Revenue", "₦495,000", "How much money?"],
            ["Order Count", "9", "How many orders?"],
            ["Avg Order", "₦55,000", "How big is a typical order?"],
            ["States Selling", "3", "How many states bought anything?"],
          ],
          note: "₦495,000 ÷ 9 = ₦55,000. The average is consistent with the other two, which is always worth checking when you write a new measure.",
        },
      },
      {
        id: "a-dax-per-row",
        title: "Watch them evaluate per row",
        explain:
          "Put the four measures in a table with State on the rows. Each measure is calculated four times — once per state, and once more for the total — and each time it sees a different set of order rows.",
        dax: {
          model: MODEL,
          measures: [
            { name: "Revenue", kind: "sum", column: "Amount", dax: "Revenue = SUM(Orders[Amount])" },
            { name: "Order Count", kind: "count", dax: "Order Count = COUNTROWS(Orders)" },
            { name: "Avg Order", kind: "average", column: "Amount", dax: "Avg Order = AVERAGE(Orders[Amount])" },
          ],
          allowToggle: false,
          caption:
            "Read the small print under each row label: Lagos evaluates against 4 order rows, Abuja against 3, and the Total row against all 9. Same measure, different rows, different answer — which is the whole of the next lesson.",
        },
        why: "This is the moment DAX stops being Excel with different names. In Excel a formula has one answer because it sits in one cell. Here one definition produces a different answer in every cell, and the cell decides which.",
      },
      {
        id: "a-dax-count-variants",
        title: "COUNTROWS against DISTINCTCOUNT",
        explain:
          "COUNTROWS counts how many rows there are. DISTINCTCOUNT counts how many different values a column contains. On an order table those answer very different business questions.",
        why: "This is how you count customers rather than orders. COUNTROWS(Orders) tells you how many orders were placed; DISTINCTCOUNT(Orders[CustomerId]) tells you how many people placed them, and the gap between the two is repeat business.",
        table: {
          caption: "Which one the question needs.",
          headers: ["Question", "Measure"],
          rows: [
            ["How many orders?", "COUNTROWS(Orders)"],
            ["How many customers ordered?", "DISTINCTCOUNT(Orders[CustomerId])"],
            ["How many states did we sell into?", "DISTINCTCOUNT(Orders[StateCode])"],
            ["Average orders per customer", "DIVIDE(COUNTROWS(Orders), DISTINCTCOUNT(Orders[CustomerId]))"],
          ],
          note: "That last measure is three of the four functions in one line, and it answers a question no single aggregation can.",
        },
        mistake:
          "Reporting COUNTROWS as a customer count. One customer placing forty orders becomes forty customers, and every per-customer figure you build on it is wrong by that factor.",
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  {
    id: "l54-context",
    moduleId: "m3-dax",
    sectionId: SECTION_ID,
    order: 3,
    title: "Filter Context and Row Context",
    subtitle: "The idea that makes DAX hard, and then easy",
    estimatedMinutes: 18,
    intro:
      "There is exactly one difficult concept in DAX. Everything that confuses people about it — why a measure changes, why CALCULATE exists, why a percentage reads 100% — comes back to context. This lesson is the one to slow down on.",

    atoms: [
      {
        id: "a-dax-filter-context",
        title: "Filter context: the rows a cell can see",
        explain:
          "Filter context is the set of filters applying to a cell — from the row it sits on, the columns, any slicer, and any page or visual filter. A measure can only see the rows that survive all of them.",
        why: "Every surprising DAX result is a filter context you did not expect. Once you can ask 'what is filtering this cell?' and answer it, debugging DAX stops being guesswork.",
        analogy:
          "It is a search you did not type. Every cell quietly runs 'show me only the rows where State = Lagos', and the measure only ever sees the results.",
        table: {
          caption: "What contributes to the filter context of one cell.",
          headers: ["Source", "Example"],
          rows: [
            ["The row of the visual", "State = Lagos"],
            ["The column of the visual", "Month = March"],
            ["A slicer", "Region = South West"],
            ["A visual or page filter", "Amount > 0"],
            ["A relationship", "The filter arriving from a joined dimension"],
          ],
          note: "The last row is why the previous module comes first. A filter on States reaches Orders because a relationship carries it there — filter context travels along the joins you built.",
        },
      },
      {
        id: "a-dax-row-context",
        title: "Row context: one row at a time",
        explain:
          "Row context is what a calculated column has — it knows which row it is on. Measures do not have row context; they have filter context. Iterators like SUMX create a row context on purpose.",
        why: "This is why SUM(Orders[Price] * Orders[Quantity]) does not work. SUM wants one column, and multiplying two columns is a row-by-row operation with no row to stand on. SUMX supplies one.",
        syntax: {
          pattern: "SUMX(table, expression)",
          args: [
            ["table", "The table to walk, one row at a time."],
            ["expression", "Evaluated for each row, with that row's values available. The results are then added."],
          ],
          returns: "The sum of the expression across every row in the current filter context.",
          note: "SUMX(Orders, Orders[Price] * Orders[Quantity]) works because SUMX creates a row context. SUM(Orders[Price] * Orders[Quantity]) does not, because SUM takes a column and receives an expression.",
        },
        table: {
          caption: "Which context each thing has.",
          headers: ["Thing", "Row context?", "Filter context?"],
          rows: [
            ["Calculated column", "Yes", "No"],
            ["Measure", "No", "Yes"],
            ["Inside SUMX / AVERAGEX", "Yes — created by the iterator", "Yes"],
          ],
          note: "An iterator is the only place a measure gets a row context, and it is why the X functions exist at all.",
        },
        mistake:
          "Reaching for SUMX everywhere because it feels more powerful. SUM is faster and clearer. Use an iterator only when the expression genuinely needs row-level values multiplied or compared before being aggregated.",
      },
      {
        id: "a-dax-see-it",
        title: "See the context change — and break it",
        explain:
          "A percent-of-total measure needs a denominator that does NOT shrink with its own row. That is what ALL() does. Toggle it off below and watch every percentage collapse to 100%.",
        dax: {
          model: MODEL,
          measures: [
            { name: "Revenue", kind: "sum", column: "Amount", dax: "Revenue = SUM(Orders[Amount])" },
            {
              name: "All Revenue",
              kind: "sumAll",
              column: "Amount",
              dax: "All Revenue = CALCULATE(SUM(Orders[Amount]), ALL(States))",
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
          caption:
            "Lagos 37.58%, Abuja 43.43%, Kano 18.99% — and they sum to 100%. Notice that All Revenue reads ₦495,000 on EVERY row: ALL() has removed the state filter, so the denominator never shrinks. On the Total row the two measures agree, because there was no row filter to remove.",
        },
        why: "Tick the box and every row reads 100%, because the denominator is being filtered by the same row as the numerator, so each row is divided by itself. Nothing errors, the visual renders, and the percentages are meaningless — which is why this bug reaches production so often.",
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  {
    id: "l55-calculate",
    moduleId: "m3-dax",
    sectionId: SECTION_ID,
    order: 4,
    title: "CALCULATE",
    subtitle: "The one function that changes the context",
    estimatedMinutes: 18,
    intro:
      "CALCULATE is the most important function in DAX and the only one that can modify filter context. Now that you can see context, it is straightforward: it evaluates an expression under filters you specify instead of the ones it inherited.",

    atoms: [
      {
        id: "a-dax-calculate",
        title: "What CALCULATE does",
        explain:
          "CALCULATE takes an expression and a list of filter arguments. It evaluates the expression as if those filters applied, replacing any existing filter on the same column.",
        syntax: {
          pattern: "CALCULATE(expression, [filter1], [filter2], ...)",
          args: [
            ["expression", "What to calculate — usually an aggregation or another measure."],
            ["[filter1], ...", "Filters to apply. Each REPLACES any existing filter on the same column rather than adding to it.", "optional"],
          ],
          returns: "The expression's value under the modified filter context.",
          note: "Replace, not narrow — that is the detail people miss. CALCULATE(SUM(Amount), States[StateName]=\"Lagos\") returns Lagos on every row of the visual, because it overwrote the row's own state filter. Use KEEPFILTERS when you want to narrow instead.",
        },
        table: {
          caption: "The three filter shapes you will use most.",
          headers: ["Filter argument", "Effect"],
          rows: [
            ['Orders[Amount] > 50000', "Narrows to large orders"],
            ["ALL(States)", "Removes the state filter entirely"],
            ["ALLSELECTED(States)", "Removes the row filter but respects the slicer"],
            ["FILTER(Orders, <condition>)", "A table expression, for conditions too complex for the simple form"],
          ],
          note: "ALLSELECTED is the one to reach for in a percent-of-total on a report with slicers: percentages that total 100% of what the user has selected, rather than of the whole dataset.",
        },
      },
      {
        id: "a-dax-calculate-condition",
        title: "CALCULATE with a condition",
        explain:
          "Add a condition and CALCULATE narrows the rows inside each cell's existing context. A 'large orders' measure evaluates per state, but only over the orders above the threshold.",
        dax: {
          model: MODEL,
          measures: [
            { name: "Revenue", kind: "sum", column: "Amount", dax: "Revenue = SUM(Orders[Amount])" },
            {
              name: "Large Orders",
              kind: "sumWhere",
              column: "Amount",
              filterColumn: "Amount",
              op: ">",
              value: 50000,
              dax: "Large Orders =\n    CALCULATE(SUM(Orders[Amount]), Orders[Amount] > 50000)",
            },
          ],
          allowToggle: false,
          caption:
            "Lagos ₦56,000 of ₦186,000 — one order in four clears the threshold. Kano ₦51,000 of ₦94,000. Abuja ₦215,000 of ₦215,000: every single Abuja order is over ₦50,000, which is a finding about Abuja rather than a quirk of the measure.",
        },
        why: "Notice that Abuja's two figures are identical. A beginner reads that as a broken measure; it is the data telling you Abuja sells only large orders. Checking a surprising result against the underlying rows is the habit that separates the two reactions.",
      },
      {
        id: "a-dax-filter-function",
        title: "FILTER, and when the simple form is not enough",
        explain:
          "The simple filter form takes a condition on one column. FILTER returns a whole table and can express anything — comparisons between columns, conditions involving a measure, logic that spans rows.",
        syntax: {
          pattern:
            "Above Average =\n    CALCULATE(\n        SUM(Orders[Amount]),\n        FILTER(Orders, Orders[Amount] > AVERAGE(Orders[Amount]))\n    )",
          args: [
            ["FILTER(table, condition)", "Walks the table row by row — it has a row context — and returns the rows where the condition is true."],
            ["condition", "Can reference several columns, or a measure, which the simple filter form cannot."],
          ],
          returns: "A table, which CALCULATE then uses as a filter.",
          note: "FILTER iterates, so it is slower than the simple form. Use the simple condition where it will do the job, and FILTER only when it will not.",
        },
        mistake:
          "Wrapping every filter in FILTER because it always works. On a large model that is a real performance cost for no benefit — the simple form is both faster and easier to read.",
      },
      {
        id: "a-dax-variables",
        title: "Variables make measures readable",
        explain:
          "VAR names an intermediate value and RETURN gives the result. The variable is evaluated once, so repeating it costs nothing, and the measure reads like an explanation of itself.",
        syntax: {
          pattern:
            "% of Total =\nVAR ThisState = SUM(Orders[Amount])\nVAR Everything = CALCULATE(SUM(Orders[Amount]), ALL(States))\nRETURN\n    DIVIDE(ThisState, Everything)",
          args: [
            ["VAR name = expression", "Declares a value. Evaluated once, in the context where it is declared."],
            ["RETURN", "Marks the expression that produces the measure's result. Exactly one RETURN per measure."],
          ],
          returns: "Whatever the RETURN expression evaluates to.",
          note: "A variable captures the context at the point it is DECLARED. That is usually what you want, and it occasionally surprises people who expected it to be re-evaluated later inside a CALCULATE.",
        },
        why: "Beyond readability there is a real performance argument: a repeated sub-expression is calculated once rather than every time it appears. And a measure a colleague can read is a measure a colleague can check.",
        table: {
          caption: "The same measure, two ways.",
          headers: ["Without variables", "With variables"],
          rows: [
            ["One long nested line", "Named steps, one per line"],
            ["Sub-expressions recalculated", "Evaluated once each"],
            ["Hard to debug", "RETURN any variable to inspect it"],
          ],
          note: "That debugging trick is worth knowing: temporarily change RETURN to a variable name to see what that step produced.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  {
    id: "l56-time-and-relationships",
    moduleId: "m3-dax",
    sectionId: SECTION_ID,
    order: 5,
    title: "Time Intelligence and Crossing Relationships",
    subtitle: "Year-to-date, last year, and reaching into another table",
    estimatedMinutes: 18,
    intro:
      "Two things remain: the time calculations every report eventually asks for, and the DAX that deliberately crosses the relationships you built in the last module.",

    atoms: [
      {
        id: "a-dax-time-needs-date-table",
        title: "Time intelligence needs a marked date table",
        explain:
          "Every time intelligence function assumes a proper date dimension: one row per date, continuous, and marked as the date table. Without it they return values that look plausible and are wrong.",
        why: "This is the payoff for the least glamorous atom in the modelling module. The functions do not error without a marked date table — they silently misbehave, which is worse.",
        table: {
          caption: "The prerequisites, and the symptom of skipping each.",
          headers: ["Requirement", "If missing"],
          rows: [
            ["A date table with every date", "Periods with no sales vanish from the axis"],
            ["Marked as the date table", "Time intelligence returns wrong values, silently"],
            ["Joined to the fact's date column", "The date slicer filters nothing"],
            ["Whole years covered", "Year-to-date is wrong in the first year"],
          ],
          note: "Four one-time actions, four different confusing symptoms. Check all four before debugging a time measure.",
        },
      },
      {
        id: "a-dax-ytd",
        title: "Year-to-date and prior periods",
        explain:
          "TOTALYTD accumulates from the start of the year to the current context. SAMEPERIODLASTYEAR shifts the whole filter back twelve months, which is how you build a year-on-year comparison.",
        syntax: {
          pattern:
            "Revenue YTD =\n    TOTALYTD([Revenue], Calendar[Date])\n\nRevenue LY =\n    CALCULATE([Revenue], SAMEPERIODLASTYEAR(Calendar[Date]))\n\nYoY % =\n    DIVIDE([Revenue] - [Revenue LY], [Revenue LY])",
          args: [
            ["[Revenue]", "An existing measure. Build time intelligence on measures you already trust, not on fresh aggregations."],
            ["Calendar[Date]", "The date column of your marked date table — never the fact table's date column."],
            ["SAMEPERIODLASTYEAR", "Shifts the current filter back one year. Inside CALCULATE, because it modifies context."],
          ],
          returns: "A number in the shifted or accumulated period.",
          note: "Build these on top of an existing measure. [Revenue LY] referring to [Revenue] means fixing the revenue definition once fixes both, and the year-on-year measure inherits it too.",
        },
        table: {
          caption: "The three measures a time-based report almost always needs.",
          headers: ["Measure", "Answers"],
          rows: [
            ["Revenue", "How much this month?"],
            ["Revenue YTD", "How much so far this year?"],
            ["Revenue LY", "How much in the same month last year?"],
            ["YoY %", "Are we ahead of last year, and by how much?"],
          ],
          note: "YoY % uses DIVIDE, so a month with no prior-year data returns blank rather than an error — which is correct, because the comparison genuinely does not exist.",
        },
        mistake:
          "Using the fact table's date column in a time intelligence function. It works on the data you have and breaks the moment a period has no rows, because that date simply is not there to accumulate.",
      },
      {
        id: "a-dax-related",
        title: "RELATED — reaching along the relationship",
        explain:
          "In a calculated column, RELATED follows a many-to-one relationship to fetch a value from the dimension. RELATEDTABLE goes the other way and returns the matching fact rows.",
        syntax: {
          pattern:
            "In a calculated column on Orders:\n    Region = RELATED(States[Region])\n\nIn a calculated column on States:\n    Order Count = COUNTROWS(RELATEDTABLE(Orders))",
          args: [
            ["RELATED(column)", "Follows the MANY-to-one direction. Used on the many side to pull one matching value."],
            ["RELATEDTABLE(table)", "Follows the one-to-MANY direction. Returns the related rows as a table."],
          ],
          returns: "RELATED returns a single value. RELATEDTABLE returns a table, so it needs wrapping in something that aggregates.",
          note: "Both need a row context, which means they work in calculated columns and inside iterators — and not in a plain measure. That restriction follows directly from the row-versus-filter-context distinction.",
        },
        why: "This is DAX using the model deliberately rather than by accident. And the most important thing about RELATED is that you usually do not need it: a measure filtered by a dimension already works through the relationship, with no function at all.",
        mistake:
          "Using RELATED to copy dimension columns onto the fact table so everything is in one place. You have rebuilt the flat table the star schema was designed to avoid, and made the file larger doing it.",
      },
      {
        id: "a-dax-userelationship",
        title: "USERELATIONSHIP — switching which join is active",
        explain:
          "Only one relationship between two tables can be active. USERELATIONSHIP activates an inactive one for a single calculation, which is how one date table serves both order date and delivery date.",
        syntax: {
          pattern:
            "Delivered Revenue =\n    CALCULATE(\n        [Revenue],\n        USERELATIONSHIP(Orders[DeliveryDate], Calendar[Date])\n    )",
          args: [
            ["[Revenue]", "The measure to re-evaluate under the different join."],
            ["USERELATIONSHIP(col1, col2)", "The two ends of the INACTIVE relationship to switch on, for this calculation only."],
          ],
          returns: "The measure's value grouped by delivery date instead of order date.",
          note: "It must sit inside CALCULATE, because it modifies context. And the relationship has to exist as inactive first — USERELATIONSHIP activates a relationship, it does not create one.",
        },
        why: "Put [Revenue] and [Delivered Revenue] side by side against the same date axis and you can see the lag between ordering and delivery. Two measures, one date table, no duplicated data.",
      },
      {
        id: "a-dax-checklist",
        title: "The DAX checklist",
        explain:
          "Measure not column unless you slice by it, DIVIDE not slash, ALL or ALLSELECTED in every percent-of-total, variables in anything longer than a line, time intelligence only on a marked date table, and every new measure sanity-checked against a total you trust.",
        why: "Every item is something that produces a wrong number rather than an error. DAX almost never tells you that you are wrong; it tells you a number, and the number is confident either way.",
        table: {
          caption: "Before you ship a measure.",
          headers: ["Check", "Catches"],
          rows: [
            ["It is a measure, not a calculated column", "A number that ignores the slicers"],
            ["Division uses DIVIDE", "Errors spreading across the report"],
            ["Percent-of-total uses ALL or ALLSELECTED", "Every row reading 100%"],
            ["Long expressions use VAR", "Unreadable measures and repeated work"],
            ["Time intelligence uses the marked date table", "Silently wrong periods"],
            ["The Total row matches a figure you trust", "Almost everything else"],
          ],
          note: "The last check is the strongest, exactly as it was for pivot tables in Month 2. A measure whose total agrees with a number you already trust is very unlikely to be badly wrong.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },
];
