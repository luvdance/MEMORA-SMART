/**
 * PYTHON PROGRAMMING · MODULE 19 · APIs, HTTP AND WEB DEVELOPMENT FOUNDATIONS
 *
 * Curriculum 19.1 – 19.11. Client and server, HTTP, status codes, headers and
 * JSON, REST, consuming APIs, timeouts and errors, API keys, building an API,
 * validation and response formatting, authentication, and async/await.
 *
 * Python in the page has no network access, so the challenges practise each
 * skill on simulated responses and on a `fetch` function passed in as a
 * parameter (dependency injection, which is also how real code is made
 * testable). Real `requests` and Flask code is given as worked examples for
 * VS Code, where the network is available.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

export const SECTION_ID = "pp-s19-apis";

const PY = "python";

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 78 · 19.1 – 19.3
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "pp-l78-http",
    moduleId: "pp-m19-apis",
    sectionId: SECTION_ID,
    order: 1,
    covers: ["19.1", "19.2", "19.3"],
    title: "Clients, Servers and HTTP",
    subtitle: "Requests and responses, methods, status codes, headers and JSON",
    estimatedMinutes: 24,
    intro:
      "Every app that shows live data, from a weather widget to a bank balance, is a CLIENT asking a SERVER for information over HTTP. Understanding that conversation is the foundation of backend development and of using any web API from Python.",

    atoms: [
      {
        id: "a-pp-client-server",
        title: "Client-server architecture",
        explain:
          "A CLIENT (a browser, a mobile app, a Python script) sends a request; a SERVER (a program running on another computer) processes it and sends a response. The server usually talks to a database and holds the rules and secrets; clients only see what the server chooses to send. An API (Application Programming Interface) is the set of requests a server accepts and the responses it gives back.",
        decision: {
          scenario: "You are building a school results app. The rule \"a student may only see their own results\" must be enforced.",
          question: "Where must that rule be checked?",
          options: [
            {
              id: "a",
              text: "On the server, before it sends any results",
              why: "Anyone can modify a client or send requests directly. Only the server is under your control, so security rules must be enforced there.",
            },
            {
              id: "b",
              text: "Only in the mobile app, by hiding other students' results",
              whyWrong: "A user can bypass the app and call the API directly; hiding data in the app does not protect it.",
            },
            {
              id: "c",
              text: "In the database file name",
              whyWrong: "Names do not enforce anything.",
            },
            {
              id: "d",
              text: "Nowhere; users will be honest",
              whyWrong: "Security cannot rely on honesty.",
            },
          ],
          correct: "a",
          aftermath: "Clients are for convenience; servers are for rules. Never trust anything a client sends.",
        },
      },
      {
        id: "a-pp-http-request-response",
        title: "HTTP requests and responses",
        explain:
          "An HTTP REQUEST has a method (what to do), a URL (which resource), headers (extra information such as the content type or an API key) and sometimes a body (data sent, often JSON). A RESPONSE has a status code (how it went), headers, and a body. Both are plain text sent over the network; libraries such as requests build and parse them for you.",
        example:
          "REQUEST\nPOST /api/students HTTP/1.1\nHost: school.memora.ng\nContent-Type: application/json\nAuthorization: Bearer abc123\n\n{\"name\": \"Ada\", \"class\": \"SS2\"}\n\nRESPONSE\nHTTP/1.1 201 Created\nContent-Type: application/json\n\n{\"id\": 41, \"name\": \"Ada\", \"class\": \"SS2\"}",
      },
      {
        id: "a-pp-methods-status-json",
        title: "Methods, status codes, headers and JSON",
        explain:
          "Methods: GET reads, POST creates, PUT/PATCH update, DELETE removes. Status codes: 2xx success (200 OK, 201 Created, 204 No Content), 3xx redirect, 4xx the CLIENT made a mistake (400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 429 Too Many Requests), 5xx the SERVER failed (500, 503). The Content-Type: application/json header says the body is JSON, which json.loads turns into Python dictionaries and lists.",
        table: {
          caption: "Status codes you will meet constantly.",
          headers: ["Code", "Meaning", "What your client should do"],
          rows: [
            ["200 / 201", "OK / Created", "Use the body"],
            ["204", "No Content", "Success, nothing to read"],
            ["400", "Bad Request", "Fix the data you sent"],
            ["401 / 403", "Not logged in / Not allowed", "Check the API key or permissions"],
            ["404", "Not Found", "The resource does not exist"],
            ["429", "Too Many Requests", "Wait, then retry"],
            ["500 / 503", "Server error / Unavailable", "Retry later; it is not your fault"],
          ],
        },
        codeChallenge: {
          task: "Write handle_response(status, body) that processes a simulated HTTP response. For 200 or 201 return the JSON body parsed with json.loads. For 204 return None. For any other 4xx raise ValueError(\"client error STATUS: MESSAGE\") using the \"error\" field of the JSON body if present (otherwise the raw body). For 5xx raise RuntimeError(\"server error STATUS\").",
          starter: "import json\n\ndef handle_response(status, body):\n    return json.loads(body)\n",
          sample: "handle_response(404, '{\"error\": \"student not found\"}') raises ValueError('client error 404: student not found')",
          tests: [
            {
              check:
                'assert handle_response(200, \'{"id": 1, "name": "Ada"}\') == {"id": 1, "name": "Ada"}, "200: return the parsed body."\n' +
                'assert handle_response(201, "[1, 2]") == [1, 2], "201: return the parsed body."\n' +
                'assert handle_response(204, "") is None, "204: return None."\n' +
                'for status, body, msg in [(404, \'{"error": "student not found"}\', "client error 404: student not found"), (400, "bad json", "client error 400: bad json")]:\n' +
                '    try:\n' +
                '        handle_response(status, body)\n' +
                '        assert False, f"Status {status} should raise ValueError"\n' +
                '    except ValueError as e:\n' +
                '        assert str(e) == msg, f"Expected {msg!r}, got {str(e)!r}"\n' +
                'try:\n' +
                '    handle_response(503, "")\n' +
                '    assert False, "Status 503 should raise RuntimeError"\n' +
                'except RuntimeError as e:\n' +
                '    assert str(e) == "server error 503", "Expected \'server error 503\', got " + repr(str(e))',
            },
          ],
          solution: 'import json\n\ndef handle_response(status, body):\n    if status in (200, 201):\n        return json.loads(body)\n    if status == 204:\n        return None\n    if 400 <= status < 500:\n        try:\n            message = json.loads(body).get("error", body)\n        except (ValueError, AttributeError):\n            message = body\n        raise ValueError(f"client error {status}: {message}")\n    if status >= 500:\n        raise RuntimeError(f"server error {status}")\n    return body\n',
          hint: "Check the status ranges in order. For 4xx, try json.loads(body).get(\"error\", body), falling back to the raw body if it is not JSON (json.JSONDecodeError is a ValueError).",
          successMessage: "Your client now reacts correctly to every class of response, which is most of the work of using any API reliably.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 79 · 19.4 – 19.7
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "pp-l79-consuming-apis",
    moduleId: "pp-m19-apis",
    sectionId: SECTION_ID,
    order: 2,
    covers: ["19.4", "19.5", "19.6", "19.7"],
    title: "REST and Consuming APIs",
    subtitle: "REST design, requests, timeouts, network errors and API keys",
    estimatedMinutes: 28,
    intro:
      "Most public APIs follow REST conventions, so once you can read one, you can read them all. Then the client side: building requests, never waiting forever, surviving a flaky network, and keeping your API key out of your code.",

    atoms: [
      {
        id: "a-pp-rest",
        title: "REST API concepts",
        explain:
          "REST organises an API around RESOURCES (nouns in the URL) and uses HTTP methods as the verbs. Collections are plural: /students. One item adds its id: /students/41. Filters go in the query string: /students?class=SS2&page=2. Responses are JSON, status codes carry meaning, and each request contains everything the server needs (it is stateless).",
        table: {
          caption: "A REST API for students.",
          headers: ["Method and URL", "Meaning", "Success status"],
          rows: [
            ["GET /students", "List students", "200"],
            ["GET /students?class=SS2", "List students in SS2", "200"],
            ["GET /students/41", "Get student 41", "200 (404 if missing)"],
            ["POST /students", "Create a student from the JSON body", "201"],
            ["PATCH /students/41", "Update some fields of student 41", "200"],
            ["DELETE /students/41", "Delete student 41", "204"],
          ],
        },
        codeChallenge: {
          task: "Write build_url(base, resource, item_id=None, **filters) that builds a REST URL: base + \"/\" + resource, then \"/\" + item_id if given, then a query string from the filters (sorted by name, encoded with urllib.parse.urlencode) if there are any. Avoid double slashes when base ends with /.",
          starter: "from urllib.parse import urlencode\n\ndef build_url(base, resource, item_id=None, **filters):\n    pass\n",
          sample: "build_url(\"https://api.school.ng/v1\", \"students\", cls=\"SS2\", page=2) → 'https://api.school.ng/v1/students?cls=SS2&page=2'",
          tests: [
            {
              check:
                'assert build_url("https://api.school.ng/v1", "students") == "https://api.school.ng/v1/students", "Got " + repr(build_url("https://api.school.ng/v1", "students"))\n' +
                'assert build_url("https://api.school.ng/v1/", "students", 41) == "https://api.school.ng/v1/students/41", "No double slash; include the id. Got " + repr(build_url("https://api.school.ng/v1/", "students", 41))\n' +
                'assert build_url("https://api.school.ng/v1", "students", page=2, cls="SS2") == "https://api.school.ng/v1/students?cls=SS2&page=2", "Filters sorted by name. Got " + repr(build_url("https://api.school.ng/v1", "students", page=2, cls="SS2"))\n' +
                'assert build_url("https://x.ng", "search", q="Ada Obi & co") == "https://x.ng/search?q=Ada+Obi+%26+co", "Values must be URL-encoded. Got " + repr(build_url("https://x.ng", "search", q="Ada Obi & co"))',
            },
          ],
          solution: 'from urllib.parse import urlencode\n\ndef build_url(base, resource, item_id=None, **filters):\n    url = base.rstrip("/") + "/" + resource\n    if item_id is not None:\n        url += "/" + str(item_id)\n    if filters:\n        url += "?" + urlencode(sorted(filters.items()))\n    return url\n',
          hint: "base.rstrip(\"/\") removes a trailing slash. urlencode accepts a list of (name, value) pairs, so pass sorted(filters.items()).",
          successMessage: "Correctly encoded REST URLs. The & in \"Ada Obi & co\" would otherwise have broken the query string.",
        },
      },
      {
        id: "a-pp-requests",
        title: "Consuming APIs using requests",
        explain:
          "The requests package (python -m pip install requests) is the standard HTTP client. requests.get(url, params={...}, headers={...}, timeout=10) sends a GET; requests.post(url, json={...}) sends JSON. The response has .status_code, .headers, .json() for the parsed body, and .raise_for_status() which raises for any 4xx or 5xx. Run these examples in VS Code; the lesson editor has no internet access.",
        example:
          "import requests\n\nresponse = requests.get(\n    \"https://api.open-meteo.com/v1/forecast\",\n    params={\"latitude\": 6.45, \"longitude\": 3.39,\n            \"current_weather\": \"true\"},\n    timeout=10,\n)\nresponse.raise_for_status()\nweather = response.json()[\"current_weather\"]\nprint(\"Lagos:\", weather[\"temperature\"], \"°C\")\n\n# Sending data\nr = requests.post(\"https://httpbin.org/post\",\n                  json={\"name\": \"Ada\"}, timeout=10)\nprint(r.status_code, r.json()[\"json\"])",
      },
      {
        id: "a-pp-timeouts-errors",
        title: "Timeouts and network errors",
        explain:
          "Networks fail: a server is slow, Wi-Fi drops, DNS fails. Always pass timeout= to requests, or a hung server freezes your program forever. Catch requests.Timeout and requests.ConnectionError (both subclasses of requests.RequestException). For temporary failures (timeouts, 429, 503), RETRY a few times with an increasing wait (exponential backoff); for 4xx client errors, do not retry, because the same request will fail the same way.",
        codeChallenge: {
          task: "Write get_with_retry(fetch, url, attempts=3) where fetch(url) returns a (status, data) tuple or raises TimeoutError or ConnectionError. Retry on those exceptions and on status 429 or 503, up to attempts tries in total. Return data as soon as a status of 200 arrives. For any other status, raise ValueError(f\"request failed with STATUS\") immediately without retrying. If every attempt fails, raise RuntimeError(f\"gave up after ATTEMPTS attempts\"). (Real code would also sleep between tries; leave that out here.)",
          starter: "def get_with_retry(fetch, url, attempts=3):\n    status, data = fetch(url)\n    return data\n",
          sample: "A fetch that times out twice then returns (200, {...}) gives the data on the third try.",
          tests: [
            {
              check:
                'def scripted(*outcomes):\n' +
                '    calls = []\n' +
                '    def fetch(url):\n' +
                '        calls.append(url)\n' +
                '        o = outcomes[len(calls) - 1]\n' +
                '        if isinstance(o, Exception):\n' +
                '            raise o\n' +
                '        return o\n' +
                '    return fetch, calls\n' +
                'f, calls = scripted(TimeoutError(), ConnectionError(), (200, {"ok": True}))\n' +
                'assert get_with_retry(f, "u") == {"ok": True} and len(calls) == 3, "Retry through a timeout and a connection error. Calls made: " + str(len(calls))\n' +
                'f, calls = scripted((503, None), (200, "data"))\n' +
                'assert get_with_retry(f, "u") == "data" and len(calls) == 2, "Retry on 503."\n' +
                'f, calls = scripted((404, None), (200, "never"))\n' +
                'try:\n' +
                '    get_with_retry(f, "u")\n' +
                '    assert False, "404 should raise ValueError without retrying."\n' +
                'except ValueError as e:\n' +
                '    assert str(e) == "request failed with 404" and len(calls) == 1, "Do not retry a 404. Calls: " + str(len(calls))\n' +
                'f, calls = scripted(TimeoutError(), (429, None), TimeoutError(), (200, "late"))\n' +
                'try:\n' +
                '    get_with_retry(f, "u", attempts=3)\n' +
                '    assert False, "Three failures should give up."\n' +
                'except RuntimeError as e:\n' +
                '    assert str(e) == "gave up after 3 attempts" and len(calls) == 3, "Stop after 3 attempts. Calls: " + str(len(calls))',
            },
          ],
          solution: 'def get_with_retry(fetch, url, attempts=3):\n    for _ in range(attempts):\n        try:\n            status, data = fetch(url)\n        except (TimeoutError, ConnectionError):\n            continue\n        if status == 200:\n            return data\n        if status in (429, 503):\n            continue\n        raise ValueError(f"request failed with {status}")\n    raise RuntimeError(f"gave up after {attempts} attempts")\n',
          hint: "Loop attempts times. Inside: try fetch; on the two exceptions, continue. Return on 200, continue on 429/503, raise ValueError for anything else. After the loop, raise RuntimeError.",
          successMessage: "Temporary failures retried, permanent ones reported at once, and a hard limit on attempts. Passing fetch in also made this testable without any network.",
        },
      },
      {
        id: "a-pp-api-keys",
        title: "API keys and environment variables",
        explain:
          "Most APIs identify you with a key, sent in a header (Authorization: Bearer KEY, or X-API-Key: KEY) or occasionally as a query parameter. Treat it like a password: read it from an environment variable or a .env file (Module 15), never commit it, never put it in client-side code, and send it only over HTTPS. If a key leaks, revoke it.",
        codeChallenge: {
          task: "Write auth_headers() that reads WEATHER_API_KEY from os.environ and returns {\"Authorization\": \"Bearer KEY\", \"Accept\": \"application/json\"}, raising RuntimeError(\"WEATHER_API_KEY is not set\") if the variable is missing or blank. No key may appear in your source code.",
          starter: 'import os\n\ndef auth_headers():\n    return {"Authorization": "Bearer sk-weather-123", "Accept": "application/json"}\n',
          sample: "With WEATHER_API_KEY=abc: {'Authorization': 'Bearer abc', 'Accept': 'application/json'}",
          tests: [
            {
              check:
                'import os\n' +
                'os.environ.pop("WEATHER_API_KEY", None)\n' +
                'try:\n' +
                '    auth_headers()\n' +
                '    assert False, "With no key set, raise RuntimeError."\n' +
                'except RuntimeError as e:\n' +
                '    assert str(e) == "WEATHER_API_KEY is not set", "Message: WEATHER_API_KEY is not set"\n' +
                'os.environ["WEATHER_API_KEY"] = "  "\n' +
                'try:\n' +
                '    auth_headers()\n' +
                '    assert False, "A blank key counts as missing."\n' +
                'except RuntimeError:\n' +
                '    pass\n' +
                'os.environ["WEATHER_API_KEY"] = "abc"\n' +
                'assert auth_headers() == {"Authorization": "Bearer abc", "Accept": "application/json"}, "Got " + repr(auth_headers())\n' +
                'os.environ.pop("WEATHER_API_KEY", None)\n' +
                'assert "sk-" not in source, "Remove the hard-coded key."',
            },
          ],
          solution: 'import os\n\ndef auth_headers():\n    key = os.environ.get("WEATHER_API_KEY", "").strip()\n    if not key:\n        raise RuntimeError("WEATHER_API_KEY is not set")\n    return {"Authorization": f"Bearer {key}", "Accept": "application/json"}\n',
          hint: "os.environ.get(\"WEATHER_API_KEY\", \"\").strip(), raise if empty, then build the dictionary with an f-string.",
          successMessage: "The key lives in the environment, never in the code, and a missing key fails loudly at start-up.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 80 · 19.8 – 19.10
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "pp-l80-building-apis",
    moduleId: "pp-m19-apis",
    sectionId: SECTION_ID,
    order: 3,
    covers: ["19.8", "19.9", "19.10"],
    title: "Building an API",
    subtitle: "Flask and FastAPI, validation and response formatting, authentication",
    estimatedMinutes: 30,
    intro:
      "Now the server side. A web framework turns incoming HTTP requests into calls to your Python functions and turns their return values into responses. Under the framework, an API is just functions that take a request and return a status code and JSON, with validation and security checks first.",

    atoms: [
      {
        id: "a-pp-flask",
        title: "Building a basic API using Flask or FastAPI",
        explain:
          "Flask and FastAPI are the two most popular Python web frameworks for APIs. You write a function per endpoint and attach it to a URL and method with a decorator. Flask is minimal and flexible; FastAPI adds automatic validation from type hints and interactive documentation. Install with python -m pip install flask (or fastapi uvicorn) and run the examples in VS Code; then open http://127.0.0.1:5000/students in a browser.",
        example:
          "# app.py  (python -m pip install flask, then: flask --app app run)\nfrom flask import Flask, jsonify, request\n\napp = Flask(__name__)\nstudents = {1: {\"id\": 1, \"name\": \"Ada\", \"class\": \"SS2\"}}\n\n@app.get(\"/students\")\ndef list_students():\n    return jsonify(list(students.values()))\n\n@app.get(\"/students/<int:student_id>\")\ndef get_student(student_id):\n    if student_id not in students:\n        return jsonify(error=\"student not found\"), 404\n    return jsonify(students[student_id])\n\n@app.post(\"/students\")\ndef create_student():\n    data = request.get_json(silent=True) or {}\n    if not data.get(\"name\"):\n        return jsonify(error=\"name is required\"), 400\n    new_id = max(students, default=0) + 1\n    students[new_id] = {\"id\": new_id, \"name\": data[\"name\"],\n                        \"class\": data.get(\"class\", \"\")}\n    return jsonify(students[new_id]), 201",
      },
      {
        id: "a-pp-api-validation",
        title: "Request validation and response formatting",
        explain:
          "Validate every request before acting: required fields present, types correct, values in range. Reject bad input with 400 and a JSON body explaining exactly what is wrong. Format every response consistently: success bodies contain the resource; error bodies contain an \"error\" message; status codes follow REST (201 for created, 404 for missing, 405 for a method the URL does not support).",
        codeChallenge: {
          task: "Without a framework, write handle(method, path, body) for a students API, returning (status, response_dict_or_list). Data lives in the given students dictionary. Support: GET /students (200, list of all students); GET /students/ID (200 with the student, or 404 {\"error\": \"student not found\"}); POST /students with body a dict containing name (non-empty str) and score (int 0–100), creating {\"id\": next_id, \"name\": ..., \"score\": ...} and returning 201, or 400 {\"error\": \"MESSAGE\"} naming the first problem (\"name is required\" or \"score must be an integer from 0 to 100\"). Any other method on these paths gives 405 {\"error\": \"method not allowed\"}; any other path gives 404 {\"error\": \"not found\"}.",
          starter: 'students = {1: {"id": 1, "name": "Ada", "score": 72}}\n\ndef handle(method, path, body=None):\n    pass\n',
          sample: "handle(\"GET\", \"/students/1\") → (200, {'id': 1, 'name': 'Ada', 'score': 72})",
          tests: [
            {
              check:
                'students.clear()\n' +
                'students[1] = {"id": 1, "name": "Ada", "score": 72}\n' +
                'assert handle("GET", "/students") == (200, [{"id": 1, "name": "Ada", "score": 72}]), "GET /students. Got " + repr(handle("GET", "/students"))\n' +
                'assert handle("GET", "/students/1") == (200, {"id": 1, "name": "Ada", "score": 72}), "GET one student."\n' +
                'assert handle("GET", "/students/9") == (404, {"error": "student not found"}), "Missing student. Got " + repr(handle("GET", "/students/9"))\n' +
                'assert handle("GET", "/students/abc") == (404, {"error": "student not found"}), "A non-numeric id is not found, not a crash."\n' +
                'assert handle("POST", "/students", {"name": "Bo", "score": 64}) == (201, {"id": 2, "name": "Bo", "score": 64}), "Create a student."\n' +
                'assert len(students) == 2, "POST must store the new student."\n' +
                'assert handle("POST", "/students", {"score": 50}) == (400, {"error": "name is required"}), "Missing name."\n' +
                'assert handle("POST", "/students", {"name": "Cy", "score": 101}) == (400, {"error": "score must be an integer from 0 to 100"}), "Score out of range."\n' +
                'assert handle("POST", "/students", {"name": "Cy", "score": "90"}) == (400, {"error": "score must be an integer from 0 to 100"}), "Score must be an int."\n' +
                'assert handle("POST", "/students", None) == (400, {"error": "name is required"}), "No body at all."\n' +
                'assert handle("DELETE", "/students") == (405, {"error": "method not allowed"}), "Unsupported method."\n' +
                'assert handle("GET", "/teachers") == (404, {"error": "not found"}), "Unknown path."',
            },
          ],
          solution: 'students = {1: {"id": 1, "name": "Ada", "score": 72}}\n\ndef handle(method, path, body=None):\n    parts = path.strip("/").split("/")\n    if parts[0] != "students" or len(parts) > 2:\n        return 404, {"error": "not found"}\n    if len(parts) == 1:\n        if method == "GET":\n            return 200, list(students.values())\n        if method == "POST":\n            body = body or {}\n            name = body.get("name")\n            score = body.get("score")\n            if not isinstance(name, str) or not name.strip():\n                return 400, {"error": "name is required"}\n            if type(score) is not int or not 0 <= score <= 100:\n                return 400, {"error": "score must be an integer from 0 to 100"}\n            new_id = max(students, default=0) + 1\n            students[new_id] = {"id": new_id, "name": name.strip(), "score": score}\n            return 201, students[new_id]\n        return 405, {"error": "method not allowed"}\n    if method != "GET":\n        return 405, {"error": "method not allowed"}\n    if not parts[1].isdigit() or int(parts[1]) not in students:\n        return 404, {"error": "student not found"}\n    return 200, students[int(parts[1])]\n',
          hint: "Split the path on \"/\" first. Handle /students (GET or POST) and /students/ID (GET) separately. Validate the POST body field by field and return on the first problem.",
          successMessage: "This is exactly what Flask's routing does for you, now understood from the inside: routes, methods, validation and consistent JSON errors.",
        },
      },
      {
        id: "a-pp-api-auth",
        title: "Basic authentication and secure configuration",
        explain:
          "An API must know who is calling. The simplest scheme: clients send a secret key in a header, X-API-Key or Authorization: Bearer KEY, and the server compares it with keys stored in configuration (environment variables, never code). Missing credentials get 401 Unauthorized; valid credentials without permission get 403 Forbidden. Compare secrets with hmac.compare_digest, which takes the same time whether the first or last character differs, so attackers cannot guess keys by timing. Serve APIs only over HTTPS.",
        codeChallenge: {
          task: "Write check_auth(headers, valid_keys) that returns (status, message): (401, \"missing API key\") if headers has no X-API-Key (header names are case-insensitive, so x-api-key counts); (403, \"invalid API key\") if the key does not match any key in valid_keys; otherwise (200, \"ok\"). Compare keys with hmac.compare_digest.",
          starter: "import hmac\n\ndef check_auth(headers, valid_keys):\n    if headers.get(\"X-API-Key\") in valid_keys:\n        return 200, \"ok\"\n    return 403, \"invalid API key\"\n",
          sample: "check_auth({\"x-api-key\": \"k1\"}, [\"k1\", \"k2\"]) → (200, 'ok')",
          tests: [
            {
              check:
                'keys = ["live-key-1", "live-key-2"]\n' +
                'assert check_auth({"X-API-Key": "live-key-2"}, keys) == (200, "ok"), "A valid key passes."\n' +
                'assert check_auth({"x-api-key": "live-key-1"}, keys) == (200, "ok"), "Header names are case-insensitive."\n' +
                'assert check_auth({}, keys) == (401, "missing API key"), "No key: 401. Got " + repr(check_auth({}, keys))\n' +
                'assert check_auth({"X-API-Key": "  "}, keys) == (401, "missing API key"), "A blank key counts as missing."\n' +
                'assert check_auth({"X-API-Key": "guess"}, keys) == (403, "invalid API key"), "A wrong key: 403."\n' +
                'assert calls("compare_digest"), "Compare keys with hmac.compare_digest."',
            },
          ],
          solution: 'import hmac\n\ndef check_auth(headers, valid_keys):\n    supplied = ""\n    for name, value in headers.items():\n        if name.lower() == "x-api-key":\n            supplied = value.strip()\n    if not supplied:\n        return 401, "missing API key"\n    for key in valid_keys:\n        if hmac.compare_digest(supplied.encode(), key.encode()):\n            return 200, "ok"\n    return 403, "invalid API key"\n',
          hint: "Find the header by comparing name.lower() with \"x-api-key\". Then loop over valid_keys with hmac.compare_digest(supplied.encode(), key.encode()).",
          successMessage: "401 versus 403 distinguished, case-insensitive headers, and timing-safe comparison: the basics every protected API needs.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 81 · 19.11
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "pp-l81-async",
    moduleId: "pp-m19-apis",
    sectionId: SECTION_ID,
    order: 4,
    covers: ["19.11"],
    title: "Asynchronous Programming and async/await",
    subtitle: "Doing other work while waiting for the network",
    estimatedMinutes: 24,
    intro:
      "A program fetching 50 web pages one after another spends almost all its time waiting. Asynchronous code lets it start all 50 requests and handle each reply as it arrives, finishing in roughly the time of the slowest one. Python's async and await keywords make this readable.",

    atoms: [
      {
        id: "a-pp-async-concepts",
        title: "async, await and the event loop",
        explain:
          "async def defines a COROUTINE function; calling it returns a coroutine object instead of running it. Inside a coroutine, await pauses until another coroutine (such as a network call) finishes, letting the EVENT LOOP run other coroutines meanwhile. asyncio.run(main()) starts the loop; asyncio.gather(a(), b(), c()) runs several coroutines concurrently and returns their results in order. Async helps with waiting (network, files, timers), not with heavy calculation.",
        code: {
          language: PY,
          runnable: false,
          code: 'import asyncio\n\nasync def fetch_price(item, delay):\n    await asyncio.sleep(delay)      # stands in for a network request\n    return f"{item}: ready after {delay}s"\n\nasync def main():\n    results = await asyncio.gather(\n        fetch_price("rice", 0.03),\n        fetch_price("oil", 0.01),\n        fetch_price("salt", 0.02),\n    )\n    for line in results:\n        print(line)\n\nasyncio.run(main())\n',
          expectedOutput: "rice: ready after 0.03s\noil: ready after 0.01s\nsalt: ready after 0.02s",
        },
        why: "All three waits overlap, so main finishes after about 0.03 seconds, not 0.06. gather returns results in the order the coroutines were given, regardless of which finished first. Run this one in VS Code; the lesson editor already runs inside an event loop.",
      },
      {
        id: "a-pp-async-practice",
        title: "Writing coroutines",
        explain:
          "An async function can await any other coroutine and use every normal Python feature: loops, conditions, try/except. A common pattern is a coroutine that takes an async fetch function as a parameter (so it can be tested with a fake one) and collects or processes several results.",
        codeChallenge: {
          task: "Write async def fetch_all(fetch, ids) that awaits fetch(i) for each id and returns a dictionary of id → result, leaving out any id whose fetch raises LookupError. Then write async def total_price(fetch, ids) that awaits fetch_all and returns the sum of the results. (The checker drives your coroutines with a fake async fetch.)",
          starter: "async def fetch_all(fetch, ids):\n    pass\n\nasync def total_price(fetch, ids):\n    pass\n",
          sample: "With prices {1: 500, 2: 300}, fetch_all(fetch, [1, 2, 9]) → {1: 500, 2: 300}",
          tests: [
            {
              check:
                'import inspect\n' +
                'assert inspect.iscoroutinefunction(fetch_all) and inspect.iscoroutinefunction(total_price), "Both functions must be defined with async def."\n' +
                'def drive(coro):\n' +
                '    try:\n' +
                '        coro.send(None)\n' +
                '    except StopIteration as done:\n' +
                '        return done.value\n' +
                '    raise AssertionError("The coroutine paused unexpectedly.")\n' +
                'prices = {1: 500, 2: 300, 3: 1200}\n' +
                'seen = []\n' +
                'async def fake_fetch(i):\n' +
                '    seen.append(i)\n' +
                '    if i not in prices:\n' +
                '        raise LookupError(i)\n' +
                '    return prices[i]\n' +
                'assert drive(fetch_all(fake_fetch, [1, 2, 9])) == {1: 500, 2: 300}, "Skip ids whose fetch raises LookupError."\n' +
                'assert seen == [1, 2, 9], "fetch must be awaited once for each id."\n' +
                'assert drive(total_price(fake_fetch, [1, 3, 7])) == 1700, "total_price adds the available prices: 1700."\n' +
                'assert drive(fetch_all(fake_fetch, [])) == {}, "No ids gives an empty dictionary."',
            },
          ],
          solution: "async def fetch_all(fetch, ids):\n    results = {}\n    for i in ids:\n        try:\n            results[i] = await fetch(i)\n        except LookupError:\n            continue\n    return results\n\nasync def total_price(fetch, ids):\n    prices = await fetch_all(fetch, ids)\n    return sum(prices.values())\n",
          hint: "Inside fetch_all: loop, try: results[i] = await fetch(i), except LookupError: continue. total_price awaits fetch_all and sums the values.",
          successMessage: "Coroutines that await, handle errors and compose. With a real HTTP client such as httpx, swapping the loop for asyncio.gather would make the requests run concurrently.",
        },
      },
    ],

    task: {
      title: "Module 19 practice: consume an API and build one",
      intro: "Work in VS Code with internet access. The milestone is to connect Python applications to external services and understand how backend applications work.",
      prompts: [
        "Consume a public API (for example Open-Meteo for weather, or a free currency API) with requests: timeouts, raise_for_status, retries on 429/503, and the key (if needed) from an environment variable.",
        "Build a Flask (or FastAPI) service exposing student or inventory records with GET (list and one), POST (validated), PATCH and DELETE, storing data in SQLite from Module 18.",
        "Protect the write endpoints with an API key read from the environment and compared with hmac.compare_digest.",
        "Test your API with Flask's test client (app.test_client()) in pytest, covering success, 400, 401, 403 and 404 responses.",
        "Extension: fetch three API endpoints concurrently with httpx.AsyncClient and asyncio.gather, and time it against fetching them one by one.",
      ],
      closing: "Next: the final module. Automation, deployment and your portfolio.",
    },

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
