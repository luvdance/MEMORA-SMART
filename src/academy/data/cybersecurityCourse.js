/**
 * CYBERSECURITY — BEGINNER TO PRO
 *
 * Authored from the Memora Smart Technologies curriculum document
 * "Cybersecurity Mastery Program · A Harvard CS50–Inspired Curriculum",
 * sixteen weeks across four months.
 *
 * Course content is DATA, never markup. This object is the single source of
 * truth for every Academy surface that describes the course. It mirrors the
 * shape of dataAnalysisCourse.js exactly, which is why the catalog, the
 * curriculum sidebar, the progress engine and the stats band all render it
 * without a single change.
 *
 * ── ON THE HARVARD FRAMING ───────────────────────────────────────────────
 * The five-pillar structure and the risk-based philosophy come from Harvard's
 * publicly described CS50 Cybersecurity course: securing accounts, securing
 * data, securing systems, securing software, preserving privacy. The extra
 * weeks, the labs, the tooling and the career track are OUR extensions.
 *
 * This course is inspired by that structure. It is not affiliated with,
 * endorsed by, or an offering of Harvard University, and no surface in this
 * platform may imply otherwise. `harvardAnchor` on each module records which
 * pillar the week maps onto, and `inspiration` below is the disclaimer the UI
 * renders. Both exist so the claim stays accurate as the page changes hands.
 * ─────────────────────────────────────────────────────────────────────────
 *
 * ── ON THE OFFENSIVE CONTENT ─────────────────────────────────────────────
 * Month 3 teaches penetration testing. Everything offensive in this course is
 * framed the way it is framed in the profession: against targets the learner
 * owns or has written authorisation to test, inside an isolated lab. Week 9
 * teaches the law and the rules of engagement BEFORE any scanning technique,
 * deliberately and in that order. No lesson in this course carries a working
 * exploit, credential-stuffing tooling, or an evasion technique.
 * ─────────────────────────────────────────────────────────────────────────
 */

