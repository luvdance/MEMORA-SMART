// ── MOBILE APP SHELL ──
// Top app bar, bottom tab bar and the preview header used on phones
// (≤900px). Desktop keeps CVNavbar and the side-by-side layout.

const STATUS = {
  new: { text: "Not saved yet", icon: "fa-mobile-screen", tone: "muted" },
  dirty: { text: "Unsaved changes", icon: "fa-circle", tone: "warn" },
  saving: { text: "Saving…", icon: "fa-circle-notch fa-spin", tone: "muted" },
  saved: { text: "All changes saved", icon: "fa-circle-check", tone: "ok" },
  error: { text: "Couldn't save", icon: "fa-triangle-exclamation", tone: "bad" },
};
const SAVE_BTN = {
  new: { label: "Save", icon: "fa-cloud-arrow-up" },
  dirty: { label: "Save", icon: "fa-cloud-arrow-up" },
  saving: { label: "Saving", icon: "fa-circle-notch fa-spin" },
  saved: { label: "Saved", icon: "fa-circle-check" },
  error: { label: "Retry", icon: "fa-rotate-right" },
};

// saveState: "new" | "dirty" | "saving" | "saved" | "error" (see CVBuilder.jsx)
export function MobileAppBar({ cv, saveState = "new", saving, onSave, onHome, user, entitlement, onPlan, adminMode }) {
  const title = cv.name ? `${cv.name.trim().split(/\s+/)[0]}'s CV` : "My CV";
  const status = adminMode && saveState !== "saving" && saveState !== "error"
    ? { text: saveState === "saved" ? "Admin · changes saved" : "Admin editing", icon: "fa-user-shield", tone: saveState === "saved" ? "ok" : "muted" }
    : STATUS[saveState] || STATUS.new;
  const btn = SAVE_BTN[saveState] || SAVE_BTN.new;

  return (
    <header className="mapp-bar">
      <button className="mapp-bar__icon" onClick={onHome} aria-label={adminMode ? "Back to admin" : "Back to dashboard"}>
        <i className="fas fa-chevron-left"></i>
      </button>

      <div className="mapp-bar__title">
        <strong>{title}</strong>
        <span className={`mapp-bar__status mapp-bar__status--${status.tone}`}>
          <i className={`fas ${status.icon}`}></i> {status.text}
        </span>
      </div>

      {user && entitlement && !adminMode && (
        <button
          className={`mapp-pill ${entitlement.premium ? "mapp-pill--pro" : entitlement.free.remaining === 0 ? "mapp-pill--empty" : ""}`}
          onClick={onPlan}
          aria-label={entitlement.premium ? "Your Premium plan" : `${entitlement.free.remaining} free downloads left today`}
        >
          {entitlement.premium
            ? <><i className="fas fa-crown"></i> PRO</>
            : <><i className="fas fa-arrow-down"></i> {entitlement.free.remaining} left</>}
        </button>
      )}

      <button
        className={`mapp-save mapp-save--${saveState}`}
        onClick={onSave}
        disabled={saving}
        aria-label={saveState === "saved" ? "Saved" : "Save CV"}
      >
        <i className={`fas ${btn.icon}`}></i>
        <span>{btn.label}</span>
        {saveState === "dirty" && <span className="mapp-save__dot" aria-hidden="true" />}
      </button>
    </header>
  );
}

const TABS = [
  { id: "form", label: "Edit", icon: "fa-pen-to-square" },
  { id: "design", label: "Design", icon: "fa-palette" },
  { id: "download", label: "Download", icon: "fa-file-arrow-down", primary: true },
  { id: "preview", label: "Preview", icon: "fa-eye" },
  { id: "more", label: "More", icon: "fa-grip" },
];

export function MobileTabBar({ tab, setTab, onDownload, pdfLoading, onMore, moreOpen }) {
  return (
    <nav className="mapp-tabs" aria-label="CV builder">
      {TABS.map((t) => {
        if (t.primary) {
          return (
            <button key={t.id} className="mapp-tabs__fab-wrap" onClick={onDownload} disabled={pdfLoading} aria-label="Download PDF">
              <span className="mapp-tabs__fab">
                <i className={`fas ${pdfLoading ? "fa-circle-notch fa-spin" : t.icon}`}></i>
              </span>
              <span className="mapp-tabs__label">{pdfLoading ? "Preparing" : t.label}</span>
            </button>
          );
        }
        const active = t.id === "more" ? moreOpen : tab === t.id && !moreOpen;
        return (
          <button
            key={t.id}
            className={`mapp-tabs__item ${active ? "mapp-tabs__item--active" : ""}`}
            onClick={() => (t.id === "more" ? onMore() : setTab(t.id))}
            aria-current={active ? "page" : undefined}
          >
            <span className="mapp-tabs__icon"><i className={`fas ${t.icon}`}></i></span>
            <span className="mapp-tabs__label">{t.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

export function MobilePreviewBar({ templateName, locked, onChange }) {
  return (
    <div className="mapp-previewbar">
      <span className="mapp-previewbar__name">
        <i className="fas fa-file-lines"></i> {templateName}
        {locked && <span className="mapp-tag mapp-tag--gold"><i className="fas fa-crown"></i> Premium</span>}
      </span>
      <button className="mapp-previewbar__btn" onClick={onChange}>
        <i className="fas fa-palette"></i> Change design
      </button>
    </div>
  );
}
