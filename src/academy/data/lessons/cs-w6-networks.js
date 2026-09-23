/**
 * CYBERSECURITY · WEEK 6 · SECURING SYSTEMS & NETWORKS
 *
 * Harvard anchor: extends "Securing Systems" from the host to the network
 * perimeter and beyond.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 *
 * Rule order is the whole of the first lesson, and it is the thing a network
 * diagram can never show. Both firewall exercises here start from a policy
 * where every individual rule is correct and the order is not, because that is
 * what the mistake actually looks like in production.
 */

export const SECTION_ID = "cs-s6-networks";

/** An IDS alert, with the traffic that caused it. */
const SCAN_CAPTURE = [
  {
    no: 1,
    time: "14:02:11.004",
    src: "10.0.2.30",
    dst: "10.0.1.5",
    proto: "TCP",
    sport: 52180,
    dport: 443,
    length: 74,
    info: "52180 → 443 [SYN] Seq=0 Win=64240",
    flags: "SYN",
  },
  {
    no: 2,
    time: "14:02:11.006",
    src: "10.0.1.5",
    dst: "10.0.2.30",
    proto: "TCP",
    sport: 443,
    dport: 52180,
    length: 74,
    info: "443 → 52180 [SYN, ACK] Seq=0 Ack=1",
    flags: "SYN ACK",
  },
  {
    no: 3,
    time: "14:02:44.881",
    src: "192.168.50.31",
    dst: "10.0.1.9",
    proto: "TCP",
    sport: 41022,
    dport: 22,
    length: 58,
    info: "41022 → 22 [SYN] Seq=0 Win=1024",
    flags: "SYN",
  },
  {
    no: 4,
    time: "14:02:44.881",
    src: "10.0.1.9",
    dst: "192.168.50.31",
    proto: "TCP",
    sport: 22,
    dport: 41022,
    length: 54,
    info: "22 → 41022 [RST, ACK] Seq=1 Ack=1",
    flags: "RST ACK",
  },
  {
    no: 5,
    time: "14:02:44.882",
    src: "192.168.50.31",
    dst: "10.0.1.9",
    proto: "TCP",
    sport: 41023,
    dport: 23,
    length: 58,
    info: "41023 → 23 [SYN] Seq=0 Win=1024",
    flags: "SYN",
  },
  {
    no: 6,
    time: "14:02:44.882",
    src: "10.0.1.9",
    dst: "192.168.50.31",
    proto: "TCP",
    sport: 23,
    dport: 41023,
    length: 54,
    info: "23 → 41023 [RST, ACK] Seq=1 Ack=1",
    flags: "RST ACK",
  },
  {
    no: 7,
    time: "14:02:44.883",
    src: "192.168.50.31",
    dst: "10.0.1.9",
    proto: "TCP",
    sport: 41024,
    dport: 3306,
    length: 58,
    info: "41024 → 3306 [SYN] Seq=0 Win=1024",
    flags: "SYN",
  },
  {
    no: 8,
    time: "14:02:44.884",
    src: "10.0.1.9",
    dst: "192.168.50.31",
    proto: "TCP",
    sport: 3306,
    dport: 41024,
    length: 54,
    info: "3306 → 41024 [RST, ACK] Seq=1 Ack=1",
    flags: "RST ACK",
  },
];

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 1
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "cs-l21-firewalls",
    moduleId: "cs-w6-networks",
    sectionId: SECTION_ID,
    order: 1,
    title: "Firewalls, and Why Order Decides Everything",
    subtitle: "Every rule correct, and the policy still wrong",
    estimatedMinutes: 13,
    intro:
      "A firewall is a list of rules read from the top until one matches. That single sentence explains most firewall bugs you will ever see, and it is why this lesson is mostly an exercise rather than a diagram.",

    atoms: [
      {
        id: "a-cs-w6-what-firewall",
        title: "Stateless and stateful",
        explain:
          "A stateless firewall looks at each packet on its own: source, destination, port, protocol. A stateful firewall remembers connections, so when your machine opens a connection outward, the replies are allowed back automatically without a rule for them.",
        why: "Stateful is what makes a usable policy possible. Without it, allowing a web browser out would mean allowing every high port back in, which is most of the internet. With it, you write one outbound rule and the return traffic is handled.",
        mistake:
          "Writing explicit rules for return traffic on a stateful firewall. It is unnecessary and it usually opens more than the person intended, because the return rule ends up phrased as \"allow anything from anywhere to high ports\".",
      },
      {
        id: "a-cs-w6-default-deny",
        title: "Default deny, drawn rather than described",
        explain:
          "Anything not explicitly allowed is blocked. It is the final, implicit rule at the bottom of every sensible policy, and it is the reason you write allow rules rather than deny rules for most things.",
        why: "The alternative, default allow, means your security depends on having thought of every bad thing in advance. Default deny means it depends on having thought of every good thing, and that is a list you actually have, because it is the list of what the business does.",
        analogy:
          "A guest list, not a banned list. You can write down everyone invited. You cannot write down everyone who was not.",
        example:
          "  1  allow  tcp  any → web servers   443\n  2  allow  tcp  admin subnet → any   22\n  ─  deny   any  any → any        any    ← always here, never written\n\nThe last line is why nobody had to write a rule blocking\nthe database port. Nothing allowed it, so it was blocked.",
      },
      {
        id: "a-cs-w6-rule-order",
        title: "Practice: every rule is right, the policy is wrong",
        explain:
          "Here is a real-shaped policy for a small company. Each of the three rules is correct in isolation. Read the traffic table underneath and find the one that is getting the wrong verdict, then work out which rule is catching it first.",
        why: "This is the mistake everybody makes once, and it is invisible in a diagram because the diagram shows the rules and not their order. The traffic table is what makes it visible, which is also why every firewall change should be tested against real traffic rather than read.",
        firewallExercise: {
          brief:
            "Web servers on 10.0.1.0/24 must be reachable on 443 by anyone. Staff on 10.0.2.0/24 must be able to reach the internet. SSH must be blocked from everywhere, including from staff. Reorder the rules until every row in the traffic table is right.",
          rules: [
            {
              id: "allow-staff-out",
              action: "allow",
              proto: "tcp",
              source: "10.0.2.0/24",
              dest: "any",
              port: "any",
            },
            {
              id: "allow-https",
              action: "allow",
              proto: "tcp",
              source: "any",
              dest: "10.0.1.0/24",
              port: 443,
            },
            {
              id: "deny-ssh-wan",
              action: "deny",
              proto: "tcp",
              source: "any",
              dest: "any",
              port: 22,
            },
          ],
          traffic: [
            {
              id: "t1",
              label: "A customer loading the website",
              proto: "tcp",
              source: "102.89.4.31",
              dest: "10.0.1.5",
              port: 443,
              expect: "allow",
            },
            {
              id: "t2",
              label: "An internet host trying SSH",
              proto: "tcp",
              source: "41.203.7.88",
              dest: "10.0.1.5",
              port: 22,
              expect: "deny",
            },
            {
              id: "t3",
              label: "Staff laptop browsing the web",
              proto: "tcp",
              source: "10.0.2.30",
              dest: "142.250.1.1",
              port: 443,
              expect: "allow",
            },
            {
              id: "t4",
              label: "Staff laptop opening SSH to a server",
              proto: "tcp",
              source: "10.0.2.30",
              dest: "10.0.1.5",
              port: 22,
              expect: "deny",
            },
          ],
          expect: true,
          successMessage:
            "The deny now sits above the broad staff allow, so it is reached first. Notice that nothing about the rules changed. The only edit was their order, and the policy went from wrong to right.",
        },
        mistake:
          "Testing a firewall change by checking the thing you were trying to fix. The bug is almost always in something else that the new rule now catches first.",
      },
      {
        id: "a-cs-w6-shadowed",
        title: "Rules that never fire",
        explain:
          "A rule shadowed by a broader one above it can never match anything. It sits in the policy looking meaningful, and it does nothing. The simulator in the last exercise labelled these, and real firewall management tools have the same feature for the same reason.",
        why: "Shadowed rules are dangerous in a specific way: somebody reads the policy, sees a rule that says SSH is blocked, and believes it. The policy documents an intention that the firewall is not carrying out.",
        table: {
          caption: "How to read a policy properly.",
          headers: ["Question", "What it tells you"],
          rows: [
            ["Does any rule never fire?", "Either it is shadowed, or it covers traffic you no longer have"],
            ["Is any allow broader than its comment says?", "The usual cause of a shadowed deny below it"],
            ["What does the last rule do?", "If it is not deny-all, find out why"],
            ["When was each rule added, and by whom?", "Rules outlive the projects that needed them"],
          ],
        },
      },
      {
        id: "a-cs-w6-egress",
        title: "Outbound filtering, the half nobody does",
        explain:
          "Most organisations filter carefully what comes in and allow everything out. That is backwards relative to how attacks actually finish. Malware that lands on a workstation has to call home, and stolen data has to leave.",
        why: "Egress filtering is where you catch the part of an attack that prevention missed. It is also unpopular, because it breaks things and the breakage is visible while the benefit is not.",
        decision: {
          scenario:
            "You propose blocking all outbound traffic except through the company proxy. The network team objects that it will break applications nobody has documented.",
          question: "What is the right way forward?",
          options: [
            {
              id: "a",
              text: "Drop the proposal. Breaking undocumented applications will cost more than the attack it prevents",
              whyWrong:
                "This accepts that nobody knows what leaves the network as a permanent condition. The undocumented applications are themselves a finding, and the argument would equally forbid ever fixing anything.",
            },
            {
              id: "b",
              text: "Run it in log-only mode first, build the list of what actually goes out, then enforce with that list allowed",
              why: "You get the inventory before you get the outage, and the log itself is valuable: it usually turns up two or three things nobody could account for. This is how every large egress project is actually run.",
            },
            {
              id: "c",
              text: "Enforce it immediately and fix what breaks, since that will find the undocumented applications fastest",
              whyWrong:
                "It will find them, at the cost of an outage, and it will attach that outage to the word security for the next two years. You can have the same inventory with no downtime by logging first.",
            },
            {
              id: "d",
              text: "Block only known-bad destinations instead",
              whyWrong:
                "That is a banned list rather than a guest list, and it only stops attackers using infrastructure somebody has already reported. New infrastructure costs an attacker almost nothing.",
            },
          ],
          correct: "b",
          aftermath:
            "The pattern generalises: log, then measure, then enforce. It is how you introduce almost any control into an environment where nobody knows what is currently happening.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 2
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "cs-l22-segmentation",
    moduleId: "cs-w6-networks",
    sectionId: SECTION_ID,
    order: 2,
    title: "Segmentation",
    subtitle: "Deciding how far an attacker gets",
    estimatedMinutes: 12,
    intro:
      "Segmentation does not prevent a breach. It decides what a breach costs, which is usually the more useful thing to control, because prevention fails and blast radius is something you can design.",

    atoms: [
      {
        id: "a-cs-w6-flat-network",
        title: "Why a flat network is fatal",
        explain:
          "On a flat network every device can reach every other device. The reception PC can reach the finance server. The guest WiFi can reach the backup system. The smart TV in the boardroom can reach the domain controller.",
        why: "It means a single compromised device is a compromised network. Almost every large ransomware incident you have read about had this as a contributing factor, because the initial foothold was some ordinary workstation and nothing stopped it going further.",
        analogy:
          "A building where every door opens with the same key, including the one you gave the cleaning contractor.",
      },
      {
        id: "a-cs-w6-segmentation",
        title: "Practice: separate the guest network",
        explain:
          "A company has put its guest WiFi on its own subnet, which is a good start, and then written the rules in an order that undoes it. Fix the policy so that guests can reach the internet and nothing else.",
        why: "Guest WiFi reaching internal servers is one of the most common real findings in a small business assessment, and it is almost never deliberate. It is a broad allow rule written first, exactly like this one.",
        firewallExercise: {
          brief:
            "Guests are on 192.168.50.0/24 and must reach the internet only. Servers are on 10.0.1.0/24 and must be reachable by staff on 10.0.2.0/24. No guest device should reach a server for any reason.",
          rules: [
            {
              id: "allow-guest-internet",
              action: "allow",
              proto: "any",
              source: "192.168.50.0/24",
              dest: "any",
              port: "any",
            },
            {
              id: "deny-guest-to-servers",
              action: "deny",
              proto: "any",
              source: "192.168.50.0/24",
              dest: "10.0.1.0/24",
              port: "any",
            },
            {
              id: "allow-staff-servers",
              action: "allow",
              proto: "tcp",
              source: "10.0.2.0/24",
              dest: "10.0.1.0/24",
              port: "any",
            },
          ],
          traffic: [
            {
              id: "t1",
              label: "Guest phone browsing the web",
              proto: "tcp",
              source: "192.168.50.22",
              dest: "142.250.1.1",
              port: 443,
              expect: "allow",
            },
            {
              id: "t2",
              label: "Guest laptop opening the file server",
              proto: "tcp",
              source: "192.168.50.31",
              dest: "10.0.1.9",
              port: 445,
              expect: "deny",
            },
            {
              id: "t3",
              label: "Staff laptop opening the file server",
              proto: "tcp",
              source: "10.0.2.15",
              dest: "10.0.1.9",
              port: 445,
              expect: "allow",
            },
            {
              id: "t4",
              label: "Guest laptop probing the database",
              proto: "tcp",
              source: "192.168.50.31",
              dest: "10.0.1.20",
              port: 3306,
              expect: "deny",
            },
          ],
          expect: true,
          successMessage:
            "The specific deny now sits above the broad guest allow. Separate subnets were never the control on their own. The rule order is the control.",
        },
        mistake:
          "Believing that putting guests on a different subnet segments them. A subnet is an address range. Without a rule stopping it, traffic routes between subnets exactly as happily as within one.",
      },
      {
        id: "a-cs-w6-dmz",
        title: "The DMZ",
        explain:
          "A DMZ is a segment for systems that have to be reachable from the internet, placed so that they cannot reach the internal network. The web server serves the public and can talk to nothing inside except the one database port it genuinely needs.",
        why: "It is segmentation applied to the machine most likely to be compromised. You assume the public-facing server will fall eventually, and you design so that when it does, the attacker has landed somewhere with nowhere to go.",
        table: {
          caption: "What each direction should be allowed to do.",
          headers: ["From", "To", "Allowed?"],
          rows: [
            ["Internet", "DMZ web server, 443", "Yes, that is the point"],
            ["Internet", "Internal network", "No"],
            ["DMZ web server", "Internal database, one port", "Yes, and only that port"],
            ["DMZ web server", "Anything else internal", "No"],
            ["Internal network", "DMZ, for administration", "Yes, from the admin subnet only"],
          ],
          note: "The row that matters is the fourth. A compromised web server that can only reach one database port on one host is a contained incident.",
        },
      },
      {
        id: "a-cs-w6-vlan",
        title: "VLANs, and what they are not",
        explain:
          "A VLAN separates networks logically on shared hardware, so one switch can carry several networks that cannot see each other. It is how segmentation is implemented in practice without buying a switch per segment.",
        why: "The limit is worth knowing. VLANs are a configuration on equipment an attacker may be able to reach, and misconfiguration between them is a recognised class of attack. They are a boundary enforced by configuration, not by physics.",
        mistake:
          "Treating a VLAN as equivalent to a physically separate network for something genuinely critical. For most purposes it is fine. For a payment system or industrial control, physical separation is still the stronger answer.",
      },
      {
        id: "a-cs-w6-lateral-movement",
        title: "Lateral movement",
        explain:
          "Having landed somewhere unimportant, an attacker moves sideways towards something that matters. Shared local administrator passwords, credentials cached in memory, file shares readable by everyone, and management protocols open between workstations are what make it easy.",
        why: "It is the phase where segmentation actually pays, and it is why workstation-to-workstation traffic should usually be blocked. There is rarely a business reason for one employee's laptop to open an administrative connection to another's.",
        decision: {
          scenario:
            "A finance workstation is compromised by a phishing attachment. The company has a flat network with the same local administrator password on every machine.",
          question: "What is the realistic next hour for the attacker?",
          options: [
            {
              id: "a",
              text: "They are stuck on that workstation until they find a new vulnerability",
              whyWrong:
                "They do not need one. A shared local administrator password is a working credential on every other machine, and the flat network means they can reach them all. No further vulnerability is required.",
            },
            {
              id: "b",
              text: "They pull the shared local administrator credential from that machine and use it to move to any other machine they can reach, which is all of them",
              why: "This is the actual, well-documented pattern. It requires no exploit, no zero day and very little skill, and it is why unique local administrator passwords and workstation isolation are such high-value controls.",
            },
            {
              id: "c",
              text: "They must first compromise the domain controller",
              whyWrong:
                "The domain controller is usually the goal rather than the route. They get there by moving through machines they can already reach with credentials they already have.",
            },
            {
              id: "d",
              text: "The antivirus on the other machines will block the connection",
              whyWrong:
                "Nothing malicious is being run. It is an administrator logging in with a valid password using ordinary management protocols, which is indistinguishable from legitimate IT work.",
            },
          ],
          correct: "b",
          aftermath:
            "Two controls stop this cheaply: a unique local administrator password on every machine, and firewall rules blocking workstation-to-workstation management traffic. Neither costs anything to buy.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 3
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "cs-l23-remote-and-wireless",
    moduleId: "cs-w6-networks",
    sectionId: SECTION_ID,
    order: 3,
    title: "Remote Access and Wireless",
    subtitle: "The two places the perimeter leaks",
    estimatedMinutes: 11,
    intro:
      "A carefully designed network has two doors that are open by design: the one people connect through from home, and the one that broadcasts itself into the car park.",

    atoms: [
      {
        id: "a-cs-w6-vpn",
        title: "What a VPN actually does",
        explain:
          "A VPN creates an encrypted tunnel from your device to a VPN server, and your traffic emerges from there. For a company, that means a remote laptop behaves as if it were plugged in at the office, including for the firewall rules.",
        why: "It moves the boundary rather than removing it. Traffic inside the tunnel is protected from whoever is on the café WiFi. Traffic after the tunnel exit is exactly as protected as it was before, which for HTTPS is already fine and for plain HTTP is still nothing.",
        table: {
          caption: "Who can see what, with and without a corporate VPN.",
          headers: ["Observer", "No VPN", "With VPN"],
          rows: [
            ["The café WiFi owner", "Sees destinations, and plaintext traffic", "Sees an encrypted tunnel to one address"],
            ["Your employer", "Sees your work traffic only", "Sees everything routed through the tunnel"],
            ["The website you visit", "Sees your home address", "Sees the company's address"],
          ],
        },
      },
      {
        id: "a-cs-w6-vpn-myths",
        title: "What a VPN does not do",
        explain:
          "Consumer VPN marketing claims protection from hackers, from viruses and from tracking. A VPN moves the point at which someone can observe your traffic. It does not make you anonymous, it does not stop malware, and it does not stop a website recognising you once you log in.",
        why: "As a security professional you will be asked about this constantly by friends and by management. Being able to say precisely what it does and does not do is more useful than either enthusiasm or dismissal.",
        decision: {
          scenario:
            "A colleague says they use a consumer VPN on public WiFi so that hackers cannot steal their banking password.",
          question: "What is the accurate response?",
          options: [
            {
              id: "a",
              text: "They are right, and everyone should do the same",
              whyWrong:
                "Their bank is already HTTPS, which protects the password from anyone on the WiFi with or without a VPN. Agreeing leaves them believing a control is doing work it is not, and relying on it in a situation where it does not apply.",
            },
            {
              id: "b",
              text: "The banking password was already protected by HTTPS. The VPN mainly hides which sites they visit from the WiFi owner, and moves that visibility to the VPN provider",
              why: "It is accurate about both what is protected and by what, and it names the trade rather than the slogan: the observer changes from the café to the VPN company, which is a choice about who you would rather trust.",
            },
            {
              id: "c",
              text: "VPNs are useless and they should stop paying for one",
              whyWrong:
                "Overcorrection. Hiding destination metadata from a network you do not control is a real benefit, and so is reaching a company network remotely. Dismissing it wholesale is as inaccurate as the advert.",
            },
            {
              id: "d",
              text: "They should use a VPN and also avoid logging into anything on public WiFi",
              whyWrong:
                "Advice with no reasoning attached, and the second half is unnecessary given HTTPS. It leaves them more anxious and no better informed about which control does what.",
            },
          ],
          correct: "b",
          aftermath:
            "The useful habit: for any control, say what it protects, from whom, and what it moves rather than removes. It works for VPNs, antivirus and everything else you will be asked about.",
        },
      },
      {
        id: "a-cs-w6-wifi",
        title: "WPA2, WPA3, and the shared-password problem",
        explain:
          "WPA2 with a shared password encrypts traffic, and everyone on the network has the same password. Anyone who has it and who captured your device connecting can usually decrypt your traffic. WPA3 fixes this specific problem, so each device gets its own session protection even on a shared password.",
        why: "It changes what \"the WiFi has a password\" means. On WPA2-Personal it means outsiders cannot join. It does not mean the other people in the building cannot read your traffic, which is why the office WiFi being protected is not a reason to run plain HTTP internally.",
        table: {
          caption: "What each one actually protects against.",
          headers: ["", "Open WiFi", "WPA2 shared password", "WPA3", "WPA2/3 Enterprise"],
          rows: [
            ["Outsiders can join", "Yes", "No", "No", "No"],
            ["Others on the network can read your traffic", "Yes", "Often", "No", "No"],
            ["Each user has their own credential", "No", "No", "No", "Yes"],
            ["One person leaving means changing everyone's password", "n/a", "Yes", "Yes", "No"],
          ],
          note: "That last row is why enterprise authentication is worth the setup in any organisation with staff turnover.",
        },
      },
      {
        id: "a-cs-w6-evil-twin",
        title: "The evil twin",
        explain:
          "An attacker broadcasts a network with the same name as one your device trusts. Devices connect to the strongest signal with a remembered name, so a laptop that has ever joined a network called Airport-Free-WiFi will join the attacker's version of it, automatically, without being asked.",
        why: "It is why the advice to turn off automatic joining for open networks is worth following, and why a captive portal asking you to sign in again should always be treated with suspicion. TLS still protects the traffic, which is exactly why the attacker's next move is a certificate warning they hope you will click through.",
        mistake:
          "Trusting a network because the name is right. The name is the one part of a wireless network that anybody can copy in about four seconds.",
      },
      {
        id: "a-cs-w6-nac",
        title: "Network access control",
        explain:
          "Network access control decides whether a device may join the network at all, and what it may reach once it has. It can check whether the device is known, whether it is patched, whether it is running the required software, and place it on a restricted segment if not.",
        why: "It closes the gap that firewalls do not: the contractor's laptop plugged into a meeting room socket, the personal phone on the staff WiFi, the device that has been off for four months and is missing a year of patches.",
        practice: {
          prompt:
            "Why is a device that has been switched off for four months a problem the moment it reconnects?",
          answer:
            "It is missing every patch issued since it was last on, so it is vulnerable to everything found in that period, and it rejoins a network where it is trusted. Network access control handles it by putting it in a quarantine segment until it has updated, which is a good example of a control that is about sequencing rather than blocking.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 4
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "cs-l24-detection-zero-trust",
    moduleId: "cs-w6-networks",
    sectionId: SECTION_ID,
    order: 4,
    title: "Detection, and Zero Trust Without the Marketing",
    subtitle: "Seeing it happen, and assuming it will",
    estimatedMinutes: 12,
    intro:
      "Two ideas that close the month. Intrusion detection is how you find out prevention failed. Zero trust is what you design when you accept that it will.",

    atoms: [
      {
        id: "a-cs-w6-ids-ips",
        title: "Detection and prevention",
        explain:
          "An intrusion detection system watches traffic and raises an alert. An intrusion prevention system sits in the path and blocks. The difference is not the analysis, which is identical. It is whether a false positive produces a wasted hour or an outage.",
        why: "That is the real decision, and it is why plenty of mature organisations run detection in front of business-critical traffic and prevention elsewhere. A blocking rule that is wrong at 09:00 on a Monday is an incident of its own.",
        table: {
          caption: "The same rule, two deployments.",
          headers: ["", "Detection", "Prevention"],
          rows: [
            ["Sits", "Beside the traffic, on a copy", "In the path"],
            ["On a true positive", "An analyst is alerted", "The attack is stopped"],
            ["On a false positive", "An analyst wastes time", "Legitimate traffic is blocked"],
            ["Can be tuned safely", "Yes", "Carefully, in log-only mode first"],
          ],
        },
      },
      {
        id: "a-cs-w6-ids-evidence",
        title: "Practice: read what the alert was about",
        explain:
          "The IDS fired at 14:02 with \"possible port scan from guest network\". Here is the capture around that moment. Before you escalate anything, find the evidence: the first packet where a guest device attempted a connection to a server.",
        why: "An alert is a claim. The first thing an analyst does is verify it against the underlying data, because alerts are frequently right about something and wrong about what. You will do this formally in Week 11; here it is just reading a capture.",
        captureExercise: {
          task:
            "Filter this capture to connection attempts, then click the first packet where a device on the guest network 192.168.50.0/24 tried to open a connection to a server on 10.0.1.0/24.",
          packets: SCAN_CAPTURE,
          expect: {
            maxRows: 6,
            packet: 3,
            mustContain: [3],
            whyWrong:
              "Check two things on each row: the Source must be a guest address starting 192.168.50, and it must be the machine reaching out rather than a reply. The first such packet in time order is the one to select.",
            success:
              "Packet 3. Note the three attempts in the same millisecond to ports 22, 23 and 3306, each answered with a reset. Three different services in under a millisecond is not a person, and it is not an application. That is a scanner.",
          },
          hint: "Filter on the flag that marks a connection attempt. It matches the replies too, so read the Source column carefully.",
          note: "Packets 1 and 2 are ordinary staff browsing and should not be confused with the scan. Learning to leave normal traffic alone is as important as finding the abnormal kind.",
        },
      },
      {
        id: "a-cs-w6-signature-anomaly",
        title: "Signature and anomaly",
        explain:
          "Signature detection looks for patterns known to be bad, which is precise and blind to anything new. Anomaly detection looks for behaviour unlike the established baseline, which can catch novel attacks and produces a great deal of noise.",
        why: "Every real deployment uses both, and the interesting question is always about the false positive rate. A detection that is right 99% of the time, on a network with a million events a day, produces ten thousand wrong alerts. Nobody looks at the ten-thousand-and-first.",
        mistake:
          "Judging a detection by whether it caught the attack. The measure that matters is whether it caught the attack AND stayed quiet enough that somebody was still reading it. You will grade rules on exactly that in Week 11.",
      },
      {
        id: "a-cs-w6-ids-placement",
        title: "Where to put it, and the encryption problem",
        explain:
          "A network sensor can only analyse what it can read, and most traffic is now encrypted. So either you inspect at a point where traffic is decrypted, which means the endpoint or a proxy that terminates TLS, or you analyse metadata rather than content.",
        why: "It explains the shift in the industry towards endpoint detection. The network sensor that could read everything in 2010 can read almost nothing today, and metadata analysis, which is what you used in Week 4 to spot the sixty-second beacon, is what remains.",
        table: {
          caption: "Three places to watch, and what each can see.",
          headers: ["Sensor location", "Sees", "Blind to"],
          rows: [
            ["Network tap", "Who talks to whom, when, how much", "Encrypted contents"],
            ["TLS-terminating proxy", "Full content of proxied traffic", "Anything not routed through it"],
            ["Endpoint agent", "Processes, files, commands, before encryption", "Devices with no agent"],
          ],
        },
      },
      {
        id: "a-cs-w6-zero-trust",
        title: "Zero trust, said plainly",
        explain:
          "Stop treating network position as evidence of anything. Being inside the office network does not make a device trusted. Every request is authenticated, authorised and, where it matters, logged, regardless of where it came from.",
        why: "It is a response to two facts. Remote work removed the inside, and every serious breach shows that inside is exactly where the attacker ends up. Once you accept that, a perimeter model is protecting a boundary that no longer marks anything.",
        decision: {
          scenario:
            "A vendor pitches a zero trust product and says it will let you remove your firewalls and VPN, because zero trust means the network no longer matters.",
          question: "What is the accurate assessment?",
          options: [
            {
              id: "a",
              text: "Correct. Zero trust replaces perimeter controls, so firewalls and VPNs become unnecessary",
              whyWrong:
                "Zero trust changes what you rely on for trust decisions. It does not make segmentation or egress filtering worthless, and an organisation that removed both would have handed lateral movement back to the attacker while buying a product.",
            },
            {
              id: "b",
              text: "Zero trust is an architecture, not a product. It removes network position as a reason to trust a request. Segmentation and egress filtering still limit blast radius and are still worth having",
              why: "It separates the principle from the purchase, and keeps the controls that do a different job. Defence in depth does not stop applying because a new model arrived.",
            },
            {
              id: "c",
              text: "Zero trust is marketing and should be ignored",
              whyWrong:
                "The term is oversold and the underlying principle is sound and was arrived at by observing real breaches. Dismissing it wholesale means keeping a perimeter model whose perimeter no longer exists.",
            },
            {
              id: "d",
              text: "It is only relevant to organisations that are fully cloud based",
              whyWrong:
                "It applies anywhere people work remotely or an internal network contains devices you do not fully control, which is almost everywhere. Cloud made it urgent rather than exclusive.",
            },
          ],
          correct: "b",
          aftermath:
            "Month 2 ends here. You have hardened a host, designed a policy and read an alert back to its evidence. Month 3 turns that round: you will run the attack, and then detect it.",
        },
      },
    ],

    task: {
      title: "This week's lab",
      intro: "Design a defended network, then prove your design does what you say.",
      prompts: [
        "Draw a segmented network for a small business with guest WiFi, staff devices and servers. Mark every allowed flow between segments with a direction and a port.",
        "Write the firewall policy that implements your diagram, in order, ending with an explicit deny-all.",
        "For each rule, write one sentence saying what it allows and why the business needs it. Any rule you cannot justify comes out.",
        "Implement the policy in ufw or pfSense in your lab and test it from the other VM: confirm each allowed flow works and each blocked one does not.",
        "Install Suricata or Snort with a community ruleset. Run a port scan from your second VM against the first and capture the alert it generates.",
        "Write a short IDS write-up: the alert, the packets that caused it, whether it was a true positive, and what you would tune.",
      ],
      closing:
        "The design diagram with its written justification is the deliverable that goes in your portfolio. The IDS write-up is your first piece of blue-team work, and Week 11 picks it up from there.",
    },

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
