import { useRef } from "react";
import { applyCasingByField, toTitleCase, toSentenceCase, toUrlFormat, toLowerCase } from "./textCasing";

/**
 * Hook that returns an `onBlur` handler for inputs/textareas.
 *
 * Usage:
 *   const handleBlur = useAutoCasing();
 *   <input onBlur={handleBlur(value, setValue, "title")} />
 *
 * Or with explicit casing type:
 *   <input onBlur={handleBlur(value, setValue, "name", "title")} />
 *
 * Casing types: "title" | "sentence" | "url" | "lower" | "auto"
 */
export function useAutoCasing() {
  // Track which fields have already been "blurred once" to avoid forcing on re-edits
  const touchedFields = useRef(new Set());

  return function createBlurHandler(currentValue, setter, fieldKey, casingType = "auto") {
    return () => {
      if (!currentValue) return;

      // If user has already blurred this field once, don't auto-format again
      // (lets them deliberately type lowercase like "iPhone" without it being overridden)
      if (touchedFields.current.has(fieldKey)) return;
      touchedFields.current.add(fieldKey);

      let formatted;
      switch (casingType) {
        case "title":
          formatted = toTitleCase(currentValue);
          break;
        case "sentence":
          formatted = toSentenceCase(currentValue);
          break;
        case "url":
          formatted = toUrlFormat(currentValue);
          break;
        case "lower":
          formatted = toLowerCase(currentValue);
          break;
        case "auto":
        default:
          formatted = applyCasingByField(fieldKey, currentValue);
      }

      // Only update if the formatted value is different
      if (formatted !== currentValue) {
        setter(formatted);
      }
    };
  };
}