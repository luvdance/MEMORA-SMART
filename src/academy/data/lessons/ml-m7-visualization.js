/**
 * MACHINE LEARNING AND AI · MODULE 7 · DATA VISUALIZATION
 *
 * Curriculum 7.1 – 7.10. Matplotlib's figure and axes model; line, bar,
 * histogram, scatter, box and heatmap charts; Seaborn; choosing the right
 * chart; and presenting insights. Every chart challenge draws a REAL
 * matplotlib figure, and the tests inspect the chart objects themselves
 * (bar heights, line data, titles, labels, colour bars), so a chart that
 * looks right but encodes the wrong numbers does not pass. Seaborn is not
 * available in the page's Python, so it is shown as reference code.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

export const SECTION_ID = "ml-s7-visualization";

const PY = "python";
const py = String.raw;

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 32 · 7.1 – 7.3
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ml-l32-matplotlib-line-bar",
    moduleId: "ml-m7-visualization",
    sectionId: SECTION_ID,
    order: 1,
    covers: ["7.1", "7.2", "7.3"],
    title: "Matplotlib, Line Charts and Bar Charts",
    subtitle: "Figures and axes, change over time, and comparisons between categories",
    estimatedMinutes: 34,
    intro:
      "A chart is the fastest way to see a pattern, and the fastest way to convince someone else of it. Matplotlib is the foundation of plotting in Python: pandas, Seaborn and most ML tools draw with it underneath.",

    atoms: [
      {
        id: "a-ml-matplotlib-intro",
        title: "Introduction to Matplotlib",
        explain:
          "Matplotlib, created by John Hunter in 2003, is imported as import matplotlib.pyplot as plt. Use its OBJECT-ORIENTED style: fig, ax = plt.subplots() creates a FIGURE (the whole canvas) and one AXES (a single plot area with its own x and y axis). You then call methods on ax: ax.plot(), ax.bar(), ax.set_title(), ax.set_xlabel(), ax.set_ylabel(), ax.legend(). plt.subplots(2, 2) gives a grid of four axes for small multiples. Every chart element is an object you can inspect afterwards, which is how this module's tests check your charts. When you press Run on plotting code here, the figure is drawn below the output.",
        codeExercise: {
          language: PY,
          code: py`import matplotlib.pyplot as plt

fig, axes = plt.subplots(1, 2, figsize=(8, 3))
left, right = axes
left.plot([1, 2, 3], [10, 20, 15])
left.set_title("Sales")
right.bar(["A", "B"], [5, 7])

print(len(fig.axes))
print(left.get_title(), len(left.get_lines()))
print([float(p.get_height()) for p in right.patches])
`,
          question: "One figure with two axes: a line on the left, bars on the right. What does inspecting the objects print?",
          expectedOutput: "2\nSales 1\n[5.0, 7.0]",
          hint: "The figure holds both axes. Each ax.plot call adds one line; each bar is a rectangle patch.",
          successMessage: "Figures contain axes; axes contain lines, patches and text. Thinking in these objects makes every customisation findable.",
        },
      },
      {
        id: "a-ml-line-charts",
        title: "Line charts",
        explain:
          "A LINE CHART shows how a value CHANGES over an ordered axis, usually time. ax.plot(x, y, label=\"Lagos\", marker=\"o\") draws one line; call it again for each series, then ax.legend() to name them. Always label the axes with units (\"Revenue (₦ millions)\"), give the chart a title that states what to look at, and start a y-axis at zero when the AMOUNT matters (not necessarily when only the change matters). Do not use lines for unordered categories: a line between \"Lagos\" and \"Kano\" implies a progression that does not exist. In ML, the most common line chart is the LEARNING CURVE: training and validation loss per epoch.",
        codeChallenge: {
          task:
            "Write plot_branches(months, lagos, abuja) that creates fig, ax = plt.subplots(), draws one line per branch with labels \"Lagos\" and \"Abuja\", sets the title \"Monthly revenue by branch\", the x label \"Month\" and the y label \"Revenue (₦m)\", adds a legend, and returns ax.",
          starter: "import matplotlib.pyplot as plt\n\ndef plot_branches(months, lagos, abuja):\n    pass\n",
          sample: "ax = plot_branches([\"Jan\", \"Feb\", \"Mar\"], [12, 15, 14], [8, 9, 13])",
          tests: [
            {
              check: py`ax = plot_branches(["Jan", "Feb", "Mar"], [12, 15, 14], [8, 9, 13])
lines = ax.get_lines()
assert len(lines) == 2, "Draw two lines, one per branch. Found " + str(len(lines))
assert [l.get_label() for l in lines] == ["Lagos", "Abuja"], "Label the lines Lagos and Abuja, in that order."
assert list(lines[0].get_ydata()) == [12, 15, 14] and list(lines[1].get_ydata()) == [8, 9, 13], "Each line must plot its branch's values."
assert ax.get_title() == "Monthly revenue by branch", "Set the title. Got " + repr(ax.get_title())
assert ax.get_xlabel() == "Month" and ax.get_ylabel() == "Revenue (₦m)", "Label both axes."
assert ax.get_legend() is not None, "Add a legend so the lines are named on the chart."`,
            },
          ],
          solution: py`import matplotlib.pyplot as plt

def plot_branches(months, lagos, abuja):
    fig, ax = plt.subplots()
    ax.plot(months, lagos, label="Lagos", marker="o")
    ax.plot(months, abuja, label="Abuja", marker="o")
    ax.set_title("Monthly revenue by branch")
    ax.set_xlabel("Month")
    ax.set_ylabel("Revenue (₦m)")
    ax.legend()
    return ax
`,
          hint: "fig, ax = plt.subplots(); ax.plot(months, lagos, label=\"Lagos\"); the same for Abuja; then set_title, set_xlabel, set_ylabel and ax.legend().",
          successMessage: "Two labelled lines, named axes with units, and a title: the minimum for a chart someone else can read without you there to explain it.",
        },
      },
      {
        id: "a-ml-bar-charts",
        title: "Bar charts",
        explain:
          "A BAR CHART compares a quantity across CATEGORIES. ax.bar(categories, values) draws vertical bars; ax.barh(categories, values) horizontal ones, which suit long category names and rankings. SORT the bars by value unless the categories have a natural order (months, sizes): sorted bars make the ranking obvious. Bars must START AT ZERO, because the eye compares bar lengths; a truncated axis makes a 5% difference look like 300%. Grouped bars (offset positions) compare subgroups side by side; stacked bars show a total and its parts, but only the bottom segment is easy to compare.",
        codeChallenge: {
          task:
            "Write ranked_bars(revenue) where revenue is a dictionary {branch: value}. Create fig, ax = plt.subplots() and draw a HORIZONTAL bar chart with the largest branch at the TOP: sort the items ascending by value before calling ax.barh (barh draws the first item at the bottom). Set the x label \"Revenue (₦m)\" and return ax.",
          starter: "import matplotlib.pyplot as plt\n\ndef ranked_bars(revenue):\n    pass\n",
          sample: "ranked_bars({\"Lagos\": 333, \"Abuja\": 374, \"Kano\": 493}) → Kano's bar at the top",
          tests: [
            {
              check: py`ax = ranked_bars({"Lagos": 333, "Abuja": 374, "Kano": 493, "Enugu": 120})
bars = ax.patches
assert len(bars) == 4, "One bar per branch. Found " + str(len(bars))
widths = [b.get_width() for b in bars]
assert widths == [120, 333, 374, 493], "Use barh with values sorted ascending, so the largest is drawn last (at the top). Got " + repr(widths)
assert all(b.get_height() < 1 and b.get_x() == 0 for b in bars), "Horizontal bars starting at zero: use ax.barh."
labels = [t.get_text() for t in ax.get_yticklabels()]
assert labels == ["Enugu", "Lagos", "Abuja", "Kano"], "Branch names on the y axis, in the same order. Got " + repr(labels)
assert ax.get_xlabel() == "Revenue (₦m)", "Label the x axis."`,
            },
          ],
          solution: py`import matplotlib.pyplot as plt

def ranked_bars(revenue):
    items = sorted(revenue.items(), key=lambda kv: kv[1])
    fig, ax = plt.subplots()
    ax.barh([k for k, _ in items], [v for _, v in items])
    ax.set_xlabel("Revenue (₦m)")
    return ax
`,
          hint: "items = sorted(revenue.items(), key=lambda kv: kv[1]); ax.barh(names, values) draws the first item at the bottom, so ascending order puts the largest at the top.",
          successMessage: "Sorted, horizontal, starting at zero: a ranking anyone can read in two seconds.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 33 · 7.4 – 7.6
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ml-l33-hist-scatter-box",
    moduleId: "ml-m7-visualization",
    sectionId: SECTION_ID,
    order: 2,
    covers: ["7.4", "7.5", "7.6"],
    title: "Histograms, Scatter Plots and Box Plots",
    subtitle: "Distributions, relationships and comparisons of spread",
    estimatedMinutes: 38,
    intro:
      "These three charts are the workhorses of EDA: a histogram shows one variable's distribution, a scatter plot two variables' relationship, and a box plot compares distributions across groups, outliers included.",

    atoms: [
      {
        id: "a-ml-histograms",
        title: "Histograms",
        explain:
          "A HISTOGRAM shows a numeric variable's DISTRIBUTION: the range is cut into BINS and each bar's height is the number of values in that bin. ax.hist(values, bins=20) draws one; the bar edges are returned so you can inspect them. The bin count changes what you see: too few bins hide shape, too many make noise. Use it to spot skew, multiple peaks and outliers at a glance. Unlike a bar chart, the bars touch, because the x axis is continuous. density=True rescales heights so the total area is 1, which lets you compare distributions of different sizes or overlay a normal curve.",
        codeChallenge: {
          task:
            "Write plot_hist(values, bins) that creates fig, ax = plt.subplots(), draws a histogram of values with the given number of bins and edgecolor=\"white\", sets the title \"Distribution of order values\", and returns a tuple (ax, counts) where counts is the list of bar heights as integers (ax.hist returns the counts as its first result).",
          starter: "import matplotlib.pyplot as plt\n\ndef plot_hist(values, bins):\n    pass\n",
          sample: "plot_hist([1, 2, 2, 3, 3, 3, 4], 3) → counts [1, 2, 4]",
          tests: [
            {
              check: py`import numpy as np
ax, counts = plot_hist([1, 2, 2, 3, 3, 3, 4], 3)
assert counts == [1, 2, 4], "Three bins from 1 to 4: [1, 2), [2, 3) and [3, 4] hold 1, 2 and 4 values. Got " + repr(counts)
assert all(isinstance(c, int) for c in counts), "Return the counts as Python ints."
rng = np.random.default_rng(1)
vals = rng.lognormal(9, 0.6, 500)
ax, counts = plot_hist(vals, 25)
assert len(ax.patches) == 25 and sum(counts) == 500, "25 bins holding all 500 values."
assert ax.get_title() == "Distribution of order values", "Set the title."`,
            },
          ],
          solution: py`import matplotlib.pyplot as plt

def plot_hist(values, bins):
    fig, ax = plt.subplots()
    counts, edges, patches = ax.hist(values, bins=bins, edgecolor="white")
    ax.set_title("Distribution of order values")
    return ax, [int(c) for c in counts]
`,
          hint: "counts, edges, patches = ax.hist(values, bins=bins, edgecolor=\"white\"). Convert counts with [int(c) for c in counts].",
          successMessage: "500 log-normal order values make the classic right-skewed shape: a peak on the left and a long tail of large orders.",
        },
      },
      {
        id: "a-ml-scatter-plots",
        title: "Scatter plots",
        explain:
          "A SCATTER PLOT draws one point per row at (x, y), showing the RELATIONSHIP between two numeric variables: its direction, strength, shape (straight or curved), clusters and outliers, which a single correlation number cannot show. ax.scatter(x, y, c=labels, cmap=\"coolwarm\", alpha=0.6, s=20): c colours points by a third variable (often the class), alpha makes overlapping points visible, s sets the size. In classification, a scatter of two features coloured by class shows at once whether the classes are separable, and later you will draw a model's decision boundary over exactly this plot.",
        codeChallenge: {
          task:
            "Write plot_classes(X, y) where X is a NumPy array with two columns and y an array of 0/1 labels. Create fig, ax = plt.subplots() and call ax.scatter ONCE PER CLASS: class 0 with label \"stayed\" and class 1 with label \"churned\", each with alpha=0.6. Label the axes \"Tenure (months)\" and \"Monthly spend (₦k)\", add a legend, and return ax.",
          starter: "import matplotlib.pyplot as plt\n\ndef plot_classes(X, y):\n    pass\n",
          sample: "two coloured clouds of points, one per class",
          tests: [
            {
              check: py`import numpy as np
rng = np.random.default_rng(0)
X = np.vstack([rng.normal([30, 12], 4, (40, 2)), rng.normal([6, 4], 3, (25, 2))])
y = np.array([0] * 40 + [1] * 25)
ax = plot_classes(X, y)
cols = ax.collections
assert len(cols) == 2, "Call ax.scatter once per class. Found " + str(len(cols)) + " point sets."
assert [c.get_label() for c in cols] == ["stayed", "churned"], "Labels: stayed, then churned."
assert np.allclose(cols[0].get_offsets(), X[y == 0]) and np.allclose(cols[1].get_offsets(), X[y == 1]), "Each set must contain exactly that class's points: use X[y == 0] and X[y == 1]."
assert all(abs(c.get_alpha() - 0.6) < 1e-9 for c in cols), "Use alpha=0.6."
assert ax.get_xlabel() == "Tenure (months)" and ax.get_ylabel() == "Monthly spend (₦k)", "Label both axes."
assert ax.get_legend() is not None, "Add a legend."`,
            },
          ],
          solution: py`import matplotlib.pyplot as plt

def plot_classes(X, y):
    fig, ax = plt.subplots()
    for value, name in [(0, "stayed"), (1, "churned")]:
        pts = X[y == value]
        ax.scatter(pts[:, 0], pts[:, 1], label=name, alpha=0.6)
    ax.set_xlabel("Tenure (months)")
    ax.set_ylabel("Monthly spend (₦k)")
    ax.legend()
    return ax
`,
          hint: "pts = X[y == 0] selects class 0's rows; ax.scatter(pts[:, 0], pts[:, 1], label=\"stayed\", alpha=0.6). Repeat for class 1.",
          successMessage: "The two classes form separate clouds: a simple model will classify these well. When clouds overlap heavily, no model will.",
        },
      },
      {
        id: "a-ml-box-plots",
        title: "Box plots",
        explain:
          "A BOX PLOT summarises a distribution in five numbers: the BOX spans Q1 to Q3 (the middle 50%), the line inside is the MEDIAN, the WHISKERS reach the furthest points within 1.5 × IQR, and points beyond are drawn individually as OUTLIERS (the IQR rule from Module 6). Box plots shine when COMPARING groups side by side: rent by area, salary by department, model error by month. ax.boxplot(list_of_arrays, tick_labels=names) draws one box per group. They hide shape (two peaks look like one), so pair them with histograms when the shape matters.",
        codeChallenge: {
          task:
            "Write plot_rent_by_area(df) where df has columns area and rent_m. Create fig, ax = plt.subplots() and draw ONE box per area, with areas in alphabetical order, using ax.boxplot(groups, tick_labels=areas). Set the y label \"Rent (₦m)\" and return ax.",
          starter: "import matplotlib.pyplot as plt\n\ndef plot_rent_by_area(df):\n    pass\n",
          sample: "four boxes: Ikeja, Lekki, Surulere, Yaba",
          tests: [
            {
              check: py`import numpy as np
import pandas as pd
rng = np.random.default_rng(5)
df = pd.DataFrame({
    "area": rng.choice(["Lekki", "Yaba", "Ikeja", "Surulere"], 200),
    "rent_m": rng.normal(20, 6, 200).round(1),
})
ax = plot_rent_by_area(df)
labels = [t.get_text() for t in ax.get_xticklabels()]
assert labels == ["Ikeja", "Lekki", "Surulere", "Yaba"], "One box per area, alphabetical. Got " + repr(labels)
want = df.groupby("area")["rent_m"].median().tolist()
drawn = [float(np.mean(l.get_ydata())) for l in ax.lines if len(l.get_xdata()) == 2 and l.get_ydata()[0] == l.get_ydata()[1]]
assert all(any(abs(m - d) < 1e-9 for d in drawn) for m in want), "Each box's median line must match that area's median rent."
assert ax.get_ylabel() == "Rent (₦m)", "Label the y axis."
assert calls("boxplot"), "Use ax.boxplot."`,
            },
          ],
          solution: py`import matplotlib.pyplot as plt

def plot_rent_by_area(df):
    areas = sorted(df["area"].unique())
    groups = [df.loc[df["area"] == a, "rent_m"].to_numpy() for a in areas]
    fig, ax = plt.subplots()
    ax.boxplot(groups, tick_labels=areas)
    ax.set_ylabel("Rent (₦m)")
    return ax
`,
          hint: "areas = sorted(df[\"area\"].unique()); groups = [df.loc[df[\"area\"] == a, \"rent_m\"] for a in areas]; ax.boxplot(groups, tick_labels=areas).",
          successMessage: "Side-by-side boxes compare medians, spreads and outliers of four groups in one glance: the chart version of a groupby describe().",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 34 · 7.7 – 7.8
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ml-l34-heatmaps-seaborn",
    moduleId: "ml-m7-visualization",
    sectionId: SECTION_ID,
    order: 3,
    covers: ["7.7", "7.8"],
    title: "Heatmaps and Seaborn",
    subtitle: "A whole matrix in colour, and statistical charts in one line",
    estimatedMinutes: 32,
    intro:
      "A heatmap turns a matrix of numbers into colour, so a correlation matrix or a confusion matrix can be read at a glance. Seaborn builds such statistical charts on top of matplotlib with far less code.",

    atoms: [
      {
        id: "a-ml-heatmaps",
        title: "Heatmaps",
        explain:
          "A HEATMAP colours each cell of a matrix by its value. In matplotlib: im = ax.imshow(matrix, cmap=\"coolwarm\", vmin=−1, vmax=1) draws it, fig.colorbar(im, ax=ax) adds the colour scale, ax.set_xticks/set_xticklabels name the columns, and ax.text(j, i, value) writes the number in each cell (ANNOTATIONS). Use a DIVERGING colour map (coolwarm, RdBu) centred on zero for values with a meaningful midpoint, such as correlations from −1 to 1, and a SEQUENTIAL map (viridis, Blues) for values running from low to high, such as counts in a confusion matrix (Module 11).",
        codeChallenge: {
          task:
            "Write correlation_heatmap(df) that computes corr = df.corr(numeric_only=True), creates fig, ax = plt.subplots(), draws it with ax.imshow(corr, cmap=\"coolwarm\", vmin=-1, vmax=1), adds a colour bar with fig.colorbar, labels both axes' ticks with the column names, and writes each correlation rounded to 2 decimals in its cell with ax.text(j, i, f\"{value:.2f}\", ha=\"center\", va=\"center\"). Return (fig, ax).",
          starter: "import matplotlib.pyplot as plt\n\ndef correlation_heatmap(df):\n    pass\n",
          sample: "a 3 × 3 coloured grid with a colour bar and nine numbers",
          tests: [
            {
              check: py`import numpy as np
import pandas as pd
rng = np.random.default_rng(2)
a = rng.normal(size=100)
df = pd.DataFrame({"beds": a, "size": a * 2 + rng.normal(0, 0.3, 100), "age": rng.normal(size=100), "area": ["x"] * 100})
fig, ax = correlation_heatmap(df)
corr = df.corr(numeric_only=True)
assert len(ax.images) == 1 and np.allclose(ax.images[0].get_array(), corr.to_numpy()), "imshow the numeric correlation matrix."
assert ax.images[0].get_clim() == (-1, 1), "Fix the colour scale with vmin=-1 and vmax=1."
assert len(fig.axes) == 2, "Add a colour bar (it is a second axes on the figure)."
assert [t.get_text() for t in ax.get_xticklabels()] == ["beds", "size", "age"], "Label the x ticks with the column names."
assert [t.get_text() for t in ax.get_yticklabels()] == ["beds", "size", "age"], "Label the y ticks too."
texts = sorted(t.get_text() for t in ax.texts)
assert len(texts) == 9 and texts == sorted(f"{v:.2f}" for v in corr.to_numpy().ravel()), "Annotate all nine cells with the value to 2 decimals."`,
            },
          ],
          solution: py`import matplotlib.pyplot as plt

def correlation_heatmap(df):
    corr = df.corr(numeric_only=True)
    names = list(corr.columns)
    fig, ax = plt.subplots()
    im = ax.imshow(corr, cmap="coolwarm", vmin=-1, vmax=1)
    fig.colorbar(im, ax=ax)
    ax.set_xticks(range(len(names)))
    ax.set_xticklabels(names)
    ax.set_yticks(range(len(names)))
    ax.set_yticklabels(names)
    for i in range(len(names)):
        for j in range(len(names)):
            ax.text(j, i, f"{corr.iloc[i, j]:.2f}", ha="center", va="center")
    return fig, ax
`,
          hint: "After imshow, set ticks to range(len(names)) and their labels to names, on both axes. Loop over rows i and columns j to place ax.text(j, i, ...): x is the column, y the row.",
          successMessage: "beds and size glow dark red (0.99): the redundancy you found numerically in Module 6, visible instantly.",
        },
      },
      {
        id: "a-ml-seaborn",
        title: "Introduction to Seaborn",
        explain:
          "Seaborn (import seaborn as sns), created by Michael Waskom, is a statistical plotting library built on matplotlib that works directly with DataFrames: you name columns instead of passing arrays. sns.histplot(data=df, x=\"rent\", hue=\"area\") overlays distributions by group; sns.scatterplot(..., hue=\"churned\") colours by class; sns.boxplot(data=df, x=\"area\", y=\"rent\"); sns.heatmap(corr, annot=True, cmap=\"coolwarm\") does everything your last challenge did in one line; sns.pairplot(df, hue=\"label\") draws every pairwise scatter. Each returns a matplotlib Axes, so you still finish with set_title and set_xlabel. Seaborn is not available in this page's Python; install it locally with pip install seaborn.",
        example:
          "import seaborn as sns\nimport matplotlib.pyplot as plt\n\nfig, axes = plt.subplots(1, 3, figsize=(15, 4))\nsns.histplot(data=listings, x=\"rent_m\", hue=\"area\", ax=axes[0])\nsns.boxplot(data=listings, x=\"area\", y=\"rent_m\", ax=axes[1])\nsns.heatmap(listings.corr(numeric_only=True), annot=True, fmt=\".2f\",\n            cmap=\"coolwarm\", vmin=-1, vmax=1, ax=axes[2])\naxes[1].set_title(\"Rent by area\")\nplt.tight_layout()",
        codeExercise: {
          language: PY,
          code: py`import pandas as pd

# What sns.barplot(data=df, x="area", y="rent") computes before drawing:
df = pd.DataFrame({
    "area": ["Lekki", "Yaba", "Lekki", "Yaba", "Lekki"],
    "rent": [30, 12, 34, 14, 26],
})
summary = df.groupby("area")["rent"].agg(["mean", "count"])
print(summary["mean"].to_dict())
print(summary["count"].to_dict())
`,
          question: "Seaborn's barplot draws the MEAN of y per category (with an error bar). What values would its bars show?",
          expectedOutput: "{'Lekki': 30.0, 'Yaba': 13.0}\n{'Lekki': 3, 'Yaba': 2}",
          hint: "Lekki: (30 + 34 + 26) / 3. Yaba: (12 + 14) / 2.",
          successMessage: "Seaborn aggregates for you, which is convenient and dangerous: always know which statistic a chart is showing (mean, median, count, sum).",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 35 · 7.9 – 7.10
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ml-l35-choosing-presenting",
    moduleId: "ml-m7-visualization",
    sectionId: SECTION_ID,
    order: 4,
    covers: ["7.9", "7.10"],
    title: "Choosing Charts and Presenting Insights",
    subtitle: "The right chart for the question, and a chart that makes its point",
    estimatedMinutes: 32,
    intro:
      "Most bad charts are the wrong chart for the question, or the right chart with no message. This lesson gives you a decision rule for the first and a checklist for the second.",

    atoms: [
      {
        id: "a-ml-choosing-visualizations",
        title: "Choosing appropriate visualizations",
        explain:
          "Choose the chart from the QUESTION, not from what looks impressive. Change over time: line chart. Comparison across categories: bar chart (sorted, horizontal for many or long names). Distribution of one numeric variable: histogram (or box plot to compare groups). Relationship between two numeric variables: scatter plot. Part of a whole with few parts: a stacked bar, or a pie only for two or three parts. A matrix of values (correlations, a confusion matrix): heatmap. Avoid 3-D effects, dual y-axes and pie charts with many slices: each makes accurate comparison harder.",
        codeChallenge: {
          task:
            "Write choose_chart(question_type) that returns the recommended chart for each kind of question: \"trend\" → \"line\", \"comparison\" → \"bar\", \"distribution\" → \"histogram\", \"group_spread\" → \"box\", \"relationship\" → \"scatter\", \"matrix\" → \"heatmap\". For anything else return \"table\" (when no chart fits, show the numbers).",
          starter: "def choose_chart(question_type):\n    pass\n",
          sample: "choose_chart(\"trend\") → \"line\"",
          tests: [
            {
              check: py`cases = {"trend": "line", "comparison": "bar", "distribution": "histogram", "group_spread": "box", "relationship": "scatter", "matrix": "heatmap", "exact_values": "table", "": "table"}
for k, v in cases.items():
    assert choose_chart(k) == v, "choose_chart(" + repr(k) + ") should be " + repr(v) + ". Got " + repr(choose_chart(k))`,
            },
          ],
          solution: py`CHARTS = {
    "trend": "line",
    "comparison": "bar",
    "distribution": "histogram",
    "group_spread": "box",
    "relationship": "scatter",
    "matrix": "heatmap",
}

def choose_chart(question_type):
    return CHARTS.get(question_type, "table")
`,
          hint: "A dictionary from question type to chart, read with .get(question_type, \"table\").",
          successMessage: "Question first, chart second. And when the reader needs exact values, a table beats any chart.",
        },
      },
      {
        id: "a-ml-presenting-insights",
        title: "Presenting data-driven insights",
        explain:
          "An exploratory chart is for you; a presentation chart is for someone else, and it must make ONE point. Write the TAKEAWAY as the title (\"Kano drives 41% of revenue\" beats \"Revenue by branch\"). HIGHLIGHT what matters: colour the key bar and grey the rest, or annotate the key point with ax.annotate. REMOVE clutter: unnecessary gridlines, borders (ax.spines[\"top\"].set_visible(False)), legends that could be direct labels. Show units and the data source. Then put the chart in a STORY: context, finding, evidence, recommendation. A model's results are presented the same way: the business metric it moved, not only its accuracy.",
        codeChallenge: {
          task:
            "Write highlight_chart(revenue, focus) where revenue is {branch: value} and focus a branch name. Draw a vertical bar chart (fig, ax = plt.subplots(); ax.bar) in dictionary order where the focus bar is colour \"#d62728\" and every other bar \"lightgrey\". Set the title to the takeaway \"<focus> drives <p>% of revenue\" where p is focus's share of the total rounded to a whole number. Hide the top and right spines, and return ax.",
          starter: "import matplotlib.pyplot as plt\n\ndef highlight_chart(revenue, focus):\n    pass\n",
          sample: "highlight_chart({\"Lagos\": 333, \"Abuja\": 374, \"Kano\": 493}, \"Kano\") → title \"Kano drives 41% of revenue\"",
          tests: [
            {
              check: py`from matplotlib.colors import to_hex
ax = highlight_chart({"Lagos": 333, "Abuja": 374, "Kano": 493}, "Kano")
assert ax.get_title() == "Kano drives 41% of revenue", "493 of 1200 is 41%. Got " + repr(ax.get_title())
colours = [to_hex(b.get_facecolor()) for b in ax.patches]
assert colours == [to_hex("lightgrey"), to_hex("lightgrey"), "#d62728"], "Only the focus bar is red. Got " + repr(colours)
assert [b.get_height() for b in ax.patches] == [333, 374, 493], "Bars in dictionary order."
assert not ax.spines["top"].get_visible() and not ax.spines["right"].get_visible(), "Hide the top and right spines."
ax = highlight_chart({"A": 1, "B": 3}, "A")
assert ax.get_title() == "A drives 25% of revenue", "Got " + repr(ax.get_title())`,
            },
          ],
          solution: py`import matplotlib.pyplot as plt

def highlight_chart(revenue, focus):
    names = list(revenue)
    values = list(revenue.values())
    colours = ["#d62728" if n == focus else "lightgrey" for n in names]
    fig, ax = plt.subplots()
    ax.bar(names, values, color=colours)
    share = round(revenue[focus] / sum(values) * 100)
    ax.set_title(f"{focus} drives {share}% of revenue")
    ax.spines["top"].set_visible(False)
    ax.spines["right"].set_visible(False)
    return ax
`,
          hint: "Build a colour list with a comprehension, pass it as color= to ax.bar, compute the share, and use an f-string for the title.",
          successMessage: "A takeaway title and one highlighted bar: the reader knows the point before reading a single axis label.",
        },
      },
    ],

    task: {
      title: "Module 7 project: a visual report",
      intro:
        "Using the dataset from your Module 5 or Module 6 project, build a four-chart visual report in one figure (plt.subplots(2, 2)) and a short written story around it.",
      prompts: [
        "A line chart of the main metric over time, with a rolling mean overlaid.",
        "A sorted horizontal bar chart comparing categories, with the key category highlighted.",
        "A histogram or box plot showing the distribution of the target, and what its shape implies.",
        "A heatmap of the correlation matrix with annotations.",
        "Give every chart a takeaway title, labelled axes with units, and no unnecessary clutter.",
        "Rebuild one chart with Seaborn on your own machine, and compare the code needed.",
        "Write a five-sentence story: context, finding, evidence, caveat and recommendation.",
      ],
      closing: "Charts showed you what is in the data. Module 8 prepares that data for a model: encoding, scaling, selecting features and splitting without leakage.",
    },

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
