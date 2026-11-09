/**
 * MACHINE LEARNING AND AI · MODULE 9 · UNDERSTANDING MACHINE LEARNING MODELS
 *
 * Curriculum 9.1 – 9.10. What a model is; training versus testing; the
 * train / validation / test split; features and targets; parameters and
 * hyperparameters; underfitting and overfitting; the bias-variance trade-off;
 * generalisation; loss functions; and evaluation against a baseline. These
 * ideas decide whether any model in Months 3 and 4 can be trusted, so each
 * is demonstrated by measurement, not assertion.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

export const SECTION_ID = "ml-s9-models";

const PY = "python";
const py = String.raw;

// A noisy curved dataset shared by several checks: y = sin(x) + noise.
const CURVE = py`import numpy as np
_rng = np.random.default_rng(0)
X = np.sort(_rng.uniform(0, 6, 120)).reshape(-1, 1)
y = np.sin(X).ravel() + _rng.normal(0, 0.25, 120)
`;

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 41 · 9.1 – 9.4
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ml-l41-what-is-a-model",
    moduleId: "ml-m9-models",
    sectionId: SECTION_ID,
    order: 1,
    covers: ["9.1", "9.2", "9.3", "9.4"],
    title: "Models, Training, Testing and Data Splits",
    subtitle: "What a model is, and why it must be judged on data it has never seen",
    estimatedMinutes: 36,
    intro:
      "A model that remembers its training data perfectly can still be useless. This lesson defines what a model is and builds the habit that separates real machine learning from self-deception: judge it only on unseen data.",

    atoms: [
      {
        id: "a-ml-what-is-model",
        title: "What is a machine learning model?",
        explain:
          "A MODEL is a function ŷ = f(x; θ) that maps features x to a prediction ŷ, with PARAMETERS θ set by training. Its FORM is chosen by you (a straight line, a tree of if-questions, a neural network); its parameter VALUES are learned from data. Linear regression is ŷ = w·x + b, with parameters w and b. In scikit-learn every model has the same interface: model.fit(X, y) learns the parameters, model.predict(X) applies them, model.score(X, y) evaluates. A trained model is a compressed summary of patterns in the training data, useful only to the extent those patterns hold for new data.",
        codeExercise: {
          language: PY,
          code: py`import numpy as np
from sklearn.linear_model import LinearRegression

X = np.array([[50], [80], [100], [120]])     # size in m²
y = np.array([30, 48, 60, 72])               # rent in ₦m

model = LinearRegression().fit(X, y)
print(round(model.coef_[0], 3), round(model.intercept_, 3))
print(model.predict([[90]]).round(1))
`,
          question: "Fit ŷ = w·x + b to four houses. What are the learned w and b, and the prediction for 90 m²?",
          expectedOutput: "0.6 0.0\n[54.]",
          hint: "Every rent is exactly 0.6 × size.",
          successMessage: "The model's whole knowledge is two numbers, w = 0.6 and b = 0: the parameters training found.",
        },
      },
      {
        id: "a-ml-train-vs-test",
        title: "Training vs testing",
        explain:
          "TRAINING is fitting the parameters on labelled examples; TESTING is measuring performance on DIFFERENT examples the model never saw. Training error is optimistic, because the model was tuned to exactly those rows; a model can drive it to zero by MEMORISING them. The test error estimates what happens on tomorrow's data, which is the only thing that matters. The gap between training and test performance is the first diagnostic you check on every model.",
        codeChallenge: {
          task:
            "Write a class Memoriser with fit(X, y) and predict(X), where X is a list of tuples. fit stores a dictionary from each training input to its label and also the most common training label. predict returns the stored label for inputs seen in training, and the most common label for anything unseen. Then write accuracy(model, X, y) returning the fraction correct.",
          starter: "class Memoriser:\n    pass\n\ndef accuracy(model, X, y):\n    pass\n",
          sample: "100% on the training rows, close to the majority-class rate on new rows",
          tests: [
            {
              check: py`import random
rng = random.Random(1)
rows = [(rng.randint(18, 70), rng.randint(1, 60)) for _ in range(300)]
labels = [int(age < 30 and tenure < 12) if rng.random() > 0.1 else 1 - int(age < 30 and tenure < 12) for age, tenure in rows]
Xtr, ytr, Xte, yte = rows[:200], labels[:200], rows[200:], labels[200:]
m = Memoriser()
m.fit(Xtr, ytr)
train_acc = accuracy(m, Xtr, ytr)
test_acc = accuracy(m, Xte, yte)
majority = max(set(ytr), key=ytr.count)
assert train_acc >= 0.97, "Memorising should get (almost) every training row right. Got " + str(train_acc)
assert abs(test_acc - sum(1 for t in yte if t == majority) / len(yte)) < 0.06, "On unseen rows it can only guess the majority label. Got " + str(test_acc)
assert m.predict([(999, 999)]) == [majority], "Unseen input: predict the most common training label."`,
            },
          ],
          solution: py`class Memoriser:
    def fit(self, X, y):
        self.table_ = {}
        for x, label in zip(X, y):
            self.table_[x] = label
        self.majority_ = max(set(y), key=list(y).count)
        return self

    def predict(self, X):
        return [self.table_.get(x, self.majority_) for x in X]

def accuracy(model, X, y):
    preds = model.predict(X)
    return sum(p == t for p, t in zip(preds, y)) / len(y)
`,
          hint: "fit: build self.table_ = {x: label} and self.majority_ = max(set(y), key=list(y).count). predict: [self.table_.get(x, self.majority_) for x in X].",
          successMessage: "Near-perfect training accuracy, majority-class test accuracy: memorising is not learning. Only the test score revealed it.",
        },
      },
      {
        id: "a-ml-train-val-test",
        title: "Training, validation and test datasets",
        explain:
          "Two different questions need two different held-out sets. The VALIDATION set is used DURING development to compare models and choose hyperparameters (which tree depth? which features?). Because you make many decisions with it, it becomes slightly optimistic too. The TEST set is touched ONCE, at the very end, for an unbiased estimate of final performance. A common split is 60/20/20 or 70/15/15; with little data, cross-validation (Module 13) replaces the single validation set. Rule: if the test score influenced any decision, it is no longer a test score.",
        codeChallenge: {
          task:
            "Write three_way_split(X, y, seed=0) that returns X_train, X_val, X_test, y_train, y_val, y_test as a 60/20/20 split, by calling train_test_split twice: first hold out 20% as the test set (test_size=0.2, random_state=seed), then split the remaining 80% so that the validation set is 20% of the ORIGINAL data (test_size=0.25 of the remainder, random_state=seed).",
          starter: "from sklearn.model_selection import train_test_split\n\ndef three_way_split(X, y, seed=0):\n    pass\n",
          sample: "1,000 rows → 600 train, 200 validation, 200 test",
          tests: [
            {
              check: py`import numpy as np
X = np.arange(2000).reshape(1000, 2)
y = np.arange(1000)
Xtr, Xva, Xte, ytr, yva, yte = three_way_split(X, y)
assert (len(Xtr), len(Xva), len(Xte)) == (600, 200, 200), "60/20/20. Got " + repr((len(Xtr), len(Xva), len(Xte)))
assert len(set(ytr) | set(yva) | set(yte)) == 1000 and len(set(ytr) & set(yte)) == 0 and len(set(yva) & set(yte)) == 0, "Every row in exactly one set."
assert np.array_equal(Xtr[:, 0] // 2, ytr), "Features and labels stay aligned."
assert np.array_equal(three_way_split(X, y)[2], Xte), "The seed makes it reproducible."`,
            },
          ],
          solution: py`from sklearn.model_selection import train_test_split

def three_way_split(X, y, seed=0):
    X_rest, X_test, y_rest, y_test = train_test_split(X, y, test_size=0.2, random_state=seed)
    X_train, X_val, y_train, y_val = train_test_split(X_rest, y_rest, test_size=0.25, random_state=seed)
    return X_train, X_val, X_test, y_train, y_val, y_test
`,
          hint: "First split off 20% for test. 25% of the remaining 80% is 20% of the whole, so the second split uses test_size=0.25.",
          successMessage: "Validation for decisions, test for the final verdict. Keep the test set locked away until the end.",
        },
      },
      {
        id: "a-ml-features-target",
        title: "Features and target variables",
        explain:
          "The TARGET (y, the dependent variable or label) is what you want to predict; FEATURES (X, independent variables, predictors) are the inputs. Choosing them is a design decision: the target must match the business question (predict \"will default within 12 months\", not \"defaulted ever\"), and every feature must be AVAILABLE AT PREDICTION TIME (Module 8's leakage rule). Identifiers such as customer_id or names are not features: they carry no general pattern, only memorisation. In code: y = df[\"target\"]; X = df.drop(columns=[\"target\", \"customer_id\"]).",
        decision: {
          scenario:
            "A loan dataset has: applicant_id, monthly_income, existing_loans, employment_years, loan_amount, days_late_on_this_loan, defaulted.",
          question: "To predict default at application time, which columns should be the features?",
          options: [
            { id: "a", text: "Every column except defaulted", whyWrong: "applicant_id is an identifier, and days_late_on_this_loan is only known after the loan is issued: leakage." },
            { id: "b", text: "monthly_income, existing_loans, employment_years, loan_amount", why: "All known when the application arrives, and none is an identifier or a consequence of the outcome." },
            { id: "c", text: "days_late_on_this_loan only, since it predicts default best", whyWrong: "It predicts best because it is measured after the fact. It does not exist at application time." },
            { id: "d", text: "applicant_id and loan_amount", whyWrong: "An ID carries no general pattern." },
          ],
          correct: "b",
          aftermath: "Features: known at prediction time, not identifiers, not consequences of the target.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 42 · 9.5 – 9.6
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ml-l42-parameters-fitting",
    moduleId: "ml-m9-models",
    sectionId: SECTION_ID,
    order: 2,
    covers: ["9.5", "9.6"],
    title: "Parameters, Hyperparameters, Underfitting and Overfitting",
    subtitle: "What training sets, what you set, and finding the right complexity",
    estimatedMinutes: 36,
    intro:
      "Some numbers are learned by the model; others you must choose. The most important choice is complexity: too simple and the model misses the pattern, too complex and it learns the noise.",

    atoms: [
      {
        id: "a-ml-params-hyperparams",
        title: "Model parameters and hyperparameters",
        explain:
          "PARAMETERS are learned from data during fit: a linear model's coefficients (coef_, intercept_), a tree's split points, a neural network's weights. HYPERPARAMETERS are set BEFORE training and control how learning happens or how complex the model may be: a tree's max_depth, k in k-nearest neighbours, the regularisation strength alpha, the learning rate, the number of epochs. In scikit-learn, hyperparameters are constructor arguments (DecisionTreeRegressor(max_depth=3)) and learned parameters are attributes ending in an underscore. You choose hyperparameters by comparing VALIDATION performance, never training performance.",
        codeExercise: {
          language: PY,
          code: CURVE + py`from sklearn.tree import DecisionTreeRegressor

for depth in [1, 3, None]:
    tree = DecisionTreeRegressor(max_depth=depth, random_state=0).fit(X, y)
    print(depth, tree.get_depth(), tree.get_n_leaves())
`,
          question: "max_depth is a hyperparameter you set; the depth reached and the number of leaves are what training produced. What does it print?",
          expectedOutput: "1 1 2\n3 3 8\nNone 12 120",
          hint: "With no depth limit, a regression tree keeps splitting until every training point has its own leaf.",
          successMessage: "With max_depth=None the tree grew 120 leaves for 120 points: one per training example, a memoriser. The hyperparameter controls how complex the learned model can become.",
        },
      },
      {
        id: "a-ml-under-overfitting",
        title: "Underfitting and overfitting",
        explain:
          "UNDERFITTING: the model is too simple to capture the pattern, so it does badly on BOTH training and test data (a straight line through a curve). OVERFITTING: the model is so flexible it fits the NOISE in the training data, scoring brilliantly on training data and poorly on test data (a wiggly curve through every point). As complexity rises, training error falls steadily, while validation error first falls, then rises: the best model sits at the bottom of the VALIDATION curve. Remedies for overfitting: a simpler model, more data, regularisation (Module 10), fewer features; for underfitting: a more flexible model or better features.",
        codeChallenge: {
          task:
            "Write best_depth(X_train, y_train, X_val, y_val, depths) that fits DecisionTreeRegressor(max_depth=d, random_state=0) for each d in depths and returns a tuple (best, train_mse, val_mse): best is the depth with the LOWEST validation mean squared error, and train_mse and val_mse are dictionaries {depth: mse rounded to 4}. Use sklearn.metrics.mean_squared_error.",
          starter: "from sklearn.tree import DecisionTreeRegressor\nfrom sklearn.metrics import mean_squared_error\n\ndef best_depth(X_train, y_train, X_val, y_val, depths):\n    pass\n",
          sample: "depth 1 underfits, depth 20 overfits, a depth around 3 to 5 wins on validation",
          tests: [
            {
              check: CURVE + py`
from sklearn.model_selection import train_test_split
Xtr, Xva, ytr, yva = train_test_split(X, y, test_size=0.3, random_state=1)
depths = [1, 2, 3, 4, 5, 8, 20]
best, tr, va = best_depth(Xtr, ytr, Xva, yva, depths)
assert set(tr) == set(depths) and set(va) == set(depths), "One entry per depth."
assert tr[20] < 0.001, "An unlimited tree fits its training data almost perfectly. Got " + str(tr[20])
assert va[20] > va[best], "...but does worse on validation than the best depth."
assert tr[1] > 0.1 and va[1] > va[best], "Depth 1 underfits: bad on both."
assert best == min(va, key=va.get), "best is the depth with the lowest validation MSE."
assert all(tr[a] >= tr[b] - 1e-9 for a, b in zip(depths, depths[1:])), "Training error never rises as depth grows."`,
            },
          ],
          solution: py`from sklearn.tree import DecisionTreeRegressor
from sklearn.metrics import mean_squared_error

def best_depth(X_train, y_train, X_val, y_val, depths):
    train_mse, val_mse = {}, {}
    for d in depths:
        tree = DecisionTreeRegressor(max_depth=d, random_state=0).fit(X_train, y_train)
        train_mse[d] = round(mean_squared_error(y_train, tree.predict(X_train)), 4)
        val_mse[d] = round(mean_squared_error(y_val, tree.predict(X_val)), 4)
    best = min(val_mse, key=val_mse.get)
    return best, train_mse, val_mse
`,
          hint: "Loop over depths; fit; record mean_squared_error on train and on validation. min(val_mse, key=val_mse.get) gives the best depth.",
          successMessage: "Training error kept falling to zero; validation error fell then rose. Choosing by validation found the sweet spot between underfitting and overfitting.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 43 · 9.7 – 9.8
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ml-l43-bias-variance",
    moduleId: "ml-m9-models",
    sectionId: SECTION_ID,
    order: 3,
    covers: ["9.7", "9.8"],
    title: "The Bias-Variance Trade-off and Generalization",
    subtitle: "Two sources of error, and what it means for a model to generalise",
    estimatedMinutes: 34,
    intro:
      "Why does a more flexible model eventually do worse? Because prediction error has two competing sources. Understanding them tells you what to try next when a model disappoints.",

    atoms: [
      {
        id: "a-ml-bias-variance",
        title: "The bias-variance trade-off",
        explain:
          "A model's expected error on new data splits into BIAS² + VARIANCE + irreducible noise. BIAS is error from wrong assumptions: a straight line fitted to a curve is wrong in the same way whichever training sample it sees (underfitting). VARIANCE is error from sensitivity to the particular training sample: a very deep tree fitted to a different sample would make very different predictions (overfitting). Simple models have high bias and low variance; flexible models low bias and high variance. You cannot minimise both at once, so you look for the complexity where their sum is smallest. Ensembles (Module 11) cheat the trade-off: averaging many high-variance trees cuts variance without adding bias.",
        codeExercise: {
          language: PY,
          code: CURVE + py`from sklearn.tree import DecisionTreeRegressor

rng = np.random.default_rng(1)
x0 = np.array([[1.5]])
for depth in [1, None]:
    preds = []
    for _ in range(50):
        idx = rng.integers(0, len(X), len(X))          # a new bootstrap training sample
        tree = DecisionTreeRegressor(max_depth=depth, random_state=0).fit(X[idx], y[idx])
        preds.append(tree.predict(x0)[0])
    preds = np.array(preds)
    bias = preds.mean() - np.sin(1.5)
    print(depth, round(abs(bias), 2), round(preds.std(), 2))
`,
          question: "Train 50 trees, each on a different resample of the data, and look at their predictions at x = 1.5 (true value sin 1.5). For a depth-1 tree and an unlimited tree, what are the bias and the spread (variance) of the predictions?",
          expectedOutput: "1 0.46 0.06\nNone 0.14 0.17",
          hint: "A depth-1 tree predicts one of two averages, wrong but stable. An unlimited tree follows each sample's noise: close on average, but scattered.",
          successMessage: "Shallow: biased (0.46) but consistent (0.06). Deep: far less biased (0.14) but nearly three times as scattered. Averaging the 50 deep trees keeps the low bias and cancels much of the spread, which is exactly what a random forest does.",
        },
      },
      {
        id: "a-ml-generalization",
        title: "Generalization",
        explain:
          "GENERALISATION is a model's ability to perform well on new data from the same source. It is the goal of machine learning; training performance is only a means. Three things improve it: MORE DATA (variance shrinks as the sample grows), the RIGHT COMPLEXITY, and REGULARISATION. A LEARNING CURVE plots training and validation scores against training-set size: if both are low and close, the model underfits and more data will not help (a better model will); if there is a wide gap, it overfits and more data will help. Generalisation also assumes new data resembles the training data; when the world shifts, the model must be monitored and retrained (Module 21).",
        codeChallenge: {
          task:
            "Write learning_curve_scores(model, X, y, sizes) that, for each n in sizes, fits a fresh clone of model (sklearn.base.clone) on the first n rows of X, y and records the R² score (model.score) on those n rows and on the LAST 200 rows (a fixed validation set). Return a list of tuples (n, train_score, val_score) with scores rounded to 3. Assume sizes never exceed len(X) − 200.",
          starter: "from sklearn.base import clone\n\ndef learning_curve_scores(model, X, y, sizes):\n    pass\n",
          sample: "[(20, 1.0, 0.71), (100, 1.0, 0.8), ...] for an unlimited tree: the gap closes as n grows",
          tests: [
            {
              check: py`import numpy as np
from sklearn.tree import DecisionTreeRegressor
from sklearn.linear_model import LinearRegression
rng = np.random.default_rng(2)
X = rng.uniform(0, 6, (1200, 1))
y = np.sin(X).ravel() + rng.normal(0, 0.25, 1200)
curve = learning_curve_scores(DecisionTreeRegressor(max_depth=5, random_state=0), X, y, [20, 100, 1000])
assert [n for n, _, _ in curve] == [20, 100, 1000], "One entry per size. Got " + repr(curve)
assert curve[-1][2] > curve[0][2], "More data should improve the validation score. Got " + repr(curve)
assert curve[0][1] - curve[0][2] > curve[-1][1] - curve[-1][2], "The train-validation gap should narrow with more data. Got " + repr(curve)
line = learning_curve_scores(LinearRegression(), X, y, [20, 1000])
assert line[-1][2] < 0.75 and abs(line[-1][1] - line[-1][2]) < 0.05, "A straight line underfits the curve: low scores, small gap, however much data. Got " + repr(line)`,
            },
          ],
          solution: py`from sklearn.base import clone

def learning_curve_scores(model, X, y, sizes):
    X_val, y_val = X[-200:], y[-200:]
    out = []
    for n in sizes:
        m = clone(model).fit(X[:n], y[:n])
        out.append((n, round(m.score(X[:n], y[:n]), 3), round(m.score(X_val, y_val), 3)))
    return out
`,
          hint: "X_val, y_val = X[-200:], y[-200:]. For each n: m = clone(model).fit(X[:n], y[:n]); record m.score on the training rows and on the validation rows.",
          successMessage: "The tree's gap closed as data grew (more data cures variance); the straight line stayed low however much data it got (more data cannot cure bias).",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 44 · 9.9 – 9.10
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ml-l44-loss-and-evaluation",
    moduleId: "ml-m9-models",
    sectionId: SECTION_ID,
    order: 4,
    covers: ["9.9", "9.10"],
    title: "Loss Functions and Model Evaluation",
    subtitle: "What training minimises, and how to judge the result",
    estimatedMinutes: 34,
    intro:
      "Training needs a number to minimise: the loss. Evaluation needs a number people care about: the metric. They are often different, and confusing them leads to models that optimise the wrong thing.",

    atoms: [
      {
        id: "a-ml-loss-functions",
        title: "Loss functions",
        explain:
          "A LOSS FUNCTION measures how wrong a model's predictions are; training searches for the parameters that minimise its average over the training data. For REGRESSION: MEAN SQUARED ERROR, (1/n) Σ (y − ŷ)², punishes large errors heavily and is smooth to optimise; MEAN ABSOLUTE ERROR, (1/n) Σ |y − ŷ|, is less sensitive to outliers; HUBER loss is squared for small errors and absolute for large ones. For CLASSIFICATION: LOG LOSS (binary cross-entropy), −(1/n) Σ [y log p + (1 − y) log(1 − p)], rewards confident correct probabilities and severely punishes confident mistakes; HINGE loss, max(0, 1 − y·score), is used by SVMs. The loss must be differentiable (or nearly) for gradient descent.",
        codeChallenge: {
          task:
            "Using NumPy, write mse(y, y_hat), mae(y, y_hat) and log_loss(y, p, eps=1e-15), each returning a float. log_loss must clip p into [eps, 1 − eps] before taking logs. The inputs are lists or arrays.",
          starter: "import numpy as np\n\ndef mse(y, y_hat):\n    pass\n\ndef mae(y, y_hat):\n    pass\n\ndef log_loss(y, p, eps=1e-15):\n    pass\n",
          sample: "mse([3, 5], [2, 7]) → 2.5; mae([3, 5], [2, 7]) → 1.5",
          tests: [
            {
              check: py`import numpy as np
from sklearn import metrics
assert mse([3, 5], [2, 7]) == 2.5 and mae([3, 5], [2, 7]) == 1.5, "Errors 1 and −2: MSE (1 + 4) / 2, MAE (1 + 2) / 2."
rng = np.random.default_rng(0)
y = rng.normal(size=50)
yh = y + rng.normal(size=50)
assert abs(mse(y, yh) - metrics.mean_squared_error(y, yh)) < 1e-12 and abs(mae(y, yh) - metrics.mean_absolute_error(y, yh)) < 1e-12, "Must match scikit-learn."
yc = np.array([1, 0, 1, 1])
p = np.array([0.9, 0.2, 0.6, 0.99])
assert abs(log_loss(yc, p) - metrics.log_loss(yc, p)) < 1e-9, "Log loss must match scikit-learn. Got " + repr(log_loss(yc, p))
assert np.isfinite(log_loss([1, 0], [0.0, 1.0])), "Clip probabilities so log(0) never happens."
assert log_loss([1], [0.01]) > 100 * log_loss([1], [0.99]), "A confident wrong prediction (p = 0.01) must cost far more than a confident right one (p = 0.99)."
assert isinstance(mse([1], [2]), float), "Return Python floats."`,
            },
          ],
          solution: py`import numpy as np

def mse(y, y_hat):
    y, y_hat = np.asarray(y, float), np.asarray(y_hat, float)
    return float(np.mean((y - y_hat) ** 2))

def mae(y, y_hat):
    y, y_hat = np.asarray(y, float), np.asarray(y_hat, float)
    return float(np.mean(np.abs(y - y_hat)))

def log_loss(y, p, eps=1e-15):
    y = np.asarray(y, float)
    p = np.clip(np.asarray(p, float), eps, 1 - eps)
    return float(-np.mean(y * np.log(p) + (1 - y) * np.log(1 - p)))
`,
          hint: "Convert with np.asarray(..., float). Log loss: p = np.clip(p, eps, 1 - eps); return -np.mean(y * np.log(p) + (1 - y) * np.log(1 - p)).",
          successMessage: "Your three losses match scikit-learn's. Log loss is what logistic regression and neural network classifiers minimise during training.",
        },
      },
      {
        id: "a-ml-model-evaluation",
        title: "Model evaluation",
        explain:
          "EVALUATION judges a trained model on held-out data with a METRIC chosen for the business problem: RMSE or MAE in naira for prices; precision and recall for fraud; R² for explained variance. Always compare against a BASELINE: DummyRegressor (predicts the training mean) and DummyClassifier (predicts the most frequent class). A model that cannot beat its baseline has learned nothing useful, however sophisticated. Report the metric on the TEST set, with the baseline beside it, and translate it into business terms: \"predictions are within ₦4.2m of the actual rent on average, versus ₦9.8m for guessing the average\".",
        codeChallenge: {
          task:
            "Write evaluate(model, X_train, y_train, X_test, y_test) for a REGRESSION problem. Fit the model and a DummyRegressor(strategy=\"mean\") on the training data, and return a dictionary {\"model_mae\": ..., \"baseline_mae\": ..., \"improvement\": ...} with the test mean absolute errors rounded to 3 and improvement = 1 − model_mae / baseline_mae, rounded to 3.",
          starter: "from sklearn.dummy import DummyRegressor\nfrom sklearn.metrics import mean_absolute_error\n\ndef evaluate(model, X_train, y_train, X_test, y_test):\n    pass\n",
          sample: "{\"model_mae\": 0.21, \"baseline_mae\": 0.62, \"improvement\": 0.66}",
          tests: [
            {
              check: CURVE + py`
from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeRegressor
from sklearn.dummy import DummyRegressor
from sklearn.metrics import mean_absolute_error
Xtr, Xte, ytr, yte = train_test_split(X, y, test_size=0.3, random_state=0)
r = evaluate(DecisionTreeRegressor(max_depth=3, random_state=0), Xtr, ytr, Xte, yte)
assert set(r) == {"model_mae", "baseline_mae", "improvement"}, "Return the three keys. Got " + repr(r)
base = round(mean_absolute_error(yte, DummyRegressor().fit(Xtr, ytr).predict(Xte)), 3)
assert r["baseline_mae"] == base, "The baseline predicts the training mean. Expected " + str(base) + ", got " + repr(r["baseline_mae"])
tree = round(mean_absolute_error(yte, DecisionTreeRegressor(max_depth=3, random_state=0).fit(Xtr, ytr).predict(Xte)), 3)
assert r["model_mae"] == tree, "Expected model MAE " + str(tree) + ". Got " + repr(r["model_mae"])
assert r["improvement"] == round(1 - r["model_mae"] / r["baseline_mae"], 3) and r["improvement"] > 0.4, "The tree should beat the baseline clearly."`,
            },
          ],
          solution: py`from sklearn.dummy import DummyRegressor
from sklearn.metrics import mean_absolute_error

def evaluate(model, X_train, y_train, X_test, y_test):
    model.fit(X_train, y_train)
    baseline = DummyRegressor(strategy="mean").fit(X_train, y_train)
    model_mae = round(mean_absolute_error(y_test, model.predict(X_test)), 3)
    baseline_mae = round(mean_absolute_error(y_test, baseline.predict(X_test)), 3)
    return {
        "model_mae": model_mae,
        "baseline_mae": baseline_mae,
        "improvement": round(1 - model_mae / baseline_mae, 3),
    }
`,
          hint: "Fit both on training data, compute each test MAE with mean_absolute_error(y_test, ...predict(X_test)), then 1 − model / baseline.",
          successMessage: "A metric alone says little; a metric beside its baseline says how much the model actually learned. Report both, always.",
        },
      },
    ],

    task: {
      title: "Module 9 practice: underfitting, overfitting and honest evaluation",
      intro:
        "On one regression dataset (house prices, rent, or the sine curve from these lessons), demonstrate the core ideas of this module with measurements and charts.",
      prompts: [
        "Split the data 60/20/20 into training, validation and test sets with a fixed seed.",
        "Fit decision trees with depths 1 to 20, and plot training and validation MSE against depth on one chart.",
        "Mark the underfitting region, the overfitting region and the best depth, and explain the shape of each curve.",
        "Plot a learning curve for the best depth and for a straight line, and explain what each says about bias and variance.",
        "Evaluate the chosen model ONCE on the test set, beside a DummyRegressor baseline, in business terms.",
        "Write down which numbers were parameters and which were hyperparameters in your experiment.",
      ],
      closing: "Every idea here applies to every model. Module 10 starts the algorithms themselves, with regression built from the mathematics up.",
    },

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
