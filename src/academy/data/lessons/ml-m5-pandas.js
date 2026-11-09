/**
 * MACHINE LEARNING AND AI · MODULE 5 · DATA MANIPULATION WITH PANDAS
 *
 * Curriculum 5.1 – 5.14. Series and DataFrames; reading CSV and JSON (Excel
 * explained); inspecting, selecting and filtering; sorting and ranking;
 * missing values and duplicates; type conversion; grouping, merging,
 * applying functions and exporting. The running dataset is Nigerian retail
 * sales, building up to the module project.
 *
 * pandas 3 is used throughout (copy-on-write is the default, so every
 * assignment goes through df.loc or a new column, never chained indexing).
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

export const SECTION_ID = "ml-s5-pandas";

const PY = "python";
const py = String.raw;

const SALES_CSV =
  "order_id,date,branch,product,quantity,unit_price\n" +
  "1001,2026-01-03,Lagos,Rice 50kg,4,72000\n" +
  "1002,2026-01-03,Abuja,Vegetable oil 5L,10,15500\n" +
  "1003,2026-01-04,Lagos,Sugar 1kg,25,1800\n" +
  "1004,2026-01-05,Kano,Rice 50kg,6,70500\n" +
  "1005,2026-01-05,Abuja,Rice 50kg,3,73000\n" +
  "1006,2026-01-06,Kano,Sugar 1kg,40,1750\n";

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 23 · 5.1 – 5.3
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ml-l23-pandas-intro",
    moduleId: "ml-m5-pandas",
    sectionId: SECTION_ID,
    order: 1,
    covers: ["5.1", "5.2", "5.3"],
    title: "Pandas, Series, DataFrames and Reading Files",
    subtitle: "Tables with named columns, and getting data into them",
    estimatedMinutes: 34,
    intro:
      "NumPy arrays are fast but anonymous: no column names, one type for everything. Real data has names, dates, text and numbers side by side. pandas gives you labelled tables, built on NumPy, and is where almost every ML project's code begins.",

    atoms: [
      {
        id: "a-ml-pandas-intro",
        title: "Introduction to pandas",
        explain:
          "pandas (from \"panel data\") was created by Wes McKinney in 2008 for financial analysis and is imported as pd. It adds two structures on top of NumPy: the SERIES, a 1-D array with an INDEX (labels for each value), and the DATAFRAME, a table of named columns, each column a Series sharing one index. pandas reads files, cleans, filters, groups, joins and reshapes data, then hands NumPy arrays to scikit-learn with df.to_numpy(). Think of a DataFrame as a spreadsheet you control with code: every step is recorded, repeatable and fast on millions of rows.",
        codeExercise: {
          language: PY,
          code: py`import pandas as pd

prices = pd.Series({"rice": 72000, "oil": 15500, "sugar": 1800})
print(prices["oil"])
print(prices.index.tolist())
print(prices[prices > 10000].to_dict())
print(prices.mean())
`,
          question: "A Series is a labelled array. What does it print?",
          expectedOutput: "15500\n['rice', 'oil', 'sugar']\n{'rice': 72000, 'oil': 15500}\n29766.666666666668",
          hint: "Values are read by label. A boolean filter works exactly as in NumPy, and keeps the labels.",
          successMessage: "Labels travel with the values through every operation: that is what pandas adds to NumPy.",
        },
      },
      {
        id: "a-ml-series-dataframes",
        title: "Series and DataFrames",
        explain:
          "Build a DataFrame from a dictionary of columns: pd.DataFrame({\"branch\": [...], \"sales\": [...]}), or from a list of row dictionaries (the shape JSON arrives in). df[\"sales\"] returns one column as a Series; df[[\"branch\", \"sales\"]] (a list inside the brackets) returns a smaller DataFrame. df.shape is (rows, columns); df.columns lists the names; df.index labels the rows (0, 1, 2… by default). A new column is a whole-column expression: df[\"revenue\"] = df[\"quantity\"] * df[\"unit_price\"], computed for every row at once, like NumPy.",
        codeExercise: {
          language: PY,
          code: py`import pandas as pd

df = pd.DataFrame({
    "branch": ["Lagos", "Abuja", "Kano"],
    "quantity": [4, 10, 6],
    "unit_price": [72000, 15500, 70500],
})
df["revenue"] = df["quantity"] * df["unit_price"]

print(df.shape)
print(df.columns.tolist())
print(df["revenue"].tolist())
print(type(df["branch"]).__name__, type(df[["branch"]]).__name__)
`,
          question: "Build a table, add a computed column, and inspect it. What does it print?",
          expectedOutput: "(3, 4)\n['branch', 'quantity', 'unit_price', 'revenue']\n[288000, 155000, 423000]\nSeries DataFrame",
          hint: "The new column makes 4. Single brackets give a Series; a list in the brackets gives a DataFrame.",
          successMessage: "df[\"col\"] is a Series, df[[\"col\"]] a DataFrame. Confusing the two is the most common pandas error message you will ever read.",
        },
      },
      {
        id: "a-ml-reading-files",
        title: "Reading CSV, Excel and JSON files",
        explain:
          "pd.read_csv(path) reads comma-separated files and infers each column's type; useful options are sep=\";\", parse_dates=[\"date\"], usecols=[...], na_values=[\"N/A\", \"-\"] and dtype={...}. pd.read_json(path) reads JSON, and pd.json_normalize(records) flattens nested JSON from APIs. pd.read_excel(path, sheet_name=\"Sales\") reads .xlsx files using the openpyxl library (install it with pip install openpyxl; it is not available in this page's Python, so the lessons use CSV and JSON). Always inspect the result right after reading: the header row, the types and the number of rows tell you immediately if something went wrong.",
        example:
          "import pandas as pd\n\ndf = pd.read_csv(\"sales.csv\", parse_dates=[\"date\"], na_values=[\"N/A\", \"-\"])\nbranches = pd.read_json(\"branches.json\")\ntargets = pd.read_excel(\"targets.xlsx\", sheet_name=\"2026\")   # needs openpyxl",
        codeChallenge: {
          task:
            "Write load(csv_path, json_path) that reads sales.csv with pd.read_csv (parsing the date column as dates with parse_dates) and branches.json with pd.read_json, and returns a tuple (sales, branches) of DataFrames. Then write describe_load(sales) that returns a tuple (number_of_rows, number_of_columns, earliest_date_as_string) where the date string is formatted YYYY-MM-DD.",
          starter: "import pandas as pd\n\ndef load(csv_path, json_path):\n    pass\n\ndef describe_load(sales):\n    pass\n",
          sample: "describe_load(sales) → (6, 6, \"2026-01-03\")",
          tests: [
            {
              files: {
                "sales.csv": SALES_CSV,
                "branches.json": "[{\"branch\": \"Lagos\", \"region\": \"South West\"}, {\"branch\": \"Abuja\", \"region\": \"North Central\"}, {\"branch\": \"Kano\", \"region\": \"North West\"}]",
              },
              check: py`import pandas as pd
sales, branches = load("sales.csv", "branches.json")
assert isinstance(sales, pd.DataFrame) and isinstance(branches, pd.DataFrame), "Return two DataFrames."
assert pd.api.types.is_datetime64_any_dtype(sales["date"]), "Parse the date column as dates with parse_dates=[\"date\"]."
assert list(branches.columns) == ["branch", "region"] and len(branches) == 3, "branches.json has 3 rows with branch and region."
assert describe_load(sales) == (6, 6, "2026-01-03"), "Got " + repr(describe_load(sales))`,
            },
          ],
          solution: py`import pandas as pd

def load(csv_path, json_path):
    sales = pd.read_csv(csv_path, parse_dates=["date"])
    branches = pd.read_json(json_path)
    return sales, branches

def describe_load(sales):
    rows, cols = sales.shape
    return rows, cols, sales["date"].min().strftime("%Y-%m-%d")
`,
          hint: "pd.read_csv(csv_path, parse_dates=[\"date\"]). For the earliest date: sales[\"date\"].min().strftime(\"%Y-%m-%d\").",
          successMessage: "Parsing dates at load time pays off immediately: min(), sorting, and grouping by month all work correctly on real dates, never on text.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 24 · 5.4 – 5.6
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ml-l24-inspect-select-filter",
    moduleId: "ml-m5-pandas",
    sectionId: SECTION_ID,
    order: 2,
    covers: ["5.4", "5.5", "5.6"],
    title: "Inspecting, Selecting and Filtering",
    subtitle: "Looking at data before trusting it, then taking exactly the rows and columns you need",
    estimatedMinutes: 36,
    intro:
      "The first five minutes with any dataset are always the same: how big is it, what types are the columns, what is missing, what do typical values look like. Then you select and filter down to what the question needs.",

    atoms: [
      {
        id: "a-ml-inspecting",
        title: "Inspecting datasets",
        explain:
          "df.head(n) and df.tail(n) show the first and last rows; df.sample(n) random ones (often more revealing). df.shape gives the size; df.info() lists every column with its type and non-null count; df.dtypes the types alone. df.describe() summarises numeric columns (count, mean, std, min, quartiles, max). df.isna().sum() counts missing values per column; df[\"col\"].value_counts() counts each category; df[\"col\"].nunique() counts distinct values. A numeric column stored as text, a count that is lower than the row count, or a maximum of 999999 are the clues that cleaning is needed.",
        codeExercise: {
          language: PY,
          code: py`import pandas as pd

df = pd.DataFrame({
    "branch": ["Lagos", "Abuja", "Lagos", "Kano", "Lagos", None],
    "units": [4, 10, None, 6, 3, 40],
})
print(df.shape)
print(df.isna().sum().to_dict())
print(df["branch"].value_counts().to_dict())
print(df["units"].describe()[["count", "mean", "max"]].tolist())
print(df["branch"].nunique())
`,
          question: "Inspect a small table with gaps. What does it print?",
          expectedOutput: "(6, 2)\n{'branch': 1, 'units': 1}\n{'Lagos': 3, 'Abuja': 1, 'Kano': 1}\n[5.0, 12.6, 40.0]\n3",
          hint: "Missing values are skipped by value_counts, describe and nunique. The 5 known units sum to 63.",
          successMessage: "describe() counts only non-missing values: a count of 5 in a table of 6 rows is how you spot gaps.",
        },
      },
      {
        id: "a-ml-selecting",
        title: "Selecting rows and columns",
        explain:
          "Use .loc for selection by LABEL and .iloc for selection by POSITION. df.loc[row_labels, column_names]: df.loc[3, \"price\"], df.loc[:, [\"branch\", \"price\"]], df.loc[2:4, \"price\"] (label slices INCLUDE the end). df.iloc[row_positions, column_positions]: df.iloc[0], df.iloc[:5, :2] (position slices EXCLUDE the end, like Python). With pandas 3's copy-on-write, assign through .loc in one step, df.loc[mask, \"price\"] = 0, never with chained brackets like df[mask][\"price\"] = 0, which changes a temporary copy and leaves df untouched.",
        codeChallenge: {
          task:
            "df has a default index 0, 1, 2… and columns order_id, branch, product, quantity, unit_price. Write: first_rows(df, n) returning the first n rows with iloc; branch_and_qty(df) returning only the branch and quantity columns with loc; price_of(df, order_id) returning the unit_price of the order with that order_id as a Python int; and set_price(df, order_id, price) returning a COPY of df where that order's unit_price is changed, using df.loc with a boolean mask.",
          starter: "import pandas as pd\n\ndef first_rows(df, n):\n    pass\n\ndef branch_and_qty(df):\n    pass\n\ndef price_of(df, order_id):\n    pass\n\ndef set_price(df, order_id, price):\n    pass\n",
          sample: "price_of(df, 1004) → 70500",
          tests: [
            {
              files: { "sales.csv": SALES_CSV },
              check: py`import pandas as pd
df = pd.read_csv("sales.csv").drop(columns="date")
assert first_rows(df, 2)["order_id"].tolist() == [1001, 1002], "The first 2 rows. Got " + repr(first_rows(df, 2))
sel = branch_and_qty(df)
assert list(sel.columns) == ["branch", "quantity"] and len(sel) == 6, "Only the branch and quantity columns, every row."
assert price_of(df, 1004) == 70500 and isinstance(price_of(df, 1004), int), "Order 1004's unit price as an int. Got " + repr(price_of(df, 1004))
new = set_price(df, 1003, 1900)
assert new.loc[new["order_id"] == 1003, "unit_price"].item() == 1900, "The copy must have the new price."
assert df.loc[df["order_id"] == 1003, "unit_price"].item() == 1800, "The original must be unchanged: work on df.copy()."
assert ".iloc" in source and ".loc" in source, "Use iloc for positions and loc for labels."`,
            },
          ],
          solution: py`import pandas as pd

def first_rows(df, n):
    return df.iloc[:n]

def branch_and_qty(df):
    return df.loc[:, ["branch", "quantity"]]

def price_of(df, order_id):
    return int(df.loc[df["order_id"] == order_id, "unit_price"].iloc[0])

def set_price(df, order_id, price):
    out = df.copy()
    out.loc[out["order_id"] == order_id, "unit_price"] = price
    return out
`,
          hint: "df.iloc[:n]; df.loc[:, [\"branch\", \"quantity\"]]; df.loc[df[\"order_id\"] == order_id, \"unit_price\"].iloc[0]; out = df.copy() then out.loc[mask, \"unit_price\"] = price.",
          successMessage: "loc for labels, iloc for positions, and every change through a single .loc assignment: these three habits prevent most pandas bugs.",
        },
      },
      {
        id: "a-ml-filtering",
        title: "Filtering datasets",
        explain:
          "Filtering keeps the rows that meet a condition, with the same boolean-mask syntax as NumPy: df[df[\"quantity\"] > 5]. Combine conditions with & and |, each in parentheses. df[\"branch\"].isin([\"Lagos\", \"Abuja\"]) tests membership in a list; ~ negates a mask; df[\"product\"].str.contains(\"Rice\") filters text; df[\"date\"].between(a, b) filters ranges. df.query(\"quantity > 5 and branch == 'Kano'\") expresses the same as a readable string. After filtering, the index keeps its original labels; .reset_index(drop=True) renumbers from 0.",
        codeChallenge: {
          task:
            "Write three filters, each returning a DataFrame: big_orders(df, min_qty) keeps orders with quantity of at least min_qty; northern(df) keeps orders from Abuja or Kano using isin; rice_over(df, amount) keeps orders whose product contains \"Rice\" AND whose revenue (quantity × unit_price) exceeds amount. Each result must be renumbered from 0 with reset_index(drop=True).",
          starter: "import pandas as pd\n\ndef big_orders(df, min_qty):\n    pass\n\ndef northern(df):\n    pass\n\ndef rice_over(df, amount):\n    pass\n",
          sample: "big_orders(df, 10)[\"order_id\"].tolist() → [1002, 1003, 1006]",
          tests: [
            {
              files: { "sales.csv": SALES_CSV },
              check: py`import pandas as pd
df = pd.read_csv("sales.csv")
r = big_orders(df, 10)
assert r["order_id"].tolist() == [1002, 1003, 1006], "Quantity of at least 10. Got " + repr(r["order_id"].tolist())
assert r.index.tolist() == [0, 1, 2], "Renumber the index with reset_index(drop=True)."
assert northern(df)["order_id"].tolist() == [1002, 1004, 1005, 1006], "Abuja or Kano. Got " + repr(northern(df)["order_id"].tolist())
assert rice_over(df, 250000)["order_id"].tolist() == [1001, 1004], "Rice with revenue over ₦250,000: 288,000 and 423,000 (Abuja's 219,000 is not). Got " + repr(rice_over(df, 250000)["order_id"].tolist())
assert calls("isin") and calls("contains"), "Use isin and str.contains."`,
            },
          ],
          solution: py`import pandas as pd

def big_orders(df, min_qty):
    return df[df["quantity"] >= min_qty].reset_index(drop=True)

def northern(df):
    return df[df["branch"].isin(["Abuja", "Kano"])].reset_index(drop=True)

def rice_over(df, amount):
    revenue = df["quantity"] * df["unit_price"]
    mask = df["product"].str.contains("Rice") & (revenue > amount)
    return df[mask].reset_index(drop=True)
`,
          hint: "df[df[\"quantity\"] >= min_qty]; df[df[\"branch\"].isin([\"Abuja\", \"Kano\"])]; build revenue as a Series, then df[\"product\"].str.contains(\"Rice\") & (revenue > amount).",
          successMessage: "A computed Series (revenue) can be used in a mask without being stored as a column: filters can test anything you can compute.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 25 · 5.7 – 5.9
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ml-l25-sort-missing-duplicates",
    moduleId: "ml-m5-pandas",
    sectionId: SECTION_ID,
    order: 3,
    covers: ["5.7", "5.8", "5.9"],
    title: "Sorting, Missing Values and Duplicates",
    subtitle: "Ordering data, filling gaps sensibly, and removing repeated records",
    estimatedMinutes: 36,
    intro:
      "Real datasets have gaps and repeats: a cashier skipped a field, a sync ran twice. Models cannot train on missing values, and duplicates inflate whatever they repeat. This lesson handles both, after a look at sorting and ranking.",

    atoms: [
      {
        id: "a-ml-sorting-ranking",
        title: "Sorting and ranking",
        explain:
          "df.sort_values(\"revenue\", ascending=False) sorts rows by a column; pass a list to sort by several (by=[\"branch\", \"revenue\"], ascending=[True, False]). df.sort_index() restores index order. df.nlargest(3, \"revenue\") and df.nsmallest(...) are fast top-n shortcuts. RANKING assigns positions: df[\"revenue\"].rank(ascending=False) gives 1 to the largest; method=\"dense\" gives tied values the same rank with no gaps, method=\"min\" gives ties the lowest rank (like sports tables). Ranking within groups, such as each branch's best product, combines groupby (Lesson 26) with rank.",
        codeExercise: {
          language: PY,
          code: py`import pandas as pd

df = pd.DataFrame({
    "rep": ["Ada", "Bayo", "Chi", "Dele", "Efe"],
    "sales": [500, 800, 500, 950, 700],
})
print(df.sort_values("sales", ascending=False)["rep"].tolist())
print(df.nlargest(2, "sales")["rep"].tolist())
print(df["sales"].rank(ascending=False, method="min").tolist())
print(df["sales"].rank(ascending=False, method="dense").tolist())
`,
          question: "Sort, take the top two, and rank with two tie rules. What does it print?",
          expectedOutput: "['Dele', 'Bayo', 'Efe', 'Ada', 'Chi']\n['Dele', 'Bayo']\n[4.0, 2.0, 4.0, 1.0, 3.0]\n[4.0, 2.0, 4.0, 1.0, 3.0]",
          hint: "Ada and Chi tie on 500. With method=\"min\" they share rank 4 (and the next rank would be 6). With \"dense\" they share the next rank after 3.",
          successMessage: "Here both rules give the same numbers because the tie is last. Put a tie in the middle and \"min\" leaves a gap while \"dense\" does not.",
        },
      },
      {
        id: "a-ml-missing-values",
        title: "Handling missing values",
        explain:
          "pandas marks missing values as NaN (or NaT for dates, pd.NA in nullable types). df.isna() finds them; df.dropna() removes rows with any (subset=[...] limits which columns count; thresh= keeps rows with enough values). df.fillna(value) fills them: with a constant, with a column statistic (df[\"units\"].fillna(df[\"units\"].median())), or by carrying values forward in time series (.ffill()). The choice matters: dropping rows loses data and can bias the sample if gaps are not random; the MEDIAN is a safer fill than the mean for skewed columns; and a separate \"was missing\" indicator column often helps a model, because missingness itself can carry information.",
        codeChallenge: {
          task:
            "Write clean_missing(df) that returns a NEW DataFrame where: rows missing branch are dropped; missing quantity is filled with the median quantity (computed after dropping those rows); missing unit_price is filled with the median unit_price OF THE SAME PRODUCT (use groupby(\"product\")[\"unit_price\"].transform(\"median\")); and a column price_was_missing (True/False) records which unit_price values were filled. Reset the index.",
          starter: "import pandas as pd\n\ndef clean_missing(df):\n    pass\n",
          sample: "a Rice row missing its price gets the median Rice price; a Sugar row the median Sugar price",
          tests: [
            {
              check: py`import pandas as pd
import numpy as np
df = pd.DataFrame({
    "branch": ["Lagos", "Abuja", None, "Kano", "Lagos", "Kano"],
    "product": ["Rice", "Rice", "Sugar", "Sugar", "Rice", "Sugar"],
    "quantity": [4, np.nan, 25, 40, 2, np.nan],
    "unit_price": [72000, 70000, 1800, np.nan, np.nan, 1750],
})
out = clean_missing(df)
assert len(out) == 5 and out.index.tolist() == [0, 1, 2, 3, 4], "One row has no branch: 5 rows remain, renumbered. Got " + str(len(out))
assert out["quantity"].tolist() == [4, 4, 40, 2, 4], "Quantities 4, 40, 2 have median 4: fill the two gaps with 4. Got " + repr(out["quantity"].tolist())
assert out["unit_price"].tolist() == [72000, 70000, 1750, 71000, 1750], "Kano's Sugar gets the Sugar median (1750); Lagos's Rice the Rice median (71000). Got " + repr(out["unit_price"].tolist())
assert out["price_was_missing"].tolist() == [False, False, True, True, False], "Flag the two filled prices. Got " + repr(out["price_was_missing"].tolist())
assert df["quantity"].isna().sum() == 2, "Do not change the original DataFrame."
assert calls("transform"), "Use groupby(...).transform(\"median\") for the product medians."`,
            },
          ],
          solution: py`import pandas as pd

def clean_missing(df):
    out = df.dropna(subset=["branch"]).reset_index(drop=True)
    out["quantity"] = out["quantity"].fillna(out["quantity"].median())
    out["price_was_missing"] = out["unit_price"].isna()
    product_median = out.groupby("product")["unit_price"].transform("median")
    out["unit_price"] = out["unit_price"].fillna(product_median)
    return out
`,
          hint: "Drop first (dropna(subset=[\"branch\"])), so medians are computed on the rows you keep. Record isna() BEFORE filling the prices. transform(\"median\") returns one value per row, aligned with the DataFrame.",
          successMessage: "Group-wise filling uses what you know (the product) instead of a crude overall average, and the indicator column keeps the fact that a value was guessed.",
        },
      },
      {
        id: "a-ml-duplicates",
        title: "Removing duplicate records",
        explain:
          "df.duplicated() marks rows that repeat an earlier row exactly; df.drop_duplicates() removes them. Usually you define duplicates by a KEY rather than every column: df.drop_duplicates(subset=[\"order_id\"], keep=\"last\") keeps the most recent version of each order (keep=\"first\" is the default; keep=False drops every copy). Always count before and after: duplicates in training data make a model overweight those examples, and duplicates that cross the train-test split leak answers into the test set (Module 8).",
        codeChallenge: {
          task:
            "A sync job appended some orders twice, and some orders were later corrected. Write dedupe(df) that returns a tuple (clean, removed): clean keeps only the LAST row for each order_id (so corrections win), sorted by order_id with the index reset; removed is the number of rows dropped.",
          starter: "import pandas as pd\n\ndef dedupe(df):\n    pass\n",
          sample: "6 rows with orders 1001 and 1003 repeated → (4 rows, 2)",
          tests: [
            {
              check: py`import pandas as pd
df = pd.DataFrame({
    "order_id": [1003, 1001, 1002, 1001, 1004, 1003],
    "quantity": [25, 4, 10, 5, 6, 25],
})
clean, removed = dedupe(df)
assert removed == 2, "Two rows repeat an order_id. Got " + repr(removed)
assert clean["order_id"].tolist() == [1001, 1002, 1003, 1004], "Sorted by order_id. Got " + repr(clean["order_id"].tolist())
assert clean.loc[clean["order_id"] == 1001, "quantity"].item() == 5, "Keep the LAST version of order 1001 (the correction, quantity 5)."
assert clean.index.tolist() == [0, 1, 2, 3], "Reset the index."
assert calls("drop_duplicates"), "Use drop_duplicates with subset and keep."`,
            },
          ],
          solution: py`import pandas as pd

def dedupe(df):
    clean = df.drop_duplicates(subset=["order_id"], keep="last")
    clean = clean.sort_values("order_id").reset_index(drop=True)
    return clean, len(df) - len(clean)
`,
          hint: "df.drop_duplicates(subset=[\"order_id\"], keep=\"last\"), then sort_values(\"order_id\").reset_index(drop=True). removed = len(df) - len(clean).",
          successMessage: "Defining a duplicate by its key and deciding which copy wins is a business decision. Here, the latest correction wins.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 26 · 5.10 – 5.12
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ml-l26-types-group-merge",
    moduleId: "ml-m5-pandas",
    sectionId: SECTION_ID,
    order: 4,
    covers: ["5.10", "5.11", "5.12"],
    title: "Types, Grouping and Merging",
    subtitle: "Fixing column types, summarising by group, and joining tables",
    estimatedMinutes: 40,
    intro:
      "Three operations turn raw records into answers: convert columns to their true types, group and aggregate (\"revenue by branch\"), and join tables (\"add each branch's region\").",

    atoms: [
      {
        id: "a-ml-type-conversion",
        title: "Data type conversion",
        explain:
          "Columns often arrive as the wrong type: prices as text with commas, dates as strings, categories as long text. df[\"col\"].astype(int) converts when every value is valid. pd.to_numeric(s, errors=\"coerce\") converts what it can and turns the rest into NaN, so bad values become visible missing values instead of crashing. pd.to_datetime(s, errors=\"coerce\") parses dates; then s.dt.year, s.dt.month and s.dt.day_name() extract parts. astype(\"category\") stores repeated labels compactly. Clean text before converting: s.str.replace(\",\", \"\") removes thousands separators and s.str.strip() surrounding spaces.",
        codeChallenge: {
          task:
            "Raw sales arrive with every column as text. Write fix_types(df) that returns a NEW DataFrame where: amount (text like \"72,000\" or \"N/A\") becomes a float column, with commas removed and invalid values as NaN via pd.to_numeric(..., errors=\"coerce\"); date becomes datetime via pd.to_datetime(..., errors=\"coerce\"); and a new integer column month holds each date's month number.",
          starter: "import pandas as pd\n\ndef fix_types(df):\n    pass\n",
          sample: "\"72,000\" → 72000.0; \"N/A\" → NaN; \"2026-03-14\" → month 3",
          tests: [
            {
              check: py`import pandas as pd
raw = pd.DataFrame({
    "amount": ["72,000", "15500", "N/A", " 1,800 "],
    "date": ["2026-01-03", "2026-02-10", "2026-02-11", "2026-03-14"],
})
out = fix_types(raw)
assert pd.api.types.is_float_dtype(out["amount"]), "amount must be a float column."
assert out["amount"].isna().tolist() == [False, False, True, False], "Only \"N/A\" becomes NaN."
assert out["amount"].dropna().tolist() == [72000.0, 15500.0, 1800.0], "Remove commas and spaces before converting. Got " + repr(out["amount"].tolist())
assert pd.api.types.is_datetime64_any_dtype(out["date"]), "date must be a datetime column."
assert out["month"].tolist() == [1, 2, 2, 3], "Month numbers. Got " + repr(out["month"].tolist())
assert raw["amount"].tolist()[0] == "72,000", "Do not change the original."
assert calls("to_numeric") and calls("to_datetime"), "Use pd.to_numeric and pd.to_datetime with errors=\"coerce\"."`,
            },
          ],
          solution: py`import pandas as pd

def fix_types(df):
    out = df.copy()
    cleaned = out["amount"].str.replace(",", "").str.strip()
    out["amount"] = pd.to_numeric(cleaned, errors="coerce").astype(float)
    out["date"] = pd.to_datetime(out["date"], errors="coerce")
    out["month"] = out["date"].dt.month
    return out
`,
          hint: "out[\"amount\"].str.replace(\",\", \"\").str.strip(), then pd.to_numeric(..., errors=\"coerce\"). For months: out[\"date\"].dt.month after converting.",
          successMessage: "errors=\"coerce\" turns surprises into NaN you can count and handle, instead of a crash halfway through a million rows.",
        },
      },
      {
        id: "a-ml-grouping",
        title: "Grouping and aggregation",
        explain:
          "groupby follows SPLIT-APPLY-COMBINE: split the rows into groups by a key, apply a function to each group, combine the results. df.groupby(\"branch\")[\"revenue\"].sum() gives total revenue per branch. Several statistics at once: .agg([\"sum\", \"mean\", \"count\"]); NAMED aggregation gives clean column names: df.groupby(\"branch\").agg(total=(\"revenue\", \"sum\"), orders=(\"order_id\", \"count\")). Group by several keys with a list, and add .reset_index() to turn the group labels back into ordinary columns. .transform() returns a result aligned to every original row (as in Lesson 25), which is how group-level features (a customer's average spend) are attached to each row for a model.",
        codeChallenge: {
          task:
            "Write branch_report(df) that adds revenue = quantity × unit_price and returns a DataFrame with one row per branch and the columns branch, total_revenue (sum), orders (count of order_id) and avg_order (mean revenue, rounded to 2 places), sorted by total_revenue descending, with a fresh index. Use named aggregation.",
          starter: "import pandas as pd\n\ndef branch_report(df):\n    pass\n",
          sample: "first row → Kano, total_revenue 493000, orders 2, avg_order 246500.0",
          tests: [
            {
              files: { "sales.csv": SALES_CSV },
              check: py`import pandas as pd
df = pd.read_csv("sales.csv")
r = branch_report(df)
assert list(r.columns) == ["branch", "total_revenue", "orders", "avg_order"], "Columns: branch, total_revenue, orders, avg_order. Got " + repr(list(r.columns))
assert r["branch"].tolist() == ["Kano", "Abuja", "Lagos"], "Sorted by total revenue, highest first. Got " + repr(r["branch"].tolist())
assert r["total_revenue"].tolist() == [493000, 374000, 333000], "Got " + repr(r["total_revenue"].tolist())
assert r["orders"].tolist() == [2, 2, 2], "Two orders each."
assert r["avg_order"].tolist() == [246500.0, 187000.0, 166500.0], "Got " + repr(r["avg_order"].tolist())
assert r.index.tolist() == [0, 1, 2], "Reset the index so branch is a column."`,
            },
          ],
          solution: py`import pandas as pd

def branch_report(df):
    d = df.assign(revenue=df["quantity"] * df["unit_price"])
    report = d.groupby("branch").agg(
        total_revenue=("revenue", "sum"),
        orders=("order_id", "count"),
        avg_order=("revenue", "mean"),
    )
    report["avg_order"] = report["avg_order"].round(2)
    return report.sort_values("total_revenue", ascending=False).reset_index()
`,
          hint: "d = df.assign(revenue=...). d.groupby(\"branch\").agg(total_revenue=(\"revenue\", \"sum\"), orders=(\"order_id\", \"count\"), avg_order=(\"revenue\", \"mean\")). Round, sort, then reset_index().",
          successMessage: "One groupby replaced the dictionary-of-totals loop you wrote in Module 2. Named aggregation keeps the output ready for a report or a chart.",
        },
      },
      {
        id: "a-ml-merging",
        title: "Merging and joining datasets",
        explain:
          "pd.merge(left, right, on=\"key\", how=...) combines tables on matching key values, like SQL joins. how=\"inner\" keeps only keys found in BOTH tables; \"left\" keeps every row of the left table, filling NaN where the right has no match; \"right\" the reverse; \"outer\" keeps everything. indicator=True adds a _merge column saying where each row came from, the quickest way to find unmatched keys. validate=\"many_to_one\" makes pandas raise an error if the right table unexpectedly has duplicate keys, which would silently multiply rows. pd.concat([a, b]) STACKS tables with the same columns, such as monthly files.",
        codeChallenge: {
          task:
            "Write add_regions(sales, branches) that LEFT-joins sales to branches on branch (so no sale is lost) with validate=\"many_to_one\", and returns a tuple (merged, unmatched): merged is the joined DataFrame without any helper columns, and unmatched is a sorted list of the distinct branch names in sales that had no region.",
          starter: "import pandas as pd\n\ndef add_regions(sales, branches):\n    pass\n",
          sample: "a sale from Enugu, which is missing from branches, keeps its row with region NaN, and unmatched → [\"Enugu\"]",
          tests: [
            {
              check: py`import pandas as pd
sales = pd.DataFrame({"order_id": [1, 2, 3, 4], "branch": ["Lagos", "Enugu", "Kano", "Lagos"]})
branches = pd.DataFrame({"branch": ["Lagos", "Kano", "Abuja"], "region": ["South West", "North West", "North Central"]})
merged, unmatched = add_regions(sales, branches)
assert len(merged) == 4, "A left join keeps every sale. Got " + str(len(merged)) + " rows."
assert list(merged.columns) == ["order_id", "branch", "region"], "No helper columns such as _merge. Got " + repr(list(merged.columns))
assert merged["region"].isna().tolist() == [False, True, False, False], "Enugu has no region."
assert unmatched == ["Enugu"], "Got " + repr(unmatched)
dup = pd.concat([branches, branches.iloc[[0]]])
try:
    add_regions(sales, dup)
    assert False, "A duplicated branch in the lookup table must raise an error: use validate=\"many_to_one\"."
except pd.errors.MergeError:
    pass`,
            },
          ],
          solution: py`import pandas as pd

def add_regions(sales, branches):
    merged = pd.merge(sales, branches, on="branch", how="left", validate="many_to_one", indicator=True)
    unmatched = sorted(merged.loc[merged["_merge"] == "left_only", "branch"].unique().tolist())
    return merged.drop(columns="_merge"), unmatched
`,
          hint: "pd.merge(sales, branches, on=\"branch\", how=\"left\", validate=\"many_to_one\", indicator=True). Rows with _merge == \"left_only\" had no match. Drop _merge before returning.",
          successMessage: "indicator and validate turn a join from a silent operation into a checked one. A join that quietly duplicates or drops rows is one of the most expensive bugs in data work.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 27 · 5.13 – 5.14
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ml-l27-apply-export",
    moduleId: "ml-m5-pandas",
    sectionId: SECTION_ID,
    order: 5,
    covers: ["5.13", "5.14"],
    title: "Applying Functions and Exporting Data",
    subtitle: "Custom transformations, and saving the cleaned result",
    estimatedMinutes: 32,
    intro:
      "When no built-in operation fits, you apply your own function. When cleaning is done, you save the result so the modelling step starts from clean data every time.",

    atoms: [
      {
        id: "a-ml-applying-functions",
        title: "Applying functions to datasets",
        explain:
          "s.map(dict_or_function) transforms each value of a Series: map a dictionary to recode categories ({\"Lagos\": \"South West\", ...}). s.apply(function) applies any Python function to each value. df.apply(function, axis=1) passes each ROW to the function, for logic that needs several columns. Prefer VECTORISED operations whenever they exist: df[\"a\"] * df[\"b\"], np.where(condition, x, y) and pd.cut(values, bins, labels) are far faster than apply, which runs Python once per row. pd.cut turns numbers into labelled bands, such as order sizes or age groups, a common feature-engineering step.",
        codeChallenge: {
          task:
            "Write enrich(df) that returns a NEW DataFrame with three added columns: region, by mapping branch with the dictionary REGIONS given in the starter; size_band, using pd.cut on quantity with bins [0, 5, 20, inf] and labels [\"small\", \"medium\", \"bulk\"]; and discount, which is 0.05 where quantity is at least 20 and 0.0 otherwise, using np.where.",
          starter: "import numpy as np\nimport pandas as pd\n\nREGIONS = {\"Lagos\": \"South West\", \"Abuja\": \"North Central\", \"Kano\": \"North West\"}\n\ndef enrich(df):\n    pass\n",
          sample: "quantity 4 → small, 0.0; quantity 25 → bulk, 0.05",
          tests: [
            {
              files: { "sales.csv": SALES_CSV },
              check: py`import pandas as pd
df = pd.read_csv("sales.csv")
out = enrich(df)
assert out["region"].tolist() == ["South West", "North Central", "South West", "North West", "North Central", "North West"], "Map branch to region. Got " + repr(out["region"].tolist())
assert [str(v) for v in out["size_band"]] == ["small", "medium", "bulk", "medium", "small", "bulk"], "Bands: up to 5 small, up to 20 medium, above that bulk. Got " + repr([str(v) for v in out["size_band"]])
assert out["discount"].tolist() == [0.0, 0.0, 0.05, 0.0, 0.0, 0.05], "5% for 20 or more units. Got " + repr(out["discount"].tolist())
assert "region" not in df.columns, "Return a new DataFrame; do not change df."
assert calls("map") and calls("cut") and calls("where"), "Use map, pd.cut and np.where."
assert not calls("apply"), "Each of these has a vectorised tool: no apply needed."`,
            },
          ],
          solution: py`import numpy as np
import pandas as pd

REGIONS = {"Lagos": "South West", "Abuja": "North Central", "Kano": "North West"}

def enrich(df):
    out = df.copy()
    out["region"] = out["branch"].map(REGIONS)
    out["size_band"] = pd.cut(out["quantity"], bins=[0, 5, 20, np.inf], labels=["small", "medium", "bulk"])
    out["discount"] = np.where(out["quantity"] >= 20, 0.05, 0.0)
    return out
`,
          hint: "out[\"branch\"].map(REGIONS); pd.cut(out[\"quantity\"], bins=[0, 5, 20, np.inf], labels=[...]); np.where(out[\"quantity\"] >= 20, 0.05, 0.0).",
          successMessage: "map, cut and where cover most \"apply a rule to a column\" needs, at NumPy speed. Reach for apply only when the logic truly needs arbitrary Python.",
        },
      },
      {
        id: "a-ml-exporting",
        title: "Exporting processed datasets",
        explain:
          "df.to_csv(\"clean_sales.csv\", index=False) writes CSV; index=False stops pandas writing the row numbers as an extra unnamed column, the most common export mistake. df.to_json(\"sales.json\", orient=\"records\") writes a list of row objects, the format web APIs expect; df.to_excel(\"report.xlsx\", sheet_name=\"Summary\") writes Excel (needs openpyxl); df.to_parquet() writes Parquet, a compressed, typed columnar format used in data engineering. Exporting a CLEANED dataset makes the modelling step reproducible: training reads the same clean file every run instead of re-running fragile cleaning code.",
        codeChallenge: {
          task:
            "Write export(df, csv_path, json_path) that writes df to csv_path WITHOUT the index and to json_path with orient=\"records\", then reads the CSV back with pd.read_csv and returns that round-tripped DataFrame.",
          starter: "import pandas as pd\n\ndef export(df, csv_path, json_path):\n    pass\n",
          sample: "export(report, \"report.csv\", \"report.json\") → the same table, read back from disk",
          tests: [
            {
              check: py`import pandas as pd
import json
df = pd.DataFrame({"branch": ["Kano", "Abuja"], "total": [493000, 374000]})
back = export(df, "report.csv", "report.json")
assert list(back.columns) == ["branch", "total"], "No extra index column: use index=False. Got " + repr(list(back.columns))
assert back.equals(df), "The round trip should reproduce the table exactly."
with open("report.json", encoding="utf-8") as f:
    records = json.load(f)
assert records == [{"branch": "Kano", "total": 493000}, {"branch": "Abuja", "total": 374000}], "orient=\"records\" writes a list of row objects. Got " + repr(records)`,
            },
          ],
          solution: py`import pandas as pd

def export(df, csv_path, json_path):
    df.to_csv(csv_path, index=False)
    df.to_json(json_path, orient="records")
    return pd.read_csv(csv_path)
`,
          hint: "df.to_csv(csv_path, index=False); df.to_json(json_path, orient=\"records\"); return pd.read_csv(csv_path).",
          successMessage: "Write, read back, compare: a round-trip test catches the extra-index-column mistake before anyone else opens your file.",
        },
      },
    ],

    task: {
      title: "Module 5 project: clean and analyse a Nigerian business sales dataset",
      intro:
        "Take a year of sales records from a Nigerian retail business (a public dataset, a business you know, or one you generate realistically) with at least 2,000 rows, and produce a clean dataset and an analysis using only pandas.",
      prompts: [
        "Load the data and write an inspection summary: shape, types, missing values per column, duplicates, and suspicious values.",
        "Fix the types: amounts with commas, dates as text, inconsistent branch spellings (\"lagos\", \"Lagos \", \"LAGOS\").",
        "Handle missing values with a justified method per column, and keep an indicator column where a value was filled.",
        "Remove duplicate orders by order_id, keeping the latest correction, and report how many were removed.",
        "Merge in a branch-to-region table and a product-to-category table, validating the joins and reporting unmatched keys.",
        "Report revenue by branch, by month and by category; the top ten products; and each branch's best month.",
        "Export the clean dataset as CSV and the summary tables as JSON, and write five findings in plain English.",
      ],
      closing: "Your findings came from tables of numbers. Module 6 asks the deeper questions: how values are distributed, where the outliers are, and which variables move together.",
    },

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
