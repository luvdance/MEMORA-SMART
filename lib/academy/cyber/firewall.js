/**
 * FIREWALL ENGINE — first match wins, default deny.
 *
 * Pure. Shared by src/academy/components/FirewallSim.jsx and the content
 * validator.
 *
 * Almost every beginner writes a correct set of firewall rules in the wrong
 * order, then cannot see why the firewall is ignoring half of them. Order is
 * the whole lesson, and it is invisible in a diagram. So here the rules are a
 * list the learner can reorder, and every sample packet reports WHICH rule
 * decided its fate. A rule shadowed by the one above it becomes visible
 * immediately, which is the thing a diagram can never show.
 *
 * RULE    { id, action: "allow" | "deny", proto: "tcp"|"udp"|"any",
 *           source: cidr|"any", dest: cidr|"any", port: number|range|"any" }
 * PACKET  { id, proto, source, dest, port, label, expect: "allow"|"deny" }
 */

/** Does an address fall inside a CIDR, a bare address, or "any"? */
export function inRange(address, range) {
  if (!range || range === "any" || range === "0.0.0.0/0") return true;
  if (!String(range).includes("/")) return address === range;

  const [base, bitsRaw] = String(range).split("/");
  const bits = Number(bitsRaw);
  if (!Number.isFinite(bits) || bits < 0 || bits > 32) return false;

  const toInt = (ip) =>
    ip.split(".").reduce((acc, octet) => (acc << 8) + (Number(octet) & 255), 0) >>> 0;

  // A /0 mask would shift by 32, which in JS shifts by 0 and would match
  // nothing at all. Special-cased rather than left as a silent wrong answer.
  const mask = bits === 0 ? 0 : (0xffffffff << (32 - bits)) >>> 0;
  return (toInt(address) & mask) === (toInt(base) & mask);
}

function portMatches(packetPort, rulePort) {
  if (rulePort === undefined || rulePort === null || rulePort === "any") return true;
  if (typeof rulePort === "string" && rulePort.includes("-")) {
    const [lo, hi] = rulePort.split("-").map(Number);
    return Number(packetPort) >= lo && Number(packetPort) <= hi;
  }
  return Number(packetPort) === Number(rulePort);
}

export function ruleMatches(rule, packet) {
  if (rule.proto && rule.proto !== "any" && rule.proto !== packet.proto) return false;
  if (!inRange(packet.source, rule.source)) return false;
  if (!inRange(packet.dest, rule.dest)) return false;
  if (!portMatches(packet.port, rule.port)) return false;
  return true;
}

/**
 * Run the traffic through the rules.
 *
 * First match wins, and anything unmatched is denied. That is how a real
 * firewall behaves and the entire reason rule order matters.
 */
export function evaluate(rules = [], traffic = []) {
  return traffic.map((packet) => {
    const index = rules.findIndex((rule) => ruleMatches(rule, packet));
    const rule = index === -1 ? null : rules[index];
    const verdict = rule ? rule.action : "deny";
    return {
      ...packet,
      verdict,
      matchedRule: rule ? rule.id : null,
      matchedIndex: index,
      byDefault: index === -1,
      correct: packet.expect ? verdict === packet.expect : true,
    };
  });
}

/** Rules no packet in this traffic sample ever reaches. */
export function shadowedRules(rules = [], traffic = []) {
  const fired = new Set(evaluate(rules, traffic).map((r) => r.matchedRule));
  return rules.filter((rule) => !fired.has(rule.id));
}

/**
 * Mark an attempt: every sample packet has to get the verdict the brief asks
 * for. The feedback names ONE failing packet, not all of them, because fixing
 * one rule usually fixes several rows and a wall of red teaches nothing.
 */
export function scoreFirewall(rules, traffic) {
  const results = evaluate(rules, traffic);
  const wrong = results.filter((r) => !r.correct);

  if (!wrong.length) return { ok: true, results, message: null, failing: 0 };

  const first = wrong[0];
  const message =
    first.expect === "allow"
      ? `${first.label} is being blocked, and the brief says it has to get through. Either no rule allows it, or a deny rule sitting above the one that would is catching it first.`
      : `${first.label} is getting through, and it must not. Something above your deny rule is allowing it, or one of your rules is broader than you meant it to be.`;

  return { ok: false, results, message, failing: wrong.length };
}
