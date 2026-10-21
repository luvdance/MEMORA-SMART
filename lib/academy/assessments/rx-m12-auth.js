/**
 * ASSESSMENTS · REACT DEVELOPMENT · MODULE 12 · AUTHENTICATION AND APPLICATION SECURITY
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Never import this from anything under src/.
 * ═════════════════════════════════════════════════════════════════════════
 */

import { q, check } from "./rx-helpers.js";

export const ASSESSMENTS = {
  ...check("rx-l70-auth-flows", [
    q({ id: "rxq70-1", atom: "a-rx-authn-authz", d: 2, prompt: "What is the difference between authentication and authorization?", options: ["Authentication proves who you are; authorization decides what you may do", "They are the same", "Authorization happens first", "Authentication is only for admins"], correct: "a",
      explanation: "Who, then what.",
      wrong: { b: "Different questions.", c: "You must know who before deciding what.", d: "Everyone signs in." } }),
    q({ id: "rxq70-2", atom: "a-rx-account-flows", d: 3, prompt: "Why should a failed login say \"Email or password is incorrect\" rather than \"No account with that email\"?", options: ["The specific message tells attackers which emails have accounts", "It is shorter", "Users prefer it", "The server cannot tell"], correct: "a",
      explanation: "Avoid account enumeration.",
      wrong: { b: "Not the reason.", c: "Not the reason.", d: "It can; it should not say." } }),
    q({ id: "rxq70-3", atom: "a-rx-account-flows", d: 2, prompt: "What should logout do on the client?", options: ["Clear the user and any cached private data, after ending the session on the server", "Only hide the header", "Reload the page and keep the token", "Nothing"], correct: "a",
      explanation: "Leave nothing of the old session behind.",
      wrong: { b: "Data remains.", c: "The session would survive.", d: "The session continues." } }),
    q({ id: "rxq70-4", atom: "a-rx-auth-provider", d: 2, prompt: "Why does an AuthProvider start with status \"loading\"?", options: ["So the app does not flash the login page before the session is known", "Providers are slow", "React requires it", "To delay the app on purpose"], correct: "a",
      explanation: "Wait for the provider's first answer.",
      wrong: { b: "Speed varies; the reason is correctness.", c: "Not required.", d: "Not the purpose." } }),
  ]),

  ...check("rx-l71-sessions-roles", [
    q({ id: "rxq71-1", atom: "a-rx-session-tokens", d: 2, prompt: "With an httpOnly session cookie, how does the app learn who is signed in on load?", options: ["It asks the server, for example GET /api/me", "It reads the cookie with document.cookie", "It decodes localStorage", "It cannot know"], correct: "a",
      explanation: "JavaScript cannot read httpOnly cookies.",
      wrong: { b: "httpOnly blocks that.", c: "Nothing is stored there.", d: "Asking the server works." } }),
    q({ id: "rxq71-2", atom: "a-rx-session-tokens", d: 3, prompt: "Is it safe to put a user's address in a JWT's payload?", options: ["No: the payload is only encoded, so anyone holding the token can read it", "Yes, JWTs are encrypted", "Yes, if it expires", "Only for admins"], correct: "a",
      explanation: "Signed is not encrypted.",
      wrong: { b: "Standard JWTs are signed, not encrypted.", c: "Expiry does not hide contents.", d: "Unrelated." } }),
    q({ id: "rxq71-3", atom: "a-rx-role-ui", d: 2, prompt: "Why write a can(user, permission) helper instead of role checks in each component?", options: ["One place decides; components stay consistent and easy to change", "It is more secure on the server", "Roles cannot be compared in JSX", "It is faster"], correct: "a",
      explanation: "Still only for what the UI shows.",
      wrong: { b: "The server still checks separately.", c: "They can.", d: "Not the reason." } }),
    q({ id: "rxq71-4", atom: "a-rx-access-denied", d: 2, prompt: "What should a user see after a 403?", options: ["A clear access-denied message with a way back", "A blank page", "The login page", "A crash"], correct: "a",
      explanation: "Explain and offer a way on.",
      wrong: { b: "Looks broken.", c: "They are signed in.", d: "Unhelpful." } }),
    q({ id: "rxq71-5", atom: "a-rx-expired-auth", d: 3, prompt: "A save fails with 401 after a long edit. What matters most?", options: ["Keeping the user's draft so it can be saved after signing in", "Showing the status code", "Reloading the page", "Logging the error to the console"], correct: "a",
      explanation: "Never lose a user's work to an expired session.",
      wrong: { b: "Meaningless to users.", c: "Loses the draft.", d: "Invisible to the user." } }),
  ]),

  ...check("rx-l72-xss", [
    q({ id: "rxq72-1", atom: "a-rx-safe-rendering", d: 2, prompt: "A comment contains <script>alert(1)</script> and is rendered with {comment.text}. What happens?", options: ["The characters are shown as text; nothing runs", "The script runs", "React throws an error", "The comment disappears"], correct: "a",
      explanation: "React escapes text in braces.",
      wrong: { b: "Escaped.", c: "No error.", d: "It is shown as text." } }),
    q({ id: "rxq72-2", atom: "a-rx-safe-rendering", d: 3, prompt: "Which user value can run code even in normal JSX?", options: ["A javascript: URL in an href", "Text in a <p>", "A number in a <span>", "An alt attribute"], correct: "a",
      explanation: "Allow only http(s) URLs from users.",
      wrong: { b: "Escaped.", c: "Escaped.", d: "Escaped attribute text." } }),
    q({ id: "rxq72-3", atom: "a-rx-xss", d: 2, prompt: "You must render user-written HTML. What do you do?", options: ["Sanitise it with a maintained library such as DOMPurify before dangerouslySetInnerHTML", "Use dangerouslySetInnerHTML directly", "Remove <script> tags with a regular expression", "Use eval"], correct: "a",
      explanation: "Hand-written sanitisers miss event handlers and URLs.",
      wrong: { b: "Opens XSS.", c: "Misses onerror and many other vectors.", d: "Runs code." } }),
    q({ id: "rxq72-4", atom: "a-rx-frontend-not-security", d: 3, prompt: "The Delete button is hidden from non-admins. What protects the delete endpoint?", options: ["Only a server-side check of the requester's permissions", "Hiding the button", "Minifying the code", "The route guard"], correct: "a",
      explanation: "Anyone can call the API directly.",
      wrong: { b: "Only affects the UI.", c: "Still readable.", d: "Only affects what React renders." } }),
  ]),

  ...check("rx-l73-sessions-secrets", [
    q({ id: "rxq73-1", atom: "a-rx-cookies-storage", d: 3, prompt: "Why is an httpOnly cookie safer than localStorage for a session?", options: ["JavaScript, including injected scripts, cannot read it", "It is encrypted by the browser", "It never expires", "It is faster"], correct: "a",
      explanation: "XSS cannot steal what scripts cannot read.",
      wrong: { b: "httpOnly is about access, not encryption.", c: "It can expire.", d: "Unrelated." } }),
    q({ id: "rxq73-2", atom: "a-rx-exposed-secrets", d: 2, prompt: "Which is safe to ship in a VITE_ variable?", options: ["A Paystack publishable key (pk_…)", "A Paystack secret key (sk_…)", "A database password", "An admin token"], correct: "a",
      explanation: "Publishable keys are designed to be public.",
      wrong: { b: "Must stay on a server.", c: "Never in the frontend.", d: "Never in the frontend." } }),
    q({ id: "rxq73-3", atom: "a-rx-exposed-secrets", d: 3, prompt: "A secret key was committed to Git and pushed. What must happen first?", options: ["Revoke and rotate the key at once", "Delete the commit and hope", "Make the repository private", "Add it to .gitignore"], correct: "a",
      explanation: "Assume it is already copied.",
      wrong: { b: "It may already be copied.", c: "Too late.", d: "Does not remove it." } }),
    q({ id: "rxq73-4", atom: "a-rx-profile-settings", d: 2, prompt: "Changing an account's email should require what?", options: ["The current password, and confirming the new address", "Nothing extra", "A page reload", "An admin's approval"], correct: "a",
      explanation: "Re-authenticate for sensitive changes.",
      wrong: { b: "A stolen session could take over the account.", c: "Unrelated.", d: "Not normally." } }),
    q({ id: "rxq73-5", atom: "a-rx-testing-auth", d: 2, prompt: "What makes a test for a route guard meaningful?", options: ["It fails when the guard is broken, in either direction", "It always passes", "It checks the component's internal state", "It runs only in production"], correct: "a",
      explanation: "A test that cannot fail proves nothing.",
      wrong: { b: "Proves nothing.", c: "Test what users see.", d: "Tests run before deploying." } }),
  ]),

  ...check("rx-l74-m12-project", [
    q({ id: "rxq74-1", atom: "a-rx-m12-project", d: 2, prompt: "Why must every portal request use credentials: \"include\"?", options: ["So the browser sends the httpOnly session cookie", "To encrypt the request", "To include the password", "It is optional for cookies"], correct: "a",
      explanation: "Needed especially for an API on another origin.",
      wrong: { b: "HTTPS encrypts.", c: "Never send the password with every request.", d: "Required cross-origin." } }),
    q({ id: "rxq74-2", atom: "a-rx-m12-project", d: 3, prompt: "Who decides whether a student may see another student's grades?", options: ["The server, checking the session against its own records", "The React route", "The Profile component", "localStorage"], correct: "a",
      explanation: "The frontend only decides what to show.",
      wrong: { b: "UI only.", c: "UI only.", d: "Editable by the user." } }),
    q({ id: "rxq74-3", atom: "a-rx-m12-project", d: 2, prompt: "After saving the profile, why update the user in the auth context?", options: ["So every component showing the name updates at once", "To save it to the server again", "To sign out", "To clear the form"], correct: "a",
      explanation: "One source of truth for the current user.",
      wrong: { b: "Already saved.", c: "Unrelated.", d: "Unrelated." } }),
    q({ id: "rxq74-4", atom: "a-rx-m12-project", d: 2, prompt: "While the portal restores the session on load, what should it show?", options: ["A loading state, never a flash of the login page", "The login form", "The dashboard with empty data", "Nothing at all"], correct: "a",
      explanation: "Wait for the server's answer before choosing.",
      wrong: { b: "Wrong for signed-in users.", c: "Wrong for signed-out users.", d: "Looks broken." } }),
  ]),
};
