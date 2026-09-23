/**
 * ASSESSMENTS · CYBERSECURITY · WEEK 13 · PRIVACY, GOVERNANCE, RISK
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Never import this from anything under src/.
 * ═════════════════════════════════════════════════════════════════════════
 */

export const ASSESSMENTS = {
  /* ═══════════════════════════════════════════════════════════════════ */
  "cs-l49-privacy": {
    lessonId: "cs-l49-privacy",
    passMark: 70,
    questions: [
      {
        id: "csq49-1",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cs-priv-not-security",
        prompt:
          "A company encrypts all customer data at rest and in transit, and sells it to advertisers. What does that demonstrate?",
        options: [
          { id: "a", text: "Good security and good privacy" },
          { id: "b", text: "Good security and no privacy" },
          { id: "c", text: "Poor security" },
          { id: "d", text: "That encryption is ineffective" },
        ],
        correct: "b",
        explanation:
          "Security protects data from people who should not have it. Privacy governs what the people who legitimately hold it may do with it. The two are separate questions and neither substitutes.",
        whyWrong: {
          a: "Selling data without a lawful basis and a stated purpose is a privacy failure regardless of how well it was encrypted on the way.",
          c: "The security is genuinely good. That is what makes this a useful illustration.",
          d: "Encryption did exactly what it does. It has no view on what the holder chooses to do next.",
        },
      },
      {
        id: "csq49-2",
        type: "scenario",
        difficulty: 3,
        atomId: "a-cs-priv-metadata",
        prompt:
          "A team proposes logging every message's sender, recipient and timestamp, storing no content. What is your assessment?",
        options: [
          { id: "a", text: "Fine. Without content there is no privacy concern" },
          {
            id: "b",
            text: "Treat it as sensitive: state a purpose, minimise the fields, set a retention period and restrict who can query it",
          },
          { id: "c", text: "Allow it with anonymised identifiers" },
          { id: "d", text: "Refuse; analytics never justifies communication metadata" },
        ],
        correct: "b",
        explanation:
          "Knowing that a user messaged an oncology clinic three times this week and their employer's HR line twice is deeply sensitive without a single word of content.",
        whyWrong: {
          a: "Metadata reveals relationships, routines and locations, and is often more revealing than content.",
          c: "Communication graphs are notoriously easy to re-identify. That is pseudonymisation, and it remains personal data.",
          d: "Some is genuinely needed to run a messaging product, and a blanket refusal gets security excluded from the design.",
        },
      },
      {
        id: "csq49-3",
        type: "mcq",
        difficulty: 3,
        atomId: "a-cs-priv-fingerprinting",
        prompt: "Why does blocking cookies not prevent fingerprinting?",
        options: [
          { id: "a", text: "Because fingerprints are stored in a different cookie" },
          {
            id: "b",
            text: "Because the identifying signal comes from what the browser reveals in the ordinary course of loading a page",
          },
          { id: "c", text: "Because fingerprinting requires JavaScript to be disabled" },
          { id: "d", text: "Because it only works on mobile devices" },
        ],
        correct: "b",
        explanation:
          "Screen size, timezone, fonts, language and rendering behaviour combine into something often unique. Nothing was stored, so there is nothing to clear.",
        whyWrong: {
          a: "No cookie is involved at all, which is the entire point of the technique.",
          c: "Script makes it richer. Disabling script reduces it and also makes the browser more distinctive.",
          d: "It works on every platform, and desktop browsers are usually more distinctive than mobile ones.",
        },
      },
      {
        id: "csq49-4",
        type: "scenario",
        difficulty: 2,
        atomId: "a-cs-priv-minimisation",
        prompt:
          "An engineer wants to collect extra fields now because they might be useful later. What is the counter-argument?",
        options: [
          { id: "a", text: "Storage costs money" },
          {
            id: "b",
            text: "Data with no current purpose must still be secured, retained, disclosed on request and reported when breached, before anybody has used it",
          },
          { id: "c", text: "Users will not fill in a long form" },
          { id: "d", text: "The database schema will be harder to change" },
        ],
        correct: "b",
        explanation:
          "Every field you do not collect cannot leak, be subpoenaed or be misused. In most jurisdictions collecting without a stated purpose is also unlawful, and \"we might want it later\" is not a purpose.",
        whyWrong: {
          a: "Storage is nearly free, which is why this argument loses. The costs are risk and obligation.",
          c: "Form abandonment is a product concern that happens to align, and it is not the privacy argument.",
          d: "Schema flexibility is an engineering matter unrelated to the risk.",
        },
      },
      {
        id: "csq49-5",
        type: "truefalse",
        difficulty: 2,
        atomId: "a-cs-priv-tracking",
        prompt: "A cookie banner means a site is handling tracking lawfully.",
        options: [
          { id: "a", text: "True" },
          { id: "b", text: "False" },
        ],
        correct: "b",
        explanation:
          "False. Most banners record a consent decision and change nothing about what is loaded, and in several jurisdictions a banner making rejection harder than acceptance is itself non-compliant.",
        whyWrong: {
          a: "The banner is the visible part. Whether trackers load before consent, and whether refusing is as easy as accepting, is what actually decides it.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "cs-l50-data-protection-law": {
    lessonId: "cs-l50-data-protection-law",
    passMark: 70,
    questions: [
      {
        id: "csq50-1",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cs-priv-principles",
        prompt:
          "A company uses support ticket contents to train a sales model. Which principle does that breach?",
        options: [
          { id: "a", text: "Data minimisation" },
          { id: "b", text: "Purpose limitation" },
          { id: "c", text: "Storage limitation" },
          { id: "d", text: "Accuracy" },
        ],
        correct: "b",
        explanation:
          "The data was collected to provide support. Using it for a different purpose requires either a lawful basis for that purpose or fresh consent, and the original statement of purpose is what is being exceeded.",
        whyWrong: {
          a: "Minimisation concerns whether the data should have been collected. Collecting a support ticket to provide support is proportionate.",
          c: "Storage limitation concerns how long it is kept, which is a separate question.",
          d: "Accuracy concerns whether the data is correct and up to date.",
        },
      },
      {
        id: "csq50-2",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cs-priv-regimes",
        prompt: "What is the difference between a controller and a processor?",
        options: [
          { id: "a", text: "Controllers are larger organisations" },
          { id: "b", text: "The controller decides why and how data is processed; the processor acts on their instructions" },
          { id: "c", text: "Processors handle sensitive data and controllers do not" },
          { id: "d", text: "The terms are interchangeable" },
        ],
        correct: "b",
        explanation:
          "The controller carries most of the obligations and the processor is usually a vendor. Knowing which you are in any given relationship decides who must do what.",
        whyWrong: {
          a: "Size is irrelevant. A one-person company deciding why data is processed is a controller.",
          c: "Either may handle sensitive data, and the distinction is about who decides rather than what is handled.",
          d: "They are legally distinct with different obligations, which is why contracts name them explicitly.",
        },
      },
      {
        id: "csq50-3",
        type: "scenario",
        difficulty: 3,
        atomId: "a-cs-priv-rights",
        prompt:
          "A deletion request arrives for a customer whose data has been copied to an analytics warehouse, a support vendor and an email platform. What does that reveal?",
        options: [
          { id: "a", text: "That the request cannot be complied with" },
          {
            id: "b",
            text: "That the right is cheap to honour if designed for and close to impossible if the data was copied without tracking where",
          },
          { id: "c", text: "That analytics warehouses are exempt" },
          { id: "d", text: "That vendors are responsible for their own copies" },
        ],
        correct: "b",
        explanation:
          "Every right has an engineering consequence that is cheap at design time and brutal afterwards. Each of those copies is now a conversation held while a deadline runs.",
        whyWrong: {
          a: "It can be complied with; it is simply expensive and slow. Declaring it impossible is not an option available to the controller.",
          c: "No such exemption exists. A copy of personal data is personal data.",
          d: "As a processor acting on your instructions, the obligation flows through your contract with them. It remains yours.",
        },
      },
      {
        id: "csq50-4",
        type: "scenario",
        difficulty: 3,
        atomId: "a-cs-priv-dpia",
        prompt:
          "A fraud-scoring feature using transaction history, location and device is two weeks from launch with no impact assessment. What do you advise?",
        options: [
          { id: "a", text: "Launch and complete the assessment afterwards" },
          {
            id: "b",
            text: "Run a focused assessment now, in days, and be explicit that launching without it carries regulatory and design risk",
          },
          { id: "c", text: "Block the launch until a full assessment is complete" },
          { id: "d", text: "Accept the risk formally and record it" },
        ],
        correct: "b",
        explanation:
          "The assessment exists to change the design, and afterwards it can only document it. Most can be completed in two or three sessions and routinely surface something cheaper to change now.",
        whyWrong: {
          a: "It is likely a legal requirement before processing begins, so completing it afterwards does not satisfy it.",
          c: "Sometimes right for genuinely high-risk processing, and as a first move it turns a scheduling problem into a confrontation.",
          d: "You cannot accept a risk nobody has characterised, and a statutory requirement is generally not the organisation's to accept.",
        },
      },
      {
        id: "csq50-5",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cs-priv-retention",
        prompt:
          "Why is a retention schedule that is written but never enforced worse than none at all?",
        options: [
          { id: "a", text: "Because it takes time to write" },
          {
            id: "b",
            text: "Because it is evidence that the organisation knew what it should have been doing and did not do it",
          },
          { id: "c", text: "Because it confuses staff" },
          { id: "d", text: "Because auditors ignore unenforced policies" },
        ],
        correct: "b",
        explanation:
          "A documented policy that nothing enforces converts an omission into a demonstrable failure to follow your own stated process, which is a worse position in front of a regulator.",
        whyWrong: {
          a: "The effort is trivial next to the consequences either way.",
          c: "Staff confusion is a real minor cost and not what makes it worse than nothing.",
          d: "Auditors specifically do not ignore them. An unenforced policy is a finding.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "cs-l51-governance": {
    lessonId: "cs-l51-governance",
    passMark: 70,
    questions: [
      {
        id: "csq51-1",
        type: "scenario",
        difficulty: 3,
        atomId: "a-cs-grc-compliance-not-security",
        prompt:
          "A director asks whether passing the ISO 27001 audit means the company is secure. What do you say?",
        options: [
          { id: "a", text: "Yes; the certification demonstrates security is properly managed" },
          {
            id: "b",
            text: "It shows we manage security in a structured, audited way, which is valuable. It does not test whether a real attacker could get in",
          },
          { id: "c", text: "No; certifications are box-ticking exercises" },
          { id: "d", text: "Yes, for the audited scope, which was probably narrow" },
        ],
        correct: "b",
        explanation:
          "It gives the certification its actual credit and names precisely what it does not cover, which is what justifies continuing to fund testing and detection after the certificate arrives.",
        whyWrong: {
          a: "Organisations pass audits and get breached in the same quarter. Agreeing here means nothing further gets funded this year.",
          c: "Dismissive and inaccurate. A working management system genuinely reduces risk.",
          d: "Scope is a real caveat and \"probably narrow\" is a guess presented as fact. Read the scope statement.",
        },
      },
      {
        id: "csq51-2",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cs-grc-frameworks",
        prompt:
          "A thirty-person company wants to know what to do first about security. Which framework fits?",
        options: [
          { id: "a", text: "ISO 27001, because certification proves maturity" },
          { id: "b", text: "CIS Controls, because it is a prioritised, concrete list of actions" },
          { id: "c", text: "PCI DSS, because it is the most rigorous" },
          { id: "d", text: "All of them, for completeness" },
        ],
        correct: "b",
        explanation:
          "They answer different questions. A small team needing a plan wants an ordered list of things to do, not a certifiable management system.",
        whyWrong: {
          a: "Certification is expensive and answers a different question, usually asked by enterprise customers rather than by the company itself.",
          c: "PCI DSS is mandatory if you handle card data and irrelevant otherwise. Rigour is not the selection criterion.",
          d: "Adopting several at once guarantees none is implemented, and a thirty-person company does not have the capacity.",
        },
      },
      {
        id: "csq51-3",
        type: "mcq",
        difficulty: 3,
        atomId: "a-cs-grc-policy-hierarchy",
        prompt:
          "Why should a policy not name a specific product?",
        options: [
          { id: "a", text: "Because it advertises the vendor" },
          {
            id: "b",
            text: "Because the policy then needs senior re-approval every time the product changes, so it stops changing and becomes wrong",
          },
          { id: "c", text: "Because products are confidential information" },
          { id: "d", text: "Because auditors dislike specifics" },
        ],
        correct: "b",
        explanation:
          "A policy states what must be true and changes rarely. Products belong in the standard, which changes yearly, or in the procedure, which changes whenever the interface does.",
        whyWrong: {
          a: "Naming a vendor is not an advertising problem in an internal document.",
          c: "Some organisations treat their tooling as sensitive, and that is a classification question rather than a hierarchy one.",
          d: "Auditors want specificity. They want it in the layer where it can be kept current.",
        },
      },
      {
        id: "csq51-4",
        type: "mcq",
        difficulty: 3,
        atomId: "a-cs-grc-third-party",
        prompt:
          "Of the third-party risk controls, which one do you control entirely and most often skip?",
        options: [
          { id: "a", text: "Assessing the supplier before contracting" },
          { id: "b", text: "Limiting what the integration can reach" },
          { id: "c", text: "Contractual breach notification obligations" },
          { id: "d", text: "Reviewing their certifications annually" },
        ],
        correct: "b",
        explanation:
          "A supplier integration that can read your whole customer table is a decision you made, not one they imposed. It requires no negotiation and it decides how much a supplier compromise costs you.",
        whyWrong: {
          a: "Assessment depends entirely on what the supplier chooses to tell you.",
          c: "This has to be negotiated, and a supplier with leverage may refuse.",
          d: "Certifications are theirs, and reviewing them tells you about their paperwork rather than your exposure.",
        },
      },
      {
        id: "csq51-5",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cs-grc-governance",
        prompt:
          "What is a better way to judge a security programme than counting its policies?",
        options: [
          { id: "a", text: "Counting the tools deployed" },
          {
            id: "b",
            text: "Asking who owns the top five risks, when they last reviewed them, and what they did",
          },
          { id: "c", text: "Counting the size of the security team" },
          { id: "d", text: "Asking how many audits were passed" },
        ],
        correct: "b",
        explanation:
          "It takes five minutes and tells you whether the machinery works: whether risks are owned, reviewed and acted on. Documents are the output of governance, not the thing itself.",
        whyWrong: {
          a: "Tool count measures spending. Unowned tools are shelfware.",
          c: "Headcount measures investment rather than outcome, and small teams frequently outperform large ones.",
          d: "Audits measure compliance at a point in time, which the previous lesson distinguished from security.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "cs-l52-risk-management": {
    lessonId: "cs-l52-risk-management",
    passMark: 70,
    questions: [
      {
        id: "csq52-1",
        type: "scenario",
        difficulty: 3,
        atomId: "a-cs-grc-risk-register",
        prompt:
          "In the supplier assessment, why does \"the integration account can query our entire customer table\" rank above a higher-scoring TLS finding?",
        options: [
          { id: "a", text: "Because TLS findings are never serious" },
          {
            id: "b",
            text: "Because any compromise on their side becomes a full customer database breach on yours, and the TLS finding sits on a marketing site with nothing behind it",
          },
          { id: "c", text: "Because the supplier will not fix TLS" },
          { id: "d", text: "Because access control always outranks cryptography" },
        ],
        correct: "b",
        explanation:
          "The scores describe their systems. The risk is yours, and it depends on what the integration touches. Narrowing the permission is a day of work and removes most of the exposure.",
        whyWrong: {
          a: "TLS findings can be extremely serious. This one is not, because of what is behind it.",
          c: "Their willingness affects the treatment, not the ranking.",
          d: "No such general rule exists. Ranking follows exposure and impact in this specific case.",
        },
      },
      {
        id: "csq52-2",
        type: "scenario",
        difficulty: 3,
        atomId: "a-cs-grc-risk-register",
        prompt:
          "The missing breach notification clause scores lowest of the internet-facing findings and ranks high. Why?",
        options: [
          { id: "a", text: "Because contracts are always more important than technology" },
          {
            id: "b",
            text: "Because without it you have a statutory obligation and no mechanism to hear about their breach in time to meet it",
          },
          { id: "c", text: "Because lawyers rank findings differently" },
          { id: "d", text: "Because it is cheap to fix" },
        ],
        correct: "b",
        explanation:
          "It is not a technical vulnerability, which is why the score is low, and it directly determines whether you can meet a legal deadline that is not negotiable.",
        whyWrong: {
          a: "No such general rule. It ranks high here because of what it prevents you from doing.",
          c: "The ranking reflects consequence to the organisation, not professional preference.",
          d: "Cheapness affects the treatment decision, not the risk it carries.",
        },
      },
      {
        id: "csq52-3",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cs-grc-treatment",
        prompt:
          "Which treatment do security practitioners most often over-use, and which is most often overlooked?",
        options: [
          { id: "a", text: "Over-use accept; overlook reduce" },
          { id: "b", text: "Over-use reduce; overlook avoid" },
          { id: "c", text: "Over-use transfer; overlook accept" },
          { id: "d", text: "Over-use avoid; overlook transfer" },
        ],
        correct: "b",
        explanation:
          "Adding a control is the technical option, so it is reached for first. Not doing the thing at all, such as tokenising rather than sending the data, is frequently the cheapest answer nobody considered.",
        whyWrong: {
          a: "Practitioners are usually reluctant to accept and eager to reduce, which is the reverse of this.",
          c: "Transfer is under-used by security people, not over-used, because it feels like somebody else's job.",
          d: "Avoid is rarely proposed at all, which is exactly why it is the overlooked one.",
        },
      },
      {
        id: "csq52-4",
        type: "scenario",
        difficulty: 3,
        atomId: "a-cs-grc-appetite",
        prompt:
          "Leadership state a high risk appetite. A feature would store national ID numbers unencrypted. Does the appetite settle it?",
        options: [
          { id: "a", text: "Yes; leadership has set the appetite" },
          {
            id: "b",
            text: "No. Appetite governs business risk, not legal obligations, and this is likely unlawful regardless",
          },
          { id: "c", text: "No; ID numbers should always be encrypted whatever the appetite" },
          { id: "d", text: "Yes, provided the decision is recorded with a named owner" },
        ],
        correct: "b",
        explanation:
          "Appetite covers risks the organisation is entitled to take. Legal obligations are not theirs to accept, and saying so early is far cheaper than saying it later.",
        whyWrong: {
          a: "Their authority is real and bounded. This falls outside the boundary.",
          c: "The conclusion is right and \"always\" is an assertion that invites an argument about exceptions. The legal obligation ends the conversation.",
          d: "Recording an unlawful decision documents it rather than legitimising it, and evidences that the organisation knew.",
        },
      },
      {
        id: "csq52-5",
        type: "mcq",
        difficulty: 3,
        atomId: "a-cs-grc-metrics",
        prompt:
          "Why is phishing reporting rate a better metric than click rate?",
        options: [
          { id: "a", text: "Because it is easier to measure" },
          {
            id: "b",
            text: "Because a workforce that reports gives the response team the one thing it needs, which is time",
          },
          { id: "c", text: "Because click rate can be manipulated by the simulation" },
          { id: "d", text: "Because reporting rate is required by most frameworks" },
        ],
        correct: "b",
        explanation:
          "Somebody will always click. The difference between a contained incident and a breach is whether anybody said so, and how quickly. Click rate measures an outcome you cannot drive to zero.",
        whyWrong: {
          a: "Both are equally easy to measure in a simulation.",
          c: "Simulation difficulty affects both numbers equally, and is a reason to be careful with either.",
          d: "Framework requirements are not why it is the better measure.",
        },
      },
    ],
  },
};

export default ASSESSMENTS;
