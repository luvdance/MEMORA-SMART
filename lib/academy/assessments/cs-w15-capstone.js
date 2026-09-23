/**
 * ASSESSMENTS · CYBERSECURITY · WEEK 15 · CAPSTONE
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Never import this from anything under src/.
 * ═════════════════════════════════════════════════════════════════════════
 */

export const ASSESSMENTS = {
  /* ═══════════════════════════════════════════════════════════════════ */
  "cs-l57-scoping": {
    lessonId: "cs-l57-scoping",
    passMark: 70,
    questions: [
      {
        id: "csq57-1",
        type: "scenario",
        difficulty: 3,
        atomId: "a-cs-cap-scoping",
        prompt:
          "You have one week and propose building, hardening, testing, monitoring and writing up a three-tier cloud application. What is the right adjustment?",
        options: [
          { id: "a", text: "Keep the scope and work longer hours" },
          {
            id: "b",
            text: "Pick one track, do it thoroughly on an environment you already have, and reserve a full day for the write-up",
          },
          { id: "c", text: "Keep all six parts and write shorter reports for each" },
          { id: "d", text: "Drop the write-up and deliver technical work with screenshots" },
        ],
        correct: "b",
        explanation:
          "A finished small project reads as competence. An unfinished large one reads as somebody who cannot estimate, which is a fair conclusion for an employer to draw.",
        whyWrong: {
          a: "The likely outcome is six partial pieces and no report. Ambition shown by a finished project is worth far more.",
          c: "Six thin reports are harder to write than one good one and demonstrate less. The work behind them is the constraint.",
          d: "That removes the most differentiating part. Plenty of candidates run tools; the ones hired explain what the output meant.",
        },
      },
      {
        id: "csq57-2",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cs-cap-what-it-proves",
        prompt: "Why does documentation matter more than technical sophistication in a capstone?",
        options: [
          { id: "a", text: "Because assessors do not understand the technical work" },
          {
            id: "b",
            text: "Because the reader gets ten minutes, and being able to explain the work is the part most candidates cannot do",
          },
          { id: "c", text: "Because technical work cannot be verified" },
          { id: "d", text: "Because writing is easier to grade" },
        ],
        correct: "b",
        explanation:
          "Technically impressive and undocumented is worth almost nothing to a hiring manager. Modest, complete and clearly written demonstrates the part of the job that actually differentiates.",
        whyWrong: {
          a: "Assessors are usually practitioners, and they still only have ten minutes.",
          c: "It can be verified and the recorded walkthrough exists precisely for that.",
          d: "Grading convenience has nothing to do with what the deliverable is for.",
        },
      },
      {
        id: "csq57-3",
        type: "mcq",
        difficulty: 3,
        atomId: "a-cs-cap-evidence-plan",
        prompt: "Why decide what evidence you need before starting the work?",
        options: [
          { id: "a", text: "To estimate how long it will take" },
          {
            id: "b",
            text: "Because most missing evidence could only have been captured at a moment that has passed, such as a before-state benchmark",
          },
          { id: "c", text: "Because evidence requirements are set by the assessor" },
          { id: "d", text: "To choose which tools to install" },
        ],
        correct: "b",
        explanation:
          "A before-and-after claim needs a before run, which is easy to forget once you have started changing things, and impossible to reconstruct afterwards.",
        whyWrong: {
          a: "Estimation is useful and is a different exercise from listing what proves each claim.",
          c: "The claims are yours, so the evidence requirements follow from them.",
          d: "Tooling follows from the track, and it is not what gets lost.",
        },
      },
      {
        id: "csq57-4",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cs-cap-authorisation",
        prompt:
          "Your friend works at a company and says you can test their web application for your capstone. Is that sufficient?",
        options: [
          { id: "a", text: "Yes, since you have an insider's invitation" },
          {
            id: "b",
            text: "No. Week 9's answer has not changed: you need written authorisation from somebody with authority over the system",
          },
          { id: "c", text: "Yes, if you only test read-only" },
          { id: "d", text: "Yes, if you do not publish the results" },
        ],
        correct: "b",
        explanation:
          "A capstone against a real target is more impressive right up until it is a criminal offence, and it would be, on its own, a reason not to hire you.",
        whyWrong: {
          a: "A friend who works there almost certainly cannot authorise security testing, and the invitation is verbal.",
          c: "Read-only is still unauthorised access. The offence does not depend on whether you changed anything.",
          d: "Publication is a separate question. The testing itself is what requires authorisation.",
        },
      },
      {
        id: "csq57-5",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cs-cap-three-tracks",
        prompt:
          "You want a security operations role. Which capstone track speaks most directly to it?",
        options: [
          { id: "a", text: "Harden a system and measure the improvement" },
          { id: "b", text: "Build a detection pipeline and prove it catches a simulated attack" },
          { id: "c", text: "Run an authorised penetration test and report it" },
          { id: "d", text: "Any of them; the track does not matter" },
        ],
        correct: "b",
        explanation:
          "Log pipeline, detection rules, a simulated attack and the triage notes it produced is the daily work of the role, and it lets a hiring manager picture you doing it.",
        whyWrong: {
          a: "Valuable, and it speaks to infrastructure and cloud roles rather than to operations.",
          c: "Excellent for consultancy and testing roles, and further from the SOC queue.",
          d: "All three demonstrate competence, and picking the matching one is a free advantage.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "cs-l58-executing": {
    lessonId: "cs-l58-executing",
    passMark: 70,
    questions: [
      {
        id: "csq58-1",
        type: "scenario",
        difficulty: 3,
        atomId: "a-cs-cap-when-stuck",
        prompt:
          "Day four. Your detection will not fire, you have spent two hours, and the write-up has not started. What do you do?",
        options: [
          { id: "a", text: "Keep going until it works" },
          {
            id: "b",
            text: "One more bounded attempt, then document what you tried, what you think the cause is and how you would confirm it, and start writing",
          },
          { id: "c", text: "Change the attack until the rule fires" },
          { id: "d", text: "Switch to the hardening track" },
        ],
        correct: "b",
        explanation:
          "An unfired rule with a diagnosis is a finding. No report is nothing. The documented investigation frequently reads better than a rule that simply worked.",
        whyWrong: {
          a: "Two hours becomes four and the greater risk is now a project with no write-up.",
          c: "That is fitting the evidence to the conclusion, and it produces a rule that only catches a scenario you built for it.",
          d: "Starting again on day four guarantees a thin result and throws away four days of salvageable evidence.",
        },
      },
      {
        id: "csq58-2",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cs-cap-notes",
        prompt: "Why record the things that did not work in your capstone log?",
        options: [
          { id: "a", text: "To make the log longer" },
          {
            id: "b",
            text: "Because they are the most interesting entries in the report, showing real trade-offs and how you diagnosed them",
          },
          { id: "c", text: "Because assessors require a failure count" },
          { id: "d", text: "To avoid repeating them" },
        ],
        correct: "b",
        explanation:
          "The entry where disabling a service broke cron mail, and you bound it to localhost instead, is a genuine trade-off. That is what makes a report read like professional work.",
        whyWrong: {
          a: "Length is not a virtue in any of these documents.",
          c: "No such requirement exists, and a count would be meaningless.",
          d: "A real benefit and a secondary one. The primary value is what it demonstrates to a reader.",
        },
      },
      {
        id: "csq58-3",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cs-cap-timebox",
        prompt: "Why reserve a full day for the write-up rather than the last evening?",
        options: [
          { id: "a", text: "Because reports must be a certain length" },
          {
            id: "b",
            text: "Because the reader cannot see the work, only the report, and writing takes longer than anybody expects",
          },
          { id: "c", text: "Because assessors mark the report separately" },
          { id: "d", text: "Because technical work always finishes early" },
        ],
        correct: "b",
        explanation:
          "The most common capstone failure is excellent work with a report written in two hours at midnight. The work is judged by the report, because that is all there is to judge it by.",
        whyWrong: {
          a: "No length requirement exists, and padding makes it worse.",
          c: "Whether it is marked separately does not change that it is the only visible artefact.",
          d: "Technical work reliably overruns, which is why the writing day has to be protected in advance.",
        },
      },
      {
        id: "csq58-4",
        type: "scenario",
        difficulty: 2,
        atomId: "a-cs-cap-scope-discipline",
        prompt:
          "With two days left you find a second vulnerability class that would be interesting to explore. What do you do?",
        options: [
          { id: "a", text: "Explore it; finding more is better" },
          {
            id: "b",
            text: "Record it in the log, note it in the report as identified but not pursued, and finish what you started",
          },
          { id: "c", text: "Ignore it entirely and say nothing" },
          { id: "d", text: "Restart the project around the more interesting finding" },
        ],
        correct: "b",
        explanation:
          "The note demonstrates that you saw it and that you can prioritise, which is two things rather than one. Capstones die of interesting tangents more often than of difficulty.",
        whyWrong: {
          a: "With two days left, exploring it means finishing neither, and the scope discipline is itself being assessed.",
          c: "Saying nothing wastes an observation that reads well and costs one line.",
          d: "Restarting with two days left guarantees an unfinished project.",
        },
      },
      {
        id: "csq58-5",
        type: "truefalse",
        difficulty: 2,
        atomId: "a-cs-cap-environment",
        prompt:
          "Building the environment as you go is acceptable, since the finished state is what matters.",
        options: [
          { id: "a", text: "True" },
          { id: "b", text: "False" },
        ],
        correct: "b",
        explanation:
          "False. You end up unable to say what the starting state was, which undermines every measurement in the report, and you have no snapshot to return to when you break the target on day three.",
        whyWrong: {
          a: "The finished state is only meaningful relative to a starting state you can show, which is why the before snapshot is taken first.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "cs-l59-delivering": {
    lessonId: "cs-l59-delivering",
    passMark: 70,
    questions: [
      {
        id: "csq59-1",
        type: "scenario",
        difficulty: 3,
        atomId: "a-cs-cap-defending",
        prompt:
          "A reviewer asks whether your hardening would stop a technique you did not test. What is the best answer?",
        options: [
          { id: "a", text: "Yes, because the hardening follows a recognised benchmark" },
          {
            id: "b",
            text: "\"I did not test that. Based on what I changed I would expect the egress rules to prevent it, and here is how I would confirm it.\"",
          },
          { id: "c", text: "\"That was out of scope.\"" },
          { id: "d", text: "\"I am not sure.\"" },
        ],
        correct: "b",
        explanation:
          "It separates what you know from what you infer, gives the reasoning, and offers a way to settle it. That is how findings are discussed in professional practice.",
        whyWrong: {
          a: "A benchmark does not map to specific techniques, and the reviewer asked because they know you did not test it.",
          c: "True, and it closes a conversation opened to see how you reason. Scope explains why, not what you think.",
          d: "Honest and incomplete. A week in the environment gives you a basis for an opinion.",
        },
      },
      {
        id: "csq59-2",
        type: "mcq",
        difficulty: 3,
        atomId: "a-cs-cap-exec-summary",
        prompt: "Which executive summary is stronger, and why?",
        options: [
          {
            id: "a",
            text: "\"Score improved from 71/214 to 189/214 using a CIS benchmark; ufw configured and 12 services disabled\"",
          },
          {
            id: "b",
            text: "\"As delivered, anyone on the network could reach twelve services, three requiring no authentication. Now one is reachable, from the administrator's workstation only.\"",
          },
          { id: "c", text: "Both are equivalent; the numbers are the same" },
          { id: "d", text: "The first, because it is quantified" },
        ],
        correct: "b",
        explanation:
          "It says what the state meant rather than what was done, in language a director can act on. The numbers belong in the findings, where somebody who wants them will look.",
        whyWrong: {
          a: "It reports activity and tool names. The reader cannot tell from it whether to be worried.",
          c: "They contain similar facts and communicate very different things, which is the whole point of the section.",
          d: "The second is also quantified, in terms of exposure rather than checks passed.",
        },
      },
      {
        id: "csq59-3",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cs-cap-technical-report",
        prompt: "Which section marks out a serious report and is rarely present in a student project?",
        options: [
          { id: "a", text: "The findings" },
          { id: "b", text: "Limitations: what this work does not tell you" },
          { id: "c", text: "The tool list" },
          { id: "d", text: "The methodology" },
        ],
        correct: "b",
        explanation:
          "Stating what the work does not cover is the same discipline as Week 12's distinction between no evidence of access and confirmed no access, and it is what makes the rest credible.",
        whyWrong: {
          a: "Every report has findings. Their presence distinguishes nothing.",
          c: "A tool list is the least valuable section and is often padding.",
          d: "Methodology is expected and is present in most reports.",
        },
      },
      {
        id: "csq59-4",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cs-cap-demo",
        prompt: "What should a recorded walkthrough show?",
        options: [
          { id: "a", text: "Every step of the work, narrated in order" },
          {
            id: "b",
            text: "The environment, one thing actually happening, and what it means",
          },
          { id: "c", text: "A slide presentation of the findings" },
          { id: "d", text: "The full report, read aloud" },
        ],
        correct: "b",
        explanation:
          "It is the closest a reader gets to watching you work, and it is disproportionately persuasive. It also proves the work is yours, which a written report cannot.",
        whyWrong: {
          a: "Narrating every click loses the viewer in the first two minutes.",
          c: "Slides repeat the report and remove the only thing the recording adds, which is seeing it happen.",
          d: "Reading the report aloud duplicates a document the viewer can already read faster.",
        },
      },
      {
        id: "csq59-5",
        type: "truefalse",
        difficulty: 2,
        atomId: "a-cs-cap-exec-summary",
        prompt: "The executive summary should be written first, to frame the work.",
        options: [
          { id: "a", text: "True" },
          { id: "b", text: "False" },
        ],
        correct: "b",
        explanation:
          "False. It is written last, because it summarises conclusions you do not have until the work is done. Written first it becomes a statement of intent that the findings then have to be forced to match.",
        whyWrong: {
          a: "Framing the work in advance is what the brief is for. The summary reports what was actually found.",
        },
      },
    ],
  },
};

export default ASSESSMENTS;
