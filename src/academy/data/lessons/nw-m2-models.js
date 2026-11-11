/**
 * COMPUTER NETWORKING · MODULE 2 · NETWORK MODELS AND COMMUNICATION FUNDAMENTALS
 *
 * Curriculum 2.1 – 2.15 and the practical. How data communication works,
 * the media it travels over, how fast and how far, packet and circuit
 * switching, protocols, the OSI and TCP/IP models and encapsulation.
 *
 * Two tools appear for the first time, each introduced with the exact
 * command before it is graded: a recorded Linux terminal (ping, in Lesson 3)
 * and a packet capture read like Wireshark (Lesson 6).
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

import { cap, dec, term } from "./nw-kit.js";

export const SECTION_ID = "nw-s2-models";
const M = "nw-m2-models";

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 1 · 2.1 – 2.3
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "nw-mo1-communication",
    moduleId: M,
    sectionId: SECTION_ID,
    order: 1,
    covers: ["2.1", "2.2", "2.3"],
    title: "How Data Communication Works",
    subtitle: "Five elements every conversation needs, and which way the data can flow",
    estimatedMinutes: 30,
    intro:
      "Module 1 showed you what networks are made of. This module shows how they actually move information: what has to be present for any communication to happen, what the data travels through, how fast, and the layered models engineers use to think about all of it.",

    atoms: [
      {
        id: "a-nw-data-communication",
        title: "Understanding data communication",
        explain:
          "DATA COMMUNICATION is the exchange of data between two devices over some form of transmission medium. Computers store and send everything (text, photos, video, voice) as BITS: binary digits, each either 0 or 1. Eight bits make one BYTE, enough to store one letter of text. To send data, a device turns its bits into SIGNALS the medium can carry: changes in voltage on a copper wire, pulses of light in a glass fibre, or changes in a radio wave. The receiving device turns the signals back into bits. For communication to be useful it must be ACCURATE (the bits that arrive are the bits that were sent), TIMELY (they arrive while they are still useful; a video call frame that arrives five seconds late is worthless) and DELIVERED to the right device. Everything in networking, from the cable to the website, exists to meet those three needs.",
        analogy:
          "Morse code over a telegraph line: letters become dots and dashes, the dots and dashes become pulses of electricity, and at the far end an operator turns the pulses back into letters. Networks do the same with 0s and 1s, billions of times a second.",
        decision: dec(
          "A hospital's heart monitor sends a patient's readings to the nurses' station. The readings arrive complete and correct, but each one arrives 40 seconds after it was measured.",
          "Which requirement of data communication is failing?",
          ["Timeliness: the data is accurate but arrives too late to be useful", "For live monitoring, data that arrives late is as bad as data that never arrives."],
          [
            ["Accuracy", "The readings arrive complete and correct, so accuracy is fine."],
            ["Delivery", "The readings reach the right place; they are just slow."],
            ["None: the data got there", "Getting there is not enough when the data is time-critical."],
          ]
        ),
      },
      {
        id: "a-nw-five-elements",
        title: "The five elements of data communication",
        explain:
          "Every act of data communication, from a text message to a bank transfer, has the same five elements. The SENDER is the device that creates and sends the data (your phone). The RECEIVER is the device the data is meant for (your friend's phone, or a web server). The MESSAGE is the data itself: text, a picture, a video stream, a file. The TRANSMISSION MEDIUM is the physical path the signals take: a cable, a fibre, or radio waves through the air. The PROTOCOL is the set of rules both sides agree on: how the message is formatted, how it is addressed, how fast to send, and what to do if part of it goes missing. Take away any one and communication fails. Two people who share a room (medium) but no common language (protocol) cannot communicate, however loudly they talk.",
        table: {
          caption: "The five elements, in a WhatsApp message.",
          headers: ["Element", "What it is", "In a WhatsApp message"],
          rows: [
            ["Sender", "Creates and sends the data", "Your phone"],
            ["Receiver", "The device the data is for", "Your friend's phone (via WhatsApp's servers)"],
            ["Message", "The data itself", "The text and photo you typed"],
            ["Transmission medium", "The physical path", "Radio to the cell tower, then fibre and cable"],
            ["Protocol", "The agreed rules", "Wi-Fi or 4G, TCP/IP, and WhatsApp's own message format"],
          ],
        },
        decision: dec(
          "A new smart meter is installed with a working mobile-data connection and correct server address, but it sends readings in a format the electricity company's server was never programmed to understand. Nothing usable arrives.",
          "Which element of communication is missing?",
          ["A shared protocol: the two sides do not agree on the rules for formatting the message", "The medium and addressing work; the rules do not match, so the bits cannot be understood."],
          [
            ["The transmission medium", "The mobile-data connection works; the signals get through."],
            ["The receiver", "The server exists and receives the data. It cannot interpret it."],
            ["The sender", "The meter is sending. Its format is the problem."],
          ]
        ),
      },
      {
        id: "a-nw-transmission-modes",
        title: "Transmission modes: simplex, half-duplex and full-duplex",
        explain:
          "The TRANSMISSION MODE says which way data can flow between two devices. SIMPLEX is one-way only, forever: a TV broadcast, a keyboard sending key presses to a computer, a radio station. HALF-DUPLEX is both ways, but only one direction at a time: a walkie-talkie, where you press to talk and release to listen, and old network hubs, where only one device could send at once. FULL-DUPLEX is both ways at the same time: a phone call, and every modern switched Ethernet link, where a PC sends and receives simultaneously over separate wire pairs. Full duplex roughly doubles what a link can carry compared with half duplex and removes COLLISIONS (two devices sending at once and garbling each other). When the two ends of one cable disagree, one side set to full and the other to half, the link 'works' but loses packets: a DUPLEX MISMATCH, a classic fault you will troubleshoot in Module 9.",
        table: {
          caption: "Three ways data can flow.",
          headers: ["Mode", "Direction", "Everyday example", "Network example"],
          rows: [
            ["Simplex", "One way only", "TV or radio broadcast", "A sensor that only ever sends readings"],
            ["Half-duplex", "Both ways, one at a time", "Walkie-talkie", "Old hubs; Wi-Fi radios take turns on a channel"],
            ["Full-duplex", "Both ways at once", "Telephone call", "A PC on a switch port (modern Ethernet)"],
          ],
        },
        decision: dec(
          "Security guards use handheld radios. When two guards press the talk button at the same moment, neither hears the other.",
          "What transmission mode do the radios use?",
          ["Half-duplex: both directions are possible, but only one at a time", "Taking turns is the defining feature; two talkers at once collide."],
          [
            ["Simplex", "Simplex is one direction only; guards can both talk and listen."],
            ["Full-duplex", "In full duplex both could talk at once and still hear each other, like a phone call."],
            ["Wireless mode", "Wireless describes the medium, not the direction of flow."],
          ]
        ),
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 2 · 2.4 – 2.6
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "nw-mo2-media",
    moduleId: M,
    sectionId: SECTION_ID,
    order: 2,
    covers: ["2.4", "2.5", "2.6"],
    title: "Transmission Methods and Media",
    subtitle: "Serial and parallel, copper, glass and air",
    estimatedMinutes: 35,
    intro:
      "Bits have to travel through something. This lesson covers how they are lined up for the journey and the media that carry them: copper, glass and the air itself, each with its own speed, distance and weaknesses.",

    atoms: [
      {
        id: "a-nw-serial-parallel",
        title: "Serial and parallel transmission",
        explain:
          "SERIAL transmission sends bits ONE AFTER ANOTHER down a single channel. PARALLEL transmission sends several bits AT THE SAME TIME, each on its own wire: eight wires could carry a whole byte at once. Parallel sounds faster, and over very short distances it was: old printer cables and the ribbon cables inside early PCs were parallel. But over distance, the bits on different wires arrive at slightly different times (called SKEW) and interfere with each other (CROSSTALK), so parallel links must stay short and slow. Serial links avoid both problems and can be clocked extremely fast, so almost every modern connection is serial: USB (Universal SERIAL Bus), SATA disks, PCI Express, Ethernet and fibre. When Ethernet uses several wire pairs, each pair is still a fast serial channel of its own.",
        decision: dec(
          "A student says parallel transmission must be better for long network cables, because sending 8 bits at once is 8 times faster than sending one at a time.",
          "Why is that wrong in practice?",
          ["Over distance, parallel bits arrive at slightly different times and interfere with each other, so serial links run far faster and farther", "Skew and crosstalk limit parallel links to short distances; that is why USB, SATA and Ethernet are serial."],
          [
            ["Parallel cables are illegal in modern buildings", "There is no such rule; parallel simply performs badly over distance."],
            ["Serial sends 8 bits at once too", "Serial sends one bit after another on a channel."],
            ["It is right: long network cables use parallel transmission", "Ethernet and fibre are serial."],
          ]
        ),
      },
      {
        id: "a-nw-guided-media",
        title: "Wired media: twisted pair, coaxial and fibre optic",
        explain:
          "WIRED (guided) media carry signals along a physical path. TWISTED PAIR is the copper cable on almost every desk: four pairs of thin wires, each pair twisted together because twisting cancels electrical interference. Unshielded (UTP) is normal; shielded (STP) adds foil for electrically noisy places like factories. It runs up to 100 metres and is graded by CATEGORY (Cat5e, Cat6, Cat6a; Module 5 has the details). COAXIAL cable has one copper core inside insulation, a braided metal shield and an outer jacket. It resists interference well and is used for cable TV, cable broadband and CCTV. FIBRE OPTIC cable carries pulses of LIGHT down a hair-thin strand of glass. Light is not affected by electrical noise or lightning, leaks almost nothing (hard to tap), and travels kilometres: SINGLE-MODE fibre (a very thin core, laser light) runs tens of kilometres between buildings and cities; MULTIMODE fibre (a thicker core, cheaper light sources) runs a few hundred metres inside buildings and data centres. Fibre costs more to terminate and is more fragile to bend.",
        table: {
          caption: "The three wired media.",
          headers: ["Medium", "Carries", "Typical reach", "Strengths", "Weaknesses"],
          rows: [
            ["Twisted pair (UTP/STP)", "Electrical signals on copper", "100 m", "Cheap, easy to install, can carry power (PoE)", "Distance limit; affected by strong interference"],
            ["Coaxial", "Electrical signals on a shielded core", "Hundreds of metres", "Good noise resistance", "Bulky; mainly cable TV and broadband today"],
            ["Fibre optic", "Pulses of light in glass", "Hundreds of metres (multimode) to 80+ km (single-mode)", "Immune to electrical noise, very fast, hard to tap", "Costlier to terminate, fragile when bent"],
          ],
        },
        decision: dec(
          "A bank must link two of its buildings 3 kilometres apart with a private cable that cannot be affected by electrical storms and is hard to tap.",
          "Which medium fits?",
          ["Single-mode fibre", "Light is immune to electrical interference and lightning, single-mode reaches far beyond 3 km, and fibre is very hard to tap without detection."],
          [
            ["Cat6 twisted pair", "Twisted pair stops at 100 m and is copper, so it is affected by electrical storms."],
            ["Coaxial cable", "Coax is still copper and is not designed for a 3 km private data link."],
            ["Multimode fibre", "Multimode reaches only a few hundred metres; single-mode is the long-distance kind."],
          ]
        ),
      },
      {
        id: "a-nw-wireless-media",
        title: "Wireless media: radio, microwave and infrared",
        explain:
          "WIRELESS (unguided) media send signals through the air with no cable. RADIO waves spread in all directions and pass through walls: Wi-Fi, Bluetooth, 4G and 5G all use radio. MICROWAVE links are high-frequency radio focused into a narrow beam between two dish antennas that must see each other (LINE OF SIGHT); mobile operators use them to link cell towers on hilltops and rooftops where laying fibre would be slow or costly, and satellites use microwave frequencies too. INFRARED uses invisible light: very short range, blocked by walls, and it needs line of sight; your TV remote is the familiar example. Wireless media are convenient and quick to deploy, but they are SHARED (everyone nearby uses the same airwaves), affected by distance, walls and interference, and anyone in range can receive the signal, which is why wireless security (Module 6) matters so much.",
        decision: dec(
          "A mobile operator needs to connect a new cell tower on a hilltop to another tower 15 km away across a valley, quickly and without digging.",
          "Which wireless medium suits this?",
          ["A point-to-point microwave link between dish antennas with line of sight", "Microwave carries high capacity over long line-of-sight distances without any trenching."],
          [
            ["Infrared", "Infrared works only over a few metres."],
            ["Bluetooth", "Bluetooth is a personal-area radio with a range of metres."],
            ["Ordinary home Wi-Fi", "Wi-Fi is designed for tens of metres indoors, not 15 km links."],
          ]
        ),
      },
      {
        id: "a-nw-wired-vs-wireless",
        title: "Wired versus wireless networking",
        explain:
          "Most networks mix both, and the choice is about trade-offs. WIRED connections are faster for the same money, more consistent (no interference from neighbours), lower in latency, and more secure, because an attacker must physically plug in. They suit desktops, servers, printers, access points themselves, and anything that never moves. WIRELESS connections give MOBILITY (laptops, phones, tablets), are cheaper and quicker to install in places where running cable is hard (old buildings, temporary sites), and scale easily to many users. But wireless bandwidth is SHARED among everyone on the same channel, the signal weakens with distance and walls, and it must be secured with strong encryption. Network designers usually cable everything that does not move and add Wi-Fi for the people who do.",
        table: {
          caption: "Wired versus wireless.",
          headers: ["", "Wired", "Wireless"],
          rows: [
            ["Speed and consistency", "High and steady", "Shared, varies with distance and interference"],
            ["Latency", "Low", "Higher and more variable"],
            ["Security", "Attacker needs physical access", "Anyone in range can receive the signal"],
            ["Mobility", "None", "Full"],
            ["Installation", "Cabling work", "Quick; place access points"],
          ],
        },
        decision: dec(
          "A small video-editing studio moves huge files between three editing workstations and a storage server all day. None of the machines ever moves.",
          "How should these machines connect?",
          ["Wired Ethernet: faster, steadier and lower latency for fixed machines moving large files", "Fixed, bandwidth-hungry machines are the textbook case for cable."],
          [
            ["Wi-Fi, because it is more modern", "Newer does not mean better for this job; shared wireless bandwidth would slow every transfer."],
            ["Bluetooth", "Bluetooth is far too slow and short-range."],
            ["Infrared", "Infrared is for remote controls, not file transfer."],
          ]
        ),
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 3 · 2.7 – 2.8
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "nw-mo3-performance",
    moduleId: M,
    sectionId: SECTION_ID,
    order: 3,
    covers: ["2.7", "2.8"],
    title: "Bandwidth, Throughput, Latency and Switching",
    subtitle: "How much, how fast, how long, and how the path is shared",
    estimatedMinutes: 40,
    intro:
      "'The network is slow' can mean three completely different things. This lesson separates them, measures one of them on a real Linux computer, and then looks at the two ways networks share their paths.",

    atoms: [
      {
        id: "a-nw-bandwidth",
        title: "Bandwidth, and bits versus bytes",
        explain:
          "BANDWIDTH is the maximum amount of data a link can carry per second: its capacity, like the number of lanes on a road. It is measured in BITS per second: kbps (thousand), Mbps (million) and Gbps (billion bits per second). A home fibre plan might be 50 Mbps; an office switch port is usually 1 Gbps. File sizes, however, are measured in BYTES: KB, MB and GB. One byte is 8 bits, so to estimate how long a download takes you must convert. The method: file size in megabytes × 8 = megabits; megabits ÷ link speed in Mbps = seconds. A 100 MB file on a 50 Mbps line is 100 × 8 = 800 megabits, and 800 ÷ 50 = 16 seconds at best. (In practice a little longer, as the next atom explains.) Watch the letter case when you read advertisements: a lowercase b means bits, an uppercase B means bytes. Work these out by hand.",
        netCalc: {
          task: "Convert between bits and bytes, then estimate the best-case transfer time: megabytes × 8 ÷ Mbps = seconds.",
          questions: [
            { q: "How many bits are in one byte?", answer: "8", hint: "A byte is the eight bits that store one letter.", working: "1 byte = 8 bits" },
            { q: "A 25 MB file is sent over a 10 Mbps link. How many seconds does it take at best?", answer: "20", check: { fn: "transferSeconds", arg: "25 10" }, hint: "25 MB × 8 = 200 megabits. Then divide by 10.", working: "25 × 8 = 200 megabits\n200 ÷ 10 = 20 seconds" },
            { q: "A 1,000 MB (1 GB) backup is copied over a 100 Mbps office link. How many seconds at best?", answer: "80", check: { fn: "transferSeconds", arg: "1000 100" }, hint: "1,000 × 8 = 8,000 megabits, then divide by 100.", working: "1000 × 8 = 8000 megabits\n8000 ÷ 100 = 80 seconds" },
            { q: "The same 1,000 MB backup over a 1 Gbps (1,000 Mbps) link: how many seconds?", answer: "8", check: { fn: "transferSeconds", arg: "1000 1000" }, hint: "8,000 megabits ÷ 1,000 Mbps.", working: "1000 × 8 = 8000 megabits\n8000 ÷ 1000 = 8 seconds" },
          ],
          successMessage: "Multiply by 8, divide by the speed. Now you can tell whether a slow download is the line's limit or something else.",
        },
      },
      {
        id: "a-nw-throughput-latency",
        title: "Throughput and latency, measured with ping",
        explain:
          "THROUGHPUT is how much data ACTUALLY gets through per second, which is always less than the bandwidth: protocol overhead, sharing the link with others, congestion and retransmissions all eat into it (a 100 Mbps link might deliver 85 Mbps of file data). LATENCY is DELAY: how long one piece of data takes to travel from sender to receiver, measured in milliseconds (ms). It comes from distance (light in fibre takes about 5 ms per 1,000 km), from each device on the path, and from waiting in queues. Latency matters most for interactive things: video calls, online games, and every click on a website. You measure it with PING, which you used in NetLab: it reports the ROUND-TRIP TIME (RTT), there and back. You will now use a real computer. Below is a recorded TERMINAL from an Ubuntu Linux machine in our lab: you type a command after the prompt (learner@ubuntu-lab:~$) and press Enter. On Linux, ping keeps going until you stop it, so you add -c 4 (count 4) to send exactly four: ping -c 4 srv01 tests a server in the same room, and ping -c 4 8.8.8.8 tests a server on the internet (Google's public DNS service). Compare the time= values.",
        terminalExercise: term("m2-ping-latency", {
          goal: "Measure the round-trip latency from this lab computer to the internet server 8.8.8.8, sending exactly four pings. Then compare it with the local server srv01.",
          accept: ["ping -c 4 8.8.8.8"],
          near: [
            { command: "ping -c 4 srv01", why: "That measures the server in the same room, a fraction of a millisecond away. The goal is the internet server, 8.8.8.8. Compare the two afterwards." },
          ],
          hint: "The command is ping -c 4 followed by the address of the internet server.",
          success: "Tens of milliseconds to the internet against a fraction of a millisecond across the room: distance and every router on the way add latency. Note how the four times vary too; that variation is called jitter (Module 9).",
        }),
      },
      {
        id: "a-nw-packet-circuit",
        title: "Packet switching versus circuit switching",
        explain:
          "There are two ways to share a network's paths. CIRCUIT SWITCHING, used by the old telephone network, sets up a dedicated path between the two ends for the whole conversation. The capacity is reserved even during silence, quality is steady, but the circuit is wasted when nobody speaks, and if any link on the path fails, the call drops. PACKET SWITCHING, used by the internet, chops data into small PACKETS, each carrying the destination address. Packets from many users share every link, each is forwarded independently, and they may even take different routes and be reassembled at the destination. Links are used efficiently and the network routes around failures, but packets can be delayed, arrive out of order, or be lost when links are busy, so protocols (Module 4) must handle that. Today even phone calls travel as packets (Voice over IP, WhatsApp calls, 4G and 5G voice).",
        table: {
          caption: "Two ways to share a network.",
          headers: ["", "Circuit switching", "Packet switching"],
          rows: [
            ["Path", "Dedicated for the whole session", "Shared; each packet forwarded separately"],
            ["Capacity", "Reserved, even when idle", "Used only when there is data"],
            ["If a link fails", "The session drops", "Packets are routed around it"],
            ["Delay", "Steady", "Varies with traffic"],
            ["Example", "Traditional landline telephone", "The internet, VoIP, video streaming"],
          ],
        },
        decision: dec(
          "During a busy evening, a video stream briefly stutters, then recovers, while a phone call over a traditional landline next door stays perfectly steady.",
          "What explains the difference?",
          ["The stream uses packet switching, sharing links with other users, while the landline call holds a dedicated circuit", "Shared links mean variable delay at busy times; a reserved circuit does not vary."],
          [
            ["The landline uses fibre and the stream uses copper", "The medium is not the point; how capacity is shared is."],
            ["Packet switching reserves capacity, so it should never stutter", "It is circuit switching that reserves capacity."],
            ["Circuit switching is used by the internet", "The internet is packet switched."],
          ]
        ),
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 4 · 2.9 – 2.11
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "nw-mo4-osi",
    moduleId: M,
    sectionId: SECTION_ID,
    order: 4,
    covers: ["2.9", "2.10", "2.11"],
    title: "Protocols and the OSI Model",
    subtitle: "Agreed rules, and the seven layers they are organised into",
    estimatedMinutes: 45,
    intro:
      "Hundreds of protocols cooperate every time you open a web page. The OSI model sorts them into seven layers, each with one job. It is the shared vocabulary of every network engineer: 'it's a Layer 1 problem' tells a colleague to check the cable.",

    atoms: [
      {
        id: "a-nw-protocols",
        title: "Understanding network protocols",
        explain:
          "A PROTOCOL is a set of rules that defines how devices communicate: the FORMAT of the messages (which bits mean what), the ORDER of the exchange (who speaks first, what reply is expected), the TIMING (how long to wait before giving up), and what to do about ERRORS. Protocols are published as STANDARDS so that equipment from different makers works together: a Samsung phone and a Cisco router have never met, but both follow the same Wi-Fi and IP standards. The main standards bodies: the IEEE writes the standards for Ethernet (802.3) and Wi-Fi (802.11); the IETF writes the internet's protocols as numbered documents called RFCs (Requests for Comments): IP is RFC 791, TCP is RFC 9293; the ITU covers telecommunications; and ISO wrote the OSI model you meet next. You will learn many protocols by name in this course: IP, TCP, UDP, HTTP, DNS, DHCP, ARP, ICMP and more. Each solves one part of the communication problem.",
        decision: dec(
          "A Nigerian start-up builds a smart door lock using its own invented wireless format instead of Wi-Fi or Bluetooth. Customers complain it works with nothing else they own.",
          "What is the root cause?",
          ["It ignores published standard protocols, so other makers' devices do not follow the same rules", "Standards exist precisely so devices from different manufacturers can talk."],
          [
            ["Its radio is too weak", "Signal strength is not the issue; the rules are."],
            ["Wireless locks are illegal", "They are not; the problem is interoperability."],
            ["The customers need faster internet", "No amount of speed helps if the devices do not share a protocol."],
          ]
        ),
      },
      {
        id: "a-nw-osi-layers",
        title: "The OSI reference model: seven layers",
        explain:
          "The OSI (Open Systems Interconnection) model, published by ISO in 1984, divides network communication into SEVEN LAYERS, numbered from the bottom. Layer 1 PHYSICAL, Layer 2 DATA LINK, Layer 3 NETWORK, Layer 4 TRANSPORT, Layer 5 SESSION, Layer 6 PRESENTATION, Layer 7 APPLICATION. Each layer provides a service to the layer above it and uses the service of the layer below, so each can be designed and changed independently: you can swap copper for fibre (Layer 1) without touching your web browser (Layer 7). A memory aid from the bottom up: 'Please Do Not Throw Sausage Pizza Away' (Physical, Data link, Network, Transport, Session, Presentation, Application), or from the top down: 'All People Seem To Need Data Processing'. The real internet runs on the simpler TCP/IP model (Lesson 5), but engineers still describe problems and devices by OSI layer number, so you must know the numbers by heart.",
        table: {
          caption: "The seven OSI layers, from the top.",
          headers: ["Layer", "Name", "One-line job"],
          rows: [
            ["7", "Application", "The network services applications use (web, email, file transfer)"],
            ["6", "Presentation", "Format, encryption and compression of data"],
            ["5", "Session", "Opening, managing and closing conversations"],
            ["4", "Transport", "End-to-end delivery between applications, reliability, ports"],
            ["3", "Network", "Logical (IP) addressing and routing between networks"],
            ["2", "Data link", "Delivery on the local link using MAC addresses; frames"],
            ["1", "Physical", "Bits as signals on the medium: cables, connectors, radio"],
          ],
        },
        netCalc: {
          task: "Recall the layers. Type the layer NUMBER or NAME each question asks for.",
          questions: [
            { q: "What is the number of the Transport layer?", answer: "4", hint: "Count up from Physical (1): Physical, Data link, Network, Transport.", working: "1 Physical, 2 Data link, 3 Network, 4 Transport" },
            { q: "What is the name of Layer 3?", answer: "Network", accept: ["network layer"], hint: "The layer of IP addresses and routers.", working: "Layer 3 = Network" },
            { q: "What is the name of Layer 2?", answer: "Data link", accept: ["datalink", "data-link", "data link layer"], hint: "The layer of MAC addresses and switches.", working: "Layer 2 = Data link" },
            { q: "What is the number of the Presentation layer?", answer: "6", hint: "It sits just below Application (7).", working: "7 Application, 6 Presentation" },
            { q: "What is the name of Layer 1?", answer: "Physical", accept: ["physical layer"], hint: "Cables, connectors and signals.", working: "Layer 1 = Physical" },
          ],
          successMessage: "Seven layers, numbered from the cable up. You will hear 'Layer 2' and 'Layer 3' every day in networking.",
        },
      },
      {
        id: "a-nw-osi-functions",
        title: "What each OSI layer is responsible for",
        explain:
          "LAYER 1, PHYSICAL: turns bits into signals and back; defines cables, connectors, voltages, light and radio. Devices: cables, hubs, repeaters, NICs' transceivers. LAYER 2, DATA LINK: delivers FRAMES between devices on the same local network, using MAC ADDRESSES, and detects corrupted frames with a checksum. Devices: SWITCHES and NICs. Ethernet and Wi-Fi live here (and also at Layer 1). LAYER 3, NETWORK: gives every device a logical IP ADDRESS and chooses paths between networks (ROUTING). Devices: ROUTERS. LAYER 4, TRANSPORT: delivers data between the right APPLICATIONS on the two hosts, using PORT numbers; TCP adds reliability (resending lost data), UDP does not. LAYER 5, SESSION: sets up, maintains and ends the conversations between applications. LAYER 6, PRESENTATION: translates data into a common format, and handles ENCRYPTION (such as TLS) and compression. LAYER 7, APPLICATION: the protocols applications use directly: HTTP for the web, SMTP for email, DNS for names. Troubleshooters often work BOTTOM-UP: is the cable connected (1), is the link up (2), is the address right (3)?",
        decision: dec(
          "A PC's cable light is on and the switch shows its port up, but the PC was given an address from a different network than the router, so it cannot reach anything beyond its switch.",
          "At which OSI layer is the fault?",
          ["Layer 3, Network: the IP addressing is wrong", "Physical (1) and data link (2) are working; logical addressing and routing are Layer 3."],
          [
            ["Layer 1, Physical", "The cable and link lights are fine."],
            ["Layer 2, Data link", "The switch port is up and frames are moving locally."],
            ["Layer 7, Application", "No application can work until addressing is fixed, but the fault itself is at Layer 3."],
          ]
        ),
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 5 · 2.12 – 2.15
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "nw-mo5-encapsulation",
    moduleId: M,
    sectionId: SECTION_ID,
    order: 5,
    covers: ["2.12", "2.13", "2.14", "2.15"],
    title: "Encapsulation and the TCP/IP Model",
    subtitle: "How each layer wraps the data, and the model the internet actually runs",
    estimatedMinutes: 40,
    intro:
      "When you send a message, each layer adds its own label to the data before passing it down, like envelopes inside envelopes. Understanding this wrapping, and the four-layer TCP/IP model the internet is built on, is what lets you read a packet capture in the next lesson.",

    atoms: [
      {
        id: "a-nw-encapsulation",
        title: "Data encapsulation and decapsulation",
        explain:
          "ENCAPSULATION is what happens on the way DOWN the layers at the sender: each layer takes what the layer above gave it and adds its own HEADER, a small block of control information, in front of it. The application's data gets a Transport header (with port numbers) and becomes a SEGMENT. That gets a Network header (with the source and destination IP addresses) and becomes a PACKET. That gets a Data Link header (with source and destination MAC addresses) plus a TRAILER at the end (a checksum called the FCS) and becomes a FRAME. The Physical layer sends the frame as BITS. At the receiver, DECAPSULATION happens on the way UP: each layer reads and removes its own header, checks it, and passes the rest upward, until the application receives the original data. Routers along the way decapsulate only up to Layer 3 (to read the IP address) and re-encapsulate with a new Layer 2 header for the next link.",
        analogy:
          "A letter (the data) goes into an envelope addressed to a person's department (transport), which goes into an envelope with the company's street address (network), which goes into a courier's bag with a tracking label for this one van trip (data link). Each envelope is opened only by the one who needs it.",
        decision: dec(
          "A packet travels from a PC through two routers to a web server.",
          "Which header is replaced at each router, while the IP addresses stay the same?",
          ["The Layer 2 (data link) header with the MAC addresses, because each link has its own local addresses", "Routers read the IP header to choose the next hop, then build a new frame for the next link."],
          [
            ["The Layer 3 header, so the IP addresses change at every router", "The source and destination IP addresses stay the same end to end (NAT, in Module 4, is the exception)."],
            ["The application data", "Routers never change the application's data."],
            ["Nothing is replaced; the frame passes through unchanged", "Each link needs a new Layer 2 header with that link's MAC addresses."],
          ]
        ),
      },
      {
        id: "a-nw-tcpip-model",
        title: "The TCP/IP model",
        explain:
          "The TCP/IP model is the model the internet is actually built on, developed with the protocols themselves in the 1970s. It has FOUR layers. APPLICATION: everything the application needs, including formatting, encryption and sessions: HTTP, HTTPS, DNS, SMTP, SSH, DHCP. TRANSPORT: end-to-end delivery between applications using ports: TCP and UDP. INTERNET: logical addressing and routing: IP, plus ICMP (which ping uses). NETWORK ACCESS (also called Link): getting frames onto the local medium: Ethernet, Wi-Fi, ARP and the physical cable or radio. Some books split the bottom layer into Data Link and Physical and show five layers; the idea is identical. The OSI model is the vocabulary and the teaching tool; TCP/IP is what runs. You will use both: 'TCP is a Transport-layer protocol' is true in either model.",
        table: {
          caption: "The four TCP/IP layers and the protocols at each.",
          headers: ["TCP/IP layer", "Job", "Protocols"],
          rows: [
            ["Application", "Services for applications, formatting, encryption, sessions", "HTTP, HTTPS, DNS, DHCP, SMTP, IMAP, SSH, FTP"],
            ["Transport", "Delivery between applications, ports, reliability", "TCP, UDP"],
            ["Internet", "IP addressing and routing between networks", "IPv4, IPv6, ICMP"],
            ["Network access", "Frames on the local link, the physical medium", "Ethernet, Wi-Fi (802.11), ARP"],
          ],
        },
        decision: dec(
          "A developer says the internet uses the OSI model's seven layers in every device, with a separate Session and Presentation protocol in every packet.",
          "What is the accurate picture?",
          ["The internet runs on the TCP/IP model, whose Application layer covers OSI's Session, Presentation and Application jobs", "OSI is the reference vocabulary; real protocols follow TCP/IP's four layers."],
          [
            ["Correct: every packet carries seven separate headers", "There are no separate Session and Presentation headers in a normal internet packet."],
            ["The internet uses only two layers", "TCP/IP has four (or five, when the bottom layer is split)."],
            ["TCP/IP was replaced by OSI in 1984", "It is the other way round in practice: OSI became the teaching model while TCP/IP ran the internet."],
          ]
        ),
      },
      {
        id: "a-nw-osi-tcpip-mapping",
        title: "Mapping the OSI model to the TCP/IP model",
        explain:
          "The two models line up neatly. OSI's top three layers, APPLICATION (7), PRESENTATION (6) and SESSION (5), together form TCP/IP's APPLICATION layer. OSI's TRANSPORT (4) is TCP/IP's TRANSPORT. OSI's NETWORK (3) is TCP/IP's INTERNET layer. OSI's DATA LINK (2) and PHYSICAL (1) together form TCP/IP's NETWORK ACCESS layer. So when someone says 'Layer 3', they mean IP and routers in either model; 'Layer 2' means MAC addresses and switches; 'Layer 4' means TCP and UDP; and 'Layer 7' means the application protocols. Type the matching layer names below.",
        table: {
          caption: "OSI on the left, TCP/IP on the right.",
          headers: ["OSI layer", "TCP/IP layer"],
          rows: [
            ["7 Application, 6 Presentation, 5 Session", "Application"],
            ["4 Transport", "Transport"],
            ["3 Network", "Internet"],
            ["2 Data link, 1 Physical", "Network access"],
          ],
        },
        netCalc: {
          task: "Map between the models. Type the name of the layer each question asks for.",
          questions: [
            { q: "Which TCP/IP layer covers OSI layers 5, 6 and 7?", answer: "Application", accept: ["application layer"], hint: "The top TCP/IP layer does everything applications need.", working: "OSI 5 + 6 + 7 = TCP/IP Application" },
            { q: "Which TCP/IP layer matches OSI Layer 3 (Network)?", answer: "Internet", accept: ["internet layer"], hint: "It is named after the protocol that works there: the Internet Protocol.", working: "OSI 3 Network = TCP/IP Internet" },
            { q: "Which TCP/IP layer covers OSI layers 1 and 2?", answer: "Network access", accept: ["network access layer", "link", "link layer", "network interface"], hint: "Getting frames onto the local medium.", working: "OSI 1 + 2 = TCP/IP Network access (Link)" },
            { q: "At which TCP/IP layer does TCP itself work?", answer: "Transport", accept: ["transport layer"], hint: "Its name is in the protocol's: Transmission Control.", working: "TCP and UDP = Transport (OSI 4)" },
          ],
          successMessage: "Two models, one picture. From here on 'Layer 3' and 'the Internet layer' mean the same thing to you.",
        },
      },
      {
        id: "a-nw-pdus",
        title: "Frames, packets, segments and bits",
        explain:
          "The block of data at each layer has its own name, called its PDU (protocol data unit), and using the right name tells a colleague exactly which layer you mean. At the TRANSPORT layer it is a SEGMENT (for TCP; with UDP it is called a DATAGRAM). At the NETWORK layer it is a PACKET. At the DATA LINK layer it is a FRAME. At the PHYSICAL layer it is BITS. Above the transport layer it is simply DATA. Each PDU contains the one above it as its PAYLOAD. A typical Ethernet frame is at most 1,518 bytes; the largest packet it can carry inside is 1,500 bytes, a limit called the MTU (maximum transmission unit). So when someone says 'the switch forwards frames' and 'the router forwards packets', they are being precise: the switch works with Layer 2 frames and MAC addresses; the router with Layer 3 packets and IP addresses.",
        table: {
          caption: "The name of the data at each layer.",
          headers: ["Layer", "PDU name", "Addresses in its header"],
          rows: [
            ["Application", "Data", "None (names like a website address)"],
            ["Transport (4)", "Segment (TCP) or datagram (UDP)", "Port numbers"],
            ["Network (3)", "Packet", "Source and destination IP addresses"],
            ["Data link (2)", "Frame", "Source and destination MAC addresses"],
            ["Physical (1)", "Bits", "None"],
          ],
        },
        decision: dec(
          "A senior engineer says: 'The switch dropped it because the checksum in the trailer was bad.'",
          "Which PDU was dropped?",
          ["A frame: only the Layer 2 frame has a trailer with a checksum (the FCS)", "Switches work with frames, and the frame trailer carries the error check."],
          [
            ["A segment", "Segments are Layer 4; switches do not examine them."],
            ["A packet", "Packets have headers but no trailer; switches forward frames, not packets."],
            ["Bits", "Bits have no header, trailer or checksum of their own."],
          ]
        ),
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 6 · 2.P
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "nw-mo6-practical",
    moduleId: M,
    sectionId: SECTION_ID,
    order: 6,
    covers: ["2.P"],
    title: "Practical: Watching Real Traffic",
    subtitle: "A website visit, layer by layer, read the way Wireshark shows it",
    estimatedMinutes: 50,
    intro:
      "Time to see the models in real packets. We recorded the traffic from a real Ubuntu computer opening a web page on a server in our lab. You will read it the way network engineers do, in a packet capture, and find the packets that answer real questions.",

    atoms: [
      {
        id: "a-nw-trace-website",
        title: "What happens when you open a website",
        explain:
          "When you type a web address and press Enter, four things happen in order. 1. NAME LOOKUP (DNS, Application layer): your computer asks a DNS server for the address of the name, for example 'what is the IP address of intranet.lab?', and gets back an IP address. 2. FINDING THE NEXT DEVICE (ARP, Network access layer): your computer needs the MAC address of the next device on its own network (the server, if it is local, or the router). It may already know it. 3. OPENING A CONNECTION (TCP, Transport layer): your computer and the server exchange three small messages to agree to talk (Module 4 calls it the three-way handshake). 4. THE REQUEST AND RESPONSE (HTTP, Application layer): your computer sends 'GET /' (please send the main page) and the server replies '200 OK' with the page. Then the connection is closed. Every step is encapsulated down the layers at the sender and decapsulated at the receiver. Below is the real capture of exactly this, recorded when our lab computer (192.168.56.10) fetched http://intranet.lab/ from the server (192.168.56.20). Each row is one packet: its number, the time in seconds since the capture started, the source and destination addresses, the highest protocol Wireshark recognised, its length in bytes, and a summary in the Info column. Read it top to bottom before answering.",
        capture: { title: "A website visit, recorded", packets: cap("m2-web-visit") },
        decision: dec(
          "Look at the capture. Packets 1 to 4 are DNS, packets 5 to 7 are TCP, and packet 8 is the HTTP GET.",
          "Why must the DNS packets come first?",
          ["The computer cannot open a connection until it knows the server's IP address, and DNS is what turns the name into that address", "Name first, then connection, then request: each step needs the result of the one before."],
          [
            ["DNS is always faster, so it goes first", "The order is about dependency, not speed."],
            ["The server asks for DNS before it will reply", "It is the client that needs the address."],
            ["HTTP needs DNS to encrypt the page", "DNS does not encrypt anything; it translates names to addresses."],
          ]
        ),
      },
      {
        id: "a-nw-meet-wireshark",
        title: "Wireshark and display filters",
        explain:
          "WIRESHARK is the free, standard tool for capturing and reading network traffic; tcpdump and tshark are its command-line cousins. Install it on your own computer from wireshark.org, and capture only on networks you own or have permission to monitor. A real capture holds thousands of packets, so the core skill is the DISPLAY FILTER: an expression typed into the filter bar that hides every packet that does not match. The capture panel below accepts the same spelling as the real Wireshark. Type a protocol name to keep only that protocol: dns, http, tcp, udp, arp or icmp. Type ip.addr == followed by an address to keep packets to or from it, for example ip.addr == 192.168.56.20; use ip.src == or ip.dst == for one direction only. Type tcp.port == 80 to keep traffic on a port. Join two conditions with && (and) or || (or): dns && ip.src == 192.168.56.20 keeps only DNS packets the server sent. Press Apply to filter, then click a row to select it. Try it: find the DNS packet that actually carries the answer to the question 'what is the address of intranet.lab?'.",
        captureExercise: {
          task: "Filter the capture down to DNS only, then click the packet in which the DNS server gives the computer the IP address of intranet.lab.",
          packets: cap("m2-web-visit"),
          expect: {
            maxRows: 4,
            packet: 3,
            mustContain: [3],
            whyWrong: "Look at the Info column. A query is the question; a 'query response' is the answer. Of the two responses, only one contains an A record with an IPv4 address; the other says 'No such name' for the IPv6 (AAAA) question.",
            success: "Packet 3: 'Standard query response … A intranet.lab A 192.168.56.20'. The A record is the IPv4 address. Packet 4 answers the separate IPv6 question (AAAA), and this lab server has no IPv6 address, so it says 'No such name'.",
          },
          hint: "Type dns in the filter box and press Apply. Then read the Info column of the four rows that remain.",
        },
      },
      {
        id: "a-nw-find-http",
        title: "Finding the request inside the encapsulation",
        explain:
          "Every row in the capture is a FRAME that left or reached the computer's network card, and each is encapsulated exactly as Lesson 5 described. The Protocol column shows the HIGHEST layer Wireshark could decode: a row labelled HTTP is still a frame (Layer 2) carrying a packet (Layer 3, the IP addresses in the Source and Destination columns) carrying a TCP segment (Layer 4, the port numbers) carrying the HTTP request (Layer 7). Look at the lengths: the TCP packets that carry no data are 66 bytes, which is just the headers (14 bytes of Ethernet, 20 of IP and 32 of TCP with its options), while the packet carrying 'GET / HTTP/1.1' is longer because the HTTP request rides inside. Note the ports, too: the server listens on port 80, the standard port for web traffic, and the computer uses a random high-numbered port for its side. Now find the request itself.",
        captureExercise: {
          task: "Filter the capture to the web protocol only, then click the packet in which the computer asks the server for the page.",
          packets: cap("m2-web-visit"),
          expect: {
            maxRows: 2,
            packet: 8,
            mustContain: [8],
            whyWrong: "Of the two HTTP rows, one is the request (GET, from the computer 192.168.56.10) and one is the response (200 OK, from the server). You want the request.",
            success: "Packet 8: 'GET / HTTP/1.1' from 192.168.56.10 port 33948 to 192.168.56.20 port 80. Ethernet frame, IP packet, TCP segment, HTTP request: four layers in one row.",
          },
          hint: "The web protocol's filter is http. After Apply, two rows remain: one asks, one answers.",
        },
      },
      {
        id: "a-nw-email-layers",
        title: "Placing an email in the OSI layers",
        explain:
          "Follow one email from your laptop to a friend. At Layer 7, your email app uses SMTP (Simple Mail Transfer Protocol) to hand the message to your mail server. At Layer 6, the connection is encrypted with TLS so nobody on the path can read it, and the attachment is encoded in a standard format. At Layer 5, a session is set up and kept open while the message is sent. At Layer 4, TCP splits the message into segments addressed to the mail server's port (587 for sending mail) and makes sure every segment arrives, resending any that are lost. At Layer 3, each segment is put in an IP packet with your laptop's address and the mail server's address, and routers forward it across the internet. At Layer 2, each packet is put in a Wi-Fi frame to your access point, then in Ethernet frames on each wired link. At Layer 1, the frames become radio waves, electrical signals and light pulses. At the mail server everything is unwrapped in reverse, and later your friend's app collects the email with IMAP, travelling down and up the layers again.",
        decision: dec(
          "Halfway across the internet, a router receives one of the packets carrying your email.",
          "Up to which OSI layer does the router examine it, and why?",
          ["Layer 3: it reads the destination IP address to decide where to forward the packet; it does not need the TCP segment or the email inside", "Routers are Layer 3 devices: decapsulate to the IP header, decide, re-encapsulate for the next link."],
          [
            ["Layer 7: it reads the email to check for spam", "Ordinary routers never read application data."],
            ["Layer 1 only: it just repeats the signal", "That is a hub or repeater; a router must read addresses to route."],
            ["Layer 4: it checks the port is 587", "Plain routing decisions use the IP header; ports are a firewall's business (Module 8)."],
          ]
        ),
      },
    ],

    requirements: { read: true, video: false, assessment: true },

    task: {
      title: "Module 2 practical: tracing traffic through the layers",
      intro:
        "Install Wireshark (wireshark.org) on your own computer, and capture only on your own network. Keep notes for each exercise: you will reuse them in Module 4.",
      prompts: [
        "Open a website you use (for example a news site) while Wireshark captures. Use the filter dns to find the lookup for its name, then write down the address it resolved to.",
        "Describe, step by step and layer by layer, what happens from pressing Enter in the browser to the page appearing.",
        "Send an email and list the OSI layers involved in sending it, naming one protocol or device at each layer.",
        "In your capture, click one TCP packet and expand its details pane. Identify the Ethernet, IP and TCP headers and write down the MAC addresses, IP addresses and port numbers it contains.",
        "Measure latency with ping to a server in your country and to one on another continent. Explain the difference.",
      ],
      closing:
        "Every packet you looked at carried two IP addresses. Module 3 takes those addresses apart: binary, masks, networks and subnets.",
    },
  },
];
