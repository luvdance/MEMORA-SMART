import classify from "../../lib/project-formatter/classify.js";
import generateContent from "../../lib/project-formatter/generate-content.js";

/**
 * The JavaScript half of /api/project-formatter/*, behind one function.
 *
 * Vercel's Hobby plan allows 12 Serverless Functions per deployment and every
 * file under api/ is one, so these two handlers moved to lib/ and this dynamic
 * route dispatches to them. The public URLs are unchanged:
 *
 *   /api/project-formatter/classify         → lib/project-formatter/classify.js
 *   /api/project-formatter/generate-content → lib/project-formatter/generate-content.js
 *
 * render.py and upload.py stay as their own functions. They are static routes,
 * which Vercel resolves ahead of this dynamic one, so /render and /upload keep
 * hitting the Python functions rather than falling through to here.
 */
const routes = {
  classify,
  "generate-content": generateContent,
};

export default async function handler(req, res) {
  const { action } = req.query || {};
  const route = routes[action];

  if (!route) {
    return res.status(404).json({ error: `Unknown project-formatter route: ${action}` });
  }

  return route(req, res);
}
