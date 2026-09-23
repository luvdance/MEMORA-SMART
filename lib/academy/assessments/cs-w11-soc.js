/**
 * ASSESSMENTS · CYBERSECURITY · WEEK 11 · SOC, SIEM & DETECTION
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Never import this from anything under src/.
 * ═════════════════════════════════════════════════════════════════════════
 */

export const ASSESSMENTS = {
  /* ═══════════════════════════════════════════════════════════════════ */
  "cs-l41-inside-a-soc": {
    lessonId: "cs-l41-inside-a-soc",
    passMark: 70,
    questions: [
      {
        id: "csq41-1",
        type: "scenario",
        difficulty: 3,
        atomId: "a-cs-soc-log-integrity",
        prompt:
          "A company keeps 90 days of logs on each server and backs the servers up weekly. What is the gap?",
        options: [
          { id: "a", text: "Ninety days is too short" },
          {
            id: "b",
            text: "The logs live on the machines they describe, so an attacker with administrator rights can alter them. They must be forwarded off the host",
          },
          { id: "c", text: "Weekly backups are too infrequent" },
          { id: "d", text: "They need a SIEM before this matters" },
        ],
        correct: "b",
        explanation:
          "Anyone with administrator rights can edit or delete a machine's logs. Forwarding as the log is written puts the record somewhere the compromised host cannot reach, which is what makes retention a meaningful question at all.",
        whyWrong: {
          a: "Retention is the second question. A year of logs an attacker could edit is a year of unreliable data.",
          c: "A backup taken after the compromise contains whatever the attacker left, so more frequent copies of the same files do not help.",
          d: "Forwarding to any write-once destination already solves the integrity problem. Making it conditional on a purchase delays the free part.",
        },
      },
      {
        id: "csq41-2",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cs-soc-log-sources",
        prompt:
          "Which two log sources are most commonly under-collected relative to how often they answer the question?",
        options: [
          { id: "a", text: "Authentication logs and firewall logs" },
          { id: "b", text: "DNS query logs and cloud audit logs" },
          { id: "c", text: "Web server access logs and mail logs" },
          { id: "d", text: "Endpoint telemetry and antivirus logs" },
        ],
        correct: "b",
        explanation:
          "DNS tells you which names were looked up, which is excellent value for the volume, and cloud audit logs tell you who changed which permission. Both are frequently assumed to be collected and are not.",
        whyWrong: {
          a: "Both are almost always collected first, because everybody thinks of them.",
          c: "Web and mail logs are usually present, and they answer narrower questions.",
          d: "Endpoint telemetry is increasingly standard and is rarely the surprise gap.",
        },
      },
      {
        id: "csq41-3",
        type: "mcq",
        difficulty: 3,
        atomId: "a-cs-soc-normalisation",
        prompt:
          "Why do timestamps cause more difficulty than any other part of normalisation?",
        options: [
          { id: "a", text: "Because they take up storage" },
          {
            id: "b",
            text: "Because a log in local time, one in UTC and one with no timezone cannot be placed on a single timeline",
          },
          { id: "c", text: "Because they are frequently missing entirely" },
          { id: "d", text: "Because SIEMs cannot sort by time" },
        ],
        correct: "b",
        explanation:
          "Building a timeline is the entire job in an investigation, and it is impossible if three sources disagree about what time it was. This is the detail that costs the most hours in practice.",
        whyWrong: {
          a: "Storage is trivial for a timestamp field.",
          c: "They are usually present. Being present in three incompatible formats is the problem.",
          d: "Sorting is exactly what a SIEM does well, on data that has been normalised first.",
        },
      },
      {
        id: "csq41-4",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cs-soc-what-it-is",
        prompt: "What distinguishes tier three work from tier one?",
        options: [
          { id: "a", text: "Tier three handles more alerts per day" },
          {
            id: "b",
            text: "Tier three hunts for what no detection fired on, and writes the detections that would have",
          },
          { id: "c", text: "Tier three has access to more tools" },
          { id: "d", text: "Tier three only handles confirmed incidents" },
        ],
        correct: "b",
        explanation:
          "Tier one works the queue. Tier three asks what is not in the queue, which is why the route out of tier one is asking why a detection did not fire rather than just closing the ticket.",
        whyWrong: {
          a: "Tier one handles the volume. Tier three handles depth.",
          c: "Tooling access follows the role and is not what defines it.",
          d: "That is closer to tier two's work. Tier three is largely proactive.",
        },
      },
      {
        id: "csq41-5",
        type: "scenario",
        difficulty: 3,
        atomId: "a-cs-soc-alert-lifecycle",
        prompt:
          "An alert fires 200 times a day and is benign every time. What is the wrong response?",
        options: [
          { id: "a", text: "Tune it so it fires only on the cases that matter" },
          { id: "b", text: "Turn it off and record that you did and why" },
          { id: "c", text: "Leave it on and close it 200 times a day" },
          { id: "d", text: "Add enrichment that suppresses the known benign cases" },
        ],
        correct: "c",
        explanation:
          "It trains the whole team to close that alert without reading it, including on the day it is real. The alert is already effectively disabled, without anyone having decided to disable it.",
        whyWrong: {
          a: "Tuning is the first correct response and keeps the detection value.",
          b: "Turning it off deliberately, with a record, is legitimate. What is not legitimate is turning it off by habit.",
          d: "Suppression through enrichment is tuning by another name and is a good answer.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "cs-l42-writing-detections": {
    lessonId: "cs-l42-writing-detections",
    passMark: 70,
    questions: [
      {
        id: "csq42-1",
        type: "scenario",
        difficulty: 3,
        atomId: "a-cs-soc-first-rule",
        prompt:
          "A rule alerting on every failed login catches the brute force and also alerts on three people who mistyped. What fixes it?",
        options: [
          { id: "a", text: "Adding the attacker's source address to the rule" },
          {
            id: "b",
            text: "Counting failures grouped by account and alerting above a threshold",
          },
          { id: "c", text: "Excluding the three users who mistyped" },
          { id: "d", text: "Only alerting on accounts marked privileged" },
        ],
        correct: "b",
        explanation:
          "What separates the attack from a typo is not what happened but how many times it happened to the same account. The resulting rule mentions no address, country or account name, so it still works next month.",
        whyWrong: {
          a: "That rule will never fire again, because the address changes. It also gives everyone the comfortable feeling the gap is closed.",
          c: "Excluding specific users excludes them permanently, including when they are the ones being attacked.",
          d: "It narrows the noise and also stops you detecting guessing against ordinary accounts, which is where attackers usually start.",
        },
      },
      {
        id: "csq42-2",
        type: "mcq",
        difficulty: 3,
        atomId: "a-cs-soc-thresholds",
        prompt:
          "Why does a rule that counts failed logins grouped by username miss password spraying?",
        options: [
          { id: "a", text: "Because spraying uses successful logins" },
          {
            id: "b",
            text: "Because spraying tries one or two passwords against many accounts, so no single account reaches the threshold",
          },
          { id: "c", text: "Because spraying happens too slowly to count" },
          { id: "d", text: "Because spraying does not generate log events" },
        ],
        correct: "b",
        explanation:
          "Brute force and spraying are the same events grouped differently. Spraying needs a rule grouped by source address, which is why the grouping field matters as much as the condition.",
        whyWrong: {
          a: "Spraying generates failures like any guessing. Successes are the outcome it is hoping for.",
          c: "Slow spraying is a real evasion and the structural reason a username-grouped rule misses it is the grouping.",
          d: "Every attempt is logged. The question is how you count them.",
        },
      },
      {
        id: "csq42-3",
        type: "scenario",
        difficulty: 3,
        atomId: "a-cs-soc-tuning",
        prompt:
          "A rule for foreign successful logins alerts on the attack and also on one colleague working from Accra. Is that acceptable?",
        options: [
          { id: "a", text: "No. Any false positive means the rule needs narrowing" },
          {
            id: "b",
            text: "Yes. One benign alert a week is cheap, and tuning it to zero would have to exclude something that also excludes the attack",
          },
          { id: "c", text: "No. Add the colleague's country to an exclusion list" },
          { id: "d", text: "Yes, but only if the colleague is notified" },
        ],
        correct: "b",
        explanation:
          "Demanding zero false positives is how you end up with a rule that misses the attack. Thirty seconds of analyst time a week is the price of catching two unauthorised logins.",
        whyWrong: {
          a: "A zero-false-positive target produces rules so narrow they detect only the historical example.",
          c: "Excluding Ghana means an attacker operating from Ghana is invisible, which is a worse trade than one alert a week.",
          d: "Notifying the colleague is courteous and does nothing about whether the rule is correctly tuned.",
        },
      },
      {
        id: "csq42-4",
        type: "scenario",
        difficulty: 3,
        atomId: "a-cs-soc-alert-fatigue",
        prompt:
          "A detection fires forty times a day, has been right twice in eight months, and is bulk-closed each morning. What should you do?",
        options: [
          { id: "a", text: "Leave it on; it has caught real attacks" },
          {
            id: "b",
            text: "Tune it against the benign cases, then verify it would still catch the two known true positives",
          },
          { id: "c", text: "Turn it off, since it is 99.8% wrong" },
          { id: "d", text: "Route it to a weekly review queue" },
        ],
        correct: "b",
        explanation:
          "It keeps the detection value and restores the attention. Testing the tuned rule against known true positives is what turns tuning from guesswork into engineering.",
        whyWrong: {
          a: "It is already effectively disabled. Bulk-closing forty a day will apply to the third real one exactly as it applied to today's forty.",
          c: "That removes a detection that has twice caught something real, without attempting the fix.",
          d: "This is turning it off while feeling responsible. Active attacker behaviour reviewed seven days later is not a detection.",
        },
      },
      {
        id: "csq42-5",
        type: "truefalse",
        difficulty: 2,
        atomId: "a-cs-soc-what-detection-is",
        prompt:
          "A detection written around the specific attack you just saw, including the attacker's IP address, is a good first response to an incident.",
        options: [
          { id: "a", text: "True" },
          { id: "b", text: "False" },
        ],
        correct: "b",
        explanation:
          "False. It will never fire again, because the address changes, and it gives everybody the comfortable feeling that the gap is closed. Detect the behaviour, not the artefact.",
        whyWrong: {
          a: "Blocking a known address is a reasonable immediate containment action. Calling it a detection is what makes it dangerous, because the gap is then assumed to be covered.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "cs-l43-triage": {
    lessonId: "cs-l43-triage",
    passMark: 70,
    questions: [
      {
        id: "csq43-1",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cs-soc-triage-questions",
        prompt: "Why does triage start with \"what does this detection actually look for?\"",
        options: [
          { id: "a", text: "To check whether the rule is tuned" },
          {
            id: "b",
            text: "Because without it you can spend twenty minutes investigating a host before realising the rule fires on something the backup software does nightly",
          },
          { id: "c", text: "Because it is required for the ticket" },
          { id: "d", text: "To decide whether to escalate" },
        ],
        correct: "b",
        explanation:
          "Asked first, most alerts resolve in a few minutes. Asked last, an analyst investigates the wrong thing entirely and then works out why it did not make sense.",
        whyWrong: {
          a: "Tuning is a later conclusion, and it often follows from the answer rather than being the question.",
          c: "It is on the ticket because it is useful, not the other way round.",
          d: "Escalation is the last question, after you know what you are looking at.",
        },
      },
      {
        id: "csq43-2",
        type: "mcq",
        difficulty: 3,
        atomId: "a-cs-soc-true-benign",
        prompt:
          "An alert correctly identified activity that turned out to be an authorised change. How should it be recorded?",
        options: [
          { id: "a", text: "False positive" },
          { id: "b", text: "Benign true positive, with a note that enrichment from the change system would suppress it" },
          { id: "c", text: "True positive" },
          { id: "d", text: "Unresolved" },
        ],
        correct: "b",
        explanation:
          "The detection worked perfectly. What was missing was the knowledge that a change window existed, which is an enrichment gap rather than a rule defect. Recording it as a false positive destroys the tuning data.",
        whyWrong: {
          a: "That would send somebody to weaken a rule that is behaving correctly.",
          c: "It identified real activity that was authorised, which is a different outcome with a different follow-up.",
          d: "It was resolved. The activity was explained and confirmed.",
        },
      },
      {
        id: "csq43-3",
        type: "scenario",
        difficulty: 3,
        atomId: "a-cs-soc-escalation",
        prompt:
          "At 02:40 a privileged account logs in successfully from another country. No change ticket, owner unreachable. What do you do?",
        options: [
          { id: "a", text: "Wait until morning to confirm with the owner" },
          {
            id: "b",
            text: "Escalate now and take the containment steps your runbook permits, such as forcing a session reset",
          },
          { id: "c", text: "Close it as benign; senior administrators work odd hours" },
          { id: "d", text: "Monitor the account and escalate if anything else happens" },
        ],
        correct: "b",
        explanation:
          "Every factor points the same way, and the costs of being wrong are wildly asymmetric. If it is the administrator in a hotel, they are inconvenienced for twenty minutes.",
        whyWrong: {
          a: "That gives an attacker with privileged access six unmonitored hours, which is more than enough for persistence.",
          c: "That is an assumption standing in for a confirmation, and you explicitly could not confirm it.",
          d: "Watching an attacker with privileged access is a decision to let them continue, and it is never a tier one decision at 02:40.",
        },
      },
      {
        id: "csq43-4",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cs-soc-enrichment",
        prompt: "What does enrichment change about triage?",
        options: [
          { id: "a", text: "It reduces the number of alerts generated" },
          {
            id: "b",
            text: "It attaches context automatically, turning a twenty-minute triage into a four-minute one",
          },
          { id: "c", text: "It improves detection accuracy" },
          { id: "d", text: "It replaces the need for escalation" },
        ],
        correct: "b",
        explanation:
          "Account owner, account type, address reputation, user history, open change tickets. Multiplied across every alert in the queue, this is where most SOC improvement actually comes from.",
        whyWrong: {
          a: "The same alerts fire. What changes is how quickly each can be resolved.",
          c: "The rule matches the same events. Enrichment helps the human, not the match.",
          d: "It makes escalation decisions better informed rather than unnecessary.",
        },
      },
      {
        id: "csq43-5",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cs-soc-documentation",
        prompt:
          "Which line of a triage note do people most often omit, and why does it matter?",
        options: [
          { id: "a", text: "The conclusion, because it feels obvious" },
          {
            id: "b",
            text: "What they checked and found nothing, because it tells the next person where not to look again",
          },
          { id: "c", text: "The timestamp, because the ticket has one" },
          { id: "d", text: "The actions taken, because they are in the change log" },
        ],
        correct: "b",
        explanation:
          "Alerts recur. Six weeks later somebody sees the same thing and either resolves it in ninety seconds using your note or repeats your whole investigation.",
        whyWrong: {
          a: "The conclusion is usually the one line people do write.",
          c: "Timestamps are captured automatically and are rarely the omission.",
          d: "Actions are normally recorded, and the change log will not say why they were taken.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "cs-l44-intel-and-attack": {
    lessonId: "cs-l44-intel-and-attack",
    passMark: 70,
    questions: [
      {
        id: "csq44-1",
        type: "mcq",
        difficulty: 3,
        atomId: "a-cs-soc-pyramid",
        prompt:
          "Why is detecting on a technique more valuable than detecting on a file hash?",
        options: [
          { id: "a", text: "Because hashes are hard to collect" },
          {
            id: "b",
            text: "Because changing a hash costs a recompile, while changing a technique means changing how they operate",
          },
          { id: "c", text: "Because techniques are easier to detect" },
          { id: "d", text: "Because hashes are not shared between organisations" },
        ],
        correct: "b",
        explanation:
          "The pyramid of pain ranks indicators by what detection costs the attacker. A hash block inconveniences them for minutes; a behavioural detection forces a rework of their methodology.",
        whyWrong: {
          a: "Hashes are trivial to collect, which is part of why they dominate indicator feeds.",
          c: "Techniques are considerably harder to detect. The value is in what they cost the attacker, not in the ease.",
          d: "Hashes are the most widely shared indicator type there is.",
        },
      },
      {
        id: "csq44-2",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cs-soc-intel",
        prompt:
          "What is the limitation of building a detection programme on indicator feeds?",
        options: [
          { id: "a", text: "The feeds are usually inaccurate" },
          {
            id: "b",
            text: "It catches attackers reusing infrastructure somebody already reported, which is the least capable ones",
          },
          { id: "c", text: "Feeds are too expensive for small organisations" },
          { id: "d", text: "Indicators cannot be automated" },
        ],
        correct: "b",
        explanation:
          "It also produces a steady stream of alerts about addresses that were malicious last March. Feeds are useful as one input and cannot be the programme.",
        whyWrong: {
          a: "Quality varies and accuracy is not the structural limitation. Freshness and attacker cost are.",
          c: "Excellent free feeds exist. Cost is not the constraint.",
          d: "Indicator matching is the most easily automated detection there is, which is part of its appeal.",
        },
      },
      {
        id: "csq44-3",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cs-soc-attack",
        prompt:
          "A detection for repeated failed logins maps to which ATT&CK tactic?",
        options: [
          { id: "a", text: "Initial access" },
          { id: "b", text: "Credential access" },
          { id: "c", text: "Persistence" },
          { id: "d", text: "Impact" },
        ],
        correct: "b",
        explanation:
          "Brute force is a credential access technique: the attacker is trying to obtain a valid credential. Initial access would be how they first reached the environment.",
        whyWrong: {
          a: "Initial access covers how they got in, such as phishing or an exposed service.",
          c: "Persistence is about maintaining access once obtained, such as a scheduled task.",
          d: "Impact covers the damage, such as encryption or destruction.",
        },
      },
      {
        id: "csq44-4",
        type: "scenario",
        difficulty: 3,
        atomId: "a-cs-soc-mapping",
        prompt:
          "A SOC has twelve detections: eight for initial access and four for execution. What does that tell you?",
        options: [
          { id: "a", text: "They are well covered for the most common attacks" },
          {
            id: "b",
            text: "They are blind after the first two stages, so persistence, lateral movement and exfiltration go unmonitored",
          },
          { id: "c", text: "They have too many detections for initial access" },
          { id: "d", text: "Nothing, without knowing the alert volumes" },
        ],
        correct: "b",
        explanation:
          "An attacker who gets past the first two stages, which is the whole point of the later stages existing, proceeds with nothing watching. Those later stages are where you would still have time to act.",
        whyWrong: {
          a: "Coverage at the start is valuable and is not sufficient, because prevention at the start fails routinely.",
          c: "Eight is not obviously too many. The problem is the zero everywhere else.",
          d: "Volume affects whether the rules are usable. The structural gap is visible from the map alone.",
        },
      },
      {
        id: "csq44-5",
        type: "scenario",
        difficulty: 3,
        atomId: "a-cs-soc-coverage",
        prompt:
          "On a coverage map for the board, how do you colour techniques whose rules fire constantly and are bulk-closed?",
        options: [
          { id: "a", text: "Green, because a detection exists" },
          {
            id: "b",
            text: "Amber, with a note that the rule exists but is not operationally effective and what would fix it",
          },
          { id: "c", text: "Red, since nobody reads the alerts" },
          { id: "d", text: "Leave them off the map" },
        ],
        correct: "b",
        explanation:
          "Accurate, actionable, and it turns the map into a funding conversation. The note is what makes amber useful rather than vague.",
        whyWrong: {
          a: "That converts a known gap into an unknown one, and nobody revisits it until an incident.",
          c: "Closer to honest and it discards real information. A rule needing tuning is nearer coverage than no rule at all.",
          d: "Omission reads as no coverage at all, understating what exists and hiding the specific problem.",
        },
      },
    ],
  },
};

export default ASSESSMENTS;
