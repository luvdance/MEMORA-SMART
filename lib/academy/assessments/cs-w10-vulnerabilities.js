/**
 * ASSESSMENTS · CYBERSECURITY · WEEK 10 · VULNERABILITY ASSESSMENT
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Never import this from anything under src/.
 * ═════════════════════════════════════════════════════════════════════════
 */

export const ASSESSMENTS = {
  /* ═══════════════════════════════════════════════════════════════════ */
  "cs-l37-scanning-properly": {
    lessonId: "cs-l37-scanning-properly",
    passMark: 70,
    questions: [
      {
        id: "csq37-1",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cs-w10-authenticated",
        prompt:
          "An unauthenticated scan of a well-firewalled server reports almost nothing. What can you conclude?",
        options: [
          { id: "a", text: "The server is fully patched" },
          {
            id: "b",
            text: "Only that a stranger cannot easily tell. The machine may be months behind on patches",
          },
          { id: "c", text: "The scan was misconfigured" },
          { id: "d", text: "The server is offline" },
        ],
        correct: "b",
        explanation:
          "An unauthenticated scan sees what a stranger sees. An authenticated scan logs in and reads the actual package list, which is a completely different and much stronger statement.",
        whyWrong: {
          a: "Reporting this as evidence of a patched estate is one of the most common misreadings in vulnerability management.",
          c: "The scan did exactly what it was asked to do. The limitation is inherent to running it without credentials.",
          d: "An offline host does not appear at all, which is different from appearing with nothing to report.",
        },
      },
      {
        id: "csq37-2",
        type: "scenario",
        difficulty: 3,
        atomId: "a-cs-w10-false-positives",
        prompt:
          "Engineering says your critical finding is a false positive because their distribution backports security fixes without changing the version banner. What do you do?",
        options: [
          { id: "a", text: "Keep the finding; the scanner reported it" },
          {
            id: "b",
            text: "Verify against the actual package version and the distribution's advisory, then confirm or withdraw with a note",
          },
          { id: "c", text: "Remove it, since they know their server best" },
          { id: "d", text: "Downgrade it to informational" },
        ],
        correct: "b",
        explanation:
          "Backporting is standard on enterprise Linux and version-banner detection is well known to produce exactly this. Two minutes of checking settles it, and the note helps the next reader.",
        whyWrong: {
          a: "Passing the burden of proof to the client is how a report loses credibility, and with it every other finding in the document.",
          c: "They are usually right and sometimes wrong, and \"they said it was fine\" is not something you can write in a report.",
          d: "That avoids the argument without answering the question. If it is real it is still critical; if not, it should not be there.",
        },
      },
      {
        id: "csq37-3",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cs-w10-scan-config",
        prompt: "Why must a scan report state what it did not cover?",
        options: [
          { id: "a", text: "To meet audit requirements" },
          {
            id: "b",
            text: "Because a reader who does not know what was excluded will read absence as safety",
          },
          { id: "c", text: "To justify the time taken" },
          { id: "d", text: "Because scanners are unreliable" },
        ],
        correct: "b",
        explanation:
          "Hosts that were off, UDP that was not scanned, ports outside the default range. Without that section, \"the scan was clean\" means nothing at all.",
        whyWrong: {
          a: "Some audits do ask for it, and the reason it belongs there is that the result is meaningless without it.",
          c: "The section is about coverage, not effort.",
          d: "Scanners are reliable at what they do. The limits are about what they were asked to do.",
        },
      },
      {
        id: "csq37-4",
        type: "mcq",
        difficulty: 3,
        atomId: "a-cs-w10-validating",
        prompt:
          "Which three checks validate a scanner finding before it goes in a report?",
        options: [
          { id: "a", text: "Severity, exploit availability and vendor response" },
          {
            id: "b",
            text: "Whether the installed version is genuinely affected, whether the vulnerable feature is enabled, and whether the path is reachable",
          },
          { id: "c", text: "Whether the scanner is up to date, licensed and correctly configured" },
          { id: "d", text: "Whether the client agrees, whether it is in scope and whether it is fixable" },
        ],
        correct: "b",
        explanation:
          "Most scanner findings fail at least one of those three, which is why the validated list is a fraction of the raw one, and why it is the one that actually gets fixed.",
        whyWrong: {
          a: "Those inform prioritisation once the finding is real. They do not establish that it is.",
          c: "Tool hygiene is worth having and says nothing about whether this specific finding applies to this host.",
          d: "Client agreement is not validation, and fixability affects the recommendation rather than the finding's existence.",
        },
      },
      {
        id: "csq37-5",
        type: "truefalse",
        difficulty: 2,
        atomId: "a-cs-w10-scan-vs-test",
        prompt:
          "A vulnerability scanner can detect broken access control if configured correctly.",
        options: [
          { id: "a", text: "True" },
          { id: "b", text: "False" },
        ],
        correct: "b",
        explanation:
          "False. A scanner cannot know that this user should not be able to see that record, because that is a fact about the business rather than about the software. It is the most common serious web vulnerability and it needs a person.",
        whyWrong: {
          a: "Some tools flag suspicious patterns and none of them can determine intended authorisation. Configuration does not supply the missing knowledge.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "cs-l38-reading-a-vulnerability": {
    lessonId: "cs-l38-reading-a-vulnerability",
    passMark: 70,
    questions: [
      {
        id: "csq38-1",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cs-w10-cve",
        prompt: "What is the difference between a CVE and a CWE?",
        options: [
          { id: "a", text: "A CVE is more severe than a CWE" },
          { id: "b", text: "A CVE is one vulnerability in one product; a CWE is the class of weakness it belongs to" },
          { id: "c", text: "A CVE applies to software and a CWE to hardware" },
          { id: "d", text: "They are the same thing under two naming schemes" },
        ],
        correct: "b",
        explanation:
          "You patch CVEs and you fix CWEs. Noticing that eleven CVEs in a report share one CWE tells the team something about how their software is being written, which is the more valuable observation.",
        whyWrong: {
          a: "Neither carries severity. That is CVSS, and it attaches to the CVE.",
          c: "Both apply to software, and hardware issues receive CVEs too.",
          d: "They describe different levels: an instance and a category.",
        },
      },
      {
        id: "csq38-2",
        type: "scenario",
        difficulty: 3,
        atomId: "a-cs-w10-cvss-vector",
        prompt:
          "In a CVSS vector, which combination should worry you most on an internet-facing host?",
        options: [
          { id: "a", text: "AV:L/PR:H/UI:R" },
          { id: "b", text: "AV:N/PR:N/UI:N" },
          { id: "c", text: "AV:N/PR:H/UI:R" },
          { id: "d", text: "AV:L/PR:N/UI:N" },
        ],
        correct: "b",
        explanation:
          "Network reachable, no privileges required, no user interaction. Anyone can attempt it, from anywhere, without an account and without needing anybody to click. That is the combination scanned for at internet scale.",
        whyWrong: {
          a: "Local access plus high privileges plus user interaction is about as constrained as a vulnerability gets.",
          c: "Network reachable and needing administrator privileges and a user action, which is a much narrower path.",
          d: "Local attack vector means the attacker must already be on the machine, which is a significant precondition.",
        },
      },
      {
        id: "csq38-3",
        type: "mcq",
        difficulty: 3,
        atomId: "a-cs-w10-base-vs-environmental",
        prompt: "What does the published CVSS base score deliberately exclude?",
        options: [
          { id: "a", text: "The impact on confidentiality" },
          { id: "b", text: "Anything about your specific environment or whether an exploit exists" },
          { id: "c", text: "The attack vector" },
          { id: "d", text: "Whether the vendor has issued a patch" },
        ],
        correct: "b",
        explanation:
          "Temporal and environmental metrics exist in the standard and almost nobody computes them. So the number everybody quotes is explicitly the one that knows nothing about your systems, which the standard itself says.",
        whyWrong: {
          a: "Confidentiality impact is one of the base metrics and is included.",
          c: "Attack vector is a base metric, and it is the first component of the vector string.",
          d: "Patch availability is a temporal metric, which is one of the things excluded, and it is not the whole answer.",
        },
      },
      {
        id: "csq38-4",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cs-w10-epss-kev",
        prompt:
          "Which source tells you a vulnerability is being exploited right now?",
        options: [
          { id: "a", text: "The CVSS base score" },
          { id: "b", text: "The CISA Known Exploited Vulnerabilities catalogue" },
          { id: "c", text: "The CWE classification" },
          { id: "d", text: "The CPE identifier" },
        ],
        correct: "b",
        explanation:
          "KEV lists vulnerabilities demonstrably under active exploitation. EPSS estimates the probability of exploitation in the next thirty days, which is the forward-looking half of the same question.",
        whyWrong: {
          a: "The base score describes severity in the abstract and says nothing about activity.",
          c: "A CWE is a weakness category and carries no exploitation data.",
          d: "CPE is a naming scheme used to match products to advisories.",
        },
      },
      {
        id: "csq38-5",
        type: "scenario",
        difficulty: 3,
        atomId: "a-cs-w10-score-is-not-risk",
        prompt:
          "A 9.8 sits on an internal build server with no customer data. A 6.5 on the internet-facing portal lets any registered customer read every customer record. Which first?",
        options: [
          { id: "a", text: "The 9.8, because remote code execution is the worst outcome" },
          {
            id: "b",
            text: "The 6.5, because it is internet-facing, needs only a free account, and exposes every customer record",
          },
          { id: "c", text: "Both at once" },
          { id: "d", text: "Let the client decide" },
        ],
        correct: "b",
        explanation:
          "Exposure, effort and data at risk all point the same way. The 9.8 requires an attacker already on the build network; the 6.5 requires ninety seconds and a free account.",
        whyWrong: {
          a: "That sorts by a number which explicitly knows nothing about your environment.",
          c: "True and useless as advice. They have finite engineering time this week and asked what to do first.",
          d: "They hired you for this judgement. Bring a recommendation with reasoning; they can override it.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "cs-l39-prioritising": {
    lessonId: "cs-l39-prioritising",
    passMark: 70,
    questions: [
      {
        id: "csq39-1",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cs-w10-risk-formula",
        prompt: "Which three questions do most of the work in a prioritisation conversation?",
        options: [
          { id: "a", text: "What is the score, who reported it, and when?" },
          { id: "b", text: "Who can reach this, what does it cost them to try, and what do they get?" },
          { id: "c", text: "Which vendor, which version, and which patch?" },
          { id: "d", text: "Is it in scope, is it exploitable, and is it fixable?" },
        ],
        correct: "b",
        explanation:
          "Exposure, effort and impact. The formula is not the useful part; those three questions are, and they work in any conversation about any finding.",
        whyWrong: {
          a: "Provenance and score are inputs and none of them describe what it means here.",
          c: "Those decide the fix once the priority is settled, which is the following step.",
          d: "Scope and fixability are practical constraints. They do not measure the risk.",
        },
      },
      {
        id: "csq39-2",
        type: "scenario",
        difficulty: 3,
        atomId: "a-cs-w10-prioritise",
        prompt:
          "A CVSS 9.8 remote code execution sits on an internal build server holding only build artefacts, reachable from the build network. Why is it not the top priority?",
        options: [
          { id: "a", text: "Because remote code execution is rarely exploited" },
          {
            id: "b",
            text: "Because reaching it requires an attacker already on the build network, which is itself a significant achievement",
          },
          { id: "c", text: "Because build servers are not important" },
          { id: "d", text: "Because internal systems are not in scope" },
        ],
        correct: "b",
        explanation:
          "The 9.8 assumes an attacker who can reach it. Nobody outside can. It is genuinely serious and it is not this week's problem, and it would rise sharply if the build server held deployment credentials.",
        whyWrong: {
          a: "It is one of the most exploited classes there is. Reachability is what changes the answer, not the class.",
          c: "Build servers are often critical, which is exactly why the presence of deployment credentials would change the ranking.",
          d: "Internal systems are very much in scope. Exposure affects likelihood, not inclusion.",
        },
      },
      {
        id: "csq39-3",
        type: "mcq",
        difficulty: 3,
        atomId: "a-cs-w10-exploitability",
        prompt:
          "Why does an exploit appearing in a widely used framework change a vulnerability's priority so much?",
        options: [
          { id: "a", text: "Because it raises the CVSS score" },
          {
            id: "b",
            text: "Because it moves the vulnerability from something specialists could do to something anyone can",
          },
          { id: "c", text: "Because vendors respond faster once a module exists" },
          { id: "d", text: "Because it proves the vendor's advisory was accurate" },
        ],
        correct: "b",
        explanation:
          "Each stage from advisory to proof of concept to reliable tooling multiplies the number of people who can use it. It is one of the strongest available signals and it is not in the base score.",
        whyWrong: {
          a: "The base score does not change. That is precisely why this signal has to be tracked separately.",
          c: "Vendor behaviour varies and is not why your priority changes.",
          d: "Accuracy of the advisory is not the issue. Accessibility of the attack is.",
        },
      },
      {
        id: "csq39-4",
        type: "scenario",
        difficulty: 3,
        atomId: "a-cs-w10-compensating",
        prompt:
          "A vulnerable service has no vendor fix until next quarter. What is the professional response?",
        options: [
          { id: "a", text: "\"Patch immediately.\"" },
          {
            id: "b",
            text: "Name the risk, restrict who can reach it, disable the affected feature if unused, add detection, and set a review date",
          },
          { id: "c", text: "Remove the finding until a patch exists" },
          { id: "d", text: "Take the service offline until the vendor responds" },
        ],
        correct: "b",
        explanation:
          "Insisting on patching as the only acceptable answer makes you useless in exactly the situations where advice is most needed. A compensating control reduces risk without removing the vulnerability.",
        whyWrong: {
          a: "There is nothing to apply. The advice is unactionable and will be ignored along with the rest of the report.",
          c: "The risk exists whether or not a fix does. Removing it from the report removes the record, not the exposure.",
          d: "Sometimes correct for a severe internet-facing issue and disproportionate as a general answer, and the availability cost is real.",
        },
      },
      {
        id: "csq39-5",
        type: "scenario",
        difficulty: 3,
        atomId: "a-cs-w10-accept-risk",
        prompt:
          "A legacy system cannot be patched without a rewrite costing more than the system is worth, holds no personal data, and is due for decommissioning in eighteen months. What do you recommend?",
        options: [
          { id: "a", text: "Insist on patching. Unpatched systems are never acceptable" },
          {
            id: "b",
            text: "Formal risk acceptance: named owner, written rationale, compensating controls, and a review date tied to the decommissioning",
          },
          { id: "c", text: "Remove it from the report, since nothing will be done" },
          { id: "d", text: "Escalate to the board" },
        ],
        correct: "b",
        explanation:
          "Acceptance is one of four legitimate treatments. The failure is unrecorded acceptance, where nobody decided and everybody assumed somebody else had. The review date stops it becoming permanent.",
        whyWrong: {
          a: "The rewrite costs more than the asset is worth, and a recommendation that ignores that will be ignored in turn.",
          c: "An unrecorded risk is the worst of the four. When it is exploited, nobody can show the organisation weighed it.",
          d: "Disproportionate. Escalation is for risks beyond the owner's authority, and overusing it means the important ones get skimmed.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "cs-l40-exploitation-and-remediation": {
    lessonId: "cs-l40-exploitation-and-remediation",
    passMark: 70,
    questions: [
      {
        id: "csq40-1",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cs-w10-exploitation-concepts",
        prompt: "What is the purpose of exploitation during an authorised test?",
        options: [
          { id: "a", text: "To demonstrate maximum impact by going as deep as possible" },
          {
            id: "b",
            text: "To establish that the vulnerability is real and what it leads to, with the smallest proof that removes the argument",
          },
          { id: "c", text: "To test whether the client's backups work" },
          { id: "d", text: "To collect credentials for later phases" },
        ],
        correct: "b",
        explanation:
          "A screenshot of the server returning its own hostname in response to your request is not debatable. Anything beyond establishing that is risk without benefit.",
        whyWrong: {
          a: "Going deeper is where outages happen and where real data gets touched, and it adds nothing to the finding.",
          c: "Backup testing is a separate exercise and is not something to discover by accident.",
          d: "Credential collection may be in scope for a longer engagement, and it is not the purpose of confirming a finding.",
        },
      },
      {
        id: "csq40-2",
        type: "scenario",
        difficulty: 3,
        atomId: "a-cs-w10-frameworks",
        prompt:
          "Mid-engagement, you notice a promising exploit against a database server on an adjacent address that is not in your scope. What do you do?",
        options: [
          { id: "a", text: "Run it; demonstrating full impact helps the client" },
          { id: "b", text: "Stop, report what you observed, and ask for a written scope extension" },
          { id: "c", text: "Test it read-only, since that cannot cause harm" },
          { id: "d", text: "Note it and raise it at the closing meeting" },
        ],
        correct: "b",
        explanation:
          "The observation is valuable and belongs in the report today. Acting on it requires authorisation, and the email requesting an extension is also the record that protects you.",
        whyWrong: {
          a: "That address may not even belong to the client. Good intentions do not extend a scope.",
          c: "Read-only is still unauthorised access. The offence does not depend on whether you changed anything.",
          d: "Better than testing it, and too late. If it is genuinely exposed, they should hear today.",
        },
      },
      {
        id: "csq40-3",
        type: "scenario",
        difficulty: 3,
        atomId: "a-cs-w10-post-assessment",
        prompt:
          "Directory listing is enabled, a backup file sits in the web root, and it contains database credentials for a reachable database. How should this be reported?",
        options: [
          { id: "a", text: "As three findings: one low and two medium" },
          {
            id: "b",
            text: "As a chain: anyone on the internet can list, download, read the password and connect. Critical",
          },
          { id: "c", text: "As one medium finding about file permissions" },
          { id: "d", text: "As an informational note about web server configuration" },
        ],
        correct: "b",
        explanation:
          "Clients understand narratives. Three separate mediums produce a shrug; the sequence, with an elapsed time of about four minutes, changes a meeting, and it is how an attacker would actually use them.",
        whyWrong: {
          a: "Accurate individually and it hides the real severity, which comes from the combination.",
          c: "Permissions are part of it and collapsing the chain into one cause loses both the path and the impact.",
          d: "It ends in database access. Informational is not a defensible rating for that.",
        },
      },
      {
        id: "csq40-4",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cs-w10-remediation-plan",
        prompt:
          "What turns a findings list into a remediation plan?",
        options: [
          { id: "a", text: "Adding severity ratings" },
          { id: "b", text: "Priority order, a specific fix, an owner, rough effort, and how it will be verified" },
          { id: "c", text: "Sorting alphabetically by system" },
          { id: "d", text: "Including the raw scanner output" },
        ],
        correct: "b",
        explanation:
          "A findings list is a problem statement. A plan is something a manager can put into a sprint, and delivering the first while calling it the second is why good reports often produce no change.",
        whyWrong: {
          a: "Severity is already on a findings list and does not tell anybody who is doing what.",
          c: "Ordering by system ignores priority, which is the one thing the reader cannot work out themselves.",
          d: "Raw output belongs in an appendix and makes a plan harder to act on, not easier.",
        },
      },
      {
        id: "csq40-5",
        type: "scenario",
        difficulty: 3,
        atomId: "a-cs-w10-retest",
        prompt:
          "A team reports the access control finding as fixed. What do you retest?",
        options: [
          { id: "a", text: "The original request only" },
          {
            id: "b",
            text: "The original request, then the same class elsewhere: other endpoints taking an id, other object types, other HTTP methods",
          },
          { id: "c", text: "Nothing; their word is sufficient" },
          { id: "d", text: "The whole application again from the start" },
        ],
        correct: "b",
        explanation:
          "Fixes very often address the reported example and leave the class, or get applied on one host out of four. The second test is the one that finds that out.",
        whyWrong: {
          a: "That confirms the example is fixed and says nothing about whether the underlying issue was.",
          c: "A finding marked fixed by the team who fixed it is a claim. Verification is what closes it.",
          d: "Disproportionate for a retest, and it turns verification into a second engagement nobody budgeted for.",
        },
      },
    ],
  },
};

export default ASSESSMENTS;
