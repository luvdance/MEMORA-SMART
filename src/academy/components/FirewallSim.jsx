import { useMemo, useState } from "react";
import { evaluate, scoreFirewall } from "../../../lib/academy/cyber/firewall";

/**
 * FIREWALL RULES — where order is the whole lesson.
 *
 * Nearly every beginner writes a correct set of rules in the wrong order and
 * then cannot see why the firewall is ignoring half of them. A diagram can
 * never show this, because the bug is not in any one rule. It is in what sits
 * above it.
 *
 * So the rules are a list the learner reorders, enables and disables, and
 * every sample packet reports the rule that decided its fate. A rule shadowed
 * by a broader one above it shows up as a rule that never fires — visible, in
 * the table, the moment it happens.
 *
 * Default deny is drawn as a real final row rather than described, because
 * "anything not explicitly allowed is blocked" is the sentence beginners nod
 * at and then design around.
 */
export default function FirewallSim({
  brief,
  rules: initialRules = [],
  traffic = [],
  locked = [],
  expect = false,
  successMessage,
  onSolved,
  alreadySolved = false,
}) {
  const [rules, setRules] = useState(initialRules);
  const [result, setResult] = useState(() =>
    alreadySolved && expect
      ? { ok: true, message: "You already got this policy right. Move the rules around to see what breaks." }
      : null
  );

  const results = useMemo(() => evaluate(rules, traffic), [rules, traffic]);
  const firedRules = useMemo(() => new Set(results.map((r) => r.matchedRule)), [results]);

  const move = (index, delta) => {
    const target = index + delta;
    if (target < 0 || target >= rules.length) return;
    setRules((prev) => {
      const next = [...prev];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
    setResult(null);
  };

  const toggleAction = (id) => {
    setRules((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, action: r.action === "allow" ? "deny" : "allow" } : r
      )
    );
    setResult(null);
  };

  const check = () => {
    const scored = scoreFirewall(rules, traffic);
    if (scored.ok) {
      setResult({
        ok: true,
        message: successMessage || "Every packet in the sample gets the verdict the brief asked for.",
      });
      onSolved?.();
      return;
    }
    setResult({ ok: false, message: scored.message });
  };

  return (
    <div className="ac-fw">
      <div className="ac-fw__task">
        <span className="ac-note__label">{expect ? "Fix the policy" : "Firewall policy"}</span>
        <p>{brief}</p>
      </div>

      <div className="ac-fw__rules">
        <div className="ac-fw__rulehead">
          <span>#</span>
          <span>Action</span>
          <span>Proto</span>
          <span>Source</span>
          <span>Destination</span>
          <span>Port</span>
          <span />
        </div>

        {rules.map((rule, i) => {
          const isLocked = locked.includes(rule.id);
          const dead = !firedRules.has(rule.id);
          return (
            <div
              key={rule.id}
              className={`ac-fw__rule ac-fw__rule--${rule.action} ${dead ? "is-dead" : ""}`}
            >
              <span className="ac-fw__num">{i + 1}</span>
              <button
                type="button"
                className={`ac-fw__action ac-fw__action--${rule.action}`}
                onClick={() => !isLocked && toggleAction(rule.id)}
                disabled={isLocked}
                title={isLocked ? "This rule is fixed by the brief" : "Switch between allow and deny"}
              >
                {rule.action.toUpperCase()}
              </button>
              <span>{rule.proto}</span>
              <code>{rule.source}</code>
              <code>{rule.dest}</code>
              <code>{rule.port}</code>
              <span className="ac-fw__move">
                <button onClick={() => move(i, -1)} disabled={i === 0} aria-label="Move rule up">
                  <i className="fas fa-arrow-up" aria-hidden="true" />
                </button>
                <button
                  onClick={() => move(i, 1)}
                  disabled={i === rules.length - 1}
                  aria-label="Move rule down"
                >
                  <i className="fas fa-arrow-down" aria-hidden="true" />
                </button>
              </span>
              {dead && (
                <span className="ac-fw__dead" title="No packet in the sample ever reaches this rule">
                  never fires
                </span>
              )}
            </div>
          );
        })}

        <div className="ac-fw__rule ac-fw__rule--default">
          <span className="ac-fw__num">—</span>
          <span className="ac-fw__action ac-fw__action--deny">DENY</span>
          <span>any</span>
          <code>any</code>
          <code>any</code>
          <code>any</code>
          <span className="ac-fw__implicit">the implicit rule, always last</span>
        </div>
      </div>

      <div className="ac-fw__trafficwrap">
        <span className="ac-fw__trafficlabel">What happens to real traffic</span>
        <table className="ac-fw__traffic">
          <thead>
            <tr>
              <th>Traffic</th>
              <th>Destination</th>
              <th>Port</th>
              <th>Verdict</th>
              <th>Decided by</th>
            </tr>
          </thead>
          <tbody>
            {results.map((r) => (
              <tr key={r.id} className={r.expect && !r.correct ? "is-wrong" : ""}>
                <td>{r.label}</td>
                <td>
                  <code>{r.dest}</code>
                </td>
                <td>{r.port}</td>
                <td>
                  <span className={`ac-fw__verdict is-${r.verdict}`}>
                    {r.verdict === "allow" ? "Allowed" : "Blocked"}
                  </span>
                </td>
                <td className="ac-fw__by">
                  {r.byDefault ? "nothing matched, default deny" : `rule ${r.matchedIndex + 1}`}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {expect && (
        <div className="ac-fw__check">
          <button className="ac-fw__btn" onClick={check}>
            Check my policy
          </button>
          {result && (
            <p className={`ac-fw__feedback ${result.ok ? "is-ok" : "is-bad"}`} role="status">
              {result.message}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
