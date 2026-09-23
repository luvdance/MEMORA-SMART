/**
 * RISK ENGINE — likelihood times impact, and the CVSS trap.
 *
 * Pure. Shared by src/academy/components/RiskGrid.jsx and the content
 * validator.
 *
 * The lesson most vulnerability courses fail to teach: a scanner's severity
 * score is not your risk. CVSS describes a vulnerability in the abstract. Risk
 * is that vulnerability on YOUR system, with your exposure and your data. A
 * 9.8 on an internal test box nobody can reach matters less than a 6.5 on the
 * payment server facing the internet, and an analyst who cannot say that out
 * loud in a meeting will spend their career patching the wrong things first.
 *
 * So the graded task hands the learner findings that each carry a CVSS score
 * AND a context, and asks them to place each one in a risk band. Placing by
 * CVSS alone fails, deliberately and by design.
 *
 * FINDING { id, title, cvss, exposure, dataAtRisk, expected, why }
 */

export const BANDS = [
  { id: "critical", label: "Critical", order: 4, sla: "Fix today" },
  { id: "high", label: "High", order: 3, sla: "Fix this week" },
  { id: "medium", label: "Medium", order: 2, sla: "Fix this quarter" },
  { id: "low", label: "Low", order: 1, sla: "Track, fix when convenient" },
];

export const LIKELIHOOD = [1, 2, 3, 4, 5];
export const IMPACT = [1, 2, 3, 4, 5];

/** The classic 5x5 matrix, resolved to a band. */
export function bandFor(likelihood, impact) {
  const product = Number(likelihood) * Number(impact);
  if (product >= 15) return "critical";
  if (product >= 9) return "high";
  if (product >= 4) return "medium";
  return "low";
}

export function bandLabel(id) {
  return BANDS.find((b) => b.id === id)?.label || id;
}

/** Sort findings the way a remediation plan is actually ordered. */
export function prioritise(findings = []) {
  const rank = (id) => BANDS.find((b) => b.id === id)?.order ?? 0;
  return [...findings].sort((a, b) => {
    const byBand = rank(b.expected) - rank(a.expected);
    if (byBand !== 0) return byBand;
    return (b.cvss || 0) - (a.cvss || 0);
  });
}

/**
 * The ordering a scanner would hand you, which is the wrong one. Kept here so
 * a lesson can show the two lists side by side instead of asserting they
 * differ.
 */
export function byScannerScore(findings = []) {
  return [...findings].sort((a, b) => (b.cvss || 0) - (a.cvss || 0));
}

/** True when sorting by raw CVSS gives a different order than real risk does. */
export function scannerDisagrees(findings = []) {
  const a = prioritise(findings).map((f) => f.id).join(",");
  const b = byScannerScore(findings).map((f) => f.id).join(",");
  return a !== b;
}

/**
 * Mark an attempt.
 *
 * Feedback names one misplaced finding and says what about its CONTEXT the
 * learner did not weigh, because "3 of 5 correct" sends someone back to guess
 * again rather than to think again.
 */
export function scoreRisk(findings = [], placements = {}) {
  const unplaced = findings.filter((f) => !placements[f.id]);
  if (unplaced.length) {
    return {
      ok: false,
      message: `${unplaced.length} finding${unplaced.length === 1 ? " has" : "s have"} no band yet. Every finding on a report gets a priority, including the ones you would rather not argue about.`,
      wrong: [],
    };
  }

  const wrong = findings.filter((f) => placements[f.id] !== f.expected);
  if (!wrong.length) {
    return {
      ok: true,
      message: "That is the order a system owner could actually work through. Notice it is not the order the scanner gave you.",
      wrong: [],
    };
  }

  const first = wrong[0];
  const placed = bandLabel(placements[first.id]);
  const should = bandLabel(first.expected);
  return {
    ok: false,
    wrong,
    message: `"${first.title}" is not ${placed}. ${first.why} That makes it ${should}.`,
  };
}
