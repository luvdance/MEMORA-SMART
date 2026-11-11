/**
 * COMPUTER NETWORKING · MODULE 9 · NETWORK MONITORING, TROUBLESHOOTING AND PERFORMANCE
 *
 * Curriculum 9.1 – 9.18 and the practical. A troubleshooting method;
 * physical, IP, DNS, DHCP and routing faults; packet loss, latency and
 * jitter, bandwidth, congestion and interface errors; packet captures,
 * monitoring, SNMP and logs; documentation, maintenance and root cause
 * analysis; then networks with faults nobody tells you about.
 *
 * Every lab here contains a deliberate fault and asks for an outcome, not a
 * command list: the tools needed were all taught in Modules 1 to 8. New in
 * this module, taught before use: dig @server, the tcp.flags.reset filter,
 * tcpdump, and removing a routing statement with no network.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

import { cap, dec, term } from "./nw-kit.js";

export const SECTION_ID = "nw-s9-troubleshooting";
const M = "nw-m9-troubleshooting";

const SYSLOG_FIELDS = [
  { id: "device", label: "Device" },
  { id: "interface", label: "Interface" },
  { id: "message", label: "Message" },
  { id: "severity", label: "Severity" },
];

const SYSLOG = [
  { id: "l1", time: "08:01:12", device: "SW-FL2", interface: "Gi1/0/7", message: "%LINK-3-UPDOWN: Interface changed state to down", severity: 3, attack: true },
  { id: "l2", time: "08:01:15", device: "SW-FL2", interface: "Gi1/0/7", message: "%LINK-3-UPDOWN: Interface changed state to up", severity: 3, attack: true },
  { id: "l3", time: "08:03:40", device: "SW-FL1", interface: "Gi1/0/2", message: "%SYS-5-CONFIG_I: Configured from console by netadmin", severity: 5 },
  { id: "l4", time: "08:04:02", device: "SW-FL2", interface: "Gi1/0/7", message: "%LINK-3-UPDOWN: Interface changed state to down", severity: 3, attack: true },
  { id: "l5", time: "08:04:05", device: "SW-FL2", interface: "Gi1/0/7", message: "%LINK-3-UPDOWN: Interface changed state to up", severity: 3, attack: true },
  { id: "l6", time: "08:10:00", device: "R1", interface: "Gi0/1", message: "%OSPF-5-ADJCHG: Neighbor 10.0.0.2 from LOADING to FULL", severity: 5 },
  { id: "l7", time: "08:12:31", device: "SW-FL2", interface: "Gi1/0/7", message: "%LINK-3-UPDOWN: Interface changed state to down", severity: 3, attack: true },
  { id: "l8", time: "08:12:34", device: "SW-FL2", interface: "Gi1/0/7", message: "%LINK-3-UPDOWN: Interface changed state to up", severity: 3, attack: true },
  { id: "l9", time: "09:30:00", device: "SW-FL1", interface: "Gi1/0/14", message: "%LINK-3-UPDOWN: Interface changed state to up", severity: 3 },
  { id: "l10", time: "09:45:10", device: "SW-FL3", interface: "Gi1/0/3", message: "%LINK-3-UPDOWN: Interface changed state to down", severity: 3 },
  { id: "l11", time: "10:02:44", device: "R1", interface: "Gi0/0", message: "%SEC-6-IPACCESSLOGP: list 110 denied tcp 192.168.30.10", severity: 6 },
  { id: "l12", time: "10:20:01", device: "SW-FL2", interface: "Gi1/0/7", message: "%LINK-3-UPDOWN: Interface changed state to down", severity: 3, attack: true },
];

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 1 · 9.1 – 9.2
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "nw-ts1-method",
    moduleId: M,
    sectionId: SECTION_ID,
    order: 1,
    covers: ["9.1", "9.2"],
    title: "A Method for Troubleshooting, and the Physical Layer",
    subtitle: "How professionals find faults quickly, starting at the bottom",
    estimatedMinutes: 40,
    intro:
      "Experienced engineers are not faster because they know more commands. They are faster because they follow a method and never guess. This module gives you the method, then a series of broken networks to practise it on.",

    atoms: [
      {
        id: "a-nw-ts-methodology",
        title: "Network troubleshooting methodology",
        explain:
          "A widely used method (CompTIA's, similar to Cisco's) has seven steps. 1. IDENTIFY THE PROBLEM: gather information, question users ('what exactly fails, since when, for whom, did anything change?'), reproduce it, and define its scope (one user, one floor, everyone?). 2. ESTABLISH A THEORY of probable cause, starting with the obvious. 3. TEST THE THEORY: if confirmed, move on; if not, form a new one. 4. PLAN the fix, including its impact and a way back. 5. IMPLEMENT it (or escalate if it is beyond your authority). 6. VERIFY full functionality, from the user's side, and add preventive measures. 7. DOCUMENT the findings, the fix and the outcome. Approaches to narrowing it down: BOTTOM-UP (Layer 1 first: cable, link, address, path, name, application), TOP-DOWN (start at the application), DIVIDE AND CONQUER (start in the middle, for example ping the gateway, and go up or down depending on the result), FOLLOW THE PATH (hop by hop from source to destination), and COMPARE with something that works (a working PC's settings beside the broken one's). Change ONE thing at a time, and test after each change, or you will never know what fixed it.",
        decision: dec(
          "A user says 'the internet is down'. Other users on the same switch are working normally. The user's PC can ping its own address but not its default gateway.",
          "Using the method, what is the best next step?",
          ["Test a theory at the lower layers for this one PC: check its cable and link light, the switch port's status, and its IP settings compared with a working neighbour's", "The scope is one PC and the failure is at the first hop, so the cause is local to it."],
          [
            ["Restart the company's internet router", "Others are working, so the router and internet are fine; this would disrupt everyone."],
            ["Call the ISP", "The fault is between the PC and its gateway, inside the building."],
            ["Reinstall the PC's operating system", "A drastic step before the simple theories have been tested."],
          ]
        ),
      },
      {
        id: "a-nw-physical-layer",
        title: "Identifying physical-layer problems",
        explain:
          "Start at Layer 1, because nothing above it can work without it, and because physical faults are common. Symptoms: no link light on the NIC or switch port; an interface 'down/down' in show ip interface brief or 'notconnect' in show interfaces status; a port that is 'administratively down' (someone typed shutdown); a link that keeps going up and down (FLAPPING: a damaged cable, a bad connector, or a failing transceiver); a link that negotiates at the wrong speed (100 Mbps instead of 1 Gbps often means a damaged pair in the cable); and error counters rising in show interfaces. Causes: unplugged or damaged cables, cables longer than 100 m, the wrong cable type or fibre type, dirty fibre connectors, faulty transceivers, a port shut down by an administrator or disabled by a security feature, PoE budget exhausted, power failures. Tools: link lights, the switch's show commands, CABLE TESTERS that check each pair and find the distance to a break, and for fibre, light meters. In the lab below, one user is cut off: find out why using only the commands you know, and fix it.",
        netLab: {
          task:
            "PC2 cannot reach anything, while PC1 and PC3 on the same switch work normally. PC2's settings are correct. Investigate SW1 with show commands, find the physical-layer problem and fix it.",
          devices: [
            { id: "R1", kind: "router", x: 50, y: 6 },
            { id: "SW1", kind: "switch", x: 50, y: 24 },
            { id: "PC1", kind: "pc", x: 16, y: 44, ip: "192.168.5.11/24", gateway: "192.168.5.1" },
            { id: "PC2", kind: "pc", x: 50, y: 48, ip: "192.168.5.12/24", gateway: "192.168.5.1" },
            { id: "PC3", kind: "pc", x: 84, y: 44, ip: "192.168.5.13/24", gateway: "192.168.5.1" },
          ],
          links: [["R1:g0/0", "SW1:g0/1"], ["PC1:fa0", "SW1:fa0/1"], ["PC2:fa0", "SW1:fa0/2"], ["PC3:fa0", "SW1:fa0/3"]],
          config: {
            R1: "hostname R1\ninterface g0/0\n ip address 192.168.5.1 255.255.255.0\n no shutdown",
            SW1: "hostname SW1\ninterface fa0/2\n description PC2 - Accounts\n shutdown",
          },
          start: "PC2",
          height: 52,
          goals: [{ type: "ping", from: "PC2", to: "192.168.5.1", label: "PC2 reaches its gateway" }],
          hint: "On SW1: enable, show ip interface brief. Fa0/2 is 'administratively down': someone shut it. configure terminal, interface fa0/2, no shutdown, end.",
          successMessage: "The port had been shut down by hand, probably left that way after a move. 'Administratively down' always means a person (or a security feature) turned it off.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 2 · 9.3 – 9.5
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "nw-ts2-ip-dns-dhcp",
    moduleId: M,
    sectionId: SECTION_ID,
    order: 2,
    covers: ["9.3", "9.4", "9.5"],
    title: "IP, DNS and DHCP Faults",
    subtitle: "The three services behind most 'the network is down' calls",
    estimatedMinutes: 50,
    intro:
      "When the physical layer is fine, the next suspects are a device's addressing, its name resolution and the service that gave it both. Each fault has a fingerprint you can learn to recognise.",

    atoms: [
      {
        id: "a-nw-ts-ip-config",
        title: "Diagnosing IP configuration issues",
        explain:
          "With the link up, check the device's IP CONFIGURATION (ipconfig on Windows and NetLab PCs, ip -br addr and ip route on Linux) and compare it with a working device on the same network. The usual faults and their fingerprints: an address in the WRONG SUBNET (a typo such as 192.168.100.25 instead of 192.168.10.25): the device cannot even reach its gateway; a WRONG MASK (Module 3): some destinations work and others do not; a wrong or missing DEFAULT GATEWAY: the local network works but nothing beyond it; a DUPLICATE ADDRESS: two devices fight over one address and both lose connectivity intermittently (Windows reports an address conflict); a 169.254 address: DHCP failed (atom 3); and a static address on a device that should be using DHCP, or the reverse. Then test in order: ping 127.0.0.1 (the device's own stack), ping its own address, ping the gateway, ping a remote address, ping a name. The first step that fails shows the layer to look at. In the lab, one PC was configured by hand with a typing mistake.",
        netLab: {
          task:
            "Staff on the 192.168.10.0/24 network reach the file server 172.16.1.20; PC-Ada, configured by hand this morning, cannot even reach its gateway. Compare its settings with PC-Bola's and fix PC-Ada's address (keep the host number .25), then prove it reaches the server.",
          devices: [
            { id: "PC-Ada", kind: "pc", x: 10, y: 16, ip: "192.168.100.25/24", gateway: "192.168.10.1" },
            { id: "PC-Bola", kind: "pc", x: 10, y: 44, ip: "192.168.10.26/24", gateway: "192.168.10.1" },
            { id: "SW1", kind: "switch", x: 34, y: 30 },
            { id: "R1", kind: "router", x: 60, y: 30 },
            { id: "Files", kind: "server", x: 88, y: 30, ip: "172.16.1.20/24", gateway: "172.16.1.1" },
          ],
          links: [["PC-Ada:fa0", "SW1:fa0/1"], ["PC-Bola:fa0", "SW1:fa0/2"], ["R1:g0/0", "SW1:g0/1"], ["R1:g0/1", "Files:fa0"]],
          config: {
            SW1: "hostname SW1",
            R1: "hostname R1\ninterface g0/0\n ip address 192.168.10.1 255.255.255.0\n no shutdown\ninterface g0/1\n ip address 172.16.1.1 255.255.255.0\n no shutdown",
          },
          start: "PC-Ada",
          height: 46,
          goals: [{ type: "ping", from: "PC-Ada", to: "172.16.1.20", label: "PC-Ada reaches the file server" }],
          hint: "ipconfig on both PCs: PC-Ada is 192.168.100.25, a third octet of 100 instead of 10, so its gateway is not on its subnet. ipconfig 192.168.10.25 255.255.255.0 192.168.10.1.",
          successMessage: "One extra zero put PC-Ada on a different network from its own gateway. Comparing with a working neighbour found it in seconds.",
        },
      },
      {
        id: "a-nw-ts-dns",
        title: "Resolving DNS problems",
        explain:
          "DNS faults have a clear fingerprint: things work by ADDRESS but not by NAME. Then ask which kind of DNS failure it is, because the answer points to different fixes. dig followed by @ and a server address, then a name, sends the query to THAT server directly, bypassing the configured resolver: dig @192.168.56.20 intranet.lab. That lets you test each server yourself. Read the result. Status NOERROR with an ANSWER section: the name resolves, so look elsewhere. Status NXDOMAIN ('non-existent domain'): the server answered, and the name does not exist; check the spelling, or the record is missing on the authoritative server. 'connection timed out; no servers could be reached': no DNS server answered at all, so check the server address configured on the device, whether that server is running, and whether a firewall blocks UDP and TCP port 53. If one server answers and the configured one does not, fix the device's DNS setting. Also remember caching: a record that was just changed may still resolve to the old address until its TTL expires (Module 4). The recorded workstation below tests three cases.",
        terminalExercise: term("m9-dns-fault", {
          goal: "The lab's DNS server is 192.168.56.20. Query it directly, bypassing the machine's configured resolver, and ask for just the address of intranet.lab.",
          accept: ["dig +short @192.168.56.20 intranet.lab"],
          near: [
            { command: "dig nosuchhost.lab", why: "That shows NXDOMAIN: the server answered that the name does not exist. Useful to recognise, but the goal is to query 192.168.56.20 directly for intranet.lab." },
            { command: "dig +time=2 +tries=1 @192.168.56.99 intranet.lab", why: "That queried an address where no DNS server runs, so it timed out. The goal names the real server, 192.168.56.20." },
          ],
          hint: "dig, +short for just the answer, @ and the server's address, then the name.",
          success: "192.168.56.20: the server works. Compare the other two recordings: NXDOMAIN means 'answered, no such name', while a timeout means 'nobody answered'. Different faults, different fixes.",
        }),
      },
      {
        id: "a-nw-ts-dhcp",
        title: "Diagnosing DHCP failures",
        explain:
          "DHCP faults show up as clients with 169.254 addresses (or no address at all), or with addresses from the wrong network. Work through the chain the DORA exchange needs (Module 4): Is the client set to DHCP, and is its link up? Is the DHCP server (or the router's pool) running, and does it have a pool for this client's network? Is the POOL EXHAUSTED (every address leased)? Is the client in the right VLAN, so its broadcast reaches the right network? And if the server is on ANOTHER network, is there a RELAY: ip helper-address followed by the server's address, on the router interface facing the clients? A missing helper is the classic fault when a network grows or a VLAN is added: the new network's clients broadcast into the void. On the client, ipconfig /renew retries; on a Cisco DHCP server, show ip dhcp binding shows what has been leased. In the lab, a new VLAN has been added for the warehouse, and its PCs get no addresses.",
        netLab: {
          task:
            "The company's DHCP server is SRV-DHCP (10.0.0.10) on the server network, with a pool for the new warehouse network 192.168.40.0/24. The warehouse PCs, behind R1's G0/1, still have 169.254 addresses. Find what is missing on R1 and fix it, then renew the warehouse PCs.",
          devices: [
            { id: "WH-PC1", kind: "pc", x: 8, y: 16, dhcp: true, note: "warehouse" },
            { id: "WH-PC2", kind: "pc", x: 8, y: 44, dhcp: true, note: "warehouse" },
            { id: "SW-WH", kind: "switch", x: 30, y: 30 },
            { id: "R1", kind: "router", x: 56, y: 30 },
            { id: "SRV-DHCP", kind: "server", x: 88, y: 30, ip: "10.0.0.10/24", gateway: "10.0.0.1", dhcpPools: [{ name: "WAREHOUSE", network: "192.168.40.0/24", gateway: "192.168.40.1", dns: "10.0.0.10", start: "192.168.40.50" }] },
          ],
          links: [["WH-PC1:fa0", "SW-WH:fa0/1"], ["WH-PC2:fa0", "SW-WH:fa0/2"], ["R1:g0/1", "SW-WH:g0/1"], ["R1:g0/0", "SRV-DHCP:fa0"]],
          config: {
            "SW-WH": "hostname SW-WH",
            R1: "hostname R1\ninterface g0/0\n ip address 10.0.0.1 255.255.255.0\n no shutdown\ninterface g0/1\n ip address 192.168.40.1 255.255.255.0\n no shutdown",
          },
          start: "R1",
          height: 46,
          goals: [
            { type: "dhcp", host: "WH-PC1", subnet: "192.168.40.0/24", label: "WH-PC1 leases an address in 192.168.40.0/24" },
            { type: "dhcp", host: "WH-PC2", subnet: "192.168.40.0/24", label: "WH-PC2 leases an address too" },
          ],
          hint: "The server is on another network, and DHCP Discover is a broadcast that R1 will not forward. On R1: configure terminal, interface g0/1, ip helper-address 10.0.0.10, end. Then ipconfig /renew on each PC.",
          successMessage: "One helper address, and the broadcasts from the warehouse now reach the central server as unicast packets. Every new VLAN needs one if DHCP is centralised.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 3 · 9.6 – 9.8
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "nw-ts3-routing-loss-latency",
    moduleId: M,
    sectionId: SECTION_ID,
    order: 3,
    covers: ["9.6", "9.7", "9.8"],
    title: "Routing Problems, Packet Loss, Latency and Jitter",
    subtitle: "When packets go the wrong way, go missing, or arrive late and uneven",
    estimatedMinutes: 50,
    intro:
      "Beyond the local network, faults are about the path: routes that are missing or wrong, packets that are lost on the way, and delay that ruins calls even when everything 'works'.",

    atoms: [
      {
        id: "a-nw-ts-routing",
        title: "Troubleshooting routing problems",
        explain:
          "Module 5 gave you the basic routing checks: tracert to find where packets stop, show ip route on the suspect router, and always the RETURN path. With DYNAMIC routing there is one more layer: are the routers exchanging routes at all? For OSPF, show ip ospf neighbor should list each neighbour in state FULL. If a neighbour is missing, the usual causes are: the two interfaces are not in the same SUBNET, the network statements put them in DIFFERENT AREAS, the Hello timers differ, an interface is passive, or OSPF is not enabled on that interface at all because no network statement covers it. show running-config (in privileged mode) shows the router's whole configuration, including the router ospf section; scroll to it and compare both routers. To correct a wrong network statement, remove it by typing the same command with no in front (in IOS, no reverses a command), inside router ospf 1: no network 10.0.12.0 0.0.0.3 area 1, then add the right one. In the lab, two routers that should be OSPF neighbours are not.",
        netLab: {
          task:
            "R1 and R2 run OSPF, but PC1 cannot reach PC2: R1 has no route to 192.168.2.0/24. show ip ospf neighbor on R1 is empty. Compare the OSPF configuration on both routers, find why they will not become neighbours, and fix it so OSPF learns the routes.",
          devices: [
            { id: "PC1", kind: "pc", x: 6, y: 30, ip: "192.168.1.10/24", gateway: "192.168.1.1" },
            { id: "R1", kind: "router", x: 34, y: 30 },
            { id: "R2", kind: "router", x: 66, y: 30 },
            { id: "PC2", kind: "pc", x: 94, y: 30, ip: "192.168.2.10/24", gateway: "192.168.2.1" },
          ],
          links: [["PC1:fa0", "R1:g0/0"], ["R1:g0/1", "R2:g0/1"], ["R2:g0/0", "PC2:fa0"]],
          config: {
            R1: "hostname R1\ninterface g0/0\n ip address 192.168.1.1 255.255.255.0\n no shutdown\ninterface g0/1\n ip address 10.0.12.1 255.255.255.252\n no shutdown\nrouter ospf 1\n network 192.168.1.0 0.0.0.255 area 0\n network 10.0.12.0 0.0.0.3 area 0",
            R2: "hostname R2\ninterface g0/0\n ip address 192.168.2.1 255.255.255.0\n no shutdown\ninterface g0/1\n ip address 10.0.12.2 255.255.255.252\n no shutdown\nrouter ospf 1\n network 192.168.2.0 0.0.0.255 area 0\n network 10.0.12.0 0.0.0.3 area 1",
          },
          start: "R1",
          height: 34,
          goals: [
            { type: "route", device: "R1", prefix: "192.168.2.0/24", source: "O", label: "R1 learns 192.168.2.0/24 by OSPF" },
            { type: "ping", from: "PC1", to: "192.168.2.10", label: "PC1 reaches PC2" },
          ],
          hint: "show running-config on R2: its link network is in area 1, R1's in area 0, so the Hellos do not match. On R2: configure terminal, router ospf 1, no network 10.0.12.0 0.0.0.3 area 1, network 10.0.12.0 0.0.0.3 area 0, end.",
          successMessage: "One area number kept two routers from ever becoming neighbours. show ip ospf neighbor is the first command for any OSPF fault.",
        },
      },
      {
        id: "a-nw-packet-loss",
        title: "Identifying packet loss",
        explain:
          "PACKET LOSS is the percentage of packets sent that never arrive: lost = sent − received, and loss % = lost ÷ sent × 100. ping reports it directly ('4 packets transmitted, 3 received, 25% packet loss'), but four pings is far too small a sample: send hundreds (ping -c 200 on Linux, ping -n 200 on Windows) to measure it. Even 1 to 2 percent hurts TCP throughput and voice quality. To FIND where loss happens, test hop by hop (mtr, or ping each hop from a traceroute) and look for the first hop where loss starts and CONTINUES to every later hop; loss at one hop that does not continue is usually just that router rate-limiting replies to pings. Common causes: duplex mismatches and bad cables (with interface errors, Lesson 4), congestion (queues overflowing, Lesson 4), weak or noisy Wi-Fi, overloaded devices, and faulty transceivers. Work out the figures below.",
        netCalc: {
          task: "Work out packet loss: lost = sent − received; loss % = lost ÷ sent × 100.",
          questions: [
            { q: "ping sends 200 packets and receives 186. How many were lost?", answer: "14", hint: "200 − 186.", working: "200 − 186 = 14 lost" },
            { q: "What is the loss percentage?", answer: "7", accept: ["7%", "7 %"], hint: "14 ÷ 200 × 100.", working: "14 ÷ 200 = 0.07 → 7%" },
            { q: "A traceroute shows 0% loss at hops 1–3, 40% at hop 4 only, and 0% at hops 5–8 and the destination. Is there real loss on the path? (yes or no)", answer: "no", accept: ["no.", "n"], hint: "Does the loss at hop 4 continue to the later hops and the destination?", working: "Loss that does not continue past one hop = that router limiting its own ping replies, not real loss" },
          ],
          successMessage: "Measure with enough packets, and only trust loss that continues to the destination.",
        },
      },
      {
        id: "a-nw-latency-jitter",
        title: "Understanding latency and jitter",
        explain:
          "LATENCY is delay (Module 2): the round-trip time ping reports. Its parts: PROPAGATION (distance; about 5 ms per 1,000 km of fibre), SERIALISATION (putting the bits on the wire), PROCESSING in each device, and QUEUING when links are busy, the part that grows under load. JITTER is the VARIATION in latency from packet to packet. One simple measure is the average of the differences between consecutive round-trip times. Real-time traffic suffers from jitter more than from steady latency, because voice and video apps must buffer packets to play them smoothly, and a packet that arrives after the buffer has played is as good as lost. Typical targets for voice: one-way latency under 150 ms, jitter under 30 ms, loss under 1 percent. High jitter usually means CONGESTION somewhere (queues filling and emptying) or a poor Wi-Fi link; the fix is more capacity, QoS that gives voice priority (Module 10), or moving the user to a better connection. Work out the numbers from five ping times below.",
        netCalc: {
          task: "Five consecutive ping round-trip times to a VoIP server were: 20, 24, 19, 41 and 21 ms.",
          questions: [
            { q: "What is the average round-trip time, in ms?", answer: "25", hint: "Add them and divide by 5.", working: "20 + 24 + 19 + 41 + 21 = 125\n125 ÷ 5 = 25 ms" },
            { q: "What is the difference between the slowest and fastest reply, in ms?", answer: "22", hint: "Largest minus smallest.", working: "41 − 19 = 22 ms" },
            { q: "Jitter as the average change between consecutive replies: what is it, in ms? (The changes are 4, 5, 22 and 20.)", answer: "12.75", accept: ["12.75ms"], hint: "Add the four changes and divide by 4.", working: "|24−20| = 4, |19−24| = 5, |41−19| = 22, |21−41| = 20\n4 + 5 + 22 + 20 = 51\n51 ÷ 4 = 12.75 ms" },
          ],
          successMessage: "Steady 25 ms would be fine for calls; it is the one 41 ms spike that makes the jitter. Spikes like that point to congestion.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 4 · 9.9 – 9.11
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "nw-ts4-bandwidth-errors",
    moduleId: M,
    sectionId: SECTION_ID,
    order: 4,
    covers: ["9.9", "9.10", "9.11"],
    title: "Bandwidth, Congestion and Interface Errors",
    subtitle: "Is the link full, or is it faulty?",
    estimatedMinutes: 40,
    intro:
      "'Slow' has two very different causes on a link: too much traffic, or traffic being damaged. This lesson teaches you to measure the first and spot the second.",

    atoms: [
      {
        id: "a-nw-bandwidth-utilisation",
        title: "Bandwidth utilisation",
        explain:
          "UTILISATION is how much of a link's capacity is in use: utilisation % = traffic ÷ link speed × 100, measured separately in each direction (a link can be full inbound and quiet outbound). Monitoring tools graph it from interface counters (by SNMP, Lesson 5), usually as 5-minute averages, which hide short bursts: a link averaging 60 percent may be hitting 100 percent for seconds at a time, enough to drop packets. Rules of thumb: sustained utilisation above about 70 to 80 percent on a link means queues are forming at peaks and it is time to plan an upgrade or reduce traffic; and the 95th PERCENTILE (the level traffic stays below 95 percent of the time) is how many ISPs bill and how planners size links. To find WHAT is using the bandwidth, use flow data (NetFlow, sFlow or IPFIX, exported by routers and switches) which shows the top talkers, applications and destinations. To measure what a path can actually carry, test end to end with iperf3 (installed in Module 7). Work out these utilisations.",
        netCalc: {
          task: "Utilisation % = traffic ÷ link speed × 100.",
          questions: [
            { q: "A 100 Mbps internet link carries an average of 72 Mbps inbound. What is the inbound utilisation, in percent?", answer: "72", accept: ["72%"], hint: "72 ÷ 100 × 100.", working: "72 ÷ 100 = 0.72 → 72%" },
            { q: "A 1 Gbps (1,000 Mbps) uplink carries 850 Mbps. What is its utilisation, in percent?", answer: "85", accept: ["85%"], hint: "850 ÷ 1000 × 100.", working: "850 ÷ 1000 = 0.85 → 85%" },
            { q: "Using the 70–80 percent rule of thumb, which of those two links most urgently needs an upgrade plan? Type 100 or 1000.", answer: "1000", accept: ["1 gbps", "1000 mbps", "the 1 gbps uplink"], hint: "Which one is further above 80 percent?", working: "85% is above the 70–80% threshold; 72% is just inside it" },
          ],
          successMessage: "Sustained utilisation above about 80 percent means queues and drops at peaks. Plan before users notice.",
        },
      },
      {
        id: "a-nw-congestion",
        title: "Network congestion",
        explain:
          "CONGESTION happens when more traffic arrives at a link than it can send, for example ten 1 Gbps access ports all sending to one 1 Gbps uplink, or an office of 100 users sharing a 50 Mbps internet link. Packets wait in the interface's QUEUE (adding latency and jitter), and when the queue is full, new packets are DROPPED (loss), which makes TCP slow down. Signs: high utilisation, rising output drops on an interface (show interfaces counts them), and latency that rises during busy hours and falls at night. Solutions, in rough order: find out what the traffic is (flow data) and remove or reschedule what should not be there (backups at midday, unrestricted streaming, a malware-infected host); apply QoS so that voice and business-critical traffic is sent first and less important traffic waits (Module 10); add capacity (a faster link, link aggregation, a second internet line); and redesign so traffic does not all funnel through one point. Note that a faster link is not always the answer: if one misbehaving device is flooding the network, it will fill a bigger link too.",
        decision: dec(
          "Every day between 12:00 and 13:00, an office's video calls break up and web pages crawl. A flow report shows that a server's offsite backup job starts at 12:00 and fills the internet link for an hour.",
          "What is the best first fix?",
          ["Reschedule the backup outside working hours (and limit its bandwidth), since the congestion is caused by one avoidable job", "Remove or move the traffic causing the congestion before buying capacity."],
          [
            ["Upgrade the internet link immediately", "The backup would fill a bigger link too, and the problem is avoidable."],
            ["Ban video calls", "That punishes users instead of fixing the cause."],
            ["Replace every switch", "The bottleneck is the internet link, not the switches."],
          ]
        ),
      },
      {
        id: "a-nw-interface-errors",
        title: "Interface errors and dropped packets",
        explain:
          "show interfaces (followed by an interface name) shows counters that separate a FULL link from a FAULTY one. INPUT ERRORS and CRC errors: frames arrived damaged, failing their checksum; caused by bad cables, connectors, interference, or the full-duplex side of a duplex mismatch. COLLISIONS and especially LATE COLLISIONS: on a modern full-duplex link there should be none; their presence means a duplex mismatch (on the half-duplex side) or a cable that is too long. OUTPUT DROPS: the interface's queue overflowed because more traffic was waiting than the link could send; this is CONGESTION, not damage. INTERFACE RESETS and frequent up/down messages: a flapping link (Lesson 1). Counters accumulate from the last reset, so record them, clear them (clear counters in privileged mode), wait, and look again to see whether errors are still increasing. Look at the uplink below: its link is up and pings mostly work, but the counters tell a different story.",
        netDemo: {
          task:
            "On SW1, type enable then show interfaces g0/1. Note the duplex and the input errors and CRC counters. On R1, run show interfaces g0/0 and note its duplex and collision counters. What do the two sides disagree about?",
          devices: [
            { id: "PC1", kind: "pc", x: 10, y: 30, ip: "192.168.1.10/24", gateway: "192.168.1.1" },
            { id: "SW1", kind: "switch", x: 42, y: 30 },
            { id: "R1", kind: "router", x: 76, y: 30 },
          ],
          links: [["PC1:fa0", "SW1:fa0/1"], ["SW1:g0/1", "R1:g0/0"]],
          config: {
            SW1: "hostname SW1\ninterface g0/1\n duplex full\n speed 1000",
            R1: "hostname R1\ninterface g0/0\n ip address 192.168.1.1 255.255.255.0\n no shutdown",
          },
          start: "SW1",
          height: 34,
        },
        decision: dec(
          "In the network above, SW1's G0/1 shows Full-duplex with thousands of CRC errors, while R1's G0/0 shows Half-duplex with thousands of late collisions.",
          "What is the fault?",
          ["A duplex mismatch: SW1 is hard-set to full duplex, so R1's auto-negotiation fell back to half duplex", "CRC errors on the full side plus late collisions on the half side is the textbook signature."],
          [
            ["Congestion on the link", "Congestion shows as output drops, not CRC errors and late collisions."],
            ["A wrong IP address on R1", "Addressing does not cause Layer 1 and 2 error counters."],
            ["The cable is too short", "Short cables do not cause this; mismatched duplex does."],
          ]
        ),
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 5 · 9.12 – 9.15
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "nw-ts5-captures-monitoring",
    moduleId: M,
    sectionId: SECTION_ID,
    order: 5,
    covers: ["9.12", "9.13", "9.14", "9.15"],
    title: "Captures, Monitoring, SNMP and Logs",
    subtitle: "Evidence from the wire, and watching the network continuously",
    estimatedMinutes: 55,
    intro:
      "Show commands describe a device's state at one moment. Captures show exactly what crossed the wire, and monitoring and logs record the network's behaviour over time. Together they let you find faults nobody reported yet.",

    atoms: [
      {
        id: "a-nw-analysing-captures",
        title: "Analysing packet captures",
        explain:
          "When everything looks right but an application still fails, CAPTURE the traffic and read what really happens. Capture as close to the problem as possible (on the client, the server, or a switch mirror port) and only on networks you are authorised to monitor. Then read the conversation: Does the DNS query get an answer? Does the TCP handshake complete (SYN, SYN-ACK, ACK)? If a SYN gets no reply at all, something on the path is DROPPING it silently (often a firewall); if the reply is a RST (reset), the destination host is reachable but REFUSING: nothing is listening on that port, or a firewall is configured to reject. Look for 'TCP Retransmission' and 'Dup ACK' (loss), long gaps in the Time column (delay, and on which side), and HTTP or TLS errors. The display filter tcp.flags.reset == 1 shows only packets with the RST flag set (just as tcp.flags.syn == 1 showed SYNs in Module 4). The capture below was recorded when the lab workstation tried to open a web page on srv01 port 8080, where nothing listens.",
        captureExercise: {
          task: "Filter the capture to packets with the RST flag set, then click the packet in which the server refuses the connection.",
          packets: cap("m9-closed-port"),
          expect: {
            maxRows: 1,
            packet: 2,
            mustContain: [2],
            whyWrong: "Choose the packet from the server (192.168.56.20) whose flags include RST.",
            success: "The server answered the SYN with RST, ACK at once: srv01 is reachable, and nothing is listening on port 8080. A silent drop would have looked completely different: repeated SYNs and no reply.",
          },
          hint: "Type tcp.flags.reset == 1 and press Apply.",
        },
      },
      {
        id: "a-nw-performance-monitoring",
        title: "Network performance monitoring",
        explain:
          "MONITORING watches the network continuously so problems are found (ideally) before users report them. What to monitor: device and interface AVAILABILITY (up or down), UTILISATION, ERRORS and DROPS on every important link, latency, loss and jitter between sites, device CPU, memory and temperature, and the health of key services (DNS, DHCP, web, VPN). How: tools such as Zabbix, PRTG, LibreNMS, SolarWinds or cloud services POLL devices (SNMP, Lesson 5's next atom, or modern streaming telemetry), receive FLOW data, and run synthetic tests (pinging, fetching a web page every minute from several places). The data becomes GRAPHS and DASHBOARDS, and THRESHOLDS turn it into ALERTS (for example, 'uplink over 80 percent for 10 minutes'). Collect a BASELINE first: you can only call something abnormal if you know what normal looks like at that time of day. For deep investigation on one Linux host, tcpdump captures from the command line: sudo tcpdump -n -i eth0 -c 6 icmp captures six ICMP packets on eth0, numerically (timeout 10 in front stops it after 10 seconds if fewer arrive). The recording shows it capturing a ping.",
        terminal: term("m9-tcpdump", { goal: "Read how tcpdump prints each captured packet: time, source > destination, protocol and details." }),
        decision: dec(
          "Monitoring shows the WAN link to a branch at 95 percent every weekday afternoon. Nobody knows whether that is new.",
          "What would have let the team know immediately whether this is unusual?",
          ["A baseline of normal utilisation for that link at that time of day, recorded over previous weeks", "Without a baseline, 'abnormal' cannot be judged."],
          [
            ["A faster ping command", "Ping speed does not reveal history."],
            ["Turning off monitoring during working hours", "That removes the evidence."],
            ["Rebooting the branch router every afternoon", "That causes outages and reveals nothing."],
          ]
        ),
      },
      {
        id: "a-nw-snmp-monitoring",
        title: "SNMP monitoring fundamentals",
        explain:
          "SNMP (Module 4) is still the most widely used way to monitor network devices. The MANAGER (the monitoring server) polls each AGENT (a router, switch, firewall, printer or server) on UDP 161 for values identified by OIDs (object identifiers) defined in MIBs: for example the IF-MIB counters ifInOctets and ifOutOctets for each interface, from which the manager calculates utilisation by comparing two readings and dividing by the time between them. sysUpTime shows when a device rebooted; ifOperStatus shows whether an interface is up. Agents send TRAPS (or the acknowledged version, INFORMS) on UDP 162 when something happens, such as a link going down. To configure monitoring securely: use SNMPv3 with authentication and encryption (or at least a long, non-default community string on v2c, never 'public' or 'private'); make the community READ-ONLY unless writes are truly needed; and allow SNMP only from the monitoring server's address with an ACL. Many newer devices also offer streaming telemetry (pushing data every few seconds) and REST APIs (Module 10).",
        decision: dec(
          "A security audit finds every switch in the company answering SNMP v2c requests from any address with the read-write community string 'private'.",
          "Why is this dangerous, and what is the fix?",
          ["Anyone on the network could read the switches' details and even change their configuration; use SNMPv3 (or a strong read-only community), restricted by ACL to the monitoring server", "Default, writable, unrestricted SNMP is a well-known way to take over devices."],
          [
            ["It is not dangerous because SNMP only reads data", "A read-write community can change configuration."],
            ["SNMP should be replaced by Telnet", "Telnet is unencrypted remote login, not monitoring."],
            ["The fix is to use the community string 'public' instead", "'public' is just as well known."],
          ]
        ),
      },
      {
        id: "a-nw-log-analysis",
        title: "Network logs and event analysis",
        explain:
          "Network devices write LOG MESSAGES (syslog) for events: interfaces going up and down, routing neighbours changing, configuration changes, ACL hits, logins. Cisco messages look like %LINK-3-UPDOWN: Interface GigabitEthernet1/0/7, changed state to down, where LINK is the facility, 3 the SEVERITY (0 emergencies to 7 debugging: lower numbers are more serious) and UPDOWN the event. Kept only on the device, logs are small, lost at reboot and hard to correlate, so every device should send them to a central SYSLOG server (UDP 514) or SIEM, with correct time from NTP so events from different devices line up. Analysis means finding patterns: a single interface down is ordinary (someone unplugged a laptop); the SAME interface going down and up again and again is a FLAPPING link, usually a failing cable, transceiver or connected device, which disrupts users and spanning tree. Build a rule below that finds the flapping port among ordinary events: conditions on the fields, then count by a field with a threshold.",
        huntExercise: {
          task: "Somewhere in this morning's switch logs is an interface that keeps flapping. Write a rule that alerts on it with no more than one false positive.",
          fields: SYSLOG_FIELDS,
          events: SYSLOG,
          showAttackColumn: true,
          expect: { maxFalsePositives: 1 },
          hint: "Condition: Message contains UPDOWN. Then count by Interface and alert at 4 or more: ordinary ports change state once; the flapping port does it seven times.",
          successMessage: "Gi1/0/7 on SW-FL2, seven state changes in two hours. The fix is physical: replace the cable or the transceiver, or check the device plugged into it.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 6 · 9.16 – 9.18, 9.P
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "nw-ts6-rca-practical",
    moduleId: M,
    sectionId: SECTION_ID,
    order: 6,
    covers: ["9.16", "9.17", "9.18", "9.P"],
    title: "Documentation, Maintenance, Root Cause Analysis and the Practical",
    subtitle: "Preventing the next fault, and fixing a network nobody explains to you",
    estimatedMinutes: 60,
    intro:
      "Fixing a fault is half the job; making sure it never happens again is the other half. Then the practical: a network with several deliberate faults and no hints about where they are.",

    atoms: [
      {
        id: "a-nw-documentation-reporting",
        title: "Network documentation and reporting",
        explain:
          "Troubleshooting is much faster with good DOCUMENTATION: up-to-date topology diagrams (Module 10), an addressing and VLAN plan, device inventories (model, software version, serial number, support contract), configuration backups, circuit details and provider contacts, and runbooks for common tasks. Every incident should leave a written record: an INCIDENT TICKET with the symptoms, the times, what was tested, what was found, what fixed it and who did it. Afterwards, for significant incidents, an INCIDENT REPORT for managers explains in plain language what happened, the impact (who was affected and for how long), the root cause, and the actions taken and planned. Regular PERFORMANCE REPORTS (availability percentages, utilisation trends, top problems) show whether the network is meeting its targets and justify upgrades with data. Write for your reader: technical detail for engineers, impact and decisions for managers.",
        decision: dec(
          "After a three-hour outage of the company's internet link, the CEO asks the network team what happened.",
          "What should the incident report for the CEO focus on?",
          ["The impact (who was affected and for how long), the root cause in plain language, what was done to restore service, and what will prevent a repeat", "Managers need impact, cause and decisions, not command output."],
          [
            ["A full copy of every router's running configuration", "That is for engineers, not the CEO."],
            ["Nothing, since the link is working again", "Significant incidents need a record and lessons learned."],
            ["Which engineer was to blame", "Blameless reviews find causes; blame hides them."],
          ]
        ),
      },
      {
        id: "a-nw-preventive-maintenance",
        title: "Preventive maintenance",
        explain:
          "PREVENTIVE MAINTENANCE stops faults before they happen, on a schedule. Typical tasks: apply software and firmware UPDATES to network devices (security fixes especially) in planned maintenance windows, with a rollback plan; back up device configurations automatically and test restoring one; check and test UPS batteries and generator changeover (critical where grid power is unreliable); review logs and monitoring trends for slowly growing problems (rising error counters, a disk filling, a link creeping towards capacity); clean equipment rooms and check cooling (heat kills switches); check for and replace equipment that has reached END OF LIFE (no more security updates); renew certificates, domain names and support contracts before they expire; audit configurations against the security baseline (Module 8); and review documentation. Changes are made under CHANGE MANAGEMENT (Module 10): planned, approved, communicated and reversible.",
        decision: dec(
          "A company's core switch fails completely during a power cut. Investigation finds that the UPS behind it had not been tested in three years and its batteries could no longer hold a charge.",
          "Which preventive practice would have avoided the outage?",
          ["Scheduled testing and replacement of UPS batteries as part of preventive maintenance", "UPS batteries wear out silently; only regular tests reveal it."],
          [
            ["Buying a faster core switch", "A faster switch fails just the same without power."],
            ["Adding more VLANs", "VLANs have nothing to do with power."],
            ["Turning off monitoring to save power", "That makes problems harder to see."],
          ]
        ),
      },
      {
        id: "a-nw-root-cause",
        title: "Root cause analysis",
        explain:
          "Fixing the SYMPTOM restores service; finding the ROOT CAUSE stops it happening again. ROOT CAUSE ANALYSIS (RCA) asks why the fault occurred, and keeps asking. The '5 WHYS' technique: Users lost connectivity. Why? The access switch rebooted. Why? It overheated. Why? The closet's air-conditioning failed. Why? It had not been serviced in two years. Why? Nobody owned the maintenance of closet cooling. The root cause is the missing ownership, and the action is to assign it and add the AC to the preventive maintenance schedule, not just to reboot the switch. Good RCAs are BLAMELESS (they look for weaknesses in systems and processes, not people to punish, so people report honestly), based on EVIDENCE (logs, timelines, captures, change records), and end with specific, owned, dated actions. Many faults have several contributing causes; record them all.",
        decision: dec(
          "A branch's router crashed and was restarted, restoring service. Logs show it ran out of memory because of a known software bug for which a fix has been available for a year.",
          "What is the root cause, and the corrective action?",
          ["The unpatched known bug, ultimately the lack of a regular patching process; apply the fix and put the router on a patching schedule", "The restart fixed the symptom; patching and process fix the cause."],
          [
            ["The router was restarted, so the problem is solved", "It will crash again when memory runs out again."],
            ["The branch staff used the network too much", "The cause was a software bug."],
            ["Memory chips should be replaced with bigger ones", "More memory would only delay the bug's crash."],
          ]
        ),
      },
      {
        id: "a-nw-multi-fault",
        title: "Practical: a network with faults nobody tells you about",
        explain:
          "This is the job. Below is a small network: two departments' PCs, a switch with VLANs, a router doing router-on-a-stick, and a server network beyond it. Several things have been broken on purpose, and nobody will tell you what or where. Use the method from Lesson 1: define the symptoms (which PCs can reach what), work bottom-up or divide and conquer, compare broken things with working ones, change one thing at a time, and test after each change. Your tools are everything you have used in the course: ipconfig and ping and tracert on the PCs; show ip interface brief, show vlan brief, show interfaces trunk, show ip route and show running-config on the switch and router. Write down each fault as you find it; the practical task asks for that list. The lab is solved when both PCs reach the server.",
        netLab: {
          task:
            "Neither the Sales PC nor the Admin PC can reach the application server 172.16.50.10. The design: Sales is VLAN 10 (192.168.10.0/24, port Fa0/1), Admin is VLAN 20 (192.168.20.0/24, port Fa0/2), SW1's G0/1 trunks to R1, R1 routes for both VLANs (gateways .1) and its G0/1 leads to the server network. Find and fix every fault.",
          devices: [
            { id: "R1", kind: "router", x: 50, y: 8 },
            { id: "SW1", kind: "switch", x: 50, y: 28 },
            { id: "PC-Sales", kind: "pc", x: 18, y: 48, ip: "192.168.10.20/24", gateway: "192.168.10.254", note: "VLAN 10" },
            { id: "PC-Admin", kind: "pc", x: 82, y: 48, ip: "192.168.20.20/24", gateway: "192.168.20.1", note: "VLAN 20" },
            { id: "App-SRV", kind: "server", x: 88, y: 8, ip: "172.16.50.10/24", gateway: "172.16.50.1" },
          ],
          links: [["R1:g0/0", "SW1:g0/1"], ["R1:g0/1", "App-SRV:fa0"], ["PC-Sales:fa0", "SW1:fa0/1"], ["PC-Admin:fa0", "SW1:fa0/2"]],
          config: {
            R1: "hostname R1\ninterface g0/0\n no shutdown\ninterface g0/0.10\n encapsulation dot1Q 10\n ip address 192.168.10.1 255.255.255.0\ninterface g0/0.20\n encapsulation dot1Q 20\n ip address 192.168.20.1 255.255.255.0\ninterface g0/1\n ip address 172.16.50.1 255.255.255.0\n shutdown",
            SW1: "hostname SW1\nvlan 10\n name SALES\nvlan 20\n name ADMIN\ninterface fa0/1\n switchport mode access\n switchport access vlan 10\ninterface fa0/2\n switchport mode access\n switchport access vlan 10\ninterface g0/1\n switchport mode trunk",
          },
          start: "PC-Sales",
          height: 52,
          goals: [
            { type: "ping", from: "PC-Sales", to: "172.16.50.10", label: "The Sales PC reaches the application server" },
            { type: "ping", from: "PC-Admin", to: "172.16.50.10", label: "The Admin PC reaches the application server" },
          ],
          hint: "Three faults. PC-Sales's gateway is .254, not .1. SW1's Fa0/2 is in VLAN 10, not 20 (show vlan brief). R1's G0/1 to the server network is administratively down (show ip interface brief).",
          successMessage: "A wrong gateway, a port in the wrong VLAN and a shut-down router interface: three different layers, each found by comparing what is with what the design says. That is troubleshooting.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },

    task: {
      title: "Module 9 practical: broken networks, fixed and documented",
      intro:
        "Work with a partner if you can: each of you breaks a copy of a lab network (in Packet Tracer, NetLab or your VMs) in three ways without telling the other, then swaps. Use only the troubleshooting method and the tools from this course.",
      prompts: [
        "For each fault, write the symptom as the user would report it, the steps you took, the tests that narrowed it down, the cause, and the fix.",
        "Include at least one physical-layer fault, one addressing fault, one DNS or DHCP fault and one routing fault across the faults you set and solve.",
        "For the hardest fault, write a short root cause analysis using the 5 whys, ending with a preventive action.",
        "Capture traffic during one fault (only on your own lab) and explain what the capture showed that the show commands did not.",
        "Write a one-page incident report for a non-technical manager about one of the faults: impact, cause, fix and prevention.",
      ],
      closing:
        "You can now build, secure and repair networks. Module 10 scales up: enterprise design, the cloud, containers and automation.",
    },
  },
];
