/**
 * COMPUTER NETWORKING · CAPSTONE · DESIGN, IMPLEMENTATION AND SECURITY OF AN ENTERPRISE NETWORK
 *
 * Curriculum 11.1 – 11.13 and the deliverables (11.P). The learner acts as
 * the network engineer for a 100-employee organisation with five
 * departments (Administration, Human Resources, Finance, Information
 * Technology and Customer Service) and builds its network step by step on
 * one consistent design: topology, devices, addressing, VLANs, router and
 * switch configuration, inter-VLAN routing, DHCP and DNS, wireless,
 * firewall rules and access control, secure administration, monitoring,
 * testing with deliberate faults, and documentation.
 *
 * Every lab uses the same addressing plan, worked out in Lesson 1, and only
 * commands taught in Modules 1 to 10 (plus switchport trunk allowed vlan,
 * taught here before its lab).
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

import { dec } from "./nw-kit.js";

export const SECTION_ID = "nw-s11-capstone";
const M = "nw-m11-capstone";

/* The organisation's plan, from Lesson 1. */
const VL = {
  admin: { id: 10, name: "ADMIN", net: "10.10.0.64", mask: "255.255.255.224", gw: "10.10.0.65", pc: "10.10.0.70/27" },
  hr: { id: 20, name: "HR", net: "10.10.0.128", mask: "255.255.255.240", gw: "10.10.0.129", pc: "10.10.0.135/28" },
  fin: { id: 30, name: "FINANCE", net: "10.10.0.96", mask: "255.255.255.224", gw: "10.10.0.97", pc: "10.10.0.100/27" },
  it: { id: 40, name: "IT", net: "10.10.0.144", mask: "255.255.255.240", gw: "10.10.0.145", pc: "10.10.0.150/28" },
  cs: { id: 50, name: "CUSTSERV", net: "10.10.0.0", mask: "255.255.255.192", gw: "10.10.0.1", pc: "10.10.0.10/26" },
  srv: { id: 60, name: "SERVERS", net: "10.10.0.160", mask: "255.255.255.240", gw: "10.10.0.161" },
};
const DEPTS = ["admin", "hr", "fin", "it", "cs"];
const PCS = [
  { id: "ADMIN-PC", kind: "pc", x: 8, y: 48, ip: VL.admin.pc, gateway: VL.admin.gw, note: "VLAN 10" },
  { id: "HR-PC", kind: "pc", x: 27, y: 52, ip: VL.hr.pc, gateway: VL.hr.gw, note: "VLAN 20" },
  { id: "FIN-PC", kind: "pc", x: 46, y: 54, ip: VL.fin.pc, gateway: VL.fin.gw, note: "VLAN 30" },
  { id: "IT-PC", kind: "pc", x: 65, y: 52, ip: VL.it.pc, gateway: VL.it.gw, note: "VLAN 40" },
  { id: "CS-PC", kind: "pc", x: 84, y: 48, ip: VL.cs.pc, gateway: VL.cs.gw, note: "VLAN 50" },
];
const PC_LINKS = PCS.map((p, i) => [`${p.id}:fa0`, `SW-ACCESS1:fa0/${i + 1}`]);
const CORE = { id: "R-CORE", kind: "router", x: 50, y: 6 };
const ACCESS = { id: "SW-ACCESS1", kind: "switch", x: 50, y: 28 };

