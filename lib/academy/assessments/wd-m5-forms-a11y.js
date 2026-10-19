/**
 * ASSESSMENTS · RESPONSIVE WEB DEVELOPMENT · MODULE 5 · FORMS AND ACCESSIBILITY
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Never import this from anything under src/.
 * ═════════════════════════════════════════════════════════════════════════
 */

import { q, check } from "./wd-helpers.js";

export const ASSESSMENTS = {
  ...check("wd-l16-form-inputs", [
    q({
      id: "wdq16-1", atom: "a-wd-forms-intro", d: 2,
      prompt: "A form field has no name attribute. What happens when the form is submitted?",
      options: ["Its value is not sent", "The form cannot be submitted", "The browser invents a name", "It is sent with the name \"field\""],
      correct: "a",
      explanation: "Only named fields are included in the name=value pairs the browser sends.",
      wrong: { b: "The form submits; the field is simply left out.", c: "Browsers do not invent names.", d: "No default name is used." },
    }),
    q({
      id: "wdq16-2", atom: "a-wd-forms-intro", d: 3, type: "scenario",
      prompt: "Which method should a login form use?",
      options: ["POST, so the password is not put in the URL", "GET, so the login can be bookmarked", "Either; there is no difference", "No method at all"],
      correct: "a",
      explanation: "GET puts the values in the address, where they are saved in history and server logs.",
      wrong: { b: "Bookmarking a password is exactly what must not happen.", c: "GET exposes the data in the URL; POST does not.", d: "Without a method the default is GET." },
    }),
    q({
      id: "wdq16-3", atom: "a-wd-input-types", d: 2,
      prompt: "Which input type is right for a phone number?",
      options: ["tel", "number", "text", "phone"],
      correct: "a",
      explanation: "tel shows a dial pad and keeps leading zeros and plus signs; a phone number is not a quantity.",
      wrong: { b: "number is for quantities: it drops leading zeros and adds arrows.", c: "text works but shows the full keyboard.", d: "There is no type=\"phone\"." },
    }),
    q({
      id: "wdq16-4", atom: "a-wd-labels", d: 2,
      prompt: "Why is a placeholder not a substitute for a label?",
      options: [
        "It disappears when typing starts and is not reliably announced",
        "Placeholders are not allowed on inputs",
        "Placeholders are sent with the form",
        "Placeholders make the form slower",
      ],
      correct: "a",
      explanation: "Visitors forget what a field was for once they type, and screen readers may not read it.",
      wrong: { b: "They are allowed, for format examples.", c: "Placeholder text is never sent.", d: "They have no effect on speed." },
    }),
  ]),

  ...check("wd-l17-form-choices", [
    q({
      id: "wdq17-1", atom: "a-wd-radio-checkbox", d: 2,
      prompt: "What makes several radio buttons one group, where only one can be chosen?",
      options: ["They share the same name", "They share the same value", "They are next to each other", "They share the same id"],
      correct: "a",
      explanation: "Same name, different values. The chosen value is sent under that name.",
      wrong: { b: "Values should differ; they tell you which was chosen.", c: "Position does not matter.", d: "ids must be unique on a page." },
    }),
    q({
      id: "wdq17-2", atom: "a-wd-radio-checkbox", d: 2,
      prompt: "A newsletter checkbox is left unticked. What is sent for it?",
      options: ["Nothing at all", "newsletter=no", "newsletter=", "newsletter=false"],
      correct: "a",
      explanation: "Unticked checkboxes are omitted entirely; the server treats \"missing\" as no.",
      wrong: { b: "No value is sent.", c: "Not even an empty value is sent.", d: "Checkboxes do not send false." },
    }),
    q({
      id: "wdq17-3", atom: "a-wd-select-textarea", d: 2,
      prompt: "What is wrong with <textarea name=\"notes\">Type here</textarea>?",
      options: [
        "\"Type here\" becomes real text in the box, which visitors must delete and which is sent if they do not",
        "textarea cannot have a name",
        "textarea must be self-closing",
        "Nothing",
      ],
      correct: "a",
      explanation: "Text between the tags is the starting value. Use a label for the question.",
      wrong: { b: "It needs a name to be sent.", c: "textarea has a closing tag.", d: "The starting text is a real problem." },
    }),
    q({
      id: "wdq17-4", atom: "a-wd-buttons", d: 3, type: "scenario",
      prompt: "A \"Show password\" button inside a form keeps submitting the form when clicked. Why?",
      options: [
        "A button inside a form with no type is a submit button; it needs type=\"button\"",
        "The button needs a name",
        "Buttons cannot be inside forms",
        "The form is missing an action",
      ],
      correct: "a",
      explanation: "The default type of a button in a form is submit.",
      wrong: { b: "Names do not change what a button does.", c: "Buttons belong inside forms.", d: "Without an action the form still submits, to the same page." },
    }),
  ]),

  ...check("wd-l18-validation-keyboard", [
    q({
      id: "wdq18-1", atom: "a-wd-native-validation", d: 2,
      prompt: "Which attribute stops a form being submitted while a field is empty?",
      options: ["required", "placeholder", "name", "autocomplete"],
      correct: "a",
      explanation: "The browser blocks submission and shows a message at the first empty required field.",
      wrong: { b: "Placeholder is example text.", c: "name decides how the value is sent.", d: "autocomplete helps the browser fill it in." },
    }),
    q({
      id: "wdq18-2", atom: "a-wd-native-validation", d: 3,
      prompt: "Why must the server check the data again, even with native validation?",
      options: [
        "Anyone can bypass browser checks, by editing the page or sending a request directly",
        "Native validation only works on weekdays",
        "Servers cannot read validated data",
        "It does not need to",
      ],
      correct: "a",
      explanation: "Browser checks help honest users. They protect nothing against someone who skips the browser.",
      wrong: { b: "Validation has no such limit.", c: "Servers read it like any other data.", d: "Trusting only the browser is a security hole." },
    }),
    q({
      id: "wdq18-3", atom: "a-wd-fieldset-legend", d: 2,
      prompt: "What does a <legend> do for a group of radio buttons?",
      options: [
        "Gives the group its question, which screen readers announce with each option",
        "Makes the options bigger",
        "Selects the first option",
        "Hides the group",
      ],
      correct: "a",
      explanation: "Without it, \"Saturday, radio button\" has no question attached.",
      wrong: { b: "Size is CSS.", c: "That is the checked attribute.", d: "It does not hide anything." },
    }),
    q({
      id: "wdq18-4", atom: "a-wd-keyboard", d: 3,
      prompt: "Why should you avoid tabindex=\"3\" on a button?",
      options: [
        "Positive tabindex values pull elements out of the natural order, so Tab jumps around confusingly",
        "It makes the button unclickable",
        "Buttons cannot receive focus",
        "It only works in Chrome",
      ],
      correct: "a",
      explanation: "Keep the tab order equal to the HTML order; fix the HTML order instead.",
      wrong: { b: "It still works with a mouse.", c: "Buttons are focusable by default.", d: "All browsers honour it, which is the problem." },
    }),
  ]),

  ...check("wd-l19-accessibility", [
    q({
      id: "wdq19-1", atom: "a-wd-accessible-names", d: 2,
      prompt: "A search button shows only a magnifying-glass icon. How do you give it an accessible name?",
      options: ["aria-label=\"Search\"", "title=\"🔍\"", "class=\"search\"", "id=\"search\""],
      correct: "a",
      explanation: "aria-label supplies the name the icon cannot.",
      wrong: { b: "An emoji is not a name.", c: "Classes are for styling and mean nothing to assistive technology.", d: "ids are not announced." },
    }),
    q({
      id: "wdq19-2", atom: "a-wd-screen-readers", d: 2,
      prompt: "What does a screen reader read?",
      options: ["The page's HTML: element types, names, states and structure", "The pixels on the screen", "Only the page title", "The CSS file"],
      correct: "a",
      explanation: "It works from the structure, which is why semantic HTML matters so much.",
      wrong: { b: "It does not recognise images of text or visual styling.", c: "It reads the whole page.", d: "CSS is mostly ignored, except for things that hide content." },
    }),
    q({
      id: "wdq19-3", atom: "a-wd-screen-readers", d: 2,
      prompt: "How do screen-reader users usually find what they want on a page?",
      options: ["By jumping between headings, landmarks, links or form fields", "By listening to every word from the top", "By using the mouse", "By reading the URL"],
      correct: "a",
      explanation: "They navigate by structure, just as sighted users scan visually.",
      wrong: { b: "That is slow and is a last resort.", c: "Blind users do not use a mouse.", d: "The URL says little about the content." },
    }),
    q({
      id: "wdq19-4", atom: "a-wd-a11y-mistakes", d: 2,
      prompt: "Which is the most common accessibility failure on websites?",
      options: ["Missing or poor alternative text and missing form labels", "Too many headings", "Using the footer element", "Using HTML5"],
      correct: "a",
      explanation: "Missing alt text, missing labels and low contrast are found on most sites year after year.",
      wrong: { b: "Headings help, when they form an outline.", c: "footer is a helpful landmark.", d: "Modern HTML is the solution, not the problem." },
    }),
  ]),
};
