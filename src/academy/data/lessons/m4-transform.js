/**
 * MODULE · CLEANING, GROUPING & JOINING (m4-transform)
 * Month 4 — Python & Capstone
 *
 * The module summary is the promise: "everything you did in Excel, now in ten
 * lines of reproducible code." Every idea here has been taught twice already —
 * once with clicks in Power Query, once with field wells in Power BI — so this
 * module is about syntax and about three specific ways pandas loses money for
 * you quietly.
 *
 * THREE SILENT FAILURES, EACH WITH A NUMBER ATTACHED
 * The whole module is built around them, because they produce no error and a
 * plausible answer:
 *   · fillna(0) on ratings drops the mean from 4.17 to 3.57
 *   · to_numeric(errors="coerce") turns "62 000" into NaN, and sum() then
 *     silently omits ₦62,000 — ₦83,000 instead of ₦145,000
 *   · a duplicated key in the lookup table turns 2 rows into 3 and inflates
 *     revenue from ₦107,000 to ₦152,000
 * Each of those numbers was produced by running the code, not estimated.
 *
 * LIVE PRACTICE: every code atom is runnable in the browser.
 *
 * VERIFIED against pandas 3.0.5. The content validator re-runs all of it.
 *
 * CLIENT-SAFE. Knowledge-check answers live in lib/academy/assessments/.
 */

export const SECTION_ID = "s16-transform";

/**
 * The messy export — the same planted flaws as the Month 2 capstone, so the
 * learner meets problems they already know how to reason about.
 *   " Abuja" leading space · "lagos" lowercase · ORD-3 twice · one missing rating
 */
const RAW = `import pandas as pd
import numpy as np

orders = pd.DataFrame({
    "order":  ["ORD-1", "ORD-2", "ORD-3", "ORD-4", "ORD-3", "ORD-5", "ORD-6"],
    "state":  ["Lagos", " Abuja", "lagos", "Kano", "lagos", "Lagos", "Abuja"],
    "amount": [45000, 62000, 38000, 51000, 38000, 56000, 98000],
    "rating": [4, 5, 4, np.nan, 4, 3, 5],
})
`;

/** The clean six-order frame from the previous module. Total ₦350,000. */
const CLEAN = `import pandas as pd

orders = pd.DataFrame({
    "order":    ["ORD-1", "ORD-2", "ORD-3", "ORD-4", "ORD-5", "ORD-6"],
    "state":    ["Lagos", "Abuja", "Lagos", "Kano", "Lagos", "Abuja"],
    "category": ["Electronics", "Groceries", "Groceries", "Electronics", "Fashion", "Fashion"],
    "amount":   [45000, 62000, 38000, 51000, 56000, 98000],
    "units":    [3, 12, 9, 2, 5, 6],
})
`;

