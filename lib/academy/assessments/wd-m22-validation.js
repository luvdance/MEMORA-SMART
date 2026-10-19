/**
 * ASSESSMENTS · RESPONSIVE WEB DEVELOPMENT · MODULE 22 · FORMS AND VALIDATION
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Never import this from anything under src/.
 * ═════════════════════════════════════════════════════════════════════════
 */

import { q, check } from "./wd-helpers.js";

export const ASSESSMENTS = {
  ...check("wd-l99-rules", [
    q({ id: "wdq99-1", atom: "a-wd-reading-values", d: 2, prompt: "What does Object.fromEntries(new FormData(form)) give you?", options: ["A plain object of every named field's value", "The form's HTML", "An array of inputs", "Only the first field"], correct: "a",
      explanation: "Such as { email: \"…\", password: \"…\" }.",
      wrong: { b: "It reads values, not markup.", c: "It is an object of values.", d: "Every named field." } }),
    q({ id: "wdq99-2", atom: "a-wd-required-custom", d: 2, prompt: "Why write validation as a pure validate(values) function?", options: ["It can be tested on its own and reused, including on the server", "Browsers require it", "It runs faster", "It shows the messages automatically"], correct: "a",
      explanation: "Rules separate from display.",
      wrong: { b: "Not required.", c: "Not the point.", d: "Display is a separate step." } }),
    q({ id: "wdq99-3", atom: "a-wd-email-password", d: 3, prompt: "Which password rule matters most?", options: ["A minimum length, such as 8 or more characters", "Exactly one symbol", "No spaces", "A maximum of 10 characters"], correct: "a",
      explanation: "Length adds the most strength; spaces and long passwords should be allowed.",
      wrong: { b: "Arbitrary symbol rules add little.", c: "Spaces make strong passphrases possible.", d: "Short caps weaken passwords." } }),
    q({ id: "wdq99-4", atom: "a-wd-number-range", d: 3, type: "scenario", prompt: "An empty age field passes a check of Number(age) >= 0. Why?", options: ["Number(\"\") is 0", "Empty fields are always valid", ">= ignores strings", "age is undefined"], correct: "a",
      explanation: "Check for emptiness before converting.",
      wrong: { b: "Not if required.", c: "It converts them.", d: "It is \"\"." } }),
  ]),

  ...check("wd-l100-feedback", [
    q({ id: "wdq100-1", atom: "a-wd-error-messages", d: 2, prompt: "Which error message is best for a short password?", options: ["Use at least 8 characters", "Invalid input", "Error!", "Your password is wrong"], correct: "a",
      explanation: "It says how to fix it.",
      wrong: { b: "Says nothing useful.", c: "Alarming and unhelpful.", d: "Vague and blaming." } }),
    q({ id: "wdq100-2", atom: "a-wd-prevent-invalid", d: 2, prompt: "Why add novalidate to a form validated with JavaScript?", options: ["So the browser's own bubbles do not appear on top of your messages", "To turn off all validation", "To make the form submit faster", "It is required for FormData"], correct: "a",
      explanation: "Your messages replace the browser's; your JavaScript still validates.",
      wrong: { b: "Your validation still runs.", c: "Unrelated.", d: "Unrelated." } }),
    q({ id: "wdq100-3", atom: "a-wd-reset-forms", d: 2, prompt: "When should a form be reset?", options: ["After a successful submission", "After a failed submission", "On every keystroke", "Never"], correct: "a",
      explanation: "Never make people retype correct answers.",
      wrong: { b: "They would lose what was right.", c: "Absurd.", d: "After success it is helpful." } }),
    q({ id: "wdq100-4", atom: "a-wd-accessible-validation", d: 3, prompt: "What makes a screen reader read a field's error message when the field is focused?", options: ["aria-describedby on the field, pointing at the message's id", "A red border", "role=\"button\" on the message", "Placing the message at the top of the page"], correct: "a",
      explanation: "It links the description to the field.",
      wrong: { b: "Visual only.", c: "Wrong role.", d: "Not linked to the field." } }),
  ]),

  ...check("wd-l101-safe-content", [
    q({ id: "wdq101-1", atom: "a-wd-client-server", d: 3, prompt: "Why must the server validate data that the browser already validated?", options: ["Anyone can bypass the browser and send the server anything", "Browsers make mistakes in arithmetic", "Servers are faster", "It does not need to"], correct: "a",
      explanation: "Client checks are convenience; server checks are security.",
      wrong: { b: "Not the reason.", c: "Speed is unrelated.", d: "It must." } }),
    q({ id: "wdq101-2", atom: "a-wd-client-server", d: 2, prompt: "What is client-side validation for?", options: ["Fast, helpful feedback for honest users", "Security against attackers", "Saving data", "Hiding errors"], correct: "a",
      explanation: "It improves the experience; it does not protect the server.",
      wrong: { b: "It can be bypassed.", c: "Saving is separate.", d: "It shows them." } }),
    q({ id: "wdq101-3", atom: "a-wd-safe-content", d: 3, type: "scenario", prompt: "Comments are shown with li.innerHTML = comment. Someone posts <img src=x onerror=\"…\">. What happens?", options: ["The browser creates the image, it fails to load, and the attacker's code runs for every reader", "The text is shown", "Nothing", "The comment is rejected"], correct: "a",
      explanation: "That is cross-site scripting. Use textContent.",
      wrong: { b: "That is what textContent would do.", c: "Code runs.", d: "Nothing rejects it." } }),
    q({ id: "wdq101-4", atom: "a-wd-safe-content", d: 2, prompt: "What is the safe way to show text a user typed?", options: ["Set it with textContent", "Set it with innerHTML", "Use document.write", "Put it in an onclick attribute"], correct: "a",
      explanation: "textContent never interprets text as HTML.",
      wrong: { b: "Interprets markup.", c: "Obsolete and unsafe.", d: "Executes as code." } }),
  ]),
};
