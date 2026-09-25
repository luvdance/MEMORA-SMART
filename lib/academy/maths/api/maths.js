import {
  serveSet,
  serveReview,
  serveHint,
  serveScaffold,
  makeTwin,
  gradeItem,
  gradeCheck,
  gradeScaffoldStep,
  getCoverage,
  parseSeed,
} from "../engine.js";

/**
 * /api/academy/maths
 *
 * The only door between the browser and the maths answer key. Every drill
 * question comes through here without its answer, and every answer a student
 * types comes back here to be marked.
 *
 * It sits beside /api/academy/assessment, which does the same job for the
 * written knowledge checks at the end of every lesson. The split is not
 * arbitrary: assessment serves AUTHORED multiple-choice items from a fixed
 * bank, this serves GENERATED typed-answer items, and the two have different
 * shapes for good reasons. Both keep their answers server-side.
 *
 * Operations are named by `op` rather than by verb because there are eight of
 * them and eight serverless functions is not an option — Vercel's Hobby plan
 * allows twelve for the whole project, which is why api/academy.js already
 * dispatches by `?action=`. This is that pattern one level down.
 *
 *   GET  ?op=set        &atom&kind[&seed][&count]    a drill or a revision check
 *        ?op=review     &atoms=a,b,c[&count]         a mixed review of earlier skills
 *        ?op=hint       &atom&tier&seed&index&level  one rung of the ladder
 *        ?op=scaffold   &atom&tier&seed&index        the item, cut into steps
 *        ?op=twin       &atom&tier&seed&index        a fresh item of the same kind
 *        ?op=coverage                                which skills are drillable
 *
 *   POST { op: "item" }          mark one answer, with the repair plan
 *        { op: "check" }         mark a revision check
 *        { op: "scaffold-step" } mark one step of a scaffold
 *
 * Needs no credentials and touches no database, exactly like the assessment
 * route, so it behaves identically on Vercel and in local dev.
 *
 * ── WHAT THIS ENDPOINT WILL NOT DO ───────────────────────────────────────
 * It will not hand out an answer for an item the student has not attempted.
 * `op=item` returns the worked solution only in the response to a submitted
 * answer, and `op=hint` returns one rung at a time. There is no operation
 * that returns an answer key, and adding one would make the drills decorative.
 */
export default async function handler(req, res) {
  const query = req.query || {};

  if (req.method === "GET") {
    const op = query.op;
    const seed = parseSeed(query.seed);
    const count = query.count ? Number(query.count) : undefined;

    switch (op) {
      case "set": {
        if (!query.atom) return bad(res, "atom is required");
        const set = serveSet(query.atom, query.kind || "build", seed, count);
        return set ? ok(res, set) : missing(res, query.atom);
      }

      case "review": {
        const atoms = String(query.atoms || "").split(",").filter(Boolean);
        if (!atoms.length) return bad(res, "atoms is required");
        return ok(res, serveReview(atoms, seed, count));
      }

      case "hint": {
        const hint = serveHint(
          query.atom,
          query.tier || "build",
          seed,
          Number(query.index) || 0,
          Number(query.level) || 0
        );
        return hint ? ok(res, hint) : missing(res, query.atom);
      }

      case "scaffold": {
        const scaffold = serveScaffold({
          atom: query.atom,
          tier: query.tier || "build",
          seed,
          index: Number(query.index) || 0,
        });
        // A missing scaffold is not an error. Most items do not have one and
        // the drill falls back to a twin, which is the normal path.
        return ok(res, scaffold || { atom: query.atom, steps: [], hasScaffold: false });
      }

      case "twin": {
        const twin = makeTwin({
          atom: query.atom,
          tier: query.tier || "build",
          seed,
          index: Number(query.index) || 0,
        });
        return twin ? ok(res, twin) : missing(res, query.atom);
      }

      case "coverage":
        return ok(res, getCoverage());

      default:
        return bad(res, `Unknown maths operation: ${op}`);
    }
  }

  if (req.method === "POST") {
    const body = req.body || {};
    const seed = parseSeed(body.seed);

    switch (body.op) {
      case "item": {
        const marked = gradeItem({
          atom: body.atom,
          tier: body.tier || "build",
          seed,
          index: Number(body.index) || 0,
          value: body.value,
          attempt: Number(body.attempt) || 1,
        });
        return marked ? ok(res, marked) : missing(res, body.atom);
      }

      case "check": {
        const marked = gradeCheck({ atom: body.atom, seed, answers: body.answers || {} });
        return marked ? ok(res, marked) : missing(res, body.atom);
      }

      case "scaffold-step": {
        const marked = gradeScaffoldStep({
          atom: body.atom,
          tier: body.tier || "build",
          seed,
          index: Number(body.index) || 0,
          step: Number(body.step) || 0,
          value: body.value,
        });
        return marked ? ok(res, marked) : missing(res, body.atom);
      }

      default:
        return bad(res, `Unknown maths operation: ${body.op}`);
    }
  }

  res.setHeader("Allow", "GET, POST");
  return res.status(405).json({ error: "Method not allowed" });
}

const ok = (res, payload) => res.status(200).json(payload);
const bad = (res, error) => res.status(400).json({ error });
const missing = (res, atom) =>
  res.status(404).json({
    error: "not-authored",
    atom,
    // Said plainly so the lesson can show the truth rather than a spinner: the
    // skill is on the map, its drill questions are not written yet.
    message: "This skill is on the map but its drill questions are not written yet.",
  });
