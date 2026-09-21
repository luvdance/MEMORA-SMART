import { useState } from "react";
import {
  CONSENT,
  ONBOARDING_FIELDS,
  UNDER_18,
  validateProfile,
} from "../data/onboarding";

/**
 * THE ONBOARDING FORM
 *
 * Shown between pressing Start course and being enrolled, and again from the
 * student profile whenever a learner wants to change what is stored.
 *
 * HOW THIS IS BUILT, AND WHY IT LOOKS UNLIKE MOST SIGNUP FORMS
 *
 *   EVERY QUESTION SAYS WHY IT IS ASKED, next to the question, in words a
 *   learner can check. Not in a privacy policy nobody opens. A platform that
 *   wants honest answers has to explain what it wants them for, and a field
 *   whose purpose cannot be stated plainly should not be on the form.
 *
 *   TWO REQUIRED FIELDS, and the rest are marked Optional on their face. The
 *   temptation with an onboarding form is to make everything required
 *   because the data is useful; that produces either abandonment or invented
 *   answers, and invented answers are worse than missing ones for the
 *   analysis this exists to support.
 *
 *   CONSENT IS SEPARATE FROM ENROLMENT. Declining still enrols you. Consent
 *   that is the price of the product is not consent.
 *
 *   SKIPPABLE. "I will do this later" is offered, because blocking a learner
 *   from the course they came for, over demographics, is the wrong trade.
 *   They are asked again next time.
 *
 * ONE FIELD IS NOT ANALYTICS: the age band decides whether private messaging
 * is on. Choosing Under 18 says so immediately, on the form, rather than
 * silently switching something off later.
 */
