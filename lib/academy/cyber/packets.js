/**
 * PACKET CAPTURE ENGINE — a display filter, not a protocol stack.
 *
 * Pure. Shared by src/academy/components/PacketTrace.jsx and the validator.
 *
 * Wireshark is the tool every networking module tells learners to install and
 * almost none of them teach, because a screenshot cannot show the one skill
 * that matters: narrowing thousands of packets down to the handful that answer
 * your question. That skill is the display filter.
 *
 * So this implements a deliberately small subset of Wireshark's real filter
 * syntax — the same spelling, so what a learner types here is what they will
 * type in the real tool:
 *
 *   dns            http          tls        tcp   udp   icmp   arp
 *   ip.addr == 10.0.0.5          ip.src == …      ip.dst == …
 *   tcp.port == 443              udp.port == 53   tcp.flags.syn == 1
 *   frame.len > 500
 *   … joined with && / and, || / or
 *
 * PACKET SHAPE
 *   { no, time, src, dst, proto, sport?, dport?, length, info, flags? }
 */

const PROTOCOLS = ["dns", "http", "https", "tls", "tcp", "udp", "icmp", "arp", "dhcp"];

/** A protocol term matches the packet's own protocol, and tls/tcp nest. */
function protocolMatches(packet, term) {
  const proto = String(packet.proto || "").toLowerCase();
  if (proto === term) return true;
  // Wireshark shows the highest layer it decoded, so "tcp" must still match a
  // packet it labelled HTTP or TLS. Without this a learner filtering `tcp`
  // sees nothing and concludes the tool is broken.
  if (term === "tcp") return ["http", "https", "tls"].includes(proto);
  if (term === "udp") return ["dns", "dhcp"].includes(proto);
  if (term === "tls") return proto === "https";
  return false;
}

function fieldValue(packet, field) {
  switch (field) {
    case "ip.addr":
      return [packet.src, packet.dst];
    case "ip.src":
      return [packet.src];
    case "ip.dst":
      return [packet.dst];
    case "tcp.port":
    case "udp.port":
      return [packet.sport, packet.dport].map((p) => (p === undefined ? p : String(p)));
    case "tcp.srcport":
    case "udp.srcport":
      return [packet.sport === undefined ? undefined : String(packet.sport)];
    case "tcp.dstport":
    case "udp.dstport":
      return [packet.dport === undefined ? undefined : String(packet.dport)];
    case "frame.len":
      return [packet.length];
    case "tcp.flags.syn":
      return [String(packet.flags || "").includes("SYN") ? "1" : "0"];
    case "tcp.flags.reset":
      return [String(packet.flags || "").includes("RST") ? "1" : "0"];
    default:
      return [];
  }
}

function compare(values, op, target) {
  for (const raw of values) {
    if (raw === undefined || raw === null) continue;
    const left = String(raw);
    if (op === "==" && left === target) return true;
    if (op === "!=" && left !== target) return true;
    const a = Number(left);
    const b = Number(target);
    if (Number.isFinite(a) && Number.isFinite(b)) {
      if (op === ">" && a > b) return true;
      if (op === "<" && a < b) return true;
      if (op === ">=" && a >= b) return true;
      if (op === "<=" && a <= b) return true;
    }
  }
  return false;
}

/** One term: a bare protocol name, or `field op value`. */
function termMatches(packet, term) {
  const text = term.trim();
  if (!text) return true;

  const lower = text.toLowerCase();
  if (PROTOCOLS.includes(lower)) return protocolMatches(packet, lower === "https" ? "tls" : lower);

  const m = text.match(/^([a-z][a-z0-9_.]*)\s*(==|!=|>=|<=|>|<)\s*(.+)$/i);
  if (!m) return null; // unparseable: the caller reports it rather than lying

  const [, field, op, rawTarget] = m;
  const target = rawTarget.trim().replace(/^["']|["']$/g, "");
  return compare(fieldValue(packet, field.toLowerCase()), op, target);
}

/**
 * Apply a display filter.
 *
 * Returns the matching packets, or an error message a learner can act on. An
 * empty filter returns everything, exactly as Wireshark does.
 */
export function applyFilter(packets = [], expression = "") {
  const expr = String(expression || "").trim();
  if (!expr) return { ok: true, packets, expression: "" };

  // One level of precedence: OR of ANDs. Enough for every filter taught here,
  // and refusing anything else is better than silently mis-evaluating it.
  const orGroups = expr.split(/\s*(?:\|\||\bor\b)\s*/i);

  const matched = [];
  for (const packet of packets) {
    let hit = false;
    for (const group of orGroups) {
      const terms = group.split(/\s*(?:&&|\band\b)\s*/i);
      let all = true;
      for (const term of terms) {
        const result = termMatches(packet, term);
        if (result === null) {
          return {
            ok: false,
            packets: [],
            expression: expr,
            error: `"${term.trim()}" is not a filter this capture understands. Try a protocol name such as dns, or a field test such as tcp.port == 443.`,
          };
        }
        if (!result) {
          all = false;
          break;
        }
      }
      if (all) {
        hit = true;
        break;
      }
    }
    if (hit) matched.push(packet);
  }

  return { ok: true, packets: matched, expression: expr };
}

/**
 * Mark an attempt.
 *
 * A capture exercise asks two things at once: narrow the capture, then pick
 * the packet that answers the question. Both are graded, because a learner who
 * finds the right packet by scrolling has not learned the filter, and one who
 * writes a perfect filter but cannot read the result has not learned to read a
 * capture.
 */
export function scoreCapture(capture, expect, attempt) {
  const { filter = "", selected = null } = attempt || {};
  const run = applyFilter(capture, filter);

  if (!run.ok) return { ok: false, stage: "filter", message: run.error };

  if (expect.maxRows !== undefined && run.packets.length > expect.maxRows) {
    return {
      ok: false,
      stage: "filter",
      message: `That filter still leaves ${run.packets.length} packets. Narrow it to ${expect.maxRows} or fewer before you start reading rows.`,
    };
  }

  if (expect.mustContain) {
    const nos = new Set(run.packets.map((p) => p.no));
    const missing = expect.mustContain.filter((no) => !nos.has(no));
    if (missing.length) {
      return {
        ok: false,
        stage: "filter",
        message: `Your filter hides the packet you need. Something that should have survived it did not.`,
      };
    }
  }

  if (expect.packet !== undefined) {
    if (selected === null) {
      return { ok: false, stage: "select", message: "Now click the packet that answers the question." };
    }
    if (selected !== expect.packet) {
      return { ok: false, stage: "select", message: expect.whyWrong || "That is not the packet that answers the question. Read the Info column again." };
    }
  }

  return { ok: true, stage: "done", message: expect.success || "Correct. That is the packet, and the filter that found it." };
}
