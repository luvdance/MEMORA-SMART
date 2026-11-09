/**
 * MACHINE LEARNING AND AI · MODULE 16 · CONVOLUTIONAL NEURAL NETWORKS
 *
 * Curriculum 16.1 – 16.10. Computer vision, images as numerical arrays,
 * preprocessing, convolution, filters and kernels, pooling, CNN
 * architecture, image classification, data augmentation and transfer
 * learning. The learner implements convolution and pooling in NumPy, computes
 * CNN shapes and parameter counts, classifies scikit-learn's digit images,
 * and writes augmentation functions; the PyTorch CNN and a pretrained
 * ResNet appear as reference code.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

export const SECTION_ID = "ml-s16-cnn";

const PY = "python";
const py = String.raw;

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 72 · 16.1 – 16.3
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ml-l72-images-as-data",
    moduleId: "ml-m16-cnn",
    sectionId: SECTION_ID,
    order: 1,
    covers: ["16.1", "16.2", "16.3"],
    title: "Computer Vision, Images as Numbers and Preprocessing",
    subtitle: "What a computer actually sees, and preparing it for a model",
    estimatedMinutes: 36,
    intro:
      "To a computer, a photograph of a cassava leaf is a grid of numbers. Computer vision is the craft of learning patterns in those grids, and it starts with understanding exactly how they are stored.",

    atoms: [
      {
        id: "a-ml-computer-vision",
        title: "Introduction to computer vision",
        explain:
          "COMPUTER VISION teaches machines to interpret images and video. Core tasks: IMAGE CLASSIFICATION (one label per image: \"leaf blight\"), OBJECT DETECTION (labelled boxes around each object: every car in a traffic photo), SEGMENTATION (a label for every pixel: which pixels are road), and others such as face recognition, optical character recognition (reading text and number plates) and pose estimation. Applications in Nigeria and beyond: crop disease diagnosis from phone photos, reading meters and documents, quality control on production lines, medical imaging, and traffic monitoring. Since 2012, CONVOLUTIONAL NEURAL NETWORKS have dominated the field, and Vision Transformers now compete with them.",
        decision: {
          scenario: "A logistics company wants software that finds every parcel in a warehouse camera image and draws a box around each one.",
          question: "Which computer vision task is this?",
          options: [
            { id: "a", text: "Image classification", whyWrong: "Classification gives one label for the whole image, not a box per parcel." },
            { id: "b", text: "Object detection", why: "Detection finds each object and its bounding box, however many there are." },
            { id: "c", text: "Optical character recognition", whyWrong: "OCR reads text; it does not locate parcels." },
            { id: "d", text: "Regression on pixel values", whyWrong: "Not a standard vision task for locating objects." },
          ],
          correct: "b",
          aftermath: "One label per image: classification. A box per object: detection. A label per pixel: segmentation.",
        },
      },
      {
        id: "a-ml-images-as-data",
        title: "Understanding digital images as numerical data",
        explain:
          "A digital image is a grid of PIXELS. A GREYSCALE image is a 2-D array of shape (height, width), each value a brightness, usually an integer from 0 (black) to 255 (white), stored as uint8. A COLOUR image has three CHANNELS, red, green and blue, giving a 3-D array of shape (height, width, 3) in most image libraries (PyTorch reorders it to (3, height, width)). A 224 × 224 colour photo holds 150,528 numbers. Resolution trades detail against computation. Crucially, nearby pixels are strongly related: an edge or a texture is a pattern across NEIGHBOURING pixels, which is the structure convolution exploits.",
        codeExercise: {
          language: PY,
          code: py`import numpy as np
from sklearn.datasets import load_digits

digits = load_digits()
img = digits.images[0]
print(digits.images.shape, img.dtype, img.min(), img.max())
print(digits.target[0])
print(img[2].astype(int).tolist())

rgb = np.zeros((4, 6, 3), dtype=np.uint8)
rgb[:, :, 0] = 255                     # full red everywhere
print(rgb.shape, rgb.size, rgb[0, 0].tolist())
`,
          question: "scikit-learn's digits are 8 × 8 greyscale images with brightness from 0 to 16. What do the shapes, the first label, the third row of the first image and a pure-red RGB array print?",
          expectedOutput: "(1797, 8, 8) float64 0.0 15.0\n0\n[0, 3, 15, 2, 0, 11, 8, 0]\n(4, 6, 3) 72 [255, 0, 0]",
          hint: "The first digit is a 0: its third row shows the two sides of the loop. A 4 × 6 RGB image holds 4 × 6 × 3 numbers.",
          successMessage: "A handwritten zero is 64 numbers; a tiny red image is 72. Everything in this module operates on arrays like these.",
        },
      },
      {
        id: "a-ml-image-preprocessing",
        title: "Image preprocessing",
        explain:
          "Before training, images are made consistent: RESIZED to one size (networks expect fixed input shapes), CROPPED (centre crop, or crops around the object), converted to the expected channel order and colour space, and NORMALISED: scaled from 0–255 to 0–1 by dividing by 255, then often standardised per channel with the dataset's mean and standard deviation (pretrained models expect the ImageNet statistics they were trained with). GREYSCALE conversion uses a weighted sum that matches human perception, about 0.299 R + 0.587 G + 0.114 B. The SAME preprocessing must be applied at prediction time, which is why it belongs in the pipeline.",
        codeChallenge: {
          task:
            "Write three preprocessing functions in NumPy: to_grey(rgb) converts an (H, W, 3) uint8 image to an (H, W) float array with 0.299 R + 0.587 G + 0.114 B; normalise(img) divides by 255 and returns float32; centre_crop(img, size) returns the central size × size region of an (H, W) or (H, W, C) image (start at (H − size) // 2 and (W − size) // 2).",
          starter: "import numpy as np\n\ndef to_grey(rgb):\n    pass\n\ndef normalise(img):\n    pass\n\ndef centre_crop(img, size):\n    pass\n",
          sample: "to_grey of a pure white pixel → 255.0; centre_crop of a 6 × 6 image to size 2 → its middle 2 × 2",
          tests: [
            {
              check: py`import numpy as np
rgb = np.zeros((2, 2, 3), dtype=np.uint8)
rgb[0, 0] = [255, 255, 255]
rgb[0, 1] = [255, 0, 0]
rgb[1, 0] = [0, 255, 0]
g = to_grey(rgb)
assert g.shape == (2, 2) and np.allclose(g, [[255.0, 76.245], [149.685, 0.0]]), "Weighted sum of the channels. Got " + repr(g)
n = normalise(np.array([[0, 128, 255]], dtype=np.uint8))
assert n.dtype == np.float32 and np.allclose(n, [[0, 128 / 255, 1]]), "Scale to [0, 1] as float32."
img = np.arange(36).reshape(6, 6)
assert centre_crop(img, 2).tolist() == [[14, 15], [20, 21]], "The middle 2 × 2 of a 6 × 6 image. Got " + repr(centre_crop(img, 2).tolist())
col = np.zeros((5, 7, 3))
assert centre_crop(col, 3).shape == (3, 3, 3), "Colour images keep their channels."
assert not uses("For"), "Use array operations."`,
            },
          ],
          solution: py`import numpy as np

def to_grey(rgb):
    return rgb[..., 0] * 0.299 + rgb[..., 1] * 0.587 + rgb[..., 2] * 0.114

def normalise(img):
    return (img / 255).astype(np.float32)

def centre_crop(img, size):
    top = (img.shape[0] - size) // 2
    left = (img.shape[1] - size) // 2
    return img[top:top + size, left:left + size]
`,
          hint: "rgb[..., 0] is the red channel for every pixel. For the crop, slice rows top:top + size and columns left:left + size; extra dimensions (channels) are kept automatically.",
          successMessage: "Grey conversion, normalisation and cropping are three of the transforms in every vision pipeline, and every one must be repeated identically at prediction time.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 73 · 16.4 – 16.6
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ml-l73-convolution-pooling",
    moduleId: "ml-m16-cnn",
    sectionId: SECTION_ID,
    order: 2,
    covers: ["16.4", "16.5", "16.6"],
    title: "Convolution, Kernels and Pooling",
    subtitle: "Sliding a small filter over an image, and summarising what it finds",
    estimatedMinutes: 42,
    intro:
      "Convolution is the operation that made computer vision work: a small grid of weights slides across the image, responding wherever its pattern appears. You will implement it, watch a kernel detect edges, and shrink the result with pooling.",

    atoms: [
      {
        id: "a-ml-convolution",
        title: "Convolution operations",
        explain:
          "A 2-D CONVOLUTION slides a small KERNEL (say 3 × 3) across the image; at each position it multiplies the kernel element-wise with the image patch underneath and sums the products into ONE output value. The result, a FEATURE MAP, is large wherever the patch resembles the kernel's pattern. (Deep learning libraries actually compute CROSS-CORRELATION, without flipping the kernel, and call it convolution; the learned weights make the distinction irrelevant.) With no padding (\"valid\"), an H × W input and k × k kernel give an (H − k + 1) × (W − k + 1) output. Two properties make it ideal for images: LOCAL connectivity (each output looks at a small neighbourhood) and WEIGHT SHARING (the same kernel everywhere, so a pattern is detected wherever it appears, with very few parameters).",
        codeChallenge: {
          task:
            "Write conv2d(image, kernel) for 2-D NumPy arrays with no padding and stride 1 (valid cross-correlation, as deep learning libraries compute it): output[i, j] = sum(image[i:i+kh, j:j+kw] × kernel). Return a float array of shape (H − kh + 1, W − kw + 1).",
          starter: "import numpy as np\n\ndef conv2d(image, kernel):\n    pass\n",
          sample: "conv2d(np.arange(16).reshape(4, 4), np.ones((2, 2))) → [[10, 14, 18], [26, 30, 34], [42, 46, 50]]",
          tests: [
            {
              check: py`import numpy as np
from scipy.signal import correlate2d
img = np.arange(16).reshape(4, 4)
out = conv2d(img, np.ones((2, 2)))
assert out.shape == (3, 3), "A 4 × 4 image and 2 × 2 kernel give a 3 × 3 output. Got " + repr(out.shape)
assert out.tolist() == [[10, 14, 18], [26, 30, 34], [42, 46, 50]], "Each output is the sum of a 2 × 2 patch. Got " + repr(out.tolist())
rng = np.random.default_rng(0)
I = rng.normal(size=(7, 9))
K = rng.normal(size=(3, 2))
assert np.allclose(conv2d(I, K), correlate2d(I, K, mode="valid")), "Must match scipy's valid cross-correlation (no kernel flip)."
assert "correlate" not in source and "convolve" not in source, "Write the sliding window yourself."`,
            },
          ],
          solution: py`import numpy as np

def conv2d(image, kernel):
    kh, kw = kernel.shape
    H, W = image.shape
    out = np.zeros((H - kh + 1, W - kw + 1))
    for i in range(out.shape[0]):
        for j in range(out.shape[1]):
            out[i, j] = np.sum(image[i:i + kh, j:j + kw] * kernel)
    return out
`,
          hint: "Two loops over output positions; at each, take the patch image[i:i + kh, j:j + kw], multiply element-wise by the kernel, and sum.",
          successMessage: "That sliding dot product is the convolutional layer's whole computation. A CNN learns the kernel values, and runs thousands of such kernels in parallel on a GPU.",
        },
      },
      {
        id: "a-ml-filters-kernels",
        title: "Filters and kernels",
        explain:
          "A KERNEL (filter) is a small matrix of weights, and its values decide what it detects. Hand-designed examples: a vertical-edge kernel such as [[1, 0, −1], [2, 0, −2], [1, 0, −1]] (Sobel) responds where brightness changes from left to right; a box blur averages; a sharpening kernel boosts the centre. A CNN LEARNS its kernels from data: early layers end up with edge and colour detectors very like these, middle layers combine them into textures and shapes, and deep layers respond to object parts such as eyes or leaf spots. A conv layer applies MANY kernels (say 32), producing 32 feature maps, one per learned pattern, stacked as output CHANNELS.",
        codeExercise: {
          language: PY,
          code: py`import numpy as np
from scipy.signal import correlate2d

image = np.zeros((5, 6))
image[:, 3:] = 9                         # dark left half, bright right half

vertical = np.array([[1, 0, -1], [2, 0, -2], [1, 0, -1]])
horizontal = vertical.T
print(correlate2d(image, vertical, mode="valid").astype(int).tolist())
print(np.abs(correlate2d(image, horizontal, mode="valid")).max())
`,
          question: "An image with a vertical boundary between dark and bright. What do the vertical-edge (Sobel) kernel's feature map and the horizontal-edge kernel's strongest response print?",
          expectedOutput: "[[0, -36, -36, 0], [0, -36, -36, 0], [0, -36, -36, 0]]\n0.0",
          hint: "The vertical kernel sums left columns minus right columns: zero in flat regions, large across the boundary. The horizontal kernel compares top and bottom rows, which never differ here.",
          successMessage: "The vertical kernel lights up exactly along the boundary; the horizontal one sees nothing. A CNN learns hundreds of such detectors on its own.",
        },
      },
      {
        id: "a-ml-pooling",
        title: "Pooling",
        explain:
          "POOLING shrinks feature maps by summarising small windows. MAX POOLING with a 2 × 2 window and stride 2 keeps the largest value in each non-overlapping 2 × 2 block, halving height and width (a quarter of the values) while keeping the strongest responses. AVERAGE pooling keeps the mean. Pooling reduces computation and parameters in later layers, makes the network tolerant of small shifts (a feature detected one pixel to the left still survives), and enlarges what each later neuron \"sees\". It has NO learnable parameters. GLOBAL average pooling reduces each whole feature map to one number, commonly used just before a network's final classifier.",
        codeChallenge: {
          task:
            "Write max_pool(x, size=2) for a 2-D array: return an array of shape (H // size, W // size) where each value is the maximum of a non-overlapping size × size block (stride = size), dropping any leftover rows or columns. Then write avg_pool(x, size=2) the same way with the mean.",
          starter: "import numpy as np\n\ndef max_pool(x, size=2):\n    pass\n\ndef avg_pool(x, size=2):\n    pass\n",
          sample: "max_pool(np.arange(16).reshape(4, 4)) → [[5, 7], [13, 15]]",
          tests: [
            {
              check: py`import numpy as np
x = np.arange(16).reshape(4, 4)
assert max_pool(x).tolist() == [[5, 7], [13, 15]], "The largest value in each 2 × 2 block. Got " + repr(max_pool(x).tolist())
assert avg_pool(x).tolist() == [[2.5, 4.5], [10.5, 12.5]], "The mean of each 2 × 2 block. Got " + repr(avg_pool(x).tolist())
odd = np.arange(35).reshape(5, 7)
assert max_pool(odd).shape == (2, 3), "Leftover rows and columns are dropped: 5 × 7 → 2 × 3."
assert max_pool(np.arange(36).reshape(6, 6), size=3).tolist() == [[14, 17], [32, 35]], "Window and stride of 3."`,
            },
          ],
          solution: py`import numpy as np

def _blocks(x, size):
    H, W = x.shape[0] // size * size, x.shape[1] // size * size
    return x[:H, :W].reshape(H // size, size, W // size, size)

def max_pool(x, size=2):
    return _blocks(x, size).max(axis=(1, 3))

def avg_pool(x, size=2):
    return _blocks(x, size).mean(axis=(1, 3))
`,
          hint: "Trim to a multiple of size, then reshape to (H/size, size, W/size, size): axes 1 and 3 run within each block, so .max(axis=(1, 3)) pools. Two loops over blocks also work.",
          successMessage: "A quarter of the values, the strongest responses kept, no parameters: pooling is cheap compression that also buys tolerance to small shifts.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 74 · 16.7 – 16.8
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ml-l74-cnn-classification",
    moduleId: "ml-m16-cnn",
    sectionId: SECTION_ID,
    order: 3,
    covers: ["16.7", "16.8"],
    title: "CNN Architecture and Image Classification",
    subtitle: "Stacking convolutions into a classifier, and training one on real images",
    estimatedMinutes: 40,
    intro:
      "A CNN stacks convolution, activation and pooling to turn pixels into ever more abstract features, then classifies them. This lesson computes how shapes and parameters flow through one, then classifies real handwritten digits.",

    atoms: [
      {
        id: "a-ml-cnn-architecture",
        title: "CNN architecture",
        explain:
          "A typical CNN repeats BLOCKS of [Conv → ReLU → (Conv → ReLU) → Pool], each block increasing the number of CHANNELS (32 → 64 → 128) while pooling shrinks the spatial size, then FLATTENS (or global-average-pools) and ends in Dense layers with a softmax. Shapes follow one formula: a conv with kernel k, padding p and stride s maps size n to ⌊(n + 2p − k) / s⌋ + 1; \"same\" padding p = (k − 1) / 2 with stride 1 keeps the size. A conv layer's parameters are (k × k × in_channels + 1) × out_channels, independent of the image size, which is why CNNs need far fewer parameters than dense networks on images. Landmark architectures: LeNet (1998), AlexNet (2012), VGG, ResNet (residual connections, 2015), EfficientNet.",
        example:
          "import torch.nn as nn\n\nmodel = nn.Sequential(\n    nn.Conv2d(1, 16, kernel_size=3, padding=1), nn.ReLU(), nn.MaxPool2d(2),   # 28 → 14\n    nn.Conv2d(16, 32, kernel_size=3, padding=1), nn.ReLU(), nn.MaxPool2d(2),  # 14 → 7\n    nn.Flatten(),                                                             # 32 × 7 × 7\n    nn.Linear(32 * 7 * 7, 10),\n)",
        codeChallenge: {
          task:
            "Write conv_out(n, k, p=0, s=1) returning ⌊(n + 2p − k) / s⌋ + 1, and conv_params(k, c_in, c_out) returning (k × k × c_in + 1) × c_out. Then write summarise(layers, size, channels) that walks a list of layer specs, each (\"conv\", k, p, c_out), (\"pool\", 2) or (\"dense\", units), starting from a size × size image with the given channels, and returns (output_shape, total_params): for convs update size and channels and add their params; pools halve size (floor) and add none; a dense layer flattens size × size × channels (or takes the previous dense units) into units and adds (inputs + 1) × units. output_shape is (size, size, channels) if the last layer is conv or pool, else (units,).",
          starter: "def conv_out(n, k, p=0, s=1):\n    pass\n\ndef conv_params(k, c_in, c_out):\n    pass\n\ndef summarise(layers, size, channels):\n    pass\n",
          sample: "the PyTorch model in the example: summarise([(\"conv\", 3, 1, 16), (\"pool\", 2), (\"conv\", 3, 1, 32), (\"pool\", 2), (\"dense\", 10)], 28, 1) → ((10,), 20490)",
          tests: [
            {
              check: py`assert conv_out(28, 3, p=1) == 28 and conv_out(28, 3) == 26 and conv_out(32, 5, s=2) == 14, "⌊(n + 2p − k) / s⌋ + 1."
assert conv_params(3, 1, 16) == 160 and conv_params(3, 16, 32) == 4640, "(k × k × c_in + 1) × c_out."
net = [("conv", 3, 1, 16), ("pool", 2), ("conv", 3, 1, 32), ("pool", 2), ("dense", 10)]
assert summarise(net, 28, 1) == ((10,), 160 + 4640 + (32 * 7 * 7 + 1) * 10), "Got " + repr(summarise(net, 28, 1))
assert summarise(net[:4], 28, 1) == ((7, 7, 32), 4800), "Without the dense layer the output is a 7 × 7 × 32 feature map."
assert summarise([("dense", 128), ("dense", 10)], 28, 1) == ((10,), 785 * 128 + 129 * 10), "A dense-only network on 28 × 28 inputs."
cnn = summarise(net, 28, 1)[1]
dense = summarise([("dense", 128), ("dense", 10)], 28, 1)[1]
assert cnn < dense / 4, "The CNN has far fewer parameters than a dense network on the same images."`,
            },
          ],
          solution: py`def conv_out(n, k, p=0, s=1):
    return (n + 2 * p - k) // s + 1

def conv_params(k, c_in, c_out):
    return (k * k * c_in + 1) * c_out

def summarise(layers, size, channels):
    total = 0
    units = None
    for layer in layers:
        kind = layer[0]
        if kind == "conv":
            _, k, p, c_out = layer
            total += conv_params(k, channels, c_out)
            size, channels = conv_out(size, k, p), c_out
        elif kind == "pool":
            size //= layer[1]
        else:
            inputs = units if units is not None else size * size * channels
            units = layer[1]
            total += (inputs + 1) * units
    shape = (units,) if units is not None else (size, size, channels)
    return shape, total
`,
          hint: "Track size, channels and (after the first dense layer) units as you loop. A dense layer's inputs are size × size × channels the first time, then the previous dense layer's units.",
          successMessage: "20,490 parameters for the CNN against over 100,000 for a dense network on the same 28 × 28 images, because a kernel is shared across every position.",
        },
      },
      {
        id: "a-ml-image-classification",
        title: "Image classification",
        explain:
          "IMAGE CLASSIFICATION assigns one label to each image. The workflow: collect and label images per class (balanced where possible), split into train, validation and test sets (keeping near-duplicate photos of the same object on one side), preprocess consistently, train, and evaluate with accuracy, per-class precision and recall, and a CONFUSION MATRIX showing which classes are confused. Small, centred images like scikit-learn's 8 × 8 digits can be classified well even without convolutions; realistic photos need CNNs, usually starting from a pretrained network (Lesson 75). Below, a classical model on flattened pixels already reads digits accurately.",
        codeChallenge: {
          task:
            "Write classify_digits() that loads load_digits(), flattens the images to 64 features, splits with train_test_split(test_size=0.25, random_state=0, stratify=y), fits make_pipeline(StandardScaler(), SVC(gamma=\"scale\")) and returns a dictionary {\"accuracy\": test accuracy rounded to 3, \"most_confused\": (true, predicted) — the pair of DIFFERENT digits with the largest off-diagonal count in the confusion matrix}.",
          starter: "import numpy as np\nfrom sklearn.datasets import load_digits\nfrom sklearn.model_selection import train_test_split\nfrom sklearn.pipeline import make_pipeline\nfrom sklearn.preprocessing import StandardScaler\nfrom sklearn.svm import SVC\nfrom sklearn.metrics import confusion_matrix\n\ndef classify_digits():\n    pass\n",
          sample: "{\"accuracy\": 0.98, \"most_confused\": (…, …)}",
          tests: [
            {
              check: py`import numpy as np
r = classify_digits()
assert r["accuracy"] > 0.95, "An SVM on scaled pixels should read over 95% of digits correctly. Got " + repr(r["accuracy"])
from sklearn.datasets import load_digits
from sklearn.model_selection import train_test_split
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.svm import SVC
from sklearn.metrics import confusion_matrix
d = load_digits()
Xtr, Xte, ytr, yte = train_test_split(d.images.reshape(len(d.images), -1), d.target, test_size=0.25, random_state=0, stratify=d.target)
m = make_pipeline(StandardScaler(), SVC(gamma="scale")).fit(Xtr, ytr)
cm = confusion_matrix(yte, m.predict(Xte))
assert r["accuracy"] == round(m.score(Xte, yte), 3), "Test accuracy rounded to 3."
np.fill_diagonal(cm, -1)
assert cm[r["most_confused"]] == cm.max(), "most_confused must be the largest off-diagonal cell (true, predicted). Got " + repr(r["most_confused"])
assert r["most_confused"][0] != r["most_confused"][1], "A pair of different digits."`,
            },
          ],
          solution: py`import numpy as np
from sklearn.datasets import load_digits
from sklearn.model_selection import train_test_split
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.svm import SVC
from sklearn.metrics import confusion_matrix

def classify_digits():
    digits = load_digits()
    X = digits.images.reshape(len(digits.images), -1)
    y = digits.target
    Xtr, Xte, ytr, yte = train_test_split(X, y, test_size=0.25, random_state=0, stratify=y)
    model = make_pipeline(StandardScaler(), SVC(gamma="scale")).fit(Xtr, ytr)
    cm = confusion_matrix(yte, model.predict(Xte))
    np.fill_diagonal(cm, -1)
    true, pred = np.unravel_index(np.argmax(cm), cm.shape)
    return {"accuracy": round(model.score(Xte, yte), 3), "most_confused": (int(true), int(pred))}
`,
          hint: "Flatten with images.reshape(len(images), -1). After confusion_matrix, blank the diagonal with np.fill_diagonal(cm, -1), then np.unravel_index(np.argmax(cm), cm.shape) gives (true, predicted).",
          successMessage: "Around 98% on tiny centred digits. The confusion matrix tells you where the remaining errors are, which is where to look for better features or more data.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 75 · 16.9 – 16.10
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ml-l75-augmentation-transfer",
    moduleId: "ml-m16-cnn",
    sectionId: SECTION_ID,
    order: 4,
    covers: ["16.9", "16.10"],
    title: "Data Augmentation and Transfer Learning",
    subtitle: "More training images for free, and borrowing a network trained on millions",
    estimatedMinutes: 38,
    intro:
      "Most real projects have hundreds of labelled images, not millions. Two techniques close the gap: augmentation multiplies your images with realistic variations, and transfer learning starts from a network that has already learned to see.",

    atoms: [
      {
        id: "a-ml-data-augmentation",
        title: "Data augmentation",
        explain:
          "DATA AUGMENTATION creates new training examples by applying realistic, label-preserving transformations to existing images: horizontal FLIPS (a leaf flipped is still the same disease; but a flipped \"6\" may become a \"9\"), small ROTATIONS, SHIFTS and crops, zoom, brightness and contrast changes, and added NOISE. The model sees a slightly different version of each image every epoch, which reduces overfitting and makes it robust to the variations it will meet in real photos. Augment the TRAINING set only, choose transformations that cannot change the label, and generate them on the fly during training (torchvision.transforms) rather than storing copies.",
        example:
          "from torchvision import transforms\n\ntrain_tf = transforms.Compose([\n    transforms.RandomResizedCrop(224, scale=(0.8, 1.0)),\n    transforms.RandomHorizontalFlip(),\n    transforms.RandomRotation(15),\n    transforms.ColorJitter(brightness=0.2, contrast=0.2),\n    transforms.ToTensor(),\n    transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225]),\n])\n# validation and test: resize, centre crop and normalise only",
        codeChallenge: {
          task:
            "Write three augmentation functions for 2-D images and one that applies them: hflip(img) mirrors left to right; shift(img, dx) moves the image dx pixels to the right (negative to the left), filling the vacated columns with 0; add_noise(img, std, rng) adds rng.normal(0, std, img.shape) and clips to [0, 1]. Then write augment(img, rng) that returns a list of four images: the original, its flip, a shift by rng.integers(-2, 3) pixels and a noisy copy with std 0.05 (in that order, drawing from rng in that order).",
          starter: "import numpy as np\n\ndef hflip(img):\n    pass\n\ndef shift(img, dx):\n    pass\n\ndef add_noise(img, std, rng):\n    pass\n\ndef augment(img, rng):\n    pass\n",
          sample: "shift([[1, 2, 3]], 1) → [[0, 1, 2]]",
          tests: [
            {
              check: py`import numpy as np
img = np.array([[1.0, 2.0, 3.0], [4.0, 5.0, 6.0]])
assert hflip(img).tolist() == [[3, 2, 1], [6, 5, 4]], "Mirror left to right."
assert shift(img, 1).tolist() == [[0, 1, 2], [0, 4, 5]] and shift(img, -1).tolist() == [[2, 3, 0], [5, 6, 0]], "Shift with zero fill. Got " + repr(shift(img, 1).tolist())
assert shift(img, 0).tolist() == img.tolist(), "A shift of 0 changes nothing."
rng = np.random.default_rng(0)
noisy = add_noise(np.full((10, 10), 0.98), 0.1, rng)
assert noisy.max() <= 1 and noisy.min() >= 0 and noisy.std() > 0, "Add noise, then clip to [0, 1]."
x = np.random.default_rng(1).uniform(0, 1, (8, 8))
out = augment(x, np.random.default_rng(5))
assert len(out) == 4 and all(o.shape == (8, 8) for o in out), "Four images of the same shape."
assert np.array_equal(out[0], x) and np.array_equal(out[1], x[:, ::-1]), "Original first, then its flip."
r = np.random.default_rng(5)
dx = r.integers(-2, 3)
assert np.array_equal(out[2], shift(x, dx)), "The shift uses rng.integers(-2, 3), drawn first."
assert np.allclose(out[3], np.clip(x + r.normal(0, 0.05, x.shape), 0, 1)), "Then the noise, with std 0.05."`,
            },
          ],
          solution: py`import numpy as np

def hflip(img):
    return img[:, ::-1]

def shift(img, dx):
    out = np.zeros_like(img)
    if dx > 0:
        out[:, dx:] = img[:, :-dx]
    elif dx < 0:
        out[:, :dx] = img[:, -dx:]
    else:
        out = img.copy()
    return out

def add_noise(img, std, rng):
    return np.clip(img + rng.normal(0, std, img.shape), 0, 1)

def augment(img, rng):
    dx = rng.integers(-2, 3)
    return [img, hflip(img), shift(img, dx), add_noise(img, 0.05, rng)]
`,
          hint: "hflip is img[:, ::-1]. For shift by dx > 0: out[:, dx:] = img[:, :-dx]; for dx < 0: out[:, :dx] = img[:, -dx:]. In augment, draw dx before the noise.",
          successMessage: "Every training image became four, all realistic. In practice transforms are random each epoch, so the model effectively never sees exactly the same image twice.",
        },
      },
      {
        id: "a-ml-transfer-learning",
        title: "Transfer learning",
        explain:
          "TRANSFER LEARNING reuses a network trained on a huge dataset (typically ImageNet: 1.2 million images in 1,000 classes) as the starting point for a new task. Its early and middle layers have learned general visual features (edges, textures, shapes) that transfer to almost any images. Two strategies: FEATURE EXTRACTION freezes the pretrained layers and trains only a new final classifier, which works with very little data; FINE-TUNING then also unfreezes some later layers and trains them with a small learning rate to adapt the features. With a pretrained ResNet or EfficientNet, a few hundred labelled photos per class can reach accuracy that would need tens of thousands of images from scratch, which is how most real vision projects, such as crop disease apps, are built.",
        example:
          "import torch.nn as nn\nfrom torchvision import models\n\nmodel = models.resnet18(weights=models.ResNet18_Weights.DEFAULT)   # pretrained on ImageNet\nfor p in model.parameters():\n    p.requires_grad = False                     # freeze the backbone\nmodel.fc = nn.Linear(model.fc.in_features, 4)   # new head: 4 cassava classes (trainable)\noptimizer = torch.optim.Adam(model.fc.parameters(), lr=1e-3)",
        codeExercise: {
          language: PY,
          code: py`resnet18_params = 11_689_512           # ImageNet-trained ResNet-18
old_head = 512 * 1000 + 1000            # its final layer: 512 features → 1000 classes
backbone = resnet18_params - old_head
new_head = 512 * 4 + 4                  # our task: 4 classes

print(backbone)
print(new_head)
print(f"{new_head / (backbone + new_head):.4%}")
`,
          question: "With a frozen ResNet-18 backbone and a new 4-class head, how many parameters are frozen, how many are trained, and what share is trainable?",
          expectedOutput: "11176512\n2052\n0.0184%",
          hint: "The backbone is everything except the old 513,000-parameter head. The new head has 512 × 4 weights plus 4 biases.",
          successMessage: "Only 2,052 of 11 million parameters are trained, about 0.02%. That is why transfer learning works with a few hundred images: almost everything has already been learned.",
        },
      },
    ],

    task: {
      title: "Module 16 project: an image classification system",
      intro:
        "Build a classifier for a real image task, such as crop disease (the public cassava or PlantVillage datasets), recyclable waste types, or Nigerian banknotes you photograph yourself, using PyTorch on your own machine or Google Colab.",
      prompts: [
        "Collect or download at least 200 images per class; split into train, validation and test, keeping near-duplicates together.",
        "Build a preprocessing pipeline (resize, crop, normalise) and an augmentation pipeline for training only.",
        "Train a small CNN from scratch and record its validation accuracy and learning curves.",
        "Use transfer learning with a pretrained ResNet-18: first feature extraction, then fine-tuning the last block, and compare.",
        "Report test accuracy, per-class precision and recall, and the confusion matrix; show five misclassified images and explain them.",
        "Estimate the model's size and prediction time, and say whether it could run on a mid-range Android phone.",
      ],
      closing: "Images have spatial structure; sales, sensor readings and sentences have ORDER. Module 17 turns to sequences and the networks built for them.",
    },

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
