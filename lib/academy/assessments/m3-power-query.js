/**
 * ASSESSMENTS · POWER QUERY & DATA PREPARATION (m3-power-query)
 *
 * SERVER ONLY. See m1-data-foundations.js for the contract and writing style.
 *
 * Power Query questions are easy to write as menu trivia — "which ribbon holds
 * Trim?" — which tests nothing. Every question here describes a query that has
 * gone wrong in a way that produces NO error, because silent wrongness is what
 * this tool is actually dangerous for.
 *
 * Figures come from the raw export in the lesson file, computed by
 * lib/academy/powerquery.js:  10 rows × 5 cols  →  8 rows × 4 cols
 */

export const ASSESSMENTS = {
  /* ═══════════════════════════════════════════════════════════════════ */
  "l43-query-editor": {
    lessonId: "l43-query-editor",
    passMark: 70,
    questions: [
      {
        id: "q43-1",
        type: "mcq",
        difficulty: 2,
        atomId: "a-pq-what-it-is",
        prompt:
          "You clean an export in Power Query. Next month a new export arrives with the same problems. What do you do?",
        options: [
          { id: "a", text: "Repeat the cleaning by hand" },
          { id: "b", text: "Click Refresh — every recorded step replays against the new data" },
          { id: "c", text: "Rebuild the query from scratch" },
          { id: "d", text: "Copy last month's cleaned data across" },
        ],
        correct: "b",
        explanation:
          "The steps are a recipe, not an edit. Refresh re-reads the source and replays every step in order, so the same problems are fixed again without you opening the file. That is the entire argument for learning Power Query.",
        whyWrong: {
          a: "This is exactly what Power Query exists to stop. Cleaning by hand is what you did in Excel.",
          c: "Rebuilding discards the work. The query was designed to be re-run.",
          d: "Copying last month's data gives you last month's numbers.",
        },
      },
      {
        id: "q43-2",
        type: "mcq",
        difficulty: 3,
        atomId: "a-pq-getting-there",
        prompt:
          "You loaded data and then noticed a column of numbers is stored as text. Where should you fix it?",
        options: [
          { id: "a", text: "In DAX, with a calculated column" },
          { id: "b", text: "In Power Query — Home → Transform data — before it reaches the model" },
          { id: "c", text: "In the source Excel file, then reload" },
          { id: "d", text: "In the visual's formatting options" },
        ],
        correct: "b",
        explanation:
          "Anything about SHAPE — columns, rows, types, blanks, duplicates — belongs in Power Query. It is faster, it is recorded as a step, it repeats on refresh, and it keeps the model simple.",
        whyWrong: {
          a: "A calculated column fixing a problem that should never have entered the model makes the file slower and harder for anyone else to follow.",
          c: "Editing the source works once and is not repeatable, and you often do not own the source file.",
          d: "Formatting changes how a value displays, never what type it is.",
        },
      },
      {
        id: "q43-3",
        type: "mcq",
        difficulty: 3,
        atomId: "a-pq-applied-steps",
        prompt:
          "In the Applied Steps list, one step reads '10 → 9 rows'. What should you do?",
        options: [
          { id: "a", text: "Nothing — row counts change all the time" },
          { id: "b", text: "Check that the row it removed was one you meant to remove" },
          { id: "c", text: "Delete the step" },
          { id: "d", text: "Move the step to the end" },
        ],
        correct: "b",
        explanation:
          "A step that changes the row count has deleted data. That is often exactly right — a duplicate, a blank — but it is always worth confirming, because a filter that removes one row too many produces no error at all.",
        whyWrong: {
          a: "A silent row loss is the most common way a Power Query recipe goes quietly wrong.",
          c: "The step may be doing precisely what you asked. Check before removing.",
          d: "Moving it changes what it acts on and could make things worse.",
        },
      },
      {
        id: "q43-4",
        type: "mcq",
        difficulty: 3,
        atomId: "a-pq-m-language",
        prompt:
          "In the M line Table.RemoveColumns(Source, {\"RowId\"}), what is Source?",
        options: [
          { id: "a", text: "The original data file" },
          { id: "b", text: "The table produced by the previous step" },
          { id: "c", text: "A reserved word meaning the whole model" },
          { id: "d", text: "The name of the query" },
        ],
        correct: "b",
        explanation:
          "Each step consumes the table the step above it produced. That single fact explains why order matters, why deleting a middle step can break the ones below, and why errors name a step rather than a cell.",
        whyWrong: {
          a: "Only the very first step reads the file. Every later step reads the previous step's output.",
          c: "There is no such reserved word; it is just the name of the incoming table.",
          d: "The query has its own name. Source refers to the table flowing in.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "l44-types-and-columns": {
    lessonId: "l44-types-and-columns",
    passMark: 70,
    questions: [
      {
        id: "q44-1",
        type: "mcq",
        difficulty: 2,
        atomId: "a-pq-types",
        prompt:
          "Which of these should be stored as TEXT rather than a whole number?",
        options: [
          { id: "a", text: "Order quantity" },
          { id: "b", text: "A phone number" },
          { id: "c", text: "Revenue" },
          { id: "d", text: "Days to deliver" },
        ],
        correct: "b",
        explanation:
          "You never add two phone numbers, and storing one as a number destroys any leading zero — 08031234567 becomes 8031234567. The test is whether arithmetic on the value would ever mean anything.",
        whyWrong: {
          a: "Quantities are added and averaged constantly.",
          c: "Revenue is the clearest possible case for a numeric type.",
          d: "Delivery days get averaged and compared, so they are numeric.",
        },
      },
      {
        id: "q44-2",
        type: "mcq",
        difficulty: 3,
        atomId: "a-pq-types",
        prompt:
          "Power Query's automatic type detection set Amount to Whole Number on import, but a text value at row 4,000 breaks the refresh later. Why did detection miss it?",
        options: [
          { id: "a", text: "Detection is random" },
          { id: "b", text: "It samples only the first rows, so a bad value further down is not seen" },
          { id: "c", text: "Whole Number cannot hold large values" },
          { id: "d", text: "The column was hidden" },
        ],
        correct: "b",
        explanation:
          "Automatic detection reads the leading rows and guesses. A text value at row 4,000 is discovered only when the conversion step reaches it — usually on a later refresh, which is why the failure appears long after the query was written.",
        whyWrong: {
          a: "It is deterministic: it reads a sample and infers from it.",
          c: "The type holds very large integers; the problem is a non-numeric value.",
          d: "Hidden columns are still read and typed.",
        },
      },
      {
        id: "q44-3",
        type: "mcq",
        difficulty: 3,
        atomId: "a-pq-remove-columns",
        prompt:
          "Your source adds a new column next month. Which step keeps it OUT of your model automatically?",
        options: [
          { id: "a", text: "Remove Columns" },
          { id: "b", text: "Remove Other Columns" },
          { id: "c", text: "Either — they behave the same" },
          { id: "d", text: "Neither; new columns always come through" },
        ],
        correct: "b",
        explanation:
          "Remove Other Columns records the columns you KEPT, so anything new is excluded by definition. Remove Columns records the ones you removed, so a column that did not exist when you built the query joins your model unnoticed.",
        whyWrong: {
          a: "It names the removed columns, so an unknown new one is not on that list and survives.",
          c: "They record opposite things, which is exactly why one is safer on a refresh schedule.",
          d: "Remove Other Columns prevents precisely this.",
        },
      },
      {
        id: "q44-4",
        type: "mcq",
        difficulty: 2,
        atomId: "a-pq-fix-type",
        prompt:
          "After changing a column's type to a number, how can you confirm it worked without running a calculation?",
        options: [
          { id: "a", text: "The column turns green" },
          { id: "b", text: "The values move to the right of their cells" },
          { id: "c", text: "The column is renamed" },
          { id: "d", text: "You cannot confirm it visually" },
        ],
        correct: "b",
        explanation:
          "Numbers align right and text aligns left, the same tell you used in Excel. It is instant confirmation the conversion took, and it is how you spot the one stubborn value that did not convert.",
        whyWrong: {
          a: "Nothing changes colour. The type icon in the header changes, but alignment is the faster check.",
          c: "Changing a type never renames anything.",
          d: "Alignment makes it visible at a glance, which is the point of the convention.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "l45-rows-duplicates-blanks": {
    lessonId: "l45-rows-duplicates-blanks",
    passMark: 70,
    questions: [
      {
        id: "q45-1",
        type: "mcq",
        difficulty: 3,
        atomId: "a-pq-step-order",
        prompt:
          "You remove duplicates on State and get four distinct values: Lagos, \" Abuja\", Kano and Abuja. What went wrong?",
        options: [
          { id: "a", text: "There genuinely are four states" },
          { id: "b", text: "You did not trim before deduplicating, so \" Abuja\" and \"Abuja\" are different strings" },
          { id: "c", text: "Remove Duplicates is unreliable" },
          { id: "d", text: "The column type is wrong" },
        ],
        correct: "b",
        explanation:
          "Until the spaces are gone the two values are not equal, so both survive. Move the Trim step ABOVE the deduplicate and you get three. The recipe ran without error either way, which is what makes this the commonest Power Query bug.",
        whyWrong: {
          a: "Two of the four are the same state with different whitespace.",
          c: "It removed every genuine duplicate it was given. The inputs were not equal.",
          d: "Both values are text. The type is right; the content is not yet clean.",
        },
      },
      {
        id: "q45-2",
        type: "mcq",
        difficulty: 3,
        atomId: "a-pq-duplicates",
        prompt:
          "Which column should you deduplicate an orders table on?",
        options: [
          { id: "a", text: "State" },
          { id: "b", text: "The order ID" },
          { id: "c", text: "Amount" },
          { id: "d", text: "All columns at once" },
        ],
        correct: "b",
        explanation:
          "Deduplicate on the column that should be unique. Choosing State would leave three orders in total; choosing Amount would delete two genuinely different orders that happened to cost the same.",
        whyWrong: {
          a: "State repeats legitimately. You would delete almost the entire table.",
          c: "Two separate orders can have identical amounts. Those are real rows.",
          d: "Safer than the wrong column, but it misses a duplicate that differs by one typo — which is the usual kind.",
        },
      },
      {
        id: "q45-3",
        type: "mcq",
        difficulty: 3,
        atomId: "a-pq-blanks",
        prompt:
          "A row has ₦55,000 in Amount but no order number. What is the right action?",
        options: [
          { id: "a", text: "Delete it quietly — it has no key" },
          { id: "b", text: "Filter it out AND record in your data-quality note that ₦55,000 of real revenue was excluded" },
          { id: "c", text: "Keep it and ignore the missing key" },
          { id: "d", text: "Invent an order number for it" },
        ],
        correct: "b",
        explanation:
          "It is real money that cannot be attributed to an order. Excluding it is defensible; excluding it silently is not, because your total will not match the finance system's and nobody will know why.",
        whyWrong: {
          a: "An undocumented exclusion is indistinguishable from a mistake when someone reconciles the totals.",
          c: "A row with no key cannot be joined or attributed, so it will distort any breakdown it lands in.",
          d: "Inventing a key is fabrication, and it creates an order that does not exist.",
        },
      },
      {
        id: "q45-4",
        type: "mcq",
        difficulty: 2,
        atomId: "a-pq-clean-it",
        prompt:
          "Your recipe took the export from 10 rows to 8. What must you be able to say about the two missing rows?",
        options: [
          { id: "a", text: "Nothing — cleaning removes rows" },
          { id: "b", text: "Exactly which two they were and why each was removed" },
          { id: "c", text: "Only the total number removed" },
          { id: "d", text: "That Power Query decided they were invalid" },
        ],
        correct: "b",
        explanation:
          "One was a duplicate of ORD-1003 and one had no order number. Both carried real-looking amounts, and the first person to reconcile your total against the source will ask about exactly those two rows.",
        whyWrong: {
          a: "Cleaning removes rows you chose to remove, for reasons you can state.",
          c: "A count without reasons does not answer the question anyone will actually ask.",
          d: "Power Query decides nothing. Every removal was a step you added.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "l46-split-merge-transform": {
    lessonId: "l46-split-merge-transform",
    passMark: 70,
    questions: [
      {
        id: "q46-1",
        type: "mcq",
        difficulty: 2,
        atomId: "a-pq-append-merge",
        prompt:
          "You have twelve monthly files with identical columns and want one year of data. Append or Merge?",
        options: [
          { id: "a", text: "Merge — it combines tables" },
          { id: "b", text: "Append — it stacks tables, adding rows" },
          { id: "c", text: "Either works" },
          { id: "d", text: "Neither; load them separately" },
        ],
        correct: "b",
        explanation:
          "Append adds ROWS: twelve files become one taller table. Merge adds COLUMNS by matching a key, which is what VLOOKUP did. Same columns, more rows means Append.",
        whyWrong: {
          a: "Merge would try to join them side by side on a key, producing a wider table rather than a year of data.",
          c: "They do opposite things. One is right here.",
          d: "Twelve separate tables cannot be charted as one year without combining them.",
        },
      },
      {
        id: "q46-2",
        type: "mcq",
        difficulty: 3,
        atomId: "a-pq-unpivot",
        prompt:
          "A finance report arrives with one column per month: State | Jan | Feb | Mar. You need a date slicer. What do you do first?",
        options: [
          { id: "a", text: "Add a date column manually" },
          { id: "b", text: "Unpivot the month columns so Month becomes data rather than headings" },
          { id: "c", text: "Create a relationship to a calendar table" },
          { id: "d", text: "Build three separate visuals" },
        ],
        correct: "b",
        explanation:
          "The months are column HEADINGS, so there is nothing to slice. Unpivoting turns three columns into two — Month and Amount — and three rows into nine, at which point a slicer, a chart and a relationship all become possible.",
        whyWrong: {
          a: "There is no single date for a row that spans three months.",
          c: "You cannot relate to a calendar on a column that does not exist yet.",
          d: "Three visuals is the workaround people build instead of fixing the shape, and it breaks when a fourth month arrives.",
        },
      },
      {
        id: "q46-3",
        type: "mcq",
        difficulty: 3,
        atomId: "a-pq-unpivot",
        prompt:
          "When unpivoting, why choose 'Unpivot Other Columns' rather than selecting the month columns directly?",
        options: [
          { id: "a", text: "It is faster to click" },
          { id: "b", text: "It records the columns to KEEP, so next month's new column is unpivoted automatically" },
          { id: "c", text: "It produces fewer rows" },
          { id: "d", text: "There is no difference" },
        ],
        correct: "b",
        explanation:
          "Naming the columns to unpivot bakes in today's list, so an April column arrives next month and is left behind as a stray column. Naming the ones to keep means anything new is unpivoted by default.",
        whyWrong: {
          a: "Click count is not the reason, though it often is fewer clicks.",
          c: "Both produce the same rows from the same input. The difference appears when the input changes.",
          d: "The difference is precisely what happens on the next refresh.",
        },
      },
      {
        id: "q46-4",
        type: "mcq",
        difficulty: 3,
        atomId: "a-pq-append-merge",
        prompt:
          "You merged two queries and the new column just shows the word 'Table' on every row. What is missing?",
        options: [
          { id: "a", text: "The merge failed" },
          { id: "b", text: "You have not expanded the merged column and chosen which fields to bring through" },
          { id: "c", text: "The key columns do not match" },
          { id: "d", text: "You need to refresh" },
        ],
        correct: "b",
        explanation:
          "A merge brings the matching rows through as nested tables. Click the expand arrow in that column's header and pick the fields you want. Forgetting this is why people say the merge 'did nothing'.",
        whyWrong: {
          a: "It succeeded — the nested tables are the result.",
          c: "Mismatched keys would give you nulls rather than tables.",
          d: "Refresh re-runs the same steps and produces the same unexpanded column.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "l47-refresh-and-folding": {
    lessonId: "l47-refresh-and-folding",
    passMark: 70,
    questions: [
      {
        id: "q47-1",
        type: "mcq",
        difficulty: 2,
        atomId: "a-pq-refresh",
        prompt:
          "Your refresh fails with 'the column Amount of the table was not found'. What most likely happened?",
        options: [
          { id: "a", text: "Power BI is corrupted" },
          { id: "b", text: "The source renamed or dropped that column, and your step still asks for the old name" },
          { id: "c", text: "You need to reinstall" },
          { id: "d", text: "The file is too large" },
        ],
        correct: "b",
        explanation:
          "Refresh replays every step against the current source. If a step names a column the source no longer has, that step fails — and the message names the step, so clicking it in Applied Steps takes you straight to the problem.",
        whyWrong: {
          a: "The error is specific and descriptive. It is reporting a real mismatch.",
          c: "Reinstalling cannot make a missing column reappear.",
          d: "Size produces slowness or timeouts, not a missing-column error.",
        },
      },
      {
        id: "q47-2",
        type: "mcq",
        difficulty: 3,
        atomId: "a-pq-folding",
        prompt:
          "You add a custom column at step two and filter to 5,000 rows at step ten. Against a 5-million-row database, what happens?",
        options: [
          { id: "a", text: "The server filters first, so it is fast" },
          { id: "b", text: "Folding stops at step two, so all 5 million rows come to your machine before the filter runs" },
          { id: "c", text: "Power Query reorders the steps automatically" },
          { id: "d", text: "Nothing — step order does not affect speed" },
        ],
        correct: "b",
        explanation:
          "The first step that cannot fold stops folding for everything after it. A custom column with M logic usually breaks folding, so the filter is no longer translated into the server's query and runs locally on all 5 million rows.",
        whyWrong: {
          a: "The server only filters if the filter folds, and folding already stopped.",
          c: "It never reorders your steps. The order you built is the order that runs.",
          d: "On a large source this is the difference between seconds and an abandoned refresh.",
        },
      },
      {
        id: "q47-3",
        type: "mcq",
        difficulty: 3,
        atomId: "a-pq-folding",
        prompt:
          "How do you tell whether folding is still working at a given step?",
        options: [
          { id: "a", text: "Time the refresh" },
          { id: "b", text: "Right-click the step and check whether 'View Native Query' is available" },
          { id: "c", text: "Count the rows" },
          { id: "d", text: "There is no way to tell" },
        ],
        correct: "b",
        explanation:
          "If View Native Query is available, everything up to that step folded into a query the server can run. Greyed out means folding has already stopped somewhere at or before that step.",
        whyWrong: {
          a: "Timing tells you something is slow, not which step broke folding.",
          c: "The row count is the same either way; only where the filtering happened differs.",
          d: "View Native Query exists specifically to answer this.",
        },
      },
      {
        id: "q47-4",
        type: "mcq",
        difficulty: 2,
        atomId: "a-pq-parameters",
        prompt:
          "Your query works on your laptop and fails on a colleague's. What is the most likely cause?",
        options: [
          { id: "a", text: "They have a different Power BI version" },
          { id: "b", text: "The source file path is hard-coded into the query and does not exist on their machine" },
          { id: "c", text: "Their Excel is not installed" },
          { id: "d", text: "The query is too complex" },
        ],
        correct: "b",
        explanation:
          "The path is recorded in the source step. A path into your Downloads folder exists only for you. A parameter for the folder — changed once in a dialog — is what makes the query portable.",
        whyWrong: {
          a: "Possible, but a version mismatch usually gives a version-specific message rather than a source failure.",
          c: "Power Query reads Excel files without Excel being installed.",
          d: "Complexity slows a query; it does not make it machine-specific.",
        },
      },
    ],
  },
};
