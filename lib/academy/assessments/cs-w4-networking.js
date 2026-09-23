/**
 * ASSESSMENTS · CYBERSECURITY · WEEK 4 · NETWORKING ESSENTIALS
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Never import this from anything under src/.
 * ═════════════════════════════════════════════════════════════════════════
 */

export const ASSESSMENTS = {
  /* ═══════════════════════════════════════════════════════════════════ */
  "cs-l13-how-a-request-travels": {
    lessonId: "cs-l13-how-a-request-travels",
    passMark: 70,
    questions: [
      {
        id: "csq13-1",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cs-net-layers",
        prompt:
          "Why can a firewall that filters by port not tell you what is inside an HTTPS request?",
        options: [
          { id: "a", text: "Because it only inspects outbound traffic" },
          {
            id: "b",
            text: "Because it works at the transport layer, and the request's contents live at the application layer inside encryption",
          },
          { id: "c", text: "Because HTTPS does not use ports" },
          { id: "d", text: "Because firewalls only read IP addresses" },
        ],
        correct: "b",
        explanation:
          "Each layer can only see what is addressed to it. A port filter sees ports. The request itself is application-layer data, wrapped in TLS, which is exactly why web application firewalls exist as a separate thing.",
        whyWrong: {
          a: "Direction is a configuration choice and has nothing to do with which layer the device can read.",
          c: "HTTPS uses port 443. Its use of ports is the thing the firewall can see.",
          d: "Port filtering reads ports as well as addresses. The limit is depth, not which field.",
        },
      },
      {
        id: "csq13-2",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cs-net-ip-ports",
        prompt: "An attacker scans and finds port 3306 open on a server facing the internet. What is the finding?",
        options: [
          { id: "a", text: "That MySQL has a vulnerability" },
          { id: "b", text: "That a database port is reachable from the internet, which it should not be" },
          { id: "c", text: "That the server is running Linux" },
          { id: "d", text: "Nothing, until a version is confirmed" },
        ],
        correct: "b",
        explanation:
          "The exposure is the finding. Whether that particular MySQL version has a known issue is the next question, and a database listening to the whole internet is a problem regardless of the answer.",
        whyWrong: {
          a: "An open port says nothing about whether the software on it is vulnerable. That requires a version and a lookup.",
          c: "MySQL runs on several operating systems. The port number does not identify the platform.",
          d: "Waiting for a version before reporting misses the architectural problem, which is that the port is reachable at all.",
        },
      },
      {
        id: "csq13-3",
        type: "scenario",
        difficulty: 3,
        atomId: "a-cs-net-full-request",
        prompt:
          "Someone on the same WiFi as you cannot read your HTTPS traffic. What can they still learn?",
        options: [
          { id: "a", text: "Nothing at all" },
          {
            id: "b",
            text: "Which sites you visited, from the DNS lookups and usually the TLS Client Hello",
          },
          { id: "c", text: "Your passwords, since those are sent before encryption starts" },
          { id: "d", text: "The contents of the pages, but not which site they came from" },
        ],
        correct: "b",
        explanation:
          "Both the DNS query and the SNI field of the Client Hello carry the site name in the clear, before any content is encrypted. Content is private; which site is generally not.",
        whyWrong: {
          a: "They also see timing, volume and frequency, all of which support traffic analysis even with no readable content.",
          c: "Passwords travel inside the encrypted channel, after the handshake. They are not exposed by this.",
          d: "Exactly backwards. The contents are what encryption protects; the destination is what leaks.",
        },
      },
      {
        id: "csq13-4",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cs-net-handshake",
        prompt: "How does a SYN flood exhaust a server?",
        options: [
          { id: "a", text: "By sending more data than the network can carry" },
          {
            id: "b",
            text: "By opening connections with SYN and never completing them, filling the server's table of half-open connections",
          },
          { id: "c", text: "By guessing sequence numbers" },
          { id: "d", text: "By sending malformed packets that crash the service" },
        ],
        correct: "b",
        explanation:
          "The server replies SYN ACK and reserves state waiting for the final ACK that never arrives. Enough of those and there is no room left for real connections, at very little cost to the attacker.",
        whyWrong: {
          a: "That describes a volumetric flood, which is a different attack. A SYN flood needs very little bandwidth.",
          c: "Sequence prediction is a separate and largely historical attack on connection hijacking.",
          d: "Malformed packets describe a crash exploit. A SYN flood uses entirely valid packets, which is what makes it hard to filter.",
        },
      },
      {
        id: "csq13-5",
        type: "truefalse",
        difficulty: 2,
        atomId: "a-cs-net-dns",
        prompt: "DNS over HTTPS prevents an attacker from forging the answer to a lookup.",
        options: [
          { id: "a", text: "True" },
          { id: "b", text: "False" },
        ],
        correct: "b",
        explanation:
          "False. It encrypts the query so nobody in between can read or tamper with it in transit. Whether the answer itself is genuine is a different guarantee, and that one is DNSSEC's job.",
        whyWrong: {
          a: "The two protect different halves. Encryption hides the question; DNSSEC proves the answer. A resolver that is itself lying is unaffected by encryption.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "cs-l14-reading-a-capture": {
    lessonId: "cs-l14-reading-a-capture",
    passMark: 70,
    questions: [
      {
        id: "csq14-1",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cs-net-why-capture",
        prompt: "What does a packet capture give you that application logs do not?",
        options: [
          { id: "a", text: "A record of what the application decided to write down" },
          { id: "b", text: "What actually crossed the wire, including things nothing logged" },
          { id: "c", text: "Usernames for every action" },
          { id: "d", text: "A longer retention period" },
        ],
        correct: "b",
        explanation:
          "Logs are a chosen summary. A capture is ground truth, which is why it frequently settles arguments in an incident that logs alone cannot.",
        whyWrong: {
          a: "That is exactly what a log is. The capture's value is that it does not depend on somebody having decided to record it.",
          c: "A capture often has no usernames at all, especially over encrypted traffic. Identity usually comes from logs.",
          d: "Captures are normally kept for far less time than logs, because they are enormous.",
        },
      },
      {
        id: "csq14-2",
        type: "mcq",
        difficulty: 3,
        atomId: "a-cs-net-follow-request",
        prompt:
          "Why does the TLS Client Hello announce the site name in plain text?",
        options: [
          { id: "a", text: "Because encryption has not been agreed yet, and the server must know which certificate to present" },
          { id: "b", text: "Because the browser needs to verify the certificate first" },
          { id: "c", text: "Because it is a legacy field with no purpose" },
          { id: "d", text: "Because DNS requires it" },
        ],
        correct: "a",
        explanation:
          "One server may host hundreds of sites. It has to know which one you want before it can choose a certificate, and that decision happens before the encrypted channel exists.",
        whyWrong: {
          b: "Verification happens after the server presents a certificate, which is after this packet. The order is the other way round.",
          c: "It has a very specific purpose, which is name-based virtual hosting. Encrypted Client Hello exists to close the gap without removing the function.",
          d: "DNS has already finished by this point and has no involvement in the TLS handshake.",
        },
      },
      {
        id: "csq14-3",
        type: "scenario",
        difficulty: 3,
        atomId: "a-cs-net-metadata",
        prompt:
          "A capture shows a workstation contacting an unfamiliar address every 60 seconds for nine hours. All traffic is encrypted. What can you conclude?",
        options: [
          { id: "a", text: "Nothing, because the traffic is encrypted" },
          {
            id: "b",
            text: "The regular interval is a strong indicator of automated check-in behaviour, which is how malware is commonly spotted",
          },
          { id: "c", text: "The workstation is downloading a large file" },
          { id: "d", text: "The user was browsing that site all day" },
        ],
        correct: "b",
        explanation:
          "Encryption hides content, not pattern. A precise regular beacon for nine hours is not how a person browses, and traffic analysis is built entirely on that gap.",
        whyWrong: {
          a: "This is the assumption that makes encrypted malware traffic invisible to a team. The metadata is plenty to act on.",
          c: "A download shows sustained volume, not a small packet exactly every sixty seconds.",
          d: "Human browsing is irregular and bursty. Machine-perfect intervals are the point of the observation.",
        },
      },
      {
        id: "csq14-4",
        type: "scenario",
        difficulty: 3,
        atomId: "a-cs-net-spot-cleartext",
        prompt:
          "You find a plain HTTP login on an internal device. The admin argues it is fine because the network is internal. What is the strongest counter?",
        options: [
          { id: "a", text: "Compliance frameworks require HTTPS everywhere" },
          {
            id: "b",
            text: "It assumes nobody hostile is ever inside the network, which is the assumption every real breach violates",
          },
          { id: "c", text: "Browsers will start blocking HTTP soon" },
          { id: "d", text: "HTTPS is faster than HTTP with modern protocols" },
        ],
        correct: "b",
        explanation:
          "The password and the session cookie are readable by anything on that segment. An attacker who phished one workstation is now inside, and internal plaintext is the first thing they harvest.",
        whyWrong: {
          a: "True in some frameworks and it is an argument from paperwork. It will not persuade an engineer and it does not describe the risk.",
          c: "A roadmap argument rather than a security one, and it invites the reply that this device is not on the public internet.",
          d: "Performance is a real point in some cases and it is not the reason. Winning on speed leaves the security claim unchallenged.",
        },
      },
      {
        id: "csq14-5",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cs-net-read-capture",
        prompt:
          "In a capture, how do you tell a DNS query from a DNS response?",
        options: [
          { id: "a", text: "The response is always larger" },
          { id: "b", text: "By direction: the query goes to the resolver, and the response comes back from it" },
          { id: "c", text: "The query uses TCP and the response uses UDP" },
          { id: "d", text: "Only the response has a transaction ID" },
        ],
        correct: "b",
        explanation:
          "Read the Source and Destination columns. The query is sent to the resolver on port 53; the response comes back from port 53 to the high port that asked.",
        whyWrong: {
          a: "Responses usually are larger, which is a hint rather than a rule, and a truncated or empty response breaks it.",
          c: "Both normally use UDP. DNS falls back to TCP for large answers, in both directions.",
          d: "Both carry the same transaction ID. That is how the response is matched to the question.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "cs-l15-network-attacks": {
    lessonId: "cs-l15-network-attacks",
    passMark: 70,
    questions: [
      {
        id: "csq15-1",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cs-net-spoofing",
        prompt: "Why is ARP spoofing so easy on a local network?",
        options: [
          { id: "a", text: "Because ARP traffic is encrypted and cannot be inspected" },
          { id: "b", text: "Because ARP has no authentication, so a machine claiming to be the router is believed" },
          { id: "c", text: "Because switches broadcast all traffic to every port" },
          { id: "d", text: "Because ARP runs over UDP" },
        ],
        correct: "b",
        explanation:
          "ARP was designed when everyone on a local segment was assumed to be trustworthy. There is no check at all on whether an announcement is true.",
        whyWrong: {
          a: "ARP is not encrypted. Lack of encryption is not the issue either; lack of authentication is.",
          c: "Switches specifically do not do that, which is why an attacker has to spoof ARP to see traffic that is not theirs.",
          d: "ARP sits below IP entirely and uses neither UDP nor TCP.",
        },
      },
      {
        id: "csq15-2",
        type: "mcq",
        difficulty: 3,
        atomId: "a-cs-net-mitm",
        prompt:
          "An attacker successfully intercepts your connection to your bank. Why does TLS still stop them reading it?",
        options: [
          { id: "a", text: "Because TLS detects the extra network hop" },
          {
            id: "b",
            text: "Because they cannot present a certificate for that domain signed by an authority your browser trusts",
          },
          { id: "c", text: "Because the bank blocks unknown IP addresses" },
          { id: "d", text: "Because the session is encrypted with your password" },
        ],
        correct: "b",
        explanation:
          "Interception gives them the traffic and not the ability to impersonate. Without a valid certificate for the name, the browser warns, and that warning is the entire defence.",
        whyWrong: {
          a: "TLS has no view of the route and does not count hops. Traffic legitimately crosses many.",
          c: "The bank sees a connection from wherever the traffic emerges and cannot distinguish that from a normal network path.",
          d: "Session keys are negotiated during the handshake and have nothing to do with your password, which is sent afterwards.",
        },
      },
      {
        id: "csq15-3",
        type: "scenario",
        difficulty: 3,
        atomId: "a-cs-net-dns-attacks",
        prompt:
          "A victim types the correct address themselves and still lands on an attacker's server. What happened, and what would have prevented it?",
        options: [
          { id: "a", text: "They were phished, and training would have prevented it" },
          {
            id: "b",
            text: "The name resolved to the wrong address. TLS prevents it, because the attacker has no valid certificate for that name",
          },
          { id: "c", text: "Their browser cache was poisoned, and clearing it would prevent it" },
          { id: "d", text: "Nothing prevents this once DNS is compromised" },
        ],
        correct: "b",
        explanation:
          "This is DNS spoofing or cache poisoning. No amount of care about links helps, because the user did everything right. TLS is what breaks it: the attacker holds the address and not a certificate for the name.",
        whyWrong: {
          a: "No deception of the user occurred. They typed the right thing, which is what makes this attack so hard to train against.",
          c: "The poisoning is in a DNS resolver, not the browser cache. Clearing the browser changes nothing.",
          d: "TLS does prevent it, and saying otherwise removes the one control that works here.",
        },
      },
      {
        id: "csq15-4",
        type: "mcq",
        difficulty: 3,
        atomId: "a-cs-net-dos-amplification",
        prompt: "Why do attackers use amplification rather than flooding a target directly?",
        options: [
          { id: "a", text: "Because it is harder to trace and requires far less traffic from the attacker" },
          { id: "b", text: "Because amplified packets are harder for the victim to decode" },
          { id: "c", text: "Because it works against encrypted services only" },
          { id: "d", text: "Because direct floods are illegal and amplification is not" },
        ],
        correct: "a",
        explanation:
          "A small forged query produces a large reply sent to the victim. The attacker spends a fraction of the bandwidth, and the victim sees thousands of legitimate servers attacking them, so blocking the sources means blocking real infrastructure.",
        whyWrong: {
          b: "The packets are ordinary protocol responses. Decoding is not the problem; volume is.",
          c: "Amplification targets whatever address is forged, regardless of what that host runs.",
          d: "Both are offences. The choice is about efficiency and attribution, not legality.",
        },
      },
      {
        id: "csq15-5",
        type: "truefalse",
        difficulty: 2,
        atomId: "a-cs-net-sniffing",
        prompt: "A purely passive network sniffer can be detected by monitoring the network.",
        options: [
          { id: "a", text: "True" },
          { id: "b", text: "False" },
        ],
        correct: "b",
        explanation:
          "False. A passive listener sends nothing, so there is nothing to observe. That is exactly why encryption in transit became non-negotiable even inside a company's own building.",
        whyWrong: {
          a: "Detection techniques exist for sniffers that give themselves away by responding to crafted traffic, which means they are not purely passive. A listener that only listens leaves no trace on the wire.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "cs-l16-scanning": {
    lessonId: "cs-l16-scanning",
    passMark: 70,
    questions: [
      {
        id: "csq16-1",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cs-net-scan-lab",
        prompt: "Why run host discovery before a port scan?",
        options: [
          { id: "a", text: "Because port scans do not work on ranges" },
          {
            id: "b",
            text: "Because scanning every port of 254 addresses when three are alive wastes hours",
          },
          { id: "c", text: "Because host discovery is more accurate" },
          { id: "d", text: "Because port scanning requires root and discovery does not" },
        ],
        correct: "b",
        explanation:
          "Find the machines, then examine the machines. The discovery scan in the lesson covered 256 addresses in about two seconds and told you which three were worth looking at.",
        whyWrong: {
          a: "Port scans accept ranges perfectly well. They are simply slow across one.",
          c: "Host discovery is less complete, not more. Some hosts do not answer pings and are missed, which is a known limitation.",
          d: "Several scan types need root, and that is not the reason for the ordering.",
        },
      },
      {
        id: "csq16-2",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cs-net-scan-types",
        prompt:
          "A default `nmap HOST` scan reports nothing on port 8443. Can you conclude the port is closed?",
        options: [
          { id: "a", text: "Yes, a default scan covers all ports" },
          { id: "b", text: "No. A default scan checks the 1,000 most common ports, and you must ask for the rest" },
          { id: "c", text: "Yes, unless the host has a firewall" },
          { id: "d", text: "No, because nmap cannot detect ports above 1024" },
        ],
        correct: "b",
        explanation:
          "This is the most common misreading of a scan result. Use `-p-` for all 65,535 ports, and expect it to take considerably longer.",
        whyWrong: {
          a: "It covers 1,000 by default. Assuming otherwise is how services get missed in a real assessment.",
          c: "A firewall is a separate complication. Even with none, the default scan simply did not look at 8443.",
          d: "nmap scans high ports without difficulty. It just was not asked to.",
        },
      },
      {
        id: "csq16-3",
        type: "scenario",
        difficulty: 3,
        atomId: "a-cs-net-banner",
        prompt:
          "Your scan reports `3306/tcp open mysql MySQL 5.7.33`. Which is the more important finding?",
        options: [
          { id: "a", text: "The known vulnerabilities in MySQL 5.7.33" },
          { id: "b", text: "That a database port is reachable at all from where you scanned" },
          { id: "c", text: "That the version string may be inaccurate" },
          { id: "d", text: "That MySQL is running rather than PostgreSQL" },
        ],
        correct: "b",
        explanation:
          "Patching the version closes today's known issues. Removing the exposure closes today's and tomorrow's. The architectural finding outlives the vulnerability list.",
        whyWrong: {
          a: "Worth recording and it is the second question. Fixing only this leaves the port exposed to the next vulnerability found.",
          c: "True and worth verifying. It is a caveat on the evidence, not the finding.",
          d: "Which database it is affects the details of remediation and not whether it should be reachable.",
        },
      },
      {
        id: "csq16-4",
        type: "scenario",
        difficulty: 3,
        atomId: "a-cs-net-scan-ethics",
        prompt:
          "You notice an exposed admin panel on a company's website while shopping there. What is the correct action?",
        options: [
          { id: "a", text: "Test it to confirm before reporting, so your report is credible" },
          { id: "b", text: "Report what you observed, without probing further" },
          { id: "c", text: "Publish it so they are forced to act" },
          { id: "d", text: "Say nothing, since reporting creates legal risk for you" },
        ],
        correct: "b",
        explanation:
          "Observing something in the ordinary course of using a site is not an offence. Probing it is. The line is authorisation, and reporting an observation stays on the right side of it.",
        whyWrong: {
          a: "Testing without authorisation is the offence regardless of motive, and well-meaning people have been prosecuted for exactly this.",
          c: "Publishing an unfixed exposure hands it to everyone who reads it. Coordinated disclosure exists to avoid that.",
          d: "Reporting an observation is legal and is the right thing to do. The risk to avoid is probing, not reporting.",
        },
      },
      {
        id: "csq16-5",
        type: "truefalse",
        difficulty: 2,
        atomId: "a-cs-net-what-scanning-is",
        prompt: "Scanning your employer's network without a written scope is acceptable if you work in IT there.",
        options: [
          { id: "a", text: "True" },
          { id: "b", text: "False" },
        ],
        correct: "b",
        explanation:
          "False. Employment is not authorisation to test, and this is one of the more common ways enthusiastic junior staff are dismissed. Get the scope in writing, from someone entitled to give it, before you start.",
        whyWrong: {
          a: "Having legitimate access to operate systems is not the same as permission to probe them. Without a written scope there is nothing distinguishing your scan from an intruder's, including in the logs.",
        },
      },
    ],
  },
};

export default ASSESSMENTS;
