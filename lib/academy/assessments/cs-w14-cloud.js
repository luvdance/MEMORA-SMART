/**
 * ASSESSMENTS · CYBERSECURITY · WEEK 14 · CLOUD & EMERGING THREATS
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Never import this from anything under src/.
 * ═════════════════════════════════════════════════════════════════════════
 */

export const ASSESSMENTS = {
  /* ═══════════════════════════════════════════════════════════════════ */
  "cs-l53-shared-responsibility": {
    lessonId: "cs-l53-shared-responsibility",
    passMark: 70,
    questions: [
      {
        id: "csq53-1",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cs-cloud-shared-model",
        prompt:
          "Why does the shared responsibility line move depending on which service you use?",
        options: [
          { id: "a", text: "Because providers charge differently for each service" },
          {
            id: "b",
            text: "Because with a virtual machine you own the operating system, with a managed database you do not, and with a serverless function you own little but your code and its permissions",
          },
          { id: "c", text: "Because the line is negotiated per customer" },
          { id: "d", text: "It does not move; it is the same for all services" },
        ],
        correct: "b",
        explanation:
          "Teams that learn the model for virtual machines and then adopt a managed service often keep the old division, patching something the provider already patched while ignoring permissions they now own entirely.",
        whyWrong: {
          a: "Pricing is unrelated to who is responsible for which layer.",
          c: "The model is published and standard, not negotiated per customer.",
          d: "It differs substantially by service, which is the part that catches people out.",
        },
      },
      {
        id: "csq53-2",
        type: "scenario",
        difficulty: 3,
        atomId: "a-cs-cloud-keys",
        prompt:
          "A script on a cloud virtual machine needs to read one storage bucket. What is the right credential?",
        options: [
          { id: "a", text: "An access key scoped to read-only on that bucket" },
          {
            id: "b",
            text: "A role attached to the machine, so the script obtains short-lived credentials automatically and no key exists",
          },
          { id: "c", text: "An access key in an environment variable rather than a file" },
          { id: "d", text: "An access key with a ninety-day rotation reminder" },
        ],
        correct: "b",
        explanation:
          "There is no credential to leak, no key to rotate and no expiry to forget. Every major provider offers this precisely to remove the class of problem, and it is usually less work than creating a key.",
        whyWrong: {
          a: "Narrow scoping is genuinely better than the usual alternative, and it is still a long-lived credential that will end up in a file, a backup or a repository.",
          c: "Environment variables are readable by any process and appear in process listings and crash dumps. It moves the key without removing it.",
          d: "Rotation is for keys you cannot avoid, and the reminder will be missed. This key need not exist.",
        },
      },
      {
        id: "csq53-3",
        type: "mcq",
        difficulty: 3,
        atomId: "a-cs-cloud-iam",
        prompt:
          "Why is identity described as the perimeter in cloud environments?",
        options: [
          { id: "a", text: "Because cloud providers do not offer firewalls" },
          {
            id: "b",
            text: "Because every service is an API endpoint reachable from anywhere, so what decides a request is the identity making it",
          },
          { id: "c", text: "Because network controls are deprecated" },
          { id: "d", text: "Because identity providers are more reliable than firewalls" },
        ],
        correct: "b",
        explanation:
          "There is no network edge to defend. An over-permissive role is the cloud equivalent of an unpatched internet-facing server, and in an investigation the first question is which identity rather than which machine.",
        whyWrong: {
          a: "They offer several layers of network control, which remain worth configuring.",
          c: "Network controls are still valuable, as the security group exercise in this week shows.",
          d: "Reliability is not the argument. Reachability is.",
        },
      },
      {
        id: "csq53-4",
        type: "scenario",
        difficulty: 3,
        atomId: "a-cs-cloud-audit-logs",
        prompt:
          "Why should cloud audit logs not be written into the account they audit?",
        options: [
          { id: "a", text: "Because it costs more" },
          {
            id: "b",
            text: "Because an attacker who reaches administrative access can turn them off or delete them, and there is no copy elsewhere",
          },
          { id: "c", text: "Because logs must be stored in a different region" },
          { id: "d", text: "Because query performance suffers" },
        ],
        correct: "b",
        explanation:
          "In a cloud investigation there is often no machine to image. The API call record is all you have, so it needs to be in a separate account with write-once storage.",
        whyWrong: {
          a: "Cross-account logging costs about the same, and cost is not the concern.",
          c: "Region placement matters for data residency, which is a separate question.",
          d: "Query performance is unaffected by which account holds the data.",
        },
      },
      {
        id: "csq53-5",
        type: "truefalse",
        difficulty: 2,
        atomId: "a-cs-cloud-what-changes",
        prompt: "Moving to the cloud reduces the total amount of security work.",
        options: [
          { id: "a", text: "True" },
          { id: "b", text: "False" },
        ],
        correct: "b",
        explanation:
          "It changes which parts are yours. You stop maintaining hardware and hypervisors, and you gain a much larger and more fluid configuration surface where one change can expose a database in seconds.",
        whyWrong: {
          a: "Some work genuinely disappears, and it is replaced by identity and configuration work that is larger and moves faster. The net is not a reduction.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "cs-l54-cloud-breaches": {
    lessonId: "cs-l54-cloud-breaches",
    passMark: 70,
    questions: [
      {
        id: "csq54-1",
        type: "scenario",
        difficulty: 3,
        atomId: "a-cs-cloud-overpermissive",
        prompt:
          "A deployment pipeline fails with permission errors. A colleague suggests temporary administrator access. What do you do?",
        options: [
          { id: "a", text: "Agree; it is temporary and the release is blocked" },
          {
            id: "b",
            text: "Read the denial in the audit log, which names the exact permission and resource, and grant that",
          },
          { id: "c", text: "Grant administrator access with a ticket and a deadline to narrow it" },
          { id: "d", text: "Block the release until permissions are properly designed" },
        ],
        correct: "b",
        explanation:
          "Cloud denial messages name the principal, the action and the resource. Granting that one permission takes about as long as granting administrator access and leaves the role correct.",
        whyWrong: {
          a: "Nothing is narrowed later, because the pipeline works and nobody wants to break it. You also lose the information about what was actually missing.",
          c: "Better than no ticket, and it grants full administrative access to one of the highest-value targets in the estate while the ticket competes with feature work.",
          d: "Disproportionate when the answer is in the log and takes ten minutes. Blocking a solvable release is how security gets routed around.",
        },
      },
      {
        id: "csq54-2",
        type: "scenario",
        difficulty: 3,
        atomId: "a-cs-cloud-metadata",
        prompt:
          "Why is server-side request forgery rated more severely in a cloud environment than on premises?",
        options: [
          { id: "a", text: "Because cloud networks are faster" },
          {
            id: "b",
            text: "Because it can be pointed at the instance metadata service to obtain the machine's cloud credentials, which the attacker then uses from anywhere",
          },
          { id: "c", text: "Because cloud providers do not allow outbound filtering" },
          { id: "d", text: "Because cloud applications are more exposed" },
        ],
        correct: "b",
        explanation:
          "The attacker never needs to reach the machine. They get the role it was given and use it directly against the provider's API, which is why this sits where it does on the OWASP list.",
        whyWrong: {
          a: "Network speed has no bearing on the severity of the outcome.",
          c: "Outbound filtering is available and is a useful mitigation, which is the opposite of this claim.",
          d: "Exposure varies, and the severity change comes specifically from the credentials being retrievable.",
        },
      },
      {
        id: "csq54-3",
        type: "scenario",
        difficulty: 3,
        atomId: "a-cs-cloud-security-group",
        prompt:
          "After reordering, a broad rule is marked as never firing. What should happen to it?",
        options: [
          { id: "a", text: "Leave it; it is harmless where it is" },
          {
            id: "b",
            text: "Delete it at the next change. It is harmless only while the rule above it stays where it is",
          },
          { id: "c", text: "Move it back to the top so it is visible" },
          { id: "d", text: "Convert it to a deny rule" },
        ],
        correct: "b",
        explanation:
          "Somebody reordering these in eighteen months has no way to know that the dead rule is load-bearing in its dormancy. A rule that can never fire is a trap left for a future colleague.",
        whyWrong: {
          a: "Its harmlessness is entirely dependent on the ordering, which is the thing most likely to change.",
          c: "That restores the original bug, which is exactly what the exercise just fixed.",
          d: "Duplicating the deny below an identical deny adds nothing and leaves the same confusion.",
        },
      },
      {
        id: "csq54-4",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cs-cloud-public-buckets",
        prompt: "Why is an unguessable bucket name not a control?",
        options: [
          { id: "a", text: "Because bucket names must be short" },
          {
            id: "b",
            text: "Because names appear in URLs, page source, mobile app bundles, certificate logs and purpose-built wordlists",
          },
          { id: "c", text: "Because providers publish bucket listings" },
          { id: "d", text: "Because names cannot contain random characters" },
        ],
        correct: "b",
        explanation:
          "Obscurity leaks through every channel the name touches, and people scan continuously for readable buckets. The account-level policy preventing any bucket being public is the actual control.",
        whyWrong: {
          a: "Names can be long. Length is not the limitation.",
          c: "Providers do not publish listings, and the name reaches the world through other routes anyway.",
          d: "Random characters are permitted, and randomness does not stop the name being published in a URL.",
        },
      },
      {
        id: "csq54-5",
        type: "scenario",
        difficulty: 2,
        atomId: "a-cs-cloud-drift",
        prompt: "Why is a quarterly cloud configuration review close to useless on its own?",
        options: [
          { id: "a", text: "Because quarterly reviews are expensive" },
          {
            id: "b",
            text: "Because configuration changes continuously, so the review describes a state that existed for about an hour",
          },
          { id: "c", text: "Because scanners cannot run quarterly" },
          { id: "d", text: "Because auditors require monthly reviews" },
        ],
        correct: "b",
        explanation:
          "A bucket made public the Monday after the review stays public for three months. Continuous automated checking with alerts is the control, and the quarterly review becomes an audit of whether that is working.",
        whyWrong: {
          a: "Cost is not the issue; the timing relative to the rate of change is.",
          c: "They can run at any cadence. The question is whether that cadence matches the rate of change.",
          d: "No such general requirement exists, and monthly would have the same structural problem.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "cs-l55-containers-and-iac": {
    lessonId: "cs-l55-containers-and-iac",
    passMark: 70,
    questions: [
      {
        id: "csq55-1",
        type: "mcq",
        difficulty: 3,
        atomId: "a-cs-cloud-containers",
        prompt:
          "What is the security-relevant difference between a container and a virtual machine?",
        options: [
          { id: "a", text: "Containers are smaller" },
          { id: "b", text: "Containers share the host kernel, so the isolation boundary is weaker" },
          { id: "c", text: "Virtual machines cannot be networked" },
          { id: "d", text: "Containers cannot run as root" },
        ],
        correct: "b",
        explanation:
          "Container escape is a real vulnerability class. A virtual machine has its own kernel and a much stronger boundary, which matters when the workloads do not trust each other.",
        whyWrong: {
          a: "Size is an operational benefit with no bearing on the isolation boundary.",
          c: "Virtual machines are networked routinely and extensively.",
          d: "They very much can, and running as root inside a container is one of the common mistakes.",
        },
      },
      {
        id: "csq55-2",
        type: "scenario",
        difficulty: 3,
        atomId: "a-cs-cloud-secrets",
        prompt:
          "A database password is found in a container image published eight months ago. The team offers to rebuild without it. Is that enough?",
        options: [
          { id: "a", text: "Yes; once the new image is deployed the secret is no longer in use" },
          {
            id: "b",
            text: "No. Rotate the password first, then rebuild, then establish who could have pulled that image",
          },
          { id: "c", text: "No; delete the old image from the registry and rebuild" },
          { id: "d", text: "Yes, provided the registry is internal only" },
        ],
        correct: "b",
        explanation:
          "Rotation is what ends the exposure, because it invalidates the credential wherever it has already gone. Rebuilding stops recurrence and the registry access log answers the scope question.",
        whyWrong: {
          a: "The old image is still pullable and the password in it still works. Publishing something else changes nothing.",
          c: "Deletion removes future access and does nothing about eight months of pulls that already happened.",
          d: "Internal only means everybody inside plus every compromised account. It reduces the audience, not the validity.",
        },
      },
      {
        id: "csq55-3",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cs-cloud-images",
        prompt:
          "Why rebuild a container image on a schedule even when the code has not changed?",
        options: [
          { id: "a", text: "To keep the build pipeline warm" },
          { id: "b", text: "Because the packages inside it age, so an image built in March carries March's vulnerabilities" },
          { id: "c", text: "Because registries expire old images" },
          { id: "d", text: "To reduce image size over time" },
        ],
        correct: "b",
        explanation:
          "The code is stable and the base image is not. An image whose application has not changed still accumulates known vulnerabilities in everything else it contains.",
        whyWrong: {
          a: "Pipeline warmth is not a thing that needs maintaining.",
          c: "Registries retain images until somebody deletes them, which is part of the secret exposure problem.",
          d: "Rebuilding does not shrink an image. Choosing a minimal base does.",
        },
      },
      {
        id: "csq55-4",
        type: "mcq",
        difficulty: 3,
        atomId: "a-cs-cloud-iac",
        prompt:
          "Why scan infrastructure-as-code definitions rather than only the deployed environment?",
        options: [
          { id: "a", text: "Because scanning code is faster" },
          {
            id: "b",
            text: "Because by the time a misconfiguration is deployed it is already exposed; scanning the definition catches it while it is still a pull request",
          },
          { id: "c", text: "Because deployed environments cannot be scanned" },
          { id: "d", text: "Because code scanners are more accurate" },
        ],
        correct: "b",
        explanation:
          "The best thing infrastructure as code did for security is make configuration reviewable before it exists. A permission that would have been a click is now a line with an author.",
        whyWrong: {
          a: "Speed is incidental. Timing relative to exposure is the point.",
          c: "They can and should be scanned too. Both are needed, because drift happens outside the code.",
          d: "Accuracy is comparable. The difference is when the finding arrives.",
        },
      },
      {
        id: "csq55-5",
        type: "scenario",
        difficulty: 3,
        atomId: "a-cs-cloud-orchestration",
        prompt:
          "In a default Kubernetes cluster with no network policies, what can one compromised pod reach?",
        options: [
          { id: "a", text: "Only pods in the same namespace" },
          { id: "b", text: "Every other pod in the cluster" },
          { id: "c", text: "Nothing, until a service is defined" },
          { id: "d", text: "Only pods it shares a node with" },
        ],
        correct: "b",
        explanation:
          "The default is unrestricted pod-to-pod networking, which is Week 6's flat network problem rebuilt inside the cluster. Network policies are the segmentation, and they are usually added only after somebody asks.",
        whyWrong: {
          a: "Namespaces are an organisational boundary, not a network one, unless a policy makes them so.",
          c: "Services affect discovery and load balancing, not whether a pod can open a connection.",
          d: "Node placement does not constrain networking. Pods across nodes reach each other routinely.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "cs-l56-iot-and-ai": {
    lessonId: "cs-l56-iot-and-ai",
    passMark: 70,
    questions: [
      {
        id: "csq56-1",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cs-iot-defence",
        prompt:
          "Why is segmentation the primary control for IoT devices rather than patching?",
        options: [
          { id: "a", text: "Because segmentation is cheaper" },
          {
            id: "b",
            text: "Because many of these devices cannot be patched at all, so containing them is the only option left",
          },
          { id: "c", text: "Because IoT devices do not run software" },
          { id: "d", text: "Because segmentation removes the vulnerability" },
        ],
        correct: "b",
        explanation:
          "The vendor may not exist any more and the firmware may be six years old. You cannot fix the device, so you decide what it can reach when it falls.",
        whyWrong: {
          a: "Cost is a secondary consideration. Availability of a patch is the constraint.",
          c: "They run software, which is the problem. It is simply software nobody updates.",
          d: "Segmentation contains the consequence. The vulnerability remains exactly where it was.",
        },
      },
      {
        id: "csq56-2",
        type: "scenario",
        difficulty: 3,
        atomId: "a-cs-ai-prompt-injection",
        prompt:
          "An assistant summarises customer emails and can issue refunds. An email contains text instructing it to refund a different account. What is the primary mitigation?",
        options: [
          { id: "a", text: "Filter emails for instruction-like phrases before the model sees them" },
          {
            id: "b",
            text: "Remove its ability to take consequential actions directly; it drafts, a human or separately authorised system approves",
          },
          { id: "c", text: "Instruct the model to ignore instructions found in emails" },
          { id: "d", text: "Use a larger model, which is less easily confused" },
        ],
        correct: "b",
        explanation:
          "Assume the model can be persuaded, because it can, and limit what that persuasion is worth. This is least privilege applied to a component whose input cannot be trusted.",
        whyWrong: {
          a: "A denylist against natural language, which is an infinite and paraphrasable space. The same mistake as stripping the word script in Week 7.",
          c: "Useful and not a boundary. Instruction and untrusted data remain in the same channel, and this is bypassed routinely.",
          d: "A more capable model follows instructions better, including injected ones. Architecture decides the outcome.",
        },
      },
      {
        id: "csq56-3",
        type: "mcq",
        difficulty: 3,
        atomId: "a-cs-ai-surface",
        prompt:
          "What is genuinely new about an AI application's attack surface, as opposed to familiar?",
        options: [
          { id: "a", text: "Everything; it requires an entirely new threat model" },
          {
            id: "b",
            text: "Untrusted natural language as input, output being trusted by what consumes it, and training data and context as places data can leak",
          },
          { id: "c", text: "Nothing; it is an ordinary web application" },
          { id: "d", text: "The API, the database and the authentication" },
        ],
        correct: "b",
        explanation:
          "Separating the new from the familiar stops you rebuilding the whole threat model. Secure the application as you would any application, then handle those three.",
        whyWrong: {
          a: "Most of the surface is an ordinary application, and treating it as exotic means the boring vulnerabilities go unexamined.",
          c: "The three new things are real and do need specific handling.",
          d: "Those are exactly the familiar parts, and they are where the first findings usually are.",
        },
      },
      {
        id: "csq56-4",
        type: "scenario",
        difficulty: 3,
        atomId: "a-cs-ai-data",
        prompt:
          "A team wants to paste customer records into a third-party AI service for analysis. What is that, in data protection terms?",
        options: [
          { id: "a", text: "Internal processing, so no additional considerations apply" },
          {
            id: "b",
            text: "Disclosure of personal data to a processor, probably across a border, needing a purpose, a contract and a check on whether it trains on the data",
          },
          { id: "c", text: "Anonymous, since the model does not store names" },
          { id: "d", text: "A security question rather than a privacy one" },
        ],
        correct: "b",
        explanation:
          "These are Week 13's questions wearing new clothes. Purpose limitation, third-party risk, cross-border transfer and the contract, all applied to a component people are excited about and therefore reviewing less carefully.",
        whyWrong: {
          a: "Sending data to another company is not internal processing by any definition.",
          c: "Whether the model retains it is one question of several, and the disclosure has already occurred either way.",
          d: "It is both, and treating it as security alone skips the lawful basis question entirely.",
        },
      },
      {
        id: "csq56-5",
        type: "truefalse",
        difficulty: 2,
        atomId: "a-cs-iot-problem",
        prompt:
          "An IoT device with a default password on an internal network is low risk because it is not internet-facing.",
        options: [
          { id: "a", text: "True" },
          { id: "b", text: "False" },
        ],
        correct: "b",
        explanation:
          "It sits on the same network as everything else, cannot be patched, and gives an attacker who reaches the internal network a permanent foothold that nobody monitors. Its value is what it can reach.",
        whyWrong: {
          a: "Not being internet-facing lowers the likelihood of the first contact and does nothing about what happens after anybody gets inside, which is the scenario segmentation exists for.",
        },
      },
    ],
  },
};

export default ASSESSMENTS;
