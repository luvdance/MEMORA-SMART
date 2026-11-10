/**
 * IPv4 ADDRESS ARITHMETIC — the Computer Networking course's single source of
 * truth for masks, prefixes, networks and wildcards.
 *
 * Pure. Shared by the NetLab simulator (./netsim.js), its React widget and
 * the content validator. Addresses are handled as unsigned 32-bit integers;
 * every function that takes a dotted string returns null on a malformed one
 * instead of throwing, because learner input arrives here unfiltered.
 */

/** "192.168.1.10" → 3232235786, or null. */
export function ipToInt(text) {
  const parts = String(text ?? "").trim().split(".");
  if (parts.length !== 4) return null;
  let n = 0;
  for (const part of parts) {
    if (!/^\d{1,3}$/.test(part)) return null;
    const v = Number(part);
    if (v > 255) return null;
    n = n * 256 + v;
  }
  return n >>> 0;
}

/** 3232235786 → "192.168.1.10". */
export function intToIp(n) {
  const v = n >>> 0;
  return [v >>> 24, (v >>> 16) & 255, (v >>> 8) & 255, v & 255].join(".");
}

export const isIp = (text) => ipToInt(text) !== null;

/** Prefix length → mask as an integer. /0 is special-cased: JS shifts by 32 as by 0. */
export function maskInt(prefix) {
  return prefix <= 0 ? 0 : (0xffffffff << (32 - prefix)) >>> 0;
}

/** 24 → "255.255.255.0". */
export const prefixToMask = (prefix) => intToIp(maskInt(prefix));

/** "255.255.255.0" → 24, or null when the bits are not contiguous. */
export function maskToPrefix(mask) {
  const n = ipToInt(mask);
  if (n === null) return null;
  let prefix = 0;
  let seenZero = false;
  for (let i = 31; i >= 0; i -= 1) {
    if ((n >>> i) & 1) {
      if (seenZero) return null;
      prefix += 1;
    } else seenZero = true;
  }
  return prefix;
}

/** Network address of ip/prefix, as an integer. */
export function networkInt(ip, prefix) {
  const n = typeof ip === "number" ? ip : ipToInt(ip);
  return (n & maskInt(prefix)) >>> 0;
}

export const networkOf = (ip, prefix) => intToIp(networkInt(ip, prefix));

export function broadcastOf(ip, prefix) {
  return intToIp((networkInt(ip, prefix) | (~maskInt(prefix) >>> 0)) >>> 0);
}

/** Is ip inside net/prefix? */
export function inSubnet(ip, net, prefix) {
  const a = typeof ip === "number" ? ip : ipToInt(ip);
  const b = typeof net === "number" ? net : ipToInt(net);
  if (a === null || b === null) return false;
  return networkInt(a, prefix) === networkInt(b, prefix);
}

/** "10.0.0.0/8" → { addr: "10.0.0.0", prefix: 8 }, or null. */
export function parseCidr(text) {
  const m = /^\s*(\d+\.\d+\.\d+\.\d+)\s*\/\s*(\d{1,2})\s*$/.exec(String(text ?? ""));
  if (!m || !isIp(m[1]) || Number(m[2]) > 32) return null;
  return { addr: m[1], prefix: Number(m[2]) };
}

/** Wildcard (inverse mask) match, as an ACL or an OSPF network statement does it. */
export function wildcardMatch(ip, addr, wildcard) {
  const a = ipToInt(ip);
  const b = ipToInt(addr);
  const w = ipToInt(wildcard);
  if (a === null || b === null || w === null) return false;
  const care = ~w >>> 0;
  return ((a & care) >>> 0) === ((b & care) >>> 0);
}

/** The historical class of an address, used by RIP's classful network command. */
export function classfulPrefix(ip) {
  const first = (ipToInt(ip) ?? 0) >>> 24;
  if (first < 128) return 8;
  if (first < 192) return 16;
  return 24;
}

export function isPrivate(ip) {
  return inSubnet(ip, "10.0.0.0", 8) || inSubnet(ip, "172.16.0.0", 12) || inSubnet(ip, "192.168.0.0", 16);
}
