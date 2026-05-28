import posthog from "posthog-js";

// Track any event with optional properties
export const track = (event, properties = {}) => {
  try {
    posthog.capture(event, properties);
  } catch (e) {
    console.warn("Analytics error:", e);
  }
};

// Link a logged-in user to their events
export const identify = (userId, traits = {}) => {
  try {
    posthog.identify(userId, traits);
  } catch (e) {
    console.warn("Identify error:", e);
  }
};

// Reset on logout
export const resetAnalytics = () => {
  try {
    posthog.reset();
  } catch (e) {
    console.warn("Reset error:", e);
  }
};