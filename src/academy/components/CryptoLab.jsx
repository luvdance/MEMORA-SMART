import { useEffect, useState } from "react";
import {
  bitsDiffering,
  scoreCrack,
  scoreSalt,
  sha256,
  shortHash,
  storedHash,
} from "../../../lib/academy/cyber/crypto";

/**
 * THE CRYPTO LAB — real SHA-256, not a picture of one.
 *
 * A cryptography lesson with invented hex strings in it is, to a beginner,
 * indistinguishable from one with real ones. The whole subject rests on
 * trusting that the maths does what it claims, and no amount of prose builds
 * that trust. Typing your own password and watching a genuine digest appear
 * does it in about four seconds.
 *
 * So every digest here comes from the browser's own Web Crypto, and the
 * content validator computes the same values with the same call in Node. A
 * learner can run `echo -n "password" | sha256sum` on any machine and get the
 * number on their screen.
 *
 * Three modes, each aimed at a specific misconception:
 *   hash   "a hash is a kind of encryption you can undo"  → watch it not undo
 *   crack  "hashed means safe"                            → crack one yourself
 *   salt   "a salt is a second secret"                    → it is not, and here is why
 *
 * SHA-256 is used because it is the hash a learner will meet first. It is the
 * wrong choice for storing passwords — it is fast, and you want slow. The
 * lessons say so; this component is for the concepts.
 */
