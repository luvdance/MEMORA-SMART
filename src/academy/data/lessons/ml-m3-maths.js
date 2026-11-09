/**
 * MACHINE LEARNING AND AI · MODULE 3 · MATHEMATICS FOR MACHINE LEARNING
 *
 * Curriculum 3.1 – 3.28: linear algebra (A), statistics (B), calculus (C)
 * and essential notation (D). The curriculum's instruction is that learners
 * must understand the mathematics behind the algorithms instead of treating
 * libraries as magic, so every concept is IMPLEMENTED by the learner in plain
 * Python first (matrix multiplication, variance, correlation, Bayes' theorem,
 * numerical derivatives, gradients, gradient descent, distances) and then
 * compared with the NumPy one-liner that does the same thing.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

export const SECTION_ID = "ml-s3-maths";

const PY = "python";
const py = String.raw;

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 10 · 3.1 – 3.2
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ml-l10-vectors-matrices",
    moduleId: "ml-m3-maths",
    sectionId: SECTION_ID,
    order: 1,
    covers: ["3.1", "3.2"],
    title: "Scalars, Vectors and Matrices",
    subtitle: "The objects every dataset and every model is made of",
    estimatedMinutes: 30,
    intro:
      "A dataset is a matrix. One customer is a vector. A learning rate is a scalar. Linear algebra is the language in which machine learning is written, and it starts with these three objects.",

    atoms: [
      {
        id: "a-ml-scalars-vectors-matrices",
        title: "Scalars, vectors and matrices",
        explain:
          "A SCALAR is a single number: a price, a learning rate, a temperature. A VECTOR is an ordered list of numbers, written x = [x₁, x₂, …, xₙ]; in ML one row of data, one customer described by n features, is a vector in n-dimensional space. A MATRIX is a rectangular grid of numbers with m rows and n columns, called an m × n matrix; a whole dataset of m examples with n features is an m × n matrix, conventionally named X. Entry Aᵢⱼ is in row i, column j. A TENSOR generalises this to more dimensions: a colour image is a 3-D tensor (height × width × 3 colour channels). In plain Python, a vector is a list and a matrix is a list of rows.",
        codeExercise: {
          language: PY,
          code: py`learning_rate = 0.01                      # scalar
house = [3, 120, 2]                        # vector: rooms, m², bathrooms
X = [[3, 120, 2],                          # matrix: 4 houses × 3 features
     [2, 85, 1],
     [4, 160, 3],
     [3, 110, 2]]

print(len(house))
print(len(X), "x", len(X[0]))
print(X[2][1], X[-1])
print([row[0] for row in X])
`,
          question: "What are the vector's length, the matrix's shape, entry X[2][1], the last row and the first column?",
          expectedOutput: "3\n4 x 3\n160 [3, 110, 2]\n[3, 2, 4, 3]",
          hint: "Indexes start at 0, so X[2] is the third row. A column is one entry from every row.",
          successMessage: "Rows are examples, columns are features. Getting a column means visiting every row, which is why NumPy stores matrices more cleverly.",
        },
      },
      {
        id: "a-ml-matrix-operations",
        title: "Matrix operations",
        explain:
          "Matrices of the SAME shape add and subtract ELEMENT-WISE: (A + B)ᵢⱼ = Aᵢⱼ + Bᵢⱼ. Multiplying by a scalar multiplies every entry: (cA)ᵢⱼ = c·Aᵢⱼ. The element-wise product (the HADAMARD product, A ⊙ B) multiplies matching entries. Adding matrices of different shapes is undefined. In ML these appear everywhere: updating every weight at once is W − η·G (a matrix minus a scalar times the gradient matrix), and combining two quarters of sales tables is A + B.",
        codeChallenge: {
          task:
            "Write three functions on matrices stored as lists of rows, without NumPy: mat_add(A, B) returns the element-wise sum and raises ValueError(\"shapes differ\") if the shapes differ; scalar_mul(c, A) multiplies every entry by c; hadamard(A, B) returns the element-wise product (same shape rule as mat_add).",
          starter: "def mat_add(A, B):\n    pass\n\ndef scalar_mul(c, A):\n    pass\n\ndef hadamard(A, B):\n    pass\n",
          sample: "mat_add([[1, 2], [3, 4]], [[10, 20], [30, 40]]) → [[11, 22], [33, 44]]",
          tests: [
            {
              check: py`A = [[1, 2], [3, 4]]
B = [[10, 20], [30, 40]]
assert mat_add(A, B) == [[11, 22], [33, 44]], "Got " + repr(mat_add(A, B))
assert scalar_mul(3, A) == [[3, 6], [9, 12]], "Got " + repr(scalar_mul(3, A))
assert hadamard(A, B) == [[10, 40], [90, 160]], "Got " + repr(hadamard(A, B))
assert mat_add([[1, 2, 3]], [[1, 1, 1]]) == [[2, 3, 4]], "A 1 x 3 matrix."
try:
    mat_add(A, [[1, 2, 3], [4, 5, 6]])
    assert False, "Adding a 2 x 2 and a 2 x 3 matrix must raise ValueError."
except ValueError:
    pass
try:
    hadamard(A, [[1, 2]])
    assert False, "hadamard must also raise ValueError on different shapes."
except ValueError:
    pass
assert A == [[1, 2], [3, 4]], "Do not change the inputs."
assert "numpy" not in source, "Write these with plain Python lists."`,
            },
          ],
          solution: py`def _same_shape(A, B):
    if len(A) != len(B) or any(len(a) != len(b) for a, b in zip(A, B)):
        raise ValueError("shapes differ")

def mat_add(A, B):
    _same_shape(A, B)
    return [[a + b for a, b in zip(ra, rb)] for ra, rb in zip(A, B)]

def scalar_mul(c, A):
    return [[c * a for a in row] for row in A]

def hadamard(A, B):
    _same_shape(A, B)
    return [[a * b for a, b in zip(ra, rb)] for ra, rb in zip(A, B)]
`,
          hint: "Check the number of rows and each row's length first. Then a nested comprehension: [[a + b for a, b in zip(ra, rb)] for ra, rb in zip(A, B)].",
          successMessage: "With NumPy, these are A + B, 3 * A and A * B, running in compiled code. Now you know exactly what those operators compute.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 11 · 3.3 – 3.5
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ml-l11-matrix-multiplication",
    moduleId: "ml-m3-maths",
    sectionId: SECTION_ID,
    order: 2,
    covers: ["3.3", "3.4", "3.5"],
    title: "Matrix Multiplication, Dot Products and Transposes",
    subtitle: "The single operation behind linear regression and every neural network",
    estimatedMinutes: 36,
    intro:
      "If you understand one operation in this module deeply, make it matrix multiplication. A linear model's predictions for a whole dataset are one matrix product, and a neural network is a chain of them.",

    atoms: [
      {
        id: "a-ml-dot-product",
        title: "Dot products",
        explain:
          "The DOT PRODUCT of two vectors of the same length multiplies matching entries and adds the results: a · b = a₁b₁ + a₂b₂ + … + aₙbₙ, a single number. It is a WEIGHTED SUM, which is exactly what a linear model computes: a house's predicted price is w · x + b, where x holds its features (rooms, size, bathrooms), w holds one learned weight per feature, and b is a bias. Geometrically, a · b = ‖a‖‖b‖cos θ, so the dot product also measures how much two vectors point the same way; Lesson 18 uses that for similarity.",
        codeExercise: {
          language: PY,
          code: py`x = [3, 120, 2]          # rooms, m², bathrooms
w = [5.0, 0.4, 3.0]      # learned weights (₦ millions per unit)
b = 2.0                  # bias

dot = sum(xi * wi for xi, wi in zip(x, w))
print(dot)
print(dot + b)
`,
          question: "The model predicts price = w · x + b. What are the dot product and the prediction?",
          expectedOutput: "69.0\n71.0",
          hint: "3 × 5 + 120 × 0.4 + 2 × 3 = 15 + 48 + 6.",
          successMessage: "One dot product plus a bias is a complete linear regression prediction. Training (Module 10) is the search for w and b.",
        },
      },
      {
        id: "a-ml-matrix-multiplication",
        title: "Matrix multiplication",
        explain:
          "The product C = AB of an m × n matrix A and an n × p matrix B is the m × p matrix whose entry Cᵢⱼ is the DOT PRODUCT of row i of A with column j of B. The INNER dimensions must match (A's columns = B's rows), and the result takes the OUTER dimensions. It is NOT element-wise, and it is not commutative: AB and BA are usually different, and often only one is defined. Computing it takes three nested loops, m·n·p multiplications. Its power for ML: if X is the dataset (m houses × n features) and w a column of n weights, Xw gives all m predictions in one operation.",
        codeChallenge: {
          task:
            "Write matmul(A, B) for matrices stored as lists of rows, without NumPy. Raise ValueError(\"inner dimensions differ\") if A's number of columns is not B's number of rows. Each entry C[i][j] is the dot product of row i of A and column j of B.",
          starter: "def matmul(A, B):\n    pass\n",
          sample: "matmul([[1, 2], [3, 4]], [[5, 6], [7, 8]]) → [[19, 22], [43, 50]]",
          tests: [
            {
              check: py`assert matmul([[1, 2], [3, 4]], [[5, 6], [7, 8]]) == [[19, 22], [43, 50]], "Got " + repr(matmul([[1, 2], [3, 4]], [[5, 6], [7, 8]]))
A = [[1, 2, 3], [4, 5, 6]]
B = [[7, 8], [9, 10], [11, 12]]
assert matmul(A, B) == [[58, 64], [139, 154]], "(2 x 3) times (3 x 2) gives 2 x 2. Got " + repr(matmul(A, B))
assert matmul(B, A) == [[39, 54, 69], [49, 68, 87], [59, 82, 105]], "(3 x 2) times (2 x 3) gives 3 x 3: AB is not BA."
X = [[3, 120, 2], [2, 85, 1]]
w = [[5.0], [0.4], [3.0]]
assert matmul(X, w) == [[69.0], [47.0]], "All predictions at once: X times the weight column. Got " + repr(matmul(X, w))
try:
    matmul([[1, 2]], [[1, 2]])
    assert False, "(1 x 2) times (1 x 2) is undefined: raise ValueError."
except ValueError:
    pass
assert "numpy" not in source and "@" not in source, "Write the three loops yourself."`,
            },
          ],
          solution: py`def matmul(A, B):
    n = len(A[0])
    if n != len(B):
        raise ValueError("inner dimensions differ")
    p = len(B[0])
    return [[sum(A[i][k] * B[k][j] for k in range(n)) for j in range(p)] for i in range(len(A))]
`,
          hint: "C has len(A) rows and len(B[0]) columns. C[i][j] = sum(A[i][k] * B[k][j] for k in range(len(B))).",
          successMessage: "This triple loop is the most executed computation in all of machine learning. GPUs exist largely to do it in parallel.",
        },
      },
      {
        id: "a-ml-transpose",
        title: "Transpose of a matrix",
        explain:
          "The TRANSPOSE Aᵀ flips a matrix over its diagonal: rows become columns, so (Aᵀ)ᵢⱼ = Aⱼᵢ and an m × n matrix becomes n × m. Transposes appear constantly in ML formulas because they make shapes line up: the least-squares solution of linear regression is w = (XᵀX)⁻¹Xᵀy, and backpropagation multiplies by transposed weight matrices. A useful identity: (AB)ᵀ = BᵀAᵀ, the order reverses. In Python, zip(*A) transposes a list of rows in one step.",
        codeChallenge: {
          task:
            "Write transpose(A) that returns the transpose of a matrix stored as a list of rows, as a list of lists (not tuples). Then write gram(X) that returns XᵀX by calling your transpose and the matmul function provided in the starter.",
          starter: "def matmul(A, B):\n    return [[sum(a * b for a, b in zip(row, col)) for col in zip(*B)] for row in A]\n\ndef transpose(A):\n    pass\n\ndef gram(X):\n    pass\n",
          sample: "transpose([[1, 2, 3], [4, 5, 6]]) → [[1, 4], [2, 5], [3, 6]]",
          tests: [
            {
              check: py`assert transpose([[1, 2, 3], [4, 5, 6]]) == [[1, 4], [2, 5], [3, 6]], "Got " + repr(transpose([[1, 2, 3], [4, 5, 6]]))
assert transpose([[7]]) == [[7]], "A 1 x 1 matrix is its own transpose."
assert transpose(transpose([[1, 2], [3, 4], [5, 6]])) == [[1, 2], [3, 4], [5, 6]], "Transposing twice gives the original."
assert all(isinstance(r, list) for r in transpose([[1, 2], [3, 4]])), "Return lists, not tuples."
X = [[1, 2], [3, 4], [5, 6]]
assert gram(X) == [[35, 44], [44, 56]], "XᵀX for this 3 x 2 X is 2 x 2. Got " + repr(gram(X))`,
            },
          ],
          solution: py`def matmul(A, B):
    return [[sum(a * b for a, b in zip(row, col)) for col in zip(*B)] for row in A]

def transpose(A):
    return [list(col) for col in zip(*A)]

def gram(X):
    return matmul(transpose(X), X)
`,
          hint: "zip(*A) yields the columns of A as tuples; convert each with list(). gram is matmul(transpose(X), X).",
          successMessage: "XᵀX is always square and symmetric: n × n for n features. It is the heart of the closed-form linear regression in Module 10.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 12 · 3.6 – 3.8
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ml-l12-identity-dimensions-eigen",
    moduleId: "ml-m3-maths",
    sectionId: SECTION_ID,
    order: 3,
    covers: ["3.6", "3.7", "3.8"],
    title: "Identity Matrices, Dimensions and Eigenvectors",
    subtitle: "Shapes that must line up, and the directions a matrix only stretches",
    estimatedMinutes: 34,
    intro:
      "Most errors in ML code are shape errors. This lesson makes shapes second nature, then introduces eigenvectors, the idea behind PCA in Module 12.",

    atoms: [
      {
        id: "a-ml-identity",
        title: "Identity matrices",
        explain:
          "The IDENTITY matrix I is square, with 1s on the main diagonal and 0s elsewhere. It is the matrix version of the number 1: AI = IA = A for any compatible A. The INVERSE of a square matrix A, written A⁻¹, is the matrix with AA⁻¹ = I, the matrix version of division; not every matrix has one (a SINGULAR matrix does not, just as 0 has no reciprocal). NumPy builds identities with np.eye(n), multiplies matrices with the @ operator and inverts with np.linalg.inv. In practice ML code avoids explicit inverses, which are slow and numerically fragile, and uses np.linalg.solve instead.",
        codeExercise: {
          language: PY,
          code: py`import numpy as np

A = np.array([[2.0, 1.0], [1.0, 3.0]])
I = np.eye(2)
print(I)
print(np.array_equal(A @ I, A))
A_inv = np.linalg.inv(A)
print(np.allclose(A @ A_inv, I))
print(np.round(A_inv, 2))
`,
          question: "What do I, A @ I == A, whether A @ A⁻¹ is (close to) I, and A⁻¹ rounded to 2 places print?",
          expectedOutput: "[[1. 0.]\n [0. 1.]]\nTrue\nTrue\n[[ 0.6 -0.2]\n [-0.2  0.4]]",
          hint: "For a 2 × 2 matrix [[a, b], [c, d]], the inverse is [[d, −b], [−c, a]] / (ad − bc). Here ad − bc = 5.",
          successMessage: "A times its inverse is the identity, up to tiny floating-point errors: that is why you compare floats with np.allclose, never ==.",
        },
      },
      {
        id: "a-ml-dimensions",
        title: "Understanding dimensions",
        explain:
          "The SHAPE of an array lists its size along each dimension: a vector of 3 features has shape (3,), a dataset of 500 rows and 3 features (500, 3), a batch of 32 colour images of 28 × 28 pixels (32, 28, 28, 3). The rule for a matrix product (m, n) @ (n, p) → (m, p) is checked BEFORE any arithmetic: the inner numbers must match. Thinking in shapes catches bugs instantly: if X is (500, 3) and the weights w are (3,), then X @ w is (500,), one prediction per row. If you accidentally build w as (500,), the product fails, and the shape tells you why.",
        codeChallenge: {
          task:
            "Write matmul_shape(a, b) that takes two shapes as tuples, each of length 1 or 2, and returns the shape of the product a @ b, or None if it is undefined. Rules: (m, n) @ (n, p) → (m, p); (m, n) @ (n,) → (m,); (n,) @ (n, p) → (p,); (n,) @ (n,) → () (a scalar, the dot product).",
          starter: "def matmul_shape(a, b):\n    pass\n",
          sample: "matmul_shape((500, 3), (3,)) → (500,); matmul_shape((2, 3), (2, 3)) → None",
          tests: [
            {
              check: py`cases = [
    (((500, 3), (3,)), (500,)),
    (((2, 3), (3, 4)), (2, 4)),
    (((2, 3), (2, 3)), None),
    (((3,), (3, 7)), (7,)),
    (((4,), (4,)), ()),
    (((4,), (5,)), None),
    (((32, 784), (784, 128)), (32, 128)),
    (((32, 128), (784, 128)), None),
]
for (a, b), want in cases:
    got = matmul_shape(a, b)
    assert got == want, "matmul_shape(" + repr(a) + ", " + repr(b) + ") should be " + repr(want) + ". Got " + repr(got)`,
            },
          ],
          solution: py`def matmul_shape(a, b):
    inner_a = a[-1]
    inner_b = b[0]
    if inner_a != inner_b:
        return None
    outer = a[:-1] + b[1:]
    return tuple(outer)
`,
          hint: "The inner sizes are a[-1] and b[0]. If they match, the result is everything else: a[:-1] + b[1:].",
          successMessage: "(32, 784) @ (784, 128) → (32, 128) is a neural network layer: 32 images of 784 pixels, mapped to 128 hidden units. You will meet that exact shape in Module 14.",
        },
      },
      {
        id: "a-ml-eigen",
        title: "Introduction to eigenvalues and eigenvectors",
        explain:
          "Multiplying a vector by a matrix usually changes its direction. An EIGENVECTOR v of a square matrix A is a special direction that A only STRETCHES: Av = λv, where the number λ is the EIGENVALUE (how much it stretches). A 2 × 2 symmetric matrix has two perpendicular eigenvectors. Why ML cares: the eigenvectors of a dataset's COVARIANCE matrix are the directions in which the data varies most, and the eigenvalues say how much variance lies along each. Principal Component Analysis (Module 12) keeps the top few eigenvectors and drops the rest, compressing data with the least information lost.",
        codeExercise: {
          language: PY,
          code: py`import numpy as np

A = np.array([[2.0, 1.0], [1.0, 2.0]])
values, vectors = np.linalg.eigh(A)      # for symmetric matrices, ascending order
print(np.round(values, 4))

v = vectors[:, 1]                        # eigenvector of the largest eigenvalue
print(np.round(np.abs(v), 4))
print(np.allclose(A @ v, values[1] * v))
`,
          question: "eigh returns the eigenvalues in ascending order and the eigenvectors as columns. What does it print?",
          expectedOutput: "[1. 3.]\n[0.7071 0.7071]\nTrue",
          hint: "Try v = [1, 1]: A @ v = [3, 3] = 3v. Try v = [1, −1]: A @ v = [1, −1]. Normalised, [1, 1] becomes [0.7071, 0.7071].",
          successMessage: "A stretches the diagonal direction [1, 1] by 3 and the direction [1, −1] by 1. PCA would call [1, 1] the first principal component.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 13 · 3.9 – 3.11
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ml-l13-averages-and-spread",
    moduleId: "ml-m3-maths",
    sectionId: SECTION_ID,
    order: 4,
    covers: ["3.9", "3.10", "3.11"],
    title: "Averages, Spread, Populations and Samples",
    subtitle: "Mean, median, mode, variance and standard deviation, written by hand",
    estimatedMinutes: 34,
    intro:
      "Statistics summarises data. Before any model, you describe a column by its centre and its spread, and you must know whether your numbers describe everyone or only the people you happened to measure.",

    atoms: [
      {
        id: "a-ml-mean-median-mode",
        title: "Mean, median and mode",
        explain:
          "The MEAN (average) is the sum divided by the count: x̄ = (1/n) Σ xᵢ. The MEDIAN is the middle value of the sorted data (the average of the two middle values when n is even). The MODE is the most frequent value. They answer different questions. Salaries are SKEWED: a few very high earners pull the mean far above what a typical person earns, while the median is unaffected by extremes, so house prices and incomes are reported as medians. The mode is the only one that works for categories (the most common payment method).",
        codeChallenge: {
          task:
            "Without the statistics module or NumPy, write mean(xs), median(xs) and mode(xs). median must handle even-length lists by averaging the two middle values; mode returns the most frequent value, and on a tie, the one that appears FIRST in the list.",
          starter: "def mean(xs):\n    pass\n\ndef median(xs):\n    pass\n\ndef mode(xs):\n    pass\n",
          sample: "salaries = [80, 95, 100, 110, 2000]; mean → 477.0; median → 100",
          tests: [
            {
              check: py`salaries = [80, 95, 100, 110, 2000]
assert mean(salaries) == 477, "Sum 2385 / 5 = 477. Got " + repr(mean(salaries))
assert median(salaries) == 100, "The middle of 5 sorted values. Got " + repr(median(salaries))
assert median([7, 1, 3, 5]) == 4, "Even length: average of 3 and 5. Got " + repr(median([7, 1, 3, 5]))
data = [3, 1, 2]
median(data)
assert data == [3, 1, 2], "Do not sort the caller's list in place."
assert mode(["card", "cash", "transfer", "cash", "card", "cash"]) == "cash", "cash appears 3 times."
assert mode([2, 1, 1, 2]) == 2, "1 and 2 tie: return the one appearing first (2)."
assert "statistics" not in source and "numpy" not in source, "Write them yourself."`,
            },
          ],
          solution: py`def mean(xs):
    return sum(xs) / len(xs)

def median(xs):
    s = sorted(xs)
    n = len(s)
    mid = n // 2
    if n % 2:
        return s[mid]
    return (s[mid - 1] + s[mid]) / 2

def mode(xs):
    counts = {}
    for x in xs:
        counts[x] = counts.get(x, 0) + 1
    best = max(counts.values())
    for x in xs:
        if counts[x] == best:
            return x
`,
          hint: "median: s = sorted(xs) makes a copy; mid = len(s) // 2. mode: count with a dictionary, then walk xs in order and return the first value whose count is the maximum.",
          successMessage: "One salary of 2,000 lifted the mean to 477 while the median stayed at 100. That gap is how you detect skew at a glance.",
        },
      },
      {
        id: "a-ml-variance-std",
        title: "Variance and standard deviation",
        explain:
          "SPREAD measures how far values typically lie from the mean. The VARIANCE is the average squared deviation: σ² = (1/n) Σ (xᵢ − x̄)². Squaring makes every deviation positive and punishes large ones. Its units are squared (naira²), so we take its square root, the STANDARD DEVIATION σ, which is back in the original units. Two classes can both average 60, one with scores 58–62 (σ ≈ 1.4) and one 20–100 (σ ≈ 30); the mean alone hides that. Standardisation in Module 8 divides by σ, and the mean squared error you will minimise in Module 10 is a variance of the errors.",
        codeChallenge: {
          task:
            "Write variance(xs, sample=False) and std(xs, sample=False). With sample=False divide the sum of squared deviations by n (population); with sample=True divide by n − 1 (sample). std is the square root of variance. Return unrounded floats; do not use the statistics module or NumPy.",
          starter: "def variance(xs, sample=False):\n    pass\n\ndef std(xs, sample=False):\n    pass\n",
          sample: "variance([2, 4, 4, 4, 5, 5, 7, 9]) → 4.0; std(...) → 2.0",
          tests: [
            {
              check: py`xs = [2, 4, 4, 4, 5, 5, 7, 9]
assert variance(xs) == 4.0, "Population variance is 32 / 8 = 4.0. Got " + repr(variance(xs))
assert std(xs) == 2.0, "Population std is 2.0. Got " + repr(std(xs))
assert abs(variance(xs, sample=True) - 32 / 7) < 1e-12, "Sample variance divides by n - 1 = 7. Got " + repr(variance(xs, sample=True))
assert abs(std([58, 60, 62]) - (8 / 3) ** 0.5) < 1e-12, "std of 58, 60, 62. Got " + repr(std([58, 60, 62]))
assert "statistics" not in source and "numpy" not in source, "Write them yourself."`,
            },
          ],
          solution: py`def variance(xs, sample=False):
    n = len(xs)
    m = sum(xs) / n
    squares = sum((x - m) ** 2 for x in xs)
    return squares / (n - 1 if sample else n)

def std(xs, sample=False):
    return variance(xs, sample) ** 0.5
`,
          hint: "m = sum(xs) / n; squares = sum((x - m) ** 2 for x in xs); divide by n - 1 if sample else n. std is variance(...) ** 0.5.",
          successMessage: "The two divisors give different answers on small data and nearly identical answers on large data. The next atom explains which to use.",
        },
      },
      {
        id: "a-ml-population-sample",
        title: "Population vs sample",
        explain:
          "The POPULATION is every member of the group you care about: every customer, every transaction. A SAMPLE is the subset you actually measured. A population's mean and variance (μ, σ²) are fixed facts; a sample's (x̄, s²) are ESTIMATES of them that vary from sample to sample. Deviations measured from the sample's own mean are systematically a little too small (the sample mean is, by construction, as close to the data as possible), so the sample variance divides by n − 1 instead of n to correct the bias: BESSEL'S CORRECTION. NumPy's np.var defaults to the population formula (ddof=0); pandas' .var() defaults to the sample formula (ddof=1). Machine learning is built on samples: the training set is a sample of the world the model will face.",
        codeExercise: {
          language: PY,
          code: py`import numpy as np
import pandas as pd

scores = [60, 70, 80]
print(np.var(scores), np.var(scores, ddof=1))
print(pd.Series(scores).var())

big = list(range(1, 10001))
print(round(np.var(big) / np.var(big, ddof=1), 4))
`,
          question: "Compare NumPy's and pandas' defaults, and the two formulas on 10,000 values. What does it print?",
          expectedOutput: "66.66666666666667 100.0\n100.0\n0.9999",
          hint: "The squared deviations are 100, 0, 100. Divide by 3, then by 2. On large n, n − 1 and n are nearly equal: (n − 1) / n.",
          successMessage: "Same data, different answers, because the libraries' defaults differ. Always know which variance a library computes; on big data the difference vanishes.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 14 · 3.12 – 3.14
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ml-l14-distributions-correlation",
    moduleId: "ml-m3-maths",
    sectionId: SECTION_ID,
    order: 5,
    covers: ["3.12", "3.13", "3.14"],
    title: "Distributions, the Normal Curve and Correlation",
    subtitle: "How values are spread, and how two variables move together",
    estimatedMinutes: 36,
    intro:
      "A distribution describes which values are likely. Correlation describes whether two variables rise and fall together. Both are the first things you check about any dataset.",

    atoms: [
      {
        id: "a-ml-probability-distributions",
        title: "Probability distributions",
        explain:
          "A PROBABILITY DISTRIBUTION assigns a probability to every possible outcome, and the probabilities sum to 1. A DISCRETE distribution has countable outcomes: a fair die gives 1 to 6 with probability 1/6 each (UNIFORM); the number of successes in n yes/no trials is BINOMIAL. A CONTINUOUS distribution (height, price) gives probabilities to RANGES, through a density curve whose area is 1. Classifiers output distributions: a spam filter saying [0.92 spam, 0.08 not spam] is giving a probability distribution over two classes. The program below builds the exact distribution of the total of two dice by listing every equally likely outcome.",
        codeExercise: {
          language: PY,
          code: py`from fractions import Fraction

dist = {}
for a in range(1, 7):
    for b in range(1, 7):
        dist[a + b] = dist.get(a + b, 0) + Fraction(1, 36)

print(dist[7], dist[2], dist[12])
print(max(dist, key=dist.get))
print(sum(dist.values()))
print(sum(p for total, p in dist.items() if total >= 10))
`,
          question: "This builds the distribution of the sum of two dice. What does it print?",
          expectedOutput: "1/6 1/36 1/36\n7\n1\n1/6",
          hint: "Six of the 36 outcomes sum to 7. Totals of 10 or more: 3 ways for 10, 2 for 11, 1 for 12.",
          successMessage: "Probabilities of every outcome, summing to exactly 1: that is a distribution. A classifier's softmax output has the same property.",
        },
      },
      {
        id: "a-ml-normal-distribution",
        title: "The normal distribution",
        explain:
          "The NORMAL (Gaussian) distribution is the symmetric bell curve described by its mean μ and standard deviation σ. Heights, measurement errors and exam scores in large classes are approximately normal, because the CENTRAL LIMIT THEOREM says sums of many small independent effects tend towards it. The 68–95–99.7 RULE: about 68% of values lie within 1σ of the mean, 95% within 2σ, 99.7% within 3σ. A Z-SCORE z = (x − μ) / σ says how many standard deviations a value lies from the mean; |z| > 3 is a common outlier rule (Module 6), and standardising features into z-scores is a standard preprocessing step (Module 8).",
        codeExercise: {
          language: PY,
          code: py`from statistics import NormalDist

scores = NormalDist(mu=60, sigma=10)
within_1 = scores.cdf(70) - scores.cdf(50)
within_2 = scores.cdf(80) - scores.cdf(40)
print(round(within_1, 3), round(within_2, 3))

z = (85 - 60) / 10
print(z, round(1 - scores.cdf(85), 4))
`,
          question: "Exam scores are normal with mean 60 and standard deviation 10. What fractions fall within 1σ and 2σ, and how rare is a score of 85?",
          expectedOutput: "0.683 0.954\n2.5 0.0062",
          hint: "cdf(x) is the probability of scoring at most x. 85 is 2.5 standard deviations above the mean.",
          successMessage: "68% and 95%, as the rule says, and a score of 85 beats about 99.4% of the class.",
        },
      },
      {
        id: "a-ml-correlation-covariance",
        title: "Correlation and covariance",
        explain:
          "COVARIANCE measures whether two variables move together: cov(x, y) = (1/n) Σ (xᵢ − x̄)(yᵢ − ȳ). When x is above its mean at the same time as y is above its mean, the products are positive. Its size depends on the units, so it is hard to read. PEARSON CORRELATION divides out the spreads: r = cov(x, y) / (σₓσᵧ), always between −1 and +1. r = +1 is a perfect rising straight line, −1 a perfect falling one, 0 no LINEAR relationship (there may still be a curved one). Correlation is not causation: ice-cream sales and drownings are correlated because both rise in hot weather.",
        codeChallenge: {
          task:
            "Without NumPy or the statistics module, write covariance(xs, ys) using the population formula (divide by n) and pearson(xs, ys) = covariance / (σx × σy), with population standard deviations. Round pearson's result to 4 decimal places.",
          starter: "def covariance(xs, ys):\n    pass\n\ndef pearson(xs, ys):\n    pass\n",
          sample: "covariance([1, 2, 3], [2, 4, 6]) → 1.3333…; pearson([1, 2, 3], [2, 4, 6]) → 1.0",
          tests: [
            {
              check: py`assert abs(covariance([1, 2, 3], [2, 4, 6]) - 4 / 3) < 1e-12, "Got " + repr(covariance([1, 2, 3], [2, 4, 6]))
assert pearson([1, 2, 3], [2, 4, 6]) == 1.0, "A perfect rising line. Got " + repr(pearson([1, 2, 3], [2, 4, 6]))
assert pearson([1, 2, 3], [9, 6, 3]) == -1.0, "A perfect falling line. Got " + repr(pearson([1, 2, 3], [9, 6, 3]))
hours = [2, 4, 5, 7, 9]
scores = [50, 62, 61, 75, 84]
assert pearson(hours, scores) == 0.9868, "Study hours and scores. Got " + repr(pearson(hours, scores))
assert pearson([-2, -1, 0, 1, 2], [4, 1, 0, 1, 4]) == 0.0, "A perfect U-shape has zero LINEAR correlation."
assert "numpy" not in source and "statistics" not in source, "Write them yourself."`,
            },
          ],
          solution: py`def covariance(xs, ys):
    n = len(xs)
    mx, my = sum(xs) / n, sum(ys) / n
    return sum((x - mx) * (y - my) for x, y in zip(xs, ys)) / n

def pearson(xs, ys):
    sx = covariance(xs, xs) ** 0.5
    sy = covariance(ys, ys) ** 0.5
    return round(covariance(xs, ys) / (sx * sy), 4)
`,
          hint: "A variable's covariance with itself is its variance, so σx = covariance(xs, xs) ** 0.5.",
          successMessage: "r = 0 on a perfect U-shape is the classic warning: correlation only detects straight-line relationships. Always plot your data (Module 7).",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 15 · 3.15 – 3.17
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ml-l15-probability-bayes-sampling",
    moduleId: "ml-m3-maths",
    sectionId: SECTION_ID,
    order: 6,
    covers: ["3.15", "3.16", "3.17"],
    title: "Conditional Probability, Bayes' Theorem and Sampling",
    subtitle: "Updating beliefs with evidence, and choosing data fairly",
    estimatedMinutes: 36,
    intro:
      "A medical test is 95% accurate and says you have a disease. The chance you actually have it may be far below 95%. Bayes' theorem explains why, and it underlies a whole family of classifiers.",

    atoms: [
      {
        id: "a-ml-conditional-probability",
        title: "Conditional probability",
        explain:
          "P(A | B), read \"the probability of A GIVEN B\", is the probability of A when we already know B happened: P(A | B) = P(A and B) / P(B). With a table of counts it is simply: among the rows where B is true, what fraction also have A? P(default | unemployed) can be very different from P(default). Two events are INDEPENDENT when knowing one tells you nothing about the other: P(A | B) = P(A). Classification is conditional probability: a churn model estimates P(churn | this customer's features).",
        codeExercise: {
          language: PY,
          code: py`loans = (
    [("employed", "repaid")] * 720 + [("employed", "default")] * 80
    + [("unemployed", "repaid")] * 120 + [("unemployed", "default")] * 80
)

def p(event, given=lambda r: True):
    pool = [r for r in loans if given(r)]
    return sum(event(r) for r in pool) / len(pool)

default = lambda r: r[1] == "default"
print(p(default))
print(p(default, given=lambda r: r[0] == "employed"))
print(p(default, given=lambda r: r[0] == "unemployed"))
`,
          question: "1,000 past loans. What are P(default), P(default | employed) and P(default | unemployed)?",
          expectedOutput: "0.16\n0.1\n0.4",
          hint: "160 defaults in 1,000. 80 of the 800 employed. 80 of the 200 unemployed.",
          successMessage: "Knowing employment status changes the default probability from 16% to 10% or 40%: employment is a useful feature, because the events are not independent.",
        },
      },
      {
        id: "a-ml-bayes",
        title: "Bayes' theorem",
        explain:
          "BAYES' THEOREM turns a conditional probability around: P(A | B) = P(B | A) · P(A) / P(B). In words, the POSTERIOR (belief after evidence) is the LIKELIHOOD (how expected the evidence is if A is true) times the PRIOR (belief before), divided by the overall probability of the evidence. P(B) is found by adding up every way B can happen: P(B) = P(B | A)P(A) + P(B | not A)P(not A). The surprising lesson: when the prior is small (a rare disease, a rare fraud), even an accurate test produces mostly FALSE POSITIVES. The Naive Bayes classifier (Module 11) is this theorem applied to every feature.",
        codeChallenge: {
          task:
            "Write posterior(prior, sensitivity, false_positive_rate) that returns P(condition | positive test), rounded to 4 decimal places. sensitivity is P(positive | condition); false_positive_rate is P(positive | no condition). Use Bayes' theorem with P(positive) = sensitivity × prior + false_positive_rate × (1 − prior).",
          starter: "def posterior(prior, sensitivity, false_positive_rate):\n    pass\n",
          sample: "posterior(0.01, 0.95, 0.05) → 0.161",
          tests: [
            {
              check: py`assert posterior(0.01, 0.95, 0.05) == 0.161, "A 95%-sensitive test for a 1-in-100 condition: only 16.1% of positives are real. Got " + repr(posterior(0.01, 0.95, 0.05))
assert posterior(0.3, 0.95, 0.05) == 0.8906, "With a 30% prior (malaria season in a high-risk area) a positive is far more convincing. Got " + repr(posterior(0.3, 0.95, 0.05))
assert posterior(0.5, 0.5, 0.5) == 0.5, "A test that says positive half the time regardless tells you nothing."
assert posterior(0.002, 0.99, 0.01) == 0.1656, "Fraud at 0.2% with a 99% detector. Got " + repr(posterior(0.002, 0.99, 0.01))`,
            },
          ],
          solution: py`def posterior(prior, sensitivity, false_positive_rate):
    evidence = sensitivity * prior + false_positive_rate * (1 - prior)
    return round(sensitivity * prior / evidence, 4)
`,
          hint: "evidence = sensitivity * prior + false_positive_rate * (1 - prior). The posterior is sensitivity * prior / evidence.",
          successMessage: "A 99% fraud detector on 0.2% fraud flags 6 innocent customers for every real fraudster. This is why fraud teams care about precision, which Module 11 measures.",
        },
      },
      {
        id: "a-ml-sampling",
        title: "Sampling techniques",
        explain:
          "How a sample is chosen decides whether it represents the population. SIMPLE RANDOM sampling gives every member an equal chance. SYSTEMATIC sampling takes every k-th record. STRATIFIED sampling splits the population into groups (strata, such as regions or classes) and samples the same fraction from each, guaranteeing every group is represented in proportion; it is how scikit-learn's train_test_split(..., stratify=y) keeps a rare class (5% fraud) at 5% in both the training and test sets. CONVENIENCE sampling (whoever is easiest to reach, such as an online survey) is cheap and usually BIASED, and a model trained on a biased sample inherits the bias.",
        codeChallenge: {
          task:
            "Write stratified_sample(rows, key, fraction, seed=0) that groups the rows (dictionaries) by row[key] and, from each group, picks round(len(group) × fraction) rows using random.Random(seed).sample(group, k), with ONE random.Random(seed) created at the start and groups processed in sorted order of their key. Return all picked rows in one list.",
          starter: "import random\n\ndef stratified_sample(rows, key, fraction, seed=0):\n    pass\n",
          sample: "100 rows, 90 'ok' and 10 'fraud', fraction 0.2 → 18 'ok' rows and 2 'fraud' rows",
          tests: [
            {
              check: py`rows = [{"id": i, "label": "fraud" if i % 10 == 0 else "ok"} for i in range(100)]
s = stratified_sample(rows, "label", 0.2)
labels = [r["label"] for r in s]
assert len(s) == 20, "20% of 100 rows is 20. Got " + str(len(s))
assert labels.count("fraud") == 2 and labels.count("ok") == 18, "The 10% fraud rate must be kept: 2 fraud, 18 ok. Got " + str(labels.count("fraud")) + " fraud."
assert len({r["id"] for r in s}) == 20, "No row may be picked twice."
assert all(r in rows for r in s), "Pick existing rows."
assert stratified_sample(rows, "label", 0.2) == s, "The same seed must give the same sample."
assert stratified_sample(rows, "label", 0.2, seed=1) != s, "A different seed should give a different sample."
assert calls("Random"), "Use random.Random(seed) so the sample is reproducible."`,
            },
          ],
          solution: py`import random

def stratified_sample(rows, key, fraction, seed=0):
    rng = random.Random(seed)
    groups = {}
    for row in rows:
        groups.setdefault(row[key], []).append(row)
    picked = []
    for value in sorted(groups):
        group = groups[value]
        picked.extend(rng.sample(group, round(len(group) * fraction)))
    return picked
`,
          hint: "Group with groups.setdefault(row[key], []).append(row). Then for value in sorted(groups): picked.extend(rng.sample(groups[value], round(len(groups[value]) * fraction))).",
          successMessage: "A fixed seed makes the sample reproducible, and stratifying keeps the rare class in proportion. Both habits matter in every train-test split you will make.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 16 · 3.18 – 3.21
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ml-l16-functions-derivatives",
    moduleId: "ml-m3-maths",
    sectionId: SECTION_ID,
    order: 7,
    covers: ["3.18", "3.19", "3.20", "3.21"],
    title: "Functions, Limits and Derivatives",
    subtitle: "The calculus that tells a model which way to change its weights",
    estimatedMinutes: 38,
    intro:
      "Training a model means making its error smaller. A derivative tells you, for each weight, whether increasing it makes the error go up or down, and how fast. This lesson builds derivatives from their definition.",

    atoms: [
      {
        id: "a-ml-functions-graphs",
        title: "Functions and graphs",
        explain:
          "A mathematical FUNCTION f maps each input x to exactly one output f(x). Its GRAPH plots the points (x, f(x)). The functions you will meet most: LINEAR f(x) = mx + c (a straight line with slope m), QUADRATIC f(x) = (x − 3)² (a U-shaped parabola with its minimum at x = 3), EXPONENTIAL eˣ, LOGARITHMIC log x, and the SIGMOID σ(x) = 1 / (1 + e⁻ˣ), an S-curve that squashes any number into (0, 1) and turns a score into a probability (Module 10). A LOSS FUNCTION maps a model's weights to its error; training looks for the lowest point on that graph.",
        codeExercise: {
          language: PY,
          code: py`import math

def linear(x):
    return 2 * x + 1

def loss(x):
    return (x - 3) ** 2

def sigmoid(x):
    return 1 / (1 + math.exp(-x))

xs = [0, 1, 2, 3, 4]
print([linear(x) for x in xs])
print([loss(x) for x in xs])
print(sigmoid(0), round(sigmoid(4), 3), round(sigmoid(-4), 3))
`,
          question: "Evaluate each function. What does it print?",
          expectedOutput: "[1, 3, 5, 7, 9]\n[9, 4, 1, 0, 1]\n0.5 0.982 0.018",
          hint: "The loss is smallest at x = 3. sigmoid(0) = 1 / (1 + 1). sigmoid(−4) = 1 − sigmoid(4).",
          successMessage: "The loss bottoms out at x = 3, and the sigmoid maps 0 to exactly 0.5. Both shapes return throughout the course.",
        },
      },
      {
        id: "a-ml-limits",
        title: "Limits",
        explain:
          "A LIMIT describes the value a function APPROACHES as its input approaches some point, even if the function is undefined exactly there. sin(x)/x cannot be evaluated at x = 0 (0/0), yet as x gets closer to 0 the values get closer to 1, so lim_{x→0} sin(x)/x = 1. Limits also describe behaviour at infinity: (1 + 1/n)ⁿ approaches e ≈ 2.71828 as n grows, which is where the exponential function comes from. Limits matter here for one reason: the derivative is DEFINED as a limit.",
        codeExercise: {
          language: PY,
          code: py`import math

for x in [0.1, 0.01, 0.001]:
    print(x, round(math.sin(x) / x, 6))

for n in [10, 1000, 1000000]:
    print(n, round((1 + 1 / n) ** n, 5))
`,
          question: "Watch sin(x)/x as x shrinks, and (1 + 1/n)ⁿ as n grows. What does it print?",
          expectedOutput: "0.1 0.998334\n0.01 0.999983\n0.001 1.0\n10 2.59374\n1000 2.71692\n1000000 2.71828",
          hint: "Both sequences close in on a value without ever being computed AT the limit: 1, and e ≈ 2.71828.",
          successMessage: "The values approach 1 and e. A derivative is exactly this kind of approach: the slope over a gap that shrinks towards zero.",
        },
      },
      {
        id: "a-ml-derivatives",
        title: "Derivatives",
        explain:
          "The DERIVATIVE f′(x) is the SLOPE of the graph at x: the instantaneous rate of change, defined as the limit f′(x) = lim_{h→0} [f(x + h) − f(x)] / h. Positive means the function is rising, negative falling, zero a flat point (often a minimum or maximum). Rules give exact derivatives: (xⁿ)′ = nxⁿ⁻¹, (c·f)′ = c·f′, (f + g)′ = f′ + g′, (eˣ)′ = eˣ. When no formula is handy, a computer estimates it with a tiny h; the CENTRAL difference [f(x + h) − f(x − h)] / (2h) is much more accurate than the one-sided version. Deep learning frameworks compute exact derivatives automatically (Module 15), but numerical derivatives are how engineers CHECK them.",
        codeChallenge: {
          task:
            "Write derivative(f, x, h=1e-5) that returns the central-difference estimate (f(x + h) − f(x − h)) / (2h) of the derivative of the function f at x.",
          starter: "def derivative(f, x, h=1e-5):\n    pass\n",
          sample: "derivative(lambda x: x ** 2, 3) → about 6.0",
          tests: [
            {
              check: py`import math
d = derivative(lambda x: x ** 2, 3)
assert abs(d - 6) < 1e-6, "The derivative of x² is 2x, so 6 at x = 3. Got " + repr(d)
d = derivative(lambda x: (x - 3) ** 2, 1)
assert abs(d - (-4)) < 1e-6, "The loss (x − 3)² has slope 2(x − 3) = −4 at x = 1: negative, so increase x. Got " + repr(d)
d = derivative(math.exp, 0)
assert abs(d - 1) < 1e-6, "eˣ is its own derivative: 1 at x = 0. Got " + repr(d)
d = derivative(lambda x: x ** 3, 2, h=1e-4)
assert abs(d - 12) < 1e-6, "3x² = 12 at x = 2, using the h passed in. Got " + repr(d)
calls_seen = []
derivative(lambda x: calls_seen.append(x) or x, 5)
assert len(calls_seen) == 2 and min(calls_seen) < 5 < max(calls_seen), "Use the CENTRAL difference: evaluate f at x + h and at x − h."`,
            },
          ],
          solution: py`def derivative(f, x, h=1e-5):
    return (f(x + h) - f(x - h)) / (2 * h)
`,
          hint: "One line: return (f(x + h) - f(x - h)) / (2 * h).",
          successMessage: "At x = 1 the loss slopes down to the right (−4), so increasing x reduces the error. That one fact, applied repeatedly, is gradient descent.",
        },
      },
      {
        id: "a-ml-partial-derivatives",
        title: "Partial derivatives",
        explain:
          "Most functions in ML have many inputs: a loss depends on every weight. A PARTIAL DERIVATIVE ∂f/∂xᵢ measures how f changes when ONLY xᵢ changes and every other input is held fixed. For f(x, y) = x² + 3xy, ∂f/∂x = 2x + 3y (treat y as a constant) and ∂f/∂y = 3x. Numerically: nudge one coordinate up and down by h, leave the rest alone, and take the central difference. A model with a million weights has a million partial derivatives of its loss, one per weight, and each says how to adjust that weight.",
        codeChallenge: {
          task:
            "Write partial(f, point, i, h=1e-5) where f takes a LIST of numbers and point is a list. Return the central-difference estimate of ∂f/∂xᵢ at point: copy point, add h to coordinate i for one copy and subtract h for another, and compute (f(up) − f(down)) / (2h). Do not change point itself.",
          starter: "def partial(f, point, i, h=1e-5):\n    pass\n",
          sample: "f = lambda p: p[0] ** 2 + 3 * p[0] * p[1]; partial(f, [1, 2], 0) → about 8.0",
          tests: [
            {
              check: py`f = lambda p: p[0] ** 2 + 3 * p[0] * p[1]
pt = [1.0, 2.0]
dx = partial(f, pt, 0)
dy = partial(f, pt, 1)
assert abs(dx - 8) < 1e-6, "∂f/∂x = 2x + 3y = 8 at (1, 2). Got " + repr(dx)
assert abs(dy - 3) < 1e-6, "∂f/∂y = 3x = 3 at (1, 2). Got " + repr(dy)
assert pt == [1.0, 2.0], "Do not change the point you were given."
g = lambda p: p[0] * p[1] * p[2]
assert abs(partial(g, [2, 3, 4], 2) - 6) < 1e-6, "∂(xyz)/∂z = xy = 6."`,
            },
          ],
          solution: py`def partial(f, point, i, h=1e-5):
    up = list(point)
    down = list(point)
    up[i] += h
    down[i] -= h
    return (f(up) - f(down)) / (2 * h)
`,
          hint: "up = list(point); down = list(point); up[i] += h; down[i] -= h. Then the central difference.",
          successMessage: "Hold everything else still, nudge one input: that is a partial derivative. Collect them all and you have the gradient, next lesson.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 17 · 3.22 – 3.24
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ml-l17-chain-rule-gradients",
    moduleId: "ml-m3-maths",
    sectionId: SECTION_ID,
    order: 8,
    covers: ["3.22", "3.23", "3.24"],
    title: "The Chain Rule, Gradients and Gradient Descent",
    subtitle: "The three ideas that train every neural network",
    estimatedMinutes: 40,
    intro:
      "The chain rule differentiates functions inside functions, which is what a neural network is. The gradient points uphill. Gradient descent walks the other way. Together they are how almost every modern model learns.",

    atoms: [
      {
        id: "a-ml-chain-rule",
        title: "The chain rule",
        explain:
          "When one function feeds another, y = f(g(x)), the CHAIN RULE says dy/dx = f′(g(x)) · g′(x): the outer derivative (evaluated at the inner value) times the inner derivative. Rates of change multiply along the chain: if pay rises ₦2 for each hour of overtime and tax rises ₦0.3 for each naira of pay, tax rises 2 × 0.3 = ₦0.6 per overtime hour. A neural network is a long chain (input → layer 1 → layer 2 → … → loss), and BACKPROPAGATION (Module 14) is nothing more than the chain rule applied from the loss backwards, multiplying local derivatives layer by layer.",
        codeExercise: {
          language: PY,
          code: py`def inner(x):
    return 3 * x + 1          # g(x), g'(x) = 3

def outer(u):
    return u ** 2             # f(u), f'(u) = 2u

x = 2
u = inner(x)
chain = (2 * u) * 3           # f'(g(x)) * g'(x)

h = 1e-6
numeric = (outer(inner(x + h)) - outer(inner(x - h))) / (2 * h)
print(u, chain, round(numeric, 4))
`,
          question: "y = (3x + 1)². Compare the chain rule's answer at x = 2 with a numerical derivative. What does it print?",
          expectedOutput: "7 42 42.0",
          hint: "u = 3 × 2 + 1 = 7. The outer derivative is 2u = 14, times the inner derivative 3.",
          successMessage: "The chain rule and the numerical check agree. Backpropagation does this multiplication through every layer of a network.",
        },
      },
      {
        id: "a-ml-gradients",
        title: "Gradients",
        explain:
          "The GRADIENT ∇f of a function of several inputs is the VECTOR of all its partial derivatives: ∇f = [∂f/∂x₁, ∂f/∂x₂, …, ∂f/∂xₙ]. It points in the direction of STEEPEST ASCENT, and its length says how steep that is. So −∇f points steepest DOWNHILL. At a minimum, every partial is zero and the gradient is the zero vector. For a model, the gradient of the loss with respect to the weights tells you, for every weight at once, which way to move it to reduce the error.",
        codeChallenge: {
          task:
            "Write gradient(f, point, h=1e-5) that returns the list of central-difference partial derivatives of f at point, one per coordinate. f takes a list of numbers. Do not change point.",
          starter: "def gradient(f, point, h=1e-5):\n    pass\n",
          sample: "gradient(lambda p: p[0] ** 2 + p[1] ** 2, [3, 4]) → about [6.0, 8.0]",
          tests: [
            {
              check: py`g = gradient(lambda p: p[0] ** 2 + p[1] ** 2, [3.0, 4.0])
assert len(g) == 2 and abs(g[0] - 6) < 1e-6 and abs(g[1] - 8) < 1e-6, "∇(x² + y²) = [2x, 2y] = [6, 8]. Got " + repr(g)
loss = lambda w: (w[0] - 1) ** 2 + 2 * (w[1] + 2) ** 2 + w[2] ** 2
g = gradient(loss, [1.0, -2.0, 0.0])
assert all(abs(v) < 1e-6 for v in g), "At the minimum (1, −2, 0) every partial is 0. Got " + repr(g)
pt = [0.0, 0.0, 5.0]
g = gradient(loss, pt)
assert abs(g[0] + 2) < 1e-6 and abs(g[1] - 8) < 1e-6 and abs(g[2] - 10) < 1e-6, "Got " + repr(g)
assert pt == [0.0, 0.0, 5.0], "Do not change the point."`,
            },
          ],
          solution: py`def gradient(f, point, h=1e-5):
    grads = []
    for i in range(len(point)):
        up = list(point)
        down = list(point)
        up[i] += h
        down[i] -= h
        grads.append((f(up) - f(down)) / (2 * h))
    return grads
`,
          hint: "Loop over each coordinate i, build up and down copies nudged only at i, and append the central difference.",
          successMessage: "Your gradient is zero at the minimum and points uphill everywhere else. Next: walk downhill.",
        },
      },
      {
        id: "a-ml-gradient-descent-intro",
        title: "Introduction to gradient descent",
        explain:
          "GRADIENT DESCENT finds a minimum by repeatedly stepping downhill: w ← w − η·∇L(w). The LEARNING RATE η (eta) sets the step size. Too small and training crawls; too large and each step overshoots the valley, bouncing or diverging. Each pass is called an ITERATION (or, over a whole dataset, an EPOCH). Gradient descent needs only the gradient, never a formula for the minimum, so it works on models with billions of weights where nothing else could. Every model in Months 3 and 4, from linear regression to Transformers, is trained by a version of this loop.",
        codeChallenge: {
          task:
            "Write gradient_descent(grad, start, lr, steps) where grad is a function returning the gradient (a list) at a point (a list). Starting from a copy of start, repeat steps times: w ← w − lr × grad(w), coordinate by coordinate. Return the final point as a list.",
          starter: "def gradient_descent(grad, start, lr, steps):\n    pass\n",
          sample: "minimise (x − 3)², whose gradient is [2(x − 3)]: gradient_descent(lambda w: [2 * (w[0] - 3)], [0.0], 0.1, 100) → about [3.0]",
          tests: [
            {
              check: py`w = gradient_descent(lambda w: [2 * (w[0] - 3)], [0.0], 0.1, 100)
assert abs(w[0] - 3) < 1e-6, "Minimising (x − 3)² should reach x = 3. Got " + repr(w)
w = gradient_descent(lambda w: [2 * (w[0] - 1), 4 * (w[1] + 2)], [5.0, 5.0], 0.1, 200)
assert abs(w[0] - 1) < 1e-6 and abs(w[1] + 2) < 1e-6, "The 2-D bowl has its minimum at (1, −2). Got " + repr(w)
w = gradient_descent(lambda w: [2 * (w[0] - 3)], [0.0], 0.1, 1)
assert abs(w[0] - 0.6) < 1e-12, "One step from 0: 0 − 0.1 × (−6) = 0.6. Got " + repr(w)
start = [0.0]
gradient_descent(lambda w: [2 * (w[0] - 3)], start, 0.1, 5)
assert start == [0.0], "Work on a copy of start."
w = gradient_descent(lambda w: [2 * (w[0] - 3)], [0.0], 1.1, 30)
assert abs(w[0] - 3) > 100, "With lr = 1.1 every step overshoots further: gradient descent diverges."`,
            },
          ],
          solution: py`def gradient_descent(grad, start, lr, steps):
    w = list(start)
    for _ in range(steps):
        g = grad(w)
        w = [wi - lr * gi for wi, gi in zip(w, g)]
    return w
`,
          hint: "w = list(start); then steps times: g = grad(w); w = [wi - lr * gi for wi, gi in zip(w, g)].",
          successMessage: "The last test diverged with lr = 1.1: the learning rate is the most important setting in training. You will tune it in Modules 10 and 14.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 18 · 3.25 – 3.28
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ml-l18-essential-maths",
    moduleId: "ml-m3-maths",
    sectionId: SECTION_ID,
    order: 9,
    covers: ["3.25", "3.26", "3.27", "3.28"],
    title: "Logarithms, Summation, Distances and Vector Geometry",
    subtitle: "The notation and measurements every ML paper assumes you know",
    estimatedMinutes: 38,
    intro:
      "Four tools finish the mathematics: logarithms (which turn products into sums and power the log loss), summation notation (how every formula is written), distance metrics (how similarity is measured) and the geometry of vectors.",

    atoms: [
      {
        id: "a-ml-exponents-logs",
        title: "Exponents and logarithms",
        explain:
          "An EXPONENT says how many times to multiply: 2³ = 8; rules: aᵐ·aⁿ = aᵐ⁺ⁿ, (aᵐ)ⁿ = aᵐⁿ, a⁰ = 1, a⁻ⁿ = 1/aⁿ. The LOGARITHM undoes it: log₂ 8 = 3 because 2³ = 8. The NATURAL log ln uses base e ≈ 2.718. The key rule: log(ab) = log a + log b, so logs turn PRODUCTS into SUMS, which is why the probability of a whole dataset (a product of many small probabilities, which would underflow to 0) is handled as a sum of logs. The LOG LOSS of a classifier is −log(p) for the probability p it gave the true class: near 0 when confident and right, huge when confident and wrong.",
        codeExercise: {
          language: PY,
          code: py`import math

print(2 ** 10, math.log2(1024), round(math.log(math.e ** 3), 6))
print(round(math.log(6), 6) == round(math.log(2) + math.log(3), 6))

for p in [0.99, 0.5, 0.01]:
    print(p, round(-math.log(p), 3))
`,
          question: "Check the log rules, then compute the log loss −ln(p) for three predicted probabilities of the true class. What does it print?",
          expectedOutput: "1024 10.0 3.0\nTrue\n0.99 0.01\n0.5 0.693\n0.01 4.605",
          hint: "ln(6) = ln(2) + ln(3). −ln(0.5) = ln 2 ≈ 0.693.",
          successMessage: "Confident and right (0.99) costs 0.01; confident and wrong (0.01) costs 4.6. Log loss punishes overconfidence hard, which is why classifiers are trained with it.",
        },
      },
      {
        id: "a-ml-summation",
        title: "Summation notation",
        explain:
          "Σ (capital sigma) means \"add up\": Σᵢ₌₁ⁿ xᵢ = x₁ + x₂ + … + xₙ. The index i runs from the bottom value to the top. Sums can wrap any expression: Σ (yᵢ − ŷᵢ)² adds the squared errors over all examples. Useful rules: Σ c·xᵢ = c·Σ xᵢ, and Σ (aᵢ + bᵢ) = Σ aᵢ + Σ bᵢ. Every ML formula is written this way, and each one translates directly into Python's sum() over a generator: the MEAN SQUARED ERROR, MSE = (1/n) Σ (yᵢ − ŷᵢ)², is sum((y - p) ** 2 for y, p in zip(ys, preds)) / n.",
        codeExercise: {
          language: PY,
          code: py`y = [3.0, 5.0, 7.0, 9.0]          # true values
y_hat = [2.5, 5.0, 8.0, 8.0]      # predictions
n = len(y)

sum_sq = sum((yi - pi) ** 2 for yi, pi in zip(y, y_hat))
mse = sum_sq / n
mae = sum(abs(yi - pi) for yi, pi in zip(y, y_hat)) / n
print(sum(i ** 2 for i in range(1, 5)))
print(sum_sq, mse, mae)
`,
          question: "Translate Σᵢ₌₁⁴ i², Σ(yᵢ − ŷᵢ)², the MSE and the MAE. What does it print?",
          expectedOutput: "30\n2.25 0.5625 0.625",
          hint: "1 + 4 + 9 + 16. The errors are 0.5, 0, −1 and 1, so the squares are 0.25, 0, 1 and 1.",
          successMessage: "Each Σ became one sum() over a generator. Reading formulas as code, and code as formulas, is the skill the rest of the course relies on.",
        },
      },
      {
        id: "a-ml-distance-metrics",
        title: "Distance metrics",
        explain:
          "Many algorithms (k-nearest neighbours, k-means, recommendation, search) rest on measuring how SIMILAR two examples are. EUCLIDEAN distance is the straight-line distance: √Σ(aᵢ − bᵢ)². MANHATTAN distance adds absolute differences, Σ|aᵢ − bᵢ|, like walking a city grid. COSINE SIMILARITY ignores length and compares direction: (a · b) / (‖a‖‖b‖), from −1 (opposite) through 0 (unrelated) to 1 (same direction); it is the standard for comparing documents and embeddings, where a long review and a short review on the same topic should count as similar. Features on different scales distort distances (₦ salaries swamp ages), which is why features are scaled first (Module 8).",
        codeChallenge: {
          task:
            "Without NumPy, write euclidean(a, b), manhattan(a, b) and cosine_similarity(a, b) for two equal-length lists. Round each result to 4 decimal places.",
          starter: "def euclidean(a, b):\n    pass\n\ndef manhattan(a, b):\n    pass\n\ndef cosine_similarity(a, b):\n    pass\n",
          sample: "euclidean([0, 0], [3, 4]) → 5.0; manhattan([0, 0], [3, 4]) → 7; cosine_similarity([1, 0], [0, 1]) → 0.0",
          tests: [
            {
              check: py`assert euclidean([0, 0], [3, 4]) == 5.0, "A 3-4-5 triangle. Got " + repr(euclidean([0, 0], [3, 4]))
assert manhattan([0, 0], [3, 4]) == 7, "3 + 4. Got " + repr(manhattan([0, 0], [3, 4]))
assert euclidean([1, 2, 3], [4, 6, 8]) == 7.0711, "√(9 + 16 + 25). Got " + repr(euclidean([1, 2, 3], [4, 6, 8]))
assert cosine_similarity([1, 0], [0, 1]) == 0.0, "Perpendicular vectors."
assert cosine_similarity([2, 4], [1, 2]) == 1.0, "Same direction, different lengths: similarity 1."
assert cosine_similarity([1, 1], [-1, -1]) == -1.0, "Opposite directions."
assert cosine_similarity([3, 1, 0], [1, 2, 2]) == 0.527, "Got " + repr(cosine_similarity([3, 1, 0], [1, 2, 2]))
assert "numpy" not in source, "Write them yourself."`,
            },
          ],
          solution: py`def euclidean(a, b):
    return round(sum((x - y) ** 2 for x, y in zip(a, b)) ** 0.5, 4)

def manhattan(a, b):
    return round(sum(abs(x - y) for x, y in zip(a, b)), 4)

def cosine_similarity(a, b):
    dot = sum(x * y for x, y in zip(a, b))
    norm_a = sum(x * x for x in a) ** 0.5
    norm_b = sum(y * y for y in b) ** 0.5
    return round(dot / (norm_a * norm_b), 4)
`,
          hint: "Cosine: the dot product divided by the product of the two lengths, where a length is the square root of the sum of squares.",
          successMessage: "[2, 4] and [1, 2] are far apart in Euclidean terms but identical in direction. Choosing the metric is choosing what \"similar\" means.",
        },
      },
      {
        id: "a-ml-vector-geometry",
        title: "Vectors and geometric interpretation",
        explain:
          "A vector is an ARROW from the origin to a point, with a direction and a length. Its length (the L2 NORM) is ‖v‖ = √(v₁² + v₂² + …). Dividing by the norm gives a UNIT vector, length 1, pointing the same way. The dot product connects algebra to geometry: a · b = ‖a‖‖b‖cos θ, so θ = arccos(a·b / (‖a‖‖b‖)) is the angle between two vectors, and a · b = 0 means they are PERPENDICULAR (orthogonal). In ML, every example is a point in feature space, a linear classifier is a flat boundary (hyperplane) in that space, and the weight vector points perpendicular to it.",
        codeExercise: {
          language: PY,
          code: py`import math

v = [3, 4]
norm = math.sqrt(sum(x * x for x in v))
unit = [x / norm for x in v]
print(norm, unit)

a, b = [1, 0], [1, 1]
dot = sum(x * y for x, y in zip(a, b))
cos_theta = dot / (math.hypot(*a) * math.hypot(*b))
print(round(math.degrees(math.acos(cos_theta)), 1))
print(sum(x * y for x, y in zip([2, 1], [-1, 2])))
`,
          question: "Find the norm and unit vector of [3, 4], the angle between [1, 0] and [1, 1], and the dot product of [2, 1] and [−1, 2]. What does it print?",
          expectedOutput: "5.0 [0.6, 0.8]\n45.0\n0",
          hint: "[1, 1] points halfway between the x and y axes. A zero dot product means the vectors are perpendicular.",
          successMessage: "Lengths, directions and angles in two dimensions work exactly the same way in the 784 dimensions of an image, where you simply cannot draw them.",
        },
      },
    ],

    task: {
      title: "Module 3 project: a statistics and matrix programme",
      intro:
        "Build a Python programme, in plain Python first and then checked against NumPy, that brings the module's mathematics together on a real table of numbers, such as a class's scores in four subjects.",
      prompts: [
        "Compute the mean, median, mode, population and sample variance, and standard deviation of every column, with your own functions.",
        "Compute the covariance and Pearson correlation between every pair of columns, and print the correlation matrix.",
        "Implement matrix addition, scalar multiplication, transpose and multiplication, raising clear errors on shape mismatches.",
        "Compute XᵀX for the score matrix and check it against NumPy's X.T @ X.",
        "Use NumPy's eigh on the covariance matrix and report which direction carries the most variance.",
        "Find the two most similar students with Euclidean distance and with cosine similarity, and explain any difference.",
        "Use your gradient descent to find the value m that minimises Σ(xᵢ − m)² for one column, and show it equals the mean.",
      ],
      closing: "Writing these by hand shows why nobody does it in production. Module 4 introduces NumPy, which performs all of them on millions of numbers in milliseconds.",
    },

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
