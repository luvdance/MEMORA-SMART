/**
 * CYBERSECURITY · WEEK 4 · NETWORKING ESSENTIALS FOR SECURITY
 *
 * Harvard anchor: extends the CS50 model of the internet — routers, TCP/IP,
 * DNS, HTTP — into a security-focused networking foundation.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 *
 * The captures below are shaped from real traffic: a browser loading a site
 * over HTTPS, and a login posted to a device over plain HTTP. The display
 * filter the learner types is real Wireshark syntax, evaluated by
 * lib/academy/cyber/packets.js, so what works here works in the real tool.
 *
 * Every offensive exercise in this week is on host-only networking against a
 * machine the learner owns. Week 1's rule, restated in the last lesson,
 * applies from here to the end of the course.
 */

export const SECTION_ID = "cs-s4-networking";

/** One browsing session, captured. Shared by two atoms in lesson 2. */
const WEB_CAPTURE = [
  {
    no: 1,
    time: "0.000000",
    src: "192.168.56.10",
    dst: "192.168.56.1",
    proto: "DNS",
    sport: 51322,
    dport: 53,
    length: 74,
    info: "Standard query 0x8f21 A memora.ng",
  },
  {
    no: 2,
    time: "0.026410",
    src: "192.168.56.1",
    dst: "192.168.56.10",
    proto: "DNS",
    sport: 53,
    dport: 51322,
    length: 90,
    info: "Standard query response 0x8f21 A memora.ng A 102.22.1.9",
  },
  {
    no: 3,
    time: "0.027883",
    src: "192.168.56.10",
    dst: "102.22.1.9",
    proto: "TCP",
    sport: 51323,
    dport: 443,
    length: 74,
    info: "51323 → 443 [SYN] Seq=0 Win=64240 Len=0",
    flags: "SYN",
  },
  {
    no: 4,
    time: "0.061204",
    src: "102.22.1.9",
    dst: "192.168.56.10",
    proto: "TCP",
    sport: 443,
    dport: 51323,
    length: 74,
    info: "443 → 51323 [SYN, ACK] Seq=0 Ack=1 Win=65160 Len=0",
    flags: "SYN ACK",
  },
  {
    no: 5,
    time: "0.062991",
    src: "192.168.56.10",
    dst: "102.22.1.9",
    proto: "TLS",
    sport: 51323,
    dport: 443,
    length: 571,
    info: "Client Hello (SNI=memora.ng)",
  },
  {
    no: 6,
    time: "0.098337",
    src: "102.22.1.9",
    dst: "192.168.56.10",
    proto: "TLS",
    sport: 443,
    dport: 51323,
    length: 1494,
    info: "Server Hello, Certificate, Server Finished",
  },
  {
    no: 7,
    time: "0.101550",
    src: "192.168.56.10",
    dst: "102.22.1.9",
    proto: "TLS",
    sport: 51323,
    dport: 443,
    length: 118,
    info: "Application Data (encrypted)",
  },
  {
    no: 8,
    time: "0.139002",
    src: "102.22.1.9",
    dst: "192.168.56.10",
    proto: "TLS",
    sport: 443,
    dport: 51323,
    length: 1466,
    info: "Application Data (encrypted)",
  },
];

