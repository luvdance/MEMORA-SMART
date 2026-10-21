/**
 * REACT DEVELOPMENT · MODULE 5 · FORMS, VALIDATION AND USER INPUT
 *
 * Curriculum 5.1 – 5.P. Controlled inputs of every kind, multiple fields,
 * submission, validation rules and field-level errors, email and password
 * rules, duplicate submissions, loading, success and failure, accessibility,
 * reusable fields and schema validation with Zod (bundled in the lab
 * runtime). Requests go to the lab's declared mock API.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

import { reactLab } from "./rx-helpers.js";

export const SECTION_ID = "rx-s5-forms";
const MODULE = "rx-m5-forms";

const FORM_CSS = `:root { font-family: system-ui, Arial, sans-serif; color: #1f2937; }
body { margin: 0; padding: 16px; }
label { display: block; margin-top: 12px; font-weight: 600; }
input, select, textarea { font: inherit; padding: 8px; min-height: 44px; box-sizing: border-box; }
button { min-height: 44px; padding: 8px 14px; font: inherit; margin-top: 12px; }
.error { color: #b91c1c; margin: 4px 0 0; }
`;

const lab = (spec) => reactLab({ css: FORM_CSS, ...spec });

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 30 · 5.1 – 5.3
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "rx-l30-inputs",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 1,
    covers: ["5.1", "5.2", "5.3"],
    title: "Controlled Inputs of Every Kind",
    subtitle: "Text inputs and text areas, selects, checkboxes and radios, and many fields at once",
    estimatedMinutes: 35,
    intro: "Every form control can be controlled by React state. They differ only in which property holds the value and which event reports a change.",

    atoms: [
      {
        id: "a-rx-text-inputs",
        title: "Controlled inputs and text areas",
        explain:
          "A text input or <textarea> is controlled with value={state} and onChange={(e) => setState(e.target.value)}. In React, <textarea> takes a value prop, not children. Because state holds the text, you can do things with it on every keystroke: count characters, enforce a limit, trim, or transform it (e.target.value.toUpperCase()). Give every control a label, and use maxLength or your own check for limits.",
        webLab: lab({
          task:
            "Make the bio a controlled <textarea> (state starting at \"\"). Under it, <p className=\"counter\"> shows \"N / 160\". Above 160 characters, the counter gets the class \"counter over\" and the Save button is disabled.",
          files: {
            "src/App.jsx": `export default function App() {
  return (
    <form>
      <label htmlFor="bio">Bio</label>
      <textarea id="bio" rows={4} />
      <p className="counter">0 / 160</p>
      <button>Save</button>
    </form>
  );
}
`,
          },
          tests: [
            { label: "The counter follows the text", check: "await type('#bio', 'I build React apps.'); return text('.counter') === '19 / 160' && !$('button').disabled;", fail: "value={bio} onChange={(e) => setBio(e.target.value)} and {bio.length} / 160." },
            { label: "Over 160 characters: warning class and Save disabled", check: "await type('#bio', 'x'.repeat(161)); return $('.counter').className === 'counter over' && $('button').disabled && text('.counter') === '161 / 160';", fail: "const over = bio.length > 160;" },
            { label: "The textarea is controlled", check: "return /<textarea[^>]*value=\\{/.test(code('src/App.jsx'));", fail: "Give the textarea value={bio}." },
          ],
          solution: {
            "src/App.jsx": `import { useState } from "react";

export default function App() {
  const [bio, setBio] = useState("");
  const over = bio.length > 160;

  return (
    <form>
      <label htmlFor="bio">Bio</label>
      <textarea id="bio" rows={4} value={bio} onChange={(e) => setBio(e.target.value)} />
      <p className={over ? "counter over" : "counter"}>{bio.length} / 160</p>
      <button disabled={over}>Save</button>
    </form>
  );
}
`,
          },
          hint: "Everything about the counter is derived from bio.",
          successMessage: "One piece of state; the counter, the warning and the button all follow it.",
        }),
      },
      {
        id: "a-rx-select-check-radio",
        title: "Select boxes, checkboxes and radio buttons",
        explain:
          "<select value={level} onChange={(e) => setLevel(e.target.value)}> with <option value=\"…\"> children; the value prop on the select chooses the option (no selected attribute needed). A CHECKBOX uses checked, not value: checked={agree} onChange={(e) => setAgree(e.target.checked)}. RADIO buttons in a group share a name; each is checked={plan === \"monthly\"} with onChange={() => setPlan(\"monthly\")}. Group radios in a <fieldset> with a <legend> so screen readers announce the question.",
        webLab: lab({
          task:
            "Control all three. The level <select> (Beginner, Intermediate, Advanced) starts at Intermediate. The plan radios (Monthly, Yearly) start at Monthly. The \"Send me updates\" checkbox starts unticked. Under the form, <p className=\"summary\"> shows \"LEVEL · PLAN · updates on\" (or \"updates off\").",
          files: {
            "src/App.jsx": `export default function App() {
  return (
    <form>
      <label htmlFor="level">Level</label>
      <select id="level">
        <option value="Beginner">Beginner</option>
        <option value="Intermediate">Intermediate</option>
        <option value="Advanced">Advanced</option>
      </select>

      <fieldset>
        <legend>Plan</legend>
        <label><input type="radio" name="plan" value="Monthly" /> Monthly</label>
        <label><input type="radio" name="plan" value="Yearly" /> Yearly</label>
      </fieldset>

      <label><input type="checkbox" /> Send me updates</label>
      <p className="summary"></p>
    </form>
  );
}
`,
          },
          tests: [
            { label: "Starts at Intermediate · Monthly · updates off", check: "return $('#level').value === 'Intermediate' && text('.summary') === 'Intermediate · Monthly · updates off' && $$('input[type=radio]')[0].checked;", fail: "useState(\"Intermediate\"), useState(\"Monthly\"), useState(false)." },
            { label: "Changing the select updates the summary", check: "await type('#level', 'Advanced'); return text('.summary').startsWith('Advanced ·');", fail: "value={level} onChange={(e) => setLevel(e.target.value)}" },
            { label: "Radios and checkbox update it too", check: "await click($$('input[type=radio]')[1]); await click('input[type=checkbox]'); return text('.summary') === 'Advanced · Yearly · updates on' && $$('input[type=radio]')[1].checked && !$$('input[type=radio]')[0].checked;", fail: "checked={plan === \"Yearly\"} and checked={updates} with e.target.checked." },
          ],
          solution: {
            "src/App.jsx": `import { useState } from "react";

export default function App() {
  const [level, setLevel] = useState("Intermediate");
  const [plan, setPlan] = useState("Monthly");
  const [updates, setUpdates] = useState(false);

  return (
    <form>
      <label htmlFor="level">Level</label>
      <select id="level" value={level} onChange={(e) => setLevel(e.target.value)}>
        <option value="Beginner">Beginner</option>
        <option value="Intermediate">Intermediate</option>
        <option value="Advanced">Advanced</option>
      </select>

      <fieldset>
        <legend>Plan</legend>
        {["Monthly", "Yearly"].map((p) => (
          <label key={p}>
            <input type="radio" name="plan" value={p} checked={plan === p} onChange={() => setPlan(p)} /> {p}
          </label>
        ))}
      </fieldset>

      <label>
        <input type="checkbox" checked={updates} onChange={(e) => setUpdates(e.target.checked)} /> Send me updates
      </label>
      <p className="summary">
        {level} · {plan} · updates {updates ? "on" : "off"}
      </p>
    </form>
  );
}
`,
          },
          hint: "Checkboxes report e.target.checked; radios are checked when their value matches state.",
          successMessage: "Three kinds of control, all driven by state.",
        }),
      },
      {
        id: "a-rx-multiple-fields",
        title: "Managing multiple fields",
        explain:
          "For a form with many text fields, keep ONE state object and ONE change handler that uses each input's name: function handleChange(e) { const { name, value } = e.target; setForm({ ...form, [name]: value }); }. The square brackets are a COMPUTED property name: [name] means \"the key whose name is in the variable name\". Every input then needs a name matching a key of the object. Spread first, so the other fields are kept.",
        webLab: lab({
          task:
            "Replace the three separate state variables and handlers with ONE form object ({ firstName, lastName, city }) and ONE handleChange that uses e.target.name. Give each input a matching name. The greeting must still update as you type.",
          files: {
            "src/App.jsx": `import { useState } from "react";

export default function App() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [city, setCity] = useState("");

  return (
    <form>
      <label htmlFor="firstName">First name</label>
      <input id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
      <label htmlFor="lastName">Last name</label>
      <input id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} />
      <label htmlFor="city">City</label>
      <input id="city" value={city} onChange={(e) => setCity(e.target.value)} />
      <p className="greeting">
        Hello {firstName} {lastName} from {city}
      </p>
    </form>
  );
}
`,
          },
          tests: [
            { label: "All three fields still update the greeting", check: "await type('#firstName', 'Ada'); await type('#lastName', 'Obi'); await type('#city', 'Enugu'); return text('.greeting') === 'Hello Ada Obi from Enugu';", fail: "setForm({ ...form, [name]: value }) keeps the other fields." },
            { label: "One state object and one handler", check: "const c = code('src/App.jsx'); return (c.match(/useState\\(/g) || []).length === 1 && /\\[\\s*name\\s*\\]\\s*:/.test(c) && (c.match(/onChange=\\{\\s*handleChange\\s*\\}/g) || []).length === 3;", fail: "One useState({ … }) and onChange={handleChange} on every input." },
            { label: "Each input has a matching name", check: "return ['firstName', 'lastName', 'city'].every((n) => $('#' + n).name === n);", fail: "name=\"firstName\" and so on." },
          ],
          solution: {
            "src/App.jsx": `import { useState } from "react";

export default function App() {
  const [form, setForm] = useState({ firstName: "", lastName: "", city: "" });

  function handleChange(e) {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  }

  return (
    <form>
      <label htmlFor="firstName">First name</label>
      <input id="firstName" name="firstName" value={form.firstName} onChange={handleChange} />
      <label htmlFor="lastName">Last name</label>
      <input id="lastName" name="lastName" value={form.lastName} onChange={handleChange} />
      <label htmlFor="city">City</label>
      <input id="city" name="city" value={form.city} onChange={handleChange} />
      <p className="greeting">
        Hello {form.firstName} {form.lastName} from {form.city}
      </p>
    </form>
  );
}
`,
          },
          hint: "{ ...form, [name]: value } copies the form and replaces one key.",
          successMessage: "Ten fields or three, it is still one object and one handler.",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 31 · 5.4 – 5.6
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "rx-l31-validation",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 2,
    covers: ["5.4", "5.5", "5.6"],
    title: "Submitting and Validating",
    subtitle: "Handling submission, validation rules, and errors shown beside each field",
    estimatedMinutes: 40,
    intro: "A form is only as good as what it does with bad input. Validation catches mistakes before they reach the server, and good error messages tell people how to fix them.",

    atoms: [
      {
        id: "a-rx-form-submit",
        title: "Handling form submission",
        explain:
          "Put onSubmit on the <form>; call e.preventDefault(); read the values from state (they are already there, because the inputs are controlled); validate; then act: add to a list, send to a server, navigate. After success, usually reset the form by setting the state back to its initial object. A <button> inside a form submits it unless it has type=\"button\", so give secondary buttons (Cancel, Show password) type=\"button\".",
        webLab: lab({
          task:
            "On submit (no page reload), add the comment to the list below as an <li> showing \"NAME: MESSAGE\", then clear both fields. The \"Clear\" button must clear the fields WITHOUT submitting.",
          files: {
            "src/App.jsx": `import { useState } from "react";

const EMPTY = { name: "", message: "" };

export default function App() {
  const [form, setForm] = useState(EMPTY);
  const [comments, setComments] = useState([]);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  return (
    <>
      <form>
        <label htmlFor="name">Name</label>
        <input id="name" name="name" value={form.name} onChange={change} />
        <label htmlFor="message">Message</label>
        <input id="message" name="message" value={form.message} onChange={change} />
        <button>Post</button>
        <button>Clear</button>
      </form>
      <ul className="comments"></ul>
    </>
  );
}
`,
          },
          tests: [
            { label: "Posting adds the comment and clears the form", check: "await type('#name', 'Ada'); await type('#message', 'Great lesson'); await submit('form'); return $$('.comments li').map((li) => text(li)).join() === 'Ada: Great lesson' && $('#name').value === '' && submissions().length === 0;", fail: "onSubmit: preventDefault, add { ...form, id } to comments, setForm(EMPTY)." },
            { label: "Clear empties the fields without posting", check: "await type('#name', 'Tunde'); await click($$('button').find((b) => text(b) === 'Clear')); return $('#name').value === '' && $$('.comments li').length === 1;", fail: "type=\"button\" onClick={() => setForm(EMPTY)} on Clear." },
          ],
          solution: {
            "src/App.jsx": `import { useState } from "react";

const EMPTY = { name: "", message: "" };

export default function App() {
  const [form, setForm] = useState(EMPTY);
  const [comments, setComments] = useState([]);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  function handleSubmit(e) {
    e.preventDefault();
    setComments([...comments, { ...form, id: Date.now() }]);
    setForm(EMPTY);
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Name</label>
        <input id="name" name="name" value={form.name} onChange={change} />
        <label htmlFor="message">Message</label>
        <input id="message" name="message" value={form.message} onChange={change} />
        <button>Post</button>
        <button type="button" onClick={() => setForm(EMPTY)}>
          Clear
        </button>
      </form>
      <ul className="comments">
        {comments.map((c) => (
          <li key={c.id}>
            {c.name}: {c.message}
          </li>
        ))}
      </ul>
    </>
  );
}
`,
          },
          hint: "Without type=\"button\", Clear is a submit button too.",
          successMessage: "Submit, act, reset, and secondary buttons that do not submit.",
        }),
      },
      {
        id: "a-rx-validation-rules",
        title: "Required fields and custom validation rules",
        explain:
          "Write validation as a PURE FUNCTION that takes the form values and returns an errors object: { name: \"Enter your name\", age: \"You must be 16 or older\" }, with no key for a valid field. It is easy to test and to reuse on the server. On submit: const errors = validate(form); if (Object.keys(errors).length > 0) show them and stop; otherwise continue. HTML attributes such as required and min still help (mobile keyboards, quick hints), but your function is the source of truth, and the server must validate again, because anyone can bypass a browser.",
        webLab: lab({
          task:
            "Write validate(values) in validate.js. Rules: name is required (after trimming) with the message \"Enter your name\"; age must be a number from 16 to 99, else \"Age must be between 16 and 99\". Return an object with a key only for invalid fields. App.jsx already uses it to show the errors as a list on submit.",
          files: {
            "src/validate.js": `export function validate(values) {
  const errors = {};
  // your rules here
  return errors;
}
`,
            "src/App.jsx": `import { useState } from "react";
import { validate } from "./validate.js";

export default function App() {
  const [form, setForm] = useState({ name: "", age: "" });
  const [errors, setErrors] = useState({});
  const [saved, setSaved] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    const found = validate(form);
    setErrors(found);
    setSaved(Object.keys(found).length === 0);
  }

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  return (
    <form onSubmit={handleSubmit} noValidate>
      <label htmlFor="name">Name</label>
      <input id="name" name="name" value={form.name} onChange={change} />
      <label htmlFor="age">Age</label>
      <input id="age" name="age" type="number" value={form.age} onChange={change} />
      <button>Save</button>
      <ul className="errors">
        {Object.entries(errors).map(([field, message]) => (
          <li key={field} data-field={field}>
            {message}
          </li>
        ))}
      </ul>
      {saved && <p className="ok">Saved</p>}
    </form>
  );
}
`,
          },
          readOnly: ["src/App.jsx"],
          tests: [
            { label: "Empty form: both errors", check: "await submit('form'); return $$('.errors li').map((li) => li.dataset.field + '=' + text(li)).join('|') === 'name=Enter your name|age=Age must be between 16 and 99';", fail: "Check value.trim() for the name; Number(age) for the age." },
            { label: "Whitespace is not a name; 12 is too young", check: "await type('#name', '   '); await type('#age', '12'); await submit('form'); return $$('.errors li').length === 2;", fail: "Trim the name; check age >= 16." },
            { label: "Valid values: no errors", check: "await type('#name', 'Ada'); await type('#age', '17'); await submit('form'); return $$('.errors li').length === 0 && !!$('.ok');", fail: "Return {} when every rule passes." },
            { label: "100 is too old", check: "await type('#age', '100'); await submit('form'); return $$('.errors li').map((li) => li.dataset.field).join() === 'age';", fail: "Check age <= 99." },
          ],
          solution: {
            "src/validate.js": `export function validate(values) {
  const errors = {};
  if (!values.name.trim()) errors.name = "Enter your name";
  const age = Number(values.age);
  if (values.age === "" || Number.isNaN(age) || age < 16 || age > 99) {
    errors.age = "Age must be between 16 and 99";
  }
  return errors;
}
`,
          },
          hint: "Number(\"\") is 0, so check for an empty string explicitly.",
          successMessage: "A pure function: values in, errors out. Module 13 tests it in one line.",
        }),
      },
      {
        id: "a-rx-field-errors",
        title: "Displaying field-level error messages",
        explain:
          "Show each error next to its field, not only in a list at the top. Connect it for assistive technology: the input gets aria-invalid=\"true\" and aria-describedby=\"email-error\", and the message has id=\"email-error\", so a screen reader reads the error when the field is focused. Timing matters: errors that appear while someone is still typing their first character are hostile. Common rule: validate on submit, and after the first submit (or after a field loses focus, onBlur) re-validate as they type, so errors disappear the moment they are fixed.",
        webLab: lab({
          task:
            "Show errors beside their fields. After a submit, each invalid field gets aria-invalid=\"true\" and aria-describedby pointing at a <p className=\"error\" id=\"FIELD-error\"> under it. Once the form has been submitted once, errors update as the user types (so fixing a field removes its error immediately). Before the first submit, typing shows no errors.",
          files: {
            "src/App.jsx": `import { useState } from "react";

function validate(v) {
  const e = {};
  if (!v.email.includes("@")) e.email = "Enter an email address with an @";
  if (v.phone.replace(/\\D/g, "").length < 11) e.phone = "Enter an 11-digit phone number";
  return e;
}

export default function App() {
  const [form, setForm] = useState({ email: "", phone: "" });

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  return (
    <form noValidate>
      <label htmlFor="email">Email</label>
      <input id="email" name="email" value={form.email} onChange={change} />
      <label htmlFor="phone">Phone</label>
      <input id="phone" name="phone" value={form.phone} onChange={change} />
      <button>Continue</button>
    </form>
  );
}
`,
          },
          tests: [
            { label: "No errors while typing before the first submit", check: "await type('#email', 'a'); return !$('.error') && !$('#email').hasAttribute('aria-invalid');", fail: "Only show errors once submitted is true." },
            { label: "Submit shows each error under its field, connected", check: "await submit('form'); const i = $('#email'); return i.getAttribute('aria-invalid') === 'true' && i.getAttribute('aria-describedby') === 'email-error' && text('#email-error') === 'Enter an email address with an @' && text('#phone-error') === 'Enter an 11-digit phone number';", fail: "aria-invalid, aria-describedby=\"email-error\" and <p id=\"email-error\" className=\"error\">." },
            { label: "Fixing a field removes its error as you type", check: "await type('#email', 'ada@example.com'); return !$('#email-error') && $('#email').getAttribute('aria-invalid') !== 'true' && !!$('#phone-error');", fail: "Calculate errors from the current values on every render once submitted." },
          ],
          solution: {
            "src/App.jsx": `import { useState } from "react";

function validate(v) {
  const e = {};
  if (!v.email.includes("@")) e.email = "Enter an email address with an @";
  if (v.phone.replace(/\\D/g, "").length < 11) e.phone = "Enter an 11-digit phone number";
  return e;
}

export default function App() {
  const [form, setForm] = useState({ email: "", phone: "" });
  const [submitted, setSubmitted] = useState(false);
  const errors = submitted ? validate(form) : {};

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  function handleSubmit(e) {
    e.preventDefault();
    setSubmitted(true);
  }

  const field = (name, label) => (
    <>
      <label htmlFor={name}>{label}</label>
      <input
        id={name}
        name={name}
        value={form[name]}
        onChange={change}
        aria-invalid={errors[name] ? "true" : undefined}
        aria-describedby={errors[name] ? name + "-error" : undefined}
      />
      {errors[name] && (
        <p className="error" id={name + "-error"}>
          {errors[name]}
        </p>
      )}
    </>
  );

  return (
    <form noValidate onSubmit={handleSubmit}>
      {field("email", "Email")}
      {field("phone", "Phone")}
      <button>Continue</button>
    </form>
  );
}
`,
          },
          hint: "Derive errors: const errors = submitted ? validate(form) : {};",
          successMessage: "Errors where they belong, announced to everyone, and gone the moment they are fixed.",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 32 · 5.7 – 5.9
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "rx-l32-submitting",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 3,
    covers: ["5.7", "5.8", "5.9"],
    title: "Account Fields and Sending Forms",
    subtitle: "Email, password and confirmation rules, duplicate submissions, and request states",
    estimatedMinutes: 40,
    intro: "Sign-up forms are where validation and network requests meet: rules users understand, one request per click, and honest feedback about what happened.",

    atoms: [
      {
        id: "a-rx-account-fields",
        title: "Validating email, password and confirmation fields",
        explain:
          "EMAIL: use type=\"email\" for the keyboard, and a simple check such as /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/; perfect email regexes do not exist, and only sending a confirmation email proves an address works. PASSWORD: length matters most (at least 8, ideally 12+); say the rules up front, not after failure; allow paste and password managers; offer a Show password toggle (a type=\"button\" that switches type between password and text). CONFIRMATION: compare with the first field, and report it on the confirmation field (\"Passwords do not match\").",
        webLab: lab({
          task:
            "Write validateAccount in rules.js: email must match the simple pattern (message \"Enter a valid email\"); password needs at least 8 characters and at least one number (\"Use 8 or more characters with a number\"); confirm must equal password (\"Passwords do not match\"). Then make the Show button toggle the password field between type password and text, without submitting.",
          files: {
            "src/rules.js": `export function validateAccount({ email, password, confirm }) {
  const errors = {};
  return errors;
}
`,
            "src/App.jsx": `import { useState } from "react";
import { validateAccount } from "./rules.js";

export default function App() {
  const [form, setForm] = useState({ email: "", password: "", confirm: "" });
  const [errors, setErrors] = useState(null);
  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  function handleSubmit(e) {
    e.preventDefault();
    setErrors(validateAccount(form));
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <label htmlFor="email">Email</label>
      <input id="email" name="email" type="email" value={form.email} onChange={change} />
      <label htmlFor="password">Password</label>
      <input id="password" name="password" type="password" value={form.password} onChange={change} />
      <button>Show</button>
      <label htmlFor="confirm">Confirm password</label>
      <input id="confirm" name="confirm" type="password" value={form.confirm} onChange={change} />
      <button>Create account</button>
      {errors && (
        <ul className="errors">
          {Object.entries(errors).map(([k, m]) => (
            <li key={k} data-field={k}>{m}</li>
          ))}
        </ul>
      )}
    </form>
  );
}
`,
          },
          tests: [
            { label: "Bad values give all three errors", check: "await type('#email', 'ada@'); await type('#password', 'secret'); await type('#confirm', 'secrets'); await submit('form'); return $$('.errors li').map((li) => li.dataset.field + '=' + text(li)).join('|') === 'email=Enter a valid email|password=Use 8 or more characters with a number|confirm=Passwords do not match';", fail: "Three rules, three keys." },
            { label: "A password without a number is rejected", check: "await type('#email', 'ada@example.com'); await type('#password', 'longpassword'); await type('#confirm', 'longpassword'); await submit('form'); return $$('.errors li').map((li) => li.dataset.field).join() === 'password';", fail: "/\\d/.test(password)" },
            { label: "Good values: no errors", check: "await type('#password', 'react2026!'); await type('#confirm', 'react2026!'); await submit('form'); return $$('.errors li').length === 0;", fail: "Return {} when all pass." },
            { label: "Show toggles the password field without submitting", check: "const show = $$('button').find((b) => text(b) === 'Show' || text(b) === 'Hide'); await click(show); const t1 = $('#password').type; await click(show); return t1 === 'text' && $('#password').type === 'password' && submissions().length === 0;", fail: "type=\"button\" and state that switches the input's type." },
          ],
          solution: {
            "src/rules.js": `const EMAIL = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;

export function validateAccount({ email, password, confirm }) {
  const errors = {};
  if (!EMAIL.test(email)) errors.email = "Enter a valid email";
  if (password.length < 8 || !/\\d/.test(password)) errors.password = "Use 8 or more characters with a number";
  if (confirm !== password) errors.confirm = "Passwords do not match";
  return errors;
}
`,
            "src/App.jsx": `import { useState } from "react";
import { validateAccount } from "./rules.js";

export default function App() {
  const [form, setForm] = useState({ email: "", password: "", confirm: "" });
  const [errors, setErrors] = useState(null);
  const [show, setShow] = useState(false);
  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  function handleSubmit(e) {
    e.preventDefault();
    setErrors(validateAccount(form));
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <label htmlFor="email">Email</label>
      <input id="email" name="email" type="email" value={form.email} onChange={change} />
      <label htmlFor="password">Password</label>
      <input id="password" name="password" type={show ? "text" : "password"} value={form.password} onChange={change} />
      <button type="button" onClick={() => setShow(!show)}>
        {show ? "Hide" : "Show"}
      </button>
      <label htmlFor="confirm">Confirm password</label>
      <input id="confirm" name="confirm" type="password" value={form.confirm} onChange={change} />
      <button>Create account</button>
      {errors && (
        <ul className="errors">
          {Object.entries(errors).map(([k, m]) => (
            <li key={k} data-field={k}>{m}</li>
          ))}
        </ul>
      )}
    </form>
  );
}
`,
          },
          hint: "The Show button needs type=\"button\" or it submits the form.",
          successMessage: "Rules people can meet, a matching check, and a password field people can actually read.",
        }),
      },
      {
        id: "a-rx-duplicate-submit",
        title: "Preventing duplicate submissions",
        explain:
          "Slow networks make people click twice, and a double click can create two accounts or charge a card twice. Keep a submitting flag in state: set it true before the request, disable the submit button while it is true (and change its text to \"Sending…\"), and set it back in finally. That is not quite enough: two submits in the same instant (a fast double click, or Enter pressed twice) both run before React re-renders, so both see submitting as false, the snapshot from Module 4. Guard the handler with a REF as well: const busy = useRef(false) holds a value that changes immediately, outside rendering (Module 6 covers refs fully). if (busy.current) return; busy.current = true; and reset it in finally. The server should still treat repeats safely (idempotency), but the UI is the first defence.",
        webLab: lab({
          task:
            "Clicking Subscribe twice quickly sends two requests. Guard the handler with a ref (useRef(false)) so a second submit in the same instant is ignored, and add a submitting state that disables the button and shows \"Sending…\" during the request. Reset both in finally. The request is already written: POST /api/subscribe.",
          files: {
            "src/App.jsx": `import { useState } from "react";

export default function App() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    await fetch("/api/subscribe", { method: "POST", body: JSON.stringify({ email }) });
    setDone(true);
  }

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="email">Email</label>
      <input id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <button>Subscribe</button>
      {done && <p role="status">Subscribed</p>}
    </form>
  );
}
`,
          },
          mocks: [{ match: "/api/subscribe", method: "POST", status: 201, body: { ok: true }, delay: 300 }],
          tests: [
            { label: "A double submit sends only one request", check: "await type('#email', 'ada@example.com'); $('form').requestSubmit(); $('form').requestSubmit(); await tick(); return fetchCalls().length === 1;", fail: "const busy = useRef(false); if (busy.current) return; busy.current = true;" },
            { label: "The button is disabled and says Sending… meanwhile", check: "return $('button').disabled && text('button') === 'Sending…';", fail: "disabled={submitting} and {submitting ? \"Sending…\" : \"Subscribe\"}" },
            { label: "It re-enables when the request finishes", check: "await waitFor(() => !!$('[role=status]')); return !$('button').disabled && text('button') === 'Subscribe';", fail: "setSubmitting(false) in finally." },
          ],
          solution: {
            "src/App.jsx": `import { useRef, useState } from "react";

export default function App() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const busy = useRef(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (busy.current) return;
    busy.current = true;
    setSubmitting(true);
    try {
      await fetch("/api/subscribe", { method: "POST", body: JSON.stringify({ email }) });
      setDone(true);
    } finally {
      busy.current = false;
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="email">Email</label>
      <input id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <button disabled={submitting}>{submitting ? "Sending…" : "Subscribe"}</button>
      {done && <p role="status">Subscribed</p>}
    </form>
  );
}
`,
          },
          hint: "Two submits in the same moment both see the old state snapshot. A ref's .current changes at once, so it stops the second; the disabled button stops later clicks.",
          successMessage: "One click, one request, however impatient the user.",
        }),
      },
      {
        id: "a-rx-request-states",
        title: "Loading, success and failure states",
        explain:
          "A form that sends data is in one of four states: idle, submitting, success or error. Model it as ONE status value (\"idle\" | \"submitting\" | \"success\" | \"error\") rather than several booleans that could contradict each other (isLoading and isSuccess both true). Check response.ok, because fetch does not reject on a 400 or 500. On error, keep what the user typed and say what to do (\"Could not send. Check your connection and try again.\"); on success, confirm clearly in a role=\"status\" region.",
        webLab: lab({
          task:
            "Send the message with fetch POST /api/messages and track ONE status value. While sending, the button is disabled. On success, show <p role=\"status\">Message sent</p> and clear the textarea. On failure (a non-ok response), show <p role=\"alert\">Could not send. Try again.</p> and KEEP the text.",
          files: {
            "src/App.jsx": `import { useState } from "react";

export default function App() {
  const [message, setMessage] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
  }

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="message">Message</label>
      <textarea id="message" value={message} onChange={(e) => setMessage(e.target.value)} />
      <button>Send</button>
    </form>
  );
}
`,
          },
          mocks: [{ match: "/api/messages", method: "POST", status: 201, body: { id: 1 }, delay: 150 }],
          tests: [
            { label: "Sending: button disabled", check: "await type('#message', 'Hello'); await submit('form'); return $('button').disabled && fetchCalls().some((c) => c.method === 'POST' && c.url.includes('/api/messages'));", fail: "setStatus(\"submitting\") and disabled={status === \"submitting\"}." },
            { label: "Success: confirmation and cleared text", check: "await waitFor(() => !!$('[role=status]')); return text('[role=status]') === 'Message sent' && $('#message').value === '' && !$('button').disabled;", fail: "On res.ok: setStatus(\"success\") and setMessage(\"\")." },
            { label: "Failure: an alert, and the text is kept", mocks: [{ match: "/api/messages", method: "POST", status: 500, body: { error: "down" }, delay: 60 }], check: "await type('#message', 'Keep me'); await submit('form'); await waitFor(() => !!$('[role=alert]')); return text('[role=alert]') === 'Could not send. Try again.' && $('#message').value === 'Keep me' && !$('[role=status]');", fail: "if (!res.ok) throw …; catch: setStatus(\"error\")." },
            { label: "One status value, not several booleans", check: "return /useState\\(\\s*[\"']idle[\"']\\s*\\)/.test(code('src/App.jsx'));", fail: "const [status, setStatus] = useState(\"idle\");" },
          ],
          solution: {
            "src/App.jsx": `import { useState } from "react";

export default function App() {
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("idle");

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("submitting");
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });
      if (!res.ok) throw new Error("HTTP " + res.status);
      setMessage("");
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="message">Message</label>
      <textarea id="message" value={message} onChange={(e) => setMessage(e.target.value)} />
      <button disabled={status === "submitting"}>Send</button>
      {status === "success" && <p role="status">Message sent</p>}
      {status === "error" && <p role="alert">Could not send. Try again.</p>}
    </form>
  );
}
`,
          },
          hint: "Throw on !res.ok inside try so a 500 reaches catch.",
          successMessage: "Four states, one variable, and nothing the user typed is ever lost.",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 33 · 5.10 – 5.12
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "rx-l33-accessible-forms",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 4,
    covers: ["5.10", "5.11", "5.12"],
    title: "Accessible, Reusable Forms and Zod",
    subtitle: "Labels, keyboard use and announcements, a reusable field component, and schema validation",
    estimatedMinutes: 40,
    intro: "Large apps have dozens of forms. Making them accessible once, in a shared field component, and describing their rules once, in a schema, is how teams keep them consistent.",

    atoms: [
      {
        id: "a-rx-form-a11y",
        title: "Accessible labels, keyboard navigation and error announcements",
        explain:
          "Every control has a visible <label> (placeholders are not labels: they vanish when typing). The whole form works with the keyboard alone: Tab moves through fields in a logical order, Enter submits, Space toggles checkboxes; never remove focus outlines without a replacement. When submission fails, ANNOUNCE it: render an error summary with role=\"alert\" (read out immediately) and move focus to the first invalid field, so keyboard and screen-reader users land where the problem is. Required fields are marked in the label text, not only with a red asterisk.",
        webLab: lab({
          task:
            "On a failed submit: show <div role=\"alert\" className=\"summary\"> with the text \"Please fix 2 errors\" (the real count), and move keyboard focus to the FIRST invalid field. Use a ref to each input (useRef, introduced in full in Module 6: const nameRef = useRef(null) and ref={nameRef}, then nameRef.current.focus()).",
          files: {
            "src/App.jsx": `import { useRef, useState } from "react";

function validate(v) {
  const e = {};
  if (!v.name.trim()) e.name = "Enter your name";
  if (!v.email.includes("@")) e.email = "Enter a valid email";
  return e;
}

export default function App() {
  const [form, setForm] = useState({ name: "", email: "" });
  const [errors, setErrors] = useState({});
  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  function handleSubmit(e) {
    e.preventDefault();
    setErrors(validate(form));
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <label htmlFor="name">Name (required)</label>
      <input id="name" name="name" value={form.name} onChange={change} />
      <label htmlFor="email">Email (required)</label>
      <input id="email" name="email" value={form.email} onChange={change} />
      <button>Register</button>
    </form>
  );
}
`,
          },
          tests: [
            { label: "Two errors: an alert summary with the count", check: "await submit('form'); return text('[role=alert].summary') === 'Please fix 2 errors';", fail: "Render the summary when Object.keys(errors).length > 0." },
            { label: "Focus moves to the first invalid field", check: "return document.activeElement === $('#name');", fail: "if (found.name) nameRef.current.focus(); else if (found.email) emailRef.current.focus();" },
            { label: "With only the email wrong, focus goes there", check: "$('#root').querySelector('button').focus(); await type('#name', 'Ada'); await submit('form'); return text('[role=alert]') === 'Please fix 1 error' && document.activeElement === $('#email');", fail: "Focus whichever field is first invalid; \"1 error\", singular." },
            { label: "No summary once everything is valid", check: "await type('#email', 'ada@example.com'); await submit('form'); return !$('[role=alert]');", fail: "Hide the summary when there are no errors." },
          ],
          solution: {
            "src/App.jsx": `import { useRef, useState } from "react";

function validate(v) {
  const e = {};
  if (!v.name.trim()) e.name = "Enter your name";
  if (!v.email.includes("@")) e.email = "Enter a valid email";
  return e;
}

export default function App() {
  const [form, setForm] = useState({ name: "", email: "" });
  const [errors, setErrors] = useState({});
  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const count = Object.keys(errors).length;

  function handleSubmit(e) {
    e.preventDefault();
    const found = validate(form);
    setErrors(found);
    if (found.name) nameRef.current.focus();
    else if (found.email) emailRef.current.focus();
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      {count > 0 && (
        <div role="alert" className="summary">
          Please fix {count} {count === 1 ? "error" : "errors"}
        </div>
      )}
      <label htmlFor="name">Name (required)</label>
      <input id="name" name="name" ref={nameRef} value={form.name} onChange={change} />
      <label htmlFor="email">Email (required)</label>
      <input id="email" name="email" ref={emailRef} value={form.email} onChange={change} />
      <button>Register</button>
    </form>
  );
}
`,
          },
          hint: "Focus after validating, in the same handler, using the errors you just found (not the state, which has not updated yet).",
          successMessage: "Announced, focused, fixable: a form everyone can complete.",
        }),
      },
      {
        id: "a-rx-reusable-fields",
        title: "Reusable form components",
        explain:
          "Once a form needs labels, errors, ids, aria-invalid and aria-describedby on every field, write it ONCE: a TextField component that takes label, name, error and passes everything else to the input with {...rest}. React's useId() generates a unique id for the label and error to connect to, so two forms on one page never clash. Every form in the app then gets the same accessible markup for free, and fixing a bug in TextField fixes it everywhere.",
        webLab: lab({
          task:
            "Write TextField in src/components/TextField.jsx: it takes label, error and any other input props (...rest). It renders a <div className=\"field\"> with a <label> connected to the <input> through an id from useId(), passes rest to the input, and when there is an error renders <p className=\"error\"> connected with aria-describedby and sets aria-invalid=\"true\". App already uses it twice.",
          files: {
            "src/components/TextField.jsx": `import { useId } from "react";

export default function TextField(props) {
  return <input />;
}
`,
            "src/App.jsx": `import { useState } from "react";
import TextField from "./components/TextField.jsx";

export default function App() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("080");
  return (
    <form>
      <TextField label="Full name" name="name" value={name} onChange={(e) => setName(e.target.value)} />
      <TextField label="Phone" name="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} error={phone.length < 11 ? "Enter 11 digits" : undefined} />
    </form>
  );
}
`,
          },
          readOnly: ["src/App.jsx"],
          tests: [
            { label: "Each input is labelled", check: "const i = $$('.field input'); return i.length === 2 && nameOf(i[0]) === 'Full name' && nameOf(i[1]) === 'Phone';", fail: "const id = useId(); <label htmlFor={id}> and <input id={id}>." },
            { label: "Other props reach the input", check: "const i = $$('.field input'); await type(i[0], 'Ada'); return i[0].name === 'name' && i[1].type === 'tel' && i[0].value === 'Ada';", fail: "Spread {...rest} onto the input." },
            { label: "The error is shown and connected", check: "const i = $$('.field input')[1]; const p = $$('.field')[1].querySelector('.error'); return !!p && text(p) === 'Enter 11 digits' && i.getAttribute('aria-invalid') === 'true' && i.getAttribute('aria-describedby') === p.id;", fail: "aria-describedby={error ? errorId : undefined} with <p id={errorId}>." },
            { label: "No error, no error markup", check: "const i = $$('.field input')[0]; return !$$('.field')[0].querySelector('.error') && !i.hasAttribute('aria-invalid');", fail: "Render the error only when there is one." },
          ],
          solution: {
            "src/components/TextField.jsx": `import { useId } from "react";

export default function TextField({ label, error, ...rest }) {
  const id = useId();
  const errorId = id + "-error";
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        aria-invalid={error ? "true" : undefined}
        aria-describedby={error ? errorId : undefined}
        {...rest}
      />
      {error && (
        <p className="error" id={errorId}>
          {error}
        </p>
      )}
    </div>
  );
}
`,
          },
          hint: "function TextField({ label, error, ...rest })",
          successMessage: "Accessibility written once and inherited by every form.",
        }),
      },
      {
        id: "a-rx-zod",
        title: "Introduction to schema-based validation with Zod",
        explain:
          "Hand-written rules get long. A SCHEMA library describes the shape and rules of data declaratively, once: const Signup = z.object({ name: z.string().trim().min(2, \"Name is too short\"), email: z.email(\"Enter a valid email\"), age: z.coerce.number().int().min(16, \"You must be 16 or older\") }). Signup.safeParse(values) returns { success: true, data } with cleaned, converted values, or { success: false, error } whose error.issues each have a path (the field) and a message. The same schema can validate on the server, and with TypeScript it also produces the type (Module 11). Form libraries such as React Hook Form plug into Zod directly.",
        webLab: lab({
          task:
            "Replace the hand-written validate function with a Zod schema in schema.js: name at least 2 characters after trimming (\"Name is too short\"), email a valid email (\"Enter a valid email\"), and age coerced to a number, at least 16 (\"You must be 16 or older\"). App.jsx calls toErrors(values), which must return { field: firstMessage } from safeParse, or {} when valid.",
          files: {
            "src/schema.js": `import { z } from "zod";

export const Signup = null; // define the schema

export function toErrors(values) {
  const errors = {};
  if (!values.name) errors.name = "Name is too short";
  return errors;
}
`,
            "src/App.jsx": `import { useState } from "react";
import { toErrors } from "./schema.js";

export default function App() {
  const [form, setForm] = useState({ name: "", email: "", age: "" });
  const [errors, setErrors] = useState(null);
  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  return (
    <form noValidate onSubmit={(e) => { e.preventDefault(); setErrors(toErrors(form)); }}>
      {["name", "email", "age"].map((f) => (
        <div key={f}>
          <label htmlFor={f}>{f}</label>
          <input id={f} name={f} value={form[f]} onChange={change} />
          {errors?.[f] && <p className="error" data-field={f}>{errors[f]}</p>}
        </div>
      ))}
      <button>Sign up</button>
      {errors && Object.keys(errors).length === 0 && <p role="status">Valid</p>}
    </form>
  );
}
`,
          },
          readOnly: ["src/App.jsx"],
          tests: [
            { label: "Every rule reports its own message", check: "await type('#name', ' A '); await type('#email', 'ada@'); await type('#age', '12'); await submit('form'); return $$('.error').map((p) => p.dataset.field + '=' + text(p)).join('|') === 'name=Name is too short|email=Enter a valid email|age=You must be 16 or older';", fail: "z.string().trim().min(2, …), z.email(…), z.coerce.number().min(16, …)." },
            { label: "Valid values pass, with age given as text", check: "await type('#name', 'Ada'); await type('#email', 'ada@example.com'); await type('#age', '17'); await submit('form'); return !$('.error') && text('[role=status]') === 'Valid';", fail: "safeParse(values).success → return {}." },
            { label: "It is a Zod schema used with safeParse", check: "const c = code('src/schema.js'); return /z\\.object\\(/.test(c) && /safeParse\\(/.test(c) && /issues/.test(c);", fail: "const result = Signup.safeParse(values); read result.error.issues." },
          ],
          solution: {
            "src/schema.js": `import { z } from "zod";

export const Signup = z.object({
  name: z.string().trim().min(2, "Name is too short"),
  email: z.email("Enter a valid email"),
  age: z.coerce.number().int().min(16, "You must be 16 or older"),
});

export function toErrors(values) {
  const result = Signup.safeParse(values);
  if (result.success) return {};
  const errors = {};
  for (const issue of result.error.issues) {
    const field = issue.path[0];
    if (!errors[field]) errors[field] = issue.message;
  }
  return errors;
}
`,
          },
          hint: "Each issue's path[0] is the field name; keep the first message per field.",
          successMessage: "Rules as data: readable, reusable on the server, and typed for free in Module 11.",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 34 · 5.P
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "rx-l34-m5-project",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 5,
    covers: ["5.P"],
    title: "Practical: A Student Registration Form",
    subtitle: "Validation, confirmation feedback and a list of registered students",
    estimatedMinutes: 60,
    intro: "The Module 5 practical combines the whole module: controlled fields, rules with clear messages, one request per click, honest status feedback and a list that grows.",

    atoms: [
      {
        id: "a-rx-m5-project",
        title: "Build the registration form",
        explain:
          "Plan the states first: the form values, the status of the request, and the list of students. Errors are calculated from the values once the form has been submitted. The API is POST /api/students, which answers 201 with the saved student, or 409 when the email is already registered.",
        webLab: lab({
          task:
            "Build the registration form. Fields (each labelled): Full name, Email, Course (a select: React, Python, Data Analysis, with an empty first option \"Choose a course\"), and a checkbox \"I agree to the terms\". Rules, shown under each field with aria-invalid after the first submit: name required (\"Enter your full name\"), valid email (\"Enter a valid email\"), a course chosen (\"Choose a course\"), terms ticked (\"You must agree to the terms\"). A valid submit POSTs JSON to /api/students with the button disabled; on 201, add the returned student to <ul className=\"students\"> as \"NAME — COURSE\", reset the form and show <p role=\"status\">NAME is registered</p>; on 409 show <p role=\"alert\">That email is already registered</p> and keep the values.",
          files: {
            "src/App.jsx": `import { useState } from "react";

const COURSES = ["React", "Python", "Data Analysis"];
const EMPTY = { name: "", email: "", course: "", agree: false };

export default function App() {
  return <h1>Register</h1>;
}
`,
          },
          mocks: [
            { match: "/api/students", method: "POST", status: 201, body: { id: 7, name: "Ada Obi", email: "ada@example.com", course: "React" }, delay: 120 },
          ],
          revealSolution: false,
          tests: [
            { label: "Every field is labelled", check: "const names = $$('input, select').map((i) => nameOf(i)); return ['Full name', 'Email', 'Course', 'I agree to the terms'].every((n) => names.includes(n));", fail: "Label each control." },
            { label: "An empty submit shows all four errors and sends nothing", check: "await submit('form'); const e = $$('.error').map((p) => text(p)); return ['Enter your full name', 'Enter a valid email', 'Choose a course', 'You must agree to the terms'].every((m) => e.includes(m)) && fetchCalls().length === 0 && $$('[aria-invalid=true]').length === 4;", fail: "Validate on submit; mark invalid fields with aria-invalid." },
            { label: "A valid submit posts JSON with the button disabled", check: "const by = (n) => $$('input, select').find((i) => nameOf(i) === n); await type(by('Full name'), 'Ada Obi'); await type(by('Email'), 'ada@example.com'); await type(by('Course'), 'React'); await click(by('I agree to the terms')); await submit('form'); const call = fetchCalls()[0]; const body = call && JSON.parse(call.body); return !!call && call.method === 'POST' && body.name === 'Ada Obi' && body.course === 'React' && $('form button:not([type=button])').disabled;", fail: "fetch(\"/api/students\", { method: \"POST\", headers, body: JSON.stringify(values) })" },
            { label: "On success: the list, the message and a reset form", check: "await waitFor(() => !!$('[role=status]')); const by = (n) => $$('input, select').find((i) => nameOf(i) === n); return $$('.students li').map((li) => text(li)).join() === 'Ada Obi — React' && text('[role=status]') === 'Ada Obi is registered' && by('Full name').value === '' && !by('I agree to the terms').checked && !$('.error');", fail: "Add the returned student, reset to EMPTY and show the status." },
            { label: "A duplicate email (409) keeps the values and alerts", mocks: [{ match: "/api/students", method: "POST", status: 409, body: { error: "exists" }, delay: 60 }], check: "const by = (n) => $$('input, select').find((i) => nameOf(i) === n); await type(by('Full name'), 'Ada Obi'); await type(by('Email'), 'ada@example.com'); await type(by('Course'), 'Python'); await click(by('I agree to the terms')); await submit('form'); await waitFor(() => !!$('[role=alert]')); return text('[role=alert]') === 'That email is already registered' && by('Email').value === 'ada@example.com' && $$('.students li').length === 0;", fail: "if (res.status === 409) show the alert; keep the form values." },
          ],
          solution: {
            "src/App.jsx": `import { useState } from "react";

const COURSES = ["React", "Python", "Data Analysis"];
const EMPTY = { name: "", email: "", course: "", agree: false };

function validate(v) {
  const e = {};
  if (!v.name.trim()) e.name = "Enter your full name";
  if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(v.email)) e.email = "Enter a valid email";
  if (!v.course) e.course = "Choose a course";
  if (!v.agree) e.agree = "You must agree to the terms";
  return e;
}

export default function App() {
  const [form, setForm] = useState(EMPTY);
  const [submitted, setSubmitted] = useState(false);
  const [status, setStatus] = useState("idle");
  const [students, setStudents] = useState([]);
  const [last, setLast] = useState("");
  const errors = submitted ? validate(form) : {};

  function change(e) {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitted(true);
    if (status === "submitting" || Object.keys(validate(form)).length > 0) return;
    setStatus("submitting");
    try {
      const res = await fetch("/api/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.status === 409) {
        setStatus("duplicate");
        return;
      }
      if (!res.ok) throw new Error("HTTP " + res.status);
      const saved = await res.json();
      setStudents([...students, saved]);
      setLast(saved.name);
      setForm(EMPTY);
      setSubmitted(false);
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  const invalid = (f) => (errors[f] ? { "aria-invalid": "true", "aria-describedby": f + "-error" } : {});
  const error = (f) => errors[f] && <p className="error" id={f + "-error"}>{errors[f]}</p>;

  return (
    <main>
      <h1>Register</h1>
      <form onSubmit={handleSubmit} noValidate>
        <label htmlFor="name">Full name</label>
        <input id="name" name="name" value={form.name} onChange={change} {...invalid("name")} />
        {error("name")}
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" value={form.email} onChange={change} {...invalid("email")} />
        {error("email")}
        <label htmlFor="course">Course</label>
        <select id="course" name="course" value={form.course} onChange={change} {...invalid("course")}>
          <option value="">Choose a course</option>
          {COURSES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        {error("course")}
        <label>
          <input type="checkbox" name="agree" checked={form.agree} onChange={change} {...invalid("agree")} /> I agree to the terms
        </label>
        {error("agree")}
        <button disabled={status === "submitting"}>{status === "submitting" ? "Registering…" : "Register"}</button>
      </form>
      {status === "success" && <p role="status">{last} is registered</p>}
      {status === "duplicate" && <p role="alert">That email is already registered</p>}
      {status === "error" && <p role="alert">Could not register. Try again.</p>}
      <ul className="students">
        {students.map((s) => (
          <li key={s.id}>
            {s.name} — {s.course}
          </li>
        ))}
      </ul>
    </main>
  );
}
`,
          },
          hint: "One change handler can serve checkboxes too: use checked when type is \"checkbox\".",
          successMessage: "Invalid input, success and a real failure, each with clear feedback.",
        }),
      },
    ],
    task: {
      title: "Module 5 practical: your registration form",
      intro: "Build the form in your own project, then raise the standard.",
      prompts: [
        "Move the rules into a Zod schema and the fields into a reusable TextField component.",
        "Add an error summary with role=\"alert\" and move focus to the first invalid field on submit.",
        "Complete the whole form with the keyboard only, and with a screen reader if you have one (NVDA on Windows, VoiceOver on macOS).",
        "Use a fake API (a setTimeout promise, or json-server) to test slow, failing and duplicate submissions.",
        "Mastery checkpoint: demonstrate invalid input, a successful submission and a failed one, and explain what the user sees and hears in each case.",
      ],
      closing: "Next: Module 6, Hooks and side effects.",
    },
    requirements: { read: true, video: false, assessment: true },
  },
];
