/**
 * MODULE · SORTING, FILTERING & CLEAN DATA (m1-clean-structure)
 *
 * The module the curriculum summarises as "turn a raw export into a dataset
 * you can actually trust". It is the largest module in month one because
 * cleaning is 60 to 70% of the real job, and because almost every wrong
 * number an analyst ever publishes starts here.
 *
 * Structure follows the natural order of handling a new file:
 *   1. Sorting        put it in an order you can read
 *   2. Filtering      narrow it to the rows in question
 *   3. Text cleaning  fix what is inside the cells
 *   4. Structural     split, de-duplicate, reshape
 *   5. Errors & rules stop bad data getting in, handle what already did
 *
 * Sorting and filtering are ribbon operations rather than formulas, so those
 * lessons teach them with worked tables and decision rules. Everything that
 * CAN be practised in the grid is.
 *
 * CLIENT-SAFE. Knowledge-check answers live in lib/academy/assessments/.
 */

export const SECTION_ID = "s5-clean-structure";

/**
 * A deliberately filthy export. Every defect here is one a learner will meet
 * in a real file in their first month:
 *   trailing spaces, inconsistent case, a comma-crammed location column,
 *   a duplicate row, a blank, and a number stored as text.
 */
const MESSY = {
  A1: "Customer", B1: "Location", C1: "Order", D1: "Amount",
  A2: "Adaeze Okafor", B2: "Ikeja, Lagos", C2: "ORD-1001", D2: 45000,
  A3: "musa bello ", B3: "Wuse, Abuja", C3: "ORD-1002", D3: 32000,
  A4: "Ngozi Eze", B4: "ikeja, lagos", C4: "ORD-1003", D4: 51000,
  A5: "Adaeze Okafor", B5: "Ikeja, Lagos", C5: "ORD-1001", D5: 45000,
  A6: "Bola Ade", B6: "Yaba, Lagos", C6: "ORD-1004", D6: "",
  A7: " Chuka Obi", B7: "Nyanya, Abuja", C7: "ORD-1005", D7: 28000,
};

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════ */
  {
    id: "l16-sorting",
    moduleId: "m1-clean-structure",
    sectionId: SECTION_ID,
    order: 1,
    title: "Sorting",
    subtitle: "Single column, multi-level, custom order and by colour",
    estimatedMinutes: 11,
    intro:
      "Sorting looks trivial and is where a surprising amount of data gets destroyed. Get the habits right first, then the four kinds of sort you will actually use.",

    atoms: [
      {
        id: "a-sort-basics",
        title: "Single-column sorting, and the mistake that ruins a sheet",
        explain:
          "Select any cell inside your data and use Data, then Sort A to Z or Z to A. Excel works out the extent of the table and moves whole rows together.",
        why: "Sorting is how you see the top and bottom of anything instantly: biggest customers, latest orders, worst-rated products. It is usually the first thing you do to a file you have never seen.",
        table: {
          caption: "What the two directions mean for each data type.",
          headers: ["Data type", "A to Z means", "Z to A means"],
          rows: [
            ["Text", "Alphabetical, A first", "Reverse alphabetical"],
            ["Numbers", "Smallest to largest", "Largest to smallest"],
            ["Dates", "Oldest to newest", "Newest to oldest"],
          ],
        },
        mistake:
          "Selecting ONE column and sorting it. Excel then reorders only that column and leaves every other column where it was, so every row is now a mixture of different customers. The damage is silent and often unrecoverable. Click a single cell inside the data and let Excel select the range, or select the whole table.",
      },
      {
        id: "a-multi-level-sort",
        title: "Multi-level sorting",
        explain:
          "Data, Sort, then Add Level. Excel sorts by the first column, and where values tie it breaks the tie with the second. Sort by Department, then by Salary descending, and you get each department grouped with its highest earner at the top.",
        why: "One sort answers \"who is the biggest\". Two answers \"who is the biggest within each group\", which is the question a manager usually meant. It is also how you prepare data for grouping and subtotals.",
        table: {
          caption: "Sort by Region, then Amount largest first.",
          headers: ["Region", "Customer", "Amount"],
          rows: [
            ["Abuja", "Musa Bello", "32,000"],
            ["Abuja", "Chuka Obi", "28,000"],
            ["Lagos", "Ngozi Eze", "51,000"],
            ["Lagos", "Adaeze Okafor", "45,000"],
          ],
          note: "Regions group together, and inside each one the amounts run downward.",
        },
      },
      {
        id: "a-custom-sort",
        title: "Custom sort order",
        explain:
          "Alphabetical is wrong for a lot of real columns. High, Low, Medium is alphabetical and meaningless. Data, Sort, Order, Custom List lets you define the sequence: Low, Medium, High.",
        why: "Priority levels, sizes, weekdays, months and school terms all have a natural order that is not alphabetical. Sorting them alphabetically produces a chart nobody can read and a table nobody trusts.",
        table: {
          caption: "The same priority column, two ways.",
          headers: ["Alphabetical", "Custom list"],
          rows: [
            ["High", "Low"],
            ["Low", "Medium"],
            ["Medium", "High"],
          ],
          note: "Excel already knows the days of the week and the months. Anything else you define once and reuse.",
        },
      },
      {
        id: "a-sort-by-colour",
        title: "Sorting by colour or icon",
        explain:
          "If cells carry a fill colour, font colour or a conditional-formatting icon, Data, Sort lets you sort on that instead of the value.",
        why: "It pairs with conditional formatting, which you meet later in this module. Highlight every duplicate in red, then sort by colour and every duplicate is together at the top, ready to deal with in one pass.",
        mistake:
          "Relying on colour as your only record of what is wrong. Colour is not data: it does not survive a CSV export and cannot be filtered by a formula. Use it to see and to sort, then record the finding in a real column.",
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  {
    id: "l17-filtering",
    moduleId: "m1-clean-structure",
    sectionId: SECTION_ID,
    order: 2,
    title: "Filtering",
    subtitle: "AutoFilter, text, number and date filters, Advanced Filter, slicers",
    estimatedMinutes: 13,
    intro:
      "Sorting rearranges everything. Filtering hides what you did not ask for and leaves the rest untouched, which makes it the safer of the two and the one you will reach for constantly.",

    atoms: [
      {
        id: "a-autofilter",
        title: "AutoFilter",
        explain:
          "Select a cell in your data and press Ctrl+Shift+L, or use Data, Filter. Every header gets a dropdown arrow. Tick the values you want to see and the other rows are hidden, not deleted.",
        why: "It is non-destructive, which is why it is the right first move on someone else's file. You can look at Lagos customers, then Abuja, then over-50,000 orders, without ever changing the data.",
        table: {
          caption: "Filtering versus sorting, and when to use which.",
          headers: ["", "Sorting", "Filtering"],
          rows: [
            ["Does what", "Reorders every row", "Hides rows that do not match"],
            ["Changes the data?", "Yes, the order is rewritten", "No, rows are only hidden"],
            ["Use it to", "See top and bottom", "Answer a question about a subset"],
          ],
        },
        mistake:
          "Copying a filtered range and not realising SUM includes hidden rows. Ordinary SUM totals everything in the range, visible or not. SUBTOTAL(109, range) totals only what is on screen.",
      },
      {
        id: "a-text-number-date-filters",
        title: "Text, number and date filters",
        explain:
          "Each dropdown adapts to what the column holds. Text columns offer contains, begins with and ends with. Number columns offer greater than, between and Top 10. Date columns offer this month, last quarter and custom ranges.",
        why: "This is where filtering stops being tick-boxes and starts answering questions. \"Everyone whose email contains gmail\", \"orders between 20,000 and 50,000\", \"everything from last quarter\" are three clicks each.",
        table: {
          caption: "The filters worth knowing by name.",
          headers: ["Column type", "Filter", "Answers"],
          rows: [
            ["Text", "Contains", "Every address with Lagos in it"],
            ["Text", "Begins with", "Order numbers starting ORD-10"],
            ["Number", "Greater than", "Orders above 40,000"],
            ["Number", "Between", "Orders from 20,000 to 50,000"],
            ["Number", "Top 10", "The ten largest, or top 5%"],
            ["Date", "Last quarter", "Everything in the previous three months"],
          ],
        },
      },
      {
        id: "a-advanced-filter",
        title: "Advanced Filter",
        explain:
          "For conditions AutoFilter cannot express. You write a small criteria range on the sheet: headers on one row, conditions beneath. Conditions on the SAME row mean AND. Conditions on DIFFERENT rows mean OR.",
        why: "AutoFilter can do Lagos AND over 40,000. It cannot do Lagos over 40,000 OR Abuja over 25,000, because that is two different rules for two different groups. Advanced Filter can, and it can copy the results to another location in one step.",
        table: {
          caption: "A criteria range meaning: Lagos over 40,000, OR Abuja over 25,000.",
          headers: ["Location", "Amount"],
          rows: [
            ["Lagos", ">40000"],
            ["Abuja", ">25000"],
          ],
          note: "Same row is AND. A new row is OR. That single rule is the whole feature.",
        },
        mistake:
          "Writing the criteria headers differently from the data headers. They must match exactly, spelling and spacing included, or the filter silently matches nothing.",
      },
      {
        id: "a-slicers",
        title: "Slicers",
        explain:
          "A slicer is a panel of clickable buttons that filters a table or a PivotTable. Insert, Slicer, then pick a column. Clicking Lagos filters instantly, and the panel shows what is currently selected.",
        why: "A filter dropdown hides its own state: someone opening your workbook cannot see that a filter is on, and will read the visible total as the whole picture. A slicer shows the active selection permanently, which is why every dashboard uses them.",
        mistake:
          "Sending someone a workbook with a dropdown filter applied. They see a subtotal and believe it is the total. Use a slicer, or clear filters before sharing.",
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  {
    id: "l18-text-cleaning",
    moduleId: "m1-clean-structure",
    sectionId: SECTION_ID,
    order: 3,
    title: "Cleaning What Is Inside the Cells",
    subtitle: "TRIM, CLEAN, PROPER, SUBSTITUTE, FIND, SEARCH, LEN",
    estimatedMinutes: 16,
    intro:
      "The messy customer export below is the one you will work on for the rest of this module. Every defect in it is one you will meet in a real file: trailing spaces, mixed capitalisation, two facts crammed into one column, a duplicate and a blank.",

    atoms: [
      {
        id: "a-trim",
        title: "TRIM, and the invisible defect",
        explain:
          "TRIM removes spaces from the start and end of text, and collapses runs of spaces inside it to single ones. =TRIM(A3) turns \"musa bello \" into \"musa bello\".",
        why: "A trailing space is the single most common hidden cause of a lookup that will not match. \"Lagos\" and \"Lagos \" look identical on screen and are different values to Excel, so your VLOOKUP returns #N/A, your COUNTIF undercounts, and your grouped total silently splits in two. You cannot see the problem, which is why you check for it rather than look for it.",
        table: {
          caption: "The same-looking name, measured.",
          headers: ["Cell", "Looks like", "=LEN()", "Actually"],
          rows: [
            ["A2", "Adaeze Okafor", "13", "Clean"],
            ["A3", "musa bello", "11", "Has a trailing space"],
            ["A7", "Chuka Obi", "10", "Has a leading space"],
          ],
          note: "LEN is how you make an invisible defect visible.",
        },
        exercise: {
          data: { ...MESSY, A9: "Length of A3 as-is", A10: "Length after TRIM" },
          rows: 11,
          cols: 4,
          target: "B9",
          expected: 11,
          mustUseFormula: true,
          mustUse: "LEN",
          task: 'Musa\'s name in A3 looks like 10 characters. In B9, use LEN to measure what is really stored.',
          hint: "LEN takes one argument: the cell.",
          successMessage:
            "11, not 10. There is a trailing space. Now try =LEN(TRIM(A3)) and you will get 10.",
        },
      },
      {
        id: "a-clean",
        title: "CLEAN",
        explain:
          "CLEAN strips non-printable characters: line breaks, tabs and control codes that carry no visible shape.",
        why: "Data copied from a web page, a PDF or an older system routinely arrives carrying these. They behave exactly like the trailing space problem but TRIM will not remove them, so a cell that looks clean and has been trimmed still will not match.",
        example:
          "A cell pasted from a web table:\n\n  =LEN(A2)              ->  14\n  =LEN(TRIM(A2))        ->  14   still wrong\n  =LEN(CLEAN(TRIM(A2))) ->  13   the line break is gone\n\nWrap both when you do not know where the data came from.",
      },
      {
        id: "a-case-functions",
        title: "UPPER, LOWER and PROPER",
        explain:
          "UPPER makes everything capitals, LOWER makes everything lowercase, PROPER capitalises the first letter of each word.",
        why: "Standardising case is how you make text comparable. \"ikeja, lagos\" and \"Ikeja, Lagos\" are two different values when you group or count, so a region that should show once shows twice. PROPER is also how you rescue a name column someone typed entirely in capitals.",
        table: {
          caption: "The same value, three ways.",
          headers: ["Formula", "Result", "Use it for"],
          rows: [
            ['=UPPER("ikeja, lagos")', "IKEJA, LAGOS", "Codes, reference numbers"],
            ['=LOWER("Ikeja, Lagos")', "ikeja, lagos", "Email addresses, comparisons"],
            ['=PROPER("ikeja, lagos")', "Ikeja, Lagos", "Names, places, anything shown to people"],
          ],
        },
        mistake:
          "Running PROPER over a column containing acronyms. PROPER turns NNPC into Nnpc and Ltd into Ltd but PLC into Plc. Check the column before you commit.",
        exercise: {
          data: { ...MESSY, A9: "Fix the case in B4" },
          rows: 11,
          cols: 4,
          target: "B9",
          expected: "Ikeja, Lagos",
          mustUseFormula: true,
          mustUse: "PROPER",
          task: 'Row 4 has "ikeja, lagos" in lowercase while row 2 has it properly capitalised, so grouping by location would count them as two places. In B9, produce the corrected version of B4.',
          hint: "One function, one argument.",
          successMessage:
            "Now B4 and B2 read identically, so a count by location gives one row instead of two.",
        },
      },
      {
        id: "a-substitute",
        title: "SUBSTITUTE",
        explain:
          "SUBSTITUTE swaps one piece of text for another. =SUBSTITUTE(A2,\"-\",\"/\") turns every hyphen into a slash. A fourth argument lets you change only the Nth occurrence.",
        why: "It is how you standardise formats that were entered inconsistently: phone numbers with and without spaces, references with different separators, currency symbols that should not be in the cell. It is also the only clean way to strip a specific character while leaving everything else intact.",
        table: {
          caption: "Common cleaning jobs.",
          headers: ["Problem", "Formula", "Result"],
          rows: [
            ["Naira sign inside the value", '=SUBSTITUTE(A2,"₦","")', "45000"],
            ["Thousands commas in text", '=SUBSTITUTE(A2,",","")', "45000"],
            ["Wrong separator", '=SUBSTITUTE(A2,"-","/")', "ORD/1001"],
          ],
          note: "The result is still TEXT. Multiply by 1 or use VALUE to make it a number again.",
        },
      },
      {
        id: "a-find-search",
        title: "FIND and SEARCH",
        explain:
          "Both report the position of one piece of text inside another. FIND is case sensitive and SEARCH is not. Both return #VALUE! when the text is absent.",
        why: "Position is what lets you split text. \"Ikeja, Lagos\" becomes a city and a state once you know the comma sits at character 6. Combined with LEFT, RIGHT and MID, this is manual Text to Columns, and unlike Text to Columns it updates when the data changes.",
        table: {
          caption: 'On B2, which holds "Ikeja, Lagos".',
          headers: ["Formula", "Returns", "Why"],
          rows: [
            ['=FIND(",",B2)', "6", "The comma is the 6th character"],
            ['=LEFT(B2,FIND(",",B2)-1)', "Ikeja", "Everything before the comma"],
            ['=FIND("lagos",B2)', "#VALUE!", "FIND is case sensitive"],
            ['=SEARCH("lagos",B2)', "8", "SEARCH is not"],
          ],
        },
        mistake:
          "Using FIND on user-entered text. People capitalise inconsistently, so FIND fails on half the rows and you get a column of #VALUE!. Use SEARCH unless case genuinely matters.",
        exercise: {
          data: { ...MESSY, A9: "City from B2" },
          rows: 11,
          cols: 4,
          target: "B9",
          expected: "Ikeja",
          mustUseFormula: true,
          mustUse: "LEFT",
          task: 'B2 holds "Ikeja, Lagos". In B9, pull out just the city. Do not type "Ikeja": find the comma and take everything before it, so the formula still works on any row.',
          hint: "Combine LEFT with FIND. Remember to subtract 1 so the comma itself is excluded.",
          successMessage:
            "That formula works on every row, which typing the answer would not. This is Text to Columns done with a formula that updates itself.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  {
    id: "l19-structural-cleaning",
    moduleId: "m1-clean-structure",
    sectionId: SECTION_ID,
    order: 4,
    title: "Reshaping the Sheet",
    subtitle: "Text to Columns, Flash Fill, Remove Duplicates, Find and Replace",
    estimatedMinutes: 13,
    intro:
      "The last lesson fixed what was inside cells. This one fixes the shape of the sheet itself: data crammed into one column, rows that appear twice, and changes you need to make everywhere at once.",

    atoms: [
      {
        id: "a-text-to-columns",
        title: "Text to Columns",
        explain:
          "Select the column, then Data, Text to Columns. Choose Delimited if the parts are separated by a character such as a comma or a space, or Fixed width if each part occupies a set number of characters. Excel splits it into separate columns.",
        why: "One fact per column is the rule everything downstream depends on. A Location column holding \"Ikeja, Lagos\" cannot be grouped by state, counted by city or joined to anything. Splitting it is the difference between a dataset you can analyse and one you can only read.",
        table: {
          caption: "Before and after splitting on the comma.",
          headers: ["Before", "City", "State"],
          rows: [
            ["Ikeja, Lagos", "Ikeja", "Lagos"],
            ["Wuse, Abuja", "Wuse", "Abuja"],
            ["Nyanya, Abuja", "Nyanya", "Abuja"],
          ],
        },
        mistake:
          "Running it without an empty column to the right. Text to Columns overwrites whatever is next to it, without warning. Insert blank columns first, every time.",
      },
      {
        id: "a-flash-fill",
        title: "Flash Fill",
        explain:
          "Type the result you want for the first row, start typing the second, and Excel offers to fill the rest from the pattern it has inferred. Ctrl+E triggers it directly.",
        why: "It handles the awkward cases where writing a formula would take longer than the job is worth: pulling initials out of names, reformatting phone numbers, building email addresses. It is the fastest cleaning tool in Excel for one-off work.",
        table: {
          caption: "You type the first one. Excel works out the rest.",
          headers: ["Customer", "You type", "Flash Fill produces"],
          rows: [
            ["Adaeze Okafor", "A. Okafor", "—"],
            ["Musa Bello", "", "M. Bello"],
            ["Ngozi Eze", "", "N. Eze"],
          ],
        },
        mistake:
          "Trusting it without checking. Flash Fill guesses from your examples, and a guess that is right for the first three rows can be wrong for row 400. It also produces static values, not formulas, so it does not update when the source changes.",
      },
      {
        id: "a-remove-duplicates",
        title: "Remove Duplicates",
        explain:
          "Data, Remove Duplicates. You choose which columns define a duplicate. Ticking every column means a row must match on all of them; ticking one means that column alone decides.",
        why: "Duplicate rows inflate every total, count and average you produce. A duplicated order in a sales file does not look wrong, it just makes revenue higher than it was, and nobody queries a number that is too good.",
        mistake:
          "Deleting duplicates before checking WHY they exist. Two rows with the same order number might be a genuine double entry, a partial refund, or a legitimate repeat purchase recorded properly. Count them first with COUNTIF, look at a few, then delete.",
        exercise: {
          data: { ...MESSY, A9: "How many times does ORD-1001 appear?" },
          rows: 11,
          cols: 4,
          target: "B9",
          expected: 2,
          mustUseFormula: true,
          mustUse: "COUNTIF",
          task: "Before deleting anything, find out how big the duplicate problem is. In B9, count how many rows carry order number ORD-1001.",
          hint: 'The order numbers are in C2 to C7. The criterion is the text "ORD-1001".',
          successMessage:
            "Twice. That single duplicate is inflating revenue by 45,000, which is why you count before you delete.",
        },
      },
      {
        id: "a-find-replace",
        title: "Find and Replace, including wildcards",
        explain:
          "Ctrl+H. Two wildcards make it powerful: ? stands for exactly one character, and * stands for any number of them. To search for a genuine question mark or asterisk, put a tilde in front of it.",
        why: "It is how you fix a systematic error everywhere in one action: a misspelled region in 4,000 rows, an old product code, a stray currency symbol. Doing that row by row is not a plan.",
        table: {
          caption: "Wildcards in Find and Replace.",
          headers: ["Find", "Matches", "Does not match"],
          rows: [
            ["Lag*", "Lagos, Lagoon, Lag", "Ilaga"],
            ["?buja", "Abuja", "Buja"],
            ["ORD-1*", "ORD-1001, ORD-19", "ORD-2001"],
          ],
        },
        mistake:
          "Using Replace All on a whole sheet without Match entire cell contents ticked. Replacing \"Ada\" with \"Adaeze\" across a sheet will also rewrite \"Adamawa\" into \"Adaezemawa\". Preview with Find All first.",
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  {
    id: "l20-errors-and-validation",
    moduleId: "m1-clean-structure",
    sectionId: SECTION_ID,
    order: 5,
    title: "Errors, Blanks and Stopping Bad Data at the Door",
    subtitle: "IFERROR, ISBLANK, ISNUMBER, ISTEXT, Data Validation, Conditional Formatting",
    estimatedMinutes: 15,
    intro:
      "Cleaning is repair work. This lesson is about handling what you cannot repair, and then about preventing the mess in the first place, which is always cheaper.",

    atoms: [
      {
        id: "a-iferror",
        title: "IFERROR",
        explain:
          "IFERROR runs a calculation and, if it fails for any reason, shows what you told it to show instead. =IFERROR(D2/C2,\"No data\") gives the division normally and \"No data\" when it cannot.",
        why: "A report with one broken cell is a report someone questions. A report that is a wall of #DIV/0! is one nobody reads. More importantly, a single error cell poisons every SUM and AVERAGE that includes it, so one bad row makes every total below it an error too.",
        table: {
          caption: "The same column, with and without IFERROR.",
          headers: ["Row", "Raw formula", "Wrapped"],
          rows: [
            ["Normal row", "22,500", "22,500"],
            ["Blank amount", "#DIV/0!", "No data"],
            ["Total below", "#DIV/0!", "Correct total"],
          ],
          note: "The third row is the real cost. One error breaks everything downstream.",
        },
        mistake:
          "Wrapping everything in IFERROR while still building the sheet. It hides mistakes you needed to see. Get it working first, then wrap the cells that can legitimately fail.",
        exercise: {
          data: {
            A1: "Customer", B1: "Orders", C1: "Total", D1: "Average",
            A2: "Adaeze", B2: 3, C2: 135000,
            A3: "Bola", B3: 0, C3: 0,
            A4: "Chuka", B4: 2, C4: 56000,
          },
          rows: 6,
          cols: 4,
          target: "D3",
          expected: "No orders",
          mustUseFormula: true,
          mustUse: "IFERROR",
          task: 'Bola has zero orders, so dividing the total by the count fails. In D3, work out the average order value but show "No orders" instead of an error when it cannot be calculated.',
          hint: 'The calculation is C3/B3. Wrap it, with "No orders" as the fallback.',
          successMessage:
            "Readable, and a SUM further down the column will still work. Without the wrap it would have returned an error too.",
        },
      },
      {
        id: "a-is-functions",
        title: "ISBLANK, ISNUMBER and ISTEXT",
        explain:
          "Each asks a yes-or-no question about a cell and returns TRUE or FALSE. ISBLANK checks for genuinely empty, ISNUMBER for a real number, ISTEXT for text.",
        why: "They are how you check a dataset before processing it rather than after it breaks. ISNUMBER down an amount column instantly exposes the values stored as text, which is the reason your SUM is too low. Paired with IF, they let a formula handle both cases instead of failing on one.",
        table: {
          caption: "Diagnosing an amount column.",
          headers: ["Cell holds", "ISNUMBER", "ISTEXT", "ISBLANK", "Means"],
          rows: [
            ["45000", "TRUE", "FALSE", "FALSE", "Fine"],
            ['"45,000"', "FALSE", "TRUE", "FALSE", "Text. SUM will skip it"],
            ["(empty)", "FALSE", "FALSE", "TRUE", "Missing"],
          ],
        },
        exercise: {
          data: { ...MESSY, A9: "Is D6 a real number?" },
          rows: 11,
          cols: 4,
          target: "B9",
          expected: "false",
          mustUseFormula: true,
          mustUse: "ISNUMBER",
          task: "Bola's amount in D6 is blank. In B9, check whether D6 holds a real number before you trust any total built on that column.",
          hint: "One function, one argument. It returns TRUE or FALSE.",
          successMessage:
            "FALSE. One missing amount out of six, which you now know before quoting an average.",
        },
      },
      {
        id: "a-data-validation",
        title: "Data Validation, the cheapest fix there is",
        explain:
          "Data, Data Validation restricts what a cell will accept: a dropdown list, a number range, a date range, a text length. You can add your own input message and error alert.",
        why: "Every cleaning technique in this module is repair work on damage already done. Validation prevents it. A dropdown for Region means nobody can type \"lagos\", \"Lagos \" or \"LAG\" ever again, and the whole class of problem disappears at the source.",
        table: {
          caption: "What to validate, and what it prevents.",
          headers: ["Rule", "Set up as", "Prevents"],
          rows: [
            ["Region", "List: Lagos, Abuja, Kano", "Spelling and case variants"],
            ["Amount", "Decimal, greater than 0", "Negative and zero entries"],
            ["Order date", "Date, between two dates", "Typos like the year 2206"],
            ["Phone", "Text length equal to 11", "Short or pasted-wrong numbers"],
          ],
        },
        mistake:
          "Adding validation to a column that already contains bad data. Validation only checks NEW entries; it does not test what is already there. Clean first, then validate to keep it clean.",
      },
      {
        id: "a-conditional-formatting",
        title: "Conditional Formatting",
        explain:
          "Home, Conditional Formatting applies a colour automatically when a rule is met. The built-in rules cover duplicates, top and bottom values, above and below average, and blanks. Colour scales shade a whole range by value.",
        why: "It is how you SEE a problem across thousands of rows without reading them. Highlight Duplicate Values on an order column and every double entry lights up immediately. Highlight Blanks and the gaps in your data become a shape you can take in at a glance.",
        table: {
          caption: "The four rules worth setting up on any new file.",
          headers: ["Rule", "Finds", "Then"],
          rows: [
            ["Duplicate Values", "Rows entered twice", "Count them, then remove"],
            ["Blanks", "Missing data", "Decide: fill, exclude or flag"],
            ["Top 10 / Bottom 10", "Outliers at both ends", "Check they are real"],
            ["Colour scale", "The shape of a whole column", "Spot impossible values"],
          ],
          note: "Pair this with sorting by colour from lesson one and you can group every flagged row together in two clicks.",
        },
        practice: {
          prompt:
            "You receive a 5,000-row export. Describe the first four things you would do before calculating anything, and say what each one protects you from.",
          answer:
            "Run MAX and MIN over every numeric column to spot impossible values. Run COUNTBLANK to learn how complete the data is. Apply Conditional Formatting for duplicates and blanks so the gaps are visible. Check LEN against a few text values to catch trailing spaces. Each one takes seconds and each protects you from publishing a confident number built on broken data.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
