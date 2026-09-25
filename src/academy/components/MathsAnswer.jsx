/**
 * TYPING A MATHEMATICAL ANSWER
 *
 * Almost every item in this course takes a typed answer rather than a choice
 * from four options, because recognising 3/4 among four options is not the
 * skill of producing 3/4 — and producing it is what every real use of
 * mathematics, and every WAEC Paper 2 question, actually asks for.
 *
 * That puts the burden on the input: it has to make typing a fraction, a
 * negative, or a list as easy on a phone as it is on paper. Hence the
 * inputMode hints, the worked placeholder text, and the small keypad of the
 * characters that are awkward to reach on a phone keyboard.
 *
 * The component never marks anything. It collects a string and hands it over.
 */
export default function AnswerBox({
  input = { kind: "number" },
  value,
  onChange,
  onSubmit,
  disabled,
  autoFocus,
  status, // null | "correct" | "wrong"
  id,
}) {
  const kind = input.kind || "number";

  if (kind === "choice" && Array.isArray(input.options)) {
    return (
      <div className="ac-mx-choices" role="radiogroup">
        {input.options.map((option) => (
          <label key={option} className={`ac-mx-choice ${value === option ? "is-picked" : ""}`}>
            <input
              type="radio"
              name={id}
              checked={value === option}
              disabled={disabled}
              onChange={() => onChange(option)}
            />
            <span>{option}</span>
          </label>
        ))}
      </div>
    );
  }

  const placeholder =
    input.placeholder ||
    { number: "your answer", fraction: "e.g. 3/4", list: "separate with commas", ratio: "e.g. 3:4", expression: "e.g. 2x + 6", text: "your answer" }[kind];

  // A plain text keyboard for anything that can contain a slash, a letter or a
  // comma. `inputMode="decimal"` on a phone hides the very keys those answers
  // need, which is a small detail that makes a fraction genuinely hard to type.
  const inputMode = kind === "number" ? "decimal" : "text";

  return (
    <div className={`ac-mx-answer ${status ? `is-${status}` : ""}`}>
      <input
        id={id}
        type="text"
        inputMode={inputMode}
        autoComplete="off"
        autoCorrect="off"
        spellCheck="false"
        placeholder={placeholder}
        value={value ?? ""}
        disabled={disabled}
        autoFocus={autoFocus}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && onSubmit) onSubmit();
        }}
        aria-label={`Answer${input.unit ? ` in ${input.unit}` : ""}`}
      />
      {input.unit && <span className="ac-mx-answer__unit">{input.unit}</span>}

      {/* The characters a phone keyboard buries. Not a calculator — this
          course is not going to type the answer for anybody. */}
      {kind !== "text" && kind !== "number" && (
        <div className="ac-mx-keys">
          {["/", "-", ".", ",", ":"].map((key) => (
            <button
              key={key}
              type="button"
              tabIndex={-1}
              disabled={disabled}
              onClick={() => onChange(`${value ?? ""}${key}`)}
              aria-label={`Insert ${key}`}
            >
              {key}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
