/**
 * RECORDING SESSIONS — the Computer Networking course's real terminals and
 * packet captures. scripts/nwRecord.mjs runs each one on fresh Ubuntu
 * machines (see that file for the lab) and writes the output to
 * src/academy/data/lessons/nw-transcripts.js.
 *
 *   id            the key a lesson reads: term(id) or cap(id) in nw-kit.js
 *   host          "lab" (ubuntu-lab, 192.168.56.10, default), "srv" (srv01,
 *                 192.168.56.20) or "docker" (the Docker CLI itself)
 *   user          defaults to learner on lab, admin on srv; "root" allowed
 *   setup         { lab?: script, srv?: script } run as root first, not shown
 *   background    [{ host?, user?, command }] started detached before the
 *                 commands, for things that must be running meanwhile
 *   commands      run in order (each in a fresh shell in the home folder);
 *                 each one's output is recorded
 *   capture       true: record a packet capture on the workstation instead
 *   captureFilter tshark capture filter
 *   pre / post    host commands before and after a "docker" session
 *
 * Nothing here touches anything outside the two lab machines, except the
 * Docker session (its own network and container, removed afterwards) and
 * public lookups of example.com and Google's public DNS.
 */

const HARDEN_SSH = String.raw`
cat > /etc/ssh/sshd_config.d/10-hardening.conf <<'EOF'
PermitRootLogin no
PasswordAuthentication no
PubkeyAuthentication yes
AllowUsers admin
EOF
pkill sshd; sleep 1; /usr/sbin/sshd -E /var/log/auth.log
`;

const NETPLAN = String.raw`
mkdir -p /etc/netplan
cat > /etc/netplan/01-netcfg.yaml <<'EOF'
network:
  version: 2
  ethernets:
    eth0:
      dhcp4: false
      addresses:
        - 192.168.56.10/24
      routes:
        - to: default
          via: 192.168.56.1
      nameservers:
        addresses: [192.168.56.20]
        search: [lab]
EOF
`;

const API = String.raw`
mkdir -p /var/www/html/api
cat > /var/www/html/api/interfaces.json <<'EOF'
{"device": "core-sw1", "interfaces": [
 {"name": "Gi1/0/1", "status": "up", "vlan": 10, "description": "Finance-PC-01"},
 {"name": "Gi1/0/2", "status": "up", "vlan": 20, "description": "HR-PC-01"},
 {"name": "Gi1/0/3", "status": "down", "vlan": 10, "description": "Finance-Printer"},
 {"name": "Gi1/0/24", "status": "up", "vlan": 1, "description": "Uplink-to-R1"}]}
EOF
`;

