import { routes } from "../lib/cv/handlers.js";

/**
 * One function for every /api/cv/* route (same pattern as api/academy.js).
 *
 * Vercel's Hobby plan allows 12 Serverless Functions per deployment and this
 * project was already at 12, so the CV endpoints share this one function and
 * dispatch on `?action=`. Rewrites in vercel.json map the pretty URLs, and
 * keep the old ones working:
 *
 *   /api/cv/:action                → /api/cv?action=:action
 *   /api/ats-score                 → /api/cv?action=ats-score
 *   /api/optimize-cv               → /api/cv?action=optimize
 *   /api/verify-paystack-payment   → /api/cv?action=verify-payment
 *   /api/requery-payment           → /api/cv?action=requery
 *
 * Add a route in lib/cv/handlers.js; it is served here automatically.
 */
export default async function handler(req, res) {
  const { action } = req.query || {};
  const route = routes[action];
  if (!route) {
    return res.status(404).json({ error: `Unknown CV route: ${action}` });
  }
  try {
    return await route(req, res);
  } catch (err) {
    console.error(`/api/cv/${action} failed:`, err);
    return res.status(500).json({ success: false, error: err.message || "Server error" });
  }
}
