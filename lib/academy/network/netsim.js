/**
 * NETLAB — the Computer Networking course's network simulator.
 *
 * Pure. Shared by src/academy/components/NetLab.jsx and the content validator
 * (lib/academy/network/validate.mjs).
 *
 * ── WHAT THIS IS, AND WHAT IT IS NOT ─────────────────────────────────────
 * A simulator in the same sense Cisco Packet Tracer is one: devices are
 * configured with a subset of Cisco IOS commands, typed exactly as on real
 * equipment, and every outcome (a ping that succeeds, a DHCP lease, a trunk
 * that carries VLAN 20, an OSPF route) is COMPUTED from that configuration
 * by the same rules the real protocols follow. Nothing is scripted: a lab
 * passes because the learner's configuration really forwards the packets.
 *
 * It is not IOS. It implements the commands a CCNA-level course uses and
 * answers anything else with IOS's own "% Invalid input" message, so a
 * learner is never shown an invented behaviour. The widget says so.
 *
 * ── THE MODEL ────────────────────────────────────────────────────────────
 *   Layer 1  links between ports; an interface is up/up when neither end is
 *            shut down; a duplex mismatch loses frames.
 *   Layer 2  switches flood per VLAN: access ports carry one VLAN untagged,
 *            802.1Q trunks carry the allowed VLANs tagged and the native VLAN
 *            untagged, dynamic-auto ports become trunks only opposite an
 *            explicit trunk, a VLAN missing from a switch's database is not
 *            forwarded, and spanning tree blocks redundant links. MAC tables
 *            and ARP caches are learned from the traffic that really flows.
 *   Layer 3  hosts send to the destination or their gateway; routers (and
 *            switches with `ip routing`) pick the longest prefix among
 *            connected, static, OSPF and RIP routes by administrative
 *            distance, decrement TTL, apply ACLs in and out, and translate
 *            addresses with NAT/PAT. Replies travel back by the same rules,
 *            so an asymmetric mistake fails exactly as it would for real.
 *   Services DHCP (local pools and ip helper-address relay, APIPA when no
 *            server answers), DNS, HTTP and SSH/Telnet to devices whose vty
 *            lines allow it, and Wi-Fi association against an AP's SSID,
 *            security mode and passphrase.
 *
 * SPEC  { devices: [{ id, kind, x, y, label?, ports?, ip?, gateway?, dns?,
 *                     dhcp?, services?, records?, web?, dhcpPools?, wifi? }],
 *         links: [["PC1:fa0", "SW1:fa0/1", { duplex? }]],
 *         config: { R1: "hostname R1\ninterface g0/0\n ip address …" } }
 */

import {
  ipToInt, intToIp, isIp, maskInt, prefixToMask, maskToPrefix, networkInt,
  inSubnet, wildcardMatch, classfulPrefix,
} from "./addr.js";
import { type7, md5crypt, saltFor } from "./hash.js";

/* ════════════════════════════════════════════════════════════════════════
   INTERFACE NAMES
   ════════════════════════════════════════════════════════════════════════ */

const LONG = { g: "GigabitEthernet", fa: "FastEthernet", lo: "Loopback", vlan: "Vlan", port: "Port", wlan: "Wireless", s: "Serial" };
const SHORT = { g: "Gi", fa: "Fa", lo: "Lo", vlan: "Vlan", port: "Port", wlan: "Wlan", s: "Se" };

/**
 * Accept every spelling IOS accepts for the interfaces we model:
 * g0/0, gi0/0, gig 0/0, GigabitEthernet0/0, fa0/1, f0/1, lo0, vlan 10, g0/0.10.
 */
export function canonIf(raw) {
  const s = String(raw ?? "").trim().toLowerCase().replace(/\s+/g, "");
  let m = /^(g|gi|gig|giga|gigabit|gigabitethernet)(\d+\/\d+)(\.\d+)?$/.exec(s);
  if (m) return `g${m[2]}${m[3] || ""}`;
  m = /^(f|fa|fast|fastethernet)(\d+\/\d+)(\.\d+)?$/.exec(s);
  if (m) return `fa${m[2]}${m[3] || ""}`;
  m = /^(f|fa|fast|fastethernet)(\d+)$/.exec(s);
  if (m) return `fa${m[2]}`;
  m = /^(s|se|serial)(\d+\/\d+\/\d+|\d+\/\d+)$/.exec(s);
  if (m) return `s${m[2]}`;
  m = /^(lo|loop|loopback)(\d+)$/.exec(s);
  if (m) return `lo${m[2]}`;
  m = /^(vl|vla|vlan)(\d+)$/.exec(s);
  if (m) return `vlan${m[2]}`;
  m = /^(port|p)(\d+)$/.exec(s);
  if (m) return `port${m[2]}`;
  m = /^(wlan|wireless)(\d+)$/.exec(s);
  if (m) return `wlan${m[2]}`;
  return null;
}

function splitIf(name) {
  const m = /^([a-z]+)(.*)$/.exec(name);
  return m ? [m[1], m[2]] : [name, ""];
}
export const longIf = (name) => { const [t, r] = splitIf(name); return (LONG[t] || t) + r; };
export const shortIf = (name) => { const [t, r] = splitIf(name); return (SHORT[t] || t) + r; };

function defaultPorts(kind) {
  if (kind === "router") return ["g0/0", "g0/1", "g0/2"];
  if (kind === "switch") return [...Array.from({ length: 24 }, (_, i) => `fa0/${i + 1}`), "g0/1", "g0/2"];
  if (kind === "laptop") return ["wlan0"];
  if (kind === "ap") return ["port0"];
  return ["fa0"];
}

/** A stable, Cisco-looking MAC per device port, so tables read the same on every run. */
function macFor(devId, port) {
  let h = 2166136261;
  for (const ch of `${devId}:${port}`) h = Math.imul(h ^ ch.charCodeAt(0), 16777619) >>> 0;
  let h2 = 5381;
  for (const ch of `${port}/${devId}`) h2 = (Math.imul(h2, 33) ^ ch.charCodeAt(0)) >>> 0;
  const hex = ("00" + ((h >>> 8) & 0xffff).toString(16).padStart(4, "0") + (h2 & 0xffffff).toString(16).padStart(6, "0")).slice(-12);
  const bytes = "00" + hex.slice(2);
  return `${bytes.slice(0, 4)}.${bytes.slice(4, 8)}.${bytes.slice(8, 12)}`;
}
const winMac = (mac) => mac.replace(/\./g, "").match(/../g).join("-").toUpperCase();

/* ════════════════════════════════════════════════════════════════════════
   WORLD CONSTRUCTION
   ════════════════════════════════════════════════════════════════════════ */

const isHostKind = (k) => k === "pc" || k === "server" || k === "laptop";
const isCisco = (d) => d.kind === "router" || d.kind === "switch";

function newIface(dev, name) {
  const physical = !name.includes(".") && !name.startsWith("lo") && !name.startsWith("vlan");
  return {
    name,
    // Router ports ship administratively down; switch and host ports are up.
    shutdown: dev.kind === "router" ? physical : name === "vlan1",
    ip: null,
    desc: "",
    mode: "dynamic",
    accessVlan: 1,
    allowed: null,
    native: 1,
    encap: null,
    aclIn: null,
    aclOut: null,
    nat: null,
    helpers: [],
    ospfCost: null,
    hello: 10,
    duplex: "auto",
    portfast: false,
    parent: name.includes(".") ? name.split(".")[0] : null,
    mac: macFor(dev.id, name.split(".")[0]),
  };
}

function newDevice(d) {
  const kind = d.kind;
  const dev = {
    id: d.id,
    kind,
    label: d.label || d.id,
    x: d.x ?? 0,
    y: d.y ?? 0,
    hostname: isCisco(d) ? (kind === "router" ? "Router" : "Switch") : d.id,
    mode: isCisco(d) ? "user" : "host",
    ctx: {},
    ports: d.ports || defaultPorts(kind),
    ifaces: {},
    vlans: new Map([[1, "default"]]),
    ipRouting: kind === "router",
    defaultGateway: null,
    routes: [],
    ospf: null,
    rip: null,
    dhcpExcluded: [],
    pools: {},
    bindings: [],
    acls: {},
    aclHits: {},
    natRules: [],
    natStatic: [],
    translations: [],
    lines: {
      vty: { login: null, password: null, transport: "all", accessClass: null },
      con: { login: null, password: null },
    },
    users: {},
    enableSecret: null,
    enablePassword: null,
    passwordEncryption: false,
    domainName: null,
    rsaBits: 0,
    sshVersion: null,
    banner: null,
    stpPriority: {},
    arp: new Map(),
    macTable: new Map(),
    // Hosts.
    host: { ip: null, prefix: null, gateway: null, dns: null, dhcp: false, apipa: false, dhcpServer: null },
    services: new Set(d.services || []),
    records: d.records || {},
    web: d.web || null,
    dhcpSpec: d.dhcpPools || [],
    // Wireless.
    wifi: kind === "ap" ? { ssid: null, security: "open", passphrase: null, band: "2.4", channel: 1, ...(d.wifi || {}) } : null,
    wifiSpec: kind === "laptop" ? { supports: ["wpa2", "wpa3"], bands: ["2.4", "5", "6"], inRange: null, ...(d.wifi || {}) } : null,
    wifiCreds: null,
    platform: d.platform || (kind === "router" ? "ISR4331" : kind === "switch" ? "2960" : ""),
    signal: d.signal || {},
  };
  for (const p of dev.ports) dev.ifaces[p] = newIface(dev, p);
  if (kind === "switch") dev.ifaces.vlan1 = newIface(dev, "vlan1");
  if (isHostKind(kind)) {
    if (d.ip) {
      const [addr, pre] = String(d.ip).split("/");
      dev.host.ip = addr;
      dev.host.prefix = Number(pre ?? 24);
    }
    dev.host.gateway = d.gateway || null;
    dev.host.dns = d.dns || null;
    dev.host.dhcp = Boolean(d.dhcp);
  }
  return dev;
}

export function createWorld(spec = {}) {
  const world = { devices: {}, order: [], links: {}, linkList: [], version: 0, cache: {} };
  for (const d of spec.devices || []) {
    world.devices[d.id] = newDevice(d);
    world.order.push(d.id);
  }
  for (const link of spec.links || []) {
    const [a, b, opts = {}] = link;
    const [ad, ap] = a.split(":");
    const [bd, bp] = b.split(":");
    world.links[`${ad}:${ap}`] = { dev: bd, port: bp };
    world.links[`${bd}:${bp}`] = { dev: ad, port: ap };
    world.linkList.push({ a: { dev: ad, port: ap }, b: { dev: bd, port: bp }, ...opts });
  }
  for (const [id, text] of Object.entries(spec.config || {})) {
    if (world.devices[id]) applyConfig(world, id, text);
  }
  for (const id of world.order) {
    const d = world.devices[id];
    if (d.kind === "laptop" && d.wifiSpec?.join) {
      d.wifiCreds = { ssid: d.wifiSpec.join.ssid, passphrase: d.wifiSpec.join.passphrase || null };
    }
  }
  for (const id of world.order) {
    const d = world.devices[id];
    if (isHostKind(d.kind) && d.host.dhcp) dhcpRenew(world, d);
  }
  world.version += 1;
  return world;
}

/**
 * Paste a configuration, as a technician pastes one into a console: lines are
 * run in global configuration mode, an indented line belongs to the section
 * above it, and an unindented line closes that section.
 */
export function applyConfig(world, devId, text) {
  const dev = world.devices[devId];
  const lines = Array.isArray(text) ? text : String(text).split("\n");
  if (isCisco(dev)) {
    dev.mode = "config";
    dev.ctx = {};
  }
  const errors = [];
  for (const raw of lines) {
    if (!raw.trim() || raw.trim() === "!") continue;
    if (isCisco(dev) && !/^\s/.test(raw) && dev.mode !== "config") {
      dev.mode = "config";
      dev.ctx = {};
    }
    const out = exec(world, devId, raw.trim()).output;
    if (/^%|\n%/.test(out) && !/Creating vlan|LINK-|SYS-|% Generating/.test(out)) errors.push(`${raw.trim()} → ${out}`);
  }
  if (isCisco(dev)) {
    dev.mode = "user";
    dev.ctx = {};
  }
  return errors;
}

/* ════════════════════════════════════════════════════════════════════════
   LAYER 1 AND 2
   ════════════════════════════════════════════════════════════════════════ */

function linkPeer(world, devId, port) {
  const d = world.devices[devId];
  if (d.kind === "laptop" && port.startsWith("wlan")) {
    const ap = associatedAp(world, d);
    return ap ? { dev: ap.id, port: "wifi" } : null;
  }
  return world.links[`${devId}:${port}`] || null;
}

/** Is a physical port's line protocol up: both ends present and neither shut down? */
function portUp(world, devId, port) {
  const d = world.devices[devId];
  const ifc = d.ifaces[port];
  if (!ifc || ifc.shutdown) return false;
  if (d.kind === "ap" && port === "wifi") return Boolean(d.wifi?.ssid);
  if (d.kind === "laptop" && port.startsWith("wlan")) return Boolean(associatedAp(world, d));
  const peer = linkPeer(world, devId, port);
  if (!peer) return false;
  const pd = world.devices[peer.dev];
  const pif = pd.ifaces[peer.port];
  if (pd.kind === "ap" && peer.port === "wifi") return true;
  return Boolean(pif && !pif.shutdown);
}

/**
 * The duplex a port actually runs at. Two auto ports negotiate full duplex.
 * A hard-set port stops negotiating, so the auto port facing it can only
 * detect the speed and falls back to HALF duplex: hard-set full against
 * auto is the classic mismatch.
 */
function effDuplex(world, devId, port) {
  const peer = linkPeer(world, devId, port);
  const a = world.devices[devId].ifaces[port]?.duplex || "auto";
  if (a !== "auto") return a;
  if (!peer) return "full";
  const b = world.devices[peer.dev].ifaces[peer.port]?.duplex || "auto";
  return b === "auto" ? "full" : "half";
}

function duplexMismatch(world, devId, port) {
  const peer = linkPeer(world, devId, port);
  if (!peer || world.devices[peer.dev].kind === "ap" || world.devices[devId].kind === "laptop") return false;
  return effDuplex(world, devId, port) !== effDuplex(world, peer.dev, peer.port);
}

export function ifaceUp(world, d, name) {
  const ifc = d.ifaces[name];
  if (!ifc || ifc.shutdown) return false;
  if (ifc.parent) return ifaceUp(world, d, ifc.parent);
  if (name.startsWith("lo")) return true;
  if (name.startsWith("vlan")) return sviUp(world, d, Number(name.slice(4)));
  return portUp(world, d.id, name);
}

function sviUp(world, d, vlan) {
  if (!d.vlans.has(vlan)) return false;
  return d.ports.some((p) => portUp(world, d.id, p) && carries(world, d, p, vlan) && !stpBlocked(world, d, p, vlan));
}

function effMode(world, d, port) {
  const ifc = d.ifaces[port];
  if (ifc.mode !== "dynamic") return ifc.mode;
  const peer = linkPeer(world, d.id, port);
  if (peer) {
    const pd = world.devices[peer.dev];
    if (pd.kind === "switch" && pd.ifaces[peer.port]?.mode === "trunk") return "trunk";
  }
  return "access";
}

const allows = (ifc, vlan) => (ifc.allowed === null ? vlan >= 1 && vlan <= 4094 : ifc.allowed.has(vlan));

function carries(world, d, port, vlan) {
  const ifc = d.ifaces[port];
  return effMode(world, d, port) === "access" ? ifc.accessVlan === vlan : allows(ifc, vlan);
}

const PORT_COST = (port) => (port.startsWith("g") ? 4 : 19);

function bridgeId(d, vlan) {
  const pr = d.stpPriority[vlan] ?? 32768;
  return { pr: pr + vlan, mac: d.ifaces[d.ports[0]].mac, d };
}
const cmpBid = (a, b) => (a.pr !== b.pr ? a.pr - b.pr : a.mac < b.mac ? -1 : a.mac > b.mac ? 1 : 0);

/**
 * Spanning tree for one VLAN, in the 802.1D style a 2960 runs per VLAN:
 * lowest bridge ID is root; every other switch keeps its cheapest port to
 * the root; on each switch-to-switch link the end closer to the root is
 * designated; anything else blocks.
 */
export function spanningTree(world, vlan) {
  const key = `stp:${vlan}:${world.version}`;
  if (world.cache[key]) return world.cache[key];
  const switches = world.order.map((id) => world.devices[id]).filter((d) => d.kind === "switch" && d.vlans.has(vlan));
  const edges = [];
  for (const s of switches) {
    for (const p of s.ports) {
      if (!portUp(world, s.id, p) || !carries(world, s, p, vlan)) continue;
      const peer = linkPeer(world, s.id, p);
      const pd = peer && world.devices[peer.dev];
      if (!pd || pd.kind !== "switch" || !pd.vlans.has(vlan) || !carries(world, pd, peer.port, vlan)) continue;
      edges.push({ from: s, port: p, to: pd, toPort: peer.port });
    }
  }
  const result = { root: null, cost: new Map(), rootPort: new Map(), blocked: new Set(), designated: new Set() };
  if (!switches.length) return (world.cache[key] = result);
  const bids = new Map(switches.map((s) => [s.id, bridgeId(s, vlan)]));
  // Root election happens within each connected island of switches.
  const islands = [];
  const seen = new Set();
  for (const s of switches) {
    if (seen.has(s.id)) continue;
    const island = [];
    const stack = [s];
    seen.add(s.id);
    while (stack.length) {
      const cur = stack.pop();
      island.push(cur);
      for (const e of edges.filter((x) => x.from === cur)) {
        if (!seen.has(e.to.id)) { seen.add(e.to.id); stack.push(e.to); }
      }
    }
    islands.push(island);
  }
  for (const island of islands) {
    const root = island.slice().sort((a, b) => cmpBid(bids.get(a.id), bids.get(b.id)))[0];
    if (island.includes(switches.find((x) => x === root)) && (!result.root || island.length > 1)) result.root = result.root || root;
    const dist = new Map([[root.id, 0]]);
    const done = new Set();
    while (done.size < island.length) {
      let best = null;
      for (const s of island) if (!done.has(s.id) && dist.has(s.id) && (best === null || dist.get(s.id) < dist.get(best.id))) best = s;
      if (!best) break;
      done.add(best.id);
      for (const e of edges.filter((x) => x.from === best)) {
        const c = dist.get(best.id) + PORT_COST(e.toPort);
        if (!dist.has(e.to.id) || c < dist.get(e.to.id)) dist.set(e.to.id, c);
      }
    }
    for (const s of island) {
      result.cost.set(s.id, dist.get(s.id) ?? Infinity);
      if (s === root) continue;
      const cands = edges.filter((e) => e.from === s).map((e) => ({
        e,
        c: (dist.get(e.to.id) ?? Infinity) + PORT_COST(e.port),
        nb: bids.get(e.to.id),
      }));
      cands.sort((a, b) => a.c - b.c || cmpBid(a.nb, b.nb) || (a.e.toPort < b.e.toPort ? -1 : 1));
      if (cands[0]) result.rootPort.set(s.id, cands[0].e.port);
    }
    if (island.length > 1 || island[0] === root) result.rootBy = result.rootBy || new Map();
    for (const s of island) (result.rootBy || (result.rootBy = new Map())).set(s.id, root.id);
  }
  for (const e of edges) {
    const a = `${e.from.id}:${e.port}`;
    if (result.rootPort.get(e.from.id) === e.port) continue;
    if (result.rootPort.get(e.to.id) === e.toPort) { result.designated.add(a); continue; }
    const ca = result.cost.get(e.from.id);
    const cb = result.cost.get(e.to.id);
    const better = ca < cb || (ca === cb && cmpBid(bids.get(e.from.id), bids.get(e.to.id)) < 0);
    if (better) result.designated.add(a);
    else result.blocked.add(a);
  }
  world.cache[key] = result;
  return result;
}

