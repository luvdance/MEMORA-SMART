import { useMemo, useRef, useState } from "react";
import {
  evaluateFormula,
  evaluateSheet,
  fillDown,
  formatValue,
  parseRef,
  toRef,
} from "../../../lib/academy/spreadsheet/engine";

/**
 * A WORKING SPREADSHEET
 *
 * The learner types a real formula into a real cell and sees a real result,
 * errors included. Reading about SUM and typing =SUM(B2:B6) are different
 * skills, and only one of them is the one being examined.
 *
 * It deliberately mirrors Excel's own behaviour:
 *   · the Name Box shows the selected address
 *   · the formula bar shows what the cell CONTAINS, while the grid shows
 *     what it DISPLAYS — the exact distinction lesson 6 teaches
 *   · numbers sit right, text sits left, so "numbers stored as text" is
 *     visible rather than described
 *   · errors read #DIV/0!, #NAME?, #VALUE!, #REF!
 *
 * When an `exercise` is supplied, the answer is checked against the expected
 * VALUE, not against the exact string typed, so =B2*C2 and =C2*B2 both pass.
 * An optional `mustUse` requires a particular function by name, because the
 * point of the SUM exercise is to use SUM and not to add six cells by hand.
 */
/** Feedback should read like a spreadsheet, not like a float. */
function format(value) {
  if (typeof value !== "number") return String(value);
  const rounded = Math.round(value * 100) / 100;
  return rounded.toLocaleString(undefined, { maximumFractionDigits: 2 });
}

