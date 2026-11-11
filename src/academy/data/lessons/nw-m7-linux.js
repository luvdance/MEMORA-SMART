/**
 * COMPUTER NETWORKING · MODULE 7 · LINUX AND NETWORK ADMINISTRATION
 *
 * Curriculum 7.1 – 7.24 and the practical. Linux and its distributions,
 * installing Ubuntu, the shell and filesystem, users, permissions,
 * packages, services and logs; network interfaces, addresses, DNS and
 * routes; network services, SSH, firewalls and UFW; diagnostics, server
 * administration, access, documentation and backup.
 *
 * Every terminal is a RECORDED session from real Ubuntu 24.04 machines
 * (scripts/nwRecord.mjs), and every command an exercise accepts is taught in
 * the explain first. Earlier modules already taught ping -c, curl, ssh,
 * dig and ss on these machines.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

import { dec, term } from "./nw-kit.js";

export const SECTION_ID = "nw-s7-linux";
const M = "nw-m7-linux";

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 1 · 7.1 – 7.3
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "nw-lx1-intro",
    moduleId: M,
    sectionId: SECTION_ID,
    order: 1,
    covers: ["7.1", "7.2", "7.3"],
    title: "Linux, Distributions and Installing Ubuntu",
    subtitle: "Why networks run on Linux, which Linux to choose, and setting up your own",
    estimatedMinutes: 35,
    intro:
      "Most of the internet's servers, almost every network appliance and every major cloud run on Linux. A network engineer who cannot work at a Linux command line is cut off from half the job. This module puts you at one, from scratch.",

    atoms: [
      {
        id: "a-nw-linux-intro",
        title: "Introduction to Linux",
        explain:
          "LINUX is a free, open-source operating system kernel, started by Linus Torvalds in 1991, and combined with tools from the GNU project and others to make complete operating systems. It runs most web servers, nearly all cloud virtual machines, every Android phone, and inside many network devices: routers, firewalls, Wi-Fi access points and switches often run Linux underneath their own interface. Network engineers meet Linux constantly: on servers that provide DNS, DHCP, web, monitoring and logging; in network automation; in cloud and container platforms (Module 10); and in tools such as Wireshark, nmap and tcpdump. Linux is administered mainly through the COMMAND LINE, typed commands rather than menus, which is faster, works over a remote SSH connection, and can be scripted. Its security model is built on USERS and PERMISSIONS, with one all-powerful administrator account called root, which is why you will mostly work as an ordinary user and borrow administrator rights only when needed.",
        decision: dec(
          "A network team needs a DNS server, a monitoring server and a syslog server for 3,000 devices, all managed remotely over SSH and automated with scripts.",
          "Why is Linux the usual choice for these servers?",
          ["It is free, stable, runs the standard network service software, and is managed from a command line that works over SSH and can be scripted", "Remote command-line management and scripting are exactly what these servers need."],
          [
            ["Linux has no command line, so it is easier", "Linux is famous for its command line."],
            ["Only Linux can run DNS", "Windows Server runs DNS too; Linux is chosen for cost, stability and scripting."],
            ["Linux does not need any security", "Linux needs security like any system; its user model supports it."],
          ]
        ),
      },
      {
        id: "a-nw-distributions",
        title: "Linux distributions and their differences",
        explain:
          "A DISTRIBUTION ('distro') packages the Linux kernel with tools, a package manager, default settings and a release and support schedule. They fall into a few families. The DEBIAN family: DEBIAN itself (very stable) and UBUNTU (the most popular server and desktop Linux, by Canonical), using .deb packages and the apt package manager. Ubuntu's LTS (long-term support) releases, such as 24.04, are supported for five years or more, which is why servers use them. The RED HAT family: RHEL (Red Hat Enterprise Linux, paid, common in large enterprises), with free rebuilds such as ROCKY LINUX and ALMALINUX, and FEDORA as the fast-moving upstream; these use .rpm packages and the dnf package manager. Others: ALPINE (tiny, common inside containers), ARCH (rolling releases, for enthusiasts), and network-focused systems built on Linux such as Cumulus or SONiC on switches. The core commands (ls, cp, ip, ss, ssh) are the same everywhere; what differs is mainly package management, configuration file locations and support. This course uses Ubuntu 24.04 LTS.",
        table: {
          caption: "The distributions you will meet most.",
          headers: ["Distribution", "Family", "Package manager", "Typical use"],
          rows: [
            ["Ubuntu LTS", "Debian", "apt (.deb)", "Servers, cloud, desktops"],
            ["Debian", "Debian", "apt (.deb)", "Stable servers, appliances"],
            ["RHEL / Rocky / Alma", "Red Hat", "dnf (.rpm)", "Enterprise servers"],
            ["Fedora", "Red Hat", "dnf (.rpm)", "Desktops, newest features"],
            ["Alpine", "Independent", "apk", "Containers, tiny systems"],
          ],
        },
        decision: dec(
          "A company is choosing an operating system for a new web server that must run for five years with security updates and a large community of documentation.",
          "Which is the most suitable choice from these?",
          ["An Ubuntu LTS release (or a Red Hat family enterprise release), because LTS versions get years of security updates", "Long-term support is the key requirement for servers."],
          [
            ["Whatever Fedora release is newest", "Fedora releases are supported for only about 13 months."],
            ["Arch Linux, because it always has the newest software", "Rolling releases change constantly, which is risky for a long-lived server."],
            ["A distribution that stopped receiving updates years ago", "An unsupported OS stops getting security fixes."],
          ]
        ),
      },
      {
        id: "a-nw-install-ubuntu",
        title: "Installing Ubuntu Linux",
        explain:
          "You will install Ubuntu Server in a VIRTUAL MACHINE (VM): a complete computer simulated by software such as VirtualBox (free), VMware Workstation or Hyper-V, so your own system is untouched. Steps: 1. Download the Ubuntu Server 24.04 LTS ISO image from ubuntu.com and VirtualBox from virtualbox.org. 2. Create a VM: 2 CPUs, 2 to 4 GB of memory, a 25 GB virtual disk, and attach the ISO as its optical drive. 3. Choose the VM's NETWORK MODE, which matters for this course. NAT: the VM reaches the internet through your PC, but other machines cannot reach it. BRIDGED: the VM joins your real network like another computer, with its own address from your router. HOST-ONLY: the VM can talk only to your PC and other host-only VMs, on a private network, which is ideal for labs. INTERNAL: VMs talk only to each other. A common lab gives each VM two adapters: NAT for internet, and host-only for the lab network. 4. Boot the VM and follow the installer: language, keyboard, network (DHCP is fine at first), disk (use the entire virtual disk), your name, server name, user name and password, and tick 'Install OpenSSH server'. 5. Reboot, log in, and run sudo apt update and sudo apt upgrade (Lesson 3 explains them). Take a SNAPSHOT of the VM so you can roll back after experiments.",
        decision: dec(
          "For the practical, a learner wants two Ubuntu VMs that can reach each other and the learner's own PC on a private lab network, while also downloading updates from the internet.",
          "How should each VM's network adapters be set?",
          ["Two adapters on each VM: one NAT (for the internet) and one host-only (for the private lab network shared by the VMs and the PC)", "NAT gives outbound internet; host-only gives a private network the PC and both VMs share."],
          [
            ["NAT only", "With NAT alone, the VMs cannot reach each other or be reached from the PC."],
            ["Internal network only", "Internal networks have no internet and do not include the PC."],
            ["No network adapter, to be safe", "Then nothing can talk to anything."],
          ]
        ),
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 2 · 7.4 – 7.6
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "nw-lx2-shell-files",
    moduleId: M,
    sectionId: SECTION_ID,
    order: 2,
    covers: ["7.4", "7.5", "7.6"],
    title: "The Terminal, the Filesystem and Files",
    subtitle: "Finding your way around, and creating, copying, moving and deleting files",
    estimatedMinutes: 45,
    intro:
      "You have typed single commands into the recorded terminal before. Now you will learn what the terminal and shell actually are, how Linux organises its files, and the commands to manage them.",

    atoms: [
      {
        id: "a-nw-terminal-shell",
        title: "The Linux terminal and shell",
        explain:
          "The TERMINAL is the window you type into; the SHELL is the program that reads your commands, runs them and shows their output. Ubuntu's default shell is BASH. The PROMPT tells you three things before you type: learner@ubuntu-lab:~$ means you are the user learner, on the computer named ubuntu-lab, in the folder ~ (short for your HOME folder, /home/learner); the $ means an ordinary user, while # means root, the administrator. A command is a program name followed by OPTIONS (usually starting with a dash, like -l) and ARGUMENTS (what to act on): in ls -l /etc, ls is the program, -l is an option and /etc is the argument. Your first commands: whoami prints your user name; hostname prints the computer's name; pwd (print working directory) shows which folder you are in; ls lists the files in a folder (ls / lists the top of the filesystem); cat followed by a file name prints the file, and cat /etc/os-release shows which Linux this is. Press Tab to complete names, the Up arrow to recall commands, and Ctrl+C to stop a running command. Every command has a manual: man followed by the command's name.",
        terminalExercise: term("m7-first", {
          goal: "You have just logged in to a machine. Find out the name of the computer you are on.",
          accept: ["hostname"],
          near: [
            { command: "whoami", why: "That tells you which USER you are (learner). The goal asks for the computer's name." },
            { command: "pwd", why: "That shows the folder you are in. The goal asks for the computer's name." },
          ],
          hint: "The command is named after what it prints: the host's name.",
          success: "ubuntu-lab, which is also what the prompt shows between @ and :. Now run cat /etc/os-release to see the distribution and version.",
        }),
      },
      {
        id: "a-nw-filesystem",
        title: "Filesystem structure",
        explain:
          "Linux has ONE tree of folders (directories) starting at the ROOT, written / (no drive letters like C:). A PATH names a location: an ABSOLUTE path starts at / (/etc/hosts); a RELATIVE path starts from where you are (notes/routers.txt means the notes folder inside the current folder). The standard top-level directories, the same on every distribution: /etc holds system CONFIGURATION files, including the network ones (/etc/hosts, /etc/resolv.conf, /etc/netplan, /etc/ssh); /var holds changing data, and /var/log the LOG FILES; /home holds each user's personal folder; /root is the administrator's home; /usr/bin and /bin hold the programs (commands); /tmp holds temporary files, emptied on reboot; /dev represents devices (disks are /dev/sda and similar); /proc and /sys are virtual views into the running kernel; /opt and /srv hold optional software and served data. Everything is a FILE, even devices and kernel settings, which is why so much administration is just reading and editing text files. ls followed by a directory lists it: ls / shows the top level, as in the recording below.",
        terminal: term("m7-first", { goal: "Try ls / to see the top of the filesystem, then cat /etc/os-release." }),
        decision: dec(
          "An administrator needs to change a server's SSH settings and then read the log of recent logins.",
          "Where should they look for each?",
          ["SSH settings are configuration, under /etc (/etc/ssh); logs are under /var/log", "/etc is for configuration and /var/log for logs, on every distribution."],
          [
            ["Both are in /home", "/home holds users' personal files."],
            ["Settings in /tmp, logs in /bin", "/tmp is temporary; /bin holds programs."],
            ["Both are in /dev", "/dev represents devices."],
          ]
        ),
      },
      {
        id: "a-nw-file-management",
        title: "File and directory management",
        explain:
          "The everyday file commands. mkdir followed by a name makes a directory: mkdir notes. echo followed by text prints it, and > sends output into a file instead of the screen, creating or OVERWRITING it: echo 'R1 gateway 192.168.56.1' > notes/routers.txt (>> appends instead). cat followed by a file prints it. cp followed by a source and a destination COPIES a file: cp notes/routers.txt notes/routers.bak. mv followed by a source and a destination MOVES or RENAMES it: mv notes/routers.bak notes/old-routers.txt. rm followed by a file DELETES it, permanently: there is no recycle bin. ls -l lists files in LONG format, with permissions, owner, size and date. Directories need extra options: cp -r and rm -r work recursively on a whole directory (and rm -r is the command to type most carefully on any system). To edit a file, use an editor in the terminal: nano is the easiest (Ctrl+O to save, Ctrl+X to exit). The commands in the recording below run in order: each one sees what the previous ones did.",
        terminalExercise: term("m7-files", {
          goal: "Before editing the router list, make a backup copy of notes/routers.txt called notes/routers.bak.",
          accept: ["cp notes/routers.txt notes/routers.bak"],
          near: [
            { command: "mv notes/routers.bak notes/old-routers.txt", why: "mv moves or renames a file; the original is gone from its old name. A backup needs a copy, which leaves the original in place." },
            { command: "cat notes/routers.txt", why: "That prints the file, which is a good check, but it does not make a backup." },
          ],
          hint: "cp, then the source file, then the new copy's name.",
          success: "Now ls -l notes shows both files, the same size. A copy before every edit is a habit that saves careers.",
        }),
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 3 · 7.7 – 7.9
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "nw-lx3-users-perms-packages",
    moduleId: M,
    sectionId: SECTION_ID,
    order: 3,
    covers: ["7.7", "7.8", "7.9"],
    title: "Users, Permissions and Packages",
    subtitle: "Who may do what, and how software is installed",
    estimatedMinutes: 50,
    intro:
      "A server is shared by people and programs, each of which should be able to do exactly what it needs and nothing more. This lesson covers the accounts, the permissions that enforce that, and how to install software safely.",

    atoms: [
      {
        id: "a-nw-users-groups",
        title: "Users and groups",
        explain:
          "Every person and many programs on Linux have a USER account, with a number (UID), a home directory and a login shell, listed in /etc/passwd (passwords themselves are kept, hashed, in /etc/shadow, readable only by root). Users belong to GROUPS, which make it easy to give several people the same access. ROOT (UID 0) can do anything, so administrators do not log in as root; they run single commands with administrator rights by putting sudo in front ('superuser do'), which asks for THEIR OWN password and is logged. Members of the sudo group may use sudo. Commands: id shows your user and groups; groups shows group names; sudo useradd followed by options and a name creates a user, where -m creates the home directory and -s /bin/bash sets the shell: sudo useradd -m -s /bin/bash netops; sudo passwd followed by a name sets the user's password; sudo usermod -aG followed by a group and a user adds the user to that group (-a appends, so they keep their other groups): sudo usermod -aG sudo netops. (Ubuntu also has the friendlier adduser, which asks questions.)",
        terminalExercise: term("m7-users", {
          goal: "Create an account for a new network operator called netops, with a home directory and bash as its shell.",
          accept: ["sudo useradd -m -s /bin/bash netops"],
          near: [
            { command: "sudo usermod -aG sudo netops", why: "That gives an existing netops account administrator rights. The account must be created first." },
            { command: "id netops", why: "That shows netops's user and groups, a good check afterwards. First, create the account." },
          ],
          hint: "sudo, useradd, -m for the home directory, -s /bin/bash for the shell, then the name.",
          success: "id netops now shows the new account. Notice it is in only its own group until usermod adds it to sudo.",
        }),
      },
      {
        id: "a-nw-file-permissions",
        title: "File permissions",
        explain:
          "Every file has an OWNER (a user), a GROUP, and three sets of PERMISSIONS: for the owner, for the group, and for everyone else (OTHER). Each set has three bits: READ (r: see the contents), WRITE (w: change it) and EXECUTE (x: run it as a program, or, for a directory, enter it). ls -l shows them as ten characters: -rw-r----- means a regular file (-), owner rw-, group r--, other ---. Each set is also written as one digit, adding r = 4, w = 2, x = 1: rw- = 6, r-- = 4, --- = 0, so -rw-r----- is 640. Common modes: 644 (owner edits, everyone reads: ordinary files), 600 (owner only: private keys and files containing passwords), 755 (programs and directories), 640 (owner edits, group reads, others nothing). chmod followed by a mode and a file changes it: chmod 600 router-backup.cfg. chown followed by user:group and a file changes the owner (it needs sudo). The principle is LEAST PRIVILEGE: give exactly the access needed and no more. A network device backup containing passwords that every account can read is a breach waiting to happen. Set the bits below.",
        permsExercise: {
          file: "router-backup.cfg",
          owner: "netops",
          group: "netops",
          start: "644",
          requirement:
            "This file is a backup of a router's configuration, including its passwords. The netops user must be able to read and update it. Nobody else on the server, not the group and not other users, may read it at all.",
          expect: "600",
          context:
            "644 is what a new file usually gets: readable by everyone. Read the sentence under the grid before you change anything.",
          successMessage:
            "600: rw for the owner, nothing for anyone else. Private keys, password files and device backups all get exactly this mode.",
        },
      },
      {
        id: "a-nw-package-management",
        title: "Package management",
        explain:
          "Software on Linux is installed as PACKAGES from trusted REPOSITORIES (online software archives run by the distribution), by a PACKAGE MANAGER that handles downloading, verifying signatures, installing dependencies and updating. On Ubuntu and Debian it is APT. sudo apt update refreshes the list of available packages and versions (it installs nothing). sudo apt upgrade installs available updates for everything installed; run both regularly, because most updates are security fixes. sudo apt install followed by a package name installs it, and -y answers 'yes' to the confirmation: sudo apt install -y iperf3. sudo apt remove followed by a name removes it. apt search followed by a word finds packages. Underneath, dpkg manages the installed packages: dpkg -l lists them (pipe it into grep, with |, to filter: dpkg -l | grep openssh), and dpkg -S followed by a file shows which package owns it. which followed by a command shows where its program file is. Install only from official repositories or vendors you trust: a package runs with full administrator rights during installation.",
        terminalExercise: term("m7-packages", {
          goal: "Install iperf3, a tool for measuring network throughput, from Ubuntu's repositories. (The package list has already been refreshed in this recording.)",
          accept: ["sudo apt install -y iperf3"],
          near: [
            { command: "sudo apt update", why: "That refreshes the list of available packages, which you should do first, but it installs nothing." },
            { command: "dpkg -l iperf3 | tail -1", why: "That checks iperf3 is installed and shows its version, a good check afterwards. Install it first." },
          ],
          hint: "sudo apt install, with -y to confirm, then the package name.",
          success: "APT downloaded iperf3 and its libraries, verified and installed them; dpkg -l iperf3 confirms it is installed. You will use iperf3 to measure throughput between two machines in Module 9.",
        }),
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 4 · 7.10 – 7.11
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "nw-lx4-processes-logs",
    moduleId: M,
    sectionId: SECTION_ID,
    order: 4,
    covers: ["7.10", "7.11"],
    title: "Processes, Services and Logs",
    subtitle: "What is running, how to control it, and where it writes down what happened",
    estimatedMinutes: 40,
    intro:
      "Network services such as web, DNS and SSH servers are programs that run in the background. You will check, stop and start one, and then read the logs that tell you who connected and what went wrong.",

    atoms: [
      {
        id: "a-nw-processes-services",
        title: "Processes and services",
        explain:
          "A PROCESS is a running program, with a number (PID). ps aux lists every process with its user, CPU and memory use; pgrep -a followed by a name finds processes by name and shows their command lines (pgrep -a nginx), and pgrep -l shows just their numbers and names; kill followed by a PID asks a process to stop. A SERVICE (or daemon) is a process that runs in the background, usually started at boot: nginx (web), sshd (SSH), dnsmasq or bind (DNS), and so on. On a modern Ubuntu server, services are managed by systemd with the systemctl command: sudo systemctl status nginx shows whether it is running and its latest log lines; systemctl stop, start and restart do what they say; systemctl enable and disable decide whether it starts at boot. The older service command does the same jobs and still works on Ubuntu, with the name first: service nginx status, service nginx stop, service nginx start. (The recorded lab machines are minimal systems without systemd, so the recording uses service; on your own Ubuntu VM, use systemctl.) In the recording you are logged in as root on the server srv01, so no sudo is needed.",
        terminalExercise: term("m7-services", {
          goal: "Users say the intranet website is down. Check whether the nginx web server service is running on srv01.",
          accept: ["service nginx status"],
          near: [
            { command: "service nginx start", why: "That starts nginx. Check its status first, so you know what you are fixing and can confirm the start worked." },
            { command: "pgrep -a nginx", why: "That lists nginx processes, which shows it is running, but the goal is the service's status from the service manager." },
          ],
          hint: "service, then the service's name, then status.",
          success: "'nginx is running'. Read on in the recording: after service nginx stop, pgrep -l nginx finds no nginx process at all, and service nginx start brings it back. On systemd systems, systemctl status nginx shows the same and more.",
        }),
      },
      {
        id: "a-nw-system-logs",
        title: "System logs",
        explain:
          "Linux and its services record what happens in LOGS, mostly under /var/log: /var/log/syslog for general system messages; /var/log/auth.log for logins, sudo use and SSH connections, including failures; and each service's own logs, such as /var/log/nginx/access.log (every web request) and /var/log/nginx/error.log. On systemd systems, journalctl reads the central journal: journalctl -u ssh shows the SSH service's messages and journalctl -f follows new messages live. Three commands do most log work. tail -n followed by a number and a file shows the last lines: tail -n 3 /var/log/nginx/access.log. grep followed by text (in quotes if it has spaces) and a file shows only the lines containing it: grep ' 404 ' /var/log/nginx/access.log finds requests for missing pages. And tail -f follows a file as it grows. In an investigation, logs answer who, what and when, which is why their clocks must be right (NTP, Module 4). Logs of failed logins for names that do not exist are a classic sign of someone trying to guess their way in.",
        terminalExercise: term("m7-logs", {
          goal: "Someone may be trying to guess SSH logins on srv01. Search the authentication log for login attempts for user names that do not exist on the server.",
          accept: ["grep 'Invalid user' /var/log/auth.log"],
          near: [
            { command: "tail -n 3 /var/log/nginx/access.log", why: "That is the web server's log. SSH logins are recorded in the authentication log, /var/log/auth.log." },
            { command: "grep ' 404 ' /var/log/nginx/access.log", why: "That finds requests for missing web pages. The question is about SSH logins." },
          ],
          hint: "SSH writes 'Invalid user' for names that do not exist. grep for that, in quotes, in /var/log/auth.log.",
          success: "Two attempts, for intruder and test, from 192.168.56.10. In a real incident you would note the source, the times and how many attempts, and check whether any login succeeded.",
        }),
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 5 · 7.12 – 7.15
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "nw-lx5-network-config",
    moduleId: M,
    sectionId: SECTION_ID,
    order: 5,
    covers: ["7.12", "7.13", "7.14", "7.15"],
    title: "Configuring the Network on Linux",
    subtitle: "Interfaces, addresses, DNS and routes",
    estimatedMinutes: 55,
    intro:
      "Everything you configured on NetLab PCs with ipconfig, you will now do on a real Linux machine: see its interfaces, give it addresses, point it at DNS, and manage its routes.",

    atoms: [
      {
        id: "a-nw-linux-interfaces",
        title: "Linux network interfaces",
        explain:
          "Linux names each network interface. lo is the LOOPBACK (127.0.0.1, Module 3). Wired interfaces have predictable names based on their hardware location, such as enp0s3 or ens33 on physical and virtual machines, or eth0 in containers and older systems; Wi-Fi interfaces are like wlp2s0. The modern command for everything network-related is ip (from the iproute2 package; the old ifconfig is deprecated). ip addr (or ip a) shows every interface with its state, MAC address (link/ether) and IP addresses (inet for IPv4, inet6 for IPv6). ip -br addr shows a BRIEF one-line-per-interface summary, which is the quickest view. ip link shows the interfaces' link state and MAC addresses without the IP details. ip route shows the routing table (Lesson 5's last atom). An interface marked UP with LOWER_UP has a working link; state DOWN means it is disabled or unplugged.",
        terminalExercise: term("m7-interfaces", {
          goal: "Get a quick, one-line-per-interface summary of this machine's interfaces and their IP addresses.",
          accept: ["ip -br addr"],
          near: [
            { command: "ip addr", why: "That shows everything about every interface, which is correct but long. The goal asks for the brief one-line summary." },
            { command: "ip link", why: "That shows link state and MAC addresses but no IP addresses." },
          ],
          hint: "ip with the brief option -br, then addr.",
          success: "lo with 127.0.0.1/8, and eth0 UP with 192.168.56.10/24. Two lines tell you what ipconfig took a screen to say.",
        }),
      },
      {
        id: "a-nw-linux-ip-config",
        title: "Configuring IP addresses",
        explain:
          "There are two ways to set an address on Linux, and you must know which one you are using. TEMPORARY changes with the ip command take effect at once but are LOST AT REBOOT: sudo ip addr add followed by address/prefix, dev and the interface adds an address (sudo ip addr add 192.168.56.50/24 dev eth0), and sudo ip addr del with the same arguments removes it. They are perfect for testing. PERMANENT configuration on Ubuntu Server is written in NETPLAN files: YAML text files in /etc/netplan/ (YAML uses indentation with spaces, never tabs, to show structure). A static configuration names the interface and sets dhcp4: false, the addresses (with prefix), the default route ('to: default via' the gateway) and the DNS nameservers. After editing, sudo netplan try applies it and rolls back automatically if you lose contact (essential when you are connected over SSH), and sudo netplan apply makes it stick. Desktop Ubuntu uses NetworkManager instead (nmcli or the settings app), and other distributions have their own files, but the ip command works everywhere. The recording shows a netplan file and then a temporary address.",
        terminalExercise: term("m7-ip-config", {
          goal: "Read the permanent configuration first, then TEMPORARILY add a second address, 192.168.56.50/24, to eth0 for a test.",
          accept: ["sudo ip addr add 192.168.56.50/24 dev eth0"],
          near: [
            { command: "cat /etc/netplan/01-netcfg.yaml", why: "That shows the permanent netplan configuration, the right thing to read first. Now add the temporary address with ip." },
            { command: "sudo ip addr del 192.168.56.50/24 dev eth0", why: "That removes the test address. Add it first." },
          ],
          hint: "sudo ip addr add, then 192.168.56.50/24, then dev eth0.",
          success: "ip -br addr now shows both addresses on eth0. The netplan file still lists only .10, so a reboot would remove .50: exactly what you want for a test.",
        }),
      },
      {
        id: "a-nw-linux-dns",
        title: "Configuring DNS",
        explain:
          "A Linux machine resolves names in this order, set in /etc/nsswitch.conf: first the local file /etc/hosts (a simple list of addresses and names, useful for a few fixed entries or testing), then DNS. The DNS servers it uses are listed in /etc/resolv.conf, as nameserver lines, with a search line naming domains to try for short names (with search lab, the short name intranet becomes intranet.lab). On Ubuntu desktops and servers, resolv.conf is usually managed by systemd-resolved, which points it at a local stub (127.0.0.53); resolvectl status then shows the real upstream servers, and you change them in netplan (nameservers) rather than by editing resolv.conf, which would be overwritten. getent hosts followed by a name resolves it exactly as applications do (hosts file and DNS), while dig asks DNS only, which helps tell a hosts-file problem from a DNS problem. cat followed by the file name shows either file.",
        terminalExercise: term("m7-dns", {
          goal: "A colleague asks which DNS server this machine sends its lookups to. Find out from the configuration file.",
          accept: ["cat /etc/resolv.conf"],
          near: [
            { command: "cat /etc/hosts", why: "That is the local hosts file, checked before DNS. The DNS servers are listed in /etc/resolv.conf." },
            { command: "getent hosts intranet.lab", why: "That resolves a name the way applications do, but does not say which server was asked." },
          ],
          hint: "The file is /etc/resolv.conf. Print it with cat.",
          success: "nameserver 192.168.56.20 (srv01) and search lab. On a machine using systemd-resolved you would see 127.0.0.53 here and use resolvectl status to find the real servers.",
        }),
      },
      {
        id: "a-nw-linux-routes",
        title: "Managing network routes",
        explain:
          "Linux hosts have a routing table too, exactly like a router's (Module 5). ip route shows it: a line 'default via 192.168.56.1 dev eth0' is the default gateway; a line '192.168.56.0/24 dev eth0 proto kernel scope link src 192.168.56.10' is the connected network. Add a route TEMPORARILY with sudo ip route add followed by the network, via, and the next hop: sudo ip route add 10.20.0.0/16 via 192.168.56.20. Remove it with sudo ip route del followed by the network. ip route get followed by an address asks the kernel which route it would use for that destination, the best way to check longest-prefix matching on a real machine: ip route get 10.20.5.9. Permanent routes go in netplan, under the interface's routes: list (to: and via:). Servers need extra routes when, for example, a management network or a VPN is reached through a different router than the default gateway.",
        terminalExercise: term("m7-routes", {
          goal: "The lab's 10.20.0.0/16 network is reached through srv01 (192.168.56.20), not through the default gateway. Add a temporary route for it.",
          accept: ["sudo ip route add 10.20.0.0/16 via 192.168.56.20"],
          near: [
            { command: "ip route get 10.20.5.9", why: "That shows which route the kernel would use for an address in the network, a good check once the route exists. Add the route first." },
            { command: "ip route", why: "That shows the routing table. Now add the route with sudo ip route add." },
          ],
          hint: "sudo ip route add, the network 10.20.0.0/16, then via and the next hop.",
          success: "ip route now lists 10.20.0.0/16 via 192.168.56.20, and ip route get 10.20.5.9 confirms the kernel picks it over the default route: longest prefix match, on Linux.",
        }),
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 6 · 7.16 – 7.19
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "nw-lx6-services-ssh-firewall",
    moduleId: M,
    sectionId: SECTION_ID,
    order: 6,
    covers: ["7.16", "7.17", "7.18", "7.19"],
    title: "Network Services, SSH Servers and Firewalls",
    subtitle: "What a server exposes, hardening SSH, and filtering traffic with UFW",
    estimatedMinutes: 55,
    intro:
      "A server's attack surface is whatever it listens on. You will list the services a server exposes, harden the SSH server you log in through, and put a firewall in front of everything else.",

    atoms: [
      {
        id: "a-nw-linux-net-services",
        title: "Managing network services",
        explain:
          "Every NETWORK SERVICE is a process LISTENING on a port (Module 4). Managing them means knowing exactly what listens, on which ports and which addresses, and turning off anything not needed. ss -tulpn, run as root, lists every listening TCP and UDP socket with the program that owns it (you met it in Module 4). Read the Local Address column carefully: 0.0.0.0:80 (or [::]:80 for IPv6) means LISTENING ON EVERY interface, reachable from the network; 127.0.0.1:5432 means listening on loopback only, reachable only from the machine itself, which is how a database used only by a local application should be. To reduce the attack surface: stop and disable services you do not need (systemctl disable --now followed by the name), configure the ones you keep to listen only where necessary (each service's own configuration file in /etc), and filter the rest with a firewall (the next atoms). Then check again with ss. The recording is root on srv01, which runs a web server, an SSH server and a DNS server.",
        terminalExercise: term("m4-ss-server", {
          goal: "Audit srv01: list every listening TCP and UDP port, numerically, with the program that owns each.",
          accept: ["ss -tulpn"],
          near: [
            { command: "ss -tln", why: "That lists listening TCP ports but leaves out UDP (DNS uses UDP 53) and the owning programs." },
          ],
          hint: "ss with t (TCP), u (UDP), l (listening), p (process), n (numeric).",
          success: "nginx on 80, sshd on 22, and DNS on 53 over both TCP and UDP, all on 0.0.0.0, every interface. Each is a door the firewall must decide about.",
        }),
      },
      {
        id: "a-nw-sshd-config",
        title: "SSH server configuration",
        explain:
          "The SSH server (sshd, from the openssh-server package) is the door administrators use, so it is the first thing attackers try. Its configuration is /etc/ssh/sshd_config, plus any files in /etc/ssh/sshd_config.d/ (a good place for your own settings, so package updates do not overwrite them). The essential hardening: PermitRootLogin no (log in as yourself and use sudo); PasswordAuthentication no, so only KEY-based logins work (passwords can be guessed, keys effectively cannot), after your own key is installed; AllowUsers or AllowGroups to name exactly who may log in. To set up keys from your computer: ssh-keygen creates a key pair, and ssh-copy-id user@server installs your public key in that user's ~/.ssh/authorized_keys on the server. Before restarting sshd, ALWAYS test the configuration: sshd -t checks it and prints nothing if it is valid (so engineers often type sshd -t && echo config OK, where && runs the second command only if the first succeeded). A broken configuration plus a restart can lock you out of a remote server. Restart with systemctl restart ssh, keep your current session open, and test a NEW login before closing it.",
        terminalExercise: term("m7-sshd", {
          goal: "The hardening settings have been written. Before restarting the SSH server, test its configuration for errors and print config OK if it passes.",
          accept: ["sshd -t && echo config OK"],
          near: [
            { command: "cat /etc/ssh/sshd_config.d/10-hardening.conf", why: "That shows the hardening settings, which is worth reading first. Now test them before any restart." },
            { command: "ss -tlnp | grep sshd", why: "That confirms sshd is listening. The goal is to test the configuration file first." },
          ],
          hint: "sshd -t tests the configuration; add && echo config OK to print a message only when it passes.",
          success: "config OK: safe to restart. The settings forbid root logins and passwords and allow only the admin user, with keys.",
        }),
      },
      {
        id: "a-nw-firewall-fundamentals",
        title: "Firewall fundamentals",
        explain:
          "A FIREWALL decides which traffic is allowed, using RULES checked IN ORDER from the top: the FIRST rule that matches a packet decides its fate, and a packet that matches no rule meets the DEFAULT POLICY, which should be DENY for incoming traffic ('deny by default, allow by exception'). Each rule matches on direction, protocol (TCP or UDP), source address or network, destination, and port, and then allows or denies. Because the first match wins, ORDER is everything: a broad rule placed above a narrow one SHADOWS it, so the narrow rule never fires. Specific exceptions go ABOVE the general rules they make exceptions to. A HOST firewall runs on the server itself (on Linux, the kernel's netfilter, managed with nftables or iptables, or with the simpler UFW); a NETWORK firewall protects a whole network (Module 8). Servers should have both. In the exercise below the rules are right but in the wrong order: drag them (use the arrows) so each sample packet gets the result the brief requires.",
        firewallExercise: {
          brief:
            "srv01 hosts the company intranet over HTTP (TCP 80) for everyone, and is administered over SSH (TCP 22) only from the admin network 192.168.56.0/24. SSH from anywhere else must be blocked. Reorder the rules so every sample connection gets the right result.",
          rules: [
            { id: "deny-ssh-any", action: "deny", proto: "tcp", source: "any", dest: "any", port: 22 },
            { id: "allow-web", action: "allow", proto: "tcp", source: "any", dest: "any", port: 80 },
            { id: "allow-ssh-admin", action: "allow", proto: "tcp", source: "192.168.56.0/24", dest: "any", port: 22 },
          ],
          traffic: [
            { id: "t1", label: "Admin workstation 192.168.56.10, SSH", proto: "tcp", source: "192.168.56.10", dest: "192.168.56.20", port: 22, expect: "allow" },
            { id: "t2", label: "Laptop on guest Wi-Fi 172.16.9.40, SSH", proto: "tcp", source: "172.16.9.40", dest: "192.168.56.20", port: 22, expect: "deny" },
            { id: "t3", label: "Staff PC 10.10.4.20, intranet website", proto: "tcp", source: "10.10.4.20", dest: "192.168.56.20", port: 80, expect: "allow" },
            { id: "t4", label: "Staff PC 10.10.4.20, database port 5432", proto: "tcp", source: "10.10.4.20", dest: "192.168.56.20", port: 5432, expect: "deny" },
          ],
          expect: true,
          successMessage:
            "The admin exception sits above the general SSH deny, the website is open to all, and the database port falls through to the default deny. First match wins, so order is the policy.",
        },
      },
      {
        id: "a-nw-ufw",
        title: "UFW and basic firewall rules",
        explain:
          "UFW (Uncomplicated Firewall) is Ubuntu's friendly front end to the kernel firewall. Typical set-up, in this order: sudo ufw default deny incoming and sudo ufw default allow outgoing set the default policies. sudo ufw allow 22/tcp allows SSH (do this BEFORE enabling, or you lock yourself out of a remote server); you can also allow a named application profile such as sudo ufw allow OpenSSH. A more specific rule names a source: sudo ufw allow from 192.168.56.0/24 to any port 80 proto tcp allows the web server only from the lab network. sudo ufw enable turns the firewall on (and at every boot). sudo ufw status shows the rules; sudo ufw status numbered shows them with numbers, and sudo ufw delete followed by a number removes that rule (it asks you to confirm; adding --force, as in sudo ufw --force delete 2, skips the question, which scripts need). sudo ufw deny works like allow for explicit blocks. UFW adds each rule for both IPv4 and IPv6, which is why rules appear twice in the list. In the recording below, follow the commands in order.",
        terminalExercise: term("m7-ufw", {
          goal: "Before enabling the firewall on this machine, allow incoming SSH (TCP port 22), so remote administration keeps working.",
          accept: ["sudo ufw allow 22/tcp"],
          near: [
            { command: "sudo ufw enable", why: "Enabling the firewall before allowing SSH would cut off a remote administrator. Allow 22/tcp first." },
            { command: "sudo ufw default deny incoming", why: "That sets the default policy, the right first step. Now add the SSH exception." },
          ],
          hint: "sudo ufw allow, then the port and protocol written as 22/tcp.",
          success: "Rule added (for IPv4 and IPv6). Read on in the recording: enable, then status numbered shows each rule with a number, and delete removes one.",
        }),
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 7 · 7.20 – 7.22
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "nw-lx7-diagnostics-admin",
    moduleId: M,
    sectionId: SECTION_ID,
    order: 7,
    covers: ["7.20", "7.21", "7.22"],
    title: "Diagnostics, Server Administration and Access",
    subtitle: "The network toolkit on Linux, keeping a server healthy, and controlling who gets in",
    estimatedMinutes: 45,
    intro:
      "Three daily jobs of a network administrator on Linux: diagnosing connectivity, checking the server's own health, and making sure only the right people can log in.",

    atoms: [
      {
        id: "a-nw-linux-diagnostics",
        title: "Linux network diagnostic commands",
        explain:
          "The Linux network toolkit, most of which you have already used: ping -c followed by a count and a host tests reachability and latency (Module 2). traceroute -n followed by a host lists every router on the path, like tracert, with -n showing addresses instead of looking up names, which is faster and works when DNS is broken (tracepath is a similar tool that needs no administrator rights). dig +short followed by a name tests DNS (Module 4). curl -sI followed by a web address tests a web service and shows its headers (Module 4; s silences the progress meter). ss -tn shows connections (Module 4). ip neigh shows the ARP cache, the Linux equivalent of arp -a. And mtr combines ping and traceroute into a live, continuously updated view, if installed. Work up the layers as Module 2 taught: link and address (ip -br addr), the local network and gateway (ping, ip neigh), the path (traceroute), names (dig), then the application (curl).",
        terminalExercise: term("m7-diagnostics", {
          goal: "List every router hop between this machine and srv01, showing numeric addresses rather than names.",
          accept: ["traceroute -n srv01"],
          near: [
            { command: "ping -c 3 srv01", why: "That shows srv01 is reachable and how quickly, but not the hops along the path." },
            { command: "ip neigh", why: "That is the ARP cache: MAC addresses of neighbours on the local network." },
          ],
          hint: "traceroute, -n for numeric output, then the host.",
          success: "One hop: srv01 is on the same network as this machine, so there is no router between them. On a path across the internet you would see a line per router.",
        }),
      },
      {
        id: "a-nw-server-admin",
        title: "Basic server administration",
        explain:
          "Keeping a server healthy means watching a handful of numbers before they become outages. uptime shows how long the machine has been running and its LOAD AVERAGE over the last 1, 5 and 15 minutes (roughly how many processes want the CPU; compare it with the number of CPU cores, which nproc prints). df -h shows how full each FILESYSTEM is (-h for human-readable sizes); df -h / shows just the root filesystem. A full disk is one of the most common causes of failed services, because logs and databases cannot write. free -h shows memory use (look at the 'available' column, not 'free'). ps aux --sort=-%mem | head -5 lists the processes using the most memory (top or htop give a live view). Routine duties: apply updates (sudo apt update and sudo apt upgrade) on a schedule, check logs, check disk space, confirm backups ran, and keep the time synchronised. Monitoring systems (Module 9) automate the watching and send alerts.",
        terminalExercise: term("m7-admin", {
          goal: "A service on this server keeps failing to save files. Check how full the root filesystem is, in human-readable units.",
          accept: ["df -h /"],
          near: [
            { command: "free -h", why: "That is memory, not disk space. Files are saved to the filesystem." },
            { command: "uptime", why: "That shows how long the server has run and its load, not disk usage." },
          ],
          hint: "df, -h for human-readable sizes, then / for the root filesystem.",
          success: "Size, used, available and Use% for the root filesystem. A server at 100% here explains failed saves; anything over about 80% deserves attention before it gets there.",
        }),
      },
      {
        id: "a-nw-users-access",
        title: "Managing network users and access",
        explain:
          "Controlling who can log in to network servers rests on a few rules. One account per person, never shared accounts, so actions are traceable. LEAST PRIVILEGE: only administrators are in the sudo group, and accounts of people who leave are disabled the same day (sudo usermod -L followed by the name locks an account; sudo userdel removes it). Remote access only by SSH with KEYS, root logins refused, and passwords disabled (Lesson 6). Limit where SSH is reachable from with the firewall. In larger organisations, accounts come from a central DIRECTORY (Active Directory or LDAP, often with single sign-on) so that disabling one account removes access everywhere, and logins to network devices are checked by RADIUS or TACACS+ (Module 8). Test that your restrictions work, from the client's side: try what should fail. The ssh option -o BatchMode=yes tells ssh never to ask for a password, so a key-less login fails immediately with an error instead of waiting at a prompt, which is how scripts and checks test SSH: ssh -o BatchMode=yes admin@srv01 hostname either runs at once or fails at once. The recording shows the srv01 hardening from Lesson 6, tested from the workstation.",
        terminalExercise: term("m7-ssh-client", {
          goal: "Prove the hardened server refuses SSH logins as root: try to run hostname as root@srv01, without letting ssh wait for a password.",
          accept: ["ssh -o BatchMode=yes root@srv01 hostname"],
          near: [
            { command: "ssh admin@srv01 hostname", why: "That proves the permitted admin user CAN log in with a key. The goal is to prove root cannot." },
          ],
          hint: "ssh with -o BatchMode=yes, then root@srv01, then the command hostname.",
          success: "Permission denied (publickey): root is refused and passwords are not even offered. The admin user still gets in with a key, which is exactly the policy.",
        }),
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 8 · 7.23 – 7.24, 7.P
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "nw-lx8-docs-backup",
    moduleId: M,
    sectionId: SECTION_ID,
    order: 8,
    covers: ["7.23", "7.24", "7.P"],
    title: "Documentation, Backup and the Practical",
    subtitle: "Writing down what you built, and being able to rebuild it",
    estimatedMinutes: 45,
    intro:
      "A server nobody documented and nobody backed up is one disk failure from disaster. This lesson covers both habits, then the practical asks you to build your own two-server Linux lab.",

    atoms: [
      {
        id: "a-nw-config-documentation",
        title: "Network configuration documentation",
        explain:
          "Good documentation lets someone else (or you, in a year) understand and rebuild a system without guessing. For each server record: its name, role and owner; operating system and version; every interface with its addresses, masks, gateway, DNS servers and VLAN; the services it runs, their ports and who uses them; firewall rules and why each exists; who has access and how (SSH keys, groups); where its backups go and how to restore them; and a CHANGE LOG: what changed, when, by whom and why. Keep it where the team can find it (a wiki, a repository or a documentation tool such as NetBox for network data), keep it current as part of every change rather than 'later', and keep configuration files themselves in version control (Git) where possible, so every change is recorded automatically. Diagrams (Module 10) complement the text. Never store passwords in documentation; store them in a password manager and note where.",
        decision: dec(
          "A server administrator leaves the company. Nobody else knows which ports the server's firewall allows or why, the server's static route to the payment network was added by hand, and its configuration is not written down anywhere.",
          "What practice would have prevented this situation?",
          ["Documenting the server's configuration (interfaces, routes, firewall rules and their reasons, access) and keeping a change log as part of every change", "Knowledge that exists only in one head leaves with that head."],
          [
            ["Giving every employee the root password", "Shared root access destroys accountability and does not explain the configuration."],
            ["Rebooting the server monthly", "Rebooting documents nothing, and a hand-added route would be lost at reboot."],
            ["Disabling the firewall so nobody needs to know the rules", "That removes protection."],
          ]
        ),
      },
      {
        id: "a-nw-backup-recovery",
        title: "Basic network backup and recovery",
        explain:
          "Back up two kinds of thing: DATA (files, databases) and CONFIGURATION (everything in /etc that makes the server what it is, and the configurations of network devices, which tools like RANCID or Oxidized can collect automatically). Follow the 3-2-1 RULE: three copies, on two different media, one of them offsite (or in the cloud), and protect at least one from deletion or ransomware (an offline or immutable copy). On Linux, tar bundles files into one ARCHIVE: sudo tar czf followed by an archive name and the files or folders to include creates a compressed archive (c create, z compress with gzip, f file name): sudo tar czf /tmp/netconfig-backup.tar.gz /etc/hosts /etc/resolv.conf /etc/netplan. tar tzf followed by the archive lists what is inside WITHOUT extracting, which is how you verify a backup; tar xzf extracts it. rsync copies files efficiently to another machine. Most importantly, TEST RESTORES regularly: a backup you have never restored is a hope, not a backup. Write down the restore steps and the RECOVERY TIME the business can accept.",
        terminalExercise: term("m7-backup", {
          goal: "The network configuration has been archived. Verify the backup: list the files inside the archive without extracting it.",
          accept: ["tar tzf /tmp/netconfig-backup.tar.gz"],
          near: [
            { command: "ls -lh /tmp/netconfig-backup.tar.gz", why: "That shows the archive exists and its size, but not what is inside it." },
          ],
          hint: "tar with t (list), z (gzip) and f, then the archive's name.",
          success: "etc/hosts, etc/resolv.conf and the netplan file are all inside. tar removes the leading / so a restore cannot overwrite system files by accident unless you extract it from /.",
        }),
      },
    ],

    requirements: { read: true, video: false, assessment: true },

    task: {
      title: "Module 7 practical: your own Linux network lab",
      intro:
        "Build this in VirtualBox (or another hypervisor) on your own computer, following Lesson 1's set-up. Take a snapshot of each VM before you start changing network settings.",
      prompts: [
        "Install Ubuntu Server 24.04 LTS in a virtual machine, with OpenSSH server, and apply all updates.",
        "Configure a static IP address on the VM's host-only adapter with netplan, and confirm it survives a reboot.",
        "Create a second VM, give it a static address on the same host-only network, and ping between the two.",
        "Configure SSH: create a key pair, install it with ssh-copy-id, then disable password and root logins and confirm both are refused.",
        "Set up UFW on one VM to allow SSH from the other VM only and HTTP from anyone, deny everything else, and test each rule.",
        "Inspect the logs (/var/log/auth.log or journalctl) to find your own SSH logins and a deliberate failed one.",
        "Break DNS on purpose (point the VM at a wrong nameserver in netplan), diagnose it with dig, ping and getent, then fix it and write down how you found it.",
      ],
      closing:
        "You now run Linux servers and their firewalls. Module 8 widens the view to securing a whole network: segmentation, ACLs, VPNs and encryption, and how attacks work so you can defend against them.",
    },
  },
];