function stpBlocked(world, d, port, vlan) {
  if (d.kind !== "switch") return false;
  return spanningTree(world, vlan).blocked.has(`${d.id}:${port}`);
}

/**
 * Flood one frame from (devId, port) carrying `tag` (null = untagged) and
 * return every Layer-3 endpoint it reaches, with the switch hops on the way.
 * This is the broadcast domain, computed rather than declared.
 */
function flood(world, devId, port, tag, internal = null) {
  const endpoints = [];
  const nodes = []; // { dev, vlan, port, parent }
  const seen = new Set();
  let lossy = false;

  const emit = (fromDev, fromPort, t, parent) => {
    if (!portUp(world, fromDev, fromPort)) return;
    const peer = linkPeer(world, fromDev, fromPort);
    if (!peer) return;
    if (duplexMismatch(world, fromDev, fromPort)) lossy = true;
    arrive(peer.dev, peer.port, t, parent, fromPort);
  };

  const switchForward = (d, vlan, inPort, parent, via) => {
    const key = `${d.id}|${vlan}`;
    nodes.push({ dev: d.id, vlan, port: inPort, parent, via });
    const me = nodes.length - 1;
    if (seen.has(key)) return;
    seen.add(key);
    const svi = d.ifaces[`vlan${vlan}`];
    if (svi && svi.ip && !svi.shutdown) endpoints.push({ dev: d.id, ifName: `vlan${vlan}`, ip: svi.ip.addr, prefix: svi.ip.prefix, node: me, via: null });
    for (const q of d.ports) {
      if (q === inPort || !d.ifaces[q] || d.ifaces[q].shutdown) continue;
      if (stpBlocked(world, d, q, vlan) || !carries(world, d, q, vlan)) continue;
      const mode = effMode(world, d, q);
      const out = mode === "access" ? null : vlan === d.ifaces[q].native ? null : vlan;
      emit(d.id, q, out, me);
    }
  };

  const arrive = (dId, p, t, parent, via) => {
    const d = world.devices[dId];
    if (d.kind === "switch") {
      const ifc = d.ifaces[p];
      if (!ifc || ifc.shutdown) return;
      let vlan;
      if (effMode(world, d, p) === "access") {
        if (t !== null) return;
        vlan = ifc.accessVlan;
      } else if (t === null) vlan = ifc.native;
      else {
        if (!allows(ifc, t)) return;
        vlan = t;
      }
      if (!d.vlans.has(vlan) || stpBlocked(world, d, p, vlan)) return;
      switchForward(d, vlan, p, parent, via);
      return;
    }
    if (d.kind === "ap") {
      if (t !== null) return;
      const key = `${d.id}|ap`;
      nodes.push({ dev: d.id, vlan: 1, port: p, parent, via });
      const me = nodes.length - 1;
      if (seen.has(key)) return;
      seen.add(key);
      if (!d.wifi?.ssid && p !== "port0") return;
      if (p !== "port0") emit(d.id, "port0", null, me);
      for (const id of world.order) {
        const l = world.devices[id];
        if (l.kind === "laptop" && associatedAp(world, l) === d && !(p === "wifi" && id === devId)) {
          endpoints.push({ dev: id, ifName: "wlan0", ip: l.host.ip, prefix: l.host.prefix, node: me, via: "wifi" });
        }
      }
      return;
    }
    if (isL3(d)) {
      for (const [name, ifc] of Object.entries(d.ifaces)) {
        if (!ifc.ip || ifc.shutdown) continue;
        const physical = ifc.parent || name;
        if (physical !== p) continue;
        const matches = ifc.parent
          ? ifc.encap && (t === null ? ifc.encap.native : ifc.encap.vlan === t)
          : t === null && !ifc.encap;
        if (matches) endpoints.push({ dev: dId, ifName: name, ip: ifc.ip.addr, prefix: ifc.ip.prefix, node: parent, via });
      }
      return;
    }
    if (isHostKind(d.kind) && t === null && d.ifaces[p]) {
      endpoints.push({ dev: dId, ifName: p, ip: d.host.ip, prefix: d.host.prefix, node: parent, via });
    }
  };

  if (internal) switchForward(world.devices[internal.dev], internal.vlan, null, -1, null);
  else emit(devId, port, tag, -1);
  return { endpoints, nodes, lossy };
}

/** Where a device's interface puts its frames on the wire. */
function egress(d, ifName) {
  const ifc = d.ifaces[ifName];
  if (ifName.startsWith("vlan")) return { internal: { dev: d.id, vlan: Number(ifName.slice(4)) } };
  if (ifc?.parent) return { port: ifc.parent, tag: ifc.encap ? (ifc.encap.native ? null : ifc.encap.vlan) : null };
  return { port: ifName, tag: null };
}

/**
 * Switches learn a source MAC on the port the frame ARRIVED on. The sender's
 * broadcast reaches every switch in the VLAN; the target's unicast reply
 * travels back only along the path, entering each switch on the port that
 * faces the target (the port the flood LEFT by on its way out).
 */
function learnMacs(world, nodes, mac, endpoint = null) {
  const mark = (n, port) => {
    const sw = world.devices[n.dev];
    if (sw.kind !== "switch" || !port) return;
    sw.macTable.set(`${n.vlan}|${mac}`, { vlan: n.vlan, mac, port });
  };
  if (!endpoint) {
    for (const n of nodes) mark(n, n.port);
    return;
  }
  let port = endpoint.via;
  for (let i = endpoint.node; i >= 0; i = nodes[i].parent) {
    mark(nodes[i], port);
    port = nodes[i].via;
  }
}

/** ARP for `targetIp` out of an interface. Returns the endpoint that answered, or null. */
function resolve(world, d, ifName, targetIp, trace) {
  const eg = egress(d, ifName);
  const fl = flood(world, d.id, eg.port, eg.tag, eg.internal);
  const myMac = d.ifaces[eg.port || ifName]?.mac || d.ifaces[ifName]?.mac;
  learnMacs(world, fl.nodes, myMac);
  const hit = fl.endpoints.find((e) => e.ip === targetIp && endpointUp(world, e));
  if (!hit) return null;
  const td = world.devices[hit.dev];
  const tEg = egress(td, hit.ifName);
  learnMacs(world, fl.nodes, td.ifaces[tEg.port || hit.ifName]?.mac || td.ifaces[hit.ifName]?.mac, hit);
  const fresh = !d.arp.has(targetIp);
  d.arp.set(targetIp, { mac: td.ifaces[tEg.port || hit.ifName]?.mac || td.ifaces[hit.ifName]?.mac, ifName });
  const back = td.ifaces[eg.port || ifName];
  td.arp.set(ipOf(d, ifName), { mac: back?.mac || myMac, ifName: hit.ifName });
  if (fl.lossy) trace.lossy = true;
  if (fresh && isL3(d) && d.kind === "router") trace.arpMiss = true;
  return hit;
}

function endpointUp(world, e) {
  const d = world.devices[e.dev];
  if (isHostKind(d.kind)) return Boolean(d.host.ip);
  return ifaceUp(world, d, e.ifName);
}

/* ════════════════════════════════════════════════════════════════════════
   WIRELESS
   ════════════════════════════════════════════════════════════════════════ */

export const CHANNELS = {
  "2.4": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
  "5": [36, 40, 44, 48, 52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128, 132, 136, 140, 144, 149, 153, 157, 161, 165],
  "6": Array.from({ length: 59 }, (_, i) => 1 + i * 4),
};

function wifiAccepts(ap, laptop, creds) {
  const w = ap.wifi;
  if (!w?.ssid || !creds || w.ssid !== creds.ssid) return { ok: false, why: "ssid" };
  const spec = laptop.wifiSpec;
  if (!spec.bands.includes(w.band)) return { ok: false, why: "band" };
  if (spec.inRange && !spec.inRange.includes(ap.id)) return { ok: false, why: "range" };
  if (w.security === "open") return { ok: true };
  const modes = w.security === "wpa2/wpa3" ? ["wpa2", "wpa3"] : [w.security];
  if (!modes.some((m) => spec.supports.includes(m))) return { ok: false, why: "security" };
  if (creds.passphrase !== w.passphrase) return { ok: false, why: "passphrase" };
  return { ok: true };
}

function associatedAp(world, laptop) {
  if (!laptop.wifiCreds) return null;
  for (const id of world.order) {
    const ap = world.devices[id];
    if (ap.kind === "ap" && !ap.ifaces.port0?.shutdown && wifiAccepts(ap, laptop, laptop.wifiCreds).ok) return ap;
  }
  return null;
}

/* ════════════════════════════════════════════════════════════════════════
   LAYER 3
   ════════════════════════════════════════════════════════════════════════ */

const isL3 = (d) => d.kind === "router" || (d.kind === "switch" && d.ipRouting);

function ipOf(d, ifName) {
  if (isHostKind(d.kind)) return d.host.ip;
  return d.ifaces[ifName]?.ip?.addr || null;
}

function ownIps(world, d) {
  return Object.entries(d.ifaces).filter(([n, i]) => i.ip && ifaceUp(world, d, n)).map(([n, i]) => ({ ifName: n, ...i.ip }));
}

const AD = { C: 0, L: 0, S: 1, O: 110, R: 120 };

/** Every route a router would install, best per prefix, longest first. */
export function routingTable(world, d) {
  const key = `rt:${d.id}:${world.version}`;
  if (world.cache[key]) return world.cache[key];
  const cands = [];
  const connected = [];
  for (const [name, ifc] of Object.entries(d.ifaces)) {
    if (!ifc.ip || !ifaceUp(world, d, name)) continue;
    const net = networkInt(ifc.ip.addr, ifc.ip.prefix);
    connected.push({ net, prefix: ifc.ip.prefix, ifName: name });
    cands.push({ code: "C", net, prefix: ifc.ip.prefix, ad: 0, metric: 0, exitIf: name, nextHop: null });
    if (ifc.ip.prefix < 32) cands.push({ code: "L", net: ipToInt(ifc.ip.addr), prefix: 32, ad: 0, metric: 0, exitIf: name, nextHop: null, local: true });
  }
  if (isL3(d)) {
    for (const r of d.routes) {
      if (r.exitIf) {
        if (ifaceUp(world, d, r.exitIf)) cands.push({ code: "S", net: r.net, prefix: r.prefix, ad: r.ad ?? 1, metric: 0, exitIf: r.exitIf, nextHop: r.nextHop || null });
        continue;
      }
      const via = connected.filter((c) => inSubnet(ipToInt(r.nextHop), c.net, c.prefix)).sort((a, b) => b.prefix - a.prefix)[0];
      if (via) cands.push({ code: "S", net: r.net, prefix: r.prefix, ad: r.ad ?? 1, metric: 0, exitIf: via.ifName, nextHop: r.nextHop });
    }
    for (const r of dynamicRoutes(world)[d.id] || []) cands.push(r);
  }
  const best = new Map();
  for (const c of cands) {
    const k = `${c.net}/${c.prefix}`;
    const cur = best.get(k);
    if (!cur || c.ad < cur.ad || (c.ad === cur.ad && c.metric < cur.metric)) best.set(k, c);
  }
  // C and L for the same interface are both kept: they are different prefixes.
  const table = [...best.values()].sort((a, b) => b.prefix - a.prefix || a.net - b.net);
  world.cache[key] = table;
  return table;
}

function lookup(world, d, dst) {
  const n = ipToInt(dst);
  return routingTable(world, d).find((r) => !r.local && networkInt(n, r.prefix) === r.net) || null;
}

/* ── Dynamic routing ────────────────────────────────────────────────── */

function routerIdOf(world, d) {
  if (d.ospf?.routerId) return d.ospf.routerId;
  const lo = Object.entries(d.ifaces).filter(([n, i]) => n.startsWith("lo") && i.ip && !i.shutdown).map(([, i]) => ipToInt(i.ip.addr));
  if (lo.length) return intToIp(Math.max(...lo));
  const up = ownIps(world, d).map((x) => ipToInt(x.addr));
  return up.length ? intToIp(Math.max(...up)) : "0.0.0.0";
}

function ospfIfaces(world, d) {
  if (!d.ospf) return [];
  const out = [];
  for (const [name, ifc] of Object.entries(d.ifaces)) {
    if (!ifc.ip || !ifaceUp(world, d, name)) continue;
    const st = d.ospf.networks.find((n) => wildcardMatch(ifc.ip.addr, n.addr, n.wildcard));
    if (st) out.push({ ifName: name, area: st.area, ip: ifc.ip, passive: d.ospf.passive.has(name), cost: ifc.ospfCost ?? (name.startsWith("fa") ? 1 : 1), hello: ifc.hello });
  }
  return out;
}

function ripIfaces(world, d) {
  if (!d.rip) return [];
  const out = [];
  for (const [name, ifc] of Object.entries(d.ifaces)) {
    if (!ifc.ip || !ifaceUp(world, d, name)) continue;
    const cp = classfulPrefix(ifc.ip.addr);
    if (d.rip.networks.some((n) => networkInt(n, classfulPrefix(n)) === networkInt(ifc.ip.addr, cp))) {
      out.push({ ifName: name, ip: ifc.ip, passive: d.rip.passive.has(name) });
    }
  }
  return out;
}

/** OSPF neighbours: same segment, same subnet, same area, same hello timer, not passive. */
export function ospfNeighbors(world, d) {
  const out = [];
  for (const mine of ospfIfaces(world, d)) {
    if (mine.passive) continue;
    const eg = egress(d, mine.ifName);
    const fl = flood(world, d.id, eg.port, eg.tag, eg.internal);
    for (const ep of fl.endpoints) {
      const od = world.devices[ep.dev];
      if (od === d || !isL3(od)) continue;
      const theirs = ospfIfaces(world, od).find((x) => x.ifName === ep.ifName);
      if (!theirs || theirs.passive) continue;
      if (theirs.area !== mine.area || theirs.hello !== mine.hello) continue;
      if (theirs.ip.prefix !== mine.ip.prefix || !inSubnet(theirs.ip.addr, mine.ip.addr, mine.ip.prefix)) continue;
      out.push({ dev: od, ifName: mine.ifName, theirIf: ep.ifName, addr: theirs.ip.addr, cost: mine.cost, rid: routerIdOf(world, od) });
    }
  }
  return out;
}

function ripNeighbors(world, d) {
  const out = [];
  for (const mine of ripIfaces(world, d)) {
    if (mine.passive) continue;
    const eg = egress(d, mine.ifName);
    const fl = flood(world, d.id, eg.port, eg.tag, eg.internal);
    for (const ep of fl.endpoints) {
      const od = world.devices[ep.dev];
      if (od === d || !isL3(od) || !od.rip) continue;
      const theirs = ripIfaces(world, od).find((x) => x.ifName === ep.ifName);
      if (!theirs || theirs.passive || !inSubnet(theirs.ip.addr, mine.ip.addr, mine.ip.prefix)) continue;
      out.push({ dev: od, ifName: mine.ifName, addr: theirs.ip.addr });
    }
  }
  return out;
}

function hasStaticDefault(d) {
  return d.routes.some((r) => r.prefix === 0);
}

function dynamicRoutes(world) {
  const key = `dyn:${world.version}`;
  if (world.cache[key]) return world.cache[key];
  world.cache[key] = {}; // guards re-entry while computing
  const routers = world.order.map((id) => world.devices[id]).filter(isL3);
  const result = {};

  // OSPF: Dijkstra over adjacencies; each router advertises its OSPF networks.
  const adj = new Map(routers.map((r) => [r.id, ospfNeighbors(world, r)]));
  for (const src of routers.filter((r) => r.ospf)) {
    const dist = new Map([[src.id, 0]]);
    const first = new Map();
    const done = new Set();
    for (;;) {
      let best = null;
      for (const [id, dv] of dist) if (!done.has(id) && (best === null || dv < dist.get(best))) best = id;
      if (best === null) break;
      done.add(best);
      for (const nb of adj.get(best) || []) {
        // Adjacency must be two-way.
        if (!(adj.get(nb.dev.id) || []).some((x) => x.dev.id === best)) continue;
        const c = dist.get(best) + nb.cost;
        if (!dist.has(nb.dev.id) || c < dist.get(nb.dev.id)) {
          dist.set(nb.dev.id, c);
          first.set(nb.dev.id, best === src.id ? nb : first.get(best));
        }
      }
    }
    const mine = new Set(ospfIfaces(world, src).map((x) => `${networkInt(x.ip.addr, x.ip.prefix)}/${x.ip.prefix}`));
    const routes = new Map();
    for (const [id, dv] of dist) {
      if (id === src.id) continue;
      const other = world.devices[id];
      const hop = first.get(id);
      if (!hop) continue;
      for (const st of ospfIfaces(world, other)) {
        const net = networkInt(st.ip.addr, st.ip.prefix);
        const k = `${net}/${st.ip.prefix}`;
        if (mine.has(k)) continue;
        const metric = dv + st.cost;
        const cur = routes.get(k);
        if (!cur || metric < cur.metric || (metric === cur.metric && ipToInt(hop.addr) < ipToInt(cur.nextHop))) {
          routes.set(k, { code: "O", net, prefix: st.ip.prefix, ad: 110, metric, exitIf: hop.ifName, nextHop: hop.addr });
        }
      }
      if (other.ospf.defaultOriginate && hasStaticDefault(other) && !hasStaticDefault(src)) {
        const cur = routes.get("0/0");
        if (!cur || dv < cur.dv) routes.set("0/0", { code: "O*E2", net: 0, prefix: 0, ad: 110, metric: 1, dv, exitIf: hop.ifName, nextHop: hop.addr });
      }
    }
    result[src.id] = [...routes.values()];
  }

  // RIP: hop count, breadth first, at most 15.
  const radj = new Map(routers.map((r) => [r.id, ripNeighbors(world, r)]));
  for (const src of routers.filter((r) => r.rip)) {
    const hops = new Map([[src.id, 0]]);
    const first = new Map();
    const queue = [src.id];
    // Version control: with no `version` command a router sends v1 and
    // accepts v1 and v2; `version 2` sends and accepts only v2. A router
    // learns from a neighbour only if it accepts what that neighbour sends.
    const sends = (r) => r.rip.version || 1;
    const accepts = (r, v) => (r.rip.version ? r.rip.version === v : true);
    while (queue.length) {
      const cur = queue.shift();
      for (const nb of radj.get(cur) || []) {
        if (!(radj.get(nb.dev.id) || []).some((x) => x.dev.id === cur)) continue;
        if (!accepts(world.devices[cur], sends(nb.dev))) continue;
        if (hops.has(nb.dev.id)) continue;
        hops.set(nb.dev.id, hops.get(cur) + 1);
        first.set(nb.dev.id, cur === src.id ? nb : first.get(cur));
        queue.push(nb.dev.id);
      }
    }
    const mine = new Set(ownIps(world, src).map((x) => `${networkInt(x.addr, x.prefix)}/${x.prefix}`));
    const routes = new Map();
    for (const [id, h] of hops) {
      if (id === src.id || h > 15) continue;
      const other = world.devices[id];
      const hop = first.get(id);
      for (const st of ripIfaces(world, other)) {
        const net = networkInt(st.ip.addr, st.ip.prefix);
        const k = `${net}/${st.ip.prefix}`;
        if (mine.has(k)) continue;
        const cur = routes.get(k);
        if (!cur || h < cur.metric) routes.set(k, { code: "R", net, prefix: st.ip.prefix, ad: 120, metric: h, exitIf: hop.ifName, nextHop: hop.addr });
      }
      if (other.rip.defaultOriginate && hasStaticDefault(other) && !hasStaticDefault(src)) {
        const cur = routes.get("0/0");
        if (!cur || h < cur.metric) routes.set("0/0", { code: "R*", net: 0, prefix: 0, ad: 120, metric: h, exitIf: hop.ifName, nextHop: hop.addr });
      }
    }
    result[src.id] = [...(result[src.id] || []), ...routes.values()];
  }
  world.cache[key] = result;
  return result;
}

