/**
 * ASSESSMENTS · MOBILE APP DEVELOPMENT · MODULE 15 · AUTHENTICATION AND ACCOUNT MANAGEMENT
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Never import this from anything under src/.
 * ═════════════════════════════════════════════════════════════════════════
 */

import { q, check } from "./md-helpers.js";

export const ASSESSMENTS = {
  ...check("md-l91-signup-verify", [
    q({ id: "mdq91-1", atom: "a-md-auth-flows", d: 2, prompt: "After a successful sign-up, how does the app move into the signed-in screens?", options: ["The session changes and Stack.Protected guards move the user", "router.push(\"/\") in the form", "The server redirects the app", "The user taps Back"], correct: "a",
      explanation: "No navigation code, and no Back to the form.",
      wrong: { b: "Leaves sign-up in the history.", c: "No.", d: "No." } }),
    q({ id: "mdq91-2", atom: "a-md-auth-flows", d: 2, prompt: "Which autoComplete value lets password managers suggest a strong password on sign-up?", options: ["new-password", "current-password", "password", "off"], correct: "a",
      explanation: "current-password is for sign-in.",
      wrong: { b: "Sign-in.", c: "Not a valid hint.", d: "Turns it off." } }),
    q({ id: "mdq91-3", atom: "a-md-email-verification", d: 2, prompt: "Why limit wrong attempts at a 6-digit code?", options: ["Otherwise anyone could try all million codes", "To save server memory", "Codes are case-sensitive", "E-mail providers require it"], correct: "a",
      explanation: "Brute force.",
      wrong: { b: "No.", c: "Digits.", d: "No." } }),
    q({ id: "mdq91-4", atom: "a-md-email-verification", d: 2, prompt: "How should the server store a verification code?", options: ["Only its hash, with an expiry", "In plain text", "In the token", "Only in the e-mail"], correct: "a",
      explanation: "Like a password.",
      wrong: { b: "Leaks if the database leaks.", c: "No.", d: "Then nothing can check it." } }),
    q({ id: "mdq91-5", atom: "a-md-email-verification", d: 2, prompt: "Why does login return code: \"email_not_verified\" with a 403?", options: ["So the app can show the code screen instead of a generic error", "To hide the reason", "Stores require it", "It is a 401"], correct: "a",
      explanation: "Machine-readable reasons.",
      wrong: { b: "Opposite.", c: "No.", d: "Credentials were right." } }),
  ]),

  ...check("md-l92-reset-persist", [
    q({ id: "mdq92-1", atom: "a-md-password-reset", d: 2, prompt: "Why does \"forgot password\" answer the same for every e-mail?", options: ["So it can't reveal which e-mails have accounts", "To save e-mails", "It's simpler", "To slow attackers"], correct: "a",
      explanation: "Account enumeration again.",
      wrong: { b: "No.", c: "Not the reason.", d: "Rate limits do that." } }),
    q({ id: "mdq92-2", atom: "a-md-password-reset", d: 3, prompt: "Why sign the user out everywhere after a password reset?", options: ["Anyone who had stolen a session loses it", "Tokens break otherwise", "To save storage", "Apple requires it"], correct: "a",
      explanation: "Raise a token version.",
      wrong: { b: "No.", c: "No.", d: "No." } }),
    q({ id: "mdq92-3", atom: "a-md-password-reset", d: 2, prompt: "What should a reset token be?", options: ["Long, random, hashed in storage, short-lived and single-use", "The user's id", "A 4-digit code that never expires", "The old password hash"], correct: "a",
      explanation: "All four properties matter.",
      wrong: { b: "Guessable.", c: "Guessable and permanent.", d: "No." } }),
    q({ id: "mdq92-4", atom: "a-md-session-persistence", d: 2, prompt: "How do you avoid the sign-in screen flashing at start-up?", options: ["Keep the splash screen up and render nothing until the session is restored", "Restore the session faster", "Hide the sign-in screen with CSS", "Use AsyncStorage"], correct: "a",
      explanation: "preventAutoHideAsync, then hideAsync.",
      wrong: { b: "Still a race.", c: "No.", d: "Not the problem." } }),
  ]),

  ...check("md-l93-tokens-logout", [
    q({ id: "mdq93-1", atom: "a-md-refresh-tokens", d: 2, prompt: "Why are access tokens short-lived?", options: ["A stolen one soon stops working", "They are bigger", "Servers forget them", "To force sign-ins"], correct: "a",
      explanation: "Refresh tokens renew them quietly.",
      wrong: { b: "No.", c: "No.", d: "Refresh prevents that." } }),
    q({ id: "mdq93-2", atom: "a-md-refresh-tokens", d: 3, prompt: "Three requests get 401 at once. Why must they share one refresh?", options: ["Rotation makes the second refresh reuse a retired token, which signs the user out", "Refreshing is slow", "The server allows one request at a time", "It doesn't matter"], correct: "a",
      explanation: "One shared promise.",
      wrong: { b: "Not the main issue.", c: "No.", d: "It does." } }),
    q({ id: "mdq93-3", atom: "a-md-refresh-tokens", d: 3, prompt: "A refresh token that was already used comes back. What should the server do?", options: ["Assume it was stolen and revoke that whole token family", "Accept it", "Return the same tokens again", "Ignore the request"], correct: "a",
      explanation: "Reuse detection.",
      wrong: { b: "Lets a thief in.", c: "No.", d: "Revoke." } }),
    q({ id: "mdq93-4", atom: "a-md-secure-logout", d: 2, prompt: "Why must logout also call the server?", options: ["A copied refresh token would keep working otherwise", "To delete the app", "To clear the cache", "It needn't"], correct: "a",
      explanation: "Revoke it.",
      wrong: { b: "No.", c: "Local.", d: "It must." } }),
    q({ id: "mdq93-5", atom: "a-md-secure-logout", d: 3, prompt: "After \"sign out of all devices\", how do already-issued access tokens stop working?", options: ["A token version on the user, checked on every request, is raised", "They expire immediately by themselves", "The app deletes them on other phones", "They can't be stopped"], correct: "a",
      explanation: "Otherwise they last until expiry.",
      wrong: { b: "JWTs don't.", c: "Other phones aren't reachable.", d: "They can." } }),
  ]),

  ...check("md-l94-roles-expiry", [
    q({ id: "mdq94-1", atom: "a-md-rbac", d: 2, prompt: "Why check permissions (\"users:mute\") rather than role names in code?", options: ["Changing what a role may do is one edit in one map", "Roles don't exist", "It's faster", "TypeScript requires it"], correct: "a",
      explanation: "Readable and maintainable.",
      wrong: { b: "They do.", c: "No.", d: "No." } }),
    q({ id: "mdq94-2", atom: "a-md-rbac", d: 2, prompt: "The app hides the admin button for members. Is that enough?", options: ["No: the server must refuse too", "Yes", "Yes, on iOS", "Only in release builds"], correct: "a",
      explanation: "The app hides; the server decides.",
      wrong: { b: "Requests can be sent directly.", c: "No.", d: "No." } }),
    q({ id: "mdq94-3", atom: "a-md-expired-sessions", d: 2, prompt: "What should the user see when their session expires?", options: ["Why, on the sign-in screen, then return to where they were after signing in", "A crash", "Several error alerts", "Nothing: a blank screen"], correct: "a",
      explanation: "Kind and in one place.",
      wrong: { b: "No.", c: "One message.", d: "No." } }),
    q({ id: "mdq94-4", atom: "a-md-expired-sessions", d: 2, prompt: "Where should a 401 that can't be fixed by refreshing be handled?", options: ["In one place: the API layer tells the session provider", "In every screen", "In app.json", "On the server"], correct: "a",
      explanation: "One behaviour everywhere.",
      wrong: { b: "Repetitive and inconsistent.", c: "No.", d: "It's the app's response." } }),
  ]),

  ...check("md-l95-oauth-protect", [
    q({ id: "mdq95-1", atom: "a-md-oauth", d: 3, prompt: "What does PKCE protect against?", options: ["Another app intercepting the authorization code", "Weak passwords", "Expired tokens", "Slow networks"], correct: "a",
      explanation: "Without the verifier, the code is useless.",
      wrong: { b: "No.", c: "No.", d: "No." } }),
    q({ id: "mdq95-2", atom: "a-md-oauth", d: 2, prompt: "Why check the state value in the redirect?", options: ["To be sure the reply belongs to the request you started", "To decrypt the code", "To choose the provider", "It's optional decoration"], correct: "a",
      explanation: "Forged redirects are refused.",
      wrong: { b: "No.", c: "No.", d: "It matters." } }),
    q({ id: "mdq95-3", atom: "a-md-oauth", d: 2, prompt: "Why not show Google's sign-in page in a WebView?", options: ["The app could read the password; providers block it", "WebViews are slow", "It costs money", "WebViews can't load pages"], correct: "a",
      explanation: "Use the system browser session.",
      wrong: { b: "Not the reason.", c: "No.", d: "They can." } }),
    q({ id: "mdq95-4", atom: "a-md-protect-endpoints", d: 3, prompt: "What's wrong with tokens.decode in an auth middleware?", options: ["It reads the token without checking signature or expiry, so anyone can forge one", "It's slow", "It throws too often", "Nothing"], correct: "a",
      explanation: "Always verify.",
      wrong: { b: "No.", c: "It never checks.", d: "A critical bug." } }),
    q({ id: "mdq95-5", atom: "a-md-protect-endpoints", d: 2, prompt: "Why should a refresh token be refused by normal endpoints?", options: ["Each token kind has one job; check the typ claim", "It's too long", "It expires sooner", "Servers can't read it"], correct: "a",
      explanation: "Wrong kind, refused.",
      wrong: { b: "No.", c: "Later.", d: "They can." } }),
  ]),

  ...check("md-l96-records-secrets", [
    q({ id: "mdq96-1", atom: "a-md-own-records", d: 2, prompt: "Where should the server get the user for scoping queries?", options: ["The verified token", "A userId query parameter", "The request body", "A cookie the app sets"], correct: "a",
      explanation: "Never from the client's say-so.",
      wrong: { b: "Anyone can change it.", c: "Same.", d: "No." } }),
    q({ id: "mdq96-2", atom: "a-md-own-records", d: 3, prompt: "Why answer 404 instead of 403 for someone else's order?", options: ["It doesn't confirm the order exists", "403 is wrong here", "404 is faster", "Apps can't show 403"], correct: "a",
      explanation: "Leak nothing.",
      wrong: { b: "Both are defensible; 404 leaks less.", c: "No.", d: "They can." } }),
    q({ id: "mdq96-3", atom: "a-md-own-records", d: 2, prompt: "Do random ids such as ord_7f3k protect orders by themselves?", options: ["No: scoping by owner is the protection", "Yes, completely", "Only if long", "Only on iOS"], correct: "a",
      explanation: "Ids leak in links and logs.",
      wrong: { b: "No.", c: "Still no.", d: "No." } }),
    q({ id: "mdq96-4", atom: "a-md-credentials-secrets", d: 2, prompt: "What does \"Remember me\" safely remember?", options: ["The e-mail, while the token keeps the user signed in", "The password", "Both, encrypted", "Nothing"], correct: "a",
      explanation: "Never store passwords.",
      wrong: { b: "Never.", c: "Still a password.", d: "The e-mail is fine." } }),
    q({ id: "mdq96-5", atom: "a-md-credentials-secrets", d: 2, prompt: "A secret key was accidentally shipped in an app version. What now?", options: ["Rotate (replace) it, and move it to the server", "Delete it from the next version only", "Hope nobody noticed", "Obfuscate it"], correct: "a",
      explanation: "Assume it's leaked.",
      wrong: { b: "The old builds still have it.", c: "No.", d: "Still extractable." } }),
  ]),

  ...check("md-l97-m15-project", [
    q({ id: "mdq97-1", atom: "a-md-m15-project", d: 2, prompt: "Why decide \"signed in\" from the refresh token at start-up?", options: ["It lasts long; an expired access token is simply renewed", "Access tokens never expire", "The server needs it", "It's smaller"], correct: "a",
      explanation: "The client renews on first use.",
      wrong: { b: "They do.", c: "No.", d: "No." } }),
    q({ id: "mdq97-2", atom: "a-md-m15-project", d: 2, prompt: "Sign-out fails to reach the server (offline). What should the app do?", options: ["Clear local tokens anyway", "Stay signed in", "Retry forever", "Crash"], correct: "a",
      explanation: "The user asked to sign out.",
      wrong: { b: "No.", c: "No.", d: "No." } }),
    q({ id: "mdq97-3", atom: "a-md-m15-project", d: 2, prompt: "How is the avatar sent?", options: ["Multipart form data with an \"avatar\" file field, through apiFetch", "As base64 in JSON", "In the access token", "By e-mail"], correct: "a",
      explanation: "Authenticated upload.",
      wrong: { b: "Wasteful.", c: "No.", d: "No." } }),
    q({ id: "mdq97-4", atom: "a-md-m15-project", d: 3, prompt: "What proves the next user can't see the previous user's notes?", options: ["Signing in as a second user and seeing only their own notes", "Reading the code", "Restarting the phone", "Checking AsyncStorage"], correct: "a",
      explanation: "Test like an attacker.",
      wrong: { b: "Not proof.", c: "No.", d: "Not where notes live." } }),
  ]),
};
