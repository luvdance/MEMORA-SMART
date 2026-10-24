/**
 * ASSESSMENTS · MOBILE APP DEVELOPMENT · MODULE 9 · NAVIGATION AND MULTI-SCREEN APPLICATIONS
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Never import this from anything under src/.
 * ═════════════════════════════════════════════════════════════════════════
 */

import { q, check } from "./md-helpers.js";

export const ASSESSMENTS = {
  ...check("md-l49-stack", [
    q({ id: "mdq49-1", atom: "a-md-expo-router", d: 1, prompt: "In an Expo Router app, what creates a new screen?", options: ["Adding a file under src/app/", "Registering it in App.tsx", "Editing app.json", "Installing a package"], correct: "a",
      explanation: "File-based routing: the file path is the URL.",
      wrong: { b: "Not needed with Expo Router.", c: "app.json configures the app, not routes.", d: "No." } }),
    q({ id: "mdq49-2", atom: "a-md-expo-router", d: 2, prompt: "Which file becomes the URL /recipe/7?", options: ["src/app/recipe/[id].tsx", "src/app/recipe.tsx", "src/app/[recipe]/7.tsx", "src/app/_layout.tsx"], correct: "a",
      explanation: "[id] is a dynamic segment; id becomes \"7\".",
      wrong: { b: "That is /recipe only.", c: "Backwards.", d: "Layouts wrap screens; they are not one." } }),
    q({ id: "mdq49-3", atom: "a-md-stack-navigation", d: 2, prompt: "In a stack, what does router.push do that router.replace does not?", options: ["Keeps the current screen underneath so Back returns to it", "Opens a modal", "Clears all history", "Reloads the app"], correct: "a",
      explanation: "replace swaps the current screen out.",
      wrong: { b: "That is presentation: \"modal\".", c: "That is dismissAll.", d: "No." } }),
    q({ id: "mdq49-4", atom: "a-md-stack-navigation", d: 2, prompt: "In SDK 58, a file exists in src/app/ but the Stack does not declare it. What happens?", options: ["The navigator does not show it", "It appears as the first screen", "The app crashes", "It becomes a tab"], correct: "a",
      explanation: "A navigator shows only the screens it declares.",
      wrong: { b: "No.", c: "No.", d: "No." } }),
  ]),

  ...check("md-l50-tabs-drawer", [
    q({ id: "mdq50-1", atom: "a-md-tabs-router", d: 1, prompt: "When suit bottom tabs best?", options: ["Three to five top-level sections users switch between often", "A step-by-step checkout", "A single screen", "Twenty sections"], correct: "a",
      explanation: "Tabs are for frequent, equal sections.",
      wrong: { b: "That is a stack.", c: "Nothing to switch.", d: "Too many; use a drawer or a list." } }),
    q({ id: "mdq50-2", atom: "a-md-tabs-router", d: 2, prompt: "What does putting tab screens in a (tabs) folder do to their URLs?", options: ["Nothing: a group in brackets does not appear in the URL", "Adds /tabs to every URL", "Hides them", "Makes them modals"], correct: "a",
      explanation: "Groups organise files without changing paths.",
      wrong: { b: "Brackets keep it out.", c: "No.", d: "No." } }),
    q({ id: "mdq50-3", atom: "a-md-drawer", d: 2, prompt: "Why is a drawer a weaker choice than tabs for the app's main sections?", options: ["Its options are hidden until opened, so people use them less", "Drawers are not allowed on iOS", "Drawers cannot hold screens", "Drawers are slower"], correct: "a",
      explanation: "Out of sight, out of mind.",
      wrong: { b: "They are allowed.", c: "They can.", d: "No." } }),
    q({ id: "mdq50-4", atom: "a-md-tabs-router", d: 2, prompt: "Why do tab icons often use an outline style for inactive tabs and a filled one for the active tab?", options: ["To show the current section by more than colour alone", "Stores require it", "Filled icons load faster", "To save space"], correct: "a",
      explanation: "Shape plus colour helps everyone, including colour-blind users.",
      wrong: { b: "No.", c: "No.", d: "No." } }),
  ]),

  ...check("md-l51-params-nesting", [
    q({ id: "mdq51-1", atom: "a-md-params", d: 2, prompt: "How does a details screen read the id from /recipe/7?", options: ["useLocalSearchParams<{ id: string }>()", "props.id", "window.location", "useState(\"7\")"], correct: "a",
      explanation: "Typed route params.",
      wrong: { b: "Screens don't receive it as a prop.", c: "Not on a phone.", d: "Hard-coded." } }),
    q({ id: "mdq51-2", atom: "a-md-params", d: 3, prompt: "Why pass an id in the URL rather than the whole recipe object?", options: ["URLs carry strings, and the screen can then be opened from a link alone", "Objects are faster", "Ids are required by the stores", "It hides the data"], correct: "a",
      explanation: "The screen loads what it needs from the id.",
      wrong: { b: "Objects don't fit in URLs.", c: "No.", d: "No." } }),
    q({ id: "mdq51-3", atom: "a-md-back-reset", d: 3, prompt: "After a payment succeeds, Back should not return to the payment form. What do you do?", options: ["router.dismissAll() then router.replace(\"/done\")", "router.push(\"/done\")", "Hide the Back button only", "Restart the app"], correct: "a",
      explanation: "Start a fresh history; replace alone swaps only the current screen.",
      wrong: { b: "Pay stays underneath.", c: "Android's back button still works.", d: "No." } }),
    q({ id: "mdq51-4", atom: "a-md-nested", d: 2, prompt: "A recipe details screen should cover the tab bar. Where does its route go?", options: ["In the root Stack, outside the (tabs) group", "Inside the (tabs) folder", "In a drawer", "In app.json"], correct: "a",
      explanation: "The root Stack sits above the tabs.",
      wrong: { b: "It would show the tab bar.", c: "No.", d: "No." } }),
  ]),

  ...check("md-l52-auth-navigation", [
    q({ id: "mdq52-1", atom: "a-md-auth-nav", d: 2, prompt: "What happens to screens inside <Stack.Protected guard={false}>?", options: ["They are unreachable, and visitors are redirected", "They show a lock icon", "They crash", "They load slowly"], correct: "a",
      explanation: "They do not exist for that navigator while the guard is false.",
      wrong: { b: "No.", c: "No.", d: "No." } }),
    q({ id: "mdq52-2", atom: "a-md-auth-nav", d: 2, prompt: "With the two guards in place, what moves the user into the app after signing in?", options: ["Changing the session: the guards flip and the router moves them", "A router.push in every screen", "Restarting the app", "A deep link"], correct: "a",
      explanation: "No router calls needed, and no history back to sign-in.",
      wrong: { b: "Not needed.", c: "No.", d: "No." } }),
    q({ id: "mdq52-3", atom: "a-md-protected-screens", d: 3, prompt: "An admin screen is protected with Stack.Protected. Is the admin data now secure?", options: ["No: the server must also refuse non-admins", "Yes, completely", "Yes, on iOS only", "Only in release builds"], correct: "a",
      explanation: "Guards run on the phone; they keep navigation correct, not data safe.",
      wrong: { b: "A modified app or direct API call skips it.", c: "No.", d: "No." } }),
    q({ id: "mdq52-4", atom: "a-md-protected-screens", d: 2, prompt: "What does redirectTo=\"/\" add to a Stack.Protected?", options: ["Where a refused visitor is sent", "A title", "A redirect after sign-out only", "Nothing"], correct: "a",
      explanation: "Otherwise they go to the navigator's anchor.",
      wrong: { b: "No.", c: "Any refused visit.", d: "It does." } }),
  ]),

  ...check("md-l53-deep-links", [
    q({ id: "mdq53-1", atom: "a-md-deep-links", d: 2, prompt: "With \"scheme\": \"recipes\" in app.json, what does recipes://recipe/2 open?", options: ["The app, on src/app/recipe/[id].tsx with id \"2\"", "A web page", "The app store", "Nothing without extra code"], correct: "a",
      explanation: "Every route already has a URL.",
      wrong: { b: "It is an app scheme.", c: "No.", d: "Expo Router handles it." } }),
    q({ id: "mdq53-2", atom: "a-md-deep-links", d: 3, prompt: "A link opens the app from closed on a recipe, and Back closes the app. What fixes it?", options: ["export const unstable_settings = { anchor: \"index\" } in the layout", "A +not-found route", "router.replace", "A new scheme"], correct: "a",
      explanation: "The anchor puts the list underneath on a cold start.",
      wrong: { b: "That handles bad links.", c: "No.", d: "No." } }),
    q({ id: "mdq53-3", atom: "a-md-deep-links", d: 1, prompt: "What is +not-found.tsx for?", options: ["Links to screens that do not exist", "Network errors", "Signed-out users", "Missing images"], correct: "a",
      explanation: "Give a way home instead of a dead end.",
      wrong: { b: "No.", c: "That is protection.", d: "No." } }),
    q({ id: "mdq53-4", atom: "a-md-notification-links", d: 3, prompt: "The app was closed when the user tapped a notification. Which call finds that tap?", options: ["Notifications.getLastNotificationResponse()", "addNotificationReceivedListener", "scheduleNotificationAsync", "getPermissionsAsync"], correct: "a",
      explanation: "The listener only catches taps while the app runs.",
      wrong: { b: "That fires when a notification arrives, not when tapped.", c: "Sends one.", d: "Permissions." } }),
    q({ id: "mdq53-5", atom: "a-md-notification-links", d: 2, prompt: "Why return () => subscription.remove() from the effect?", options: ["So the listener does not keep running, or run twice, after unmount", "Stores require it", "To delete the notification", "To silence the sound"], correct: "a",
      explanation: "Always clean up listeners.",
      wrong: { b: "No.", c: "No.", d: "No." } }),
  ]),

  ...check("md-l54-organising", [
    q({ id: "mdq54-1", atom: "a-md-organising", d: 2, prompt: "Where does a function that fetches recipes from the server belong?", options: ["src/services/", "src/app/", "src/utils/", "src/constants/"], correct: "a",
      explanation: "Services talk to servers.",
      wrong: { b: "Only route files there.", c: "Utils are small pure functions.", d: "Configuration." } }),
    q({ id: "mdq54-2", atom: "a-md-organising", d: 2, prompt: "formatMinutes(75) → \"1 h 15 min\" belongs in…", options: ["src/utils/", "src/hooks/", "src/services/", "src/app/"], correct: "a",
      explanation: "A pure function with no state or network.",
      wrong: { b: "No state.", c: "No network.", d: "Not a route." } }),
    q({ id: "mdq54-3", atom: "a-md-organising", d: 2, prompt: "Why must src/app/ hold only route files?", options: ["Every file there becomes a screen", "It loads faster", "Git requires it", "TypeScript requires it"], correct: "a",
      explanation: "A helper file there would become a route.",
      wrong: { b: "No.", c: "No.", d: "No." } }),
    q({ id: "mdq54-4", atom: "a-md-organising", d: 3, prompt: "What is the main benefit of a thin screen that only uses useRecipes and RecipeRow?", options: ["Each part can be read, reused and tested on its own", "The app is smaller", "It works offline", "It needs no types"], correct: "a",
      explanation: "One job per file.",
      wrong: { b: "Not much.", c: "Unrelated.", d: "Types still matter." } }),
  ]),

  ...check("md-l55-m9-project", [
    q({ id: "mdq55-1", atom: "a-md-m9-project", d: 2, prompt: "Which navigator should hold the tabs, the details screen and sign-in?", options: ["A root Stack", "The Tabs", "A Drawer", "None"], correct: "a",
      explanation: "The root Stack holds the (tabs) group and screens that cover it.",
      wrong: { b: "Details would show the tab bar.", c: "No.", d: "They need one." } }),
    q({ id: "mdq55-2", atom: "a-md-m9-project", d: 2, prompt: "How do you protect only the Favourites tab?", options: ["Tabs.Protected around that Tabs.Screen", "Hide it with CSS", "A Stack.Protected in the root around (tabs)", "Delete the file"], correct: "a",
      explanation: "Protect exactly the screens that need it.",
      wrong: { b: "No.", c: "That hides every tab.", d: "No." } }),
    q({ id: "mdq55-3", atom: "a-md-m9-project", d: 2, prompt: "How does the details screen set its header title to the recipe's name?", options: ["<Stack.Screen options={{ title }} /> inside the screen", "Edit app.json", "document.title", "A Text at the top"], correct: "a",
      explanation: "Screens can set their own options.",
      wrong: { b: "No.", c: "Not on a phone.", d: "That is content, not the header." } }),
    q({ id: "mdq55-4", atom: "a-md-m9-project", d: 3, prompt: "How should you test Back in this app?", options: ["Android's back button and iOS's swipe on every screen, including after a link", "Only the header arrow", "Only on the web", "It needs no test"], correct: "a",
      explanation: "Back works differently on each platform.",
      wrong: { b: "Misses Android's button.", c: "Phones differ.", d: "It does." } }),
  ]),
};
