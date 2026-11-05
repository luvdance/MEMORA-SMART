import { lazy } from "react";

/**
 * React.lazy for whole pages, with recovery from a stale deploy.
 *
 * Page chunks are content-hashed, and a deploy deletes the old hashes. A tab
 * opened before the deploy still holds the old index, so its next navigation
 * asks for a chunk that no longer exists and the import rejects. Plain lazy()
 * turns that into a blank screen. Here a failed import retries once, then
 * reloads the page (once per session, so a real outage cannot loop) to pick
 * up the new index.
 */
const RELOAD_KEY = "mst:chunk-reload";

export default function lazyPage(load) {
  return lazy(async () => {
    try {
      const mod = await load().catch(() => load());
      try {
        sessionStorage.removeItem(RELOAD_KEY);
      } catch {
        // Storage can be blocked; the reload guard is best effort.
      }
      return mod;
    } catch (err) {
      let reloaded = false;
      try {
        reloaded = sessionStorage.getItem(RELOAD_KEY) === "1";
        if (!reloaded) sessionStorage.setItem(RELOAD_KEY, "1");
      } catch {
        reloaded = true;
      }
      if (!reloaded) {
        window.location.reload();
        // Never resolves: the reload replaces the page.
        return new Promise(() => {});
      }
      throw err;
    }
  });
}
