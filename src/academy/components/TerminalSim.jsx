import { useEffect, useRef, useState } from "react";
import { run, scoreTerminal } from "../../../lib/academy/cyber/shell";

/**
 * THE TERMINAL — scripted, and honest about it.
 *
 * DELIBERATELY NOT a Linux emulator, for two reasons that are about teaching
 * rather than engineering:
 *
 *   1. A half-emulated shell teaches things that are not true. A learner who
 *      runs nmap here and gets a plausible invention would carry that
 *      invention into a real engagement. Every output below was recorded from
 *      a real run by the author, and the content validator proves the command
 *      an exercise accepts is one this terminal can actually answer.
 *   2. The skill a beginner lacks is knowing WHICH command answers a question,
 *      and what its output means. Typing is not the hard part.
 *
 * The banner says so out loud. A learner who thinks this is a real machine
 * will eventually discover it is not, and will then reasonably wonder what
 * else the course was vague about.
 */
export default function TerminalSim({
  prompt = "learner@lab:~$",
  intro,
  goal,
  commands = {},
  available = [],
  exercise,
  onSolved,
  alreadySolved = false,
}) {
  const graded = Boolean(exercise);
  const [history, setHistory] = useState(() =>
    intro ? [{ kind: "note", output: intro }] : []
  );
  const [input, setInput] = useState("");
  const [result, setResult] = useState(() =>
    alreadySolved && graded
      ? { ok: true, message: "You already found the command for this one. The terminal is still live." }
      : null
  );
  const [recall, setRecall] = useState(-1);
  const endRef = useRef(null);

  const typed = history.filter((h) => h.kind === "command");

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "nearest" });
  }, [history]);

  const submit = () => {
    const line = input;
    setInput("");
    setRecall(-1);
    if (!line.trim()) return;

    const outcome = run({ prompt, commands }, line);
    if (outcome.status === "clear") {
      setHistory([]);
      return;
    }
    setHistory((prev) => [
      ...prev,
      { kind: "command", command: outcome.command, output: outcome.output, status: outcome.status },
    ]);
    setResult(null);
  };

  const check = () => {
    const scored = scoreTerminal(exercise, typed);
    setResult(scored);
    if (scored.ok) onSolved?.();
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter") {
      submit();
      return;
    }
    // Up and down walk the history, because that is how anyone actually uses a
    // shell and a learner who does not discover it types everything twice.
    if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      e.preventDefault();
      if (!typed.length) return;
      const next =
        e.key === "ArrowUp"
          ? Math.min(recall + 1, typed.length - 1)
          : Math.max(recall - 1, -1);
      setRecall(next);
      setInput(next === -1 ? "" : typed[typed.length - 1 - next].command);
    }
  };

  return (
    <div className="ac-term">
      {goal && (
        <div className="ac-term__task">
          <span className="ac-note__label">{graded ? "Your goal" : "At the terminal"}</span>
          <p>{goal}</p>
        </div>
      )}

      <div className="ac-term__window">
        <div className="ac-term__chrome">
          <span className="ac-term__dot" />
          <span className="ac-term__dot" />
          <span className="ac-term__dot" />
          <span className="ac-term__title">{prompt.replace(/[:~$]+$/, "")}</span>
        </div>

        <div className="ac-term__screen">
          {history.map((entry, i) =>
            entry.kind === "note" ? (
              <p key={i} className="ac-term__note">
                {entry.output}
              </p>
            ) : (
              <div key={i} className="ac-term__entry">
                <p className="ac-term__line">
                  <span className="ac-term__prompt">{prompt}</span> {entry.command}
                </p>
                {entry.output && (
                  <pre
                    className={`ac-term__out ${
                      entry.status === "notfound" || entry.status === "unscripted" ? "is-error" : ""
                    }`}
                  >
                    {entry.output}
                  </pre>
                )}
              </div>
            )
          )}

          <div className="ac-term__inputline">
            <span className="ac-term__prompt">{prompt}</span>
            <input
              className="ac-term__input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              spellCheck={false}
              autoComplete="off"
              autoCapitalize="off"
              autoCorrect="off"
              aria-label="Type a command"
            />
          </div>
          <div ref={endRef} />
        </div>
      </div>

      {available.length > 0 && (
        <p className="ac-term__available">
          <strong>This terminal is a recording, not a live machine.</strong> Every output below was
          captured from a real run so nothing here is invented. It can answer:{" "}
          {available.map((c, i) => (
            <span key={c}>
              <button
                type="button"
                className="ac-term__suggest"
                onClick={() => setInput(c)}
                title="Put this in the prompt"
              >
                {c}
              </button>
              {i < available.length - 1 ? " " : ""}
            </span>
          ))}
        </p>
      )}

      {graded && (
        <div className="ac-term__check">
          <button className="ac-term__btn" onClick={check}>
            Check my work
          </button>
          {result && (
            <p className={`ac-term__feedback ${result.ok ? "is-ok" : "is-bad"}`} role="status">
              {result.message}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
