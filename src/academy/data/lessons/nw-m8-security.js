/**
 * COMPUTER NETWORKING · MODULE 8 · NETWORK SECURITY FUNDAMENTALS
 *
 * Curriculum 8.1 – 8.26 and the practical. Principles, threats and risk;
 * authentication, access control and segmentation; firewalls and ACLs;
 * VPNs, encryption, PKI and certificates; wireless security, NAT, IDS and
 * IPS; how common network attacks work and how they are defended; packet
 * sniffing and reconnaissance; secure configuration and incident response.
 *
 * DEFENSIVE BY DESIGN. Attacks are explained so learners can recognise and
 * defend against them; the only hands-on scanning and capture are recorded
 * sessions on the course's own isolated lab machines, and every such atom
 * restates the rule from the curriculum: test only systems you own or are
 * explicitly authorised in writing to test.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

import { cap, dec, term } from "./nw-kit.js";

export const SECTION_ID = "nw-s8-security";
const M = "nw-m8-security";

const SEG_SERVERS = {
  devices: [
    { id: "Guest-PC", kind: "pc", x: 8, y: 14, ip: "192.168.30.10/24", gateway: "192.168.30.1", note: "guest Wi-Fi" },
    { id: "Staff-PC", kind: "pc", x: 8, y: 46, ip: "192.168.10.10/24", gateway: "192.168.10.1", note: "staff" },
    { id: "R1", kind: "router", x: 44, y: 30 },
    { id: "SW-Srv", kind: "switch", x: 70, y: 30 },
    { id: "Finance-SRV", kind: "server", x: 92, y: 14, ip: "10.0.10.5/24", gateway: "10.0.10.1", services: [80, 445], note: "finance" },
    { id: "Web-SRV", kind: "server", x: 92, y: 46, ip: "10.0.10.80/24", gateway: "10.0.10.1", services: [80], note: "public website" },
  ],
  links: [["Guest-PC:fa0", "R1:g0/0"], ["Staff-PC:fa0", "R1:g0/1"], ["R1:g0/2", "SW-Srv:g0/1"], ["Finance-SRV:fa0", "SW-Srv:fa0/1"], ["Web-SRV:fa0", "SW-Srv:fa0/2"]],
  config: {
    R1: "hostname R1\ninterface g0/0\n ip address 192.168.30.1 255.255.255.0\n no shutdown\ninterface g0/1\n ip address 192.168.10.1 255.255.255.0\n no shutdown\ninterface g0/2\n ip address 10.0.10.1 255.255.255.0\n no shutdown",
    "SW-Srv": "hostname SW-Srv",
  },
};

const SCAN_FIELDS = [
  { id: "src", label: "Source" },
  { id: "dst", label: "Destination" },
  { id: "dport", label: "Port" },
  { id: "action", label: "Firewall action" },
];

const SCAN_LOG = [
  { id: "f1", time: "10:00:01", src: "10.0.5.21", dst: "10.0.10.80", dport: 443, action: "allow" },
  { id: "f2", time: "10:00:04", src: "10.0.5.34", dst: "10.0.10.5", dport: 445, action: "allow" },
  { id: "f3", time: "10:00:09", src: "10.0.5.21", dst: "10.0.10.80", dport: 443, action: "allow" },
  { id: "f4", time: "10:00:12", src: "10.0.5.40", dst: "10.0.10.5", dport: 22, action: "deny" },
  { id: "f5", time: "10:01:00", src: "10.0.5.77", dst: "10.0.10.5", dport: 21, action: "deny", attack: true },
  { id: "f6", time: "10:01:00", src: "10.0.5.77", dst: "10.0.10.5", dport: 22, action: "deny", attack: true },
  { id: "f7", time: "10:01:00", src: "10.0.5.77", dst: "10.0.10.5", dport: 23, action: "deny", attack: true },
  { id: "f8", time: "10:01:01", src: "10.0.5.77", dst: "10.0.10.5", dport: 25, action: "deny", attack: true },
  { id: "f9", time: "10:01:01", src: "10.0.5.77", dst: "10.0.10.5", dport: 3306, action: "deny", attack: true },
  { id: "f10", time: "10:01:01", src: "10.0.5.77", dst: "10.0.10.5", dport: 3389, action: "deny", attack: true },
  { id: "f11", time: "10:01:02", src: "10.0.5.77", dst: "10.0.10.5", dport: 5432, action: "deny", attack: true },
  { id: "f12", time: "10:01:02", src: "10.0.5.77", dst: "10.0.10.5", dport: 8080, action: "deny", attack: true },
  { id: "f13", time: "10:02:30", src: "10.0.5.40", dst: "10.0.10.5", dport: 22, action: "deny" },
  { id: "f14", time: "10:03:10", src: "10.0.5.34", dst: "10.0.10.80", dport: 80, action: "allow" },
  { id: "f15", time: "10:04:45", src: "10.0.5.52", dst: "10.0.10.5", dport: 3389, action: "deny" },
  { id: "f16", time: "10:05:00", src: "10.0.5.21", dst: "10.0.10.5", dport: 445, action: "allow" },
];

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 1 · 8.1 – 8.3
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "nw-sc1-principles",
    moduleId: M,
    sectionId: SECTION_ID,
    order: 1,
    covers: ["8.1", "8.2", "8.3"],
    title: "Security Principles, Threats and Risk",
    subtitle: "What network security protects, from what, and how to decide what matters most",
    estimatedMinutes: 35,
    intro:
      "Everything you have built so far works. This module makes it safe. It starts with the ideas every security decision rests on. One rule runs through the whole module and your career: you only ever test systems you own or have explicit written permission to test.",

    atoms: [
      {
        id: "a-nw-security-intro",
        title: "Introduction to network security",
        explain:
          "NETWORK SECURITY is protecting a network and the data and services on it from unauthorised access, misuse, modification and disruption, while keeping them available to the people who need them. It is not one product but layers: DEFENCE IN DEPTH means that if one control fails, another still stands. A typical set of layers: physical security (locked wiring closets), segmentation (VLANs and firewalls between zones), access control (who may log in to what), hardening (removing defaults and unneeded services), encryption (of traffic and stored data), monitoring (logs and intrusion detection), and people (training, because most breaches start with a person tricked by an email). Security is a continuous PROCESS: assess, protect, detect, respond, improve. And it is a trade-off with usability and cost: a perfectly locked network nobody can use has failed too. Everything in this module is defensive. Understanding how attacks work is what lets you recognise and stop them; using that knowledge against systems you are not authorised to test is a crime in most countries, including under Nigeria's Cybercrimes Act 2015.",
        decision: dec(
          "A company's only security control is a firewall at the internet edge. An employee opens a malicious email attachment, and the malware spreads from that PC to every server inside the network.",
          "What principle did the design ignore?",
          ["Defence in depth: there were no internal layers (segmentation, endpoint protection, monitoring) to stop the spread once the edge was bypassed", "One layer always fails eventually; others must contain the damage."],
          [
            ["The firewall should have been faster", "Speed was not the problem; the attack came from inside."],
            ["Firewalls are useless and should be removed", "The edge firewall is a valid layer; it just should not be the only one."],
            ["Employees should not have email", "That is impractical; layered controls are the answer."],
          ]
        ),
      },
      {
        id: "a-nw-cia",
        title: "Security principles: confidentiality, integrity and availability",
        explain:
          "The CIA TRIAD names the three things security protects. CONFIDENTIALITY: information is seen only by those authorised, protected by encryption, access control and segmentation; broken by eavesdropping or a data leak. INTEGRITY: information and systems are not changed without authorisation, and changes are detectable, protected by hashes, digital signatures, access control and change logs; broken when an attacker alters a payment instruction or a router's configuration. AVAILABILITY: systems and data are usable when needed, protected by redundancy, backups, capacity and DDoS defences; broken by outages, ransomware and denial-of-service attacks. Every security control supports at least one of the three, and every incident damages at least one. Two companions are often added: AUTHENTICATION (proving who someone is) and NON-REPUDIATION (someone cannot deny an action they took, thanks to signatures and logs).",
        decision: dec(
          "During a transfer between a bank and a supplier, an attacker changes the destination account number in a payment file without being detected. Nobody else saw the file.",
          "Which part of the CIA triad was violated?",
          ["Integrity: the data was altered without authorisation", "Nobody unauthorised read it (confidentiality) and the system stayed up (availability); the content was changed."],
          [
            ["Confidentiality", "The file was not disclosed to others; it was modified."],
            ["Availability", "The system kept working."],
            ["None of them", "An unauthorised change is an integrity failure."],
          ]
        ),
      },
      {
        id: "a-nw-threats-risk",
        title: "Threats, vulnerabilities and risks",
        explain:
          "Three words that are often confused. A VULNERABILITY is a WEAKNESS: an unpatched router, a default password, an open port that should be closed, a staff member who has never been trained. A THREAT is something that could EXPLOIT a weakness: a criminal group, a disgruntled insider, malware, even a flood or a power cut. RISK is the chance that a threat exploits a vulnerability, combined with the IMPACT if it does; it is often estimated as likelihood × impact. You cannot remove every risk, so organisations decide how to TREAT each one: REDUCE it (patch, add a control), TRANSFER it (insurance, outsourcing), AVOID it (stop doing the risky thing) or ACCEPT it (consciously, when the cost of fixing exceeds the harm). Prioritise by risk, not by noise: an internet-facing server with a known, actively exploited flaw outranks a theoretical weakness on an isolated test machine. Vulnerabilities are published with CVE identifiers and severity scores, and vendors issue patches for them.",
        decision: dec(
          "A security review lists two findings: a public web server running software with a known flaw that criminals are actively exploiting, and an old printer on an isolated lab network with a weak web admin password.",
          "Which should be fixed first, and why?",
          ["The public web server: it is exposed to the internet and actively targeted, so likelihood and impact are both high", "Risk combines exposure, active threats and impact."],
          [
            ["The printer, because weak passwords are always worst", "On an isolated network, its likelihood of exploitation is far lower."],
            ["Both at exactly the same time, regardless of risk", "Teams have limited time; risk decides order."],
            ["Neither: findings can wait until the next annual review", "An actively exploited, exposed flaw cannot wait."],
          ]
        ),
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 2 · 8.4 – 8.6
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "nw-sc2-access",
    moduleId: M,
    sectionId: SECTION_ID,
    order: 2,
    covers: ["8.4", "8.5", "8.6"],
    title: "Authentication, Access Control and Segmentation",
    subtitle: "Who you are, what you may reach, and walls between zones",
    estimatedMinutes: 50,
    intro:
      "Most attacks need access to something they should not reach. This lesson covers proving identity, limiting what each identity can do, and dividing the network so a problem in one part cannot spread to the rest.",

    atoms: [
      {
        id: "a-nw-authn-authz",
        title: "Authentication and authorisation",
        explain:
          "AUTHENTICATION proves WHO you are; AUTHORISATION decides WHAT you may do; ACCOUNTING records what you did. Together they are AAA. Authentication uses one or more FACTORS: something you KNOW (a password or PIN), something you HAVE (a phone with an authenticator app, a hardware security key, a smart card) and something you ARE (a fingerprint or face). MULTI-FACTOR AUTHENTICATION (MFA) requires two or more different factors, so a stolen password alone is not enough: it is the single most effective protection against account takeover. On network devices, logins should use INDIVIDUAL accounts checked centrally by a RADIUS or TACACS+ server (TACACS+, common for network equipment, separates authentication from per-command authorisation and logs every command), with a local fallback account for emergencies. Authorisation then follows LEAST PRIVILEGE: help-desk staff may view switch status but not change configuration, and network engineers get full rights only on the devices they manage.",
        decision: dec(
          "Attackers obtain a network engineer's password from a phishing website. The company's VPN and router logins require a password plus a code from an authenticator app on the engineer's phone.",
          "Can the attackers log in?",
          ["No: they have one factor (the password) but not the second (the phone), which is the point of MFA", "MFA stops a stolen password from being enough."],
          [
            ["Yes: a correct password always works", "With MFA, the password alone is insufficient."],
            ["Yes, because MFA only protects email", "MFA can protect any login that is configured to require it."],
            ["No, because passwords are encrypted", "Encryption did not stop the phishing; the second factor stops the login."],
          ]
        ),
      },
      {
        id: "a-nw-access-control",
        title: "Access control on network devices",
        explain:
          "ACCESS CONTROL limits who can reach what. On network devices, the most important access to control is MANAGEMENT access: only administrators, only from the management network, and only over SSH. On a Cisco router the remote login lines are called VTY lines, configured together with line vty 0 4 (lines 0 to 4). Three settings there: login local makes logins use the device's local user accounts (created with username followed by a name, the word secret and a password, for example username netadmin secret Adm1n-Lab-2026); transport input ssh accepts SSH only, refusing Telnet; and access-class followed by an access-list number and in allows logins only from addresses that list permits. A STANDARD ACCESS LIST matches SOURCE addresses: access-list 10 permit 192.168.99.0 0.0.0.255 permits the admin network (the wildcard mask from Module 4), and every list ends with an invisible 'deny everything else'. So access-list 10 plus access-class 10 in means: SSH only from 192.168.99.0/24. On a NetLab PC, the ssh command is ssh -l followed by the user name and the device's address, for example ssh -l netadmin 192.168.99.1. In the lab, the router already accepts SSH from anywhere, with the user netadmin; restrict it to the admin network.",
        netLab: {
          task:
            "R1 accepts SSH logins (user netadmin) from any network, including the staff LAN. Restrict management: create standard access list 10 permitting only the admin network 192.168.99.0/24, and apply it to the VTY lines with access-class 10 in. Then confirm Admin-PC can still SSH to R1 and Staff-PC cannot.",
          devices: [
            { id: "Admin-PC", kind: "pc", x: 10, y: 15, ip: "192.168.99.10/24", gateway: "192.168.99.1", note: "admin network" },
            { id: "Staff-PC", kind: "pc", x: 10, y: 45, ip: "192.168.10.10/24", gateway: "192.168.10.1", note: "staff LAN" },
            { id: "R1", kind: "router", x: 60, y: 30 },
          ],
          links: [["Admin-PC:fa0", "R1:g0/0"], ["Staff-PC:fa0", "R1:g0/1"]],
          config: {
            R1: "hostname R1\nip domain-name lab.local\ncrypto key generate rsa modulus 2048\nip ssh version 2\nusername netadmin secret Adm1n-Lab-2026\nenable secret Str0ng-Enable-2026\ninterface g0/0\n ip address 192.168.99.1 255.255.255.0\n no shutdown\ninterface g0/1\n ip address 192.168.10.1 255.255.255.0\n no shutdown\nline vty 0 4\n login local\n transport input ssh",
          },
          start: "R1",
          height: 34,
          goals: [
            { type: "ssh", from: "Admin-PC", to: "192.168.99.1", user: "netadmin", label: "Admin-PC can SSH to R1" },
            { type: "ssh", from: "Staff-PC", to: "192.168.10.1", user: "netadmin", expect: false, label: "Staff-PC is refused" },
          ],
          hint: "On R1: enable (the enable secret is Str0ng-Enable-2026), configure terminal, access-list 10 permit 192.168.99.0 0.0.0.255, line vty 0 4, access-class 10 in, end. Test from each PC with ssh -l netadmin and R1's address on that PC's network.",
          successMessage: "Management access now comes only from the admin network, only over SSH, only with a named account. Three layers on one set of lines.",
        },
      },
      {
        id: "a-nw-segmentation",
        title: "Network segmentation",
        explain:
          "SEGMENTATION divides a network into ZONES by trust and function, and controls the traffic between them, so that a compromise in one zone does not give access to everything. Typical zones: STAFF devices, SERVERS (often split further: finance, HR, general), GUEST and IoT devices, MANAGEMENT (where administrators connect to network devices), and a DMZ for systems reachable from the internet (next lesson). Each zone is its own VLAN and subnet, and traffic between zones passes through a firewall or ACL that allows only what is needed: the 'deny by default' principle from Module 7, applied between networks. The modern extension of this idea is ZERO TRUST: no device is trusted because of where it is plugged in; every access is authenticated and authorised. Payment-card rules (PCI DSS) require card systems to be segmented from the rest of the network. Set the rules below for a small company's zones.",
        firewallExercise: {
          brief:
            "Guests (192.168.30.0/24) may reach the internet but nothing internal. Staff (192.168.10.0/24) may reach the servers (10.0.10.0/24). Everything else between zones is denied. Reorder and adjust the rules so every sample connection gets the right result.",
          rules: [
            { id: "allow-guest-out", action: "allow", proto: "any", source: "192.168.30.0/24", dest: "any", port: "any" },
            { id: "deny-guest-internal", action: "deny", proto: "any", source: "192.168.30.0/24", dest: "10.0.0.0/8", port: "any" },
            { id: "allow-staff-servers", action: "allow", proto: "tcp", source: "192.168.10.0/24", dest: "10.0.10.0/24", port: "any" },
          ],
          traffic: [
            { id: "s1", label: "Guest phone to a website on the internet", proto: "tcp", source: "192.168.30.25", dest: "142.250.180.4", port: 443, expect: "allow" },
            { id: "s2", label: "Guest phone to the finance server", proto: "tcp", source: "192.168.30.25", dest: "10.0.10.5", port: 445, expect: "deny" },
            { id: "s3", label: "Staff PC to the finance server", proto: "tcp", source: "192.168.10.10", dest: "10.0.10.5", port: 445, expect: "allow" },
            { id: "s4", label: "Server initiating a connection to a guest phone", proto: "tcp", source: "10.0.10.5", dest: "192.168.30.25", port: 8080, expect: "deny" },
          ],
          expect: true,
          successMessage:
            "The guest deny for internal addresses must sit above the broad guest allow, or guests reach the servers. Exceptions above rules; default deny catches the rest.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 3 · 8.7 – 8.9
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "nw-sc3-firewalls-acls",
    moduleId: M,
    sectionId: SECTION_ID,
    order: 3,
    covers: ["8.7", "8.8", "8.9"],
    title: "Firewalls and Access Control Lists",
    subtitle: "Where firewalls sit, how they track connections, and filtering on a router",
    estimatedMinutes: 55,
    intro:
      "You have ordered firewall rules on a Linux host. Now the network view: where firewalls are placed, how stateful firewalls know which replies to allow, and how to filter traffic between subnets with router access lists.",

    atoms: [
      {
        id: "a-nw-firewall-architectures",
        title: "Firewalls and firewall architectures",
        explain:
          "A NETWORK FIREWALL sits between zones and enforces the policy between them. Common placements: a PERIMETER firewall between the internet and the organisation; INTERNAL firewalls between zones (staff, servers, guests), which is where segmentation is enforced; and HOST firewalls on each server (Module 7). The classic architecture for public services is the DMZ (demilitarised zone, also called a screened subnet): web, mail and DNS servers that the internet must reach sit in their own zone, so the internet may reach the DMZ, the DMZ may reach only the specific internal systems it needs, and the internet may never reach the internal network directly. If a DMZ server is compromised, the attacker is still outside the internal network. Firewalls range from simple packet filters to NEXT-GENERATION FIREWALLS (NGFW) that identify applications regardless of port, inspect traffic for known attacks, filter websites by category, decrypt TLS where policy allows, and identify users. Cloud platforms provide their own firewalls (security groups, Module 10).",
        decision: dec(
          "A company wants customers on the internet to reach its web server, and the web server to query an internal database, but nobody on the internet must ever reach the internal network.",
          "Where should the web server go?",
          ["In a DMZ: the internet may reach only the DMZ, and the DMZ may reach only the database port it needs", "The DMZ contains the damage if the public server is compromised."],
          [
            ["On the internal staff network", "Then internet traffic must be allowed into the internal network."],
            ["Outside the firewall, with no protection", "The server itself would be exposed to everything."],
            ["On the guest Wi-Fi", "Guest networks are for visitors, not public servers."],
          ]
        ),
      },
      {
        id: "a-nw-stateful-stateless",
        title: "Stateful versus stateless firewalls",
        explain:
          "A STATELESS filter (a plain router ACL is one) examines each packet on its own, against the rules, with no memory of earlier packets. To let replies back in, you must write rules allowing them explicitly, often by opening wide ranges of high ports, which is clumsy and weak. A STATEFUL firewall keeps a STATE TABLE of every connection that passes through it: when an inside client opens a connection out, the firewall records it (addresses, ports, protocol, TCP state) and AUTOMATICALLY allows the matching return traffic, while unsolicited packets from outside, which match no known connection, are dropped by the default deny. Stateful inspection is the normal behaviour of modern firewalls (including Linux's netfilter, which UFW manages, and cloud security groups). Stateless filtering survives where speed and simplicity matter more, such as basic ACLs on routers and cloud network ACLs (Module 10), which is why those must allow return traffic explicitly.",
        decision: dec(
          "Staff browse the internet freely, but no inbound connections are allowed. With a stateful firewall, the administrator wrote only one rule: allow staff to the internet on TCP 443.",
          "How do the websites' replies get back in?",
          ["The firewall's state table recognises them as part of connections the staff opened, and allows them automatically", "Stateful firewalls track connections so replies need no separate rule."],
          [
            ["They do not, so browsing fails", "A stateful firewall allows the return traffic of permitted connections."],
            ["A second rule must allow all inbound traffic", "That would defeat the policy."],
            ["The websites send replies through DNS instead", "Replies come back over the same TCP connection."],
          ]
        ),
      },
      {
        id: "a-nw-acls",
        title: "Access Control Lists (ACLs)",
        explain:
          "On Cisco routers, ACCESS CONTROL LISTS filter traffic between networks. A STANDARD ACL (numbered 1–99) matches only the SOURCE address, so it is placed close to the DESTINATION (as you did on the VTY lines). An EXTENDED ACL (numbered 100–199, or named) matches protocol, source, destination and port, so it can be placed close to the SOURCE, stopping unwanted traffic early. The syntax for an extended entry: access-list followed by the number, permit or deny, the protocol (ip for everything, tcp, udp, icmp), the source with its wildcard mask, and the destination, where the word host followed by an address means that single address and the word any means everything: access-list 110 deny ip 192.168.30.0 0.0.0.255 host 10.0.10.5. Entries are checked top to bottom, first match wins, and an invisible DENY ANY ends every list, so a list that only denies blocks everything: add access-list 110 permit ip any any at the end if everything else should pass. Apply a list to an interface, in one direction, with ip access-group followed by the number and in (traffic arriving) or out (traffic leaving): on the guest-facing interface, ip access-group 110 in. show access-lists shows each list with match counters. In the lab, guests must be kept off the finance server without losing the public website.",
        netLab: {
          task:
            "Guests (192.168.30.0/24, arriving on R1's G0/0) can currently reach everything, including the finance server 10.0.10.5. Create extended ACL 110 that denies all IP traffic from the guest network to host 10.0.10.5 and permits everything else, and apply it inbound on G0/0. Guests must still reach the public web server 10.0.10.80 on port 80, and staff must still reach finance.",
          ...SEG_SERVERS,
          start: "R1",
          height: 50,
          goals: [
            { type: "ping", from: "Guest-PC", to: "10.0.10.5", expect: false, label: "Guests can no longer reach the finance server" },
            { type: "tcp", from: "Guest-PC", to: "10.0.10.80", port: 80, label: "Guests still reach the public website" },
            { type: "ping", from: "Staff-PC", to: "10.0.10.5", label: "Staff still reach the finance server" },
          ],
          hint: "On R1: enable, configure terminal, access-list 110 deny ip 192.168.30.0 0.0.0.255 host 10.0.10.5, access-list 110 permit ip any any, interface g0/0, ip access-group 110 in, end, show access-lists.",
          successMessage: "One deny for exactly what must be blocked, one permit for the rest, applied where guest traffic enters. Forget the permit line and the implicit deny would have cut guests off from everything.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 4 · 8.10 – 8.14
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "nw-sc4-vpn-crypto",
    moduleId: M,
    sectionId: SECTION_ID,
    order: 4,
    covers: ["8.10", "8.11", "8.12", "8.13", "8.14"],
    title: "VPNs, Encryption, PKI and Certificates",
    subtitle: "Private tunnels across public networks, and the mathematics of trust",
    estimatedMinutes: 55,
    intro:
      "Most traffic now crosses networks nobody in your organisation controls. Encryption keeps it private and unaltered, certificates prove who is at the other end, and VPNs build private networks on top of the public internet.",

    atoms: [
      {
        id: "a-nw-vpns",
        title: "VPNs: Virtual Private Networks",
        explain:
          "A VPN creates an ENCRYPTED TUNNEL across an untrusted network (usually the internet), so traffic inside it is private and tamper-proof, and the two ends behave as if they were on one private network. SITE-TO-SITE VPNs join whole networks: a branch office's router or firewall builds a permanent tunnel to head office, and branch users reach head-office servers as if they were local, without paying for a private leased line. REMOTE-ACCESS VPNs connect individual users: a laptop runs a VPN client that tunnels to the company's VPN gateway, giving the user access to internal systems from home or a hotel. A FULL-TUNNEL VPN sends all the user's traffic through the company (so it is filtered and logged); a SPLIT-TUNNEL VPN sends only company-bound traffic through the tunnel and the rest straight to the internet (less load, less visibility). Consumer 'privacy VPN' services use the same technology to hide your traffic from the local network and your ISP, moving your trust to the VPN provider. Many organisations now supplement or replace remote-access VPNs with zero-trust access, which grants access per application instead of to the whole network.",
        decision: dec(
          "A company with a head office in Lagos and branches in Ibadan and Port Harcourt wants branch staff to reach head-office servers securely, using the branches' existing business broadband.",
          "What should it deploy?",
          ["Site-to-site VPN tunnels from each branch's router or firewall to head office", "Permanent encrypted tunnels join whole networks over the internet."],
          [
            ["A remote-access VPN client on every branch PC", "That works but is harder to manage than one tunnel per site."],
            ["Open the head-office servers to the internet", "That exposes them to everyone."],
            ["A guest Wi-Fi network at each branch", "Guest networks give internet access, not secure access to head office."],
          ]
        ),
      },
      {
        id: "a-nw-ipsec-tls",
        title: "IPsec and SSL/TLS VPN fundamentals",
        explain:
          "Two families of protocol build most VPNs. IPSEC works at Layer 3 and protects IP packets themselves. It first uses IKE (Internet Key Exchange, UDP port 500, and 4500 when NAT is in the way) to authenticate the two ends (with pre-shared keys or certificates) and agree keys; then ESP (Encapsulating Security Payload) encrypts and authenticates each packet. In TUNNEL MODE the whole original packet is encrypted and wrapped in a new IP header between the two gateways, which is how site-to-site VPNs work. IPsec is the standard for site-to-site links between routers and firewalls from different vendors. SSL/TLS VPNs use TLS, the same protocol that protects HTTPS, usually over TCP or UDP port 443, which passes through almost any firewall or hotel network; they are popular for remote access (Cisco AnyConnect, OpenVPN, and vendors' clients). WIREGUARD is a newer, much simpler VPN protocol over UDP with modern cryptography, widely used in Linux and cloud networks. Whatever the protocol, the VPN's security depends on strong authentication (certificates or MFA) and keeping the gateway patched: VPN gateways are a favourite target of attackers.",
        decision: dec(
          "A sales team's remote-access VPN uses IPsec, and it fails in many hotels whose networks allow only web traffic (TCP 80 and 443) out.",
          "Which VPN approach would work in those hotels?",
          ["An SSL/TLS VPN over port 443, which looks like ordinary HTTPS to the hotel firewall", "TLS VPNs pass where IPsec's UDP 500 and 4500 are blocked."],
          [
            ["IPsec with a longer pre-shared key", "The problem is blocked ports, not key strength."],
            ["Telnet", "Telnet is unencrypted remote login, not a VPN."],
            ["Turning off encryption so the traffic looks normal", "That removes the point of a VPN."],
          ]
        ),
      },
      {
        id: "a-nw-encryption",
        title: "Encryption fundamentals",
        explain:
          "ENCRYPTION turns readable PLAINTEXT into unreadable CIPHERTEXT with an algorithm and a KEY; only someone with the right key can turn it back. SYMMETRIC encryption uses the SAME key to encrypt and decrypt (AES is the standard, with 128 or 256-bit keys): very fast, used for bulk data, but both sides must somehow share the secret key safely. ASYMMETRIC (public-key) encryption uses a KEY PAIR: a PUBLIC key anyone may have and a PRIVATE key only its owner holds; what one key encrypts, only the other can decrypt (RSA and elliptic-curve cryptography are the common families). It is slow, but it solves key sharing and enables DIGITAL SIGNATURES (signing with your private key proves the data came from you and was not changed). Real protocols combine them: TLS, SSH and VPNs use asymmetric cryptography to authenticate and agree a fresh symmetric SESSION KEY, then AES for the data. HASHING is different again: a one-way fingerprint (SHA-256) that cannot be reversed, used to verify integrity and to store passwords (with a salt). Encryption protects data IN TRANSIT (TLS, VPNs) and AT REST (encrypted disks and databases).",
        decision: dec(
          "When your browser connects to your bank over HTTPS, TLS uses the bank's public key early in the connection and then switches to AES for the rest of the session.",
          "Why not use public-key encryption for everything?",
          ["Asymmetric encryption is far slower, so it is used to authenticate and agree a symmetric session key, and fast symmetric AES then encrypts the data", "Each kind of cryptography does the job it is best at."],
          [
            ["Public-key encryption is insecure", "It is secure; it is just slow for bulk data."],
            ["AES cannot be used without a public key", "AES is symmetric; it needs a shared key, which the public-key step helps agree."],
            ["Banks are not allowed to use RSA", "There is no such rule."],
          ]
        ),
      },
      {
        id: "a-nw-pki",
        title: "Public Key Infrastructure (PKI)",
        explain:
          "Public-key cryptography raises one question: how do you know a public key really belongs to your bank and not to an impostor? PUBLIC KEY INFRASTRUCTURE answers it with trusted third parties. A CERTIFICATE AUTHORITY (CA) verifies an organisation's identity and SIGNS a certificate binding its name to its public key. Your operating system and browser ship with a list of trusted ROOT CAs; roots sign INTERMEDIATE CAs, which sign the certificates websites use, forming a CHAIN OF TRUST that your browser checks link by link up to a root it trusts. Certificates EXPIRE (public website certificates now last at most about a year, and free automated CAs such as Let's Encrypt issue 90-day certificates renewed automatically) and can be REVOKED if a private key is stolen. Organisations also run their own PRIVATE CA to issue certificates for internal servers, Wi-Fi 802.1X and VPN users, trusted only by their own devices. If a CA is compromised, every certificate it signed becomes suspect, which is why CAs are tightly audited.",
        decision: dec(
          "A browser shows a full-page warning: the certificate for a site 'is not trusted', because it was signed by a certificate authority the browser has never heard of.",
          "What does this most likely mean?",
          ["The browser cannot build a chain of trust to a root CA it trusts, so it cannot confirm the site is who it claims; it may be self-signed or an impostor", "Trust comes from the chain up to a known root."],
          [
            ["The site's encryption is stronger than normal", "The warning is about identity, not strength."],
            ["The internet connection is slow", "Speed has nothing to do with certificate trust."],
            ["It is always safe to click through the warning", "On the public internet it can mean an interception attack."],
          ]
        ),
      },
      {
        id: "a-nw-certificates",
        title: "Digital certificates",
        explain:
          "An X.509 DIGITAL CERTIFICATE contains: the SUBJECT (who it identifies, such as CN=example.com, plus SUBJECT ALTERNATIVE NAMES listing every name it is valid for); the ISSUER (the CA that signed it); the VALIDITY period (not before, not after); the subject's PUBLIC KEY; the uses it is allowed for; and the CA's SIGNATURE over all of it. During a TLS handshake the server sends its certificate (and the intermediates); the client checks that the name matches the address it asked for, that the dates are valid, that the chain leads to a trusted root, and that it is not revoked. A mismatch on any of these is a warning to heed. Expired certificates are one of the most common causes of outages: monitor expiry dates. On Linux, verbose curl output (curl -sv followed by an https address) shows the TLS version, the subject, the issuer and the dates. The recording below shows them for example.com, filtered with grep to just those lines.",
        terminal: term("m8-tls", { goal: "Read the subject, issuer and validity dates of example.com's certificate in the recorded output." }),
        decision: dec(
          "Monitoring alerts that the certificate on the company's customer portal expires in five days.",
          "What happens if nobody acts?",
          ["After expiry, browsers will show security warnings and many clients will refuse to connect, effectively an outage, until a renewed certificate is installed", "Expired certificates fail validation."],
          [
            ["Nothing: certificates keep working after expiry", "Clients reject expired certificates."],
            ["The site becomes faster", "Expiry has no effect on speed."],
            ["The encryption automatically switches to a stronger key", "Nothing renews automatically unless configured."],
          ]
        ),
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 5 · 8.15 – 8.18
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "nw-sc5-wireless-nat-ids",
    moduleId: M,
    sectionId: SECTION_ID,
    order: 5,
    covers: ["8.15", "8.16", "8.17", "8.18"],
    title: "Wireless Security, NAT, and Intrusion Detection and Prevention",
    subtitle: "Threats to Wi-Fi, what NAT does not protect, and watching for attacks",
    estimatedMinutes: 50,
    intro:
      "Three more defensive layers: securing the airwaves beyond the passphrase, understanding the limits of NAT as protection, and the systems that watch traffic for signs of attack.",

    atoms: [
      {
        id: "a-nw-wireless-security-threats",
        title: "Wireless network security",
        explain:
          "Module 6 covered WPA2, WPA3 and authentication. The wider wireless threats a network engineer must plan for: ROGUE ACCESS POINTS, unauthorised access points plugged into the wired network (often by staff wanting better coverage), which bypass every wireless control; EVIL TWINS, an attacker's access point broadcasting a trusted SSID to lure devices into connecting through it; weak or SHARED PASSPHRASES that leak; DEAUTHENTICATION attacks that knock clients off a network (WPA3's protected management frames defend against these); and the plain fact that radio crosses walls into car parks. Defences: WPA3 (or WPA2-AES) with ENTERPRISE authentication and certificates, so clients verify the network as well as the network verifying the clients; protected management frames; guest isolation (Module 6); WIRELESS INTRUSION PREVENTION (WIPS), built into most controller-based systems, which detects rogue and evil-twin access points; switch port security and 802.1X on wired ports, so a rogue access point cannot simply be plugged in; and regular wireless surveys.",
        decision: dec(
          "A wireless survey finds an unknown access point broadcasting the company's staff SSID from a car parked outside the building.",
          "What is this, and what defence would stop staff devices trusting it?",
          ["An evil twin; enterprise authentication with server certificates lets devices verify the real network and refuse the impostor", "With 802.1X and certificate validation, clients authenticate the network too."],
          [
            ["A harmless neighbour's router", "It is broadcasting the company's own SSID from outside, which is the definition of an evil twin."],
            ["A rogue AP plugged into the company switch", "Rogue APs are connected to the wired network; this one is in a car."],
            ["Nothing can stop it, so ignore it", "Enterprise authentication and WIPS address it."],
          ]
        ),
      },
      {
        id: "a-nw-nat-security",
        title: "NAT and security considerations",
        explain:
          "NAT and PAT (Module 4) hide inside addresses and, because unsolicited inbound packets have no translation entry, they drop most unrequested connections from the internet. That side effect is often mistaken for a security control, but NAT IS NOT A FIREWALL. It does nothing to traffic that inside devices start themselves, which is how most modern attacks work: malware that reaches a PC by email or a website connects OUT to its controller, through NAT, without difficulty. Static NAT and PORT FORWARDING deliberately open inside devices to the internet (a forwarded port on a home router exposes that camera or server to every scanner on the internet). NAT also complicates security monitoring, because logs at the edge show one public address for everyone; you need the translation logs to know which inside device did what. And IPv6, which usually runs without NAT, depends entirely on a real stateful firewall. So: keep a proper stateful firewall with a default deny, filter outbound traffic too, and log translations.",
        decision: dec(
          "A small business owner says: 'We don't need a firewall. Our router does NAT, so nobody on the internet can reach our computers.'",
          "What is wrong with this reasoning?",
          ["NAT does not inspect or block connections started from inside (how most malware communicates), port forwards expose devices on purpose, and IPv6 traffic may bypass NAT entirely; a stateful firewall policy is still needed", "NAT's protection is a side effect, not a security policy."],
          [
            ["Nothing: NAT is a complete firewall", "NAT does not filter outbound traffic or inspect anything."],
            ["NAT makes the network faster, so security does not matter", "Speed is unrelated."],
            ["NAT only works with IPv6", "NAT is mainly an IPv4 technique."],
          ]
        ),
      },
      {
        id: "a-nw-ids",
        title: "IDS: Intrusion Detection Systems",
        explain:
          "An INTRUSION DETECTION SYSTEM watches traffic or logs and RAISES ALERTS on signs of attack; it does not block anything. A NETWORK IDS (NIDS, such as Snort, Suricata or Zeek) receives a copy of traffic from a switch's mirror (SPAN) port or a network tap; a HOST IDS (HIDS) watches one machine's logs and files. Two detection methods: SIGNATURE-based detection matches known attack patterns (precise, but blind to new attacks); ANOMALY-based detection learns what is normal and flags deviations (catches new things, with more false positives). A classic thing to detect is a PORT SCAN: one source trying many different ports on a host in a short time, usually being refused, because an attacker is mapping what is open. Tuning is the real work: a rule that is too loose buries analysts in false positives; too tight and the attack walks past. Below is a firewall log. Build a detection rule that catches the scan while generating as few false alarms as possible: add conditions on the fields, and optionally count events by a field and alert when the count reaches a threshold.",
        huntExercise: {
          task: "One host on the staff network is scanning the finance server. Write a rule that alerts on the scan with no more than one false positive: think about what distinguishes many quick refused attempts from one source from the occasional ordinary refusal.",
          fields: SCAN_FIELDS,
          events: SCAN_LOG,
          showAttackColumn: true,
          expect: { maxFalsePositives: 1 },
          hint: "Condition: Firewall action is deny. Then count by Source and alert at 5 or more: ordinary hosts are refused once or twice, the scanner eight times within two seconds.",
          successMessage: "Every probe from 10.0.5.77 caught, and the ordinary refusals from other hosts stay below the threshold. That is the shape of most real detection rules: a condition, a grouping and a threshold.",
        },
      },
      {
        id: "a-nw-ips",
        title: "IPS: Intrusion Prevention Systems",
        explain:
          "An INTRUSION PREVENTION SYSTEM does what an IDS does, but sits INLINE, in the path of the traffic, so it can BLOCK what it detects: drop the malicious packets, reset the connection, or block the source for a time. Most next-generation firewalls include IPS. Because it is inline, an IPS has two costs an IDS does not: it must keep up with the traffic (or it becomes a bottleneck or a single point of failure, so it is deployed with fail-open or redundant designs), and every FALSE POSITIVE now blocks legitimate traffic, which can break a business application. So new IPS rules usually start in DETECT-ONLY mode, are tuned against real traffic, and are switched to blocking once trusted. Encrypted traffic is a growing blind spot for both IDS and IPS, addressed by TLS inspection where policy and law allow, and by endpoint detection on the devices themselves (EDR).",
        decision: dec(
          "A new IPS signature is switched straight to blocking mode on a hospital's network. Within an hour, the patient-records application stops working, because the signature wrongly matches its normal traffic.",
          "What practice would have prevented this?",
          ["Running new signatures in detect-only mode first, tuning out false positives, then enabling blocking", "Inline blocking turns every false positive into an outage."],
          [
            ["Using an IDS instead, which blocks more accurately", "An IDS does not block at all."],
            ["Turning the IPS off permanently", "That gives up the protection."],
            ["Placing the IPS on the guest network only", "The problem was untested blocking, not location."],
          ]
        ),
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 6 · 8.19 – 8.22
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "nw-sc6-attacks",
    moduleId: M,
    sectionId: SECTION_ID,
    order: 6,
    covers: ["8.19", "8.20", "8.21", "8.22"],
    title: "Common Network Attacks and Their Defences",
    subtitle: "DDoS, ARP spoofing, DNS spoofing and man-in-the-middle: recognise and defend",
    estimatedMinutes: 45,
    intro:
      "To defend a network you must understand how it is attacked. This lesson explains four classic attacks at the level a defender needs: how each works, what it looks like, and what stops it. None of it is to be tried on networks you do not own or have written permission to test.",

    atoms: [
      {
        id: "a-nw-ddos",
        title: "DDoS attacks",
        explain:
          "A DENIAL-OF-SERVICE attack attacks AVAILABILITY: it makes a service unusable for legitimate users by exhausting something it needs. A DISTRIBUTED DoS (DDoS) does it from thousands or millions of machines at once, typically a BOTNET of hijacked computers, cameras and routers. Three broad kinds: VOLUMETRIC attacks flood the victim's internet link with more traffic than it can carry (often AMPLIFIED: the attacker sends small requests with the victim's forged address to open DNS or other servers, which send much larger replies to the victim); PROTOCOL attacks exhaust connection tables in firewalls and servers (a SYN FLOOD sends huge numbers of SYNs and never completes the handshake); and APPLICATION-LAYER attacks send floods of expensive but legitimate-looking requests (searches, logins). Defences: capacity and redundancy; upstream DDoS SCRUBBING by the ISP or a provider such as Cloudflare or Akamai, which filters attack traffic before it reaches you (you cannot absorb a link-filling flood on your own side of the link); CDNs; rate limiting; SYN cookies on servers; and making sure your own devices are not part of botnets (patch them, change default passwords, close open resolvers).",
        decision: dec(
          "A bank's website goes down because its 10 Gbps internet link is completely filled by traffic from tens of thousands of addresses worldwide.",
          "Where must this attack be stopped, and why?",
          ["Upstream, by the ISP or a DDoS scrubbing service, because once the link is full no firewall at the bank can help: the good traffic cannot get through either", "Volumetric floods must be filtered before they reach the congested link."],
          [
            ["With a firewall rule on the bank's edge router", "The link is already full before traffic reaches the router."],
            ["By blocking each attacking address by hand", "Tens of thousands of changing addresses cannot be blocked by hand."],
            ["By rebooting the web server", "The server is not the bottleneck."],
          ]
        ),
      },
      {
        id: "a-nw-arp-spoofing",
        title: "ARP spoofing",
        explain:
          "ARP (Module 4) believes any reply, even one nobody asked for. In ARP SPOOFING (or ARP poisoning), a device on the LOCAL network sends forged ARP replies claiming 'the gateway's IP address is at MY MAC address'. Victims update their caches and send their off-network traffic to the attacker instead of the router; the attacker can read it, alter it, or pass it on (becoming a man in the middle, the fourth atom) or drop it (denial of service). It works only from inside the same LAN or VLAN, which is one more reason segmentation matters. Signs: two IP addresses with the same MAC in ARP tables, the gateway's MAC changing, duplicate-address warnings, and IDS alerts. Defences on managed switches: DHCP SNOOPING builds a table of which IP address was leased to which MAC on which port, and DYNAMIC ARP INSPECTION (DAI) uses that table to drop ARP replies that do not match it; PORT SECURITY limits how many MAC addresses a port may use. Encryption (TLS, VPNs) means even an attacker who intercepts traffic cannot read or silently change it.",
        decision: dec(
          "On an office LAN, several PCs' ARP caches suddenly show the default gateway's IP address mapped to the MAC address of a desktop PC in the accounts department.",
          "What is the likely cause, and which switch feature defends against it?",
          ["ARP spoofing from that desktop (possibly malware on it); Dynamic ARP Inspection, using DHCP snooping's bindings, drops forged ARP replies", "A gateway IP mapped to a PC's MAC is the classic sign of ARP poisoning."],
          [
            ["A normal DHCP renewal", "DHCP renewals do not change the gateway's MAC address."],
            ["A DNS failure", "DNS maps names to IPs; this is an IP-to-MAC mapping."],
            ["A broken cable on the gateway", "A broken cable would not make the gateway's address point at a PC."],
          ]
        ),
      },
      {
        id: "a-nw-dns-spoofing",
        title: "DNS spoofing",
        explain:
          "DNS SPOOFING makes a victim resolve a name to an ADDRESS THE ATTACKER CHOSE, sending them to a fake banking site or a malware server while the address bar shows the real name. Ways it happens: CACHE POISONING, where forged answers are injected into a resolver's cache so every user of that resolver gets the wrong address; compromising a ROUTER or PC to change its DNS server setting to a malicious resolver (home routers with default passwords are a common target); editing a PC's HOSTS FILE with malware; spoofing DNS replies from a man-in-the-middle position on the local network; and hijacking a domain's registration or DNS hosting account to change its records at the source. Defences: DNSSEC, which digitally signs DNS records so resolvers can detect forged answers; encrypted DNS (DNS over HTTPS or TLS) between clients and trusted resolvers; patched, properly configured resolvers that are not open to the internet; MFA and registry locks on domain accounts; protecting device settings (change default router passwords); and, above all, HTTPS with certificate checks, so a spoofed address still cannot present a valid certificate for the real name.",
        decision: dec(
          "Customers of a bank report that typing the bank's correct web address takes them to a convincing fake login page, but their browsers show a certificate warning.",
          "What is happening, and which control is warning them?",
          ["DNS is being spoofed to send them to the attacker's server, and HTTPS certificate validation is catching it because the fake server cannot present a valid certificate for the bank's name", "Certificates protect against spoofed addresses."],
          [
            ["The bank's certificate expired, and the page is real", "An expired certificate would not explain a different, fake page."],
            ["The customers' Wi-Fi is too slow", "Speed does not change where a name resolves."],
            ["This is ARP spoofing and nothing to do with DNS", "The wrong site appears for the correct name, which points at name resolution."],
          ]
        ),
      },
      {
        id: "a-nw-mitm",
        title: "Man-in-the-middle attacks",
        explain:
          "In a MAN-IN-THE-MIDDLE (MitM) attack, the attacker places themselves between two parties who believe they are talking directly, and relays, reads or alters their traffic. Positions that enable it: ARP spoofing on a LAN, an evil-twin Wi-Fi access point, DNS spoofing, a compromised router, or a malicious proxy. Against unencrypted protocols (HTTP, Telnet, FTP, plain email), a MitM can read and change everything, including passwords. Against encrypted ones, attackers try to DOWNGRADE the connection (strip HTTPS to HTTP) or to get the victim to accept a fake certificate. Defences: END-TO-END ENCRYPTION with authentication everywhere (HTTPS, SSH, TLS for email, VPNs on untrusted networks), with certificate validation that users and applications do not bypass; HSTS, which tells browsers to use only HTTPS for a site; WPA3 and 802.1X on Wi-Fi; DAI and DHCP snooping on switches; and teaching users that certificate warnings and 'the site is not secure' messages on sensitive pages are to be reported, never clicked through.",
        decision: dec(
          "On a café's open Wi-Fi, a user logs in to a work portal that still uses plain HTTP. The next day the account is taken over.",
          "What most likely happened, and what fix stops it?",
          ["Someone on the network intercepted the login in transit (a man in the middle or a sniffer); the portal must use HTTPS (with HSTS), and remote users should use a VPN on untrusted networks", "Unencrypted logins on shared networks are readable by anyone in the middle."],
          [
            ["The password was too long", "Length did not matter; it was sent in clear text."],
            ["The café's coffee machine interfered with the Wi-Fi", "Interference does not steal passwords."],
            ["HTTP is encrypted by default, so it must have been phishing", "HTTP is not encrypted."],
          ]
        ),
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 7 · 8.23 – 8.24
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "nw-sc7-sniffing-recon",
    moduleId: M,
    sectionId: SECTION_ID,
    order: 7,
    covers: ["8.23", "8.24"],
    title: "Packet Sniffing and Network Reconnaissance",
    subtitle: "Seeing what an attacker sees, on your own lab, so you can close it",
    estimatedMinutes: 45,
    intro:
      "Defenders use the same tools attackers do, for the opposite purpose: to see their own network as an outsider would and fix what they find. Both atoms here use the course's own isolated lab machines. The rule stands: only on systems you own or are explicitly authorised, in writing, to test.",

    atoms: [
      {
        id: "a-nw-packet-sniffing",
        title: "Packet sniffing",
        explain:
          "PACKET SNIFFING is capturing traffic as it crosses a network, which is exactly what you did with Wireshark in Module 2. Network engineers sniff to troubleshoot (Module 9) and security teams to investigate incidents; attackers sniff to steal credentials and data. A sniffer sees what passes the interface it listens on: on a switched network that is mainly its own traffic and broadcasts, unless it is on a mirror (SPAN) port, a shared Wi-Fi channel, or in a man-in-the-middle position. Anything sent UNENCRYPTED can be read in full: HTTP form data, Telnet and FTP logins, old email protocols. The capture below was recorded on our lab: the workstation submitted a login form to the intranet server over plain HTTP. In Wireshark, the POST method means a form being submitted, and the form's fields, including the password, travel in the packet's body, readable by anyone who captures it. Find that packet: filter with http, as in Module 2, and select the request that sends the form. The DEFENCE is encryption: with HTTPS the same capture would show only TLS records, no readable fields at all.",
        captureExercise: {
          task: "Filter the capture to HTTP, then click the packet in which the workstation submits the login form (and with it, the password in clear text).",
          packets: cap("m8-cleartext"),
          expect: {
            maxRows: 2,
            packet: 4,
            mustContain: [4],
            whyWrong: "One HTTP row is the request from the workstation (192.168.56.10) and one is the server's response. The form submission is the request, the one whose Info column starts with POST.",
            success: "The POST from 192.168.56.10. Expanding that packet in Wireshark would show 'username=ada&password=Lab-Only-2026' in plain text. Every login page must use HTTPS.",
          },
          hint: "Type http and press Apply. Of the two rows left, choose the one whose Info starts with POST.",
        },
      },
      {
        id: "a-nw-reconnaissance",
        title: "Network reconnaissance",
        explain:
          "RECONNAISSANCE is the first phase of almost every attack: learning which hosts exist, which ports are open, and which services and versions they run, to find a way in. PASSIVE recon gathers information without touching the target (public DNS records, certificate logs, search engines, job adverts listing technologies). ACTIVE recon probes the network, most often with NMAP. Defenders scan their OWN networks for the same reasons: to keep an accurate inventory, find services nobody should be running, and confirm the firewall really blocks what policy says. The core nmap commands: nmap -sn followed by a network does HOST DISCOVERY only (which addresses answer), with no port scan: nmap -sn 192.168.56.0/24. nmap followed by an address scans the 1,000 most common TCP ports on it. nmap -sV adds SERVICE VERSION detection, and -p lists the ports to check. Scanning systems without permission is illegal in many countries and against every ISP's terms; even inside your employer, scan only with written authorisation and within an agreed scope and time. The recording is our own lab network.",
        terminalExercise: term("m8-nmap", {
          goal: "On the course's own lab network (192.168.56.0/24), find which hosts are up, WITHOUT scanning any of their ports.",
          accept: ["nmap -sn 192.168.56.0/24"],
          near: [
            { command: "nmap 192.168.56.20", why: "That scans the ports of one host. The goal is to discover which hosts exist, without any port scan." },
            { command: "nmap -sV -p 22,53,80 192.168.56.20", why: "That identifies service versions on one host, a later step. First, discover the hosts." },
          ],
          hint: "nmap with -sn (host discovery only), then the lab network in CIDR notation.",
          success: "Hosts up on the lab network, including the server 192.168.56.20 and this workstation. Read on: the port scan of srv01 shows 22, 53 and 80 open, and -sV names OpenSSH, dnsmasq and nginx with their versions. A defender asks of every line: should this be open, and is it patched?",
        }),
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 8 · 8.25 – 8.26, 8.P
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "nw-sc8-hardening-ir",
    moduleId: M,
    sectionId: SECTION_ID,
    order: 8,
    covers: ["8.25", "8.26", "8.P"],
    title: "Secure Configuration, Monitoring and Incident Response",
    subtitle: "Hardening a router, and what to do when something goes wrong",
    estimatedMinutes: 55,
    intro:
      "Default configurations are designed to work, not to be safe. You will harden a router to a professional baseline, then learn the incident response process every security team follows.",

    atoms: [
      {
        id: "a-nw-secure-config",
        title: "Secure network configuration",
        explain:
          "Every network device should be hardened to a baseline before it goes live. On a Cisco router or switch, in global configuration mode: enable secret followed by a password protects privileged mode with a strong hash (never the old enable password, which is stored weakly; remove it with no enable password); service password-encryption hides any remaining plain-text passwords in the configuration from casual viewing; username followed by a name, secret and a password creates a named admin account. SSH needs a domain name and an RSA key pair: ip domain-name followed by a domain, then crypto key generate rsa modulus 2048; then ip ssh version 2 allows only the secure version. On the VTY lines (line vty 0 4): login local and transport input ssh, as in Lesson 2. Beyond the commands: change every default password, disable unused services and ports (shutdown unused interfaces), keep the software patched, use NTP and send logs to a central server, back up configurations, and document it all. CIS Benchmarks and vendor hardening guides list full baselines. In the lab, a router still has its factory-style settings: Telnet allowed and a weak plain enable password.",
        netLab: {
          task:
            "Harden R1: set the enable secret Str0ng-Enable-2026 and remove the old enable password; turn on password encryption; create the user netadmin with the secret Adm1n-Lab-2026; set the domain name lab.local, generate a 2048-bit RSA key and require SSH version 2; and make the VTY lines use local logins over SSH only. Then SSH from Admin-PC as netadmin.",
          devices: [
            { id: "Admin-PC", kind: "pc", x: 14, y: 30, ip: "192.168.99.10/24", gateway: "192.168.99.1" },
            { id: "R1", kind: "router", x: 62, y: 30 },
          ],
          links: [["Admin-PC:fa0", "R1:g0/0"]],
          config: {
            R1: "hostname R1\nenable password cisco\ninterface g0/0\n ip address 192.168.99.1 255.255.255.0\n no shutdown\nline vty 0 4\n password cisco\n login\n transport input telnet",
          },
          start: "R1",
          height: 34,
          goals: [
            { type: "secure", device: "R1", require: ["enableSecret", "noEnablePassword", "passwordEncryption", "sshOnly", "sshV2"], label: "R1 meets the hardening baseline" },
            { type: "ssh", from: "Admin-PC", to: "192.168.99.1", user: "netadmin", label: "Admin-PC can SSH to R1 as netadmin" },
            { type: "telnet", from: "Admin-PC", to: "192.168.99.1", expect: false, label: "Telnet is refused" },
          ],
          hint: "enable (password cisco), configure terminal, enable secret Str0ng-Enable-2026, no enable password, service password-encryption, username netadmin secret Adm1n-Lab-2026, ip domain-name lab.local, crypto key generate rsa modulus 2048, ip ssh version 2, line vty 0 4, login local, transport input ssh, end.",
          successMessage: "Strong hashed secrets, named accounts, SSH version 2 only, no Telnet. This baseline belongs on every device you ever deploy.",
        },
      },
      {
        id: "a-nw-monitoring-ir",
        title: "Security monitoring and incident response fundamentals",
        explain:
          "SECURITY MONITORING collects logs from firewalls, servers, network devices and endpoints into a central SIEM (security information and event management system, such as Splunk, Microsoft Sentinel or the open-source Wazuh), where rules and analysts look for signs of attack around the clock (often in a security operations centre, SOC). INCIDENT RESPONSE is what happens when something is found, and follows a plan prepared in advance. The widely used NIST lifecycle has four phases: 1. PREPARATION: the plan, the contacts, the tools, the logging, and practice exercises. 2. DETECTION AND ANALYSIS: confirm it is real, work out what happened, which systems are affected and how badly, and record everything with times. 3. CONTAINMENT, ERADICATION AND RECOVERY: stop the spread (isolate affected hosts, block addresses, disable accounts), remove the cause (malware, the attacker's access, the vulnerability), and restore systems from clean backups, then watch them closely. 4. POST-INCIDENT ACTIVITY: a blameless review of what happened and what to improve. Preserve EVIDENCE (do not just wipe machines), know when to involve management, legal advisers and, where the law requires (for example Nigeria's Data Protection Act 2023 for personal data breaches), regulators and affected people.",
        decision: dec(
          "Monitoring shows a staff PC sending large amounts of data to an unknown server abroad at 3 am. The analyst confirms it is not normal behaviour.",
          "Which step comes next, according to the incident response lifecycle?",
          ["Containment: isolate the PC from the network (preserving it for investigation) to stop further data leaving, then investigate and eradicate", "Stop the damage first, without destroying evidence."],
          [
            ["Wipe the PC and reinstall it immediately", "That destroys the evidence needed to understand what was taken and how."],
            ["Wait a week to gather more data", "Data is leaving now; containment cannot wait."],
            ["Post-incident review", "The review comes after the incident is resolved."],
          ]
        ),
      },
    ],

    requirements: { read: true, video: false, assessment: true },

    task: {
      title: "Module 8 practical: securing a network, defensively",
      intro:
        "Use Packet Tracer, NetLab, or virtual machines you own. Scanning and capture exercises must be done only on your own isolated lab machines, or on systems you have explicit written permission to test.",
      prompts: [
        "Configure firewall rules (UFW on a Linux VM, or an ACL on a router) that allow only the services a web server needs, and test each rule from another machine.",
        "Segment a lab network into trusted (staff), server and untrusted (guest) zones with VLANs and ACLs, and prove guests cannot reach the servers.",
        "Capture your own lab traffic and identify any protocol sending credentials in clear text; then change the service to an encrypted one and capture again to compare.",
        "In your own isolated lab only, run nmap host discovery and a port scan against your own VM, list every open port, and close or firewall the ones that should not be open.",
        "Set up a basic VPN between two of your own VMs (for example WireGuard), and confirm in a capture that the traffic between them is encrypted.",
        "Review a router or switch configuration against the hardening baseline in Lesson 8 and write a list of the misconfigurations you find, with the fix for each.",
      ],
      closing:
        "A secure network still breaks. Module 9 teaches a method for finding faults quickly, and the monitoring that spots them before users do.",
    },
  },
];