/* ── ACLs ───────────────────────────────────────────────────────────── */

function addrMatch(spec, ip) {
  if (spec.any) return true;
  return wildcardMatch(ip || "0.0.0.0", spec.addr, spec.wildcard);
}

function portMatch(spec, port) {
  if (!spec) return true;
  if (port === undefined || port === null) return false;
  const p = Number(port);
  if (spec.op === "eq") return p === spec.value;
  if (spec.op === "neq") return p !== spec.value;
  if (spec.op === "gt") return p > spec.value;
  if (spec.op === "lt") return p < spec.value;
  if (spec.op === "range") return p >= spec.value && p <= spec.hi;
  return false;
}

/** First match wins; an ACL that matches nothing denies (the implicit deny). */
function aclPermits(d, name, pkt) {
  const acl = d.acls[name];
  if (!acl) return true; // IOS: an applied ACL that does not exist permits everything.
  for (const [i, e] of acl.entries.entries()) {
    let hit;
    if (acl.type === "standard") hit = addrMatch(e.src, pkt.src);
    else {
      const protoOk = e.proto === "ip" || e.proto === pkt.proto;
      hit = protoOk && addrMatch(e.src, pkt.src) && addrMatch(e.dst, pkt.dst) &&
        (e.proto === "ip" || e.proto === "icmp" || (portMatch(e.sport, pkt.sport) && portMatch(e.dport, pkt.dport)));
    }
    if (hit) {
      d.aclHits[`${name}:${i}`] = (d.aclHits[`${name}:${i}`] || 0) + 1;
      return e.action === "permit";
    }
  }
  return false;
}

/* ── NAT ────────────────────────────────────────────────────────────── */

function natOut(world, d, inIf, outIf, pkt) {
  if (d.ifaces[inIf]?.nat !== "inside" || d.ifaces[outIf]?.nat !== "outside") return pkt;
  const st = d.natStatic.find((s) => s.local === pkt.src);
  if (st) {
    record(d, pkt, st.global, pkt.sport);
    return { ...pkt, src: st.global };
  }
  const rule = d.natRules.find((r) => aclPermits(d, r.list, pkt));
  if (!rule) return pkt;
  const global = rule.pool ? rule.pool : ipOf(d, rule.iface || outIf);
  if (!global) return pkt;
  let gport = pkt.sport;
  if (rule.overload) {
    const used = new Set(d.translations.filter((t) => t.global === global && t.proto === pkt.proto).map((t) => t.gport));
    const existing = d.translations.find((t) => t.local === pkt.src && t.lport === pkt.sport && t.proto === pkt.proto);
    if (existing) gport = existing.gport;
    else {
      gport = pkt.sport ?? 1;
      while (used.has(gport)) gport = gport < 1024 ? 1024 : gport + 1;
    }
  }
  record(d, pkt, global, gport);
  return { ...pkt, src: global, sport: gport };
}

function record(d, pkt, global, gport) {
  if (d.translations.some((t) => t.local === pkt.src && t.lport === pkt.sport && t.proto === pkt.proto && t.remote === pkt.dst)) return;
  d.translations.push({ proto: pkt.proto, local: pkt.src, lport: pkt.sport, global, gport, remote: pkt.dst, rport: pkt.dport });
}

function natIn(d, inIf, pkt) {
  if (d.ifaces[inIf]?.nat !== "outside") return pkt;
  const st = d.natStatic.find((s) => s.global === pkt.dst);
  if (st) return { ...pkt, dst: st.local };
  const t = d.translations.find((x) => x.global === pkt.dst && x.proto === pkt.proto && x.gport === pkt.dport && x.remote === pkt.src);
  return t ? { ...pkt, dst: t.local, dport: t.lport } : pkt;
}

/* ── Packet delivery ────────────────────────────────────────────────── */

/**
 * Carry a packet from a device until it is delivered or dropped.
 *
 * Returns { type: "delivered", dev, pkt } or { type: "dropped", dev, why,
 * icmp? } where `icmp` is the error a router sends back (time exceeded or
 * destination unreachable), which the caller can carry home in turn.
 */
function transmit(world, from, pkt, trace = {}) {
  const d = world.devices[from];
  if (isL3(d)) return originate(world, d, pkt, trace);
  // A host, or a Layer-2 switch speaking for its management interface.
  const cfg = hostConfig(d);
  if (!cfg.ip) return drop(d, "no IP address");
  let nh = pkt.dst;
  if (pkt.dst !== "255.255.255.255" && !inSubnet(pkt.dst, cfg.ip, cfg.prefix)) {
    if (!cfg.gateway) return drop(d, "no default gateway");
    if (!inSubnet(cfg.gateway, cfg.ip, cfg.prefix)) return drop(d, "default gateway is not on the local subnet");
    nh = cfg.gateway;
  }
  const src = { ...pkt, src: pkt.src || cfg.ip };
  return deliver(world, d, cfg.ifName, nh, src, trace);
}

function hostConfig(d) {
  if (isHostKind(d.kind)) return { ip: d.host.ip, prefix: d.host.prefix, gateway: d.host.gateway, ifName: d.ports[0] };
  const svi = Object.entries(d.ifaces).find(([n, i]) => n.startsWith("vlan") && i.ip && !i.shutdown);
  if (!svi) return { ip: null };
  return { ip: svi[1].ip.addr, prefix: svi[1].ip.prefix, gateway: d.defaultGateway, ifName: svi[0] };
}

const drop = (d, why, icmp = null, pkt = null) => ({ type: "dropped", dev: d.id, why, icmp, pkt });

function deliver(world, d, ifName, nh, pkt, trace) {
  trace.hops = trace.hops || [];
  const hit = resolve(world, d, ifName, nh, trace);
  if (!hit) return drop(d, `no ARP reply from ${nh}`, isL3(d) ? { kind: "unreachable", from: ipOf(d, ifName) } : null, pkt);
  return receive(world, world.devices[hit.dev], hit.ifName, pkt, trace);
}

function receive(world, d, ifName, pkt, trace) {
  if (!isL3(d)) {
    const cfg = hostConfig(d);
    if (pkt.dst === cfg.ip || pkt.dst === "255.255.255.255") return { type: "delivered", dev: d.id, pkt, ifName };
    return drop(d, "packet not addressed to this host", null, pkt);
  }
  const ifc = d.ifaces[ifName];
  const inAddr = ifc.ip?.addr;
  if (ifc.aclIn && !aclPermits(d, ifc.aclIn, pkt)) return drop(d, `denied by access list ${ifc.aclIn} in on ${longIf(ifName)}`, { kind: "unreachable", from: inAddr }, pkt);
  let p = natIn(d, ifName, pkt);
  if (ownIps(world, d).some((x) => x.addr === p.dst)) return { type: "delivered", dev: d.id, pkt: p, ifName };
  trace.hops.push({ dev: d.id, ip: inAddr });
  p = { ...p, ttl: p.ttl - 1 };
  if (p.ttl <= 0) return drop(d, "TTL expired", { kind: "ttl", from: inAddr }, pkt);
  const route = lookup(world, d, p.dst);
  if (!route) return drop(d, `no route to ${p.dst}`, { kind: "unreachable", from: inAddr }, pkt);
  const out = d.ifaces[route.exitIf];
  if (out.aclOut && !aclPermits(d, out.aclOut, p)) return drop(d, `denied by access list ${out.aclOut} out on ${longIf(route.exitIf)}`, { kind: "unreachable", from: inAddr }, pkt);
  p = natOut(world, d, ifName, route.exitIf, p);
  return deliver(world, d, route.exitIf, route.nextHop || p.dst, p, trace);
}

/** A router sending its own packet: routed, but not filtered by outbound ACLs, as on IOS. */
function originate(world, d, pkt, trace) {
  trace.hops = trace.hops || [];
  if (ownIps(world, d).some((x) => x.addr === pkt.dst)) return { type: "delivered", dev: d.id, pkt };
  const route = lookup(world, d, pkt.dst);
  if (!route) return drop(d, `no route to ${pkt.dst}`);
  const p = { ...pkt, src: pkt.src || ipOf(d, route.exitIf) };
  return deliver(world, d, route.exitIf, route.nextHop || p.dst, p, trace);
}

/** Which device owns an address (for replies). */
function ownerOf(world, ip) {
  for (const id of world.order) {
    const d = world.devices[id];
    if (isHostKind(d.kind) && d.host.ip === ip) return d;
    if (isCisco(d) && Object.values(d.ifaces).some((i) => i.ip?.addr === ip)) return d;
  }
  return null;
}

/**
 * One request and its reply, end to end. `respond(dev, pkt)` decides whether
 * the destination answers (a host always answers ping; a closed port refuses).
 */
function roundTrip(world, from, pkt, respond = () => ({ answer: true })) {
  const trace = {};
  const go = transmit(world, from, pkt, trace);
  if (go.type === "dropped") {
    if (go.icmp?.from) {
      const err = transmit(world, go.dev, { src: go.icmp.from, dst: go.pkt?.src || pkt.src, proto: "icmp", ttl: 255, icmpError: go.icmp.kind }, {});
      if (err.type === "delivered" && err.dev === from) return { ok: false, icmp: go.icmp, why: go.why, at: go.dev, trace };
    }
    return { ok: false, why: go.why, at: go.dev, trace };
  }
  const target = world.devices[go.dev];
  const answer = respond(target, go.pkt, go.ifName);
  if (!answer.answer) return { ok: false, refused: answer.refused, why: answer.why, at: go.dev, reached: true, trace };
  const reply = { src: go.pkt.dst, dst: go.pkt.src, proto: go.pkt.proto, sport: go.pkt.dport, dport: go.pkt.sport, ttl: isL3(target) ? 255 : 128 };
  const backTrace = {};
  const back = transmit(world, go.dev, reply, backTrace);
  if (back.type === "delivered" && back.dev === from) {
    return { ok: true, ttl: back.pkt.ttl, trace, backTrace, lossy: trace.lossy || backTrace.lossy, arpMiss: trace.arpMiss || backTrace.arpMiss, payload: answer.payload, at: go.dev };
  }
  return { ok: false, why: back.why ? `reply lost: ${back.why}` : "reply lost", at: back.dev, reached: true, trace };
}

/* ════════════════════════════════════════════════════════════════════════
   SERVICES
   ════════════════════════════════════════════════════════════════════════ */

function sourceIpOf(world, d) {
  if (isHostKind(d.kind)) return d.host.ip;
  return hostConfig(d).ip;
}

let ephemeral = 49152;
const nextPort = () => (ephemeral = ephemeral >= 65000 ? 49152 : ephemeral + 1);

export function ping(world, fromId, dst, count = 4) {
  const d = world.devices[fromId];
  const results = [];
  for (let i = 0; i < count; i += 1) {
    const r = roundTrip(world, fromId, { src: isL3(d) ? null : sourceIpOf(world, d), dst, proto: "icmp", sport: i + 1, dport: i + 1, ttl: isL3(d) ? 255 : 128 });
    // A router drops the packet that triggered its own ARP request, so the
    // first ping across a router whose cache was cold is lost. Hosts queue it.
    if (r.ok && i === 0 && r.arpMiss) results.push({ ok: false, why: "lost while ARP resolved" });
    else if (r.ok && r.lossy && i % 2 === 1) results.push({ ok: false, why: "frame lost to late collisions" });
    else results.push(r);
  }
  return results;
}

function tcpRespond(port) {
  return (target, pkt) => {
    if (isHostKind(target.kind)) {
      if (target.services.has(port)) return { answer: true, payload: target };
      return { answer: false, refused: true, why: `nothing listens on port ${port}` };
    }
    if (port === 22 || port === 23) {
      const v = target.lines.vty;
      const tr = v.transport;
      const allowed = tr === "all" || tr.split(" ").includes(port === 22 ? "ssh" : "telnet");
      if (!allowed) return { answer: false, refused: true, why: `vty lines do not accept ${port === 22 ? "SSH" : "Telnet"}` };
      if (port === 22 && target.rsaBits < 768) return { answer: false, refused: true, why: "no RSA key, so SSH is not enabled" };
      if (v.accessClass && !aclPermits(target, v.accessClass, { src: pkt.src })) return { answer: false, refused: true, why: `access-class ${v.accessClass} refuses ${pkt.src}` };
      return { answer: true, payload: target };
    }
    if (port === 80 && target.httpServer) return { answer: true, payload: target };
    return { answer: false, refused: true, why: `port ${port} is closed` };
  };
}

export function tcpConnect(world, fromId, dst, port) {
  const d = world.devices[fromId];
  return roundTrip(world, fromId, { src: sourceIpOf(world, d), dst, proto: "tcp", sport: nextPort(), dport: port, ttl: 128 }, tcpRespond(port));
}

/** What a vty login would conclude, once the TCP session is open. */
function vtyLogin(target, port, user) {
  const v = target.lines.vty;
  if (v.login === "local") {
    if (!Object.keys(target.users).length) return { ok: false, why: "login local, but no usernames are configured" };
    if (user && !target.users[user]) return { ok: false, why: `no user ${user}` };
    return { ok: true };
  }
  if (port === 22) return { ok: false, why: "SSH needs a username: configure login local" };
  if (v.login === "line" && v.password) return { ok: true };
  return { ok: false, why: "Password required, but none set" };
}

export function resolveName(world, fromId, name) {
  if (isIp(name)) return { ok: true, ip: name };
  const d = world.devices[fromId];
  const server = d.host?.dns;
  if (!server) return { ok: false, why: "no DNS server configured" };
  const r = roundTrip(world, fromId, { src: sourceIpOf(world, d), dst: server, proto: "udp", sport: nextPort(), dport: 53, ttl: 128 }, (target) => {
    if (!isHostKind(target.kind) || !target.services.has(53)) return { answer: false, why: "no DNS service there" };
    return { answer: true, payload: target };
  });
  if (!r.ok) return { ok: false, why: `DNS server ${server} did not answer`, server };
  const rec = r.payload.records[String(name).toLowerCase()];
  if (!rec) return { ok: false, nx: true, server, why: "name not found" };
  return { ok: true, ip: rec, server, serverName: r.payload.label };
}

/* ── DHCP ───────────────────────────────────────────────────────────── */

function inUse(world, ip) {
  return Boolean(ownerOf(world, ip));
}

function allocate(world, server, pool, giaddr, mac) {
  const existing = server.bindings.find((b) => b.mac === mac && b.pool === pool.name);
  if (existing) return existing.ip;
  const net = ipToInt(pool.network);
  const bcast = (net | (~maskInt(pool.prefix) >>> 0)) >>> 0;
  const start = pool.start ? ipToInt(pool.start) : net + 1;
  for (let n = start; n < bcast; n += 1) {
    const ip = intToIp(n);
    if (server.dhcpExcluded.some(([lo, hi]) => n >= ipToInt(lo) && n <= ipToInt(hi))) continue;
    if (server.bindings.some((b) => b.ip === ip)) continue;
    if (ip === pool.router || ip === giaddr || inUse(world, ip)) continue;
    server.bindings.push({ ip, mac, pool: pool.name });
    return ip;
  }
  return null;
}

function poolsOf(d) {
  if (isHostKind(d.kind)) {
    if (!d.services.has(67) && !d.dhcpSpec.length) return [];
    return d.dhcpSpec.map((p, i) => {
      const [addr, pre] = p.network.split("/");
      return { name: p.name || `pool${i + 1}`, network: addr, prefix: Number(pre), router: p.gateway || null, dns: p.dns || null, start: p.start || null };
    });
  }
  return Object.values(d.pools).filter((p) => p.network);
}

/** DISCOVER → OFFER → REQUEST → ACK, collapsed into one exchange. */
export function dhcpRenew(world, h) {
  h.host.dhcp = true;
  const port = h.ports[0];
  const mac = h.ifaces[port].mac;
  const prev = { ...h.host };
  h.host.ip = null;
  h.host.apipa = false;
  const fl = flood(world, h.id, port, null);
  const discover = { src: "0.0.0.0", dst: "255.255.255.255", proto: "udp", sport: 68, dport: 67 };
  let lease = null;
  for (const ep of fl.endpoints) {
    const d = world.devices[ep.dev];
    if (d === h) continue;
    if (isHostKind(d.kind)) {
      if (!d.host.ip) continue;
      const pool = poolsOf(d).find((p) => inSubnet(d.host.ip, p.network, p.prefix));
      if (pool) {
        const ip = allocate(world, d, pool, null, mac);
        if (ip) lease = { ip, pool, server: d.host.ip };
      }
    } else if (isL3(d) && ifaceUp(world, d, ep.ifName)) {
      const ifc = d.ifaces[ep.ifName];
      if (ifc.aclIn && !aclPermits(d, ifc.aclIn, discover)) continue;
      const giaddr = ifc.ip.addr;
      const local = poolsOf(d).find((p) => inSubnet(giaddr, p.network, p.prefix));
      if (local) {
        const ip = allocate(world, d, local, giaddr, mac);
        if (ip) lease = { ip, pool: local, server: giaddr };
      } else {
        for (const helper of ifc.helpers) {
          const relay = { src: giaddr, dst: helper, proto: "udp", sport: 67, dport: 67, ttl: 255 };
          const go = originate(world, d, relay, {});
          if (go.type !== "delivered") continue;
          const srv = world.devices[go.dev];
          const pool = poolsOf(srv).find((p) => inSubnet(giaddr, p.network, p.prefix));
          if (!pool) continue;
          const back = transmit(world, srv.id, { src: helper, dst: giaddr, proto: "udp", sport: 67, dport: 67, ttl: 128 }, {});
          if (back.type !== "delivered" || back.dev !== d.id) continue;
          const ip = allocate(world, srv, pool, giaddr, mac);
          if (ip) { lease = { ip, pool, server: helper }; break; }
        }
      }
    }
    if (lease) break;
  }
  if (lease) {
    h.host.ip = lease.ip;
    h.host.prefix = lease.pool.prefix;
    h.host.gateway = lease.pool.router || null;
    h.host.dns = lease.pool.dns || null;
    h.host.dhcpServer = lease.server;
    world.version += 1;
    return { ok: true, lease };
  }
  // No server answered: Windows falls back to an APIPA address.
  const m = mac.replace(/\./g, "");
  h.host.ip = `169.254.${parseInt(m.slice(8, 10), 16) || 1}.${parseInt(m.slice(10, 12), 16) || 1}`;
  h.host.prefix = 16;
  h.host.gateway = null;
  h.host.dns = prev.dhcp ? null : prev.dns;
  h.host.apipa = true;
  h.host.dhcpServer = null;
  world.version += 1;
  return { ok: false };
}

/* ════════════════════════════════════════════════════════════════════════
   THE COMMAND LINE
   ════════════════════════════════════════════════════════════════════════ */

const ONE_CHAR = new Set(["terminal"]);
/** IOS-style abbreviation: any unambiguous prefix (two letters here, one for `t`). */
const is = (tok, word) => {
  if (!tok) return false;
  const t = tok.toLowerCase();
  const min = ONE_CHAR.has(word) ? 1 : Math.min(2, word.length);
  return t.length >= min && word.startsWith(t);
};

