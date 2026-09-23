/**
 * CYBERSECURITY · WEEK 15 · CAPSTONE — BUILD, BREAK & DEFEND
 *
 * Harvard anchor: mirrors the CS50 final project. A self-directed piece of
 * work that proves mastery.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 *
 * This week is shorter in atoms and longer in work. The lessons exist to stop
 * the three things that actually sink capstones: scoping something that cannot
 * be finished, keeping no notes, and leaving the write-up until the last day.
 * Everything technical has already been taught.
 */

export const SECTION_ID = "cs-s15-capstone";

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 1
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "cs-l57-scoping",
    moduleId: "cs-w15-capstone",
    sectionId: SECTION_ID,
    order: 1,
    title: "Scoping Something You Can Finish",
    subtitle: "The most common way a capstone fails",
    estimatedMinutes: 11,
    intro:
      "Almost nobody fails a capstone because the work was too hard. They fail because the project was too big, and two weeks in they have four half-finished things and nothing they can show anybody.",

    atoms: [
      {
        id: "a-cs-cap-what-it-proves",
        title: "What this is actually for",
        explain:
          "An employer cannot tell from a certificate whether you can do anything. A capstone is evidence: a piece of work you scoped, executed and documented, that they can read in ten minutes and form an opinion about.",
        why: "It changes what makes a good project. Technically impressive and undocumented is worth almost nothing. Modest, complete and clearly written is worth a great deal, because the second one demonstrates the part of the job that most candidates cannot do.",
        mistake:
          "Choosing a project to impress other security people. The reader is usually a hiring manager, and sometimes an engineer who is not a specialist. Clarity beats sophistication every time in that audience.",
      },
      {
        id: "a-cs-cap-three-tracks",
        title: "The three tracks",
        explain:
          "Harden a system end to end and prove it with measurements. Run an authorised penetration test of an environment you own and report it properly. Or build a detection pipeline and demonstrate that it catches an attack you carry out yourself.",
        why: "Each maps onto a different kind of job, and picking the one that matches the work you want is a free advantage. They are also all achievable in a week with the lab you already have.",
        table: {
          caption: "Three tracks, and who each one speaks to.",
          headers: ["Track", "You deliver", "Speaks to"],
          rows: [
            [
              "Harden",
              "Before and after benchmark scores, every change with a rationale, and the exceptions",
              "Systems, infrastructure and cloud roles",
            ],
            [
              "Test",
              "Rules of engagement, methodology, findings with evidence, and a remediation plan",
              "Penetration testing and consultancy",
            ],
            [
              "Detect",
              "A log pipeline, detection rules, a simulated attack and the triage notes it produced",
              "Security operations and detection engineering",
            ],
          ],
          note: "A fourth option: do a small version of all three against one environment. It is the most work and it shows the widest range, and it only works if each part is genuinely finished.",
        },
      },
      {
        id: "a-cs-cap-scoping",
        title: "Scoping it down",
        explain:
          "Write down what you will deliver, then remove half. Then write down what a reader will be able to conclude from what remains. If the answer is still something worth concluding, the scope is right.",
        why: "A finished small project reads as competence. An unfinished large one reads as somebody who does not know how long things take, which is a genuine concern for an employer and a fair conclusion to draw.",
        decision: {
          scenario:
            "You have one week. You propose: build a three-tier application in cloud, harden it, penetration test it, build a SIEM with five detections, simulate an attack, and write all of it up.",
          question: "What is the right adjustment?",
          options: [
            {
              id: "a",
              text: "Keep the scope and work longer hours. Ambition is worth showing",
              whyWrong:
                "The likely outcome is six partial pieces and no report, which reads as somebody who cannot estimate. Ambition shown by a finished project is worth far more than ambition shown by an unfinished one.",
            },
            {
              id: "b",
              text: "Pick one track, do it thoroughly on an environment you already have, and spend a full day on the write-up",
              why: "One complete piece of work with a proper report demonstrates everything the six-part version would have, and it exists. The day set aside for writing is the part people cut, and it is the part the reader actually sees.",
            },
            {
              id: "c",
              text: "Keep all six and write a shorter report for each",
              whyWrong:
                "Six thin reports are harder to write than one good one and demonstrate less. The report length is not the constraint; the work behind it is.",
            },
            {
              id: "d",
              text: "Drop the write-up and deliver the technical work with screenshots",
              whyWrong:
                "This removes the single most differentiating part. Plenty of candidates can run the tools; the ones who get hired can explain what the output meant to a business.",
            },
          ],
          correct: "b",
          aftermath:
            "If you finish early, extend it. Adding a second track to a finished first one is easy. Rescuing six unfinished ones in the last two days is not.",
        },
      },
      {
        id: "a-cs-cap-authorisation",
        title: "The rules still apply, especially here",
        explain:
          "Everything from Week 9 applies to your capstone. Test only what you own or have written permission to test. Use your own lab, a practice range that permits it, or an environment you built for the purpose. Nothing else.",
        why: "It is worth stating plainly because the temptation is real: a capstone against a real target is more impressive right up until it is a criminal offence. It would also be, on its own, a reason not to hire you.",
        mistake:
          "Using a live organisation as a target because you have an account with them, or because a friend works there. Neither is authorisation, and Week 9's answer has not changed.",
      },
      {
        id: "a-cs-cap-evidence-plan",
        title: "Decide what evidence you need before you start",
        explain:
          "List the claims your report will make, then list what evidence proves each. Before-and-after scores need a before run, which is easy to forget once you have started changing things. A detection catching an attack needs both the attack and the alert captured.",
        why: "Almost every missing piece of evidence in a capstone is something that could only have been captured at a moment that has passed. Ten minutes of planning at the start is the whole fix.",
        example:
          "Claim                                   Evidence needed\n  \"Hardening raised the score from X to Y\"   a benchmark run BEFORE any change\n  \"The detection caught the attack\"          the attack's timestamp AND the alert\n  \"This finding is exploitable\"              the request and the response\n  \"Egress filtering blocks it\"               the same test before and after\n\nEvery one of these is trivial to capture at the time and\nimpossible to reconstruct afterwards.",
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 2
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "cs-l58-executing",
    moduleId: "cs-w15-capstone",
    sectionId: SECTION_ID,
    order: 2,
    title: "Executing",
    subtitle: "Working like a professional for a week",
    estimatedMinutes: 11,
    intro:
      "The technical work is the part you already know how to do. What this lesson is about is the discipline around it, which is also what an employer is actually assessing.",

    atoms: [
      {
        id: "a-cs-cap-environment",
        title: "Build the environment first, and snapshot it",
        explain:
          "Whatever track you picked, stand up the environment completely and take a snapshot before you touch anything. That snapshot is your before state and your recovery point, and you will use both.",
        why: "Week 1 made this point and it matters most here. A hardening capstone with no clean snapshot cannot produce a before score, and a testing capstone with no snapshot cannot be re-run when you break the target on day three.",
        mistake:
          "Building the environment as you go. You end up unable to say what the starting state was, which undermines every measurement in the report.",
      },
      {
        id: "a-cs-cap-notes",
        title: "The working log",
        explain:
          "One file, appended to as you go. Timestamp, what you did, what happened, what you concluded. Include the things that did not work, and include the dead ends.",
        why: "The report is written from this file. Without it, day one is a blur by day four and you will spend the last day reconstructing what you did, badly, from memory and shell history.",
        example:
          "  09:20  Baseline benchmark run. 71/214 passed. Output saved to baseline.txt\n  09:45  Disabled cups, avahi, rpcbind. Rationale: no printer, no service discovery\n         needed, no NFS. Confirmed with ss -tlnp that nothing else uses them.\n  10:15  Attempted to disable postfix. Broke cron mail. Re-enabled, bound to\n         localhost instead. NOTE: worth writing up, it is a real trade-off.\n  10:40  ufw enabled. Default deny inbound. Allowed 22 from 192.168.56.10 only.\n         Verified from .20: only 22 answers.\n\nThe 10:15 entry is the one that makes the report interesting.",
      },
      {
        id: "a-cs-cap-when-stuck",
        title: "When something does not work",
        explain:
          "Timebox it. Thirty minutes, then either find another route to the same evidence or write down what you tried and why it did not work, and move on. A capstone with one honestly documented failure is stronger than one with a gap.",
        why: "Employers are not looking for somebody who never gets stuck. They are looking for somebody who notices, bounds the cost, and writes it down. That is precisely the behaviour that makes someone useful in an incident.",
        decision: {
          scenario:
            "Day four. Your detection rule will not fire on the simulated attack. You have spent two hours on it. The write-up has not been started.",
          question: "What do you do?",
          options: [
            {
              id: "a",
              text: "Keep going until it works. A detection capstone with a detection that does not fire is worthless",
              whyWrong:
                "Two hours has become four and the report has not started. The greater risk now is not the rule, it is a project with no write-up. An unfired rule with a diagnosis is a finding; no report is nothing.",
            },
            {
              id: "b",
              text: "Give it one more bounded attempt, then document what you tried, what you think the cause is and how you would confirm it, and start the write-up",
              why: "It bounds the cost, preserves the work as evidence of how you diagnose, and protects the deliverable. The documented investigation frequently reads better than a rule that simply worked.",
            },
            {
              id: "c",
              text: "Change the attack until the rule fires, so the demonstration works",
              whyWrong:
                "That is fitting the evidence to the conclusion. It also produces a rule that catches only a scenario you constructed for it, which is precisely the failure Week 11 warned about.",
            },
            {
              id: "d",
              text: "Drop the detection track and switch to hardening with three days left",
              whyWrong:
                "Starting again on day four guarantees a thin result. The work already done is salvageable as evidence, and abandoning it throws away four days for a track you cannot complete properly either.",
            },
          ],
          correct: "b",
          aftermath:
            "Write the diagnosis while it is fresh. Two paragraphs on why you believe the parser was not extracting the username is genuinely interesting to read, and it is a skill most candidates cannot demonstrate.",
        },
      },
      {
        id: "a-cs-cap-scope-discipline",
        title: "Resisting the interesting tangent",
        explain:
          "On day three you will find something fascinating that is not in your scope. Write it in the log as future work and carry on. Capstones die of interesting tangents more often than of difficulty.",
        why: "It is the same discipline as Week 10's scope creep, applied to yourself, and it is harder because nobody is going to stop you. A one-line note in the report saying what you noticed and chose not to pursue actually reads well.",
        practice: {
          prompt:
            "You notice a second vulnerability class in your target that would be interesting to explore. You have two days left. What do you do?",
          answer:
            "Record it in the log with enough detail to pick up later, note it in the report as an area you identified but did not pursue within the scope, and finish what you started. The note demonstrates that you saw it and that you can prioritise, which is two things rather than one.",
        },
      },
      {
        id: "a-cs-cap-timebox",
        title: "Reserve the last day for writing",
        explain:
          "Not the last evening. A full day, planned from the start, with no technical work in it. Writing takes longer than anybody expects and it is where the entire value of the project is realised.",
        why: "The most common capstone failure mode is excellent work with a report written in two hours at midnight. The reader cannot see the work. They can only see the report, and they will judge the work by it.",
        mistake:
          "Treating the report as documentation of what you did. It is an argument about what it means, aimed at a specific reader, and that takes drafting.",
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 3
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "cs-l59-delivering",
    moduleId: "cs-w15-capstone",
    sectionId: SECTION_ID,
    order: 3,
    title: "Delivering",
    subtitle: "Two audiences, one piece of work",
    estimatedMinutes: 11,
    intro:
      "The deliverable is a technical report, an executive summary and a short recorded walkthrough. Each is aimed at a different reader, and the ability to write for both is most of what separates a graduate from a practitioner.",

    atoms: [
      {
        id: "a-cs-cap-technical-report",
        title: "The technical report",
        explain:
          "Scope and method, what you did, what you found, evidence for each finding, and what should change. The same structure as every report in Month 3, because it is the structure the profession uses.",
        why: "Following the professional structure is itself a signal. A hiring manager who has read two hundred penetration test reports will recognise the shape in the first ten seconds, and that recognition buys you their attention for the rest.",
        table: {
          caption: "The sections, and the question each answers.",
          headers: ["Section", "Answers"],
          rows: [
            ["Scope and method", "What was examined, how, and what was not"],
            ["Findings", "What is wrong, with evidence, severity and a specific fix"],
            ["Evidence", "The request, the output, the score, the alert"],
            ["Remediation plan", "What to do first, with effort"],
            ["Limitations", "What this work does not tell you"],
            ["Future work", "What you saw and chose not to pursue"],
          ],
          note: "The limitations section is the one that marks out a serious report. It is also the one nobody expects from a student project.",
        },
      },
      {
        id: "a-cs-cap-exec-summary",
        title: "The executive summary",
        explain:
          "Half a page, written last, for somebody who will read nothing else. What was done, what the overall picture is, the two or three things that matter most, and what happens if nothing changes. No tool names and no port numbers.",
        why: "It is the hardest half page in the document and the most valuable. Almost every candidate can produce technical output; very few can say what it means in language a director understands, and that is a differentiator you can demonstrate in one paragraph.",
        example:
          "Weak:\n  \"Hardening was performed using a CIS benchmark. The score improved\n   from 71/214 to 189/214. ufw was configured and 12 services disabled.\"\n\nStronger:\n  \"The server as delivered by default would have allowed anyone on the\n   network to reach twelve services, three of which required no\n   authentication. After hardening, one service is reachable and only\n   from the administrator's workstation. Twenty-five checks were\n   deliberately not applied; each is listed with the reason and the\n   compensating control.\"",
      },
      {
        id: "a-cs-cap-demo",
        title: "The recorded walkthrough",
        explain:
          "Five to ten minutes. Show the environment, show the work, show one thing actually happening, and say what it means. Screen recording with your voice over it. No editing beyond trimming.",
        why: "It is the closest a reader gets to watching you work, and it is disproportionately persuasive. It also proves the work is yours, which a written report cannot, and that matters more than it used to.",
        mistake:
          "Narrating every click. Show the interesting moment: the alert firing, the before and after scan, the request returning somebody else's record. Then explain why it matters and stop.",
      },
      {
        id: "a-cs-cap-defending",
        title: "Defending it",
        explain:
          "Expect questions, and expect at least one you cannot fully answer. The right response is to say what you know, say what you do not, and say how you would find out. That is a better answer than a confident guess, and everyone in the room knows it.",
        why: "This is being assessed, in a capstone review and in every interview you will ever have. The field runs on people being honest about the limits of their evidence, which is why Week 12 spent so long on the difference between no evidence of access and confirmed no access.",
        decision: {
          scenario:
            "During your capstone review, a reviewer asks whether your hardening would have stopped a specific attack technique you did not test.",
          question: "What is the best answer?",
          options: [
            {
              id: "a",
              text: "Yes, because the hardening follows a recognised benchmark",
              whyWrong:
                "A benchmark does not map to specific techniques, and you have not tested it. This is a confident guess, and the reviewer asked precisely because they know you did not test it.",
            },
            {
              id: "b",
              text: "\"I did not test that. Based on what I changed, I would expect it to be prevented by the egress rules, and here is how I would confirm it.\"",
              why: "It separates what you know from what you infer, gives the reasoning behind the inference, and offers a way to settle it. That is exactly how a finding is discussed in professional practice.",
            },
            {
              id: "c",
              text: "\"That was out of scope.\"",
              whyWrong:
                "True and it closes a conversation the reviewer opened to see how you reason. Scope explains why you did not test it; it does not answer what you think and why.",
            },
            {
              id: "d",
              text: "\"I am not sure.\"",
              whyWrong:
                "Honest and incomplete. You have spent a week in this environment and have a basis for an opinion. Stopping at uncertainty gives away the part where you demonstrate judgement.",
            },
          ],
          correct: "b",
          aftermath:
            "That is the last decision in this course, and it is the same shape as the first: say what the evidence supports, say what it does not, and be clear about which is which.",
        },
      },
    ],

    task: {
      title: "The capstone",
      intro:
        "One week. One track. One complete piece of work you would be willing to put your name on.",
      prompts: [
        "Choose a track and write a one-page brief: what you will do, what you will deliver, what evidence you will capture, and what it will let a reader conclude. Cut it until it fits a week.",
        "Write the rules of engagement, even though the target is your own. Naming the authorisation and the scope is the habit, and reviewers look for it.",
        "Build the environment completely and snapshot it before touching anything. Capture your before state now.",
        "Execute, keeping a timestamped working log as you go, including what did not work.",
        "Reserve the final day entirely for the write-up. Produce the technical report, then the executive summary last.",
        "Record a five to ten minute walkthrough showing one thing actually happening and explaining what it means.",
        "Publish the package somewhere a stranger can read it, with no client data, no real credentials and no target that was not yours.",
      ],
      closing:
        "When it is finished, read the executive summary as though you were a director with four minutes. If it does not tell them whether to be worried and what to do, rewrite it. That paragraph is what gets you interviews.",
    },

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
