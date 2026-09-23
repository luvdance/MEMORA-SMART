/**
 * CYBERSECURITY · WEEK 5 · OPERATING SYSTEM SECURITY & HARDENING
 *
 * Harvard anchor: CS50 Cybersecurity, "Securing Systems", at the host level.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 *
 * This is the week least privilege stops being a slogan. Three graded
 * permission exercises put the learner on the nine real bits, with the octal,
 * the ls -l string and a plain sentence naming who each bit lets in. The
 * sentence is the teaching: nobody forgets what the last column means after
 * reading "every other account on the machine can read it" once.
 */

export const SECTION_ID = "cs-s5-hardening";

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 1
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "cs-l17-users-and-privilege",
    moduleId: "cs-w5-hardening",
    sectionId: SECTION_ID,
    order: 1,
    title: "Users, Groups and Privilege",
    subtitle: "Who the machine thinks you are",
    estimatedMinutes: 11,
    intro:
      "Every security decision an operating system makes comes down to one question: which account is doing this? This lesson is about how that question is answered, and how attackers change the answer.",

    atoms: [
      {
        id: "a-cs-w5-accounts",
        title: "Accounts, and the one with no limits",
        explain:
          "Every process runs as some account. On Linux the account with user id 0 is root and the permission system does not apply to it at all. On Windows the equivalent is SYSTEM, with Administrator close behind. These accounts do not have lots of permissions. They have no permission checks.",
        why: "This is why gaining root is the goal of almost every intrusion. Getting onto a machine as an ordinary user is a foothold. Becoming root is the end of the contest, because from there nothing on the machine can refuse you, including whatever is meant to be logging you.",
        table: {
          caption: "The same idea on both systems.",
          headers: ["", "Linux", "Windows"],
          rows: [
            ["No checks apply", "root (uid 0)", "SYSTEM"],
            ["Powerful, checks still apply", "members of sudo or wheel", "Administrators group"],
            ["Ordinary", "a normal user", "Standard user"],
            ["Runs a service, cannot log in", "www-data, mysql, nobody", "Service accounts"],
          ],
          note: "That last row matters. Services run as their own restricted accounts precisely so that a compromised web server does not get the whole machine.",
        },
      },
      {
        id: "a-cs-w5-groups",
        title: "Groups, and why access drifts",
        explain:
          "A group is a named set of accounts. Permissions are granted to the group, and membership is what actually decides access. This scales, and it is why in most organisations nobody can say who can read a given file without checking.",
        why: "Access is granted in a hurry and almost never taken back. Audit any organisation honestly and you will find staff in groups from a role they left three jobs ago, and service accounts in groups somebody added during an outage in 2022.",
        mistake:
          "Adding a user to a powerful group to solve an immediate problem, intending to remove them later. Nobody removes them later. If it has to be done, write the removal down as a task with a date on it before you do it.",
      },
      {
        id: "a-cs-w5-sudo",
        title: "sudo, and why it is better than being root",
        explain:
          "sudo raises a single command to root, asks for your own password, and writes a line to the log saying who ran what. Logging in as root does none of those things. It gives you unlimited power for the whole session, authenticated by a password everyone in the team knows.",
        why: "The audit trail is the point. After an incident, \"root did it\" tells you nothing, because root is everybody. \"ada ran this at 02:14\" is an investigation. This is also why disabling direct root login over SSH is one of the highest-value settings on any server.",
        example:
          "  $ sudo systemctl restart nginx\n  [sudo] password for ada:\n\n  /var/log/auth.log:\n  Sep 14 09:22:01 web01 sudo: ada : TTY=pts/0 ;\n    PWD=/home/ada ; USER=root ; COMMAND=/bin/systemctl restart nginx\n\nOne line, naming the person, the time and the exact command.",
        mistake:
          "Running `sudo -i` or `sudo su -` at the start of every session and working as root from there. This throws away everything sudo gives you, because the log now records one escalation and nothing about what you did afterwards.",
      },
      {
        id: "a-cs-w5-service-accounts",
        title: "Why services get their own accounts",
        explain:
          "A web server does not run as you and does not run as root. It runs as an account like www-data that exists only for that purpose, cannot log in, has no home directory worth anything and can read only what it needs.",
        why: "This is least privilege applied to software rather than people, and it is the single control that decides how bad a web application compromise is. An attacker who takes over the web server inherits exactly what that account can do, which should be almost nothing.",
        example:
          "  $ ps aux | grep nginx\n  root      1043  nginx: master process\n  www-data  1044  nginx: worker process\n  www-data  1045  nginx: worker process\n\nThe master runs as root only because binding to port 80 requires it.\nThe workers, which handle every request from the internet, do not.",
        mistake:
          "Running an application as root because it would not start otherwise. It would not start because it was trying to do something it should not need to do, and running it as root hides the question rather than answering it.",
      },
      {
        id: "a-cs-w5-escalation",
        title: "Privilege escalation",
        explain:
          "An attacker rarely lands as root. They land as whatever account the vulnerable service was running as, and then look for a way up. A misconfigured sudo rule, a file owned by root that anyone can edit, a scheduled task running as root from a writable script, a service running as root that did not need to.",
        why: "This is why the ordinary-account permissions on a server matter so much. The gap between a web server compromise and a total compromise is entirely made of these mistakes, and almost all of them are configuration rather than software bugs.",
        table: {
          caption: "The four escalation paths you will actually find.",
          headers: ["Path", "What the attacker uses", "The fix"],
          rows: [
            ["A writable script run by root", "Edit it, wait for the schedule", "Nothing run as root should be writable by anyone else"],
            ["Over-broad sudo rule", "A permitted command that can spawn a shell", "Grant specific commands, never editors or interpreters"],
            ["Service running as root", "Compromise the service, inherit root", "Run services as their own restricted account"],
            ["World-writable configuration", "Point the service somewhere else", "Review file modes on anything a service reads"],
          ],
        },
        decision: {
          scenario:
            "A developer asks for sudo access to restart their application. You can give them the ability to run one command as root, and they suggest `sudo vim /etc/app/config.yml` so they can also edit the config.",
          question: "What do you grant?",
          options: [
            {
              id: "a",
              text: "Grant exactly that, since it is one specific command on one specific file",
              whyWrong:
                "vim can run shell commands from inside the editor. Granting sudo on any editor, or on anything that can execute something else, is granting full root with extra steps. This is one of the most common real escalation paths there is.",
            },
            {
              id: "b",
              text: "Grant sudo on the service restart command only, and make them the owner of the config file so no root is needed to edit it",
              why: "The restart genuinely needs root. Editing the file does not, and the right answer to an access problem is usually to change the ownership rather than to raise the person. Neither grant lets them spawn a root shell.",
            },
            {
              id: "c",
              text: "Add them to the sudo group so they stop asking",
              whyWrong:
                "That grants root for everything, permanently, to solve a request about one service. It is fast, it is what happens in real organisations constantly, and it is the drift the previous atom described.",
            },
            {
              id: "d",
              text: "Refuse, and restart the service for them each time",
              whyWrong:
                "Safe in the narrow sense and it makes you a bottleneck, which reliably ends in someone sharing a password to get work done. Security that blocks the job gets routed around.",
            },
          ],
          correct: "b",
          aftermath:
            "The general rule: never grant sudo on anything that can execute arbitrary commands. Editors, interpreters, find, tar and several others all qualify, and there are published lists precisely because it catches people out so often.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 2
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "cs-l18-file-permissions",
    moduleId: "cs-w5-hardening",
    sectionId: SECTION_ID,
    order: 2,
    title: "File Permissions in Practice",
    subtitle: "Nine bits that decide everything",
    estimatedMinutes: 14,
    intro:
      "This lesson is mostly hands on. You will set the permission bits yourself, three times, and each time a sentence underneath will tell you exactly who you just let in. That sentence is what makes the mode column stop being nine random characters.",

    atoms: [
      {
        id: "a-cs-w5-reading-mode",
        title: "Reading the mode column",
        explain:
          "The first character says whether it is a file or a directory. The nine after it are three groups of three: what the owner can do, what the group can do, and what everybody else can do. In each group, read then write then execute.",
        why: "You will read this column thousands of times. Learning to read it in one glance, and to jump straight to the last three characters because that is where the leaks are, is one of the highest-value habits in system administration.",
        example:
          "  -rw-r-----  1 finance finance-team  4096 Sep 14 09:02 payroll.csv\n   │└┬┘└┬┘└┬┘\n   │ │  │  └── everyone else: nothing\n   │ │  └───── the group: read\n   │ └──────── the owner: read and write\n   └────────── a regular file, not a directory",
        perms: {
          file: "payroll-2026.csv",
          owner: "finance",
          group: "finance-team",
          start: "640",
          requirement:
            "Here is that file. Toggle the bits and watch three things change together: the octal, the ls -l string, and the sentence saying who that lets in.",
          context:
            "Try switching on write for everyone else and read what appears. That is the setting behind a surprising share of real internal incidents.",
        },
      },
      {
        id: "a-cs-w5-octal",
        title: "The numbers",
        explain:
          "Read is 4, write is 2, execute is 1. Add them up per group and you get one digit per group. 6 is read and write. 5 is read and execute. 7 is everything. So 640 is read and write for the owner, read for the group, nothing for anyone else.",
        why: "Every piece of documentation, every configuration management tool and every hardening guide is written in these numbers. Being able to convert in your head is the difference between following instructions and understanding them.",
        table: {
          caption: "The modes you will actually use.",
          headers: ["Octal", "Symbolic", "For"],
          rows: [
            ["600", "rw-------", "Private keys, credentials. The owner and nobody else"],
            ["640", "rw-r-----", "Sensitive files a team needs to read"],
            ["644", "rw-r--r--", "Ordinary readable files, web content"],
            ["700", "rwx------", "A private directory or script"],
            ["755", "rwxr-xr-x", "Programs and directories everyone uses"],
            ["777", "rwxrwxrwx", "Never. This is a finding, not a configuration"],
          ],
        },
        mistake:
          "Reaching for 777 to make something work. It always works, because it removes every check. It is the most reliable indicator in the world that somebody did not understand the actual problem, and it is the first thing an attacker looks for.",
      },
      {
        id: "a-cs-w5-chmod-payroll",
        title: "Practice: lock down the payroll file",
        explain:
          "A payroll export has landed on a shared server with the wrong permissions. Fix it so that the finance team can do their job and nobody else can read salaries.",
        why: "This exact scenario, with this exact file type, is one of the most common real internal exposures there is. The file is not on the internet, it was not stolen, and everyone in the company can read it.",
        permsExercise: {
          file: "payroll-2026.csv",
          owner: "finance",
          group: "finance-team",
          start: "666",
          requirement:
            "The finance user must be able to read and edit this file. Everyone in finance-team must be able to read it, and must not be able to change it. Nobody else on the machine should be able to touch it at all.",
          expect: "640",
          context:
            "The current mode is what a careless copy or a badly set umask produces. Read the sentence under the grid before you change anything, and notice that it is already true right now.",
          successMessage:
            "640. The owner can work, the team can read, and every other account on the machine has nothing. That is least privilege stated in three digits.",
        },
      },
      {
        id: "a-cs-w5-private-key",
        title: "Practice: the SSH private key",
        explain:
          "SSH refuses to use a private key that other people can read, and it refuses loudly. This is one of very few places where the tool enforces the permission rather than trusting you, and it is worth understanding why it is that strict here.",
        why: "A private key is the credential. Anyone who can read the file can become you on every server that trusts it, with no password and no prompt. There is no scenario in which anybody but the owner should be able to read it.",
        permsExercise: {
          file: ".ssh/id_ed25519",
          owner: "ada",
          group: "ada",
          start: "644",
          requirement:
            "Set this private key so that only its owner can read and write it. Nobody else, including the owner's own group, should have any access whatsoever.",
          expect: "600",
          context:
            "At the current mode, SSH will refuse to use this key and print WARNING: UNPROTECTED PRIVATE KEY FILE. It is not being fussy. At 644 every account on the machine can read your credential.",
          successMessage:
            "600. SSH will now use it, and so will nobody else.",
        },
        mistake:
          "Fixing the warning by passing an option to ignore it, which people do find and do use. The warning is correct and the key is genuinely exposed.",
      },
      {
        id: "a-cs-w5-world-writable",
        title: "Practice: the world-writable web root",
        explain:
          "A web server's content directory has been left writable by everybody, usually because somebody could not work out why an upload was failing. Fix it without breaking the site.",
        why: "World-writable content is how a website becomes a malware host. Anything on the machine, including a compromised service running as an unrelated account, can now change the pages your customers see, and nothing in the logs will say it was not you.",
        permsExercise: {
          file: "index.html",
          owner: "www-data",
          group: "www-data",
          start: "666",
          requirement:
            "The web server account owns this file and needs to read and write it. Everyone else, including visitors' processes and every other service on the box, should be able to read it and nothing more.",
          expect: "644",
          context:
            "Web content genuinely does need to be readable by others in many setups, which is why this one is 644 rather than 640. Writable is the part that must go.",
          successMessage:
            "644. Readable by the server and by anything that legitimately serves it, writable only by the account that owns it.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 3
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "cs-l19-reducing-surface",
    moduleId: "cs-w5-hardening",
    sectionId: SECTION_ID,
    order: 3,
    title: "Reducing the Surface",
    subtitle: "Patching, services and the host firewall",
    estimatedMinutes: 12,
    intro:
      "Hardening is mostly subtraction. Turn off what nobody uses, update what remains, and refuse connections to everything that does not need to answer strangers. None of it is clever and all of it works.",

    atoms: [
      {
        id: "a-cs-w5-patching",
        title: "Patching, and why it is still the biggest win",
        explain:
          "The overwhelming majority of successful intrusions that are not phishing use a vulnerability that had a patch available. Often for months. Sometimes for years. The attacker is not finding anything new. They are scanning for machines that did not apply what was already published.",
        why: "It is unglamorous and it beats almost every product you could buy with the same money. It is also genuinely hard in practice, because patching means restarting things, restarting things means downtime, and the person who decides on downtime is not the person worried about the vulnerability.",
        mistake:
          "Treating unattended upgrades as the whole answer. They handle the operating system's own packages. The application you installed by downloading a tarball in 2022 is not in that list and nothing is watching it.",
      },
      {
        id: "a-cs-w5-find-services",
        title: "Practice: find out what is listening",
        explain:
          "Before you can turn anything off, you have to know what is on. The question is not which packages are installed. It is which processes are listening on a network port, because those are the ones a stranger can reach.",
        why: "Almost every server is running something nobody remembers enabling. A database bound to all interfaces, a management agent from a trial, a print service on a machine with no printer. Each one is an open door that nobody is maintaining.",
        terminalExercise: {
          prompt: "ada@web01:~$",
          intro:
            "Recorded from a real Ubuntu server. You are logged in as an ordinary user with sudo rights.",
          goal:
            "Find out which services on this machine are listening for network connections, and on which ports.",
          commands: {
            "ss -tlnp":
              "State   Recv-Q  Send-Q   Local Address:Port    Peer Address:Port  Process\nLISTEN  0       128            0.0.0.0:22           0.0.0.0:*          users:((\"sshd\",pid=812))\nLISTEN  0       511            0.0.0.0:80           0.0.0.0:*          users:((\"nginx\",pid=1044))\nLISTEN  0       151          127.0.0.1:3306         0.0.0.0:*          users:((\"mysqld\",pid=1190))\nLISTEN  0       128            0.0.0.0:5432         0.0.0.0:*          users:((\"postgres\",pid=1255))\nLISTEN  0       4096         127.0.0.53:53           0.0.0.0:*          users:((\"systemd-resolve\"))",
            "systemctl list-units --type=service --state=running":
              "UNIT                    LOAD   ACTIVE SUB     DESCRIPTION\ncron.service            loaded active running Regular background processing\nnginx.service           loaded active running A high performance web server\nmysql.service           loaded active running MySQL Community Server\npostgresql.service      loaded active running PostgreSQL RDBMS\nssh.service             loaded active running OpenBSD Secure Shell server\ncups.service            loaded active running CUPS Scheduler",
            "ps aux":
              "USER   PID  COMMAND\nroot   812  /usr/sbin/sshd -D\nwww-data 1044 nginx: worker process\nmysql  1190 /usr/sbin/mysqld\npostgres 1255 /usr/lib/postgresql/14/bin/postgres",
            "sudo ufw status":
              "Status: inactive",
            "ls -l /etc/nginx":
              "total 40\ndrwxr-xr-x 2 root root 4096 Sep  1 11:20 conf.d\n-rw-r--r-- 1 root root 1482 Sep  1 11:20 nginx.conf\ndrwxr-xr-x 2 root root 4096 Sep  1 11:20 sites-enabled",
          },
          available: [
            "ss -tlnp",
            "systemctl list-units --type=service --state=running",
            "ps aux",
            "sudo ufw status",
            "ls -l /etc/nginx",
          ],
          accept: ["ss -tlnp"],
          near: [
            {
              command: "systemctl list-units --type=service --state=running",
              why: "That lists running services, which is close and not the same thing. A service can run without listening on a port, and the question was specifically about what is reachable over the network.",
            },
            {
              command: "ps aux",
              why: "That lists processes. It does not tell you which of them have a socket open, which is the part that decides what a stranger can reach.",
            },
          ],
          hint: "One command, three flags: TCP, listening, numeric, and show the process. The modern replacement for netstat.",
          success:
            "Look carefully at the Local Address column. MySQL is on 127.0.0.1, so only this machine can reach it. PostgreSQL is on 0.0.0.0, which means every interface, which means the network. That difference is the entire finding, and CUPS is running on a server with no printer.",
        },
      },
      {
        id: "a-cs-w5-bind-address",
        title: "0.0.0.0 versus 127.0.0.1",
        explain:
          "A service bound to 127.0.0.1 can only be reached from the machine itself. A service bound to 0.0.0.0 is listening on every network interface the machine has. It is one line in a configuration file and it is the difference between a private service and an exposed one.",
        why: "This single setting causes an enormous share of real exposure. Databases ship bound to localhost for good reason, and they get changed to 0.0.0.0 during a debugging session that nobody reverted.",
        table: {
          caption: "The same database, two bind addresses.",
          headers: ["Bound to", "Reachable from", "Appropriate when"],
          rows: [
            ["127.0.0.1", "This machine only", "The application is on the same machine"],
            ["10.0.1.5", "The internal network only", "The application is on another internal machine"],
            ["0.0.0.0", "Every interface, including any public one", "Almost never for a database"],
          ],
        },
        mistake:
          "Assuming a firewall makes the bind address irrelevant. Defence in depth means both. Firewall rules get changed by someone who does not know what they were for, and a service that was never listening publicly does not care.",
      },
      {
        id: "a-cs-w5-ssh-hardening",
        title: "Hardening SSH, which is where they knock",
        explain:
          "Port 22 on any internet-facing machine receives password guessing attempts continuously, from the moment it appears. Four settings remove almost all of it: disable password authentication entirely, use keys, disable direct root login, and limit which accounts may connect at all.",
        why: "Key authentication is not just stronger, it is a different category. There is no password to guess, so the automated guessing that fills every server's auth log stops working completely rather than becoming harder.",
        table: {
          caption: "Four lines in /etc/ssh/sshd_config, and what each one removes.",
          headers: ["Setting", "Value", "Removes"],
          rows: [
            ["PermitRootLogin", "no", "Direct root access, and the audit trail problem with it"],
            ["PasswordAuthentication", "no", "Every password-guessing attack at once"],
            ["PubkeyAuthentication", "yes", "(enables the replacement)"],
            ["AllowUsers", "ada deploy", "Every account you forgot was on the machine"],
          ],
          note: "Set up and test your key before disabling password authentication, on a second session you leave open. Locking yourself out of a remote server is a rite of passage and an avoidable one.",
        },
        mistake:
          "Moving SSH to a high port and calling it hardened. It reduces log noise from indiscriminate scanning and stops nobody who scans all ports, which is anybody actually targeting you. It is tidying, not security.",
      },
      {
        id: "a-cs-w5-host-firewall",
        title: "Practice: the host firewall",
        explain:
          "The host firewall is the last line, running on the machine itself, and it applies regardless of what the network team did. Here is a small policy with a problem in it. The rules are all sensible; the order is not.",
        why: "This is the mistake everybody makes once. Each rule reads correctly on its own, and the firewall evaluates top to bottom and stops at the first match, so a broad rule above a specific one silently cancels it.",
        firewallExercise: {
          brief:
            "This server hosts a public website and is administered over SSH from the admin subnet 10.0.9.0/24 only. Reorder the rules so the website is reachable by anyone, SSH works from the admin subnet, and SSH from anywhere else is blocked.",
          rules: [
            {
              id: "deny-ssh-all",
              action: "deny",
              proto: "tcp",
              source: "any",
              dest: "any",
              port: 22,
            },
            {
              id: "allow-ssh-admin",
              action: "allow",
              proto: "tcp",
              source: "10.0.9.0/24",
              dest: "any",
              port: 22,
            },
            {
              id: "allow-web",
              action: "allow",
              proto: "tcp",
              source: "any",
              dest: "any",
              port: 443,
            },
          ],
          traffic: [
            {
              id: "t1",
              label: "Admin laptop, SSH",
              proto: "tcp",
              source: "10.0.9.14",
              dest: "10.0.1.5",
              port: 22,
              expect: "allow",
            },
            {
              id: "t2",
              label: "Unknown host on the internet, SSH",
              proto: "tcp",
              source: "41.203.7.88",
              dest: "10.0.1.5",
              port: 22,
              expect: "deny",
            },
            {
              id: "t3",
              label: "A visitor loading the website",
              proto: "tcp",
              source: "102.89.4.31",
              dest: "10.0.1.5",
              port: 443,
              expect: "allow",
            },
            {
              id: "t4",
              label: "Someone probing the database port",
              proto: "tcp",
              source: "41.203.7.88",
              dest: "10.0.1.5",
              port: 3306,
              expect: "deny",
            },
          ],
          expect: true,
          successMessage:
            "The specific allow now sits above the broad deny, so the admin subnet is matched before the catch-all reaches it. Notice the database probe was blocked the whole time by the implicit final rule, without anybody writing a rule for it.",
        },
        mistake:
          "Writing the deny rules first because they feel like the important ones. In a first-match firewall the specific exceptions go above the general rules, always.",
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 4
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "cs-l20-logs-and-baselines",
    moduleId: "cs-w5-hardening",
    sectionId: SECTION_ID,
    order: 4,
    title: "Logs, Baselines and Windows",
    subtitle: "Knowing what normal looks like",
    estimatedMinutes: 11,
    intro:
      "A hardened machine that nobody watches is a machine that gets quietly un-hardened. This lesson covers reading the logs, measuring against a benchmark, and the Windows equivalents of everything you have just done.",

    atoms: [
      {
        id: "a-cs-w5-logs",
        title: "The logs that matter, and where they are",
        explain:
          "On a Linux server, most of what you need is in three places. Authentication events, the system journal, and whatever the application writes. On Windows it is the Event Log, split into Security, System and Application.",
        why: "You are looking for two things: something that should not have happened, and something that should have happened and did not. The second is harder and more important. Logs that stop arriving are a classic sign that somebody is tidying up after themselves.",
        table: {
          caption: "Where to look first.",
          headers: ["Question", "Linux", "Windows"],
          rows: [
            ["Who logged in, and who failed?", "/var/log/auth.log", "Security log, events 4624 and 4625"],
            ["Who became root?", "/var/log/auth.log, sudo lines", "Event 4672, special privileges assigned"],
            ["What did the system do?", "journalctl", "System log"],
            ["Was an account created?", "/var/log/auth.log", "Event 4720"],
            ["Was the log itself cleared?", "gaps, and journal rotation", "Event 1102, which is always worth an alert"],
          ],
        },
        mistake:
          "Keeping logs only on the machine that produced them. An attacker with root edits or deletes them, and the one record that would have told you what happened is the one in their control. Ship them somewhere the compromised host cannot reach, which is Week 11.",
      },
      {
        id: "a-cs-w5-baseline",
        title: "Baselines, and why a benchmark beats an opinion",
        explain:
          "A hardening benchmark is a published list of specific settings with specific values, such as the CIS Benchmarks. You measure the machine against it, get a score and a list of differences, apply what applies, and document what you deliberately did not.",
        why: "It turns hardening from a matter of taste into something measurable and repeatable. It also gives you the thing every auditor and every client actually asks for: evidence that you checked, and a reason for each exception.",
        example:
          "Before hardening:  62 of 214 checks passed\nAfter hardening:   189 of 214 checks passed\nExceptions:        25, each with a written reason\n\nThat last line is the professional part. \"We did not apply this\n because the application requires it, and here is the compensating\n control\" is a complete answer. Silence is not.",
        mistake:
          "Applying a benchmark wholesale on a production machine without testing. A significant fraction of hardening settings will break a specific application, and the outage will be blamed on security rather than on the process.",
      },
      {
        id: "a-cs-w5-windows",
        title: "The same ideas on Windows",
        explain:
          "The vocabulary differs and the principles do not. User Account Control is the prompt that stops an ordinary session silently acting as administrator. Group Policy pushes settings to every machine centrally. NTFS permissions are the equivalent of the mode bits, with more granularity and a worse interface.",
        why: "Most organisations you will work in run Windows on the desktop and Linux on the servers, so you will need both. The mapping is close enough that understanding one gets you most of the way into the other.",
        table: {
          caption: "The translation.",
          headers: ["Linux", "Windows", "Same idea"],
          rows: [
            ["sudo", "UAC elevation prompt", "Raise privilege for one action, on purpose"],
            ["chmod / chown", "NTFS permissions, icacls", "Who can read, write, execute"],
            ["Configuration files and Ansible", "Group Policy", "Push settings to many machines"],
            ["systemctl", "Services console", "Start, stop and disable services"],
            ["/var/log/auth.log", "Security event log", "Who logged in, and who failed"],
          ],
        },
        mistake:
          "Turning UAC off because the prompts are annoying. It is the only thing standing between a piece of software and administrator rights on a machine where the user is a local administrator, which most home Windows users are.",
      },
      {
        id: "a-cs-w5-endpoint",
        title: "Endpoint protection, honestly scoped",
        explain:
          "Signature-based antivirus recognises malware it has seen before. Behavioural detection watches for what malware does rather than what it is. Endpoint detection and response records activity so that an analyst can reconstruct an intrusion afterwards, which is a different job again.",
        why: "Knowing which one you have tells you what you are actually covered for. Attackers routinely test their tooling against the popular scanners before using it, so signature detection stops the commodity attacks and not the targeted ones.",
        decision: {
          scenario:
            "A director asks why the company needs endpoint detection and response when every machine already has antivirus.",
          question: "What is the accurate answer?",
          options: [
            {
              id: "a",
              text: "Antivirus is obsolete and should be replaced",
              whyWrong:
                "It is not obsolete and it stops a very large volume of commodity malware cheaply. Replacing rather than layering removes a working control, and defence in depth is the whole principle here.",
            },
            {
              id: "b",
              text: "Antivirus blocks what it recognises. Detection and response records what happened, so an attack it did not recognise can still be found and investigated afterwards",
              why: "They answer different questions. One is prevention against known threats, the other is visibility and reconstruction when prevention fails, which it will.",
            },
            {
              id: "c",
              text: "Detection and response catches more malware than antivirus does",
              whyWrong:
                "It is not primarily a better blocker, and selling it as one sets up a failure. Its value is the recorded timeline, which is what turns an unexplained alert into an investigation you can actually finish.",
            },
            {
              id: "d",
              text: "It is a compliance requirement",
              whyWrong:
                "Sometimes true and it is the weakest available argument. It invites the cheapest possible implementation, and a control bought to satisfy an auditor is rarely configured to satisfy an incident.",
            },
          ],
          correct: "b",
          aftermath:
            "In Week 12 you will work an incident using exactly this kind of recorded timeline, and the difference between having one and not having one will be obvious.",
        },
      },
      {
        id: "a-cs-w5-drift",
        title: "Hardening decays",
        explain:
          "A machine hardened in January is not hardened in June. Software gets installed, a port gets opened for a project, a permission gets loosened during an outage, and nobody writes any of it down. This is configuration drift and it is inevitable rather than a sign of carelessness.",
        why: "It changes hardening from a task into a process. The benchmark scan has to run on a schedule, and somebody has to look at the difference. A single hardening exercise with no re-measurement is a snapshot of a machine that no longer exists.",
        practice: {
          prompt:
            "You hardened a server and scored 189 of 214. Three months later it scores 171 and nobody recalls changing anything. What is the most likely explanation?",
          answer:
            "Ordinary drift. Package updates reintroduce default configuration files, a deployment enabled something, somebody widened a permission during an incident at 2am and it stayed. None of it is suspicious on its own, which is exactly why it has to be measured rather than remembered.",
        },
      },
    ],

    task: {
      title: "This week's lab",
      intro: "Harden a real machine and prove it with numbers.",
      prompts: [
        "Take a fresh Ubuntu VM and run a CIS-style benchmark script against it. Record the score before you change anything.",
        "Run `ss -tlnp` and write down every listening service. For each one, decide whether it needs to listen at all, and whether it should be on 127.0.0.1 instead of 0.0.0.0.",
        "Disable everything you decided was unnecessary, and rebind everything that should be local only. Record what you changed and why.",
        "Enable ufw. Allow SSH from your host machine's address only, allow nothing else inbound, and confirm with a scan from the other VM that only the intended port answers.",
        "Find every world-writable file outside /tmp with `find / -xdev -type f -perm -0002 2>/dev/null` and fix each one, recording its original mode.",
        "Re-run the benchmark. Write a hardening report with the before and after scores, every change and its rationale, and a list of every check you deliberately did not apply with a reason for each.",
      ],
      closing:
        "The exceptions list is the part that separates a professional report from a screenshot of a scan. Anybody can apply a benchmark. Explaining what you did not apply, and why, is the judgement being assessed.",
    },

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
