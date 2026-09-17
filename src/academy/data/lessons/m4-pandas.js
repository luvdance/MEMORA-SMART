/**
 * MODULE · NUMPY & PANDAS (m4-pandas)
 * Month 4 — Python & Capstone
 *
 * Where Python stops being a toy and starts replacing the spreadsheet. A
 * DataFrame is a worksheet you can program, and almost every idea in this
 * module has a direct ancestor in Months 2 and 3 — which is deliberate, and
 * pointed out each time.
 *
 * LIVE PRACTICE
 * Every code atom here is RUNNABLE. Pressing "Run this for real" loads Pyodide
 * — CPython compiled to WebAssembly — and runs the learner's own edited code,
 * pandas included, with no install. Nothing downloads until they press it, the
 * data cost is stated first, and a Colab link sits beside it for anyone on
 * mobile data. Verified working in a browser: pandas loads in about twelve
 * seconds on a warm CDN and is cached for the rest of the session.
 *
 * EVERY OUTPUT BELOW WAS PRODUCED BY RUNNING THE CODE, against pandas 3.0.5.
 * The content validator re-runs all of them on each build. Two version notes
 * that matter:
 *   · pandas 3.x reports a text column's dtype as `str`; pandas 2.x said
 *     `object`. The lesson says so rather than pretending otherwise.
 *   · Pyodide currently ships pandas 3.0.2, a patch behind the local 3.0.5.
 *     No output used here differs between them.
 *
 * THE RUNNING DATASET — six orders, so every printed DataFrame fits on a phone
 * screen and every total can be checked by hand:
 *   amounts 45,000 · 62,000 · 38,000 · 51,000 · 56,000 · 98,000  =  350,000
 *   Lagos 3 orders · Abuja 2 · Kano 1
 *
 * CLIENT-SAFE. Knowledge-check answers live in lib/academy/assessments/.
 */

export const SECTION_ID = "s15-pandas";

/**
 * Written inline in every snippet rather than loaded from a file, so a learner
 * can paste any block straight into Colab and have it work unchanged.
 */
const SETUP = `import pandas as pd

orders = pd.DataFrame({
    "order": ["ORD-1", "ORD-2", "ORD-3", "ORD-4", "ORD-5", "ORD-6"],
    "state": ["Lagos", "Abuja", "Lagos", "Kano", "Lagos", "Abuja"],
    "category": ["Electronics", "Groceries", "Groceries", "Electronics", "Fashion", "Fashion"],
    "amount": [45000, 62000, 38000, 51000, 56000, 98000],
    "units": [3, 12, 9, 2, 5, 6],
})
`;

