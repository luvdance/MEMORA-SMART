/**
 * COMPUTER NETWORKING · MODULE 1 · INTRODUCTION TO COMPUTER NETWORKING
 *
 * Curriculum 1.1 – 1.10 and the practical. What a network is and why it
 * exists, where it came from, the devices it is built from, the kinds of
 * network from PAN to WAN, topologies, client-server and peer-to-peer, and
 * where networks are used.
 *
 * The learner touches a working network in the very first lesson: NetLab
 * labs are graded by whether the packets really get through, and their model
 * answers live in lib/academy/network/solutions.mjs.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

import { dec } from "./nw-kit.js";

export const SECTION_ID = "nw-s1-intro";
const M = "nw-m1-intro";

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 1 · 1.1 – 1.3
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "nw-l1-what-is-a-network",
    moduleId: M,
    sectionId: SECTION_ID,
    order: 1,
    covers: ["1.1", "1.2", "1.3"],
    title: "What Is a Computer Network?",
    subtitle: "Two computers, one cable, and the reason the internet exists",
    estimatedMinutes: 30,
    intro:
      "A network is the simplest idea in computing that has ever been scaled up: two devices agree how to send each other data. By the end of this lesson you will have built one and sent your first packet across it.",

    atoms: [
      {
        id: "a-nw-what-is-networking",
        title: "What is computer networking?",
        explain:
          "A COMPUTER NETWORK is two or more devices connected so they can exchange data and share resources. The devices are called NODES (or hosts): laptops, phones, servers, printers, cameras, smart TVs. The connection is a MEDIUM: a copper cable, a strand of glass fibre, or radio waves. And both sides follow the same PROTOCOLS: agreed rules for how a message is formatted, addressed, sent and acknowledged. Remove any one of the three (nodes, medium, protocols) and there is no network. A phone and a laptop on the same Wi-Fi with no shared protocol are just two radios. Networking, as a discipline, is designing, building, securing and running those connections.",
        analogy:
          "A postal system. Houses are the nodes, roads and vans are the medium, and the address format plus the rules for stamps and delivery are the protocols. Mail only arrives because everyone follows the same rules.",
        decision: dec(
          "A teacher's laptop and a classroom projector are both switched on in the same room. The laptop has Wi-Fi turned on; the projector has no network port and no wireless adapter.",
          "Can these two devices form a network as they are?",
          ["No: the projector has no way to connect to any medium, so they cannot exchange data", "A network needs nodes, a shared medium and shared protocols. Being in the same room is none of those."],
          [
            ["Yes, because they are in the same room", "Physical closeness is not a connection. Data needs a medium: a cable or a radio both sides have."],
            ["Yes, because the laptop's Wi-Fi is on", "Wi-Fi on one side only is a radio talking to nobody. The projector has no adapter to receive it."],
            ["Yes, if the laptop is fast enough", "Speed is irrelevant without a connection."],
          ],
          "Plug in an HDMI cable and you have a video connection, not a data network. Give the projector a network adapter and they could be nodes on the same network."
        ),
      },
      {
        id: "a-nw-history",
        title: "History and evolution of computer networks",
        explain:
          "Networks grew in steps, and each step solved the previous one's limit. In the 1960s, computers were huge and shared through TERMINALS wired straight to one machine. In 1969 ARPANET, funded by the US Department of Defense, linked four university computers using PACKET SWITCHING: messages chopped into small packets that could each take any available path, so the network survived a broken link. In 1973 Ethernet was invented at Xerox PARC to connect computers within a building: the beginning of the LAN. On 1 January 1983 ARPANET switched to TCP/IP, the protocol suite the internet still runs on. In 1989–1991 Tim Berners-Lee created the World Wide Web at CERN, which turned the internet into something ordinary people used. Wi-Fi (IEEE 802.11) arrived in 1997, smartphones made networks personal from 2007, and fibre and submarine cables (SAT-3 reached West Africa in 2002; MainOne and Glo-1 landed in Lagos in 2010) brought broadband to the continent. Today cloud data centres, 5G and fibre-to-the-home are the latest steps.",
        table: {
          caption: "Each step fixed the previous one's limit.",
          headers: ["When", "Milestone", "What it solved"],
          rows: [
            ["1960s", "Terminals wired to a mainframe", "Many people sharing one expensive computer"],
            ["1969", "ARPANET, packet switching", "A network that survives a broken link"],
            ["1973", "Ethernet at Xerox PARC", "Connecting many computers in one building (LAN)"],
            ["1983", "ARPANET adopts TCP/IP", "One common language between different networks"],
            ["1989–91", "The World Wide Web", "Easy access to information for everyone"],
            ["1997", "Wi-Fi (IEEE 802.11)", "Networking without cables"],
            ["2000s–2010s", "Broadband, submarine cables, smartphones", "Fast, mobile internet, including across Africa"],
            ["Today", "Cloud, fibre to the home, 5G", "Computing as a service, available everywhere"],
          ],
        },
        decision: dec(
          "Planners in 1969 wanted a network that kept working even if part of it was destroyed.",
          "Which idea, first used on ARPANET, delivers that?",
          ["Packet switching: messages are split into packets that can each take any working path", "If one link breaks, the packets simply route around it."],
          [
            ["Wi-Fi", "Wi-Fi arrived in 1997 and is about the medium, not survivability."],
            ["A single very strong cable", "One cable is a single point of failure, the opposite of the goal."],
            ["The World Wide Web", "The Web came twenty years later and runs on top of the network."],
          ],
          "Packet switching is still how the internet works, and Module 2 compares it with the circuit switching of old telephone networks."
        ),
      },
      {
        id: "a-nw-meet-netlab",
        title: "Meet NetLab: the network simulator you will use all course",
        explain:
          "Throughout this course you will practise on NetLab, a network simulator that runs in this page. It works like Cisco Packet Tracer, the tool most networking schools use. Each lab shows a DIAGRAM: every box is a device (a PC, a switch, a router, a server) and every line is a cable. A green line is a working link, a red dashed line is a link that is down, and a dotted blue line is a Wi-Fi connection. Below the diagram is a row of device names: click one (or click the device in the diagram) to open its CONSOLE, a black window where you type commands to that device, exactly as an engineer sits at a real one. Type a command and press Enter; the device answers underneath. The Up arrow brings back your last command. Two commands work on every PC in NetLab, and you will use them in almost every lab. ipconfig shows the PC's network settings, including its ADDRESS: a number like 192.168.1.10 that identifies it on the network, much as a phone number identifies a phone. (Module 3 explains what every part of an address means; for now, treat it as the device's number.) ping followed by an address, for example ping 192.168.1.20, sends four small test messages to that address and reports whether replies came back. 'Reply from …' means the two devices can talk; 'Request timed out' means they cannot. Try both now in the network below; nothing here is graded.",
        netDemo: {
          task:
            "PC1's console is already open. Type ipconfig and press Enter to see its address. Then type ping 192.168.1.20 and press Enter to test whether PC1 can reach PC2. Click PC2 and run ipconfig there too.",
          devices: [
            { id: "PC1", kind: "pc", x: 18, y: 30, ip: "192.168.1.10/24" },
            { id: "SW1", kind: "switch", x: 50, y: 14 },
            { id: "PC2", kind: "pc", x: 82, y: 30, ip: "192.168.1.20/24" },
          ],
          links: [["PC1:fa0", "SW1:fa0/1"], ["PC2:fa0", "SW1:fa0/2"]],
          config: { SW1: "hostname SW1" },
          start: "PC1",
          height: 36,
        },
        decision: dec(
          "You ping a PC from another PC in NetLab and see four lines that say Request timed out.",
          "What does that tell you?",
          ["No replies came back, so the two devices cannot currently talk to each other", "ping sends test messages and waits for replies; a timeout means nothing answered."],
          [
            ["The ping worked, because four lines were printed", "Four lines are printed either way. Reply from means success; Request timed out means failure."],
            ["The simulator is broken", "A timeout is information: something between the two devices, or one of their settings, is stopping the replies."],
            ["The other PC is fine and the network is fast", "No reply means you cannot tell anything good about the other PC yet."],
          ]
        ),
      },
      {
        id: "a-nw-why-networks",
        title: "Why computers need networks",
        explain:
          "A computer on its own can only use what is inside it. Networks let computers SHARE RESOURCES (one printer, one internet connection, one file server for a whole office), SHARE DATA (a hospital's patient records available at every ward), COMMUNICATE (email, messaging, video calls), CENTRALISE management and backup, and reach SERVICES no single machine could run (banking, search, streaming, cloud storage). Every networked exchange needs two things you will meet constantly in this course: an ADDRESS for each device, so data knows where to go, and a PATH between them. In the lab below, two PCs are cabled to a switch. One has an address; the other does not, so it cannot communicate. You will give it one. On a PC, ipconfig followed by an address and a MASK sets the address: ipconfig 192.168.1.11 255.255.255.0. The mask (the second number) tells the PC which addresses are its neighbours on the same network; type it exactly as shown, and Module 3 explains how it works. Then switch to PC1 and ping the new address to prove the network works.",
        netLab: {
          task:
            "PC1 is configured with 192.168.1.10/24. PC2 is cabled to the same switch but has no IP address, so nothing can reach it. Click PC2, give it the address 192.168.1.11 with mask 255.255.255.0, then test the network with ping.",
          devices: [
            { id: "PC1", kind: "pc", x: 18, y: 32, ip: "192.168.1.10/24" },
            { id: "SW1", kind: "switch", x: 50, y: 14 },
            { id: "PC2", kind: "pc", x: 82, y: 32 },
          ],
          links: [["PC1:fa0", "SW1:fa0/1"], ["PC2:fa0", "SW1:fa0/2"]],
          config: { SW1: "hostname SW1" },
          start: "PC2",
          goals: [
            { type: "ip", device: "PC2", iface: "fa0", address: "192.168.1.11/24", label: "PC2 has the address 192.168.1.11/24" },
            { type: "ping", from: "PC1", to: "192.168.1.11", label: "PC1 can ping PC2" },
          ],
          hint: "On PC2 type: ipconfig 192.168.1.11 255.255.255.0 then switch to PC1 and type: ping 192.168.1.11",
          successMessage:
            "That is a network: two nodes, a medium, shared protocols and an address each. Every network in this course, up to the internet itself, is this idea repeated.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 2 · 1.4 – 1.5
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "nw-l2-components",
    moduleId: M,
    sectionId: SECTION_ID,
    order: 2,
    covers: ["1.4", "1.5"],
    title: "What Networks Give You, and What They Are Made Of",
    subtitle: "Advantages, disadvantages and every box on a network diagram",
    estimatedMinutes: 40,
    intro:
      "Every network diagram you will ever read is built from the same handful of devices. Learn what each one does, and which layer of the problem it solves, and you can read any network.",

    atoms: [
      {
        id: "a-nw-pros-cons",
        title: "Advantages and disadvantages of networking",
        explain:
          "ADVANTAGES: resource sharing (one printer and one internet line for fifty staff), data sharing and collaboration, communication, centralised management and backup, scalability (add a user by adding a cable or a Wi-Fi password), and lower cost than giving everyone their own of everything. DISADVANTAGES: security risk (anything connected can be attacked from anything else connected), dependence (when the network or a central server fails, everyone stops), setup and maintenance cost, the need for skilled administration, and performance problems when many users share the same links. A good network engineer does not deny the disadvantages; they design for them with security, redundancy and monitoring, which is exactly what Modules 8 to 10 teach.",
        table: {
          caption: "Every advantage brings a matching risk to manage.",
          headers: ["Advantage", "The matching risk", "How engineers manage it"],
          rows: [
            ["Everything can reach everything", "So can an attacker", "Segmentation, firewalls, access control (Module 8)"],
            ["One central file server", "One point of failure", "Redundancy and backups (Modules 7 and 10)"],
            ["Many users share the links", "Congestion and slowness", "Capacity planning, QoS, monitoring (Modules 9 and 10)"],
            ["Easy to add users", "Hard to keep track of who is connected", "Documentation and authentication (Modules 8 and 9)"],
          ],
        },
        decision: dec(
          "A small accounting firm connects its ten PCs to one file server that holds every client's records. On Monday the server's disk fails and nobody can work all day.",
          "Which disadvantage of networking did the firm run into, and what would have managed it?",
          ["Dependence on a central resource; a backup and a redundant copy would have managed it", "Centralising data is an advantage until the centre fails. Engineers plan for that failure in advance."],
          [
            ["Security risk; a stronger password would have fixed it", "Nothing was attacked. The disk failed."],
            ["Too many users; a faster switch would have fixed it", "Ten users did not cause a disk failure."],
            ["Networking is simply too expensive for small firms", "The network worked as designed; the missing piece was redundancy."],
          ]
        ),
      },
      {
        id: "a-nw-end-devices-nic",
        title: "Computers, servers, NICs, cables and connectors",
        explain:
          "END DEVICES (hosts) are where data starts and ends: PCs, laptops, phones, printers and SERVERS, which are computers that provide a service (files, websites, email, databases) to many CLIENTS. Every host connects through a NETWORK INTERFACE CARD (NIC): the hardware, wired or wireless, that puts data onto the medium. Every NIC has a permanent 48-bit MAC ADDRESS burned in by its manufacturer, written as six pairs of hexadecimal digits such as 00:1A:2B:3C:4D:5E. CABLES carry the signal: twisted-pair copper (Cat5e, Cat6) with RJ-45 connectors for most office and home links, fibre-optic cable with LC or SC connectors for long distances and backbones, and coaxial cable (F-connector) for cable broadband. A laptop's Wi-Fi adapter is also a NIC, with its own MAC address, using radio instead of a cable.",
        table: {
          caption: "The physical pieces of a network connection.",
          headers: ["Component", "What it does", "Where you see it"],
          rows: [
            ["NIC (wired or wireless)", "Connects a device to the medium; owns the MAC address", "Every PC, phone, printer, server"],
            ["Twisted-pair cable + RJ-45", "Copper link up to 100 m", "Desks, wall sockets, switches"],
            ["Fibre-optic cable + LC/SC", "Light over glass; long distance, high speed, immune to interference", "Between buildings, backbones, fibre to the home"],
            ["Coaxial cable + F-connector", "Shielded copper", "Cable TV and cable broadband"],
          ],
        },
        decision: dec(
          "Two office buildings 600 metres apart must be linked, and the cable will run past a generator house full of electrical noise.",
          "Which medium should connect them?",
          ["Fibre-optic cable", "Fibre carries light, so electrical noise cannot affect it, and it runs for kilometres; copper twisted pair stops at 100 m."],
          [
            ["Cat6 twisted pair", "Twisted pair is limited to 100 m and is affected by strong electrical interference."],
            ["Coaxial cable", "Coax is used for cable broadband, not for linking office networks across 600 m."],
            ["A longer RJ-45 connector", "The connector does not change the distance limit of the cable."],
          ]
        ),
      },
      {
        id: "a-nw-switch-hub-router",
        title: "Hubs, switches and routers",
        explain:
          "A HUB is the oldest way to join devices: whatever arrives on one port it repeats out of EVERY other port. Every device hears every conversation, only one can talk at a time, and collisions are common, so hubs are obsolete. A SWITCH joins devices in the SAME network intelligently: it learns which MAC address lives on which port and sends each frame only out of the port it needs, so many conversations happen at once. A ROUTER joins DIFFERENT networks: it reads the destination IP address and decides where to forward the packet next, which is how your home network reaches the internet. The short version you must never mix up: switches connect devices WITHIN a network using MAC addresses; routers connect NETWORKS to each other using IP addresses.",
        table: {
          caption: "The three boxes beginners confuse most.",
          headers: ["Device", "Joins", "Decides using", "Sends a frame to"],
          rows: [
            ["Hub", "Devices in one network", "Nothing", "Every other port"],
            ["Switch", "Devices in one network", "MAC addresses", "Only the port of the destination"],
            ["Router", "Different networks", "IP addresses and a routing table", "The next network on the path"],
          ],
        },
        decision: dec(
          "A school has a staff network and a student network. Staff PCs must reach the internet and a staff file server; the two networks must stay separate but connected where allowed.",
          "Which device joins the staff network to the student network and to the internet?",
          ["A router", "Joining different networks, and deciding what goes where between them, is exactly what a router does."],
          [
            ["A hub", "A hub repeats everything everywhere inside one network; it cannot join networks or keep them apart."],
            ["A switch", "A switch connects devices inside one network. Joining networks needs a router (Module 5 shows a switch that can also route)."],
            ["A longer cable", "A cable is a medium; it makes no forwarding decisions."],
          ]
        ),
      },
      {
        id: "a-nw-modem-ap",
        title: "Modems and wireless access points",
        explain:
          "A MODEM (modulator-demodulator) converts between your network's digital signal and the signal your provider's line carries: DSL over a phone line, cable over coax, or, for fibre, a device called an ONT (optical network terminal) that converts light. A WIRELESS ACCESS POINT (AP) is a bridge between radio and cable: wireless devices associate with it using an SSID (the network name) and a passphrase, and it passes their traffic onto the wired network. The 'Wi-Fi router' in most homes is really four devices in one box: a router, a small switch, an access point, and often a modem too. In the lab below those roles are drawn as separate devices so you can see each one: the router hands out addresses with DHCP, the switch joins the wired devices, and the access point brings the laptop in over radio. A laptop in NetLab has three Wi-Fi commands: wifi scan lists the networks it can hear, wifi connect followed by the network name and the passphrase joins one (for example wifi connect Adaeze-Home Lagos2026!), and wifi status shows what it is connected to. Once it joins, the router gives it an address automatically (this service is called DHCP, and Module 4 covers it), which ipconfig will show.",
        netLab: {
          task:
            "This is a home network drawn as separate devices. The access point broadcasts the SSID Adaeze-Home with WPA2 and the passphrase Lagos2026!. Connect the laptop to the Wi-Fi, check the address it receives, and ping the router at 192.168.0.1.",
          devices: [
            { id: "Home-Router", kind: "router", x: 14, y: 14, note: "router + DHCP" },
            { id: "SW1", kind: "switch", x: 46, y: 14, note: "switch" },
            { id: "PC1", kind: "pc", x: 46, y: 38, dhcp: true },
            { id: "AP1", kind: "ap", x: 76, y: 14, wifi: { ssid: "Adaeze-Home", security: "wpa2", passphrase: "Lagos2026!", band: "5", channel: 36 }, note: "access point" },
            { id: "Laptop", kind: "laptop", x: 86, y: 38, dhcp: true },
          ],
          links: [["Home-Router:g0/0", "SW1:g0/1"], ["PC1:fa0", "SW1:fa0/1"], ["AP1:port0", "SW1:fa0/2"]],
          config: {
            "Home-Router": "hostname Home-Router\ninterface g0/0\n ip address 192.168.0.1 255.255.255.0\n no shutdown\nip dhcp excluded-address 192.168.0.1 192.168.0.9\nip dhcp pool HOME\n network 192.168.0.0 255.255.255.0\n default-router 192.168.0.1",
            SW1: "hostname SW1",
          },
          start: "Laptop",
          goals: [
            { type: "wifi", client: "Laptop", label: "The laptop is connected to Adaeze-Home" },
            { type: "ping", from: "Laptop", to: "192.168.0.1", label: "The laptop can ping the router" },
          ],
          hint: "On the laptop type: wifi connect Adaeze-Home Lagos2026!  Then ipconfig to see the address DHCP gave it, and ping 192.168.0.1.",
          successMessage:
            "Radio to the access point, cable to the switch, switch to the router, and an address handed out by the router's DHCP service. Four jobs that one plastic box does at home.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 3 · 1.6
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "nw-l3-network-types",
    moduleId: M,
    sectionId: SECTION_ID,
    order: 3,
    covers: ["1.6"],
    title: "Types of Networks: PAN to WAN",
    subtitle: "Named by how much ground they cover and who owns them",
    estimatedMinutes: 30,
    intro:
      "Network types are named by scale: from the space around one person to the whole planet. The name tells an engineer how far the links run, who owns them, and what technology is likely.",

    atoms: [
      {
        id: "a-nw-pan-lan-wlan",
        title: "PAN, LAN and WLAN",
        explain:
          "A PAN (personal area network) connects one person's devices within a few metres: earbuds to a phone over Bluetooth, a smartwatch, a phone tethered to a laptop. A LAN (local area network) connects devices in one building or site, such as a home, an office floor or a school block, usually over Ethernet cables and switches, owned and run by the organisation itself, with high speed and low delay. A WLAN (wireless LAN) is a LAN whose devices connect by Wi-Fi through access points instead of cables. Most real LANs are both: desktops and printers on cable, laptops and phones on Wi-Fi, all in the same network.",
        decision: dec(
          "Chinedu's phone is connected to his wireless earbuds and his smartwatch while he walks to work.",
          "What type of network is this?",
          ["A PAN", "A few metres, one person's devices, usually Bluetooth: a personal area network."],
          [
            ["A LAN", "A LAN covers a building or site and many users' devices."],
            ["A WLAN", "A WLAN is Wi-Fi through access points. Earbuds use Bluetooth, within one person's space."],
            ["A WAN", "A WAN spans cities or countries."],
          ]
        ),
      },
      {
        id: "a-nw-can-man-wan",
        title: "CAN, MAN and WAN",
        explain:
          "A CAN (campus area network) joins several LANs across a campus of nearby buildings: a university, a hospital complex, a military base, a factory site. It is still owned by one organisation, with fibre between the buildings. A MAN (metropolitan area network) covers a city: a city's fibre ring linking government offices, or a provider's network across Lagos. A WAN (wide area network) spans regions, countries or continents. A bank's branches in Lagos, Abuja and Kano joined to head office form a WAN, and the internet is the largest WAN of all. WAN links are usually LEASED from providers rather than owned, which is why they cost more and run slower than LAN links.",
        table: {
          caption: "From one person to the whole planet.",
          headers: ["Type", "Typical span", "Owned by", "Example"],
          rows: [
            ["PAN", "A few metres", "One person", "Phone + earbuds + smartwatch (Bluetooth)"],
            ["LAN", "A building or floor", "The organisation", "An office's PCs and printers on switches"],
            ["WLAN", "A building, wirelessly", "The organisation", "The office or home Wi-Fi"],
            ["CAN", "A campus of buildings", "The organisation", "A university's faculties joined by fibre"],
            ["MAN", "A city", "A city or a provider", "A metro fibre ring across Abuja"],
            ["WAN", "Countries, continents", "Leased from providers", "A bank's branches nationwide; the internet"],
          ],
        },
        decision: dec(
          "A university joins the LANs in its library, engineering faculty and hostels, all within one fenced site, with its own fibre between the buildings.",
          "What type of network is this?",
          ["A CAN", "Several LANs across one organisation's site of nearby buildings: a campus area network."],
          [
            ["A WAN", "A WAN crosses cities or countries over leased links. This is one site, on the university's own fibre."],
            ["A MAN", "A MAN covers a city, not one campus."],
            ["A PAN", "A PAN is one person's devices."],
          ]
        ),
      },
      {
        id: "a-nw-types-real-world",
        title: "LAN, WAN and WLAN in the real world",
        explain:
          "The fastest way to tell network types apart is to ask three questions: How far do the links run? Who owns them? Cable or radio? A shop's tills and back-office PC on one switch: short, owned, cable, so a LAN. The same shop's customer Wi-Fi: a WLAN. The connection from the shop to its head office in another state: long, leased, so a WAN. One organisation usually runs all three at once. Use those three questions on the shop below.",
        decision: dec(
          "A supermarket chain has tills and a back-office PC cabled to one switch in each shop, free Wi-Fi for customers, and a leased line from every shop to head office in Abuja.",
          "Which list names the three networks correctly?",
          ["Tills and back office: LAN. Customer Wi-Fi: WLAN. Shop to head office: WAN", "Short owned cable is a LAN, the same over radio is a WLAN, and a long leased link between cities is a WAN."],
          [
            ["All three are one LAN, because they belong to one company", "Ownership by one company does not make a leased intercity link local."],
            ["Tills: PAN. Wi-Fi: LAN. Head office link: MAN", "A PAN is one person's devices; a link between states is wider than a city, so it is a WAN."],
            ["Tills: WAN. Wi-Fi: WAN. Head office link: LAN", "That reverses the scale: the shop's own cabling is local, the intercity link is wide area."],
          ]
        ),
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 4 · 1.7
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "nw-l4-topologies",
    moduleId: M,
    sectionId: SECTION_ID,
    order: 4,
    covers: ["1.7"],
    title: "Network Topologies",
    subtitle: "Bus, star, ring, mesh, tree and hybrid, and what each one costs when something breaks",
    estimatedMinutes: 35,
    intro:
      "A topology is the shape of a network: how devices are connected. Each shape has a different price, and a different answer to the question every engineer asks first: what happens when one piece fails?",

    atoms: [
      {
        id: "a-nw-bus-ring",
        title: "Bus and ring topologies",
        explain:
          "In a BUS topology every device taps into one shared cable (the backbone), with a terminator at each end. It is cheap and simple, but only one device can transmit at a time, collisions rise as devices are added, and a single break in the backbone takes the whole network down. Early Ethernet on coaxial cable was a bus. In a RING topology each device connects to exactly two neighbours and data travels around the ring, often passing a TOKEN that grants permission to transmit, so there are no collisions. A single break stops a simple ring; a DUAL ring sends traffic the other way around the break, which is how metro fibre rings and older FDDI networks survive cuts. Both shapes are rare in new LANs, but rings live on in provider and city networks.",
        decision: dec(
          "An old office network has eight PCs tapped onto one coaxial cable. A cleaner's trolley cuts the cable halfway along, and every PC loses the network.",
          "Which topology is this, and why did one cut stop everyone?",
          ["A bus: every device shares one backbone, so a break in it breaks the whole network", "The shared backbone is the single point of failure of a bus."],
          [
            ["A star: the switch failed", "There is no central switch here; the devices tap one shared cable."],
            ["A mesh: too many links", "A mesh would survive a single cut by using another path."],
            ["A ring: the token was lost", "A ring connects each device to two neighbours, not to one shared cable."],
          ]
        ),
      },
      {
        id: "a-nw-star-tree",
        title: "Star and tree topologies",
        explain:
          "In a STAR topology every device has its own cable to a central device, today a switch. A broken cable affects only the one device on it, devices are easy to add, and faults are easy to find, which is why almost every modern LAN is a star. Its weakness is the centre: if the switch fails, everyone on it stops. A TREE (hierarchical) topology connects stars to stars: desk switches on each floor connect up to a distribution switch, which connects up to a core. Trees scale to whole buildings and campuses, and Module 10 builds the professional version of this design (access, distribution and core layers).",
        decision: dec(
          "In a star-wired office, one user's cable is chewed by a rat. Everyone else carries on working.",
          "Why did only one user lose the network?",
          ["In a star each device has its own cable to the switch, so a cable fault affects only that device", "Fault isolation is the star's main advantage over a bus."],
          [
            ["Because stars have no central device", "A star is defined by its central device, the switch."],
            ["Because rats prefer one cable", "Funny, but the topology is the reason the damage stayed local."],
            ["Because star networks reroute around the damage", "There is no other path to that PC. Its one link is simply down."],
          ],
          "The flip side: if the switch itself fails, every device on it goes down together."
        ),
      },
      {
        id: "a-nw-mesh",
        title: "Mesh topology",
        explain:
          "In a FULL MESH every device links directly to every other device. Traffic can take many paths, so a mesh survives multiple failures, which is why internet backbones, data-centre fabrics and the links between core routers use mesh or near-mesh designs. The cost is the number of links. Each of n devices links to the other n − 1, and each link joins two devices, so a full mesh needs n(n − 1) / 2 links: fine for 4 core routers, impossible for 400 desks. A PARTIAL MESH links only the most important devices redundantly. Work out the numbers below by hand.",
        netCalc: {
          task: "Work out how many cables each design needs. A full mesh needs n × (n − 1) ÷ 2 links; a star needs one cable per device.",
          questions: [
            { q: "How many links does a full mesh of 4 core routers need?", answer: "6", check: { fn: "meshLinks", arg: "4" }, hint: "4 × 3 = 12, then halve it, because each link joins two devices.", working: "4 × (4 − 1) ÷ 2 = 12 ÷ 2 = 6 links" },
            { q: "How many links does a full mesh of 10 devices need?", answer: "45", check: { fn: "meshLinks", arg: "10" }, hint: "10 × 9, then halve it.", working: "10 × 9 ÷ 2 = 90 ÷ 2 = 45 links" },
            { q: "How many links would a full mesh of 50 office PCs need?", answer: "1225", check: { fn: "meshLinks", arg: "50" }, hint: "50 × 49, then halve it.", working: "50 × 49 ÷ 2 = 2450 ÷ 2 = 1,225 links" },
            { q: "How many cables does a STAR of the same 50 PCs need (one cable from each PC to the switch)?", answer: "50", hint: "One cable per device.", working: "50 PCs × 1 cable = 50 cables" },
          ],
          successMessage: "1,225 cables for 50 PCs is why nobody meshes desktops, and why core routers (a handful of devices) are meshed.",
        },
      },
      {
        id: "a-nw-hybrid",
        title: "Hybrid topology",
        explain:
          "A HYBRID topology combines two or more shapes. Real networks are almost always hybrid: each floor is a star around its switch, the floors form a tree up to the core, the core switches are meshed for redundancy, and the company's sites may sit on a provider's ring. When you identify a topology, look at each level separately and name each part: 'stars at the access layer, a partial mesh at the core'.",
        decision: dec(
          "A hospital has a switch on each ward with every PC cabled to it. Each ward switch connects to two core switches, and the two core switches are cabled to each other.",
          "Which description is most accurate?",
          ["A hybrid: stars on the wards, with a redundant (partial mesh) core", "Each level has its own shape; naming them together is how engineers describe real networks."],
          [
            ["A pure bus", "No device shares one backbone cable here."],
            ["A pure ring", "Ward switches connect up to the core, not to neighbouring wards in a circle."],
            ["A full mesh", "PCs are not linked to every other PC; only the core is redundant."],
          ]
        ),
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 5 · 1.8 – 1.9
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "nw-l5-architectures",
    moduleId: M,
    sectionId: SECTION_ID,
    order: 5,
    covers: ["1.8", "1.9"],
    title: "Client-Server and Peer-to-Peer",
    subtitle: "Who provides the service, and who asks for it",
    estimatedMinutes: 30,
    intro:
      "Topology is the shape of the cables. Architecture is the shape of the conversation: does every device ask one central machine, or do the devices serve each other?",

    atoms: [
      {
        id: "a-nw-client-server",
        title: "Client-server architecture",
        explain:
          "In the CLIENT-SERVER model, dedicated SERVERS provide services and CLIENTS request them. Your browser is a client and a web server answers it; your phone's banking app is a client of the bank's servers; an office PC opening a shared folder is a client of a file server. Servers are always on, centrally managed, backed up and secured, so data lives in one place and access is controlled in one place. The costs are the server hardware, the skills to run it, and DEPENDENCE: if the server is down, the service is down for everyone. Clients usually find servers by NAME, using DNS to turn a name like intranet.school.lab into an address. In the lab below a PC cannot reach the school's intranet server by name, because nobody has told it which DNS server to ask. Three PC commands fix and prove it. ipconfig /dns followed by an address tells the PC which DNS server to use: ipconfig /dns 192.168.10.5. nslookup followed by a name asks the DNS server for that name's address: nslookup intranet.school.lab. And curl followed by a web address fetches a web page the way a browser does, showing the page's text: curl http://intranet.school.lab/.",
        netLab: {
          task:
            "SRV1 is the school's server: it runs the intranet website and the school's DNS service, which knows that intranet.school.lab is 192.168.10.5. Student-PC has an address but no DNS server, so the name does not resolve. Point Student-PC at the DNS server, then load the intranet by name.",
          devices: [
            { id: "Student-PC", kind: "pc", x: 16, y: 32, ip: "192.168.10.21/24", gateway: "192.168.10.1" },
            { id: "SW1", kind: "switch", x: 50, y: 14 },
            {
              id: "SRV1",
              kind: "server",
              x: 84,
              y: 32,
              ip: "192.168.10.5/24",
              gateway: "192.168.10.1",
              services: [53, 80],
              records: { "intranet.school.lab": "192.168.10.5" },
              web: "<html><title>School Intranet</title><h1>Welcome to the School Intranet</h1><p>Timetables, results and notices.</p></html>",
            },
          ],
          links: [["Student-PC:fa0", "SW1:fa0/1"], ["SRV1:fa0", "SW1:fa0/24"]],
          config: { SW1: "hostname SW1" },
          start: "Student-PC",
          goals: [
            { type: "dns", from: "Student-PC", name: "intranet.school.lab", address: "192.168.10.5", label: "Student-PC resolves intranet.school.lab" },
            { type: "tcp", from: "Student-PC", to: "intranet.school.lab", port: 80, label: "Student-PC loads the intranet over HTTP" },
          ],
          hint: "On Student-PC: ipconfig /dns 192.168.10.5 then nslookup intranet.school.lab then curl http://intranet.school.lab/",
          successMessage: "Client asks, server answers: first the DNS server (name to address), then the web server (the page). Module 4 takes both protocols apart.",
        },
      },
      {
        id: "a-nw-p2p",
        title: "Peer-to-peer architecture",
        explain:
          "In PEER-TO-PEER (P2P) every device is equal: each can both offer and request resources, with no dedicated server. Two laptops sharing files directly, a home where every PC shares its own folder, and file-sharing systems like BitTorrent, where every downloader also uploads pieces to others, are all P2P. It is cheap and simple, with no server to buy and no single point of failure for the whole system. But there is no central control: each user manages their own sharing and security, data is scattered across machines, backups are inconsistent, and it does not scale well beyond about ten machines in an office.",
        decision: dec(
          "Five friends in a hostel room want to share music files between their laptops for a weekend. They have no server and no budget.",
          "Which architecture fits best?",
          ["Peer-to-peer: each laptop shares its own files directly with the others", "Few devices, no budget, no need for central control: P2P's sweet spot."],
          [
            ["Client-server with a dedicated file server", "Buying and running a server is overkill for five friends for a weekend."],
            ["A WAN", "A WAN is a network type by distance, not an architecture, and they are in one room."],
            ["A bus topology", "Topology is cabling shape, not who serves whom."],
          ]
        ),
      },
      {
        id: "a-nw-arch-compare",
        title: "Choosing between them",
        explain:
          "The choice is about control, scale and cost. Choose CLIENT-SERVER when data must be central, secured and backed up, when many users need the same service, or when you must control who can access what: offices, schools, hospitals, banks, every website. Choose PEER-TO-PEER for a handful of devices with no budget and no sensitive data, or for systems designed to spread load across users (P2P file distribution, some video calls). Many real systems are mixed: a messaging app may use central servers to find your contact, then send a call's media directly peer-to-peer.",
        table: {
          caption: "Client-server versus peer-to-peer.",
          headers: ["", "Client-server", "Peer-to-peer"],
          rows: [
            ["Who provides services", "Dedicated servers", "Every device"],
            ["Management and security", "Central, consistent", "Each user, inconsistent"],
            ["Backup", "One place", "Scattered"],
            ["Cost", "Higher (servers, skills)", "Low"],
            ["Single point of failure", "The server", "None for the whole system"],
            ["Scales to", "Thousands of users", "About ten in an office"],
          ],
        },
        decision: dec(
          "A clinic with 40 staff must keep patient records private, backed up daily, and accessible only to authorised staff.",
          "Which architecture should the clinic use?",
          ["Client-server, with the records on a secured, backed-up server", "Central control of access and backup is a requirement here, and P2P cannot provide it."],
          [
            ["Peer-to-peer, so every PC holds some records", "Records scattered across 40 PCs cannot be consistently secured or backed up."],
            ["Peer-to-peer, because it is cheaper", "Cost does not outweigh legal duties to protect patient data."],
            ["Neither: keep records on paper", "The question is which network architecture fits, and client-server meets every requirement."],
          ]
        ),
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 6 · 1.10 and practical
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "nw-l6-applications",
    moduleId: M,
    sectionId: SECTION_ID,
    order: 6,
    covers: ["1.10", "1.P"],
    title: "Networks at Home, at Work, at School and in the Data Centre",
    subtitle: "Where everything in this module meets, and your first practical",
    estimatedMinutes: 40,
    intro:
      "The same building blocks appear everywhere, in different proportions. Recognise them in four settings, then identify, draw and test networks yourself.",

    atoms: [
      {
        id: "a-nw-applications",
        title: "Network applications in four settings",
        explain:
          "HOMES: one Wi-Fi router (router, switch, access point and often modem in one box) connects phones, laptops, TVs and cameras to the internet over fibre, cable or mobile broadband: a small star LAN plus a WLAN. BUSINESSES: structured cabling to every desk, managed switches, separate networks (VLANs, Module 5) for staff, guests and payment terminals, file and application servers, a firewall at the internet edge, and WAN links to branches. SCHOOLS: computer laboratories, staff and student networks kept apart, Wi-Fi across a campus (a CAN), content filtering, and shared printers and servers. DATA CENTRES: thousands of servers in racks, each rack with a top-of-rack switch, meshed high-speed fibre between switches, redundant everything, connected to the internet by several providers; this is where cloud services, banking platforms and streaming actually live.",
        table: {
          caption: "The same components, in different proportions.",
          headers: ["Setting", "Typical topology", "Key devices", "Main concern"],
          rows: [
            ["Home", "Star + WLAN", "All-in-one Wi-Fi router, ONT/modem", "Coverage and simplicity"],
            ["Business", "Tree of stars, VLANs", "Managed switches, routers, firewall, servers", "Security and reliability"],
            ["School", "Campus (CAN) of stars", "Switches per lab, campus Wi-Fi, filters", "Separation of staff and students"],
            ["Data centre", "Meshed fabric of racks", "Top-of-rack and spine switches, routers", "Redundancy and capacity"],
          ],
        },
        decision: dec(
          "A payments company cannot afford even a minute of downtime for its platform, which serves banks across West Africa.",
          "Where should the platform's servers live, and why?",
          ["In a data centre with redundant power, meshed switching and several internet providers", "A data centre is engineered so no single failure takes the service down."],
          [
            ["On a PC under the CEO's desk", "One PC, one power socket and one internet line are three single points of failure."],
            ["On a peer-to-peer network of staff laptops", "Laptops go home, sleep and crash; there is no central control or redundancy."],
            ["In the office Wi-Fi network", "Office Wi-Fi is built for convenience, not for zero downtime."],
          ]
        ),
      },
      {
        id: "a-nw-identify-topology",
        title: "Practical: identify a laboratory's topology",
        explain:
          "To identify a real laboratory's topology, follow the cables. Look behind the PCs: does each one have its own cable to a switch in a cabinet (a star)? Are there several switches, each serving a row, that connect up to one main switch (a tree)? Is there a Wi-Fi access point on the ceiling (a WLAN within the LAN)? Where does the main switch go: to a router or firewall that leads to the school's network and the internet? Write down what you find as levels, the way engineers do. In the lab below, the network diagram is drawn for you. Before you answer, click the switches and run show cdp neighbors, which asks a Cisco device which other Cisco devices are plugged into it; it is how engineers map a network nobody documented.",
        netDemo: {
          task:
            "A computer laboratory: two row switches serve the PCs, and both connect to a main switch, which connects to the school router. Explore: on Main-SW type enable then show cdp neighbors to see what is connected to it.",
          devices: [
            { id: "R-School", kind: "router", x: 50, y: 7 },
            { id: "Main-SW", kind: "switch", x: 50, y: 20 },
            { id: "Row1-SW", kind: "switch", x: 24, y: 32 },
            { id: "Row2-SW", kind: "switch", x: 76, y: 32 },
            { id: "PC1", kind: "pc", x: 12, y: 43, ip: "10.5.0.11/24" },
            { id: "PC2", kind: "pc", x: 36, y: 43, ip: "10.5.0.12/24" },
            { id: "PC3", kind: "pc", x: 64, y: 43, ip: "10.5.0.13/24" },
            { id: "PC4", kind: "pc", x: 88, y: 43, ip: "10.5.0.14/24" },
          ],
          links: [
            ["R-School:g0/0", "Main-SW:g0/1"],
            ["Main-SW:fa0/1", "Row1-SW:g0/1"],
            ["Main-SW:fa0/2", "Row2-SW:g0/1"],
            ["PC1:fa0", "Row1-SW:fa0/1"],
            ["PC2:fa0", "Row1-SW:fa0/2"],
            ["PC3:fa0", "Row2-SW:fa0/1"],
            ["PC4:fa0", "Row2-SW:fa0/2"],
          ],
          config: {
            "R-School": "hostname R-School\ninterface g0/0\n ip address 10.5.0.1 255.255.255.0\n no shutdown",
            "Main-SW": "hostname Main-SW",
            "Row1-SW": "hostname Row1-SW",
            "Row2-SW": "hostname Row2-SW",
          },
          start: "Main-SW",
          height: 50,
        },
        decision: dec(
          "In the laboratory above, each PC is cabled to a row switch, and both row switches are cabled to one main switch, which connects to the router.",
          "What is this laboratory's topology?",
          ["A tree (hierarchical star): stars at each row, joined to a main switch", "Stars connected to a higher-level switch form a tree."],
          [
            ["A bus", "No devices share one backbone cable."],
            ["A ring", "The row switches do not connect to each other in a loop."],
            ["A full mesh", "PCs connect only to their own row switch."],
          ],
          "If the main switch fails, both rows lose the router, but PCs in the same row can still reach each other through their row switch."
        ),
      },
      {
        id: "a-nw-draw-networks",
        title: "Practical: draw a home and an office network",
        explain:
          "A good network drawing shows every device with its role, every link with its type (cable, fibre, wireless), and every boundary between networks (where a router or firewall sits). For a HOME: the provider's line, the ONT or modem, the Wi-Fi router, the wired devices, the wireless devices. For an OFFICE: the internet line, the firewall and router, a core switch, access switches per floor or department, access points, servers, printers, and labels for the separate staff and guest networks. Use standard icons (a circle with arrows for a router, a box with arrows for a switch) and label interfaces, as in every NetLab diagram. A drawing is documentation: Module 10 turns it into professional diagrams, and the capstone requires one.",
        decision: dec(
          "Your office drawing shows PCs, printers, switches, the router and the internet line, but nothing marks where the guest Wi-Fi is kept apart from the staff network.",
          "What is the drawing missing?",
          ["The boundary between networks: which devices are in which network, and where traffic between them is controlled", "Boundaries are where security and troubleshooting decisions live, so a drawing must show them."],
          [
            ["More PCs", "Drawing every PC adds clutter, not meaning; group them by switch."],
            ["The colour of each cable", "Link type matters (cable, fibre, wireless); colour does not."],
            ["The model number of every mouse", "Peripherals are not network devices."],
          ]
        ),
      },
    ],

    requirements: { read: true, video: false, assessment: true },

    task: {
      title: "Module 1 practical: devices, drawings and topologies",
      intro:
        "Work through these with a pen and paper or a drawing tool, and with a real network you can see: your home, your workplace or a school laboratory. Keep your drawings; you will improve them in Module 10.",
      prompts: [
        "Identify every networking device you can find (router, switch, access point, modem or ONT, NICs, cables) and write one line on what each one does.",
        "Draw your home network: the provider's line, the ONT or modem, the router, and every wired and wireless device, with each link labelled cable or wireless.",
        "Draw a small office network for 20 staff, a printer and a file server, with a separate guest Wi-Fi. Mark where the staff and guest networks meet.",
        "Visit a computer laboratory (or use the one in this lesson's NetLab) and identify its topology level by level.",
        "Give one real-world example each of a LAN, a WLAN and a WAN you use, and explain what makes each one that type.",
      ],
      closing:
        "Every device you drew sends its data through the layers of the OSI and TCP/IP models. Module 2 follows one message through all of them.",
    },
  },
];
