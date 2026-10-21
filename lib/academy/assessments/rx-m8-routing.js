/**
 * ASSESSMENTS · REACT DEVELOPMENT · MODULE 8 · ROUTING AND MULTI-PAGE APPLICATION STRUCTURE
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Never import this from anything under src/.
 * ═════════════════════════════════════════════════════════════════════════
 */

import { q, check } from "./rx-helpers.js";

export const ASSESSMENTS = {
  ...check("rx-l47-router-setup", [
    q({ id: "rxq47-1", atom: "a-rx-why-routing", d: 2, prompt: "What does client-side routing change compared with having no routing in an SPA?", options: ["Each screen gets its own URL, which can be bookmarked, shared and navigated with Back", "Pages load from the server each time", "The app no longer needs JavaScript", "It makes the bundle smaller"], correct: "a",
      explanation: "The URL reflects what is shown, without full reloads.",
      wrong: { b: "That is a traditional multi-page site.", c: "Routing is JavaScript.", d: "Unrelated." } }),
    q({ id: "rxq47-2", atom: "a-rx-router-install", d: 2, prompt: "Why use <Link> instead of <a href> inside a React Router app?", options: ["Link changes the URL inside the app without reloading the page and losing state", "<a> tags are not allowed in JSX", "Link is styled automatically", "Link works offline"], correct: "a",
      explanation: "A plain <a> triggers a full page load.",
      wrong: { b: "They are allowed, for external links.", c: "No styling is added.", d: "Unrelated." } }),
    q({ id: "rxq47-3", atom: "a-rx-routes-pages", d: 2, prompt: "Which is correct?", options: ["<Route path=\"/courses\" element={<CoursesPage />} />", "<Route path=\"/courses\" element={CoursesPage} />", "<Route url=\"/courses\" page={CoursesPage} />", "<Route path=\"/courses\">CoursesPage</Route>"], correct: "a",
      explanation: "element takes JSX.",
      wrong: { b: "Pass an element, not the function.", c: "Not the API.", d: "Not how elements are given." } }),
    q({ id: "rxq47-4", atom: "a-rx-routes-pages", d: 2, prompt: "Where should a team be able to read the whole map of an app's URLs?", options: ["In one route table, usually in App", "Scattered across every page component", "In package.json", "In the README only"], correct: "a",
      explanation: "One place lists every route.",
      wrong: { b: "Hard to see the whole app.", c: "Unrelated.", d: "Documentation drifts; the route table is the truth." } }),
  ]),

  ...check("rx-l48-links-params", [
    q({ id: "rxq48-1", atom: "a-rx-navlink", d: 2, prompt: "What does NavLink add when its path matches the current URL?", options: ["The class active and aria-current=\"page\"", "A page reload", "A bold font, always", "Nothing"], correct: "a",
      explanation: "Style and accessibility for the current section.",
      wrong: { b: "No reload.", c: "Styling is up to your CSS.", d: "It marks the active link." } }),
    q({ id: "rxq48-2", atom: "a-rx-navlink", d: 3, prompt: "Why does a Home NavLink to \"/\" need the end prop?", options: ["Otherwise it is active on every URL, since all paths start with /", "Otherwise it does not navigate", "end makes it open in a new tab", "It is required on every NavLink"], correct: "a",
      explanation: "end requires an exact match.",
      wrong: { b: "It navigates either way.", c: "Unrelated.", d: "Only where needed." } }),
    q({ id: "rxq48-3", atom: "a-rx-route-params", d: 2, prompt: "With path=\"/courses/:courseId\" and URL /courses/react, what does useParams() return?", options: ["{ courseId: \"react\" }", "\"react\"", "{ id: \"react\" }", "[\"courses\", \"react\"]"], correct: "a",
      explanation: "An object keyed by the parameter name, with string values.",
      wrong: { b: "It is an object.", c: "The key is the name in the path.", d: "Not an array." } }),
    q({ id: "rxq48-4", atom: "a-rx-search-params", d: 3, prompt: "Why keep a list's filter in search params rather than useState?", options: ["It survives refresh, can be shared as a link, and Back undoes it", "useState cannot hold strings", "It is faster", "React Router requires it"], correct: "a",
      explanation: "The URL is shareable state.",
      wrong: { b: "It can.", c: "Not about speed.", d: "Optional." } }),
  ]),

  ...check("rx-l49-nested", [
    q({ id: "rxq49-1", atom: "a-rx-nested-layouts", d: 2, prompt: "Where does a layout route show its matched child route?", options: ["Where it renders <Outlet />", "Below the layout automatically", "In a new window", "Where it renders {children}"], correct: "a",
      explanation: "Outlet is the placeholder for the child.",
      wrong: { b: "Only at the Outlet.", c: "Unrelated.", d: "Layout routes use Outlet, not children." } }),
    q({ id: "rxq49-2", atom: "a-rx-nested-layouts", d: 2, prompt: "What is an index route?", options: ["The child that renders at the parent's own URL", "The first route in the file", "A route listing every page", "A route for /index.html"], correct: "a",
      explanation: "<Route index element={…} />",
      wrong: { b: "Order does not matter.", c: "Unrelated.", d: "Unrelated." } }),
    q({ id: "rxq49-3", atom: "a-rx-detail-pages", d: 2, prompt: "A detail page's find() returns undefined for the URL's id. What should it do?", options: ["Show a not-found message with a link back", "Crash; the URL was wrong", "Show the first item instead", "Reload the page"], correct: "a",
      explanation: "Handle edited and stale links gracefully.",
      wrong: { b: "Crashes are not a user experience.", c: "Shows the wrong thing.", d: "Same result." } }),
    q({ id: "rxq49-4", atom: "a-rx-not-found", d: 2, prompt: "Which route catches every URL nothing else matches?", options: ["<Route path=\"*\" element={<NotFoundPage />} />", "<Route path=\"404\" />", "<Route index />", "<Route path=\"/\" />"], correct: "a",
      explanation: "The splat path.",
      wrong: { b: "Only matches /404.", c: "Only the parent URL.", d: "Only the home page." } }),
  ]),

  ...check("rx-l50-protected", [
    q({ id: "rxq50-1", atom: "a-rx-protected-routes", d: 3, prompt: "Why redirect with <Navigate to=\"/login\" replace />?", options: ["The protected URL is not left in history, so Back does not bounce into the redirect again", "replace is faster", "Without it the redirect fails", "It logs the user in"], correct: "a",
      explanation: "Avoids a redirect loop on Back.",
      wrong: { b: "Not about speed.", c: "It works, just with worse history.", d: "Unrelated." } }),
    q({ id: "rxq50-2", atom: "a-rx-protected-routes", d: 2, prompt: "Does a protected route stop someone fetching the private data directly from the API?", options: ["No: the server must check permissions on every request", "Yes, completely", "Only in production", "Only with HTTPS"], correct: "a",
      explanation: "Frontend protection only controls the UI (Module 12).",
      wrong: { b: "Anyone can call the API.", c: "Same everywhere.", d: "HTTPS encrypts; it does not authorise." } }),
    q({ id: "rxq50-3", atom: "a-rx-url-pagination", d: 2, prompt: "When a filter changes, what should happen to ?page=?", options: ["Reset to 1, since the old page may not exist in the new results", "Keep it", "Increase it", "Remove the filter"], correct: "a",
      explanation: "Start the new results from the beginning.",
      wrong: { b: "May show an empty page.", c: "Meaningless.", d: "Unrelated." } }),
    q({ id: "rxq50-4", atom: "a-rx-navigate-after-submit", d: 2, prompt: "When should a create form call navigate() to the new item?", options: ["Only after the server confirms success", "As soon as the button is clicked", "Before validating", "Never"], correct: "a",
      explanation: "On failure, stay and show the error.",
      wrong: { b: "Too early.", c: "Too early.", d: "Navigating to the result is good practice." } }),
    q({ id: "rxq50-5", atom: "a-rx-public-private", d: 2, prompt: "How should public and private pages be organised in the route table?", options: ["In separate layout groups, with the private group inside one protected layout", "All mixed, each page checking the user itself", "In separate apps", "Private pages first"], correct: "a",
      explanation: "Protect sections structurally.",
      wrong: { b: "Easy to forget a check.", c: "Unnecessary.", d: "Order is irrelevant." } }),
  ]),

  ...check("rx-l51-m8-project", [
    q({ id: "rxq51-1", atom: "a-rx-m8-project", d: 2, prompt: "Where should the 404 route sit to keep the site's header on it?", options: ["Inside the layout route", "Outside every layout", "In index.html", "In the server"], correct: "a",
      explanation: "Then it renders in the layout's Outlet.",
      wrong: { b: "Then it has no header.", c: "Not a route.", d: "The SPA handles client routes." } }),
    q({ id: "rxq51-2", atom: "a-rx-m8-project", d: 3, prompt: "After signing in on /login, how does the app know to return to /profile?", options: ["The redirect stored the original location in state.from", "The browser remembers it", "It always goes to /profile", "From localStorage"], correct: "a",
      explanation: "Navigate's state carries it to the login page.",
      wrong: { b: "Not automatically.", c: "Only because that is where they were going.", d: "Not needed." } }),
    q({ id: "rxq51-3", atom: "a-rx-m8-project", d: 2, prompt: "Which URL design is right for one course's details?", options: ["/courses/react", "/courses?view=details&id=react", "/react-course-details.html", "/details"], correct: "a",
      explanation: "Which resource is shown belongs in the path.",
      wrong: { b: "Query strings are for optional view settings.", c: "Not an SPA route.", d: "Does not say which course." } }),
    q({ id: "rxq51-4", atom: "a-rx-m8-project", d: 2, prompt: "How do the dashboard and profile pages get protected together?", options: ["Both are children of one RequireAuth layout route", "Each page checks the user itself", "They are hidden from the navigation", "They are lazy-loaded"], correct: "a",
      explanation: "Protect a section once, structurally.",
      wrong: { b: "Easy to forget one.", c: "Hiding is not protecting.", d: "Unrelated." } }),
  ]),
};
