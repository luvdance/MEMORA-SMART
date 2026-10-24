/**
 * ASSESSMENTS · MOBILE APP DEVELOPMENT · MODULE 12 · FORMS AND PERSISTENT DATA
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Never import this from anything under src/.
 * ═════════════════════════════════════════════════════════════════════════
 */

import { q, check } from "./md-helpers.js";

export const ASSESSMENTS = {
  ...check("md-l70-form-controls", [
    q({ id: "mdq70-1", atom: "a-md-form-controls", d: 1, prompt: "Which props make a TextInput controlled?", options: ["value and onChangeText", "placeholder and style", "defaultValue only", "ref and key"], correct: "a",
      explanation: "State holds the text; the input shows it.",
      wrong: { b: "Appearance only.", c: "Uncontrolled.", d: "No." } }),
    q({ id: "mdq70-2", atom: "a-md-form-controls", d: 2, prompt: "What suits one choice out of two or three options?", options: ["A segmented control or radio buttons", "A free-text field", "A dropdown in a modal", "A switch for each"], correct: "a",
      explanation: "All options visible, one tap.",
      wrong: { b: "Typos.", c: "Extra taps for few options.", d: "Switches are on/off." } }),
    q({ id: "mdq70-3", atom: "a-md-form-controls", d: 2, prompt: "React Native has no built-in dropdown. What can you use?", options: ["A list in a Modal or bottom sheet, or @react-native-picker/picker", "An HTML <select>", "A Switch", "Nothing: avoid long lists"], correct: "a",
      explanation: "Or a native picker package.",
      wrong: { b: "Not on phones.", c: "On/off only.", d: "Sometimes a list is needed." } }),
    q({ id: "mdq70-4", atom: "a-md-form-controls", d: 2, prompt: "How do screen readers know which radio option is chosen?", options: ["accessibilityState={{ checked }} on each option", "The colour", "A bold font", "The order"], correct: "a",
      explanation: "State, not looks.",
      wrong: { b: "Not announced.", c: "Not announced.", d: "No." } }),
  ]),

  ...check("md-l71-validation", [
    q({ id: "mdq71-1", atom: "a-md-required", d: 2, prompt: "When should a required-field error first appear?", options: ["After the user tries to submit (or leaves the field)", "As soon as the screen opens", "Never", "Only on the server"], correct: "a",
      explanation: "Don't scold before they have typed.",
      wrong: { b: "Hostile.", c: "They need to know.", d: "Too late to help." } }),
    q({ id: "mdq71-2", atom: "a-md-required", d: 2, prompt: "Why must the server validate again?", options: ["Requests can be sent without your app", "Phones are slow", "It is faster", "Zod requires it"], correct: "a",
      explanation: "Client checks are a convenience.",
      wrong: { b: "Not the reason.", c: "No.", d: "No." } }),
    q({ id: "mdq71-3", atom: "a-md-validation-rules", d: 2, prompt: "A TextInput gives \"2500.50\". What should validation do?", options: ["Check the text's format, then convert it and check the range", "Use it as text", "parseInt it", "Reject decimals"], correct: "a",
      explanation: "Inputs give strings.",
      wrong: { b: "Can't do sums.", c: "Loses the kobo.", d: "Money has decimals." } }),
    q({ id: "mdq71-4", atom: "a-md-validation-rules", d: 3, prompt: "Is \"1998-02-30\" a valid date of birth?", options: ["No: there is no 30 February", "Yes, it has the right format", "Only in leap years", "Yes, JavaScript accepts it"], correct: "a",
      explanation: "z.iso.date() checks the day exists.",
      wrong: { b: "Format isn't enough.", c: "February never has 30.", d: "It silently rolls over to March." } }),
    q({ id: "mdq71-5", atom: "a-md-validation-rules", d: 2, prompt: "What does schema.safeParse(values) return?", options: ["{ success: true, data } or { success: false, error }", "It throws on bad input", "A boolean", "A string"], correct: "a",
      explanation: "parse throws; safeParse returns.",
      wrong: { b: "That is parse.", c: "Richer than that.", d: "No." } }),
  ]),

  ...check("md-l72-keyboards-submit", [
    q({ id: "mdq72-1", atom: "a-md-keyboards", d: 1, prompt: "Which keyboardType suits an amount of money?", options: ["decimal-pad", "default", "email-address", "phone-pad"], correct: "a",
      explanation: "Digits and a decimal point.",
      wrong: { b: "Letters.", c: "@ keyboard.", d: "For phone numbers." } }),
    q({ id: "mdq72-2", atom: "a-md-keyboards", d: 2, prompt: "What lets password managers fill a sign-in form?", options: ["autoComplete (and textContentType on iOS)", "secureTextEntry alone", "maxLength", "A placeholder"], correct: "a",
      explanation: "\"email\", \"current-password\"…",
      wrong: { b: "Only hides text.", c: "No.", d: "No." } }),
    q({ id: "mdq72-3", atom: "a-md-keyboards", d: 2, prompt: "How does Return move to the next field?", options: ["returnKeyType=\"next\" and onSubmitEditing focusing the next field's ref", "Tab key", "autoFocus on every field", "It does so automatically"], correct: "a",
      explanation: "nextRef.current?.focus()",
      wrong: { b: "No Tab on phones.", c: "No.", d: "Not by default." } }),
    q({ id: "mdq72-4", atom: "a-md-submission", d: 3, prompt: "Why disable the button while submitting?", options: ["A double tap must not send the request twice", "To save battery", "Stores require it", "To hide it"], correct: "a",
      explanation: "Think payments.",
      wrong: { b: "No.", c: "No.", d: "It stays visible." } }),
    q({ id: "mdq72-5", atom: "a-md-submission", d: 2, prompt: "fetch rejects with TypeError: Network request failed. What should the user see?", options: ["A plain message about the connection, with a way to try again", "The raw error", "Nothing", "A crash"], correct: "a",
      explanation: "Words a person understands.",
      wrong: { b: "Confusing.", c: "Looks broken.", d: "No." } }),
  ]),

  ...check("md-l73-local-storage", [
    q({ id: "mdq73-1", atom: "a-md-preferences", d: 2, prompt: "Why read the theme preference synchronously at start-up?", options: ["So the first frame already uses it, with no flash", "Async is not allowed", "It is encrypted", "It is smaller"], correct: "a",
      explanation: "getItemSync from expo-sqlite/kv-store.",
      wrong: { b: "It is allowed.", c: "kv-store isn't encrypted.", d: "No." } }),
    q({ id: "mdq73-2", atom: "a-md-preferences", d: 3, prompt: "Why merge saved preferences over the defaults?", options: ["Preferences added in later versions still get a value", "To make them smaller", "To encrypt them", "JSON requires it"], correct: "a",
      explanation: "{ ...DEFAULTS, ...saved }",
      wrong: { b: "No.", c: "No.", d: "No." } }),
    q({ id: "mdq73-3", atom: "a-md-async-storage", d: 2, prompt: "What does AsyncStorage store?", options: ["Strings, unencrypted", "Encrypted objects", "Files", "SQL tables"], correct: "a",
      explanation: "JSON.stringify anything else; never secrets.",
      wrong: { b: "Neither.", c: "Use the file system.", d: "That is SQLite." } }),
    q({ id: "mdq73-4", atom: "a-md-async-storage", d: 2, prompt: "What does getItem return for a key that was never saved?", options: ["null", "undefined", "\"\"", "It throws"], correct: "a",
      explanation: "Handle it.",
      wrong: { b: "No.", c: "No.", d: "No." } }),
  ]),

  ...check("md-l74-secure-sqlite", [
    q({ id: "mdq74-1", atom: "a-md-secure-store", d: 2, prompt: "Where should a session token be stored?", options: ["SecureStore", "AsyncStorage", "A global variable", "app.json"], correct: "a",
      explanation: "Keychain or Keystore-backed encryption.",
      wrong: { b: "Not encrypted.", c: "Lost on restart.", d: "Public." } }),
    q({ id: "mdq74-2", atom: "a-md-secure-store", d: 3, prompt: "At start-up you find a saved token. What next?", options: ["Check it with the server, showing a loading state, and clear it if refused", "Assume the user is signed in forever", "Delete it", "Show the sign-in form"], correct: "a",
      explanation: "Tokens expire and get revoked.",
      wrong: { b: "It may be expired.", c: "Signs them out for no reason.", d: "Unnecessary." } }),
    q({ id: "mdq74-3", atom: "a-md-sqlite", d: 2, prompt: "Why pass values as ? parameters?", options: ["Quotes can't break the query, and SQL injection is prevented", "It is faster to type", "SQLite requires it for numbers", "To compress data"], correct: "a",
      explanation: "\"Ada's lunch\" would break a joined string.",
      wrong: { b: "Not the point.", c: "No.", d: "No." } }),
    q({ id: "mdq74-4", atom: "a-md-sqlite", d: 3, prompt: "What is PRAGMA user_version used for?", options: ["Recording which migrations have run, so each runs once", "The user's id", "The SQLite version", "The app's version"], correct: "a",
      explanation: "Upgrade step by step.",
      wrong: { b: "No.", c: "No.", d: "Related, but separate." } }),
    q({ id: "mdq74-5", atom: "a-md-sqlite", d: 2, prompt: "You need totals per category. Where should the sums happen?", options: ["In SQL: SUM(amount) … GROUP BY category", "In a loop over every row in JavaScript", "On the server", "In AsyncStorage"], correct: "a",
      explanation: "Let the database work.",
      wrong: { b: "Works, but slower.", c: "It's local data.", d: "No." } }),
  ]),

  ...check("md-l75-offline-sync", [
    q({ id: "mdq75-1", atom: "a-md-offline-first", d: 2, prompt: "In an offline-first app, where is a new note written first?", options: ["On the phone, then sent when possible", "On the server only", "Nowhere until online", "In memory only"], correct: "a",
      explanation: "It appears at once and is never lost.",
      wrong: { b: "Fails offline.", c: "Loses work.", d: "Lost on restart." } }),
    q({ id: "mdq75-2", atom: "a-md-offline-first", d: 3, prompt: "Why does each note carry a clientId?", options: ["A retried request can't create a duplicate", "For sorting", "The server needs it for passwords", "To encrypt it"], correct: "a",
      explanation: "Idempotency.",
      wrong: { b: "No.", c: "No.", d: "No." } }),
    q({ id: "mdq75-3", atom: "a-md-sync-conflicts", d: 2, prompt: "The server answers 409 to a save. What happened?", options: ["The record changed since your copy (a conflict)", "No internet", "Wrong password", "The server crashed"], correct: "a",
      explanation: "Show both and let the user choose.",
      wrong: { b: "That's a network error.", c: "401.", d: "500." } }),
    q({ id: "mdq75-4", atom: "a-md-sync-conflicts", d: 2, prompt: "What is \"stale-while-revalidate\"?", options: ["Show the cached copy at once, then fetch and update it", "Never cache", "Always wait for the network", "Delete the cache daily"], correct: "a",
      explanation: "Fast and fresh.",
      wrong: { b: "Slow.", c: "Slow offline.", d: "No." } }),
    q({ id: "mdq75-5", atom: "a-md-logout-clear", d: 3, prompt: "After sign-out, the next user briefly sees the previous user's orders. What was missed?", options: ["Clearing the in-memory query cache", "Deleting the app", "Restarting the phone", "Changing the scheme"], correct: "a",
      explanation: "queryClient.clear().",
      wrong: { b: "No.", c: "No.", d: "No." } }),
  ]),

  ...check("md-l76-m12-project", [
    q({ id: "mdq76-1", atom: "a-md-m12-project", d: 2, prompt: "Why build one WHERE clause for both the list and the total?", options: ["They always agree, and the rule lives in one place", "SQL requires it", "It's faster to type", "Totals need no filter"], correct: "a",
      explanation: "No duplication.",
      wrong: { b: "No.", c: "Not the point.", d: "They do." } }),
    q({ id: "mdq76-2", atom: "a-md-m12-project", d: 2, prompt: "Which store suits hundreds of transactions with filters?", options: ["SQLite", "AsyncStorage", "SecureStore", "State only"], correct: "a",
      explanation: "Query, sort and sum.",
      wrong: { b: "No queries.", c: "For secrets.", d: "Lost on close." } }),
    q({ id: "mdq76-3", atom: "a-md-m12-project", d: 2, prompt: "Why does the list refresh with useFocusEffect?", options: ["It runs again when the add modal closes", "It is faster than useEffect", "SQLite requires it", "It runs once"], correct: "a",
      explanation: "The list screen regains focus.",
      wrong: { b: "No.", c: "No.", d: "It runs on every focus." } }),
    q({ id: "mdq76-4", atom: "a-md-m12-project", d: 3, prompt: "How do you prove nothing is lost?", options: ["Close and reopen the app (and restart the phone), then check every record", "Look at the code", "Use the web preview", "Trust SQLite"], correct: "a",
      explanation: "The mastery checkpoint.",
      wrong: { b: "Not proof.", c: "Not a phone.", d: "Test it." } }),
  ]),
};
