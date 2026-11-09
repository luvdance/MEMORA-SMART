/**
 * MACHINE LEARNING AND AI · MODULE 14 · INTRODUCTION TO NEURAL NETWORKS
 *
 * Curriculum 14.1 – 14.15. Artificial and biological neurons; weights,
 * biases and activation functions; input, hidden and output layers; forward
 * propagation; loss; backpropagation; gradient descent; learning rates; and
 * training. Everything is built by the learner in NumPy: a perceptron, the
 * activation functions and their derivatives, a forward pass, backpropagation
 * verified against numerical gradients (Module 3), and a complete training
 * loop that solves XOR, the problem a single neuron cannot.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

export const SECTION_ID = "ml-s14-neural-networks";

const PY = "python";
const py = String.raw;

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 63 · 14.1 – 14.4
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ml-l63-neurons",
    moduleId: "ml-m14-neural-networks",
    sectionId: SECTION_ID,
    order: 1,
    covers: ["14.1", "14.2", "14.3", "14.4"],
    title: "Neural Networks, Neurons, Weights and Biases",
    subtitle: "From the brain's cells to a weighted sum and a decision",
    estimatedMinutes: 36,
    intro:
      "Every neural network, from a digit reader to a large language model, is built from one tiny unit: a weighted sum followed by a simple function. This lesson builds that unit and trains it.",

    atoms: [
      {
        id: "a-ml-ann-intro",
        title: "What are artificial neural networks?",
        explain:
          "An ARTIFICIAL NEURAL NETWORK (ANN) is a function built from many simple units, NEURONS, arranged in LAYERS, where each layer's outputs are the next layer's inputs. With enough neurons and the right weights, a network can approximate almost any function (the UNIVERSAL APPROXIMATION theorem), and crucially, its weights can be LEARNED from data by gradient descent. Networks with many layers learn their own features from raw inputs, which is why they dominate images, audio and language. The ideas date from the 1940s–1980s; they took over in the 2010s when large datasets, GPUs and better training methods arrived.",
        origin:
          "Warren McCulloch and Walter Pitts described a mathematical neuron in 1943. Frank Rosenblatt built the perceptron in 1958. Backpropagation was popularised by Rumelhart, Hinton and Williams in 1986, and in 2012 a deep network (AlexNet) won the ImageNet competition by a wide margin, starting the deep learning era.",
        decision: {
          scenario: "A team must predict loan default from 12 well-understood numeric columns for 5,000 customers, and regulators require an explanation for every decision.",
          question: "Is a deep neural network the obvious choice?",
          options: [
            { id: "a", text: "Yes: neural networks are always the most accurate", whyWrong: "On small tabular data, gradient-boosted trees or logistic regression usually match or beat them, and explain far more easily." },
            { id: "b", text: "No: small, tabular data with an explanation requirement favours simpler, interpretable models", why: "Neural networks shine on large, unstructured data (images, audio, text). Here they add complexity without clear benefit." },
            { id: "c", text: "Yes, but only with 100 layers", whyWrong: "Depth does not fix the mismatch between the tool and the problem." },
            { id: "d", text: "No: neural networks cannot use numeric data", whyWrong: "They can; it is simply not where they have the advantage." },
          ],
          correct: "b",
          aftermath: "Use neural networks where they excel: lots of data, raw unstructured inputs, complex patterns.",
        },
      },
      {
        id: "a-ml-biological-neurons",
        title: "Inspiration from biological neurons",
        explain:
          "A biological NEURON receives signals from thousands of others through DENDRITES; connections (SYNAPSES) have different strengths, some exciting and some inhibiting; the cell body sums the incoming signals and, if the total passes a threshold, FIRES an electrical pulse down its AXON to other neurons. Learning strengthens or weakens synapses (\"neurons that fire together wire together\", Hebb, 1949). The artificial neuron copies this outline only: inputs (dendrites), weights (synapse strengths), a sum, and an activation (firing). Real neurons are vastly more complex, and modern networks owe more to mathematics than to biology; the analogy is a useful picture, not a model of the brain.",
        table: {
          caption: "The analogy, and where it ends.",
          headers: ["Biological neuron", "Artificial neuron"],
          rows: [
            ["Dendrites receive signals", "Inputs x₁ … xₙ"],
            ["Synapse strength", "Weights w₁ … wₙ"],
            ["Cell body sums the signals", "Weighted sum z = w·x + b"],
            ["Fires if past a threshold", "Activation function a = f(z)"],
            ["Learning changes synapses", "Training changes weights by gradient descent"],
            ["~86 billion neurons, spiking in time", "Thousands to billions of units, computed as matrix products"],
          ],
        },
      },
      {
        id: "a-ml-artificial-neuron",
        title: "Artificial neurons",
        explain:
          "An ARTIFICIAL NEURON computes a weighted sum of its inputs plus a bias, z = w·x + b, then applies an ACTIVATION FUNCTION, a = f(z). Rosenblatt's PERCEPTRON uses a step activation (output 1 if z ≥ 0, else 0) and learns with a simple rule: for each example, w ← w + η(y − ŷ)x and b ← b + η(y − ŷ), so weights change only when the prediction is wrong. A single perceptron draws one straight line (hyperplane), so it can learn AND and OR, but not XOR, whose classes no single line separates. That limitation, pointed out by Minsky and Papert in 1969, is solved by adding a hidden layer (Lesson 67).",
        codeChallenge: {
          task:
            "Write train_perceptron(X, y, lr=0.1, epochs=20) that starts with w = zeros and b = 0 and, for each epoch, loops over the rows in order: predict ŷ = 1 if w·x + b ≥ 0 else 0, then update w += lr × (y − ŷ) × x and b += lr × (y − ŷ). Return (w, b). Then write perceptron_predict(w, b, X) returning a NumPy array of 0/1 predictions.",
          starter: "import numpy as np\n\ndef train_perceptron(X, y, lr=0.1, epochs=20):\n    pass\n\ndef perceptron_predict(w, b, X):\n    pass\n",
          sample: "trained on the AND truth table it predicts [0, 0, 0, 1]; on XOR it can never get all four right",
          tests: [
            {
              check: py`import numpy as np
X = np.array([[0, 0], [0, 1], [1, 0], [1, 1]], dtype=float)
w, b = train_perceptron(X, np.array([0, 0, 0, 1]))
assert perceptron_predict(w, b, X).tolist() == [0, 0, 0, 1], "A perceptron learns AND. Got " + repr(perceptron_predict(w, b, X).tolist())
w, b = train_perceptron(X, np.array([0, 1, 1, 1]))
assert perceptron_predict(w, b, X).tolist() == [0, 1, 1, 1], "...and OR."
w, b = train_perceptron(X, np.array([0, 1, 1, 0]), epochs=200)
assert perceptron_predict(w, b, X).tolist() != [0, 1, 1, 0], "No straight line separates XOR, so one perceptron can never learn it."
w1, b1 = train_perceptron(np.array([[1.0, 1.0]]), np.array([0]), lr=0.5, epochs=1)
assert np.allclose(w1, [-0.5, -0.5]) and abs(b1 + 0.5) < 1e-12, "z = 0 predicts 1, which is wrong, so w and b each move by −0.5. Got " + repr((w1, b1))`,
            },
          ],
          solution: py`import numpy as np

def train_perceptron(X, y, lr=0.1, epochs=20):
    w = np.zeros(X.shape[1])
    b = 0.0
    for _ in range(epochs):
        for xi, yi in zip(X, y):
            pred = 1 if xi @ w + b >= 0 else 0
            w = w + lr * (yi - pred) * xi
            b = b + lr * (yi - pred)
    return w, b

def perceptron_predict(w, b, X):
    return (X @ w + b >= 0).astype(int)
`,
          hint: "Two nested loops: epochs, then rows. pred = 1 if xi @ w + b >= 0 else 0; the update is zero when the prediction is right.",
          successMessage: "AND and OR learned in a few epochs; XOR never, however long you train. One neuron draws one line. Lesson 67 adds a hidden layer and solves it.",
        },
      },
      {
        id: "a-ml-weights-biases",
        title: "Inputs, weights and biases",
        explain:
          "INPUTS are the feature values reaching a neuron (or the previous layer's outputs). Each input has a WEIGHT: its sign says whether the input pushes the neuron's output up or down, its size how strongly. The BIAS shifts the weighted sum independently of the inputs, letting the neuron fire even when all inputs are zero, like the intercept in linear regression; geometrically it moves the decision boundary away from the origin. A layer of m neurons receiving n inputs has an n × m WEIGHT MATRIX and m biases, so the whole layer is one matrix product: Z = XW + b. Training adjusts every weight and bias.",
        codeExercise: {
          language: PY,
          code: py`import numpy as np

x = np.array([0.8, 0.2, 0.5])            # inputs: [income, debt, tenure], scaled
w = np.array([1.5, -2.0, 0.7])           # weights
b = -0.6                                 # bias
z = x @ w + b
print(round(z, 2))

W = np.array([[1.5, 0.3], [-2.0, 0.9], [0.7, -0.4]])   # a layer of 2 neurons
bias = np.array([-0.6, 0.1])
print(np.round(x @ W + bias, 2), W.size + bias.size)
`,
          question: "One neuron's weighted sum, then a layer of two neurons computed as one matrix product, and the number of parameters in that layer. What does it print?",
          expectedOutput: "0.55\n[0.55 0.32] 8",
          hint: "0.8 × 1.5 − 0.2 × 2.0 + 0.5 × 0.7 − 0.6. The second neuron: 0.24 + 0.18 − 0.2 + 0.1 = 0.32. Parameters: 3 × 2 weights + 2 biases.",
          successMessage: "A whole layer is one matrix product plus a bias vector, with (inputs × neurons) + neurons parameters. That count grows fast, which is why networks need lots of data.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 64 · 14.5
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ml-l64-activation-functions",
    moduleId: "ml-m14-neural-networks",
    sectionId: SECTION_ID,
    order: 2,
    covers: ["14.5"],
    title: "Activation Functions",
    subtitle: "The non-linearity that gives networks their power",
    estimatedMinutes: 34,
    intro:
      "Without activation functions, a hundred-layer network is just one linear model in disguise. This lesson shows why, and builds the activation functions every network uses, with the derivatives backpropagation needs.",

    atoms: [
      {
        id: "a-ml-activation-functions",
        title: "Activation functions",
        explain:
          "An ACTIVATION FUNCTION f transforms a neuron's weighted sum z into its output. SIGMOID σ(z) = 1 / (1 + e⁻ᶻ) maps to (0, 1), used for binary outputs; its derivative σ(1 − σ) is at most 0.25 and near 0 for large |z|, so gradients VANISH in deep stacks. TANH maps to (−1, 1), zero-centred, derivative 1 − tanh². ReLU, max(0, z), is the default for hidden layers: cheap, and its derivative is exactly 1 for z > 0, so gradients flow; but neurons stuck at z < 0 output 0 forever (\"dying ReLU\"). LEAKY ReLU uses a small slope (0.01z) for z < 0. SOFTMAX turns an output vector into class probabilities (Module 11). Backpropagation needs each function's DERIVATIVE.",
        codeChallenge: {
          task:
            "Write NumPy functions that work element-wise on arrays: sigmoid(z), sigmoid_grad(z) = σ(z)(1 − σ(z)), tanh_grad(z) = 1 − tanh(z)², relu(z), relu_grad(z) (1 where z > 0, else 0), and leaky_relu(z, alpha=0.01) (z where z > 0, else alpha × z).",
          starter: "import numpy as np\n\ndef sigmoid(z):\n    pass\n\ndef sigmoid_grad(z):\n    pass\n\ndef tanh_grad(z):\n    pass\n\ndef relu(z):\n    pass\n\ndef relu_grad(z):\n    pass\n\ndef leaky_relu(z, alpha=0.01):\n    pass\n",
          sample: "relu(np.array([-2., 0., 3.])) → [0., 0., 3.]; sigmoid_grad(0) → 0.25",
          tests: [
            {
              check: py`import numpy as np
z = np.array([-3.0, -0.5, 0.0, 0.5, 3.0])
assert np.allclose(sigmoid(z), 1 / (1 + np.exp(-z))), "sigmoid."
assert abs(sigmoid_grad(np.array([0.0]))[0] - 0.25) < 1e-12, "σ'(0) = 0.25, its maximum."
h = 1e-6
for f, g in [(sigmoid, sigmoid_grad), (np.tanh, tanh_grad)]:
    numeric = (f(z + h) - f(z - h)) / (2 * h)
    assert np.allclose(g(z), numeric, atol=1e-6), "A derivative does not match the numerical check: " + g.__name__
assert relu(z).tolist() == [0, 0, 0, 0.5, 3], "ReLU keeps positives."
assert relu_grad(z).tolist() == [0, 0, 0, 1, 1], "ReLU's gradient: 1 for z > 0, else 0."
assert np.allclose(leaky_relu(z), [-0.03, -0.005, 0, 0.5, 3]), "Leaky ReLU keeps a small slope for negatives."
assert sigmoid_grad(np.array([10.0]))[0] < 1e-4, "At z = 10 the sigmoid's gradient has nearly vanished."
assert not uses("For"), "Use whole-array NumPy expressions."`,
            },
          ],
          solution: py`import numpy as np

def sigmoid(z):
    return 1 / (1 + np.exp(-z))

def sigmoid_grad(z):
    s = sigmoid(z)
    return s * (1 - s)

def tanh_grad(z):
    return 1 - np.tanh(z) ** 2

def relu(z):
    return np.maximum(0, z)

def relu_grad(z):
    return (z > 0).astype(float)

def leaky_relu(z, alpha=0.01):
    return np.where(z > 0, z, alpha * z)
`,
          hint: "relu is np.maximum(0, z); relu_grad is (z > 0).astype(float); leaky_relu is np.where(z > 0, z, alpha * z).",
          successMessage: "Your derivatives pass the numerical check. Notice σ'(10) is almost 0: stack many sigmoids and gradients vanish, which is why hidden layers use ReLU.",
        },
      },
      {
        id: "a-ml-why-nonlinear",
        title: "Why networks need non-linear activations",
        explain:
          "Two layers with NO activation compute X W₁ W₂ = X (W₁W₂): the product of two matrices is just another matrix, so the network collapses into a single linear layer however deep it is, and can only draw straight boundaries. A NON-LINEAR activation between layers breaks this: each layer can bend the space, and stacked bends can represent curved boundaries and complex functions. That is the whole reason activation functions exist. The output layer's activation is chosen by the task instead (Lesson 65).",
        codeExercise: {
          language: PY,
          code: py`import numpy as np

rng = np.random.default_rng(0)
X = rng.normal(size=(5, 3))
W1 = rng.normal(size=(3, 4))
W2 = rng.normal(size=(4, 2))

two_linear = (X @ W1) @ W2
one_linear = X @ (W1 @ W2)
print(np.allclose(two_linear, one_linear), (W1 @ W2).shape)

with_relu = np.maximum(0, X @ W1) @ W2
print(np.allclose(with_relu, one_linear))
`,
          question: "Do two linear layers equal one linear layer? And with a ReLU between them?",
          expectedOutput: "True (3, 2)\nFalse",
          hint: "Matrix multiplication is associative: (XW₁)W₂ = X(W₁W₂).",
          successMessage: "Without the ReLU, two layers were exactly one 3 × 2 layer. With it, the network computes something no single linear layer can.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 65 · 14.6 – 14.10
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ml-l65-layers-forward",
    moduleId: "ml-m14-neural-networks",
    sectionId: SECTION_ID,
    order: 3,
    covers: ["14.6", "14.7", "14.8", "14.9", "14.10"],
    title: "Layers and Forward Propagation",
    subtitle: "Input, hidden and output layers, and the pass from features to prediction",
    estimatedMinutes: 40,
    intro:
      "A network is layers of neurons wired in sequence. Data flows forward through them, each layer a matrix product and an activation, until the output layer produces a prediction. That flow is forward propagation.",

    atoms: [
      {
        id: "a-ml-nn-layers",
        title: "Neural network layers",
        explain:
          "A LAYER is a group of neurons that all receive the same inputs and compute in parallel. In a fully connected (DENSE) layer every neuron connects to every input: with n inputs and m neurons it holds an n × m weight matrix and m biases, (n + 1) × m parameters. A network's ARCHITECTURE is its sequence of layers and their sizes, for example 784 → 128 → 64 → 10 for handwritten digits. Depth (the number of layers) lets the network build features of features; width (neurons per layer) gives each layer capacity. Other layer types (convolutional, recurrent, attention) appear in Modules 16 to 18.",
        codeExercise: {
          language: PY,
          code: py`sizes = [784, 128, 64, 10]          # a digit classifier

total = 0
for n_in, n_out in zip(sizes, sizes[1:]):
    params = n_in * n_out + n_out
    total += params
    print(n_in, "->", n_out, params)
print("total", total)
`,
          question: "Count the parameters in each dense layer of a 784 → 128 → 64 → 10 network, and the total. What does it print?",
          expectedOutput: "784 -> 128 100480\n128 -> 64 8256\n64 -> 10 650\ntotal 109386",
          hint: "Each layer has n_in × n_out weights plus n_out biases: 784 × 128 + 128.",
          successMessage: "Over 100,000 parameters, 92% of them in the first layer. Module 16 shows how convolutions process images with far fewer.",
        },
      },
      {
        id: "a-ml-input-hidden-output",
        title: "Input, hidden and output layers",
        explain:
          "The INPUT LAYER is not really neurons: it holds the feature values (784 pixel intensities, or 12 scaled customer features); its size is the number of features. HIDDEN LAYERS sit in between and learn intermediate representations; they use ReLU (or a variant), and their number and sizes are hyperparameters. The OUTPUT LAYER produces the prediction, and its size and activation are dictated by the TASK: regression, 1 neuron with no activation (linear); binary classification, 1 neuron with sigmoid (probability of class 1); multiclass, K neurons with softmax (a probability per class); multilabel, K neurons each with sigmoid.",
        table: {
          caption: "The output layer is chosen by the task, together with its loss.",
          headers: ["Task", "Output neurons", "Activation", "Loss"],
          rows: [
            ["Regression (price)", "1", "None (linear)", "Mean squared error"],
            ["Binary classification (fraud)", "1", "Sigmoid", "Binary cross-entropy"],
            ["Multiclass (10 digits)", "10", "Softmax", "Categorical cross-entropy"],
            ["Multilabel (film genres)", "K", "Sigmoid on each", "Binary cross-entropy per label"],
          ],
        },
        decision: {
          scenario: "A network must classify crop leaf photos into one of 5 diseases or \"healthy\".",
          question: "What should its output layer be?",
          options: [
            { id: "a", text: "1 neuron with sigmoid", whyWrong: "That is for a yes/no question; there are 6 classes." },
            { id: "b", text: "6 neurons with softmax", why: "One neuron per class, and softmax makes their outputs a probability distribution over the 6 classes." },
            { id: "c", text: "6 neurons with ReLU", whyWrong: "ReLU outputs are not probabilities and do not sum to 1." },
            { id: "d", text: "1 neuron with no activation", whyWrong: "That is a regression output." },
          ],
          correct: "b",
          aftermath: "Multiclass, one label per example: K neurons with softmax and categorical cross-entropy.",
        },
      },
      {
        id: "a-ml-forward-propagation",
        title: "Forward propagation",
        explain:
          "FORWARD PROPAGATION computes the network's output layer by layer: Z₁ = XW₁ + b₁, A₁ = ReLU(Z₁), Z₂ = A₁W₂ + b₂, Ŷ = output_activation(Z₂). With X holding a BATCH of rows (shape batch × features), every step is a matrix operation on the whole batch at once, which is why GPUs make networks fast. Keep the intermediate values (Z₁, A₁): backpropagation reuses them. A shape check at each step catches most bugs: (batch, n_in) @ (n_in, n_hidden) → (batch, n_hidden).",
        codeChallenge: {
          task:
            "Write forward(X, params) for a network with one ReLU hidden layer and a softmax output. params is a dictionary with W1 (n_in × h), b1 (h,), W2 (h × k) and b2 (k,). Return (probs, cache) where probs has shape (batch, k) with each row summing to 1, and cache is a dictionary holding Z1, A1 and Z2. Use a numerically stable softmax (subtract each row's max).",
          starter: "import numpy as np\n\ndef forward(X, params):\n    pass\n",
          sample: "a batch of 5 rows with 4 features, 3 hidden units and 2 classes → probs of shape (5, 2)",
          tests: [
            {
              check: py`import numpy as np
rng = np.random.default_rng(1)
p = {"W1": rng.normal(size=(4, 3)), "b1": rng.normal(size=3), "W2": rng.normal(size=(3, 2)), "b2": rng.normal(size=2)}
X = rng.normal(size=(5, 4))
probs, cache = forward(X, p)
assert probs.shape == (5, 2) and np.allclose(probs.sum(axis=1), 1), "One probability row per example, summing to 1. Got shape " + repr(probs.shape)
Z1 = X @ p["W1"] + p["b1"]
A1 = np.maximum(0, Z1)
Z2 = A1 @ p["W2"] + p["b2"]
e = np.exp(Z2 - Z2.max(axis=1, keepdims=True))
assert np.allclose(probs, e / e.sum(axis=1, keepdims=True)), "probs must be softmax(ReLU(X W1 + b1) W2 + b2)."
assert set(cache) >= {"Z1", "A1", "Z2"} and np.allclose(cache["A1"], A1), "Cache Z1, A1 and Z2 for backpropagation."
big = {k: v * 300 for k, v in p.items()}
assert np.all(np.isfinite(forward(X, big)[0])), "Use a numerically stable softmax."`,
            },
          ],
          solution: py`import numpy as np

def forward(X, params):
    Z1 = X @ params["W1"] + params["b1"]
    A1 = np.maximum(0, Z1)
    Z2 = A1 @ params["W2"] + params["b2"]
    e = np.exp(Z2 - Z2.max(axis=1, keepdims=True))
    probs = e / e.sum(axis=1, keepdims=True)
    return probs, {"Z1": Z1, "A1": A1, "Z2": Z2}
`,
          hint: "Z1 = X @ W1 + b1; A1 = np.maximum(0, Z1); Z2 = A1 @ W2 + b2; then a stable softmax over each row.",
          successMessage: "Five rows, four lines of NumPy: that is the forward pass of a real neural network. Next, the backward pass that trains it.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 66 · 14.11 – 14.13
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ml-l66-loss-backprop",
    moduleId: "ml-m14-neural-networks",
    sectionId: SECTION_ID,
    order: 4,
    covers: ["14.11", "14.12", "14.13"],
    title: "Loss, Backpropagation and Gradient Descent",
    subtitle: "Measuring the error, sending it backwards, and updating every weight",
    estimatedMinutes: 44,
    intro:
      "Backpropagation is the algorithm that made deep learning possible. It is the chain rule from Module 3, applied layer by layer from the loss backwards, and you will derive, implement and verify it here.",

    atoms: [
      {
        id: "a-ml-nn-loss",
        title: "Loss functions for neural networks",
        explain:
          "The network's LOSS compares its outputs with the targets over a batch: MEAN SQUARED ERROR for regression; BINARY CROSS-ENTROPY, −mean[y log p + (1 − y) log(1 − p)], for a sigmoid output; CATEGORICAL CROSS-ENTROPY, −mean[log p_true_class], for a softmax output with integer labels. Cross-entropy pairs naturally with sigmoid and softmax: the gradient of the loss with respect to the output layer's pre-activation Z simplifies to (probabilities − one-hot targets) / batch_size, which is both elegant and numerically stable. That single expression starts every backward pass in this module.",
        codeExercise: {
          language: PY,
          code: py`import numpy as np

probs = np.array([[0.7, 0.2, 0.1],
                  [0.1, 0.8, 0.1],
                  [0.3, 0.3, 0.4]])
labels = np.array([0, 1, 0])

loss = -np.mean(np.log(probs[np.arange(3), labels]))
print(round(loss, 4))

onehot = np.eye(3)[labels]
dZ = (probs - onehot) / len(labels)
print(np.round(dZ, 3))
`,
          question: "Three examples with softmax outputs and true classes 0, 1 and 0. What are the cross-entropy loss and its gradient with respect to the output scores?",
          expectedOutput: "0.5946\n[[-0.1    0.067  0.033]\n [ 0.033 -0.067  0.033]\n [-0.233  0.1    0.133]]",
          hint: "The true-class probabilities are 0.7, 0.8 and 0.3. The gradient is probabilities minus one-hot targets, divided by 3.",
          successMessage: "The gradient pushes each true class's score up (negative entries) and the others down, most strongly for the badly wrong third example.",
        },
      },
      {
        id: "a-ml-backpropagation",
        title: "Backpropagation",
        explain:
          "BACKPROPAGATION computes the gradient of the loss with respect to EVERY weight in one backward pass, reusing the forward pass's cached values. For the network Z1 = XW1 + b1, A1 = ReLU(Z1), Z2 = A1W2 + b2, softmax, cross-entropy: dZ2 = (P − Y)/n; dW2 = A1ᵀ dZ2; db2 = sum of dZ2 over rows; dA1 = dZ2 W2ᵀ; dZ1 = dA1 ⊙ ReLU′(Z1); dW1 = Xᵀ dZ1; db1 = sum of dZ1 over rows. Each line is the chain rule: the gradient arriving from above times the local derivative. The transposes make shapes line up, and every gradient has the same shape as the parameter it belongs to. Always verify a backward pass with a NUMERICAL gradient check.",
        codeChallenge: {
          task:
            "Write backward(X, y, params, probs, cache) for the network of Lesson 65 (ReLU hidden layer, softmax output, cross-entropy loss), where y holds integer class labels. Return a dictionary of gradients dW1, db1, dW2, db2 using the formulas above. The test checks them against numerical gradients.",
          starter: "import numpy as np\n\ndef forward(X, params):\n    Z1 = X @ params[\"W1\"] + params[\"b1\"]\n    A1 = np.maximum(0, Z1)\n    Z2 = A1 @ params[\"W2\"] + params[\"b2\"]\n    e = np.exp(Z2 - Z2.max(axis=1, keepdims=True))\n    return e / e.sum(axis=1, keepdims=True), {\"Z1\": Z1, \"A1\": A1, \"Z2\": Z2}\n\ndef backward(X, y, params, probs, cache):\n    pass\n",
          sample: "every analytic gradient matches its numerical estimate to about 1e-7",
          tests: [
            {
              check: py`import numpy as np
rng = np.random.default_rng(4)
n, d, h, k = 6, 3, 5, 3
p = {"W1": rng.normal(size=(d, h)), "b1": rng.normal(size=h) * 0.1, "W2": rng.normal(size=(h, k)), "b2": rng.normal(size=k) * 0.1}
X = rng.normal(size=(n, d))
y = rng.integers(0, k, n)
def loss(params):
    P, _ = forward(X, params)
    return -np.mean(np.log(P[np.arange(n), y]))
probs, cache = forward(X, p)
g = backward(X, y, p, probs, cache)
assert set(g) == {"dW1", "db1", "dW2", "db2"}, "Return dW1, db1, dW2 and db2. Got " + repr(set(g))
for name in ["W1", "b1", "W2", "b2"]:
    assert g["d" + name].shape == p[name].shape, "d" + name + " must have the same shape as " + name
    num = np.zeros_like(p[name])
    it = np.nditer(p[name], flags=["multi_index"])
    for _ in it:
        i = it.multi_index
        up = {kk: v.copy() for kk, v in p.items()}
        dn = {kk: v.copy() for kk, v in p.items()}
        up[name][i] += 1e-5
        dn[name][i] -= 1e-5
        num[i] = (loss(up) - loss(dn)) / 2e-5
    assert np.allclose(g["d" + name], num, atol=1e-6), "d" + name + " does not match the numerical gradient."`,
            },
          ],
          solution: py`import numpy as np

def forward(X, params):
    Z1 = X @ params["W1"] + params["b1"]
    A1 = np.maximum(0, Z1)
    Z2 = A1 @ params["W2"] + params["b2"]
    e = np.exp(Z2 - Z2.max(axis=1, keepdims=True))
    return e / e.sum(axis=1, keepdims=True), {"Z1": Z1, "A1": A1, "Z2": Z2}

def backward(X, y, params, probs, cache):
    n = len(X)
    dZ2 = probs.copy()
    dZ2[np.arange(n), y] -= 1
    dZ2 /= n
    dW2 = cache["A1"].T @ dZ2
    db2 = dZ2.sum(axis=0)
    dA1 = dZ2 @ params["W2"].T
    dZ1 = dA1 * (cache["Z1"] > 0)
    dW1 = X.T @ dZ1
    db1 = dZ1.sum(axis=0)
    return {"dW1": dW1, "db1": db1, "dW2": dW2, "db2": db2}
`,
          hint: "Start with dZ2 = probs minus one-hot(y), divided by n (subtract 1 at [row, true class]). Then follow the formulas: each gradient is (input to that layer)ᵀ @ (gradient arriving at its output).",
          successMessage: "Every analytic gradient matched its numerical estimate. You have implemented backpropagation, the algorithm inside every deep learning framework.",
        },
      },
      {
        id: "a-ml-nn-gradient-descent",
        title: "Gradient descent for neural networks",
        explain:
          "With the gradients from backpropagation, each parameter takes a step downhill: W ← W − η·dW, for every weight matrix and bias vector. Networks are trained with MINI-BATCH gradient descent: shuffle the data each EPOCH, split it into batches of, say, 32 to 256 rows, and update after each batch, giving many cheap, slightly noisy steps that also help escape poor regions. Modern OPTIMISERS improve on the plain update: MOMENTUM accumulates a running direction, RMSPROP scales each parameter's step by its recent gradient size, and ADAM combines both and is the usual default (Module 15).",
        codeExercise: {
          language: PY,
          code: py`import numpy as np

w = np.array([2.0, -1.0])
X = np.array([[1.0, 2.0], [3.0, 1.0]])
y = np.array([1.0, 4.0])

def loss(w):
    return np.mean((X @ w - y) ** 2)

grad = 2 / len(y) * X.T @ (X @ w - y)
print(round(loss(w), 3), np.round(grad, 3))
w_new = w - 0.05 * grad
print(np.round(w_new, 3), round(loss(w_new), 3))
`,
          question: "One gradient descent step with η = 0.05 on a two-weight model. What are the loss and gradient before, and the new weights and loss after?",
          expectedOutput: "1.0 [ 2. -1.]\n[ 1.9  -0.95] 0.781",
          hint: "Predictions are X @ w = [0, 5], so the errors are [−1, 1] and the loss is mean(1, 1) = 1. The gradient is (2/2) × Xᵀ[−1, 1] = [−1 + 3, −2 + 1] = [2, −1].",
          successMessage: "One step against the gradient cut the loss from 1.0 to 0.78. Training is this step, repeated thousands of times over mini-batches.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 67 · 14.14 – 14.15
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ml-l67-learning-rates-training",
    moduleId: "ml-m14-neural-networks",
    sectionId: SECTION_ID,
    order: 5,
    covers: ["14.14", "14.15"],
    title: "Learning Rates and Training Neural Networks",
    subtitle: "The most important setting, and a complete training loop that solves XOR",
    estimatedMinutes: 42,
    intro:
      "Everything comes together: initialise weights, run forward, compute the loss, backpropagate, update, repeat. You will train a network that solves XOR, the problem a single perceptron cannot, and see how the learning rate decides success.",

    atoms: [
      {
        id: "a-ml-learning-rates",
        title: "Learning rates",
        explain:
          "The LEARNING RATE η scales every update and is usually the most important hyperparameter. Too SMALL: the loss falls painfully slowly and training may stall. Too LARGE: updates overshoot, the loss oscillates or explodes to NaN. Just right: a fast, steady decrease. Typical starting values are 0.1 to 0.001 depending on the optimiser (Adam's default is 0.001). Practitioners use SCHEDULES that lower η during training (step decay, cosine annealing) and WARM-UP that raises it gradually at the start, and they diagnose η from the LOSS CURVE: a flat line, a smooth fall, or a jagged rise each tell their own story.",
        codeExercise: {
          language: PY,
          code: py`import numpy as np

def train(lr, steps=50):
    w = 5.0
    for _ in range(steps):
        w -= lr * 2 * (w - 1)          # gradient of (w - 1)²
    return (w - 1) ** 2

for lr in [0.001, 0.1, 0.9, 1.1]:
    print(lr, f"{train(lr):.3g}")
`,
          question: "Minimise (w − 1)² from w = 5 for 50 steps with four learning rates. What final loss does each give?",
          expectedOutput: "0.001 13.1\n0.1 3.26e-09\n0.9 3.26e-09\n1.1 1.33e+09",
          hint: "Each step multiplies the distance from the minimum by (1 − 2η). That factor is 0.998, 0.8, −0.8 and −1.2.",
          successMessage: "Too small barely moved; 0.1 and 0.9 converged (0.9 by bouncing across the minimum); 1.1 exploded. The factor (1 − 2η) explains all four.",
        },
      },
      {
        id: "a-ml-training-nn",
        title: "Training neural networks",
        explain:
          "A complete training loop: (1) INITIALISE weights with small random values (never all zeros: identical neurons would learn identical things; He initialisation, scaling by √(2/n_in), suits ReLU) and biases at zero; (2) for each epoch: FORWARD pass, LOSS, BACKWARD pass, UPDATE; (3) track training AND validation loss per epoch; (4) stop when validation loss stops improving (EARLY STOPPING) to avoid overfitting. Other guards against overfitting: weight decay (L2), dropout (randomly zeroing neurons during training) and more data. The test below trains on XOR with a tanh hidden layer and a sigmoid output.",
        codeChallenge: {
          task:
            "Write train_xor(hidden=4, lr=0.5, epochs=3000, seed=1) that trains a 2 → hidden → 1 network on the four XOR examples: W1 = rng.normal(0, 1, (2, hidden)), W2 = rng.normal(0, 1, (hidden, 1)) with rng = np.random.default_rng(seed), zero biases; hidden activation tanh, output sigmoid, binary cross-entropy loss. Each epoch: forward, record the loss, backward (dZ2 = (p − y) / 4; dZ1 = (dZ2 W2ᵀ) ⊙ (1 − A1²)), update all four parameters. Return (predict, losses), where predict(X) returns the 0/1 predictions (p ≥ 0.5) and losses is the list of losses.",
          starter: "import numpy as np\n\nX = np.array([[0, 0], [0, 1], [1, 0], [1, 1]], dtype=float)\ny = np.array([[0], [1], [1], [0]], dtype=float)\n\ndef train_xor(hidden=4, lr=0.5, epochs=3000, seed=1):\n    pass\n",
          sample: "predict(X) → [0, 1, 1, 0] after training; the loss falls from about 0.7 to under 0.05",
          tests: [
            {
              check: py`import numpy as np
predict, losses = train_xor()
assert len(losses) == 3000, "One loss per epoch. Got " + str(len(losses))
preds = np.asarray(predict(X)).ravel().tolist()
assert preds == [0, 1, 1, 0], "A hidden layer lets the network solve XOR. Got " + repr(preds)
assert losses[0] > 0.6 and losses[-1] < 0.05, "The loss should fall from about 0.7 to below 0.05. Got " + repr((losses[0], losses[-1]))
assert losses[-1] < losses[len(losses) // 2] < losses[0], "The loss keeps falling."
_, slow = train_xor(lr=0.001, epochs=300)
assert slow[-1] > 0.6, "With lr = 0.001 and 300 epochs, almost nothing is learned."`,
            },
          ],
          solution: py`import numpy as np

X = np.array([[0, 0], [0, 1], [1, 0], [1, 1]], dtype=float)
y = np.array([[0], [1], [1], [0]], dtype=float)

def train_xor(hidden=4, lr=0.5, epochs=3000, seed=1):
    rng = np.random.default_rng(seed)
    W1 = rng.normal(0, 1, (2, hidden))
    b1 = np.zeros(hidden)
    W2 = rng.normal(0, 1, (hidden, 1))
    b2 = np.zeros(1)
    losses = []
    for _ in range(epochs):
        A1 = np.tanh(X @ W1 + b1)
        p = 1 / (1 + np.exp(-(A1 @ W2 + b2)))
        losses.append(float(-np.mean(y * np.log(p) + (1 - y) * np.log(1 - p))))
        dZ2 = (p - y) / len(X)
        dW2 = A1.T @ dZ2
        db2 = dZ2.sum(axis=0)
        dZ1 = (dZ2 @ W2.T) * (1 - A1 ** 2)
        dW1 = X.T @ dZ1
        db1 = dZ1.sum(axis=0)
        W1 -= lr * dW1
        b1 -= lr * db1
        W2 -= lr * dW2
        b2 -= lr * db2

    def predict(inputs):
        A = np.tanh(inputs @ W1 + b1)
        return (1 / (1 + np.exp(-(A @ W2 + b2))) >= 0.5).astype(int).ravel()

    return predict, losses
`,
          hint: "Inside the loop: forward (tanh, then sigmoid), loss, then the gradients in the order dZ2, dW2, db2, dZ1, dW1, db1, then the four updates. predict can be a nested function that reuses the trained W1, b1, W2, b2.",
          successMessage: "XOR solved: the hidden layer bent the space so one straight line could separate the classes. Now try train_xor(seed=0): the same network from a different random start gets stuck in a local minimum, which is why initialisation matters and why practitioners train with several seeds.",
        },
      },
    ],

    task: {
      title: "Module 14 project: a neural network from scratch",
      intro:
        "Turn this module's pieces into a small neural network library in NumPy, then use it on a real dataset.",
      prompts: [
        "Write a Dense layer class with forward and backward methods, and ReLU, sigmoid and softmax activations.",
        "Train a network on XOR and plot its training loss curve; repeat with four learning rates on one chart.",
        "Use He initialisation for ReLU layers and show what happens if all weights start at zero.",
        "Train a 64 → 32 → 10 network on scikit-learn's load_digits (8 × 8 images) with mini-batches, and report test accuracy.",
        "Verify your backward pass with a numerical gradient check on a small network.",
        "Add early stopping on validation loss, and compare training and validation curves with and without it.",
      ],
      closing: "Writing backpropagation by hand for every new architecture would be slow and error-prone. Module 15 shows how frameworks like PyTorch compute gradients automatically.",
    },

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