function tokenize(line) {
  const out = [];
  const re = /\S+/g;
  let m;
  while ((m = re.exec(line))) out.push({ t: m[0], pos: m.index });
  return out;
}

class Invalid {
  constructor(index, kind = "invalid") { this.index = index; this.kind = kind; }
}
const bad = (i) => { throw new Invalid(i); };
const incomplete = () => { throw new Invalid(-1, "incomplete"); };

export function promptOf(world, id) {
  const d = world.devices[id];
  if (!d) return "";
  if (d.kind === "ap") return `${d.id}>`;
  if (!isCisco(d)) return "C:\\>";
  const h = d.hostname;
  switch (d.mode) {
    case "user": return `${h}>`;
    case "priv": return `${h}#`;
    case "config": return `${h}(config)#`;
    case "if": return `${h}(config-if)#`;
    case "range": return `${h}(config-if-range)#`;
    case "subif": return `${h}(config-subif)#`;
    case "vlan": return `${h}(config-vlan)#`;
    case "router": return `${h}(config-router)#`;
    case "dhcp": return `${h}(dhcp-config)#`;
    case "line": return `${h}(config-line)#`;
    case "acl": return `${h}(config-${d.ctx.aclType === "standard" ? "std" : "ext"}-nacl)#`;
    default: return `${h}>`;
  }
}

/**
 * Run one line on one device. Returns { output, prompt }. Never throws: a
 * command the simulator does not model gets IOS's own error message.
 */
export function exec(world, id, line) {
  const d = world.devices[id];
  if (!d) return { output: "", prompt: "" };
  const before = promptOf(world, id);
  let output = "";
  try {
    if (d.kind === "ap") output = execAp(world, d, line);
    else if (!isCisco(d)) output = execHost(world, d, line);
    else output = execIos(world, d, line);
  } catch (err) {
    if (err instanceof Invalid) {
      if (err.kind === "incomplete") output = "% Incomplete command.";
      else {
        const toks = tokenize(line);
        const pos = err.index >= 0 && toks[err.index] ? toks[err.index].pos : line.length;
        output = `${" ".repeat(before.length + pos)}^\n% Invalid input detected at '^' marker.`;
      }
    } else {
      output = `% Simulator error: ${err.message}`;
    }
  }
  world.version += 1;
  world.cache = {};
  return { output, prompt: promptOf(world, id) };
}

/* ── IOS ────────────────────────────────────────────────────────────── */

function execIos(world, d, line) {
  const raw = line.trim();
  if (!raw || raw.startsWith("!")) return "";
  const toks = tokenize(raw).map((x) => x.t);
  const t0 = toks[0];

  // Global commands work from every configuration sub-mode, as on IOS: the
  // router quietly leaves the sub-mode and runs them.
  if (["user", "priv"].includes(d.mode)) return execExec(world, d, toks, raw);
  if (is(t0, "do")) {
    if (!toks[1]) incomplete();
    return execExec(world, d, toks.slice(1), raw.replace(/^\S+\s+/, ""), 1);
  }
  if (is(t0, "end")) { d.mode = "priv"; d.ctx = {}; return ""; }
  if (is(t0, "exit")) {
    d.mode = d.mode === "config" ? "priv" : "config";
    d.ctx = {};
    return "";
  }
  if (d.mode !== "config") {
    const sub = execSub(world, d, toks, raw);
    if (sub !== undefined) return sub;
    const saved = { mode: d.mode, ctx: d.ctx };
    d.mode = "config";
    d.ctx = {};
    try {
      return execConfig(world, d, toks, raw);
    } catch (err) {
      d.mode = saved.mode;
      d.ctx = saved.ctx;
      throw err;
    }
  }
  return execConfig(world, d, toks, raw);
}

function execExec(world, d, toks, raw, offset = 0) {
  const [a, b] = toks;
  if (!a) return "";
  if (is(a, "enable") && toks.length === 1) { d.mode = "priv"; return ""; }
  if (is(a, "disable")) { d.mode = "user"; return ""; }
  if ((is(a, "exit") || is(a, "logout")) && toks.length === 1) { d.mode = "user"; return ""; }
  if (is(a, "configure")) {
    if (d.mode === "user") bad(offset);
    if (!b) return "Configuring from terminal, memory, or network [terminal]? ";
    if (!is(b, "terminal")) bad(offset + 1);
    d.mode = "config";
    d.ctx = {};
    return "Enter configuration commands, one per line.  End with CNTL/Z.";
  }
  if (is(a, "show")) return show(world, d, toks.slice(1), offset + 1);
  if (is(a, "ping")) {
    if (!b) incomplete();
    if (!isIp(b)) bad(offset + 1);
    return iosPing(world, d, b);
  }
  if (is(a, "traceroute")) {
    if (!b) incomplete();
    if (!isIp(b)) bad(offset + 1);
    return iosTrace(world, d, b);
  }
  if ((is(a, "copy") && b && is(b, "running-config")) || (is(a, "write") && (!b || is(b, "memory")))) {
    if (d.mode === "user") bad(offset);
    return is(a, "copy") ? "Destination filename [startup-config]? \nBuilding configuration...\n[OK]" : "Building configuration...\n[OK]";
  }
  if (is(a, "clear") && b && is(b, "ip") && toks[2] && is(toks[2], "nat")) {
    d.translations = [];
    return "";
  }
  if (is(a, "clear") && b && is(b, "mac") ) {
    d.macTable.clear();
    return "";
  }
  if (is(a, "clear") && b && is(b, "arp-cache")) {
    d.arp.clear();
    return "";
  }
  return bad(offset);
}

function needIp(tok, i) {
  if (!tok) incomplete();
  if (!isIp(tok)) bad(i);
  return tok;
}
function needMask(tok, i) {
  if (!tok) incomplete();
  const p = maskToPrefix(tok);
  if (p === null) bad(i);
  return p;
}
function needNum(tok, i, lo = 0, hi = 4294967295) {
  if (!tok) incomplete();
  if (!/^\d+$/.test(tok) || Number(tok) < lo || Number(tok) > hi) bad(i);
  return Number(tok);
}

function parseVlanList(text, i) {
  const set = new Set();
  for (const part of String(text).split(",")) {
    const m = /^(\d+)(?:-(\d+))?$/.exec(part);
    if (!m) bad(i);
    const lo = Number(m[1]);
    const hi = Number(m[2] ?? m[1]);
    if (lo < 1 || hi > 4094 || hi < lo) bad(i);
    for (let v = lo; v <= hi; v += 1) set.add(v);
  }
  return set;
}

function ifaceFor(d, raw, i) {
  const name = canonIf(raw);
  if (!name) bad(i);
  if (name.includes(".")) {
    if (d.kind !== "router") bad(i);
    const parent = name.split(".")[0];
    if (!d.ifaces[parent]) bad(i);
    if (!d.ifaces[name]) d.ifaces[name] = newIface(d, name);
    return name;
  }
  if (name.startsWith("lo")) {
    if (!d.ifaces[name]) {
      d.ifaces[name] = newIface(d, name);
      return { name, created: true };
    }
    return name;
  }
  if (name.startsWith("vlan")) {
    if (d.kind !== "switch") bad(i);
    const v = Number(name.slice(4));
    if (v < 1 || v > 4094) bad(i);
    if (!d.ifaces[name]) d.ifaces[name] = newIface(d, name);
    return name;
  }
  if (!d.ifaces[name]) bad(i);
  return name;
}

function parseRange(d, toks, i) {
  // interface range fa0/1 - 10 , fa0/20 - 24   (spaces optional)
  const text = toks.slice(i).join(" ").replace(/\s*-\s*/g, "-").replace(/\s*,\s*/g, ",");
  const out = [];
  for (const part of text.split(",")) {
    const m = /^(.*?)(\d+)(?:-(\d+))?$/.exec(part.trim());
    if (!m) bad(i);
    const base = canonIf(`${m[1]}${m[2]}`);
    if (!base) bad(i);
    const prefix = base.slice(0, base.length - m[2].length);
    const lo = Number(m[2]);
    const hi = Number(m[3] ?? m[2]);
    for (let n = lo; n <= hi; n += 1) {
      const name = `${prefix}${n}`;
      if (!d.ifaces[name]) bad(i);
      out.push(name);
    }
  }
  if (!out.length) incomplete();
  return out;
}

function parseAddrSpec(toks, i) {
  const t = toks[i];
  if (!t) incomplete();
  if (is(t, "any")) return [{ any: true }, i + 1];
  if (is(t, "host")) return [{ addr: needIp(toks[i + 1], i + 1), wildcard: "0.0.0.0", host: true }, i + 2];
  needIp(t, i);
  const w = toks[i + 1];
  if (w && isIp(w)) return [{ addr: t, wildcard: w }, i + 2];
  return [{ addr: t, wildcard: "0.0.0.0", host: true, bare: true }, i + 1];
}

const PORT_NAMES = { www: 80, http: 80, ssh: 22, telnet: 23, domain: 53, ftp: 21, smtp: 25, pop3: 110, ntp: 123, snmp: 161, https: 443, bootps: 67, bootpc: 68, tftp: 69 };
function parsePortSpec(toks, i) {
  const op = toks[i];
  if (!op || !["eq", "neq", "gt", "lt", "range"].includes(op.toLowerCase())) return [null, i];
  const num = (t, j) => {
    if (!t) incomplete();
    if (/^\d+$/.test(t)) return Number(t);
    if (PORT_NAMES[t.toLowerCase()]) return PORT_NAMES[t.toLowerCase()];
    return bad(j);
  };
  if (op.toLowerCase() === "range") return [{ op: "range", value: num(toks[i + 1], i + 1), hi: num(toks[i + 2], i + 2) }, i + 3];
  return [{ op: op.toLowerCase(), value: num(toks[i + 1], i + 1) }, i + 2];
}

/** One ACE, from the tokens after the ACL name/number. */
function parseAce(type, toks, i) {
  const action = toks[i]?.toLowerCase();
  if (!action) incomplete();
  if (!["permit", "deny"].includes(action)) {
    if (is(action, "remark")) return { remark: toks.slice(i + 1).join(" ") };
    bad(i);
  }
  if (type === "standard") {
    const [src, j] = parseAddrSpec(toks, i + 1);
    if (toks[j]) bad(j);
    return { action, src };
  }
  const proto = toks[i + 1]?.toLowerCase();
  if (!proto) incomplete();
  if (!["ip", "tcp", "udp", "icmp"].includes(proto)) bad(i + 1);
  let [src, j] = parseAddrSpec(toks, i + 2);
  let sport = null;
  if (proto === "tcp" || proto === "udp") [sport, j] = parsePortSpec(toks, j);
  const [dst, k0] = parseAddrSpec(toks, j);
  let k = k0;
  let dport = null;
  if (proto === "tcp" || proto === "udp") [dport, k] = parsePortSpec(toks, k);
  if (proto === "icmp" && toks[k] && /^(echo|echo-reply)$/i.test(toks[k])) k += 1;
  if (toks[k] && is(toks[k], "log")) k += 1;
  if (toks[k]) bad(k);
  return { action, proto, src, dst, sport, dport };
}

function aclTypeOf(name) {
  const n = Number(name);
  if (Number.isFinite(n)) return n >= 1 && n <= 99 ? "standard" : n >= 100 && n <= 199 ? "extended" : null;
  return null;
}

function execConfig(world, d, toks, raw) {
  const [a] = toks;
  const neg = is(a, "no") && a.toLowerCase() === "no";
  const t = neg ? toks.slice(1) : toks;
  const off = neg ? 1 : 0;
  const [x, y] = t;

  if (is(x, "hostname")) {
    if (neg) { d.hostname = d.kind === "router" ? "Router" : "Switch"; return ""; }
    if (!y) incomplete();
    if (!/^[A-Za-z][\w-]*$/.test(y)) bad(off + 1);
    d.hostname = y;
    return "";
  }

  if (is(x, "interface")) {
    if (!y) incomplete();
    if (is(y, "range")) {
      const list = parseRange(d, t, off + 2);
      d.mode = "range";
      d.ctx = { ifaces: list };
      return "";
    }
    const r = ifaceFor(d, t.slice(off + 1).join(""), off + 1);
    const name = typeof r === "string" ? r : r.name;
    if (neg) {
      if (name.includes(".") || name.startsWith("lo") || name.startsWith("vlan")) delete d.ifaces[name];
      return "";
    }
    d.mode = name.includes(".") ? "subif" : "if";
    d.ctx = { iface: name };
    if (typeof r !== "string" && r.created) return `%LINK-5-CHANGED: Interface ${longIf(name)}, changed state to up\n%LINEPROTO-5-UPDOWN: Line protocol on Interface ${longIf(name)}, changed state to up`;
    return "";
  }

  if (is(x, "vlan")) {
    if (d.kind !== "switch") bad(off);
    const ids = parseVlanList(y ?? incomplete(), off + 1);
    for (const v of ids) {
      if (neg) {
        if (v === 1) return "%Default VLAN 1 may not be deleted.";
        d.vlans.delete(v);
      } else if (!d.vlans.has(v)) d.vlans.set(v, `VLAN${String(v).padStart(4, "0")}`);
    }
    if (!neg) { d.mode = "vlan"; d.ctx = { vlans: [...ids] }; }
    return "";
  }

  if (is(x, "ip")) {
    if (!y) incomplete();
    if (is(y, "route")) {
      const net = needIp(t[2], off + 2);
      const prefix = needMask(t[3], off + 3);
      const via = t[4];
      if (!via) incomplete();
      const nInt = ipToInt(net);
      if ((nInt & maskInt(prefix)) >>> 0 !== nInt) return "%Inconsistent address and mask";
      let route;
      if (isIp(via)) route = { net: nInt, prefix, nextHop: via };
      else {
        const ifn = canonIf(via);
        if (!ifn || !d.ifaces[ifn]) bad(off + 4);
        route = { net: nInt, prefix, exitIf: ifn, nextHop: t[5] && isIp(t[5]) ? t[5] : null };
      }
      const adTok = t[t.length - 1];
      if (t.length > 5 && /^\d+$/.test(adTok)) route.ad = Number(adTok);
      const same = (r) => r.net === route.net && r.prefix === route.prefix && (r.nextHop || r.exitIf) === (route.nextHop || route.exitIf);
      if (neg) d.routes = d.routes.filter((r) => !same(r));
      else if (!d.routes.some(same)) d.routes.push(route);
      return "";
    }
    if (is(y, "routing")) {
      if (d.kind !== "switch" && d.kind !== "router") bad(off + 1);
      d.ipRouting = d.kind === "router" ? true : !neg;
      return "";
    }
    if (is(y, "default-gateway")) {
      if (neg) { d.defaultGateway = null; return ""; }
      d.defaultGateway = needIp(t[2], off + 2);
      return "";
    }
    if (is(y, "domain-name") || (is(y, "domain") && t[2] && is(t[2], "name"))) {
      const val = is(y, "domain") ? t[3] : t[2];
      if (neg) { d.domainName = null; return ""; }
      if (!val) incomplete();
      d.domainName = val;
      return "";
    }
    if (is(y, "ssh")) {
      if (t[2] && is(t[2], "version")) {
        const v = needNum(t[3], off + 3, 1, 2);
        if (v === 2 && d.rsaBits < 768) return "Please create RSA keys to enable SSH (and of atleast 768 bits for SSH v2).";
        d.sshVersion = neg ? null : v;
        return "";
      }
      if (t[2] && /^(time-out|authentication-retries)$/i.test(t[2])) { needNum(t[3], off + 3); return ""; }
      bad(off + 2);
    }
    if (is(y, "dhcp")) {
      if (t[2] && is(t[2], "excluded-address")) {
        const lo = needIp(t[3], off + 3);
        const hi = t[4] ? needIp(t[4], off + 4) : lo;
        if (neg) d.dhcpExcluded = d.dhcpExcluded.filter(([l, h]) => !(l === lo && h === hi));
        else d.dhcpExcluded.push([lo, hi]);
        return "";
      }
      if (t[2] && is(t[2], "pool")) {
        if (!t[3]) incomplete();
        if (neg) { delete d.pools[t[3]]; return ""; }
        if (!d.pools[t[3]]) d.pools[t[3]] = { name: t[3], network: null, prefix: null, router: null, dns: null };
        d.mode = "dhcp";
        d.ctx = { pool: t[3] };
        return "";
      }
      bad(off + 2);
    }
    if (is(y, "nat")) {
      // ip nat inside source list 1 interface g0/1 overload | ip nat inside source static A B
      if (!t[2] || !is(t[2], "inside")) bad(off + 2);
      if (!t[3] || !is(t[3], "source")) bad(off + 3);
      if (t[4] && is(t[4], "static")) {
        const local = needIp(t[5], off + 5);
        const global = needIp(t[6], off + 6);
        if (neg) d.natStatic = d.natStatic.filter((s) => s.local !== local);
        else d.natStatic.push({ local, global });
        return "";
      }
      if (!t[4] || !is(t[4], "list")) bad(off + 4);
      if (!t[5]) incomplete();
      const rule = { list: t[5], overload: false };
      let k = 6;
      if (t[k] && is(t[k], "interface")) {
        const ifn = canonIf(t[k + 1] || "");
        if (!ifn || !d.ifaces[ifn]) bad(off + k + 1);
        rule.iface = ifn;
        k += 2;
      } else if (t[k] && is(t[k], "pool")) bad(off + k);
      else if (!t[k]) incomplete();
      else bad(off + k);
      if (t[k] && is(t[k], "overload")) { rule.overload = true; k += 1; }
      if (t[k]) bad(off + k);
      if (neg) d.natRules = d.natRules.filter((r) => r.list !== rule.list);
      else {
        d.natRules = d.natRules.filter((r) => r.list !== rule.list);
        d.natRules.push(rule);
      }
      return "";
    }
    if (is(y, "access-list")) {
      const type = t[2]?.toLowerCase();
      if (!type) incomplete();
      if (!["standard", "extended"].includes(type)) bad(off + 2);
      const name = t[3];
      if (!name) incomplete();
      if (neg) { delete d.acls[name]; return ""; }
      if (!d.acls[name]) d.acls[name] = { type, entries: [], named: true };
      d.mode = "acl";
      d.ctx = { acl: name, aclType: type };
      return "";
    }
    if (is(y, "http") && t[2] && is(t[2], "server")) {
      d.httpServer = !neg;
      return "";
    }
    if (is(y, "cef") || is(y, "classless")) return "";
    bad(off + 1);
  }

  if (is(x, "access-list")) {
    const name = y;
    if (!name) incomplete();
    const type = aclTypeOf(name);
    if (!type) bad(off + 1);
    if (neg) { delete d.acls[name]; return ""; }
    const ace = parseAce(type, t, off + 2 - off);
    if (!d.acls[name]) d.acls[name] = { type, entries: [] };
    if (!ace.remark) d.acls[name].entries.push(ace);
    return "";
  }

  if (is(x, "router")) {
    if (!isL3(d)) bad(off);
    if (y && is(y, "ospf")) {
      const pid = needNum(t[2], off + 2, 1, 65535);
      if (neg) { d.ospf = null; return ""; }
      if (!d.ospf) d.ospf = { pid, networks: [], passive: new Set(), routerId: null, defaultOriginate: false };
      d.mode = "router";
      d.ctx = { proto: "ospf" };
      return "";
    }
    if (y && is(y, "rip")) {
      if (neg) { d.rip = null; return ""; }
      if (!d.rip) d.rip = { version: null, networks: [], passive: new Set(), defaultOriginate: false, autoSummary: true };
      d.mode = "router";
      d.ctx = { proto: "rip" };
      return "";
    }
    if (!y) incomplete();
    bad(off + 1);
  }

  if (is(x, "enable")) {
    if (y && is(y, "secret")) {
      if (neg) { d.enableSecret = null; return ""; }
      const pw = t[2] === "5" || t[2] === "0" ? t[3] : t[2];
      if (!pw) incomplete();
      d.enableSecret = pw;
      return "";
    }
    if (y && is(y, "password")) {
      if (neg) { d.enablePassword = null; return ""; }
      if (!t[2]) incomplete();
      d.enablePassword = t[2];
      return "";
    }
    bad(off + 1);
  }

  if (is(x, "service")) {
    if (y && is(y, "password-encryption")) { d.passwordEncryption = !neg; return ""; }
    if (y && /^(timestamps|dhcp)$/i.test(y)) return "";
    bad(off + 1);
  }

  if (is(x, "username")) {
    if (!y) incomplete();
    if (neg) { delete d.users[y]; return ""; }
    let k = 2;
    let priv = 1;
    if (t[k] && is(t[k], "privilege")) { priv = needNum(t[k + 1], off + k + 1, 0, 15); k += 2; }
    const kind = t[k]?.toLowerCase();
    if (!kind) incomplete();
    if (!["secret", "password"].includes(kind)) bad(off + k);
    const pw = t[k + 1] === "0" || t[k + 1] === "5" ? t[k + 2] : t[k + 1];
    if (!pw) incomplete();
    d.users[y] = { secret: kind === "secret", value: pw, priv };
    return "";
  }

  if (is(x, "crypto")) {
    if (!(y && is(y, "key") && t[2] && is(t[2], "generate") && t[3] && is(t[3], "rsa"))) {
      if (neg && y && is(y, "key") && t[2] && is(t[2], "zeroize")) { d.rsaBits = 0; return ""; }
      bad(off + 1);
    }
    if (d.hostname === "Router" || d.hostname === "Switch") return "% Please define a hostname other than Router.";
    if (!d.domainName) return "% Please define a domain-name first.";
    let bits = 512;
    const mi = t.findIndex((w) => is(w, "modulus"));
    if (mi >= 0) bits = needNum(t[mi + 1], off + mi + 1, 360, 4096);
    d.rsaBits = bits;
    return `The name for the keys will be: ${d.hostname}.${d.domainName}\n${mi < 0 ? "Choose the size of the key modulus in the range of 360 to 4096 for your\n  General Purpose Keys. Choosing a key modulus greater than 512 may take\n  a few minutes.\n\nHow many bits in the modulus [512]: \n" : ""}% Generating ${bits} bit RSA keys, keys will be non-exportable...[OK]\n*Mar 1 0:12:14.218: %SSH-5-ENABLED: SSH 1.99 has been enabled`;
  }

  if (is(x, "line")) {
    if (!y) incomplete();
    if (is(y, "vty")) {
      needNum(t[2], off + 2, 0, 15);
      if (t[3]) needNum(t[3], off + 3, 0, 15);
      d.mode = "line";
      d.ctx = { line: "vty" };
      return "";
    }
    if (is(y, "console")) {
      needNum(t[2], off + 2, 0, 0);
      d.mode = "line";
      d.ctx = { line: "con" };
      return "";
    }
    bad(off + 1);
  }

  if (is(x, "banner")) {
    if (!y || !is(y, "motd")) bad(off + 1);
    if (neg) { d.banner = null; return ""; }
    const m = /motd\s+(\S)([\s\S]*?)\1/i.exec(raw);
    if (!m) incomplete();
    d.banner = m[2];
    return "";
  }

  if (is(x, "spanning-tree")) {
    if (d.kind !== "switch") bad(off);
    if (y && is(y, "vlan")) {
      const ids = parseVlanList(t[2] ?? incomplete(), off + 2);
      const what = t[3];
      if (!what) incomplete();
      let pr;
      if (is(what, "priority")) {
        pr = needNum(t[4], off + 4, 0, 61440);
        if (pr % 4096 !== 0) return "% Bridge Priority must be in increments of 4096.\n% Allowed values are:\n  0     4096  8192  12288 16384 20480 24576 28672\n  32768 36864 40960 45056 49152 53248 57344 61440";
      } else if (is(what, "root")) {
        const kind = t[4];
        if (!kind) incomplete();
        if (is(kind, "primary")) pr = 24576;
        else if (is(kind, "secondary")) pr = 28672;
        else bad(off + 4);
      } else bad(off + 3);
      for (const v of ids) {
        if (neg) delete d.stpPriority[v];
        else d.stpPriority[v] = pr;
      }
      return "";
    }
    if (y && is(y, "mode")) return "";
    bad(off + 1);
  }

  if (is(x, "no") ) bad(1);
  if (is(x, "cdp") || is(x, "logging") || is(x, "clock")) return "";
  if (is(x, "default")) bad(off);
  return bad(off);
}

