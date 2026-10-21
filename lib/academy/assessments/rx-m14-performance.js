/**
 * ASSESSMENTS · REACT DEVELOPMENT · MODULE 14 · PERFORMANCE, ACCESSIBILITY AND PRODUCTION READINESS
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Never import this from anything under src/.
 * ═════════════════════════════════════════════════════════════════════════
 */

import { q, check } from "./rx-helpers.js";

export const ASSESSMENTS = {
  ...check("rx-l81-rerenders", [
    q({ id: "rxq81-1", atom: "a-rx-rerendering", d: 2, prompt: "Typing in a search box in Dashboard re-renders an expensive chart beside it. What is often the simplest fix?", options: ["Move the search state down into a SearchBox component", "Wrap the whole app in memo", "Use a class component", "Debounce rendering"], correct: "a",
      explanation: "State only re-renders its owner's subtree.",
      wrong: { b: "Unneeded complexity.", c: "Unrelated.", d: "Not a thing." } }),
    q({ id: "rxq81-2", atom: "a-rx-measure-first", d: 2, prompt: "Why profile a production build rather than the dev server?", options: ["The development build is deliberately slower and distorts measurements", "The dev server cannot be profiled", "Production has no React", "It does not matter"], correct: "a",
      explanation: "npm run build, npm run preview.",
      wrong: { b: "It can, misleadingly.", c: "It has production React.", d: "It does." } }),
    q({ id: "rxq81-3", atom: "a-rx-unnecessary-state", d: 3, prompt: "An effect copies a filtered list into state whenever the filter changes. What does it cost?", options: ["An extra render per change, with a stale frame in between", "Nothing", "A network request", "A memory leak only"], correct: "a",
      explanation: "Calculate during render instead.",
      wrong: { b: "It costs a render.", c: "No request.", d: "The cost is renders." } }),
    q({ id: "rxq81-4", atom: "a-rx-rerendering", d: 2, prompt: "Which change does NOT re-render a component by default?", options: ["A sibling's state changing", "Its own state changing", "Its parent re-rendering", "A context it reads changing"], correct: "a",
      explanation: "Siblings are independent.",
      wrong: { b: "It re-renders.", c: "Children re-render with parents.", d: "Readers re-render." } }),
  ]),

  ...check("rx-l82-memo-lazy", [
    q({ id: "rxq82-1", atom: "a-rx-profiler", d: 2, prompt: "What does the React DevTools Profiler show?", options: ["Which components rendered in each commit, how long each took, and why", "Network requests", "CSS rules", "The bundle's size"], correct: "a",
      explanation: "Enable \"why each component rendered\".",
      wrong: { b: "Network panel.", c: "Elements panel.", d: "A bundle visualiser." } }),
    q({ id: "rxq82-2", atom: "a-rx-memo", d: 3, prompt: "A memo-wrapped child still re-renders on every parent render. The parent passes onSelect={(x) => setX(x)}. Why?", options: ["A new function is created every render, so the prop is never the same", "memo is broken", "Children always re-render", "setX is slow"], correct: "a",
      explanation: "Use useCallback for a stable function.",
      wrong: { b: "Working as designed.", c: "memo prevents that when props match.", d: "Unrelated." } }),
    q({ id: "rxq82-3", atom: "a-rx-lazy-loading", d: 2, prompt: "What does lazy(() => import(\"./Reports.jsx\")) do?", options: ["Puts Reports in its own chunk, downloaded the first time it renders", "Delays rendering by a second", "Imports Reports twice", "Removes Reports from the build"], correct: "a",
      explanation: "Code splitting, shown with a Suspense fallback.",
      wrong: { b: "Not a delay.", c: "Once.", d: "It is built, separately." } }),
    q({ id: "rxq82-4", atom: "a-rx-lazy-loading", d: 2, prompt: "What must wrap a lazy component?", options: ["<Suspense fallback={…}>", "<StrictMode>", "<Fragment>", "Nothing"], correct: "a",
      explanation: "Suspense shows the fallback while loading.",
      wrong: { b: "Unrelated.", c: "Unrelated.", d: "React throws without one." } }),
  ]),

  ...check("rx-l83-loading", [
    q({ id: "rxq83-1", atom: "a-rx-route-splitting", d: 2, prompt: "Where should Suspense go for lazy routes, so the header stays visible?", options: ["Around the <Outlet /> inside the layout", "Around the whole BrowserRouter", "Inside each page", "In index.html"], correct: "a",
      explanation: "Only the page area shows the fallback.",
      wrong: { b: "The header would disappear too.", c: "Too late: the page is the lazy part.", d: "Not React." } }),
    q({ id: "rxq83-2", atom: "a-rx-images-lists", d: 2, prompt: "Why give images width and height attributes?", options: ["So the browser reserves their space and the layout does not jump", "To make them load faster", "For SEO only", "Browsers require it"], correct: "a",
      explanation: "Prevents layout shift (CLS).",
      wrong: { b: "Not directly.", c: "Not mainly.", d: "Optional, but important." } }),
    q({ id: "rxq83-3", atom: "a-rx-images-lists", d: 3, prompt: "What does virtualising a 10,000-row list do?", options: ["Renders only the rows in view, with spacers for the rest", "Loads rows from a virtual server", "Compresses the rows", "Renders all rows faster"], correct: "a",
      explanation: "A few DOM nodes instead of thousands.",
      wrong: { b: "Unrelated.", c: "Unrelated.", d: "It renders fewer." } }),
    q({ id: "rxq83-4", atom: "a-rx-fewer-requests", d: 2, prompt: "What does debouncing a search input do?", options: ["Waits until typing pauses before sending a request", "Sends a request per keystroke faster", "Caches every response forever", "Blocks typing"], correct: "a",
      explanation: "Five keystrokes, one request.",
      wrong: { b: "The opposite.", c: "That is caching.", d: "Typing is unaffected." } }),
  ]),

  ...check("rx-l84-accessibility", [
    q({ id: "rxq84-1", atom: "a-rx-a11y-semantics", d: 2, prompt: "What is the first rule of ARIA?", options: ["Do not use ARIA when a native HTML element does the job", "Add ARIA to every element", "ARIA replaces HTML", "ARIA is only for images"], correct: "a",
      explanation: "Native elements bring behaviour for free.",
      wrong: { b: "Wrong ARIA is worse than none.", c: "It supplements.", d: "Unrelated." } }),
    q({ id: "rxq84-2", atom: "a-rx-a11y-semantics", d: 2, prompt: "What alt text should a purely decorative image have?", options: ["alt=\"\"", "No alt attribute", "alt=\"image\"", "alt=\"decorative\""], correct: "a",
      explanation: "Empty alt tells screen readers to skip it.",
      wrong: { b: "Some readers then read the file name.", c: "Noise.", d: "Noise." } }),
    q({ id: "rxq84-3", atom: "a-rx-keyboard-sr", d: 2, prompt: "How are changes without a page load (\"Item removed\") announced to screen-reader users?", options: ["Through a live region such as role=\"status\"", "With an alert() box", "By changing the title colour", "They cannot be"], correct: "a",
      explanation: "Polite announcements.",
      wrong: { b: "Disruptive.", c: "Visual only.", d: "Live regions do it." } }),
    q({ id: "rxq84-4", atom: "a-rx-web-vitals", d: 2, prompt: "Which Core Web Vital measures content jumping around while loading?", options: ["CLS", "LCP", "INP", "TTFB"], correct: "a",
      explanation: "Cumulative Layout Shift.",
      wrong: { b: "Loading of the main content.", c: "Responsiveness.", d: "Server response time, not a Core Web Vital." } }),
  ]),

  ...check("rx-l85-production", [
    q({ id: "rxq85-1", atom: "a-rx-error-boundaries", d: 2, prompt: "Without an error boundary, what happens when a component throws while rendering?", options: ["React removes the whole app from the screen", "Only that component disappears", "React retries forever", "Nothing"], correct: "a",
      explanation: "Boundaries contain the damage.",
      wrong: { b: "That needs a boundary.", c: "No.", d: "The page goes blank." } }),
    q({ id: "rxq85-2", atom: "a-rx-error-boundaries", d: 3, prompt: "Which error does an error boundary NOT catch?", options: ["One thrown in an onClick handler", "One thrown while a child renders", "One thrown in a grandchild's render", "One thrown in a child's constructor"], correct: "a",
      explanation: "Handle event and async errors with try/catch.",
      wrong: { b: "Caught.", c: "Caught.", d: "Caught." } }),
    q({ id: "rxq85-3", atom: "a-rx-production-builds", d: 2, prompt: "How do you find out what makes a bundle large?", options: ["A bundle visualiser such as rollup-plugin-visualizer", "Guess", "Count the files in src", "Read node_modules"], correct: "a",
      explanation: "A treemap of what is inside.",
      wrong: { b: "Measure.", c: "Unrelated to bundle size.", d: "Too much, and most is not bundled." } }),
    q({ id: "rxq85-4", atom: "a-rx-deploy-troubleshooting", d: 3, prompt: "An import works on Windows but the Linux build fails with \"Could not resolve ./Card.jsx\". The file is card.jsx. Why?", options: ["Linux file names are case-sensitive", "Linux cannot build React", "Vite bug", "The file is too large"], correct: "a",
      explanation: "Match the case exactly.",
      wrong: { b: "It can.", c: "Expected behaviour.", d: "Unrelated." } }),
  ]),

  ...check("rx-l86-m14-project", [
    q({ id: "rxq86-1", atom: "a-rx-m14-project", d: 2, prompt: "In an audit, why fix the crash before the performance issues?", options: ["A crash hides everything else and blocks users entirely", "Performance never matters", "Crashes are faster to fix", "Order does not matter"], correct: "a",
      explanation: "Fix what blocks users first.",
      wrong: { b: "It does.", c: "Not necessarily.", d: "Priorities matter." } }),
    q({ id: "rxq86-2", atom: "a-rx-m14-project", d: 2, prompt: "How do you prove a performance fix worked?", options: ["Measure again under the same conditions and compare", "It feels faster", "The code is shorter", "The tests pass"], correct: "a",
      explanation: "Before and after numbers.",
      wrong: { b: "Feelings are not data.", c: "Unrelated.", d: "Tests check behaviour, not speed." } }),
    q({ id: "rxq86-3", atom: "a-rx-m14-project", d: 3, prompt: "Why put an error boundary around each card rather than one around the whole page?", options: ["One bad card shows a fallback while the others keep working", "Boundaries are cheaper in groups", "React requires one per component", "To catch click errors"], correct: "a",
      explanation: "Contain failures to the smallest useful area.",
      wrong: { b: "Not the reason.", c: "Not required.", d: "Boundaries do not catch event errors." } }),
    q({ id: "rxq86-4", atom: "a-rx-m14-project", d: 2, prompt: "Which fix stops the filter sending a request on every keystroke?", options: ["Debouncing the filter value before fetching", "memo on the grid", "An error boundary", "Lazy-loading the reviews"], correct: "a",
      explanation: "Wait until typing pauses.",
      wrong: { b: "Fixes renders, not requests.", c: "Fixes crashes.", d: "Fixes bundle size." } }),
  ]),
};
