/**
 * ASSESSMENTS · RESPONSIVE WEB DEVELOPMENT · MODULE 21 · EVENTS AND INTERACTION
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Never import this from anything under src/.
 * ═════════════════════════════════════════════════════════════════════════
 */

import { q, check } from "./wd-helpers.js";

export const ASSESSMENTS = {
  ...check("wd-l95-events-click-input", [
    q({ id: "wdq95-1", atom: "a-wd-what-events", d: 1, prompt: "What is an event handler?", options: ["A function the browser calls each time a chosen event happens", "An HTML element", "A CSS rule", "A server"], correct: "a",
      explanation: "It is a callback registered for an event.",
      wrong: { b: "Elements fire events; handlers respond.", c: "Unrelated.", d: "Events happen in the browser." } }),
    q({ id: "wdq95-2", atom: "a-wd-click", d: 2, prompt: "Why do click handlers on <button> elements also help keyboard users?", options: ["Buttons fire click when activated with Enter or Space", "Keyboards cannot press buttons", "click only works with a mouse", "Buttons ignore keyboards"], correct: "a",
      explanation: "Native buttons turn key activation into click.",
      wrong: { b: "They can.", c: "Not on buttons.", d: "They respond to keys." } }),
    q({ id: "wdq95-3", atom: "a-wd-input-change", d: 2, prompt: "Which event gives live feedback on every keystroke?", options: ["input", "change", "submit", "load"], correct: "a",
      explanation: "input fires as the value changes.",
      wrong: { b: "Fires when a text field loses focus.", c: "Fires when a form is sent.", d: "Fires when the page loads." } }),
    q({ id: "wdq95-4", atom: "a-wd-input-change", d: 3, type: "scenario", prompt: "A quantity field's value is added to a total and gives \"25\" instead of 7 for 2 + 5. Why?", options: ["field.value is a string; convert it with Number()", "input events are broken", "The total must be const", "+ only works on strings"], correct: "a",
      explanation: "Form values are always strings.",
      wrong: { b: "They are fine.", c: "Unrelated.", d: "+ adds numbers once converted." } }),
  ]),

  ...check("wd-l96-submit-keys", [
    q({ id: "wdq96-1", atom: "a-wd-form-submission", d: 2, prompt: "Why listen for submit on the form rather than click on its button?", options: ["submit also fires when Enter is pressed in a field, and validation runs first", "click does not work on buttons", "submit is faster", "Forms have no click event"], correct: "a",
      explanation: "It catches every way of submitting.",
      wrong: { b: "It works, but misses Enter.", c: "Not about speed.", d: "Irrelevant." } }),
    q({ id: "wdq96-2", atom: "a-wd-form-submission", d: 2, prompt: "What does event.preventDefault() do in a submit handler?", options: ["Stops the browser sending the form and loading a new page", "Clears the form", "Validates the form", "Deletes the form"], correct: "a",
      explanation: "Your code then handles the data.",
      wrong: { b: "That is form.reset().", c: "Validation is separate.", d: "Nothing is deleted." } }),
    q({ id: "wdq96-3", atom: "a-wd-keyboard-events", d: 2, prompt: "Which property tells you which key was pressed?", options: ["event.key", "event.target", "event.type", "event.code() only"], correct: "a",
      explanation: "It gives values such as \"Escape\" or \"a\".",
      wrong: { b: "The element.", c: "\"keydown\" itself.", d: "event.code is a property naming the physical key, not a function." } }),
    q({ id: "wdq96-4", atom: "a-wd-event-object", d: 3, prompt: "A listener on a ul handles a click on a button inside an li. What is event.target?", options: ["The button that was clicked", "The ul", "The li", "The document"], correct: "a",
      explanation: "target is where the event started; currentTarget is the ul.",
      wrong: { b: "That is currentTarget.", c: "It is the exact element clicked.", d: "Not the document." } }),
  ]),

  ...check("wd-l97-bubbling-delegation", [
    q({ id: "wdq97-1", atom: "a-wd-bubbling", d: 2, prompt: "A click on a button inside a ul bubbles. Which listeners can see it?", options: ["Listeners on the button and on every ancestor, up to the document", "Only the button's", "Only the document's", "None"], correct: "a",
      explanation: "Bubbling travels up the tree.",
      wrong: { b: "Ancestors see it too.", c: "Every ancestor, not only the document.", d: "They all can." } }),
    q({ id: "wdq97-2", atom: "a-wd-delegation", d: 3, prompt: "Why does event delegation work for list items added later?", options: ["The listener is on the parent, which receives bubbling clicks from any child, old or new", "New items copy their parent's listeners", "The browser re-runs scripts", "It does not"], correct: "a",
      explanation: "No per-item listener is needed.",
      wrong: { b: "Listeners are not copied.", c: "Scripts run once.", d: "It does." } }),
    q({ id: "wdq97-3", atom: "a-wd-delegation", d: 3, type: "scenario", prompt: "In a delegated listener, event.target.closest(\".delete\") returns null. What should the handler do?", options: ["Return: the click was not on a delete button", "Delete the first item", "Throw an error", "Reload the page"], correct: "a",
      explanation: "Delegated listeners see every click inside the parent.",
      wrong: { b: "Destroys data.", c: "Normal clicks are not errors.", d: "Unnecessary." } }),
    q({ id: "wdq97-4", atom: "a-wd-prevent-default", d: 2, prompt: "A link is given preventDefault so it never navigates and only runs JavaScript. What does that suggest?", options: ["It should probably be a button", "It should be an image", "It is correct", "Links cannot be clicked"], correct: "a",
      explanation: "Links go places; buttons do things.",
      wrong: { b: "Unrelated.", c: "Usually the wrong element.", d: "They can." } }),
  ]),

  ...check("wd-l98-menus-modals", [
    q({ id: "wdq98-1", atom: "a-wd-menus-modals", d: 3, prompt: "When a modal closes, where should keyboard focus go?", options: ["Back to the button that opened it", "To the top of the page", "Nowhere", "To the footer"], correct: "a",
      explanation: "Users continue where they left off.",
      wrong: { b: "They lose their place.", c: "Focus must go somewhere sensible.", d: "Arbitrary." } }),
    q({ id: "wdq98-2", atom: "a-wd-menus-modals", d: 2, prompt: "An accordion button reveals its panel. What must also change?", options: ["Its aria-expanded attribute, to \"true\"", "Its font", "The page title", "Nothing"], correct: "a",
      explanation: "Assistive technology announces the expanded state.",
      wrong: { b: "Visual only.", c: "Unrelated.", d: "The state must be communicated." } }),
    q({ id: "wdq98-3", atom: "a-wd-repeated-actions", d: 2, prompt: "How do you stop a Pay button charging twice when double-clicked?", options: ["Disable it as soon as the payment starts", "Make it smaller", "Hide the price", "Ask users not to"], correct: "a",
      explanation: "A disabled button ignores clicks.",
      wrong: { b: "Still clickable.", c: "Unrelated.", d: "People still will." } }),
    q({ id: "wdq98-4", atom: "a-wd-repeated-actions", d: 3, prompt: "What does debouncing a search input do?", options: ["Runs the search only after typing pauses, not on every keystroke", "Makes typing slower", "Removes the input event", "Searches twice"], correct: "a",
      explanation: "One request after the pause instead of one per letter.",
      wrong: { b: "Typing is unaffected.", c: "It wraps the handler.", d: "Fewer searches, not more." } }),
  ]),
};
