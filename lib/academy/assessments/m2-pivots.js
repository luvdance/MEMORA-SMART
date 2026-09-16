/**
 * ASSESSMENTS · PIVOT TABLES & AGGREGATION (m2-pivots)
 *
 * SERVER ONLY. See m1-data-foundations.js for the contract and writing style.
 *
 * Pivot questions are easy to write badly — "which area makes the rows?" tests
 * nothing but vocabulary. Every question here describes a pivot that is
 * misbehaving in a way the learner will genuinely meet, and asks what is
 * actually wrong with it.
 *
 * Figures come from the SALES dataset in the lesson file and are recomputed by
 * lib/academy/pivot.js on every build:
 *   Lagos 276,000 (6 orders) · Abuja 215,000 (3) · Kano 127,000 (3)
 *   Grand total 618,000 · Jan 178,000 · Feb 237,000 · Mar 203,000
 */

export const ASSESSMENTS = {
  /* ═══════════════════════════════════════════════════════════════════ */
  "l26-pivot-anatomy": {
    lessonId: "l26-pivot-anatomy",
    passMark: 70,
    questions: [
      {
        id: "q26-1",
        type: "mcq",
        difficulty: 2,
        atomId: "a-what-a-pivot-is",
        prompt:
          "You have written 3 SUMIFS formulas to total sales by state. Your manager says the company is expanding to 36 states. What changes if you had used a pivot table?",
        options: [
          { id: "a", text: "Nothing — you would still need 36 of something" },
          { id: "b", text: "Nothing changes at all: the same two fields in Rows and Values produce 36 rows instead of 3" },
          { id: "c", text: "Pivot tables have a limit of 10 rows" },
          { id: "d", text: "You would need to rebuild the pivot for each state" },
        ],
        correct: "b",
        explanation:
          "A pivot creates one row per distinct value automatically. Three states or thirty-six, the build effort is identical — and a new state appearing needs only a Refresh, not a new formula.",
        whyWrong: {
          a: "This is the point of the comparison. SUMIFS effort scales with the number of groups; pivot effort does not.",
          c: "Pivot tables handle hundreds of thousands of rows. There is no such limit.",
          d: "One pivot covers every state at once. Rebuilding per state would be the SUMIFS approach with extra steps.",
        },
      },
      {
        id: "q26-2",
        type: "mcq",
        difficulty: 2,
        atomId: "a-four-areas",
        prompt:
          "You want to compare sales across all three months. Which area should Month go in?",
        options: [
          { id: "a", text: "Filters" },
          { id: "b", text: "Rows or Columns" },
          { id: "c", text: "Values" },
          { id: "d", text: "It does not matter" },
        ],
        correct: "b",
        explanation:
          "Comparing means seeing things side by side, so the field belongs on an axis. Month in Rows gives Jan 178,000, Feb 237,000, Mar 203,000 — a comparison you can read at a glance.",
        whyWrong: {
          a: "Filters shows one month and hides the other two, which makes comparison impossible. Filters is for excluding, not studying.",
          c: "Values aggregates numbers. Month is a label, so it would be counted rather than totalled.",
          d: "It matters completely. The same field in Filters and in Rows produce opposite outcomes.",
        },
      },
      {
        id: "q26-3",
        type: "mcq",
        difficulty: 3,
        atomId: "a-first-pivot",
        prompt:
          "Your pivot of State against Sum of Amount shows a Grand Total of 203,000. You know the dataset totals 618,000. What is the most likely cause?",
        options: [
          { id: "a", text: "The pivot is broken" },
          { id: "b", text: "A filter is active, so only some rows are feeding the pivot" },
          { id: "c", text: "Excel rounds large totals" },
          { id: "d", text: "You used Average instead of Sum" },
        ],
        correct: "b",
        explanation:
          "203,000 is exactly the March-only total. A field sitting in the Filters area restricts every figure in the pivot, Grand Total included, and the table looks completely normal while it does so. Always read the Grand Total against a number you already trust.",
        whyWrong: {
          a: "The pivot is doing precisely what it was told. The instruction is the problem, not the tool.",
          c: "Excel does not silently round totals. 203,000 is a real sum of a subset.",
          d: "Average would give roughly 51,500, not 203,000, and the header would say 'Average of Amount'.",
        },
      },
      {
        id: "q26-4",
        type: "mcq",
        difficulty: 3,
        atomId: "a-pivot-vs-formulas",
        prompt:
          "You need one cell holding total revenue, which a KPI card on your dashboard reads. Pivot or formula?",
        options: [
          { id: "a", text: "Pivot — it is faster to build" },
          { id: "b", text: "A SUMIFS or SUM in a fixed cell, because a pivot moves when its shape changes" },
          { id: "c", text: "Either; they behave identically" },
          { id: "d", text: "A pivot, then point the card at the Grand Total cell" },
        ],
        correct: "b",
        explanation:
          "Anything reading a fixed cell needs that cell to stay put. Add a state and every row of a pivot shifts down, so a reference into it now points somewhere else. A formula in a cell you control cannot move.",
        whyWrong: {
          a: "Build speed is irrelevant for a single number that has to stay at a known address.",
          c: "They differ in exactly the way that matters here: a pivot's layout is not stable, a cell's is.",
          d: "The Grand Total cell moves as rows are added. That is how dashboards break a month after they are signed off.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "l27-values-and-aggregation": {
    lessonId: "l27-values-and-aggregation",
    passMark: 70,
    questions: [
      {
        id: "q27-1",
        type: "mcq",
        difficulty: 2,
        atomId: "a-count-trap",
        prompt:
          "You drag Amount into Values expecting sales totals, but the column header reads 'Count of Amount' and the numbers are 6, 3 and 3. What does that tell you?",
        options: [
          { id: "a", text: "Excel picked the wrong default at random" },
          { id: "b", text: "At least one cell in the Amount column is not numeric, so Excel treated the whole field as text" },
          { id: "c", text: "There are only 12 orders, so the numbers are right" },
          { id: "d", text: "The pivot needs refreshing" },
        ],
        correct: "b",
        explanation:
          "Excel defaults to Sum for a field it reads as fully numeric and Count for anything else. Count appearing is Excel reporting a data problem, not a preference. Find the offending cells with COUNTA(range) minus COUNT(range), fix them, and Refresh.",
        whyWrong: {
          a: "The default is deterministic and documented. It is derived from the column's contents.",
          c: "6, 3 and 3 are order counts, not money. They are correct counts of the wrong thing.",
          d: "A refresh re-reads the same text cells and gives the same Count. The column must be fixed first.",
        },
      },
      {
        id: "q27-2",
        type: "mcq",
        difficulty: 3,
        atomId: "a-sum-vs-count",
        prompt:
          "Lagos: 276,000 from 6 orders. Abuja: 215,000 from 3 orders. Your manager asks which state is performing better. What is the best answer?",
        options: [
          { id: "a", text: "Lagos, because the total is higher" },
          { id: "b", text: "Abuja, because its orders are bigger" },
          { id: "c", text: "Lagos on total revenue, Abuja on order size — and ask which one the decision depends on" },
          { id: "d", text: "They are equivalent" },
        ],
        correct: "c",
        explanation:
          "Both rankings are true and they disagree: Lagos brings in more money, Abuja averages 71,667 per order against Lagos's 46,000. Which one counts depends on whether the decision is about revenue or about where to send a salesperson, and that is worth asking before answering.",
        whyWrong: {
          a: "True but incomplete. Quoting only the total hides that Abuja achieves nearly as much from half the orders.",
          b: "Also true and also incomplete. Order size alone ignores that Lagos generates more revenue overall.",
          d: "They are not equivalent on any measure. The totals differ, the counts differ and the averages differ.",
        },
      },
      {
        id: "q27-3",
        type: "mcq",
        difficulty: 3,
        atomId: "a-average-in-pivots",
        prompt:
          "A pivot shows average order value of 46,000 (Lagos), 71,667 (Abuja) and 42,333 (Kano), with a Grand Total of 51,500. Why is the Grand Total not 53,333, the average of those three?",
        options: [
          { id: "a", text: "Excel has rounded" },
          { id: "b", text: "The Grand Total averages all 12 individual orders, not the three group averages" },
          { id: "c", text: "The Grand Total is wrong" },
          { id: "d", text: "One state is being filtered out" },
        ],
        correct: "b",
        explanation:
          "618,000 ÷ 12 = 51,500. The Grand Total weights every order equally. Averaging the three group averages instead gives each state equal weight regardless of its six or three orders, which is a different statistic. The Grand Total is the one to quote.",
        whyWrong: {
          a: "The gap is 1,833. Rounding cannot produce that.",
          c: "The Grand Total is correct; it simply answers 'the average order' rather than 'the average of the state averages'.",
          d: "All three states are present, and they sum to the full 618,000.",
        },
      },
      {
        id: "q27-4",
        type: "mcq",
        difficulty: 2,
        atomId: "a-value-field",
        prompt:
          "What should you check first on any pivot someone hands you?",
        options: [
          { id: "a", text: "The colour scheme" },
          { id: "b", text: "The Grand Total, and what every Values header says it is aggregating" },
          { id: "c", text: "The number of rows" },
          { id: "d", text: "Whether it has a chart" },
        ],
        correct: "b",
        explanation:
          "Those two checks catch nearly every pivot failure at once. A Grand Total that does not match a figure you trust means a filter or stale data; a header reading Count when you expected Sum means the source column is not numeric.",
        whyWrong: {
          a: "Formatting tells you nothing about whether the numbers are right.",
          c: "Row count is occasionally useful but it would not catch a wrong aggregation or an active filter.",
          d: "A chart of wrong numbers is still wrong. The underlying figures come first.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "l28-columns-and-filters": {
    lessonId: "l28-columns-and-filters",
    passMark: 70,
    questions: [
      {
        id: "q28-1",
        type: "mcq",
        difficulty: 2,
        atomId: "a-columns-crosstab",
        prompt:
          "In a State × Category cross-tab, the row totals add to 618,000 but the column totals add to 512,000. What does that mean?",
        options: [
          { id: "a", text: "Normal — the two totals measure different things" },
          { id: "b", text: "Something is wrong: both sets of totals cover the same cells and must agree" },
          { id: "c", text: "The columns need sorting" },
          { id: "d", text: "Excel cannot total both directions at once" },
        ],
        correct: "b",
        explanation:
          "Both totals are sums over the identical set of visible cells, so they must match. When they do not, something is excluding rows from one axis — commonly a field filter applied to the Category field rather than a Filters-area filter.",
        whyWrong: {
          a: "They measure the same cells from two directions. Disagreement is always a symptom.",
          c: "Sort order cannot change a sum.",
          d: "Excel totals both directions routinely, and they agree when nothing is being excluded.",
        },
      },
      {
        id: "q28-2",
        type: "mcq",
        difficulty: 3,
        atomId: "a-filters-area",
        prompt:
          "You open a pivot a colleague built last month and the figures look low. What do you check before anything else?",
        options: [
          { id: "a", text: "Rebuild it from scratch" },
          { id: "b", text: "The Filters area, then Refresh — a filter left on last month silently restricts every figure" },
          { id: "c", text: "The chart type" },
          { id: "d", text: "Whether they used Sum" },
        ],
        correct: "b",
        explanation:
          "A filter left on looks identical to no filter at all: same layout, same headers, smaller numbers. Combined with a stale cache, those two account for the overwhelming majority of 'the pivot is wrong' reports.",
        whyWrong: {
          a: "Rebuilding may work but you learn nothing, and you would probably repeat whatever the mistake was.",
          c: "The chart draws whatever the pivot says. It cannot make figures low on its own.",
          d: "Worth checking, but a wrong aggregation usually changes the numbers dramatically rather than making them merely low.",
        },
      },
      {
        id: "q28-3",
        type: "mcq",
        difficulty: 3,
        atomId: "a-filter-vs-row",
        prompt:
          "Month in Filters set to Mar gives a Grand Total of 203,000. Month in Rows gives a Grand Total of 618,000. Which is wrong?",
        options: [
          { id: "a", text: "The first" },
          { id: "b", text: "The second" },
          { id: "c", text: "Neither — they answer different questions" },
          { id: "d", text: "Both" },
        ],
        correct: "c",
        explanation:
          "Filtered to March you are looking at four orders totalling 203,000. With Month in Rows you see all twelve broken down by month, totalling 618,000. Both are correct; the danger is reporting the first while believing it is the second.",
        whyWrong: {
          a: "203,000 is the genuine March total. It is only wrong if presented as the figure for every month.",
          b: "618,000 is the genuine total of the whole dataset.",
          d: "Neither figure is incorrect. The risk lies entirely in mislabelling them.",
        },
      },
      {
        id: "q28-4",
        type: "mcq",
        difficulty: 2,
        atomId: "a-pivot-slicers",
        prompt:
          "You are building a dashboard others will read. Why put the filter on a slicer instead of leaving it in the Filters area?",
        options: [
          { id: "a", text: "Slicers calculate faster" },
          { id: "b", text: "The current selection stays visible on screen, and one slicer can drive several pivots at once" },
          { id: "c", text: "The Filters area does not work on dashboards" },
          { id: "d", text: "Slicers allow more values" },
        ],
        correct: "b",
        explanation:
          "Everything dangerous about the Filters area is a visibility problem, and a slicer solves it: the reader can see what is selected. Report Connections then lets one slicer control several pivots, which is what makes a dashboard feel like one interactive report.",
        whyWrong: {
          a: "Both filter the same cached data. There is no meaningful speed difference.",
          c: "It works perfectly well. It is simply easy to overlook, which is the problem.",
          d: "Both handle the same set of values. The difference is visibility and shared control.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "l29-grouping": {
    lessonId: "l29-grouping",
    passMark: 70,
    questions: [
      {
        id: "q29-1",
        type: "mcq",
        difficulty: 2,
        atomId: "a-why-group",
        prompt:
          "Your pivot of a year of daily orders produces 365 rows. What has gone wrong?",
        options: [
          { id: "a", text: "Nothing — that is the data" },
          { id: "b", text: "The date field needs grouping into months or quarters, or the pivot is not summarising anything" },
          { id: "c", text: "The dataset is too large for a pivot" },
          { id: "d", text: "You should filter to one day at a time" },
        ],
        correct: "b",
        explanation:
          "A summary should be smaller than its source. One row per day is the original data with a new heading. Grouping by month turns it into twelve readable rows that actually show a trend.",
        whyWrong: {
          a: "It is the data, and that is the objection. You built a pivot to summarise and it summarised nothing.",
          c: "365 rows is trivial for a pivot. Readability is the issue, not capacity.",
          d: "That gives you one day at a time and no trend at all, which is further from the goal.",
        },
      },
      {
        id: "q29-2",
        type: "mcq",
        difficulty: 3,
        atomId: "a-date-grouping",
        prompt:
          "You group three years of sales by Months only. What have you accidentally done?",
        options: [
          { id: "a", text: "Nothing — you get 36 rows" },
          { id: "b", text: "Merged all three Januaries into one row, making year-on-year comparison impossible" },
          { id: "c", text: "Excluded two of the years" },
          { id: "d", text: "Created a filter" },
        ],
        correct: "b",
        explanation:
          "Grouping by Months alone buckets by month NAME, so January 2024, 2025 and 2026 collapse into a single row. Select Years and Months together to get the hierarchy, and the comparison you were asked for.",
        whyWrong: {
          a: "You get 12 rows, not 36 — which is exactly the problem, since the three years have been merged.",
          c: "No data is excluded. All three years are in there, added together in the wrong buckets.",
          d: "Grouping does not filter. Every row still contributes, just to a merged bucket.",
        },
      },
      {
        id: "q29-3",
        type: "mcq",
        difficulty: 3,
        atomId: "a-number-grouping",
        prompt:
          "Groceries totals 233,000 from 5 orders; Fashion totals 187,000 from 3. Which category has the higher typical order value?",
        options: [
          { id: "a", text: "Groceries, because the total is higher" },
          { id: "b", text: "Fashion — 62,333 per order against Groceries' 46,600" },
          { id: "c", text: "They are equal" },
          { id: "d", text: "There is not enough information" },
        ],
        correct: "b",
        explanation:
          "187,000 ÷ 3 = 62,333 and 233,000 ÷ 5 = 46,600. Groceries sells the most in total and the least per order, so totals and averages rank these two categories in opposite directions. Which one matters depends on the question.",
        whyWrong: {
          a: "A higher total across more orders says nothing about the size of a typical one.",
          c: "They differ by nearly 16,000 per order.",
          d: "The totals and the counts are both given, which is all an average needs.",
        },
      },
      {
        id: "q29-4",
        type: "mcq",
        difficulty: 3,
        atomId: "a-grouping-mistakes",
        prompt:
          "Excel refuses to group your date field, saying the selection is not valid. What is the usual cause?",
        options: [
          { id: "a", text: "Pivot tables cannot group dates" },
          { id: "b", text: "A text value or a blank is sitting in the date column, so the field is not purely dates" },
          { id: "c", text: "The dataset is too small" },
          { id: "d", text: "You need to sort the dates first" },
        ],
        correct: "b",
        explanation:
          "Grouping needs a clean field. One 'N/A', one blank, or one date typed as text is enough to block it. The message names the symptom rather than the cause, which is why people assume the feature is broken.",
        whyWrong: {
          a: "Date grouping is one of the most-used pivot features there is.",
          c: "Size is irrelevant; two clean dates group perfectly well.",
          d: "Grouping does not require sorted input and sorting will not clear the error.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "l30-calculated-fields-and-charts": {
    lessonId: "l30-calculated-fields-and-charts",
    passMark: 70,
    questions: [
      {
        id: "q30-1",
        type: "mcq",
        difficulty: 3,
        atomId: "a-calculated-field",
        prompt:
          "You add a calculated field = Amount / Units. For Lagos it shows 6,133. How did Excel arrive at that?",
        options: [
          { id: "a", text: "It averaged the Amount ÷ Units ratio of each Lagos order" },
          { id: "b", text: "It divided Lagos's total Amount (276,000) by Lagos's total Units (45)" },
          { id: "c", text: "It used the first Lagos order only" },
          { id: "d", text: "It divided the Grand Totals" },
        ],
        correct: "b",
        explanation:
          "276,000 ÷ 45 = 6,133. A calculated field operates on the aggregated totals of each group, not row by row. That makes it a weighted average, which is usually what you want — but only if you know that is what happened.",
        whyWrong: {
          a: "That would be the mean of the per-row ratios, a different figure. Calculated fields divide the sums.",
          c: "It uses every Lagos row, combined into totals first.",
          d: "The Grand Total ratio is 7,446. Each row uses its own group's totals.",
        },
      },
      {
        id: "q30-2",
        type: "mcq",
        difficulty: 2,
        atomId: "a-refresh",
        prompt:
          "You paste 200 new rows under your source data and hit Refresh, but the pivot totals do not change. Why?",
        options: [
          { id: "a", text: "Refresh is broken" },
          { id: "b", text: "The pivot's source range still ends where it did, so the new rows are outside it" },
          { id: "c", text: "You need to close and reopen the file" },
          { id: "d", text: "Pivots cap out at a fixed number of rows" },
        ],
        correct: "b",
        explanation:
          "Refresh re-reads the defined range; it does not widen it. Use Change Data Source, or better, format the source as a Table (Ctrl+T) before building the pivot so it grows on its own and this whole class of problem disappears.",
        whyWrong: {
          a: "Refresh did exactly its job: it re-read the range it was given, which has not changed.",
          c: "Reopening re-reads the same stored range and gives the same totals.",
          d: "Pivots handle hundreds of thousands of rows. The range definition is the limit here, not the tool.",
        },
      },
      {
        id: "q30-3",
        type: "mcq",
        difficulty: 3,
        atomId: "a-getpivotdata",
        prompt:
          "Why is =GETPIVOTDATA(\"Amount\",$A$3,\"State\",\"Lagos\") more robust than =B5 pointing at the same cell?",
        options: [
          { id: "a", text: "It calculates faster" },
          { id: "b", text: "It asks for the value by name, so it still finds Lagos after the pivot changes shape" },
          { id: "c", text: "It cannot return an error" },
          { id: "d", text: "It refreshes the pivot automatically" },
        ],
        correct: "b",
        explanation:
          "B5 is a position. Add a state above Lagos and B5 is now a different state, silently. GETPIVOTDATA asks for the Lagos figure by name and keeps finding it wherever the row moves to.",
        whyWrong: {
          a: "Speed is not the difference, and GETPIVOTDATA is if anything the heavier of the two.",
          c: "It returns #REF! when the slice is not visible — which is correct behaviour, and far better than silently returning the wrong state.",
          d: "It reads the pivot; it does not refresh it. You still have to do that yourself.",
        },
      },
      {
        id: "q30-4",
        type: "mcq",
        difficulty: 2,
        atomId: "a-pivot-checklist",
        prompt:
          "Which single check is most likely to catch a broken pivot?",
        options: [
          { id: "a", text: "Counting the rows" },
          { id: "b", text: "Comparing the Grand Total against a figure you already trust from another method" },
          { id: "c", text: "Checking the fonts are consistent" },
          { id: "d", text: "Making sure it has a chart" },
        ],
        correct: "b",
        explanation:
          "A Grand Total that matches a figure you trust rules out an active filter, a stale cache and a source range that misses rows, all at once. It is thirty seconds that validates the whole table.",
        whyWrong: {
          a: "Useful occasionally, but it would not catch a wrong aggregation or a stale cache.",
          c: "Formatting has no bearing on whether the numbers are right.",
          d: "A chart of wrong numbers is still wrong, and drawing it does not check anything.",
        },
      },
    ],
  },
};
