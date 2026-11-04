// ── QUICK EDIT BAR ──
// Type or speak a change ("my phone is now 0803…", "add my GTBank role since
// 2021"), paste details, or attach a passport photo or an existing CV, and the
// builder fills itself in. A photo is applied locally (no server call); a CV
// is read (OCR for scans) and sent with the request to /api/cv/assist, which
// returns only the fields it changed. Voice uses the browser's own speech
// recognition, so it costs nothing and is simply hidden where unsupported.
import { useEffect, useRef, useState } from "react";
import { cvApi } from "../utils/cvAccess";
import { compactCV, applyAssistPatch, extractDocumentText, labelFor } from "../utils/cvAssist";
import { compressImage, readFileAsDataURL } from "../utils/imageCompress";
import { templateUsesPhoto } from "../utils/templateMeta";
import { track } from "../../utils/analytics";
import "./CVAssist.css";

const SpeechRecognition = typeof window !== "undefined" && (window.SpeechRecognition || window.webkitSpeechRecognition);

export default function CVAssist({ cv, setCV, template, user, onRequireAuth }) {
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(""); // status text while working
  const [result, setResult] = useState(null); // { note, changed, before, after, tone }
  const [previous, setPrevious] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [listening, setListening] = useState(false);
  const cvRef = useRef(cv);
  const photoRef = useRef(null);
  const docRef = useRef(null);
  const inputRef = useRef(null);
  const attachRef = useRef(null);
  const recRef = useRef(null);
  cvRef.current = cv;

  // Grow the box with its content, up to the CSS max-height.
  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [text]);

  useEffect(() => {
    if (!menuOpen) return undefined;
    const close = (e) => { if (!attachRef.current?.contains(e.target)) setMenuOpen(false); };
    const onKey = (e) => { if (e.key === "Escape") setMenuOpen(false); };
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("mousedown", close); document.removeEventListener("keydown", onKey); };
  }, [menuOpen]);

  useEffect(() => () => recRef.current?.abort(), []);

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

  // ── VOICE ──
  const stopListening = () => recRef.current?.stop();

  const toggleVoice = () => {
    if (listening) return stopListening();
    const rec = new SpeechRecognition();
    rec.lang = navigator.language || "en-US";
    rec.interimResults = true;
    rec.continuous = true;
    const base = text.trim();
    rec.onresult = (e) => {
      let spoken = "";
      for (let i = 0; i < e.results.length; i++) spoken += e.results[i][0].transcript;
      setText(base ? `${base} ${spoken.trim()}` : spoken.trim());
    };
    rec.onerror = (e) => {
      if (e.error === "not-allowed" || e.error === "service-not-allowed") fail("Microphone access is blocked. Allow it in your browser to speak.");
      else if (e.error !== "no-speech" && e.error !== "aborted") fail("Couldn't hear that. Please try again.");
    };
    rec.onend = () => { setListening(false); recRef.current = null; inputRef.current?.focus(); };
    recRef.current = rec;
    setResult(null);
    setListening(true);
    rec.start();
    track("cv_assist_voice");
  };

  // ── REQUEST ──
  const run = async ({ instruction, docText = "" }) => {
    if (!user) { onRequireAuth?.(); return; }
    setBusy(docText ? "Filling in your CV…" : "Updating your CV…");
    setResult(null);
    try {
      const { data } = await cvApi("assist", user, {
        cv: compactCV(cvRef.current),
        instruction,
        documentText: docText,
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
        track("cv_assist_used", { changed: changed.length, withDoc: Boolean(docText) });
      }
    } catch {
      fail("Couldn't reach the server. Check your connection and try again.");
    }
    setBusy("");
  };

  const submit = (e) => {
    e?.preventDefault();
    stopListening();
    const instruction = text.trim();
    if (busy || !instruction) return;
    run({ instruction });
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) submit(e);
  };

  // ── ATTACHMENTS ──
  const pick = (ref) => { setMenuOpen(false); ref.current?.click(); };

  const onPhoto = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
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

  // Reading needs no sign-in, but filling does: check first so nobody waits
  // through a scan only to be asked to log in.
  const onDocument = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!user) { onRequireAuth?.(); return; }
    stopListening();
    setResult(null);
    setBusy(`Reading ${file.name}…`);
    let docText = "";
    try {
      docText = await extractDocumentText(file, setBusy);
      if (!docText || docText.length < 30) throw new Error("We couldn't find any text in that file.");
    } catch (err) {
      setBusy("");
      fail(err.message || "Couldn't read that document.");
      return;
    }
    // Whatever is typed in the box goes along as extra instructions.
    await run({ instruction: text.trim(), docText });
  };

  // Undo only while the CV is still exactly what this edit produced.
  const canUndo = result?.after && result.after === cv;

  return (
    <div className="cva">
      <form className={`cva__bar ${busy ? "cva__bar--busy" : ""} ${listening ? "cva__bar--listening" : ""}`} onSubmit={submit}>
        <div className="cva__attach" ref={attachRef}>
          <button
            type="button"
            className="cva__icon-btn"
            onClick={() => setMenuOpen((o) => !o)}
            disabled={Boolean(busy)}
            title="Attach a passport photo or an existing CV"
            aria-label="Attach a file"
            aria-haspopup="menu"
            aria-expanded={menuOpen}
          >
            <i className="fas fa-paperclip"></i>
          </button>
          {menuOpen && (
            <div className="cva__menu" role="menu">
              <button type="button" role="menuitem" onClick={() => pick(docRef)}>
                <i className="fas fa-file-lines"></i>
                <span><strong>Existing CV or document</strong><small>PDF, Word, text, or a photo or scan of one</small></span>
              </button>
              <button type="button" role="menuitem" onClick={() => pick(photoRef)}>
                <i className="fas fa-id-badge"></i>
                <span><strong>Passport photo</strong><small>Shown on templates with a photo</small></span>
              </button>
            </div>
          )}
        </div>
        <input ref={photoRef} type="file" hidden accept="image/*,.heic,.heif" onChange={onPhoto} />
        <input ref={docRef} type="file" hidden accept=".pdf,.docx,.doc,.txt,.md,image/*,.heic,.heif" onChange={onDocument} />
        <textarea
          ref={inputRef}
          className="cva__input"
          rows={1}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={onKeyDown}
          disabled={Boolean(busy)}
          placeholder={listening ? "Listening…" : "Ask Memora to build for you"}
          aria-label="Ask Memora to build or edit your CV"
        />
        {SpeechRecognition && (
          <button
            type="button"
            className={`cva__icon-btn cva__mic ${listening ? "cva__mic--on" : ""}`}
            onClick={toggleVoice}
            disabled={Boolean(busy)}
            title={listening ? "Stop" : "Speak instead of typing"}
            aria-label={listening ? "Stop voice input" : "Speak instead of typing"}
            aria-pressed={listening}
          >
            <i className={`fas fa-${listening ? "stop" : "microphone"}`}></i>
          </button>
        )}
        <button
          type="submit"
          className="cva__send"
          aria-label="Send"
          disabled={Boolean(busy) || !text.trim()}
        >
          {busy ? <span className="cva__spinner" aria-hidden="true"></span> : <i className="fas fa-arrow-up"></i>}
        </button>
      </form>

      {(busy || result) && (
        <div className="cva__status" role="status" aria-live="polite">
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
