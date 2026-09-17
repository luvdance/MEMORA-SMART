/**
 * ASSESSMENTS · CLEANING, GROUPING & JOINING (m4-transform)
 *
 * SERVER ONLY. See m1-data-foundations.js for the contract and writing style.
 *
 * This module is about three silent failures, so the questions are too. Every
 * one describes code that RAN, produced no error, and returned a plausible
 * wrong number — which is the only way pandas ever fails at this level.
 *
 * All figures were produced by running the code against pandas 3.0.5:
 *   duplicate: ₦388,000 → ₦350,000 · fillna(0): 4.17 → 3.57
 *   coerce: ₦83,000 vs stripped ₦145,000 · bad merge: ₦107,000 → ₦152,000
 *   groupby: Abuja ₦160,000 (2) · Lagos ₦139,000 (3) · Kano ₦51,000 (1)
 */

export const ASSESSMENTS = {
  /* ═══════════════════════════════════════════════════════════════════ */
  "l75-missing-and-duplicates": {
    lessonId: "l75-missing-and-duplicates",
    passMark: 70,
    questions: [
      {
        id: "q75-1",
        type: "mcq",
        difficulty: 3,
        atomId: "a-tf-profile",
        prompt:
          'value_counts() on a state column reports five entries: "Lagos", "lagos", " Abuja", "Kano", "Abuja". The business has three states. What happens if you group by this column now?',
        options: [
          { id: "a", text: "pandas will combine them automatically" },
          { id: "b", text: "You get a five-row summary for a three-state business, with a correct-looking total" },
          { id: "c", text: "It raises an error" },
          { id: "d", text: "Only the first three appear" },
        ],
        correct: "b",
        explanation:
          "groupby treats each distinct string as its own group, so Lagos appears twice and Abuja twice. The total is still right, which is what makes the table convincing — and wrong.",
        whyWrong: {
          a: "pandas does not guess that two spellings mean the same thing. Cleaning is your job.",
          c: "Nothing errors. That is the entire problem with this class of bug.",
          d: "All five become rows.",
        },
      },
      {
        id: "q75-2",
        type: "mcq",
        difficulty: 3,
        atomId: "a-tf-fillna-trap",
        prompt:
          "Six real ratings average 4.17. You apply fillna(0) to the one missing rating and the mean becomes 3.57. What have you done?",
        options: [
          { id: "a", text: "Improved the accuracy" },
          { id: "b", text: "Claimed the customer rated the order zero, and lost 0.6 of a rating point to a value you invented" },
          { id: "c", text: "Nothing meaningful" },
          { id: "d", text: "Fixed a bug" },
        ],
        correct: "b",
        explanation:
          "25 ÷ 6 = 4.17 becomes 25 ÷ 7 = 3.57. NaN means 'we do not know' and zero is a measurement. This is the Month 2 blank-versus-zero rule with a number attached.",
        whyWrong: {
          a: "You added a data point that does not exist. That is the opposite of accurate.",
          c: "0.6 of a rating point on a five-point scale is a large change.",
          d: "The NaN was not a bug; it was an honest record of a missing rating.",
        },
      },
      {
        id: "q75-3",
        type: "mcq",
        difficulty: 3,
        atomId: "a-tf-duplicates",
        prompt:
          "Seven raw rows total ₦388,000. After drop_duplicates(subset='order') there are six rows totalling ₦350,000. What should you conclude?",
        options: [
          { id: "a", text: "The deduplication deleted real revenue" },
          { id: "b", text: "The duplicated order was inflating revenue by ₦38,000, about 11%" },
          { id: "c", text: "The data is corrupt" },
          { id: "d", text: "You should have kept both rows" },
        ],
        correct: "b",
        explanation:
          "ORD-3 appeared twice for ₦38,000, so the raw total counted it twice. ₦350,000 is the honest figure, and a report built on the raw frame would have overstated revenue by a ninth.",
        whyWrong: {
          a: "It removed a second copy of one order, not a second order.",
          c: "A duplicated row in an export is ordinary, not corruption.",
          d: "Keeping both double-counts ₦38,000 in every total built on it.",
        },
      },
      {
        id: "q75-4",
        type: "mcq",
        difficulty: 2,
        atomId: "a-tf-strip",
        prompt:
          'Why does orders["state"].strip() fail while orders["state"].str.strip() works?',
        options: [
          { id: "a", text: "strip() is deprecated" },
          { id: "b", text: "A Series has no strip method — the string methods live behind .str" },
          { id: "c", text: "The column is numeric" },
          { id: "d", text: "You need to import a module" },
        ],
        correct: "b",
        explanation:
          "strip belongs to a single string. To apply it to every value in a column you go through the .str accessor. Forgetting .str is the commonest error in pandas text cleaning.",
        whyWrong: {
          a: "It is current — it just belongs to strings, not to Series.",
          c: "It is a text column; that is why .str applies at all.",
          d: "Nothing extra needs importing.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "l76-type-conversion": {
    lessonId: "l76-type-conversion",
    passMark: 70,
    questions: [
      {
        id: "q76-1",
        type: "mcq",
        difficulty: 3,
        atomId: "a-tf-coerce",
        prompt:
          'Three amounts — 45000, "62 000", 38000 — converted with to_numeric(errors="coerce") then summed give ₦83,000. What happened to the ₦62,000?',
        options: [
          { id: "a", text: "It was rounded away" },
          { id: "b", text: "coerce could not parse it, made it NaN, and sum() skipped it" },
          { id: "c", text: "It raised an error that was suppressed" },
          { id: "d", text: "It was added twice elsewhere" },
        ],
        correct: "b",
        explanation:
          "errors=\"coerce\" converts anything unparseable to NaN, and sum() ignores NaN. So 43% of the revenue disappeared with no error at all. Always follow coerce with isna().sum().",
        whyWrong: {
          a: "Nothing was rounded. The value was discarded entirely.",
          c: "coerce prevents the error rather than suppressing one — and that is why it is dangerous.",
          d: "It appears nowhere in the result.",
        },
      },
      {
        id: "q76-2",
        type: "mcq",
        difficulty: 3,
        atomId: "a-tf-strip-astype",
        prompt:
          "The same three amounts, cleaned with .str.replace(' ', '').astype(int), sum to ₦145,000. Which approach is right?",
        options: [
          { id: "a", text: "coerce — it never errors" },
          { id: "b", text: "Strip then convert, because the value is repaired rather than discarded" },
          { id: "c", text: "Either; the difference is cosmetic" },
          { id: "d", text: "Neither; the column is unusable" },
        ],
        correct: "b",
        explanation:
          "₦145,000 is the true total. Strip first whenever you know what is wrong with the values; reach for coerce only when you are still finding out, and then count the NaNs it created.",
        whyWrong: {
          a: "Never erroring is the flaw — it silently lost ₦62,000.",
          c: "₦62,000 of ₦145,000 is not cosmetic.",
          d: "One space is trivially repairable.",
        },
      },
      {
        id: "q76-3",
        type: "mcq",
        difficulty: 2,
        atomId: "a-tf-check-after",
        prompt:
          "Which single check would have caught the coerce problem?",
        options: [
          { id: "a", text: "df.columns" },
          { id: "b", text: "Comparing the sum against a total you already trust, or counting the NaNs coerce created" },
          { id: "c", text: "df.shape" },
          { id: "d", text: "Nothing could catch it" },
        ],
        correct: "b",
        explanation:
          "The row count is unchanged and the column names are fine — only the total moved. This is the Grand Total habit from Month 2 in its fourth tool, and here it was worth ₦62,000.",
        whyWrong: {
          a: "The names were never in question.",
          c: "coerce changes values, not the number of rows.",
          d: "isna().sum() reports exactly one NaN, immediately.",
        },
      },
      {
        id: "q76-4",
        type: "mcq",
        difficulty: 2,
        atomId: "a-tf-rename",
        prompt:
          "You call df.rename(columns={...}) and the column names are unchanged. Why?",
        options: [
          { id: "a", text: "The dictionary is wrong" },
          { id: "b", text: "rename returns a copy — you have to assign it back" },
          { id: "c", text: "rename only works on the index" },
          { id: "d", text: "You need inplace=True, which is required" },
        ],
        correct: "b",
        explanation:
          "The same copy trap as sort_values. Write df = df.rename(...), or chain it. Most pandas methods leave the original untouched and hand you a new object.",
        whyWrong: {
          a: "A wrong key is silently ignored, but here nothing changed at all.",
          c: "It renames columns when given columns=.",
          d: "inplace exists but is discouraged; assignment is the clearer habit.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "l77-groupby": {
    lessonId: "l77-groupby",
    passMark: 70,
    questions: [
      {
        id: "q77-1",
        type: "mcq",
        difficulty: 2,
        atomId: "a-tf-groupby",
        prompt:
          "groupby('state')['amount'].sum() is the equivalent of what you learned in Month 2?",
        options: [
          { id: "a", text: "A VLOOKUP" },
          { id: "b", text: "A pivot table with State in Rows and Amount in Values" },
          { id: "c", text: "Conditional formatting" },
          { id: "d", text: "A slicer" },
        ],
        correct: "b",
        explanation:
          "Split the rows into groups, aggregate each, combine the results — exactly what dragging State into Rows did. And unlike the pivot, the line does not change when there are three hundred states instead of three.",
        whyWrong: {
          a: "That is merge, which joins two tables on a key.",
          c: "Formatting has nothing to do with aggregation.",
          d: "A slicer filters; groupby aggregates.",
        },
      },
      {
        id: "q77-2",
        type: "mcq",
        difficulty: 3,
        atomId: "a-tf-groupby-sort",
        prompt:
          "Your groupby output reads Abuja, Kano, Lagos. Why that order?",
        options: [
          { id: "a", text: "By revenue, largest first" },
          { id: "b", text: "Alphabetically by group name — groupby sorts by the key, not by the value" },
          { id: "c", text: "The order they appear in the data" },
          { id: "d", text: "Randomly" },
        ],
        correct: "b",
        explanation:
          "Alphabetical by default, which is rarely what a reader wants. Chain .sort_values(ascending=False) to turn it into a ranking — the same discipline as sorting a bar chart.",
        whyWrong: {
          a: "By revenue it would be Abuja ₦160,000, Lagos ₦139,000, Kano ₦51,000 — a different order.",
          c: "Lagos appears first in the data but third in the output.",
          d: "It is deterministic and sorted.",
        },
      },
      {
        id: "q77-3",
        type: "mcq",
        difficulty: 3,
        atomId: "a-tf-agg",
        prompt:
          "agg gives Abuja ₦160,000 from 2 orders and Lagos ₦139,000 from 3. What is the finding?",
        options: [
          { id: "a", text: "Lagos is the stronger state" },
          { id: "b", text: "Abuja leads on revenue AND on order size — ₦80,000 against ₦46,333 per order" },
          { id: "c", text: "The data is wrong" },
          { id: "d", text: "They are equivalent" },
        ],
        correct: "b",
        explanation:
          "160,000 ÷ 2 = 80,000 and 139,000 ÷ 3 = 46,333. Abuja does more business from fewer, larger orders — which is the kind of reversal the dashboard module insisted on reporting alongside the total.",
        whyWrong: {
          a: "Lagos has more orders and less revenue.",
          c: "Both totals reconcile to ₦350,000 with Kano.",
          d: "The totals and the averages both differ substantially.",
        },
      },
      {
        id: "q77-4",
        type: "mcq",
        difficulty: 3,
        atomId: "a-tf-pivot-table",
        prompt:
          "In pivot_table(index=..., columns=..., values=..., aggfunc=...), which argument corresponds to a pivot table's Rows area?",
        options: [
          { id: "a", text: "columns=" },
          { id: "b", text: "index=" },
          { id: "c", text: "values=" },
          { id: "d", text: "aggfunc=" },
        ],
        correct: "b",
        explanation:
          "index is Rows, columns is Columns, values is Values and aggfunc is the Summarise-by choice. The names changed once more; the idea has not changed since lesson 26.",
        whyWrong: {
          a: "columns= is the Columns area, across the top.",
          c: "values= is the Values area — the numbers in the body.",
          d: "aggfunc chooses Sum or Count, not an axis.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "l78-merging": {
    lessonId: "l78-merging",
    passMark: 70,
    questions: [
      {
        id: "q78-1",
        type: "mcq",
        difficulty: 3,
        atomId: "a-tf-merge-blowup",
        prompt:
          "Two orders totalling ₦107,000 are merged against a lookup table that lists Lagos twice. The result has 3 rows and totals ₦152,000. What happened?",
        options: [
          { id: "a", text: "merge added a row of test data" },
          { id: "b", text: "The Lagos order matched two lookup rows, so it was duplicated and its ₦45,000 counted twice" },
          { id: "c", text: "A rounding error" },
          { id: "d", text: "The amounts were converted wrongly" },
        ],
        correct: "b",
        explanation:
          "A duplicated key on the right duplicates every matching row on the left. Revenue rose 42% with no error — this is the many-to-many relationship from the modelling module, with a number attached. Guard it with validate=\"m:1\".",
        whyWrong: {
          a: "merge invents nothing; it repeated an existing row.",
          c: "₦45,000 is not a rounding error.",
          d: "The amounts are untouched; one of them simply appears twice.",
        },
      },
      {
        id: "q78-2",
        type: "mcq",
        difficulty: 3,
        atomId: "a-tf-merge-missing",
        prompt:
          "Six orders, a lookup table missing Kano. A left join gives 6 rows and an inner join gives 5. Which is safer and why?",
        options: [
          { id: "a", text: "Inner — it removes incomplete rows" },
          { id: "b", text: "Left — it keeps the order and shows the problem as NaN, where inner silently drops ₦51,000" },
          { id: "c", text: "They are equivalent" },
          { id: "d", text: "Neither; use an outer join" },
        ],
        correct: "b",
        explanation:
          "A left join is the (Blank) row: visible, countable, actionable. An inner join hides the same problem by removing the row, and the only clue is a row count you might not have checked.",
        whyWrong: {
          a: "Removing them loses real revenue and the evidence that anything was missing.",
          c: "One keeps six rows and the other five. That is ₦51,000 of difference.",
          d: "An outer join would also add unmatched lookup rows, which is rarely what you want here.",
        },
      },
      {
        id: "q78-3",
        type: "mcq",
        difficulty: 2,
        atomId: "a-tf-indicator",
        prompt:
          "What does indicator=True add to a merge?",
        options: [
          { id: "a", text: "A progress bar" },
          { id: "b", text: "A _merge column saying whether each row matched both sides, the left only, or the right only" },
          { id: "c", text: "Validation that raises on a bad join" },
          { id: "d", text: "An index" },
        ],
        correct: "b",
        explanation:
          "value_counts on that column is a complete join audit in one line — five matched, one left_only, nothing unused on the right. Run it on any merge you do not fully trust.",
        whyWrong: {
          a: "It reports nothing about progress.",
          c: "That is validate=, which is a different and complementary argument.",
          d: "The index is unaffected.",
        },
      },
      {
        id: "q78-4",
        type: "mcq",
        difficulty: 3,
        atomId: "a-tf-merge",
        prompt:
          "What is the single most useful signal that a merge has gone wrong?",
        options: [
          { id: "a", text: "An error message" },
          { id: "b", text: "The row count grew — a merge against a dimension should never add rows" },
          { id: "c", text: "The column order changed" },
          { id: "d", text: "It ran slowly" },
        ],
        correct: "b",
        explanation:
          "A many-to-one merge should leave the row count unchanged. If len() goes up, the right-hand key is not unique, and every total is now inflated. Check len() before and after, every time.",
        whyWrong: {
          a: "The dangerous merges do not error. That is why they are dangerous.",
          c: "Column order is cosmetic.",
          d: "Speed says nothing about correctness.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "l79-reshaping": {
    lessonId: "l79-reshaping",
    passMark: 70,
    questions: [
      {
        id: "q79-1",
        type: "mcq",
        difficulty: 3,
        atomId: "a-tf-melt",
        prompt:
          "melt turns a 3-row, 4-column table into 9 rows and 3 columns, and the total stays at ₦480,000. What has changed?",
        options: [
          { id: "a", text: "Data was duplicated" },
          { id: "b", text: "Only the shape — month is now a VALUE rather than a column heading, so it can be grouped and charted" },
          { id: "c", text: "Data was lost" },
          { id: "d", text: "The amounts were recalculated" },
        ],
        correct: "b",
        explanation:
          "Reshaping never loses or invents data — the preserved total proves it. What changed is that the three month columns became one month column with three values, which is the shape every groupby, chart and join wants.",
        whyWrong: {
          a: "Nine rows hold the same nine numbers that were in nine cells.",
          c: "The total is identical, so nothing was dropped.",
          d: "Every value is unchanged.",
        },
      },
      {
        id: "q79-2",
        type: "mcq",
        difficulty: 3,
        atomId: "a-tf-melt",
        prompt:
          "Why name id_vars (the columns to keep) rather than listing the month columns to melt?",
        options: [
          { id: "a", text: "It is shorter to type" },
          { id: "b", text: "An April column arriving next month is melted automatically instead of being left behind" },
          { id: "c", text: "melt requires id_vars" },
          { id: "d", text: "It produces fewer rows" },
        ],
        correct: "b",
        explanation:
          "The same defensive choice as Unpivot OTHER Columns in Power Query, and as Remove Other Columns. Name what stays, and anything new is handled by default.",
        whyWrong: {
          a: "Typing length is not the reason, though it often is shorter.",
          c: "You can specify value_vars instead — it is just the riskier option.",
          d: "Both produce the same rows from the same input. The difference appears when the input changes.",
        },
      },
      {
        id: "q79-3",
        type: "mcq",
        difficulty: 2,
        atomId: "a-tf-pivot-back",
        prompt:
          "When do you want long (melted) data rather than wide?",
        options: [
          { id: "a", text: "When a manager is going to read it" },
          { id: "b", text: "For groupby, merges, charts and models — long is the shape code wants" },
          { id: "c", text: "Never; wide is always better" },
          { id: "d", text: "Only for very large datasets" },
        ],
        correct: "b",
        explanation:
          "Long is for machines, wide is for humans. If an operation feels impossibly awkward you are usually in the wrong shape — reshape first and the awkwardness disappears.",
        whyWrong: {
          a: "A manager wants wide: one row per entity, periods across the top.",
          c: "Almost every pandas operation is easier on long data.",
          d: "Size is irrelevant; the operation decides.",
        },
      },
      {
        id: "q79-4",
        type: "mcq",
        difficulty: 3,
        atomId: "a-tf-checklist",
        prompt:
          "Why must cleaning come before grouping?",
        options: [
          { id: "a", text: "pandas requires that order" },
          { id: "b", text: "Grouping an uncleaned column produces a five-row summary for a three-state business, with a correct-looking total" },
          { id: "c", text: "It is faster" },
          { id: "d", text: "It does not matter" },
        ],
        correct: "b",
        explanation:
          'groupby treats "Lagos", "lagos" and " Lagos" as three groups. The total still reconciles, which makes the table convincing — the most dangerous kind of wrong, and the same step-order lesson as Power Query.',
        whyWrong: {
          a: "pandas will happily group dirty data. Nothing enforces the order.",
          c: "Speed is not the argument; correctness is.",
          d: "It changes the number of rows in your answer.",
        },
      },
    ],
  },
};
