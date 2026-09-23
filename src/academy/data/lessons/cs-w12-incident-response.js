/**
 * CYBERSECURITY · WEEK 12 · INCIDENT RESPONSE & DIGITAL FORENSICS
 *
 * Harvard anchor: completes the defensive arc. What to do when prevention
 * fails.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 *
 * This week runs one incident from the alert to the post-incident report. The
 * capture, the flow log and the terminal all come from the same scenario: a
 * workstation on 10.0.2.66 that started talking to something it never had, and
 * then sent a great deal of data to it.
 *
 * The forensics here is the part a first responder actually does: preserve,
 * hash, document, and build a timeline. Deep filesystem carving is a
 * specialism and is named rather than taught, because a week that pretends
 * otherwise produces people who are confident and wrong in a courtroom.
 */

export const SECTION_ID = "cs-s12-incident-response";

/** Traffic from the affected subnet during the incident window. */
const IR_CAPTURE = [
  {
    no: 1,
    time: "09:14:22",
    src: "10.0.2.15",
    dst: "10.0.1.9",
    proto: "TCP",
    sport: 50122,
    dport: 445,
    length: 210,
    info: "SMB2 Read Request (ordinary file share access)",
  },
  {
    no: 2,
    time: "09:14:22",
    src: "10.0.1.9",
    dst: "10.0.2.15",
    proto: "TCP",
    sport: 445,
    dport: 50122,
    length: 1494,
    info: "SMB2 Read Response",
  },
  {
    no: 3,
    time: "11:02:03",
    src: "10.0.2.66",
    dst: "10.0.1.1",
    proto: "DNS",
    sport: 57314,
    dport: 53,
    length: 82,
    info: "Standard query A update-cdn-node.xyz",
  },
  {
    no: 4,
    time: "11:02:03",
    src: "10.0.1.1",
    dst: "10.0.2.66",
    proto: "DNS",
    sport: 53,
    dport: 57314,
    length: 98,
    info: "Standard query response A update-cdn-node.xyz A 45.87.2.19",
  },
  {
    no: 5,
    time: "11:02:04",
    src: "10.0.2.66",
    dst: "45.87.2.19",
    proto: "TCP",
    sport: 57315,
    dport: 443,
    length: 74,
    info: "57315 → 443 [SYN] Seq=0 Win=64240",
    flags: "SYN",
  },
  {
    no: 6,
    time: "11:02:04",
    src: "45.87.2.19",
    dst: "10.0.2.66",
    proto: "TCP",
    sport: 443,
    dport: 57315,
    length: 74,
    info: "443 → 57315 [SYN, ACK] Seq=0 Ack=1",
    flags: "SYN ACK",
  },
  {
    no: 7,
    time: "11:02:04",
    src: "10.0.2.66",
    dst: "45.87.2.19",
    proto: "TLS",
    sport: 57315,
    dport: 443,
    length: 517,
    info: "Client Hello (SNI=update-cdn-node.xyz)",
  },
  {
    no: 8,
    time: "11:02:05",
    src: "45.87.2.19",
    dst: "10.0.2.66",
    proto: "TLS",
    sport: 443,
    dport: 57315,
    length: 1466,
    info: "Server Hello, Certificate, Server Finished",
  },
  {
    no: 9,
    time: "11:47:10",
    src: "10.0.2.66",
    dst: "45.87.2.19",
    proto: "TLS",
    sport: 57315,
    dport: 443,
    length: 1448,
    info: "Application Data (stream total 1.42 GB sent)",
  },
  {
    no: 10,
    time: "11:47:10",
    src: "45.87.2.19",
    dst: "10.0.2.66",
    proto: "TCP",
    sport: 443,
    dport: 57315,
    length: 66,
    info: "443 → 57315 [ACK] Seq=1 Ack=1449",
    flags: "ACK",
  },
];