const vlanDb = (keys) => keys.map((k) => `vlan ${VL[k].id}\n name ${VL[k].name}`).join("\n");
const accessPorts = DEPTS.map((k, i) => `interface fa0/${i + 1}\n switchport mode access\n switchport access vlan ${VL[k].id}`).join("\n");
const SWITCH_BUILT = `hostname SW-ACCESS1\n${vlanDb(DEPTS)}\n${accessPorts}\ninterface g0/1\n switchport mode trunk\n switchport trunk allowed vlan 10,20,30,40,50`;
const sub = (k) => `interface g0/0.${VL[k].id}\n encapsulation dot1Q ${VL[k].id}\n ip address ${VL[k].gw} ${VL[k].mask}`;
const ROUTER_BUILT = `hostname R-CORE\ninterface g0/0\n no shutdown\n${DEPTS.map(sub).join("\n")}`;

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 1 · 11.1 – 11.3
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "nw-cp1-design",
    moduleId: M,
    sectionId: SECTION_ID,
    order: 1,
    covers: ["11.1", "11.2", "11.3"],
    title: "Capstone 1: Topology, Devices and the Addressing Plan",
    subtitle: "Designing the network before building it",
    estimatedMinutes: 60,
    intro:
      "You have been hired as the network engineer for a medium-sized organisation of about 100 people in five departments. Over five lessons you will design, build, secure, test and document its network. Every lab uses the plan you make in this lesson.",

    atoms: [
      {
        id: "a-nw-cap-topology",
        title: "Design a complete network topology",
        explain:
          "THE BRIEF. The organisation occupies two floors of one building. Customer Service (50 staff) works on the ground floor; Administration (15), Human Resources (10), Finance (15) and Information Technology (10) work on the first floor. It needs a reliable, secure and scalable network: each department separated, shared services (DNS, an intranet web server, a file server) in a server area, staff Wi-Fi on both floors, internet access, and room to grow 20 percent. THE DESIGN, using Module 10's patterns: a COLLAPSED CORE (two-tier) design suits one building. At the top, an EDGE firewall/router joins the internet. Below it, the CORE router (R-CORE) routes between departments with router-on-a-stick (a Layer 3 switch would do the same job at higher speed, and is the upgrade path). ACCESS switches on each floor connect PCs, phones and access points, with a trunk up to the core. Each department is its own VLAN and subnet; servers get their own VLAN; a MANAGEMENT VLAN is reserved for network devices; guest Wi-Fi is isolated. For redundancy in a production build you would add a second core device with HSRP and dual uplinks; the labs build one of each so the configuration stays readable.",
        decision: dec(
          "The organisation fits in one building with about 100 users and modest growth expected.",
          "Which overall design pattern fits best?",
          ["A collapsed-core (two-tier) design: access switches per floor trunked to a core that routes between VLANs, with an edge firewall to the internet", "Two tiers suit one building; three tiers are for large campuses."],
          [
            ["A flat network: every device in one VLAN on daisy-chained switches", "It gives no separation, poor fault isolation and no room to grow cleanly."],
            ["A full three-tier campus with separate core and distribution layers in every room", "Far more than 100 users in one building need."],
            ["A data-centre spine-leaf fabric", "Spine-leaf is for server farms, not office floors."],
          ]
        ),
      },
      {
        id: "a-nw-cap-devices",
        title: "Select appropriate networking devices",
        explain:
          "Choose devices from the requirements (Module 5 and Module 10). EDGE: a firewall (or a router with firewall features) supporting NAT/PAT, a site-to-site VPN for future branches and two internet links (for example fibre plus a 4G/5G backup). CORE: a router with enough throughput for inter-VLAN traffic, or a Layer 3 switch. ACCESS: managed, PoE+ Layer 2 switches. Count the ports: ground floor, 50 Customer Service desks plus phones, printers and 2 access points, plus 20 percent growth, means about 72 ports, so two 48-port switches; first floor, 50 desks across four departments plus printers and 2 access points, so two 48-port switches as well; uplinks via SFP ports. Check the PoE BUDGET (Module 5): 100 IP phones at 7 W and 4 access points at 25 W need about 800 W across the four switches. WIRELESS: four Wi-Fi 6 access points, centrally managed. SERVERS: a small virtualised host (DNS, DHCP if centralised, intranet, files), a UPS for every rack, and a backup target. Document each choice and its reason: the capstone report needs them.",
        table: {
          caption: "A device list that fits the brief.",
          headers: ["Role", "Device", "Quantity", "Why"],
          rows: [
            ["Internet edge", "Firewall with NAT, VPN, two WAN ports", "1 (2 for HA)", "Security policy, PAT, second ISP"],
            ["Core / inter-VLAN routing", "Router (or Layer 3 switch)", "1 (2 for HA)", "Routes between department VLANs"],
            ["Access", "48-port PoE+ managed switch", "4", "About 145 ports with growth, phones and APs"],
            ["Wireless", "Wi-Fi 6 access point, controller or cloud managed", "4", "Coverage on both floors, staff and guest SSIDs"],
            ["Servers", "Virtualisation host + storage", "1", "DNS, intranet, files"],
            ["Power", "UPS per rack", "2", "Rides through outages until the generator starts"],
          ],
        },
        decision: dec(
          "The first-floor access switch chosen has 48 ports but no PoE. Twenty IP phones and two ceiling access points must connect to it.",
          "What is wrong with this choice?",
          ["Without PoE, the phones and access points need separate power supplies at every desk and on the ceiling; the access switches should be PoE+ with enough power budget", "PoE is a requirement in the brief's device mix."],
          [
            ["Nothing: phones and access points never need power", "They need power; PoE delivers it over the cable."],
            ["48 ports is too many", "With growth, more ports are needed, not fewer."],
            ["Access switches should be Layer 3 core devices", "Access switches can be Layer 2; the problem is PoE."],
          ]
        ),
      },
      {
        id: "a-nw-cap-addressing",
        title: "Develop the IP addressing and subnetting plan",
        explain:
          "Use VLSM (Module 3) on the private block 10.10.0.0/24 for the departments and services, LARGEST FIRST, and keep 10.10.1.0/24 for guest Wi-Fi. With 20 percent growth: Customer Service 50 staff → 60 hosts → a /26 (62). Administration 15 → 18 → a /27 (30). Finance 15 → 18 → a /27 (30). HR 10 → 12 → a /28 (14). IT 10 → 12 → a /28 (14). Servers and management need a /28 each. Allocating in order from 10.10.0.0: Customer Service 10.10.0.0/26; Administration 10.10.0.64/27; Finance 10.10.0.96/27; HR 10.10.0.128/28; IT 10.10.0.144/28; Servers 10.10.0.160/28; Management 10.10.0.176/28, leaving 10.10.0.192 to .255 free for growth. Each gateway is the FIRST usable address of its subnet. VLAN numbers: 10 ADMIN, 20 HR, 30 FINANCE, 40 IT, 50 CUSTSERV, 60 SERVERS, 99 MANAGEMENT. Work out the key values below; every lab in this capstone uses them.",
        table: {
          caption: "The capstone addressing plan (gateway = first usable address).",
          headers: ["VLAN", "Name", "Subnet", "Gateway", "Usable hosts"],
          rows: [
            ["50", "CUSTSERV", "10.10.0.0/26", "10.10.0.1", "62"],
            ["10", "ADMIN", "10.10.0.64/27", "10.10.0.65", "30"],
            ["30", "FINANCE", "10.10.0.96/27", "10.10.0.97", "30"],
            ["20", "HR", "10.10.0.128/28", "10.10.0.129", "14"],
            ["40", "IT", "10.10.0.144/28", "10.10.0.145", "14"],
            ["60", "SERVERS", "10.10.0.160/28", "10.10.0.161", "14"],
            ["99", "MANAGEMENT", "10.10.0.176/28", "10.10.0.177", "14"],
          ],
        },
        netCalc: {
          task: "Check the plan's key numbers.",
          questions: [
            { q: "Customer Service needs 60 hosts with growth. What is the smallest prefix that fits?", answer: "/26", check: { fn: "prefixForHosts", arg: "60" }, hint: "A /27 has 30 hosts; a /26 has 62.", working: "2^6 − 2 = 62 ≥ 60 → /26" },
            { q: "Finance's subnet is 10.10.0.96/27. What is its gateway (first usable address)?", answer: "10.10.0.97", check: { fn: "firstHost", arg: "10.10.0.96/27" }, hint: "Network + 1.", working: "10.10.0.96 + 1 = 10.10.0.97" },
            { q: "What is Finance's broadcast address?", answer: "10.10.0.127", check: { fn: "broadcast", arg: "10.10.0.96/27" }, hint: "Block size 32: 96 + 32 − 1.", working: "96 + 31 = 127 → 10.10.0.127" },
            { q: "IT's subnet is 10.10.0.144/28. What is the mask in dotted decimal?", answer: "255.255.255.240", check: { fn: "mask", arg: "28" }, hint: "28 = 24 + 4: 11110000 in the last octet.", working: "/28 = 255.255.255.240" },
            { q: "For an ACL, what is the WILDCARD mask of Customer Service's /26? (Wildcard = 255.255.255.255 minus the mask.)", answer: "0.0.0.63", hint: "The /26 mask is 255.255.255.192; 255 − 192 = 63.", working: "255.255.255.255 − 255.255.255.192 = 0.0.0.63" },
          ],
          successMessage: "The plan is sound. Keep the table beside you: the next four lessons build exactly this network.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 2 · 11.4 – 11.6
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "nw-cp2-switching-routing",
    moduleId: M,
    sectionId: SECTION_ID,
    order: 2,
    covers: ["11.4", "11.5", "11.6"],
    title: "Capstone 2: VLANs, Device Configuration and Inter-VLAN Routing",
    subtitle: "Building the departments and letting them talk",
    estimatedMinutes: 75,
    intro:
      "Now build it. One access switch carries a PC from each department; the core router will route between them. Use the addressing plan from Lesson 1.",

    atoms: [
      {
        id: "a-nw-cap-vlans",
        title: "Create separate VLANs for departments",
        explain:
          "Create the five department VLANs on the access switch with their names, and put each department's port in its VLAN as an access port, exactly as in Module 5: vlan, name, interface (or interface range), switchport mode access, switchport access vlan. Then check with show vlan brief. In the lab, the five PCs are on ports Fa0/1 to Fa0/5 in this order: Administration, HR, Finance, IT, Customer Service. They already have addresses from the plan, so once they are in separate VLANs no department will reach another until routing is added in the third atom.",
        netLab: {
          task:
            "On SW-ACCESS1, create VLANs 10 ADMIN, 20 HR, 30 FINANCE, 40 IT and 50 CUSTSERV, and put Fa0/1 (ADMIN-PC) in VLAN 10, Fa0/2 (HR-PC) in 20, Fa0/3 (FIN-PC) in 30, Fa0/4 (IT-PC) in 40 and Fa0/5 (CS-PC) in 50, as access ports. Check with show vlan brief.",
          devices: [ACCESS, ...PCS],
          links: PC_LINKS,
          config: { "SW-ACCESS1": "hostname SW-ACCESS1" },
          start: "SW-ACCESS1",
          height: 58,
          goals: DEPTS.map((k, i) => ({ type: "vlan", device: "SW-ACCESS1", ports: [`fa0/${i + 1}`], vlan: VL[k].id, label: `Fa0/${i + 1} is in VLAN ${VL[k].id} (${VL[k].name})` })),
          hint: "enable, configure terminal; for each department: vlan 10, name ADMIN, exit (and so on for 20 HR, 30 FINANCE, 40 IT, 50 CUSTSERV); then interface fa0/1, switchport mode access, switchport access vlan 10 (and so on for fa0/2 to fa0/5); end; show vlan brief.",
          successMessage: "Five departments, five VLANs, five separate broadcast domains on one switch.",
        },
      },
      {
        id: "a-nw-cap-base-config",
        title: "Configure routers and switches",
        explain:
          "Every device gets a professional base configuration (Modules 5 and 8): a HOSTNAME from the naming scheme; the TRUNK between access switch and core; a management address; secure administration (Lesson 4); and the configuration SAVED with copy running-config startup-config. One new command for trunks: by default a trunk carries every VLAN on the switch. Good practice is to limit it to the VLANs that need to cross it, with switchport trunk allowed vlan followed by a comma-separated list, entered on the trunk interface: switchport trunk allowed vlan 10,20,30,40,50. This keeps unused VLANs (including VLAN 1) off the uplink, which reduces broadcasts and closes a path attackers could misuse. show interfaces trunk then lists exactly those VLANs as allowed. In the lab, the switch's VLANs and access ports from the previous step are done; configure the trunk and the router's base settings.",
        netLab: {
          task:
            "Name the router R-CORE and bring up its G0/0 (no address on the physical interface). On SW-ACCESS1, make G0/1 a trunk that carries ONLY VLANs 10, 20, 30, 40 and 50. Save the configuration on both devices with copy running-config startup-config.",
          devices: [CORE, ACCESS, ...PCS],
          links: [["R-CORE:g0/0", "SW-ACCESS1:g0/1"], ...PC_LINKS],
          config: { "R-CORE": "hostname Router", "SW-ACCESS1": `hostname SW-ACCESS1\n${vlanDb(DEPTS)}\n${accessPorts}` },
          start: "SW-ACCESS1",
          height: 58,
          goals: [
            { type: "hostname", device: "R-CORE", name: "R-CORE", label: "The router is named R-CORE" },
            { type: "trunk", device: "SW-ACCESS1", port: "g0/1", vlans: [10, 20, 30, 40, 50], only: [10, 20, 30, 40, 50], label: "G0/1 trunks only VLANs 10–50 to the core" },
          ],
          hint: "SW-ACCESS1: enable, configure terminal, interface g0/1, switchport mode trunk, switchport trunk allowed vlan 10,20,30,40,50, end, copy running-config startup-config. R-CORE: enable, configure terminal, hostname R-CORE, interface g0/0, no shutdown, end, copy running-config startup-config.",
          successMessage: "Named, trunked with a tight allowed list, and saved. A power cut tonight would change nothing.",
        },
      },
      {
        id: "a-nw-cap-intervlan",
        title: "Configure inter-VLAN routing",
        explain:
          "Now let the departments talk, through the core, so that Lesson 4 can control exactly which traffic is allowed. Configure ROUTER-ON-A-STICK on R-CORE (Module 5): one subinterface per VLAN on G0/0, each with encapsulation dot1Q and the VLAN number, and ip address with the department's gateway and mask from the plan: G0/0.10 10.10.0.65 255.255.255.224; G0/0.20 10.10.0.129 255.255.255.240; G0/0.30 10.10.0.97 255.255.255.224; G0/0.40 10.10.0.145 255.255.255.240; G0/0.50 10.10.0.1 255.255.255.192. show ip interface brief should list all five up, and show ip route five connected subnets. Then test from several departments to others.",
        netLab: {
          task:
            "The switch side is finished (VLANs, access ports and the trunk). On R-CORE, create the five subinterfaces with the plan's gateways and masks, then prove that Customer Service reaches Finance, Administration reaches IT, and HR reaches Customer Service.",
          devices: [CORE, ACCESS, ...PCS],
          links: [["R-CORE:g0/0", "SW-ACCESS1:g0/1"], ...PC_LINKS],
          config: { "R-CORE": "hostname R-CORE\ninterface g0/0\n no shutdown", "SW-ACCESS1": SWITCH_BUILT },
          start: "R-CORE",
          height: 58,
          goals: [
            { type: "ping", from: "CS-PC", to: "10.10.0.100", label: "Customer Service reaches Finance" },
            { type: "ping", from: "ADMIN-PC", to: "10.10.0.150", label: "Administration reaches IT" },
            { type: "ping", from: "HR-PC", to: "10.10.0.10", label: "HR reaches Customer Service" },
          ],
          hint: "On R-CORE: enable, configure terminal; interface g0/0.10, encapsulation dot1Q 10, ip address 10.10.0.65 255.255.255.224, exit; repeat for .20 (10.10.0.129 255.255.255.240), .30 (10.10.0.97 255.255.255.224), .40 (10.10.0.145 255.255.255.240) and .50 (10.10.0.1 255.255.255.192); end; show ip route.",
          successMessage: "Five routed departments. Right now every department can reach every other; Lesson 4 decides which of that is allowed.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 3 · 11.7 – 11.8
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "nw-cp3-services-wireless",
    moduleId: M,
    sectionId: SECTION_ID,
    order: 3,
    covers: ["11.7", "11.8"],
    title: "Capstone 3: DHCP, DNS and Wireless",
    subtitle: "Automatic addressing, names for services, and staff Wi-Fi",
    estimatedMinutes: 60,
    intro:
      "A hundred staff will not type IP addresses, and nobody remembers server addresses. Add DHCP and DNS, then bring the wireless network up on the Customer Service floor.",

    atoms: [
      {
        id: "a-nw-cap-dhcp-dns",
        title: "Implement DHCP and DNS services",
        explain:
          "DHCP (Module 4): the core router will serve each department from a pool. For each pool, exclude the first addresses (gateway, printers, other static devices), then create the pool with its network, default-router (the department's gateway) and dns-server. DNS: the company's DNS server sits in the SERVERS VLAN at 10.10.0.170 and holds the internal names, including intranet.company.lab for the intranet web server at the same address. Every department's pool hands out 10.10.0.170 as the DNS server, so staff can open the intranet by name. (In a larger design the DHCP service might run on a server, with ip helper-address relays on each subinterface, Module 9.) In the lab, configure pools for HR and Customer Service, whose PCs are now set to DHCP; exclude the first ten addresses of each subnet (.129–.138 for HR, .1–.10 for Customer Service).",
        netLab: {
          task:
            "On R-CORE, create DHCP pools HR (network 10.10.0.128/28, gateway 10.10.0.129) and CUSTSERV (network 10.10.0.0/26, gateway 10.10.0.1), both with DNS server 10.10.0.170, excluding 10.10.0.129–10.10.0.138 and 10.10.0.1–10.10.0.10. Then renew HR-PC and CS-PC and open http://intranet.company.lab/ from CS-PC.",
          devices: [
            CORE,
            ACCESS,
            { id: "HR-PC", kind: "pc", x: 18, y: 50, dhcp: true, note: "VLAN 20" },
            { id: "CS-PC", kind: "pc", x: 50, y: 54, dhcp: true, note: "VLAN 50" },
            { id: "SRV-INTRANET", kind: "server", x: 84, y: 50, ip: "10.10.0.170/28", gateway: "10.10.0.161", services: [53, 80], records: { "intranet.company.lab": "10.10.0.170" }, web: "<html><title>Company Intranet</title><h1>Company Intranet</h1><p>Policies, forms and announcements.</p></html>", note: "VLAN 60" },
          ],
          links: [["R-CORE:g0/0", "SW-ACCESS1:g0/1"], ["HR-PC:fa0", "SW-ACCESS1:fa0/2"], ["CS-PC:fa0", "SW-ACCESS1:fa0/5"], ["SRV-INTRANET:fa0", "SW-ACCESS1:fa0/10"]],
          config: {
            "R-CORE": `hostname R-CORE\ninterface g0/0\n no shutdown\n${sub("hr")}\n${sub("cs")}\n${sub("srv")}`,
            "SW-ACCESS1": `hostname SW-ACCESS1\n${vlanDb(["hr", "cs", "srv"])}\ninterface fa0/2\n switchport mode access\n switchport access vlan 20\ninterface fa0/5\n switchport mode access\n switchport access vlan 50\ninterface fa0/10\n switchport mode access\n switchport access vlan 60\ninterface g0/1\n switchport mode trunk\n switchport trunk allowed vlan 20,50,60`,
          },
          start: "R-CORE",
          height: 58,
          goals: [
            { type: "dhcp", host: "HR-PC", subnet: "10.10.0.128/28", label: "HR-PC leases an address in the HR subnet" },
            { type: "dhcp", host: "CS-PC", subnet: "10.10.0.0/26", label: "CS-PC leases an address in the Customer Service subnet" },
            { type: "dns", from: "CS-PC", name: "intranet.company.lab", address: "10.10.0.170", label: "CS-PC resolves intranet.company.lab" },
            { type: "tcp", from: "CS-PC", to: "intranet.company.lab", port: 80, label: "CS-PC opens the intranet by name" },
          ],
          hint: "R-CORE: configure terminal; ip dhcp excluded-address 10.10.0.129 10.10.0.138; ip dhcp excluded-address 10.10.0.1 10.10.0.10; ip dhcp pool HR, network 10.10.0.128 255.255.255.240, default-router 10.10.0.129, dns-server 10.10.0.170; ip dhcp pool CUSTSERV, network 10.10.0.0 255.255.255.192, default-router 10.10.0.1, dns-server 10.10.0.170; end. PCs: ipconfig /renew. CS-PC: curl http://intranet.company.lab/.",
          successMessage: "Plug in a PC on either floor and it gets the right address, gateway and DNS server, and the intranet opens by name.",
        },
      },
      {
        id: "a-nw-cap-wireless",
        title: "Configure wireless connectivity",
        explain:
          "Staff Wi-Fi (Module 6): an access point on the Customer Service floor, cabled to an access port in VLAN 50 so wireless staff join the Customer Service subnet and receive addresses from its DHCP pool. Settings from the brief: SSID COMPANY-STAFF; WPA3, because every company laptop supports it (in a mixed fleet you would use WPA2/WPA3 transition, and for a company this size 802.1X with RADIUS is the stronger long-term choice, Module 6); a strong passphrase; the 5 GHz band on a channel that does not clash with neighbours. A guest SSID would map to the isolated guest VLAN (10.10.1.0/24) with internet-only access; it is left for your capstone write-up. In the lab, the router already serves Customer Service by DHCP.",
        netLab: {
          task:
            "AP-GF1 is cabled to SW-ACCESS1 Fa0/6 in VLAN 50. Configure it: SSID COMPANY-STAFF, security wpa3, passphrase Comp4ny-Staff-WiFi-2026, band 5, channel 36. Connect the staff laptop and ping the IT PC at 10.10.0.150 to prove the wireless user is on the routed network.",
          devices: [
            CORE,
            ACCESS,
            { id: "IT-PC", kind: "pc", x: 18, y: 50, ip: VL.it.pc, gateway: VL.it.gw, note: "VLAN 40" },
            { id: "AP-GF1", kind: "ap", x: 66, y: 48, wifi: { ssid: "", security: "open", passphrase: "", band: "2.4", channel: 1 }, note: "ground floor" },
            { id: "Staff-Laptop", kind: "laptop", x: 86, y: 56, dhcp: true },
          ],
          links: [["R-CORE:g0/0", "SW-ACCESS1:g0/1"], ["IT-PC:fa0", "SW-ACCESS1:fa0/4"], ["AP-GF1:port0", "SW-ACCESS1:fa0/6"]],
          config: {
            "R-CORE": `hostname R-CORE\ninterface g0/0\n no shutdown\n${sub("it")}\n${sub("cs")}\nip dhcp excluded-address 10.10.0.1 10.10.0.10\nip dhcp pool CUSTSERV\n network 10.10.0.0 255.255.255.192\n default-router 10.10.0.1`,
            "SW-ACCESS1": `hostname SW-ACCESS1\n${vlanDb(["it", "cs"])}\ninterface fa0/4\n switchport mode access\n switchport access vlan 40\ninterface fa0/6\n switchport mode access\n switchport access vlan 50\ninterface g0/1\n switchport mode trunk\n switchport trunk allowed vlan 40,50`,
          },
          start: "AP-GF1",
          height: 60,
          goals: [
            { type: "ap", device: "AP-GF1", ssid: "COMPANY-STAFF", security: "wpa3", band: "5", channel: 36, label: "AP-GF1 broadcasts COMPANY-STAFF, WPA3, 5 GHz channel 36" },
            { type: "wifi", client: "Staff-Laptop", label: "The staff laptop is connected" },
            { type: "dhcp", host: "Staff-Laptop", subnet: "10.10.0.0/26", label: "It leases an address in the Customer Service subnet" },
            { type: "ping", from: "Staff-Laptop", to: "10.10.0.150", label: "It reaches the IT PC through the core" },
          ],
          hint: "AP-GF1: ssid COMPANY-STAFF, security wpa3, passphrase Comp4ny-Staff-WiFi-2026, band 5, channel 36. Laptop: wifi connect COMPANY-STAFF Comp4ny-Staff-WiFi-2026, then ping 10.10.0.150.",
          successMessage: "Wireless staff land in their department's VLAN, get addresses from its pool, and are routed like everyone else.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 4 · 11.9 – 11.11
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "nw-cp4-security-monitoring",
    moduleId: M,
    sectionId: SECTION_ID,
    order: 4,
    covers: ["11.9", "11.10", "11.11"],
    title: "Capstone 4: Firewall Rules, Secure Administration and Monitoring",
    subtitle: "Deciding who reaches what, locking down management, and watching the network",
    estimatedMinutes: 70,
    intro:
      "Every department can now reach every other. The organisation's security policy says otherwise. Enforce it with ACLs, lock down management access to the network devices, and plan the monitoring.",

    atoms: [
      {
        id: "a-nw-cap-acl",
        title: "Implement firewall rules and access controls",
        explain:
          "THE POLICY: Finance holds payroll and accounts, so Customer Service (the largest group, and the one handling the public's calls and emails) must NOT be able to reach the Finance subnet; everything else between departments is allowed for now. Enforce it with an EXTENDED ACL on R-CORE (Module 8), placed close to the SOURCE: inbound on Customer Service's subinterface, G0/0.50. Write the deny with the source and destination as network plus WILDCARD mask (Lesson 1 worked them out: Customer Service 10.10.0.0 0.0.0.63, Finance 10.10.0.96 0.0.0.31), then a permit for everything else, because of the implicit deny at the end of every ACL: access-list 120 deny ip 10.10.0.0 0.0.0.63 10.10.0.96 0.0.0.31, access-list 120 permit ip any any. Apply it with interface g0/0.50 and ip access-group 120 in. At the internet edge, the firewall would enforce the rest of the policy (default deny inbound, guest isolation, DMZ for public services). Test both what must be blocked and what must still work.",
        netLab: {
          task:
            "Enforce the policy on R-CORE: Customer Service (10.10.0.0/26) must not reach Finance (10.10.0.96/27); all other traffic must still flow. Use extended ACL 120, applied inbound on G0/0.50.",
          devices: [CORE, ACCESS, ...PCS],
          links: [["R-CORE:g0/0", "SW-ACCESS1:g0/1"], ...PC_LINKS],
          config: { "R-CORE": ROUTER_BUILT, "SW-ACCESS1": SWITCH_BUILT },
          start: "R-CORE",
          height: 58,
          goals: [
            { type: "ping", from: "CS-PC", to: "10.10.0.100", expect: false, label: "Customer Service cannot reach Finance" },
            { type: "ping", from: "CS-PC", to: "10.10.0.150", label: "Customer Service still reaches IT" },
            { type: "ping", from: "ADMIN-PC", to: "10.10.0.100", label: "Administration still reaches Finance" },
          ],
          hint: "R-CORE: configure terminal, access-list 120 deny ip 10.10.0.0 0.0.0.63 10.10.0.96 0.0.0.31, access-list 120 permit ip any any, interface g0/0.50, ip access-group 120 in, end, show access-lists.",
          successMessage: "Policy enforced at the source, with the rest of the network untouched. Record the rule and its reason in the security report.",
        },
      },
      {
        id: "a-nw-cap-secure-admin",
        title: "Configure secure remote administration",
        explain:
          "Network devices must be managed only by IT, only over SSH, only with named accounts (Module 8). On R-CORE: enable secret instead of enable password, service password-encryption, a named account (username followed by the name, secret and password), ip domain-name and crypto key generate rsa modulus 2048 for SSH, ip ssh version 2, and on the VTY lines login local and transport input ssh. Restrict WHERE management may come from with a standard ACL permitting only the IT subnet (10.10.0.144 with wildcard 0.0.0.15) applied with access-class in. (In the full design a dedicated management VLAN, 99, would hold the devices' management addresses.) Then test from IT, which must work, and from Customer Service, which must be refused.",
        netLab: {
          task:
            "Harden R-CORE: enable secret Core-Enable-2026, no enable password, service password-encryption, user netadmin with secret Core-Admin-2026, domain company.lab, a 2048-bit RSA key, SSH version 2, VTY lines with local login over SSH only, and access list 15 permitting only the IT subnet 10.10.0.144/28 applied to the VTY lines. Then SSH from IT-PC to its gateway 10.10.0.145 as netadmin.",
          devices: [CORE, ACCESS, ...PCS],
          links: [["R-CORE:g0/0", "SW-ACCESS1:g0/1"], ...PC_LINKS],
          config: { "R-CORE": `${ROUTER_BUILT}\nenable password cisco\nline vty 0 4\n password cisco\n login\n transport input telnet`, "SW-ACCESS1": SWITCH_BUILT },
          start: "R-CORE",
          height: 58,
          goals: [
            { type: "secure", device: "R-CORE", require: ["enableSecret", "noEnablePassword", "passwordEncryption", "sshOnly", "sshV2", "vtyAcl"], label: "R-CORE meets the hardening baseline, with a VTY access list" },
            { type: "ssh", from: "IT-PC", to: "10.10.0.145", user: "netadmin", label: "IT can SSH to R-CORE as netadmin" },
            { type: "ssh", from: "CS-PC", to: "10.10.0.1", user: "netadmin", expect: false, label: "Customer Service is refused" },
          ],
          hint: "enable (cisco), configure terminal, enable secret Core-Enable-2026, no enable password, service password-encryption, username netadmin secret Core-Admin-2026, ip domain-name company.lab, crypto key generate rsa modulus 2048, ip ssh version 2, access-list 15 permit 10.10.0.144 0.0.0.15, line vty 0 4, login local, transport input ssh, access-class 15 in, end. Test: on IT-PC, ssh -l netadmin 10.10.0.145.",
          successMessage: "Management is IT-only, SSH-only, named and encrypted. Include the configuration in your evidence pack.",
        },
      },
      {
        id: "a-nw-cap-monitoring",
        title: "Monitor network connectivity and performance",
        explain:
          "Plan monitoring as part of the design (Module 9). MONITOR: every device's availability; the core and uplink interfaces' utilisation, errors and drops; the internet links' latency, loss and utilisation; CPU, memory and temperature of the core devices; and the key services (DNS, DHCP, the intranet) with synthetic checks. HOW: a monitoring server in the SERVERS VLAN (for example Zabbix or LibreNMS) polling with SNMPv3, restricted by ACL to that server; syslog from every device to a central log server; NTP on every device so logs line up; and configuration backups collected automatically. THRESHOLDS and ALERTS: link utilisation above 80 percent for 10 minutes, any interface errors increasing, any device or service down. Record a BASELINE in the first weeks so 'abnormal' can be judged. Your capstone report should include the monitoring plan and a screenshot or table of results from your own build.",
        decision: dec(
          "The capstone design must show how the IT team will know, within minutes and before users call, that the internet link is congested or a switch has failed.",
          "Which monitoring set-up meets that?",
          ["A monitoring server polling every device by SNMPv3 with thresholds and alerts, plus central syslog with NTP-synchronised timestamps and a recorded baseline", "Continuous measurement plus alerts finds problems before users do."],
          [
            ["Waiting for users to report problems to the help desk", "That is reactive and slow."],
            ["Running ping manually once a week", "Far too infrequent to catch anything in minutes."],
            ["SNMPv2c with the community string 'public' open to all", "Insecure, and still needs thresholds and alerts."],
          ]
        ),
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 5 · 11.12 – 11.13, 11.P
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "nw-cp5-test-document",
    moduleId: M,
    sectionId: SECTION_ID,
    order: 5,
    covers: ["11.12", "11.13", "11.P"],
    title: "Capstone 5: Testing, Troubleshooting and Documentation",
    subtitle: "Proving the network works, fixing what does not, and handing it over",
    estimatedMinutes: 80,
    intro:
      "A network is not finished until it has been tested, its faults found and fixed, and its documentation written so someone else could run it tomorrow. This last lesson does all three, then sets out the deliverables for your certificate.",

    atoms: [
      {
        id: "a-nw-cap-faults",
        title: "Test the network and troubleshoot deliberate faults",
        explain:
          "TEST PLAN: list every requirement and how you will prove it, then run each test and record the result: every department reaches its gateway; the routed paths that policy allows work and the ones it forbids fail; DHCP hands out correct addresses on each VLAN; names resolve; Wi-Fi clients connect and are routed; management works from IT only, over SSH only. Then the hardest part of acceptance testing: a colleague (or, here, the course) breaks the network in several places WITHOUT telling you where, and you find every fault with Module 9's method. In the lab below, the whole capstone network from Lesson 2 has been built, and then faults have been introduced on the network devices. Use show vlan brief, show interfaces trunk, show ip interface brief, show running-config, ipconfig, ping and tracert. Record each fault, how you found it and the fix: the troubleshooting report needs them.",
        netLab: {
          task:
            "The full network is built, but after an 'upgrade' several departments complain. Every department PC must reach every other department's gateway and the IT PC. Find and fix every fault; nobody will tell you how many there are or where.",
          devices: [CORE, ACCESS, ...PCS],
          links: [["R-CORE:g0/0", "SW-ACCESS1:g0/1"], ...PC_LINKS],
          config: {
            "R-CORE": ROUTER_BUILT.replace("encapsulation dot1Q 30", "encapsulation dot1Q 31"),
            "SW-ACCESS1": SWITCH_BUILT.replace("switchport trunk allowed vlan 10,20,30,40,50", "switchport trunk allowed vlan 10,30,40,50"),
          },
          start: "SW-ACCESS1",
          height: 58,
          goals: [
            { type: "ping", from: "ADMIN-PC", to: "10.10.0.150", label: "Administration reaches IT" },
            { type: "ping", from: "HR-PC", to: "10.10.0.150", label: "HR reaches IT" },
            { type: "ping", from: "FIN-PC", to: "10.10.0.150", label: "Finance reaches IT" },
            { type: "ping", from: "CS-PC", to: "10.10.0.150", label: "Customer Service reaches IT" },
          ],
          hint: "Two faults on the network devices. show interfaces trunk on SW-ACCESS1: VLAN 20 is missing from the allowed list (switchport trunk allowed vlan 10,20,30,40,50). show running-config on R-CORE: G0/0.30 has encapsulation dot1Q 31 instead of 30 (interface g0/0.30, encapsulation dot1Q 30).",
          successMessage: "A VLAN dropped from a trunk's allowed list and a mistyped 802.1Q tag: both invisible from the PCs, both obvious in the right show command. Write them up in your troubleshooting report.",
        },
      },
      {
        id: "a-nw-cap-documentation",
        title: "Produce professional network documentation",
        explain:
          "The documentation is what turns your build into something an organisation can run (Modules 7, 9 and 10). The capstone pack contains: a TOPOLOGY DIAGRAM (physical: rooms, racks, switches, cabling, access points; and logical: VLANs, subnets, routing, firewall zones), drawn with standard icons, a legend, a title, version and date; the ADDRESSING AND SUBNETTING DOCUMENTATION (the Lesson 1 plan, with every VLAN, subnet, gateway, DHCP range, static assignments and the room left for growth); the PROJECT FILE (Packet Tracer, GNS3 or your NetLab build); CONFIGURATION EVIDENCE (the running configurations of every device, plus show command outputs proving each requirement); a SECURITY IMPLEMENTATION REPORT (the policy, each ACL and why, hardening applied, wireless security, remaining risks); a TROUBLESHOOTING REPORT (the faults found during testing, the method, the fixes, and a root cause for the worst one); and a FINAL PRESENTATION for non-technical stakeholders: the problem, the design, how it meets the brief, the costs, and what comes next. Write each for its reader.",
        decision: dec(
          "Your capstone presentation is for the organisation's managing director and finance manager, neither of whom is technical.",
          "What should the presentation focus on?",
          ["How the design meets the business brief (separation of departments, reliability, security, growth), what it costs, and what comes next, with the technical detail kept in the written reports", "Write and present for the audience."],
          [
            ["Every line of every device configuration", "That belongs in the configuration evidence, not the presentation."],
            ["The history of the OSI model", "Not what decision-makers need."],
            ["Nothing but a single network diagram", "A diagram helps, but the presentation must explain value, cost and next steps."],
          ]
        ),
      },
    ],

    requirements: { read: true, video: false, assessment: true },

    task: {
      title: "Capstone deliverables: the enterprise network, designed, built, secured, tested and documented",
      intro:
        "Build the complete network for the organisation in this brief (about 100 employees: Administration, Human Resources, Finance, Information Technology and Customer Service) in Packet Tracer, GNS3 or NetLab, following your own design from these five lessons, then submit all seven deliverables. Your design may differ from the labs where you can justify it.",
      prompts: [
        "Network topology diagram: physical and logical views, with legend, title, version and date.",
        "IP addressing and subnetting documentation: every VLAN, subnet, gateway, DHCP range and static assignment, with growth allowance.",
        "Packet Tracer, GNS3 or NetLab project file of the working network.",
        "Configuration evidence: running configurations of every device and show command outputs proving each requirement (VLANs, trunks, routing, DHCP, DNS, wireless, ACLs, SSH).",
        "Security implementation report: the security policy, every firewall rule and ACL with its purpose, device hardening, wireless security, and remaining risks with recommendations.",
        "Troubleshooting report: the test plan with results, at least three deliberate faults (set by a partner or yourself) with how each was found and fixed, and a root cause analysis of one.",
        "Final project presentation (10 to 15 minutes) for non-technical stakeholders: the brief, the design, how it meets the requirements, the cost, and next steps.",
      ],
      closing:
        "Congratulations: you have designed, built, secured, tested and documented an enterprise network. Pass the final certification exam to earn your Computer Networking certificate.",
    },
  },
];
