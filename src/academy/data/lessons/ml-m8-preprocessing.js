/**
 * MACHINE LEARNING AND AI · MODULE 8 · DATA PREPROCESSING AND FEATURE ENGINEERING
 *
 * Curriculum 8.1 – 8.12. From raw to model-ready data: imputation, noise
 * and inconsistencies, categorical encoding, scaling, feature selection and
 * extraction, imbalanced classes, train-test splitting and data leakage.
 * scikit-learn is introduced here, through its transformers' fit / transform
 * contract, and the module's thread is the rule that keeps evaluation
 * honest: LEARN every preprocessing parameter from the training data only.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

export const SECTION_ID = "ml-s8-preprocessing";

const PY = "python";
const py = String.raw;

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 36 · 8.1 – 8.3
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ml-l36-raw-missing-noise",
    moduleId: "ml-m8-preprocessing",
    sectionId: SECTION_ID,
    order: 1,
    covers: ["8.1", "8.2", "8.3"],
    title: "Raw Data, Missing Data and Noise",
    subtitle: "What a model needs, and scikit-learn's fit / transform contract",
    estimatedMinutes: 36,
    intro:
      "Models are fussy: they need numbers, no gaps and consistent categories. This lesson turns raw records into processed ones, and introduces the scikit-learn pattern every preprocessing step follows.",

    atoms: [
      {
        id: "a-ml-raw-vs-processed",
        title: "Understanding raw and processed data",
        explain:
          "RAW data is what systems record: text dates, \"N/A\", typos, mixed units, free-text categories, IDs. PROCESSED (model-ready) data is a numeric matrix X with no missing values, consistent categories turned into numbers, features on comparable scales, and a target vector y. scikit-learn performs each step with a TRANSFORMER that follows one contract: fit(X_train) LEARNS the parameters (a median, a list of categories, a mean and std), transform(X) APPLIES them, and fit_transform does both on the training data. Learn on the training set only, then transform the test set with what was learned, exactly as future data will be transformed in production.",
        codeExercise: {
          language: PY,
          code: py`import numpy as np
from sklearn.impute import SimpleImputer

X_train = np.array([[25.0], [np.nan], [40.0], [31.0]])
X_test = np.array([[np.nan], [50.0]])

imp = SimpleImputer(strategy="median")
imp.fit(X_train)
print(imp.statistics_)
print(imp.transform(X_test).ravel())
print(imp.fit_transform(X_test).ravel())
`,
          question: "An imputer is fitted on training data, then used on test data. Compare with refitting it on the test set (a mistake). What does it print?",
          expectedOutput: "[31.]\n[31. 50.]\n[50. 50.]",
          hint: "The training median of 25, 40 and 31 is 31. Refitting on the test set learns the median of its only known value, 50.",
          successMessage: "fit learns, transform applies. Refitting on test data uses information the model should never see, and quietly changes the answer.",
        },
      },
      {
        id: "a-ml-handling-missing-data",
        title: "Handling missing data",
        explain:
          "Options for gaps: DELETE rows (only if few, and missing at random) or columns (if mostly empty); IMPUTE with a statistic: SimpleImputer(strategy=\"median\") for numbers, strategy=\"most_frequent\" or a constant such as \"Unknown\" for categories; or model-based imputation (KNNImputer, IterativeImputer) that predicts a value from other columns. add_indicator=True appends a 0/1 \"was missing\" column, since missingness often carries signal (customers who skip the income field differ from those who fill it). Whatever you choose, the statistic comes from the TRAINING data.",
        codeChallenge: {
          task:
            "Write impute(train, test, numeric, categorical) where train and test are DataFrames. Fit a SimpleImputer(strategy=\"median\") on train's numeric columns and a SimpleImputer(strategy=\"most_frequent\") on train's categorical columns; return a tuple (train_out, test_out) of DataFrames with the same columns as the inputs (numeric first, then categorical) and every gap filled using the TRAINING statistics.",
          starter: "import pandas as pd\nfrom sklearn.impute import SimpleImputer\n\ndef impute(train, test, numeric, categorical):\n    pass\n",
          sample: "a missing test income gets the TRAINING median, not the test median",
          tests: [
            {
              check: py`import numpy as np
import pandas as pd
train = pd.DataFrame({"income": [100.0, np.nan, 300.0, 200.0], "city": ["Lagos", "Kano", None, "Lagos"]})
test = pd.DataFrame({"income": [np.nan, 900.0], "city": [None, "Abuja"]})
tr, te = impute(train, test, ["income"], ["city"])
assert list(tr.columns) == ["income", "city"] and list(te.columns) == ["income", "city"], "Keep the columns, numeric first."
assert tr["income"].tolist() == [100.0, 200.0, 300.0, 200.0], "Training gaps get the training median 200. Got " + repr(tr["income"].tolist())
assert te["income"].tolist() == [200.0, 900.0], "Test gaps ALSO get the training median 200, not the test's own. Got " + repr(te["income"].tolist())
assert te["city"].tolist() == ["Lagos", "Abuja"], "The missing test city becomes the training mode, Lagos. Got " + repr(te["city"].tolist())
assert tr.isna().sum().sum() == 0 and te.isna().sum().sum() == 0, "No gaps may remain."
assert calls("SimpleImputer") and calls("fit") or calls("fit_transform"), "Use SimpleImputer fitted on train."`,
            },
          ],
          solution: py`import pandas as pd
from sklearn.impute import SimpleImputer

def impute(train, test, numeric, categorical):
    num = SimpleImputer(strategy="median").fit(train[numeric])
    cat = SimpleImputer(strategy="most_frequent").fit(train[categorical])

    def apply(df):
        out = pd.DataFrame(num.transform(df[numeric]), columns=numeric, index=df.index)
        out[categorical] = cat.transform(df[categorical])
        return out

    return apply(train), apply(test)
`,
          hint: "num = SimpleImputer(strategy=\"median\").fit(train[numeric]); cat likewise. Then build each output with pd.DataFrame(num.transform(df[numeric]), columns=numeric) and add cat.transform(df[categorical]).",
          successMessage: "Both sets were filled with statistics learned from training data only. In Module 13 a Pipeline will do this bookkeeping for you.",
        },
      },
      {
        id: "a-ml-noise-inconsistencies",
        title: "Removing noise and inconsistencies",
        explain:
          "INCONSISTENCIES are the same thing recorded differently: \"Lagos\", \"lagos \", \"LAGOS\", \"Lag.\"; \"M\" and \"Male\"; amounts in naira and in thousands of naira. Fix them by normalising text (strip, lower or title case), mapping known variants to one value, and converting units. NOISE is random error in values: impossible entries (an age of 240, a negative quantity) should be set to missing and imputed, or the row dropped; extreme but possible values can be CAPPED (winsorised) at a percentile to limit their influence. Document every rule: cleaning decisions change what the model learns.",
        codeChallenge: {
          task:
            "Write tidy(df) that returns a NEW DataFrame where: city is stripped, title-cased, and the variants \"Fct\", \"Abuja Fct\" and \"F.C.T.\" all become \"Abuja\"; age values outside 18–100 become NaN; and monthly_spend is capped at its 99th percentile (use clip(upper=s.quantile(0.99))).",
          starter: "import numpy as np\nimport pandas as pd\n\ndef tidy(df):\n    pass\n",
          sample: "\"  lagos\" → \"Lagos\"; \"F.C.T.\" → \"Abuja\"; age 240 → NaN",
          tests: [
            {
              check: py`import numpy as np
import pandas as pd
spend = list(range(1, 101))
spend[-1] = 100000
df = pd.DataFrame({
    "city": ["  lagos", "LAGOS ", "fct", "Abuja FCT", "F.C.T.", "kano"] + ["Kano"] * 94,
    "age": [25, 240, 17, 45, 101, 33] + [30] * 94,
    "monthly_spend": spend,
})
out = tidy(df)
assert out["city"].tolist()[:6] == ["Lagos", "Lagos", "Abuja", "Abuja", "Abuja", "Kano"], "Got " + repr(out["city"].tolist()[:6])
assert out["age"].isna().tolist()[:6] == [False, True, True, False, True, False], "Ages outside 18 to 100 become NaN."
cap = pd.Series(spend).quantile(0.99)
assert out["monthly_spend"].max() == cap, "Cap monthly_spend at its 99th percentile. Got max " + repr(out["monthly_spend"].max())
assert df["city"].iloc[0] == "  lagos", "Do not change the original."`,
            },
          ],
          solution: py`import numpy as np
import pandas as pd

ABUJA = {"Fct", "Abuja Fct", "F.C.T."}

def tidy(df):
    out = df.copy()
    city = out["city"].str.strip().str.title()
    out["city"] = city.where(~city.isin(ABUJA), "Abuja")
    out["age"] = out["age"].where(out["age"].between(18, 100))
    out["monthly_spend"] = out["monthly_spend"].clip(upper=out["monthly_spend"].quantile(0.99))
    return out
`,
          hint: "city = s.str.strip().str.title(); then replace the Abuja variants (a dictionary with .replace, or .where with isin). age.where(age.between(18, 100)) turns the rest into NaN.",
          successMessage: "Three kinds of mess, three documented rules. \"F.C.T.\" title-cases to \"F.C.T.\", which is why the variant list is checked AFTER normalising.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 37 · 8.4 – 8.5
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ml-l37-encoding",
    moduleId: "ml-m8-preprocessing",
    sectionId: SECTION_ID,
    order: 2,
    covers: ["8.4", "8.5"],
    title: "Encoding Categorical Variables",
    subtitle: "Turning categories into numbers without inventing a false order",
    estimatedMinutes: 34,
    intro:
      "Models do arithmetic, so \"Lagos\" and \"prepaid\" must become numbers. How you encode them decides whether the model sees the truth or a fiction, such as Kano being \"twice\" Abuja.",

    atoms: [
      {
        id: "a-ml-encoding-categoricals",
        title: "Encoding categorical variables",
        explain:
          "Categorical variables come in two kinds. ORDINAL categories have a natural ORDER: education (primary < secondary < degree < masters), sizes, ratings; encode them as ordered integers 0, 1, 2, 3 with an explicit order (sklearn's OrdinalEncoder(categories=[[...]])). NOMINAL categories have NO order: city, payment method, product; giving them integers (Abuja = 0, Kano = 1, Lagos = 2) invents an order and distances that do not exist, and a linear model will treat Lagos as \"more\" than Abuja. Nominal categories need one-hot encoding. HIGH-CARDINALITY columns (thousands of values, like customer IDs or street names) need special handling: group rare values, use target encoding carefully, or drop them.",
        codeExercise: {
          language: PY,
          code: py`import pandas as pd
from sklearn.preprocessing import OrdinalEncoder

df = pd.DataFrame({"education": ["degree", "primary", "masters", "secondary", "degree"]})
order = [["primary", "secondary", "degree", "masters"]]

auto = OrdinalEncoder().fit_transform(df).ravel()
ordered = OrdinalEncoder(categories=order).fit_transform(df).ravel()
print(auto.tolist())
print(ordered.tolist())
`,
          question: "Encode education automatically (alphabetical) and with the true order. What does it print?",
          expectedOutput: "[0.0, 2.0, 1.0, 3.0, 0.0]\n[2.0, 0.0, 3.0, 1.0, 2.0]",
          hint: "Alphabetically: degree < masters < primary < secondary. With the given order: primary 0, secondary 1, degree 2, masters 3.",
          successMessage: "The automatic encoding ranks \"primary\" above \"masters\" because p comes after m. For ordinal data, always pass the order explicitly.",
        },
      },
      {
        id: "a-ml-label-onehot",
        title: "Label encoding and one-hot encoding",
        explain:
          "LABEL ENCODING maps each category to an integer; in scikit-learn LabelEncoder is meant for the TARGET y (class names to 0, 1, 2), where order does not matter to a classifier. ONE-HOT ENCODING turns a nominal feature with k categories into k binary columns, one per category, with a single 1 per row: city = Kano becomes [Abuja 0, Kano 1, Lagos 0]. pd.get_dummies does it quickly for exploration; sklearn's OneHotEncoder is used in models because it REMEMBERS the training categories, so the test set gets the same columns in the same order, and handle_unknown=\"ignore\" turns a category never seen in training (a new branch) into all zeros instead of an error. drop=\"first\" removes one redundant column for linear models.",
        codeChallenge: {
          task:
            "Write encode(train, test, column) that fits a OneHotEncoder(handle_unknown=\"ignore\", sparse_output=False) on train[[column]] and returns a tuple (train_matrix, test_matrix, names): the two encoded NumPy arrays and the list of output column names from get_feature_names_out([column]). Then write encode_target(y_train) that returns the LabelEncoder-encoded array and the list of class names.",
          starter: "from sklearn.preprocessing import OneHotEncoder, LabelEncoder\n\ndef encode(train, test, column):\n    pass\n\ndef encode_target(y_train):\n    pass\n",
          sample: "a test city never seen in training (Enugu) becomes a row of zeros",
          tests: [
            {
              check: py`import numpy as np
import pandas as pd
train = pd.DataFrame({"city": ["Lagos", "Kano", "Abuja", "Lagos"]})
test = pd.DataFrame({"city": ["Kano", "Enugu"]})
tr, te, names = encode(train, test, "city")
assert list(names) == ["city_Abuja", "city_Kano", "city_Lagos"], "One column per training category. Got " + repr(list(names))
assert tr.tolist() == [[0, 0, 1], [0, 1, 0], [1, 0, 0], [0, 0, 1]], "Got " + repr(tr.tolist())
assert te.tolist() == [[0, 1, 0], [0, 0, 0]], "Kano is [0, 1, 0]; the unseen Enugu is all zeros. Got " + repr(te.tolist())
codes, classes = encode_target(["churn", "stay", "stay", "churn", "stay"])
assert list(codes) == [0, 1, 1, 0, 1] and list(classes) == ["churn", "stay"], "Got " + repr((list(codes), list(classes)))`,
            },
          ],
          solution: py`from sklearn.preprocessing import OneHotEncoder, LabelEncoder

def encode(train, test, column):
    enc = OneHotEncoder(handle_unknown="ignore", sparse_output=False)
    enc.fit(train[[column]])
    names = enc.get_feature_names_out([column])
    return enc.transform(train[[column]]), enc.transform(test[[column]]), list(names)

def encode_target(y_train):
    le = LabelEncoder()
    codes = le.fit_transform(y_train)
    return codes, list(le.classes_)
`,
          hint: "enc = OneHotEncoder(handle_unknown=\"ignore\", sparse_output=False).fit(train[[column]]); transform both frames; names from enc.get_feature_names_out([column]). LabelEncoder().fit_transform(y) and .classes_.",
          successMessage: "The encoder remembered the three training cities, so train and test have identical columns, and a brand-new branch did not crash the pipeline.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 38 · 8.6 – 8.8
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ml-l38-scaling-selection",
    moduleId: "ml-m8-preprocessing",
    sectionId: SECTION_ID,
    order: 3,
    covers: ["8.6", "8.7", "8.8"],
    title: "Feature Scaling and Feature Selection",
    subtitle: "Putting features on comparable scales, and keeping the ones that matter",
    estimatedMinutes: 38,
    intro:
      "A salary in naira is a million times larger than a number of children. Algorithms that measure distances or follow gradients are misled by that, unless features are scaled. And not every column deserves to be a feature.",

    atoms: [
      {
        id: "a-ml-feature-scaling",
        title: "Feature scaling",
        explain:
          "FEATURE SCALING puts numeric features on comparable ranges. It matters for algorithms based on DISTANCES (k-nearest neighbours, k-means, SVMs), where the feature with the biggest numbers dominates every distance, and for models trained by GRADIENT DESCENT (linear and logistic regression, neural networks), which converge much faster when features have similar scales. Tree-based models (decision trees, random forests, gradient boosting) split on one feature at a time and do NOT need scaling. In the example, two customers who differ by 30 years in age look almost identical, because ₦10,000 of salary outweighs everything.",
        codeExercise: {
          language: PY,
          code: py`import numpy as np

# [age, monthly salary in ₦]
a = np.array([25, 350000])
b = np.array([55, 360000])
c = np.array([26, 450000])
d = lambda u, v: round(float(np.linalg.norm(u - v)), 1)
print(d(a, b), d(a, c))

X = np.array([a, b, c], dtype=float)
Z = (X - X.mean(axis=0)) / X.std(axis=0)
print(d(Z[0], Z[1]), d(Z[0], Z[2]))
`,
          question: "Which customer is nearest to a, before and after standardising? What does it print?",
          expectedOutput: "10000.0 100000.0\n2.2 2.2",
          hint: "Before scaling, the salary difference swamps the age difference. After, each feature counts in standard deviations.",
          successMessage: "Unscaled, b (30 years older) is 10 times \"closer\" than c. Scaled, the two differences count equally. A distance-based model would have learned salary only.",
        },
      },
      {
        id: "a-ml-normalization-standardization",
        title: "Normalization and standardization",
        explain:
          "STANDARDIZATION (StandardScaler) rescales each feature to mean 0 and standard deviation 1: z = (x − μ) / σ. It keeps outliers' relative positions and is the default for most models. NORMALIZATION in the min-max sense (MinMaxScaler) maps each feature to [0, 1]: (x − min) / (max − min), useful for bounded inputs such as pixel intensities, but one outlier squashes everything else together. RobustScaler uses the median and IQR, resisting outliers. In every case μ, σ, min and max are LEARNED from the training data (fit) and reused on the test data (transform), so a test value can fall outside [0, 1] or have |z| > 3, and that is correct.",
        codeChallenge: {
          task:
            "Write your own class Standardiser with the scikit-learn contract and no sklearn: fit(X) stores per-column mean_ and scale_ (population std, ddof=0) of a 2-D NumPy array and returns self; transform(X) returns (X − mean_) / scale_; fit_transform(X) does both. A column with std 0 must get scale_ 1 (to avoid dividing by zero).",
          starter: "import numpy as np\n\nclass Standardiser:\n    pass\n",
          sample: "Standardiser().fit_transform(np.array([[1., 10.], [3., 30.]])) → [[-1., -1.], [1., 1.]]",
          tests: [
            {
              check: py`import numpy as np
from sklearn.preprocessing import StandardScaler
rng = np.random.default_rng(0)
X_train = rng.normal([50, 300000], [10, 80000], (100, 2))
X_test = rng.normal([50, 300000], [10, 80000], (20, 2))
mine = Standardiser().fit(X_train)
ref = StandardScaler().fit(X_train)
assert np.allclose(mine.mean_, ref.mean_) and np.allclose(mine.scale_, ref.scale_), "mean_ and scale_ must match StandardScaler's."
assert np.allclose(mine.transform(X_test), ref.transform(X_test)), "transform must use the TRAINING mean and scale."
assert np.allclose(Standardiser().fit_transform(np.array([[1.0, 10.0], [3.0, 30.0]])), [[-1, -1], [1, 1]]), "fit_transform."
const = Standardiser().fit(np.array([[5.0, 1.0], [5.0, 3.0]]))
assert const.scale_[0] == 1, "A constant column gets scale_ 1."
assert "sklearn" not in source, "Write it yourself, without scikit-learn."`,
            },
          ],
          solution: py`import numpy as np

class Standardiser:
    def fit(self, X):
        self.mean_ = X.mean(axis=0)
        scale = X.std(axis=0)
        self.scale_ = np.where(scale == 0, 1.0, scale)
        return self

    def transform(self, X):
        return (X - self.mean_) / self.scale_

    def fit_transform(self, X):
        return self.fit(X).transform(X)
`,
          hint: "fit: self.mean_ = X.mean(axis=0); scale = X.std(axis=0); self.scale_ = np.where(scale == 0, 1.0, scale); return self. transform uses broadcasting.",
          successMessage: "Your class matches StandardScaler exactly, because that is all StandardScaler is: fit remembers, transform applies.",
        },
      },
      {
        id: "a-ml-feature-selection",
        title: "Feature selection",
        explain:
          "FEATURE SELECTION keeps a useful subset of features. Fewer features mean faster training, simpler explanations, less overfitting and fewer things to collect in production. FILTER methods score features independently of any model: drop near-constant features (VarianceThreshold), drop one of each highly correlated pair, or keep the k best by a statistical test against the target (SelectKBest with f_classif or mutual_info_classif). WRAPPER methods (recursive feature elimination) repeatedly fit a model and drop the weakest feature. EMBEDDED methods select during training (Lasso's zero coefficients in Module 10, tree importances in Module 13). Select using the training data only.",
        codeChallenge: {
          task:
            "Write select_features(X_train, y_train, names, k) that first removes constant features with VarianceThreshold(0.0), then keeps the k best of the remaining by SelectKBest(f_classif, k=k), and returns the list of the selected feature names in their original order.",
          starter: "from sklearn.feature_selection import VarianceThreshold, SelectKBest, f_classif\n\ndef select_features(X_train, y_train, names, k):\n    pass\n",
          sample: "of [tenure, spend, country_code (constant), noise, complaints], k=2 → [\"tenure\", \"complaints\"]",
          tests: [
            {
              check: py`import numpy as np
rng = np.random.default_rng(4)
n = 300
y = rng.integers(0, 2, n)
tenure = 30 - 20 * y + rng.normal(0, 5, n)
spend = rng.normal(100, 20, n) + 12 * y
country = np.full(n, 234.0)
noise = rng.normal(0, 1, n)
complaints = 1 + 3 * y + rng.normal(0, 1, n)
X = np.column_stack([tenure, spend, country, noise, complaints])
names = ["tenure", "spend", "country_code", "noise", "complaints"]
assert select_features(X, y, names, 2) == ["tenure", "complaints"], "The two features most related to churn. Got " + repr(select_features(X, y, names, 2))
three = select_features(X, y, names, 3)
assert "country_code" not in three and three == ["tenure", "spend", "complaints"], "The constant column is removed first. Got " + repr(three)`,
            },
          ],
          solution: py`from sklearn.feature_selection import VarianceThreshold, SelectKBest, f_classif

def select_features(X_train, y_train, names, k):
    vt = VarianceThreshold(0.0).fit(X_train)
    kept = [n for n, keep in zip(names, vt.get_support()) if keep]
    X_kept = vt.transform(X_train)
    best = SelectKBest(f_classif, k=k).fit(X_kept, y_train)
    return [n for n, keep in zip(kept, best.get_support()) if keep]
`,
          hint: "Both selectors have get_support(), a boolean mask over their input columns. Apply VarianceThreshold, track the kept names, then SelectKBest on the reduced matrix.",
          successMessage: "A constant column (every customer in country 234) carries no information, and pure noise scores lowest. Selection kept what actually separates churners.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 39 · 8.9 – 8.10
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ml-l39-extraction-imbalance",
    moduleId: "ml-m8-preprocessing",
    sectionId: SECTION_ID,
    order: 4,
    covers: ["8.9", "8.10"],
    title: "Feature Extraction and Imbalanced Datasets",
    subtitle: "Creating informative features, and learning when one class is rare",
    estimatedMinutes: 36,
    intro:
      "Good features beat clever algorithms. This lesson creates features from dates, text and ratios, then tackles the most common trap in real classification problems: a rare positive class.",

    atoms: [
      {
        id: "a-ml-feature-extraction",
        title: "Feature extraction",
        explain:
          "FEATURE EXTRACTION (or engineering) creates new, more informative features from raw ones. From DATES: day of week, month, is_weekend, is_payday (salaries in Nigeria often land near the 25th), days since last purchase. From TEXT: length, word counts, presence of keywords (and in Module 18, TF-IDF). RATIOS and DIFFERENCES: price per square metre, spend per visit, balance change. AGGREGATES over a customer's history: number of orders, average order value. Domain knowledge drives this: a fraud analyst knows that a transaction at 3 a.m. from a new device is suspicious, so is_night and new_device become features. PCA (Module 12) extracts features automatically.",
        codeChallenge: {
          task:
            "Write add_features(df) where df has columns timestamp (datetime), amount, and description (text). Return a NEW DataFrame with added columns: hour (0–23), is_weekend (True on Saturday and Sunday), is_night (True for hours 0–5), desc_words (number of words in description), and mentions_refund (True if description contains \"refund\", case-insensitive).",
          starter: "import pandas as pd\n\ndef add_features(df):\n    pass\n",
          sample: "2026-11-07 03:12 (a Saturday) → hour 3, is_weekend True, is_night True",
          tests: [
            {
              check: py`import pandas as pd
df = pd.DataFrame({
    "timestamp": pd.to_datetime(["2026-11-07 03:12", "2026-11-09 14:30", "2026-11-08 23:59"]),
    "amount": [150000, 2500, 40000],
    "description": ["Transfer to new account", "POS purchase Shoprite", "REFUND request reversal"],
})
out = add_features(df)
assert out["hour"].tolist() == [3, 14, 23], "Got " + repr(out["hour"].tolist())
assert out["is_weekend"].tolist() == [True, False, True], "7 November 2026 is a Saturday, the 8th a Sunday, the 9th a Monday."
assert out["is_night"].tolist() == [True, False, False], "Night is hours 0 to 5."
assert out["desc_words"].tolist() == [4, 3, 3], "Count the words. Got " + repr(out["desc_words"].tolist())
assert out["mentions_refund"].tolist() == [False, False, True], "Match \"refund\" in any case."
assert "hour" not in df.columns, "Return a new DataFrame."`,
            },
          ],
          solution: py`import pandas as pd

def add_features(df):
    out = df.copy()
    ts = out["timestamp"].dt
    out["hour"] = ts.hour
    out["is_weekend"] = ts.dayofweek >= 5
    out["is_night"] = ts.hour <= 5
    out["desc_words"] = out["description"].str.split().str.len()
    out["mentions_refund"] = out["description"].str.lower().str.contains("refund")
    return out
`,
          hint: "s.dt.hour and s.dt.dayofweek (Monday = 0, so Saturday and Sunday are 5 and 6). s.str.split().str.len() counts words. s.str.lower().str.contains(\"refund\").",
          successMessage: "A raw timestamp and a sentence became five model-ready features, each encoding something a fraud analyst would look at.",
        },
      },
      {
        id: "a-ml-imbalanced-data",
        title: "Handling imbalanced datasets",
        explain:
          "In IMBALANCED data one class is rare: fraud (under 1%), loan default (5%), disease. A model can score high accuracy by ignoring the rare class entirely, so (1) evaluate with precision, recall, F1 or AUC (Module 11), never accuracy alone; (2) STRATIFY splits so the rare class keeps its proportion; (3) rebalance the TRAINING data: RANDOM OVERSAMPLING duplicates minority rows, UNDERSAMPLING discards majority rows, SMOTE synthesises new minority points between neighbours (imbalanced-learn library); or (4) use CLASS WEIGHTS (class_weight=\"balanced\" in many sklearn models), which make each minority error cost more. Never resample the TEST set: it must reflect the real world.",
        codeChallenge: {
          task:
            "Write oversample(X, y, seed=0) that randomly duplicates rows of the minority class until both classes of the 0/1 labels y have the same count. Use rng = np.random.default_rng(seed) and rng.choice(minority_indices, size=needed, replace=True). Return (X_bal, y_bal) with the original rows first, followed by the duplicates. Then write balanced_weights(y) that returns a dictionary {class: weight} where weight = n_samples / (2 × count of that class).",
          starter: "import numpy as np\n\ndef oversample(X, y, seed=0):\n    pass\n\ndef balanced_weights(y):\n    pass\n",
          sample: "95 legitimate and 5 fraud rows → 95 and 95; balanced_weights → {0: 0.526…, 1: 10.0}",
          tests: [
            {
              check: py`import numpy as np
X = np.arange(200).reshape(100, 2)
y = np.array([0] * 95 + [1] * 5)
Xb, yb = oversample(X, y)
assert len(yb) == 190 and (yb == 1).sum() == 95, "Both classes must end with 95 rows. Got " + str(np.bincount(yb).tolist())
assert np.array_equal(Xb[:100], X) and np.array_equal(yb[:100], y), "Keep the original rows first."
fraud_rows = {tuple(r) for r in X[y == 1]}
assert all(tuple(r) in fraud_rows for r in Xb[100:]), "The added rows must be copies of minority rows."
assert np.array_equal(oversample(X, y, seed=0)[0], Xb), "The same seed gives the same result."
w = balanced_weights(y)
assert set(w) == {0, 1} and abs(w[0] - 100 / 190) < 1e-12 and w[1] == 10.0, "n / (2 × count): 100/190 and 100/10. Got " + repr(w)`,
            },
          ],
          solution: py`import numpy as np

def oversample(X, y, seed=0):
    rng = np.random.default_rng(seed)
    counts = np.bincount(y)
    minority = int(np.argmin(counts))
    needed = int(counts.max() - counts.min())
    idx = rng.choice(np.flatnonzero(y == minority), size=needed, replace=True)
    return np.vstack([X, X[idx]]), np.concatenate([y, y[idx]])

def balanced_weights(y):
    counts = np.bincount(y)
    return {c: len(y) / (2 * counts[c]) for c in range(len(counts))}
`,
          hint: "np.bincount(y) counts each class. np.flatnonzero(y == minority) lists the minority indices. Draw needed indices with replacement, then stack the copies under the originals.",
          successMessage: "Oversampling and class weights do the same job two ways: each fraud case now counts as much as 19 legitimate ones. Both apply to TRAINING data only.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 40 · 8.11 – 8.12
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ml-l40-split-and-leakage",
    moduleId: "ml-m8-preprocessing",
    sectionId: SECTION_ID,
    order: 5,
    covers: ["8.11", "8.12"],
    title: "Train-Test Splitting and Data Leakage",
    subtitle: "Holding data back honestly, and the many ways the answer sneaks in",
    estimatedMinutes: 38,
    intro:
      "A model's test score is only meaningful if the test data was truly unseen. Data leakage, letting information from the test set or the future into training, produces brilliant scores that collapse in production. It is the most expensive mistake in applied ML.",

    atoms: [
      {
        id: "a-ml-train-test-split",
        title: "Train-test splitting",
        explain:
          "train_test_split(X, y, test_size=0.2, random_state=42, stratify=y) holds back 20% of the rows as a TEST set, shuffled reproducibly, with the class proportions preserved by stratify. Train on the rest; touch the test set ONCE, at the end, to estimate how the model will perform on new data. Two special cases: TIME-SERIES data must be split by TIME (train on the past, test on the future), never shuffled, or the model sees the future; and GROUPED data (several rows per customer or patient) must keep each group entirely on one side (GroupShuffleSplit), or the model memorises individuals instead of learning patterns.",
        codeChallenge: {
          task:
            "Write split_random(X, y) that calls train_test_split with test_size=0.25, random_state=0 and stratify=y and returns its four results. Then write split_by_time(df, date_col, cutoff) that returns (train, test) DataFrames: train holds rows strictly before the cutoff date, test the rows on or after it, each sorted by date with a fresh index.",
          starter: "import pandas as pd\nfrom sklearn.model_selection import train_test_split\n\ndef split_random(X, y):\n    pass\n\ndef split_by_time(df, date_col, cutoff):\n    pass\n",
          sample: "split_by_time(sales, \"date\", \"2026-10-01\") → training up to 30 September, testing from 1 October",
          tests: [
            {
              check: py`import numpy as np
import pandas as pd
X = np.arange(400).reshape(200, 2)
y = np.array([1] * 20 + [0] * 180)
Xtr, Xte, ytr, yte = split_random(X, y)
assert len(Xte) == 50 and len(Xtr) == 150, "25% test. Got " + str(len(Xte))
assert yte.sum() == 5 and ytr.sum() == 15, "Stratified: 10% positives on both sides. Got " + str(yte.sum()) + " in test."
assert np.array_equal(split_random(X, y)[1], Xte), "random_state=0 makes the split reproducible."
df = pd.DataFrame({"date": pd.to_datetime(["2026-10-03", "2026-08-15", "2026-09-30", "2026-10-01", "2026-07-01"]), "v": [5, 2, 4, 6, 1]})
tr, te = split_by_time(df, "date", "2026-10-01")
assert tr["v"].tolist() == [1, 2, 4] and te["v"].tolist() == [6, 5], "Past before the cutoff, sorted; the cutoff day goes to test. Got " + repr((tr["v"].tolist(), te["v"].tolist()))
assert tr.index.tolist() == [0, 1, 2], "Reset the index."`,
            },
          ],
          solution: py`import pandas as pd
from sklearn.model_selection import train_test_split

def split_random(X, y):
    return train_test_split(X, y, test_size=0.25, random_state=0, stratify=y)

def split_by_time(df, date_col, cutoff):
    d = df.sort_values(date_col)
    cut = pd.Timestamp(cutoff)
    train = d[d[date_col] < cut].reset_index(drop=True)
    test = d[d[date_col] >= cut].reset_index(drop=True)
    return train, test
`,
          hint: "train_test_split(X, y, test_size=0.25, random_state=0, stratify=y). For time: sort by date, then compare with pd.Timestamp(cutoff).",
          successMessage: "Random and stratified for independent rows; by time for anything that will be used to predict the future.",
        },
      },
      {
        id: "a-ml-data-leakage",
        title: "Data leakage and how to prevent it",
        explain:
          "DATA LEAKAGE is any information in training that would not be available at prediction time. TARGET LEAKAGE: a feature that is a consequence of the target (\"account_closed_date\" when predicting churn; \"chargeback_filed\" when predicting fraud). TRAIN-TEST CONTAMINATION: fitting scalers, imputers, encoders or feature selection on ALL the data before splitting, so test statistics shape training; or duplicates on both sides. TEMPORAL leakage: shuffling time series, or features computed with future data. Symptoms: a suspiciously high score, or one feature that dominates. Prevention: split FIRST, fit every transformer on training data only (Pipelines automate this, Module 13), and ask of every feature: would I know this at the moment of prediction?",
        codeExercise: {
          language: PY,
          code: py`import numpy as np
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split

rng = np.random.default_rng(0)
n = 1000
tenure = rng.normal(24, 10, n)
churn = (rng.uniform(0, 1, n) < 1 / (1 + np.exp((tenure - 18) / 6))).astype(int)
closed_account = churn * rng.integers(0, 2, n) + churn   # recorded AFTER churning

honest = tenure.reshape(-1, 1)
leaky = np.column_stack([tenure, closed_account])
for name, X in [("honest", honest), ("leaky", leaky)]:
    Xtr, Xte, ytr, yte = train_test_split(X, churn, test_size=0.3, random_state=1)
    acc = LogisticRegression().fit(Xtr, ytr).score(Xte, yte)
    print(name, round(acc, 3))
`,
          question: "One model uses tenure only; the other also uses an \"account closed\" field recorded after a customer churns. What test accuracies are printed?",
          expectedOutput: "honest 0.77\nleaky 1.0",
          hint: "closed_account is non-zero exactly when churn is 1, so it reveals the answer.",
          successMessage: "100% accuracy is not a triumph, it is a warning. In production the closed-account field does not exist yet for customers who have not churned, and the model would be useless.",
        },
      },
      {
        id: "a-ml-leakage-prevention",
        title: "Fitting preprocessing on training data only",
        explain:
          "The safe order of operations, every time: (1) split; (2) fit every preprocessing step on X_train only; (3) transform X_train and X_test with the fitted steps; (4) train on the transformed X_train; (5) evaluate once on the transformed X_test. The wrong order, scaling or selecting features on the full dataset before splitting, leaks test statistics into training. With scaling the effect is often small; with feature selection on many noisy features it is dramatic, because the selector picks features that happen to correlate with the target in the TEST rows too.",
        codeChallenge: {
          task:
            "Write fit_evaluate(X, y) that splits with train_test_split(X, y, test_size=0.3, random_state=0), fits a StandardScaler on the TRAINING features only, transforms both sets, trains LogisticRegression() on the scaled training set and returns the accuracy on the scaled test set, rounded to 3. The test also checks that your scaler never sees the test rows.",
          starter: "from sklearn.model_selection import train_test_split\nfrom sklearn.preprocessing import StandardScaler\nfrom sklearn.linear_model import LogisticRegression\n\ndef fit_evaluate(X, y):\n    pass\n",
          sample: "fit_evaluate(X, y) → about 0.9 on the generated data",
          tests: [
            {
              check: py`import numpy as np
from unittest.mock import patch
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
rng = np.random.default_rng(7)
X = rng.normal(size=(300, 3)) * [1, 1000, 50]
y = (X[:, 0] + X[:, 1] / 1000 > 0).astype(int)
seen = []
real_fit = StandardScaler.fit
def spy(self, data, *a, **k):
    seen.append(len(data))
    return real_fit(self, data, *a, **k)
with patch.object(StandardScaler, "fit", spy):
    acc = fit_evaluate(X, y)
assert seen and all(n == 210 for n in seen), "Fit the scaler on the 210 training rows only. It was fitted on " + repr(seen) + " rows."
Xtr, Xte, ytr, yte = train_test_split(X, y, test_size=0.3, random_state=0)
sc = StandardScaler().fit(Xtr)
want = round(LogisticRegression().fit(sc.transform(Xtr), ytr).score(sc.transform(Xte), yte), 3)
assert acc == want, "Expected test accuracy " + str(want) + ". Got " + repr(acc)`,
            },
          ],
          solution: py`from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression

def fit_evaluate(X, y):
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=0)
    scaler = StandardScaler().fit(X_train)
    model = LogisticRegression().fit(scaler.transform(X_train), y_train)
    return round(model.score(scaler.transform(X_test), y_test), 3)
`,
          hint: "Split first. scaler = StandardScaler().fit(X_train). Then model.fit(scaler.transform(X_train), y_train) and model.score(scaler.transform(X_test), y_test).",
          successMessage: "Split, fit on train, transform both, train, evaluate once. Burn that order into memory; Pipelines in Module 13 enforce it automatically.",
        },
      },
    ],

    task: {
      title: "Month 2 major project: end-to-end EDA and preprocessing",
      intro:
        "Choose a real dataset with a clear prediction target (customer churn, loan default, house prices or student performance; Kaggle and the UCI repository have many) and take it from raw to model-ready, documenting every decision.",
      prompts: [
        "Write the problem statement: the target, the prediction moment, and what features would be available at that moment.",
        "Profile and explore the data (Module 6), with at least four presentation-quality charts (Module 7).",
        "Split FIRST: a stratified random split, or a time-based split if the data is temporal, and explain the choice.",
        "Clean inconsistencies and impossible values; impute missing data with training statistics and indicator columns.",
        "Encode categorical features correctly (ordinal versus one-hot, with unseen categories handled) and scale numeric ones.",
        "Engineer at least five new features from dates, text, ratios or aggregates, and justify each.",
        "Audit for leakage: list every feature and state whether it is known at prediction time. Remove any that are not.",
        "Export the processed training and test sets, and write a preprocessing report another engineer could reproduce.",
      ],
      closing: "Your data is ready. Month 3 builds the models: first, what a model really is, and how to tell whether it has learned or merely memorised.",
    },

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
