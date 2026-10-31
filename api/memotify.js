import { routes } from "../lib/memotify/handlers.js";

/**
 * One function for every /api/memotify/* route (same pattern as api/cv.js), so
 * Memotify costs one of the Hobby plan's twelve function slots however many
 * routes it grows. vercel.json rewrites /api/memotify/:action to ?action=.
 *
 * Add a route in lib/memotify/handlers.js; it is served here automatically.
 */
export default async function handler(req, res) {
  const { action } = req.query || {};
  const route = routes[action];
  if (!route) {
    return res.status(404).json({ error: `Unknown Memotify route: ${action}` });
  }
  try {
    return await route(req, res);
  } catch (err) {
    console.error(`/api/memotify/${action} failed:`, err);
    return res.status(500).json({ error: "Something went wrong on our side. Please try again." });
  }
}
