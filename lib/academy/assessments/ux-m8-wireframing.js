/**
 * ASSESSMENTS · UI/UX DESIGN · MODULE 8 · WIREFRAMING AND INTERFACE DESIGN
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Never import this from anything under src/.
 * ═════════════════════════════════════════════════════════════════════════
 */

import { q, check } from "./ux-helpers.js";

export const ASSESSMENTS = {
  ...check("ux-l33-wireframes", [
    q({
      id: "uxq33-1", atom: "a-ux-wireframing", d: 2,
      prompt: "Why are wireframes deliberately free of final colours and images?",
      options: ["To keep discussion on structure and content rather than taste", "Because colour is added by developers", "To save printer ink", "Because Figma cannot show colour in wireframes"],
      correct: "a",
      explanation: "Without styling, people discuss what goes where.",
      wrong: { b: "Designers choose colour.", c: "Unrelated.", d: "Figma shows colour; it is a choice." },
    }),
    q({
      id: "uxq33-2", atom: "a-ux-fidelity", d: 2,
      prompt: "Which describes a mid-fidelity wireframe?",
      options: ["A tidy greyscale digital layout with real headings and placeholder images", "A rough pencil sketch", "The final design with brand colours and photos", "A coded prototype"],
      correct: "a",
      explanation: "Mid fidelity fixes structure without visual styling.",
      wrong: { b: "Low fidelity.", c: "High fidelity.", d: "Code is beyond wireframing." },
    }),
    q({
      id: "uxq33-3", atom: "a-ux-sketching-digital", d: 2,
      prompt: "Why sketch several layouts on paper before working in Figma?",
      options: ["It is the fastest, cheapest way to explore different ideas", "Paper looks more professional", "Figma cannot draw layouts", "Clients only accept paper"],
      correct: "a",
      explanation: "Minutes per sketch makes exploration cheap.",
      wrong: { b: "It is about speed, not polish.", c: "It can.", d: "Not true." },
    }),
    q({
      id: "uxq33-4", atom: "a-ux-layout-structures", d: 3, type: "scenario",
      prompt: "A dashboard has a 240px sidebar on desktop. What usually happens to it on a phone?",
      options: ["It becomes a top bar, a horizontal strip or a menu", "It stays 240px wide beside the content", "It is removed with no replacement", "It becomes a footer of every page"],
      correct: "a",
      explanation: "Navigation must remain, in a form that fits.",
      wrong: { b: "Leaves almost no room for content.", c: "People still need to navigate.", d: "Not the usual pattern." },
    }),
  ]),

  ...check("ux-l34-interface-types", [
    q({
      id: "uxq34-1", atom: "a-ux-website-design", d: 2,
      prompt: "What should every page of a website answer within seconds?",
      options: ["What is this, and what can I do here?", "Who designed it?", "How old is the company?", "Which framework was used?"],
      correct: "a",
      explanation: "A clear title and purpose orient visitors.",
      wrong: { b: "Irrelevant to visitors.", c: "Rarely the visitor's question.", d: "Visitors do not care." },
    }),
    q({
      id: "uxq34-2", atom: "a-ux-mobile-app-design", d: 2,
      prompt: "Where should a mobile app's main actions usually sit?",
      options: ["Within thumb reach, towards the bottom", "In the top-left corner", "Hidden in a menu", "In the status bar"],
      correct: "a",
      explanation: "One-handed use makes the bottom easiest to reach.",
      wrong: { b: "Hardest place for a thumb.", c: "Hidden actions are used less.", d: "Reserved for the system." },
    }),
    q({
      id: "uxq34-3", atom: "a-ux-dashboard-design", d: 3,
      prompt: "Where should a dashboard's most important numbers usually go?",
      options: ["As summary tiles at the top left", "At the bottom of the page", "In a tooltip", "In the footer"],
      correct: "a",
      explanation: "The eye starts top left; summaries come first, then trends, then detail.",
      wrong: { b: "Many users never scroll there.", c: "Hidden until hovered.", d: "The least-read area." },
    }),
    q({
      id: "uxq34-4", atom: "a-ux-ecommerce-design", d: 2,
      prompt: "How should an unavailable size be shown on a product page?",
      options: ["Struck through and greyed, still readable, not by colour alone", "Removed with no explanation", "In red only", "Hidden behind a tooltip"],
      correct: "a",
      explanation: "A non-colour signal works for everyone.",
      wrong: { b: "People may think the size does not exist.", c: "Colour alone fails colour-blind users.", d: "Hidden information is missed." },
    }),
  ]),

  ...check("ux-l35-components", [
    q({
      id: "uxq35-1", atom: "a-ux-forms-tables", d: 3,
      prompt: "How should numbers be aligned in a table column?",
      options: ["Right-aligned with tabular figures, so place values line up", "Centred", "Left-aligned like text", "Justified"],
      correct: "a",
      explanation: "Thousands sit under thousands, making comparison easy.",
      wrong: { b: "Digits do not line up.", c: "Different lengths misalign place values.", d: "Not used for numbers." },
    }),
    q({
      id: "uxq35-2", atom: "a-ux-cards-menus", d: 2,
      prompt: "What makes a set of cards feel consistent?",
      options: ["The same padding, radius, image ratio and element order on every card", "A different colour for each card", "Random sizes for variety", "As many buttons as possible on each"],
      correct: "a",
      explanation: "Repetition makes a set scannable.",
      wrong: { b: "Colour variety implies different meanings.", c: "Breaks the grid.", d: "Dilutes the action." },
    }),
    q({
      id: "uxq35-3", atom: "a-ux-modals-dropdowns", d: 3,
      prompt: "When is a modal the right choice?",
      options: ["For a decision that must be made now, such as confirming a deletion", "For the main content of the page", "For a newsletter offer on arrival", "For every confirmation message"],
      correct: "a",
      explanation: "Modals interrupt, so the interruption must be worth it.",
      wrong: { b: "Content belongs in the page.", c: "Interrupts before value is shown.", d: "Toasts suit brief confirmations." },
    }),
    q({
      id: "uxq35-4", atom: "a-ux-ui-states", d: 2,
      prompt: "Why are skeleton screens often better than a lone spinner?",
      options: ["They show the shape of what is coming and stop the page jumping when it loads", "They load faster", "They use less data", "They hide errors"],
      correct: "a",
      explanation: "They set expectations and keep the layout stable.",
      wrong: { b: "Loading time is the same.", c: "Not meaningfully.", d: "Errors still need their own state." },
    }),
  ]),

  ...check("ux-l36-consistency", [
    q({
      id: "uxq36-1", atom: "a-ux-ui-consistency", d: 2,
      prompt: "What is a consistency audit?",
      options: ["Putting every button, card and heading from all screens side by side and counting the variations", "A financial review", "A survey of users", "A code review"],
      correct: "a",
      explanation: "It reveals drift that is invisible screen by screen.",
      wrong: { b: "Unrelated.", c: "That is research.", d: "That is engineering." },
    }),
    q({
      id: "uxq36-2", atom: "a-ux-practical-hierarchy", d: 3, type: "scenario",
      prompt: "On one screen a section heading is bigger and purple, though the section is no more important. What do users assume?",
      options: ["That the section is more important than the others", "Nothing", "That it is a link", "That it is an error"],
      correct: "a",
      explanation: "Visual difference implies a difference in meaning.",
      wrong: { b: "People read meaning into differences.", c: "Possibly, which is also a problem.", d: "Purple does not usually signal errors." },
    }),
    q({
      id: "uxq36-3", atom: "a-ux-real-products", d: 2,
      prompt: "Why test designs with real content, such as the longest real name?",
      options: ["Real content breaks layouts that placeholder content hides", "Real content looks nicer", "Placeholders are illegal", "It makes the file smaller"],
      correct: "a",
      explanation: "Long names, many digits and missing photos are everyday reality.",
      wrong: { b: "The point is robustness.", c: "Not true.", d: "Unrelated." },
    }),
    q({
      id: "uxq36-4", atom: "a-ux-real-products", d: 2,
      prompt: "An empty section shows nothing at all. What should it show?",
      options: ["Why it is empty and an action to fill it", "A loading spinner", "An error code", "Nothing; empty is fine"],
      correct: "a",
      explanation: "Empty states guide the next step.",
      wrong: { b: "It is not loading.", c: "Empty is not an error.", d: "Blank areas look broken." },
    }),
  ]),
};
