/**
 * Analytics, loaded after the page is usable.
 *
 * posthog-js is about 180 KB of JavaScript. Imported at the top of main.jsx
 * it sat in front of the first paint of every page, so every visitor waited
 * for analytics before they could see anything. It now loads once the
 * browser is idle; calls made before that are queued and replayed, so no
 * event is lost.
 */
const KEY = "phc_DnECovXg7mktZUwdPRA4oM2ewZdNmBX4hzMpZk37f2by";

let client = null;
let queue = [];

function run(fn, label) {
  if (!client) {
    queue.push([fn, label]);
    return;
  }
  try {
    fn(client);
  } catch (e) {
    console.warn(`${label} error:`, e);
  }
}

/** Called once from main.jsx. */
export function startAnalytics() {
  const load = () =>
    import("posthog-js")
      .then(({ default: posthog }) => {
        posthog.init(KEY, {
          api_host: "https://us.i.posthog.com",
          defaults: "2026-01-30",
        });
        client = posthog;
        const pending = queue;
        queue = [];
        for (const [fn, label] of pending) run(fn, label);
      })
      .catch((e) => console.warn("Analytics failed to load:", e));

  if ("requestIdleCallback" in window) requestIdleCallback(load, { timeout: 4000 });
  else setTimeout(load, 2000);
}

// Track any event with optional properties
export const track = (event, properties = {}) =>
  run((ph) => ph.capture(event, properties), "Analytics");

// Link a logged-in user to their events
export const identify = (userId, traits = {}) =>
  run((ph) => ph.identify(userId, traits), "Identify");

// Reset on logout
export const resetAnalytics = () => run((ph) => ph.reset(), "Reset");
