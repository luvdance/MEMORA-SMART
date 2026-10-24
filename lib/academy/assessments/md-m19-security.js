/**
 * ASSESSMENTS · MOBILE APP DEVELOPMENT · MODULE 19 · MOBILE APPLICATION SECURITY
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Never import this from anything under src/.
 * ═════════════════════════════════════════════════════════════════════════
 */

import { q, check } from "./md-helpers.js";

export const ASSESSMENTS = {
  ...check("md-l121-principles-input", [
    q({ id: "mdq121-1", atom: "a-md-secure-coding", d: 2, prompt: "What does \"assume the client is hostile\" mean in practice?", options: ["Everything that matters is enforced on the server", "Encrypt the JavaScript bundle", "Hide buttons from attackers", "Use a longer app name"], correct: "a",
      explanation: "Apps can be read and modified.",
      wrong: { b: "It can still be read.", c: "Hiding isn't enforcing.", d: "No." } }),
    q({ id: "mdq121-2", atom: "a-md-secure-coding", d: 2, prompt: "Which is an example of least privilege?", options: ["Short-lived tokens and only the permissions a feature needs", "One admin key for every service", "Asking for every permission at launch", "Never expiring sessions"], correct: "a",
      explanation: "Only what's needed, only as long as needed.",
      wrong: { b: "Opposite.", c: "Opposite.", d: "Opposite." } }),
    q({ id: "mdq121-3", atom: "a-md-input-validation", d: 3, prompt: "Why is url.includes(\"kobo.example\") a bad link check?", options: ["https://kobo.example.evil.com and https://evil.com/?kobo.example both pass", "It's slow", "It's case-sensitive", "It rejects mailto:"], correct: "a",
      explanation: "Parse, then compare the exact host.",
      wrong: { b: "Not the problem.", c: "Minor.", d: "Not the problem." } }),
    q({ id: "mdq121-4", atom: "a-md-input-validation", d: 2, prompt: "Who can trigger your app's deep links?", options: ["Any website, app or message", "Only your app", "Only Apple and Google", "Only signed-in users"], correct: "a",
      explanation: "Validate their parameters.",
      wrong: { b: "No.", c: "No.", d: "No." } }),
  ]),

  ...check("md-l122-storage-https", [
    q({ id: "mdq122-1", atom: "a-md-secure-storage", d: 2, prompt: "Version 1 stored the token in AsyncStorage. What should version 2 do?", options: ["Migrate it to SecureStore, then delete the old copy", "Leave it there", "Ask users to reinstall", "Encrypt AsyncStorage with a hard-coded key"], correct: "a",
      explanation: "Copy first, then delete.",
      wrong: { b: "Still exposed.", c: "Unreasonable.", d: "The key would be in the app." } }),
    q({ id: "mdq122-2", atom: "a-md-secure-storage", d: 2, prompt: "What does SecureStore protect against?", options: ["Other apps and people reading the phone's storage or backups", "The phone's owner changing data", "Server breaches", "Network eavesdropping"], correct: "a",
      explanation: "The owner still controls the device.",
      wrong: { b: "No.", c: "No.", d: "That's TLS." } }),
    q({ id: "mdq122-3", atom: "a-md-https", d: 2, prompt: "What's wrong with \"trust all certificates\" in a release build?", options: ["Anyone on the network can intercept and change traffic", "It's slower", "It breaks images", "Nothing"], correct: "a",
      explanation: "TLS without validation is no protection.",
      wrong: { b: "No.", c: "No.", d: "Serious." } }),
    q({ id: "mdq122-4", atom: "a-md-https", d: 3, prompt: "What is the main risk of certificate pinning?", options: ["A certificate change can lock every user out until they update", "It weakens TLS", "It's not allowed on iOS", "It slows every request"], correct: "a",
      explanation: "Needs a rotation plan.",
      wrong: { b: "Strengthens it.", c: "Allowed.", d: "Negligible." } }),
  ]),

  ...check("md-l123-authz-secrets", [
    q({ id: "mdq123-1", atom: "a-md-authn-authz", d: 2, prompt: "Which status means \"signed in, but not allowed\"?", options: ["403", "401", "404 always", "500"], correct: "a",
      explanation: "401 means not authenticated.",
      wrong: { b: "Not signed in.", c: "Sometimes used to hide existence.", d: "Server error." } }),
    q({ id: "mdq123-2", atom: "a-md-authn-authz", d: 2, prompt: "Most real API breaches are failures of…", options: ["Authorization: checking access to each record", "Authentication", "Encryption", "Logging"], correct: "a",
      explanation: "Changing an id shows someone else's data.",
      wrong: { b: "Less often.", c: "Less often.", d: "Not usually." } }),
    q({ id: "mdq123-3", atom: "a-md-public-keys", d: 2, prompt: "Which key is safe to ship in an app?", options: ["A Maps API key restricted to your app's package and bundle id", "A payment secret key", "A database password", "A service-role key"], correct: "a",
      explanation: "Public by design, restricted.",
      wrong: { b: "Never.", c: "Never.", d: "Never." } }),
    q({ id: "mdq123-4", atom: "a-md-public-keys", d: 3, prompt: "Are EXPO_PUBLIC_ variables secret?", options: ["No: they're inlined as plain text in the bundle", "Yes, encrypted", "Only on iOS", "Only in production"], correct: "a",
      explanation: "Public values only.",
      wrong: { b: "No.", c: "No.", d: "No." } }),
  ]),

  ...check("md-l124-rules-logs", [
    q({ id: "mdq124-1", atom: "a-md-db-rules", d: 2, prompt: "What does using (true) do in a Supabase RLS policy?", options: ["Allows everyone to read every row", "Allows only the owner", "Blocks everyone", "Nothing"], correct: "a",
      explanation: "Use auth.uid() = user_id.",
      wrong: { b: "No.", c: "Opposite.", d: "It allows all." } }),
    q({ id: "mdq124-2", atom: "a-md-db-rules", d: 2, prompt: "With Firebase or Supabase, what is your backend's security?", options: ["The database rules / RLS policies", "The app's code", "The anon key", "The project name"], correct: "a",
      explanation: "The app talks to the database directly.",
      wrong: { b: "Bypassable.", c: "Public.", d: "No." } }),
    q({ id: "mdq124-3", atom: "a-md-safe-logging", d: 2, prompt: "Why must tokens never be logged?", options: ["Logs reach crash reports, device logs and screenshots", "Logs are slow", "Tokens are too long", "It's only a style rule"], correct: "a",
      explanation: "Anyone with the log could act as the user.",
      wrong: { b: "Not the reason.", c: "No.", d: "It's a security rule." } }),
    q({ id: "mdq124-4", atom: "a-md-safe-logging", d: 2, prompt: "What does a good logger do with data like { password, email }?", options: ["Redacts secrets by key and masks personal data", "Logs it all", "Deletes the whole log", "Encrypts the console"], correct: "a",
      explanation: "One logger for the whole app.",
      wrong: { b: "Leak.", c: "Then you can't debug.", d: "No." } }),
  ]),

  ...check("md-l125-vulns-permissions", [
    q({ id: "mdq125-1", atom: "a-md-owasp", d: 2, prompt: "Which OWASP Mobile risk is a payment secret key found in the bundle?", options: ["Improper credential usage", "Insecure communication", "Insufficient cryptography", "Inadequate privacy controls"], correct: "a",
      explanation: "M1.",
      wrong: { b: "M5: network.", c: "M10.", d: "M6." } }),
    q({ id: "mdq125-2", atom: "a-md-owasp", d: 2, prompt: "Which tool statically analyses an APK or IPA for common issues?", options: ["MobSF", "Maestro", "Expo Go", "Prettier"], correct: "a",
      explanation: "Mobile Security Framework.",
      wrong: { b: "E2E tests.", c: "Runs apps.", d: "Formatting." } }),
    q({ id: "mdq125-3", atom: "a-md-permission-minimization", d: 2, prompt: "Your app only takes photos. What should expo-camera's microphonePermission be?", options: ["false", "\"Allow microphone\"", "true", "Leave the default"], correct: "a",
      explanation: "Don't ask for what you don't use.",
      wrong: { b: "Asks for nothing you need.", c: "No.", d: "May add it." } }),
    q({ id: "mdq125-4", atom: "a-md-permission-minimization", d: 3, prompt: "What does android.blockedPermissions do?", options: ["Stops libraries from adding those permissions to the manifest", "Hides permissions from users", "Grants them silently", "Blocks the app on old phones"], correct: "a",
      explanation: "Guards against SDK additions.",
      wrong: { b: "No.", c: "No.", d: "No." } }),
  ]),

  ...check("md-l126-deps-threats-privacy", [
    q({ id: "mdq126-1", atom: "a-md-dependency-audit", d: 3, prompt: "npm audit suggests npm audit fix --force, which would install expo@44 in an SDK 58 project. What do you do?", options: ["Don't run it; judge the advisories and update through Expo's SDK upgrades", "Run it", "Delete node_modules", "Ignore security forever"], correct: "a",
      explanation: "A breaking downgrade, for development-tool advisories.",
      wrong: { b: "Breaks the project.", c: "Doesn't help.", d: "No." } }),
    q({ id: "mdq126-2", atom: "a-md-dependency-audit", d: 2, prompt: "Which keeps Expo projects' native packages compatible after updates?", options: ["npx expo install --check and npx expo-doctor", "npm update --force", "Deleting package-lock.json", "Editing node_modules"], correct: "a",
      explanation: "SDK-aware checks.",
      wrong: { b: "May break versions.", c: "Unpredictable.", d: "Never." } }),
    q({ id: "mdq126-3", atom: "a-md-threat-modeling", d: 2, prompt: "What does STRIDE help you do?", options: ["List what can go wrong: spoofing, tampering, repudiation, disclosure, denial of service, elevation", "Write tests", "Design screens", "Release faster"], correct: "a",
      explanation: "A prompt list for threats.",
      wrong: { b: "No.", c: "No.", d: "No." } }),
    q({ id: "mdq126-4", atom: "a-md-privacy-notices", d: 2, prompt: "You add an analytics SDK. What must change?", options: ["The privacy policy and both stores' privacy declarations, plus consent where required", "Nothing", "Only the app's icon", "Only the README"], correct: "a",
      explanation: "Declarations must match reality.",
      wrong: { b: "Required.", c: "No.", d: "No." } }),
    q({ id: "mdq126-5", atom: "a-md-privacy-notices", d: 2, prompt: "Where does Apple require apps to declare data collection and required-reason APIs?", options: ["Privacy nutrition labels and the privacy manifest", "Only the app description", "The splash screen", "The app icon"], correct: "a",
      explanation: "Expo can generate the manifest from app.json.",
      wrong: { b: "No.", c: "No.", d: "No." } }),
  ]),

  ...check("md-l127-m19-project", [
    q({ id: "mdq127-1", atom: "a-md-m19-project", d: 2, prompt: "Which defect in the review was the most severe?", options: ["Reading other customers' orders by changing the id", "The missing accessibility label", "The unhidden password field", "The log message"], correct: "a",
      explanation: "Exposes other people's data.",
      wrong: { b: "Low.", c: "Medium.", d: "Medium." } }),
    q({ id: "mdq127-2", atom: "a-md-m19-project", d: 2, prompt: "What belongs in \"Remaining risks\"?", options: ["Known issues not yet fixed, and what should be done next", "Nothing", "A list of fixed bugs", "The team's names"], correct: "a",
      explanation: "Honest about what's left.",
      wrong: { b: "There's always something.", c: "That's Fixes.", d: "No." } }),
    q({ id: "mdq127-3", atom: "a-md-m19-project", d: 2, prompt: "Why give each finding a severity?", options: ["So the most dangerous issues are fixed first", "Stores require it", "To look professional only", "To blame someone"], correct: "a",
      explanation: "Prioritisation.",
      wrong: { b: "No.", c: "It has a purpose.", d: "No." } }),
    q({ id: "mdq127-4", atom: "a-md-m19-project", d: 3, prompt: "How do you confirm the IDOR fix works?", options: ["Request another user's order with your token and expect 404", "Read the code once", "Check the UI hides it", "Restart the server"], correct: "a",
      explanation: "Test like an attacker.",
      wrong: { b: "Not proof.", c: "UI isn't the API.", d: "No." } }),
  ]),
};