export const CYBERSECURITY_COURSE = {
  id: "cybersecurity",
  slug: "cybersecurity",
  title: "Cybersecurity",
  subtitle: "Beginner to Pro",
  tagline:
    "Understand how attacks actually happen, then prove you can stop them — sixteen weeks, hands-on throughout.",
  description:
    "A structured four-month programme that takes you from someone who has never thought about security to a practitioner who can harden a system, run an authorised penetration test, detect an intrusion and write the report that follows it. Built on the five pillars of Harvard's CS50 Cybersecurity and extended into a lab-driven professional curriculum. No prior experience and no programming background required.",

  status: "live", // "live" | "coming-soon" | "draft"
  level: "Beginner → Pro",
  durationMonths: 4,
  hoursPerWeek: "8–12",
  language: "English",
  instructor: {
    name: "Memora Smart Academy",
    role: "Industry-led curriculum",
  },

  /**
   * The sourcing note, rendered wherever the Harvard framing is mentioned.
   * Kept in the data rather than in a component so it cannot be dropped by a
   * redesign.
   */
  inspiration: {
    source: "Harvard CS50's Introduction to Cybersecurity",
    pillars: [
      "Securing accounts",
      "Securing data",
      "Securing systems",
      "Securing software",
      "Preserving privacy",
    ],
    disclaimer:
      "The five-pillar structure and the risk-based philosophy come from Harvard's publicly described CS50 Cybersecurity course. The additional weeks, labs, tooling and career track here are Memora Smart Academy extensions. This programme is inspired by, but not affiliated with or an official offering of, Harvard University.",
  },

  access: {
    accessType: "free",
    price: 0,
    currency: "NGN",
    enrollmentStatus: "open",
  },

  tools: [
    {
      id: "linux-lab",
      name: "Linux & the lab",
      short: "Linux",
      blurb: "A virtual machine of your own, hardened by your own hand.",
      icon: "fab fa-linux",
      accent: "#3b4252",
    },
    {
      id: "network-tools",
      name: "Wireshark & nmap",
      short: "Networking",
      blurb: "Read real traffic and map what a network is actually exposing.",
      icon: "fas fa-network-wired",
      accent: "#1a7f8c",
    },
    {
      id: "web-security",
      name: "Burp Suite & OWASP",
      short: "Web security",
      blurb: "The OWASP Top 10, reproduced safely and then fixed.",
      icon: "fas fa-bug",
      accent: "#c2410c",
    },
    {
      id: "blue-team",
      name: "SIEM & ATT&CK",
      short: "Blue team",
      blurb: "Write detections, triage alerts, and run an incident to its end.",
      icon: "fas fa-shield-halved",
      accent: "#1d4ed8",
    },
  ],

  outcomes: [
    "Reason about security as a trade-off between risk and cost, not a product you buy",
    "Secure accounts and data properly, and explain why each control is there",
    "Harden a Linux system and design a segmented, defended network",
    "Find and fix the OWASP Top 10 in a real application",
    "Run an authorised penetration test and write the report a client would pay for",
    "Detect an intrusion in a SIEM and work the incident through to a post-incident report",
    "Assess privacy and compliance risk against NIST CSF, ISO 27001 and GDPR",
    "Ship a portfolio-grade capstone and walk into an interview able to defend it",
  ],

  audience: [
    "Complete beginners who have never worked in IT",
    "Graduates and job seekers targeting a first security role",
    "Developers and sysadmins who want to stop shipping vulnerabilities",
    "Career switchers moving into security from any background",
  ],

  requirements: [
    "A laptop or desktop with at least 8GB of RAM and 60GB free (a virtual machine needs room)",
    "A stable internet connection",
    "Permission to install virtualisation software on the machine you use",
    "No prior programming, networking or security knowledge",
  ],

  /**
   * MONTHS → MODULES. One module per week, sixteen in all.
   * `atoms` is the number of individual concepts the week breaks into. Every
   * atom is taught, practised and assessed on its own.
   */
  months: [
    {
      month: 1,
      title: "Foundations",
      focus: "Beginner",
      summary:
        "Build the vocabulary and the instincts of a security thinker. Maps onto the first two Harvard pillars, securing accounts and securing data, and adds the networking grounding every practitioner needs.",
      modules: [
        {
          id: "cs-w1-fundamentals",
          order: 1,
          title: "Week 1 · Fundamentals & the Threat Landscape",
          summary:
            "What security actually is, who is attacking and why, and the lab you will spend sixteen weeks in.",
          atoms: 18,
          harvardAnchor:
            "Frames the whole course as CS50 does: security as a relative, risk-based discipline rather than a product you buy.",
          topics: [
            "Security as risk, reward, cost and benefit",
            "The CIA triad",
            "Attack surface, threats, vulnerabilities, risk",
            "Least privilege and defence in depth",
            "Threat actors and their motivations",
            "Malware, phishing, social engineering, denial of service",
            "Standing up your lab virtual machine",
          ],
        },
        {
          id: "cs-w2-accounts",
          order: 2,
          title: "Week 2 · Securing Accounts",
          summary:
            "How passwords are really broken, why length beats complexity, and what multi-factor does and does not stop.",
          atoms: 20,
          harvardAnchor:
            "CS50 Cybersecurity, 'Securing Accounts'. The pillar on balancing security against convenience.",
          topics: [
            "Authentication versus authorisation",
            "Dictionary, brute force and credential stuffing",
            "Why length beats complexity",
            "NIST password guidance and passphrases",
            "Password managers",
            "Multi-factor, one-time codes and passkeys",
            "Phishing, pretexting and social engineering",
          ],
        },
        {
          id: "cs-w3-data",
          order: 3,
          title: "Week 3 · Securing Data — Cryptography & Hashing",
          summary:
            "Hashing versus encryption, salting, public keys and what the padlock in your browser is actually promising.",
          atoms: 20,
          harvardAnchor:
            "CS50 Cybersecurity, 'Securing Data'. Cryptography as the mechanism behind everyday privacy.",
          topics: [
            "Hashing and why it is not encryption",
            "Rainbow tables and salting",
            "Symmetric cryptography and key management",
            "Public-key cryptography and digital signatures",
            "HTTPS, TLS and certificates",
            "Full-disk encryption and secure deletion",
            "Ransomware, and why backups are a security control",
          ],
        },
        {
          id: "cs-w4-networking",
          order: 4,
          title: "Week 4 · Networking Essentials for Security",
          summary:
            "Follow one web request across the internet, then capture it yourself and read it packet by packet.",
          atoms: 20,
          harvardAnchor:
            "Extends the CS50 model of the internet — routers, TCP/IP, DNS, HTTP — into a security-focused networking foundation.",
          topics: [
            "The TCP/IP stack and what each layer adds",
            "IP addresses, subnets and ports",
            "DNS, and why it is a security problem",
            "What happens when you type a URL",
            "Sniffing, spoofing and machine-in-the-middle",
            "Reading a packet capture",
            "Port scanning and what an open port tells an attacker",
          ],
        },
      ],
    },
    {
      month: 2,
      title: "Systems & Network Security",
      focus: "Intermediate",
      summary:
        "Turn understanding into defence. Harden real systems, design a defended network, and read code the way an attacker reads it. Maps onto Harvard's securing systems and securing software pillars.",
      modules: [
        {
          id: "cs-w5-hardening",
          order: 5,
          title: "Week 5 · Operating System Security & Hardening",
          summary:
            "Least privilege stops being advice and becomes nine permission bits you set yourself.",
          atoms: 20,
          harvardAnchor: "CS50 Cybersecurity, 'Securing Systems', at the host level.",
          topics: [
            "Users, groups and the root account",
            "Linux file permissions and the mode column",
            "sudo and privilege escalation",
            "Windows accounts, UAC and Group Policy",
            "Patching and service minimisation",
            "Host firewalls and endpoint protection",
            "Reading system logs",
          ],
        },
        {
          id: "cs-w6-networks",
          order: 6,
          title: "Week 6 · Securing Systems & Networks",
          summary:
            "Segmentation, firewall rules that fire in the right order, VPNs, Wi-Fi and the beginnings of zero trust.",
          atoms: 20,
          harvardAnchor:
            "Extends 'Securing Systems' from the host to the network perimeter and beyond.",
          topics: [
            "Firewalls and why rule order decides everything",
            "Segmentation, VLANs and the DMZ",
            "VPNs, tunnelling and remote access",
            "Wi-Fi security: WPA2, WPA3 and the attacks that remain",
            "Intrusion detection and prevention",
            "Network access control",
            "Zero trust, without the marketing",
          ],
        },
        {
          id: "cs-w7-software",
          order: 7,
          title: "Week 7 · Securing Software & Secure Coding",
          summary:
            "Where vulnerabilities actually come from, and how to read code with an adversarial mind.",
          atoms: 20,
          harvardAnchor:
            "CS50 Cybersecurity, 'Securing Software'. Writing and evaluating code that resists attack.",
          topics: [
            "Untrusted input, the root of almost everything",
            "Input validation and output encoding",
            "Buffer overflows and memory safety, conceptually",
            "Injection and insecure defaults",
            "Dependencies and supply-chain risk",
            "The secure development lifecycle",
            "Reviewing code adversarially",
          ],
        },
        {
          id: "cs-w8-web",
          order: 8,
          title: "Week 8 · Web Application Security & the OWASP Top 10",
          summary:
            "The most attacked surface in the world, category by category, with the fix for each one.",
          atoms: 22,
          harvardAnchor:
            "Applies the 'Securing Software' pillar to the web, the most common attack surface there is.",
          topics: [
            "Sessions, cookies and how the web holds state",
            "Broken access control",
            "Injection and SQL injection",
            "Cross-site scripting",
            "Cross-site request forgery",
            "Authentication failures",
            "Security misconfiguration and data exposure",
            "Using an intercepting proxy responsibly",
          ],
        },
      ],
    },
    {
      month: 3,
      title: "Offensive & Defensive Security",
      focus: "Advanced",
      summary:
        "Both sides of the fight. Authorised offensive testing first, then the blue-team disciplines of detection, response and forensics. Every offensive technique here is taught for targets you own or are authorised to test.",
      modules: [
        {
          id: "cs-w9-ethical-hacking",
          order: 9,
          title: "Week 9 · Ethical Hacking & Penetration Testing",
          summary:
            "The law and the rules of engagement first, then reconnaissance and enumeration — in that order, deliberately.",
          atoms: 20,
          harvardAnchor:
            "Builds on the risk-based mindset: to defend a system you have to understand how an adversary reasons about it.",
          topics: [
            "Law, ethics and why authorisation is the whole job",
            "Scope and rules of engagement",
            "Penetration-testing methodology",
            "Passive reconnaissance and OSINT",
            "Active scanning and enumeration",
            "Writing the report",
            "Responsible disclosure",
          ],
        },
        {
          id: "cs-w10-vulnerabilities",
          order: 10,
          title: "Week 10 · Vulnerability Assessment & Prioritisation",
          summary:
            "Run the scanner, then do the part the scanner cannot: decide what actually matters here.",
          atoms: 20,
          harvardAnchor:
            "Turns the securing-systems and securing-software pillars into measurable, prioritised risk reduction.",
          topics: [
            "Scanning versus penetration testing",
            "Reading a CVE and a CVSS vector",
            "Why the scanner's order is the wrong order",
            "Validating findings and killing false positives",
            "Exploitation, conceptually and inside the lab",
            "Writing a remediation plan a system owner can follow",
          ],
        },
        {
          id: "cs-w11-soc",
          order: 11,
          title: "Week 11 · Defensive Security — SOC, SIEM & Detection",
          summary:
            "Detect the activity you just practised. Write the rule, live with its false positives, map it to ATT&CK.",
          atoms: 20,
          harvardAnchor:
            "The defensive counterpart to the offensive weeks: detecting the activity learners have just practised.",
          topics: [
            "How a SOC actually works",
            "Log sources, aggregation and normalisation",
            "Writing a detection rule",
            "The false positive trade-off",
            "Alert triage and the tiers",
            "Threat intelligence",
            "MITRE ATT&CK",
          ],
        },
        {
          id: "cs-w12-incident-response",
          order: 12,
          title: "Week 12 · Incident Response & Digital Forensics",
          summary:
            "What to do when prevention has already failed, from the first alert to the post-incident report.",
          atoms: 20,
          harvardAnchor: "Completes the defensive arc: what to do when prevention fails.",
          topics: [
            "The incident response lifecycle",
            "Containment, and the mistakes that destroy evidence",
            "Chain of custody",
            "Disk and file-system forensics",
            "Memory and log investigation",
            "Building the timeline",
            "The post-incident report and the lessons learned",
          ],
        },
      ],
    },
    {
      month: 4,
      title: "Specialisation, Governance & Career",
      focus: "Pro",
      summary:
        "Round a technical learner into a professional: privacy and governance, cloud and emerging threats, a portfolio-grade capstone, and the work of actually getting hired. Closes with Harvard's fifth pillar, preserving privacy.",
      modules: [
        {
          id: "cs-w13-privacy-grc",
          order: 13,
          title: "Week 13 · Privacy, Governance, Risk & Compliance",
          summary:
            "Tracking, profiling and metadata, then the frameworks a business is actually judged against.",
          atoms: 20,
          harvardAnchor:
            "CS50 Cybersecurity, 'Preserving Privacy'. The fifth pillar, extended into organisational governance.",
          topics: [
            "Cookies, fingerprinting and tracking",
            "Metadata, and why it is often worse than content",
            "Privacy-enhancing technology and data minimisation",
            "Governance, risk and compliance",
            "NIST CSF and ISO 27001",
            "GDPR, NDPA and HIPAA in outline",
            "Running a risk assessment and keeping a risk register",
          ],
        },
        {
          id: "cs-w14-cloud",
          order: 14,
          title: "Week 14 · Cloud Security & Emerging Threats",
          summary:
            "Shared responsibility, the misconfigurations that cause most cloud breaches, and the security of IoT and AI systems.",
          atoms: 20,
          harvardAnchor:
            "Applies the course's 'evaluate tomorrow's threats' ethos to today's fastest-moving domains.",
          topics: [
            "The shared responsibility model",
            "Cloud identity and access management",
            "Public buckets and over-permissive roles",
            "Containers and infrastructure as code",
            "IoT security",
            "AI and machine learning security",
            "Prompt injection and data poisoning",
          ],
        },
        {
          id: "cs-w15-capstone",
          order: 15,
          type: "capstone",
          title: "Week 15 · Capstone — Build, Break & Defend",
          summary:
            "One realistic organisation. Harden it, test it, detect the attack, and write it up for two audiences.",
          atoms: 14,
          harvardAnchor:
            "Mirrors the CS50 final project: a self-directed piece of work that proves mastery.",
          topics: [
            "Scoping a capstone you can finish",
            "The three tracks: harden, test, or detect",
            "Executing against an authorised environment",
            "Evidence an employer can check",
            "The technical report",
            "The executive summary",
            "Defending your findings",
          ],
        },
        {
          id: "cs-w16-career",
          order: 16,
          title: "Week 16 · Career Launch",
          summary:
            "Certifications worth having, a portfolio that shows the work, and interviews you can actually pass.",
          atoms: 16,
          harvardAnchor:
            "Translates learning into a career: the practical bridge beyond the coursework.",
          topics: [
            "The certification roadmap, entry to professional",
            "Which certification is worth it, and when",
            "Building a security portfolio",
            "A résumé that survives the filter",
            "Technical and scenario interviews",
            "Home labs and continued practice",
            "Ethics, community and staying current",
          ],
        },
      ],
    },
  ],

  capstone: {
    title: "Build, Break & Defend",
    summary:
      "A small organisation with a real network, a real application and a real set of bad habits. You pick a track: harden it end to end, run an authorised penetration test of it, or build the detection pipeline that catches an attack on it. Whichever you pick, you deliver the evidence and explain it to both an engineer and a director.",
    deliverables: [
      "A scoped brief with written authorisation and rules of engagement",
      "The technical work: hardening evidence, test findings, or detection rules",
      "A findings report with severity, evidence and remediation",
      "An executive summary a non-technical director can act on",
      "A short recorded walkthrough of what you did and what you found",
    ],
  },

  certificate: {
    issuer: "Memora Smart Technologies",
    name: "Cybersecurity — Beginner to Pro",
    covers: "Security foundations • Systems & networks • Offensive & defensive • GRC",
    idFormat: "MST-CERT-2026-000001",
    requirements: [
      "Complete every required lesson",
      "Pass every required assessment at 70% or above",
      "Pass all four monthly checkpoints",
      "Complete the capstone",
    ],
  },

  /**
   * The gates between months. The curriculum document is explicit that a
   * learner advances only after passing the checkpoint, so it is recorded as
   * data rather than left as prose in a lesson.
   */
  checkpoints: [
    {
      afterMonth: 1,
      title: "Month 1 checkpoint",
      format: "A graded knowledge check across foundations, accounts, cryptography and networking.",
      passMark: 70,
    },
    {
      afterMonth: 2,
      title: "Month 2 checkpoint",
      format: "A practical check: harden a system and produce a web application findings report.",
      passMark: 70,
    },
    {
      afterMonth: 3,
      title: "Month 3 checkpoint",
      format: "Red versus blue: test an authorised target, then detect and respond to an attack on yours.",
      passMark: 70,
    },
    {
      afterMonth: 4,
      title: "Final",
      format: "The capstone package, assessed against the deliverables above.",
      passMark: 70,
    },
  ],
};

export default CYBERSECURITY_COURSE;
