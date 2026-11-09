/**
 * MACHINE LEARNING AND AI · MODULE 12 · UNSUPERVISED LEARNING
 *
 * Curriculum 12.1 – 12.10. Clustering with k-means, hierarchical clustering
 * and DBSCAN; choosing the number of clusters; dimensionality reduction and
 * PCA; anomaly detection; and evaluating clusters. The learner implements
 * k-means (Lloyd's algorithm) and PCA (eigenvectors of the covariance
 * matrix, Module 3) and checks both against scikit-learn.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

export const SECTION_ID = "ml-s12-unsupervised";

const PY = "python";
const py = String.raw;

// Customer data with four natural segments, shared by several checks.
const CUSTOMERS = py`import numpy as np
from sklearn.datasets import make_blobs
X, true_segment = make_blobs(n_samples=400, centers=[[20, 80], [60, 20], [80, 85], [35, 40]], cluster_std=7, random_state=12)
`;

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 55 · 12.1 – 12.3
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ml-l55-clustering-kmeans",
    moduleId: "ml-m12-unsupervised",
    sectionId: SECTION_ID,
    order: 1,
    covers: ["12.1", "12.2", "12.3"],
    title: "Unsupervised Learning, Clustering and K-Means",
    subtitle: "Finding groups nobody labelled",
    estimatedMinutes: 38,
    intro:
      "Most data has no labels. Unsupervised learning finds structure anyway: groups of similar customers, the main directions of variation, the rows that do not fit. It starts with the most used clustering algorithm, k-means.",

    atoms: [
      {
        id: "a-ml-unsupervised-intro",
        title: "Understanding unsupervised learning",
        explain:
          "UNSUPERVISED learning works on X alone, with no target y. Its main tasks: CLUSTERING (group similar rows: customer segments, document topics), DIMENSIONALITY REDUCTION (summarise many columns in a few: visualisation, compression, noise removal), ANOMALY DETECTION (find rows unlike the rest: fraud, faults) and ASSOCIATION RULES (items bought together). There is no \"right answer\" to score against, so results are judged by internal measures (how compact and separated clusters are), by stability, and above all by USEFULNESS: a segmentation is good if the marketing team can act on it. Unsupervised outputs often become features for supervised models.",
        decision: {
          scenario: "A bank has 2 million customers' transaction histories and no labels. Marketing wants to design four different savings products for \"different kinds of customer\".",
          question: "Which approach fits?",
          options: [
            { id: "a", text: "Classification with logistic regression", whyWrong: "There are no labels to learn from." },
            { id: "b", text: "Clustering the customers by behaviour, then interpreting each cluster", why: "No labels, and the goal is to discover groups. Clustering finds them; people then name and act on them." },
            { id: "c", text: "Regression on account balance", whyWrong: "Predicting a number is not finding groups." },
            { id: "d", text: "Reinforcement learning", whyWrong: "There is no agent taking actions for rewards." },
          ],
          correct: "b",
          aftermath: "No labels plus \"find the kinds of X\" means clustering.",
        },
      },
      {
        id: "a-ml-clustering",
        title: "Clustering",
        explain:
          "CLUSTERING partitions rows so that rows in the same cluster are SIMILAR and rows in different clusters are DIFFERENT, where similarity is usually a distance, so features must be SCALED (Module 8). Families of algorithms: CENTROID-based (k-means: each cluster is represented by its centre); HIERARCHICAL (a tree of nested merges); DENSITY-based (DBSCAN: clusters are dense regions separated by sparse ones); and model-based (Gaussian mixtures: soft, probabilistic membership). They make different assumptions about cluster SHAPE, so the same data can give different clusters with each, and the choice depends on the data and the purpose.",
        codeExercise: {
          language: PY,
          code: CUSTOMERS + py`from sklearn.cluster import KMeans

km = KMeans(n_clusters=4, n_init=10, random_state=0).fit(X)
print(np.bincount(km.labels_))
print(np.round(km.cluster_centers_[np.argsort(km.cluster_centers_[:, 0])]).astype(int).tolist())
`,
          question: "400 customers (annual income in ₦100k, spending score) were generated around four centres: (20, 80), (35, 40), (60, 20) and (80, 85). k-means is given only X. What cluster sizes and centres (sorted by income) does it find?",
          expectedOutput: "[100 100 100 100]\n[[19, 79], [35, 41], [61, 19], [81, 84]]",
          hint: "The four groups are well separated, so k-means recovers 100 customers each, with centres close to the true ones.",
          successMessage: "Without any labels, k-means found the four segments and their centres. Naming them (\"young big spenders\", \"cautious earners\") is the human part.",
        },
      },
      {
        id: "a-ml-kmeans",
        title: "K-Means clustering",
        explain:
          "K-MEANS (Lloyd's algorithm): choose k; place k initial CENTROIDS; then repeat two steps until nothing changes: (1) ASSIGN each point to its nearest centroid; (2) UPDATE each centroid to the mean of its assigned points. Each step can only decrease the INERTIA, the sum of squared distances from points to their centroids, so the algorithm always converges, though possibly to a poor local minimum. scikit-learn guards against that with k-means++ initialisation (spreading the starting centroids apart) and n_init restarts, keeping the best. k-means assumes roughly round clusters of similar size, needs k in advance, and is sensitive to scale and outliers.",
        codeChallenge: {
          task:
            "Write kmeans(X, init_centroids, max_iter=100) without scikit-learn, starting from the given centroids (a k × d array). Repeat: assign each point to the nearest centroid (Euclidean), recompute each centroid as the mean of its points (keep the old centroid if a cluster is empty), and stop when the assignments no longer change. Return (labels, centroids, inertia) with inertia the sum of squared distances from each point to its centroid.",
          starter: "import numpy as np\n\ndef kmeans(X, init_centroids, max_iter=100):\n    pass\n",
          sample: "starting from four customers as centroids, it converges to the same clusters as scikit-learn's KMeans with the same start",
          tests: [
            {
              check: CUSTOMERS + py`
from sklearn.cluster import KMeans
init = X[[0, 1, 2, 3]].astype(float)
labels, cents, inertia = kmeans(X, init.copy())
ref = KMeans(n_clusters=4, init=init, n_init=1, max_iter=100, algorithm="lloyd").fit(X)
assert labels.shape == (400,) and cents.shape == (4, 2), "One label per point, one centroid per cluster."
assert np.allclose(np.sort(cents, axis=0), np.sort(ref.cluster_centers_, axis=0), atol=1e-6), "Centroids should match scikit-learn's from the same start."
assert abs(inertia - ref.inertia_) < 1e-6 * ref.inertia_, "Inertia should match scikit-learn's. Got " + repr(inertia)
toy = np.array([[0.0, 0.0], [0.0, 1.0], [10.0, 10.0], [10.0, 11.0]])
lab, c, i = kmeans(toy, np.array([[0.0, 0.0], [10.0, 10.0]]))
assert lab.tolist() == [0, 0, 1, 1] and np.allclose(c, [[0, 0.5], [10, 10.5]]) and abs(i - 1.0) < 1e-12, "Two obvious clusters. Got " + repr((lab, c, i))
assert "sklearn" not in source, "Write k-means yourself."`,
            },
          ],
          solution: py`import numpy as np

def kmeans(X, init_centroids, max_iter=100):
    X = np.asarray(X, float)
    cents = np.asarray(init_centroids, float).copy()
    labels = None
    for _ in range(max_iter):
        d = ((X[:, None, :] - cents[None, :, :]) ** 2).sum(axis=2)
        new = d.argmin(axis=1)
        if labels is not None and np.array_equal(new, labels):
            break
        labels = new
        for j in range(len(cents)):
            members = X[labels == j]
            if len(members):
                cents[j] = members.mean(axis=0)
    inertia = float(((X - cents[labels]) ** 2).sum())
    return labels, cents, inertia
`,
          hint: "Squared distances to every centroid at once: ((X[:, None, :] - cents[None, :, :]) ** 2).sum(axis=2) gives an n × k array; argmin(axis=1) assigns. Then update each centroid with the mean of its members.",
          successMessage: "Assign, update, repeat until stable: your k-means matches scikit-learn's from the same start. Broadcasting computed every point-to-centroid distance in one expression.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 56 · 12.4 – 12.6
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ml-l56-hierarchical-dbscan-k",
    moduleId: "ml-m12-unsupervised",
    sectionId: SECTION_ID,
    order: 2,
    covers: ["12.4", "12.5", "12.6"],
    title: "Hierarchical Clustering, DBSCAN and Choosing k",
    subtitle: "Trees of clusters, clusters of any shape, and how many clusters there are",
    estimatedMinutes: 38,
    intro:
      "k-means needs k in advance and assumes round clusters. Hierarchical clustering shows every level of grouping at once, DBSCAN finds clusters of any shape and flags noise, and two measures help choose k.",

    atoms: [
      {
        id: "a-ml-hierarchical",
        title: "Hierarchical clustering",
        explain:
          "AGGLOMERATIVE hierarchical clustering starts with every point as its own cluster and repeatedly MERGES the two closest clusters until one remains. The full history is a tree, the DENDROGRAM; cutting it at a chosen height gives any number of clusters, so k need not be fixed in advance. LINKAGE defines the distance between clusters: SINGLE (closest pair of points: finds long chains, sensitive to noise), COMPLETE (farthest pair: compact clusters), AVERAGE, and WARD (the merge that least increases total within-cluster variance, similar to k-means and usually the default). It needs all pairwise distances, so it suits thousands of rows, not millions.",
        codeExercise: {
          language: PY,
          code: py`import numpy as np
from scipy.cluster.hierarchy import linkage, fcluster

points = np.array([[0.0], [1.0], [5.0], [6.0], [20.0]])
Z = linkage(points, method="single")
print(Z[:, :3].round(1).tolist())
print(fcluster(Z, t=2, criterion="maxclust").tolist())
print(fcluster(Z, t=3, criterion="maxclust").tolist())
`,
          question: "Single-linkage merges on five points along a line. Each row of Z is (cluster a, cluster b, distance); new clusters are numbered from 5. What are the merges, and the 2- and 3-cluster cuts?",
          expectedOutput: "[[0.0, 1.0, 1.0], [2.0, 3.0, 1.0], [5.0, 6.0, 4.0], [4.0, 7.0, 14.0]]\n[1, 1, 1, 1, 2]\n[1, 1, 2, 2, 3]",
          hint: "0 and 1 are 1 apart; so are 5 and 6. The two pairs are then 4 apart (1 to 5). 20 is 14 from 6.",
          successMessage: "One run gives every clustering at once: cut the tree for 2 clusters or 3. The point at 20 joins last, a hint that it may be an outlier.",
        },
      },
      {
        id: "a-ml-dbscan",
        title: "DBSCAN",
        explain:
          "DBSCAN (density-based spatial clustering of applications with noise) defines clusters as DENSE regions. A point is a CORE point if at least min_samples points lie within distance eps of it; clusters grow by connecting core points that are within eps of each other, plus the BORDER points they reach. Points in no dense region are NOISE, labelled −1. Advantages: no k needed, clusters of ANY SHAPE (rings, crescents), and outliers are identified, not forced into a cluster. Drawbacks: eps and min_samples need tuning (a k-distance plot helps), and it struggles when clusters have very different densities.",
        codeChallenge: {
          task:
            "Write compare_shapes(X, true_labels) that clusters X with KMeans(n_clusters=2, n_init=10, random_state=0) and with DBSCAN(eps=0.2, min_samples=5) and returns a dictionary {\"kmeans_ari\": ..., \"dbscan_ari\": ..., \"dbscan_clusters\": ..., \"dbscan_noise\": ...} where the ARIs are adjusted_rand_score(true_labels, predicted) rounded to 3, dbscan_clusters counts distinct cluster labels other than −1, and dbscan_noise counts points labelled −1. The test supplies two crescent moons and their true labels.",
          starter: "from sklearn.cluster import KMeans, DBSCAN\nfrom sklearn.metrics import adjusted_rand_score\n\ndef compare_shapes(X, true_labels):\n    pass\n",
          sample: "k-means cuts the moons with a straight line (ARI ≈ 0.25); DBSCAN follows their shape (ARI near 1)",
          tests: [
            {
              check: py`import numpy as np
from sklearn.datasets import make_moons
X, true_labels = make_moons(n_samples=300, noise=0.06, random_state=1)
r = compare_shapes(X, true_labels)
assert set(r) == {"kmeans_ari", "dbscan_ari", "dbscan_clusters", "dbscan_noise"}, "Return the four keys. Got " + repr(r)
assert r["kmeans_ari"] < 0.6, "k-means assumes round clusters and cannot follow the moons. Got " + str(r["kmeans_ari"])
assert r["dbscan_ari"] > 0.9 and r["dbscan_clusters"] == 2, "DBSCAN should find the two moons. Got " + repr(r)
assert isinstance(r["dbscan_noise"], int) and r["dbscan_noise"] < 15, "Few points should be noise."`,
            },
          ],
          solution: py`from sklearn.cluster import KMeans, DBSCAN
from sklearn.metrics import adjusted_rand_score

def compare_shapes(X, true_labels):
    km = KMeans(n_clusters=2, n_init=10, random_state=0).fit_predict(X)
    db = DBSCAN(eps=0.2, min_samples=5).fit_predict(X)
    return {
        "kmeans_ari": round(adjusted_rand_score(true_labels, km), 3),
        "dbscan_ari": round(adjusted_rand_score(true_labels, db), 3),
        "dbscan_clusters": len(set(db.tolist()) - {-1}),
        "dbscan_noise": int((db == -1).sum()),
    }
`,
          hint: "fit_predict returns the labels. len(set(labels.tolist()) - {-1}) counts clusters; (labels == -1).sum() counts noise.",
          successMessage: "Same data, two assumptions: k-means draws a straight boundary between round blobs; DBSCAN follows density along each crescent.",
        },
      },
      {
        id: "a-ml-choosing-k-clusters",
        title: "Choosing the number of clusters",
        explain:
          "Two common aids. The ELBOW METHOD plots inertia against k: inertia always falls as k grows (k = n gives 0), but the drop slows sharply after the natural number of clusters, leaving an \"elbow\". The SILHOUETTE SCORE measures, for each point, (b − a) / max(a, b), where a is its mean distance to its own cluster and b to the nearest other cluster: near 1 means well placed, near 0 on a boundary, negative probably misassigned. The average silhouette is highest for the best-separated clustering. Neither replaces judgement: the right k is also the one the business can act on.",
        codeChallenge: {
          task:
            "Write scan_k(X, ks) that fits KMeans(n_clusters=k, n_init=10, random_state=0) for each k in ks and returns (best_k, inertias, silhouettes): inertias and silhouettes are dictionaries {k: value rounded to 3}, using silhouette_score(X, labels), and best_k is the k with the highest silhouette.",
          starter: "from sklearn.cluster import KMeans\nfrom sklearn.metrics import silhouette_score\n\ndef scan_k(X, ks):\n    pass\n",
          sample: "for the four customer segments: best_k → 4",
          tests: [
            {
              check: CUSTOMERS + py`
best, inert, sil = scan_k(X, [2, 3, 4, 5, 6])
assert set(inert) == set(sil) == {2, 3, 4, 5, 6}, "One value per k."
assert all(inert[a] > inert[b] for a, b in [(2, 3), (3, 4), (4, 5), (5, 6)]), "Inertia falls as k grows."
assert best == 4, "The silhouette should peak at the 4 true segments. Got " + str(best) + " from " + repr(sil)
drop = [inert[k] - inert[k + 1] for k in [2, 3, 4, 5]]
assert drop[1] > 3 * drop[2], "The elbow: the drop from 3 to 4 is far bigger than from 4 to 5."`,
            },
          ],
          solution: py`from sklearn.cluster import KMeans
from sklearn.metrics import silhouette_score

def scan_k(X, ks):
    inertias, silhouettes = {}, {}
    for k in ks:
        km = KMeans(n_clusters=k, n_init=10, random_state=0).fit(X)
        inertias[k] = round(km.inertia_, 3)
        silhouettes[k] = round(silhouette_score(X, km.labels_), 3)
    return max(silhouettes, key=silhouettes.get), inertias, silhouettes
`,
          hint: "For each k: km = KMeans(...).fit(X); km.inertia_ and silhouette_score(X, km.labels_). Return the key with the highest silhouette.",
          successMessage: "The elbow and the silhouette both pointed to 4, the true number of segments. On messy real data they often disagree, and judgement decides.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 57 · 12.7 – 12.8
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ml-l57-dimensionality-pca",
    moduleId: "ml-m12-unsupervised",
    sectionId: SECTION_ID,
    order: 3,
    covers: ["12.7", "12.8"],
    title: "Dimensionality Reduction and PCA",
    subtitle: "Many columns summarised in a few, with the least information lost",
    estimatedMinutes: 38,
    intro:
      "An image has 784 pixels, a survey 200 questions, a gene panel 20,000 measurements. Dimensionality reduction keeps the information and drops the redundancy, and PCA, built on Module 3's eigenvectors, is its classic tool.",

    atoms: [
      {
        id: "a-ml-dimensionality-reduction",
        title: "Dimensionality reduction",
        explain:
          "DIMENSIONALITY REDUCTION maps data with many features to fewer while keeping its essential structure. Why: VISUALISATION (only 2 or 3 dimensions can be plotted); SPEED and memory; NOISE removal; fighting the CURSE OF DIMENSIONALITY (in high dimensions every point is far from every other, so distance-based methods weaken and models need far more data); and removing MULTICOLLINEARITY. Two approaches: FEATURE SELECTION keeps a subset of the original columns (Module 8); FEATURE EXTRACTION builds new columns combining the originals: PCA (linear), and t-SNE or UMAP (non-linear, mainly for visualisation).",
        codeExercise: {
          language: PY,
          code: py`import numpy as np

rng = np.random.default_rng(0)
for d in [2, 10, 100, 1000]:
    pts = rng.uniform(0, 1, (200, d))
    dist = np.linalg.norm(pts[:, None] - pts[None], axis=2)
    off = dist[~np.eye(200, dtype=bool)]
    print(d, round(off.min() / off.max(), 2))
`,
          question: "The curse of dimensionality: for 200 random points in d dimensions, compare the nearest pair's distance with the farthest pair's. What ratio is printed for each d?",
          expectedOutput: "2 0.0\n10 0.18\n100 0.62\n1000 0.86",
          hint: "In 2 dimensions some points are almost on top of each other. In 1,000 dimensions every pair is at nearly the same distance.",
          successMessage: "In 1,000 dimensions the nearest and farthest points are almost equally far: \"nearest neighbour\" stops meaning much. That is why high-dimensional data is reduced first.",
        },
      },
      {
        id: "a-ml-pca",
        title: "Principal Component Analysis (PCA)",
        explain:
          "PCA finds new axes, the PRINCIPAL COMPONENTS, ordered by how much of the data's variance lies along them: the 1st component is the direction of greatest variance, the 2nd the greatest remaining variance perpendicular to the 1st, and so on. Mathematically they are the EIGENVECTORS of the covariance matrix of the centred data, and each eigenvalue is the variance along its component (Module 3). Projecting onto the top k components keeps as much variance as possible in k dimensions; explained_variance_ratio_ reports each component's share, and a common rule keeps enough components for 90–95%. STANDARDISE first, or features with large units dominate. The components are combinations of all features, which costs interpretability.",
        codeChallenge: {
          task:
            "Without scikit-learn, write pca(X, k) that centres X (subtract column means), computes the covariance matrix with np.cov(Xc, rowvar=False), takes its eigenvectors with np.linalg.eigh, orders them by DESCENDING eigenvalue, keeps the top k, and returns (projected, ratios): the centred data projected onto the k components (an n × k array) and the explained variance ratio of each kept component (eigenvalue / sum of all eigenvalues).",
          starter: "import numpy as np\n\ndef pca(X, k):\n    pass\n",
          sample: "on correlated data, the first component explains most of the variance; the projection matches scikit-learn's PCA up to sign",
          tests: [
            {
              check: py`import numpy as np
from sklearn.decomposition import PCA
rng = np.random.default_rng(5)
base = rng.normal(size=(300, 2))
X = np.column_stack([base[:, 0], 2 * base[:, 0] + 0.3 * rng.normal(size=300), base[:, 1], rng.normal(size=300) * 0.1])
proj, ratios = pca(X, 2)
ref = PCA(n_components=2).fit(X)
assert proj.shape == (300, 2), "Project onto 2 components. Got " + repr(proj.shape)
assert np.allclose(ratios, ref.explained_variance_ratio_), "Explained variance ratios must match scikit-learn. Got " + repr(ratios)
ref_proj = ref.transform(X)
for j in range(2):
    assert np.allclose(proj[:, j], ref_proj[:, j]) or np.allclose(proj[:, j], -ref_proj[:, j]), "Component " + str(j + 1) + " must match scikit-learn up to sign."
assert ratios[0] > 0.7, "The first component should carry most of the variance."
assert "sklearn" not in source, "Use NumPy's eigh, not scikit-learn."`,
            },
          ],
          solution: py`import numpy as np

def pca(X, k):
    Xc = X - X.mean(axis=0)
    cov = np.cov(Xc, rowvar=False)
    values, vectors = np.linalg.eigh(cov)
    order = np.argsort(values)[::-1]
    values, vectors = values[order], vectors[:, order]
    components = vectors[:, :k]
    return Xc @ components, values[:k] / values.sum()
`,
          hint: "eigh returns eigenvalues in ascending order; reverse with order = np.argsort(values)[::-1] and reorder both values and the columns of vectors. Project with Xc @ vectors[:, :k].",
          successMessage: "PCA is nothing more than Module 3's eigenvectors of the covariance matrix. Signs can flip because −v is an eigenvector whenever v is.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 58 · 12.9 – 12.10
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ml-l58-anomalies-evaluation",
    moduleId: "ml-m12-unsupervised",
    sectionId: SECTION_ID,
    order: 4,
    covers: ["12.9", "12.10"],
    title: "Anomaly Detection and Evaluating Clusters",
    subtitle: "Finding the rows that do not belong, and judging clusters without labels",
    estimatedMinutes: 36,
    intro:
      "Fraudulent transactions, failing machines and network intrusions are rare and unlike normal behaviour. Anomaly detection finds them without labels. Then: how do you judge any clustering when there is no answer key?",

    atoms: [
      {
        id: "a-ml-anomaly-detection",
        title: "Anomaly detection",
        explain:
          "ANOMALY (outlier) DETECTION identifies observations that deviate strongly from the normal pattern. Statistical methods flag values far from the mean or outside the IQR fences (Module 6), one feature at a time. Multivariate methods catch combinations that are unusual even when each value alone is ordinary (a normal amount, at a normal hour, but from a new country): ISOLATION FOREST isolates points with random splits, and anomalies, being few and different, are isolated in fewer splits; LOCAL OUTLIER FACTOR compares a point's local density with its neighbours'; ONE-CLASS SVM learns a boundary around normal data. The contamination parameter sets the expected share of anomalies. Flags usually go to a human reviewer, and confirmed cases can later train a supervised model.",
        codeChallenge: {
          task:
            "Write find_anomalies(X, contamination=0.02) that fits IsolationForest(contamination=contamination, random_state=0) and returns a tuple (flagged, scores): flagged is a sorted list of the row indices predicted as anomalies (predict returns −1 for them), and scores is the array from score_samples (lower means more anomalous).",
          starter: "import numpy as np\nfrom sklearn.ensemble import IsolationForest\n\ndef find_anomalies(X, contamination=0.02):\n    pass\n",
          sample: "500 normal transactions plus 10 planted unusual ones: most of the planted rows are flagged",
          tests: [
            {
              check: py`import numpy as np
rng = np.random.default_rng(9)
normal = np.column_stack([rng.lognormal(9, 0.5, 500), rng.normal(14, 3, 500)])
odd = np.column_stack([rng.lognormal(12.5, 0.3, 10), rng.uniform(1, 4, 10)])
X = np.vstack([normal, odd])
flagged, scores = find_anomalies(X, contamination=0.02)
assert isinstance(flagged, list) and flagged == sorted(flagged), "Return a sorted list of row indices."
assert len(flagged) in (10, 11), "contamination=0.02 of 510 rows flags about 10. Got " + str(len(flagged))
planted = set(range(500, 510))
assert len(planted & set(flagged)) >= 8, "Most of the 10 planted anomalies should be flagged. Found " + str(len(planted & set(flagged)))
assert scores.shape == (510,) and scores[500:].mean() < scores[:500].mean(), "Planted rows should have lower (more anomalous) scores."`,
            },
          ],
          solution: py`import numpy as np
from sklearn.ensemble import IsolationForest

def find_anomalies(X, contamination=0.02):
    model = IsolationForest(contamination=contamination, random_state=0).fit(X)
    flagged = sorted(np.flatnonzero(model.predict(X) == -1).tolist())
    return flagged, model.score_samples(X)
`,
          hint: "model = IsolationForest(contamination=..., random_state=0).fit(X); predict(X) == -1 marks anomalies; np.flatnonzero gives their indices.",
          successMessage: "Huge amounts at 2 a.m. were isolated quickly by random splits, without a single fraud label. In production, the flagged list goes to an analyst's queue.",
        },
      },
      {
        id: "a-ml-evaluating-clusters",
        title: "Evaluating clustering results",
        explain:
          "INTERNAL measures use only the data: INERTIA (lower is tighter, but always falls with k), the SILHOUETTE score (−1 to 1, higher is better), DAVIES-BOULDIN (lower is better) and CALINSKI-HARABASZ (higher is better). EXTERNAL measures compare with known labels when a few exist: the ADJUSTED RAND INDEX (ARI: 1 for a perfect match, about 0 for random) and normalised mutual information; both ignore the arbitrary cluster NUMBERS, since cluster 2 in one run can be cluster 0 in another. The most important test is PRACTICAL: profile each cluster (means of key features, size), check that clusters are stable across random seeds and subsamples, and ask whether each is distinct and actionable.",
        codeChallenge: {
          task:
            "Write cluster_report(X, labels, true_labels=None) that returns a dictionary with \"silhouette\" (silhouette_score rounded to 3), \"davies_bouldin\" (davies_bouldin_score rounded to 3), \"sizes\" (a list of cluster sizes ordered by cluster label), and, only if true_labels is given, \"ari\" (adjusted_rand_score rounded to 3).",
          starter: "import numpy as np\nfrom sklearn.metrics import silhouette_score, davies_bouldin_score, adjusted_rand_score\n\ndef cluster_report(X, labels, true_labels=None):\n    pass\n",
          sample: "cluster_report(X, km.labels_, true_segment) → {\"silhouette\": 0.6, \"davies_bouldin\": 0.5, \"sizes\": [100, 100, 100, 100], \"ari\": 1.0}",
          tests: [
            {
              check: CUSTOMERS + py`
from sklearn.cluster import KMeans
from sklearn.metrics import silhouette_score, davies_bouldin_score
km = KMeans(n_clusters=4, n_init=10, random_state=0).fit(X)
r = cluster_report(X, km.labels_, true_segment)
assert r["sizes"] == np.bincount(km.labels_).tolist(), "Sizes ordered by cluster label. Got " + repr(r["sizes"])
assert r["silhouette"] == round(silhouette_score(X, km.labels_), 3) and r["davies_bouldin"] == round(davies_bouldin_score(X, km.labels_), 3), "Internal scores."
assert r["ari"] > 0.95, "The clusters match the true segments almost exactly, even though the numbers differ. Got " + repr(r["ari"])
shuffled = (km.labels_ + 1) % 4
assert cluster_report(X, shuffled, true_segment)["ari"] == r["ari"], "ARI ignores cluster numbering."
assert "ari" not in cluster_report(X, km.labels_), "Without true labels, there is no ARI."`,
            },
          ],
          solution: py`import numpy as np
from sklearn.metrics import silhouette_score, davies_bouldin_score, adjusted_rand_score

def cluster_report(X, labels, true_labels=None):
    report = {
        "silhouette": round(silhouette_score(X, labels), 3),
        "davies_bouldin": round(davies_bouldin_score(X, labels), 3),
        "sizes": np.bincount(labels).tolist(),
    }
    if true_labels is not None:
        report["ari"] = round(adjusted_rand_score(true_labels, labels), 3)
    return report
`,
          hint: "Build the dictionary with the two internal scores and np.bincount(labels).tolist(); add \"ari\" only when true_labels is not None.",
          successMessage: "Renumbering the clusters changed nothing: external scores compare groupings, not names. Internal scores are what you have when no labels exist.",
        },
      },
    ],

    task: {
      title: "Module 12 project: a customer segmentation system",
      intro:
        "Segment the customers of a retailer, bank or telecom (a public mall-customers or online-retail dataset, or your Module 5 sales data aggregated per customer) and turn the segments into recommendations.",
      prompts: [
        "Build one row per customer with behavioural features such as recency, frequency, monetary value, tenure and category mix; scale them.",
        "Use PCA to plot the customers in two dimensions and report how much variance two components keep.",
        "Choose k with the elbow method and the silhouette score, and explain your final choice.",
        "Compare k-means, agglomerative clustering (Ward) and DBSCAN on the same features.",
        "Profile each segment (size, average features), give it a business name, and propose one action per segment.",
        "Run Isolation Forest to flag unusual customers, and investigate the five most anomalous.",
        "Check stability: re-run k-means with five random seeds and on an 80% subsample; report how many customers change segment.",
      ],
      closing: "You have many algorithms now. Module 13 compares them fairly, tunes them, and chains preprocessing and models into pipelines that cannot leak.",
    },

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
