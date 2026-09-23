/**
 * ASSESSMENTS · CYBERSECURITY · WEEK 5 · OS SECURITY & HARDENING
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Never import this from anything under src/.
 * ═════════════════════════════════════════════════════════════════════════
 */

export const ASSESSMENTS = {
  /* ═══════════════════════════════════════════════════════════════════ */
  "cs-l17-users-and-privilege": {
    lessonId: "cs-l17-users-and-privilege",
    passMark: 70,
    questions: [
      {
        id: "csq17-1",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cs-w5-sudo",
        prompt: "Why is `sudo command` preferable to logging in as root?",
        options: [
          { id: "a", text: "Because sudo runs commands faster" },
          {
            id: "b",
            text: "Because it raises privilege for one command and logs which named person ran what",
          },
          { id: "c", text: "Because root cannot run every command" },
          { id: "d", text: "Because sudo encrypts the command" },
        ],
        correct: "b",
        explanation:
          "The audit trail is the point. After an incident, \"root did it\" tells you nothing because root is everybody. \"ada ran this at 02:14\" is the start of an investigation.",
        whyWrong: {
          a: "sudo adds a small overhead if anything. Speed is not a consideration.",
          c: "Root can run everything. That is precisely the problem with working as root.",
          d: "Nothing is encrypted. The command is recorded in the log in plain text, which is what makes it useful.",
        },
      },
      {
        id: "csq17-2",
        type: "scenario",
        difficulty: 3,
        atomId: "a-cs-w5-escalation",
        prompt:
          "Why is granting `sudo vim /etc/app/config.yml` effectively granting full root?",
        options: [
          { id: "a", text: "Because the config file controls the whole system" },
          { id: "b", text: "Because vim can run shell commands from inside the editor, as root" },
          { id: "c", text: "Because sudo rules always apply to every file" },
          { id: "d", text: "It is not. It is correctly scoped to one file" },
        ],
        correct: "b",
        explanation:
          "Anything that can execute something else escalates completely. Editors, interpreters, find and tar all qualify, which is why published lists of these exist.",
        whyWrong: {
          a: "The file's importance is not the issue. The same problem would exist for a harmless file.",
          c: "sudo rules can be scoped to specific commands and arguments. The rule here is scoped; the program is the problem.",
          d: "It looks correctly scoped, which is exactly why this catches people out. The scope is defeated from inside the program it permits.",
        },
      },
      {
        id: "csq17-3",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cs-w5-accounts",
        prompt: "What is distinctive about the root account on Linux?",
        options: [
          { id: "a", text: "It has every permission granted to it" },
          { id: "b", text: "Permission checks do not apply to it at all" },
          { id: "c", text: "It is the only account that can log in remotely" },
          { id: "d", text: "It is the only account with a password" },
        ],
        correct: "b",
        explanation:
          "The distinction matters. Root is not an account with a very long list of permissions that could be trimmed. The kernel skips the check, which is why becoming root ends the contest.",
        whyWrong: {
          a: "Close, and wrong in a way that matters. A very privileged account could still be constrained. Root cannot, because nothing is consulted.",
          c: "Any account can log in remotely if configured to, and disabling root's remote login is standard hardening.",
          d: "Every account can have a password, and on many systems root's is locked entirely in favour of sudo.",
        },
      },
      {
        id: "csq17-4",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cs-w5-service-accounts",
        prompt: "Why does nginx run its worker processes as www-data rather than root?",
        options: [
          { id: "a", text: "Because root cannot open network connections" },
          {
            id: "b",
            text: "So that an attacker who compromises the web server inherits an account that can do almost nothing",
          },
          { id: "c", text: "Because www-data is faster at serving files" },
          { id: "d", text: "To avoid confusing the process list" },
        ],
        correct: "b",
        explanation:
          "This is least privilege applied to software. The master starts as root only to bind a low port; every process that actually handles requests from strangers runs as a restricted account.",
        whyWrong: {
          a: "Root can do everything including opening connections. Binding port 80 is in fact the one thing that requires it.",
          c: "The account has no effect on performance. Permissions are checked identically.",
          d: "Clarity in the process list is a side effect, not a reason.",
        },
      },
      {
        id: "csq17-5",
        type: "truefalse",
        difficulty: 2,
        atomId: "a-cs-w5-groups",
        prompt:
          "Adding a user to a powerful group to unblock an urgent task is fine as long as you intend to remove them later.",
        options: [
          { id: "a", text: "True" },
          { id: "b", text: "False" },
        ],
        correct: "b",
        explanation:
          "False, because nobody removes them later. This is exactly how access drifts. If it has to be done, write the removal down as a dated task before you make the change.",
        whyWrong: {
          a: "The intention is genuine and the removal reliably does not happen. Audit any organisation and you will find staff in groups from roles they left years ago.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "cs-l18-file-permissions": {
    lessonId: "cs-l18-file-permissions",
    passMark: 70,
    questions: [
      {
        id: "csq18-1",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cs-w5-octal",
        prompt: "What does mode 640 allow?",
        options: [
          { id: "a", text: "Owner read and write, group read, others nothing" },
          { id: "b", text: "Owner read, group write, others read" },
          { id: "c", text: "Owner everything, group and others read" },
          { id: "d", text: "Everyone read and write" },
        ],
        correct: "a",
        explanation:
          "Read is 4, write is 2, execute is 1. Six is read plus write for the owner, four is read for the group, and zero is nothing for everyone else.",
        whyWrong: {
          b: "That would be 426, which is an unusual mode and not this one. The digits are owner, group, other in that order.",
          c: "Owner everything would be 7, and the third digit here is 0, so others get nothing rather than read.",
          d: "Everyone read and write is 666, which is the mode the payroll exercise started from and the one you were fixing.",
        },
      },
      {
        id: "csq18-2",
        type: "scenario",
        difficulty: 3,
        atomId: "a-cs-w5-private-key",
        prompt: "Why does SSH refuse to use a private key with mode 644?",
        options: [
          { id: "a", text: "Because SSH requires the execute bit" },
          {
            id: "b",
            text: "Because at 644 every account on the machine can read the key, and the key is the credential",
          },
          { id: "c", text: "Because 644 makes the file writable by others" },
          { id: "d", text: "Because the key must be owned by root" },
        ],
        correct: "b",
        explanation:
          "Anyone who can read the file can become you on every server that trusts it, with no password. This is one of very few cases where a tool enforces the permission rather than trusting you, and it is right to.",
        whyWrong: {
          a: "Keys are data, not programs. The execute bit is irrelevant and should not be set.",
          c: "644 is not writable by others. Readable is enough to be fatal here, which is the point.",
          d: "It must be owned by the user who uses it. Root ownership would be wrong.",
        },
      },
      {
        id: "csq18-3",
        type: "scenario",
        difficulty: 3,
        atomId: "a-cs-w5-world-writable",
        prompt:
          "A web root is left at 666. What is the specific danger, beyond untidiness?",
        options: [
          { id: "a", text: "Visitors to the site can edit the pages" },
          {
            id: "b",
            text: "Any process on the machine, including a compromised unrelated service, can change what visitors are served",
          },
          { id: "c", text: "The web server cannot read the files" },
          { id: "d", text: "Search engines will refuse to index the site" },
        ],
        correct: "b",
        explanation:
          "This is how a legitimate website becomes a malware host. The change comes from inside the machine, and nothing in the logs distinguishes it from a normal deployment.",
        whyWrong: {
          a: "File permissions apply to accounts on the machine, not to remote visitors, who never get a filesystem handle at all.",
          c: "666 includes read for everyone. The server can read it perfectly well; that is not the problem.",
          d: "Search engines have no view of file modes on your server.",
        },
      },
      {
        id: "csq18-4",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cs-w5-reading-mode",
        prompt:
          "In `-rw-r-----`, which part tells you what everyone else on the machine can do?",
        options: [
          { id: "a", text: "The first character" },
          { id: "b", text: "Characters 2 to 4" },
          { id: "c", text: "The last three characters" },
          { id: "d", text: "The whole string applies to everyone equally" },
        ],
        correct: "c",
        explanation:
          "Three groups of three, in the order owner, group, other. The last three are where the leaks are, which is why it is worth training your eye to jump there first.",
        whyWrong: {
          a: "The first character says file or directory, and nothing about permissions.",
          b: "Those are the owner's permissions, which are usually the least interesting from a security point of view.",
          d: "The whole design is that the three groups differ. If they did not, there would be three characters rather than nine.",
        },
      },
      {
        id: "csq18-5",
        type: "truefalse",
        difficulty: 1,
        atomId: "a-cs-w5-octal",
        prompt: "Setting a file to 777 is acceptable when you need to get something working quickly.",
        options: [
          { id: "a", text: "True" },
          { id: "b", text: "False" },
        ],
        correct: "b",
        explanation:
          "False. It always works, because it removes every check, and it is the most reliable indicator that the actual problem was not understood. It is also the first thing an attacker on the machine looks for.",
        whyWrong: {
          a: "It does work, which is exactly the trap. Temporary 777 is permanent in practice, because once it works nobody revisits it.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "cs-l19-reducing-surface": {
    lessonId: "cs-l19-reducing-surface",
    passMark: 70,
    questions: [
      {
        id: "csq19-1",
        type: "mcq",
        difficulty: 3,
        atomId: "a-cs-w5-bind-address",
        prompt:
          "In `ss -tlnp` output, a database shows `0.0.0.0:5432`. Why does that matter?",
        options: [
          { id: "a", text: "It means the database is using an invalid address" },
          { id: "b", text: "It means the database is listening on every interface, so the network can reach it" },
          { id: "c", text: "It means the database is restricted to localhost" },
          { id: "d", text: "It means the port is closed" },
        ],
        correct: "b",
        explanation:
          "0.0.0.0 means every interface. 127.0.0.1 would mean this machine only. It is one line in a config file and it is the difference between a private service and an exposed one.",
        whyWrong: {
          a: "0.0.0.0 is a valid and meaningful bind address. It is the meaning that is the problem.",
          c: "That would be 127.0.0.1, which is what the MySQL line in the same output showed.",
          d: "It appears under LISTEN, so it is very much open.",
        },
      },
      {
        id: "csq19-2",
        type: "scenario",
        difficulty: 3,
        atomId: "a-cs-w5-host-firewall",
        prompt:
          "A firewall has `deny tcp any any 22` above `allow tcp 10.0.9.0/24 any 22`. What happens to admin SSH traffic?",
        options: [
          { id: "a", text: "It is allowed, because the more specific rule wins" },
          { id: "b", text: "It is blocked, because the first matching rule wins and the deny is first" },
          { id: "c", text: "It is allowed, because allow rules take priority over deny rules" },
          { id: "d", text: "It depends on the firewall product" },
        ],
        correct: "b",
        explanation:
          "First match wins, top to bottom. Each rule reads correctly on its own, which is why this mistake is so common. The specific exception has to sit above the general rule.",
        whyWrong: {
          a: "Specificity is not considered at all. Position is the only thing that decides.",
          c: "There is no priority by action. A deny above an allow simply ends the evaluation first.",
          d: "First-match evaluation is near universal in the firewalls you will meet, and it is how the one in this lesson behaves.",
        },
      },
      {
        id: "csq19-3",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cs-w5-find-services",
        prompt:
          "Why is `ss -tlnp` a better question than \"which packages are installed?\"",
        options: [
          { id: "a", text: "Because it runs faster" },
          {
            id: "b",
            text: "Because it shows what is actually listening on a port, which is what a stranger can reach",
          },
          { id: "c", text: "Because installed packages cannot be listed on Linux" },
          { id: "d", text: "Because it shows vulnerabilities" },
        ],
        correct: "b",
        explanation:
          "A package that is installed but not running is not an exposure. A process with a socket open on 0.0.0.0 is, and almost every server has one nobody remembers enabling.",
        whyWrong: {
          a: "Speed is not the reason, and both are near instant.",
          c: "Packages are easily listed, and the list is long and mostly irrelevant to exposure.",
          d: "It shows no vulnerabilities at all. It shows exposure, which is where you then look for them.",
        },
      },
      {
        id: "csq19-4",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cs-w5-ssh-hardening",
        prompt:
          "Why does disabling password authentication for SSH stop automated guessing completely, rather than just making it harder?",
        options: [
          { id: "a", text: "Because the attacker cannot reach port 22 any more" },
          { id: "b", text: "Because there is no password to guess, so the whole category of attack has nothing to work on" },
          { id: "c", text: "Because keys are longer than passwords" },
          { id: "d", text: "Because SSH begins rate limiting" },
        ],
        correct: "b",
        explanation:
          "It is a different category rather than a stronger version. Guessing requires something guessable, and key authentication removes it entirely.",
        whyWrong: {
          a: "The port is still open and still receives connections. They simply cannot succeed by guessing.",
          c: "Length is part of why keys resist attack in principle, and it is not the mechanism here. The mechanism is that the password path no longer exists.",
          d: "Rate limiting is a separate control, usually from fail2ban, and it slows guessing rather than removing it.",
        },
      },
      {
        id: "csq19-5",
        type: "truefalse",
        difficulty: 2,
        atomId: "a-cs-w5-patching",
        prompt:
          "Unattended upgrades on the operating system mean your patching is fully handled.",
        options: [
          { id: "a", text: "True" },
          { id: "b", text: "False" },
        ],
        correct: "b",
        explanation:
          "False. They cover the distribution's own packages. The application installed from a downloaded archive, the language runtime's libraries and the container image are not in that list and nothing is watching them.",
        whyWrong: {
          a: "This belief is why so many breaches involve a component that was never in a package manager. Coverage is not the same as completeness.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "cs-l20-logs-and-baselines": {
    lessonId: "cs-l20-logs-and-baselines",
    passMark: 70,
    questions: [
      {
        id: "csq20-1",
        type: "scenario",
        difficulty: 3,
        atomId: "a-cs-w5-logs",
        prompt:
          "Why is keeping logs only on the machine that produced them a problem?",
        options: [
          { id: "a", text: "Because local disks fill up" },
          {
            id: "b",
            text: "Because an attacker with root can edit or delete them, so the record of the intrusion is in the intruder's control",
          },
          { id: "c", text: "Because local logs are not timestamped" },
          { id: "d", text: "Because compliance requires central storage" },
        ],
        correct: "b",
        explanation:
          "Once someone has root, everything on that machine is theirs, including whatever was recording them. Ship logs somewhere the compromised host cannot reach, which is what Week 11 builds.",
        whyWrong: {
          a: "Disks do fill, and that is an operations problem rather than the security one.",
          c: "Local logs are timestamped. Whether you can trust the timestamps after a root compromise is the real question.",
          d: "Some frameworks require it, and the requirement exists because of the reason above rather than for its own sake.",
        },
      },
      {
        id: "csq20-2",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cs-w5-baseline",
        prompt:
          "What makes the exceptions list the most professional part of a hardening report?",
        options: [
          { id: "a", text: "It shows how many checks were skipped" },
          {
            id: "b",
            text: "It records a deliberate reason and a compensating control for each setting not applied",
          },
          { id: "c", text: "It is required by the benchmark" },
          { id: "d", text: "It shortens the report" },
        ],
        correct: "b",
        explanation:
          "Anyone can run a benchmark script. Explaining what you did not apply, and why, is the judgement being assessed, and it is what an auditor or client actually asks for.",
        whyWrong: {
          a: "A count with no reasoning is just a lower score with extra steps.",
          c: "Benchmarks list checks. They do not require you to document exceptions; professional practice does.",
          d: "It lengthens it, and the length is worth it.",
        },
      },
      {
        id: "csq20-3",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cs-w5-windows",
        prompt: "What is User Account Control the Windows equivalent of?",
        options: [
          { id: "a", text: "chmod" },
          { id: "b", text: "sudo, in that it raises privilege for one deliberate action" },
          { id: "c", text: "iptables" },
          { id: "d", text: "systemctl" },
        ],
        correct: "b",
        explanation:
          "Both exist so that an ordinary session does not silently act with administrative rights. Turning UAC off removes the only thing standing between software and administrator on a machine where the user is a local admin.",
        whyWrong: {
          a: "The permission equivalent is NTFS permissions and icacls, which is a different mechanism.",
          c: "The firewall equivalent is Windows Defender Firewall, not UAC.",
          d: "Service management is the Services console. UAC is about privilege elevation.",
        },
      },
      {
        id: "csq20-4",
        type: "scenario",
        difficulty: 3,
        atomId: "a-cs-w5-endpoint",
        prompt:
          "How would you explain the difference between antivirus and endpoint detection and response to a director?",
        options: [
          { id: "a", text: "Detection and response catches more malware" },
          {
            id: "b",
            text: "Antivirus blocks what it recognises; detection and response records what happened so an unrecognised attack can still be investigated",
          },
          { id: "c", text: "Antivirus is obsolete and should be replaced" },
          { id: "d", text: "It is a compliance requirement" },
        ],
        correct: "b",
        explanation:
          "They answer different questions: prevention against the known, and visibility when prevention fails. Attackers test their tooling against the popular scanners before using it, which is why the second is needed.",
        whyWrong: {
          a: "Selling it as a better blocker sets up a failure, because its value is the recorded timeline rather than the block rate.",
          c: "Antivirus stops a large volume of commodity malware cheaply. Removing a working control is the opposite of defence in depth.",
          d: "The weakest argument available, and it invites the cheapest possible implementation.",
        },
      },
      {
        id: "csq20-5",
        type: "scenario",
        difficulty: 2,
        atomId: "a-cs-w5-drift",
        prompt:
          "A server scored 189 of 214 in January and 171 in June, with no recorded changes. What is the most likely explanation?",
        options: [
          { id: "a", text: "An intrusion has weakened the configuration" },
          {
            id: "b",
            text: "Ordinary configuration drift: package updates restoring defaults, a deployment, an urgent fix at 2am",
          },
          { id: "c", text: "The benchmark tool was updated and is now stricter" },
          { id: "d", text: "The score is unreliable and should be ignored" },
        ],
        correct: "b",
        explanation:
          "Drift is inevitable rather than a sign of carelessness, which is why hardening has to be a scheduled measurement rather than a one-off task.",
        whyWrong: {
          a: "Possible and worth ruling out, and far less likely than the mundane explanation. Investigate, but do not start there.",
          c: "Also worth checking, and it would show as a different denominator. The total was 214 in both runs.",
          d: "The score is exactly what caught the problem. Ignoring it removes the only signal you had.",
        },
      },
    ],
  },
};

export default ASSESSMENTS;
