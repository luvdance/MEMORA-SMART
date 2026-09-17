/**
 * MODULE · VISUAL & STATISTICAL ANALYSIS (m4-visual-analysis)
 * Month 4 — Python & Capstone
 *
 * The last taught module before the capstone. Matplotlib for the pictures, and
 * "enough statistics to avoid saying something wrong" — which the module
 * summary is right to put in those terms, because the failure mode here is not
 * a broken chart, it is a confident sentence the data does not support.
 *
 * LIVE PRACTICE, INCLUDING THE PLOTS
 * Every code atom is runnable in the browser, and the plotting ones return a
 * real PNG drawn by matplotlib in Pyodide. Verified end to end in a headless
 * browser: matplotlib loads in about sixteen seconds on a warm CDN, the figure
 * comes back as a 15 KB base64 PNG, and it renders. So a learner can change a
 * colour, a bin count or an axis limit and see what it does — which is the only
 * way chart judgement is ever actually acquired.
 *
 * VERIFIED against pandas 3.0.5 and matplotlib 3.11.2. Everything the lessons
 * quote was produced by running the code, and the validator re-runs it all.
 * One portability note: the boxplot uses set_xticklabels rather than the newer
 * tick_labels argument, because Pyodide may ship an older matplotlib.
 *
 * THE DATASET is the twelve Month 2 orders, so every statistic can be checked
 * against a figure the learner already trusts:
 *   Lagos 276,000 · Abuja 215,000 · Kano 127,000 · total 618,000
 *   mean 51,500 · median 48,000 · std 16,735.92 · skew 2.115
 *   Q1 42,500 · Q3 55,250 · IQR 12,750 · fence 74,375 → flags ORD-6
 *   units against amount: r = -0.039
 *
 * CLIENT-SAFE. Knowledge-check answers live in lib/academy/assessments/.
 */

export const SECTION_ID = "s17-visual-analysis";

const SETUP = `import pandas as pd

orders = pd.DataFrame({
    "order":  ["ORD-1","ORD-2","ORD-3","ORD-4","ORD-5","ORD-6","ORD-7","ORD-8","ORD-9","ORD-10","ORD-11","ORD-12"],
    "state":  ["Lagos","Abuja","Lagos","Kano","Lagos","Abuja","Kano","Lagos","Abuja","Lagos","Kano","Lagos"],
    "month":  ["Jan","Jan","Jan","Feb","Feb","Feb","Mar","Mar","Mar","Mar","Jan","Feb"],
    "amount": [45000, 62000, 38000, 51000, 47000, 98000, 43000, 56000, 55000, 49000, 33000, 41000],
    "units":  [3, 12, 9, 2, 4, 6, 11, 5, 3, 14, 4, 10],
})
`;

