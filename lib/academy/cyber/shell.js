/**
 * TERMINAL ENGINE — a scripted shell, and honest about being one.
 *
 * Pure. Shared by src/academy/components/TerminalSim.jsx and the content
 * validator.
 *
 * DELIBERATELY NOT A LINUX EMULATOR. Two reasons, and both are pedagogical
 * rather than technical:
 *
 *   1. A half-emulated shell teaches wrong things. A learner who runs `nmap`
 *      here and gets a plausible-looking invention would carry that invention
 *      into a real engagement. Every output in a lesson is one an author wrote
 *      down from a real run, and the content validator checks that the command
 *      the exercise accepts is one the lesson can actually answer.
 *   2. The skill being practised is knowing WHICH command to reach for and
 *      what its output means. That is the part beginners lack. Typing is not.
 *
 * So a terminal atom declares a transcript: a map of command to output. The
 * learner types; a known command prints its real recorded output; an unknown
 * one prints a shell-accurate error. A graded terminal atom also declares
 * `accept`, the commands that satisfy the goal.
 *
 * WORLD  { prompt, commands: { "<command>": "<output>" }, hints? }
 */

/** Collapse whitespace so `ls  -l` and `ls -l` are the same command. */
export function normaliseCommand(input) {
  return String(input || "").trim().replace(/\s+/g, " ");
}

/**
 * Look a command up.
 *
 * Flag order is the one thing forgiven: `ls -la` and `ls -al` are the same
 * command to a human and to Linux, and marking one wrong would teach a
 * superstition rather than a skill.
 */
function lookup(commands, typed) {
  if (commands[typed] !== undefined) return commands[typed];

  const key = sortFlags(typed);
  for (const [candidate, output] of Object.entries(commands)) {
    if (sortFlags(candidate) === key) return output;
  }
  return undefined;
}

function sortFlags(command) {
  const parts = normaliseCommand(command).split(" ");
  return parts
    .map((part) =>
      /^-[a-z]{2,}$/i.test(part) ? "-" + part.slice(1).split("").sort().join("") : part
    )
    .join(" ");
}

/** Run one command against a world. Never throws. */
export function run(world = {}, input = "") {
  const typed = normaliseCommand(input);
  if (!typed) return { command: "", output: "", status: "empty" };

  if (typed === "clear") return { command: typed, output: "", status: "clear" };

  const output = lookup(world.commands || {}, typed);
  if (output !== undefined) return { command: typed, output, status: "ok" };

  const program = typed.split(" ")[0];
  const known = new Set(
    Object.keys(world.commands || {}).map((c) => c.split(" ")[0])
  );

  // A program this lesson knows, invoked in a way it does not: say so honestly
  // rather than inventing output, and point at what the lesson does cover.
  if (known.has(program)) {
    return {
      command: typed,
      status: "unscripted",
      output: `This lesson has not recorded a run of "${typed}". The commands it can show you are listed under the terminal.`,
    };
  }

  return {
    command: typed,
    status: "notfound",
    output: `${program}: command not found`,
  };
}

/** Did any command in the history satisfy the goal? */
export function scoreTerminal(exercise = {}, history = []) {
  const accept = (exercise.accept || []).map(sortFlags);
  const ran = history.map((h) => sortFlags(h.command || h));

  const hit = ran.some((command) => accept.includes(command));
  if (hit) {
    return { ok: true, message: exercise.success || "That is the command, and that is what its output is telling you." };
  }

  // Ran something related but not the thing asked for. Worth saying, because
  // the difference between `nmap -sV` and `nmap -sn` is the entire point.
  const nearMiss = (exercise.near || []).find((n) => ran.includes(sortFlags(n.command)));
  if (nearMiss) return { ok: false, message: nearMiss.why };

  return {
    ok: false,
    message: exercise.hint || "Not yet. Read the goal again and think about which tool answers that specific question.",
  };
}
