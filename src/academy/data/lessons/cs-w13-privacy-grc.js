/**
 * CYBERSECURITY · WEEK 13 · PRIVACY, GOVERNANCE, RISK & COMPLIANCE
 *
 * Harvard anchor: CS50 Cybersecurity, "Preserving Privacy". The fifth pillar,
 * extended into organisational governance.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 *
 * ON THE LAW IN THIS WEEK: the obligations described are the broad shape that
 * the NDPA in Nigeria, GDPR in Europe and comparable regimes elsewhere share.
 * Specific deadlines, thresholds and definitions vary by jurisdiction and are
 * amended. Nothing here is legal advice, and the lessons say so where it
 * matters, because a practitioner who quotes a deadline from memory to a
 * regulator is a practitioner in difficulty.
 */

export const SECTION_ID = "cs-s13-privacy-grc";

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 1
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "cs-l49-privacy",
    moduleId: "cs-w13-privacy-grc",
    sectionId: SECTION_ID,
    order: 1,
    title: "Privacy Is Not Security",
    subtitle: "Two different questions about the same data",
    estimatedMinutes: 11,
    intro:
      "A system can be perfectly secure and appalling for privacy. Security asks whether unauthorised people can reach the data. Privacy asks whether you should have collected it at all, and what the authorised people are permitted to do with it.",

    atoms: [
      {
        id: "a-cs-priv-not-security",
        title: "The difference, stated plainly",
        explain:
          "Security protects data from people who should not have it. Privacy governs what is collected, why, for how long, and what the people who legitimately hold it may do. A company that encrypts everything and then sells it has excellent security and no privacy.",
        why: "It changes what you look for in a review. A security review asks who can reach this. A privacy review asks why this field exists, who decided, and what happens to it in three years. Both are needed and neither substitutes.",
        table: {
          caption: "The same system, two reviews.",
          headers: ["Question", "Security", "Privacy"],
          rows: [
            ["Can an outsider read it?", "Yes, this is the question", "Assumed handled"],
            ["Should we have collected it?", "Not asked", "Yes, this is the question"],
            ["Who inside can see it?", "Access control", "Purpose limitation"],
            ["How long do we keep it?", "Rarely asked", "Central"],
            ["Can the person see or delete it?", "Not asked", "A legal right in most jurisdictions"],
          ],
        },
      },
      {
        id: "a-cs-priv-tracking",
        title: "How tracking actually works",
        explain:
          "A first-party cookie is set by the site you are on. A third-party cookie is set by something embedded in it, which is present on thousands of other sites too, so it can build a picture of your movement across all of them. Pixels, embedded scripts and share buttons all do the same job.",
        why: "It explains why the same advert follows you, and it explains the regulatory attention. The mechanism is not surveillance software on your machine. It is that dozens of sites each embed the same handful of third parties.",
        mistake:
          "Thinking a cookie banner solves it. Most banners record a consent decision and change nothing about what is loaded, and in several jurisdictions a banner that makes rejection harder than acceptance is itself non-compliant.",
      },
      {
        id: "a-cs-priv-fingerprinting",
        title: "Fingerprinting, where blocking cookies does not help",
        explain:
          "Your browser reveals a great deal in the ordinary course of loading a page: screen size, timezone, installed fonts, language, graphics rendering behaviour. Combined, these are often unique enough to identify a specific device with no cookie at all.",
        why: "It is the reason privacy tooling moved from blocking cookies to reducing distinctiveness. It is also why a browser that advertises how private it is can make you more identifiable, if very few people use it.",
        analogy:
          "Refusing to give your name at a shop, while being the only person in town with that exact coat, gait and accent.",
      },
      {
        id: "a-cs-priv-metadata",
        title: "Metadata is usually worse than content",
        explain:
          "Who contacted whom, when, from where, how often, for how long. No message contents at all. It is structured, it is cheap to analyse at scale, and it frequently reveals more than the contents would.",
        why: "It is also far less protected, legally and technically. Encrypted messaging protects the contents; the pattern of who you message at 2am is still visible, and the pattern is often the sensitive part.",
        decision: {
          scenario:
            "A product manager proposes logging every message's sender, recipient and timestamp for analytics, while pointing out that no message content will ever be stored.",
          question: "What is your assessment?",
          options: [
            {
              id: "a",
              text: "It is fine. Without content there is no privacy concern",
              whyWrong:
                "Metadata reveals relationships, routines and locations. Knowing that a user messaged an oncology clinic three times this week, and their employer's HR line twice, is deeply sensitive without a single word of content.",
            },
            {
              id: "b",
              text: "Treat it as sensitive personal data: state a purpose, minimise the fields, set a retention period, and restrict who can query it",
              why: "It applies the same discipline to metadata as to content, which is what the sensitivity warrants. Purpose, minimisation and retention are the three questions that make the difference between analytics and a surveillance dataset.",
            },
            {
              id: "c",
              text: "Allow it but anonymise the user identifiers",
              whyWrong:
                "Communication graphs are notoriously easy to re-identify: a pattern of who talks to whom is itself close to unique. Anonymisation that does not survive a graph analysis is pseudonymisation, and it is still personal data.",
            },
            {
              id: "d",
              text: "Refuse. Analytics never justifies collecting communication metadata",
              whyWrong:
                "Some of it is genuinely needed to run a messaging product at all, such as delivery and abuse prevention. A blanket refusal gets the security function excluded from the design, which is where these decisions are actually made.",
            },
          ],
          correct: "b",
          aftermath:
            "Purpose, minimisation and retention are the three questions that turn a vague privacy concern into a specific, answerable design requirement.",
        },
      },
      {
        id: "a-cs-priv-minimisation",
        title: "Data minimisation is a security control",
        explain:
          "The most reliable way to protect a piece of data is not to have it. Data you did not collect cannot leak, cannot be subpoenaed, cannot be misused by an employee and does not need protecting for the next seven years.",
        why: "It reframes privacy as something that reduces your own risk rather than as a constraint imposed on you. Every field you delete is a field that cannot appear in an incident report, and the argument works with engineers in a way that compliance language does not.",
        example:
          "A delivery app's sign-up form:\n\n  Needed          phone number, delivery address\n  Collected too   date of birth, gender, occupation, marital status\n\nNone of the second row is used by anything. All of it is in the\nbreach when there is one, all of it is in the subject access request,\nand all of it has to be protected for as long as it is kept.",
        practice: {
          prompt:
            "An engineer argues that collecting extra fields now is sensible because they might be useful later. What is the counter-argument?",
          answer:
            "Data with no current purpose has cost and no benefit. It has to be secured, retained, disclosed on request and reported when breached, all before anybody has used it for anything. In most jurisdictions collecting without a stated purpose is also unlawful, and \"we might want it later\" is not a purpose.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 2
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "cs-l50-data-protection-law",
    moduleId: "cs-w13-privacy-grc",
    sectionId: SECTION_ID,
    order: 2,
    title: "Data Protection Law, in Outline",
    subtitle: "The shape most regimes share",
    estimatedMinutes: 11,
    intro:
      "You are not going to be the lawyer. You are going to be the person who spots, during a design review, that something is about to become a legal problem. This lesson is enough to do that, and explicitly not enough to advise anybody.",

    atoms: [
      {
        id: "a-cs-priv-principles",
        title: "The principles almost every regime shares",
        explain:
          "A lawful basis for processing. A specific purpose, stated before collection. Only the data needed for that purpose. Accurate and kept up to date. Kept no longer than necessary. Secured. And someone accountable for all of it.",
        why: "Once you know these, most privacy problems become recognisable in a design meeting. Almost every one is a failure of purpose or of retention, and both are visible in a schema long before anybody writes code.",
        table: {
          caption: "The principles, and what breaking each looks like.",
          headers: ["Principle", "Broken looks like"],
          rows: [
            ["Lawful basis", "Collecting because the form had space"],
            ["Purpose limitation", "Using support tickets to train a sales model"],
            ["Data minimisation", "Date of birth on a newsletter sign-up"],
            ["Accuracy", "No way for a customer to correct their address"],
            ["Storage limitation", "Records from 2011 still in the live database"],
            ["Integrity and confidentiality", "The whole of this course so far"],
            ["Accountability", "Nobody can say who decided to collect this"],
          ],
        },
      },
      {
        id: "a-cs-priv-regimes",
        title: "NDPA, GDPR and the others",
        explain:
          "Nigeria's Data Protection Act 2023 establishes the Nigeria Data Protection Commission and a regime broadly aligned with international practice. GDPR covers the EU and anybody processing EU residents' data. Many other countries have adopted similar structures.",
        why: "The shared shape means that designing to one of them gets you most of the way to the others. The differences that bite are in the details, which is exactly why the rule is to check rather than to remember.",
        table: {
          caption: "Common structure. Verify specifics against the current text.",
          headers: ["Concept", "What it means"],
          rows: [
            ["Data subject", "The person the data is about"],
            ["Controller", "Decides why and how data is processed. Carries most obligations"],
            ["Processor", "Processes on the controller's instructions. A vendor, usually"],
            ["Personal data", "Anything relating to an identifiable person. Broader than people expect"],
            ["Sensitive categories", "Health, biometrics, beliefs and similar. Higher bar"],
            ["Cross-border transfer", "Moving data abroad. Usually restricted, always worth checking"],
          ],
        },
        mistake:
          "Quoting a specific deadline or threshold from memory. They differ by regime and they are amended. Say \"there is a short statutory deadline and legal will confirm it\", then let legal confirm it.",
      },
      {
        id: "a-cs-priv-rights",
        title: "The rights people have, and what they cost you",
        explain:
          "Broadly: to know what you hold, to get a copy, to have errors corrected, to have data deleted in some circumstances, to object to some processing, and to take their data elsewhere.",
        why: "Each right has an engineering consequence that is cheap at design time and brutal afterwards. \"Delete everything about this person\" is straightforward if you know where the data is, and close to impossible if it has been copied into six systems and a warehouse over four years.",
        example:
          "A deletion request, in a system nobody designed for it:\n\n  the user record           easy\n  their orders              retained for tax. Legitimate, but say so\n  the analytics warehouse   copied nightly for four years\n  the support system        a different vendor\n  the email platform        a different vendor again\n  last year's backups       nobody knows\n\nEvery one of these is a conversation you have while a deadline runs.",
      },
      {
        id: "a-cs-priv-dpia",
        title: "Assessing the impact before you build",
        explain:
          "Where processing is likely to be high risk to people, most regimes require a documented assessment before it starts. What data, why, what could go wrong for the individuals, and what reduces it. Large-scale profiling, sensitive categories and systematic monitoring are the usual triggers.",
        why: "It is the only formal mechanism that forces the privacy conversation before the system exists, which is the only point at which changing it is cheap. Treated as a form to complete afterwards, it is worthless.",
        decision: {
          scenario:
            "A team is two weeks from launching a feature that scores customers for fraud risk using their transaction history, location and device. Nobody has done an impact assessment. The launch date is committed.",
          question: "What do you advise?",
          options: [
            {
              id: "a",
              text: "Launch as planned and complete the assessment afterwards, since the date is committed",
              whyWrong:
                "The assessment exists to change the design, and after launch it can only document it. It is also likely to be a legal requirement before processing begins, so completing it afterwards does not satisfy it.",
            },
            {
              id: "b",
              text: "Run a focused assessment now, in days rather than weeks, and be explicit that a launch without it carries both regulatory and design risk",
              why: "It respects the constraint and does not pretend the obligation away. Most of these can be done in two or three sessions, and they routinely surface something that is cheaper to change now than later.",
            },
            {
              id: "c",
              text: "Block the launch until a full assessment is complete",
              whyWrong:
                "Sometimes the right answer for genuinely high-risk processing, and as a first move it turns a solvable scheduling problem into a confrontation. It also assumes the assessment must take weeks, which it usually need not.",
            },
            {
              id: "d",
              text: "Accept the risk formally and record it",
              whyWrong:
                "Risk acceptance covers risks you have assessed. You cannot accept a risk nobody has characterised, and a statutory requirement is generally not the organisation's to accept.",
            },
          ],
          correct: "b",
          aftermath:
            "Automated decisions affecting people, which is what a fraud score is, attract specific obligations in most regimes, including a right to explanation. That is exactly the kind of thing a two-day assessment surfaces and a launched system cannot easily fix.",
        },
      },
      {
        id: "a-cs-priv-retention",
        title: "Retention, and why nobody does it",
        explain:
          "A retention schedule says how long each category of data is kept and what happens then. It is unglamorous, it requires agreement from every part of the business, and it is the single most effective privacy control there is.",
        why: "Nobody does it because deleting data feels like losing something and keeping it feels free. It is not free. Every year of extra retention is a year of that data appearing in breaches, subject access requests and litigation.",
        mistake:
          "Writing the schedule and never implementing the deletion. A documented policy that nothing enforces is worse than none, because it is now evidence that you knew what you should have been doing.",
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 3
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "cs-l51-governance",
    moduleId: "cs-w13-privacy-grc",
    sectionId: SECTION_ID,
    order: 3,
    title: "Governance and Frameworks",
    subtitle: "How an organisation decides what it is doing",
    estimatedMinutes: 11,
    intro:
      "Governance is the least popular word in security and it answers the question that decides everything else: who is responsible, on what authority, measured how. This lesson is that machinery, and the ways it goes wrong.",

    atoms: [
      {
        id: "a-cs-grc-governance",
        title: "What governance actually is",
        explain:
          "The structure that decides what the organisation will do about risk: who owns which risks, who can accept them, who sets policy, and how anybody knows whether it is working. Not documents. Documents are the output.",
        why: "Every technical recommendation you make eventually hits this. An unowned risk does not get fixed, an unfunded control does not get built, and a policy nobody can enforce is a document. Knowing the machinery is how you get things done.",
        mistake:
          "Judging a security programme by the length of its policy set. Ask instead who owns the top five risks, when they last reviewed them, and what they did. The answers take five minutes and tell you far more.",
      },
      {
        id: "a-cs-grc-frameworks",
        title: "The frameworks, and what each is for",
        explain:
          "NIST CSF organises the field into functions and is good for structuring a conversation with leadership. ISO 27001 is a certifiable management system. CIS Controls is a prioritised, concrete list of things to do. PCI DSS is mandatory if you handle card data.",
        why: "They answer different questions, and organisations regularly adopt the wrong one. A thirty-person company that needs to know what to do first wants CIS Controls, not an ISO 27001 certification project.",
        table: {
          caption: "Four frameworks, honestly compared.",
          headers: ["Framework", "Answers", "Good for", "Cost"],
          rows: [
            ["NIST CSF", "How do we structure our programme?", "Talking to leadership", "Low. It is free"],
            ["ISO 27001", "Can we prove we manage security?", "Winning enterprise contracts", "High. Certification and audit"],
            ["CIS Controls", "What do we do first?", "Small teams needing a plan", "Low"],
            ["PCI DSS", "Are we allowed to take cards?", "Anyone handling card data", "Mandatory, not optional"],
          ],
        },
      },
      {
        id: "a-cs-grc-policy-hierarchy",
        title: "Policy, standard, procedure",
        explain:
          "A policy states what must be true and why, approved at a senior level, changing rarely. A standard states the specific requirement: minimum lengths, permitted algorithms, required settings. A procedure states how to do it, step by step.",
        why: "Collapsing them is why policy documents become unreadable and unenforceable. A policy that names a specific product needs board approval every time the product changes, which means it will not change, which means it becomes wrong and then ignored.",
        example:
          "  Policy     Access to systems holding customer data must be\n             authenticated and authorised, and reviewed quarterly.\n\n  Standard   Multi-factor authentication is required. Phishing-resistant\n             factors are required for administrative accounts.\n\n  Procedure  How to enrol a security key, in eight steps with screenshots.\n\nThe policy survives a decade. The standard changes yearly.\nThe procedure changes whenever the interface does.",
      },
      {
        id: "a-cs-grc-compliance-not-security",
        title: "Compliance is not security",
        explain:
          "Compliance asks whether you meet a defined set of requirements, assessed at a point in time, usually against a document. Security asks whether an attacker can achieve their goal. Organisations pass audits and get breached in the same quarter, routinely.",
        why: "It matters because compliance has the budget and the deadline, so it drives behaviour. A practitioner who understands the gap can use the compliance programme to fund real security rather than treating it as a distraction.",
        decision: {
          scenario:
            "Your organisation passed its ISO 27001 audit last month. A director asks whether that means the company is secure.",
          question: "What do you say?",
          options: [
            {
              id: "a",
              text: "Yes. The certification demonstrates that security is properly managed",
              whyWrong:
                "It demonstrates that a management system exists and was operating at the time of assessment. Organisations pass audits and get breached in the same quarter, and agreeing here means nobody funds anything further this year.",
            },
            {
              id: "b",
              text: "It shows we manage security in a structured, audited way, which is genuinely valuable. It does not test whether a real attacker could get in, and those are different questions",
              why: "It gives the certification its actual credit and names precisely what it does not cover. That distinction is what justifies continuing to fund testing and detection after the certificate arrives.",
            },
            {
              id: "c",
              text: "No. Certifications are box-ticking exercises",
              whyWrong:
                "Dismissive and inaccurate. A working management system genuinely reduces risk, and the organisation just spent real money on it. This answer makes you sound as though you cannot be pleased.",
            },
            {
              id: "d",
              text: "Yes for the scope that was audited, and the scope was probably narrow",
              whyWrong:
                "Scope is a real and important caveat, and \"probably narrow\" is a guess presented as a fact. Check the scope statement and say what it actually covers.",
            },
          ],
          correct: "b",
          aftermath:
            "The most useful sentence in this whole area: \"that is what it tells us, and this is what it does not.\" It works for certifications, scans, penetration tests and every other assurance activity.",
        },
      },
      {
        id: "a-cs-grc-third-party",
        title: "Third-party risk",
        explain:
          "Your suppliers hold your data and connect to your systems. Their security is your risk, and you cannot audit it directly. What you can do is assess before contracting, put obligations in the contract, and limit what the integration can reach.",
        why: "A large share of significant breaches arrive through a supplier. The contractual half matters more than practitioners expect: a breach notification clause is what lets you meet your own deadline when it is their breach.",
        table: {
          caption: "Three controls, and which risk each one addresses.",
          headers: ["Control", "Addresses"],
          rows: [
            ["Assessment before contracting", "Choosing a supplier who is obviously weak"],
            ["Contractual obligations", "What happens when it goes wrong, and how fast you hear"],
            ["Limiting the integration's access", "How much a supplier compromise costs you"],
            ["Reviewing access when the contract ends", "The credential nobody revoked in 2022"],
          ],
          note: "The third is the one you control entirely, and the one most often skipped. A supplier integration that can read your whole customer table is a decision you made, not one they imposed.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 4
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "cs-l52-risk-management",
    moduleId: "cs-w13-privacy-grc",
    sectionId: SECTION_ID,
    order: 4,
    title: "Risk Management",
    subtitle: "Turning findings into decisions somebody owns",
    estimatedMinutes: 13,
    intro:
      "Everything in this course so far produces findings. Risk management is how findings become decisions with names and dates on them, which is the only mechanism by which anything actually changes.",

    atoms: [
      {
        id: "a-cs-grc-assessment",
        title: "The process, stripped down",
        explain:
          "Identify what you have that matters. Identify what could go wrong with it. Estimate how likely and how bad. Decide what to do. Record who decided and when to look again. That is the whole of it.",
        why: "Every risk methodology you will meet is a more elaborate version of those five steps, and the elaboration frequently obscures them. When a risk process becomes unmanageable, the way back is to those five questions.",
        mistake:
          "Starting from threats rather than assets. It produces an endless list of things that could happen and no way to rank them, because nothing is anchored to what the organisation would actually lose.",
      },
      {
        id: "a-cs-grc-risk-register",
        title: "Practice: rank a supplier assessment",
        explain:
          "Your organisation is integrating with a payments supplier. A security assessment of that supplier produced five findings, each with a technical score. Rank them by the risk they carry for YOUR organisation.",
        why: "The scores were produced by a tool looking at their systems. The risk belongs to you, and it depends on what the integration touches and what your own obligations are. This is the Week 10 judgement applied to somebody else's estate.",
        riskExercise: {
          brief:
            "Five findings from a supplier security assessment. Rank each by the risk it creates for your organisation, then compare your order with the assessment's own scores.",
          findings: [
            {
              id: "v-admin-nomfa",
              title: "Supplier's administrative portal has no multi-factor authentication",
              cvss: 8.1,
              exposure: "Internet-facing, used by around forty of their staff",
              dataAtRisk: "Our customers' payment records, held by them",
              expected: "critical",
              why: "Forty accounts protected by a password alone, on an internet-facing portal, holding your customers' payment data. One phished supplier employee is a breach you have to notify, and you have no visibility into whether it has already happened.",
            },
            {
              id: "v-broad-api",
              title: "The integration account can query our entire customer table",
              cvss: 6.8,
              exposure: "Through the integration API, from their infrastructure",
              dataAtRisk: "Every customer record we hold, not just the payment fields",
              expected: "critical",
              why: "This is the finding you control entirely and the one most often skipped. The integration needs four fields and can read forty. Any compromise on their side becomes a full customer database breach on yours, and narrowing the permission is a day of work.",
            },
            {
              id: "v-no-notify-clause",
              title: "The contract has no breach notification clause",
              cvss: 5.0,
              exposure: "Contractual",
              dataAtRisk: "Your own ability to meet a statutory notification deadline",
              expected: "high",
              why: "If they are breached, you have an obligation and no mechanism to hear about it in time. The score is low because it is not a technical vulnerability, and it directly determines whether you can meet a legal deadline that is not negotiable.",
            },
            {
              id: "v-old-tls",
              title: "TLS 1.0 still accepted on the supplier's marketing website",
              cvss: 7.5,
              exposure: "Internet-facing, marketing content only",
              dataAtRisk: "None. No login, no customer data, no integration",
              expected: "low",
              why: "A legitimate finding on a system with nothing behind it. Worth raising with them and irrelevant to your integration, which does not touch this host. Reporting it near the top would tell them your ranking is automated.",
            },
            {
              id: "v-headers",
              title: "Missing security headers on the supplier's status page",
              cvss: 4.3,
              exposure: "Internet-facing status page",
              dataAtRisk: "None",
              expected: "low",
              why: "Cheap to fix and carries no risk to you whatsoever. It belongs in the report because it was found, and it belongs at the bottom.",
            },
          ],
          successMessage:
            "That is the order you would take into a contract negotiation. Note that the two findings at the top are the two with the lowest and second-lowest technical scores among the internet-facing ones, and that one of them is not technical at all.",
        },
        mistake:
          "Treating a supplier's assessment score as your risk. Their vulnerability is your risk only to the extent that your data is behind it, which is a question their scanner cannot answer.",
      },
      {
        id: "a-cs-grc-treatment",
        title: "The four treatments",
        explain:
          "Avoid, by not doing the thing. Reduce, by adding a control. Transfer, through insurance or a contractual obligation. Accept, deliberately and in writing. Every risk gets exactly one of these, and every one of them is a legitimate answer.",
        why: "Practitioners tend to reach for reduce every time, because it is the technical option. Transfer is the right answer more often than security people like, and avoid is frequently the cheapest answer nobody considered.",
        table: {
          caption: "The same supplier risk, four treatments.",
          headers: ["Treatment", "In this case"],
          rows: [
            ["Avoid", "Do not send them the data at all. Tokenise it instead"],
            ["Reduce", "Narrow the integration account to the four fields it needs"],
            ["Transfer", "A contractual breach notification clause and indemnity"],
            ["Accept", "Documented by a named owner, with a review date"],
          ],
          note: "The best answer here uses three of the four at once, which is usual. They are not alternatives so much as a set to combine.",
        },
      },
      {
        id: "a-cs-grc-appetite",
        title: "Risk appetite",
        explain:
          "How much risk the organisation is willing to carry, stated by leadership in advance. It is what makes an acceptance decision a policy application rather than an argument, and it is why the same finding is accepted at one company and blocks a release at another.",
        why: "Without a stated appetite, every risk decision is negotiated individually by whoever is in the room, and the outcome depends on who is most senior that day rather than on anything the organisation decided.",
        decision: {
          scenario:
            "A startup's leadership say their risk appetite is high because they need to move fast. A proposed feature would store customers' national ID numbers unencrypted to simplify a lookup.",
          question: "Does high risk appetite settle it?",
          options: [
            {
              id: "a",
              text: "Yes. Leadership has set the appetite and this is their decision to make",
              whyWrong:
                "Appetite covers risks the organisation is entitled to take. It does not cover legal obligations, which are not theirs to accept, and identity numbers stored in the clear are likely to breach the applicable data protection regime outright.",
            },
            {
              id: "b",
              text: "No. Appetite governs business risk, not legal obligations, and this is likely unlawful regardless of how fast they want to move",
              why: "It respects their authority over the risks that are theirs and is clear about where that authority ends. It also gives them something actionable: the feature can ship if the lookup is redesigned.",
            },
            {
              id: "c",
              text: "No. National ID numbers should always be encrypted, whatever the appetite",
              whyWrong:
                "The conclusion is right and the reasoning is an assertion. \"Always\" invites an argument about exceptions, whereas the legal obligation ends the conversation and cannot be overruled internally.",
            },
            {
              id: "d",
              text: "Yes, provided the decision is recorded with a named owner",
              whyWrong:
                "Recording an unlawful decision documents it rather than legitimising it, and it arguably makes things worse by evidencing that the organisation knew.",
            },
          ],
          correct: "b",
          aftermath:
            "Know the boundary of what leadership may accept. Inside it, their call and your job is to inform it. Outside it, no appetite statement helps, and saying so early is far cheaper than saying it later.",
        },
      },
      {
        id: "a-cs-grc-metrics",
        title: "Measuring a security programme",
        explain:
          "The useful measures are about outcomes and speed rather than activity. How long from a vulnerability being published to it being patched. How long from an alert to a decision. What proportion of privileged accounts have phishing-resistant authentication. What proportion of assets are actually in the inventory.",
        why: "Activity metrics can all be improved by doing more of something useless. Blocked attacks, alerts generated and training completions all sound impressive and can rise while the organisation gets less safe.",
        table: {
          caption: "Two kinds of metric.",
          headers: ["Sounds good", "Actually tells you something"],
          rows: [
            ["Attacks blocked this month", "Median time to patch a critical vulnerability"],
            ["Alerts generated", "Median time from alert to triage decision"],
            ["Staff trained", "Proportion who report a simulated phish, not who fall for one"],
            ["Policies published", "Proportion of privileged accounts with phishing-resistant MFA"],
            ["Vulnerabilities found", "Proportion of assets appearing in the inventory at all"],
          ],
          note: "The reporting rate is a better phishing measure than the click rate, because a workforce that reports gives the response team the one thing it needs: time.",
        },
      },
    ],

    task: {
      title: "This week's lab",
      intro:
        "Assess an organisation rather than a machine. Use a real one you know, or a fictional one you describe fully.",
      prompts: [
        "Inventory the data the organisation holds: category, why it is held, where it lives, who can reach it, and how long it is kept. The last two columns will be the hardest and are the point.",
        "Map that inventory against the principles from lesson two and mark every place the organisation cannot currently answer the question.",
        "Pick a framework appropriate to the organisation's size and do a gap assessment against it. Justify the framework choice in one paragraph.",
        "Build a risk register: at least eight risks with likelihood, impact, a proposed treatment, a named owner and a review date.",
        "Write a prioritised control roadmap: what to do in the next month, the next quarter and the next year, with rough effort for each.",
        "Add one page on privacy specifically: what could be collected less of, what could be deleted today, and what the organisation would do if it received a deletion request tomorrow.",
      ],
      closing:
        "That last page is usually the most uncomfortable and the most valuable. Most organisations discover they cannot answer a deletion request, and finding that out during an exercise is much better than finding out during a statutory deadline.",
    },

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
