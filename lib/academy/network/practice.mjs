/**
 * MODEL ANSWERS FOR THE NETWORKING COURSE'S SHARED PRACTICES — SERVER ONLY.
 *
 * The Computer Networking course reuses the cybersecurity course's packet
 * capture, terminal, firewall, permissions and log-hunt practices. Their
 * model answers are registered here and spread into lib/academy/cyber/
 * validate.mjs, which proves every one solvable and not pre-solved.
 */

/** Display filter and the packet number to select. */
export const NW_CAPTURE_SOLUTIONS = {
  /* Module 2 */
  "a-nw-meet-wireshark": { filter: "dns", selected: 3 },
  "a-nw-find-http": { filter: "http", selected: 8 },
  /* Module 4 */
  "a-nw-three-way-handshake": { filter: "tcp.flags.syn == 1", selected: 6 },
  /* Module 8 */
  "a-nw-packet-sniffing": { filter: "http", selected: 4 },
  /* Module 9 */
  "a-nw-analysing-captures": { filter: "tcp.flags.reset == 1", selected: 2 },
};

/** The command that answers each terminal exercise. */
export const NW_TERMINAL_EXPECTED = {
  /* Module 2 */
  "a-nw-throughput-latency": "ping -c 4 8.8.8.8",
  /* Module 4 */
  "a-nw-http": "curl -I http://intranet.lab/",
  "a-nw-ssh": "ssh admin@srv01 hostname",
  "a-nw-dns-records": "dig MX lab",
  "a-nw-ss-netstat": "ss -tn",
  /* Module 6 */
  "a-nw-reaching-websites": "dig +trace example.com",
  /* Module 7 */
  "a-nw-terminal-shell": "hostname",
  "a-nw-file-management": "cp notes/routers.txt notes/routers.bak",
  "a-nw-users-groups": "sudo useradd -m -s /bin/bash netops",
  "a-nw-package-management": "sudo apt install -y iperf3",
  "a-nw-processes-services": "service nginx status",
  "a-nw-system-logs": "grep 'Invalid user' /var/log/auth.log",
  "a-nw-linux-interfaces": "ip -br addr",
  "a-nw-linux-ip-config": "sudo ip addr add 192.168.56.50/24 dev eth0",
  "a-nw-linux-dns": "cat /etc/resolv.conf",
  "a-nw-linux-routes": "sudo ip route add 10.20.0.0/16 via 192.168.56.20",
  "a-nw-linux-net-services": "ss -tulpn",
  "a-nw-sshd-config": "sshd -t && echo config OK",
  "a-nw-ufw": "sudo ufw allow 22/tcp",
  "a-nw-linux-diagnostics": "traceroute -n srv01",
  "a-nw-server-admin": "df -h /",
  "a-nw-users-access": "ssh -o BatchMode=yes root@srv01 hostname",
  "a-nw-backup-recovery": "tar tzf /tmp/netconfig-backup.tar.gz",
  /* Module 8 */
  "a-nw-reconnaissance": "nmap -sn 192.168.56.0/24",
  /* Module 9 */
  "a-nw-ts-dns": "dig +short @192.168.56.20 intranet.lab",
  /* Module 10 */
  "a-nw-docker-networks": "docker network create --driver bridge --subnet 172.30.0.0/24 app-net",
  "a-nw-rest-apis": "curl -s http://intranet.lab/api/interfaces.json | python3 -m json.tool",
};

/** Rule ids in the order that satisfies each firewall brief. */
export const NW_FIREWALL_SOLUTIONS = {
  /* Module 7 */
  "a-nw-firewall-fundamentals": ["allow-ssh-admin", "deny-ssh-any", "allow-web"],
  /* Module 8 */
  "a-nw-segmentation": ["deny-guest-internal", "allow-guest-out", "allow-staff-servers"],
  /* Module 10 */
  "a-nw-security-groups-nacls": ["deny-attacker", "allow-https", "allow-ephemeral"],
};

/** The permission mode each requirement asks for. */
export const NW_PERMISSION_SOLUTIONS = {
  /* Module 7 */
  "a-nw-file-permissions": "600",
};

/** A detection rule that catches each attack inside the allowed noise. */
export const NW_HUNT_SOLUTIONS = {
  /* Module 8 */
  "a-nw-ids": {
    conditions: [{ field: "action", op: "equals", value: "deny" }],
    groupBy: "src",
    threshold: 5,
  },
  /* Module 9 */
  "a-nw-log-analysis": {
    conditions: [{ field: "message", op: "contains", value: "UPDOWN" }],
    groupBy: "interface",
    threshold: 4,
  },
};
