/**
 * ASSESSMENTS · NUMPY & PANDAS (m4-pandas)
 *
 * SERVER ONLY. See m1-data-foundations.js for the contract and writing style.
 *
 * pandas is easy to assess as API trivia — "which method sorts?" — which tests
 * documentation recall. Every question here describes code that runs and
 * produces something wrong or surprising, because that is what pandas actually
 * does to beginners: it rarely errors, and it will happily concatenate your
 * revenue column into a string.
 *
 * Every figure was produced by running the code against pandas 3.0.5, and the
 * content validator re-runs all of it on each build.
 *   six orders · ₦350,000 total · Lagos 3, Abuja 2, Kano 1
 */

export const ASSESSMENTS = {
  /* ═══════════════════════════════════════════════════════════════════ */
  "l69-why-numpy": {
    lessonId: "l69-why-numpy",
    passMark: 70,
    questions: [
      {
        id: "q69-1",
        type: "mcq",
        difficulty: 2,
        atomId: "a-np-arrays",
        prompt:
          "amounts is a NumPy array of four values. What does amounts * 2 do?",
        options: [
          { id: "a", text: "Raises an error — you cannot multiply an array" },
          { id: "b", text: "Doubles every element, with no loop" },
          { id: "c", text: "Repeats the array twice, making eight elements" },
          { id: "d", text: "Doubles only the first element" },
        ],
        correct: "b",
        explanation:
          "Arithmetic on an array applies to every element at once. This is fill-down as a language feature — one operation covering the whole column, and it does not get slower at a million rows.",
        whyWrong: {
          a: "Elementwise arithmetic is the whole point of an array.",
          c: "That is what * 2 does to a plain Python LIST — a real difference worth knowing.",
          d: "Nothing about the syntax singles out one element.",
        },
      },
      {
        id: "q69-2",
        type: "mcq",
        difficulty: 3,
        atomId: "a-np-vs-loop",
        prompt:
          "A list prints as [600000, 256000, 94500] and an array of the same values prints as [600000 256000  94500]. What is the difference?",
        options: [
          { id: "a", text: "The array has lost precision" },
          { id: "b", text: "Only the punctuation — the array prints without commas, which is how you tell the two apart in your output" },
          { id: "c", text: "The array is sorted" },
          { id: "d", text: "The array has different values" },
        ],
        correct: "b",
        explanation:
          "Identical values, different display. Spotting whether your output has commas tells you immediately whether you are holding a list or an array, which matters when a method you expected is missing.",
        whyWrong: {
          a: "The values are identical integers.",
          c: "Both are in the original order.",
          d: "Read them again — 600000, 256000, 94500 in both.",
        },
      },
      {
        id: "q69-3",
        type: "mcq",
        difficulty: 2,
        atomId: "a-np-when",
        prompt:
          "How much NumPy do you need before starting pandas?",
        options: [
          { id: "a", text: "All of it — reshaping, broadcasting, linear algebra" },
          { id: "b", text: "What an array is, why elementwise arithmetic matters, and np.nan" },
          { id: "c", text: "None at all" },
          { id: "d", text: "Only the random number functions" },
        ],
        correct: "b",
        explanation:
          "pandas is built on NumPy and exposes what you need. Beginners routinely lose a week to array reshaping they never use. np.nan is the one piece you will reach for constantly.",
        whyWrong: {
          a: "Reshaping and linear algebra matter for machine learning, not for this course.",
          c: "You need np.nan for missing values and the array concept to understand what a column is.",
          d: "Random numbers are for simulation, not data analysis of real files.",
        },
      },
      {
        id: "q69-4",
        type: "mcq",
        difficulty: 3,
        atomId: "a-np-arrays",
        prompt:
          "amounts.mean() on four whole numbers prints 49000.0 rather than 49000. Why the decimal point?",
        options: [
          { id: "a", text: "A precision error" },
          { id: "b", text: "Division always produces a float, even when it divides evenly" },
          { id: "c", text: "mean() rounds up" },
          { id: "d", text: "The array holds decimals" },
        ],
        correct: "b",
        explanation:
          "196,000 ÷ 4 is exactly 49,000, but the result is still a float. It is the same surprise as lesson 67, and it is why report figures get wrapped in round() or formatted in an f-string.",
        whyWrong: {
          a: "The value is exact. Only its type shows the decimal point.",
          c: "Nothing was rounded — the division came out even.",
          d: "All four values are integers.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "l70-series-and-dataframes": {
    lessonId: "l70-series-and-dataframes",
    passMark: 70,
    questions: [
      {
        id: "q70-1",
        type: "mcq",
        difficulty: 2,
        atomId: "a-pd-dataframe",
        prompt:
          "When you print a DataFrame, the leftmost column shows 0, 1, 2, 3, 4, 5. What is it?",
        options: [
          { id: "a", text: "A data column called 'id'" },
          { id: "b", text: "The index — pandas' row labels, which start at 0 rather than 1" },
          { id: "c", text: "The order the rows were sorted into" },
          { id: "d", text: "A bug in the printing" },
        ],
        correct: "b",
        explanation:
          "The index is a row label, not data, and it counts from zero — the same zero-based counting as a Python list. Excel numbers its rows from 1, which is why this looks off by one at first.",
        whyWrong: {
          a: "It is not in df.columns, because it is not a column.",
          c: "It is the original row order here; nothing has been sorted.",
          d: "Every printed DataFrame shows its index. It is deliberate.",
        },
      },
      {
        id: "q70-2",
        type: "mcq",
        difficulty: 3,
        atomId: "a-pd-shape",
        prompt:
          "df.shape returns (6, 5). Which is which?",
        options: [
          { id: "a", text: "6 columns and 5 rows" },
          { id: "b", text: "6 rows and 5 columns" },
          { id: "c", text: "6 values in 5 groups" },
          { id: "d", text: "The file size" },
        ],
        correct: "b",
        explanation:
          "Rows first, then columns. Checking this against what the source claimed is the profiling habit from lesson 21, and it catches a partial load before anything is built on it.",
        whyWrong: {
          a: "The order is rows then columns, not the reverse.",
          c: "shape describes dimensions, not groupings.",
          d: "shape says nothing about bytes.",
        },
      },
      {
        id: "q70-3",
        type: "mcq",
        difficulty: 3,
        atomId: "a-pd-head-dtypes",
        prompt:
          "Your amount column shows dtype str. What does that mean for df['amount'].sum()?",
        options: [
          { id: "a", text: "It will total correctly" },
          { id: "b", text: "It will concatenate the values into one long string rather than adding them" },
          { id: "c", text: "It will raise a TypeError" },
          { id: "d", text: "It will return 0" },
        ],
        correct: "b",
        explanation:
          "This is pandas at its most dangerous. + on text joins it, so sum() glues the values together and returns something that looks like an enormous number. No error, no warning — which is why dtypes is checked on every load.",
        whyWrong: {
          a: "A text column cannot add up. That is the entire problem.",
          c: "A TypeError would at least tell you. pandas concatenates silently instead.",
          d: "It returns a long string, not zero.",
        },
      },
      {
        id: "q70-4",
        type: "mcq",
        difficulty: 2,
        atomId: "a-pd-head-dtypes",
        prompt:
          "An older tutorial shows a text column's dtype as `object`, but yours says `str`. What is wrong?",
        options: [
          { id: "a", text: "Your data is different" },
          { id: "b", text: "Nothing — pandas 3 renamed how it reports text columns; 2.x said object" },
          { id: "c", text: "Your install is broken" },
          { id: "d", text: "The tutorial is wrong" },
        ],
        correct: "b",
        explanation:
          "A version difference, not an error. It is worth knowing so you do not spend an afternoon debugging a working column because a tutorial from 2023 printed a different word.",
        whyWrong: {
          a: "The same text column reports differently between pandas versions.",
          c: "Both spellings are correct for their version.",
          d: "It was right for pandas 2.x, which is what it was written against.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "l71-reading-files": {
    lessonId: "l71-reading-files",
    passMark: 70,
    questions: [
      {
        id: "q71-1",
        type: "mcq",
        difficulty: 3,
        atomId: "a-pd-text-disaster",
        prompt:
          'A CSV holds 45000, "62 000" and 38000 in one column. df["amount"].sum() prints 4500062 00038000. What happened?',
        options: [
          { id: "a", text: "pandas added them wrongly" },
          { id: "b", text: "The space made the column text, so sum() concatenated the three values instead of adding them" },
          { id: "c", text: "The file is corrupt" },
          { id: "d", text: "An overflow" },
        ],
        correct: "b",
        explanation:
          "One value with a space makes the whole column text. + joins text, so sum() glued them together — and returned something that could easily be pasted into a report as a total. Check dtypes on every load.",
        whyWrong: {
          a: "It did not add them at all. It joined them.",
          c: "The file is perfectly readable; one value is simply formatted with a space.",
          d: "No arithmetic happened, so nothing could overflow.",
        },
      },
      {
        id: "q71-2",
        type: "mcq",
        difficulty: 3,
        atomId: "a-pd-missing",
        prompt:
          "For a rating column, count() returns 3 and len(df) returns 4. What does that tell you?",
        options: [
          { id: "a", text: "The DataFrame has a duplicate" },
          { id: "b", text: "One rating is missing — count() ignores NaN, len() counts every row" },
          { id: "c", text: "One rating is zero" },
          { id: "d", text: "count() is broken" },
        ],
        correct: "b",
        explanation:
          "The gap between the two is your missing-data count — exactly COUNT against COUNTA from Month 2. And mean() averages only the three real ratings, because NaN is skipped rather than treated as zero.",
        whyWrong: {
          a: "Duplicates would not change count() relative to len().",
          c: "A zero is a real value and would be counted by both.",
          d: "It is working as documented: it counts non-missing values.",
        },
      },
      {
        id: "q71-3",
        type: "mcq",
        difficulty: 2,
        atomId: "a-pd-describe",
        prompt:
          "describe() shows 25% as 46,500 and 75% as 60,500. What are these, in Month 2 terms?",
        options: [
          { id: "a", text: "Percentages of the total" },
          { id: "b", text: "Q1 and Q3 — so the IQR is 14,000 and the upper fence is 81,500" },
          { id: "c", text: "Confidence intervals" },
          { id: "d", text: "The smallest and largest values" },
        ],
        correct: "b",
        explanation:
          "They are the quartiles. 60,500 − 46,500 = 14,000, and 60,500 + 1.5 × 14,000 = 81,500 — which flags the ₦98,000 order as an outlier, exactly as the rule did in Excel.",
        whyWrong: {
          a: "They are values in naira, not shares of anything.",
          c: "describe() reports no confidence interval.",
          d: "Those are the min and max rows, 38,000 and 98,000.",
        },
      },
      {
        id: "q71-4",
        type: "mcq",
        difficulty: 3,
        atomId: "a-pd-read-csv",
        prompt:
          "You are working in Colab and pd.read_csv(\"C:/Users/me/orders.csv\") fails. Why?",
        options: [
          { id: "a", text: "read_csv cannot handle Windows paths" },
          { id: "b", text: "The notebook runs in the cloud, so a path on your own laptop means nothing to it — upload the file first" },
          { id: "c", text: "The file must be .xlsx" },
          { id: "d", text: "You need pandas 2.x" },
        ],
        correct: "b",
        explanation:
          "Colab runs on a machine somewhere else. Upload via the folder icon in the sidebar, or mount Google Drive. This trips up nearly everybody on their first real file.",
        whyWrong: {
          a: "It handles Windows paths fine — when the file is on the same machine.",
          c: "CSV is exactly what read_csv is for.",
          d: "Versions have nothing to do with where the file lives.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "l72-selecting": {
    lessonId: "l72-selecting",
    passMark: 70,
    questions: [
      {
        id: "q72-1",
        type: "mcq",
        difficulty: 2,
        atomId: "a-pd-one-column",
        prompt:
          'What is the difference between orders["amount"] and orders[["amount"]]?',
        options: [
          { id: "a", text: "Nothing" },
          { id: "b", text: "The first gives a Series — one column; the second gives a DataFrame containing one column" },
          { id: "c", text: "The second is a syntax error" },
          { id: "d", text: "The second sorts the column" },
        ],
        correct: "b",
        explanation:
          "The inner brackets are a LIST of column names. Single brackets give you a Series with all its aggregation methods; double brackets give you a DataFrame, which is what you want when selecting several columns.",
        whyWrong: {
          a: "They return different types, which behave differently.",
          c: "It is valid, and the standard way to select multiple columns.",
          d: "Neither form sorts anything.",
        },
      },
      {
        id: "q72-2",
        type: "mcq",
        difficulty: 3,
        atomId: "a-pd-filter",
        prompt:
          "After filtering six orders down to four, the index reads 1, 3, 4, 5. Why not 0, 1, 2, 3?",
        options: [
          { id: "a", text: "A bug" },
          { id: "b", text: "The surviving rows keep their ORIGINAL labels, so you can still tell which rows they were" },
          { id: "c", text: "The rows were sorted" },
          { id: "d", text: "pandas counts from 1 after a filter" },
        ],
        correct: "b",
        explanation:
          "The index is an identity, not a position. That is exactly why .loc and .iloc are different: after a filter, label 5 and position 3 are the same row. Use reset_index(drop=True) when you no longer care which rows these were.",
        whyWrong: {
          a: "Preserving labels is deliberate and useful.",
          c: "They are in their original relative order.",
          d: "pandas always counts from 0; these are surviving labels.",
        },
      },
      {
        id: "q72-3",
        type: "mcq",
        difficulty: 3,
        atomId: "a-pd-two-conditions",
        prompt:
          'Why does orders[orders["state"] == "Lagos" & orders["amount"] > 40000] fail?',
        options: [
          { id: "a", text: "& is not valid in pandas" },
          { id: "b", text: "Each condition needs its own round brackets — & binds tighter than the comparisons" },
          { id: "c", text: "You must use `and`" },
          { id: "d", text: "You cannot combine a text and a numeric condition" },
        ],
        correct: "b",
        explanation:
          "Without the brackets, Python applies & before == and > and gets nonsense. Write (cond1) & (cond2). Using `and` instead produces the same ambiguous-truth-value error, because `and` works on single values and & works on columns.",
        whyWrong: {
          a: "& is the correct operator for combining two column conditions.",
          c: "`and` is for single values. On two columns it raises the ambiguous truth value error.",
          d: "Mixing condition types is completely normal.",
        },
      },
      {
        id: "q72-4",
        type: "mcq",
        difficulty: 3,
        atomId: "a-pd-loc-iloc",
        prompt:
          "When do df.loc[0] and df.iloc[0] return different rows?",
        options: [
          { id: "a", text: "Never" },
          { id: "b", text: "Whenever the index no longer starts at 0 — after a filter or a sort" },
          { id: "c", text: "Only on large DataFrames" },
          { id: "d", text: "Only with text columns" },
        ],
        correct: "b",
        explanation:
          "loc asks for the row LABELLED 0; iloc asks for the FIRST row. On an untouched frame they are the same row. Filter or sort and they part company, which is the source of a great many wrong answers.",
        whyWrong: {
          a: "They agree only while the index happens to match the positions.",
          c: "Size is irrelevant; the index is what matters.",
          d: "Column types have nothing to do with it.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "l73-sorting-counting": {
    lessonId: "l73-sorting-counting",
    passMark: 70,
    questions: [
      {
        id: "q73-1",
        type: "mcq",
        difficulty: 3,
        atomId: "a-pd-sort",
        prompt:
          "You call df.sort_values('amount') and then print df. It is unsorted. Why?",
        options: [
          { id: "a", text: "You need ascending=True" },
          { id: "b", text: "sort_values returns a sorted COPY and leaves the original alone — assign the result" },
          { id: "c", text: "The column is text" },
          { id: "d", text: "You must sort the index first" },
        ],
        correct: "b",
        explanation:
          "Most pandas operations return a new object rather than changing the one you called them on. Write df = df.sort_values(...) — or use the result directly in a chain.",
        whyWrong: {
          a: "Ascending is already the default, and it would still return a copy.",
          c: "Text columns sort too, alphabetically.",
          d: "Sorting by a column does not require sorting the index.",
        },
      },
      {
        id: "q73-2",
        type: "mcq",
        difficulty: 2,
        atomId: "a-pd-value-counts",
        prompt:
          "What is value_counts() the equivalent of?",
        options: [
          { id: "a", text: "SUMIFS" },
          { id: "b", text: "COUNTIF run for every distinct value at once, sorted largest first" },
          { id: "c", text: "AVERAGE" },
          { id: "d", text: "VLOOKUP" },
        ],
        correct: "b",
        explanation:
          "It is the fastest way to profile a text column: every value and how often it appears, in one call. nunique() beside it is DISTINCTCOUNT.",
        whyWrong: {
          a: "SUMIFS totals a different column; value_counts only counts occurrences.",
          c: "No averaging is involved.",
          d: "VLOOKUP matches one value to a row in another table.",
        },
      },
      {
        id: "q73-3",
        type: "mcq",
        difficulty: 3,
        atomId: "a-pd-new-column",
        prompt:
          "You write df.price_per_unit = df['amount'] / df['units'] and the column never appears. Why?",
        options: [
          { id: "a", text: "The division failed" },
          { id: "b", text: "Dot notation creates an attribute, not a column — you must use df['price_per_unit'] = ..." },
          { id: "c", text: "You cannot divide two columns" },
          { id: "d", text: "The column name is too long" },
        ],
        correct: "b",
        explanation:
          "Assignment by dot quietly attaches something to the object without adding a column, so nothing errors and nothing appears. Always use square brackets to create a column.",
        whyWrong: {
          a: "The division works; the assignment is what does not.",
          c: "Dividing two columns is elementwise and completely normal.",
          d: "Length is not a constraint.",
        },
      },
      {
        id: "q73-4",
        type: "mcq",
        difficulty: 3,
        atomId: "a-pd-chaining",
        prompt:
          "Why wrap a chained pandas expression in round brackets?",
        options: [
          { id: "a", text: "It makes it run faster" },
          { id: "b", text: "It lets each step sit on its own line, so the chain reads like Power Query's Applied Steps" },
          { id: "c", text: "pandas requires it" },
          { id: "d", text: "It prevents copies" },
        ],
        correct: "b",
        explanation:
          "Purely readability, and it is worth a lot of it. Without the brackets a multi-line chain needs backslashes; with them it reads top to bottom as an ordered recipe.",
        whyWrong: {
          a: "Performance is identical.",
          c: "A chain on one long line works fine, just unreadably.",
          d: "Each step still returns a new object either way.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "l74-pandas-habits": {
    lessonId: "l74-pandas-habits",
    passMark: 70,
    questions: [
      {
        id: "q74-1",
        type: "mcq",
        difficulty: 2,
        atomId: "a-pd-load-routine",
        prompt:
          "Which check after loading a file is most likely to catch an expensive error?",
        options: [
          { id: "a", text: "df.columns" },
          { id: "b", text: "df.dtypes, because a numeric column loaded as text produces a wrong total with no warning" },
          { id: "c", text: "df.index" },
          { id: "d", text: "len(df)" },
        ],
        correct: "b",
        explanation:
          "Every other check catches something visible. A text column that should be numeric produces a total that looks plausible and is wrong — or, with sum(), a concatenated string. It is one line and it is the one that pays.",
        whyWrong: {
          a: "Useful, but a wrong column name is obvious immediately.",
          c: "The index is rarely the source of a wrong number after a load.",
          d: "Worth checking, and a wrong row count is easier to notice than a wrong type.",
        },
      },
      {
        id: "q74-2",
        type: "mcq",
        difficulty: 3,
        atomId: "a-pd-copy-trap",
        prompt:
          "After filtering, df.iloc[0] returns a row you did not expect. What is the cause and the fix?",
        options: [
          { id: "a", text: "iloc is unreliable; use loc always" },
          { id: "b", text: "The index survived the filter — use .loc for labels, or reset_index(drop=True) to renumber" },
          { id: "c", text: "The DataFrame is corrupt" },
          { id: "d", text: "You need to sort first" },
        ],
        correct: "b",
        explanation:
          "iloc returned the first row by POSITION, which after a filter is not the row labelled 0. Decide which you mean: loc for identity, iloc for position, or reset the index when the old labels no longer matter.",
        whyWrong: {
          a: "iloc did exactly what it promises. The confusion is about which you wanted.",
          c: "Nothing is corrupt; the labels were preserved deliberately.",
          d: "Sorting would change the positions again without addressing the confusion.",
        },
      },
      {
        id: "q74-3",
        type: "mcq",
        difficulty: 3,
        atomId: "a-pd-run-live",
        prompt:
          "Four of six orders are above ₦50,000 and total ₦267,000 of ₦350,000. What is the finding?",
        options: [
          { id: "a", text: "Nothing — it is just a filter" },
          { id: "b", text: "76% of revenue comes from four orders, so the business depends on a handful of large sales" },
          { id: "c", text: "The data is wrong" },
          { id: "d", text: "Two orders should be removed" },
        ],
        correct: "b",
        explanation:
          "267,000 ÷ 350,000 is about 76%. Concentration like that is worth reporting: losing one large customer matters far more than losing one small one, and that is a business risk rather than a number.",
        whyWrong: {
          a: "A filter that reveals revenue concentration is a finding, not a mechanic.",
          c: "Nothing indicates bad data. Concentration is common and real.",
          d: "Small orders are real revenue and belong in the totals.",
        },
      },
      {
        id: "q74-4",
        type: "mcq",
        difficulty: 2,
        atomId: "a-pd-whats-next",
        prompt:
          "pandas' groupby is the equivalent of what you already know as…",
        options: [
          { id: "a", text: "VLOOKUP" },
          { id: "b", text: "A pivot table" },
          { id: "c", text: "Conditional formatting" },
          { id: "d", text: "A slicer" },
        ],
        correct: "b",
        explanation:
          "groupby collapses many rows into one summary per group, which is precisely what a pivot table does with Rows and Values. merge is the VLOOKUP equivalent, and melt is Unpivot.",
        whyWrong: {
          a: "That is merge — joining two tables on a key.",
          c: "Formatting has no pandas equivalent in this sense.",
          d: "A slicer filters; groupby aggregates.",
        },
      },
    ],
  },
};
