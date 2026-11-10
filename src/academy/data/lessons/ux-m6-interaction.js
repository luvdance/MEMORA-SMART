/**
 * UI/UX DESIGN · MODULE 6 · USER FLOWS AND INTERACTION DESIGN
 *
 * Curriculum 6.1 – 6.21 and the practical 6.P. Interaction design, user and
 * task flows, flow diagrams, navigation and interaction patterns, forms and
 * validation, feedback and states, error prevention, affordances, feedback
 * loops, microinteractions, mental models, the laws of UX and Gestalt.
 *
 * Flows are written in a small text notation the checks parse into a graph:
 *   3. [Decision] Is the number registered? Yes → 4, No → 9
 * Every step must be reachable from the start, every arrow must point at a
 * real step, and decisions must have both branches.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

import { BASE, page, docPage, CONTRAST } from "./ux-kit.js";

export const SECTION_ID = "ux-s6-interaction";

/** Parses flow notation from `file` into steps, arrows and reachability. */
const FLOW = (file) => String.raw`const steps = {}; const order = [];
for (const l of raw('${file}').replace(/\r/g, '').split('\n')) { const m = l.match(/^\s*(\d+)\.\s*\[(start|screen|action|decision|end)\]\s*(.+)$/i); if (m) { const n = Number(m[1]); steps[n] = { n, kind: m[2].toLowerCase(), text: m[3] }; order.push(n); } }
const arrows = (s) => [...s.text.matchAll(/(?:→|->)\s*(\d+)/g)].map((x) => Number(x[1]));
const nexts = (s) => { if (s.kind === 'end') return []; const t = arrows(s); if (s.kind === 'decision' || t.length) return t; const i = order.indexOf(s.n); return i + 1 < order.length ? [order[i + 1]] : []; };
const reach = new Set(); const stack = order.length ? [order[0]] : []; while (stack.length) { const n = stack.pop(); if (reach.has(n) || !steps[n]) continue; reach.add(n); stack.push(...nexts(steps[n])); }
const all = order.map((n) => steps[n]); const of = (k) => all.filter((s) => s.kind === k);
const branches = (s) => /\byes\s*(?:→|->)\s*\d+/i.test(s.text) && /\bno\s*(?:→|->)\s*\d+/i.test(s.text);
`;

const FLOW_RULES = [
  "Number each step and tag it: [Start], [Screen], [Action], [Decision] or [End]",
  "A step goes to the next number unless it says → N",
  "A decision ends with both branches: Yes → N, No → M",
  "Example: 3. [Decision] Is the number registered? Yes → 4, No → 9",
];

/* ── Lesson 23 lab: a login flow ───────────────────────────────────────── */
const LOGIN_MD = `# User flow: log in with a phone number

1. [Start] Open the app
2. [Screen] Enter phone number
3. [Screen] Home screen
4. [End] Logged in
`;

const LOGIN_MD_DONE = `# User flow: log in with a phone number

1. [Start] Open the app
2. [Screen] Enter phone number
3. [Decision] Is the number registered? Yes → 4, No → 9
4. [Action] App sends a six-digit code by SMS
5. [Screen] Enter the code
6. [Decision] Is the code correct? Yes → 7, No → 11
7. [Screen] Home screen
8. [End] Logged in
9. [Screen] "No account with this number" with a Create account button
10. [End] Goes to registration
11. [Screen] "That code is wrong" with Try again and Resend code → 5
`;

/* ── Lesson 24 lab: a sign-up form with validation ─────────────────────── */
const SIGNUP_HTML = page(
  "Create your account",
  `  <main class="signup">
    <h1>Create your account</h1>
    <form id="form" action="/signup" method="post" novalidate>
      <div class="field">
        <input id="name" name="name" placeholder="Full name">
      </div>
      <div class="field">
        <input id="email" name="email" type="text" placeholder="Email">
      </div>
      <div class="field">
        <input id="phone" name="phone" type="text" placeholder="Phone">
        <p class="error" id="phone-error" hidden>Invalid input</p>
      </div>
      <button class="btn" type="submit">Submit</button>
    </form>
  </main>`,
  { js: true }
);

const SIGNUP_HTML_DONE = page(
  "Create your account",
  `  <main class="signup">
    <h1>Create your account</h1>
    <form id="form" action="/signup" method="post" novalidate>
      <div class="field">
        <label for="name">Full name</label>
        <input id="name" name="name" autocomplete="name">
      </div>
      <div class="field">
        <label for="email">Email address</label>
        <input id="email" name="email" type="email" autocomplete="email">
      </div>
      <div class="field">
        <label for="phone">Phone number</label>
        <input id="phone" name="phone" type="tel" autocomplete="tel" aria-describedby="phone-error">
        <p class="error" id="phone-error" hidden>Enter an 11-digit phone number, like 0803 123 4567.</p>
      </div>
      <button class="btn" type="submit">Create account</button>
    </form>
  </main>`,
  { js: true }
);

const SIGNUP_JS = `// Read-only: shows the phone error when the number is not 11 digits.
const form = document.getElementById("form");
const phone = document.getElementById("phone");
const error = document.getElementById("phone-error");

form.addEventListener("submit", (event) => {
  const digits = phone.value.replace(/\\D/g, "");
  if (digits.length !== 11) {
    event.preventDefault();
    phone.setAttribute("aria-invalid", "true");
    error.hidden = false;
    phone.focus();
  } else {
    phone.removeAttribute("aria-invalid");
    error.hidden = true;
  }
});
`;

