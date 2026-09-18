import { useState } from "react";

/**
 * THE CERTIFICATE CARD
 *
 * Shows the certificate a student has earned, with the download control.
 *
 * VISIBILITY RULE — the whole point of this component
 * It renders the certificate ONLY when a real certificate document exists.
 * That document is written by the server, and only after the server has
 * graded a passing exam (lib/academy/finalExam/record.js), so there is no
 * path by which this card can appear to someone who has not passed. It is not
 * gated on lesson progress, an XP level or a client-side flag — any of those
 * could be wrong or forged. A certificate exists or it does not.
 *
 * Once it exists it is permanent and always downloadable: passing is not a
 * moment the student can miss.
 *
 * ── WHERE THE PDF GENERATOR GOES ─────────────────────────────────────────
 * `onDownload` is the slot. Pass a function that receives the certificate
 * object and produces the file; this component owns the button, its pending
 * and error states, and the disabled case, so the generator only has to
 * generate.
 *
 * The certificate object it receives carries everything a document needs:
 *
 *   id            "MST-CERT-2026-000042"   the certificate number
 *   courseId      "data-analysis"          which course was completed
 *   courseTitle   "Data Analysis"          as it should be printed
 *   name          the credential's full name
 *   issuer        "Memora Smart Technologies"
 *   covers        "Microsoft Excel • Power BI • Python"
 *   holderName    the student's name, snapshotted at issue
 *   holderEmail   their email, snapshotted at issue
 *   memoraId      "MS-2026-000123"
 *   score         the passing score
 *   domainScores  [{ id, score }] per section
 *   issuedAt      Firestore timestamp
 *   examId        / examVersion — which paper version was sat
 *
 * A generator may be async and may throw; both are handled. Until one is
 * passed the button explains that downloading is coming rather than
 * pretending to work, because a dead download button is worse than none.
 */
export default function CertificateCard({ certificate, onDownload }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  if (!certificate) return null;

  const issued = certificate.issuedAt?.toDate
    ? certificate.issuedAt.toDate()
    : certificate.issuedAt
    ? new Date(certificate.issuedAt)
    : null;

  const download = async () => {
    if (!onDownload || busy) return;
    setBusy(true);
    setError(null);
    try {
      await onDownload(certificate);
    } catch (err) {
      setError(err?.message || "The download could not be produced.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="ac-cert">
      <div className="ac-cert__head">
        <i className="fas fa-award" aria-hidden="true" />
        <div>
          <strong>{certificate.name}</strong>
          <p>
            {certificate.covers} · issued by {certificate.issuer}
          </p>
        </div>
      </div>

      <dl className="ac-cert__meta">
        <div>
          <dt>Certificate number</dt>
          <dd className="ac-mono">{certificate.id}</dd>
        </div>
        <div>
          <dt>Course</dt>
          <dd>{certificate.courseTitle || certificate.courseId}</dd>
        </div>
        {typeof certificate.score === "number" && (
          <div>
            <dt>Result</dt>
            <dd>Passed at {certificate.score}%</dd>
          </div>
        )}
        {issued && (
          <div>
            <dt>Issued</dt>
            <dd>{issued.toLocaleDateString()}</dd>
          </div>
        )}
        {certificate.holderName && (
          <div>
            <dt>Awarded to</dt>
            <dd>{certificate.holderName}</dd>
          </div>
        )}
        {certificate.memoraId && (
          <div>
            <dt>Memora ID</dt>
            <dd className="ac-mono">{certificate.memoraId}</dd>
          </div>
        )}
      </dl>

      {certificate.revoked ? (
        <p className="ac-cert__revoked">
          This certificate has been withdrawn. Contact support if you believe
          that is an error.
        </p>
      ) : (
        <div className="ac-cert__actions">
          <button
            type="button"
            className="ac-btn ac-btn--primary"
            onClick={download}
            disabled={!onDownload || busy}
          >
            <i className="fas fa-download" aria-hidden="true" />
            {busy ? "Preparing…" : "Download certificate"}
          </button>
          {!onDownload && (
            <p className="ac-cert__pending">
              Download is being finished — your certificate is already issued
              and recorded, and the number above is permanent.
            </p>
          )}
          {error && (
            <p className="ac-cert__error" role="alert">
              {error}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
