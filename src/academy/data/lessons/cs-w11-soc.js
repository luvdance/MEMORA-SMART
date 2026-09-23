/**
 * CYBERSECURITY · WEEK 11 · DEFENSIVE SECURITY — SOC, SIEM & DETECTION
 *
 * Harvard anchor: the defensive counterpart to the offensive weeks. Detecting
 * the activity learners have just practised.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 *
 * The two detection exercises are graded on detection QUALITY rather than on
 * matching an author's string: catch every attack event, within the false
 * positive budget the brief allows. Several different correct rules pass,
 * which is also true in a real SOC.
 *
 * The second exercise deliberately has a non-zero false positive budget. A
 * rule that alerts once a week on a colleague working from Accra is a good
 * rule. Teaching learners to demand zero false positives produces rules that
 * miss attacks, which is the more expensive failure.
 */

export const SECTION_ID = "cs-s11-soc";

/** Authentication events across one morning. */
const AUTH_LOG = [
  { id: "e1", time: "09:02", username: "ada", sourceIp: "102.89.4.31", outcome: "success", country: "NG" },
  { id: "e2", time: "09:14", username: "bola", sourceIp: "102.89.4.77", outcome: "failure", country: "NG" },
  { id: "e3", time: "09:15", username: "bola", sourceIp: "102.89.4.77", outcome: "success", country: "NG" },
  { id: "e4", time: "09:41", username: "chuka", sourceIp: "41.58.2.9", outcome: "failure", country: "NG" },
  { id: "e5", time: "10:03", username: "finance-admin", sourceIp: "185.220.101.4", outcome: "failure", country: "RU", attack: true },
  { id: "e6", time: "10:03", username: "finance-admin", sourceIp: "185.220.101.4", outcome: "failure", country: "RU", attack: true },
  { id: "e7", time: "10:03", username: "finance-admin", sourceIp: "185.220.101.4", outcome: "failure", country: "RU", attack: true },
  { id: "e8", time: "10:04", username: "finance-admin", sourceIp: "185.220.101.4", outcome: "failure", country: "RU", attack: true },
  { id: "e9", time: "10:04", username: "finance-admin", sourceIp: "185.220.101.4", outcome: "failure", country: "RU", attack: true },
  { id: "e10", time: "10:04", username: "finance-admin", sourceIp: "185.220.101.4", outcome: "failure", country: "RU", attack: true },
  { id: "e11", time: "10:22", username: "ngozi", sourceIp: "102.89.4.52", outcome: "failure", country: "NG" },
  { id: "e12", time: "10:23", username: "ngozi", sourceIp: "102.89.4.52", outcome: "success", country: "NG" },
];

/** A later log, where the guessing stopped and something worked. */
const SUCCESS_LOG = [
  { id: "t1", time: "08:55", username: "ada", sourceIp: "102.89.4.31", outcome: "success", country: "NG" },
  { id: "t2", time: "09:10", username: "bola", sourceIp: "102.89.4.77", outcome: "success", country: "NG" },
  { id: "t3", time: "09:30", username: "chuka", sourceIp: "41.58.2.9", outcome: "failure", country: "NG" },
  { id: "t4", time: "11:47", username: "finance-admin", sourceIp: "185.220.101.4", outcome: "success", country: "RU", attack: true },
  { id: "t5", time: "11:52", username: "finance-admin", sourceIp: "185.220.101.4", outcome: "success", country: "RU", attack: true },
  { id: "t6", time: "12:01", username: "ngozi", sourceIp: "102.89.4.52", outcome: "success", country: "NG" },
  { id: "t7", time: "12:30", username: "ada", sourceIp: "102.89.4.31", outcome: "failure", country: "NG" },
  { id: "t8", time: "13:04", username: "tunde", sourceIp: "154.160.8.12", outcome: "success", country: "GH" },
];

