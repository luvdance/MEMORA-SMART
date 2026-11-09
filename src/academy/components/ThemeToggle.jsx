import { useAcademyTheme } from "../theme";

/**
 * The quick switch: one press flips light ⇄ dark. The icon is a sun that
 * eclipses into a moon (pure CSS, so it costs nothing to load), and the new
 * theme grows out of the button as a circle (theme.js).
 */
export function ThemeToggle({ className = "" }) {
  const { theme, setTheme } = useAcademyTheme();
  const dark = theme === "dark";
  return (
    <button
      type="button"
      className={`ac-theme-btn ${dark ? "is-dark" : ""} ${className}`}
      onClick={(e) => setTheme(dark ? "light" : "dark", e.currentTarget)}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      title={dark ? "Light mode" : "Dark mode"}
    >
      <span className="ac-theme-btn__icon" aria-hidden="true">
        <span className="ac-theme-btn__rays" />
        <span className="ac-theme-btn__orb" />
      </span>
    </button>
  );
}

const OPTIONS = [
  { value: "light", label: "Light", icon: "fas fa-sun" },
  { value: "dark", label: "Dark", icon: "fas fa-moon" },
  { value: "system", label: "Auto", icon: "fas fa-circle-half-stroke" },
];

/**
 * The full choice, including "Auto" (follow the device), for the account menu
 * and the mobile sheet. A radio group, so arrow keys and screen readers work.
 */
export function ThemeChoice() {
  const { choice, setTheme } = useAcademyTheme();
  return (
    <div className="ac-theme-choice" role="radiogroup" aria-label="Appearance">
      {OPTIONS.map((o) => (
        <button
          key={o.value}
          type="button"
          role="radio"
          aria-checked={choice === o.value}
          className={`ac-theme-choice__opt ${choice === o.value ? "is-on" : ""}`}
          onClick={(e) => setTheme(o.value, e.currentTarget)}
        >
          <i className={o.icon} aria-hidden="true" />
          {o.label}
        </button>
      ))}
    </div>
  );
}
