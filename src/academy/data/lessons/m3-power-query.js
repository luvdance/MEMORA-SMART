/**
 * MODULE · POWER QUERY & DATA PREPARATION (m3-power-query)
 * Month 3 — Power BI
 *
 * The module that pays for the whole course. In Excel the learner cleaned data
 * by hand and had to do it again next month. Power Query records the cleaning
 * as a recipe and replays it on Refresh, which turns a recurring afternoon into
 * a button.
 *
 * TEACHING APPROACH
 * "Applied steps as a recipe" is the module's own stated core topic, and it is
 * the one thing a before-and-after table cannot show. So most atoms carry a
 * live query editor: the learner adds steps, watches the Applied Steps list
 * grow with each step's effect on the row count, deletes one from the middle
 * and sees everything after it re-run. The M each step generates is shown
 * beside it, so the Advanced Editor is not a cliff in a later module.
 *
 * The exercise checks the RESULTING TABLE, never the sequence. Two learners who
 * reach a clean table by different routes have both understood it; grading the
 * recipe would be marking memorisation.
 *
 * VERIFIED: every row count and column list quoted below was computed by
 * lib/academy/powerquery.js and is re-checked by the content validator.
 *   RAW 10 rows × 5 cols → cleaned 8 rows × 4 cols
 *   The duplicate ORD-1003 and the blank-key row are what the 2 lost rows are.
 *
 * CLIENT-SAFE. Knowledge-check answers live in lib/academy/assessments/.
 */

export const SECTION_ID = "s10-power-query";

/**
 * A raw export with five planted problems — one for each step the module
 * teaches. Do not tidy this constant; the mess is the teaching material.
 *   RowId      an internal column nobody outside the source system needs
 *   " Abuja"   a leading space that will break every match
 *   "43000"    an amount stored as text
 *   ORD-1003   appears twice
 *   row 9      has no Order id at all
 */
