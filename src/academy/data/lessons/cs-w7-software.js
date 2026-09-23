/**
 * CYBERSECURITY · WEEK 7 · SECURING SOFTWARE & SECURE CODING
 *
 * Harvard anchor: CS50 Cybersecurity, "Securing Software". Writing and
 * evaluating code that resists attack.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 *
 * EVERY SNIPPET IN THIS FILE IS EXECUTED BY THE BUILD. lib/academy/
 * validateContent.mjs runs each one in CPython and compares the real output
 * with the output this lesson claims. A secure-coding lesson whose examples
 * were written from memory teaches beginners things that are not true, and
 * beginners have no way to tell.
 *
 * Nothing here is an exploit. The snippets print strings and query an
 * in-memory SQLite database that the snippet itself creates, which is enough
 * to show the difference between a query that is built by concatenation and
 * one that is parameterised. That difference is the lesson.
 */

export const SECTION_ID = "cs-s7-software";

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 1
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "cs-l25-where-bugs-come-from",
    moduleId: "cs-w7-software",
    sectionId: SECTION_ID,
    order: 1,
    title: "Where Vulnerabilities Come From",
    subtitle: "Almost always the same mistake",
    estimatedMinutes: 13,
    intro:
      "Security bugs look wildly different from the outside and are nearly all the same thing underneath: data that came from somewhere untrusted ends up somewhere it is treated as an instruction. Once you can see that shape, most vulnerability classes stop needing to be memorised.",

    atoms: [
      {
        id: "a-cs-w7-untrusted-input",
        title: "Untrusted input is everything from outside",
        explain:
          "Not just form fields. URL parameters, headers, cookies, uploaded files, filenames, data from another service, rows from a database that somebody else wrote to, and anything a user could influence at any point in the past.",
        why: "Developers usually validate the obvious input and trust the rest. The vulnerability is almost always in the part that did not look like input: the User-Agent header logged to a file, the filename of an upload used to build a path, the value read back out of the database that was never checked on the way in.",
        table: {
          caption: "Where it comes from, and where people forget to check.",
          headers: ["Source", "Usually validated?"],
          rows: [
            ["A form field", "Yes"],
            ["A URL parameter", "Usually"],
            ["An HTTP header", "Rarely"],
            ["A cookie value", "Rarely"],
            ["An uploaded file's name", "Almost never"],
            ["Data read back out of your own database", "Almost never"],
          ],
          note: "The last row is how stored cross-site scripting works. The value was hostile when it went in, and nobody checked it on the way out.",
        },
      },
      {
        id: "a-cs-w7-trust-boundary",
        title: "The trust boundary",
        explain:
          "A trust boundary is the line where data crosses from somewhere you do not control to somewhere you do. Every boundary needs a decision: what is allowed to cross, in what shape, and what happens to anything else.",
        why: "Drawing the boundaries is the most useful thing you can do before reviewing a system, because vulnerabilities cluster on them. If nobody can point at the boundary, nobody is checking it.",
        analogy:
          "Airport security is not everywhere in the airport. It is at one line, and everything crossing that line is checked, because checking everywhere would be impossible and checking nowhere would be the current state of most applications.",
        mistake:
          "Validating at the boundary and then passing the data through five layers that each assume somebody else checked. Validate where the data enters, and encode where it is used. Those are two different jobs at two different places.",
      },
      {
        id: "a-cs-w7-string-building",
        title: "The mistake, in four lines",
        explain:
          "Here is the entire root of SQL injection, with no database involved. A function builds a query by gluing strings together. Watch what the second call produces.",
        why: "Notice that nothing is exploited here. The function does exactly what it was written to do. The problem is that the attacker's input stopped being data and became part of the instruction, and that happened at the concatenation.",
        code: {
          code: 'def build_query(username):\n    return "SELECT * FROM users WHERE name = \'" + username + "\'"\n\nprint(build_query("adaeze"))\nprint(build_query("\' OR \'1\'=\'1"))\n',
          expectedOutput:
            "SELECT * FROM users WHERE name = 'adaeze'\nSELECT * FROM users WHERE name = '' OR '1'='1'",
          highlight: [2],
        },
        mistake:
          "Thinking the fix is to reject apostrophes. Plenty of real names contain one, the escaping rules differ per database, and there is always another character. The fix is not to build the instruction out of the data at all.",
      },
      {
        id: "a-cs-w7-predict-injection",
        title: "Practice: read it before you run it",
        explain:
          "The same shape, with an f-string and a different verb. Work out exactly what this prints before checking. Reading code adversarially is the skill this whole lesson is training.",
        why: "Being able to look at four lines and say what they produce is the difference between someone who can review code and someone who can only write it. It is also what an attacker is doing when they read your application.",
        codeExercise: {
          code: 'def build_query(table, name):\n    return f"DELETE FROM {table} WHERE name = \'{name}\'"\n\nprint(build_query("orders", "adaeze"))\nprint(build_query("orders", "x\'; DROP TABLE orders; --"))\n',
          question:
            "What does this print? Type both lines exactly, including every quote and semicolon.",
          expectedOutput:
            "DELETE FROM orders WHERE name = 'adaeze'\nDELETE FROM orders WHERE name = 'x'; DROP TABLE orders; --'",
          hint: "The f-string substitutes the value literally. Nothing is escaped, so write out exactly what appears between the braces, character for character.",
          successMessage:
            "Exactly. Look at the second line: the quote closes the intended string, the semicolon ends the intended statement, and everything after it is a new instruction the developer never wrote.",
        },
      },
      {
        id: "a-cs-w7-parameterised",
        title: "The fix, proved rather than asserted",
        explain:
          "Parameterised queries send the instruction and the data separately. The database receives the query shape once, then receives the values, and never treats a value as part of the instruction. This snippet runs both ways against a real database and prints what each returns.",
        why: "Most courses assert that parameterisation fixes injection. This one demonstrates it. The parameterised query looks for a user literally named `' OR '1'='1` and finds nobody, which is correct. The concatenated one returns every row in the table.",
        code: {
          code: 'import sqlite3\n\ndb = sqlite3.connect(":memory:")\ndb.execute("CREATE TABLE users (name TEXT)")\ndb.execute("INSERT INTO users VALUES (\'adaeze\')")\ndb.execute("INSERT INTO users VALUES (\'chuka\')")\n\nevil = "\' OR \'1\'=\'1"\n\nrows = db.execute("SELECT name FROM users WHERE name = ?", (evil,)).fetchall()\nprint("parameterised:", rows)\n\nrows = db.execute("SELECT name FROM users WHERE name = \'" + evil + "\'").fetchall()\nprint("concatenated: ", rows)\n',
          expectedOutput:
            "parameterised: []\nconcatenated:  [('adaeze',), ('chuka',)]",
          highlight: [10, 13],
          runnable: true,
        },
        table: {
          caption: "The same idea in every language you will meet.",
          headers: ["Language", "Safe form"],
          rows: [
            ["Python", "cursor.execute(sql, (value,))"],
            ["PHP", "PDO prepared statements with bound parameters"],
            ["Java", "PreparedStatement with setString"],
            ["Node", "Parameterised queries in the driver, or a query builder"],
            ["Anywhere", "An ORM, used without dropping to raw string queries"],
          ],
        },
        mistake:
          "Using parameters for the values and building the table or column name by concatenation. Parameters cannot carry identifiers, so that part needs an allowlist of permitted names rather than the user's string.",
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 2
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "cs-l26-validation-and-encoding",
    moduleId: "cs-w7-software",
    sectionId: SECTION_ID,
    order: 2,
    title: "Validation, Encoding and Safe Defaults",
    subtitle: "Two different jobs people constantly merge",
    estimatedMinutes: 12,
    intro:
      "Validation decides whether to accept data. Encoding decides how to render it safely somewhere. They happen at different places, solve different problems, and neither substitutes for the other.",

    atoms: [
      {
        id: "a-cs-w7-allowlist",
        title: "Allowlist, not denylist",
        explain:
          "A denylist enumerates what is forbidden. An allowlist enumerates what is permitted and rejects everything else. For input validation, the allowlist wins every time, and it wins for the same reason default deny wins on a firewall.",
        why: "You can describe what a valid Nigerian phone number looks like. You cannot describe every malicious string, because the set is infinite and grows whenever somebody thinks of something new. A denylist is a permanent game you are always one idea behind in.",
        example:
          "Denylist thinking:   reject anything containing <script\n  bypassed by:       <ScRiPt, <script/x, <img onerror=..., and forty others\n\nAllowlist thinking:  a product code is exactly 3 letters, a hyphen, 4 digits\n  bypassed by:       nothing, because everything else is rejected",
        decision: {
          scenario:
            "A developer has fixed a cross-site scripting report by stripping the string \"<script>\" from all input. They are asking you to sign off the fix.",
          question: "What do you say?",
          options: [
            {
              id: "a",
              text: "Approve it. The reported payload no longer works",
              whyWrong:
                "The reported payload was one example, not the vulnerability. Case variation, different tags, event handlers on an image and a dozen other forms all bypass this, and signing it off closes the ticket while leaving the bug.",
            },
            {
              id: "b",
              text: "Reject it. Validate the input against what is actually permitted, and encode on output according to where it is being rendered",
              why: "It names both halves. Validation at entry decides whether this is acceptable data at all, and output encoding makes it safe in the specific context where it is rendered. Neither is about guessing payloads.",
            },
            {
              id: "c",
              text: "Ask them to also strip <img>, <iframe> and onerror",
              whyWrong:
                "This accepts the denylist approach and just makes the list longer. You will be back with the same conversation next quarter, having added another tag, because the set of dangerous inputs is not enumerable.",
            },
            {
              id: "d",
              text: "Approve it and add a web application firewall rule as a second layer",
              whyWrong:
                "A firewall rule in front of an unfixed bug is a filter in front of an unfixed bug. It is a reasonable temporary measure while the real fix ships, and it is not a fix, and approving the code change signals that it is.",
            },
          ],
          correct: "b",
          aftermath:
            "The general shape: fix the class, not the payload. If your fix mentions a specific attack string, you have fixed a report rather than a vulnerability.",
        },
      },
      {
        id: "a-cs-w7-validate-vs-encode",
        title: "Validate on the way in, encode on the way out",
        explain:
          "Validation asks whether the data is acceptable at all, and happens once, where it enters. Encoding asks how to represent it safely in a particular destination, and happens every time it is written somewhere, differently for each destination.",
        why: "The same string needs different treatment depending on where it goes. Into HTML it needs HTML escaping. Into a URL it needs URL encoding. Into SQL it needs a parameter rather than encoding at all. Validating once and then writing it everywhere raw is the most common shape of this bug.",
        table: {
          caption: "Same value, four destinations, four correct treatments.",
          headers: ["Destination", "Correct handling"],
          rows: [
            ["An SQL query", "A bound parameter. Not escaping"],
            ["HTML page body", "HTML entity encoding"],
            ["An HTML attribute", "Attribute encoding, which differs from body encoding"],
            ["A URL parameter", "URL encoding"],
            ["A shell command", "Do not. Pass an argument array instead of building a string"],
          ],
        },
      },
      {
        id: "a-cs-w7-encoding-demo",
        title: "Practice: what encoding actually does",
        explain:
          "A comment containing a script tag is stored in the database exactly as typed, which is correct. What matters is what happens when it is rendered. Predict both lines.",
        why: "Encoding does not remove or alter the data. It changes how the destination interprets it, so that the characters which would have started a tag are rendered as characters instead. The comment still reads the same to a human.",
        codeExercise: {
          code: 'import html\n\ncomment = "<script>steal()</script>"\nprint("stored:   " + comment)\nprint("rendered: " + html.escape(comment))\n',
          question:
            "What does this print? Type both lines exactly, including the escaped form on the second.",
          expectedOutput:
            "stored:   <script>steal()</script>\nrendered: &lt;script&gt;steal()&lt;/script&gt;",
          hint: "html.escape converts the characters that would open and close a tag into their entity forms. The angle brackets become &lt; and &gt;.",
          successMessage:
            "Right. The data was never changed in storage. The browser now renders the characters instead of interpreting them as a tag, and the user sees the text they typed.",
        },
      },
      {
        id: "a-cs-w7-safe-defaults",
        title: "Safe defaults",
        explain:
          "The default behaviour of a system, when nobody made a decision, should be the safe one. New files private rather than public, new accounts with no permissions, new features off, session cookies secure and same-site, error details hidden.",
        why: "Most deployments run on defaults, because the default is what happens when there is no time. A framework whose default template escapes output has prevented more cross-site scripting than every training course ever delivered.",
        mistake:
          "Documenting the secure configuration instead of shipping it. Documentation is read by people who already care. The default is applied to everybody.",
      },
      {
        id: "a-cs-w7-fail-closed",
        title: "Failing closed",
        explain:
          "When something goes wrong, does the system deny or allow? If the authorisation service times out, does the request proceed? If the signature check throws an exception, is the file accepted? Failing closed means the answer is no.",
        why: "A surprising number of real bypasses are found here rather than in the check itself. The check is correct; the error path around it is not, and an attacker who can cause an error gets the outcome they wanted.",
        example:
          "  try:\n      allowed = authz.check(user, resource)\n  except Exception:\n      allowed = True          # ← this line is the vulnerability\n\nNothing is wrong with the check. Everything is wrong with what\nhappens when the check cannot run, and an attacker who can\nmake it fail has just been authorised.",
        practice: {
          prompt:
            "A licence-checking service is unreachable and the application lets everyone in rather than blocking. Is that a bug?",
          answer:
            "It depends on what the check protects, and the decision has to be deliberate. For a licence check, failing open is a business decision to avoid an outage over a billing matter. For an authorisation check on medical records it is a vulnerability. The wrong answer is having it happen by accident, which is how it usually happens.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 3
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "cs-l27-other-classes",
    moduleId: "cs-w7-software",
    sectionId: SECTION_ID,
    order: 3,
    title: "Memory Safety and the Other Classes",
    subtitle: "What else goes wrong, and why",
    estimatedMinutes: 12,
    intro:
      "Injection is the most famous class and not the only one. This lesson covers memory safety at a conceptual level, plus the mistakes that appear in code review far more often than anybody expects.",

    atoms: [
      {
        id: "a-cs-w7-memory-safety",
        title: "Memory safety, conceptually",
        explain:
          "In languages like C and C++ the programmer manages memory directly. A buffer overflow happens when a program writes more data into a fixed-size space than it holds, and the excess lands on whatever was next in memory, which may be data the program relies on to decide what to do next.",
        why: "This is the mechanism behind a large share of the most serious vulnerabilities in history, and it is why memory-safe languages are treated as a security property rather than a convenience. You will not be writing exploits in this course. You do need to know why a report saying \"memory corruption\" is usually critical.",
        table: {
          caption: "Which languages hand you this problem.",
          headers: ["Language", "Memory safety", "Consequence"],
          rows: [
            ["C, C++", "Manual", "Overflows, use-after-free, the classic critical CVEs"],
            ["Rust, Go", "Enforced or managed", "This class is largely designed out"],
            ["Python, Java, C#, JavaScript", "Managed", "Not your problem, until you call a C library"],
          ],
          note: "The last row matters. A Python application using a C extension inherits that extension's memory safety, which is where several serious issues in popular libraries have been.",
        },
        mistake:
          "Assuming a managed language makes an application safe. It removes one class. Injection, broken access control and every logic flaw are entirely unaffected, and those are what you will actually find.",
      },
      {
        id: "a-cs-w7-bounds",
        title: "Bounds and assumptions, in a managed language",
        explain:
          "Managed languages prevent memory corruption and do not prevent wrong assumptions. This snippet has a withdrawal function with no validation on the account index. Watch what a negative index does.",
        why: "Python's negative indexing is a feature, and here it silently addresses the last account instead of rejecting an invalid one. Nothing crashes, nothing is logged, and the wrong balance changes. This is what a real logic vulnerability looks like: no exception, no error, just the wrong outcome.",
        code: {
          code: 'balances = [1000, 2500, 400]\n\ndef withdraw(account, amount):\n    balances[account] -= amount\n    return balances[account]\n\nprint(withdraw(0, 300))\nprint(withdraw(-1, 5000))\nprint(balances)\n',
          expectedOutput: "700\n-4600\n[700, 2500, -4600]",
          highlight: [4, 8],
        },
        mistake:
          "Relying on the language to reject nonsense. It rejected nothing here, and the account went four thousand six hundred naira negative because nobody checked that the index was in range or that the balance could cover the withdrawal.",
      },
      {
        id: "a-cs-w7-race-conditions",
        title: "Time-of-check to time-of-use",
        explain:
          "Check that something is true, then act on it. Between the check and the action, something else changes it. Check the balance is sufficient, then deduct. If two requests run at once, both checks pass against the same balance and both deduct.",
        why: "It is the bug behind a whole category of real financial exploits, including several against payment and rewards systems, and it is invisible in a code review that reads one path at a time. The fix is usually to make the check and the action a single atomic operation in the database rather than two steps in the application.",
        analogy:
          "Two people look in the same wallet, each sees enough for lunch, and both spend it.",
      },
      {
        id: "a-cs-w7-crypto-misuse",
        title: "Using cryptography wrongly",
        explain:
          "Four mistakes cover most of what you will find. Inventing an algorithm. Using a fast hash for passwords. Hardcoding a key or a secret in the source. Using a random number generator that was designed for speed rather than unpredictability.",
        why: "None of these are attacks on the mathematics. They are attacks on the way it was wired in, which is where cryptography fails in practice, as Week 3 said. The last one is worth dwelling on: a token generated with an ordinary random function can often be predicted from a few previous values.",
        table: {
          caption: "The four, and what to do instead.",
          headers: ["Mistake", "Instead"],
          rows: [
            ["A homemade cipher or scheme", "A vetted library, used the way its documentation says"],
            ["MD5 or SHA-256 for passwords", "bcrypt, scrypt or Argon2"],
            ["A secret in the source code", "A secret manager or environment configuration, never the repository"],
            ["random() for tokens", "The platform's cryptographic random source"],
          ],
        },
        mistake:
          "Removing a hardcoded secret in a new commit and considering it fixed. It is in the repository history, and history is public the moment the repository is. The secret has to be rotated, not deleted.",
      },
      {
        id: "a-cs-w7-error-messages",
        title: "What errors give away",
        explain:
          "A detailed error message is a gift to whoever is probing you. A stack trace names your framework and version. A database error reveals table and column names. A login that says \"no such user\" for one address and \"wrong password\" for another confirms which addresses are registered.",
        why: "None of these is a vulnerability on its own. Each one shortens the attacker's work, and the last is the reason login forms should give an identical response either way, including taking the same amount of time.",
        decision: {
          scenario:
            "Your login page returns \"Password incorrect\" when the account exists and \"No account with that email\" when it does not. A developer argues this is better for users.",
          question: "What is your position?",
          options: [
            {
              id: "a",
              text: "Agree. Clear error messages are a usability win and the information is harmless",
              whyWrong:
                "It hands an attacker a way to enumerate which addresses are registered, which is valuable on its own for a medical or financial service, and is the first step in credential stuffing everywhere else.",
            },
            {
              id: "b",
              text: "Return an identical message either way, and take the same time to respond in both cases",
              why: "The message and the timing both leak. Taking the same time matters because a missing account often skips the password hashing step, which is slow by design, so the response time alone distinguishes the two.",
            },
            {
              id: "c",
              text: "Keep the distinct messages but rate limit the login form",
              whyWrong:
                "Rate limiting slows enumeration and does not stop it, and distributed attempts defeat it entirely. It is a useful control that does not address the leak.",
            },
            {
              id: "d",
              text: "Keep them, since the registration page reveals the same thing anyway",
              whyWrong:
                "A real point, and the right conclusion is the opposite one: registration and password reset need the same treatment. Two leaks do not justify a third.",
            },
          ],
          correct: "b",
          aftermath:
            "The timing detail catches out a lot of otherwise careful implementations. If the account does not exist, skipping the bcrypt call saves 250 milliseconds, and that difference is trivially measurable.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 4
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "cs-l28-dependencies-sdlc",
    moduleId: "cs-w7-software",
    sectionId: SECTION_ID,
    order: 4,
    title: "Dependencies and the Secure Lifecycle",
    subtitle: "Most of your code was written by strangers",
    estimatedMinutes: 12,
    intro:
      "A modern application is mostly other people's code. This lesson is about the risk that carries, the tools that measure it, and where security fits into how software actually gets built.",

    atoms: [
      {
        id: "a-cs-w7-dependencies",
        title: "You did not write most of it",
        explain:
          "A typical project directly depends on perhaps thirty libraries. Those depend on others, which depend on others. The real count is routinely over a thousand packages, most of which nobody on the team has heard of, all running with the same privileges as your own code.",
        why: "Every one of them is a place a vulnerability can appear, and you will find out about it from an advisory rather than from your own code review. This is why dependency scanning is not optional and why knowing what you depend on is a prerequisite for responding to anything.",
        example:
          "  $ npm ls --all | wc -l\n  1,247\n\n  direct dependencies in package.json:  31\n\nThe difference is the part nobody reviewed, and it is the part that\nwill produce the advisory email at 2am on a public holiday.",
      },
      {
        id: "a-cs-w7-supply-chain",
        title: "Supply-chain attacks",
        explain:
          "Rather than attacking you, attack something you install. A package with a name one character from a popular one. A maintainer account taken over and a malicious version published. A build system compromised so that the signed artefact contains something the source does not.",
        why: "It defeats almost every control you have, because the malicious code arrives through the process you use to install legitimate code, and it is often signed. This is exactly the scenario where a valid signature verifies perfectly, as Week 3 said.",
        decision: {
          scenario:
            "A build fails because a dependency is missing. A developer finds a package with almost the right name on the registry, installs it, and the build passes.",
          question: "What happened, and what do you do?",
          options: [
            {
              id: "a",
              text: "Nothing to worry about. The build works, so it was the right package",
              whyWrong:
                "A working build proves the package exists and provides something plausible. Typosquatted packages are specifically written to work, because a package that breaks the build gets removed before it can do anything.",
            },
            {
              id: "b",
              text: "Treat it as a possible typosquat: check the real package name against the project's documentation, inspect what was installed, and assume the developer machine may be compromised until shown otherwise",
              why: "Installing a package runs its install scripts with the developer's privileges, on a machine that usually holds credentials and source access. The response has to cover both the dependency and the machine.",
            },
            {
              id: "c",
              text: "Pin the version so the same package is used consistently",
              whyWrong:
                "That reliably installs the wrong package every time. Pinning is good practice and does nothing to establish whether this is the right package to pin.",
            },
            {
              id: "d",
              text: "Run a vulnerability scanner over it",
              whyWrong:
                "A scanner checks known packages against known advisories. A fresh typosquat is in neither database, so a clean scan here means nothing at all.",
            },
          ],
          correct: "b",
          aftermath:
            "Install scripts running arbitrary code with the developer's privileges is the part people underestimate. In several documented cases the payload took credentials from the developer's machine and never touched the application at all.",
        },
      },
      {
        id: "a-cs-w7-tooling",
        title: "The three tool families",
        explain:
          "Static analysis reads your source code without running it. Dependency scanning compares your package list against advisory databases. Dynamic analysis attacks the running application. Each finds things the others cannot.",
        why: "Knowing which tool finds which class stops the two most common errors: believing a clean static scan means the application is secure, and expecting a dependency scanner to find a flaw in code you wrote.",
        table: {
          caption: "What each one can and cannot see.",
          headers: ["Tool", "Finds", "Blind to"],
          rows: [
            ["Static analysis", "Injection patterns, unsafe calls, hardcoded secrets", "Logic and authorisation flaws"],
            ["Dependency scanning", "Known vulnerable library versions", "Anything not yet published as an advisory"],
            ["Dynamic analysis", "Behaviour of the running app, misconfiguration", "Code paths it never reached"],
            ["A human review", "Logic flaws, missing authorisation, wrong assumptions", "Whatever the reviewer did not look at"],
          ],
          note: "Broken access control, the most common serious web vulnerability, is invisible to the first three. It needs the fourth.",
        },
      },
      {
        id: "a-cs-w7-secure-sdlc",
        title: "Where security fits in how software gets built",
        explain:
          "Not as a gate at the end. Threat modelling while the design is still a whiteboard, secure defaults in the framework, static and dependency scanning on every pull request, security review on changes that touch authentication or authorisation, and testing before release.",
        why: "A vulnerability found in design costs a conversation. The same vulnerability found in production costs an incident, a fix, a release and possibly a notification. The economics are the entire argument, and they are the argument that works with management.",
        example:
          "Relative cost of fixing the same flaw:\n\n  during design      1×      a conversation\n  during development 5×      a rewrite of one module\n  before release     15×     a slipped date\n  in production      60×+    an incident, a fix, a release, maybe a notification",
        mistake:
          "Being the team that says no at the end. A security function that only appears the week before release is one that gets scheduled around, and the decisions that mattered were made four months earlier.",
      },
      {
        id: "a-cs-w7-code-review",
        title: "Reading code adversarially",
        explain:
          "A normal review asks whether the code does what it should. A security review asks what else it does, and what happens when an input is not what the author imagined. Those are different questions and they need different reading.",
        why: "This is the skill you have been building all lesson. It is also the one that finds the vulnerabilities tools cannot, because it is the only one that understands what the application is supposed to mean.",
        table: {
          caption: "The questions worth asking on any change.",
          headers: ["Question", "Finds"],
          rows: [
            ["Where does this data come from?", "Untrusted input reaching somewhere trusted"],
            ["What happens if it is empty, huge, negative or the wrong type?", "Missing validation, logic flaws"],
            ["Who is allowed to call this, and where is that checked?", "Broken access control"],
            ["What does it do when something throws?", "Failing open"],
            ["What does it log, and what does it return on error?", "Information disclosure"],
            ["Is the check and the action a single operation?", "Race conditions"],
          ],
        },
        practice: {
          prompt:
            "You review an endpoint that takes an invoice id, loads the invoice and returns it. The code is clean, typed and well tested. What is the most likely vulnerability?",
          answer:
            "That nothing checks whether the invoice belongs to the person asking. It is broken access control, it is the most common serious web vulnerability, and it looks exactly like clean, well-tested code because functionally it is. No tool in the previous atom would have found it.",
        },
      },
    ],

    task: {
      title: "This week's lab",
      intro: "Review a deliberately flawed application and fix it properly.",
      prompts: [
        "Clone a deliberately vulnerable sample application into your lab VM. Read it once as a developer, then again asking the six questions from the last atom.",
        "Find at least four vulnerabilities and, for each, record the file and line, the class it belongs to, how an attacker would reach it and what it would give them.",
        "Rewrite the vulnerable sections. For every fix, write one sentence explaining why it fixes the class rather than the example payload.",
        "Run a dependency scanner over the project. Record every finding with its severity, and then decide which ones genuinely matter for this application and why.",
        "Run a static analysis tool over it. Compare what it found with what you found by reading, in both directions, and note what each missed.",
        "Write a secure code review report: findings with severity, corrected code snippets, and a short section on what the tools could not have found.",
      ],
      closing:
        "The section on what the tools missed is the one that matters. Anybody can paste a scanner's output into a document. Knowing what it cannot see is what makes you worth consulting.",
    },

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
