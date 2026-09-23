import { useState } from "react";
import {
  BITS,
  WHO,
  describe,
  emptyMode,
  fromOctal,
  scorePermissions,
  toOctal,
  toSymbolic,
} from "../../../lib/academy/cyber/permissions";

const WHO_LABEL = { owner: "Owner", group: "Group", other: "Everyone else" };
const BIT_LABEL = { r: "Read", w: "Write", x: "Execute" };

/**
 * FILE PERMISSIONS — least privilege, done rather than recited.
 *
 * "Grant only the access that is needed" is the most repeated sentence in
 * security teaching and the least practised, because it is advice, not a
 * skill. The skill is looking at -rw-rw-rw- on a payroll file and knowing
 * immediately who can now read salaries.
 *
 * So the learner toggles the nine real bits, and three things update live: the
 * octal, the string ls -l would print, and a plain sentence naming who that
 * lets in. The sentence is the teaching. Someone who sets the "everyone else"
 * column and reads "every other account on the machine can read it" has
 * understood the mode column for good.
 */
export default function PermissionsSim({
  file = "payroll-2026.csv",
  owner = "finance",
  group = "finance-team",
  directory = false,
  start = "000",
  requirement,
  expect,
  context,
  successMessage,
  onSolved,
  alreadySolved = false,
  readOnly = false,
}) {
  const graded = Boolean(expect);
  const [mode, setMode] = useState(() => (start ? fromOctal(start) : emptyMode()));
  const [result, setResult] = useState(() =>
    alreadySolved && graded
      ? { ok: true, message: "You already set this one correctly. Toggle the bits if you want to see the sentence change." }
      : null
  );

  const toggle = (who, bit) => {
    if (readOnly) return;
    setMode((prev) => ({ ...prev, [who]: { ...prev[who], [bit]: !prev[who][bit] } }));
    setResult(null);
  };

  const check = () => {
    const scored = scorePermissions(mode, expect);
    if (scored.ok) {
      setResult({
        ok: true,
        message: successMessage || `${scored.octal}. That is the narrowest mode that still lets the work happen.`,
      });
      onSolved?.();
      return;
    }
    setResult({ ok: false, message: scored.message });
  };

  const octal = toOctal(mode);
  const symbolic = toSymbolic(mode, { directory });

  return (
    <div className="ac-perm">
      <div className="ac-perm__task">
        <span className="ac-note__label">{graded ? "Set the permissions" : "Permissions"}</span>
        {requirement && <p>{requirement}</p>}
      </div>

      <div className="ac-perm__file">
        <i className={directory ? "fas fa-folder" : "fas fa-file-lines"} aria-hidden="true" />
        <code className="ac-perm__ls">
          {symbolic} 1 {owner} {group} {file}
        </code>
      </div>

      <div className="ac-perm__gridwrap">
        <table className="ac-perm__grid">
          <thead>
            <tr>
              <th scope="col">Who</th>
              {BITS.map((bit) => (
                <th key={bit} scope="col">
                  {BIT_LABEL[bit]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {WHO.map((who) => (
              <tr key={who}>
                <th scope="row" className={`ac-perm__who ac-perm__who--${who}`}>
                  {WHO_LABEL[who]}
                </th>
                {BITS.map((bit) => (
                  <td key={bit}>
                    <button
                      type="button"
                      className={`ac-perm__bit ${mode[who][bit] ? "is-on" : ""}`}
                      onClick={() => toggle(who, bit)}
                      disabled={readOnly}
                      aria-pressed={mode[who][bit]}
                      aria-label={`${BIT_LABEL[bit]} for ${WHO_LABEL[who]}`}
                    >
                      {mode[who][bit] ? bit : "–"}
                    </button>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        <div className="ac-perm__readout">
          <div className="ac-perm__octal">
            <span className="ac-perm__octal-label">chmod</span>
            <strong>{octal}</strong>
          </div>
          <p className="ac-perm__says">{describe(mode, { owner, group })}</p>
          {mode.other.w && (
            <p className="ac-perm__alarm">
              <i className="fas fa-triangle-exclamation" aria-hidden="true" />
              Anyone who lands on this machine can now rewrite this file, and nothing in the logs
              will say it was not the owner.
            </p>
          )}
        </div>
      </div>

      {context && <p className="ac-perm__context">{context}</p>}

      {graded && (
        <div className="ac-perm__check">
          <button className="ac-perm__btn" onClick={check}>
            Check my permissions
          </button>
          {result && (
            <p className={`ac-perm__feedback ${result.ok ? "is-ok" : "is-bad"}`} role="status">
              {result.message}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
