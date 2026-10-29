import { describeEntitlement, formatResetIn, PLANS } from "../../utils/plans";

// ── MOBILE "MORE" SHEET ──
// Plan status up top, then every secondary action as a tile.
export default function MobileMoreSheet({ open, onClose, user, entitlement, isOwner, adminMode, actions }) {
  const run = (fn) => () => {
    onClose();
    // Let the sheet slide away before opening the next layer.
    setTimeout(fn, 250);
  };

  const tiles = [
    { label: "ATS score", icon: "fa-gauge-high", tone: "green", onClick: actions.ats, premium: true },
    { label: "AI rewrite", icon: "fa-wand-magic-sparkles", tone: "violet", onClick: actions.ats, premium: true },
    { label: "Print", icon: "fa-print", tone: "blue", onClick: actions.print },
    { label: "Share link", icon: "fa-share-nodes", tone: "teal", onClick: actions.share },
    { label: "Save", icon: "fa-cloud-arrow-up", tone: "amber", onClick: actions.save },
    ...(adminMode
      ? [{ label: "Back to admin", icon: "fa-user-shield", tone: "slate", onClick: actions.admin }]
      : [
          { label: "My CVs", icon: "fa-folder-open", tone: "orange", onClick: actions.works },
          { label: "Payments", icon: "fa-receipt", tone: "slate", onClick: actions.payments },
          { label: "Dashboard", icon: "fa-house", tone: "blue", onClick: actions.dashboard },
        ]),
  ];

  const plan = entitlement ? describeEntitlement(entitlement) : null;

  return (
    <>
      <div className={`mapp-sheet-backdrop ${open ? "mapp-sheet-backdrop--open" : ""}`} onClick={onClose} />
      <div className={`mapp-sheet ${open ? "mapp-sheet--open" : ""}`} role="dialog" aria-modal="true" aria-label="More options" aria-hidden={!open}>
        <div className="mapp-sheet__handle" />

        {user && entitlement && !adminMode && (
          entitlement.premium ? (
            <div className="mapp-plan mapp-plan--pro">
              <span className="mapp-plan__icon"><i className="fas fa-crown"></i></span>
              <div className="mapp-plan__text">
                <strong>{plan.label}</strong>
                <span>{plan.sub}</span>
              </div>
              <button className="mapp-plan__link" onClick={run(actions.payments)}>Manage</button>
            </div>
          ) : (
            <div className="mapp-plan">
              <div className="mapp-plan__row">
                <span className="mapp-plan__icon mapp-plan__icon--free"><i className="fas fa-gift"></i></span>
                <div className="mapp-plan__text">
                  <strong>Free plan</strong>
                  <span>
                    {entitlement.free.used} of {entitlement.free.limit} downloads used today
                    {entitlement.free.resetsAt ? ` · resets ${formatResetIn(entitlement.free.resetsAt)}` : ""}
                  </span>
                </div>
              </div>
              <div className="mapp-plan__meter" aria-hidden="true">
                {Array.from({ length: entitlement.free.limit }).map((_, i) => (
                  <span key={i} className={i < entitlement.free.used ? "mapp-plan__dot--used" : ""} />
                ))}
              </div>
              <button className="mapp-plan__cta" onClick={run(actions.upgrade)}>
                <i className="fas fa-crown"></i> Go Premium · from {PLANS.monthly.priceLabel}/mo
              </button>
            </div>
          )
        )}

        {!user && (
          <div className="mapp-plan">
            <div className="mapp-plan__row">
              <span className="mapp-plan__icon mapp-plan__icon--free"><i className="fas fa-user-plus"></i></span>
              <div className="mapp-plan__text">
                <strong>Save your CV to your account</strong>
                <span>Free account · 5 downloads every day</span>
              </div>
            </div>
            <button className="mapp-plan__cta" onClick={run(actions.signIn)}>Sign in or create account</button>
          </div>
        )}

        <div className="mapp-tiles">
          {tiles.map((t) => (
            <button key={t.label} className="mapp-tile" onClick={run(t.onClick)}>
              <span className={`mapp-tile__icon mapp-tone--${t.tone}`}>
                <i className={`fas ${t.icon}`}></i>
                {t.premium && !entitlement?.premium && <span className="mapp-tile__crown"><i className="fas fa-crown"></i></span>}
              </span>
              <span className="mapp-tile__label">{t.label}</span>
            </button>
          ))}
        </div>

        {isOwner && !adminMode && (
          <button className="mapp-sheet__danger" onClick={run(actions.clear)}>
            <i className="fas fa-eraser"></i> Clear CV and start over
          </button>
        )}
      </div>
    </>
  );
}
