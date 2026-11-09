/**
 * MACHINE LEARNING AND AI · MODULE 19 · INTRODUCTION TO MODEL DEPLOYMENT
 *
 * Curriculum 19.1 – 19.10. Deployment; training versus inference; saving and
 * loading models; APIs and REST; building APIs with FastAPI; accepting
 * inputs; returning predictions; validation and error handling.
 *
 * FastAPI and pydantic are REAL here: they run in the page's Python. The
 * learner writes actual FastAPI apps; the tests call the endpoint functions
 * and pydantic models directly and inspect the app's registered routes (an
 * in-browser HTTP test client would need threads, which the page's Python
 * does not have). Running the same app with uvicorn on a laptop serves it
 * over HTTP unchanged.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

export const SECTION_ID = "ml-s19-deployment";

const PY = "python";
const py = String.raw;

// A small trained house-price pipeline, shared by several checks.
const MODEL = py`import numpy as np
import pandas as pd
from sklearn.pipeline import make_pipeline
from sklearn.compose import make_column_transformer
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.linear_model import Ridge
_rng = np.random.default_rng(19)
_n = 300
houses = pd.DataFrame({
    "size_m2": _rng.uniform(40, 250, _n).round(),
    "bedrooms": _rng.integers(1, 6, _n),
    "area": _rng.choice(["Lekki", "Yaba", "Ikeja"], _n),
})
price = (0.3 * houses["size_m2"] + 4 * houses["bedrooms"] + houses["area"].map({"Lekki": 25, "Yaba": 5, "Ikeja": 12}) + _rng.normal(0, 4, _n)).round(1)
model = make_pipeline(
    make_column_transformer((StandardScaler(), ["size_m2", "bedrooms"]), (OneHotEncoder(handle_unknown="ignore"), ["area"])),
    Ridge(alpha=1.0),
).fit(houses, price)
`;

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 84 · 19.1 – 19.2
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ml-l84-deployment-inference",
    moduleId: "ml-m19-deployment",
    sectionId: SECTION_ID,
    order: 1,
    covers: ["19.1", "19.2"],
    title: "Model Deployment, Training and Inference",
    subtitle: "From a notebook to something people and systems can use",
    estimatedMinutes: 34,
    intro:
      "A model in a notebook helps nobody. Deployment puts it where decisions happen: behind an API a mobile app calls, inside a nightly batch job, or on a phone. This lesson frames the choices before you build.",

    atoms: [
      {
        id: "a-ml-model-deployment",
        title: "What is model deployment?",
        explain:
          "DEPLOYMENT makes a trained model available to produce predictions in a real system. Common patterns: ONLINE (real-time) serving behind an API, answering each request in milliseconds (a loan app scoring an applicant while they wait); BATCH prediction on a schedule, writing results to a database (scoring every customer's churn risk each night); STREAMING, scoring events as they flow (card transactions); and EDGE deployment on the device itself (a crop-disease model running offline on a farmer's phone). Choose by latency needs, request volume, connectivity and cost. Deployment also means packaging, versioning, monitoring and updating the model, the subject of Module 21. Industry surveys repeatedly find that many trained models never reach production; engineering, not modelling, is usually the obstacle.",
        decision: {
          scenario: "A microfinance bank wants a default-risk score for each of its 400,000 customers, used by loan officers each morning to plan visits. Scores do not need to change during the day.",
          question: "Which deployment pattern fits best?",
          options: [
            { id: "a", text: "Real-time API called for every customer view", whyWrong: "It works, but adds serving infrastructure and latency for scores that change only daily." },
            { id: "b", text: "A nightly batch job that writes every score to the database", why: "Daily-fresh scores, simple infrastructure, and officers read them instantly from the database." },
            { id: "c", text: "Edge deployment on each officer's phone", whyWrong: "The officers need scores for all customers, computed centrally from the bank's data." },
            { id: "d", text: "Streaming on every transaction", whyWrong: "Unnecessary complexity for a once-a-day decision." },
          ],
          correct: "b",
          aftermath: "Match the pattern to how fresh the prediction must be: per request (online), per event (streaming), or per schedule (batch).",
        },
      },
      {
        id: "a-ml-training-vs-inference",
        title: "Training vs inference",
        explain:
          "TRAINING learns the parameters: it runs rarely (weekly, monthly), on historical data, often on powerful hardware, and can take hours. INFERENCE (prediction, scoring) applies the learned model to NEW inputs: it runs constantly, must be fast and reliable, and usually runs on modest servers or devices. Inference must reproduce EXACTLY the preprocessing used in training (the same imputation values, scaler statistics, category encodings, feature order), which is why the whole Pipeline is saved and served, never re-fitted at prediction time. Mismatches between training and serving (TRAINING-SERVING SKEW) are among the most common production bugs: a feature computed slightly differently online silently ruins accuracy.",
        codeExercise: {
          language: PY,
          code: MODEL + py`new = pd.DataFrame([
    {"size_m2": 120, "bedrooms": 3, "area": "Lekki"},
    {"size_m2": 120, "bedrooms": 3, "area": "Surulere"},   # an area never seen in training
])
print(model.predict(new).round(1))

scaler = model[0].named_transformers_["standardscaler"]
print(scaler.mean_.round(1))
`,
          question: "The saved pipeline scores two new houses, one in an area it never saw. What does it predict, and what training statistics does its scaler still hold?",
          expectedOutput: "[72.  61.7]\n[145.5   3.1]",
          hint: "The unseen area is one-hot encoded as all zeros, so it gets no area premium. The scaler kept the TRAINING means of size and bedrooms.",
          successMessage: "Inference reused the training means and the training categories exactly. Re-fitting the scaler on these two houses would have produced different, wrong predictions.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 85 · 19.3 – 19.4
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ml-l85-saving-loading",
    moduleId: "ml-m19-deployment",
    sectionId: SECTION_ID,
    order: 2,
    covers: ["19.3", "19.4"],
    title: "Saving and Loading Trained Models",
    subtitle: "Serialising a pipeline with its metadata, and loading it safely",
    estimatedMinutes: 34,
    intro:
      "The bridge between training and serving is a file. What goes into it, and what you check when loading it, decides whether production predictions match the ones you evaluated.",

    atoms: [
      {
        id: "a-ml-saving-models",
        title: "Saving trained models",
        explain:
          "scikit-learn models are saved with joblib.dump(pipeline, \"model.joblib\") (efficient for the NumPy arrays inside) or Python's pickle; PyTorch saves state dicts (Module 15); ONNX is a framework-neutral format for serving anywhere. Save the WHOLE pipeline, preprocessing included. Save METADATA beside it: model version, training date, library versions (a model pickled with scikit-learn 1.8 may not load in 1.3), the feature names and order, the target, evaluation metrics, and the training data's version. Two cautions: never load a pickle from an untrusted source, because unpickling can execute arbitrary code; and version every saved model rather than overwriting the old one.",
        codeChallenge: {
          task:
            "Write save_bundle(model, features, metrics, path) that saves, with joblib.dump, a dictionary {\"model\": model, \"features\": features, \"metrics\": metrics, \"sklearn_version\": sklearn.__version__, \"version\": \"1.0.0\"} to path, and returns the dictionary WITHOUT the model (the metadata).",
          starter: "import joblib\nimport sklearn\n\ndef save_bundle(model, features, metrics, path):\n    pass\n",
          sample: "save_bundle(model, [\"size_m2\", \"bedrooms\", \"area\"], {\"mae\": 3.2}, \"house_model.joblib\") → {\"features\": [...], \"metrics\": {...}, \"sklearn_version\": \"1.8.0\", \"version\": \"1.0.0\"}",
          tests: [
            {
              check: MODEL + py`
import joblib, sklearn, os
meta = save_bundle(model, ["size_m2", "bedrooms", "area"], {"mae": 3.2}, "house_model.joblib")
assert os.path.exists("house_model.joblib"), "Write the file with joblib.dump."
assert "model" not in meta and meta == {"features": ["size_m2", "bedrooms", "area"], "metrics": {"mae": 3.2}, "sklearn_version": sklearn.__version__, "version": "1.0.0"}, "Return the metadata without the model. Got " + repr(meta)
b = joblib.load("house_model.joblib")
assert set(b) == {"model", "features", "metrics", "sklearn_version", "version"}, "The saved bundle holds the model and its metadata."
assert np.allclose(b["model"].predict(houses.head(3)), model.predict(houses.head(3))), "The saved model predicts exactly like the original."`,
            },
          ],
          solution: py`import joblib
import sklearn

def save_bundle(model, features, metrics, path):
    bundle = {
        "model": model,
        "features": features,
        "metrics": metrics,
        "sklearn_version": sklearn.__version__,
        "version": "1.0.0",
    }
    joblib.dump(bundle, path)
    return {k: v for k, v in bundle.items() if k != "model"}
`,
          hint: "Build the dictionary, joblib.dump(bundle, path), then return a copy without the \"model\" key.",
          successMessage: "One file holds the pipeline and everything needed to trust it: which features, in what order, how good it was, and which library version produced it.",
        },
      },
      {
        id: "a-ml-loading-models",
        title: "Loading models into applications",
        explain:
          "An application loads the model ONCE at startup (not on every request, which would be slow), checks it before serving: the library version matches, the expected features are present, and a smoke-test prediction on a known example gives the known answer. Then every request reuses the loaded object. Inputs must be arranged exactly as in training: the same feature names, order and types, which is easiest when the pipeline accepts a DataFrame built from the request's fields. If the checks fail, the service should refuse to start rather than serve wrong predictions.",
        codeChallenge: {
          task:
            "Write load_bundle(path, expected_features) that loads a bundle saved by save_bundle with joblib.load, raises ValueError(\"version mismatch\") if its sklearn_version differs from the installed sklearn.__version__, raises ValueError(\"feature mismatch\") if its features differ from expected_features, and otherwise returns the bundle. Then write predict_one(bundle, record) that builds a one-row DataFrame from the record dictionary with columns in bundle[\"features\"] order and returns the prediction as a float rounded to 1.",
          starter: "import joblib\nimport sklearn\nimport pandas as pd\n\ndef load_bundle(path, expected_features):\n    pass\n\ndef predict_one(bundle, record):\n    pass\n",
          sample: "predict_one(bundle, {\"area\": \"Lekki\", \"size_m2\": 120, \"bedrooms\": 3}) → 72.0",
          tests: [
            {
              check: MODEL + py`
import joblib, sklearn
feats = ["size_m2", "bedrooms", "area"]
joblib.dump({"model": model, "features": feats, "metrics": {}, "sklearn_version": sklearn.__version__, "version": "1.0.0"}, "ok.joblib")
b = load_bundle("ok.joblib", feats)
assert predict_one(b, {"area": "Lekki", "size_m2": 120, "bedrooms": 3}) == 72.0, "Columns are reordered to the training order. Got " + repr(predict_one(b, {"area": "Lekki", "size_m2": 120, "bedrooms": 3}))
assert isinstance(predict_one(b, {"size_m2": 60, "bedrooms": 1, "area": "Yaba"}), float), "Return a plain float."
joblib.dump({"model": model, "features": feats, "metrics": {}, "sklearn_version": "0.1.0", "version": "1.0.0"}, "old.joblib")
try:
    load_bundle("old.joblib", feats)
    assert False, "A bundle from another scikit-learn version must be refused."
except ValueError as e:
    assert "version" in str(e), "The error should mention the version."
try:
    load_bundle("ok.joblib", ["size_m2", "area"])
    assert False, "A feature list that differs must be refused."
except ValueError as e:
    assert "feature" in str(e), "The error should mention the features."`,
            },
          ],
          solution: py`import joblib
import sklearn
import pandas as pd

def load_bundle(path, expected_features):
    bundle = joblib.load(path)
    if bundle["sklearn_version"] != sklearn.__version__:
        raise ValueError("version mismatch")
    if list(bundle["features"]) != list(expected_features):
        raise ValueError("feature mismatch")
    return bundle

def predict_one(bundle, record):
    row = pd.DataFrame([{f: record[f] for f in bundle["features"]}])
    return round(float(bundle["model"].predict(row)[0]), 1)
`,
          hint: "Compare bundle[\"sklearn_version\"] with sklearn.__version__ and list(bundle[\"features\"]) with expected_features. For prediction: pd.DataFrame([{f: record[f] for f in bundle[\"features\"]}]).",
          successMessage: "Refusing to start on a mismatch is far better than silently serving wrong predictions. These checks belong in every model service's startup.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 86 · 19.5 – 19.7
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ml-l86-apis-rest-fastapi",
    moduleId: "ml-m19-deployment",
    sectionId: SECTION_ID,
    order: 3,
    covers: ["19.5", "19.6", "19.7"],
    title: "APIs, REST and FastAPI",
    subtitle: "How applications ask a model for predictions",
    estimatedMinutes: 40,
    intro:
      "A mobile app, a website and a partner's system all need the same model. An API gives them one well-defined way to ask. FastAPI, the most popular Python framework for ML APIs, runs right here in the page.",

    atoms: [
      {
        id: "a-ml-apis",
        title: "Introduction to APIs",
        explain:
          "An API (application programming interface) is a contract for how one program asks another for something. A WEB API is reached over HTTP: the CLIENT (a React app, a mobile app, another service) sends a REQUEST to a URL, and the SERVER (your model service) returns a RESPONSE. Data travels as JSON, a text format of objects and lists that every language can read. An API decouples the model from its users: the frontend team needs only the contract (URL, input fields, output fields), and the model can be retrained or replaced behind it without changing any client.",
        codeExercise: {
          language: PY,
          code: py`import json

request_body = '{"size_m2": 120, "bedrooms": 3, "area": "Lekki"}'
data = json.loads(request_body)
print(type(data).__name__, data["bedrooms"] + 1)

response = {"predicted_price": 72.0, "currency": "NGN_million", "model_version": "1.0.0"}
text = json.dumps(response)
print(text)
print(json.loads(text)["predicted_price"] == 72.0)
`,
          question: "A request body arrives as JSON text and the response goes back as JSON text. What does it print?",
          expectedOutput: "dict 4\n{\"predicted_price\": 72.0, \"currency\": \"NGN_million\", \"model_version\": \"1.0.0\"}\nTrue",
          hint: "json.loads turns text into Python objects; json.dumps turns them back into text.",
          successMessage: "JSON in, JSON out: the language-neutral format that lets a JavaScript frontend talk to a Python model.",
        },
      },
      {
        id: "a-ml-rest",
        title: "REST API fundamentals",
        explain:
          "REST is a set of conventions for web APIs. URLs name RESOURCES (/models, /predictions/42); HTTP METHODS say what to do: GET reads (safe, no changes), POST creates or submits (such as a prediction request), PUT replaces, PATCH updates part, DELETE removes. STATUS CODES report the outcome: 200 OK, 201 Created, 400 Bad Request (malformed input), 401 Unauthorized (no or bad credentials), 404 Not Found, 422 Unprocessable Entity (well-formed but invalid input), 429 Too Many Requests, 500 Internal Server Error. Requests are STATELESS: each carries everything needed. A typical ML API: GET /health for monitoring, GET /model for its version and metrics, POST /predict for predictions.",
        codeChallenge: {
          task:
            "Write status_for(situation) that returns the right HTTP status code for each situation: \"ok\" → 200, \"created\" → 201, \"malformed_json\" → 400, \"missing_api_key\" → 401, \"unknown_route\" → 404, \"invalid_field_value\" → 422, \"rate_limited\" → 429, \"model_crashed\" → 500; raise KeyError for anything else. Then write method_for(action) returning \"GET\" for \"read\", \"POST\" for \"submit\", \"PUT\" for \"replace\", \"PATCH\" for \"update_part\" and \"DELETE\" for \"remove\".",
          starter: "def status_for(situation):\n    pass\n\ndef method_for(action):\n    pass\n",
          sample: "status_for(\"invalid_field_value\") → 422; method_for(\"submit\") → \"POST\"",
          tests: [
            {
              check: py`codes = {"ok": 200, "created": 201, "malformed_json": 400, "missing_api_key": 401, "unknown_route": 404, "invalid_field_value": 422, "rate_limited": 429, "model_crashed": 500}
for k, v in codes.items():
    assert status_for(k) == v, "status_for(" + repr(k) + ") should be " + str(v) + ". Got " + repr(status_for(k))
try:
    status_for("teapot")
    assert False, "Unknown situations raise KeyError."
except KeyError:
    pass
assert [method_for(a) for a in ["read", "submit", "replace", "update_part", "remove"]] == ["GET", "POST", "PUT", "PATCH", "DELETE"], "HTTP methods."`,
            },
          ],
          solution: py`STATUS = {"ok": 200, "created": 201, "malformed_json": 400, "missing_api_key": 401,
          "unknown_route": 404, "invalid_field_value": 422, "rate_limited": 429, "model_crashed": 500}
METHODS = {"read": "GET", "submit": "POST", "replace": "PUT", "update_part": "PATCH", "remove": "DELETE"}

def status_for(situation):
    return STATUS[situation]

def method_for(action):
    return METHODS[action]
`,
          hint: "Two dictionaries; indexing a dictionary with a missing key raises KeyError by itself.",
          successMessage: "A client can act on status codes without parsing messages: retry on 429, fix the input on 422, alert on 500. Using them correctly is part of the API contract.",
        },
      },
      {
        id: "a-ml-fastapi",
        title: "Building APIs with FastAPI",
        explain:
          "FastAPI builds web APIs from ordinary Python functions with type hints. app = FastAPI(title=...) creates the application; a DECORATOR registers a function for a method and path: @app.get(\"/health\") or @app.post(\"/predict\"). The function's return value (a dict or a pydantic model) is sent as JSON. FastAPI reads the type hints to VALIDATE inputs automatically and generates interactive documentation at /docs. It is ASYNC-capable and fast, and you run it with an ASGI server: uvicorn main:app --reload. Load the model once at module level (or in a startup hook), outside the endpoint functions.",
        example:
          "# main.py: run with  uvicorn main:app --reload  then open http://127.0.0.1:8000/docs\nfrom fastapi import FastAPI\n\napp = FastAPI(title=\"House Price API\", version=\"1.0.0\")\n\n@app.get(\"/health\")\ndef health():\n    return {\"status\": \"ok\"}",
        codeChallenge: {
          task:
            "Create a FastAPI app named app with title \"House Price API\". Register GET /health returning {\"status\": \"ok\"} (function health) and GET /model returning {\"name\": \"house-price\", \"version\": \"1.0.0\", \"features\": [\"size_m2\", \"bedrooms\", \"area\"]} (function model_info).",
          starter: "from fastapi import FastAPI\n\n",
          sample: "health() → {\"status\": \"ok\"}; app has routes GET /health and GET /model",
          tests: [
            {
              check: py`from fastapi import FastAPI
assert isinstance(app, FastAPI) and app.title == "House Price API", "Create app = FastAPI(title=\"House Price API\")."
routes = {r.path: r.methods for r in app.routes if hasattr(r, "methods")}
assert "/health" in routes and "GET" in routes["/health"], "Register GET /health. Routes found: " + repr(routes)
assert "/model" in routes and "GET" in routes["/model"], "Register GET /model."
assert health() == {"status": "ok"}, "health() returns {\"status\": \"ok\"}."
assert model_info() == {"name": "house-price", "version": "1.0.0", "features": ["size_m2", "bedrooms", "area"]}, "Got " + repr(model_info())`,
            },
          ],
          solution: py`from fastapi import FastAPI

app = FastAPI(title="House Price API")

@app.get("/health")
def health():
    return {"status": "ok"}

@app.get("/model")
def model_info():
    return {"name": "house-price", "version": "1.0.0", "features": ["size_m2", "bedrooms", "area"]}
`,
          hint: "app = FastAPI(title=\"House Price API\"), then decorate each function with @app.get(\"/health\") and @app.get(\"/model\").",
          successMessage: "A real FastAPI application. Saved as main.py and started with uvicorn, it would serve these routes and generate /docs automatically.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 87 · 19.8 – 19.10
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ml-l87-inputs-predictions-errors",
    moduleId: "ml-m19-deployment",
    sectionId: SECTION_ID,
    order: 4,
    covers: ["19.8", "19.9", "19.10"],
    title: "Inputs, Predictions, Validation and Errors",
    subtitle: "A prediction endpoint that accepts only sensible input and fails clearly",
    estimatedMinutes: 44,
    intro:
      "The internet sends anything: missing fields, text where numbers belong, a house with -3 bedrooms. A production endpoint validates every input, returns predictions in a stable shape, and explains its errors.",

    atoms: [
      {
        id: "a-ml-accepting-inputs",
        title: "Accepting user inputs",
        explain:
          "FastAPI uses PYDANTIC models to describe request bodies: a class inheriting from BaseModel, one typed field per input. Field(...) adds constraints: gt / ge / lt / le for numeric ranges, min_length / max_length for strings, pattern for regular expressions, and Literal[\"Lekki\", \"Yaba\", \"Ikeja\"] restricts a field to fixed choices. When a POST /predict function takes a parameter of that type, FastAPI parses the JSON body into it and AUTOMATICALLY returns 422 with a description of each problem if validation fails, before your code runs. Pydantic also coerces where safe (\"3\" → 3) and rejects what it cannot.",
        codeChallenge: {
          task:
            "Write a pydantic model HouseIn with three fields: size_m2, a float strictly greater than 10 and at most 2000; bedrooms, an int from 1 to 10 inclusive; and area, one of the literals \"Lekki\", \"Yaba\" or \"Ikeja\". Use Field for the constraints and typing.Literal for the area.",
          starter: "from typing import Literal\nfrom pydantic import BaseModel, Field\n\n",
          sample: "HouseIn(size_m2=120, bedrooms=3, area=\"Lekki\") is valid; HouseIn(size_m2=120, bedrooms=0, area=\"Lekki\") raises ValidationError",
          tests: [
            {
              check: py`from pydantic import ValidationError
h = HouseIn(size_m2=120, bedrooms=3, area="Lekki")
assert h.size_m2 == 120.0 and h.bedrooms == 3 and h.area == "Lekki", "A valid house."
assert HouseIn(size_m2="85.5", bedrooms="2", area="Yaba").bedrooms == 2, "Pydantic converts numeric strings."
bad = [dict(size_m2=5, bedrooms=3, area="Lekki"), dict(size_m2=120, bedrooms=0, area="Lekki"), dict(size_m2=120, bedrooms=11, area="Lekki"),
       dict(size_m2=120, bedrooms=3, area="Abuja"), dict(size_m2=3000, bedrooms=3, area="Ikeja"), dict(bedrooms=3, area="Ikeja")]
for b in bad:
    try:
        HouseIn(**b)
        assert False, "This input must be rejected: " + repr(b)
    except ValidationError:
        pass
assert HouseIn(size_m2=2000, bedrooms=10, area="Ikeja").bedrooms == 10, "2000 m² and 10 bedrooms are allowed (inclusive limits)."`,
            },
          ],
          solution: py`from typing import Literal
from pydantic import BaseModel, Field

class HouseIn(BaseModel):
    size_m2: float = Field(gt=10, le=2000)
    bedrooms: int = Field(ge=1, le=10)
    area: Literal["Lekki", "Yaba", "Ikeja"]
`,
          hint: "size_m2: float = Field(gt=10, le=2000); bedrooms: int = Field(ge=1, le=10); area: Literal[\"Lekki\", \"Yaba\", \"Ikeja\"].",
          successMessage: "Six kinds of bad input rejected before any model code runs. In FastAPI each would become a 422 response listing exactly which field was wrong.",
        },
      },
      {
        id: "a-ml-returning-predictions",
        title: "Returning model predictions",
        explain:
          "Define the RESPONSE shape too, with a pydantic model passed as response_model=, so every client gets the same fields with the same types. A good prediction response includes: the PREDICTION itself in business units (naira, not a scaled value); for classifiers, the PROBABILITY or score; the MODEL VERSION that produced it, essential for debugging and auditing; and optionally an ID for the prediction (to link later feedback) or a short explanation. Round and format sensibly, and never leak internal details such as stack traces in the response.",
        codeChallenge: {
          task:
            "The starter provides the trained pipeline as model and HouseIn. Create app = FastAPI(), a pydantic model PriceOut with fields predicted_price (float), currency (str) and model_version (str), and an endpoint POST /predict (function predict, taking house: HouseIn, with response_model=PriceOut) that builds a one-row DataFrame from house.model_dump() and returns PriceOut(predicted_price=prediction rounded to 1, currency=\"NGN_million\", model_version=\"1.0.0\").",
          starter: MODEL + py`from typing import Literal
from fastapi import FastAPI
from pydantic import BaseModel, Field

class HouseIn(BaseModel):
    size_m2: float = Field(gt=10, le=2000)
    bedrooms: int = Field(ge=1, le=10)
    area: Literal["Lekki", "Yaba", "Ikeja"]

`,
          sample: "predict(HouseIn(size_m2=120, bedrooms=3, area=\"Lekki\")) → PriceOut(predicted_price=72.0, currency=\"NGN_million\", model_version=\"1.0.0\")",
          tests: [
            {
              check: py`out = predict(HouseIn(size_m2=120, bedrooms=3, area="Lekki"))
assert isinstance(out, PriceOut), "Return a PriceOut."
assert out.predicted_price == 72.0 and out.currency == "NGN_million" and out.model_version == "1.0.0", "Got " + repr(out)
routes = [r for r in app.routes if getattr(r, "path", "") == "/predict"]
assert routes and "POST" in routes[0].methods, "Register POST /predict."
assert routes[0].response_model is PriceOut, "Declare response_model=PriceOut."
assert predict(HouseIn(size_m2=60, bedrooms=1, area="Yaba")).predicted_price < out.predicted_price, "A small Yaba flat costs less than a 3-bedroom in Lekki."`,
            },
          ],
          solution: MODEL + py`from typing import Literal
from fastapi import FastAPI
from pydantic import BaseModel, Field

class HouseIn(BaseModel):
    size_m2: float = Field(gt=10, le=2000)
    bedrooms: int = Field(ge=1, le=10)
    area: Literal["Lekki", "Yaba", "Ikeja"]

class PriceOut(BaseModel):
    predicted_price: float
    currency: str
    model_version: str

app = FastAPI()

@app.post("/predict", response_model=PriceOut)
def predict(house: HouseIn):
    row = pd.DataFrame([house.model_dump()])
    price = round(float(model.predict(row)[0]), 1)
    return PriceOut(predicted_price=price, currency="NGN_million", model_version="1.0.0")
`,
          hint: "class PriceOut(BaseModel) with the three typed fields; @app.post(\"/predict\", response_model=PriceOut) above def predict(house: HouseIn); inside, pd.DataFrame([house.model_dump()]).",
          successMessage: "A validated input model, a typed response model, and a pipeline doing the work: that is a production-shaped prediction endpoint.",
        },
      },
      {
        id: "a-ml-validation-errors",
        title: "Input validation and error handling",
        explain:
          "Validation happens in LAYERS. Pydantic handles TYPE and RANGE checks (automatic 422). BUSINESS RULES that involve several fields go in your code: \"a 1-bedroom flat cannot be 900 m²\", raised as HTTPException(status_code=422, detail=\"...\"). Unexpected failures (the model raises, a dependency is down) should be caught, LOGGED with details for engineers, and returned as a generic 500 without internal information. Also guard against OUT-OF-DISTRIBUTION inputs: a request far outside the training range can be served with a warning flag or refused, since the model's prediction there is extrapolation. Clear error messages save every client developer hours.",
        codeChallenge: {
          task:
            "Write check_business_rules(house) that raises fastapi.HTTPException(status_code=422, detail=…) when the size per bedroom is below 15 m² (detail must contain \"too small\") or above 250 m² (detail must contain \"too large\"), and otherwise returns True. Then write safe_predict(house, model) that calls check_business_rules, then returns round(float(model.predict(DataFrame)[0]), 1); if the model itself raises any Exception, raise HTTPException(status_code=500, detail=\"prediction failed\") instead (but let the 422 from the rules pass through unchanged).",
          starter: MODEL + py`from typing import Literal
from fastapi import HTTPException
from pydantic import BaseModel, Field

class HouseIn(BaseModel):
    size_m2: float = Field(gt=10, le=2000)
    bedrooms: int = Field(ge=1, le=10)
    area: Literal["Lekki", "Yaba", "Ikeja"]

def check_business_rules(house):
    pass

def safe_predict(house, model):
    pass
`,
          sample: "a 6-bedroom house of 60 m² → HTTP 422 \"too small\"; a broken model → HTTP 500 \"prediction failed\"",
          tests: [
            {
              check: py`from fastapi import HTTPException
assert check_business_rules(HouseIn(size_m2=120, bedrooms=3, area="Lekki")) is True, "A sensible house passes."
for house, word in [(HouseIn(size_m2=60, bedrooms=6, area="Yaba"), "too small"), (HouseIn(size_m2=900, bedrooms=1, area="Lekki"), "too large")]:
    try:
        check_business_rules(house)
        assert False, "This house breaks a business rule: " + repr(house)
    except HTTPException as e:
        assert e.status_code == 422 and word in e.detail, "Expect 422 with \"" + word + "\". Got " + repr((e.status_code, e.detail))
assert safe_predict(HouseIn(size_m2=120, bedrooms=3, area="Lekki"), model) == 72.0, "A valid house gets its prediction."
class Broken:
    def predict(self, X):
        raise RuntimeError("weights corrupted at /srv/models/v1")
try:
    safe_predict(HouseIn(size_m2=120, bedrooms=3, area="Lekki"), Broken())
    assert False, "A failing model must become an HTTP 500."
except HTTPException as e:
    assert e.status_code == 500 and e.detail == "prediction failed", "Return a generic 500 without internal details. Got " + repr((e.status_code, e.detail))
try:
    safe_predict(HouseIn(size_m2=60, bedrooms=6, area="Yaba"), model)
    assert False, "Business-rule errors pass through safe_predict."
except HTTPException as e:
    assert e.status_code == 422, "The 422 must not be turned into a 500."`,
            },
          ],
          solution: MODEL + py`from typing import Literal
from fastapi import HTTPException
from pydantic import BaseModel, Field

class HouseIn(BaseModel):
    size_m2: float = Field(gt=10, le=2000)
    bedrooms: int = Field(ge=1, le=10)
    area: Literal["Lekki", "Yaba", "Ikeja"]

def check_business_rules(house):
    per_bedroom = house.size_m2 / house.bedrooms
    if per_bedroom < 15:
        raise HTTPException(status_code=422, detail="size per bedroom is too small")
    if per_bedroom > 250:
        raise HTTPException(status_code=422, detail="size per bedroom is too large")
    return True

def safe_predict(house, model):
    check_business_rules(house)
    try:
        row = pd.DataFrame([house.model_dump()])
        return round(float(model.predict(row)[0]), 1)
    except Exception:
        raise HTTPException(status_code=500, detail="prediction failed")
`,
          hint: "Compute size_m2 / bedrooms and raise HTTPException(status_code=422, detail=...) for each rule. In safe_predict, call the rules BEFORE the try block, so only the model call is wrapped and turned into a 500.",
          successMessage: "Type errors (422 from pydantic), business-rule errors (422 from you) and failures (a generic 500) are now distinct, and no internal path or message leaks to the client.",
        },
      },
    ],

    task: {
      title: "Module 19 project: deploy a house price model through a REST API",
      intro:
        "Take your Module 10 house price model and serve it with FastAPI on your own machine, as a service another developer could use.",
      prompts: [
        "Save the full pipeline with joblib together with metadata: features, metrics, library versions and a model version.",
        "Write main.py: load and verify the bundle once at startup; refuse to start on a version or feature mismatch.",
        "Add GET /health, GET /model and POST /predict with pydantic request and response models and sensible field constraints.",
        "Add business-rule validation, out-of-range warnings, and a generic 500 handler that logs the real error.",
        "Run it with uvicorn and test every route from /docs and with curl, including at least five invalid requests.",
        "Write a short API reference (endpoints, fields, example requests and responses, error codes) for a frontend developer.",
      ],
      closing: "An API is half an application. Module 20 builds the other half: a frontend that calls it, a database that remembers it, and the security around both.",
    },

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
