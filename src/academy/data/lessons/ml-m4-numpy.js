/**
 * MACHINE LEARNING AND AI · MODULE 4 · DATA HANDLING WITH NUMPY
 *
 * Curriculum 4.1 – 4.10. NumPy arrays, shapes, indexing, vectorised
 * operations, broadcasting, statistics along axes, reshaping, combining and
 * random numbers. The learner wrote the loops by hand in Module 3; here the
 * same computations become one-line array expressions, and the challenges
 * forbid Python loops where the point is to think in whole arrays.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

export const SECTION_ID = "ml-s4-numpy";

const PY = "python";
const py = String.raw;

const NO_LOOPS = py`assert not uses("For") and not uses("While") and not uses("ListComp"), "Use whole-array NumPy operations, with no Python loops or comprehensions."`;

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 19 · 4.1 – 4.3
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ml-l19-numpy-arrays",
    moduleId: "ml-m4-numpy",
    sectionId: SECTION_ID,
    order: 1,
    covers: ["4.1", "4.2", "4.3"],
    title: "Numerical Computing and NumPy Arrays",
    subtitle: "Why arrays replace lists, how to create them, and what a shape is",
    estimatedMinutes: 32,
    intro:
      "Every ML library (pandas, scikit-learn, PyTorch) is built on NumPy's array. It stores numbers compactly and operates on all of them at once in compiled code, often a hundred times faster than a Python loop.",

    atoms: [
      {
        id: "a-ml-numerical-computing",
        title: "Introduction to numerical computing",
        explain:
          "A Python list stores pointers to separate number objects scattered in memory, and a loop over it runs the interpreter once per item. A NumPy ARRAY (ndarray) stores raw numbers of ONE type in a single contiguous block, and its operations are VECTORISED: written once for the whole array and executed by compiled C code. prices * 1.075 multiplies a million prices without a Python loop. The trade-offs: every element has the same DTYPE (float64, int64, bool…), and the size is fixed at creation. Numerical computing means exactly this style: describe the computation on whole arrays and let the library do the looping.",
        codeExercise: {
          language: PY,
          code: py`import numpy as np

prices_list = [1000, 2500, 400]
prices = np.array(prices_list)

print([p * 1.075 for p in prices_list])
print(prices * 1.075)
print(prices_list * 2)
print(prices * 2)
print(prices.dtype, type(prices).__name__)
`,
          question: "Compare a list and an array under the same operators. What does it print?",
          expectedOutput: "[1075.0, 2687.5, 430.0]\n[1075.  2687.5  430. ]\n[1000, 2500, 400, 1000, 2500, 400]\n[2000 5000  800]\nint64 ndarray",
          hint: "A list times 2 repeats the list. An array times 2 multiplies every element. NumPy prints floats like 1075. without a trailing zero.",
          successMessage: "Same operator, different meaning: * on an array is element-wise arithmetic. That difference is the whole point of NumPy.",
        },
      },
      {
        id: "a-ml-creating-arrays",
        title: "Creating NumPy arrays",
        explain:
          "np.array(list) converts a list (or a list of lists, for 2-D). Factory functions build arrays directly: np.zeros(shape) and np.ones(shape) fill with 0 or 1 (used to initialise weights and accumulators); np.full(shape, value); np.arange(start, stop, step) is range() for arrays; np.linspace(start, stop, num) gives num EVENLY spaced values INCLUDING stop (ideal for plotting a curve); np.eye(n) the identity. dtype= sets the type: np.zeros(3, dtype=int). np.arange with float steps can produce surprising lengths because of rounding, so prefer linspace for fractional spacing.",
        codeChallenge: {
          task:
            "Write make_arrays() that returns a tuple of four arrays: (1) the integers 0 to 9 with arange; (2) five evenly spaced values from 0 to 1 inclusive with linspace; (3) a 3 × 4 array of zeros; (4) a 2 × 2 array filled with 7 using full.",
          starter: "import numpy as np\n\ndef make_arrays():\n    pass\n",
          sample: "a, b, c, d = make_arrays(); b → array([0.  , 0.25, 0.5 , 0.75, 1.  ])",
          tests: [
            {
              check: py`import numpy as np
a, b, c, d = make_arrays()
assert isinstance(a, np.ndarray) and a.tolist() == list(range(10)), "The first array is 0 to 9. Got " + repr(a)
assert np.allclose(b, [0, 0.25, 0.5, 0.75, 1]), "linspace(0, 1, 5) includes both ends. Got " + repr(b)
assert c.shape == (3, 4) and not c.any(), "A 3 x 4 array of zeros. Got shape " + repr(getattr(c, "shape", None))
assert d.shape == (2, 2) and (d == 7).all(), "A 2 x 2 array of 7s. Got " + repr(d)
assert calls("arange") and calls("linspace") and calls("zeros") and calls("full"), "Use arange, linspace, zeros and full."`,
            },
          ],
          solution: py`import numpy as np

def make_arrays():
    return np.arange(10), np.linspace(0, 1, 5), np.zeros((3, 4)), np.full((2, 2), 7)
`,
          hint: "np.arange(10), np.linspace(0, 1, 5), np.zeros((3, 4)), np.full((2, 2), 7). Shapes are tuples.",
          successMessage: "Shapes are passed as tuples, (3, 4), everywhere in NumPy, and in PyTorch too.",
        },
      },
      {
        id: "a-ml-array-shapes",
        title: "Array dimensions and shapes",
        explain:
          "Every array has .ndim (the number of dimensions, or AXES), .shape (the size along each axis, as a tuple), .size (the total number of elements) and .dtype. A 1-D array of 5 values has shape (5,): note the comma, it is a one-element tuple. A table of 4 rows and 3 columns has shape (4, 3): axis 0 runs DOWN the rows, axis 1 runs ACROSS the columns. A batch of 10 grey 28 × 28 images has shape (10, 28, 28). A shape (5,) vector and a shape (5, 1) column are DIFFERENT arrays, a frequent source of bugs in ML code.",
        codeExercise: {
          language: PY,
          code: py`import numpy as np

v = np.array([1, 2, 3, 4, 5])
X = np.array([[3, 120, 2], [2, 85, 1], [4, 160, 3], [3, 110, 2]])
images = np.zeros((10, 28, 28))

print(v.ndim, v.shape, v.size)
print(X.ndim, X.shape, X.size)
print(images.ndim, images.shape, images.size)
print(v.reshape(5, 1).shape, X.dtype)
`,
          question: "Report ndim, shape and size for a vector, a table and a batch of images. What does it print?",
          expectedOutput: "1 (5,) 5\n2 (4, 3) 12\n3 (10, 28, 28) 7840\n(5, 1) int64",
          hint: "size is the product of the shape: 4 × 3 and 10 × 28 × 28.",
          successMessage: "Reading a shape tells you what an array holds: (10, 28, 28) is ten 28 × 28 images. You will read shapes constantly from here on.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 20 · 4.4 – 4.6
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ml-l20-indexing-broadcasting",
    moduleId: "ml-m4-numpy",
    sectionId: SECTION_ID,
    order: 2,
    covers: ["4.4", "4.5", "4.6"],
    title: "Indexing, Array Operations and Broadcasting",
    subtitle: "Selecting data, computing on all of it, and mixing shapes safely",
    estimatedMinutes: 38,
    intro:
      "Selecting the rows you need, computing on whole columns and combining arrays of different shapes are the three moves behind almost every line of data-preparation code.",

    atoms: [
      {
        id: "a-ml-indexing-slicing",
        title: "Indexing and slicing",
        explain:
          "1-D arrays index like lists: a[0], a[-1], a[2:5], a[::2]. 2-D arrays take one index per axis, separated by a comma: X[1, 2] is row 1, column 2; X[:, 0] is the WHOLE first column; X[0] or X[0, :] the first row; X[1:3, :2] a block. BOOLEAN INDEXING selects with a condition: scores[scores >= 50] keeps the passes, and conditions combine with & (and), | (or) and ~ (not), each part in parentheses. FANCY indexing takes a list of positions: a[[0, 3]]. A slice is a VIEW sharing memory with the original (changing it changes the original); boolean and fancy indexing return COPIES.",
        codeChallenge: {
          task:
            "X is a 2-D array of houses with columns [rooms, size_m2, price]. Write three functions, each a single NumPy expression without loops: prices(X) returns the price column; big_houses(X) returns the rows with size_m2 of at least 100; cheap_big(X) returns the PRICES of houses with at least 3 rooms AND a price below 80.",
          starter: "import numpy as np\n\ndef prices(X):\n    pass\n\ndef big_houses(X):\n    pass\n\ndef cheap_big(X):\n    pass\n",
          sample: "prices(X) → array([ 45.,  62.,  90., 118.,  75.])",
          tests: [
            {
              check: py`import numpy as np
X = np.array([[2, 60, 45.0], [3, 85, 62.0], [4, 120, 90.0], [5, 150, 118.0], [3, 105, 75.0]])
assert np.array_equal(prices(X), [45, 62, 90, 118, 75]), "The third column. Got " + repr(prices(X))
assert np.array_equal(big_houses(X), X[[2, 3, 4]]), "Rows with size of at least 100. Got " + repr(big_houses(X))
assert np.array_equal(cheap_big(X), [62, 75]), "At least 3 rooms and price below 80. Got " + repr(cheap_big(X))
` + NO_LOOPS,
            },
          ],
          solution: py`import numpy as np

def prices(X):
    return X[:, 2]

def big_houses(X):
    return X[X[:, 1] >= 100]

def cheap_big(X):
    return X[(X[:, 0] >= 3) & (X[:, 2] < 80), 2]
`,
          hint: "X[:, 2] is a column. X[mask] keeps rows where mask is True. Combine masks with & and wrap each comparison in parentheses: (X[:, 0] >= 3) & (X[:, 2] < 80).",
          successMessage: "Boolean masks are how you filter data in NumPy, and pandas uses the exact same syntax: df[df[\"size\"] >= 100].",
        },
      },
      {
        id: "a-ml-array-operations",
        title: "Array operations",
        explain:
          "Arithmetic between arrays of the same shape is ELEMENT-WISE: a + b, a − b, a * b, a / b, a ** 2. Comparisons are element-wise too and give boolean arrays: a > b. A boolean array can be counted (mask.sum() counts the Trues) and averaged (mask.mean() gives the fraction that is True), which is how accuracy is computed: (predictions == labels).mean(). Matrix multiplication uses @, never *. Aggregations such as .sum(), .min() and .max() reduce an array to a single number.",
        codeExercise: {
          language: PY,
          code: py`import numpy as np

y_true = np.array([1, 0, 1, 1, 0, 1])
y_pred = np.array([1, 0, 0, 1, 1, 1])

correct = y_true == y_pred
print(correct)
print(correct.sum(), correct.mean())

errors = np.array([2.0, -1.0, 0.5])
print(errors ** 2, (errors ** 2).mean())
`,
          question: "Compute accuracy and a mean squared error with array operations only. What does it print?",
          expectedOutput: "[ True  True False  True False  True]\n4 0.6666666666666666\n[4.   1.   0.25] 1.75",
          hint: "4 of 6 predictions match. The squared errors are 4, 1 and 0.25.",
          successMessage: "(y_true == y_pred).mean() is accuracy in one expression; (errors ** 2).mean() is the MSE. Both appear in every evaluation you will write.",
        },
      },
      {
        id: "a-ml-broadcasting",
        title: "Broadcasting",
        explain:
          "BROADCASTING lets NumPy combine arrays of DIFFERENT shapes by stretching the smaller one, without copying it. Shapes are compared from the RIGHT: two dimensions are compatible if they are equal or one of them is 1, and missing dimensions count as 1. So X of shape (100, 3) minus a row of column means of shape (3,) subtracts each column's mean from every row. A column of shape (100, 1) broadcasts across columns instead. (100, 3) and (100,) do NOT broadcast: compared from the right, 3 ≠ 100. This is how a whole dataset is STANDARDISED in one line: (X − X.mean(axis=0)) / X.std(axis=0).",
        codeChallenge: {
          task:
            "Write standardise(X) that returns (X − column means) / column standard deviations for a 2-D array, using axis=0 and broadcasting, with no loops. Then write add_bias(X, b) that adds the 1-D array b (one value per column) to every row, again by broadcasting.",
          starter: "import numpy as np\n\ndef standardise(X):\n    pass\n\ndef add_bias(X, b):\n    pass\n",
          sample: "standardise(np.array([[1., 10.], [3., 30.]])) → [[-1., -1.], [ 1.,  1.]]",
          tests: [
            {
              check: py`import numpy as np
X = np.array([[1.0, 10.0], [3.0, 30.0]])
Z = standardise(X)
assert np.allclose(Z, [[-1, -1], [1, 1]]), "Each column becomes mean 0, standard deviation 1. Got " + repr(Z)
rng = np.random.default_rng(0)
big = rng.normal(50, 12, size=(200, 4))
Z = standardise(big)
assert Z.shape == (200, 4), "The shape must not change."
assert np.allclose(Z.mean(axis=0), 0) and np.allclose(Z.std(axis=0), 1), "Every column of the result must have mean 0 and std 1."
assert np.array_equal(add_bias(np.zeros((3, 2)), np.array([5.0, -1.0])), [[5, -1], [5, -1], [5, -1]]), "b is added to every row."
` + NO_LOOPS,
            },
          ],
          solution: py`import numpy as np

def standardise(X):
    return (X - X.mean(axis=0)) / X.std(axis=0)

def add_bias(X, b):
    return X + b
`,
          hint: "X.mean(axis=0) has one value per column, shape (n_features,). X - that broadcasts across the rows. Divide by X.std(axis=0) the same way.",
          successMessage: "One line standardised 200 rows and 4 columns. scikit-learn's StandardScaler (Module 8) is this exact formula, with the means and stds remembered for new data.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 21 · 4.7 – 4.8
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ml-l21-maths-statistics",
    moduleId: "ml-m4-numpy",
    sectionId: SECTION_ID,
    order: 3,
    covers: ["4.7", "4.8"],
    title: "Mathematical and Statistical Functions",
    subtitle: "Universal functions, and summarising data along an axis",
    estimatedMinutes: 32,
    intro:
      "NumPy's mathematical functions apply to every element at once, and its statistical functions can summarise a whole table, each column, or each row, depending on one argument: axis.",

    atoms: [
      {
        id: "a-ml-math-operations",
        title: "Mathematical operations",
        explain:
          "UNIVERSAL FUNCTIONS (ufuncs) apply element-wise: np.sqrt, np.exp, np.log, np.abs, np.round, np.sin, np.maximum(a, b) (element-wise larger), np.clip(a, lo, hi) (limit to a range). np.exp and np.log appear in nearly every model: the sigmoid is 1 / (1 + np.exp(−z)) and the log loss uses np.log. Linear algebra lives in np.linalg and the @ operator: X @ w for predictions, np.linalg.norm for vector length, np.linalg.solve for systems of equations. np.log(0) gives −inf with a warning, which is why log-loss code clips probabilities away from 0 and 1 first.",
        codeExercise: {
          language: PY,
          code: py`import numpy as np

z = np.array([-2.0, 0.0, 2.0])
sigmoid = 1 / (1 + np.exp(-z))
print(np.round(sigmoid, 3))

relu = np.maximum(0, z)
print(relu)

p = np.clip(np.array([0.0, 0.5, 1.0]), 1e-7, 1 - 1e-7)
print(np.round(-np.log(p), 3))

X = np.array([[1.0, 2.0], [3.0, 4.0]])
w = np.array([0.5, -1.0])
print(X @ w, np.linalg.norm(w).round(4))
`,
          question: "Apply a sigmoid, a ReLU, a clipped log loss, a matrix-vector product and a norm. What does it print?",
          expectedOutput: "[0.119 0.5   0.881]\n[0. 0. 2.]\n[16.118  0.693  0.   ]\n[-1.5 -2.5] 1.118",
          hint: "ReLU keeps positives and zeroes negatives. Clipping turns 0 into 1e-7, and −ln(1e-7) ≈ 16.118. X @ w: 1×0.5 + 2×(−1) and 3×0.5 + 4×(−1).",
          successMessage: "Sigmoid and ReLU are the activation functions of Module 14; you just computed them for a whole array at once.",
        },
      },
      {
        id: "a-ml-statistical-functions",
        title: "Statistical functions and axes",
        explain:
          "np.mean, np.median, np.std, np.var, np.min, np.max, np.sum, np.percentile and np.corrcoef summarise data. With no axis they reduce the WHOLE array to one number. axis=0 reduces DOWN the rows, giving one result PER COLUMN (per feature); axis=1 reduces ACROSS the columns, giving one result PER ROW (per example). np.argmax and np.argmin return the POSITION of the largest or smallest value, which is how a classifier turns class scores into a predicted class: np.argmax(scores, axis=1). Remember: the axis you name is the one that disappears.",
        codeChallenge: {
          task:
            "scores is a 2-D array: one row per student, one column per subject. Write summary(scores) that returns a dictionary with: \"subject_means\" (mean of each column), \"student_totals\" (sum of each row), \"top_student\" (the row index of the highest total, as an int) and \"p90\" (the 90th percentile of all scores, as a float). No loops.",
          starter: "import numpy as np\n\ndef summary(scores):\n    pass\n",
          sample: "summary(np.array([[70, 80], [90, 60], [50, 75]]))[\"subject_means\"] → array([70.        , 71.66666667])",
          tests: [
            {
              check: py`import numpy as np
s = np.array([[70, 80, 65], [90, 60, 88], [50, 75, 70], [85, 95, 90]])
r = summary(s)
assert np.allclose(r["subject_means"], [73.75, 77.5, 78.25]), "Column means use axis=0. Got " + repr(r["subject_means"])
assert np.array_equal(r["student_totals"], [215, 238, 195, 270]), "Row totals use axis=1. Got " + repr(r["student_totals"])
assert r["top_student"] == 3 and isinstance(r["top_student"], int), "Student 3 has the highest total (270). Return a Python int. Got " + repr(r["top_student"])
assert abs(r["p90"] - np.percentile(s, 90)) < 1e-9, "The 90th percentile of all twelve scores. Got " + repr(r["p90"])
` + NO_LOOPS,
            },
          ],
          solution: py`import numpy as np

def summary(scores):
    totals = scores.sum(axis=1)
    return {
        "subject_means": scores.mean(axis=0),
        "student_totals": totals,
        "top_student": int(np.argmax(totals)),
        "p90": float(np.percentile(scores, 90)),
    }
`,
          hint: "scores.mean(axis=0) gives per-column means; scores.sum(axis=1) per-row totals; int(np.argmax(totals)) the best row; float(np.percentile(scores, 90)).",
          successMessage: "axis=0 for per-feature, axis=1 for per-example: you will write np.argmax(probabilities, axis=1) to turn a classifier's outputs into predictions.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 22 · 4.9 – 4.10
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ml-l22-reshape-random",
    moduleId: "ml-m4-numpy",
    sectionId: SECTION_ID,
    order: 4,
    covers: ["4.9", "4.10"],
    title: "Reshaping, Combining and Random Numbers",
    subtitle: "Changing an array's shape, joining arrays, and reproducible randomness",
    estimatedMinutes: 34,
    intro:
      "Images arrive flat and must be reshaped; features from two sources must be joined; data must be shuffled and split at random, yet reproducibly. This lesson covers all three.",

    atoms: [
      {
        id: "a-ml-reshape-combine",
        title: "Reshaping and combining arrays",
        explain:
          "reshape(new_shape) returns the same data in a new shape; the total size must stay the same, and −1 means \"work this dimension out\": a.reshape(−1, 1) turns a vector into a column, and images.reshape(len(images), −1) flattens each 28 × 28 image into 784 values. .ravel() or .flatten() make 1-D; .T transposes. To JOIN arrays: np.concatenate([a, b], axis=…), np.vstack (stack rows, axis 0) and np.hstack (side by side, axis 1); np.column_stack joins 1-D arrays as columns. A classic use: adding a column of ones to X so a linear model's bias can be learned as just another weight.",
        codeChallenge: {
          task:
            "Write three functions without loops: flatten_images(images) turns an array of shape (n, h, w) into shape (n, h × w); with_ones_column(X) returns X with a column of ones added on the LEFT; and stack_batches(a, b) stacks two 2-D arrays with the same number of columns on top of each other.",
          starter: "import numpy as np\n\ndef flatten_images(images):\n    pass\n\ndef with_ones_column(X):\n    pass\n\ndef stack_batches(a, b):\n    pass\n",
          sample: "with_ones_column(np.array([[3, 120], [2, 85]])) → [[1, 3, 120], [1, 2, 85]]",
          tests: [
            {
              check: py`import numpy as np
imgs = np.arange(2 * 28 * 28).reshape(2, 28, 28)
f = flatten_images(imgs)
assert f.shape == (2, 784), "(2, 28, 28) becomes (2, 784). Got " + repr(f.shape)
assert f[1, 0] == imgs[1, 0, 0] and f[0, 28] == imgs[0, 1, 0], "Each image's rows are laid end to end."
assert flatten_images(np.zeros((5, 3, 4))).shape == (5, 12), "It must work for any image size."
X = np.array([[3.0, 120.0], [2.0, 85.0]])
assert np.array_equal(with_ones_column(X), [[1, 3, 120], [1, 2, 85]]), "A column of ones on the left. Got " + repr(with_ones_column(X))
s = stack_batches(np.ones((2, 3)), np.zeros((4, 3)))
assert s.shape == (6, 3) and s[:2].all() and not s[2:].any(), "Two rows of ones on top of four rows of zeros. Got shape " + repr(s.shape)
` + NO_LOOPS,
            },
          ],
          solution: py`import numpy as np

def flatten_images(images):
    return images.reshape(len(images), -1)

def with_ones_column(X):
    return np.hstack([np.ones((len(X), 1)), X])

def stack_batches(a, b):
    return np.vstack([a, b])
`,
          hint: "images.reshape(len(images), -1). np.hstack([np.ones((len(X), 1)), X]). np.vstack([a, b]).",
          successMessage: "Flattening images to (n, 784) is exactly how a basic neural network is fed digit images in Module 14, and the ones column is the bias trick of Module 10.",
        },
      },
      {
        id: "a-ml-random-numbers",
        title: "Working with random numbers",
        explain:
          "ML uses randomness constantly: initialising weights, shuffling data, splitting train and test sets, sampling. Create a GENERATOR with a SEED: rng = np.random.default_rng(42). The same seed always produces the same sequence, which makes experiments REPRODUCIBLE (a theme of Module 21). Methods: rng.random(n) uniform in [0, 1); rng.integers(lo, hi, n); rng.normal(mean, std, n); rng.choice(a, size, replace=False); rng.permutation(n) a shuffled range, the standard way to shuffle rows: X[perm], y[perm] keeps features and labels aligned. Without a seed, results change on every run and nobody can reproduce your numbers.",
        codeChallenge: {
          task:
            "Write train_test_indices(n, test_fraction, seed) that returns a tuple (train_idx, test_idx): shuffle the indices 0 … n−1 with np.random.default_rng(seed).permutation(n); the FIRST round(n × test_fraction) shuffled indices are the test set, the rest the training set. Then write split(X, y, test_fraction=0.2, seed=0) that returns X_train, X_test, y_train, y_test using those indices.",
          starter: "import numpy as np\n\ndef train_test_indices(n, test_fraction, seed):\n    pass\n\ndef split(X, y, test_fraction=0.2, seed=0):\n    pass\n",
          sample: "X_train, X_test, y_train, y_test = split(X, y) → 80% / 20% of the rows, features and labels still aligned",
          tests: [
            {
              check: py`import numpy as np
tr, te = train_test_indices(10, 0.3, seed=1)
assert len(te) == 3 and len(tr) == 7, "30% of 10 is 3 test indices. Got " + str(len(te))
assert sorted(np.concatenate([tr, te]).tolist()) == list(range(10)), "Every index appears exactly once across the two sets."
assert np.array_equal(te, np.random.default_rng(1).permutation(10)[:3]), "The test set is the first 3 of the shuffled indices."
X = np.arange(50).reshape(25, 2)
y = np.arange(25) * 10
Xtr, Xte, ytr, yte = split(X, y, 0.2, seed=7)
assert len(Xte) == 5 and len(Xtr) == 20, "20% of 25 rows is 5. Got " + str(len(Xte))
assert np.array_equal(Xte[:, 0] // 2 * 10, yte), "Rows and labels must stay aligned after shuffling."
a = split(X, y, 0.2, seed=7)[1]
b = split(X, y, 0.2, seed=7)[1]
assert np.array_equal(a, b), "The same seed must give the same split."
assert calls("default_rng") and calls("permutation"), "Use default_rng(seed).permutation(n)."`,
            },
          ],
          solution: py`import numpy as np

def train_test_indices(n, test_fraction, seed):
    perm = np.random.default_rng(seed).permutation(n)
    n_test = round(n * test_fraction)
    return perm[n_test:], perm[:n_test]

def split(X, y, test_fraction=0.2, seed=0):
    train_idx, test_idx = train_test_indices(len(X), test_fraction, seed)
    return X[train_idx], X[test_idx], y[train_idx], y[test_idx]
`,
          hint: "perm = np.random.default_rng(seed).permutation(n); n_test = round(n * test_fraction); return perm[n_test:], perm[:n_test]. Then index X and y with the same index arrays.",
          successMessage: "You have written scikit-learn's train_test_split. Indexing X and y with the SAME permutation is what keeps every row matched with its label.",
        },
      },
    ],

    task: {
      title: "Module 4 assessment: a numerical data analysis tool",
      intro:
        "Build a NumPy tool that loads a numeric table (for example a CSV of monthly sales by branch, read with np.loadtxt or np.genfromtxt) and analyses it without Python loops.",
      prompts: [
        "Report the shape, dtype and size, and the mean, median, standard deviation, minimum and maximum of every column (axis=0).",
        "Find the row (month) and the column (branch) with the highest totals using argmax.",
        "Standardise every column with broadcasting and confirm each now has mean 0 and standard deviation 1.",
        "Select months where any branch fell below a threshold using boolean indexing.",
        "Compute the correlation matrix of the branches with np.corrcoef and name the two most correlated.",
        "Shuffle the rows reproducibly with a seeded generator and split them 80/20.",
        "Time a Python-loop version of one computation against the NumPy version and report the speed-up.",
      ],
      closing: "NumPy arrays hold numbers of one type and have no column names. Real business data has names, dates and text. Month 2 begins with pandas, built on NumPy, for exactly that.",
    },

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