export default function CryptoLab({
  mode = "hash",
  task,
  samples = [],
  users = [],
  target,
  candidates = [],
  salt = "",
  note,
  successMessage,
  onSolved,
  alreadySolved = false,
}) {
  const graded = mode === "salt" || mode === "crack";

  const [text, setText] = useState(samples[0] || "password");
  const [digest, setDigest] = useState("");
  const [compare, setCompare] = useState(samples[1] || "Password");
  const [compareDigest, setCompareDigest] = useState("");

  const [salts, setSalts] = useState({});
  const [saltHashes, setSaltHashes] = useState({});
  const [guess, setGuess] = useState("");

  const [result, setResult] = useState(() =>
    alreadySolved && graded
      ? { ok: true, message: "You already worked this one out. The lab is still live." }
      : null
  );

  /* Digests are async, so they are computed in an effect rather than during
     render. Both boxes update on every keystroke, which is the point: the
     avalanche is something you see, not something you are told about. */
  useEffect(() => {
    let alive = true;
    sha256(text).then((h) => alive && setDigest(h));
    return () => {
      alive = false;
    };
  }, [text]);

  useEffect(() => {
    let alive = true;
    sha256(compare).then((h) => alive && setCompareDigest(h));
    return () => {
      alive = false;
    };
  }, [compare]);

  useEffect(() => {
    if (mode !== "salt") return;
    let alive = true;
    (async () => {
      const next = {};
      for (const user of users) {
        next[user.id] = await storedHash(user.password, String(salts[user.id] || "").trim());
      }
      if (alive) setSaltHashes(next);
    })();
    return () => {
      alive = false;
    };
  }, [mode, users, salts]);

  const checkSalt = async () => {
    const scored = await scoreSalt(users, salts);
    setResult({ ok: scored.ok, message: scored.ok ? successMessage || scored.message : scored.message });
    if (scored.ok) onSolved?.();
  };

  const checkCrack = async () => {
    const scored = await scoreCrack(target, candidates, guess, salt);
    setResult({ ok: scored.ok, message: scored.ok ? successMessage || scored.message : scored.message });
    if (scored.ok) onSolved?.();
  };

  const differing = digest && compareDigest ? bitsDiffering(digest, compareDigest) : 0;

  return (
    <div className="ac-crypto">
      <div className="ac-crypto__task">
        <span className="ac-note__label">
          {mode === "salt" ? "Salt the database" : mode === "crack" ? "Crack the hash" : "The hashing lab"}
        </span>
        <p>{task}</p>
      </div>

      {mode === "hash" && (
        <>
          <div className="ac-crypto__pair">
            {[
              { value: text, set: setText, hash: digest, label: "Type anything" },
              { value: compare, set: setCompare, hash: compareDigest, label: "And something almost identical" },
            ].map((box, i) => (
              <div className="ac-crypto__box" key={i}>
                <label className="ac-crypto__label" htmlFor={`ac-crypto-in-${i}`}>
                  {box.label}
                </label>
                <input
                  id={`ac-crypto-in-${i}`}
                  className="ac-crypto__input"
                  value={box.value}
                  onChange={(e) => box.set(e.target.value)}
                  spellCheck={false}
                />
                <code className="ac-crypto__digest">{box.hash || "…"}</code>
              </div>
            ))}
          </div>

          <p className="ac-crypto__avalanche">
            {text === compare ? (
              <>
                Identical inputs, identical digests. Every single time, on every machine in the
                world. That is what makes a hash usable as a fingerprint.
              </>
            ) : (
              <>
                Those two inputs differ by a little. Their digests differ in{" "}
                <strong>{differing} of 256 bits</strong> — about half, which is what you want.
                Nothing about the output hints at how close the inputs were, and that is why you
                cannot work backwards from one.
              </>
            )}
          </p>
        </>
      )}

      {mode === "crack" && (
        <>
          <div className="ac-crypto__stolen">
            <span className="ac-crypto__label">One row from a stolen database</span>
            <code className="ac-crypto__digest">{target}</code>
            {salt ? (
              <span className="ac-crypto__saltnote">stored with salt: {salt}</span>
            ) : (
              <span className="ac-crypto__saltnote">stored with no salt</span>
            )}
          </div>

          <div className="ac-crypto__candidates">
            <span className="ac-crypto__label">
              The attacker's wordlist. A real one has half a billion entries.
            </span>
            <div className="ac-crypto__words">
              {candidates.map((word) => (
                <button
                  key={word}
                  type="button"
                  className={`ac-crypto__word ${guess === word ? "is-picked" : ""}`}
                  onClick={() => {
                    setGuess(word);
                    setResult(null);
                  }}
                >
                  {word}
                </button>
              ))}
            </div>
          </div>

          <div className="ac-crypto__check">
            <button className="ac-crypto__btn" onClick={checkCrack}>
              Hash it and compare
            </button>
            {result && (
              <p className={`ac-crypto__feedback ${result.ok ? "is-ok" : "is-bad"}`} role="status">
                {result.message}
              </p>
            )}
          </div>
        </>
      )}

      {mode === "salt" && (
        <>
          <table className="ac-crypto__table">
            <thead>
              <tr>
                <th>Account</th>
                <th>Password (they chose it, you cannot change it)</th>
                <th>Salt</th>
                <th>What gets stored</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>
                    <code>{user.password}</code>
                  </td>
                  <td>
                    <input
                      className="ac-crypto__saltinput"
                      value={salts[user.id] || ""}
                      placeholder="a value for this account"
                      spellCheck={false}
                      onChange={(e) => {
                        setSalts((prev) => ({ ...prev, [user.id]: e.target.value }));
                        setResult(null);
                      }}
                      aria-label={`Salt for ${user.name}`}
                    />
                  </td>
                  <td>
                    <code className="ac-crypto__digest ac-crypto__digest--sm">
                      {shortHash(saltHashes[user.id] || "", 24)}
                    </code>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="ac-crypto__check">
            <button className="ac-crypto__btn" onClick={checkSalt}>
              Check the stored hashes
            </button>
            {result && (
              <p className={`ac-crypto__feedback ${result.ok ? "is-ok" : "is-bad"}`} role="status">
                {result.message}
              </p>
            )}
          </div>
        </>
      )}

      <p className="ac-crypto__real">
        <i className="fas fa-circle-info" aria-hidden="true" />
        These are real SHA-256 digests, computed by your browser. Run{" "}
        <code>echo -n &quot;password&quot; | sha256sum</code> on any machine and you will get the
        same number.
      </p>

      {note && <p className="ac-crypto__note">{note}</p>}
    </div>
  );
}
