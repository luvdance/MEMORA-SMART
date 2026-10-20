import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Keystroke capture through a hidden input.
 *
 * A focused <input> rather than a window listener, for three reasons:
 *   - mobile browsers only raise the on-screen keyboard for a real input;
 *   - Android reports most keys as "Unidentified" on keydown, so the
 *     character has to be read from the `input` event instead;
 *   - focus is visible state, so the drill can say "click to continue"
 *     instead of silently dropping keys after the learner clicks elsewhere.
 *
 * Desktop keys are handled on keydown and their default prevented, so the
 * input never fills and the `input` path only ever sees mobile text.
 * Shortcuts (Ctrl/Cmd/Alt) pass through untouched.
 */
export default function useKeyCapture(onKey, { active = true } = {}) {
  const ref = useRef(null);
  const cb = useRef(onKey);
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    cb.current = onKey;
  });

  const focus = useCallback(() => ref.current?.focus({ preventScroll: true }), []);

  useEffect(() => {
    if (active) focus();
  }, [active, focus]);

  const onKeyDown = (e) => {
    if (!active) return;
    const altGr = e.getModifierState?.("AltGraph");
    if (e.ctrlKey || e.metaKey || (e.altKey && !altGr)) return;
    if (e.isComposing || e.keyCode === 229) return;
    let k = e.key;
    if (k === "Enter") k = "\n";
    if (k === "Escape" || k === "Backspace" || k === "\n" || k.length === 1) {
      e.preventDefault();
      // Holding a key down is not typing it again.
      if (e.repeat && k !== "Backspace") return;
      cb.current(k, e.code);
    }
  };

  const onInput = (e) => {
    const value = e.target.value;
    e.target.value = "";
    if (!active) return;
    for (const ch of value) cb.current(ch, null);
  };

  return {
    focused,
    focus,
    inputProps: {
      ref,
      onKeyDown,
      onInput,
      onFocus: () => setFocused(true),
      onBlur: () => setFocused(false),
      autoCapitalize: "off",
      autoCorrect: "off",
      autoComplete: "off",
      spellCheck: false,
      "aria-label": "Typing input. Type the text shown.",
      className: "ty-capture",
    },
  };
}
