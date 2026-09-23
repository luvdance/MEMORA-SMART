/**
 * CYBERSECURITY · WEEK 16 · CAREER LAUNCH
 *
 * Harvard anchor: translates learning into a career. The practical bridge
 * beyond the coursework.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 *
 * ON CERTIFICATION NAMES AND PRICES: certification names and requirements
 * change, and prices vary enormously by country. This week names the
 * credentials that are widely recognised at the time of writing and
 * deliberately does not quote prices or durations, because a figure that is
 * wrong for a learner in Lagos is worse than no figure. Check the provider's
 * own page before committing money.
 */

export const SECTION_ID = "cs-s16-career";

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 1
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "cs-l60-the-field",
    moduleId: "cs-w16-career",
    sectionId: SECTION_ID,
    order: 1,
    title: "The Map of the Field",
    subtitle: "Which job you are actually applying for",
    estimatedMinutes: 10,
    intro:
      "\"Cybersecurity\" is not a job. It is a dozen quite different ones that share a vocabulary, and applying for all of them with the same application is why people send two hundred and hear nothing.",

    atoms: [
      {
        id: "a-cs-career-roles",
        title: "The roles, and what each day looks like",
        explain:
          "Security operations works a queue and investigates. Penetration testing runs engagements and writes reports. Security engineering builds and runs controls. Governance and risk manages programmes, policy and audit. Application security works with developers. Each has different daily work and different entry routes.",
        why: "Knowing which one you want changes everything downstream: which certification, which projects, which words go in your application. It also makes interviews far easier, because you can explain why this role rather than any role.",
        table: {
          caption: "Five routes in, honestly described.",
          headers: ["Role", "A typical day", "Suits you if"],
          rows: [
            ["Security analyst (SOC)", "Triage alerts, investigate, escalate, tune", "You like puzzles and can work a queue"],
            ["Penetration tester", "Scope, test, write. Mostly write", "You are curious and can write clearly"],
            ["Security engineer", "Build and run controls, automate, fix things", "You enjoy building more than reporting"],
            ["GRC analyst", "Assess risk, run audits, write policy, chase owners", "You are organised and persuasive"],
            ["Application security", "Review code and designs, work with developers", "You can code, or want to"],
          ],
          note: "Security operations is the most common first role and the broadest education, because everything eventually arrives in the queue.",
        },
      },
      {
        id: "a-cs-career-first-role",
        title: "The first role is the hard one",
        explain:
          "Almost every security job advert asks for experience, including the ones labelled junior. The routes that actually work are: internal moves from IT or development, service desk into security, graduate and internship programmes, and small organisations where one person does everything.",
        why: "Knowing this saves months of applying to the wrong things. A year on a service desk in a company with a security team is frequently a faster route than a year of applications from outside, and it is available now.",
        mistake:
          "Waiting until you feel ready. Nobody feels ready, the adverts are written as wish lists, and the people who get in applied while under-qualified and demonstrated something concrete instead.",
      },
      {
        id: "a-cs-career-adjacent",
        title: "The adjacent skills that get you hired",
        explain:
          "Writing clearly. Basic scripting, usually Python. Comfort in a terminal. Understanding how systems are actually built and deployed. And the ability to have a conversation with somebody who does not want to hear from security.",
        why: "These separate candidates far more than tool knowledge does. Tools are learned in a fortnight on the job. Writing a paragraph that makes an engineer want to fix something is not, and it is what most security work consists of.",
        practice: {
          prompt:
            "Two candidates: one knows more tools, one writes better. Who gets hired for a first security role?",
          answer:
            "Usually the writer, and for a reason that is not sentimental. Tools are taught in a fortnight and the job is mostly communication: triage notes, findings, reports, and persuading people who have other priorities. A manager can fix a tooling gap and cannot fix somebody who cannot explain what they found.",
        },
      },
      {
        id: "a-cs-career-specialise",
        title: "Specialise later, not now",
        explain:
          "Depth comes from doing the work, and you do not yet know which part you enjoy. The first role should be chosen for what it exposes you to, and the specialisation follows from what you find yourself reaching for.",
        why: "People who specialise before their first job frequently specialise into something they turn out to dislike, having spent money on a certification for it. The broad first role costs you nothing and answers the question.",
        decision: {
          scenario:
            "You have finished this course and have two offers: a security analyst role in a small SOC, and a specialised role writing detection content for a vendor's product.",
          question: "With no prior security experience, which is the better first role?",
          options: [
            {
              id: "a",
              text: "The vendor role. It is more specialised and pays better",
              whyWrong:
                "Specialised work with no operational context means writing detections without ever having triaged one. It can be an excellent second role and it narrows your options early, before you know what you enjoy.",
            },
            {
              id: "b",
              text: "The SOC role, because it exposes you to the widest range of real incidents and lets you discover what you want to specialise in",
              why: "Everything eventually arrives in the queue: phishing, malware, cloud, insider issues, misconfiguration. A year there tells you what you actually want, and it makes any later specialisation better informed.",
            },
            {
              id: "c",
              text: "Neither. Hold out for a penetration testing role, which is what the course prepared you for",
              whyWrong:
                "The course prepared you for all of these, and testing roles almost never take candidates with no operational experience. Holding out means not starting, and not starting is the expensive option.",
            },
            {
              id: "d",
              text: "The vendor role, because product experience is more transferable",
              whyWrong:
                "Deep knowledge of one vendor's product is among the less transferable things you can acquire, and it dates when the product does. Understanding how attacks and incidents actually work is what transfers.",
            },
          ],
          correct: "b",
          aftermath:
            "This is not a rule against specialised first roles. It is a bias towards breadth when you do not yet have the information to choose, which after one course is the position everybody is in.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 2
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "cs-l61-certifications",
    moduleId: "cs-w16-career",
    sectionId: SECTION_ID,
    order: 2,
    title: "Certifications",
    subtitle: "Which ones, when, and which to skip",
    estimatedMinutes: 10,
    intro:
      "Certifications are a real part of this field and they are oversold to beginners. This lesson is about what they actually do, in what order they are worth having, and how to avoid spending money on the wrong one.",

    atoms: [
      {
        id: "a-cs-cert-what-they-do",
        title: "What a certification actually does",
        explain:
          "It gets your application past a filter, gives a hiring manager a shared reference point, and in some organisations is required for a contract. What it does not do is demonstrate that you can do the work, and everybody involved knows that.",
        why: "Framing it correctly stops two mistakes: dismissing certifications as worthless, which loses you interviews you would have got, and treating one as a job guarantee, which produces a certified candidate with nothing to talk about.",
        mistake:
          "Collecting certifications instead of building things. Three certifications and no portfolio is a recognisable profile, and it does not interview well, because every question about practical work has no answer behind it.",
      },
      {
        id: "a-cs-cert-roadmap",
        title: "A sensible order",
        explain:
          "Entry level first, to get past filters. Then one aligned with the role you want. Advanced ones later, once you have the experience they assume, and in several cases formally require.",
        why: "The order matters because the advanced ones are expensive and assume experience. Attempting an advanced offensive certification straight after a first course is a common and costly mistake, and the failure rate reflects it.",
        table: {
          caption: "The widely recognised ones, in a sensible order.",
          headers: ["Stage", "Consider", "Note"],
          rows: [
            [
              "After this course",
              "CompTIA Security+, or ISC2 Certified in Cybersecurity",
              "Entry level. Security+ is the most commonly filtered on",
            ],
            [
              "Targeting operations",
              "CompTIA CySA+, or a vendor's SOC analyst certification",
              "Maps onto the Week 11 and 12 material",
            ],
            [
              "Targeting testing",
              "eJPT, then PNPT or OSCP later",
              "eJPT is the realistic next step; OSCP assumes far more",
            ],
            [
              "Targeting cloud",
              "A cloud provider's security specialty",
              "Do the provider's general certification first",
            ],
            [
              "Targeting management, with experience",
              "CISSP",
              "Requires several years of verified experience. It is not an entry certification",
            ],
          ],
          note: "ISC2's Certified in Cybersecurity has, at times, been offered free to a limited number of candidates. Check their current position before paying for an entry certification.",
        },
      },
      {
        id: "a-cs-cert-when-worth-it",
        title: "When one is worth the money",
        explain:
          "When a role you actually want lists it, when your employer will pay, when it is required for work you do, or when you need a structured syllabus to force you to study a subject properly.",
        why: "That last one is underrated and is a legitimate reason. The rest are about return. If you cannot name the specific roles that would open up, you are buying a certificate rather than an outcome.",
        decision: {
          scenario:
            "You have just finished this course and no security experience. Someone recommends going straight for OSCP because it is the most respected offensive certification.",
          question: "Is that the right next step?",
          options: [
            {
              id: "a",
              text: "Yes. Aim high, and the respect it carries will open doors",
              whyWrong:
                "It assumes considerably more experience than one course provides, it is expensive, and the failure rate for candidates at this stage is high. Failing an expensive examination is a bad use of money and of six months.",
            },
            {
              id: "b",
              text: "No. Do an entry certification to get past filters, build practical experience on practice ranges, and revisit OSCP when the gap is smaller",
              why: "It sequences the spend against the return. The entry certification opens applications now, the practice builds the skills OSCP actually tests, and the money is spent when it is likely to convert.",
            },
            {
              id: "c",
              text: "No. Certifications do not matter; the portfolio is everything",
              whyWrong:
                "Portfolios matter enormously and do not get you past an automated filter that requires a named certification. Both are needed, in the right order.",
            },
            {
              id: "d",
              text: "Yes, if your employer will pay for it",
              whyWrong:
                "Somebody else paying removes the financial argument and not the readiness one. Failing it on your employer's budget is its own kind of expensive.",
            },
          ],
          correct: "b",
          aftermath:
            "OSCP is a genuinely good certification, and the complaint is about sequencing rather than quality. It assumes you have already spent a long time doing the work.",
        },
      },
      {
        id: "a-cs-cert-traps",
        title: "The traps",
        explain:
          "Certifications nobody recognises, sold with heavy marketing. Bootcamps promising a job. Anything requiring an expensive annual renewal for a credential that is not widely asked for. And any provider whose main selling point is how easy their examination is.",
        why: "This part of the industry has a large volume of low-quality products aimed at beginners, because beginners cannot yet tell the difference. The test is simple: search job adverts for the roles you want and count how often it appears.",
        example:
          "Before paying for any certification:\n\n  1  search three job boards for the roles you want\n  2  count how many adverts name it\n  3  if it is zero, it is not a filter you are passing\n\nTen minutes, and it is the only evaluation that matters.",
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 3
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "cs-l62-portfolio",
    moduleId: "cs-w16-career",
    sectionId: SECTION_ID,
    order: 3,
    title: "Portfolio and Application",
    subtitle: "Evidence, and getting it read",
    estimatedMinutes: 11,
    intro:
      "A portfolio is the thing that distinguishes you from the other four hundred applicants with the same certification. You have spent sixteen weeks producing one without necessarily noticing.",

    atoms: [
      {
        id: "a-cs-portfolio-what",
        title: "What a security portfolio is",
        explain:
          "Three to five pieces of work a stranger can read, each showing something you did and what you concluded. Not a list of tools. Not a repository of scripts nobody can run. Work, with reasoning attached.",
        why: "A hiring manager gives it about four minutes. What they are looking for is whether you can do a piece of work and explain it, because that is the job. Three good pieces beat fifteen thin ones.",
        table: {
          caption: "What you already have from this course.",
          headers: ["From", "Piece"],
          rows: [
            ["Week 2", "An annotated phishing checklist with real dissected examples"],
            ["Week 4", "An annotated packet capture explaining one full web request"],
            ["Week 5", "A hardening report with before and after scores and an exceptions list"],
            ["Week 6", "A segmented network design with a justified firewall policy"],
            ["Week 8", "A web application findings report mapped to the OWASP categories"],
            ["Week 9", "A rules of engagement document and a reconnaissance report"],
            ["Week 11", "Detection rules with triage notes, mapped to ATT&CK"],
            ["Week 12", "A full incident response report with a timeline"],
            ["Week 15", "The capstone"],
          ],
          note: "Pick the three or four that point at the role you want, and polish those. The rest can be listed without being featured.",
        },
      },
      {
        id: "a-cs-portfolio-publishing",
        title: "Publishing it without causing a problem",
        explain:
          "Never publish work about a real organisation without written permission, even if it was authorised at the time. Never publish a real vulnerability that is not fixed. Remove credentials, real addresses and anything identifying, and check the screenshots as carefully as the text.",
        why: "This is itself assessed. A portfolio containing a client's hostname, or a finding on somebody's live system, tells a hiring manager that you cannot be trusted with an engagement, which is the opposite of what the portfolio is for.",
        decision: {
          scenario:
            "During the course you were authorised to test a friend's small business application and found three good findings. You want to feature it in your portfolio.",
          question: "What can you publish?",
          options: [
            {
              id: "a",
              text: "The full report. You were authorised to do the test",
              whyWrong:
                "Authorisation to test is not authorisation to publish. The report names their systems and their weaknesses, and publishing it exposes them to anybody who reads it, including after they thought it was fixed.",
            },
            {
              id: "b",
              text: "A version with their identity, hostnames and specifics removed, published only with their written agreement and only after the findings are fixed",
              why: "It preserves what makes the work valuable, which is your method and reasoning, and removes what would harm them. Asking for written agreement is also itself the professional behaviour a reader is looking for.",
            },
            {
              id: "c",
              text: "Nothing. Client work can never be published",
              whyWrong:
                "Anonymised case studies are published routinely across the industry, with permission. Refusing entirely loses your strongest piece of evidence for no benefit to anybody.",
            },
            {
              id: "d",
              text: "The findings, with the organisation's name removed but the hostnames intact",
              whyWrong:
                "Hostnames identify the organisation immediately, and they are exactly what somebody would use to go and look. Removing the name and leaving the addresses anonymises nothing.",
            },
          ],
          correct: "b",
          aftermath:
            "Recreate the scenario in your own lab where you can. A rebuilt version proves the same skills, belongs entirely to you, and carries none of this risk.",
        },
      },
      {
        id: "a-cs-cv",
        title: "The application that survives the filter",
        explain:
          "Use the words in the advert, because a system is matching against them. Lead with what you have done rather than what you have studied. One line per piece of work, saying what you did and what it produced. A link to the portfolio, near the top.",
        why: "Two filters exist: an automated one matching keywords, and a human one giving you thirty seconds. The first needs the advert's vocabulary. The second needs a concrete achievement in the first six lines.",
        example:
          "Weak:\n  \"Completed a cybersecurity course covering networking, Linux,\n   penetration testing and incident response.\"\n\nStronger:\n  \"Hardened an Ubuntu server against the CIS benchmark, raising\n   the score from 71 to 189 of 214, and documented 25 deliberate\n   exceptions with compensating controls. Report: <link>\"\n\nThe first says you attended. The second says what you did,\nwith a number and something the reader can open.",
        mistake:
          "Listing every tool you have touched. It reads as padding, and the follow-up question in the interview is always about the one you know least well.",
      },
      {
        id: "a-cs-networking",
        title: "How people actually get these jobs",
        explain:
          "A large share of security roles are filled through people who already know the candidate: a community, a meetup, a conference, an open-source contribution, a helpful answer in a forum. Not through applications.",
        why: "It is not about being well connected. It is about being visible doing the work, which for a beginner means writing up what you learn, answering questions at your own level, and turning up to the same places repeatedly.",
        practice: {
          prompt:
            "You have no professional network in security. What is the highest-value thing you can do this month?",
          answer:
            "Publish one write-up of something you actually did, and turn up to one community, online or local, more than once. Both are free. Consistency matters more than brilliance: the person who posts a modest write-up every month for a year is known, and the person who posts one excellent thing is not.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 4
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "cs-l63-interviews-and-after",
    moduleId: "cs-w16-career",
    sectionId: SECTION_ID,
    order: 4,
    title: "Interviews, and What Comes After",
    subtitle: "The last lesson",
    estimatedMinutes: 11,
    intro:
      "Security interviews have a recognisable shape, and most of what they are testing is how you reason rather than what you have memorised. This lesson is that shape, and then a plan for the ninety days after this course ends.",

    atoms: [
      {
        id: "a-cs-interview-technical",
        title: "The technical questions",
        explain:
          "Usually fundamentals rather than trivia. Explain what happens when you type a URL. What is the difference between hashing and encryption. Why is a hash alone not enough for passwords. What is the difference between authentication and authorisation.",
        why: "Every one of those is in this course, and they are asked because the answers reveal depth immediately. An answer that names the mechanism and one consequence sounds completely different from one that recites a definition.",
        table: {
          caption: "Where the answers are.",
          headers: ["Question", "Week"],
          rows: [
            ["What happens when you type a URL?", "4"],
            ["Hashing versus encryption, and why salt", "3"],
            ["Authentication versus authorisation", "2 and 8"],
            ["How would you detect a brute force attack?", "11"],
            ["Walk me through your incident response process", "12"],
            ["What is the most common serious web vulnerability?", "8"],
          ],
        },
      },
      {
        id: "a-cs-interview-scenario",
        title: "The scenario questions",
        explain:
          "You get an alert at 2am. A user reports a phishing email. A scanner reports 400 findings. What do you do first. There is no single right answer, and they are watching your reasoning, your ordering and whether you ask clarifying questions.",
        why: "This is the closest thing to the actual job, and it is where candidates who memorised answers come apart. Say what you would check, why, in what order, and what would change your mind.",
        decision: {
          scenario:
            "An interviewer asks: \"You are alone on shift at 2am. An alert says a privileged account logged in from an unusual country. What do you do?\"",
          question: "What makes a strong answer?",
          options: [
            {
              id: "a",
              text: "State the single correct action immediately, to show decisiveness",
              whyWrong:
                "There is no single correct action, and answering as though there were suggests you have memorised a response rather than understood the problem. The interviewer is listening for reasoning.",
            },
            {
              id: "b",
              text: "Ask what the account has access to and whether a change ticket exists, then reason through triage, containment and escalation, saying what would change your decision",
              why: "It shows the triage sequence from Week 11, it asks the clarifying questions a real analyst asks, and it makes your reasoning visible. That is what the question is for.",
            },
            {
              id: "c",
              text: "Say you would follow the runbook",
              whyWrong:
                "Correct in practice and it gives the interviewer nothing. They are trying to find out how you think when the runbook does not cover the situation, which at 2am it often will not.",
            },
            {
              id: "d",
              text: "Describe the tools you would use to investigate",
              whyWrong:
                "Tools are the least interesting part of the answer, and they change between employers. The sequence and the reasoning transfer; the tool names do not.",
            },
          ],
          correct: "b",
          aftermath:
            "Clarifying questions are not a delay. In this field they are the answer, because the first thing a good analyst establishes is what is actually at stake.",
        },
      },
      {
        id: "a-cs-interview-behavioural",
        title: "The behavioural questions",
        explain:
          "Tell me about a time you were wrong. A time you disagreed with somebody senior. A time you had to explain something technical to somebody who did not want to hear it. Answer with a specific situation, what you did, and what happened.",
        why: "Security work is largely persuasion of people who have other priorities. These questions are testing whether you can disagree without being difficult, and whether you can be wrong without being defensive, both of which matter more here than in most engineering roles.",
        mistake:
          "Choosing an example where you were right all along. The question about being wrong is asked to find out whether you can recognise it, and an answer in which you were secretly right is the wrong answer to a question about judgement.",
      },
      {
        id: "a-cs-staying-current",
        title: "The next ninety days",
        explain:
          "Pick one practice platform and do something on it weekly. Follow a small number of genuinely good sources rather than everything. Write up one thing a month. Apply for roles before you feel ready. Revisit your own attack-surface audit from Week 1.",
        why: "This field changes continuously and the fundamentals in this course do not. What ages is the specifics, and the only defence is a habit rather than another course. Ninety days of small weekly actions beats one intensive month followed by nothing.",
        example:
          "A ninety-day plan that actually works:\n\n  Weekly    one practice box or lab, however small\n  Weekly    two applications, whether or not you feel ready\n  Monthly   one write-up published\n  Monthly   one community event, online or local\n  Day 90    re-do your Week 1 attack-surface audit and compare\n\nThe last one is worth doing. You will read it very differently.",
        practice: {
          prompt:
            "You have finished this course. What is the single most important thing to do in the next seven days?",
          answer:
            "Publish the capstone and send two applications. Both this week. Momentum after a course decays fast, and the two things that convert it into a job are evidence somebody can read and applications somebody receives. Everything else, including further study, is easier to start once those two exist.",
        },
      },
    ],

    task: {
      title: "The final lab",
      intro: "Turn sixteen weeks of work into something that gets you hired.",
      prompts: [
        "Choose the role you are targeting first, and write one paragraph on why that one. Every other decision follows from it.",
        "Publish a portfolio containing your three or four strongest deliverables and the capstone, with nothing that identifies a real organisation.",
        "Write a targeted CV using the vocabulary of three real adverts for that role, leading with what you did and the numbers attached to it.",
        "Search three job boards and record which certifications actually appear for the roles you want. Choose one, and write down what it is expected to open up.",
        "Complete a mock interview with a peer or mentor covering one technical, one scenario and one behavioural question. Record it if you can bear to.",
        "Write your ninety-day plan: weekly practice, weekly applications, monthly write-up, monthly community, and a date to re-do your Week 1 audit.",
        "Send two applications this week. Not when the portfolio is perfect. This week.",
      ],
      closing:
        "That is the end of the programme. You began by auditing your own digital life and you are ending by auditing organisations, testing systems with permission, detecting intrusions and writing it all up for people who have to decide something. Keep the habit that made that possible: ask who can reach this, what it costs them to try, and what they get.",
    },

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
