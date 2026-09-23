/**
 * ASSESSMENTS · CYBERSECURITY · WEEK 8 · WEB APPLICATION SECURITY
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Never import this from anything under src/.
 * ═════════════════════════════════════════════════════════════════════════
 */

export const ASSESSMENTS = {
  /* ═══════════════════════════════════════════════════════════════════ */
  "cs-l29-how-the-web-holds-state": {
    lessonId: "cs-l29-how-the-web-holds-state",
    passMark: 70,
    questions: [
      {
        id: "csq29-1",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cs-w8-cookies",
        prompt: "Which cookie attribute stops a cross-site scripting flaw from reading the session?",
        options: [
          { id: "a", text: "Secure" },
          { id: "b", text: "HttpOnly" },
          { id: "c", text: "SameSite" },
          { id: "d", text: "Path" },
        ],
        correct: "b",
        explanation:
          "HttpOnly makes the cookie invisible to JavaScript. Note what it does not do: an attacker with script execution can still make requests as you from inside your own browser without reading anything.",
        whyWrong: {
          a: "Secure prevents the cookie being sent over plain HTTP. It has no effect on script running in the page.",
          c: "SameSite governs whether the cookie is attached to cross-site requests, which is the CSRF defence.",
          d: "Path scopes which URLs receive the cookie. It is not a security boundary against script on the same site.",
        },
      },
      {
        id: "csq29-2",
        type: "scenario",
        difficulty: 3,
        atomId: "a-cs-w8-session-lifecycle",
        prompt:
          "An application does not issue a new session token when a user logs in. What attack does that enable?",
        options: [
          { id: "a", text: "Cross-site request forgery" },
          { id: "b", text: "Session fixation: an attacker who set a known token beforehand now holds an authenticated one" },
          { id: "c", text: "SQL injection" },
          { id: "d", text: "Clickjacking" },
        ],
        correct: "b",
        explanation:
          "The token the attacker planted becomes authenticated when the victim logs in with it. Rotating the token at any privilege change removes the attack entirely.",
        whyWrong: {
          a: "CSRF concerns requests the browser is tricked into sending, and does not depend on token rotation.",
          c: "Nothing here involves data reaching a query as instruction.",
          d: "Clickjacking is about framing your page, and is addressed by frame-ancestors or X-Frame-Options.",
        },
      },
      {
        id: "csq29-3",
        type: "mcq",
        difficulty: 3,
        atomId: "a-cs-w8-tokens-vs-cookies",
        prompt:
          "What do you give up by replacing server-side sessions with signed tokens such as JWTs?",
        options: [
          { id: "a", text: "The ability to authenticate users" },
          { id: "b", text: "Immediate revocation. A stolen token stays valid until it expires" },
          { id: "c", text: "Support for mobile clients" },
          { id: "d", text: "The ability to use HTTPS" },
        ],
        correct: "b",
        explanation:
          "There is nothing to look up and therefore nothing to delete. Getting revocation back means building the list the design was avoiding.",
        whyWrong: {
          a: "Authentication works fine. What changes is where the state lives.",
          c: "Tokens are often chosen specifically because they suit mobile and API clients.",
          d: "Transport security is orthogonal and applies either way.",
        },
      },
      {
        id: "csq29-4",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cs-w8-owasp-what-it-is",
        prompt: "What can you honestly conclude from an application passing a Top 10 review?",
        options: [
          { id: "a", text: "The application is secure" },
          {
            id: "b",
            text: "The reviewer found nothing in those ten categories, in the time available, on the parts examined",
          },
          { id: "c", text: "The application is compliant with the OWASP standard" },
          { id: "d", text: "The application has no business logic flaws" },
        ],
        correct: "b",
        explanation:
          "It is a list of categories compiled from real data, not a checklist or a standard. Business logic flaws, which are specific to what the application does, are not on it at all.",
        whyWrong: {
          a: "No review supports that claim, and Week 1's first lesson explains why the sentence has no meaning.",
          c: "The Top 10 is not a standard and there is nothing to be compliant with.",
          d: "Logic flaws are precisely what such a review is least likely to find.",
        },
      },
      {
        id: "csq29-5",
        type: "truefalse",
        difficulty: 2,
        atomId: "a-cs-w8-stateless",
        prompt:
          "The server remembers which browser logged in, so a request without a session token can still be recognised.",
        options: [
          { id: "a", text: "True" },
          { id: "b", text: "False" },
        ],
        correct: "b",
        explanation:
          "False. HTTP has no memory between requests. Identity comes entirely from what the request carries, which is why a session token is your whole identity to the server.",
        whyWrong: {
          a: "IP addresses and fingerprints are sometimes used as weak signals and are neither reliable nor an identity. Anything not in the request is not known.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "cs-l30-access-control": {
    lessonId: "cs-l30-access-control",
    passMark: 70,
    questions: [
      {
        id: "csq30-1",
        type: "scenario",
        difficulty: 3,
        atomId: "a-cs-w8-idor",
        prompt:
          "Changing an invoice id in a URL returns another customer's invoice. What is the correct fix?",
        options: [
          { id: "a", text: "Make the ids random so they cannot be guessed" },
          {
            id: "b",
            text: "Scope the query to the authenticated user, so it cannot return another customer's row at all",
          },
          { id: "c", text: "Rate limit the endpoint" },
          { id: "d", text: "Return 404 instead of 200" },
        ],
        correct: "b",
        explanation:
          "One line in the query: WHERE id = ? AND customer_id = ?. Not a lookup followed by a check, but a query that cannot produce the wrong row.",
        whyWrong: {
          a: "Unguessable ids raise effort and restore no check, and ids leak through exports, emails, referrer headers and support tickets.",
          c: "Rate limiting slows enumeration. A single unauthorised invoice is still returned.",
          d: "Changing the status code hides the result without changing who can retrieve data.",
        },
      },
      {
        id: "csq30-2",
        type: "scenario",
        difficulty: 3,
        atomId: "a-cs-w8-client-side-checks",
        prompt:
          "A checkout sends the item price in a hidden field and the server charges what it receives. What is the fix?",
        options: [
          { id: "a", text: "Strengthen the form validation" },
          { id: "b", text: "Take the price from the server's own record; anything the client sends about price is a suggestion" },
          { id: "c", text: "Encrypt the price field before sending" },
          { id: "d", text: "Add a checksum over the form fields" },
        ],
        correct: "b",
        explanation:
          "The server already has the price. There is no reason to accept one from the client, and any value the client controls must be treated as an assertion to be checked rather than a fact.",
        whyWrong: {
          a: "Form validation runs on the attacker's machine at their discretion, and the request can be built without a browser at all.",
          c: "Encrypting a value the client must also produce achieves nothing, and if it cannot produce it there was no reason to send it.",
          d: "A signed cart is a real pattern and a more complex answer to a problem that disappears if the server looks up its own price.",
        },
      },
      {
        id: "csq30-3",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cs-w8-function-level",
        prompt:
          "An admin endpoint is protected by not showing the link to ordinary users. Why is that not a control?",
        options: [
          { id: "a", text: "Because the link may be cached" },
          { id: "b", text: "Because the endpoint still answers anyone who knows the path; authorisation must be enforced on the server" },
          { id: "c", text: "Because search engines will index it" },
          { id: "d", text: "Because ordinary users can see the link in the page source" },
        ],
        correct: "b",
        explanation:
          "Hiding a button is a user experience decision. The request is what reaches the server, and the server has to decide on every request regardless of what the interface offered.",
        whyWrong: {
          a: "Caching is incidental. The path would be discoverable in many ways regardless.",
          c: "Indexing might expose the path, and even an entirely unknown path is not a control.",
          d: "That is one way the path leaks. Even with no leak at all, the endpoint would still be unprotected.",
        },
      },
      {
        id: "csq30-4",
        type: "mcq",
        difficulty: 3,
        atomId: "a-cs-w8-mass-assignment",
        prompt:
          "A registration endpoint binds the whole request body to a user object. What is the risk?",
        options: [
          { id: "a", text: "The request may be too large" },
          {
            id: "b",
            text: "An attacker adds fields the form never sends, such as a role, and they are assigned",
          },
          { id: "c", text: "The password may be logged" },
          { id: "d", text: "The user object may be cached" },
        ],
        correct: "b",
        explanation:
          "It is access control failing where data is bound rather than where it is read, and it is invisible in the form because the form never sends that field. The fix is an explicit list of accepted fields.",
        whyWrong: {
          a: "Request size is an availability concern and is handled elsewhere.",
          c: "Logging sensitive values is a real and separate problem with a separate fix.",
          d: "Caching does not create the assignment. The binding does.",
        },
      },
      {
        id: "csq30-5",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cs-w8-deny-by-default",
        prompt:
          "Why is a hand-maintained list of protected routes a poor way to implement authorisation?",
        options: [
          { id: "a", text: "It is slow to evaluate" },
          {
            id: "b",
            text: "Because the default for anything not on the list is open, and new routes are added by people in a hurry",
          },
          { id: "c", text: "Because routes change too often to document" },
          { id: "d", text: "Because frameworks do not support it" },
        ],
        correct: "b",
        explanation:
          "Deny by default converts the most common cause of this bug, somebody adding an endpoint and not thinking about authorisation, from a silent vulnerability into a failure at development time.",
        whyWrong: {
          a: "Evaluation cost is negligible either way.",
          c: "Documentation is a symptom. The problem is what happens to a route nobody documented.",
          d: "Most frameworks support both approaches. The choice is the team's.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "cs-l31-injection-and-xss": {
    lessonId: "cs-l31-injection-and-xss",
    passMark: 70,
    questions: [
      {
        id: "csq31-1",
        type: "scenario",
        difficulty: 3,
        atomId: "a-cs-w8-telling-them-apart",
        prompt:
          "A victim clicks a link while logged in. Their profile email is silently changed. No script runs and the attacker never sees the response. Which vulnerability is it?",
        options: [
          { id: "a", text: "Stored cross-site scripting" },
          { id: "b", text: "Cross-site request forgery" },
          { id: "c", text: "SQL injection" },
          { id: "d", text: "Broken access control" },
        ],
        correct: "b",
        explanation:
          "The browser sent an authenticated state-changing request the user did not intend, and the attacker read nothing. Change-email endpoints are a favourite target because they lead to account takeover through password reset.",
        whyWrong: {
          a: "Nothing was stored and no script ran, which the report states explicitly.",
          c: "Nothing indicates data reached a query as instruction. The endpoint did exactly what it was designed to do.",
          d: "The victim was entitled to change their own email, so authorisation was correct. What is missing is a check that the request was intentional.",
        },
      },
      {
        id: "csq31-2",
        type: "mcq",
        difficulty: 3,
        atomId: "a-cs-w8-xss",
        prompt: "Why is DOM-based cross-site scripting the hardest of the three to find?",
        options: [
          { id: "a", text: "Because it only affects older browsers" },
          {
            id: "b",
            text: "Because the payload never reaches the server, so no server log records it and server-side scanning cannot see it",
          },
          { id: "c", text: "Because it requires a database" },
          { id: "d", text: "Because it only works over HTTP" },
        ],
        correct: "b",
        explanation:
          "The payload lives in the URL and is handled entirely by client-side script. There is no request body and no stored value for anybody to inspect after the fact.",
        whyWrong: {
          a: "It affects current browsers. It is a property of the application's own script, not of the browser.",
          c: "Stored XSS uses a database. DOM-based specifically does not involve one.",
          d: "Transport security is irrelevant. The script runs inside the page either way.",
        },
      },
      {
        id: "csq31-3",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cs-w8-xss-fixes",
        prompt:
          "In a modern framework that escapes template output by default, where does cross-site scripting usually still appear?",
        options: [
          { id: "a", text: "In form validation" },
          {
            id: "b",
            text: "Where somebody deliberately bypassed the default, with something like dangerouslySetInnerHTML or a raw filter",
          },
          { id: "c", text: "In the database layer" },
          { id: "d", text: "In the routing configuration" },
        ],
        correct: "b",
        explanation:
          "Each of those functions is an explicit override of the framework's protection. Grepping for them takes four seconds and is the right first move on any modern codebase.",
        whyWrong: {
          a: "Validation is a useful layer and is not where the rendering decision is made.",
          c: "Storing the raw value is correct. The failure is at render time.",
          d: "Routing decides which handler runs, not how output is encoded.",
        },
      },
      {
        id: "csq31-4",
        type: "mcq",
        difficulty: 3,
        atomId: "a-cs-w8-csrf",
        prompt: "In a CSRF attack, what does the attacker never obtain?",
        options: [
          { id: "a", text: "A state change on the target application" },
          { id: "b", text: "The session cookie, or the contents of the response" },
          { id: "c", text: "The victim's participation" },
          { id: "d", text: "A request sent from the victim's browser" },
        ],
        correct: "b",
        explanation:
          "They cause a request and cannot read the answer. That is why CSRF targets actions rather than data, and why change-email and change-password endpoints are the highest-value targets.",
        whyWrong: {
          a: "The state change is exactly what they achieve, and is the point of the attack.",
          c: "The victim's browser participates unknowingly, which is the mechanism.",
          d: "That is precisely what happens; the browser sends it with the cookie attached automatically.",
        },
      },
      {
        id: "csq31-5",
        type: "truefalse",
        difficulty: 2,
        atomId: "a-cs-w8-injection-recap",
        prompt:
          "Escaping special characters is the correct fix for SQL injection.",
        options: [
          { id: "a", text: "True" },
          { id: "b", text: "False" },
        ],
        correct: "b",
        explanation:
          "False. The fix is bound parameters, which keep the instruction and the data separate so nothing needs escaping. Escaping rules differ per database and there is always another character.",
        whyWrong: {
          a: "Escaping functions exist and are a fallback for cases where parameters cannot be used, such as identifiers, which need an allowlist instead. As a general fix it is the wrong tool.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "cs-l32-misconfiguration-and-proxy": {
    lessonId: "cs-l32-misconfiguration-and-proxy",
    passMark: 70,
    questions: [
      {
        id: "csq32-1",
        type: "mcq",
        difficulty: 3,
        atomId: "a-cs-w8-misconfiguration",
        prompt: "Why is a .git directory in a web root considered so serious?",
        options: [
          { id: "a", text: "It slows the web server down" },
          {
            id: "b",
            text: "The entire source history can be reconstructed, including every secret ever committed",
          },
          { id: "c", text: "It reveals which version of git is in use" },
          { id: "d", text: "It allows attackers to push code to the repository" },
        ],
        correct: "b",
        explanation:
          "Not just the current source. Every commit, which is where the credentials somebody removed in a later commit still live. It is common and it is devastating.",
        whyWrong: {
          a: "Performance is irrelevant. The exposure is the content.",
          c: "The git version is of no consequence and is not what is exposed.",
          d: "It is read-only over HTTP. Reading everything is quite enough.",
        },
      },
      {
        id: "csq32-2",
        type: "scenario",
        difficulty: 3,
        atomId: "a-cs-w8-data-exposure",
        prompt:
          "A page shows a name and city. The API behind it returns the full user record including a reset token. The front end renders three fields. Is that a finding?",
        options: [
          { id: "a", text: "No, because the extra fields are never displayed" },
          {
            id: "b",
            text: "Yes. Everything sent is in the browser and in anything that logged the response, regardless of what was displayed",
          },
          { id: "c", text: "No, because the API requires authentication" },
          { id: "d", text: "Only if the API is reachable from the internet" },
        ],
        correct: "b",
        explanation:
          "The page is not the API. Filtering in the front end filters nothing, and a reset token in a response is an account takeover waiting for anyone who can read it.",
        whyWrong: {
          a: "Display is a rendering decision. The data crossed the network and is sitting in the browser.",
          c: "Authentication says who may call it. It says nothing about which fields should come back.",
          d: "An authenticated internal user reading another user's reset token is the same problem with a smaller audience.",
        },
      },
      {
        id: "csq32-3",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cs-w8-headers",
        prompt:
          "Which header reduces the impact of a cross-site scripting bug even when the bug is present?",
        options: [
          { id: "a", text: "X-Content-Type-Options" },
          { id: "b", text: "Content-Security-Policy" },
          { id: "c", text: "Strict-Transport-Security" },
          { id: "d", text: "Referrer-Policy" },
        ],
        correct: "b",
        explanation:
          "A restrictive policy on where script may load from and whether inline script may run blocks most payloads even where an injection point exists. It is the hardest of these to retrofit and the most valuable.",
        whyWrong: {
          a: "nosniff stops the browser guessing a file's type, which prevents an upload being executed as script. That is a different path.",
          c: "HSTS forces HTTPS and has no view of page content.",
          d: "Referrer-Policy limits URL leakage to other sites, which is useful and unrelated.",
        },
      },
      {
        id: "csq32-4",
        type: "scenario",
        difficulty: 2,
        atomId: "a-cs-w8-proxy",
        prompt:
          "When is it acceptable to point an intercepting proxy at an application?",
        options: [
          { id: "a", text: "Any public website, since you are only observing your own traffic" },
          {
            id: "b",
            text: "Against deliberately vulnerable applications in your own lab, or a target you have written authorisation to test",
          },
          { id: "c", text: "Any site, as long as you do not modify requests" },
          { id: "d", text: "Any site you have an account on" },
        ],
        correct: "b",
        explanation:
          "A proxy intercepts and modifies traffic, which is squarely on the wrong side of the line from Week 4. Authorisation is what makes the difference, and Week 9 makes it formal.",
        whyWrong: {
          a: "Probing an application you do not own is unauthorised testing regardless of whose browser started it.",
          c: "Passive observation of your own session is one thing; a proxy is used to manipulate requests, which is what it is for.",
          d: "Having an account is not permission to test. Terms of service usually prohibit it explicitly.",
        },
      },
      {
        id: "csq32-5",
        type: "scenario",
        difficulty: 3,
        atomId: "a-cs-w8-logging-failures",
        prompt:
          "An application logs failed logins and nothing else. What is the most valuable missing event?",
        options: [
          { id: "a", text: "Successful logins" },
          { id: "b", text: "Authorisation failures, where a logged-in user is refused access to something" },
          { id: "c", text: "Page views" },
          { id: "d", text: "Database query times" },
        ],
        correct: "b",
        explanation:
          "A failed login is usually a typo. A logged-in user repeatedly being refused resources that are not theirs is somebody probing, and it is one of the highest-signal events an application can produce. Almost nobody logs it.",
        whyWrong: {
          a: "Worth logging and mostly noise on its own, until correlated with something like an unusual location.",
          c: "Useful for analytics and close to worthless for detection.",
          d: "A performance signal with no security meaning.",
        },
      },
    ],
  },
};

export default ASSESSMENTS;
