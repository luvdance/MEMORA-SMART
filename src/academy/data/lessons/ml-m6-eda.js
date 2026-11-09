/**
 * MACHINE LEARNING AND AI · MODULE 6 · EXPLORATORY DATA ANALYSIS
 *
 * Curriculum 6.1 – 6.10. What EDA is for; distributions and skew; trends;
 * outliers with the IQR and z-score rules; relationships and correlation;
 * univariate, bivariate and multivariate analysis; and drawing conclusions
 * the data actually supports (sample sizes, confounders, Simpson's paradox).
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

export const SECTION_ID = "ml-s6-eda";

const PY = "python";
const py = String.raw;

// A deterministic Lagos property sample shared by several checks.
const LISTINGS = py`import numpy as np
import pandas as pd
_rng = np.random.default_rng(42)
_n = 300
_area = _rng.choice(["Lekki", "Yaba", "Ikeja", "Surulere"], _n, p=[0.3, 0.25, 0.25, 0.2])
_beds = _rng.integers(1, 6, _n)
_base = pd.Series(_area).map({"Lekki": 9.0, "Yaba": 5.0, "Ikeja": 6.5, "Surulere": 4.5}).to_numpy()
_size = _beds * 28 + _rng.normal(0, 12, _n).round()
_price = (_base * _beds + _rng.normal(0, 2.5, _n)).round(1)
listings = pd.DataFrame({"area": _area, "bedrooms": _beds, "size_m2": _size, "rent_m": _price})
`;

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 28 · 6.1 – 6.3
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ml-l28-eda-distributions",
    moduleId: "ml-m6-eda",
    sectionId: SECTION_ID,
    order: 1,
    covers: ["6.1", "6.2", "6.3"],
    title: "EDA, Distributions, Patterns and Trends",
    subtitle: "Understanding data before modelling it",
    estimatedMinutes: 34,
    intro:
      "Exploratory data analysis is the conversation you have with a dataset before you ask it to predict anything. Skip it, and you train models on errors, skewed columns and patterns you never noticed.",

    atoms: [
      {
        id: "a-ml-eda-intro",
        title: "Understanding exploratory data analysis",
        explain:
          "EXPLORATORY DATA ANALYSIS (EDA), named by the statistician John Tukey in 1977, means investigating a dataset with summaries and charts to understand it before formal modelling. EDA answers: What does each variable look like? Are there errors, gaps or outliers? Which variables move together? Which features are likely to predict the target? Is the target balanced? EDA is open-ended and iterative, and it differs from CONFIRMATORY analysis, which tests a hypothesis stated in advance. Its outputs are an understanding of the data, a list of cleaning steps, and hypotheses about which features matter.",
        table: {
          caption: "The questions EDA asks, and the tools that answer them.",
          headers: ["Question", "Tools"],
          rows: [
            ["What does one variable look like?", "describe(), value_counts(), histograms, box plots"],
            ["Are there errors or outliers?", "min/max, IQR and z-score rules, box plots"],
            ["How do two variables relate?", "correlation, crosstabs, group means, scatter plots"],
            ["How do several variables interact?", "pivot tables, heatmaps, grouped charts"],
            ["Is the target balanced?", "value_counts(normalize=True) on the label"],
          ],
        },
        codeExercise: {
          language: PY,
          code: py`import pandas as pd

df = pd.DataFrame({
    "age": [25, 31, 45, 22, 38, 240, 29],
    "churned": ["no", "no", "yes", "no", "no", "yes", "no"],
})
print(df["age"].describe()[["min", "50%", "max"]].tolist())
print(df["churned"].value_counts(normalize=True).round(2).to_dict())
print(df.loc[df["age"] > 120, "age"].tolist())
`,
          question: "A first look at a customer table. What does it print, and what should worry you?",
          expectedOutput: "[22.0, 31.0, 240.0]\n{'no': 0.71, 'yes': 0.29}\n[240]",
          hint: "The median is the middle of the seven sorted ages. Five of seven customers did not churn.",
          successMessage: "An age of 240 is a data-entry error, found in seconds by looking at the maximum. EDA catches what a model would silently learn from.",
        },
      },
      {
        id: "a-ml-distributions",
        title: "Understanding dataset distributions",
        explain:
          "A variable's DISTRIBUTION is the pattern of how often each value occurs. Describe it by CENTRE (mean, median), SPREAD (standard deviation, IQR, range) and SHAPE. Shape has a vocabulary: SYMMETRIC (mean ≈ median), RIGHT-SKEWED (a long tail of large values, mean > median: incomes, house prices, transaction amounts), LEFT-SKEWED (mean < median), and MULTIMODAL (several peaks, often a sign of mixed groups). SKEWNESS quantifies asymmetry: 0 for symmetric, positive for right skew. Strong right skew is often tamed with a LOG transform before modelling, which makes the distribution closer to normal and reduces the pull of extreme values.",
        codeExercise: {
          language: PY,
          code: py`import numpy as np
import pandas as pd

amounts = pd.Series([2000, 2500, 3000, 3200, 4000, 4500, 5000, 250000])
print(round(amounts.mean()), amounts.median())
print(round(amounts.skew(), 2))

logged = np.log10(amounts)
print(round(logged.mean(), 2), round(logged.median(), 2), round(logged.skew(), 2))
`,
          question: "Transaction amounts with one large payment. Compare the mean, median and skewness before and after a log transform.",
          expectedOutput: "34275 3600.0\n2.83\n3.75 3.55 2.61",
          hint: "One ₦250,000 payment pulls the mean far above the median. The log compresses large values much more than small ones.",
          successMessage: "Skew fell from 2.83 to 2.61 and the mean moved close to the median. On real, larger samples a log transform often makes right-skewed money columns nearly symmetric.",
        },
      },
      {
        id: "a-ml-patterns-trends",
        title: "Identifying patterns and trends",
        explain:
          "With data over time, look for a TREND (a long-run rise or fall), SEASONALITY (a pattern that repeats every week, month or year, such as December spikes in retail), and NOISE (the random wobble). Aggregate to the right period first: daily sales are noisy, monthly totals show the trend. A ROLLING MEAN (s.rolling(3).mean()) smooths noise by averaging each point with its neighbours. PERCENT CHANGE (s.pct_change()) shows growth rates period to period. In pandas, with a datetime column, df.resample(\"MS\", on=\"date\")[\"sales\"].sum() totals by month.",
        codeChallenge: {
          task:
            "df has a datetime column date and a numeric column sales, one row per day. Write monthly_trend(df) that returns a DataFrame indexed by month start with three columns: total (monthly sum of sales, using resample(\"MS\", on=\"date\")), rolling (the 3-month rolling mean of total) and growth (the month-on-month percentage change of total, multiplied by 100 and rounded to 1 decimal place).",
          starter: "import pandas as pd\n\ndef monthly_trend(df):\n    pass\n",
          sample: "January total 31,000 and February 33,600 → February growth 8.4",
          tests: [
            {
              check: py`import pandas as pd
import numpy as np
dates = pd.date_range("2026-01-01", "2026-06-30", freq="D")
sales = 1000 + 100 * (dates.month - 1)
df = pd.DataFrame({"date": dates, "sales": sales})
r = monthly_trend(df)
assert list(r.columns) == ["total", "rolling", "growth"], "Columns: total, rolling, growth. Got " + repr(list(r.columns))
assert len(r) == 6, "Six months. Got " + str(len(r))
assert r["total"].tolist()[:2] == [31000, 30800], "January: 31 days × 1000; February: 28 days × 1100. Got " + repr(r["total"].tolist()[:2])
assert np.isnan(r["rolling"].iloc[1]) and abs(r["rolling"].iloc[2] - (31000 + 30800 + 37200) / 3) < 1e-6, "The 3-month rolling mean starts in month 3."
assert np.isnan(r["growth"].iloc[0]) and r["growth"].iloc[1] == -0.6, "February fell 0.6% (fewer days). Got " + repr(r["growth"].iloc[1])
assert calls("resample") and calls("rolling") and calls("pct_change"), "Use resample, rolling and pct_change."`,
            },
          ],
          solution: py`import pandas as pd

def monthly_trend(df):
    total = df.resample("MS", on="date")["sales"].sum()
    out = pd.DataFrame({"total": total})
    out["rolling"] = out["total"].rolling(3).mean()
    out["growth"] = (out["total"].pct_change() * 100).round(1)
    return out
`,
          hint: "total = df.resample(\"MS\", on=\"date\")[\"sales\"].sum(); then rolling(3).mean() and pct_change() * 100 on that Series.",
          successMessage: "February \"fell\" only because it has fewer days. Comparing totals over unequal periods is a classic trap: average per day would show the true rise.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 29 · 6.4 – 6.6
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ml-l29-outliers-relationships",
    moduleId: "ml-m6-eda",
    sectionId: SECTION_ID,
    order: 2,
    covers: ["6.4", "6.5", "6.6"],
    title: "Outliers, Relationships and Correlation",
    subtitle: "Finding unusual values, and measuring how variables move together",
    estimatedMinutes: 38,
    intro:
      "Outliers can be errors to fix or the most important rows in the dataset (fraud is an outlier). Relationships between variables are what a model will learn. This lesson finds both, with numbers before charts.",

    atoms: [
      {
        id: "a-ml-outliers",
        title: "Detecting outliers",
        explain:
          "An OUTLIER is a value far from the rest. Two standard rules: the IQR RULE (Tukey's fences) computes the interquartile range IQR = Q3 − Q1 and flags values below Q1 − 1.5·IQR or above Q3 + 1.5·IQR; it is robust because quartiles are not distorted by the outliers themselves, and it is what a box plot draws. The Z-SCORE RULE flags |z| > 3; it assumes roughly normal data, and a single huge value inflates the standard deviation enough to hide itself. Once found, decide WHY each outlier exists: a typo (fix or drop), a real but extreme case (keep, perhaps cap or log-transform), or exactly what you are looking for (fraud, faults).",
        codeChallenge: {
          task:
            "Write iqr_outliers(s) that takes a pandas Series and returns a tuple (low_fence, high_fence, outliers) where the fences are Q1 − 1.5·IQR and Q3 + 1.5·IQR (quartiles from s.quantile(0.25) and s.quantile(0.75)) and outliers is a Series of the values outside the fences. Then write zscore_outliers(s, threshold=3) that returns the values whose absolute z-score (using the population std, ddof=0) exceeds threshold.",
          starter: "import pandas as pd\n\ndef iqr_outliers(s):\n    pass\n\ndef zscore_outliers(s, threshold=3):\n    pass\n",
          sample: "iqr_outliers(pd.Series([10, 12, 12, 13, 12, 11, 14, 13, 15, 102])) → fences 9.375 and 16.375, outliers [102]",
          tests: [
            {
              check: py`import pandas as pd
s = pd.Series([10, 12, 12, 13, 12, 11, 14, 13, 15, 102])
lo, hi, out = iqr_outliers(s)
assert (lo, hi) == (s.quantile(0.25) - 1.5 * (s.quantile(0.75) - s.quantile(0.25)), s.quantile(0.75) + 1.5 * (s.quantile(0.75) - s.quantile(0.25))), "Fences are Q1 − 1.5 IQR and Q3 + 1.5 IQR. Got " + repr((lo, hi))
assert out.tolist() == [102], "Only 102 is outside the fences. Got " + repr(out.tolist())
assert zscore_outliers(s).tolist() == [], "Even 102 has |z| just under 3 here (2.996): the outlier inflates the std it is measured with."
small = pd.Series([5, 6, 5, 7, 6, 60])
assert zscore_outliers(small).tolist() == [], "With so few values, the outlier inflates the std and hides itself: no |z| above 3."
assert iqr_outliers(small)[2].tolist() == [60], "The IQR rule still finds it."
assert zscore_outliers(small, threshold=2).tolist() == [60], "With threshold 2 the z-score rule catches it."`,
            },
          ],
          solution: py`import pandas as pd

def iqr_outliers(s):
    q1, q3 = s.quantile(0.25), s.quantile(0.75)
    iqr = q3 - q1
    low, high = q1 - 1.5 * iqr, q3 + 1.5 * iqr
    return low, high, s[(s < low) | (s > high)]

def zscore_outliers(s, threshold=3):
    z = (s - s.mean()) / s.std(ddof=0)
    return s[z.abs() > threshold]
`,
          hint: "IQR: q1, q3 = s.quantile(0.25), s.quantile(0.75); keep s[(s < low) | (s > high)]. z: (s - s.mean()) / s.std(ddof=0), then s[z.abs() > threshold].",
          successMessage: "On six values, the outlier of 60 has a z-score of only 2.2 because it inflates the standard deviation itself. The IQR rule, built on quartiles, is not fooled.",
        },
      },
      {
        id: "a-ml-relationships",
        title: "Understanding relationships between variables",
        explain:
          "How you examine a relationship depends on the variable types. NUMERIC vs NUMERIC: correlation and scatter plots. CATEGORICAL vs NUMERIC: compare the numeric variable's distribution in each category (df.groupby(\"area\")[\"rent\"].median()). CATEGORICAL vs CATEGORICAL: a CROSSTAB of counts or row percentages (pd.crosstab(df[\"plan\"], df[\"churned\"], normalize=\"index\")). For a classification target, the most useful single view is the target RATE per category: if 40% of prepaid customers churn but 8% of postpaid, plan type is a strong feature.",
        codeExercise: {
          language: PY,
          code: py`import pandas as pd

df = pd.DataFrame({
    "plan": ["prepaid"] * 5 + ["postpaid"] * 5,
    "churned": [1, 1, 0, 1, 0, 0, 0, 1, 0, 0],
    "spend": [1500, 900, 4000, 1200, 3500, 9000, 12000, 7000, 8500, 10000],
})
print(df.groupby("plan")["churned"].mean().to_dict())
print(df.groupby("churned")["spend"].median().to_dict())
print(pd.crosstab(df["plan"], df["churned"]).values.tolist())
`,
          question: "Churn rate by plan, median spend by churn status, and the crosstab of counts. What does it print?",
          expectedOutput: "{'postpaid': 0.2, 'prepaid': 0.6}\n{0: 8750.0, 1: 1350.0}\n[[4, 1], [2, 3]]",
          hint: "groupby sorts its keys alphabetically. Churners spent 1500, 900, 1200 and 7000.",
          successMessage: "Prepaid customers churn three times as often, and churners spend far less. Both are relationships a model can use.",
        },
      },
      {
        id: "a-ml-correlation-analysis",
        title: "Correlation analysis",
        explain:
          "df.corr(numeric_only=True) gives the CORRELATION MATRIX: Pearson r for every pair of numeric columns, 1 on the diagonal, symmetric. Two uses in ML. (1) TARGET correlation: sort features by the absolute value of their correlation with the target to see which carry linear signal. (2) MULTICOLLINEARITY: two features correlated above about 0.9 with EACH OTHER carry nearly the same information, which makes linear models' coefficients unstable and harder to interpret. method=\"spearman\" uses ranks instead of values, capturing any MONOTONIC relationship (always rising, even if curved) and resisting outliers.",
        codeChallenge: {
          task:
            "Write rank_features(df, target) that returns a list of (feature, r) tuples for every numeric column other than target, with r the Pearson correlation with target rounded to 3 places, sorted by absolute r from strongest to weakest. Then write redundant_pairs(df, threshold=0.9) that returns a sorted list of (a, b) name pairs (a < b alphabetically) of numeric columns whose absolute correlation exceeds threshold.",
          starter: "import pandas as pd\n\ndef rank_features(df, target):\n    pass\n\ndef redundant_pairs(df, threshold=0.9):\n    pass\n",
          sample: "on the property listings, bedrooms and size_m2 are both strongly correlated with rent, and with each other",
          tests: [
            {
              check: LISTINGS + py`
ranked = rank_features(listings, "rent_m")
names = [f for f, r in ranked]
assert set(names) == {"bedrooms", "size_m2"}, "Numeric features other than the target. Got " + repr(names)
corr = listings.corr(numeric_only=True)["rent_m"]
assert ranked == sorted([(f, round(corr[f], 3)) for f in names], key=lambda t: -abs(t[1])), "Sorted by absolute correlation. Got " + repr(ranked)
assert redundant_pairs(listings) == [("bedrooms", "size_m2")], "bedrooms and size_m2 are nearly the same information. Got " + repr(redundant_pairs(listings))
toy = pd.DataFrame({"a": [1, 2, 3, 4], "b": [2, 4, 6, 8.5], "c": [4, 1, 3, 2], "y": [1, 0, 1, 0]})
assert redundant_pairs(toy) == [("a", "b")], "Got " + repr(redundant_pairs(toy))
tr = rank_features(toy, "y")
assert [abs(r) for _, r in tr] == sorted([abs(r) for _, r in tr], reverse=True), "Strongest first. Got " + repr(tr)`,
            },
          ],
          solution: py`import pandas as pd

def rank_features(df, target):
    corr = df.corr(numeric_only=True)[target].drop(target)
    pairs = [(name, round(r, 3)) for name, r in corr.items()]
    return sorted(pairs, key=lambda t: -abs(t[1]))

def redundant_pairs(df, threshold=0.9):
    corr = df.corr(numeric_only=True)
    cols = list(corr.columns)
    found = []
    for i, a in enumerate(cols):
        for b in cols[i + 1:]:
            if abs(corr.loc[a, b]) > threshold:
                found.append(tuple(sorted((a, b))))
    return sorted(found)
`,
          hint: "df.corr(numeric_only=True)[target].drop(target) gives each feature's r. For pairs, loop over the upper triangle of the matrix (each column with the ones after it).",
          successMessage: "bedrooms and size_m2 are almost interchangeable here. A linear model given both would split credit between them unpredictably; Module 8 decides which to keep.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 30 · 6.7 – 6.9
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ml-l30-uni-bi-multivariate",
    moduleId: "ml-m6-eda",
    sectionId: SECTION_ID,
    order: 3,
    covers: ["6.7", "6.8", "6.9"],
    title: "Univariate, Bivariate and Multivariate Analysis",
    subtitle: "One variable, two variables, and many at once",
    estimatedMinutes: 36,
    intro:
      "EDA proceeds in widening circles: each variable alone, then each feature against the target, then several variables together, where the most interesting and the most misleading patterns live.",

    atoms: [
      {
        id: "a-ml-univariate",
        title: "Univariate analysis",
        explain:
          "UNIVARIATE analysis examines one variable at a time. For a NUMERIC variable: count, missing values, mean, median, standard deviation, min, max, quartiles, skewness, and a histogram or box plot. For a CATEGORICAL variable: the number of categories, the count and percentage of each (value_counts(normalize=True)), and RARE categories (very small groups that a model cannot learn from, often grouped into \"Other\"). Univariate analysis of the TARGET is essential: its balance decides your evaluation metric and whether you need resampling (Module 8).",
        codeChallenge: {
          task:
            "Write profile(s) that returns a dictionary describing a pandas Series. For a numeric Series: {\"kind\": \"numeric\", \"missing\": count of NaN, \"mean\": mean rounded to 2, \"median\": median, \"skew\": skewness rounded to 2}. Otherwise: {\"kind\": \"categorical\", \"missing\": count, \"levels\": number of distinct non-missing values, \"top\": the most common value, \"rare\": sorted list of values making up less than 5% of non-missing rows}. Use pd.api.types.is_numeric_dtype to decide.",
          starter: "import pandas as pd\n\ndef profile(s):\n    pass\n",
          sample: "profile(listings[\"area\"]) → {\"kind\": \"categorical\", \"missing\": 0, \"levels\": 4, \"top\": \"Lekki\", \"rare\": []}",
          tests: [
            {
              check: LISTINGS + py`
p = profile(listings["area"])
assert p == {"kind": "categorical", "missing": 0, "levels": 4, "top": listings["area"].value_counts().index[0], "rare": []}, "Got " + repr(p)
p = profile(listings["rent_m"])
assert p["kind"] == "numeric" and p["missing"] == 0, "rent_m is numeric with no gaps. Got " + repr(p)
assert p["mean"] == round(listings["rent_m"].mean(), 2) and p["median"] == listings["rent_m"].median(), "Got " + repr(p)
assert p["skew"] == round(listings["rent_m"].skew(), 2), "Include skewness rounded to 2."
cats = pd.Series(["card"] * 50 + ["cash"] * 45 + ["crypto"] * 2 + ["cheque"] * 3 + [None] * 4)
p = profile(cats)
assert p == {"kind": "categorical", "missing": 4, "levels": 4, "top": "card", "rare": ["cheque", "crypto"]}, "crypto (2%) and cheque (3%) are rare. Got " + repr(p)`,
            },
          ],
          solution: py`import pandas as pd

def profile(s):
    missing = int(s.isna().sum())
    if pd.api.types.is_numeric_dtype(s):
        return {"kind": "numeric", "missing": missing, "mean": round(s.mean(), 2),
                "median": s.median(), "skew": round(s.skew(), 2)}
    shares = s.value_counts(normalize=True)
    return {"kind": "categorical", "missing": missing, "levels": int(s.nunique()),
            "top": shares.index[0], "rare": sorted(shares[shares < 0.05].index.tolist())}
`,
          hint: "value_counts(normalize=True) gives shares of the non-missing values, largest first: its first index is the top value and shares[shares < 0.05] the rare ones.",
          successMessage: "A profile function like this, run over every column, is the first cell of most professional EDA notebooks.",
        },
      },
      {
        id: "a-ml-bivariate",
        title: "Bivariate analysis",
        explain:
          "BIVARIATE analysis studies two variables together, usually a feature against the target. Numeric feature with numeric target: correlation and a scatter plot. Categorical feature with numeric target: the target's mean or median per category. Categorical feature with categorical target: the target RATE per category, together with the COUNT per category, because a 100% churn rate from 2 customers means nothing. Numeric feature with categorical target: compare the feature's distribution in each class, or BIN the feature (pd.cut or pd.qcut into quantiles) and compute the target rate per bin, which reveals non-linear patterns correlation misses.",
        codeChallenge: {
          task:
            "Write rate_by_band(df, feature, target, q=4) that bins the numeric feature into q quantile bands with pd.qcut(..., q, labels=False) (bands numbered 0 … q−1) and returns a DataFrame indexed by band with columns n (rows in the band) and rate (mean of the 0/1 target, rounded to 3).",
          starter: "import pandas as pd\n\ndef rate_by_band(df, feature, target, q=4):\n    pass\n",
          sample: "customers in the lowest spend band churn at 0.6; the highest at 0.05",
          tests: [
            {
              check: py`import numpy as np
import pandas as pd
rng = np.random.default_rng(3)
spend = rng.uniform(500, 20000, 400)
churn = (rng.uniform(0, 1, 400) < np.interp(spend, [500, 20000], [0.7, 0.05])).astype(int)
df = pd.DataFrame({"spend": spend, "churned": churn})
r = rate_by_band(df, "spend", "churned")
assert list(r.columns) == ["n", "rate"] and r.index.tolist() == [0, 1, 2, 3], "Bands 0 to 3 with columns n and rate. Got " + repr(r)
assert r["n"].tolist() == [100, 100, 100, 100], "Quantile bands hold equal numbers of rows."
expect = df.groupby(pd.qcut(df["spend"], 4, labels=False))["churned"].mean().round(3)
assert r["rate"].tolist() == expect.tolist(), "rate is the churn mean per band. Got " + repr(r["rate"].tolist())
assert r["rate"].iloc[0] > r["rate"].iloc[3], "Low spenders churn more."
assert calls("qcut"), "Use pd.qcut for quantile bands."`,
            },
          ],
          solution: py`import pandas as pd

def rate_by_band(df, feature, target, q=4):
    band = pd.qcut(df[feature], q, labels=False)
    out = df.groupby(band)[target].agg(n="count", rate="mean")
    out["rate"] = out["rate"].round(3)
    out.index.name = None
    return out
`,
          hint: "band = pd.qcut(df[feature], q, labels=False); df.groupby(band)[target].agg(n=\"count\", rate=\"mean\"), then round the rate.",
          successMessage: "Rates per quantile band show the SHAPE of a relationship, steady, threshold or U-shaped, with the sample size beside every number.",
        },
      },
      {
        id: "a-ml-multivariate",
        title: "Multivariate analysis",
        explain:
          "MULTIVARIATE analysis looks at three or more variables at once, because relationships can change when another variable is taken into account. A PIVOT TABLE (df.pivot_table(values=\"rent\", index=\"area\", columns=\"bedrooms\", aggfunc=\"median\")) shows a target across two features at once. A full correlation matrix, colour-coded as a heatmap (Module 7), shows every pairwise relationship. Pair plots show every scatter at once. Dimensionality reduction (PCA, Module 12) summarises many variables in a few. INTERACTIONS appear here: an extra bedroom may add ₦9m in Lekki but ₦4.5m in Surulere, which a model only learns if the data supports it.",
        codeExercise: {
          language: PY,
          code: LISTINGS + py`
pt = listings.pivot_table(values="rent_m", index="area", columns="bedrooms", aggfunc="median")
print(pt.shape)
print(pt.index.tolist())
step = (pt[5] - pt[1]) / 4
print(step.round(1).to_dict())
`,
          question: "A pivot of median rent by area and bedrooms. How much does each extra bedroom add, per area, between 1 and 5 bedrooms?",
          expectedOutput: "(4, 5)\n['Ikeja', 'Lekki', 'Surulere', 'Yaba']\n{'Ikeja': 6.5, 'Lekki': 9.1, 'Surulere': 4.6, 'Yaba': 4.9}",
          hint: "The data was generated with ₦9m per bedroom in Lekki, ₦6.5m in Ikeja, ₦5m in Yaba and ₦4.5m in Surulere, plus noise.",
          successMessage: "The value of a bedroom depends on the area: an interaction. Neither variable alone reveals it; the pivot table does.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 31 · 6.10
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ml-l31-drawing-conclusions",
    moduleId: "ml-m6-eda",
    sectionId: SECTION_ID,
    order: 4,
    covers: ["6.10"],
    title: "Drawing Meaningful Conclusions",
    subtitle: "What the data supports, what it does not, and how to say so",
    estimatedMinutes: 32,
    intro:
      "The last step of EDA is the hardest: turning tables into conclusions that are true. This lesson covers the traps (small samples, confounders, Simpson's paradox) and a disciplined way of writing findings.",

    atoms: [
      {
        id: "a-ml-conclusions",
        title: "Confounders and Simpson's paradox",
        explain:
          "A CONFOUNDER is a third variable that influences both things you are comparing and creates a misleading association. SIMPSON'S PARADOX is the extreme case: a trend that appears in every group REVERSES when the groups are combined. In the example below, Branch B converts more customers than Branch A in BOTH customer segments, yet looks worse overall, because B serves mostly the hard-to-convert segment. Before concluding \"A performs better\", always ask what else differs between the groups, and break the comparison down by the obvious confounders.",
        codeExercise: {
          language: PY,
          code: py`import pandas as pd

df = pd.DataFrame({
    "branch":  ["A", "A", "B", "B"],
    "segment": ["walk-in", "referral", "walk-in", "referral"],
    "visits":  [100, 900, 800, 200],
    "sales":   [10, 450, 96, 110],
})
overall = df.groupby("branch")[["sales", "visits"]].sum()
print((overall["sales"] / overall["visits"]).round(3).to_dict())

df["rate"] = (df["sales"] / df["visits"]).round(3)
print(df.pivot(index="segment", columns="branch", values="rate").to_dict())
`,
          question: "Compare the two branches' conversion rates overall, then within each segment. What does it print?",
          expectedOutput: "{'A': 0.46, 'B': 0.206}\n{'A': {'referral': 0.5, 'walk-in': 0.1}, 'B': {'referral': 0.55, 'walk-in': 0.12}}",
          hint: "Overall, A converts 460 of 1,000 visits and B 206 of 1,000. Within each segment, compare the rates directly.",
          successMessage: "B is better in BOTH segments and worse overall, because 80% of its visits are hard-to-convert walk-ins. The segment mix is a confounder.",
        },
      },
      {
        id: "a-ml-reporting-findings",
        title: "Reporting findings responsibly",
        explain:
          "A good EDA finding states the PATTERN, the EVIDENCE (numbers with sample sizes), the CAVEATS (confounders, missing data, period covered) and the IMPLICATION for the model or business. \"Prepaid customers churn at 41% (n = 3,200) versus 9% for postpaid (n = 1,800); prepaid customers are also younger, so age may explain part of this; plan type should be a model feature\" is a finding. \"Prepaid causes churn\" is not: EDA shows ASSOCIATION, and claims of CAUSE need experiments or careful causal methods. Also guard against small groups: a difference in rates means little when one group has a handful of rows.",
        codeChallenge: {
          task:
            "Write findings(df, group, target, min_n=30) that returns a list of strings, one per group value in sorted order, for groups with at least min_n rows only, formatted exactly as \"<value>: rate <r> (n=<count>)\" where r is the mean of the 0/1 target formatted with 2 decimal places. Then write gap(df, group, target, min_n=30) that returns the difference between the highest and lowest rate among those groups, rounded to 2.",
          starter: "import pandas as pd\n\ndef findings(df, group, target, min_n=30):\n    pass\n\ndef gap(df, group, target, min_n=30):\n    pass\n",
          sample: "findings(df, \"plan\", \"churned\") → [\"postpaid: rate 0.10 (n=40)\", \"prepaid: rate 0.40 (n=60)\"]",
          tests: [
            {
              check: py`import pandas as pd
df = pd.DataFrame({
    "plan": ["prepaid"] * 60 + ["postpaid"] * 40 + ["corporate"] * 3,
    "churned": [1] * 24 + [0] * 36 + [1] * 4 + [0] * 36 + [1, 1, 1],
})
f = findings(df, "plan", "churned")
assert f == ["postpaid: rate 0.10 (n=40)", "prepaid: rate 0.40 (n=60)"], "Corporate (n=3) is too small to report. Got " + repr(f)
assert gap(df, "plan", "churned") == 0.3, "0.40 − 0.10. Got " + repr(gap(df, "plan", "churned"))
assert len(findings(df, "plan", "churned", min_n=1)) == 3, "With min_n=1 every group is reported."
assert gap(df, "plan", "churned", min_n=1) == 0.9, "Corporate's 100% rate (from 3 rows!) would dominate. Got " + repr(gap(df, "plan", "churned", min_n=1))`,
            },
          ],
          solution: py`import pandas as pd

def _rates(df, group, target, min_n):
    stats = df.groupby(group)[target].agg(n="count", rate="mean")
    return stats[stats["n"] >= min_n].sort_index()

def findings(df, group, target, min_n=30):
    stats = _rates(df, group, target, min_n)
    return [f"{row.Index}: rate {row.rate:.2f} (n={row.n})" for row in stats.itertuples()]

def gap(df, group, target, min_n=30):
    rates = _rates(df, group, target, min_n)["rate"]
    return round(rates.max() - rates.min(), 2)
`,
          hint: "df.groupby(group)[target].agg(n=\"count\", rate=\"mean\"), keep rows with n >= min_n, sort by index. Format with f\"{value}: rate {rate:.2f} (n={n})\".",
          successMessage: "A 100% rate from 3 customers would have dominated the report. Showing n beside every rate, and setting a minimum, keeps conclusions honest.",
        },
      },
    ],

    task: {
      title: "Module 6 project: exploratory analysis of Lagos property listings",
      intro:
        "Take a property listings dataset (scraped listings, a public dataset or the generated one from these lessons, with at least 1,000 rows) and write an EDA report as a notebook with conclusions.",
      prompts: [
        "Profile every column: types, missing values, distributions, skewness, rare categories and impossible values.",
        "Find outliers in rent and size with the IQR rule, investigate the ten most extreme, and decide how to treat each kind.",
        "Rank features by correlation with rent, with Pearson and Spearman, and identify redundant feature pairs.",
        "Build pivot tables of median rent by area and bedrooms, and describe any interaction you find.",
        "Check whether any conclusion reverses when you control for area (a possible confounder).",
        "Write five findings in the pattern, evidence, caveats, implication format, each with sample sizes.",
      ],
      closing: "Your findings would be far more convincing as charts. Module 7 teaches you to draw the right chart for each question.",
    },

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
