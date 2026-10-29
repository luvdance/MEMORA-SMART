import { useState, useEffect } from "react";
import { STEPS } from "../utils/constants";
import { STEP_META, stepCompletion } from "../utils/cvStrength";
import FormHeader from "./FormHeader";
import "../CVForm.css";
import { callClaude } from "../utils/callClaude";
import { smartCase, liveTitleCase, liveCapitalizeSentences, liveCommaListTitleCase } from "../utils/textCasing";
import { compressImage, readFileAsDataURL } from "../utils/imageCompress";
import { templateUsesPhoto } from "../utils/templateMeta";

// ── UI ELEMENTS ──
function Label({ children, optional }) {
  return (
    <label className="cvf-label">
      {children}
      {optional && <span className="cvf-optional">Optional</span>}
    </label>
  );
}

// A filled field shows a quiet tick: small, steady feedback while typing.
function Input({ value, onChange, onBlur, placeholder, type = "text", icon, disabled, inputMode, autoComplete }) {
  const filled = String(value ?? "").trim().length > 0;
  return (
    <div className={`cvf-control ${icon ? "cvf-control--icon" : ""} ${filled ? "cvf-control--filled" : ""} ${disabled ? "cvf-control--disabled" : ""}`}>
      {icon && <i className={`${icon} cvf-control__icon`} aria-hidden="true"></i>}
      <input
        type={type}
        value={value ?? ""}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        disabled={disabled}
        inputMode={inputMode}
        autoComplete={autoComplete}
        className="cvf-input"
      />
      {filled && type !== "date" && <i className="fas fa-circle-check cvf-control__ok" aria-hidden="true"></i>}
    </div>
  );
}

// meter: { min, max } character target, shown as a small length gauge.
function Textarea({ value, onChange, onBlur, placeholder, rows = 3, meter, hint }) {
  const len = String(value ?? "").trim().length;
  let gauge = null;
  if (meter) {
    const state = len === 0 ? "empty" : len < meter.min ? "short" : len > meter.max ? "long" : "good";
    const text = { empty: `Aim for ${meter.min}–${meter.max} characters`, short: "Keep going", good: "Great length", long: "A little long" }[state];
    gauge = (
      <div className={`cvf-meter cvf-meter--${state}`}>
        <span className="cvf-meter__bar"><span style={{ width: `${Math.min(100, (len / meter.max) * 100)}%` }} /></span>
        <span className="cvf-meter__text">{text} · {len}</span>
      </div>
    );
  }
  return (
    <div className="cvf-area">
      <textarea
        value={value ?? ""}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        rows={rows}
        className="cvf-textarea"
      />
      {(gauge || hint) && (
        <div className="cvf-area__foot">
          {hint && <span className="cvf-area__hint"><i className="fas fa-lightbulb"></i> {hint}</span>}
          {gauge}
        </div>
      )}
    </div>
  );
}

function AiBtn({ onClick, loading, label = "Write with AI" }) {
  return (
    <button type="button" onClick={onClick} disabled={loading} className="cvf-ai">
      {loading ? (
        <><i className="fas fa-circle-notch fa-spin"></i> Writing…</>
      ) : (
        <><i className="fas fa-wand-magic-sparkles"></i> {label}</>
      )}
    </button>
  );
}

// What each step is for, in a sentence: people fill forms better when they know why.
const SECTION_COPY = [
  { title: "About you", sub: "Your name and how recruiters reach you." },
  { title: "Professional summary", sub: "Your elevator pitch: the first lines a recruiter reads." },
  { title: "Work experience", sub: "Most recent first. Show results, not just duties." },
  { title: "Education", sub: "Start with your highest qualification." },
  { title: "Skills & certifications", sub: "Use the same words the job adverts use." },
  { title: "Extras", sub: "Optional sections that help you stand out." },
  { title: "Biodata", sub: "Optional. Often requested for Nigerian government and traditional roles." },
];

function SectionHeader({ step, done }) {
  const meta = STEP_META[step];
  const copy = SECTION_COPY[step];
  return (
    <div className="cvf-section-head">
      <span className={`cvf-section-head__icon cvf-tone--${meta.tone}`}><i className={`fas ${meta.icon}`}></i></span>
      <div className="cvf-section-head__text">
        <h2>{copy.title}</h2>
        <p>{copy.sub}</p>
      </div>
      {done && <span className="cvf-badge cvf-badge--done"><i className="fas fa-check"></i> Complete</span>}
    </div>
  );
}

// Card title for repeated entries: "Senior PM · Paystack" instead of "Experience 1".
function EntryTitle({ n, title, subtitle, fallback }) {
  return (
    <div className="cvf-entry">
      <span className="cvf-entry__n">{n}</span>
      <span className="cvf-entry__text">
        <strong className={title ? "" : "cvf-entry__placeholder"}>{title || fallback}</strong>
        {subtitle && <small>{subtitle}</small>}
      </span>
    </div>
  );
}

function Switch({ checked, onChange, children }) {
  return (
    <label className="cvf-switch">
      <input type="checkbox" checked={!!checked} onChange={onChange} />
      <span className="cvf-switch__track" aria-hidden="true"><span /></span>
      <span className="cvf-switch__label">{children}</span>
    </label>
  );
}

function SkillChips({ text }) {
  const list = String(text || "").split(/[,\n]+/).map(t => t.trim()).filter(Boolean);
  if (!list.length) return null;
  const target = list.length >= 8 ? "good" : list.length >= 5 ? "ok" : "low";
  return (
    <div className="cvf-chips">
      <div className="cvf-chips__list">
        {list.map((t, i) => <span key={i} className="cvf-chip">{t}</span>)}
      </div>
      <span className={`cvf-chips__count cvf-chips__count--${target}`}>
        {list.length} skill{list.length !== 1 ? "s" : ""}{target !== "good" ? " · aim for 8–12" : " · nicely done"}
      </span>
    </div>
  );
}

