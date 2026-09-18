/**
 * EXAM BANK · DOMAIN 4 — PYTHON ANALYSIS AND STATISTICS
 *
 * SERVER ONLY. Carries the answer key.
 *
 * `predict` items give the candidate code and ask what it prints. Reading code
 * is the skill that separates someone who can debug their own work from
 * someone who can only copy a tutorial, and unlike a coding task it can be
 * marked exactly.
 *
 * No `predict` item is runnable in the exam client — there is no Run button on
 * a paper. Every expectedOutput below was produced by executing the snippet in
 * CPython against pandas 3.0.5, and the validator re-runs them all.
 *
 * `lines` tells the client how tall to make the answer box. It is a hint about
 * the shape of the output, which is deliberate: an exam should test whether you
 * can compute the values, not whether you guessed how many lines print.
 */

export const ITEMS = [
  /* ── core (difficulty 3-4) ──────────────────────────────────────────── */
  {
    id: "x-d4-001",
    domain: "d4-python",
    difficulty: 3,
    topic: "value-counts",
    skill: "value_counts",
    caseId: "zuri",
    type: "predict",
    prompt:
      "The appointment statuses from the Zuri table are in a DataFrame called appts. What does this print?",
    code: 'print(appts["status"].value_counts().to_string())',
    lines: 4,
    expectedOutput: "status\nAttended     13\nNo-show       5\nCancelled     2",
  },
  {
    id: "x-d4-002",
    domain: "d4-python",
    difficulty: 4,
    topic: "groupby-count-subset",
    skill: "Filter then group",
    caseId: "zuri",
    type: "predict",
    prompt:
      "appts holds the twenty Zuri appointments. What does this print?",
    code:
      'noshow = appts[appts["status"] == "No-show"]\nprint(noshow.groupby("clinic")["status"].count().to_string())',
    lines: 4,
    expectedOutput: "clinic\nIkeja    2\nLekki    2\nYaba     1",
  },
  {
    id: "x-d4-003",
    domain: "d4-python",
    difficulty: 4,
    topic: "two-denominators",
    skill: "Two definitions of a rate",
    caseId: "zuri",
    type: "predict",
    prompt:
      "appts holds the twenty Zuri appointments, two of which were cancelled. What does this print?",
    code:
      'n = len(appts)\nns = (appts["status"] == "No-show").sum()\nkept = n - (appts["status"] == "Cancelled").sum()\nprint(ns, n, kept)\nprint(round(ns / n * 100, 1))\nprint(round(ns / kept * 100, 1))',
    lines: 3,
    expectedOutput: "5 20 18\n25.0\n27.8",
  },
  {
    id: "x-d4-004",
    domain: "d4-python",
    difficulty: 4,
    topic: "sum-reconcile",
    skill: "Deriving and totalling columns",
    caseId: "solar",
    type: "predict",
    prompt:
      "jobs holds the twelve Sunbeam jobs, with gross = price - install and net = gross - warranty. What does this print?",
    code:
      'print(jobs["price"].sum())\nprint(jobs["gross"].sum())\nprint(jobs["warranty"].sum())\nprint(jobs["net"].sum())',
    lines: 4,
    expectedOutput: "17950000\n4790000\n963000\n3827000",
  },
  {
    id: "x-d4-005",
    domain: "d4-python",
    difficulty: 4,
    topic: "mean-vs-median-delay",
    skill: "Mean, median and skew",
    caseId: "logistics",
    type: "predict",
    prompt:
      "runs holds the sixteen deliveries with delay = actual - promised. What does this print?",
    code:
      'print(round(runs["delay"].mean(), 2))\nprint(runs["delay"].median())\nprint(round(runs["delay"].skew(), 3))',
    lines: 3,
    expectedOutput: "1.25\n0.0\n3.766",
  },
  {
    id: "x-d4-006",
    domain: "d4-python",
    difficulty: 4,
    topic: "iqr-fence-code",
    skill: "The IQR fence in pandas",
    caseId: "logistics",
    type: "predict",
    prompt:
      "runs holds the sixteen deliveries with a delay column. What does this print?",
    code:
      'q1 = runs["delay"].quantile(0.25)\nq3 = runs["delay"].quantile(0.75)\nfence = q3 + 1.5 * (q3 - q1)\nprint(q1, q3)\nprint(fence)\nprint(runs.loc[runs["delay"] > fence, "delay"].tolist())',
    lines: 3,
    expectedOutput: "0.0 1.0\n2.5\n[15]",
  },
  {
    id: "x-d4-007",
    domain: "d4-python",
    difficulty: 3,
    topic: "boolean-mean-rate",
    skill: "A rate from a boolean column",
    caseId: "logistics",
    type: "predict",
    prompt:
      "runs holds the sixteen deliveries. What does this print?",
    code:
      'runs["on_time"] = runs["actual"] <= runs["promised"]\nprint(runs["on_time"].sum(), len(runs))\nprint(round(runs["on_time"].mean() * 100, 1))',
    lines: 2,
    expectedOutput: "10 16\n62.5",
  },
  {
    id: "x-d4-008",
    domain: "d4-python",
    difficulty: 4,
    topic: "named-agg-rates",
    skill: "Named aggregation and a derived rate",
    caseId: "solar",
    type: "predict",
    prompt:
      "jobs holds the twelve Sunbeam jobs with gross and net columns. What does this print?",
    code:
      'pk = jobs.groupby("package").agg(revenue=("price","sum"), gross=("gross","sum"), net=("net","sum"))\npk["gross_pct"] = (pk["gross"] / pk["revenue"] * 100).round(2)\npk["net_pct"] = (pk["net"] / pk["revenue"] * 100).round(2)\nprint(pk[["gross_pct", "net_pct"]].to_string())',
    lines: 4,
    expectedOutput:
      "         gross_pct  net_pct\npackage\nHome         28.40    27.01\nSME          25.83    18.50",
  },
  {
    id: "x-d4-009",
    domain: "d4-python",
    difficulty: 3,
    topic: "fillna-vs-dropna",
    skill: "Handling missing values in pandas",
    caseId: null,
    type: "mcq",
    prompt:
      "A ratings column has six real values averaging 4.17 and one NaN. You apply fillna(0) and the mean becomes 3.57. What happened?",
    options: [
      { id: "a", text: "You added a seventh rating of zero that nobody gave, changing both the numerator and the denominator" },
      { id: "b", text: "The mean is now more accurate" },
      { id: "c", text: "pandas excluded the NaN either way, so this is a display change" },
      { id: "d", text: "fillna(0) removed the row" },
    ],
    correct: "a",
    explanation:
      "25 ÷ 6 became 25 ÷ 7. NaN is 'unknown'; zero is a measurement. mean() already skips NaN, so filling with zero only injects a fabricated value.",
  },
  {
    id: "x-d4-010",
    domain: "d4-python",
    difficulty: 4,
    topic: "merge-how",
    skill: "Choosing a merge type",
    caseId: null,
    type: "mcq",
    prompt:
      "You merge 18 order rows to a product lookup and want to KNOW about any orders whose product is missing from the lookup. Which merge, and what do you check?",
    options: [
      { id: "a", text: "A left merge, then count nulls in a column that came from the lookup" },
      { id: "b", text: "An inner merge, then compare the row count with 18" },
      { id: "c", text: "An outer merge, which never loses rows" },
      { id: "d", text: "A right merge, to keep every product" },
    ],
    correct: "a",
    explanation:
      "A left merge keeps all 18 orders and marks unmatched ones with NaN, so you can count and inspect them. An inner merge silently drops them, which tells you a number changed but not which rows or why.",
  },
  {
    id: "x-d4-011",
    domain: "d4-python",
    difficulty: 4,
    topic: "groupby-sort-order",
    skill: "GroupBy key sort order",
    caseId: null,
    type: "mcq",
    prompt:
      'You group by a text month column holding "Jul", "Aug" and "Sep" and plot the result without reindexing. What is on the x-axis?',
    options: [
      { id: "a", text: "Aug, Jul, Sep — groupby sorts its keys as text, so the line runs through a sequence that never happened" },
      { id: "b", text: "Jul, Aug, Sep, because pandas recognises month abbreviations" },
      { id: "c", text: "The order the rows appear in the file" },
      { id: "d", text: "An error, because months cannot be grouped" },
    ],
    correct: "a",
    explanation:
      "Text sorts alphabetically. reindex with the calendar order, or use real dates. Nothing errors, so a wrong trend line ships quietly.",
  },
  {
    id: "x-d4-012",
    domain: "d4-python",
    difficulty: 3,
    topic: "std-ddof",
    skill: "Sample against population standard deviation",
    caseId: null,
    type: "mcq",
    prompt:
      "Your pandas .std() disagrees with a colleague's Excel STDEV.P on the same column. Who is wrong?",
    options: [
      { id: "a", text: "Neither — .std() is the sample version by default and STDEV.P is the population version; agree which you mean and pass ddof=0 to match" },
      { id: "b", text: "pandas, which miscalculates standard deviation" },
      { id: "c", text: "Excel, which is less precise" },
      { id: "d", text: "Both, because the statistic is not comparable across tools" },
    ],
    correct: "a",
    explanation:
      "The divisor differs: ddof=1 against the full count. Both answers are correct to different questions, and the reconciliation is a one-argument change.",
  },
  {
    id: "x-d4-013",
    domain: "d4-python",
    difficulty: 4,
    topic: "claim-rate-lambda",
    skill: "Counting a condition inside groupby",
    caseId: "solar",
    type: "predict",
    prompt:
      "jobs holds the twelve Sunbeam jobs. A warranty value above zero means a claim was made. What does this print?",
    code:
      'claims = jobs.groupby("package")["warranty"].apply(lambda s: (s > 0).sum())\njobcount = jobs.groupby("package")["price"].count()\nprint((claims / jobcount * 100).round(1).to_string())',
    lines: 3,
    expectedOutput: "package\nHome    28.6\nSME     80.0",
  },

  /* ── advanced (difficulty 5) ───────────────────────────────────────── */
  {
    id: "x-d4-051",
    domain: "d4-python",
    difficulty: 5,
    topic: "corr-near-perfect",
    skill: "A near-perfect correlation",
    caseId: "solar",
    type: "predict",
    prompt:
      "jobs holds the twelve Sunbeam jobs. Price takes one of two values depending on the package. What does this print?",
    code:
      'print(round(jobs["price"].corr(jobs["install"]), 4))\nprint(jobs["price"].nunique())',
    lines: 2,
    expectedOutput: "0.9996\n2",
  },
  {
    id: "x-d4-052",
    domain: "d4-python",
    difficulty: 5,
    topic: "corr-interpretation",
    skill: "What a near-perfect correlation means",
    caseId: "solar",
    type: "mcq",
    prompt:
      "price.corr(install) returns 0.9996 and price has only two distinct values. What is the honest reading?",
    options: [
      { id: "a", text: "The coefficient is largely restating which package a job is, so it describes the price list rather than a finding about the business" },
      { id: "b", text: "Install cost almost perfectly predicts price, which is the strongest finding available" },
      { id: "c", text: "Install cost causes price" },
      { id: "d", text: "The data must be corrupt for a correlation to be that high" },
    ],
    correct: "a",
    explanation:
      "With two price levels and install costs tightly clustered by package, the correlation is measuring the package twice. A near-perfect coefficient is a reason to check for a derived or collinear column first.",
  },
  {
    id: "x-d4-053",
    domain: "d4-python",
    difficulty: 5,
    topic: "route-mean-vs-median",
    skill: "Mean and median by group",
    caseId: "logistics",
    type: "predict",
    prompt:
      "runs holds the sixteen deliveries with a delay column, grouped by a short route name. What does this print?",
    code:
      'print(runs.groupby("route")["delay"].mean().round(2).to_string())\nprint("---")\nprint(runs.groupby("route")["delay"].median().to_string())',
    lines: 11,
    expectedOutput:
      "route\nAbuja       0.75\nIbadan      0.00\nKano        4.00\nPortHarc    0.25\n---\nroute\nAbuja       0.5\nIbadan      0.0\nKano        0.5\nPortHarc    0.0",
  },
  {
    id: "x-d4-054",
    domain: "d4-python",
    difficulty: 5,
    topic: "exclude-outlier-effect",
    skill: "Quantifying an outlier's effect",
    caseId: "logistics",
    type: "predict",
    prompt:
      "runs holds the sixteen deliveries. The IQR fence for delay is 2.5 days. What does this print?",
    code:
      'clean = runs[runs["delay"] <= 2.5]\nprint(len(clean))\nprint(round(clean["delay"].mean(), 3))',
    lines: 2,
    expectedOutput: "15\n0.333",
  },
  {
    id: "x-d4-055",
    domain: "d4-python",
    difficulty: 5,
    topic: "chained-assignment",
    skill: "Filtering then assigning",
    caseId: null,
    type: "mcq",
    prompt:
      "You write df[df['state'] == 'Lagos']['fee'] = 0 and the fees do not change. Why?",
    options: [
      { id: "a", text: "The first filter may return a copy, so the assignment lands on a temporary object — use .loc with both the row condition and the column" },
      { id: "b", text: "Fees cannot be set to zero" },
      { id: "c", text: "The comparison should use == 'lagos' in lower case" },
      { id: "d", text: "pandas requires a loop for conditional assignment" },
    ],
    correct: "a",
    explanation:
      "This is chained assignment. df.loc[df['state'] == 'Lagos', 'fee'] = 0 does it in one indexing operation, which is why .loc exists.",
  },
];

export default ITEMS;