export default function OnboardingForm({
  email,
  displayName,
  onSubmit,
  onSkip,
  busy = false,
  error = null,
  /**
   * Edit mode. The same form, seeded with what is already stored.
   *
   * This exists because the chat gate told a learner to "complete your
   * profile" and there was nowhere to do it: saveProfile was reachable only
   * from the enrolment page, and an enrolled learner never returns there.
   * Anyone who skipped the form, or enrolled before it existed, was stuck
   * with messaging off and no way out. Reusing this component rather than
   * writing a second editor keeps one set of fields, one validation rule and
   * one set of purpose statements.
   */
  mode = "onboarding",
  initialValues = null,
  initialConsent = false,
}) {
  const editing = mode === "edit";
  const [values, setValues] = useState(
    initialValues ? { interests: [], ...initialValues } : { interests: [] }
  );
  const [consent, setConsent] = useState(Boolean(initialConsent));
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState(false);

  const set = (id, value) => {
    setValues((prev) => ({ ...prev, [id]: value }));
    if (touched) setErrors(validateProfile({ ...values, [id]: value }));
  };

  const toggleMulti = (id, option) => {
    const current = values[id] || [];
    const next = current.includes(option)
      ? current.filter((v) => v !== option)
      : [...current, option];
    set(id, next);
  };

  const submit = (e) => {
    e.preventDefault();
    setTouched(true);
    const found = validateProfile(values);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      // Move focus to the first problem rather than leaving them to hunt.
      const first = ONBOARDING_FIELDS.find((f) => found[f.id]);
      if (first) document.getElementById(`ob-${first.id}`)?.focus();
      return;
    }
    onSubmit({ ...values, analyticsConsent: consent });
  };

  const isMinor = values.ageBand === UNDER_18;

  return (
    <form className="ac-ob" onSubmit={submit} noValidate>
      <header className="ac-ob__head">
        <span className="ac-kicker">
          <i className="fas fa-id-card" aria-hidden="true" />
          {editing ? "Your details" : "One last thing"}
        </span>
        <h1 className="ac-h2">
          {editing ? "Update your details" : "Tell us who we are teaching"}
        </h1>
        <p className="ac-body">
          {editing
            ? "Change anything here and save. Your age band is the one that decides whether private messaging is available on your account."
            : "Two questions we need, and a few that help us build the right thing. Every one says what it is for. You can skip the rest and get straight to your course."}
        </p>
      </header>

      {/* What we already know, shown rather than silently held. */}
      <div className="ac-ob__known">
        <div>
          <span>Name</span>
          <strong>{displayName || "—"}</strong>
        </div>
        <div>
          <span>Email</span>
          <strong>{email || "—"}</strong>
        </div>
        <p>From your account. Change these on your profile at any time.</p>
      </div>

      <div className="ac-ob__fields">
        {ONBOARDING_FIELDS.map((field) => {
          const invalid = Boolean(errors[field.id]);
          const id = `ob-${field.id}`;

          return (
            <div
              key={field.id}
              className={`ac-ob__field ${invalid ? "is-invalid" : ""}`}
            >
              <label htmlFor={id}>
                {field.label}
                {field.required ? (
                  <em className="ac-ob__req">Needed</em>
                ) : (
                  <em className="ac-ob__opt">Optional</em>
                )}
              </label>

              {/* The purpose, next to the question rather than in a policy. */}
              <p className="ac-ob__why">{field.why}</p>

              {field.type === "select" && (
                <select
                  id={id}
                  value={values[field.id] || ""}
                  onChange={(e) => set(field.id, e.target.value)}
                >
                  <option value="">Choose…</option>
                  {field.options.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              )}

              {field.type === "multi" && (
                <div className="ac-ob__chips" id={id}>
                  {field.options.map((o) => {
                    const on = (values[field.id] || []).includes(o.value);
                    return (
                      <button
                        key={o.value}
                        type="button"
                        className={`ac-ob__chip ${on ? "is-on" : ""}`}
                        aria-pressed={on}
                        onClick={() => toggleMulti(field.id, o.value)}
                      >
                        {o.label}
                      </button>
                    );
                  })}
                </div>
              )}

              {field.type === "textarea" && (
                <textarea
                  id={id}
                  rows={3}
                  maxLength={field.maxLength}
                  placeholder={field.placeholder}
                  value={values[field.id] || ""}
                  onChange={(e) => set(field.id, e.target.value)}
                />
              )}

              {(field.type === "tel" || field.type === "text") && (
                <input
                  id={id}
                  type={field.type}
                  inputMode={field.type === "tel" ? "tel" : undefined}
                  autoComplete={field.type === "tel" ? "tel" : undefined}
                  /* maxLength was only wired to the textarea, so a username
                     could be typed past its limit and only fail on submit. */
                  maxLength={field.maxLength}
                  /* A phone keypad capitalises nothing, but a text field on a
                     phone capitalises the first letter and autocorrects — so
                     a typed username arrived as "Ada_codes" or worse. */
                  autoCapitalize={field.type === "text" ? "none" : undefined}
                  autoCorrect={field.type === "text" ? "off" : undefined}
                  spellCheck={field.type === "text" ? false : undefined}
                  placeholder={field.placeholder}
                  value={values[field.id] || ""}
                  onChange={(e) => set(field.id, e.target.value)}
                />
              )}

              {invalid && (
                <p className="ac-ob__error" role="alert">
                  {errors[field.id]}
                </p>
              )}

              {/* Say it now, on the form, not silently later. */}
              {field.id === "ageBand" && isMinor && (
                <p className="ac-ob__notice">
                  <i className="fas fa-shield-halved" aria-hidden="true" />
                  Private messaging will be off on your account. Those messages
                  are encrypted so nobody — including us — can read or moderate
                  them, which is not a safe default for under-18s. Everything
                  else works normally.
                </p>
              )}
            </div>
          );
        })}
      </div>

      <label className="ac-ob__consent">
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
        />
        <span>
          <strong>{CONSENT.label}</strong>
          <em>{CONSENT.detail}</em>
        </span>
      </label>

      {error && (
        <p className="ac-ob__error" role="alert">
          {error}
        </p>
      )}

      <div className="ac-ob__actions">
        <button type="submit" className="ac-btn ac-btn--primary ac-btn--lg" disabled={busy}>
          {busy ? "Saving…" : editing ? "Save changes" : "Save and start"}
          {!busy && !editing && <i className="fas fa-arrow-right" aria-hidden="true" />}
        </button>
        <button
          type="button"
          className="ac-btn ac-btn--ghost"
          onClick={onSkip}
          disabled={busy}
        >
          {editing ? "Cancel" : "I will do this later"}
        </button>
      </div>

      <p className="ac-ob__legal">
        You can see, correct or delete any of this from your profile. We keep
        it while your account is open and no longer.
      </p>
    </form>
  );
}
