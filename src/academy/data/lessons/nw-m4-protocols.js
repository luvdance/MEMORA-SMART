/**
 * COMPUTER NETWORKING · MODULE 4 · ESSENTIAL NETWORKING PROTOCOLS AND SERVICES
 *
 * Curriculum 4.1 – 4.28 and the practical. TCP and UDP, ports and sockets,
 * the handshake, reliability; the application protocols (web, files, mail,
 * remote access, management, time); DNS, DHCP, NAT and PAT, ARP, ICMP,
 * gateways and proxies.
 *
 * New tools, each taught before it is graded: curl -I, ssh, dig, ss and
 * netstat on the recorded Ubuntu machines; the tcp.flags.syn and udp.port
 * display filters; and the router commands for DHCP pools and NAT.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

import { cap, dec, term } from "./nw-kit.js";

export const SECTION_ID = "nw-s4-protocols";
const M = "nw-m4-protocols";

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 1 · 4.1 – 4.3
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "nw-pr1-transport",
    moduleId: M,
    sectionId: SECTION_ID,
    order: 1,
    covers: ["4.1", "4.2", "4.3"],
    title: "TCP and UDP",
    subtitle: "The two transport protocols, and when each one is the right choice",
    estimatedMinutes: 35,
    intro:
      "In Module 2 you met the Transport layer: it delivers data between applications. Almost every application on earth uses one of just two transport protocols. This lesson explains what each does and why an application picks one or the other.",

    atoms: [
      {
        id: "a-nw-tcp",
        title: "TCP: Transmission Control Protocol",
        explain:
          "TCP is the RELIABLE transport protocol. Before any data is sent, the two hosts set up a CONNECTION (the three-way handshake in Lesson 3). TCP then numbers every byte it sends (SEQUENCE NUMBERS), and the receiver sends back ACKNOWLEDGEMENTS saying what has arrived. Anything not acknowledged in time is sent again (RETRANSMISSION). Segments that arrive out of order are put back in order before the application sees them, and FLOW CONTROL stops a fast sender from overwhelming a slow receiver. The result: the application receives exactly the bytes that were sent, in order, or a clear error. The price is overhead: a bigger header (at least 20 bytes), the handshake before any data, and waiting for acknowledgements. Use TCP whenever every byte matters: web pages (HTTP and HTTPS), email, file transfers, SSH sessions, database connections.",
        decision: dec(
          "A bank's mobile app sends a transfer instruction: 'send ₦50,000 to account 0123456789'.",
          "Why must this travel over TCP?",
          ["Every byte must arrive, in order and unchanged; TCP detects anything lost and resends it", "A missing or reordered digit in a payment is unacceptable, and reliability is exactly what TCP provides."],
          [
            ["TCP is faster than UDP", "TCP is slower, because of its handshake and acknowledgements. It is chosen for reliability, not speed."],
            ["TCP encrypts the data", "TCP does not encrypt; TLS on top of it (HTTPS) does."],
            ["UDP cannot carry numbers", "UDP can carry any data; it just does not guarantee delivery."],
          ]
        ),
      },
      {
        id: "a-nw-udp",
        title: "UDP: User Datagram Protocol",
        explain:
          "UDP is the LIGHTWEIGHT transport protocol. It sends each message, called a DATAGRAM, on its own, with no connection set-up, no acknowledgements, no retransmission and no reordering. Its header is just 8 bytes: source port, destination port, length and checksum. If a datagram is lost, UDP does nothing about it; the application decides whether that matters. That sounds worse, but it makes UDP FAST and LOW-LATENCY, and it is the right choice when a late answer is useless or the application handles loss itself. Live voice and video calls use UDP: if one packet of a WhatsApp call is lost, resending it a second later would only produce a glitch at the wrong moment, so the app simply carries on. Online games, live streaming, DNS lookups (one small question, one small answer; just ask again if it is lost), DHCP and time synchronisation (NTP) all use UDP.",
        decision: dec(
          "During a Zoom call on a busy network, a few packets of your colleague's voice are lost. You hear a tiny click and the conversation carries on.",
          "Why is that the right behaviour, and which protocol produces it?",
          ["UDP: resending lost voice packets would deliver them too late to be useful, so the call keeps going without them", "For real-time media, low delay matters more than perfect delivery."],
          [
            ["TCP: it resent the lost packets instantly", "TCP would pause the stream to wait for the resend, causing a freeze rather than a click."],
            ["UDP: it guarantees every packet arrives eventually", "UDP guarantees nothing; that is its point."],
            ["TCP: it skips packets it cannot deliver", "TCP never skips data; it retransmits until it succeeds or the connection fails."],
          ]
        ),
      },
      {
        id: "a-nw-tcp-vs-udp",
        title: "TCP versus UDP",
        explain:
          "The choice between them is a trade-off between RELIABILITY and SPEED. Ask one question about the application: is it worse for data to arrive LATE, or to arrive INCOMPLETE? If incomplete is worse (a web page, a file, an email, a payment), use TCP. If late is worse (a call, a game, a live stream), use UDP. Some protocols use both: DNS normally uses UDP port 53 for quick lookups, but switches to TCP for very large answers and for copying whole zones between servers. And the newest web protocol, HTTP/3, runs over QUIC, which is built on UDP but adds its own reliability inside the application, to avoid TCP's handshake delays.",
        table: {
          caption: "The two transport protocols side by side.",
          headers: ["", "TCP", "UDP"],
          rows: [
            ["Connection", "Set up first (three-way handshake)", "None: just send"],
            ["Delivery", "Guaranteed, or an error", "Best effort: may be lost"],
            ["Order", "Reassembled in order", "Arrives as it arrives"],
            ["Retransmission", "Yes, automatically", "No (the application may)"],
            ["Header size", "20 bytes or more", "8 bytes"],
            ["Speed and delay", "Slower, more overhead", "Faster, lower latency"],
            ["Used by", "HTTP/HTTPS, SSH, SMTP, IMAP, FTP", "DNS, DHCP, VoIP, video calls, games, NTP"],
          ],
        },
        decision: dec(
          "A developer is building two features: a software-update download for a router, and a live security-camera feed for a phone app.",
          "Which transport protocol suits each?",
          ["TCP for the update (every byte must be correct), UDP for the live feed (late frames are useless)", "Ask whether incomplete or late is worse, for each one separately."],
          [
            ["UDP for both, because it is faster", "A corrupted firmware update could brick the router; it needs TCP's reliability."],
            ["TCP for both, because it is reliable", "A live feed that pauses to resend old frames falls further and further behind."],
            ["UDP for the update, TCP for the feed", "That is backwards."],
          ]
        ),
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 2 · 4.4 – 4.5
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "nw-pr2-ports",
    moduleId: M,
    sectionId: SECTION_ID,
    order: 2,
    covers: ["4.4", "4.5"],
    title: "Ports and Sockets",
    subtitle: "How one computer runs many network conversations at once",
    estimatedMinutes: 30,
    intro:
      "An IP address gets data to the right computer. But your laptop may have a browser, an email app and a video call all talking at once. Ports get the data to the right application on that computer.",

    atoms: [
      {
        id: "a-nw-ports-sockets",
        title: "Ports and sockets",
        explain:
          "A PORT is a number from 0 to 65,535 in the TCP or UDP header that identifies which APPLICATION on a host the data is for. Servers LISTEN on fixed, agreed ports so clients know where to knock: a web server listens on TCP port 80 (HTTP) and 443 (HTTPS), an SSH server on 22. When a client starts a conversation, its operating system picks a random high-numbered SOURCE PORT for its own side, for example 51544, so the server's reply comes back to the right browser tab. A SOCKET is the combination of an IP address, a protocol and a port, written like 93.184.215.14:443, and one CONNECTION is identified by both ends' sockets: client IP and port plus server IP and port. That is how a server talks to thousands of clients on the same port 443 at once: every connection has a different client socket. You saw this in the Module 2 capture: the lab computer used a random port in the 30,000s and the server answered from port 80.",
        netCalc: {
          task: "A laptop at 192.168.1.15 opens https://example.com, whose server is 93.184.215.14. The laptop's operating system chooses source port 51544. HTTPS servers listen on TCP port 443.",
          questions: [
            { q: "Write the SERVER's socket (address:port).", answer: "93.184.215.14:443", hint: "The server's IP address, a colon, then the port HTTPS listens on.", working: "Server socket = 93.184.215.14:443" },
            { q: "Write the LAPTOP's socket for this connection.", answer: "192.168.1.15:51544", hint: "The laptop's IP address and the source port its operating system chose.", working: "Client socket = 192.168.1.15:51544" },
            { q: "The server's reply is addressed to which destination port?", answer: "51544", hint: "Replies go back to the port the request came from.", working: "Reply destination port = the client's source port, 51544" },
          ],
          successMessage: "Two sockets identify one connection. Thousands of browsers can talk to port 443 at once because every one of them has a different socket of its own.",
        },
      },
      {
        id: "a-nw-port-ranges",
        title: "Well-known, registered and dynamic ports",
        explain:
          "The 65,536 port numbers are divided into three ranges by IANA, the body that keeps the official list. WELL-KNOWN PORTS, 0 to 1023, are reserved for the most common services; on Linux only the administrator can start a program that listens on one. REGISTERED PORTS, 1024 to 49151, are assigned to specific applications on request: 3306 for MySQL, 3389 for Windows Remote Desktop, 5432 for PostgreSQL, 8080 commonly for a second web server. DYNAMIC (or ephemeral, or private) PORTS, 49152 to 65535, are the ones operating systems hand out as temporary source ports for client connections. (Linux uses 32768 to 60999 by default, which is why the lab computer chose a port in the 30,000s.) You should know the well-known ports in the table by heart: they appear in firewall rules, exam questions and every troubleshooting session.",
        table: {
          caption: "Ports every network engineer knows by heart.",
          headers: ["Port", "Protocol", "Transport", "Service"],
          rows: [
            ["20, 21", "FTP", "TCP", "File transfer (data, control)"],
            ["22", "SSH / SFTP", "TCP", "Secure remote login and file transfer"],
            ["23", "Telnet", "TCP", "Unencrypted remote login (avoid)"],
            ["25", "SMTP", "TCP", "Mail between servers"],
            ["53", "DNS", "UDP and TCP", "Name resolution"],
            ["67, 68", "DHCP", "UDP", "Address assignment (server, client)"],
            ["80", "HTTP", "TCP", "The web"],
            ["110", "POP3", "TCP", "Downloading email"],
            ["123", "NTP", "UDP", "Time synchronisation"],
            ["143", "IMAP", "TCP", "Reading email on the server"],
            ["161, 162", "SNMP", "UDP", "Device monitoring (queries, traps)"],
            ["443", "HTTPS", "TCP (and UDP for HTTP/3)", "The secure web"],
            ["587", "SMTP submission", "TCP", "Email apps sending mail"],
          ],
        },
        netCalc: {
          task: "Name the port or the range.",
          questions: [
            { q: "Which TCP port does HTTPS use?", answer: "443", hint: "Look at the table: the secure web.", working: "HTTPS = TCP 443" },
            { q: "Which port does SSH use?", answer: "22", hint: "Secure remote login.", working: "SSH = TCP 22" },
            { q: "Which port does DNS use?", answer: "53", hint: "Name resolution, usually over UDP.", working: "DNS = 53" },
            { q: "Port 51544 belongs to which range: well-known, registered or dynamic?", answer: "dynamic", accept: ["ephemeral", "private", "dynamic ports"], hint: "It is above 49151.", working: "49152–65535 = dynamic (ephemeral)" },
            { q: "Port 3389 belongs to which range: well-known, registered or dynamic?", answer: "registered", accept: ["registered ports"], hint: "It is between 1024 and 49151.", working: "1024–49151 = registered" },
          ],
          successMessage: "Learn the table cold. A firewall rule that says 'allow TCP 443' only means something if you know what lives there.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 3 · 4.6 – 4.9
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "nw-pr3-reliability",
    moduleId: M,
    sectionId: SECTION_ID,
    order: 3,
    covers: ["4.6", "4.7", "4.8", "4.9"],
    title: "The Handshake, Flow Control and Retransmission",
    subtitle: "How TCP opens a conversation and keeps it reliable",
    estimatedMinutes: 40,
    intro:
      "You will now see TCP's reliability machinery in a real capture: the three packets that open every connection, and the mechanisms that keep data flowing correctly even when the network misbehaves.",

    atoms: [
      {
        id: "a-nw-three-way-handshake",
        title: "The three-way handshake",
        explain:
          "Before a TCP connection carries any data, the two hosts exchange three segments. 1. SYN: the client sends a segment with the SYN (synchronise) flag set and its starting sequence number: 'I want to talk.' 2. SYN-ACK: the server replies with both the SYN and ACK (acknowledge) flags set: 'I heard you, and I want to talk too.' 3. ACK: the client acknowledges the server's SYN: 'Heard you. Let's go.' Now both sides know the other is reachable and willing, and both have agreed starting sequence numbers. If the server has nothing listening on that port, it answers the SYN with RST (reset) instead, which is the 'connection refused' you will see in Module 9. At the end, each side sends FIN (finish) to close its half of the connection. In Wireshark, the flags appear in square brackets in the Info column, for example [SYN, ACK]. The display filter tcp.flags.syn == 1 keeps only packets with the SYN flag set, which means the first two packets of every handshake in the capture. Use it on the website visit from Module 2.",
        captureExercise: {
          task: "Filter the capture to packets with the SYN flag set, then click the packet in which the SERVER agrees to the connection.",
          packets: cap("m2-web-visit"),
          expect: {
            maxRows: 2,
            packet: 6,
            mustContain: [5, 6],
            whyWrong: "Two packets have SYN set. The first comes from the client (192.168.56.10) and carries only [SYN]. The server's agreement carries both flags, [SYN, ACK], and comes from 192.168.56.20.",
            success: "Packet 6: 80 → client [SYN, ACK]. The third packet of the handshake (packet 7, [ACK]) has no SYN flag, which is why your filter hid it.",
          },
          hint: "Type tcp.flags.syn == 1 in the filter box and press Apply. Then look for [SYN, ACK] from the server's address.",
        },
      },
      {
        id: "a-nw-connection-oriented",
        title: "Connection-oriented versus connectionless communication",
        explain:
          "CONNECTION-ORIENTED communication sets up a relationship before sending data, keeps track of it during the exchange, and tears it down afterwards. TCP is connection-oriented: the handshake creates STATE on both hosts (sequence numbers, what has been acknowledged, window sizes) and a FIN exchange ends it. A phone call is the everyday version: dial, confirm the other person is there, talk, hang up. CONNECTIONLESS communication just sends each message independently, with no set-up and no memory of previous messages. UDP is connectionless, and so is IP itself: every packet is routed on its own. Posting a letter is the everyday version. Connection-oriented costs a round trip before the first byte of data and memory on the server for every open connection; connectionless is quicker to start and scales to huge numbers of one-off exchanges, such as the billions of DNS lookups made every day.",
        decision: dec(
          "A DNS server answers 50,000 lookups per second, each one a single small question and a single small answer.",
          "Why does DNS normally use connectionless UDP rather than connection-oriented TCP for this?",
          ["A handshake for every one-question exchange would triple the packets and the delay, and the server would have to remember 50,000 connections a second", "For one-off exchanges, connection set-up costs more than the exchange itself."],
          [
            ["UDP encrypts the lookups", "UDP does not encrypt."],
            ["TCP cannot carry DNS at all", "DNS can and does use TCP for large answers; it is just wasteful for small ones."],
            ["Connectionless means the answers always arrive", "Connectionless means nothing is guaranteed; the client simply asks again if needed."],
          ]
        ),
      },
      {
        id: "a-nw-flow-error",
        title: "Flow control and error detection",
        explain:
          "FLOW CONTROL stops a fast sender from overwhelming a slow receiver. In every TCP segment the receiver advertises a WINDOW: how many more bytes it can accept right now (you saw 'Win=64512' in the Module 2 capture). The sender may have only that many unacknowledged bytes in flight. If the receiver's buffer fills, it advertises a smaller window, even zero, and the sender waits. TCP also has CONGESTION CONTROL, which protects the network rather than the receiver: it starts slowly, speeds up while acknowledgements keep arriving, and backs off when packets are lost. ERROR DETECTION catches data damaged in transit. Every TCP and UDP header carries a CHECKSUM calculated over the segment; the receiver recalculates it, and if the two differ the segment is discarded (TCP will then resend it). At Layer 2, every Ethernet frame carries its own check, the FCS, so corrupted frames are dropped at the first switch or NIC that receives them.",
        decision: dec(
          "A powerful server sends a large file to an old, slow laptop. The laptop's TCP window shrinks to zero, and the server pauses until it grows again.",
          "Which mechanism is at work?",
          ["Flow control: the receiver advertises how much it can accept, and the sender respects it", "The window is the receiver saying 'slow down, I'm full'."],
          [
            ["Error detection", "Nothing is damaged; the receiver is simply busy."],
            ["Retransmission", "Nothing was lost; the sender is waiting, not resending."],
            ["The three-way handshake", "The connection is already open."],
          ]
        ),
      },
      {
        id: "a-nw-retransmission",
        title: "Retransmission and packet loss",
        explain:
          "PACKET LOSS happens when a packet never reaches its destination: a router's queue was full and it dropped the packet (CONGESTION), a frame was corrupted and discarded, a Wi-Fi signal faded, or a cable is faulty. TCP detects loss in two ways. A TIMEOUT: the sender starts a timer for each segment, and if no acknowledgement arrives before it expires, it sends the segment again. DUPLICATE ACKNOWLEDGEMENTS: the receiver keeps acknowledging the last byte it got in order; three identical acknowledgements in a row tell the sender that the next segment is missing, and it resends at once (FAST RETRANSMIT), without waiting for the timer. In Wireshark, these show up highlighted as 'TCP Retransmission' and 'TCP Dup ACK'. A little loss is normal on the internet. Steady loss of more than about 1 percent makes TCP throughput collapse, because every loss also makes congestion control slow down, and it makes voice and video calls choppy. Module 9 shows how to find where the loss happens.",
        decision: dec(
          "A user complains that downloads from the office file server are far slower than the 1 Gbps link should allow. A capture shows hundreds of 'TCP Retransmission' entries.",
          "What does that tell you?",
          ["Packets are being lost on the path and TCP keeps resending them and slowing down, so the problem is loss (a faulty cable, a mismatched link or congestion), not the server's disk", "Retransmissions are the visible symptom of loss, and loss cuts TCP throughput sharply."],
          [
            ["The server is sending data twice on purpose to be safe", "TCP only retransmits what it believes was lost."],
            ["UDP is being used instead of TCP", "UDP never retransmits; these are TCP retransmissions."],
            ["Everything is normal for a busy network", "A few are normal; hundreds during one download point to a real fault."],
          ]
        ),
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 4 · 4.10 – 4.13
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "nw-pr4-web-files-mail",
    moduleId: M,
    sectionId: SECTION_ID,
    order: 4,
    covers: ["4.10", "4.11", "4.12", "4.13"],
    title: "Web, File Transfer and Email Protocols",
    subtitle: "HTTP and HTTPS, FTP and SFTP, SMTP, POP3 and IMAP",
    estimatedMinutes: 40,
    intro:
      "These are the application protocols people use every day without knowing it. You will read a real web server's response headers, then see how files and email travel.",

    atoms: [
      {
        id: "a-nw-http",
        title: "HTTP and HTTPS",
        explain:
          "HTTP (HyperText Transfer Protocol) is how browsers and web servers talk. The client sends a REQUEST: a METHOD (GET to fetch a page, POST to submit a form), a PATH (/ for the home page) and HEADERS (such as the browser's name). The server sends a RESPONSE: a STATUS CODE and HEADERS, then the content. Status codes come in families: 2xx success (200 OK), 3xx redirection (301 Moved Permanently), 4xx a client error (404 Not Found, 403 Forbidden), 5xx a server error (500 Internal Server Error, 503 Service Unavailable). HTTP itself is plain text and uses TCP port 80, so anyone on the path can read and alter it. HTTPS is HTTP inside a TLS-encrypted connection on TCP port 443: the content is private and tamper-proof, and the server proves its identity with a certificate (Module 8). On Linux, the curl command makes HTTP requests from the terminal. curl followed by a web address prints the page. curl -I (a capital i) followed by a web address asks for the HEADERS only, which shows the status code and the server's details without the page, and is the quickest way to check a website is answering.",
        terminalExercise: term("m4-curl", {
          goal: "Check that the intranet web server is answering: fetch only the response headers of http://intranet.lab/, then read the status code and the name of the web server software.",
          accept: ["curl -I http://intranet.lab/"],
          near: [
            { command: "curl -s http://intranet.lab/", why: "That fetched the whole page. It shows the server works, but the goal asks for the headers only, where the status code and server name are." },
            { command: "curl -I http://intranet.lab/missing.html", why: "That checked a page that does not exist (404 Not Found). Ask for the headers of the home page, /, instead." },
          ],
          hint: "Use curl with -I (capital i) followed by the address http://intranet.lab/.",
          success: "HTTP/1.1 200 OK, served by nginx. The headers also give the content type and length. Compare the 404 Not Found for the missing page: same server, different status code.",
        }),
      },
      {
        id: "a-nw-ftp-sftp",
        title: "FTP and SFTP",
        explain:
          "FTP (File Transfer Protocol, 1971) moves files between a client and a server. It uses TWO TCP connections: a CONTROL connection on port 21 for commands (log in, list, change folder, get, put) and a separate DATA connection for each file transfer and listing (port 20 in 'active' mode, or a random server port in 'passive' mode, which is what most clients use today because it works through NAT and firewalls). FTP's fatal weakness is that EVERYTHING, including the username and password, travels in plain text, so anyone who can capture the traffic can read the login. SFTP (SSH File Transfer Protocol) does the same job inside an encrypted SSH connection on TCP port 22: one connection, encrypted login and data, and it reuses SSH keys. (FTPS is a different thing: classic FTP wrapped in TLS.) For any new system, use SFTP or HTTPS uploads, never plain FTP.",
        decision: dec(
          "A web designer uploads site files to a hosting server with plain FTP from a café's public Wi-Fi.",
          "What is the risk, and what should they use instead?",
          ["Their FTP username and password travel unencrypted and can be captured by anyone on the network; SFTP encrypts everything over SSH", "Plain FTP sends credentials in clear text; SFTP fixes that with one encrypted connection."],
          [
            ["No risk: FTP encrypts passwords by default", "Plain FTP encrypts nothing."],
            ["The upload will be slow; they should use UDP", "Speed is not the problem, and file transfer needs reliable TCP."],
            ["FTP only works on port 443", "FTP uses port 21 for control."],
          ]
        ),
      },
      {
        id: "a-nw-smtp",
        title: "SMTP",
        explain:
          "SMTP (Simple Mail Transfer Protocol) SENDS and RELAYS email. When you press Send, your email app submits the message to your provider's outgoing mail server using SMTP on TCP port 587, with a login and TLS encryption (port 465 is an older encrypted alternative). Your provider's server then finds the recipient's mail server by looking up the domain's MX record in DNS (Lesson 6) and delivers the message to it, server to server, over SMTP on TCP port 25. SMTP only moves mail TOWARDS a mailbox; it is never used to read mail. Because the original SMTP did not check who a sender really was, spam and forged senders were easy, so mail servers now check SPF, DKIM and DMARC records, published in DNS, to decide whether a message really came from the domain it claims.",
        decision: dec(
          "A company's new mail server can send email to Gmail users, but nothing anyone sends to the company ever arrives.",
          "Which is the most likely missing piece?",
          ["The company domain's MX record in DNS, which tells other mail servers where to deliver mail for it", "Senders' servers find the destination by MX lookup; without it they cannot deliver."],
          [
            ["The company needs IMAP to receive mail", "IMAP is for reading a mailbox, not for other servers to deliver into it."],
            ["SMTP cannot receive mail, only send it", "Server-to-server delivery is SMTP on port 25."],
            ["Gmail blocks all business email", "There is no such rule."],
          ]
        ),
      },
      {
        id: "a-nw-pop-imap",
        title: "POP3 and IMAP",
        explain:
          "Two protocols let an email app READ a mailbox stored on a server. POP3 (Post Office Protocol version 3, TCP port 110, or 995 encrypted) DOWNLOADS messages to one device and, traditionally, deletes them from the server. It is simple and works offline, but your mail ends up on one device: read it on your laptop and it is gone from your phone. IMAP (Internet Message Access Protocol, TCP port 143, or 993 encrypted) keeps the messages ON THE SERVER and SYNCHRONISES every device: read, delete or move a message on your phone and the laptop shows the same, folders included. That is why IMAP (or a provider's own equivalent, as in Gmail and Outlook apps) is the normal choice today, while POP3 survives where storage on the server is tiny or mail must be archived locally. Remember the direction: SMTP pushes mail towards a mailbox; POP3 and IMAP pull it out.",
        decision: dec(
          "A sales manager reads email on a phone, a laptop and an office PC, and wants every device to show the same folders and the same read and unread messages.",
          "Which protocol should the email apps use to read mail?",
          ["IMAP, because it keeps mail on the server and synchronises every device", "IMAP is built for many devices sharing one mailbox."],
          [
            ["POP3, because it downloads everything", "POP3 downloads to one device, so the others would not see the same state."],
            ["SMTP, because it handles email", "SMTP sends mail; it cannot read a mailbox."],
            ["FTP, to copy the mailbox file", "FTP is for files, not for synchronised mailboxes."],
          ]
        ),
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 5 · 4.14 – 4.17
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "nw-pr5-admin-protocols",
    moduleId: M,
    sectionId: SECTION_ID,
    order: 5,
    covers: ["4.14", "4.15", "4.16", "4.17"],
    title: "Remote Access, Monitoring and Time",
    subtitle: "SSH, Telnet, SNMP and NTP: the protocols that run the network",
    estimatedMinutes: 35,
    intro:
      "Users never see these protocols, but network engineers depend on them every day: to log in to devices remotely, to monitor them, and to keep their clocks right.",

    atoms: [
      {
        id: "a-nw-ssh",
        title: "SSH",
        explain:
          "SSH (Secure Shell, TCP port 22) gives you a command line on a remote computer or network device, over an ENCRYPTED connection. Everything is protected: the login, every command and every byte of output. The server proves its identity with a HOST KEY, which your client remembers after the first connection (and warns loudly if it ever changes, which could mean an impostor). You can log in with a password or, better, with a KEY PAIR: a private key that stays on your computer and a public key placed on the server. SSH also carries file transfers (SFTP, scp) and can forward other connections through its encrypted tunnel. On Linux, macOS and Windows, the command is ssh followed by user@host: ssh admin@srv01 logs in to srv01 as the user admin. Add a command after it, as in ssh admin@srv01 hostname, and SSH runs just that command on the remote machine, prints its output and disconnects. In this recorded terminal, the lab computer already holds a key that srv01's admin account trusts, so no password is needed.",
        terminalExercise: term("m4-ssh", {
          goal: "Using SSH as the user admin, run the command hostname on the server srv01, to prove you are executing commands on the remote machine and not on your own.",
          accept: ["ssh admin@srv01 hostname"],
          near: [
            { command: "ssh admin@srv01 whoami", why: "That proves which user you are logged in as on srv01, which is useful, but the goal asks for the machine's name: the hostname command." },
            { command: "ssh admin@srv01 uptime", why: "That shows how long srv01 has been running. The goal asks for its name: run hostname instead." },
          ],
          hint: "ssh, then admin@srv01, then the command to run there: hostname.",
          success: "It printed srv01, not ubuntu-lab: the command ran on the server, over an encrypted connection, authenticated by a key. The first line also shows SSH remembering the server's host key.",
        }),
      },
      {
        id: "a-nw-telnet",
        title: "Telnet",
        explain:
          "TELNET (TCP port 23) was SSH's predecessor, from 1969: it also gives you a remote command line, but with NO ENCRYPTION at all. The username, the password and every command cross the network as readable text, so anyone who captures the traffic (on a shared Wi-Fi, a compromised switch, or anywhere along the path) sees everything. Telnet should never be used to manage devices. You will still meet it in two places: very old equipment that supports nothing else (put it on an isolated management network and plan to replace it), and as a quick TOOL to test whether a TCP port is open: telnet mail.example.com 25 either connects (the port is open) or fails. On Cisco routers, the line vty settings decide whether remote logins may use Telnet, SSH or both, and secure configurations allow only SSH (Module 8 configures this).",
        decision: dec(
          "An auditor finds that the company's core switches accept remote logins with Telnet.",
          "Why is this a serious finding?",
          ["Telnet sends the administrator's username, password and every command in plain text, so anyone who can capture the traffic can take over the switches", "Management traffic must be encrypted; SSH should replace Telnet."],
          [
            ["Telnet is too slow for switches", "Speed is not the issue; confidentiality is."],
            ["Telnet uses UDP, which is unreliable", "Telnet uses TCP port 23."],
            ["Telnet cannot run commands on switches", "It can, which is exactly why exposed credentials are so dangerous."],
          ]
        ),
      },
      {
        id: "a-nw-snmp",
        title: "SNMP",
        explain:
          "SNMP (Simple Network Management Protocol) lets a central MONITORING system (the MANAGER, such as Zabbix, PRTG or LibreNMS) collect information from network devices (each runs an AGENT): interface traffic counters, CPU load, temperature, whether a link is up. The manager POLLS each agent regularly on UDP port 161, asking for values by their ID in the device's MIB (Management Information Base), and draws graphs and raises alarms. Devices can also send TRAPS, unrequested alerts such as 'interface Gi0/1 went down', to the manager on UDP port 162. Versions matter: SNMPv1 and v2c identify the manager by a COMMUNITY STRING, a shared password sent in plain text (and often left as the default 'public'); SNMPv3 adds real usernames, authentication and encryption, and is the only version to use on untrusted networks. Module 9 uses SNMP for performance monitoring.",
        decision: dec(
          "The network team wants an alert within seconds when any switch interface goes down, instead of waiting for the next five-minute poll.",
          "Which SNMP feature delivers that?",
          ["Traps: the switch sends an unrequested alert to the manager on UDP port 162 the moment the interface goes down", "Polling asks on a schedule; traps report events as they happen."],
          [
            ["Polling every five minutes", "That is the delay they want to avoid."],
            ["The community string 'public'", "That is a (weak) password, not an alerting mechanism."],
            ["SSH", "SSH is for logging in, not for automatic alerts."],
          ]
        ),
      },
      {
        id: "a-nw-ntp",
        title: "NTP",
        explain:
          "NTP (Network Time Protocol, UDP port 123) keeps device clocks accurate to within milliseconds by asking time servers and correcting for the network delay. Servers are arranged in STRATA: stratum 0 is the reference clock itself (an atomic clock or GPS receiver), stratum 1 servers are connected directly to one, stratum 2 servers learn from stratum 1, and so on. Organisations usually point their routers, switches and servers at a public pool (pool.ntp.org) or their own internal NTP server. Correct time is not a nicety. LOGS from different devices can only be lined up during an investigation if the clocks agree. CERTIFICATES (HTTPS) and login tickets (Kerberos, used by Windows domains) are rejected when clocks are wrong by more than a few minutes. And scheduled jobs such as backups run at the wrong moment. On a Cisco device the command ntp server followed by an address points it at a time server.",
        decision: dec(
          "During an incident investigation, the firewall's log says a suspicious login happened at 02:14, but the server's log shows the same session at 02:31.",
          "What would have prevented this confusion?",
          ["Synchronising every device's clock with NTP, so their logs line up", "Without common time, events across devices cannot be put in order."],
          [
            ["Using TCP instead of UDP for logging", "The transport is not the issue; the clocks are."],
            ["Deleting the firewall log", "That destroys evidence."],
            ["SNMP traps", "Traps send alerts; they do not set clocks."],
          ]
        ),
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 6 · 4.18 – 4.20
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "nw-pr6-dns",
    moduleId: M,
    sectionId: SECTION_ID,
    order: 6,
    covers: ["4.18", "4.19", "4.20"],
    title: "DNS: The Internet's Phone Book",
    subtitle: "Names, resolution, and the records that make email and websites findable",
    estimatedMinutes: 45,
    intro:
      "People remember names; networks route by addresses. DNS turns one into the other, billions of times a day. You used it in Module 1 and saw it in the Module 2 capture. Now you will configure it, trace how it works, and query its records.",

    atoms: [
      {
        id: "a-nw-dns",
        title: "DNS: Domain Name System",
        explain:
          "DNS translates human-readable names such as www.example.com into IP addresses. It is a worldwide, distributed, hierarchical database. Names are read right to left: the ROOT (an invisible dot at the end), then a TOP-LEVEL DOMAIN (TLD) such as .com, .org or .ng, then a domain registered by an organisation (example.com, or a Nigerian one such as unilag.edu.ng), then any names the organisation creates inside it (www, mail, intranet). Each organisation runs, or rents, AUTHORITATIVE servers that hold the true records for its domain. Every device is configured with the address of a RESOLVER (a recursive DNS server, usually provided by DHCP: your router, your ISP's server, or a public one such as 8.8.8.8 or 1.1.1.1) that does the looking up on its behalf. DNS uses UDP port 53 for normal queries. If a device has no working DNS server, everything addressed by name fails while addresses still work: the classic symptom 'ping 8.8.8.8 works but websites don't'. In the lab below, the PC has been given the wrong DNS server address. Use ipconfig /dns, nslookup and curl from Module 1 to fix and prove it.",
        netLab: {
          task:
            "The company's DNS server is SRV-DNS at 10.0.0.53, on the server network behind R1. It knows that portal.company.lab is the web server 10.0.0.80. Staff-PC was given the DNS server 10.0.0.99 by mistake, so names do not resolve. Check with nslookup, point Staff-PC at the right DNS server, then open the portal by name.",
          devices: [
            { id: "Staff-PC", kind: "pc", x: 12, y: 30, ip: "192.168.20.15/24", gateway: "192.168.20.1", dns: "10.0.0.99" },
            { id: "R1", kind: "router", x: 42, y: 30 },
            { id: "SW-Servers", kind: "switch", x: 68, y: 30 },
            { id: "SRV-DNS", kind: "server", x: 90, y: 14, ip: "10.0.0.53/24", gateway: "10.0.0.1", services: [53], records: { "portal.company.lab": "10.0.0.80" } },
            { id: "SRV-WEB", kind: "server", x: 90, y: 46, ip: "10.0.0.80/24", gateway: "10.0.0.1", services: [80], web: "<html><title>Staff Portal</title><h1>Staff Portal</h1><p>Payslips, leave requests and announcements.</p></html>" },
          ],
          links: [["Staff-PC:fa0", "R1:g0/0"], ["R1:g0/1", "SW-Servers:g0/1"], ["SRV-DNS:fa0", "SW-Servers:fa0/1"], ["SRV-WEB:fa0", "SW-Servers:fa0/2"]],
          config: {
            R1: "hostname R1\ninterface g0/0\n ip address 192.168.20.1 255.255.255.0\n no shutdown\ninterface g0/1\n ip address 10.0.0.1 255.255.255.0\n no shutdown",
            "SW-Servers": "hostname SW-Servers",
          },
          start: "Staff-PC",
          height: 50,
          goals: [
            { type: "dns", from: "Staff-PC", name: "portal.company.lab", address: "10.0.0.80", label: "Staff-PC resolves portal.company.lab to 10.0.0.80" },
            { type: "tcp", from: "Staff-PC", to: "portal.company.lab", port: 80, label: "Staff-PC opens the portal by name" },
          ],
          hint: "nslookup portal.company.lab fails because 10.0.0.99 is not a DNS server. ipconfig /dns 10.0.0.53, then nslookup portal.company.lab, then curl http://portal.company.lab/.",
          successMessage: "Same network, same routes; only the DNS server setting changed. 'Addresses work but names don't' always points at DNS.",
        },
      },
      {
        id: "a-nw-dns-resolution",
        title: "How a name resolves to an address",
        explain:
          "When you type www.example.com, resolution goes like this. 1. Your device checks its own CACHE (and its hosts file); if it looked the name up recently, it is done. 2. Otherwise it sends a RECURSIVE query to its resolver: 'find me the answer, whatever it takes.' 3. The resolver checks its own cache. If it has nothing, it starts at the top: it asks a ROOT server, which replies 'I don't know www.example.com, but here are the servers for .com' (a REFERRAL). 4. It asks a .com TLD server, which refers it to example.com's authoritative servers. 5. It asks example.com's AUTHORITATIVE server, which gives the actual answer. Steps 3 to 5 are ITERATIVE queries: each server answers only what it knows. 6. The resolver returns the answer to your device and both cache it for the record's TTL (time to live, in seconds) set by the domain owner, so the next lookup is instant. There are 13 root server names (A to M), each answered by hundreds of machines around the world, including several in Africa.",
        decision: dec(
          "A company changes its website's IP address. Some staff reach the new server immediately; others keep reaching the old one for the next hour.",
          "Why?",
          ["Resolvers and devices that had cached the old answer keep using it until its TTL runs out", "Caching makes DNS fast, and TTL decides how long a stale answer can survive."],
          [
            ["The root servers update only once an hour", "Root servers do not hold the company's record; its authoritative server does."],
            ["DNS uses TCP, which is slow", "Normal lookups use UDP, and the delay here is caching, not transport."],
            ["Half the staff have the wrong subnet mask", "Then they could not reach either server reliably."],
          ]
        ),
      },
      {
        id: "a-nw-dns-records",
        title: "DNS records: A, AAAA, CNAME, MX, NS and TXT",
        explain:
          "A domain's authoritative server holds RECORDS, each with a name, a type, a TTL and a value. A maps a name to an IPv4 address (intranet.lab → 192.168.56.20). AAAA maps a name to an IPv6 address. CNAME makes one name an ALIAS of another (www.lab → intranet.lab), so you change the address in one place. MX names the MAIL server for a domain, with a PRIORITY number (lower is tried first). NS names the authoritative NAME SERVERS for a domain. TXT holds text, used for email anti-forgery policies (SPF, DKIM, DMARC) and to prove you own a domain to services like Google. To query records directly, network engineers use dig on Linux (and nslookup on any system). dig followed by a name asks for its A record and prints the full answer with the TTL. dig followed by a TYPE and a name asks for that record type: dig MX lab asks which mail server handles the domain lab. Add +short for just the value: dig +short intranet.lab. The recorded lab computer's resolver is srv01, which serves the lab domain.",
        terminalExercise: term("m4-dig", {
          goal: "Find out which mail server receives email for the domain lab, and its priority.",
          accept: ["dig MX lab"],
          near: [
            { command: "dig intranet.lab", why: "That is the A record of the intranet web server. The goal is about email: ask for the record type that names mail servers." },
            { command: "dig TXT lab", why: "That shows the domain's text record, an SPF policy for email. Close, but the mail server itself is in a different record type." },
            { command: "dig www.lab", why: "That shows www.lab is a CNAME (alias) of intranet.lab. The goal needs the mail record." },
          ],
          hint: "The mail record type is MX: dig, then MX, then the domain lab.",
          success: "lab. … IN MX 10 mail.lab. The mail server is mail.lab with priority 10. Notice the ANSWER SECTION and the TTL before IN: that is how long resolvers may cache this answer.",
        }),
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 7 · 4.21 – 4.24
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "nw-pr7-dhcp-nat",
    moduleId: M,
    sectionId: SECTION_ID,
    order: 7,
    covers: ["4.21", "4.22", "4.23", "4.24"],
    title: "DHCP, NAT and PAT",
    subtitle: "Handing out addresses automatically, and sharing one public address",
    estimatedMinutes: 55,
    intro:
      "Two services run on almost every router in the world: DHCP, which gives devices their addresses, and NAT, which lets a whole private network share one public address. You will configure both on a router.",

    atoms: [
      {
        id: "a-nw-dhcp",
        title: "DHCP: configuring a DHCP server",
        explain:
          "DHCP (Dynamic Host Configuration Protocol, UDP ports 67 for the server and 68 for the client) gives a device everything it needs to join a network: an IP address, the subnet mask, the default gateway and the DNS server, for a limited time called a LEASE. You met it in Module 3 from the client's side; now you will run the server. On a Cisco router, in global configuration mode (configure terminal), you type four kinds of command. ip dhcp excluded-address followed by a first and last address keeps a range out of the pool, for static devices such as the router itself and printers: ip dhcp excluded-address 192.168.30.1 192.168.30.10. ip dhcp pool followed by a name creates a pool and enters its configuration mode, prompt R1(dhcp-config)#: ip dhcp pool STAFF. Inside the pool, network followed by the network address and mask says which addresses to hand out: network 192.168.30.0 255.255.255.0; default-router followed by an address sets the gateway clients receive: default-router 192.168.30.1; and dns-server followed by an address sets their DNS server: dns-server 192.168.30.5. Then end. After clients renew (ipconfig /renew), show ip dhcp binding in privileged mode lists every address the router has leased and the MAC address it went to.",
        netLab: {
          task:
            "R1 is the gateway for the staff network 192.168.30.0/24, but it does not run DHCP, so PC1 and PC2 have APIPA addresses. Configure a DHCP pool named STAFF on R1 that hands out addresses from 192.168.30.0/24, keeps .1 to .10 out of the pool, gives clients the gateway 192.168.30.1 and the DNS server 192.168.30.5. Then renew both PCs and check the bindings on R1.",
          devices: [
            { id: "R1", kind: "router", x: 50, y: 8 },
            { id: "SW1", kind: "switch", x: 50, y: 24 },
            { id: "PC1", kind: "pc", x: 22, y: 40, dhcp: true },
            { id: "PC2", kind: "pc", x: 78, y: 40, dhcp: true },
          ],
          links: [["R1:g0/0", "SW1:g0/1"], ["PC1:fa0", "SW1:fa0/1"], ["PC2:fa0", "SW1:fa0/2"]],
          config: {
            R1: "hostname R1\ninterface g0/0\n ip address 192.168.30.1 255.255.255.0\n no shutdown",
            SW1: "hostname SW1",
          },
          start: "R1",
          goals: [
            { type: "dhcp", host: "PC1", subnet: "192.168.30.0/24", label: "PC1 gets an address from the STAFF pool" },
            { type: "dhcp", host: "PC2", subnet: "192.168.30.0/24", label: "PC2 gets an address from the STAFF pool" },
            { type: "ping", from: "PC1", to: "192.168.30.1", label: "PC1 can reach its gateway" },
          ],
          hint: "On R1: enable, configure terminal, ip dhcp excluded-address 192.168.30.1 192.168.30.10, ip dhcp pool STAFF, network 192.168.30.0 255.255.255.0, default-router 192.168.30.1, dns-server 192.168.30.5, end. On each PC: ipconfig /renew. On R1: show ip dhcp binding.",
          successMessage: "Both PCs leased addresses from .11 upwards, with the right gateway and DNS server, and nobody typed anything on the PCs. That is DHCP's whole value.",
        },
      },
      {
        id: "a-nw-dhcp-leases",
        title: "DHCP leases and address allocation",
        explain:
          "A client gets a lease in four messages, remembered as DORA. DISCOVER: the client, which has no address yet, broadcasts 'is there a DHCP server here?' (from 0.0.0.0 to 255.255.255.255). OFFER: a server replies with an address it can give. REQUEST: the client broadcasts that it wants that offer (so any other servers that offered know to withdraw). ACKNOWLEDGE: the server confirms, and the lease begins. Halfway through the lease, the client asks the same server to RENEW it. (Cisco routers lease for one day by default; busy guest Wi-Fi networks often use an hour or two.) If the lease expires, the address returns to the pool for someone else. Three ways a server ALLOCATES addresses: DYNAMIC, the next free address from the pool (normal for PCs and phones); RESERVATION (manual or static allocation), always the same address for one MAC address (for printers and servers that should still be managed centrally); and EXCLUSIONS, ranges never handed out. Because DISCOVER is a broadcast, and routers do not forward broadcasts, a DHCP server can only hear clients on its own network, unless the router facing the clients has a RELAY configured: on Cisco, the interface command ip helper-address followed by the server's address forwards DHCP broadcasts to that server as ordinary packets. Large networks use one central DHCP server and a helper address on every client network.",
        decision: dec(
          "A company moves its DHCP service from each branch router to one central server at head office. The next morning, PCs at head office get addresses, but PCs on every other network show 169.254 addresses.",
          "What is missing?",
          ["A DHCP relay (ip helper-address) on the router interfaces facing the other networks, because DISCOVER broadcasts do not cross routers", "Without a relay, the central server never hears the other networks' clients."],
          [
            ["A bigger pool on the central server", "The server never receives the requests, so pool size is irrelevant."],
            ["Static addresses on every PC", "That abandons DHCP instead of fixing it."],
            ["Shorter leases", "Lease length does not help a client whose broadcast cannot reach the server."],
          ]
        ),
      },
      {
        id: "a-nw-nat",
        title: "NAT: Network Address Translation",
        explain:
          "Private addresses (Module 3) are never routed on the internet, so a router at the edge of a private network must swap them for a public address on the way out, and swap them back on the way in. That is NAT. The router keeps a TRANSLATION TABLE recording each conversation so replies find their way back to the right inside device. Cisco uses four words for the addresses involved: INSIDE LOCAL (the device's private address, 192.168.1.10), INSIDE GLOBAL (the public address it appears as, 203.0.113.2), OUTSIDE GLOBAL (the internet server's address), and outside local (rarely different). Kinds of NAT: STATIC NAT maps one private address permanently to one public address, so a server inside can be reached from the internet. DYNAMIC NAT shares a pool of public addresses among inside devices, one at a time. PAT (next atom) shares ONE public address among many devices, and is what almost every home and office uses. NAT extended IPv4's life by decades, but it hides inside devices (which is also why incoming connections need extra configuration) and breaks some protocols. IPv6 has enough addresses to make NAT unnecessary.",
        decision: dec(
          "A company runs a web server on a private address inside its network and wants customers on the internet to reach it at the public address 203.0.113.10 at any time.",
          "Which kind of NAT is needed?",
          ["Static NAT: a permanent one-to-one mapping of 203.0.113.10 to the server's private address", "Incoming connections need a fixed, known public address mapped to the server."],
          [
            ["PAT, the same as the staff PCs use", "PAT translates outgoing connections; with nothing mapped in advance, an incoming connection has nowhere to go."],
            ["Dynamic NAT", "Dynamic mappings change and exist only while the inside device is talking outward."],
            ["No NAT: give the server's private address to customers", "Private addresses are not routed on the internet."],
          ]
        ),
      },
      {
        id: "a-nw-pat",
        title: "PAT: Port Address Translation",
        explain:
          "PAT, also called NAT OVERLOAD, lets hundreds of inside devices share ONE public address at the same time. It translates the source PORT as well as the address: PC1's connection from 192.168.1.10:51000 might leave as 203.0.113.2:1024, and PC2's from 192.168.1.11:51000 as 203.0.113.2:1025. Replies come back to the public address and the port number tells the router which inside device and connection they belong to. On a Cisco router, PAT takes four steps in global configuration mode. 1. Mark the interfaces: interface g0/0 then ip nat inside on the side facing the private network, and interface g0/1 then ip nat outside on the side facing the internet (type exit to leave an interface and return to global configuration). 2. Say which inside addresses may be translated with a numbered ACCESS LIST: access-list 1 permit 192.168.1.0 0.0.0.255. The last number is a WILDCARD MASK, the inverse of the subnet mask (0 bits must match, 1 bits may be anything), so 0.0.0.255 means 'any address 192.168.1.something'. Module 8 covers access lists fully. 3. Turn on PAT: ip nat inside source list 1 interface g0/1 overload, meaning 'translate addresses permitted by list 1 to the address of g0/1, sharing it with port numbers'. 4. end, then, after some traffic, show ip nat translations lists the live translations. In the lab, the ISP's router has no route to your private network, so nothing works until you configure PAT.",
        netLab: {
          task:
            "The office uses 192.168.1.0/24 inside. R1's g0/1 has the public address 203.0.113.2 from the ISP, and R1 already sends internet traffic to the ISP. The ISP has no route to private addresses, so replies never come back. Configure PAT on R1: g0/0 is inside, g0/1 is outside, access list 1 permits 192.168.1.0/24, and inside addresses are translated to g0/1's address with overload. Then ping the web server 198.51.100.10 from both PCs and look at the translations on R1.",
          devices: [
            { id: "PC1", kind: "pc", x: 8, y: 16, ip: "192.168.1.10/24", gateway: "192.168.1.1" },
            { id: "PC2", kind: "pc", x: 8, y: 44, ip: "192.168.1.11/24", gateway: "192.168.1.1" },
            { id: "SW1", kind: "switch", x: 26, y: 30 },
            { id: "R1", kind: "router", x: 46, y: 30, note: "office edge" },
            { id: "ISP", kind: "router", x: 70, y: 30, note: "internet provider" },
            { id: "Web", kind: "server", x: 92, y: 30, ip: "198.51.100.10/24", gateway: "198.51.100.1", services: [80] },
          ],
          links: [["PC1:fa0", "SW1:fa0/1"], ["PC2:fa0", "SW1:fa0/2"], ["R1:g0/0", "SW1:g0/1"], ["R1:g0/1", "ISP:g0/0"], ["ISP:g0/1", "Web:fa0"]],
          config: {
            SW1: "hostname SW1",
            R1: "hostname R1\ninterface g0/0\n ip address 192.168.1.1 255.255.255.0\n no shutdown\ninterface g0/1\n ip address 203.0.113.2 255.255.255.252\n no shutdown\nip route 0.0.0.0 0.0.0.0 203.0.113.1",
            ISP: "hostname ISP\ninterface g0/0\n ip address 203.0.113.1 255.255.255.252\n no shutdown\ninterface g0/1\n ip address 198.51.100.1 255.255.255.0\n no shutdown",
          },
          start: "R1",
          height: 50,
          goals: [
            { type: "ping", from: "PC1", to: "198.51.100.10", label: "PC1 reaches the internet web server" },
            { type: "ping", from: "PC2", to: "198.51.100.10", label: "PC2 reaches it too, sharing the same public address" },
          ],
          hint: "On R1: enable, configure terminal, interface g0/0, ip nat inside, exit, interface g0/1, ip nat outside, exit, access-list 1 permit 192.168.1.0 0.0.0.255, ip nat inside source list 1 interface g0/1 overload, end. Ping from both PCs, then show ip nat translations on R1.",
          successMessage: "Two private PCs, one public address, told apart by port numbers in R1's translation table. Your home router does exactly this for every device in the house.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 8 · 4.25 – 4.28, 4.P
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "nw-pr8-arp-icmp",
    moduleId: M,
    sectionId: SECTION_ID,
    order: 8,
    covers: ["4.25", "4.26", "4.27", "4.28", "4.P"],
    title: "ARP, ICMP, Gateways, Proxies and the Practical",
    subtitle: "The helper protocols underneath everything, and the tools to watch them",
    estimatedMinutes: 55,
    intro:
      "Every packet you have sent so far depended on two helper protocols you have not looked at directly: ARP, which finds MAC addresses, and ICMP, which ping and traceroute use. Then gateways, proxies, and a practical with the tools engineers use daily.",

    atoms: [
      {
        id: "a-nw-arp",
        title: "ARP: Address Resolution Protocol",
        explain:
          "A frame on Ethernet or Wi-Fi must carry the destination's MAC address, but applications only know IP addresses. ARP bridges the gap on the local network. When a host wants to send to an IP address on its own subnet (or to its gateway, for anything off-subnet), it checks its ARP CACHE, a table of IP-to-MAC pairs it has learned. If the address is not there, it BROADCASTS an ARP REQUEST to every device on the LAN: 'Who has 192.168.1.20? Tell 192.168.1.10.' Only the owner of that address answers, with a UNICAST ARP REPLY: '192.168.1.20 is at 0001.4321.abcd.' The sender stores the pair for a few minutes and sends its frame. ARP works only inside one network; to reach a remote host, a PC ARPs for its GATEWAY's MAC address, never for the remote host's. On a NetLab PC (and on Windows), arp -a shows the ARP cache and arp -d clears it; on Linux the command is ip neigh. Because ARP believes any reply, attackers can poison caches with false replies (ARP spoofing, Module 8). Watch the cache fill in the network below.",
        netDemo: {
          task:
            "On PC1, type arp -a: the cache is empty. Ping PC2 (192.168.1.20), then run arp -a again. Now ping the server 10.0.0.10 on the other side of the router and run arp -a once more: whose MAC address appears, the server's or the router's?",
          devices: [
            { id: "PC1", kind: "pc", x: 10, y: 18, ip: "192.168.1.10/24", gateway: "192.168.1.1" },
            { id: "PC2", kind: "pc", x: 10, y: 44, ip: "192.168.1.20/24", gateway: "192.168.1.1" },
            { id: "SW1", kind: "switch", x: 34, y: 30 },
            { id: "R1", kind: "router", x: 60, y: 30 },
            { id: "Server", kind: "server", x: 88, y: 30, ip: "10.0.0.10/24", gateway: "10.0.0.1" },
          ],
          links: [["PC1:fa0", "SW1:fa0/1"], ["PC2:fa0", "SW1:fa0/2"], ["R1:g0/0", "SW1:g0/1"], ["R1:g0/1", "Server:fa0"]],
          config: {
            SW1: "hostname SW1",
            R1: "hostname R1\ninterface g0/0\n ip address 192.168.1.1 255.255.255.0\n no shutdown\ninterface g0/1\n ip address 10.0.0.1 255.255.255.0\n no shutdown",
          },
          start: "PC1",
          height: 46,
        },
        decision: dec(
          "In the network above, PC1 pings the server 10.0.0.10, which is on another network behind R1, and then runs arp -a.",
          "Which entry is added to PC1's ARP cache, and why?",
          ["The router's address, 192.168.1.1, with the router's MAC address: PC1 sends off-subnet traffic to its gateway, so that is the only MAC it needs", "ARP never crosses a router; for remote hosts a PC only ever resolves its gateway."],
          [
            ["10.0.0.10 with the server's MAC address", "The server is on another network; its MAC address is never seen by PC1."],
            ["Nothing: ARP is only used for pings to the gateway itself", "ARP is used for every frame PC1 sends on its LAN."],
            ["The switch's MAC address", "Switches are not the destination of the frames; they forward them."],
          ]
        ),
      },
      {
        id: "a-nw-icmp",
        title: "ICMP: Internet Control Message Protocol",
        explain:
          "ICMP carries CONTROL and ERROR messages for IP. It sits at the Internet layer beside IP and has no ports. The messages you will meet most: ECHO REQUEST and ECHO REPLY, which are what ping sends and receives; DESTINATION UNREACHABLE, sent by a router that has no route to the destination or by a host whose port or protocol is closed ('Destination host unreachable'); and TIME EXCEEDED, sent by a router when a packet's TTL (time to live, a hop counter in the IP header that every router decreases by one) reaches zero, which stops packets looping forever. TRACEROUTE (tracert on Windows and in NetLab, traceroute on Linux) uses Time Exceeded cleverly: it sends packets with TTL 1, then 2, then 3, and each router along the way, as it discards the packet, reveals its own address in the error message. The result is a list of every router (hop) on the path, which shows WHERE a connection stops. Some networks block ICMP to look harder to scan, which also breaks ping and traceroute for their own troubleshooters. Trace a path below.",
        netDemo: {
          task:
            "From PC1, type tracert 172.16.9.10 to list every router between PC1 and the server. Then try tracert 172.16.99.99, an address none of the routers has a route for, and see where the trace stops and what R2 replies.",
          devices: [
            { id: "PC1", kind: "pc", x: 8, y: 30, ip: "192.168.1.10/24", gateway: "192.168.1.1" },
            { id: "R1", kind: "router", x: 32, y: 30 },
            { id: "R2", kind: "router", x: 56, y: 30 },
            { id: "R3", kind: "router", x: 78, y: 30 },
            { id: "Server", kind: "server", x: 96, y: 30, ip: "172.16.9.10/24", gateway: "172.16.9.1" },
          ],
          links: [["PC1:fa0", "R1:g0/0"], ["R1:g0/1", "R2:g0/0"], ["R2:g0/1", "R3:g0/0"], ["R3:g0/1", "Server:fa0"]],
          config: {
            R1: "hostname R1\ninterface g0/0\n ip address 192.168.1.1 255.255.255.0\n no shutdown\ninterface g0/1\n ip address 10.1.12.1 255.255.255.252\n no shutdown\nip route 0.0.0.0 0.0.0.0 10.1.12.2",
            R2: "hostname R2\ninterface g0/0\n ip address 10.1.12.2 255.255.255.252\n no shutdown\ninterface g0/1\n ip address 10.1.23.1 255.255.255.252\n no shutdown\nip route 192.168.1.0 255.255.255.0 10.1.12.1\nip route 172.16.9.0 255.255.255.0 10.1.23.2",
            R3: "hostname R3\ninterface g0/0\n ip address 10.1.23.2 255.255.255.252\n no shutdown\ninterface g0/1\n ip address 172.16.9.1 255.255.255.0\n no shutdown\nip route 0.0.0.0 0.0.0.0 10.1.23.1",
          },
          start: "PC1",
          height: 34,
        },
        decision: dec(
          "A traceroute from your PC to a website shows replies from hops 1, 2 and 3, and then only '* * * Request timed out' from hop 4 onwards.",
          "What does that tell you?",
          ["Packets reach the third router and are lost or blocked after it, so the problem (or a device that silently drops ICMP) lies just beyond hop 3", "Traceroute shows where along the path the replies stop."],
          [
            ["Your PC's cable is unplugged", "Then even hop 1 would not answer."],
            ["The website is definitely down", "The website itself was never reached; the path fails earlier."],
            ["DNS is not working", "Traceroute had an address to trace to, so DNS already worked."],
          ]
        ),
      },
      {
        id: "a-nw-gateway-routing",
        title: "The default gateway and routing services",
        explain:
          "You configured default gateways in Module 3. Here is the full picture of what that gateway, usually a router, does for its network as a SERVICE. It FORWARDS packets between networks using its routing table (Module 5 covers routing in depth). It often runs DHCP for the network, or relays it with a helper address. It may run NAT or PAT to the internet. It may act as a DNS forwarder, answering clients' lookups and passing them upstream. It may FILTER traffic with access lists (Module 8). And it ANSWERS ARP for its own address, so every host can find it. Because one gateway is a single point of failure for a whole network, enterprises run two routers that share one virtual gateway address with a FIRST HOP REDUNDANCY PROTOCOL (HSRP on Cisco, or the open standard VRRP): if the active router fails, the standby takes over the address within seconds and hosts never notice. Module 10 returns to redundancy.",
        decision: dec(
          "Every PC in a 200-person office uses the gateway 10.10.0.1. The router holding that address fails, and the whole office loses access to everything outside its subnet.",
          "What design would have prevented the outage?",
          ["Two routers sharing a virtual gateway address with HSRP or VRRP, so the standby takes over 10.10.0.1 automatically", "First hop redundancy removes the gateway as a single point of failure."],
          [
            ["Giving each PC two IP addresses", "The PCs' addresses are not the failed component."],
            ["Turning off DHCP", "DHCP has nothing to do with the router failing."],
            ["A longer DHCP lease", "The lease does not help when the gateway itself is down."],
          ]
        ),
      },
      {
        id: "a-nw-proxy",
        title: "Proxy servers",
        explain:
          "A PROXY server makes requests ON BEHALF OF clients. A FORWARD PROXY sits in front of users: the browser sends its web requests to the proxy, and the proxy fetches the pages from the internet. Organisations use forward proxies to FILTER content (block malware sites, enforce acceptable use), to LOG who visited what, to CACHE popular content and save bandwidth (common where internet links are expensive), and to inspect traffic for threats. Schools use them to keep inappropriate sites away from students. A REVERSE PROXY sits in front of servers: clients on the internet think they are talking to the website, but the reverse proxy receives the request and passes it to one of the real servers behind it. Reverse proxies (nginx, HAProxy, Cloudflare) provide load balancing, TLS termination, caching and protection from attacks. Note the difference from NAT: NAT rewrites addresses in packets as they pass through, while a proxy actually terminates the client's connection and opens a new one of its own, so it understands the application (such as HTTP) and can make decisions about its content.",
        decision: dec(
          "A school wants every student laptop's web traffic to be checked against a list of blocked sites and logged, and popular educational videos to be stored locally so they load without using the expensive internet link again.",
          "What should the school deploy?",
          ["A forward proxy that the student laptops send their web requests through, with filtering, logging and caching", "Filtering, logging and caching users' web requests are the classic forward-proxy jobs."],
          [
            ["A reverse proxy in front of the students", "Reverse proxies sit in front of servers, protecting and balancing them."],
            ["PAT on the school router", "PAT translates addresses; it does not understand web pages, block sites or cache videos."],
            ["A second DHCP server", "DHCP hands out addresses; it does none of these jobs."],
          ]
        ),
      },
      {
        id: "a-nw-ss-netstat",
        title: "Practical: seeing connections with ss and netstat",
        explain:
          "To see which connections a computer has open and which ports it is listening on, use ss on Linux (netstat on older systems, Windows and macOS: netstat -an). The options are letters, and you can combine them. -t shows TCP, -u shows UDP, -n shows NUMBERS instead of names (addresses and ports, faster and clearer), -l shows only LISTENING sockets (servers waiting for clients) and, when run as the administrator, -p shows which PROCESS owns each socket. So ss -tn lists established TCP connections numerically (netstat -tn shows the same in the older tool's format), ss -tln lists listening TCP ports, and ss -tulpn (run as root) lists every listening TCP and UDP port with its program, the first command most administrators run on an unfamiliar server. Each line shows the State (ESTAB means established, LISTEN means waiting), the Local Address:Port and the Peer Address:Port. In the recorded terminal below, the lab computer has an SSH session open to srv01.",
        terminalExercise: term("m4-ss", {
          goal: "List the lab computer's ESTABLISHED TCP connections, with numeric addresses and ports, and find the connection to srv01.",
          accept: ["ss -tn", "netstat -tn"],
          near: [
            { command: "ss -tln", why: "That lists ports this computer is LISTENING on (it has none open to the network). The goal is the established connections: leave out the l." },
          ],
          hint: "ss with -t for TCP and -n for numbers. (netstat -tn works too.)",
          success: "ESTAB from 192.168.56.10 on a high port to 192.168.56.20:22: an established SSH connection, with the local socket on the left and the peer's on the right.",
        }),
      },
    ],

    requirements: { read: true, video: false, assessment: true },

    task: {
      title: "Module 4 practical: the protocols, observed",
      intro:
        "Use your own computer and network. On Windows use nslookup, curl, ping and netstat -an in a terminal; on Linux or macOS use dig, curl, ping and ss. Capture only your own traffic.",
      prompts: [
        "Inspect DNS resolution: look up the A, AAAA, MX and NS records of a domain you use (for example a bank or university), and note each TTL.",
        "Examine HTTP: use curl -I on an http:// address and an https:// address and compare the status codes and headers (look for redirects from HTTP to HTTPS).",
        "Test connectivity with ping and traceroute (tracert on Windows) to a website, and count the hops.",
        "List active connections and listening ports with ss -tuln (or netstat -an), and identify three services by their port numbers.",
        "Capture a TCP three-way handshake in Wireshark with the filter tcp.flags.syn == 1, then find the matching ACK.",
        "In Packet Tracer or NetLab, configure a DHCP server for a LAN with an excluded range, then verify the bindings.",
      ],
      closing:
        "You now know what travels over the network. Module 5 builds the network itself: switches, VLANs and routing.",
    },
  },
];
