/**
 * Records every Linux terminal and packet capture in the Computer Networking
 * course (NW-101) from real Ubuntu 24.04 machines.
 *
 *   node scripts/nwRecord.mjs              record every session
 *   node scripts/nwRecord.mjs m4-dig m7-ip  record only the sessions named
 *
 * The lab is two containers of the image built from
 * lib/academy/network/lab/Dockerfile on a private network, 192.168.56.0/24:
 *
 *   ubuntu-lab   192.168.56.10   the learner's workstation (user: learner)
 *   srv01        192.168.56.20   a server: nginx (80), OpenSSH (22) and
 *                                dnsmasq (53) answering for the .lab zone
 *
 * Every session starts from freshly created machines, runs its hidden setup
 * as root, then runs its commands IN ORDER as the learner, so a command sees
 * what the ones before it did. Output (stdout and stderr, as a terminal shows
 * them) goes to src/academy/data/lessons/nw-transcripts.js, which the lessons
 * read: nothing a lesson shows a command printing is typed by hand.
 *
 * A capture session runs tshark on the workstation while its commands run,
 * and stores the packet list in the shape PacketTrace reads.
 */
import { spawnSync } from "node:child_process";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { join } from "node:path";
import { SESSIONS } from "../lib/academy/network/sessions.mjs";

const ROOT = fileURLToPath(new URL("../", import.meta.url));
const OUT = join(ROOT, "src/academy/data/lessons/nw-transcripts.js");
const IMAGE = "mst-netlab:1";
const NET = "nwlab";
const only = process.argv.slice(2).filter((a, i, all) => !a.startsWith("--") && all[i - 1] !== "--from");

const docker = (args, opts = {}) =>
  spawnSync("docker", args, { encoding: "utf8", maxBuffer: 64 << 20, ...opts });

function must(args) {
  const r = docker(args);
  if (r.status !== 0) throw new Error(`docker ${args.join(" ")}\n${r.stderr}`);
  return r.stdout;
}

/* ── The lab ──────────────────────────────────────────────────────────── */

const SERVER_SETUP = String.raw`
set -e
echo "umask 022" >> /etc/profile
useradd -m -s /bin/bash admin && echo 'admin:Lab-Only-2026' | chpasswd
mkdir -p /run/sshd /home/admin/.ssh
cat > /etc/dnsmasq.d/lab.conf <<'EOF'
no-resolv
server=8.8.8.8
domain=lab
local=/lab/
address=/srv01.lab/192.168.56.20
address=/intranet.lab/192.168.56.20
address=/files.lab/192.168.56.20
host-record=ubuntu-lab.lab,192.168.56.10
cname=www.lab,intranet.lab
mx-host=lab,mail.lab,10
address=/mail.lab/192.168.56.25
txt-record=lab,"v=spf1 mx -all"
EOF
cat > /var/www/html/index.html <<'EOF'
<!doctype html>
<title>Intranet</title>
<h1>Welcome to the school intranet</h1>
EOF
dnsmasq -C /etc/dnsmasq.d/lab.conf
service nginx start >/dev/null
/usr/sbin/sshd -E /var/log/auth.log
`;

const WORKSTATION_SETUP = String.raw`
set -e
echo "umask 022" >> /etc/profile
useradd -m -s /bin/bash -G sudo learner
echo 'learner ALL=(ALL) NOPASSWD:ALL' > /etc/sudoers.d/learner
echo 'Defaults env_keep += "DEBIAN_FRONTEND"' >> /etc/sudoers.d/learner
printf 'nameserver 192.168.56.20\nsearch lab\n' > /etc/resolv.conf
mkdir -p /home/learner/.ssh
printf 'Host *\n  StrictHostKeyChecking accept-new\n' > /home/learner/.ssh/config
chown -R learner:learner /home/learner/.ssh
chmod 600 /home/learner/.ssh/config
`;

