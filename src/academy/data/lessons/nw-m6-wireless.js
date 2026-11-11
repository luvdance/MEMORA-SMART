/**
 * COMPUTER NETWORKING · MODULE 6 · WIRELESS NETWORKING AND INTERNET INFRASTRUCTURE
 *
 * Curriculum 6.1 – 6.24 and the practical. 802.11 and the Wi-Fi
 * generations, bands and channels, SSIDs and BSSIDs, access points, roaming,
 * coverage, antennas and interference, WPA2 and WPA3, authentication, guest
 * and mesh networks; then ISPs, fibre, broadband and dedicated links, the
 * backbone and submarine cables, autonomous systems, IXPs, CDNs, and how a
 * request reaches a website.
 *
 * New in this module, taught before use: the access point's settings in
 * NetLab (show, ssid, security, passphrase, band, channel) and dig +trace.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

import { dec, term } from "./nw-kit.js";

export const SECTION_ID = "nw-s6-wireless";
const M = "nw-m6-wireless";

const OFFICE_ROUTER = "hostname R1\ninterface g0/0\n ip address 192.168.60.1 255.255.255.0\n no shutdown\nip dhcp excluded-address 192.168.60.1 192.168.60.20\nip dhcp pool WIFI\n network 192.168.60.0 255.255.255.0\n default-router 192.168.60.1";

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 1 · 6.1 – 6.3
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "nw-wl1-wireless-basics",
    moduleId: M,
    sectionId: SECTION_ID,
    order: 1,
    covers: ["6.1", "6.2", "6.3"],
    title: "Wireless Fundamentals and the Wi-Fi Standards",
    subtitle: "How Wi-Fi shares the air, and what Wi-Fi 4, 5, 6 and 7 really mean",
    estimatedMinutes: 35,
    intro:
      "Most people never plug a cable into anything any more. This module explains the radio networks they use instead, then follows their traffic out of the building and across the internet.",

    atoms: [
      {
        id: "a-nw-wireless-fundamentals",
        title: "Wireless networking fundamentals",
        explain:
          "A WIRELESS LAN (WLAN) carries Ethernet-style frames over RADIO instead of a cable, following the IEEE 802.11 standards ('Wi-Fi' is the Wi-Fi Alliance's brand for certified 802.11 equipment). Devices (STATIONS, or clients) associate with an ACCESS POINT, which bridges them to the wired network. Three facts shape everything about Wi-Fi. It is a SHARED medium: all devices on a channel take turns, so it is effectively HALF DUPLEX, and the advertised speed is shared by everyone connected. Because radios cannot listen while transmitting, Wi-Fi cannot detect collisions as old Ethernet did; instead it AVOIDS them (CSMA/CA): a station listens, waits a random time if the channel is busy, and every frame is acknowledged. And radio signals WEAKEN with distance and obstacles, and are disturbed by other radios, so real throughput is often a half or less of the headline figure. On the other hand, Wi-Fi gives mobility, and covers places cables cannot reach.",
        decision: dec(
          "A café advertises 'Wi-Fi 6, up to 1.2 Gbps'. With 30 customers connected, each person's speed test shows around 20 Mbps.",
          "Why is it so far below the advertised figure?",
          ["Wi-Fi is a shared, half-duplex medium: the airtime is divided among all the devices, and real throughput is always well below the headline rate", "The advertised rate is a best-case link rate for one device, not per-person throughput."],
          [
            ["The café is lying: Wi-Fi 6 cannot exceed 20 Mbps", "Wi-Fi 6 can reach high rates; the airtime is simply shared."],
            ["Wi-Fi is full duplex, so speeds should add up", "Wi-Fi is effectively half duplex."],
            ["Speed tests do not work over Wi-Fi", "They work; they measure real, shared throughput."],
          ]
        ),
      },
      {
        id: "a-nw-80211-standards",
        title: "IEEE 802.11 standards",
        explain:
          "Each generation of Wi-Fi has its own 802.11 amendment, adding speed through wider CHANNELS (20, 40, 80, 160 and now 320 MHz), more efficient MODULATION (more bits per radio symbol), and MIMO (multiple antennas sending several streams at once). Key ones: 802.11b (1999, 2.4 GHz, 11 Mbps); 802.11a (1999, 5 GHz, 54 Mbps); 802.11g (2003, 2.4 GHz, 54 Mbps); 802.11n (2009, 2.4 and 5 GHz, up to 600 Mbps, introduced MIMO); 802.11ac (2013, 5 GHz, multi-gigabit, introduced downlink MU-MIMO, serving several clients at once); 802.11ax (2019, 2.4, 5 and, as Wi-Fi 6E, 6 GHz; designed for EFFICIENCY in crowded places with OFDMA, which splits a channel among many clients in the same transmission); 802.11be (2024, adds 320 MHz channels and multi-link operation across bands). Newer access points are BACKWARD COMPATIBLE with older clients, but an old client talks at its own old speed and uses more airtime, slowing everyone.",
        table: {
          caption: "The 802.11 standards most often met.",
          headers: ["Standard", "Year", "Bands", "Notable for"],
          rows: [
            ["802.11b", "1999", "2.4 GHz", "First mass-market Wi-Fi, 11 Mbps"],
            ["802.11a", "1999", "5 GHz", "54 Mbps on 5 GHz"],
            ["802.11g", "2003", "2.4 GHz", "54 Mbps on 2.4 GHz"],
            ["802.11n", "2009", "2.4 and 5 GHz", "MIMO, up to 600 Mbps"],
            ["802.11ac", "2013", "5 GHz", "Wide channels, multi-gigabit, MU-MIMO"],
            ["802.11ax", "2019", "2.4, 5 (and 6) GHz", "OFDMA: efficiency in crowded spaces"],
            ["802.11be", "2024", "2.4, 5 and 6 GHz", "320 MHz channels, multi-link"],
          ],
        },
        decision: dec(
          "A lecture theatre holds 400 students, each with a phone and a laptop on Wi-Fi at the same time.",
          "Which 802.11 feature was designed for exactly this situation?",
          ["OFDMA in 802.11ax (Wi-Fi 6), which serves many clients within one transmission and improves efficiency in crowded spaces", "Wi-Fi 6's main goal was efficiency in dense environments."],
          [
            ["802.11b's 11 Mbps rate", "802.11b is the slowest and least efficient standard."],
            ["Longer cables", "This is a wireless problem."],
            ["The 2.4 GHz band only", "2.4 GHz is the most crowded band, with only three non-overlapping channels."],
          ]
        ),
      },
      {
        id: "a-nw-wifi-generations",
        title: "Wi-Fi generations: Wi-Fi 4, 5, 6, 6E and 7",
        explain:
          "In 2018 the Wi-Fi Alliance gave the standards simple generation numbers, which are what you see on boxes and phone settings. WI-FI 4 is 802.11n. WI-FI 5 is 802.11ac. WI-FI 6 is 802.11ax on 2.4 and 5 GHz. WI-FI 6E is 802.11ax extended into the new 6 GHz band, which has far more clean spectrum but shorter range, and requires WPA3. WI-FI 7 is 802.11be. (Older standards were never numbered officially.) For planning: Wi-Fi 6 or newer is the sensible minimum for new installations; Wi-Fi 6E and 7 matter where many devices compete and 6 GHz is permitted (national regulators decide which bands may be used in each country, including Nigeria's NCC); and the experience is limited by the OLDEST, slowest clients and by the wired uplink behind the access point. A Wi-Fi 7 access point on a 1 Gbps switch port cannot deliver more than 1 Gbps to its users in total.",
        table: {
          caption: "Generation names and their standards.",
          headers: ["Generation", "Standard", "Bands"],
          rows: [
            ["Wi-Fi 4", "802.11n", "2.4 and 5 GHz"],
            ["Wi-Fi 5", "802.11ac", "5 GHz"],
            ["Wi-Fi 6", "802.11ax", "2.4 and 5 GHz"],
            ["Wi-Fi 6E", "802.11ax", "Adds 6 GHz (WPA3 required)"],
            ["Wi-Fi 7", "802.11be", "2.4, 5 and 6 GHz"],
          ],
        },
        decision: dec(
          "An office installs Wi-Fi 7 access points, but every access point is connected to an old 1 Gbps switch port, and half the staff laptops are ten-year-old Wi-Fi 4 machines.",
          "What will limit the users' real experience?",
          ["The 1 Gbps uplink caps each access point's total throughput, and the old Wi-Fi 4 laptops use more airtime and slow the channel for everyone", "Wireless performance is limited by the wired backhaul and the oldest clients, not the newest standard on the box."],
          [
            ["Nothing: Wi-Fi 7 makes every device fast", "Old clients talk at their own old speed."],
            ["The laptops will automatically upgrade to Wi-Fi 7", "The radio hardware in a laptop does not change."],
            ["Wi-Fi 7 only works on 2.4 GHz", "Wi-Fi 7 uses 2.4, 5 and 6 GHz."],
          ]
        ),
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 2 · 6.4 – 6.6
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "nw-wl2-bands-channels",
    moduleId: M,
    sectionId: SECTION_ID,
    order: 2,
    covers: ["6.4", "6.5", "6.6"],
    title: "Bands, Channels, SSIDs and BSSIDs",
    subtitle: "Where on the radio dial Wi-Fi lives, and how networks are named",
    estimatedMinutes: 45,
    intro:
      "Most slow Wi-Fi is not caused by the internet connection. It is caused by access points shouting over each other on the same channel. You will fix exactly that, after learning how bands and channels work.",

    atoms: [
      {
        id: "a-nw-wifi-bands",
        title: "Wireless frequency bands: 2.4 GHz, 5 GHz and 6 GHz",
        explain:
          "Wi-Fi uses three unlicensed radio bands. 2.4 GHZ travels FURTHEST and passes through walls best, but it is narrow and CROWDED: only about 80 MHz wide, shared with Bluetooth, cordless phones, baby monitors and microwave ovens, with room for just THREE non-overlapping 20 MHz channels. 5 GHZ has many more channels (around 25 at 20 MHz), so wider, faster channels are possible and there is less interference, but it covers a shorter distance and is weakened more by walls. Some 5 GHz channels (the DFS channels) must give way to weather and military radar. 6 GHZ (Wi-Fi 6E and 7) has the most clean spectrum of all (up to 1,200 MHz where fully permitted, fitting fifty-nine 20 MHz channels or three 320 MHz ones), no old devices slowing it down, and requires WPA3; its range is the shortest. A typical design: devices that support 5 or 6 GHz are steered there (BAND STEERING), and 2.4 GHz is kept for range and for old or simple devices such as smart plugs and printers.",
        decision: dec(
          "A warehouse needs basic Wi-Fi for handheld barcode scanners across a large open space with metal shelving, where speed matters far less than reach.",
          "Which band suits the scanners best?",
          ["2.4 GHz, because it travels furthest and penetrates obstacles best, and the scanners need little bandwidth", "Range over speed points to 2.4 GHz."],
          [
            ["6 GHz, because it is the newest", "6 GHz has the shortest range and needs Wi-Fi 6E devices."],
            ["5 GHz with 160 MHz channels", "Wide 5 GHz channels give speed, not range."],
            ["Infrared", "Infrared is line-of-sight over a few metres."],
          ]
        ),
      },
      {
        id: "a-nw-channels",
        title: "Channels and channel interference",
        explain:
          "Each band is divided into CHANNELS. In 2.4 GHz, channels are numbered 1 to 13 (11 in some countries), only 5 MHz apart, but each Wi-Fi channel is 20 MHz wide, so neighbouring numbers OVERLAP. Only channels 1, 6 and 11 do not overlap one another. Two kinds of interference follow. CO-CHANNEL interference: access points on the SAME channel within hearing of each other must take turns, sharing the airtime as if they were one access point. ADJACENT-CHANNEL interference: access points on OVERLAPPING channels (say 1 and 3) corrupt each other's transmissions, which is worse. So in 2.4 GHz, neighbouring access points use only 1, 6 and 11, arranged so no two neighbours share a channel. In 5 GHz there are enough channels to keep neighbours apart even with 40 or 80 MHz widths. In NetLab, an access point's console accepts its wireless settings as short commands: show prints the current settings, band followed by 2.4, 5 or 6 sets the band, and channel followed by a number sets the channel. In the lab below, the installer left all three access points on channel 6.",
        netLab: {
          task:
            "AP-East, AP-Centre and AP-West cover three neighbouring rooms on 2.4 GHz, and all three are on channel 6, so they share one channel's airtime. Give them the three non-overlapping 2.4 GHz channels (1, 6 and 11), so that no two neighbours share a channel. Check each one with show.",
          devices: [
            { id: "R1", kind: "router", x: 50, y: 6 },
            { id: "SW1", kind: "switch", x: 50, y: 22 },
            { id: "AP-West", kind: "ap", x: 16, y: 40, wifi: { ssid: "Office", security: "wpa2", passphrase: "Office-2026!", band: "2.4", channel: 6 } },
            { id: "AP-Centre", kind: "ap", x: 50, y: 40, wifi: { ssid: "Office", security: "wpa2", passphrase: "Office-2026!", band: "2.4", channel: 6 } },
            { id: "AP-East", kind: "ap", x: 84, y: 40, wifi: { ssid: "Office", security: "wpa2", passphrase: "Office-2026!", band: "2.4", channel: 6 } },
          ],
          links: [["R1:g0/0", "SW1:g0/1"], ["AP-West:port0", "SW1:fa0/1"], ["AP-Centre:port0", "SW1:fa0/2"], ["AP-East:port0", "SW1:fa0/3"]],
          config: { R1: OFFICE_ROUTER, SW1: "hostname SW1" },
          start: "AP-West",
          height: 46,
          goals: [
            { type: "channels", aps: ["AP-West", "AP-Centre", "AP-East"], neighbors: [["AP-West", "AP-Centre"], ["AP-Centre", "AP-East"], ["AP-West", "AP-East"]], label: "All three APs use 1, 6 or 11, and no two share a channel" },
          ],
          hint: "On AP-West type channel 1; on AP-East type channel 11; leave AP-Centre on 6. Run show on each to confirm.",
          successMessage: "Three access points, three separate channels' worth of airtime. In 2.4 GHz, 1, 6 and 11 is the only plan that works.",
        },
      },
      {
        id: "a-nw-ssid-bssid",
        title: "SSIDs and BSSIDs",
        explain:
          "The SSID (service set identifier) is the NETWORK NAME users see, up to 32 characters: 'Office', 'MST-Guest'. One access point can broadcast several SSIDs at once, each usually mapped to its own VLAN (staff, guest, IoT). The BSSID (basic service set identifier) identifies one RADIO's network on one access point, and is a MAC address (the radio's own, or one derived from it). So a building with twenty access points all broadcasting the SSID 'Office' has ONE SSID and TWENTY (or more) BSSIDs: that shared name is what lets devices roam between access points without the user noticing. When a laptop scans, it sees every BSSID in range, with its channel and signal strength, and picks one. Hiding the SSID (not broadcasting it) is NOT security: the name still appears in frames from connected clients and any scanning tool reveals it. On a NetLab laptop, wifi scan lists each BSSID it can hear with its SSID, band, channel, security and signal. Look at the network below.",
        netDemo: {
          task:
            "On the laptop, type wifi scan. How many SSIDs do you see, and how many BSSIDs? Which access point is closest (the strongest signal, the number nearest zero)? Then connect with wifi connect Office Office-2026! and run wifi status to see which access point you joined.",
          devices: [
            { id: "R1", kind: "router", x: 50, y: 6 },
            { id: "SW1", kind: "switch", x: 50, y: 22 },
            { id: "AP-1", kind: "ap", x: 20, y: 40, wifi: { ssid: "Office", security: "wpa2", passphrase: "Office-2026!", band: "5", channel: 36 }, signal: { Laptop: -48 } },
            { id: "AP-2", kind: "ap", x: 80, y: 40, wifi: { ssid: "Office", security: "wpa2", passphrase: "Office-2026!", band: "5", channel: 149 }, signal: { Laptop: -71 } },
            { id: "Laptop", kind: "laptop", x: 38, y: 54, dhcp: true },
          ],
          links: [["R1:g0/0", "SW1:g0/1"], ["AP-1:port0", "SW1:fa0/1"], ["AP-2:port0", "SW1:fa0/2"]],
          config: { R1: OFFICE_ROUTER, SW1: "hostname SW1" },
          start: "Laptop",
          height: 58,
        },
        decision: dec(
          "A scan in the network above shows two rows with the SSID 'Office', each with a different MAC address in the BSSID column and a different channel.",
          "What does that mean?",
          ["One network (one SSID) served by two access point radios (two BSSIDs), so a device can move between them and stay on 'Office'", "SSID is the name; each BSSID is one radio offering it."],
          [
            ["Someone has set up a fake copy of the network", "Several BSSIDs for one SSID is normal in any multi-AP network (an impostor is possible, but this alone does not show one)."],
            ["There are two separate networks that cannot share users", "They are the same network; that is the point of a shared SSID."],
            ["The laptop's adapter is faulty", "The scan is showing exactly what is there."],
          ]
        ),
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 3 · 6.7 – 6.9
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "nw-wl3-access-points",
    moduleId: M,
    sectionId: SECTION_ID,
    order: 3,
    covers: ["6.7", "6.8", "6.9"],
    title: "Access Points, Ad-Hoc Mode and Roaming",
    subtitle: "Setting up an access point, and moving between them",
    estimatedMinutes: 40,
    intro:
      "You will configure an access point from scratch, then see the two ways wireless devices can connect, and what happens when a user walks from one access point to the next.",

    atoms: [
      {
        id: "a-nw-configure-ap",
        title: "Configuring a wireless access point",
        explain:
          "An access point's essential settings are few, whichever brand it is (on a web page, a controller or a command line): the SSID (network name); the SECURITY mode (open, WPA2, WPA3, or the transition mode WPA2/WPA3 that accepts both kinds of client); the PASSPHRASE (the shared password for personal mode, 8 to 63 characters, and the longer the better); the BAND and CHANNEL; and, in enterprise networks, the VLAN each SSID maps to and the transmit power. In NetLab, the access point accepts them as commands: ssid followed by the name; security followed by open, wpa2, wpa3 or wpa2/wpa3; passphrase followed by the passphrase; band followed by 2.4, 5 or 6; channel followed by a number; and show to check. The access point is wired to a switch port, and in this lab the router hands out addresses by DHCP, so once the laptop associates (wifi connect followed by the SSID and passphrase, from Module 1) it receives an address automatically.",
        netLab: {
          task:
            "AP1 is brand new and its radio has no SSID. Configure it: SSID MST-Staff, security wpa2/wpa3 (so both older and newer laptops can join), passphrase Naija-Net-Lab-2026, band 5 GHz, channel 44. Then connect the laptop to it and ping the router at 192.168.60.1.",
          devices: [
            { id: "R1", kind: "router", x: 50, y: 6, note: "DHCP for Wi-Fi" },
            { id: "SW1", kind: "switch", x: 50, y: 22 },
            { id: "AP1", kind: "ap", x: 50, y: 40, wifi: { ssid: "", security: "open", passphrase: "", band: "2.4", channel: 1 } },
            { id: "Laptop", kind: "laptop", x: 80, y: 54, dhcp: true },
          ],
          links: [["R1:g0/0", "SW1:g0/1"], ["AP1:port0", "SW1:fa0/1"]],
          config: { R1: OFFICE_ROUTER, SW1: "hostname SW1" },
          start: "AP1",
          height: 58,
          goals: [
            { type: "ap", device: "AP1", ssid: "MST-Staff", security: "wpa2/wpa3", band: "5", channel: 44, label: "AP1 broadcasts MST-Staff, WPA2/WPA3, 5 GHz channel 44" },
            { type: "wifi", client: "Laptop", label: "The laptop is connected to MST-Staff" },
            { type: "ping", from: "Laptop", to: "192.168.60.1", label: "The laptop reaches the router" },
          ],
          hint: "On AP1: ssid MST-Staff, security wpa2/wpa3, passphrase Naija-Net-Lab-2026, band 5, channel 44, show. On the laptop: wifi connect MST-Staff Naija-Net-Lab-2026, then ping 192.168.60.1.",
          successMessage: "Name, security, passphrase, band, channel: five settings, and a laptop online with a DHCP address. Every access point you ever set up starts here.",
        },
      },
      {
        id: "a-nw-infra-adhoc",
        title: "Infrastructure versus ad-hoc mode",
        explain:
          "In INFRASTRUCTURE MODE, every wireless device connects through an ACCESS POINT, which controls the network (its security, its channel), relays traffic between wireless clients, and bridges them to the wired network and the internet. This is how virtually every home, office and public Wi-Fi works. In AD-HOC MODE (an independent BSS), devices connect DIRECTLY to each other with no access point: quick for sharing a file between two laptops, but there is no central control, no connection to the wider network unless one device shares its own, and security is weak, so ad-hoc networks are disabled by policy in most organisations. Modern relatives of ad-hoc use their own protocols: WI-FI DIRECT (phones casting to a TV or sending to a printer), phone HOTSPOTS (which are really the phone acting as an access point, so infrastructure mode), and MESH networks, in which access points relay for each other (Lesson 5).",
        decision: dec(
          "Two engineers at a remote site with no network want to copy a large file between their laptops over Wi-Fi.",
          "Which mode connects them without an access point?",
          ["Ad-hoc mode (or Wi-Fi Direct): the laptops connect directly to each other", "Device-to-device connection without an access point is what ad-hoc means."],
          [
            ["Infrastructure mode", "Infrastructure mode needs an access point."],
            ["Roaming", "Roaming is moving between access points."],
            ["Band steering", "Band steering moves clients between bands of an access point."],
          ]
        ),
      },
      {
        id: "a-nw-roaming",
        title: "Wireless roaming",
        explain:
          "ROAMING is a client moving from one access point to another without losing its connection, as you walk down a corridor on a call. Two things make it work. All the access points broadcast the SAME SSID, with the same security, on the same VLAN or subnet, so the client keeps its IP address and its sessions survive. And CELL OVERLAP: each access point's coverage overlaps its neighbours' by about 15 to 20 percent, so a new, stronger access point is always available before the old one fades. It is the CLIENT that decides when to roam, usually when the signal from its current access point drops below a threshold; badly behaved 'sticky' clients cling to a distant access point and slow everyone. Standards speed roaming up: 802.11r (fast transition) avoids repeating the full authentication on each move, and 802.11k and 802.11v let the network suggest better access points to the client. Controllers and cloud platforms tune all of this centrally.",
        decision: dec(
          "In a hotel, guests' video calls freeze for several seconds every time they walk from their room to the lobby. Every access point broadcasts 'Hotel-Guest', but the lobby access points put guests in a different subnet from the room access points.",
          "Why do the calls freeze?",
          ["Changing subnet forces the client to get a new IP address, which breaks existing connections; seamless roaming needs the same SSID AND the same subnet or VLAN", "The name matches, but the network behind it does not."],
          [
            ["The SSIDs should be different for each floor", "Different SSIDs would make roaming worse."],
            ["The guests need faster phones", "The freeze is caused by readdressing, not phone speed."],
            ["Roaming only works on 2.4 GHz", "Roaming works on every band."],
          ]
        ),
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 4 · 6.10 – 6.12
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "nw-wl4-coverage",
    moduleId: M,
    sectionId: SECTION_ID,
    order: 4,
    covers: ["6.10", "6.11", "6.12"],
    title: "Signal Strength, Antennas and Interference",
    subtitle: "Measuring coverage, choosing antennas, and what walls do to radio",
    estimatedMinutes: 40,
    intro:
      "Good Wi-Fi is designed, not hoped for. This lesson gives you the numbers engineers use to judge a signal, the antennas that shape it, and the things that weaken or disturb it.",

    atoms: [
      {
        id: "a-nw-signal-strength",
        title: "Signal strength and coverage",
        explain:
          "Wi-Fi signal strength is measured in dBm: decibels relative to one milliwatt. The numbers are NEGATIVE and the scale is LOGARITHMIC. Closer to zero is stronger: -45 dBm is excellent, -67 dBm is the usual minimum for reliable voice and video, -70 dBm is fine for web browsing, -80 dBm is barely usable, and around -90 dBm the connection fails. Two rules make the arithmetic easy: every 3 dB down HALVES the power, and every 10 dB down divides it by TEN. So -50 dBm to -53 dBm is half the power, and -50 to -60 dBm is a tenth. The other number that matters is the SNR (signal-to-noise ratio): the signal's strength above the background noise. A signal of -65 dBm over a noise floor of -95 dBm has an SNR of 30 dB, which is good; above about 25 dB is good, and below 15 dB is poor. Engineers do a SITE SURVEY, walking the building with survey software, to map coverage and place access points so every area gets at least -67 dBm with good overlap.",
        netCalc: {
          task: "Work with dBm. Remember: closer to zero is stronger; 3 dB is half or double; 10 dB is a factor of ten.",
          questions: [
            { q: "Which signal is stronger: -48 dBm or -72 dBm? (Type the number with its minus sign.)", answer: "-48", accept: ["-48dbm", "-48 dbm"], hint: "Closer to zero is stronger.", working: "-48 is closer to 0 than -72 → stronger" },
            { q: "A signal drops from -50 dBm to -53 dBm. What fraction of the power is left? (Type a fraction like 1/2 or a decimal.)", answer: "1/2", accept: ["0.5", "half", "50%"], hint: "3 dB down halves the power.", working: "-3 dB = ÷2 → 1/2 of the power" },
            { q: "A signal drops from -50 dBm to -60 dBm. What fraction of the power is left?", answer: "1/10", accept: ["0.1", "10%", "a tenth"], hint: "10 dB down divides by ten.", working: "-10 dB = ÷10 → 1/10 of the power" },
            { q: "A signal of -65 dBm sits over a noise floor of -95 dBm. What is the SNR, in dB?", answer: "30", accept: ["30db", "30 db"], hint: "Subtract: signal minus noise.", working: "-65 − (-95) = 30 dB" },
          ],
          successMessage: "-67 dBm for voice, 25 dB of SNR, 3 dB is half. With those three numbers you can read any survey.",
        },
      },
      {
        id: "a-nw-antennas",
        title: "Antennas and their functions",
        explain:
          "An antenna does not create power; it SHAPES where the radio energy goes, and the shaping is measured as GAIN in dBi. An OMNIDIRECTIONAL antenna radiates all around it (like a doughnut seen from the side), which suits ceiling-mounted access points covering a room or open office; most indoor access points have omni antennas built in. A DIRECTIONAL antenna focuses energy one way: a PATCH or PANEL antenna covers a sector (a long corridor, a warehouse aisle, a stadium section); a YAGI or a DISH (parabolic) antenna makes a narrow beam for POINT-TO-POINT links between buildings or towers, reaching kilometres. Higher gain gives more reach in the chosen direction and less everywhere else. Mounting matters as much as the antenna: ceiling-mounted access points pointing down give even coverage; one hidden in a metal cabinet or behind a TV does not. Access points use several antennas at once for MIMO, which is why they have more than one.",
        decision: dec(
          "A school needs to link its main building's network to a library 600 m across a field, without digging a trench.",
          "Which antennas suit this?",
          ["A pair of high-gain directional antennas (dish or yagi), one on each building, aimed at each other", "A narrow beam over a fixed long distance is a point-to-point job."],
          [
            ["An ordinary indoor omnidirectional access point in each building", "Omni antennas spread energy everywhere and will not reach 600 m reliably."],
            ["More access points in the main building", "They still cover only the building itself."],
            ["Bluetooth adapters", "Bluetooth covers metres, not hundreds of metres."],
          ]
        ),
      },
      {
        id: "a-nw-interference-attenuation",
        title: "Wireless interference and attenuation",
        explain:
          "ATTENUATION is the signal getting weaker: with DISTANCE (free-space path loss), and when passing through OBSTACLES, which absorb and reflect radio. Rough losses at 2.4 GHz: plasterboard 3 dB, glass 2 to 4 dB, brick 6 to 8 dB, concrete 10 to 15 dB, metal and lift shafts almost total; water (and people, who are mostly water) absorbs it too, which is why a full hall gets worse coverage than an empty one. Higher bands lose more: 5 and 6 GHz signals are weakened more by the same wall. INTERFERENCE is other radio energy on the same frequencies: other Wi-Fi networks (co-channel and adjacent-channel, Lesson 2), and NON-Wi-Fi sources on 2.4 GHz such as microwave ovens, Bluetooth, cordless phones, wireless cameras and baby monitors. Signs of interference: good signal strength but poor SNR, many retransmissions, and slowness at particular times (lunchtime, when the microwave runs). Fixes: change channel, move to 5 or 6 GHz, move or add access points, and remove or relocate the source.",
        table: {
          caption: "Typical signal loss through materials at 2.4 GHz (higher bands lose more).",
          headers: ["Material", "Approximate loss"],
          rows: [
            ["Plasterboard wall", "3 dB"],
            ["Glass window", "2–4 dB"],
            ["Brick wall", "6–8 dB"],
            ["Concrete wall", "10–15 dB"],
            ["Metal door, lift shaft", "Severe, often total"],
          ],
        },
        decision: dec(
          "Staff in an office kitchen say Wi-Fi works well all day except around 1 pm, when it becomes almost unusable. Their laptops are on 2.4 GHz.",
          "What is the most likely cause, and the fix?",
          ["Interference from the kitchen's microwave ovens, which leak energy at 2.4 GHz; move those users to 5 GHz (or move the access point)", "The timing points to a non-Wi-Fi interferer on 2.4 GHz."],
          [
            ["The internet provider slows down at lunch", "The problem is local to the kitchen."],
            ["Too much attenuation from the kitchen walls", "Walls do not change at 1 pm."],
            ["The access point needs a higher channel width on 2.4 GHz", "Wider channels in crowded 2.4 GHz make interference worse."],
          ]
        ),
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 5 · 6.13 – 6.16
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "nw-wl5-security",
    moduleId: M,
    sectionId: SECTION_ID,
    order: 5,
    covers: ["6.13", "6.14", "6.15", "6.16"],
    title: "Wi-Fi Security, Guest Networks and Mesh",
    subtitle: "WPA2, WPA3, authentication, separating visitors, and mesh systems",
    estimatedMinutes: 50,
    intro:
      "Anyone within range can receive a Wi-Fi signal, so wireless security is not optional. This lesson covers how Wi-Fi is protected, how users prove who they are, how visitors are kept away from the business network, and how mesh systems extend coverage.",

    atoms: [
      {
        id: "a-nw-wpa2-wpa3",
        title: "WPA2 and WPA3",
        explain:
          "Wi-Fi security protocols have a history of being broken and replaced. WEP (1999) was cracked within a few years and must never be used. WPA was a stopgap. WPA2 (2004) uses strong AES encryption and is still the most widely deployed; its weakness in PERSONAL mode is that an attacker who captures one client's 4-way handshake can try passwords offline as fast as their hardware allows, so a short or common passphrase falls quickly. WPA3 (2018) replaces that handshake with SAE (simultaneous authentication of equals), which defeats offline guessing, gives FORWARD SECRECY (capturing traffic today does not help decrypt it later if the password leaks), protects management frames, and adds 'Enhanced Open' encryption even for passwordless networks. WPA3 is REQUIRED on 6 GHz. The WPA2/WPA3 TRANSITION mode lets old and new clients share one SSID. Rules for any network you run: WPA3 (or at least WPA2 with AES) only, a long passphrase (four or more random words, or 15+ characters), and change it when staff leave. In NetLab, an access point refuses band 6 until its security is wpa3, exactly as real Wi-Fi 6E equipment does.",
        netLab: {
          task:
            "AP1 is still running as an OPEN network called Clinic-WiFi on 2.4 GHz: anyone nearby can join and read unencrypted traffic. Secure it with WPA3 and the passphrase Lekki-Clinic-Secure-77, then move it to the 6 GHz band (channel 37) for the clinic's new Wi-Fi 6E tablets. Finally connect the tablet (a laptop in NetLab) and ping the router.",
          devices: [
            { id: "R1", kind: "router", x: 50, y: 6 },
            { id: "SW1", kind: "switch", x: 50, y: 22 },
            { id: "AP1", kind: "ap", x: 50, y: 40, wifi: { ssid: "Clinic-WiFi", security: "open", passphrase: "", band: "2.4", channel: 6 } },
            { id: "Tablet", kind: "laptop", x: 80, y: 54, dhcp: true },
          ],
          links: [["R1:g0/0", "SW1:g0/1"], ["AP1:port0", "SW1:fa0/1"]],
          config: { R1: OFFICE_ROUTER, SW1: "hostname SW1" },
          start: "AP1",
          height: 58,
          goals: [
            { type: "ap", device: "AP1", security: "wpa3", band: "6", channel: 37, label: "AP1 uses WPA3 on 6 GHz, channel 37" },
            { type: "wifi", client: "Tablet", label: "The tablet is connected" },
            { type: "ping", from: "Tablet", to: "192.168.60.1", label: "The tablet reaches the router" },
          ],
          hint: "On AP1: security wpa3, passphrase Lekki-Clinic-Secure-77, band 6, channel 37, show. (band 6 is rejected until security is wpa3.) On the tablet: wifi connect Clinic-WiFi Lekki-Clinic-Secure-77, then ping 192.168.60.1.",
          successMessage: "Encrypted with WPA3, on the clean 6 GHz band, with a passphrase nobody will guess. The order mattered: 6 GHz will not run anything weaker.",
        },
      },
      {
        id: "a-nw-wireless-auth",
        title: "Wireless network authentication",
        explain:
          "Wi-Fi authenticates users in one of two ways. PERSONAL mode (WPA2-PSK, WPA3-SAE) uses ONE SHARED PASSPHRASE for everyone. It is simple and fine for homes and small offices, but everyone who knows the passphrase is equal, you cannot tell users apart in logs, and when one person leaves or the passphrase leaks, it must be changed on every device. ENTERPRISE mode (WPA2/WPA3-Enterprise, also called 802.1X) gives each user or device its OWN credentials: a username and password from the company directory, or better, a digital CERTIFICATE. The access point passes the login to a RADIUS server (such as Microsoft NPS, FreeRADIUS or Cisco ISE), which checks it against the directory and can also assign the user's VLAN. Disabling one account removes only that person, and every connection is logged by name. Public Wi-Fi often adds a CAPTIVE PORTAL (a web page to accept terms or log in) on top of an open or enhanced-open network; it controls access but does not by itself encrypt anything.",
        decision: dec(
          "A bank's head office has 600 staff on Wi-Fi with one shared passphrase. An employee is dismissed, and security asks for their wireless access to be revoked immediately without disturbing anyone else.",
          "What design would make that possible?",
          ["WPA2/WPA3-Enterprise (802.1X) with RADIUS, so each person logs in with their own account and disabling one account removes only them", "Individual credentials allow individual revocation and logging."],
          [
            ["Changing the shared passphrase every week", "Every change disrupts all 600 users, and the leaver still knows it until the next change."],
            ["Hiding the SSID", "Hiding the SSID is not access control."],
            ["Switching to WEP", "WEP is broken and has no per-user accounts."],
          ]
        ),
      },
      {
        id: "a-nw-guest-networks",
        title: "Guest networks",
        explain:
          "Visitors, contractors and customers need internet access, but they must never reach the organisation's internal systems. A GUEST NETWORK provides exactly that: a separate SSID (for example 'MST-Guest') mapped to its own VLAN and subnet, with a firewall policy that allows the internet and DENIES everything internal (file servers, printers, management interfaces). Good guest designs add CLIENT ISOLATION, so guests cannot reach each other's devices either; BANDWIDTH LIMITS, so guests cannot consume the business's link; a passphrase that changes regularly, or a captive portal with vouchers or sign-in; and logging, which in many countries is needed for legal reasons. Never give guests the staff Wi-Fi passphrase: a single infected visitor laptop on the staff network is a breach. Many organisations also put IoT devices (smart TVs, cameras, sensors) on a similar isolated SSID and VLAN of their own.",
        decision: dec(
          "A law firm's visitors join a guest Wi-Fi network that is a separate SSID, but it is bridged into the same VLAN and subnet as the staff PCs and the document server.",
          "What is wrong with this design?",
          ["Guests are on the same network as internal systems, so a guest device can reach the document server; the guest SSID must map to its own VLAN with a firewall denying internal access", "A separate name is cosmetic; separation happens at the VLAN and firewall."],
          [
            ["Nothing: a different SSID already separates them", "Both SSIDs lead to the same network."],
            ["The guest network should use the staff passphrase instead", "That removes even the cosmetic separation."],
            ["Guest networks must use 2.4 GHz only", "The band is irrelevant to separation."],
          ]
        ),
      },
      {
        id: "a-nw-mesh-wifi",
        title: "Mesh Wi-Fi systems",
        explain:
          "In a MESH Wi-Fi system, several access points (NODES) work as one network, and some of them connect back to the network WIRELESSLY, through other nodes, instead of by cable. One node is wired to the router; the others relay traffic over a radio BACKHAUL. Mesh systems (Google Nest Wifi, TP-Link Deco, eero, and enterprise mesh features) are easy to install in homes and buildings where running cable is hard, they heal themselves by finding another path if a node fails, and they present one SSID with roaming. The cost is throughput: every wireless hop uses airtime, and a node that relays on the same radio it serves clients on can halve the speed at each hop. Better systems use a DEDICATED backhaul radio (tri-band), or a wired (Ethernet) backhaul wherever a cable can be run. A RANGE EXTENDER (repeater) is a simpler, older idea with the same airtime penalty and usually a separate network name.",
        decision: dec(
          "A family's three-storey house in Abuja has a fibre ONT in the ground-floor office and dead spots upstairs. Running cable between floors is not possible.",
          "What is the best way to cover the house?",
          ["A mesh system with a node wired to the router downstairs and wireless-backhaul nodes on each floor, preferably tri-band with a dedicated backhaul", "Mesh extends one network without cables, at some cost in throughput."],
          [
            ["One access point with the transmit power turned up", "Clients' radios still have to reach back, and floors absorb the signal."],
            ["A separate router on each floor with its own network", "That creates separate networks and no roaming."],
            ["Moving the house to 6 GHz only", "6 GHz has the shortest range of all."],
          ]
        ),
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 6 · 6.17 – 6.20
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "nw-wl6-isp",
    moduleId: M,
    sectionId: SECTION_ID,
    order: 6,
    covers: ["6.17", "6.18", "6.19", "6.20"],
    title: "ISPs, Fibre and the Internet Backbone",
    subtitle: "From your building to the cables under the ocean",
    estimatedMinutes: 40,
    intro:
      "Your traffic leaves the building through an internet service provider. This lesson follows it from the provider's access network to the long-distance backbone and the submarine cables that connect Africa to the world.",

    atoms: [
      {
        id: "a-nw-isps",
        title: "Internet Service Providers (ISPs)",
        explain:
          "An INTERNET SERVICE PROVIDER sells connectivity to the internet. ISPs are often described in TIERS. TIER 1 networks reach every part of the internet without paying anyone for transit, by PEERING with each other (exchanging traffic free) across continents; there are only a handful worldwide. TIER 2 providers peer where they can and buy TRANSIT (paid access to the rest of the internet) from Tier 1s; large national and regional carriers are usually here. TIER 3 providers mainly buy transit and sell to homes and businesses. In Nigeria, mobile operators (MTN, Airtel, Glo, 9mobile) provide most internet access, alongside fixed and wireless ISPs and wholesale carriers that own fibre and submarine cable capacity; the NCC regulates them. For an organisation, choosing an ISP means comparing reach, the technology available at the site, the service level agreement (SLA), support quality and price, and buying from TWO different providers over physically different routes where uptime matters.",
        decision: dec(
          "A hospital's critical systems depend on cloud services. It currently has one fibre link from one ISP, and the cable is cut by road works twice a year.",
          "What should the network team recommend?",
          ["A second connection from a different ISP over a physically different route (for example a fixed-wireless or 4G/5G link), with automatic failover", "Diversity of provider and path removes the single point of failure."],
          [
            ["A faster plan from the same ISP on the same cable", "Speed does not help when the cable is cut."],
            ["Two links from the same ISP in the same trench", "One digger still cuts both."],
            ["Moving the cloud services onto staff laptops", "That abandons the requirement instead of meeting it."],
          ]
        ),
      },
      {
        id: "a-nw-fibre-internet",
        title: "Modems, ONTs and fibre-optic internet",
        explain:
          "Most new fixed broadband is FIBRE TO THE HOME or premises (FTTH, FTTP), usually built as a PON (passive optical network, commonly GPON or the faster XGS-PON). The provider's OLT (optical line terminal) in an exchange sends light down one fibre that is split by PASSIVE SPLITTERS (no power needed) to as many as 32 or 64 premises, so neighbours share the capacity of one fibre. At each premises an ONT converts light to Ethernet (Module 5), often built into the Wi-Fi router the ISP supplies. Older technologies still in use: DSL over telephone copper (speed falls with distance from the exchange), cable broadband over coax, FIXED WIRELESS (a rooftop antenna aimed at the provider's tower, common in Nigerian cities), 4G/5G home routers, and SATELLITE, now including low-earth-orbit services such as Starlink with far lower latency than traditional geostationary satellites (around 30–50 ms instead of about 600 ms). Whatever the technology, the box where the provider's link meets your network is the demarcation point.",
        decision: dec(
          "Customers on one street with GPON fibre notice their speeds drop every evening, though each pays for 100 Mbps.",
          "Which property of GPON most likely explains this?",
          ["Up to 32 or 64 premises share one fibre's capacity through passive splitters, so everyone's evening usage competes", "A PON is a shared medium between neighbours."],
          [
            ["Fibre slows down when it gets cold in the evening", "Light in glass does not slow with temperature changes like that."],
            ["Each house has its own dedicated fibre to the internet", "In a PON the fibre is split and shared."],
            ["ONTs only work in daylight", "There is no such limitation."],
          ]
        ),
      },
      {
        id: "a-nw-broadband-dedicated",
        title: "Broadband and dedicated internet connections",
        explain:
          "Businesses choose between two kinds of service. BROADBAND (consumer or business broadband over fibre, cable, DSL, wireless or mobile) is CONTENDED: capacity is shared with other customers (a contention ratio such as 20:1 means up to 20 customers share the capacity sold), speeds are 'up to' figures, upload is often slower than download (ASYMMETRIC), there is little or no SLA, and the IP address may change. It is cheap. A DEDICATED connection (dedicated internet access, a leased line or Metro Ethernet) gives UNCONTENDED capacity reserved for you, usually SYMMETRIC (the same speed both ways, which matters for video conferencing, cloud backups and hosting), a static block of public IP addresses, and an SLA guaranteeing availability (for example 99.9 percent), repair times and latency, with penalties if the provider misses them. It costs far more. Many organisations combine them: a dedicated primary link plus a broadband or mobile backup.",
        table: {
          caption: "Broadband versus dedicated access.",
          headers: ["", "Broadband", "Dedicated"],
          rows: [
            ["Capacity", "Shared (contended)", "Reserved for you"],
            ["Speed", "'Up to' figures, often asymmetric", "Guaranteed, usually symmetric"],
            ["SLA", "None or basic", "Availability, repair time, latency"],
            ["IP addresses", "Often dynamic", "Static public block"],
            ["Cost", "Low", "High"],
          ],
        },
        decision: dec(
          "A fintech company hosts its payment platform in its own server room. It needs guaranteed upload capacity, static public addresses and a provider who must fix faults within four hours.",
          "Which kind of connection meets these requirements?",
          ["A dedicated internet access circuit with an SLA", "Guaranteed symmetric capacity, static IPs and contractual repair times define dedicated access."],
          [
            ["A home fibre broadband plan", "Contended, asymmetric, no SLA."],
            ["A 4G mobile router", "Fine as a backup, but contended with no SLA."],
            ["The office's guest Wi-Fi", "Guest Wi-Fi is a local network, not an internet service."],
          ]
        ),
      },
      {
        id: "a-nw-backbone-cables",
        title: "The internet backbone and submarine cables",
        explain:
          "The INTERNET BACKBONE is the set of very high-capacity links (terabits per second over fibre, using many wavelengths of light on each fibre pair) between the major networks, cities and data centres. About 99 percent of traffic between continents travels through SUBMARINE CABLES on the sea floor, not satellites. A submarine cable holds a few fibre pairs inside layers of steel and copper (the copper powers REPEATERS that amplify the light every 50 to 100 km) and lands at CABLE LANDING STATIONS. West Africa's connectivity grew with each new cable: SAT-3/WASC (2002), then Glo-1 and MainOne (2010), WACS and ACE, and more recently very high-capacity systems such as Google's Equiano and the 2Africa cable built by a Meta-led consortium, several of which land in Lagos. Cables are cut by ship anchors, fishing and undersea landslides: in 2024 cuts to several cables off West Africa slowed the internet across a dozen countries for days, which is why carriers buy capacity on several cables and route traffic around a failure.",
        decision: dec(
          "Several submarine cables off the coast of West Africa are damaged by an undersea landslide. Internet access slows across the region but does not stop completely.",
          "Why does it slow rather than stop?",
          ["Traffic is rerouted onto the remaining undamaged cables and land routes, which then carry more than their normal load", "Carriers spread capacity across several cables, so losing some reduces capacity rather than cutting everything."],
          [
            ["Most intercontinental traffic actually goes by satellite", "About 99 percent travels by submarine cable."],
            ["The cables repair themselves within minutes", "Repairs need a cable ship and take days or weeks."],
            ["Local websites stop working but foreign ones are unaffected", "It is the foreign traffic that has lost capacity; content hosted locally is affected least."],
          ]
        ),
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 7 · 6.21 – 6.24, 6.P
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "nw-wl7-internet-paths",
    moduleId: M,
    sectionId: SECTION_ID,
    order: 7,
    covers: ["6.21", "6.22", "6.23", "6.24", "6.P"],
    title: "Autonomous Systems, IXPs, CDNs and the Practical",
    subtitle: "How the internet's networks connect, and how a request finds a website",
    estimatedMinutes: 55,
    intro:
      "The internet is not one network but tens of thousands, joined by agreement. This lesson shows how they connect, why keeping traffic local matters, how content is brought close to users, and then traces a real lookup from the root of the internet down.",

    atoms: [
      {
        id: "a-nw-autonomous-systems",
        title: "Autonomous Systems (AS)",
        explain:
          "You met autonomous systems in Module 5's BGP lesson. An AUTONOMOUS SYSTEM is a network (or group of networks) under ONE organisation's control with ONE routing policy, identified by an AS NUMBER (ASN) issued by a regional registry such as AFRINIC. ISPs, mobile operators, universities, cloud providers, large banks and content companies each have one or more. Inside its AS, an organisation routes however it likes (OSPF and so on). BETWEEN ASes, BGP carries the reachability of address blocks and the AS PATH. Two kinds of business relationship connect ASes: TRANSIT (a customer pays a provider to reach the whole internet) and PEERING (two networks exchange traffic between their own customers, usually free, because both benefit). Every packet you send to a website crosses several ASes: your ISP's, possibly a transit carrier's or two, and the website's or its CDN's. Public tools (bgp.he.net, for example) show who owns an address block and which ASes connect to which.",
        decision: dec(
          "A university wants its own block of public IP addresses and connections to two different ISPs, with its own routing policy between them.",
          "What does it need to obtain and run?",
          ["Its own AS number from the regional registry (AFRINIC), and BGP sessions with both ISPs announcing its address block", "Multihoming with your own policy means becoming an autonomous system."],
          [
            ["A bigger DHCP pool", "DHCP gives out addresses inside a network; it does not connect to ISPs."],
            ["OSPF with both ISPs", "OSPF runs inside one organisation."],
            ["Two default routes and nothing else", "That cannot announce the university's addresses to the internet."],
          ]
        ),
      },
      {
        id: "a-nw-ixps",
        title: "Internet Exchange Points (IXPs)",
        explain:
          "An INTERNET EXCHANGE POINT is a place, usually a switched Ethernet fabric in one or more data centres, where many networks connect to EXCHANGE TRAFFIC DIRECTLY (peer) instead of sending it through paid transit providers, often overseas. Without a local IXP, an email from a customer of one Nigerian ISP to a customer of another might travel to London and back over expensive submarine capacity ('tromboning'), adding latency and cost. With one, it stays in the country. The Internet Exchange Point of Nigeria (IXPN), in Lagos with presence in other cities, connects ISPs, mobile operators, banks, government networks and content providers. Africa's largest exchanges include NAPAfrica and IXPN, and large content companies connect at them, so popular services are reached locally. IXPs make the internet faster, cheaper and more resilient for everyone in the region, and keep local traffic working even when international links fail.",
        decision: dec(
          "Before a local exchange existed, users on one Nigerian ISP saw 180 ms latency to a bank's website hosted with another Nigerian ISP in the same city. After both joined the IXP, latency fell to 8 ms.",
          "What changed?",
          ["Traffic between the two networks now crosses the local exchange directly instead of travelling to Europe and back through transit providers", "Local peering removes the overseas detour."],
          [
            ["The bank bought faster servers", "Server speed does not explain a fall from 180 ms to 8 ms."],
            ["The IXP encrypted the traffic", "IXPs do not encrypt traffic, and encryption does not reduce latency."],
            ["The users switched to fibre on the same day", "The change came from joining the exchange."],
          ]
        ),
      },
      {
        id: "a-nw-cdns",
        title: "Content Delivery Networks (CDNs)",
        explain:
          "A CONTENT DELIVERY NETWORK keeps copies of websites' content on servers spread across the world, close to users, so content is delivered from nearby instead of from one distant origin server. When you stream a film, download a software update or open a popular site, the content usually comes from a CDN server (an EDGE or point of presence) in or near your country, often inside your ISP's own network or at the local IXP. Akamai, Cloudflare, Amazon CloudFront, Google's and Netflix's own CDNs are examples. Benefits: much LOWER LATENCY and faster loading, LESS international bandwidth used (cheaper for ISPs, and resilient when submarine cables are cut), and protection of the origin server, because the CDN absorbs traffic spikes and denial-of-service attacks. CDNs direct users to the nearest edge mainly through DNS (the name resolves to a nearby server's address) or ANYCAST (the same IP address announced from many places, with BGP routing each user to the closest).",
        decision: dec(
          "A Nigerian streaming start-up's videos load slowly for users in Kenya and South Africa, because every video comes from one server in Lagos.",
          "What should it use to fix this?",
          ["A CDN, so the videos are cached on edge servers near users in each country", "Bringing content close to users is exactly what CDNs do."],
          [
            ["A faster server in Lagos", "The distance and international links remain the bottleneck."],
            ["A bigger DHCP pool", "DHCP is about local addressing."],
            ["Telling users to switch to 2.4 GHz Wi-Fi", "Local Wi-Fi is not the problem."],
          ]
        ),
      },
      {
        id: "a-nw-reaching-websites",
        title: "How internet traffic reaches websites and cloud platforms",
        explain:
          "Put it all together for one request to https://example.com. 1. DNS: your device asks its resolver, which (if it has nothing cached) walks down from the ROOT servers to the .com servers to example.com's authoritative servers (Module 4), and gets an address, quite possibly a CDN's nearby edge. 2. Your device sends the packets to its default gateway, through your Wi-Fi or switch, and out of your router, which applies PAT. 3. Your ISP routes them through its own network (its AS), then out by peering at an IXP or by transit, perhaps across a submarine cable, through other ASes chosen by BGP. 4. The packets arrive at the CDN edge or the cloud platform's network, where load balancers pass them to a server. 5. A TCP (or QUIC) connection and TLS encryption are set up, the HTTP request is answered, and the reply retraces the path. On Linux, dig +trace followed by a name shows step 1 for real: instead of asking your resolver, dig itself starts at the root servers and follows each referral down, printing every step and which server answered. dig +short followed by a name prints just the final address, and curl -sI followed by an https:// address shows the response headers, often revealing the CDN in front of the site.",
        terminalExercise: term("m6-internet", {
          goal: "Watch name resolution happen step by step: make dig start at the root of the DNS and follow the referrals down to the servers that hold the address of example.com.",
          accept: ["dig +trace example.com"],
          near: [
            { command: "dig +short example.com", why: "That asked the lab's resolver and printed only the final address. The goal is to see every step from the root down." },
            { command: "curl -sI https://example.com", why: "That fetched the website's headers over HTTPS. Useful, but the goal is the DNS resolution path." },
          ],
          hint: "dig with the option that traces from the root: +trace, then the name.",
          success: "The root servers (the . lines), then the com. servers, then example.com's own name servers, each referring dig one step closer until the final A record. Every lookup your resolver makes on your behalf follows that chain.",
        }),
      },
    ],

    requirements: { read: true, video: false, assessment: true },

    task: {
      title: "Module 6 practical: wireless and the path to the internet",
      intro:
        "Use your own home or office equipment, with permission. Change Wi-Fi settings only on networks you manage, and write down every original setting first so you can put it back.",
      prompts: [
        "Configure and secure a wireless router: set a clear SSID, WPA3 (or WPA2-AES if a device cannot do WPA3), a strong passphrase, and change the default administrator password. Record what you changed.",
        "Use a free Wi-Fi analyser app on a phone or laptop to record the signal strength (dBm) in five places around the building, and list the networks and channels nearby. Identify any co-channel or adjacent-channel neighbours.",
        "Design wireless coverage for a small office of 12 desks in three rooms and a meeting room: how many access points, where, on which bands and channels, and with which SSIDs (staff and guest). Draw it.",
        "Trace a request from your computer to a public website: use tracert or traceroute, nslookup or dig +trace, and look up the AS that owns the website's address on a site such as bgp.he.net. Write up the journey.",
      ],
      closing:
        "Every network you have built so far used devices you could only reach through a simulator. Module 7 puts you on a real Linux server: its interfaces, services, SSH and firewall.",
    },
  },
];