const SIGNUP_CSS = `${BASE}
body { color: #111827; }

.signup { max-width: 420px; margin: 0 auto; padding: 24px 16px; }
h1 { margin: 0 0 24px; font-size: 1.75rem; }

.field { margin-bottom: 20px; }
label { display: block; margin-bottom: 6px; font-weight: 700; }
input { display: block; width: 100%; min-height: 44px; padding: 10px 12px; border: 1px solid #6b7280; border-radius: 8px; font: inherit; }

.btn { width: 100%; min-height: 48px; border: 0; border-radius: 8px; background: #6d28d9; color: #ffffff; font: inherit; font-weight: 700; }
`;

const SIGNUP_CSS_DONE = `${SIGNUP_CSS}
/* Error state: border, colour, words and a marker, never colour alone */
input[aria-invalid="true"] { border: 2px solid #b91c1c; }
.error { margin: 6px 0 0; color: #b91c1c; font-size: 0.9375rem; }
.error::before { content: "⚠ "; }
`;

/* ── Lesson 25 lab: a button's states and microinteraction ─────────────── */
const BUTTON_HTML = page(
  "Save changes",
  `  <main class="panel">
    <h1>Profile settings</h1>
    <p>Changes are saved to your account.</p>
    <div class="actions">
      <button class="btn" type="button">Save changes</button>
      <button class="btn" type="button" disabled>Saved</button>
    </div>
  </main>`
);

const BUTTON_CSS = `${BASE}
body { color: #111827; }

.panel { max-width: 480px; margin: 0 auto; padding: 32px 16px; }
.actions { display: flex; gap: 16px; }

.btn {
  min-height: 48px;
  padding: 12px 24px;
  border: 0;
  border-radius: 8px;
  background: #6d28d9;
  color: #ffffff;
  font: inherit;
  font-weight: 700;
  cursor: pointer;
  outline: none;
}
`;

const BUTTON_CSS_DONE = `${BASE}
body { color: #111827; }

.panel { max-width: 480px; margin: 0 auto; padding: 32px 16px; }
.actions { display: flex; gap: 16px; }

.btn {
  min-height: 48px;
  padding: 12px 24px;
  border: 0;
  border-radius: 8px;
  background: #6d28d9;
  color: #ffffff;
  font: inherit;
  font-weight: 700;
  cursor: pointer;
  transition: background-color 150ms ease-out, transform 150ms ease-out;
}

/* Hover: a darker shade says "this responds to you" */
.btn:hover { background: #5b21b6; }

/* Pressed: a small push down */
.btn:active { transform: scale(0.97); }

/* Keyboard focus: a visible ring */
.btn:focus-visible { outline: 3px solid #1d4ed8; outline-offset: 3px; }

/* Disabled: clearly unavailable */
.btn:disabled { background: #e5e7eb; color: #4b5563; cursor: not-allowed; }

/* Respect people who ask for less motion */
@media (prefers-reduced-motion: reduce) {
  .btn { transition: none; }
}
`;

/* ── Lesson 26 lab: Fitts's law on a payment screen ────────────────────── */
const PAY_HTML = page(
  "Send money",
  `  <main class="send">
    <h1>Send money to Tunde Bakare</h1>
    <p class="acct">GTBank · 0123456789</p>
    <p class="amount">₦5,000</p>
    <div class="chips">
      <button class="chip" type="button">₦1,000</button>
      <button class="chip" type="button">₦2,000</button>
      <button class="chip" type="button">₦5,000</button>
    </div>
    <div class="bar">
      <button class="cancel" type="button">Cancel</button>
      <button class="pay" type="button">Send ₦5,000</button>
    </div>
  </main>`
);

const PAY_CSS = `${BASE}
body { color: #111827; }

.send { max-width: 480px; margin: 0 auto; padding: 24px 16px 120px; }
h1 { margin: 0 0 4px; font-size: 1.375rem; }
.acct { margin: 0 0 24px; color: #4b5563; }
.amount { margin: 0 0 16px; font-size: 40px; font-weight: 700; }

.chips { display: flex; gap: 2px; }
.chip { padding: 4px 8px; border: 1px solid #6b7280; border-radius: 999px; background: #ffffff; font: inherit; }

.bar { display: flex; gap: 4px; margin-top: 24px; }
.cancel { padding: 12px 24px; border: 0; border-radius: 8px; background: #b91c1c; color: #ffffff; font: inherit; font-weight: 700; }
.pay { padding: 6px 12px; border: 0; border-radius: 8px; background: #15803d; color: #ffffff; font: inherit; }
`;

const PAY_CSS_DONE = `${BASE}
body { color: #111827; }

.send { max-width: 480px; margin: 0 auto; padding: 24px 16px 120px; }
h1 { margin: 0 0 4px; font-size: 1.375rem; }
.acct { margin: 0 0 24px; color: #4b5563; }
.amount { margin: 0 0 16px; font-size: 40px; font-weight: 700; }

/* Targets at least 44 × 44 with room between them */
.chips { display: flex; gap: 12px; }
.chip { min-width: 88px; min-height: 44px; padding: 8px 16px; border: 1px solid #6b7280; border-radius: 999px; background: #ffffff; font: inherit; }

/* The main action: big, at the bottom where the thumb rests */
.bar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  background: #ffffff;
  border-top: 1px solid #e5e7eb;
}

.pay { width: 100%; min-height: 56px; border: 0; border-radius: 12px; background: #15803d; color: #ffffff; font: inherit; font-size: 1.125rem; font-weight: 700; }

/* The destructive action: smaller, quiet, and well away from Pay */
.cancel { align-self: center; min-height: 44px; padding: 8px 16px; border: 0; background: transparent; color: #b91c1c; font: inherit; font-weight: 700; }
`;

/* ── Lesson 27 lab: the e-learning flow ────────────────────────────────── */
const ELEARN_MD = `# User flow: register, log in, choose a course and pay

1. [Start] Open Memora Learn
2. [Screen] Home
3. [Screen] Course page
4. [Screen] Payment
5. [End] Course unlocked
`;