function up() {
  down();
  must(["network", "create", "--subnet", "192.168.56.0/24", "--gateway", "192.168.56.1", NET]);
  const common = ["--init", "--cap-add", "NET_ADMIN", "--cap-add", "NET_RAW", "--network", NET, "-d", IMAGE, "sleep", "infinity"];
  must(["run", "--name", "nw-srv", "--hostname", "srv01", "--ip", "192.168.56.20", ...common]);
  must(["run", "--name", "nw-lab", "--hostname", "ubuntu-lab", "--ip", "192.168.56.10", ...common]);
  root("nw-srv", SERVER_SETUP);
  root("nw-lab", WORKSTATION_SETUP);
  // The learner's SSH key is trusted by admin on the server, as after ssh-copy-id.
  root("nw-lab", "su - learner -c \"ssh-keygen -q -t ed25519 -N '' -f ~/.ssh/id_ed25519\"");
  const pub = root("nw-lab", "cat /home/learner/.ssh/id_ed25519.pub").trim();
  root("nw-srv", `echo '${pub}' > /home/admin/.ssh/authorized_keys && chown -R admin:admin /home/admin/.ssh && chmod 600 /home/admin/.ssh/authorized_keys`);
}

function down() {
  docker(["rm", "-f", "nw-lab", "nw-srv"]);
  docker(["network", "rm", NET]);
}

function root(container, script) {
  const r = docker(["exec", container, "bash", "-c", script]);
  if (r.status !== 0) throw new Error(`setup on ${container} failed:\n${script}\n${r.stdout}\n${r.stderr}`);
  return r.stdout;
}

/** Run one command as a terminal would show it: stdout and stderr interleaved. */
function asUser(container, user, cmd) {
  const home = user === "root" ? "/root" : `/home/${user}`;
  // -t gives the command a terminal, so programs print what a learner at a
  // real prompt sees (curl shows no progress meter on a terminal, for one).
  const r = docker(["exec", "-t", "-u", user, "-w", home, "-e", "TERM=dumb", "-e", "COLUMNS=100", "-e", "DEBIAN_FRONTEND=noninteractive", container, "bash", "-lc", cmd], { timeout: 240000 });
  // A command that waits for an answer would hang a recording forever.
  if (r.error) throw new Error(`"${cmd}" did not finish (${r.error.code}); is it waiting for input?`);
  return clean(r.stdout || "");
}

/**
 * The two normalisations, both stated in the generated file: terminal
 * control characters are removed, and lines about 127.0.0.11, Docker's own
 * internal DNS helper that exists only because the lab runs in containers,
 * are left out (a learner's Ubuntu machine has no such thing).
 */
