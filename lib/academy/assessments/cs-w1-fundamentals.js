/**
 * ASSESSMENTS · CYBERSECURITY · WEEK 1 · FUNDAMENTALS
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. This file lives in lib/ and is imported exclusively by
 * api/academy/*. It must NEVER be imported from anything under src/, because
 * Vite would bundle the correct answers into the browser and every score in
 * the platform, and therefore every certificate, would be meaningless.
 * `npm run validate:content` fails the build if that ever happens.
 * ═════════════════════════════════════════════════════════════════════════
 *
 * QUESTION SHAPE
 *   id          stable key. Attempts reference this
 *   type        "mcq" | "truefalse" | "scenario"
 *   prompt      the question as the learner reads it
 *   options     [{ id, text }]. Order is shuffled per attempt at serve time
 *   correct     option id
 *   explanation why the correct answer is correct
 *   whyWrong    per option: why THAT specific answer was wrong
 *   atomId      the concept under test. Drives the "review this" feedback
 *   difficulty  1 recall · 2 understanding · 3 application
 *
 * `whyWrong` is the reason this platform exists. Telling a learner
 * "incorrect" teaches nothing. Telling them why their specific reasoning
 * failed, and which atom to reopen, closes the loop.
 */

export const ASSESSMENTS = {
  /* ═══════════════════════════════════════════════════════════════════ */
  "cs-l0-what-cybersecurity-is": {
    lessonId: "cs-l0-what-cybersecurity-is",
    passMark: 70,
    questions: [
      {
        id: "csq0-1",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cs-the-law",
        prompt:
          "You run a port scan against a company you do not work for. Nothing is damaged, you take nothing, and you tell them what you found. Under laws like Nigeria's Cybercrimes Act 2015 or the UK Computer Misuse Act, what is your position?",
        options: [
          { id: "a", text: "Safe, because nothing was damaged and nothing was taken" },
          {
            id: "b",
            text: "An offence was likely committed, because the system responded to unauthorised probing",
          },
          { id: "c", text: "Safe, because reporting the finding shows you acted in good faith" },
          { id: "d", text: "Safe unless the company can prove you intended to cause harm" },
        ],
        correct: "b",
        explanation:
          "Access without authorisation is the offence in itself. A scan the system answers has accessed it, and the offence is complete at that point.",
        whyWrong: {
          a: "Damage and theft affect the penalty, not whether an offence occurred. The basic offence is the unauthorised access.",
          c: "Reporting is mitigating at best. It does not undo the access, and researchers acting in good faith have been prosecuted for exactly this.",
          d: "Intent to cause harm is generally not required for the basic offence. \"I was only looking\" is not a defence.",
        },
      },
      {
        id: "csq0-2",
        type: "mcq",
        difficulty: 3,
        atomId: "a-cs-authorisation",
        prompt:
          "Which of these gives you lawful authorisation to test a system?",
        options: [
          { id: "a", text: "You work at the company, so you already have access to the network" },
          { id: "b", text: "A developer who works there asked you to look and will tell their manager afterwards" },
          {
            id: "c",
            text: "A deliberately vulnerable training application, used within the terms its host publishes",
          },
          { id: "d", text: "The system is visibly insecure, which shows the owner is not protecting it" },
        ],
        correct: "c",
        explanation:
          "Targets built to be attacked carry their own authorisation, and the host's terms define what is permitted. That, your own isolated lab, and written permission from somebody with authority are the three lawful places to practise.",
        whyWrong: {
          a: "Access for your job is not authorisation to test. Employment gives you permission to use a system in a particular way, and security testing is not that way.",
          b: "A developer almost certainly cannot authorise testing, and a verbal request leaves you with no evidence you were permitted to be there.",
          d: "An unlocked door is not an invitation. How poorly a system is protected has no bearing on whether access to it was authorised.",
        },
      },
      {
        id: "csq0-3",
        type: "scenario",
        difficulty: 3,
        atomId: "a-cs-disclosure",
        prompt:
          "While using your bank's app normally, you notice a response that appears to contain another customer's account details. What is the correct first action?",
        options: [
          { id: "a", text: "Repeat the request a few times to establish whether it is reproducible" },
          {
            id: "b",
            text: "Stop, record the single instance you already observed, and report it to the bank's security contact",
          },
          { id: "c", text: "Save a copy of the data as evidence, so the bank cannot deny it happened" },
          { id: "d", text: "Post the details publicly so other customers can protect themselves" },
        ],
        correct: "b",
        explanation:
          "One observed instance is a complete report. The bank can reproduce it on their own system immediately, so further probing adds nothing for you and adds legal exposure.",
        whyWrong: {
          a: "Each repeat is a further unauthorised access, and gathering more proof than the report needed is the most common way a good-faith finding becomes a prosecution.",
          c: "Keeping another customer's data turns a reportable observation into possession of data you have no right to hold. Describe what you saw instead.",
          d: "Publishing exposes the affected customer and hands the technique to anyone reading, before any fix exists. Escalation is available later if the bank does nothing.",
        },
      },
      {
        id: "csq0-4",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cs-what-you-defend",
        prompt:
          "Ransomware encrypts a clinic's file server. Which statement best describes what was actually lost?",
        options: [
          { id: "a", text: "A server, which can be rebuilt from hardware the clinic already owns" },
          {
            id: "b",
            text: "The clinic's ability to treat patients safely, because nobody could confirm prescriptions",
          },
          { id: "c", text: "Nothing of consequence, provided a backup exists somewhere" },
          { id: "d", text: "Only the confidentiality of the records, since encryption hides them" },
        ],
        correct: "b",
        explanation:
          "The technical target and the real damage are different things. You are defending what the organisation cannot operate without, and that is what a report to management has to describe.",
        whyWrong: {
          a: "Replacing the hardware is the cheap part. The loss is what the organisation could not do while the data was unavailable.",
          c: "A backup shortens the outage. It does not remove the hours during which patients were turned away.",
          d: "Ransomware primarily attacks availability. Confidentiality may also be affected if data was copied, but the immediate loss is that nobody can reach the records.",
        },
      },
      {
        id: "csq0-5",
        type: "truefalse",
        difficulty: 2,
        atomId: "a-cs-ethics",
        prompt:
          "A file share is misconfigured so every employee can read a colleague's private documents. Because the permissions allow it, reading them is acceptable professional conduct.",
        options: [
          { id: "a", text: "True" },
          { id: "b", text: "False" },
        ],
        correct: "b",
        explanation:
          "Law sets the floor and the profession expects more. Access being technically possible is not a reason to use it, and the finding to report is the misconfiguration itself, not what it exposed.",
        whyWrong: {
          a: "This is the \"not illegal, therefore fine\" reading. Almost every serious reputational failure in this field was technically permitted at the moment it happened.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "cs-l1-security-is-a-tradeoff": {
    lessonId: "cs-l1-security-is-a-tradeoff",
    passMark: 70,
    questions: [
      {
        id: "csq1-1",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cs-tradeoff",
        prompt:
          "A manager asks you, \"is our system secure?\" What is wrong with the question?",
        options: [
          { id: "a", text: "Nothing, it is the question every security review answers" },
          {
            id: "b",
            text: "It has no answer. Secure against whom, protecting what, at what cost, is answerable",
          },
          { id: "c", text: "It should be asked of the vendor, not the security team" },
          { id: "d", text: "It can only be answered after a penetration test" },
        ],
        correct: "b",
        explanation:
          "Security is relative, not absolute. The only version of that question with an answer names an adversary, an asset and a cost. That is also the version that leads to a decision instead of a shrug.",
        whyWrong: {
          a: "No honest security review answers it. A review says what an attacker of a given capability could do, and what it would cost to close. Nobody credible signs off \"secure\".",
          c: "A vendor can tell you what their product does. Whether your system is secure depends on your data, your people and your exposure, none of which the vendor knows.",
          d: "A penetration test tells you what one team found in one time-boxed window. It cannot prove there is nothing left, and no test makes an absolute question answerable.",
        },
      },
      {
        id: "csq1-2",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cs-risk-language",
        prompt:
          "\"Our payment server runs a database version the vendor stopped patching two years ago.\" Which of the three words is that?",
        options: [
          { id: "a", text: "A threat" },
          { id: "b", text: "A vulnerability" },
          { id: "c", text: "A risk" },
          { id: "d", text: "All three at once" },
        ],
        correct: "b",
        explanation:
          "It is a weakness that an attacker could use. The threat is whoever wants the card data. The risk is what the breach would cost you. This sentence describes only the weakness, and the weakness is the part you can actually fix.",
        whyWrong: {
          a: "A threat is an actor or event that might cause harm. Unpatched software is not an actor. It is the hole the actor would come through.",
          c: "Risk is the consequence: records exposed, fines, customers lost. This sentence does not say what would happen, only what is wrong.",
          d: "Collapsing the three into one is exactly the habit the lesson warns about. It leaves you unable to say which lever you are pulling when you fix something.",
        },
      },
      {
        id: "csq1-3",
        type: "scenario",
        difficulty: 3,
        atomId: "a-cs-attack-surface",
        prompt:
          "A company lists its attack surface as \"our website\". An auditor disagrees. What is the auditor most likely pointing at?",
        options: [
          {
            id: "a",
            text: "Staff email accounts, an old test server, and a database port left open for a contractor",
          },
          { id: "b", text: "The website's page load speed" },
          { id: "c", text: "The number of customers the website has" },
          { id: "d", text: "The programming language the website is written in" },
        ],
        correct: "a",
        explanation:
          "Attack surface is every point where somebody outside could interact with you, including the ones nobody remembers installing. Forgotten infrastructure and human accounts are where most real breaches start.",
        whyWrong: {
          b: "Load speed is a performance property. It says nothing about who can reach the system or what they could do when they did.",
          c: "Customer count changes how bad a breach would be, which is impact. It does not change how many doors there are.",
          d: "The language affects what kinds of bug are likely. It is not itself a point of interaction, and a perfectly written site with an open database port beside it is still wide open.",
        },
      },
      {
        id: "csq1-4",
        type: "truefalse",
        difficulty: 1,
        atomId: "a-cs-who-attacks",
        prompt: "A small business is unlikely to be attacked because attackers target large organisations.",
        options: [
          { id: "a", text: "True" },
          { id: "b", text: "False" },
        ],
        correct: "b",
        explanation:
          "False. The most common attacker does not know who you are. They scanned the internet, your machine answered, and that was the whole selection process. Being small is not cover.",
        whyWrong: {
          a: "This belief is why small organisations are hit so often. Targeted attacks do favour large firms. Untargeted ones, which are the overwhelming majority, are indifferent to your size.",
        },
      },
      {
        id: "csq1-5",
        type: "scenario",
        difficulty: 3,
        atomId: "a-cs-defence-in-depth",
        prompt:
          "A phishing email captures one employee's password. In which design does that become a company-ending event rather than an incident?",
        options: [
          {
            id: "a",
            text: "Where multi-factor authentication is on and the account can only reach that employee's own mailbox",
          },
          {
            id: "b",
            text: "Where one login opens every system and no second factor is required",
          },
          { id: "c", text: "Where the employee is required to change passwords every 30 days" },
          { id: "d", text: "Where the company uses antivirus on every machine" },
        ],
        correct: "b",
        explanation:
          "Defence in depth and least privilege together decide how bad a breach is. With neither, one stolen password is total access, which is the difference between a bad afternoon and the end of the business.",
        whyWrong: {
          a: "This is the design that contains it. The second factor stops most of these outright, and least privilege means even success gets the attacker one mailbox.",
          c: "Forced rotation does almost nothing here. The attacker uses the password within minutes, and rotation mainly produces weaker passwords with a number on the end.",
          d: "Antivirus is irrelevant to this attack. No malware was involved. Somebody typed their password into a page that was not their employer's.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "cs-l2-cia-triad": {
    lessonId: "cs-l2-cia-triad",
    passMark: 70,
    questions: [
      {
        id: "csq2-1",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cs-integrity",
        prompt:
          "Someone quietly changes one account number in the payroll file. Nothing is copied and nothing is deleted. Which leg of the triad broke?",
        options: [
          { id: "a", text: "Confidentiality" },
          { id: "b", text: "Integrity" },
          { id: "c", text: "Availability" },
          { id: "d", text: "None, because no data left the company" },
        ],
        correct: "b",
        explanation:
          "Integrity is about the data being what it should be. Nothing was revealed and nothing was taken away. The data is simply no longer correct, and salaries will go to the wrong place until somebody checks.",
        whyWrong: {
          a: "Confidentiality is about who can see the data. Nobody saw anything they should not have. They changed something.",
          c: "Availability is about whether the people who need the data can get to it. The file is right there and opens normally.",
          d: "Data leaving the building is one kind of failure, not the only kind. A quiet edit is often the more expensive one because nobody notices for months.",
        },
      },
      {
        id: "csq2-2",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cs-availability",
        prompt: "Why is availability a security property rather than just an operations concern?",
        options: [
          { id: "a", text: "Because uptime is measured by the security team in most companies" },
          {
            id: "b",
            text: "Because an attacker can deliberately take a service away, and a system nobody can reach is not protecting anything",
          },
          { id: "c", text: "Because availability is required by every compliance framework" },
          { id: "d", text: "It is not. Availability belongs to operations, not security" },
        ],
        correct: "b",
        explanation:
          "Ransomware is the clearest proof. It does not steal your data, it takes it away from you, and that alone is enough to stop a hospital or a bank. Denial of service does the same thing without touching a single record.",
        whyWrong: {
          a: "Who reports the metric is an org chart question. It has nothing to do with whether the property is a security one.",
          c: "Frameworks do require it, but that is a consequence of it being a security property rather than the reason it is one.",
          d: "This is the most common mistake security people make, and the business never makes it. A clinic whose records are down is in an emergency even though nothing leaked.",
        },
      },
      {
        id: "csq2-3",
        type: "scenario",
        difficulty: 3,
        atomId: "a-cs-cia-conflict",
        prompt:
          "A team proposes locking any account after three failed logins. What is the availability cost somebody should raise?",
        options: [
          { id: "a", text: "Locked accounts use more storage" },
          {
            id: "b",
            text: "An attacker can deliberately lock out every employee by failing three logins on each account",
          },
          { id: "c", text: "Passwords will need to be longer" },
          { id: "d", text: "There is no availability cost, because legitimate users know their own passwords" },
        ],
        correct: "b",
        explanation:
          "The control that protects confidentiality hands an attacker a one-line denial of service. This is the triad fighting itself, and it is why modern guidance prefers slowing attempts down over locking accounts out.",
        whyWrong: {
          a: "Storage is not the concern and a lock flag costs nothing. This mistakes a technical detail for the trade-off.",
          c: "Lockout policy and password length are separate settings. One does not force the other.",
          d: "Legitimate users mistype constantly, especially on phones, and an attacker does not need to know a password to fail a login three times on purpose.",
        },
      },
      {
        id: "csq2-4",
        type: "scenario",
        difficulty: 3,
        atomId: "a-cs-cia-diagnose",
        prompt:
          "Ransomware encrypts the file server. Which legs broke, and what does that tell you about the first hour?",
        options: [
          {
            id: "a",
            text: "Availability only. Restore from backup and carry on",
          },
          {
            id: "b",
            text: "Availability, and you must assume confidentiality too. Restore, and also treat it as a data breach",
          },
          { id: "c", text: "Confidentiality only, because the attacker read the files" },
          { id: "d", text: "Integrity only, because the files were changed" },
        ],
        correct: "b",
        explanation:
          "Modern ransomware copies data out before encrypting it, precisely so that restoring from backup is not enough to make the problem go away. Treating it as availability alone is how organisations miss their notification obligations.",
        whyWrong: {
          a: "This is the assumption that gets organisations fined. Restoring solves the outage and does nothing about the copy the attacker now holds.",
          c: "Confidentiality is part of it, but calling it the whole thing ignores that the business is currently on the floor and cannot operate.",
          d: "Encryption does change the files, but the harm is that nobody can use them. Framing it as integrity sends you looking for what was altered instead of restoring service.",
        },
      },
      {
        id: "csq2-5",
        type: "truefalse",
        difficulty: 1,
        atomId: "a-cs-confidentiality",
        prompt:
          "A hospital clerk browsing a neighbour's patient file is a confidentiality failure, even though nothing was copied or changed.",
        options: [
          { id: "a", text: "True" },
          { id: "b", text: "False" },
        ],
        correct: "a",
        explanation:
          "True. Confidentiality is about who can see the data. Someone inside seeing what they have no business seeing is the same failure as an outsider doing it, and in most countries it is illegal.",
        whyWrong: {
          b: "This treats confidentiality as being only about data leaving the building. Internal misuse is far more common and is the reason access is restricted by role rather than by network position.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "cs-l3-how-attacks-happen": {
    lessonId: "cs-l3-how-attacks-happen",
    passMark: 70,
    questions: [
      {
        id: "csq3-1",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cs-social-engineering",
        prompt:
          "What makes social engineering so effective against technically skilled people?",
        options: [
          { id: "a", text: "Technical people are careless with passwords" },
          {
            id: "b",
            text: "It exploits being busy and the request looking normal, not a lack of knowledge",
          },
          { id: "c", text: "It uses vulnerabilities that only experts have on their machines" },
          { id: "d", text: "It only works on people who have not had security training" },
        ],
        correct: "b",
        explanation:
          "The attack targets context, not competence. A plausible department, a real deadline and a witness who makes refusing feel rude will work on an engineer at 4:50pm on a Friday exactly as well as on anyone else.",
        whyWrong: {
          a: "Password habits are a separate problem. Social engineering does not need the target to be careless, only to be interrupted at the right moment.",
          c: "There is no software vulnerability involved at all. That is what makes it so hard to patch.",
          d: "Trained people fall for it routinely. Training that only says \"be suspicious\" gives no procedure, and suspicion without procedure collapses under time pressure.",
        },
      },
      {
        id: "csq3-2",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cs-phishing-shape",
        prompt:
          "What separates business email compromise from ordinary phishing?",
        options: [
          { id: "a", text: "It carries a more sophisticated piece of malware" },
          {
            id: "b",
            text: "It usually involves no malware at all, and is aimed at whoever can move money",
          },
          { id: "c", text: "It is sent to more people at once" },
          { id: "d", text: "It only targets banks" },
        ],
        correct: "b",
        explanation:
          "It is research plus an ordinary email. The attacker learns enough about a real supplier relationship to step into the middle of it, and asks for a payment that looks entirely routine. Nothing for antivirus to catch.",
        whyWrong: {
          a: "There is typically no attachment and no link to anything malicious. The payload is a bank account number in plain text.",
          c: "The opposite. Bulk is ordinary phishing. This is one carefully researched message to one person who can authorise a payment.",
          d: "Any organisation that pays invoices is a target, which is all of them. Banks are not especially involved.",
        },
      },
      {
        id: "csq3-3",
        type: "scenario",
        difficulty: 3,
        atomId: "a-cs-phishing-shape",
        prompt:
          "A supplier emails that their bank details have changed, quoting your real open invoice number. Which response actually breaks the attack?",
        options: [
          { id: "a", text: "Reply to the email and ask them to confirm" },
          { id: "b", text: "Pay a small test amount first" },
          {
            id: "c",
            text: "Call the number you already held on file, not one from the email, and confirm",
          },
          { id: "d", text: "Pay it, because the invoice number proves they have access to the real account" },
        ],
        correct: "c",
        explanation:
          "Verification out of band is the only reliable defence. The critical word is \"already\": any contact detail supplied by the message is part of the message and cannot verify it.",
        whyWrong: {
          a: "That asks the attacker whether the attacker is real. If the mailbox is compromised or the domain is a lookalike, your request goes straight to them.",
          b: "The test payment will succeed, because the account is real and belongs to the attacker. You have confirmed nothing and lost the test amount.",
          d: "A matching invoice number proves the attacker did their homework. It is evidence of research, not of legitimacy.",
        },
      },
      {
        id: "csq3-4",
        type: "mcq",
        difficulty: 1,
        atomId: "a-cs-malware",
        prompt: "What distinguishes a worm from a virus?",
        options: [
          { id: "a", text: "A worm spreads on its own, without needing a user to run anything" },
          { id: "b", text: "A worm encrypts files and demands payment" },
          { id: "c", text: "A worm only affects Linux systems" },
          { id: "d", text: "A worm is written in a scripting language" },
        ],
        correct: "a",
        explanation:
          "The names describe how it spreads or what it does. A virus attaches itself to something a user runs. A worm needs no help, which is why an unpatched service reachable from the network is such a serious exposure.",
        whyWrong: {
          b: "That describes ransomware, which is defined by what it does rather than how it travels. A worm could carry ransomware, and some have.",
          c: "Worms exist for every operating system. The famous ones have mostly targeted Windows.",
          d: "The implementation language has nothing to do with it. The distinction is whether it needs a human to run it.",
        },
      },
      {
        id: "csq3-5",
        type: "truefalse",
        difficulty: 2,
        atomId: "a-cs-denial-of-service",
        prompt: "Every unexplained outage should be treated first as a denial of service attack.",
        options: [
          { id: "a", text: "True" },
          { id: "b", text: "False" },
        ],
        correct: "b",
        explanation:
          "False. A bad deployment, a full disk or an expired certificate will take a service down far more often than anyone attacking it. Jumping to \"we are under attack\" burns the first hour of the response on the wrong theory.",
        whyWrong: {
          a: "This is a real and expensive habit. Treating ordinary faults as attacks escalates unnecessarily, and also trains the team to ignore the escalation when it matters.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "cs-l4-your-lab": {
    lessonId: "cs-l4-your-lab",
    passMark: 70,
    questions: [
      {
        id: "csq4-1",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cs-lab-isolation",
        prompt:
          "Which virtual machine network mode should every scanning exercise in this course use?",
        options: [
          { id: "a", text: "Bridged, so the VM behaves like a real machine on the network" },
          { id: "b", text: "NAT, so the VM can still reach the internet" },
          { id: "c", text: "Host-only, so the VM can reach your machine and other VMs and nothing else" },
          { id: "d", text: "Whichever mode the tool documentation recommends" },
        ],
        correct: "c",
        explanation:
          "Host-only means a mistyped range cannot leave your own computer. The whole point of isolation is that safety does not depend on you being careful at the moment you press Enter.",
        whyWrong: {
          a: "Bridged puts the VM directly onto your real network, which usually includes devices belonging to other people and to your internet provider. A scan there is at best rude and in many places illegal.",
          b: "NAT still reaches the internet, so a scan aimed at the wrong address leaves your house. Use NAT to install updates, then switch before any scanning.",
          d: "Tool documentation describes how to make the tool work, not what is legal or safe on your network. That judgement is yours and it comes first.",
        },
      },
      {
        id: "csq4-2",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cs-why-a-vm",
        prompt: "Why run the labs in a virtual machine rather than directly on your laptop?",
        options: [
          { id: "a", text: "Security tools only run on Linux" },
          {
            id: "b",
            text: "So that deliberately vulnerable software and attacker samples cannot touch your real files, and a broken machine can be deleted",
          },
          { id: "c", text: "Because virtual machines are faster than physical ones" },
          { id: "d", text: "To avoid needing antivirus" },
        ],
        correct: "b",
        explanation:
          "You are going to run vulnerable software on purpose. A virtual machine has its own disk and its own network, so being wrong is survivable and reversible.",
        whyWrong: {
          a: "Plenty run on Windows and macOS. The reason for the VM is containment, not compatibility.",
          c: "A virtual machine is slower than the host, because it is sharing that host's hardware. You accept that cost for the isolation.",
          d: "It does not replace antivirus, and the host still needs its normal protections. The VM limits the blast radius rather than removing the need for defence.",
        },
      },
      {
        id: "csq4-3",
        type: "scenario",
        difficulty: 2,
        atomId: "a-cs-snapshots",
        prompt:
          "When is the most valuable moment to take your first snapshot of a new lab VM?",
        options: [
          { id: "a", text: "After a week of configuration, so the snapshot includes your setup" },
          { id: "b", text: "Immediately after installation and updates, before anything is configured" },
          { id: "c", text: "Only after something has broken, so you can compare" },
          { id: "d", text: "Snapshots should be avoided because they use disk space" },
        ],
        correct: "b",
        explanation:
          "The snapshot you want is the one from before anything could have gone wrong. It is the point you can always return to, and having it is what turns the lab from something you are careful with into something you can genuinely experiment in.",
        whyWrong: {
          a: "A week of configuration is a week of opportunities to break something subtly. Restoring to that point restores the problem with it.",
          c: "A snapshot captures a state. Taken after the break, it captures the break. It cannot reach backwards in time.",
          d: "They do use space, and it is the cheapest insurance in the course. Delete old ones rather than skipping the habit.",
        },
      },
      {
        id: "csq4-4",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cs-first-commands",
        prompt:
          "You run `id` and the output ends with `groups=1000(learner),27(sudo)`. What does that tell you?",
        options: [
          { id: "a", text: "You are logged in as root" },
          { id: "b", text: "This account can become root when it needs to" },
          { id: "c", text: "The sudo command is not installed" },
          { id: "d", text: "There are 27 users on this machine" },
        ],
        correct: "b",
        explanation:
          "Membership of the sudo group is permission to escalate. The account is ordinary day to day, and one command away from full control, which is exactly the arrangement least privilege wants.",
        whyWrong: {
          a: "Root would show uid=0. This shows uid=1000, an ordinary user account that happens to have escalation rights.",
          c: "The group exists precisely because sudo is present. Its absence would look like a missing group, not this.",
          d: "27 is the numeric id of the sudo group itself, not a count of anything. Group ids are labels.",
        },
      },
      {
        id: "csq4-5",
        type: "truefalse",
        difficulty: 2,
        atomId: "a-cs-first-commands",
        prompt: "Working as root all the time is a reasonable choice in a lab, since nothing important is on it.",
        options: [
          { id: "a", text: "True" },
          { id: "b", text: "False" },
        ],
        correct: "b",
        explanation:
          "False, and the reason is habit rather than the lab. You are building the reflexes you will use on real systems. An ordinary account limits a mistake to your own files; root limits it to nothing.",
        whyWrong: {
          a: "The lab is disposable, so the immediate damage is small. What is not disposable is the habit, and a person who has spent sixteen weeks as root will be root on the first production box they touch.",
        },
      },
    ],
  },
};

export default ASSESSMENTS;
