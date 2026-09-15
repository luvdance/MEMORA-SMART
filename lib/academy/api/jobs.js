import { recommendJobs } from "../jobs/index.js";

/**
 * /api/academy/jobs
 *
 * GET ?completed=a,b,c&inProgress=d&level=3&query=data%20analyst
 *
 * Returns real, live postings ranked for this learner. Needs no credentials:
 * the free sources work without a key, and JOBS_API_KEY adds one more when it
 * is configured.
 */
export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { completed = "", inProgress = "", level = "1", query } = req.query || {};

  try {
    const result = await recommendJobs(
      {
        completedModuleIds: completed ? completed.split(",").filter(Boolean) : [],
        inProgressModuleIds: inProgress ? inProgress.split(",").filter(Boolean) : [],
        level: Number(level) || 1,
      },
      { query: query || "data analyst" }
    );

    // Postings change slowly; let the edge hold them briefly too
    res.setHeader("Cache-Control", "public, max-age=300, stale-while-revalidate=1800");
    return res.status(200).json(result);
  } catch (err) {
    return res.status(502).json({ error: "Could not reach the job sources", detail: err.message });
  }
}
