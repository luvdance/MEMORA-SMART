/**
 * ASSESSMENTS · REACT DEVELOPMENT · MODULE 10 · STYLING AND PROFESSIONAL INTERFACE DEVELOPMENT
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Never import this from anything under src/.
 * ═════════════════════════════════════════════════════════════════════════
 */

import { q, check } from "./rx-helpers.js";

export const ASSESSMENTS = {
  ...check("rx-l58-css-modules", [
    q({ id: "rxq58-1", atom: "a-rx-css-modules", d: 2, prompt: "Why can two components' .title classes clash even when each imports its own CSS file?", options: ["Imported plain CSS is still global once the app is built", "Vite merges classes randomly", "React renames classes", "Only Tailwind is scoped"], correct: "a",
      explanation: "Use CSS Modules to scope them.",
      wrong: { b: "Load order decides, deterministically.", c: "React does not touch class names.", d: "CSS Modules are scoped too." } }),
    q({ id: "rxq58-2", atom: "a-rx-css-modules", d: 2, prompt: "How do you use a class from Card.module.css?", options: ["import styles from \"./Card.module.css\"; className={styles.title}", "className=\"title\"", "import \"./Card.module.css\" and className=\"Card.title\"", "style={styles.title}"], correct: "a",
      explanation: "The module exports a map of generated names.",
      wrong: { b: "That class does not exist after scoping.", c: "Not how modules work.", d: "style takes CSS properties." } }),
    q({ id: "rxq58-3", atom: "a-rx-scoping-strategies", d: 2, prompt: "What matters most when choosing a styling approach for a team?", options: ["Using one approach consistently across the codebase", "Using every approach for flexibility", "Choosing the newest library", "Avoiding CSS entirely"], correct: "a",
      explanation: "Mixed systems are hard to maintain.",
      wrong: { b: "Inconsistency costs more than any single choice.", c: "Newness is not a reason.", d: "Every approach is CSS underneath." } }),
    q({ id: "rxq58-4", atom: "a-rx-responsive-layout", d: 3, prompt: "A long word in a grid cell makes a phone page scroll sideways. What often fixes it?", options: ["min-width: 0 on the grid or flex child", "position: absolute", "z-index: 10", "float: left"], correct: "a",
      explanation: "Grid and flex children default to min-width: auto.",
      wrong: { b: "Breaks the layout.", c: "Unrelated.", d: "Unrelated." } }),
  ]),

  ...check("rx-l59-tokens", [
    q({ id: "rxq59-1", atom: "a-rx-mobile-first", d: 2, prompt: "In mobile-first CSS, where are the phone styles?", options: ["In the default rules, outside any media query", "Inside @media (max-width: 600px)", "In a separate phone.css", "Inline in the JSX"], correct: "a",
      explanation: "Wider layouts are added with min-width queries.",
      wrong: { b: "That is desktop-first.", c: "Unnecessary.", d: "No media queries inline." } }),
    q({ id: "rxq59-2", atom: "a-rx-design-tokens", d: 2, prompt: "What is the benefit of design tokens such as --space-4?", options: ["One change updates every component, and spacing stays consistent", "They make CSS run faster", "They are required by React", "They hide styles from users"], correct: "a",
      explanation: "Decisions written down once.",
      wrong: { b: "Not about speed.", c: "Not required.", d: "Unrelated." } }),
    q({ id: "rxq59-3", atom: "a-rx-theme-switching", d: 3, prompt: "How does setting data-theme=\"dark\" on <html> change every component's colours?", options: ["The attribute selector redefines the CSS variables, and every var() use picks up the new values", "React re-renders every component", "The browser inverts the colours", "Each component checks the attribute"], correct: "a",
      explanation: "Variables cascade.",
      wrong: { b: "Nothing re-renders.", c: "No inversion.", d: "They only use var()." } }),
    q({ id: "rxq59-4", atom: "a-rx-design-tokens", d: 2, prompt: "Why use a spacing scale (4, 8, 12, 16, 24, 32px) rather than any value?", options: ["Spacing looks deliberate and consistent across components", "Browsers only support those values", "It makes CSS faster", "Tailwind requires it everywhere"], correct: "a",
      explanation: "A scale is a design decision written down.",
      wrong: { b: "Any length works.", c: "Not about speed.", d: "Not only a Tailwind idea." } }),
  ]),

  ...check("rx-l60-tailwind", [
    q({ id: "rxq60-1", atom: "a-rx-conditional-classes", d: 2, prompt: "When is an inline style the right choice?", options: ["For a truly continuous value, such as a progress bar's width", "For hover states", "For media queries", "For every colour"], correct: "a",
      explanation: "Discrete states belong in classes.",
      wrong: { b: "Inline styles cannot do :hover.", c: "Inline styles cannot do media queries.", d: "Use classes and tokens." } }),
    q({ id: "rxq60-2", atom: "a-rx-tailwind", d: 2, prompt: "What does md:grid-cols-3 mean in Tailwind?", options: ["Three grid columns from the md breakpoint (768px) up", "Three columns only on medium phones", "Medium-sized columns", "Three columns below 768px"], correct: "a",
      explanation: "Prefixes apply from that width up.",
      wrong: { b: "md means 768px and wider.", c: "Unrelated.", d: "It is min-width." } }),
    q({ id: "rxq60-3", atom: "a-rx-tailwind", d: 2, prompt: "The same long Tailwind class list appears on 20 buttons. What should you do?", options: ["Make a Button component that applies it once", "Keep copying it", "Move it to inline styles", "Stop using Tailwind"], correct: "a",
      explanation: "Components are the unit of reuse.",
      wrong: { b: "Twenty places to change.", c: "Loses Tailwind's variants.", d: "Unnecessary." } }),
    q({ id: "rxq60-4", atom: "a-rx-component-libraries", d: 3, prompt: "How is shadcn/ui different from Material UI?", options: ["shadcn/ui copies component source into your project for you to own; MUI is an installed package you theme", "They are the same", "MUI copies source; shadcn is a package", "shadcn/ui has no accessibility"], correct: "a",
      explanation: "Ownership versus dependency.",
      wrong: { b: "They differ.", c: "Reversed.", d: "It builds on accessible Radix primitives." } }),
  ]),

  ...check("rx-l61-widgets", [
    q({ id: "rxq61-1", atom: "a-rx-tabs-modals", d: 2, prompt: "Which keys should move between tabs in an accessible tab list?", options: ["Left and Right arrows", "Tab only", "Enter only", "Page Up and Page Down"], correct: "a",
      explanation: "Tab moves into and out of the tablist; arrows move within it.",
      wrong: { b: "Tab leaves the tablist.", c: "Enter activates.", d: "Not the pattern." } }),
    q({ id: "rxq61-2", atom: "a-rx-tabs-modals", d: 2, prompt: "What should happen to focus when a modal closes?", options: ["It returns to the button that opened it", "It goes to the top of the page", "Nowhere", "To the browser's address bar"], correct: "a",
      explanation: "Keyboard users continue where they were.",
      wrong: { b: "They lose their place.", c: "Focus is lost.", d: "Outside the page." } }),
    q({ id: "rxq61-3", atom: "a-rx-skeletons-toasts", d: 2, prompt: "Why must a toast's auto-dismiss timer be cleared in a cleanup?", options: ["So it does not fire after the toast is gone, or when a new toast replaces it", "Timers slow down the page", "React requires all timers to be cleared", "To make the toast stay forever"], correct: "a",
      explanation: "Every effect that starts something stops it.",
      wrong: { b: "Not the reason.", c: "A good habit, but the real reason is correctness.", d: "The opposite." } }),
    q({ id: "rxq61-4", atom: "a-rx-contrast-focus", d: 2, prompt: "What contrast does WCAG AA require for normal-size text?", options: ["4.5:1", "2:1", "3:1", "10:1"], correct: "a",
      explanation: "3:1 is for large text and UI parts.",
      wrong: { b: "Too low.", c: "Only for large text.", d: "AAA-level and beyond." } }),
    q({ id: "rxq61-5", atom: "a-rx-contrast-focus", d: 2, prompt: "Why style :focus-visible instead of removing outlines?", options: ["Keyboard users need to see where focus is; :focus-visible shows it for them without affecting mouse clicks", "Outlines are ugly", "It is faster", "Browsers require it"], correct: "a",
      explanation: "Never remove focus indicators without a replacement.",
      wrong: { b: "Restyle them; do not remove them.", c: "Unrelated.", d: "Not required, but essential." } }),
  ]),

  ...check("rx-l62-dark-figma", [
    q({ id: "rxq62-1", atom: "a-rx-dark-mode", d: 2, prompt: "What does the \"System\" theme choice follow?", options: ["The operating system's setting, through prefers-color-scheme", "The time of day", "The last theme used by anyone", "The browser's zoom level"], correct: "a",
      explanation: "matchMedia(\"(prefers-color-scheme: dark)\").",
      wrong: { b: "Unrelated.", c: "Unrelated.", d: "Unrelated." } }),
    q({ id: "rxq62-2", atom: "a-rx-dark-mode", d: 3, prompt: "How do real apps avoid a flash of the wrong theme on load?", options: ["A tiny inline script in index.html sets the theme attribute before React loads", "They wait for React to render", "They hide the page for a second", "They use only dark mode"], correct: "a",
      explanation: "It runs before the first paint.",
      wrong: { b: "Too late: the first paint has happened.", c: "Unpleasant.", d: "Ignores user choice." } }),
    q({ id: "rxq62-3", atom: "a-rx-figma", d: 2, prompt: "What does Figma's Auto Layout correspond to in CSS?", options: ["Flexbox: direction, gap, padding and alignment", "Absolute positioning", "Tables", "Floats"], correct: "a",
      explanation: "A near one-to-one mapping.",
      wrong: { b: "Do not copy absolute positions.", c: "Unrelated.", d: "Unrelated." } }),
    q({ id: "rxq62-4", atom: "a-rx-figma", d: 2, prompt: "A design shows only the normal state of a form. What should you ask the designer about?", options: ["Hover, focus, error, empty, loading and long-text states", "The font file's licence only", "Nothing", "The database schema"], correct: "a",
      explanation: "Real components have many states.",
      wrong: { b: "Relevant, but not the main gap.", c: "You will have to invent them.", d: "Unrelated." } }),
  ]),

  ...check("rx-l63-m10-project", [
    q({ id: "rxq63-1", atom: "a-rx-m10-project", d: 2, prompt: "On a phone, how should the dashboard's navigation behave?", options: ["Links behind a Menu button with aria-expanded that toggles them", "Hidden with no way to open them", "A 240px sidebar squeezed beside the content", "Links in a tooltip"], correct: "a",
      explanation: "Disclosure pattern for small screens.",
      wrong: { b: "Unusable.", c: "Leaves no room for content.", d: "Not a navigation pattern." } }),
    q({ id: "rxq63-2", atom: "a-rx-m10-project", d: 3, prompt: "Why define the theme colours as CSS variables instead of separate dark CSS files?", options: ["Components use var() once; switching the variables switches everything", "Separate files cannot be loaded", "Variables are required by React", "It makes the bundle bigger"], correct: "a",
      explanation: "One attribute change, every colour.",
      wrong: { b: "They can, but it is clumsier.", c: "Not required.", d: "The opposite." } }),
    q({ id: "rxq63-3", atom: "a-rx-m10-project", d: 2, prompt: "Which check shows the dashboard is accessible in dark mode too?", options: ["Text and background contrast is at least 4.5:1 in both themes", "It looks nice", "It is dark", "It loads quickly"], correct: "a",
      explanation: "Each theme needs its own contrast check.",
      wrong: { b: "Not measurable.", c: "Dark is not automatically readable.", d: "Unrelated." } }),
    q({ id: "rxq63-4", atom: "a-rx-m10-project", d: 2, prompt: "At which width should the dashboard's sidebar layout start?", options: ["At a min-width breakpoint, with the phone layout as the default", "At every width", "Below a max-width breakpoint", "Only when printed"], correct: "a",
      explanation: "Mobile first.",
      wrong: { b: "No room on phones.", c: "Desktop-first.", d: "Unrelated." } }),
  ]),
};
