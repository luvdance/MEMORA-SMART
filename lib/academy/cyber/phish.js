/**
 * PHISHING TRIAGE ENGINE
 *
 * Pure. Imported by src/academy/components/PhishInspect.jsx AND by the content
 * validator, so the grading a learner sees is the grading the build checks.
 *
 * The teaching problem this solves: everybody can recognise a phishing email
 * once it is labelled "phishing example". Nobody can do it in their inbox at
 * 8am. The difference is not knowledge, it is the habit of LOOKING at specific
 * parts of a message: the real sending domain, the real link target, the
 * pressure in the wording, the mismatch between who it claims to be and what
 * it is asking for.
 *
 * So the graded task is not "is this phishing, yes or no" — a coin toss gets
 * that half right. The learner has to mark WHICH parts gave it away, and is
 * marked on both misses and false alarms. Flagging the whole message as
 * suspicious is not a pass, because in real life that habit makes someone
 * ignore their own instincts within a week.
 *
 * MESSAGE SHAPE
 *   headers   [{ id, label, value, flag?, why? }]
 *   body      [{ id, text, link?, flag?, why? }]
 *   A part with `flag: true` is a genuine indicator and must carry `why`.
 *   A part without it is ordinary and must NOT be selected.
 */

/** Every inspectable part of a message, headers and body together. */
export function allParts(message) {
  return [...(message?.headers || []), ...(message?.body || [])];
}

/** The parts that are genuine indicators. */
export function indicators(message) {
  return allParts(message).filter((p) => p.flag);
}

/**
 * Mark an attempt.
 *
 * `tolerance` is the number of false alarms allowed before the attempt fails.
 * It defaults to 0 on short messages and is raised by content for messages
 * where a part is genuinely arguable.
 */
export function scoreFindings(message, picked = [], tolerance = 0) {
  const flags = indicators(message);
  const flagIds = new Set(flags.map((p) => p.id));
  const chosen = new Set(picked);

  const found = flags.filter((f) => chosen.has(f.id));
  const missed = flags.filter((f) => !chosen.has(f.id));
  const falseAlarms = allParts(message).filter(
    (p) => chosen.has(p.id) && !flagIds.has(p.id)
  );

  return {
    total: flags.length,
    found,
    missed,
    falseAlarms,
    ok: missed.length === 0 && falseAlarms.length <= tolerance,
  };
}

/**
 * Why a part is safe. Used for the feedback on a false alarm, so a learner is
 * told what made them jumpy rather than just "wrong".
 */
export function safeReason(part) {
  return (
    part?.safe ||
    "Nothing about this part is unusual on its own. Flagging it would mean flagging most legitimate mail too."
  );
}