function execSub(world, d, toks, raw) {
  const neg = toks[0]?.toLowerCase() === "no";
  const t = neg ? toks.slice(1) : toks;
  const off = neg ? 1 : 0;
  const [x, y] = t;

  if (d.mode === "if" || d.mode === "subif" || d.mode === "range") {
    const list = d.mode === "range" ? d.ctx.ifaces : [d.ctx.iface];
    const r = list.map((name) => ifCommand(world, d, name, t, off, neg, raw));
    if (r.some((v) => v === undefined)) return undefined;
    return [...new Set(r.filter(Boolean))].join("\n");
  }
  if (d.mode === "vlan") {
    if (is(x, "name")) {
      if (!y) incomplete();
      for (const v of d.ctx.vlans) d.vlans.set(v, neg ? `VLAN${String(v).padStart(4, "0")}` : y);
      return "";
    }
    return undefined;
  }
  if (d.mode === "dhcp") {
    const pool = d.pools[d.ctx.pool];
    if (is(x, "network")) {
      const addr = needIp(t[1], off + 1);
      let prefix;
      if (t[2] && t[2].startsWith("/")) prefix = needNum(t[2].slice(1), off + 2, 0, 32);
      else prefix = needMask(t[2], off + 2);
      pool.network = neg ? null : intToIp(networkInt(addr, prefix));
      pool.prefix = neg ? null : prefix;
      return "";
    }
    if (is(x, "default-router")) { pool.router = neg ? null : needIp(t[1], off + 1); return ""; }
    if (is(x, "dns-server")) { pool.dns = neg ? null : needIp(t[1], off + 1); return ""; }
    if (is(x, "domain-name") || is(x, "lease")) return "";
    return undefined;
  }
  if (d.mode === "router") {
    if (d.ctx.proto === "ospf") {
      const o = d.ospf;
      if (is(x, "network")) {
        const addr = needIp(t[1], off + 1);
        const wild = needIp(t[2], off + 2);
        if (!t[3] || !is(t[3], "area")) t[3] ? bad(off + 3) : incomplete();
        const area = needNum(t[4], off + 4, 0, 4294967295);
        if (neg) o.networks = o.networks.filter((n) => !(n.addr === addr && n.wildcard === wild));
        else if (!o.networks.some((n) => n.addr === addr && n.wildcard === wild)) o.networks.push({ addr, wildcard: wild, area });
        return "";
      }
      if (is(x, "router-id")) {
        o.routerId = neg ? null : needIp(t[1], off + 1);
        return "Reload or use \"clear ip ospf process\" command, for this to take effect";
      }
      if (is(x, "passive-interface")) {
        const ifn = canonIf(t.slice(1).join(""));
        if (!ifn || !d.ifaces[ifn]) bad(off + 1);
        if (neg) o.passive.delete(ifn);
        else o.passive.add(ifn);
        return "";
      }
      if (is(x, "default-information")) { o.defaultOriginate = !neg; return ""; }
      if (is(x, "auto-cost") || is(x, "log-adjacency-changes")) return "";
      return undefined;
    }
    const r = d.rip;
    if (is(x, "version")) { r.version = neg ? null : needNum(t[1], off + 1, 1, 2); return ""; }
    if (is(x, "network")) {
      const addr = needIp(t[1], off + 1);
      const cls = intToIp(networkInt(addr, classfulPrefix(addr)));
      if (neg) r.networks = r.networks.filter((n) => n !== cls);
      else if (!r.networks.includes(cls)) r.networks.push(cls);
      return "";
    }
    if (is(x, "auto-summary")) { r.autoSummary = !neg; return ""; }
    if (is(x, "passive-interface")) {
      const ifn = canonIf(t.slice(1).join(""));
      if (!ifn || !d.ifaces[ifn]) bad(off + 1);
      if (neg) r.passive.delete(ifn);
      else r.passive.add(ifn);
      return "";
    }
    if (is(x, "default-information")) { r.defaultOriginate = !neg; return ""; }
    return undefined;
  }
  if (d.mode === "line") {
    const L = d.lines[d.ctx.line];
    if (is(x, "password")) {
      if (neg) { L.password = null; return ""; }
      if (!t[1]) incomplete();
      L.password = t[1] === "7" || t[1] === "0" ? t[2] : t[1];
      return "";
    }
    if (is(x, "login")) {
      if (neg) { L.login = null; return ""; }
      if (t[1] && is(t[1], "local")) { L.login = "local"; return ""; }
      if (t[1]) bad(off + 1);
      L.login = "line";
      return L.password ? "" : "% Login disabled on line 1, until 'password' is set";
    }
    if (is(x, "transport") && d.ctx.line === "vty") {
      if (!t[1] || !is(t[1], "input")) t[1] ? bad(off + 1) : incomplete();
      const opts = t.slice(2).map((w) => w.toLowerCase());
      if (!opts.length) incomplete();
      for (const [i, w] of opts.entries()) if (!["ssh", "telnet", "all", "none"].includes(w)) bad(off + 2 + i);
      L.transport = neg ? "all" : opts.includes("all") ? "all" : opts.join(" ");
      return "";
    }
    if (is(x, "access-class") && d.ctx.line === "vty") {
      if (!t[1]) incomplete();
      if (!t[2] || !is(t[2], "in")) t[2] ? bad(off + 2) : incomplete();
      L.accessClass = neg ? null : t[1];
      return "";
    }
    if (is(x, "exec-timeout") || is(x, "logging")) return "";
    return undefined;
  }
  if (d.mode === "acl") {
    const acl = d.acls[d.ctx.acl];
    let k = 0;
    if (/^\d+$/.test(t[0] || "")) k = 1;
    if (neg && k) {
      const seq = Number(t[0]);
      acl.entries = acl.entries.filter((_, i) => (i + 1) * 10 !== seq);
      return "";
    }
    const ace = parseAce(acl.type, t, k);
    if (!ace.remark) acl.entries.push(ace);
    return "";
  }
  return undefined;
}

function ifCommand(world, d, name, t, off, neg, raw) {
  const ifc = d.ifaces[name];
  const [x, y] = t;
  const L = longIf(name);
  if (is(x, "shutdown")) {
    const was = ifc.shutdown;
    ifc.shutdown = !neg;
    if (was === ifc.shutdown || name.includes(".")) return "";
    if (ifc.shutdown) return `%LINK-5-CHANGED: Interface ${L}, changed state to administratively down`;
    world.cache = {};
    const up = ifaceUp(world, d, name);
    return `%LINK-5-CHANGED: Interface ${L}, changed state to ${up ? "up" : "down"}${up ? `\n%LINEPROTO-5-UPDOWN: Line protocol on Interface ${L}, changed state to up` : ""}`;
  }
  if (is(x, "description")) { ifc.desc = neg ? "" : raw.replace(/^\s*(no\s+)?\S+\s*/i, ""); return ""; }
  if (is(x, "ip")) {
    if (!y) incomplete();
    if (is(y, "address")) {
      if (d.kind === "switch" && !name.startsWith("vlan")) bad(off);
      if (neg) { ifc.ip = null; return ""; }
      if (t[2] && is(t[2], "dhcp")) bad(off + 2);
      const addr = needIp(t[2], off + 2);
      const prefix = needMask(t[3], off + 3);
      if (name.includes(".") && !ifc.encap) return "% Configuring IP routing on a LAN subinterface is only allowed if that\nsubinterface is already configured as part of an IEEE 802.10, IEEE 802.1Q,\nor ISL vLAN.";
      const n = ipToInt(addr);
      const host = (n & ~maskInt(prefix)) >>> 0;
      if (prefix < 31 && (host === 0 || host === (~maskInt(prefix) >>> 0))) return "Bad mask /" + prefix + " for address " + addr;
      for (const [other, oi] of Object.entries(d.ifaces)) {
        if (other !== name && oi.ip && inSubnet(addr, oi.ip.addr, Math.min(prefix, oi.ip.prefix))) {
          return `% ${intToIp(networkInt(addr, prefix))} overlaps with ${longIf(other)}`;
        }
      }
      ifc.ip = { addr, prefix };
      return "";
    }
    if (is(y, "access-group")) {
      const nm = t[2];
      if (!nm) incomplete();
      const dir = t[3]?.toLowerCase();
      if (!dir) incomplete();
      if (!["in", "out"].includes(dir)) bad(off + 3);
      if (dir === "in") ifc.aclIn = neg ? null : nm;
      else ifc.aclOut = neg ? null : nm;
      return "";
    }
    if (is(y, "nat")) {
      const side = t[2]?.toLowerCase();
      if (!side) incomplete();
      if (!["inside", "outside"].includes(side)) bad(off + 2);
      ifc.nat = neg ? null : side;
      return "";
    }
    if (is(y, "helper-address")) {
      const h = needIp(t[2], off + 2);
      if (neg) ifc.helpers = ifc.helpers.filter((x2) => x2 !== h);
      else if (!ifc.helpers.includes(h)) ifc.helpers.push(h);
      return "";
    }
    if (is(y, "ospf")) {
      if (t[2] && is(t[2], "cost")) { ifc.ospfCost = neg ? null : needNum(t[3], off + 3, 1, 65535); return ""; }
      if (t[2] && is(t[2], "hello-interval")) { ifc.hello = neg ? 10 : needNum(t[3], off + 3, 1, 65535); return ""; }
      bad(off + 2);
    }
    return undefined;
  }
  if (is(x, "switchport")) {
    if (d.kind !== "switch" || name.startsWith("vlan")) bad(off);
    if (!y) incomplete();
    if (is(y, "mode")) {
      const m = t[2]?.toLowerCase();
      if (!m) incomplete();
      if (neg) { ifc.mode = "dynamic"; return ""; }
      if (is(m, "access")) ifc.mode = "access";
      else if (is(m, "trunk")) ifc.mode = "trunk";
      else if (is(m, "dynamic")) ifc.mode = "dynamic";
      else bad(off + 2);
      return "";
    }
    if (is(y, "access")) {
      if (!t[2] || !is(t[2], "vlan")) t[2] ? bad(off + 2) : incomplete();
      if (neg) { ifc.accessVlan = 1; return ""; }
      const v = needNum(t[3], off + 3, 1, 4094);
      ifc.accessVlan = v;
      if (!d.vlans.has(v)) {
        d.vlans.set(v, `VLAN${String(v).padStart(4, "0")}`);
        return `% Access VLAN does not exist. Creating vlan ${v}`;
      }
      return "";
    }
    if (is(y, "trunk")) {
      const what = t[2];
      if (!what) incomplete();
      if (is(what, "native")) {
        if (!t[3] || !is(t[3], "vlan")) bad(off + 3);
        ifc.native = neg ? 1 : needNum(t[4], off + 4, 1, 4094);
        return "";
      }
      if (is(what, "allowed")) {
        if (!t[3] || !is(t[3], "vlan")) t[3] ? bad(off + 3) : incomplete();
        if (neg) { ifc.allowed = null; return ""; }
        const op = t[4];
        if (!op) incomplete();
        if (is(op, "all")) ifc.allowed = null;
        else if (is(op, "none")) ifc.allowed = new Set();
        else if (is(op, "add") || is(op, "remove") || is(op, "except")) {
          const list = parseVlanList(t[5] ?? incomplete(), off + 5);
          const cur = ifc.allowed === null ? new Set(Array.from({ length: 4094 }, (_, i) => i + 1)) : new Set(ifc.allowed);
          if (is(op, "add")) for (const v of list) cur.add(v);
          else if (is(op, "remove")) for (const v of list) cur.delete(v);
          else {
            cur.clear();
            for (let v = 1; v <= 4094; v += 1) if (!list.has(v)) cur.add(v);
          }
          ifc.allowed = cur.size === 4094 ? null : cur;
        } else ifc.allowed = parseVlanList(op, off + 4);
        return "";
      }
      if (is(what, "encapsulation")) return "";
      bad(off + 2);
    }
    if (is(y, "nonegotiate") || is(y, "port-security")) return "";
    bad(off + 1);
  }
  if (is(x, "encapsulation")) {
    if (!name.includes(".")) bad(off);
    if (!y || !/^dot1q$/i.test(y)) y ? bad(off + 1) : incomplete();
    if (neg) { ifc.encap = null; return ""; }
    const v = needNum(t[2], off + 2, 1, 4094);
    ifc.encap = { vlan: v, native: Boolean(t[3] && is(t[3], "native")) };
    return "";
  }
  if (is(x, "duplex")) {
    const m = y?.toLowerCase();
    if (!m && !neg) incomplete();
    if (!neg && !["full", "half", "auto"].includes(m)) bad(off + 1);
    ifc.duplex = neg ? "auto" : m;
    return "";
  }
  if (is(x, "speed")) {
    if (!y && !neg) incomplete();
    if (!neg && !/^(10|100|1000|auto)$/.test(y)) bad(off + 1);
    return "";
  }
  if (is(x, "spanning-tree")) {
    if (y && is(y, "portfast")) {
      ifc.portfast = !neg;
      return neg ? "" : `%Warning: portfast should only be enabled on ports connected to a single\n host. Connecting hubs, concentrators, switches, bridges, etc... to this\n interface  when portfast is enabled, can cause temporary bridging loops.\n Use with CAUTION\n\n%Portfast has been configured on ${L} but will only\n have effect when the interface is in a non-trunking mode.`;
    }
    if (y && is(y, "bpduguard")) return "";
    bad(off + 1);
  }
  if (is(x, "bandwidth") || is(x, "mtu")) { needNum(y, off + 1); return ""; }
  return undefined;
}

/* ── Exec-mode tools on a Cisco device ──────────────────────────────── */

function iosPing(world, d, dst) {
  const res = ping(world, d.id, dst, 5);
  const marks = res.map((r) => (r.ok ? "!" : r.icmp?.kind === "unreachable" ? "U" : ".")).join("");
  const okN = res.filter((r) => r.ok).length;
  const lines = ["Type escape sequence to abort.", `Sending 5, 100-byte ICMP Echos to ${dst}, timeout is 2 seconds:`, marks];
  lines.push(`Success rate is ${okN * 20} percent (${okN}/5)${okN ? ", round-trip min/avg/max = 0/1/3 ms" : ""}`);
  return lines.join("\n");
}

