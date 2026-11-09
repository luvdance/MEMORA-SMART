/**
 * MACHINE LEARNING AND AI · MODULE 24 · FINAL CAPSTONE PROJECT
 *
 * Curriculum 24.1 – 24.10. The learner independently identifies a problem,
 * obtains data, preprocesses it, selects and justifies an algorithm, trains
 * and evaluates a model, builds a working application or API, publishes a
 * documented GitHub repository and presents the work. The lessons walk
 * through each deliverable with a small, checked tool the learner builds
 * and then reuses on their own project: a problem-statement checker, a
 * dataset profile, a preprocessing log, a justified model choice, an
 * end-to-end evaluation, bootstrap confidence intervals, the prediction API
 * and a repository README checker.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

export const SECTION_ID = "ml-s24-capstone";

const PY = "python";
const py = String.raw;

// A student-performance dataset, the default capstone example.
const STUDENTS = py`import numpy as np
import pandas as pd
_rng = np.random.default_rng(24)
_n = 600
students = pd.DataFrame({
    "attendance": _rng.uniform(40, 100, _n).round(),
    "study_hours": _rng.gamma(2.0, 3.0, _n).round(1),
    "prev_score": _rng.normal(60, 12, _n).round(),
    "school_type": _rng.choice(["public", "private"], _n, p=[0.7, 0.3]),
    "distance_km": _rng.exponential(4, _n).round(1),
})
students.loc[_rng.choice(_n, 30, replace=False), "study_hours"] = np.nan
_score = 0.04 * students["attendance"] + 0.25 * students["study_hours"].fillna(5) + 0.05 * students["prev_score"] - 0.1 * students["distance_km"] + _rng.normal(0, 1, _n)
students["passed"] = (_score > np.quantile(_score, 0.35)).astype(int)
`;

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 105 · 24.1 – 24.3
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ml-l105-capstone-problem-data",
    moduleId: "ml-m24-capstone",
    sectionId: SECTION_ID,
    order: 1,
    covers: ["24.1", "24.2", "24.3"],
    title: "Choosing a Project, the Problem Statement and the Dataset",
    subtitle: "Starting a capstone the way real ML projects start",
    estimatedMinutes: 40,
    intro:
      "Most failed ML projects fail at the start: a vague goal, the wrong target, or data that cannot answer the question. This lesson sets your capstone up properly, with a problem statement and a dataset description you could hand to a stakeholder.",

    atoms: [
      {
        id: "a-ml-choosing-capstone",
        title: "Identifying a problem and choosing a capstone project",
        explain:
          "A good capstone solves a REAL problem with a clear decision attached, has ACCESSIBLE data (public datasets on Kaggle, the UCI repository, data.gov.ng, the Nigerian Bureau of Statistics, or data you can collect ethically), is FEASIBLE in the time available, and lets you demonstrate the whole lifecycle: data, model, evaluation, application and documentation. Suggested projects: student academic performance prediction, fraud detection, customer churn prediction, crop disease image classification, house price prediction, a recommendation engine, sports match outcome prediction, Nigerian business sales forecasting, customer sentiment analysis, or intelligent CV classification. Prefer a narrow problem done thoroughly to an ambitious one done superficially.",
        table: {
          caption: "The suggested capstones, and what each demonstrates.",
          headers: ["Project", "Task type", "Core techniques"],
          rows: [
            ["Student performance prediction", "Binary classification", "Tabular preprocessing, logistic regression, gradient boosting, fairness by school type"],
            ["Fraud detection", "Imbalanced classification", "Velocity features, class weights, precision@k, anomaly detection"],
            ["Customer churn prediction", "Binary classification", "Feature engineering, threshold choice from business costs"],
            ["Crop disease classification", "Image classification", "CNNs, augmentation, transfer learning"],
            ["House price prediction", "Regression", "Encoding location, regularisation, log targets"],
            ["Recommendation engine", "Ranking", "Collaborative and content-based filtering, precision@k"],
            ["Match outcome prediction", "Multiclass classification", "Elo features, calibrated probabilities, time-based splits"],
            ["Sales forecasting", "Time-series forecasting", "Lag features, seasonal baselines, walk-forward validation"],
            ["Sentiment analysis", "Text classification", "TF-IDF, n-grams, Transformers"],
            ["CV classification", "Text classification", "Document parsing, TF-IDF or embeddings, bias auditing"],
          ],
        },
        decision: {
          scenario: "A learner proposes: \"Use AI to improve Nigerian agriculture.\"",
          question: "What is the most useful next step?",
          options: [
            { id: "a", text: "Start training a large neural network on any agricultural data available", whyWrong: "Without a specific decision and target, there is nothing to evaluate against." },
            { id: "b", text: "Narrow it to a specific decision and prediction, such as classifying cassava leaf disease from phone photos for extension workers", why: "A concrete user, decision, input and output make the project feasible, measurable and useful." },
            { id: "c", text: "Collect every dataset about agriculture first", whyWrong: "Data collection should follow a defined problem, not precede it." },
            { id: "d", text: "Write the final report first", whyWrong: "There is nothing yet to report." },
          ],
          correct: "b",
          aftermath: "A capstone starts from a decision someone makes, not from a technology.",
        },
      },
      {
        id: "a-ml-problem-statement",
        title: "Problem statement",
        explain:
          "A PROBLEM STATEMENT fixes, in a few sentences: the USER and the DECISION the model supports; the TARGET to predict, defined precisely (\"fails the end-of-term exam\", not \"performs badly\"); the PREDICTION MOMENT and therefore which features are allowed (week 4 of term: attendance and quiz scores so far, but not the final exam); the METRIC chosen and why (recall, because missing a struggling student costs more than an extra tutoring session); the BASELINE to beat; and a SUCCESS THRESHOLD agreed in advance. Writing it down before modelling prevents moving the goalposts later and exposes leakage early.",
        codeChallenge: {
          task:
            "Write check_problem(statement) that takes a dictionary and returns a sorted list of problems. Required keys: user, decision, target, prediction_moment, metric, baseline, success_threshold; each missing or empty key produces \"missing <key>\". Additionally: if metric is \"accuracy\" and the statement has imbalanced set to True, add \"accuracy misleads on imbalanced data\"; and if success_threshold is a number not greater than baseline_score (when baseline_score is given), add \"threshold does not beat baseline\".",
          starter: "REQUIRED = [\"user\", \"decision\", \"target\", \"prediction_moment\", \"metric\", \"baseline\", \"success_threshold\"]\n\ndef check_problem(statement):\n    pass\n",
          sample: "a complete statement → []; one using accuracy on 3% fraud → [\"accuracy misleads on imbalanced data\"]",
          tests: [
            {
              check: py`good = {
    "user": "Class teachers in two Lagos secondary schools",
    "decision": "Which students to offer extra tutoring in week 5",
    "target": "Fails (scores below 50) in the end-of-term mathematics exam",
    "prediction_moment": "End of week 4, using attendance and quiz scores to date",
    "metric": "recall", "baseline": "Flag students who failed last term", "baseline_score": 0.55,
    "success_threshold": 0.75, "imbalanced": False,
}
assert check_problem(good) == [], "A complete statement has no problems. Got " + repr(check_problem(good))
bad = {"user": "Bank", "decision": "", "target": "fraud", "metric": "accuracy", "imbalanced": True, "baseline_score": 0.97, "success_threshold": 0.96}
assert check_problem(bad) == ["accuracy misleads on imbalanced data", "missing baseline", "missing decision", "missing prediction_moment", "threshold does not beat baseline"], "Got " + repr(check_problem(bad))`,
            },
          ],
          solution: py`REQUIRED = ["user", "decision", "target", "prediction_moment", "metric", "baseline", "success_threshold"]

def check_problem(statement):
    problems = [f"missing {k}" for k in REQUIRED if statement.get(k) in (None, "")]
    if statement.get("metric") == "accuracy" and statement.get("imbalanced") is True:
        problems.append("accuracy misleads on imbalanced data")
    threshold = statement.get("success_threshold")
    base = statement.get("baseline_score")
    if isinstance(threshold, (int, float)) and base is not None and threshold <= base:
        problems.append("threshold does not beat baseline")
    return sorted(problems)
`,
          hint: "statement.get(k) in (None, \"\") catches both missing and empty keys. Then add the two consistency checks, and sort the list.",
          successMessage: "Run this on your own capstone's problem statement before writing any model code. A fraud model \"aiming\" for 96% accuracy when doing nothing scores 97% is a project heading for failure.",
        },
      },
      {
        id: "a-ml-dataset-description",
        title: "Dataset description",
        explain:
          "A DATASET DESCRIPTION (a lightweight datasheet) states the SOURCE and licence, how and when the data was COLLECTED, what one row represents, the number of rows and columns, each column's meaning, type and missing share, the TARGET'S distribution (class balance or range), known quality problems, personal or sensitive fields and how they are protected, and the time period covered. It lets a reviewer judge in minutes whether the data can answer the problem statement, and it is the first section of your technical documentation. Generate the numeric parts with code so they stay correct when the data changes.",
        codeChallenge: {
          task:
            "Write describe_dataset(df, target) that returns a dictionary: \"rows\" and \"columns\" (counts, the target included); \"types\" mapping each column to \"numeric\" or \"categorical\" (pd.api.types.is_numeric_dtype); \"missing_pct\" mapping each column with any missing values to its missing percentage rounded to 1; and \"target_balance\" mapping each target value to its share rounded to 3 (value_counts(normalize=True)).",
          starter: "import pandas as pd\n\ndef describe_dataset(df, target):\n    pass\n",
          sample: "describe_dataset(students, \"passed\")[\"missing_pct\"] → {\"study_hours\": 5.0}",
          tests: [
            {
              check: STUDENTS + py`
d = describe_dataset(students, "passed")
assert d["rows"] == 600 and d["columns"] == 6, "600 rows and 6 columns. Got " + repr((d["rows"], d["columns"]))
assert d["types"] == {"attendance": "numeric", "study_hours": "numeric", "prev_score": "numeric", "school_type": "categorical", "distance_km": "numeric", "passed": "numeric"}, "Got " + repr(d["types"])
assert d["missing_pct"] == {"study_hours": 5.0}, "Only study_hours has gaps: 30 of 600. Got " + repr(d["missing_pct"])
assert d["target_balance"] == {1: 0.65, 0: 0.35}, "65% passed. Got " + repr(d["target_balance"])`,
            },
          ],
          solution: py`import pandas as pd

def describe_dataset(df, target):
    missing = (df.isna().mean() * 100).round(1)
    return {
        "rows": len(df),
        "columns": df.shape[1],
        "types": {c: "numeric" if pd.api.types.is_numeric_dtype(df[c]) else "categorical" for c in df.columns},
        "missing_pct": {c: float(v) for c, v in missing.items() if v > 0},
        "target_balance": {k: round(float(v), 3) for k, v in df[target].value_counts(normalize=True).items()},
    }
`,
          hint: "df.isna().mean() * 100 gives missing percentages per column; keep those above 0. value_counts(normalize=True) gives the target's shares.",
          successMessage: "Rows, types, gaps and balance, generated from the data itself: paste the output into your dataset description and regenerate it whenever the data changes.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 106 · 24.4 – 24.6
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ml-l106-capstone-modelling",
    moduleId: "ml-m24-capstone",
    sectionId: SECTION_ID,
    order: 2,
    covers: ["24.4", "24.5", "24.6"],
    title: "Preprocessing, Algorithm Selection, Training and Evaluation",
    subtitle: "Documented, justified and leakage-free modelling",
    estimatedMinutes: 44,
    intro:
      "The middle of the capstone is where earlier modules come together: a documented preprocessing pipeline, a model chosen for stated reasons, and an evaluation that would survive a sceptical reviewer.",

    atoms: [
      {
        id: "a-ml-preprocessing-documentation",
        title: "Data preprocessing documentation",
        explain:
          "Document every preprocessing decision so another engineer could reproduce it and a reviewer could challenge it: rows removed and why (duplicates, impossible values) with COUNTS before and after; how each column's missing values were handled and with what statistic; encodings; scaling; engineered features with their definitions; and the train-test split (method, proportions, seed, stratification or time cut-off). Record also what was deliberately NOT done (\"school name was dropped: an identifier\"; \"final_exam_score excluded: leakage\"). Keeping a step-by-step LOG in code produces the table for your report automatically.",
        codeChallenge: {
          task:
            "Write a class PrepLog. step(name, df_before, df_after, note) records a dictionary {\"step\": name, \"rows_before\": …, \"rows_after\": …, \"removed\": …, \"note\": note} and returns df_after. table() returns the list of recorded dictionaries. Then write clean(students, log) that, using the log: (1) drops duplicate rows (\"drop duplicates\"); (2) keeps only rows with attendance between 0 and 100 (\"valid attendance\"); (3) fills missing study_hours with the median (\"impute study_hours\", no rows removed); and returns the cleaned DataFrame.",
          starter: "import pandas as pd\n\nclass PrepLog:\n    pass\n\ndef clean(students, log):\n    pass\n",
          sample: "log.table()[0] → {\"step\": \"drop duplicates\", \"rows_before\": 605, \"rows_after\": 600, \"removed\": 5, \"note\": \"...\"}",
          tests: [
            {
              check: STUDENTS + py`
messy = pd.concat([students, students.iloc[:5]], ignore_index=True)
messy.loc[[10, 20], "attendance"] = [130, -5]
log = PrepLog()
out = clean(messy, log)
t = log.table()
assert [s["step"] for s in t] == ["drop duplicates", "valid attendance", "impute study_hours"], "Three steps, in order. Got " + repr([s["step"] for s in t])
assert (t[0]["rows_before"], t[0]["rows_after"], t[0]["removed"]) == (605, 600, 5), "Five duplicates removed. Got " + repr(t[0])
assert t[1]["removed"] == 2 and t[2]["removed"] == 0, "Two invalid attendance rows removed; imputation removes none."
assert len(out) == 598 and out["study_hours"].isna().sum() == 0, "598 rows remain, with no missing study hours."
assert all(isinstance(s["note"], str) and s["note"] for s in t), "Every step needs a note explaining it."`,
            },
          ],
          solution: py`import pandas as pd

class PrepLog:
    def __init__(self):
        self.steps = []

    def step(self, name, df_before, df_after, note):
        self.steps.append({
            "step": name,
            "rows_before": len(df_before),
            "rows_after": len(df_after),
            "removed": len(df_before) - len(df_after),
            "note": note,
        })
        return df_after

    def table(self):
        return list(self.steps)

def clean(students, log):
    df = log.step("drop duplicates", students, students.drop_duplicates(), "Exact duplicate rows from a repeated export.")
    df = log.step("valid attendance", df, df[df["attendance"].between(0, 100)], "Attendance is a percentage; other values are entry errors.")
    filled = df.assign(study_hours=df["study_hours"].fillna(df["study_hours"].median()))
    return log.step("impute study_hours", df, filled, "Median study hours used for the 5% of students who did not answer.")
`,
          hint: "step() measures len(df_before) and len(df_after), stores the record, and returns df_after, so each cleaning line is log.step(name, before, after, note).",
          successMessage: "Your report's preprocessing table now writes itself, with counts that are always correct. Reviewers trust numbers that come straight from the pipeline.",
        },
      },
      {
        id: "a-ml-algorithm-justification",
        title: "Algorithm selection justification",
        explain:
          "Justify the chosen algorithm with EVIDENCE and REASONS, not preference. Evidence: a comparison of several candidates (a baseline, an interpretable model, one or two stronger models) under the same cross-validation, reporting the mean and spread of the chosen metric. Reasons: the problem's constraints (interpretability for teachers or regulators, prediction latency, data size, maintenance effort, fairness across groups) and the \"simplest model within the noise of the best\" rule (Module 13). State what you would try with more time. A justification such as \"logistic regression was within 0.01 F1 of gradient boosting, is explainable to teachers, and trains in under a second\" is strong; \"I used XGBoost because it usually wins\" is not.",
        codeChallenge: {
          task:
            "Write justify(results, interpretable, tolerance=0.01) where results is a dictionary {model_name: list of CV scores} and interpretable is a set of names. Return a tuple (choice, sentence): choice is the best-mean model, unless an interpretable model's mean is within tolerance of the best mean, in which case choose the interpretable model with the highest mean. sentence is exactly \"<choice> chosen: mean <m> vs best <b> (<best_name>)\" with means to 3 decimal places.",
          starter: "import numpy as np\n\ndef justify(results, interpretable, tolerance=0.01):\n    pass\n",
          sample: "justify({\"logreg\": [...], \"gbm\": [...]}, {\"logreg\"}) → (\"logreg\", \"logreg chosen: mean 0.842 vs best 0.849 (gbm)\")",
          tests: [
            {
              check: py`res = {"dummy": [0.65, 0.65, 0.65], "logreg": [0.84, 0.85, 0.836], "tree": [0.80, 0.82, 0.81], "gbm": [0.85, 0.852, 0.845]}
c, s = justify(res, {"logreg", "tree"})
assert c == "logreg", "logreg is within 0.01 of gbm and interpretable. Got " + repr(c)
assert s == "logreg chosen: mean 0.842 vs best 0.849 (gbm)", "Got " + repr(s)
c2, s2 = justify(res, {"logreg", "tree"}, tolerance=0.005)
assert c2 == "gbm" and s2 == "gbm chosen: mean 0.849 vs best 0.849 (gbm)", "With a tighter tolerance the best model wins. Got " + repr((c2, s2))
assert justify({"a": [0.5], "b": [0.9]}, set())[0] == "b", "No interpretable candidates: pick the best."`,
            },
          ],
          solution: py`import numpy as np

def justify(results, interpretable, tolerance=0.01):
    means = {name: float(np.mean(scores)) for name, scores in results.items()}
    best_name = max(means, key=means.get)
    best = means[best_name]
    close = [n for n in interpretable if n in means and best - means[n] <= tolerance]
    choice = max(close, key=means.get) if close else best_name
    return choice, f"{choice} chosen: mean {means[choice]:.3f} vs best {best:.3f} ({best_name})"
`,
          hint: "Compute every mean, find the best, collect interpretable models within tolerance, choose the best of those if any. Format with f-strings and :.3f.",
          successMessage: "One sentence, backed by numbers, that states the trade-off you made. That is what examiners and employers look for in an algorithm justification.",
        },
      },
      {
        id: "a-ml-capstone-training-evaluation",
        title: "Model training and evaluation",
        explain:
          "The final modelling run follows the discipline of the whole course: split FIRST (stratified, or by time), build ONE Pipeline (preprocessing plus model) so nothing leaks, tune with cross-validation on the training set only, refit the chosen configuration on all the training data, then evaluate ONCE on the untouched test set, beside the baseline, with the problem statement's metric. Report the confusion matrix and per-group results, examine errors, and save the fitted pipeline with its metadata (Module 19). If the test result disappoints, report it honestly: a well-documented negative result is a better capstone than an inflated one.",
        codeChallenge: {
          task:
            "Write train_and_evaluate(df, target) for the student data: split with train_test_split(test_size=0.25, random_state=0, stratify=df[target]); build a Pipeline with a ColumnTransformer (median imputation + StandardScaler for the numeric columns attendance, study_hours, prev_score and distance_km; OneHotEncoder(handle_unknown=\"ignore\") for school_type) followed by LogisticRegression(max_iter=1000); fit on the training data; and return {\"recall\": test recall of class 0 (students who fail) rounded to 3, \"baseline_recall\": the recall of class 0 for DummyClassifier(strategy=\"most_frequent\") rounded to 3, \"model\": the fitted pipeline}.",
          starter: "from sklearn.model_selection import train_test_split\nfrom sklearn.compose import ColumnTransformer\nfrom sklearn.pipeline import Pipeline, make_pipeline\nfrom sklearn.impute import SimpleImputer\nfrom sklearn.preprocessing import StandardScaler, OneHotEncoder\nfrom sklearn.linear_model import LogisticRegression\nfrom sklearn.dummy import DummyClassifier\nfrom sklearn.metrics import recall_score\n\nNUMERIC = [\"attendance\", \"study_hours\", \"prev_score\", \"distance_km\"]\nCATEGORICAL = [\"school_type\"]\n\ndef train_and_evaluate(df, target):\n    pass\n",
          sample: "{\"recall\": 0.8…, \"baseline_recall\": 0.0, \"model\": Pipeline(...)}",
          tests: [
            {
              check: STUDENTS + py`
r = train_and_evaluate(students, "passed")
assert r["baseline_recall"] == 0.0, "Predicting the majority class (pass) catches no failing student. Got " + repr(r["baseline_recall"])
assert r["recall"] > 0.6, "The model should catch most failing students. Got " + repr(r["recall"])
from sklearn.pipeline import Pipeline
assert isinstance(r["model"], Pipeline), "Return the fitted Pipeline."
p = r["model"].predict(students.drop(columns="passed").head(5))
assert len(p) == 5, "The returned pipeline predicts from raw rows, missing values included."
assert set(r) == {"recall", "baseline_recall", "model"}, "Return the three keys."`,
            },
          ],
          solution: py`from sklearn.model_selection import train_test_split
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline, make_pipeline
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.linear_model import LogisticRegression
from sklearn.dummy import DummyClassifier
from sklearn.metrics import recall_score

NUMERIC = ["attendance", "study_hours", "prev_score", "distance_km"]
CATEGORICAL = ["school_type"]

def train_and_evaluate(df, target):
    X, y = df.drop(columns=target), df[target]
    Xtr, Xte, ytr, yte = train_test_split(X, y, test_size=0.25, random_state=0, stratify=y)
    prep = ColumnTransformer([
        ("num", make_pipeline(SimpleImputer(strategy="median"), StandardScaler()), NUMERIC),
        ("cat", OneHotEncoder(handle_unknown="ignore"), CATEGORICAL),
    ])
    model = Pipeline([("prep", prep), ("clf", LogisticRegression(max_iter=1000))]).fit(Xtr, ytr)
    dummy = DummyClassifier(strategy="most_frequent").fit(Xtr, ytr)
    return {
        "recall": round(recall_score(yte, model.predict(Xte), pos_label=0), 3),
        "baseline_recall": round(recall_score(yte, dummy.predict(Xte), pos_label=0, zero_division=0), 3),
        "model": model,
    }
`,
          hint: "recall_score(y_test, predictions, pos_label=0) measures how many failing students (class 0) are caught. Add zero_division=0 for the dummy, which never predicts 0.",
          successMessage: "Split first, one leak-proof pipeline, a baseline that catches nobody, and a model that catches most struggling students: an evaluation that would survive review.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 107 · 24.7 – 24.10
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ml-l107-capstone-delivery",
    moduleId: "ml-m24-capstone",
    sectionId: SECTION_ID,
    order: 3,
    covers: ["24.7", "24.8", "24.9", "24.10"],
    title: "Metrics, the Application, the Repository and the Presentation",
    subtitle: "Delivering the capstone so others can use, check and trust it",
    estimatedMinutes: 46,
    intro:
      "The last mile is where a project becomes a portfolio piece: honest metrics with uncertainty, a working application, a repository a stranger can run, and a presentation that tells the story in ten minutes.",

    atoms: [
      {
        id: "a-ml-performance-metrics",
        title: "Performance metrics",
        explain:
          "Report the metrics from your problem statement on the TEST set, beside the baseline, and add: the confusion matrix; per-group metrics for any relevant groups (school type, region, gender); a calibration check if probabilities are shown to users; and UNCERTAINTY. A test set of a few hundred rows gives a noisy estimate, so report a CONFIDENCE INTERVAL, most simply by BOOTSTRAPPING: resample the test rows with replacement many times, recompute the metric each time, and take the 2.5th and 97.5th percentiles as a 95% interval. \"Recall 0.82 (95% CI 0.74–0.89)\" is far more honest than \"recall 0.82\", and it shows whether an improvement over the baseline is real.",
        codeChallenge: {
          task:
            "Write bootstrap_ci(y_true, y_pred, metric, n_boot=1000, seed=0) that draws n_boot resamples of the row indices with replacement using np.random.default_rng(seed).integers(0, n, n) for each, computes metric(y_true[idx], y_pred[idx]) on each, and returns (point, low, high): the metric on the full data and the 2.5th and 97.5th percentiles of the resampled values, each rounded to 3.",
          starter: "import numpy as np\n\ndef bootstrap_ci(y_true, y_pred, metric, n_boot=1000, seed=0):\n    pass\n",
          sample: "bootstrap_ci(y, pred, accuracy) → (0.85, 0.80, 0.89)",
          tests: [
            {
              check: py`import numpy as np
from sklearn.metrics import accuracy_score
rng = np.random.default_rng(3)
y = rng.integers(0, 2, 300)
pred = np.where(rng.uniform(0, 1, 300) < 0.85, y, 1 - y)
point, low, high = bootstrap_ci(y, pred, accuracy_score)
assert point == round(accuracy_score(y, pred), 3), "The point estimate is the metric on all rows."
assert low < point < high, "The interval should contain the point estimate. Got " + repr((low, point, high))
assert 0.05 < high - low < 0.12, "With 300 rows a 95% interval for accuracy is several points wide. Got width " + str(round(high - low, 3))
again = bootstrap_ci(y, pred, accuracy_score)
assert again == (point, low, high), "The seed makes the interval reproducible."
small = bootstrap_ci(y[:60], pred[:60], accuracy_score)
assert small[2] - small[1] > high - low, "Fewer test rows give a wider interval."`,
            },
          ],
          solution: py`import numpy as np

def bootstrap_ci(y_true, y_pred, metric, n_boot=1000, seed=0):
    y_true, y_pred = np.asarray(y_true), np.asarray(y_pred)
    rng = np.random.default_rng(seed)
    n = len(y_true)
    values = []
    for _ in range(n_boot):
        idx = rng.integers(0, n, n)
        values.append(metric(y_true[idx], y_pred[idx]))
    low, high = np.percentile(values, [2.5, 97.5])
    return round(metric(y_true, y_pred), 3), round(float(low), 3), round(float(high), 3)
`,
          hint: "Inside a loop of n_boot: idx = rng.integers(0, n, n); compute the metric on the resampled rows. np.percentile(values, [2.5, 97.5]) gives the interval.",
          successMessage: "With 300 test rows the accuracy is only known to within a few points; with 60, much less precisely. Put intervals in your capstone report, and claims about improvements become testable.",
        },
      },
      {
        id: "a-ml-capstone-application",
        title: "A working application or API",
        explain:
          "The capstone must be USABLE: at minimum a FastAPI service (Module 19) with validated input and output models, health and model-info endpoints, and the saved pipeline loaded once at startup; ideally also a simple frontend (Module 20), a log of predictions, and a Dockerfile (Module 21). Keep the scope realistic: a clean, working API with good error handling beats an ambitious app that crashes in the demo. Deploy it if you can (Render, Railway, Fly.io, Hugging Face Spaces or a cloud free tier offer free or cheap hosting) and record a short screen capture as a fallback for the presentation.",
        codeChallenge: {
          task:
            "Build the capstone API skeleton. Given a fitted pipeline as model (provided by the starter), create app = FastAPI(title=\"Student Risk API\"); a pydantic StudentIn with attendance (float, 0 to 100 inclusive), study_hours (float, at least 0), prev_score (float, 0 to 100 inclusive), school_type (\"public\" or \"private\") and distance_km (float, at least 0); and endpoints GET /health returning {\"status\": \"ok\"} (function health) and POST /predict (function predict) returning {\"at_risk\": bool (True when the predicted class is 0, failing), \"probability_fail\": probability of class 0 rounded to 3, \"model_version\": \"1.0.0\"}.",
          starter: STUDENTS + py`from typing import Literal
from fastapi import FastAPI
from pydantic import BaseModel, Field
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline, make_pipeline
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.linear_model import LogisticRegression

NUMERIC = ["attendance", "study_hours", "prev_score", "distance_km"]
model = Pipeline([
    ("prep", ColumnTransformer([
        ("num", make_pipeline(SimpleImputer(strategy="median"), StandardScaler()), NUMERIC),
        ("cat", OneHotEncoder(handle_unknown="ignore"), ["school_type"]),
    ])),
    ("clf", LogisticRegression(max_iter=1000)),
]).fit(students.drop(columns="passed"), students["passed"])

`,
          sample: "predict(StudentIn(attendance=45, study_hours=1, prev_score=40, school_type=\"public\", distance_km=12)) → {\"at_risk\": True, ...}",
          tests: [
            {
              check: py`from pydantic import ValidationError
assert app.title == "Student Risk API", "Set the app title."
routes = {r.path: r.methods for r in app.routes if hasattr(r, "methods")}
assert "GET" in routes.get("/health", set()) and "POST" in routes.get("/predict", set()), "Register GET /health and POST /predict. Got " + repr(routes)
assert health() == {"status": "ok"}, "health() returns {\"status\": \"ok\"}."
weak = predict(StudentIn(attendance=45, study_hours=1, prev_score=40, school_type="public", distance_km=12))
strong = predict(StudentIn(attendance=98, study_hours=12, prev_score=85, school_type="private", distance_km=1))
assert set(weak) == {"at_risk", "probability_fail", "model_version"}, "Return the three fields. Got " + repr(weak)
assert weak["at_risk"] is True and strong["at_risk"] is False, "A struggling student is at risk; a strong one is not."
assert weak["probability_fail"] > 0.5 > strong["probability_fail"] and weak["model_version"] == "1.0.0", "Probability of failing, rounded, and the version."
for bad in [dict(attendance=120, study_hours=1, prev_score=40, school_type="public", distance_km=1), dict(attendance=50, study_hours=-1, prev_score=40, school_type="public", distance_km=1), dict(attendance=50, study_hours=1, prev_score=40, school_type="federal", distance_km=1)]:
    try:
        StudentIn(**bad)
        assert False, "Invalid input must be rejected: " + repr(bad)
    except ValidationError:
        pass`,
            },
          ],
          solution: STUDENTS + py`from typing import Literal
from fastapi import FastAPI
from pydantic import BaseModel, Field
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline, make_pipeline
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.linear_model import LogisticRegression

NUMERIC = ["attendance", "study_hours", "prev_score", "distance_km"]
model = Pipeline([
    ("prep", ColumnTransformer([
        ("num", make_pipeline(SimpleImputer(strategy="median"), StandardScaler()), NUMERIC),
        ("cat", OneHotEncoder(handle_unknown="ignore"), ["school_type"]),
    ])),
    ("clf", LogisticRegression(max_iter=1000)),
]).fit(students.drop(columns="passed"), students["passed"])

app = FastAPI(title="Student Risk API")

class StudentIn(BaseModel):
    attendance: float = Field(ge=0, le=100)
    study_hours: float = Field(ge=0)
    prev_score: float = Field(ge=0, le=100)
    school_type: Literal["public", "private"]
    distance_km: float = Field(ge=0)

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/predict")
def predict(student: StudentIn):
    row = pd.DataFrame([student.model_dump()])
    p_fail = float(model.predict_proba(row)[0][list(model.classes_).index(0)])
    return {"at_risk": bool(model.predict(row)[0] == 0), "probability_fail": round(p_fail, 3), "model_version": "1.0.0"}
`,
          hint: "StudentIn uses Field(ge=..., le=...) and Literal for school_type. In predict, build a one-row DataFrame from student.model_dump(); the probability of class 0 is predict_proba(row)[0] at the position of 0 in model.classes_.",
          successMessage: "Validated input, a meaningful response, and a health check: the skeleton of your capstone API. Add logging, a Dockerfile and a frontend, and it is a complete ML application.",
        },
      },
      {
        id: "a-ml-repository-documentation",
        title: "GitHub repository and technical documentation",
        explain:
          "The repository is what employers and examiners actually open. A clear STRUCTURE: README.md, requirements.txt (pinned), src/ (preprocessing, training, API code), notebooks/ (exploration, cleared of huge outputs), tests/, models/ (or a pointer to the registry), docs/ (the report), and a .gitignore; no data files over a few megabytes, no secrets. The README is the front page: what the project does and for whom, a results summary with the key metric and baseline, how to install and run it (copy-pasteable commands), how to train and test, the project structure, the data source and licence, limitations, and a link to the full technical report covering problem, data, preprocessing, modelling, evaluation, deployment and ethics.",
        codeChallenge: {
          task:
            "Write check_repo(files, readme) where files is a list of repository paths and readme the README text. Return a sorted list of problems: \"missing <path>\" for each of README.md, requirements.txt and .gitignore not in files; \"no tests\" if no path starts with \"tests/\"; \"secrets committed\" if \".env\" is in files; \"large data committed\" if any path ends with .csv, .parquet or .xlsx and starts with \"data/raw/\"; and \"README missing <section>\" for each of the headings Results, Installation, Usage and Limitations not present in the README as a line \"## <section>\".",
          starter: "def check_repo(files, readme):\n    pass\n",
          sample: "a repository with .env and data/raw/sales.csv committed → includes \"secrets committed\" and \"large data committed\"",
          tests: [
            {
              check: py`files = ["README.md", "requirements.txt", ".gitignore", "src/train.py", "src/api.py", "tests/test_api.py", "notebooks/eda.ipynb", "docs/report.pdf"]
readme = "# Student Risk Predictor\n\n## Results\nRecall 0.82\n\n## Installation\npip install -r requirements.txt\n\n## Usage\nuvicorn src.api:app\n\n## Limitations\nTwo schools only.\n"
assert check_repo(files, readme) == [], "A well-organised repository has no problems. Got " + repr(check_repo(files, readme))
bad_files = ["src/train.py", ".env", "data/raw/students.csv", "data/processed/README.md"]
bad_readme = "# My project\n\n## Usage\npython train.py\n"
want = sorted(["missing README.md", "missing requirements.txt", "missing .gitignore", "no tests", "secrets committed",
               "large data committed", "README missing Results", "README missing Installation", "README missing Limitations"])
assert check_repo(bad_files, bad_readme) == want, "Every problem, sorted. Got " + repr(check_repo(bad_files, bad_readme))`,
            },
          ],
          solution: py`def check_repo(files, readme):
    problems = [f"missing {p}" for p in ["README.md", "requirements.txt", ".gitignore"] if p not in files]
    if not any(f.startswith("tests/") for f in files):
        problems.append("no tests")
    if ".env" in files:
        problems.append("secrets committed")
    if any(f.startswith("data/raw/") and f.endswith((".csv", ".parquet", ".xlsx")) for f in files):
        problems.append("large data committed")
    headings = {line.strip() for line in readme.splitlines()}
    for section in ["Results", "Installation", "Usage", "Limitations"]:
        if f"## {section}" not in headings:
            problems.append(f"README missing {section}")
    return sorted(problems)
`,
          hint: "Build the list of problems check by check; for the README, collect the stripped lines into a set and test for \"## Results\" and the others. Sort before returning.",
          successMessage: "Run this on your own repository before you submit: a missing README section or a committed .env file is the first thing a reviewer notices.",
        },
      },
      {
        id: "a-ml-project-presentation",
        title: "Project presentation",
        explain:
          "A ten-minute capstone presentation tells a STORY for a mixed audience: (1) the PROBLEM and who it matters to, in one slide; (2) the DATA and its limits; (3) the APPROACH: what you tried and why you chose the final model (one comparison chart); (4) RESULTS against the baseline, with uncertainty and per-group findings, in business terms (\"the model would let teachers reach 82% of struggling students by tutoring 30% of the class\"); (5) a live or recorded DEMO of the application; (6) LIMITATIONS, ethical considerations and next steps. Rehearse to time, prepare for questions on leakage, metric choice, fairness and deployment, and keep a recorded demo as a backup.",
        table: {
          caption: "A ten-minute capstone presentation.",
          headers: ["Minutes", "Section", "Show"],
          rows: [
            ["0–1", "Problem", "The user, the decision, why it matters"],
            ["1–2", "Data", "Source, size, target balance, key limitation"],
            ["2–4", "Approach", "Preprocessing highlights; model comparison chart; why the final model"],
            ["4–6", "Results", "Metric vs baseline with confidence interval; per-group results; business impact"],
            ["6–8", "Demo", "The application making a prediction, including an invalid input"],
            ["8–9", "Limitations and ethics", "What it cannot do; fairness findings; risks"],
            ["9–10", "Next steps", "What you would do with more time and data"],
          ],
        },
        decision: {
          scenario: "A learner's capstone slides spend six minutes on the code of their training loop and one minute on results, with no baseline.",
          question: "What is the most important change?",
          options: [
            { id: "a", text: "Add more code to the slides", whyWrong: "Code belongs in the repository; the audience needs the story and the evidence." },
            { id: "b", text: "Restructure around the problem, the results against a baseline with uncertainty, a demo and the limitations", why: "A presentation persuades with the problem, evidence and impact; implementation details are for questions and the repository." },
            { id: "c", text: "Use more animations", whyWrong: "Style does not fix missing evidence." },
            { id: "d", text: "Speak faster to fit everything in", whyWrong: "The problem is the content, not the speed." },
          ],
          correct: "b",
          aftermath: "Problem, evidence, demo, limitations. The code is in the repository for anyone who wants it.",
        },
      },
    ],

    task: {
      title: "Final capstone project",
      intro:
        "Independently identify a problem, collect or obtain suitable data, select an appropriate algorithm, train and evaluate a model, and build a working application. Choose from the suggested projects (student performance prediction, fraud detection, churn prediction, crop disease classification, house prices, a recommendation engine, match outcome prediction, Nigerian sales forecasting, sentiment analysis or CV classification) or propose your own. Submit all ten deliverables.",
      prompts: [
        "Problem statement: user, decision, target, prediction moment, metric, baseline and success threshold.",
        "Dataset description: source, licence, collection, rows and columns, types, missing values, target balance and sensitive fields.",
        "Data preprocessing documentation: every step with row counts before and after, imputation and encoding choices, the split, and leakage checks.",
        "Algorithm selection justification: at least three models compared with cross-validation, and the reasons for your choice.",
        "Model training and evaluation: a leak-proof pipeline, tuning on training data only, one final test evaluation beside the baseline.",
        "Performance metrics: the chosen metrics with bootstrap confidence intervals, the confusion matrix and per-group results.",
        "A working application or API: validated FastAPI endpoints (and ideally a frontend), loading the saved pipeline once.",
        "A GitHub repository: clean structure, pinned requirements, tests, no data or secrets committed.",
        "Technical documentation: a README with results, installation, usage and limitations, and a full report.",
        "A project presentation: ten minutes, with a demo and a recorded backup.",
      ],
      closing: "Congratulations: you have taken machine learning from its mathematics to a deployed, documented, responsible application. Sit the certification exam to earn the Memora Smart certificate.",
    },

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
