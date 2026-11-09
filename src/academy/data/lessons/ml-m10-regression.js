/**
 * MACHINE LEARNING AND AI · MODULE 10 · REGRESSION ALGORITHMS
 *
 * Curriculum 10.1 – 10.9. Simple, multiple and polynomial regression;
 * logistic regression; cost functions; gradient descent; Ridge and Lasso;
 * MAE, MSE, RMSE and R². The learner derives simple linear regression's
 * closed form, solves multiple regression with the normal equation, and
 * trains linear regression by gradient descent from scratch, checking each
 * against scikit-learn, before using the library for regularisation.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

export const SECTION_ID = "ml-s10-regression";

const PY = "python";
const py = String.raw;

// A house-price dataset with known true coefficients, shared by checks.
const HOUSES = py`import numpy as np
_rng = np.random.default_rng(10)
_n = 200
size = _rng.uniform(40, 250, _n)
rooms = np.clip(np.round(size / 40 + _rng.normal(0, 0.7, _n)), 1, 7)
age = _rng.uniform(0, 40, _n)
X = np.column_stack([size, rooms, age])
y = 0.35 * size + 4.0 * rooms - 0.5 * age + 10 + _rng.normal(0, 6, _n)
`;

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 45 · 10.1 – 10.2
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ml-l45-simple-linear-regression",
    moduleId: "ml-m10-regression",
    sectionId: SECTION_ID,
    order: 1,
    covers: ["10.1", "10.2"],
    title: "Regression and Simple Linear Regression",
    subtitle: "Predicting a number, and the best straight line through data",
    estimatedMinutes: 34,
    intro:
      "Regression predicts a quantity: a price, a demand, a temperature. Its simplest form, a straight line through a cloud of points, has an exact formula you can derive and code in five lines.",

    atoms: [
      {
        id: "a-ml-what-is-regression",
        title: "What is regression?",
        explain:
          "REGRESSION is supervised learning with a NUMERIC target: predict rent from size, sales from advertising spend, delivery time from distance. (CLASSIFICATION predicts a category instead.) A regression model outputs a continuous number, and its errors are measured as distances: predicting ₦52m for a ₦50m flat is an error of ₦2m. The word comes from Francis Galton's 1886 observation that children of very tall parents tend to be less extreme, \"regressing\" towards the average. Regression models range from a straight line to random forests and neural networks; all of them are trained to minimise a loss such as mean squared error.",
        decision: {
          scenario: "Four prediction tasks: (1) next month's sales in naira; (2) whether an email is spam; (3) a patient's length of hospital stay in days; (4) which of five products a customer will buy next.",
          question: "Which are regression tasks?",
          options: [
            { id: "a", text: "1 and 3", why: "Sales and days are numbers on a continuous scale. Spam and product choice are categories." },
            { id: "b", text: "2 and 4", whyWrong: "These predict categories: classification." },
            { id: "c", text: "All four", whyWrong: "Spam and product choice are not numeric targets." },
            { id: "d", text: "Only 1", whyWrong: "Length of stay is also a number." },
          ],
          correct: "a",
          aftermath: "Number → regression. Category → classification.",
        },
      },
      {
        id: "a-ml-simple-linear-regression",
        title: "Simple linear regression",
        explain:
          "SIMPLE LINEAR REGRESSION fits ŷ = w·x + b, one feature, a straight line. ORDINARY LEAST SQUARES chooses w and b to minimise the sum of squared errors Σ(yᵢ − ŷᵢ)². Setting the derivatives to zero (Module 3's calculus) gives an exact solution: w = Σ(xᵢ − x̄)(yᵢ − ȳ) / Σ(xᵢ − x̄)², which is cov(x, y) / var(x), and b = ȳ − w·x̄. The line always passes through the point of means (x̄, ȳ). w is the SLOPE: the predicted change in y per one-unit increase in x. b is the INTERCEPT: the prediction at x = 0, which may be meaningless if x = 0 never occurs.",
        codeChallenge: {
          task:
            "Without scikit-learn, write fit_line(x, y) that returns (w, b) for simple linear regression using the least-squares formulas w = Σ(x − x̄)(y − ȳ) / Σ(x − x̄)² and b = ȳ − w·x̄. x and y are lists or arrays. Then write predict_line(w, b, x) that returns the predictions as a NumPy array.",
          starter: "import numpy as np\n\ndef fit_line(x, y):\n    pass\n\ndef predict_line(w, b, x):\n    pass\n",
          sample: "fit_line([10, 20, 30, 40], [25, 45, 65, 85]) → (2.0, 5.0)",
          tests: [
            {
              check: HOUSES + py`
from sklearn.linear_model import LinearRegression
w, b = fit_line([10, 20, 30, 40], [25, 45, 65, 85])
assert abs(w - 2) < 1e-9 and abs(b - 5) < 1e-9, "A perfect line: w = 2, b = 5. Got " + repr((w, b))
w, b = fit_line(size, y)
ref = LinearRegression().fit(size.reshape(-1, 1), y)
assert abs(w - ref.coef_[0]) < 1e-9 and abs(b - ref.intercept_) < 1e-9, "Must match scikit-learn's LinearRegression on the house data."
assert abs(predict_line(w, b, [size.mean()])[0] - y.mean()) < 1e-9, "The line passes through the point of means."
assert np.allclose(predict_line(2, 5, [0, 1]), [5, 7]), "predict_line returns w·x + b for each x."
assert "sklearn" not in source, "Use the formulas, not scikit-learn."`,
            },
          ],
          solution: py`import numpy as np

def fit_line(x, y):
    x, y = np.asarray(x, float), np.asarray(y, float)
    dx, dy = x - x.mean(), y - y.mean()
    w = (dx * dy).sum() / (dx ** 2).sum()
    b = y.mean() - w * x.mean()
    return w, b

def predict_line(w, b, x):
    return w * np.asarray(x, float) + b
`,
          hint: "dx = x - x.mean(); dy = y - y.mean(); w = (dx * dy).sum() / (dx ** 2).sum(); b = y.mean() - w * x.mean().",
          successMessage: "Five lines of NumPy reproduce scikit-learn exactly, because LinearRegression solves the same least-squares problem.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 46 · 10.3 – 10.4
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ml-l46-multiple-polynomial",
    moduleId: "ml-m10-regression",
    sectionId: SECTION_ID,
    order: 2,
    covers: ["10.3", "10.4"],
    title: "Multiple and Polynomial Regression",
    subtitle: "Many features at once, and curves from a linear model",
    estimatedMinutes: 38,
    intro:
      "Real prices depend on many things at once. Multiple regression handles any number of features with one matrix formula, and polynomial features let the same linear machinery fit curves.",

    atoms: [
      {
        id: "a-ml-multiple-regression",
        title: "Multiple linear regression",
        explain:
          "MULTIPLE LINEAR REGRESSION uses several features: ŷ = b + w₁x₁ + w₂x₂ + … + wₙxₙ = Xw in matrix form, after adding a column of ones to X so b is just another weight. Least squares has a closed form, the NORMAL EQUATION: w = (XᵀX)⁻¹Xᵀy. In practice it is solved with np.linalg.lstsq (stable even when XᵀX is nearly singular), not by inverting. Each coefficient wⱼ is the predicted change in y for one unit of xⱼ HOLDING THE OTHER FEATURES FIXED. That is why coefficients change when features are added or removed, and why correlated features (multicollinearity) make them unstable.",
        codeChallenge: {
          task:
            "Without scikit-learn, write fit_multiple(X, y) that adds a column of ones on the LEFT of X and solves least squares with np.linalg.lstsq(A, y, rcond=None), returning (intercept, coefficients) where coefficients is a NumPy array with one weight per feature. Then write predict_multiple(intercept, coefs, X).",
          starter: "import numpy as np\n\ndef fit_multiple(X, y):\n    pass\n\ndef predict_multiple(intercept, coefs, X):\n    pass\n",
          sample: "on the house data the coefficients come out near the true 0.35 (size), 4.0 (rooms) and −0.5 (age)",
          tests: [
            {
              check: HOUSES + py`
from sklearn.linear_model import LinearRegression
b, w = fit_multiple(X, y)
ref = LinearRegression().fit(X, y)
assert np.allclose(w, ref.coef_) and abs(b - ref.intercept_) < 1e-6, "Must match scikit-learn. Got " + repr((b, w))
assert abs(w[0] - 0.35) < 0.05 and abs(w[2] + 0.5) < 0.1, "Size and age coefficients should be near the true 0.35 and −0.5. Got " + repr(w)
assert np.allclose(predict_multiple(b, w, X[:5]), ref.predict(X[:5])), "predict_multiple is intercept + X @ coefs."
assert calls("lstsq") and "sklearn" not in source, "Use np.linalg.lstsq."`,
            },
          ],
          solution: py`import numpy as np

def fit_multiple(X, y):
    A = np.hstack([np.ones((len(X), 1)), X])
    theta, *_ = np.linalg.lstsq(A, y, rcond=None)
    return theta[0], theta[1:]

def predict_multiple(intercept, coefs, X):
    return intercept + X @ coefs
`,
          hint: "A = np.hstack([np.ones((len(X), 1)), X]); theta = np.linalg.lstsq(A, y, rcond=None)[0]. theta[0] is the intercept, theta[1:] the coefficients.",
          successMessage: "The ones column turned the intercept into an ordinary weight, and one call solved the whole system: the normal equation in practice.",
        },
      },
      {
        id: "a-ml-polynomial-regression",
        title: "Polynomial regression",
        explain:
          "When the relationship curves, add POWERS of the features: ŷ = b + w₁x + w₂x² + w₃x³. The model is still LINEAR in its weights, so ordinary least squares fits it; only the features changed. scikit-learn builds them with PolynomialFeatures(degree=d), usually in a pipeline with LinearRegression: make_pipeline(PolynomialFeatures(3), LinearRegression()). The degree is a hyperparameter: degree 1 underfits a curve, a moderate degree fits it, and a high degree wiggles through the noise and explodes outside the data range (overfitting). With several features, PolynomialFeatures also creates INTERACTION terms such as size × rooms; scale the features first when degrees are high.",
        codeChallenge: {
          task:
            "Write best_degree(X_train, y_train, X_val, y_val, degrees) that, for each degree d, fits make_pipeline(PolynomialFeatures(d), LinearRegression()) on the training data and computes the validation R² (pipeline.score). Return (best_degree, scores) where scores is {degree: R² rounded to 3}.",
          starter: "from sklearn.pipeline import make_pipeline\nfrom sklearn.preprocessing import PolynomialFeatures\nfrom sklearn.linear_model import LinearRegression\n\ndef best_degree(X_train, y_train, X_val, y_val, degrees):\n    pass\n",
          sample: "a cubic-shaped curve: degree 1 scores poorly, degree 3 best, degree 15 overfits",
          tests: [
            {
              check: py`import numpy as np
from sklearn.model_selection import train_test_split
rng = np.random.default_rng(3)
x = rng.uniform(-3, 3, 150).reshape(-1, 1)
y = 0.5 * x.ravel() ** 3 - 2 * x.ravel() + rng.normal(0, 1.5, 150)
Xtr, Xva, ytr, yva = train_test_split(x, y, test_size=0.3, random_state=0)
best, scores = best_degree(Xtr, ytr, Xva, yva, [1, 2, 3, 15])
assert set(scores) == {1, 2, 3, 15}, "One score per degree."
assert scores[1] < 0.8, "A straight line underfits a cubic. Got " + str(scores[1])
assert best == 3, "Degree 3 matches the true curve. Got " + str(best) + " with " + repr(scores)
assert scores[3] > scores[15], "Degree 15 overfits and scores lower on validation."`,
            },
          ],
          solution: py`from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import PolynomialFeatures
from sklearn.linear_model import LinearRegression

def best_degree(X_train, y_train, X_val, y_val, degrees):
    scores = {}
    for d in degrees:
        model = make_pipeline(PolynomialFeatures(d), LinearRegression()).fit(X_train, y_train)
        scores[d] = round(model.score(X_val, y_val), 3)
    return max(scores, key=scores.get), scores
`,
          hint: "For each degree: model = make_pipeline(PolynomialFeatures(d), LinearRegression()).fit(X_train, y_train); scores[d] = round(model.score(X_val, y_val), 3). Then the key with the maximum score.",
          successMessage: "Validation picked degree 3, the true shape. Degree 15 fitted the training noise and paid for it on unseen data.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 47 · 10.5 – 10.7
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ml-l47-logistic-cost-gradient",
    moduleId: "ml-m10-regression",
    sectionId: SECTION_ID,
    order: 3,
    covers: ["10.5", "10.6", "10.7"],
    title: "Logistic Regression, Cost Functions and Gradient Descent",
    subtitle: "From numbers to probabilities, and training without a formula",
    estimatedMinutes: 42,
    intro:
      "Linear regression has an exact solution; most models do not. This lesson introduces logistic regression for yes/no outcomes, the cost functions that define \"best\", and gradient descent, the general method for minimising them.",

    atoms: [
      {
        id: "a-ml-logistic-regression",
        title: "Logistic regression (classification context)",
        explain:
          "Despite its name, LOGISTIC REGRESSION is a CLASSIFIER. It computes the same linear score z = w·x + b, then squashes it with the SIGMOID σ(z) = 1 / (1 + e⁻ᶻ) into a PROBABILITY between 0 and 1: p = P(y = 1 | x). Predict class 1 when p ≥ 0.5 (the threshold can be moved, Module 11). The decision boundary w·x + b = 0 is a straight line (a flat hyperplane in more dimensions). Each coefficient changes the LOG-ODDS: log(p / (1 − p)) = w·x + b, so e^wⱼ is the factor by which the odds multiply per unit of xⱼ. It is trained by minimising log loss, which has no closed form: hence gradient descent.",
        codeExercise: {
          language: PY,
          code: py`import numpy as np

w, b = 0.08, -4.0          # learned: score = 0.08 × credit_score_band - 4
def p_default(x):
    return 1 / (1 + np.exp(-(w * x + b)))

for x in [20, 50, 80]:
    p = p_default(x)
    print(x, round(p, 3), int(p >= 0.5))
print(round(np.exp(w * 10), 3))
`,
          question: "A logistic model of default risk. What probabilities and classes does it give for three applicants, and by what factor do the odds multiply for 10 more units of x?",
          expectedOutput: "20 0.083 0\n50 0.5 1\n80 0.917 1\n2.226",
          hint: "At x = 50 the score is exactly 0, and σ(0) = 0.5. The odds multiply by e^(0.08 × 10) = e^0.8.",
          successMessage: "The linear score becomes a probability, the 0.5 threshold becomes a class, and e^(10w) says the odds of default more than double every 10 units.",
        },
      },
      {
        id: "a-ml-cost-functions",
        title: "Cost functions",
        explain:
          "A COST FUNCTION J(θ) is the average loss over the whole training set as a function of the parameters: for linear regression, J(w, b) = (1/n) Σ (yᵢ − (w·xᵢ + b))², the MSE. Training means finding the parameters at its minimum. For linear regression J is a smooth BOWL (convex) with a single minimum, so any downhill method finds it. Logistic regression uses LOG LOSS, which is also convex. Neural networks have non-convex costs with many valleys. Visualising J for one parameter shows exactly what training does: it moves w towards the bottom of the curve.",
        codeExercise: {
          language: PY,
          code: py`import numpy as np

x = np.array([1.0, 2.0, 3.0, 4.0])
y = np.array([2.0, 4.0, 6.0, 8.0])        # y = 2x exactly

def cost(w, b=0.0):
    return np.mean((y - (w * x + b)) ** 2)

for w in [0.0, 1.0, 2.0, 3.0]:
    print(w, cost(w))
`,
          question: "Evaluate the MSE cost J(w) for four slopes, with b = 0. What does it print?",
          expectedOutput: "0.0 30.0\n1.0 7.5\n2.0 0.0\n3.0 7.5",
          hint: "At w = 1 every error is x, so J = mean(1, 4, 9, 16). At w = 2 the line is perfect.",
          successMessage: "A symmetric bowl with its bottom at w = 2. Gradient descent rolls down exactly this curve.",
        },
      },
      {
        id: "a-ml-gradient-descent-regression",
        title: "Gradient descent for linear regression",
        explain:
          "For J(w, b) = (1/n) Σ (ŷᵢ − yᵢ)², the gradients are ∂J/∂w = (2/n) Σ (ŷᵢ − yᵢ)xᵢ and ∂J/∂b = (2/n) Σ (ŷᵢ − yᵢ). In matrix form with error e = Xw + b − y: ∇w = (2/n) Xᵀe and ∇b = (2/n) Σe. BATCH gradient descent repeats w ← w − η∇w, b ← b − η∇b using all rows each step; STOCHASTIC gradient descent (SGD) uses one row at a time; MINI-BATCH uses small groups, the standard in deep learning. Gradient descent needs SCALED features: on unscaled data the bowl is a long narrow valley and progress zig-zags. It scales to datasets far too large for the normal equation.",
        codeChallenge: {
          task:
            "Write gd_linear(X, y, lr=0.1, epochs=500) that trains linear regression by BATCH gradient descent from w = zeros and b = 0: each epoch compute e = X @ w + b − y, then w -= lr × (2/n) × Xᵀe and b -= lr × (2/n) × sum(e). Return (w, b, history) where history is the list of MSE values, one per epoch, computed BEFORE each update.",
          starter: "import numpy as np\n\ndef gd_linear(X, y, lr=0.1, epochs=500):\n    pass\n",
          sample: "on standardised house features, w and b converge to the least-squares solution",
          tests: [
            {
              check: HOUSES + py`
from sklearn.linear_model import LinearRegression
Z = (X - X.mean(axis=0)) / X.std(axis=0)
w, b, hist = gd_linear(Z, y, lr=0.1, epochs=500)
ref = LinearRegression().fit(Z, y)
assert len(hist) == 500, "One cost per epoch. Got " + str(len(hist))
assert np.allclose(w, ref.coef_, atol=1e-3) and abs(b - ref.intercept_) < 1e-3, "Gradient descent should reach the least-squares solution. Got " + repr((w, b))
assert all(a >= c - 1e-9 for a, c in zip(hist, hist[1:])), "With a sensible learning rate the cost never increases."
assert abs(hist[0] - np.mean(y ** 2)) < 1e-6, "history[0] is the cost at w = 0, b = 0, before the first update."
w2, b2, h2 = gd_linear(Z, y, lr=1.5, epochs=30)
assert h2[-1] > h2[0], "With lr = 1.5 the updates overshoot and the cost grows."`,
            },
          ],
          solution: py`import numpy as np

def gd_linear(X, y, lr=0.1, epochs=500):
    n, d = X.shape
    w = np.zeros(d)
    b = 0.0
    history = []
    for _ in range(epochs):
        e = X @ w + b - y
        history.append(float(np.mean(e ** 2)))
        w = w - lr * (2 / n) * (X.T @ e)
        b = b - lr * (2 / n) * e.sum()
    return w, b, history
`,
          hint: "Inside the loop: e = X @ w + b - y; append np.mean(e ** 2); then w = w - lr * (2 / n) * (X.T @ e) and b = b - lr * (2 / n) * e.sum().",
          successMessage: "Your gradient descent found the same coefficients as the normal equation, and the cost fell every epoch. Too large a learning rate made it diverge, exactly as Module 3 warned.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 48 · 10.8 – 10.9
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ml-l48-regularization-metrics",
    moduleId: "ml-m10-regression",
    sectionId: SECTION_ID,
    order: 4,
    covers: ["10.8", "10.9"],
    title: "Ridge, Lasso and Regression Metrics",
    subtitle: "Penalising complexity, and measuring regression error honestly",
    estimatedMinutes: 40,
    intro:
      "Regularisation stops a linear model overfitting by penalising large coefficients; Lasso even switches useless features off. Then four metrics tell you, in different ways, how far off the predictions are.",

    atoms: [
      {
        id: "a-ml-regularization",
        title: "Regularization: Ridge and Lasso",
        explain:
          "REGULARISATION adds a penalty on the size of the coefficients to the cost, trading a little bias for a large cut in variance. RIDGE (L2) minimises MSE + α Σ wⱼ²: it shrinks every coefficient towards zero but rarely to exactly zero, and it stabilises models with correlated features. LASSO (L1) minimises MSE + α Σ |wⱼ|: it drives some coefficients to EXACTLY zero, performing automatic feature selection. ELASTIC NET mixes both. α (alpha) is the hyperparameter: 0 gives ordinary least squares, larger values shrink harder; choose it on validation data. Penalties treat every coefficient alike, so STANDARDISE features first, or the penalty punishes features merely for their units.",
        codeChallenge: {
          task:
            "Write compare_regularisation(X_train, y_train, alpha) that standardises the training features with StandardScaler, fits LinearRegression, Ridge(alpha=alpha) and Lasso(alpha=alpha) on them, and returns a dictionary {\"ols\": coefs, \"ridge\": coefs, \"lasso\": coefs, \"lasso_zeros\": number of Lasso coefficients exactly equal to 0}, with each coefs a NumPy array.",
          starter: "import numpy as np\nfrom sklearn.preprocessing import StandardScaler\nfrom sklearn.linear_model import LinearRegression, Ridge, Lasso\n\ndef compare_regularisation(X_train, y_train, alpha):\n    pass\n",
          sample: "with 3 real features and 7 noise features, Lasso zeroes out most of the noise",
          tests: [
            {
              check: HOUSES + py`
rng = np.random.default_rng(1)
Xn = np.hstack([X, rng.normal(size=(len(X), 7))])
r = compare_regularisation(Xn, y, alpha=1.0)
assert set(r) == {"ols", "ridge", "lasso", "lasso_zeros"}, "Return the four keys."
assert len(r["ols"]) == 10, "Ten coefficients each."
assert np.linalg.norm(r["ridge"]) < np.linalg.norm(r["ols"]), "Ridge shrinks the coefficient vector."
assert r["lasso_zeros"] >= 5 and r["lasso_zeros"] == int((r["lasso"] == 0).sum()), "Lasso should zero out most of the 7 noise features. Got " + str(r["lasso_zeros"])
assert (r["lasso"][:1] != 0).all(), "Lasso keeps the strong size feature."
assert compare_regularisation(Xn, y, alpha=1e-6)["lasso_zeros"] == 0, "With a tiny alpha, Lasso behaves like ordinary least squares."`,
            },
          ],
          solution: py`import numpy as np
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LinearRegression, Ridge, Lasso

def compare_regularisation(X_train, y_train, alpha):
    Z = StandardScaler().fit_transform(X_train)
    ols = LinearRegression().fit(Z, y_train).coef_
    ridge = Ridge(alpha=alpha).fit(Z, y_train).coef_
    lasso = Lasso(alpha=alpha).fit(Z, y_train).coef_
    return {"ols": ols, "ridge": ridge, "lasso": lasso, "lasso_zeros": int((lasso == 0).sum())}
`,
          hint: "Z = StandardScaler().fit_transform(X_train); fit each model on Z and take .coef_. Count zeros with int((lasso == 0).sum()).",
          successMessage: "Ridge shrank everything a little; Lasso set the noise features to exactly zero. Regularisation is the first defence against overfitting a linear model.",
        },
      },
      {
        id: "a-ml-regression-metrics",
        title: "Regression evaluation: MAE, MSE, RMSE and R²",
        explain:
          "MAE = (1/n) Σ |y − ŷ|: the average error in the target's units, easy to explain (\"off by ₦4.1m on average\"), robust to outliers. MSE = (1/n) Σ (y − ŷ)²: in squared units, punishes large errors. RMSE = √MSE: back in the target's units, still emphasising large errors; RMSE ≥ MAE, and a big gap means some predictions are badly wrong. R² = 1 − SS_res / SS_tot = 1 − Σ(y − ŷ)² / Σ(y − ȳ)²: the share of the target's variance explained, 1 is perfect, 0 is no better than predicting the mean, and it can be NEGATIVE on test data for a model worse than the mean. Report an error in units AND R², on the test set.",
        codeChallenge: {
          task:
            "Without sklearn.metrics, write regression_report(y_true, y_pred) that returns a dictionary {\"mae\", \"mse\", \"rmse\", \"r2\"} with each value rounded to 4 decimal places, using NumPy and the formulas above.",
          starter: "import numpy as np\n\ndef regression_report(y_true, y_pred):\n    pass\n",
          sample: "regression_report([3, 5, 7, 9], [2.5, 5, 8, 8]) → {\"mae\": 0.625, \"mse\": 0.5625, \"rmse\": 0.75, \"r2\": 0.8875}",
          tests: [
            {
              check: py`import numpy as np
from sklearn import metrics
r = regression_report([3, 5, 7, 9], [2.5, 5, 8, 8])
assert r == {"mae": 0.625, "mse": 0.5625, "rmse": 0.75, "r2": 0.8875}, "Got " + repr(r)
rng = np.random.default_rng(0)
yt = rng.normal(50, 10, 100)
yp = yt + rng.normal(0, 4, 100)
r = regression_report(yt, yp)
assert r["r2"] == round(metrics.r2_score(yt, yp), 4) and r["mae"] == round(metrics.mean_absolute_error(yt, yp), 4), "Must match scikit-learn's metrics."
assert r["rmse"] >= r["mae"], "RMSE is never smaller than MAE."
bad = regression_report([1, 2, 3], [3, 3, 0])
assert bad["r2"] < 0, "A model worse than predicting the mean has negative R². Got " + repr(bad["r2"])
assert "sklearn" not in source, "Use the formulas."`,
            },
          ],
          solution: py`import numpy as np

def regression_report(y_true, y_pred):
    y, p = np.asarray(y_true, float), np.asarray(y_pred, float)
    err = y - p
    mse = np.mean(err ** 2)
    r2 = 1 - np.sum(err ** 2) / np.sum((y - y.mean()) ** 2)
    return {
        "mae": round(float(np.mean(np.abs(err))), 4),
        "mse": round(float(mse), 4),
        "rmse": round(float(np.sqrt(mse)), 4),
        "r2": round(float(r2), 4),
    }
`,
          hint: "err = y - p. mae = mean(|err|); mse = mean(err²); rmse = sqrt(mse); r2 = 1 − sum(err²) / sum((y − mean(y))²).",
          successMessage: "Four numbers, four questions: typical error (MAE), penalty for big misses (MSE, RMSE), and variance explained (R²). A negative R² means the model is worse than guessing the mean.",
        },
      },
    ],

    task: {
      title: "Module 10 project: a house price prediction model",
      intro:
        "Build a house price model for a city you know (Lagos, Abuja or Port Harcourt listings, or a public housing dataset), from cleaned data to a documented, evaluated model.",
      prompts: [
        "Prepare the data with your Module 8 pipeline: split first, then impute, encode location, and scale.",
        "Fit simple linear regression on size alone, then multiple regression on all features, and interpret three coefficients in plain English.",
        "Try polynomial features of degree 2 and 3 and choose the degree on validation data.",
        "Train the same linear model by your own gradient descent and confirm it matches scikit-learn.",
        "Fit Ridge and Lasso across a range of alpha values; plot validation RMSE against alpha and report which features Lasso removed.",
        "Evaluate the final model once on the test set with MAE, RMSE and R², beside a DummyRegressor baseline.",
        "Consider a log transform of price (Module 6): does it improve the errors on expensive and cheap houses alike?",
      ],
      closing: "Logistic regression appeared here as a classifier in disguise. Module 11 covers classification fully: more algorithms, and the right way to evaluate them.",
    },

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
