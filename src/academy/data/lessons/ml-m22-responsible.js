/**
 * MACHINE LEARNING AND AI · MODULE 22 · RESPONSIBLE AND ETHICAL MACHINE LEARNING
 *
 * Curriculum 22.1 – 22.10. Algorithmic bias; data privacy; responsible data
 * collection; fairness; explainability; interpretable versus black-box
 * models; SHAP and feature attribution; security threats; misuse and
 * limitations; and responsible deployment. Each principle is made concrete
 * in code: pseudonymisation and k-anonymity, three fairness metrics, linear
 * explanations, exact Shapley values (the idea SHAP approximates), an
 * adversarial example against a real classifier, out-of-distribution
 * detection, and a model card.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

export const SECTION_ID = "ml-s22-responsible";

const PY = "python";
const py = String.raw;

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 97 · 22.1 – 22.3
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ml-l97-bias-privacy-collection",
    moduleId: "ml-m22-responsible",
    sectionId: SECTION_ID,
    order: 1,
    covers: ["22.1", "22.2", "22.3"],
    title: "Algorithmic Bias, Data Privacy and Responsible Data Collection",
    subtitle: "How models inherit unfairness, and how to handle people's data with care",
    estimatedMinutes: 38,
    intro:
      "A model learns from history, and history contains unfairness. Models also run on personal data that people have a right to protect. Responsible ML starts before training, with the data.",

    atoms: [
      {
        id: "a-ml-algorithmic-bias",
        title: "Understanding algorithmic bias",
        explain:
          "ALGORITHMIC BIAS is systematic, unfair difference in how a model treats groups of people. Its sources: HISTORICAL bias (the data records past discrimination: if loans were denied to a group, a model learns to deny them); REPRESENTATION bias (some groups are under-represented, so the model is less accurate for them: face recognition systems have shown far higher error rates on darker-skinned women); MEASUREMENT bias (the label is a poor proxy: using past healthcare spending as a proxy for health need under-rated the needs of patients who had less access to care); and PROXY features (removing \"gender\" does not help if \"first name\" or \"occupation\" stands in for it). Bias is not fixed by good intentions; it must be measured.",
        codeExercise: {
          language: PY,
          code: py`import numpy as np
from sklearn.linear_model import LogisticRegression

rng = np.random.default_rng(22)
n = 2000
group = rng.integers(0, 2, n)                         # 0 and 1: two groups of applicants
income = rng.normal(150, 40, n)
# historical decisions held group 1 to a higher bar, at the SAME income
approved = (income - 25 * group + rng.normal(0, 20, n) > 140).astype(int)

X = np.column_stack([income, group])
model = LogisticRegression(max_iter=1000).fit(X, approved)
pred = model.predict(X)
for g in [0, 1]:
    print(g, round(pred[group == g].mean(), 2))
print(round(model.coef_[0][1], 2) < 0)
`,
          question: "A model is trained on past loan decisions that held group 1 to a higher bar at the same income. What approval rates does it predict for each group, and does it learn a negative weight for group membership?",
          expectedOutput: "0 0.61\n1 0.33\nTrue",
          hint: "The model faithfully learns the pattern in its labels, including the extra penalty applied to group 1.",
          successMessage: "The model reproduced the historical penalty: 61% versus 33% approval for applicants with the same income distribution. Accurate on its training labels, and unfair.",
        },
      },
      {
        id: "a-ml-data-privacy",
        title: "Data privacy",
        explain:
          "PERSONAL DATA is any information relating to an identifiable person: names, phone numbers, BVNs, addresses, and combinations of ordinary fields (age + postcode + gender can identify most people). Laws such as Nigeria's Data Protection Act (NDPA, 2023) and the EU's GDPR require a lawful basis for processing, PURPOSE LIMITATION, data MINIMISATION, security, limited retention and respect for people's rights (access, correction, deletion). Techniques: PSEUDONYMISATION (replace identifiers with keyed hashes or random IDs: still personal data, but safer), MASKING, generalisation (exact age → age band), aggregation, and k-ANONYMITY (every combination of quasi-identifiers is shared by at least k people). Advanced: differential privacy and federated learning.",
        codeChallenge: {
          task:
            "Write pseudonymise(value, secret) that returns the first 16 hex characters of HMAC-SHA256(secret, value) (hmac.new(secret.encode(), value.encode(), hashlib.sha256)). Write mask_phone(phone) that keeps the first 4 and last 2 digits and replaces the rest with \"*\" (\"08012345678\" → \"0801*****78\"). Write age_band(age) returning \"18-29\", \"30-44\", \"45-59\" or \"60+\". Then write k_anonymity(rows, keys) that returns the size of the smallest group of rows sharing the same values for keys.",
          starter: "import hashlib\nimport hmac\nfrom collections import Counter\n\ndef pseudonymise(value, secret):\n    pass\n\ndef mask_phone(phone):\n    pass\n\ndef age_band(age):\n    pass\n\ndef k_anonymity(rows, keys):\n    pass\n",
          sample: "mask_phone(\"08012345678\") → \"0801*****78\"",
          tests: [
            {
              check: py`import hmac, hashlib
p = pseudonymise("22233344455", "s3cret")
assert p == hmac.new(b"s3cret", b"22233344455", hashlib.sha256).hexdigest()[:16], "Keyed HMAC-SHA256, first 16 hex characters."
assert pseudonymise("22233344455", "s3cret") == p and pseudonymise("22233344455", "other") != p, "Same input and key, same pseudonym; another key, another pseudonym."
assert mask_phone("08012345678") == "0801*****78", "Got " + repr(mask_phone("08012345678"))
assert [age_band(a) for a in [18, 29, 30, 44, 45, 59, 60, 88]] == ["18-29", "18-29", "30-44", "30-44", "45-59", "45-59", "60+", "60+"], "Age bands."
rows = [{"band": "18-29", "state": "Lagos"}] * 3 + [{"band": "30-44", "state": "Lagos"}] * 2 + [{"band": "30-44", "state": "Kano"}]
assert k_anonymity(rows, ["band", "state"]) == 1, "One person is alone in their group: k = 1, identifiable."
assert k_anonymity(rows, ["band"]) == 3, "Dropping state, every band has at least 3 people."`,
            },
          ],
          solution: py`import hashlib
import hmac
from collections import Counter

def pseudonymise(value, secret):
    return hmac.new(secret.encode(), value.encode(), hashlib.sha256).hexdigest()[:16]

def mask_phone(phone):
    return phone[:4] + "*" * (len(phone) - 6) + phone[-2:]

def age_band(age):
    if age < 30:
        return "18-29"
    if age < 45:
        return "30-44"
    if age < 60:
        return "45-59"
    return "60+"

def k_anonymity(rows, keys):
    counts = Counter(tuple(r[k] for k in keys) for r in rows)
    return min(counts.values())
`,
          hint: "HMAC with a secret key prevents anyone without the key from rebuilding the pseudonyms by hashing every possible value. For k-anonymity, count tuples of the key values with Counter and take the minimum.",
          successMessage: "A plain hash of a BVN can be reversed by hashing every possible number; a keyed HMAC cannot. And k = 1 means someone in the dataset is identifiable from band and state alone.",
        },
      },
      {
        id: "a-ml-responsible-collection",
        title: "Responsible data collection",
        explain:
          "Responsible collection asks, before any data is gathered: is there a clear PURPOSE and a lawful basis? Have people given INFORMED CONSENT where needed, understanding what is collected and why? Is only what is NECESSARY being collected (minimisation)? Is the sample REPRESENTATIVE of everyone the model will affect (urban and rural, all regions, languages, ages, genders)? Are LABELS created fairly, by people paid and instructed properly, and checked for annotator bias? Are SENSITIVE attributes (ethnicity, religion, health) handled with extra care, often collected separately only to AUDIT fairness, never as model inputs? Document the answers in a DATASHEET for the dataset.",
        table: {
          caption: "Questions to answer before collecting data.",
          headers: ["Principle", "Question", "Example"],
          rows: [
            ["Purpose", "What decision will this data support?", "\"Predict crop disease from leaf photos\", not \"collect everything\""],
            ["Consent", "Do people know and agree?", "Clear opt-in in the app, in English, Hausa, Yoruba and Igbo"],
            ["Minimisation", "Is every field necessary?", "No need for a farmer's BVN to classify a leaf photo"],
            ["Representativeness", "Does the sample cover everyone affected?", "Photos from all regions, seasons and phone camera qualities"],
            ["Labelling", "Are labels accurate and unbiased?", "Two agronomists per photo, disagreements reviewed"],
            ["Retention", "How long is it kept, and how is it deleted?", "Raw photos deleted after 2 years, features kept"],
          ],
        },
        decision: {
          scenario: "A team building a credit model for small traders proposes collecting applicants' full phone contact lists \"in case it helps the model\".",
          question: "What does responsible collection require here?",
          options: [
            { id: "a", text: "Collect it: more data always improves models", whyWrong: "More data is not always better, and this data is intrusive, concerns third parties who never consented, and may be unlawful." },
            { id: "b", text: "Do not collect it unless there is a clear, lawful, proportionate purpose with informed consent; prefer less intrusive features", why: "Minimisation and purpose limitation: contacts are highly sensitive, involve people who did not consent, and invite misuse such as debt-shaming." },
            { id: "c", text: "Collect it but tell nobody", whyWrong: "Hidden collection violates transparency and consent." },
            { id: "d", text: "Collect it and delete it after training", whyWrong: "Deleting later does not make the collection necessary or consented." },
          ],
          correct: "b",
          aftermath: "Ask what is necessary, not what is available. Regulators have penalised lenders for exactly this kind of contact harvesting.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 98 · 22.4 – 22.6
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ml-l98-fairness-explainability",
    moduleId: "ml-m22-responsible",
    sectionId: SECTION_ID,
    order: 2,
    covers: ["22.4", "22.5", "22.6"],
    title: "Fairness, Explainability and Interpretable Models",
    subtitle: "Measuring unfairness, and explaining what a model decided and why",
    estimatedMinutes: 40,
    intro:
      "Fairness can be measured, and different measures can disagree. Explanations let people understand, challenge and trust decisions. Sometimes the best explanation is a model simple enough to read.",

    atoms: [
      {
        id: "a-ml-fairness",
        title: "Fairness in machine learning",
        explain:
          "Fairness has several mathematical definitions, comparing groups defined by a protected attribute. DEMOGRAPHIC PARITY: equal rates of positive predictions across groups (equal approval rates). EQUAL OPPORTUNITY: equal TRUE POSITIVE rates (qualified applicants approved equally often in each group). EQUALISED ODDS: equal true positive AND false positive rates. The DISPARATE IMPACT ratio (the lower group's positive rate divided by the higher's) is often checked against the \"four-fifths rule\" (below 0.8 suggests adverse impact). Important result: when base rates differ between groups, these criteria generally cannot all hold at once, so choosing one is an ethical and legal decision, made with stakeholders, not a technical default. Mitigation can act before training (reweighting data), during (fairness constraints) or after (group-specific thresholds).",
        codeChallenge: {
          task:
            "Write fairness_report(y_true, y_pred, group) for 0/1 arrays and a group array with values \"A\" and \"B\". Return a dictionary with: \"parity_diff\" (positive prediction rate of A minus that of B), \"opportunity_diff\" (true positive rate of A minus that of B), and \"disparate_impact\" (the smaller positive rate divided by the larger), each rounded to 3.",
          starter: "import numpy as np\n\ndef fairness_report(y_true, y_pred, group):\n    pass\n",
          sample: "if A is approved 60% of the time and B 30%, disparate_impact = 0.5, well below the 0.8 rule",
          tests: [
            {
              check: py`import numpy as np
y_true = np.array([1, 1, 0, 0, 1, 1, 1, 0, 0, 0])
y_pred = np.array([1, 1, 1, 0, 1, 0, 0, 1, 0, 0])
group  = np.array(["A"] * 5 + ["B"] * 5)
r = fairness_report(y_true, y_pred, group)
assert r == {"parity_diff": 0.6, "opportunity_diff": 1.0, "disparate_impact": 0.25}, "A: 4/5 approved, true positive rate 3/3. B: 1/5 approved, true positive rate 0/2. Got " + repr(r)
eq = fairness_report(np.array([1, 0, 1, 0]), np.array([1, 0, 1, 0]), np.array(["A", "A", "B", "B"]))
assert eq == {"parity_diff": 0.0, "opportunity_diff": 0.0, "disparate_impact": 1.0}, "Equal treatment gives zeros and a ratio of 1."`,
            },
          ],
          solution: py`import numpy as np

def fairness_report(y_true, y_pred, group):
    y_true, y_pred, group = map(np.asarray, (y_true, y_pred, group))
    rate, tpr = {}, {}
    for g in ["A", "B"]:
        m = group == g
        rate[g] = y_pred[m].mean()
        tpr[g] = y_pred[m & (y_true == 1)].mean()
    return {
        "parity_diff": round(float(rate["A"] - rate["B"]), 3),
        "opportunity_diff": round(float(tpr["A"] - tpr["B"]), 3),
        "disparate_impact": round(float(min(rate.values()) / max(rate.values())), 3),
    }
`,
          hint: "For each group, the positive rate is y_pred[mask].mean(); the true positive rate is the same mean restricted to rows where y_true == 1.",
          successMessage: "Group B is approved at a quarter of A's rate, and none of its qualified applicants were approved. Numbers like these turn a vague worry into evidence a team must act on.",
        },
      },
      {
        id: "a-ml-explainability",
        title: "Model explainability",
        explain:
          "EXPLAINABILITY is the ability to describe why a model produced its outputs. GLOBAL explanations describe the model overall (which features matter most: permutation importance, Module 13). LOCAL explanations describe one prediction (why was THIS loan declined?). People affected by automated decisions increasingly have rights to meaningful explanations, and explanations also help engineers find bugs and leakage. For a linear model, a local explanation is exact: each feature's CONTRIBUTION is its coefficient times its (standardised) value relative to a baseline, and the contributions sum to the prediction's score. Good explanations are faithful to the model, understandable to their audience, and ACTIONABLE (\"reducing existing debt by ₦200,000 would change the outcome\").",
        codeExercise: {
          language: PY,
          code: py`import numpy as np

features = ["income", "existing_debt", "years_in_business"]
coef = np.array([1.2, -1.8, 0.6])                # logistic regression on standardised inputs
intercept = -0.3
applicant = np.array([-0.5, 1.4, 0.2])           # standardised values for one applicant

contrib = coef * applicant
score = intercept + contrib.sum()
p = 1 / (1 + np.exp(-score))
for f, c in sorted(zip(features, contrib), key=lambda t: t[1]):
    print(f, round(c, 2))
print(round(score, 2), round(p, 3))
`,
          question: "Explain one declined applicant: each feature's contribution to the score (most negative first), the total score and the approval probability. What does it print?",
          expectedOutput: "existing_debt -2.52\nincome -0.6\nyears_in_business 0.12\n-3.3 0.036",
          hint: "Each contribution is coefficient × value: −1.8 × 1.4, 1.2 × −0.5, 0.6 × 0.2. The score adds the intercept.",
          successMessage: "\"Your existing debt was the main reason\" is a faithful, actionable explanation, and for a linear model it is exact: the contributions add up to the score.",
        },
      },
      {
        id: "a-ml-interpretable-models",
        title: "Interpretable vs black-box models",
        explain:
          "INTERPRETABLE models are understandable by design: linear and logistic regression (coefficients), shallow decision trees (rules a person can follow), rule lists and scorecards (still standard in credit). BLACK-BOX models (large ensembles, neural networks) can be more accurate on complex data but need POST-HOC explanation tools, which approximate rather than reveal their logic. On tabular data the accuracy gap is often small; for high-stakes decisions (credit, health, justice, hiring) many experts argue (Cynthia Rudin, 2019) that you should use an interpretable model whenever it performs comparably, rather than explaining a black box after the fact. Measure the gap before deciding.",
        codeChallenge: {
          task:
            "Write compare_interpretability(X_train, y_train, X_test, y_test, names) that fits DecisionTreeClassifier(max_depth=3, random_state=0) and RandomForestClassifier(n_estimators=200, random_state=0), and returns {\"tree_acc\", \"forest_acc\", \"gap\", \"rules\"}: test accuracies rounded to 3, gap = forest_acc − tree_acc rounded to 3, and rules = sklearn.tree.export_text(tree, feature_names=names), the tree written as readable if-then rules.",
          starter: "from sklearn.tree import DecisionTreeClassifier, export_text\nfrom sklearn.ensemble import RandomForestClassifier\n\ndef compare_interpretability(X_train, y_train, X_test, y_test, names):\n    pass\n",
          sample: "a depth-3 tree within a few points of the forest, with rules like \"|--- debt_ratio <= 0.42\"",
          tests: [
            {
              check: py`import numpy as np
from sklearn.model_selection import train_test_split
rng = np.random.default_rng(5)
n = 1500
debt_ratio = rng.uniform(0, 1, n)
income = rng.normal(150, 40, n)
years = rng.integers(0, 20, n)
y = ((debt_ratio < 0.45) & (income > 120) | (years > 15)).astype(int)
flip = rng.uniform(0, 1, n) < 0.05
y = np.where(flip, 1 - y, y)
X = np.column_stack([debt_ratio, income, years])
Xtr, Xte, ytr, yte = train_test_split(X, y, test_size=0.3, random_state=0)
r = compare_interpretability(Xtr, ytr, Xte, yte, ["debt_ratio", "income", "years"])
assert set(r) == {"tree_acc", "forest_acc", "gap", "rules"}, "Return the four keys."
assert r["gap"] == round(r["forest_acc"] - r["tree_acc"], 3) and r["gap"] < 0.03, "On rule-like data the shallow tree is almost as accurate. Got " + repr((r["tree_acc"], r["forest_acc"]))
assert "debt_ratio <=" in r["rules"] and "class:" in r["rules"], "rules is export_text output with feature names."
assert r["tree_acc"] > 0.85, "The tree should capture the main rules."`,
            },
          ],
          solution: py`from sklearn.tree import DecisionTreeClassifier, export_text
from sklearn.ensemble import RandomForestClassifier

def compare_interpretability(X_train, y_train, X_test, y_test, names):
    tree = DecisionTreeClassifier(max_depth=3, random_state=0).fit(X_train, y_train)
    forest = RandomForestClassifier(n_estimators=200, random_state=0).fit(X_train, y_train)
    tree_acc = round(tree.score(X_test, y_test), 3)
    forest_acc = round(forest.score(X_test, y_test), 3)
    return {
        "tree_acc": tree_acc,
        "forest_acc": forest_acc,
        "gap": round(forest_acc - tree_acc, 3),
        "rules": export_text(tree, feature_names=names),
    }
`,
          hint: "Fit both, score both, and pass the fitted tree with feature_names=names to export_text.",
          successMessage: "A few points of accuracy, or a model a loan officer and an applicant can read line by line. Measuring the gap turns that trade-off into an informed decision.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 99 · 22.7 – 22.8
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ml-l99-attribution-security",
    moduleId: "ml-m22-responsible",
    sectionId: SECTION_ID,
    order: 3,
    covers: ["22.7", "22.8"],
    title: "SHAP, Feature Attribution and Security Threats",
    subtitle: "Fair credit for every feature, and the attacks ML systems face",
    estimatedMinutes: 42,
    intro:
      "SHAP explains any model's prediction by sharing credit fairly among its features, using an idea from game theory you will compute exactly. Then the darker side: attackers who fool, poison or copy models.",

    atoms: [
      {
        id: "a-ml-shap",
        title: "Introduction to SHAP and feature attribution",
        explain:
          "FEATURE ATTRIBUTION assigns each feature a share of the difference between a prediction and a BASELINE (the average prediction). SHAP (SHapley Additive exPlanations, Lundberg and Lee, 2017) uses SHAPLEY VALUES from cooperative game theory: a feature's value is its average MARGINAL CONTRIBUTION across every possible order in which features could be added. Shapley values are the only attribution with key fairness properties: they sum exactly to (prediction − baseline) (ADDITIVITY), features that never matter get zero, and identical features get equal credit. Exact computation needs every subset of features, exponential in their number, so the shap library uses fast approximations (KernelSHAP for any model, TreeSHAP exactly and quickly for tree ensembles). Plots show global importance (mean |SHAP|) and local explanations (waterfall charts).",
        example:
          "import shap                                   # pip install shap (on your machine)\n\nexplainer = shap.TreeExplainer(forest)\nshap_values = explainer(X_test)\nshap.plots.waterfall(shap_values[0])          # why this one prediction\nshap.plots.beeswarm(shap_values)              # global picture",
        codeChallenge: {
          task:
            "Write shapley_values(f, x, baseline) that computes EXACT Shapley values for a function f of a NumPy feature vector. For a subset S of features, the value v(S) is f of a vector taking x's values for features in S and baseline's values elsewhere. For each feature i, sum over every subset S not containing i: |S|! × (n − |S| − 1)! / n! × (v(S ∪ {i}) − v(S)). Return a NumPy array of n Shapley values. Use itertools.combinations and math.factorial.",
          starter: "import itertools\nimport math\nimport numpy as np\n\ndef shapley_values(f, x, baseline):\n    pass\n",
          sample: "for a linear f, each Shapley value equals coefficient × (x − baseline)",
          tests: [
            {
              check: py`import numpy as np
coef = np.array([2.0, -1.0, 0.5])
lin = lambda v: float(coef @ v + 3)
x, base = np.array([1.0, 4.0, 2.0]), np.array([0.0, 1.0, 0.0])
phi = shapley_values(lin, x, base)
assert np.allclose(phi, coef * (x - base)), "For a linear model, Shapley value = coefficient × (x − baseline). Got " + repr(phi)
inter = lambda v: float(v[0] * v[1] + v[2] ** 2)
x2, b2 = np.array([2.0, 3.0, 1.0]), np.array([0.0, 0.0, 0.0])
p2 = shapley_values(inter, x2, b2)
assert abs(p2.sum() - (inter(x2) - inter(b2))) < 1e-9, "Additivity: the values sum to f(x) − f(baseline)."
assert np.allclose(p2, [3.0, 3.0, 1.0]), "The interaction x₀·x₁ = 6 is split equally between features 0 and 1. Got " + repr(p2)
dead = lambda v: float(5 * v[0])
assert np.allclose(shapley_values(dead, np.array([1.0, 9.0]), np.zeros(2)), [5.0, 0.0]), "A feature the model ignores gets zero."`,
            },
          ],
          solution: py`import itertools
import math
import numpy as np

def shapley_values(f, x, baseline):
    n = len(x)

    def value(subset):
        v = baseline.copy().astype(float)
        for j in subset:
            v[j] = x[j]
        return f(v)

    phi = np.zeros(n)
    for i in range(n):
        others = [j for j in range(n) if j != i]
        for size in range(n):
            weight = math.factorial(size) * math.factorial(n - size - 1) / math.factorial(n)
            for S in itertools.combinations(others, size):
                phi[i] += weight * (value(S + (i,)) - value(S))
    return phi
`,
          hint: "value(S) builds a copy of baseline with x's values in the positions in S. For each feature i, loop over subset sizes 0 … n − 1 of the OTHER features with itertools.combinations, weighting each marginal contribution.",
          successMessage: "Exact Shapley values: additive, zero for ignored features, and an interaction shared equally. The shap library approximates exactly this when features are too many to enumerate.",
        },
      },
      {
        id: "a-ml-security-threats",
        title: "Security threats against ML systems",
        explain:
          "ML systems face attacks that ordinary software does not. ADVERSARIAL EXAMPLES: inputs changed slightly, often imperceptibly, to cause a wrong prediction (a few pixels make a stop sign read as a speed limit; a fraudster nudges transaction features below a threshold); the FAST GRADIENT SIGN METHOD moves the input by ε × sign(gradient of the loss). DATA POISONING: corrupting training data (fake reviews, mislabelled examples) to plant errors or backdoors. MODEL EXTRACTION: copying a model by querying it many times. MEMBERSHIP INFERENCE and model inversion: learning whether a person was in the training data, or reconstructing it. PROMPT INJECTION against language models (Module 23). Defences: input validation, rate limits, monitoring, adversarial training, data provenance checks, and differential privacy.",
        codeChallenge: {
          task:
            "Write fgsm(model, x, y, eps) for a fitted scikit-learn LogisticRegression on 2 features: the gradient of the log loss with respect to the input is (p − y) × w, where p = model.predict_proba([x])[0, 1] and w = model.coef_[0]. Return x + eps × sign(gradient), the adversarial example. Then write smallest_flip(model, x, y, eps_values) returning the first eps in eps_values whose adversarial example changes the model's prediction, or None.",
          starter: "import numpy as np\n\ndef fgsm(model, x, y, eps):\n    pass\n\ndef smallest_flip(model, x, y, eps_values):\n    pass\n",
          sample: "a transaction correctly flagged as fraud is pushed just across the boundary by a small, targeted change",
          tests: [
            {
              check: py`import numpy as np
from sklearn.linear_model import LogisticRegression
rng = np.random.default_rng(8)
X = np.vstack([rng.normal([0, 0], 1, (200, 2)), rng.normal([3, 3], 1, (200, 2))])
y = np.array([0] * 200 + [1] * 200)
m = LogisticRegression().fit(X, y)
x = np.array([2.2, 2.0])
assert m.predict([x])[0] == 1, "The original point is classified as fraud."
adv = fgsm(m, x, 1, 0.5)
p = m.predict_proba([x])[0, 1]
assert np.allclose(adv, x + 0.5 * np.sign((p - 1) * m.coef_[0])), "x + eps × sign((p − y) × w)."
assert m.predict_proba([adv])[0, 1] < p, "The attack lowers the fraud probability."
e = smallest_flip(m, x, 1, [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.8, 1.0])
assert e is not None and m.predict([fgsm(m, x, 1, e)])[0] == 0, "Some small eps flips the prediction. Got " + repr(e)
assert smallest_flip(m, np.array([6.0, 6.0]), 1, [0.1, 0.2]) is None, "A point deep inside its class does not flip with tiny eps."`,
            },
          ],
          solution: py`import numpy as np

def fgsm(model, x, y, eps):
    p = model.predict_proba([x])[0, 1]
    grad = (p - y) * model.coef_[0]
    return x + eps * np.sign(grad)

def smallest_flip(model, x, y, eps_values):
    original = model.predict([x])[0]
    for eps in eps_values:
        if model.predict([fgsm(model, x, y, eps)])[0] != original:
            return eps
    return None
`,
          hint: "p = model.predict_proba([x])[0, 1]; gradient = (p − y) × model.coef_[0]; return x + eps * np.sign(gradient). Try each eps in order until the prediction changes.",
          successMessage: "A small, targeted nudge to two features moved a fraud case to \"legitimate\". Points near the boundary are the vulnerable ones, which is why robust models and monitoring matter.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 100 · 22.9 – 22.10
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ml-l100-misuse-deployment",
    moduleId: "ml-m22-responsible",
    sectionId: SECTION_ID,
    order: 4,
    covers: ["22.9", "22.10"],
    title: "Model Misuse, Limitations and Responsible Deployment",
    subtitle: "Knowing where a model must not be trusted, and launching it with care",
    estimatedMinutes: 38,
    intro:
      "Every model has limits: data it never saw, groups it serves badly, uses it was never meant for. Responsible deployment states those limits openly, guards against them in code, and keeps humans accountable.",

    atoms: [
      {
        id: "a-ml-misuse-limitations",
        title: "Model misuse and limitations",
        explain:
          "MISUSE includes using a model outside its intended purpose (a churn model repurposed to set individual prices), on populations it was not trained on (a model built on Lagos data applied in rural Borno), as the sole decision-maker where human judgement is required, or deliberately for harm (surveillance, manipulation, deepfakes). LIMITATIONS are intrinsic: models extrapolate poorly OUTSIDE THE TRAINING DISTRIBUTION, learn correlation not causation, are less accurate for under-represented groups, and their confidence scores can be miscalibrated. A practical safeguard is detecting OUT-OF-DISTRIBUTION inputs, for example inputs whose features fall outside the training range or far from any training example, and flagging them for human review instead of silently predicting.",
        codeExercise: {
          language: PY,
          code: py`import numpy as np

rng = np.random.default_rng(0)
train = np.column_stack([rng.uniform(40, 250, 500), rng.integers(1, 6, 500)])   # size, bedrooms
lo, hi = np.percentile(train, 1, axis=0), np.percentile(train, 99, axis=0)

requests = np.array([[120, 3], [900, 2], [60, 9], [200, 4]])
for r in requests:
    outside = (r < lo) | (r > hi)
    print(r.tolist(), "review" if outside.any() else "ok")
`,
          question: "The service flags requests with any feature outside the 1st to 99th percentile of the training data. Which of four requests go to human review?",
          expectedOutput: "[120, 3] ok\n[900, 2] review\n[60, 9] review\n[200, 4] ok",
          hint: "Training sizes run from 40 to 250 m² and bedrooms from 1 to 5.",
          successMessage: "A 900 m² house and a 9-bedroom flat are outside anything the model learned from. Flagging them is honest; predicting confidently would be extrapolation dressed up as knowledge.",
        },
      },
      {
        id: "a-ml-responsible-deployment",
        title: "Responsible deployment",
        explain:
          "Before launch: test performance and FAIRNESS per relevant group; red-team the system for misuse; document it in a MODEL CARD (Mitchell et al., 2019): intended use and out-of-scope uses, training data, evaluation results overall and per group, limitations, ethical considerations, and contacts. At launch: roll out gradually, keep a HUMAN IN THE LOOP for consequential or uncertain cases, tell people when an automated system is involved, and give them a way to CONTEST decisions. After launch: monitor performance, fairness and drift (Module 21), keep audit logs, and have a plan to pause or roll back. Accountability stays with people and organisations, never with \"the algorithm\".",
        codeChallenge: {
          task:
            "Write model_card(info) that takes a dictionary and returns a Markdown string. REQUIRED keys: name, version, intended_use, out_of_scope, training_data, metrics (a dict), group_metrics (a dict of group → dict), limitations (a list) and contact; if any is missing raise ValueError listing the missing keys in sorted order (\"missing: a, b\"). The card starts with \"# Model card: <name> v<version>\" and has a section heading \"## <Title>\" for each of: Intended use, Out of scope, Training data, Metrics, Metrics by group, Limitations, Contact. Metrics render as \"- key: value\" lines; each group as \"- <group>: key=value, key=value\"; limitations as \"- item\" lines.",
          starter: "def model_card(info):\n    pass\n",
          sample: "model_card({...}) → \"# Model card: loan-approval v2.1.0\\n\\n## Intended use\\n...\"",
          tests: [
            {
              check: py`info = {
    "name": "loan-approval", "version": "2.1.0",
    "intended_use": "Support loan officers assessing small-business loans up to ₦5m.",
    "out_of_scope": "Fully automated rejection; personal loans; applicants outside Nigeria.",
    "training_data": "48,000 applications, 2021-2025, pseudonymised.",
    "metrics": {"auc": 0.84, "recall": 0.71},
    "group_metrics": {"women": {"auc": 0.83, "approval_rate": 0.41}, "men": {"auc": 0.85, "approval_rate": 0.44}},
    "limitations": ["Less accurate for businesses under 1 year old", "Not validated in the North East"],
    "contact": "ml-governance@example.ng",
}
card = model_card(info)
assert card.startswith("# Model card: loan-approval v2.1.0"), "Title line. Got " + repr(card[:40])
for h in ["Intended use", "Out of scope", "Training data", "Metrics", "Metrics by group", "Limitations", "Contact"]:
    assert "## " + h + "\n" in card, "Missing section: " + h
assert "- auc: 0.84" in card and "- women: auc=0.83, approval_rate=0.41" in card, "Render metrics and group metrics as list lines."
assert "- Not validated in the North East" in card, "List each limitation."
assert card.index("## Intended use") < card.index("## Limitations") < card.index("## Contact"), "Sections in the stated order."
try:
    model_card({"name": "x", "version": "1"})
    assert False, "Missing required fields must raise ValueError."
except ValueError as e:
    assert str(e).startswith("missing: contact, group_metrics, intended_use"), "List missing keys sorted. Got " + repr(str(e))`,
            },
          ],
          solution: py`REQUIRED = ["name", "version", "intended_use", "out_of_scope", "training_data",
            "metrics", "group_metrics", "limitations", "contact"]

def model_card(info):
    missing = sorted(k for k in REQUIRED if k not in info)
    if missing:
        raise ValueError("missing: " + ", ".join(missing))
    lines = [f"# Model card: {info['name']} v{info['version']}", ""]
    def section(title, body):
        lines.extend([f"## {title}", *body, ""])
    section("Intended use", [info["intended_use"]])
    section("Out of scope", [info["out_of_scope"]])
    section("Training data", [info["training_data"]])
    section("Metrics", [f"- {k}: {v}" for k, v in info["metrics"].items()])
    section("Metrics by group", [
        f"- {g}: " + ", ".join(f"{k}={v}" for k, v in m.items()) for g, m in info["group_metrics"].items()
    ])
    section("Limitations", [f"- {item}" for item in info["limitations"]])
    section("Contact", [info["contact"]])
    return "\n".join(lines)
`,
          hint: "Check the required keys first. Build a list of lines: the title, then for each section a \"## Title\" line, its body lines and a blank line. Join with \"\\n\".",
          successMessage: "A model card makes intended use, limits and per-group performance visible to everyone who will rely on the model. Refusing to generate one with missing fields keeps the documentation honest.",
        },
      },
    ],

    task: {
      title: "Module 22 project: a fairness and explainability audit",
      intro:
        "Audit a loan approval model (train one on a public credit dataset, such as the German Credit or a lending club sample, or on synthetic Nigerian SME loan data you generate) as if you were its independent reviewer.",
      prompts: [
        "Document the data: its source, consent basis, personal fields, and which protected or sensitive attributes are present or proxied.",
        "Pseudonymise identifiers and check the k-anonymity of the quasi-identifiers you keep.",
        "Measure demographic parity, equal opportunity and disparate impact across at least two groups, and explain which criterion you would prioritise and why.",
        "Try one mitigation (reweighting, removing a proxy, or group-aware thresholds) and report its effect on fairness AND accuracy.",
        "Compare a depth-3 tree with a gradient-boosted model, and explain five individual decisions with SHAP (on your machine) or exact Shapley values on a reduced feature set.",
        "Test robustness: how small a change to which features flips decisions near the boundary?",
        "Write a model card with intended use, out-of-scope uses, per-group metrics and limitations, and a recommendation: deploy, deploy with safeguards, or do not deploy.",
      ],
      closing: "You can now build, deploy, operate and audit ML systems. Module 23 surveys the applications where they matter most, and the large language models changing the field.",
    },

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
