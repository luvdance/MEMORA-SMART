import { Label, Input, Textarea, AiBtn } from "./UIElements";
import { STEPS } from "../utils/constants";
import { callClaude } from "../utils/CallClaude";
import { smartCase, liveTitleCase, liveCapitalizeSentences, liveCommaListTitleCase } from "../utils/textCasing";
import { useState } from "react";

export default function CVForm({ cv, setCV, template, step, setStep, tab }) {
  const [loading, setLoading] = useState({});

  // ── UPDATE HANDLERS (live typing) ──
// Helper to determine which live-format a field needs
const getLiveFormat = (field) => {
  const f = field.toLowerCase();

  // No live formatting for these
  if (f.includes('email') || f.includes('linkedin') || f.includes('website') ||
      f.includes('github') || f.includes('twitter') || f.includes('url') ||
      f.includes('phone') || f.includes('nin') || f.includes('password') ||
      f.includes('date') || f.includes('start') || f.includes('end')) {
    return null;
  }

  // Comma-separated lists → live title case for EACH item
  if (f.includes('skills') || f.includes('languages') ||
      f.includes('certifications') || f.includes('hobbies')) {
    return 'commaList';
  }

  // Long-form fields → sentence-style live (first letter of sentences)
  if (f.includes('summary') || f.includes('objective') ||
      f.includes('description') || f.includes('responsibilit')) {
    return 'sentence';
  }

  // Everything else → live title case (each word as you type)
  return 'title';
};


// Apply live formatting based on field type
const applyLive = (field, value) => {
  const liveType = getLiveFormat(field);
  if (!liveType || !value) return value;
  if (liveType === 'sentence') return liveCapitalizeSentences(value);
  if (liveType === 'title') return liveTitleCase(value);
  if (liveType === 'commaList') return liveCommaListTitleCase(value);
  return value;
};

// ── UPDATE HANDLERS (live typing with smart capitalization) ──
const upd = (field) => (e) => {
  const val = applyLive(field, e.target.value);
  setCV(p => ({ ...p, [field]: val }));
};

const updExp = (i, field) => (e) => {
  const val = field === "current"
    ? e.target.checked
    : applyLive(field, e.target.value);
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

  // ── BLUR HANDLERS (auto-casing on blur) ──
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

  const addExp = () => setCV(p => ({
    ...p,
    experience: [...p.experience, { company: "", role: "", start: "", end: "", current: false, responsibilities: "" }]
  }));

  const addEdu = () => setCV(p => ({
    ...p,
    education: [...p.education, { school: "", degree: "", field: "", start: "", end: "" }]
  }));

  const aiSuggest = async (key, prompt) => {
    setLoading(l => ({ ...l, [key]: true }));
    try {
      const text = await callClaude(prompt);
      setCV(p => ({ ...p, [key]: text.trim() }));
    } catch (err) { alert("AI error: " + err.message); }
    setLoading(l => ({ ...l, [key]: false }));
  };

  const aiResponsibilities = async (i) => {
    const e = cv.experience[i];
    const key = "resp_" + i;
    setLoading(l => ({ ...l, [key]: true }));
    try {
      const text = await callClaude(
        `Write 4-5 concise bullet-point job responsibilities for a ${e.role || "professional"} at ${e.company || "a company"}. Use action verbs. Return only the bullet points, no preamble.`
      );
      const exp = [...cv.experience];
      exp[i] = { ...exp[i], responsibilities: text.trim() };
      setCV(p => ({ ...p, experience: exp }));
    } catch (err) { alert("AI error: " + err.message); }
    setLoading(l => ({ ...l, [key]: false }));
  };

  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setCV(p => ({ ...p, photo: ev.target.result }));
    reader.readAsDataURL(file);
  };

  const renderStep = () => {

    /* ─────────────── STEP 0: PERSONAL INFO ─────────────── */
    if (step === 0) return (
      <div className="cv-form__section">
        <h2 className="cv-form__heading">Personal Information</h2>
        {template === 2 && (
          <div className="cv-form__field">
            <Label>Profile Photo</Label>
            <input type="file" accept="image/*" onChange={handlePhoto} className="cv-file-input" />
            {cv.photo && <img src={cv.photo} alt="preview" className="cv-photo-preview" />}
          </div>
        )}
        {[
          ["Full Name", "name"],
          ["Job Title", "jobTitle"],
          ["Email", "email"],
          ["Phone", "phone"],
          ["Address", "address"],
          ["LinkedIn", "linkedin"],
          ["Website", "website"]
        ].map(([lbl, key]) => (
          <div className="cv-form__field" key={key}>
            <Label>{lbl}</Label>
            <Input
              value={cv[key]}
              onChange={upd(key)}
              onBlur={blur(key)}
              placeholder={lbl}
            />
          </div>
        ))}
      </div>
    );

    /* ─────────────── STEP 1: BIO DATA ─────────────── */
    if (step === 1) return (
      <div className="cv-form__section">
        <h2 className="cv-form__heading">
          <i className="fas fa-id-card" style={{ marginRight: 8 }}></i>
          Bio Data
        </h2>
        <p style={{ fontSize: "0.78rem", color: "#888", margin: "0 0 12px" }}>
          Optional — helpful for traditional CVs and government applications.
        </p>

        <div className="cv-form__grid">
          <div className="cv-form__field">
            <Label>Date of Birth</Label>
            <Input
              type="date"
              value={cv.dateOfBirth || ""}
              onChange={upd("dateOfBirth")}
              placeholder="YYYY-MM-DD"
            />
          </div>
          <div className="cv-form__field">
            <Label>Place of Birth</Label>
            <Input
              value={cv.placeOfBirth || ""}
              onChange={upd("placeOfBirth")}
              onBlur={blur("placeOfBirth")}
              placeholder="e.g. Lagos, Nigeria"
            />
          </div>
        </div>

        <div className="cv-form__grid">
          <div className="cv-form__field">
            <Label>Gender</Label>
            <select className="cv-input" value={cv.gender || ""} onChange={upd("gender")}>
              <option value="">Select...</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Prefer not to say">Prefer not to say</option>
            </select>
          </div>
          <div className="cv-form__field">
            <Label>Marital Status</Label>
            <select className="cv-input" value={cv.maritalStatus || ""} onChange={upd("maritalStatus")}>
              <option value="">Select...</option>
              <option value="Single">Single</option>
              <option value="Married">Married</option>
              <option value="Divorced">Divorced</option>
              <option value="Widowed">Widowed</option>
              <option value="Separated">Separated</option>
            </select>
          </div>
        </div>

        <div className="cv-form__grid">
          <div className="cv-form__field">
            <Label>Nationality</Label>
            <Input
              value={cv.nationality || ""}
              onChange={upd("nationality")}
              onBlur={blur("nationality")}
              placeholder="e.g. Nigerian"
            />
          </div>
          <div className="cv-form__field">
            <Label>State of Origin</Label>
            <Input
              value={cv.stateOfOrigin || ""}
              onChange={upd("stateOfOrigin")}
              onBlur={blur("stateOfOrigin")}
              placeholder="e.g. Lagos State"
            />
          </div>
        </div>

        <div className="cv-form__grid">
          <div className="cv-form__field">
            <Label>Local Government Area (LGA)</Label>
            <Input
              value={cv.lga || ""}
              onChange={upd("lga")}
              onBlur={blur("lga")}
              placeholder="e.g. Ikeja"
            />
          </div>
          <div className="cv-form__field">
            <Label>Religion</Label>
            <Input
              value={cv.religion || ""}
              onChange={upd("religion")}
              onBlur={blur("religion")}
              placeholder="e.g. Christianity, Islam, Other"
            />
          </div>
        </div>

        <div className="cv-form__field">
          <Label>National ID Number (NIN) — optional</Label>
          <Input
            value={cv.nin || ""}
            onChange={upd("nin")}
            placeholder="11-digit NIN"
          />
        </div>

        <div className="cv-form__field">
          <Label>Hobbies & Interests</Label>
          <Textarea
            value={cv.hobbies || ""}
            onChange={upd("hobbies")}
            onBlur={blur("hobbies")}
            placeholder="e.g. Reading, Football, Travel, Photography"
            rows={2}
          />
        </div>
      </div>
    );

    /* ─────────────── STEP 2: SUMMARY & OBJECTIVE ─────────────── */
    if (step === 2) return (
      <div className="cv-form__section">
        <h2 className="cv-form__heading">Summary & Objective</h2>
        <div className="cv-form__field">
          <Label>Professional Summary</Label>
          <Textarea
            value={cv.summary}
            onChange={upd("summary")}
            onBlur={blur("summary")}
            placeholder="A brief professional summary..."
            rows={4}
          />
          <AiBtn loading={loading.summary} onClick={() => aiSuggest("summary",
            `Write a compelling professional summary for a ${cv.jobTitle || "professional"} named ${cv.name || "a candidate"}. 3-4 sentences. No preamble.`)} />
        </div>
        <div className="cv-form__field">
          <Label>Career Objective</Label>
          <Textarea
            value={cv.objective}
            onChange={upd("objective")}
            onBlur={blur("objective")}
            placeholder="Your career objective..."
            rows={3}
          />
          <AiBtn loading={loading.objective} onClick={() => aiSuggest("objective",
            `Write a career objective for a ${cv.jobTitle || "professional"}. 2-3 sentences. No preamble.`)} />
        </div>
      </div>
    );

    /* ─────────────── STEP 3: WORK EXPERIENCE ─────────────── */
    if (step === 3) return (
      <div className="cv-form__section">
        <h2 className="cv-form__heading">Work Experience</h2>
        {cv.experience.map((e, i) => (
          <div key={i} className="cv-form__card">
            <div className="cv-form__card-label">Experience {i + 1}</div>
            {[["Company", "company"], ["Job Title / Role", "role"]].map(([lbl, key]) => (
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
              <Label>Responsibilities</Label>
              <Textarea
                value={e.responsibilities}
                onChange={updExp(i, "responsibilities")}
                onBlur={blurExp(i, "responsibilities")}
                placeholder="Describe your duties and achievements..."
                rows={4}
              />
              <AiBtn loading={loading["resp_" + i]} onClick={() => aiResponsibilities(i)} />
            </div>
          </div>
        ))}
        <button onClick={addExp} className="cv-form__add-btn">+ Add Another Experience</button>
      </div>
    );

    /* ─────────────── STEP 4: EDUCATION ─────────────── */
    if (step === 4) return (
      <div className="cv-form__section">
        <h2 className="cv-form__heading">Education</h2>
        {cv.education.map((e, i) => (
          <div key={i} className="cv-form__card">
            <div className="cv-form__card-label">Education {i + 1}</div>
            {[["School/University", "school"], ["Degree", "degree"], ["Field of Study", "field"]].map(([lbl, key]) => (
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
        <button onClick={addEdu} className="cv-form__add-btn">+ Add Another Education</button>
      </div>
    );

    /* ─────────────── STEP 5: SKILLS & MORE ─────────────── */
    if (step === 5) return (
      <div className="cv-form__section">
        <h2 className="cv-form__heading">Skills & More</h2>
        <div className="cv-form__field">
          <Label>Skills (comma or newline separated)</Label>
          <Textarea
            value={cv.skills}
            onChange={upd("skills")}
            onBlur={blur("skills")}
            placeholder="e.g. Project Management, Excel, Leadership..."
            rows={3}
          />
          <AiBtn loading={loading.skills} onClick={() => aiSuggest("skills",
            `List 8-10 relevant professional skills for a ${cv.jobTitle || "professional"}. Comma-separated only. No preamble.`)} />
        </div>
        <div className="cv-form__field">
          <Label>Languages</Label>
          <Input
            value={cv.languages}
            onChange={upd("languages")}
            onBlur={blur("languages")}
            placeholder="e.g. English (Fluent), French (Intermediate)"
          />
        </div>
        <div className="cv-form__field">
          <Label>Certifications</Label>
          <Textarea
            value={cv.certifications}
            onChange={upd("certifications")}
            onBlur={blur("certifications")}
            placeholder="e.g. PMP, AWS Certified..."
            rows={3}
          />
        </div>
      </div>
    );

    /* ─────────────── STEP 6: EXTRAS ─────────────── */
    if (step === 6) return (
      <div className="cv-form__section">
        <h2 className="cv-form__heading">Extras</h2>

        {/* ACHIEVEMENTS */}
        <div className="cv-form__extras-group">
          <div className="cv-form__extras-header">
            <i className="fas fa-trophy"></i>
            <span>Achievements & Awards</span>
          </div>
          {(cv.achievements || []).map((a, i) => (
            <div key={i} className="cv-form__card">
              <div className="cv-form__card-label">Achievement {i + 1}</div>
              <div className="cv-form__field">
                <Label>Title / Award Name</Label>
                <Input
                  value={a.title}
                  onChange={(e) => {
                    const arr = [...(cv.achievements || [])];
                    arr[i] = { ...arr[i], title: e.target.value };
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
                    const arr = [...(cv.achievements || [])];
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
                    const arr = [...(cv.achievements || [])];
                    arr[i] = { ...arr[i], description: e.target.value };
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
          {(cv.volunteer || []).map((v, i) => (
            <div key={i} className="cv-form__card">
              <div className="cv-form__card-label">Volunteer {i + 1}</div>
              <div className="cv-form__field">
                <Label>Organization</Label>
                <Input
                  value={v.organization}
                  onChange={(e) => {
                    const arr = [...(cv.volunteer || [])];
                    arr[i] = { ...arr[i], organization: e.target.value };
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
                    const arr = [...(cv.volunteer || [])];
                    arr[i] = { ...arr[i], role: e.target.value };
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
                      const arr = [...(cv.volunteer || [])];
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
                      const arr = [...(cv.volunteer || [])];
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
                    const arr = [...(cv.volunteer || [])];
                    arr[i] = { ...arr[i], description: e.target.value };
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
            <i className="fas fa-book-open"></i>
            <span>Publications</span>
          </div>
          {(cv.publications || []).map((pub, i) => (
            <div key={i} className="cv-form__card">
              <div className="cv-form__card-label">Publication {i + 1}</div>
              <div className="cv-form__field">
                <Label>Publication Title</Label>
                <Input
                  value={pub.title}
                  onChange={(e) => {
                    const arr = [...(cv.publications || [])];
                    arr[i] = { ...arr[i], title: e.target.value };
                    setCV(p => ({ ...p, publications: arr }));
                  }}
                  onBlur={blurArr("publications", i, "title")}
                  placeholder="e.g. Machine Learning in Healthcare"
                />
              </div>
              <div className="cv-form__grid">
                <div className="cv-form__field">
                  <Label>Journal / Publisher</Label>
                  <Input
                    value={pub.journal}
                    onChange={(e) => {
                      const arr = [...(cv.publications || [])];
                      arr[i] = { ...arr[i], journal: e.target.value };
                      setCV(p => ({ ...p, publications: arr }));
                    }}
                    onBlur={blurArr("publications", i, "journal")}
                    placeholder="e.g. IEEE, Springer"
                  />
                </div>
                <div className="cv-form__field">
                  <Label>Date Published</Label>
                  <Input
                    value={pub.date}
                    onChange={(e) => {
                      const arr = [...(cv.publications || [])];
                      arr[i] = { ...arr[i], date: e.target.value };
                      setCV(p => ({ ...p, publications: arr }));
                    }}
                    placeholder="e.g. March 2023"
                  />
                </div>
              </div>
              <div className="cv-form__field">
                <Label>Publication Link / DOI</Label>
                <div className="cv-form__link-wrap">
                  <i className="fas fa-link"></i>
                  <input
                    className="cv-input"
                    type="url"
                    value={pub.url}
                    onChange={(e) => {
                      const arr = [...(cv.publications || [])];
                      arr[i] = { ...arr[i], url: e.target.value };
                      setCV(p => ({ ...p, publications: arr }));
                    }}
                    onBlur={blurArr("publications", i, "url")}
                    placeholder="https://doi.org/... or publication URL"
                  />
                </div>
              </div>
              <div className="cv-form__field">
                <Label>Brief Description</Label>
                <Textarea
                  value={pub.description}
                  onChange={(e) => {
                    const arr = [...(cv.publications || [])];
                    arr[i] = { ...arr[i], description: e.target.value };
                    setCV(p => ({ ...p, publications: arr }));
                  }}
                  onBlur={blurArr("publications", i, "description")}
                  placeholder="Briefly describe what this publication is about..."
                  rows={2}
                />
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
          {(cv.references || []).map((r, i) => (
            <div key={i} className="cv-form__card">
              <div className="cv-form__card-label">Reference {i + 1}</div>
              <div className="cv-form__grid">
                <div className="cv-form__field">
                  <Label>Full Name</Label>
                  <Input
                    value={r.name}
                    onChange={(e) => {
                      const arr = [...(cv.references || [])];
                      arr[i] = { ...arr[i], name: e.target.value };
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
                      const arr = [...(cv.references || [])];
                      arr[i] = { ...arr[i], title: e.target.value };
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
                      const arr = [...(cv.references || [])];
                      arr[i] = { ...arr[i], company: e.target.value };
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
                      const arr = [...(cv.references || [])];
                      arr[i] = { ...arr[i], email: e.target.value };
                      setCV(p => ({ ...p, references: arr }));
                    }}
                    onBlur={blurArr("references", i, "email")}
                    placeholder="john@company.com"
                  />
                </div>
                <div className="cv-form__field">
                  <Label>Phone</Label>
                  <Input
                    value={r.phone}
                    onChange={(e) => {
                      const arr = [...(cv.references || [])];
                      arr[i] = { ...arr[i], phone: e.target.value };
                      setCV(p => ({ ...p, references: arr }));
                    }}
                    onBlur={blurArr("references", i, "phone")}
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
  };

  return (
    <div className={`cv-form-panel ${tab === "preview" ? "cv-form-panel--hidden" : ""}`}>
      {/* Step Nav */}
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
            <button onClick={() => setStep(s => s - 1)} className="cv-form__nav-btn cv-form__nav-btn--back">
              <i className="fas fa-arrow-left"></i> Back
            </button>
          )}
          {step < STEPS.length - 1 && (
            <button onClick={() => setStep(s => s + 1)} className="cv-form__nav-btn cv-form__nav-btn--next">
              Next <i className="fas fa-arrow-right"></i>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}