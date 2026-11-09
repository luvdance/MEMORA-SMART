/**
 * MACHINE LEARNING AND AI · MODULE 15 · DEEP LEARNING WITH PYTORCH
 *
 * Curriculum 15.1 – 15.11. Deep learning frameworks, tensors, architectures,
 * models, losses and optimisers, training loops, validation and testing,
 * saving and loading, GPU acceleration and computational requirements.
 *
 * PyTorch is taught as the primary framework (as the curriculum recommends),
 * but it cannot run inside a browser. So each lesson shows the real PyTorch
 * code (in `example`), and the learner BUILDS the mechanism it relies on in
 * NumPy: automatic differentiation (a scalar autograd engine), Linear and
 * Sequential modules, SGD with momentum and Adam, a mini-batch training loop,
 * state-dict saving, and compute and memory estimates. Understanding the
 * mechanism is what makes the framework's behaviour predictable.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

export const SECTION_ID = "ml-s15-deep-learning";

const PY = "python";
const py = String.raw;

// A tiny NumPy "framework" shared by the later challenges' starters and checks.
const MINI = py`import numpy as np

class Linear:
    def __init__(self, n_in, n_out, rng):
        self.W = rng.normal(0, np.sqrt(2 / n_in), (n_in, n_out))
        self.b = np.zeros(n_out)

    def forward(self, X):
        self.X = X
        return X @ self.W + self.b

    def backward(self, grad):
        self.dW = self.X.T @ grad
        self.db = grad.sum(axis=0)
        return grad @ self.W.T

    def params(self):
        return [(self, "W", "dW"), (self, "b", "db")]
`;

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 68 · 15.1 – 15.3
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ml-l68-frameworks-tensors",
    moduleId: "ml-m15-deep-learning",
    sectionId: SECTION_ID,
    order: 1,
    covers: ["15.1", "15.2", "15.3"],
    title: "Deep Learning Frameworks and Tensors",
    subtitle: "What PyTorch does for you, starting with automatic gradients",
    estimatedMinutes: 42,
    intro:
      "In Module 14 you derived backpropagation by hand for one architecture. Frameworks like PyTorch do it for ANY architecture automatically, run it on GPUs, and provide ready-made layers. This lesson builds the core trick yourself: automatic differentiation.",

    atoms: [
      {
        id: "a-ml-dl-frameworks",
        title: "Introduction to deep learning frameworks",
        explain:
          "A DEEP LEARNING FRAMEWORK provides: TENSORS (n-dimensional arrays, like NumPy's, that can live on a GPU); AUTOMATIC DIFFERENTIATION (autograd: it records every operation in a computation graph during the forward pass, then applies the chain rule backwards to get every gradient); ready-made LAYERS, LOSSES and OPTIMISERS; data loading utilities; and GPU acceleration. PYTORCH (Meta, 2016) builds the graph dynamically as ordinary Python runs, which makes it easy to debug, and dominates research and much of industry. TENSORFLOW/KERAS (Google) is widely deployed, with strong mobile and serving tools. JAX (Google) offers NumPy-like functional programming with fast compilation. This course uses PyTorch as its primary framework. Below you build a scalar autograd engine: the same idea in 40 lines.",
        example:
          "import torch\n\nx = torch.tensor(2.0, requires_grad=True)\nw = torch.tensor(-3.0, requires_grad=True)\nb = torch.tensor(1.0, requires_grad=True)\ny = torch.tanh(x * w + b)\ny.backward()                 # autograd: chain rule through the recorded graph\nprint(x.grad, w.grad, b.grad)",
        codeChallenge: {
          task:
            "Complete a tiny autograd engine. A Value holds data, grad (starting at 0.0), the Values it was made from (_prev) and a _backward function. Implement __add__ and __mul__ (each must accept a plain number too, by wrapping it in a Value) and tanh(), each creating a new Value whose _backward adds the local gradient times out.grad to its inputs' grads. Then implement backward(): build a topological order of the graph, set self.grad = 1.0, and call each node's _backward in reverse order.",
          starter: "import math\n\nclass Value:\n    def __init__(self, data, _prev=()):\n        self.data = data\n        self.grad = 0.0\n        self._prev = _prev\n        self._backward = lambda: None\n\n    def __add__(self, other):\n        pass\n\n    def __mul__(self, other):\n        pass\n\n    def tanh(self):\n        pass\n\n    def backward(self):\n        pass\n",
          sample: "x = Value(2.0); w = Value(-3.0); b = Value(1.0); y = (x * w + b).tanh(); y.backward() → x.grad ≈ −0.0059",
          tests: [
            {
              check: py`import math
x, w, b = Value(2.0), Value(-3.0), Value(1.0)
y = (x * w + b).tanh()
assert abs(y.data - math.tanh(-5.0)) < 1e-12, "Forward: tanh(2 × −3 + 1). Got " + repr(y.data)
y.backward()
local = 1 - math.tanh(-5.0) ** 2
assert abs(x.grad - local * -3.0) < 1e-12 and abs(w.grad - local * 2.0) < 1e-12 and abs(b.grad - local) < 1e-12, "Chain rule: dy/dx = (1 − tanh²) × w, and so on. Got " + repr((x.grad, w.grad, b.grad))
a = Value(3.0)
c = a * a + a * 2
c.backward()
assert abs(a.grad - 8.0) < 1e-12, "a is used three times: gradients must ACCUMULATE (+=). d(a² + 2a)/da = 2a + 2 = 8. Got " + repr(a.grad)
d = Value(1.5)
e = d * 4 + 1
e.backward()
assert abs(d.grad - 4.0) < 1e-12 and abs(e.data - 7.0) < 1e-12, "Plain numbers must work on the right of + and *."`,
            },
          ],
          solution: py`import math

class Value:
    def __init__(self, data, _prev=()):
        self.data = data
        self.grad = 0.0
        self._prev = _prev
        self._backward = lambda: None

    def __add__(self, other):
        other = other if isinstance(other, Value) else Value(other)
        out = Value(self.data + other.data, (self, other))
        def _backward():
            self.grad += out.grad
            other.grad += out.grad
        out._backward = _backward
        return out

    def __mul__(self, other):
        other = other if isinstance(other, Value) else Value(other)
        out = Value(self.data * other.data, (self, other))
        def _backward():
            self.grad += other.data * out.grad
            other.grad += self.data * out.grad
        out._backward = _backward
        return out

    def tanh(self):
        t = math.tanh(self.data)
        out = Value(t, (self,))
        def _backward():
            self.grad += (1 - t ** 2) * out.grad
        out._backward = _backward
        return out

    def backward(self):
        order, seen = [], set()
        def build(v):
            if id(v) not in seen:
                seen.add(id(v))
                for p in v._prev:
                    build(p)
                order.append(v)
        build(self)
        self.grad = 1.0
        for v in reversed(order):
            v._backward()
`,
          hint: "In __mul__, out._backward does self.grad += other.data * out.grad and other.grad += self.data * out.grad. Use += everywhere: a value used twice receives two contributions. backward() visits children before parents (a depth-first topological sort), then runs _backward from the output down.",
          successMessage: "That is autograd: record the graph going forward, apply the chain rule coming back, accumulate where paths merge. PyTorch does exactly this, for tensors, on GPUs.",
        },
      },
      {
        id: "a-ml-tensors",
        title: "Tensors",
        explain:
          "A TENSOR is an n-dimensional array of one data type: a scalar (0-D), vector (1-D), matrix (2-D), or higher: a batch of colour images is a 4-D tensor of shape (batch, channels, height, width) in PyTorch's convention (N, C, H, W). PyTorch tensors behave almost exactly like NumPy arrays: the same indexing, broadcasting, and functions under similar names (x.shape, x.reshape, x.mean(dim=0), x @ y). The differences: a tensor has a DEVICE (CPU or CUDA GPU), can track gradients (requires_grad=True), and its default float type is float32 (half the memory of NumPy's float64, and what GPUs prefer). torch.from_numpy and tensor.numpy() convert between the two.",
        example:
          "import torch\n\nimages = torch.zeros(32, 3, 224, 224)       # (N, C, H, W)\nprint(images.shape, images.dtype, images.device)\n# torch.Size([32, 3, 224, 224]) torch.float32 cpu\nflat = images.reshape(32, -1)                # (32, 150528)\nmeans = images.mean(dim=(0, 2, 3))           # one mean per colour channel",
        codeExercise: {
          language: PY,
          code: py`import numpy as np

images = np.zeros((32, 3, 224, 224), dtype=np.float32)    # NCHW, like PyTorch
print(images.ndim, images.shape)
print(images.reshape(32, -1).shape)
print(images.mean(axis=(0, 2, 3)).shape)
print(images.nbytes / 1024 ** 2, "MB")
print(np.zeros(3).dtype, images.dtype)
`,
          question: "A batch of 32 RGB images, 224 × 224, as a float32 tensor. What are its dimensions, flattened shape, per-channel mean shape and memory in megabytes?",
          expectedOutput: "4 (32, 3, 224, 224)\n(32, 150528)\n(3,)\n18.375 MB\nfloat64 float32",
          hint: "3 × 224 × 224 = 150,528 values per image. Each float32 takes 4 bytes. NumPy's default dtype is float64.",
          successMessage: "One modest batch is already 18 MB in float32, and twice that in NumPy's default float64. Data types decide memory, which is why frameworks default to float32.",
        },
      },
      {
        id: "a-ml-creating-tensors",
        title: "Creating tensors",
        explain:
          "Tensors are created from data (torch.tensor([[1, 2], [3, 4]]), torch.from_numpy(array)), with constant fills (torch.zeros(2, 3), torch.ones, torch.full), with ranges (torch.arange(0, 10, 2), torch.linspace), randomly (torch.rand uniform [0, 1), torch.randn standard normal, torch.randint), and LIKE another tensor (torch.zeros_like(x)). Set dtype= (torch.float32, torch.int64), device= (\"cuda\"), and requires_grad=True for parameters. torch.manual_seed(42) makes random creation reproducible. Weight initialisation is tensor creation with a carefully chosen distribution: He (normal with std √(2/n_in)) for ReLU layers, Xavier/Glorot for tanh.",
        example:
          "import torch\ntorch.manual_seed(42)\n\nx = torch.tensor([[1.0, 2.0], [3.0, 4.0]])\nW = torch.randn(784, 128) * (2 / 784) ** 0.5    # He initialisation\nW.requires_grad_()\nb = torch.zeros(128, requires_grad=True)\nidx = torch.arange(0, 10, 2)                     # tensor([0, 2, 4, 6, 8])",
        codeChallenge: {
          task:
            "Write the NumPy equivalents of common tensor constructors: he_init(n_in, n_out, seed) returns an n_in × n_out float32 array drawn from np.random.default_rng(seed).normal(0, sqrt(2 / n_in), …); xavier_init(n_in, n_out, seed) uses a uniform distribution on [−limit, limit] with limit = sqrt(6 / (n_in + n_out)), also float32; and zeros_like(a) returns float32 zeros with a's shape.",
          starter: "import numpy as np\n\ndef he_init(n_in, n_out, seed):\n    pass\n\ndef xavier_init(n_in, n_out, seed):\n    pass\n\ndef zeros_like(a):\n    pass\n",
          sample: "he_init(784, 128, 0).std() → about 0.0505 (= √(2/784))",
          tests: [
            {
              check: py`import numpy as np
W = he_init(784, 128, seed=0)
assert W.shape == (784, 128) and W.dtype == np.float32, "Shape (784, 128), dtype float32. Got " + repr((W.shape, W.dtype))
assert abs(W.std() - np.sqrt(2 / 784)) < 0.002 and abs(W.mean()) < 0.002, "He initialisation: mean 0, std √(2/n_in). Got std " + str(W.std())
assert np.array_equal(he_init(784, 128, seed=0), W), "The same seed gives the same weights."
V = xavier_init(300, 100, seed=1)
lim = np.sqrt(6 / 400)
assert V.dtype == np.float32 and V.min() >= -lim and V.max() <= lim and V.max() > 0.9 * lim, "Xavier: uniform on [−√(6/(n_in+n_out)), +√(...)]."
z = zeros_like(np.ones((2, 5), dtype=np.int64))
assert z.shape == (2, 5) and z.dtype == np.float32 and not z.any(), "zeros_like keeps the shape, uses float32."`,
            },
          ],
          solution: py`import numpy as np

def he_init(n_in, n_out, seed):
    rng = np.random.default_rng(seed)
    return rng.normal(0, np.sqrt(2 / n_in), (n_in, n_out)).astype(np.float32)

def xavier_init(n_in, n_out, seed):
    limit = np.sqrt(6 / (n_in + n_out))
    rng = np.random.default_rng(seed)
    return rng.uniform(-limit, limit, (n_in, n_out)).astype(np.float32)

def zeros_like(a):
    return np.zeros(a.shape, dtype=np.float32)
`,
          hint: "rng.normal(0, np.sqrt(2 / n_in), (n_in, n_out)).astype(np.float32); rng.uniform(-limit, limit, (n_in, n_out)) for Xavier.",
          successMessage: "Initialisation scales are chosen so signals neither explode nor vanish as they pass through layers: He for ReLU, Xavier for tanh. Frameworks apply them by default.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 69 · 15.4 – 15.6
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ml-l69-models-losses-optimizers",
    moduleId: "ml-m15-deep-learning",
    sectionId: SECTION_ID,
    order: 2,
    covers: ["15.4", "15.5", "15.6"],
    title: "Architectures, Models, Losses and Optimizers",
    subtitle: "nn.Module, nn.Sequential, and the optimisers that update weights",
    estimatedMinutes: 42,
    intro:
      "In PyTorch a model is a class that owns its layers and defines its forward pass; an optimiser updates all its parameters in one call. Here you build the same structure, so you know what the framework is doing.",

    atoms: [
      {
        id: "a-ml-nn-architectures",
        title: "Building neural network architectures",
        explain:
          "An ARCHITECTURE is the arrangement of layers: their types, sizes, activations and connections. Common building blocks: Linear (dense), Conv2d (Module 16), LSTM/GRU (Module 17), attention (Module 18), plus normalisation (BatchNorm, LayerNorm) and DROPOUT for regularisation. Simple models are a straight stack, nn.Sequential; others branch and merge (residual connections add a layer's input to its output, letting very deep networks train). Design choices: depth and width (capacity), activation, and an output layer fitted to the task. Start small, check that the model can OVERFIT a tiny batch (proving it can learn), then scale up and regularise.",
        example:
          "import torch.nn as nn\n\nmodel = nn.Sequential(\n    nn.Linear(20, 64),\n    nn.ReLU(),\n    nn.Dropout(0.2),\n    nn.Linear(64, 32),\n    nn.ReLU(),\n    nn.Linear(32, 3),        # 3 classes: raw scores (logits)\n)\nprint(sum(p.numel() for p in model.parameters()))   # 3523",
        codeExercise: {
          language: PY,
          code: py`layers = [("Linear", 20, 64), ("ReLU",), ("Dropout",), ("Linear", 64, 32), ("ReLU",), ("Linear", 32, 3)]

total = 0
for layer in layers:
    if layer[0] == "Linear":
        _, n_in, n_out = layer
        total += n_in * n_out + n_out
print(total)
print(sum(1 for l in layers if l[0] == "Linear"), "trainable layers")
`,
          question: "Count the parameters of the PyTorch model in the example: activations and dropout have none. What does it print?",
          expectedOutput: "3523\n3 trainable layers",
          hint: "20 × 64 + 64, then 64 × 32 + 32, then 32 × 3 + 3.",
          successMessage: "3,523 parameters, all in the three Linear layers: exactly what sum(p.numel() for p in model.parameters()) reports in PyTorch.",
        },
      },
      {
        id: "a-ml-defining-models",
        title: "Defining models",
        explain:
          "In PyTorch a model subclasses nn.Module: __init__ creates the layers (which registers their parameters automatically), and forward(x) describes the computation; calling model(x) runs forward, and autograd records it. model.parameters() yields every trainable tensor for the optimiser. Below you write the NumPy equivalent: a Sequential container that calls each layer's forward in order, calls their backward methods in REVERSE order (the chain rule), and collects every layer's parameters. A ReLU layer has no parameters but still passes gradients backwards, multiplied by its local derivative.",
        example:
          "import torch.nn as nn\n\nclass ChurnNet(nn.Module):\n    def __init__(self, n_features):\n        super().__init__()\n        self.hidden = nn.Linear(n_features, 32)\n        self.out = nn.Linear(32, 1)\n\n    def forward(self, x):\n        return self.out(torch.relu(self.hidden(x)))   # logits\n\nmodel = ChurnNet(12)\nlogits = model(torch.randn(8, 12))   # shape (8, 1)",
        codeChallenge: {
          task:
            "The starter provides a Linear layer. Write a ReLU class with forward(X) (remember the input) and backward(grad) (grad times 1 where the input was positive) and params() returning []. Then write Sequential(*layers) with forward(X) calling each layer in order, backward(grad) calling each layer's backward in REVERSE order and returning the final gradient, and params() returning all layers' params concatenated.",
          starter: MINI + py`
class ReLU:
    pass

class Sequential:
    pass
`,
          sample: "net = Sequential(Linear(4, 8, rng), ReLU(), Linear(8, 2, rng)); net.forward(X).shape → (batch, 2)",
          tests: [
            {
              check: py`import numpy as np
rng = np.random.default_rng(0)
net = Sequential(Linear(4, 8, rng), ReLU(), Linear(8, 2, rng))
X = rng.normal(size=(5, 4))
out = net.forward(X)
assert out.shape == (5, 2), "Output shape (5, 2). Got " + repr(out.shape)
assert len(net.params()) == 4, "Two Linear layers × (W, b) = 4 parameter entries; ReLU has none."
expect = np.maximum(0, X @ net.params()[0][0].W + net.params()[0][0].b) @ net.params()[2][0].W + net.params()[2][0].b
assert np.allclose(out, expect), "forward must apply the layers in order."
g_in = net.backward(np.ones((5, 2)))
assert g_in.shape == (5, 4), "backward returns the gradient with respect to the input X."
first = net.params()[0][0]
h = 1e-6
num = np.zeros_like(first.W)
for i in range(first.W.shape[0]):
    for j in range(first.W.shape[1]):
        first.W[i, j] += h; up = net.forward(X).sum()
        first.W[i, j] -= 2 * h; dn = net.forward(X).sum()
        first.W[i, j] += h
        num[i, j] = (up - dn) / (2 * h)
net.forward(X)
net.backward(np.ones((5, 2)))
assert np.allclose(first.dW, num, atol=1e-5), "The first layer's dW must match the numerical gradient of sum(output): backward must run in reverse through the ReLU."`,
            },
          ],
          solution: MINI + py`
class ReLU:
    def forward(self, X):
        self.mask = X > 0
        return X * self.mask

    def backward(self, grad):
        return grad * self.mask

    def params(self):
        return []

class Sequential:
    def __init__(self, *layers):
        self.layers = list(layers)

    def forward(self, X):
        for layer in self.layers:
            X = layer.forward(X)
        return X

    def backward(self, grad):
        for layer in reversed(self.layers):
            grad = layer.backward(grad)
        return grad

    def params(self):
        return [p for layer in self.layers for p in layer.params()]
`,
          hint: "ReLU.forward stores self.mask = X > 0 and returns X * self.mask; backward returns grad * self.mask. Sequential keeps self.layers and loops forwards, then in reversed(...) for backward.",
          successMessage: "Your Sequential is PyTorch's nn.Sequential in miniature: modules composed in order, gradients flowing back through them in reverse.",
        },
      },
      {
        id: "a-ml-loss-optimizers",
        title: "Loss functions and optimizers",
        explain:
          "PyTorch losses: nn.MSELoss for regression; nn.BCEWithLogitsLoss for binary classification (it takes raw scores, LOGITS, and applies the sigmoid internally, which is more stable than a separate sigmoid); nn.CrossEntropyLoss for multiclass (logits plus integer labels; softmax inside). OPTIMISERS update parameters from their gradients: SGD (w −= η·g), SGD with MOMENTUM (v = μv + g; w −= η·v, which smooths and accelerates descent), and ADAM, which keeps running averages of the gradient (m) and its square (v), corrects their start-up bias, and divides each step by √v: w −= η·m̂ / (√v̂ + ε), giving every parameter its own adaptive step size. Adam with η = 0.001 is the common default.",
        example:
          "import torch.nn as nn, torch.optim as optim\n\nloss_fn = nn.CrossEntropyLoss()              # logits + integer labels\noptimizer = optim.Adam(model.parameters(), lr=1e-3)\n\nlogits = model(x_batch)\nloss = loss_fn(logits, y_batch)\noptimizer.zero_grad()      # clear old gradients (they accumulate!)\nloss.backward()            # autograd fills every p.grad\noptimizer.step()           # update every parameter",
        codeChallenge: {
          task:
            "Write two optimiser classes that update a list of (layer, param_name, grad_name) entries like those returned by params(). SGD(params, lr, momentum=0.0): step() keeps a velocity per parameter (v = momentum × v + grad) and does param -= lr × v. Adam(params, lr=0.001, b1=0.9, b2=0.999, eps=1e-8): step() increments t, updates m = b1·m + (1 − b1)·g and v = b2·v + (1 − b2)·g², computes m̂ = m / (1 − b1ᵗ) and v̂ = v / (1 − b2ᵗ), and does param -= lr × m̂ / (√v̂ + eps). Read and write parameters with getattr / setattr.",
          starter: "import numpy as np\n\nclass SGD:\n    pass\n\nclass Adam:\n    pass\n",
          sample: "minimising (w − 3)² with Adam(lr=0.1) for 300 steps reaches w ≈ 3",
          tests: [
            {
              check: py`import numpy as np
class P:
    def __init__(self, w):
        self.w = np.array([w], dtype=float)
        self.dw = np.zeros(1)
def run(opt_cls, steps, **kw):
    p = P(0.0)
    opt = opt_cls([(p, "w", "dw")], **kw)
    for _ in range(steps):
        p.dw = 2 * (p.w - 3)
        opt.step()
    return p.w[0]
assert abs(run(SGD, 100, lr=0.1) - 3) < 1e-6, "Plain SGD reaches the minimum at 3."
p = P(0.0)
opt = SGD([(p, "w", "dw")], lr=0.1, momentum=0.9)
p.dw = np.array([-6.0]); opt.step()
p.dw = np.array([-6.0]); opt.step()
assert abs(p.w[0] - (0.6 + 0.6 + 0.54)) < 1e-12, "Momentum: v₁ = −6, v₂ = 0.9 × −6 − 6 = −11.4, so w = 0.6 + 1.14. Got " + repr(p.w[0])
assert abs(run(Adam, 300, lr=0.1) - 3) < 1e-2, "Adam reaches about 3. Got " + repr(run(Adam, 300, lr=0.1))
p = P(0.0)
opt = Adam([(p, "w", "dw")], lr=0.1)
p.dw = np.array([-6.0]); opt.step()
assert abs(p.w[0] - 0.1) < 1e-6, "Adam's first step has size lr whatever the gradient's size (bias-corrected m̂/√v̂ = ±1). Got " + repr(p.w[0])`,
            },
          ],
          solution: py`import numpy as np

class SGD:
    def __init__(self, params, lr, momentum=0.0):
        self.params = params
        self.lr = lr
        self.momentum = momentum
        self.v = [0.0 for _ in params]

    def step(self):
        for i, (obj, name, gname) in enumerate(self.params):
            g = getattr(obj, gname)
            self.v[i] = self.momentum * self.v[i] + g
            setattr(obj, name, getattr(obj, name) - self.lr * self.v[i])

class Adam:
    def __init__(self, params, lr=0.001, b1=0.9, b2=0.999, eps=1e-8):
        self.params, self.lr, self.b1, self.b2, self.eps = params, lr, b1, b2, eps
        self.m = [0.0 for _ in params]
        self.v = [0.0 for _ in params]
        self.t = 0

    def step(self):
        self.t += 1
        for i, (obj, name, gname) in enumerate(self.params):
            g = getattr(obj, gname)
            self.m[i] = self.b1 * self.m[i] + (1 - self.b1) * g
            self.v[i] = self.b2 * self.v[i] + (1 - self.b2) * g ** 2
            m_hat = self.m[i] / (1 - self.b1 ** self.t)
            v_hat = self.v[i] / (1 - self.b2 ** self.t)
            setattr(obj, name, getattr(obj, name) - self.lr * m_hat / (np.sqrt(v_hat) + self.eps))
`,
          hint: "Keep one velocity (SGD) or one m and v (Adam) per parameter entry in lists. g = getattr(obj, gname); new value = getattr(obj, name) − lr × step; setattr(obj, name, new).",
          successMessage: "Adam's first step was exactly lr, whatever the gradient's size: it normalises each parameter's step. That adaptivity is why it is the default optimiser for deep networks.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 70 · 15.7 – 15.9
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ml-l70-training-loops",
    moduleId: "ml-m15-deep-learning",
    sectionId: SECTION_ID,
    order: 3,
    covers: ["15.7", "15.8", "15.9"],
    title: "Training Loops, Validation and Saving Models",
    subtitle: "The loop every PyTorch project contains, and keeping what it learns",
    estimatedMinutes: 42,
    intro:
      "Unlike scikit-learn's single fit call, PyTorch makes you write the training loop yourself. That is a feature: you control batching, validation, early stopping and checkpoints. This lesson writes that loop.",

    atoms: [
      {
        id: "a-ml-training-loops",
        title: "Training loops",
        explain:
          "The canonical PyTorch training loop: for each EPOCH, set model.train(); for each MINI-BATCH from a DataLoader (which shuffles and batches the data): forward pass, compute the loss, optimizer.zero_grad() (gradients ACCUMULATE by default, so they must be cleared), loss.backward(), optimizer.step(). Record the average training loss per epoch. Shuffling each epoch matters: without it the model sees batches in the same order every time and can learn that order. The same skeleton trains a two-layer network and a billion-parameter language model.",
        example:
          "from torch.utils.data import DataLoader, TensorDataset\n\nloader = DataLoader(TensorDataset(X_train, y_train), batch_size=32, shuffle=True)\nfor epoch in range(20):\n    model.train()\n    total = 0.0\n    for xb, yb in loader:\n        loss = loss_fn(model(xb), yb)\n        optimizer.zero_grad()\n        loss.backward()\n        optimizer.step()\n        total += loss.item() * len(xb)\n    print(epoch, total / len(loader.dataset))",
        codeChallenge: {
          task:
            "Using the Linear layer provided, write train_regression(X, y, epochs=60, batch_size=16, lr=0.05, seed=0) that fits a single Linear(n_features, 1) layer with mini-batch SGD and MSE loss. Use rng = np.random.default_rng(seed) for BOTH the layer's initialisation (create it first) and, each epoch, a fresh permutation of the rows. For each batch: forward, gradient of the MSE with respect to the output (2 × (pred − y) / batch length), backward, then W -= lr × dW and b -= lr × db. Return (layer, epoch_losses), with each epoch's loss the MSE over the full training set computed AFTER the epoch.",
          starter: MINI + py`
def train_regression(X, y, epochs=60, batch_size=16, lr=0.05, seed=0):
    pass
`,
          sample: "the loss falls from several hundred to the noise level, and the learned weights approach the true ones",
          tests: [
            {
              check: py`import numpy as np
rng = np.random.default_rng(7)
X = rng.normal(size=(200, 3))
true_w = np.array([[3.0], [-2.0], [0.5]])
y = X @ true_w + 4.0 + rng.normal(0, 0.1, (200, 1))
layer, losses = train_regression(X, y)
assert len(losses) == 60, "One loss per epoch. Got " + str(len(losses))
assert losses[-1] < 0.05 and losses[0] > losses[-1] * 10, "The loss should fall to the noise level (~0.01). Got first " + str(losses[0]) + ", last " + str(losses[-1])
assert np.allclose(layer.W, true_w, atol=0.05) and abs(layer.b[0] - 4.0) < 0.05, "The weights should approach [3, −2, 0.5] and the bias 4. Got " + repr((layer.W.ravel(), layer.b))
again = train_regression(X, y)[1]
assert np.allclose(again, losses), "The same seed must reproduce the same run."`,
            },
          ],
          solution: MINI + py`
def train_regression(X, y, epochs=60, batch_size=16, lr=0.05, seed=0):
    rng = np.random.default_rng(seed)
    layer = Linear(X.shape[1], 1, rng)
    losses = []
    for _ in range(epochs):
        order = rng.permutation(len(X))
        for start in range(0, len(X), batch_size):
            idx = order[start:start + batch_size]
            pred = layer.forward(X[idx])
            grad = 2 * (pred - y[idx]) / len(idx)
            layer.backward(grad)
            layer.W -= lr * layer.dW
            layer.b -= lr * layer.db
        losses.append(float(np.mean((layer.forward(X) - y) ** 2)))
    return layer, losses
`,
          hint: "Create the layer with rng first, then each epoch: order = rng.permutation(len(X)); loop start over range(0, len(X), batch_size); idx = order[start:start + batch_size]. After the batches, record the full-data MSE.",
          successMessage: "Shuffle, batch, forward, backward, step, record: the training loop you just wrote is, line for line, the PyTorch loop in the example.",
        },
      },
      {
        id: "a-ml-validation-testing",
        title: "Validation and testing",
        explain:
          "After each training epoch, evaluate on the VALIDATION set: switch to model.eval() (which turns OFF dropout and makes batch normalisation use its stored statistics) and wrap the loop in torch.no_grad() (no graph is recorded, saving memory and time). Track validation loss and the business metric per epoch; plotting both curves diagnoses training: both falling is healthy; validation rising while training falls is overfitting. Keep a CHECKPOINT of the weights from the epoch with the best validation score (early stopping), and evaluate that checkpoint ONCE on the test set at the very end. Forgetting model.eval() is a classic bug: dropout stays on and validation scores look randomly worse.",
        example:
          "best, best_state = float(\"inf\"), None\nfor epoch in range(100):\n    train_one_epoch(model, train_loader)\n    model.eval()\n    with torch.no_grad():\n        val_loss = sum(loss_fn(model(xb), yb).item() * len(xb) for xb, yb in val_loader) / n_val\n    if val_loss < best:\n        best, best_state = val_loss, copy.deepcopy(model.state_dict())\n    elif epoch - best_epoch > patience:\n        break\nmodel.load_state_dict(best_state)",
        codeExercise: {
          language: PY,
          code: py`train_loss = [0.90, 0.61, 0.45, 0.36, 0.30, 0.25, 0.21, 0.18, 0.15, 0.13]
val_loss   = [0.92, 0.66, 0.52, 0.47, 0.45, 0.46, 0.48, 0.51, 0.55, 0.60]

best_epoch = min(range(len(val_loss)), key=val_loss.__getitem__)
print("best epoch", best_epoch, "val", val_loss[best_epoch])

patience, wait, stopped = 2, 0, None
for epoch in range(1, len(val_loss)):
    wait = 0 if val_loss[epoch] < min(val_loss[:epoch]) else wait + 1
    if wait > patience:
        stopped = epoch
        break
print("stopped at", stopped)
`,
          question: "Training loss keeps falling while validation loss turns upwards. Which epoch is best, and when does early stopping with patience 2 stop?",
          expectedOutput: "best epoch 4 val 0.45\nstopped at 7",
          hint: "Validation loss is lowest at index 4. After that it fails to improve at epochs 5, 6 and 7; the third failure exceeds a patience of 2.",
          successMessage: "From epoch 5 the model was memorising: training loss fell, validation loss rose. Early stopping halted at epoch 7 and you would restore the epoch-4 checkpoint.",
        },
      },
      {
        id: "a-ml-saving-loading",
        title: "Saving and loading models",
        explain:
          "In PyTorch, save the STATE DICT, a dictionary mapping each parameter's name to its tensor: torch.save(model.state_dict(), \"model.pt\"). To load, rebuild the same architecture in code and call model.load_state_dict(torch.load(\"model.pt\")), then model.eval() before predicting. Saving the whole model object with pickle is fragile (it breaks when code moves). For resuming training, also save the optimiser's state, the epoch and the best score in a CHECKPOINT. For deployment, models are often exported to a portable format such as ONNX or TorchScript. Always record what goes with the weights: the preprocessing, class names and library versions (Module 21).",
        example:
          "torch.save(model.state_dict(), \"churn_net.pt\")\n\nmodel = ChurnNet(12)                       # same architecture, fresh weights\nmodel.load_state_dict(torch.load(\"churn_net.pt\"))\nmodel.eval()\n\ntorch.save({\"epoch\": epoch, \"model\": model.state_dict(),\n            \"optimizer\": optimizer.state_dict(), \"best_val\": best}, \"checkpoint.pt\")",
        codeChallenge: {
          task:
            "Write state_dict(layers) that returns a dictionary {\"0.W\": …, \"0.b\": …, \"1.W\": …} of COPIES of each layer's W and b, keyed by the layer's position. Write save(layers, path) that writes it with np.savez(path, **state), and load_into(layers, path) that reads it with np.load and copies each array back into the matching layer (raising KeyError if a key is missing).",
          starter: MINI + py`
def state_dict(layers):
    pass

def save(layers, path):
    pass

def load_into(layers, path):
    pass
`,
          sample: "a freshly built network loaded from the file makes exactly the same predictions as the saved one",
          tests: [
            {
              check: py`import numpy as np
rng = np.random.default_rng(0)
trained = [Linear(3, 4, rng), Linear(4, 1, rng)]
sd = state_dict(trained)
assert sorted(sd) == ["0.W", "0.b", "1.W", "1.b"], "Keys like 0.W and 0.b. Got " + repr(sorted(sd))
sd["0.W"][0, 0] = 999
assert trained[0].W[0, 0] != 999, "state_dict must hold COPIES, not the live arrays."
save(trained, "model.npz")
fresh = [Linear(3, 4, np.random.default_rng(99)), Linear(4, 1, np.random.default_rng(99))]
X = rng.normal(size=(5, 3))
def run(layers):
    out = X
    for l in layers:
        out = l.forward(out)
    return out
assert not np.allclose(run(fresh), run(trained)), "Before loading, the fresh network differs."
load_into(fresh, "model.npz")
assert np.allclose(run(fresh), run(trained)), "After loading, predictions must be identical."`,
            },
          ],
          solution: MINI + py`
def state_dict(layers):
    state = {}
    for i, layer in enumerate(layers):
        state[f"{i}.W"] = layer.W.copy()
        state[f"{i}.b"] = layer.b.copy()
    return state

def save(layers, path):
    np.savez(path, **state_dict(layers))

def load_into(layers, path):
    data = np.load(path)
    for i, layer in enumerate(layers):
        layer.W = data[f"{i}.W"].copy()
        layer.b = data[f"{i}.b"].copy()
`,
          hint: "Build the dictionary with f\"{i}.W\" keys and .copy(). np.savez(path, **state) saves it; np.load(path)[key] reads an array back.",
          successMessage: "Same architecture plus saved state equals the same model: exactly the state_dict pattern PyTorch uses.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 71 · 15.10 – 15.11
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ml-l71-gpus-compute",
    moduleId: "ml-m15-deep-learning",
    sectionId: SECTION_ID,
    order: 4,
    covers: ["15.10", "15.11"],
    title: "GPU Acceleration and Computational Requirements",
    subtitle: "Why deep learning runs on GPUs, and how much memory and compute a model needs",
    estimatedMinutes: 36,
    intro:
      "Deep learning became practical when GPUs made matrix multiplication massively parallel. Knowing how to estimate a model's memory and compute tells you whether it fits on your laptop, a free Colab GPU, or needs a cluster.",

    atoms: [
      {
        id: "a-ml-gpu-acceleration",
        title: "GPU acceleration",
        explain:
          "A CPU has a few powerful cores built for sequential logic; a GPU has thousands of simpler cores built to do the SAME arithmetic on many numbers at once, which is exactly what matrix multiplication and convolution are. Training a network on a GPU is often 10 to 100 times faster. In PyTorch: device = \"cuda\" if torch.cuda.is_available() else \"cpu\"; model.to(device); and every batch .to(device), since model and data must be on the SAME device (a common error). Free GPUs are available on Google Colab and Kaggle Notebooks. Practical speed-ups: larger batches (to fill the GPU), MIXED PRECISION (float16/bfloat16 arithmetic, roughly halving memory) and keeping data loading from becoming the bottleneck.",
        example:
          "import torch\n\ndevice = \"cuda\" if torch.cuda.is_available() else \"cpu\"\nmodel = ChurnNet(12).to(device)\nfor xb, yb in loader:\n    xb, yb = xb.to(device), yb.to(device)      # data must be on the same device\n    with torch.autocast(device_type=device, dtype=torch.bfloat16):   # mixed precision\n        loss = loss_fn(model(xb), yb)",
        codeExercise: {
          language: PY,
          code: py`def matmul_flops(m, n, p):
    return 2 * m * n * p          # one multiply and one add per term

flops = matmul_flops(32, 784, 128)
print(f"{flops:,}")

cpu, gpu = 1e11, 2e13            # rough sustained FLOP/s: laptop CPU, mid-range GPU
step = 3 * flops                 # forward + backward is about 3 × forward
print(round(step / cpu * 1e6, 1), "µs on CPU")
print(round(step / gpu * 1e6, 3), "µs on GPU")
`,
          question: "A layer multiplies a (32, 784) batch by a (784, 128) weight matrix. How many floating-point operations is that, and roughly how long does a training step take on a CPU and on a GPU?",
          expectedOutput: "6,422,528\n192.7 µs on CPU\n0.963 µs on GPU",
          hint: "2 × 32 × 784 × 128. Training (forward and backward) costs about three times the forward pass.",
          successMessage: "A 200-fold difference for one layer. Multiply by millions of steps and billions of parameters and it is the difference between hours and years.",
        },
      },
      {
        id: "a-ml-compute-requirements",
        title: "Understanding computational requirements",
        explain:
          "Estimate before you train. PARAMETER MEMORY: parameters × bytes per value (4 for float32, 2 for float16). TRAINING needs much more: gradients (another copy) and optimiser state (Adam keeps m and v: two more copies), so about 4 × the parameter memory, PLUS the ACTIVATIONS stored for backpropagation, which grow with batch size and often dominate. INFERENCE needs only the parameters and one batch's activations. COMPUTE: a common rule of thumb for training a dense network is about 6 × parameters × training examples (tokens, for language models) floating-point operations. These estimates decide hardware, batch size and cost: a 7-billion-parameter model needs 14 GB just to hold its weights in float16.",
        codeChallenge: {
          task:
            "Write memory_estimate(n_params, dtype_bytes=4, optimizer=\"adam\") returning a dictionary of megabytes (1 MB = 1024² bytes), rounded to 1: \"weights\" (parameters × bytes), \"training\" (weights + gradients + optimiser state, where \"adam\" stores 2 extra copies, \"sgd_momentum\" 1 and \"sgd\" 0). Then write training_flops(n_params, n_examples) returning 6 × n_params × n_examples.",
          starter: "def memory_estimate(n_params, dtype_bytes=4, optimizer=\"adam\"):\n    pass\n\ndef training_flops(n_params, n_examples):\n    pass\n",
          sample: "memory_estimate(109386) → {\"weights\": 0.4, \"training\": 1.7}",
          tests: [
            {
              check: py`assert memory_estimate(109386) == {"weights": 0.4, "training": 1.7}, "The 784-128-64-10 network: weights 0.42 MB; training = weights × 4 with Adam. Got " + repr(memory_estimate(109386))
m = memory_estimate(7_000_000_000, dtype_bytes=2)
assert m["weights"] == 13351.4 and m["training"] == 53405.8, "A 7B-parameter model in float16: about 13 GB of weights, about 52 GB to train with Adam (before activations). Got " + repr(m)
assert memory_estimate(1_000_000, optimizer="sgd")["training"] == 7.6, "SGD keeps only weights and gradients: 2 copies."
assert memory_estimate(1_000_000, optimizer="sgd_momentum")["training"] == 11.4, "Momentum adds one velocity copy: 3 copies."
assert training_flops(109386, 60000) == 6 * 109386 * 60000, "6 × parameters × examples."`,
            },
          ],
          solution: py`EXTRA = {"adam": 2, "sgd_momentum": 1, "sgd": 0}

def memory_estimate(n_params, dtype_bytes=4, optimizer="adam"):
    mb = 1024 ** 2
    weights = n_params * dtype_bytes
    copies = 2 + EXTRA[optimizer]
    return {"weights": round(weights / mb, 1), "training": round(weights * copies / mb, 1)}

def training_flops(n_params, n_examples):
    return 6 * n_params * n_examples
`,
          hint: "Training copies = weights + gradients (2) + optimiser extras (Adam 2, momentum 1, SGD 0). Divide bytes by 1024 ** 2 for megabytes.",
          successMessage: "Your digit network trains in under 2 MB; a 7-billion-parameter model needs over 50 GB before counting activations. That arithmetic is why large models need data-centre GPUs, and why tricks like mixed precision matter.",
        },
      },
    ],

    task: {
      title: "Module 15 project: your own framework, then PyTorch",
      intro:
        "Combine this module's pieces into a small NumPy deep learning framework, then rebuild the same model in PyTorch on your own machine or Google Colab and compare.",
      prompts: [
        "Package Linear, ReLU, Sequential, an MSE and a softmax cross-entropy loss, SGD with momentum and Adam into one module.",
        "Train a classifier on scikit-learn's load_digits with mini-batches, validation tracking, early stopping and a saved best checkpoint.",
        "Extend your Value autograd engine with subtraction, powers and ReLU, and train a tiny neuron with it.",
        "Rebuild the same digits model in PyTorch (nn.Sequential, CrossEntropyLoss, Adam, DataLoader) and confirm similar accuracy.",
        "Time an epoch on CPU and, in Colab, on a GPU; report the speed-up and explain it.",
        "Estimate the memory and training FLOPs of your model, and of a model ten times wider, before running them.",
      ],
      closing: "Dense layers treat an image as a flat list of pixels and ignore that neighbouring pixels belong together. Module 16 introduces convolution, the layer built for images.",
    },

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
