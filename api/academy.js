import assessment from "../lib/academy/api/assessment.js";
import finalExam from "../lib/academy/api/finalExam.js";
import jobs from "../lib/academy/api/jobs.js";

/**
 * One function for every /api/academy/* route.
 *
 * Vercel's Hobby plan allows 12 Serverless Functions per deployment and counts
 * every file under api/, so both academy handlers live in lib/academy/api/ and
 * this single function dispatches to them by `?action=`.
 *
 * The pretty URLs are preserved by rewrites in vercel.json:
 *
 *   /api/academy/assessment → /api/academy?action=assessment
 *   /api/academy/final-exam → /api/academy?action=final-exam
 *   /api/academy/jobs       → /api/academy?action=jobs
 *
 * Do NOT reintroduce a `[action].js` dynamic route here. Vercel did not match
 * those filenames on this project: GET fell through to the SPA catch-all
 * rewrite and returned index.html, so the client got HTML where it expected
 * JSON. Plain filenames plus explicit rewrites are what actually deploy.
 *
 * Add a route by adding an entry here AND a rewrite in vercel.json.
 */
const routes = { assessment, "final-exam": finalExam, jobs };

export default async function handler(req, res) {
  const { action } = req.query || {};
  const route = routes[action];

  if (!route) {
    return res.status(404).json({ error: `Unknown academy route: ${action}` });
  }

  return route(req, res);
}