const RAW = {
  headers: ["RowId", "Order", "State", "Amount", "Rating"],
  rows: [
    [1, "ORD-1001", "Lagos", 45000, 4],
    [2, "ORD-1002", " Abuja", 62000, 5],
    [3, "ORD-1003", "Lagos", 38000, 4],
    [4, "ORD-1004", "Kano", 51000, 3],
    [5, "ORD-1005", "Lagos", 47000, ""],
    [6, "ORD-1006", "Abuja", 980000, 5],
    [7, "ORD-1007", "Kano", "43000", 4],
    [8, "ORD-1003", "Lagos", 38000, 4],
    [9, "", "Abuja", 55000, 1],
    [10, "ORD-1010", "Lagos", 49000, 4],
  ],
};

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════ */
  {
    id: "l43-query-editor",
    moduleId: "m3-power-query",
    sectionId: SECTION_ID,
    order: 1,
    title: "The Query Editor",
    subtitle: "Where cleaning stops being something you redo",
    estimatedMinutes: 16,
    intro:
      "Every hour you spent cleaning an export in Month 2 was an hour you would have spent again next month. Power Query is the answer to that, and the idea behind it is smaller than it looks.",

    atoms: [
      {
        id: "a-pq-what-it-is",
        title: "Cleaning as a recipe, not an edit",
        explain:
          "In Excel you change the data. In Power Query you record a step that describes the change. The source file is never touched, and on Refresh every step runs again, in order, against whatever the new data is.",
        why: "This is the difference between cleaning that lasts one month and cleaning that lasts forever. Write the recipe once and next quarter's export — with different rows and the same problems — comes out clean without you opening it.",
        analogy:
          "It is the difference between washing the plates and writing the dishwasher programme. The first solves tonight; the second solves every night.",
        table: {
          caption: "The same cleaning job, two ways.",
          headers: ["", "Excel, by hand", "Power Query"],
          rows: [
            ["First time", "20 minutes", "20 minutes"],
            ["Next month", "20 minutes again", "Click Refresh"],
            ["Someone checks your work", "No record of what you did", "The steps are the record"],
            ["You made a mistake in step 2", "Start again", "Edit step 2, everything re-runs"],
            ["Source file", "Edited, and now different", "Untouched"],
          ],
          note: "The fourth row is the one that surprises people. Steps are editable and removable after the fact, so a mistake costs you one step rather than the whole job.",
        },
      },
      {
        id: "a-pq-getting-there",
        title: "Getting into the editor",
        explain:
          "Home → Transform data opens the Power Query editor in its own window. From the Get data dialog, choose Transform Data instead of Load. Close & Apply sends the cleaned result back to your model.",
        why: "The most common mistake in Power BI is clicking Load, discovering the data is dirty, and then trying to fix it with DAX. Cleaning belongs in Power Query, before the data ever reaches the model — it is faster, it is recorded, and it keeps the model simple.",
        example:
          "Get data  →  choose your file  →  Transform Data\n                                    (not Load)\n\nAlready loaded?\n  Home  →  Transform data\n\nWhen finished:\n  Home  →  Close & Apply\n\nRule of thumb: if it is about SHAPE — columns, rows, types,\nblanks, duplicates — do it in Power Query. If it is about\nCALCULATION across the model, do it in DAX.",
        mistake:
          "Cleaning with DAX because Power Query felt unfamiliar. You end up with calculated columns fixing problems that should never have entered the model, and a file that is slower and harder for anyone else to follow.",
      },
      {
        id: "a-pq-applied-steps",
        title: "The Applied Steps list",
        explain:
          "Every transformation appears as a step on the right. They run top to bottom. Click any step to see the table as it was at that moment, delete one to remove it, and drag to reorder.",
        why: "Applied Steps is the audit trail. When a colleague asks what you did to the data, you do not have to remember — the list is the answer, and it is precise in a way a written note never is.",
        query: {
          source: RAW,
          steps: [
            { type: "removeColumn", column: "RowId" },
            { type: "trim", column: "State" },
          ],
          showM: true,
        },
        table: {
          caption: "Reading the Applied Steps list.",
          headers: ["What you see", "What it means"],
          rows: [
            ["Source", "The data exactly as it arrived"],
            ["Removed column \"RowId\"", "A step, with the column it acted on"],
            ["10 → 9 rows", "That step dropped a row — always worth noticing"],
            ["The M underneath", "The code the step generated for you"],
          ],
          note: "Two steps are already applied above. Add more, then delete one from the middle and watch everything below it re-run.",
        },
      },
      {
        id: "a-pq-m-language",
        title: "M — the code you did not have to write",
        explain:
          "Every step generates a line of M, Power Query's language. You will rarely write it by hand, but you must be able to read it, because the error messages quote it and the Advanced Editor shows nothing else.",
        syntax: {
          pattern:
            'Table.SelectRows(Source, each [Amount] > 50000)\nTable.RemoveColumns(Source, {"RowId"})\nTable.TransformColumns(Source, {{"State", Text.Trim}})',
          args: [
            ["Source", "The table coming in from the previous step. Each step consumes the one above it."],
            ["each [Column]", "M's way of saying 'for every row, look at this column'."],
            ["{ }", "A list. Braces hold column names or transformation pairs."],
            ["[ ]", "A field reference — [Amount] means the Amount column of the current row.", "optional"],
          ],
          returns: "A table, which becomes the Source of the next step.",
          note: "M is case-sensitive, unlike Excel formulas. Text.Trim works; TEXT.TRIM does not, and the error will not say so clearly.",
        },
        why: "Knowing that each step consumes the previous one explains everything about the Applied Steps list — why order matters, why deleting a middle step can break the ones below, and why the error usually names a step rather than a cell.",
        mistake:
          "Being frightened of the Advanced Editor. It is the same steps you clicked, written down. Open it once on a query you built yourself and it stops being mysterious.",
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  {
    id: "l44-types-and-columns",
    moduleId: "m3-power-query",
    sectionId: SECTION_ID,
    order: 2,
    title: "Data Types and Columns",
    subtitle: "The step that decides whether anything else works",
    estimatedMinutes: 16,
    intro:
      "Power BI is far stricter about types than Excel is. A column is text or it is a number, and almost every confusing error later in a model traces back to a type that was wrong here.",

    atoms: [
      {
        id: "a-pq-types",
        title: "Set the type, every time",
        explain:
          "Every column carries a declared type — text, whole number, decimal, date, true/false. Power Query guesses on import from the first rows, and the guess is wrong often enough that you must check.",
        why: "This is the root cause of 'Count of Amount' from the last module. A single text value anywhere in a numeric column makes the whole column text, and Power BI then refuses to sum it. Fixing the type here fixes it everywhere downstream at once.",
        table: {
          caption: "The types you will actually use.",
          headers: ["Type", "Use for", "Watch out for"],
          rows: [
            ["Whole number", "Counts, quantities, IDs", "IDs with leading zeros lose them — keep as text"],
            ["Decimal number", "Money, rates, averages", "Fine for most business figures"],
            ["Text", "Names, states, categories", "Numbers stored here will not aggregate"],
            ["Date", "Anything you will group by month", "A date stored as text cannot be grouped"],
            ["True/False", "Flags", "\"Yes\"/\"No\" is text, not a boolean"],
          ],
          note: "Phone numbers and account numbers are TEXT, not numbers. You never add two phone numbers, and treating them as numeric destroys any leading zero.",
        },
        mistake:
          "Relying on the automatic type detection Power Query applies on import. It reads the first rows only, so a text value at row 4,000 is discovered much later — usually by a total that will not calculate.",
      },
      {
        id: "a-pq-fix-type",
        title: "Fix the type, and watch the column change side",
        explain:
          "Change the Amount column to a number and the values snap to the right of their cells. That alignment is the same tell you used in Excel, and it is instant confirmation the step worked.",
        why: "One value in this export — ORD-1007's 43,000 — arrived as text. Until it is converted, Power BI will offer Count of Amount instead of Sum, and any total you build is short by that order.",
        queryExercise: {
          source: RAW,
          task:
            "One Amount is stored as text — find it in the preview by which side of the cell it sits on. Add a step that changes the Amount column to a number.",
          expect: { numericColumn: "Amount" },
          successMessage:
            "Every Amount now sits right, which means Power BI will offer Sum rather than Count. One step, and the problem is fixed for every future refresh as well.",
        },
      },
      {
        id: "a-pq-remove-columns",
        title: "Remove what you do not need",
        explain:
          "Delete columns you will never use. Choose Remove Other Columns rather than Remove Columns where you can — it keeps only what you named, so a new column appearing in next month's export does not silently join your model.",
        why: "Every column costs memory and refresh time, and a model with forty unused columns is one nobody else can read. The RowId column in this export is an internal key from the source system that means nothing outside it.",
        table: {
          caption: "Two ways to drop columns, and why one is safer.",
          headers: ["Command", "Records", "Next month a new column appears…"],
          rows: [
            ["Remove Columns", "The ones you removed", "…and it joins your model unnoticed"],
            ["Remove Other Columns", "The ones you KEPT", "…and it is excluded automatically"],
          ],
          note: "Remove Other Columns is the more defensive choice for anything on a refresh schedule.",
        },
      },
      {
        id: "a-pq-rename",
        title: "Rename for the reader, not the source system",
        explain:
          "Rename columns to what a business reader would call them. 'CUST_NM_1' becomes 'Customer'. Do it in Power Query, once, and every visual and every measure picks the new name up.",
        why: "Field names appear on your charts as axis titles and legend labels. Renaming in Power Query means you never have to retype a title on a visual again — and if you rename later, the visuals follow.",
        mistake:
          "Renaming a column AFTER building visuals on it. Power Query records renames as steps, so the model follows — but any DAX measure that referred to the old name by text will break, and it breaks at the measure rather than at the rename.",
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  {
    id: "l45-rows-duplicates-blanks",
    moduleId: "m3-power-query",
    sectionId: SECTION_ID,
    order: 3,
    title: "Rows, Duplicates and Blanks",
    subtitle: "Removing what should not be there — and only that",
    estimatedMinutes: 17,
    intro:
      "Two rows in this export should not survive to the model: one is a duplicate and one has no key at all. Both are invisible in a total, and both change every figure built on top of them.",

    atoms: [
      {
        id: "a-pq-duplicates",
        title: "Duplicates double-count silently",
        explain:
          "Remove Duplicates keeps the first occurrence and drops the rest. Select the column that should be unique — usually an ID — and remove duplicates on THAT, not on the whole row.",
        why: "A duplicated order adds its amount to every total, every average and every state breakdown. Nothing errors. ORD-1003 appears twice in this export and contributes ₦38,000 twice to Lagos.",
        table: {
          caption: "Which column to deduplicate on.",
          headers: ["Selection", "Removes", "Risk"],
          rows: [
            ["The ID column only", "Rows repeating that ID", "Correct in almost every case"],
            ["All columns", "Only rows identical in every field", "Misses a duplicate with one typo"],
            ["A non-unique column", "Legitimate rows", "Silently deletes real data"],
          ],
          note: "The third row is the dangerous one. Deduplicating on State would leave you with three orders.",
        },
        mistake:
          "Deduplicating before you have trimmed and fixed types. \" ORD-1003\" and \"ORD-1003\" are different strings, so the duplicate survives — which is the step-order problem in the next atom.",
      },
      {
        id: "a-pq-blanks",
        title: "Blank rows and rows with no key",
        explain:
          "Remove Blank Rows drops rows that are empty across the board. A row with a missing KEY is different: it may be full of data but cannot be attributed to anything, so it is filtered on that column specifically.",
        why: "Row 9 of this export has an amount of ₦55,000 and no order number. It is real money that cannot be traced to an order — so it must be either investigated or excluded and documented, exactly as Month 2 taught.",
        table: {
          caption: "Blank is not one problem.",
          headers: ["Situation", "Action", "Note in your data-quality log"],
          rows: [
            ["Entire row empty", "Remove Blank Rows", "Usually a formatting artefact"],
            ["Missing key, real data", "Filter out, and say so", "You have excluded real revenue"],
            ["Missing optional field", "Keep the row", "Only the average of that field is affected"],
            ["Missing in a pattern", "Stop and investigate", "This is a finding, not a gap"],
          ],
          note: "Never remove a row with real data in it without recording that you did. That ₦55,000 has to appear in your note even though it is not in your total.",
        },
      },
      {
        id: "a-pq-step-order",
        title: "Step order changes the answer",
        explain:
          "Steps run top to bottom, each consuming the one above. Trimming before deduplicating finds duplicates that trimming after would miss, because until the spaces are gone the two values are not equal.",
        why: "This is the single most common Power Query bug, and it produces no error. Your recipe runs, your table looks clean, and two rows that should have merged did not.",
        table: {
          caption: "The same two steps, two orders, two answers.",
          headers: ["Recipe", "Distinct States found", "Correct?"],
          rows: [
            ["Remove duplicates on State", "4 — Lagos, \" Abuja\", Kano, Abuja", "No — Abuja counted twice"],
            ["Trim State, then remove duplicates", "3 — Lagos, Abuja, Kano", "Yes"],
          ],
          note: "Both recipes run without an error. Only one is right, and nothing on screen tells you which.",
        },
        mistake:
          "Fixing a wrong result by adding another step at the bottom. Usually the fix is to move an existing step UP — trim before you match, set types before you filter on numbers.",
      },
      {
        id: "a-pq-clean-it",
        title: "Clean the whole export",
        explain:
          "You have met every step this export needs. Build the full recipe: drop the internal column, trim the state names, fix the amount type, remove the duplicate order and drop the row with no key.",
        queryExercise: {
          source: RAW,
          task:
            "Produce a clean table with exactly four columns — Order, State, Amount, Rating — and eight rows, where Amount is fully numeric and State has no stray spaces. Watch the row count in the Applied Steps list as you go.",
          expect: {
            headers: ["Order", "State", "Amount", "Rating"],
            rows: 8,
            numericColumn: "Amount",
            trimmedColumn: "State",
          },
          successMessage:
            "Eight rows, four columns, every amount numeric and every state trimmed. That recipe now runs on every future export of this report automatically — which is the entire argument for Power Query.",
        },
        why: "Ten rows became eight: the duplicate ORD-1003 and the row with no order number. Both were carrying real-looking amounts, and neither would have announced itself in a total.",
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  {
    id: "l46-split-merge-transform",
    moduleId: "m3-power-query",
    sectionId: SECTION_ID,
    order: 4,
    title: "Split, Transform and Unpivot",
    subtitle: "Reshaping data into the form analysis needs",
    estimatedMinutes: 18,
    intro:
      "Cleaning removes what is wrong. Reshaping changes the form — splitting one column into two, and turning a report laid out for humans into a table laid out for analysis.",

    atoms: [
      {
        id: "a-pq-split",
        title: "Split Column",
        explain:
          "Split Column by Delimiter turns 'Lagos, Nigeria' into two columns at the comma. Split by Number of Characters cuts at a fixed position. Both add a step, so the split repeats on every refresh.",
        why: "Data arrives joined together constantly — full names, addresses, product codes with a category prefix. Splitting in Power Query is one click and permanent, where the Excel equivalent was LEFT, RIGHT, FIND and a helper column.",
        syntax: {
          pattern: 'Table.SplitColumn(Source, "Location", Splitter.SplitTextByDelimiter(","))',
          args: [
            ["Location", "The column being split."],
            ["Splitter.SplitTextByDelimiter(\",\")", "What to cut on. Comma, space, tab, or a custom string."],
            ["Split at", "Left-most, right-most, or every occurrence — chosen in the dialog.", "optional"],
          ],
          returns: "Two or more new columns, replacing the original.",
          note: "Split at the LEFT-MOST delimiter for names like \"Okafor, Ada Grace\" — splitting at every comma would break any name containing a second one.",
        },
      },
      {
        id: "a-pq-transform-text",
        title: "Text transformations",
        explain:
          "Trim removes surrounding spaces, Clean strips non-printing characters, and the Format menu changes case. These are the Power Query versions of TRIM, CLEAN, UPPER and PROPER from Month 1.",
        why: "Non-printing characters are the invisible version of the leading-space problem. They come from PDF copies and web exports, they are impossible to see, and Clean removes them in one step.",
        table: {
          caption: "Excel function to Power Query step.",
          headers: ["In Excel", "In Power Query", "Fixes"],
          rows: [
            ["TRIM()", "Transform → Format → Trim", "Leading and trailing spaces"],
            ["CLEAN()", "Transform → Format → Clean", "Invisible control characters"],
            ["PROPER()", "Transform → Format → Capitalize Each Word", "Inconsistent casing"],
            ["SUBSTITUTE()", "Transform → Replace Values", "A known wrong value"],
            ["LEFT() / RIGHT()", "Transform → Extract", "Part of a string"],
          ],
          note: "Every one of these is now a recorded step rather than a helper column you would have to rebuild next month.",
        },
      },
      {
        id: "a-pq-unpivot",
        title: "Unpivot — the one that changes how you see data",
        explain:
          "A report with a column per month is built for a human to read. Analysis needs one row per observation. Unpivot turns twelve month columns into two columns — Month and Value — and twelve times as many rows.",
        why: "This single feature justifies learning Power Query. A cross-tab from a finance system cannot be charted, filtered by date or related to another table. Unpivoted, it can do all three. Select the columns to KEEP, right-click, and choose Unpivot Other Columns.",
        table: {
          caption: "Before and after, on a tiny example.",
          headers: ["Shape", "Looks like", "Rows", "Can you chart by month?"],
          rows: [
            ["Cross-tab (as received)", "State | Jan | Feb | Mar", "3", "No"],
            ["Unpivoted", "State | Month | Amount", "9", "Yes"],
          ],
          note: "Always choose Unpivot OTHER Columns and select the ones to keep. Unpivoting the named columns means next month's new column is left behind.",
        },
        mistake:
          "Trying to build a date slicer on a cross-tab. The months are column HEADINGS, not data, so there is nothing to slice. Unpivot first and the problem disappears.",
      },
      {
        id: "a-pq-append-merge",
        title: "Append and Merge are not the same thing",
        explain:
          "Append stacks tables on top of each other — twelve monthly files into one year. Merge joins them side by side on a matching column, which is what VLOOKUP did. Append adds rows; Merge adds columns.",
        syntax: {
          pattern:
            "Append  →  Home → Append Queries      (adds ROWS)\nMerge   →  Home → Merge Queries       (adds COLUMNS)",
          args: [
            ["Append", "Tables must have matching column names. Mismatched names create extra columns full of null."],
            ["Merge", "Pick the key column in each table and a join kind — Left Outer keeps every row of the first table."],
            ["Left Outer", "The default and the safe choice: nothing from your main table is lost.", "optional"],
          ],
          returns: "Append returns one taller table. Merge returns one wider table.",
          note: "After a Merge you get a column of [Table] values. Click the expand arrow in its header and choose which fields to bring through — forgetting this step is why the merge 'did nothing'.",
        },
        table: {
          caption: "Which one you need.",
          headers: ["You have", "You want", "Use"],
          rows: [
            ["12 monthly files, same columns", "One year of data", "Append"],
            ["Orders and a customer list", "Customer name on each order", "Merge"],
            ["Sales and targets by state", "Both on one row", "Merge"],
            ["This year and last year", "One long table", "Append"],
          ],
          note: "In Power BI you will often do neither, and create a RELATIONSHIP instead — which is the next module.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  {
    id: "l47-refresh-and-folding",
    moduleId: "m3-power-query",
    sectionId: SECTION_ID,
    order: 5,
    title: "Refresh, Parameters and Query Folding",
    subtitle: "Making the recipe survive contact with next month",
    estimatedMinutes: 16,
    intro:
      "A recipe that only works on the file you built it with is not much better than cleaning by hand. Three habits make a query survive: not hard-coding the path, not hard-coding the rows, and letting the source do the work.",

    atoms: [
      {
        id: "a-pq-refresh",
        title: "What Refresh actually does",
        explain:
          "Refresh re-reads the source and replays every step against it. It does not remember last month's result. If a step referred to something that no longer exists — a renamed column, a missing file — the refresh fails and names the step.",
        why: "Understanding this makes refresh errors readable. 'The column Amount of the table was not found' is not mysterious: the source changed its column name, and your step is still asking for the old one.",
        table: {
          caption: "Common refresh failures and their real cause.",
          headers: ["Error mentions", "What changed"],
          rows: [
            ["A column that was not found", "The source renamed or dropped it"],
            ["The file path", "The file moved, or was opened from Downloads"],
            ["A data type conversion", "New rows contain a value the type cannot hold"],
            ["Nothing — it just takes forever", "Query folding broke, see below"],
          ],
          note: "Each message names a STEP. Click that step in Applied Steps and you are looking at the problem.",
        },
        mistake:
          "Loading a file straight from your Downloads folder. The path is recorded in the query, and the next refresh on any other machine — or after you tidy up — cannot find it.",
      },
      {
        id: "a-pq-parameters",
        title: "Parameters instead of hard-coded values",
        explain:
          "A parameter is a named value a query refers to instead of a literal — a folder path, a year, a threshold. Change the parameter once and every query using it follows.",
        why: "Without parameters the file path is buried inside a step, and moving the source means editing every query by hand. With one, you change it in a single dialog — and the same query then runs on a colleague's machine.",
        example:
          "Manage Parameters  →  New\n   Name:     DataFolder\n   Type:     Text\n   Current:  C:\\Reports\\Sales\\\n\nThen in the source step, replace the typed path\nwith the parameter.\n\nGood candidates for a parameter:\n   · the folder or file path\n   · the reporting year or month\n   · a threshold used in several filters\n   · a server or database name",
      },
      {
        id: "a-pq-folding",
        title: "Query folding, and why the order of steps affects speed",
        explain:
          "When the source is a database, Power Query tries to translate your steps into a single query the server runs. That is query folding. Some steps fold and some do not, and the first step that cannot fold stops all folding after it.",
        why: "Folding is the difference between the server sending you 5,000 filtered rows and your laptop downloading 5 million and filtering them itself. Filter and remove columns FIRST, while folding still works, and leave the steps that break it until last.",
        table: {
          caption: "Keeping folding alive.",
          headers: ["Step", "Usually folds?", "Put it"],
          rows: [
            ["Filter rows", "Yes", "As early as possible"],
            ["Remove columns", "Yes", "Early"],
            ["Rename, change type", "Yes", "Early"],
            ["Merge on a key", "Often", "Middle"],
            ["Add a custom column with M logic", "Often not", "Late"],
            ["Anything referencing another source", "No", "Last"],
          ],
          note: "Right-click a step and look for 'View Native Query'. If it is available, everything up to that step folded. If it is greyed out, folding has already stopped.",
        },
        mistake:
          "Adding a custom column as step two and filtering at step ten. Folding stops at step two, so every row is pulled to your machine before the filter runs — on a large source that is the difference between seconds and an abandoned refresh.",
      },
      {
        id: "a-pq-checklist",
        title: "Before you Close & Apply",
        explain:
          "Check the row count against the source, confirm every column's type, make sure no step hard-codes a path or a value that will change, and give the query a name a colleague would understand.",
        why: "Everything downstream — the model, the measures, the visuals — inherits whatever you apply here. A wrong type or a lost row at this stage is a wrong number in every report built on it, and much harder to trace once there are ten measures in between.",
        table: {
          caption: "The pre-flight check.",
          headers: ["Check", "Catches"],
          rows: [
            ["Row count matches the source, minus what you removed", "An over-aggressive filter"],
            ["Every column has the right type", "Count instead of Sum, and grouping failures"],
            ["No leading or trailing spaces left", "Joins that silently fail later"],
            ["No hard-coded file path", "A refresh that only works on your laptop"],
            ["Query has a meaningful name", "\"Query1\" in a model nobody can read"],
            ["Removed real rows are written down", "An unexplained gap between your total and theirs"],
          ],
          note: "This is the Month 2 pre-flight check in a new tool. The habits transfer; only the buttons changed.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },
];
