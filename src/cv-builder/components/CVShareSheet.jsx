import { useState } from "react";
import { track } from "../../utils/analytics";
import "./CVShareSheet.css";

/**
 * "Your CV is ready to send." Opened by CVBuilder only after the server has
 * counted the share as a download (same plan check, allowance and Premium
 * template rule as Download and Print), so sharing is never a way round them.
 *
 * Browsers only open the share menu straight from a tap, and the server check
 * plus building the PDF take longer than that tap stays valid. So the PDF is
 * made first and this sheet asks for one more tap.
 *
 * `ready`: { file: File, url: string (object URL), name: string }
 */
const sizeText = (bytes) => (bytes < 1024 ? "Under 1 KB"
  : bytes < 1024 * 1024 ? `${Math.round(bytes / 1024)} KB`
  : `${(bytes / (1024 * 1024)).toFixed(1)} MB`);

export default function CVShareSheet({ ready, personName, onClose }) {
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  const canSendFile = typeof navigator !== "undefined"
    && typeof navigator.canShare === "function"
    && navigator.canShare({ files: [ready.file] });

  const message = personName
    ? `Hello, please find the CV of ${personName} attached.`
    : "Hello, please find my CV attached.";

  const sendFile = async () => {
    setError("");
    try {
      await navigator.share({ files: [ready.file], title: ready.name, text: message });
      track("cv_shared", { method: "native" });
      onClose();
    } catch (err) {
      // Closing the share menu is not an error.
      if (err?.name === "AbortError") return;
      setError("Your device could not open the share menu. Save the PDF and attach it instead.");
    }
  };

  const savePdf = () => {
    const a = document.createElement("a");
    a.href = ready.url;
    a.download = ready.name;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setSaved(true);
    track("cv_shared", { method: "save" });
  };

  const openWhatsApp = () => {
    track("cv_shared", { method: "whatsapp" });
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank", "noopener");
  };

  const openEmail = () => {
    track("cv_shared", { method: "email" });
    const subject = personName ? `CV of ${personName}` : "My CV";
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
  };

  return (
    <div className="cvs__backdrop" onClick={onClose}>
      <div className="cvs" role="dialog" aria-modal="true" aria-labelledby="cvs-title" onClick={(e) => e.stopPropagation()}>
        <div className="cvs__file">
          <span className="cvs__file-badge">PDF</span>
          <div className="cvs__file-text">
            <strong>{ready.name}</strong>
            <span>{sizeText(ready.file.size)}</span>
          </div>
        </div>

        <h3 id="cvs-title">Your CV is ready to send</h3>

        {canSendFile ? (
          <>
            <p>Choose WhatsApp, email or any other app. The PDF is attached for you.</p>
            <button type="button" className="cvs__primary" onClick={sendFile}>
              Send PDF
            </button>
            <button type="button" className="cvs__secondary" onClick={savePdf}>
              {saved ? "Saved to your device" : "Save PDF instead"}
            </button>
          </>
        ) : (
          <>
            <p>
              This browser cannot attach files for you. Save the PDF first, then attach it in WhatsApp or your email.
            </p>
            <button type="button" className="cvs__primary" onClick={savePdf}>
              {saved ? "Saved. Save again" : "1. Save PDF"}
            </button>
            <div className="cvs__apps">
              <button type="button" className="cvs__app" onClick={openWhatsApp}>
                <i className="fab fa-whatsapp" aria-hidden="true"></i> 2. Open WhatsApp
              </button>
              <button type="button" className="cvs__app" onClick={openEmail}>
                <i className="fas fa-envelope" aria-hidden="true"></i> 2. Open email
              </button>
            </div>
          </>
        )}

        {error && <p className="cvs__error" role="alert">{error}</p>}

        <button type="button" className="cvs__close" onClick={onClose}>Close</button>
      </div>
    </div>
  );
}
