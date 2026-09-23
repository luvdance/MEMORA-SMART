/**
 * ASSESSMENTS · CYBERSECURITY · WEEK 16 · CAREER LAUNCH
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Never import this from anything under src/.
 * ═════════════════════════════════════════════════════════════════════════
 */

export const ASSESSMENTS = {
  /* ═══════════════════════════════════════════════════════════════════ */
  "cs-l60-the-field": {
    lessonId: "cs-l60-the-field",
    passMark: 70,
    questions: [
      {
        id: "csq60-1",
        type: "scenario",
        difficulty: 3,
        atomId: "a-cs-career-specialise",
        prompt:
          "With no prior security experience, you have offers for a small SOC analyst role and a specialised vendor detection-content role. Which is the better first job?",
        options: [
          { id: "a", text: "The vendor role; it is specialised and pays better" },
          {
            id: "b",
            text: "The SOC role, because it exposes you to the widest range of real incidents and lets you discover what to specialise in",
          },
          { id: "c", text: "Neither; hold out for penetration testing" },
          { id: "d", text: "The vendor role, because product experience is transferable" },
        ],
        correct: "b",
        explanation:
          "Everything eventually arrives in the queue. A year there tells you what you actually want, and makes any later specialisation better informed.",
        whyWrong: {
          a: "Writing detections without ever having triaged one narrows your options before you know what you enjoy. It can be an excellent second role.",
          c: "Testing roles almost never take candidates with no operational experience, and holding out means not starting.",
          d: "Deep knowledge of one vendor's product is among the least transferable things you can acquire.",
        },
      },
      {
        id: "csq60-2",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cs-career-first-role",
        prompt: "Which routes into a first security role actually work most often?",
        options: [
          { id: "a", text: "Applying directly to junior security adverts from outside the industry" },
          {
            id: "b",
            text: "Internal moves from IT or development, service desk into security, graduate schemes, and small organisations",
          },
          { id: "c", text: "Waiting until you have three certifications" },
          { id: "d", text: "Freelance penetration testing" },
        ],
        correct: "b",
        explanation:
          "Almost every advert asks for experience, including the junior ones. A year on a service desk in a company with a security team is frequently faster than a year of applications from outside.",
        whyWrong: {
          a: "It works occasionally and it is the lowest-yield route, which is why people send two hundred and hear nothing.",
          c: "Certifications get you past filters. They do not substitute for the experience the advert asks for.",
          d: "Freelance testing requires clients who trust you, which is precisely what you do not yet have.",
        },
      },
      {
        id: "csq60-3",
        type: "scenario",
        difficulty: 3,
        atomId: "a-cs-career-adjacent",
        prompt:
          "Two candidates for a first security role: one knows more tools, one writes better. Who is usually hired?",
        options: [
          { id: "a", text: "The one who knows more tools, since the work is technical" },
          {
            id: "b",
            text: "The writer, because tools are learned in a fortnight and the job is mostly triage notes, findings, reports and persuasion",
          },
          { id: "c", text: "Whichever has the better certification" },
          { id: "d", text: "It depends entirely on the interviewer" },
        ],
        correct: "b",
        explanation:
          "A manager can fix a tooling gap and cannot fix somebody who cannot explain what they found. Communication is most of what security work consists of.",
        whyWrong: {
          a: "The work is technical and the output is written. Tool knowledge has the shorter half-life of the two.",
          c: "Both presumably cleared the filter to reach interview, at which point the certification stops differentiating.",
          d: "Interviewers vary and the pattern is consistent enough to plan around.",
        },
      },
      {
        id: "csq60-4",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cs-career-roles",
        prompt: "Why is security operations often described as the broadest education?",
        options: [
          { id: "a", text: "Because it pays the most" },
          {
            id: "b",
            text: "Because everything eventually arrives in the queue: phishing, malware, cloud, insider issues and misconfiguration",
          },
          { id: "c", text: "Because it requires the most certifications" },
          { id: "d", text: "Because it has the shortest hours" },
        ],
        correct: "b",
        explanation:
          "Breadth of exposure is the reason, and it is why the role is such a good place to discover what you want to specialise in.",
        whyWrong: {
          a: "It is typically among the lower-paid security roles at entry level.",
          c: "Entry to operations usually requires fewer certifications than most other routes.",
          d: "Shift work is common, including nights, which is one of its real costs.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "cs-l61-certifications": {
    lessonId: "cs-l61-certifications",
    passMark: 70,
    questions: [
      {
        id: "csq61-1",
        type: "scenario",
        difficulty: 3,
        atomId: "a-cs-cert-when-worth-it",
        prompt:
          "You have just finished this course with no security experience, and someone recommends going straight for OSCP. Is that right?",
        options: [
          { id: "a", text: "Yes; aim high and the respect it carries opens doors" },
          {
            id: "b",
            text: "No. Do an entry certification, build practical experience on practice ranges, and revisit it when the gap is smaller",
          },
          { id: "c", text: "No; certifications do not matter, only the portfolio" },
          { id: "d", text: "Yes, if your employer will pay" },
        ],
        correct: "b",
        explanation:
          "It sequences the spend against the return. The entry certification opens applications now, the practice builds the skills OSCP actually tests, and the money is spent when it is likely to convert.",
        whyWrong: {
          a: "It assumes far more experience than one course provides, and failing an expensive examination costs money and six months.",
          c: "Portfolios matter enormously and do not get you past an automated filter requiring a named certification.",
          d: "Somebody else paying removes the financial argument, not the readiness one.",
        },
      },
      {
        id: "csq61-2",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cs-cert-what-they-do",
        prompt: "What does a certification actually do for you?",
        options: [
          { id: "a", text: "Demonstrates you can do the work" },
          {
            id: "b",
            text: "Gets your application past a filter and gives a hiring manager a shared reference point",
          },
          { id: "c", text: "Guarantees an interview" },
          { id: "d", text: "Replaces the need for a portfolio" },
        ],
        correct: "b",
        explanation:
          "Everybody involved knows it does not demonstrate capability. Framing it correctly stops both dismissing them and treating one as a job guarantee.",
        whyWrong: {
          a: "Practical certifications get closer, and no examination demonstrates a year of doing the job.",
          c: "It improves the odds of being read. Nothing guarantees an interview.",
          d: "Three certifications and no portfolio is a recognisable profile, and it does not interview well.",
        },
      },
      {
        id: "csq61-3",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cs-cert-roadmap",
        prompt: "Why is CISSP not an entry-level certification?",
        options: [
          { id: "a", text: "Because the examination is too long" },
          { id: "b", text: "Because it formally requires several years of verified experience" },
          { id: "c", text: "Because it is only recognised in management roles" },
          { id: "d", text: "Because it must be taken in person" },
        ],
        correct: "b",
        explanation:
          "Without the experience requirement met, a pass yields an associate status rather than the full credential. It is aimed at people who already have a career to certify.",
        whyWrong: {
          a: "Length is a practical matter and not why it is unsuitable as a first certification.",
          c: "It is recognised across many roles. The barrier is the experience requirement.",
          d: "Delivery format has no bearing on who it is aimed at.",
        },
      },
      {
        id: "csq61-4",
        type: "scenario",
        difficulty: 2,
        atomId: "a-cs-cert-traps",
        prompt:
          "How do you evaluate whether a certification you have not heard of is worth paying for?",
        options: [
          { id: "a", text: "Read the provider's marketing and pass rate" },
          {
            id: "b",
            text: "Search three job boards for the roles you want and count how many adverts name it",
          },
          { id: "c", text: "Ask on social media" },
          { id: "d", text: "Check whether it has an annual renewal fee" },
        ],
        correct: "b",
        explanation:
          "Ten minutes, and it is the only evaluation that matters. If the count is zero, it is not a filter you are passing.",
        whyWrong: {
          a: "Marketing is what you are trying to see past, and a high pass rate is closer to a warning than a recommendation.",
          c: "Replies will be a mix of genuine advice and people who sell it. The job boards are the primary source.",
          d: "Renewal fees are worth knowing and only matter if the credential was worth having.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "cs-l62-portfolio": {
    lessonId: "cs-l62-portfolio",
    passMark: 70,
    questions: [
      {
        id: "csq62-1",
        type: "scenario",
        difficulty: 3,
        atomId: "a-cs-portfolio-publishing",
        prompt:
          "You were authorised to test a friend's business application and found three good findings. What can you publish?",
        options: [
          { id: "a", text: "The full report; you were authorised to do the test" },
          {
            id: "b",
            text: "An anonymised version, with their written agreement, and only after the findings are fixed",
          },
          { id: "c", text: "Nothing; client work can never be published" },
          { id: "d", text: "The findings with the organisation's name removed but hostnames intact" },
        ],
        correct: "b",
        explanation:
          "Authorisation to test is not authorisation to publish. Anonymised case studies are published routinely across the industry, with permission, and asking for it is itself the professional behaviour a reader looks for.",
        whyWrong: {
          a: "The report names their systems and weaknesses, and publishing exposes them to anybody who reads it.",
          c: "Refusing entirely loses your strongest evidence for no benefit to anybody.",
          d: "Hostnames identify the organisation immediately and are exactly what somebody would use to go and look.",
        },
      },
      {
        id: "csq62-2",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cs-portfolio-what",
        prompt: "What makes a security portfolio effective?",
        options: [
          { id: "a", text: "As many projects as possible, to show breadth" },
          {
            id: "b",
            text: "Three to five pieces a stranger can read in a few minutes, each showing what you did and what you concluded",
          },
          { id: "c", text: "A repository of every script you have written" },
          { id: "d", text: "A list of the tools you know" },
        ],
        correct: "b",
        explanation:
          "A hiring manager gives it about four minutes. They are looking for whether you can do a piece of work and explain it, because that is the job.",
        whyWrong: {
          a: "Fifteen thin pieces read worse than three good ones and take longer to skim.",
          c: "Scripts without context show nothing about reasoning, and nobody will run them.",
          d: "A tool list is a claim rather than evidence, and it is the weakest thing you can put in a portfolio.",
        },
      },
      {
        id: "csq62-3",
        type: "mcq",
        difficulty: 3,
        atomId: "a-cs-cv",
        prompt: "Which CV line is stronger, and why?",
        options: [
          { id: "a", text: "\"Completed a cybersecurity course covering networking, Linux and incident response\"" },
          {
            id: "b",
            text: "\"Hardened an Ubuntu server against the CIS benchmark, 71 to 189 of 214, with 25 documented exceptions. Report: link\"",
          },
          { id: "c", text: "Both are equivalent" },
          { id: "d", text: "The first, because it lists more topics" },
        ],
        correct: "b",
        explanation:
          "The first says you attended. The second says what you did, with a number and something the reader can open, which is what survives a thirty-second scan.",
        whyWrong: {
          a: "Course completion is the weakest possible claim, because everyone on the course can make it.",
          c: "One communicates attendance and the other competence. They are not equivalent.",
          d: "Topic coverage is what a syllabus lists. A CV competes on what you produced.",
        },
      },
      {
        id: "csq62-4",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cs-networking",
        prompt:
          "With no professional network, what is the highest-value action this month?",
        options: [
          { id: "a", text: "Send fifty applications" },
          {
            id: "b",
            text: "Publish one write-up of something you did, and turn up to one community more than once",
          },
          { id: "c", text: "Start another certification" },
          { id: "d", text: "Rebuild your CV a third time" },
        ],
        correct: "b",
        explanation:
          "Both are free, and consistency matters more than brilliance. The person who posts a modest write-up every month for a year is known; the person who posts one excellent thing is not.",
        whyWrong: {
          a: "Volume without a portfolio or a network is the lowest-yield use of the same hours.",
          c: "Another certification with no visible work is the profile that does not interview well.",
          d: "Iterating on the CV has sharply diminishing returns once it is targeted and has a link in it.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "cs-l63-interviews-and-after": {
    lessonId: "cs-l63-interviews-and-after",
    passMark: 70,
    questions: [
      {
        id: "csq63-1",
        type: "scenario",
        difficulty: 3,
        atomId: "a-cs-interview-scenario",
        prompt:
          "\"You are alone at 2am. A privileged account logs in from an unusual country. What do you do?\" What makes a strong answer?",
        options: [
          { id: "a", text: "State one correct action immediately, to show decisiveness" },
          {
            id: "b",
            text: "Ask what the account can reach and whether a change ticket exists, then reason through triage, containment and escalation, saying what would change your decision",
          },
          { id: "c", text: "Say you would follow the runbook" },
          { id: "d", text: "Describe the tools you would use" },
        ],
        correct: "b",
        explanation:
          "There is no single right answer. They are watching your reasoning, your ordering, and whether you ask clarifying questions, which in this field are the answer rather than a delay.",
        whyWrong: {
          a: "Answering as though there were one right action suggests a memorised response rather than understanding.",
          c: "Correct in practice and it gives them nothing. They want to know how you think when the runbook does not cover it.",
          d: "Tools are the least interesting part and change between employers. The reasoning transfers.",
        },
      },
      {
        id: "csq63-2",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cs-interview-behavioural",
        prompt:
          "Why is \"tell me about a time you were wrong\" a poor question to answer with an example where you were secretly right?",
        options: [
          { id: "a", text: "Because interviewers dislike long answers" },
          {
            id: "b",
            text: "Because the question tests whether you can recognise being wrong, and that answer demonstrates you cannot",
          },
          { id: "c", text: "Because it is a trick question" },
          { id: "d", text: "Because past mistakes are not relevant" },
        ],
        correct: "b",
        explanation:
          "Security work is largely persuasion of people who have other priorities. Being wrong without becoming defensive matters more here than in most engineering roles.",
        whyWrong: {
          a: "Length is not the issue. The content of the example is.",
          c: "It is a straightforward question about self-awareness, asked in good faith.",
          d: "They are highly relevant, which is why the question is asked in nearly every interview.",
        },
      },
      {
        id: "csq63-3",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cs-interview-technical",
        prompt:
          "Why do interviewers ask fundamentals like \"what happens when you type a URL\" rather than tool trivia?",
        options: [
          { id: "a", text: "Because they are easy to mark" },
          {
            id: "b",
            text: "Because the answer reveals depth immediately: naming the mechanism and a consequence sounds completely different from reciting a definition",
          },
          { id: "c", text: "Because tools change too often to ask about" },
          { id: "d", text: "Because the answer is always the same" },
        ],
        correct: "b",
        explanation:
          "A candidate who can go from DNS to the handshake to TLS to the request, and say where an attacker could interfere at each step, has demonstrated more in ninety seconds than any tool question could elicit.",
        whyWrong: {
          a: "They are harder to mark than trivia, because good answers vary.",
          c: "Tool churn is real and it is a side reason rather than the main one.",
          d: "Answers vary enormously in depth, which is exactly what the question is for.",
        },
      },
      {
        id: "csq63-4",
        type: "scenario",
        difficulty: 2,
        atomId: "a-cs-staying-current",
        prompt:
          "You have just finished the course. What is the single most important thing to do in the next seven days?",
        options: [
          { id: "a", text: "Begin studying for your next certification" },
          { id: "b", text: "Publish the capstone and send two applications" },
          { id: "c", text: "Rebuild your home lab with better hardware" },
          { id: "d", text: "Read the latest threat intelligence reports" },
        ],
        correct: "b",
        explanation:
          "Momentum after a course decays fast, and the two things that convert it into a job are evidence somebody can read and applications somebody receives. Everything else is easier once those exist.",
        whyWrong: {
          a: "Worth doing and it produces nothing anybody can see for months, while the momentum from finishing fades.",
          c: "The lab is adequate. Improving it is preparation for work rather than the work.",
          d: "Useful as a habit and it is not what converts sixteen weeks of work into an interview.",
        },
      },
    ],
  },
};

export default ASSESSMENTS;
