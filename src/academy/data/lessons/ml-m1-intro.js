/**
 * MACHINE LEARNING AND AI · MODULE 1 · INTRODUCTION TO AI AND MACHINE LEARNING
 *
 * Curriculum 1.1 – 1.10. What AI, machine learning, deep learning and
 * generative AI are, how they differ from each other and from data science,
 * how a computer "learns" from examples, the four types of learning, the
 * development lifecycle, and the vocabulary of datasets.
 *
 * The module is conceptual, but every idea is made concrete in a few lines
 * of Python: a threshold LEARNED from examples instead of written by hand, a
 * next-word generator that is generative AI in miniature, and a reward-driven
 * agent. Every stated output is executed by `node scripts/mlCheck.mjs`.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

export const SECTION_ID = "ml-s1-intro";

const PY = "python";
const py = String.raw;

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 1 · 1.1 – 1.4
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ml-l1-what-is-ai",
    moduleId: "ml-m1-intro",
    sectionId: SECTION_ID,
    order: 1,
    covers: ["1.1", "1.2", "1.3", "1.4"],
    title: "AI, Machine Learning, Deep Learning and Generative AI",
    subtitle: "Four terms everyone uses, and what each one actually means",
    estimatedMinutes: 30,
    intro:
      "Artificial intelligence, machine learning, deep learning and generative AI are not four competing technologies. Each is a part of the one before it, and by the end of this lesson you will have written a tiny example of two of them.",

    atoms: [
      {
        id: "a-ml-what-is-ai",
        title: "What is artificial intelligence?",
        explain:
          "ARTIFICIAL INTELLIGENCE (AI) is the broad goal of making computers perform tasks that would need intelligence if a person did them: recognising speech, translating, recommending, planning a route, detecting fraud. AI says nothing about HOW. Early AI was mostly hand-written rules (\"if the transaction is over ₦500,000 and abroad, flag it\"), called symbolic or rule-based AI, and chess programs that searched millions of moves. Rules work when an expert can write them down. They fail when the task is too fuzzy to describe: nobody can write the rules for recognising a face or understanding a sentence. That gap is why machine learning took over.",
        why:
          "Most products called \"AI\" today are machine learning systems. Knowing that AI is the goal and ML is one way of reaching it keeps you precise when a client, an employer or a news article uses the words loosely.",
        decision: {
          scenario:
            "A bank's system flags a transfer because a developer wrote: if amount > 500000 and country != \"NG\": flag. Nobody trained it on data.",
          question: "Is this system artificial intelligence, machine learning, both, or neither?",
          options: [
            { id: "a", text: "Machine learning, because it makes a decision", whyWrong: "Making a decision is not learning. A developer wrote the rule; nothing was learned from data." },
            { id: "b", text: "Rule-based AI, but not machine learning", why: "It performs a task that needs judgement, which is AI in the broad sense, but its rule was written by a person, not learned from examples." },
            { id: "c", text: "Deep learning", whyWrong: "Deep learning is a kind of machine learning using neural networks. There is no learning here at all." },
            { id: "d", text: "Generative AI", whyWrong: "Generative AI produces new content such as text or images. This system only flags transfers." },
          ],
          correct: "b",
          aftermath: "AI is the goal. Machine learning is the approach where the rule comes from data instead of from a programmer.",
        },
      },
      {
        id: "a-ml-what-is-ml",
        title: "What is machine learning?",
        explain:
          "MACHINE LEARNING (ML) is the part of AI in which a program improves at a task by learning from DATA instead of being given explicit rules. Arthur Samuel described it in 1959 as giving computers \"the ability to learn without being explicitly programmed\". In traditional programming you supply the rules and the data, and the computer produces answers. In machine learning you supply the data AND the answers (examples), and the computer produces the rules, called a MODEL. Below, nobody tells the program what score passes. It looks at past students and works the cut-off out for itself.",
        analogy:
          "A new loan officer is not handed a rulebook. They study hundreds of past applications and what happened to each, and slowly develop a feel for who repays. Machine learning does the same, with arithmetic instead of intuition.",
        codeExercise: {
          language: PY,
          code: py`hours = [1, 2, 3, 4, 5, 6, 7, 8]
passed = [False, False, False, True, False, True, True, True]

# Learn the cut-off: try every possible threshold, keep the one that
# explains the most past students correctly.
best, best_correct = None, -1
for t in hours:
    correct = sum((h >= t) == p for h, p in zip(hours, passed))
    if correct > best_correct:
        best, best_correct = t, correct

print("learned threshold:", best)
print("correct on past data:", best_correct, "of", len(hours))
`,
          question:
            "The program tries each value in hours as a cut-off and keeps the one that classifies the most past students correctly. What does it print?",
          expectedOutput: "learned threshold: 4\ncorrect on past data: 7 of 8",
          hint: "With threshold 4, students with 4+ hours are predicted to pass. Only the student with 5 hours (who failed) is wrong. Does any threshold get all 8 right?",
          successMessage:
            "The rule \"study 4 or more hours\" was never written by you: it was learned from examples. And it is not perfect on the data it learned from, which is normal. Real data is noisy.",
        },
      },
      {
        id: "a-ml-deep-learning",
        title: "What is deep learning?",
        explain:
          "DEEP LEARNING is the part of machine learning that uses ARTIFICIAL NEURAL NETWORKS with many layers (hence \"deep\"). Each layer transforms its input a little, and stacked layers learn increasingly abstract features by themselves: in an image, the first layers detect edges, later ones shapes, the last ones whole objects. Classical ML usually needs a person to choose the features (\"number of rooms\", \"distance to the road\"); deep learning learns its own features from raw pixels, audio or text. The price is data and compute: deep networks need far more examples and processing power. Deep learning is why speech recognition, image recognition and translation became good after about 2012.",
        table: {
          caption: "Each term is a part of the one above it.",
          headers: ["Term", "What it is", "Example"],
          rows: [
            ["Artificial intelligence", "Any technique that makes computers do tasks needing intelligence", "A chess engine; a fraud rule; a chatbot"],
            ["Machine learning", "AI whose behaviour is learned from data", "A model predicting loan default from past loans"],
            ["Deep learning", "ML using many-layered neural networks", "Recognising crop disease from a leaf photo"],
            ["Generative AI", "Deep learning that produces new content", "Writing text, generating images or code"],
          ],
        },
        decision: {
          scenario: "A startup photographs cassava leaves and wants software that says which disease, if any, each leaf has. It has 40,000 labelled photos.",
          question: "Which approach fits best, and why?",
          options: [
            { id: "a", text: "Hand-written rules describing each disease's colours", whyWrong: "Disease symptoms vary with light, angle and leaf; nobody can write those rules precisely enough." },
            { id: "b", text: "Deep learning, because the input is raw images and there is plenty of labelled data", why: "Neural networks learn their own visual features from pixels, and 40,000 labelled images is enough to train or fine-tune one." },
            { id: "c", text: "A spreadsheet formula", whyWrong: "A formula needs numbers someone has already extracted; the input here is photographs." },
            { id: "d", text: "Generative AI, because it is the newest", whyWrong: "The task is to classify, not to generate content. Newest is not a reason." },
          ],
          correct: "b",
          aftermath: "Raw, unstructured input (images, audio, text) plus lots of examples is where deep learning shines.",
        },
      },
      {
        id: "a-ml-generative-ai",
        title: "What is generative AI?",
        explain:
          "GENERATIVE AI produces NEW content (text, images, audio, code) instead of only labelling existing content. A classifier answers \"is this email spam?\"; a generative model writes an email. Large language models such as ChatGPT, Claude and Gemini are generative: trained on enormous amounts of text, they repeatedly predict the most likely NEXT piece of text (a token) given everything so far, and append it. The idea is old and simple; the scale is new. Below you build the smallest possible version: a model that learns which word follows which in a text, then generates by always choosing the most frequent next word.",
        codeChallenge: {
          task:
            "Write train(text) that returns a dictionary mapping each word to a dictionary of the words that follow it and how many times (split the text on spaces, lower-case it). Then write generate(model, start, n) that starts from start and appends n more words, each time choosing the most frequent follower of the current word (on a tie, the one that comes first alphabetically). Stop early if the current word has no followers. Return the words joined by spaces.",
          starter: "def train(text):\n    pass\n\ndef generate(model, start, n):\n    pass\n",
          sample:
            "m = train(\"the cat sat on the mat the cat ran\")\nm[\"the\"] → {\"cat\": 2, \"mat\": 1}\ngenerate(m, \"sat\", 4) → \"sat on the cat ran\"",
          tests: [
            {
              check: py`m = train("the cat sat on the mat the cat ran")
assert m["the"] == {"cat": 2, "mat": 1}, "After 'the' come 'cat' twice and 'mat' once. Got " + repr(m.get("the"))
assert m["cat"] == {"sat": 1, "ran": 1}, "After 'cat' come 'sat' and 'ran'. Got " + repr(m.get("cat"))
assert "ran" not in m or m["ran"] == {}, "'ran' is the last word: nothing follows it."
assert generate(m, "the", 3) == "the cat ran", "From 'the': cat (2 beats 1), then ran (a tie with sat; ran is first alphabetically), then 'ran' has no follower, so stop. Got " + repr(generate(m, "the", 3))
assert generate(m, "sat", 4) == "sat on the cat ran", "From 'sat': on, the, cat, ran. Got " + repr(generate(m, "sat", 4))
assert generate(m, "on", 0) == "on", "n = 0 returns just the start word."`,
              label: "first text",
            },
          ],
          solution: py`def train(text):
    words = text.lower().split()
    model = {}
    for current, nxt in zip(words, words[1:]):
        followers = model.setdefault(current, {})
        followers[nxt] = followers.get(nxt, 0) + 1
    return model

def generate(model, start, n):
    out = [start]
    current = start
    for _ in range(n):
        followers = model.get(current)
        if not followers:
            break
        current = sorted(followers, key=lambda w: (-followers[w], w))[0]
        out.append(current)
    return " ".join(out)
`,
          hint:
            "zip(words, words[1:]) gives every (word, next word) pair. To choose: sorted(followers, key=lambda w: (-followers[w], w))[0] puts the highest count first and breaks ties alphabetically.",
          successMessage:
            "That is a language model: learn what follows what, then predict the next word, again and again. Modern LLMs replace your counting with a neural network and look at thousands of previous tokens, not one.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 2 · 1.5 – 1.7
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ml-l2-how-computers-learn",
    moduleId: "ml-m1-intro",
    sectionId: SECTION_ID,
    order: 2,
    covers: ["1.5", "1.6", "1.7"],
    title: "How Computers Learn from Data",
    subtitle: "AI versus data science, learning as optimisation, and where ML is used",
    estimatedMinutes: 32,
    intro:
      "\"Learning\" sounds mysterious. For a computer it means something precise: search for the rule that makes the fewest mistakes on examples whose answers are known, then trust it on examples it has never seen.",

    atoms: [
      {
        id: "a-ml-ai-vs-data-science",
        title: "AI, ML, deep learning and data science compared",
        explain:
          "AI, ML and deep learning are nested: deep learning ⊂ machine learning ⊂ AI. DATA SCIENCE is a different kind of thing: a discipline whose goal is INSIGHT from data, for people to act on. A data scientist cleans data, explores it, tests hypotheses, builds charts and sometimes models, and reports findings (\"sales fall 18% in the rainy season in the north\"). A machine learning engineer's goal is a working PREDICTION SYSTEM that runs in software without a person in the loop. The two overlap heavily (both use statistics, Python and models), which is why this course teaches both the data skills (Month 2) and the modelling skills (Months 3 and 4).",
        table: {
          caption: "Same tools, different goals.",
          headers: ["Field", "Main goal", "Typical output"],
          rows: [
            ["Artificial intelligence", "Machines that perform intelligent tasks", "An assistant, a game player, a robot"],
            ["Machine learning", "Systems that learn behaviour from data", "A trained model making predictions"],
            ["Deep learning", "ML with many-layered neural networks", "Image, speech and language models"],
            ["Data science", "Insight from data for decisions", "Analyses, dashboards, reports, experiments"],
          ],
        },
        decision: {
          scenario:
            "Task A: explain to management why customer complaints rose last quarter. Task B: build software that automatically routes each new complaint to the right team.",
          question: "Which is primarily data science and which is primarily machine learning engineering?",
          options: [
            { id: "a", text: "A is data science, B is machine learning engineering", why: "A ends in an explanation for people. B ends in a system that predicts automatically for every new complaint." },
            { id: "b", text: "A is machine learning, B is data science", whyWrong: "An explanation for management is insight (data science); automatic routing is a prediction system (ML)." },
            { id: "c", text: "Both are deep learning", whyWrong: "Neither needs a neural network necessarily; and deep learning is a technique, not a goal." },
            { id: "d", text: "Neither uses data", whyWrong: "Both depend entirely on complaint data." },
          ],
          correct: "a",
          aftermath: "Ask what the deliverable is: insight for people (data science) or predictions by software (ML engineering).",
        },
      },
      {
        id: "a-ml-learning-from-data",
        title: "How computers learn from data",
        explain:
          "Every learning algorithm has three ingredients. (1) A MODEL FAMILY: the shape of rule it may learn, such as \"approve if score ≥ some threshold t\". (2) A MEASURE OF ERROR, called the loss: how many past examples the rule gets wrong. (3) A SEARCH (optimisation): a way of finding the member of the family with the smallest error. Training is running that search on examples with known answers. The result, here a single number t, is the learned PARAMETER. Real algorithms search over thousands or billions of parameters with calculus instead of trying every value, but the idea is exactly this.",
        codeChallenge: {
          task:
            "A lender has past applicants as (credit_score, repaid) pairs. Write learn_threshold(examples) that tries every credit score that appears in the examples as a candidate threshold t, using the rule \"approve if score >= t\", and returns the t with the FEWEST mistakes (a mistake: approving someone who did not repay, or rejecting someone who did). If several thresholds tie, return the smallest. Then write predict(t, score) that returns True if the applicant should be approved.",
          starter: "def learn_threshold(examples):\n    pass\n\ndef predict(t, score):\n    pass\n",
          sample: "learn_threshold([(500, False), (620, False), (650, True), (700, True)]) → 650",
          tests: [
            {
              check: py`ex = [(500, False), (620, False), (650, True), (700, True)]
assert learn_threshold(ex) == 650, "650 separates these perfectly. Got " + repr(learn_threshold(ex))
assert predict(650, 660) is True and predict(650, 640) is False, "predict(t, score) is score >= t."
noisy = [(480, False), (530, False), (560, True), (590, False), (610, True), (640, True), (700, True), (720, True)]
assert learn_threshold(noisy) == 560, "On noisy data the best threshold still makes one mistake (590). Got " + repr(learn_threshold(noisy))
tie = [(600, True), (500, False), (550, True)]
assert learn_threshold(tie) == 550, "550 makes no mistakes. Got " + repr(learn_threshold(tie))`,
            },
          ],
          solution: py`def learn_threshold(examples):
    best_t, best_errors = None, None
    for t in sorted(score for score, _ in examples):
        errors = sum((score >= t) != repaid for score, repaid in examples)
        if best_errors is None or errors < best_errors:
            best_t, best_errors = t, errors
    return best_t

def predict(t, score):
    return score >= t
`,
          hint:
            "For each candidate t (sorted, so the first best is the smallest), count errors = number of examples where (score >= t) != repaid. Keep the t with the smallest count, replacing only when strictly smaller.",
          successMessage:
            "Model family, error measure, search: you have just written a complete learning algorithm. Gradient descent in Module 3 is a smarter search over the same idea.",
        },
      },
      {
        id: "a-ml-applications",
        title: "Real-world applications of machine learning",
        explain:
          "Machine learning is now inside most software people use daily. Finance: credit scoring, fraud detection on card and mobile-money transactions, and forecasting cash demand at ATMs. Healthcare: reading X-rays and malaria blood smears, predicting patient readmission. Agriculture: crop disease detection from phone photos, yield forecasting from weather and satellite data. Education: predicting which students are at risk of failing so they get help early, adaptive practice. Commerce: product recommendations, demand forecasting, dynamic pricing. Language: translation, speech-to-text, chat assistants. A good application has three things: a repeated decision, data recording past outcomes, and a cost to getting it wrong that is lower than the value of getting it right more often.",
        decision: {
          scenario:
            "Which of these is the WEAKEST candidate for machine learning?",
          question: "Choose the one where ML adds least.",
          options: [
            { id: "a", text: "Flagging suspicious mobile-money transfers among millions per day", whyWrong: "Huge volume, recorded past fraud cases and a clear cost: a strong candidate." },
            { id: "b", text: "Calculating VAT at 7.5% on an invoice", why: "The rule is exact, known and fixed. A formula is cheaper, perfectly accurate and explainable. Learning it from data would only add error." },
            { id: "c", text: "Predicting which customers will stop using a telecom network", whyWrong: "A repeated decision with historical churn data: a classic ML task." },
            { id: "d", text: "Detecting maize leaf disease from photos", whyWrong: "No exact rule exists and labelled photos can be collected: a good ML task." },
          ],
          correct: "b",
          aftermath: "If you can write the rule exactly, write the rule. Use ML when the rule is unknown but examples exist.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 3 · 1.8
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ml-l3-types-of-learning",
    moduleId: "ml-m1-intro",
    sectionId: SECTION_ID,
    order: 3,
    covers: ["1.8"],
    title: "Types of Machine Learning",
    subtitle: "Supervised, unsupervised, semi-supervised and reinforcement learning",
    estimatedMinutes: 34,
    intro:
      "The first question about any ML problem is what kind of data you have. Labelled examples, unlabelled data, a mixture, or an environment that rewards actions each lead to a different family of algorithms.",

    atoms: [
      {
        id: "a-ml-supervised",
        title: "Supervised learning",
        explain:
          "In SUPERVISED learning every training example comes with the correct answer, the LABEL, as if a supervisor marked it. The algorithm learns a mapping from inputs to labels and then predicts labels for new inputs. If the label is a CATEGORY (spam or not, which disease) the task is CLASSIFICATION; if it is a NUMBER (price, temperature, sales) it is REGRESSION. Most business ML is supervised, because companies already record outcomes: whether a loan was repaid, what a house sold for. The program below is the simplest supervised learner there is: predict the label of the most similar known example.",
        codeExercise: {
          language: PY,
          code: py`# Labelled examples: (house size in m², price in ₦ millions)
known = [(60, 45), (85, 62), (120, 90), (150, 118)]

def predict(size):
    nearest = min(known, key=lambda ex: abs(ex[0] - size))
    return nearest[1]

for size in [70, 100, 140]:
    print(size, "->", predict(size))
`,
          question: "Each new house gets the price of the known house closest in size. What does it print?",
          expectedOutput: "70 -> 45\n100 -> 62\n140 -> 118",
          hint: "70 is 10 from 60 and 15 from 85. 100 is 15 from 85 and 20 from 120. 140 is 20 from 120 and 10 from 150.",
          successMessage: "Labelled examples in, a prediction for an unseen input out. This is 1-nearest-neighbour regression, which Module 11 develops properly.",
        },
      },
      {
        id: "a-ml-unsupervised",
        title: "Unsupervised and semi-supervised learning",
        explain:
          "In UNSUPERVISED learning there are no labels. The algorithm finds STRUCTURE by itself: CLUSTERING groups similar customers into segments; DIMENSIONALITY REDUCTION compresses hundreds of columns into a few; ANOMALY DETECTION finds transactions unlike all the others. Nobody says what the groups mean; a person interprets them afterwards. SEMI-SUPERVISED learning sits between: a FEW labelled examples and MANY unlabelled ones, which is common because labelling is expensive (a doctor must read every scan). A typical method, SELF-TRAINING, trains on the labelled few, labels the unlabelled data it is most confident about, adds those to the training set, and repeats.",
        decision: {
          scenario:
            "A hospital has 200,000 chest X-rays. Radiologists have had time to label only 2,000 of them as normal or pneumonia.",
          question: "Which type of learning describes using all 200,000 images?",
          options: [
            { id: "a", text: "Supervised, using only the 2,000", whyWrong: "That works, but throws away 198,000 images. The question asks about using all of them." },
            { id: "b", text: "Unsupervised", whyWrong: "Some labels exist and the goal is a labelled prediction (normal or pneumonia)." },
            { id: "c", text: "Semi-supervised", why: "A small labelled set plus a large unlabelled set, used together, is exactly semi-supervised learning." },
            { id: "d", text: "Reinforcement learning", whyWrong: "There is no agent taking actions and receiving rewards." },
          ],
          correct: "c",
          aftermath: "Few labels, lots of unlabelled data: semi-supervised. No labels at all: unsupervised.",
        },
      },
      {
        id: "a-ml-reinforcement",
        title: "Reinforcement learning",
        explain:
          "In REINFORCEMENT LEARNING (RL) an AGENT learns by acting in an ENVIRONMENT and receiving REWARDS, with no labelled answers at all. It must balance EXPLORATION (trying actions to learn their value) and EXPLOITATION (choosing the action it currently believes is best). RL trained game players such as AlphaGo, controls robots, and is used to fine-tune large language models from human feedback (RLHF). The simplest RL problem is the MULTI-ARMED BANDIT: several options with unknown average rewards. The agent keeps an estimate Q for each option and, after each reward r, updates the estimate as a running average: Q ← Q + (r − Q) / n, where n is how many times that option has been tried.",
        codeChallenge: {
          task:
            "A shop tests three advert designs (0, 1 and 2); each time an advert is shown it earns a reward (sales). Write update(Q, N, arm, reward) that increments N[arm] and updates Q[arm] with the running average Q ← Q + (reward − Q) / N. Then write best_arm(Q) that returns the index of the highest estimate (the lowest index on a tie). Q and N are lists that update changes in place.",
          starter: "def update(Q, N, arm, reward):\n    pass\n\ndef best_arm(Q):\n    pass\n",
          sample: "Q = [0, 0, 0]; N = [0, 0, 0]; update(Q, N, 1, 10) → Q == [0, 10.0, 0], N == [0, 1, 0]",
          tests: [
            {
              check: py`Q = [0.0, 0.0, 0.0]
N = [0, 0, 0]
update(Q, N, 1, 10)
assert N == [0, 1, 0] and Q[1] == 10, "After one reward of 10 on arm 1, Q[1] is 10 and N[1] is 1. Got Q=" + repr(Q) + " N=" + repr(N)
update(Q, N, 1, 4)
assert Q[1] == 7, "The average of 10 and 4 is 7. Got " + repr(Q[1])
for r in [3, 5, 4]:
    update(Q, N, 0, r)
assert Q[0] == 4 and N[0] == 3, "Arm 0 averaged 3, 5, 4 = 4. Got " + repr(Q[0])
assert best_arm(Q) == 1, "Arm 1 (7) is best. Got " + repr(best_arm(Q))
assert best_arm([2.0, 2.0, 1.0]) == 0, "On a tie, the lowest index."
assert not calls("sum"), "Update the estimate incrementally, without storing and summing all rewards."`,
            },
          ],
          solution: py`def update(Q, N, arm, reward):
    N[arm] += 1
    Q[arm] += (reward - Q[arm]) / N[arm]

def best_arm(Q):
    best = 0
    for i in range(1, len(Q)):
        if Q[i] > Q[best]:
            best = i
    return best
`,
          hint: "N[arm] += 1 first, then Q[arm] += (reward - Q[arm]) / N[arm]. For best_arm, loop and replace only when strictly greater.",
          successMessage:
            "The agent never saw a labelled \"correct advert\". It learned from rewards alone. Add a rule for sometimes trying a random arm (exploration) and you have the epsilon-greedy algorithm.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 4 · 1.9 – 1.10
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ml-l4-lifecycle-and-data",
    moduleId: "ml-m1-intro",
    sectionId: SECTION_ID,
    order: 4,
    covers: ["1.9", "1.10"],
    title: "The ML Lifecycle, Datasets, Features and Labels",
    subtitle: "From a business problem to a monitored model, and the vocabulary of data",
    estimatedMinutes: 32,
    intro:
      "Training the model is a small part of a machine learning project. Most of the time goes into defining the problem, getting and preparing data, and keeping the model working after it is deployed.",

    atoms: [
      {
        id: "a-ml-lifecycle",
        title: "The machine learning development lifecycle",
        explain:
          "A machine learning project moves through stages, and it loops: what you learn in later stages sends you back to earlier ones. (1) PROBLEM DEFINITION: the decision to improve, the prediction needed, and how success is measured in business terms. (2) DATA COLLECTION. (3) DATA PREPARATION: cleaning, handling missing values, encoding. (4) EXPLORATORY ANALYSIS: understanding distributions and relationships. (5) FEATURE ENGINEERING. (6) MODEL TRAINING. (7) EVALUATION on data the model has never seen. (8) DEPLOYMENT into an application or API. (9) MONITORING and RETRAINING, because the world changes and models decay. Surveys of practitioners consistently find data preparation takes the largest share of the time.",
        table: {
          caption: "The lifecycle, and the module of this course that teaches each stage.",
          headers: ["Stage", "Key question", "Taught in"],
          rows: [
            ["Problem definition", "What decision, what prediction, what counts as success?", "Modules 1 and 24"],
            ["Data collection and preparation", "Is the data complete, correct and usable?", "Modules 5 and 8"],
            ["Exploratory analysis", "What does the data actually show?", "Modules 6 and 7"],
            ["Training and evaluation", "Does the model generalise to unseen data?", "Modules 9 to 18"],
            ["Deployment", "How do applications get predictions?", "Modules 19 and 20"],
            ["Monitoring and retraining", "Is it still accurate this month?", "Modules 21 and 22"],
          ],
        },
        decision: {
          scenario:
            "A team trains a churn model with 94% accuracy, deploys it, and six months later notices it is barely better than guessing. Customers' behaviour changed when a competitor launched cheaper data bundles.",
          question: "Which lifecycle stage was missing?",
          options: [
            { id: "a", text: "Data collection", whyWrong: "They had enough data to train a 94% model." },
            { id: "b", text: "Monitoring and retraining", why: "The model was accurate when trained; the world changed afterwards. Monitoring detects the decay, and retraining on recent data fixes it." },
            { id: "c", text: "Model training", whyWrong: "Training produced a good model for the data of its time." },
            { id: "d", text: "Exploratory analysis", whyWrong: "No amount of earlier exploration could have shown a competitor's future launch." },
          ],
          correct: "b",
          aftermath: "Deployment is not the end of the lifecycle. Models decay as the world changes, which is why MLOps (Module 21) exists.",
        },
      },
      {
        id: "a-ml-features-labels",
        title: "Datasets, features, labels and predictions",
        explain:
          "A DATASET is a table of examples. Each ROW is one example (also called an observation, sample or instance): one customer, one house, one transaction. Each COLUMN is a variable. The columns the model uses as inputs are FEATURES (written X); the column it must predict is the LABEL or TARGET (written y). A trained model takes the features of a new row and outputs a PREDICTION (written ŷ, \"y-hat\"). Comparing predictions with true labels on unseen rows tells you how good the model is. The first job in any project is therefore to separate the label column from the features.",
        codeChallenge: {
          task:
            "Each row is a dictionary. Write split_xy(rows, label) that returns a tuple (X, y): X is a list of NEW dictionaries containing every column except label, and y is the list of label values, in the same order. Do not change the original rows. Then write accuracy(predictions, labels) that returns the fraction of predictions equal to the true labels (0.0 for empty lists).",
          starter: "def split_xy(rows, label):\n    pass\n\ndef accuracy(predictions, labels):\n    pass\n",
          sample:
            "split_xy([{\"age\": 30, \"income\": 200, \"churn\": 1}], \"churn\") → ([{\"age\": 30, \"income\": 200}], [1])",
          tests: [
            {
              check: py`rows = [
    {"age": 30, "plan": "prepaid", "churn": 1},
    {"age": 45, "plan": "postpaid", "churn": 0},
    {"age": 22, "plan": "prepaid", "churn": 1},
]
X, y = split_xy(rows, "churn")
assert y == [1, 0, 1], "y should hold the label values in order. Got " + repr(y)
assert X == [{"age": 30, "plan": "prepaid"}, {"age": 45, "plan": "postpaid"}, {"age": 22, "plan": "prepaid"}], "X keeps every column except the label. Got " + repr(X)
assert "churn" in rows[0], "Do not remove the label from the original rows: build new dictionaries."
assert accuracy([1, 0, 0, 1], [1, 0, 1, 1]) == 0.75, "3 of 4 predictions are right: 0.75."
assert accuracy([], []) == 0.0, "No predictions: return 0.0."`,
            },
          ],
          solution: py`def split_xy(rows, label):
    X = [{k: v for k, v in row.items() if k != label} for row in rows]
    y = [row[label] for row in rows]
    return X, y

def accuracy(predictions, labels):
    if not labels:
        return 0.0
    return sum(p == t for p, t in zip(predictions, labels)) / len(labels)
`,
          hint:
            "A dictionary comprehension {k: v for k, v in row.items() if k != label} builds a new dictionary without the label. For accuracy, count matches with zip.",
          successMessage:
            "Features in, label out, predictions compared with labels: every supervised model in this course starts with exactly this split, written as X, y = ... in scikit-learn.",
        },
      },
      {
        id: "a-ml-predictions",
        title: "Reading predictions honestly",
        explain:
          "Accuracy alone can mislead. If 95 of 100 transactions are legitimate, a \"model\" that always predicts LEGITIMATE is 95% accurate and catches zero fraud. Before celebrating a score, compare it with a BASELINE: the score of the simplest possible rule, usually \"always predict the most common label\" for classification, or \"always predict the average\" for regression. A model is only useful by the amount it beats its baseline. Module 11 introduces precision, recall and the other measures built for exactly this problem.",
        codeExercise: {
          language: PY,
          code: py`labels = ["ok"] * 95 + ["fraud"] * 5
always_ok = ["ok"] * 100

acc = sum(p == t for p, t in zip(always_ok, labels)) / len(labels)
caught = sum(p == t == "fraud" for p, t in zip(always_ok, labels))
print("accuracy:", acc)
print("fraud caught:", caught, "of", labels.count("fraud"))
`,
          question: "A useless model always predicts \"ok\" on 100 transactions, 5 of which are fraud. What does it print?",
          expectedOutput: "accuracy: 0.95\nfraud caught: 0 of 5",
          hint: "It is right on all 95 legitimate transactions and wrong on all 5 frauds.",
          successMessage: "95% accurate and completely useless. Always compare with the majority-class baseline before trusting an accuracy figure.",
        },
      },
    ],

    task: {
      title: "Module 1 practice: machine learning across industries",
      intro:
        "For each sector, identify a real machine learning application. For each one, write down: the decision it improves, the type of learning (supervised, unsupervised, semi-supervised or reinforcement), the features, the label or output, and how success would be measured.",
      prompts: [
        "Banking: for example fraud detection on card and mobile-money transfers, or credit scoring for loan applicants.",
        "Healthcare: for example malaria detection from blood-smear images, or predicting which patients will miss follow-up appointments.",
        "Agriculture: for example crop disease detection from leaf photos, or yield prediction from rainfall and soil data.",
        "Education: for example identifying students at risk of failing early in a term, or recommending practice questions.",
        "Sports: for example predicting match outcomes, or tracking player workload to reduce injuries.",
        "E-commerce: for example product recommendations, delivery-time prediction, or segmenting customers for promotions.",
        "For one of your six, write the majority-class baseline you would have to beat, and why accuracy alone might mislead.",
      ],
      closing: "Every application you listed needs Python to build. Module 2 teaches the Python a machine learning engineer uses.",
    },

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
