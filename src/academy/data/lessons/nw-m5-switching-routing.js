/**
 * COMPUTER NETWORKING · MODULE 5 · SWITCHING, ROUTING AND NETWORK INFRASTRUCTURE
 *
 * Curriculum 5.1 – 5.37 and the practical. Ethernet and MAC tables, switch
 * types, VLANs, trunks and 802.1Q, inter-VLAN routing, spanning tree, link
 * aggregation; how routers work, routing tables, static and default routes,
 * metrics, RIP, OSPF and BGP, router-on-a-stick, troubleshooting and
 * interface configuration; then the hardware and cabling that carry it all.
 *
 * Every switch and router command is introduced in the explain of the atom
 * that first uses it (the content check enforces this). The IOS basics
 * (enable, configure terminal, interface, ip address, no shutdown, end,
 * show ip interface brief) were taught in Module 3, and the static route in
 * Module 3's summarisation lesson.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

import { dec } from "./nw-kit.js";

export const SECTION_ID = "nw-s5-switching-routing";
const M = "nw-m5-switching-routing";

const FOUR_PCS = [
  { id: "SW1", kind: "switch", x: 50, y: 10 },
  { id: "PC1", kind: "pc", x: 10, y: 40, ip: "192.168.1.11/24", note: "Finance" },
  { id: "PC2", kind: "pc", x: 36, y: 40, ip: "192.168.1.12/24", note: "Finance" },
  { id: "PC3", kind: "pc", x: 64, y: 40, ip: "192.168.1.13/24", note: "HR" },
  { id: "PC4", kind: "pc", x: 90, y: 40, ip: "192.168.1.14/24", note: "HR" },
];
const FOUR_LINKS = [["PC1:fa0", "SW1:fa0/1"], ["PC2:fa0", "SW1:fa0/2"], ["PC3:fa0", "SW1:fa0/3"], ["PC4:fa0", "SW1:fa0/4"]];

const TWO_ROUTERS = (r1extra = "", r2extra = "") => ({
  devices: [
    { id: "PC1", kind: "pc", x: 6, y: 30, ip: "192.168.1.10/24", gateway: "192.168.1.1" },
    { id: "R1", kind: "router", x: 34, y: 30 },
    { id: "R2", kind: "router", x: 66, y: 30 },
    { id: "PC2", kind: "pc", x: 94, y: 30, ip: "192.168.2.10/24", gateway: "192.168.2.1" },
  ],
  links: [["PC1:fa0", "R1:g0/0"], ["R1:g0/1", "R2:g0/1"], ["R2:g0/0", "PC2:fa0"]],
  config: {
    R1: `hostname R1\ninterface g0/0\n ip address 192.168.1.1 255.255.255.0\n no shutdown\ninterface g0/1\n ip address 10.0.12.1 255.255.255.252\n no shutdown${r1extra}`,
    R2: `hostname R2\ninterface g0/0\n ip address 192.168.2.1 255.255.255.0\n no shutdown\ninterface g0/1\n ip address 10.0.12.2 255.255.255.252\n no shutdown${r2extra}`,
  },
});

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 1 · 5.1 – 5.3
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "nw-sr1-ethernet",
    moduleId: M,
    sectionId: SECTION_ID,
    order: 1,
    covers: ["5.1", "5.2", "5.3"],
    title: "Switching, Ethernet and MAC Addresses",
    subtitle: "How devices on the same network actually reach each other",
    estimatedMinutes: 35,
    intro:
      "This module builds networks: first the switched LAN that joins devices in one place, then the routed network that joins LANs together. It starts with Ethernet, the technology inside almost every wired network in the world.",

    atoms: [
      {
        id: "a-nw-switching-intro",
        title: "Introduction to network switching",
        explain:
          "A SWITCH connects the devices of one local network and delivers each frame only to the device it is meant for. You met switches in Module 1 as the 'smart hub'. In this module you will configure them. Switching happens at Layer 2: a switch reads the destination MAC ADDRESS in each frame's header, looks it up in its MAC ADDRESS TABLE, and sends the frame out of the one port that leads to that device. This gives every port its own full bandwidth, lets many pairs of devices talk at once in full duplex, and keeps conversations private from the other ports. Modern switches also divide one physical switch into several separate networks (VLANs, Lesson 4), prevent loops (spanning tree, Lesson 5), and, in the more expensive models, route between networks too. Every office, school and data centre network is built from layers of switches, with routers or firewalls at the edges.",
        decision: dec(
          "An office replaces its old hub with a switch. Each PC is still plugged into the same port, with the same cable.",
          "What changes for the PCs?",
          ["Each frame now goes only to the port of its destination, so PCs no longer share bandwidth or hear each other's traffic, and they can send and receive at the same time", "A switch forwards by MAC address; a hub repeats everything to everyone."],
          [
            ["Nothing: a switch and a hub do the same job", "A hub floods every frame; a switch forwards selectively."],
            ["The PCs now need IP addresses from a different network", "A switch joins devices in the same network; addressing does not change."],
            ["The PCs can now reach the internet without a router", "Reaching other networks still needs a router."],
          ]
        ),
      },
      {
        id: "a-nw-ethernet",
        title: "How Ethernet works",
        explain:
          "ETHERNET (IEEE 802.3) defines both the cables and signals (Layer 1) and the FRAME format (Layer 2) of wired LANs. Every Ethernet frame has the same shape: a PREAMBLE that lets the receiver lock on to the signal; the DESTINATION MAC address (6 bytes); the SOURCE MAC address (6 bytes); a TYPE field saying what is inside (0x0800 means an IPv4 packet, 0x86DD IPv6, 0x0806 ARP); the PAYLOAD, 46 to 1,500 bytes (the packet); and the FCS, a 4-byte checksum that lets the receiver discard corrupted frames. Early Ethernet put every device on one shared cable, so only one could transmit at a time: each listened first and, if two collided, both waited a random time and tried again. That rule is CSMA/CD (carrier sense, multiple access, collision detection). On today's full-duplex switch ports there is no sharing, so collisions cannot happen and CSMA/CD is no longer used. Ethernet speeds have grown from 10 Mbps to 10, 100 and 400 Gbps, with the same frame format all along.",
        table: {
          caption: "The fields of an Ethernet frame.",
          headers: ["Field", "Size", "Purpose"],
          rows: [
            ["Preamble and start delimiter", "8 bytes", "Lets the receiver synchronise to the signal"],
            ["Destination MAC", "6 bytes", "Which device the frame is for"],
            ["Source MAC", "6 bytes", "Which device sent it"],
            ["Type", "2 bytes", "What the payload is: IPv4, IPv6, ARP …"],
            ["Payload", "46–1,500 bytes", "The packet being carried"],
            ["FCS", "4 bytes", "Checksum: corrupted frames are discarded"],
          ],
        },
        decision: dec(
          "A switch receives a frame whose FCS does not match the checksum it calculates from the frame's contents.",
          "What does the switch do?",
          ["Discards the frame, because its contents were corrupted in transit", "The FCS exists so damaged frames are dropped at the first device that receives them."],
          [
            ["Repairs the frame and forwards it", "Ethernet detects errors; it does not correct them."],
            ["Forwards it to every port", "Corrupted frames are never forwarded."],
            ["Sends an ICMP error to the sender", "ICMP is a Layer 3 protocol; Ethernet simply drops the frame."],
          ]
        ),
      },
      {
        id: "a-nw-mac-addresses",
        title: "MAC addresses",
        explain:
          "A MAC ADDRESS (media access control) is the 48-bit hardware address of a network interface, written as 12 HEXADECIMAL digits. Hexadecimal (hex) is base 16: digits 0–9 then A (10), B (11), C (12), D (13), E (14) and F (15). Two hex digits make one byte, from 00 to FF (255). Different systems write MACs differently: 00:1A:2B:3C:4D:5E on Linux, 00-1A-2B-3C-4D-5E on Windows, 001a.2b3c.4d5e on Cisco devices; they are the same address. The first three bytes are the OUI (organisationally unique identifier), assigned by the IEEE to the manufacturer (so 00:1A:2B tells you who made the card); the last three are the maker's serial number for that interface. One special address, FF:FF:FF:FF:FF:FF, is the BROADCAST address: a frame sent to it goes to every device on the LAN (ARP requests and DHCP discovers use it). MAC addresses matter only on the local link; routers replace the Ethernet header at every hop. Many phones and laptops now use a random 'private' MAC per Wi-Fi network for privacy.",
        netCalc: {
          task: "Read MAC addresses.",
          questions: [
            { q: "How many bits long is a MAC address?", answer: "48", hint: "12 hex digits of 4 bits each.", working: "12 × 4 = 48 bits (6 bytes)" },
            { q: "What is the OUI (the manufacturer's part) of 00:1A:2B:3C:4D:5E? Write it with colons.", answer: "00:1A:2B", accept: ["001a2b", "00-1a-2b", "001a.2b"], hint: "The first three bytes.", working: "00:1A:2B | 3C:4D:5E → OUI = 00:1A:2B" },
            { q: "What is the hex byte FF in decimal?", answer: "255", check: { fn: "hexToDec", arg: "FF" }, hint: "F is 15: 15 × 16 + 15.", working: "15 × 16 + 15 = 255" },
            { q: "What is the hex byte 1A in decimal?", answer: "26", check: { fn: "hexToDec", arg: "1A" }, hint: "1 × 16 + A (10).", working: "1 × 16 + 10 = 26" },
            { q: "What MAC address does a frame use to reach every device on the LAN?", answer: "FF:FF:FF:FF:FF:FF", accept: ["ffff.ffff.ffff", "ff-ff-ff-ff-ff-ff", "ffffffffffff"], hint: "All 48 bits set to 1.", working: "Broadcast MAC = FF:FF:FF:FF:FF:FF" },
          ],
          successMessage: "Hex, OUI, broadcast. You will read MAC addresses in every switch table from here on.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 2 · 5.4 – 5.7
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "nw-sr2-mac-tables",
    moduleId: M,
    sectionId: SECTION_ID,
    order: 2,
    covers: ["5.4", "5.5", "5.6", "5.7"],
    title: "MAC Tables, Forwarding and Domains",
    subtitle: "How a switch learns, and how far frames travel",
    estimatedMinutes: 40,
    intro:
      "A switch arrives knowing nothing about the network. Within seconds it has learned where every device is. This lesson shows how, what it does before it knows, and how far each kind of frame can spread.",

    atoms: [
      {
        id: "a-nw-mac-table",
        title: "MAC address tables",
        explain:
          "A switch's MAC ADDRESS TABLE (also called the CAM table) lists which MAC address was last seen on which PORT, and in which VLAN. Entries learned from traffic are DYNAMIC and age out after 5 minutes of silence (so a device moved to another port is relearned); an administrator can also add STATIC entries. On a Cisco switch, in privileged mode (enable), show mac address-table prints the table: VLAN, MAC address, Type (DYNAMIC or STATIC) and Port. A switch starts with an empty table every time it boots. In the network below the table is empty because no PC has sent anything yet. Look at it, make some traffic with ping, and look again.",
        netDemo: {
          task:
            "On SW1, type enable then show mac address-table: it is empty. Click PC1 and ping 192.168.1.12 (PC2). Back on SW1, run show mac address-table again: which ports now appear? Then ping PC4 from PC3 and look once more.",
          devices: FOUR_PCS,
          links: FOUR_LINKS,
          config: { SW1: "hostname SW1" },
          start: "SW1",
          height: 46,
        },
        decision: dec(
          "After PC1 (on port Fa0/1) pings PC2 (on port Fa0/2), the switch's MAC table shows two dynamic entries in VLAN 1.",
          "Which ports are they on, and how did the switch learn them?",
          ["Fa0/1 for PC1's MAC and Fa0/2 for PC2's MAC, learned from the SOURCE address of the frames each PC sent", "A switch learns from source MAC addresses as frames arrive on each port."],
          [
            ["Every port, because the first frame was flooded", "Flooding sends a frame out of every port, but learning records only the port the frame arrived on."],
            ["Fa0/2 for both, because that is where the ping was going", "The switch learns where each device SENDS from."],
            ["Neither: switches only learn from broadcasts", "Every frame's source address is learned, unicast or broadcast."],
          ]
        ),
      },
      {
        id: "a-nw-learn-forward",
        title: "How switches learn and forward frames",
        explain:
          "For every frame it receives, a switch does two things. LEARN: it records the frame's SOURCE MAC address against the port (and VLAN) it arrived on. FORWARD, using the DESTINATION MAC: if the destination is in the table, it sends the frame out of that one port (FORWARDING), unless that port is the one the frame came in on, in which case it drops it (FILTERING); if the destination is NOT in the table (an 'unknown unicast'), or it is the broadcast address, it sends the frame out of EVERY other port in the same VLAN (FLOODING). The destination's reply then teaches the switch where that device is, and from then on the conversation goes port to port. This is why a brand-new switch works with no configuration at all: plug devices in and it learns. It is also why a flood of fake source addresses can overflow a switch's table and make it flood everything (a MAC flooding attack, defended against with port security, Module 8).",
        decision: dec(
          "A switch has just booted with an empty MAC table. PC1 sends a frame to PC3's MAC address.",
          "What does the switch do with this first frame?",
          ["Learns PC1's MAC on PC1's port, then floods the frame out of every other port in the VLAN, because PC3's MAC is unknown", "Unknown unicast frames are flooded; the reply will teach the switch where PC3 is."],
          [
            ["Drops it, because PC3 is not in the table", "Switches flood unknown destinations rather than drop them."],
            ["Sends it to the router to look up PC3", "Delivery inside a LAN never needs a router."],
            ["Sends an ARP request for PC3", "Switches do not ARP; hosts do. The switch just forwards frames."],
          ]
        ),
      },
      {
        id: "a-nw-cast-types",
        title: "Unicast, multicast and broadcast",
        explain:
          "Traffic is classified by how many receivers it is addressed to. UNICAST goes to ONE device: a frame to one MAC address, a packet to one IP address. Almost all traffic is unicast: web pages, file copies, SSH sessions. BROADCAST goes to EVERY device on the local network: MAC FF:FF:FF:FF:FF:FF and IP 255.255.255.255 (or a subnet's broadcast address). ARP requests and DHCP discovers are broadcasts, and every host must stop and process each one, which is why huge flat networks slow down. Routers never forward broadcasts, which is what makes a router (or VLAN boundary) the edge of a broadcast domain. MULTICAST goes to a GROUP of devices that have asked to receive it: IPv4 224.0.0.0/4, and MAC addresses beginning 01:00:5E. Routing protocols (OSPF uses 224.0.0.5), IPTV and some video conferencing use multicast, so one stream reaches many receivers without being sent once per receiver. IPv6 has no broadcast at all; it uses multicast instead. (A fourth kind, anycast, appeared with IPv6 in Module 3.)",
        decision: dec(
          "A school wants to stream one live assembly video to 300 classroom screens on its network without sending 300 separate copies across its core links.",
          "Which kind of transmission fits?",
          ["Multicast: one stream that the network delivers to every screen that joins the group", "Multicast sends once to a group of interested receivers."],
          [
            ["Unicast to each screen", "That sends 300 copies, which is what they want to avoid."],
            ["Broadcast to the whole network", "Broadcast would hit every device, including those not watching, and does not cross routers."],
            ["ARP", "ARP finds MAC addresses; it does not carry video."],
          ]
        ),
      },
      {
        id: "a-nw-domains",
        title: "Collision domains and broadcast domains",
        explain:
          "A COLLISION DOMAIN is a part of the network where two devices sending at the same moment would collide. Every port of a HUB is in the same collision domain (a hub with 8 PCs is ONE collision domain). Every port of a SWITCH is its OWN collision domain, and on a full-duplex port collisions cannot happen at all, so a 24-port switch with 24 devices has 24 collision domains. A BROADCAST DOMAIN is the part of the network a broadcast reaches. A switch forwards broadcasts out of all its ports, so everything connected to switches (in one VLAN) is ONE broadcast domain, however many switches there are. ROUTERS stop broadcasts, so each ROUTER INTERFACE is the edge of a separate broadcast domain, and so is each VLAN (Lesson 4). Rules of thumb: switches break up collision domains, routers and VLANs break up broadcast domains. Count them in the scenarios below.",
        netCalc: {
          task: "Count the domains.",
          questions: [
            { q: "A hub connects 8 PCs. How many collision domains is that?", answer: "1", hint: "A hub repeats everything to every port.", working: "Hub = one shared collision domain" },
            { q: "A switch connects 24 PCs, all in one VLAN. How many collision domains?", answer: "24", hint: "Each switch port is its own collision domain.", working: "24 ports in use = 24 collision domains" },
            { q: "How many broadcast domains is that same switch?", answer: "1", hint: "A switch floods broadcasts to all its ports in the VLAN.", working: "One VLAN = one broadcast domain" },
            { q: "A router has 3 LAN interfaces, each connected to its own switch of PCs. How many broadcast domains?", answer: "3", hint: "Each router interface is the edge of a broadcast domain.", working: "3 router interfaces = 3 broadcast domains" },
          ],
          successMessage: "Switches split collision domains; routers and VLANs split broadcast domains. That sentence answers most exam questions on the topic.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 3 · 5.8 – 5.9
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "nw-sr3-switch-types",
    moduleId: M,
    sectionId: SECTION_ID,
    order: 3,
    covers: ["5.8", "5.9"],
    title: "Switch Types and Managed Switches",
    subtitle: "Which switch for which job, and the first configuration every managed switch gets",
    estimatedMinutes: 35,
    intro:
      "Switches range from a ₦15,000 desktop box to a chassis that costs more than a car. This lesson sorts them out, then you give a managed switch the basic configuration every one needs before it goes into a rack.",

    atoms: [
      {
        id: "a-nw-switch-types",
        title: "Switch types and capabilities",
        explain:
          "Switches are described by a handful of features. LAYER 2 switches forward frames by MAC address only; LAYER 3 (multilayer) switches also ROUTE between VLANs at hardware speed, which is how most enterprise cores route internally. FIXED-CONFIGURATION switches have a set number of ports (8, 24 or 48 are common), while MODULAR (chassis) switches take line cards and are used at the core of large networks. STACKABLE switches can be joined by special cables to behave as one switch, managed from one address. POE switches supply electrical power to phones, cameras and access points over the Ethernet cable (Lesson 11). PORT SPEEDS: 1 Gbps to desks, with faster UPLINK ports (10, 25 or 40 Gbps, often with SFP slots for fibre) to the next switch up. Data-centre switches add very high port density and speed. A useful split from Module 10: ACCESS switches connect users, DISTRIBUTION switches aggregate access switches, and CORE switches move traffic fast between distribution blocks.",
        table: {
          caption: "Common switch features.",
          headers: ["Feature", "What it means", "Typical use"],
          rows: [
            ["Layer 2", "Forwards by MAC address", "Access switches at desks"],
            ["Layer 3 (multilayer)", "Also routes between VLANs", "Distribution and core"],
            ["Fixed vs modular", "Set ports vs line-card chassis", "Most sites vs large cores"],
            ["Stackable", "Several units managed as one", "Wiring closets that grow"],
            ["PoE / PoE+", "Powers devices over the cable", "Phones, cameras, access points"],
            ["SFP uplinks", "Slots for fibre or fast copper modules", "Links between switches and floors"],
          ],
        },
        decision: dec(
          "A hospital needs a switch for a new ward: 40 desk phones and 8 ceiling access points, none of which have power sockets near them, plus a fibre link back to the main building.",
          "Which switch features are essential?",
          ["48 ports with PoE, and an SFP uplink port for the fibre", "PoE powers the phones and APs over their cables; SFP accepts a fibre module."],
          [
            ["A Layer 3 modular chassis", "Overkill for a ward; and a chassis does not by itself solve power or fibre."],
            ["An 8-port unmanaged desktop switch", "Far too few ports, no PoE, no fibre."],
            ["Any switch, plus 48 extension cables", "Running power to ceilings is exactly what PoE avoids."],
          ]
        ),
      },
      {
        id: "a-nw-managed-switch",
        title: "Managed versus unmanaged switches, and basic switch configuration",
        explain:
          "An UNMANAGED switch has no configuration at all: plug in and it learns MAC addresses. It is fine for a small home or a single desk, but offers no VLANs, no security, no monitoring and no way to troubleshoot remotely. A MANAGED switch has an operating system and a command line (IOS, on Cisco), so it supports VLANs, trunks, spanning tree settings, port security, PoE control and SNMP monitoring, and can be configured and checked from anywhere. Every managed switch gets the same first configuration. A NAME, in global configuration mode: hostname followed by the name, such as hostname SW-FLOOR1 (the prompt changes at once). A MANAGEMENT ADDRESS: a Layer 2 switch has no routed ports, so its address lives on a virtual interface for a VLAN, normally VLAN 1 at first: interface vlan 1, then ip address 192.168.1.2 255.255.255.0, then no shutdown. A GATEWAY, so the switch can be managed from other networks: ip default-gateway 192.168.1.1 (in global configuration mode, after typing exit to leave the interface). Then end, and test by pinging the switch's address from a PC.",
        netLab: {
          task:
            "SW1 is a new managed switch. Name it SW-FLOOR1, give it the management address 192.168.1.2/24 on interface vlan 1, set its default gateway to the router 192.168.1.1, and prove the admin PC can reach it.",
          devices: [
            { id: "R1", kind: "router", x: 50, y: 8 },
            { id: "SW1", kind: "switch", x: 50, y: 26 },
            { id: "Admin-PC", kind: "pc", x: 20, y: 44, ip: "192.168.1.50/24", gateway: "192.168.1.1" },
            { id: "PC2", kind: "pc", x: 80, y: 44, ip: "192.168.1.51/24", gateway: "192.168.1.1" },
          ],
          links: [["R1:g0/0", "SW1:g0/1"], ["Admin-PC:fa0", "SW1:fa0/1"], ["PC2:fa0", "SW1:fa0/2"]],
          config: {
            R1: "hostname R1\ninterface g0/0\n ip address 192.168.1.1 255.255.255.0\n no shutdown",
            SW1: "hostname SW1",
          },
          start: "SW1",
          goals: [
            { type: "hostname", device: "SW1", name: "SW-FLOOR1", label: "The switch is named SW-FLOOR1" },
            { type: "ip", device: "SW1", iface: "vlan1", address: "192.168.1.2/24", label: "Interface Vlan1 is 192.168.1.2/24" },
            { type: "ping", from: "Admin-PC", to: "192.168.1.2", label: "Admin-PC can reach the switch's management address" },
          ],
          hint: "enable, configure terminal, hostname SW-FLOOR1, interface vlan 1, ip address 192.168.1.2 255.255.255.0, no shutdown, exit, ip default-gateway 192.168.1.1, end. Then ping 192.168.1.2 from Admin-PC.",
          successMessage: "Named, addressed and reachable. That is the first ten minutes of every managed switch's life in a real network.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 4 · 5.10 – 5.12
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "nw-sr4-vlans",
    moduleId: M,
    sectionId: SECTION_ID,
    order: 4,
    covers: ["5.10", "5.11", "5.12"],
    title: "VLANs, Access Ports and Trunks",
    subtitle: "Several separate networks on the same switches",
    estimatedMinutes: 55,
    intro:
      "Finance and HR share the same floor and the same switch, but their traffic must stay apart. VLANs make that possible without buying separate switches, and trunks carry many VLANs between switches over a single cable.",

    atoms: [
      {
        id: "a-nw-vlans",
        title: "VLANs: Virtual Local Area Networks",
        explain:
          "A VLAN divides one physical switch (or many connected switches) into separate LOGICAL networks. Ports in VLAN 10 and ports in VLAN 20 behave as if they were on different switches: frames, including broadcasts, never pass from one VLAN to another inside the switch. Each VLAN is its own broadcast domain and, by convention, its own IP subnet. To pass traffic BETWEEN VLANs you need a router or a Layer 3 switch (Lesson 5), which is where security rules can be applied. VLANs give SECURITY (Finance traffic stays in Finance), smaller broadcast domains, and FLEXIBILITY: a user who moves desk keeps their VLAN by reconfiguring a port, not recabling. VLANs are numbered 1 to 4094; every port starts in VLAN 1, the default. On a Cisco switch, in global configuration mode: vlan 10 creates VLAN 10 and enters its mode, where name FINANCE gives it a name; type exit to return. To put a port in a VLAN, enter the interface and type switchport mode access (this port carries one VLAN) and then switchport access vlan 10. To configure several ports at once, use interface range, as in interface range fa0/1 - 2 (note the spaces around the dash). In privileged mode, show vlan brief lists each VLAN and its ports. In the lab, all four PCs share one subnet on purpose, so the only thing separating them will be the VLANs.",
        netLab: {
          task:
            "Finance (PC1 and PC2, on ports Fa0/1–2) and HR (PC3 and PC4, on Fa0/3–4) must not be able to reach each other, although all four share the subnet 192.168.1.0/24. On SW1, create VLAN 10 named FINANCE and VLAN 20 named HR, put Fa0/1–2 in VLAN 10 and Fa0/3–4 in VLAN 20 as access ports, then check with show vlan brief and with pings.",
          devices: FOUR_PCS,
          links: FOUR_LINKS,
          config: { SW1: "hostname SW1" },
          start: "SW1",
          height: 46,
          goals: [
            { type: "vlan", device: "SW1", ports: ["fa0/1", "fa0/2"], vlan: 10, label: "Fa0/1 and Fa0/2 are access ports in VLAN 10" },
            { type: "vlan", device: "SW1", ports: ["fa0/3", "fa0/4"], vlan: 20, label: "Fa0/3 and Fa0/4 are access ports in VLAN 20" },
            { type: "ping", from: "PC1", to: "192.168.1.12", label: "Finance PCs still reach each other" },
            { type: "ping", from: "PC1", to: "192.168.1.13", expect: false, label: "Finance can no longer reach HR" },
          ],
          hint: "enable, configure terminal, vlan 10, name FINANCE, exit, vlan 20, name HR, exit, interface range fa0/1 - 2, switchport mode access, switchport access vlan 10, exit, interface range fa0/3 - 4, switchport mode access, switchport access vlan 20, end, show vlan brief.",
          successMessage: "Same switch, same subnet, and yet PC1 can no longer reach PC3: the VLANs are separate networks. To let them talk in a controlled way, you would route between them, which is next.",
        },
      },
      {
        id: "a-nw-access-trunk",
        title: "Access ports and trunk ports",
        explain:
          "An ACCESS PORT belongs to ONE VLAN and connects an end device (a PC, printer or phone). Frames on it are ordinary, untagged Ethernet frames; the device has no idea VLANs exist. A TRUNK PORT carries MANY VLANs over one link, normally between two switches or from a switch to a router. On a trunk each frame is TAGGED with its VLAN number (Lesson 4's third atom explains the tag) so the switch at the other end knows which VLAN it belongs to. Without trunks you would need one cable per VLAN between switches. To make a port a trunk, enter the interface and type switchport mode trunk. Configure BOTH ends: Cisco switches can also negotiate trunking automatically (a protocol called DTP), but a port left in its default 'dynamic auto' mode only becomes a trunk if the other side asks, so two defaults never form a trunk; best practice is to set trunks explicitly. Both switches must also have the VLANs created. In privileged mode, show interfaces trunk lists every trunk and the VLANs it carries.",
        netLab: {
          task:
            "Finance staff are on two floors: PC1 on SW1 and PC2 on SW2, both in VLAN 10, which already exists on both switches. The link between the switches (G0/1 on each) is not a trunk, so VLAN 10 cannot cross it. Make G0/1 a trunk on BOTH switches, then check with show interfaces trunk and ping PC2 from PC1.",
          devices: [
            { id: "SW1", kind: "switch", x: 30, y: 14, note: "floor 1" },
            { id: "SW2", kind: "switch", x: 70, y: 14, note: "floor 2" },
            { id: "PC1", kind: "pc", x: 30, y: 40, ip: "192.168.10.11/24", note: "VLAN 10" },
            { id: "PC2", kind: "pc", x: 70, y: 40, ip: "192.168.10.12/24", note: "VLAN 10" },
          ],
          links: [["SW1:g0/1", "SW2:g0/1"], ["PC1:fa0", "SW1:fa0/1"], ["PC2:fa0", "SW2:fa0/1"]],
          config: {
            SW1: "hostname SW1\nvlan 10\n name FINANCE\ninterface fa0/1\n switchport mode access\n switchport access vlan 10",
            SW2: "hostname SW2\nvlan 10\n name FINANCE\ninterface fa0/1\n switchport mode access\n switchport access vlan 10",
          },
          start: "SW1",
          height: 44,
          goals: [
            { type: "trunk", device: "SW1", port: "g0/1", vlans: [10], label: "SW1 G0/1 is a trunk carrying VLAN 10" },
            { type: "trunk", device: "SW2", port: "g0/1", vlans: [10], label: "SW2 G0/1 is a trunk carrying VLAN 10" },
            { type: "ping", from: "PC1", to: "192.168.10.12", label: "Finance on floor 1 reaches Finance on floor 2" },
          ],
          hint: "On each switch: enable, configure terminal, interface g0/1, switchport mode trunk, end, show interfaces trunk. Then ping 192.168.10.12 from PC1.",
          successMessage: "One cable now carries every VLAN between the floors, each frame tagged so it stays in its own VLAN at the far end.",
        },
      },
      {
        id: "a-nw-dot1q",
        title: "IEEE 802.1Q VLAN tagging",
        explain:
          "IEEE 802.1Q is the standard way a trunk marks which VLAN a frame belongs to. The sending switch inserts a 4-byte TAG into the Ethernet header, between the source MAC address and the Type field. The tag holds a 12-bit VLAN ID (which is why VLANs go up to 4094; 0 and 4095 are reserved) and a 3-bit priority value used for quality of service. The receiving switch reads the tag, removes it, and forwards the frame only to ports in that VLAN. Access ports never send tags; end devices never see them (an IP phone is the exception, which can tag its own voice traffic). One VLAN on each trunk is the NATIVE VLAN, VLAN 1 by default: its frames cross the trunk UNTAGGED. Both ends must agree on the native VLAN, or traffic leaks between VLANs; security practice is to change the native VLAN to an unused one so that no user traffic travels untagged. Routers can tag too, which is how one router interface serves many VLANs (router-on-a-stick, Lesson 9).",
        decision: dec(
          "Two switches are joined by a trunk. SW1's trunk has native VLAN 1; SW2's trunk was changed to native VLAN 99.",
          "What happens to untagged frames crossing this trunk?",
          ["They land in the wrong VLAN: SW1's VLAN 1 traffic arrives untagged and SW2 puts it in VLAN 99, and vice versa, so traffic leaks between VLANs", "Both ends must agree on the native VLAN; Cisco switches also log a 'native VLAN mismatch'."],
          [
            ["Nothing: tags always carry the VLAN number", "Native VLAN frames are sent without a tag, so the receiver uses its own native VLAN."],
            ["The trunk refuses to carry any VLAN at all", "Tagged VLANs still cross; only the untagged native traffic is misplaced."],
            ["Both switches switch to native VLAN 99 automatically", "They do not renegotiate; the mismatch persists until fixed."],
          ]
        ),
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 5 · 5.13 – 5.15
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "nw-sr5-intervlan-stp",
    moduleId: M,
    sectionId: SECTION_ID,
    order: 5,
    covers: ["5.13", "5.14", "5.15"],
    title: "Inter-VLAN Routing, Spanning Tree and Link Aggregation",
    subtitle: "Letting VLANs talk, stopping loops, and bundling links",
    estimatedMinutes: 55,
    intro:
      "VLANs keep groups apart; now you will let them talk in a controlled way. Then two features that make switched networks resilient: spanning tree, which stops redundant links from melting the network, and link aggregation, which bundles cables into one fatter link.",

    atoms: [
      {
        id: "a-nw-intervlan",
        title: "Inter-VLAN routing",
        explain:
          "Since each VLAN is a separate network with its own subnet, traffic between VLANs must be ROUTED, exactly like traffic between any two networks. There are three ways. 1. A ROUTER INTERFACE PER VLAN: one physical router port and one cable per VLAN. Simple, but it runs out of ports quickly. 2. ROUTER-ON-A-STICK: one router port configured as a trunk, with a logical SUBINTERFACE per VLAN (Lesson 9). 3. A LAYER 3 SWITCH with an SVI (switch virtual interface) per VLAN: the switch itself routes between VLANs at hardware speed, which is how most enterprise networks do it. On a Cisco Layer 3 switch, in global configuration mode, ip routing turns routing on. Then for each VLAN, interface vlan 10 creates its SVI, and ip address 192.168.10.1 255.255.255.0 and no shutdown give it the address that the VLAN's hosts use as their default gateway. Once both SVIs are up, the switch has a connected route to each subnet and forwards between them. In the lab, MLS1 is a Layer 3 switch with VLANs 10 and 20 already built.",
        netLab: {
          task:
            "MLS1 is a Layer 3 switch. Finance (PC1, VLAN 10, 192.168.10.0/24) and HR (PC2, VLAN 20, 192.168.20.0/24) are already in their VLANs, with gateways .1 in each subnet. Turn on routing, create SVIs for VLAN 10 (192.168.10.1/24) and VLAN 20 (192.168.20.1/24), and prove PC1 can reach PC2.",
          devices: [
            { id: "MLS1", kind: "switch", x: 50, y: 12, note: "Layer 3 switch" },
            { id: "PC1", kind: "pc", x: 22, y: 40, ip: "192.168.10.11/24", gateway: "192.168.10.1", note: "Finance VLAN 10" },
            { id: "PC2", kind: "pc", x: 78, y: 40, ip: "192.168.20.11/24", gateway: "192.168.20.1", note: "HR VLAN 20" },
          ],
          links: [["PC1:fa0", "MLS1:fa0/1"], ["PC2:fa0", "MLS1:fa0/2"]],
          config: {
            MLS1: "hostname MLS1\nvlan 10\n name FINANCE\nvlan 20\n name HR\ninterface fa0/1\n switchport mode access\n switchport access vlan 10\ninterface fa0/2\n switchport mode access\n switchport access vlan 20",
          },
          start: "MLS1",
          height: 44,
          goals: [
            { type: "ip", device: "MLS1", iface: "vlan10", address: "192.168.10.1/24", label: "SVI Vlan10 is the Finance gateway" },
            { type: "ip", device: "MLS1", iface: "vlan20", address: "192.168.20.1/24", label: "SVI Vlan20 is the HR gateway" },
            { type: "ping", from: "PC1", to: "192.168.20.11", label: "Finance reaches HR through the switch's routing" },
          ],
          hint: "enable, configure terminal, ip routing, interface vlan 10, ip address 192.168.10.1 255.255.255.0, no shutdown, interface vlan 20, ip address 192.168.20.1 255.255.255.0, no shutdown, end. Then ping 192.168.20.11 from PC1.",
          successMessage: "Two VLANs, two subnets, and one switch routing between them. In Module 8 you will add rules that decide exactly which of that traffic is allowed.",
        },
      },
      {
        id: "a-nw-stp",
        title: "Spanning Tree Protocol (STP)",
        explain:
          "Networks add REDUNDANT links between switches so one broken cable does not cut anyone off. But a loop in a switched network is a disaster: a broadcast is flooded round the loop forever (Ethernet frames have no TTL), multiplying until the BROADCAST STORM consumes every link and the network freezes. SPANNING TREE PROTOCOL (STP, IEEE 802.1D; Cisco runs a version per VLAN called PVST+) solves this by BLOCKING just enough ports to remove every loop, and unblocking them automatically if an active link fails. How: the switches elect a ROOT BRIDGE, the one with the lowest BRIDGE ID (a configurable PRIORITY, default 32768, plus the switch's MAC address as a tie-breaker). Every other switch picks its best path to the root (its ROOT PORT); on each link one port forwards towards the root and, where a loop would form, one port is put in BLOCKING. Because the root is elected by lowest MAC by default, an old, slow switch can end up as root, so engineers choose the root deliberately: in global configuration mode, spanning-tree vlan 1 priority 4096 (priorities go in steps of 4096; lower wins). show spanning-tree in privileged mode shows the root and each port's role and state. Edge ports to PCs can skip the 30-second wait with spanning-tree portfast.",
        netLab: {
          task:
            "Three switches are cabled in a triangle for redundancy, so spanning tree has blocked one port. At the moment the root bridge was chosen by MAC address. Make CORE-SW the root bridge for VLAN 1 by giving it priority 4096, then check with show spanning-tree on each switch.",
          devices: [
            { id: "CORE-SW", kind: "switch", x: 50, y: 8, note: "should be root" },
            { id: "SW-A", kind: "switch", x: 20, y: 36 },
            { id: "SW-B", kind: "switch", x: 80, y: 36 },
            { id: "PC1", kind: "pc", x: 20, y: 54, ip: "192.168.1.11/24" },
            { id: "PC2", kind: "pc", x: 80, y: 54, ip: "192.168.1.12/24" },
          ],
          links: [["CORE-SW:g0/1", "SW-A:g0/1"], ["CORE-SW:g0/2", "SW-B:g0/1"], ["SW-A:g0/2", "SW-B:g0/2"], ["PC1:fa0", "SW-A:fa0/1"], ["PC2:fa0", "SW-B:fa0/1"]],
          config: { "CORE-SW": "hostname CORE-SW", "SW-A": "hostname SW-A\nspanning-tree vlan 1 priority 28672", "SW-B": "hostname SW-B" },
          start: "CORE-SW",
          height: 58,
          goals: [
            { type: "root", device: "CORE-SW", vlan: 1, label: "CORE-SW is the root bridge for VLAN 1" },
            { type: "ping", from: "PC1", to: "192.168.1.12", label: "PC1 still reaches PC2 through the loop-free tree" },
          ],
          hint: "On CORE-SW: enable, configure terminal, spanning-tree vlan 1 priority 4096, end, show spanning-tree. SW-A's priority is 28672, so CORE-SW needs a lower number.",
          successMessage: "CORE-SW now wins the election, so every switch's best path leads to the core, and the blocked port sits on the link between SW-A and SW-B, where it costs least.",
        },
      },
      {
        id: "a-nw-link-aggregation",
        title: "Link aggregation fundamentals",
        explain:
          "Two cables between the same two switches look like a loop to spanning tree, so it blocks one of them: you pay for two links and use one. LINK AGGREGATION bundles several physical links into ONE logical link, so spanning tree sees a single link and all members carry traffic. The bundle gives MORE BANDWIDTH (four 1 Gbps links act as a 4 Gbps channel) and RESILIENCE: if one cable fails, traffic continues on the rest without any spanning-tree recalculation. Cisco calls it ETHERCHANNEL; the open standard negotiation protocol is LACP (IEEE 802.3ad/802.1AX), and Cisco's own is PAgP. All member links must match in speed, duplex and VLAN settings. Traffic is shared by a HASH of addresses (for example source and destination IP), so one single conversation still uses one member link: a bundle raises total capacity, not the speed of one file copy. Servers and storage arrays use the same idea, often called NIC teaming or bonding.",
        decision: dec(
          "Two switches are joined by two 1 Gbps cables. A show spanning-tree reveals that one of the two ports is blocking, and the uplink is congested at 1 Gbps.",
          "What is the right fix?",
          ["Bundle the two links into an EtherChannel with LACP, so spanning tree sees one 2 Gbps logical link and both cables carry traffic", "Aggregation turns redundant parallel links into usable capacity."],
          [
            ["Disable spanning tree so both links forward", "That creates a loop and a broadcast storm."],
            ["Unplug the blocked cable, since it does nothing", "You lose the redundancy and gain nothing."],
            ["Give the blocked port a higher priority", "Priority changes which port blocks, not whether one does."],
          ]
        ),
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 6 · 5.16 – 5.18
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "nw-sr6-routing-basics",
    moduleId: M,
    sectionId: SECTION_ID,
    order: 6,
    covers: ["5.16", "5.17", "5.18"],
    title: "How Routing Works",
    subtitle: "Routers, longest-prefix matching and the routing table",
    estimatedMinutes: 40,
    intro:
      "Switching joins the devices of one network; routing joins networks. Every packet that leaves your LAN is passed from router to router until it arrives. This lesson shows how each router decides where to send it.",

    atoms: [
      {
        id: "a-nw-routing-intro",
        title: "Introduction to routing",
        explain:
          "ROUTING is choosing the path a packet takes from one network to another, hop by hop. A ROUTER connects two or more networks (each interface is in a different subnet) and forwards packets between them based on their destination IP address. Every router keeps a ROUTING TABLE: a list of networks it knows how to reach and, for each one, where to send packets for it (out of which interface and, if not directly connected, to which NEXT-HOP router). Routes get into the table three ways. CONNECTED: every interface with an address and status up/up adds its own subnet automatically. STATIC: an administrator types the route (Lesson 7). DYNAMIC: routers learn routes from each other with a ROUTING PROTOCOL such as RIP or OSPF (Lesson 8). No single router knows the whole path: each only decides the next hop, and the packet is passed along until it reaches the router connected to the destination network.",
        decision: dec(
          "A packet travels from a PC in Lagos to a server in London through eleven routers.",
          "How much of the path does the first router need to know?",
          ["Only the next hop: which neighbouring router (or interface) to hand the packet to; each router after it decides its own next hop", "Routing is hop-by-hop; nobody plans the whole route."],
          [
            ["All eleven routers, in order, before it sends anything", "IP routers do not compute or store end-to-end paths."],
            ["Nothing; the PC chooses the whole path", "The PC only knows its default gateway."],
            ["The London server's MAC address", "MAC addresses are only meaningful on the local link."],
          ]
        ),
      },
      {
        id: "a-nw-how-routers-work",
        title: "How routers work: longest-prefix match",
        explain:
          "When a packet arrives, a router: 1. checks the frame's FCS and strips the Layer 2 header; 2. reads the DESTINATION IP address; 3. looks it up in the routing table and picks the matching route with the LONGEST PREFIX, the most specific one; 4. decreases the TTL by one (dropping the packet and sending ICMP Time Exceeded if it reaches zero); 5. ARPs for the next hop's MAC address on the outgoing interface if it does not know it; 6. builds a new frame and sends it. Longest-prefix match is the key rule. Suppose a router has routes to 10.0.0.0/8, 10.1.0.0/16, 10.1.1.0/24 and a default route 0.0.0.0/0. A packet for 10.1.1.9 matches ALL FOUR (every address matches /0), and the router chooses 10.1.1.0/24 because it is the most specific. A packet for 10.1.200.5 matches /8, /16 and /0, so the /16 wins. The default route matches everything and so is used only when nothing more specific matches: it is the route of last resort.",
        netCalc: {
          task: "A router's table has four routes: 10.0.0.0/8 via router A, 10.1.0.0/16 via router B, 10.1.1.0/24 via router C, and 0.0.0.0/0 via router D. Which router (A, B, C or D) does each packet go to?",
          questions: [
            { q: "A packet for 10.1.1.9?", answer: "C", hint: "It matches all four routes. Which prefix is longest?", working: "Matches /8, /16, /24 and /0 → /24 is longest → C" },
            { q: "A packet for 10.1.200.5?", answer: "B", hint: "Is 10.1.200.5 inside 10.1.1.0/24? No. Inside 10.1.0.0/16? Yes.", working: "Matches /8, /16 and /0 → /16 wins → B" },
            { q: "A packet for 10.9.9.9?", answer: "A", hint: "It starts with 10, but not 10.1.", working: "Matches /8 and /0 → /8 wins → A" },
            { q: "A packet for 8.8.8.8?", answer: "D", hint: "Only one route matches every address.", working: "Matches only 0.0.0.0/0 → D (the default route)" },
          ],
          successMessage: "Most specific wins, and the default route catches the rest. That one rule decides the path of every packet on the internet.",
        },
      },
      {
        id: "a-nw-routing-table",
        title: "Reading a routing table",
        explain:
          "show ip route, in privileged mode, prints a Cisco router's routing table. Each route begins with a CODE letter for where it came from: C for connected (a network on one of the router's own interfaces), L for local (the router's own address on that interface, as a /32), S for static, R for RIP, O for OSPF, and an asterisk marks a candidate default route. After the network and prefix, a learned route shows two numbers in square brackets, [administrative distance/metric] (Lesson 8 explains both), then 'via' the next-hop address, then the outgoing interface. The line 'Gateway of last resort is … to network 0.0.0.0' tells you the router has a default route; 'Gateway of last resort is not set' means packets for unknown networks are dropped. Read the table of the router in the network below. It has two connected LANs, a link to another router, a static route and a default route.",
        netDemo: {
          task:
            "On R1, type enable then show ip route. Find the C (connected) routes, the L (local) routes, the S route to 172.16.5.0/24 and the default route (S*). Then read the 'Gateway of last resort' line at the top.",
          devices: [
            { id: "LAN-A", kind: "pc", x: 8, y: 16, ip: "192.168.1.10/24", gateway: "192.168.1.1" },
            { id: "LAN-B", kind: "pc", x: 8, y: 44, ip: "192.168.2.10/24", gateway: "192.168.2.1" },
            { id: "R1", kind: "router", x: 40, y: 30 },
            { id: "R2", kind: "router", x: 74, y: 30 },
          ],
          links: [["LAN-A:fa0", "R1:g0/0"], ["LAN-B:fa0", "R1:g0/1"], ["R1:g0/2", "R2:g0/0"]],
          config: {
            R1: "hostname R1\ninterface g0/0\n ip address 192.168.1.1 255.255.255.0\n no shutdown\ninterface g0/1\n ip address 192.168.2.1 255.255.255.0\n no shutdown\ninterface g0/2\n ip address 10.0.0.1 255.255.255.252\n no shutdown\nip route 172.16.5.0 255.255.255.0 10.0.0.2\nip route 0.0.0.0 0.0.0.0 10.0.0.2",
            R2: "hostname R2\ninterface g0/0\n ip address 10.0.0.2 255.255.255.252\n no shutdown",
          },
          start: "R1",
          height: 46,
        },
        decision: dec(
          "In R1's routing table above, one line reads: S 172.16.5.0/24 [1/0] via 10.0.0.2.",
          "What does it mean?",
          ["A static route: packets for 172.16.5.0/24 are sent to the next-hop router 10.0.0.2; 1 is the administrative distance of a static route", "S is static, [1/0] is distance/metric, and 'via' names the next hop."],
          [
            ["172.16.5.0 is connected directly to R1", "Connected routes have code C and no 'via'."],
            ["R1 learned the route from OSPF", "OSPF routes have code O and distance 110."],
            ["Packets for 172.16.5.0 are dropped", "A route sends packets somewhere; dropping happens when there is no route."],
          ]
        ),
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 7 · 5.19 – 5.20
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "nw-sr7-static",
    moduleId: M,
    sectionId: SECTION_ID,
    order: 7,
    covers: ["5.19", "5.20"],
    title: "Static and Default Routes",
    subtitle: "Telling routers where networks are, by hand",
    estimatedMinutes: 45,
    intro:
      "You wrote one static route in Module 3. Now you will route between two sites properly, which means remembering that every conversation needs a path in BOTH directions, and then give a branch a default route to everywhere else.",

    atoms: [
      {
        id: "a-nw-static-routes",
        title: "Static routing",
        explain:
          "A STATIC ROUTE is a route an administrator types. In global configuration mode the command is ip route followed by the destination NETWORK, its MASK and either the NEXT-HOP address (the neighbouring router's address on the shared link) or the EXIT INTERFACE: ip route 192.168.2.0 255.255.255.0 10.0.12.2. Static routes are simple, predictable, use no bandwidth or CPU, and reveal nothing to other routers, which suits small networks, stub sites with one way out, and specific overrides. But they do not adapt: if a link fails, a static route keeps sending traffic into it, and every new network means editing every router. The classic mistake is forgetting the RETURN path. A ping needs a route TO the destination on every router on the way there AND a route BACK to the source on every router on the way back. In the lab, R1 and R2 each know only their own networks. Give each a static route to the other's LAN, then check both tables with show ip route.",
        netLab: {
          task:
            "R1 serves 192.168.1.0/24 and R2 serves 192.168.2.0/24; they share the link 10.0.12.0/30 (R1 is .1, R2 is .2). Add a static route on R1 to 192.168.2.0/24 via R2, and on R2 to 192.168.1.0/24 via R1, so PC1 and PC2 can reach each other.",
          ...TWO_ROUTERS(),
          start: "R1",
          height: 34,
          goals: [
            { type: "route", device: "R1", prefix: "192.168.2.0/24", source: "S", label: "R1 has a static route to 192.168.2.0/24" },
            { type: "route", device: "R2", prefix: "192.168.1.0/24", source: "S", label: "R2 has a static route back to 192.168.1.0/24" },
            { type: "ping", from: "PC1", to: "192.168.2.10", label: "PC1 reaches PC2, there and back" },
          ],
          hint: "On R1: enable, configure terminal, ip route 192.168.2.0 255.255.255.0 10.0.12.2, end. On R2: enable, configure terminal, ip route 192.168.1.0 255.255.255.0 10.0.12.1, end. Try pinging after only the first route: the request arrives but the reply has no way home.",
          successMessage: "Two routes, one in each direction. Forgetting the return route is the most common static-routing fault there is.",
        },
      },
      {
        id: "a-nw-default-route",
        title: "Default routes",
        explain:
          "A DEFAULT ROUTE matches every destination: network 0.0.0.0 with mask 0.0.0.0, written 0.0.0.0/0. Because longest-prefix match always prefers something more specific, the default route is used only for destinations the router has no other route for, which makes it the 'everything else' route. Typical uses: a branch or home router whose only way out is one link to head office or the ISP (instead of listing every network on the internet), and an edge router pointing at its ISP. The command is a static route with all zeros: ip route 0.0.0.0 0.0.0.0 followed by the next hop. show ip route then marks it S* and says 'Gateway of last resort is …'. Routing protocols can spread a default route to other routers too (in OSPF, default-information originate). In the lab, a branch router needs one route to reach both head office and the internet.",
        netLab: {
          task:
            "BR1 is a branch router with one link to head office (HQ, at 10.0.0.1). HQ can reach every company network and the internet; the test server is 203.0.113.80. Add a single default route on BR1 pointing at HQ, so the branch PC can reach the server. (HQ already has a route back to the branch.)",
          devices: [
            { id: "Branch-PC", kind: "pc", x: 8, y: 30, ip: "192.168.50.10/24", gateway: "192.168.50.1" },
            { id: "BR1", kind: "router", x: 36, y: 30, note: "branch" },
            { id: "HQ", kind: "router", x: 64, y: 30, note: "head office" },
            { id: "Server", kind: "server", x: 92, y: 30, ip: "203.0.113.80/24", gateway: "203.0.113.1" },
          ],
          links: [["Branch-PC:fa0", "BR1:g0/0"], ["BR1:g0/1", "HQ:g0/1"], ["HQ:g0/0", "Server:fa0"]],
          config: {
            BR1: "hostname BR1\ninterface g0/0\n ip address 192.168.50.1 255.255.255.0\n no shutdown\ninterface g0/1\n ip address 10.0.0.2 255.255.255.252\n no shutdown",
            HQ: "hostname HQ\ninterface g0/1\n ip address 10.0.0.1 255.255.255.252\n no shutdown\ninterface g0/0\n ip address 203.0.113.1 255.255.255.0\n no shutdown\nip route 192.168.50.0 255.255.255.0 10.0.0.2",
          },
          start: "BR1",
          height: 34,
          goals: [
            { type: "route", device: "BR1", prefix: "0.0.0.0/0", source: "S", label: "BR1 has a default route" },
            { type: "ping", from: "Branch-PC", to: "203.0.113.80", label: "The branch PC reaches the server" },
          ],
          hint: "On BR1: enable, configure terminal, ip route 0.0.0.0 0.0.0.0 10.0.0.1, end, show ip route.",
          successMessage: "One line replaces a route to every network beyond head office. Gateway of last resort is set.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 8 · 5.21 – 5.25
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "nw-sr8-dynamic",
    moduleId: M,
    sectionId: SECTION_ID,
    order: 8,
    covers: ["5.21", "5.22", "5.23", "5.24", "5.25"],
    title: "Dynamic Routing: RIP, OSPF and BGP",
    subtitle: "Routers that learn routes from each other",
    estimatedMinutes: 60,
    intro:
      "Static routes do not scale and do not heal. Routing protocols let routers tell each other which networks they can reach and recalculate automatically when something fails. You will configure the two classic interior protocols and meet the one that runs the internet.",

    atoms: [
      {
        id: "a-nw-dynamic-routing",
        title: "Dynamic routing",
        explain:
          "With DYNAMIC ROUTING, routers run a ROUTING PROTOCOL: they exchange information about the networks they know, build their routing tables from it, and recalculate (CONVERGE) when a link goes down or a new network appears. This removes the manual work of static routes and gives automatic failover. Interior protocols (IGPs) run inside one organisation: RIP, OSPF and EIGRP (Cisco). The exterior protocol (EGP) that connects organisations across the internet is BGP. There are two families of interior protocol. DISTANCE-VECTOR protocols (RIP) tell their neighbours 'I can reach network X at distance N'; each router knows only what its neighbours told it ('routing by rumour'). LINK-STATE protocols (OSPF) have every router describe its own links to every other router, so each one builds a full MAP of the network and calculates the best paths itself (with Dijkstra's shortest-path algorithm). Link-state converges faster and scales further, which is why OSPF is the usual choice in enterprises.",
        decision: dec(
          "A company has 40 routers across 15 sites, with backup links between many of them. The network team wants traffic to reroute automatically within seconds when any link fails.",
          "What should they use?",
          ["A dynamic link-state routing protocol such as OSPF", "Automatic, fast reconvergence across many routers is exactly what OSPF provides."],
          [
            ["Static routes on all 40 routers", "Static routes cannot react to failures and would be a nightmare to maintain."],
            ["A default route on every router", "Default routes alone cannot choose between paths or react to failures."],
            ["BGP between every pair of routers inside the company", "BGP is designed for routing between organisations, not for fast internal reconvergence."],
          ]
        ),
      },
      {
        id: "a-nw-metrics-ad",
        title: "Routing metrics and administrative distance",
        explain:
          "When a router has several ways to reach the SAME network, two numbers decide. METRIC compares routes from the SAME protocol: lower is better. RIP's metric is HOP COUNT (the number of routers to cross; 16 means unreachable). OSPF's metric is COST, based on link bandwidth (by default, 100 Mbps divided by the link speed, so faster links cost less). ADMINISTRATIVE DISTANCE (AD) compares routes from DIFFERENT sources: how much the router trusts that source, lower is better. Connected 0, static 1, eBGP 20, OSPF 110, RIP 120, iBGP 200. So if a router learns 10.5.0.0/16 from both OSPF and RIP, it installs the OSPF route (110 beats 120), whatever RIP's hop count says. You saw both in show ip route: [110/2] means AD 110, metric 2. Order of decisions: longest prefix first, then administrative distance, then metric.",
        table: {
          caption: "Default administrative distances (lower is more trusted).",
          headers: ["Route source", "Administrative distance"],
          rows: [
            ["Connected interface", "0"],
            ["Static route", "1"],
            ["eBGP", "20"],
            ["OSPF", "110"],
            ["RIP", "120"],
            ["iBGP", "200"],
          ],
        },
        netCalc: {
          task: "Decide which route a router installs.",
          questions: [
            { q: "A router learns 172.16.0.0/16 from OSPF and from RIP. Which protocol's route is installed?", answer: "OSPF", hint: "Compare administrative distances: 110 and 120.", working: "OSPF 110 < RIP 120 → OSPF" },
            { q: "An administrator adds a static route to a network that OSPF also advertises, with the same prefix. Which wins?", answer: "static", accept: ["static route", "the static route"], hint: "Static AD is 1.", working: "Static 1 < OSPF 110 → static" },
            { q: "RIP offers two paths to the same network: 3 hops and 5 hops. Which hop count is used?", answer: "3", hint: "Same protocol, so compare metrics; lower is better.", working: "Metric 3 < 5 → the 3-hop path" },
            { q: "What is the administrative distance of OSPF?", answer: "110", hint: "Look at the table.", working: "OSPF = 110" },
          ],
          successMessage: "Prefix length, then administrative distance, then metric. That is the whole decision order.",
        },
      },
      {
        id: "a-nw-rip",
        title: "RIP fundamentals",
        explain:
          "RIP (Routing Information Protocol) is the oldest and simplest dynamic routing protocol: distance-vector, metric = hop count, maximum 15 hops (16 = unreachable), every router sending its whole table to its neighbours every 30 seconds. It is slow to converge and does not consider link speed, so it is now used only in small or legacy networks, but it is an excellent way to see dynamic routing work. Always use VERSION 2: it carries subnet masks (so it supports VLSM) and uses multicast. On Cisco, in global configuration mode: router rip enters RIP's configuration mode, prompt R1(config-router)#; version 2 selects version 2; network followed by a CLASSFUL network address (the old Class A, B or C network containing your interfaces, from Module 3) turns RIP on for every interface in it, for example network 192.168.1.0 and network 10.0.0.0; no auto-summary stops RIP summarising to classful boundaries, which breaks discontiguous networks. Then end. After a few seconds, show ip route shows the neighbour's networks with code R and [120/hops].",
        netLab: {
          task:
            "R1 and R2 have no routes to each other's LANs. Configure RIP version 2 on both routers: each advertises its own LAN (192.168.1.0 on R1, 192.168.2.0 on R2) and the shared link network 10.0.0.0, with auto-summary off. Then check show ip route for R routes and ping across.",
          ...TWO_ROUTERS(),
          start: "R1",
          height: 34,
          goals: [
            { type: "route", device: "R1", prefix: "192.168.2.0/24", source: "R", label: "R1 learns 192.168.2.0/24 by RIP" },
            { type: "route", device: "R2", prefix: "192.168.1.0/24", source: "R", label: "R2 learns 192.168.1.0/24 by RIP" },
            { type: "ping", from: "PC1", to: "192.168.2.10", label: "PC1 reaches PC2" },
          ],
          hint: "On R1: enable, configure terminal, router rip, version 2, network 192.168.1.0, network 10.0.0.0, no auto-summary, end. On R2 the same, but with network 192.168.2.0.",
          successMessage: "Neither router was told about the other's LAN: they told each other. Unplug a link in a bigger network and they would tell each other that too.",
        },
      },
      {
        id: "a-nw-ospf",
        title: "OSPF fundamentals",
        explain:
          "OSPF (Open Shortest Path First) is the standard enterprise interior protocol: link-state, metric = COST (based on bandwidth), fast convergence, no hop limit, and support for hierarchy through AREAS (every OSPF network has a backbone, AREA 0, which other areas connect to). OSPF routers first become NEIGHBOURS: they exchange Hello packets (multicast 224.0.0.5, every 10 seconds on Ethernet) and must agree on the subnet, area and timers. Then they synchronise their link-state databases and each runs the shortest-path calculation. On Cisco, in global configuration mode: router ospf 1 starts OSPF (1 is a local process number); then network followed by an address, a WILDCARD MASK (the inverse of the subnet mask, met in Module 4's PAT lesson: 0.0.0.255 for a /24, 0.0.0.3 for a /30) and area 0 turns OSPF on for every interface in that range, for example network 192.168.1.0 0.0.0.255 area 0 and network 10.0.12.0 0.0.0.3 area 0. Then end. show ip ospf neighbor lists the neighbours (state FULL means the databases are synchronised), and show ip route shows learned routes with code O and [110/cost].",
        netLab: {
          task:
            "Configure OSPF process 1 on R1 and R2, all in area 0. Each router advertises its LAN (192.168.1.0/24 or 192.168.2.0/24) and the link 10.0.12.0/30. Check the neighbourship with show ip ospf neighbor, the routes with show ip route, then ping across.",
          ...TWO_ROUTERS(),
          start: "R1",
          height: 34,
          goals: [
            { type: "route", device: "R1", prefix: "192.168.2.0/24", source: "O", label: "R1 learns 192.168.2.0/24 by OSPF" },
            { type: "route", device: "R2", prefix: "192.168.1.0/24", source: "O", label: "R2 learns 192.168.1.0/24 by OSPF" },
            { type: "ping", from: "PC1", to: "192.168.2.10", label: "PC1 reaches PC2" },
          ],
          hint: "On R1: enable, configure terminal, router ospf 1, network 192.168.1.0 0.0.0.255 area 0, network 10.0.12.0 0.0.0.3 area 0, end. On R2 the same with network 192.168.2.0 0.0.0.255 area 0.",
          successMessage: "Neighbours formed, databases synchronised, routes calculated. The same commands scale to hundreds of routers.",
        },
      },
      {
        id: "a-nw-bgp",
        title: "BGP and its role in internet routing",
        explain:
          "The internet is made of about 75,000 AUTONOMOUS SYSTEMS (ASes): networks run by one organisation with one routing policy, each identified by an AS NUMBER (MTN Nigeria, MainOne, Google and Cloudflare each have one or more). BGP (Border Gateway Protocol, TCP port 179) is how ASes tell each other which address blocks (PREFIXES) they can reach. It is a PATH-VECTOR protocol: each route carries the list of ASes it has passed through (the AS PATH), which prevents loops and lets each AS apply POLICY: prefer a cheaper provider, avoid a competitor, accept only customers' own prefixes. Between ASes it is called eBGP (AD 20); inside one AS, iBGP (AD 200). BGP chooses routes by policy and path attributes rather than speed, and converges slowly by design, because stability matters more than seconds on a global scale. Mistakes in BGP have taken down large parts of the internet: when an AS wrongly announces someone else's prefixes (a ROUTE LEAK or hijack), traffic can be pulled across the world. Module 6 returns to ASes and exchange points.",
        decision: dec(
          "An African cloud provider connects to three internet providers and wants to announce its own address blocks to all of them, and to choose which provider its outgoing traffic uses based on cost.",
          "Which protocol does it need?",
          ["BGP, run with each provider (eBGP), which carries prefixes between autonomous systems and lets the provider apply routing policy", "Routing between organisations with policy is BGP's purpose."],
          [
            ["OSPF with each provider", "OSPF is an interior protocol for one organisation's network."],
            ["RIP version 2", "RIP is a small interior protocol with a 15-hop limit."],
            ["A default route to each provider", "Default routes cannot announce its prefixes or apply policy."],
          ]
        ),
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 9 · 5.26 – 5.29
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "nw-sr9-interconnect",
    moduleId: M,
    sectionId: SECTION_ID,
    order: 9,
    covers: ["5.26", "5.27", "5.28", "5.29"],
    title: "Connecting Networks, Router-on-a-Stick and Troubleshooting",
    subtitle: "End-to-end paths, one router for many VLANs, and finding what is broken",
    estimatedMinutes: 60,
    intro:
      "Time to put switching and routing together: follow a packet across several networks, route VLANs through a single router port, find a routing fault, and fix an interface problem that a ping hides.",

    atoms: [
      {
        id: "a-nw-internetwork",
        title: "Inter-network communication, end to end",
        explain:
          "Here is everything you have learned, in one journey. PC1 (192.168.1.10/24) opens a page on a server at 172.16.5.20, three routers away. 1. PC1 compares the server's address with its own using its mask: different network, so it will send to its DEFAULT GATEWAY. 2. It ARPs for the gateway's MAC (or uses its ARP cache). 3. It builds a frame: destination MAC = the router's, destination IP = the SERVER's. The switch forwards it by MAC to the router's port. 4. The router strips the frame, finds the longest-prefix route for 172.16.5.20, decreases the TTL, ARPs for the next hop's MAC, and sends a NEW frame on the next link. The IP addresses stay the same; only the MAC addresses change. 5. Each router repeats step 4. 6. The last router finds 172.16.5.0/24 directly connected, ARPs for the server itself, and delivers the frame. 7. The server replies, and the whole process runs in reverse, which needs every router on the return path to have a route back to 192.168.1.0/24. Every fault you will troubleshoot is one of these steps going wrong.",
        decision: dec(
          "A packet from PC1 to a server crosses three routers.",
          "Which addresses in the packet change at each router, and which stay the same?",
          ["The source and destination MAC addresses change on every link; the source and destination IP addresses stay the same end to end", "Layer 2 addresses are per link; Layer 3 addresses are end to end (NAT aside)."],
          [
            ["The IP addresses change at every router; the MACs stay the same", "That is backwards."],
            ["Nothing changes; the original frame is passed along", "Each router builds a new frame for the next link."],
            ["Only the TTL stays the same", "The TTL is the one IP field that does change: it decreases by one at every router."],
          ]
        ),
      },
      {
        id: "a-nw-router-on-a-stick",
        title: "Router-on-a-stick",
        explain:
          "ROUTER-ON-A-STICK routes between VLANs using ONE router interface connected to a switch TRUNK. The router's physical interface is divided into SUBINTERFACES, one per VLAN, named with a dot and a number: g0/0.10 for VLAN 10, g0/0.20 for VLAN 20 (the number after the dot is only a label, but matching it to the VLAN keeps things readable). On each subinterface, encapsulation dot1Q followed by the VLAN number tells the router which 802.1Q tag that subinterface sends and receives, and ip address gives it the VLAN's gateway address. The physical interface itself has no IP address; it just needs no shutdown. On the switch, the port facing the router must be a trunk (switchport mode trunk). Traffic from VLAN 10 to VLAN 20 goes up the trunk tagged 10, is routed between the two subinterfaces, and comes back down the same cable tagged 20. It is cheap and works with any router, but every inter-VLAN packet crosses that one link twice, so busy networks use a Layer 3 switch instead (Lesson 5).",
        netLab: {
          task:
            "SW1 has VLAN 10 (PC1, 192.168.10.0/24) and VLAN 20 (PC2, 192.168.20.0/24). R1's G0/0 is cabled to SW1's G0/1. Make SW1's G0/1 a trunk, bring up R1's G0/0, and create subinterfaces G0/0.10 (VLAN 10, 192.168.10.1/24) and G0/0.20 (VLAN 20, 192.168.20.1/24). Then ping PC2 from PC1.",
          devices: [
            { id: "R1", kind: "router", x: 50, y: 6 },
            { id: "SW1", kind: "switch", x: 50, y: 26 },
            { id: "PC1", kind: "pc", x: 22, y: 46, ip: "192.168.10.11/24", gateway: "192.168.10.1", note: "VLAN 10" },
            { id: "PC2", kind: "pc", x: 78, y: 46, ip: "192.168.20.11/24", gateway: "192.168.20.1", note: "VLAN 20" },
          ],
          links: [["R1:g0/0", "SW1:g0/1"], ["PC1:fa0", "SW1:fa0/1"], ["PC2:fa0", "SW1:fa0/2"]],
          config: {
            R1: "hostname R1",
            SW1: "hostname SW1\nvlan 10\n name SALES\nvlan 20\n name ADMIN\ninterface fa0/1\n switchport mode access\n switchport access vlan 10\ninterface fa0/2\n switchport mode access\n switchport access vlan 20",
          },
          start: "SW1",
          height: 50,
          goals: [
            { type: "trunk", device: "SW1", port: "g0/1", vlans: [10, 20], label: "SW1 G0/1 trunks VLANs 10 and 20 to the router" },
            { type: "ip", device: "R1", iface: "g0/0.10", address: "192.168.10.1/24", label: "R1 G0/0.10 is VLAN 10's gateway" },
            { type: "ip", device: "R1", iface: "g0/0.20", address: "192.168.20.1/24", label: "R1 G0/0.20 is VLAN 20's gateway" },
            { type: "ping", from: "PC1", to: "192.168.20.11", label: "VLAN 10 reaches VLAN 20 through the router" },
          ],
          hint: "SW1: enable, configure terminal, interface g0/1, switchport mode trunk, end. R1: enable, configure terminal, interface g0/0, no shutdown, exit, interface g0/0.10, encapsulation dot1Q 10, ip address 192.168.10.1 255.255.255.0, exit, interface g0/0.20, encapsulation dot1Q 20, ip address 192.168.20.1 255.255.255.0, end.",
          successMessage: "One cable, two VLANs, routed by subinterfaces. Every frame on that link carries an 802.1Q tag saying which network it belongs to.",
        },
      },
      {
        id: "a-nw-route-troubleshooting",
        title: "Basic route troubleshooting",
        explain:
          "When a remote network is unreachable, work through it methodically rather than guessing. 1. From the source, ping the GATEWAY: if that fails, the problem is local (address, mask, cable, VLAN). 2. tracert (traceroute) to the destination: the last router that answers is where to look. A reply saying 'Destination host unreachable' from a router means THAT router has no route. 3. On the suspect router, show ip route: is there a route to the destination network, and does its next hop make sense? Is the interface it uses up (show ip interface brief)? 4. Remember the RETURN PATH: a ping can fail because the reply has no route home, even when every route towards the destination is perfect. tracert from the far end, or check every router's table for a route back to the source network. 5. Fix one thing, then test again. In the lab below, PC1 cannot reach the server. Nobody will tell you which router is wrong: use ping, tracert and show ip route to find out.",
        netLab: {
          task:
            "PC1 (192.168.1.10) cannot reach the server 172.16.5.20, which sits behind R3. The PCs and the server are configured correctly. Find the router with the missing route and add it.",
          devices: [
            { id: "PC1", kind: "pc", x: 6, y: 30, ip: "192.168.1.10/24", gateway: "192.168.1.1" },
            { id: "R1", kind: "router", x: 30, y: 30 },
            { id: "R2", kind: "router", x: 54, y: 30 },
            { id: "R3", kind: "router", x: 76, y: 30 },
            { id: "Server", kind: "server", x: 96, y: 30, ip: "172.16.5.20/24", gateway: "172.16.5.1" },
          ],
          links: [["PC1:fa0", "R1:g0/0"], ["R1:g0/1", "R2:g0/0"], ["R2:g0/1", "R3:g0/0"], ["R3:g0/1", "Server:fa0"]],
          config: {
            R1: "hostname R1\ninterface g0/0\n ip address 192.168.1.1 255.255.255.0\n no shutdown\ninterface g0/1\n ip address 10.1.12.1 255.255.255.252\n no shutdown\nip route 0.0.0.0 0.0.0.0 10.1.12.2",
            R2: "hostname R2\ninterface g0/0\n ip address 10.1.12.2 255.255.255.252\n no shutdown\ninterface g0/1\n ip address 10.1.23.1 255.255.255.252\n no shutdown\nip route 172.16.5.0 255.255.255.0 10.1.23.2",
            R3: "hostname R3\ninterface g0/0\n ip address 10.1.23.2 255.255.255.252\n no shutdown\ninterface g0/1\n ip address 172.16.5.1 255.255.255.0\n no shutdown\nip route 0.0.0.0 0.0.0.0 10.1.23.1",
          },
          start: "PC1",
          height: 34,
          goals: [{ type: "ping", from: "PC1", to: "172.16.5.20", label: "PC1 reaches the server, there and back" }],
          hint: "tracert from PC1 gets as far as R3, so the request arrives. Look at the way back: the server's replies go to R3 (default route to R2), then R2, then … does R2 know where 192.168.1.0/24 is? show ip route on R2. Add ip route 192.168.1.0 255.255.255.0 10.1.12.1 on R2.",
          successMessage: "Every route towards the server was correct; R2 simply had no way to send the replies home. Always check the return path.",
        },
      },
      {
        id: "a-nw-interface-config",
        title: "Network interface configuration",
        explain:
          "Interfaces have settings beyond an IP address, and a professional sets them deliberately. description followed by text labels the interface (description Uplink to R1), so the next engineer knows what is plugged in; it appears in show interfaces and the running configuration. speed and duplex set the link speed (10, 100, 1000 or auto) and duplex (full, half or auto). The rule that matters: BOTH ENDS must match. Leave both on auto (best practice for most links) or hard-set both to the same values. If one end is hard-set to full duplex and the other is on auto, auto-negotiation fails on that side, it falls back to HALF duplex, and you get a DUPLEX MISMATCH (Module 2): the link comes up, pings mostly work, but the half-duplex side sees collisions and drops frames, and the full-duplex side counts CRC errors, so throughput collapses. To check, show interfaces followed by the interface name, such as show interfaces g0/1, shows the description, speed, duplex and error counters (CRC, late collisions). To put a setting back to automatic: duplex auto and speed auto. In the lab, one end of the uplink was hard-set by someone long gone.",
        netLab: {
          task:
            "Users behind SW1 report slow, unreliable access through R1, and pings sometimes fail. Inspect SW1's uplink to R1 (G0/1) with show interfaces g0/1, compare it with R1's G0/0, and fix the mismatch so pings never drop. Give the uplink the description Uplink to R1 while you are there.",
          devices: [
            { id: "PC1", kind: "pc", x: 10, y: 30, ip: "192.168.1.10/24", gateway: "192.168.1.1" },
            { id: "SW1", kind: "switch", x: 42, y: 30 },
            { id: "R1", kind: "router", x: 76, y: 30 },
          ],
          links: [["PC1:fa0", "SW1:fa0/1"], ["SW1:g0/1", "R1:g0/0"]],
          config: {
            SW1: "hostname SW1\ninterface g0/1\n duplex full\n speed 100",
            R1: "hostname R1\ninterface g0/0\n ip address 192.168.1.1 255.255.255.0\n no shutdown",
          },
          start: "SW1",
          height: 34,
          goals: [{ type: "noLoss", from: "PC1", to: "192.168.1.1", label: "PC1 pings R1 with no loss" }],
          hint: "show interfaces g0/1 on SW1 shows Full-duplex, 100Mb/s hard-set; R1's G0/0 is on auto, so it fell back to half duplex. On SW1: configure terminal, interface g0/1, description Uplink to R1, duplex auto, speed auto, end.",
          successMessage: "Both ends negotiating again, full duplex at full speed, no more lost frames. The link was 'up' the whole time, which is what makes duplex mismatches so hard to spot without show interfaces.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 10 · 5.30 – 5.34
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "nw-sr10-hardware",
    moduleId: M,
    sectionId: SECTION_ID,
    order: 10,
    covers: ["5.30", "5.31", "5.32", "5.33", "5.34"],
    title: "Network Hardware in the Real World",
    subtitle: "Routers, switches, access points, ONTs, patch panels and racks",
    estimatedMinutes: 40,
    intro:
      "So far you have configured devices on a diagram. This lesson walks into a real wiring cabinet: what the boxes are, how they are mounted and cabled, and how professionals keep it all manageable.",

    atoms: [
      {
        id: "a-nw-routers-switches-hw",
        title: "Routers and switches as hardware",
        explain:
          "Enterprise ROUTERS (Cisco ISR, Juniper SRX, MikroTik, and others) have a few WAN and LAN ports, often with modules for fibre or mobile links, and are chosen by THROUGHPUT (how many Mbps or Gbps they can route, with services like NAT, VPN and firewalling turned on, which can cut it sharply), by the interfaces they need, and by features. Many sites now use a FIREWALL (Module 8) as their edge router. SWITCHES are chosen by port count, speed, PoE budget, Layer 2 or Layer 3, and management features. Both have a CONSOLE port (RJ-45 or USB) for first-time set-up with a console cable and a terminal program, before any IP address exists; you used the NetLab equivalent all course. Both store their settings in RUNNING-CONFIG (in memory, lost at power-off) and STARTUP-CONFIG (saved): copy running-config startup-config saves your work. Check the vendor's end-of-life dates: unsupported equipment stops getting security fixes.",
        decision: dec(
          "An engineer configures a new router all afternoon, tests everything, and goes home. A power cut overnight restarts the router, and in the morning it has none of the configuration.",
          "What was missed?",
          ["Saving the configuration with copy running-config startup-config, so it survives a restart", "The running configuration lives in memory; only the startup configuration is loaded at boot."],
          [
            ["The router needed a faster CPU", "Speed has nothing to do with losing configuration."],
            ["The console cable should have stayed plugged in", "The console cable does not store anything."],
            ["Routers always forget their configuration after a power cut", "Not if it was saved to the startup configuration."],
          ]
        ),
      },
      {
        id: "a-nw-aps-hw",
        title: "Wireless access points",
        explain:
          "An ACCESS POINT (AP) bridges Wi-Fi clients onto the wired network. Enterprise APs are mounted on ceilings for the best coverage, powered over Ethernet (PoE) from the switch, and connected to an access port or to a trunk if they carry several SSIDs in different VLANs (staff, guest, IoT). They come in three management styles. AUTONOMOUS (standalone) APs are configured one by one, which is fine for two or three. CONTROLLER-BASED APs are managed centrally by a wireless LAN CONTROLLER (WLC) that pushes settings, coordinates channels and power, and handles roaming between APs. CLOUD-MANAGED APs (such as Cisco Meraki, Ubiquiti UniFi) are configured from a web dashboard over the internet. The home 'Wi-Fi router' combines an AP with a router and a switch. Module 6 covers wireless standards, channels, coverage and security in depth.",
        decision: dec(
          "A university is installing 300 access points across 20 buildings and wants consistent settings, automatic channel planning and seamless roaming as students walk between lecture halls.",
          "Which kind of access points should it choose?",
          ["Controller-based (or cloud-managed) APs, managed centrally", "Hundreds of APs need central configuration, channel coordination and roaming support."],
          [
            ["Autonomous APs, each configured by hand", "Configuring 300 APs individually is slow and inconsistent."],
            ["Home Wi-Fi routers in every room", "Each would be a separate network with its own addressing and no coordinated roaming."],
            ["No APs: students should use mobile data", "That ignores the requirement."],
          ]
        ),
      },
      {
        id: "a-nw-modems-onts",
        title: "Modems and ONTs",
        explain:
          "The device where the provider's line enters a building converts the provider's medium to Ethernet. A DSL MODEM uses the telephone copper line; a CABLE MODEM uses the coaxial TV cable; a 4G/5G ROUTER uses the mobile network (common for small offices and backup links in Nigeria, where fixed lines may not reach); and an ONT (optical network terminal) terminates FIBRE TO THE HOME or premises, converting light to Ethernet. ISPs installing fibre (in Lagos, Abuja and other cities) put an ONT in the building, often combined with a Wi-Fi router. Enterprises usually receive a DEDICATED circuit terminated by the provider's own router or media converter, handing off on an Ethernet or fibre port to the customer's firewall or edge router. That point is the DEMARCATION POINT (demarc): the provider is responsible for everything up to it, the customer for everything after. Knowing where the demarc is decides whom you call when the link fails.",
        decision: dec(
          "A company's internet link fails. The lights on the provider's ONT show that the fibre signal is lost, while the company's own firewall and switches are all working.",
          "Who should fix this, and why?",
          ["The ISP: the fault is on their side of the demarcation point, on the fibre to the ONT", "The demarc divides responsibility; a lost optical signal is the provider's problem."],
          [
            ["The company's network team, by rebooting every switch", "The switches are fine; the fault is upstream of the demarc."],
            ["The firewall vendor", "The firewall is working and is not the cause."],
            ["Nobody: fibre faults fix themselves", "A lost optical signal needs the provider to find the break."],
          ]
        ),
      },
      {
        id: "a-nw-patch-panels",
        title: "Patch panels and structured cabling",
        explain:
          "STRUCTURED CABLING is the standards-based way to cable a building (TIA-568 in the Americas and widely used elsewhere; ISO/IEC 11801 internationally). HORIZONTAL cables run, permanently, from each WALL OUTLET in a work area to a PATCH PANEL in the TELECOMMUNICATIONS ROOM (wiring closet) on that floor, at most 90 m, leaving 10 m for patch cords (the 100 m Ethernet limit). Each panel port is numbered to match its wall outlet. Short PATCH CORDS then connect each panel port to a switch port. BACKBONE (vertical) cabling, usually fibre, links the floor closets to the main equipment room. The benefit: the long cables never move. To connect, move or disconnect a desk you change one patch cord in the closet. LABELLING every outlet, panel port and cable at both ends, and keeping a record, is what makes the cabling manageable for twenty years; unlabelled 'spaghetti' turns every change into hours of tracing.",
        decision: dec(
          "A new employee needs their desk connected to the HR VLAN. The wall outlet at the desk is labelled 3-14.",
          "In a properly structured building, what does the technician do?",
          ["In the floor 3 closet, connect patch panel port 14 to a switch port in the HR VLAN with a patch cord", "The horizontal cable to outlet 3-14 already ends at panel port 14; only the patch cord changes."],
          [
            ["Run a new cable from the desk to the switch", "The permanent horizontal cable is already installed; re-cabling is exactly what structured cabling avoids."],
            ["Move a switch next to the desk", "Switches live in the closet."],
            ["Change the employee's IP address only", "The port must be patched and placed in the right VLAN first."],
          ]
        ),
      },
      {
        id: "a-nw-racks",
        title: "Rack-mounted network equipment",
        explain:
          "Network equipment is mounted in standard 19-inch RACKS (or wall-mounted cabinets in small closets). Height is measured in RACK UNITS (U): 1U = 1.75 inches (44.45 mm). A typical switch or patch panel is 1U, a small server 1U or 2U, a UPS (uninterruptible power supply) 2U or more, and a full-height rack holds 42U. A good rack plan alternates patch panels and switches so patch cords stay short, uses cable managers (horizontal 1U guides and vertical channels), puts heavy UPS batteries at the bottom, and leaves space for growth and airflow (equipment usually draws cool air in at the front and blows hot air out of the back, so racks face front-to-front in 'cold aisles'). POWER: two separate power feeds where possible, a UPS so equipment survives short outages (essential where grid power is unreliable and a generator takes a minute to start), and PDUs (power distribution units) in the rack. Plan the space before you buy.",
        netCalc: {
          task: "Plan a 42U rack.",
          questions: [
            { q: "How many inches tall is 1U?", answer: "1.75", hint: "It is the standard rack unit.", working: "1U = 1.75 in (44.45 mm)" },
            { q: "A closet rack will hold 4 switches (1U each), 4 patch panels (1U each), 4 cable managers (1U each), 2 servers (2U each) and a UPS (3U). How many U is that?", answer: "19", hint: "4 + 4 + 4 + (2 × 2) + 3.", working: "4 + 4 + 4 + 4 + 3 = 19U" },
            { q: "How many U are left for growth in the 42U rack?", answer: "23", hint: "42 minus what you just added up.", working: "42 − 19 = 23U free" },
          ],
          successMessage: "Count U before you order, and leave room: closets always fill up faster than planned.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 11 · 5.35 – 5.37, 5.P
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "nw-sr11-cabling-practical",
    moduleId: M,
    sectionId: SECTION_ID,
    order: 11,
    covers: ["5.35", "5.36", "5.37", "5.P"],
    title: "Cables, Fibre, PoE and the Practical",
    subtitle: "Which cable for which speed, how fibre is used, powering devices, and a full build",
    estimatedMinutes: 70,
    intro:
      "The last pieces of infrastructure: Ethernet standards and cable categories, fibre in practice, and Power over Ethernet. Then you build a two-department network from scratch with everything this module taught.",

    atoms: [
      {
        id: "a-nw-ethernet-standards",
        title: "Ethernet standards and cable categories",
        explain:
          "Ethernet standards are named like 1000BASE-T: the SPEED in Mbps (1000 = 1 Gbps), BASE for baseband signalling, and the MEDIUM (T = twisted pair; SX, LX and others = fibre). The common copper ones are 100BASE-TX (100 Mbps), 1000BASE-T (1 Gbps, the normal desk connection) and 10GBASE-T (10 Gbps). Copper cable is graded by CATEGORY: CAT5e supports 1 Gbps to 100 m and is the minimum today; CAT6 supports 1 Gbps to 100 m and 10 Gbps to about 55 m; CAT6a supports 10 Gbps to the full 100 m and is the usual choice for new buildings; CAT8 supports 25 or 40 Gbps but only to 30 m, for data-centre racks. Wires are terminated in RJ-45 plugs using one of two colour orders, T568A or T568B (pick one and use it everywhere). A STRAIGHT-THROUGH cable has the same order at both ends; a CROSSOVER had the pairs swapped and was once needed between two switches or two PCs, but modern ports detect and correct this automatically (Auto-MDIX).",
        table: {
          caption: "Copper cable categories.",
          headers: ["Category", "Supports", "Typical use"],
          rows: [
            ["Cat5e", "1 Gbps to 100 m", "Minimum for existing desks"],
            ["Cat6", "1 Gbps to 100 m; 10 Gbps to about 55 m", "Offices"],
            ["Cat6a", "10 Gbps to 100 m", "New buildings, Wi-Fi 6/7 access points"],
            ["Cat8", "25–40 Gbps to 30 m", "Between racks in data centres"],
          ],
        },
        decision: dec(
          "A new office building is being cabled. The ceiling access points will need 10 Gbps uplinks within a few years, and some cable runs are 85 m long.",
          "Which cable category should be installed?",
          ["Cat6a, which supports 10 Gbps over the full 100 m", "Cat6 reaches 10 Gbps only to about 55 m; Cat6a covers 85 m runs."],
          [
            ["Cat5e", "Cat5e tops out at 1 Gbps."],
            ["Cat6", "Cat6 supports 10 Gbps only to about 55 m, short of 85 m."],
            ["Cat8", "Cat8 is limited to 30 m and is meant for data-centre racks."],
          ]
        ),
      },
      {
        id: "a-nw-fibre",
        title: "Fibre-optic networking fundamentals",
        explain:
          "Module 2 introduced fibre; here is how it is used. SINGLE-MODE fibre (SMF, a 9-micron core, usually yellow jacket) carries one path of laser light for kilometres (10 km, 40 km and more): campus links, metro and long-haul. MULTIMODE fibre (MMF, a 50-micron core; OM3 and OM4 have aqua jackets) carries many light paths and suits runs up to a few hundred metres inside buildings and data centres, with cheaper optics. Fibre usually runs in PAIRS (one strand each way). Connectors include LC (small, the most common today), SC (square) and MPO (many fibres at once, in data centres). Switches take TRANSCEIVERS in SFP or SFP+ slots (QSFP for 40/100 Gbps), and the transceiver must match the fibre type and distance: a 1000BASE-SX optic for multimode, 1000BASE-LX or 10GBASE-LR for single-mode. Keep connector ends clean (a speck of dust blocks the light), respect the minimum bend radius, and never look into a fibre or an optic: the laser light is invisible and can damage your eyes.",
        decision: dec(
          "A campus needs a 10 Gbps link between two buildings 2 km apart. The switches have SFP+ slots.",
          "What fibre and optics should be used?",
          ["Single-mode fibre with 10GBASE-LR SFP+ transceivers at each end", "2 km is far beyond multimode's reach; LR optics are designed for single-mode over kilometres."],
          [
            ["Multimode OM4 with short-range (SR) optics", "Multimode 10 Gbps reaches only a few hundred metres."],
            ["Cat6a copper", "Copper stops at 100 m."],
            ["Single-mode fibre with multimode optics", "The transceivers must match the fibre type."],
          ]
        ),
      },
      {
        id: "a-nw-poe",
        title: "PoE: Power over Ethernet",
        explain:
          "POWER OVER ETHERNET delivers electrical power and data over the same twisted-pair cable, so phones, cameras, access points and sensors need no power socket where they are mounted. The switch (or a separate INJECTOR) is the power source; the device is the powered device. Standards: 802.3af (PoE) supplies up to 15.4 W per port at the switch; 802.3at (PoE+) up to 30 W; 802.3bt (PoE++) up to 60 W (Type 3) or 90 W (Type 4), for things like pan-tilt cameras and large access points. A little power is lost in the cable, so devices receive slightly less. Crucially, every PoE switch has a total POWER BUDGET (for example 370 W across all ports), and when it is used up, further devices do not power on, even with ports free. So plan by adding up each device's power: if you exceed the budget, choose a bigger switch or spread devices across switches. A UPS behind the PoE switch keeps phones and cameras running during power cuts.",
        netCalc: {
          task: "A 48-port PoE+ switch has a total budget of 370 W. It must power 10 IP phones at 7 W each and 8 access points at 25.5 W each.",
          questions: [
            { q: "How many watts do the 10 phones need?", answer: "70", hint: "10 × 7.", working: "10 × 7 = 70 W" },
            { q: "How many watts do the 8 access points need?", answer: "204", hint: "8 × 25.5.", working: "8 × 25.5 = 204 W" },
            { q: "How many watts of the budget are left?", answer: "96", hint: "370 − (70 + 204).", working: "370 − 274 = 96 W" },
            { q: "How many MORE 25.5 W access points could the switch power?", answer: "3", hint: "96 ÷ 25.5, rounded down.", working: "96 ÷ 25.5 = 3.76 → 3 more" },
          ],
          successMessage: "Free ports are not the limit; the power budget is. Add it up before you plug in the cameras.",
        },
      },
      {
        id: "a-nw-departments-build",
        title: "Practical: a two-department network, built from scratch",
        explain:
          "Now build a small network end to end with no step-by-step instructions, using only commands you have already used in this module. The design: two departments, SALES (VLAN 10, 192.168.10.0/24) and ADMIN (VLAN 20, 192.168.20.0/24), on one access switch; one router doing router-on-a-stick, with each department's gateway at .1. Work in this order, testing as you go: 1. create the VLANs on the switch and put each PC's port in its VLAN as an access port; 2. make the switch port facing the router a trunk; 3. on the router, bring up the physical interface and create one subinterface per VLAN with its 802.1Q tag and gateway address; 4. test within each VLAN, then between VLANs. If something fails, use show vlan brief, show interfaces trunk, show ip interface brief and show ip route to find out which step went wrong.",
        netLab: {
          task:
            "Build it: on SW1, VLAN 10 named SALES (Fa0/1, PC-Sales) and VLAN 20 named ADMIN (Fa0/2, PC-Admin), with G0/1 trunking to R1; on R1, router-on-a-stick with G0/0.10 = 192.168.10.1/24 and G0/0.20 = 192.168.20.1/24. The PCs are already addressed. Prove each PC reaches its gateway and the other department.",
          devices: [
            { id: "R1", kind: "router", x: 50, y: 6 },
            { id: "SW1", kind: "switch", x: 50, y: 26 },
            { id: "PC-Sales", kind: "pc", x: 22, y: 46, ip: "192.168.10.20/24", gateway: "192.168.10.1", note: "Sales" },
            { id: "PC-Admin", kind: "pc", x: 78, y: 46, ip: "192.168.20.20/24", gateway: "192.168.20.1", note: "Admin" },
          ],
          links: [["R1:g0/0", "SW1:g0/1"], ["PC-Sales:fa0", "SW1:fa0/1"], ["PC-Admin:fa0", "SW1:fa0/2"]],
          config: { R1: "hostname R1", SW1: "hostname SW1" },
          start: "SW1",
          height: 50,
          goals: [
            { type: "vlan", device: "SW1", ports: ["fa0/1"], vlan: 10, label: "PC-Sales's port is in VLAN 10" },
            { type: "vlan", device: "SW1", ports: ["fa0/2"], vlan: 20, label: "PC-Admin's port is in VLAN 20" },
            { type: "trunk", device: "SW1", port: "g0/1", vlans: [10, 20], label: "G0/1 trunks both VLANs to R1" },
            { type: "ping", from: "PC-Sales", to: "192.168.10.1", label: "Sales reaches its gateway" },
            { type: "ping", from: "PC-Sales", to: "192.168.20.20", label: "Sales reaches Admin through R1" },
          ],
          hint: "SW1: vlan 10, name SALES, vlan 20, name ADMIN, interface fa0/1 (switchport mode access, switchport access vlan 10), interface fa0/2 (… vlan 20), interface g0/1 (switchport mode trunk). R1: interface g0/0, no shutdown, interface g0/0.10 (encapsulation dot1Q 10, ip address 192.168.10.1 255.255.255.0), interface g0/0.20 (encapsulation dot1Q 20, ip address 192.168.20.1 255.255.255.0).",
          successMessage: "VLANs, a trunk and router-on-a-stick, built and tested by you. The capstone does the same for five departments.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },

    task: {
      title: "Module 5 practical: switches and routers, configured",
      intro:
        "Use Cisco Packet Tracer (free from Cisco's Networking Academy) or NetLab. Save each network: you will extend it in Modules 8 and 9 and in the capstone.",
      prompts: [
        "Configure two switches and a router with hostnames, management addresses and saved configurations.",
        "Create a VLAN for each of three departments, assign ports, and verify with show vlan brief.",
        "Configure a trunk link between the two switches and verify which VLANs it carries.",
        "Build two separate networks joined by two routers, and connect them first with static routes, then with OSPF.",
        "Configure inter-VLAN communication with router-on-a-stick, then with a Layer 3 switch, and compare the two.",
        "Break your own network deliberately (remove a return route, mismatch a native VLAN, shut a trunk) and practise finding each fault with show commands, ping and tracert.",
      ],
      closing:
        "Cables reach desks; radio reaches everyone else. Module 6 covers wireless networks, and how your traffic crosses the internet to the websites you use.",
    },
  },
];
