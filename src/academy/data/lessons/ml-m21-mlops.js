/**
 * MACHINE LEARNING AND AI · MODULE 21 · INTRODUCTION TO MLOPS
 *
 * Curriculum 21.1 – 21.13. What MLOps is; why models need maintenance; Git;
 * dataset and model versioning; experiment tracking; reproducible training;
 * monitoring; data and concept drift; retraining; MLflow; Docker; and CI/CD
 * for ML. Tools that cannot run in the page (Git, MLflow's server, Docker,
 * GitHub Actions) are shown as reference; the learner implements what those
 * tools DO: content-hashed data versions, a model registry with stages, an
 * experiment tracker, seeded reproducible training, monitoring alerts, the
 * population stability index, a champion/challenger retraining decision, a
 * Dockerfile checker and a CI quality gate.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

export const SECTION_ID = "ml-s21-mlops";

const PY = "python";
const py = String.raw;

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 92 · 21.1 – 21.3
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ml-l92-mlops-git",
    moduleId: "ml-m21-mlops",
    sectionId: SECTION_ID,
    order: 1,
    covers: ["21.1", "21.2", "21.3"],
    title: "MLOps, Model Maintenance and Version Control",
    subtitle: "Why a deployed model is the beginning of the work, not the end",
    estimatedMinutes: 36,
    intro:
      "Software that worked yesterday keeps working unless someone changes it. A model that worked yesterday can fail tomorrow because the WORLD changed. MLOps is the discipline that keeps models reliable after launch.",

    atoms: [
      {
        id: "a-ml-what-is-mlops",
        title: "What is MLOps?",
        explain:
          "MLOps (machine learning operations) applies DevOps practices to machine learning: automating and standardising how models are built, tested, deployed, monitored and updated, so that ML systems are reliable, reproducible and auditable. It spans three things that change: CODE (versioned in Git), DATA (versioned with tools like DVC) and MODELS (tracked in a registry). Its practices: version everything, track experiments, make training reproducible, test data and models automatically, deploy through pipelines, monitor performance and drift in production, and retrain on a schedule or a trigger. Google's widely cited paper \"Hidden Technical Debt in Machine Learning Systems\" (2015) observed that the model code is a small fraction of a real ML system; the rest is the infrastructure MLOps manages.",
        table: {
          caption: "MLOps maturity: from notebooks to automation.",
          headers: ["Level", "How models are built and deployed", "Typical problem"],
          rows: [
            ["0 · Manual", "Notebooks, files emailed or copied to a server by hand", "Nobody can reproduce or update the model"],
            ["1 · Pipeline", "Automated training pipeline, tracked experiments, a model registry", "Deployment and monitoring still manual"],
            ["2 · CI/CD", "Tests and deployment automated; monitoring triggers retraining", "Requires investment in tooling and culture"],
          ],
        },
        decision: {
          scenario: "A data scientist trained a churn model in a notebook eight months ago and copied the file to the server. Nobody knows which data or code version produced it, and its author has left.",
          question: "Which MLOps practice would have prevented the worst of this situation?",
          options: [
            { id: "a", text: "A bigger server", whyWrong: "Hardware does not record how a model was made." },
            { id: "b", text: "Versioning code, data and model together, with tracked experiments", why: "Then anyone could see exactly which code and data produced the model, reproduce it, and retrain it." },
            { id: "c", text: "Using a deep learning model instead", whyWrong: "The algorithm is not the problem; the missing process is." },
            { id: "d", text: "Deleting the model", whyWrong: "That loses the working system without fixing anything." },
          ],
          correct: "b",
          aftermath: "If you cannot say what produced a model, you cannot reproduce, audit or safely update it.",
        },
      },
      {
        id: "a-ml-model-maintenance",
        title: "Why machine learning models need maintenance",
        explain:
          "Models DECAY because they learn a snapshot of a world that keeps moving. Customer behaviour shifts (a competitor's cheaper data bundles), the economy changes (inflation alters spending patterns), products and policies change, fraudsters adapt to whatever the model catches, and upstream data pipelines change silently (a field renamed, units switched from naira to kobo). Unlike a software bug, decay does not crash anything: the model keeps returning confident predictions that are quietly wrong. Maintenance means monitoring for it, diagnosing it, and retraining or redesigning, as a planned, continuous activity rather than an emergency.",
        codeExercise: {
          language: PY,
          code: py`monthly_accuracy = [0.91, 0.90, 0.91, 0.89, 0.86, 0.84, 0.80, 0.77]
baseline = monthly_accuracy[0]
threshold = 0.05                       # alert if accuracy drops 5 points below launch

for month, acc in enumerate(monthly_accuracy):
    if round(baseline - acc, 4) > threshold:     # round: 0.91 - 0.86 is 0.05000000000000004 in floating point
        print("alert in month", month, "accuracy", acc)
        break
print("drop so far:", round(baseline - monthly_accuracy[-1], 2))
`,
          question: "A model launched at 91% accuracy. With an alert when accuracy falls more than 5 points below launch, when does the alert fire, and how far has it fallen by month 7?",
          expectedOutput: "alert in month 5 accuracy 0.84\ndrop so far: 0.14",
          hint: "0.91 − 0.86 = 0.05 is not more than 0.05; 0.91 − 0.84 = 0.07 is.",
          successMessage: "Nothing crashed while accuracy slid from 91% to 77%. Without monitoring, nobody would have noticed until the business did.",
        },
      },
      {
        id: "a-ml-git",
        title: "Version control with Git and GitHub",
        explain:
          "GIT records every change to your code as COMMITS, so you can see what changed, when and why, return to any earlier version, and work on BRANCHES in parallel; GITHUB (or GitLab) hosts repositories, reviews changes through PULL REQUESTS and runs automation (Lesson 96). For ML projects: commit code, configuration, notebooks (cleared of large outputs), requirements files and small metadata; do NOT commit large datasets, model binaries, virtual environments or secrets. Use a .gitignore for those, and store data and models with DVC or a model registry, which commit small pointer files to Git instead. Write meaningful commit messages and tag the commit that produced each released model.",
        example:
          "$ git init && git add src/ requirements.txt params.yaml .gitignore\n$ git commit -m \"Train churn model with tenure and complaint features\"\n$ git switch -c experiment/gradient-boosting\n$ git push -u origin experiment/gradient-boosting     # then open a pull request\n$ git tag model-v1.2.0                                  # mark the commit behind a release\n\n# .gitignore\n.venv/\ndata/raw/\nmodels/*.joblib\n.env\n__pycache__/",
        codeChallenge: {
          task:
            "Write should_commit(path, ignore_patterns) that returns False if the path matches any pattern (using fnmatch.fnmatch on the full path, OR any pattern ending in \"/\" that matches a leading directory of the path, such as \".venv/\" for \".venv/lib/x.py\"), and True otherwise. Then write audit(paths, ignore_patterns) that returns the sorted list of paths that WOULD be committed.",
          starter: "import fnmatch\n\nIGNORE = [\".venv/\", \"data/raw/\", \"models/*.joblib\", \".env\", \"*.pyc\"]\n\ndef should_commit(path, ignore_patterns):\n    pass\n\ndef audit(paths, ignore_patterns):\n    pass\n",
          sample: "should_commit(\"models/churn.joblib\", IGNORE) → False; should_commit(\"src/train.py\", IGNORE) → True",
          tests: [
            {
              check: py`cases = {
    "src/train.py": True, "requirements.txt": True, "params.yaml": True, "models/metrics.json": True,
    "models/churn.joblib": False, ".env": False, ".venv/lib/site.py": False, "data/raw/sales.csv": False,
    "src/__init__.pyc": False, "data/processed/README.md": True,
}
for p, want in cases.items():
    assert should_commit(p, IGNORE) is want, "should_commit(" + repr(p) + ") should be " + str(want)
assert audit(list(cases), IGNORE) == sorted(p for p, w in cases.items() if w), "audit lists the committable paths, sorted."`,
            },
          ],
          solution: py`import fnmatch

IGNORE = [".venv/", "data/raw/", "models/*.joblib", ".env", "*.pyc"]

def should_commit(path, ignore_patterns):
    for pattern in ignore_patterns:
        if pattern.endswith("/"):
            if path.startswith(pattern):
                return False
        elif fnmatch.fnmatch(path, pattern):
            return False
    return True

def audit(paths, ignore_patterns):
    return sorted(p for p in paths if should_commit(p, ignore_patterns))
`,
          hint: "A pattern ending in \"/\" means a directory: check path.startswith(pattern). Otherwise use fnmatch.fnmatch(path, pattern).",
          successMessage: "Code, configuration and small metrics go into Git; raw data, model binaries, environments and secrets stay out.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 93 · 21.4 – 21.6
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ml-l93-versioning-tracking",
    moduleId: "ml-m21-mlops",
    sectionId: SECTION_ID,
    order: 2,
    covers: ["21.4", "21.5", "21.6"],
    title: "Dataset Versioning, Model Versioning and Experiment Tracking",
    subtitle: "Knowing exactly which data, settings and code produced every model",
    estimatedMinutes: 40,
    intro:
      "Three questions must always have answers: which data was this model trained on, which version is in production, and which experiment produced it? This lesson builds the record-keeping that answers them.",

    atoms: [
      {
        id: "a-ml-dataset-versioning",
        title: "Dataset versioning",
        explain:
          "Data changes: new rows arrive, errors are corrected, cleaning rules change. To reproduce a model you need the EXACT data it saw. DATASET VERSIONING gives each version of a dataset an identifier, typically a CONTENT HASH (such as SHA-256 of the file's bytes or of a canonical serialisation of the table), so identical data always gets the same ID and any change gets a new one. Tools: DVC stores data in cloud storage and commits small pointer files (with the hash) to Git; lakeFS and Delta Lake version data lakes. Record the data version with every trained model, and never overwrite a dataset that a model was trained on.",
        example:
          "$ dvc init\n$ dvc add data/processed/sales.parquet        # computes the hash, writes sales.parquet.dvc\n$ git add data/processed/sales.parquet.dvc .gitignore\n$ git commit -m \"Data: 2026-10 sales snapshot\"\n$ dvc push                                    # uploads the data to remote storage",
        codeChallenge: {
          task:
            "Write dataset_version(df) that returns the first 12 hex characters of the SHA-256 hash of df.to_csv(index=False).encode(\"utf-8\"), after sorting the columns alphabetically and the rows by all columns (so the same data in a different order gets the same version). Then write changed(df_a, df_b) returning True if their versions differ.",
          starter: "import hashlib\nimport pandas as pd\n\ndef dataset_version(df):\n    pass\n\ndef changed(df_a, df_b):\n    pass\n",
          sample: "two copies of the same table with rows shuffled → the same version; one corrected value → a new version",
          tests: [
            {
              check: py`import pandas as pd
df = pd.DataFrame({"branch": ["Lagos", "Kano", "Abuja"], "sales": [333, 493, 374]})
v = dataset_version(df)
assert isinstance(v, str) and len(v) == 12 and all(c in "0123456789abcdef" for c in v), "12 hex characters. Got " + repr(v)
shuffled = df.sample(frac=1, random_state=3)[["sales", "branch"]]
assert dataset_version(shuffled) == v, "The same data in a different row and column order has the same version."
fixed = df.copy()
fixed.loc[1, "sales"] = 494
assert changed(df, fixed) and not changed(df, shuffled), "One corrected value gives a new version."
assert dataset_version(df) == v, "Hashing must not modify the DataFrame or depend on chance."`,
            },
          ],
          solution: py`import hashlib
import pandas as pd

def dataset_version(df):
    cols = sorted(df.columns)
    canonical = df[cols].sort_values(cols).reset_index(drop=True)
    data = canonical.to_csv(index=False).encode("utf-8")
    return hashlib.sha256(data).hexdigest()[:12]

def changed(df_a, df_b):
    return dataset_version(df_a) != dataset_version(df_b)
`,
          hint: "cols = sorted(df.columns); canonical = df[cols].sort_values(cols).reset_index(drop=True); then hashlib.sha256(canonical.to_csv(index=False).encode(\"utf-8\")).hexdigest()[:12].",
          successMessage: "A content hash is a fingerprint: identical data, identical version, whatever the order; any correction, a new version. That is the principle DVC is built on.",
        },
      },
      {
        id: "a-ml-model-versioning",
        title: "Model versioning",
        explain:
          "Every trained model gets a unique VERSION and is stored in a MODEL REGISTRY (MLflow Model Registry, cloud registries, or a disciplined folder plus database) together with its metadata: data version, code commit, hyperparameters, metrics, author and date. Registries track STAGES: None → Staging (under test) → Production (serving) → Archived. Only one version is in Production at a time, and promoting a new one archives the old, which stays available for instant ROLLBACK. Semantic versioning (MAJOR.MINOR.PATCH) can signal compatibility: a MAJOR bump when the input features change (clients must update), MINOR for a retrain with the same interface, PATCH for metadata fixes.",
        codeChallenge: {
          task:
            "Write a class Registry. register(name, metrics) adds a new version (1, 2, 3 … per name) in stage \"None\" and returns its version number. promote(name, version, stage) sets the stage; promoting a version to \"Production\" moves any existing Production version of that name to \"Archived\". production(name) returns the version number in Production, or None. history(name) returns a list of (version, stage) tuples in version order.",
          starter: "class Registry:\n    pass\n",
          sample: "promote v2 to Production while v1 is in Production → v1 becomes Archived",
          tests: [
            {
              check: py`r = Registry()
assert r.register("churn", {"auc": 0.81}) == 1 and r.register("churn", {"auc": 0.84}) == 2, "Versions count up per model."
assert r.register("fraud", {"auc": 0.95}) == 1, "Each model name has its own version numbers."
assert r.production("churn") is None, "Nothing is in Production yet."
r.promote("churn", 1, "Production")
assert r.production("churn") == 1, "Version 1 is now in Production."
r.promote("churn", 2, "Staging")
assert r.history("churn") == [(1, "Production"), (2, "Staging")], "Got " + repr(r.history("churn"))
r.promote("churn", 2, "Production")
assert r.production("churn") == 2 and r.history("churn") == [(1, "Archived"), (2, "Production")], "Promoting v2 archives v1. Got " + repr(r.history("churn"))
r.promote("churn", 1, "Production")
assert r.production("churn") == 1 and r.history("churn") == [(1, "Production"), (2, "Archived")], "Rollback: v1 back in Production."`,
            },
          ],
          solution: py`class Registry:
    def __init__(self):
        self.models = {}

    def register(self, name, metrics):
        versions = self.models.setdefault(name, [])
        versions.append({"version": len(versions) + 1, "stage": "None", "metrics": metrics})
        return len(versions)

    def promote(self, name, version, stage):
        for v in self.models[name]:
            if stage == "Production" and v["stage"] == "Production":
                v["stage"] = "Archived"
        self.models[name][version - 1]["stage"] = stage

    def production(self, name):
        for v in self.models.get(name, []):
            if v["stage"] == "Production":
                return v["version"]
        return None

    def history(self, name):
        return [(v["version"], v["stage"]) for v in self.models[name]]
`,
          hint: "Store a list of version dictionaries per name. In promote, when the target stage is Production, first archive whichever version currently holds it, then set the new stage.",
          successMessage: "Exactly one Production version at a time, every old version kept, and rollback is a single promote. That is what a model registry guarantees.",
        },
      },
      {
        id: "a-ml-experiment-tracking",
        title: "Experiment tracking",
        explain:
          "Model development is many experiments: different features, algorithms, hyperparameters and data versions. EXPERIMENT TRACKING records each RUN: its parameters, metrics (often per epoch), the code commit and data version, and ARTIFACTS (the model file, plots, the confusion matrix). Then you can compare runs, find the best, and reproduce it months later. Without it, results live in notebook cell outputs and people's memories. Tools: MLflow Tracking (open source, Lesson 96), Weights & Biases, Neptune, and the trackers built into cloud platforms. Track failed runs too: knowing what did not work saves repeating it.",
        codeChallenge: {
          task:
            "Write a class Tracker. start_run(name, params) creates a run (a dictionary with name, params and an empty metrics dictionary), stores it, and returns its index. log_metric(run_id, key, value) records a metric on that run. best_run(metric, higher_is_better=True) returns the NAME of the run with the best value of that metric, ignoring runs that never logged it. compare(metric) returns a list of (name, value) for runs that logged it, best first (for higher_is_better=True ordering).",
          starter: "class Tracker:\n    pass\n",
          sample: "best_run(\"val_auc\") → \"gbm-depth3\"",
          tests: [
            {
              check: py`t = Tracker()
a = t.start_run("logreg", {"C": 1.0})
b = t.start_run("gbm-depth3", {"max_depth": 3, "lr": 0.1})
c = t.start_run("gbm-depth8", {"max_depth": 8, "lr": 0.1})
d = t.start_run("crashed-run", {"max_depth": 20})
t.log_metric(a, "val_auc", 0.81)
t.log_metric(b, "val_auc", 0.86)
t.log_metric(c, "val_auc", 0.84)
t.log_metric(a, "train_seconds", 2.0)
t.log_metric(b, "train_seconds", 30.0)
assert (a, b, c, d) == (0, 1, 2, 3), "start_run returns the run's index."
assert t.best_run("val_auc") == "gbm-depth3", "Highest validation AUC. Got " + repr(t.best_run("val_auc"))
assert t.best_run("train_seconds", higher_is_better=False) == "logreg", "Lowest training time."
assert t.compare("val_auc") == [("gbm-depth3", 0.86), ("gbm-depth8", 0.84), ("logreg", 0.81)], "Runs without the metric (the crashed one) are skipped. Got " + repr(t.compare("val_auc"))`,
            },
          ],
          solution: py`class Tracker:
    def __init__(self):
        self.runs = []

    def start_run(self, name, params):
        self.runs.append({"name": name, "params": params, "metrics": {}})
        return len(self.runs) - 1

    def log_metric(self, run_id, key, value):
        self.runs[run_id]["metrics"][key] = value

    def compare(self, metric, higher_is_better=True):
        rows = [(r["name"], r["metrics"][metric]) for r in self.runs if metric in r["metrics"]]
        return sorted(rows, key=lambda t: t[1], reverse=higher_is_better)

    def best_run(self, metric, higher_is_better=True):
        rows = self.compare(metric, higher_is_better)
        return rows[0][0] if rows else None
`,
          hint: "Keep a list of run dictionaries. compare filters runs that have the metric and sorts by value (reverse=True for higher-is-better); best_run takes the first.",
          successMessage: "Every run's parameters and results in one queryable place. MLflow adds a database, a web UI and artifact storage around exactly this idea.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 94 · 21.7 – 21.8
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ml-l94-reproducibility-monitoring",
    moduleId: "ml-m21-mlops",
    sectionId: SECTION_ID,
    order: 3,
    covers: ["21.7", "21.8"],
    title: "Reproducible Training and Model Monitoring",
    subtitle: "Getting the same model twice, and knowing how it behaves in production",
    estimatedMinutes: 38,
    intro:
      "If you cannot retrain a model and get the same result, you cannot debug it or trust it. And once it is live, you need numbers every day telling you whether it still works.",

    atoms: [
      {
        id: "a-ml-reproducible-training",
        title: "Reproducible training",
        explain:
          "REPRODUCIBLE training means the same code, data and configuration produce the same model. Sources of variation to control: RANDOMNESS (data splits, shuffling, weight initialisation, bootstrap samples: set seeds everywhere, random_state= in scikit-learn, torch.manual_seed and NumPy generators); DATA (pin the dataset version); ENVIRONMENT (pin library versions in requirements.txt or a lock file, ideally in a Docker image); CONFIGURATION (keep hyperparameters in a versioned file such as params.yaml, not scattered in notebooks); and some GPU operations that are non-deterministic unless configured. A training script, not a notebook, should be the source of truth: one command from raw data to model.",
        codeChallenge: {
          task:
            "Write train(config) that reproduces a model run from a configuration dictionary with keys seed, test_size, n_estimators and max_depth: generate data with make_classification(n_samples=500, n_features=8, random_state=config[\"seed\"]), split with train_test_split using test_size and random_state=config[\"seed\"], fit RandomForestClassifier(n_estimators, max_depth, random_state=config[\"seed\"]), and return {\"accuracy\": test accuracy rounded to 4, \"config\": config}.",
          starter: "from sklearn.datasets import make_classification\nfrom sklearn.model_selection import train_test_split\nfrom sklearn.ensemble import RandomForestClassifier\n\ndef train(config):\n    pass\n",
          sample: "train(cfg) twice → identical accuracy; a different seed → (usually) a different accuracy",
          tests: [
            {
              check: py`cfg = {"seed": 42, "test_size": 0.25, "n_estimators": 50, "max_depth": 5}
a = train(cfg)
b = train(dict(cfg))
assert a == b, "The same configuration must reproduce exactly the same result. Got " + repr((a["accuracy"], b["accuracy"]))
assert a["config"] == cfg and 0.7 < a["accuracy"] <= 1.0, "Return the accuracy and the configuration used."
results = {train(dict(cfg, seed=s))["accuracy"] for s in [1, 2, 3, 4]}
assert len(results) > 1, "Different seeds should give different results: the seed is controlling the randomness."`,
            },
          ],
          solution: py`from sklearn.datasets import make_classification
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier

def train(config):
    seed = config["seed"]
    X, y = make_classification(n_samples=500, n_features=8, random_state=seed)
    Xtr, Xte, ytr, yte = train_test_split(X, y, test_size=config["test_size"], random_state=seed)
    model = RandomForestClassifier(
        n_estimators=config["n_estimators"], max_depth=config["max_depth"], random_state=seed
    ).fit(Xtr, ytr)
    return {"accuracy": round(model.score(Xte, yte), 4), "config": config}
`,
          hint: "Pass config[\"seed\"] as random_state to all three: the data generator, the split and the forest.",
          successMessage: "Same configuration, same result, every time. With the data version and library versions pinned too, anyone can rebuild this exact model.",
        },
      },
      {
        id: "a-ml-model-monitoring",
        title: "Model monitoring",
        explain:
          "MONITORING watches a deployed model on four levels. SERVICE health: request rate, LATENCY (p50, p95), error rate, uptime. DATA quality: missing values, out-of-range inputs, schema changes in the incoming features. MODEL behaviour: the distribution of predictions (is the model suddenly predicting \"fraud\" twice as often?), and input DRIFT (Lesson 95). BUSINESS performance: accuracy, precision or MAE once true outcomes arrive (often with a delay: whether a loan defaults takes months), and the KPI the model exists to move. Dashboards (Grafana, cloud consoles, Evidently) show trends; ALERTS fire when a metric crosses a threshold, so people react before the business notices.",
        codeChallenge: {
          task:
            "Write monitor(day_stats, limits) where day_stats is a dictionary of today's metrics (p95_latency_ms, error_rate, missing_rate, positive_rate) and limits is a dictionary of (low, high) bounds for the same keys (use None for no bound). Return a sorted list of alert strings \"<metric> too high\" or \"<metric> too low\" for every metric outside its bounds; metrics without limits are ignored.",
          starter: "def monitor(day_stats, limits):\n    pass\n",
          sample: "monitor({\"p95_latency_ms\": 900, ...}, {\"p95_latency_ms\": (None, 500), ...}) → [\"p95_latency_ms too high\", ...]",
          tests: [
            {
              check: py`limits = {"p95_latency_ms": (None, 500), "error_rate": (None, 0.01), "missing_rate": (None, 0.05), "positive_rate": (0.02, 0.10)}
ok = {"p95_latency_ms": 180, "error_rate": 0.001, "missing_rate": 0.01, "positive_rate": 0.05}
assert monitor(ok, limits) == [], "A healthy day raises no alerts."
bad = {"p95_latency_ms": 900, "error_rate": 0.002, "missing_rate": 0.2, "positive_rate": 0.004, "requests": 10}
assert monitor(bad, limits) == ["missing_rate too high", "p95_latency_ms too high", "positive_rate too low"], "Got " + repr(monitor(bad, limits))
assert monitor({"positive_rate": 0.25}, {"positive_rate": (0.02, 0.10)}) == ["positive_rate too high"], "A model suddenly predicting the positive class far more often is an alert too."`,
            },
          ],
          solution: py`def monitor(day_stats, limits):
    alerts = []
    for metric, (low, high) in limits.items():
        if metric not in day_stats:
            continue
        value = day_stats[metric]
        if high is not None and value > high:
            alerts.append(metric + " too high")
        if low is not None and value < low:
            alerts.append(metric + " too low")
    return sorted(alerts)
`,
          hint: "Loop over the limits; skip metrics not in today's stats; compare against high and low when they are not None; sort the alerts at the end.",
          successMessage: "A sudden drop in the share of positive predictions is often the first sign that an upstream feature broke, long before any true outcome arrives.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 95 · 21.9 – 21.10
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ml-l95-drift-retraining",
    moduleId: "ml-m21-mlops",
    sectionId: SECTION_ID,
    order: 4,
    covers: ["21.9", "21.10"],
    title: "Data Drift, Concept Drift and Retraining",
    subtitle: "Detecting that the world has moved, and updating the model safely",
    estimatedMinutes: 40,
    intro:
      "Drift is the reason models decay. This lesson measures it with the population stability index and a statistical test, then decides when and how to retrain without breaking production.",

    atoms: [
      {
        id: "a-ml-drift",
        title: "Data drift and concept drift",
        explain:
          "DATA DRIFT (covariate shift) is a change in the distribution of the INPUTS: the model now sees older customers, larger transfers, a new region. CONCEPT DRIFT is a change in the RELATIONSHIP between inputs and target: the same features now mean something different (after a fee change, high-usage customers start churning). Data drift is detectable immediately from inputs alone; concept drift usually shows only when true outcomes arrive and accuracy falls. Measures of data drift: the POPULATION STABILITY INDEX, PSI = Σ (aᵢ − eᵢ) × ln(aᵢ / eᵢ) over bins, where eᵢ and aᵢ are the expected (training) and actual (recent) shares in bin i (rule of thumb: below 0.1 stable, 0.1–0.25 moderate, above 0.25 significant); and the two-sample KOLMOGOROV-SMIRNOV test for numeric features.",
        codeChallenge: {
          task:
            "Write psi(expected, actual, bins=10) for two numeric samples: take bin edges from the deciles of expected (np.quantile(expected, np.linspace(0, 1, bins + 1))), widen the first and last edges to −inf and +inf, count each sample's share per bin with np.histogram, replace zero shares with 1e-4, and return Σ (a − e) × ln(a / e) rounded to 4. Then write drift_level(value) returning \"stable\" below 0.1, \"moderate\" up to 0.25, and \"significant\" above 0.25.",
          starter: "import numpy as np\n\ndef psi(expected, actual, bins=10):\n    pass\n\ndef drift_level(value):\n    pass\n",
          sample: "the same distribution → PSI near 0 (stable); transfer amounts that doubled → PSI well above 0.25",
          tests: [
            {
              check: py`import numpy as np
rng = np.random.default_rng(21)
train = rng.lognormal(10, 0.6, 5000)
same = rng.lognormal(10, 0.6, 5000)
shifted = rng.lognormal(10.7, 0.6, 5000)
p_same, p_shift = psi(train, same), psi(train, shifted)
assert p_same < 0.02 and drift_level(p_same) == "stable", "The same distribution should be stable. Got " + str(p_same)
assert p_shift > 0.25 and drift_level(p_shift) == "significant", "Amounts that doubled should be significant drift. Got " + str(p_shift)
mild = rng.lognormal(10.15, 0.6, 5000)
assert 0.02 < psi(train, mild) < p_shift, "A small shift gives an intermediate PSI."
assert [drift_level(v) for v in [0.05, 0.1, 0.25, 0.3]] == ["stable", "moderate", "moderate", "significant"], "Thresholds 0.1 and 0.25."
assert isinstance(p_same, float), "Return a float."`,
            },
          ],
          solution: py`import numpy as np

def psi(expected, actual, bins=10):
    edges = np.quantile(expected, np.linspace(0, 1, bins + 1))
    edges[0], edges[-1] = -np.inf, np.inf
    e = np.histogram(expected, edges)[0] / len(expected)
    a = np.histogram(actual, edges)[0] / len(actual)
    e = np.where(e == 0, 1e-4, e)
    a = np.where(a == 0, 1e-4, a)
    return round(float(np.sum((a - e) * np.log(a / e))), 4)

def drift_level(value):
    if value < 0.1:
        return "stable"
    if value <= 0.25:
        return "moderate"
    return "significant"
`,
          hint: "Edges from the training deciles, outer edges widened to ±inf so every value lands in a bin; shares = counts / length; replace zeros; then the PSI sum.",
          successMessage: "PSI turned \"the inputs look different\" into a number with agreed thresholds. Computed daily per feature, it is one of the most common drift monitors in industry, especially in credit scoring.",
        },
      },
      {
        id: "a-ml-retraining",
        title: "Model retraining",
        explain:
          "RETRAINING refreshes a model on recent data. Strategies: SCHEDULED (weekly, monthly: simple and predictable), TRIGGERED (when drift or performance alerts fire), or CONTINUOUS (online learning, rarer and riskier). Use a training window that reflects the current world (perhaps the last 12 months), and never deploy a retrained model blindly: compare the CHALLENGER (new model) with the CHAMPION (current production model) on the SAME recent hold-out data, and promote it only if it is better by a meaningful margin and passes all checks (no metric regression on important segments, latency within budget). Roll out gradually (shadow mode, then a small share of traffic, then all) and keep the champion ready for rollback.",
        codeChallenge: {
          task:
            "Write should_retrain(psi_values, accuracy_drop, days_since_training, psi_limit=0.25, drop_limit=0.03, max_days=90) returning True if any feature's PSI exceeds psi_limit, or accuracy_drop exceeds drop_limit, or days_since_training exceeds max_days. Then write promote_challenger(champion, challenger, min_gain=0.01) where each argument is a dictionary {\"auc\": …, \"segment_aucs\": {segment: auc}, \"p95_ms\": …}: return True only if the challenger's AUC beats the champion's by at least min_gain, no segment's AUC falls by more than 0.02, and its p95 latency is at most 1.2 × the champion's.",
          starter: "def should_retrain(psi_values, accuracy_drop, days_since_training, psi_limit=0.25, drop_limit=0.03, max_days=90):\n    pass\n\ndef promote_challenger(champion, challenger, min_gain=0.01):\n    pass\n",
          sample: "a challenger that is better overall but much worse for one region is NOT promoted",
          tests: [
            {
              check: py`assert should_retrain({"amount": 0.05, "age": 0.08}, 0.01, 30) is False, "Stable, accurate and recent: no retrain."
assert should_retrain({"amount": 0.31, "age": 0.08}, 0.0, 10) is True, "Significant drift in one feature triggers retraining."
assert should_retrain({}, 0.05, 10) is True and should_retrain({}, 0.0, 120) is True, "An accuracy drop or an old model also triggers it."
champ = {"auc": 0.84, "segment_aucs": {"Lagos": 0.85, "Kano": 0.80}, "p95_ms": 50}
good = {"auc": 0.86, "segment_aucs": {"Lagos": 0.87, "Kano": 0.81}, "p95_ms": 55}
assert promote_challenger(champ, good) is True, "Better overall, no segment worse, latency fine."
unfair = {"auc": 0.87, "segment_aucs": {"Lagos": 0.90, "Kano": 0.75}, "p95_ms": 50}
assert promote_challenger(champ, unfair) is False, "Kano drops by 0.05: refuse, even though overall AUC is higher."
slow = dict(good, p95_ms=80)
assert promote_challenger(champ, slow) is False, "Latency more than 20% worse: refuse."
tiny = dict(good, auc=0.845)
assert promote_challenger(champ, tiny) is False, "A gain below min_gain is not worth the risk of a change."`,
            },
          ],
          solution: py`def should_retrain(psi_values, accuracy_drop, days_since_training, psi_limit=0.25, drop_limit=0.03, max_days=90):
    drifted = any(v > psi_limit for v in psi_values.values())
    return drifted or accuracy_drop > drop_limit or days_since_training > max_days

def promote_challenger(champion, challenger, min_gain=0.01):
    if challenger["auc"] - champion["auc"] < min_gain:
        return False
    for segment, old in champion["segment_aucs"].items():
        if old - challenger["segment_aucs"].get(segment, 0) > 0.02:
            return False
    return challenger["p95_ms"] <= 1.2 * champion["p95_ms"]
`,
          hint: "should_retrain is three conditions joined with or. In promote_challenger, check the overall gain, then every segment's drop, then latency, returning False at the first failure.",
          successMessage: "A higher overall score is not enough: the challenger that hurt Kano's customers was rejected. Segment checks in a promotion gate are a practical fairness safeguard (Module 22).",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 96 · 21.11 – 21.13
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ml-l96-mlflow-docker-cicd",
    moduleId: "ml-m21-mlops",
    sectionId: SECTION_ID,
    order: 5,
    covers: ["21.11", "21.12", "21.13"],
    title: "MLflow, Docker and CI/CD for ML",
    subtitle: "The standard tools for tracking, packaging and shipping models",
    estimatedMinutes: 40,
    intro:
      "Three widely used tools turn the practices of this module into everyday workflow: MLflow tracks experiments and models, Docker packages the service with its exact environment, and CI/CD pipelines test and ship every change automatically.",

    atoms: [
      {
        id: "a-ml-mlflow",
        title: "Introduction to MLflow",
        explain:
          "MLFLOW is an open-source platform with four parts: TRACKING (log parameters, metrics and artifacts for each run, browse and compare them in a web UI started with mlflow ui), MODELS (a standard format for saving models from any library, with their environment), the MODEL REGISTRY (versions and stages: Staging, Production, Archived, with aliases), and PROJECTS (packaged, reproducible runs). Autologging (mlflow.sklearn.autolog()) records parameters, metrics and the model automatically. Runs can be logged locally to a folder or to a shared tracking server. Below is a typical run; the challenges in Lesson 93 implemented the same ideas.",
        example:
          "import mlflow, mlflow.sklearn\n\nmlflow.set_experiment(\"churn\")\nwith mlflow.start_run(run_name=\"gbm-depth3\"):\n    mlflow.log_params({\"max_depth\": 3, \"learning_rate\": 0.1, \"data_version\": \"a41f09c2e7d1\"})\n    model.fit(X_train, y_train)\n    mlflow.log_metric(\"val_auc\", roc_auc_score(y_val, model.predict_proba(X_val)[:, 1]))\n    mlflow.sklearn.log_model(model, name=\"model\", registered_model_name=\"churn\")\n\n# then:  mlflow ui   → compare runs at http://127.0.0.1:5000",
        codeExercise: {
          language: PY,
          code: py`runs = [
    {"run": "logreg",     "params": {"C": 1.0},             "val_auc": 0.811, "train_s": 2},
    {"run": "gbm-depth3", "params": {"max_depth": 3},       "val_auc": 0.862, "train_s": 31},
    {"run": "gbm-depth8", "params": {"max_depth": 8},       "val_auc": 0.848, "train_s": 74},
    {"run": "forest",     "params": {"n_estimators": 300},  "val_auc": 0.857, "train_s": 45},
]
best = max(runs, key=lambda r: r["val_auc"])
print(best["run"], best["params"])
within = [r["run"] for r in runs if best["val_auc"] - r["val_auc"] <= 0.01]
print(within)
print(min((r for r in runs if r["run"] in within), key=lambda r: r["train_s"])["run"])
`,
          question: "Four tracked runs, as you would see them in MLflow's comparison view. Which is best, which are within 0.01 AUC of it, and which of those trains fastest?",
          expectedOutput: "gbm-depth3 {'max_depth': 3}\n['gbm-depth3', 'forest']\ngbm-depth3",
          hint: "The forest is 0.005 behind the best; depth 8 is 0.014 behind.",
          successMessage: "Tracked runs make this comparison a query instead of an argument: the best run, the near-ties, and the cheapest among them.",
        },
      },
      {
        id: "a-ml-docker",
        title: "Containerizing ML applications with Docker",
        explain:
          "DOCKER packages an application with EVERYTHING it needs (operating system libraries, the Python version, pinned packages, the model file and code) into an IMAGE that runs identically on a laptop, a server or any cloud: no more \"it works on my machine\". A DOCKERFILE lists the build steps; docker build creates the image; docker run starts a CONTAINER. Good practice for ML services: a slim, version-pinned base image (python:3.12-slim, never just \"latest\"); copy requirements.txt and install BEFORE copying the code, so the dependency layer is cached between builds; a .dockerignore to exclude data and environments; run as a NON-ROOT user; expose one port and start uvicorn with a CMD. Orchestrators such as Kubernetes, or managed services such as Cloud Run, then scale the containers.",
        example:
          "FROM python:3.12-slim\nWORKDIR /app\nCOPY requirements.txt .\nRUN pip install --no-cache-dir -r requirements.txt\nCOPY src/ src/\nCOPY models/house_model.joblib models/\nRUN useradd --create-home appuser\nUSER appuser\nEXPOSE 8000\nCMD [\"uvicorn\", \"src.main:app\", \"--host\", \"0.0.0.0\", \"--port\", \"8000\"]\n\n# docker build -t house-api:1.0.0 .\n# docker run -p 8000:8000 house-api:1.0.0",
        codeChallenge: {
          task:
            "Write lint_dockerfile(text) that checks a Dockerfile's lines and returns a sorted list of problem codes: \"unpinned-base\" if the FROM image has no tag or uses the tag latest; \"deps-after-code\" if a COPY of the whole context (COPY . .) appears before the RUN that installs requirements (a line containing \"pip install\"); \"runs-as-root\" if there is no USER instruction; \"no-cmd\" if there is no CMD or ENTRYPOINT. Instructions are case-insensitive; ignore blank lines and lines starting with #.",
          starter: "def lint_dockerfile(text):\n    pass\n",
          sample: "a Dockerfile with FROM python, COPY . . before pip install, no USER and no CMD → all four problems",
          tests: [
            {
              check: py`good = """FROM python:3.12-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
RUN useradd appuser
USER appuser
CMD ["uvicorn", "main:app", "--host", "0.0.0.0"]
"""
assert lint_dockerfile(good) == [], "A good Dockerfile has no problems. Got " + repr(lint_dockerfile(good))
bad = """# quick and dirty
from python
copy . .
run pip install -r requirements.txt
"""
assert lint_dockerfile(bad) == ["deps-after-code", "no-cmd", "runs-as-root", "unpinned-base"], "Got " + repr(lint_dockerfile(bad))
latest = good.replace("python:3.12-slim", "python:latest")
assert lint_dockerfile(latest) == ["unpinned-base"], "The latest tag is not a pin."
entry = good.replace('CMD ["uvicorn", "main:app", "--host", "0.0.0.0"]', 'ENTRYPOINT ["python", "serve.py"]')
assert lint_dockerfile(entry) == [], "ENTRYPOINT also starts the service."`,
            },
          ],
          solution: py`def lint_dockerfile(text):
    lines = [l.strip() for l in text.splitlines() if l.strip() and not l.strip().startswith("#")]
    problems = set()
    words = [l.split(None, 1) for l in lines]
    instr = [(w[0].upper(), w[1] if len(w) > 1 else "") for w in words]
    base = next((arg for op, arg in instr if op == "FROM"), "")
    image = base.split()[0] if base else ""
    if ":" not in image or image.endswith(":latest"):
        problems.add("unpinned-base")
    copy_all = next((i for i, (op, arg) in enumerate(instr) if op == "COPY" and arg.split()[:2] == [".", "."]), None)
    install = next((i for i, (op, arg) in enumerate(instr) if op == "RUN" and "pip install" in arg), None)
    if copy_all is not None and install is not None and copy_all < install:
        problems.add("deps-after-code")
    if not any(op == "USER" for op, _ in instr):
        problems.add("runs-as-root")
    if not any(op in ("CMD", "ENTRYPOINT") for op, _ in instr):
        problems.add("no-cmd")
    return sorted(problems)
`,
          hint: "Split each non-comment line into (INSTRUCTION, arguments) with the instruction upper-cased. Find the indices of COPY . . and of the RUN containing pip install and compare them.",
          successMessage: "Pinned base, cached dependencies, non-root user, explicit start command: four checks that prevent the most common container mistakes. Tools like hadolint automate many more.",
        },
      },
      {
        id: "a-ml-cicd",
        title: "Introduction to CI/CD for ML systems",
        explain:
          "CONTINUOUS INTEGRATION runs automated checks on every change (pull request): code tests, linting, DATA TESTS (schema, ranges, no unexpected nulls), and for ML, MODEL TESTS: train or load the model and check its metrics against thresholds AND against the current production model, plus behavioural tests (does the prediction rise when size rises? is it invariant to irrelevant changes?). CONTINUOUS DELIVERY/DEPLOYMENT then builds the Docker image, deploys to staging, runs smoke tests, and promotes to production, often gradually. GitHub Actions, GitLab CI and cloud pipelines run these steps from a YAML file in the repository. ML adds CONTINUOUS TRAINING: pipelines that retrain on new data and push a challenger through the same gates.",
        example:
          "# .github/workflows/ml.yml\nname: ml-ci\non: [pull_request]\njobs:\n  test-and-evaluate:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - uses: actions/setup-python@v5\n        with: { python-version: \"3.12\" }\n      - run: pip install -r requirements.txt\n      - run: pytest tests/                       # code and data tests\n      - run: python train.py --config params.yaml\n      - run: python evaluate.py --gate gate.yaml # fails the build if the quality gate fails",
        codeChallenge: {
          task:
            "Write quality_gate(report, production, thresholds) that returns (passed, reasons). report and production are dictionaries of metrics (\"auc\", \"recall\", \"p95_ms\"); report also has \"tests_passed\" (bool) and \"monotonic_size\" (bool). Fail with a reason string for each: tests not passed (\"tests failed\"); monotonic_size False (\"behaviour test failed\"); any metric in thresholds below its minimum (\"<metric> below threshold\") — thresholds maps metric names to minimums; AUC lower than production's by more than 0.005 (\"auc regressed\"); p95_ms more than 20% above production's (\"latency regressed\"). passed is True only with no reasons; reasons is in the order the checks are listed here.",
          starter: "def quality_gate(report, production, thresholds):\n    pass\n",
          sample: "a model with good metrics but a failing behaviour test → (False, [\"behaviour test failed\"])",
          tests: [
            {
              check: py`prod = {"auc": 0.84, "recall": 0.70, "p95_ms": 50}
th = {"auc": 0.80, "recall": 0.65}
good = {"auc": 0.85, "recall": 0.72, "p95_ms": 52, "tests_passed": True, "monotonic_size": True}
assert quality_gate(good, prod, th) == (True, []), "A good model passes. Got " + repr(quality_gate(good, prod, th))
weird = dict(good, monotonic_size=False)
assert quality_gate(weird, prod, th) == (False, ["behaviour test failed"]), "Got " + repr(quality_gate(weird, prod, th))
bad = {"auc": 0.79, "recall": 0.60, "p95_ms": 70, "tests_passed": False, "monotonic_size": True}
assert quality_gate(bad, prod, th) == (False, ["tests failed", "auc below threshold", "recall below threshold", "auc regressed", "latency regressed"]), "Every failure, in order. Got " + repr(quality_gate(bad, prod, th))
close = dict(good, auc=0.836)
assert quality_gate(close, prod, th) == (True, []), "A drop of 0.004 is within the 0.005 tolerance."`,
            },
          ],
          solution: py`def quality_gate(report, production, thresholds):
    reasons = []
    if not report["tests_passed"]:
        reasons.append("tests failed")
    if not report["monotonic_size"]:
        reasons.append("behaviour test failed")
    for metric, minimum in thresholds.items():
        if report[metric] < minimum:
            reasons.append(metric + " below threshold")
    if production["auc"] - report["auc"] > 0.005:
        reasons.append("auc regressed")
    if report["p95_ms"] > 1.2 * production["p95_ms"]:
        reasons.append("latency regressed")
    return (not reasons, reasons)
`,
          hint: "Collect reasons in a list, one check at a time in the stated order; passed is simply not reasons.",
          successMessage: "This gate is what a CI pipeline runs before any model reaches users: tests, behaviour, absolute thresholds and comparison with production. A failing gate fails the build.",
        },
      },
    ],

    task: {
      title: "Module 21 project: an MLOps pipeline for your model",
      intro:
        "Take the model and API from Modules 19 and 20 and give them the operational backbone of a production system.",
      prompts: [
        "Put the project in Git with a sensible .gitignore; version the training data with DVC (or a content hash recorded in metadata).",
        "Write a reproducible train.py driven by params.yaml, with every seed fixed; show that two runs give identical metrics.",
        "Track every experiment with MLflow (parameters, metrics, data version, model artifact) and register the best model.",
        "Compute PSI daily for each input feature from logged requests, with alert thresholds, and a monitoring report.",
        "Write a retraining policy and a champion/challenger promotion gate with segment and latency checks.",
        "Containerise the API with a Dockerfile that passes your linter, and run it locally with docker run.",
        "Add a GitHub Actions workflow that runs tests, trains, evaluates and fails the build if the quality gate fails.",
      ],
      closing: "A model can be accurate, monitored and well engineered, and still be unfair or unsafe. Module 22 is about building ML responsibly.",
    },

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
