import { useState, useEffect, useRef } from "react";
import { STEPS } from "../utils/constants";
import { callClaude } from "../utils/callClaude";
import { smartCase, liveTitleCase, liveCapitalizeSentences, liveCommaListTitleCase } from "../utils/textCasing";


// ── UI ELEMENTS ──
function Label({ children }) {
  return <label className="cv-label">{children}</label>;
}

function Input({ value, onChange, onBlur, placeholder, type = "text" }) {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      placeholder={placeholder}
      className="cv-input"
    />
  );
}

function Textarea({ value, onChange, onBlur, placeholder, rows = 3 }) {
  return (
    <textarea
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      placeholder={placeholder}
      rows={rows}
      className="cv-textarea"
    />
  );
}

function AiBtn({ onClick, loading, label = "AI Suggest" }) {
  return (
    <button onClick={onClick} disabled={loading} className="cv-ai-btn">
      {loading ? (
        <><i className="fas fa-spinner fa-spin"></i> Thinking...</>
      ) : (
        <><i className="fas fa-magic"></i> {label}</>
      )}
    </button>
  );
}

export default function CVForm({ cv, setCV, template, step, setStep, tab }) {
  const [loading, setLoading] = useState({});

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

  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setCV(p => ({ ...p, photo: ev.target.result }));
    reader.readAsDataURL(file);
  };

  // ── STEPS ──
  const renderStep = () => {

    // STEP 0: PERSONAL
    if (step === 0) return (
      <div className="cv-form__section">
        <h2 className="cv-form__heading">Personal Information</h2>

        {(template === 2 || template === 4 || template === 6) && (
          <div className="cv-form__field">
            <Label>Profile Photo</Label>
            <input type="file" accept="image/*" onChange={handlePhoto} className="cv-file-input" />
            {cv.photo && <img src={cv.photo} alt="preview" className="cv-photo-preview" />}
          </div>
        )}

        {[
          ["Full Name", "name"],
          ["Job Title / Target Role", "jobTitle"],
          ["Email Address", "email"],
          ["Phone Number", "phone"],
          ["Address / Location", "address"],
          ["LinkedIn URL", "linkedin"],
          ["Website / Portfolio", "website"],
          ["GitHub URL", "github"],
        ].map(([lbl, key]) => (
          <div className="cv-form__field" key={key}>
            <Label>{lbl}</Label>
            <Input
              value={cv[key] || ""}
              onChange={upd(key)}
              onBlur={blur(key)}
              placeholder={lbl}
            />
          </div>
        ))}
      </div>
    );

    // STEP 1: SUMMARY & OBJECTIVE
    if (step === 1) return (
      <div className="cv-form__section">
        <h2 className="cv-form__heading">Summary & Objective</h2>

        <div className="cv-form__field">
          <Label>Professional Summary</Label>
          <Textarea
            value={cv.summary}
            onChange={upd("summary")}
            onBlur={blur("summary")}
            placeholder="A brief professional summary highlighting your key strengths..."
            rows={4}
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
          <Label>Career Objective</Label>
          <Textarea
            value={cv.objective}
            onChange={upd("objective")}
            onBlur={blur("objective")}
            placeholder="Your career objective and what you aim to achieve..."
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
        <h2 className="cv-form__heading">Work Experience</h2>
        {cv.experience.map((e, i) => (
          <div key={i} className="cv-form__card">
            <div className="cv-form__card-label">Experience {i + 1}</div>
            {[["Company / Organization", "company"], ["Job Title / Role", "role"]].map(([lbl, key]) => (
              <div className="cv-form__field" key={key}>
                <Label>{lbl}</Label>
                <Input
                  value={e[key]}
                  onChange={updExp(i, key)}
                  onBlur={blurExp(i, key)}
                  placeholder={lbl}
                />
              </div>
            ))}
            <div className="cv-form__grid">
              <div>
                <Label>Start Date</Label>
                <Input value={e.start} onChange={updExp(i, "start")} placeholder="e.g. Jan 2020" />
              </div>
              <div>
                <Label>End Date</Label>
                <Input value={e.end} onChange={updExp(i, "end")} placeholder="e.g. Dec 2022" />
              </div>
            </div>
            <label className="cv-form__checkbox">
              <input type="checkbox" checked={e.current} onChange={updExp(i, "current")} />
              Currently working here
            </label>
            <div className="cv-form__field">
              <Label>Responsibilities & Achievements</Label>
              <Textarea
                value={e.responsibilities}
                onChange={updExp(i, "responsibilities")}
                onBlur={blurExp(i, "responsibilities")}
                placeholder="Describe your key duties and achievements in this role..."
                rows={4}
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
          + Add Another Experience
        </button>
      </div>
    );

    // STEP 3: EDUCATION
    if (step === 3) return (
      <div className="cv-form__section">
        <h2 className="cv-form__heading">Education</h2>
        {cv.education.map((e, i) => (
          <div key={i} className="cv-form__card">
            <div className="cv-form__card-label">Education {i + 1}</div>
            {[
              ["School / University", "school"],
              ["Degree / Qualification", "degree"],
              ["Field of Study", "field"],
            ].map(([lbl, key]) => (
              <div className="cv-form__field" key={key}>
                <Label>{lbl}</Label>
                <Input
                  value={e[key]}
                  onChange={updEdu(i, key)}
                  onBlur={blurEdu(i, key)}
                  placeholder={lbl}
                />
              </div>
            ))}
            <div className="cv-form__grid">
              <div>
                <Label>Start Year</Label>
                <Input value={e.start} onChange={updEdu(i, "start")} placeholder="e.g. 2016" />
              </div>
              <div>
                <Label>End Year</Label>
                <Input value={e.end} onChange={updEdu(i, "end")} placeholder="e.g. 2020" />
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
          + Add Another Education
        </button>
      </div>
    );

    // STEP 4: SKILLS & MORE
    if (step === 4) return (
      <div className="cv-form__section">
        <h2 className="cv-form__heading">Skills & More</h2>

        <div className="cv-form__field">
          <Label>Skills</Label>
          <Textarea
            value={cv.skills}
            onChange={upd("skills")}
            onBlur={blur("skills")}
            placeholder="e.g. Project Management, Microsoft Excel, Leadership..."
            rows={3}
          />
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
            placeholder="e.g. English (Fluent), Yoruba (Native), French (Intermediate)"
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
          <Label>Hobbies & Interests</Label>
          <Input
            value={cv.hobbies}
            onChange={upd("hobbies")}
            onBlur={blur("hobbies")}
            placeholder="e.g. Reading, Football, Volunteering, Photography..."
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
          <Label>Certifications</Label>
          {Array.isArray(cv.certifications) && cv.certifications.map((cert, i) => (
            <div key={i} className="cv-form__card" style={{ marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div className="cv-form__card-label">Certification {i + 1}</div>
                <button
                  onClick={() => removeCert(i)}
                  style={{
                    background: "none", border: "none", color: "#ef4444",
                    cursor: "pointer", fontSize: "0.8rem", padding: "2px 6px"
                  }}
                >
                  <i className="fas fa-trash"></i>
                </button>
              </div>

              <div className="cv-form__field">
                <Label>Certification Name</Label>
                <Input
                  value={cert.name}
                  onChange={updCert(i, "name")}
                  onBlur={blurArr("certifications", i, "name")}
                  placeholder="e.g. Project Management Professional (PMP)"
                />
              </div>
              <div className="cv-form__field">
                <Label>Issuing Organization</Label>
                <Input
                  value={cert.issuer}
                  onChange={updCert(i, "issuer")}
                  onBlur={blurArr("certifications", i, "issuer")}
                  placeholder="e.g. Project Management Institute"
                />
              </div>
              <div className="cv-form__grid">
                <div>
                  <Label>Issue Date</Label>
                  <Input
                    value={cert.issueDate}
                    onChange={updCert(i, "issueDate")}
                    placeholder="e.g. Jan 2023"
                  />
                </div>
                <div>
                  <Label>Expiry Date</Label>
                  <Input
                    value={cert.expiryDate}
                    onChange={updCert(i, "expiryDate")}
                    placeholder="e.g. Jan 2026"
                    disabled={cert.noExpiry}
                  />
                </div>
              </div>
              <label className="cv-form__checkbox">
                <input
                  type="checkbox"
                  checked={cert.noExpiry}
                  onChange={updCert(i, "noExpiry")}
                />
                No expiry date
              </label>
              <div className="cv-form__grid">
                <div>
                  <Label>Credential ID (optional)</Label>
                  <Input
                    value={cert.credentialId}
                    onChange={updCert(i, "credentialId")}
                    placeholder="e.g. ABC-123456"
                  />
                </div>
                <div>
                  <Label>Credential URL (optional)</Label>
                  <Input
                    value={cert.credentialUrl}
                    onChange={updCert(i, "credentialUrl")}
                    placeholder="https://verify.example.com/..."
                  />
                </div>
              </div>
            </div>
          ))}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button onClick={addCert} className="cv-form__add-btn">
              + Add Certification
            </button>
            <AiBtn
              loading={loading.certifications}
              onClick={aiCertifications}
              label="AI Suggest Certifications"
            />
          </div>
        </div>

      </div>
    );

    // STEP 5: EXTRAS
    if (step === 5) return (
      <div className="cv-form__section">
        <h2 className="cv-form__heading">Extras</h2>

        {/* ACHIEVEMENTS */}
        <div className="cv-form__extras-group">
          <div className="cv-form__extras-header">
            <i className="fas fa-trophy"></i>
            <span>Achievements & Awards</span>
          </div>
          {cv.achievements?.map((a, i) => (
            <div key={i} className="cv-form__card">
              <div className="cv-form__card-label">Achievement {i + 1}</div>
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
            + Add Achievement
          </button>
        </div>

        {/* VOLUNTEER */}
        <div className="cv-form__extras-group">
          <div className="cv-form__extras-header">
            <i className="fas fa-hands-helping"></i>
            <span>Volunteer Work</span>
          </div>
          {cv.volunteer?.map((v, i) => (
            <div key={i} className="cv-form__card">
              <div className="cv-form__card-label">Volunteer {i + 1}</div>
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
            + Add Volunteer Work
          </button>
        </div>

        {/* PUBLICATIONS */}
        <div className="cv-form__extras-group">
          <div className="cv-form__extras-header">
            <i className="fas fa-book"></i>
            <span>Publications</span>
          </div>
          {cv.publications?.map((pub, i) => (
            <div key={i} className="cv-form__card">
              <div className="cv-form__card-label">Publication {i + 1}</div>
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
                  <Label>URL (optional)</Label>
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
            + Add Publication
          </button>
        </div>

        {/* REFERENCES */}
        <div className="cv-form__extras-group">
          <div className="cv-form__extras-header">
            <i className="fas fa-user-check"></i>
            <span>References</span>
          </div>
          {cv.references?.map((r, i) => (
            <div key={i} className="cv-form__card">
              <div className="cv-form__card-label">Reference {i + 1}</div>
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
            + Add Reference
          </button>
        </div>

      </div>
    );

    // STEP 6: BIODATA (Nigerian-specific)
    if (step === 6) return (
      <div className="cv-form__section">
        <h2 className="cv-form__heading">Personal Details</h2>
        <p style={{ fontSize: "0.8rem", color: "#888", margin: "-8px 0 8px" }}>
          Optional. Used for Nigerian traditional/government CVs.
        </p>

        {[
          ["Date of Birth", "dateOfBirth", "date"],
          ["Place of Birth", "placeOfBirth", "text"],
          ["State of Origin", "stateOfOrigin", "text"],
          ["LGA", "lga", "text"],
          ["Nationality", "nationality", "text"],
          ["Religion", "religion", "text"],
          ["NIN", "nin", "text"],
        ].map(([lbl, key, type]) => (
          <div className="cv-form__field" key={key}>
            <Label>{lbl}</Label>
            <Input
              type={type}
              value={cv[key] || ""}
              onChange={upd(key)}
              onBlur={type === "text" && key !== "nin" ? blur(key) : undefined}
              placeholder={lbl}
            />
          </div>
        ))}

        <div className="cv-form__field">
          <Label>Gender</Label>
          <select
            className="cv-input"
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
          <Label>Marital Status</Label>
          <select
            className="cv-input"
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

      {/* STEP NAV */}
      <div className="cv-steps">
        {STEPS.map((s, i) => (
          <button
            key={i}
            onClick={() => setStep(i)}
            className={`cv-steps__btn ${step === i ? "cv-steps__btn--active" : ""}`}
          >
            {i + 1}. {s}
          </button>
        ))}
      </div>

      <div className="cv-form__body">
        {renderStep()}
        <div className="cv-form__nav">
          {step > 0 && (
            <button
              onClick={() => setStep(s => s - 1)}
              className="cv-form__nav-btn cv-form__nav-btn--back"
            >
              <i className="fas fa-arrow-left"></i> Back
            </button>
          )}
          {step < STEPS.length - 1 && (
            <button
              onClick={() => setStep(s => s + 1)}
              className="cv-form__nav-btn cv-form__nav-btn--next"
            >
              Next <i className="fas fa-arrow-right"></i>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}