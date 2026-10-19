/**
 * ASSESSMENTS · RESPONSIVE WEB DEVELOPMENT · MODULE 11 · MODERN CSS TECHNIQUES
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Never import this from anything under src/.
 * ═════════════════════════════════════════════════════════════════════════
 */

import { q, check } from "./wd-helpers.js";

export const ASSESSMENTS = {
  ...check("wd-l43-motion", [
    q({
      id: "wdq43-1", atom: "a-wd-transitions", d: 2,
      prompt: "Where should the transition property be written?",
      options: ["On the element's normal state, so it animates both into and out of :hover", "Only inside :hover", "In the HTML", "Inside @keyframes"],
      correct: "a",
      explanation: "On the base rule, the transition applies in both directions.",
      wrong: { b: "Then it only animates going in, and snaps back.", c: "Transitions are CSS.", d: "Keyframes are a separate mechanism." },
    }),
    q({
      id: "wdq43-2", atom: "a-wd-transitions", d: 2,
      prompt: "How long should a typical hover transition on a button be?",
      options: ["About 150 to 300 milliseconds", "2 to 3 seconds", "10 milliseconds", "One minute"],
      correct: "a",
      explanation: "Long enough to notice, short enough never to feel slow.",
      wrong: { b: "Feels sluggish.", c: "Too fast to see.", d: "Absurd for an interface." },
    }),
    q({
      id: "wdq43-3", atom: "a-wd-transforms", d: 3,
      prompt: "Why are transform and opacity preferred for animation?",
      options: ["They do not trigger layout, so the browser can animate them smoothly", "They are the only animatable properties", "They work without CSS", "They are invisible"],
      correct: "a",
      explanation: "Animating width or top recalculates layout every frame; transforms do not.",
      wrong: { b: "Many properties animate; these are the cheapest.", c: "They are CSS properties.", d: "They are visible changes." },
    }),
    q({
      id: "wdq43-4", atom: "a-wd-keyframes", d: 2,
      prompt: "What does animation: spin 1s linear infinite do?",
      options: ["Runs the @keyframes named spin, one second per cycle, at constant speed, forever", "Spins the element once", "Waits one second, then hides it", "Creates keyframes called linear"],
      correct: "a",
      explanation: "Name, duration, timing function and iteration count.",
      wrong: { b: "infinite repeats forever.", c: "There is no hiding.", d: "linear is the timing function." },
    }),
  ]),

  ...check("wd-l44-states", [
    q({
      id: "wdq44-1", atom: "a-wd-hover-focus-active", d: 2,
      prompt: "Why must important content never be shown only on :hover?",
      options: ["Touch screens have no real hover, and keyboard users never trigger it", "Hover is not supported in Chrome", "Hover makes pages slow", "Hover only works on images"],
      correct: "a",
      explanation: "Phone users and keyboard users would never see it.",
      wrong: { b: "It is supported.", c: "Performance is not the problem.", d: "It works on any element." },
    }),
    q({
      id: "wdq44-2", atom: "a-wd-hover-focus-active", d: 2,
      prompt: "When does :active apply to a button?",
      options: ["While it is being pressed", "After it has been clicked once", "Whenever it is visible", "When it is disabled"],
      correct: "a",
      explanation: ":active lasts while the pointer or key is held down.",
      wrong: { b: "There is no lasting clicked state.", c: "That is always.", d: "Disabled buttons cannot become active." },
    }),
    q({
      id: "wdq44-3", atom: "a-wd-focus-visible", d: 3, type: "scenario",
      prompt: "A stylesheet contains *:focus { outline: none; } and nothing else about focus. What is the effect?",
      options: ["Keyboard users cannot see which element they are on", "Nothing important", "The page loads faster", "Links stop working"],
      correct: "a",
      explanation: "It fails WCAG 2.4.7. Style :focus-visible instead of removing the outline.",
      wrong: { b: "It makes keyboard use almost impossible.", c: "No speed effect.", d: "Links work; you just cannot see focus." },
    }),
    q({
      id: "wdq44-4", atom: "a-wd-focus-visible", d: 2,
      prompt: "What is the advantage of :focus-visible over :focus?",
      options: ["The browser shows it when focus should be visible, mainly for keyboard users, not on every mouse click", "It works without CSS", "It is faster", "It hides the focus ring for everyone"],
      correct: "a",
      explanation: "It keeps the ring for those who need it and avoids it after mouse clicks on buttons.",
      wrong: { b: "It is a CSS selector.", c: "Speed is unaffected.", d: "It shows the ring, selectively." },
    }),
  ]),

  ...check("wd-l45-themes-functions", [
    q({
      id: "wdq45-1", atom: "a-wd-themes", d: 3,
      prompt: "How does a [data-theme=\"dark\"] selector switch a whole site's colours?",
      options: ["It redefines the custom properties that every component uses", "It inverts every colour automatically", "It loads a second stylesheet", "It changes the HTML"],
      correct: "a",
      explanation: "Components use var(); new values cascade to all of them.",
      wrong: { b: "Nothing is inverted; you choose the values.", c: "One stylesheet is enough.", d: "Only the attribute changes." },
    }),
    q({
      id: "wdq45-2", atom: "a-wd-css-functions", d: 2,
      prompt: "What does width: min(100% - 32px, 960px) do?",
      options: ["Fills the space minus 32px on small screens, and stops at 960px", "Is always 960px", "Is always 32px", "Is invalid CSS"],
      correct: "a",
      explanation: "min() picks the smaller of the two values at each width.",
      wrong: { b: "Only on wide screens.", c: "32px is subtracted, not the result.", d: "It is valid in all modern browsers." },
    }),
    q({
      id: "wdq45-3", atom: "a-wd-css-functions", d: 3,
      prompt: "Why does calc(100%-200px) not work?",
      options: ["The - operator needs spaces around it: calc(100% - 200px)", "calc cannot mix units", "Percentages are not allowed", "200px is too large"],
      correct: "a",
      explanation: "Without spaces, -200px is read as a negative number, not a subtraction.",
      wrong: { b: "Mixing units is exactly what calc is for.", c: "They are allowed.", d: "Size is not the problem." },
    }),
    q({
      id: "wdq45-4", atom: "a-wd-css-functions", d: 2,
      prompt: "Which function guarantees a button is at least 44px tall but grows if its text is larger?",
      options: ["min-height: max(44px, 2.5em)", "min-height: min(44px, 2.5em)", "height: 44px", "height: calc(44px)"],
      correct: "a",
      explanation: "max() picks the larger value.",
      wrong: { b: "min() would cap it at 44px or less.", c: "A fixed height does not grow.", d: "Still a fixed 44px." },
    }),
  ]),

  ...check("wd-l46-advanced-grid", [
    q({
      id: "wdq46-1", atom: "a-wd-grid-areas", d: 3,
      prompt: "In grid-template-areas: \"header header\" \"nav main\", what does repeating header do?",
      options: ["Makes the header area span both columns", "Creates two headers", "Hides the header", "Nothing"],
      correct: "a",
      explanation: "An area name repeated across a row spans those cells.",
      wrong: { b: "One element is placed in the area.", c: "Nothing is hidden.", d: "It defines the span." },
    }),
    q({
      id: "wdq46-2", atom: "a-wd-grid-areas", d: 3,
      prompt: "You rearrange areas visually with grid. What must stay sensible?",
      options: ["The HTML order, because screen readers and keyboard focus follow it", "The CSS file name", "The number of media queries", "The colour scheme"],
      correct: "a",
      explanation: "Visual order can change; reading and tab order follow the source.",
      wrong: { b: "Irrelevant.", c: "Irrelevant to order.", d: "Unrelated." },
    }),
    q({
      id: "wdq46-3", atom: "a-wd-aspect-ratio", d: 2,
      prompt: "What does aspect-ratio: 16 / 9 do on a box whose width is fluid?",
      options: ["Keeps its height in 16:9 proportion to its width at every size", "Sets it to 16px by 9px", "Crops its content", "Rotates it"],
      correct: "a",
      explanation: "Height follows width, preserving the shape.",
      wrong: { b: "It is a ratio, not a size.", c: "Cropping is object-fit.", d: "No rotation." },
    }),
    q({
      id: "wdq46-4", atom: "a-wd-aspect-ratio", d: 2,
      prompt: "How does aspect-ratio help page loading?",
      options: ["Space is reserved before the media loads, so content below does not jump", "It compresses images", "It loads videos faster", "It is only decorative"],
      correct: "a",
      explanation: "It prevents layout shift, a Core Web Vital (Module 35).",
      wrong: { b: "No compression.", c: "Download speed is unchanged.", d: "It has a real performance benefit." },
    }),
  ]),

  ...check("wd-l47-preferences-architecture", [
    q({
      id: "wdq47-1", atom: "a-wd-dark-mode", d: 2,
      prompt: "When does @media (prefers-color-scheme: dark) apply?",
      options: ["When the visitor's device or browser is set to dark mode", "At night", "On all phones", "When the page has a dark image"],
      correct: "a",
      explanation: "It follows the visitor's system preference.",
      wrong: { b: "Clock time is not involved.", c: "Only if the phone is in dark mode.", d: "Content is irrelevant." },
    }),
    q({
      id: "wdq47-2", atom: "a-wd-dark-mode", d: 3,
      prompt: "Which choice suits a dark theme best?",
      options: ["A very dark grey background with slightly dimmed text", "Pure black with pure white text everywhere", "Inverting every colour, including photos", "Keeping all bright saturated colours"],
      correct: "a",
      explanation: "Pure white on black glares; inverted photos look wrong.",
      wrong: { b: "Harsh contrast causes eye strain and halation.", c: "Photos should not be inverted.", d: "Large saturated areas glare on dark backgrounds." },
    }),
    q({
      id: "wdq47-3", atom: "a-wd-reduced-motion", d: 2,
      prompt: "Who benefits from prefers-reduced-motion?",
      options: ["People made dizzy or distracted by on-screen motion, such as those with vestibular disorders", "Only people on slow connections", "Search engines", "Nobody; it is cosmetic"],
      correct: "a",
      explanation: "Motion can cause real physical symptoms.",
      wrong: { b: "Connection speed is a separate issue.", c: "Search engines are unaffected.", d: "It is an accessibility setting." },
    }),
    q({
      id: "wdq47-4", atom: "a-wd-css-architecture", d: 2,
      prompt: "In BEM, what kind of class is .card__title?",
      options: ["An element of the card block", "A modifier", "A new block", "A utility"],
      correct: "a",
      explanation: "Double underscore marks an element, a part of the block.",
      wrong: { b: "Modifiers use a double hyphen: .card--featured.", c: "It belongs to the card block.", d: "Utilities are single-purpose helpers such as .visually-hidden." },
    }),
  ]),
};