/** Outbound flow totals for the day, by host. */
const FLOW_LOG = [
  { id: "x1", time: "09:00", host: "WS-014", destination: "update.microsoft.com", bytesOut: 12, category: "software update" },
  { id: "x2", time: "09:30", host: "WS-022", destination: "drive.google.com", bytesOut: 48, category: "cloud storage" },
  { id: "x3", time: "10:15", host: "WS-031", destination: "teams.microsoft.com", bytesOut: 6, category: "collaboration" },
  { id: "x4", time: "11:47", host: "WS-066", destination: "update-cdn-node.xyz", bytesOut: 1420, category: "uncategorised", attack: true },
  { id: "x5", time: "12:00", host: "SRV-BACKUP", destination: "backup.vendor.com", bytesOut: 890, category: "backup" },
  { id: "x6", time: "13:22", host: "WS-009", destination: "github.com", bytesOut: 3, category: "development" },
  { id: "x7", time: "14:05", host: "WS-066", destination: "update-cdn-node.xyz", bytesOut: 640, category: "uncategorised", attack: true },
  { id: "x8", time: "15:40", host: "WS-101", destination: "zoom.us", bytesOut: 22, category: "collaboration" },
];

const FLOW_FIELDS = [
  { id: "host", label: "Host" },
  { id: "destination", label: "Destination" },
  { id: "bytesOut", label: "MB sent" },
  { id: "category", label: "Category" },
];

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 1
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "cs-l45-the-lifecycle",
    moduleId: "cs-w12-incident-response",
    sectionId: SECTION_ID,
    order: 1,
    title: "The Incident Response Lifecycle",
    subtitle: "Most of it happens before anything goes wrong",
    estimatedMinutes: 11,
    intro:
      "Incident response is often imagined as the dramatic part. In practice the outcome of an incident is mostly decided by work done months earlier, by whether anybody wrote down who decides what and who to call at three in the morning.",

    atoms: [
      {
        id: "a-cs-ir-lifecycle",
        title: "The six phases",
        explain:
          "Preparation, detection and analysis, containment, eradication, recovery, and lessons learned. The phases overlap in reality, and the order still matters because doing one before the one it depends on causes specific, predictable damage.",
        why: "The most common sequencing failure is eradicating before understanding. Wiping the machine removes the malware and also removes the answer to how it arrived, so the same thing happens again next month and you have no more idea than before.",
        table: {
          caption: "Six phases, and the failure that comes from skipping each.",
          headers: ["Phase", "Skipping it means"],
          rows: [
            ["Preparation", "Deciding everything at 3am, badly"],
            ["Detection and analysis", "Responding to the wrong thing"],
            ["Containment", "Watching it spread while you investigate"],
            ["Eradication", "Restoring a clean system into a compromised network"],
            ["Recovery", "Declaring victory before the business can operate"],
            ["Lessons learned", "The same incident again in four months"],
          ],
        },
      },
      {
        id: "a-cs-ir-preparation",
        title: "Preparation is the phase that decides the outcome",
        explain:
          "Who is the incident lead. Who can authorise disconnecting a production system. Who talks to customers. Where are the out-of-hours numbers. Do you have offline backups, and has anybody restored from one. Is there a plan, and has anybody read it this year.",
        why: "Every one of those questions has an answer that takes ten minutes to write down in advance and two hours to establish during an incident. The two hours are the expensive ones, because they happen while the attacker is still working.",
        mistake:
          "Writing an incident response plan and storing it on the file server. That is the system most likely to be unavailable during the incident it was written for. Keep a printed copy and one somewhere independent.",
      },
      {
        id: "a-cs-ir-declare",
        title: "When an event becomes an incident",
        explain:
          "An event is anything that happened. An alert is an event somebody thought was worth flagging. An incident is a confirmed or suspected compromise of confidentiality, integrity or availability, and declaring one activates the plan, the roles and the clock.",
        why: "Organisations are reluctant to declare, because declaring feels like admitting something. That reluctance costs hours at exactly the moment they matter most, and the cost of declaring and standing down is a meeting.",
        decision: {
          scenario:
            "It is 16:30 on a Friday. A workstation has been communicating with an uncategorised external domain for forty-five minutes and has sent 1.4 GB outbound. The user says they did nothing unusual. Your manager suggests looking at it properly on Monday.",
          question: "What is the right call?",
          options: [
            {
              id: "a",
              text: "Agree. Nothing is confirmed yet, and a weekend gives time to prepare a proper investigation",
              whyWrong:
                "1.4 GB left the building in forty-five minutes. If this is exfiltration, the weekend is sixty more hours of it, and the evidence in memory on that workstation will not survive until Monday.",
            },
            {
              id: "b",
              text: "Declare an incident, isolate the workstation from the network while leaving it powered on, and begin the investigation now",
              why: "Declaring costs a meeting if you are wrong. Isolation stops the transfer immediately and leaving it running preserves everything in memory, which is the evidence that disappears first.",
            },
            {
              id: "c",
              text: "Block the destination domain at the firewall and review on Monday",
              whyWrong:
                "It stops this connection and does nothing about what is on the machine, which will simply use a different destination. It also loses the memory evidence and leaves the actual question, how did it get there, unanswered.",
            },
            {
              id: "d",
              text: "Power off the workstation and investigate the disk on Monday",
              whyWrong:
                "Powering off stops the transfer and destroys everything in memory: running processes, network connections, and any key or credential held only in RAM. Isolate instead, which achieves the containment without the loss.",
            },
          ],
          correct: "b",
          aftermath:
            "The distinction between isolating and powering off is the single most consequential first decision in this whole field, and it is the subject of the next lesson.",
        },
      },
      {
        id: "a-cs-ir-roles",
        title: "Roles, named in advance",
        explain:
          "An incident lead who makes decisions and is not doing technical work. Technical responders. Someone handling communications, internal and external. Someone keeping the log of what was decided and when. On a small team one person may hold two of these, and never the first and second together.",
        why: "The lead has to be able to see the whole picture, and someone deep in a memory dump cannot. Combining those two roles is why incidents drift: nobody is tracking time, scope or who has been told what.",
        example:
          "The log the scribe keeps, which becomes the report:\n\n  16:34  Incident declared. Lead: A. Okafor\n  16:36  WS-066 isolated at the switch. Left powered on.\n  16:41  Confirmed 1.42 GB outbound to 45.87.2.19 since 11:02\n  16:52  Memory capture started\n  17:10  Finance informed that the affected user handles payroll\n  17:30  Legal engaged re: notification obligations\n\nNobody can reconstruct this afterwards. It has to be written as it happens.",
      },
      {
        id: "a-cs-ir-comms",
        title: "Communications",
        explain:
          "Who needs to know, what they need to know, and when. Legal early, because notification deadlines are legal deadlines. Executives early enough not to learn about it from a customer. Staff with enough information to avoid guessing. And a decision about whether to use the systems that may be compromised to discuss it.",
        why: "That last point is regularly missed. Discussing your response in the email system the attacker is sitting in tells them exactly what you know and what you are about to do. Agree an out-of-band channel in the preparation phase.",
        mistake:
          "Telling staff nothing. In the absence of information people invent it, and the invented version reaches customers and social media faster than the accurate one would have.",
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 2
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "cs-l46-containment-and-evidence",
    moduleId: "cs-w12-incident-response",
    sectionId: SECTION_ID,
    order: 2,
    title: "Containment Without Destroying Evidence",
    subtitle: "The first ten minutes decide what you can ever know",
    estimatedMinutes: 13,
    intro:
      "Containment and evidence preservation pull in opposite directions, and the tension is resolved by knowing which evidence disappears first. That ordering is the most practically useful thing in this lesson.",

    atoms: [
      {
        id: "a-cs-ir-containment-options",
        title: "Isolate, do not power off",
        explain:
          "Disconnecting the network stops the attacker communicating and leaves the machine running. Powering off stops everything including the evidence. For almost every incident, isolation is correct, and the exception is active destruction such as ransomware mid-encryption.",
        why: "Memory holds what the disk does not: running processes, open network connections, decryption keys, credentials, and malware that never wrote itself to disk at all. All of it is gone the moment the power is.",
        table: {
          caption: "Three containment actions, honestly compared.",
          headers: ["Action", "Stops the attacker", "Preserves memory", "Use when"],
          rows: [
            ["Isolate at the switch or unplug the cable", "Yes", "Yes", "Almost always"],
            ["Block the destination at the firewall", "Partly, they will move", "Yes", "Buying minutes, not containment"],
            ["Power off", "Yes", "No", "Active destruction in progress"],
          ],
        },
        decision: {
          scenario:
            "A workstation is actively encrypting files on a network share. You can isolate it or power it off.",
          question: "Which is right here?",
          options: [
            {
              id: "a",
              text: "Isolate, because memory evidence must be preserved",
              whyWrong:
                "Isolation stops the network share encryption and the machine keeps encrypting its own disk. Preserving evidence is important; it does not outrank stopping active destruction that is happening right now.",
            },
            {
              id: "b",
              text: "Power off, because active destruction outranks evidence preservation",
              why: "This is the recognised exception. Every second of running time destroys more data than the memory capture would have recovered, and the decryption key in memory is very unlikely to be recoverable in practice.",
            },
            {
              id: "c",
              text: "Neither. Let it finish and restore from backup afterwards",
              whyWrong:
                "That accepts the maximum possible damage on the assumption that backups are complete and current, which is exactly the assumption ransomware operators plan around.",
            },
            {
              id: "d",
              text: "Isolate first, then power off after a memory capture",
              whyWrong:
                "A memory capture takes several minutes. The local disk is being encrypted throughout, so this is choosing to lose files in exchange for evidence, which is the wrong trade when destruction is under way.",
            },
          ],
          correct: "b",
          aftermath:
            "Notice that the general rule and its exception both come from the same reasoning: stop the greater loss. It is a judgement about this incident, not a rule to memorise.",
        },
      },
      {
        id: "a-cs-ir-volatility",
        title: "The order of volatility",
        explain:
          "Evidence disappears at different speeds. CPU registers and cache are gone immediately. Memory contents are gone at power off. Network connections and running processes are gone when the process ends. Temporary files may survive a while. Disk contents persist. Backups and logs elsewhere persist longest.",
        why: "It tells you what to collect first, which is the only thing that matters when you have one shot. Collect in order of volatility, most volatile first, and document each step as you go.",
        example:
          "Collect in this order:\n\n  1  memory                  gone at power off\n  2  network connections     gone when the process exits\n  3  running processes       same\n  4  temporary files         may be cleaned automatically\n  5  disk image              persists\n  6  logs from elsewhere     persist, and may already be safe\n\nThe temptation is to start with the disk, because it feels thorough.\nStarting there means the memory is gone before you get to it.",
      },
      {
        id: "a-cs-w12-collect-evidence",
        title: "Practice: prove the image has not changed",
        explain:
          "You have taken a disk image of the affected workstation. Before it goes anywhere, you need a value that proves the copy you analyse is byte for byte the copy you took.",
        why: "Without it, anybody can ask whether the evidence was altered and you have no answer. With it, you have a value recorded at collection time that can be recomputed by anyone, at any point, and compared.",
        terminalExercise: {
          prompt: "responder@forensics:~$",
          intro:
            "Recorded from a forensics workstation. The image was taken from WS-066 with a write blocker in place.",
          goal:
            "You have just acquired evidence.img from the affected workstation. Produce the value that will prove, later, that the image has not been altered since acquisition.",
          commands: {
            "ls -lh":
              "total 32G\n-r--r--r-- 1 responder responder  32G Sep 14 17:04 evidence.img\n-rw-r--r-- 1 responder responder  1.2K Sep 14 17:04 acquisition.log",
            "sha256sum evidence.img":
              "e3b86a1f92c47d5088d3ba9e4a1c07f5b6c2d81e4f9a03b7c5e8d2a6f1b4938c  evidence.img",
            "md5sum evidence.img":
              "9f2a41c6d8e07b35a1f4c92e6d8b0a37  evidence.img",
            "cat acquisition.log":
              "Source device : /dev/sdb (WS-066 internal SSD, 32GB)\nWrite blocker : Tableau T356789, verified before acquisition\nAcquired by   : A. Okafor\nStarted       : 2026-09-14 16:52 WAT\nCompleted     : 2026-09-14 17:04 WAT\nTool          : dc3dd 7.2.646",
            "mount -o ro,loop evidence.img /mnt/evidence":
              "mount: /mnt/evidence: WARNING: source write-protected, mounted read-only.",
            "fdisk -l evidence.img":
              "Disk evidence.img: 32 GiB, 34359738368 bytes\nDevice           Boot  Start       End   Sectors  Size Type\nevidence.img1          2048   1050623   1048576  512M EFI System\nevidence.img2       1050624  67108863  66058240 31.5G Linux filesystem",
          },
          available: [
            "ls -lh",
            "sha256sum evidence.img",
            "md5sum evidence.img",
            "cat acquisition.log",
            "fdisk -l evidence.img",
            "mount -o ro,loop evidence.img /mnt/evidence",
          ],
          accept: ["sha256sum evidence.img"],
          near: [
            {
              command: "md5sum evidence.img",
              why: "The right idea with the wrong algorithm. MD5 has practical collision attacks, so a defence expert can argue that two different images could produce that value. Use SHA-256, which has no such weakness.",
            },
            {
              command: "cat acquisition.log",
              why: "That is the acquisition record, and it belongs in your documentation. It records how the image was taken, not a value proving it has not changed since.",
            },
            {
              command: "mount -o ro,loop evidence.img /mnt/evidence",
              why: "Mounting read-only is correct practice and comes after. Hash first, so you can prove the image was unchanged before anything touched it, including you.",
            },
          ],
          hint: "One command. A cryptographic hash, and specifically the one Week 3 said has no practical weakness.",
          success:
            "That value goes in the chain of custody record, and anybody can recompute it at any time. Notice the file permissions in `ls -lh`: the image is read-only, which is the other half of the same discipline.",
        },
      },
      {
        id: "a-cs-ir-chain-of-custody",
        title: "Chain of custody",
        explain:
          "An unbroken record of who held each piece of evidence, when, and what they did with it. What was collected, by whom, at what time, how it was secured, and every transfer since.",
        why: "It exists because evidence with a gap in its history can be challenged, and a successful challenge throws out the evidence rather than just the gap. In an internal disciplinary matter, in a regulatory investigation and in court, the same rule applies.",
        table: {
          caption: "What a chain of custody record has to answer.",
          headers: ["Question", "Recorded as"],
          rows: [
            ["What is it?", "Device, serial number, description"],
            ["Who took it, and when?", "Name, date, time, timezone"],
            ["How was it acquired?", "Tool, version, and whether a write blocker was used"],
            ["How do we know it is unchanged?", "The hash, recorded at acquisition"],
            ["Where has it been since?", "Every transfer, with both signatures"],
            ["Where is it now?", "Storage location and who has access"],
          ],
        },
        mistake:
          "Analysing the original. Hash it, copy it, hash the copy, and work on the copy. The original goes into secure storage and is not touched again.",
      },
      {
        id: "a-cs-ir-eradication",
        title: "Eradication and recovery",
        explain:
          "Eradication removes the attacker's access: the malware, the accounts they created, the keys they added, the persistence they established. Recovery restores service and then watches carefully, because the first sign that eradication was incomplete is usually the attacker returning.",
        why: "The sequencing error that costs organisations most is recovering before eradicating. A clean system restored into a network where the attacker still holds valid credentials is compromised again within hours, and the second incident is always harder to explain.",
        practice: {
          prompt:
            "You have removed the malware from the affected workstation and restored it from a clean image. What else has to happen before it goes back on the network?",
          answer:
            "Establish what credentials were available on that machine and reset all of them, including any cached domain credentials and any service account it used. Check whether the attacker created accounts or added keys anywhere else, and confirm the original entry route is closed. Restoring the machine addresses the machine; the attacker's access usually outlived it.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 3
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "cs-l47-investigating",
    moduleId: "cs-w12-incident-response",
    sectionId: SECTION_ID,
    order: 3,
    title: "Investigating",
    subtitle: "Building the timeline from the evidence you have",
    estimatedMinutes: 14,
    intro:
      "The output of an investigation is a timeline: what happened, in what order, with evidence for each step. This lesson builds part of one from the actual data of the incident you declared in lesson one.",

    atoms: [
      {
        id: "a-cs-ir-timeline",
        title: "The timeline is the deliverable",
        explain:
          "Every finding is an entry with a timestamp, a source and a statement of what it shows. Ordered, they answer the four questions everybody asks: how did they get in, what did they do, how far did they get, and is it over.",
        why: "It also exposes what you do not know, which is as valuable. A four-hour gap in the timeline is a finding in itself, and it is usually a missing log source rather than an attacker doing nothing.",
        table: {
          caption: "One entry, done properly.",
          headers: ["Field", "Example"],
          rows: [
            ["Time", "2026-09-14 11:02:03 WAT"],
            ["Source", "DNS query log, resolver 10.0.1.1"],
            ["Observation", "WS-066 resolved update-cdn-node.xyz to 45.87.2.19"],
            ["Significance", "First contact with an uncategorised domain; no prior history"],
            ["Confidence", "High. Corroborated by the packet capture"],
          ],
          note: "The confidence column is what separates an investigation from a story. Some entries are certain, some are inferred, and the reader is entitled to know which is which.",
        },
      },
      {
        id: "a-cs-ir-timeline-packet",
        title: "Practice: find the first contact",
        explain:
          "Here is the capture from the affected subnet. The compromised workstation is 10.0.2.66. Narrow the capture to traffic it sent, and find the packet where it first reached out to the address the lookup had just returned.",
        why: "This single packet anchors the timeline. Everything before it is the machine behaving normally; everything after it belongs to the incident. Finding it is what turns \"something happened today\" into \"it started at 11:02:04\".",
        captureExercise: {
          task:
            "Filter this capture to traffic sent by 10.0.2.66, then click the packet where it first contacted the external address the DNS response gave it.",
          packets: IR_CAPTURE,
          expect: {
            maxRows: 4,
            packet: 5,
            mustContain: [5],
            whyWrong:
              "Read the sequence. One of these packets asks for a name, and one is the first attempt to open a connection to the address that came back. You want the second of those, and it is the moment the machine first touched the outside address.",
            success:
              "Packet 5, at 11:02:04. That is the first line of your incident timeline, and everything before it on this host was ordinary.",
          },
          hint:
            "Filter on the source address rather than the protocol. Then read the Destination column to tell the lookup from the connection.",
          note:
            "Look at packet 9 too. Forty-five minutes later the same stream has carried 1.42 GB outward, which is the transfer that triggered the alert in the first place.",
        },
      },
      {
        id: "a-cs-ir-detect-exfil",
        title: "Practice: find every host doing the same thing",
        explain:
          "One workstation is confirmed. The next question in any investigation is whether it is the only one. Here are the day's outbound flow totals for every host. Write a rule that surfaces the unusual transfers.",
        why: "Scoping is the question that decides how big the incident is, and it is asked with exactly this kind of broad, deliberately imprecise query. You are not looking for certainty here. You are looking for the short list worth examining.",
        huntExercise: {
          task:
            "Surface the hosts that sent an unusual volume of data outward today. One benign alert is acceptable; think about what threshold separates ordinary use from the transfer you already know about.",
          fields: FLOW_FIELDS,
          events: FLOW_LOG,
          showAttackColumn: true,
          expect: { maxFalsePositives: 1 },
          hint:
            "One condition on the volume field. Ordinary use here tops out around 50 MB; the confirmed transfer was 1,420 MB. Anywhere between those two catches it, and the lower you set it the more you will have to read.",
          successMessage:
            "Both transfers from WS-066 caught, and one alert on the backup server, which is exactly what you would expect. That is a benign true positive: the rule is right and the environment needs to tell it that SRV-BACKUP moves a lot of data to a known destination every night.",
        },
        mistake:
          "Tuning this rule until the backup server stops alerting by lowering the scope to workstations only. The next incident will involve a server, and you will have written it out of the query.",
      },
      {
        id: "a-cs-ir-disk-forensics",
        title: "What the disk tells you",
        explain:
          "File creation, modification and access times. Deleted files that have not been overwritten. Browser history and downloads. Scheduled tasks and startup entries, which are where persistence lives. Application logs the attacker did not think about.",
        why: "Timestamps are the backbone, and they are also the thing an attacker most commonly manipulates. When filesystem times disagree with other sources, that disagreement is itself evidence rather than a problem to resolve.",
        mistake:
          "Trusting a single timestamp source. Corroborate against something the attacker did not control: the DNS log on the resolver, the firewall's record of the connection, the SIEM copy of the event. The Week 11 rule about shipping logs off the host is what makes that possible.",
      },
      {
        id: "a-cs-ir-memory-forensics",
        title: "What only memory tells you",
        explain:
          "Processes that were running and what they were doing. Network connections and the process behind each one. Command lines, including credentials passed as arguments. Decryption keys. Injected code. And malware that never touched the disk at all.",
        why: "Fileless malware is specifically designed so that a disk examination finds nothing. Memory is the only place it exists, which is the whole reason for the isolate-rather-than-power-off rule and for collecting in order of volatility.",
        example:
          "From the memory image of WS-066:\n\n  PID 4188  outlook.exe\n    └─ PID 4402  powershell.exe -nop -w hidden -enc <base64>\n         connection: 45.87.2.19:443 ESTABLISHED\n\nOutlook does not start hidden PowerShell. That one line links the\nentry route, the process and the destination, and it exists nowhere\non the disk.",
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 4
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "cs-l48-closing-it-out",
    moduleId: "cs-w12-incident-response",
    sectionId: SECTION_ID,
    order: 4,
    title: "Closing It Out",
    subtitle: "Root cause, notification, and the report",
    estimatedMinutes: 12,
    intro:
      "The incident ends with three things: an honest root cause, whatever notification the law requires, and a report that makes the same incident less likely. None of them is technical, and all of them are harder than the forensics.",

    atoms: [
      {
        id: "a-cs-ir-root-cause",
        title: "Root cause is never \"the user clicked\"",
        explain:
          "Somebody clicked. Keep asking why. Why did the attachment reach them. Why did opening it execute code. Why could that code reach the internet. Why did nobody notice for forty-five minutes. Each answer is a control that was missing or not working.",
        why: "Stopping at the click produces one recommendation, more training, and changes nothing measurable. Continuing produces four or five controls, each of which would independently have broken the chain, and any of which is more reliable than asking humans never to make a mistake.",
        example:
          "Why was there an incident?     A user opened a malicious attachment.\nWhy did it reach them?          Mail filtering does not sandbox attachments.\nWhy did opening it run code?    Macros are enabled by policy for all users.\nWhy could it call out?          No egress filtering; any host can reach any address.\nWhy was it undetected?          No endpoint telemetry, and no alerting on new outbound destinations.\nWhy 45 minutes of transfer?     No alerting on outbound volume.\n\nFive controls. Training is not among them, and any one of the five\nwould have broken the chain on its own.",
        mistake:
          "Naming the person in the report. The report is read by people who were not there and should describe the control failures, not the individual. Naming someone also guarantees that the next person hides their mistake.",
      },
      {
        id: "a-cs-ir-scope",
        title: "Answering \"how far did they get?\"",
        explain:
          "The question everybody asks and the hardest to answer honestly. It requires establishing what that machine and that account could reach, what evidence exists of them having reached it, and being explicit about what you cannot determine either way.",
        why: "The temptation is to answer with what you found. The correct answer distinguishes three things: what you confirmed happened, what could have happened and left no evidence, and what you can rule out. Most organisations report only the first, which understates the incident.",
        table: {
          caption: "Three statements, three different meanings.",
          headers: ["Statement", "Means"],
          rows: [
            ["No evidence of access to the customer database", "You looked and found nothing. Possibly because there is no log"],
            ["Confirmed no access to the customer database", "A reliable log exists and shows no access. A much stronger claim"],
            ["Access to the customer database could not be ruled out", "The honest answer where logging was absent"],
          ],
          note: "The first is routinely reported as if it meant the second. Regulators and lawyers know the difference, and so should you.",
        },
      },
      {
        id: "a-cs-ir-notification",
        title: "Notification",
        explain:
          "Data protection law in Nigeria under the NDPA, in Europe under GDPR and in most other jurisdictions requires notifying a regulator within a defined period once a personal data breach is known, and notifying affected individuals where the risk to them is high. The clocks are short and they start on awareness, not on certainty.",
        why: "This is why legal is involved early rather than at the end. A technical team that spends five days establishing the facts before telling anybody may have missed a seventy-two hour deadline while doing excellent work.",
        decision: {
          scenario:
            "Day two of the incident. You have confirmed 1.4 GB left the machine and you cannot yet determine what was in it. The affected user works in payroll. Legal asks whether this is a notifiable breach.",
          question: "What do you tell them?",
          options: [
            {
              id: "a",
              text: "Not yet. We cannot confirm personal data was taken, so there is nothing to notify",
              whyWrong:
                "The obligation generally starts when you become aware of a breach, not when you finish confirming its contents. A payroll workstation and 1.4 GB of unexplained outbound data is awareness, and waiting for certainty is how deadlines are missed.",
            },
            {
              id: "b",
              text: "Probably yes. The user handles payroll, 1.4 GB left the machine, and we cannot rule out personal data. Legal should assume notifiable and work to the deadline while we narrow the scope",
              why: "It gives legal what they actually need: what is known, what is not, and an honest assessment. They own the notification decision and they cannot make it on \"we are still looking\".",
            },
            {
              id: "c",
              text: "Yes, definitely. Notify immediately with what we have",
              whyWrong:
                "Overstating is its own problem. A notification claiming confirmed loss of payroll data that turns out to be wrong causes real harm to real people and damages your credibility for the accurate parts.",
            },
            {
              id: "d",
              text: "That is a legal question and not ours to answer",
              whyWrong:
                "The decision is theirs and the facts are yours, and they cannot decide without them. Handing over the question without the technical assessment is not neutrality, it is an incomplete handover.",
            },
          ],
          correct: "b",
          aftermath:
            "The pattern: state what is confirmed, what is not, and what you cannot rule out. Then let the people whose decision it is make it, with an accurate picture.",
        },
      },
      {
        id: "a-cs-ir-report",
        title: "The post-incident report",
        explain:
          "Executive summary, timeline, root cause, impact, what was done, and recommendations with owners and dates. It is written for people who were not in the room, including people who will read it in two years when it happens again.",
        why: "It is also the document that will be read by a regulator, an insurer or a court if this goes further. Written honestly and with its uncertainties stated, it is a strong document. Written to reassure, it falls apart under the first informed question.",
        table: {
          caption: "The sections, and the question each answers.",
          headers: ["Section", "Answers"],
          rows: [
            ["Executive summary", "What happened, how bad, what now"],
            ["Timeline", "In what order, with evidence"],
            ["Root cause", "Which controls failed, and why"],
            ["Impact", "What was confirmed, what could not be ruled out"],
            ["Response", "What we did, and when"],
            ["Recommendations", "What changes, who owns it, by when"],
          ],
        },
      },
      {
        id: "a-cs-ir-lessons",
        title: "Lessons learned, without blame",
        explain:
          "A review meeting held within two weeks, while people remember. What happened, what worked, what did not, and what changes. Run so that people can say what actually happened rather than what they wish had happened.",
        why: "A blameful review produces a version of events in which everybody acted correctly and the incident was unavoidable, which teaches nothing. The information you need is held by the people most exposed to blame, and you only get it if it is safe to give.",
        decision: {
          scenario:
            "The review establishes that an analyst saw the alert at 11:30 and closed it as benign without investigating, because that detection produces forty false positives a day.",
          question: "What goes in the report?",
          options: [
            {
              id: "a",
              text: "That the analyst failed to investigate an alert, and that retraining is required",
              whyWrong:
                "It blames a person for behaving exactly as the system trained them to. Forty false positives a day is the finding. Retraining somebody to read forty wrong alerts carefully every day will not survive a fortnight.",
            },
            {
              id: "b",
              text: "That the detection's false positive rate had made it unreadable, that this is the control failure, and that tuning it is a named action with an owner and a date",
              why: "It names the real failure, which is a detection nobody could use, and produces an action that changes the outcome. It also happens to be the accurate account of why the alert was closed.",
            },
            {
              id: "c",
              text: "Omit it, since the alert would not have changed the outcome much",
              whyWrong:
                "It would have changed the outcome by around forty minutes and 1.4 GB. Omitting the one point at which the incident could have been caught removes the most actionable finding in the whole review.",
            },
            {
              id: "d",
              text: "Record that the alert was closed in error, without further comment",
              whyWrong:
                "Technically accurate and useless. It implies individual error, produces no action, and leaves the detection firing forty times a day tomorrow.",
            },
          ],
          correct: "b",
          aftermath:
            "Month 3 ends here. You have run an offensive engagement under authorisation, written detections for what you did, and worked an incident from the first alert to the report. Month 4 turns you into a professional who can do that inside a business.",
        },
      },
    ],

    task: {
      title: "This week's lab",
      intro: "Work a simulated incident end to end, and write it up.",
      prompts: [
        "Set up an incident scenario in your lab: run a benign test binary on one VM that makes repeated outbound connections to your second VM, and detect it with the SIEM you built in Week 11.",
        "Declare the incident. Start a log with timestamps and keep it as you go. This log becomes your timeline.",
        "Isolate the affected VM without powering it off, and record what that decision preserved.",
        "Capture memory with a tool such as LiME or AVML, then take a disk image. Hash both with sha256sum and record the values in a chain of custody document.",
        "Build a timeline from at least three independent sources: the SIEM, a packet capture and the host's own logs. Mark each entry with its source and your confidence in it.",
        "Perform a basic examination with Autopsy, and a basic memory examination with Volatility. Record what each one told you that the other could not.",
        "Write a full incident response report: executive summary, timeline, root cause using the five-whys approach, impact stated with its uncertainties, response, and recommendations with owners and dates.",
      ],
      closing:
        "The impact section is the one to labour over. Getting the distinction right between what you confirmed, what you ruled out and what you could not determine is the difference between a report that survives scrutiny and one that does not.",
    },

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
