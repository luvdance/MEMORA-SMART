/**
 * NETWORKING CALCULATIONS — the arithmetic behind every netCalc exercise.
 *
 * Pure. Used by the content check (scripts/nwCheck.mjs and validateContent)
 * to recompute every answer a lesson states, so an author's slip in a
 * broadcast address fails the build instead of marking a learner wrong.
 *
 * Each calculator takes one string argument and returns the answer as the
 * string a learner would type.
 */
import { intToIp, ipToInt, maskInt, maskToPrefix, networkInt, prefixToMask } from "./addr.js";

const split = (cidr) => {
  const [ip, p] = String(cidr).split("/");
  return [ip, Number(p)];
};
const hostsFor = (prefix) => (prefix >= 31 ? (prefix === 31 ? 2 : 1) : 2 ** (32 - prefix) - 2);

export function toBinary(n) {
  return Number(n).toString(2).padStart(8, "0");
}

export function fromBinary(bits) {
  return String(parseInt(String(bits).replace(/\s/g, ""), 2));
}

export function ipToBinary(ip) {
  return String(ip).split(".").map(toBinary).join(".");
}

export function binaryToIp(bits) {
  return String(bits).split(".").map(fromBinary).join(".");
}

export function mask(prefix) {
  return prefixToMask(Number(String(prefix).replace("/", "")));
}

export function prefix(maskText) {
  return `/${maskToPrefix(maskText)}`;
}

export function network(cidr) {
  const [ip, p] = split(cidr);
  return intToIp(networkInt(ip, p));
}

export function broadcast(cidr) {
  const [ip, p] = split(cidr);
  return intToIp((networkInt(ip, p) | (~maskInt(p) >>> 0)) >>> 0);
}

export function firstHost(cidr) {
  const [ip, p] = split(cidr);
  return intToIp(networkInt(ip, p) + 1);
}

export function lastHost(cidr) {
  return intToIp(ipToInt(broadcast(cidr)) - 1);
}

export function hosts(cidrOrPrefix) {
  const p = String(cidrOrPrefix).includes("/") ? Number(String(cidrOrPrefix).split("/")[1]) : Number(cidrOrPrefix);
  return String(hostsFor(p));
}

export function addresses(prefixText) {
  return String(2 ** (32 - Number(String(prefixText).replace("/", ""))));
}

export function blockSize(prefixText) {
  const p = Number(String(prefixText).replace("/", ""));
  return String(2 ** ((32 - p) % 8 || 8));
}

/** "192.168.1.0/24 6" → the prefix for at least 6 equal subnets. */
export function prefixForSubnets(arg) {
  const [cidr, n] = String(arg).split(" ");
  const [, p] = split(cidr);
  let b = 0;
  while (2 ** b < Number(n)) b += 1;
  return `/${p + b}`;
}

/** "50" → the smallest prefix with at least 50 usable hosts. */
export function prefixForHosts(n) {
  let h = 2;
  while (2 ** h - 2 < Number(n)) h += 1;
  return `/${32 - h}`;
}

/** "192.168.1.0/24 3" → the network address of subnet number 3 of the /26s... arg: "<cidr> <newPrefix> <index from 1>". */
export function nthSubnet(arg) {
  const [cidr, np, idx] = String(arg).split(" ");
  const newP = Number(String(np).replace("/", ""));
  const base = networkInt(...split(cidr));
  return `${intToIp(base + (Number(idx) - 1) * 2 ** (32 - newP))}/${newP}`;
}

/** "10.1.0.0/24 10.1.1.0/24 10.1.2.0/24 10.1.3.0/24" → the summary route. */
export function summary(list) {
  const nets = String(list).trim().split(/\s+/).map(split);
  const ints = nets.map(([ip, p]) => networkInt(ip, p));
  let p = Math.min(...nets.map(([, q]) => q));
  while (p > 0 && new Set(ints.map((i) => (i & maskInt(p)) >>> 0)).size > 1) p -= 1;
  return `${intToIp((ints[0] & maskInt(p)) >>> 0)}/${p}`;
}

/** RFC 5952 shortening of a full IPv6 address. */
export function ipv6Short(addr) {
  const g = String(addr).split(":").map((x) => x.replace(/^0+/, "").toLowerCase() || "0");
  let bs = -1, bl = 0;
  for (let i = 0; i < g.length; ) {
    if (g[i] !== "0") { i += 1; continue; }
    let j = i;
    while (j < g.length && g[j] === "0") j += 1;
    if (j - i > bl) { bs = i; bl = j - i; }
    i = j;
  }
  if (bl < 2) return g.join(":");
  return `${g.slice(0, bs).join(":")}::${g.slice(bs + bl).join(":")}`;
}

/** "abc" → hex digits to decimal, e.g. a hex group or a MAC byte. */
export function hexToDec(h) {
  return String(parseInt(h, 16));
}

/** "48 64" → number of /64 subnets in a /48. */
export function ipv6Subnets(arg) {
  const [site, lan] = String(arg).split(" ").map(Number);
  return String(2 ** (lan - site));
}

/** Seconds to send a file: "<megabytes> <megabits per second>". */
export function transferSeconds(arg) {
  const [mb, mbps] = String(arg).split(" ").map(Number);
  return String((mb * 8) / mbps);
}

/** Cables in a full mesh of n devices: n(n − 1) / 2. */
export function meshLinks(n) {
  return String((Number(n) * (Number(n) - 1)) / 2);
}

export const CALCULATORS = {
  meshLinks,
  toBinary, fromBinary, ipToBinary, binaryToIp, mask, prefix, network, broadcast, firstHost, lastHost,
  hosts, addresses, blockSize, prefixForSubnets, prefixForHosts, nthSubnet, summary, ipv6Short, hexToDec,
  ipv6Subnets, transferSeconds,
};

/** What a learner typed, made comparable: no spaces or commas, lowercase, no leading slash difference. */
export function normaliseAnswer(text) {
  return String(text ?? "").trim().toLowerCase().replace(/[\s,]/g, "").replace(/^\/(\d+)$/, "/$1");
}

/** Is `typed` an acceptable answer for this question? */
export function answerMatches(question, typed) {
  const t = normaliseAnswer(typed);
  if (!t) return false;
  const accepted = [question.answer, ...(question.accept || [])].map(normaliseAnswer);
  if (accepted.includes(t)) return true;
  // A prefix may be typed with or without the slash.
  if (/^\/\d+$/.test(normaliseAnswer(question.answer)) && accepted.includes(`/${t}`)) return true;
  return false;
}