const PLOT = ["pandas", "matplotlib"];
const PANDAS = ["pandas"];

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════ */
  {
    id: "l80-descriptive-stats",
    moduleId: "m4-visual-analysis",
    sectionId: SECTION_ID,
    order: 1,
    title: "Descriptive Statistics in pandas",
    subtitle: "The Month 2 statistics, as one-line methods",
    estimatedMinutes: 16,
    intro:
      "You computed all of these in Excel by hand. In pandas each is a method, which means the interesting part is no longer getting the number — it is knowing which number the question needed.",

    atoms: [
      {
        id: "a-va-central",
        title: "mean, median, std and quantile",
        explain:
          "Four methods on a column. quantile takes a list and returns several cut points at once, so Q1, the median and Q3 arrive together.",
        codeExercise: {
          code: SETUP + '\nprint(orders["amount"].mean())\nprint(orders["amount"].median())\nprint(orders["amount"].std())\nprint(orders["amount"].quantile([0.25, 0.5, 0.75]).tolist())\n',
          question:
            "Twelve orders totalling ₦618,000. What are the four lines? The middle two values sorted are 47,000 and 49,000.",
          expectedOutput:
            "51500.0\n48000.0\n16735.916738885535\n[42500.0, 48000.0, 55250.0]",
          runnable: true,
          packages: PANDAS,
          hint: "618,000 ÷ 12 for the mean. The median of an even count is the average of the two middle values. std prints its full floating-point tail.",
          successMessage:
            "Mean ₦51,500, median ₦48,000. pandas' std() is the SAMPLE standard deviation by default — the equivalent of STDEV.S, not STDEV.P — which matters if you are reconciling against someone else's figure.",
        },
        table: {
          caption: "The same statistics, four tools.",
          headers: ["Excel", "DAX", "pandas"],
          rows: [
            ["AVERAGE()", "AVERAGE()", ".mean()"],
            ["MEDIAN()", "MEDIAN()", ".median()"],
            ["STDEV.S()", "STDEV.S()", ".std()  — sample by default"],
            ["QUARTILE.INC(r,1)", "—", ".quantile(0.25)"],
            ["COUNT()", "COUNTROWS()", ".count()"],
          ],
          note: "For the population standard deviation, pass ddof=0: .std(ddof=0). The default of ddof=1 is the sample version.",
        },
      },
      {
        id: "a-va-iqr",
        title: "The outlier fence, in four lines",
        explain:
          "Q3 plus one and a half times the interquartile range, then filter for anything above it. The Month 2 rule, expressed as code you can re-run on any column.",
        codeExercise: {
          code: SETUP + '\nq1 = orders["amount"].quantile(0.25)\nq3 = orders["amount"].quantile(0.75)\niqr = q3 - q1\nfence = q3 + 1.5 * iqr\nprint(q1, q3, iqr)\nprint(fence)\nprint(orders.loc[orders["amount"] > fence, "order"].tolist())\n',
          question:
            "Q1 is 42,500 and Q3 is 55,250. What are the three lines of output?",
          expectedOutput: "42500.0 55250.0 12750.0\n74375.0\n['ORD-6']",
          runnable: true,
          packages: PANDAS,
          hint: "IQR is Q3 minus Q1. The fence is Q3 plus 1.5 × IQR. Then find which order exceeds it — there is exactly one.",
          successMessage:
            "A fence of ₦74,375, and ORD-6 at ₦98,000 is the only order above it. The same rule, the same answer, the third tool — and now it is four lines you can point at any numeric column rather than a manual calculation.",
        },
        why: "Writing it as code rather than doing it by hand means the rule is applied identically every time, and the threshold is visible in the script for anyone who challenges the exclusion.",
      },
      {
        id: "a-va-skew",
        title: "Quantifying the skew",
        explain:
          "When the mean sits above the median the distribution has a long right tail. skew() puts a number on it: positive means right-tailed, and anything beyond about 1 is pronounced.",
        code: {
          code: SETUP + '\nprint(round(orders["amount"].mean(), 2))\nprint(orders["amount"].median())\nprint(round(orders["amount"].mean() - orders["amount"].median(), 2))\nprint(round(orders["amount"].skew(), 3))\n',
          expectedOutput: "51500.0\n48000.0\n3500.0\n2.115",
          runnable: true,
          packages: PANDAS,
        },
        why: "A skew of 2.1 is strongly right-tailed, which is the numerical version of the Month 2 finding that one large order drags the mean up. It also tells you which statistic to report: with skew this high, quote the median.",
        table: {
          caption: "Reading a skew value.",
          headers: ["skew()", "Shape", "Report"],
          rows: [
            ["about 0", "Roughly symmetric", "The mean is fine"],
            ["above +1", "Long right tail — a few large values", "The median"],
            ["below −1", "Long left tail", "The median"],
            ["between −0.5 and +0.5", "Near enough symmetric", "Either"],
          ],
          note: "This replaces eyeballing the mean-median gap with a threshold you can apply consistently — and state in a footnote.",
        },
      },
      {
        id: "a-va-share",
        title: "Shares, and the rounding that does not add to 100",
        explain:
          "Divide each group by the total and multiply by 100. Round the result and the parts may no longer sum to exactly 100.",
        codeExercise: {
          code: SETUP + '\nby_state = orders.groupby("state")["amount"].sum()\nshare = (by_state / by_state.sum() * 100).round(1)\nprint(share)\nprint(share.sum())\n',
          question:
            "Lagos ₦276,000, Abuja ₦215,000, Kano ₦127,000 of ₦618,000. Shares to one decimal place — and what do they sum to?",
          expectedOutput:
            "state\nAbuja    34.8\nKano     20.6\nLagos    44.7\nName: amount, dtype: float64\n100.1",
          runnable: true,
          packages: PANDAS,
          hint: "Each share is its own division rounded to one place. Add the three rounded numbers rather than assuming they make 100.",
          successMessage:
            "100.1, not 100. Three correct figures whose total is wrong — a real property of rounding, and the same artefact you met in lesson 67. Footnote it, or adjust the largest component down; do not let a client find it first.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  {
    id: "l81-bar-line-hist",
    moduleId: "m4-visual-analysis",
    sectionId: SECTION_ID,
    order: 2,
    title: "Bar, Line and Histogram",
    subtitle: "Drawing the three charts that answer most questions",
    estimatedMinutes: 18,
    intro:
      "Every rule from the visualisation module still applies — you are just drawing the charts yourself now. Press Run on each of these and change something: a colour, a bin count, a title.",

    atoms: [
      {
        id: "a-va-bar",
        title: "A bar chart, made properly",
        explain:
          "Sort the data, label the bars directly, remove the top and right spines, and put the finding in the title. Four extra lines, and the chart stops being a default.",
        code: {
          code: SETUP + '\nimport matplotlib.pyplot as plt\n\nby_state = orders.groupby("state")["amount"].sum().sort_values(ascending=False)\n\nfig, ax = plt.subplots(figsize=(6, 3.2))\nax.bar(by_state.index, by_state.values, color="#3b52f0")\nax.set_title("Lagos leads on revenue, from more orders")\nax.set_ylabel("Revenue (NGN)")\nfor name, value in by_state.items():\n    ax.text(name, value, f"{value:,}", ha="center", va="bottom", fontsize=9)\nax.spines[["top", "right"]].set_visible(False)\nprint("drew", len(by_state), "bars")\n',
          expectedOutput: "drew 3 bars",
          runnable: true,
          packages: PLOT,
        },
        why: "Every choice here is a rule from Month 2 and Month 3, now written out: sorted so the ranking is readable, labelled so nobody reads values off an axis, spines removed because they carry no information, and a title that states the finding rather than naming the fields.",
        table: {
          caption: "The four lines that separate a default chart from a finished one.",
          headers: ["Line", "Rule it applies"],
          rows: [
            [".sort_values(ascending=False)", "Sort a categorical bar chart"],
            ["ax.text(...) per bar", "Direct labels, so no axis-reading"],
            ["ax.set_title(finding)", "Titles state findings, not fields"],
            ["spines set_visible(False)", "Remove chart junk"],
          ],
          note: "One colour for one series, too. A different colour per bar in a single-series chart makes the reader look for a meaning that is not there.",
        },
      },
      {
        id: "a-va-line",
        title: "A line chart, with the axis starting at zero",
        explain:
          "Time goes on a line. reindex puts the months in calendar order rather than alphabetical, and set_ylim(0) keeps the baseline honest.",
        codeExercise: {
          code: SETUP + '\nimport matplotlib.pyplot as plt\n\norder = ["Jan", "Feb", "Mar"]\nby_month = orders.groupby("month")["amount"].sum().reindex(order)\nprint(by_month.tolist())\n\nfig, ax = plt.subplots(figsize=(6, 3.2))\nax.plot(by_month.index, by_month.values, marker="o", linewidth=2, color="#3b52f0")\nax.set_ylim(0)\nax.set_title("February peaked; March eased back")\nax.spines[["top", "right"]].set_visible(False)\n',
          question:
            "The months are grouped and reindexed into calendar order. What does the printed list contain?",
          expectedOutput: "[178000, 237000, 203000]",
          runnable: true,
          packages: PLOT,
          hint: "Jan has ORD-1, ORD-2, ORD-3 and ORD-11. Feb has ORD-4, ORD-5, ORD-6 and ORD-12. The rest are March.",
          successMessage:
            "₦178,000, ₦237,000, ₦203,000 — the same monthly figures as the Month 2 pivot table. Two details matter here: reindex fixes the Apr-Aug-Dec alphabetical problem from the modelling module, and set_ylim(0) stops the chart exaggerating the change.",
        },
        why: "Without reindex, groupby sorts the months alphabetically — Feb, Jan, Mar — which is the same sort-order bug the date-table lesson warned about, appearing for a third time in a third tool.",
      },
      {
        id: "a-va-hist",
        title: "A histogram shows the shape",
        explain:
          "A histogram buckets one numeric column and counts how many fall in each bucket. It answers 'what does a typical order look like' in a way no single statistic can.",
        code: {
          code: SETUP + '\nimport matplotlib.pyplot as plt\n\nfig, ax = plt.subplots(figsize=(6, 3.2))\nax.hist(orders["amount"], bins=6, color="#3b52f0", edgecolor="white")\nax.set_title("Most orders cluster below 60,000")\nax.set_xlabel("Order amount (NGN)")\nax.set_ylabel("Number of orders")\nprint("bins drawn")\n',
          expectedOutput: "bins drawn",
          runnable: true,
          packages: PLOT,
        },
        why: "The skew of 2.1 from the last lesson is a number; the histogram is the picture of it — a cluster on the left and one bar out on the right. Run it and change bins to 3, then to 20, and watch the story change. That sensitivity is the histogram's one real weakness.",
        mistake:
          "Accepting the default bin count without looking. Too few bins hides the shape; too many turns it into noise. Try a handful and choose the one that shows the structure honestly.",
      },
      {
        id: "a-va-bands",
        title: "Bands, when a histogram is too vague",
        explain:
          "pd.cut assigns each value to a labelled band, and value_counts then gives you a readable table. It is the number behind the histogram, and it is easier to put in a sentence.",
        codeExercise: {
          code: SETUP + '\nimport pandas as pd\nbins = [0, 40000, 60000, 100000]\nlabels = ["under 40k", "40k-60k", "over 60k"]\nbanded = pd.cut(orders["amount"], bins=bins, labels=labels)\nprint(banded.value_counts().sort_index())\n',
          question:
            "Twelve orders bucketed into three bands. Two are below ₦40,000 and two above ₦60,000. What does the table show?",
          expectedOutput:
            "amount\nunder 40k    2\n40k-60k      8\nover 60k     2\nName: count, dtype: int64",
          runnable: true,
          packages: PANDAS,
          hint: "Under 40k: 38,000 and 33,000. Over 60k: 62,000 and 98,000. Everything else is in the middle.",
          successMessage:
            "Eight of twelve orders — two thirds — sit between ₦40,000 and ₦60,000. That is a sentence you can say out loud, which a histogram's shape is not. This is the number-grouping idea from the pivot module, in pandas.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  {
    id: "l82-scatter-box-correlation",
    moduleId: "m4-visual-analysis",
    sectionId: SECTION_ID,
    order: 3,
    title: "Scatter, Box Plots and Correlation",
    subtitle: "Testing a relationship, and putting a number on it",
    estimatedMinutes: 18,
    intro:
      "The visualisation module showed you a scatter plot of units against amount and told you the correlation was −0.04. Now you compute it yourself — and meet the two ways a correlation coefficient misleads people.",

    atoms: [
      {
        id: "a-va-corr",
        title: "corr() — one number for a relationship",
        explain:
          "Series.corr() gives the Pearson correlation between two columns: +1 is a perfect rise together, −1 a perfect inverse, 0 no linear relationship at all.",
        codeExercise: {
          code: SETUP + '\nprint(round(orders["units"].corr(orders["amount"]), 3))\nprint(round(orders[["units", "amount"]].corr().loc["units", "amount"], 3))\n',
          question:
            "Two ways of asking the same question about units and amount. What do both lines print?",
          expectedOutput: "-0.039\n-0.039",
          runnable: true,
          packages: PANDAS,
          hint: "The same coefficient, computed as a pair and as a matrix. It is very close to zero.",
          successMessage:
            "−0.039 — the figure quoted in the visualisation module, now computed rather than asserted. Essentially no linear relationship: the number of items in an order tells you nothing about its value, because value is driven by WHAT is bought.",
        },
        table: {
          caption: "Reading a coefficient — with the caveats that matter.",
          headers: ["r", "Means", "Careful"],
          rows: [
            ["±0.9 to 1.0", "Very strong", "Check it is not the same thing twice"],
            ["±0.5 to 0.9", "Moderate to strong", "Still says nothing about cause"],
            ["±0.1 to 0.5", "Weak", "Easily produced by chance in small data"],
            ["about 0", "No LINEAR relationship", "A curve can score 0 and still be a relationship"],
          ],
          note: "That last row is the one people forget. Pearson measures straight-line association only, so always look at the scatter as well as the number.",
        },
      },
      {
        id: "a-va-corr-trap",
        title: "When r = 1.0, you have correlated something with itself",
        explain:
          "A coefficient of exactly 1 almost never means a discovery. It means the two columns are the same information — one is derived from the other.",
        codeExercise: {
          code: SETUP + '\norders["line_total"] = orders["amount"] * 1.075\nprint(round(orders["amount"].corr(orders["line_total"]), 3))\n',
          question:
            "line_total is amount plus 7.5% tax. What is the correlation between amount and line_total?",
          expectedOutput: "1.0",
          runnable: true,
          packages: PANDAS,
          hint: "One column is the other multiplied by a constant. How tightly can two things move together?",
          successMessage:
            "Exactly 1.0 — a perfect correlation that discovers nothing, because line_total IS amount with tax added. If you ever find a near-perfect correlation in real data, check first whether one column is derived from the other; that is the explanation far more often than a genuine finding.",
        },
        why: "This happens constantly with real data: revenue against revenue-including-VAT, sales against commission, units against units-times-price. A spectacular coefficient is a reason to be suspicious before it is a reason to be pleased.",
      },
      {
        id: "a-va-scatter",
        title: "Always draw the scatter too",
        explain:
          "Put the coefficient in the title so the number and the picture cannot disagree. The f-string formats it to two places.",
        code: {
          code: SETUP + '\nimport matplotlib.pyplot as plt\n\nr = orders["units"].corr(orders["amount"])\nfig, ax = plt.subplots(figsize=(6, 3.2))\nax.scatter(orders["units"], orders["amount"], s=60, color="#3b52f0", alpha=0.8)\nax.set_title(f"No relationship: r = {r:.2f}")\nax.set_xlabel("Units in the order")\nax.set_ylabel("Order amount (NGN)")\nprint(f"r = {r:.2f}")\n',
          expectedOutput: "r = -0.04",
          runnable: true,
          packages: PLOT,
        },
        why: "A coefficient alone hides a curve, two clusters and a single outlier driving everything. Drawing the scatter takes one line and it is the only way to see which of those you have — and putting r in the title means a reader gets both at once.",
      },
      {
        id: "a-va-box",
        title: "Box plots compare distributions, not just averages",
        explain:
          "One box per group, showing the median, the middle half and the range. It answers 'which group is most consistent', which a bar chart of averages cannot.",
        code: {
          code: SETUP + '\nimport matplotlib.pyplot as plt\n\ngroups = [g["amount"].values for _, g in orders.groupby("state")]\nnames = [name for name, _ in orders.groupby("state")]\nprint(names)\n\nfig, ax = plt.subplots(figsize=(6, 3.2))\nax.boxplot(groups)\nax.set_xticks(range(1, len(names) + 1))\nax.set_xticklabels(names)\nax.set_title("Abuja has the widest spread")\nprint("boxes:", len(groups))\n',
          expectedOutput: "['Abuja', 'Kano', 'Lagos']\nboxes: 3",
          runnable: true,
          packages: PLOT,
        },
        why: "Abuja runs from ₦55,000 to ₦98,000 with a median of ₦62,000; Lagos from ₦38,000 to ₦56,000 with a median of ₦46,000. Abuja's orders are both larger and far less predictable — a difference in consistency that a chart of averages would have hidden completely.",
        table: {
          caption: "What each part of a box shows.",
          headers: ["Part", "Shows"],
          rows: [
            ["The line in the box", "The median"],
            ["The box", "Q1 to Q3 — the middle half"],
            ["The whiskers", "The range, within 1.5 × IQR"],
            ["Dots beyond the whiskers", "Outliers, by the same rule as lesson 23"],
          ],
          note: "The box plot is the IQR fence drawn as a picture. Those dots are exactly the orders your fence calculation flags.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  {
    id: "l83-uncertainty",
    moduleId: "m4-visual-analysis",
    sectionId: SECTION_ID,
    order: 4,
    title: "Communicating Uncertainty",
    subtitle: "Small samples, honest axes, and what not to claim",
    estimatedMinutes: 17,
    intro:
      "The last lesson before the capstone, and the one most likely to save your reputation. Everything here is about the gap between what the numbers say and what it is safe to write down.",

    atoms: [
      {
        id: "a-va-small-n",
        title: "Three orders is not a trend",
        explain:
          "Kano's average order is ₦42,333 with a standard deviation of ₦9,018 — from three orders. The average is arithmetically correct and it is not a reliable estimate of anything.",
        codeExercise: {
          code: SETUP + '\nkano = orders.loc[orders["state"] == "Kano", "amount"]\nprint(len(kano))\nprint(kano.mean())\nprint(round(kano.std(), 2))\nprint(kano.tolist())\n',
          question:
            "Kano's orders are ₦51,000, ₦43,000 and ₦33,000. What are the four lines?",
          expectedOutput: "3\n42333.333333333336\n9018.5\n[51000, 43000, 33000]",
          runnable: true,
          packages: PANDAS,
          hint: "Three values. Their mean prints with a floating-point tail. The standard deviation is the sample one, rounded to two places.",
          successMessage:
            "A standard deviation of ₦9,018 on a mean of ₦42,333 — the spread is over a fifth of the average, from three data points. Report it as 'three orders averaging about ₦42,000' and the reader can judge it. Report '₦42,333' alone and you have implied a precision you do not have.",
        },
        table: {
          caption: "What to say at each sample size.",
          headers: ["n", "Safe to say", "Not safe"],
          rows: [
            ["Under 5", "The individual values", "An average, unqualified"],
            ["5 to 30", "An average, with n and the spread", "A trend, or a forecast"],
            ["Over 30", "An average and a comparison", "Causation"],
            ["Any n", "What you measured", "What caused it"],
          ],
          note: "Always print n beside a group statistic. A mean of three things and a mean of three thousand look identical on a slide, and only one of them means anything.",
        },
      },
      {
        id: "a-va-axis-honesty",
        title: "The truncated axis",
        explain:
          "Lagos earns 2.17 times Kano. Start the y-axis at zero and the bars show that ratio. Start it at 120,000 and Lagos looks many times larger — same data, different impression.",
        codeExercise: {
          code: SETUP + '\nby_state = orders.groupby("state")["amount"].sum()\nprint(by_state["Lagos"], by_state["Kano"])\nprint(round(by_state["Lagos"] / by_state["Kano"], 2))\n',
          question:
            "Lagos ₦276,000 against Kano ₦127,000. What is the real ratio?",
          expectedOutput: "276000 127000\n2.17",
          runnable: true,
          packages: PANDAS,
          hint: "Divide the larger by the smaller and round to two places.",
          successMessage:
            "2.17 times — a real and reportable difference. Now imagine the same chart with the axis starting at ₦120,000: Lagos's bar would be over ten times the height of Kano's. Nothing in the data changed. On a BAR chart, always start the axis at zero, because the bar's LENGTH is the message.",
        },
        table: {
          caption: "When a non-zero axis is acceptable.",
          headers: ["Chart", "Zero baseline", "Why"],
          rows: [
            ["Bar or column", "Always required", "Length encodes the value"],
            ["Line, over time", "Often optional", "Slope encodes the change"],
            ["Line, small variation", "Say so on the chart", "A zoomed axis can mislead"],
            ["Scatter", "Not needed", "Position, not length, carries meaning"],
          ],
          note: "ax.set_ylim(0) on every bar chart, by reflex. On a line chart, zooming can be legitimate — but label it so the reader knows.",
        },
      },
      {
        id: "a-va-what-not-to-claim",
        title: "What the numbers do not entitle you to say",
        explain:
          "A correlation is not a cause. A difference between small groups may be noise. A three-month trend is not a forecast. Each of these is a sentence to avoid writing rather than a calculation to get right.",
        why: "Everything technical in this course can be checked by someone else. The claims in your write-up usually cannot, which makes them the place where your judgement is actually visible — and where an overstatement does the most damage.",
        table: {
          caption: "Rewriting four overstatements.",
          headers: ["Do not write", "Write instead"],
          rows: [
            ["Discounting drives volume", "Discount and volume move together; the cause is not established here"],
            ["Kano underperforms", "Kano's three orders average ₦42,000, against ₦46,000 in Lagos — too few to conclude"],
            ["Revenue will reach ₦250,000 in April", "Revenue rose to ₦237,000 in February and eased to ₦203,000 in March"],
            ["Bigger orders contain more items", "Order size and item count are uncorrelated here (r = −0.04)"],
          ],
          note: "Each right-hand version is shorter to defend and impossible to disprove, because it says only what was measured.",
        },
        mistake:
          "Writing the causal version because the honest one sounds weak. The honest one survives the meeting. The causal one survives until somebody mentions the summer campaign.",
      },
      {
        id: "a-va-checklist",
        title: "The analysis checklist, one last time",
        explain:
          "Profile, clean, check the total against something trusted, choose the right statistic for the shape, draw the chart, state n, and claim only what you measured.",
        why: "This is the same checklist as Month 2's project and Month 3's report, in a third toolset. The tools changed three times across this course; the order has not changed once, which is the real thing you have learned.",
        table: {
          caption: "The cycle, and this module's example of each.",
          headers: ["Step", "In pandas", "Here"],
          rows: [
            ["Profile", "shape, dtypes, describe", "12 orders, all numeric"],
            ["Check the total", "df['amount'].sum()", "₦618,000, matching Month 2"],
            ["Choose the statistic", "skew() decides mean or median", "skew 2.1 → report the median"],
            ["Find outliers by rule", "Q3 + 1.5 × IQR", "Fence ₦74,375 → ORD-6"],
            ["Test the relationship", ".corr() AND a scatter", "r = −0.04, no relationship"],
            ["Draw it honestly", "set_ylim(0), sorted, labelled", "Lagos 2.17× Kano"],
            ["State n", "len() beside every group mean", "Kano n=3 — too few"],
            ["Claim only what you measured", "—", "No causation from a correlation"],
          ],
          note: "Eight steps. You have now run them in Excel, in Power BI and in Python, on the same data, and got the same answers — which is the strongest evidence available that you understood the ideas rather than the buttons.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },
];