function CardActions({ index, total, onMoveUp, onMoveDown, onDelete, canDelete = true }) {
  return (
    <div className="cv-form__card-actions">
      <button
        className="cv-form__card-btn cv-form__card-btn--move"
        onClick={() => onMoveUp(index)}
        disabled={index === 0}
        title="Move up"
        type="button"
      >
        <i className="fas fa-arrow-up"></i>
      </button>
      <button
        className="cv-form__card-btn cv-form__card-btn--move"
        onClick={() => onMoveDown(index)}
        disabled={index === total - 1}
        title="Move down"
        type="button"
      >
        <i className="fas fa-arrow-down"></i>
      </button>
      {canDelete && (
        <button
          className="cv-form__card-btn cv-form__card-btn--delete"
          onClick={() => onDelete(index)}
          title="Delete"
          type="button"
        >
          <i className="fas fa-trash"></i>
        </button>
      )}
    </div>
  );
}

export default function CVForm({ cv, setCV, template, step, setStep, tab, entitlement, onAts, isMobile, onFinish }) {
  const [loading, setLoading] = useState({});
  const steps = stepCompletion(cv);

  // ── LIVE FORMAT HELPER ──
  const getLiveFormat = (field) => {
    const f = field.toLowerCase();
    if (f.includes('email') || f.includes('linkedin') || f.includes('website') ||
        f.includes('github') || f.includes('twitter') || f.includes('url') ||
        f.includes('phone') || f.includes('nin') || f.includes('password') ||
        f.includes('date') || f.includes('start') || f.includes('end') ||
        f.includes('credentialid')) {
      return null;
    }
    if (f.includes('skills') || f.includes('languages') || f.includes('hobbies')) {
      return 'commaList';
    }
    if (f.includes('summary') || f.includes('objective') ||
        f.includes('description') || f.includes('responsibilit')) {
      return 'sentence';
    }
    return 'title';
  };

  const applyLive = (field, value) => {
    const liveType = getLiveFormat(field);
    if (!liveType || !value) return value;
    if (liveType === 'sentence') return liveCapitalizeSentences(value);
    if (liveType === 'title') return liveTitleCase(value);
    if (liveType === 'commaList') return liveCommaListTitleCase(value);
    return value;
  };

  // ── UPDATE HANDLERS (with live casing) ──
  const upd = (field) => (e) => {
    const val = applyLive(field, e.target.value);
    setCV(p => ({ ...p, [field]: val }));
  };

  const updExp = (i, field) => (e) => {
    const val = field === "current" ? e.target.checked : applyLive(field, e.target.value);
    const exp = [...cv.experience];
    exp[i] = { ...exp[i], [field]: val };
    setCV(p => ({ ...p, experience: exp }));
  };

  const updEdu = (i, field) => (e) => {
    const val = applyLive(field, e.target.value);
    const edu = [...cv.education];
    edu[i] = { ...edu[i], [field]: val };
    setCV(p => ({ ...p, education: edu }));
  };

  // ── BLUR HANDLERS (smart casing on focus loss) ──
  const blur = (field) => (e) => {
    smartCase(e.target.value, field, (v) => setCV(p => ({ ...p, [field]: v })));
  };

  const blurExp = (i, field) => (e) => {
    smartCase(e.target.value, field, (v) => {
      const exp = [...cv.experience];
      exp[i] = { ...exp[i], [field]: v };
      setCV(p => ({ ...p, experience: exp }));
    });
  };

  const blurEdu = (i, field) => (e) => {
    smartCase(e.target.value, field, (v) => {
      const edu = [...cv.education];
      edu[i] = { ...edu[i], [field]: v };
      setCV(p => ({ ...p, education: edu }));
    });
  };

  const blurArr = (arrName, i, field) => (e) => {
    smartCase(e.target.value, field, (v) => {
      const arr = [...(cv[arrName] || [])];
      arr[i] = { ...arr[i], [field]: v };
      setCV(p => ({ ...p, [arrName]: arr }));
    });
  };

  // ── DELETE HANDLERS ──
const delExp = (i) => {
  if (cv.experience.length <= 1) return; // keep at least 1
  setCV(p => ({ ...p, experience: p.experience.filter((_, idx) => idx !== i) }));
};

const delEdu = (i) => {
  if (cv.education.length <= 1) return;
  setCV(p => ({ ...p, education: p.education.filter((_, idx) => idx !== i) }));
};

const delArr = (arrName, i) => {
  setCV(p => ({ ...p, [arrName]: (p[arrName] || []).filter((_, idx) => idx !== i) }));
};

// ── REORDER HANDLERS ──
const moveExp = (i, dir) => {
  const arr = [...cv.experience];
  const target = i + dir;
  if (target < 0 || target >= arr.length) return;
  [arr[i], arr[target]] = [arr[target], arr[i]];
  setCV(p => ({ ...p, experience: arr }));
};

const moveEdu = (i, dir) => {
  const arr = [...cv.education];
  const target = i + dir;
  if (target < 0 || target >= arr.length) return;
  [arr[i], arr[target]] = [arr[target], arr[i]];
  setCV(p => ({ ...p, education: arr }));
};

  // ── CERTIFICATION MIGRATION ──
  useEffect(() => {
    if (typeof cv.certifications === "string" && cv.certifications.trim()) {
      const converted = cv.certifications
        .split(/[,;\n]/)
        .map(s => s.trim())
        .filter(Boolean)
        .map(name => ({
          name,
          issuer: "",
          issueDate: "",
          expiryDate: "",
          noExpiry: false,
          credentialId: "",
          credentialUrl: "",
        }));
      setCV(p => ({ ...p, certifications: converted }));
    } else if (!cv.certifications || (typeof cv.certifications === "string" && !cv.certifications.trim())) {
      setCV(p => ({ ...p, certifications: [] }));
    }
  }, []);

  const addCert = () => setCV(p => ({
    ...p,
    certifications: [...(Array.isArray(p.certifications) ? p.certifications : []), {
      name: "", issuer: "", issueDate: "", expiryDate: "", noExpiry: false, credentialId: "", credentialUrl: ""
    }]
  }));

  const updCert = (i, field) => (e) => {
    const val = field === "noExpiry"
      ? e.target.checked
      : applyLive(field, e.target.value);
    const certs = Array.isArray(cv.certifications) ? [...cv.certifications] : [];
    certs[i] = { ...certs[i], [field]: val };
    setCV(p => ({ ...p, certifications: certs }));
  };

  const removeCert = (i) => {
    const certs = Array.isArray(cv.certifications) ? [...cv.certifications] : [];
    setCV(p => ({ ...p, certifications: certs.filter((_, idx) => idx !== i) }));
  };

  // ── AI SUGGEST ──
  const aiSuggest = async (key, prompt) => {
    setLoading(l => ({ ...l, [key]: true }));
    try {
      const text = await callClaude(prompt);
      setCV(p => ({ ...p, [key]: text.trim() }));
    } catch (err) {
      alert("AI error: " + err.message);
    }
    setLoading(l => ({ ...l, [key]: false }));
  };

  const aiResponsibilities = async (i) => {
    const e = cv.experience[i];
    const key = "resp_" + i;
    setLoading(l => ({ ...l, [key]: true }));
    try {
      const text = await callClaude(
        `Write 4-5 concise job responsibilities for a ${e.role || "professional"} at ${e.company || "a company"}. Use action verbs. Each responsibility on a new line starting with a dash (-). No headings, no markdown, no preamble, no extra formatting. Just the lines.`
      );
      const exp = [...cv.experience];
      exp[i] = { ...exp[i], responsibilities: text.trim() };
      setCV(p => ({ ...p, experience: exp }));
    } catch (err) {
      alert("AI error: " + err.message);
    }
    setLoading(l => ({ ...l, [key]: false }));
  };

  const aiCertifications = async () => {
    setLoading(l => ({ ...l, certifications: true }));
    try {
      const text = await callClaude(
        `Suggest 3 industry-recognized certifications for a ${cv.jobTitle || "professional"}. Return ONLY a valid JSON array, nothing else. Format: [{"name": "certification name", "issuer": "issuing organization"}]. No markdown, no backticks, no explanation, no preamble.`
      );
      const clean = text.replace(/```json|```/g, "").trim();
      const suggestions = JSON.parse(clean);
      const newCerts = suggestions.map(s => ({
        name: s.name || "",
        issuer: s.issuer || "",
        issueDate: "",
        expiryDate: "",
        noExpiry: false,
        credentialId: "",
        credentialUrl: "",
      }));
      setCV(p => ({
        ...p,
        certifications: [...(Array.isArray(p.certifications) ? p.certifications : []), ...newCerts]
      }));
    } catch (err) {
      alert("AI error: " + err.message);
    }
    setLoading(l => ({ ...l, certifications: false }));
  };

  const handlePhoto = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const raw = await readFileAsDataURL(file);
      let photo = raw;
      try {
        photo = await compressImage(raw);
      } catch {
        // Unsupported format for canvas (e.g. HEIC on some browsers) — keep the
        // original; shrinkPhoto runs again at save time.
      }
      setCV(p => ({ ...p, photo }));
    } catch {
      alert("Could not read that image. Please try a JPG or PNG.");
    }
  };

  // ── STEPS ──
  const renderStep = () => {

    // STEP 0: PERSONAL
    if (step === 0) return (
      <div className="cv-form__section">
        <SectionHeader step={0} done={steps[0]} />

        {templateUsesPhoto(template) && (
          <div className="cvf-photo">
            <div className="cvf-photo__avatar">
              {cv.photo
                ? <img src={cv.photo} alt="Your passport photo" />
                : <i className="fas fa-user" aria-hidden="true"></i>}
            </div>
            <div className="cvf-photo__body">
              <strong>Passport photo</strong>
              <span>This template shows a photo. Use a clear, front-facing picture.</span>
              <div className="cvf-photo__actions">
                <label className="cvf-btn cvf-btn--soft">
                  <input type="file" accept="image/*" onChange={handlePhoto} />
                  <i className="fas fa-camera"></i> {cv.photo ? "Change" : "Upload photo"}
                </label>
                {cv.photo && (
                  <button type="button" className="cvf-btn cvf-btn--danger" onClick={() => setCV(p => ({ ...p, photo: null }))}>
                    <i className="fas fa-trash-can"></i> Remove
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="cv-form__field">
          <Label>Full name</Label>
          <Input value={cv.name} onChange={upd("name")} onBlur={blur("name")} placeholder="e.g. Adaeze Okonkwo" icon="fas fa-user" autoComplete="name" />
        </div>
        <div className="cv-form__field">
          <Label>Target job title</Label>
          <Input value={cv.jobTitle} onChange={upd("jobTitle")} onBlur={blur("jobTitle")} placeholder="e.g. Senior Product Manager" icon="fas fa-briefcase" autoComplete="organization-title" />
        </div>
        <div className="cv-form__field">
          <Label>Email</Label>
          <Input type="email" value={cv.email} onChange={upd("email")} onBlur={blur("email")} placeholder="you@example.com" icon="fas fa-envelope" inputMode="email" autoComplete="email" />
        </div>
        <div className="cv-form__field">
          <Label>Phone</Label>
          <Input type="tel" value={cv.phone} onChange={upd("phone")} onBlur={blur("phone")} placeholder="+234 803 000 0000" icon="fas fa-phone" inputMode="tel" autoComplete="tel" />
        </div>
        <div className="cv-form__field">
          <Label>Location</Label>
          <Input value={cv.address} onChange={upd("address")} onBlur={blur("address")} placeholder="e.g. Lagos, Nigeria" icon="fas fa-location-dot" autoComplete="address-level2" />
        </div>

        <div className="cvf-subhead"><i className="fas fa-link"></i> Online presence <span className="cvf-optional">Optional</span></div>
        <div className="cv-form__field">
          <Label>LinkedIn</Label>
          <Input value={cv.linkedin} onChange={upd("linkedin")} onBlur={blur("linkedin")} placeholder="linkedin.com/in/yourname" icon="fab fa-linkedin" inputMode="url" autoComplete="url" />
        </div>
        <div className="cv-form__grid cvf-grid--stack-sm">
          <div className="cv-form__field">
            <Label>Website</Label>
            <Input value={cv.website} onChange={upd("website")} onBlur={blur("website")} placeholder="yourname.com" icon="fas fa-globe" inputMode="url" />
          </div>
          <div className="cv-form__field">
            <Label>GitHub</Label>
            <Input value={cv.github} onChange={upd("github")} onBlur={blur("github")} placeholder="github.com/you" icon="fab fa-github" inputMode="url" />
          </div>
        </div>
      </div>
    );

    // STEP 1: SUMMARY & OBJECTIVE
    if (step === 1) return (
      <div className="cv-form__section">
        <SectionHeader step={1} done={steps[1]} />

        <div className="cv-form__field">
          <Label>Professional summary</Label>
          <Textarea
            value={cv.summary}
            onChange={upd("summary")}
            onBlur={blur("summary")}
            placeholder="e.g. Product manager with 6 years in fintech. I turn customer insight into features people use: grew retention 34% at Paystack."
            rows={5}
            meter={{ min: 150, max: 500 }}
          />
          <AiBtn
            loading={loading.summary}
            onClick={() => aiSuggest(
              "summary",
              `Write a 2-sentence professional summary for a ${cv.jobTitle || "professional"}${cv.name ? " named " + cv.name : ""}. Be specific, confident, and concise. No heading, no label, no markdown. Start directly with the person's name or role.`
            )}
          />
        </div>

        <div className="cv-form__field">
          <Label optional>Career objective</Label>
          <Textarea
            value={cv.objective}
            onChange={upd("objective")}
            onBlur={blur("objective")}
            placeholder="One sentence: the role you want and the value you bring."
            rows={3}
          />
          <AiBtn
            loading={loading.objective}
            onClick={() => aiSuggest(
              "objective",
              `Write exactly 1 sentence career objective for a ${cv.jobTitle || "professional"}. State the role they want and the value they bring. Plain text only, no heading, start immediately with the content.`
            )}
          />
        </div>
      </div>
    );

    // STEP 2: EXPERIENCE
    if (step === 2) return (
      <div className="cv-form__section">
        <SectionHeader step={2} done={steps[2]} />
        {cv.experience.map((e, i) => (
        <div key={i} className="cv-form__card">
          <div className="cv-form__card-header">
            <EntryTitle n={i + 1} title={e.role} subtitle={e.company} fallback="New role" />
            <CardActions
              index={i}
              total={cv.experience.length}
              onMoveUp={(idx) => moveExp(idx, -1)}
              onMoveDown={(idx) => moveExp(idx, 1)}
              onDelete={delExp}
              canDelete={cv.experience.length > 1}
            />
          </div>
            {[["Job title", "role", "fas fa-briefcase", "e.g. Product Manager"], ["Company", "company", "fas fa-building", "e.g. Paystack"]].map(([lbl, key, icon, ph]) => (
              <div className="cv-form__field" key={key}>
                <Label>{lbl}</Label>
                <Input
                  value={e[key]}
                  onChange={updExp(i, key)}
                  onBlur={blurExp(i, key)}
                  placeholder={ph}
                  icon={icon}
                />
              </div>
            ))}
            <div className="cv-form__grid">
              <div>
                <Label>Start</Label>
                <Input value={e.start} onChange={updExp(i, "start")} placeholder="e.g. Jan 2020" icon="far fa-calendar" />
              </div>
              <div>
                <Label>End</Label>
                <Input value={e.current ? "Present" : e.end} onChange={updExp(i, "end")} placeholder="e.g. Dec 2022" icon="far fa-calendar" disabled={e.current} />
              </div>
            </div>
            <Switch checked={e.current} onChange={updExp(i, "current")}>I currently work here</Switch>
            <div className="cv-form__field">
              <Label>What you achieved</Label>
              <Textarea
                value={e.responsibilities}
                onChange={updExp(i, "responsibilities")}
                onBlur={blurExp(i, "responsibilities")}
                placeholder={"- Led a team of 5 to launch…\n- Increased sales by 20% by…"}
                rows={5}
                hint="One win per line. Start with a verb and add a number."
              />
              <AiBtn
                loading={loading["resp_" + i]}
                onClick={() => aiResponsibilities(i)}
              />
            </div>
          </div>
        ))}
        <button
          onClick={() => setCV(p => ({
            ...p,
            experience: [...p.experience, { company: "", role: "", start: "", end: "", current: false, responsibilities: "" }]
          }))}
          className="cv-form__add-btn"
        >
          <i className="fas fa-plus"></i> Add another role
        </button>
      </div>
    );

    // STEP 3: EDUCATION
    if (step === 3) return (
      <div className="cv-form__section">
        <SectionHeader step={3} done={steps[3]} />
        {cv.education.map((e, i) => (
        <div key={i} className="cv-form__card">
          <div className="cv-form__card-header">
            <EntryTitle n={i + 1} title={e.degree ? `${e.degree}${e.field ? ` in ${e.field}` : ""}` : ""} subtitle={e.school} fallback="New qualification" />
            <CardActions
              index={i}
              total={cv.education.length}
              onMoveUp={(idx) => moveEdu(idx, -1)}
              onMoveDown={(idx) => moveEdu(idx, 1)}
              onDelete={delEdu}
              canDelete={cv.education.length > 1}
            />
          </div>
            {[
              ["School / university", "school", "fas fa-building-columns", "e.g. University of Lagos"],
              ["Qualification", "degree", "fas fa-graduation-cap", "e.g. B.Sc."],
              ["Field of study", "field", "fas fa-book-open", "e.g. Computer Science"],
            ].map(([lbl, key, icon, ph]) => (
              <div className="cv-form__field" key={key}>
                <Label>{lbl}</Label>
                <Input
                  value={e[key]}
                  onChange={updEdu(i, key)}
                  onBlur={blurEdu(i, key)}
                  placeholder={ph}
                  icon={icon}
                />
              </div>
            ))}
            <div className="cv-form__grid">
              <div>
                <Label>Start year</Label>
                <Input value={e.start} onChange={updEdu(i, "start")} placeholder="e.g. 2016" icon="far fa-calendar" inputMode="numeric" />
              </div>
              <div>
                <Label>End year</Label>
                <Input value={e.end} onChange={updEdu(i, "end")} placeholder="e.g. 2020" icon="far fa-calendar" inputMode="numeric" />
              </div>
            </div>
          </div>
        ))}
        <button
          onClick={() => setCV(p => ({
            ...p,
            education: [...p.education, { school: "", degree: "", field: "", start: "", end: "" }]
          }))}
          className="cv-form__add-btn"
        >
          <i className="fas fa-plus"></i> Add another qualification
        </button>
      </div>
    );

    // STEP 4: SKILLS & MORE
    if (step === 4) return (
      <div className="cv-form__section">
        <SectionHeader step={4} done={steps[4]} />

        <div className="cv-form__field">
          <Label>Skills</Label>
          <Textarea
            value={cv.skills}
            onChange={upd("skills")}
            onBlur={blur("skills")}
            placeholder="e.g. Project Management, Microsoft Excel, Leadership"
            rows={3}
            hint="Separate skills with commas."
          />
          <SkillChips text={cv.skills} />
          <AiBtn
            loading={loading.skills}
            onClick={() => aiSuggest(
              "skills",
              `List 8-10 relevant professional skills for a ${cv.jobTitle || "professional"}. Return ONLY a comma-separated list of skill names. No headings, no numbers, no markdown, no preamble, no extra text. Example format: Project Management, Data Analysis, Leadership`
            )}
          />
        </div>

        <div className="cv-form__field">
          <Label>Languages</Label>
          <Input
            value={cv.languages}
            onChange={upd("languages")}
            onBlur={blur("languages")}
            placeholder="e.g. English (Fluent), Yoruba (Native)"
            icon="fas fa-language"
          />
          <AiBtn
            loading={loading.languages}
            onClick={() => aiSuggest(
              "languages",
              `Suggest a realistic set of languages and proficiency levels for a ${cv.jobTitle || "professional"} based in Nigeria. Return ONLY a comma-separated list like: English (Fluent), Yoruba (Native). No headings, no markdown, no preamble.`
            )}
          />
        </div>

        <div className="cv-form__field">
          <Label optional>Hobbies & interests</Label>
          <Input
            value={cv.hobbies}
            onChange={upd("hobbies")}
            onBlur={blur("hobbies")}
            placeholder="e.g. Reading, Football, Photography"
            icon="fas fa-heart"
          />
          <AiBtn
            loading={loading.hobbies}
            onClick={() => aiSuggest(
              "hobbies",
              `Suggest 4-6 professional-sounding hobbies and interests for a ${cv.jobTitle || "professional"}. Return ONLY a comma-separated list. No headings, no markdown, no preamble.`
            )}
          />
        </div>

        {/* CERTIFICATIONS */}
        <div className="cv-form__field">
          <div className="cvf-subhead"><i className="fas fa-certificate"></i> Certifications <span className="cvf-optional">Optional</span></div>
          {Array.isArray(cv.certifications) && cv.certifications.map((cert, i) => (
            <div key={i} className="cv-form__card" style={{ marginBottom: 12 }}>
              <div className="cv-form__card-header">
                <EntryTitle n={i + 1} title={cert.name} subtitle={cert.issuer} fallback="New certification" />
                <button
                  type="button"
                  className="cv-form__card-btn cv-form__card-btn--delete"
                  onClick={() => removeCert(i)}
                  aria-label="Delete certification"
                >
                  <i className="fas fa-trash"></i>
                </button>
              </div>

              <div className="cv-form__field">
                <Label>Certification name</Label>
                <Input
                  value={cert.name}
                  onChange={updCert(i, "name")}
                  onBlur={blurArr("certifications", i, "name")}
                  placeholder="e.g. Project Management Professional (PMP)"
                />
              </div>
              <div className="cv-form__field">
                <Label>Issued by</Label>
                <Input
                  value={cert.issuer}
                  onChange={updCert(i, "issuer")}
                  onBlur={blurArr("certifications", i, "issuer")}
                  placeholder="e.g. Project Management Institute"
                />
              </div>
              <div className="cv-form__grid">
                <div>
                  <Label>Issued</Label>
                  <Input
                    value={cert.issueDate}
                    onChange={updCert(i, "issueDate")}
                    placeholder="e.g. Jan 2023"
                  />
                </div>
                <div>
                  <Label>Expires</Label>
                  <Input
                    value={cert.noExpiry ? "No expiry" : cert.expiryDate}
                    onChange={updCert(i, "expiryDate")}
                    placeholder="e.g. Jan 2026"
                    disabled={cert.noExpiry}
                  />
                </div>
              </div>
              <Switch checked={cert.noExpiry} onChange={updCert(i, "noExpiry")}>Doesn't expire</Switch>
              <div className="cv-form__grid">
                <div>
                  <Label optional>Credential ID</Label>
                  <Input
                    value={cert.credentialId}
                    onChange={updCert(i, "credentialId")}
                    placeholder="e.g. ABC-123456"
                  />
                </div>
                <div>
                  <Label optional>Credential URL</Label>
                  <Input
                    value={cert.credentialUrl}
                    onChange={updCert(i, "credentialUrl")}
                    placeholder="https://verify.example.com/..."
                  />
                </div>
              </div>
            </div>
          ))}
          <div className="cvf-add-row">
            <button onClick={addCert} className="cv-form__add-btn">
              <i className="fas fa-plus"></i> Add certification
            </button>
            <AiBtn
              loading={loading.certifications}
              onClick={aiCertifications}
              label="Suggest some"
            />
          </div>
        </div>

      </div>
    );

    // STEP 5: EXTRAS
    if (step === 5) return (
      <div className="cv-form__section">
        <SectionHeader step={5} done={steps[5]} />

        {/* ACHIEVEMENTS */}
        <div className="cv-form__extras-group">
          <div className="cv-form__extras-header">
            <span className="cvf-extras__icon cvf-tone--amber"><i className="fas fa-trophy"></i></span>
            <span>Achievements & Awards</span>
            <span className="cvf-optional">Optional</span>
          </div>
          {cv.achievements?.map((a, i) => (
            <div key={i} className="cv-form__card">
              <div className="cv-form__card-header">
              <EntryTitle n={i + 1} title={a.title} subtitle={a.date} fallback="New achievement" />
              <button
                className="cv-form__card-btn cv-form__card-btn--delete"
                onClick={() => delArr("achievements", i)}
                type="button"
              ><i className="fas fa-trash"></i></button>
            </div>
              <div className="cv-form__field">
                <Label>Title / Award Name</Label>
                <Input
                  value={a.title}
                  onChange={(e) => {
                    const arr = [...cv.achievements];
                    arr[i] = { ...arr[i], title: applyLive("title", e.target.value) };
                    setCV(p => ({ ...p, achievements: arr }));
                  }}
                  onBlur={blurArr("achievements", i, "title")}
                  placeholder="e.g. Employee of the Year"
                />
              </div>
              <div className="cv-form__field">
                <Label>Date</Label>
                <Input
                  value={a.date}
                  onChange={(e) => {
                    const arr = [...cv.achievements];
                    arr[i] = { ...arr[i], date: e.target.value };
                    setCV(p => ({ ...p, achievements: arr }));
                  }}
                  placeholder="e.g. 2023"
                />
              </div>
              <div className="cv-form__field">
                <Label>Description</Label>
                <Textarea
                  value={a.description}
                  onChange={(e) => {
                    const arr = [...cv.achievements];
                    arr[i] = { ...arr[i], description: applyLive("description", e.target.value) };
                    setCV(p => ({ ...p, achievements: arr }));
                  }}
                  onBlur={blurArr("achievements", i, "description")}
                  placeholder="Briefly describe this achievement..."
                  rows={2}
                />
              </div>
            </div>
          ))}
          <button
            className="cv-form__add-btn"
            onClick={() => setCV(p => ({
              ...p,
              achievements: [...(p.achievements || []), { title: "", date: "", description: "" }]
            }))}
          >
            <i className="fas fa-plus"></i> Add achievement
          </button>
        </div>

        {/* VOLUNTEER */}
        <div className="cv-form__extras-group">
          <div className="cv-form__extras-header">
            <span className="cvf-extras__icon cvf-tone--teal"><i className="fas fa-hands-helping"></i></span>
            <span>Volunteer Work</span>
            <span className="cvf-optional">Optional</span>
          </div>
          {cv.volunteer?.map((v, i) => (
            <div key={i} className="cv-form__card">
              <div className="cv-form__card-header">
                <EntryTitle n={i + 1} title={v.role} subtitle={v.organization} fallback="New volunteer role" />
                <button
                  className="cv-form__card-btn cv-form__card-btn--delete"
                  onClick={() => delArr("volunteer", i)}
                  type="button"
                ><i className="fas fa-trash"></i></button>
              </div>
              <div className="cv-form__field">
                <Label>Organization</Label>
                <Input
                  value={v.organization}
                  onChange={(e) => {
                    const arr = [...cv.volunteer];
                    arr[i] = { ...arr[i], organization: applyLive("organization", e.target.value) };
                    setCV(p => ({ ...p, volunteer: arr }));
                  }}
                  onBlur={blurArr("volunteer", i, "organization")}
                  placeholder="e.g. Red Cross"
                />
              </div>
              <div className="cv-form__field">
                <Label>Role</Label>
                <Input
                  value={v.role}
                  onChange={(e) => {
                    const arr = [...cv.volunteer];
                    arr[i] = { ...arr[i], role: applyLive("role", e.target.value) };
                    setCV(p => ({ ...p, volunteer: arr }));
                  }}
                  onBlur={blurArr("volunteer", i, "role")}
                  placeholder="e.g. Community Coordinator"
                />
              </div>
              <div className="cv-form__grid">
                <div>
                  <Label>Start Date</Label>
                  <Input
                    value={v.start}
                    onChange={(e) => {
                      const arr = [...cv.volunteer];
                      arr[i] = { ...arr[i], start: e.target.value };
                      setCV(p => ({ ...p, volunteer: arr }));
                    }}
                    placeholder="e.g. Jan 2021"
                  />
                </div>
                <div>
                  <Label>End Date</Label>
                  <Input
                    value={v.end}
                    onChange={(e) => {
                      const arr = [...cv.volunteer];
                      arr[i] = { ...arr[i], end: e.target.value };
                      setCV(p => ({ ...p, volunteer: arr }));
                    }}
                    placeholder="e.g. Dec 2022"
                  />
                </div>
              </div>
              <div className="cv-form__field">
                <Label>Description</Label>
                <Textarea
                  value={v.description}
                  onChange={(e) => {
                    const arr = [...cv.volunteer];
                    arr[i] = { ...arr[i], description: applyLive("description", e.target.value) };
                    setCV(p => ({ ...p, volunteer: arr }));
                  }}
                  onBlur={blurArr("volunteer", i, "description")}
                  placeholder="Describe your volunteer work..."
                  rows={2}
                />
              </div>
            </div>
          ))}
          <button
            className="cv-form__add-btn"
            onClick={() => setCV(p => ({
              ...p,
              volunteer: [...(p.volunteer || []), { organization: "", role: "", start: "", end: "", description: "" }]
            }))}
          >
            <i className="fas fa-plus"></i> Add volunteer work
          </button>
        </div>

        {/* PUBLICATIONS */}
        <div className="cv-form__extras-group">
          <div className="cv-form__extras-header">
            <span className="cvf-extras__icon cvf-tone--blue"><i className="fas fa-book"></i></span>
            <span>Publications</span>
            <span className="cvf-optional">Optional</span>
          </div>
          {cv.publications?.map((pub, i) => (
            <div key={i} className="cv-form__card">
              <div className="cv-form__card-header">
                <EntryTitle n={i + 1} title={pub.title} subtitle={pub.journal} fallback="New publication" />
                <button
                  className="cv-form__card-btn cv-form__card-btn--delete"
                  onClick={() => delArr("publications", i)}
                  type="button"
                ><i className="fas fa-trash"></i></button>
              </div>
              <div className="cv-form__field">
                <Label>Title</Label>
                <Input
                  value={pub.title}
                  onChange={(e) => {
                    const arr = [...cv.publications];
                    arr[i] = { ...arr[i], title: applyLive("title", e.target.value) };
                    setCV(p => ({ ...p, publications: arr }));
                  }}
                  onBlur={blurArr("publications", i, "title")}
                  placeholder="e.g. Machine Learning in Healthcare"
                />
              </div>
              <div className="cv-form__field">
                <Label>Journal / Publisher</Label>
                <Input
                  value={pub.journal}
                  onChange={(e) => {
                    const arr = [...cv.publications];
                    arr[i] = { ...arr[i], journal: applyLive("journal", e.target.value) };
                    setCV(p => ({ ...p, publications: arr }));
                  }}
                  onBlur={blurArr("publications", i, "journal")}
                  placeholder="e.g. IEEE Transactions on..."
                />
              </div>
              <div className="cv-form__grid">
                <div>
                  <Label>Date</Label>
                  <Input
                    value={pub.date}
                    onChange={(e) => {
                      const arr = [...cv.publications];
                      arr[i] = { ...arr[i], date: e.target.value };
                      setCV(p => ({ ...p, publications: arr }));
                    }}
                    placeholder="e.g. March 2023"
                  />
                </div>
                <div>
                  <Label optional>URL</Label>
                  <Input
                    value={pub.url}
                    onChange={(e) => {
                      const arr = [...cv.publications];
                      arr[i] = { ...arr[i], url: e.target.value };
                      setCV(p => ({ ...p, publications: arr }));
                    }}
                    placeholder="https://..."
                  />
                </div>
              </div>
            </div>
          ))}
          <button
            className="cv-form__add-btn"
            onClick={() => setCV(p => ({
              ...p,
              publications: [...(p.publications || []), { title: "", journal: "", date: "", url: "", description: "" }]
            }))}
          >
            <i className="fas fa-plus"></i> Add publication
          </button>
        </div>

        {/* REFERENCES */}
        <div className="cv-form__extras-group">
          <div className="cv-form__extras-header">
            <span className="cvf-extras__icon cvf-tone--violet"><i className="fas fa-user-check"></i></span>
            <span>References</span>
            <span className="cvf-optional">Optional</span>
          </div>
          {cv.references?.map((r, i) => (
            <div key={i} className="cv-form__card">
              <div className="cv-form__card-header">
                <EntryTitle n={i + 1} title={r.name} subtitle={[r.title, r.company].filter(Boolean).join(", ")} fallback="New reference" />
                <button
                  className="cv-form__card-btn cv-form__card-btn--delete"
                  onClick={() => delArr("references", i)}
                  type="button"
                ><i className="fas fa-trash"></i></button>
              </div>
              <div className="cv-form__grid">
                <div className="cv-form__field">
                  <Label>Full Name</Label>
                  <Input
                    value={r.name}
                    onChange={(e) => {
                      const arr = [...cv.references];
                      arr[i] = { ...arr[i], name: applyLive("name", e.target.value) };
                      setCV(p => ({ ...p, references: arr }));
                    }}
                    onBlur={blurArr("references", i, "name")}
                    placeholder="John Smith"
                  />
                </div>
                <div className="cv-form__field">
                  <Label>Job Title</Label>
                  <Input
                    value={r.title}
                    onChange={(e) => {
                      const arr = [...cv.references];
                      arr[i] = { ...arr[i], title: applyLive("title", e.target.value) };
                      setCV(p => ({ ...p, references: arr }));
                    }}
                    onBlur={blurArr("references", i, "title")}
                    placeholder="e.g. Senior Manager"
                  />
                </div>
                <div className="cv-form__field">
                  <Label>Company</Label>
                  <Input
                    value={r.company}
                    onChange={(e) => {
                      const arr = [...cv.references];
                      arr[i] = { ...arr[i], company: applyLive("company", e.target.value) };
                      setCV(p => ({ ...p, references: arr }));
                    }}
                    onBlur={blurArr("references", i, "company")}
                    placeholder="e.g. Acme Corp"
                  />
                </div>
                <div className="cv-form__field">
                  <Label>Email</Label>
                  <Input
                    value={r.email}
                    onChange={(e) => {
                      const arr = [...cv.references];
                      arr[i] = { ...arr[i], email: e.target.value };
                      setCV(p => ({ ...p, references: arr }));
                    }}
                    placeholder="john@company.com"
                  />
                </div>
                <div className="cv-form__field">
                  <Label>Phone</Label>
                  <Input
                    value={r.phone}
                    onChange={(e) => {
                      const arr = [...cv.references];
                      arr[i] = { ...arr[i], phone: e.target.value };
                      setCV(p => ({ ...p, references: arr }));
                    }}
                    placeholder="+234 800 000 0000"
                  />
                </div>
              </div>
            </div>
          ))}
          <button
            className="cv-form__add-btn"
            onClick={() => setCV(p => ({
              ...p,
              references: [...(p.references || []), { name: "", title: "", company: "", email: "", phone: "" }]
            }))}
          >
            <i className="fas fa-plus"></i> Add reference
          </button>
        </div>

      </div>
    );

    // STEP 6: BIODATA (Nigerian-specific)
    if (step === 6) return (
      <div className="cv-form__section">
        <SectionHeader step={6} done={steps[6]} />

        {[
          ["Date of birth", "dateOfBirth", "date", "fas fa-cake-candles"],
          ["Place of birth", "placeOfBirth", "text", "fas fa-location-dot"],
          ["State of origin", "stateOfOrigin", "text", "fas fa-map"],
          ["LGA", "lga", "text", "fas fa-map-pin"],
          ["Nationality", "nationality", "text", "fas fa-flag"],
          ["Religion", "religion", "text", "fas fa-hands-praying"],
          ["NIN", "nin", "text", "fas fa-id-card"],
        ].map(([lbl, key, type, icon]) => (
          <div className="cv-form__field" key={key}>
            <Label>{lbl}</Label>
            {type === "date" ? (
              // Date inputs give the user no way back to an empty value once a
              // date is picked, so pair it with an explicit clear button.
              <div className="cv-form__input-wrap">
                <Input
                  type="date"
                  value={cv[key] || ""}
                  onChange={upd(key)}
                  placeholder={lbl}
                  icon={icon}
                />
                {cv[key] ? (
                  <button
                    type="button"
                    className="cv-form__clear-btn"
                    aria-label={`Clear ${lbl}`}
                    title={`Clear ${lbl}`}
                    onClick={() => setCV(p => ({ ...p, [key]: "" }))}
                  >
                    ✕
                  </button>
                ) : null}
              </div>
            ) : (
              <Input
                type={type}
                value={cv[key] || ""}
                onChange={upd(key)}
                onBlur={key !== "nin" ? blur(key) : undefined}
                placeholder={lbl}
                icon={icon}
                inputMode={key === "nin" ? "numeric" : undefined}
              />
            )}
          </div>
        ))}

        <div className="cv-form__field">
          <Label>Gender</Label>
          <select
            className="cvf-select"
            value={cv.gender || ""}
            onChange={upd("gender")}
          >
            <option value="">Select gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Prefer not to say">Prefer not to say</option>
          </select>
        </div>

        <div className="cv-form__field">
          <Label>Marital status</Label>
          <select
            className="cvf-select"
            value={cv.maritalStatus || ""}
            onChange={upd("maritalStatus")}
          >
            <option value="">Select status</option>
            <option value="Single">Single</option>
            <option value="Married">Married</option>
            <option value="Divorced">Divorced</option>
            <option value="Widowed">Widowed</option>
          </select>
        </div>
      </div>
    );
  };

  return (
    <div className={`cv-form-panel ${tab === "preview" ? "cv-form-panel--hidden" : ""}`}>

      <FormHeader
        cv={cv}
        template={template}
        step={step}
        setStep={setStep}
        entitlement={entitlement}
        onAts={onAts}
        showTools={isMobile}
      />

      {/* key: each step fades in fresh */}
      <div className="cv-form__body cvf-body" key={step}>
        {renderStep()}
        <div className="cvf-nav">
          {step > 0 ? (
            <button
              onClick={() => setStep(s => s - 1)}
              className="cvf-nav__back"
            >
              <i className="fas fa-arrow-left"></i> Back
            </button>
          ) : <span />}
          {step < STEPS.length - 1 ? (
            <button
              onClick={() => setStep(s => s + 1)}
              className="cvf-nav__next"
            >
              Next: {STEP_META[step + 1].label} <i className="fas fa-arrow-right"></i>
            </button>
          ) : (
            <button onClick={onFinish} className="cvf-nav__next cvf-nav__next--finish">
              <i className="fas fa-flag-checkered"></i> {isMobile ? "Finish & preview" : "All done"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}