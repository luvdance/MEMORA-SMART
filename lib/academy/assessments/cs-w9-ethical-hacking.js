/**
 * ASSESSMENTS · CYBERSECURITY · WEEK 9 · ETHICAL HACKING
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Never import this from anything under src/.
 * ═════════════════════════════════════════════════════════════════════════
 */

export const ASSESSMENTS = {
  /* ═══════════════════════════════════════════════════════════════════ */
  "cs-l33-authorisation": {
    lessonId: "cs-l33-authorisation",
    passMark: 70,
    questions: [
      {
        id: "csq33-1",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cs-w9-law",
        prompt:
          "Under the Cybercrimes Act and its equivalents elsewhere, what is the question that decides whether an offence occurred?",
        options: [
          { id: "a", text: "Whether you intended to cause harm" },
          { id: "b", text: "Whether you had authorisation" },
          { id: "c", text: "Whether any damage resulted" },
          { id: "d", text: "Whether the system was adequately secured" },
        ],
        correct: "b",
        explanation:
          "Access without authorisation is the offence. Intent and damage affect the penalty rather than whether it happened, and probing counts as access if the system responds.",
        whyWrong: {
          a: "Intent is generally not required for the basic offence, which is why \"I was only looking\" is not a defence.",
          c: "Damage aggravates the offence. Its absence does not excuse it.",
          d: "An unlocked door is not an invitation. The state of the target's security is legally irrelevant.",
        },
      },
      {
        id: "csq33-2",
        type: "scenario",
        difficulty: 3,
        atomId: "a-cs-w9-who-authorises",
        prompt:
          "A developer friend invites you to test their employer's application and says the founder is relaxed about it. What do you need?",
        options: [
          { id: "a", text: "Nothing more; they work there and invited you" },
          {
            id: "b",
            text: "Written authorisation from someone with authority over the system, naming targets, dates and permitted techniques",
          },
          { id: "c", text: "An email from the developer, so there is a written record" },
          { id: "d", text: "An agreement to stay on staging and avoid anything destructive" },
        ],
        correct: "b",
        explanation:
          "The document protects both of you, and the scoping conversation it forces always surfaces something important, such as staging sharing a database with production.",
        whyWrong: {
          a: "A developer almost certainly cannot authorise security testing, and a verbal invitation leaves you with no evidence at all.",
          c: "Written is necessary and not sufficient. Permission from somebody who could not grant it is a record of the wrong thing.",
          d: "Care is good practice, not authorisation, and staging routinely shares infrastructure with production.",
        },
      },
      {
        id: "csq33-3",
        type: "mcq",
        difficulty: 3,
        atomId: "a-cs-w9-scope",
        prompt: "Why is the out-of-scope list often more important than the in-scope list?",
        options: [
          { id: "a", text: "Because it is usually longer" },
          {
            id: "b",
            text: "Because systems share infrastructure, and testing the right target on somebody else's infrastructure is still an offence against them",
          },
          { id: "c", text: "Because clients rarely know what they own" },
          { id: "d", text: "Because it determines the price" },
        ],
        correct: "b",
        explanation:
          "An IP range may include a host belonging to someone else, and a domain may resolve to a content delivery network you have no permission to test. Cloud providers usually have their own policy too.",
        whyWrong: {
          a: "Length is not the point. A one-line exclusion can be the most important sentence in the document.",
          c: "Often true, which is a reason to check ownership rather than the reason exclusions matter.",
          d: "Commercial terms are a separate matter from the legal boundary.",
        },
      },
      {
        id: "csq33-4",
        type: "scenario",
        difficulty: 3,
        atomId: "a-cs-w9-stop-conditions",
        prompt:
          "An access control flaw returns another customer's full record including bank details. How do you evidence it?",
        options: [
          { id: "a", text: "Screenshot the full record so the finding is undeniable" },
          {
            id: "b",
            text: "Record the request, the response status and a redacted extract showing field names only, and retain no data",
          },
          { id: "c", text: "Retrieve several records to establish the scale" },
          { id: "d", text: "Report it verbally and leave it out of the written report" },
        ],
        correct: "b",
        explanation:
          "The request and a 200 status prove another customer's record was returned, which is the whole finding. The contents add nothing and create a second data breach in your own files.",
        whyWrong: {
          a: "You would be copying a real person's bank details into a document that gets emailed and stored.",
          c: "Enumerating to establish scale turns one unauthorised access into many. Estimate scale from the design instead.",
          d: "A finding that is not written down does not get fixed. Write it up without the personal data.",
        },
      },
      {
        id: "csq33-5",
        type: "truefalse",
        difficulty: 2,
        atomId: "a-cs-w9-law",
        prompt:
          "Reporting a vulnerability you found by probing a stranger's system protects you legally.",
        options: [
          { id: "a", text: "True" },
          { id: "b", text: "False" },
        ],
        correct: "b",
        explanation:
          "False. Researchers acting in good faith have been prosecuted in several countries. Reporting is mitigating at best; it does not undo the unauthorised access.",
        whyWrong: {
          a: "The access already happened. Report what you observed in ordinary use, and do not probe to confirm it.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "cs-l34-methodology": {
    lessonId: "cs-l34-methodology",
    passMark: 70,
    questions: [
      {
        id: "csq34-1",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cs-w9-phases",
        prompt: "What failure does following the phases in order prevent?",
        options: [
          { id: "a", text: "Using the wrong tool" },
          {
            id: "b",
            text: "Jumping to exploitation on the first interesting service and covering 5% of the scope",
          },
          { id: "c", text: "Breaching the rules of engagement" },
          { id: "d", text: "Writing a poor report" },
        ],
        correct: "b",
        explanation:
          "Coverage becomes the default rather than an afterthought. Each phase produces the input for the next, so skipping ahead means working from an incomplete picture.",
        whyWrong: {
          a: "Tool choice follows from the phase and is not what the process protects against.",
          c: "Scope discipline is a separate control, established before any phase begins.",
          d: "The process improves the report's coverage and does not by itself make the writing good.",
        },
      },
      {
        id: "csq34-2",
        type: "mcq",
        difficulty: 3,
        atomId: "a-cs-w9-box-colours",
        prompt:
          "Why does white box testing usually find more per day than black box?",
        options: [
          { id: "a", text: "Because the tester is more experienced" },
          {
            id: "b",
            text: "Because black box spends much of a limited budget rediscovering what the client could have simply told you",
          },
          { id: "c", text: "Because white box permits more aggressive techniques" },
          { id: "d", text: "Because black box is limited to external targets" },
        ],
        correct: "b",
        explanation:
          "A real attacker has months; you have a week. Spending two days on discovery that a document would have covered in ten minutes is time not spent finding anything.",
        whyWrong: {
          a: "The same tester gets different results from the two approaches. It is about information, not skill.",
          c: "Permitted techniques come from the rules of engagement and are independent of how much information you were given.",
          d: "Black box can cover internal targets too. The distinction is what you were told, not where you stand.",
        },
      },
      {
        id: "csq34-3",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cs-w9-test-types",
        prompt:
          "An organisation with no detection capability commissions a red team exercise. What is the problem?",
        options: [
          { id: "a", text: "It will be too expensive" },
          {
            id: "b",
            text: "A red team tests whether defenders detect and respond, and there is nothing there to test",
          },
          { id: "c", text: "It requires a larger scope document" },
          { id: "d", text: "Red teams only work against cloud environments" },
        ],
        correct: "b",
        explanation:
          "The answer is known in advance: nobody noticed. The money would be better spent on a penetration test to find what is wrong, and on building the detection a red team could later evaluate.",
        whyWrong: {
          a: "Cost is real and secondary. Even free, it would answer a question they already know the answer to.",
          c: "Red team engagements often have looser scopes rather than larger documents.",
          d: "They are run against every kind of environment. The platform is not the issue.",
        },
      },
      {
        id: "csq34-4",
        type: "scenario",
        difficulty: 3,
        atomId: "a-cs-w9-do-no-harm",
        prompt:
          "You find a form that looks injectable, but confirming it would modify data. It is 15:00 on a working day. What do you do?",
        options: [
          { id: "a", text: "Confirm it properly; an unproven finding is not a finding" },
          {
            id: "b",
            text: "Confirm read-only, record it as confirmed-read-only, and note that a write was possible but not attempted",
          },
          { id: "c", text: "Wait until after hours and then confirm it with a write" },
          { id: "d", text: "Omit it, since you cannot prove it" },
        ],
        correct: "b",
        explanation:
          "A timing difference or an error message proves the vulnerability exists. The finding is just as real and nobody's data was altered, which is the outcome you are being paid for.",
        whyWrong: {
          a: "You are being paid to reduce risk. Modifying live data during business hours increases it.",
          c: "Out of hours is better and still modifies real data, and the rules of engagement would need to permit it explicitly.",
          d: "It is provable read-only. Omitting a real finding is the worst of the four.",
        },
      },
      {
        id: "csq34-5",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cs-w9-evidence",
        prompt:
          "Why record what you tested and found nothing, not just the findings?",
        options: [
          { id: "a", text: "To make the report longer" },
          {
            id: "b",
            text: "So you can say what was and was not examined, and so the client can correlate your activity with their own logs",
          },
          { id: "c", text: "Because clients pay by the hour" },
          { id: "d", text: "To justify the tools used" },
        ],
        correct: "b",
        explanation:
          "When a client asks whether you tested the reporting module and you cannot say, the honest answer is no. Your notes are also the only evidence of whether an outage during the window was you.",
        whyWrong: {
          a: "Length is not a virtue, and coverage records are usually an appendix rather than the body.",
          c: "Billing is unrelated to why coverage is documented.",
          d: "Tool justification is not something anybody asks for, and it is not what the notes are for.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "cs-l35-reconnaissance": {
    lessonId: "cs-l35-reconnaissance",
    passMark: 70,
    questions: [
      {
        id: "csq35-1",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cs-w9-passive-active",
        prompt: "Which of these is active reconnaissance?",
        options: [
          { id: "a", text: "A whois lookup on the target's domain" },
          { id: "b", text: "A port scan of the target's server" },
          { id: "c", text: "Searching certificate transparency logs" },
          { id: "d", text: "Reading the target's staff profiles on a public network" },
        ],
        correct: "b",
        explanation:
          "Active means packets reach the target and appear in their logs. The other three query third parties, which is why passive reconnaissance is both silent and legally uncomplicated.",
        whyWrong: {
          a: "whois queries a registry, not the target. Nothing reaches their systems.",
          c: "Certificate transparency is a public log maintained by others, queried without touching the target.",
          d: "Reading public profiles is ordinary use of a third-party site.",
        },
      },
      {
        id: "csq35-2",
        type: "mcq",
        difficulty: 3,
        atomId: "a-cs-w9-osint-sources",
        prompt:
          "Why do certificate transparency logs reveal subdomains nobody intended to publish?",
        options: [
          { id: "a", text: "Because search engines index them" },
          {
            id: "b",
            text: "Because every certificate issued for any subdomain is recorded in a public, searchable log by design",
          },
          { id: "c", text: "Because DNS zone transfers are usually enabled" },
          { id: "d", text: "Because certificates expire and are republished" },
        ],
        correct: "b",
        explanation:
          "The logs exist so that mis-issued certificates can be detected, and the side effect is that internal-admin.example.com becomes discoverable the moment somebody requests a certificate for it.",
        whyWrong: {
          a: "Indexing is a separate source. The logs are public and searchable independently.",
          c: "Open zone transfers are a real and now rare misconfiguration, and a different mechanism.",
          d: "Expiry does not cause publication. Issuance does, once, and it stays in the log.",
        },
      },
      {
        id: "csq35-3",
        type: "scenario",
        difficulty: 3,
        atomId: "a-cs-w9-osint-people",
        prompt:
          "Your scope covers a web application. You find an employee's credential in a public repository. What do you do?",
        options: [
          { id: "a", text: "Try it against the application, since that is what an attacker would do" },
          {
            id: "b",
            text: "Report it immediately without using it, and ask whether testing it is within scope",
          },
          { id: "c", text: "Note it for the final report and continue testing" },
          { id: "d", text: "Contact the employee directly to warn them" },
        ],
        correct: "b",
        explanation:
          "A live credential in a public repository is an active exposure needing same-day reporting, and whether you may use it is a scope question with an owner. Most rules of engagement have a clause for exactly this.",
        whyWrong: {
          a: "Authenticating as a real individual is not covered by a web application scope, and if it works their data and audit trail are affected.",
          c: "Right about not using it, wrong about timing. Holding it until Friday gives anyone else who finds it until Friday too.",
          d: "Well meant, and it goes around the client and contacts someone you have no relationship with. Findings go through the agreed channel.",
        },
      },
      {
        id: "csq35-4",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cs-w9-passive-recon",
        prompt: "What does a whois lookup tell you that a DNS lookup does not?",
        options: [
          { id: "a", text: "Which IP address the name resolves to" },
          {
            id: "b",
            text: "Who registered the domain, when, and often an administrative contact",
          },
          { id: "c", text: "Which services are running on the server" },
          { id: "d", text: "Whether the site uses HTTPS" },
        ],
        correct: "b",
        explanation:
          "whois queries the registry about ownership. DNS answers where the name points. The administrative contact is frequently the starting point for targeted mail, which is why privacy protection exists.",
        whyWrong: {
          a: "That is exactly what DNS gives you, and whois generally does not.",
          c: "Services require active enumeration. Neither lookup touches the host.",
          d: "Transport security is discovered by connecting, which is active.",
        },
      },
      {
        id: "csq35-5",
        type: "scenario",
        difficulty: 3,
        atomId: "a-cs-w9-recon-writeup",
        prompt:
          "You find staging-admin.example.com in a certificate transparency log. It is not linked from anywhere. Is that a finding before you connect to it?",
        options: [
          { id: "a", text: "No, not until you confirm it is reachable and vulnerable" },
          {
            id: "b",
            text: "Yes. An internal-sounding host being publicly discoverable is itself something the organisation almost certainly did not intend",
          },
          { id: "c", text: "No, because certificate logs are public and therefore expected" },
          { id: "d", text: "Only if it turns out to be an admin interface" },
        ],
        correct: "b",
        explanation:
          "Reconnaissance findings are often the most actionable in the whole report, because the fixes are cheap: take it out of DNS, or stop naming products in job adverts.",
        whyWrong: {
          a: "Reachability and vulnerability are the next questions in the next phase. The discoverability is already a fact worth reporting.",
          c: "The logs being public is why it is discoverable. That the organisation did not realise is the finding.",
          d: "What it turns out to be affects severity. The exposure exists regardless.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "cs-l36-enumeration-and-report": {
    lessonId: "cs-l36-enumeration-and-report",
    passMark: 70,
    questions: [
      {
        id: "csq36-1",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cs-w9-enumerate",
        prompt:
          "Why is a version scan more valuable than a plain port scan?",
        options: [
          { id: "a", text: "It is faster" },
          {
            id: "b",
            text: "A named version can be looked up against published vulnerabilities in under a minute",
          },
          { id: "c", text: "It is quieter in the target's logs" },
          { id: "d", text: "It covers more ports" },
        ],
        correct: "b",
        explanation:
          "An open port is an exposure. A version turns an inventory into findings, which is exactly what an attacker does with the same output.",
        whyWrong: {
          a: "Version detection is considerably slower, because it interrogates each service.",
          c: "It is noisier, not quieter, which matters when detection is being tested.",
          d: "Both scan the same ports unless told otherwise. The difference is the depth per port.",
        },
      },
      {
        id: "csq36-2",
        type: "scenario",
        difficulty: 3,
        atomId: "a-cs-w9-service-enum",
        prompt:
          "Enumeration shows MySQL 5.7.33 reachable on 3306 and PHP 7.4.3 behind the web server. Which is the more urgent finding?",
        options: [
          { id: "a", text: "PHP 7.4, because it reached end of life and receives no security updates" },
          { id: "b", text: "The reachable database port, because it should not be reachable at all" },
          { id: "c", text: "Neither, without a confirmed vulnerability" },
          { id: "d", text: "Both are equally urgent" },
        ],
        correct: "b",
        explanation:
          "The architectural finding outlives the vulnerability list. Patching PHP closes today's known issues; removing the exposure closes today's and tomorrow's.",
        whyWrong: {
          a: "A serious finding that should be reported, and it is a patching problem rather than a design one.",
          c: "Waiting for a confirmed exploit before reporting an exposed database means never reporting the thing that matters most.",
          d: "Severity is contextual and they are not equal. One is a missing update, the other is a design decision.",
        },
      },
      {
        id: "csq36-3",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cs-w9-report-structure",
        prompt: "Why does a penetration test report have both an executive summary and detailed findings?",
        options: [
          { id: "a", text: "To meet a page count" },
          {
            id: "b",
            text: "Because two audiences read one document and need different things from it",
          },
          { id: "c", text: "Because the summary is written by a different person" },
          { id: "d", text: "Because clients only pay for the summary" },
        ],
        correct: "b",
        explanation:
          "The director needs to know whether to worry and what to fund. The engineer needs the request that reproduces it. One document, two readers, which is why the structure is what it is.",
        whyWrong: {
          a: "Nobody specifies a page count, and padding a report is actively harmful.",
          c: "The same tester normally writes both, and writes the summary last.",
          d: "The detail is what makes fixes possible and is very much part of the deliverable.",
        },
      },
      {
        id: "csq36-4",
        type: "mcq",
        difficulty: 3,
        atomId: "a-cs-w9-exec-summary",
        prompt: "Why is counting findings a weak way to open an executive summary?",
        options: [
          { id: "a", text: "Because counts are hard to verify" },
          {
            id: "b",
            text: "Because fourteen medium findings on a test system matter less than one high finding on the customer portal, and a count invites the wrong comparison",
          },
          { id: "c", text: "Because severity ratings are subjective" },
          { id: "d", text: "Because directors dislike numbers" },
        ],
        correct: "b",
        explanation:
          "Severity is contextual, which is the whole of Week 10. A count encourages the reader to treat findings as interchangeable units, which they are not.",
        whyWrong: {
          a: "Counts are trivially verifiable from the findings section. Verifiability is not the issue.",
          c: "Ratings involve judgement, which is a reason to explain them rather than a reason to avoid counting.",
          d: "Directors are perfectly comfortable with numbers, and respond well to ones tied to business impact.",
        },
      },
      {
        id: "csq36-5",
        type: "scenario",
        difficulty: 3,
        atomId: "a-cs-w9-disclosure",
        prompt:
          "Ninety days after you reported a flaw, the vendor has gone silent. Their product runs in hospitals. What is the right move?",
        options: [
          { id: "a", text: "Publish full technical details, since the deadline passed" },
          {
            id: "b",
            text: "Escalate to a national CERT and publish enough for users to protect themselves, without a working exploit",
          },
          { id: "c", text: "Stay silent, because publishing could endanger patients" },
          { id: "d", text: "Sell the details to a broker to pressure the vendor" },
        ],
        correct: "b",
        explanation:
          "Impact on third parties should shift your timeline. A coordination body can reach an unresponsive vendor and notify affected users, and publishing without the exploit gives hospitals time to act.",
        whyWrong: {
          a: "The deadline makes publication defensible; it does not make exploit details the right content. The harm lands on patients rather than the vendor.",
          c: "Silence leaves the vulnerability in place with nobody able to mitigate it, while attackers who find it independently face no restraint.",
          d: "That puts a working attack against hospital systems into a market, which is the opposite of disclosure.",
        },
      },
    ],
  },
};

export default ASSESSMENTS;
