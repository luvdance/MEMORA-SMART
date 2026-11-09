/**
 * MACHINE LEARNING AND AI · MODULE 17 · RECURRENT NEURAL NETWORKS AND SEQUENCE LEARNING
 *
 * Curriculum 17.1 – 17.8. Sequential and time-series data; recurrent
 * networks; LSTMs and GRUs; sequence prediction; time-series forecasting;
 * and the limitations of recurrence that led to attention. The learner
 * builds sliding windows, an RNN forward pass and a GRU cell in NumPy,
 * forecasts a seasonal sales series with lag features against honest
 * baselines, and measures the vanishing gradient directly.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

export const SECTION_ID = "ml-s17-rnn";

const PY = "python";
const py = String.raw;

// Five years of monthly sales with trend, December peaks and noise.
const SALES = py`import numpy as np
import pandas as pd
_rng = np.random.default_rng(17)
_months = pd.date_range("2021-01-01", periods=60, freq="MS")
_season = np.array([0, -4, 2, 3, 1, 0, -2, -1, 2, 4, 8, 20])
sales = pd.Series(100 + 1.5 * np.arange(60) + np.tile(_season, 5) + _rng.normal(0, 3, 60), index=_months).round(1)
`;

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 76 · 17.1 – 17.2
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ml-l76-sequences-time-series",
    moduleId: "ml-m17-rnn",
    sectionId: SECTION_ID,
    order: 1,
    covers: ["17.1", "17.2"],
    title: "Sequential Data and Time Series",
    subtitle: "When order matters, and how to turn a sequence into training examples",
    estimatedMinutes: 36,
    intro:
      "Shuffle the rows of a customer table and nothing is lost. Shuffle the words of a sentence or the months of a sales history and the meaning is gone. Sequential data needs models, and preparation, that respect order.",

    atoms: [
      {
        id: "a-ml-sequential-data",
        title: "Introduction to sequential data",
        explain:
          "SEQUENTIAL data is ordered, and each element depends on what came before: text (words), speech (audio samples), time series (daily sales, sensor readings, exchange rates), DNA, user click streams, video frames. Sequence tasks come in several shapes: MANY-TO-ONE (a review's words → its sentiment), ONE-TO-MANY (an image → a caption), MANY-TO-MANY (translation; tagging each word), and FORECASTING (the past values → the next ones). To train a standard model on a sequence, slice it into SLIDING WINDOWS: each window of the last n values becomes an input X, and the value that follows it becomes the target y.",
        codeChallenge: {
          task:
            "Write make_windows(series, window, horizon=1) that turns a 1-D sequence into supervised examples: X has one row per starting position, holding `window` consecutive values, and y holds the value `horizon` steps after each window's last value. Return NumPy arrays (X, y). Then write split_by_time(X, y, test_size) that returns X_train, X_test, y_train, y_test with the LAST test_size examples as the test set (no shuffling).",
          starter: "import numpy as np\n\ndef make_windows(series, window, horizon=1):\n    pass\n\ndef split_by_time(X, y, test_size):\n    pass\n",
          sample: "make_windows([1, 2, 3, 4, 5, 6], 3) → X [[1, 2, 3], [2, 3, 4], [3, 4, 5]], y [4, 5, 6]",
          tests: [
            {
              check: py`import numpy as np
X, y = make_windows([1, 2, 3, 4, 5, 6], 3)
assert X.tolist() == [[1, 2, 3], [2, 3, 4], [3, 4, 5]] and y.tolist() == [4, 5, 6], "Windows of 3, each followed by its target. Got " + repr((X.tolist(), y.tolist()))
X2, y2 = make_windows(list(range(10)), 4, horizon=3)
assert X2[0].tolist() == [0, 1, 2, 3] and y2[0] == 6 and len(X2) == 4, "horizon=3: predict the value 3 steps after the window. Got " + repr((X2.tolist(), y2.tolist()))
Xtr, Xte, ytr, yte = split_by_time(X, y, 1)
assert ytr.tolist() == [4, 5] and yte.tolist() == [6], "The test set is the LAST examples, in time order."
assert Xte.tolist() == [[3, 4, 5]], "Test features are the last window."`,
            },
          ],
          solution: py`import numpy as np

def make_windows(series, window, horizon=1):
    s = np.asarray(series)
    n = len(s) - window - horizon + 1
    X = np.array([s[i:i + window] for i in range(n)])
    y = np.array([s[i + window + horizon - 1] for i in range(n)])
    return X, y

def split_by_time(X, y, test_size):
    return X[:-test_size], X[-test_size:], y[:-test_size], y[-test_size:]
`,
          hint: "There are len(s) − window − horizon + 1 examples. Window i is s[i:i + window]; its target is s[i + window + horizon − 1]. The time split is a slice, never a shuffle.",
          successMessage: "Any sequence can now be fed to any supervised model. Recurrent networks consume the windows step by step instead of all at once.",
        },
      },
      {
        id: "a-ml-time-series",
        title: "Understanding time-series data",
        explain:
          "A TIME SERIES is a sequence of measurements at regular intervals. Decompose it into a TREND (long-run direction), SEASONALITY (a pattern repeating with a fixed period: weekly, yearly; Nigerian retail peaks in December and around festive seasons), CYCLES (longer, irregular swings such as economic cycles) and NOISE. AUTOCORRELATION, the correlation of the series with itself shifted by k steps (lag k), reveals structure: a strong lag-12 autocorrelation in monthly data signals yearly seasonality. Many models assume STATIONARITY (constant mean and variance over time); DIFFERENCING (subtracting the previous value, or the value one season ago) removes trend and seasonality.",
        codeExercise: {
          language: PY,
          code: SALES + py`print(len(sales), sales.index[0].strftime("%Y-%m"), sales.index[-1].strftime("%Y-%m"))
yearly = sales.groupby(sales.index.year).mean().round(1)
print(yearly.tolist())
by_month = sales.groupby(sales.index.month).mean()
print(int(by_month.idxmax()), int(by_month.idxmin()))
print(round(sales.autocorr(lag=12), 2), round(sales.diff(12).mean(), 1))
`,
          question: "Five years of monthly sales. What are the yearly averages, the best and worst calendar months, the lag-12 autocorrelation, and the average seasonal difference (each month minus the same month a year earlier)?",
          expectedOutput: "60 2021-01 2025-12\n[109.6, 129.7, 146.1, 163.6, 182.2]\n12 2\n0.98 18.2",
          hint: "The trend adds 1.5 per month, so about 18 per year. The seasonal pattern peaks in December (+20) and dips in February (−4). Subtracting the same month last year cancels the season and leaves the yearly growth.",
          successMessage: "A rising trend, a December peak, a lag-12 autocorrelation of 0.98, and a seasonal difference that cancels the season and leaves the trend: about 18 more each year.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 77 · 17.3 – 17.5
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ml-l77-rnn-lstm-gru",
    moduleId: "ml-m17-rnn",
    sectionId: SECTION_ID,
    order: 2,
    covers: ["17.3", "17.4", "17.5"],
    title: "RNNs, LSTMs and GRUs",
    subtitle: "Networks with memory, and the gates that make the memory last",
    estimatedMinutes: 44,
    intro:
      "A recurrent network reads a sequence one step at a time, carrying a hidden state that summarises everything so far. LSTMs and GRUs add gates that decide what to remember and what to forget.",

    atoms: [
      {
        id: "a-ml-rnn",
        title: "Recurrent Neural Networks (RNN)",
        explain:
          "A RECURRENT NEURAL NETWORK processes a sequence x₁, x₂, … one step at a time, keeping a HIDDEN STATE h that acts as memory: hₜ = tanh(xₜWₓ + hₜ₋₁Wₕ + b). The SAME weights are used at every step (weight sharing through time, as convolution shares through space), so one RNN handles sequences of any length. The final state h_T summarises the whole sequence (for many-to-one tasks), or every hₜ feeds an output (many-to-many). Training unrolls the loop and applies backpropagation through the unrolled steps: BACKPROPAGATION THROUGH TIME (BPTT).",
        example:
          "import torch.nn as nn\n\nrnn = nn.RNN(input_size=1, hidden_size=16, batch_first=True)\nhead = nn.Linear(16, 1)\nx = torch.randn(32, 12, 1)          # 32 sequences, 12 months, 1 value each\noutputs, h_last = rnn(x)            # outputs: (32, 12, 16); h_last: (1, 32, 16)\nforecast = head(h_last[-1])         # (32, 1)",
        codeChallenge: {
          task:
            "Write rnn_forward(xs, Wx, Wh, b, h0=None) for one sequence: xs has shape (T, n_in), Wx (n_in, n_hidden), Wh (n_hidden, n_hidden), b (n_hidden,). Starting from h0 (zeros if None), loop through time with h = tanh(x_t @ Wx + h @ Wh + b), and return (states, h_last) where states has shape (T, n_hidden) holding every hidden state.",
          starter: "import numpy as np\n\ndef rnn_forward(xs, Wx, Wh, b, h0=None):\n    pass\n",
          sample: "12 monthly values with 4 hidden units → states of shape (12, 4)",
          tests: [
            {
              check: py`import numpy as np
rng = np.random.default_rng(0)
T, n_in, n_h = 12, 1, 4
xs = rng.normal(size=(T, n_in))
Wx, Wh, b = rng.normal(size=(n_in, n_h)) * 0.5, rng.normal(size=(n_h, n_h)) * 0.5, np.zeros(n_h)
states, h = rnn_forward(xs, Wx, Wh, b)
assert states.shape == (12, 4) and np.allclose(states[-1], h), "One state per step; the last equals h_last."
h_ref = np.zeros(n_h)
for t in range(T):
    h_ref = np.tanh(xs[t] @ Wx + h_ref @ Wh + b)
    assert np.allclose(states[t], h_ref), "State " + str(t) + " is wrong: h = tanh(x_t Wx + h Wh + b)."
s2, _ = rnn_forward(xs, Wx, Wh, b, h0=np.ones(n_h))
assert not np.allclose(s2[0], states[0]), "Use h0 when it is given."
s_short, _ = rnn_forward(xs[:5], Wx, Wh, b)
assert np.allclose(s_short, states[:5]), "The same weights handle any sequence length."`,
            },
          ],
          solution: py`import numpy as np

def rnn_forward(xs, Wx, Wh, b, h0=None):
    h = np.zeros(Wh.shape[0]) if h0 is None else h0
    states = []
    for x in xs:
        h = np.tanh(x @ Wx + h @ Wh + b)
        states.append(h)
    return np.array(states), h
`,
          hint: "h starts as zeros of size n_hidden. For each x in xs: h = np.tanh(x @ Wx + h @ Wh + b); append it. Return np.array(states) and h.",
          successMessage: "One small loop, the same weights at every step, and a hidden state carrying the past forward: that is a recurrent network.",
        },
      },
      {
        id: "a-ml-lstm",
        title: "Long Short-Term Memory (LSTM)",
        explain:
          "Plain RNNs forget quickly: gradients through many tanh steps vanish (Lesson 78), so they struggle to link events far apart. The LSTM (Hochreiter and Schmidhuber, 1997) adds a separate CELL STATE c, a conveyor belt of memory updated mostly by ADDITION, and three GATES, each a sigmoid layer outputting values between 0 and 1 that act as soft switches: the FORGET gate f decides what to erase from c, the INPUT gate i what new information to write (a candidate g from a tanh layer), and the OUTPUT gate o what part of the cell to expose as h. c_t = f ⊙ c_{t−1} + i ⊙ g; h_t = o ⊙ tanh(c_t). Because c changes by addition, gradients flow across many steps. LSTMs powered speech recognition and translation through the 2010s.",
        codeExercise: {
          language: PY,
          code: py`import numpy as np

sig = lambda z: 1 / (1 + np.exp(-z))
c_prev = np.array([2.0, -1.0])            # the cell's memory
f = sig(np.array([4.0, -4.0]))            # forget gate: keep unit 1, erase unit 2
i = sig(np.array([-4.0, 4.0]))            # input gate: write only to unit 2
g = np.tanh(np.array([0.5, 1.5]))         # candidate values
o = sig(np.array([0.0, 4.0]))             # output gate

c = f * c_prev + i * g
h = o * np.tanh(c)
print(np.round(f, 3), np.round(i, 3))
print(np.round(c, 3))
print(np.round(h, 3))
`,
          question: "One LSTM step with hand-set gates: unit 1 keeps its memory, unit 2 forgets and writes something new. What are the gate values, the new cell state and the output?",
          expectedOutput: "[0.982 0.018] [0.018 0.982]\n[1.972 0.871]\n[0.481 0.689]",
          hint: "σ(4) ≈ 0.982 and σ(−4) ≈ 0.018. Unit 1: 0.982 × 2 + 0.018 × tanh(0.5). Unit 2: 0.018 × (−1) + 0.982 × tanh(1.5).",
          successMessage: "The forget gate kept unit 1's memory (2 → 1.97) and erased unit 2's (−1 → replaced by new content). Learned gates make these choices for every unit at every step.",
        },
      },
      {
        id: "a-ml-gru",
        title: "Gated Recurrent Units (GRU)",
        explain:
          "The GRU (Cho and colleagues, 2014) simplifies the LSTM: no separate cell state, two gates. The UPDATE gate z decides how much of the old state to keep versus replace; the RESET gate r decides how much of the old state to use when proposing the new candidate. z = σ(xWz + hUz + bz); r = σ(xWr + hUr + br); h̃ = tanh(xWh + (r ⊙ h)Uh + bh); h_new = (1 − z) ⊙ h + z ⊙ h̃. With three weight sets instead of the LSTM's four, a GRU has about 25% fewer parameters, trains faster, and performs comparably on many tasks. In practice try both, or move on to Transformers for long sequences.",
        codeChallenge: {
          task:
            "Write gru_step(x, h, p) for one time step, where p is a dictionary with Wz, Uz, bz, Wr, Ur, br, Wh, Uh, bh: compute z = σ(x Wz + h Uz + bz), r = σ(x Wr + h Ur + br), h̃ = tanh(x Wh + (r ⊙ h) Uh + bh), and return (1 − z) ⊙ h + z ⊙ h̃. Then write recurrent_params(n_in, n_hidden, gates) returning gates × (n_in × n_hidden + n_hidden × n_hidden + n_hidden), the parameter count of a recurrent layer with that many weight sets (1 for a simple RNN, 3 for a GRU, 4 for an LSTM).",
          starter: "import numpy as np\n\ndef sigmoid(z):\n    return 1 / (1 + np.exp(-z))\n\ndef gru_step(x, h, p):\n    pass\n\ndef recurrent_params(n_in, n_hidden, gates):\n    pass\n",
          sample: "recurrent_params(10, 32, 4) → 5504 (LSTM); recurrent_params(10, 32, 3) → 4128 (GRU)",
          tests: [
            {
              check: py`import numpy as np
rng = np.random.default_rng(3)
n_in, n_h = 3, 4
p = {}
for g in "zrh":
    p["W" + g] = rng.normal(size=(n_in, n_h))
    p["U" + g] = rng.normal(size=(n_h, n_h))
    p["b" + g] = rng.normal(size=n_h)
x, h = rng.normal(size=n_in), rng.normal(size=n_h)
s = lambda v: 1 / (1 + np.exp(-v))
z = s(x @ p["Wz"] + h @ p["Uz"] + p["bz"])
r = s(x @ p["Wr"] + h @ p["Ur"] + p["br"])
cand = np.tanh(x @ p["Wh"] + (r * h) @ p["Uh"] + p["bh"])
assert np.allclose(gru_step(x, h, p), (1 - z) * h + z * cand), "Follow the GRU equations exactly."
p2 = dict(p, bz=np.full(n_h, -50.0))
assert np.allclose(gru_step(x, h, p2), h), "With the update gate shut (z ≈ 0) the state is kept unchanged."
assert recurrent_params(10, 32, 1) == 1376 and recurrent_params(10, 32, 3) == 4128 and recurrent_params(10, 32, 4) == 5504, "gates × (n_in·n_h + n_h·n_h + n_h)."`,
            },
          ],
          solution: py`import numpy as np

def sigmoid(z):
    return 1 / (1 + np.exp(-z))

def gru_step(x, h, p):
    z = sigmoid(x @ p["Wz"] + h @ p["Uz"] + p["bz"])
    r = sigmoid(x @ p["Wr"] + h @ p["Ur"] + p["br"])
    cand = np.tanh(x @ p["Wh"] + (r * h) @ p["Uh"] + p["bh"])
    return (1 - z) * h + z * cand

def recurrent_params(n_in, n_hidden, gates):
    return gates * (n_in * n_hidden + n_hidden * n_hidden + n_hidden)
`,
          hint: "Compute z and r with sigmoid, then the candidate with tanh using r * h inside, then blend: (1 - z) * h + z * cand.",
          successMessage: "When the update gate closes, the GRU passes its state through untouched, which is how gated networks carry information across long gaps.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 78 · 17.6 – 17.8
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ml-l78-forecasting-limitations",
    moduleId: "ml-m17-rnn",
    sectionId: SECTION_ID,
    order: 3,
    covers: ["17.6", "17.7", "17.8"],
    title: "Sequence Prediction, Forecasting and the Limits of Recurrence",
    subtitle: "Predicting what comes next, honestly, and why attention replaced RNNs",
    estimatedMinutes: 42,
    intro:
      "A forecast is only useful if it beats the obvious guesses. This lesson builds the baselines every forecast must beat, a model that beats them, and then explains why recurrent networks gave way to Transformers.",

    atoms: [
      {
        id: "a-ml-sequence-prediction",
        title: "Sequence prediction",
        explain:
          "SEQUENCE PREDICTION forecasts the next element(s) from the history: the next value of a series, the next word of a sentence, the next product a customer will view. Always start with BASELINES. The NAIVE forecast predicts that the next value equals the last one; the SEASONAL NAIVE forecast predicts the value from one season ago (this December = last December); the MOVING AVERAGE predicts the mean of the last k values. They are surprisingly hard to beat, and a sophisticated model that cannot beat the seasonal naive forecast is not worth deploying. For several steps ahead, a model either predicts all horizons directly or feeds its own predictions back in RECURSIVELY, which compounds errors.",
        codeExercise: {
          language: PY,
          code: SALES + py`train, test = sales[:-12], sales[-12:]

naive = np.repeat(train.iloc[-1], 12)
seasonal = train.iloc[-12:].to_numpy()
mean3 = np.repeat(train.iloc[-3:].mean(), 12)
for name, pred in [("naive", naive), ("seasonal naive", seasonal), ("moving average", mean3)]:
    print(name, round(np.mean(np.abs(test.to_numpy() - pred)), 2))
`,
          question: "Forecast the last 12 months with three baselines learned from the first 48. What mean absolute error does each have?",
          expectedOutput: "naive 9.49\nseasonal naive 18.6\nmoving average 8.07",
          hint: "The seasonal naive forecast copies last year's pattern but misses a whole year of upward trend (18 units).",
          successMessage: "The seasonal naive forecast is worst here: it copies last year's shape but misses a whole year of growth. The naive and moving-average forecasts track the level but ignore December. Each baseline captures one thing; a good model must capture trend AND season.",
        },
      },
      {
        id: "a-ml-forecasting",
        title: "Time-series forecasting",
        explain:
          "A practical forecasting recipe with classical ML: build LAG features (the value 1, 2, … and 12 steps ago), ROLLING statistics (the mean of the last 3 months), and CALENDAR features (month number, holidays), then fit a regression model on the past and predict the future. Evaluate with a TIME-BASED split, or WALK-FORWARD validation (train on everything up to month t, test on t + 1, slide forward), never shuffled cross-validation. Statistical methods (ARIMA, exponential smoothing, Prophet) and neural ones (LSTMs, temporal convolutions, Transformers) are alternatives; on modest business series, lag features with a linear or gradient-boosted model are often as good as anything and far easier to maintain.",
        codeChallenge: {
          task:
            "Write lag_features(series) that returns a DataFrame with columns lag1, lag12 and month (the month number of each row's date), indexed like the series, with the rows that lack a lag-12 value dropped. Then write forecast_mae(series) that builds those features with y = the series value, trains LinearRegression on every row except the last 12, predicts the last 12, and returns the mean absolute error rounded to 2.",
          starter: "import numpy as np\nimport pandas as pd\nfrom sklearn.linear_model import LinearRegression\n\ndef lag_features(series):\n    pass\n\ndef forecast_mae(series):\n    pass\n",
          sample: "on the sales series, forecast_mae beats every baseline from the previous atom",
          tests: [
            {
              check: SALES + py`
F = lag_features(sales)
assert list(F.columns) == ["lag1", "lag12", "month"], "Columns lag1, lag12, month. Got " + repr(list(F.columns))
assert len(F) == 48 and F.index[0] == sales.index[12], "The first 12 rows have no lag-12 value and are dropped. Got " + str(len(F)) + " rows."
assert F["lag12"].iloc[0] == sales.iloc[0] and F["lag1"].iloc[0] == sales.iloc[11] and F["month"].iloc[0] == 1, "Lags must look back exactly 1 and 12 months."
mae = forecast_mae(sales)
assert mae < 6, "Lag features with trend and season should beat the best baseline (moving average, 8.07) clearly. Got " + str(mae)
from sklearn.linear_model import LinearRegression
y = sales.loc[F.index]
m = LinearRegression().fit(F.iloc[:-12], y.iloc[:-12])
assert mae == round(float(np.mean(np.abs(y.iloc[-12:] - m.predict(F.iloc[-12:])))), 2), "Train on all but the last 12 rows, test on the last 12."`,
            },
          ],
          solution: py`import numpy as np
import pandas as pd
from sklearn.linear_model import LinearRegression

def lag_features(series):
    df = pd.DataFrame({
        "lag1": series.shift(1),
        "lag12": series.shift(12),
        "month": series.index.month,
    }, index=series.index)
    return df.dropna()

def forecast_mae(series):
    X = lag_features(series)
    y = series.loc[X.index]
    model = LinearRegression().fit(X.iloc[:-12], y.iloc[:-12])
    pred = model.predict(X.iloc[-12:])
    return round(float(np.mean(np.abs(y.iloc[-12:] - pred))), 2)
`,
          hint: "series.shift(1) and series.shift(12) give the lags; series.index.month the month. dropna() removes the first 12 rows. Align y with series.loc[X.index].",
          successMessage: "lag1 carries the trend and lag12 the season: together they cut the error to a fraction of the best baseline. Simple, honest features often beat complex models on business series.",
        },
      },
      {
        id: "a-ml-rnn-limitations",
        title: "Limitations of recurrent networks",
        explain:
          "Recurrent networks have three structural limits. (1) VANISHING (and exploding) GRADIENTS: backpropagation through time multiplies one Jacobian per step; with tanh derivatives at most 1 and typical weights, the product shrinks exponentially, so the network cannot learn long-range dependencies (LSTMs and GRUs ease this but do not eliminate it; gradient CLIPPING tames explosions). (2) SEQUENTIAL computation: step t needs step t − 1, so an RNN cannot process a sequence in parallel, making training on long texts slow even on GPUs. (3) a fixed-size hidden state must squeeze the entire past into one vector, a BOTTLENECK. ATTENTION (Module 18) addresses all three by letting every position look directly at every other position, in parallel, which is why Transformers replaced RNNs for language.",
        codeExercise: {
          language: PY,
          code: py`import numpy as np

rng = np.random.default_rng(0)
w = 0.9                                  # a recurrent weight
h = 0.0
grads = []
for t in range(50):
    h = np.tanh(w * h + rng.normal(0, 1))
    grads.append(w * (1 - h ** 2))      # local derivative dh_t / dh_(t-1)

for span in [1, 10, 25, 50]:
    print(span, f"{np.prod(grads[-span:]):.1e}")
`,
          question: "The gradient reaching a step k steps back is the product of the local derivatives in between. What is it for spans of 1, 10, 25 and 50 steps?",
          expectedOutput: "1 4.3e-02\n10 3.0e-10\n25 6.2e-15\n50 5.4e-27",
          hint: "Each factor is below 1 (0.9 × (1 − h²)), so the product shrinks exponentially with the span.",
          successMessage: "After 50 steps the learning signal is about 10⁻²⁷ times smaller: nothing about step 1 can be learned at step 50. That is the vanishing gradient, measured.",
        },
      },
    ],

    task: {
      title: "Module 17 project: a basic time-series forecasting model",
      intro:
        "Forecast a real monthly or weekly series: Nigerian business sales (your Module 5 data aggregated by month), electricity demand, rainfall, or a public retail series.",
      prompts: [
        "Plot the series; describe its trend and seasonality, and compute its autocorrelation at several lags.",
        "Hold out the final season (for example the last 12 months) as the test period.",
        "Compute naive, seasonal naive and moving-average baselines and their MAE on the test period.",
        "Build lag, rolling and calendar features and train a linear model and a gradient-boosted model; evaluate with walk-forward validation.",
        "Train a small LSTM in PyTorch (on your machine or Colab) on sliding windows of the same series and compare.",
        "Plot the forecasts against the actual values and report which approach you would deploy, and why.",
      ],
      closing: "Text is the richest sequence of all. Module 18 covers how computers process language, from word counts to the attention mechanism behind Transformers.",
    },

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