function traceHops(world, fromId, dst) {
  const d = world.devices[fromId];
  const hops = [];
  for (let ttl = 1; ttl <= 30; ttl += 1) {
    const trace = {};
    const pkt = { src: isL3(d) ? null : sourceIpOf(world, d), dst, proto: "udp", sport: nextPort(), dport: 33434 + ttl, ttl };
    const go = transmit(world, fromId, pkt, trace);
    if (go.type === "delivered") {
      const target = world.devices[go.dev];
      const back = transmit(world, go.dev, { src: go.pkt.dst, dst: go.pkt.src, proto: "icmp", ttl: 255 }, {});
      hops.push(back.type === "delivered" && back.dev === fromId ? { ip: go.pkt.dst, done: true } : { ip: null });
      if (target) break;
    }
    if (go.type === "dropped") {
      if (go.icmp?.from) {
        const back = transmit(world, go.dev, { src: go.icmp.from, dst: go.pkt?.src || pkt.src, proto: "icmp", ttl: 255 }, {});
        if (back.type === "delivered" && back.dev === fromId) {
          hops.push({ ip: go.icmp.from, unreachable: go.icmp.kind === "unreachable" });
          if (go.icmp.kind === "unreachable") break;
          continue;
        }
      }
      hops.push({ ip: null });
      const silent = hops.slice(-4).every((h) => !h.ip);
      if (hops.length >= 4 && silent) break;
    }
  }
  return hops;
}

function iosTrace(world, d, dst) {
  const hops = traceHops(world, d.id, dst);
  const lines = ["Type escape sequence to abort.", `Tracing the route to ${dst}`, ""];
  hops.forEach((h, i) => {
    const n = String(i + 1).padStart(2, " ");
    lines.push(h.ip ? `  ${n} ${h.ip} ${h.unreachable ? "!H  !H  !H" : "0 msec 0 msec 1 msec"}` : `  ${n}  *    *    *`);
  });
  if (hops.length && !hops[hops.length - 1].ip) lines.push("(The simulator stops after four silent hops; IOS would keep probing to 30.)");
  return lines.join("\n");
}

/* ── show ───────────────────────────────────────────────────────────── */

const pad = (s, n) => String(s).padEnd(n, " ");

function ifStatus(world, d, name) {
  const ifc = d.ifaces[name];
  if (ifc.shutdown) return ["administratively down", "down"];
  const up = ifaceUp(world, d, name);
  if (name.startsWith("vlan")) return ["up", up ? "up" : "down"];
  if (ifc.parent) return ifaceUp(world, d, ifc.parent) ? ["up", "up"] : ["down", "down"];
  if (name.startsWith("lo")) return ["up", "up"];
  return up ? ["up", "up"] : ["down", "down"];
}

function orderedIfaces(d) {
  const names = Object.keys(d.ifaces);
  const key = (n) => {
    const [t, r] = splitIf(n);
    const nums = r.replace(".", "/").split("/").map((v) => Number(v) || 0);
    const rank = { fa: 0, g: 1, s: 2, lo: 3, vlan: 4, port: 5 }[t] ?? 9;
    return [rank, ...nums];
  };
  return names.sort((a, b) => {
    const ka = key(a);
    const kb = key(b);
    for (let i = 0; i < Math.max(ka.length, kb.length); i += 1) {
      if ((ka[i] ?? -1) !== (kb[i] ?? -1)) return (ka[i] ?? -1) - (kb[i] ?? -1);
    }
    return 0;
  });
}

function show(world, d, t, off) {
  const [a, b, c] = t;
  if (!a) incomplete();
  if (is(a, "running-config")) {
    if (d.mode === "user") bad(off);
    return runningConfig(world, d);
  }
  if (is(a, "ip")) {
    if (!b) incomplete();
    if (is(b, "interface")) {
      if (c && is(c, "brief")) return showIpIntBrief(world, d);
      bad(off + 2);
    }
    if (is(b, "route")) return showIpRoute(world, d);
    if (is(b, "dhcp") && t[2] && is(t[2], "binding")) return showDhcpBinding(d);
    if (is(b, "dhcp") && t[2] && is(t[2], "pool")) return showDhcpPool(d);
    if (is(b, "nat") && t[2] && is(t[2], "translations")) return showNat(d);
    if (is(b, "ospf") && t[2] && is(t[2], "neighbor")) return showOspfNeighbor(world, d);
    if (is(b, "protocols")) return showProtocols(world, d);
    if (is(b, "arp")) return showArp(world, d);
    if (is(b, "ssh")) return d.rsaBits >= 768 ? `SSH Enabled - version ${d.sshVersion === 2 ? "2.0" : "1.99"}\nAuthentication timeout: 120 secs; Authentication retries: 3` : "%SSH has not been enabled";
    if (is(b, "access-lists")) return showAcl(d);
    bad(off + 1);
  }
  if (is(a, "arp")) return showArp(world, d);
  if (is(a, "vlan")) {
    if (d.kind !== "switch") bad(off);
    return showVlanBrief(world, d);
  }
  if (is(a, "interfaces")) {
    if (b && is(b, "trunk")) {
      if (d.kind !== "switch") bad(off + 1);
      return showTrunk(world, d);
    }
    if (b && is(b, "status")) return showIntStatus(world, d);
    if (b) {
      const ifn = canonIf(t.slice(1).join(""));
      if (!ifn || !d.ifaces[ifn]) bad(off + 1);
      return showInterface(world, d, ifn);
    }
    return orderedIfaces(d).filter((n) => !n.startsWith("vlan") || d.ifaces[n]).map((n) => showInterface(world, d, n)).join("\n");
  }
  if (is(a, "mac") || is(a, "mac-address-table")) {
    if (d.kind !== "switch") bad(off);
    return showMac(d);
  }
  if (is(a, "spanning-tree")) {
    if (d.kind !== "switch") bad(off);
    let vlan = null;
    if (b && is(b, "vlan")) vlan = needNum(c, off + 2, 1, 4094);
    return showStp(world, d, vlan);
  }
  if (is(a, "access-lists")) return showAcl(d);
  if (is(a, "cdp")) {
    if (b && is(b, "neighbors")) return showCdp(world, d);
    bad(off + 1);
  }
  if (is(a, "version")) return `Cisco IOS Software (simulated in NetLab), ${d.platform}\n${d.hostname} uptime is 12 minutes`;
  return bad(off);
}

function showIpIntBrief(world, d) {
  const rows = [`${pad("Interface", 23)}${pad("IP-Address", 16)}OK? Method Status                Protocol`];
  for (const name of orderedIfaces(d)) {
    if (d.kind === "switch" && name.startsWith("vlan") && name !== "vlan1" && !d.ifaces[name]) continue;
    const ifc = d.ifaces[name];
    const [st, pr] = ifStatus(world, d, name);
    rows.push(`${pad(longIf(name), 23)}${pad(ifc.ip ? ifc.ip.addr : "unassigned", 16)}YES ${pad(ifc.ip ? "manual" : "unset", 7)}${pad(st, 22)}${pr}`);
  }
  return rows.join("\n");
}

function maskedCount(entries) {
  return new Set(entries.map((e) => e.prefix)).size;
}

function showIpRoute(world, d) {
  if (!isL3(d)) {
    return d.defaultGateway ? `Default gateway is ${d.defaultGateway}\n\nHost               Gateway           Last Use    Total Uses  Interface\nICMP redirect cache is empty` : "Default gateway is not set\n\nHost               Gateway           Last Use    Total Uses  Interface\nICMP redirect cache is empty";
  }
  const table = routingTable(world, d);
  const lines = [
    "Codes: L - local, C - connected, S - static, R - RIP, M - mobile, B - BGP",
    "       D - EIGRP, EX - EIGRP external, O - OSPF, IA - OSPF inter area",
    "       N1 - OSPF NSSA external type 1, N2 - OSPF NSSA external type 2",
    "       E1 - OSPF external type 1, E2 - OSPF external type 2, E - EGP",
    "       i - IS-IS, L1 - IS-IS level-1, L2 - IS-IS level-2, ia - IS-IS inter area",
    "       * - candidate default, U - per-user static route, o - ODR",
    "       P - periodic downloaded static route",
    "",
  ];
  const def = table.find((r) => r.prefix === 0);
  lines.push(def ? `Gateway of last resort is ${def.nextHop || "0.0.0.0"} to network 0.0.0.0` : "Gateway of last resort is not set");
  lines.push("");
  const fmt = (r, indent) => {
    const code = r.code === "S" && r.prefix === 0 ? "S*" : r.code;
    const net = `${intToIp(r.net)}/${r.prefix}`;
    const left = pad(code, indent ? 9 : 6);
    if (r.code === "C" || r.code === "L") return `${left}${net} is directly connected, ${longIf(r.exitIf)}`;
    if (r.code === "S" && !r.nextHop) return `${left}${net} is directly connected, ${longIf(r.exitIf)}`;
    const age = r.code === "S" ? "" : ", 00:00:12";
    return `${left}${net} [${r.ad}/${r.metric}] via ${r.nextHop}${age}${r.code === "S" ? "" : `, ${longIf(r.exitIf)}`}`;
  };
  const groups = new Map();
  for (const r of table) {
    if (r.prefix === 0) continue;
    const cp = classfulPrefix(intToIp(r.net));
    const parent = `${intToIp(networkInt(r.net, cp))}/${cp}`;
    if (!groups.has(parent)) groups.set(parent, []);
    groups.get(parent).push(r);
  }
  if (def) lines.push(fmt(def, false));
  for (const [parent, entries] of [...groups.entries()].sort((x, y) => ipToInt(x[0].split("/")[0]) - ipToInt(y[0].split("/")[0]))) {
    const cp = Number(parent.split("/")[1]);
    const only = entries.length === 1 && entries[0].prefix === cp;
    if (only) { lines.push(fmt(entries[0], false)); continue; }
    const masks = maskedCount(entries);
    lines.push(masks > 1
      ? `      ${parent} is variably subnetted, ${entries.length} subnets, ${masks} masks`
      : `      ${parent} is subnetted, ${entries.length} subnets`);
    entries.sort((x, y) => x.net - y.net || y.prefix - x.prefix);
    for (const r of entries) lines.push(fmt(r, true));
  }
  return lines.join("\n");
}

function showVlanBrief(world, d) {
  const lines = [
    "VLAN Name                             Status    Ports",
    "---- -------------------------------- --------- -------------------------------",
  ];
  for (const [v, name] of [...d.vlans.entries()].sort((x, y) => x[0] - y[0])) {
    const ports = d.ports.filter((p) => effMode(world, d, p) === "access" && d.ifaces[p].accessVlan === v).map(shortIf);
    const chunks = [];
    for (let i = 0; i < ports.length; i += 4) chunks.push(ports.slice(i, i + 4).join(", "));
    lines.push(`${pad(v, 5)}${pad(name, 33)}${pad("active", 10)}${chunks[0] || ""}`);
    for (const more of chunks.slice(1)) lines.push(`${" ".repeat(48)}${more}`);
  }
  lines.push("1002 fddi-default                     act/unsup ");
  lines.push("1003 token-ring-default               act/unsup ");
  lines.push("1004 fddinet-default                  act/unsup ");
  lines.push("1005 trnet-default                    act/unsup ");
  return lines.join("\n");
}

const vlanRanges = (set) => {
  const v = [...set].sort((a, b) => a - b);
  if (!v.length) return "none";
  const out = [];
  let s = v[0];
  let p = v[0];
  for (const x of v.slice(1).concat([null])) {
    if (x !== null && x === p + 1) { p = x; continue; }
    out.push(s === p ? `${s}` : `${s}-${p}`);
    if (x !== null) { s = x; p = x; }
  }
  return out.join(",");
};

function showTrunk(world, d) {
  const trunks = d.ports.filter((p) => portUp(world, d.id, p) && effMode(world, d, p) === "trunk");
  if (!trunks.length) return "";
  const lines = ["Port        Mode             Encapsulation  Status        Native vlan"];
  for (const p of trunks) lines.push(`${pad(shortIf(p), 12)}${pad(d.ifaces[p].mode === "trunk" ? "on" : "auto", 17)}${pad("802.1q", 15)}${pad("trunking", 14)}${d.ifaces[p].native}`);
  lines.push("", "Port        Vlans allowed on trunk");
  for (const p of trunks) lines.push(`${pad(shortIf(p), 12)}${d.ifaces[p].allowed === null ? "1-4094" : vlanRanges(d.ifaces[p].allowed)}`);
  lines.push("", "Port        Vlans allowed and active in management domain");
  for (const p of trunks) lines.push(`${pad(shortIf(p), 12)}${vlanRanges([...d.vlans.keys()].filter((v) => allows(d.ifaces[p], v)))}`);
  lines.push("", "Port        Vlans in spanning tree forwarding state and not pruned");
  for (const p of trunks) lines.push(`${pad(shortIf(p), 12)}${vlanRanges([...d.vlans.keys()].filter((v) => allows(d.ifaces[p], v) && !stpBlocked(world, d, p, v)))}`);
  return lines.join("\n");
}

function showIntStatus(world, d) {
  const lines = ["Port      Name               Status       Vlan       Duplex  Speed Type"];
  for (const p of d.ports) {
    const ifc = d.ifaces[p];
    const st = ifc.shutdown ? "disabled" : portUp(world, d.id, p) ? "connected" : "notconnect";
    const vlan = effMode(world, d, p) === "trunk" ? "trunk" : String(ifc.accessVlan);
    lines.push(`${pad(shortIf(p), 10)}${pad(ifc.desc.slice(0, 18), 19)}${pad(st, 13)}${pad(vlan, 11)}${pad(ifc.duplex === "auto" ? "auto" : ifc.duplex, 8)}${pad("auto", 6)}${p.startsWith("g") ? "10/100/1000BaseTX" : "10/100BaseTX"}`);
  }
  return lines.join("\n");
}

function showInterface(world, d, name) {
  const ifc = d.ifaces[name];
  const [st, pr] = ifStatus(world, d, name);
  const lines = [`${longIf(name)} is ${st}, line protocol is ${pr}`];
  const hw = name.startsWith("lo") ? "Loopback" : name.startsWith("vlan") ? "CPU Interface" : name.startsWith("g") ? "CN Gigabit Ethernet" : "Lance";
  lines.push(`  Hardware is ${hw}${name.startsWith("lo") ? "" : `, address is ${ifc.mac} (bia ${ifc.mac})`}`);
  if (ifc.desc) lines.push(`  Description: ${ifc.desc}`);
  if (ifc.ip) lines.push(`  Internet address is ${ifc.ip.addr}/${ifc.ip.prefix}`);
  lines.push(`  MTU 1500 bytes, BW ${name.startsWith("g") ? "1000000" : "100000"} Kbit/sec, DLY ${name.startsWith("g") ? 10 : 100} usec,`);
  if (ifc.parent) lines.push(`  Encapsulation 802.1Q Virtual LAN, Vlan ID  ${ifc.encap?.vlan ?? "-"}`);
  if (!name.startsWith("lo") && !name.startsWith("vlan") && !ifc.parent) {
    const peer = linkPeer(world, d.id, name);
    const mismatch = peer && portUp(world, d.id, name) && duplexMismatch(world, d.id, name);
    const mine = effDuplex(world, d.id, name) === "half" ? "Half" : "Full";
    lines.push(`  ${mine}-duplex, ${name.startsWith("g") ? "1000Mb/s" : "100Mb/s"}`);
    const half = mine === "Half";
    lines.push(`     ${mismatch && !half ? 2412 : 0} input errors, ${mismatch && !half ? 2381 : 0} CRC, 0 frame, 0 overrun, 0 ignored`);
    lines.push(`     0 output errors, ${mismatch && half ? 1867 : 0} collisions, 0 interface resets`);
    lines.push(`     0 babbles, ${mismatch && half ? 1290 : 0} late collision, 0 deferred`);
  }
  return lines.join("\n");
}

function showMac(d) {
  const lines = ["          Mac Address Table", "-------------------------------------------", "", "Vlan    Mac Address       Type        Ports", "----    -----------       --------    -----"];
  const rows = [...d.macTable.values()].sort((a, b) => a.vlan - b.vlan || (a.port < b.port ? -1 : 1));
  for (const r of rows) lines.push(`${pad(`   ${r.vlan}`, 8)}${pad(r.mac, 18)}${pad("DYNAMIC", 12)}${shortIf(r.port)}`);
  return lines.join("\n");
}

function showStp(world, d, only) {
  const vlans = [...d.vlans.keys()].filter((v) => (only ? v === only : true)).sort((a, b) => a - b);
  if (only && !d.vlans.has(only)) return `Spanning tree instance(s) for vlan ${only} does not exist.`;
  const out = [];
  for (const v of vlans) {
    const stp = spanningTree(world, v);
    const ports = d.ports.filter((p) => portUp(world, d.id, p) && carries(world, d, p, v));
    if (!ports.length) continue;
    const rootId = stp.rootBy?.get(d.id);
    const root = rootId ? world.devices[rootId] : d;
    const rb = bridgeId(root, v);
    const me = bridgeId(d, v);
    const lines = [`VLAN${String(v).padStart(4, "0")}`, "  Spanning tree enabled protocol ieee"];
    lines.push(`  Root ID    Priority    ${rb.pr}`, `             Address     ${rb.mac}`);
    if (root === d) lines.push("             This bridge is the root");
    else lines.push(`             Cost        ${stp.cost.get(d.id)}`, `             Port        ${d.ports.indexOf(stp.rootPort.get(d.id)) + 1}(${longIf(stp.rootPort.get(d.id))})`);
    lines.push("             Hello Time  2 sec  Max Age 20 sec  Forward Delay 15 sec", "");
    lines.push(`  Bridge ID  Priority    ${me.pr}  (priority ${me.pr - v} sys-id-ext ${v})`, `             Address     ${me.mac}`, "");
    lines.push("Interface        Role Sts Cost      Prio.Nbr Type", "---------------- ---- --- --------- -------- --------------------------------");
    for (const p of ports) {
      const k = `${d.id}:${p}`;
      const role = stp.rootPort.get(d.id) === p ? "Root" : stp.blocked.has(k) ? "Altn" : "Desg";
      const sts = role === "Altn" ? "BLK" : "FWD";
      lines.push(`${pad(shortIf(p), 17)}${pad(role, 5)}${pad(sts, 4)}${pad(PORT_COST(p), 10)}${pad(`128.${d.ports.indexOf(p) + 1}`, 9)}P2p`);
    }
    out.push(lines.join("\n"));
  }
  return out.join("\n\n");
}

function aceText(acl, e) {
  const a = (s) => (s.any ? "any" : s.host ? `host ${s.addr}` : `${s.addr} ${s.wildcard}`);
  const p = (s) => (!s ? "" : s.op === "range" ? ` range ${s.value} ${s.hi}` : ` ${s.op} ${s.value}`);
  if (acl.type === "standard") return `${e.action} ${e.src.any ? "any" : e.src.host ? e.src.addr : `${e.src.addr}, wildcard bits ${e.src.wildcard}`}`;
  return `${e.action} ${e.proto} ${a(e.src)}${p(e.sport)} ${a(e.dst)}${p(e.dport)}`;
}

function showAcl(d) {
  const out = [];
  for (const [name, acl] of Object.entries(d.acls)) {
    out.push(`${acl.type === "standard" ? "Standard" : "Extended"} IP access list ${name}`);
    acl.entries.forEach((e, i) => {
      const hits = d.aclHits[`${name}:${i}`];
      out.push(`    ${(i + 1) * 10} ${aceText(acl, e)}${hits ? ` (${hits} match(es))` : ""}`);
    });
  }
  return out.join("\n");
}

function showArp(world, d) {
  const lines = ["Protocol  Address          Age (min)  Hardware Addr   Type   Interface"];
  for (const [name, ifc] of Object.entries(d.ifaces)) {
    if (ifc.ip && ifaceUp(world, d, name)) lines.push(`Internet  ${pad(ifc.ip.addr, 17)}${pad("-", 11)}${pad(d.ifaces[ifc.parent || name].mac, 16)}ARPA   ${longIf(name)}`);
  }
  for (const [ip, e] of d.arp) lines.push(`Internet  ${pad(ip, 17)}${pad("0", 11)}${pad(e.mac, 16)}ARPA   ${longIf(e.ifName)}`);
  return lines.join("\n");
}

