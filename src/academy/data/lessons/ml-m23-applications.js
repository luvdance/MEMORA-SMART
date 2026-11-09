/**
 * MACHINE LEARNING AND AI · MODULE 23 · ADVANCED MACHINE LEARNING APPLICATIONS
 *
 * Curriculum 23.1 – 23.10. Recommendation systems (collaborative filtering
 * and content-based); anomaly detection applications; fraud detection;
 * predictive maintenance; financial prediction; sports analytics;
 * intelligent search; and large language models and their relationship to
 * machine learning. Each application is built in miniature with the tools
 * of earlier modules: cosine similarity, TF-IDF, robust statistics, rolling
 * features, honest backtests, Elo ratings, retrieval and sampling.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

export const SECTION_ID = "ml-s23-applications";

const PY = "python";
const py = String.raw;

// A small ratings matrix: rows are users, columns are products, 0 = not rated.
const RATINGS = py`import numpy as np
products = ["rice", "beans", "garri", "palm oil", "yam", "plantain"]
R = np.array([
    [5, 4, 0, 1, 0, 1],    # Ada
    [4, 5, 4, 0, 1, 0],    # Bayo
    [1, 0, 2, 5, 4, 5],    # Chi
    [0, 1, 1, 4, 5, 4],    # Dele
    [5, 5, 4, 1, 0, 0],    # Efe
], dtype=float)
`;

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 101 · 23.1 – 23.3
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ml-l101-recommenders",
    moduleId: "ml-m23-applications",
    sectionId: SECTION_ID,
    order: 1,
    covers: ["23.1", "23.2", "23.3"],
    title: "Recommendation Systems",
    subtitle: "Collaborative filtering and content-based recommendation",
    estimatedMinutes: 42,
    intro:
      "Jumia's \"customers also bought\", Spotify's playlists, YouTube's next video: recommendation systems drive a large share of what people buy and watch online. Two ideas power most of them: similar users like similar things, and similar things resemble each other.",

    atoms: [
      {
        id: "a-ml-recommendation-systems",
        title: "Recommendation systems",
        explain:
          "A RECOMMENDER predicts which items a user will like and ranks them. Inputs: EXPLICIT feedback (ratings, reviews) and, far more abundant, IMPLICIT feedback (views, clicks, purchases, time spent). Approaches: POPULARITY baselines (top sellers; hard to beat for new users), COLLABORATIVE FILTERING (learn from the user-item interaction matrix alone), CONTENT-BASED (use item attributes and descriptions), and HYBRIDS, plus modern deep models. Challenges: SPARSITY (each user touches a tiny fraction of items), the COLD START problem (new users and items have no history), popularity bias, and FILTER BUBBLES. Evaluate with ranking metrics such as precision@k and recall@k on held-out interactions, and ultimately with A/B tests on business outcomes.",
        codeExercise: {
          language: PY,
          code: RATINGS + py`rated = R > 0
popularity = rated.sum(axis=0)
avg = R.sum(axis=0) / popularity
order = np.argsort(-avg)
print([products[i] for i in order[:3]])
print(round(1 - rated.mean(), 2))
`,
          question: "Five customers' ratings of six products (0 means not rated). Which three products have the highest average rating, and what fraction of the matrix is empty?",
          expectedOutput: "['rice', 'beans', 'plantain']\n0.27",
          hint: "Average only over the ratings that exist. Count the zeros: 8 of 30 cells.",
          successMessage: "A popularity list is the baseline every recommender must beat, and the missing ratings (27% even in this tiny example, often over 99% in real shops) are what recommenders try to fill in.",
        },
      },
      {
        id: "a-ml-collaborative-filtering",
        title: "Collaborative filtering",
        explain:
          "COLLABORATIVE FILTERING recommends from patterns in the interaction matrix, with no knowledge of what the items are. USER-BASED: find users whose ratings resemble yours (cosine similarity over co-rated items) and predict your rating of an item as their similarity-weighted average rating of it. ITEM-BASED: items rated alike by the same people are similar (\"people who bought garri also bought beans\"); it is more stable and scales better, as Amazon found. MATRIX FACTORISATION (popularised by the Netflix Prize) learns a short vector for every user and item so that their dot product approximates the rating, capturing hidden tastes such as \"likes swallow foods\". It cannot recommend brand-new items with no interactions: the cold-start problem.",
        codeChallenge: {
          task:
            "Write user_similarity(R, a, b) returning the cosine similarity between users a and b computed ONLY over items both have rated (both non-zero), or 0.0 if they share none. Then write predict_rating(R, user, item, k=2) that finds the k most similar OTHER users who rated the item and returns their similarity-weighted average rating of it, rounded to 2 (0.0 if no such user has positive similarity).",
          starter: "import numpy as np\n\ndef user_similarity(R, a, b):\n    pass\n\ndef predict_rating(R, user, item, k=2):\n    pass\n",
          sample: "Ada (user 0) has not rated garri (item 2); her most similar users, Efe and Bayo, rated it 4, so predict_rating → 4.0",
          tests: [
            {
              check: RATINGS + py`
assert abs(user_similarity(R, 0, 4) - (25 + 20 + 1) / (np.sqrt(25 + 16 + 1) * np.sqrt(25 + 25 + 1))) < 1e-9, "Cosine over co-rated items only (rice, beans, palm oil)."
assert user_similarity(R, 0, 0) > 0.999, "A user is identical to themselves."
assert user_similarity(np.array([[1, 0], [0, 1]], dtype=float), 0, 1) == 0.0, "No co-rated items: similarity 0."
assert predict_rating(R, 0, 2) == 4.0, "Ada's two most similar raters of garri (Efe and Bayo) both gave 4. Got " + repr(predict_rating(R, 0, 2))
p = predict_rating(R, 3, 0)
assert p < 3, "Dele resembles Chi, who rated rice 1: predict a low rating. Got " + repr(p)
assert predict_rating(np.array([[5, 0], [0, 3]], dtype=float), 0, 1) == 0.0, "Nobody similar rated the item: 0.0."`,
            },
          ],
          solution: py`import numpy as np

def user_similarity(R, a, b):
    both = (R[a] > 0) & (R[b] > 0)
    if not both.any():
        return 0.0
    u, v = R[a][both], R[b][both]
    return float(u @ v / (np.linalg.norm(u) * np.linalg.norm(v)))

def predict_rating(R, user, item, k=2):
    sims = []
    for other in range(len(R)):
        if other != user and R[other, item] > 0:
            s = user_similarity(R, user, other)
            if s > 0:
                sims.append((s, R[other, item]))
    sims.sort(reverse=True)
    top = sims[:k]
    if not top:
        return 0.0
    total = sum(s for s, _ in top)
    return round(sum(s * r for s, r in top) / total, 2)
`,
          hint: "both = (R[a] > 0) & (R[b] > 0) selects co-rated items. For the prediction, collect (similarity, rating) for other users who rated the item, sort descending, take k, and compute Σ s·r / Σ s.",
          successMessage: "No product descriptions were needed: Ada's tastes match Efe's and Bayo's, so their garri ratings predict hers. That is the core of collaborative filtering.",
        },
      },
      {
        id: "a-ml-content-based",
        title: "Content-based recommendation",
        explain:
          "CONTENT-BASED recommenders describe ITEMS by their attributes or text (category, brand, price band, description), describe each USER by the items they liked, and recommend items similar to that profile. A common recipe: TF-IDF vectors of product descriptions (Module 18), then cosine similarity to items the user bought. Strengths: it can recommend NEW items immediately (no interactions needed) and explain itself (\"because you bought a 50 kg bag of rice\"). Weaknesses: it needs good item data, and it recommends more of the same, rarely surprising the user. Production systems combine content and collaborative signals in a HYBRID.",
        codeChallenge: {
          task:
            "Write similar_items(descriptions, item, k=2) that builds TfidfVectorizer() vectors for the list of product descriptions, computes the cosine similarity of the given item index to every item (sklearn.metrics.pairwise.cosine_similarity), and returns the indices of the k most similar OTHER items, most similar first.",
          starter: "from sklearn.feature_extraction.text import TfidfVectorizer\nfrom sklearn.metrics.pairwise import cosine_similarity\nimport numpy as np\n\ndef similar_items(descriptions, item, k=2):\n    pass\n",
          sample: "for \"Long grain parboiled rice 50kg bag\", the most similar items are the other rice products",
          tests: [
            {
              check: py`descs = [
    "Long grain parboiled rice 50kg bag",
    "Premium parboiled rice 25kg bag",
    "Brown honey beans 10kg",
    "Red palm oil 5 litres",
    "Local rice stone free 50kg",
    "Vegetable oil 5 litres bottle",
]
assert similar_items(descs, 0) == [1, 4], "The two other rice products. Got " + repr(similar_items(descs, 0))
assert similar_items(descs, 3, k=1) == [5], "Palm oil is most like the other oil. Got " + repr(similar_items(descs, 3, k=1))
assert 0 not in similar_items(descs, 0, k=5), "Never recommend the item itself."
new = descs + ["New arrival: ofada rice 10kg bag"]
assert similar_items(new, 6, k=1)[0] in (0, 1, 4), "A brand-new item with no sales can be recommended from its description alone."`,
            },
          ],
          solution: py`from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

def similar_items(descriptions, item, k=2):
    vectors = TfidfVectorizer().fit_transform(descriptions)
    sims = cosine_similarity(vectors[item], vectors).ravel()
    order = [i for i in np.argsort(-sims, kind="stable") if i != item]
    return [int(i) for i in order[:k]]
`,
          hint: "vectors = TfidfVectorizer().fit_transform(descriptions); sims = cosine_similarity(vectors[item], vectors).ravel(); sort descending, skip the item itself, take k.",
          successMessage: "The new ofada rice had no sales history, yet its description placed it beside the other rice products: content-based recommendation solves cold start for items.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 102 · 23.4 – 23.6
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ml-l102-anomaly-fraud-maintenance",
    moduleId: "ml-m23-applications",
    sectionId: SECTION_ID,
    order: 2,
    covers: ["23.4", "23.5", "23.6"],
    title: "Anomaly Detection, Fraud Detection and Predictive Maintenance",
    subtitle: "Catching the rare events that cost the most",
    estimatedMinutes: 42,
    intro:
      "A stolen card, a failing generator, a hacked account: rare events with large costs. These applications combine the anomaly detection of Module 12, the imbalanced classification of Modules 8 and 11, and features engineered from behaviour over time.",

    atoms: [
      {
        id: "a-ml-anomaly-applications",
        title: "Anomaly detection applications",
        explain:
          "Anomaly detection is applied wherever \"normal\" is common and well recorded but the abnormal is rare, varied or unlabelled: network INTRUSIONS, sensor FAULTS in factories and power plants, unusual SPENDING on an account, manufacturing DEFECTS from camera images, data QUALITY problems in pipelines, and spikes in website traffic. Practical lessons: define normal per CONTEXT (a ₦500,000 transfer is normal for a business account and unusual for a student); use ROBUST statistics (the median and the median absolute deviation, MAD) because the anomalies themselves distort the mean and standard deviation; handle SEASONALITY (Friday-evening spending is normally higher); and tune thresholds against the cost of investigating false alarms.",
        codeExercise: {
          language: PY,
          code: py`import numpy as np

temps = np.array([71, 72, 70, 73, 71, 72, 98, 71, 70, 72, 105, 71])   # generator temperature, °C

z = (temps - temps.mean()) / temps.std()
print(np.flatnonzero(np.abs(z) > 3).tolist())

med = np.median(temps)
mad = np.median(np.abs(temps - med))
robust = 0.6745 * (temps - med) / mad
print(med, mad, np.flatnonzero(np.abs(robust) > 3.5).tolist())
`,
          question: "A generator's temperature log has two overheating events. Which readings does the ordinary z-score (> 3) flag, and which does the robust (median/MAD) score (> 3.5) flag?",
          expectedOutput: "[]\n71.5 0.5 [6, 10]",
          hint: "The two spikes inflate the standard deviation so much that neither exceeds 3. The median and MAD are barely affected by them.",
          successMessage: "The ordinary z-score missed both overheating events because they distorted the very statistics used to judge them. Robust scores caught both.",
        },
      },
      {
        id: "a-ml-fraud-detection",
        title: "Fraud detection",
        explain:
          "FRAUD DETECTION scores transactions, accounts or claims for the likelihood of fraud, under extreme imbalance (often under 0.1% fraud) and ADVERSARIAL pressure (fraudsters adapt). Strong systems combine RULES (known patterns, regulatory requirements), SUPERVISED models trained on confirmed fraud with class weights, ANOMALY scores for new patterns, and increasingly GRAPH features (accounts sharing devices or phone numbers). The most predictive features are BEHAVIOURAL and computed per customer over time windows: VELOCITY (number and value of transfers in the last hour), deviation from the customer's usual amount, new device or location, time of day. Evaluate at the operating point: PRECISION AT K (of the k cases the team can review daily, how many are fraud?) and the money saved.",
        codeChallenge: {
          task:
            "df has columns account, timestamp (datetime) and amount, sorted by time. Write velocity_features(df) returning a NEW DataFrame with two added columns per row, computed over the SAME account's transactions in the 60 minutes up to and including that row: tx_last_hour (count) and amount_last_hour (sum). Use a time-based rolling window (\"60min\") within each account. Then write precision_at_k(scores, labels, k) returning the fraction of fraud (label 1) among the k highest-scored cases.",
          starter: "import numpy as np\nimport pandas as pd\n\ndef velocity_features(df):\n    pass\n\ndef precision_at_k(scores, labels, k):\n    pass\n",
          sample: "four transfers from one account within 20 minutes → tx_last_hour reaches 4",
          tests: [
            {
              check: py`import numpy as np
import pandas as pd
df = pd.DataFrame({
    "account": ["A", "B", "A", "A", "A", "B", "A"],
    "timestamp": pd.to_datetime(["2026-11-09 01:00", "2026-11-09 01:05", "2026-11-09 01:10", "2026-11-09 01:15", "2026-11-09 01:20", "2026-11-09 03:00", "2026-11-09 02:30"]),
    "amount": [50000, 2000, 80000, 120000, 150000, 3000, 1000],
})
out = velocity_features(df)
assert out["tx_last_hour"].tolist() == [1, 1, 2, 3, 4, 1, 1], "Count per account in the last 60 minutes. Got " + repr(out["tx_last_hour"].tolist())
assert out["amount_last_hour"].tolist() == [50000, 2000, 130000, 250000, 400000, 3000, 1000], "Sum per account in the last 60 minutes. Got " + repr(out["amount_last_hour"].tolist())
assert list(out["account"]) == list(df["account"]), "Keep the original row order."
assert precision_at_k([0.9, 0.1, 0.8, 0.7, 0.2], [1, 0, 0, 1, 0], 3) == 2 / 3, "2 of the top 3 scores are fraud."
assert precision_at_k([0.9, 0.1], [1, 0], 1) == 1.0, "The single top case is fraud."`,
            },
          ],
          solution: py`import numpy as np
import pandas as pd

def velocity_features(df):
    out = df.copy()
    by_account = df.set_index("timestamp").groupby("account")["amount"]
    counts = by_account.transform(lambda s: s.rolling("60min").count())
    sums = by_account.transform(lambda s: s.rolling("60min").sum())
    out["tx_last_hour"] = counts.to_numpy().astype(int)
    out["amount_last_hour"] = sums.to_numpy()
    return out

def precision_at_k(scores, labels, k):
    order = np.argsort(-np.asarray(scores), kind="stable")[:k]
    return float(np.asarray(labels)[order].mean())
`,
          hint: "Put the timestamps in the index, then group: df.set_index(\"timestamp\").groupby(\"account\")[\"amount\"].transform(lambda s: s.rolling(\"60min\").count()) returns one value per original row, in the original order (take .to_numpy() to assign it). Do the same with .sum().",
          successMessage: "Four transfers totalling ₦400,000 in 20 minutes at 1 a.m. is a classic account-takeover pattern, and velocity features make it visible to any model.",
        },
      },
      {
        id: "a-ml-predictive-maintenance",
        title: "Predictive maintenance",
        explain:
          "PREDICTIVE MAINTENANCE uses sensor data (temperature, vibration, pressure, power draw, running hours) to predict equipment FAILURE before it happens, so repairs are scheduled cheaply instead of after a costly breakdown: generators, transformers, telecom masts, vehicles, factory machines. Framing choices: CLASSIFICATION (will this machine fail within the next N days?), REGRESSION of REMAINING USEFUL LIFE, or anomaly detection when failures are too rare to learn from. Labels are built by looking FORWARD from each reading to the next failure, while features must look only BACKWARD (rolling means, trends, time since last service), or the model leaks the future. Split by machine or by time, never by random rows.",
        codeChallenge: {
          task:
            "df holds daily readings for ONE machine with columns day (0, 1, 2 …) and vibration, and failure_days is a list of days on which it failed. Write label_failures(df, failure_days, horizon) returning a NEW DataFrame with a column fails_soon = 1 if a failure occurs within the next `horizon` days AFTER the row's day (day < failure_day ≤ day + horizon), else 0. Then write add_trend(df, window) adding vib_mean (the rolling mean of vibration over the last `window` rows, including the current one) and vib_change (vibration minus the value `window` rows earlier), both looking backwards only.",
          starter: "import pandas as pd\n\ndef label_failures(df, failure_days, horizon):\n    pass\n\ndef add_trend(df, window):\n    pass\n",
          sample: "with a failure on day 8 and horizon 3, days 5, 6 and 7 are labelled 1",
          tests: [
            {
              check: py`import pandas as pd
df = pd.DataFrame({"day": range(10), "vibration": [1.0, 1.1, 1.0, 1.2, 1.4, 1.9, 2.5, 3.2, 4.0, 1.0]})
lab = label_failures(df, [8], 3)
assert lab["fails_soon"].tolist() == [0, 0, 0, 0, 0, 1, 1, 1, 0, 0], "Days 5–7 precede the failure on day 8 within 3 days. Got " + repr(lab["fails_soon"].tolist())
assert label_failures(df, [3, 9], 1)["fails_soon"].tolist() == [0, 0, 1, 0, 0, 0, 0, 0, 1, 0], "Two failures."
t = add_trend(df, 3)
assert pd.isna(t["vib_mean"].iloc[1]) and abs(t["vib_mean"].iloc[7] - (1.9 + 2.5 + 3.2) / 3) < 1e-9, "Rolling mean of the last 3 readings, backwards only."
assert pd.isna(t["vib_change"].iloc[2]) and abs(t["vib_change"].iloc[7] - (3.2 - 1.4)) < 1e-9, "Change versus 3 rows earlier."
assert "fails_soon" not in df.columns and "vib_mean" not in df.columns, "Return new DataFrames."`,
            },
          ],
          solution: py`import pandas as pd

def label_failures(df, failure_days, horizon):
    out = df.copy()
    out["fails_soon"] = [
        int(any(day < f <= day + horizon for f in failure_days)) for day in out["day"]
    ]
    return out

def add_trend(df, window):
    out = df.copy()
    out["vib_mean"] = out["vibration"].rolling(window).mean()
    out["vib_change"] = out["vibration"] - out["vibration"].shift(window)
    return out
`,
          hint: "The label looks forward: any failure f with day < f <= day + horizon. The features look backward: rolling(window).mean() and vibration - vibration.shift(window).",
          successMessage: "Vibration climbing for three days before the failure is exactly the signal a model learns, with labels from the future and features only from the past.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 103 · 23.7 – 23.9
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ml-l103-finance-sports-search",
    moduleId: "ml-m23-applications",
    sectionId: SECTION_ID,
    order: 3,
    covers: ["23.7", "23.8", "23.9"],
    title: "Financial Prediction, Sports Analytics and Intelligent Search",
    subtitle: "Three domains, three lessons in honest modelling",
    estimatedMinutes: 42,
    intro:
      "Markets punish overconfidence, sport rewards good ratings, and search is ranking at scale. Each domain teaches a different discipline: honest backtesting, probabilistic ratings, and relevance.",

    atoms: [
      {
        id: "a-ml-financial-prediction",
        title: "Financial prediction fundamentals",
        explain:
          "ML in finance is strongest where data is rich and outcomes repeat: CREDIT SCORING, FRAUD, customer lifetime value, cash-demand forecasting for ATMs and branches, and risk models. Predicting asset PRICES is far harder: markets are noisy, competitive and NON-STATIONARY, and any easily found pattern tends to disappear once traders exploit it. Model RETURNS (percentage changes) rather than prices, compare with a RANDOM-WALK baseline (tomorrow's change is unpredictable, best guess zero or the average), and BACKTEST honestly: walk-forward splits, features computed only from data available at the time, transaction costs included, and no repeated tuning on the test period (which overfits to history). A strategy that looks brilliant in a careless backtest usually fails live.",
        codeExercise: {
          language: PY,
          code: py`import numpy as np

rng = np.random.default_rng(23)
prices = 100 * np.cumprod(1 + rng.normal(0.0003, 0.01, 500))    # a random walk: no real signal
returns = np.diff(prices) / prices[:-1]

today, tomorrow = returns[:-1], returns[1:]
print(round(np.corrcoef(today, tomorrow)[0, 1], 3))

best_rule, best_score = None, -1
for threshold in np.linspace(-0.02, 0.02, 41):              # "tune" a rule on the SAME data
    signal = today > threshold
    score = (np.sign(tomorrow) == np.where(signal, 1, -1)).mean()
    if score > best_score:
        best_rule, best_score = round(threshold, 3), score
print(best_rule, round(best_score, 3))
`,
          question: "On a pure random walk, how correlated is today's return with tomorrow's? And what \"accuracy\" does a trading rule reach when its threshold is tuned on the same data it is scored on?",
          expectedOutput: "0.086\n0.0 0.552",
          hint: "A random walk has no memory, so the correlation is near zero. Searching 41 thresholds on the same data will always find one that looks better than 50%.",
          successMessage: "55% \"accuracy\" on data with no signal at all: pure overfitting from tuning on the test period. That is why honest walk-forward backtests matter in finance.",
        },
      },
      {
        id: "a-ml-sports-analytics",
        title: "Sports analytics",
        explain:
          "SPORTS ANALYTICS uses data to evaluate players, plan tactics, prevent injuries and predict results. Football examples: EXPECTED GOALS (xG), a classifier giving the probability that a shot is scored from its distance, angle and situation; player tracking and passing networks; workload monitoring to reduce injuries; and scouting players from data. Match prediction usually starts from RATINGS: the ELO system (from chess, used widely in football rankings) gives each team a rating; the expected score of A against B is E = 1 / (1 + 10^((R_B − R_A)/400)); after the match each rating moves by K × (actual − expected), where actual is 1 for a win, 0.5 for a draw, 0 for a loss. Upsets move ratings more, and good ratings are well-CALIBRATED probabilities.",
        codeChallenge: {
          task:
            "Write expected_score(r_a, r_b) returning 1 / (1 + 10 ** ((r_b − r_a) / 400)). Write update(r_a, r_b, result, k=20) returning the new ratings (new_a, new_b), each rounded to 1, where result is 1 (A wins), 0.5 (draw) or 0 (B wins): A gains k × (result − expected_A) and B gains k × ((1 − result) − expected_B). Then write run_season(ratings, matches, k=20) that applies update to a dictionary of ratings for each (home, away, result) match in order and returns the dictionary.",
          starter: "def expected_score(r_a, r_b):\n    pass\n\ndef update(r_a, r_b, result, k=20):\n    pass\n\ndef run_season(ratings, matches, k=20):\n    pass\n",
          sample: "equal 1500-rated teams: expected 0.5; the winner moves to 1510.0 and the loser to 1490.0",
          tests: [
            {
              check: py`assert expected_score(1500, 1500) == 0.5 and abs(expected_score(1700, 1500) - 0.7597) < 1e-4, "E = 1 / (1 + 10^((Rb − Ra)/400))."
assert update(1500, 1500, 1) == (1510.0, 1490.0), "Equal teams, A wins: ±10. Got " + repr(update(1500, 1500, 1))
fav = update(1700, 1500, 1)
upset = update(1700, 1500, 0)
assert fav == (1704.8, 1495.2) and upset == (1684.8, 1515.2), "An upset moves ratings far more than an expected win. Got " + repr((fav, upset))
assert update(1500, 1500, 0.5) == (1500.0, 1500.0), "A draw between equals changes nothing."
r = run_season({"Enyimba": 1500, "Rangers": 1500, "Pillars": 1500}, [("Enyimba", "Rangers", 1), ("Pillars", "Enyimba", 0.5), ("Rangers", "Pillars", 0)])
assert r == {"Enyimba": 1509.7, "Rangers": 1480.3, "Pillars": 1510.0}, "Apply the matches in order. Got " + repr(r)`,
            },
          ],
          solution: py`def expected_score(r_a, r_b):
    return 1 / (1 + 10 ** ((r_b - r_a) / 400))

def update(r_a, r_b, result, k=20):
    e_a = expected_score(r_a, r_b)
    e_b = expected_score(r_b, r_a)
    return round(r_a + k * (result - e_a), 1), round(r_b + k * ((1 - result) - e_b), 1)

def run_season(ratings, matches, k=20):
    for home, away, result in matches:
        ratings[home], ratings[away] = update(ratings[home], ratings[away], result, k)
    return ratings
`,
          hint: "update computes both expected scores, then moves each rating by k × (actual − expected). run_season loops over the matches and writes both new ratings back into the dictionary.",
          successMessage: "An upset cost the favourite 15 points while an expected win earned only 5: Elo ratings learn from surprise. Converted to probabilities, they are a strong baseline for match prediction.",
        },
      },
      {
        id: "a-ml-intelligent-search",
        title: "Intelligent search systems",
        explain:
          "SEARCH ranks documents (products, articles, CVs, help pages) by RELEVANCE to a query. Classic LEXICAL search matches words: TF-IDF and its refinement BM25, served by engines such as Elasticsearch, fast and precise for exact terms but blind to synonyms (\"cheap phone\" versus \"affordable smartphone\"). SEMANTIC search embeds queries and documents as vectors (Module 18) and ranks by cosine similarity, finding meaning rather than words, served from VECTOR DATABASES. HYBRID search combines both, and LEARNING TO RANK trains a model on clicks and purchases to order the results. Evaluate with ranking metrics such as precision@k, mean reciprocal rank and NDCG on queries with judged results. Semantic search also powers retrieval for LLMs (Lesson 104).",
        codeChallenge: {
          task:
            "Write build_index(docs) that fits a TfidfVectorizer(stop_words=\"english\") on the documents and returns (vectorizer, matrix). Write search(index, query, k=3) that returns the indices of the k documents with the highest cosine similarity to the query (most relevant first), leaving out documents with similarity 0. Then write reciprocal_rank(results, relevant) returning 1 / (position of the first relevant result, counting from 1), or 0.0 if none is relevant.",
          starter: "import numpy as np\nfrom sklearn.feature_extraction.text import TfidfVectorizer\nfrom sklearn.metrics.pairwise import cosine_similarity\n\ndef build_index(docs):\n    pass\n\ndef search(index, query, k=3):\n    pass\n\ndef reciprocal_rank(results, relevant):\n    pass\n",
          sample: "search(index, \"how do I reset my card PIN\") → the help article about PIN reset first",
          tests: [
            {
              check: py`docs = [
    "How to reset your card PIN at an ATM or in the app",
    "Opening a savings account online in minutes",
    "Transfer limits and fees for mobile transfers",
    "Report a lost or stolen card and block it immediately",
    "Changing your app password and security questions",
]
index = build_index(docs)
res = search(index, "how do I reset my card PIN")
assert res[0] == 0, "The PIN article ranks first. Got " + repr(res)
assert search(index, "stolen card", k=1) == [3], "Got " + repr(search(index, "stolen card", k=1))
assert search(index, "cryptocurrency staking") == [], "No overlapping words: nothing is returned."
assert reciprocal_rank([2, 0, 4], {0}) == 0.5 and reciprocal_rank([0], {0}) == 1.0 and reciprocal_rank([1, 2], {0}) == 0.0, "Reciprocal rank of the first relevant result."`,
            },
          ],
          solution: py`import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

def build_index(docs):
    vectorizer = TfidfVectorizer(stop_words="english")
    return vectorizer, vectorizer.fit_transform(docs)

def search(index, query, k=3):
    vectorizer, matrix = index
    sims = cosine_similarity(vectorizer.transform([query]), matrix).ravel()
    order = np.argsort(-sims, kind="stable")
    return [int(i) for i in order if sims[i] > 0][:k]

def reciprocal_rank(results, relevant):
    for position, doc in enumerate(results, start=1):
        if doc in relevant:
            return 1 / position
    return 0.0
`,
          hint: "Transform the query with the SAME fitted vectoriser, compute cosine similarities to the matrix, sort descending, keep positive similarities, take k.",
          successMessage: "A working help-centre search engine in a dozen lines. Notice what it cannot do: \"forgot my code\" shares no words with the PIN article. Semantic embeddings fix exactly that.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 104 · 23.10
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ml-l104-large-language-models",
    moduleId: "ml-m23-applications",
    sectionId: SECTION_ID,
    order: 4,
    covers: ["23.10"],
    title: "Large Language Models and Machine Learning",
    subtitle: "How LLMs are built from everything in this course, and how to use them well",
    estimatedMinutes: 42,
    intro:
      "Large language models are machine learning at enormous scale: Transformers (Module 18) trained by gradient descent (Module 3) to predict the next token (Module 1's bigram generator, grown up). This lesson connects them to the rest of the course and shows how applications use them.",

    atoms: [
      {
        id: "a-ml-llms",
        title: "Introduction to large language models and their relationship to machine learning",
        explain:
          "A LARGE LANGUAGE MODEL (GPT, Claude, Gemini, Llama) is a decoder-only Transformer with billions of parameters, PRETRAINED on trillions of tokens of text with one self-supervised objective: predict the next token (the labels come free from the text itself). Then it is adapted: SUPERVISED FINE-TUNING on example conversations, and REINFORCEMENT LEARNING FROM HUMAN FEEDBACK (Module 1) or similar methods to make it helpful, honest and harmless. Generation repeatedly SAMPLES the next token from the predicted distribution: TEMPERATURE rescales the logits before softmax (low temperature: focused and repetitive; high: varied and riskier). LLMs inherit every ML limitation in this course: they can be confidently wrong (\"hallucination\"), reflect biases in their data, have a training CUT-OFF date, and face new attacks such as PROMPT INJECTION.",
        codeExercise: {
          language: PY,
          code: py`import numpy as np

tokens = ["jollof", "rice", "fried", "beans", "pizza"]
logits = np.array([3.0, 2.0, 1.5, 0.5, -1.0])     # the model's scores for the next token

def softmax_t(z, t):
    e = np.exp((z - z.max()) / t)
    return e / e.sum()

for t in [0.5, 1.0, 2.0]:
    p = softmax_t(logits, t)
    print(t, tokens[int(p.argmax())], round(p.max(), 3), round(float(-(p * np.log(p)).sum()), 2))
`,
          question: "The model's scores for the next token after \"My favourite food is\". At temperatures 0.5, 1.0 and 2.0, what is the most likely token, its probability, and the entropy of the distribution?",
          expectedOutput: "0.5 jollof 0.839 0.56\n1.0 jollof 0.591 1.11\n2.0 jollof 0.4 1.43",
          hint: "Dividing the scores by a small temperature exaggerates their differences; a large temperature flattens them. Entropy measures how spread out the choice is.",
          successMessage: "Same model, same scores: temperature only reshapes the distribution. Low temperature suits factual answers and code; higher temperature suits brainstorming and creative writing.",
        },
      },
      {
        id: "a-ml-llm-applications",
        title: "Building applications with LLMs: retrieval-augmented generation",
        explain:
          "Applications reach LLMs through APIs (Anthropic, OpenAI, Google) or run open models (Llama, Mistral) themselves. PROMPT ENGINEERING structures instructions, context and examples. Because an LLM only knows its training data, applications give it the right facts at question time with RETRIEVAL-AUGMENTED GENERATION (RAG): split documents into CHUNKS, embed them (Module 18), retrieve the chunks most similar to the user's question (Lesson 103's search), and put them in the prompt with an instruction to answer from them and cite them. RAG reduces hallucination, keeps answers current, and works with private data. Evaluate LLM applications like any ML system: test sets of questions with expected answers, measured accuracy and groundedness, monitoring, and guardrails against prompt injection and data leakage.",
        example:
          "import anthropic                                 # on your own machine, with an API key\n\nclient = anthropic.Anthropic()\nmessage = client.messages.create(\n    model=\"claude-sonnet-5-5\",\n    max_tokens=400,\n    system=\"Answer only from the provided context. If the answer is not there, say so.\",\n    messages=[{\"role\": \"user\", \"content\": prompt}],   # prompt built by build_prompt below\n)\nprint(message.content[0].text)",
        codeChallenge: {
          task:
            "Write the retrieval half of a RAG system. chunk(text, size) splits a text into chunks of at most `size` words (in order). retrieve(chunks, question, k=2) ranks chunks by cosine similarity of TfidfVectorizer vectors (fit on the chunks) to the question and returns the top k chunks, most similar first. build_prompt(question, chunks) returns a string: the line \"Answer using only the context below. If the answer is not in the context, say you do not know.\", a blank line, each chunk on its own line prefixed with \"[1] \", \"[2] \" …, a blank line, and finally \"Question: <question>\".",
          starter: "from sklearn.feature_extraction.text import TfidfVectorizer\nfrom sklearn.metrics.pairwise import cosine_similarity\nimport numpy as np\n\ndef chunk(text, size):\n    pass\n\ndef retrieve(chunks, question, k=2):\n    pass\n\ndef build_prompt(question, chunks):\n    pass\n",
          sample: "a question about transfer limits retrieves the chunk that mentions transfer limits",
          tests: [
            {
              check: py`policy = ("Customers can transfer up to 200,000 naira per day from the mobile app. "
          "Transfers above this limit need a visit to a branch with valid ID. "
          "Card PINs can be reset at any ATM using the reset option. "
          "Savings accounts earn interest monthly and have no maintenance fee. "
          "Lost cards should be blocked immediately by calling the help line.")
chunks = chunk(policy, 12)
assert all(len(c.split()) <= 12 for c in chunks) and " ".join(chunks) == policy, "Chunks of at most 12 words that rejoin to the original text."
top = retrieve(chunks, "What is the daily transfer limit on the mobile app?", k=1)
assert len(top) == 1 and "200,000" in top[0], "Retrieve the chunk about the transfer limit. Got " + repr(top)
prompt = build_prompt("How do I reset my PIN?", ["Card PINs can be reset at any ATM.", "Lost cards should be blocked."])
assert prompt == "Answer using only the context below. If the answer is not in the context, say you do not know.\n\n[1] Card PINs can be reset at any ATM.\n[2] Lost cards should be blocked.\n\nQuestion: How do I reset my PIN?", "Prompt layout. Got " + repr(prompt)`,
            },
          ],
          solution: py`from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

def chunk(text, size):
    words = text.split()
    return [" ".join(words[i:i + size]) for i in range(0, len(words), size)]

def retrieve(chunks, question, k=2):
    vectorizer = TfidfVectorizer()
    matrix = vectorizer.fit_transform(chunks)
    sims = cosine_similarity(vectorizer.transform([question]), matrix).ravel()
    order = np.argsort(-sims, kind="stable")[:k]
    return [chunks[i] for i in order]

def build_prompt(question, chunks):
    context = "\n".join(f"[{i}] {c}" for i, c in enumerate(chunks, start=1))
    instruction = "Answer using only the context below. If the answer is not in the context, say you do not know."
    return f"{instruction}\n\n{context}\n\nQuestion: {question}"
`,
          hint: "chunk: split into words and join slices of size words. retrieve: fit TfidfVectorizer on the chunks, transform the question, rank by cosine similarity. build_prompt: join numbered chunks with newlines between the instruction and the question.",
          successMessage: "Chunk, retrieve, ground: the retrieval half of RAG. Send this prompt to an LLM API and the model answers from your bank's policy instead of from memory, and can say when the policy does not cover the question.",
        },
      },
    ],

    task: {
      title: "Module 23 project: an applied ML system",
      intro:
        "Choose ONE application and build it end to end, using public data or data you generate realistically, with an honest evaluation against a baseline.",
      prompts: [
        "Recommender: build popularity, item-based collaborative filtering and content-based recommenders for a retail dataset; compare precision@5 on held-out purchases.",
        "Fraud detector: engineer velocity and deviation features from a transactions dataset, train a class-weighted model, and report precision@k for a realistic daily review capacity.",
        "Semantic search: index a set of FAQs or product descriptions with TF-IDF and (on your machine) sentence embeddings; compare mean reciprocal rank on 20 test queries.",
        "Or a RAG assistant: chunk and retrieve from a policy document, call an LLM API with grounded prompts, and test 20 questions for correct and \"I do not know\" answers.",
        "For whichever you choose: state the baseline, the metric, the evaluation split and the failure cases, in a short report.",
      ],
      closing: "You have the full toolkit. Module 24 is the capstone: one problem of your choosing, solved, deployed, documented and presented end to end.",
    },

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
