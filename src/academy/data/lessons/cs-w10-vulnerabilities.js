/**
 * CYBERSECURITY · WEEK 10 · VULNERABILITY ASSESSMENT & PRIORITISATION
 *
 * Harvard anchor: turns the securing-systems and securing-software pillars
 * into measurable, prioritised risk reduction.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 *
 * The centrepiece is the risk-ranking exercise, and it is built so that
 * sorting by CVSS fails. That is not a trick. It is the single most important
 * professional judgement in this part of the field, and the content validator
 * asserts that scanner order and risk order genuinely differ, so the lesson
 * can never accidentally teach the opposite of what it intends.
 *
 * Nothing here is a working exploit. Exploitation is taught as a concept and
 * as a lab activity against targets built to be attacked.
 */

export const SECTION_ID = "cs-s10-vulnerabilities";

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 1
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "cs-l37-scanning-properly",
    moduleId: "cs-w10-vulnerabilities",
    sectionId: SECTION_ID,
    order: 1,
    title: "Running a Scan Properly",
    subtitle: "And knowing what it did not look at",
    estimatedMinutes: 11,
    intro:
      "A vulnerability scanner is a very fast, very literal assistant with no judgement at all. Used well it saves days. Used badly it produces a four-hundred-page report that nobody reads and one genuine finding that nobody notices.",

    atoms: [
      {
        id: "a-cs-w10-scan-vs-test",
        title: "What a scanner can and cannot do",
        explain:
          "A scanner checks a target against a database of known issues, mostly by matching versions and probing for known patterns. It cannot reason about your business, cannot tell whether a user should be able to see a record, and cannot chain two harmless findings into a serious one.",
        why: "It is exceptionally good at the thing it does, which is breadth. Every unpatched component across two thousand hosts, in an afternoon. That is not something a human can do, and the mistake is expecting judgement from it rather than coverage.",
        table: {
          caption: "The division of labour.",
          headers: ["", "A scanner", "A person"],
          rows: [
            ["Coverage across thousands of hosts", "Excellent", "Impossible"],
            ["Known vulnerable versions", "Excellent", "Slow"],
            ["Broken access control", "Blind", "This is the job"],
            ["Business logic flaws", "Blind", "This is the job"],
            ["Deciding what matters here", "Blind", "This is the job"],
          ],
        },
      },
      {
        id: "a-cs-w10-authenticated",
        title: "Authenticated scans see a different machine",
        explain:
          "An unauthenticated scan sees what a stranger sees: open ports and whatever the services announce. An authenticated scan logs in and reads the actual installed package list, configuration and patch state.",
        why: "The difference is enormous and routinely misunderstood. An unauthenticated scan of a well-firewalled server may report almost nothing while the machine is months behind on patches, because nothing it could reach was willing to say so.",
        mistake:
          "Reporting a clean unauthenticated scan as evidence the estate is patched. It is evidence that a stranger cannot easily tell, which is a different and much weaker statement.",
      },
      {
        id: "a-cs-w10-scan-config",
        title: "What the scan did not look at",
        explain:
          "Default port ranges miss services on unusual ports. Rate limiting and intrusion prevention can silently drop probes so a live service appears closed. Hosts that were off during the window do not appear at all. And a scan is a snapshot of the moment it ran.",
        why: "Every scan report should carry a section stating its own limits, because a reader who does not know what was excluded will read absence as safety. This is the same discipline as the exceptions list in the Week 5 hardening report.",
        example:
          "What belongs beside every scan result:\n\n  Scanned        102.89.4.32/29, 14 hosts\n  Not scanned    3 hosts powered off during the window (named)\n  Ports          top 1,000 TCP only. UDP not scanned\n  Credentials    unauthenticated\n  Date           14 October 2026, 09:00 to 11:20 WAT\n\nWithout this, \"the scan was clean\" means nothing at all.",
      },
      {
        id: "a-cs-w10-false-positives",
        title: "False positives, and the credibility cost",
        explain:
          "Scanners frequently report issues that are not real: a version string that was backported, a patch applied without changing the banner, a check that fired on something unrelated. Every unvalidated finding you pass on is one the engineering team has to disprove.",
        why: "Credibility is the currency of this work. A report with three false positives in it will have every finding questioned, including the real ones, and the next engagement will be argued about rather than acted on.",
        decision: {
          scenario:
            "Your scan reports a critical vulnerability on a web server based on its version banner. The engineering team says the distribution backports security fixes without changing the version string, so the machine is patched.",
          question: "What do you do?",
          options: [
            {
              id: "a",
              text: "Keep the finding. The scanner reported it and it is up to them to prove otherwise",
              whyWrong:
                "Backported patches are a completely standard practice on enterprise Linux distributions, and version-banner detection is well known to produce exactly this. Passing the burden of proof to the client is how a report loses credibility.",
            },
            {
              id: "b",
              text: "Verify against the actual package version and the distribution's advisory, then either confirm or withdraw the finding with a note explaining why",
              why: "It takes about two minutes, settles the question with evidence, and the note is valuable either way: it tells the next reader why an apparently critical banner is not a finding here.",
            },
            {
              id: "c",
              text: "Remove the finding, since the team who runs the server knows it better than you do",
              whyWrong:
                "They are usually right about this and sometimes wrong, and \"they said it was fine\" is not something you can write in a report. Check, then write down what you checked.",
            },
            {
              id: "d",
              text: "Downgrade it to informational and move on",
              whyWrong:
                "That avoids the argument without answering the question. If it is real it is still critical, and if it is not it should not be in the report at all.",
            },
          ],
          correct: "b",
          aftermath:
            "This exact disagreement happens on nearly every engagement involving Red Hat, Debian or Ubuntu servers. Knowing about backporting before the meeting is worth a great deal.",
        },
      },
      {
        id: "a-cs-w10-validating",
        title: "Validating a finding",
        explain:
          "Validation means establishing that the issue is real on this system, in this configuration, without necessarily exploiting it. Check the actual package version. Check whether the vulnerable feature is enabled. Check whether the path to it is reachable at all.",
        why: "Most scanner findings fail at least one of those three, which is why the validated list is usually a fraction of the raw one. It is also why the validated list is the one that gets fixed: it is short enough to act on.",
        practice: {
          prompt:
            "A scanner reports a critical vulnerability in a module of your web server. What three things do you check before reporting it?",
          answer:
            "Whether the installed version is genuinely affected, allowing for backported patches. Whether the vulnerable module or feature is actually enabled in this configuration. And whether the affected path is reachable from anywhere an attacker could be. A no to any of those changes the finding, and the reasoning belongs in the report either way.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 2
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "cs-l38-reading-a-vulnerability",
    moduleId: "cs-w10-vulnerabilities",
    sectionId: SECTION_ID,
    order: 2,
    title: "Reading a Vulnerability",
    subtitle: "CVE, CVSS, and what the number means",
    estimatedMinutes: 12,
    intro:
      "Four acronyms you will meet every working day, and one very widely misread number. This lesson is about reading a vulnerability record properly, which mostly means knowing what each part is not telling you.",

    atoms: [
      {
        id: "a-cs-w10-cve",
        title: "CVE, CWE and the difference",
        explain:
          "A CVE is one specific vulnerability in one specific product, with an identifier like CVE-2021-44228. A CWE is the class of weakness it belongs to, such as CWE-89 for SQL injection. One is an instance, the other is a category.",
        why: "You patch CVEs and you fix CWEs. A report listing forty CVEs tells an engineering team what to update. A report noting that eleven of them are the same CWE tells them something about how their software is being written, which is the more valuable observation.",
        table: {
          caption: "The identifiers, and what each is for.",
          headers: ["", "Is", "Example", "You use it to"],
          rows: [
            ["CVE", "One vulnerability in one product", "CVE-2021-44228 (Log4Shell)", "Track and patch a specific issue"],
            ["CWE", "A class of weakness", "CWE-89, SQL injection", "Talk about root cause and training"],
            ["CPE", "A way of naming a product and version", "cpe:/a:apache:log4j:2.14.1", "Match your inventory against advisories"],
            ["CVSS", "A severity score", "9.8 Critical", "Compare severity, carefully"],
          ],
        },
      },
      {
        id: "a-cs-w10-cvss-vector",
        title: "The vector string is the useful part",
        explain:
          "CVSS produces a number, and behind it is a vector describing how the vulnerability behaves. Whether it is reachable over a network or needs local access. Whether it needs privileges. Whether a user has to do something. What it costs in confidentiality, integrity and availability.",
        why: "The vector is far more informative than the score, and almost nobody reads it. Two vulnerabilities scoring 8.8 can be completely different problems, and the vector tells you which one you have in about ten seconds.",
        table: {
          caption: "Reading CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H",
          headers: ["Part", "Means", "Why it matters"],
          rows: [
            ["AV:N", "Attack vector: network", "Reachable remotely. AV:L would mean local access needed"],
            ["AC:L", "Attack complexity: low", "No special conditions required"],
            ["PR:N", "Privileges required: none", "No account needed. PR:H would need an administrator"],
            ["UI:N", "User interaction: none", "Nobody has to click anything"],
            ["C:H/I:H/A:H", "High impact on all three", "Total compromise of the data"],
          ],
          note: "AV:N with PR:N and UI:N is the combination that matters most: reachable by anyone, with no account and no help from a user. That is the one that gets scanned for at scale.",
        },
      },
      {
        id: "a-cs-w10-base-vs-environmental",
        title: "Base score, and the part nobody calculates",
        explain:
          "The score you see published is the base score, which describes the vulnerability in the abstract. CVSS also defines temporal metrics, for whether an exploit exists, and environmental metrics, for what it means on your system. Almost nobody computes the last two.",
        why: "So the number everybody quotes is explicitly the one that knows nothing about your environment. That is not a criticism of CVSS. It is what the standard says, in the standard, and reading the base score as risk is a misuse the authors warn about.",
        mistake:
          "Treating \"CVSS 9.8\" as a statement about your organisation. It is a statement about the vulnerability. The statement about your organisation is the one you have to make.",
      },
      {
        id: "a-cs-w10-epss-kev",
        title: "Is anybody actually exploiting it?",
        explain:
          "Two sources answer this better than a severity score. EPSS estimates the probability that a vulnerability will be exploited in the next thirty days. The CISA Known Exploited Vulnerabilities catalogue lists the ones that demonstrably are being exploited right now.",
        why: "This changes prioritisation more than anything else in the lesson. A 9.8 with an EPSS of 0.1% and no public exploit is a different problem from a 7.5 that is in the KEV catalogue and being used in campaigns this week.",
        table: {
          caption: "Four questions, four different sources.",
          headers: ["Question", "Source"],
          rows: [
            ["How bad is it in principle?", "CVSS base score"],
            ["How likely is exploitation soon?", "EPSS"],
            ["Is it being exploited right now?", "The KEV catalogue"],
            ["What would it cost us?", "Nobody. This one is yours"],
          ],
          note: "That last row is the whole of the next lesson, and it is the only one a tool cannot answer.",
        },
      },
      {
        id: "a-cs-w10-score-is-not-risk",
        title: "Severity is not risk",
        explain:
          "Severity describes the vulnerability. Risk describes what it would mean here: how exposed the system is, what data it holds, what an attacker reaches next, and what the organisation loses. The same CVE has one severity and as many risks as there are systems it is installed on.",
        why: "This is the sentence that separates someone who can run a scanner from someone who can advise a business. It is also the hardest one to hold onto when a report has four hundred findings and a deadline.",
        decision: {
          scenario:
            "You have two findings. A CVSS 9.8 remote code execution on an internal build server with no customer data, reachable only from the build network. And a CVSS 6.5 access control flaw on the internet-facing customer portal that lets any registered customer read every other customer's record.",
          question: "Which do you tell them to fix first?",
          options: [
            {
              id: "a",
              text: "The 9.8, because it is the higher severity and remote code execution is the worst outcome",
              whyWrong:
                "This is sorting by the number, and the number explicitly knows nothing about your environment. The 9.8 requires an attacker to already be on the build network. The 6.5 requires a free account and exposes every customer you have.",
            },
            {
              id: "b",
              text: "The 6.5, because it is internet-facing, needs only a free account, and exposes every customer record",
              why: "Exposure, effort and data at risk all point the same way. Any customer can read every other customer's data today, from the internet, with no tooling. That is a reportable data breach waiting to be noticed.",
            },
            {
              id: "c",
              text: "Both at once, since both are serious",
              whyWrong:
                "True and useless as advice. The client has finite engineering time this week and is asking you what to do first, which is exactly the judgement they are paying for.",
            },
            {
              id: "d",
              text: "Ask the client to decide, since they know their business",
              whyWrong:
                "They do know their business and they hired you for this. Bring a recommendation with your reasoning; they can override it, and an unranked list is not a deliverable.",
            },
          ],
          correct: "b",
          aftermath:
            "Notice what the reasoning used: who can reach it, what it costs them to try, and what they get. That is the shape of every prioritisation decision in this field, and it is the exercise in the next lesson.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 3
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "cs-l39-prioritising",
    moduleId: "cs-w10-vulnerabilities",
    sectionId: SECTION_ID,
    order: 3,
    title: "Prioritising",
    subtitle: "The judgement the scanner cannot make",
    estimatedMinutes: 14,
    intro:
      "This lesson is mostly one exercise, and it is the most important exercise in the month. You will be given five findings with their scanner scores and their context, and asked to rank them. Ranking by score will fail, on purpose.",

    atoms: [
      {
        id: "a-cs-w10-risk-formula",
        title: "Likelihood times impact, made concrete",
        explain:
          "Risk is roughly how likely something is multiplied by how bad it would be. Likelihood comes from exposure, the effort required and whether anyone is actually exploiting it. Impact comes from what data and what systems are reached.",
        why: "The formula is not the useful part; the questions behind it are. Who can reach this, what does it cost them to try, and what do they get. Those three questions do most of the work in any prioritisation conversation.",
        table: {
          caption: "What actually moves each half.",
          headers: ["Raises likelihood", "Raises impact"],
          rows: [
            ["Reachable from the internet", "Personal, financial or medical data"],
            ["No authentication needed", "Credentials that open other systems"],
            ["A public exploit exists", "A system others depend on"],
            ["It is in the KEV catalogue", "Regulatory or contractual consequences"],
            ["Trivial to attempt at scale", "Ability to move deeper into the network"],
          ],
        },
      },
      {
        id: "a-cs-w10-prioritise",
        title: "Practice: rank the findings",
        explain:
          "Five real-shaped findings from an assessment. Each carries the scanner's score and the context the scanner did not have. Assign each one a priority band.",
        why: "When you finish, the exercise shows you the scanner's order beside your own. They will not match, and the gap between them is exactly what a client is paying for when they hire someone rather than buying a licence.",
        riskExercise: {
          brief:
            "Your scan produced these five findings. Assign each a priority band, then compare your order with the scanner's. Read the exposure and the data at risk, not just the score.",
          findings: [
            {
              id: "f-build-rce",
              title: "Remote code execution in an outdated library on the build server",
              cvss: 9.8,
              exposure: "Internal only, reachable from the build network",
              dataAtRisk: "Build artefacts and CI configuration",
              expected: "medium",
              why: "A 9.8 describes the vulnerability in the abstract, assuming an attacker who can reach it. Nobody outside can. Reaching this host requires already being on the build network, which means an attacker has already achieved something significant. It is genuinely serious and it is not this week's problem, and it would rise sharply if the build server held deployment credentials.",
            },
            {
              id: "f-portal-idor",
              title: "Any customer can read any other customer's record on the portal",
              cvss: 6.5,
              exposure: "Internet-facing, needs only a free registered account",
              dataAtRisk: "Every customer record, including bank details",
              expected: "critical",
              why: "The score is moderate because it requires an account. An account costs nothing and takes ninety seconds. Every customer record in the business is readable today, from the internet, with no tools at all, and that is a notifiable data breach the moment anybody notices.",
            },
            {
              id: "f-admin-default",
              title: "Default credentials on the internet-facing admin panel",
              cvss: 9.1,
              exposure: "Internet-facing, no account needed",
              dataAtRisk: "Full administrative control of the application",
              expected: "critical",
              why: "Reachable by anyone, requires no skill whatsoever, and grants complete control. Automated scanning finds this within hours of it appearing. Both the score and the context agree, which is not always the case and is why this one is easy.",
            },
            {
              id: "f-hr-sqli",
              title: "SQL injection in the internal HR reporting tool",
              cvss: 8.8,
              exposure: "Internal, requires a valid staff login",
              dataAtRisk: "Staff salaries, national ID numbers, home addresses",
              expected: "high",
              why: "It needs a staff account, which narrows who can reach it, and any phished employee provides one. The data is exactly the kind that carries legal obligations and lasting harm to individuals, so the impact is severe even though the exposure is limited.",
            },
            {
              id: "f-headers",
              title: "Missing security headers on the marketing website",
              cvss: 4.3,
              exposure: "Internet-facing",
              dataAtRisk: "None. Static content, no login, no user data",
              expected: "low",
              why: "Worth fixing because it is nearly free, and there is nothing behind this site to protect. No accounts, no data, no session to steal. Reporting it at the same weight as the portal finding would train the client to ignore your severities.",
            },
          ],
          successMessage:
            "That is a remediation plan somebody could work through on Monday. Now look at the two lists below and notice that the scanner put the least urgent finding first.",
        },
        mistake:
          "Reporting in scanner order because it is defensible. It is defensible and it is wrong, and the client will fix the wrong thing first while trusting that you told them to.",
      },
      {
        id: "a-cs-w10-exploitability",
        title: "Does a working exploit exist?",
        explain:
          "There is a large gap between a vulnerability being theoretically exploitable, having a proof of concept published, and having a reliable weaponised exploit in widely used tooling. Each step multiplies the number of people who can use it.",
        why: "It is one of the strongest signals available and it is not in the base score. A vulnerability whose exploit landed in a popular framework last week will be attempted against every internet-facing host within days, regardless of what it scores.",
        table: {
          caption: "Four stages, and who can use it at each.",
          headers: ["Stage", "Who can exploit it"],
          rows: [
            ["Theoretical, described in an advisory", "Specialists, with effort"],
            ["Proof of concept published", "Anyone who can read and adapt code"],
            ["Reliable exploit in common tooling", "Anyone at all"],
            ["Active in campaigns, in the KEV catalogue", "It is already happening to somebody"],
          ],
        },
      },
      {
        id: "a-cs-w10-compensating",
        title: "Compensating controls",
        explain:
          "Sometimes you cannot patch. The vendor has no fix, the system cannot be restarted this quarter, the application breaks on the new version. A compensating control reduces the risk without removing the vulnerability: restrict who can reach it, disable the affected feature, add detection for its use.",
        why: "Insisting on patching as the only acceptable answer makes you useless in exactly the situations where advice is most needed. The professional answer names the risk, proposes a mitigation, and puts a date on revisiting it.",
        example:
          "Finding      Vulnerable service on an internal host, no patch until Q2\n\nUnhelpful    \"Patch immediately.\"\n\nUseful       \"No fix is available until Q2. Until then:\n              restrict access to the two admin hosts that need it,\n              disable the affected module if the feature is unused,\n              add a detection rule for the exploit pattern,\n              and review this on 14 January.\"",
      },
      {
        id: "a-cs-w10-accept-risk",
        title: "Accepting risk is a legitimate answer",
        explain:
          "Four things can be done with a risk: remove it, reduce it, transfer it through insurance or a contract, or accept it. Acceptance means a named person with the authority to decide has agreed, in writing, with a date to review.",
        why: "Security people often treat acceptance as a failure. It is not. The failure is unrecorded acceptance, where nobody decided anything and everybody assumed somebody else would. A written acceptance means the organisation knows what it is carrying.",
        decision: {
          scenario:
            "A legacy system cannot be patched without a rewrite costing more than the system is worth. It is internal, holds no personal data, and is due for decommissioning in eighteen months.",
          question: "What is the right recommendation?",
          options: [
            {
              id: "a",
              text: "Insist on patching. An unpatched system is never acceptable",
              whyWrong:
                "This is the position that gets security excluded from planning conversations. The rewrite costs more than the asset is worth, and a recommendation that ignores that will simply be ignored in turn.",
            },
            {
              id: "b",
              text: "Recommend formal risk acceptance: named owner, written rationale, compensating controls, and a review date tied to the decommissioning",
              why: "The risk is real, the treatment is proportionate, and it is now recorded rather than assumed. If the decommissioning slips, the review date brings it back rather than letting it quietly become permanent.",
            },
            {
              id: "c",
              text: "Remove it from the report, since nothing will be done about it",
              whyWrong:
                "An unrecorded risk is the worst outcome of the four. When it is exploited in fourteen months, nobody will be able to show that the organisation had weighed it.",
            },
            {
              id: "d",
              text: "Escalate to the board so the decision is made at the highest level",
              whyWrong:
                "Disproportionate. Escalation is for risks beyond the owner's authority to accept, and using it for everything ensures nobody reads the ones that matter.",
            },
          ],
          correct: "b",
          aftermath:
            "The review date is the part people leave out, and it is what stops a temporary acceptance becoming a permanent silence.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 4
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "cs-l40-exploitation-and-remediation",
    moduleId: "cs-w10-vulnerabilities",
    sectionId: SECTION_ID,
    order: 4,
    title: "Exploitation and Remediation",
    subtitle: "Confirming it, then closing it",
    estimatedMinutes: 12,
    intro:
      "Exploitation in a professional context means confirming that a vulnerability is real, in a controlled way, against a system you are authorised to test. Everything after it is about making sure the finding actually gets closed.",

    atoms: [
      {
        id: "a-cs-w10-exploitation-concepts",
        title: "What exploitation means in a test",
        explain:
          "The purpose is to establish whether the vulnerability is real and what it leads to. The proof is usually something small and undeniable: a specific file read, a command whose output identifies the account, a record returned that should not have been. Never damage, never persistence, never more than the scope permits.",
        why: "Exploitation removes the argument. A scanner finding gets debated; a screenshot of the server returning its own hostname in response to your request does not. That is the whole value, and anything beyond it is risk without benefit.",
        mistake:
          "Going further because it is interesting. Establishing access answers the question. Exploring afterwards is where outages happen, where real data gets touched, and where a test starts looking like an intrusion in the client's logs.",
      },
      {
        id: "a-cs-w10-frameworks",
        title: "Exploitation frameworks",
        explain:
          "Frameworks such as Metasploit package known exploits with a consistent interface. They are standard professional tooling, and they are also why a vulnerability with a module written for it is far more dangerous than one without.",
        why: "Two things follow. As a tester, they save days of work against known issues. As a defender, the existence of a module is a prioritisation signal, because it moves a vulnerability from \"specialists could\" to \"anyone can\".",
        decision: {
          scenario:
            "You are mid-engagement with a scope covering one web application. An exploitation framework reports a promising module against a database server on an adjacent address that you noticed while scanning.",
          question: "What do you do?",
          options: [
            {
              id: "a",
              text: "Run it. It is on the same network and demonstrating the full impact helps the client",
              whyWrong:
                "It is outside the scope. That address may not even belong to the client, and if it does, testing it is unauthorised access to a system nobody agreed you could touch. Good intentions do not extend a scope.",
            },
            {
              id: "b",
              text: "Stop, report what you observed and ask whether the scope can be extended in writing",
              why: "The observation is valuable and belongs in the report. Acting on it requires authorisation, and an extension takes one email. That email is also the record that protects you.",
            },
            {
              id: "c",
              text: "Test it carefully in a read-only way, since that cannot cause harm",
              whyWrong:
                "Read-only is still unauthorised access, and the offence does not depend on whether you changed anything. The care is commendable and does not address the question.",
            },
            {
              id: "d",
              text: "Note it silently and mention it at the closing meeting",
              whyWrong:
                "Better than testing it, and too late. If it is genuinely exposed, the client should hear today, and holding it until the closing meeting serves nobody.",
            },
          ],
          correct: "b",
          aftermath:
            "Scope creep during an engagement is one of the most common professional failures in this field, and it almost always begins with something genuinely worth looking at.",
        },
      },
      {
        id: "a-cs-w10-post-assessment",
        title: "What it leads to",
        explain:
          "A finding's real severity often comes from what is reachable next. Access to a web server matters more if it holds a database password. A low-privilege account matters more if the machine has a known escalation path. This is the step that turns a list of findings into an attack narrative.",
        why: "Clients understand narratives. \"Three medium findings\" is a shrug. \"These three findings chain together to reach the customer database, and here is the sequence\" changes a meeting, and it is honest, because that is how an attacker would use them.",
        example:
          "Three findings, reported separately:\n  1. Directory listing enabled on the web server      Low\n  2. A backup file readable in the web root          Medium\n  3. Database credentials in the backup's config      Medium\n\nReported as a chain:\n  Anyone on the internet can list the directory, download the backup,\n  read the database password from it, and connect to the database,\n  which is reachable. Elapsed time: about four minutes.  Critical",
      },
      {
        id: "a-cs-w10-remediation-plan",
        title: "A remediation plan the owner can work through",
        explain:
          "Ordered by priority, not by where the finding appeared. Each entry names the fix, who owns it, roughly what it costs, and how it will be verified. And it separates the quick wins from the work that needs planning, because those go to different people.",
        why: "A findings list is a problem statement. A remediation plan is something a manager can put into a sprint. Delivering the first and calling it the second is the most common reason good reports produce no change.",
        table: {
          caption: "The columns that make it actionable.",
          headers: ["Column", "Why it is there"],
          rows: [
            ["Priority", "So the order is yours and not the reader's guess"],
            ["Finding", "One line, in their language"],
            ["Fix", "Specific. Not \"validate input\" but which check, where"],
            ["Owner", "A team. Unowned work does not happen"],
            ["Effort", "Rough. It decides what goes in this sprint"],
            ["Verification", "How you will know it is actually fixed"],
          ],
        },
      },
      {
        id: "a-cs-w10-retest",
        title: "It is not closed until it is retested",
        explain:
          "A finding marked fixed by the team who fixed it is a claim. Retesting confirms it, and retests routinely find that the fix addressed the reported example rather than the underlying issue, or that it was applied on one host out of four.",
        why: "It closes the loop, and it is the part that gets dropped when a budget is tight. A vulnerability management process without verification produces a register full of things marked done that are not.",
        practice: {
          prompt:
            "A team reports that the access control finding is fixed. What do you test?",
          answer:
            "The original request, to confirm the reported case. Then the same class in other places: other endpoints taking an id, other object types, and the same endpoint with other HTTP methods. Fixes very often address the example and leave the class, and the second test is the one that finds that out.",
        },
      },
    ],

    task: {
      title: "This week's lab",
      intro: "Scan, triage, validate and plan, against your own authorised lab target.",
      prompts: [
        "Install OpenVAS or Nessus Essentials and run a full scan against your lab VM. Record the configuration and the limits of what it covered.",
        "Export the raw findings and count them. This is the number nobody can act on.",
        "Validate the top ten by severity. For each, check the real package version, whether the vulnerable feature is enabled, and whether the path is reachable. Record which survive and which do not, with reasoning.",
        "Re-rank the survivors by risk rather than by score, using exposure, effort and data at risk. Write one sentence per finding explaining any place your order differs from the scanner's.",
        "Pick one validated finding and confirm it in the lab in the most minimal way that proves it, against your own machine only.",
        "Write a vulnerability assessment report with a prioritised, validated findings list and a remediation plan including owners, effort and verification steps.",
      ],
      closing:
        "The sentences explaining where your order differs from the scanner's are the most valuable thing in that report. They are the part a licence cannot produce.",
    },

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