const PANDAS = ["pandas"];

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════ */
  {
    id: "l69-why-numpy",
    moduleId: "m4-pandas",
    sectionId: SECTION_ID,
    order: 1,
    title: "Why NumPy Exists",
    subtitle: "Doing arithmetic to a whole column at once",
    estimatedMinutes: 15,
    intro:
      "Last module you added up a list with a loop. That works, and it is the wrong tool for a million rows. NumPy is the answer, and understanding why it exists is what makes pandas make sense.",

    atoms: [
      {
        id: "a-np-arrays",
        title: "An array does arithmetic to every element at once",
        explain:
          "A NumPy array looks like a list, but multiplying it by 2 multiplies every element. No loop, one line, and it runs in compiled C rather than Python.",
        code: {
          code: 'import numpy as np\n\namounts = np.array([45000, 62000, 38000, 51000])\nprint(amounts * 2)\nprint(amounts.sum())\nprint(amounts.mean())\n',
          expectedOutput: "[ 90000 124000  76000 102000]\n196000\n49000.0",
          runnable: true,
          packages: PANDAS,
        },
        why: "This is fill-down, as a language feature. In Excel you dragged a formula down a column; here you write the operation once and it applies to the whole column — and unlike the drag, it does not get slower at a million rows.",
        table: {
          caption: "The vocabulary, translated.",
          headers: ["Excel", "NumPy"],
          rows: [
            ["A column of values", "An array"],
            ["Fill a formula down", "One operation on the array"],
            ["=SUM(B:B)", "amounts.sum()"],
            ["=AVERAGE(B:B)", "amounts.mean()"],
            ["=MAX(B:B)", "amounts.max()"],
          ],
          note: "Note mean() printed 49000.0 — a float, because dividing always produces one. That is the lesson-67 surprise again.",
        },
      },
      {
        id: "a-np-vs-loop",
        title: "The same job, with and without a loop",
        explain:
          "Multiplying two lists together needs a loop and an index. Two arrays multiply elementwise in one expression. The result is identical; the second is shorter, faster and much harder to get wrong.",
        codeExercise: {
          code: 'prices = [1200, 800, 450]\nquantities = [500, 320, 210]\n\n# A plain list needs a loop\ntotals = []\nfor i in range(len(prices)):\n    totals.append(prices[i] * quantities[i])\nprint(totals)\n\nimport numpy as np\np = np.array(prices)\nq = np.array(quantities)\nprint(p * q)\n',
          question:
            "Both halves compute line totals — price times quantity for three products. What are the two lines of output?",
          expectedOutput: "[600000, 256000, 94500]\n[600000 256000  94500]",
          runnable: true,
          packages: PANDAS,
          hint: "1200×500, 800×320, 450×210. The values are the same both times; look carefully at the PUNCTUATION between them.",
          successMessage:
            "The same three numbers — but the list prints with commas and the array without them. That is how you tell a Python list from a NumPy array at a glance in your output, and it is worth knowing when you are debugging.",
        },
        why: "Everything pandas does rests on this. A DataFrame column IS an array, which is why you can multiply two columns together without writing a loop over the rows.",
      },
      {
        id: "a-np-when",
        title: "When you will actually touch NumPy",
        explain:
          "Mostly you will not, directly. pandas is built on it and exposes what you need. NumPy surfaces for np.nan — the marker for a missing value — and for the occasional numeric helper.",
        why: "Beginners are told to learn NumPy first and spend a week on array reshaping they never use. Learn what it is and why pandas needs it, then move on. np.nan is the one piece you will use constantly.",
        table: {
          caption: "What you need from NumPy, in practice.",
          headers: ["Thing", "Used for", "How often"],
          rows: [
            ["np.nan", "Marking a missing value", "Constantly"],
            ["np.array", "Understanding what a column is", "Rarely, directly"],
            ["Elementwise arithmetic", "Every column calculation", "Always, via pandas"],
            ["Reshaping and broadcasting", "Machine learning, images", "Not in this course"],
          ],
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  {
    id: "l70-series-and-dataframes",
    moduleId: "m4-pandas",
    sectionId: SECTION_ID,
    order: 2,
    title: "Series and DataFrames",
    subtitle: "A column, and a worksheet you can program",
    estimatedMinutes: 16,
    intro:
      "Two objects carry the whole of pandas. A Series is one labelled column. A DataFrame is a collection of them sharing an index — which is to say, a worksheet.",

    atoms: [
      {
        id: "a-pd-series",
        title: "A Series is a column with labels",
        explain:
          "Values plus an index. You look items up by label rather than position, and the whole-column methods from NumPy still work.",
        code: {
          code: 'import pandas as pd\n\nrevenue = pd.Series([276000, 215000, 127000], index=["Lagos", "Abuja", "Kano"])\nprint(revenue)\nprint(revenue["Lagos"])\nprint(revenue.sum())\n',
          expectedOutput:
            "Lagos    276000\nAbuja    215000\nKano     127000\ndtype: int64\n276000\n618000",
          runnable: true,
          packages: PANDAS,
        },
        why: "This is the Python dictionary from lesson 65 with arithmetic attached — and ₦618,000 is the same grand total the pivot table, the data model and the plain-Python dictionary all produced. Four tools, one answer.",
      },
      {
        id: "a-pd-dataframe",
        title: "A DataFrame is rows and columns",
        explain:
          "Build one from a dictionary: each key becomes a column name, each list becomes that column's values. Printing it shows the index down the left, exactly like row numbers in Excel.",
        code: {
          code: SETUP + "\nprint(orders)\n",
          expectedOutput:
            "   order  state     category  amount  units\n" +
            "0  ORD-1  Lagos  Electronics   45000      3\n" +
            "1  ORD-2  Abuja    Groceries   62000     12\n" +
            "2  ORD-3  Lagos    Groceries   38000      9\n" +
            "3  ORD-4   Kano  Electronics   51000      2\n" +
            "4  ORD-5  Lagos      Fashion   56000      5\n" +
            "5  ORD-6  Abuja      Fashion   98000      6",
          runnable: true,
          packages: PANDAS,
        },
        why: "That leftmost column of 0 to 5 is the index, and it is not a data column — it is pandas' row label. Excel starts its row numbers at 1; pandas starts at 0, which is the zero-based counting from lesson 65 showing up again.",
        table: {
          caption: "The vocabulary, translated once more.",
          headers: ["Excel", "Power BI", "pandas"],
          rows: [
            ["A worksheet of data", "A table", "A DataFrame"],
            ["A column", "A field", "A Series"],
            ["Row numbers", "—", "The index"],
            ["A header row", "Column names", "df.columns"],
          ],
        },
      },
      {
        id: "a-pd-shape",
        title: "shape and columns — the first two things to check",
        explain:
          "shape gives (rows, columns) as a pair. columns lists the names. These are the first two lines you type after loading any file.",
        codeExercise: {
          code: SETUP + "\nprint(orders.shape)\nprint(list(orders.columns))\n",
          question:
            "The DataFrame above has six orders with five fields each. What do these two lines print?",
          expectedOutput:
            "(6, 5)\n['order', 'state', 'category', 'amount', 'units']",
          runnable: true,
          packages: PANDAS,
          hint: "shape prints a pair in brackets — rows first, then columns. Count the keys in the dictionary for the second line.",
          successMessage:
            "(6, 5) — six rows, five columns. This is the profiling habit from lesson 21 in a new tool: check the row count against what the source claimed BEFORE you analyse anything.",
        },
      },
      {
        id: "a-pd-head-dtypes",
        title: "head() and dtypes — look before you calculate",
        explain:
          "head(n) shows the first n rows so you can see the data rather than imagine it. dtypes reports what type pandas decided each column is — and that decision is where the trouble lives.",
        code: {
          code: SETUP + "\nprint(orders.head(3))\nprint(orders.dtypes)\n",
          expectedOutput:
            "   order  state     category  amount  units\n" +
            "0  ORD-1  Lagos  Electronics   45000      3\n" +
            "1  ORD-2  Abuja    Groceries   62000     12\n" +
            "2  ORD-3  Lagos    Groceries   38000      9\n" +
            "order         str\n" +
            "state         str\n" +
            "category      str\n" +
            "amount      int64\n" +
            "units       int64\n" +
            "dtype: object",
          runnable: true,
          packages: PANDAS,
        },
        why: "dtypes is the pandas version of the Power Query type check and of ISNUMBER. amount is int64 here, which means it will add up. Had it said str, every total would be wrong in the way the next lesson demonstrates.",
        table: {
          caption: "Reading the dtypes.",
          headers: ["dtype", "Means", "Note"],
          rows: [
            ["int64", "Whole numbers", "Will add up correctly"],
            ["float64", "Decimals", "Also what a column with NaN becomes"],
            ["str", "Text — pandas 3.x", "pandas 2.x printed `object` instead"],
            ["datetime64", "Real dates", "Needed for grouping by month"],
            ["bool", "True/False", "The result of a comparison"],
          ],
          note: "If you are following an older tutorial and see `object` where this says `str`, nothing is wrong — pandas 3 renamed how it reports text columns.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  {
    id: "l71-reading-files",
    moduleId: "m4-pandas",
    sectionId: SECTION_ID,
    order: 3,
    title: "Reading Real Files",
    subtitle: "CSV, Excel, and the silent type disaster",
    estimatedMinutes: 17,
    intro:
      "Everything so far was typed by hand. Real work starts with a file, and the single most important thing to check on loading one is whether your numbers arrived as numbers.",

    atoms: [
      {
        id: "a-pd-read-csv",
        title: "read_csv and read_excel",
        explain:
          "One line loads a file into a DataFrame. read_csv for text files, read_excel for workbooks. Both return something you check with shape, head and dtypes before doing anything else.",
        code: {
          code:
            'import pandas as pd\nimport io\n\ncsv_text = """order,state,amount\nORD-1,Lagos,45000\nORD-2,Abuja,62000\nORD-3,Lagos,38000\n"""\n\norders = pd.read_csv(io.StringIO(csv_text))\nprint(orders.shape)\nprint(orders["amount"].sum())\n',
          expectedOutput: "(3, 3)\n145000",
          runnable: true,
          packages: PANDAS,
        },
        why: "The CSV is written inline here so the snippet runs anywhere, including in the browser above. From a real file it is one argument: pd.read_csv(\"orders.csv\"), or pd.read_excel(\"orders.xlsx\", sheet_name=\"Orders\").",
        syntax: {
          pattern:
            'pd.read_csv("orders.csv")\npd.read_excel("orders.xlsx", sheet_name="Orders")',
          args: [
            ["the path", "Where the file is. A bare name means the folder the notebook is in."],
            ["sheet_name", "Which worksheet. Omit it and you get the first one.", "optional"],
            ["dtype={...}", "Force a column's type on load — dtype={'phone': str} keeps leading zeros.", "optional"],
            ["thousands=','", "Read 1,200 as a number instead of text.", "optional"],
          ],
          returns: "A DataFrame.",
          note: "In Colab, upload the file with the folder icon in the sidebar first, or read it straight from Google Drive. A path from your own laptop means nothing to a notebook running in the cloud.",
        },
      },
      {
        id: "a-pd-text-disaster",
        title: "When a number column loads as text",
        explain:
          "One value with a space, a comma or a naira sign makes the whole column text. pandas does not error. It does something much worse.",
        codeExercise: {
          code:
            'import pandas as pd\nimport io\n\ncsv_text = """order,amount\nORD-1,45000\nORD-2,62 000\nORD-3,38000\n"""\n\ndf = pd.read_csv(io.StringIO(csv_text))\nprint(df["amount"].dtype)\nprint(df["amount"].sum())\n',
          question:
            'The second amount is written "62 000" — with a space. What do these two lines print? Think carefully about the second one.',
          expectedOutput: "str\n4500062 00038000",
          runnable: true,
          packages: PANDAS,
          hint: "The space makes the column text. Now ask what + does to two pieces of text in Python — it does not add them.",
          successMessage:
            "The dtype is str, and .sum() CONCATENATED the three values into 4500062 00038000. No error, no warning, and a number that looks like a total. This is the numbers-stored-as-text problem from Month 2 at its most dangerous — Excel quietly excluded such values, and pandas quietly glues them together.",
        },
        why: "Check dtypes on every load, every time. It takes one line and it is the difference between a total and a forty-thousand-character string that will be pasted into a report by somebody in a hurry.",
        table: {
          caption: "Fixing it, in order of preference.",
          headers: ["Approach", "Code", "When"],
          rows: [
            ["Tell the reader up front", 'pd.read_csv(f, thousands=",")', "Commas as separators"],
            ["Strip then convert", 'df["amount"].str.replace(" ", "").astype(int)', "Spaces or symbols"],
            ["Coerce and inspect", 'pd.to_numeric(df["amount"], errors="coerce")', "Unknown junk — bad values become NaN"],
            ["Fix the source", "—", "Best of all, when you can"],
          ],
          note: "errors=\"coerce\" is the pandas equivalent of IFERROR: anything unconvertible becomes NaN, which you can then count.",
        },
      },
      {
        id: "a-pd-describe",
        title: "describe() — the profile in one line",
        explain:
          "describe() returns count, mean, standard deviation, min, the three quartiles and max for a numeric column. It is the whole of lesson 21's profiling, in one call.",
        code: {
          code: SETUP + '\nprint(orders["amount"].describe())\n',
          expectedOutput:
            "count        6.000000\n" +
            "mean     58333.333333\n" +
            "std      21153.407921\n" +
            "min      38000.000000\n" +
            "25%      46500.000000\n" +
            "50%      53500.000000\n" +
            "75%      60500.000000\n" +
            "max      98000.000000\n" +
            "Name: amount, dtype: float64",
          runnable: true,
          packages: PANDAS,
        },
        why: "Every number the exploratory module taught you to compute by hand, at once. The 25% and 75% rows are Q1 and Q3, so the IQR is 60,500 − 46,500 = 14,000 and the upper fence is 60,500 + 21,000 = 81,500 — which flags the ₦98,000 order, exactly as the rule did in Excel.",
        table: {
          caption: "Reading it against Month 2.",
          headers: ["Row", "Value", "In lesson 22 and 23 this was"],
          rows: [
            ["count", "6", "COUNT — how many contributed"],
            ["mean", "58,333.33", "AVERAGE"],
            ["std", "21,153.41", "STDEV.S"],
            ["50%", "53,500", "MEDIAN"],
            ["25% / 75%", "46,500 / 60,500", "QUARTILE.INC 1 and 3"],
            ["max", "98,000", "MAX — and above the fence"],
          ],
          note: "count is 6, so nothing is missing here. When count is lower than the row count you have found missing values without looking for them.",
        },
      },
      {
        id: "a-pd-missing",
        title: "Missing values, and count against len",
        explain:
          "A missing number is NaN. isna().sum() counts them, count() counts only the real values, and len() counts every row. The gap between the last two is your missing-data count.",
        codeExercise: {
          code:
            'import pandas as pd\nimport numpy as np\n\nratings = pd.DataFrame({\n    "order": ["ORD-1", "ORD-2", "ORD-3", "ORD-4"],\n    "rating": [4, np.nan, 5, 3],\n})\nprint(ratings["rating"].isna().sum())\nprint(ratings["rating"].count())\nprint(ratings["rating"].mean())\nprint(len(ratings))\n',
          question:
            "Four orders, one with no rating. What do these four lines print?",
          expectedOutput: "1\n3\n4.0\n4",
          runnable: true,
          packages: PANDAS,
          hint: "One value is missing. count() ignores it; len() does not. For the mean, average only the ratings that exist: 4, 5 and 3.",
          successMessage:
            "count() says 3 and len() says 4 — that gap is the missing rating. And mean() is 4.0, the average of the three real ratings, because NaN is skipped rather than treated as zero. This is exactly COUNT versus COUNTA, and exactly the blank-versus-zero rule from Month 2.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  {
    id: "l72-selecting",
    moduleId: "m4-pandas",
    sectionId: SECTION_ID,
    order: 4,
    title: "Selecting Columns and Rows",
    subtitle: "Square brackets, and the difference between one and many",
    estimatedMinutes: 16,
    intro:
      "Getting at part of a DataFrame is most of what you will do. There are three notations and each has a job — knowing which is which removes most of the confusion beginners have with pandas.",

    atoms: [
      {
        id: "a-pd-one-column",
        title: "One column is a Series, and Series have methods",
        explain:
          "df[\"amount\"] gives you that column as a Series. Every aggregation you know then hangs off it with a dot.",
        code: {
          code: SETUP + '\nprint(orders["amount"].sum())\nprint(orders["amount"].mean())\nprint(orders["amount"].max())\n',
          expectedOutput: "350000\n58333.333333333336\n98000",
          runnable: true,
          packages: PANDAS,
        },
        why: "₦350,000 across six orders. Note the mean prints its full floating-point tail — 58333.333333333336. For a report, wrap it: round(orders[\"amount\"].mean(), 2), or format it in an f-string.",
        table: {
          caption: "One column against several.",
          headers: ["Written as", "Gives you", "Brackets"],
          rows: [
            ['orders["amount"]', "A Series — one column", "Single"],
            ['orders[["state", "amount"]]', "A DataFrame — two columns", "DOUBLE"],
          ],
          note: "The double brackets catch everyone once. The inner pair is a LIST of column names; the outer pair is the selection.",
        },
      },
      {
        id: "a-pd-filter",
        title: "Filtering rows with a condition",
        explain:
          "Put a comparison inside the brackets and you get back only the rows where it is true. The condition produces a column of True and False, and pandas keeps the True ones.",
        codeExercise: {
          code: SETUP + '\nlarge = orders[orders["amount"] > 50000]\nprint(large)\nprint(len(large))\n',
          question:
            "Which orders survive a filter of amount greater than 50,000, and how many are there? Note what happens to the index.",
          expectedOutput:
            "   order  state     category  amount  units\n" +
            "1  ORD-2  Abuja    Groceries   62000     12\n" +
            "3  ORD-4   Kano  Electronics   51000      2\n" +
            "4  ORD-5  Lagos      Fashion   56000      5\n" +
            "5  ORD-6  Abuja      Fashion   98000      6\n" +
            "4",
          runnable: true,
          packages: PANDAS,
          hint: "Four of the six clear 50,000. The index numbers come along unchanged — they are row labels, not positions.",
          successMessage:
            "Four rows, and look at the index: 1, 3, 4, 5. The original labels came with them, so there is no row 0 or 2 any more. That is pandas keeping the identity of each row, and it is why .iloc and .loc are different things.",
        },
        why: "This is SUMIFS' filter step and Power Query's Filter Rows, as one expression. And unlike both, the result is a DataFrame you can immediately filter again, sort, or total.",
      },
      {
        id: "a-pd-two-conditions",
        title: "Two conditions, and the brackets that are not optional",
        explain:
          "Combine conditions with & for and, | for or. Each condition must be wrapped in its own round brackets, because & binds tighter than the comparisons do.",
        codeExercise: {
          code: SETUP + '\nlagos_large = orders[(orders["state"] == "Lagos") & (orders["amount"] > 40000)]\nprint(lagos_large[["order", "amount"]])\nprint(len(lagos_large))\n',
          question:
            "Lagos orders over ₦40,000. Lagos has three orders: 45,000, 38,000 and 56,000. Which qualify?",
          expectedOutput:
            "   order  amount\n0  ORD-1   45000\n4  ORD-5   56000\n2",
          runnable: true,
          packages: PANDAS,
          hint: "Two of the three Lagos orders are above 40,000. ORD-3 at 38,000 is not.",
          successMessage:
            "Two orders. This is COUNTIFS with two criteria — and the round brackets around each condition are mandatory: leave them out and pandas raises a confusing error about ambiguous truth values.",
        },
        table: {
          caption: "Combining conditions.",
          headers: ["Operator", "Means", "In Excel"],
          rows: [
            ["&", "and — both must be true", "COUNTIFS' multiple criteria"],
            ["|", "or — either may be true", "No direct equivalent"],
            ["~", "not — invert the condition", "<>"],
            [".isin([...])", "matches any of a list", "OR of several equals"],
          ],
          note: "Use `and`/`or` between two single values, and `&`/`|` between two COLUMNS. Mixing them up is the other half of the ambiguous-truth-value error.",
        },
      },
      {
        id: "a-pd-loc-iloc",
        title: "loc and iloc — by label, and by position",
        explain:
          "loc selects by LABEL — the index value and the column name. iloc selects by POSITION — the nth row, the nth column. After a filter they stop agreeing, which is the whole reason both exist.",
        code: {
          code: SETUP + '\nprint(orders.loc[0, "state"])\nprint(orders.iloc[0]["state"])\nprint(orders.loc[orders["state"] == "Kano", "amount"].sum())\n',
          expectedOutput: "Lagos\nLagos\n51000",
          runnable: true,
          packages: PANDAS,
        },
        why: "On an untouched DataFrame, label 0 and position 0 are the same row, so the first two lines agree. Filter the frame first and they will not — the surviving rows keep their original labels while their positions start again from zero.",
        table: {
          caption: "Which to reach for.",
          headers: ["You want", "Use"],
          rows: [
            ["The row labelled 3", "df.loc[3]"],
            ["The fourth row, whatever its label", "df.iloc[3]"],
            ["A value at a known label and column", 'df.loc[3, "amount"]'],
            ["Rows matching a condition, one column", 'df.loc[condition, "amount"]'],
            ["The first five rows for a glance", "df.head()"],
          ],
          note: "The fourth row of that table is the form worth memorising: df.loc[condition, \"column\"] filters and selects in one step, and reads almost like a sentence.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  {
    id: "l73-sorting-counting",
    moduleId: "m4-pandas",
    sectionId: SECTION_ID,
    order: 5,
    title: "Sorting, Counting and New Columns",
    subtitle: "Ranking, frequencies, and calculating across a column",
    estimatedMinutes: 16,
    intro:
      "Three more everyday operations, each with a direct ancestor in the Excel months: sorting to rank, counting to find frequencies, and adding a calculated column.",

    atoms: [
      {
        id: "a-pd-sort",
        title: "sort_values — ranking, without RANK",
        explain:
          "sort_values(column) orders the rows. ascending=False puts the largest first. The index comes along, so you can still see which original row each was.",
        code: {
          code: SETUP + '\nprint(orders.sort_values("amount", ascending=False)[["order", "amount"]])\n',
          expectedOutput:
            "   order  amount\n" +
            "5  ORD-6   98000\n" +
            "1  ORD-2   62000\n" +
            "4  ORD-5   56000\n" +
            "3  ORD-4   51000\n" +
            "0  ORD-1   45000\n" +
            "2  ORD-3   38000",
          runnable: true,
          packages: PANDAS,
        },
        why: "Sorting descending and taking the top rows replaces RANK.EQ and LARGE for most purposes. And the scrambled index — 5, 1, 4, 3, 0, 2 — is the ranking: those are the original row labels in their new order.",
        mistake:
          "Expecting sort_values to change the DataFrame. It returns a sorted COPY and leaves the original alone. Assign it to a name, or the sort appears to have done nothing.",
      },
      {
        id: "a-pd-value-counts",
        title: "value_counts and nunique",
        explain:
          "value_counts() counts how many times each value appears, largest first. nunique() counts how many different values there are.",
        codeExercise: {
          code: SETUP + '\nprint(orders["state"].value_counts())\nprint(orders["state"].nunique())\n',
          question:
            "Six orders across three states — Lagos three times, Abuja twice, Kano once. What does this print? Include every line pandas produces.",
          expectedOutput:
            "state\nLagos    3\nAbuja    2\nKano     1\nName: count, dtype: int64\n3",
          runnable: true,
          packages: PANDAS,
          hint: "pandas labels the output: the column name on top, and a Name/dtype line at the bottom. Counts come largest first.",
          successMessage:
            "value_counts() is COUNTIF for every value at once, sorted — and it is the fastest way to profile a text column. nunique() is DISTINCTCOUNT. Note the header and footer lines pandas adds; they are part of what printing a Series looks like.",
        },
      },
      {
        id: "a-pd-new-column",
        title: "Adding a calculated column",
        explain:
          "Assign to a column name that does not exist yet and pandas creates it. Two columns divided give a new column, computed for every row at once.",
        code: {
          code: SETUP + '\norders["price_per_unit"] = orders["amount"] / orders["units"]\nprint(orders[["order", "amount", "units", "price_per_unit"]].round(0))\n',
          expectedOutput:
            "   order  amount  units  price_per_unit\n" +
            "0  ORD-1   45000      3         15000.0\n" +
            "1  ORD-2   62000     12          5167.0\n" +
            "2  ORD-3   38000      9          4222.0\n" +
            "3  ORD-4   51000      2         25500.0\n" +
            "4  ORD-5   56000      5         11200.0\n" +
            "5  ORD-6   98000      6         16333.0",
          runnable: true,
          packages: PANDAS,
        },
        why: "This is the DAX calculated column, and the Power Query custom column, in one line. Note the spread: ₦4,222 to ₦25,500 per unit — a sixfold range, which is why units told us nothing about order value in the visualisation module.",
        mistake:
          "Writing df.price_per_unit = ... with a dot. That quietly creates an attribute rather than a column, and the column never appears. Always use square brackets to create one.",
      },
      {
        id: "a-pd-chaining",
        title: "Chaining — filter, sort, select, in one expression",
        explain:
          "Each operation returns a DataFrame, so they can be strung together. Wrap the whole thing in round brackets and put each step on its own line, and it reads like a recipe.",
        codeExercise: {
          code: SETUP + '\nanswer = (\n    orders[orders["amount"] > 40000]\n    .sort_values("amount", ascending=False)\n    .head(3)\n    [["order", "state", "amount"]]\n)\nprint(answer)\n',
          question:
            "Filter to orders over ₦40,000, sort largest first, take the top three, show three columns. What prints?",
          expectedOutput:
            "   order  state  amount\n" +
            "5  ORD-6  Abuja   98000\n" +
            "1  ORD-2  Abuja   62000\n" +
            "4  ORD-5  Lagos   56000",
          runnable: true,
          packages: PANDAS,
          hint: "Five orders clear 40,000. Sorted descending, the top three are 98,000, 62,000 and 56,000.",
          successMessage:
            "Three lines of output from four chained steps — and the top two are both Abuja, which is the same finding the pivot table produced in Month 2. This is Power Query's Applied Steps written as one expression, and the round brackets are what let you put each step on its own line.",
        },
        why: "Chaining keeps the intermediate results out of your variables, so there is no half-cleaned dataframe lying around to use by mistake. Read it top to bottom like the Applied Steps list it is.",
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  {
    id: "l74-pandas-habits",
    moduleId: "m4-pandas",
    sectionId: SECTION_ID,
    order: 6,
    title: "Habits That Save Hours",
    subtitle: "The checks, the traps, and running code live",
    estimatedMinutes: 15,
    intro:
      "Six lessons of pandas leaves you able to load a file and interrogate it. This last one is the routine to run every time, and the two traps that cost beginners the most time.",

    atoms: [
      {
        id: "a-pd-load-routine",
        title: "The four lines to type after every load",
        explain:
          "shape, head, dtypes, describe. In that order, every time, before any analysis. It takes fifteen seconds and it is the profiling habit from lesson 21 expressed in pandas.",
        code: {
          code: SETUP + '\nprint(orders.shape)\nprint(list(orders.columns))\nprint(orders["amount"].sum())\n',
          expectedOutput: "(6, 5)\n['order', 'state', 'category', 'amount', 'units']\n350000",
          runnable: true,
          packages: PANDAS,
        },
        table: {
          caption: "The routine, and what each line catches.",
          headers: ["Line", "Catches"],
          rows: [
            ["df.shape", "A partial load, or more rows than expected"],
            ["df.head()", "A header row read as data, or shifted columns"],
            ["df.dtypes", "Numbers loaded as text — the expensive one"],
            ["df.describe()", "Impossible values, and missing data via count"],
            ["df.isna().sum()", "Exactly how much is missing, per column"],
          ],
          note: "Compare the total against a figure you already trust, exactly as you did with a pivot table's Grand Total. If ₦350,000 matches the finance system, almost nothing else can be badly wrong.",
        },
      },
      {
        id: "a-pd-copy-trap",
        title: "The two traps",
        explain:
          "Most pandas operations return a COPY and leave the original untouched. And a filtered DataFrame keeps its original index, so position and label stop agreeing.",
        why: "Between them these account for most of the time beginners lose. A sort that appears not to work, and an .iloc[0] that returns the wrong row, are the same misunderstanding seen from two directions.",
        table: {
          caption: "What bites, and what to do.",
          headers: ["Symptom", "Cause", "Fix"],
          rows: [
            ["The sort did nothing", "sort_values returned a copy", "Assign it: df = df.sort_values(...)"],
            [".iloc[0] is the wrong row", "The index survived a filter", "Use .loc for labels, or reset_index(drop=True)"],
            ["A new column never appeared", "You used dot notation", 'Use df["name"] = ...'],
            ["A SettingWithCopy warning", "Editing a slice of another frame", "Take an explicit .copy() first"],
          ],
          note: "reset_index(drop=True) after a filter renumbers the rows from zero and throws the old labels away. Do it when you no longer care which original rows these were.",
        },
        mistake:
          "Chasing a SettingWithCopyWarning by adding .copy() everywhere. Read it first — it is usually telling you that you filtered a frame and then edited the result, and the fix is to do the filtering and the editing in one step.",
      },
      {
        id: "a-pd-run-live",
        title: "Run it yourself, and change something",
        explain:
          "Every code block in this module has a Run button. Press it, then break the code on purpose — misspell a column name, remove a bracket, change a threshold — and read what pandas says.",
        codeExercise: {
          code: SETUP + '\n# Change the 50000 below and run it again.\nbig = orders[orders["amount"] > 50000]\nprint(len(big))\nprint(big["amount"].sum())\n',
          question:
            "As written, with a threshold of 50,000: how many orders qualify and what do they total?",
          expectedOutput: "4\n267000",
          runnable: true,
          packages: PANDAS,
          hint: "62,000 + 51,000 + 56,000 + 98,000. Four orders clear the threshold.",
          successMessage:
            "Four orders totalling ₦267,000 of the ₦350,000 — so 76% of revenue comes from the four largest orders. Now press Run and change the threshold to 60000, then to 0, and watch both numbers move. Changing a number and re-running is the fastest way to build intuition there is.",
        },
        why: "Reading code teaches you what it does. Breaking it teaches you what the errors mean, which is the skill you will actually lean on. The runtime is cached after the first load, so every run after that is immediate.",
      },
      {
        id: "a-pd-whats-next",
        title: "What pandas does that you have not seen yet",
        explain:
          "You can now load, inspect, filter, sort and calculate. Still to come: grouping many rows into summaries, joining two tables, and reshaping — which are the pivot table, the relationship and Unpivot respectively.",
        table: {
          caption: "The map from here.",
          headers: ["pandas", "You already know it as", "Module"],
          rows: [
            ["groupby", "A pivot table", "Next module"],
            ["merge", "VLOOKUP, or a relationship", "Next module"],
            ["pivot_table", "A pivot table, literally", "Next module"],
            ["melt", "Unpivot in Power Query", "Next module"],
            ["plot", "Charts, from the visualisation module", "Module after"],
          ],
          note: "Every row is something you have already understood conceptually in another tool. That is why Python comes fourth in this course rather than first — you are learning syntax now, not ideas.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },
];
