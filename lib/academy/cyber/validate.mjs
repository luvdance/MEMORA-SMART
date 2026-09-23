/**
 * CONTENT INTEGRITY — THE CYBERSECURITY PRACTICES
 *
 * Called by lib/academy/validateContent.mjs. Split out because that file was
 * already long, and because every check here needs a model answer that must
 * never reach the browser bundle.
 *
 * THE RULE THIS ENFORCES, everywhere: an exercise must be solvable, and must
 * not already be solved. Both failures are silent in production. An unsolvable
 * practice traps a learner on an atom forever, because the player gates on it.
 * A pre-solved one waves them through the only part of the lesson that proves
 * anything.
 *
 * Model answers live HERE, in lib/, for the same reason the spreadsheet
 * formulas do: a learner who opens devtools should find the puzzle and not the
 * solution.
 */

import { scoreFindings, allParts } from "./phish.js";
import { scoreCapture } from "./packets.js";
import { fromOctal, scorePermissions, toOctal } from "./permissions.js";
import { scoreFirewall } from "./firewall.js";
import { scoreDetection } from "./detect.js";
import { scannerDisagrees, scoreRisk, BANDS } from "./risk.js";
import { run as runCommand, scoreTerminal } from "./shell.js";
import { storedHash, scoreSalt, scoreCrack } from "./crypto.js";

/* ── Model answers ──────────────────────────────────────────────────────
 * Keyed by atom id. Adding a graded cyber practice without adding its model
 * answer here fails the build, which is deliberate: it is the only way to know
 * the exercise can actually be completed.
 */

/** Display filter, and the packet number to select. */
export const CAPTURE_SOLUTIONS = {
  "a-cs-net-read-capture": { filter: "dns", selected: 2 },
  "a-cs-net-follow-request": { filter: "tcp.port == 443", selected: 5 },
  "a-cs-net-spot-cleartext": { filter: "http", selected: 4 },
  "a-cs-w6-ids-evidence": { filter: "tcp.flags.syn == 1", selected: 3 },
  "a-cs-ir-timeline-packet": { filter: "ip.src == 10.0.2.66", selected: 5 },
};

/** The rule list, in the order that satisfies the brief. */
export const FIREWALL_SOLUTIONS = {
  "a-cs-w6-rule-order": ["deny-ssh-wan", "allow-https", "allow-staff-out"],
  "a-cs-w6-segmentation": ["deny-guest-to-servers", "allow-guest-internet", "allow-staff-servers"],
  "a-cs-w5-host-firewall": ["allow-ssh-admin", "deny-ssh-all", "allow-web"],
  "a-cs-cloud-security-group": [
    "allow-lb-web",
    "allow-web-db",
    "allow-bastion-ssh",
    "deny-web-egress",
    "allow-web-egress",
  ],
};

/** A detection rule that catches the attack inside the allowed noise. */
export const HUNT_SOLUTIONS = {
  "a-cs-soc-first-rule": {
    conditions: [{ field: "outcome", op: "equals", value: "failure" }],
    groupBy: "username",
    threshold: 5,
  },
  "a-cs-soc-tuning": {
    conditions: [
      { field: "outcome", op: "equals", value: "success" },
      { field: "country", op: "notEquals", value: "NG" },
    ],
  },
  "a-cs-ir-detect-exfil": {
    conditions: [{ field: "bytesOut", op: "gte", value: 500 }],
  },
};

/** The permission mode the requirement asks for. */
export const PERMISSION_SOLUTIONS = {
  "a-cs-w5-chmod-payroll": "640",
  "a-cs-w5-world-writable": "644",
  "a-cs-w5-private-key": "600",
};

/** The command that answers the goal. */
export const TERMINAL_EXPECTED = {
  "a-cs-first-commands": "whoami",
  "a-cs-net-scan-lab": "nmap -sn 192.168.56.0/24",
  "a-cs-w5-find-services": "ss -tlnp",
  "a-cs-w9-passive-recon": "whois memora-lab.test",
  "a-cs-w9-enumerate": "nmap -sV 192.168.56.20",
  "a-cs-w12-collect-evidence": "sha256sum evidence.img",
};

/** The message parts that actually give a phishing message away. */
export const PHISH_EXPECTED = {
  "a-cs-acct-dissect-phish": ["p-from", "p-link", "p-urgency"],
  "a-cs-acct-spear": ["s-from", "s-link", "s-ask"],
};

