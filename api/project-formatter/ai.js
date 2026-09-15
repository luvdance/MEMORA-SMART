import classify from "../../lib/project-formatter/classify.js";
import generateContent from "../../lib/project-formatter/generate-content.js";

/**
 * The JavaScript half of /api/project-formatter/*, behind one function.
 *
 * Vercel's Hobby plan allows 12 Serverless Functions per deployment and counts
 * every file under api/ (render.py and upload.py included), so these two
 * handlers moved to lib/ and this function dispatches by `?action=`.
 *
 * The pretty URLs are preserved by rewrites in vercel.json:
 *
 *   /api/project-formatter/classify         → /api/project-formatter/ai?action=classify
 *   /api/project-formatter/generate-content → /api/project-formatter/ai?action=generate-content
 *
 * render.py and upload.py are untouched and keep their own URLs: they are real
 * files, and Vercel's filesystem check runs ahead of rewrites.
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
