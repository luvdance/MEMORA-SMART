/**
 * FINAL CERTIFICATION EXAM — MACHINE LEARNING AND ARTIFICIAL INTELLIGENCE
 *
 * The test specification, in the same shape as the other blueprints, so the
 * assembler and grader treat every exam identically: the SHAPE of every paper
 * is fixed here, the CONTENT is drawn per candidate from ./bank.js.
 *
 * Six domains follow the course's five months (Month 3, the classical
 * algorithms, and Month 5, production, are large enough to stand alone;
 * Month 1 is split into foundations and mathematics). Every `predict` item is
 * RUN in CPython by `npm run validate:content` and `scripts/mlCheck.mjs` and
 * its stated output compared with what Python actually prints.
 */

export const DOMAINS = [
  {
    id: "m1-foundations",
    name: "AI foundations and Python for ML",
    short: "Foundations",
    items: { core: 4, advanced: 1 },
    covers: [
      "AI, ML, deep learning and generative AI; types of learning",
      "The ML lifecycle; features, labels, predictions and baselines",
      "Python data structures, functions, files and exceptions",
      "Classes and the scikit-learn estimator interface",
    ],
    review: ["ml-m1-intro", "ml-m2-python"],
  },
  {
    id: "m2-maths",
    name: "Mathematics for ML and NumPy",
    short: "Maths",
    items: { core: 4, advanced: 1 },
    covers: [
      "Vectors, matrices, products, shapes and eigenvectors",
      "Descriptive statistics, distributions, correlation and Bayes' theorem",
      "Derivatives, gradients and gradient descent",
      "NumPy arrays, broadcasting and axis operations",
    ],
    review: ["ml-m3-maths", "ml-m4-numpy"],
  },
  {
    id: "m3-data",
    name: "Data preparation, EDA and visualisation",
    short: "Data",
    items: { core: 4, advanced: 1 },
    covers: [
      "pandas selection, cleaning, grouping and merging",
      "Exploratory analysis, outliers and confounders",
      "Choosing and reading charts",
      "Encoding, scaling, imbalance, splitting and leakage",
    ],
    review: ["ml-m5-pandas", "ml-m6-eda", "ml-m7-visualization", "ml-m8-preprocessing"],
  },
  {
    id: "m4-classical",
    name: "Classical machine learning",
    short: "Classical ML",
    items: { core: 4, advanced: 1 },
    covers: [
      "Overfitting, bias-variance, losses and baselines",
      "Regression, regularisation and regression metrics",
      "Classification algorithms and classification metrics",
      "Clustering, PCA, cross-validation, tuning and pipelines",
    ],
    review: ["ml-m9-models", "ml-m10-regression", "ml-m11-classification", "ml-m12-unsupervised", "ml-m13-model-selection"],
  },
  {
    id: "m5-deep",
    name: "Deep learning, vision, sequences and NLP",
    short: "Deep learning",
    items: { core: 4, advanced: 1 },
    covers: [
      "Neurons, activations, backpropagation and training",
      "Frameworks, optimisers and compute requirements",
      "Convolution, pooling, CNNs and transfer learning",
      "RNNs, forecasting, text representation, attention and Transformers",
    ],
    review: ["ml-m14-neural-networks", "ml-m15-deep-learning", "ml-m16-cnn", "ml-m17-rnn", "ml-m18-nlp"],
  },
  {
    id: "m6-production",
    name: "Deployment, MLOps, responsible ML and applications",
    short: "Production",
    items: { core: 4, advanced: 1 },
    covers: [
      "Serving models with validated APIs; ML application security",
      "Versioning, monitoring, drift and retraining",
      "Fairness, privacy, explainability and ML security",
      "Recommenders, fraud, search, LLMs and the capstone",
    ],
    review: ["ml-m19-deployment", "ml-m20-app-development", "ml-m21-mlops", "ml-m22-responsible", "ml-m23-applications", "ml-m24-capstone"],
  },
];

export const BLUEPRINT = {
  id: "mst-ml-final",
  version: "2026.1",
  courseId: "machine-learning",
  courseCode: "ML-101",
  courseTitle: "Machine Learning and Artificial Intelligence",
  title: "Memora Smart Certification — Machine Learning and Artificial Intelligence",
  subtitle: "Foundations · Maths · Data · Classical ML · Deep learning · Production",
  /** What the briefing page says about the kinds of question on the paper. */
  briefingNote:
    "Some questions show a short Python program (plain Python, NumPy, pandas or scikit-learn) and ask exactly what it prints: every one has been run, so the expected output is what really happens. The rest test judgement: choosing metrics and models, spotting leakage and bias, and designing systems that work in production.",

  requiresModules: [
    "ml-m1-intro",
    "ml-m2-python",
    "ml-m3-maths",
    "ml-m4-numpy",
    "ml-m5-pandas",
    "ml-m6-eda",
    "ml-m7-visualization",
    "ml-m8-preprocessing",
    "ml-m9-models",
    "ml-m10-regression",
    "ml-m11-classification",
    "ml-m12-unsupervised",
    "ml-m13-model-selection",
    "ml-m14-neural-networks",
    "ml-m15-deep-learning",
    "ml-m16-cnn",
    "ml-m17-rnn",
    "ml-m18-nlp",
    "ml-m19-deployment",
    "ml-m20-app-development",
    "ml-m21-mlops",
    "ml-m22-responsible",
    "ml-m23-applications",
    "ml-m24-capstone",
  ],

  domains: DOMAINS,
  passMark: 70,
  domainMinimum: 50,
  durationMinutes: 75,
  attemptLimit: null,
  /** No case studies on this paper: each question stands alone. */
  caseRange: { min: 0, max: 0 },

  certificate: {
    issuer: "Memora Smart Technologies",
    name: "Machine Learning and Artificial Intelligence",
    covers: "Python & mathematics • Data preparation • Classical ML • Deep learning & NLP • Deployment & MLOps • Responsible AI",
    idFormat: "MST-CERT-2026-000001",
  },
};

export default BLUEPRINT;
