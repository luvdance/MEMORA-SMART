/**
 * ASSESSMENTS · CYBERSECURITY · WEEK 7 · SECURING SOFTWARE
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Never import this from anything under src/.
 * ═════════════════════════════════════════════════════════════════════════
 */

export const ASSESSMENTS = {
  /* ═══════════════════════════════════════════════════════════════════ */
  "cs-l25-where-bugs-come-from": {
    lessonId: "cs-l25-where-bugs-come-from",
    passMark: 70,
    questions: [
      {
        id: "csq25-1",
        type: "mcq",
        difficulty: 3,
        atomId: "a-cs-w7-string-building",
        prompt:
          "In the concatenated query example, at which exact point does the vulnerability occur?",
        options: [
          { id: "a", text: "When the database executes the query" },
          { id: "b", text: "At the concatenation, where the attacker's data becomes part of the instruction" },
          { id: "c", text: "When the user submits the form" },
          { id: "d", text: "When the result is displayed" },
        ],
        correct: "b",
        explanation:
          "The database executed exactly what it was given, correctly. The function did exactly what it was written to do. The flaw is that data and instruction were merged into one string, and that happens at the concatenation.",
        whyWrong: {
          a: "The database is behaving properly. Blaming it leads to looking for a database setting rather than fixing the code.",
          c: "Submitting hostile input is not a flaw. Users are permitted to type anything; the application decides what to do with it.",
          d: "Display is where cross-site scripting would land. Here the damage is already done at query construction.",
        },
      },
      {
        id: "csq25-2",
        type: "mcq",
        difficulty: 3,
        atomId: "a-cs-w7-parameterised",
        prompt:
          "The parameterised query with input `' OR '1'='1` returned an empty list. Why is that the correct result?",
        options: [
          { id: "a", text: "Because the database rejected the dangerous input" },
          {
            id: "b",
            text: "Because it searched for a user whose name is literally that string, and there is none",
          },
          { id: "c", text: "Because the query failed silently" },
          { id: "d", text: "Because parameters strip special characters" },
        ],
        correct: "b",
        explanation:
          "The value was treated as a value. It is a perfectly valid name to search for, nobody is called that, so the answer is nobody. Nothing was rejected, escaped or stripped.",
        whyWrong: {
          a: "Nothing was rejected. The database has no opinion about whether a value looks dangerous, and that is exactly why this works.",
          c: "It succeeded and returned a correct empty result. A silent failure would be a different and worse behaviour.",
          d: "Parameters do not modify the value at all. It is sent separately from the instruction, which is the entire mechanism.",
        },
      },
      {
        id: "csq25-3",
        type: "scenario",
        difficulty: 3,
        atomId: "a-cs-w7-untrusted-input",
        prompt:
          "Which of these is most likely to be the unvalidated input in a real application?",
        options: [
          { id: "a", text: "The main search form field" },
          { id: "b", text: "The filename of an uploaded file, used to build a storage path" },
          { id: "c", text: "The password field on the login page" },
          { id: "d", text: "A numeric page parameter in the URL" },
        ],
        correct: "b",
        explanation:
          "Developers validate what looks like input. A filename does not feel like input, and using it to build a path is how path traversal happens.",
        whyWrong: {
          a: "Search fields are the most obvious input and are almost always the first thing anybody validates.",
          c: "Passwords go straight to a hashing function and are rarely interpolated into anything.",
          d: "Page numbers are usually cast to an integer early, which incidentally validates them.",
        },
      },
      {
        id: "csq25-4",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cs-w7-trust-boundary",
        prompt: "Why is drawing the trust boundaries the first step in reviewing a system?",
        options: [
          { id: "a", text: "Because it is required by most frameworks" },
          { id: "b", text: "Because vulnerabilities cluster on them, and an undrawn boundary is an unchecked one" },
          { id: "c", text: "Because it produces a diagram for the report" },
          { id: "d", text: "Because it identifies which language the system uses" },
        ],
        correct: "b",
        explanation:
          "If nobody can point at where data crosses from untrusted to trusted, nobody is checking it. The boundaries tell you where to spend your review time.",
        whyWrong: {
          a: "No framework requires it. It is a review technique rather than a compliance step.",
          c: "The diagram is a useful by-product, not the reason.",
          d: "The implementation language is already known and is not what a boundary describes.",
        },
      },
      {
        id: "csq25-5",
        type: "truefalse",
        difficulty: 2,
        atomId: "a-cs-w7-parameterised",
        prompt:
          "Using bound parameters for values means the whole query is now safe, including the table name.",
        options: [
          { id: "a", text: "True" },
          { id: "b", text: "False" },
        ],
        correct: "b",
        explanation:
          "False. Parameters cannot carry identifiers such as table or column names. Anything of that kind has to come from an allowlist of permitted names, never from the user's string.",
        whyWrong: {
          a: "This is a real and easily missed gap. A query with parameterised values and a concatenated table name is still injectable through that one part.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "cs-l26-validation-and-encoding": {
    lessonId: "cs-l26-validation-and-encoding",
    passMark: 70,
    questions: [
      {
        id: "csq26-1",
        type: "scenario",
        difficulty: 3,
        atomId: "a-cs-w7-allowlist",
        prompt:
          "A developer fixes a cross-site scripting report by stripping the string \"<script>\". Should you approve it?",
        options: [
          { id: "a", text: "Yes, the reported payload no longer works" },
          {
            id: "b",
            text: "No. Validate against what is permitted, and encode on output for the destination",
          },
          { id: "c", text: "Yes, if they also strip <img> and onerror" },
          { id: "d", text: "Yes, with a firewall rule as a second layer" },
        ],
        correct: "b",
        explanation:
          "Fix the class, not the payload. If a fix mentions a specific attack string, it has closed a report rather than a vulnerability.",
        whyWrong: {
          a: "The payload was one example. Case variation, other tags and event handlers all bypass it immediately.",
          c: "That accepts the denylist approach and makes the list longer. The set of dangerous inputs is not enumerable.",
          d: "A firewall rule in front of an unfixed bug is a reasonable stopgap while the real fix ships, and approving the code change signals the bug is fixed.",
        },
      },
      {
        id: "csq26-2",
        type: "mcq",
        difficulty: 3,
        atomId: "a-cs-w7-validate-vs-encode",
        prompt:
          "The same user-supplied string is written into an SQL query, an HTML page and a URL. What does that require?",
        options: [
          { id: "a", text: "One validation at entry, and that is sufficient" },
          {
            id: "b",
            text: "Validation once at entry, plus different encoding at each destination, and a bound parameter for the SQL",
          },
          { id: "c", text: "HTML escaping applied once, before storage" },
          { id: "d", text: "Rejecting the input if it contains any special character" },
        ],
        correct: "b",
        explanation:
          "Validation asks whether the data is acceptable and happens once. Encoding asks how to represent it safely in a particular destination, and it differs per destination. SQL is not an encoding problem at all.",
        whyWrong: {
          a: "Validation cannot know where the value will eventually be written, and the correct treatment depends entirely on that.",
          c: "Escaping before storage corrupts the data for every non-HTML destination and produces double-escaped output when it is rendered.",
          d: "Plenty of legitimate values contain special characters, including many real names. This breaks the application to avoid doing the work.",
        },
      },
      {
        id: "csq26-3",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cs-w7-encoding-demo",
        prompt: "What does HTML encoding do to a stored comment?",
        options: [
          { id: "a", text: "It removes the dangerous characters from the database" },
          {
            id: "b",
            text: "Nothing to the stored data. It changes how the browser interprets the characters when rendering",
          },
          { id: "c", text: "It encrypts the comment" },
          { id: "d", text: "It rejects the comment at submission" },
        ],
        correct: "b",
        explanation:
          "The value in the database is unchanged. At render time the characters that would have started a tag are written as entities, so the browser draws them instead of interpreting them, and the human reads exactly what was typed.",
        whyWrong: {
          a: "Storage is untouched, and that is deliberate: the raw value may be needed for other destinations.",
          c: "No key and no secrecy are involved. Encoding is a representation change, not encryption.",
          d: "Rejection is validation, which is a different control at a different point.",
        },
      },
      {
        id: "csq26-4",
        type: "scenario",
        difficulty: 3,
        atomId: "a-cs-w7-fail-closed",
        prompt:
          "An authorisation check is wrapped in a try block, and the except branch sets allowed to True. What is the problem?",
        options: [
          { id: "a", text: "Exceptions should never be caught" },
          {
            id: "b",
            text: "An attacker who can make the check fail is granted access, so the error path is the vulnerability",
          },
          { id: "c", text: "The check itself is incorrect" },
          { id: "d", text: "It will hide errors from the logs" },
        ],
        correct: "b",
        explanation:
          "The check is fine. What is wrong is what happens when it cannot run, and causing a dependency to time out is often easier than defeating the check.",
        whyWrong: {
          a: "Catching exceptions is normal and necessary. The question is what you do in the handler.",
          c: "Nothing is wrong with the check. That is what makes this bug survive code review.",
          d: "Log visibility is a real secondary concern and not the security failure here.",
        },
      },
      {
        id: "csq26-5",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cs-w7-safe-defaults",
        prompt:
          "Why has a framework that escapes template output by default prevented more cross-site scripting than training has?",
        options: [
          { id: "a", text: "Because developers ignore training" },
          {
            id: "b",
            text: "Because most deployments run on defaults, so the safe behaviour applies to everybody without a decision",
          },
          { id: "c", text: "Because escaping is more thorough than validation" },
          { id: "d", text: "Because frameworks are audited more carefully" },
        ],
        correct: "b",
        explanation:
          "The default is what happens when there is no time, and there is usually no time. Documentation is read by people who already care; the default is applied to everyone.",
        whyWrong: {
          a: "Training helps, and its reach is limited to the people who attended and remembered. The point is about coverage, not attitude.",
          c: "They solve different problems. Escaping is not a substitute for validation.",
          d: "Audit quality varies and is not why defaults work. Automatic application is.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "cs-l27-other-classes": {
    lessonId: "cs-l27-other-classes",
    passMark: 70,
    questions: [
      {
        id: "csq27-1",
        type: "scenario",
        difficulty: 3,
        atomId: "a-cs-w7-bounds",
        prompt:
          "A withdrawal function uses an account index with no validation, and is called with -1. In Python, what happens?",
        options: [
          { id: "a", text: "An IndexError is raised and the transaction is rejected" },
          {
            id: "b",
            text: "It silently addresses the last account, changing the wrong balance with no error",
          },
          { id: "c", text: "The value is clamped to zero" },
          { id: "d", text: "Memory is corrupted" },
        ],
        correct: "b",
        explanation:
          "Negative indexing is a language feature. Nothing crashes and nothing is logged, and the wrong account goes negative. This is what a real logic vulnerability looks like: no exception, just the wrong outcome.",
        whyWrong: {
          a: "An IndexError requires an index beyond the list in the positive direction. Negative indices are valid.",
          c: "Python does no clamping. It wraps from the end.",
          d: "Python is memory safe. That is precisely why this is worth showing: memory safety does not prevent wrong assumptions.",
        },
      },
      {
        id: "csq27-2",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cs-w7-memory-safety",
        prompt:
          "What does writing an application in a memory-safe language remove, and what does it leave?",
        options: [
          { id: "a", text: "It removes all security vulnerabilities" },
          {
            id: "b",
            text: "It removes the memory corruption class, and leaves injection, access control and every logic flaw",
          },
          { id: "c", text: "It removes injection but not overflows" },
          { id: "d", text: "It makes no difference to security" },
        ],
        correct: "b",
        explanation:
          "One class is designed out. The classes you will actually find in a web assessment are entirely unaffected, and a managed language calling a C extension inherits that extension's memory safety anyway.",
        whyWrong: {
          a: "Broken access control, the most common serious web vulnerability, is untouched by the choice of language.",
          c: "Exactly backwards. Memory safety addresses overflows and has no view of injection at all.",
          d: "It removes a class responsible for a large share of the most serious CVEs in history, which is a substantial difference.",
        },
      },
      {
        id: "csq27-3",
        type: "mcq",
        difficulty: 3,
        atomId: "a-cs-w7-race-conditions",
        prompt:
          "Why is a time-of-check to time-of-use bug hard to find in code review?",
        options: [
          { id: "a", text: "Because it only occurs in compiled languages" },
          {
            id: "b",
            text: "Because each path reads correctly on its own, and the flaw only appears when two run at once",
          },
          { id: "c", text: "Because it requires a debugger to observe" },
          { id: "d", text: "Because it is a hardware problem" },
        ],
        correct: "b",
        explanation:
          "A reviewer follows one execution path. Check the balance, then deduct, reads perfectly. Two requests running concurrently both pass the same check, and the fix is to make check and action a single atomic operation.",
        whyWrong: {
          a: "It occurs in any concurrent system, and web applications are concurrent by default.",
          c: "A debugger does not help either, because the single-threaded run is correct.",
          d: "It is a design issue in the application's use of shared state, not a hardware fault.",
        },
      },
      {
        id: "csq27-4",
        type: "scenario",
        difficulty: 3,
        atomId: "a-cs-w7-error-messages",
        prompt:
          "Why must a login form take the same time to respond whether or not the account exists?",
        options: [
          { id: "a", text: "To improve perceived performance" },
          {
            id: "b",
            text: "Because skipping the slow password hash for a missing account makes the response measurably faster, which leaks the same information the message would",
          },
          { id: "c", text: "Because slow responses indicate a server problem" },
          { id: "d", text: "It does not matter as long as the message is identical" },
        ],
        correct: "b",
        explanation:
          "bcrypt is slow by design, so a missing account that skips it answers roughly 250 milliseconds sooner. That difference is trivially measurable and catches out otherwise careful implementations.",
        whyWrong: {
          a: "Performance is not the concern. Deliberately adding delay is the usual fix, which is the opposite of a performance goal.",
          c: "Response time here is a security signal, not a health signal.",
          d: "This is the trap. Identical messages with different timings still enumerate accounts.",
        },
      },
      {
        id: "csq27-5",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cs-w7-crypto-misuse",
        prompt:
          "A hardcoded API key is removed in a new commit. Is the problem fixed?",
        options: [
          { id: "a", text: "Yes, it is no longer in the code" },
          { id: "b", text: "No. It is still in the repository history and must be rotated, not deleted" },
          { id: "c", text: "Yes, once the branch is merged" },
          { id: "d", text: "No, unless the file is also deleted" },
        ],
        correct: "b",
        explanation:
          "History is public the moment the repository is, and automated scanners find exposed keys within minutes. The credential has to be revoked and replaced, which is the only action that actually changes anything.",
        whyWrong: {
          a: "The current working tree is clean and every previous commit still contains it.",
          c: "Merging brings the history with it. The commit that added the key is still there.",
          d: "Deleting the file does not remove its earlier versions from history either.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "cs-l28-dependencies-sdlc": {
    lessonId: "cs-l28-dependencies-sdlc",
    passMark: 70,
    questions: [
      {
        id: "csq28-1",
        type: "scenario",
        difficulty: 3,
        atomId: "a-cs-w7-supply-chain",
        prompt:
          "A developer installs a package with almost the right name and the build passes. What is the correct response?",
        options: [
          { id: "a", text: "Nothing. A working build means it was the right package" },
          {
            id: "b",
            text: "Treat it as a possible typosquat, verify the real name, inspect what was installed, and assume the developer machine may be compromised",
          },
          { id: "c", text: "Pin the version so it is consistent" },
          { id: "d", text: "Run a vulnerability scanner over it" },
        ],
        correct: "b",
        explanation:
          "Install scripts run arbitrary code with the developer's privileges on a machine holding credentials and source access. In several documented cases the payload took credentials and never touched the application.",
        whyWrong: {
          a: "Typosquats are written to work. A package that breaks the build is removed before it can do anything.",
          c: "Pinning would reliably install the wrong package every time. It is good practice that answers a different question.",
          d: "A scanner compares known packages against known advisories. A fresh typosquat is in neither database.",
        },
      },
      {
        id: "csq28-2",
        type: "mcq",
        difficulty: 3,
        atomId: "a-cs-w7-tooling",
        prompt:
          "Which vulnerability class is invisible to static analysis, dependency scanning and dynamic testing alike?",
        options: [
          { id: "a", text: "SQL injection" },
          { id: "b", text: "Broken access control" },
          { id: "c", text: "A known vulnerable library version" },
          { id: "d", text: "Cross-site scripting" },
        ],
        correct: "b",
        explanation:
          "Only a human who understands what the application is supposed to mean can tell that this user should not be able to open that invoice. To a tool the code looks correct, because functionally it is.",
        whyWrong: {
          a: "Static analysis detects the concatenation pattern, and dynamic testing finds it by probing.",
          c: "That is precisely what dependency scanning is for.",
          d: "Both static and dynamic analysis find these routinely, which is why they are far less common than they were.",
        },
      },
      {
        id: "csq28-3",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cs-w7-secure-sdlc",
        prompt:
          "What is the strongest argument for involving security during design rather than before release?",
        options: [
          { id: "a", text: "Security teams prefer to be involved early" },
          {
            id: "b",
            text: "The same flaw costs roughly sixty times more to fix in production than in design",
          },
          { id: "c", text: "Designers understand security better than developers" },
          { id: "d", text: "It is required by ISO 27001" },
        ],
        correct: "b",
        explanation:
          "The economics are the argument that works with management. A flaw found on a whiteboard costs a conversation; the same flaw in production costs an incident, a fix, a release and possibly a notification.",
        whyWrong: {
          a: "Preference persuades nobody who is managing a delivery date.",
          c: "No such general difference exists, and the claim would be unhelpful in the room.",
          d: "Some frameworks encourage it, and citing a standard invites the minimum implementation that satisfies the auditor.",
        },
      },
      {
        id: "csq28-4",
        type: "scenario",
        difficulty: 3,
        atomId: "a-cs-w7-code-review",
        prompt:
          "An endpoint loads an invoice by id and returns it. The code is clean, typed and well tested. What is the most likely vulnerability?",
        options: [
          { id: "a", text: "SQL injection in the id parameter" },
          { id: "b", text: "Nothing checks whether the invoice belongs to the person asking" },
          { id: "c", text: "Missing rate limiting" },
          { id: "d", text: "An outdated dependency" },
        ],
        correct: "b",
        explanation:
          "Broken access control, and it looks exactly like clean, well-tested code because functionally it is. The tests check that it returns the invoice, which it does, to anyone who asks.",
        whyWrong: {
          a: "Possible, and a typed id parameter in clean modern code is usually parameterised already.",
          c: "Worth having, and it limits enumeration speed rather than preventing unauthorised access.",
          d: "A real concern that is unrelated to the shape of this endpoint.",
        },
      },
      {
        id: "csq28-5",
        type: "truefalse",
        difficulty: 2,
        atomId: "a-cs-w7-dependencies",
        prompt:
          "Reviewing your own team's code is enough to know what security risk your application carries.",
        options: [
          { id: "a", text: "True" },
          { id: "b", text: "False" },
        ],
        correct: "b",
        explanation:
          "False. A typical project has thirty direct dependencies and over a thousand packages in total, all running with the same privileges as your code. You find out about those from advisories, which requires knowing what you depend on.",
        whyWrong: {
          a: "Your own code is usually the smaller part of what ships. Reviewing it well is necessary and nowhere near sufficient.",
        },
      },
    ],
  },
};

export default ASSESSMENTS;