export const SESSIONS = [
  /* ── Module 2 ─────────────────────────────────────────────────────── */
  { id: "m2-ping-latency", commands: ["ping -c 4 srv01", "ping -c 4 8.8.8.8"] },
  { id: "m2-web-visit", capture: true, captureFilter: "ip", commands: ["curl -s http://intranet.lab/ -o /dev/null"] },

  /* ── Module 4 ─────────────────────────────────────────────────────── */
  {
    id: "m4-curl",
    commands: ["curl -I http://intranet.lab/", "curl -s http://intranet.lab/", "curl -I http://intranet.lab/missing.html"],
  },
  {
    id: "m4-ssh",
    commands: ["ssh admin@srv01 hostname", "ssh admin@srv01 whoami", "ssh admin@srv01 uptime"],
  },
  {
    id: "m4-dig",
    commands: ["dig intranet.lab", "dig +short intranet.lab", "dig MX lab", "dig www.lab", "dig TXT lab", "nslookup intranet.lab"],
  },
  {
    id: "m4-ss",
    background: [{ command: "ssh admin@srv01 sleep 600" }],
    commands: ["ss -tn", "netstat -tn", "ss -tln"],
  },
  { id: "m4-ss-server", host: "srv", user: "root", commands: ["ss -tulpn", "ss -tln"] },
  { id: "m4-udp-dns", capture: true, captureFilter: "udp port 53", commands: ["dig +short intranet.lab", "dig +short MX lab"] },

  /* ── Module 6 ─────────────────────────────────────────────────────── */
  {
    id: "m6-internet",
    commands: ["dig +short example.com", "dig +trace example.com", "curl -sI https://example.com"],
  },

  /* ── Module 7 ─────────────────────────────────────────────────────── */
  {
    id: "m7-first",
    commands: ["whoami", "hostname", "pwd", "ls", "ls /", "cat /etc/os-release"],
  },
  {
    id: "m7-files",
    commands: [
      "mkdir notes",
      "echo 'R1 gateway 192.168.56.1' > notes/routers.txt",
      "cat notes/routers.txt",
      "cp notes/routers.txt notes/routers.bak",
      "ls -l notes",
      "mv notes/routers.bak notes/old-routers.txt",
      "rm notes/old-routers.txt",
      "ls notes",
      "ls /etc | head -12",
    ],
  },
  {
    id: "m7-users",
    commands: ["id", "groups", "sudo useradd -m -s /bin/bash netops", "id netops", "sudo usermod -aG sudo netops", "groups netops", "grep netops /etc/passwd"],
  },
  {
    id: "m7-perms",
    commands: ["ls -l /etc/passwd /etc/shadow", "touch router-backup.cfg", "ls -l router-backup.cfg", "chmod 600 router-backup.cfg", "ls -la router-backup.cfg"],
  },
  {
    id: "m7-packages",
    commands: ["dpkg -l | grep -E 'openssh|nginx'", "which ping", "dpkg -S /usr/bin/ping", "sudo apt update", "sudo apt install -y iperf3", "dpkg -l iperf3 | tail -1"],
  },
  {
    id: "m7-services",
    host: "srv",
    user: "root",
    commands: ["service nginx status", "service nginx stop", "pgrep -l nginx", "service nginx start", "pgrep -a nginx", "ps aux | grep -E 'sshd|dnsmasq' | grep -v grep"],
  },
  {
    id: "m7-logs",
    host: "srv",
    user: "root",
    background: [
      { command: "curl -s http://intranet.lab/ >/dev/null; curl -s http://intranet.lab/admin >/dev/null; curl -s http://intranet.lab/ >/dev/null" },
      { command: "ssh -o BatchMode=yes intruder@srv01 true; ssh -o BatchMode=yes test@srv01 true" },
    ],
    commands: ["tail -n 3 /var/log/nginx/access.log", "grep ' 404 ' /var/log/nginx/access.log", "grep 'Invalid user' /var/log/auth.log"],
  },
  { id: "m7-interfaces", commands: ["ip addr", "ip -br addr", "ip link", "ip route"] },
  {
    id: "m7-ip-config",
    setup: { lab: NETPLAN },
    commands: ["cat /etc/netplan/01-netcfg.yaml", "sudo ip addr add 192.168.56.50/24 dev eth0", "ip -br addr", "sudo ip addr del 192.168.56.50/24 dev eth0", "ip -br addr show eth0"],
  },
  { id: "m7-dns", commands: ["cat /etc/resolv.conf", "cat /etc/hosts", "getent hosts intranet.lab", "dig +short files.lab"] },
  {
    id: "m7-routes",
    commands: ["ip route", "sudo ip route add 10.20.0.0/16 via 192.168.56.20", "ip route show", "ip route get 10.20.5.9", "sudo ip route del 10.20.0.0/16"],
  },
  { id: "m7-sshd", host: "srv", user: "root", setup: { srv: HARDEN_SSH }, commands: ["cat /etc/ssh/sshd_config.d/10-hardening.conf", "sshd -t && echo config OK", "ss -tlnp | grep sshd"] },
  { id: "m7-ssh-client", setup: { srv: HARDEN_SSH }, commands: ["ssh admin@srv01 hostname", "ssh -o BatchMode=yes root@srv01 hostname"] },
  {
    id: "m7-ufw",
    commands: [
      "sudo ufw status",
      "sudo ufw default deny incoming",
      "sudo ufw allow 22/tcp",
      "sudo ufw allow from 192.168.56.0/24 to any port 80 proto tcp",
      "sudo ufw enable",
      "sudo ufw status numbered",
      "sudo ufw --force delete 2",
      "sudo ufw status verbose",
    ],
  },
  {
    id: "m7-diagnostics",
    commands: ["ping -c 3 srv01", "traceroute -n srv01", "dig +short intranet.lab", "curl -sI http://intranet.lab/", "ip neigh"],
  },
  { id: "m7-admin", commands: ["uptime", "df -h /", "free -h", "nproc", "ps aux --sort=-%mem | head -5"] },
  {
    id: "m7-backup",
    setup: { lab: NETPLAN },
    commands: [
      "sudo tar czf /tmp/netconfig-backup.tar.gz /etc/hosts /etc/resolv.conf /etc/netplan",
      "ls -lh /tmp/netconfig-backup.tar.gz",
      "tar tzf /tmp/netconfig-backup.tar.gz",
    ],
  },

  /* ── Module 8 ─────────────────────────────────────────────────────── */
  {
    id: "m8-cleartext",
    capture: true,
    captureFilter: "tcp port 80",
    commands: ["curl -s -d 'username=ada&password=Lab-Only-2026' http://intranet.lab/login -o /dev/null"],
  },
  { id: "m8-nmap", commands: ["nmap -sn 192.168.56.0/24", "nmap 192.168.56.20", "nmap -sV -p 22,53,80 192.168.56.20"] },
  { id: "m8-tls", commands: ["curl -sv https://example.com -o /dev/null 2>&1 | grep -E 'SSL connection|subject:|issuer:|expire date:|start date:'"] },

  /* ── Module 9 ─────────────────────────────────────────────────────── */
  { id: "m9-closed-port", capture: true, captureFilter: "tcp port 8080", commands: ["curl -s --max-time 3 http://srv01:8080/"] },
  {
    id: "m9-dns-fault",
    commands: ["dig nosuchhost.lab", "dig +time=2 +tries=1 @192.168.56.99 intranet.lab", "dig +short @192.168.56.20 intranet.lab"],
  },
  {
    id: "m9-tcpdump",
    background: [{ command: "sleep 3; ping -c 6 -i 0.5 srv01 >/dev/null" }],
    commands: ["sudo timeout 10 tcpdump -n -i eth0 -c 6 icmp"],
  },

  /* ── Module 10 ────────────────────────────────────────────────────── */
  {
    id: "m10-docker",
    host: "docker",
    pre: ["docker rm -f web db >/dev/null", "docker network rm app-net >/dev/null"],
    commands: [
      "docker network create --driver bridge --subnet 172.30.0.0/24 app-net",
      "docker network ls --filter name=app-net",
      "docker run -d --name web --network app-net mst-netlab:1 sleep 600 | cut -c1-12",
      "docker run -d --name db --network app-net mst-netlab:1 sleep 600 | cut -c1-12",
      "docker exec web ip -br addr",
      "docker exec web ping -c 2 db",
      "docker network inspect app-net --format '{{range .Containers}}{{.Name}} {{.IPv4Address}}{{println}}{{end}}'",
    ],
    post: ["docker rm -f web db >/dev/null", "docker network rm app-net >/dev/null"],
  },
  {
    id: "m10-api",
    setup: { srv: API },
    commands: ["curl -s http://intranet.lab/api/interfaces.json", "curl -s http://intranet.lab/api/interfaces.json | python3 -m json.tool"],
  },
];
