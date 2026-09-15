/**
 * ASSESSMENTS · SORTING, FILTERING & CLEAN DATA
 *
 * SERVER ONLY. See m1-data-foundations.js for the contract and writing style.
 */

export const ASSESSMENTS = {
  /* ═══════════════════════════════════════════════════════════════════ */
  "l16-sorting": {
    lessonId: "l16-sorting",
    passMark: 70,
    questions: [
      {
        id: "q16-1",
        type: "scenario",
        difficulty: 3,
        atomId: "a-sort-basics",
        prompt:
          "You select only the Amount column, sort it largest to smallest, and save. What has happened to the file?",
        options: [
          { id: "a", text: "Nothing, the rows moved together" },
          {
            id: "b",
            text: "Only the amounts moved. Every row now pairs a customer with someone else's amount",
          },
          { id: "c", text: "Excel blocked the sort" },
          { id: "d", text: "The other columns sorted too" },
        ],
        correct: "b",
        explanation:
          "Sorting one selected column reorders that column alone. Every other column stays put, so the rows are now scrambled. The damage is silent and usually unrecoverable once saved.",
        whyWrong: {
          a: "Rows move together only when Excel selects the whole table, which happens when you click a single cell inside it rather than selecting one column.",
          c: "Excel warns you in some versions and lets you continue. In others it simply does it.",
          d: "Only the selection is sorted. That is the entire problem.",
        },
      },
      {
        id: "q16-2",
        type: "mcq",
        difficulty: 2,
        atomId: "a-multi-level-sort",
        prompt:
          "You want each department grouped, with the highest earner first inside each. What do you set up?",
        options: [
          { id: "a", text: "Sort by Salary only" },
          { id: "b", text: "Sort by Department, then add a second level on Salary, largest first" },
          { id: "c", text: "Filter by Department" },
          { id: "d", text: "Sort by Department only" },
        ],
        correct: "b",
        explanation:
          "The first level groups, the second breaks ties inside each group. That is exactly what multi-level sorting is for.",
        whyWrong: {
          a: "That gives one ranking across the whole company, with departments mixed together.",
          c: "Filtering hides rows. It does not order them.",
          d: "That groups the departments but leaves salaries in whatever order they were.",
        },
      },
      {
        id: "q16-3",
        type: "mcq",
        difficulty: 2,
        atomId: "a-custom-sort",
        prompt:
          "A Priority column holds Low, Medium and High. Sorted A to Z, what order do you get?",
        options: [
          { id: "a", text: "Low, Medium, High" },
          { id: "b", text: "High, Low, Medium" },
          { id: "c", text: "High, Medium, Low" },
          { id: "d", text: "Medium, Low, High" },
        ],
        correct: "b",
        explanation:
          "Alphabetically H comes before L, which comes before M. The result is meaningless as a priority order, which is why a custom list is needed.",
        whyWrong: {
          a: "That is the order you want, and it is what a custom list gives you. Alphabetical will not produce it.",
          c: "That is the reverse of what you want, and still not alphabetical.",
          d: "Not alphabetical and not meaningful.",
        },
      },
      {
        id: "q16-4",
        type: "mcq",
        difficulty: 2,
        atomId: "a-sort-by-colour",
        prompt: "Why should colour not be your only record that a row has a problem?",
        options: [
          { id: "a", text: "Colour is hard to see" },
          {
            id: "b",
            text: "It is not data. It does not survive a CSV export and no formula can read it",
          },
          { id: "c", text: "Excel removes colour when sorting" },
          { id: "d", text: "There are not enough colours" },
        ],
        correct: "b",
        explanation:
          "Use colour to see and to sort, then record the finding in a real column so it survives export and can be filtered or counted.",
        whyWrong: {
          a: "Visibility is not the issue. Permanence and machine-readability are.",
          c: "Sorting preserves formatting. The row keeps its colour.",
          d: "The number of colours is irrelevant to the problem.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "l17-filtering": {
    lessonId: "l17-filtering",
    passMark: 70,
    questions: [
      {
        id: "q17-1",
        type: "mcq",
        difficulty: 1,
        atomId: "a-autofilter",
        prompt: "What does applying a filter do to the rows that do not match?",
        options: [
          { id: "a", text: "Deletes them" },
          { id: "b", text: "Hides them, leaving the data unchanged" },
          { id: "c", text: "Moves them to the bottom" },
          { id: "d", text: "Copies them to a new sheet" },
        ],
        correct: "b",
        explanation:
          "Filtering is non-destructive, which is why it is the safe first move on a file you did not create. Clearing the filter brings everything back.",
        whyWrong: {
          a: "Nothing is deleted. Clear the filter and every row returns.",
          c: "That is closer to what sorting does. Filtering does not reorder anything.",
          d: "Advanced Filter can copy results elsewhere. Ordinary AutoFilter does not.",
        },
      },
      {
        id: "q17-2",
        type: "scenario",
        difficulty: 3,
        atomId: "a-autofilter",
        prompt:
          "You filter to Lagos only, then SUM the amount column. The total looks too high. Why?",
        options: [
          { id: "a", text: "The filter did not apply" },
          {
            id: "b",
            text: "SUM totals every row in the range, hidden ones included. SUBTOTAL(109, range) counts only visible rows",
          },
          { id: "c", text: "Filtering duplicates rows" },
          { id: "d", text: "SUM cannot be used on filtered data" },
        ],
        correct: "b",
        explanation:
          "Hiding a row does not remove it from a range. SUM includes it regardless. SUBTOTAL with function number 109 respects the filter.",
        whyWrong: {
          a: "The filter applied correctly. The formula simply ignores it.",
          c: "Filtering never creates rows.",
          d: "SUM works fine. It just answers a different question from the one you meant.",
        },
      },
      {
        id: "q17-3",
        type: "mcq",
        difficulty: 3,
        atomId: "a-advanced-filter",
        prompt:
          "In an Advanced Filter criteria range, what is the difference between putting two conditions on the same row and on different rows?",
        options: [
          { id: "a", text: "There is no difference" },
          { id: "b", text: "Same row means AND. Different rows mean OR" },
          { id: "c", text: "Same row means OR. Different rows mean AND" },
          { id: "d", text: "Different rows are ignored" },
        ],
        correct: "b",
        explanation:
          "That one rule is the whole feature. It is how you express Lagos over 40,000 OR Abuja over 25,000, which AutoFilter cannot do.",
        whyWrong: {
          a: "The layout is the only thing that carries the logic, so it matters entirely.",
          c: "This is exactly reversed, and it is the most common mistake with Advanced Filter.",
          d: "Every row in the criteria range is used. Each one is an alternative set of conditions.",
        },
      },
      {
        id: "q17-4",
        type: "scenario",
        difficulty: 2,
        atomId: "a-slicers",
        prompt:
          "You email a workbook with a filter still applied to Lagos. What is the risk?",
        options: [
          { id: "a", text: "The file will not open" },
          {
            id: "b",
            text: "They see a Lagos subtotal and read it as the company total, because a dropdown filter does not advertise itself",
          },
          { id: "c", text: "The filter is removed on opening" },
          { id: "d", text: "No risk" },
        ],
        correct: "b",
        explanation:
          "A filter dropdown hides its own state. A slicer shows the current selection permanently, which is why dashboards use them. Otherwise, clear filters before sharing.",
        whyWrong: {
          a: "It opens normally, with the filter still on.",
          c: "The filter is saved with the file and is still applied when it opens.",
          d: "Someone acting on a regional number they believe is a national one is a real risk.",
        },
      },
      {
        id: "q17-5",
        type: "mcq",
        difficulty: 2,
        atomId: "a-text-number-date-filters",
        prompt: "Which filter finds every email address hosted at gmail?",
        options: [
          { id: "a", text: "Number filter, greater than" },
          { id: "b", text: "Text filter, contains" },
          { id: "c", text: "Date filter, this month" },
          { id: "d", text: "Top 10" },
        ],
        correct: "b",
        explanation:
          "Contains searches anywhere within the text, which is what you need when the part you are looking for sits in the middle or at the end.",
        whyWrong: {
          a: "Number filters only appear on numeric columns.",
          c: "Date filters only appear on date columns.",
          d: "Top 10 ranks numbers. It cannot search text.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "l18-text-cleaning": {
    lessonId: "l18-text-cleaning",
    passMark: 70,
    questions: [
      {
        id: "q18-1",
        type: "scenario",
        difficulty: 3,
        atomId: "a-trim",
        prompt:
          "Your VLOOKUP returns #N/A for a value you can clearly see in the other table. What do you check first?",
        options: [
          { id: "a", text: "Rebuild the formula" },
          {
            id: "b",
            text: "Compare LEN on both cells. A trailing space is invisible and makes them different values",
          },
          { id: "c", text: "Sort both tables" },
          { id: "d", text: "Change the number format" },
        ],
        correct: "b",
        explanation:
          "Trailing spaces are the single most common cause of a lookup that will not match. LEN makes the invisible visible, and TRIM fixes it.",
        whyWrong: {
          a: "Rebuilding a correct formula finds nothing. The data is the problem.",
          c: "VLOOKUP with an exact match does not care about order.",
          d: "Formatting does not affect whether two text values match.",
        },
      },
      {
        id: "q18-2",
        type: "mcq",
        difficulty: 2,
        atomId: "a-clean",
        prompt:
          "A cell pasted from a web page still will not match after TRIM. What is likely in it, and what removes it?",
        options: [
          { id: "a", text: "Extra spaces. Use TRIM again" },
          { id: "b", text: "Non-printable characters such as a line break. Use CLEAN" },
          { id: "c", text: "The wrong number format. Reformat it" },
          { id: "d", text: "Nothing. TRIM removes everything" },
        ],
        correct: "b",
        explanation:
          "TRIM only handles spaces. Line breaks, tabs and control codes need CLEAN. Wrap both when you do not know the source: =CLEAN(TRIM(A2)).",
        whyWrong: {
          a: "Running TRIM twice does nothing the first pass did not already do.",
          c: "This is a text matching problem, not a display problem.",
          d: "TRIM is specifically about spaces and leaves every other invisible character in place.",
        },
      },
      {
        id: "q18-3",
        type: "mcq",
        difficulty: 2,
        atomId: "a-find-search",
        prompt: 'B2 holds "Ikeja, Lagos". What does =FIND("lagos",B2) return?',
        options: [
          { id: "a", text: "8" },
          { id: "b", text: "#VALUE!" },
          { id: "c", text: "0" },
          { id: "d", text: "TRUE" },
        ],
        correct: "b",
        explanation:
          "FIND is case sensitive, so lowercase lagos does not match Lagos and it errors. SEARCH would return 8.",
        whyWrong: {
          a: "That is what SEARCH returns, because SEARCH ignores case.",
          c: "Neither function returns 0. They return a position or an error.",
          d: "Both return a number, not TRUE or FALSE.",
        },
      },
      {
        id: "q18-4",
        type: "mcq",
        difficulty: 3,
        atomId: "a-find-search",
        prompt: 'Which formula extracts "Ikeja" from "Ikeja, Lagos" and still works on other rows?',
        options: [
          { id: "a", text: '=LEFT(B2,5)' },
          { id: "b", text: '=LEFT(B2,FIND(",",B2)-1)' },
          { id: "c", text: '=RIGHT(B2,5)' },
          { id: "d", text: '="Ikeja"' },
        ],
        correct: "b",
        explanation:
          "Finding the comma each time means the formula adapts to any city length. Subtracting 1 excludes the comma itself.",
        whyWrong: {
          a: "Five characters works for Ikeja and breaks on Nyanya or Wuse.",
          c: "RIGHT takes from the end, which gives you part of the state.",
          d: "Typing the answer is not extraction. It gives the same value on every row.",
        },
      },
      {
        id: "q18-5",
        type: "scenario",
        difficulty: 2,
        atomId: "a-case-functions",
        prompt:
          'Your location column has both "Ikeja, Lagos" and "ikeja, lagos". What breaks, and what fixes it?',
        options: [
          { id: "a", text: "Nothing breaks. Excel ignores case" },
          {
            id: "b",
            text: "Grouping and counting treat them as two places. PROPER or LOWER standardises them",
          },
          { id: "c", text: "The file will not save" },
          { id: "d", text: "Only printing is affected" },
        ],
        correct: "b",
        explanation:
          "When you group or count, they are two distinct values, so one location reports as two rows with split totals. Standardise the case and they merge.",
        whyWrong: {
          a: "Some functions ignore case and grouping does not. That inconsistency is what makes this dangerous.",
          c: "Saving is unaffected. The problem appears in your results.",
          d: "It affects every count, group and lookup, long before anything is printed.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "l19-structural-cleaning": {
    lessonId: "l19-structural-cleaning",
    passMark: 70,
    questions: [
      {
        id: "q19-1",
        type: "scenario",
        difficulty: 3,
        atomId: "a-text-to-columns",
        prompt:
          "You run Text to Columns on a Location column with data in the column to its right. What happens?",
        options: [
          { id: "a", text: "Excel inserts new columns automatically" },
          { id: "b", text: "The column to the right is overwritten, without warning" },
          { id: "c", text: "Excel refuses to run" },
          { id: "d", text: "The result goes to a new sheet" },
        ],
        correct: "b",
        explanation:
          "Text to Columns writes the split parts into the cells to the right, replacing whatever is there. Insert blank columns first, every time.",
        whyWrong: {
          a: "It does not. This is the one thing you must do yourself beforehand.",
          c: "There is a warning in some versions and it is easy to click past.",
          d: "It writes in place, on the same sheet.",
        },
      },
      {
        id: "q19-2",
        type: "mcq",
        difficulty: 2,
        atomId: "a-flash-fill",
        prompt: "What is the main limitation of Flash Fill?",
        options: [
          { id: "a", text: "It only works on numbers" },
          {
            id: "b",
            text: "It produces static values from a guessed pattern, so it does not update and can be wrong further down",
          },
          { id: "c", text: "It only works on 100 rows" },
          { id: "d", text: "It requires a formula first" },
        ],
        correct: "b",
        explanation:
          "It infers the pattern from your examples. A guess right for the first three rows can be wrong at row 400, and the result never updates when the source changes.",
        whyWrong: {
          a: "It is mainly used on text, which is where it is strongest.",
          c: "There is no such limit.",
          d: "It needs typed examples, not formulas. That is the point of it.",
        },
      },
      {
        id: "q19-3",
        type: "scenario",
        difficulty: 3,
        atomId: "a-remove-duplicates",
        prompt:
          "You find 40 duplicate order numbers in a sales file. What should you do first?",
        options: [
          { id: "a", text: "Remove Duplicates immediately" },
          {
            id: "b",
            text: "Count them and look at a few, because they might be refunds or genuine repeat purchases",
          },
          { id: "c", text: "Delete the whole column" },
          { id: "d", text: "Ignore them" },
        ],
        correct: "b",
        explanation:
          "A repeated order number can be a double entry, a partial refund or a legitimate repeat. Deleting before you know destroys real records and the evidence of what happened.",
        whyWrong: {
          a: "Irreversible once saved, and you will never know what you removed.",
          c: "The column is your only way to identify the rows.",
          d: "Duplicates inflate every total. A revenue figure that is too high is rarely questioned, which is what makes it dangerous.",
        },
      },
      {
        id: "q19-4",
        type: "scenario",
        difficulty: 3,
        atomId: "a-find-replace",
        prompt:
          'You Replace All "Ada" with "Adaeze" across the sheet. What can go wrong?',
        options: [
          { id: "a", text: "Nothing" },
          {
            id: "b",
            text: 'Partial matches are rewritten too, so "Adamawa" becomes "Adaezemawa"',
          },
          { id: "c", text: "Excel only replaces the first match" },
          { id: "d", text: "The formatting is lost" },
        ],
        correct: "b",
        explanation:
          "Replace All matches anywhere inside a cell unless Match entire cell contents is ticked. Use Find All to preview first.",
        whyWrong: {
          a: "Any word containing those three letters is altered, quietly.",
          c: "Replace All replaces every occurrence, which is the risk.",
          d: "Formatting is untouched. The text is the problem.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "l20-errors-and-validation": {
    lessonId: "l20-errors-and-validation",
    passMark: 70,
    questions: [
      {
        id: "q20-1",
        type: "scenario",
        difficulty: 3,
        atomId: "a-iferror",
        prompt:
          "One cell in your Average column shows #DIV/0!. The SUM at the bottom of that column also shows #DIV/0!. Why?",
        options: [
          { id: "a", text: "Coincidence" },
          {
            id: "b",
            text: "An error in a range propagates to anything that includes it, so one bad cell breaks every total below",
          },
          { id: "c", text: "SUM cannot handle decimals" },
          { id: "d", text: "The range is wrong" },
        ],
        correct: "b",
        explanation:
          "This is the real cost of an unhandled error. It is not one ugly cell, it is every calculation downstream. IFERROR at the source keeps the totals working.",
        whyWrong: {
          a: "It is direct cause and effect: the total includes the broken cell.",
          c: "Decimals are not involved. An error value is.",
          d: "The range is fine. Its contents are not.",
        },
      },
      {
        id: "q20-2",
        type: "mcq",
        difficulty: 2,
        atomId: "a-iferror",
        prompt: 'What does =IFERROR(C3/B3,"No orders") show when B3 is 0?',
        options: [
          { id: "a", text: "#DIV/0!" },
          { id: "b", text: "No orders" },
          { id: "c", text: "0" },
          { id: "d", text: "An empty cell" },
        ],
        correct: "b",
        explanation:
          "IFERROR runs the calculation, catches the failure and shows your fallback instead.",
        whyWrong: {
          a: "That is what you would see without the wrap. Catching it is the purpose.",
          c: "It shows the fallback you supplied, which here is text.",
          d: "It would be empty only if you had supplied an empty fallback.",
        },
      },
      {
        id: "q20-3",
        type: "scenario",
        difficulty: 3,
        atomId: "a-is-functions",
        prompt:
          "Your amount column sums to less than you expect. Which check identifies the cause fastest?",
        options: [
          { id: "a", text: "COUNTA down the column" },
          {
            id: "b",
            text: "ISNUMBER down the column, to expose values stored as text that SUM is skipping",
          },
          { id: "c", text: "Sort the column" },
          { id: "d", text: "Reformat as currency" },
        ],
        correct: "b",
        explanation:
          "SUM silently skips text. ISNUMBER returns FALSE for exactly those cells, which points at the rows that are missing from your total.",
        whyWrong: {
          a: "COUNTA counts filled cells whether they are text or numbers, so it cannot tell the two apart.",
          c: "Sorting may cluster them, but it does not tell you which are text.",
          d: "Reformatting changes appearance and does not convert existing text, so the total stays wrong.",
        },
      },
      {
        id: "q20-4",
        type: "scenario",
        difficulty: 3,
        atomId: "a-data-validation",
        prompt:
          "You add a dropdown list to a Region column that already contains 3,000 rows of inconsistent entries. What happens to the existing data?",
        options: [
          { id: "a", text: "It is corrected automatically" },
          { id: "b", text: "Nothing. Validation only checks new entries, so clean first, then validate" },
          { id: "c", text: "Invalid rows are deleted" },
          { id: "d", text: "The workbook refuses to save" },
        ],
        correct: "b",
        explanation:
          "Validation is a gate on future input, not an audit of the past. Clean the existing column, then add the rule so it stays clean.",
        whyWrong: {
          a: "Excel has no way to know which of your variants each entry was meant to be.",
          c: "Nothing is deleted. Existing values stay exactly as they are.",
          d: "It saves normally, with the old bad values intact.",
        },
      },
      {
        id: "q20-5",
        type: "mcq",
        difficulty: 2,
        atomId: "a-conditional-formatting",
        prompt:
          "Which conditional formatting rule shows you every order number entered twice?",
        options: [
          { id: "a", text: "Colour scale" },
          { id: "b", text: "Highlight Duplicate Values" },
          { id: "c", text: "Top 10 items" },
          { id: "d", text: "Data bars" },
        ],
        correct: "b",
        explanation:
          "It lights up every repeated value instantly. Pair it with sorting by colour and all the duplicates group together for one pass.",
        whyWrong: {
          a: "A colour scale shades by magnitude, which says nothing about repetition.",
          c: "Top 10 finds the largest values, not repeated ones.",
          d: "Data bars show relative size inside each cell.",
        },
      },
    ],
  },
};

export default ASSESSMENTS;
