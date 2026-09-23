/**
 * UNIX PERMISSIONS ENGINE
 *
 * Pure. Shared by src/academy/components/PermissionsSim.jsx and the content
 * validator, so the grading a learner sees is the grading the build checks.
 *
 * Least privilege is the most repeated sentence in security teaching and the
 * least practised, because "give only the access that is needed" is advice,
 * not a skill. The skill is being able to look at -rw-rw-rw- on a payroll file
 * and know, without looking anything up, exactly who can now read salaries.
 *
 * So the practice here is the real artifact: the nine permission bits, toggled
 * one at a time, with the octal and the ls -l string recomputed live, and a
 * plain sentence underneath saying who that lets in. The learner is graded on
 * meeting a stated access requirement, not on memorising that 640 is rw-r-----.
 */

export const WHO = ["owner", "group", "other"];
export const BITS = ["r", "w", "x"];
const VALUE = { r: 4, w: 2, x: 1 };

/** An empty permission set: nobody can do anything. */
export function emptyMode() {
  return {
    owner: { r: false, w: false, x: false },
    group: { r: false, w: false, x: false },
    other: { r: false, w: false, x: false },
  };
}

/** "640" or 640 becomes a toggle map. */
export function fromOctal(octal) {
  const digits = String(octal).padStart(3, "0").slice(-3).split("").map(Number);
  const mode = emptyMode();
  WHO.forEach((who, i) => {
    const d = digits[i] || 0;
    mode[who].r = Boolean(d & 4);
    mode[who].w = Boolean(d & 2);
    mode[who].x = Boolean(d & 1);
  });
  return mode;
}

/** A toggle map becomes "640". */
export function toOctal(mode) {
  return WHO.map((who) =>
    BITS.reduce((sum, bit) => sum + (mode[who]?.[bit] ? VALUE[bit] : 0), 0)
  ).join("");
}

/** A toggle map becomes "rw-r-----", the string ls -l prints. */
export function toSymbolic(mode, options = {}) {
  const body = WHO.map((who) =>
    BITS.map((bit) => (mode[who]?.[bit] ? bit : "-")).join("")
  ).join("");
  return (options.directory ? "d" : "-") + body;
}

/**
 * Who this actually lets in, in a sentence.
 *
 * Deliberately blunt about "other", because that is the bit that leaks. On a
 * shared server "other" means every account on the machine, including the one
 * an attacker lands in first.
 */
export function describe(mode, names = {}) {
  const owner = names.owner || "the owner";
  const group = names.group || "the group";
  const parts = [];

  const verbs = (who) => {
    const can = [];
    if (mode[who]?.r) can.push("read");
    if (mode[who]?.w) can.push("change");
    if (mode[who]?.x) can.push("run");
    return can;
  };

  const ownerCan = verbs("owner");
  parts.push(
    ownerCan.length
      ? `${owner} can ${ownerCan.join(", ")} it.`
      : `${owner} cannot even read it.`
  );

  const groupCan = verbs("group");
  parts.push(
    groupCan.length
      ? `Anyone in ${group} can ${groupCan.join(", ")} it.`
      : `${group} has no access at all.`
  );

  const otherCan = verbs("other");
  parts.push(
    otherCan.length
      ? `Every other account on the machine can ${otherCan.join(", ")} it.`
      : `No other account on the machine can touch it.`
  );

  return parts.join(" ");
}

/**
 * Mark an attempt against a target mode.
 *
 * The feedback names one specific bit that is wrong. "Incorrect" on a nine-bit
 * puzzle leaves a learner nine guesses away from anything useful.
 */
export function scorePermissions(mode, expectedOctal) {
  const want = fromOctal(expectedOctal);
  const got = toOctal(mode);
  const target = String(expectedOctal).padStart(3, "0").slice(-3);

  if (got === target) return { ok: true, octal: got, message: null, problems: [] };

  const problems = [];
  for (const who of WHO) {
    for (const bit of BITS) {
      const has = Boolean(mode[who]?.[bit]);
      const should = Boolean(want[who][bit]);
      if (has && !should) problems.push({ who, bit, kind: "extra" });
      if (!has && should) problems.push({ who, bit, kind: "missing" });
    }
  }

  // Report an over-permission before a missing one. Extra access is the
  // security failure; missing access is only an inconvenience.
  problems.sort((a, b) => (a.kind === b.kind ? 0 : a.kind === "extra" ? -1 : 1));

  const first = problems[0];
  const verb = { r: "read", w: "write to", x: "run" }[first.bit];
  const label = { owner: "the owner", group: "the group", other: "everyone else on the machine" }[first.who];
  const message =
    first.kind === "extra"
      ? `You are still letting ${label} ${verb} this file. Ask whether that access is genuinely needed, then take away what is not.`
      : `${label} still cannot ${verb} this file, and the requirement says that has to work.`;

  return { ok: false, octal: got, message, problems };
}