function showDhcpBinding(d) {
  const lines = ["IP address       Client-ID/              Lease expiration        Type", "                 Hardware address"];
  for (const b of d.bindings) lines.push(`${pad(b.ip, 17)}${pad(b.mac, 24)}${pad("--", 24)}Automatic`);
  return lines.join("\n");
}

function showDhcpPool(d) {
  return Object.values(d.pools).map((p) => {
    const used = d.bindings.filter((b) => b.pool === p.name).length;
    return `Pool ${p.name} :\n Utilization mark (high/low)    : 100 / 0\n Subnet size (first/next)       : 0 / 0\n Total addresses                : ${p.prefix ? 2 ** (32 - p.prefix) - 2 : 0}\n Leased addresses               : ${used}\n Excluded addresses             : ${d.dhcpExcluded.length}\n Pending event                  : none\n\n 1 subnet is currently in the pool\n Current index        IP address range                    Leased/Excluded/Total\n ${pad(p.network || "0.0.0.0", 20)} ${p.network ? `${intToIp(ipToInt(p.network) + 1)}       - ${intToIp(ipToInt(p.network) + 2 ** (32 - p.prefix) - 2)}` : ""}  ${used}    / ${d.dhcpExcluded.length}     / ${p.prefix ? 2 ** (32 - p.prefix) - 2 : 0}`;
  }).join("\n\n");
}

function showNat(d) {
  const lines = ["Pro  Inside global         Inside local          Outside local         Outside global"];
  for (const s of d.natStatic) lines.push(`---  ${pad(s.global, 22)}${pad(s.local, 22)}${pad("---", 22)}---`);
  for (const t of d.translations) {
    const port = (ip, p) => (p === undefined || p === null ? ip : `${ip}:${p}`);
    lines.push(`${pad(t.proto, 5)}${pad(port(t.global, t.gport), 22)}${pad(port(t.local, t.lport), 22)}${pad(port(t.remote, t.rport), 22)}${port(t.remote, t.rport)}`);
  }
  return lines.join("\n");
}

function showOspfNeighbor(world, d) {
  if (!d.ospf) return "";
  const lines = ["", "Neighbor ID     Pri   State           Dead Time   Address         Interface"];
  const mine = ospfNeighbors(world, d).filter((nb) => ospfNeighbors(world, nb.dev).some((x) => x.dev === d));
  const myRid = routerIdOf(world, d);
  for (const nb of mine) {
    const peers = mine.filter((x) => x.ifName === nb.ifName);
    const all = [myRid, ...peers.map((x) => x.rid)].sort((x, y) => ipToInt(y) - ipToInt(x));
    const role = all[0] === nb.rid ? "DR" : all[1] === nb.rid ? "BDR" : "DROTHER";
    const state = role === "DROTHER" && all[0] !== myRid && all[1] !== myRid ? "2WAY/DROTHER" : `FULL/${role}`;
    lines.push(`${pad(nb.rid, 16)}${pad("  1", 6)}${pad(state, 16)}${pad("00:00:33", 12)}${pad(nb.addr, 16)}${longIf(nb.ifName)}`);
  }
  return lines.join("\n");
}

function showProtocols(world, d) {
  const out = [];
  if (d.ospf) {
    out.push(`Routing Protocol is "ospf ${d.ospf.pid}"`, `  Router ID ${routerIdOf(world, d)}`, "  Routing for Networks:");
    for (const n of d.ospf.networks) out.push(`    ${n.addr} ${n.wildcard} area ${n.area}`);
    if (d.ospf.passive.size) out.push("  Passive Interface(s):", ...[...d.ospf.passive].map((p) => `    ${longIf(p)}`));
    out.push("  Distance: (default is 110)");
  }
  if (d.rip) {
    out.push(`Routing Protocol is "rip"`, d.rip.version ? `  Default version control: send version ${d.rip.version}, receive version ${d.rip.version}` : "  Default version control: send version 1, receive any version", `  Automatic network summarization is ${d.rip.autoSummary ? "in effect" : "not in effect"}`, "  Routing for Networks:");
    for (const n of d.rip.networks) out.push(`\t${n}`);
    out.push("  Distance: (default is 120)");
  }
  return out.join("\n");
}

function showCdp(world, d) {
  const lines = [
    "Capability Codes: R - Router, T - Trans Bridge, B - Source Route Bridge",
    "                  S - Switch, H - Host, I - IGMP, r - Repeater, P - Phone",
    "Device ID    Local Intrfce   Holdtme    Capability   Platform    Port ID",
  ];
  for (const p of d.ports) {
    if (!portUp(world, d.id, p)) continue;
    const peer = linkPeer(world, d.id, p);
    const pd = peer && world.devices[peer.dev];
    if (!pd || !isCisco(pd)) continue;
    const sp = (n) => { const [t2, r] = splitIf(n); return `${{ g: "Gig", fa: "Fas", s: "Ser" }[t2] || t2} ${r}`; };
    lines.push(`${pad(pd.hostname, 13)}${pad(sp(p), 16)}${pad("163", 11)}${pad(pd.kind === "router" ? "R" : "S", 13)}${pad(pd.platform, 12)}${sp(peer.port)}`);
  }
  return lines.join("\n");
}

function runningConfig(world, d) {
  const L = ["!", "version 15.1", "no service timestamps log datetime msec", "no service timestamps debug datetime msec"];
  L.push(d.passwordEncryption ? "service password-encryption" : "no service password-encryption", "!", `hostname ${d.hostname}`, "!");
  const enc = (pw) => (d.passwordEncryption ? `7 ${type7(pw)}` : pw);
  if (d.enableSecret) L.push(`enable secret 5 ${md5crypt(d.enableSecret, saltFor(d.hostname + d.enableSecret))}`);
  if (d.enablePassword) L.push(`enable password ${enc(d.enablePassword)}`);
  if (d.enableSecret || d.enablePassword) L.push("!");
  for (const [lo, hi] of d.dhcpExcluded) L.push(`ip dhcp excluded-address ${lo}${hi !== lo ? ` ${hi}` : ""}`);
  if (d.dhcpExcluded.length) L.push("!");
  for (const p of Object.values(d.pools)) {
    L.push(`ip dhcp pool ${p.name}`);
    if (p.network) L.push(` network ${p.network} ${prefixToMask(p.prefix)}`);
    if (p.router) L.push(` default-router ${p.router}`);
    if (p.dns) L.push(` dns-server ${p.dns}`);
    L.push("!");
  }
  if (d.domainName) L.push(`ip domain-name ${d.domainName}`);
  if (d.kind === "switch" && d.ipRouting) L.push("ip routing");
  for (const [u, v] of Object.entries(d.users)) {
    L.push(`username ${u}${v.priv !== 1 ? ` privilege ${v.priv}` : ""} ${v.secret ? `secret 5 ${md5crypt(v.value, saltFor(u + v.value))}` : `password ${enc(v.value)}`}`);
  }
  if (d.rsaBits) L.push("!", `ip ssh version ${d.sshVersion || 1}`);
  L.push("!");
  for (const [v, s] of Object.entries(d.stpPriority)) L.push(`spanning-tree vlan ${v} priority ${s}`);
  if (d.kind === "switch") L.push("spanning-tree mode pvst", "!");
  for (const name of orderedIfaces(d)) {
    const ifc = d.ifaces[name];
    L.push(`interface ${longIf(name)}`);
    if (ifc.desc) L.push(` description ${ifc.desc}`);
    if (ifc.encap) L.push(` encapsulation dot1Q ${ifc.encap.vlan}${ifc.encap.native ? " native" : ""}`);
    if (d.kind === "switch" && !name.startsWith("vlan")) {
      if (ifc.mode === "access" || ifc.accessVlan !== 1) {
        if (ifc.accessVlan !== 1) L.push(` switchport access vlan ${ifc.accessVlan}`);
      }
      if (ifc.native !== 1) L.push(` switchport trunk native vlan ${ifc.native}`);
      if (ifc.allowed !== null) L.push(` switchport trunk allowed vlan ${vlanRanges(ifc.allowed)}`);
      if (ifc.mode !== "dynamic") L.push(` switchport mode ${ifc.mode}`);
      if (ifc.portfast) L.push(" spanning-tree portfast");
    }
    if (ifc.ip) L.push(` ip address ${ifc.ip.addr} ${prefixToMask(ifc.ip.prefix)}`);
    else if (d.kind === "router" || name.startsWith("vlan")) L.push(" no ip address");
    for (const h of ifc.helpers) L.push(` ip helper-address ${h}`);
    if (ifc.aclIn) L.push(` ip access-group ${ifc.aclIn} in`);
    if (ifc.aclOut) L.push(` ip access-group ${ifc.aclOut} out`);
    if (ifc.nat) L.push(` ip nat ${ifc.nat}`);
    if (ifc.ospfCost) L.push(` ip ospf cost ${ifc.ospfCost}`);
    if (ifc.hello !== 10) L.push(` ip ospf hello-interval ${ifc.hello}`);
    if (!ifc.parent && !name.startsWith("lo") && !name.startsWith("vlan")) {
      if (ifc.duplex !== "auto") L.push(` duplex ${ifc.duplex}`);
      else if (d.kind === "router") L.push(" duplex auto", " speed auto");
    }
    if (ifc.shutdown) L.push(" shutdown");
    L.push("!");
  }
  if (d.rip) {
    L.push("router rip");
    if (d.rip.version) L.push(` version ${d.rip.version}`);
    for (const p of d.rip.passive) L.push(` passive-interface ${longIf(p)}`);
    for (const n of d.rip.networks) L.push(` network ${n}`);
    if (d.rip.defaultOriginate) L.push(" default-information originate");
    if (!d.rip.autoSummary) L.push(" no auto-summary");
    L.push("!");
  }
  if (d.ospf) {
    L.push(`router ospf ${d.ospf.pid}`);
    if (d.ospf.routerId) L.push(` router-id ${d.ospf.routerId}`);
    L.push(" log-adjacency-changes");
    for (const p of d.ospf.passive) L.push(` passive-interface ${longIf(p)}`);
    for (const n of d.ospf.networks) L.push(` network ${n.addr} ${n.wildcard} area ${n.area}`);
    if (d.ospf.defaultOriginate) L.push(" default-information originate");
    L.push("!");
  }
  for (const r of d.natRules) L.push(`ip nat inside source list ${r.list} interface ${longIf(r.iface)}${r.overload ? " overload" : ""}`);
  for (const s of d.natStatic) L.push(`ip nat inside source static ${s.local} ${s.global}`);
  if (d.kind === "router") L.push("ip classless");
  if (d.defaultGateway) L.push(`ip default-gateway ${d.defaultGateway}`);
  for (const r of d.routes) L.push(`ip route ${intToIp(r.net)} ${prefixToMask(r.prefix)} ${r.nextHop || longIf(r.exitIf)}${r.ad ? ` ${r.ad}` : ""}`);
  L.push("!");
  for (const [name, acl] of Object.entries(d.acls)) {
    if (acl.named) {
      L.push(`ip access-list ${acl.type} ${name}`);
      for (const e of acl.entries) L.push(` ${aceTextConfig(acl, e)}`);
    } else for (const e of acl.entries) L.push(`access-list ${name} ${aceTextConfig(acl, e)}`);
  }
  if (Object.keys(d.acls).length) L.push("!");
  if (d.banner) L.push(`banner motd ^C${d.banner}^C`, "!");
  L.push("line con 0");
  if (d.lines.con.password) L.push(` password ${enc(d.lines.con.password)}`);
  if (d.lines.con.login) L.push(d.lines.con.login === "local" ? " login local" : " login");
  L.push("!", "line vty 0 4");
  const v = d.lines.vty;
  if (v.accessClass) L.push(` access-class ${v.accessClass} in`);
  if (v.password) L.push(` password ${enc(v.password)}`);
  if (v.login) L.push(v.login === "local" ? " login local" : " login");
  if (v.transport !== "all") L.push(` transport input ${v.transport}`);
  L.push("!", "end");
  const body = L.join("\n");
  return `Building configuration...\n\nCurrent configuration : ${body.length} bytes\n${body}`;
}

function aceTextConfig(acl, e) {
  const a = (s) => (s.any ? "any" : s.host ? `host ${s.addr}` : `${s.addr} ${s.wildcard}`);
  const p = (s) => (!s ? "" : s.op === "range" ? ` range ${s.value} ${s.hi}` : ` ${s.op} ${s.value}`);
  if (acl.type === "standard") return `${e.action} ${e.src.any ? "any" : e.src.host ? `host ${e.src.addr}` : `${e.src.addr} ${e.src.wildcard}`}`;
  return `${e.action} ${e.proto} ${a(e.src)}${p(e.sport)} ${a(e.dst)}${p(e.dport)}`;
}

/* ── Host command prompt (Packet Tracer's PC "Command Prompt") ──────── */

function ipconfigBlock(d, all = false) {
  const h = d.host;
  const port = d.ports[0];
  const name = port.startsWith("wlan") ? "Wireless0" : "FastEthernet0";
  const lines = ["", `${name} Connection:(default port)`, "", "   Connection-specific DNS Suffix..: "];
  if (all) {
    lines.push(`   Physical Address................: ${d.ifaces[port].mac.toUpperCase()}`);
    lines.push(`   DHCP Enabled....................: ${h.dhcp ? "Yes" : "No"}`);
  }
  lines.push(`   IPv4 Address....................: ${h.ip || "0.0.0.0"}`);
  lines.push(`   Subnet Mask.....................: ${h.prefix !== null && h.ip ? prefixToMask(h.prefix) : "0.0.0.0"}`);
  lines.push(`   Default Gateway.................: ${h.gateway || "0.0.0.0"}`);
  if (all) {
    lines.push(`   DHCP Servers....................: ${h.dhcpServer || "0.0.0.0"}`);
    lines.push(`   DNS Servers.....................: ${h.dns || "0.0.0.0"}`);
  }
  return lines.join("\n");
}

const HOST_HELP = [
  "Commands this simulated PC understands:",
  "  ipconfig | ipconfig /all          show the IP configuration",
  "  ipconfig <ip> <mask> [gateway]    set a static address (as in Packet Tracer)",
  "  ipconfig /renew | /release        ask DHCP for an address, or give it back",
  "  ipconfig /dns <server>            set the DNS server (NetLab shortcut)",
  "  ping <host> | ping -n <count> <host>",
  "  tracert <host>                    every router on the path",
  "  arp -a | arp -d                   the ARP cache",
  "  nslookup <name>                   ask the DNS server",
  "  curl http://<host>/               fetch a web page (TCP 80)",
  "  ssh -l <user> <host> | ssh <user>@<host>",
  "  telnet <host>",
];

