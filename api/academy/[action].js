import assessment from "../../lib/academy/api/assessment.js";
import jobs from "../../lib/academy/api/jobs.js";

/**
 * One function for every /api/academy/* route.
 *
 * Vercel's Hobby plan allows 12 Serverless Functions per deployment, and every
 * file under api/ is one. A dynamic route counts once no matter how many
 * actions it serves, so the handlers live in lib/academy/api/ and this file
 * dispatches to them. The public URLs are unchanged:
 *
 *   /api/academy/assessment  → lib/academy/api/assessment.js
 *   /api/academy/jobs        → lib/academy/api/jobs.js
 *
 * Add a route by adding an entry here, not a new file under api/.
 */
const routes = { assessment, jobs };

export default async function handler(req, res) {
  const { action } = req.query || {};
  const route = routes[action];

  if (!route) {
    return res.status(404).json({ error: `Unknown academy route: ${action}` });
  }

  return route(req, res);
}