const PANDAS = ["pandas"];

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════ */
  {
    id: "l75-missing-and-duplicates",
    moduleId: "m4-transform",
    sectionId: SECTION_ID,
    order: 1,
    title: "Missing Values and Duplicates",
    subtitle: "Finding the mess before you build on it",
    estimatedMinutes: 17,
    intro:
      "A seven-row export with four planted problems. You have met all four before — in Power Query and in the Month 2 project — so this is about finding them in pandas and about one decision that costs you 0.6 of a rating point.",

    atoms: [
      {
        id: "a-tf-profile",
        title: "Profile first, in four lines",
        explain:
          "shape for the row count, value_counts to see a text column's real contents, isna().sum() for missing values, duplicated().sum() for repeats. Before anything else, every time.",
        codeExercise: {
          code: RAW + '\nprint(orders.shape)\nprint(orders["state"].value_counts())\nprint(orders["rating"].isna().sum())\nprint(orders["order"].duplicated().sum())\n',
          question:
            "Seven rows, and the state column contains Lagos, \" Abuja\", lagos, Kano, lagos, Lagos, Abuja. How many DISTINCT values does value_counts report, and what are the last two numbers?",
          expectedOutput:
            "(7, 4)\n" +
            "state\n" +
            "Lagos     2\n" +
            "lagos     2\n" +
            " Abuja    1\n" +
            "Kano      1\n" +
            "Abuja     1\n" +
            "Name: count, dtype: int64\n" +
            "1\n" +
            "1",
          runnable: true,
          packages: PANDAS,
          hint: 'Count them exactly as written — "Lagos" and "lagos" are different strings, and so are " Abuja" and "Abuja". Then one missing rating and one duplicated order id.',
          successMessage:
            "FIVE distinct values for three real states. value_counts is the fastest data-quality check in pandas precisely because it shows you the strings as they really are, spaces and capitals included — this is the Power Query step-order lesson made visible in one call.",
        },
        why: "Every one of those five values would become its own row in a groupby. Report revenue by state now and you get a five-row table for a three-state business, and the total will still be right, which is what makes it convincing.",
      },
      {
        id: "a-tf-strip",
        title: "Cleaning text with .str",
        explain:
          "A text column's methods live behind .str — so .str.strip() trims every value and .str.title() capitalises every value. They chain, exactly as they did on a single string.",
        code: {
          code: RAW + '\norders["state"] = orders["state"].str.strip().str.title()\nprint(orders["state"].value_counts())\nprint(orders["state"].nunique())\n',
          expectedOutput:
            "state\nLagos    4\nAbuja    2\nKano     1\nName: count, dtype: int64\n3",
          runnable: true,
          packages: PANDAS,
        },
        why: "Five values became three. One line did what Power Query's Trim and Capitalize Each Word steps did with clicks — and note that the order still matters: strip before you group, or you group the wrong things.",
        table: {
          caption: "The .str methods you will use most.",
          headers: ["pandas", "Excel", "Fixes"],
          rows: [
            [".str.strip()", "TRIM()", "Leading and trailing spaces"],
            [".str.title()", "PROPER()", "Inconsistent capitalisation"],
            [".str.lower()", "LOWER()", "Case, when you want it all flat"],
            ['.str.replace(" ", "")', "SUBSTITUTE()", "A character you do not want"],
            [".str.contains(\"Lag\")", "SEARCH()", "Finding rows by partial text"],
          ],
          note: "Forgetting the .str is the commonest error here. orders[\"state\"].strip() fails, because a Series has no strip — only its string accessor does.",
        },
        mistake:
          "Cleaning the column and not assigning it back. orders[\"state\"].str.strip() returns a cleaned copy and changes nothing; you must assign it to orders[\"state\"].",
      },
      {
        id: "a-tf-duplicates",
        title: "Duplicates, and what they do to a total",
        explain:
          "duplicated() flags repeats after the first occurrence. drop_duplicates(subset=\"order\") keeps the first of each order id and removes the rest.",
        codeExercise: {
          code: RAW + '\nprint(len(orders))\ndeduped = orders.drop_duplicates(subset="order")\nprint(len(deduped))\nprint(deduped["amount"].sum())\n',
          question:
            "ORD-3 appears twice, both times for ₦38,000. The seven raw amounts total ₦388,000. What do these three lines print?",
          expectedOutput: "7\n6\n350000",
          runnable: true,
          packages: PANDAS,
          hint: "One duplicate removed leaves six rows. Subtract the duplicated ₦38,000 from ₦388,000.",
          successMessage:
            "₦350,000 rather than ₦388,000 — the duplicate was inflating revenue by ₦38,000, about 11%. Nothing errored, and a report built on the raw frame would have been convincingly wrong.",
        },
        why: "Always deduplicate on the column that SHOULD be unique, not on all columns. Two genuinely different orders can share an amount and a state; only the order id identifies a row.",
      },
      {
        id: "a-tf-fillna-trap",
        title: "fillna(0) — the decision that changes the answer",
        explain:
          "Missing ratings are NaN. mean() skips them. fillna(0) replaces them with zero, which mean() then counts as a real score.",
        codeExercise: {
          code: RAW + '\nprint(orders["rating"].mean())\nprint(orders["rating"].fillna(0).mean())\nprint(len(orders.dropna(subset="rating")))\n',
          question:
            "Six real ratings — 4, 5, 4, 4, 3, 5 — and one missing. What are the three lines?",
          expectedOutput: "4.166666666666667\n3.5714285714285716\n6",
          runnable: true,
          packages: PANDAS,
          hint: "The first averages the six real ratings (25 ÷ 6). The second averages seven values including a zero (25 ÷ 7). The third counts the rows left after dropping the missing one.",
          successMessage:
            "4.17 becomes 3.57 — a drop of 0.6 of a rating point, caused entirely by deciding that 'we do not know' means 'zero'. This is the Month 2 blank-versus-zero rule with a number attached, and nothing on screen would tell you it happened.",
        },
        table: {
          caption: "What to do with a missing value.",
          headers: ["Option", "Code", "Claims"],
          rows: [
            ["Leave it", "(do nothing)", "We do not know — usually correct"],
            ["Drop the row", 'dropna(subset="rating")', "This order does not count at all"],
            ["Fill with zero", "fillna(0)", "The customer rated it zero — rarely true"],
            ["Fill with the mean", "fillna(df['rating'].mean())", "It was probably typical — defensible, say so"],
          ],
          note: "Only the first two are safe defaults. Filling is a claim about data you do not have, and it belongs in your data-quality note if you do it.",
        },
        mistake:
          "Using fillna(0) on a numeric column to make the output tidy. You have invented measurements, and every average built on that column is now wrong in a direction nobody can see.",
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  {
    id: "l76-type-conversion",
    moduleId: "m4-transform",
    sectionId: SECTION_ID,
    order: 2,
    title: "Type Conversion",
    subtitle: "Two ways to fix a text column, and only one keeps your money",
    estimatedMinutes: 16,
    intro:
      "A numeric column that loaded as text has to be converted. There are two standard approaches and they give different totals on the same data — which is worth ten minutes of your attention.",

    atoms: [
      {
        id: "a-tf-coerce",
        title: "to_numeric with errors=\"coerce\"",
        explain:
          "to_numeric converts a column to numbers. With errors=\"coerce\" anything unconvertible becomes NaN instead of raising. That sounds helpful, and it is — as long as you then look at what it discarded.",
        codeExercise: {
          code:
            'import pandas as pd\n\ndf = pd.DataFrame({"amount": ["45000", "62 000", "38000"]})\nprint(df["amount"].dtype)\ncleaned = pd.to_numeric(df["amount"], errors="coerce")\nprint(cleaned.tolist())\nprint(cleaned.isna().sum())\nprint(cleaned.sum())\n',
          question:
            'Three amounts, the middle one written "62 000" with a space. What do these four lines print? Pay attention to the last one.',
          expectedOutput: "str\n[45000.0, nan, 38000.0]\n1\n83000.0",
          runnable: true,
          packages: PANDAS,
          hint: "coerce cannot parse the value with the space, so it becomes NaN. Then sum() skips NaN — so add only the two it managed to convert.",
          successMessage:
            "₦83,000, not ₦145,000. coerce turned ₦62,000 into NaN and sum() silently skipped it, so 43% of the revenue vanished with no error at all. coerce is a useful tool and a dangerous default — the isna().sum() line is not optional.",
        },
        why: "errors=\"coerce\" is the pandas IFERROR, and it carries exactly the same risk: it converts a visible failure into an invisible one. Use it to FIND bad values, then fix them — not to make them go away.",
      },
      {
        id: "a-tf-strip-astype",
        title: "Strip, then convert",
        explain:
          "Remove what makes the value unparseable, then convert. The value is kept rather than discarded, which on money is almost always what you want.",
        codeExercise: {
          code:
            'import pandas as pd\n\ndf = pd.DataFrame({"amount": ["45000", "62 000", "38000"]})\nfixed = df["amount"].str.replace(" ", "").astype(int)\nprint(fixed.tolist())\nprint(fixed.sum())\n',
          question:
            "The same three amounts, cleaned a different way. What are the two lines?",
          expectedOutput: "[45000, 62000, 38000]\n145000",
          runnable: true,
          packages: PANDAS,
          hint: "Removing the space makes every value convertible, so nothing is lost.",
          successMessage:
            "₦145,000 — the correct total, and ₦62,000 more than coerce gave you. Strip first and convert second whenever you know what is wrong with the values; reach for coerce only when you do not.",
        },
        table: {
          caption: "Choosing between them.",
          headers: ["Approach", "Bad values become", "Use when"],
          rows: [
            ['.str.replace(...).astype(int)', "Correct numbers", "You know what the junk is"],
            ['to_numeric(errors="coerce")', "NaN, silently skipped", "You are finding out what the junk is"],
            ['to_numeric(errors="raise")', "An error that stops you", "Nothing should be unconvertible"],
            ['read_csv(thousands=",")', "Handled on load", "Commas are the only problem"],
          ],
          note: "errors=\"raise\" is the underrated option. If a column must be fully numeric, having pandas stop is better than having it quietly drop rows.",
        },
        mistake:
          "Reaching for coerce first because it never errors. Never erroring is the problem — run it, count the NaNs, and only then decide whether to discard or repair them.",
      },
      {
        id: "a-tf-rename",
        title: "rename — column names a reader understands",
        explain:
          "Pass a dictionary of old name to new name. Do it once, immediately after loading, and every later line reads properly.",
        code: {
          code:
            'import pandas as pd\n\ndf = pd.DataFrame({"CUST_NM_1": ["Ada"], "AMT_NGN": [45000]})\ndf = df.rename(columns={"CUST_NM_1": "customer", "AMT_NGN": "amount"})\nprint(list(df.columns))\n',
          expectedOutput: "['customer', 'amount']",
          runnable: true,
          packages: PANDAS,
        },
        why: "Source systems name columns for themselves. Renaming early means the rest of your script — and anyone reading it — deals in words from the business rather than from a database schema. It is the Power Query rename step, in one line.",
        mistake:
          "Forgetting the assignment. rename returns a copy, so df.rename(...) on its own changes nothing — the same copy trap as sort_values.",
      },
      {
        id: "a-tf-check-after",
        title: "Check after converting, not before",
        explain:
          "After any type change, re-run dtypes and re-check the total. The conversion is exactly the step most likely to lose rows, so it is exactly the step to verify.",
        why: "Both approaches above ran without complaint and produced different totals. The only thing that would have told you which you had was checking the sum against a figure you already trusted — the Grand Total habit from Month 2, once again.",
        table: {
          caption: "After every conversion.",
          headers: ["Check", "Catches"],
          rows: [
            ["df.dtypes", "A column that did not actually convert"],
            ["df[col].isna().sum()", "Values coerce turned into NaN"],
            ["df[col].sum()", "Money lost to a silent NaN"],
            ["len(df)", "Rows dropped by a dropna you forgot about"],
          ],
          note: "Four lines. ₦62,000 of the ₦145,000 in this lesson depended on running the third one.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  {
    id: "l77-groupby",
    moduleId: "m4-transform",
    sectionId: SECTION_ID,
    order: 3,
    title: "GroupBy and Aggregation",
    subtitle: "The pivot table, as one line of code",
    estimatedMinutes: 18,
    intro:
      "groupby is the pivot table. Split the rows into groups, aggregate each group, put the results back together — which is exactly what dragging State into Rows and Amount into Values did.",

    atoms: [
      {
        id: "a-tf-groupby",
        title: "Split, apply, combine",
        explain:
          "groupby(column) splits the rows by that column's values. Pick a column and an aggregation, and you get one number per group with the group name as the index.",
        codeExercise: {
          code: CLEAN + '\nprint(orders.groupby("state")["amount"].sum())\n',
          question:
            "Six orders: Lagos has 45,000, 38,000 and 56,000; Abuja has 62,000 and 98,000; Kano has 51,000. groupby sorts the groups alphabetically. What prints?",
          expectedOutput:
            "state\nAbuja    160000\nKano      51000\nLagos    139000\nName: amount, dtype: int64",
          runnable: true,
          packages: PANDAS,
          hint: "Alphabetical order means Abuja, Kano, Lagos. And pandas labels the output with the group column on top and a Name/dtype line at the bottom.",
          successMessage:
            "One line, three groups, and the same answer the pivot table gave — ₦160,000 + ₦51,000 + ₦139,000 = ₦350,000. Note that groups come out sorted by NAME, not by value, which is the opposite of what a Power BI bar chart does by default.",
        },
        table: {
          caption: "The same operation, four tools.",
          headers: ["Tool", "How"],
          rows: [
            ["Excel", '=SUMIF(states, "Lagos", amounts), per state'],
            ["Pivot table", "State into Rows, Amount into Values"],
            ["DAX", "SUM(Orders[Amount]), sliced by State"],
            ["pandas", 'groupby("state")["amount"].sum()'],
          ],
          note: "The pandas version does not grow with the number of states — three or three hundred, the line is identical.",
        },
      },
      {
        id: "a-tf-groupby-sort",
        title: "Sorting the result",
        explain:
          "groupby returns a Series indexed by group, so sort_values ranks it. Chain it on the end and you have a league table.",
        code: {
          code: CLEAN + '\nprint(orders.groupby("state")["amount"].sum().sort_values(ascending=False))\n',
          expectedOutput:
            "state\nAbuja    160000\nLagos    139000\nKano      51000\nName: amount, dtype: int64",
          runnable: true,
          packages: PANDAS,
        },
        why: "Alphabetical order is rarely what a reader wants. Sorting by value turns the output into a ranking — and it is the same discipline as sorting a bar chart, from the visualisation module.",
      },
      {
        id: "a-tf-agg",
        title: "Several aggregations at once",
        explain:
          "Pass a list of aggregation names to agg and you get a column for each. Sum, count and mean together is the summary table most questions actually need.",
        code: {
          code: CLEAN + '\nsummary = orders.groupby("state")["amount"].agg(["sum", "count", "mean"])\nprint(summary)\n',
          expectedOutput:
            "          sum  count          mean\n" +
            "state                             \n" +
            "Abuja  160000      2  80000.000000\n" +
            "Kano    51000      1  51000.000000\n" +
            "Lagos  139000      3  46333.333333",
          runnable: true,
          packages: PANDAS,
        },
        why: "This is the Month 2 finding in one line: Lagos leads on order COUNT and Abuja on order SIZE — ₦80,000 against ₦46,333 per order. Totals and averages rank these two states in opposite directions, which is exactly why the dashboard module insisted on reporting both.",
      },
      {
        id: "a-tf-named-agg",
        title: "Naming the output columns",
        explain:
          "Named aggregation gives each result column the name you want: revenue=(\"amount\", \"sum\"). The output is ready to publish rather than needing renaming afterwards.",
        codeExercise: {
          code: CLEAN + '\nsummary = orders.groupby("state").agg(\n    revenue=("amount", "sum"),\n    orders=("order", "count"),\n    avg_order=("amount", "mean"),\n)\nprint(summary)\n',
          question:
            "The same three figures per state, with columns named revenue, orders and avg_order. What prints?",
          expectedOutput:
            "       revenue  orders     avg_order\n" +
            "state                               \n" +
            "Abuja   160000       2  80000.000000\n" +
            "Kano     51000       1  51000.000000\n" +
            "Lagos   139000       3  46333.333333",
          runnable: true,
          packages: PANDAS,
          hint: "Same numbers as the last atom; only the column headings differ.",
          successMessage:
            "Column names a reader understands, decided where the calculation lives. This is the form worth defaulting to — 'sum' and 'count' as headings tell a reader nothing about what was summed.",
        },
      },
      {
        id: "a-tf-pivot-table",
        title: "Two grouping keys, and pivot_table",
        explain:
          "Group by two columns and you get a nested result. pivot_table lays the same numbers out as a grid — index down the side, columns across the top — which is literally a pivot table.",
        code: {
          code: CLEAN + '\nprint(orders.pivot_table(index="state", columns="category", values="amount", aggfunc="sum", fill_value=0))\n',
          expectedOutput:
            "category  Electronics  Fashion  Groceries\n" +
            "state                                    \n" +
            "Abuja               0    98000      62000\n" +
            "Kano            51000        0          0\n" +
            "Lagos           45000    56000      38000",
          runnable: true,
          packages: PANDAS,
        },
        why: "Compare the arguments with the pivot areas from Month 2: index is Rows, columns is Columns, values is Values, aggfunc is the Sum/Count choice. The names changed once more; the idea has not changed since lesson 26.",
        table: {
          caption: "pivot_table arguments against the pivot areas.",
          headers: ["pandas argument", "Excel pivot area"],
          rows: [
            ["index=", "Rows"],
            ["columns=", "Columns"],
            ["values=", "Values"],
            ['aggfunc="sum"', "Summarise by → Sum"],
            ["fill_value=0", "Blank cells shown as 0"],
          ],
          note: "fill_value=0 is worth thinking about: it displays a genuine absence as zero. Here Abuja sold no Electronics, so 0 is honest — but on a column where a blank means 'unknown', it is the fillna(0) mistake again.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  {
    id: "l78-merging",
    moduleId: "m4-transform",
    sectionId: SECTION_ID,
    order: 4,
    title: "Merging and Joining",
    subtitle: "VLOOKUP, the relationship, and the join that doubles your revenue",
    estimatedMinutes: 18,
    intro:
      "merge joins two tables on a shared column. It is VLOOKUP, and it is the Power BI relationship, and it has one failure mode that silently inflates every total you build on it.",

    atoms: [
      {
        id: "a-tf-merge",
        title: "merge, and how= decides what survives",
        explain:
          "Name the key column and the kind of join. how=\"left\" keeps every row of the left table; how=\"inner\" keeps only rows that matched on both sides.",
        code: {
          code: CLEAN + '\nstates = pd.DataFrame({\n    "state":  ["Lagos", "Abuja", "Kano"],\n    "region": ["South West", "North Central", "North West"],\n})\njoined = orders.merge(states, on="state", how="left")\nprint(joined[["order", "state", "region", "amount"]].head(3))\nprint(joined.groupby("region")["amount"].sum())\n',
          expectedOutput:
            "   order  state         region  amount\n" +
            "0  ORD-1  Lagos     South West   45000\n" +
            "1  ORD-2  Abuja  North Central   62000\n" +
            "2  ORD-3  Lagos     South West   38000\n" +
            "region\n" +
            "North Central    160000\n" +
            "North West        51000\n" +
            "South West       139000\n" +
            "Name: amount, dtype: int64",
          runnable: true,
          packages: PANDAS,
        },
        why: "Joining a dimension then grouping by one of its columns is the whole star schema, in two lines. The region totals match the state totals exactly, because each state maps to one region and nothing was lost.",
        syntax: {
          pattern: 'left.merge(right, on="key", how="left")',
          args: [
            ["right", "The table to bring columns from — usually the dimension."],
            ["on=", "The column both tables share. Use left_on/right_on when the names differ."],
            ['how="left"', "Keep every row of the left table. The safe default: nothing from your main table is lost."],
            ['how="inner"', "Keep only matched rows. Silently drops the unmatched ones.", "optional"],
            ["validate=", 'Refuse to merge if the shape is wrong — validate="m:1" is the one you want.', "optional"],
          ],
          returns: "One wider DataFrame.",
          note: "how=\"left\" is Power Query's Left Outer and Power BI's one-to-many read from the fact side. It is the default you want in nearly every case.",
        },
      },
      {
        id: "a-tf-merge-missing",
        title: "Unmatched keys — the (Blank) row, in pandas",
        explain:
          "If the lookup table is missing a state, a left join keeps the order and fills region with NaN. An inner join drops the order entirely, and the row count is the only clue.",
        codeExercise: {
          code: CLEAN + '\nstates = pd.DataFrame({\n    "state":  ["Lagos", "Abuja"],\n    "region": ["South West", "North Central"],\n})\nleft = orders.merge(states, on="state", how="left")\nprint(left["region"].isna().sum())\nprint(left.loc[left["region"].isna(), "order"].tolist())\ninner = orders.merge(states, on="state", how="inner")\nprint(len(orders), len(left), len(inner))\n',
          question:
            "The lookup table has no Kano. One order — ORD-4 — is from Kano. What do these three lines print?",
          expectedOutput: "1\n['ORD-4']\n6 6 5",
          runnable: true,
          packages: PANDAS,
          hint: "A left join keeps all six rows with one NaN region; an inner join keeps only the five that matched.",
          successMessage:
            "6, 6, 5 — the inner join silently dropped ORD-4 and ₦51,000 with it. This is the (Blank) row from the modelling module: a left join shows you the problem as NaN, and an inner join hides it by removing the row. Always check len() before and after a merge.",
        },
        why: "isna().sum() on the joined column is your orphan count, and the second line names the offending rows. That is the diagnosis Power BI gave you as a (Blank) row, available here as a list you can act on.",
      },
      {
        id: "a-tf-indicator",
        title: "indicator=True — see exactly what matched",
        explain:
          "Add indicator=True and pandas appends a _merge column saying whether each row came from both tables, the left only, or the right only. value_counts on it is a complete join audit.",
        code: {
          code: CLEAN + '\nstates = pd.DataFrame({"state": ["Lagos", "Abuja"], "region": ["SW", "NC"]})\ncheck = orders.merge(states, on="state", how="left", indicator=True)\nprint(check["_merge"].value_counts())\n',
          expectedOutput:
            "_merge\nboth          5\nleft_only     1\nright_only    0\nName: count, dtype: int64",
          runnable: true,
          packages: PANDAS,
        },
        why: "Five matched, one did not, and nothing in the lookup table went unused. Run this on every merge you do not fully trust — it takes one argument and it answers the only question that matters about a join.",
      },
      {
        id: "a-tf-merge-blowup",
        title: "The duplicated key that inflates your revenue",
        explain:
          "If the lookup table has the same key twice, every matching row of the left table is DUPLICATED — once per match. The row count grows and every total grows with it.",
        codeExercise: {
          code:
            'import pandas as pd\n\norders = pd.DataFrame({"order": ["ORD-1", "ORD-2"], "state": ["Lagos", "Abuja"], "amount": [45000, 62000]})\n# The dimension has Lagos TWICE — a duplicated key\nstates = pd.DataFrame({"state": ["Lagos", "Lagos", "Abuja"], "region": ["SW", "SW-dup", "NC"]})\n\njoined = orders.merge(states, on="state", how="left")\nprint(len(orders), "->", len(joined))\nprint(joined["amount"].sum())\n',
          question:
            "Two orders totalling ₦107,000, joined to a lookup table that lists Lagos twice. What are the two lines?",
          expectedOutput: "2 -> 3\n152000",
          runnable: true,
          packages: PANDAS,
          hint: "The Lagos order matches TWO rows in the lookup table, so it appears twice in the result. Add its ₦45,000 twice.",
          successMessage:
            "₦152,000 instead of ₦107,000 — the Lagos order was counted twice, inflating revenue by ₦45,000, or 42%. No error, no warning. This is exactly the many-to-many relationship the modelling module warned about, with a number attached at last.",
        },
        why: "The defence is one argument: validate=\"m:1\" tells pandas to raise rather than merge if the right-hand key is not unique. Add it to every merge against a dimension and this failure becomes impossible.",
        table: {
          caption: "Guarding a merge.",
          headers: ["Check", "What it does"],
          rows: [
            ['validate="m:1"', "Raises unless the right key is unique — use this"],
            ["len() before and after", "A growing row count means duplicated keys"],
            ["indicator=True", "Shows what matched and what did not"],
            ["right.duplicated(subset=key).sum()", "Counts the duplicates before you merge at all"],
          ],
          note: "A merge that grows the row count is almost always wrong. If len() goes up, stop and look at the right-hand table's key.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  {
    id: "l79-reshaping",
    moduleId: "m4-transform",
    sectionId: SECTION_ID,
    order: 5,
    title: "Reshaping and the Whole Pipeline",
    subtitle: "melt, and ten lines that replace an afternoon",
    estimatedMinutes: 17,
    intro:
      "One more shape change, and then the point of the whole module: the entire cleaning job as a single readable pipeline you can re-run on next month's file.",

    atoms: [
      {
        id: "a-tf-melt",
        title: "melt — Unpivot, in one line",
        explain:
          "A report with a column per month is built for a human. melt turns those columns into rows, giving one row per observation, which is the shape analysis needs.",
        codeExercise: {
          code:
            'import pandas as pd\n\nwide = pd.DataFrame({\n    "state": ["Lagos", "Abuja", "Kano"],\n    "Jan":   [60000, 40000, 30000],\n    "Feb":   [80000, 70000, 40000],\n    "Mar":   [76000, 60000, 24000],\n})\nprint(wide.shape)\nlong = wide.melt(id_vars="state", var_name="month", value_name="amount")\nprint(long.shape)\nprint(long.head(4))\nprint(long["amount"].sum())\n',
          question:
            "Three states with three month columns. What shape does melt produce, and is the total preserved?",
          expectedOutput:
            "(3, 4)\n" +
            "(9, 3)\n" +
            "   state month  amount\n" +
            "0  Lagos   Jan   60000\n" +
            "1  Abuja   Jan   40000\n" +
            "2   Kano   Jan   30000\n" +
            "3  Lagos   Feb   80000\n" +
            "480000",
          runnable: true,
          packages: PANDAS,
          hint: "Three states times three months is nine rows, and three columns: state, month, amount. Add all nine values for the total.",
          successMessage:
            "Three rows became nine, and the total is unchanged at ₦480,000 — reshaping never loses data. Now month is a VALUE rather than a column heading, so it can be grouped, filtered and charted. This is Unpivot Other Columns from Power Query, as one line.",
        },
        table: {
          caption: "The arguments.",
          headers: ["Argument", "Means", "Power Query"],
          rows: [
            ["id_vars=", "Columns to KEEP as they are", "The columns you do not unpivot"],
            ["var_name=", "What to call the new label column", "\"Attribute\", renamed"],
            ["value_name=", "What to call the new value column", "\"Value\", renamed"],
          ],
          note: "Naming id_vars rather than the columns to melt is the same defensive choice as Unpivot OTHER Columns: an April column arriving next month is melted automatically instead of being left behind.",
        },
      },
      {
        id: "a-tf-pivot-back",
        title: "Going the other way",
        explain:
          "pivot_table turns long data back into a grid. You melt to analyse and pivot to present — the same data, shaped for a different reader.",
        why: "Long is for machines and wide is for humans. Every chart, groupby and join you write wants long data; every table you hand to a manager wants wide. Knowing both directions means never being stuck with the wrong shape.",
        table: {
          caption: "Which shape for which job.",
          headers: ["Shape", "One row is", "Good for"],
          rows: [
            ["Long (melted)", "One observation", "groupby, merge, charts, models"],
            ["Wide (pivoted)", "One entity, many periods", "Reading, printing, finance packs"],
          ],
          note: "If an operation feels impossibly awkward, you are usually in the wrong shape. Reshape first and the awkwardness disappears.",
        },
      },
      {
        id: "a-tf-pipeline",
        title: "The whole job, as one pipeline",
        explain:
          "Chain the cleaning steps into one expression. Each line is a step, the order is visible, and re-running it on a new file is one keystroke.",
        codeExercise: {
          code: RAW + '\nclean = (\n    orders\n    .assign(state=orders["state"].str.strip().str.title())\n    .drop_duplicates(subset="order")\n)\nprint(len(orders), "->", len(clean))\nprint(clean.groupby("state")["amount"].sum().sort_values(ascending=False))\nprint(clean["amount"].sum())\n',
          question:
            "The messy seven-row export, cleaned and summarised in one pipeline. What are the three outputs?",
          expectedOutput:
            "7 -> 6\n" +
            "state\n" +
            "Abuja    160000\n" +
            "Lagos    139000\n" +
            "Kano      51000\n" +
            "Name: amount, dtype: int64\n" +
            "350000",
          runnable: true,
          packages: PANDAS,
          hint: "Strip and title the states, drop the duplicated order, then group and sort. The total should match the deduplicated figure from lesson 75.",
          successMessage:
            "Seven rows to six, five apparent states to three, and ₦350,000 — the same answer as the Month 2 project, from six lines that will run unchanged on next month's export. That is the whole argument for this module.",
        },
        why: ".assign() adds or replaces a column inside a chain, so the cleaning does not need an intermediate variable. Read the pipeline top to bottom: it is the Applied Steps list, in code.",
      },
      {
        id: "a-tf-checklist",
        title: "The transform checklist",
        explain:
          "Profile, clean text, deduplicate, fix types, check the total, then group or join. In that order, and verify the row count after every step that could change it.",
        why: "Every silent failure in this module was caught by checking a count or a total: the duplicate by len(), the coerce loss by sum(), the bad merge by len() again. None of them announced itself.",
        table: {
          caption: "The order, and the number that proves each step.",
          headers: ["Step", "Verify with", "This module's example"],
          rows: [
            ["Profile", "shape, value_counts, isna", "5 apparent states, 3 real"],
            ["Clean text", "nunique()", "5 → 3"],
            ["Deduplicate", "len()", "7 → 6, ₦388k → ₦350k"],
            ["Fix types", "dtypes and sum()", "₦83k coerced vs ₦145k stripped"],
            ["Merge", "len() and indicator", "2 → 3 rows, ₦107k → ₦152k"],
            ["Group", "The total, against a trusted figure", "₦350,000"],
          ],
          note: "The last row is the one that validates everything above it — the Grand Total habit from Month 2, in its fourth tool.",
        },
        mistake:
          "Grouping before cleaning. Report revenue by state on the raw frame and you get a five-row table for a three-state business, with a correct-looking total — which is the most convincing kind of wrong.",
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },
];