function execHost(world, d, line) {
  const raw = line.trim();
  if (!raw) return "";
  const toks = raw.split(/\s+/);
  const cmd = toks[0].toLowerCase();
  const h = d.host;

  if (cmd === "help" || cmd === "?") return HOST_HELP.concat(d.kind === "laptop" ? ["  wifi scan | wifi connect <ssid> [passphrase] | wifi status"] : []).join("\n");

  if (cmd === "ipconfig") {
    const arg = toks[1]?.toLowerCase();
    if (!arg) return ipconfigBlock(d);
    if (arg === "/all") return ipconfigBlock(d, true);
    if (arg === "/renew") {
      const r = dhcpRenew(world, d);
      return r.ok ? ipconfigBlock(d) : "DHCP request failed. \n" + ipconfigBlock(d);
    }
    if (arg === "/release") {
      h.ip = null; h.prefix = null; h.gateway = null; h.dns = null; h.dhcp = true; h.apipa = false; h.dhcpServer = null;
      return ipconfigBlock(d);
    }
    if (arg === "/dns") {
      if (!toks[2] || !isIp(toks[2])) return "Invalid Command.";
      h.dns = toks[2];
      return `DNS server set to ${toks[2]}`;
    }
    if (isIp(toks[1])) {
      const p = toks[2] ? maskToPrefix(toks[2]) : null;
      if (p === null) return "Invalid Command.";
      if (toks[3] && !isIp(toks[3])) return "Invalid Command.";
      if (p < 31) {
        const hostBits = (ipToInt(toks[1]) & ~maskInt(p)) >>> 0;
        if (hostBits === 0) return `${toks[1]} is the network address of ${intToIp(networkInt(toks[1], p))}/${p}. Choose a usable host address.`;
        if (hostBits === (~maskInt(p) >>> 0)) return `${toks[1]} is the broadcast address of ${intToIp(networkInt(toks[1], p))}/${p}. Choose a usable host address.`;
      }
      h.ip = toks[1]; h.prefix = p; h.gateway = toks[3] || null; h.dhcp = false; h.apipa = false; h.dhcpServer = null;
      return "";
    }
    return "Invalid Command.";
  }

  if (cmd === "ping") {
    let count = 4;
    let target = toks[1];
    if (toks[1] === "-n") { count = Math.min(10, Math.max(1, Number(toks[2]) || 4)); target = toks[3]; }
    if (!target) return "Invalid Command.";
    // Loopback never leaves the machine: it answers even with the cable unplugged.
    if (/^127\.\d+\.\d+\.\d+$/.test(target) || target.toLowerCase() === "localhost") {
      const lo = target.toLowerCase() === "localhost" ? "127.0.0.1" : target;
      return ["", `Pinging ${lo} with 32 bytes of data:`, "", ...Array.from({ length: count }, () => `Reply from ${lo}: bytes=32 time<1ms TTL=128`),
        "", `Ping statistics for ${lo}:`, `    Packets: Sent = ${count}, Received = ${count}, Lost = 0 (0% loss),`].join("\n");
    }
    const res = resolveName(world, d.id, target);
    if (!res.ok) return `Ping request could not find host ${target}. Please check the name and try again.`;
    const ip = res.ip;
    const results = ping(world, d.id, ip, count);
    const lines = ["", `Pinging ${ip} with 32 bytes of data:`, ""];
    for (const r of results) {
      if (r.ok) lines.push(`Reply from ${ip}: bytes=32 time<1ms TTL=${r.ttl}`);
      else if (r.icmp?.kind === "unreachable") lines.push(`Reply from ${r.icmp.from}: Destination host unreachable.`);
      else if (r.icmp?.kind === "ttl") lines.push(`Reply from ${r.icmp.from}: TTL expired in transit.`);
      else lines.push("Request timed out.");
    }
    const okN = results.filter((r) => r.ok || r.icmp).length;
    const rcv = results.filter((r) => r.ok || r.icmp).length;
    lines.push("", `Ping statistics for ${ip}:`, `    Packets: Sent = ${count}, Received = ${rcv}, Lost = ${count - rcv} (${Math.round(((count - rcv) / count) * 100)}% loss),`);
    if (results.some((r) => r.ok)) lines.push("Approximate round trip times in milli-seconds:", "    Minimum = 0ms, Maximum = 1ms, Average = 0ms");
    void okN;
    return lines.join("\n");
  }

  if (cmd === "tracert") {
    const target = toks[1];
    if (!target) return "Invalid Command.";
    const res = resolveName(world, d.id, target);
    if (!res.ok) return `Unable to resolve target system name ${target}.`;
    const hops = traceHops(world, d.id, res.ip);
    const lines = ["", `Tracing route to ${res.ip} over a maximum of 30 hops: `, ""];
    hops.forEach((hp, i) => {
      const n = String(i + 1).padStart(3, " ");
      lines.push(hp.ip ? `${n}   0 ms      0 ms      1 ms      ${hp.ip}${hp.unreachable ? "  reports: Destination host unreachable." : ""}` : `${n}   *         *         *         Request timed out.`);
    });
    if (hops.length && !hops[hops.length - 1].ip) lines.push("", "(The simulator stops after four silent hops; tracert would keep going to 30.)");
    else lines.push("", "Trace complete.");
    return lines.join("\n");
  }

  if (cmd === "arp") {
    const flag = toks[1]?.toLowerCase();
    if (flag === "-d") { d.arp.clear(); return ""; }
    if (flag !== "-a") return "Invalid Command.";
    if (!d.arp.size) return "No ARP Entries Found";
    const lines = [`  Internet Address      Physical Address      Type`];
    for (const [ip, e] of d.arp) lines.push(`  ${pad(ip, 22)}${pad(e.mac, 22)}dynamic`);
    return lines.join("\n");
  }

  if (cmd === "nslookup") {
    const name = toks[1];
    if (!name) return "Invalid Command.";
    const r = resolveName(world, d.id, name);
    if (!h.dns) return "*** Can't find server name for address 127.0.0.1: No DNS server configured";
    if (!r.ok && !r.nx) return `Server: [${h.dns}]\nAddress:  ${h.dns}\n\nDNS request timed out.\n    timeout was 15000 milli seconds.\n*** Request to [${h.dns}] timed-out`;
    if (r.nx) return `Server: [${h.dns}]\nAddress:  ${h.dns}\n\n*** [${h.dns}] can't find ${name}: Non-existent domain`;
    return `Server: [${h.dns}]\nAddress:  ${h.dns}\n\nNon-authoritative answer:\nName:   ${name.toLowerCase()}\nAddress:  ${r.ip}`;
  }

  if (cmd === "curl") {
    const url = toks.find((x, i) => i > 0 && !x.startsWith("-"));
    if (!url) return "curl: try 'curl --help' for more information";
    const m = /^(?:http:\/\/)?([^/:]+)(?::(\d+))?/i.exec(url);
    if (!m) return "curl: (3) URL rejected: Malformed input to a URL function";
    const port = Number(m[2] || 80);
    const res = resolveName(world, d.id, m[1]);
    if (!res.ok) return `curl: (6) Could not resolve host: ${m[1]}`;
    const r = tcpConnect(world, d.id, res.ip, port);
    if (r.ok) {
      const target = r.payload;
      return target.web || `<html><head><title>${target.hostname}</title></head><body>It works.</body></html>`;
    }
    if (r.refused) return `curl: (7) Failed to connect to ${m[1]} port ${port} after 2 ms: Couldn't connect to server`;
    return `curl: (28) Failed to connect to ${m[1]} port ${port} after 21045 ms: Timed out`;
  }

  if (cmd === "ssh" || cmd === "telnet") {
    let user = null;
    let target = null;
    if (cmd === "ssh") {
      const li = toks.indexOf("-l");
      if (li > 0) { user = toks[li + 1]; target = toks.find((x, i) => i > 0 && i !== li && i !== li + 1 && !x.startsWith("-")); }
      else {
        const at = toks.slice(1).find((x) => x.includes("@"));
        if (at) [user, target] = at.split("@");
        else target = toks[1];
      }
      if (!user || !target) return "usage: ssh -l <username> <host>   or   ssh <username>@<host>";
    } else target = toks[1];
    if (!target) return "Invalid Command.";
    const res = resolveName(world, d.id, target);
    if (!res.ok) return cmd === "ssh" ? `ssh: Could not resolve hostname ${target}: No such host is known.` : "% Unknown command or computer name, or unable to find computer address";
    const port = cmd === "ssh" ? 22 : 23;
    const r = tcpConnect(world, d.id, res.ip, port);
    if (!r.ok) {
      if (cmd === "telnet") return r.refused ? `Trying ${res.ip} ...\n% Connection refused by remote host` : `Trying ${res.ip} ...\n% Connection timed out; remote host not responding`;
      return r.refused ? `ssh: connect to host ${res.ip} port 22: Connection refused` : `ssh: connect to host ${res.ip} port 22: Connection timed out`;
    }
    const target2 = r.payload;
    if (isHostKind(target2.kind)) return cmd === "ssh" ? `${user}@${res.ip}'s password:\n(NetLab stops at the password prompt: the SSH session to ${target2.label} is open.)` : `Trying ${res.ip} ...Open`;
    const login = vtyLogin(target2, port, user);
    if (!login.ok) {
      if (login.why === "Password required, but none set") return `Trying ${res.ip} ...Open\n\n[Connection to ${res.ip} closed by foreign host]\nPassword required, but none set`;
      return cmd === "ssh" ? `${user}@${res.ip}: Permission denied (${login.why}).` : `Trying ${res.ip} ...Open\n% Login invalid: ${login.why}`;
    }
    const banner = target2.banner ? `\n${target2.banner}\n` : "";
    return `${cmd === "ssh" ? `${user}@${res.ip}'s password:` : `Trying ${res.ip} ...Open`}${banner}\n(NetLab stops at the login: the ${cmd === "ssh" ? "SSH" : "Telnet"} session to ${target2.hostname} is open. Configure it from its own tab.)`;
  }

  if (cmd === "wifi" && d.kind === "laptop") {
    const sub = toks[1]?.toLowerCase();
    if (sub === "scan") {
      const aps = world.order.map((id) => world.devices[id]).filter((x) => x.kind === "ap" && x.wifi?.ssid && (!d.wifiSpec.inRange || d.wifiSpec.inRange.includes(x.id)));
      if (!aps.length) return "No wireless networks found.";
      const lines = ["SSID                  BSSID            Band     Ch   Security    Signal"];
      for (const ap of aps) {
        const sig = ap.signal?.[d.id] ?? d.signal?.[ap.id] ?? -55;
        lines.push(`${pad(ap.wifi.ssid, 22)}${pad(ap.ifaces.port0.mac, 17)}${pad(`${ap.wifi.band} GHz`, 9)}${pad(ap.wifi.channel, 5)}${pad(ap.wifi.security.toUpperCase(), 12)}${sig} dBm`);
      }
      return lines.join("\n");
    }
    if (sub === "connect") {
      const ssid = toks[2];
      if (!ssid) return "usage: wifi connect <ssid> [passphrase]";
      d.wifiCreds = { ssid, passphrase: toks.slice(3).join(" ") || null };
      world.cache = {};
      const ap = associatedAp(world, d);
      if (!ap) {
        const cand = world.order.map((id) => world.devices[id]).find((x) => x.kind === "ap" && x.wifi?.ssid === ssid);
        const why = cand ? wifiAccepts(cand, d, d.wifiCreds).why : "ssid";
        d.wifiCreds = null;
        const msg = {
          ssid: `No network named "${ssid}" is in range.`,
          band: `"${ssid}" is on the ${cand?.wifi.band} GHz band, which this laptop's adapter does not support.`,
          range: `"${ssid}" is too far away: the signal is too weak to associate.`,
          security: `"${ssid}" uses ${cand?.wifi.security.toUpperCase()}, which this laptop's adapter does not support.`,
          passphrase: `Could not connect to "${ssid}": the passphrase was rejected (4-way handshake failed).`,
        }[why];
        return msg;
      }
      let out = `Connected to "${ssid}" (${ap.wifi.band} GHz, channel ${ap.wifi.channel}, ${ap.wifi.security.toUpperCase()}).`;
      if (h.dhcp || !h.ip) {
        const r = dhcpRenew(world, d);
        out += r.ok ? `\nDHCP: leased ${h.ip}/${h.prefix}, gateway ${h.gateway || "none"}.` : `\nDHCP: no server answered; using ${h.ip} (APIPA).`;
      }
      return out;
    }
    if (sub === "status") {
      const ap = associatedAp(world, d);
      return ap ? `Connected to "${ap.wifi.ssid}" via ${ap.id} (${ap.wifi.band} GHz, channel ${ap.wifi.channel}).` : "Not connected.";
    }
    return "usage: wifi scan | wifi connect <ssid> [passphrase] | wifi status";
  }

  return "Invalid Command.";
}

/* ── Wireless access point settings console ─────────────────────────── */

function execAp(world, d, line) {
  const raw = line.trim();
  if (!raw) return "";
  const toks = raw.split(/\s+/);
  const cmd = toks[0].toLowerCase();
  const w = d.wifi;
  const rest = raw.slice(toks[0].length).trim();
  if (cmd === "help" || cmd === "?") {
    return [
      "Wireless settings (this AP's web page, typed as commands):",
      "  show                              current wireless settings",
      "  ssid <name>                       network name",
      "  security open|wpa2|wpa3|wpa2/wpa3",
      "  passphrase <8-63 characters>",
      "  band 2.4|5|6                      radio band in GHz",
      "  channel <n>                       channel within that band",
    ].join("\n");
  }
  if (cmd === "show") {
    return `SSID ........... ${w.ssid || "(not set: radio off)"}\nBSSID .......... ${d.ifaces.port0.mac}\nSecurity ....... ${w.security.toUpperCase()}\nPassphrase ..... ${w.passphrase ? "*".repeat(w.passphrase.length) : "(none)"}\nBand ........... ${w.band} GHz\nChannel ........ ${w.channel}`;
  }
  if (cmd === "ssid") {
    if (!rest || rest.length > 32) return "SSID must be 1-32 characters.";
    w.ssid = rest;
    return `SSID set to "${rest}".`;
  }
  if (cmd === "security") {
    const m = rest.toLowerCase();
    if (!["open", "wpa2", "wpa3", "wpa2/wpa3"].includes(m)) return "Choose one of: open, wpa2, wpa3, wpa2/wpa3.";
    if (w.band === "6" && m !== "wpa3") return "Rejected: the 6 GHz band requires WPA3 (Wi-Fi 6E and 7 do not allow open or WPA2 networks on 6 GHz).";
    w.security = m;
    return `Security set to ${m.toUpperCase()}.${m === "open" ? " Warning: anyone in range can join and read unencrypted traffic." : ""}`;
  }
  if (cmd === "passphrase") {
    if (rest.length < 8 || rest.length > 63) return "A WPA passphrase must be 8-63 characters.";
    w.passphrase = rest;
    return "Passphrase set.";
  }
  if (cmd === "band") {
    if (!CHANNELS[rest]) return "Choose 2.4, 5 or 6.";
    if (rest === "6" && w.security !== "wpa3") return "Rejected: set security to wpa3 first. The 6 GHz band requires WPA3.";
    w.band = rest;
    w.channel = CHANNELS[rest][0];
    return `Band set to ${rest} GHz; channel reset to ${w.channel}.`;
  }
  if (cmd === "channel") {
    const n = Number(rest);
    if (!CHANNELS[w.band].includes(n)) return `Channel ${rest} is not valid on ${w.band} GHz. Valid: ${w.band === "6" ? "1, 5, 9 … 233" : CHANNELS[w.band].join(", ")}.`;
    w.channel = n;
    return `Channel set to ${n}.`;
  }
  return "Unknown setting. Type help.";
}

/* ════════════════════════════════════════════════════════════════════════
   GOALS
   ════════════════════════════════════════════════════════════════════════ */

function routeDesc(world, d, prefix) {
  const [net, len] = prefix.split("/");
  return routingTable(world, d).find((r) => r.net === ipToInt(net) && r.prefix === Number(len)) || null;
}

/**
 * Check every goal against the live network. Each result is
 * { ok, label, detail } and the lab is solved when all are ok.
 */
export function checkGoals(world, goals = []) {
  // Time passes while a learner works: hosts left on APIPA retry DHCP, as
  // Windows does every few minutes.
  for (const id of world.order) {
    const d = world.devices[id];
    if (isHostKind(d.kind) && d.host.dhcp && (!d.host.ip || d.host.apipa)) dhcpRenew(world, d);
  }
  world.cache = {};
  return goals.map((g) => {
    const res = evalGoal(world, g);
    return { label: g.label || describeGoal(g), ok: res.ok, detail: res.detail || "" };
  });
}

function describeGoal(g) {
  switch (g.type) {
    case "ping": return `${g.from} can${g.expect === false ? "not" : ""} ping ${g.to}`;
    case "tcp": return `${g.from} can${g.expect === false ? "not" : ""} reach ${g.to} on TCP ${g.port}`;
    case "ssh": return `${g.from} can${g.expect === false ? "not" : ""} SSH to ${g.to}`;
    case "telnet": return `${g.from} can${g.expect === false ? "not" : ""} Telnet to ${g.to}`;
    case "dhcp": return `${g.host} gets an address by DHCP${g.subnet ? ` in ${g.subnet}` : ""}`;
    case "dns": return `${g.from} resolves ${g.name}`;
    case "vlan": return `${g.device} ${g.ports.join(", ")} in VLAN ${g.vlan}`;
    case "trunk": return `${g.device} ${g.port} trunks VLANs ${(g.vlans || []).join(", ")}`;
    case "route": return `${g.device} has a route to ${g.prefix}`;
    case "root": return `${g.device} is the root bridge for VLAN ${g.vlan}`;
    case "wifi": return `${g.client} is connected to Wi-Fi`;
    case "channels": return `${g.aps.join(", ")} use non-overlapping channels`;
    case "secure": return `${g.device} is hardened`;
    case "hostname": return `${g.device} is named ${g.name}`;
    case "ip": return `${g.device} ${g.iface} is ${g.address}`;
    case "noLoss": return `${g.from} pings ${g.to} with no loss`;
    case "ap": return `${g.device} is configured as required`;
    default: return g.type;
  }
}

function evalGoal(world, g) {
  const d = world.devices[g.device || g.from || g.host || g.client];
  const expect = g.expect !== false;
  switch (g.type) {
    case "ping":
    case "noLoss": {
      const res = resolveName(world, g.from, g.to);
      if (!res.ok) return { ok: !expect && g.type === "ping", detail: `${g.from} cannot resolve ${g.to}` };
      const r = ping(world, g.from, res.ip, 4);
      const ok = g.type === "noLoss" ? r.slice(1).every((x) => x.ok) : r.some((x) => x.ok);
      return { ok: ok === expect, detail: ok ? "replies received" : "no replies" };
    }
    case "tcp":
    case "ssh":
    case "telnet": {
      const port = g.type === "ssh" ? 22 : g.type === "telnet" ? 23 : g.port;
      const res = resolveName(world, g.from, g.to);
      if (!res.ok) return { ok: !expect, detail: "name does not resolve" };
      const r = tcpConnect(world, g.from, res.ip, port);
      let ok = r.ok;
      if (ok && (port === 22 || port === 23) && !isHostKind(r.payload.kind)) ok = vtyLogin(r.payload, port, g.user || null).ok;
      return { ok: ok === expect };
    }
    case "dhcp": {
      const r = dhcpRenew(world, d);
      const ok = r.ok && (!g.subnet || inSubnet(d.host.ip, ...g.subnet.split("/").map((v, i) => (i ? Number(v) : v))));
      return { ok: ok === expect, detail: r.ok ? `got ${d.host.ip}` : "DHCP failed" };
    }
    case "dns": {
      const r = resolveName(world, g.from, g.name);
      return { ok: r.ok && (!g.address || r.ip === g.address) };
    }
    case "vlan":
      return { ok: g.ports.every((p) => { const n = canonIf(p); return d.ifaces[n] && effMode(world, d, n) === "access" && d.ifaces[n].accessVlan === g.vlan; }) };
    case "trunk": {
      const n = canonIf(g.port);
      if (!d.ifaces[n] || !portUp(world, d.id, n) || effMode(world, d, n) !== "trunk") return { ok: false };
      return { ok: (g.vlans || []).every((v) => allows(d.ifaces[n], v) && d.vlans.has(v)) && (!g.only || [...d.vlans.keys()].filter((v) => allows(d.ifaces[n], v)).every((v) => g.only.includes(v))) };
    }
    case "route": {
      const r = routeDesc(world, d, g.prefix);
      const ok = Boolean(r) && (!g.source || r.code.startsWith(g.source));
      return { ok: ok === expect };
    }
    case "root": {
      const stp = spanningTree(world, g.vlan);
      return { ok: stp.rootBy?.get(d.id) === d.id && [...stp.rootBy.values()].every((v) => v === d.id) };
    }
    case "wifi":
      return { ok: Boolean(associatedAp(world, d)) === expect };
    case "channels": {
      const aps = g.aps.map((id) => world.devices[id]);
      const allowed = g.allowed || [1, 6, 11];
      const okSet = aps.every((ap) => ap.wifi.band !== "2.4" || allowed.includes(ap.wifi.channel));
      const pairs = g.neighbors || [];
      const okPairs = pairs.every(([x, y]) => {
        const A = world.devices[x].wifi;
        const B = world.devices[y].wifi;
        return A.band !== B.band || A.channel !== B.channel;
      });
      return { ok: okSet && okPairs };
    }
    case "secure": {
      const req = g.require || [];
      const v = d.lines.vty;
      const checks = {
        enableSecret: Boolean(d.enableSecret),
        noEnablePassword: !d.enablePassword,
        passwordEncryption: d.passwordEncryption,
        sshOnly: v.transport === "ssh" && v.login === "local" && Object.keys(d.users).length > 0 && d.rsaBits >= 1024,
        sshV2: d.sshVersion === 2,
        banner: Boolean(d.banner),
        consolePassword: Boolean(d.lines.con.login && (d.lines.con.password || d.lines.con.login === "local")),
        vtyAcl: Boolean(v.accessClass),
        secretUsers: Object.values(d.users).every((u) => u.secret),
      };
      const failed = req.filter((k) => !checks[k]);
      return { ok: failed.length === 0, detail: failed.join(", ") };
    }
    case "hostname":
      return { ok: d.hostname === g.name };
    case "ap": {
      // An access point's wireless settings: any of ssid, security, band, channel.
      const w = d.wifi || {};
      const bad = ["ssid", "security", "band", "channel"].filter((k) => g[k] !== undefined && String(w[k]) !== String(g[k]));
      return { ok: bad.length === 0, detail: bad.join(", ") };
    }
    case "ip": {
      if (isHostKind(d.kind)) {
        const [addr, pre] = g.address.split("/");
        return { ok: d.host.ip === addr && d.host.prefix === Number(pre) };
      }
      const n = canonIf(g.iface);
      const ifc = d.ifaces[n];
      const [addr, pre] = g.address.split("/");
      return { ok: Boolean(ifc?.ip && ifc.ip.addr === addr && ifc.ip.prefix === Number(pre)) };
    }
    default:
      return { ok: false, detail: `unknown goal ${g.type}` };
  }
}

/** Run a list of commands per device, in order. Used by the validator and tests. */
export function runScript(world, script) {
  const transcript = [];
  for (const step of script) {
    const [id, line] = step;
    const p = promptOf(world, id);
    const r = exec(world, id, line);
    transcript.push({ id, prompt: p, line, output: r.output });
  }
  return transcript;
}

export const NETLAB_DEVICE_KINDS = ["router", "switch", "pc", "server", "laptop", "ap"];
export { winMac };

/** Every cable with its state, for drawing the topology: up, down or admin-down. */
export function linkStates(world) {
  return world.linkList.map((l) => {
    const a = world.devices[l.a.dev];
    const b = world.devices[l.b.dev];
    const shut = a.ifaces[l.a.port]?.shutdown || b.ifaces[l.b.port]?.shutdown;
    return { a: l.a, b: l.b, up: !shut && portUp(world, l.a.dev, l.a.port), shut: Boolean(shut) };
  });
}

/** Wireless associations, drawn as dashed lines from each laptop to its AP. */
export function wifiStates(world) {
  return world.order
    .map((id) => world.devices[id])
    .filter((d) => d.kind === "laptop")
    .map((d) => ({ client: d.id, ap: associatedAp(world, d)?.id || null }));
}