/** Crypto lab answers. */
export const CRYPTO_SOLUTIONS = {
  "a-cs-data-crack-hash": { answer: "password123" },
  "a-cs-data-salt-it": { salts: { u1: "s7Kq2", u2: "Lm94x", u3: "Tz03b" } },
};

/* ── The checks ──────────────────────────────────────────────────────── */

export async function validateCyberPractices(lessons) {
  const errors = [];
  const counts = {
    decision: 0,
    phish: 0,
    capture: 0,
    perms: 0,
    firewall: 0,
    hunt: 0,
    risk: 0,
    terminal: 0,
    crypto: 0,
  };

  for (const lesson of lessons) {
    for (const atom of lesson.atoms) {
      const at = (msg) => errors.push(`${atom.id}: ${msg}`);

      /* ── Decision: a graded judgement ───────────────────────────────── */
      if (atom.decision) {
        counts.decision += 1;
        const d = atom.decision;
        if (!d.question) at("decision has no question");
        if (!d.options?.length || d.options.length < 2) {
          at("decision needs at least two options");
        } else {
          const ids = d.options.map((o) => o.id);
          if (new Set(ids).size !== ids.length) at("decision has duplicate option ids");
          if (!ids.includes(d.correct)) {
            at(`decision's correct answer "${d.correct}" is not one of the options`);
          }
          for (const option of d.options) {
            if (!option.text) at(`decision option "${option.id}" has no text`);
            // A wrong option with no reasoning marks a learner wrong and
            // teaches nothing, which is the one thing a practice must never do.
            if (option.id !== d.correct && !option.whyWrong) {
              at(`decision option "${option.id}" has no whyWrong`);
            }
          }
          if (!d.options.find((o) => o.id === d.correct)?.why && !d.successMessage) {
            at("decision's correct option needs a `why`, or the decision needs a successMessage");
          }
        }
      }

      /* ── Phishing triage ────────────────────────────────────────────── */
      const phish = atom.phishExercise || atom.phish;
      if (phish) {
        counts.phish += 1;
        const parts = allParts(phish.message);
        if (!parts.length) {
          at("phish message has no parts");
        } else {
          const ids = parts.map((p) => p.id);
          if (new Set(ids).size !== ids.length) at("phish message has duplicate part ids");
          for (const part of parts) {
            if (part.flag && !part.why) at(`phish part "${part.id}" is flagged but has no why`);
          }
        }

        if (atom.phishExercise) {
          const model = PHISH_EXPECTED[atom.id];
          if (!model) {
            at("no model findings registered in cyber/validate.mjs");
          } else {
            const flagged = parts.filter((p) => p.flag).map((p) => p.id);
            const missing = flagged.filter((id) => !model.includes(id));
            const extra = model.filter((id) => !flagged.includes(id));
            if (missing.length || extra.length) {
              at(
                `model findings disagree with the message. Flagged in content: [${flagged.join(", ")}], registered: [${model.join(", ")}]`
              );
            }
            const scored = scoreFindings(phish.message, model, phish.tolerance ?? 0);
            if (!scored.ok) at("the registered model findings do not pass their own exercise");
            // Flagging everything must fail, or the practice proves nothing.
            const all = scoreFindings(phish.message, parts.map((p) => p.id), phish.tolerance ?? 0);
            if (all.ok) {
              at("flagging every part of the message passes, so the exercise cannot distinguish anything");
            }
          }
        }
      }

      /* ── Packet capture ─────────────────────────────────────────────── */
      const capture = atom.captureExercise || atom.capture;
      if (capture) {
        counts.capture += 1;
        if (!capture.packets?.length) at("capture has no packets");
        const nos = (capture.packets || []).map((p) => p.no);
        if (new Set(nos).size !== nos.length) at("capture has duplicate packet numbers");

        if (atom.captureExercise) {
          if (!capture.expect) at("capture exercise has no expectation");
          const model = CAPTURE_SOLUTIONS[atom.id];
          if (!model) {
            at("no model filter registered in cyber/validate.mjs");
          } else if (capture.expect) {
            const scored = scoreCapture(capture.packets, capture.expect, {
              filter: model.filter,
              selected: model.selected,
            });
            if (!scored.ok) {
              at(`model filter "${model.filter}" selecting packet ${model.selected} fails: ${scored.message}`);
            }
            if (capture.expect.packet !== undefined && model.selected !== capture.expect.packet) {
              at("the registered model selects a different packet than the exercise expects");
            }
          }
        }
      }

      /* ── Permissions ────────────────────────────────────────────────── */
      const perms = atom.permsExercise || atom.perms;
      if (perms) {
        counts.perms += 1;
        if (atom.permsExercise) {
          const model = PERMISSION_SOLUTIONS[atom.id];
          if (!model) {
            at("no model permission mode registered in cyber/validate.mjs");
          } else {
            if (String(perms.expect) !== String(model)) {
              at(`registered model ${model} does not match the exercise's expect ${perms.expect}`);
            }
            const scored = scorePermissions(fromOctal(model), perms.expect);
            if (!scored.ok) at(`model mode ${model} does not satisfy the exercise`);
            // A starting mode equal to the answer would be pre-solved.
            if (toOctal(fromOctal(perms.start ?? "000")) === String(perms.expect)) {
              at("the starting mode is already the answer");
            }
          }
          if (!perms.requirement) at("permissions exercise has no requirement text");
        }
      }

      /* ── Firewall ───────────────────────────────────────────────────── */
      const firewall = atom.firewallExercise || atom.firewall;
      if (firewall) {
        counts.firewall += 1;
        if (!firewall.traffic?.length) at("firewall has no traffic sample");
        for (const packet of firewall.traffic || []) {
          if (atom.firewallExercise && !packet.expect) {
            at(`traffic "${packet.id}" has no expected verdict`);
          }
        }

        if (atom.firewallExercise) {
          const model = FIREWALL_SOLUTIONS[atom.id];
          if (!model) {
            at("no model rule order registered in cyber/validate.mjs");
          } else {
            const byId = new Map((firewall.rules || []).map((r) => [r.id, r]));
            const missing = model.filter((id) => !byId.has(id));
            if (missing.length) {
              at(`model order names rules that do not exist: ${missing.join(", ")}`);
            } else {
              const ordered = model.map((id) => byId.get(id));
              const scored = scoreFirewall(ordered, firewall.traffic);
              if (!scored.ok) at(`the model rule order does not satisfy the brief: ${scored.message}`);
              // The starting order must be wrong, or there is nothing to fix.
              const initial = scoreFirewall(firewall.rules, firewall.traffic);
              if (initial.ok) at("the policy already passes as given, so the exercise is pre-solved");
            }
          }
        }
      }

      /* ── Detection ──────────────────────────────────────────────────── */
      const hunt = atom.huntExercise || atom.hunt;
      if (hunt) {
        counts.hunt += 1;
        if (!hunt.events?.length) at("detection exercise has no events");
        const ids = (hunt.events || []).map((e) => e.id);
        if (new Set(ids).size !== ids.length) at("detection log has duplicate event ids");

        if (atom.huntExercise) {
          const attacks = (hunt.events || []).filter((e) => e.attack);
          if (!attacks.length) at("detection log contains no attack events to catch");
          if (attacks.length === hunt.events.length) {
            at("every event is an attack, so a rule matching everything would pass");
          }
          const model = HUNT_SOLUTIONS[atom.id];
          if (!model) {
            at("no model detection rule registered in cyber/validate.mjs");
          } else {
            const scored = scoreDetection(hunt.events, model, hunt.expect || {});
            if (!scored.ok) at(`the model detection rule does not pass: ${scored.message}`);
            // A rule that alerts on everything must fail, or the false-positive
            // budget is not actually constraining anything.
            const naive = scoreDetection(
              hunt.events,
              { conditions: [{ field: (hunt.fields?.[0]?.id) || "outcome", op: "notEquals", value: "\u0000" }] },
              hunt.expect || {}
            );
            if (naive.ok) at("a rule that matches every event passes, so the exercise proves nothing");
          }
        }
      }

      /* ── Risk ───────────────────────────────────────────────────────── */
      const risk = atom.riskExercise || atom.risk;
      if (risk) {
        counts.risk += 1;
        const bandIds = new Set(BANDS.map((b) => b.id));
        for (const finding of risk.findings || []) {
          if (typeof finding.cvss !== "number") at(`finding "${finding.id}" has no numeric cvss`);
          if (!bandIds.has(finding.expected)) {
            at(`finding "${finding.id}" expects unknown band "${finding.expected}"`);
          }
          if (!finding.why) at(`finding "${finding.id}" has no reasoning`);
          if (!finding.exposure) at(`finding "${finding.id}" has no exposure context`);
        }

        if (atom.riskExercise) {
          const model = Object.fromEntries((risk.findings || []).map((f) => [f.id, f.expected]));
          const scored = scoreRisk(risk.findings, model);
          if (!scored.ok) at("the declared expectations do not pass their own exercise");
          // The whole teaching point is that scanner order is not risk order.
          if (!scannerDisagrees(risk.findings || [])) {
            at("sorting by raw CVSS gives the same order as the expected priority, so the exercise teaches the opposite of what it intends");
          }
        }
      }

      /* ── Terminal ───────────────────────────────────────────────────── */
      const terminal = atom.terminalExercise || atom.terminal;
      if (terminal) {
        counts.terminal += 1;
        const world = { prompt: terminal.prompt, commands: terminal.commands || {} };

        for (const suggestion of terminal.available || []) {
          if (runCommand(world, suggestion).status !== "ok") {
            at(`the terminal offers "${suggestion}" but has no recorded output for it`);
          }
        }

        if (atom.terminalExercise) {
          if (!terminal.goal) at("terminal exercise has no goal");
          if (!terminal.accept?.length) at("terminal exercise accepts no command");
          for (const accepted of terminal.accept || []) {
            if (runCommand(world, accepted).status !== "ok") {
              at(`accepts "${accepted}" but has no recorded output for it, so solving it shows nothing`);
            }
          }
          for (const near of terminal.near || []) {
            if (!near.why) at(`near-miss "${near.command}" has no explanation`);
            if (runCommand(world, near.command).status !== "ok") {
              at(`near-miss "${near.command}" has no recorded output`);
            }
          }
          const expected = TERMINAL_EXPECTED[atom.id];
          if (!expected) {
            at("no expected command registered in cyber/validate.mjs");
          } else {
            const scored = scoreTerminal(terminal, [{ command: expected }]);
            if (!scored.ok) at(`the registered command "${expected}" does not satisfy the exercise`);
          }
        }
      }

      /* ── Crypto ─────────────────────────────────────────────────────── */
      const crypto = atom.cryptoExercise || atom.crypto;
      if (crypto) {
        counts.crypto += 1;
        if (!["hash", "crack", "salt"].includes(crypto.mode || "hash")) {
          at(`unknown crypto lab mode "${crypto.mode}"`);
        }

        if (crypto.mode === "crack") {
          // The strongest check in this file: the stored hash the lesson shows
          // is recomputed with real SHA-256 and must actually be the digest of
          // one of the candidates. A typo here would make the exercise
          // unsolvable and the lesson wrong about how hashing works.
          const model = CRYPTO_SOLUTIONS[atom.id];
          if (!model?.answer) {
            at("no model password registered in cyber/validate.mjs");
          } else {
            if (!(crypto.candidates || []).includes(model.answer)) {
              at(`the registered answer "${model.answer}" is not one of the candidates shown`);
            }
            const real = await storedHash(model.answer, crypto.salt || "");
            if (real !== String(crypto.target).toLowerCase()) {
              at(
                `the hash shown is not the SHA-256 of "${model.answer}". Shown ${crypto.target}, real ${real}`
              );
            }
            const scored = await scoreCrack(crypto.target, crypto.candidates, model.answer, crypto.salt || "");
            if (!scored.ok) at("the registered answer does not pass the crack exercise");
          }
        }

        if (crypto.mode === "salt") {
          const users = crypto.users || [];
          if (users.length < 2) at("a salting exercise needs at least two accounts");
          // Two accounts sharing a password is the entire teaching point.
          const passwords = users.map((u) => u.password);
          if (new Set(passwords).size === passwords.length) {
            at("no two accounts share a password, so salting changes nothing visible and the lesson lands flat");
          }
          const model = CRYPTO_SOLUTIONS[atom.id];
          if (!model?.salts) {
            at("no model salts registered in cyber/validate.mjs");
          } else {
            const scored = await scoreSalt(users, model.salts);
            if (!scored.ok) at(`the registered salts do not pass: ${scored.message}`);
            // One shared salt must fail, or the exercise does not teach
            // per-account salting at all.
            const shared = Object.fromEntries(users.map((u) => [u.id, "sharedsalt"]));
            const sharedScore = await scoreSalt(users, shared);
            if (sharedScore.ok) at("one shared salt passes, so the exercise does not teach per-account salting");
          }
        }
      }
    }
  }

  return { errors, counts };
}
