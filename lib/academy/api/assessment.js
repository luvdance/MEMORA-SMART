import { serveQuestions, gradeSubmission, parseSeed } from "../grade.js";

/**
 * /api/academy/assessment
 *
 *   GET  ?lessonId=...        → questions WITHOUT answers
 *   POST { lessonId, answers} → score + per-question feedback
 *
 * Needs no credentials and touches no database, so it runs identically on
 * Vercel and in local dev (see the academyApi plugin in vite.config.js).
 * Its only job is to keep the answer key off the client.
 */
export default async function handler(req, res) {
  if (req.method === "GET") {
    const { lessonId, seed } = req.query || {};
    if (!lessonId) return res.status(400).json({ error: "lessonId is required" });

    const assessment = serveQuestions(lessonId, parseSeed(seed));
    if (!assessment) return res.status(404).json({ error: "No assessment for that lesson" });

    return res.status(200).json(assessment);
  }

  if (req.method === "POST") {
    const { lessonId, answers } = req.body || {};
    if (!lessonId) return res.status(400).json({ error: "lessonId is required" });

    const result = gradeSubmission(lessonId, answers || {});
    if (!result) return res.status(404).json({ error: "No assessment for that lesson" });

    return res.status(200).json(result);
  }

  res.setHeader("Allow", "GET, POST");
  return res.status(405).json({ error: "Method not allowed" });
}
