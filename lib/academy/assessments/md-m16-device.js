/**
 * ASSESSMENTS · MOBILE APP DEVELOPMENT · MODULE 16 · ACCESSING MOBILE DEVICE CAPABILITIES
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Never import this from anything under src/.
 * ═════════════════════════════════════════════════════════════════════════
 */

import { q, check } from "./md-helpers.js";

export const ASSESSMENTS = {
  ...check("md-l98-camera-images", [
    q({ id: "mdq98-1", atom: "a-md-camera", d: 2, prompt: "Which needs a permission prompt: choosing a photo with launchImageLibraryAsync, or taking one in a CameraView?", options: ["Taking one in a CameraView", "Choosing one", "Both", "Neither"], correct: "a",
      explanation: "The system photo picker needs none.",
      wrong: { b: "The picker shows only what the user chooses.", c: "No.", d: "The camera does." } }),
    q({ id: "mdq98-2", atom: "a-md-camera", d: 2, prompt: "Where does the iOS camera prompt's explanation come from?", options: ["app.json (the expo-camera plugin's cameraPermission)", "The JavaScript code at runtime", "Apple writes it", "Google Play Console"], correct: "a",
      explanation: "NSCameraUsageDescription, set at build time.",
      wrong: { b: "Fixed at build time.", c: "You write it.", d: "Android only, and no." } }),
    q({ id: "mdq98-3", atom: "a-md-image-compress", d: 2, prompt: "Why resize photos before uploading?", options: ["A 3–6 MB original is slow and costly on mobile data, and larger than screens need", "Servers can't store big files", "JPEG requires it", "To change their colours"], correct: "a",
      explanation: "A tenth of the size, no visible loss.",
      wrong: { b: "They can, at a cost.", c: "No.", d: "No." } }),
    q({ id: "mdq98-4", atom: "a-md-image-compress", d: 3, prompt: "A portrait photo is 3024 × 4032. How do you limit its longest side to 1280?", options: ["resize({ height: 1280 })", "resize({ width: 1280 })", "crop it to 1280 × 1280", "compress: 0.1"], correct: "a",
      explanation: "The height is the longer side; the width follows.",
      wrong: { b: "Height would be 1707.", c: "Cuts the photo.", d: "Ugly, and still huge in pixels." } }),
  ]),

  ...check("md-l99-location-maps", [
    q({ id: "mdq99-1", atom: "a-md-location", d: 2, prompt: "Which accuracy is enough to find a user's street address?", options: ["Balanced", "BestForNavigation", "Highest", "It needs GPS always"], correct: "a",
      explanation: "Kinder to the battery.",
      wrong: { b: "Wasteful.", c: "Wasteful.", d: "No." } }),
    q({ id: "mdq99-2", atom: "a-md-location", d: 2, prompt: "What must you do with the subscription from watchPositionAsync?", options: ["remove() it when you stop or the screen closes", "Nothing", "Save it to AsyncStorage", "Send it to the server"], correct: "a",
      explanation: "Or GPS keeps running.",
      wrong: { b: "Battery drain.", c: "No.", d: "No." } }),
    q({ id: "mdq99-3", atom: "a-md-location", d: 3, prompt: "When should an app ask for background location?", options: ["Only if its core feature needs it; stores review it closely", "Always, at first launch", "Whenever it might be useful", "Never mention it"], correct: "a",
      explanation: "The most sensitive permission.",
      wrong: { b: "Refused and rejected.", c: "No.", d: "Must be declared." } }),
    q({ id: "mdq99-4", atom: "a-md-maps", d: 2, prompt: "Which formula gives the distance between two coordinates on Earth?", options: ["Haversine", "Pythagoras on degrees", "Euclid", "Mercator"], correct: "a",
      explanation: "It accounts for the curve.",
      wrong: { b: "Wrong away from the equator.", c: "Flat.", d: "A projection." } }),
  ]),

  ...check("md-l100-notifications", [
    q({ id: "mdq100-1", atom: "a-md-push", d: 2, prompt: "Who sends a push notification?", options: ["Your server, through Expo's push service (APNs and FCM)", "The app itself", "The user's other phone", "The app store"], correct: "a",
      explanation: "The app only registers its token.",
      wrong: { b: "That's a local notification.", c: "No.", d: "No." } }),
    q({ id: "mdq100-2", atom: "a-md-push", d: 2, prompt: "What does getExpoPushTokenAsync need?", options: ["The EAS projectId", "The user's e-mail", "A Firebase password", "Nothing"], correct: "a",
      explanation: "From app.json's extra.eas.projectId.",
      wrong: { b: "No.", c: "No.", d: "It errors without one." } }),
    q({ id: "mdq100-3", atom: "a-md-push", d: 2, prompt: "Why create an Android notification channel?", options: ["Android 8+ needs one to show notifications, and users control each", "iOS requires it", "To get a token", "It's optional on all versions"], correct: "a",
      explanation: "Create it before asking.",
      wrong: { b: "Android only.", c: "Unrelated.", d: "Required." } }),
    q({ id: "mdq100-4", atom: "a-md-local-notifications", d: 3, prompt: "A daily reminder fires three times a day. What's the likely bug?", options: ["Re-scheduling without cancelling the old ones", "The trigger is wrong", "The phone's clock", "Too many channels"], correct: "a",
      explanation: "Keep the id; cancel first.",
      wrong: { b: "Usually not.", c: "No.", d: "No." } }),
    q({ id: "mdq100-5", atom: "a-md-local-notifications", d: 1, prompt: "Which trigger fires in one hour?", options: ["TIME_INTERVAL with seconds: 3600", "DAILY with hour: 1", "WEEKLY", "CALENDAR with month: 1"], correct: "a",
      explanation: "Seconds from now.",
      wrong: { b: "Every day at 1:00.", c: "No.", d: "No." } }),
  ]),

  ...check("md-l101-files-share-clipboard", [
    q({ id: "mdq101-1", atom: "a-md-documents", d: 2, prompt: "Why check a picked file's type yourself?", options: ["Some pickers ignore the filter", "Pickers never filter", "To compress it", "Stores require it"], correct: "a",
      explanation: "Filters are hints.",
      wrong: { b: "They usually do.", c: "No.", d: "No." } }),
    q({ id: "mdq101-2", atom: "a-md-documents", d: 2, prompt: "How do you read a picked text file's contents?", options: ["new File(uri).text() from expo-file-system", "fetch the name", "JSON.parse(uri)", "Read the clipboard"], correct: "a",
      explanation: "The File API.",
      wrong: { b: "No.", c: "No.", d: "No." } }),
    q({ id: "mdq101-3", atom: "a-md-sharing", d: 2, prompt: "Which shares a PDF file itself?", options: ["expo-sharing's shareAsync(fileUri)", "Share.share({ message })", "Clipboard", "Linking.openURL"], correct: "a",
      explanation: "Share.share is for text and links.",
      wrong: { b: "Text only.", c: "No.", d: "Opens, doesn't share." } }),
    q({ id: "mdq101-4", atom: "a-md-clipboard", d: 2, prompt: "When should an app read the clipboard?", options: ["Only when the user asks, such as tapping Paste", "Whenever the app opens", "Every few seconds", "Never"], correct: "a",
      explanation: "It may hold private data; iOS shows a prompt.",
      wrong: { b: "Privacy problem.", c: "Worse.", d: "Paste is fine." } }),
    q({ id: "mdq101-5", atom: "a-md-clipboard", d: 2, prompt: "After copying, what should users see?", options: ["Feedback such as \"Copied\", also announced to screen readers", "Nothing", "An alert they must dismiss", "A vibration only"], correct: "a",
      explanation: "Confirm the action.",
      wrong: { b: "Unclear.", c: "Annoying.", d: "Invisible to many." } }),
  ]),

  ...check("md-l102-haptics-biometrics", [
    q({ id: "mdq102-1", atom: "a-md-haptics", d: 2, prompt: "Which haptic suits a successful payment?", options: ["notificationAsync(Success)", "impactAsync(Heavy) three times", "selectionAsync", "None ever"], correct: "a",
      explanation: "An outcome.",
      wrong: { b: "Overkill.", c: "For choices.", d: "A small one is fine." } }),
    q({ id: "mdq102-2", atom: "a-md-haptics", d: 2, prompt: "Why pair haptics with something visible?", options: ["Many users and devices don't feel them", "Haptics are slow", "Stores require it", "To save battery"], correct: "a",
      explanation: "Never haptics alone.",
      wrong: { b: "No.", c: "No.", d: "No." } }),
    q({ id: "mdq102-3", atom: "a-md-biometrics", d: 2, prompt: "What does your app receive from Face ID?", options: ["Only success or failure", "The face image", "A fingerprint template", "The user's password"], correct: "a",
      explanation: "The OS keeps biometric data.",
      wrong: { b: "Never.", c: "Never.", d: "No." } }),
    q({ id: "mdq102-4", atom: "a-md-biometrics", d: 3, prompt: "Why always offer a PIN or password fallback?", options: ["Not every phone has biometrics set up, they fail, and accessibility needs it", "Biometrics are illegal", "PINs are more secure", "Apple requires a PIN"], correct: "a",
      explanation: "Biometrics are a convenience.",
      wrong: { b: "No.", c: "Not necessarily.", d: "No." } }),
  ]),

  ...check("md-l103-permissions-background", [
    q({ id: "mdq103-1", atom: "a-md-permission-denial", d: 2, prompt: "canAskAgain is false. What can the app do?", options: ["Explain and offer Linking.openSettings(), plus another way to continue", "Ask again", "Close the app", "Keep showing the prompt"], correct: "a",
      explanation: "The system prompt won't appear.",
      wrong: { b: "Nothing happens.", c: "No.", d: "It won't show." } }),
    q({ id: "mdq103-2", atom: "a-md-permission-denial", d: 2, prompt: "Why show your own explanation before the system prompt?", options: ["Users who understand why are far more likely to allow it", "The system prompt needs it", "To delay the user", "Stores forbid system prompts"], correct: "a",
      explanation: "A pre-prompt.",
      wrong: { b: "No.", c: "No.", d: "No." } }),
    q({ id: "mdq103-3", atom: "a-md-background-tasks", d: 2, prompt: "Where must TaskManager.defineTask be called?", options: ["At the top level of a file imported at start-up", "Inside a component's useEffect", "In app.json", "On the server"], correct: "a",
      explanation: "In the background no screen is mounted.",
      wrong: { b: "Not run in the background.", c: "No.", d: "No." } }),
    q({ id: "mdq103-4", atom: "a-md-background-tasks", d: 3, prompt: "You need to alert a user at 9:00 exactly when their order arrives. Background task or push?", options: ["Push from the server", "A background task every minute", "A background task with minimumInterval 1", "Keep the app open"], correct: "a",
      explanation: "The OS decides when tasks run, at least 15 minutes apart.",
      wrong: { b: "Not possible.", c: "Clamped to 15+.", d: "No." } }),
    q({ id: "mdq103-5", atom: "a-md-battery-privacy", d: 2, prompt: "Which declarations must match what your app collects?", options: ["Apple's privacy labels and Google Play's Data safety form", "Only the privacy policy", "Nothing is required", "Only for paid apps"], correct: "a",
      explanation: "Including third-party SDKs.",
      wrong: { b: "Both stores require forms too.", c: "Required.", d: "All apps." } }),
  ]),

  ...check("md-l104-m16-project", [
    q({ id: "mdq104-1", atom: "a-md-m16-project", d: 2, prompt: "Location is refused while making a report. What should happen?", options: ["The report can still be sent, with a typed description of where", "Block the report", "Close the app", "Ask again in a loop"], correct: "a",
      explanation: "Degrade gracefully.",
      wrong: { b: "Too harsh.", c: "No.", d: "Won't work." } }),
    q({ id: "mdq104-2", atom: "a-md-m16-project", d: 2, prompt: "How does a \"fixed\" notification open the right report?", options: ["Its data.url, pushed with the router when tapped", "The user searches for it", "The app polls", "It can't"], correct: "a",
      explanation: "Module 9's pattern.",
      wrong: { b: "No.", c: "No.", d: "It can." } }),
    q({ id: "mdq104-3", atom: "a-md-m16-project", d: 2, prompt: "Why prepare the photo before the multipart upload?", options: ["The server refuses photos over 1 MB, and mobile data is precious", "FormData requires it", "To change its format to PNG", "Not needed"], correct: "a",
      explanation: "Resize and compress.",
      wrong: { b: "No.", c: "JPEG is better for photos.", d: "It is." } }),
    q({ id: "mdq104-4", atom: "a-md-m16-project", d: 3, prompt: "Which test matters most before release?", options: ["Each permission refused, once and permanently, on real Android and iOS phones", "Only the happy path", "Only the web preview", "Only on the simulator"], correct: "a",
      explanation: "Refusals are where apps break.",
      wrong: { b: "Misses failures.", c: "No hardware.", d: "Not enough." } }),
  ]),
};
