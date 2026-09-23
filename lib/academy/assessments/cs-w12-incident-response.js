/**
 * ASSESSMENTS · CYBERSECURITY · WEEK 12 · INCIDENT RESPONSE & FORENSICS
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Never import this from anything under src/.
 * ═════════════════════════════════════════════════════════════════════════
 */

export const ASSESSMENTS = {
  /* ═══════════════════════════════════════════════════════════════════ */
  "cs-l45-the-lifecycle": {
    lessonId: "cs-l45-the-lifecycle",
    passMark: 70,
    questions: [
      {
        id: "csq45-1",
        type: "scenario",
        difficulty: 3,
        atomId: "a-cs-ir-declare",
        prompt:
          "16:30 Friday. A workstation has sent 1.4 GB to an uncategorised domain over forty-five minutes. Your manager suggests Monday. What is the right call?",
        options: [
          { id: "a", text: "Agree; a weekend allows a properly prepared investigation" },
          {
            id: "b",
            text: "Declare an incident, isolate the workstation while leaving it powered on, and start now",
          },
          { id: "c", text: "Block the domain at the firewall and review on Monday" },
          { id: "d", text: "Power the workstation off and examine the disk on Monday" },
        ],
        correct: "b",
        explanation:
          "Declaring costs a meeting if you are wrong. Waiting costs sixty more hours of possible transfer and everything in memory, which is the evidence that disappears first.",
        whyWrong: {
          a: "If this is exfiltration, the weekend is the incident continuing, and the memory evidence will not survive to Monday.",
          c: "It stops this connection and leaves whatever is on the machine, which will use another destination. The memory is still lost.",
          d: "Powering off destroys running processes, connections and anything held only in RAM. Isolation contains without that loss.",
        },
      },
      {
        id: "csq45-2",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cs-ir-lifecycle",
        prompt: "What goes wrong when eradication happens before analysis?",
        options: [
          { id: "a", text: "The malware may not be fully removed" },
          {
            id: "b",
            text: "Wiping removes the answer to how it arrived, so the same thing happens again with no more knowledge",
          },
          { id: "c", text: "Recovery takes longer" },
          { id: "d", text: "Backups become unusable" },
        ],
        correct: "b",
        explanation:
          "This is the most common sequencing failure in incident response. The machine is clean, the entry route is unknown, and the organisation is exactly as exposed as before.",
        whyWrong: {
          a: "A possible outcome and not the structural problem. A complete wipe removes the malware and the evidence together.",
          c: "Recovery time is unaffected, which is part of why the shortcut is tempting.",
          d: "Backups are unrelated to the order of these two phases.",
        },
      },
      {
        id: "csq45-3",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cs-ir-preparation",
        prompt: "Why should the incident response plan not live only on the file server?",
        options: [
          { id: "a", text: "Because file servers are slow" },
          {
            id: "b",
            text: "Because that is the system most likely to be unavailable during the incident it was written for",
          },
          { id: "c", text: "Because the plan should be confidential" },
          { id: "d", text: "Because version control is difficult there" },
        ],
        correct: "b",
        explanation:
          "Ransomware, an outage or an isolation decision can all put it out of reach at exactly the moment it is needed. Keep a printed copy and one somewhere independent.",
        whyWrong: {
          a: "Performance is irrelevant to a document nobody can reach.",
          c: "It should be controlled and the problem here is availability, not confidentiality.",
          d: "Version control is a document management concern rather than an incident one.",
        },
      },
      {
        id: "csq45-4",
        type: "mcq",
        difficulty: 3,
        atomId: "a-cs-ir-roles",
        prompt:
          "Why should the incident lead not also be doing the technical investigation?",
        options: [
          { id: "a", text: "Because leads are usually not technical" },
          {
            id: "b",
            text: "Because someone deep in a memory dump cannot track time, scope and who has been informed",
          },
          { id: "c", text: "Because it breaches separation of duties" },
          { id: "d", text: "Because the lead must remain available for media questions" },
        ],
        correct: "b",
        explanation:
          "Combining the two is why incidents drift. The lead has to see the whole picture, and deep technical work makes that impossible for as long as it lasts.",
        whyWrong: {
          a: "Many leads are highly technical. The constraint is attention, not capability.",
          c: "Separation of duties is a different control concerned with fraud and authorisation.",
          d: "Media handling is usually the communications role, and is not the reason.",
        },
      },
      {
        id: "csq45-5",
        type: "scenario",
        difficulty: 3,
        atomId: "a-cs-ir-comms",
        prompt:
          "Why should incident response not be coordinated over the company's own email during a suspected compromise?",
        options: [
          { id: "a", text: "Because email is slow" },
          {
            id: "b",
            text: "Because an attacker inside the mail system learns exactly what you know and what you are about to do",
          },
          { id: "c", text: "Because email is not a formal record" },
          { id: "d", text: "Because it would notify too many people" },
        ],
        correct: "b",
        explanation:
          "If the mail system is in scope of the compromise, your response plan is being read by the person you are responding to. Agree an out-of-band channel during the preparation phase.",
        whyWrong: {
          a: "Speed is not the issue and email is fast enough for coordination.",
          c: "Email is a perfectly good record, which is part of why the exposure matters.",
          d: "Distribution is controllable. Confidentiality from the attacker is not, once they are in the system.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "cs-l46-containment-and-evidence": {
    lessonId: "cs-l46-containment-and-evidence",
    passMark: 70,
    questions: [
      {
        id: "csq46-1",
        type: "mcq",
        difficulty: 3,
        atomId: "a-cs-ir-containment-options",
        prompt:
          "Why is isolating a machine usually preferred over powering it off?",
        options: [
          { id: "a", text: "Because powering off takes longer" },
          {
            id: "b",
            text: "Because memory holds processes, connections, keys and fileless malware, all of which are lost at power off",
          },
          { id: "c", text: "Because isolation is reversible" },
          { id: "d", text: "Because powering off alerts the attacker" },
        ],
        correct: "b",
        explanation:
          "Isolation stops the attacker communicating while preserving everything that exists only in RAM, which for fileless malware is everything there is.",
        whyWrong: {
          a: "Powering off is faster, which is part of its appeal in a hurry.",
          c: "Both are reversible in the sense that matters, and reversibility is not the reason.",
          d: "The attacker notices either way. Losing the network is as visible to them as losing the host.",
        },
      },
      {
        id: "csq46-2",
        type: "scenario",
        difficulty: 3,
        atomId: "a-cs-ir-containment-options",
        prompt:
          "A machine is actively encrypting a network share. Isolate or power off?",
        options: [
          { id: "a", text: "Isolate, because memory evidence must be preserved" },
          { id: "b", text: "Power off, because active destruction outranks evidence preservation" },
          { id: "c", text: "Let it finish and restore from backup" },
          { id: "d", text: "Isolate, capture memory, then power off" },
        ],
        correct: "b",
        explanation:
          "This is the recognised exception. Every second of running time destroys more data than the memory capture would have recovered.",
        whyWrong: {
          a: "Isolation stops the share encryption and the local disk keeps going. Evidence does not outrank destruction in progress.",
          c: "That accepts maximum damage on the assumption that backups are complete, which is what ransomware operators plan around.",
          d: "A memory capture takes minutes, during which the local disk is still being encrypted. Wrong trade while destruction is under way.",
        },
      },
      {
        id: "csq46-3",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cs-ir-volatility",
        prompt: "In what order should evidence be collected?",
        options: [
          { id: "a", text: "Disk image first, because it is the most complete" },
          { id: "b", text: "Most volatile first: memory, then connections and processes, then disk" },
          { id: "c", text: "Logs first, since they are easiest" },
          { id: "d", text: "Whatever the tooling supports first" },
        ],
        correct: "b",
        explanation:
          "You have one shot, and the order of volatility tells you what disappears soonest. Starting with the disk means the memory is gone before you reach it.",
        whyWrong: {
          a: "The disk is the most complete and the most persistent, which is precisely why it can wait.",
          c: "Logs shipped elsewhere are already safe, so they are the least urgent.",
          d: "Tool convenience is not a reason to lose the most perishable evidence.",
        },
      },
      {
        id: "csq46-4",
        type: "mcq",
        difficulty: 3,
        atomId: "a-cs-w12-collect-evidence",
        prompt:
          "Why hash a disk image with SHA-256 rather than MD5?",
        options: [
          { id: "a", text: "SHA-256 is faster" },
          {
            id: "b",
            text: "MD5 has practical collision attacks, so it can be argued that two different images could produce the same value",
          },
          { id: "c", text: "MD5 cannot handle files over 4 GB" },
          { id: "d", text: "SHA-256 also encrypts the image" },
        ],
        correct: "b",
        explanation:
          "The hash exists so that nobody can argue the evidence changed. An algorithm with known collisions gives exactly that argument away.",
        whyWrong: {
          a: "MD5 is faster. Speed is not the criterion for evidence integrity.",
          c: "MD5 handles files of any size. Size is not the limitation.",
          d: "Hashing is not encryption, as Week 3 covered. Nothing is made unreadable.",
        },
      },
      {
        id: "csq46-5",
        type: "scenario",
        difficulty: 3,
        atomId: "a-cs-ir-eradication",
        prompt:
          "You have reimaged the affected workstation from a clean image. What else must happen before it returns to the network?",
        options: [
          { id: "a", text: "Nothing. The machine is clean" },
          {
            id: "b",
            text: "Reset every credential that was available on it, confirm no accounts or keys were added elsewhere, and close the original entry route",
          },
          { id: "c", text: "Run a full antivirus scan on the reimaged machine" },
          { id: "d", text: "Restore the user's files from backup" },
        ],
        correct: "b",
        explanation:
          "Restoring the machine addresses the machine. The attacker's access usually outlived it, in the form of credentials, added accounts and keys elsewhere.",
        whyWrong: {
          a: "A clean system restored into a network where the attacker still holds valid credentials is compromised again within hours.",
          c: "Scanning a freshly built image finds nothing, and the risk is not on that machine any more.",
          d: "Necessary for the user and irrelevant to whether the attacker still has access.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "cs-l47-investigating": {
    lessonId: "cs-l47-investigating",
    passMark: 70,
    questions: [
      {
        id: "csq47-1",
        type: "mcq",
        difficulty: 3,
        atomId: "a-cs-ir-timeline",
        prompt:
          "Why does a timeline entry need a confidence field?",
        options: [
          { id: "a", text: "To satisfy audit requirements" },
          {
            id: "b",
            text: "Because some entries are certain and some are inferred, and the reader is entitled to know which is which",
          },
          { id: "c", text: "To rank entries by importance" },
          { id: "d", text: "Because timestamps are unreliable" },
        ],
        correct: "b",
        explanation:
          "It is what separates an investigation from a story. A reader who cannot tell the corroborated entries from the inferred ones cannot rely on any of it.",
        whyWrong: {
          a: "Audits may ask for it because it is good practice, rather than the other way round.",
          c: "Importance is a separate judgement, and a low-confidence entry can be the most important one.",
          d: "Timestamp reliability is one input to confidence and not the whole of it.",
        },
      },
      {
        id: "csq47-2",
        type: "scenario",
        difficulty: 3,
        atomId: "a-cs-ir-timeline-packet",
        prompt:
          "Why does finding the first outbound connection matter more than finding the largest transfer?",
        options: [
          { id: "a", text: "Because the first packet is easier to find" },
          {
            id: "b",
            text: "Because it anchors the timeline: everything before it was ordinary and everything after belongs to the incident",
          },
          { id: "c", text: "Because the largest transfer may be legitimate" },
          { id: "d", text: "Because early packets are more reliable evidence" },
        ],
        correct: "b",
        explanation:
          "It turns \"something happened today\" into \"it started at 11:02:04\", which is what lets you scope everything else: what else that host did after it, and what it did not do before.",
        whyWrong: {
          a: "It is harder to find, which is why you filter rather than scroll.",
          c: "The large transfer is what triggered the alert and is well established. The start time is what you did not have.",
          d: "All captured packets are equally reliable. Position in the sequence is what carries the meaning.",
        },
      },
      {
        id: "csq47-3",
        type: "scenario",
        difficulty: 3,
        atomId: "a-cs-ir-detect-exfil",
        prompt:
          "A rule for unusual outbound volume also alerts on the nightly backup server. How should that be handled?",
        options: [
          { id: "a", text: "Lower the scope to workstations only" },
          {
            id: "b",
            text: "Record it as a benign true positive and add enrichment so the known backup destination is suppressed",
          },
          { id: "c", text: "Raise the threshold above the backup volume" },
          { id: "d", text: "Turn the rule off, as it is too noisy" },
        ],
        correct: "b",
        explanation:
          "The rule is right. The environment needs to tell it that this server moves a lot of data to a known destination every night, which is an enrichment gap rather than a rule defect.",
        whyWrong: {
          a: "The next incident will involve a server, and you will have written it out of the query.",
          c: "That hides any exfiltration smaller than a backup, which is most of it.",
          d: "One benign alert a day is not noisy. Turning it off loses the detection that just scoped an incident.",
        },
      },
      {
        id: "csq47-4",
        type: "mcq",
        difficulty: 3,
        atomId: "a-cs-ir-memory-forensics",
        prompt: "What can memory analysis show that a disk examination cannot?",
        options: [
          { id: "a", text: "Deleted files" },
          {
            id: "b",
            text: "Running processes and their connections, command lines, keys, and malware that never touched the disk",
          },
          { id: "c", text: "File modification timestamps" },
          { id: "d", text: "Browser history" },
        ],
        correct: "b",
        explanation:
          "Fileless malware is designed so a disk examination finds nothing. Memory is the only place it exists, which is the whole reason for isolating rather than powering off.",
        whyWrong: {
          a: "Deleted files are recovered from the disk, where their contents persist until overwritten.",
          c: "Timestamps are filesystem metadata and live on the disk.",
          d: "Browser history is written to disk, though fragments may also be in memory.",
        },
      },
      {
        id: "csq47-5",
        type: "mcq",
        difficulty: 3,
        atomId: "a-cs-ir-disk-forensics",
        prompt:
          "Filesystem timestamps disagree with the DNS log on the resolver. What does that tell you?",
        options: [
          { id: "a", text: "One of the sources is broken and should be discarded" },
          {
            id: "b",
            text: "The disagreement is itself evidence, and timestamp manipulation is a common attacker technique",
          },
          { id: "c", text: "The timezone configuration is wrong" },
          { id: "d", text: "The DNS log should be preferred without further thought" },
        ],
        correct: "b",
        explanation:
          "Filesystem times are the ones an attacker can most easily change. Corroborating against something they did not control, such as the resolver's log, is why Week 11 insisted on shipping logs off the host.",
        whyWrong: {
          a: "Discarding a source loses the finding. The conflict is the information.",
          c: "Worth checking first and, once ruled out, the disagreement stands as evidence.",
          d: "The resolver's log is usually more trustworthy here, and \"without further thought\" discards the reason it matters.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "cs-l48-closing-it-out": {
    lessonId: "cs-l48-closing-it-out",
    passMark: 70,
    questions: [
      {
        id: "csq48-1",
        type: "scenario",
        difficulty: 3,
        atomId: "a-cs-ir-root-cause",
        prompt:
          "An investigation concludes that the root cause was a user clicking a malicious attachment. What is wrong with stopping there?",
        options: [
          { id: "a", text: "Nothing; that is the root cause" },
          {
            id: "b",
            text: "It produces one recommendation, more training, while four or five control failures each allowed the chain to continue",
          },
          { id: "c", text: "The user should be named for accountability" },
          { id: "d", text: "Clicking is not a security event" },
        ],
        correct: "b",
        explanation:
          "Why did it reach them, why did opening it run code, why could it call out, why was it undetected. Each answer is a control, and any one of them would have broken the chain more reliably than asking humans never to err.",
        whyWrong: {
          a: "It is the first event, not the root cause. Root cause analysis continues until it reaches things you can change.",
          c: "Naming individuals guarantees the next person hides their mistake, and the report is read by people who were not there.",
          d: "It is very much a security event. It is just not the whole explanation.",
        },
      },
      {
        id: "csq48-2",
        type: "mcq",
        difficulty: 3,
        atomId: "a-cs-ir-scope",
        prompt:
          "What is the difference between \"no evidence of access\" and \"confirmed no access\"?",
        options: [
          { id: "a", text: "They are two phrasings of the same finding" },
          {
            id: "b",
            text: "The first means you looked and found nothing, possibly because no log exists. The second means a reliable log shows it did not happen",
          },
          { id: "c", text: "The first is stronger" },
          { id: "d", text: "The difference only matters in court" },
        ],
        correct: "b",
        explanation:
          "The first is routinely reported as if it meant the second. Regulators and lawyers know the difference, and where logging was absent the honest phrasing is that access could not be ruled out.",
        whyWrong: {
          a: "They are materially different claims, and conflating them understates the incident.",
          c: "The second is far stronger, because it rests on evidence rather than on absence of evidence.",
          d: "It matters to every decision that follows, including notification, which happens long before any court.",
        },
      },
      {
        id: "csq48-3",
        type: "scenario",
        difficulty: 3,
        atomId: "a-cs-ir-notification",
        prompt:
          "Day two. 1.4 GB left a payroll workstation and you cannot yet determine its contents. Legal asks whether this is notifiable.",
        options: [
          { id: "a", text: "Not yet; nothing is confirmed" },
          {
            id: "b",
            text: "Probably yes. State what is known, what is not, and that personal data cannot be ruled out, so they can work to the deadline",
          },
          { id: "c", text: "Yes, definitely; notify immediately with what you have" },
          { id: "d", text: "It is a legal question, not yours to answer" },
        ],
        correct: "b",
        explanation:
          "The obligation generally starts on awareness, not on certainty, and the clocks are short. Legal owns the decision and cannot make it on \"we are still looking\".",
        whyWrong: {
          a: "Waiting for certainty is exactly how a seventy-two hour deadline is missed while doing excellent technical work.",
          c: "Overstating causes real harm to real people if wrong and damages credibility for the parts that were accurate.",
          d: "The decision is theirs and the facts are yours. Handing over the question without the assessment is an incomplete handover.",
        },
      },
      {
        id: "csq48-4",
        type: "scenario",
        difficulty: 3,
        atomId: "a-cs-ir-lessons",
        prompt:
          "An analyst closed the alert without investigating because that detection produces forty false positives a day. What goes in the report?",
        options: [
          { id: "a", text: "That the analyst failed to investigate, and retraining is required" },
          {
            id: "b",
            text: "That the detection's false positive rate had made it unreadable, which is the control failure, with tuning as a named action",
          },
          { id: "c", text: "Omit it; the alert would not have changed much" },
          { id: "d", text: "Record that the alert was closed in error, without comment" },
        ],
        correct: "b",
        explanation:
          "It names the real failure and produces an action that changes the outcome. It also happens to be the accurate account of why the alert was closed.",
        whyWrong: {
          a: "It blames a person for behaving exactly as the system trained them to, and retraining will not survive a fortnight.",
          c: "It would have changed the outcome by forty minutes and 1.4 GB, and it is the most actionable finding in the review.",
          d: "Technically accurate and useless. It implies individual error, produces no action, and the detection still fires forty times tomorrow.",
        },
      },
      {
        id: "csq48-5",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cs-ir-report",
        prompt:
          "Why should a post-incident report state its uncertainties rather than reassure?",
        options: [
          { id: "a", text: "Because regulators require a specific format" },
          {
            id: "b",
            text: "Because it may be read by a regulator, an insurer or a court, and a reassuring report falls apart under the first informed question",
          },
          { id: "c", text: "Because uncertainty reduces liability" },
          { id: "d", text: "Because technical readers prefer detail" },
        ],
        correct: "b",
        explanation:
          "Written honestly, with its limits stated, it is a strong document that holds up. Written to reassure, every overstatement becomes a place to attack the whole.",
        whyWrong: {
          a: "Formats vary and no format compels honesty. The reason is what happens when the document is examined.",
          c: "Honesty is not a liability strategy, and stating uncertainty for that reason would be the wrong motive with the right outcome.",
          d: "Audience preference is a minor consideration next to the document's survival under scrutiny.",
        },
      },
    ],
  },
};

export default ASSESSMENTS;
