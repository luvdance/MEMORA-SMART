/**
 * FINAL CERTIFICATION EXAM — COMPUTER NETWORKING
 *
 * The test specification, in the same shape as the other blueprints, so the
 * assembler and grader treat every exam identically: the SHAPE of every paper
 * is fixed here, the CONTENT is drawn per candidate from ./bank.js.
 *
 * Six domains follow the course's modules. Items are judgement,
 * troubleshooting and calculation questions; every subnetting calculation
 * was worked with the same arithmetic the course's netCalc exercises check
 * (lib/academy/network/calc.js).
 */

export const DOMAINS = [
  {
    id: "n1-foundations",
    name: "Network foundations and communication models",
    short: "Foundations",
    items: { core: 4, advanced: 1 },
    covers: [
      "Network types, components, topologies and architectures",
      "Data communication, media, bandwidth, latency and switching",
      "The OSI and TCP/IP models, encapsulation and PDUs",
    ],
    review: ["nw-m1-intro", "nw-m2-models"],
  },
  {
    id: "n2-addressing",
    name: "IP addressing and subnetting",
    short: "Addressing",
    items: { core: 4, advanced: 1 },
    covers: [
      "IPv4 structure, binary, public, private and special addresses",
      "Masks, CIDR, network, broadcast and usable hosts",
      "FLSM, VLSM, summarisation and IPv6",
    ],
    review: ["nw-m3-subnetting"],
  },
  {
    id: "n3-protocols",
    name: "Protocols and network services",
    short: "Protocols",
    items: { core: 4, advanced: 1 },
    covers: [
      "TCP, UDP, ports and the three-way handshake",
      "Application protocols: HTTP(S), SSH, email, SNMP, NTP",
      "DNS, DHCP, NAT, PAT, ARP and ICMP",
    ],
    review: ["nw-m4-protocols"],
  },
  {
    id: "n4-infrastructure",
    name: "Switching, routing, wireless and internet infrastructure",
    short: "Infrastructure",
    items: { core: 4, advanced: 1 },
    covers: [
      "Ethernet, MAC tables, VLANs, trunks, STP and inter-VLAN routing",
      "Routing tables, static, RIP, OSPF and BGP",
      "Wi-Fi standards, channels, security, ISPs, IXPs and CDNs",
    ],
    review: ["nw-m5-switching-routing", "nw-m6-wireless"],
  },
  {
    id: "n5-admin-security",
    name: "Linux administration and network security",
    short: "Admin & security",
    items: { core: 4, advanced: 1 },
    covers: [
      "Linux networking, services, SSH, permissions and UFW",
      "Segmentation, firewalls, ACLs, VPNs and PKI",
      "Common attacks, detection, hardening and incident response",
    ],
    review: ["nw-m7-linux", "nw-m8-security"],
  },
  {
    id: "n6-operations",
    name: "Troubleshooting, enterprise design and professional practice",
    short: "Operations",
    items: { core: 4, advanced: 1 },
    covers: [
      "The troubleshooting method, faults, loss, latency and monitoring",
      "Enterprise design, redundancy, QoS, cloud and containers",
      "Automation, change management and the capstone network",
    ],
    review: ["nw-m9-troubleshooting", "nw-m10-advanced", "nw-m11-capstone"],
  },
];

export const BLUEPRINT = {
  id: "mst-nw-final",
  version: "2026.1",
  courseId: "networking",
  courseCode: "NW-101",
  courseTitle: "Computer Networking",
  title: "Memora Smart Certification — Computer Networking",
  subtitle: "Foundations · Addressing · Protocols · Infrastructure · Admin & security · Operations",
  /** What the briefing page says about the kinds of question on the paper. */
  briefingNote:
    "Questions test practical networking judgement: reading addresses and routing tables, choosing protocols and designs, interpreting command output and captures, securing devices and finding faults. Some ask you to subnet by hand: network and broadcast addresses, usable hosts, masks and summary routes, worked exactly as in the course.",

  requiresModules: [
    "nw-m1-intro",
    "nw-m2-models",
    "nw-m3-subnetting",
    "nw-m4-protocols",
    "nw-m5-switching-routing",
    "nw-m6-wireless",
    "nw-m7-linux",
    "nw-m8-security",
    "nw-m9-troubleshooting",
    "nw-m10-advanced",
    "nw-m11-capstone",
  ],

  domains: DOMAINS,
  passMark: 70,
  domainMinimum: 50,
  durationMinutes: 60,
  attemptLimit: null,
  /** No case studies on this paper: each question stands alone. */
  caseRange: { min: 0, max: 0 },

  certificate: {
    issuer: "Memora Smart Technologies",
    name: "Computer Networking",
    covers: "Network models • IP addressing & subnetting • Protocols & services • Switching & routing • Wireless & Linux • Security & troubleshooting",
    idFormat: "MST-CERT-2026-000001",
  },
};

export default BLUEPRINT;
