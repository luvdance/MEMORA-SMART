/**
 * MACHINE LEARNING AND AI · MODULE 20 · MACHINE LEARNING APPLICATION DEVELOPMENT
 *
 * Curriculum 20.1 – 20.10. Connecting frontends to ML APIs; prediction
 * interfaces; handling user input; displaying results; integrating with
 * React; databases; authentication; logging predictions; invalid inputs;
 * and basic application security.
 *
 * The browser side (React, fetch) is shown as reference code; everything
 * the learner writes runs in the page's Python: CORS configuration on a real
 * FastAPI app, form parsing, result formatting, a UI state machine, SQLite
 * (the standard library's sqlite3) for prediction logs, hashed API keys with
 * constant-time comparison, input sanitising and a rate limiter.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

export const SECTION_ID = "ml-s20-app-development";

const PY = "python";
const py = String.raw;

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 88 · 20.1 – 20.3
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ml-l88-frontends-input",
    moduleId: "ml-m20-app-development",
    sectionId: SECTION_ID,
    order: 1,
    covers: ["20.1", "20.2", "20.3"],
    title: "Frontends, Prediction Interfaces and User Input",
    subtitle: "Letting people use the model, and turning what they type into valid requests",
    estimatedMinutes: 38,
    intro:
      "Most people will meet your model through a form on a website or a screen in an app. This lesson connects a frontend to the API, designs an interface people can trust, and turns messy typed input into clean requests.",

    atoms: [
      {
        id: "a-ml-connecting-frontends",
        title: "Connecting frontend applications to ML APIs",
        explain:
          "A web frontend calls the model API with fetch (or a library like axios): a POST to /predict with a JSON body and the header Content-Type: application/json, then reads the JSON response. Browsers enforce the SAME-ORIGIN POLICY: a page served from http://localhost:5173 may not read responses from an API at http://localhost:8000 unless the API allows it with CORS (cross-origin resource sharing) headers. In FastAPI you add CORSMiddleware with an explicit list of allowed ORIGINS; using \"*\" (any website) is acceptable only for public, unauthenticated APIs. In production the API URL comes from configuration (an environment variable), never hard-coded.",
        example:
          "// React / JavaScript\nconst res = await fetch(`${import.meta.env.VITE_API_URL}/predict`, {\n  method: \"POST\",\n  headers: { \"Content-Type\": \"application/json\", \"X-API-Key\": apiKey },\n  body: JSON.stringify({ size_m2: 120, bedrooms: 3, area: \"Lekki\" }),\n});\nif (!res.ok) throw new Error((await res.json()).detail);\nconst { predicted_price } = await res.json();",
        codeChallenge: {
          task:
            "Create a FastAPI app named app and add CORSMiddleware allowing exactly the origins in ALLOWED (given in the starter), the methods GET and POST, and the headers Content-Type and X-API-Key. Then write is_allowed(origin) returning True if origin is in ALLOWED.",
          starter: "from fastapi import FastAPI\nfrom fastapi.middleware.cors import CORSMiddleware\n\nALLOWED = [\"http://localhost:5173\", \"https://houses.example.ng\"]\n\n",
          sample: "is_allowed(\"https://evil.example\") → False",
          tests: [
            {
              check: py`from fastapi.middleware.cors import CORSMiddleware
mw = [m for m in app.user_middleware if m.cls is CORSMiddleware]
assert mw, "Add CORSMiddleware with app.add_middleware(...)."
opts = mw[0].kwargs
assert list(opts.get("allow_origins", [])) == ALLOWED, "Allow exactly the origins in ALLOWED, not \"*\". Got " + repr(opts.get("allow_origins"))
assert set(opts.get("allow_methods", [])) == {"GET", "POST"}, "Allow GET and POST."
assert set(opts.get("allow_headers", [])) == {"Content-Type", "X-API-Key"}, "Allow the Content-Type and X-API-Key headers."
assert is_allowed("http://localhost:5173") and not is_allowed("https://evil.example"), "is_allowed checks the list."`,
            },
          ],
          solution: py`from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

ALLOWED = ["http://localhost:5173", "https://houses.example.ng"]

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type", "X-API-Key"],
)

def is_allowed(origin):
    return origin in ALLOWED
`,
          hint: "app.add_middleware(CORSMiddleware, allow_origins=ALLOWED, allow_methods=[\"GET\", \"POST\"], allow_headers=[\"Content-Type\", \"X-API-Key\"]).",
          successMessage: "Only your own frontends may call the API from a browser. A wildcard would let any website use your model with your visitors' browsers.",
        },
      },
      {
        id: "a-ml-prediction-interfaces",
        title: "Building prediction interfaces",
        explain:
          "A good prediction interface asks only for inputs a user actually knows, in their language and units (\"Size in square metres\", a dropdown of areas rather than free text), with sensible defaults and examples. It explains what the model does and does not do, shows the result with appropriate UNCERTAINTY (a range or a confidence level, not a falsely precise number), states the main factors where possible, and gives a way to report a wrong prediction. It handles waiting (a loading state) and failure (a clear, actionable error). For consequential decisions (credit, health, hiring), the interface should support a human decision rather than replace it, and say so.",
        decision: {
          scenario: "A loan-eligibility page shows a single line after the form: \"Score: 0.6372\".",
          question: "What is the most important improvement?",
          options: [
            { id: "a", text: "Show more decimal places", whyWrong: "False precision makes it worse." },
            { id: "b", text: "Explain the result in plain words, with what it means, the main factors and what the applicant can do next", why: "A bare number is meaningless to an applicant; an explained outcome with next steps is usable and fair." },
            { id: "c", text: "Change the colour of the number", whyWrong: "Cosmetic; the meaning is still missing." },
            { id: "d", text: "Hide the result entirely", whyWrong: "Users need an outcome." },
          ],
          correct: "b",
          aftermath: "Translate model output into a decision people understand, with uncertainty and next steps.",
        },
      },
      {
        id: "a-ml-handling-user-input",
        title: "Handling user input",
        explain:
          "Form inputs arrive as STRINGS, whatever the field looks like. Before calling the API, the frontend parses and checks them so the user gets instant, specific feedback next to each field (\"Bedrooms must be a whole number from 1 to 10\"); the API validates again, because the frontend can be bypassed. Normalise forgiving formats people actually type: commas in numbers (\"1,200\"), surrounding spaces, capitalisation (\"lekki\"). Return ALL errors at once rather than one at a time. Never trust hidden fields or client-side checks for security.",
        codeChallenge: {
          task:
            "Write parse_form(form) that takes a dictionary of strings with keys size_m2, bedrooms and area, and returns (payload, errors). Strip spaces; size_m2 may contain commas and must be a number above 10; bedrooms must be a whole number from 1 to 10; area is matched case-insensitively against AREAS and returned in its canonical spelling. payload holds the converted values (float, int, str) for valid fields; errors maps each invalid field to a message. Report every invalid field.",
          starter: "AREAS = [\"Lekki\", \"Yaba\", \"Ikeja\"]\n\ndef parse_form(form):\n    pass\n",
          sample: "parse_form({\"size_m2\": \" 1,200 \", \"bedrooms\": \"3\", \"area\": \"lekki\"}) → ({\"size_m2\": 1200.0, \"bedrooms\": 3, \"area\": \"Lekki\"}, {})",
          tests: [
            {
              check: py`p, e = parse_form({"size_m2": " 1,200 ", "bedrooms": "3", "area": "lekki"})
assert p == {"size_m2": 1200.0, "bedrooms": 3, "area": "Lekki"} and e == {}, "Got " + repr((p, e))
p, e = parse_form({"size_m2": "abc", "bedrooms": "2.5", "area": "Abuja"})
assert set(e) == {"size_m2", "bedrooms", "area"} and p == {}, "All three fields are invalid, and every error is reported. Got " + repr(e)
assert all(isinstance(m, str) and m for m in e.values()), "Each error is a non-empty message."
p, e = parse_form({"size_m2": "8", "bedrooms": "0", "area": "IKEJA"})
assert set(e) == {"size_m2", "bedrooms"} and p == {"area": "Ikeja"}, "8 m² is too small and 0 bedrooms is out of range. Got " + repr((p, e))
p, e = parse_form({"size_m2": "95", "bedrooms": " 10 ", "area": " Yaba "})
assert p == {"size_m2": 95.0, "bedrooms": 10, "area": "Yaba"} and e == {}, "Spaces are stripped; 10 bedrooms is allowed."`,
            },
          ],
          solution: py`AREAS = ["Lekki", "Yaba", "Ikeja"]

def parse_form(form):
    payload, errors = {}, {}
    raw = form.get("size_m2", "").strip().replace(",", "")
    try:
        size = float(raw)
        if size > 10:
            payload["size_m2"] = size
        else:
            errors["size_m2"] = "Size must be more than 10 square metres."
    except ValueError:
        errors["size_m2"] = "Size must be a number."
    beds = form.get("bedrooms", "").strip()
    if beds.isdigit() and 1 <= int(beds) <= 10:
        payload["bedrooms"] = int(beds)
    else:
        errors["bedrooms"] = "Bedrooms must be a whole number from 1 to 10."
    area = form.get("area", "").strip().lower()
    match = [a for a in AREAS if a.lower() == area]
    if match:
        payload["area"] = match[0]
    else:
        errors["area"] = "Choose one of: " + ", ".join(AREAS) + "."
    return payload, errors
`,
          hint: "Handle each field independently so all errors are collected. float() in try/except for size; str.isdigit() rejects \"2.5\" and \"-1\" for bedrooms; compare lower-cased area names to find the canonical spelling.",
          successMessage: "Forgiving where people are sloppy (commas, case, spaces), strict where the model needs it, and every problem reported at once.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 89 · 20.4 – 20.5
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ml-l89-results-react",
    moduleId: "ml-m20-app-development",
    sectionId: SECTION_ID,
    order: 2,
    covers: ["20.4", "20.5"],
    title: "Displaying Results and Integrating with React",
    subtitle: "Honest presentation of predictions, and the states a prediction screen goes through",
    estimatedMinutes: 36,
    intro:
      "A prediction is only as useful as the way it is shown. This lesson formats results honestly, then models the states a React prediction screen moves through, so loading and errors are handled as carefully as success.",

    atoms: [
      {
        id: "a-ml-displaying-results",
        title: "Displaying prediction results",
        explain:
          "Present predictions in the user's terms: currency formatted for the locale (₦72.0 million), sensible rounding (a house price to one decimal place of millions, not to the kobo), and a RANGE that reflects the model's typical error (prediction ± its validation MAE) rather than a falsely exact figure. For classifiers, translate probabilities into bands people understand (\"high risk\", \"medium\", \"low\"), with the boundaries chosen with the business, and show the probability only if it helps. Indicate when an input was outside the training data and the prediction is less reliable. Consistency matters: the same number should be displayed the same way everywhere.",
        codeChallenge: {
          task:
            "Write format_price(millions) that returns a string like \"₦72.0m\" (one decimal place). Write price_range(prediction, mae) returning \"₦<low>m – ₦<high>m\" for prediction ± mae, each with one decimal place and never below 0. Write risk_band(probability) returning \"low\" below 0.3, \"medium\" from 0.3 up to (not including) 0.7, and \"high\" from 0.7.",
          starter: "def format_price(millions):\n    pass\n\ndef price_range(prediction, mae):\n    pass\n\ndef risk_band(probability):\n    pass\n",
          sample: "format_price(72.04) → \"₦72.0m\"; price_range(72.0, 4.2) → \"₦67.8m – ₦76.2m\"",
          tests: [
            {
              check: py`assert format_price(72.04) == "₦72.0m" and format_price(5) == "₦5.0m", "One decimal place. Got " + repr(format_price(72.04))
assert price_range(72.0, 4.2) == "₦67.8m – ₦76.2m", "prediction ± MAE. Got " + repr(price_range(72.0, 4.2))
assert price_range(3.0, 4.2) == "₦0.0m – ₦7.2m", "Never below zero. Got " + repr(price_range(3.0, 4.2))
assert [risk_band(p) for p in [0.05, 0.29, 0.3, 0.69, 0.7, 0.99]] == ["low", "low", "medium", "medium", "high", "high"], "Band boundaries at 0.3 and 0.7."`,
            },
          ],
          solution: py`def format_price(millions):
    return f"₦{millions:.1f}m"

def price_range(prediction, mae):
    low = max(0.0, prediction - mae)
    return f"{format_price(low)} – {format_price(prediction + mae)}"

def risk_band(probability):
    if probability < 0.3:
        return "low"
    if probability < 0.7:
        return "medium"
    return "high"
`,
          hint: "f\"₦{millions:.1f}m\" formats the price; reuse it for both ends of the range, clamping the low end with max(0.0, ...).",
          successMessage: "\"₦67.8m – ₦76.2m\" is more honest, and more useful, than \"₦72.04317m\". Communicating uncertainty is part of the engineering.",
        },
      },
      {
        id: "a-ml-react-integration",
        title: "Integrating Python models with React",
        explain:
          "The usual architecture: the React app (built with Vite, hosted on Vercel, Netlify or a CDN) calls the FastAPI service (hosted on a server, a container platform or a cloud function); the Python model never runs in the user's browser. In React, a prediction form keeps its UI STATE explicit: IDLE (nothing submitted), LOADING (request in flight: disable the button, show a spinner), SUCCESS (show the result) and ERROR (show the message, keep the inputs so the user can retry). Use useState or useReducer for this state, cancel or ignore stale responses if the user submits again, and keep the API URL in configuration. Modelling the states as a small state machine prevents classic bugs such as a spinner that never stops.",
        example:
          "function PricePredictor() {\n  const [state, setState] = useState({ status: \"idle\" });\n  async function submit(form) {\n    setState({ status: \"loading\" });\n    try {\n      const data = await predict(form);          // calls POST /predict\n      setState({ status: \"success\", data });\n    } catch (err) {\n      setState({ status: \"error\", message: err.message });\n    }\n  }\n  if (state.status === \"loading\") return <Spinner />;\n  ...\n}",
        codeChallenge: {
          task:
            "Model the prediction screen as a reducer, as you would with React's useReducer. Write reducer(state, event) where state is a dictionary with \"status\" in idle/loading/success/error, and event is a dictionary with \"type\": \"submit\" moves idle, success or error to {\"status\": \"loading\"} (a submit while already loading is ignored: return the same state); \"resolved\" moves loading to {\"status\": \"success\", \"data\": event[\"data\"]}; \"failed\" moves loading to {\"status\": \"error\", \"message\": event[\"message\"]}; \"reset\" returns {\"status\": \"idle\"}. Any event that does not apply to the current state returns the state unchanged.",
          starter: "def reducer(state, event):\n    pass\n",
          sample: "reducer({\"status\": \"idle\"}, {\"type\": \"submit\"}) → {\"status\": \"loading\"}",
          tests: [
            {
              check: py`s = {"status": "idle"}
s = reducer(s, {"type": "submit"})
assert s == {"status": "loading"}, "Submitting starts loading."
assert reducer(s, {"type": "submit"}) is s, "A second submit while loading is ignored (prevents double requests)."
done = reducer(s, {"type": "resolved", "data": {"predicted_price": 72.0}})
assert done == {"status": "success", "data": {"predicted_price": 72.0}}, "A response moves to success with the data."
err = reducer(s, {"type": "failed", "message": "Bedrooms must be 1 to 10"})
assert err == {"status": "error", "message": "Bedrooms must be 1 to 10"}, "A failure moves to error with the message."
assert reducer(err, {"type": "submit"}) == {"status": "loading"}, "The user can retry after an error."
assert reducer({"status": "idle"}, {"type": "resolved", "data": 1}) == {"status": "idle"}, "A stray response when not loading is ignored."
assert reducer(done, {"type": "reset"}) == {"status": "idle"}, "Reset returns to idle."`,
            },
          ],
          solution: py`def reducer(state, event):
    kind = event["type"]
    status = state["status"]
    if kind == "reset":
        return {"status": "idle"}
    if kind == "submit":
        return state if status == "loading" else {"status": "loading"}
    if status == "loading" and kind == "resolved":
        return {"status": "success", "data": event["data"]}
    if status == "loading" and kind == "failed":
        return {"status": "error", "message": event["message"]}
    return state
`,
          hint: "Handle reset first, then submit (ignored while loading), then resolved and failed, which apply only in the loading state. Everything else returns state unchanged.",
          successMessage: "Every transition is explicit, double submissions are impossible, and stray responses are ignored. The same reducer translates line for line into JavaScript for useReducer.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 90 · 20.6 – 20.8
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ml-l90-database-auth-logging",
    moduleId: "ml-m20-app-development",
    sectionId: SECTION_ID,
    order: 3,
    covers: ["20.6", "20.7", "20.8"],
    title: "Databases, Authentication and Logging Predictions",
    subtitle: "Remembering every prediction, and knowing who asked for it",
    estimatedMinutes: 42,
    intro:
      "A production ML application stores what it predicted, controls who may call it, and keeps the records needed to monitor and improve the model. This lesson builds all three with Python's standard library.",

    atoms: [
      {
        id: "a-ml-database-integration",
        title: "Database integration",
        explain:
          "ML applications use databases to store users, the inputs and outputs of every prediction, later OUTCOMES (did the customer actually churn? what did the house sell for?), and model metadata. Relational databases (PostgreSQL in production; SQLite, built into Python, for prototypes and small apps) store these as tables queried with SQL. Always use PARAMETERISED queries (placeholders such as ?), never string formatting, to prevent SQL INJECTION. Store inputs as JSON text or proper columns, add an index on the columns you filter by (timestamp, model version), and keep prediction logs append-only. Joining predictions with outcomes later gives you fresh labelled data for evaluation and retraining.",
        codeChallenge: {
          task:
            "Using sqlite3, write create_db() that returns an in-memory connection (sqlite3.connect(\":memory:\")) with a table predictions(id INTEGER PRIMARY KEY, area TEXT, size_m2 REAL, predicted REAL, actual REAL). Write add_prediction(conn, area, size_m2, predicted) that inserts a row with a PARAMETERISED query and returns the new id. Write record_outcome(conn, pred_id, actual). Write mae_by_area(conn) that returns {area: mean absolute error rounded to 2} using only rows whose actual is known, computed in SQL with AVG(ABS(...)) and GROUP BY.",
          starter: "import sqlite3\n\ndef create_db():\n    pass\n\ndef add_prediction(conn, area, size_m2, predicted):\n    pass\n\ndef record_outcome(conn, pred_id, actual):\n    pass\n\ndef mae_by_area(conn):\n    pass\n",
          sample: "mae_by_area(conn) → {\"Lekki\": 3.0, \"Yaba\": 1.5}",
          tests: [
            {
              check: py`conn = create_db()
ids = [add_prediction(conn, a, s, p) for a, s, p in [("Lekki", 120, 72.0), ("Lekki", 200, 95.0), ("Yaba", 80, 30.0), ("Yaba", 60, 25.0), ("Ikeja", 100, 50.0)]]
assert ids == [1, 2, 3, 4, 5], "Return each new row's id. Got " + repr(ids)
for i, actual in [(1, 75.0), (2, 92.0), (3, 31.0), (4, 23.0)]:
    record_outcome(conn, i, actual)
assert mae_by_area(conn) == {"Lekki": 3.0, "Yaba": 1.5}, "Ikeja has no outcome yet, so it is excluded. Got " + repr(mae_by_area(conn))
evil = "Lekki'); DROP TABLE predictions; --"
add_prediction(conn, evil, 50, 10.0)
assert conn.execute("SELECT COUNT(*) FROM predictions").fetchone()[0] == 6, "The malicious area name must be stored as text, not executed: use ? placeholders."
assert "GROUP BY" in source.upper() and "AVG" in source.upper(), "Compute the errors in SQL with AVG and GROUP BY."`,
            },
          ],
          solution: py`import sqlite3

def create_db():
    conn = sqlite3.connect(":memory:")
    conn.execute(
        "CREATE TABLE predictions (id INTEGER PRIMARY KEY, area TEXT, size_m2 REAL, predicted REAL, actual REAL)"
    )
    return conn

def add_prediction(conn, area, size_m2, predicted):
    cur = conn.execute(
        "INSERT INTO predictions (area, size_m2, predicted) VALUES (?, ?, ?)", (area, size_m2, predicted)
    )
    conn.commit()
    return cur.lastrowid

def record_outcome(conn, pred_id, actual):
    conn.execute("UPDATE predictions SET actual = ? WHERE id = ?", (actual, pred_id))
    conn.commit()

def mae_by_area(conn):
    rows = conn.execute(
        "SELECT area, AVG(ABS(predicted - actual)) FROM predictions WHERE actual IS NOT NULL GROUP BY area"
    ).fetchall()
    return {area: round(mae, 2) for area, mae in rows}
`,
          hint: "conn.execute(\"INSERT ... VALUES (?, ?, ?)\", (area, size_m2, predicted)) and cursor.lastrowid. The report: SELECT area, AVG(ABS(predicted - actual)) ... WHERE actual IS NOT NULL GROUP BY area.",
          successMessage: "Predictions joined with real outcomes give you live accuracy per segment, and the injection attempt was stored harmlessly as text.",
        },
      },
      {
        id: "a-ml-authentication",
        title: "Authentication fundamentals",
        explain:
          "AUTHENTICATION establishes WHO is calling; AUTHORISATION decides what they may do. Common schemes for ML APIs: API KEYS for server-to-server clients (sent in a header such as X-API-Key, never in the URL where they end up in logs); TOKENS such as JWTs or session tokens for logged-in users, issued after a password or OAuth login. Store only a HASH of each key or password: for API keys a SHA-256 hash is common; for passwords use a slow, salted algorithm (bcrypt, scrypt, Argon2) so stolen hashes cannot be cracked quickly. Compare secrets with a CONSTANT-TIME comparison (hmac.compare_digest) to prevent timing attacks, and always use HTTPS.",
        codeChallenge: {
          task:
            "Write hash_key(key) returning the SHA-256 hex digest of the key (hashlib). Write new_api_key() returning secrets.token_urlsafe(32). Write verify_key(presented, stored_hashes) that hashes the presented key and returns the matching client name from stored_hashes (a dictionary {client_name: hash}), comparing with hmac.compare_digest, or None if nothing matches.",
          starter: "import hashlib\nimport hmac\nimport secrets\n\ndef hash_key(key):\n    pass\n\ndef new_api_key():\n    pass\n\ndef verify_key(presented, stored_hashes):\n    pass\n",
          sample: "verify_key(the_real_key, {\"mobile-app\": hash_key(the_real_key)}) → \"mobile-app\"",
          tests: [
            {
              check: py`import hashlib
k = new_api_key()
assert isinstance(k, str) and len(k) >= 40 and new_api_key() != k, "A long, random key each time."
assert hash_key("abc") == hashlib.sha256(b"abc").hexdigest(), "SHA-256 hex digest."
store = {"mobile-app": hash_key(k), "partner-bank": hash_key("other-key")}
assert k not in store.values(), "Only hashes are stored, never the key itself."
assert verify_key(k, store) == "mobile-app", "The right key identifies its client."
assert verify_key("wrong", store) is None, "A wrong key matches nobody."
assert calls("compare_digest"), "Compare secrets with hmac.compare_digest (constant time)."`,
            },
          ],
          solution: py`import hashlib
import hmac
import secrets

def hash_key(key):
    return hashlib.sha256(key.encode()).hexdigest()

def new_api_key():
    return secrets.token_urlsafe(32)

def verify_key(presented, stored_hashes):
    h = hash_key(presented)
    for client, stored in stored_hashes.items():
        if hmac.compare_digest(h, stored):
            return client
    return None
`,
          hint: "hashlib.sha256(key.encode()).hexdigest(). In verify_key, hash once, then loop over the stored hashes using hmac.compare_digest(h, stored).",
          successMessage: "If this database leaks, attackers get hashes, not usable keys. In FastAPI the check becomes a dependency that runs before every protected endpoint.",
        },
      },
      {
        id: "a-ml-logging-predictions",
        title: "Logging predictions",
        explain:
          "Log every prediction as a structured record: a request ID, timestamp, model version, the inputs (with personal data minimised or masked), the output, and the LATENCY. These logs power MONITORING (Module 21: are inputs drifting? is latency rising?), DEBUGGING (reproduce a complaint exactly), AUDITING (which model decided this loan, and why?), and RETRAINING (join with later outcomes for new labels). Use structured logging (JSON lines) rather than free text, so logs can be queried; never log secrets such as API keys or passwords; and agree a retention period that respects privacy law (Nigeria's NDPA, the EU's GDPR).",
        codeChallenge: {
          task:
            "Write log_prediction(log, inputs, output, model_version, latency_ms) that appends to the list log a JSON string (json.dumps) of a record with keys request_id (a new uuid4 string), model_version, inputs (with any key named \"api_key\" or \"phone\" removed), output and latency_ms, and returns the request_id. Then write latency_report(log) that parses the records and returns {\"count\": n, \"p50\": median latency, \"max\": maximum latency}.",
          starter: "import json\nimport uuid\nimport statistics\n\ndef log_prediction(log, inputs, output, model_version, latency_ms):\n    pass\n\ndef latency_report(log):\n    pass\n",
          sample: "latency_report(log) → {\"count\": 3, \"p50\": 12.0, \"max\": 40.0}",
          tests: [
            {
              check: py`import json
log = []
rid = log_prediction(log, {"size_m2": 120, "area": "Lekki", "api_key": "secret", "phone": "08012345678"}, 72.0, "1.0.0", 12.0)
rec = json.loads(log[0])
assert set(rec) == {"request_id", "model_version", "inputs", "output", "latency_ms"}, "Record keys. Got " + repr(set(rec))
assert rec["request_id"] == rid and len(rid) == 36, "A uuid4 request id, returned to the caller."
assert rec["inputs"] == {"size_m2": 120, "area": "Lekki"}, "Never log secrets or phone numbers. Got " + repr(rec["inputs"])
log_prediction(log, {"size_m2": 80}, 30.0, "1.0.0", 40.0)
log_prediction(log, {"size_m2": 60}, 25.0, "1.0.0", 9.0)
assert latency_report(log) == {"count": 3, "p50": 12.0, "max": 40.0}, "Got " + repr(latency_report(log))
assert all(isinstance(line, str) for line in log), "Log JSON strings (structured lines)."`,
            },
          ],
          solution: py`import json
import uuid
import statistics

SENSITIVE = {"api_key", "phone"}

def log_prediction(log, inputs, output, model_version, latency_ms):
    request_id = str(uuid.uuid4())
    record = {
        "request_id": request_id,
        "model_version": model_version,
        "inputs": {k: v for k, v in inputs.items() if k not in SENSITIVE},
        "output": output,
        "latency_ms": latency_ms,
    }
    log.append(json.dumps(record))
    return request_id

def latency_report(log):
    latencies = [json.loads(line)["latency_ms"] for line in log]
    return {"count": len(latencies), "p50": statistics.median(latencies), "max": max(latencies)}
`,
          hint: "str(uuid.uuid4()) gives the id; a dictionary comprehension drops the sensitive keys; json.dumps makes the line. For the report, json.loads each line and use statistics.median.",
          successMessage: "Every prediction is now traceable by its request ID, free of secrets, and queryable. Module 21's monitoring is built on exactly these records.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 91 · 20.9 – 20.10
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ml-l91-invalid-security",
    moduleId: "ml-m20-app-development",
    sectionId: SECTION_ID,
    order: 4,
    covers: ["20.9", "20.10"],
    title: "Invalid Inputs and Basic Application Security",
    subtitle: "Defending the application and the model from bad and hostile requests",
    estimatedMinutes: 38,
    intro:
      "Once an application is public, some requests are mistakes and some are attacks. This lesson hardens the boundary: sanitising and limiting inputs, rate limiting, and a security checklist for ML applications.",

    atoms: [
      {
        id: "a-ml-invalid-inputs",
        title: "Handling invalid inputs",
        explain:
          "Invalid input comes in many forms: missing fields, wrong types, impossible values, absurd sizes (a 50 MB JSON body, a 100,000-character text field), unexpected extra fields, and malicious content (scripts in a text field that will later be displayed, SQL fragments). Defences: validate types and ranges (pydantic); FORBID unknown fields (model_config = ConfigDict(extra=\"forbid\")) so typos fail loudly; LIMIT lengths and body sizes; normalise text (strip, Unicode normalisation) before it reaches the model; ESCAPE anything displayed back to users (React does this by default); and reject inputs far outside the training distribution, or flag them. Fail with a clear 4xx error, never a crash.",
        codeChallenge: {
          task:
            "Write a pydantic model ReviewIn for a sentiment API with fields text (a str between 3 and 2,000 characters, with surrounding whitespace stripped) and language (one of \"en\" or \"pcm\", default \"en\"), that FORBIDS extra fields. Use model_config = ConfigDict(extra=\"forbid\", str_strip_whitespace=True).",
          starter: "from typing import Literal\nfrom pydantic import BaseModel, ConfigDict, Field\n\n",
          sample: "ReviewIn(text=\"  Food sweet die  \", language=\"pcm\").text → \"Food sweet die\"",
          tests: [
            {
              check: py`from pydantic import ValidationError
r = ReviewIn(text="  Food sweet die  ", language="pcm")
assert r.text == "Food sweet die" and r.language == "pcm", "Strip whitespace; accept pcm. Got " + repr(r)
assert ReviewIn(text="Great service").language == "en", "language defaults to en."
for bad in [dict(text="ok"), dict(text="x" * 2001), dict(text="fine food", language="fr"), dict(text="fine food", rating=5), dict(text="     a     ")]:
    try:
        ReviewIn(**bad)
        assert False, "This input must be rejected: " + repr({k: (v[:20] + "…" if isinstance(v, str) and len(v) > 20 else v) for k, v in bad.items()})
    except ValidationError:
        pass`,
            },
          ],
          solution: py`from typing import Literal
from pydantic import BaseModel, ConfigDict, Field

class ReviewIn(BaseModel):
    model_config = ConfigDict(extra="forbid", str_strip_whitespace=True)
    text: str = Field(min_length=3, max_length=2000)
    language: Literal["en", "pcm"] = "en"
`,
          hint: "model_config = ConfigDict(extra=\"forbid\", str_strip_whitespace=True); text: str = Field(min_length=3, max_length=2000); language: Literal[\"en\", \"pcm\"] = \"en\".",
          successMessage: "Too short, too long, an unknown language, an unexpected field and a string of spaces are all rejected with clear errors. Stripping happens before the length check, so \"     a     \" counts as 1 character.",
        },
      },
      {
        id: "a-ml-app-security",
        title: "Basic application security",
        explain:
          "A security baseline for ML applications: HTTPS everywhere; authentication on every non-public endpoint; secrets (API keys, database passwords) in environment variables or a secrets manager, never in code or Git; least-privilege database users; dependency updates and vulnerability scanning; CORS limited to your frontends; RATE LIMITING per client to stop abuse and runaway costs; request size limits; logging and alerting on unusual activity; and generic error messages. ML adds its own risks (Module 22): attackers can query a model repeatedly to copy it (MODEL EXTRACTION) or to find inputs that fool it, which rate limits and monitoring also help prevent. The OWASP Top 10 lists the most common web application risks.",
        codeChallenge: {
          task:
            "Write a class RateLimiter(limit, window_seconds) implementing a sliding-window limit per client: allow(client_id, now) returns True and records the request if the client has made fewer than limit requests in the window_seconds before now (requests at exactly now − window_seconds or earlier no longer count), otherwise returns False without recording. now is a number of seconds passed in by the caller (so the class is testable).",
          starter: "from collections import defaultdict, deque\n\nclass RateLimiter:\n    pass\n",
          sample: "RateLimiter(3, 60): three requests at t = 0, 1, 2 are allowed, a fourth at t = 3 is refused, and at t = 61 the first has expired",
          tests: [
            {
              check: py`rl = RateLimiter(3, 60)
assert [rl.allow("a", t) for t in [0, 1, 2]] == [True, True, True], "The first three requests are allowed."
assert rl.allow("a", 3) is False, "The fourth within 60 seconds is refused."
assert rl.allow("b", 3) is True, "Each client has its own limit."
assert rl.allow("a", 59.9) is False, "At 59.9 s all three are still inside the window."
assert rl.allow("a", 60) is True, "At exactly 60 s the request from t = 0 has left the window."
assert rl.allow("a", 60.5) is False, "Requests at 1, 2 and 60 are in the window."
assert rl.allow("a", 62) is True, "By t = 62 the requests at 1 and 2 have expired."
assert rl.allow("a", 62.1) is True and rl.allow("a", 62.2) is False, "Refused requests are not recorded, so they do not extend the block."`,
            },
          ],
          solution: py`from collections import defaultdict, deque

class RateLimiter:
    def __init__(self, limit, window_seconds):
        self.limit = limit
        self.window = window_seconds
        self.hits = defaultdict(deque)

    def allow(self, client_id, now):
        q = self.hits[client_id]
        while q and q[0] <= now - self.window:
            q.popleft()
        if len(q) < self.limit:
            q.append(now)
            return True
        return False
`,
          hint: "Keep a deque of request times per client. On each call, pop from the left while the oldest time is <= now - window; then allow (and append now) only if fewer than limit remain.",
          successMessage: "A sliding-window rate limiter in a dozen lines. In production the same logic runs in Redis or an API gateway, so it works across many servers.",
        },
      },
    ],

    task: {
      title: "Module 20 project: a complete ML application",
      intro:
        "Turn your Module 19 API into a full application: a React frontend, a FastAPI backend with a database, authentication, logging and basic security.",
      prompts: [
        "Build a React (Vite) prediction form with client-side parsing, field-level errors, and loading, success and error states.",
        "Display results honestly: formatted values, a range based on the model's validation error, and a plain-language explanation.",
        "Configure CORS for your frontend's origin only, and read the API URL from an environment variable.",
        "Store every prediction in a database (SQLite locally, PostgreSQL if you deploy), with a way to record the real outcome later.",
        "Protect POST /predict with hashed API keys checked in constant time, and add a per-key rate limit.",
        "Write structured JSON logs with request IDs and latency, without secrets or unnecessary personal data.",
        "Test the application with at least ten invalid or hostile inputs and document how each is handled.",
      ],
      closing: "Your application works today. Module 21 keeps it working: versioning, monitoring, drift detection and automated retraining, the practice called MLOps.",
    },

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