/** A login posted to a lab device that still speaks plain HTTP. */
const CLEARTEXT_CAPTURE = [
  {
    no: 1,
    time: "0.000000",
    src: "192.168.56.10",
    dst: "192.168.56.20",
    proto: "TCP",
    sport: 49812,
    dport: 80,
    length: 74,
    info: "49812 → 80 [SYN] Seq=0 Win=64240 Len=0",
    flags: "SYN",
  },
  {
    no: 2,
    time: "0.000411",
    src: "192.168.56.20",
    dst: "192.168.56.10",
    proto: "TCP",
    sport: 80,
    dport: 49812,
    length: 74,
    info: "80 → 49812 [SYN, ACK] Seq=0 Ack=1 Win=29200 Len=0",
    flags: "SYN ACK",
  },
  {
    no: 3,
    time: "0.000660",
    src: "192.168.56.10",
    dst: "192.168.56.20",
    proto: "TCP",
    sport: 49812,
    dport: 80,
    length: 66,
    info: "49812 → 80 [ACK] Seq=1 Ack=1 Win=64256 Len=0",
    flags: "ACK",
  },
  {
    no: 4,
    time: "0.001902",
    src: "192.168.56.10",
    dst: "192.168.56.20",
    proto: "HTTP",
    sport: 49812,
    dport: 80,
    length: 411,
    info: "POST /admin/login HTTP/1.1  (username=admin&password=Rout3r!2019)",
  },
  {
    no: 5,
    time: "0.014338",
    src: "192.168.56.20",
    dst: "192.168.56.10",
    proto: "HTTP",
    sport: 80,
    dport: 49812,
    length: 298,
    info: "HTTP/1.1 302 Found  (Set-Cookie: session=7f1c...)",
  },
  {
    no: 6,
    time: "0.015901",
    src: "192.168.56.10",
    dst: "192.168.56.20",
    proto: "TCP",
    sport: 49812,
    dport: 80,
    length: 66,
    info: "49812 → 80 [FIN, ACK] Seq=346 Ack=233 Win=64256 Len=0",
    flags: "FIN ACK",
  },
];

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 1
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "cs-l13-how-a-request-travels",
    moduleId: "cs-w4-networking",
    sectionId: SECTION_ID,
    order: 1,
    title: "How a Request Actually Travels",
    subtitle: "What happens between typing and seeing",
    estimatedMinutes: 12,
    intro:
      "You cannot defend a network you cannot picture. This lesson follows one request from the moment you press Enter to the moment the page appears, and names every piece an attacker could interfere with along the way.",

    atoms: [
      {
        id: "a-cs-net-layers",
        title: "The stack, and why it is layered",
        explain:
          "Networking is built in layers, each one solving a problem and handing the result to the next. Your browser speaks HTTP. HTTP hands its request to TCP, which makes sure it arrives in order. TCP hands it to IP, which gets it across networks. IP hands it to Ethernet or WiFi, which moves it to the next machine along.",
        why: "Layers matter for security because attacks live at specific ones, and so do defences. A firewall filtering ports works at the transport layer and cannot see what is inside an HTTPS request. A web application firewall sees the request and cannot see the ports. Knowing which layer you are at tells you what you can possibly see.",
        table: {
          caption: "Four layers, what each adds, and what attacks it.",
          headers: ["Layer", "Adds", "Example attack"],
          rows: [
            ["Application (HTTP, DNS)", "What you are actually asking for", "SQL injection, DNS spoofing"],
            ["Transport (TCP, UDP)", "Ports, and ordering", "SYN flood, port scanning"],
            ["Internet (IP)", "Addressing across networks", "IP spoofing, routing attacks"],
            ["Link (Ethernet, WiFi)", "Getting to the next machine", "ARP spoofing, WiFi attacks"],
          ],
          note: "The seven-layer OSI model is the one exams ask about. This four-layer TCP/IP model is the one that matches what you will actually see in a capture.",
        },
      },
      {
        id: "a-cs-net-ip-ports",
        title: "Addresses and ports",
        explain:
          "An IP address identifies a machine. A port identifies which program on it. Together they are a socket, and a connection is a pair of sockets: your machine and a random high port, talking to their machine on a known one.",
        why: "This is why port scanning is the first thing any attacker does. The port number tells you what is probably listening, and therefore what might be attackable. Nobody scans for machines. They scan for services.",
        table: {
          caption: "The ports you will see constantly, and what each one means to an attacker.",
          headers: ["Port", "Service", "What it suggests"],
          rows: [
            ["22", "SSH", "Remote administration. A password-guessing target"],
            ["80", "HTTP", "A web server, with unencrypted traffic"],
            ["443", "HTTPS", "A web server, encrypted"],
            ["3389", "RDP", "Windows remote desktop. Should never face the internet"],
            ["3306 / 5432", "MySQL / PostgreSQL", "A database. Should never face the internet"],
            ["53", "DNS", "Name resolution, and a favourite for amplification attacks"],
          ],
        },
        mistake:
          "Thinking an open port is a vulnerability. It is an exposure. A well-patched, well-configured service on an open port is fine. The port tells you where to look, not what you found.",
      },
      {
        id: "a-cs-net-dns",
        title: "DNS, and why it is a security problem",
        explain:
          "DNS turns a name into an address. Your machine asks a resolver, which asks other servers until somebody knows, and the answer comes back and is cached. Classic DNS is unauthenticated and, unless you have specifically configured otherwise, unencrypted.",
        why: "Two consequences. Anyone who can see your traffic knows every site you visit, even when the traffic itself is encrypted, because the lookup happened in the clear first. And anyone who can answer faster than the real server can send you somewhere else entirely.",
        analogy:
          "Asking a stranger in the street for directions to a bank, and going wherever they point. Nothing about the exchange proves they know, or that they are honest.",
        table: {
          caption: "How the lookup is protected, or not.",
          headers: ["", "Classic DNS", "DNS over HTTPS", "DNSSEC"],
          rows: [
            ["Anyone can read the query", "Yes", "No", "Yes"],
            ["Anyone can forge the answer", "Yes, if they are fast", "Harder", "No, if validated"],
            ["Solves", "Nothing", "Confidentiality", "Integrity"],
          ],
          note: "They solve different halves. Encryption hides the question. DNSSEC proves the answer. Neither replaces the other.",
        },
      },
      {
        id: "a-cs-net-handshake",
        title: "The TCP handshake",
        explain:
          "Before any data moves, TCP does three things. Your machine sends a SYN. The server replies SYN, ACK. Your machine sends an ACK. Now both sides agree the connection exists and know where to start counting.",
        why: "You need this to read a capture, and you need it to understand two things that come later. A port scan works by sending SYNs and seeing what answers. A SYN flood works by sending SYNs and never completing, so the server holds thousands of half-open connections until it has no room for real ones.",
        example:
          "  you → server   SYN            \"can we talk?\"\n  server → you   SYN, ACK       \"yes, and can we talk?\"\n  you → server   ACK            \"yes\"\n\n  then, and only then, any actual data.",
        mistake:
          "Expecting to see this in front of a DNS lookup. DNS normally uses UDP, which has no handshake at all. It sends the question and hopes. That is why it is fast and why forging an answer is feasible.",
      },
      {
        id: "a-cs-net-full-request",
        title: "The whole journey, once",
        explain:
          "Typing memora.ng and pressing Enter sets off, in order: a DNS lookup to turn the name into an address, a TCP handshake to that address on port 443, a TLS handshake to agree encryption and check the certificate, and only then the HTTP request itself, encrypted inside all of that.",
        why: "Every security control you will meet sits somewhere on that sequence. Being able to say where is what makes a control's limits obvious rather than something you have to memorise.",
        decision: {
          scenario:
            "A colleague says that because your company site is HTTPS, an attacker on the same WiFi cannot tell which sites employees visit.",
          question: "Is that right?",
          options: [
            {
              id: "a",
              text: "Yes. HTTPS encrypts everything, so the whole visit is hidden",
              whyWrong:
                "HTTPS encrypts the contents of the conversation, and the conversation happens after two things that are not encrypted. The DNS lookup asked for the name in the clear, and the TLS Client Hello usually announces the site name too. The pages are private; which site is not.",
            },
            {
              id: "b",
              text: "No. The DNS lookup, and usually the TLS Client Hello, reveal the site name before any encryption of content begins",
              why: "Both happen before the encrypted channel carries anything. An observer learns which sites, when, how often and how much data, all without breaking anything.",
            },
            {
              id: "c",
              text: "No, because HTTPS only encrypts passwords and form data",
              whyWrong:
                "HTTPS encrypts the whole HTTP exchange, including URLs, headers and page content. The leak is not inside HTTPS. It is in the steps that happen before it.",
            },
            {
              id: "d",
              text: "Yes, as long as the company uses a VPN",
              whyWrong:
                "A VPN would genuinely move the observation point, which is a different answer to a different question. As asked, with HTTPS alone, the site name is visible, and adding a condition that was not in the scenario dodges it.",
            },
          ],
          correct: "b",
          aftermath:
            "This is the difference between content and metadata, and you will meet it again in Week 13. Metadata is frequently the more revealing of the two.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 2
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "cs-l14-reading-a-capture",
    moduleId: "cs-w4-networking",
    sectionId: SECTION_ID,
    order: 2,
    title: "Reading a Packet Capture",
    subtitle: "The display filter is the skill",
    estimatedMinutes: 14,
    intro:
      "Wireshark shows you everything, which is the same as showing you nothing. The skill that makes it useful is narrowing thousands of packets to the handful that answer your question. That is the display filter, and this lesson is three exercises with it.",

    atoms: [
      {
        id: "a-cs-net-why-capture",
        title: "What a capture actually is",
        explain:
          "A packet capture is a recording of the traffic that passed a point on the network. Each row is one packet, with who sent it, who it was going to, which protocol the tool managed to decode, and a summary of what it contained.",
        why: "It is the ground truth. Logs tell you what an application decided to write down. A capture tells you what actually crossed the wire, including things no application logged, and it is often the only evidence that settles an argument in an incident.",
        table: {
          caption: "The filters you will use constantly. Real Wireshark syntax.",
          headers: ["Filter", "Shows"],
          rows: [
            ["dns", "Name lookups and their answers"],
            ["http", "Unencrypted web traffic, including form posts"],
            ["ip.addr == 192.168.56.20", "Everything to or from that machine"],
            ["tcp.port == 443", "Everything on the HTTPS port, in either direction"],
            ["tcp.flags.syn == 1", "Connection attempts, which is how a scan looks"],
            ["dns && ip.src == 192.168.56.10", "Combine with && for AND"],
          ],
        },
        mistake:
          "Scrolling. A capture of five minutes of real traffic is tens of thousands of packets, and reading them in order finds nothing. Decide the question, then write the filter that answers it.",
      },
      {
        id: "a-cs-net-read-capture",
        title: "Practice: find the answer",
        explain:
          "Below is a capture of one browser loading one website. Start with the first step of the journey: the name lookup. Filter the capture down to it, and find the packet where the address actually comes back.",
        why: "This single packet is the one that decides where your traffic goes next. In Week 6 and again in Week 12 you will look at exactly this row to work out whether a machine was sent somewhere it should not have been.",
        captureExercise: {
          task:
            "Filter this capture to the name lookups, then click the packet that carries the answer back to the machine.",
          packets: WEB_CAPTURE,
          expect: {
            maxRows: 2,
            packet: 2,
            mustContain: [2],
            whyWrong:
              "That is the question going out, not the answer coming back. Check the direction: the answer arrives FROM the resolver, and its Info column contains the address that was found.",
            success:
              "That is it. Packet 2 is the resolver answering 102.22.1.9, and every packet after it goes to that address because of this one reply.",
          },
          hint: "The filter is the protocol name on its own, in lowercase. Then look at the Source column to tell the question from the answer.",
          note: "Two packets, out of eight. On a real capture that same filter takes you from forty thousand rows to nine.",
        },
      },
      {
        id: "a-cs-net-follow-request",
        title: "Practice: find what HTTPS still announces",
        explain:
          "Now the encrypted part. The TLS handshake has to tell the server which site you want before encryption starts, because one server may host hundreds of sites and must know which certificate to present. That announcement is called SNI, and it is in the clear.",
        why: "This is the packet that proves the previous lesson's point. Everything after it is unreadable, and this one still names the site. It is how corporate filtering, censorship systems and anyone on your WiFi know where you went.",
        captureExercise: {
          task:
            "Filter to the HTTPS conversation, then click the first packet your machine sends that names the site in the clear.",
          packets: WEB_CAPTURE,
          expect: {
            maxRows: 8,
            packet: 5,
            mustContain: [5],
            whyWrong:
              "Look for a packet your machine SENT, whose Info column contains the site name in readable text. The handshake packets before it only set up the connection, and everything after it is encrypted.",
            success:
              "Packet 5, the Client Hello, with SNI=memora.ng sitting in plain text inside an otherwise encrypted protocol.",
          },
          hint: "Filter on the port rather than the protocol name, then read the Info column of each packet your machine sent.",
          note: "Encrypted Client Hello is a newer extension that closes this gap. It is not yet universal, so assume the site name is visible unless you have checked.",
        },
      },
      {
        id: "a-cs-net-metadata",
        title: "What encryption hides, and what it does not",
        explain:
          "Encryption protects the contents of a conversation. It does not hide that the conversation happened, who it was with, when, how long it lasted or how much data moved.",
        why: "Traffic analysis is a genuine discipline built entirely on that gap. A capture with no readable content still tells you a workstation contacted an unfamiliar address every sixty seconds for nine hours, which is the signature of malware checking in and is exactly how it gets caught.",
        table: {
          caption: "One encrypted connection, examined by someone in the middle.",
          headers: ["Question", "Can they answer it?"],
          rows: [
            ["What did the page say?", "No"],
            ["What password was typed?", "No"],
            ["Which site was it?", "Usually yes, from DNS and SNI"],
            ["How long were they on it?", "Yes"],
            ["How much data came back?", "Yes"],
            ["Is this a regular pattern?", "Yes, and this is how malware is spotted"],
          ],
        },
      },
      {
        id: "a-cs-net-spot-cleartext",
        title: "Practice: find the password",
        explain:
          "A different capture. Somebody logged into the admin panel of a device on the lab network that still speaks plain HTTP. Find the moment their credentials crossed the wire.",
        why: "This is why plain HTTP is not acceptable on any network, including internal ones. The idea that internal traffic is safe assumes nobody hostile is ever inside, which is precisely the assumption every real breach violates.",
        captureExercise: {
          task:
            "Filter this capture to unencrypted web traffic, then click the packet that carries the login credentials.",
          packets: CLEARTEXT_CAPTURE,
          expect: {
            maxRows: 2,
            packet: 4,
            mustContain: [4],
            whyWrong:
              "One of those two packets is the request going to the server and one is the response coming back. Credentials are sent, not returned. Check the direction and read the Info column.",
            success:
              "Packet 4. The username and the password are sitting in the Info column in plain text, and anybody on that network segment could read them.",
          },
          hint: "The filter is the protocol name in lowercase, four letters.",
          note: "The password in that packet is a real-looking device password, and it would be in the attacker's notes within seconds of them seeing it. Note also packet 5: the session cookie comes back in the clear too, so even a password change would not help.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 3
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "cs-l15-network-attacks",
    moduleId: "cs-w4-networking",
    sectionId: SECTION_ID,
    order: 3,
    title: "Attacks on the Network Itself",
    subtitle: "Sniffing, spoofing and the machine in the middle",
    estimatedMinutes: 11,
    intro:
      "Four families of attack that work on the network rather than on any application running over it. Each one exists because a protocol designed in a more trusting era takes something on faith.",

    atoms: [
      {
        id: "a-cs-net-sniffing",
        title: "Sniffing",
        explain:
          "Passively reading traffic that is not addressed to you. On old shared networks this was trivial. On modern switched networks a machine normally only sees its own traffic, which is why sniffing usually has to be combined with the next attack.",
        why: "It is the reason encryption in transit became non-negotiable even inside a company's own building. Sniffing leaves no trace at all, because nothing is sent. You cannot detect a purely passive listener on the wire.",
        mistake:
          "Assuming WiFi is safe because it has a password. On an open network, everyone can read everything. On WPA2 with a shared password, anyone who has that password and saw you connect can often decrypt your traffic too.",
      },
      {
        id: "a-cs-net-spoofing",
        title: "Spoofing, and why ARP is the easy one",
        explain:
          "Spoofing is claiming to be something you are not. ARP is the protocol that maps an IP address to a hardware address on the local network, it has no authentication whatsoever, and a machine that announces \"I am the router\" is generally believed.",
        why: "This is how sniffing becomes practical on a switched network. Convince the switch you are the router and every machine's traffic goes through you on its way out. It is why an attacker who gets onto your WiFi is a serious problem and not just a bandwidth complaint.",
        analogy:
          "Standing at the office post room saying you are the courier. Nobody checks, because in 1982 nobody imagined they would need to.",
        table: {
          caption: "Three kinds of spoofing, and what each buys the attacker.",
          headers: ["Spoofed", "Effect", "Where it is used"],
          rows: [
            ["ARP", "Traffic on the local network routes through the attacker", "Coffee shops, offices, any shared network"],
            ["IP source address", "Replies go somewhere else, or the source is hidden", "Amplification attacks"],
            ["Email sender", "The message appears to be from a colleague", "Phishing, business email compromise"],
          ],
        },
      },
      {
        id: "a-cs-net-mitm",
        title: "The machine in the middle",
        explain:
          "Combine spoofing with sniffing and the attacker is not just listening, they are relaying. They can read everything, change anything, and neither side knows there is a third party. This is the attack TLS exists to defeat.",
        why: "It is the clearest demonstration of why certificate warnings matter. The attacker can intercept the connection and cannot present a valid certificate for the domain, so the browser warns. That warning is the whole defence, and clicking through it removes it.",
        decision: {
          scenario:
            "You are on a client's guest WiFi. Your laptop shows a certificate warning for an internal tool you use every day. You have seen this warning on this tool before at the office, because it uses a self-signed certificate.",
          question: "Does the history make it safe to accept?",
          options: [
            {
              id: "a",
              text: "Yes. You have seen this exact warning before, so it is the known self-signed certificate",
              whyWrong:
                "Having seen a warning before is not the same as having checked the certificate now. That familiarity is exactly the condition an interception attack needs: you are trained to expect a warning here, so you click through without reading it.",
            },
            {
              id: "b",
              text: "Compare the certificate fingerprint against the one you recorded at the office, and only continue if it matches",
              why: "The fingerprint is the thing that distinguishes your self-signed certificate from an attacker's. It is the only way to tell two warnings apart, and it is why internal self-signed certificates should be pinned or replaced with a proper internal authority.",
            },
            {
              id: "c",
              text: "No, and never use that tool outside the office",
              whyWrong:
                "This is safe and impractical, and it treats the symptom. The real problem is a tool that trains its users to dismiss certificate warnings, which the organisation should fix rather than work around forever.",
            },
            {
              id: "d",
              text: "Accept it but connect through the company VPN afterwards",
              whyWrong:
                "Order matters. If you accept an interception certificate first, the attacker is already in that session. A VPN started afterwards does not undo what was already exposed.",
            },
          ],
          correct: "b",
          aftermath:
            "Self-signed certificates on internal tools are a common and underrated risk, precisely because they teach an entire workforce that certificate warnings are normal.",
        },
      },
      {
        id: "a-cs-net-dns-attacks",
        title: "Attacking the lookup",
        explain:
          "If you can answer a DNS query before the real server does, you decide where the victim's traffic goes. Cache poisoning goes further and plants the wrong answer in a resolver so that everyone using it is redirected, for as long as the cache entry lives.",
        why: "It is the most valuable point in the chain to attack, because everything downstream trusts it. No amount of care about which link you clicked helps if the correct name resolves to the attacker's address.",
        example:
          "What the victim sees:     they typed the right address themselves\nWhat the browser sees:    the name resolved to 203.0.113.44\nWhat the attacker did:    answered the query faster than the real resolver\n\nTLS is what breaks this. The attacker holds the address and not\na valid certificate for the name, so the browser refuses.",
        mistake:
          "Thinking DNS over HTTPS solves this. It encrypts the query so nobody in between can read or tamper with it in transit, and it says nothing about whether the answer itself is genuine. That is DNSSEC's job.",
      },
      {
        id: "a-cs-net-dos-amplification",
        title: "Amplification, and why UDP is involved",
        explain:
          "Some protocols answer a small question with a large answer, and do so over UDP, which does not verify who asked. Send a small query with the victim's address as the source, and the server sends a large reply to the victim. Do it from thousands of machines and the victim is flooded by servers that are not compromised at all.",
        why: "It explains why denial of service is hard to defend against at the victim's end, and why misconfigured services are a problem for other people even when they are not a problem for you. An open DNS resolver on your network is a weapon pointed at a stranger.",
        table: {
          caption: "Why the attacker uses someone else's servers.",
          headers: ["", "Direct flood", "Amplified"],
          rows: [
            ["Traffic the attacker must send", "All of it", "A fraction of it"],
            ["Who the victim sees attacking", "The attacker", "Thousands of legitimate servers"],
            ["Blocking the source", "Possible", "Means blocking real infrastructure"],
          ],
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 4
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "cs-l16-scanning",
    moduleId: "cs-w4-networking",
    sectionId: SECTION_ID,
    order: 4,
    title: "Scanning and Enumeration",
    subtitle: "Seeing your own network the way an attacker does",
    estimatedMinutes: 13,
    intro:
      "Everything in this lesson happens on host-only networking, against machines you own. Read the last atom before you run anything anywhere else, because that one is about the law rather than the tool.",

    atoms: [
      {
        id: "a-cs-net-what-scanning-is",
        title: "What a scan is actually doing",
        explain:
          "A host scan sends a small probe to every address in a range and lists the ones that answer. A port scan sends a connection attempt to each port on a host and lists the ones that respond. There is nothing clever in it. It is knocking on every door and writing down which ones open.",
        why: "It is the first thing both attackers and defenders do, for the same reason: almost nobody knows what is actually running on their own network. The gap between the asset list and the scan result is where breaches live.",
        mistake:
          "Treating the scan result as the finding. It is an inventory. The work starts when you ask why each of those services is reachable and whether it should be.",
      },
      {
        id: "a-cs-net-scan-lab",
        title: "Practice: discover the lab",
        explain:
          "Your lab network is 192.168.56.0/24, on host-only networking, containing your own machines and nothing else. Find out which addresses are alive.",
        why: "Host discovery comes before port scanning, always, and for a practical reason: scanning every port of 254 addresses when only three are up wastes hours. Find the machines, then examine the machines.",
        terminalExercise: {
          prompt: "learner@kali:~$",
          intro:
            "Recorded from a real Kali VM on host-only networking. The lab range is 192.168.56.0/24.",
          goal:
            "Find out which addresses on the lab network 192.168.56.0/24 are actually alive, without scanning any ports yet.",
          commands: {
            "ip a":
              "2: eth0: <BROADCAST,MULTICAST,UP> mtu 1500\n    inet 192.168.56.10/24 brd 192.168.56.255 scope global eth0",
            "nmap -sn 192.168.56.0/24":
              "Starting Nmap 7.94 ( https://nmap.org )\nNmap scan report for 192.168.56.1\nHost is up (0.00031s latency).\nNmap scan report for 192.168.56.10\nHost is up (0.00012s latency).\nNmap scan report for 192.168.56.20\nHost is up (0.00048s latency).\nNmap done: 256 IP addresses (3 hosts up) scanned in 2.19 seconds",
            "nmap 192.168.56.20":
              "Starting Nmap 7.94 ( https://nmap.org )\nNmap scan report for 192.168.56.20\nHost is up (0.00042s latency).\nNot shown: 997 closed tcp ports (reset)\nPORT     STATE SERVICE\n22/tcp   open  ssh\n80/tcp   open  http\n3306/tcp open  mysql\nNmap done: 1 IP address (1 host up) scanned in 0.28 seconds",
            "nmap -sV 192.168.56.20":
              "Starting Nmap 7.94 ( https://nmap.org )\nNmap scan report for 192.168.56.20\nPORT     STATE SERVICE VERSION\n22/tcp   open  ssh     OpenSSH 8.2p1 Ubuntu 4ubuntu0.5\n80/tcp   open  http    Apache httpd 2.4.41 ((Ubuntu))\n3306/tcp open  mysql   MySQL 5.7.33\nService detection performed. Nmap done: 1 IP address (1 host up)",
            "nmap -p 22 192.168.56.20":
              "Starting Nmap 7.94 ( https://nmap.org )\nPORT   STATE SERVICE\n22/tcp open  ssh\nNmap done: 1 IP address (1 host up) scanned in 0.08 seconds",
          },
          available: [
            "ip a",
            "nmap -sn 192.168.56.0/24",
            "nmap 192.168.56.20",
            "nmap -sV 192.168.56.20",
            "nmap -p 22 192.168.56.20",
          ],
          accept: ["nmap -sn 192.168.56.0/24"],
          near: [
            {
              command: "nmap 192.168.56.20",
              why: "That scans the ports of one machine you already knew about. The goal was to discover which machines exist at all, across the whole range, before looking at any of them in detail.",
            },
            {
              command: "ip a",
              why: "That shows your own address, which is genuinely the right first step and tells you the range you are on. It does not discover anybody else.",
            },
          ],
          hint: "There is a flag that means \"ping scan only, no port scan\". Combine it with the whole range in CIDR form.",
          success:
            "Three hosts up out of 256 addresses, in two seconds. 192.168.56.1 is the host machine, .10 is you, and .20 is the target. Now try `nmap -sV 192.168.56.20` and read what it tells you about each service.",
        },
      },
      {
        id: "a-cs-net-scan-types",
        title: "The scans worth knowing",
        explain:
          "A handful of options cover almost everything you will do. Host discovery, a default port scan, a version scan, and a specific port. The rest are refinements for speed, stealth or coverage.",
        why: "Each answers a different question, and running the wrong one wastes time or produces a result you misread. A default scan checks the 1,000 most common ports and will silently miss a service on port 8443 unless you asked for it.",
        table: {
          caption: "What each option is for.",
          headers: ["Command", "Asks", "Watch out for"],
          rows: [
            ["nmap -sn RANGE", "Which hosts are up?", "Some hosts do not answer pings and are missed"],
            ["nmap HOST", "Which of the top 1,000 ports are open?", "It is not all 65,535 ports"],
            ["nmap -p- HOST", "All 65,535 ports", "Slow. Run it when you have time"],
            ["nmap -sV HOST", "What software and version is on each port?", "Noisy, and the version may be a guess"],
            ["nmap -A HOST", "Everything, including scripts and OS detection", "Very noisy. Never a first move"],
          ],
        },
      },
      {
        id: "a-cs-net-banner",
        title: "Why the version number matters so much",
        explain:
          "A version scan returns things like OpenSSH 8.2p1 or MySQL 5.7.33. That string is the whole game. It can be looked up against public vulnerability databases in seconds, and the result is a list of known ways in that require no skill at all.",
        why: "This is the single most common route into an organisation after phishing. Nobody is finding new vulnerabilities in your web server. They are finding that your web server is four years out of date and that the exploit has been published since 2023.",
        example:
          "From the scan you just ran:\n\n  3306/tcp open  mysql  MySQL 5.7.33\n\nTwo questions follow immediately, and neither is about MySQL:\n  1. why is a database port reachable from anywhere at all?\n  2. how many known issues affect 5.7.33, and how old is it?\n\nThe second is a lookup. The first is the actual finding.",
        mistake:
          "Trusting the version string. Services can be configured to lie, and version detection sometimes guesses. Treat it as a strong lead to verify rather than a fact to report.",
      },
      {
        id: "a-cs-net-scan-ethics",
        title: "The line, and where it actually is",
        explain:
          "Scanning a machine you do not own or have written permission to test is, in most jurisdictions including Nigeria under the Cybercrimes Act, unauthorised access to a computer system. Intent to cause harm is generally not required. The act of probing is the offence.",
        why: "This is not a disclaimer. It is the first thing that separates a security professional from an incident. Every technique from here to Week 12 is legal against your lab and illegal against your neighbour, and the difference is authorisation, in writing, before you start.",
        table: {
          caption: "The same command, four contexts.",
          headers: ["Target", "Allowed?"],
          rows: [
            ["Your own lab VM on host-only networking", "Yes, always"],
            ["Your employer's network, without a written scope", "No, and this gets people dismissed"],
            ["A practice range you have signed up for", "Yes, within their stated rules"],
            ["Any address you found interesting on the internet", "No, and it is a criminal offence"],
          ],
        },
        decision: {
          scenario:
            "You find what looks like an exposed admin panel on a Nigerian company's website while shopping. You are not a customer and have no relationship with them. You are fairly sure it is a serious problem.",
          question: "What do you do?",
          options: [
            {
              id: "a",
              text: "Test it carefully to confirm the vulnerability before reporting, so the report is credible",
              whyWrong:
                "Testing without authorisation is the offence, whatever your motive. \"I was checking whether it was really broken\" has landed well-meaning people in serious legal trouble, including people who then reported what they found.",
            },
            {
              id: "b",
              text: "Report what you observed, without probing further, to their published security contact or their support channel",
              why: "You observed something in the ordinary course of using the site, which is not an offence. Reporting that observation is responsible and legal. What crosses the line is going further to confirm it.",
            },
            {
              id: "c",
              text: "Post it publicly so they are forced to fix it",
              whyWrong:
                "Publishing an unfixed exposure hands it to everyone who reads it, including the people who will use it. Coordinated disclosure exists precisely to avoid this, and it is covered properly in Week 9.",
            },
            {
              id: "d",
              text: "Say nothing. It is not your system and reporting it creates risk for you",
              whyWrong:
                "Understandable, and it leaves customer data exposed. Reporting an observation through a published channel is both legal and the right thing to do. The risk to avoid is probing, not reporting.",
            },
          ],
          correct: "b",
          aftermath:
            "Notice the line: observing is not testing. Week 9 covers rules of engagement in full, including how to get authorisation in writing before any of this becomes a question.",
        },
      },
    ],

    task: {
      title: "This week's lab",
      intro: "Capture your own traffic, then map your own lab.",
      prompts: [
        "Install Wireshark on your lab VM. Start a capture, load a website, stop the capture.",
        "Apply the filter `dns` and find the query and the response for the site you loaded. Screenshot both rows.",
        "Apply `tcp.port == 443` and find the Client Hello. Confirm the site name is visible in it, and note that everything after it is not.",
        "Write an annotated explanation of one complete web request: the DNS lookup, the handshake, the TLS negotiation and the first encrypted data, with a screenshot of the packet for each step.",
        "Set both VMs to host-only. Run `nmap -sn` across the lab range, then `nmap -sV` against the target, and record every open port with its service and version.",
        "For each open port, write one sentence on why it is open and whether it should be. Look up one of the version strings in a public vulnerability database and record what you find.",
      ],
      closing:
        "The annotated capture and the scan report are both graded deliverables, and the scan report is the first section of the penetration test you will write in Week 9.",
    },

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
