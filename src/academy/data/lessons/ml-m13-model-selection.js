/**
 * MACHINE LEARNING AND AI · MODULE 13 · MODEL SELECTION AND OPTIMIZATION
 *
 * Curriculum 13.1 – 13.10. Comparing models fairly; cross-validation and
 * k-fold (implemented by the learner); hyperparameter tuning with grid and
 * randomized search; feature importance; pipelines with ColumnTransformer;
 * leakage-free validation (demonstrated: feature selection outside the
 * folds manufactures accuracy from pure noise); and choosing an algorithm.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

export const SECTION_ID = "ml-s13-model-selection";

const PY = "python";
const py = String.raw;

const DATA = py`import numpy as np
from sklearn.datasets import make_classification
X, y = make_classification(n_samples=400, n_features=8, n_informative=4, n_redundant=2, random_state=30)
`;

const LOANS = py`import numpy as np
import pandas as pd
_rng = np.random.default_rng(13)
_n = 300
loans = pd.DataFrame({
    "income": _rng.lognormal(12, 0.5, _n).round(-3),
    "age": _rng.integers(21, 65, _n).astype(float),
    "state": _rng.choice(["Lagos", "Kano", "Rivers", "Oyo"], _n),
    "employment": _rng.choice(["salaried", "self-employed", "unemployed"], _n, p=[0.6, 0.3, 0.1]),
})
loans.loc[_rng.choice(_n, 15, replace=False), "income"] = np.nan
_score = -0.00001 * loans["income"].fillna(150000) + (loans["employment"] == "unemployed") * 2 + _rng.normal(0, 0.8, _n)
default = (_score > np.quantile(_score, 0.8)).astype(int).to_numpy()
`;

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 59 · 13.1 – 13.3
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ml-l59-comparing-cross-validation",
    moduleId: "ml-m13-model-selection",
    sectionId: SECTION_ID,
    order: 1,
    covers: ["13.1", "13.2", "13.3"],
    title: "Comparing Models and Cross-Validation",
    subtitle: "Fair comparisons, and using all your data to measure",
    estimatedMinutes: 38,
    intro:
      "A single train-test split gives a noisy score: a lucky split can make a weak model look strong. Cross-validation evaluates every model on several splits and reports the spread, so comparisons mean something.",

    atoms: [
      {
        id: "a-ml-comparing-models",
        title: "Comparing machine learning models",
        explain:
          "A FAIR comparison uses the SAME data splits, the SAME preprocessing (fitted inside each split), the SAME metric chosen for the business problem, and accounts for RANDOMNESS. Scores from one split vary with which rows landed in the test set, sometimes by several percentage points on small data, so a model that wins by 0.5% on one split may simply have been lucky. Report the mean AND the spread across several splits, include a baseline, and weigh accuracy against other criteria: training and prediction speed, interpretability, memory, and how easily the model can be maintained.",
        codeExercise: {
          language: PY,
          code: DATA + py`from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.tree import DecisionTreeClassifier

wins = 0
for seed in range(10):
    Xtr, Xte, ytr, yte = train_test_split(X, y, test_size=0.25, random_state=seed)
    a = LogisticRegression(max_iter=1000).fit(Xtr, ytr).score(Xte, yte)
    b = DecisionTreeClassifier(max_depth=4, random_state=0).fit(Xtr, ytr).score(Xte, yte)
    wins += a > b
print(wins, "of 10 splits favour logistic regression")
`,
          question: "The same two models are compared on ten different random splits. On how many does logistic regression win?",
          expectedOutput: "4 of 10 splits favour logistic regression",
          hint: "The winner changes with the split: neither model wins every time.",
          successMessage: "Logistic regression won on 4 splits and the tree on 6: report either single split and you would crown a different winner. One split is an anecdote; many splits are evidence.",
        },
      },
      {
        id: "a-ml-cross-validation",
        title: "Cross-validation",
        explain:
          "CROSS-VALIDATION (CV) estimates performance by training and evaluating several times on different partitions of the training data, then averaging. cross_val_score(model, X, y, cv=5, scoring=\"f1\") returns one score per split; report mean ± standard deviation. CV makes use of all the data for both training and validation, which matters when data is scarce, and it is what you use to choose models and hyperparameters, keeping the final TEST set untouched until the end. Variants: StratifiedKFold (the default for classifiers, preserving class balance), GroupKFold (keeps each customer's rows together) and TimeSeriesSplit (always validates on later data than it trains on).",
        codeExercise: {
          language: PY,
          code: DATA + py`from sklearn.model_selection import cross_val_score
from sklearn.linear_model import LogisticRegression

scores = cross_val_score(LogisticRegression(max_iter=1000), X, y, cv=5)
print(len(scores))
print(round(scores.mean(), 3), round(scores.std(), 3))
`,
          question: "5-fold cross-validation returns one accuracy per fold. What is printed?",
          expectedOutput: "5\n0.812 0.026",
          hint: "One score per fold; report their mean and standard deviation.",
          successMessage: "0.812 ± 0.026 says far more than a single number: differences smaller than the spread are not convincing.",
        },
      },
      {
        id: "a-ml-kfold",
        title: "K-fold cross-validation",
        explain:
          "K-FOLD CV shuffles (optionally) and splits the data into k equal FOLDS. Each fold takes one turn as the validation set while the other k − 1 folds train the model, giving k scores; every row is validated exactly once. k = 5 or 10 is standard: larger k uses more data for training each time (less bias in the estimate) at the cost of more training runs. LEAVE-ONE-OUT is the extreme k = n. When folds are uneven (n not divisible by k), the first n mod k folds get one extra row, which is how scikit-learn's KFold splits.",
        codeChallenge: {
          task:
            "Without scikit-learn's splitters, write kfold_indices(n, k) that returns a list of k (train_idx, val_idx) pairs of NumPy arrays for the indices 0 … n−1 in order (no shuffling): fold sizes are n // k, plus one extra for each of the first n % k folds. Then write cv_scores(model, X, y, k) that, for each pair, fits sklearn.base.clone(model) on the training rows and appends its .score on the validation rows; return the list of scores.",
          starter: "import numpy as np\nfrom sklearn.base import clone\n\ndef kfold_indices(n, k):\n    pass\n\ndef cv_scores(model, X, y, k):\n    pass\n",
          sample: "kfold_indices(10, 3) → validation folds [0 1 2 3], [4 5 6], [7 8 9]",
          tests: [
            {
              check: DATA + py`
from sklearn.model_selection import KFold, cross_val_score
from sklearn.linear_model import LogisticRegression
folds = kfold_indices(10, 3)
assert [f[1].tolist() for f in folds] == [[0, 1, 2, 3], [4, 5, 6], [7, 8, 9]], "The first n % k folds get one extra row. Got " + repr([f[1].tolist() for f in folds])
assert folds[0][0].tolist() == [4, 5, 6, 7, 8, 9], "Training indices are everything outside the fold."
ref = [v.tolist() for _, v in KFold(5).split(np.zeros(23))]
assert [v.tolist() for _, v in kfold_indices(23, 5)] == ref, "Must match scikit-learn's KFold."
mine = cv_scores(LogisticRegression(max_iter=1000), X, y, 5)
want = cross_val_score(LogisticRegression(max_iter=1000), X, y, cv=KFold(5))
assert np.allclose(mine, want), "Scores must match cross_val_score with KFold(5). Got " + repr(mine)`,
            },
          ],
          solution: py`import numpy as np
from sklearn.base import clone

def kfold_indices(n, k):
    sizes = [n // k + (1 if i < n % k else 0) for i in range(k)]
    idx = np.arange(n)
    folds, start = [], 0
    for size in sizes:
        val = idx[start:start + size]
        train = np.concatenate([idx[:start], idx[start + size:]])
        folds.append((train, val))
        start += size
    return folds

def cv_scores(model, X, y, k):
    scores = []
    for train, val in kfold_indices(len(X), k):
        m = clone(model).fit(X[train], y[train])
        scores.append(m.score(X[val], y[val]))
    return scores
`,
          hint: "Compute the fold sizes first, then walk a start pointer: the fold is idx[start:start + size] and training is everything before and after it, joined with np.concatenate.",
          successMessage: "Your folds match KFold exactly, and your scores match cross_val_score. CV is just this loop with careful bookkeeping.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 60 · 13.4 – 13.6
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ml-l60-hyperparameter-search",
    moduleId: "ml-m13-model-selection",
    sectionId: SECTION_ID,
    order: 2,
    covers: ["13.4", "13.5", "13.6"],
    title: "Hyperparameter Tuning: Grid and Randomized Search",
    subtitle: "Searching for the best settings, honestly and efficiently",
    estimatedMinutes: 38,
    intro:
      "Tree depth, k, C, alpha, learning rate: hyperparameters change results dramatically. Searching them by hand is slow and biased; grid and randomized search do it systematically, scoring every candidate by cross-validation.",

    atoms: [
      {
        id: "a-ml-hyperparameter-tuning",
        title: "Hyperparameter tuning",
        explain:
          "TUNING searches for hyperparameter values that give the best VALIDATION performance. The procedure: choose the hyperparameters that matter most for the algorithm (for a random forest: max_depth, min_samples_leaf, max_features; for an SVM: C and gamma; for gradient boosting: learning_rate, n_estimators, max_depth), define a range for each (often on a LOG scale for C, alpha and learning rates: 0.001, 0.01, 0.1, 1, 10), evaluate each candidate by cross-validation on the training data, refit the best on all the training data, and evaluate it ONCE on the test set. Tuning usually adds a few percentage points; better features and data usually add more.",
        codeExercise: {
          language: PY,
          code: DATA + py`from sklearn.model_selection import cross_val_score
from sklearn.svm import SVC
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler

for C in [0.001, 0.1, 10, 1000]:
    model = make_pipeline(StandardScaler(), SVC(C=C))
    print(C, round(cross_val_score(model, X, y, cv=5).mean(), 3))
`,
          question: "An SVM's C controls how tightly it fits the training data. What 5-fold CV accuracy does each C give, on a log scale?",
          expectedOutput: "0.001 0.507\n0.1 0.877\n10 0.895\n1000 0.842",
          hint: "A tiny C barely fits at all (close to guessing); a huge C fits the training data too tightly.",
          successMessage: "From 51% to 90% by changing one number, and pushing C further (1000) makes it worse again. Searching on a log scale found the region worth refining.",
        },
      },
      {
        id: "a-ml-grid-search",
        title: "Grid search",
        explain:
          "GRID SEARCH tries EVERY combination of the candidate values: GridSearchCV(estimator, param_grid, cv=5, scoring=...) with param_grid = {\"max_depth\": [3, 5, None], \"min_samples_leaf\": [1, 5, 20]} evaluates 3 × 3 = 9 candidates × 5 folds = 45 fits. Afterwards best_params_, best_score_ (the mean CV score of the winner) and best_estimator_ (refitted on all the training data) are available, and cv_results_ holds every candidate's scores. For a pipeline, prefix parameter names with the step name and two underscores: \"svc__C\". Grid search is thorough but its cost multiplies with every hyperparameter added.",
        codeChallenge: {
          task:
            "Write tune_forest(X_train, y_train) that runs GridSearchCV on RandomForestClassifier(n_estimators=50, random_state=0) with the grid {\"max_depth\": [2, 4, None], \"min_samples_leaf\": [1, 10]} and cv=3, and returns (best_params, best_score, n_candidates): best_params_ as a dictionary, best_score_ rounded to 3, and the number of candidates evaluated (len of cv_results_[\"params\"]).",
          starter: "from sklearn.model_selection import GridSearchCV\nfrom sklearn.ensemble import RandomForestClassifier\n\ndef tune_forest(X_train, y_train):\n    pass\n",
          sample: "6 candidates; the best uses deeper trees",
          tests: [
            {
              check: DATA + py`
from sklearn.model_selection import GridSearchCV
from sklearn.ensemble import RandomForestClassifier
params, score, n = tune_forest(X, y)
assert n == 6, "3 depths × 2 leaf sizes = 6 candidates. Got " + str(n)
ref = GridSearchCV(RandomForestClassifier(n_estimators=50, random_state=0), {"max_depth": [2, 4, None], "min_samples_leaf": [1, 10]}, cv=3).fit(X, y)
assert params == ref.best_params_, "best_params_ should be " + repr(ref.best_params_) + ". Got " + repr(params)
assert score == round(ref.best_score_, 3), "best_score_ rounded to 3."
assert params["max_depth"] != 2, "Depth-2 trees are too shallow for this data."`,
            },
          ],
          solution: py`from sklearn.model_selection import GridSearchCV
from sklearn.ensemble import RandomForestClassifier

def tune_forest(X_train, y_train):
    grid = {"max_depth": [2, 4, None], "min_samples_leaf": [1, 10]}
    search = GridSearchCV(RandomForestClassifier(n_estimators=50, random_state=0), grid, cv=3)
    search.fit(X_train, y_train)
    return search.best_params_, round(search.best_score_, 3), len(search.cv_results_["params"])
`,
          hint: "search = GridSearchCV(model, grid, cv=3).fit(X_train, y_train); then search.best_params_, search.best_score_ and len(search.cv_results_[\"params\"]).",
          successMessage: "Six candidates, three folds each, eighteen fits, and the winner refitted for you as best_estimator_.",
        },
      },
      {
        id: "a-ml-randomized-search",
        title: "Randomized search",
        explain:
          "RANDOMIZED SEARCH samples a fixed number of candidates (n_iter) from DISTRIBUTIONS instead of trying every combination: RandomizedSearchCV(estimator, param_distributions, n_iter=20, cv=5, random_state=0), with distributions such as scipy.stats.loguniform(1e-3, 1e2) for C or randint(2, 20) for depths, or plain lists. Its cost is fixed by n_iter whatever the number of hyperparameters, and research (Bergstra and Bengio, 2012) showed it usually finds as good a result as grid search with far fewer fits, because typically only a few hyperparameters really matter and random sampling tries many more distinct values of each. A common workflow: a randomized search to find the promising region, then a small grid inside it.",
        codeChallenge: {
          task:
            "Write random_tune_svm(X_train, y_train) that runs RandomizedSearchCV on make_pipeline(StandardScaler(), SVC()) with param_distributions {\"svc__C\": loguniform(1e-2, 1e3), \"svc__gamma\": loguniform(1e-4, 1e0)}, n_iter=12, cv=3 and random_state=0, and returns (best_params, best_score_rounded_to_3, number_of_candidates).",
          starter: "from scipy.stats import loguniform\nfrom sklearn.model_selection import RandomizedSearchCV\nfrom sklearn.pipeline import make_pipeline\nfrom sklearn.preprocessing import StandardScaler\nfrom sklearn.svm import SVC\n\ndef random_tune_svm(X_train, y_train):\n    pass\n",
          sample: "12 sampled (C, gamma) pairs; the best scores above 0.85",
          tests: [
            {
              check: DATA + py`
params, score, n = random_tune_svm(X, y)
assert n == 12, "n_iter=12 candidates. Got " + str(n)
assert set(params) == {"svc__C", "svc__gamma"}, "Pipeline parameters are prefixed with the step name. Got " + repr(params)
assert 1e-2 <= params["svc__C"] <= 1e3 and 1e-4 <= params["svc__gamma"] <= 1, "Values come from the given ranges."
assert score > 0.85, "The best candidate should score well. Got " + str(score)
assert random_tune_svm(X, y)[0] == params, "random_state=0 makes the search reproducible."`,
            },
          ],
          solution: py`from scipy.stats import loguniform
from sklearn.model_selection import RandomizedSearchCV
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.svm import SVC

def random_tune_svm(X_train, y_train):
    dists = {"svc__C": loguniform(1e-2, 1e3), "svc__gamma": loguniform(1e-4, 1e0)}
    search = RandomizedSearchCV(make_pipeline(StandardScaler(), SVC()), dists, n_iter=12, cv=3, random_state=0)
    search.fit(X_train, y_train)
    return search.best_params_, round(search.best_score_, 3), len(search.cv_results_["params"])
`,
          hint: "make_pipeline names the SVC step \"svc\", so its parameters are \"svc__C\" and \"svc__gamma\". Pass n_iter=12, cv=3, random_state=0.",
          successMessage: "Twelve candidates covered two hyperparameters across five orders of magnitude each. A grid of the same resolution would have needed hundreds of fits.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 61 · 13.7 – 13.8
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ml-l61-importance-pipelines",
    moduleId: "ml-m13-model-selection",
    sectionId: SECTION_ID,
    order: 3,
    covers: ["13.7", "13.8"],
    title: "Feature Importance and Model Pipelines",
    subtitle: "Which features the model relies on, and preprocessing that cannot leak",
    estimatedMinutes: 40,
    intro:
      "Stakeholders ask which factors drive predictions. Engineers need preprocessing and model packaged as one object that is fitted, cross-validated, tuned and deployed together. This lesson provides both.",

    atoms: [
      {
        id: "a-ml-feature-importance",
        title: "Feature importance",
        explain:
          "FEATURE IMPORTANCE estimates how much each feature contributes to a model's predictions. Model-specific: linear models' standardised COEFFICIENTS; trees' and forests' feature_importances_ (the total impurity decrease from splits on each feature), which are fast but biased towards features with many distinct values. Model-agnostic: PERMUTATION IMPORTANCE shuffles one feature's column in the validation data and measures how much the score DROPS; a large drop means the model relies on it, no drop means it is ignored. It works for any model and uses held-out data, but correlated features share credit (shuffling one leaves its twin intact). Importance shows what the model USES, not what CAUSES the outcome.",
        codeChallenge: {
          task:
            "Write permutation_drop(model, X_val, y_val, feature, seed=0) WITHOUT sklearn.inspection: compute the model's score on X_val, then copy X_val, shuffle the given feature column with np.random.default_rng(seed).permutation, score again, and return the drop (original minus shuffled) rounded to 4. Then write rank_by_permutation(model, X_val, y_val, names) that returns the names sorted by drop, largest first (ties in the original order).",
          starter: "import numpy as np\n\ndef permutation_drop(model, X_val, y_val, feature, seed=0):\n    pass\n\ndef rank_by_permutation(model, X_val, y_val, names):\n    pass\n",
          sample: "shuffling an informative feature drops accuracy a lot; shuffling a useless one changes nothing",
          tests: [
            {
              check: py`import numpy as np
from sklearn.ensemble import RandomForestClassifier
rng = np.random.default_rng(3)
n = 600
strong = rng.normal(size=n)
weak = rng.normal(size=n)
noise = rng.normal(size=n)
y = (2 * strong + 0.7 * weak + rng.normal(0, 0.5, n) > 0).astype(int)
X = np.column_stack([noise, weak, strong])
model = RandomForestClassifier(n_estimators=100, random_state=0).fit(X[:400], y[:400])
Xv, yv = X[400:], y[400:]
d = [permutation_drop(model, Xv, yv, j) for j in range(3)]
assert d[2] > d[1] > d[0], "strong should matter most and noise least. Drops: " + repr(d)
assert abs(d[0]) < 0.03, "Shuffling pure noise barely changes the score. Got " + str(d[0])
base = Xv.copy()
permutation_drop(model, Xv, yv, 2)
assert np.array_equal(Xv, base), "Shuffle a COPY: do not change X_val."
assert rank_by_permutation(model, Xv, yv, ["noise", "weak", "strong"]) == ["strong", "weak", "noise"], "Ranked by drop."
assert "sklearn.inspection" not in source, "Write the shuffle yourself."`,
            },
          ],
          solution: py`import numpy as np

def permutation_drop(model, X_val, y_val, feature, seed=0):
    base = model.score(X_val, y_val)
    shuffled = X_val.copy()
    shuffled[:, feature] = np.random.default_rng(seed).permutation(shuffled[:, feature])
    return round(base - model.score(shuffled, y_val), 4)

def rank_by_permutation(model, X_val, y_val, names):
    drops = [permutation_drop(model, X_val, y_val, j) for j in range(len(names))]
    order = sorted(range(len(names)), key=lambda j: -drops[j])
    return [names[j] for j in order]
`,
          hint: "shuffled = X_val.copy(); shuffled[:, feature] = rng.permutation(shuffled[:, feature]); drop = base score − shuffled score. Sort indices by −drop (sorted is stable, so ties keep their order).",
          successMessage: "Shuffling breaks a feature's link with the target; the score drop measures how much the model relied on it. sklearn.inspection.permutation_importance repeats this several times and averages.",
        },
      },
      {
        id: "a-ml-pipelines",
        title: "Model pipelines",
        explain:
          "A PIPELINE chains preprocessing steps and a final model into ONE estimator: Pipeline([(\"prep\", preprocessor), (\"model\", LogisticRegression())]). Calling fit runs fit_transform on each step in turn, using ONLY the data passed to fit; predict runs transform then predict. A COLUMNTRANSFORMER applies different steps to different columns: impute and scale the numeric columns, impute and one-hot encode the categorical ones, all side by side. Benefits: no leakage in cross-validation (every fold refits the preprocessing on its own training rows), the whole pipeline can be tuned with GridSearchCV (\"prep__num__imputer__strategy\"), and one object is saved and deployed, so production applies exactly the training transformations.",
        codeChallenge: {
          task:
            "Write build_pipeline(numeric, categorical) that returns a Pipeline with two steps: \"prep\", a ColumnTransformer applying make_pipeline(SimpleImputer(strategy=\"median\"), StandardScaler()) to the numeric columns (named \"num\") and OneHotEncoder(handle_unknown=\"ignore\") to the categorical columns (named \"cat\"); and \"model\", LogisticRegression(max_iter=1000). The test fits it on a loans DataFrame with gaps and cross-validates it.",
          starter: "from sklearn.compose import ColumnTransformer\nfrom sklearn.pipeline import Pipeline, make_pipeline\nfrom sklearn.impute import SimpleImputer\nfrom sklearn.preprocessing import StandardScaler, OneHotEncoder\nfrom sklearn.linear_model import LogisticRegression\n\ndef build_pipeline(numeric, categorical):\n    pass\n",
          sample: "build_pipeline([\"income\", \"age\"], [\"state\", \"employment\"]).fit(loans, default)",
          tests: [
            {
              check: LOANS + py`
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.model_selection import cross_val_score
pipe = build_pipeline(["income", "age"], ["state", "employment"])
assert isinstance(pipe, Pipeline) and [n for n, _ in pipe.steps] == ["prep", "model"], "Two steps named prep and model."
assert isinstance(pipe.named_steps["prep"], ColumnTransformer), "prep must be a ColumnTransformer."
assert [t[0] for t in pipe.named_steps["prep"].transformers] == ["num", "cat"], "Transformers named num and cat."
pipe.fit(loans, default)
assert pipe.named_steps["prep"].transform(loans).shape[1] == 2 + 4 + 3, "2 scaled numeric columns + 4 states + 3 employment types."
scores = cross_val_score(build_pipeline(["income", "age"], ["state", "employment"]), loans, default, cv=5)
assert scores.mean() > 0.8, "The pipeline cross-validates cleanly, gaps and text included. Got " + str(scores.mean())
new = loans.head(2).copy()
new.loc[new.index[0], "state"] = "Enugu"
assert len(pipe.predict(new)) == 2, "An unseen state must not break prediction."`,
            },
          ],
          solution: py`from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline, make_pipeline
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.linear_model import LogisticRegression

def build_pipeline(numeric, categorical):
    prep = ColumnTransformer([
        ("num", make_pipeline(SimpleImputer(strategy="median"), StandardScaler()), numeric),
        ("cat", OneHotEncoder(handle_unknown="ignore"), categorical),
    ])
    return Pipeline([("prep", prep), ("model", LogisticRegression(max_iter=1000))])
`,
          hint: "ColumnTransformer([(\"num\", make_pipeline(...), numeric), (\"cat\", OneHotEncoder(handle_unknown=\"ignore\"), categorical)]), then Pipeline([(\"prep\", prep), (\"model\", LogisticRegression(max_iter=1000))]).",
          successMessage: "Raw DataFrame in, predictions out: imputation, scaling and encoding are learned inside every CV fold, and an unseen state does not break anything. This object is what you will deploy in Module 19.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 62 · 13.9 – 13.10
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ml-l62-leakage-choosing",
    moduleId: "ml-m13-model-selection",
    sectionId: SECTION_ID,
    order: 4,
    covers: ["13.9", "13.10"],
    title: "Leakage-Free Validation and Choosing an Algorithm",
    subtitle: "Validation you can trust, and a principled way to pick a model",
    estimatedMinutes: 38,
    intro:
      "Cross-validation can lie too, if anything is fitted outside the folds. This lesson shows a model that \"learns\" pure noise when feature selection leaks, then closes Month 3 with how to choose an algorithm for a problem.",

    atoms: [
      {
        id: "a-ml-leakage-validation",
        title: "Preventing data leakage during validation",
        explain:
          "Any step that LEARNS from data (imputation, scaling, encoding, feature selection, resampling, PCA, target encoding) must be fitted inside each cross-validation fold on that fold's training rows only. Doing it once on the whole dataset before CV leaks the validation rows' information into training, and CV scores become optimistic, sometimes absurdly so. Put every such step in a Pipeline (with imbalanced-learn's Pipeline for resampling) and cross-validate the pipeline. And when hyperparameters are tuned with CV, the tuned score is itself optimistic: estimate the final performance on a held-out test set, or with NESTED cross-validation (an outer CV around the whole search).",
        codeExercise: {
          language: PY,
          code: py`import numpy as np
from sklearn.feature_selection import SelectKBest, f_classif
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import cross_val_score
from sklearn.pipeline import make_pipeline

rng = np.random.default_rng(0)
X = rng.normal(size=(100, 5000))         # 5,000 features of pure noise
y = rng.integers(0, 2, 100)              # random labels: nothing to learn

leaky_X = SelectKBest(f_classif, k=20).fit_transform(X, y)      # selected on ALL rows
leaky = cross_val_score(LogisticRegression(), leaky_X, y, cv=5).mean()

honest = cross_val_score(make_pipeline(SelectKBest(f_classif, k=20), LogisticRegression()), X, y, cv=5).mean()
print("leaky", round(leaky, 2))
print("honest", round(honest, 2))
`,
          question: "The labels are random, so the true accuracy is 50%. Selecting 20 features before CV versus inside a pipeline: what CV accuracies are printed?",
          expectedOutput: "leaky 0.85\nhonest 0.48",
          hint: "With 5,000 noise features, some correlate with the random labels by chance on ALL 100 rows, including the validation rows.",
          successMessage: "85% accuracy on random labels: the selector peeked at the validation rows. Inside the pipeline the honest answer appears, about chance. Leakage can manufacture any score you like.",
        },
      },
      {
        id: "a-ml-choosing-algorithm",
        title: "Choosing the right algorithm for a problem",
        explain:
          "Start from the PROBLEM: the target type (regression, classification, clustering), the data size and type (tabular, text, images, sequences), the need for INTERPRETABILITY (credit decisions often require explanations), latency and memory limits, and how much tuning time exists. Practical defaults for TABULAR data: begin with a baseline and a regularised linear or logistic model; then a random forest; then gradient boosting (HistGradientBoosting, XGBoost, LightGBM), which usually wins on tabular data. Use KNN or SVM for small, well-scaled data; Naive Bayes for quick text baselines; neural networks for images, audio, text and very large datasets (Month 4). Then let cross-validation decide among the candidates, and prefer the simpler model when scores are within the noise.",
        codeChallenge: {
          task:
            "Write choose_model(candidates, X, y, tolerance=0.01) where candidates is a list of (name, model, complexity) tuples (complexity: a number, lower is simpler). Score each with cross_val_score(model, X, y, cv=5) mean. Return (chosen_name, scores) where scores is {name: mean rounded to 3}, and chosen_name is the SIMPLEST candidate whose mean is within tolerance of the best mean.",
          starter: "from sklearn.model_selection import cross_val_score\n\ndef choose_model(candidates, X, y, tolerance=0.01):\n    pass\n",
          sample: "if logistic regression scores 0.842 and a random forest 0.849, pick logistic regression with tolerance 0.01",
          tests: [
            {
              check: DATA + py`
from sklearn.linear_model import LogisticRegression
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import cross_val_score
cands = [
    ("logistic", LogisticRegression(max_iter=1000), 1),
    ("tree", DecisionTreeClassifier(max_depth=4, random_state=0), 2),
    ("forest", RandomForestClassifier(n_estimators=100, random_state=0), 3),
]
name, scores = choose_model(cands, X, y)
assert set(scores) == {"logistic", "tree", "forest"}, "One score per candidate."
want = {n: round(cross_val_score(m, X, y, cv=5).mean(), 3) for n, m, _ in cands}
assert scores == want, "Mean 5-fold CV scores. Expected " + repr(want) + ", got " + repr(scores)
best = max(want.values())
ok = [n for n, m, c in sorted(cands, key=lambda t: t[2]) if want[n] >= best - 0.01]
assert name == ok[0], "Choose the simplest model within 0.01 of the best. Expected " + ok[0] + ", got " + name
assert choose_model(cands, X, y, tolerance=1.0)[0] == "logistic", "With a huge tolerance the simplest model always wins."`,
            },
          ],
          solution: py`from sklearn.model_selection import cross_val_score

def choose_model(candidates, X, y, tolerance=0.01):
    scores = {name: round(cross_val_score(model, X, y, cv=5).mean(), 3) for name, model, _ in candidates}
    best = max(scores.values())
    for name, _, _ in sorted(candidates, key=lambda c: c[2]):
        if scores[name] >= best - tolerance:
            return name, scores
`,
          hint: "Score every candidate, find the best mean, then walk the candidates sorted by complexity and return the first within tolerance of the best.",
          successMessage: "\"Simplest model within the noise of the best\" is a principle, not a shortcut: simpler models are cheaper, faster, easier to explain and break less in production.",
        },
      },
    ],

    task: {
      title: "Month 3 major project: build, compare and document three models",
      intro:
        "For one problem (house prices, churn, loan default or another with a clear business goal), build at least three different models, compare them rigorously, and document the work as a technical report.",
      prompts: [
        "State the problem, the metric chosen and why, the baseline, and hold out a test set before anything else.",
        "Build every model as a Pipeline with a ColumnTransformer, so preprocessing is refitted inside every fold.",
        "Train at least three model families (for example regularised linear, random forest and gradient boosting) and compare them with 5-fold CV: mean and standard deviation.",
        "Tune the two most promising with GridSearchCV or RandomizedSearchCV, recording the search space and the cost in fits.",
        "Report permutation importances for the chosen model, and check one surprising feature for possible leakage.",
        "Choose the final model by the simplest-within-the-noise rule and other practical criteria, and evaluate it ONCE on the test set.",
        "Write a report: problem, data, preprocessing, models, results table, chosen model, limitations and next steps.",
      ],
      closing: "Month 3 is complete: you can build, evaluate and choose classical models. Month 4 opens the black box everyone talks about: neural networks, built neuron by neuron.",
    },

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