function clean(text) {
  return text
    // A progress bar redraws one line with carriage returns; keep what the
    // terminal finally shows on each line.
    .split("\n")
    .map((line) => line.replace(/\r+$/, "").split("\r").pop())
    .join("\n")
    .replace(/\x1b\[[0-9;?]*[A-Za-z]/g, "")
    .split("\n")
    .filter((line) => !line.includes("127.0.0.11"))
    .join("\n")
    .replace(/\s+$/, "");
}

/* ── Captures ─────────────────────────────────────────────────────────── */

const FIELDS = ["frame.number", "frame.time_relative", "_ws.col.def_src", "_ws.col.def_dst", "_ws.col.protocol",
  "tcp.srcport", "udp.srcport", "tcp.dstport", "udp.dstport", "frame.len", "tcp.flags.str", "_ws.col.info"];

function parseCapture(text) {
  return text.split("\n").filter(Boolean).map((line) => {
    const [no, t, src, dst, proto, ts, us, td, ud, len, flags, ...info] = line.split("\t");
    const p = {
      no: Number(no),
      time: Number(t).toFixed(6),
      src, dst,
      proto: proto === "HTTP/JSON" ? "HTTP" : proto,
      length: Number(len),
      info: info.join("\t").replace(/\s+/g, " ").trim(),
    };
    const sport = ts || us, dport = td || ud;
    if (sport) p.sport = Number(sport);
    if (dport) p.dport = Number(dport);
    // tshark writes flags as "·······A··S·"; PacketTrace reads names.
    if (flags) {
      const names = [];
      if (flags.includes("S")) names.push("SYN");
      if (flags.includes("A")) names.push("ACK");
      if (flags.includes("F")) names.push("FIN");
      if (flags.includes("R")) names.push("RST");
      if (flags.includes("P")) names.push("PSH");
      if (names.length) p.flags = names.join(",");
    }
    return p;
  });
}

/* ── Run ──────────────────────────────────────────────────────────────── */

const existing = existsSync(OUT)
  ? JSON.parse(readFileSync(OUT, "utf8").match(/\/\* DATA \*\/([\s\S]*)\/\* END \*\//)[1])
  : { terminals: {}, captures: {} };

function save() {
  const banner = `/**
 * COMPUTER NETWORKING — RECORDED TERMINALS AND CAPTURES
 *
 * GENERATED by scripts/nwRecord.mjs from real Ubuntu 24.04 machines
 * (lib/academy/network/lab/Dockerfile). Do not edit by hand: change
 * lib/academy/network/sessions.mjs and record again.
 *
 * Normalised: terminal control characters are removed, and lines about
 * 127.0.0.11 (Docker's internal DNS helper, present only because the lab
 * machines are containers) are left out.
 */
`;
const json = JSON.stringify(existing, null, 1);
writeFileSync(
  OUT,
  `${banner}\nconst DATA = /* DATA */${json}/* END */;\n\nexport const NW_TERMINALS = DATA.terminals;\nexport const NW_CAPTURES = DATA.captures;\n`
);
}


const fromArg = process.argv.indexOf("--from");
const fromId = fromArg > -1 ? process.argv[fromArg + 1] : null;
for (const s of SESSIONS) {
  const seen = new Set();
  for (const c of s.commands) {
    if (seen.has(c)) throw new Error(`${s.id}: "${c}" appears twice; a transcript keeps one output per command`);
    seen.add(c);
  }
}
const chosen = fromId
  ? SESSIONS.slice(SESSIONS.findIndex((x) => x.id === fromId))
  : SESSIONS.filter((s) => !only.length || only.includes(s.id));
if (!chosen.length) throw new Error(`no session named ${only.join(", ")}`);

try {
  for (const s of chosen) {
    process.stdout.write(`recording ${s.id} … `);
    // A docker session runs the Docker CLI itself (Module 10's container
    // networking), on the recording machine, before and after cleaning up.
    if (s.host === "docker") {
      const sh = (c) => spawnSync("bash", ["-lc", `${c} 2>&1`], { encoding: "utf8" });
      for (const c of s.pre || []) sh(c);
      const commands = {};
      for (const c of s.commands) commands[c] = (sh(c).stdout || "").replace(/\r/g, "").replace(/\s+$/, "");
      for (const c of s.post || []) sh(c);
      existing.terminals[s.id] = { prompt: "learner@ubuntu-lab:~$", commands };
      save();
      console.log(`${s.commands.length} commands`);
      continue;
    }
    up();
    for (const [host, script] of Object.entries(s.setup || {})) root(host === "srv" ? "nw-srv" : "nw-lab", script);
    // Long-running things (an open SSH session, a download) start detached,
    // so the commands that follow can see them.
    for (const b of s.background || []) {
      must(["exec", "-d", "-u", b.user || "learner", b.host === "srv" ? "nw-srv" : "nw-lab", "bash", "-lc", b.command]);
      root("nw-lab", "sleep 2");
    }
    const box = s.host === "srv" ? "nw-srv" : "nw-lab";
    const user = s.user || (s.host === "srv" ? "admin" : "learner");
    if (s.capture) {
      must(["exec", "-d", "nw-lab", "bash", "-c", `tshark -i eth0 -w /tmp/cap.pcapng ${s.captureFilter ? `-f '${s.captureFilter}'` : ""} >/tmp/tshark.log 2>&1`]);
      root("nw-lab", "for i in $(seq 1 240); do grep -q 'Capturing on' /tmp/tshark.log 2>/dev/null && break; sleep 0.25; done; sleep 1; grep -q 'Capturing on' /tmp/tshark.log || { cat /tmp/tshark.log; exit 1; }");
      for (const c of s.commands) asUser(box, user, c);
      root("nw-lab", "sleep 2; pkill tshark; sleep 1");
      const fields = FIELDS.flatMap((f) => ["-e", f]);
      const text = root("nw-lab", `tshark -r /tmp/cap.pcapng ${s.displayFilter ? `-Y '${s.displayFilter}'` : ""} -T fields -E separator=/t ${fields.join(" ")}`);
      const packets = parseCapture(text);
      if (!packets.length) throw new Error(`${s.id}: the capture is empty`);
      // Renumber from 1 after any display filter, as "export specified packets" would.
      packets.forEach((p, i) => { p.no = i + 1; });
      existing.captures[s.id] = packets.slice(0, s.limit || 40);
      console.log(`${existing.captures[s.id].length} packets`);
    } else {
      const commands = {};
      for (const c of s.commands) commands[c] = asUser(box, user, c);
      existing.terminals[s.id] = { prompt: `${user}@${s.host === "srv" ? "srv01" : "ubuntu-lab"}:~${user === "root" ? "#" : "$"}`, commands };
      console.log(`${s.commands.length} commands`);
    }
    save();
  }
} finally {
  down();
}

console.log(`wrote ${OUT}`);
