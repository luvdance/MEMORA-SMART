/**
 * ASSESSMENTS · REACT DEVELOPMENT · MODULE 5 · FORMS, VALIDATION AND USER INPUT
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Never import this from anything under src/.
 * ═════════════════════════════════════════════════════════════════════════
 */

import { q, check } from "./rx-helpers.js";

export const ASSESSMENTS = {
  ...check("rx-l30-inputs", [
    q({ id: "rxq30-1", atom: "a-rx-text-inputs", d: 2, prompt: "How is a <textarea> controlled in React?", options: ["value={text} onChange={(e) => setText(e.target.value)}", "<textarea>{text}</textarea>", "defaultValue only", "innerHTML={text}"], correct: "a",
      explanation: "Like an input: a value prop and onChange.",
      wrong: { b: "React uses the value prop, not children.", c: "That makes it uncontrolled.", d: "Not a prop." } }),
    q({ id: "rxq30-2", atom: "a-rx-select-check-radio", d: 2, prompt: "Which property holds a checkbox's state in onChange?", options: ["e.target.checked", "e.target.value", "e.checked", "e.target.selected"], correct: "a",
      explanation: "Checkboxes report checked (true or false).",
      wrong: { b: "value is the fixed value attribute.", c: "Not on the event.", d: "That is for options." } }),
    q({ id: "rxq30-3", atom: "a-rx-select-check-radio", d: 2, prompt: "What groups radio buttons for screen readers?", options: ["A <fieldset> with a <legend>", "A <div>", "The same className", "A <span>"], correct: "a",
      explanation: "The legend is announced as the group's question.",
      wrong: { b: "No meaning.", c: "Visual only.", d: "No meaning." } }),
    q({ id: "rxq30-4", atom: "a-rx-multiple-fields", d: 3, prompt: "What does setForm({ ...form, [e.target.name]: e.target.value }) do?", options: ["Copies form and replaces the key named by the input's name", "Replaces the whole form with one value", "Adds a key literally called name", "Mutates form"], correct: "a",
      explanation: "[name] is a computed key.",
      wrong: { b: "The spread keeps other fields.", c: "The brackets use the variable's value.", d: "It makes a new object." } }),
  ]),

  ...check("rx-l31-validation", [
    q({ id: "rxq31-1", atom: "a-rx-form-submit", d: 2, prompt: "A Cancel button inside a form submits it. Why?", options: ["A <button> in a form is type=\"submit\" by default", "onClick always submits", "Forms submit on any click", "React bug"], correct: "a",
      explanation: "Give it type=\"button\".",
      wrong: { b: "Only submit buttons submit.", c: "Not true.", d: "HTML behaviour." } }),
    q({ id: "rxq31-2", atom: "a-rx-validation-rules", d: 2, prompt: "Why write validation as a pure function returning an errors object?", options: ["It is easy to test, reuse and reason about", "React requires it", "It runs faster in the browser", "It replaces server validation"], correct: "a",
      explanation: "Values in, errors out.",
      wrong: { b: "Not required.", c: "Not about speed.", d: "The server must always validate too." } }),
    q({ id: "rxq31-3", atom: "a-rx-validation-rules", d: 3, prompt: "Why must the server validate again even if the React form does?", options: ["Anyone can bypass the browser and send requests directly", "React validation is often wrong", "Servers are faster", "It is a legal requirement everywhere"], correct: "a",
      explanation: "Client validation is for the user's convenience, not security.",
      wrong: { b: "It may be correct and still bypassed.", c: "Not the reason.", d: "Not the reason." } }),
    q({ id: "rxq31-4", atom: "a-rx-field-errors", d: 2, prompt: "Which connects an error message to its input for screen readers?", options: ["aria-describedby on the input pointing at the message's id", "Putting the message in red", "A title attribute on the form", "Placing it below the input"], correct: "a",
      explanation: "The message is read when the field is focused.",
      wrong: { b: "Colour is visual.", c: "Unrelated.", d: "Position alone is visual." } }),
  ]),

  ...check("rx-l32-submitting", [
    q({ id: "rxq32-1", atom: "a-rx-account-fields", d: 2, prompt: "What matters most for password strength rules?", options: ["Length", "A mix of exactly three symbol types", "Disallowing paste", "Changing it every week"], correct: "a",
      explanation: "Long passwords are strongest; allow paste and managers.",
      wrong: { b: "Less important than length.", c: "Blocks password managers.", d: "Forced rotation leads to weaker passwords." } }),
    q({ id: "rxq32-2", atom: "a-rx-duplicate-submit", d: 3, prompt: "Why can a submitting state variable alone fail to stop a double submission?", options: ["Both submits run before React re-renders, so both read submitting as false", "State cannot hold booleans", "Buttons cannot be disabled", "fetch ignores state"], correct: "a",
      explanation: "A ref changes immediately; use it as the guard.",
      wrong: { b: "It can.", c: "They can.", d: "Unrelated." } }),
    q({ id: "rxq32-3", atom: "a-rx-request-states", d: 2, prompt: "Why model a request as one status value instead of isLoading, isError and isSuccess booleans?", options: ["The booleans can contradict each other; one value cannot", "Booleans are slow", "React allows only one useState", "Strings render faster"], correct: "a",
      explanation: "\"idle\" | \"submitting\" | \"success\" | \"error\".",
      wrong: { b: "Not about speed.", c: "Many are allowed.", d: "Not the reason." } }),
    q({ id: "rxq32-4", atom: "a-rx-request-states", d: 2, prompt: "A send fails. What should happen to what the user typed?", options: ["Keep it, so they can try again", "Clear it", "Reload the page", "Copy it to the clipboard"], correct: "a",
      explanation: "Never make people retype after an error.",
      wrong: { b: "Hostile.", c: "Loses everything.", d: "Unexpected." } }),
  ]),

  ...check("rx-l33-accessible-forms", [
    q({ id: "rxq33-1", atom: "a-rx-form-a11y", d: 2, prompt: "Why is a placeholder not a label?", options: ["It disappears when typing and is often not announced as the field's name", "Placeholders are not allowed", "It is the same as a label", "Labels are optional"], correct: "a",
      explanation: "Use a visible <label>.",
      wrong: { b: "They are allowed as hints.", c: "It is not.", d: "Every field needs one." } }),
    q({ id: "rxq33-2", atom: "a-rx-form-a11y", d: 2, prompt: "After a failed submit, where should keyboard focus go?", options: ["To the first invalid field", "To the top of the page", "Nowhere; leave it on the button", "To the browser's address bar"], correct: "a",
      explanation: "Users land where the problem is.",
      wrong: { b: "They must hunt for the error.", c: "They may not know anything failed.", d: "Outside the page." } }),
    q({ id: "rxq33-3", atom: "a-rx-reusable-fields", d: 2, prompt: "What does useId() give a reusable TextField?", options: ["A unique id to connect its label and error, even with many fields on a page", "The field's value", "A database id", "A random key for lists"], correct: "a",
      explanation: "Stable and unique per component instance.",
      wrong: { b: "Unrelated.", c: "Unrelated.", d: "Not for list keys." } }),
    q({ id: "rxq33-4", atom: "a-rx-zod", d: 3, prompt: "What does Schema.safeParse(values) return when the data is invalid?", options: ["{ success: false, error } with error.issues listing each path and message", "It throws", "null", "The original values"], correct: "a",
      explanation: "parse throws; safeParse returns a result.",
      wrong: { b: "That is parse().", c: "It returns an object.", d: "It returns a result object." } }),
  ]),

  ...check("rx-l34-m5-project", [
    q({ id: "rxq34-1", atom: "a-rx-m5-project", d: 2, prompt: "The server answers 409. What does that usually mean here?", options: ["A conflict: that email is already registered", "Success", "The server crashed", "Not found"], correct: "a",
      explanation: "409 Conflict.",
      wrong: { b: "Success is 2xx.", c: "That is 5xx.", d: "That is 404." } }),
    q({ id: "rxq34-2", atom: "a-rx-m5-project", d: 2, prompt: "When should the form be reset?", options: ["After a successful submission", "On every error", "Before validating", "Never"], correct: "a",
      explanation: "Only success clears the values.",
      wrong: { b: "Keep values after errors.", c: "Too early.", d: "Leaving old values invites duplicates." } }),
    q({ id: "rxq34-3", atom: "a-rx-m5-project", d: 3, prompt: "Which single change handler supports text inputs and checkboxes?", options: ["Use checked when e.target.type is \"checkbox\", otherwise value", "Always use value", "Always use checked", "A separate handler per field is required"], correct: "a",
      explanation: "One handler, two cases.",
      wrong: { b: "A checkbox's value does not change.", c: "Text inputs have no checked.", d: "Not required." } }),
    q({ id: "rxq34-4", atom: "a-rx-m5-project", d: 2, prompt: "When should field errors first appear in the registration form?", options: ["After the first submit, then update as the user fixes them", "On the first keystroke", "Never", "Only in the console"], correct: "a",
      explanation: "Do not shout at people before they finish typing.",
      wrong: { b: "Hostile.", c: "Users need them.", d: "Users cannot see the console." } }),
  ]),
};
