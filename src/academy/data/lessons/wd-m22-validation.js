/**
 * RESPONSIVE WEB DEVELOPMENT · MODULE 22 · FORMS AND VALIDATION
 *
 * Curriculum 22.1 – 22.10. Reading form values, required fields and custom
 * rules, email, password, number and range checks, error messages, blocking
 * invalid submissions, resetting, accessible messages, why the server must
 * validate too, and handling user content safely. The labs fill the form in
 * the browser and check every message, attribute and submission.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

export const SECTION_ID = "wd-s22-validation";

const page = (title, body) => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title}</title>
  <link rel="stylesheet" href="style.css">
  <script src="app.js" defer></script>
</head>
<body>
${body}
</body>
</html>
`;

const CSS = `body { font-family: Arial, sans-serif; padding: 16px; }
.field { margin-bottom: 12px; }
label { display: block; font-weight: 700; }
input { padding: 8px; }
input[aria-invalid="true"] { border: 2px solid #b91c1c; }
.error { color: #b91c1c; margin: 4px 0 0; }
`;

const RULES_JS = `// values: { name, email, password, age }
// Return an object of error messages; an empty object means valid.
function validate(values) {
  const errors = {};

  return errors;
}

console.log(validate({ name: "", email: "ada@", password: "abc", age: "12" }));
`;

const SIGNUP_HTML = page("Sign up", `  <form id="signup" action="/signup" method="post" novalidate>
    <div class="field">
      <label for="email">Email</label>
      <input id="email" name="email" type="email" aria-describedby="email-error">
      <p class="error" id="email-error"></p>
    </div>
    <div class="field">
      <label for="password">Password (at least 8 characters)</label>
      <input id="password" name="password" type="password" aria-describedby="password-error">
      <p class="error" id="password-error"></p>
    </div>
    <button type="submit">Create account</button>
  </form>
  <p id="result" role="status"></p>`);

const SIGNUP_JS = `const form = document.querySelector("#signup");

// Given: the rules, as a pure function.
function validate({ email, password }) {
  const errors = {};
  if (!email.trim()) errors.email = "Enter your email address";
  else if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email.trim())) errors.email = "Enter an email address like name@example.com";
  if (password.length < 8) errors.password = "Use at least 8 characters";
  return errors;
}

// Your code: show the errors accessibly, block invalid submissions,
// and on success show a message and reset the form.
`;

const SIGNUP_JS_DONE = SIGNUP_JS.replace(
  "// Your code: show the errors accessibly, block invalid submissions,\n// and on success show a message and reset the form.\n",
  `function showErrors(errors) {
  for (const name of ["email", "password"]) {
    const input = form.elements[name];
    const message = document.querySelector(\`#\${name}-error\`);
    message.textContent = errors[name] || "";
    input.setAttribute("aria-invalid", errors[name] ? "true" : "false");
  }
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const values = Object.fromEntries(new FormData(form));
  const errors = validate(values);
  showErrors(errors);
  const firstBad = Object.keys(errors)[0];
  if (firstBad) {
    form.elements[firstBad].focus();
    return;
  }
  document.querySelector("#result").textContent = "Account created. Check your email.";
  form.reset();
  showErrors({});
});
`
);

const COMMENTS_HTML = page("Comments", `  <form id="comment-form">
    <label for="comment">Your comment</label>
    <textarea id="comment" name="comment"></textarea>
    <button type="submit">Post</button>
    <p id="comment-error" role="alert"></p>
  </form>
  <ul id="comments"></ul>`);

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 99 · 22.1 – 22.4
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "wd-l99-rules",
    moduleId: "wd-m22-validation",
    sectionId: SECTION_ID,
    order: 1,
    covers: ["22.1", "22.2", "22.3", "22.4"],
    title: "Reading Values and Writing Validation Rules",
    subtitle: "Getting what was typed, and deciding whether it is acceptable",
    estimatedMinutes: 26,
    intro: "Native validation (Module 5) handles the basics. Real forms need more: a password that matches a confirmation, an age within a range, a message that says exactly what is wrong. That is JavaScript validation, and it starts with rules written as a pure function.",

    atoms: [
      {
        id: "a-wd-reading-values",
        title: "Reading form input values",
        explain:
          "input.value is the text in a field (always a string), checkbox.checked is true or false, and a select's value is the chosen option's value. form.elements.email finds a field by its name. new FormData(form) collects every named field, and Object.fromEntries(new FormData(form)) turns it into a plain object such as { email: \"…\", password: \"…\" }: perfect for passing to a validation function.",
        example: "form.addEventListener(\"submit\", (event) => {\n  event.preventDefault();\n  const values = Object.fromEntries(new FormData(form));\n  // values → { name: \"Ada\", email: \"ada@example.com\", age: \"16\" }\n  const errors = validate(values);\n});",
      },
      {
        id: "a-wd-required-custom",
        title: "Required fields and custom rules",
        explain:
          "Write the rules as a pure function, validate(values), that returns an object of error messages keyed by field name, and an empty object when all is well. It can then be tested on its own, reused on the server (Lesson 101) and shown in the page however you like. Trim text before checking it is not empty: \"   \" is not a name.",
      },
      {
        id: "a-wd-email-password",
        title: "Email and password validation",
        explain:
          "For email, check for something@something.something with a simple pattern such as /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/; a perfect email pattern does not exist, and the only real proof is sending an email to it. For passwords, length matters far more than clever rules: require at least 8 characters (12 is better), allow every character including spaces, and never cap them short. Check that a confirmation field matches.",
      },
      {
        id: "a-wd-number-range",
        title: "Number and range validation",
        explain:
          "Numbers arrive as text. Convert with Number(), then check Number.isFinite (it was a number at all), Number.isInteger if a whole number is needed, and the range: an age between 13 and 120, a quantity from 1 to 10. An empty field converts to 0, so check emptiness first.",
        webLab: {
          task:
            "Write validate(values) for a sign-up. Return an object of messages: name \"Enter your name\" if it is empty after trimming; email \"Enter a valid email\" unless it looks like name@domain.tld; password \"Use at least 8 characters\" if it is shorter than 8; age \"Enter your age as a whole number\" if it is empty or not a whole number, otherwise \"You must be 13 to 120\" if it is outside that range. Return {} when everything is valid.",
          files: { "app.js": RULES_JS },
          tests: [
            { label: "A fully valid sign-up returns {}", check: "const e = validate({ name: 'Ada', email: 'ada@example.com', password: 'correct horse', age: '16' }); return e && Object.keys(e).length === 0;", fail: "When every rule passes, return an empty object." },
            { label: "Empty or blank name: \"Enter your name\"", check: "return validate({ name: '   ', email: 'a@b.co', password: '12345678', age: '20' }).name === 'Enter your name';", fail: "Trim the name before checking it is empty." },
            { label: "Bad emails are caught; good ones pass", check: "const bad = ['ada', 'ada@', 'ada@example', '@example.com', 'a b@c.com'].every((email) => validate({ name: 'A', email, password: '12345678', age: '20' }).email === 'Enter a valid email'); const good = !validate({ name: 'A', email: 'ada.obi@school.edu.ng', password: '12345678', age: '20' }).email; return bad && good;", fail: "Use a pattern such as /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/." },
            { label: "Passwords under 8 characters fail; 8 and spaces are fine", check: "return validate({ name: 'A', email: 'a@b.co', password: 'abc1234', age: '20' }).password === 'Use at least 8 characters' && !validate({ name: 'A', email: 'a@b.co', password: 'ab cd ef', age: '20' }).password;", fail: "Check password.length < 8 only; allow spaces." },
            { label: "Age must be a whole number from 13 to 120", check: "const msg = (age) => validate({ name: 'A', email: 'a@b.co', password: '12345678', age }).age; return msg('') === 'Enter your age as a whole number' && msg('twelve') === 'Enter your age as a whole number' && msg('15.5') === 'Enter your age as a whole number' && msg('12') === 'You must be 13 to 120' && msg('121') === 'You must be 13 to 120' && msg('13') === undefined && msg('120') === undefined;", fail: "Check empty first, then Number.isInteger(Number(age)), then the range." },
            { label: "Several errors are reported at once", check: "return Object.keys(validate({ name: '', email: 'x', password: '1', age: '5' })).length === 4;", fail: "Check every field; do not stop at the first error." },
          ],
          solution: { "app.js": "// values: { name, email, password, age }\n// Return an object of error messages; an empty object means valid.\nfunction validate(values) {\n  const errors = {};\n  const { name, email, password, age } = values;\n\n  if (!name.trim()) errors.name = \"Enter your name\";\n  if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email.trim())) errors.email = \"Enter a valid email\";\n  if (password.length < 8) errors.password = \"Use at least 8 characters\";\n\n  const n = Number(age);\n  if (age.trim() === \"\" || !Number.isInteger(n)) errors.age = \"Enter your age as a whole number\";\n  else if (n < 13 || n > 120) errors.age = \"You must be 13 to 120\";\n\n  return errors;\n}\n\nconsole.log(validate({ name: \"\", email: \"ada@\", password: \"abc\", age: \"12\" }));\n" },
          hint: "Each rule is an if that adds to errors. else if for age keeps the two age messages from both appearing.",
          successMessage: "Validation as a pure function: every rule is testable without a page, and the same function can run on the server.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 100 · 22.5 – 22.8
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "wd-l100-feedback",
    moduleId: "wd-m22-validation",
    sectionId: SECTION_ID,
    order: 2,
    covers: ["22.5", "22.6", "22.7", "22.8"],
    title: "Messages, Blocking Bad Submissions, Resetting and Accessible Feedback",
    subtitle: "Telling people what is wrong in a way everyone can perceive",
    estimatedMinutes: 26,
    intro: "Rules decide what is wrong; the interface must say so clearly, in the right place, to everyone, including people who cannot see red borders. Then it must stop the bad data, and get out of the way once the data is good.",

    atoms: [
      {
        id: "a-wd-error-messages",
        title: "Error messages and feedback",
        explain:
          "Put each message next to its field, say what to do (\"Use at least 8 characters\", not \"Invalid\"), use plain words, and do not blame the person. Show errors when the form is submitted, or when a field is left, not on every keystroke while someone is still typing. Remove a message as soon as its field is fixed. And confirm success too: a clear \"Account created\" after submission.",
      },
      {
        id: "a-wd-prevent-invalid",
        title: "Preventing invalid submissions",
        explain:
          "In the submit handler, always call preventDefault, validate, and only continue if there are no errors. Add novalidate to the form when you validate in JavaScript, so the browser's own bubbles do not appear on top of your messages, and keep the HTML attributes (type=\"email\", required) for their keyboards and autofill.",
      },
      {
        id: "a-wd-reset-forms",
        title: "Resetting forms",
        explain:
          "form.reset() returns every field to its starting value. Do it after a successful submission so the form is ready for the next entry, and also clear any leftover error messages and aria-invalid states, which reset does not touch. Never reset after a failed submission: people should not have to retype what was right.",
      },
      {
        id: "a-wd-accessible-validation",
        title: "Accessible validation messages",
        explain:
          "Connect each message to its field with aria-describedby, so a screen reader reads it when the field is focused. Set aria-invalid=\"true\" on fields with errors. After a failed submission, move focus to the first invalid field, so keyboard and screen-reader users land on the problem. A status region (role=\"status\") announces success messages without moving focus.",
        webLab: {
          task:
            "The rules are given as validate(). Write the rest. On submit: prevent the default; validate the values; show each field's message in its #…-error paragraph (or clear it); set aria-invalid to \"true\" or \"false\"; and if there are errors, move focus to the first invalid field and stop. If everything is valid, show \"Account created. Check your email.\" in #result, reset the form, and clear the error states.",
          files: { "index.html": SIGNUP_HTML, "style.css": CSS, "app.js": SIGNUP_JS },
          readOnly: ["index.html", "style.css"],
          tests: [
            { label: "Submitting the empty form shows both messages", check: "await submit('#signup'); return text('#email-error') === 'Enter your email address' && text('#password-error') === 'Use at least 8 characters';", fail: "Show validate()'s message for each field in its error paragraph." },
            { label: "Invalid fields are marked aria-invalid=\"true\"", check: "return $('#email').getAttribute('aria-invalid') === 'true' && $('#password').getAttribute('aria-invalid') === 'true';", fail: "setAttribute(\"aria-invalid\", \"true\") on each field with an error." },
            { label: "Focus moves to the first invalid field", check: "return document.activeElement === $('#email');", fail: "Focus form.elements[firstErrorName]." },
            { label: "An invalid form is not submitted", check: "return submissions().length === 0;", fail: "Call event.preventDefault() at the start of the handler." },
            { label: "Fixing a field clears its message on the next submit", check: "await type('#email', 'ada@example.com'); await submit('#signup'); return text('#email-error') === '' && $('#email').getAttribute('aria-invalid') === 'false' && text('#password-error') !== '' && document.activeElement === $('#password');", fail: "Clear the message and set aria-invalid=\"false\" for fields without errors." },
            { label: "A valid form shows the success message and resets", check: "await type('#password', 'correct horse'); await submit('#signup'); return text('#result') === 'Account created. Check your email.' && $('#email').value === '' && $('#password').getAttribute('aria-invalid') !== 'true' && submissions().length === 0;", fail: "On success, set #result's text, call form.reset() and clear the error states." },
          ],
          solution: { "app.js": SIGNUP_JS_DONE },
          hint: "Write showErrors(errors) once and call it both after validation and, with {}, after a successful reset.",
          successMessage: "Errors announced to screen readers, focus on the first problem, nothing sent until it is right, and a clean form afterwards. That is a professional form.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 101 · 22.9 – 22.10
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "wd-l101-safe-content",
    moduleId: "wd-m22-validation",
    sectionId: SECTION_ID,
    order: 3,
    covers: ["22.9", "22.10"],
    title: "Client versus Server Validation, and Safe User Content",
    subtitle: "Why the browser's checks are a courtesy, and how to show what people type without danger",
    estimatedMinutes: 22,
    intro: "Validation in the browser makes forms pleasant. It does not make them safe. This lesson draws the line between the two, and shows the one habit that stops user content attacking your page.",

    atoms: [
      {
        id: "a-wd-client-server",
        title: "Client-side versus server-side validation",
        explain:
          "Client-side validation runs in the visitor's browser: fast feedback, no waiting. But the visitor controls their browser: they can switch off JavaScript, edit the page in the developer tools, or send a request straight to your server with no page at all. So every rule that protects data or money must be checked again on the server, which the visitor cannot change. Client checks are for convenience; server checks are for correctness and security.",
        decision: {
          scenario: "A shop's checkout checks in JavaScript that the quantity is between 1 and 10 and the price matches the product. The server simply saves whatever it receives.",
          question: "What is the risk?",
          options: [
            { id: "a", text: "Anyone can send the server a quantity of 1000 or a price of ₦1, bypassing the browser entirely", why: "The browser is not under your control. The server must recalculate the price from its own data and enforce the limits itself." },
            { id: "b", text: "None: the JavaScript blocks bad values", whyWrong: "Only for people using your page normally. Attackers do not." },
            { id: "c", text: "The page will be slow", whyWrong: "Speed is not the problem; trust is." },
            { id: "d", text: "Customers will see error messages", whyWrong: "The problem is the messages that are never shown to an attacker at all." },
          ],
          correct: "a",
          aftermath: "Never trust the client. Module 31 returns to this in detail.",
        },
      },
      {
        id: "a-wd-safe-content",
        title: "Safe handling of user-provided content",
        explain:
          "Anything a person types may be shown to other people: comments, names, reviews. If it is inserted with innerHTML, markup in it becomes real elements, and a comment such as <img src=x onerror=…> runs code in every reader's browser. Show user content with textContent (or createElement plus textContent), which displays it as text and can never run. Also trim it, limit its length, and keep the rules on the server too.",
        webLab: {
          task:
            "Make the comment box safe. On submit: prevent the default; trim the comment; if it is empty show \"Write a comment first\" in #comment-error; if it is longer than 280 characters show \"Keep it under 280 characters\"; otherwise add it to #comments as an li using textContent, so any markup in it is shown as text, clear the error and reset the form.",
          files: { "index.html": COMMENTS_HTML, "style.css": CSS, "app.js": "// Post comments safely\n" },
          readOnly: ["index.html", "style.css"],
          tests: [
            { label: "A normal comment is added, trimmed", check: "await type('#comment', '  Great service!  '); await submit('#comment-form'); return $$('#comments li').length === 1 && $('#comments li').textContent === 'Great service!' && $('#comment').value === '';", fail: "Trim, create an li, set its textContent, append it and reset the form." },
            { label: "Markup in a comment is shown as text and never runs", check: "await type('#comment', '<img src=x onerror=\"document.title=1\"><b>Hi</b>'); await submit('#comment-form'); await wait(50); const last = $$('#comments li').at(-1); return !$('#comments img') && !$('#comments b') && last.textContent.includes('<b>Hi</b>') && document.title !== '1';", fail: "Use textContent, never innerHTML, for the comment." },
            { label: "An empty comment shows \"Write a comment first\"", check: "await type('#comment', '   '); await submit('#comment-form'); return text('#comment-error') === 'Write a comment first' && $$('#comments li').length === 2;", fail: "If the trimmed comment is empty, show the message and add nothing." },
            { label: "Over 280 characters is refused", check: "await type('#comment', 'a'.repeat(281)); await submit('#comment-form'); return text('#comment-error') === 'Keep it under 280 characters' && $$('#comments li').length === 2;", fail: "Check the trimmed length > 280." },
            { label: "A valid comment clears the error message", check: "await type('#comment', 'Thanks'); await submit('#comment-form'); return text('#comment-error') === '' && $$('#comments li').length === 3 && submissions().length === 0;", fail: "Clear #comment-error when a comment is posted." },
          ],
          solution: { "app.js": "const form = document.querySelector(\"#comment-form\");\nconst box = document.querySelector(\"#comment\");\nconst error = document.querySelector(\"#comment-error\");\nconst list = document.querySelector(\"#comments\");\n\nform.addEventListener(\"submit\", (event) => {\n  event.preventDefault();\n  const text = box.value.trim();\n  if (!text) {\n    error.textContent = \"Write a comment first\";\n    return;\n  }\n  if (text.length > 280) {\n    error.textContent = \"Keep it under 280 characters\";\n    return;\n  }\n  const li = document.createElement(\"li\");\n  li.textContent = text;\n  list.append(li);\n  error.textContent = \"\";\n  form.reset();\n});\n" },
          hint: "createElement plus textContent is safe for any text at all; there is nothing to escape and nothing to forget.",
          successMessage: "A comment box that cannot be used to attack its readers. The same rules must also run on the server.",
        },
      },
    ],

    task: {
      title: "Module project: a validated sign-up form",
      intro: "Build signup.html on your own computer.",
      prompts: [
        "Fields for name, email, phone, password, confirm password and age, with labels, types and autocomplete.",
        "A pure validate(values) function covering every field, including that the two passwords match.",
        "Accessible feedback: messages linked with aria-describedby, aria-invalid, focus on the first error, and a role=\"status\" success message.",
        "Validate each field again when it loses focus (the blur event), but never while it is being typed in for the first time.",
        "Try to bypass your own validation in the developer tools, and write down what a server would have to check again.",
      ],
      closing: "Next module: remembering what people entered, in the browser.",
    },
    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