const ELEARN_MD_DONE = `# User flow: register, log in, choose a course and pay

1. [Start] Open Memora Learn
2. [Decision] Has an account? Yes → 3, No → 8
3. [Screen] Log in with email and password
4. [Decision] Are the details correct? Yes → 13, No → 5
5. [Screen] "Email or password is wrong" with Forgot password
6. [Decision] Chose Forgot password? Yes → 7, No → 3
7. [Action] Reset link sent by email → 3
8. [Screen] Create account: name, email, password
9. [Decision] Are all fields valid? Yes → 11, No → 10
10. [Screen] Show what to fix next to each field → 8
11. [Action] Verification email sent
12. [Screen] Account verified
13. [Screen] Course catalogue
14. [Screen] Course details with price and outline
15. [Decision] Chose Enrol? Yes → 16, No → 13
16. [Screen] Payment: card, bank transfer or USSD
17. [Decision] Did the payment succeed? Yes → 19, No → 18
18. [Screen] "Payment failed. You have not been charged." with Try again → 16
19. [Screen] Receipt and "Start lesson 1"
20. [End] Course unlocked
`;

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 23 · 6.1 – 6.5
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ux-l23-flows",
    moduleId: "ux-m6-interaction",
    sectionId: SECTION_ID,
    order: 1,
    covers: ["6.1", "6.2", "6.3", "6.4", "6.5"],
    title: "Interaction Design and User Flows",
    subtitle: "Designing how people move through a product, before drawing screens",
    estimatedMinutes: 28,
    intro:
      "Interaction design is about what happens between the screens: what people do, how the product responds, and where they go next. This lesson introduces interaction design and the tool that captures it before any screen exists: the user flow.",

    atoms: [
      {
        id: "a-ux-interaction-design",
        title: "What is interaction design?",
        explain:
          "Interaction design (IxD) designs the conversation between a person and a product: what they can do, how the product responds, and how each step leads to the next. It answers questions such as: what happens when I tap this? What do I see while I wait? What if I make a mistake? How do I know it worked? Its building blocks are goals (what the person wants), actions (tap, type, swipe), feedback (the product's response), states (what something looks like in each situation) and flows (sequences of steps). Good interaction design feels predictable: people can guess what will happen before they act.",
      },
      {
        id: "a-ux-user-task-flows",
        title: "User flows and task flows",
        explain:
          "A user flow shows the path a particular user takes through a product to reach a goal, including the decisions and alternative paths along the way: what happens if they are new, if they forget their password, if payment fails. A task flow is simpler: the single, linear sequence of steps for one task, with no branches (\"Enter amount → Choose recipient → Confirm → Done\"). Start with the task flow for the happy path (everything goes right), then grow it into a user flow by adding the unhappy paths (errors, edge cases, abandonment). Most real design problems live in the unhappy paths.",
        table: {
          caption: "Task flow and user flow for the same goal.",
          headers: ["", "Task flow", "User flow"],
          rows: [
            ["Shape", "A straight line", "Branches and loops"],
            ["Covers", "The happy path only", "Decisions, errors and alternatives"],
            ["Use it to", "Count and simplify steps", "Find every screen and state to design"],
            ["Example", "Amount → Recipient → Confirm → Done", "…plus: insufficient funds? wrong PIN? network failure?"],
          ],
        },
      },
      {
        id: "a-ux-flow-diagrams",
        title: "User flow diagrams and flowchart fundamentals",
        explain:
          "Flow diagrams use standard flowchart shapes: an oval (or rounded box) for the start and end, a rectangle for a screen or step, a diamond for a decision with labelled branches (Yes/No), and arrows for direction. Rules that keep them readable: one clear starting point; every decision has an exit for every answer; every path ends somewhere (success, an exit, or a loop back); arrows flow in one main direction (left to right or top to bottom); and labels are short verbs or screen names. Draw them in FigJam, then use them to list every screen you must design. In this course you also write flows as numbered text, which the lab can check.",
        webLab: {
          task:
            "This login flow only shows the happy path. Rewrite flow.md as a complete user flow, using the notation in the preview: one [Start] as step 1; at least two [Decision] steps, each with both a Yes and a No branch (such as \"Is the number registered?\" and \"Is the code correct?\"); at least two [End] steps (for example logged in, and sent to registration); a retry loop where a wrong code sends the person back to an earlier step; and every step reachable from the start, with every arrow pointing at a step that exists.",
          files: { "index.html": docPage("Complete the login flow", "flow.md", FLOW_RULES), "flow.md": LOGIN_MD },
          readOnly: ["index.html"],
          tests: [
            { label: "Step 1 is the only [Start]", check: FLOW("flow.md") + "return of('start').length === 1 && all[0]?.kind === 'start';", fail: "Begin with \"1. [Start] …\" and have no other start." },
            { label: "At least two decisions, each with Yes and No branches", check: FLOW("flow.md") + "return of('decision').length >= 2 && of('decision').every(branches);", fail: "Each [Decision] ends with \"Yes → N, No → M\"." },
            { label: "At least two end points", check: FLOW("flow.md") + "return of('end').length >= 2;", fail: "Where else can the flow finish, for example when the number is not registered?" },
            { label: "Every arrow points at a real step", check: FLOW("flow.md") + "return all.length > 0 && all.every((s) => nexts(s).every((n) => !!steps[n]));", fail: "An arrow points to a step number that does not exist." },
            { label: "Every step is reachable from the start", check: FLOW("flow.md") + "return all.length >= 6 && all.every((s) => reach.has(s.n));", fail: "Some steps can never be reached. Connect them with arrows." },
            { label: "A retry loop goes back to an earlier step", check: FLOW("flow.md") + "return all.some((s) => nexts(s).some((n) => n < s.n));", fail: "What happens after a wrong code? Send the person back with → N." },
          ],
          solution: { "flow.md": LOGIN_MD_DONE },
          hint: "Ask \"what if not?\" at every step where the product checks something.",
          successMessage: "From four happy steps to a complete flow: every check has two answers, every path ends somewhere, and mistakes lead back instead of nowhere.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 24 · 6.6 – 6.9
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ux-l24-patterns-forms",
    moduleId: "ux-m6-interaction",
    sectionId: SECTION_ID,
    order: 2,
    covers: ["6.6", "6.7", "6.8", "6.9"],
    title: "Patterns, Controls and Forms",
    subtitle: "Reusing proven solutions, and designing forms people can finish",
    estimatedMinutes: 30,
    intro:
      "Most interaction problems have been solved many times before. This lesson covers the common navigation and interaction patterns, the controls every interface is made of, and the most important interaction of all in many products: the form.",

    atoms: [
      {
        id: "a-ux-navigation-patterns",
        title: "Navigation patterns",
        explain:
          "Common navigation patterns: the top navigation bar (websites, up to about seven items); the bottom tab bar (mobile apps, three to five top-level destinations, always visible); the navigation drawer or hamburger menu (hides many items, but hidden items get used less); tabs (switch between views at the same level); breadcrumbs (show location in deep hierarchies); the stepper or progress indicator (sequential tasks such as checkout); and search. Choose by the shape of the site map and the device: a bottom tab bar for a banking app's four main areas, a stepper for a five-step application form.",
        table: {
          caption: "Navigation patterns and where they fit.",
          headers: ["Pattern", "Best for", "Watch out for"],
          rows: [
            ["Bottom tab bar", "3–5 main areas of a mobile app", "More than five items"],
            ["Top navigation bar", "Websites with up to ~7 sections", "Overflow on small screens"],
            ["Hamburger / drawer", "Many secondary destinations", "Hidden items are used less"],
            ["Tabs", "Views at the same level", "Too many tabs to fit"],
            ["Stepper", "Sequential tasks like checkout", "Not showing how many steps remain"],
          ],
        },
      },
      {
        id: "a-ux-interaction-patterns",
        title: "Interaction patterns",
        explain:
          "Interaction patterns are proven solutions to recurring interaction problems: pull to refresh, swipe to delete (with undo), infinite scroll or pagination for long lists, drag and drop to reorder, tap to expand an accordion, a modal dialog for a decision that must be made now, a toast or snackbar for brief confirmation, autocomplete for search and addresses, and progressive disclosure (showing advanced options only when asked). Using known patterns means people already know how to use your product. Pattern libraries such as Material Design's components, Apple's guidelines and ui-patterns.com collect them.",
        decision: {
          scenario: "A designer invents a new gesture: to delete a saved card, users must press and hold with two fingers for three seconds.",
          question: "What would you recommend?",
          options: [
            { id: "a", text: "Use a known pattern instead, such as a visible Remove button or swipe to delete, with a confirmation or undo", why: "Known patterns are discoverable. A hidden two-finger gesture will never be found by most people." },
            { id: "b", text: "Keep it, and add a tutorial explaining it", whyWrong: "If a basic action needs a tutorial, the pattern is wrong." },
            { id: "c", text: "Keep it: unusual gestures feel innovative", whyWrong: "Novelty in basic tasks costs usability." },
            { id: "d", text: "Remove the ability to delete cards", whyWrong: "People need to manage their cards." },
          ],
          correct: "a",
          aftermath: "Innovate where it creates value; use patterns everywhere else.",
        },
      },
      {
        id: "a-ux-buttons-forms",
        title: "Buttons, forms and input fields",
        explain:
          "Buttons should look clickable, use a verb that says what happens (\"Create account\", not \"Submit\"), have one primary button per screen, and be at least 44px tall. Forms should ask only for what is truly needed, with one column, fields in a logical order, and related fields grouped. Every input needs a visible label above it (placeholders disappear when typing), the right input type so phones show the right keyboard (email, tel, number), autocomplete so browsers can fill it, and a helpful hint before errors happen when a format is required. Choose controls by the data: radio buttons for a few exclusive options, checkboxes for multiple choices, a dropdown for long lists, a toggle for an instant on/off setting.",
      },
      {
        id: "a-ux-validation-errors",
        title: "Form validation and error states",
        explain:
          "Validation checks that input is acceptable. Validate at the right moment: when a field is left (on blur) or on submit, not on every keystroke while someone is still typing. An error state must: appear next to the field; say what is wrong and how to fix it in plain words (\"Enter an 11-digit phone number, like 0803 123 4567\", never \"Invalid input\"); not rely on colour alone (add a thicker border, an icon or the word \"Error\"); be connected to the field with aria-describedby so screen readers read it; keep what the person typed; and move focus to the first error on submit.",
        webLab: {
          task:
            "Fix this sign-up form. In index.html: give every field a visible <label> connected with for and id; use type=\"email\" for email and type=\"tel\" for phone; add autocomplete values (name, email and tel); rewrite the phone error message so it says how to fix the problem, including \"11\" and an example number; connect the phone field to its error with aria-describedby; and change the button text to a verb that says what happens. In style.css: style the error state so an invalid field has a 2px red border and the message is red, readable, and starts with a ⚠ marker (so colour is not the only signal). The script (read-only) shows the error when the phone number is not 11 digits.",
          files: { "index.html": SIGNUP_HTML, "style.css": SIGNUP_CSS, "app.js": SIGNUP_JS },
          readOnly: ["app.js"],
          tests: [
            { label: "Every field has a visible, connected label", check: "return ['#name', '#email', '#phone'].every((s) => $(s).labels.length > 0 && visible($(s).labels[0]));", fail: "Add <label for=\"name\">Full name</label> and the same for email and phone." },
            { label: "Email and phone use the right input types", check: "return $('#email').type === 'email' && $('#phone').type === 'tel';", fail: "type=\"email\" and type=\"tel\"." },
            { label: "Autocomplete is set on all three fields", check: "return $('#name').getAttribute('autocomplete') === 'name' && $('#email').getAttribute('autocomplete') === 'email' && $('#phone').getAttribute('autocomplete') === 'tel';", fail: "autocomplete=\"name\", \"email\" and \"tel\"." },
            { label: "The button says what will happen", check: "return /create|sign up|join|register/i.test(text('.btn')) && !/submit/i.test(text('.btn'));", fail: "Try \"Create account\"." },
            { label: "A bad number shows a helpful, connected error", check: "type('#phone', '0803'); await submit('#form'); const e = $('#phone-error'); return visible(e) && /11/.test(text(e)) && /\\d{4}\\s?\\d{3}\\s?\\d{4}/.test(text(e)) && !/invalid input/i.test(text(e)) && $('#phone').getAttribute('aria-describedby') === 'phone-error';", fail: "Message: \"Enter an 11-digit phone number, like 0803 123 4567.\" and aria-describedby=\"phone-error\" on the input." },
            { label: "The error does not rely on colour alone", check: CONTRAST + "type('#phone', '0803'); await submit('#form'); const c = style('#phone', 'border-top-color').match(/\\d+/g).map(Number); return style('#phone', 'border-top-width') === '2px' && c[0] > 150 && c[1] < 90 && ratio('#phone-error') >= 4.5 && /⚠/.test(pseudo('#phone-error', '::before', 'content'));", fail: "input[aria-invalid=\"true\"] { border: 2px solid #b91c1c; } .error { color: #b91c1c; } .error::before { content: \"⚠ \"; }" },
          ],
          solution: { "index.html": SIGNUP_HTML_DONE, "style.css": SIGNUP_CSS_DONE },
          hint: "The message is the design: it should tell the person exactly what to type.",
          successMessage: "A form that helps people get it right: the right keyboard, autofill, a clear verb, and an error that explains itself to everyone.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 25 · 6.10 – 6.15
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ux-l25-feedback-states",
    moduleId: "ux-m6-interaction",
    sectionId: SECTION_ID,
    order: 3,
    covers: ["6.10", "6.11", "6.12", "6.13", "6.14", "6.15"],
    title: "Feedback, States and Microinteractions",
    subtitle: "How a product responds, and how people know what to do",
    estimatedMinutes: 30,
    intro:
      "Every action deserves a response, and every element should show what it does. This lesson covers feedback and the states every component goes through, how to prevent errors and recover from them, affordances and signifiers, feedback loops, and the small moments called microinteractions.",

    atoms: [
      {
        id: "a-ux-feedback-responses",
        title: "Feedback, system responses and feedback loops",
        explain:
          "Feedback tells people that the product received their action and what happened. It should be immediate (under about 0.1 seconds feels instant; after 1 second people need a sign of progress; after about 10 seconds they need a progress indicator and an estimate), visible where they are looking, and proportionate (a small confirmation for a small action, a clear screen for a payment). A feedback loop is the cycle of act, see the result, adjust: a password strength meter that updates as you type, a savings streak that grows daily. Tight loops help people learn and stay motivated; broken loops (no response, or a response long after) make them repeat actions, such as paying twice.",
      },
      {
        id: "a-ux-states",
        title: "Loading, empty and success states",
        explain:
          "Designers often draw only the ideal screen, but every screen has several states. Loading: show progress, ideally with skeleton screens (grey shapes where content will appear) rather than a lone spinner, and say what is happening if it takes long. Empty: when there is nothing yet (no transactions, no courses), explain why and give the next step (\"You have no courses yet. Browse courses\"). Success: confirm clearly what happened and what comes next (\"₦5,000 sent to Tunde. Receipt sent by SMS\"). Also design partial (some content loaded), error and offline states. A developer will build whatever you do not specify, usually worse.",
        table: {
          caption: "The states of a transactions screen.",
          headers: ["State", "What to show"],
          rows: [
            ["Loading", "Skeleton rows where transactions will appear"],
            ["Empty", "\"No transactions yet. Fund your wallet to get started\" with a Fund wallet button"],
            ["Partial", "Recent transactions, with \"Load more\" for older ones"],
            ["Error", "\"We couldn't load your transactions. Check your connection\" with Try again"],
            ["Success", "The list, newest first"],
          ],
        },
      },
      {
        id: "a-ux-error-prevention",
        title: "Error prevention and recovery",
        explain:
          "The best error message is the one never needed. Prevent errors with constraints (disable Pay until the amount is valid, use a date picker instead of free text), good defaults, clear formats and examples, confirmation of the recipient's name before sending money, and confirmation dialogs for destructive actions. When errors happen anyway, help recovery: plain-language messages that say what happened and what to do, keep what the person entered, offer undo for destructive actions (\"Message deleted. Undo\"), and make failures safe (\"Payment failed. You have not been charged\").",
        decision: {
          scenario: "In a transfer flow, people sometimes send money to the wrong account because they mistype one digit.",
          question: "Which design change prevents this error best?",
          options: [
            { id: "a", text: "Look up and show the account holder's name after the number is entered, before the person confirms", why: "People recognise a wrong name instantly. This prevents the error instead of explaining it afterwards." },
            { id: "b", text: "Show a warning: \"Please check the number carefully\"", whyWrong: "Generic warnings are quickly ignored." },
            { id: "c", text: "Add a long terms and conditions page about wrong transfers", whyWrong: "Nobody reads it, and it prevents nothing." },
            { id: "d", text: "Ask people to type the number twice", whyWrong: "Better than nothing, but slower and people copy their own mistake. A name check is more effective." },
          ],
          correct: "a",
          aftermath: "Prevent errors with information and constraints; reserve warnings for what cannot be prevented.",
        },
      },
      {
        id: "a-ux-affordances",
        title: "Affordances and signifiers",
        explain:
          "An affordance is what an object allows you to do: a button affords pressing, a slider affords dragging. A signifier is the visible clue that tells you the affordance exists: a button's raised shape or filled colour, an underlined link, a handle on a slider, a chevron that suggests a row opens. On screens, almost everything is flat glass, so signifiers do all the work. Flat text that is secretly clickable, or a decorative box that looks like a button but is not, both mislead. Signifiers also include hover and focus styles, cursors, and labels.",
      },
      {
        id: "a-ux-microinteractions",
        title: "Microinteractions",
        explain:
          "A microinteraction is a small, contained moment that does one thing: pressing a button, toggling a setting, liking a post, pulling to refresh. Each has a trigger (the tap), rules (what happens), feedback (what you see and hear) and loops or modes (what happens next time). Good microinteractions give instant, subtle feedback: a button darkens on hover, pushes in slightly when pressed, shows a clear focus ring for keyboard users, and looks clearly unavailable when disabled. Animations should be quick (about 100 to 300 milliseconds) and must respect the reduced-motion setting, because motion can make some people feel ill.",
        webLab: {
          task:
            "This Save button looks the same whatever you do to it, and keyboard users cannot even see when it is focused. Design its states in style.css: a hover state with a different background; a pressed (:active) state that pushes it in with a transform; a :focus-visible state with a visible outline at least 2px wide; a :disabled state with a different, clearly muted background and cursor: not-allowed (its text must still pass 4.5:1); a transition between 100ms and 300ms; and a prefers-reduced-motion media query that removes the transition.",
          files: { "index.html": BUTTON_HTML, "style.css": BUTTON_CSS },
          readOnly: ["index.html"],
          tests: [
            { label: "Hover changes the background", check: "const base = style('.btn', 'background-color'); const h = rules(/\\.btn:hover/); return h.length > 0 && h.some((r) => r.style.backgroundColor && r.style.backgroundColor !== base);", fail: ".btn:hover { background: #5b21b6; }" },
            { label: "Pressing pushes the button in", check: "return rules(/\\.btn:active/).some((r) => /scale|translate/.test(r.style.transform || ''));", fail: ".btn:active { transform: scale(0.97); }" },
            { label: "Keyboard focus shows an outline of at least 2px", check: "return rules(/\\.btn:focus-visible/).some((r) => parseFloat(r.style.outlineWidth) >= 2 && r.style.outlineStyle && r.style.outlineStyle !== 'none');", fail: ".btn:focus-visible { outline: 3px solid #1d4ed8; outline-offset: 3px; }" },
            { label: "Disabled looks unavailable and is still readable", check: CONTRAST + "const d = $('.btn:disabled'); return style(d, 'background-color') !== style('.btn:not(:disabled)', 'background-color') && style(d, 'cursor') === 'not-allowed' && contrast(style(d, 'color'), style(d, 'background-color')) >= 4.5;", fail: ".btn:disabled { background: #e5e7eb; color: #4b5563; cursor: not-allowed; }" },
            { label: "A quick transition, 100–300ms", check: "const t = style('.btn:not(:disabled)', 'transition-duration').split(',').map((x) => parseFloat(x) * (/ms/.test(x) ? 1 : 1000)); return t.some((ms) => ms >= 100 && ms <= 300) && t.every((ms) => ms <= 300);", fail: "transition: background-color 150ms ease-out, transform 150ms ease-out;" },
            { label: "Reduced motion removes the transition", check: "return media().some((m) => /prefers-reduced-motion:\\s*reduce/.test(m)) && rules().some((r) => /prefers-reduced-motion/.test(r.media || '') && /\\.btn/.test(r.selector) && /none|0s/.test(r.style.transition || r.style.transitionDuration || ''));", fail: "@media (prefers-reduced-motion: reduce) { .btn { transition: none; } }" },
          ],
          solution: { "style.css": BUTTON_CSS_DONE },
          hint: "Each pseudo-class is a state: :hover, :active, :focus-visible, :disabled.",
          successMessage: "One button, five states, each telling the person something: I respond, I was pressed, you are here, I am unavailable, and I respect your settings.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 26 · 6.16 – 6.21
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ux-l26-laws",
    moduleId: "ux-m6-interaction",
    sectionId: SECTION_ID,
    order: 4,
    covers: ["6.16", "6.17", "6.18", "6.19", "6.20", "6.21"],
    title: "Mental Models, the Laws of UX and Gestalt",
    subtitle: "Psychology that predicts how people use interfaces",
    estimatedMinutes: 32,
    intro:
      "Some aspects of how people use interfaces are predictable enough to have names. This lesson covers mental models, four laws every designer quotes (Jakob's, Fitts's, Hick's and Miller's), and the Gestalt principles of perception, with what each means for your designs.",

    atoms: [
      {
        id: "a-ux-mental-models",
        title: "Understanding mental models",
        explain:
          "A mental model is a person's belief about how something works, built from experience. People expect a shopping cart to keep items until they pay, a trash bin to let them recover deleted files, and a \"Back\" button to return them to the previous screen. When a product matches the mental model, it feels intuitive; when it does not (the cart empties when you leave the page), people make mistakes and feel stupid. Research reveals mental models (card sorts, interviews, watching people); design either matches them or, if it must differ, explains the difference clearly.",
      },
      {
        id: "a-ux-jakobs-law",
        title: "Jakob's Law",
        explain:
          "Jakob's Law (from usability expert Jakob Nielsen) says that users spend most of their time on other products, so they prefer yours to work the same way as the ones they already know. It is why logos sit top left, carts top right, search bars look alike, and checkout follows familiar steps. It does not forbid innovation, but it puts the burden of proof on the new idea: if you change a convention, the benefit must outweigh the cost of everyone relearning it. When redesigning, a gradual change or an option to keep the old version respects existing mental models.",
      },
      {
        id: "a-ux-fitts-law",
        title: "Fitts's Law",
        explain:
          "Fitts's Law says the time to reach a target depends on its distance and its size: closer, bigger targets are faster and easier to hit. In practice: make important and frequent buttons large; place them where the hand or cursor already is (at the bottom of a phone screen where the thumb rests, next to the field just completed); give touch targets at least 44 by 44 points (48 by 48 dp on Android) with space between them; and put destructive actions away from common ones so they are not hit by accident. Screen edges and corners are easy to hit with a mouse because the cursor stops there.",
        webLab: {
          task:
            "On a phone, this transfer screen fights the user's thumb. Apply Fitts's Law in style.css: the Send button must be the biggest target: as wide as the screen's content (at least 90% of the viewport width), at least 48px tall, and placed at the bottom of the screen where the thumb rests; the amount chips must each be at least 44 × 44px with at least 8px between them; and Cancel must be smaller than Send and at least 12px away from it, so it is not hit by accident.",
          files: { "index.html": PAY_HTML, "style.css": PAY_CSS },
          readOnly: ["index.html"],
          tests: [
            { label: "Send is at least 48px tall and nearly full width", viewport: "mobile", check: "const r = rect('.pay'); return r.height >= 48 && r.width >= 0.9 * width();", fail: ".pay { width: 100%; min-height: 56px; }" },
            { label: "Send sits at the bottom of the screen", viewport: "mobile", check: "return window.innerHeight - rect('.pay').bottom <= 32;", fail: "Fix the action bar to the bottom: .bar { position: fixed; left: 0; right: 0; bottom: 0; }" },
            { label: "Each chip is at least 44 × 44px", viewport: "mobile", check: "return $$('.chip').every((c) => rect(c).height >= 44 && rect(c).width >= 44);", fail: ".chip { min-width: 88px; min-height: 44px; }" },
            { label: "At least 8px between chips", viewport: "mobile", check: "const r = $$('.chip').map((c) => rect(c)); return r.slice(1).every((c, i) => c.left - r[i].right >= 8 || c.top - r[i].bottom >= 8);", fail: ".chips { gap: 12px; }" },
            { label: "Cancel is smaller than Send and at least 12px away", viewport: "mobile", check: "const p = rect('.pay'), c = rect('.cancel'); const gap = Math.max(p.top - c.bottom, c.top - p.bottom, p.left - c.right, c.left - p.right); return c.width * c.height < p.width * p.height && gap >= 12;", fail: "Make Cancel a quiet, smaller button with a 12px gap from Send." },
          ],
          solution: { "style.css": PAY_CSS_DONE },
          hint: "A bar fixed to the bottom, stacked as a column, puts Cancel above and Send lowest, right under the thumb.",
          successMessage: "The main action is now big and under the thumb, the chips are easy to hit, and Cancel is safely out of the way.",
        },
      },
      {
        id: "a-ux-hicks-law",
        title: "Hick's Law",
        explain:
          "Hick's Law says the time it takes to make a decision increases with the number and complexity of choices. Every extra option makes choosing slower and abandoning more likely. Reduce choices where you can, break complex tasks into steps, highlight a recommended option, group long lists into categories, and use progressive disclosure to hide advanced options until needed. It does not mean always showing fewer things: a well-organised menu with many items can be faster than many tiny menus. It means removing unnecessary choices and structuring the rest.",
        decision: {
          scenario: "A data plan screen lists 18 plans in one long list. Many users leave without buying.",
          question: "Which change best applies Hick's Law?",
          options: [
            { id: "a", text: "Group plans into Daily, Weekly and Monthly tabs and mark one recommended plan in each", why: "Fewer visible choices at a time, organised the way people think about plans, with a sensible default." },
            { id: "b", text: "Add six more plans so everyone finds a perfect fit", whyWrong: "More options make deciding even slower." },
            { id: "c", text: "Show all 18 plans in a larger font", whyWrong: "Readability improves but the decision is just as hard." },
            { id: "d", text: "Remove all plans but one", whyWrong: "Too few choices fail people with different needs." },
          ],
          correct: "a",
          aftermath: "Organise and reduce choices; guide with a recommended option.",
        },
      },
      {
        id: "a-ux-millers-law",
        title: "Miller's Law",
        explain:
          "Miller's Law comes from psychologist George Miller's finding that people can hold only a limited number of items in working memory (he suggested about seven, later research suggests nearer four). The practical lesson is not \"never show more than seven items\", but \"do not make people remember things\": chunk information into groups (0803 123 4567 is easier than 08031234567), show information where it is needed rather than on a previous screen, and prefer recognition over recall (show recent recipients instead of asking people to remember account numbers).",
        example:
          "Hard to remember:  08031234567   GB29NWBK60161331926819\nChunked:           0803 123 4567 GB29 NWBK 6016 1331 9268 19\n\nRecall:       \"Enter the recipient's account number\"\nRecognition:  \"Recent: Tunde Bakare · GTBank ···6789\"",
      },
      {
        id: "a-ux-gestalt",
        title: "Gestalt principles in interface design",
        explain:
          "Gestalt principles describe how people perceive groups and patterns. Proximity: things close together seem related. Similarity: things that look alike (colour, shape, size) seem to have the same function. Common region: things inside the same boundary, such as a card, seem grouped. Continuity: the eye follows lines and curves, so aligned items read as a sequence. Closure: the mind completes incomplete shapes, which is why simple icons work. Figure and ground: we separate an object from its background, which is how modals stand out over a dimmed page. Use them deliberately: if two things look the same, they should behave the same.",
        table: {
          caption: "Gestalt principles and interface examples.",
          headers: ["Principle", "Interface example"],
          rows: [
            ["Proximity", "A label close to its field"],
            ["Similarity", "All links the same colour; all primary buttons the same style"],
            ["Common region", "A card grouping a product's photo, name and price"],
            ["Continuity", "Steps of a checkout aligned along one line"],
            ["Closure", "An icon drawn with a few strokes"],
            ["Figure / ground", "A modal over a dimmed page"],
          ],
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 27 · 6.P
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ux-l27-flow-practical",
    moduleId: "ux-m6-interaction",
    sectionId: SECTION_ID,
    order: 5,
    covers: ["6.P"],
    title: "Practical: The Complete E-Learning Flow",
    subtitle: "Registration, login, course selection and payment, including everything that can go wrong",
    estimatedMinutes: 34,
    intro:
      "Your module practical designs the full flow for an e-learning platform: from opening the app to starting a paid course. The happy path is easy; the work is in the unhappy paths, which this lesson asks you to find and design.",

    atoms: [
      {
        id: "a-ux-unhappy-paths",
        title: "Designing the unhappy paths",
        explain:
          "For every step, ask what could go wrong and what the person needs then. In registration: fields invalid, email already used, verification email not received. In login: wrong password, forgotten password, account locked. In course selection: course full, price changed, person not ready to buy. In payment: card declined, bank timeout, network lost after paying. Each unhappy path needs a screen or state, a clear message, and a way forward (try again, choose another method, contact support), and money must always be safe: say clearly whether the person was charged.",
        decision: {
          scenario: "During testing, a learner's payment succeeds but their network drops before the confirmation screen loads. They reopen the app and see the course still locked, so they pay again.",
          question: "What should the flow have done?",
          options: [
            { id: "a", text: "Check for a recent successful payment when the app reopens, unlock the course and show the receipt, so they never pay twice", why: "Designing for interrupted flows protects people's money and trust. The confirmation must not depend on one screen loading." },
            { id: "b", text: "Nothing: network problems are the user's fault", whyWrong: "Unreliable networks are normal; the design must handle them." },
            { id: "c", text: "Add a warning on the payment page: \"Do not lose network\"", whyWrong: "People cannot control their network." },
            { id: "d", text: "Refund automatically after a week", whyWrong: "Better than nothing, but the person still paid twice and lost trust." },
          ],
          correct: "a",
          aftermath: "In Nigeria especially, design every flow to survive a dropped connection.",
        },
      },
      {
        id: "a-ux-flow-practical-lab",
        title: "Write the complete flow",
        explain:
          "Write the whole flow in the notation you used in Lesson 23. Start from the happy path, then add a decision wherever the product checks something, and give every \"No\" a screen and a way forward. When you finish, every [Screen] step is a screen or state you must design in Module 8.",
        webLab: {
          task:
            "Expand flow.md into the complete flow for Memora Learn: register or log in, choose a course, pay, and start learning. It must have one [Start] as step 1; at least 12 steps; at least four [Decision] steps, each with Yes and No branches, including one about having an account, one about the login details, and one about whether the payment succeeded; a failed-payment screen that says whether the person was charged and loops back to try again; at least one [End]; and every step reachable, with every arrow pointing at a real step.",
          files: { "index.html": docPage("The complete e-learning flow", "flow.md", FLOW_RULES), "flow.md": ELEARN_MD },
          readOnly: ["index.html"],
          tests: [
            { label: "Step 1 is the only [Start], and there are at least 12 steps", check: FLOW("flow.md") + "return of('start').length === 1 && all[0]?.kind === 'start' && all.length >= 12;", fail: "Begin with \"1. [Start] …\" and cover the whole journey." },
            { label: "At least four decisions, each with Yes and No", check: FLOW("flow.md") + "return of('decision').length >= 4 && of('decision').every(branches);", fail: "Add a decision wherever the product checks something." },
            { label: "Decisions about the account, the login and the payment", check: FLOW("flow.md") + "const d = of('decision').map((s) => s.text.toLowerCase()); return d.some((t) => /account/.test(t)) && d.some((t) => /password|details|log ?in|code/.test(t)) && d.some((t) => /pay/.test(t));", fail: "Include: has an account? are the details correct? did the payment succeed?" },
            { label: "Failed payment says whether they were charged, and loops back", check: FLOW("flow.md") + "return all.some((s) => /fail/i.test(s.text) && /charg/i.test(s.text) && nexts(s).some((n) => n < s.n));", fail: "A screen such as \"Payment failed. You have not been charged.\" with Try again → the payment step." },
            { label: "Every step reachable, every arrow valid, at least one end", check: FLOW("flow.md") + "return of('end').length >= 1 && all.every((s) => reach.has(s.n) && nexts(s).every((n) => !!steps[n]));", fail: "Connect every step, and check each → N points at a real step." },
          ],
          solution: { "flow.md": ELEARN_MD_DONE },
          hint: "Write the happy path first (about eight steps), then go back and ask \"what if not?\" at every check.",
          successMessage: "A complete flow with every unhappy path handled. Count the [Screen] steps: that is your screen list for Module 8.",
        },
      },
    ],

    task: {
      title: "Module 6 practical: the complete e-learning user flow",
      intro: "Design the flow in FigJam using standard flowchart shapes.",
      prompts: [
        "Draw the task flow (happy path only) for registration, login, course selection and payment, and count its steps.",
        "Expand it into a full user flow with decisions for every check: account exists, details valid, email verified, course available, payment succeeded.",
        "Design every unhappy path: what the person sees, what it says, and how they move forward. Make sure money is always safe.",
        "Mark where each law applies: Fitts's (main actions), Hick's (course choice), Miller's (what people must remember), Jakob's (conventions you follow).",
        "List every screen and state the flow needs; this list is your starting point for Figma in Modules 7 and 8.",
      ],
      closing: "Phase 3 begins: Module 7 introduces Figma, where these flows become screens.",
    },

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
