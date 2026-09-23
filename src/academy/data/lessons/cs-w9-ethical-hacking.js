/**
 * CYBERSECURITY · WEEK 9 · ETHICAL HACKING & PENETRATION TESTING
 *
 * Harvard anchor: builds on the risk-based mindset. To defend a system you
 * have to understand how an adversary reasons about it.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 *
 * THE ORDER OF THIS WEEK IS DELIBERATE AND NOT NEGOTIABLE. Authorisation,
 * scope and the law come first, before a single technique. Every offensive
 * course that teaches tooling first produces people who are technically
 * capable and professionally dangerous, and the ones who get into trouble are
 * almost never malicious. They are curious, and nobody told them where the
 * line was until after they had crossed it.
 *
 * Nothing in this week is an exploit. The techniques taught are reconnaissance
 * and enumeration, both of which are legal against a target you own or are
 * authorised to test and illegal against anything else. The terminals are
 * recordings from a lab the author controls.
 */

export const SECTION_ID = "cs-s9-ethical-hacking";

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 1
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "cs-l33-authorisation",
    moduleId: "cs-w9-ethical-hacking",
    sectionId: SECTION_ID,
    order: 1,
    title: "Authorisation Comes First",
    subtitle: "The only thing separating a professional from a defendant",
    estimatedMinutes: 13,
    intro:
      "There is no technical difference between a penetration test and an intrusion. The packets are identical, the tools are identical, and the logs look the same. The only difference is a document, signed before you started, by somebody entitled to sign it. This lesson is that document.",

    atoms: [
      {
        id: "a-cs-w9-law",
        title: "What the law actually says",
        explain:
          "In Nigeria, the Cybercrimes (Prohibition, Prevention, etc.) Act 2015 makes unauthorised access to a computer system an offence. The UK's Computer Misuse Act, the US Computer Fraud and Abuse Act and equivalent laws elsewhere say materially the same thing. Access without authorisation is the offence.",
        why: "Two details catch people out. Intent to cause harm is generally not required, so \"I was only looking\" is not a defence. And access includes probing: a scan that a system responds to has accessed it.",
        table: {
          caption: "What the law cares about, and what it does not.",
          headers: ["Question", "Relevant?"],
          rows: [
            ["Did you have authorisation?", "Yes. This is the whole question"],
            ["Did you intend harm?", "Usually not required for the basic offence"],
            ["Did you cause damage?", "Affects the penalty, not whether it was an offence"],
            ["Did you report what you found?", "Mitigating at best. It does not undo the access"],
            ["Was the system obviously insecure?", "Irrelevant. An unlocked door is still not an invitation"],
          ],
        },
        mistake:
          "Believing that finding and reporting a vulnerability protects you. Researchers acting in good faith have been prosecuted in several countries for exactly this. Report what you observed; do not probe to confirm it.",
      },
      {
        id: "a-cs-w9-who-authorises",
        title: "Who can actually give you permission",
        explain:
          "Somebody with authority over the system, in writing. That is usually a system owner, a CISO or a director, and it is almost never the developer who invited you, the friend who works there, or the person who says it is fine.",
        why: "It also has to be someone who owns what you are testing. A company can authorise a test of its own application; it cannot authorise you to test the cloud provider it runs on, the payment processor it integrates with, or the office building's network if it rents space in one.",
        decision: {
          scenario:
            "A developer friend at a startup asks you to test their application. They say the founder is relaxed and to just go ahead, and they will tell them afterwards.",
          question: "What do you need before you start?",
          options: [
            {
              id: "a",
              text: "Nothing further. The developer works there and has invited you",
              whyWrong:
                "The developer almost certainly cannot authorise security testing, and the invitation is verbal. If anything goes wrong, or if the founder's account of the conversation differs from your friend's, you have no evidence you were permitted to be there.",
            },
            {
              id: "b",
              text: "Written authorisation from someone with authority over the system, naming the targets, the dates and what is permitted",
              why: "The document protects both of you. It also forces the conversation about scope that always turns up something important, such as the fact that the staging environment shares a database with production.",
            },
            {
              id: "c",
              text: "An email from the developer confirming the request, so there is a written record",
              whyWrong:
                "Written is necessary and not sufficient. A record of permission from somebody who could not grant it is a record of the wrong thing, and it puts your friend in a difficult position too.",
            },
            {
              id: "d",
              text: "Just avoid anything destructive and stay on the staging environment",
              whyWrong:
                "Care is good practice and is not authorisation. Staging environments also routinely share infrastructure with production, which is precisely the sort of thing a scoping conversation uncovers.",
            },
          ],
          correct: "b",
          aftermath:
            "This scenario is how a large proportion of real problems start. Nobody set out to do anything wrong, and there was no document, and afterwards the accounts differed.",
        },
      },
      {
        id: "a-cs-w9-scope",
        title: "Scope, and why out of scope is the important half",
        explain:
          "Scope names exactly what may be tested: which domains, which IP ranges, which applications, and which accounts. Out of scope names what may not, and that list is where the real risk is.",
        why: "Systems share infrastructure. An IP range may include a host belonging to somebody else. A domain may resolve to a content delivery network you are not permitted to test. Testing the right target on the wrong infrastructure is still an offence against whoever owns that infrastructure.",
        table: {
          caption: "A scope that is specific enough to rely on.",
          headers: ["Item", "Vague", "Specific enough"],
          rows: [
            ["Targets", "The company's website", "app.example.com and api.example.com, and no other subdomain"],
            ["Addresses", "Their network", "102.89.4.32/29, confirmed as owned by them"],
            ["Accounts", "A test account", "test-pentest-01, provided by the client, no other account"],
            ["Techniques", "A penetration test", "Web application testing. No denial of service, no social engineering"],
            ["Dates", "Next month", "14 to 18 October, 09:00 to 17:00 WAT"],
          ],
          note: "Cloud providers usually require their own notification or have their own policy for testing hosted systems. Check before, not after.",
        },
      },
      {
        id: "a-cs-w9-roe",
        title: "Rules of engagement",
        explain:
          "The document that turns a scope into a working agreement. It names the authorised targets and the excluded ones, the permitted techniques, the testing window, the emergency contacts on both sides, and what happens when something goes wrong.",
        why: "Most of it exists for the moment something unexpected happens, and something unexpected always happens. A test causes an outage. You find evidence somebody else got there first. You find real customer data. Every one of those needs a pre-agreed answer, because deciding at the time is how mistakes get made.",
        example:
          "The sections that earn their place:\n\n  Authorised targets        exact hosts and applications\n  Explicitly out of scope   including third-party infrastructure\n  Permitted techniques      and the ones that are not\n  Testing window            dates, times, timezone\n  Emergency contacts        both sides, reachable out of hours\n  Stop conditions           what causes testing to halt immediately\n  Evidence handling         how findings and any data are stored and destroyed\n  Reporting                 what is delivered, to whom, and when",
      },
      {
        id: "a-cs-w9-stop-conditions",
        title: "When to stop immediately",
        explain:
          "Three situations end testing on the spot and start a phone call. You cause an outage. You find evidence of a prior compromise by somebody else. Or you reach real personal data, especially anything medical, financial or biometric.",
        why: "The third is the one people push through, because it feels like proving the finding. It is not. You have demonstrated access; copying the data adds nothing to the report and makes you a party to a personal data breach.",
        decision: {
          scenario:
            "During an authorised test of a customer portal you find an access control flaw. One request returns another customer's full record, including their bank details. You need to demonstrate the finding in your report.",
          question: "What do you put in the report?",
          options: [
            {
              id: "a",
              text: "A screenshot of the full record, as evidence the finding is real",
              whyWrong:
                "You have copied a real person's bank details into a document that will be emailed and stored. The finding is already proven by the request and the response status; the contents add nothing and create a second data breach in your own files.",
            },
            {
              id: "b",
              text: "The request, the response status, and a redacted extract showing only the field names, plus a note that no data was retained",
              why: "It proves the same thing with none of the exposure. Field names and a 200 status demonstrate that another customer's record was returned, which is the entire finding.",
            },
            {
              id: "c",
              text: "Retrieve several records to show how many are affected, then summarise",
              whyWrong:
                "Enumerating to establish scale turns one unauthorised access into many, and is exactly the behaviour that turns a test into an incident in the client's own logs. Estimate the scale from the design instead.",
            },
            {
              id: "d",
              text: "Report it verbally and leave it out of the written report to avoid recording the data",
              whyWrong:
                "A finding that is not written down does not get fixed. The answer is to write it up without the personal data, not to omit the finding.",
            },
          ],
          correct: "b",
          aftermath:
            "Write this into the rules of engagement before you start, so the decision is already made. \"Evidence will be redacted and no personal data retained\" is one line and it saves a difficult conversation.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 2
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "cs-l34-methodology",
    moduleId: "cs-w9-ethical-hacking",
    sectionId: SECTION_ID,
    order: 2,
    title: "Methodology",
    subtitle: "Why professionals follow a process",
    estimatedMinutes: 11,
    intro:
      "The difference between a test and poking at something is repeatability. A methodology means two testers cover the same ground, you can say what you did and did not examine, and next year's test can be compared with this one.",

    atoms: [
      {
        id: "a-cs-w9-phases",
        title: "The phases",
        explain:
          "Reconnaissance, enumeration, vulnerability identification, exploitation, post-exploitation, and reporting. The names vary between frameworks. The order does not, because each phase produces the input for the next.",
        why: "The failure this prevents is jumping to exploitation. Somebody finds one interesting service, spends the whole engagement on it, and delivers a report that covers 5% of the scope. The process exists to make coverage the default rather than an afterthought.",
        table: {
          caption: "What each phase produces.",
          headers: ["Phase", "Question", "Output"],
          rows: [
            ["Reconnaissance", "What exists, without touching it?", "Domains, addresses, people, technologies"],
            ["Enumeration", "What is actually running?", "Hosts, ports, services, versions"],
            ["Vulnerability identification", "What might be weak?", "Candidate findings, prioritised"],
            ["Exploitation", "Which of those are real?", "Confirmed findings, with evidence"],
            ["Post-exploitation", "What does it lead to?", "Impact: what an attacker would reach next"],
            ["Reporting", "What should they do?", "The only deliverable anyone reads"],
          ],
        },
      },
      {
        id: "a-cs-w9-box-colours",
        title: "Black, grey and white box",
        explain:
          "Black box means you are given nothing but the target name. White box means you get source code, architecture and credentials. Grey box, which is most real engagements, means you get a normal user account and some documentation.",
        why: "The choice is about what question the client is asking. Black box answers \"what can an outsider find in five days?\". White box answers \"what is actually wrong with this system?\". They find different things, and white box finds more per day spent, which surprises people.",
        mistake:
          "Choosing black box because it feels more realistic. It spends a large part of a limited budget rediscovering things the client could have simply told you, and a real attacker has months while you have a week.",
      },
      {
        id: "a-cs-w9-test-types",
        title: "Three things people call a penetration test",
        explain:
          "A vulnerability scan is automated and finds known issues. A penetration test is a human working a defined scope to find and confirm what an attacker could do. A red team exercise tests whether the organisation's defenders detect and respond, and is usually not scoped to any particular system.",
        why: "Clients frequently buy one and expect another. A scan report delivered as a penetration test is the most common complaint in the industry, and a red team engagement run against an organisation with no detection capability produces nothing useful, because there was nothing to test.",
        table: {
          caption: "What each one answers, and what it costs.",
          headers: ["", "Vulnerability scan", "Penetration test", "Red team"],
          rows: [
            ["Finds", "Known issues in known software", "What an attacker could actually achieve", "Whether you would notice"],
            ["Driven by", "A tool", "A person with a scope", "A person with an objective"],
            ["Duration", "Hours", "Days to weeks", "Weeks to months"],
            ["Needs", "A target list", "A scope and authorisation", "A mature detection capability, or it is pointless"],
          ],
        },
      },
      {
        id: "a-cs-w9-evidence",
        title: "Notes, and why they are the real work",
        explain:
          "Every command, with its timestamp. Every request and response for anything that becomes a finding. Screenshots with the URL visible. A running log of what was tested and found nothing, which is as important as what was found.",
        why: "Three reasons, in increasing order of importance. You will not remember on Friday what you ran on Tuesday. The client may need to correlate your activity with an alert in their logs. And if something breaks during the window, your notes are the only evidence of whether it was you.",
        mistake:
          "Recording only the findings. When a client asks whether you tested the reporting module and you cannot say, the honest answer is no, and that is a worse conversation than having tested it and found nothing.",
      },
      {
        id: "a-cs-w9-do-no-harm",
        title: "Do no harm, in practice",
        explain:
          "Avoid anything with a real chance of causing an outage or data loss unless the rules of engagement specifically permit it. No denial of service. No automated exploitation of anything that writes. No password spraying that will lock out real accounts. Test on a copy where one exists.",
        why: "You are being paid to reduce risk, and a test that takes down a payment system during business hours has increased it. The reputational cost falls on the whole profession, and it is the single most common reason organisations refuse to test again.",
        practice: {
          prompt:
            "You find a form that looks vulnerable to injection. The likely payload would modify data. It is 15:00 on a working day. What do you do?",
          answer:
            "Confirm it without writing anything. A read-only proof such as a timing difference or an error message shows the vulnerability exists. Then record it as confirmed-read-only, note in the report that a write was possible but not attempted, and say why. The finding is just as real and nobody's data was altered.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 3
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "cs-l35-reconnaissance",
    moduleId: "cs-w9-ethical-hacking",
    sectionId: SECTION_ID,
    order: 3,
    title: "Reconnaissance",
    subtitle: "What can be learned without touching anything",
    estimatedMinutes: 12,
    intro:
      "Passive reconnaissance uses public sources and never contacts the target. It is the phase most beginners skip and the one professionals spend the most time on, because it is free, invisible, and frequently finds the way in before any packet has been sent.",

    atoms: [
      {
        id: "a-cs-w9-passive-active",
        title: "Passive and active",
        explain:
          "Passive reconnaissance gathers information from third parties: registration records, certificate transparency logs, search engines, job adverts, public code repositories. Active reconnaissance sends packets to the target and therefore appears in their logs.",
        why: "The distinction is legal as much as technical. Reading a public job advert that names your target's exact firewall product is not access to anything. Connecting to that firewall is. Passive work is also silent, which matters when the engagement includes testing whether they notice you.",
        table: {
          caption: "Where the line is.",
          headers: ["Activity", "Passive or active?", "Appears in their logs?"],
          rows: [
            ["Reading their website in a browser", "Passive", "As an ordinary visitor"],
            ["A whois lookup", "Passive", "No, it queries a registry"],
            ["Certificate transparency search", "Passive", "No, it queries a public log"],
            ["Reading their staff's public profiles", "Passive", "No"],
            ["A DNS lookup against their own name server", "Borderline", "Possibly"],
            ["A port scan", "Active", "Yes, clearly"],
          ],
        },
      },
      {
        id: "a-cs-w9-passive-recon",
        title: "Practice: start with the registration record",
        explain:
          "Your engagement has just started against memora-lab.test, a domain in the author's own lab. Before anything touches it, find out what the public record says about it.",
        why: "A registration record tells you who owns the domain, when it was registered, which name servers it uses and often an administrative contact. That last one has been the starting point for a great many social engineering campaigns, which is why most registrars now offer privacy protection.",
        terminalExercise: {
          prompt: "tester@kali:~$",
          intro:
            "Recorded from a lab the author controls. Every result below is from that lab, not from any real domain.",
          goal:
            "You are about to begin an authorised engagement against memora-lab.test. Before sending a single packet to the target, find out what the public registration record says about the domain.",
          commands: {
            "whois memora-lab.test":
              "Domain Name: MEMORA-LAB.TEST\nRegistrar: Lab Registrar Ltd\nCreation Date: 2023-04-11T09:22:14Z\nRegistry Expiry Date: 2027-04-11T09:22:14Z\nName Server: NS1.LABDNS.TEST\nName Server: NS2.LABDNS.TEST\nRegistrant Organization: Memora Lab\nRegistrant Country: NG\nAdmin Email: hostmaster@memora-lab.test\nDomain Status: clientTransferProhibited",
            "dig memora-lab.test":
              ";; ANSWER SECTION:\nmemora-lab.test.    300   IN   A   192.168.56.20\n\n;; Query time: 2 msec",
            "dig +short NS memora-lab.test": "ns1.labdns.test.\nns2.labdns.test.",
            "host -t MX memora-lab.test": "memora-lab.test mail is handled by 10 mail.memora-lab.test.",
            "curl -sI https://memora-lab.test":
              "HTTP/1.1 200 OK\nServer: Apache/2.4.41 (Ubuntu)\nX-Powered-By: PHP/7.4.3\nContent-Type: text/html; charset=UTF-8",
            "nmap -sV 192.168.56.20":
              "Starting Nmap 7.94 ( https://nmap.org )\nNmap scan report for 192.168.56.20\nPORT     STATE SERVICE VERSION\n22/tcp   open  ssh     OpenSSH 8.2p1 Ubuntu 4ubuntu0.5\n80/tcp   open  http    Apache httpd 2.4.41 ((Ubuntu))\n443/tcp  open  ssl/http Apache httpd 2.4.41 ((Ubuntu))\n3306/tcp open  mysql   MySQL 5.7.33\nService detection performed. Nmap done: 1 IP address (1 host up)",
          },
          available: [
            "whois memora-lab.test",
            "dig memora-lab.test",
            "dig +short NS memora-lab.test",
            "host -t MX memora-lab.test",
            "curl -sI https://memora-lab.test",
            "nmap -sV 192.168.56.20",
          ],
          accept: ["whois memora-lab.test"],
          near: [
            {
              command: "dig memora-lab.test",
              why: "That resolves the name to an address, which is useful and is not the registration record. It also queries DNS rather than the registry, so it tells you nothing about who owns the domain.",
            },
            {
              command: "nmap -sV 192.168.56.20",
              why: "That sends packets to the target, which is active reconnaissance and belongs in the next phase. The goal explicitly said before a single packet touches it.",
            },
          ],
          hint: "One command, named after the question it asks about a domain's registration.",
          success:
            "Registered in 2023, organisation in Nigeria, two name servers on labdns.test, and an administrative email address. That address is now on your list, because it is the kind of contact that receives targeted mail. Now try `curl -sI` and notice the server is announcing its exact version.",
        },
      },
      {
        id: "a-cs-w9-osint-sources",
        title: "Where the information actually is",
        explain:
          "Certificate transparency logs list every certificate ever issued for a domain, which reveals subdomains nobody meant to publish. Job adverts name the exact products in use. Public code repositories contain configuration. Search engines index things that were never linked.",
        why: "Certificate transparency is the one that surprises people most. Every certificate issued for any subdomain is in a public, searchable log by design, so internal-admin.example.com is discoverable the moment somebody requests a certificate for it.",
        table: {
          caption: "Public sources, and what each one gives away.",
          headers: ["Source", "Reveals"],
          rows: [
            ["Certificate transparency logs", "Subdomains, including internal-sounding ones"],
            ["Job adverts", "Exact products, versions and team structure"],
            ["Public code repositories", "Configuration, sometimes credentials, internal hostnames"],
            ["Search engine indexes", "Documents and panels that were never linked"],
            ["Breach notification data", "Which staff email addresses appear in past breaches"],
            ["Social media", "Who works there, their roles, and who is on leave"],
          ],
        },
      },
      {
        id: "a-cs-w9-osint-people",
        title: "People are in scope only if the scope says so",
        explain:
          "Staff names, roles, email address formats and reporting lines are all public and all useful to an attacker. Whether you may do anything with them during an engagement depends entirely on whether social engineering is in the rules of engagement.",
        why: "This is the most common scope violation in the industry, and it is usually accidental. Collecting names is reconnaissance. Sending one of them a test phishing email is social engineering, and if the agreement did not permit it, you have just run an unauthorised operation against an individual.",
        decision: {
          scenario:
            "Your scope covers the web application. During reconnaissance you find a staff member's email address in a public code repository, alongside what looks like a password in an old commit.",
          question: "What do you do?",
          options: [
            {
              id: "a",
              text: "Try the credential against the application. It is in scope and this is exactly what an attacker would do",
              whyWrong:
                "Attempting to authenticate as a real individual is not covered by a web application scope unless it explicitly says so, and if it works you are now logged in as a real employee. Their account activity, their data and their audit trail are all affected.",
            },
            {
              id: "b",
              text: "Report it immediately as a finding, without using the credential, and ask the client whether testing it is within scope",
              why: "The exposed credential is itself a serious finding and needs reporting today rather than at the end of the engagement. Whether you may use it is a scope question with an owner, and asking takes five minutes.",
            },
            {
              id: "c",
              text: "Note it for the report and continue with the application testing",
              whyWrong:
                "Correct about not using it, wrong about the timing. A live credential in a public repository is an active exposure, and holding it until the report on Friday means anyone else who finds it has until Friday too.",
            },
            {
              id: "d",
              text: "Contact the employee directly to tell them to change their password",
              whyWrong:
                "Well meant, and it goes around the client and contacts an individual you have no relationship with. Findings go through the agreed channel, which is exactly what the rules of engagement named a contact for.",
            },
          ],
          correct: "b",
          aftermath:
            "Most rules of engagement include a clause for critical findings that must be reported immediately rather than held for the report. This is what that clause is for.",
        },
      },
      {
        id: "a-cs-w9-recon-writeup",
        title: "Writing up what you found before you touched anything",
        explain:
          "The reconnaissance section of a report lists what a stranger can learn about the organisation from public sources alone, and it is often the section clients find most uncomfortable, because none of it involved attacking anything.",
        why: "It is also actionable in a way the technical findings are not. A subdomain in a certificate log can be taken out of DNS. A credential in a repository can be rotated. A job advert can stop naming the firewall product. These are cheap fixes with real effect.",
        practice: {
          prompt:
            "Your reconnaissance finds a subdomain called staging-admin.example.com in a certificate transparency log. It is not linked from anywhere. Is it a finding?",
          answer:
            "Yes, and it is a finding before you connect to it. The finding is that an internal-sounding host is publicly discoverable by anyone reading a public log, which the organisation almost certainly did not realise. Whether it is also reachable and vulnerable is the next question, and it is in the next phase.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 4
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "cs-l36-enumeration-and-report",
    moduleId: "cs-w9-ethical-hacking",
    sectionId: SECTION_ID,
    order: 4,
    title: "Enumeration and the Report",
    subtitle: "The part they pay for is the writing",
    estimatedMinutes: 13,
    intro:
      "Enumeration turns a list of hosts into a list of services and versions. Then comes the part that decides whether the engagement was worth anything, which is not the testing. It is the document.",

    atoms: [
      {
        id: "a-cs-w9-enumerate",
        title: "Practice: enumerate the authorised host",
        explain:
          "Reconnaissance gave you 192.168.56.20 as the address behind memora-lab.test, and it is in your authorised scope. Find out what is running on it and which versions.",
        why: "Versions are what turn an inventory into findings. An open port is an exposure; a named version is something you can look up against published vulnerabilities in under a minute, which is exactly what an attacker does.",
        terminalExercise: {
          prompt: "tester@kali:~$",
          intro:
            "The same lab. This host is within the authorised scope of the engagement, on host-only networking.",
          goal:
            "Find out which services are running on the authorised host 192.168.56.20, and which version each one is.",
          commands: {
            "nmap 192.168.56.20":
              "Starting Nmap 7.94 ( https://nmap.org )\nNmap scan report for 192.168.56.20\nHost is up (0.00042s latency).\nNot shown: 996 closed tcp ports (reset)\nPORT     STATE SERVICE\n22/tcp   open  ssh\n80/tcp   open  http\n443/tcp  open  https\n3306/tcp open  mysql\nNmap done: 1 IP address (1 host up) scanned in 0.31 seconds",
            "nmap -sV 192.168.56.20":
              "Starting Nmap 7.94 ( https://nmap.org )\nNmap scan report for 192.168.56.20\nPORT     STATE SERVICE VERSION\n22/tcp   open  ssh     OpenSSH 8.2p1 Ubuntu 4ubuntu0.5\n80/tcp   open  http    Apache httpd 2.4.41 ((Ubuntu))\n443/tcp  open  ssl/http Apache httpd 2.4.41 ((Ubuntu))\n3306/tcp open  mysql   MySQL 5.7.33\nService detection performed. Nmap done: 1 IP address (1 host up)",
            "nmap -sn 192.168.56.0/24":
              "Nmap scan report for 192.168.56.1\nHost is up.\nNmap scan report for 192.168.56.10\nHost is up.\nNmap scan report for 192.168.56.20\nHost is up.\nNmap done: 256 IP addresses (3 hosts up) scanned in 2.11 seconds",
            "curl -sI http://192.168.56.20":
              "HTTP/1.1 200 OK\nServer: Apache/2.4.41 (Ubuntu)\nX-Powered-By: PHP/7.4.3\nContent-Type: text/html; charset=UTF-8",
            "whatweb http://192.168.56.20":
              "http://192.168.56.20 [200 OK] Apache[2.4.41], Country[RESERVED], HTTPServer[Ubuntu Linux][Apache/2.4.41 (Ubuntu)], IP[192.168.56.20], PHP[7.4.3], Title[Memora Lab Portal], X-Powered-By[PHP/7.4.3]",
          },
          available: [
            "nmap 192.168.56.20",
            "nmap -sV 192.168.56.20",
            "nmap -sn 192.168.56.0/24",
            "curl -sI http://192.168.56.20",
            "whatweb http://192.168.56.20",
          ],
          accept: ["nmap -sV 192.168.56.20"],
          near: [
            {
              command: "nmap 192.168.56.20",
              why: "That finds the open ports, which is half the answer. It tells you a service is listening on 3306 and not which version, and the version is the part you can look up.",
            },
            {
              command: "nmap -sn 192.168.56.0/24",
              why: "Host discovery, which you already did in reconnaissance. You have the host. The question is what is on it.",
            },
          ],
          hint: "Add the flag that asks nmap to interrogate each open port and identify the software behind it.",
          success:
            "Four services with versions. Two immediate findings before you have looked up a single vulnerability: MySQL on 3306 is reachable, which it should not be, and PHP 7.4 reached end of life in November 2022, so it receives no security updates at all.",
        },
      },
      {
        id: "a-cs-w9-service-enum",
        title: "What to do with each service",
        explain:
          "Enumeration continues per service. A web server gets its technologies fingerprinted and its content mapped. SSH gets its version and permitted authentication methods checked. A database gets checked for default credentials and whether it should be reachable at all.",
        why: "The generic scan is the start. The value is in knowing what question each service raises, and the most valuable question is usually the architectural one: why is this reachable from here?",
        table: {
          caption: "Per service, the first questions.",
          headers: ["Service", "Ask"],
          rows: [
            ["HTTP / HTTPS", "What is it running, what paths exist, what headers are missing?"],
            ["SSH", "Which version, is password authentication on, is root login permitted?"],
            ["A database port", "Why is this reachable? Are default credentials in place?"],
            ["SMB / file sharing", "Which shares are listed, and what can be read without credentials?"],
            ["An admin panel", "Default credentials, and should it be internet-facing at all?"],
          ],
        },
      },
      {
        id: "a-cs-w9-report-structure",
        title: "The report",
        explain:
          "An executive summary for people who will read only that. A methodology and scope section saying what was and was not examined. The findings, each with evidence, impact, severity and a specific fix. And an appendix with the raw detail.",
        why: "Two audiences read one document and they need different things. The director needs to know whether to be worried and what to fund. The engineer needs the request that reproduces it. Writing one for both is why reports are structured this way.",
        table: {
          caption: "Who reads what.",
          headers: ["Section", "Audience", "Answers"],
          rows: [
            ["Executive summary", "Directors", "How bad is this, and what does it cost to fix?"],
            ["Scope and methodology", "Everyone, later", "What was actually tested, and what was not"],
            ["Findings", "Engineers", "Where, how to reproduce, impact, and the fix"],
            ["Remediation plan", "Managers", "What to do first, and in what order"],
            ["Appendix", "Whoever disputes a finding", "The raw evidence"],
          ],
        },
      },
      {
        id: "a-cs-w9-exec-summary",
        title: "The executive summary",
        explain:
          "Half a page, no jargon, and written last. What was tested, what the overall picture is, the two or three things that matter most, and what happens if nothing is done. No tool names, no port numbers, no severity ratings without a sentence explaining them.",
        why: "It is the only section some people will read, and it is the section that decides whether anything gets funded. A summary written in the language of the findings gets skimmed. One written in the language of the business gets acted on.",
        example:
          "Weak:\n  \"Testing identified 3 critical, 7 high and 14 medium findings.\n   Critical findings include CVE-2021-44228 on the reporting host.\"\n\nStronger:\n  \"An attacker with no credentials could read every customer record\n   in the portal within about an hour, using a flaw that requires no\n   special tools. Two further issues would let them keep that access\n   after a password reset. All three have straightforward fixes and\n   are estimated at under a week of engineering time in total.\"",
        mistake:
          "Counting findings in the summary. Fourteen medium findings on an internal test system matter less than one high finding on the customer portal, and a count invites exactly the wrong comparison.",
      },
      {
        id: "a-cs-w9-disclosure",
        title: "Responsible disclosure",
        explain:
          "When you find a vulnerability in somebody else's product, coordinated disclosure means telling the vendor first, agreeing a timeline, and publishing after a fix is available or the timeline expires. Ninety days is the common convention.",
        why: "It balances two real harms. Publishing immediately hands a working attack to everybody. Never publishing lets a vendor sit on a fix indefinitely, which happens, and leaves users exposed with no way to know they should be.",
        decision: {
          scenario:
            "You report a serious vulnerability to a vendor. After ninety days they have not fixed it, have stopped replying, and their product is used by hospitals.",
          question: "What do you do?",
          options: [
            {
              id: "a",
              text: "Publish the full technical details immediately, since the deadline has passed",
              whyWrong:
                "The deadline having passed makes publication defensible and does not make full exploit details the right content. Hospitals still running the product now face an attack they cannot defend against, and the harm lands on patients rather than on the vendor.",
            },
            {
              id: "b",
              text: "Escalate to a national CERT or coordination body, and publish enough for users to protect themselves without publishing a working exploit",
              why: "A coordination body can reach a vendor that is ignoring you and can notify affected users. Publishing the existence, the affected versions and the mitigation lets hospitals act; withholding the exploit means they have time to.",
            },
            {
              id: "c",
              text: "Keep quiet indefinitely, since publishing could endanger patients",
              whyWrong:
                "Silence leaves the vulnerability in place with nobody able to mitigate it, and attackers who find it independently face no such restraint. It protects the vendor rather than the users.",
            },
            {
              id: "d",
              text: "Sell the details to a broker so the vendor is pressured to act",
              whyWrong:
                "That puts a working attack against hospital systems into a market. Whatever the intention, the outcome is the opposite of disclosure.",
            },
          ],
          correct: "b",
          aftermath:
            "Impact on third parties is the variable that should shift your timeline. A vulnerability in a game and a vulnerability in a medical device get different handling, and every serious disclosure policy says so.",
        },
      },
    ],

    task: {
      title: "This week's lab",
      intro:
        "Run the first half of a real engagement, on a target you are authorised to test.",
      prompts: [
        "Write a rules of engagement document for a test against your own lab VM. Include authorised targets, exclusions, permitted techniques, the window, contacts, stop conditions and evidence handling. Sign and date it.",
        "Perform passive reconnaissance against a domain you own, or a deliberately vulnerable practice target that permits it. Record every source and what it revealed.",
        "Perform active enumeration against your lab target only. Record every command with its timestamp and its full output.",
        "Build a service inventory: host, port, service, version, and one sentence on why each is reachable and whether it should be.",
        "Look up two of the version strings against a public vulnerability database. Record what you find, and be specific about whether you confirmed it or only read about it.",
        "Write the reconnaissance and enumeration sections of a professional penetration test report, with a half-page executive summary written last.",
      ],
      closing:
        "The rules of engagement document is the deliverable that matters most here. Every engagement you ever run will start with one, and the habit of writing it before touching anything is the one this week exists to build.",
    },

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