export default function ExcelGrid({
  data = {},
  rows = 6,
  cols = 4,
  exercise = null,
  onSolved,
  readOnly = false,
  alreadySolved = false,
  formats = {},
  allowFill = false,
}) {
  const [cells, setCells] = useState(() => ({ ...data }));
  const [selected, setSelected] = useState(exercise?.target || "A1");
  const [editing, setEditing] = useState(null);
  const [draft, setDraft] = useState("");
  const [checked, setChecked] = useState(() =>
    alreadySolved && exercise
      ? { ok: true, message: "You already solved this. Change the cells freely to experiment." }
      : null
  );
  const inputRef = useRef(null);

  const [cellFormats, setCellFormats] = useState(() => ({ ...formats }));
  const values = useMemo(() => evaluateSheet(cells), [cells]);

  const colLetters = Array.from({ length: cols }, (_, i) => toRef({ col: i, row: 0 }).replace(/\d/g, ""));

  function startEdit(ref) {
    if (readOnly) return;
    if (exercise?.lockedCells?.includes(ref)) return;
    setSelected(ref);
    setEditing(ref);
    setDraft(cells[ref] === undefined || cells[ref] === null ? "" : String(cells[ref]));
    requestAnimationFrame(() => inputRef.current?.focus());
  }

  function commit() {
    if (editing === null) return;
    const raw = draft.trim();
    // Store numbers as numbers so alignment and SUM behave like Excel
    const isNumeric = raw !== "" && !raw.startsWith("=") && !Number.isNaN(Number(raw));
    setCells((prev) => ({ ...prev, [editing]: isNumeric ? Number(raw) : raw }));
    setEditing(null);
    setChecked(null);
  }

  function onKeyDown(event) {
    if (event.key === "Enter") {
      event.preventDefault();
      commit();
      const here = parseRef(selected);
      if (here && here.row + 1 < rows) setSelected(toRef({ col: here.col, row: here.row + 1 }));
    } else if (event.key === "Escape") {
      setEditing(null);
    } else if (event.key === "Tab") {
      event.preventDefault();
      commit();
      const here = parseRef(selected);
      if (here && here.col + 1 < cols) setSelected(toRef({ col: here.col + 1, row: here.row }));
    }
  }

  function check() {
    const target = exercise.target;
    const raw = cells[target];
    const typed = String(raw ?? "").trim();

    if (!typed) {
      return setChecked({ ok: false, message: `Cell ${target} is still empty.` });
    }

    if (exercise.mustUseFormula && !typed.startsWith("=")) {
      return setChecked({
        ok: false,
        message: `Start with = so Excel treats it as a formula, not text.`,
      });
    }

    if (exercise.mustUse) {
      const used = new RegExp(`\\b${exercise.mustUse}\\s*\\(`, "i").test(typed);
      if (!used) {
        return setChecked({
          ok: false,
          message: `That may give the right number, but this exercise is about ${exercise.mustUse}. Use the ${exercise.mustUse} function.`,
        });
      }
    }

    const expected = exercise.expected;
    const expectsError =
      typeof expected === "string" && expected.trim().startsWith("#");

    const result = evaluateFormula(typed, cells);

    if (!result.ok) {
      // Some exercises teach error codes, so the error IS the right answer.
      // Without this branch, a learner who types the requested formula and
      // correctly produces #DIV/0! would be told they were wrong.
      if (expectsError && result.error === expected.trim()) {
        setChecked({ ok: true, message: exercise.successMessage || "Correct." });
        onSolved?.();
        return;
      }
      return setChecked({
        ok: false,
        message: `Excel would show ${result.error} here. ${result.message || ""}`.trim(),
      });
    }

    if (expectsError) {
      return setChecked({
        ok: false,
        message: `That works out to ${format(result.value)}, but this exercise is about producing ${expected}. ${exercise.hint || ""}`.trim(),
      });
    }

    const matches =
      typeof expected === "number"
        ? Math.abs(Number(result.value) - expected) < 0.005
        : String(result.value).trim().toLowerCase() === String(expected).trim().toLowerCase();

    if (matches && exercise.mustFormat) {
      const applied = cellFormats[target];
      const wanted = exercise.mustFormat;
      const ok =
        wanted === "percent" ? String(applied).startsWith("percent") : applied === wanted;
      if (!ok) {
        return setChecked({
          ok: false,
          message: `The number is right. Now make the cell DISPLAY it that way: select ${target} and use the format button above.`,
        });
      }
    }

    if (matches) {
      setChecked({ ok: true, message: exercise.successMessage || "Correct." });
      onSolved?.();
    } else {
      setChecked({
        ok: false,
        message: `That returns ${format(result.value)}. ${exercise.hint || "Check which cells you included."}`,
      });
    }
  }

  const selectedRaw = cells[selected];

  return (
    <div className="ac-sheet-sim">
      {exercise && (
        <div className="ac-sheet-sim__task">
          <span className="ac-note__label">Your turn</span>
          <p>{exercise.task}</p>
        </div>
      )}

      {/* Name Box + formula bar, exactly as the lesson describes them */}
      <div className="ac-sheet-sim__bar">
        <span className="ac-sheet-sim__namebox">{selected}</span>
        <span className="ac-sheet-sim__fx">fx</span>
        <span className="ac-sheet-sim__formula">
          {selectedRaw === undefined || selectedRaw === null || selectedRaw === ""
            ? ""
            : String(selectedRaw)}
        </span>
      </div>

      <div className="ac-sheet-sim__scroll">
        <table className="ac-sheet-sim__grid">
          <thead>
            <tr>
              <th className="ac-sheet-sim__corner" />
              {colLetters.map((letter) => (
                <th key={letter} scope="col">
                  {letter}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: rows }, (_, r) => (
              <tr key={r}>
                <th scope="row" className="ac-sheet-sim__rownum">
                  {r + 1}
                </th>
                {Array.from({ length: cols }, (_, c) => {
                  const ref = toRef({ col: c, row: r });
                  const rawValue = values[ref];
                  const display = formatValue(rawValue, cellFormats[ref]);
                  const isFormula = typeof cells[ref] === "string" && cells[ref].startsWith("=");
                  const isError = typeof rawValue === "string" && rawValue.startsWith("#");
                  const isNumber = typeof rawValue === "number";
                  const locked = exercise?.lockedCells?.includes(ref);
                  const isTarget = exercise?.target === ref;

                  return (
                    <td
                      key={ref}
                      className={[
                        "ac-cell",
                        selected === ref ? "is-selected" : "",
                        isTarget ? "is-target" : "",
                        locked ? "is-locked" : "",
                        isNumber ? "is-number" : "",
                        isError ? "is-error" : "",
                        isFormula ? "has-formula" : "",
                      ].filter(Boolean).join(" ")}
                      onClick={() => {
                        setSelected(ref);
                        setEditing(null);
                      }}
                      onDoubleClick={() => startEdit(ref)}
                    >
                      {editing === ref ? (
                        <input
                          ref={inputRef}
                          value={draft}
                          onChange={(e) => setDraft(e.target.value)}
                          onBlur={commit}
                          onKeyDown={onKeyDown}
                          aria-label={`Cell ${ref}`}
                        />
                      ) : (
                        <span>{display}</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {!readOnly && allowFill && (
        <div className="ac-sheet-sim__tools">
          <button
            className="ac-sheet-sim__tool"
            onClick={() => {
              const here = parseRef(selected);
              if (!here) return;
              const last = toRef({ col: here.col, row: rows - 1 });
              const filled = fillDown(cells, selected, last);
              if (Object.keys(filled).length === 0) return;
              setCells((prev) => ({ ...prev, ...filled }));
              setChecked(null);
            }}
            title="Copy this cell down the rest of the column, as the fill handle does"
          >
            <i className="fas fa-arrow-down" aria-hidden="true" />
            Fill down from {selected}
          </button>

          <button
            className="ac-sheet-sim__tool"
            onClick={() =>
              setCellFormats((prev) => ({
                ...prev,
                [selected]: prev[selected] === "percent1" ? "general" : "percent1",
              }))
            }
            title="Format this cell as a percentage"
          >
            <i className="fas fa-percent" aria-hidden="true" />
            Format as %
          </button>

          <button
            className="ac-sheet-sim__tool"
            onClick={() =>
              setCellFormats((prev) => ({
                ...prev,
                [selected]: prev[selected] === "currency" ? "general" : "currency",
              }))
            }
            title="Format this cell as Nigerian naira"
          >
            <i className="fas fa-naira-sign" aria-hidden="true" />
            Format as ₦
          </button>
        </div>
      )}

      {!readOnly && (
        <p className="ac-sheet-sim__hint">
          Double-click a cell to type in it. Press Enter to confirm, Escape to
          cancel.
        </p>
      )}

      {exercise && (
        <div className="ac-sheet-sim__actions">
          <button className="ac-btn ac-btn--primary" onClick={check}>
            Check my answer
          </button>
          {checked && (
            <p className={`ac-sheet-sim__result ${checked.ok ? "is-ok" : "is-no"}`}>
              <i
                className={checked.ok ? "fas fa-circle-check" : "fas fa-circle-info"}
                aria-hidden="true"
              />
              {checked.message}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
