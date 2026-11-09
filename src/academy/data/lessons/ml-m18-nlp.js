/**
 * MACHINE LEARNING AND AI · MODULE 18 · NATURAL LANGUAGE PROCESSING
 *
 * Curriculum 18.1 – 18.13. How computers process language; preprocessing;
 * tokenisation; stop words; stemming and lemmatisation; bag of words and
 * TF-IDF (both implemented by the learner and checked against
 * scikit-learn); word embeddings; text classification; sentiment analysis;
 * attention (scaled dot-product attention in NumPy); and Transformers. The
 * running data is customer reviews of Nigerian businesses.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

export const SECTION_ID = "ml-s18-nlp";

const PY = "python";
const py = String.raw;

// A small labelled review corpus (1 = positive), shared by several checks.
const REVIEWS = py`reviews = [
    ("Delivery was fast and the rice was excellent", 1),
    ("Great service, friendly staff, will order again", 1),
    ("The jollof was delicious and well packaged", 1),
    ("Excellent quality, arrived on time", 1),
    ("Very good customer support, they fixed my issue quickly", 1),
    ("I love this shop, prices are fair and service is great", 1),
    ("Fresh food, quick delivery, highly recommend", 1),
    ("Good value and the rider was polite", 1),
    ("Amazing taste, I will definitely come back", 1),
    ("Smooth payment and fast refund when I asked", 1),
    ("Terrible service, my order never arrived", 0),
    ("The food was cold and tasteless", 0),
    ("Very slow delivery and rude rider", 0),
    ("Not good at all, I want a refund", 0),
    ("Poor quality, the package was damaged", 0),
    ("They charged me twice and support ignored me", 0),
    ("Worst experience, the app kept crashing", 0),
    ("Late delivery again, very disappointing", 0),
    ("The rice was stale and overpriced", 0),
    ("Awful customer support, nobody answered my calls", 0),
]
texts = [t for t, _ in reviews]
labels = [y for _, y in reviews]
`;

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 79 · 18.1 – 18.3
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ml-l79-nlp-intro",
    moduleId: "ml-m18-nlp",
    sectionId: SECTION_ID,
    order: 1,
    covers: ["18.1", "18.2", "18.3"],
    title: "NLP, How Computers Read, and Text Preprocessing",
    subtitle: "From characters to numbers a model can use",
    estimatedMinutes: 36,
    intro:
      "Language is the hardest data machine learning handles: ambiguous, endlessly varied, and full of meaning that depends on context. Every NLP system starts by turning text into numbers, and by cleaning it first.",

    atoms: [
      {
        id: "a-ml-nlp-intro",
        title: "Introduction to NLP",
        explain:
          "NATURAL LANGUAGE PROCESSING (NLP) is the field of AI that lets computers work with human language. Common tasks: TEXT CLASSIFICATION (spam, topic, intent), SENTIMENT ANALYSIS, NAMED ENTITY RECOGNITION (finding people, places, organisations, amounts), MACHINE TRANSLATION (English ↔ Yoruba, Hausa, Igbo), QUESTION ANSWERING, SUMMARISATION, SPEECH RECOGNITION and TEXT GENERATION. Language is hard because words are AMBIGUOUS (\"bank\" of a river or for money), meaning depends on CONTEXT and word ORDER (\"not good\" versus \"good\"), and people write with slang, code-switching (English mixed with Pidgin), typos and emojis. NLP evolved from hand-written rules, through statistical models on word counts, to neural networks and, since 2017, Transformers.",
        decision: {
          scenario: "A bank receives thousands of customer messages a day and wants each one sent automatically to the right team: cards, loans, transfers or complaints.",
          question: "Which NLP task is this?",
          options: [
            { id: "a", text: "Machine translation", whyWrong: "Nothing is translated between languages." },
            { id: "b", text: "Text classification (intent detection)", why: "Each message gets one category from a fixed set, which is text classification." },
            { id: "c", text: "Text generation", whyWrong: "No new text is written." },
            { id: "d", text: "Speech recognition", whyWrong: "The input is already text." },
          ],
          correct: "b",
          aftermath: "Routing, spam filtering and sentiment are all text classification with different labels.",
        },
      },
      {
        id: "a-ml-how-computers-process-language",
        title: "How computers process human language",
        explain:
          "Computers store text as numbers: each character has a Unicode code point, stored as one or more bytes in UTF-8 (\"₦\" takes 3 bytes, \"ẹ\" in Yoruba 3). For models, text is split into TOKENS (words or pieces of words), each token is mapped to an integer ID through a VOCABULARY, and each ID becomes a vector: a count vector (bag of words, Lesson 81) or a learned embedding (Lesson 82). Words outside the vocabulary map to a special UNKNOWN token. The pipeline is always: raw text → clean → tokenise → map to IDs → vectors → model.",
        codeExercise: {
          language: PY,
          code: py`text = "Pay ₦5,000 now"
print([ord(c) for c in text[:5]])
print(len(text), len(text.encode("utf-8")))

vocab = {"<unk>": 0, "pay": 1, "now": 2, "send": 3}
tokens = text.lower().split()
print([vocab.get(t, vocab["<unk>"]) for t in tokens])
`,
          question: "Characters become code points and bytes; tokens become IDs through a vocabulary. What does it print?",
          expectedOutput: "[80, 97, 121, 32, 8358]\n14 16\n[1, 0, 2]",
          hint: "₦ is code point 8358 and takes 3 bytes in UTF-8, so the byte count is 2 more than the character count. \"₦5,000\" is not in the vocabulary.",
          successMessage: "Characters, bytes, tokens and IDs: four layers of representation before a model sees anything. The unknown token is how a vocabulary copes with words it has never seen.",
        },
      },
      {
        id: "a-ml-text-preprocessing",
        title: "Text preprocessing",
        explain:
          "PREPROCESSING standardises text so that variants of the same thing look the same: LOWERCASING (\"Delivery\" = \"delivery\"), removing URLs, email addresses and HTML, normalising or removing punctuation and numbers, collapsing whitespace, and sometimes replacing emojis with words or expanding contractions (\"don't\" → \"do not\"). Choose steps for the TASK: for sentiment, keep negations and maybe \"!!!\"; for spam detection, the presence of a URL or a phone number is itself a strong signal worth keeping as a placeholder token. Modern Transformer models need much less cleaning, since their tokenisers handle case and punctuation themselves.",
        codeChallenge: {
          task:
            "Write clean_text(text) that: lower-cases; replaces any URL (starting with http:// or https://, up to the next space) with the token \"url\"; replaces any run of digits (possibly with commas, like 5,000) with the token \"num\"; removes every character that is not a lowercase letter, a space or an apostrophe; and collapses runs of whitespace to single spaces with no leading or trailing space. Use the re module.",
          starter: "import re\n\ndef clean_text(text):\n    pass\n",
          sample: "clean_text(\"WIN ₦50,000 now!!! Visit https://bit.ly/x\") → \"win num now visit url\"",
          tests: [
            {
              check: py`assert clean_text("WIN ₦50,000 now!!! Visit https://bit.ly/x") == "win num now visit url", "Got " + repr(clean_text("WIN ₦50,000 now!!! Visit https://bit.ly/x"))
assert clean_text("  The rice   was GREAT :) ") == "the rice was great", "Got " + repr(clean_text("  The rice   was GREAT :) "))
assert clean_text("I don't like it") == "i don't like it", "Keep apostrophes so negations like don't survive."
assert clean_text("Call 08012345678 or see http://x.co/promo today") == "call num or see url today", "Got " + repr(clean_text("Call 08012345678 or see http://x.co/promo today"))
assert calls("sub"), "Use re.sub."`,
            },
          ],
          solution: py`import re

def clean_text(text):
    text = text.lower()
    text = re.sub(r"https?://\S+", " url ", text)
    text = re.sub(r"\d[\d,]*", " num ", text)
    text = re.sub(r"[^a-z' ]", " ", text)
    return re.sub(r"\s+", " ", text).strip()
`,
          hint: "Order matters: URLs first (they contain letters and digits), then numbers, then strip other characters. Surround placeholders with spaces, then collapse whitespace with re.sub(r\"\\s+\", \" \", text).strip().",
          successMessage: "A phone number and a link became placeholder tokens: the specific values are noise, but their presence is a strong spam signal.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 80 · 18.4 – 18.6
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ml-l80-tokens-stopwords-stems",
    moduleId: "ml-m18-nlp",
    sectionId: SECTION_ID,
    order: 2,
    covers: ["18.4", "18.5", "18.6"],
    title: "Tokenization, Stop Words, Stemming and Lemmatization",
    subtitle: "Splitting text into units, dropping filler, and merging word forms",
    estimatedMinutes: 38,
    intro:
      "\"Delivered\", \"delivering\" and \"deliveries\" are one idea in three spellings; \"the\" and \"was\" carry almost none. Tokenisation, stop-word removal and stemming shape the vocabulary a classical model sees.",

    atoms: [
      {
        id: "a-ml-tokenization",
        title: "Tokenization",
        explain:
          "TOKENISATION splits text into units. WORD tokenisation splits on spaces and punctuation, but must decide about \"don't\", \"₦5,000\" and \"e-commerce\". CHARACTER tokenisation never meets an unknown token but makes sequences long. SUBWORD tokenisation (Byte-Pair Encoding, WordPiece, SentencePiece), used by every modern language model, keeps frequent words whole and splits rare ones into pieces (\"unbelievably\" → \"un\", \"believ\", \"ably\"), so any word can be represented with a vocabulary of 30,000–100,000 tokens. N-GRAMS are runs of n consecutive tokens: the bigram \"not good\" carries meaning that \"not\" and \"good\" separately do not.",
        codeChallenge: {
          task:
            "Write tokenize(text) that lower-cases the text and returns the list of tokens matched by the regular expression [a-z0-9']+ (so punctuation splits words but apostrophes stay inside them). Then write ngrams(tokens, n) that returns the list of n-grams as strings joined by single spaces.",
          starter: "import re\n\ndef tokenize(text):\n    pass\n\ndef ngrams(tokens, n):\n    pass\n",
          sample: "ngrams(tokenize(\"The food was NOT good!\"), 2) → [\"the food\", \"food was\", \"was not\", \"not good\"]",
          tests: [
            {
              check: py`assert tokenize("The food was NOT good!") == ["the", "food", "was", "not", "good"], "Got " + repr(tokenize("The food was NOT good!"))
assert tokenize("Don't pay ₦5,000, e-commerce scam") == ["don't", "pay", "5", "000", "e", "commerce", "scam"], "Apostrophes stay inside words; other punctuation splits. Got " + repr(tokenize("Don't pay ₦5,000, e-commerce scam"))
assert ngrams(["the", "food", "was", "not", "good"], 2) == ["the food", "food was", "was not", "not good"], "Bigrams."
assert ngrams(["a", "b", "c"], 3) == ["a b c"] and ngrams(["a", "b"], 3) == [], "Too few tokens: no n-grams."`,
            },
          ],
          solution: py`import re

def tokenize(text):
    return re.findall(r"[a-z0-9']+", text.lower())

def ngrams(tokens, n):
    return [" ".join(tokens[i:i + n]) for i in range(len(tokens) - n + 1)]
`,
          hint: "re.findall(r\"[a-z0-9']+\", text.lower()). For n-grams: \" \".join(tokens[i:i + n]) for i in range(len(tokens) - n + 1).",
          successMessage: "\"not good\" is now one feature. Bigrams are the cheapest way to give a word-count model a little sense of word order.",
        },
      },
      {
        id: "a-ml-stop-words",
        title: "Stop-word removal",
        explain:
          "STOP WORDS are very frequent words that carry little meaning on their own: \"the\", \"a\", \"is\", \"and\", \"of\". Removing them shrinks the vocabulary and lets count-based models focus on content words. But it is not always right: standard English stop-word lists include \"not\", \"no\" and \"never\", and removing them destroys sentiment (\"not good\" becomes \"good\"). For sentiment, keep negations; for topic classification, removal usually helps; for Transformers, never remove anything, since they use every word's context. Lists exist for many languages; scikit-learn's CountVectorizer accepts stop_words=\"english\" or your own list.",
        codeExercise: {
          language: PY,
          code: py`STOP = {"the", "a", "an", "is", "was", "and", "of", "to", "at", "all", "not", "no"}
NEGATIONS = {"not", "no", "never"}

tokens = "the food was not good at all".split()
naive = [t for t in tokens if t not in STOP]
careful = [t for t in tokens if t not in STOP - NEGATIONS]
print(naive)
print(careful)
print(len(tokens), len(naive))
`,
          question: "Remove stop words from a negative review, first with a list that includes \"not\", then keeping negations. What does it print?",
          expectedOutput: "['food', 'good']\n['food', 'not', 'good']\n7 2",
          hint: "STOP - NEGATIONS is the stop list without \"not\", \"no\" and \"never\".",
          successMessage: "The naive filter turned a complaint into \"food good\". Removing stop words blindly can flip the meaning a sentiment model needs.",
        },
      },
      {
        id: "a-ml-stemming-lemmatization",
        title: "Stemming and lemmatization",
        explain:
          "Both reduce word forms to a common base so a model counts them together. STEMMING chops suffixes by rules (the Porter stemmer: \"delivering\" → \"deliv\", \"studies\" → \"studi\"); it is fast and crude, producing stems that are not always real words, and it over-merges (\"university\" and \"universe\" → \"univers\"). LEMMATISATION uses a dictionary and the word's part of speech to return the proper base form, the LEMMA (\"better\" → \"good\", \"was\" → \"be\", \"studies\" → \"study\"); it is more accurate and slower. Libraries: NLTK and spaCy. For classical models on small data both help; for Transformers neither is used.",
        codeChallenge: {
          task:
            "Write a tiny rule-based stemmer stem(word): apply the FIRST matching rule of: \"ies\" → \"y\" (studies → study), \"ing\" → \"\" (delivering → deliver), \"ed\" → \"\" (ordered → order), \"es\" → \"\" (boxes → box), \"s\" → \"\" (riders → rider); but only strip a suffix if at least 3 letters remain afterwards, and never strip \"s\" from a word ending in \"ss\". Then write lemmatize(word, lemmas) that returns lemmas.get(word, stem(word)): a dictionary lookup first, the stemmer as a fallback.",
          starter: "def stem(word):\n    pass\n\ndef lemmatize(word, lemmas):\n    pass\n",
          sample: "stem(\"delivering\") → \"deliver\"; lemmatize(\"was\", {\"was\": \"be\"}) → \"be\"",
          tests: [
            {
              check: py`cases = {"studies": "study", "delivering": "deliver", "ordered": "order", "boxes": "box", "riders": "rider", "class": "class", "sing": "sing", "red": "red", "is": "is", "bus": "bus"}
for w, want in cases.items():
    assert stem(w) == want, "stem(" + repr(w) + ") should be " + repr(want) + ". Got " + repr(stem(w))
L = {"was": "be", "better": "good", "ran": "run"}
assert lemmatize("was", L) == "be" and lemmatize("better", L) == "good", "Dictionary lemmas come first."
assert lemmatize("delivered", L) == "deliver", "Unknown words fall back to the stemmer."`,
            },
          ],
          solution: py`RULES = [("ies", "y"), ("ing", ""), ("ed", ""), ("es", ""), ("s", "")]

def stem(word):
    for suffix, replacement in RULES:
        if word.endswith(suffix):
            if suffix == "s" and word.endswith("ss"):
                return word
            base = word[: -len(suffix)]
            if len(base) >= 3:
                return base + replacement
            return word
    return word

def lemmatize(word, lemmas):
    return lemmas.get(word, stem(word))
`,
          hint: "Loop over the rules in order; on the first suffix the word ends with, compute base = word[:-len(suffix)] and return base + replacement only if len(base) >= 3, otherwise return the word unchanged.",
          successMessage: "\"sing\" and \"bus\" survive because too little would remain: even a toy stemmer needs guards. Real stemmers have dozens of rules, and lemmatisers a whole dictionary.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 81 · 18.7 – 18.8
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ml-l81-bow-tfidf",
    moduleId: "ml-m18-nlp",
    sectionId: SECTION_ID,
    order: 3,
    covers: ["18.7", "18.8"],
    title: "Bag of Words and TF-IDF",
    subtitle: "Turning documents into vectors by counting, and weighting the counts",
    estimatedMinutes: 40,
    intro:
      "The classic way to give a model a document is a vector of word counts. TF-IDF refines it by down-weighting words that appear everywhere. Both are still strong baselines, and you will build each from scratch.",

    atoms: [
      {
        id: "a-ml-bag-of-words",
        title: "Bag of Words",
        explain:
          "BAG OF WORDS represents each document as a vector with one entry per vocabulary word, holding how many times that word occurs. Word ORDER is thrown away (hence \"bag\"): \"dog bites man\" and \"man bites dog\" get the same vector. The result is a DOCUMENT-TERM MATRIX, documents × vocabulary, almost entirely zeros, so libraries store it as a SPARSE matrix. Despite its simplicity, bag of words with a linear model or Naive Bayes is a strong baseline for classification. scikit-learn's CountVectorizer builds the vocabulary from the training documents (fit) and counts words in any document (transform); words not in the vocabulary are ignored.",
        codeChallenge: {
          task:
            "Without scikit-learn, write build_vocab(docs) that returns a dictionary mapping each distinct lower-cased word (split on whitespace) across the documents to an index, in ALPHABETICAL order. Then write bow(docs, vocab) that returns a NumPy integer array of shape (len(docs), len(vocab)) holding each document's word counts, ignoring words not in the vocabulary.",
          starter: "import numpy as np\n\ndef build_vocab(docs):\n    pass\n\ndef bow(docs, vocab):\n    pass\n",
          sample: "build_vocab([\"good food\", \"bad food\"]) → {\"bad\": 0, \"food\": 1, \"good\": 2}",
          tests: [
            {
              check: py`import numpy as np
docs = ["good food good service", "bad food", "service was bad bad"]
v = build_vocab(docs)
assert v == {"bad": 0, "food": 1, "good": 2, "service": 3, "was": 4}, "Alphabetical indices. Got " + repr(v)
M = bow(docs, v)
assert M.tolist() == [[0, 1, 2, 1, 0], [1, 1, 0, 0, 0], [2, 0, 0, 1, 1]], "Word counts per document. Got " + repr(M.tolist())
assert bow(["great food"], v).tolist() == [[0, 1, 0, 0, 0]], "Unknown words (great) are ignored."
from sklearn.feature_extraction.text import CountVectorizer
cv = CountVectorizer(token_pattern=r"\S+")
assert np.array_equal(cv.fit_transform(docs).toarray(), M), "Must match scikit-learn's CountVectorizer."`,
            },
          ],
          solution: py`import numpy as np

def build_vocab(docs):
    words = sorted({w for d in docs for w in d.lower().split()})
    return {w: i for i, w in enumerate(words)}

def bow(docs, vocab):
    M = np.zeros((len(docs), len(vocab)), dtype=int)
    for i, d in enumerate(docs):
        for w in d.lower().split():
            if w in vocab:
                M[i, vocab[w]] += 1
    return M
`,
          hint: "A set comprehension over every word of every document, sorted, then enumerate to assign indices. For counts, start from zeros and add 1 at [document, vocab[word]].",
          successMessage: "Your matrix matches CountVectorizer exactly. Every row is a document turned into numbers, ready for any classifier.",
        },
      },
      {
        id: "a-ml-tfidf",
        title: "TF-IDF",
        explain:
          "TF-IDF (term frequency × inverse document frequency) weights each count by how DISTINCTIVE the word is. TF is the count of the word in the document. IDF is high for rare words and low for words in almost every document: scikit-learn's smoothed version is idf(t) = ln((1 + n) / (1 + df(t))) + 1, where n is the number of documents and df(t) how many contain t. Each document's vector of TF × IDF values is then L2-NORMALISED (divided by its length), so long and short documents are comparable. \"the\" ends up near zero; \"refund\" or \"stale\" stand out. TF-IDF powers search engines' classic relevance ranking and is a strong text-classification baseline.",
        codeChallenge: {
          task:
            "Write tfidf(counts) that takes a document-term count matrix (NumPy, documents × terms) and returns the TF-IDF matrix exactly as scikit-learn's TfidfVectorizer computes it by default: idf = ln((1 + n) / (1 + df)) + 1 with df the number of documents containing each term, multiply counts by idf, then divide each row by its L2 norm (leave all-zero rows as zeros).",
          starter: "import numpy as np\n\ndef tfidf(counts):\n    pass\n",
          sample: "a word in every document gets the minimum idf of 1.0; a word in one document of three gets ln(4/2) + 1 ≈ 1.693",
          tests: [
            {
              check: py`import numpy as np
from sklearn.feature_extraction.text import CountVectorizer, TfidfVectorizer
docs = ["the rice was good", "the rice was stale", "the service was good good", "refund the money"]
cv = CountVectorizer(token_pattern=r"\S+")
C = cv.fit_transform(docs).toarray()
T = tfidf(C)
ref = TfidfVectorizer(token_pattern=r"\S+").fit_transform(docs).toarray()
assert T.shape == ref.shape and np.allclose(T, ref), "Must match scikit-learn's TfidfVectorizer."
assert np.allclose(np.linalg.norm(T, axis=1), 1), "Every row has length 1."
vocab = cv.vocabulary_
row = T[1]
assert row[vocab["stale"]] > row[vocab["the"]], "A rare word (stale) outweighs a word in every document (the)."
Z = tfidf(np.array([[0, 0], [1, 2]]))
assert np.allclose(Z[0], 0), "An empty document stays all zeros."`,
            },
          ],
          solution: py`import numpy as np

def tfidf(counts):
    counts = np.asarray(counts, float)
    n = counts.shape[0]
    df = (counts > 0).sum(axis=0)
    idf = np.log((1 + n) / (1 + df)) + 1
    weighted = counts * idf
    norms = np.linalg.norm(weighted, axis=1, keepdims=True)
    norms[norms == 0] = 1
    return weighted / norms
`,
          hint: "df = (counts > 0).sum(axis=0); idf = np.log((1 + n) / (1 + df)) + 1; weighted = counts * idf; divide by the row norms, replacing zero norms with 1 first.",
          successMessage: "Your TF-IDF matches scikit-learn to the last decimal. \"the\" appears in every review and is weighted down; \"stale\" and \"refund\" carry the meaning.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 82 · 18.9 – 18.11
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ml-l82-embeddings-classification",
    moduleId: "ml-m18-nlp",
    sectionId: SECTION_ID,
    order: 4,
    covers: ["18.9", "18.10", "18.11"],
    title: "Word Embeddings, Text Classification and Sentiment Analysis",
    subtitle: "Vectors that capture meaning, and models that read reviews",
    estimatedMinutes: 42,
    intro:
      "Counts cannot tell that \"excellent\" and \"great\" mean nearly the same. Embeddings can. Then you will build text classifiers, including a sentiment model for customer reviews.",

    atoms: [
      {
        id: "a-ml-word-embeddings",
        title: "Word embeddings",
        explain:
          "A WORD EMBEDDING represents each word as a dense vector of, say, 50 to 1,000 numbers, learned so that words used in similar CONTEXTS get similar vectors (\"you shall know a word by the company it keeps\", Firth, 1957). Word2Vec (2013) and GloVe (2014) learn them from billions of words; similarity is measured with COSINE SIMILARITY (Module 3). The vector space captures relationships: king − man + woman ≈ queen. Unlike one-hot or bag-of-words vectors, embeddings are short, dense and meaningful. Their limit: one vector per word, whatever the context (\"bank\" is the same in both senses), which CONTEXTUAL embeddings from Transformers (BERT and its successors) fix by computing a vector for each word IN its sentence.",
        codeExercise: {
          language: PY,
          code: py`import numpy as np

E = {                                    # toy 3-d embeddings: [royalty, gender, food]
    "king":  np.array([0.9, 0.8, 0.0]),
    "queen": np.array([0.9, -0.8, 0.0]),
    "man":   np.array([0.1, 0.8, 0.0]),
    "woman": np.array([0.1, -0.8, 0.0]),
    "rice":  np.array([0.0, 0.0, 0.9]),
}
cos = lambda a, b: float(a @ b / (np.linalg.norm(a) * np.linalg.norm(b)))

print(round(cos(E["king"], E["queen"]), 3), round(cos(E["king"], E["rice"]), 3))
target = E["king"] - E["man"] + E["woman"]
best = max((w for w in E if w not in {"king", "man", "woman"}), key=lambda w: cos(target, E[w]))
print(best, np.round(target, 1))
`,
          question: "With toy embeddings whose dimensions mean royalty, gender and food: how similar are king and queen, king and rice, and what does king − man + woman land nearest?",
          expectedOutput: "0.117 0.0\nqueen [ 0.9 -0.8  0. ]",
          hint: "King and queen share royalty but have opposite gender, so their cosine is small but positive. Rice shares no dimension with king.",
          successMessage: "Subtracting \"man\" and adding \"woman\" moved king exactly onto queen. Real embeddings learn such directions from text alone, in hundreds of dimensions.",
        },
      },
      {
        id: "a-ml-text-classification",
        title: "Text classification",
        explain:
          "A TEXT CLASSIFIER maps a document to a label. The classical pipeline, still hard to beat on small and medium datasets: TfidfVectorizer (with lower-casing, perhaps n-grams and a minimum document frequency) followed by a linear model (LogisticRegression or LinearSVC) or Naive Bayes, all in one Pipeline so the vocabulary is learned from training data only. Evaluate with precision, recall and F1 per class. Inspect the largest coefficients to see which words drive each class, a quick sanity check. For larger data or subtle language, fine-tuning a pretrained Transformer gives the best accuracy at a much higher compute cost.",
        codeChallenge: {
          task:
            "Write build_classifier() that returns make_pipeline(TfidfVectorizer(ngram_range=(1, 2)), LogisticRegression(C=10, max_iter=1000)). Then write top_words(pipeline, k) that, for a FITTED pipeline on binary labels, returns (positive_words, negative_words): the k features with the largest and the k with the smallest coefficients, each list ordered from most extreme inwards.",
          starter: "import numpy as np\nfrom sklearn.pipeline import make_pipeline\nfrom sklearn.feature_extraction.text import TfidfVectorizer\nfrom sklearn.linear_model import LogisticRegression\n\ndef build_classifier():\n    pass\n\ndef top_words(pipeline, k):\n    pass\n",
          sample: "fitted on the reviews: positive words such as \"fast\" and \"excellent\"; negative ones such as \"refund\" and \"delivery\"…",
          tests: [
            {
              check: REVIEWS + py`
clf = build_classifier().fit(texts, labels)
assert clf.score(texts, labels) == 1.0, "The pipeline should fit the training reviews."
pos, neg = top_words(clf, 5)
assert len(pos) == 5 and len(neg) == 5, "k words each."
names = clf[0].get_feature_names_out()
coef = clf[-1].coef_[0]
assert pos == [names[i] for i in np.argsort(coef)[::-1][:5]] and neg == [names[i] for i in np.argsort(coef)[:5]], "Largest and smallest coefficients, most extreme first."
preds = clf.predict(["fast delivery and excellent rice", "terrible rude rider, cold food"]).tolist()
assert preds == [1, 0], "New reviews should be classified correctly. Got " + repr(preds)`,
            },
          ],
          solution: py`import numpy as np
from sklearn.pipeline import make_pipeline
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression

def build_classifier():
    return make_pipeline(TfidfVectorizer(ngram_range=(1, 2)), LogisticRegression(C=10, max_iter=1000))

def top_words(pipeline, k):
    names = pipeline[0].get_feature_names_out()
    coef = pipeline[-1].coef_[0]
    order = np.argsort(coef)
    return [names[i] for i in order[::-1][:k]], [names[i] for i in order[:k]]
`,
          hint: "pipeline[0] is the vectoriser (get_feature_names_out) and pipeline[-1] the classifier (coef_[0]). np.argsort(coef) sorts ascending: its end gives the most positive words.",
          successMessage: "Twenty reviews were enough to learn useful words in both directions. Inspecting top coefficients is how you catch a model that has learned something silly.",
        },
      },
      {
        id: "a-ml-sentiment-analysis",
        title: "Sentiment analysis",
        explain:
          "SENTIMENT ANALYSIS classifies the opinion in text as positive, negative (and often neutral), or scores it on a scale, or per ASPECT (\"great food, slow delivery\": positive on food, negative on delivery). Businesses use it to monitor reviews, social media and support tickets. The difficulties are linguistic: NEGATION (\"not good\"), INTENSIFIERS (\"very\", \"extremely\"), SARCASM (\"great, another two-hour delay\"), domain words (\"cold\" is bad for food, fine for drinks), and code-switched text (\"the food sweet die\" is strong Pidgin praise). Approaches range from word lists (lexicons such as VADER) through TF-IDF classifiers with n-grams (which catch \"not good\") to fine-tuned Transformers, which handle context best.",
        codeChallenge: {
          task:
            "Write sentiment_report(texts, labels, new_reviews) that fits make_pipeline(TfidfVectorizer(ngram_range=(1, 2)), LogisticRegression(C=10, max_iter=1000)) on the labelled reviews, and returns a list of (review, label, probability) tuples for new_reviews, where label is \"positive\" or \"negative\" and probability is the predicted probability of that label, rounded to 2.",
          starter: "from sklearn.pipeline import make_pipeline\nfrom sklearn.feature_extraction.text import TfidfVectorizer\nfrom sklearn.linear_model import LogisticRegression\n\ndef sentiment_report(texts, labels, new_reviews):\n    pass\n",
          sample: "(\"quick delivery and polite rider\", \"positive\", 0.7)",
          tests: [
            {
              check: REVIEWS + py`
new = ["quick delivery and polite rider", "the rice was stale and cold", "not good, very late delivery"]
r = sentiment_report(texts, labels, new)
assert [x[0] for x in r] == new, "Return one tuple per new review, in order."
assert [x[1] for x in r] == ["positive", "negative", "negative"], "Got " + repr([x[1] for x in r])
assert all(0.5 <= x[2] <= 1 for x in r), "The probability is that of the predicted label, so at least 0.5."
assert all(round(x[2], 2) == x[2] for x in r), "Round to 2 decimals."`,
            },
          ],
          solution: py`from sklearn.pipeline import make_pipeline
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression

def sentiment_report(texts, labels, new_reviews):
    model = make_pipeline(TfidfVectorizer(ngram_range=(1, 2)), LogisticRegression(C=10, max_iter=1000))
    model.fit(texts, labels)
    out = []
    for review, p in zip(new_reviews, model.predict_proba(new_reviews)[:, 1]):
        label = "positive" if p >= 0.5 else "negative"
        out.append((review, label, round(float(max(p, 1 - p)), 2)))
    return out
`,
          hint: "predict_proba(new)[:, 1] is P(positive). The label is positive when that is at least 0.5, and the reported probability is max(p, 1 − p).",
          successMessage: "A sentiment model in a few lines, with confidence attached. With thousands of real reviews instead of twenty, the same pipeline becomes a useful monitoring tool.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 83 · 18.12 – 18.13
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ml-l83-attention-transformers",
    moduleId: "ml-m18-nlp",
    sectionId: SECTION_ID,
    order: 5,
    covers: ["18.12", "18.13"],
    title: "Attention Mechanisms and Transformers",
    subtitle: "Every word looking at every other word: the architecture behind modern AI",
    estimatedMinutes: 44,
    intro:
      "In 2017 a paper titled \"Attention Is All You Need\" introduced the Transformer. It now powers translation, search, ChatGPT, Claude and Gemini. Its core, scaled dot-product attention, is a few lines of matrix algebra you can write today.",

    atoms: [
      {
        id: "a-ml-attention",
        title: "Introduction to attention mechanisms",
        explain:
          "ATTENTION lets each position in a sequence build its new representation as a WEIGHTED AVERAGE of all positions, with weights computed from how relevant each one is. Every token produces three vectors through learned weight matrices: a QUERY (what am I looking for?), a KEY (what do I contain?) and a VALUE (what do I pass on?). Relevance is the dot product of a query with each key, scaled by √dₖ to keep softmax well-behaved, then turned into weights by SOFTMAX: Attention(Q, K, V) = softmax(QKᵀ / √dₖ) V. In \"the rider was rude because he was late\", the query of \"he\" matches the key of \"rider\" strongly, so \"he\" absorbs information from \"rider\": context resolved in one step, regardless of distance.",
        codeChallenge: {
          task:
            "Write attention(Q, K, V, mask=None) that computes scaled dot-product attention for 2-D arrays: scores = Q Kᵀ / √d_k (d_k is K's number of columns); where mask is given (a boolean array, True = allowed), set disallowed scores to −1e9; apply a numerically stable softmax along each ROW to get the weights; return (weights @ V, weights). Then write causal_mask(n) returning the n × n boolean lower-triangular mask (position i may attend to positions 0 … i), as used by text-generating models.",
          starter: "import numpy as np\n\ndef attention(Q, K, V, mask=None):\n    pass\n\ndef causal_mask(n):\n    pass\n",
          sample: "a query identical to one key puts almost all its weight on that position",
          tests: [
            {
              check: py`import numpy as np
rng = np.random.default_rng(0)
Q, K, V = rng.normal(size=(4, 8)), rng.normal(size=(4, 8)), rng.normal(size=(4, 3))
out, w = attention(Q, K, V)
assert out.shape == (4, 3) and w.shape == (4, 4), "Output (n, d_v) and weights (n, n)."
assert np.allclose(w.sum(axis=1), 1) and (w >= 0).all(), "Each row of weights is a probability distribution."
s = Q @ K.T / np.sqrt(8)
e = np.exp(s - s.max(axis=1, keepdims=True))
assert np.allclose(w, e / e.sum(axis=1, keepdims=True)) and np.allclose(out, w @ V), "softmax(QKᵀ/√d_k) V."
Kc = np.eye(3) * 10
_, w2 = attention(np.array([[10.0, 0, 0]]), Kc, np.eye(3))
assert w2[0, 0] > 0.99, "A query matching key 0 should attend almost only to position 0."
m = causal_mask(4)
assert m.tolist() == [[True, False, False, False], [True, True, False, False], [True, True, True, False], [True, True, True, True]], "Lower-triangular causal mask."
_, wm = attention(Q, K, V, mask=m)
assert np.allclose(np.triu(wm, 1), 0) and np.allclose(wm.sum(axis=1), 1), "Masked positions get zero weight; rows still sum to 1."`,
            },
          ],
          solution: py`import numpy as np

def attention(Q, K, V, mask=None):
    scores = Q @ K.T / np.sqrt(K.shape[1])
    if mask is not None:
        scores = np.where(mask, scores, -1e9)
    e = np.exp(scores - scores.max(axis=1, keepdims=True))
    weights = e / e.sum(axis=1, keepdims=True)
    return weights @ V, weights

def causal_mask(n):
    return np.tril(np.ones((n, n), dtype=bool))
`,
          hint: "scores = Q @ K.T / np.sqrt(K.shape[1]); np.where(mask, scores, -1e9) blocks disallowed positions; a row-wise stable softmax; then weights @ V. np.tril builds the lower triangle.",
          successMessage: "That is the computation at the heart of every Transformer. The causal mask is what stops a language model peeking at the words it is supposed to predict.",
        },
      },
      {
        id: "a-ml-transformers",
        title: "Introduction to Transformers",
        explain:
          "A TRANSFORMER stacks identical blocks, each containing MULTI-HEAD SELF-ATTENTION (several attention operations in parallel, each head free to track a different relationship such as grammar or reference) followed by a position-wise FEED-FORWARD network, with RESIDUAL connections and LAYER NORMALISATION around both. Attention ignores order, so POSITIONAL ENCODINGS are added to the token embeddings. ENCODER models (BERT) read a whole text bidirectionally and suit classification and search; DECODER models (GPT, Claude, Llama) use a causal mask and generate text one token at a time; ENCODER-DECODER models (T5, the original Transformer) suit translation. Transformers process all positions in parallel (fast on GPUs), connect distant words directly, and scale remarkably: more data, parameters and compute keep improving them, which is what made large language models possible (Module 23).",
        example:
          "from transformers import pipeline        # Hugging Face, on your own machine or Colab\n\nclassifier = pipeline(\"sentiment-analysis\")   # a pretrained Transformer\nprint(classifier(\"The delivery was late but the food was amazing\"))\n# [{'label': 'POSITIVE', 'score': 0.99...}]",
        codeExercise: {
          language: PY,
          code: py`d_model, heads, d_ff, vocab, layers = 512, 8, 2048, 32000, 6

d_head = d_model // heads
attention_params = 4 * (d_model * d_model + d_model)     # Q, K, V and output projections
ffn_params = d_model * d_ff + d_ff + d_ff * d_model + d_model
block = attention_params + ffn_params + 2 * 2 * d_model  # plus two layer norms
embeddings = vocab * d_model

print(d_head)
print(attention_params, ffn_params)
print(f"{layers * block + embeddings:,}")
`,
          question: "The original Transformer's sizes: 512-dimensional tokens, 8 heads, a 2,048-unit feed-forward layer, 6 blocks and a 32,000-token vocabulary. What are the size of each head, the attention and feed-forward parameter counts per block, and the total?",
          expectedOutput: "64\n1050624 2099712\n35,298,304",
          hint: "Each head works in 512 / 8 dimensions. Attention has four 512 × 512 projections with biases; the feed-forward layer goes 512 → 2048 → 512.",
          successMessage: "About 35 million parameters, two thirds of each block in the feed-forward layer. Today's large language models use the same blocks, scaled to billions of parameters and trillions of training tokens.",
        },
      },
    ],

    task: {
      title: "Module 18 project: a customer review sentiment system",
      intro:
        "Build a sentiment analysis system for customer reviews of a Nigerian business (scraped or exported reviews from Google Maps, Jumia or app stores, labelled by star rating), from raw text to an evaluated model.",
      prompts: [
        "Collect at least 1,000 reviews; label 4–5 stars positive, 1–2 negative, and set 3-star reviews aside or treat them as neutral.",
        "Clean the text with a function you can justify for sentiment (keeping negations and placeholders for numbers and links).",
        "Train bag-of-words, TF-IDF unigram and TF-IDF uni+bigram models with logistic regression; compare F1 with cross-validation.",
        "Inspect the top positive and negative words, and test the model on negations, sarcasm and Pidgin examples you write yourself.",
        "On your own machine or Colab, run a pretrained Transformer sentiment model on the same test set and compare.",
        "Report the final model's precision, recall and F1, ten misclassified reviews, and what would improve it.",
      ],
      closing: "Month 4 is complete: you can build neural networks for images, sequences and text. Month 5 takes models out of notebooks and into applications that people use.",
    },

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
