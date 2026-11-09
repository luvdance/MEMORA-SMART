/**
 * MACHINE LEARNING AND AI · MODULE 11 · CLASSIFICATION ALGORITHMS
 *
 * Curriculum 11.1 – 11.17. Binary and multiclass classification; KNN,
 * decision trees, random forests, SVMs, Naive Bayes and logistic regression;
 * ensembles; and the evaluation toolkit: accuracy, precision, recall, F1,
 * the confusion matrix, ROC curves and AUC. KNN, Gini impurity, softmax,
 * voting and every metric are written by the learner and checked against
 * scikit-learn.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

export const SECTION_ID = "ml-s11-classification";

const PY = "python";
const py = String.raw;

// A churn-like binary dataset shared by several checks.
const CHURN = py`import numpy as np
from sklearn.datasets import make_classification
from sklearn.model_selection import train_test_split
X, y = make_classification(n_samples=600, n_features=6, n_informative=4, n_redundant=1, weights=[0.75, 0.25], random_state=11)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=0, stratify=y)
`;

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 49 · 11.1 – 11.3
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ml-l49-classification-basics",
    moduleId: "ml-m11-classification",
    sectionId: SECTION_ID,
    order: 1,
    covers: ["11.1", "11.2", "11.3"],
    title: "Classification: Binary and Multiclass",
    subtitle: "Predicting categories, from probabilities to decisions",
    estimatedMinutes: 34,
    intro:
      "Is this transaction fraud? Which disease does this leaf have? Classification predicts a category. Most classifiers first estimate a probability for each class, then turn it into a decision.",

    atoms: [
      {
        id: "a-ml-classification-intro",
        title: "Understanding classification",
        explain:
          "CLASSIFICATION is supervised learning with a CATEGORICAL target. A classifier learns a DECISION BOUNDARY that separates the classes in feature space. Most classifiers are PROBABILISTIC: predict_proba(X) returns, for each row, the estimated probability of each class (each row sums to 1), and predict(X) returns the most likely class. Keeping the probabilities is valuable: they rank customers by risk, and the decision threshold can be moved to suit the costs of different mistakes. Evaluating a classifier needs more than accuracy, as Lessons 53 and 54 show.",
        codeExercise: {
          language: PY,
          code: py`import numpy as np
from sklearn.linear_model import LogisticRegression

X = np.array([[1], [2], [3], [6], [7], [8]])      # complaints this quarter
y = np.array([0, 0, 0, 1, 1, 1])                  # churned?
clf = LogisticRegression().fit(X, y)

proba = clf.predict_proba([[2], [5.5], [7]])
print(proba.sum(axis=1))
print(clf.predict([[2], [5.5], [7]]))
print(clf.classes_)
`,
          question: "Each row of predict_proba holds P(class 0) and P(class 1). What do the row sums, the predictions and the classes print?",
          expectedOutput: "[1. 1. 1.]\n[0 1 1]\n[0 1]",
          hint: "Probabilities across the classes sum to 1. The midpoint between the two groups is 4.5, so 5.5 falls on the churn side.",
          successMessage: "predict is simply the class with the highest probability. The probabilities themselves carry more information than the labels.",
        },
      },
      {
        id: "a-ml-binary-classification",
        title: "Binary classification",
        explain:
          "BINARY classification has two classes, conventionally 1 = POSITIVE (the event you are looking for: fraud, churn, disease) and 0 = NEGATIVE. The model outputs p = P(y = 1), and the DECISION THRESHOLD t turns it into a class: positive if p ≥ t. The default t = 0.5 is arbitrary. When missing a positive is expensive (an undetected fraud, an undiagnosed disease), LOWER the threshold to catch more positives at the cost of more false alarms; when false alarms are expensive (blocking a good customer's card), RAISE it. Choosing t is a business decision informed by the metrics in Lesson 53.",
        codeChallenge: {
          task:
            "Write classify(probabilities, threshold=0.5) that returns a NumPy array of 0/1 predictions (1 where p ≥ threshold). Then write positives_caught(probabilities, y_true, threshold) that returns a tuple (caught, false_alarms): how many true positives and how many false positives the threshold produces.",
          starter: "import numpy as np\n\ndef classify(probabilities, threshold=0.5):\n    pass\n\ndef positives_caught(probabilities, y_true, threshold):\n    pass\n",
          sample: "lowering the threshold from 0.5 to 0.2 catches more fraud and raises more false alarms",
          tests: [
            {
              check: py`import numpy as np
p = np.array([0.95, 0.6, 0.45, 0.3, 0.25, 0.1, 0.05])
y = np.array([1, 1, 1, 0, 1, 0, 0])
assert classify(p).tolist() == [1, 1, 0, 0, 0, 0, 0], "Default threshold 0.5. Got " + repr(classify(p).tolist())
assert classify(p, 0.2).tolist() == [1, 1, 1, 1, 1, 0, 0], "Threshold 0.2. Got " + repr(classify(p, 0.2).tolist())
assert positives_caught(p, y, 0.5) == (2, 0), "At 0.5: 2 of 4 positives caught, no false alarms. Got " + repr(positives_caught(p, y, 0.5))
assert positives_caught(p, y, 0.2) == (4, 1), "At 0.2: all 4 caught, 1 false alarm. Got " + repr(positives_caught(p, y, 0.2))
assert classify([0.5]).tolist() == [1], "p equal to the threshold counts as positive."`,
            },
          ],
          solution: py`import numpy as np

def classify(probabilities, threshold=0.5):
    return (np.asarray(probabilities) >= threshold).astype(int)

def positives_caught(probabilities, y_true, threshold):
    pred = classify(probabilities, threshold)
    y = np.asarray(y_true)
    caught = int(((pred == 1) & (y == 1)).sum())
    false_alarms = int(((pred == 1) & (y == 0)).sum())
    return caught, false_alarms
`,
          hint: "(np.asarray(p) >= threshold).astype(int). Count true positives with ((pred == 1) & (y == 1)).sum() and false positives with ((pred == 1) & (y == 0)).sum().",
          successMessage: "Same model, different threshold, different trade-off: all four positives caught for the price of one false alarm. The threshold is a lever for the business, not a fixed constant.",
        },
      },
      {
        id: "a-ml-multiclass",
        title: "Multiclass classification",
        explain:
          "MULTICLASS classification has three or more classes (iris species, digits 0–9, crop diseases). Some algorithms handle it natively (trees, KNN, Naive Bayes, neural networks). Linear models use a strategy: ONE-VS-REST trains one binary classifier per class (\"this class versus all others\") and predicts the class with the highest score; or MULTINOMIAL (softmax) regression scores every class at once and turns the scores into probabilities with SOFTMAX: pₖ = e^zₖ / Σⱼ e^zⱼ. Subtracting the largest score before exponentiating avoids overflow without changing the result. (MULTILABEL, where one row can have several labels, such as a film's genres, is a different problem.)",
        codeChallenge: {
          task:
            "Write softmax(scores) for a 2-D NumPy array (one row of class scores per example): subtract each row's maximum, exponentiate, and divide by each row's sum. Then write predict_classes(scores, class_names) that returns the list of class names with the highest probability in each row.",
          starter: "import numpy as np\n\ndef softmax(scores):\n    pass\n\ndef predict_classes(scores, class_names):\n    pass\n",
          sample: "softmax(np.array([[2.0, 1.0, 0.1]])) → [[0.659, 0.242, 0.099]] (rounded)",
          tests: [
            {
              check: py`import numpy as np
s = np.array([[2.0, 1.0, 0.1], [0.0, 0.0, 0.0], [1000.0, 1001.0, 999.0]])
p = softmax(s)
assert p.shape == (3, 3) and np.allclose(p.sum(axis=1), 1), "Each row of probabilities sums to 1."
assert np.allclose(p[0], [0.659, 0.242, 0.099], atol=1e-3), "Got " + repr(p[0])
assert np.allclose(p[1], [1 / 3] * 3), "Equal scores give equal probabilities."
assert np.all(np.isfinite(p[2])), "Subtract each row's max first, or e^1000 overflows."
names = ["healthy", "mosaic", "blight"]
assert predict_classes(s[[0, 2]], names) == ["healthy", "mosaic"], "Got " + repr(predict_classes(s[[0, 2]], names))
assert not uses("For"), "Use whole-array operations: axis=1 and keepdims=True."`,
            },
          ],
          solution: py`import numpy as np

def softmax(scores):
    shifted = scores - scores.max(axis=1, keepdims=True)
    e = np.exp(shifted)
    return e / e.sum(axis=1, keepdims=True)

def predict_classes(scores, class_names):
    best = softmax(scores).argmax(axis=1)
    return [class_names[i] for i in best]
`,
          hint: "shifted = scores - scores.max(axis=1, keepdims=True); e = np.exp(shifted); return e / e.sum(axis=1, keepdims=True). keepdims keeps the (n, 1) shape so broadcasting works.",
          successMessage: "Softmax is the output layer of every multiclass neural network you will build in Months 4 and 5, including the next-token prediction of language models.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 50 · 11.4
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ml-l50-knn",
    moduleId: "ml-m11-classification",
    sectionId: SECTION_ID,
    order: 2,
    covers: ["11.4"],
    title: "K-Nearest Neighbours",
    subtitle: "Classify by asking the most similar examples",
    estimatedMinutes: 34,
    intro:
      "The simplest classifier there is: to label a new point, find the k most similar labelled points and take a vote. It has no training step at all, and it teaches the role of distance, scaling and k.",

    atoms: [
      {
        id: "a-ml-knn",
        title: "K-Nearest Neighbours (KNN)",
        explain:
          "K-NEAREST NEIGHBOURS stores the training data (training is just memorising) and, for each new point, finds the k training points closest to it (usually by Euclidean distance) and predicts the MAJORITY class among them (for regression, their average). It is a LAZY learner: no model is built in advance, so prediction is slow on large datasets, since every query computes distances to every stored point. Its behaviour depends on: k (small k follows noise and overfits; large k smooths too much and underfits; odd k avoids ties in binary problems), the DISTANCE metric, and FEATURE SCALING, which is essential because distance is dominated by the largest-scale feature.",
        codeChallenge: {
          task:
            "Write a class KNN without scikit-learn. __init__(self, k=3) stores k; fit(X, y) stores NumPy arrays of the training data and returns self; predict(X) returns a NumPy array with, for each row, the most common label among its k nearest training points by Euclidean distance. On a tie between labels, choose the label of the single nearest neighbour among the tied labels' members.",
          starter: "import numpy as np\n\nclass KNN:\n    pass\n",
          sample: "KNN(k=3).fit(X_train, y_train).predict(X_test) → the same predictions as sklearn's KNeighborsClassifier",
          tests: [
            {
              check: CHURN + py`
from sklearn.neighbors import KNeighborsClassifier
from sklearn.preprocessing import StandardScaler
sc = StandardScaler().fit(X_train)
Ztr, Zte = sc.transform(X_train), sc.transform(X_test)
for k in [1, 5, 9]:
    mine = KNN(k=k).fit(Ztr, y_train).predict(Zte)
    ref = KNeighborsClassifier(n_neighbors=k).fit(Ztr, y_train).predict(Zte)
    assert (mine == ref).mean() > 0.99, "k=" + str(k) + ": predictions should match scikit-learn. Agreement " + str((mine == ref).mean())
toy = KNN(k=3).fit(np.array([[0, 0], [1, 0], [0, 1], [5, 5], [6, 5]]), np.array(["a", "a", "a", "b", "b"]))
assert toy.predict(np.array([[0.2, 0.2], [5.5, 5.0]])).tolist() == ["a", "b"], "Majority of the 3 nearest."
tie = KNN(k=2).fit(np.array([[0.0], [1.0], [3.0]]), np.array(["x", "y", "y"]))
assert tie.predict(np.array([[0.4]])).tolist() == ["x"], "A 1-1 tie goes to the single nearest neighbour (x at distance 0.4)."
assert "sklearn" not in source, "Write KNN yourself."`,
            },
          ],
          solution: py`import numpy as np

class KNN:
    def __init__(self, k=3):
        self.k = k

    def fit(self, X, y):
        self.X_ = np.asarray(X, float)
        self.y_ = np.asarray(y)
        return self

    def predict(self, X):
        out = []
        for row in np.asarray(X, float):
            dist = np.sqrt(((self.X_ - row) ** 2).sum(axis=1))
            nearest = np.argsort(dist, kind="stable")[: self.k]
            labels = self.y_[nearest]
            values, counts = np.unique(labels, return_counts=True)
            tied = set(values[counts == counts.max()])
            out.append(next(lab for lab in labels if lab in tied))
        return np.array(out)
`,
          hint: "For each row: distances to every training point, np.argsort to get the k nearest, count their labels with np.unique(..., return_counts=True). Walk the neighbours in distance order and return the first whose label is among the most common.",
          successMessage: "Your KNN agrees with scikit-learn's. Notice where all the work happens: at prediction time, comparing each new point with every stored one.",
        },
      },
      {
        id: "a-ml-choosing-k",
        title: "Choosing k",
        explain:
          "k controls the bias-variance trade-off directly. k = 1 gives a jagged boundary that follows every training point, including mislabelled ones: training accuracy is 100% by construction (each point is its own nearest neighbour) and test accuracy suffers. Larger k averages over more neighbours, smoothing the boundary; very large k approaches always predicting the majority class. Choose k by validation or cross-validation, typically trying odd values from 1 to about √n. Weighting votes by inverse distance (weights=\"distance\") lets closer neighbours count more.",
        codeExercise: {
          language: PY,
          code: CHURN + py`from sklearn.neighbors import KNeighborsClassifier
from sklearn.preprocessing import StandardScaler

sc = StandardScaler().fit(X_train)
Ztr, Zte = sc.transform(X_train), sc.transform(X_test)
for k in [1, 3, 401]:
    knn = KNeighborsClassifier(n_neighbors=k).fit(Ztr, y_train)
    print(k, round(knn.score(Ztr, y_train), 3), round(knn.score(Zte, y_test), 3))
`,
          question: "Training and test accuracy for k = 1, 3 and 401 (out of 420 training points). What does it print?",
          expectedOutput: "1 1.0 0.894\n3 0.933 0.9\n401 0.748 0.744",
          hint: "k = 1 is perfect on training data. With k = 401 almost every neighbourhood is mostly the majority class, which makes up about 75% of the data.",
          successMessage: "k = 1 overfits (a perfect training score), k = 401 underfits (it predicts the majority class for almost everyone), and k = 3 scores best on the test set. In practice choose k by cross-validation (Module 13), not by the test set.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 51 · 11.5 – 11.6
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ml-l51-trees-forests",
    moduleId: "ml-m11-classification",
    sectionId: SECTION_ID,
    order: 3,
    covers: ["11.5", "11.6"],
    title: "Decision Trees and Random Forests",
    subtitle: "Questions that split the data, and a forest that votes",
    estimatedMinutes: 40,
    intro:
      "A decision tree asks a sequence of yes/no questions, which makes it easy to explain. A random forest grows hundreds of varied trees and lets them vote, which makes it one of the most reliable algorithms for tabular data.",

    atoms: [
      {
        id: "a-ml-decision-trees",
        title: "Decision trees",
        explain:
          "A DECISION TREE splits the data with questions such as \"tenure < 6 months?\", sending rows left or right, until each LEAF predicts the majority class of its rows. At each node it chooses the feature and threshold that make the children PUREST. GINI IMPURITY measures impurity: G = 1 − Σ pₖ², 0 for a pure node, 0.5 for a 50/50 binary node. The quality of a split is the impurity decrease: G(parent) minus the size-weighted average G of the children. Trees need no scaling, handle non-linear patterns and interactions, and are readable, but a deep tree overfits badly; limit max_depth or min_samples_leaf.",
        codeChallenge: {
          task:
            "Write gini(labels) that returns the Gini impurity 1 − Σ pₖ² of a list of labels (0.0 for an empty list). Then write best_split(values, labels) for ONE numeric feature: try every distinct value t as a threshold (left = values < t, right = values ≥ t, skipping splits that leave a side empty), and return (t, weighted_gini) for the threshold with the lowest size-weighted child impurity, rounded to 4. On ties, return the smallest t.",
          starter: "def gini(labels):\n    pass\n\ndef best_split(values, labels):\n    pass\n",
          sample: "gini([0, 0, 1, 1]) → 0.5; best_split([1, 2, 8, 9], [0, 0, 1, 1]) → (8, 0.0)",
          tests: [
            {
              check: py`assert gini([0, 0, 1, 1]) == 0.5 and gini([1, 1, 1]) == 0.0 and gini([]) == 0.0, "Gini of 50/50, pure and empty."
assert abs(gini(["a", "b", "c"]) - 2 / 3) < 1e-12, "Three equal classes: 1 − 3 × (1/3)²."
assert best_split([1, 2, 8, 9], [0, 0, 1, 1]) == (8, 0.0), "Splitting at 8 gives two pure sides. Got " + repr(best_split([1, 2, 8, 9], [0, 0, 1, 1]))
tenure = [2, 3, 5, 7, 12, 18, 24, 30]
churn = [1, 1, 1, 0, 1, 0, 0, 0]
t, g = best_split(tenure, churn)
assert t == 7 and g == 0.2, "Best threshold 7: left [1, 1, 1] is pure, right [0, 1, 0, 0, 0] has Gini 0.32, weighted 5/8 × 0.32 = 0.2. Got " + repr((t, g))`,
            },
          ],
          solution: py`def gini(labels):
    n = len(labels)
    if n == 0:
        return 0.0
    counts = {}
    for lab in labels:
        counts[lab] = counts.get(lab, 0) + 1
    return 1 - sum((c / n) ** 2 for c in counts.values())

def best_split(values, labels):
    n = len(values)
    best = None
    for t in sorted(set(values)):
        left = [lab for v, lab in zip(values, labels) if v < t]
        right = [lab for v, lab in zip(values, labels) if v >= t]
        if not left or not right:
            continue
        g = round(len(left) / n * gini(left) + len(right) / n * gini(right), 4)
        if best is None or g < best[1]:
            best = (t, g)
    return best
`,
          hint: "For each sorted distinct t, build left and right label lists, skip if either is empty, compute len(left)/n × gini(left) + len(right)/n × gini(right), and keep the strictly smallest.",
          successMessage: "That search, repeated for every feature at every node, is how a decision tree is grown. scikit-learn does it in optimised C, but it is the same idea.",
        },
      },
      {
        id: "a-ml-random-forest",
        title: "Random forest",
        explain:
          "A RANDOM FOREST trains many decision trees, each on a BOOTSTRAP sample of the rows (drawn with replacement) and considering only a RANDOM SUBSET of features at each split, then predicts by majority vote (or averaging probabilities). The randomness makes the trees DIFFERENT, so their errors partly cancel: averaging reduces variance (Module 9) while keeping each tree's low bias. Forests work well with little tuning, resist overfitting as trees are added, need no scaling, and report FEATURE IMPORTANCES. Their main hyperparameters are n_estimators, max_depth and max_features. Costs: less interpretable than one tree, and larger and slower to run.",
        codeChallenge: {
          task:
            "Write tree_vs_forest(X_train, y_train, X_test, y_test) that fits DecisionTreeClassifier(random_state=0) and RandomForestClassifier(n_estimators=200, random_state=0) and returns a dictionary {\"tree_train\", \"tree_test\", \"forest_test\", \"top_feature\"}: the tree's training and test accuracy and the forest's test accuracy, each rounded to 3, and the index (an int) of the forest's most important feature (feature_importances_).",
          starter: "import numpy as np\nfrom sklearn.tree import DecisionTreeClassifier\nfrom sklearn.ensemble import RandomForestClassifier\n\ndef tree_vs_forest(X_train, y_train, X_test, y_test):\n    pass\n",
          sample: "the single tree scores 1.0 on training data; the forest beats it on test data",
          tests: [
            {
              check: CHURN + py`
r = tree_vs_forest(X_train, y_train, X_test, y_test)
assert set(r) == {"tree_train", "tree_test", "forest_test", "top_feature"}, "Return the four keys. Got " + repr(r)
assert r["tree_train"] == 1.0, "An unlimited tree memorises its training data."
assert r["forest_test"] > r["tree_test"], "The forest should beat the single tree on unseen data. Got " + repr(r)
from sklearn.ensemble import RandomForestClassifier
rf = RandomForestClassifier(n_estimators=200, random_state=0).fit(X_train, y_train)
assert r["top_feature"] == int(np.argmax(rf.feature_importances_)) and isinstance(r["top_feature"], int), "Use argmax of feature_importances_, as an int."`,
            },
          ],
          solution: py`import numpy as np
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier

def tree_vs_forest(X_train, y_train, X_test, y_test):
    tree = DecisionTreeClassifier(random_state=0).fit(X_train, y_train)
    forest = RandomForestClassifier(n_estimators=200, random_state=0).fit(X_train, y_train)
    return {
        "tree_train": round(tree.score(X_train, y_train), 3),
        "tree_test": round(tree.score(X_test, y_test), 3),
        "forest_test": round(forest.score(X_test, y_test), 3),
        "top_feature": int(np.argmax(forest.feature_importances_)),
    }
`,
          hint: "Fit both models; .score gives accuracy; int(np.argmax(forest.feature_importances_)) gives the top feature.",
          successMessage: "One tree memorised; two hundred varied trees, voting, generalised better. That is variance reduction by averaging, in practice.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 52 · 11.7 – 11.9
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ml-l52-svm-bayes-logistic",
    moduleId: "ml-m11-classification",
    sectionId: SECTION_ID,
    order: 4,
    covers: ["11.7", "11.8", "11.9"],
    title: "SVMs, Naive Bayes and Logistic Regression",
    subtitle: "Maximum margins, probability from counts, and the interpretable baseline",
    estimatedMinutes: 40,
    intro:
      "Three more classifiers, each built on a different idea: the widest possible boundary (SVM), Bayes' theorem applied to every feature (Naive Bayes), and a linear score turned into a probability (logistic regression).",

    atoms: [
      {
        id: "a-ml-svm",
        title: "Support Vector Machines (SVM)",
        explain:
          "A SUPPORT VECTOR MACHINE finds the boundary that separates the classes with the widest MARGIN, the gap to the nearest points on each side. Those nearest points, the SUPPORT VECTORS, alone define the boundary. The C hyperparameter trades margin width against training errors (small C: wider margin, more tolerance; large C: fits the training points tightly). The KERNEL TRICK lets an SVM draw curved boundaries by implicitly mapping the data into a higher-dimensional space: kernel=\"rbf\" (the default) handles most non-linear problems, with gamma controlling how local each point's influence is. SVMs need scaled features and become slow beyond tens of thousands of rows.",
        codeExercise: {
          language: PY,
          code: py`from sklearn.datasets import make_moons
from sklearn.model_selection import train_test_split
from sklearn.svm import SVC

X, y = make_moons(n_samples=400, noise=0.2, random_state=0)
Xtr, Xte, ytr, yte = train_test_split(X, y, test_size=0.3, random_state=0)
for kernel in ["linear", "rbf"]:
    svm = SVC(kernel=kernel, C=1.0).fit(Xtr, ytr)
    print(kernel, round(svm.score(Xte, yte), 3), len(svm.support_))
`,
          question: "Two interlocking half-moons cannot be separated by a straight line. Compare a linear and an RBF SVM: test accuracy and number of support vectors. What does it print?",
          expectedOutput: "linear 0.908 100\nrbf 0.95 65",
          hint: "The RBF kernel can bend the boundary around the moons, so it needs fewer points on the margin and makes fewer mistakes.",
          successMessage: "The curved RBF boundary fits the moons; the straight line cannot. The kernel trick gives curves without you building any new features.",
        },
      },
      {
        id: "a-ml-naive-bayes",
        title: "Naive Bayes",
        explain:
          "NAIVE BAYES applies Bayes' theorem (Module 3): P(class | features) ∝ P(class) × Π P(featureᵢ | class), with the \"naive\" assumption that features are independent given the class. It is almost certainly false (\"free\" and \"winner\" co-occur in spam) yet the classifier works surprisingly well, especially for TEXT. Training only counts: the prior P(class) and, for each word, how often it appears in each class. LAPLACE SMOOTHING adds 1 to every count so an unseen word does not make a probability exactly zero. Variants: MultinomialNB (word counts), BernoulliNB (word present or not), GaussianNB (numeric features). It is fast, needs little data and is a strong text baseline.",
        codeChallenge: {
          task:
            "Write a spam filter from scratch. train_nb(docs, labels) takes lists of strings and labels (\"spam\" or \"ham\"), lower-cases and splits each document into words, and returns a model dictionary with the class priors, per-class word counts, per-class total word counts and the vocabulary. predict_nb(model, doc) returns the class with the larger log-probability log P(class) + Σ log P(word | class), where P(word | class) = (count(word, class) + 1) / (total words in class + vocabulary size), skipping words not in the vocabulary.",
          starter: "import math\n\ndef train_nb(docs, labels):\n    pass\n\ndef predict_nb(model, doc):\n    pass\n",
          sample: "predict_nb(model, \"win a free prize now\") → \"spam\"",
          tests: [
            {
              check: py`docs = ["win a free prize now", "free money win big", "claim your free prize", "lunch meeting at noon", "project meeting notes attached", "are we still on for lunch", "your invoice is attached", "win free airtime today"]
labels = ["spam", "spam", "spam", "ham", "ham", "ham", "ham", "spam"]
m = train_nb(docs, labels)
assert predict_nb(m, "free prize inside") == "spam", "Got " + repr(predict_nb(m, "free prize inside"))
assert predict_nb(m, "meeting notes for lunch") == "ham", "Got " + repr(predict_nb(m, "meeting notes for lunch"))
assert predict_nb(m, "WIN FREE MONEY") == "spam", "Lower-case before looking words up."
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.naive_bayes import MultinomialNB
cv = CountVectorizer(token_pattern=r"\S+")
nb = MultinomialNB(alpha=1.0).fit(cv.fit_transform(docs), labels)
tests = ["free lunch", "claim your money", "invoice for the project", "win win win", "noon meeting"]
assert [predict_nb(m, t) for t in tests] == list(nb.predict(cv.transform(tests))), "Your filter should agree with scikit-learn's MultinomialNB."`,
            },
          ],
          solution: py`import math

def train_nb(docs, labels):
    priors, counts, totals, vocab = {}, {}, {}, set()
    for doc, lab in zip(docs, labels):
        priors[lab] = priors.get(lab, 0) + 1
        bag = counts.setdefault(lab, {})
        for w in doc.lower().split():
            bag[w] = bag.get(w, 0) + 1
            totals[lab] = totals.get(lab, 0) + 1
            vocab.add(w)
    n = len(labels)
    return {"priors": {c: k / n for c, k in priors.items()}, "counts": counts, "totals": totals, "vocab": vocab}

def predict_nb(model, doc):
    V = len(model["vocab"])
    best, best_score = None, None
    for c in sorted(model["priors"]):
        score = math.log(model["priors"][c])
        for w in doc.lower().split():
            if w in model["vocab"]:
                score += math.log((model["counts"][c].get(w, 0) + 1) / (model["totals"][c] + V))
        if best_score is None or score > best_score:
            best, best_score = c, score
    return best
`,
          hint: "Training is counting: documents per class (priors), each word per class, total words per class, and the set of all words. Prediction sums logs: log prior plus, for each known word, log((count + 1) / (total + V)).",
          successMessage: "Counting words and applying Bayes' theorem gives a working spam filter that agrees with scikit-learn. This is how the first commercial spam filters worked.",
        },
      },
      {
        id: "a-ml-logistic-classifier",
        title: "Logistic regression as a classifier",
        explain:
          "LOGISTIC REGRESSION (Module 10) is the standard first classifier: fast, robust, gives calibrated-ish probabilities, and is INTERPRETABLE, since each standardised coefficient says how strongly a feature pushes towards the positive class (positive pushes up, negative down). scikit-learn's LogisticRegression is REGULARISED by default (L2, with C = 1.0; smaller C means stronger regularisation), so scale the features. Its boundary is linear, so it underfits curved patterns unless you add polynomial or interaction features. In practice, always train logistic regression first: if a complex model cannot beat it clearly, use the simpler one.",
        codeChallenge: {
          task:
            "Write fit_logistic(X_train, y_train, X_test, y_test, feature_names) that builds make_pipeline(StandardScaler(), LogisticRegression()), fits it, and returns a dictionary {\"accuracy\": test accuracy rounded to 3, \"strongest\": the name of the feature with the largest ABSOLUTE coefficient, \"direction\": \"up\" if that coefficient is positive else \"down\", \"proba_first\": the predicted probability of class 1 for the first test row, rounded to 3}.",
          starter: "import numpy as np\nfrom sklearn.pipeline import make_pipeline\nfrom sklearn.preprocessing import StandardScaler\nfrom sklearn.linear_model import LogisticRegression\n\ndef fit_logistic(X_train, y_train, X_test, y_test, feature_names):\n    pass\n",
          sample: "{\"accuracy\": 0.86, \"strongest\": \"f3\", \"direction\": \"down\", \"proba_first\": 0.12}",
          tests: [
            {
              check: CHURN + py`
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
names = ["f0", "f1", "f2", "f3", "f4", "f5"]
r = fit_logistic(X_train, y_train, X_test, y_test, names)
ref = make_pipeline(StandardScaler(), LogisticRegression()).fit(X_train, y_train)
coef = ref[-1].coef_[0]
i = int(np.argmax(np.abs(coef)))
assert r["accuracy"] == round(ref.score(X_test, y_test), 3), "Test accuracy. Got " + repr(r["accuracy"])
assert r["strongest"] == names[i] and r["direction"] == ("up" if coef[i] > 0 else "down"), "Strongest coefficient by absolute value, and its sign. Got " + repr(r)
assert r["proba_first"] == round(ref.predict_proba(X_test[:1])[0, 1], 3), "Probability of class 1 for the first test row."`,
            },
          ],
          solution: py`import numpy as np
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression

def fit_logistic(X_train, y_train, X_test, y_test, feature_names):
    model = make_pipeline(StandardScaler(), LogisticRegression()).fit(X_train, y_train)
    coef = model[-1].coef_[0]
    i = int(np.argmax(np.abs(coef)))
    return {
        "accuracy": round(model.score(X_test, y_test), 3),
        "strongest": feature_names[i],
        "direction": "up" if coef[i] > 0 else "down",
        "proba_first": round(model.predict_proba(X_test[:1])[0, 1], 3),
    }
`,
          hint: "model[-1] is the LogisticRegression step; its coef_[0] holds one weight per feature. predict_proba(X_test[:1])[0, 1] is P(class 1) for the first row.",
          successMessage: "Accuracy, the most influential feature and its direction, and a probability: logistic regression gives you a model AND an explanation.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 53 · 11.10 – 11.13
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ml-l53-ensembles-precision-recall",
    moduleId: "ml-m11-classification",
    sectionId: SECTION_ID,
    order: 5,
    covers: ["11.10", "11.11", "11.12", "11.13"],
    title: "Ensembles, Accuracy, Precision and Recall",
    subtitle: "Combining models, and measuring what kind of mistakes they make",
    estimatedMinutes: 40,
    intro:
      "Several models voting usually beat any one of them. And \"how accurate is it?\" is the wrong first question: what matters is which mistakes it makes, which precision and recall measure.",

    atoms: [
      {
        id: "a-ml-ensembles",
        title: "Ensemble learning fundamentals",
        explain:
          "An ENSEMBLE combines several models. BAGGING (bootstrap aggregating) trains copies of one algorithm on bootstrap samples and averages them: random forests. BOOSTING trains models SEQUENTIALLY, each focusing on the previous ones' mistakes: AdaBoost reweights misclassified rows; GRADIENT BOOSTING fits each new tree to the remaining errors (XGBoost, LightGBM and sklearn's HistGradientBoostingClassifier are the most successful algorithms on tabular data). VOTING combines different algorithms: hard voting takes the majority class, soft voting averages probabilities. STACKING trains a final model on the base models' predictions. Ensembles work when members are accurate AND make different errors.",
        codeChallenge: {
          task:
            "Write hard_vote(predictions) where predictions is a list of equal-length lists, one per model, of class labels; return the list of majority labels (on a tie, the label predicted by the EARLIEST model among the tied ones). Then write soft_vote(probas) where probas is a list of 2-D arrays (n_rows × n_classes), one per model: average them and return the argmax class index for each row as a list of ints.",
          starter: "import numpy as np\n\ndef hard_vote(predictions):\n    pass\n\ndef soft_vote(probas):\n    pass\n",
          sample: "hard_vote([[1, 0, 1], [1, 1, 0], [0, 1, 1]]) → [1, 1, 1]",
          tests: [
            {
              check: py`import numpy as np
assert hard_vote([[1, 0, 1], [1, 1, 0], [0, 1, 1]]) == [1, 1, 1], "Majority per row. Got " + repr(hard_vote([[1, 0, 1], [1, 1, 0], [0, 1, 1]]))
assert hard_vote([["a", "b"], ["b", "c"]]) == ["a", "b"], "Ties go to the earliest model's label."
p1 = np.array([[0.9, 0.1], [0.4, 0.6]])
p2 = np.array([[0.6, 0.4], [0.45, 0.55]])
p3 = np.array([[0.2, 0.8], [0.7, 0.3]])
assert soft_vote([p1, p2, p3]) == [0, 0], "Average probabilities: row 1 [0.567, 0.433] → 0; row 2 [0.517, 0.483] → 0. Got " + repr(soft_vote([p1, p2, p3]))
assert hard_vote([[0, 1], [0, 1], [1, 0]]) == [0, 1], "Hard voting can disagree with soft voting."`,
            },
          ],
          solution: py`import numpy as np

def hard_vote(predictions):
    out = []
    for row in zip(*predictions):
        counts = {}
        for lab in row:
            counts[lab] = counts.get(lab, 0) + 1
        top = max(counts.values())
        out.append(next(lab for lab in row if counts[lab] == top))
    return out

def soft_vote(probas):
    avg = np.mean(probas, axis=0)
    return [int(i) for i in avg.argmax(axis=1)]
`,
          hint: "zip(*predictions) walks the rows across models. Count labels, then return the first label in model order whose count is the maximum. Soft voting: np.mean(probas, axis=0).argmax(axis=1).",
          successMessage: "Hard voting counts labels; soft voting weighs confidence. sklearn's VotingClassifier does both for any mix of models.",
        },
      },
      {
        id: "a-ml-accuracy",
        title: "Evaluation: accuracy",
        explain:
          "ACCURACY = correct predictions / all predictions = (TP + TN) / (TP + TN + FP + FN), using the four outcomes of binary classification: TRUE POSITIVE (predicted positive, is positive), TRUE NEGATIVE, FALSE POSITIVE (a false alarm, \"Type I error\") and FALSE NEGATIVE (a miss, \"Type II error\"). Accuracy is fine when classes are balanced and both errors cost about the same. It is misleading when classes are imbalanced: with 2% fraud, a model that never flags fraud is 98% accurate and worthless (Module 1). Always compare accuracy with the majority-class rate.",
        codeExercise: {
          language: PY,
          code: py`from sklearn.metrics import accuracy_score

y_true = [0] * 96 + [1] * 4
never = [0] * 100
model = [0] * 93 + [1] * 3 + [1] * 3 + [0]
print(accuracy_score(y_true, never))
print(accuracy_score(y_true, model))
`,
          question: "100 transactions, 4 of them fraud. A model that never flags fraud versus a model that flags 6 (3 false alarms, 3 frauds caught). What are their accuracies?",
          expectedOutput: "0.96\n0.96",
          hint: "The useful model makes 3 false alarms and 1 miss: 4 mistakes, the same count as never flagging anything.",
          successMessage: "Identical accuracy, completely different value: one catches 3 of 4 frauds, the other none. Accuracy cannot tell them apart; precision and recall can.",
        },
      },
      {
        id: "a-ml-precision-recall",
        title: "Evaluation: precision and recall",
        explain:
          "PRECISION = TP / (TP + FP): of the cases flagged positive, how many really are? It matters when false alarms are costly (blocking legitimate cards, accusing innocent customers). RECALL (sensitivity, true positive rate) = TP / (TP + FN): of the actual positives, how many did we catch? It matters when misses are costly (undetected fraud, undiagnosed disease). They trade off through the threshold: lowering it raises recall and usually lowers precision. Report both, for the positive class, and choose the threshold where the business can live with both. For multiclass problems, compute them per class and average (macro or weighted).",
        codeChallenge: {
          task:
            "Without sklearn.metrics, write counts(y_true, y_pred) returning a dictionary {\"tp\", \"fp\", \"fn\", \"tn\"} for 0/1 labels, then precision(y_true, y_pred) and recall(y_true, y_pred), each returning 0.0 when its denominator is zero, otherwise the ratio rounded to 4.",
          starter: "def counts(y_true, y_pred):\n    pass\n\ndef precision(y_true, y_pred):\n    pass\n\ndef recall(y_true, y_pred):\n    pass\n",
          sample: "the fraud model above: precision 0.5 (3 of 6 flags are fraud), recall 0.75 (3 of 4 frauds caught)",
          tests: [
            {
              check: py`y_true = [0] * 96 + [1] * 4
model = [0] * 93 + [1] * 3 + [1] * 3 + [0]
assert counts(y_true, model) == {"tp": 3, "fp": 3, "fn": 1, "tn": 93}, "Got " + repr(counts(y_true, model))
assert precision(y_true, model) == 0.5 and recall(y_true, model) == 0.75, "Got " + repr((precision(y_true, model), recall(y_true, model)))
assert precision(y_true, [0] * 100) == 0.0 and recall(y_true, [0] * 100) == 0.0, "Never flagging: precision undefined (return 0.0), recall 0."
import random
from sklearn.metrics import precision_score, recall_score
rng = random.Random(3)
a = [rng.randint(0, 1) for _ in range(200)]
b = [rng.randint(0, 1) for _ in range(200)]
assert precision(a, b) == round(precision_score(a, b), 4) and recall(a, b) == round(recall_score(a, b), 4), "Must match scikit-learn on random labels."
assert "sklearn" not in source, "Write them yourself."`,
            },
          ],
          solution: py`def counts(y_true, y_pred):
    c = {"tp": 0, "fp": 0, "fn": 0, "tn": 0}
    for t, p in zip(y_true, y_pred):
        if p == 1 and t == 1:
            c["tp"] += 1
        elif p == 1:
            c["fp"] += 1
        elif t == 1:
            c["fn"] += 1
        else:
            c["tn"] += 1
    return c

def precision(y_true, y_pred):
    c = counts(y_true, y_pred)
    flagged = c["tp"] + c["fp"]
    return round(c["tp"] / flagged, 4) if flagged else 0.0

def recall(y_true, y_pred):
    c = counts(y_true, y_pred)
    actual = c["tp"] + c["fn"]
    return round(c["tp"] / actual, 4) if actual else 0.0
`,
          hint: "Classify each (true, predicted) pair into one of the four counts. precision = tp / (tp + fp); recall = tp / (tp + fn); guard against zero denominators.",
          successMessage: "Half the flags are real fraud, and three quarters of all fraud is caught: two numbers that describe the model far better than 96% accuracy.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 54 · 11.14 – 11.17
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ml-l54-f1-confusion-roc-auc",
    moduleId: "ml-m11-classification",
    sectionId: SECTION_ID,
    order: 6,
    covers: ["11.14", "11.15", "11.16", "11.17"],
    title: "F1, Confusion Matrices, ROC Curves and AUC",
    subtitle: "One number for the trade-off, the full picture, and threshold-free comparison",
    estimatedMinutes: 42,
    intro:
      "The F1-score combines precision and recall; the confusion matrix shows every kind of mistake; the ROC curve shows the trade-off at every threshold; and AUC summarises it in one threshold-free number.",

    atoms: [
      {
        id: "a-ml-f1-confusion",
        title: "F1-score and the confusion matrix",
        explain:
          "The F1-SCORE is the HARMONIC mean of precision and recall: F1 = 2PR / (P + R). The harmonic mean punishes imbalance: P = 1.0 with R = 0.1 gives F1 = 0.18, not the arithmetic 0.55, so a model must do well on BOTH to score well. (Fβ weights recall β times as much as precision.) The CONFUSION MATRIX tabulates every combination of true and predicted class: in scikit-learn's confusion_matrix, rows are TRUE classes and columns PREDICTED classes, so for binary labels it is [[TN, FP], [FN, TP]]. For multiclass problems it shows exactly which classes are confused with which, such as early blight mistaken for late blight.",
        codeChallenge: {
          task:
            "Without sklearn.metrics, write confusion(y_true, y_pred, labels) that returns the confusion matrix as a list of lists, rows = true label and columns = predicted label, both in the order of labels. Then write f1(precision, recall) that returns the harmonic mean rounded to 4 (0.0 if both are 0).",
          starter: "def confusion(y_true, y_pred, labels):\n    pass\n\ndef f1(precision, recall):\n    pass\n",
          sample: "confusion([0, 1, 1, 0], [0, 1, 0, 0], [0, 1]) → [[2, 0], [1, 1]]",
          tests: [
            {
              check: py`assert confusion([0, 1, 1, 0], [0, 1, 0, 0], [0, 1]) == [[2, 0], [1, 1]], "Rows are true labels, columns predicted. Got " + repr(confusion([0, 1, 1, 0], [0, 1, 0, 0], [0, 1]))
t = ["cat", "dog", "bird", "dog", "cat", "bird"]
p = ["cat", "cat", "bird", "dog", "dog", "dog"]
assert confusion(t, p, ["bird", "cat", "dog"]) == [[1, 0, 1], [0, 1, 1], [0, 1, 1]], "Got " + repr(confusion(t, p, ["bird", "cat", "dog"]))
from sklearn.metrics import confusion_matrix
assert confusion(t, p, ["bird", "cat", "dog"]) == confusion_matrix(t, p, labels=["bird", "cat", "dog"]).tolist(), "Must match scikit-learn."
assert f1(0.5, 0.75) == 0.6 and f1(1.0, 0.1) == 0.1818 and f1(0, 0) == 0.0, "Harmonic mean: 2PR / (P + R)."`,
            },
          ],
          solution: py`def confusion(y_true, y_pred, labels):
    pos = {lab: i for i, lab in enumerate(labels)}
    m = [[0] * len(labels) for _ in labels]
    for t, p in zip(y_true, y_pred):
        m[pos[t]][pos[p]] += 1
    return m

def f1(precision, recall):
    if precision + recall == 0:
        return 0.0
    return round(2 * precision * recall / (precision + recall), 4)
`,
          hint: "Map each label to its index; start from a zero matrix; for each pair add 1 at [index of true][index of predicted].",
          successMessage: "Precision 1.0 with recall 0.1 gives F1 0.18: the harmonic mean refuses to let one good number hide a bad one.",
        },
      },
      {
        id: "a-ml-roc-curve",
        title: "Evaluation: the ROC curve",
        explain:
          "Every threshold gives one (false positive rate, true positive rate) pair, where TPR = recall = TP / (TP + FN) and FPR = FP / (FP + TN), the share of negatives wrongly flagged. The ROC CURVE (receiver operating characteristic, from wartime radar) plots TPR against FPR as the threshold sweeps from high to low: it starts at (0, 0) (flag nothing) and ends at (1, 1) (flag everything). A random classifier lies on the diagonal; a perfect one goes straight up to (0, 1). The curve shows every trade-off the model offers, independent of any single threshold, so you can pick the operating point the business needs.",
        codeChallenge: {
          task:
            "Write roc_points(y_true, scores) that returns a list of (fpr, tpr) tuples, rounded to 4, starting with (0.0, 0.0): sort the distinct scores in DESCENDING order and, for each threshold t, predict positive where score ≥ t and compute the rates. (The last threshold, the smallest score, flags everything, giving (1.0, 1.0).)",
          starter: "import numpy as np\n\ndef roc_points(y_true, scores):\n    pass\n",
          sample: "roc_points([1, 0, 1, 0], [0.9, 0.8, 0.7, 0.1]) → [(0.0, 0.0), (0.0, 0.5), (0.5, 0.5), (0.5, 1.0), (1.0, 1.0)]",
          tests: [
            {
              check: py`import numpy as np
pts = roc_points([1, 0, 1, 0], [0.9, 0.8, 0.7, 0.1])
assert pts == [(0.0, 0.0), (0.0, 0.5), (0.5, 0.5), (0.5, 1.0), (1.0, 1.0)], "Got " + repr(pts)
perfect = roc_points([0, 0, 1, 1], [0.1, 0.2, 0.8, 0.9])
assert (0.0, 1.0) in perfect, "A perfect ranking reaches (0, 1)."
from sklearn.metrics import roc_curve
rng = np.random.default_rng(2)
y = rng.integers(0, 2, 60)
s = np.round(rng.uniform(0, 1, 60) + 0.4 * y, 3)
fpr, tpr, _ = roc_curve(y, s, drop_intermediate=False)
mine = roc_points(y, s)
assert mine == [(round(a, 4), round(b, 4)) for a, b in zip(fpr, tpr)], "Must match scikit-learn's roc_curve (drop_intermediate=False)."`,
            },
          ],
          solution: py`import numpy as np

def roc_points(y_true, scores):
    y = np.asarray(y_true)
    s = np.asarray(scores)
    pos, neg = (y == 1).sum(), (y == 0).sum()
    points = [(0.0, 0.0)]
    for t in sorted(set(s.tolist()), reverse=True):
        pred = s >= t
        tpr = ((pred) & (y == 1)).sum() / pos
        fpr = ((pred) & (y == 0)).sum() / neg
        points.append((round(float(fpr), 4), round(float(tpr), 4)))
    return points
`,
          hint: "pos and neg are the class counts. For each distinct score t from high to low: pred = scores >= t; tpr = (pred & positive).sum() / pos; fpr = (pred & negative).sum() / neg.",
          successMessage: "Your curve matches scikit-learn's point for point. Each point is one threshold; the curve is the model's whole menu of trade-offs.",
        },
      },
      {
        id: "a-ml-auc",
        title: "Evaluation: AUC",
        explain:
          "AUC, the AREA UNDER the ROC curve, summarises it in one number from 0 to 1: 0.5 is random guessing, 1.0 a perfect ranking, and below 0.5 worse than random (flip the predictions). It has a beautiful interpretation: AUC is the PROBABILITY that a randomly chosen positive gets a higher score than a randomly chosen negative. Because it uses the scores' ORDER only, it does not depend on any threshold or on the scores' calibration, which makes it the standard way to compare classifiers. With heavy imbalance, also look at the precision-recall curve and its average precision, which focus on the rare positive class.",
        codeExercise: {
          language: PY,
          code: py`import numpy as np
from sklearn.metrics import roc_auc_score

y = np.array([1, 0, 1, 0])
s = np.array([0.9, 0.8, 0.7, 0.1])
print(roc_auc_score(y, s))

pos, neg = s[y == 1], s[y == 0]
pairs = [(p > n) + 0.5 * (p == n) for p in pos for n in neg]
print(sum(pairs) / len(pairs))
print(roc_auc_score(y, 1 - s), roc_auc_score(y, s * 100))
`,
          question: "Compute AUC with scikit-learn, then as the share of (positive, negative) pairs ranked correctly, then for reversed and rescaled scores. What does it print?",
          expectedOutput: "0.75\n0.75\n0.25 0.75",
          hint: "Pairs: 0.9 beats 0.8 and 0.1; 0.7 beats 0.1 but not 0.8. Reversing the scores reverses every pair; multiplying by 100 changes nothing about the order.",
          successMessage: "AUC is the fraction of positive-negative pairs ranked correctly: it only cares about order, which is why rescaling the scores leaves it unchanged.",
        },
      },
    ],

    task: {
      title: "Module 11 project: a churn predictor or spam classifier",
      intro:
        "Build either a customer churn prediction system (a telecom or bank churn dataset) or an email/SMS spam classifier (a public SMS spam collection, or messages you label yourself), and evaluate it like a professional.",
      prompts: [
        "Prepare the data with a leakage-free split and preprocessing; state the class balance and the majority-class baseline.",
        "Train logistic regression, KNN, a decision tree, a random forest, an SVM and (for spam) Naive Bayes.",
        "For each model report precision, recall, F1 and AUC on the validation data, in one comparison table.",
        "Plot the confusion matrix and the ROC curve of the best two models on one chart.",
        "Choose a decision threshold from the business costs (for example, a missed churner costs ₦15,000 and a retention offer ₦2,000), and justify it.",
        "Try one ensemble (soft voting or gradient boosting) and report whether it beats the best single model.",
        "Evaluate the final model once on the test set and write a one-page summary for a non-technical manager.",
      ],
      closing: "Classification needs labels. Module 12 finds structure in data that has none: clustering, dimensionality reduction and anomaly detection.",
    },

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
