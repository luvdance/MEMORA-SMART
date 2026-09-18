import { serveForm } from "../finalExam/assemble.js";
import { gradeExam } from "../finalExam/grade.js";
import { BLUEPRINT, DOMAINS, FORM_SIZE } from "../finalExam/blueprint.js";
import {
  identify,
  recordAttempt,
  isRecordingAvailable,
} from "../finalExam/record.js";

/**
 * /api/academy/final-exam
 *
 *   GET                      → the blueprint, for the pre-exam briefing page
 *   GET  ?seed=...           → the candidate's paper, WITHOUT answers
 *   POST { seed, answers }   → the result: score, per-domain breakdown, verdict
 *
 * The seed is the whole protocol. A candidate is issued one when they start,
 * it is the only thing the client needs to hold, and the server re-derives the
 * identical paper from it both to serve and to grade. So the answer key never
 * reaches a browser and the client is never trusted about which paper it sat.
 *
 * Seeds are generated HERE rather than accepted from the client on a fresh
 * start, because a candidate who chooses their own seed could shop for a paper
 * — sit one, note the easy seed, and hand it to a friend. `start=1` asks the
 * server for one.
 *
 * Needs no credentials and touches no database, so it behaves identically on
 * Vercel and in local dev (see the academyApi plugin in vite.config.js).
 * Recording the result against a student is the caller's job.
 */
export default async function handler(req, res) {
  if (req.method === "GET") {
    const { seed, start } = req.query || {};

    // A fresh attempt: issue a seed and the paper that goes with it.
    if (start) {
      const fresh = (Math.random() * 4294967296) >>> 0;
      return res.status(200).json(serveForm(fresh));
    }

    // Resuming, or a reload mid-exam: the same seed returns the same paper.
    if (seed !== undefined) {
      const parsed = Number(seed);
      if (!Number.isFinite(parsed) || parsed < 0 || parsed > 4294967295) {
        return res.status(400).json({ error: "seed must be a 32-bit unsigned integer" });
      }
      return res.status(200).json(serveForm(parsed >>> 0));
    }

    // No seed: the briefing. What the exam covers and how it is marked, so a
    // candidate knows the rules before they start the clock.
    return res.status(200).json({
      examId: BLUEPRINT.id,
      version: BLUEPRINT.version,
      title: BLUEPRINT.title,
      subtitle: BLUEPRINT.subtitle,
      itemCount: FORM_SIZE,
      durationMinutes: BLUEPRINT.durationMinutes,
      passMark: BLUEPRINT.passMark,
      domainMinimum: BLUEPRINT.domainMinimum,
      attemptLimit: BLUEPRINT.attemptLimit,
      requiresModules: BLUEPRINT.requiresModules,
      certificate: BLUEPRINT.certificate,
      domains: DOMAINS.map((d) => ({
        id: d.id,
        name: d.name,
        short: d.short,
        items: d.items.core + d.items.advanced,
        covers: d.covers,
      })),
    });
  }

  if (req.method === "POST") {
    const { seed, answers } = req.body || {};
    const parsed = Number(seed);
    if (!Number.isFinite(parsed) || parsed < 0 || parsed > 4294967295) {
      return res.status(400).json({ error: "a valid seed is required to grade an attempt" });
    }
    if (answers && typeof answers !== "object") {
      return res.status(400).json({ error: "answers must be an object of itemId to response" });
    }

    try {
      const result = gradeExam(parsed >>> 0, answers || {});

      // Persist the attempt, and issue a certificate on a pass. The candidate
      // is identified from their Firebase ID token, never from the body, so a
      // request cannot write a pass into somebody else's record.
      //
      // A failure to record does not fail the request: the paper was graded
      // correctly and the candidate is entitled to see that. But the response
      // says plainly whether it was stored, and `certificate.eligible` is
      // downgraded when no certificate was actually issued — so nobody is
      // shown a credential that does not exist.
      const candidate = await identify(req.headers?.authorization);
      let persistence = { recorded: false, reason: "not-identified" };
      if (candidate) {
        try {
          persistence = await recordAttempt(candidate, result);
        } catch (err) {
          persistence = { recorded: false, reason: err.message };
        }
      } else if (!isRecordingAvailable()) {
        persistence = { recorded: false, reason: "no-credentials" };
      }

      const certificate = persistence.certificate
        ? { eligible: true, issued: true, ...persistence.certificate }
        : {
            ...result.certificate,
            issued: false,
            ...(result.passed
              ? { pendingReason: persistence.certificateError || persistence.reason }
              : {}),
          };

      return res.status(200).json({
        ...result,
        certificate,
        recorded: persistence.recorded,
        attempts: persistence.attempts ?? null,
      });
    } catch (err) {
      // Assembly throws only when the bank cannot satisfy the blueprint, which
      // is a deployment fault, not a candidate one. Say so plainly.
      return res.status(500).json({ error: `Exam could not be graded: ${err.message}` });
    }
  }

  res.setHeader("Allow", "GET, POST");
  return res.status(405).json({ error: "Method not allowed" });
}
