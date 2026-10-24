/**
 * Expo Router's own SafeAreaProvider. On the web it provides zero insets
 * (browsers have no notch); the practice phone has a status bar and a home
 * indicator, so the router gets the phone's insets like any native app.
 */
export { SafeAreaProvider } from "../safeArea.js";
