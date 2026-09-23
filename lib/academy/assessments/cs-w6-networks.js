/**
 * ASSESSMENTS · CYBERSECURITY · WEEK 6 · SECURING SYSTEMS & NETWORKS
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Never import this from anything under src/.
 * ═════════════════════════════════════════════════════════════════════════
 */

export const ASSESSMENTS = {
  /* ═══════════════════════════════════════════════════════════════════ */
  "cs-l21-firewalls": {
    lessonId: "cs-l21-firewalls",
    passMark: 70,
    questions: [
      {
        id: "csq21-1",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cs-w6-what-firewall",
        prompt: "What does a stateful firewall let you stop writing rules for?",
        options: [
          { id: "a", text: "Outbound traffic" },
          { id: "b", text: "Return traffic for connections your own machines opened" },
          { id: "c", text: "Denied traffic" },
          { id: "d", text: "Encrypted traffic" },
        ],
        correct: "b",
        explanation:
          "It remembers connections, so replies to an outbound connection are allowed back automatically. Without that, allowing a browser out would mean allowing most of the internet back in.",
        whyWrong: {
          a: "Outbound rules are still yours to write, and egress filtering is the part most organisations neglect.",
          c: "The implicit final deny handles unmatched traffic in any firewall, stateful or not.",
          d: "Encryption is invisible to a port-level firewall either way and is unaffected by connection tracking.",
        },
      },
      {
        id: "csq21-2",
        type: "scenario",
        difficulty: 3,
        atomId: "a-cs-w6-rule-order",
        prompt:
          "Staff SSH to a server is being allowed when the policy says SSH is blocked everywhere. Every rule reads correctly. What is wrong?",
        options: [
          { id: "a", text: "The deny rule is missing a protocol" },
          {
            id: "b",
            text: "A broad allow rule for staff traffic sits above the SSH deny, so it matches first",
          },
          { id: "c", text: "The firewall is stateless" },
          { id: "d", text: "SSH cannot be blocked by a port rule" },
        ],
        correct: "b",
        explanation:
          "First match wins. The staff rule allows any port to anywhere, so SSH from staff never reaches the deny rule below it. Nothing about the rules is wrong; the order is.",
        whyWrong: {
          a: "The deny rule is correct in isolation, which is exactly what makes this bug hard to see by reading.",
          c: "State tracking concerns return traffic and has no effect on which rule matches first.",
          d: "SSH is ordinary TCP on a port and is blocked by a port rule perfectly well, when that rule is reached.",
        },
      },
      {
        id: "csq21-3",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cs-w6-default-deny",
        prompt: "Why is default deny preferred over default allow?",
        options: [
          { id: "a", text: "Because it produces fewer rules" },
          {
            id: "b",
            text: "Because you can enumerate what the business needs, but not everything that could be harmful",
          },
          { id: "c", text: "Because it is faster to evaluate" },
          { id: "d", text: "Because default allow is not supported by modern firewalls" },
        ],
        correct: "b",
        explanation:
          "A guest list, not a banned list. The list of allowed flows is finite and knowable. The list of bad things is neither.",
        whyWrong: {
          a: "It often produces more rules, because every legitimate flow needs one. That cost is worth paying.",
          c: "Evaluation cost is negligible and is not the reason.",
          d: "Default allow is configurable on essentially every firewall, which is why it still turns up in assessments.",
        },
      },
      {
        id: "csq21-4",
        type: "scenario",
        difficulty: 3,
        atomId: "a-cs-w6-egress",
        prompt:
          "You want to introduce outbound filtering but nobody knows what currently leaves the network. What is the right sequence?",
        options: [
          { id: "a", text: "Enforce immediately, then fix what breaks" },
          { id: "b", text: "Run in log-only mode, build the inventory from what you see, then enforce" },
          { id: "c", text: "Block only known-bad destinations" },
          { id: "d", text: "Abandon it, since the undocumented applications make it too risky" },
        ],
        correct: "b",
        explanation:
          "Log, measure, enforce. You get the inventory without the outage, and the log itself usually turns up two or three things nobody could account for.",
        whyWrong: {
          a: "It finds the applications at the cost of an outage, and attaches that outage to the word security for years afterwards.",
          c: "A banned list only stops attackers reusing infrastructure somebody already reported. New infrastructure is nearly free.",
          d: "The undocumented applications are themselves a finding. Abandoning accepts permanent blindness to what leaves.",
        },
      },
      {
        id: "csq21-5",
        type: "mcq",
        difficulty: 3,
        atomId: "a-cs-w6-shadowed",
        prompt: "Why is a shadowed rule specifically dangerous, beyond being useless?",
        options: [
          { id: "a", text: "It slows the firewall down" },
          {
            id: "b",
            text: "The policy documents an intention the firewall is not carrying out, so readers believe a control exists",
          },
          { id: "c", text: "It can be exploited directly" },
          { id: "d", text: "It causes the implicit deny to be skipped" },
        ],
        correct: "b",
        explanation:
          "Somebody reads the policy, sees a rule saying SSH is blocked, and believes it. The rule is in the document and not in effect, which is worse than its absence.",
        whyWrong: {
          a: "The performance cost of one extra rule is immeasurable and irrelevant.",
          c: "There is nothing to exploit in a rule that never matches. The danger is the false assurance it creates.",
          d: "The implicit deny still applies to anything no rule matched. Shadowing affects only the shadowed rule.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "cs-l22-segmentation": {
    lessonId: "cs-l22-segmentation",
    passMark: 70,
    questions: [
      {
        id: "csq22-1",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cs-w6-segmentation",
        prompt:
          "Guests are on their own subnet and can still reach the file server. Why?",
        options: [
          { id: "a", text: "Because subnets do not provide isolation on their own; a rule has to stop the traffic" },
          { id: "b", text: "Because the file server is misconfigured" },
          { id: "c", text: "Because the guest WiFi password is shared" },
          { id: "d", text: "Because VLANs cannot separate wireless clients" },
        ],
        correct: "a",
        explanation:
          "A subnet is an address range. Traffic routes between subnets exactly as happily as within one unless something is configured to stop it, and that something is the firewall policy.",
        whyWrong: {
          b: "The server is doing its job by answering. The question is why the traffic reached it at all.",
          c: "Password sharing affects who can join the guest network, not where guests can go once on it.",
          d: "VLANs separate broadcast domains for wireless clients perfectly well. Routing between them is still permitted unless filtered.",
        },
      },
      {
        id: "csq22-2",
        type: "scenario",
        difficulty: 3,
        atomId: "a-cs-w6-lateral-movement",
        prompt:
          "A workstation is compromised. Every machine shares the same local administrator password and the network is flat. What happens next, and what stops it?",
        options: [
          { id: "a", text: "Nothing, until the attacker finds another vulnerability" },
          {
            id: "b",
            text: "They reuse the shared credential to reach every other machine. Unique local admin passwords and blocking workstation-to-workstation management traffic stop it",
            },
          { id: "c", text: "They must compromise the domain controller first" },
          { id: "d", text: "Antivirus blocks the connections" },
        ],
        correct: "b",
        explanation:
          "No exploit is needed. It is a valid administrator credential used over ordinary management protocols, which is exactly why the two controls named here are so high value and cost nothing to buy.",
        whyWrong: {
          a: "They already have everything they need. Requiring a further vulnerability misunderstands why credential reuse matters.",
          c: "The domain controller is usually the destination, reached by moving through machines with credentials already held.",
          d: "Nothing malicious is being run. An administrator logging in with a valid password is indistinguishable from IT work.",
        },
      },
      {
        id: "csq22-3",
        type: "mcq",
        difficulty: 3,
        atomId: "a-cs-w6-dmz",
        prompt: "Which DMZ rule matters most for containing a compromised web server?",
        options: [
          { id: "a", text: "Internet to DMZ on 443 is allowed" },
          { id: "b", text: "The DMZ server can reach nothing internal except the one database port it needs" },
          { id: "c", text: "The admin subnet can reach the DMZ" },
          { id: "d", text: "The internet cannot reach the internal network" },
        ],
        correct: "b",
        explanation:
          "You assume the public-facing server will fall. What decides the cost is where the attacker can go from there, and one port on one host is a contained incident.",
        whyWrong: {
          a: "That rule is the reason the server exists. It is not a containment control.",
          c: "Necessary for operations and it is a path inward for administrators, not a limit on the compromised server.",
          d: "True of any sensible design and it says nothing about the machine the attacker is already standing on.",
        },
      },
      {
        id: "csq22-4",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cs-w6-vlan",
        prompt: "What is the honest limitation of a VLAN as a security boundary?",
        options: [
          { id: "a", text: "VLANs do not encrypt traffic" },
          {
            id: "b",
            text: "It is a boundary enforced by configuration on equipment an attacker may be able to reach",
          },
          { id: "c", text: "VLANs are limited to 16 networks" },
          { id: "d", text: "VLANs only work on wired networks" },
        ],
        correct: "b",
        explanation:
          "For most purposes VLANs are fine. For something genuinely critical, physical separation is stronger, because it does not depend on a switch being configured correctly and staying that way.",
        whyWrong: {
          a: "True and not the limitation in question. Physical separation does not encrypt either.",
          c: "The standard allows 4,094, which is not a practical constraint here.",
          d: "Wireless networks are mapped to VLANs routinely, which is how guest WiFi separation is usually built.",
        },
      },
      {
        id: "csq22-5",
        type: "truefalse",
        difficulty: 2,
        atomId: "a-cs-w6-flat-network",
        prompt: "Segmentation prevents breaches.",
        options: [
          { id: "a", text: "True" },
          { id: "b", text: "False" },
        ],
        correct: "b",
        explanation:
          "False, and the distinction is the point. Segmentation decides what a breach costs. Prevention fails eventually; blast radius is something you can design in advance.",
        whyWrong: {
          a: "The initial foothold usually arrives by phishing or an exposed service, neither of which segmentation addresses. What it changes is where the attacker can go afterwards.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "cs-l23-remote-and-wireless": {
    lessonId: "cs-l23-remote-and-wireless",
    passMark: 70,
    questions: [
      {
        id: "csq23-1",
        type: "scenario",
        difficulty: 3,
        atomId: "a-cs-w6-vpn-myths",
        prompt:
          "Someone says a consumer VPN protects their banking password on public WiFi. What is the accurate correction?",
        options: [
          { id: "a", text: "They are right; without it the password is visible" },
          {
            id: "b",
            text: "HTTPS already protected the password. The VPN mainly hides which sites they visit, moving that visibility to the VPN provider",
          },
          { id: "c", text: "VPNs are useless and they should stop paying" },
          { id: "d", text: "They should also avoid logging in on public WiFi entirely" },
        ],
        correct: "b",
        explanation:
          "Say what a control protects, from whom, and what it moves rather than removes. Here it moves the observer from the café to the VPN company, which is a choice about who you would rather trust.",
        whyWrong: {
          a: "The bank is HTTPS, so the password was already encrypted with or without a VPN. Agreeing leaves them relying on it where it does not apply.",
          c: "Hiding destination metadata from a network you do not control is a real benefit, as is reaching a company network remotely.",
          d: "Unnecessary given HTTPS, and it is advice with no reasoning attached, which leaves them more anxious and no better informed.",
        },
      },
      {
        id: "csq23-2",
        type: "mcq",
        difficulty: 3,
        atomId: "a-cs-w6-wifi",
        prompt:
          "On WPA2 with a shared password, what can other people in the building often do?",
        options: [
          { id: "a", text: "Nothing, the traffic is encrypted per device" },
          { id: "b", text: "Decrypt your traffic, if they have the password and captured your device connecting" },
          { id: "c", text: "Change your device's IP address" },
          { id: "d", text: "Read your traffic only if it is HTTP" },
        ],
        correct: "b",
        explanation:
          "This is why the office WiFi having a password is not a reason to run plain HTTP internally. WPA3 fixes this specific problem by giving each session its own protection even on a shared password.",
        whyWrong: {
          a: "That is WPA3's behaviour. WPA2-Personal derives session keys from the shared password and the handshake, which an observer may have captured.",
          c: "Address assignment is a DHCP matter and is a different attack entirely.",
          d: "HTTPS still protects content at the application layer, which is true and separate. The question was what WPA2 itself protects.",
        },
      },
      {
        id: "csq23-3",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cs-w6-evil-twin",
        prompt: "Why does an evil twin network work without any technical break?",
        options: [
          { id: "a", text: "Because it cracks the WiFi password" },
          {
            id: "b",
            text: "Because devices automatically rejoin a remembered network name, and anyone can broadcast that name",
          },
          { id: "c", text: "Because it exploits a flaw in WPA3" },
          { id: "d", text: "Because it intercepts the DNS server" },
        ],
        correct: "b",
        explanation:
          "The name is the one part of a wireless network anybody can copy in four seconds. The device does the rest by itself, which is why automatic joining for open networks is worth turning off.",
        whyWrong: {
          a: "No password is involved for an open network, and for a protected one the attacker simply runs their own open copy.",
          c: "It predates WPA3 entirely and depends on client behaviour rather than a protocol flaw.",
          d: "DNS manipulation is usually what happens next, after the device has joined. It is not why it joined.",
        },
      },
      {
        id: "csq23-4",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cs-w6-nac",
        prompt: "What gap does network access control close that a firewall does not?",
        options: [
          { id: "a", text: "It encrypts internal traffic" },
          {
            id: "b",
            text: "It decides whether a device may join at all, and can quarantine one that is unpatched or unknown",
          },
          { id: "c", text: "It replaces the need for segmentation" },
          { id: "d", text: "It blocks outbound traffic" },
        ],
        correct: "b",
        explanation:
          "The contractor's laptop in a meeting room socket, the personal phone on staff WiFi, the machine that has been off for four months. A firewall filters traffic; this decides admission.",
        whyWrong: {
          a: "Encryption is not what it does. It is an admission control.",
          c: "The two complement each other. Admission decides who gets in; segmentation decides where they can go.",
          d: "Egress filtering is a firewall function and is a separate control.",
        },
      },
      {
        id: "csq23-5",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cs-w6-vpn",
        prompt: "What does a corporate VPN change about who can observe your traffic?",
        options: [
          { id: "a", text: "Nothing can observe it anywhere" },
          {
            id: "b",
            text: "The café network sees only an encrypted tunnel; the employer now sees everything routed through it",
          },
          { id: "c", text: "The websites you visit can no longer identify you" },
          { id: "d", text: "It makes HTTP as safe as HTTPS" },
        ],
        correct: "b",
        explanation:
          "It moves the boundary rather than removing it. Protection applies inside the tunnel; after the exit, traffic is exactly as protected as it was before.",
        whyWrong: {
          a: "Observation moves to the tunnel's exit point and to the VPN operator. Nothing becomes unobservable.",
          c: "Once you log in, the site knows who you are regardless of where the connection came from.",
          d: "HTTP is still plaintext once it leaves the tunnel exit. The tunnel protects one hop, not the whole path.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "cs-l24-detection-zero-trust": {
    lessonId: "cs-l24-detection-zero-trust",
    passMark: 70,
    questions: [
      {
        id: "csq24-1",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cs-w6-ids-ips",
        prompt:
          "What is the real difference between running detection and running prevention?",
        options: [
          { id: "a", text: "Prevention uses better analysis" },
          { id: "b", text: "What a false positive costs: a wasted hour, or an outage" },
          { id: "c", text: "Detection cannot see encrypted traffic and prevention can" },
          { id: "d", text: "Prevention is always preferable" },
        ],
        correct: "b",
        explanation:
          "The analysis is identical. The deployment decides the consequence of being wrong, which is why mature organisations often run detection in front of business-critical traffic and prevention elsewhere.",
        whyWrong: {
          a: "The same rules and the same engine can run in either mode. Analysis is not the variable.",
          c: "Both face the same encryption problem, because both are reading the same traffic.",
          d: "A blocking rule that is wrong at 09:00 on a Monday is an incident of its own. Always-block is a decision, not a default.",
        },
      },
      {
        id: "csq24-2",
        type: "scenario",
        difficulty: 3,
        atomId: "a-cs-w6-ids-evidence",
        prompt:
          "A capture shows three connection attempts from one host to ports 22, 23 and 3306 within the same millisecond, each answered with a reset. What does that pattern tell you?",
        options: [
          { id: "a", text: "A user opened three applications at once" },
          { id: "b", text: "It is a scanner. Three services in under a millisecond is neither a person nor an application" },
          { id: "c", text: "The server is misconfigured and resetting valid connections" },
          { id: "d", text: "The network is dropping packets" },
        ],
        correct: "b",
        explanation:
          "Timing is the evidence. Human and application behaviour is irregular; a scanner works through ports mechanically and the resets show those ports are closed.",
        whyWrong: {
          a: "No user opens SSH, telnet and MySQL simultaneously, and certainly not within one millisecond of each other.",
          c: "A reset is the correct response to a connection attempt on a closed port. The server behaved properly.",
          d: "Dropped packets show as retransmissions or silence, not as prompt resets.",
        },
      },
      {
        id: "csq24-3",
        type: "mcq",
        difficulty: 3,
        atomId: "a-cs-w6-signature-anomaly",
        prompt:
          "A detection is right 99% of the time on a network with a million events a day. Why is that a problem?",
        options: [
          { id: "a", text: "It is not. 99% is excellent" },
          {
            id: "b",
            text: "It produces about ten thousand wrong alerts a day, and nobody reads the ten-thousand-and-first",
          },
          { id: "c", text: "Because the 1% will always be the real attacks" },
          { id: "d", text: "Because the rule will slow the sensor down" },
        ],
        correct: "b",
        explanation:
          "Accuracy has to be judged against volume. A rule that catches the attack and buries it in noise has not helped, which is why detections are graded on false positives as well as catches.",
        whyWrong: {
          a: "It sounds excellent and is unusable at this volume, which is exactly the trap the number sets.",
          c: "The errors are not systematically the real attacks. The problem is the quantity of wrong alerts, not their composition.",
          d: "Performance is not the constraint. Analyst attention is.",
        },
      },
      {
        id: "csq24-4",
        type: "mcq",
        difficulty: 3,
        atomId: "a-cs-w6-ids-placement",
        prompt: "Why has network-based detection become less capable over the last decade?",
        options: [
          { id: "a", text: "Networks are faster than sensors can process" },
          { id: "b", text: "Most traffic is now encrypted, so a network sensor can read metadata but not content" },
          { id: "c", text: "Signature databases stopped being maintained" },
          { id: "d", text: "Attackers stopped using the network" },
        ],
        correct: "b",
        explanation:
          "The sensor that could read everything in 2010 reads almost nothing today. What remains is metadata analysis, which is how the sixty-second beacon in Week 4 was found, and it explains the shift towards endpoint agents.",
        whyWrong: {
          a: "Throughput is an engineering problem with engineering answers. It is not the structural change.",
          c: "Signature sets are actively maintained. They simply cannot match content they cannot see.",
          d: "Everything still crosses the network. It is just no longer readable in transit.",
        },
      },
      {
        id: "csq24-5",
        type: "scenario",
        difficulty: 3,
        atomId: "a-cs-w6-zero-trust",
        prompt:
          "A vendor says zero trust means you can remove your firewalls and VPN. What is the accurate assessment?",
        options: [
          { id: "a", text: "Correct, since network position no longer matters" },
          {
            id: "b",
            text: "Zero trust removes network position as a reason to trust a request. Segmentation and egress filtering still limit blast radius and are still worth having",
          },
          { id: "c", text: "Zero trust is marketing and should be ignored" },
          { id: "d", text: "It applies only to fully cloud-based organisations" },
        ],
        correct: "b",
        explanation:
          "It is an architecture, not a product. Removing segmentation would hand lateral movement back to the attacker, and defence in depth does not stop applying because a new model arrived.",
        whyWrong: {
          a: "Network position stops being evidence of trust. That is not the same as network controls having no value.",
          c: "The term is oversold and the underlying principle came from observing real breaches. Dismissing it keeps a perimeter that no longer exists.",
          d: "It applies anywhere people work remotely or an internal network holds devices you do not fully control, which is almost everywhere.",
        },
      },
    ],
  },
};

export default ASSESSMENTS;