const AUTH_FIELDS = [
  { id: "username", label: "User" },
  { id: "sourceIp", label: "Source IP" },
  { id: "outcome", label: "Outcome", values: ["success", "failure"] },
  { id: "country", label: "Country", values: ["NG", "RU", "GH"] },
];

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 1
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "cs-l41-inside-a-soc",
    moduleId: "cs-w11-soc",
    sectionId: SECTION_ID,
    order: 1,
    title: "Inside a Security Operations Centre",
    subtitle: "What the job actually is",
    estimatedMinutes: 11,
    intro:
      "A SOC is not a room of people watching a world map with red lines on it. It is a queue, a set of detections that fill it, and a process for deciding which items in the queue are real. This lesson is that machinery.",

    atoms: [
      {
        id: "a-cs-soc-what-it-is",
        title: "The tiers, and what each one does",
        explain:
          "Tier one triages the alert queue: is this real, and does it need escalating. Tier two investigates what tier one escalates, pulling in more data and deciding what happened. Tier three hunts for things no detection fired on, and writes the detections that would have.",
        why: "It matters for your career as much as for understanding the work. Almost every entry route into security operations starts at tier one, and the way out of it is being the person who asks why a detection did not fire rather than just closing the ticket.",
        table: {
          caption: "Three tiers, three questions.",
          headers: ["Tier", "Question", "Output"],
          rows: [
            ["1", "Is this alert real?", "Closed as benign, or escalated with context"],
            ["2", "What actually happened?", "A scoped incident, or a tuned detection"],
            ["3", "What are we missing?", "New detections, and threat hunts"],
            ["Engineering", "Why did this not fire?", "Log sources, parsing, tooling"],
          ],
        },
      },
      {
        id: "a-cs-soc-log-sources",
        title: "What goes into the SIEM",
        explain:
          "A SIEM collects logs from everywhere and lets you search and correlate across them. What you feed it decides what you can ever detect, and every source costs money to store, so the choice is a real one.",
        why: "The most common gap is not a missing product. It is that a log source everybody assumed was being collected was never enabled, and nobody found out until an incident needed it and the data did not exist.",
        table: {
          caption: "The sources that earn their storage, roughly in order.",
          headers: ["Source", "Answers"],
          rows: [
            ["Authentication logs", "Who logged in, from where, and who failed"],
            ["Endpoint agent telemetry", "What ran on the machine, and what it did next"],
            ["Firewall and proxy logs", "What connected where, and what left"],
            ["DNS query logs", "Which names were looked up. Excellent value for the volume"],
            ["Cloud audit logs", "Who changed which permission, and when"],
            ["Application logs", "Authorisation failures, which almost nobody collects"],
          ],
          note: "DNS and cloud audit logs are the two most under-collected sources relative to how often they answer the question.",
        },
      },
      {
        id: "a-cs-soc-normalisation",
        title: "Normalisation, and the timezone problem",
        explain:
          "Every source writes its own format, its own field names and its own timestamps. Normalisation maps them into one schema so a single query can ask about a user across six systems. It is unglamorous and it is most of the work of running a SIEM.",
        why: "One detail causes more pain than the rest combined: timestamps. A log in local time, one in UTC and one with no timezone at all cannot be put on a single timeline, and building a timeline is the entire job in Week 12.",
        mistake:
          "Accepting a log source with a broken parser because the data is \"in there\". If the username lands in a free-text field, no detection can group by user, and the source is storage with no detection value.",
      },
      {
        id: "a-cs-soc-log-integrity",
        title: "Logs an attacker can edit are not evidence",
        explain:
          "Anyone with administrator rights on a machine can alter or delete its logs. That is not a flaw, it is what administrator means. So logs have to be shipped off the host as they are written, to a system the compromised host cannot modify.",
        why: "It is the single most important design decision in log management, and it is why forwarding matters more than retention. Six months of logs on the machine that was compromised is six months of whatever the attacker left you.",
        decision: {
          scenario:
            "A small company keeps 90 days of logs on each server and backs the servers up weekly. They ask whether that is sufficient for incident investigation.",
          question: "What is the gap?",
          options: [
            {
              id: "a",
              text: "Ninety days is too short; they should keep a year",
              whyWrong:
                "Retention is a real question and it is the second one. Keeping a year of logs that an attacker with root could edit gives you a year of unreliable data rather than ninety days of it.",
            },
            {
              id: "b",
              text: "The logs live on the machines they describe, so an attacker with administrator rights can alter them. They need to be forwarded to a system the servers cannot modify",
              why: "Forwarding as the log is written means the record exists somewhere the compromised host has no access to. Retention then becomes a meaningful question, because the data can be trusted.",
            },
            {
              id: "c",
              text: "Weekly backups are too infrequent",
              whyWrong:
                "Backup frequency affects data recovery. The logs in a backup taken after the compromise contain whatever the attacker left, so more frequent backups of the same files do not solve it.",
            },
            {
              id: "d",
              text: "They need a SIEM before any of this matters",
              whyWrong:
                "A SIEM is how you search and correlate, and forwarding to any write-once destination already solves the integrity problem. Making the fix conditional on a product purchase delays the part that costs nothing.",
            },
          ],
          correct: "b",
          aftermath:
            "Windows event 1102, the security log being cleared, is one of the highest-value alerts there is for exactly this reason. It is also useless if the only copy of that event was in the log that was cleared.",
        },
      },
      {
        id: "a-cs-soc-alert-lifecycle",
        title: "The life of an alert",
        explain:
          "A detection fires. The alert enters a queue with whatever context the tooling could attach. An analyst triages it, closes it as benign or escalates it. Escalation becomes an investigation, and the investigation either becomes an incident or closes with a tuning change.",
        why: "Every step has a cost and the queue is finite. This is why false positives are not an annoyance but the central constraint on the whole system, and it is the subject of the next lesson.",
        practice: {
          prompt:
            "An alert fires 200 times a day and is benign every time. What are the two possible correct responses, and what is the wrong one?",
          answer:
            "Either tune it so it fires only on the cases that matter, or turn it off and record that you did and why. The wrong response is leaving it on and closing it 200 times a day, which trains the whole team to close that alert without reading it, including on the day it is real.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 2
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "cs-l42-writing-detections",
    moduleId: "cs-w11-soc",
    sectionId: SECTION_ID,
    order: 2,
    title: "Writing Detections",
    subtitle: "The trade-off, made with your own hands",
    estimatedMinutes: 15,
    intro:
      "This lesson is two exercises. You will write a rule against a log that contains both an attack and an ordinary Monday morning, and you will be graded on both halves: catching the attack, and not burying it in noise.",

    atoms: [
      {
        id: "a-cs-soc-what-detection-is",
        title: "What a detection actually is",
        explain:
          "A query that runs continuously against incoming events and raises an alert when it matches. Most are simple: a field equals a value, counted over a window, above a threshold. The difficulty is never the syntax.",
        why: "The difficulty is choosing a condition that is specific enough to be quiet and general enough to catch the thing when it does not look exactly like your example. That is judgement, and it is what the next two exercises train.",
        mistake:
          "Writing a detection for the specific attack you just saw, with the attacker's IP address in it. It will never fire again, because they will use a different address, and it gives everybody the comfortable feeling that the gap is closed.",
      },
      {
        id: "a-cs-soc-first-rule",
        title: "Practice: catch the brute force",
        explain:
          "Here is a morning of authentication events from one company. Somewhere in it, somebody is guessing passwords against an account. Write a rule that catches every event of that attack without alerting on any of the ordinary failed logins.",
        why: "The naive rule, alert on every failure, catches the attack and also alerts on every person who mistyped their password. That is the trade-off in its simplest form, and the fix is counting rather than matching.",
        huntExercise: {
          task:
            "Build a rule that alerts on the password-guessing attack and on nothing else. The Truth column is shown here for learning; you would not have it in a real SOC.",
          fields: AUTH_FIELDS,
          events: AUTH_LOG,
          showAttackColumn: true,
          expect: { maxFalsePositives: 0 },
          hint:
            "Matching on failure alone alerts on three people who simply mistyped. What separates the attack from them is not what happened but how many times it happened to the same account. Use COUNT BY and a threshold.",
          successMessage:
            "That is the rule. Notice that it does not mention the attacker's address, the country or the account name, so it will still work next month when all three are different.",
        },
      },
      {
        id: "a-cs-soc-thresholds",
        title: "Why counting changes everything",
        explain:
          "A threshold rule counts matching events grouped by some field and alerts only when the count reaches a number. It converts \"this happened\" into \"this happened unusually often to the same thing\", which is where almost all the signal is.",
        why: "One failed login is a typo. Six against one account in ninety seconds is not. The same shape catches port scanning, password spraying and data exfiltration, and it is the single most useful pattern in detection engineering.",
        table: {
          caption: "The same shape, four attacks.",
          headers: ["Attack", "Count what", "Group by", "Looks like"],
          rows: [
            ["Brute force", "Failed logins", "Username", "Many failures, one account"],
            ["Password spraying", "Failed logins", "Source address", "One or two failures each, many accounts"],
            ["Port scanning", "Connection attempts", "Source address", "Many ports, one source, one second"],
            ["Exfiltration", "Bytes sent", "Host", "Far more leaving than usual"],
          ],
          note: "Brute force and spraying are the same events grouped differently, which is why a rule that groups only by username misses spraying entirely.",
        },
      },
      {
        id: "a-cs-soc-tuning",
        title: "Practice: the guessing stopped",
        explain:
          "A later log from the same company. The failures have stopped, which usually means one of two things: they gave up, or something worked. Write a rule that catches the successful logins from outside the country.",
        why: "This one has a false positive budget of one, on purpose. A colleague is genuinely working from Accra today, and a rule that alerts on them once is a rule worth keeping. Demanding zero false positives is how you end up with a rule that misses the attack.",
        huntExercise: {
          task:
            "Alert on successful logins from outside Nigeria. One benign alert is acceptable; read the feedback carefully if you get more.",
          fields: AUTH_FIELDS,
          events: SUCCESS_LOG,
          showAttackColumn: true,
          expect: { maxFalsePositives: 1 },
          hint:
            "Two conditions. One about the outcome, one about the country, and the country condition is an exclusion rather than a match.",
          successMessage:
            "Two attack logins caught, and one alert on a colleague in Accra. That one alert costs an analyst about thirty seconds a week and is the price of catching this. A rule tuned to zero false positives here would have had to exclude something that also excludes the attack.",
        },
        mistake:
          "Adding the attacker's country to the rule to make it precise. Next time they will come from somewhere else, and you will have written a detection for one historical event.",
      },
      {
        id: "a-cs-soc-alert-fatigue",
        title: "Alert fatigue is the real failure mode",
        explain:
          "A detection that is right 99% of the time, on a network producing a million events a day, generates around ten thousand wrong alerts. Nobody reads the ten-thousand-and-first, and the one that was real is in there somewhere.",
        why: "Most publicly analysed breaches include a detection that fired correctly and was closed without investigation, or was never looked at. The technology worked. The queue was the failure.",
        decision: {
          scenario:
            "A detection for suspicious PowerShell fires about forty times a day. It has been correct twice in eight months. The team closes it in bulk each morning without reading the details.",
          question: "What is the right action?",
          options: [
            {
              id: "a",
              text: "Leave it on. It has caught real attacks twice, so disabling it creates a gap",
              whyWrong:
                "It is already effectively disabled. Nobody reads it, and bulk-closing forty alerts a day is a habit that will apply to the third real one exactly as it applied to the first forty today.",
            },
            {
              id: "b",
              text: "Tune it against the forty benign cases until it is quiet enough to read, and measure whether it would still have caught the two real ones",
              why: "It keeps the detection value and restores the attention. Testing the tuned rule against the two known true positives is what turns tuning from guesswork into engineering.",
            },
            {
              id: "c",
              text: "Turn it off, since it is 99.8% wrong",
              whyWrong:
                "That removes a detection that has twice caught something real, and it does so without trying to fix it. Turning off is a legitimate last resort once tuning has genuinely failed, and it has not been attempted.",
            },
            {
              id: "d",
              text: "Route it to a lower priority queue that is reviewed weekly",
              whyWrong:
                "This is turning it off while feeling responsible. A detection for active attacker behaviour reviewed seven days later is not a detection, and the weekly queue is where alerts go to be ignored more slowly.",
            },
          ],
          correct: "b",
          aftermath:
            "Keep a small set of known true positives from past incidents and re-run every tuned rule against them. It is the closest thing detection engineering has to a test suite.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 3
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "cs-l43-triage",
    moduleId: "cs-w11-soc",
    sectionId: SECTION_ID,
    order: 3,
    title: "Triage",
    subtitle: "Deciding in four minutes whether this is real",
    estimatedMinutes: 11,
    intro:
      "Triage is the core skill of the job and it is mostly a set of questions asked in the same order every time. The order is what keeps it fast enough to get through the queue.",

    atoms: [
      {
        id: "a-cs-soc-triage-questions",
        title: "The questions, in order",
        explain:
          "What fired, and what does that detection actually look for. Who and what is involved. Is there a benign explanation, and can I confirm it rather than assume it. What else happened around the same time on the same host or account. And does this need to go further right now.",
        why: "Asked in that order, most alerts resolve in a few minutes. Asked out of order, an analyst spends twenty minutes investigating a host before noticing that the detection fires on something the backup software does every night.",
        table: {
          caption: "The questions, and what each one is protecting against.",
          headers: ["Question", "Stops you from"],
          rows: [
            ["What does this detection actually look for?", "Investigating the wrong thing entirely"],
            ["Which user and which host?", "Missing that it is a service account behaving normally"],
            ["Is there a benign explanation I can confirm?", "Both false alarms and lazy dismissals"],
            ["What else happened around it?", "Closing one event of a larger intrusion"],
            ["Does this need escalating now?", "Sitting on something time-critical"],
          ],
        },
      },
      {
        id: "a-cs-soc-enrichment",
        title: "Enrichment",
        explain:
          "Enrichment attaches context to an alert automatically: who owns this account, is this host a server or a laptop, is this address known bad, has this user travelled before, is there a change ticket open for this activity.",
        why: "It is the difference between a four-minute triage and a twenty-minute one, multiplied by every alert in the queue. Most SOC improvement work is enrichment rather than new detections.",
        example:
          "Raw alert:\n  Successful login for finance-admin from 185.220.101.4\n\nEnriched:\n  Successful login for finance-admin from 185.220.101.4\n    account owner   Ngozi Eze, Finance, on leave since Friday\n    account type    privileged, no MFA registered\n    address         Russia, listed as a Tor exit node\n    user history    no login from outside Nigeria in 400 days\n    change tickets  none open\n\nThe first needs an investigation. The second needs a phone call.",
      },
      {
        id: "a-cs-soc-true-benign",
        title: "Three outcomes, not two",
        explain:
          "A false positive means the detection matched something that was not what it was looking for. A benign true positive means it correctly identified the activity, and the activity was authorised. A true positive means it found something real.",
        why: "The distinction changes what you do next. A false positive means fix the rule. A benign true positive means the rule is right and needs context to suppress that case, usually through enrichment. Recording both as \"false positive\" destroys the tuning data.",
        mistake:
          "Closing an alert as a false positive because the activity turned out to be authorised. The detection worked perfectly. What was missing was the knowledge that this administrator had a change window, and that is an enrichment gap, not a rule defect.",
      },
      {
        id: "a-cs-soc-escalation",
        title: "When to escalate",
        explain:
          "Escalate on evidence of a privileged account being used unexpectedly, evidence of persistence, any sign of data leaving, anything touching payment or personal data at scale, and anything you cannot explain after your allotted triage time.",
        why: "That last one matters most and is the hardest for new analysts. Escalating something that turns out to be benign costs somebody twenty minutes. Not escalating something real costs the organisation months.",
        decision: {
          scenario:
            "At 02:40 you see a successful login to a privileged account from an address in another country. The account belongs to a senior administrator. You cannot reach them. There is no change ticket.",
          question: "What do you do?",
          options: [
            {
              id: "a",
              text: "Wait until morning to confirm with the administrator before raising anything",
              whyWrong:
                "If it is real, you have given an attacker with privileged access six unmonitored hours, which is more than enough to establish persistence and reach the data. The cost of being wrong in each direction is wildly asymmetric.",
            },
            {
              id: "b",
              text: "Escalate now, and begin containment steps your runbook permits, such as forcing a session reset on that account",
              why: "Privileged account, unusual source, no change ticket, out of hours, owner unreachable. Every factor points the same way. If it turns out to be the administrator working from a hotel, they are inconvenienced for twenty minutes.",
            },
            {
              id: "c",
              text: "Close it as benign, since senior administrators often work odd hours",
              whyWrong:
                "That is an assumption standing in for a confirmation. The whole point of triage is to confirm the benign explanation rather than accept it, and here you explicitly could not.",
            },
            {
              id: "d",
              text: "Keep monitoring the account and escalate if anything else happens",
              whyWrong:
                "Watching an attacker with privileged access is a decision to let them continue. It is sometimes a deliberate choice, made by an incident lead who has weighed it, and never a decision for a tier one analyst at 02:40.",
            },
          ],
          correct: "b",
          aftermath:
            "A good runbook names exactly which containment actions a tier one analyst may take without waiting. Forcing a session reset is usually one of them, and having that written down in advance is what makes 02:40 survivable.",
        },
      },
      {
        id: "a-cs-soc-documentation",
        title: "Writing the triage note",
        explain:
          "What fired, what you checked, what you found, what you concluded and why, and what you did. Five lines. The one people omit is what they checked and found nothing, which is the line that tells the next person where not to look again.",
        why: "Alerts recur. Six weeks later somebody sees the same thing, finds your note, and either resolves it in ninety seconds or repeats your entire investigation. Your note is the difference.",
        example:
          "Alert      Multiple failed logins, finance-admin, 10:03 to 10:04\nChecked    Source 185.220.101.4, Tor exit node, no prior history\n           for this account. No successful login followed.\n           Account has no MFA registered.\nFound      Six failures in 90 seconds, single source, single account.\nConclusion True positive, password guessing. Unsuccessful.\nActions    Escalated to tier 2. Requested MFA enforcement on all\n           privileged accounts. Blocked the source address.",
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 4
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "cs-l44-intel-and-attack",
    moduleId: "cs-w11-soc",
    sectionId: SECTION_ID,
    order: 4,
    title: "Threat Intelligence and ATT&CK",
    subtitle: "Describing behaviour rather than artefacts",
    estimatedMinutes: 12,
    intro:
      "Two frameworks that give the whole field a shared vocabulary. One explains why chasing indicators has limited value, and the other gives you a map of what you can and cannot currently see.",

    atoms: [
      {
        id: "a-cs-soc-intel",
        title: "Indicators and behaviours",
        explain:
          "An indicator of compromise is an artefact: a file hash, an IP address, a domain. A tactic, technique or procedure describes what the attacker did: they used a scheduled task for persistence, they dumped credentials from memory.",
        why: "Indicators are easy to share and trivially easy for an attacker to change. Behaviours are harder to describe and much harder for an attacker to change, because changing them means changing how they work rather than changing a value.",
        mistake:
          "Building a detection programme entirely on indicator feeds. It catches attackers reusing infrastructure somebody already reported, which is the least capable ones, and generates a steady stream of alerts about addresses that were malicious last March.",
      },
      {
        id: "a-cs-soc-pyramid",
        title: "The pyramid of pain",
        explain:
          "A model ranking indicator types by how much it costs an attacker when you detect on them. Hashes are trivial to change. Addresses are easy. Domains cost a little. Tools cost real effort. Techniques cost them a rework of how they operate.",
        why: "It tells you where detection effort pays. Blocking a hash inconveniences an attacker for the time it takes to recompile. Detecting the technique means they have to change their methodology, which is expensive and slow.",
        table: {
          caption: "From the bottom up, and what each costs the attacker.",
          headers: ["Detect on", "Cost to the attacker"],
          rows: [
            ["File hashes", "Trivial. Recompile"],
            ["IP addresses", "Easy. Rent another"],
            ["Domain names", "Small. Register another"],
            ["Network artefacts", "Annoying. Change the tooling's fingerprint"],
            ["Tools", "Real. Find or write a different one"],
            ["Techniques and behaviours", "Severe. Change how they operate"],
          ],
        },
      },
      {
        id: "a-cs-soc-attack",
        title: "MITRE ATT&CK",
        explain:
          "A public catalogue of what attackers actually do, organised into tactics, which are the goals, and techniques, which are the ways of achieving them. Initial access, execution, persistence, privilege escalation, defence evasion, credential access, discovery, lateral movement, collection, exfiltration, impact.",
        why: "It gives everyone a shared vocabulary, so a detection, a report and a threat intelligence article can all reference the same technique. It also gives you a coverage map: which techniques would you currently detect, and which would go entirely unnoticed.",
        table: {
          caption: "Your own course so far, mapped.",
          headers: ["What you did", "Tactic", "Technique"],
          rows: [
            ["Dissected phishing in Week 2", "Initial access", "Phishing"],
            ["Port scanned the lab in Week 4", "Discovery", "Network service discovery"],
            ["Saw shared local admin reuse in Week 6", "Lateral movement", "Valid accounts"],
            ["Wrote the brute force detection just now", "Credential access", "Brute force"],
            ["Ransomware in Week 3", "Impact", "Data encrypted for impact"],
          ],
        },
      },
      {
        id: "a-cs-soc-mapping",
        title: "Mapping a detection to a technique",
        explain:
          "Tag every detection with the technique it covers. It takes a minute per rule and it turns a list of detections into a map with visible holes, which is a completely different artefact.",
        why: "Without it you have forty rules and no idea what they cover. With it you can say that you have eleven detections for credential access and nothing at all for exfiltration, which is a sentence that gets budget.",
        practice: {
          prompt:
            "Your SOC has twelve detections, eight of which cover initial access and four of which cover execution. What does the map tell you?",
          answer:
            "That you are heavily weighted towards the start of an intrusion and blind to everything after it. An attacker who gets past the first two stages, which is the whole point of the later stages existing, proceeds with nothing watching. Persistence, lateral movement and exfiltration are all unmonitored, and those are the stages where you would still have time to act.",
        },
      },
      {
        id: "a-cs-soc-coverage",
        title: "Coverage, honestly assessed",
        explain:
          "A coverage map is only useful if it is honest. A technique is covered when a detection exists, fires reliably, produces a manageable number of alerts, and somebody reads them. A rule that exists and is bulk-closed every morning does not count as coverage.",
        why: "Coverage maps are frequently produced for management and coloured green wherever a rule exists. That map is worse than no map, because it converts a known gap into an unknown one.",
        decision: {
          scenario:
            "You are asked to produce an ATT&CK coverage map for the board. Several techniques have rules that fire constantly and are bulk-closed without review.",
          question: "How do you colour those?",
          options: [
            {
              id: "a",
              text: "Green. A detection exists for them",
              whyWrong:
                "That converts a known gap into an unknown one, which is the most expensive kind. The board will believe those techniques are covered and allocate budget elsewhere, and nobody will revisit it until an incident.",
            },
            {
              id: "b",
              text: "Amber, with a note that the rule exists but is not operationally effective, and what it would take to make it so",
              why: "It is accurate, it is actionable, and it turns the map into a funding conversation rather than a reassurance exercise. The note is what makes amber useful rather than vague.",
            },
            {
              id: "c",
              text: "Red, since nobody reads the alerts",
              whyWrong:
                "Closer to honest than green and it discards real information. A rule that fires correctly and needs tuning is a shorter distance from coverage than a technique with no detection at all, and the map should show that difference.",
            },
            {
              id: "d",
              text: "Leave them off the map entirely",
              whyWrong:
                "Omission reads as no coverage and no rule, which understates what exists and hides the specific problem, which is that tuning work is needed.",
            },
          ],
          correct: "b",
          aftermath:
            "The most useful coverage maps have three colours and a comments column. The comments column is where the actual information is.",
        },
      },
    ],

    task: {
      title: "This week's lab",
      intro: "Build a detection pipeline and prove it catches something you did yourself.",
      prompts: [
        "Install Wazuh, an Elastic stack or Splunk Free in your lab and connect your Linux VM's authentication logs to it.",
        "Confirm the parsing works: search for a specific username and confirm it comes back as a field rather than free text.",
        "From your second VM, attempt a series of failed SSH logins against one account. Confirm the events arrive.",
        "Write a detection rule that alerts on repeated authentication failures grouped by account, with a threshold you choose. Record why you chose that number.",
        "Test it: run the attack again and confirm it fires. Then log in incorrectly once yourself and confirm it does not.",
        "Run a port scan from your second VM and write a second detection for it, grouped by source address.",
        "Map both detections to MITRE ATT&CK techniques and write an alert triage note for each, using the five-line format from lesson three.",
      ],
      closing:
        "The triage notes are the deliverable, and they are also the closest thing in this course to the actual daily work of a security analyst. Week 12 takes one of these alerts and works it all the way to a post-incident report.",
    },

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
