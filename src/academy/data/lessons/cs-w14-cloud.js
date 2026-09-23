/**
 * CYBERSECURITY · WEEK 14 · CLOUD SECURITY & EMERGING THREATS
 *
 * Harvard anchor: applies the course's "evaluate tomorrow's threats" ethos to
 * today's fastest-moving domains.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 *
 * This week is deliberately provider-neutral. The service names differ between
 * AWS, Azure and Google Cloud; the failure modes do not, and a lesson pinned
 * to one provider's console is out of date within a year. Where a concrete
 * example helps, the generic name is used and the provider-specific one is
 * given beside it.
 *
 * The AI section covers security OF AI systems. It teaches prompt injection as
 * a defender: what it is, why input and instruction sharing a channel is the
 * same bug as Week 7's injection, and what actually mitigates it.
 */

export const SECTION_ID = "cs-s14-cloud";

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 1
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "cs-l53-shared-responsibility",
    moduleId: "cs-w14-cloud",
    sectionId: SECTION_ID,
    order: 1,
    title: "Shared Responsibility",
    subtitle: "Which half is actually yours",
    estimatedMinutes: 11,
    intro:
      "Moving to the cloud does not reduce your security work. It changes which parts are yours, and almost every serious cloud breach happens in the half people assumed the provider was handling.",

    atoms: [
      {
        id: "a-cs-cloud-what-changes",
        title: "What actually changes",
        explain:
          "You stop maintaining hardware, hypervisors and physical access. You start maintaining a vastly larger and more fluid configuration surface, where a single change can expose a database to the entire internet in about four seconds and leave no trace anybody looks at.",
        why: "The old failure was an unpatched server. The new one is a misconfiguration. That is why cloud security work is dominated by identity and configuration rather than by patching, and why the tooling looks so different.",
        table: {
          caption: "Where the work goes.",
          headers: ["", "On premises", "Cloud"],
          rows: [
            ["Physical security", "Yours", "Theirs"],
            ["Hypervisor patching", "Yours", "Theirs"],
            ["Operating system patching", "Yours", "Yours, unless fully managed"],
            ["Network configuration", "Yours, changed rarely", "Yours, changed constantly"],
            ["Identity and permissions", "Yours, one directory", "Yours, and now the primary attack surface"],
            ["Data classification", "Yours", "Yours"],
          ],
        },
      },
      {
        id: "a-cs-cloud-shared-model",
        title: "The model, and the line that moves",
        explain:
          "Every provider publishes a shared responsibility model. The provider secures the cloud; you secure what you put in it. Where the line sits depends on the service: with a virtual machine you own the operating system, with a managed database you do not, and with a serverless function you own almost nothing but your code and its permissions.",
        why: "The line moving by service is the part that catches people out. A team that understands the model for virtual machines and then adopts a managed service often keeps applying the old division, and patches something the provider already patched while ignoring the permissions they now own entirely.",
        mistake:
          "Reading \"the provider is responsible for security of the cloud\" as \"the provider is responsible for security\". Every large cloud data breach in the last decade sits on your side of that line.",
      },
      {
        id: "a-cs-cloud-iam",
        title: "Identity is the perimeter now",
        explain:
          "There is no network edge to defend. Every service is an API endpoint reachable from anywhere, and what decides whether a request succeeds is the identity making it and the permissions attached to that identity.",
        why: "It means an over-permissive role is the cloud equivalent of an unpatched internet-facing server, and it is far more common. It also means that in an investigation the first question is not which machine but which identity.",
        table: {
          caption: "The concepts, under whatever name your provider uses.",
          headers: ["Concept", "Is"],
          rows: [
            ["Principal", "Who or what is making the request"],
            ["Role", "A set of permissions something can assume temporarily"],
            ["Policy", "The rules saying which principal may do what to which resource"],
            ["Access key", "A long-lived credential. Avoid where a role will do"],
            ["Managed identity", "A credential the platform rotates for you. Prefer this"],
          ],
        },
      },
      {
        id: "a-cs-cloud-keys",
        title: "Long-lived keys are the problem",
        explain:
          "An access key is a username and password for an API, with no expiry and no second factor. Every cloud provider now offers a mechanism for a workload to obtain short-lived credentials automatically instead, and that mechanism is almost always the right answer.",
        why: "Long-lived keys end up in code repositories, in continuous integration configuration, in a developer's shell history and in a screenshot in a support ticket. Automated scanners find published keys within minutes, and the key does not expire on its own.",
        decision: {
          scenario:
            "A developer needs a script on a cloud virtual machine to read from an object storage bucket. They ask you to create an access key for it.",
          question: "What do you do?",
            options: [
            {
              id: "a",
              text: "Create the key with read-only permission on that bucket only",
              whyWrong:
                "Scoping it narrowly is genuinely better than the alternative they probably expected, and it is still a long-lived credential that will end up in a file on that machine, in a backup of that machine and possibly in a repository.",
            },
            {
              id: "b",
              text: "Attach a role to the virtual machine granting read access to that bucket, so the script obtains short-lived credentials automatically and no key exists",
              why: "There is no credential to leak, no key to rotate, and no expiry to forget. This is the mechanism every major provider offers precisely to remove this class of problem, and it is usually less work than creating the key.",
            },
            {
              id: "c",
              text: "Create the key and store it in an environment variable rather than a file",
              whyWrong:
                "Environment variables are readable by any process on the machine and appear in process listings, crash dumps and debug output. It moves the key without removing it.",
            },
            {
              id: "d",
              text: "Create the key and set a calendar reminder to rotate it every ninety days",
              whyWrong:
                "Rotation is a control for keys you cannot avoid, and the reminder will be missed. The question here is whether the key needs to exist, and it does not.",
            },
          ],
          correct: "b",
          aftermath:
            "The general rule: a long-lived key is a fallback for cases where no workload identity mechanism exists, which is increasingly rare. Reach for it last, not first.",
        },
      },
      {
        id: "a-cs-cloud-audit-logs",
        title: "The audit log is the one thing to turn on first",
        explain:
          "Every provider has a service recording every API call: who, what, when, from where, and whether it succeeded. It is usually not fully enabled by default, and it is the only record of how a configuration came to be the way it is.",
        why: "Without it, a cloud investigation has almost nothing to work with. There is no machine to image and no disk to examine; there is only the record of API calls. If that was not being written, the incident is largely unanswerable.",
        mistake:
          "Writing the audit log into the same account it is auditing, with no protection against deletion. An attacker who reaches administrative access turns it off, and there is no copy anywhere else. Send it to a separate account with write-once storage.",
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 2
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "cs-l54-cloud-breaches",
    moduleId: "cs-w14-cloud",
    sectionId: SECTION_ID,
    order: 2,
    title: "How Cloud Breaches Actually Happen",
    subtitle: "Four configurations, over and over",
    estimatedMinutes: 13,
    intro:
      "Publicly analysed cloud breaches are remarkably repetitive. Almost all of them involve a storage bucket made public, a role with far more permission than it needed, a network rule that was too broad, or a credential that should never have existed.",

    atoms: [
      {
        id: "a-cs-cloud-public-buckets",
        title: "The public bucket",
        explain:
          "Object storage is private by default on every major provider today. It becomes public because somebody needed a file to be reachable, set the whole bucket to public rather than the one object, and moved on.",
        why: "It is the single most-reported cloud exposure of the past decade, it requires no attack, and it is found by continuously scanning for readable buckets, which many people do. The fix is usually a policy at the account level that prevents any bucket being made public at all.",
        mistake:
          "Relying on an unguessable bucket name. Names appear in URLs, in page source, in mobile app bundles, in certificate logs and in the wordlists people build specifically to find them.",
      },
      {
        id: "a-cs-cloud-overpermissive",
        title: "The role that could do everything",
        explain:
          "A service needs to read one bucket. It is given full storage permissions because that was the example in the documentation, or full administrative permissions because something was failing and widening it made the error go away.",
        why: "Permission granted to make an error disappear is granted without anybody knowing what was actually needed, and it is never narrowed afterwards. This is Week 5's least privilege, in an environment where the blast radius of a single role can be the whole estate.",
        decision: {
          scenario:
            "A deployment pipeline is failing with permission errors. A colleague suggests granting its role administrator access temporarily to unblock the release, then narrowing it next sprint.",
          question: "What do you say?",
          options: [
            {
              id: "a",
              text: "Agree. It is temporary and the release is blocked",
              whyWrong:
                "Nothing is narrowed next sprint, because the pipeline now works and nobody wants to break it again. You have also lost the information about which permission was actually missing, which was the only useful output of the failure.",
            },
            {
              id: "b",
              text: "Read the actual denial in the audit log, which names the exact permission and resource, and grant that",
              why: "The error message tells you precisely what was denied. Granting that one permission takes about as long as granting administrator access and leaves the role correct rather than dangerous.",
            },
            {
              id: "c",
              text: "Grant administrator access and add a ticket to narrow it, with a deadline",
              whyWrong:
                "Better than no ticket and it still grants full administrative access to a pipeline, which is one of the highest-value targets in the estate. The ticket competes with feature work and loses.",
            },
            {
              id: "d",
              text: "Block the release until the permissions are properly designed",
              whyWrong:
                "Disproportionate when the answer is sitting in the audit log and takes ten minutes. Blocking a release over something solvable is how security gets routed around next time.",
            },
          ],
          correct: "b",
          aftermath:
            "Denial messages in cloud audit logs are unusually good: they name the principal, the action and the resource. Reading one is almost always faster than guessing, and it is the habit that keeps roles narrow.",
        },
      },
      {
        id: "a-cs-cloud-security-group",
        title: "Practice: fix the network rules",
        explain:
          "A three-tier application in a virtual network. The rules were written correctly and a broad rule from the initial build is still sitting above them. Reorder until every flow gets the verdict the brief asks for.",
        why: "Cloud network rules are the same first-match, default-deny model as Week 6, with one difference: they are changed weekly by people deploying features, so the broad rule from the first week of the project tends to survive for years.",
        firewallExercise: {
          brief:
            "Load balancers are on 10.0.0.0/24, the web tier on 10.0.1.0/24, the database on 10.0.2.0/24, and the bastion is 10.0.9.5. The load balancer reaches the web tier on 443. The web tier reaches the database on 5432. The bastion reaches anything on 22. The web tier must NOT reach the internet, and nothing from the internet may reach the database.",
          rules: [
            {
              id: "allow-web-egress",
              action: "allow",
              proto: "tcp",
              source: "10.0.1.0/24",
              dest: "any",
              port: "any",
            },
            {
              id: "allow-lb-web",
              action: "allow",
              proto: "tcp",
              source: "10.0.0.0/24",
              dest: "10.0.1.0/24",
              port: 443,
            },
            {
              id: "allow-web-db",
              action: "allow",
              proto: "tcp",
              source: "10.0.1.0/24",
              dest: "10.0.2.0/24",
              port: 5432,
            },
            {
              id: "allow-bastion-ssh",
              action: "allow",
              proto: "tcp",
              source: "10.0.9.5",
              dest: "10.0.0.0/16",
              port: 22,
            },
            {
              id: "deny-web-egress",
              action: "deny",
              proto: "tcp",
              source: "10.0.1.0/24",
              dest: "any",
              port: "any",
            },
          ],
          traffic: [
            {
              id: "c1",
              label: "Load balancer to web tier",
              proto: "tcp",
              source: "10.0.0.5",
              dest: "10.0.1.10",
              port: 443,
              expect: "allow",
            },
            {
              id: "c2",
              label: "Web tier to database",
              proto: "tcp",
              source: "10.0.1.10",
              dest: "10.0.2.20",
              port: 5432,
              expect: "allow",
            },
            {
              id: "c3",
              label: "Web tier calling out to the internet",
              proto: "tcp",
              source: "10.0.1.10",
              dest: "45.87.2.19",
              port: 443,
              expect: "deny",
            },
            {
              id: "c4",
              label: "Internet host reaching the database",
              proto: "tcp",
              source: "41.203.7.88",
              dest: "10.0.2.20",
              port: 5432,
              expect: "deny",
            },
            {
              id: "c5",
              label: "Bastion SSH to the web tier",
              proto: "tcp",
              source: "10.0.9.5",
              dest: "10.0.1.10",
              port: 22,
              expect: "allow",
            },
          ],
          expect: true,
          successMessage:
            "Every flow is correct. Now look at the broad rule: it is marked as never firing, because the deny above it catches everything it would have matched. A rule that can never fire should be deleted at the next change, not left as a trap for whoever reorders this later.",
        },
        mistake:
          "Leaving the dead rule in place because it is harmless now. It is harmless only while the rule above it stays where it is, and somebody reordering these in eighteen months has no way to know that.",
      },
      {
        id: "a-cs-cloud-metadata",
        title: "The metadata service, and why SSRF is critical in cloud",
        explain:
          "Cloud virtual machines can query a special internal address to obtain their own credentials. That is how a role attached to a machine works. It also means any vulnerability that makes the server fetch a URL of the attacker's choosing can be pointed at that address.",
        why: "It converts server-side request forgery from a moderate finding into a critical one. The attacker never needs to reach the machine; they get the machine's cloud credentials and use them directly against the provider's API from anywhere.",
        example:
          "On premises:\n  SSRF lets an attacker make your server fetch an internal URL.\n  Serious, and bounded by what is on the internal network.\n\nIn cloud:\n  SSRF lets an attacker fetch the machine's own credentials\n  and use the role it was given, from their own laptop.\n  That is why A10 on the OWASP list is where it is.",
        mistake:
          "Rating a server-side request forgery finding as medium out of habit. In a cloud environment, ask what role the machine holds before you rate it, because that is what the finding is actually worth.",
      },
      {
        id: "a-cs-cloud-drift",
        title: "Configuration drift, at cloud speed",
        explain:
          "On premises, configuration drifts over months. In cloud it drifts hourly, because dozens of people can change it and most changes are made through automation nobody reviews line by line.",
        why: "It makes continuous configuration checking a requirement rather than a nice-to-have. A quarterly review of cloud configuration describes a state that existed for about an hour in the second week of the quarter.",
        practice: {
          prompt:
            "Why is a quarterly cloud configuration review close to useless on its own?",
          answer:
            "Because configuration changes continuously and the review is a snapshot. A bucket made public on the Monday after the review is public for three months before anybody looks. The answer is automated continuous checking with alerts on specific dangerous changes, and the quarterly review becomes an audit of whether that is working.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 3
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "cs-l55-containers-and-iac",
    moduleId: "cs-w14-cloud",
    sectionId: SECTION_ID,
    order: 3,
    title: "Containers and Infrastructure as Code",
    subtitle: "Where the configuration actually lives now",
    estimatedMinutes: 12,
    intro:
      "Two shifts that changed where security work happens. Containers moved the operating system into the build. Infrastructure as code moved the network diagram into a repository. Both are opportunities, and both are new ways to publish a mistake at scale.",

    atoms: [
      {
        id: "a-cs-cloud-containers",
        title: "What a container is, and what it is not",
        explain:
          "A container packages an application with its dependencies and runs it in an isolated view of the system, sharing the host kernel. It is not a virtual machine. A virtual machine has its own kernel and a much stronger boundary.",
        why: "The shared kernel is the security-relevant difference. A container escape is a real class of vulnerability, and it means containers should not be treated as a boundary between mutually untrusted workloads without something stronger underneath.",
        mistake:
          "Running a container as root inside, on the assumption that the container is the boundary. Root inside a container is a much shorter distance from root on the host than root inside a virtual machine is from the hypervisor.",
      },
      {
        id: "a-cs-cloud-images",
        title: "The image is the supply chain",
        explain:
          "A container image is built from a base image, which was built from another, which came from a registry. Everything in that chain runs with your application, and most of it is software nobody on the team has ever looked at.",
        why: "It is Week 7's dependency problem with the whole operating system included. The practical controls are small base images, pinned versions rather than latest, scanning images in the build, and rebuilding regularly rather than only when the code changes.",
        table: {
          caption: "Four habits that remove most image risk.",
          headers: ["Habit", "Removes"],
          rows: [
            ["A minimal base image", "Hundreds of packages you never use and must still patch"],
            ["Pin the base image by digest", "Your build silently changing under you"],
            ["Scan in the pipeline, fail on critical", "Shipping a known vulnerable image"],
            ["Rebuild on a schedule", "An image built in March with March's vulnerabilities"],
          ],
          note: "The last one surprises people. An image whose code has not changed still ages, because the packages inside it do.",
        },
      },
      {
        id: "a-cs-cloud-secrets",
        title: "Secrets in images and repositories",
        explain:
          "A secret copied into an image is in every layer of that image, readable by anybody who can pull it, including after a later layer deletes the file. A secret committed to a repository is in the history forever.",
        why: "Both are among the most common findings in a cloud assessment, and both have the same remedy: the secret must be rotated, not removed. Deleting it changes what is visible and not what is valid.",
        decision: {
          scenario:
            "You find a database password in a container image that has been published to an internal registry for eight months. The team offers to rebuild the image without it today.",
          question: "Is that sufficient?",
          options: [
            {
              id: "a",
              text: "Yes. Once the new image is deployed the secret is no longer in use",
              whyWrong:
                "The old image is still in the registry and still pullable, and the password in it still works. Anyone who pulled it in the last eight months has it. The exposure is not removed by publishing something else.",
            },
            {
              id: "b",
              text: "No. Rotate the password first, then rebuild, then work out who could have pulled that image and whether it was used",
              why: "Rotation is what actually ends the exposure, because it invalidates the credential wherever it has already gone. The rebuild stops it recurring, and the registry access log answers the scope question.",
            },
            {
              id: "c",
              text: "No. Delete the old image from the registry and rebuild",
              whyWrong:
                "Deletion removes future access and does nothing about the eight months of pulls that already happened. The credential is still valid in whatever hands it reached.",
            },
            {
              id: "d",
              text: "Yes, provided the registry is internal only",
              whyWrong:
                "Internal only narrows the audience to everybody inside, which for most organisations is hundreds of accounts plus every compromised one. It reduces the number, not the validity of the credential.",
            },
          ],
          correct: "b",
          aftermath:
            "The rule generalises to every exposed secret anywhere: rotate first, then clean up, then scope. Reversing that order means the credential stays valid while you tidy.",
        },
      },
      {
        id: "a-cs-cloud-iac",
        title: "Infrastructure as code",
        explain:
          "Terraform, CloudFormation and similar tools define your infrastructure in files that are version controlled, reviewed and applied automatically. The network diagram, the permissions and the storage configuration all become code.",
        why: "It is the best thing to happen to cloud security in a decade, because it makes configuration reviewable before it exists. A permission that would have been a click is now a line in a pull request, and it can be scanned, commented on and rejected.",
        table: {
          caption: "What becomes possible.",
          headers: ["Before", "With infrastructure as code"],
          rows: [
            ["A permission granted by a click, unrecorded", "A line in a pull request with an author"],
            ["Drift discovered quarterly", "Drift detected by the tool on every run"],
            ["Configuration reviewed by reading a console", "Scanned automatically before it is applied"],
            ["Rebuilding an environment from memory", "Rebuilding it from the repository"],
          ],
        },
        mistake:
          "Scanning the deployed environment and not the code. By the time a misconfiguration is deployed it is already exposed. Scanning the definition catches it while it is still a pull request.",
      },
      {
        id: "a-cs-cloud-orchestration",
        title: "Orchestration, in one atom",
        explain:
          "Kubernetes and similar systems schedule containers across machines and give them networking, storage and configuration. From a security point of view they add three things: another identity system, another network policy layer, and a very powerful API that is occasionally exposed by accident.",
        why: "You will not master this in one atom and you do need to know where to look. The three questions are: who can reach the API, what can each workload's identity do, and is there a network policy or can every pod reach every other pod.",
        practice: {
          prompt:
            "In a default Kubernetes cluster with no network policies, what can one compromised pod reach?",
          answer:
            "Every other pod in the cluster. The default is unrestricted pod-to-pod networking, which is Week 6's flat network problem, rebuilt inside the cluster. Network policies are the segmentation, and like segmentation they are usually added after somebody asks the question rather than by default.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 4
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "cs-l56-iot-and-ai",
    moduleId: "cs-w14-cloud",
    sectionId: SECTION_ID,
    order: 4,
    title: "IoT and AI",
    subtitle: "Two surfaces that did not exist in the textbook",
    estimatedMinutes: 12,
    intro:
      "Two domains moving faster than the guidance. Both are best approached with the reasoning from Week 1 rather than with a list of specific attacks, because the specific attacks will have changed by the time you read this.",

    atoms: [
      {
        id: "a-cs-iot-problem",
        title: "Why IoT is structurally difficult",
        explain:
          "Devices ship with default credentials, cannot easily be patched, have no interface to configure them properly, are sold by manufacturers who may not exist in three years, and are installed by people who are not IT staff and never told anybody.",
        why: "Each of those is a problem you have met before. Together they produce a device with an internet-reachable service, a default password and no update path, sitting on the same network as everything else, for eight years.",
        example:
          "The camera in reception:\n\n  default password       still set\n  firmware               last updated 2019\n  vendor                 acquired, product discontinued\n  network                same VLAN as the finance workstations\n  who installed it       the office manager, in 2021\n  who knows it is there  nobody, until the network scan",
      },
      {
        id: "a-cs-iot-defence",
        title: "What actually works for IoT",
        explain:
          "Segmentation, because you cannot patch what the vendor abandoned. Discovery, because you cannot protect what you do not know is there. Egress control, because a compromised device's value to an attacker is mostly in what it can reach. And procurement, because the only real fix is not buying the worst devices.",
        why: "Notice that three of the four are things you learned in Month 2. IoT security is largely ordinary network security applied to devices that cannot defend themselves, which is why there is no separate IoT toolkit worth buying.",
        table: {
          caption: "Four controls, in order of what they return.",
          headers: ["Control", "Why it works here"],
          rows: [
            ["Put them on their own segment", "You cannot patch them, so contain them"],
            ["Discover what is actually on the network", "Most of these were installed by somebody else"],
            ["Restrict what they can reach outbound", "A compromised camera's value is its network access"],
            ["Ask security questions before buying", "The only control that removes the problem"],
          ],
        },
      },
      {
        id: "a-cs-ai-surface",
        title: "What is genuinely new about AI systems",
        explain:
          "Most of an AI application's attack surface is an ordinary application: an API, a database, authentication, permissions. What is new is that the model takes untrusted natural language as input, that its output is often trusted by whatever consumes it, and that its training data and its context window are both places data can leak.",
        why: "Separating the new from the familiar stops you rebuilding your whole threat model. Secure the application the way you would secure any application, and then deal with the three genuinely new things.",
        mistake:
          "Treating an AI feature as an exotic problem requiring specialist tooling, while the API in front of it has no authorisation check. The boring vulnerabilities are still the ones that will be found first.",
      },
      {
        id: "a-cs-ai-prompt-injection",
        title: "Prompt injection is Week 7, again",
        explain:
          "A model receives instructions and data in the same channel, as text. If the data contains something that reads like an instruction, the model may follow it. That is precisely the shape of SQL injection: untrusted input becoming part of the instruction.",
        why: "Recognising the shape tells you what will and will not help. Filtering known phrases is a denylist and will be bypassed, exactly as stripping the word script was in Week 7. What helps is limiting what the system can do when it has been persuaded.",
        decision: {
          scenario:
            "An assistant feature summarises customer support emails and can also look up account details and issue refunds. Somebody sends an email containing text instructing the assistant to issue a refund to a different account.",
          question: "What is the primary mitigation?",
          options: [
            {
              id: "a",
              text: "Filter emails for phrases that look like instructions before they reach the model",
              whyWrong:
                "That is a denylist against natural language, which is an infinite and paraphrasable space. It is the same mistake as stripping the word script in Week 7, with a far larger space of bypasses.",
            },
            {
              id: "b",
              text: "Remove the assistant's ability to take consequential actions directly. It may draft a refund; a human or a separately authorised system approves it",
              why: "It assumes the model can be persuaded, because it can, and limits what that persuasion is worth. This is least privilege applied to a component whose input cannot be trusted, which is the only control that holds.",
            },
            {
              id: "c",
              text: "Instruct the model in its system prompt to ignore instructions found in emails",
              whyWrong:
                "Useful and not a boundary. The instruction and the untrusted data are still in the same channel competing for the model's attention, and this technique is bypassed routinely.",
            },
            {
              id: "d",
              text: "Use a larger model, which will be less easily confused",
              whyWrong:
                "Capability is not the issue. A more capable model follows instructions better, including the injected ones, and the architecture is what decides the outcome.",
            },
          ],
          correct: "b",
          aftermath:
            "The general principle: an AI component that processes untrusted input should be treated as untrusted itself. Give it the permissions you would give to the person who sent the input.",
        },
      },
      {
        id: "a-cs-ai-data",
        title: "Where the data goes",
        explain:
          "Three questions to ask about any AI feature. What is sent to the model, and does that include personal data. Is that data used for training, and by whom. And can the model's output contain something it should not, whether from its training data or from another user's context.",
        why: "These are privacy questions from Week 13 wearing new clothes, and they are exactly the questions an impact assessment is for. Pasting customer records into a third-party model is a cross-border transfer of personal data to a processor, whatever else it is.",
        table: {
          caption: "The three questions, and what they map to.",
          headers: ["Question", "Which existing discipline"],
          rows: [
            ["What is sent to the model?", "Data minimisation, and third-party risk"],
            ["Is it used for training?", "Purpose limitation, and the contract"],
            ["Can the output leak something?", "Access control, and output handling"],
            ["Where is the provider hosted?", "Cross-border transfer rules"],
          ],
          note: "None of these needs a new framework. They need the existing one applied to a component people are excited about and therefore reviewing less carefully.",
        },
      },
    ],

    task: {
      title: "This week's lab",
      intro: "Audit a cloud configuration and reason about an AI feature.",
      prompts: [
        "Create a free-tier cloud account, or use a cloud lab simulator. Deliberately create a public storage bucket, then find it with a configuration scanner and record what the scanner reported.",
        "Create a role with far more permission than it needs, then narrow it using the actual denial messages in the audit log. Record both the before and after policy.",
        "Confirm the audit log service is enabled, and write down where the logs go and who could delete them.",
        "Run a configuration scanner such as Prowler or ScoutSuite against the account. Triage the findings by risk rather than by severity, using the Week 10 method.",
        "Build a container image, scan it, and record how many vulnerabilities come from your code versus from the base image. Then rebuild it on a minimal base and compare.",
        "Write a one-page assessment of an AI feature you have used: what data is sent, whether it is used for training, what the model can do on your behalf, and what you would change.",
        "Produce a cloud security audit report with findings, risk ratings and specific hardening recommendations.",
      ],
      closing:
        "The comparison between your code's vulnerabilities and the base image's is usually striking, and it is the fastest way to persuade a team to change base images.",
    },

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
