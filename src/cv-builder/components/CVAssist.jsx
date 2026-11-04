// ── QUICK EDIT BAR ──
// Type a change ("my phone is now 0803…", "add my GTBank role since 2021"),
// paste details, or attach a passport photo or an old CV, and the builder
// fills itself in. A photo is applied locally (no server call); everything
// else goes to /api/cv/assist, which returns only the fields it changed.
import { useEffect, useRef, useState } from "react";
import { cvApi } from "../utils/cvAccess";
import { compactCV, applyAssistPatch, extractDocumentText, labelFor } from "../utils/cvAssist";
import { compressImage, readFileAsDataURL } from "../utils/imageCompress";
import { templateUsesPhoto } from "../utils/templateMeta";
import { track } from "../../utils/analytics";
import "./CVAssist.css";

const IMAGE_EXT = ["jpg", "jpeg", "png", "webp", "heic", "heif"];

export default function CVAssist({ cv, setCV, template, user, onRequireAuth }) {
  const [text, setText] = useState("");
  const [doc, setDoc] = useState(null); // { name, text }
  const [busy, setBusy] = useState(""); // status text while working
  const [result, setResult] = useState(null); // { note, changed, before, after, tone }
  const [previous, setPrevious] = useState(null);
  const cvRef = useRef(cv);
  const fileRef = useRef(null);
  const inputRef = useRef(null);
  cvRef.current = cv;

  // Grow the box with its content, up to the CSS max-height.
  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [text]);

  const commit = (next, changed, note) => {
    const before = cvRef.current;
    setCV(next);
    setResult({ note, changed, before, after: next, tone: "ok" });
  };

  const fail = (note) => setResult({ note, tone: "error" });

  const undo = () => {
    if (!result?.before) return;
    setCV(result.before);
    setResult({ note: "Change undone.", tone: "ok" });
    track("cv_assist_undo");
  };

  const attachPhoto = async (file) => {
    setBusy("Adding photo…");
    try {
      const raw = await readFileAsDataURL(file);
      let photo = raw;
      try { photo = await compressImage(raw); } catch { /* e.g. HEIC: shrinkPhoto runs again at save */ }
      const note = templateUsesPhoto(template)
        ? "Passport photo added."
        : "Passport photo added. This template doesn't show a photo; choose one that does under Templates.";
      commit({ ...cvRef.current, photo }, ["photo"], note);
      track("cv_assist_photo");
    } catch {
      fail("Couldn't read that image. Please try a JPG or PNG.");
    }
    setBusy("");
  };

  const onFile = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    const ext = file.name.toLowerCase().split(".").pop();
    if (IMAGE_EXT.includes(ext) || file.type.startsWith("image/")) return attachPhoto(file);

    setBusy(`Reading ${file.name}…`);
    try {
      const docText = await extractDocumentText(file);
      if (!docText || docText.length < 30) throw new Error("That document has no readable text.");
      setDoc({ name: file.name, text: docText });
      setResult(null);
      inputRef.current?.focus();
    } catch (err) {
      fail(err.message || "Couldn't read that document.");
    }
    setBusy("");
  };

  const submit = async (e) => {
    e?.preventDefault();
    const instruction = text.trim();
    if (busy || (!instruction && !doc)) return;
    if (!user) { onRequireAuth?.(); return; }

    setBusy(doc ? "Filling in your CV…" : "Updating your CV…");
    setResult(null);
    try {
      const { data } = await cvApi("assist", user, {
        cv: compactCV(cvRef.current),
        instruction,
        documentText: doc?.text || "",
        previous,
      });
      if (!data.success) {
        fail(data.error || "That didn't work. Please try again.");
      } else {
        const { next, changed } = applyAssistPatch(cvRef.current, data.set);
        const note = data.note || (changed.length ? "Done." : "Nothing needed changing.");
        if (changed.length) commit(next, changed, note);
        else setResult({ note, tone: "info" });
        setPrevious({ instruction: instruction || "Fill in my CV from the uploaded document.", note });
        setText("");
        setDoc(null);
        track("cv_assist_used", { changed: changed.length, withDoc: Boolean(doc) });
      }
    } catch {
      fail("Couldn't reach the server. Check your connection and try again.");
    }
    setBusy("");
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) submit(e);
  };

  // Undo only while the CV is still exactly what this edit produced.
  const canUndo = result?.after && result.after === cv;

  return (
    <div className="cva">
      <form className={`cva__bar ${busy ? "cva__bar--busy" : ""}`} onSubmit={submit}>
        <button
          type="button"
          className="cva__icon-btn"
          onClick={() => fileRef.current?.click()}
          disabled={Boolean(busy)}
          title="Attach a passport photo or your old CV (PDF, DOCX, TXT)"
          aria-label="Attach a passport photo or document"
        >
          <i className="fas fa-paperclip"></i>
        </button>
        <input
          ref={fileRef}
          type="file"
          hidden
          accept="image/*,.heic,.heif,.pdf,.docx,.doc,.txt"
          onChange={onFile}
        />
        <textarea
          ref={inputRef}
          className="cva__input"
          rows={1}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={onKeyDown}
          disabled={Boolean(busy)}
          placeholder={doc
            ? "Anything to add? Press Enter to fill in your CV from this document."
            : "Describe a change or paste your details, e.g. “Change my phone to 0803 123 4567”"}
          aria-label="Describe a change to your CV"
        />
        <button
          type="submit"
          className="cva__send"
          disabled={Boolean(busy) || (!text.trim() && !doc)}
        >
          {busy ? <span className="cva__spinner" aria-hidden="true"></span> : <i className="fas fa-arrow-right"></i>}
          <span className="cva__send-label">Apply</span>
        </button>
      </form>

      {(doc || busy || result) && (
        <div className="cva__status" role="status" aria-live="polite">
          {doc && !busy && (
            <span className="cva__chip">
              <i className="fas fa-file-alt"></i>
              {doc.name}
              <button type="button" onClick={() => setDoc(null)} aria-label="Remove document">
                <i className="fas fa-times"></i>
              </button>
            </span>
          )}
          {busy && <span className="cva__muted">{busy}</span>}
          {!busy && result && (
            <span className={`cva__note cva__note--${result.tone}`}>
              <i className={`fas fa-${result.tone === "error" ? "exclamation-circle" : result.tone === "info" ? "info-circle" : "check"}`}></i>
              <span>{result.note}</span>
              {result.changed?.length > 0 && (
                <span className="cva__muted">· {result.changed.map(labelFor).join(", ")}</span>
              )}
              {canUndo && <button type="button" className="cva__link" onClick={undo}>Undo</button>}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
