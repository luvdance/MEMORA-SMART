/**
 * ASSESSMENTS · UI/UX DESIGN · MODULE 12 · DESIGN SYSTEMS AND COMPONENT ARCHITECTURE
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Never import this from anything under src/.
 * ═════════════════════════════════════════════════════════════════════════
 */

import { q, check } from "./ux-helpers.js";

export const ASSESSMENTS = {
  ...check("ux-l49-tokens", [
    q({
      id: "uxq49-1", atom: "a-ux-design-system", d: 2,
      prompt: "What does a design system include that a style guide usually does not?",
      options: ["Working, reusable components in design and code, with guidelines and a process for change", "A colour palette", "A logo", "Typography choices"],
      correct: "a",
      explanation: "A style guide documents the look; a design system provides the parts to build with.",
      wrong: { b: "Style guides include colours.", c: "Style guides include logo usage.", d: "Style guides include type." },
    }),
    q({
      id: "uxq49-2", atom: "a-ux-design-tokens", d: 3,
      prompt: "Why should components use semantic tokens such as --color-action rather than primitives such as --purple-700?",
      options: ["So a rebrand or dark mode changes a few semantic mappings instead of every component", "Primitives are slower", "Semantic tokens are shorter", "Browsers cannot read primitives"],
      correct: "a",
      explanation: "Semantic tokens name the purpose, which stays constant when colours change.",
      wrong: { b: "Performance is the same.", c: "Length is irrelevant.", d: "They can." },
    }),
    q({
      id: "uxq49-3", atom: "a-ux-colour-tokens", d: 2,
      prompt: "Which is the best name for the token used for error text?",
      options: ["--color-danger", "--red", "--colour-1", "--bright"],
      correct: "a",
      explanation: "Name by role, not appearance.",
      wrong: { b: "Describes appearance, which may change.", c: "Says nothing.", d: "Vague and appearance-based." },
    }),
    q({
      id: "uxq49-4", atom: "a-ux-type-spacing-tokens", d: 2,
      prompt: "Which of these is a spacing token?",
      options: ["--space-4: 24px", "--font-size-body: 16px", "--color-text: #111827", "--radius-md: 8px"],
      correct: "a",
      explanation: "Spacing tokens hold the spacing scale.",
      wrong: { b: "A typography token.", c: "A colour token.", d: "A radius token." },
    }),
    q({
      id: "uxq49-5", atom: "a-ux-grid-systems", d: 2,
      prompt: "What should a design system's grid definition include?",
      options: ["Columns, gutters, margins and maximum widths for each breakpoint", "Only the colour of the grid lines", "One grid for desktop only", "Nothing; each team chooses"],
      correct: "a",
      explanation: "A shared grid keeps every team's screens aligned.",
      wrong: { b: "Irrelevant.", c: "Every breakpoint needs a grid.", d: "That causes misalignment." },
    }),
  ]),

  ...check("ux-l50-atomic", [
    q({
      id: "uxq50-1", atom: "a-ux-component-architecture", d: 2,
      prompt: "What does composition mean in component architecture?",
      options: ["Building larger components from smaller ones", "Writing music for the product", "Putting every option into one giant component", "Choosing the font"],
      correct: "a",
      explanation: "An input field is composed of a label, an input and a message.",
      wrong: { b: "Unrelated.", c: "The opposite of composition.", d: "Unrelated." },
    }),
    q({
      id: "uxq50-2", atom: "a-ux-atomic-design", d: 2,
      prompt: "In atomic design, a search form made of a label, an input and a button is a…",
      options: ["Molecule", "Atom", "Organism", "Template"],
      correct: "a",
      explanation: "A simple group of atoms working as a unit.",
      wrong: { b: "Its parts are atoms.", c: "Organisms are complex sections.", d: "Templates are page layouts." },
    }),
    q({
      id: "uxq50-3", atom: "a-ux-atomic-design", d: 3,
      prompt: "What distinguishes a page from a template in atomic design?",
      options: ["A page has real content; a template has placeholders", "A page is smaller", "A template has real content", "There is no difference"],
      correct: "a",
      explanation: "Pages test whether the system holds up with real content.",
      wrong: { b: "Size is not the difference.", c: "The reverse.", d: "Content is the difference." },
    }),
    q({
      id: "uxq50-4", atom: "a-ux-reusable-components", d: 2,
      prompt: "Before creating a new component, what should you check?",
      options: ["Whether an existing component, perhaps with a new variant, can do the job", "Whether the new one can have a different radius", "Whether it uses a new colour", "Nothing; new components are always good"],
      correct: "a",
      explanation: "Extend before you create.",
      wrong: { b: "Small differences are drift.", c: "New colours are drift.", d: "Every component has a maintenance cost." },
    }),
  ]),

  ...check("ux-l51-variants", [
    q({
      id: "uxq51-1", atom: "a-ux-component-variants", d: 2,
      prompt: "In a button component, what belongs in the base rather than the variants?",
      options: ["Height, radius, font and focus ring", "Only the primary colour", "The danger colour", "Nothing"],
      correct: "a",
      explanation: "Variants change only what differs, usually colour.",
      wrong: { b: "Colours belong to variants.", c: "A variant property.", d: "The base holds everything shared." },
    }),
    q({
      id: "uxq51-2", atom: "a-ux-component-states", d: 2,
      prompt: "Which state is most often missing from design files?",
      options: ["Focus, loading or error states", "The default state", "The hover state on desktop", "The logo"],
      correct: "a",
      explanation: "Designers often draw only the default and hover.",
      wrong: { b: "Always drawn.", c: "Often drawn.", d: "Not a component state." },
    }),
    q({
      id: "uxq51-3", atom: "a-ux-naming-conventions", d: 3,
      prompt: "In BEM naming, what is .btn--danger?",
      options: ["A modifier of the btn block", "An element of the btn block", "A new block", "An ID"],
      correct: "a",
      explanation: "block__element--modifier: double hyphen marks a modifier.",
      wrong: { b: "Elements use double underscores.", c: "It modifies btn.", d: "IDs use #." },
    }),
    q({
      id: "uxq51-4", atom: "a-ux-shared-libraries", d: 2,
      prompt: "Why version a design system's libraries and publish release notes?",
      options: ["So teams know what changed, whether anything breaks, and can upgrade safely", "To make the library bigger", "Because Figma requires it", "To hide changes"],
      correct: "a",
      explanation: "Clear versions make upgrades predictable.",
      wrong: { b: "Not the purpose.", c: "Not required.", d: "The opposite." },
    }),
  ]),

  ...check("ux-l52-documentation", [
    q({
      id: "uxq52-1", atom: "a-ux-design-documentation", d: 2,
      prompt: "What should component documentation answer first?",
      options: ["What the component is, and when to use it and when not", "Who designed it", "How long it took", "Which font file it uses"],
      correct: "a",
      explanation: "Usage guidance prevents misuse.",
      wrong: { b: "Not useful to users of the system.", c: "Irrelevant.", d: "A detail, not the first question." },
    }),
    q({
      id: "uxq52-2", atom: "a-ux-maintaining-consistency", d: 2,
      prompt: "A team keeps working around the design system. What might that signal?",
      options: ["The system may be missing something real that the team needs", "The team is lazy", "The system is perfect", "The team should be removed"],
      correct: "a",
      explanation: "Workarounds are feedback on gaps.",
      wrong: { b: "Blaming teams hides system gaps.", c: "Workarounds suggest otherwise.", d: "Not a sensible response." },
    }),
    q({
      id: "uxq52-3", atom: "a-ux-scaling-systems", d: 3, type: "scenario",
      prompt: "Two apps with different brand colours keep separate copies of every component. What is the scalable fix?",
      options: ["Shared components on semantic tokens, with a token theme per brand", "Keep fixing both copies", "Force one brand colour", "Abandon the system"],
      correct: "a",
      explanation: "Theming through tokens serves many brands with one set of components.",
      wrong: { b: "Double work forever.", c: "Ignores a real requirement.", d: "Makes things worse." },
    }),
    q({
      id: "uxq52-4", atom: "a-ux-system-accessibility", d: 2,
      prompt: "Why build accessibility into the design system itself?",
      options: ["Every product that uses the system inherits it", "It is cheaper to ignore it", "Only the system team uses it", "Accessibility cannot be designed"],
      correct: "a",
      explanation: "Accessible tokens and components spread to every screen.",
      wrong: { b: "Ignoring it is costly later.", c: "Every product team uses it.", d: "It can and must be designed." },
    }),
  ]),
};
