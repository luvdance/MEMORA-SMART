/**
 * COMPUTER NETWORKING · MODULE 3 · IP ADDRESSING AND SUBNETTING
 *
 * Curriculum 3.1 – 3.35 and the practical. The core module of the course:
 * what an IP address is, public and private, static and dynamic, IPv4 and
 * IPv6, binary, network and host IDs, special addresses, masks, classful
 * history, CIDR, network and broadcast addresses, gateways, subnetting
 * Class A/B/C networks, FLSM, VLSM, summarisation and IPv6.
 *
 * Every calculation is practised by hand (netCalc: typed answers recomputed
 * by the content check), as judgement (decisions), and on a live network (NetLabs graded by whether the packets get through). Model
 * answers for the labs live in lib/academy/network/solutions.mjs.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

import { dec } from "./nw-kit.js";

export const SECTION_ID = "nw-s3-subnetting";
const M = "nw-m3-subnetting";

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 1 · 3.1 – 3.4
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "nw-ip1-ip-addresses",
    moduleId: M,
    sectionId: SECTION_ID,
    order: 1,
    covers: ["3.1", "3.2", "3.3", "3.4"],
    title: "IP Addresses: What, Why and Which Kind",
    subtitle: "Logical addresses, public and private, static and dynamic",
    estimatedMinutes: 35,
    intro:
      "Every packet on the internet carries two IP addresses: where it came from and where it is going. This module is about those addresses: how they are built, how networks are carved out of them, and how to plan them for a real organisation. It is the single most tested skill in networking, so we take it slowly and practise every step.",

    atoms: [
      {
        id: "a-nw-ip-what",
        title: "What an IP address is, and why devices need one",
        explain:
          "An IP ADDRESS (Internet Protocol address) is a LOGICAL address given to a network interface so that data can be delivered to it across networks. In IPv4 it looks like 192.168.1.10: four numbers from 0 to 255. You already met the MAC address, burned into every NIC. So why a second address? Because a MAC address says WHO a device is, not WHERE it is. It is flat: 00:1A:2B:3C:4D:5E tells a router nothing about which network the device lives in, and a router on the other side of the world cannot keep a list of every MAC address on the planet. An IP address is HIERARCHICAL, like a postal address: the first part names the NETWORK (the street), the rest names the HOST on that network (the house). Routers only need to know how to reach networks, not individual devices, which is what lets the internet scale to billions of hosts. Devices need IP addresses to be reached at all: no address, no delivery. MAC addresses still matter on the local link (a switch forwards frames by MAC), but between networks, IP addresses do the routing.",
        analogy:
          "Your national ID number identifies you wherever you go, but a courier cannot deliver a parcel to an ID number. They need your street address, which changes when you move. The MAC is the ID number; the IP address is the street address.",
        decision: dec(
          "A laptop moves from the office network to a hotel Wi-Fi in another city. Its NIC, and so its MAC address, is the same in both places.",
          "Why does the laptop get a different IP address at the hotel?",
          ["An IP address says which network a device is on, so a device on a new network needs an address from that network", "IP addresses are logical and hierarchical: the network part must match the network the device is attached to, or routers cannot deliver replies to it."],
          [
            ["The old IP address wore out", "Addresses do not wear out; they belong to networks."],
            ["MAC addresses change when you travel, so the IP must too", "The MAC is burned into the NIC and stays the same everywhere."],
            ["Hotels use a different version of the internet", "The internet is one network of networks; the hotel is just a different network on it."],
          ],
          "This is why your phone's address changes between home Wi-Fi, office Wi-Fi and mobile data, while its MAC address (unless privacy randomisation is on) stays the same."
        ),
      },
      {
        id: "a-nw-public-private",
        title: "Public versus private IP addresses",
        explain:
          "A PUBLIC address is unique on the whole internet and is routed by every internet router. Public addresses are handed out by five Regional Internet Registries (AFRINIC for Africa, RIPE NCC, ARIN, APNIC, LACNIC) to providers and organisations. A PRIVATE address is reserved for use inside an organisation and is NEVER routed on the internet, so millions of homes and offices can reuse the same ones. RFC 1918 reserves three private ranges: 10.0.0.0 to 10.255.255.255 (10.0.0.0/8), 172.16.0.0 to 172.31.255.255 (172.16.0.0/12), and 192.168.0.0 to 192.168.255.255 (192.168.0.0/16). Your home router gives your phone something like 192.168.0.23, and NAT (network address translation, Module 4) swaps it for the router's single public address on the way out. Watch the 172 range closely: 172.16 through 172.31 are private, but 172.15.x.x and 172.32.x.x are public. Examiners love that trap.",
        table: {
          caption: "The three RFC 1918 private ranges. Everything else in unicast space is public (with a few special exceptions in Lesson 4).",
          headers: ["Range", "CIDR block", "Size", "Typical use"],
          rows: [
            ["10.0.0.0 – 10.255.255.255", "10.0.0.0/8", "16,777,216 addresses", "Large enterprises, data centres"],
            ["172.16.0.0 – 172.31.255.255", "172.16.0.0/12", "1,048,576 addresses", "Medium networks, cloud VPCs, Docker"],
            ["192.168.0.0 – 192.168.255.255", "192.168.0.0/16", "65,536 addresses", "Homes and small offices"],
          ],
        },
        decision: dec(
          "An auditor is checking a list of addresses found in a company's firewall logs to see which ones came from inside the company.",
          "Which of these addresses is private?",
          ["172.20.5.9", "172.20 falls inside 172.16.0.0 – 172.31.255.255, the RFC 1918 block 172.16.0.0/12."],
          [
            ["172.32.1.1", "The private 172 range stops at 172.31.255.255; 172.32.x.x is public."],
            ["11.0.0.1", "Only 10.x.x.x is private; 11.x.x.x is public."],
            ["192.169.1.1", "Only 192.168.x.x is private; 192.169.x.x is public."],
          ]
        ),
      },
      {
        id: "a-nw-static-dynamic",
        title: "Static versus dynamic addressing",
        explain:
          "A STATIC address is typed in by an administrator and never changes. A DYNAMIC address is leased automatically from a DHCP server (Dynamic Host Configuration Protocol) for a period of time, together with the mask, the default gateway and the DNS server. Use DYNAMIC for the devices that come and go (PCs, laptops, phones): nobody has to type anything, and addresses are reused when devices leave. Use STATIC for the devices other devices must always find at the same address: routers, switches' management addresses, servers, network printers, access points and cameras. A common office pattern is to reserve the bottom of the range for static devices and EXCLUDE it from the DHCP pool, so the server never hands out an address that a printer is already using. (Many networks instead use a DHCP RESERVATION, which always gives one MAC address the same address; it is dynamic configuration with a static result.) In the lab below, the router's DHCP pool for 192.168.5.0/24 excludes .1 to .29. The office printer has no address yet, so nobody can print. You already know how to type a static address on a NetLab device: ipconfig followed by the address and the mask. A third number can follow, the DEFAULT GATEWAY: the address of the router, which the device uses to reach anything outside its own network (Lesson 6 explains it fully). So the printer gets ipconfig 192.168.5.20 255.255.255.0 192.168.5.1. For a DHCP client, ipconfig /renew asks the DHCP server for an address and shows what came back, and ipconfig /release gives the address back.",
        netLab: {
          task:
            "The router R1 runs DHCP for 192.168.5.0/24 and keeps 192.168.5.1–192.168.5.29 out of the pool for static devices. Give the printer the static address 192.168.5.20, mask 255.255.255.0, gateway 192.168.5.1. Then make sure PC1 has a DHCP address and can reach the printer.",
          devices: [
            { id: "R1", kind: "router", x: 50, y: 8, note: "DHCP server" },
            { id: "SW1", kind: "switch", x: 50, y: 24 },
            { id: "PC1", kind: "pc", x: 20, y: 40, dhcp: true },
            { id: "Printer", kind: "server", x: 80, y: 40, note: "network printer" },
          ],
          links: [["R1:g0/0", "SW1:g0/1"], ["PC1:fa0", "SW1:fa0/1"], ["Printer:fa0", "SW1:fa0/2"]],
          config: {
            R1: "hostname R1\ninterface g0/0\n ip address 192.168.5.1 255.255.255.0\n no shutdown\nip dhcp excluded-address 192.168.5.1 192.168.5.29\nip dhcp pool OFFICE\n network 192.168.5.0 255.255.255.0\n default-router 192.168.5.1",
            SW1: "hostname SW1",
          },
          start: "Printer",
          goals: [
            { type: "ip", device: "Printer", iface: "fa0", address: "192.168.5.20/24", label: "The printer has the static address 192.168.5.20/24" },
            { type: "dhcp", host: "PC1", subnet: "192.168.5.0/24", label: "PC1 gets its address dynamically, by DHCP" },
            { type: "ping", from: "PC1", to: "192.168.5.20", label: "PC1 can reach the printer" },
          ],
          hint: "On the printer: ipconfig 192.168.5.20 255.255.255.0 192.168.5.1. On PC1: ipconfig /renew, look at the address it was given (it starts at .30), then ping 192.168.5.20.",
          successMessage:
            "Static where devices must be found, dynamic where they come and go, and the static range kept out of the DHCP pool so the two never collide. That pattern is in almost every office network.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 2 · 3.5 – 3.7
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "nw-ip2-ipv4-ipv6",
    moduleId: M,
    sectionId: SECTION_ID,
    order: 2,
    covers: ["3.5", "3.6", "3.7"],
    title: "IPv4 and IPv6",
    subtitle: "32 bits that ran out, 128 bits that will not, and how an IPv4 address is built",
    estimatedMinutes: 30,
    intro:
      "Two versions of IP run the internet side by side. IPv4 is what you will configure most days; IPv6 is what the internet is moving to. Learn the shape of each before we take IPv4 apart bit by bit.",

    atoms: [
      {
        id: "a-nw-ipv4",
        title: "IPv4 addressing",
        explain:
          "IPv4, defined in 1981 (RFC 791), uses 32-BIT addresses. 32 bits give 2^32 = 4,294,967,296 possible addresses: about 4.3 billion. That seemed endless in 1981 and is far too few today, with more phones than people and billions of cameras, sensors and servers. The global pool ran out in February 2011, when IANA handed its last blocks to the five regional registries, and each registry has since reached its final blocks; AFRINIC, serving Africa, was the last. The internet survived on three tricks: PRIVATE addresses reused inside every organisation, NAT to share one public address among many devices, and CIDR (Lesson 5) to stop wasting addresses in oversized blocks. The real fix is IPv6. IPv4 is still the version you will configure most, so the rest of this module works mainly in IPv4.",
        decision: dec(
          "A start-up asks why its ISP will give it only one public IPv4 address for an office of 40 devices, when it wanted one per device.",
          "What is the real reason?",
          ["IPv4 has only about 4.3 billion addresses and the global pool is exhausted, so devices share a public address through private addressing and NAT", "Public IPv4 addresses are scarce and expensive; private addresses plus NAT are the standard answer."],
          [
            ["IPv4 can only address 40 devices per network", "A single IPv4 network can hold millions of hosts; the limit is the global supply of public addresses."],
            ["Public addresses only work for servers", "Any device can use a public address; there just are not enough to go round."],
            ["The ISP has not upgraded to IPv5", "There is no IPv5 in use; the successor to IPv4 is IPv6."],
          ]
        ),
      },
      {
        id: "a-nw-ipv4-structure",
        title: "IPv4 address structure",
        explain:
          "An IPv4 address is 32 bits, written in DOTTED-DECIMAL notation: the 32 bits are split into four groups of 8 bits called OCTETS, each octet is written as a decimal number, and the four are separated by dots. Because an octet has 8 bits, each one ranges from 0 (00000000) to 255 (11111111). So 192.168.1.10 is really 11000000.10101000.00000001.00001010, and an address such as 192.168.1.300 is impossible: 300 does not fit in 8 bits. Every address is also split, by its subnet mask, into a NETWORK portion (the leftmost bits) and a HOST portion (the rest); Lesson 4 covers that split and Lesson 5 the mask. Answer the questions below about any IPv4 address.",
        netCalc: {
          task: "Work out the size of an IPv4 address.",
          questions: [
            { q: "How many octets are in an IPv4 address?", answer: "4", hint: "Count the numbers between the dots in 192.168.1.10.", working: "192 . 168 . 1 . 10 → 4 octets" },
            { q: "How many bits are in one octet?", answer: "8", hint: "'Oct' means eight.", working: "1 octet = 8 bits" },
            { q: "How many bits are in a whole IPv4 address?", answer: "32", hint: "Four octets of 8 bits each.", working: "4 × 8 = 32 bits" },
            { q: "What is the largest value one octet can hold?", answer: "255", hint: "Eight bits give 256 values, starting at 0.", working: "2^8 = 256 values: 0 to 255" },
          ],
          successMessage: "Four octets, 32 bits, each octet 0 to 255. Every calculation in this module starts from that.",
        },
      },
      {
        id: "a-nw-ipv6-intro",
        title: "IPv6 addressing",
        explain:
          "IPv6 uses 128-BIT addresses: 2^128, about 340 undecillion (3.4 × 10^38), enough to give every grain of sand on Earth billions of addresses. An IPv6 address is written as EIGHT GROUPS of four HEXADECIMAL digits (0–9 and a–f), separated by colons: 2001:0db8:acad:0001:0000:0000:0000:0010. Two shortening rules (Lesson 9) make it 2001:db8:acad:1::10. Beyond size, IPv6 brings: no need for NAT (every device can have a globally unique address), automatic address configuration (SLAAC, where a device builds its own address from the network's prefix), a simpler packet header for faster routing, and built-in multicast instead of broadcast. Most networks today run DUAL STACK: every device has both an IPv4 and an IPv6 address, and uses IPv6 where the other end supports it. Nigerian mobile networks and most large content providers already serve a share of traffic over IPv6.",
        table: {
          caption: "The two versions side by side.",
          headers: ["", "IPv4", "IPv6"],
          rows: [
            ["Address length", "32 bits", "128 bits"],
            ["Possible addresses", "about 4.3 billion", "about 3.4 × 10^38"],
            ["Written as", "4 decimal octets, dots: 192.168.1.10", "8 hex groups, colons: 2001:db8:acad:1::10"],
            ["Configuration", "Manual or DHCP", "Manual, DHCPv6 or automatic (SLAAC)"],
            ["NAT", "Needed to share scarce public addresses", "Not needed"],
            ["Broadcast", "Yes", "No: multicast replaces it"],
          ],
        },
        decision: dec(
          "A trainee writes four addresses on a whiteboard and asks which is a valid IPv6 address.",
          "Which one is valid?",
          ["2001:db8:acad:1::10", "Hex groups separated by colons, with one :: standing for a run of zero groups."],
          [
            ["2001:db8::acad::10", "The :: shortcut may appear only once, or nobody could tell how many zero groups each one hides."],
            ["192.168.1.300", "That is written like IPv4, and 300 does not fit in an octet anyway."],
            ["2001:db8:gh12::1", "IPv6 uses hexadecimal: the digits are 0–9 and a–f. g and h are not hex digits."],
          ]
        ),
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 3 · 3.8 – 3.10
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "nw-ip3-binary",
    moduleId: M,
    sectionId: SECTION_ID,
    order: 3,
    covers: ["3.8", "3.9", "3.10"],
    title: "Binary: The Language of Addresses",
    subtitle: "Place values, decimal to binary, binary to decimal",
    estimatedMinutes: 40,
    intro:
      "Subnetting is easy in binary and confusing in decimal. Routers do everything in binary, so to understand what a router does with an address and a mask, you need to read and write 8-bit numbers fluently. It takes about an hour of practice, and you never lose it.",

    atoms: [
      {
        id: "a-nw-binary-system",
        title: "The binary number system",
        explain:
          "Decimal is base 10: each place is worth ten times the place to its right (1, 10, 100, 1000). BINARY is base 2: each place is worth TWO times the place to its right, and each digit (a BIT) is either 0 or 1. An octet has 8 bits, and their place values, from left to right, are 128, 64, 32, 16, 8, 4, 2, 1. Learn that row by heart: it is the only table subnetting needs. The value of an octet is the sum of the place values that hold a 1. So 10000001 = 128 + 1 = 129, and 11111111 = 128+64+32+16+8+4+2+1 = 255, the largest octet. The leftmost bit is the MOST SIGNIFICANT bit (worth 128) and the rightmost the LEAST SIGNIFICANT (worth 1). Two more rows worth memorising, because masks are built from them: the values with ones filled in from the left are 128, 192, 224, 240, 248, 252, 254, 255.",
        table: {
          caption: "The octet's place values, and the mask values made by filling ones in from the left.",
          headers: ["Bit position", "8", "7", "6", "5", "4", "3", "2", "1"],
          rows: [
            ["Place value", "128", "64", "32", "16", "8", "4", "2", "1"],
            ["Ones from the left", "128", "192", "224", "240", "248", "252", "254", "255"],
          ],
        },
        decision: dec(
          "A student claims an IPv4 octet can hold any number from 0 to 256.",
          "What is the real largest value, and why?",
          ["255, because eight bits all set to 1 add up to 128+64+32+16+8+4+2+1 = 255", "Eight bits give 2^8 = 256 different values, and counting starts at 0, so the top is 255."],
          [
            ["256, because 2^8 is 256", "2^8 is the NUMBER of values (0 to 255), not the largest one."],
            ["128, because that is the leftmost place value", "128 is only the value of the leftmost bit on its own."],
            ["999, like a three-digit decimal number", "An octet is 8 binary digits, not 3 decimal digits."],
          ]
        ),
      },
      {
        id: "a-nw-dec-to-bin",
        title: "Decimal-to-binary conversion",
        explain:
          "To convert a decimal octet to binary, use the SUBTRACTION METHOD with the place-value row. Start at 128. If the place value fits into what is left of the number, write 1 and subtract it; if it does not fit, write 0. Move to the next place value and repeat until you reach 1. Worked example, 168: 128 fits (168 − 128 = 40), write 1. 64 does not fit into 40, write 0. 32 fits (40 − 32 = 8), write 1. 16 does not fit into 8, write 0. 8 fits (8 − 8 = 0), write 1. 4, 2 and 1 do not fit into 0: write 0, 0, 0. So 168 = 10101000. Always write all eight bits, leading zeros included: 10 is 00001010, not 1010, because the octet's bits line up with the mask's bits. Now convert these by hand, writing the place-value row on paper first.",
        netCalc: {
          task: "Convert each decimal octet to 8-bit binary with the subtraction method. Always write all eight bits.",
          questions: [
            { q: "Convert 168 to binary.", answer: "10101000", check: { fn: "toBinary", arg: "168" }, hint: "128 fits (40 left), 64 does not, 32 fits (8 left), 16 does not, 8 fits (0 left), then 0, 0, 0.", working: "168 − 128 = 40 → 1\n64 > 40 → 0\n40 − 32 = 8 → 1\n16 > 8 → 0\n8 − 8 = 0 → 1\n4, 2, 1 → 0 0 0\n= 10101000" },
            { q: "Convert 192 to binary.", answer: "11000000", check: { fn: "toBinary", arg: "192" }, hint: "192 = 128 + 64.", working: "128 + 64 = 192 → 11000000" },
            { q: "Convert 10 to binary (keep the leading zeros).", answer: "00001010", check: { fn: "toBinary", arg: "10" }, hint: "10 = 8 + 2. The first four places (128, 64, 32, 16) are all 0.", working: "8 + 2 = 10 → 0000 1010" },
            { q: "Convert 255 to binary.", answer: "11111111", check: { fn: "toBinary", arg: "255" }, hint: "Every place value fits.", working: "128+64+32+16+8+4+2+1 = 255 → 11111111" },
            { q: "Convert 172 to binary.", answer: "10101100", check: { fn: "toBinary", arg: "172" }, hint: "172 = 128 + 32 + 8 + 4.", working: "172 − 128 = 44 → 1\n64 → 0\n44 − 32 = 12 → 1\n16 → 0\n12 − 8 = 4 → 1\n4 − 4 = 0 → 1\n2, 1 → 0 0\n= 10101100" },
          ],
          successMessage: "That is exactly what you will do in your head in an exam: walk 128, 64, 32 … and subtract what fits.",
        },
      },
      {
        id: "a-nw-bin-to-dec",
        title: "Binary-to-decimal conversion",
        explain:
          "Binary to decimal is the reverse and is even quicker: write the place values above the bits and ADD the place values wherever there is a 1. Worked example, 11000000: 128 + 64 = 192. Another, 00001010: 8 + 2 = 10. For a whole address, do each octet separately: 11000000.10101000.00000001.00001010 is 192.168.1.10. A useful shortcut for octets that are mostly ones: 11111100 is 255 minus the place values of the zeros (2 + 1), so 252. Convert these by hand.",
        netCalc: {
          task: "Convert binary to decimal by adding the place values of the 1 bits.",
          questions: [
            { q: "Convert 11000000 to decimal.", answer: "192", check: { fn: "fromBinary", arg: "11000000" }, hint: "The two 1s sit under 128 and 64.", working: "128 + 64 = 192" },
            { q: "Convert 00001010 to decimal.", answer: "10", check: { fn: "fromBinary", arg: "00001010" }, hint: "The 1s sit under 8 and 2.", working: "8 + 2 = 10" },
            { q: "Convert 11111100 to decimal.", answer: "252", check: { fn: "fromBinary", arg: "11111100" }, hint: "255 minus the place values of the zeros (2 and 1).", working: "255 − 2 − 1 = 252" },
            { q: "Convert the address 11000000.10101000.00000001.00001010 to dotted decimal.", answer: "192.168.1.10", check: { fn: "binaryToIp", arg: "11000000.10101000.00000001.00001010" }, hint: "One octet at a time: 11000000, then 10101000, then 00000001, then 00001010.", working: "11000000 = 192\n10101000 = 128+32+8 = 168\n00000001 = 1\n00001010 = 10\n= 192.168.1.10" },
            { q: "Convert 10101100.00010000.00100101.01011010 to dotted decimal.", answer: "172.16.37.90", check: { fn: "binaryToIp", arg: "10101100.00010000.00100101.01011010" }, hint: "10101100 is 172. Then 16, then 37, then 90.", working: "10101100 = 128+32+8+4 = 172\n00010000 = 16\n00100101 = 32+4+1 = 37\n01011010 = 64+16+8+2 = 90\n= 172.16.37.90" },
          ],
          successMessage: "You can now read the bits behind any address. Next: which of those bits name the network, and which name the host.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 4 · 3.11 – 3.14
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "nw-ip4-network-host-special",
    moduleId: M,
    sectionId: SECTION_ID,
    order: 4,
    covers: ["3.11", "3.12", "3.13", "3.14"],
    title: "Network ID, Host ID and Special Addresses",
    subtitle: "Which bits name the network, and the addresses you must never give a host",
    estimatedMinutes: 40,
    intro:
      "Every IPv4 address is two numbers in one: the network it belongs to, and the host within that network. And a few ranges have special jobs: some you will see when something is broken, which makes them excellent clues.",

    atoms: [
      {
        id: "a-nw-network-host-id",
        title: "Network ID and host ID",
        explain:
          "Every IPv4 address is split into two parts. The NETWORK ID (network portion) is the leftmost bits: it is the same for every device on the same network, like a street name. The HOST ID (host portion) is the remaining bits: it is different for every device on that network, like a house number. With the common mask 255.255.255.0 (/24), the first three octets are the network and the last octet is the host: in 192.168.1.10/24 the network is 192.168.1.0 and the host is .10. Two devices can talk DIRECTLY (through a switch, without a router) only if their network IDs match. If they do not, each device decides the other is on a different network and sends the traffic to its default gateway instead. This is the rule behind most addressing faults you will ever troubleshoot.",
        decision: dec(
          "Two PCs are plugged into the same switch. PC1 is 192.168.1.10/24 and PC2 is 192.168.2.10/24. There is no router. PC1 cannot ping PC2.",
          "Why not, when the cables and the switch are fine?",
          ["Their network IDs differ (192.168.1.0 and 192.168.2.0), so each PC thinks the other is on another network and looks for a router that is not there", "Same switch is not the same IP network. The network portions must match for direct communication."],
          [
            ["The switch blocks pings between different ports", "A basic switch forwards frames between any ports; it does not read IP addresses at all."],
            ["Their host IDs are both .10, which conflicts", "Host IDs only need to be unique within the same network. These are different networks."],
            ["/24 is too small for two PCs", "A /24 holds 254 hosts."],
          ],
          "Fix it by putting both PCs in the same network (for example 192.168.1.10 and 192.168.1.11), or by adding a router between the two networks."
        ),
      },
      {
        id: "a-nw-loopback",
        title: "Loopback addresses",
        explain:
          "The whole block 127.0.0.0/8 is reserved for LOOPBACK: traffic sent to it never leaves the device. It goes down the computer's own network software and straight back up. The address you will use is 127.0.0.1, also known by the name localhost. Two practical uses. First, TESTING THE TCP/IP STACK: if ping 127.0.0.1 succeeds, the operating system's networking software is working, even with the cable unplugged. If it fails, the problem is the computer itself (a broken driver or network stack), not the network. Second, LOCAL SERVICES: a developer running a website on their own laptop opens http://localhost:3000. (Routers have a different idea also called loopback: a virtual interface such as Loopback0 that is always up. You will use one in Lesson 9.) Try it below: ping 127.0.0.1 and localhost, then compare with pinging the router.",
        netDemo: {
          task:
            "PC1's switch port has been switched off, so its link is down (look at the red line). Try ping 127.0.0.1, then ping localhost, then ping the router at 10.0.0.1, and compare the results.",
          devices: [
            { id: "PC1", kind: "pc", x: 22, y: 30, ip: "10.0.0.10/24", gateway: "10.0.0.1" },
            { id: "SW1", kind: "switch", x: 52, y: 30 },
            { id: "R1", kind: "router", x: 82, y: 30 },
          ],
          links: [["PC1:fa0", "SW1:fa0/1"], ["R1:g0/0", "SW1:g0/1"]],
          config: {
            SW1: "hostname SW1\ninterface fa0/1\n shutdown",
            R1: "hostname R1\ninterface g0/0\n ip address 10.0.0.1 255.255.255.0\n no shutdown",
          },
          start: "PC1",
          height: 34,
        },
        decision: dec(
          "A user reports no network access. On their PC, ping 127.0.0.1 gets four replies, but ping to the default gateway times out.",
          "What does the successful loopback ping tell you?",
          ["The PC's own TCP/IP software works, so look outward: the cable, the switch port, the address settings or the gateway", "Loopback never leaves the PC, so it proves the stack and nothing beyond it."],
          [
            ["The network is fine and the gateway must be switched off", "Loopback says nothing about the network; the cable or switch port is just as likely."],
            ["The PC's network card must be faulty", "If the stack works, look at the path first; loopback does not exercise the cable or the switch."],
            ["The PC can reach the internet but not the gateway", "Nothing reaches the internet without the gateway."],
          ]
        ),
      },
      {
        id: "a-nw-apipa",
        title: "APIPA addresses",
        explain:
          "When a Windows (or macOS) device is set to get its address by DHCP and NO DHCP SERVER ANSWERS, it does not stay without an address. It gives itself one from 169.254.0.0/16, called APIPA (Automatic Private IP Addressing) or a link-local address, chosen at random and checked so no neighbour is already using it. Devices with APIPA addresses can talk to each other on the same link, but there is no gateway, so they cannot reach anything else. For a network engineer, a 169.254.x.x address is a CLUE: it means 'I asked for DHCP and nobody answered'. The causes to check: is the DHCP server running, is the link to it up, is the PC on the right VLAN, and is a relay configured if the server is on another network (Module 4)? In the network below, PC1 has an APIPA address. Look at it with ipconfig, try ipconfig /renew, and look at the diagram for the reason.",
        netDemo: {
          task:
            "PC1 is set to get its address by DHCP from the router R1. Run ipconfig on PC1: what address did it give itself? Run ipconfig /renew: does a DHCP server answer? Now look at the line between R1 and the switch.",
          devices: [
            { id: "R1", kind: "router", x: 50, y: 8, note: "DHCP server" },
            { id: "SW1", kind: "switch", x: 50, y: 24 },
            { id: "PC1", kind: "pc", x: 24, y: 40, dhcp: true },
            { id: "PC2", kind: "pc", x: 76, y: 40, dhcp: true },
          ],
          links: [["R1:g0/0", "SW1:g0/1"], ["PC1:fa0", "SW1:fa0/1"], ["PC2:fa0", "SW1:fa0/2"]],
          config: {
            R1: "hostname R1\ninterface g0/0\n ip address 192.168.20.1 255.255.255.0\n shutdown\nip dhcp excluded-address 192.168.20.1 192.168.20.9\nip dhcp pool LAB\n network 192.168.20.0 255.255.255.0\n default-router 192.168.20.1",
            SW1: "hostname SW1",
          },
          start: "PC1",
        },
        decision: dec(
          "In the network above, PC1 and PC2 both show 169.254.x.x addresses, ipconfig /renew reports that the DHCP request failed, and the link between the router R1 and the switch is drawn red.",
          "What is the most likely cause, and what should the engineer check first?",
          ["No DHCP server can be reached: the router's link to the switch is down, so check that link and the router interface before anything on the PCs", "169.254 means nobody answered DHCP, and the red link shows why: the server is cut off."],
          [
            ["The PCs have faulty network cards", "Both PCs reach the switch (their links are green) and both got APIPA addresses, which points at the shared server, not at two broken cards."],
            ["The PCs need static 169.254 addresses typed in", "169.254 addresses cannot reach a gateway; the fix is to restore DHCP, not to make the symptom permanent."],
            ["The switch must be replaced", "The switch is passing traffic between the PCs; the down link is the router's."],
          ],
          "Lesson 6 introduces the router's command line, where an engineer would confirm the interface is shut down and bring it back up."
        ),
      },
      {
        id: "a-nw-special-addresses",
        title: "Special-purpose IP addresses",
        explain:
          "Several IPv4 ranges are reserved and must never be given to an ordinary host. You have met private (RFC 1918), loopback (127/8) and APIPA (169.254/16). The rest: 0.0.0.0 means 'this host, no address yet' (a PC uses it as its source while asking DHCP for an address) and, in a routing table, 0.0.0.0/0 means 'every destination', the default route. 255.255.255.255 is the LIMITED BROADCAST: every host on the local network, never forwarded by routers. 224.0.0.0/4 (224 to 239) is MULTICAST: one sender, a group of interested receivers (OSPF routers talk on 224.0.0.5). 240.0.0.0/4 is reserved for future use. 100.64.0.0/10 is SHARED ADDRESS SPACE for carrier-grade NAT: many mobile and fixed providers give your router a 100.64–100.127 address, which means you are behind the provider's NAT and cannot host a server reachable from the internet. And 192.0.2.0/24, 198.51.100.0/24 and 203.0.113.0/24 are for DOCUMENTATION: books and examples use them so nobody's real network is printed by accident.",
        table: {
          caption: "Addresses with special jobs.",
          headers: ["Range", "Name", "What it means when you see it"],
          rows: [
            ["0.0.0.0", "Unspecified / default route", "No address yet (DHCP); as 0.0.0.0/0, every destination"],
            ["127.0.0.0/8", "Loopback", "Traffic to itself; 127.0.0.1 tests the stack"],
            ["169.254.0.0/16", "APIPA / link-local", "DHCP failed: no server answered"],
            ["10/8, 172.16/12, 192.168/16", "Private (RFC 1918)", "Inside an organisation, never routed on the internet"],
            ["100.64.0.0/10", "Shared (carrier-grade NAT)", "Your provider is NATing you; no inbound connections"],
            ["224.0.0.0/4", "Multicast", "Sent to a group (routing protocols, streaming)"],
            ["240.0.0.0/4", "Reserved", "Not used on networks"],
            ["255.255.255.255", "Limited broadcast", "Every host on the local network"],
            ["192.0.2.0/24 and two others", "Documentation", "Examples in books and manuals"],
          ],
        },
        decision: dec(
          "A small business wants customers to reach a web server in its office. The router's internet (WAN) interface shows the address 100.72.14.9.",
          "What does that address tell you?",
          ["The provider is using carrier-grade NAT, so the office has no public address of its own and inbound connections from the internet will not reach the server", "100.64.0.0/10 is shared address space for provider NAT. The business needs a public address (or a hosted server)."],
          [
            ["It is a normal public address and the server will work", "100.64–100.127 is reserved shared space, not a public address."],
            ["It is an APIPA address, so the router's DHCP failed", "APIPA is 169.254.0.0/16."],
            ["It is a multicast address", "Multicast is 224–239."],
          ]
        ),
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 5 · 3.15 – 3.19
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "nw-ip5-masks-cidr",
    moduleId: M,
    sectionId: SECTION_ID,
    order: 5,
    covers: ["3.15", "3.16", "3.17", "3.18", "3.19"],
    title: "Subnet Masks, Classes and CIDR",
    subtitle: "How a device finds the network part of an address",
    estimatedMinutes: 45,
    intro:
      "An address on its own does not say where the network part ends. The subnet mask does. Get the mask wrong and a device sends traffic to the wrong place; this lesson ends with a lab where exactly that has happened.",

    atoms: [
      {
        id: "a-nw-subnet-mask",
        title: "What is a subnet mask?",
        explain:
          "A SUBNET MASK is a 32-bit number that marks which bits of an address are the network portion. In binary a mask is always a run of 1s followed by a run of 0s: the 1s cover the network bits, the 0s cover the host bits. 255.255.255.0 is 11111111.11111111.11111111.00000000: 24 network bits, 8 host bits. To find an address's network, a device does a bitwise AND of the address and the mask: each bit of the result is 1 only where BOTH the address bit and the mask bit are 1. Where the mask has a 1, the address bit passes through; where it has a 0, the result is 0. So the host bits are wiped and the network address is left. Because the 1s must be continuous, a mask octet can only be one of 0, 128, 192, 224, 240, 248, 252, 254 or 255: the 'ones from the left' row. 255.255.255.250 is not a valid mask. Work through the AND below, one bit at a time: write the address octet above the mask octet in binary and keep a 1 only where both have a 1. Any octet where the mask is 255 stays the same, and any octet where the mask is 0 becomes 0, so only the octets in between need binary.",
        netCalc: {
          task: "Find network addresses with the AND method.",
          questions: [
            { q: "What is 77 in 8-bit binary?", answer: "01001101", check: { fn: "toBinary", arg: "77" }, hint: "77 = 64 + 8 + 4 + 1.", working: "64 + 8 + 4 + 1 = 77 → 01001101" },
            { q: "What is 77 AND 192, in decimal? (192 is 11000000.)", answer: "64", hint: "Keep a 1 only where both 01001101 and 11000000 have a 1.", working: "01001101\n11000000\n-------- AND\n01000000 = 64" },
            { q: "What is the network address of 192.168.10.77 with mask 255.255.255.192?", answer: "192.168.10.64", check: { fn: "network", arg: "192.168.10.77/26" }, hint: "The first three octets have mask 255, so they stay. The last octet is 77 AND 192.", working: "192.168.10 stay (mask 255)\n77 AND 192 = 64\n= 192.168.10.64" },
            { q: "What is the network address of 172.16.45.9 with mask 255.255.0.0?", answer: "172.16.0.0", check: { fn: "network", arg: "172.16.45.9/16" }, hint: "Octets under 255 stay; octets under 0 become 0.", working: "172.16 stay (255.255)\n45 and 9 become 0 (mask 0)\n= 172.16.0.0" },
          ],
          successMessage: "AND with the mask wipes the host bits. That one operation is how every device and router finds an address's network.",
        },
      },
      {
        id: "a-nw-classful",
        title: "Default masks and classful addressing (history)",
        explain:
          "Until 1993, IPv4 was CLASSFUL: the first octet of an address decided its class, and the class fixed the mask. CLASS A (first octet 1–126) used the default mask 255.0.0.0: 126 huge networks of 16,777,214 hosts each. CLASS B (128–191) used 255.255.0.0: 16,384 networks of 65,534 hosts. CLASS C (192–223) used 255.255.255.0: about two million networks of 254 hosts. CLASS D (224–239) is multicast and CLASS E (240–255) is reserved; neither has hosts or a default mask. (127 is missing from Class A because it is loopback.) The trouble was waste. An organisation with 2,000 hosts was too big for a Class C, so it got a Class B and left over 63,000 addresses unused, and whole Class A blocks went to single companies. Classes no longer control anything, but the 'default masks' (/8, /16, /24) remain the defaults some devices suggest, exam questions still say 'a Class C network', and the history explains why IPv4 ran out so fast.",
        table: {
          caption: "The classes, for history and for exam questions. Real networks use CIDR.",
          headers: ["Class", "First octet", "Default mask", "Networks", "Hosts per network"],
          rows: [
            ["A", "1 – 126", "255.0.0.0 (/8)", "126", "16,777,214"],
            ["B", "128 – 191", "255.255.0.0 (/16)", "16,384", "65,534"],
            ["C", "192 – 223", "255.255.255.0 (/24)", "2,097,152", "254"],
            ["D", "224 – 239", "none (multicast)", "–", "–"],
            ["E", "240 – 255", "none (reserved)", "–", "–"],
          ],
        },
        decision: dec(
          "In 1990 a university with 2,000 computers applied for addresses under the classful system.",
          "What did it receive, and what was the problem?",
          ["A Class B network of 65,534 host addresses, leaving over 63,000 unused, because a Class C (254 hosts) was too small", "Classful blocks came in three sizes only, so most organisations got far more than they needed."],
          [
            ["Eight Class C networks, which fitted perfectly", "Under classful rules each Class C was a separate network, and routing eight of them as one was not possible until CIDR."],
            ["A Class A network, which was the right size", "A Class A held nearly 17 million hosts, even more wasteful."],
            ["A Class D network, because universities do research", "Class D is multicast and has no hosts."],
          ]
        ),
      },
      {
        id: "a-nw-cidr",
        title: "CIDR and CIDR notation",
        explain:
          "CIDR (Classless Inter-Domain Routing, 1993) threw the classes away: the mask can end at ANY bit, so a block can be exactly the size an organisation needs, and providers can combine many networks into one route (Lesson 9). CIDR NOTATION writes the mask as a slash and the number of network bits, called the PREFIX LENGTH: 192.168.1.0/24 means mask 255.255.255.0 (24 ones). /26 is 26 ones: 11111111.11111111.11111111.11000000 = 255.255.255.192. /20 is 255.255.240.0: two full octets (16 bits), then 4 more ones in the third octet (11110000 = 240). To convert a prefix to a mask in your head: every 8 bits is a 255, and the leftover bits come from the 'ones from the left' row (1 → 128, 2 → 192, 3 → 224, 4 → 240, 5 → 248, 6 → 252, 7 → 254). Convert these by hand.",
        netCalc: {
          task: "Convert between prefix lengths and dotted-decimal masks.",
          questions: [
            { q: "Write /26 as a dotted-decimal mask.", answer: "255.255.255.192", check: { fn: "mask", arg: "26" }, hint: "24 bits fill three octets with 255; 2 more bits give the 'ones from the left' value for 2, which is 192.", working: "26 = 8 + 8 + 8 + 2\n255.255.255.(128+64) = 255.255.255.192" },
            { q: "Write /20 as a dotted-decimal mask.", answer: "255.255.240.0", check: { fn: "mask", arg: "20" }, hint: "16 bits fill two octets; 4 more bits give 240 in the third.", working: "20 = 8 + 8 + 4\n255.255.(128+64+32+16).0 = 255.255.240.0" },
            { q: "Write /30 as a dotted-decimal mask.", answer: "255.255.255.252", check: { fn: "mask", arg: "30" }, hint: "24 + 6: six ones in the last octet.", working: "11111100 = 252 → 255.255.255.252" },
            { q: "What prefix length is the mask 255.255.255.224?", answer: "/27", check: { fn: "prefix", arg: "255.255.255.224" }, hint: "Three octets of 255 are 24 ones; 224 is 11100000, three more.", working: "24 + 3 = 27 → /27" },
            { q: "What prefix length is the mask 255.255.248.0?", answer: "/21", check: { fn: "prefix", arg: "255.255.248.0" }, hint: "255.255 is 16 ones; 248 is 11111000, five more.", working: "16 + 5 = 21 → /21" },
          ],
          successMessage: "Prefix and mask are two spellings of the same thing. From now on you will see /26 and think 255.255.255.192.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 6 · 3.20 – 3.22
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "nw-ip6-ranges-gateway",
    moduleId: M,
    sectionId: SECTION_ID,
    order: 6,
    covers: ["3.20", "3.21", "3.22"],
    title: "Network, Broadcast, Usable Hosts and the Gateway",
    subtitle: "The four numbers every subnet has, and the door out of it",
    estimatedMinutes: 40,
    intro:
      "Every subnet has a first address, a last address and the usable range between them, and every host needs to know its way out. These are the numbers you will calculate most often in your career.",

    atoms: [
      {
        id: "a-nw-net-bcast",
        title: "Network address and broadcast address",
        explain:
          "Two addresses in every subnet are reserved and can never be given to a host. The NETWORK ADDRESS is the first one: all host bits 0. It names the subnet itself, and it is what appears in routing tables (192.168.10.64/26). The BROADCAST ADDRESS is the last one: all host bits 1. A packet sent to it is delivered to every host in that subnet (DHCP discovery and ARP-style announcements rely on broadcasts). To find them: network = address AND mask; broadcast = network with every host bit set to 1, which is the same as network + block size − 1, where the BLOCK SIZE is 2^(host bits). Worked example, 192.168.10.77/26: 6 host bits, block size 64. Networks start at multiples of 64 in the last octet (0, 64, 128, 192); 77 falls in the block starting at 64. Network 192.168.10.64, broadcast 192.168.10.64 + 63 = 192.168.10.127. Work these out by hand with the block-size method.",
        netCalc: {
          task: "Find the network and broadcast addresses: block size = 2^(host bits); the network is the multiple of the block size at or below the address; the broadcast is network + block size − 1.",
          questions: [
            { q: "What is the network address of 192.168.10.77/26?", answer: "192.168.10.64", check: { fn: "network", arg: "192.168.10.77/26" }, hint: "6 host bits, block size 64. Blocks start at 0, 64, 128, 192.", working: "Block 64: 0, 64, 128 … 77 is in the block starting at 64\nNetwork = 192.168.10.64" },
            { q: "What is the broadcast address of 192.168.10.77/26?", answer: "192.168.10.127", check: { fn: "broadcast", arg: "192.168.10.77/26" }, hint: "Network + 64 − 1.", working: "64 + 64 − 1 = 127 → 192.168.10.127" },
            { q: "What is the network address of 172.16.37.90/27?", answer: "172.16.37.64", check: { fn: "network", arg: "172.16.37.90/27" }, hint: "5 host bits, block size 32: 0, 32, 64, 96 …", working: "90 is in the block starting at 64 → 172.16.37.64" },
            { q: "What is the broadcast address of 192.168.1.130/25?", answer: "192.168.1.255", check: { fn: "broadcast", arg: "192.168.1.130/25" }, hint: "Block size 128: blocks start at 0 and 128.", working: "130 is in the block 128–255 → broadcast 192.168.1.255" },
            { q: "What is the network address of 172.20.18.5/20?", answer: "172.20.16.0", check: { fn: "network", arg: "172.20.18.5/20" }, hint: "The interesting octet is the third: /20 leaves 4 host bits there, block size 16.", working: "Third octet blocks: 0, 16, 32 … 18 is in 16\nNetwork = 172.20.16.0" },
          ],
          successMessage: "That is the exact calculation inside every router and every subnet calculator.",
        },
      },
      {
        id: "a-nw-usable-hosts",
        title: "Usable host addresses",
        explain:
          "The USABLE HOST RANGE is everything between the network and broadcast addresses: from network + 1 (the FIRST usable) to broadcast − 1 (the LAST usable). The number of usable hosts is 2^h − 2, where h is the number of host bits: 2^h addresses in total, minus the network and the broadcast. A /24 has 8 host bits: 256 addresses, 254 usable. A /26 has 6: 64 addresses, 62 usable. A /30 has 2: 4 addresses, 2 usable, exactly enough for a link between two routers. (A /31 is a special case allowed on point-to-point links, with two usable addresses and no network or broadcast, and a /32 is a single host, used for loopbacks.) By convention, the router's interface (the default gateway) usually takes the FIRST usable address, and some organisations use the last; just be consistent. Fill in the sizes below.",
        netCalc: {
          task: "Usable hosts = 2^(host bits) − 2, where host bits = 32 − prefix.",
          questions: [
            { q: "How many usable hosts does a /24 have?", answer: "254", check: { fn: "hosts", arg: "24" }, hint: "8 host bits.", working: "2^8 − 2 = 256 − 2 = 254" },
            { q: "How many usable hosts does a /27 have?", answer: "30", check: { fn: "hosts", arg: "27" }, hint: "5 host bits.", working: "2^5 − 2 = 32 − 2 = 30" },
            { q: "How many usable hosts does a /28 have?", answer: "14", check: { fn: "hosts", arg: "28" }, hint: "4 host bits.", working: "2^4 − 2 = 16 − 2 = 14" },
            { q: "How many usable hosts does a /30 have?", answer: "2", check: { fn: "hosts", arg: "30" }, hint: "2 host bits.", working: "2^2 − 2 = 4 − 2 = 2" },
            { q: "How many addresses in total (including network and broadcast) does a /26 have?", answer: "64", check: { fn: "addresses", arg: "26" }, hint: "6 host bits; do not subtract this time.", working: "2^6 = 64 addresses" },
          ],
          successMessage: "Learn this table cold. A /27 is 30 hosts, a /28 is 14, a /30 is 2: you will use these numbers every day.",
        },
      },
      {
        id: "a-nw-router-cli",
        title: "Meet the router's command line",
        explain:
          "A default gateway is an interface on a router, so to work with gateways you need to talk to routers. Cisco routers and switches are configured by typing commands into their command line, called IOS, and NetLab's routers speak it too. IOS has MODES, and the PROMPT tells you which one you are in. When you open R1's console you start in USER mode, prompt R1>, where you can only look at a little. Type enable to move to PRIVILEGED mode, prompt R1#, where you can see everything. In privileged mode, show ip interface brief prints one line per interface: its name, its IP address, and two status columns. 'up up' means working; 'administratively down' means someone switched the interface off. To change settings, type configure terminal to enter GLOBAL CONFIGURATION mode, prompt R1(config)#. Choose an interface with interface followed by its name, for example interface g0/0 (short for GigabitEthernet0/0); the prompt becomes R1(config-if)#. There, ip address followed by an address and a mask gives the interface its address: ip address 192.168.40.1 255.255.255.0. Router interfaces are switched off until you switch them on, which you do with no shutdown (in IOS, putting no in front of a command reverses it, and shutdown is the command that switches an interface off). Finally end returns you to R1#, where show ip interface brief confirms the change. Do exactly that in the lab below.",
        netLab: {
          task:
            "PC1's gateway is 192.168.40.1, but R1's interface facing the PCs (g0/0) has no address and is switched off, so PC1 cannot reach the server. On R1, type these one at a time and watch the prompt change: enable, show ip interface brief, configure terminal, interface g0/0, ip address 192.168.40.1 255.255.255.0, no shutdown, end, show ip interface brief. Then ping the server 172.16.0.10 from PC1.",
          devices: [
            { id: "PC1", kind: "pc", x: 12, y: 30, ip: "192.168.40.10/24", gateway: "192.168.40.1" },
            { id: "SW1", kind: "switch", x: 36, y: 30 },
            { id: "R1", kind: "router", x: 62, y: 30 },
            { id: "Server", kind: "server", x: 88, y: 30, ip: "172.16.0.10/24", gateway: "172.16.0.1" },
          ],
          links: [["PC1:fa0", "SW1:fa0/1"], ["R1:g0/0", "SW1:g0/1"], ["R1:g0/1", "Server:fa0"]],
          config: {
            SW1: "hostname SW1",
            R1: "hostname R1\ninterface g0/1\n ip address 172.16.0.1 255.255.255.0\n no shutdown",
          },
          start: "R1",
          height: 34,
          goals: [
            { type: "ip", device: "R1", iface: "g0/0", address: "192.168.40.1/24", label: "R1 g0/0 has the gateway address 192.168.40.1/24" },
            { type: "ping", from: "PC1", to: "172.16.0.10", label: "PC1 can reach the server through R1" },
          ],
          hint: "Type the commands exactly in the order given in the task. If the prompt says R1>, you still need enable; if it says R1(config)#, you still need interface g0/0.",
          successMessage:
            "User mode, privileged mode, global configuration, interface configuration, and back. Every router and switch lab in this course uses those same steps.",
        },
      },
      {
        id: "a-nw-default-gateway",
        title: "Default gateways",
        explain:
          "The DEFAULT GATEWAY is the address of the router interface on a host's own subnet. When a host decides a destination is NOT on its network (the mask comparison from Lesson 5), it sends the packet to the gateway, and the router takes it from there. Three rules. One: the gateway MUST be in the host's own subnet, or the host cannot reach it either; Windows refuses to use an off-subnet gateway. Two: it must be the router's ACTUAL address on that subnet, not a guess. Plenty of networks use .1, but many use .254 or something else, so check the router (show ip interface brief) or the documentation. Three: a host with no gateway can still talk to its own subnet, which makes the fault confusing: 'I can print but I cannot browse.' In the lab below, PC1 has exactly that problem. Use the router commands from the previous lab to find R1's real address.",
        netLab: {
          task:
            "PC1 (192.168.30.25/24) can reach PC2 beside it, but not the file server 172.16.0.10 across the router. Find the router's real address on PC1's subnet, then fix PC1's default gateway (keep its address and mask) and prove it can reach the server.",
          devices: [
            { id: "PC1", kind: "pc", x: 12, y: 18, ip: "192.168.30.25/24", gateway: "192.168.31.1" },
            { id: "PC2", kind: "pc", x: 12, y: 42, ip: "192.168.30.26/24", gateway: "192.168.30.254" },
            { id: "SW1", kind: "switch", x: 36, y: 30 },
            { id: "R1", kind: "router", x: 60, y: 30 },
            { id: "Server", kind: "server", x: 88, y: 30, ip: "172.16.0.10/24", gateway: "172.16.0.1", note: "file server" },
          ],
          links: [["PC1:fa0", "SW1:fa0/1"], ["PC2:fa0", "SW1:fa0/2"], ["R1:g0/0", "SW1:g0/1"], ["R1:g0/1", "Server:fa0"]],
          config: {
            SW1: "hostname SW1",
            R1: "hostname R1\ninterface g0/0\n ip address 192.168.30.254 255.255.255.0\n no shutdown\ninterface g0/1\n ip address 172.16.0.1 255.255.255.0\n no shutdown",
          },
          start: "PC1",
          goals: [
            { type: "ping", from: "PC1", to: "192.168.30.26", label: "PC1 still reaches PC2 on its own subnet" },
            { type: "ping", from: "PC1", to: "172.16.0.10", label: "PC1 reaches the file server through the router" },
          ],
          hint: "PC1's gateway, 192.168.31.1, is not even in 192.168.30.0/24. On R1: enable, then show ip interface brief shows g0/0 is 192.168.30.254. On PC1: ipconfig 192.168.30.25 255.255.255.0 192.168.30.254, then ping 172.16.0.10.",
          successMessage:
            "Local traffic never needed the gateway, which is why PC2 always worked. Everything off the subnet goes through the router's real address on that subnet, and now PC1 knows it.",
        },
      },
      {
        id: "a-nw-wrong-mask",
        title: "When the mask is wrong",
        explain:
          "A device uses its mask to make one decision before every packet it sends: IS THE DESTINATION ON MY NETWORK? It ANDs its own address with its mask, ANDs the destination with the same mask, and compares. If the results match, it delivers directly (it ARPs for the destination's MAC address). If not, it sends the packet to its default gateway. A wrong mask breaks that decision. Too LARGE a network (a mask that is too short, like /8 instead of /24) makes a device think distant hosts are local, so it ARPs for them on its own wire and gets no answer. Too SMALL a network makes it send local traffic to the router. In the lab below, PC1 can reach PC2 beside it but not the server across the router. PC2 works perfectly. Compare their settings with ipconfig on each.",
        netLab: {
          task:
            "PC1 and PC2 are both in 10.1.1.0/24 behind router R1. The server is 10.2.2.20 in 10.2.2.0/24 on R1's other side. PC2 can reach the server; PC1 cannot. Run ipconfig on both PCs, find PC1's mistake and fix it, keeping its address 10.1.1.10 and gateway 10.1.1.1.",
          devices: [
            { id: "PC1", kind: "pc", x: 12, y: 18, ip: "10.1.1.10/8", gateway: "10.1.1.1" },
            { id: "PC2", kind: "pc", x: 12, y: 42, ip: "10.1.1.11/24", gateway: "10.1.1.1" },
            { id: "SW1", kind: "switch", x: 36, y: 30 },
            { id: "R1", kind: "router", x: 60, y: 30 },
            { id: "Server", kind: "server", x: 88, y: 30, ip: "10.2.2.20/24", gateway: "10.2.2.1" },
          ],
          links: [["PC1:fa0", "SW1:fa0/1"], ["PC2:fa0", "SW1:fa0/2"], ["R1:g0/0", "SW1:g0/1"], ["R1:g0/1", "Server:fa0"]],
          config: {
            SW1: "hostname SW1",
            R1: "hostname R1\ninterface g0/0\n ip address 10.1.1.1 255.255.255.0\n no shutdown\ninterface g0/1\n ip address 10.2.2.1 255.255.255.0\n no shutdown",
          },
          start: "PC1",
          goals: [
            { type: "ip", device: "PC1", iface: "fa0", address: "10.1.1.10/24", label: "PC1 has the correct mask for 10.1.1.0/24" },
            { type: "ping", from: "PC1", to: "10.2.2.20", label: "PC1 can reach the server at 10.2.2.20" },
          ],
          hint: "PC1's mask is 255.0.0.0 (/8), so it thinks 10.2.2.20 is on its own network and never uses the gateway. Set it properly: ipconfig 10.1.1.10 255.255.255.0 10.1.1.1, then ping 10.2.2.20.",
          successMessage:
            "With /8, PC1 decided 10.2.2.20 was local and shouted for it on its own wire. With /24, it knows the server is elsewhere and hands the packet to its gateway. Same address, same gateway: only the mask changed.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 7 · 3.23 – 3.28
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "nw-ip7-subnetting",
    moduleId: M,
    sectionId: SECTION_ID,
    order: 7,
    covers: ["3.23", "3.24", "3.25", "3.26", "3.27", "3.28"],
    title: "Subnetting Class A, B and C Networks",
    subtitle: "Borrowing host bits to make more, smaller networks",
    estimatedMinutes: 60,
    intro:
      "Subnetting means taking one network and dividing it into several smaller ones. Every method in this lesson comes down to one move: borrow bits from the host part and give them to the network part. Do it on a Class C, then a Class B, then a Class A, and finally build one on a router.",

    atoms: [
      {
        id: "a-nw-why-subnet",
        title: "Introduction to subnetting, and why we segment",
        explain:
          "SUBNETTING divides one network into several smaller SUBNETS, each with its own network address, broadcast address and range of hosts, joined to each other by a router. Why not keep one big flat network? Because of five things. BROADCASTS: every broadcast reaches every host in a subnet, so 2,000 hosts in one subnet means every PC processes every other PC's ARP and DHCP chatter. Smaller subnets mean smaller BROADCAST DOMAINS. SECURITY: traffic between subnets passes through a router or firewall, where it can be filtered, so Finance can be kept away from the guest Wi-Fi. ORGANISATION: a subnet per department, floor or building makes the network readable and troubleshooting faster ('it is a 10.1.30.x address, so it is on the third floor'). PERFORMANCE: problems such as a broadcast storm or a misbehaving device stay inside one subnet. ADDRESS EFFICIENCY: each part gets the size it needs. Segmenting by subnet (and by VLAN, Module 5) is standard practice in every professional network.",
        decision: dec(
          "A hospital runs all 1,800 devices (staff PCs, patient-monitoring equipment, guest Wi-Fi phones and CCTV cameras) in a single 10.0.0.0/21 subnet. A virus on a guest phone floods the network, and patient monitors start dropping off.",
          "What would subnetting have changed?",
          ["Each group would be in its own subnet, so the flood would stay in the guest subnet, and the router or firewall between subnets could block guests from reaching medical equipment", "Smaller broadcast domains contain problems, and boundaries between subnets are where security policy is enforced."],
          [
            ["Nothing: subnetting only saves addresses", "Saving addresses is the least of it. Containment and security are the main reasons to segment."],
            ["The guest phones would get faster Wi-Fi", "Subnetting is about segmentation, not radio speed."],
            ["Subnetting would let the hospital use public addresses internally", "Subnets are built just as well from private ranges."],
          ]
        ),
      },
      {
        id: "a-nw-bits-borrowed",
        title: "Calculating network bits and host bits",
        explain:
          "Every subnetting problem is answered with two formulas. Borrowing b bits from the host part gives 2^b SUBNETS. Leaving h host bits gives 2^h − 2 USABLE HOSTS per subnet. Since the address is 32 bits, the new prefix is the old prefix + b, and h = 32 − new prefix. The method when a question asks for a NUMBER OF SUBNETS: find the smallest b with 2^b ≥ the subnets needed. Example: divide 192.168.1.0/24 into 5 subnets. 2^2 = 4 is too few, 2^3 = 8 is enough, so borrow 3 bits: /24 + 3 = /27, mask 255.255.255.224, 8 subnets of 32 − 2 = 30 hosts. When the question asks for a NUMBER OF HOSTS instead, find the smallest h with 2^h − 2 ≥ the hosts needed, and the prefix is 32 − h. Example: 50 hosts per subnet: 2^5 − 2 = 30 is too few, 2^6 − 2 = 62 is enough, so h = 6 and the prefix is /26. Practise both methods below.",
        netCalc: {
          task: "Borrow bits to make subnets, or size a subnet for its hosts.",
          questions: [
            { q: "192.168.1.0/24 must be divided into 5 equal subnets, borrowing as few bits as possible. What is the new prefix?", answer: "/27", check: { fn: "prefixForSubnets", arg: "192.168.1.0/24 5" }, hint: "2^2 = 4 is too few; 2^3 = 8 is enough. 24 + 3.", working: "2^3 = 8 ≥ 5 → borrow 3 bits\n/24 + 3 = /27" },
            { q: "How many usable hosts does each of those /27 subnets have?", answer: "30", check: { fn: "hosts", arg: "27" }, hint: "32 − 27 = 5 host bits.", working: "2^5 − 2 = 30" },
            { q: "172.16.0.0/16 must be divided into 10 equal subnets. What is the new prefix?", answer: "/20", check: { fn: "prefixForSubnets", arg: "172.16.0.0/16 10" }, hint: "2^3 = 8 is too few; 2^4 = 16 is enough.", working: "2^4 = 16 ≥ 10 → borrow 4\n/16 + 4 = /20" },
            { q: "A subnet must hold 50 hosts. What is the longest prefix (the smallest subnet) that fits?", answer: "/26", check: { fn: "prefixForHosts", arg: "50" }, hint: "2^5 − 2 = 30 is too few; 2^6 − 2 = 62 is enough, so 6 host bits.", working: "h = 6 → 32 − 6 = /26 (62 hosts)" },
          ],
          successMessage: "2^b subnets, 2^h − 2 hosts. Every subnetting question in every exam is those two formulas in a different costume.",
        },
      },
      {
        id: "a-nw-class-c",
        title: "Subnetting a Class C network",
        explain:
          "Take 192.168.1.0/24, a 'Class C sized' network, and divide it into 4 subnets for four labs. 4 = 2^2, so borrow 2 bits: /26, mask 255.255.255.192, 6 host bits, block size 64. The subnets start every 64 in the last octet. Subnet 1: 192.168.1.0/26 (hosts .1–.62, broadcast .63). Subnet 2: 192.168.1.64/26 (hosts .65–.126, broadcast .127). Subnet 3: 192.168.1.128/26 (hosts .129–.190, broadcast .191). Subnet 4: 192.168.1.192/26 (hosts .193–.254, broadcast .255). The BLOCK SIZE trick makes this fast: block size = 256 − the interesting mask octet (256 − 192 = 64), and subnets start at multiples of it. In the lab below, Lab A already uses subnet 1. You are bringing Lab B online in subnet 2, with the router taking the first usable address.",
        netLab: {
          task:
            "192.168.1.0/24 has been divided into four /26 subnets. Lab A (PC-A) uses the first subnet, with R1 g0/0 as its gateway at 192.168.1.1. Bring Lab B online in the SECOND subnet: give R1 g0/1 the first usable address of that subnet, give PC-B the address 192.168.1.70 with the right mask and gateway, and prove the two labs can reach each other.",
          devices: [
            { id: "PC-A", kind: "pc", x: 14, y: 30, ip: "192.168.1.10/26", gateway: "192.168.1.1", note: "Lab A" },
            { id: "R1", kind: "router", x: 50, y: 30 },
            { id: "PC-B", kind: "pc", x: 86, y: 30, note: "Lab B" },
          ],
          links: [["PC-A:fa0", "R1:g0/0"], ["PC-B:fa0", "R1:g0/1"]],
          config: {
            R1: "hostname R1\ninterface g0/0\n ip address 192.168.1.1 255.255.255.192\n no shutdown",
          },
          start: "R1",
          height: 34,
          goals: [
            { type: "ip", device: "R1", iface: "g0/1", address: "192.168.1.65/26", label: "R1 g0/1 has the first usable address of the second /26" },
            { type: "ip", device: "PC-B", iface: "fa0", address: "192.168.1.70/26", label: "PC-B is 192.168.1.70 with the /26 mask" },
            { type: "ping", from: "PC-A", to: "192.168.1.70", label: "Lab A can reach Lab B" },
          ],
          hint: "Block size 64, so subnet 2 is 192.168.1.64/26 and its first usable address is .65. On R1: enable, configure terminal, interface g0/1, ip address 192.168.1.65 255.255.255.192, no shutdown, end. On PC-B: ipconfig 192.168.1.70 255.255.255.192 192.168.1.65.",
          successMessage:
            "Two subnets carved from one /24, a router interface in each, and traffic flowing between them. That is subnetting doing its job on a real network.",
        },
      },
      {
        id: "a-nw-class-b",
        title: "Subnetting a Class B network",
        explain:
          "A Class B sized network such as 172.16.0.0/16 has 16 host bits, so the borrowing happens in the third octet, and the fourth octet is entirely host bits. Divide 172.16.0.0/16 into 16 subnets: 16 = 2^4, borrow 4 bits, /20, mask 255.255.240.0. The interesting octet is now the THIRD: block size 256 − 240 = 16, so the subnets are 172.16.0.0, 172.16.16.0, 172.16.32.0, … 172.16.240.0. Each /20 has 12 host bits: 4,096 addresses, 4,094 usable. The first subnet's hosts run from 172.16.0.1 to 172.16.15.254, and its broadcast is 172.16.15.255: the range crosses octet boundaries, which is the part beginners find surprising. Work out the plan below.",
        netCalc: {
          task: "172.16.0.0/16 is divided into /20 subnets.",
          questions: [
            { q: "How many /20 subnets fit in 172.16.0.0/16?", answer: "16", hint: "Borrowed bits: 20 − 16 = 4.", working: "2^4 = 16 subnets" },
            { q: "What is the second subnet? (Write it with its /20.)", answer: "172.16.16.0/20", accept: ["172.16.16.0"], check: { fn: "nthSubnet", arg: "172.16.0.0/16 20 2" }, hint: "Block size 16 in the third octet: 0, 16, 32 …", working: "Subnets: 172.16.0.0, 172.16.16.0, 172.16.32.0 …\nSecond = 172.16.16.0/20" },
            { q: "What is the broadcast address of the first subnet, 172.16.0.0/20?", answer: "172.16.15.255", check: { fn: "broadcast", arg: "172.16.0.0/20" }, hint: "The next subnet starts at 172.16.16.0; the broadcast is the address just before it.", working: "172.16.16.0 − 1 = 172.16.15.255" },
            { q: "How many usable hosts does each /20 hold?", answer: "4094", check: { fn: "hosts", arg: "20" }, hint: "12 host bits.", working: "2^12 − 2 = 4096 − 2 = 4,094" },
          ],
          successMessage: "Same method, one octet further left. The block size tells you where every subnet starts.",
        },
      },
      {
        id: "a-nw-class-a",
        title: "Subnetting a Class A network",
        explain:
          "A Class A sized network such as 10.0.0.0/8 has 24 host bits, room for enormous plans. Large organisations use 10.0.0.0/8 internally precisely because there is so much space. Suppose a bank needs 300 branch subnets. 2^8 = 256 is too few, 2^9 = 512 is enough, so borrow 9 bits: /17, mask 255.255.128.0. Nine bits cross an octet boundary: 8 bits fill the second octet, and 1 more bit is the top bit of the third octet (128). The subnets go 10.0.0.0/17, 10.0.128.0/17, 10.1.0.0/17, 10.1.128.0/17 and so on, each with 15 host bits: 32,766 usable hosts, far more than a branch needs. In practice a designer would usually choose a much longer prefix such as /24 per branch (65,536 of them fit in 10.0.0.0/8), keeping the address readable: branch 47 gets 10.0.47.0/24. Both are correct answers to different questions: the fewest bits borrowed, or the size each subnet actually needs.",
        decision: dec(
          "A bank is dividing 10.0.0.0/8 into at least 300 equal subnets, one per branch, and wants to borrow the FEWEST bits possible.",
          "What prefix does each subnet get, and how many usable hosts does it hold?",
          ["/17, with 32,766 usable hosts each, because 9 borrowed bits give 512 subnets and 15 host bits remain", "2^8 = 256 is too few for 300, so 9 bits: /8 + 9 = /17, and 2^15 − 2 = 32,766 hosts."],
          [
            ["/16, with 65,534 usable hosts each", "Borrowing 8 bits gives only 256 subnets, short of 300."],
            ["/18, with 16,382 usable hosts each", "That works, but borrows 10 bits when 9 are enough."],
            ["/25, with 126 usable hosts each", "That borrows 17 bits, far more than needed for 300 subnets."],
          ]
        ),
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 8 · 3.29 – 3.32
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "nw-ip8-flsm-vlsm",
    moduleId: M,
    sectionId: SECTION_ID,
    order: 8,
    covers: ["3.29", "3.30", "3.31", "3.32"],
    title: "FLSM, VLSM and Subnet Ranges",
    subtitle: "Equal subnets, right-sized subnets, and the ranges inside each",
    estimatedMinutes: 60,
    intro:
      "So far every subnet has been the same size. Real departments are not. This lesson compares fixed-length and variable-length subnetting, then has you build a VLSM design on routers and work out every subnet's range by hand.",

    atoms: [
      {
        id: "a-nw-flsm",
        title: "Fixed Length Subnet Masking (FLSM)",
        explain:
          "FIXED LENGTH SUBNET MASKING gives every subnet the SAME mask, as in Lesson 7. It is simple to plan, simple to document and simple to troubleshoot: every subnet looks alike. Its weakness is WASTE: the mask must fit the LARGEST subnet, so small ones carry far more addresses than they need. Picture an office with a 100-user sales floor, a 50-user IT team and a 2-address link between routers. With FLSM all three must be big enough for sales: /25 each (126 hosts), which needs three /25s, more than a /24 holds, and the router link wastes 124 addresses. FLSM is fine when subnets really are similar in size, such as identical classrooms or identical branch offices. Work out the four equal subnets of 192.168.1.0/24 below.",
        netCalc: {
          task: "192.168.1.0/24 is divided into four equal /26 subnets with FLSM.",
          questions: [
            { q: "What is the third subnet? (Write it with its /26.)", answer: "192.168.1.128/26", accept: ["192.168.1.128"], check: { fn: "nthSubnet", arg: "192.168.1.0/24 26 3" }, hint: "Block size 64: the subnets start at .0, .64, .128 and .192.", working: "1st .0, 2nd .64, 3rd .128 → 192.168.1.128/26" },
            { q: "What is the first usable address of the third subnet?", answer: "192.168.1.129", check: { fn: "firstHost", arg: "192.168.1.128/26" }, hint: "Network + 1.", working: "128 + 1 = 129" },
            { q: "What is the last usable address of the third subnet?", answer: "192.168.1.190", check: { fn: "lastHost", arg: "192.168.1.128/26" }, hint: "Broadcast − 1. The broadcast is 128 + 64 − 1 = 191.", working: "191 − 1 = 190" },
            { q: "What is the broadcast address of the fourth subnet?", answer: "192.168.1.255", check: { fn: "broadcast", arg: "192.168.1.192/26" }, hint: "The fourth subnet starts at .192 and ends where the /24 ends.", working: "192 + 64 − 1 = 255" },
          ],
          successMessage: "Four identical subnets, each with 62 hosts. Neat, but only efficient when every part of the network needs about 62.",
        },
      },
      {
        id: "a-nw-vlsm",
        title: "Variable Length Subnet Masking (VLSM)",
        explain:
          "VARIABLE LENGTH SUBNET MASKING gives each subnet its OWN mask, sized to what it needs: it is subnetting a subnet. The method, which you must follow in order: 1. List the subnets and their host counts. 2. Sort them LARGEST FIRST. 3. For each, find the smallest block that fits (2^h − 2 ≥ hosts). 4. Allocate from the start of the range, each subnet starting right after the previous one ends. Largest first matters because it keeps every block on its natural boundary (a /26 must start on a multiple of 64). Example, 192.168.50.0/24 for Sales (100 hosts), IT (50 hosts) and a router-to-router link (2 hosts). Sales needs 7 host bits (126): 192.168.50.0/25, hosts .1–.126. IT needs 6 host bits (62): next free is .128, so 192.168.50.128/26, hosts .129–.190. The link needs 2 host bits (2): next free is .192, so 192.168.50.192/30, hosts .193–.194. Used: .0 to .195. Free for later: .196 to .255. In the lab, the PCs and R2 are already configured to that plan. R1 is blank: configure its three interfaces.",
        netLab: {
          task:
            "Build the VLSM plan for 192.168.50.0/24 on R1. Sales (100 hosts) is 192.168.50.0/25 on g0/0, IT (50 hosts) is 192.168.50.128/26 on g0/1, and the link to R2 is 192.168.50.192/30 on g0/2. Give each R1 interface the FIRST usable address of its subnet with the correct mask, and bring it up. R1 already has a default route to R2, which leads to the server at 10.0.0.10.",
          devices: [
            { id: "Sales-PC", kind: "pc", x: 10, y: 14, ip: "192.168.50.10/25", gateway: "192.168.50.1", note: "Sales /25" },
            { id: "IT-PC", kind: "pc", x: 10, y: 44, ip: "192.168.50.140/26", gateway: "192.168.50.129", note: "IT /26" },
            { id: "R1", kind: "router", x: 38, y: 29 },
            { id: "R2", kind: "router", x: 66, y: 29, note: ".194 /30" },
            { id: "Server", kind: "server", x: 92, y: 29, ip: "10.0.0.10/24", gateway: "10.0.0.1" },
          ],
          links: [["Sales-PC:fa0", "R1:g0/0"], ["IT-PC:fa0", "R1:g0/1"], ["R1:g0/2", "R2:g0/0"], ["R2:g0/1", "Server:fa0"]],
          config: {
            R1: "hostname R1\nip route 0.0.0.0 0.0.0.0 192.168.50.194",
            R2: "hostname R2\ninterface g0/0\n ip address 192.168.50.194 255.255.255.252\n no shutdown\ninterface g0/1\n ip address 10.0.0.1 255.255.255.0\n no shutdown\nip route 192.168.50.0 255.255.255.0 192.168.50.193",
          },
          start: "R1",
          height: 50,
          goals: [
            { type: "ip", device: "R1", iface: "g0/0", address: "192.168.50.1/25", label: "R1 g0/0 is the Sales gateway, 192.168.50.1/25" },
            { type: "ip", device: "R1", iface: "g0/1", address: "192.168.50.129/26", label: "R1 g0/1 is the IT gateway, 192.168.50.129/26" },
            { type: "ip", device: "R1", iface: "g0/2", address: "192.168.50.193/30", label: "R1 g0/2 is 192.168.50.193/30 on the link to R2" },
            { type: "ping", from: "Sales-PC", to: "192.168.50.140", label: "Sales can reach IT" },
            { type: "ping", from: "IT-PC", to: "10.0.0.10", label: "IT can reach the server beyond R2" },
          ],
          hint: "Masks: /25 = 255.255.255.128, /26 = 255.255.255.192, /30 = 255.255.255.252. On R1: enable, configure terminal, then for each interface: interface g0/0, ip address 192.168.50.1 255.255.255.128, no shutdown (and the same for g0/1 with .129 and g0/2 with .193). Finish with end and show ip interface brief.",
          successMessage:
            "Three subnets, three different masks, one /24, and a quarter of it still free for growth. With FLSM the same three would not even have fitted.",
        },
      },
      {
        id: "a-nw-subnet-ranges",
        title: "Calculating subnet ranges and available hosts",
        explain:
          "For any address and prefix you can now give the five facts that describe its subnet: the NETWORK address, the FIRST usable, the LAST usable, the BROADCAST address, and the number of USABLE HOSTS. The fast method by hand: find the interesting octet (where the mask is neither 255 nor 0), work out the block size (256 − mask octet), find the multiple of the block size at or below the address's value in that octet (that is the network), add block size − 1 for the broadcast, then +1 and −1 for the usable range. Example, 172.16.37.90/27: the mask is 255.255.255.224, block size 32, multiples 0, 32, 64, 96; 90 falls in 64. Network 172.16.37.64, first .65, last .94, broadcast .95, 30 hosts. Work out all five facts for the address below.",
        netCalc: {
          task: "Describe the subnet that 172.16.37.90/27 belongs to.",
          questions: [
            { q: "Network address?", answer: "172.16.37.64", check: { fn: "network", arg: "172.16.37.90/27" }, hint: "Block size 32: 0, 32, 64, 96 …", working: "90 is in the block starting at 64" },
            { q: "First usable address?", answer: "172.16.37.65", check: { fn: "firstHost", arg: "172.16.37.90/27" }, hint: "Network + 1.", working: "64 + 1 = 65" },
            { q: "Last usable address?", answer: "172.16.37.94", check: { fn: "lastHost", arg: "172.16.37.90/27" }, hint: "Broadcast − 1.", working: "95 − 1 = 94" },
            { q: "Broadcast address?", answer: "172.16.37.95", check: { fn: "broadcast", arg: "172.16.37.90/27" }, hint: "Network + block size − 1.", working: "64 + 32 − 1 = 95" },
            { q: "Number of usable hosts?", answer: "30", check: { fn: "hosts", arg: "27" }, hint: "2^5 − 2.", working: "32 − 2 = 30" },
          ],
          successMessage: "Five facts per subnet, worked out and checked. Your addressing plans can now be verified line by line before they reach a router.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 9 · 3.33 – 3.35, 3.P
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "nw-ip9-summary-ipv6",
    moduleId: M,
    sectionId: SECTION_ID,
    order: 9,
    covers: ["3.33", "3.34", "3.35", "3.P"],
    title: "Summarisation, IPv6 Subnetting and the Addressing Plan",
    subtitle: "Fewer routes, shorter IPv6 addresses, and a plan for a real office",
    estimatedMinutes: 70,
    intro:
      "Subnetting splits networks; summarisation joins them back together for routing. Then IPv6: how to write it short, which addresses do what, and why its subnetting is easier than IPv4's. The module ends with a full addressing plan for an office.",

    atoms: [
      {
        id: "a-nw-summarisation",
        title: "Supernetting and route summarisation",
        explain:
          "SUMMARISATION (also called SUPERNETTING or route aggregation) is subnetting in reverse: several contiguous networks are advertised as ONE shorter prefix. A branch with 10.1.0.0/24, 10.1.1.0/24, 10.1.2.0/24 and 10.1.3.0/24 can be reached with the single route 10.1.0.0/22. To find a summary, write the networks in binary and keep the bits they ALL share. The third octets 0, 1, 2 and 3 are 000000|00, 000000|01, 000000|10 and 000000|11: the first 6 bits match, so 16 + 6 = 22 bits are common, and the summary is 10.1.0.0/22 (mask 255.255.252.0). The quick check: the block must be a power of two in size (4 networks) and start on a multiple of that size (0 is a multiple of 4). Summaries make routing tables smaller and routers faster, hide changes inside a branch from the rest of the network, and are how the internet stays routable at all: your provider advertises one summary for all its customers. In the lab, R1 is the branch router, with its four LANs drawn as loopback interfaces. Head office router R2 has no route to them, so you will give it one by hand. A STATIC ROUTE tells a router where a network is (Module 5 covers routing in full). In global configuration mode, type ip route followed by the destination network, its mask and the NEXT HOP, which is the address of the neighbouring router to hand the traffic to: ip route 10.1.0.0 255.255.252.0 172.16.0.1. Back in privileged mode (end), show ip route lists every route the router knows; your route appears with the code S, for static.",
        netLab: {
          task:
            "The branch router R1 has four LANs: 10.1.0.0/24, 10.1.1.0/24, 10.1.2.0/24 and 10.1.3.0/24 (shown as loopback interfaces). Head office router R2 cannot reach any of them. Add ONE static route on R2 that summarises all four, pointing at R1 (172.16.0.1), so HQ-PC can reach the branch. Do not add four separate routes.",
          devices: [
            { id: "HQ-PC", kind: "pc", x: 10, y: 30, ip: "192.168.100.10/24", gateway: "192.168.100.1" },
            { id: "R2", kind: "router", x: 40, y: 30, note: "head office" },
            { id: "R1", kind: "router", x: 74, y: 30, note: "branch: 10.1.0–3.0/24" },
          ],
          links: [["HQ-PC:fa0", "R2:g0/1"], ["R2:g0/0", "R1:g0/0"]],
          config: {
            R1: "hostname R1\ninterface g0/0\n ip address 172.16.0.1 255.255.255.252\n no shutdown\ninterface loopback0\n ip address 10.1.0.1 255.255.255.0\ninterface loopback1\n ip address 10.1.1.1 255.255.255.0\ninterface loopback2\n ip address 10.1.2.1 255.255.255.0\ninterface loopback3\n ip address 10.1.3.1 255.255.255.0\nip route 0.0.0.0 0.0.0.0 172.16.0.2",
            R2: "hostname R2\ninterface g0/0\n ip address 172.16.0.2 255.255.255.252\n no shutdown\ninterface g0/1\n ip address 192.168.100.1 255.255.255.0\n no shutdown",
          },
          start: "R2",
          height: 34,
          goals: [
            { type: "route", device: "R2", prefix: "10.1.0.0/22", label: "R2 has one summary route, 10.1.0.0/22" },
            { type: "route", device: "R2", prefix: "10.1.2.0/24", expect: false, label: "R2 has no separate /24 routes for the branch" },
            { type: "ping", from: "HQ-PC", to: "10.1.0.1", label: "HQ-PC can reach the branch's first LAN" },
            { type: "ping", from: "HQ-PC", to: "10.1.3.1", label: "HQ-PC can reach the branch's fourth LAN" },
          ],
          hint: "Four networks with third octets 0–3 share 22 bits: 10.1.0.0/22, mask 255.255.252.0. On R2: enable, configure terminal, ip route 10.1.0.0 255.255.252.0 172.16.0.1, end. Check with show ip route.",
          successMessage:
            "One line in R2's routing table instead of four, and if the branch rearranges its networks inside the /22, head office never needs to know. Scale that up and you have the internet's routing table.",
        },
      },
      {
        id: "a-nw-ipv6-notation",
        title: "IPv6 address notation and shortening",
        explain:
          "A full IPv6 address is eight groups of four hex digits: 2001:0db8:0000:0000:0000:ff00:0042:8329. Two rules shorten it, and RFC 5952 fixes exactly how, so everyone writes the same address the same way. RULE 1: drop LEADING zeros in each group: 0db8 → db8, 0042 → 42, 0000 → 0. RULE 2: replace ONE run of two or more consecutive all-zero groups with a double colon (::). Use it on the LONGEST run; if two runs are equally long, use the first; never use it for a single zero group, and never use it twice (the reader works out how many groups :: hides by counting the rest, which only works if there is one). Letters are written in lowercase. So the example becomes 2001:db8::ff00:42:8329. The loopback address 0000:0000:0000:0000:0000:0000:0000:0001 becomes ::1, and the all-zero address becomes ::. Shorten these by hand.",
        netCalc: {
          task: "Write each address in its shortest standard form: drop leading zeros in each group, lowercase letters, and replace the longest run of two or more all-zero groups with ::.",
          questions: [
            { q: "Shorten 2001:0db8:0000:0000:0000:ff00:0042:8329", answer: "2001:db8::ff00:42:8329", check: { fn: "ipv6Short", arg: "2001:0db8:0000:0000:0000:ff00:0042:8329" }, hint: "0db8 → db8, 0042 → 42, and the three zero groups become ::.", working: "2001:db8:0:0:0:ff00:42:8329\n→ 2001:db8::ff00:42:8329" },
            { q: "Shorten 0000:0000:0000:0000:0000:0000:0000:0001", answer: "::1", check: { fn: "ipv6Short", arg: "0000:0000:0000:0000:0000:0000:0000:0001" }, hint: "Seven zero groups and a 1.", working: "0:0:0:0:0:0:0:1 → ::1" },
            { q: "Shorten 2001:0db8:0000:0001:0000:0000:0000:0001", answer: "2001:db8:0:1::1", check: { fn: "ipv6Short", arg: "2001:0db8:0000:0001:0000:0000:0000:0001" }, hint: "There are two zero runs: one group long and three groups long. Compress the longer.", working: "2001:db8:0:1:0:0:0:1\n→ 2001:db8:0:1::1" },
            { q: "Shorten 2001:0db8:0001:0000:0002:0003:0004:0005", answer: "2001:db8:1:0:2:3:4:5", check: { fn: "ipv6Short", arg: "2001:0db8:0001:0000:0002:0003:0004:0005" }, hint: "A single zero group is never replaced by ::.", working: "Only one zero group → it stays as 0\n→ 2001:db8:1:0:2:3:4:5" },
          ],
          successMessage: "RFC 5952 by hand. Every router, operating system and log file writes IPv6 addresses exactly this way.",
        },
      },
      {
        id: "a-nw-ipv6-types",
        title: "IPv6 address types and subnetting fundamentals",
        explain:
          "IPv6 has three kinds of address, and NO broadcast. UNICAST goes to one interface: GLOBAL UNICAST addresses (2000::/3, today mostly 2xxx: and 3xxx:) are public and routable, like public IPv4; LINK-LOCAL addresses (fe80::/10) are created automatically on EVERY IPv6 interface and only work on the local link (routers use them as next hops); UNIQUE LOCAL addresses (fc00::/7, in practice fd00::/8) are the private range; ::1 is loopback. MULTICAST (ff00::/8) goes to a group, and replaces broadcast (ff02::1 is all nodes on the link). ANYCAST is one address shared by several servers, delivered to the nearest one. SUBNETTING is simpler than IPv4 because there is so much space: a provider usually gives a site a /48 (or a /56 for homes), every LAN subnet is a /64, and the bits between are the SUBNET ID. A /48 leaves 64 − 48 = 16 bits of subnet ID, which is 65,536 subnets, each with 2^64 interface addresses. Nobody counts usable hosts in IPv6, and subnets are numbered in hex: 2001:db8:acad:1::/64, 2001:db8:acad:2::/64, and so on.",
        table: {
          caption: "IPv6 address types to recognise on sight.",
          headers: ["Prefix", "Type", "Like in IPv4"],
          rows: [
            ["2000::/3", "Global unicast", "Public addresses"],
            ["fe80::/10", "Link-local (automatic on every interface)", "APIPA, but always present and used by routing"],
            ["fc00::/7 (fd00::/8 in use)", "Unique local", "Private (RFC 1918)"],
            ["::1/128", "Loopback", "127.0.0.1"],
            ["ff00::/8", "Multicast", "Multicast, and replaces broadcast"],
            ["::/0", "Default route", "0.0.0.0/0"],
          ],
        },
        decision: dec(
          "An ISP assigns a company the IPv6 prefix 2001:db8:acad::/48. The company will use a standard /64 for every LAN.",
          "How many /64 subnets can the company create?",
          ["65,536, because 64 − 48 = 16 bits of subnet ID and 2^16 = 65,536", "The bits between the site prefix and the /64 are the subnet ID: 16 bits here."],
          [
            ["256", "That would be a /56 allocation, with 8 bits of subnet ID."],
            ["254", "There is no −2 in IPv6 subnet counting, and the number of bits is 16, not 8."],
            ["Only one, because IPv6 does not support subnetting", "IPv6 is designed for subnetting: the /64 is the standard LAN subnet."],
          ]
        ),
      },
      {
        id: "a-nw-office-plan",
        title: "Practical: an addressing plan for a real office",
        explain:
          "Time to put the module together, the way the capstone will. An office has 50 computers in five departments: Customer Service 20, IT 12, Finance 8, Administration 6 and HR 4, and you are given 192.168.1.0/24. Planning steps: 1. Add growth to each count (here we plan for exactly these numbers to keep the arithmetic visible; in real life add 20–30 percent). 2. Sort largest first. 3. Give each the smallest block that fits: Customer Service 20 → /27 (30 hosts), IT 12 → /28 (14), Finance 8 → /28 (14), Administration 6 → /29 (6), HR 4 → /29 (6). 4. Allocate in order: 192.168.1.0/27, .32/28, .48/28, .64/29, .72/29. 5. Document each subnet's network, gateway (first usable), range and broadcast, and verify with a calculator. Work out the plan below, in order.",
        netCalc: {
          task: "Plan 192.168.1.0/24 for Customer Service 20, IT 12, Finance 8, Administration 6 and HR 4 hosts, largest first.",
          questions: [
            { q: "Which prefix is the smallest that fits Customer Service (20 hosts)?", answer: "/27", check: { fn: "prefixForHosts", arg: "20" }, hint: "A /28 has 14 hosts, too few; a /27 has 30.", working: "2^5 − 2 = 30 ≥ 20 → /27" },
            { q: "Customer Service gets 192.168.1.0/27. What subnet does IT (12 hosts) get, straight after it? (Write it with its prefix.)", answer: "192.168.1.32/28", hint: "12 hosts need a /28 (14 hosts). The /27 ends at .31, so IT starts at .32.", working: "IT → /28 starting at .32 → 192.168.1.32/28" },
            { q: "What subnet does Finance (8 hosts) get next?", answer: "192.168.1.48/28", hint: "8 hosts also need a /28 (a /29 has only 6). IT's /28 ends at .47.", working: "Finance → /28 at .48 → 192.168.1.48/28" },
            { q: "What subnet does Administration (6 hosts) get next?", answer: "192.168.1.64/29", hint: "6 hosts fit exactly in a /29. Finance ends at .63.", working: "Administration → /29 at .64 → 192.168.1.64/29" },
            { q: "What subnet does HR (4 hosts) get next?", answer: "192.168.1.72/29", hint: "A /29 again (a /30 has only 2). Administration ends at .71.", working: "HR → /29 at .72 → 192.168.1.72/29" },
            { q: "What is IT's default gateway, the first usable address of its subnet?", answer: "192.168.1.33", check: { fn: "firstHost", arg: "192.168.1.32/28" }, hint: "Network + 1.", working: "192.168.1.32 + 1 = 192.168.1.33" },
          ],
          successMessage: "Five departments, right-sized subnets, no overlaps, and most of the /24 still free for growth. That is the plan the capstone builds on.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },

    task: {
      title: "Module 3 practical: addressing by hand, then by calculator",
      intro:
        "Do every exercise by hand first, showing the binary where it helps, then check each answer with an online subnet calculator. Keep your plans: the capstone reuses them.",
      prompts: [
        "Convert 172.31.200.17 to binary, and 11000000.10101000.01100100.11111110 to decimal. Say whether each address is public or private.",
        "Write the mask for /19, /23 and /28 in dotted decimal, and give the prefix length for 255.255.255.240 and 255.255.248.0.",
        "Divide 192.168.1.0/24 into eight equal subnets. For each, give the network address, first usable, last usable and broadcast address.",
        "Design an addressing plan for a 50-computer office using 192.168.10.0/24: 20 staff PCs, 15 laptops on Wi-Fi, 8 VoIP phones, 4 printers and servers (static), 3 managers, and a router-to-firewall link. Allow 25 percent growth in each group.",
        "Allocate subnets to five departments of 40, 25, 12, 10 and 6 hosts from 172.16.50.0/24 using VLSM, and show what space is left for growth.",
        "Write the summary route for 192.168.16.0/24 through 192.168.23.0/24, and explain how you know the eight networks can be summarised exactly.",
        "Shorten 2001:0db8:0000:00a0:0000:0000:0000:0001, and plan four /64 LAN subnets from the site prefix 2001:db8:cafe::/48.",
      ],
      closing:
        "Addresses get packets to the right network; protocols decide what happens when they arrive. Module 4 covers TCP, UDP, DNS, DHCP and the other services every network runs.",
    },
  },
];
