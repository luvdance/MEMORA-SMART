/**
 * ASSESSMENTS · UI/UX DESIGN · MODULE 13 · ACCESSIBILITY, INCLUSIVE DESIGN AND DESIGN ETHICS
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Never import this from anything under src/.
 * ═════════════════════════════════════════════════════════════════════════
 */

import { q, check } from "./ux-helpers.js";

export const ASSESSMENTS = {
  ...check("ux-l53-a11y-foundations", [
    q({
      id: "uxq53-1", atom: "a-ux-digital-accessibility", d: 2,
      prompt: "Which is a situational disability?",
      options: ["Being unable to see a screen clearly in bright sunlight", "Being born blind", "Having arthritis for many years", "Long-term hearing loss"],
      correct: "a",
      explanation: "Situational limits come from the environment, not the person.",
      wrong: { b: "Permanent.", c: "Long-term.", d: "Permanent or long-term." },
    }),
    q({
      id: "uxq53-2", atom: "a-ux-inclusive-design", d: 2,
      prompt: "What does \"solve for one, extend to many\" mean?",
      options: ["A solution designed for one excluded group often helps many others too", "Design only for one user", "Build one feature at a time", "Copy one competitor"],
      correct: "a",
      explanation: "A one-handed design also helps a parent holding a baby.",
      wrong: { b: "The opposite of inclusion.", c: "Unrelated.", d: "Unrelated." },
    }),
    q({
      id: "uxq53-3", atom: "a-ux-wcag-pour", d: 3,
      prompt: "\"All functions are available from a keyboard\" falls under which POUR principle?",
      options: ["Operable", "Perceivable", "Understandable", "Robust"],
      correct: "a",
      explanation: "Operable: the interface can be used whatever the input method.",
      wrong: { b: "About perceiving content.", c: "About comprehension.", d: "About compatibility with assistive technology." },
    }),
    q({
      id: "uxq53-4", atom: "a-ux-contrast-requirements", d: 3,
      prompt: "What contrast does WCAG AA require for an input field's border?",
      options: ["3:1 against the adjacent colour", "4.5:1", "7:1", "No requirement"],
      correct: "a",
      explanation: "1.4.11: user interface components need 3:1.",
      wrong: { b: "That is for normal text.", c: "That is AAA text.", d: "1.4.11 applies." },
    }),
    q({
      id: "uxq53-5", atom: "a-ux-accessible-typography", d: 2,
      prompt: "Why specify font sizes in rem rather than px?",
      options: ["rem grows with the reader's chosen text size; px ignores it", "rem is always larger", "px does not work on phones", "rem uses less data"],
      correct: "a",
      explanation: "People who enlarge text in their settings get larger text.",
      wrong: { b: "It depends on the root size.", c: "px works, but does not respect settings.", d: "Unrelated." },
    }),
  ]),

  ...check("ux-l54-keyboard-sr", [
    q({
      id: "uxq54-1", atom: "a-ux-keyboard", d: 2,
      prompt: "What is a skip link for?",
      options: ["Letting keyboard users jump past the header straight to the main content", "Skipping adverts", "Skipping the sign-up step", "Going to the last page"],
      correct: "a",
      explanation: "Without it, they tab through every header link on every page.",
      wrong: { b: "Unrelated.", c: "Unrelated.", d: "Unrelated." },
    }),
    q({
      id: "uxq54-2", atom: "a-ux-screen-readers", d: 3,
      prompt: "What alt text should a purely decorative image have?",
      options: ["An empty alt attribute: alt=\"\"", "alt=\"decorative image\"", "No alt attribute at all", "A long description"],
      correct: "a",
      explanation: "Empty alt tells screen readers to skip it.",
      wrong: { b: "Wastes the listener's time.", c: "Screen readers may read the file name.", d: "Decoration needs no description." },
    }),
    q({
      id: "uxq54-3", atom: "a-ux-focus-indicators", d: 2,
      prompt: "What is wrong with the CSS rule *:focus { outline: none; }?",
      options: ["It removes the focus indicator keyboard users rely on to see where they are", "It slows the page", "It changes the font", "Nothing"],
      correct: "a",
      explanation: "Never remove focus styles without a visible replacement.",
      wrong: { b: "Not a performance issue.", c: "It does not.", d: "It is a serious accessibility failure." },
    }),
    q({
      id: "uxq54-4", atom: "a-ux-accessible-forms", d: 2,
      prompt: "How should a form error be connected to its field for screen reader users?",
      options: ["With aria-describedby pointing at the error message", "By colouring the field red", "By placing it at the bottom of the page", "With a tooltip on hover"],
      correct: "a",
      explanation: "The message is read when the field is focused.",
      wrong: { b: "Colour alone is not announced.", c: "Too far from the field.", d: "Hover is not available to everyone." },
    }),
  ]),

  ...check("ux-l55-inclusion", [
    q({
      id: "uxq55-1", atom: "a-ux-visual-impairments", d: 2,
      prompt: "How should a payment status be shown so colour-blind users can read it?",
      options: ["With a word and a symbol as well as colour", "With a brighter red", "With a coloured dot only", "With a larger dot"],
      correct: "a",
      explanation: "WCAG 1.4.1: colour must not be the only signal.",
      wrong: { b: "Still colour only.", c: "Colour only.", d: "Size does not convey which status." },
    }),
    q({
      id: "uxq55-2", atom: "a-ux-motor-impairments", d: 2,
      prompt: "A list can be reordered only by dragging. What should be added?",
      options: ["A simple tap or button alternative, such as Move up and Move down", "A longer drag distance", "A tutorial video", "Nothing"],
      correct: "a",
      explanation: "WCAG 2.5.7: dragging needs a single-pointer alternative.",
      wrong: { b: "Makes it harder.", c: "Does not remove the barrier.", d: "Excludes people who cannot drag." },
    }),
    q({
      id: "uxq55-3", atom: "a-ux-cognitive", d: 3, type: "scenario",
      prompt: "A form deletes everything after a silent 5-minute time-out. What is the best fix?",
      options: ["Warn before time-out, allow extending it, and save progress", "Add a visible countdown only", "Shorten the instructions", "Ask users to type faster"],
      correct: "a",
      explanation: "People who need more time are not penalised.",
      wrong: { b: "Adds pressure without saving data.", c: "The limit remains.", d: "Shifts blame to users." },
    }),
    q({
      id: "uxq55-4", atom: "a-ux-literacy", d: 2,
      prompt: "Which helps people with low literacy most?",
      options: ["Plain words, icons paired with text labels, and one question per screen", "Long paragraphs of detail", "Icons with no labels", "Technical terms for accuracy"],
      correct: "a",
      explanation: "Simplicity and redundancy help everyone understand.",
      wrong: { b: "Harder to read.", c: "Icons alone are ambiguous.", d: "Jargon excludes people." },
    }),
    q({
      id: "uxq55-5", atom: "a-ux-cultural-linguistic", d: 2,
      prompt: "How should a language picker list Hausa, Yoruba and Igbo?",
      options: ["Each in its own name and script, such as Hausa, Yorùbá, Igbo", "As country flags", "Only in English", "As language codes such as ha, yo, ig"],
      correct: "a",
      explanation: "People recognise their own language's name.",
      wrong: { b: "Flags represent countries, not languages.", c: "Assumes people read English.", d: "Codes mean nothing to most people." },
    }),
  ]),

  ...check("ux-l56-ethics", [
    q({
      id: "uxq56-1", atom: "a-ux-ethical-design", d: 2,
      prompt: "Which question best tests whether a design is ethical?",
      options: ["Would people be upset if they understood what this design does?", "Will this increase clicks?", "Does it match the brand colours?", "Is it fashionable?"],
      correct: "a",
      explanation: "Honest designs survive being understood.",
      wrong: { b: "A business metric, not an ethical test.", c: "Unrelated.", d: "Unrelated." },
    }),
    q({
      id: "uxq56-2", atom: "a-ux-dark-patterns", d: 3,
      prompt: "\"No thanks, I prefer paying more for data\" is an example of which dark pattern?",
      options: ["Confirmshaming", "Roach motel", "Disguised ads", "Forced continuity"],
      correct: "a",
      explanation: "It guilt-trips people who decline.",
      wrong: { b: "Hard to cancel.", c: "Ads disguised as content.", d: "Trials silently turning paid." },
    }),
    q({
      id: "uxq56-3", atom: "a-ux-privacy-design", d: 2,
      prompt: "When should an app ask for location permission?",
      options: ["When a feature needs it, with a reason, and still working if refused", "Immediately on first launch", "Never explain why", "Only in the terms and conditions"],
      correct: "a",
      explanation: "Just-in-time, explained, optional.",
      wrong: { b: "Without context, people refuse or are alarmed.", c: "People deserve a reason.", d: "Hidden consent is not consent." },
    }),
    q({
      id: "uxq56-4", atom: "a-ux-responsible-data", d: 2,
      prompt: "Which is an irresponsible use of user data?",
      options: ["Messaging a borrower's contacts to shame them into repaying", "Masking account numbers on screen", "Deleting data that is no longer needed", "Explaining why data is collected"],
      correct: "a",
      explanation: "Using data in ways that surprise and harm people is a serious breach.",
      wrong: { b: "Responsible protection.", c: "Responsible minimisation.", d: "Responsible transparency." },
    }),
  ]),
};
