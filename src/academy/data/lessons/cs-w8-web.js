/**
 * CYBERSECURITY · WEEK 8 · WEB APPLICATION SECURITY & THE OWASP TOP 10
 *
 * Harvard anchor: applies the "Securing Software" pillar to the web, the most
 * common attack surface there is.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 *
 * NO WORKING EXPLOITS. Every vulnerability here is taught by showing the
 * REQUEST SHAPE and the missing check, not a payload to paste at somebody.
 * The learner's lab work is against OWASP Juice Shop or DVWA, which exist to
 * be attacked, on host-only networking. Week 4's rule still applies and Week 9
 * makes it formal.
 *
 * The Top 10 is ordered by the 2021 list, which is the current one at the time
 * of writing. The ordering changes every few years; the categories move around
 * far less, which is why this week teaches the categories rather than the
 * numbers.
 */

export const SECTION_ID = "cs-s8-web";

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 1
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "cs-l29-how-the-web-holds-state",
    moduleId: "cs-w8-web",
    sectionId: SECTION_ID,
    order: 1,
    title: "How the Web Holds State",
    subtitle: "Sessions, cookies, and why any of this is possible",
    estimatedMinutes: 12,
    intro:
      "HTTP has no memory. Every request arrives knowing nothing about the last one. Everything the web does with logins, carts and permissions is built on top of that, and most web vulnerabilities are a consequence of how it was built.",

    atoms: [
      {
        id: "a-cs-w8-stateless",
        title: "HTTP forgets everything",
        explain:
          "Each request is independent. The server has no idea that the request asking for your account page came from the same browser that logged in four seconds ago, unless the request itself carries proof.",
        why: "That proof is the session, and it is the thing every attack in this lesson is trying to obtain, forge or reuse. Once you see that a session token is the whole of your identity to the server, session handling stops looking like plumbing.",
        analogy:
          "A ticket barrier with no memory of faces. It only reads the ticket, and anyone holding a valid ticket is the ticket holder.",
      },
      {
        id: "a-cs-w8-cookies",
        title: "Cookies, and the four flags that matter",
        explain:
          "A cookie is a value the server sets and the browser returns on every subsequent request to that site. Four attributes decide how much protection it has: Secure, HttpOnly, SameSite and its expiry.",
        why: "These four are free, they are one line of configuration, and their absence is a finding in essentially every web assessment. They are also a good example of controls that only make sense once you know the attack each one blocks.",
        table: {
          caption: "One line each, and the attack each one removes.",
          headers: ["Attribute", "Does", "Blocks"],
          rows: [
            ["Secure", "Only sent over HTTPS", "The cookie leaking over a plain HTTP request"],
            ["HttpOnly", "Not readable by JavaScript", "A cross-site scripting flaw stealing the session"],
            ["SameSite=Lax or Strict", "Not sent on cross-site requests", "Most cross-site request forgery"],
            ["A sensible expiry", "Stops being valid", "A stolen token being useful forever"],
          ],
        },
        mistake:
          "Setting HttpOnly and concluding that cross-site scripting no longer matters. It stops the session being read by script, and an attacker with script execution can simply make requests as you from inside your own browser, which does not require reading anything.",
      },
      {
        id: "a-cs-w8-session-lifecycle",
        title: "The session lifecycle, and where it leaks",
        explain:
          "A session is created at login, carried on every request, and should be destroyed at logout and rotated at any change in privilege. Each of those four moments has a matching failure: predictable tokens, tokens in the URL, logout that does not invalidate server side, and no rotation after login.",
        why: "Session fixation is the one people miss. If the token is not replaced at login, an attacker who set a known token in your browser beforehand now holds a token that has become authenticated.",
        table: {
          caption: "Four moments, four failures.",
          headers: ["Moment", "Done wrong", "Consequence"],
          rows: [
            ["Created", "Token is predictable or short", "Guessable sessions"],
            ["Carried", "Token appears in the URL", "Leaks into logs, history and referrer headers"],
            ["Privilege changes", "Token not rotated at login", "Session fixation"],
            ["Destroyed", "Cleared in the browser only", "The token still works if the attacker kept a copy"],
          ],
        },
      },
      {
        id: "a-cs-w8-tokens-vs-cookies",
        title: "Tokens, and why they are not automatically better",
        explain:
          "Many applications now use a signed token, often a JWT, instead of a server-side session. The server verifies the signature rather than looking the session up, which scales beautifully and means there is nothing to revoke.",
        why: "That last part is the trade. A stolen session can be invalidated server side immediately. A stolen signed token is valid until it expires, and nothing you do can call it back unless you build the revocation list that the design was avoiding.",
        mistake:
          "Storing a token in localStorage because a cookie felt old-fashioned. localStorage is readable by any script on the page, so you have given up HttpOnly. A cookie with the four attributes from the previous atom is usually the stronger choice.",
      },
      {
        id: "a-cs-w8-owasp-what-it-is",
        title: "What the Top 10 actually is",
        explain:
          "A periodically updated list of the most significant categories of web application security risk, published by OWASP and compiled from real data. It is a list of categories, not a checklist of bugs, and it is not a standard.",
        why: "It is worth knowing precisely because everyone in the industry references it. It is also worth knowing its limits: passing a Top 10 review does not mean an application is secure, and the numbering changes every few years while the categories move far less.",
        table: {
          caption: "The 2021 list, which is the current one.",
          headers: ["#", "Category", "In one sentence"],
          rows: [
            ["A01", "Broken access control", "The check that this user may do this is missing"],
            ["A02", "Cryptographic failures", "Sensitive data not protected, or protected badly"],
            ["A03", "Injection", "Data becomes instruction, including cross-site scripting"],
            ["A04", "Insecure design", "The flaw is in the design, not the code"],
            ["A05", "Security misconfiguration", "Defaults, debug modes, exposed panels"],
            ["A06", "Vulnerable components", "A dependency with a known issue"],
            ["A07", "Identification and authentication failures", "Weak login, session and recovery handling"],
            ["A08", "Software and data integrity failures", "Trusting updates or data you cannot verify"],
            ["A09", "Logging and monitoring failures", "It happened and nobody knew"],
            ["A10", "Server-side request forgery", "The server is tricked into fetching something for the attacker"],
          ],
        },
        practice: {
          prompt:
            "An application passes a Top 10 review with no findings. What can you honestly say about it?",
          answer:
            "That the reviewer did not find anything in those ten categories, in the time they had, on the parts they examined. It is genuinely useful and it is not a statement that the application is secure. Business logic flaws, which are specific to what the application does, are not on the list at all.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 2
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "cs-l30-access-control",
    moduleId: "cs-w8-web",
    sectionId: SECTION_ID,
    order: 2,
    title: "Broken Access Control",
    subtitle: "Number one, and the one tools cannot find",
    estimatedMinutes: 12,
    intro:
      "The most common serious vulnerability in web applications, and the one that looks least like a bug. The code is clean. The tests pass. Nobody checked whether the person asking was allowed to ask.",

    atoms: [
      {
        id: "a-cs-w8-idor",
        title: "Changing the number in the URL",
        explain:
          "An application shows your invoice at /invoices/4192. You change it to 4191 and see somebody else's. The server looked the invoice up by id and returned it, because that is what it was asked to do. Nothing checked whose invoice it was.",
        why: "This is called insecure direct object reference and it is everywhere. It requires no tool, no payload and no skill. The reason it survives is that the application works perfectly for every legitimate user, so nothing in testing ever surfaces it.",
        example:
          "  GET /api/invoices/4192      your invoice        200 OK\n  GET /api/invoices/4191      someone else's      200 OK   ← the bug\n\nThe fix is one line in the query, and it is the line everyone omits:\n\n  WHERE id = ? AND customer_id = ?\n\nNot a lookup followed by a check. One query that cannot return\nsomebody else's row in the first place.",
        mistake:
          "Fixing it by making ids unguessable. It raises the effort and does not restore the check, and ids leak constantly through exports, emails, referrer headers and support tickets.",
      },
      {
        id: "a-cs-w8-function-level",
        title: "The admin endpoint nobody linked to",
        explain:
          "The admin page is not shown in the menu for ordinary users, and the endpoint behind it checks nothing. Anyone who learns the path can call it. The access control was implemented in the navigation.",
        why: "This is why authorisation has to be enforced on the server, on every request, regardless of what the interface offers. Hiding a button is a user experience decision. It is not a control.",
        analogy:
          "Removing the sign for the stairs. The stairs are still there and they still go up.",
      },
      {
        id: "a-cs-w8-client-side-checks",
        title: "Checks that live in the browser",
        explain:
          "Validation in JavaScript, a disabled button, a hidden field carrying a price, a role stored in the client. All of it is under the control of whoever is using the browser, and all of it can be changed before the request is sent.",
        why: "Client-side checks are for helping users, not for enforcing rules. The rule that a discount cannot exceed 20% has to live where the request is processed, because the request can be constructed by hand.",
        decision: {
          scenario:
            "An e-commerce checkout sends the item price as a hidden form field, and the server charges what it receives. A developer says the field cannot be changed because it is hidden and the form is validated.",
          question: "What is the problem?",
          options: [
            {
              id: "a",
              text: "Nothing, as long as the form validation is comprehensive",
              whyWrong:
                "The form is not what sends the request. Browser developer tools edit the field in about three seconds, and the request can be constructed without a browser at all. Form validation runs on the attacker's own machine, at their discretion.",
            },
            {
              id: "b",
              text: "The price must come from the server's own record of the product. Anything the client sends about price is a suggestion",
              why: "The server has the price. There is no reason to accept one from the client, and the general rule is that any value the client controls has to be treated as an assertion to be checked rather than a fact.",
            },
            {
              id: "c",
              text: "The price field should be encrypted before it is sent",
              whyWrong:
                "Encrypting a value the client also has to be able to produce achieves nothing, and if the client cannot produce it there was no reason to send it. The value should simply not travel.",
            },
            {
              id: "d",
              text: "Add a checksum over the form fields so tampering is detected",
              whyWrong:
                "A signed cart is a real pattern, and it is a more complex solution to a problem that disappears if the server looks up its own price. Complexity in an authorisation path is where the next bug lives.",
            },
          ],
          correct: "b",
          aftermath:
            "This exact bug has been found in production e-commerce systems repeatedly, including large ones. It is not obscure and it is not old.",
        },
      },
      {
        id: "a-cs-w8-vertical-horizontal",
        title: "Two directions of the same failure",
        explain:
          "Horizontal means reaching another user's data at the same privilege level, which is the invoice example. Vertical means reaching a higher privilege level, such as an ordinary user calling an administrator function.",
        why: "Testing needs both, and teams usually only test one. Log in as two different ordinary users and try to reach each other's data. Then log in as an ordinary user and try every administrative endpoint you know about.",
        table: {
          caption: "How to actually test it.",
          headers: ["Direction", "Test", "Expect"],
          rows: [
            ["Horizontal", "As user A, request user B's resource by id", "403, not 404 and not 200"],
            ["Vertical", "As an ordinary user, call an admin endpoint", "403"],
            ["Unauthenticated", "Call both with no session at all", "401"],
            ["After logout", "Replay a request with the old token", "401"],
          ],
          note: "Returning 404 rather than 403 is a deliberate choice some teams make to avoid confirming a resource exists. Either is acceptable; 200 is not.",
        },
      },
      {
        id: "a-cs-w8-mass-assignment",
        title: "Mass assignment",
        explain:
          "A registration form sends name, email and password, and the code passes the whole request body straight into a user object. An attacker adds one more field to the request: \"role\": \"admin\". Whether that works depends entirely on whether anybody listed which fields were allowed.",
        why: "It is access control failing at the point where data is bound rather than where it is read, and it is invisible in the form because the form never sends that field. Every framework that offers convenient object binding offers this bug with it.",
        example:
          "  What the form sends:\n    { \"name\": \"Ada\", \"email\": \"...\", \"password\": \"...\" }\n\n  What the attacker sends, by hand, in ten seconds:\n    { \"name\": \"Ada\", \"email\": \"...\", \"password\": \"...\",\n      \"role\": \"admin\", \"email_verified\": true, \"credit\": 999999 }\n\n  The fix is an explicit list of the fields this endpoint accepts.\n  Not a list of fields it rejects.",
        mistake:
          "Blocking the known dangerous fields. It is a denylist, and the next field somebody adds to the model is automatically assignable by anyone, with nobody having made that decision.",
      },
      {
        id: "a-cs-w8-deny-by-default",
        title: "Deny by default, in application code",
        explain:
          "The same principle as the firewall. Every endpoint requires an explicit authorisation decision, and the framework refuses anything that has not declared one, rather than allowing anything that forgot to.",
        why: "It converts the most common cause of this bug, which is somebody adding a new endpoint and not thinking about authorisation, from a silent vulnerability into a failure at development time.",
        mistake:
          "Implementing authorisation as a list of protected routes. The list is maintained by hand, new routes are added by people in a hurry, and the default for anything not on the list is open.",
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 3
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "cs-l31-injection-and-xss",
    moduleId: "cs-w8-web",
    sectionId: SECTION_ID,
    order: 3,
    title: "Injection, XSS and CSRF",
    subtitle: "Three attacks, three completely different fixes",
    estimatedMinutes: 13,
    intro:
      "These three get taught together and confused constantly. Injection tricks your server. Cross-site scripting tricks your user's browser. Cross-site request forgery tricks your user's browser into tricking your server.",

    atoms: [
      {
        id: "a-cs-w8-injection-recap",
        title: "Injection, on the web",
        explain:
          "Week 7 covered the mechanism. On the web it reaches the database through a search field, the shell through a filename, the LDAP directory through a login form, and the template engine through anything rendered without escaping.",
        why: "The fix never changes: keep the instruction and the data separate. Parameterised queries for SQL, argument arrays instead of shell strings, and library calls instead of building the instruction yourself.",
        table: {
          caption: "Same shape, five destinations.",
          headers: ["Injection into", "Reached through", "Fix"],
          rows: [
            ["SQL", "Any field used in a query", "Bound parameters"],
            ["The shell", "Filenames, export functions, image processing", "Pass an argument array, never a string"],
            ["LDAP", "Login forms in enterprise applications", "The library's escaping function"],
            ["A template engine", "Anything rendered from user input", "Never render user input as a template"],
            ["A log file", "Headers and user agent strings", "Encode before writing, and beware log viewers"],
          ],
        },
      },
      {
        id: "a-cs-w8-xss",
        title: "Cross-site scripting",
        explain:
          "Your application renders attacker-controlled content into a page without encoding it, and the victim's browser executes it as script. Stored means it was saved and served to everyone who views that page. Reflected means it came back in the response to a crafted link. DOM-based means it never reached the server at all.",
        why: "The damage is that the script runs with the victim's session, inside your site's origin. It can act as them, read what they can read, and it does not need to steal the cookie to do any of that.",
        table: {
          caption: "Three kinds, and where to look for each.",
          headers: ["Kind", "Payload lives", "Victim"],
          rows: [
            ["Stored", "In your database", "Everyone who views the page"],
            ["Reflected", "In a link the attacker sends", "Whoever clicks it"],
            ["DOM-based", "In the URL, handled entirely by client script", "Whoever clicks it, and no server log records it"],
          ],
          note: "DOM-based is the one that survives longest, because the payload never appears in a server log and a server-side scanner cannot see it.",
        },
        mistake:
          "Treating cross-site scripting as a cosmetic bug because the demonstration was an alert box. The alert box is a proof that arbitrary script runs in your users' sessions. What it does next is the attacker's choice.",
      },
      {
        id: "a-cs-w8-xss-fixes",
        title: "What actually fixes it",
        explain:
          "Context-aware output encoding, applied at render time, in the destination's own rules. A Content Security Policy as a second layer, restricting where script may load from. And for rich text, a vetted sanitising library rather than your own filter.",
        why: "Modern frameworks escape by default in templates, which is why this class has become far less common. The bugs that remain are almost always where somebody deliberately bypassed that default, with a function named something like dangerouslySetInnerHTML or the raw filter.",
        example:
          "Where XSS still appears in a modern codebase:\n\n  React        dangerouslySetInnerHTML\n  Vue          v-html\n  Angular      bypassSecurityTrustHtml\n  Django       the |safe filter\n  Rails        raw() or html_safe\n\nEach of these is a deliberate override of the framework's protection.\nGrep for them. That is where to look first, and it takes four seconds.",
        mistake:
          "Writing your own HTML sanitiser. It is a genuinely hard problem with a long history of bypasses in libraries maintained by people who work on nothing else. Use one of theirs.",
      },
      {
        id: "a-cs-w8-csrf",
        title: "Cross-site request forgery",
        explain:
          "You are logged into your bank. You visit another site, which quietly causes your browser to submit a request to the bank. The browser attaches your cookie, because it attaches your cookie to every request to that domain, and the bank sees a perfectly authenticated request to move money.",
        why: "Notice what the attacker never has. They do not read your session, they do not see the response, and they do not need any flaw in your bank's code other than the missing check that this request was intentional.",
        analogy:
          "Someone posts a letter in your name using your letterhead, because your letterhead is attached automatically to anything sent from your desk.",
        table: {
          caption: "The two defences, and why both exist.",
          headers: ["Defence", "How it works", "Limit"],
          rows: [
            [
              "SameSite cookies",
              "The browser declines to send the cookie on cross-site requests",
              "Depends on browser behaviour, and Lax still permits top-level navigations",
            ],
            [
              "Anti-CSRF token",
              "A per-session value the attacker cannot read, required on every state change",
              "Has to be applied to every state-changing endpoint, without exception",
            ],
          ],
          note: "SameSite=Lax is now the default in major browsers, which removed most of this class. Both are still worth having, because a default you do not control is not a control you own.",
        },
      },
      {
        id: "a-cs-w8-telling-them-apart",
        title: "Telling the three apart",
        explain:
          "Ask who is being tricked and what the attacker gains. Injection tricks your server into running the attacker's instruction. Cross-site scripting tricks your user's browser into running the attacker's script. Cross-site request forgery tricks your user's browser into sending a request the user did not intend.",
        why: "Getting this right decides which fix you reach for, and the wrong diagnosis produces a fix that does nothing. Anti-CSRF tokens do not stop cross-site scripting; output encoding does not stop CSRF; neither touches injection.",
        decision: {
          scenario:
            "A report says: an attacker sends a victim a link. The victim clicks it while logged in. The victim's profile email address is silently changed to the attacker's, and the attacker then resets the password. No script runs on the page and the attacker never sees the response.",
          question: "Which vulnerability is this?",
          options: [
            {
              id: "a",
              text: "Stored cross-site scripting",
              whyWrong:
                "Nothing was stored and no script ran. Cross-site scripting requires attacker-controlled content to be executed in the page, and the report explicitly says that did not happen.",
            },
            {
              id: "b",
              text: "Cross-site request forgery on the change-email endpoint",
              why: "The victim's browser sent an authenticated state-changing request the victim did not intend, and the attacker never read the response. That is exactly the shape of CSRF, and the change-email endpoint is a classic target because it leads to account takeover through password reset.",
            },
            {
              id: "c",
              text: "SQL injection",
              whyWrong:
                "Nothing indicates the attacker's data reached a query as instruction. The endpoint did what it was designed to do, for a request it should not have accepted.",
            },
            {
              id: "d",
              text: "Broken access control",
              whyWrong:
                "The victim was entitled to change their own email, so authorisation was correct. What is missing is a check that the request was intentional, which is a different control.",
            },
          ],
          correct: "b",
          aftermath:
            "Change-email and change-password endpoints are the highest-value CSRF targets, because both lead to account takeover. Requiring the current password on those endpoints is a cheap additional defence for exactly this reason.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 4
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "cs-l32-misconfiguration-and-proxy",
    moduleId: "cs-w8-web",
    sectionId: SECTION_ID,
    order: 4,
    title: "Misconfiguration, Exposure and the Proxy",
    subtitle: "The findings you get without finding a bug",
    estimatedMinutes: 13,
    intro:
      "A large share of real findings are not bugs in anybody's code. They are settings. This lesson covers those, and introduces the tool you will use for the rest of the course to see what your browser is actually sending.",

    atoms: [
      {
        id: "a-cs-w8-misconfiguration",
        title: "Security misconfiguration",
        explain:
          "Debug mode on in production. Default credentials never changed. Directory listing enabled. An admin panel reachable from the internet. Verbose errors returning stack traces. A cloud storage bucket set to public.",
        why: "None of these require a vulnerability to exploit, which means they need no skill and are found by automated scanning within hours of appearing. They are also the cheapest findings to fix, which makes them the best value in any first assessment.",
        table: {
          caption: "What to check first on any application, in about ten minutes.",
          headers: ["Check", "Looks like", "Why it matters"],
          rows: [
            ["Debug mode", "A detailed error page with a stack trace", "Framework, versions, file paths, sometimes credentials"],
            ["Default credentials", "admin / admin still works", "Total access, no exploit required"],
            ["Directory listing", "An index of files at a path", "Backups, configuration, source archives"],
            ["Exposed admin panel", "/admin reachable from the internet", "A login page for the whole application"],
            ["Old files", "backup.zip, .env, .git in the web root", "Source code and secrets, downloadable"],
          ],
          note: "A .git directory in the web root allows the entire source history to be reconstructed, including every secret ever committed. It is common and it is devastating.",
        },
      },
      {
        id: "a-cs-w8-headers",
        title: "The headers worth setting",
        explain:
          "A handful of response headers remove whole classes of attack. Strict-Transport-Security forces HTTPS. Content-Security-Policy restricts where script may come from. X-Content-Type-Options stops the browser guessing a file's type. X-Frame-Options or a CSP frame-ancestors rule stops your page being framed by somebody else.",
        why: "They are one line each in a server configuration, they cost nothing, and their absence is in every assessment report ever written. A strong Content-Security-Policy is the exception: it is genuinely difficult to introduce into an existing application and worth the effort.",
        table: {
          caption: "The header, and the attack it removes.",
          headers: ["Header", "Removes"],
          rows: [
            ["Strict-Transport-Security", "A first-visit downgrade to plain HTTP"],
            ["Content-Security-Policy", "Most cross-site scripting payloads, even where a bug exists"],
            ["X-Content-Type-Options: nosniff", "The browser executing an upload as script because it guessed"],
            ["X-Frame-Options / frame-ancestors", "Clickjacking, where your page is framed invisibly over a trap"],
            ["Referrer-Policy", "Your URLs, including tokens in them, leaking to other sites"],
          ],
        },
      },
      {
        id: "a-cs-w8-data-exposure",
        title: "What the API returns that the page does not show",
        explain:
          "A page shows a user's name and city. The API endpoint behind it returns the whole user record, including the email address, the phone number, the password reset token and an internal risk flag. The front end renders three fields and discards the rest, in the browser.",
        why: "This is one of the most common findings in a modern application assessment, and it is invisible from the page. Everything the API sent is in the browser and in anything that logged the response, regardless of what was displayed.",
        example:
          "What the page shows:\n  Adaeze Okafor · Lagos\n\nWhat GET /api/users/4192 actually returned:\n  { \"name\": \"Adaeze Okafor\", \"city\": \"Lagos\",\n    \"email\": \"...\", \"phone\": \"...\",\n    \"reset_token\": \"...\", \"internal_risk_score\": 78,\n    \"national_id\": \"...\" }\n\nThe page is not the API. Filtering in the front end filters nothing.",
        mistake:
          "Serialising a database model straight to JSON. Every column you add later is published automatically, including the ones added by somebody who never thought about that endpoint.",
      },
      {
        id: "a-cs-w8-proxy",
        title: "The intercepting proxy",
        explain:
          "Burp Suite or OWASP ZAP sits between your browser and the site, shows every request and response, and lets you modify anything before it is sent. It is how you see what your browser is actually doing, as opposed to what the page appears to be doing.",
        why: "It is the tool that makes the last three lessons concrete. The hidden price field, the API returning fields the page discards, the request that still works after logging out: all of them are visible in the proxy in seconds and invisible from the page.",
        table: {
          caption: "What you will use it for this week.",
          headers: ["Task", "What it shows"],
          rows: [
            ["Watch a login", "The session cookie being set, and its attributes"],
            ["Change an id in a request", "Whether access control is enforced on the server"],
            ["Remove the session cookie and resend", "Whether authentication is enforced on that endpoint"],
            ["Read an API response in full", "Every field the page did not render"],
            ["Replay a request after logout", "Whether the session was really invalidated"],
          ],
        },
        mistake:
          "Pointing a proxy at a site you do not own. It intercepts and modifies traffic, which is squarely on the wrong side of the line from Week 4. Use it against the deliberately vulnerable applications in your lab, and against nothing else until Week 9 gives you a scope.",
      },
      {
        id: "a-cs-w8-logging-failures",
        title: "The category that is about not knowing",
        explain:
          "Logging and monitoring failures is the only entry on the list that is not about an attack. It is about an organisation that was attacked and did not find out, or found out months later from somebody else.",
        why: "It is on the list because it multiplies everything else. An attack detected in an hour is an incident. The same attack detected in six months is a breach of everything the attacker could reach in six months, and the average is measured in months rather than hours.",
        example:
          "What should be logged, and almost never is:\n\n  authentication failures, with the account and source\n  authorisation failures, which are far more interesting\n  privilege changes and new account creation\n  administrative actions, with who and what\n  and, critically, whether anyone reads any of it",
        practice: {
          prompt:
            "An application logs every failed login and nothing else. What is the most valuable thing it is missing?",
          answer:
            "Authorisation failures. A failed login is usually somebody mistyping a password. A logged-in user repeatedly being refused access to resources that are not theirs is somebody probing, and it is one of the highest-signal events an application can produce. Almost nobody logs it.",
        },
      },
      {
        id: "a-cs-w8-reporting",
        title: "Writing the finding up",
        explain:
          "A finding a developer can act on has five parts: where it is, how to reproduce it, what an attacker gains, how serious that is in this context, and the specific fix. Anything missing one of those generates a conversation instead of a fix.",
        why: "This is the deliverable for this week and the shape of every report for the rest of the course. The part people omit is the impact, and it is the part that decides whether the finding gets prioritised or sits in a backlog for a year.",
        example:
          "Finding: Broken access control on invoice retrieval\n\n  Where       GET /api/invoices/{id}\n  Reproduce   Log in as user A, request an invoice id belonging to user B.\n              Returns 200 with the full invoice.\n  Impact      Any authenticated user can read every invoice in the system,\n              including customer names, addresses and amounts. Sequential\n              ids make full enumeration trivial.\n  Severity    High. No special access required, all customer data affected.\n  Fix         Scope the query by the authenticated user:\n              WHERE id = ? AND customer_id = ?  Return 403 otherwise.",
        mistake:
          "Writing severity as whatever the scanner said. Severity is contextual, which is exactly what Week 10 is about. A finding on an internal test system and the same finding on the customer portal are not the same severity.",
      },
    ],

    task: {
      title: "This week's lab",
      intro:
        "Work a deliberately vulnerable application end to end, on host-only networking, in your own lab.",
      prompts: [
        "Install OWASP Juice Shop or DVWA on your lab VM. Confirm the network adapter is host-only before you start.",
        "Set up Burp Suite Community or OWASP ZAP as a proxy and confirm you can see your own requests and responses.",
        "Log in and examine the session cookie. Record which of Secure, HttpOnly and SameSite are set, and what each absence would allow.",
        "Find at least one instance of broken access control by changing an identifier in a request. Record the request, the response and what it exposes.",
        "Find one injection and one cross-site scripting issue. For each, record the request, what happened, and the specific fix a developer should apply.",
        "Pick one API response and compare every field it returns with what the page displays. Record any field that should not have been sent.",
        "Write a findings report mapping each issue to its OWASP category, using the five-part format from the last atom.",
      ],
      closing:
        "Month 2 ends here, with a hardened host, a defended network and an application you have taken apart. Month 3 is where you do it to a system on purpose, with permission, and then detect somebody doing it to you.",
    },

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
