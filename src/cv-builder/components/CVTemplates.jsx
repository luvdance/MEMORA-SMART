// Date helper
function formatDate(dateStr) {
  if (!dateStr) return "";
  try {
    const d = new Date(dateStr);
    if (isNaN(d)) return dateStr;
    return d.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

// Contact icon helper
function ContactItem({ icon, text, color, fontSize }) {
  if (!text) return null;
  const isFab = icon.includes("fab");
  const iconClass = icon.replace(" fab", "");
  return (
    <p style={{
      fontSize,
      margin: "3px 0",
      display: "flex",
      alignItems: "center",
      gap: 6,
      color,
    }}>
      <i
        className={`${isFab ? "fab" : "fas"} ${iconClass}`}
        style={{ fontSize: fontSize - 1, width: 12, textAlign: "center" }}
      ></i>
      <span>{text}</span>
    </p>
  );
}

// ── HELPER COMPONENTS ──

function Section({ title, accent, format, children, keepTogether = false }) {
  return (
    <div
      className={keepTogether ? "cv-section cv-section-keep" : "cv-section"}
      style={{ marginBottom: 10 }}
    >
      <div
        className="cv-section-heading"
        style={{
          fontSize: format.headingFontSize,
          fontWeight: format.headingBold ? "bold" : "normal",
          fontStyle: format.headingItalic ? "italic" : "normal",
          textTransform: format.headingUppercase ? "uppercase" : "none",
          letterSpacing: 1,
          color: accent,
          borderBottom: `1px solid ${accent}`,
          paddingBottom: 2,
          marginBottom: 5,
        }}
      >
        {title}
      </div>
      {children}
    </div>
  );
}

function MinimalSection({ title, format, theme, children, keepTogether = false }) {
  return (
    <div
      className={keepTogether ? "cv-section cv-section-keep" : "cv-section"}
      style={{ marginBottom: 12 }}
    >
      <div
        className="cv-section-heading"
        style={{
          fontSize: format.headingFontSize,
          fontWeight: format.headingBold ? "bold" : "normal",
          textTransform: format.headingUppercase ? "uppercase" : "none",
          letterSpacing: 2,
          color: theme.text,
          opacity: 0.5,
          paddingBottom: 3,
          marginBottom: 6,
        }}
      >
        {title}
      </div>
      {children}
    </div>
  );
}

function SideSection({ title, format, children }) {
  return (
    <div className="cv-section" style={{ marginBottom: 10 }}>
      <div className="cv-section-heading" style={{
        fontSize: format.headingFontSize - 1,
        fontWeight: format.headingBold ? "bold" : "normal",
        textTransform: format.headingUppercase ? "uppercase" : "none",
        letterSpacing: 1,
        color: "#94a3b8",
        borderBottom: "1px solid #334155",
        paddingBottom: 2,
        marginBottom: 5,
      }}>
        {title}
      </div>
      {children}
    </div>
  );
}

function CreativeSideSection({ title, accent, format, children }) {
  return (
    <div className="cv-section" style={{ marginBottom: 12 }}>
      <div className="cv-section-heading" style={{
        fontSize: format.headingFontSize,
        fontWeight: "bold",
        textTransform: format.headingUppercase ? "uppercase" : "none",
        letterSpacing: 1,
        color: "#fff",
        opacity: 0.7,
        marginBottom: 6,
      }}>
        {title}
      </div>
      {children}
    </div>
  );
}

function SkillList({ skills, dark, format, accent }) {
  const list = skills.split(/[,\n]+/).map(s => s.trim()).filter(Boolean);
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
      {list.map((s, i) => (
        <span key={i} style={{
          background: dark ? "rgba(255,255,255,0.15)" : `${accent}18`,
          color: dark ? "#e2e8f0" : accent,
          borderRadius: 4,
          padding: "2px 8px",
          fontSize: format.bodyFontSize - 1,
          border: dark ? "none" : `1px solid ${accent}33`,
        }}>
          {s}
        </span>
      ))}
    </div>
  );
}

function TwoCol({ left, right }) {
  return (
    <div style={{ display: "flex", gap: 20 }}>
      <div style={{ flex: 2 }}>{left}</div>
      <div style={{ flex: 1 }}>{right}</div>
    </div>
  );
}

// ── SHARED SECTION RENDERER ──
function renderMainSection(key, cv, accent, format, theme) {
  const s = format.bodyFontSize;
  const lh = format.lineHeight;
  const tc = theme?.text || "#222";

  switch (key) {

    case "biodata": {
      const hasBioData = cv.dateOfBirth || cv.gender || cv.maritalStatus ||
        cv.nationality || cv.stateOfOrigin || cv.lga || cv.placeOfBirth ||
        cv.religion || cv.nin;
      if (!hasBioData) return null;

      return (
        <Section key={key} title="Personal Details" accent={accent} format={format} keepTogether>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px 16px" }}>
            {cv.dateOfBirth && (
              <div style={{ fontSize: s, marginBottom: 4 }}>
                <span style={{ fontWeight: "bold", color: tc, opacity: 0.8 }}>Date of Birth: </span>
                <span style={{ color: tc, opacity: 0.7 }}>{formatDate(cv.dateOfBirth)}</span>
              </div>
            )}
            {cv.placeOfBirth && (
              <div style={{ fontSize: s, marginBottom: 4 }}>
                <span style={{ fontWeight: "bold", color: tc, opacity: 0.8 }}>Place of Birth: </span>
                <span style={{ color: tc, opacity: 0.7 }}>{cv.placeOfBirth}</span>
              </div>
            )}
            {cv.gender && (
              <div style={{ fontSize: s, marginBottom: 4 }}>
                <span style={{ fontWeight: "bold", color: tc, opacity: 0.8 }}>Gender: </span>
                <span style={{ color: tc, opacity: 0.7 }}>{cv.gender}</span>
              </div>
            )}
            {cv.maritalStatus && (
              <div style={{ fontSize: s, marginBottom: 4 }}>
                <span style={{ fontWeight: "bold", color: tc, opacity: 0.8 }}>Marital Status: </span>
                <span style={{ color: tc, opacity: 0.7 }}>{cv.maritalStatus}</span>
              </div>
            )}
            {cv.nationality && (
              <div style={{ fontSize: s, marginBottom: 4 }}>
                <span style={{ fontWeight: "bold", color: tc, opacity: 0.8 }}>Nationality: </span>
                <span style={{ color: tc, opacity: 0.7 }}>{cv.nationality}</span>
              </div>
            )}
            {cv.stateOfOrigin && (
              <div style={{ fontSize: s, marginBottom: 4 }}>
                <span style={{ fontWeight: "bold", color: tc, opacity: 0.8 }}>State of Origin: </span>
                <span style={{ color: tc, opacity: 0.7 }}>{cv.stateOfOrigin}</span>
              </div>
            )}
            {cv.lga && (
              <div style={{ fontSize: s, marginBottom: 4 }}>
                <span style={{ fontWeight: "bold", color: tc, opacity: 0.8 }}>LGA: </span>
                <span style={{ color: tc, opacity: 0.7 }}>{cv.lga}</span>
              </div>
            )}
            {cv.religion && (
              <div style={{ fontSize: s, marginBottom: 4 }}>
                <span style={{ fontWeight: "bold", color: tc, opacity: 0.8 }}>Religion: </span>
                <span style={{ color: tc, opacity: 0.7 }}>{cv.religion}</span>
              </div>
            )}
            {cv.nin && (
              <div style={{ fontSize: s, marginBottom: 4 }}>
                <span style={{ fontWeight: "bold", color: tc, opacity: 0.8 }}>NIN: </span>
                <span style={{ color: tc, opacity: 0.7 }}>{cv.nin}</span>
              </div>
            )}
          </div>
        </Section>
      );
    }

    case "summary":
      return cv.summary ? (
        <Section key={key} title="Professional Summary" accent={accent} format={format} keepTogether>
          <p style={{ fontSize: s, lineHeight: lh, margin: "4px 0", color: tc }}>{cv.summary}</p>
        </Section>
      ) : null;

    case "objective":
      return cv.objective ? (
        <Section key={key} title="Career Objective" accent={accent} format={format} keepTogether>
          <p style={{ fontSize: s, lineHeight: lh, margin: "4px 0", color: tc }}>{cv.objective}</p>
        </Section>
      ) : null;

    case "experience":
      return cv.experience[0]?.company ? (
        <Section key={key} title="Work Experience" accent={accent} format={format}>
          {cv.experience.map((e, i) => (
            <div key={i} className="cv-item" style={{ marginBottom: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <b style={{ fontSize: s, color: tc }}>{e.role}</b>
                <span style={{ fontSize: s - 1, color: tc, opacity: 0.6 }}>
                  {e.start} – {e.current ? "Present" : e.end}
                </span>
              </div>
              <div style={{ color: accent, fontSize: s - 1 }}>{e.company}</div>
              <div style={{ whiteSpace: "pre-wrap", fontSize: s - 1, marginTop: 3, lineHeight: lh, color: tc, opacity: 0.85 }}>
                {e.responsibilities}
              </div>
            </div>
          ))}
        </Section>
      ) : null;

    case "education":
      return cv.education[0]?.school ? (
        <Section key={key} title="Education" accent={accent} format={format}>
          {cv.education.map((e, i) => (
            <div key={i} className="cv-item" style={{ marginBottom: 8 }}>
              <b style={{ fontSize: s, color: tc }}>{e.degree} {e.field && `in ${e.field}`}</b>
              <br />
              <span style={{ fontSize: s - 1, color: tc, opacity: 0.7 }}>{e.school}</span>
              <span style={{ fontSize: s - 1, color: tc, opacity: 0.5, marginLeft: 8 }}>
                {e.start} – {e.end}
              </span>
            </div>
          ))}
        </Section>
      ) : null;

    case "achievements":
      return cv.achievements?.[0]?.title ? (
        <Section key={key} title="Achievements & Awards" accent={accent} format={format}>
          {cv.achievements.map((a, i) => (
            <div key={i} className="cv-item" style={{ marginBottom: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <b style={{ fontSize: s, color: tc }}>{a.title}</b>
                <span style={{ fontSize: s - 1, color: tc, opacity: 0.6 }}>{a.date}</span>
              </div>
              {a.description && (
                <div style={{ fontSize: s - 1, lineHeight: lh, marginTop: 2, color: tc, opacity: 0.8 }}>
                  {a.description}
                </div>
              )}
            </div>
          ))}
        </Section>
      ) : null;

    case "volunteer":
      return cv.volunteer?.[0]?.organization ? (
        <Section key={key} title="Volunteer Work" accent={accent} format={format}>
          {cv.volunteer.map((v, i) => (
            <div key={i} className="cv-item" style={{ marginBottom: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <b style={{ fontSize: s, color: tc }}>{v.role}</b>
                <span style={{ fontSize: s - 1, color: tc, opacity: 0.6 }}>{v.start} – {v.end}</span>
              </div>
              <div style={{ fontSize: s - 1, color: accent }}>{v.organization}</div>
              {v.description && (
                <div style={{ fontSize: s - 1, lineHeight: lh, marginTop: 2, color: tc, opacity: 0.8 }}>
                  {v.description}
                </div>
              )}
            </div>
          ))}
        </Section>
      ) : null;

    case "publications":
      return cv.publications?.[0]?.title ? (
        <Section key={key} title="Publications" accent={accent} format={format}>
          {cv.publications.map((pub, i) => {
            const linkStyle = {
              fontSize: s - 1,
              color: accent,
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
            };
            return (
              <div key={i} className="cv-item" style={{ marginBottom: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <b style={{ fontSize: s, color: tc }}>{pub.title}</b>
                  <span style={{ fontSize: s - 1, color: tc, opacity: 0.6 }}>{pub.date}</span>
                </div>
                {pub.journal && (
                  <div style={{ fontSize: s - 1, color: tc, opacity: 0.7, fontStyle: "italic" }}>
                    {pub.journal}
                  </div>
                )}
                {pub.description && (
                  <div style={{ fontSize: s - 1, lineHeight: lh, marginTop: 2, color: tc, opacity: 0.8 }}>
                    {pub.description}
                  </div>
                )}
                {pub.url && (
                  <div style={{ marginTop: 3 }}>
                    <a href={pub.url} target="_blank" rel="noopener noreferrer" style={linkStyle}>
                      {"🔗 "}
                      {pub.url.length > 50 ? pub.url.substring(0, 50) + "..." : pub.url}
                    </a>
                  </div>
                )}
              </div>
            );
          })}
        </Section>
      ) : null;

    case "skills":
      return cv.skills ? (
        <Section key={key} title="Skills" accent={accent} format={format} keepTogether>
          <SkillList skills={cv.skills} format={format} accent={accent} />
        </Section>
      ) : null;

    case "languages":
      return cv.languages ? (
        <Section key={key} title="Languages" accent={accent} format={format} keepTogether>
          <p style={{ fontSize: s, margin: "4px 0", color: tc }}>{cv.languages}</p>
        </Section>
      ) : null;

    case "certifications":
      return cv.certifications ? (
        <Section key={key} title="Certifications" accent={accent} format={format} keepTogether>
          <p style={{ whiteSpace: "pre-wrap", fontSize: s, margin: "4px 0", color: tc }}>
            {cv.certifications}
          </p>
        </Section>
      ) : null;

    case "hobbies":
      return cv.hobbies ? (
        <Section key={key} title="Hobbies & Interests" accent={accent} format={format} keepTogether>
          <p style={{ fontSize: s, lineHeight: lh, margin: "4px 0", color: tc }}>{cv.hobbies}</p>
        </Section>
      ) : null;

    case "references":
      return cv.references?.[0]?.name ? (
        <Section key={key} title="References" accent={accent} format={format} keepTogether>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
            {cv.references.map((r, i) => (
              <div key={i} className="cv-item" style={{ minWidth: 180 }}>
                <b style={{ fontSize: s, color: tc }}>{r.name}</b>
                <br />
                <span style={{ fontSize: s - 1, color: tc, opacity: 0.7 }}>{r.title}</span>
                {r.company && (
                  <span style={{ fontSize: s - 1, color: tc, opacity: 0.7 }}> — {r.company}</span>
                )}
                <br />
                {r.email && (
                  <span style={{ fontSize: s - 1, color: tc, opacity: 0.6 }}>{r.email}</span>
                )}
                {r.phone && (
                  <span style={{ fontSize: s - 1, color: tc, opacity: 0.6 }}> · {r.phone}</span>
                )}
              </div>
            ))}
          </div>
        </Section>
      ) : null;

    default:
      return null;
  }
}

// ── MINIMAL SECTION RENDERER ──
function renderMinimalSection(key, cv, accent, format, theme) {
  const s = format.bodyFontSize;
  const lh = format.lineHeight;
  const tc = theme?.text || "#222";

  switch (key) {

    case "biodata": {
      const hasMinBioData = cv.dateOfBirth || cv.gender || cv.maritalStatus ||
        cv.nationality || cv.stateOfOrigin || cv.lga || cv.placeOfBirth ||
        cv.religion || cv.nin;
      if (!hasMinBioData) return null;

      return (
        <MinimalSection key={key} title="Personal Details" format={format} theme={theme} keepTogether>
          <div style={{ paddingLeft: 10, borderLeft: `2px solid ${accent}` }}>
            {cv.dateOfBirth && <div style={{ fontSize: s - 1, color: tc, marginBottom: 2 }}><b>Date of Birth:</b> {formatDate(cv.dateOfBirth)}</div>}
            {cv.placeOfBirth && <div style={{ fontSize: s - 1, color: tc, marginBottom: 2 }}><b>Place of Birth:</b> {cv.placeOfBirth}</div>}
            {cv.gender && <div style={{ fontSize: s - 1, color: tc, marginBottom: 2 }}><b>Gender:</b> {cv.gender}</div>}
            {cv.maritalStatus && <div style={{ fontSize: s - 1, color: tc, marginBottom: 2 }}><b>Marital Status:</b> {cv.maritalStatus}</div>}
            {cv.nationality && <div style={{ fontSize: s - 1, color: tc, marginBottom: 2 }}><b>Nationality:</b> {cv.nationality}</div>}
            {cv.stateOfOrigin && <div style={{ fontSize: s - 1, color: tc, marginBottom: 2 }}><b>State of Origin:</b> {cv.stateOfOrigin}</div>}
            {cv.lga && <div style={{ fontSize: s - 1, color: tc, marginBottom: 2 }}><b>LGA:</b> {cv.lga}</div>}
            {cv.religion && <div style={{ fontSize: s - 1, color: tc, marginBottom: 2 }}><b>Religion:</b> {cv.religion}</div>}
            {cv.nin && <div style={{ fontSize: s - 1, color: tc, marginBottom: 2 }}><b>NIN:</b> {cv.nin}</div>}
          </div>
        </MinimalSection>
      );
    }

    case "summary":
      return cv.summary ? (
        <MinimalSection key={key} title="Summary" format={format} theme={theme} keepTogether>
          <p style={{ fontSize: s, lineHeight: lh, margin: "4px 0", color: tc }}>{cv.summary}</p>
        </MinimalSection>
      ) : null;

    case "objective":
      return cv.objective ? (
        <MinimalSection key={key} title="Objective" format={format} theme={theme} keepTogether>
          <p style={{ fontSize: s, lineHeight: lh, margin: "4px 0", color: tc }}>{cv.objective}</p>
        </MinimalSection>
      ) : null;

    case "experience":
      return cv.experience[0]?.company ? (
        <MinimalSection key={key} title="Experience" format={format} theme={theme}>
          {cv.experience.map((e, i) => (
            <div key={i} className="cv-item" style={{ marginBottom: 10, paddingLeft: 10, borderLeft: `2px solid ${accent}` }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <b style={{ fontSize: s, color: tc }}>{e.role}</b>
                <span style={{ fontSize: s - 1, color: tc, opacity: 0.55 }}>
                  {e.start} – {e.current ? "Present" : e.end}
                </span>
              </div>
              <div style={{ fontSize: s - 1, color: accent, marginBottom: 2 }}>{e.company}</div>
              <div style={{ whiteSpace: "pre-wrap", fontSize: s - 1, lineHeight: lh, color: tc, opacity: 0.8 }}>
                {e.responsibilities}
              </div>
            </div>
          ))}
        </MinimalSection>
      ) : null;

    case "education":
      return cv.education[0]?.school ? (
        <MinimalSection key={key} title="Education" format={format} theme={theme}>
          {cv.education.map((e, i) => (
            <div key={i} className="cv-item" style={{ marginBottom: 8, paddingLeft: 10, borderLeft: `2px solid ${accent}` }}>
              <b style={{ fontSize: s, color: tc }}>{e.degree} {e.field && `in ${e.field}`}</b>
              <div style={{ fontSize: s - 1, color: tc, opacity: 0.7 }}>
                {e.school} · {e.start} – {e.end}
              </div>
            </div>
          ))}
        </MinimalSection>
      ) : null;

    case "skills":
      return cv.skills ? (
        <MinimalSection key={key} title="Skills" format={format} theme={theme} keepTogether>
          <SkillList skills={cv.skills} format={format} accent={accent} />
        </MinimalSection>
      ) : null;

    case "achievements":
      return cv.achievements?.[0]?.title ? (
        <MinimalSection key={key} title="Achievements" format={format} theme={theme}>
          {cv.achievements.map((a, i) => (
            <div key={i} className="cv-item" style={{ marginBottom: 6, paddingLeft: 10, borderLeft: `2px solid ${accent}` }}>
              <b style={{ fontSize: s, color: tc }}>{a.title}</b>
              {a.date && <span style={{ fontSize: s - 1, color: tc, opacity: 0.55, marginLeft: 8 }}>{a.date}</span>}
              {a.description && <div style={{ fontSize: s - 1, color: tc, opacity: 0.75, marginTop: 2 }}>{a.description}</div>}
            </div>
          ))}
        </MinimalSection>
      ) : null;

    case "volunteer":
      return cv.volunteer?.[0]?.organization ? (
        <MinimalSection key={key} title="Volunteer" format={format} theme={theme}>
          {cv.volunteer.map((v, i) => (
            <div key={i} className="cv-item" style={{ marginBottom: 8, paddingLeft: 10, borderLeft: `2px solid ${accent}` }}>
              <b style={{ fontSize: s, color: tc }}>{v.role}</b>
              <div style={{ fontSize: s - 1, color: accent }}>{v.organization}</div>
              <div style={{ fontSize: s - 1, color: tc, opacity: 0.55 }}>{v.start} – {v.end}</div>
              {v.description && <div style={{ fontSize: s - 1, color: tc, opacity: 0.75, marginTop: 2 }}>{v.description}</div>}
            </div>
          ))}
        </MinimalSection>
      ) : null;

    case "publications":
      return cv.publications?.[0]?.title ? (
        <MinimalSection key={key} title="Publications" format={format} theme={theme}>
          {cv.publications.map((pub, i) => {
            const linkStyle = { fontSize: s - 1, color: accent, textDecoration: "none" };
            return (
              <div key={i} className="cv-item" style={{ marginBottom: 8, paddingLeft: 10, borderLeft: `2px solid ${accent}` }}>
                <b style={{ fontSize: s, color: tc }}>{pub.title}</b>
                {pub.journal && <div style={{ fontSize: s - 1, color: tc, opacity: 0.65, fontStyle: "italic" }}>{pub.journal}</div>}
                {pub.date && <div style={{ fontSize: s - 1, color: tc, opacity: 0.5 }}>{pub.date}</div>}
                {pub.url && <a href={pub.url} target="_blank" rel="noopener noreferrer" style={linkStyle}>{"🔗 "}{pub.url.length > 45 ? pub.url.substring(0, 45) + "..." : pub.url}</a>}
              </div>
            );
          })}
        </MinimalSection>
      ) : null;

    case "languages":
      return cv.languages ? (
        <MinimalSection key={key} title="Languages" format={format} theme={theme} keepTogether>
          <p style={{ fontSize: s, color: tc, margin: "4px 0" }}>{cv.languages}</p>
        </MinimalSection>
      ) : null;

    case "certifications":
      return cv.certifications ? (
        <MinimalSection key={key} title="Certifications" format={format} theme={theme} keepTogether>
          <p style={{ fontSize: s, color: tc, whiteSpace: "pre-wrap", margin: "4px 0" }}>{cv.certifications}</p>
        </MinimalSection>
      ) : null;

    case "hobbies":
      return cv.hobbies ? (
        <MinimalSection key={key} title="Hobbies & Interests" format={format} theme={theme} keepTogether>
          <p style={{ fontSize: s, lineHeight: lh, margin: "4px 0", color: tc, paddingLeft: 10, borderLeft: `2px solid ${accent}` }}>{cv.hobbies}</p>
        </MinimalSection>
      ) : null;

    case "references":
      return cv.references?.[0]?.name ? (
        <MinimalSection key={key} title="References" format={format} theme={theme} keepTogether>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
            {cv.references.map((r, i) => (
              <div key={i} className="cv-item" style={{ minWidth: 160, paddingLeft: 10, borderLeft: `2px solid ${accent}` }}>
                <b style={{ fontSize: s, color: tc }}>{r.name}</b>
                <div style={{ fontSize: s - 1, color: tc, opacity: 0.7 }}>{r.title}{r.company && ` — ${r.company}`}</div>
                <div style={{ fontSize: s - 1, color: tc, opacity: 0.55 }}>{r.email}{r.phone && ` · ${r.phone}`}</div>
              </div>
            ))}
          </div>
        </MinimalSection>
      ) : null;

    default:
      return null;
  }
}

// Sections in ExecutivePlus / CreativeSide sidebar
const SIDE_SECTIONS = ["skills", "languages", "certifications"];

// ── SIDEBAR SECTION RENDERER (ExecutivePlus) ──
function renderSideSection(key, cv, format) {
  const s = format.bodyFontSize;
  switch (key) {
    case "skills":
      return cv.skills ? (
        <SideSection key={key} title="Skills" format={format}>
          <SkillList skills={cv.skills} dark format={format} accent="#6699FF" />
        </SideSection>
      ) : null;
    case "languages":
      return cv.languages ? (
        <SideSection key={key} title="Languages" format={format}>
          <p style={{ fontSize: s - 1, margin: "3px 0", color: "#e2e8f0" }}>{cv.languages}</p>
        </SideSection>
      ) : null;
    case "certifications":
      return cv.certifications ? (
        <SideSection key={key} title="Certifications" format={format}>
          <p style={{ fontSize: s - 1, whiteSpace: "pre-wrap", margin: "3px 0", color: "#e2e8f0" }}>
            {cv.certifications}
          </p>
        </SideSection>
      ) : null;
    default:
      return null;
  }
}

// ══════════════════════════════════════════════
// ── TEMPLATE 1: CLASSIC PRO ──
// ══════════════════════════════════════════════
export function ClassicPro({ cv, accent, format, sectionOrder, theme }) {
  const leftSections = [
    "biodata", "summary", "objective", "experience", "education",
    "achievements", "volunteer", "publications", "hobbies", "references"
  ];
  const rightSections = ["skills", "languages", "certifications"];

  const orderedLeft = sectionOrder.filter(s => leftSections.includes(s));
  const orderedRight = sectionOrder.filter(s => rightSections.includes(s));

  return (
    <div style={{
      fontFamily: format.fontFamily,
      fontSize: format.bodyFontSize,
      color: theme.text,
      lineHeight: format.lineHeight,
      background: theme.bg,
      minHeight: "100%",
      padding: `0 ${format.pagePadding}px`,
      boxSizing: "border-box",
    }}>
      {/* HEADER — top padding here makes page 1 breathe */}
      <div style={{ borderBottom: `3px solid ${accent}`, paddingTop: format.pagePadding, paddingBottom: 10, marginBottom: 10 }}>
        <div style={{
          fontSize: format.nameFontSize,
          fontWeight: format.nameBold ? "bold" : "normal",
          fontStyle: format.nameItalic ? "italic" : "normal",
          color: accent,
        }}>
          {cv.name || "Your Name"}
        </div>
        <div style={{ fontSize: format.bodyFontSize + 1, color: theme.text, opacity: 0.7, marginTop: 2 }}>
          {cv.jobTitle}
        </div>
        <div style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 12,
          marginTop: 6,
          fontSize: format.bodyFontSize - 1,
          color: theme.text,
          opacity: 0.7,
        }}>
          {cv.email && (
            <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
              <i className="fas fa-envelope" style={{ color: accent, fontSize: format.bodyFontSize - 2 }}></i>
              {cv.email}
            </span>
          )}
          {cv.phone && (
            <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
              <i className="fas fa-phone" style={{ color: accent, fontSize: format.bodyFontSize - 2 }}></i>
              {cv.phone}
            </span>
          )}
          {cv.address && (
            <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
              <i className="fas fa-map-marker-alt" style={{ color: accent, fontSize: format.bodyFontSize - 2 }}></i>
              {cv.address}
            </span>
          )}
          {cv.linkedin && (
            <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
              <i className="fab fa-linkedin" style={{ color: accent, fontSize: format.bodyFontSize - 2 }}></i>
              {cv.linkedin}
            </span>
          )}
        </div>
      </div>

      <TwoCol
        left={<>{orderedLeft.map(key => renderMainSection(key, cv, accent, format, theme))}</>}
        right={<>{orderedRight.map(key => renderMainSection(key, cv, accent, format, theme))}</>}
      />
    </div>
  );
}

// ══════════════════════════════════════════════
// ── TEMPLATE 2: MODERN EDGE ──
// ══════════════════════════════════════════════
export function ModernEdge({ cv, accent, format, sectionOrder, theme }) {
  return (
    <div style={{
      fontFamily: format.fontFamily,
      fontSize: format.bodyFontSize,
      color: theme.text,
      lineHeight: format.lineHeight,
      background: theme.bg,
      minHeight: "100%",
      boxSizing: "border-box",
    }}>
      {/* HEADER — bleeds full-width */}
      <div style={{ background: accent, color: "#fff", padding: "16px 20px", marginBottom: 14 }}>
        <div style={{
          fontSize: format.nameFontSize,
          fontWeight: format.nameBold ? 900 : "normal",
          fontStyle: format.nameItalic ? "italic" : "normal",
          letterSpacing: 1,
        }}>
          {cv.name || "Your Name"}
        </div>
        <div style={{ fontSize: format.bodyFontSize + 1, opacity: 0.85, marginTop: 2 }}>{cv.jobTitle}</div>
        <div style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 14,
          marginTop: 6,
          fontSize: format.bodyFontSize - 1,
          opacity: 0.85,
        }}>
          {cv.email && (
            <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
              <i className="fas fa-envelope"></i> {cv.email}
            </span>
          )}
          {cv.phone && (
            <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
              <i className="fas fa-phone"></i> {cv.phone}
            </span>
          )}
          {cv.address && (
            <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
              <i className="fas fa-map-marker-alt"></i> {cv.address}
            </span>
          )}
          {cv.linkedin && (
            <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
              <i className="fab fa-linkedin"></i> {cv.linkedin}
            </span>
          )}
        </div>
      </div>
      {/* BODY */}
      <div style={{ padding: `0 ${format.pagePadding}px` }}>
        {sectionOrder.map(key => renderMainSection(key, cv, accent, format, theme))}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════
// ── TEMPLATE 3: EXECUTIVE PLUS ──
// ══════════════════════════════════════════════
export function ExecutivePlus({ cv, accent, format, sectionOrder, theme }) {
  const mainSections = sectionOrder.filter(s => !SIDE_SECTIONS.includes(s));
  const sideSections = sectionOrder.filter(s => SIDE_SECTIONS.includes(s));

  return (
    <div style={{
      fontFamily: format.fontFamily,
      fontSize: format.bodyFontSize,
      color: theme.text,
      lineHeight: format.lineHeight,
      display: "flex",
      gap: 0,
      background: theme.bg,
      minHeight: "100%",
      boxSizing: "border-box",
    }}>

      {/* SIDEBAR */}
      <div style={{
        width: 190,
        background: theme.sidebar,
        color: "#e2e8f0",
        padding: format.pagePadding,
        flexShrink: 0,
      }}>
        {cv.photo && (
          <div style={{ marginBottom: 12, textAlign: "center" }}>
            <img
              src={cv.photo}
              alt="profile"
              style={{
                width: 100,
                height: 100,
                borderRadius: "50%",
                objectFit: "cover",
                border: `3px solid ${accent}`,
              }}
            />
          </div>
        )}
        <div style={{
          fontSize: format.bodyFontSize + 3,
          fontWeight: format.nameBold ? "bold" : "normal",
          fontStyle: format.nameItalic ? "italic" : "normal",
          color: "#fff",
          marginBottom: 2,
        }}>
          {cv.name || "Your Name"}
        </div>
        <div style={{ fontSize: format.bodyFontSize - 1, color: accent, marginBottom: 10 }}>
          {cv.jobTitle}
        </div>

        <SideSection title="Contact" format={format}>
          <ContactItem icon="fa-envelope" text={cv.email} color="#e2e8f0" fontSize={format.bodyFontSize - 1} />
          <ContactItem icon="fa-phone" text={cv.phone} color="#e2e8f0" fontSize={format.bodyFontSize - 1} />
          <ContactItem icon="fa-map-marker-alt" text={cv.address} color="#e2e8f0" fontSize={format.bodyFontSize - 1} />
          <ContactItem icon="fa-linkedin fab" text={cv.linkedin} color="#e2e8f0" fontSize={format.bodyFontSize - 1} />
        </SideSection>

        {sideSections.map(key => renderSideSection(key, cv, format))}
      </div>

      {/* MAIN */}
      <div style={{ flex: 1, padding: `0 ${format.pagePadding}px` }}>
        <div style={{ paddingTop: format.pagePadding }}>
          {mainSections.map(key => renderMainSection(key, cv, accent, format, theme))}
        </div>
      </div>

    </div>
  );
}

// ══════════════════════════════════════════════
// ── TEMPLATE 4: MINIMAL CLEAN ──
// ══════════════════════════════════════════════
export function MinimalClean({ cv, accent, format, sectionOrder, theme }) {
  return (
    <div style={{
      fontFamily: format.fontFamily,
      fontSize: format.bodyFontSize,
      color: theme.text,
      lineHeight: format.lineHeight,
      background: theme.bg,
      minHeight: "100%",
      padding: `0 ${format.pagePadding}px`,
      boxSizing: "border-box",
    }}>
      {/* HEADER */}
      <div style={{ marginBottom: 24, paddingTop: format.pagePadding, paddingBottom: 16, borderBottom: `1px solid ${theme.text}18` }}>
        <div style={{
          fontSize: format.nameFontSize + 4,
          fontWeight: format.nameBold ? "bold" : "normal",
          fontStyle: format.nameItalic ? "italic" : "normal",
          color: theme.text,
          letterSpacing: -0.5,
          marginBottom: 4,
        }}>
          {cv.name || "Your Name"}
        </div>
        <div style={{ fontSize: format.bodyFontSize + 1, color: accent, fontWeight: 500, marginBottom: 8 }}>
          {cv.jobTitle}
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
          {cv.email && (
            <span style={{ fontSize: format.bodyFontSize - 1, color: theme.text, opacity: 0.7, display: "inline-flex", alignItems: "center", gap: 5 }}>
              <i className="fas fa-envelope" style={{ color: accent, fontSize: format.bodyFontSize - 2 }}></i> {cv.email}
            </span>
          )}
          {cv.phone && (
            <span style={{ fontSize: format.bodyFontSize - 1, color: theme.text, opacity: 0.7, display: "inline-flex", alignItems: "center", gap: 5 }}>
              <i className="fas fa-phone" style={{ color: accent, fontSize: format.bodyFontSize - 2 }}></i> {cv.phone}
            </span>
          )}
          {cv.address && (
            <span style={{ fontSize: format.bodyFontSize - 1, color: theme.text, opacity: 0.7, display: "inline-flex", alignItems: "center", gap: 5 }}>
              <i className="fas fa-map-marker-alt" style={{ color: accent, fontSize: format.bodyFontSize - 2 }}></i> {cv.address}
            </span>
          )}
          {cv.linkedin && (
            <span style={{ fontSize: format.bodyFontSize - 1, color: theme.text, opacity: 0.7, display: "inline-flex", alignItems: "center", gap: 5 }}>
              <i className="fab fa-linkedin" style={{ color: accent, fontSize: format.bodyFontSize - 2 }}></i> {cv.linkedin}
            </span>
          )}
        </div>
      </div>

      {sectionOrder.map(key => renderMinimalSection(key, cv, accent, format, theme))}
    </div>
  );
}

// ══════════════════════════════════════════════
// ── TEMPLATE 5: CREATIVE SIDE ──
// ══════════════════════════════════════════════
export function CreativeSide({ cv, accent, format, sectionOrder, theme }) {
  const sideKeys = ["summary", "skills", "languages", "certifications", "achievements"];
  const mainSections = sectionOrder.filter(s => !sideKeys.includes(s));
  const orderedSide = sectionOrder.filter(s => sideKeys.includes(s));

  return (
    <div style={{
      fontFamily: format.fontFamily,
      fontSize: format.bodyFontSize,
      color: theme.text,
      lineHeight: format.lineHeight,
      display: "flex",
      background: theme.bg,
      minHeight: "100%",
      boxSizing: "border-box",
    }}>
      {/* LEFT SIDEBAR */}
      <div style={{ width: 200, background: accent, color: "#fff", padding: format.pagePadding, flexShrink: 0 }}>
        {cv.photo && (
          <div style={{ marginBottom: 16, textAlign: "center" }}>
            <img src={cv.photo} alt="profile" style={{ width: 90, height: 90, borderRadius: "50%", objectFit: "cover", border: "3px solid rgba(255,255,255,0.4)" }} />
          </div>
        )}

        <div style={{
          fontSize: format.nameFontSize - 2,
          fontWeight: format.nameBold ? "bold" : "normal",
          color: "#fff",
          marginBottom: 4,
          lineHeight: 1.2,
        }}>
          {cv.name || "Your Name"}
        </div>
        <div style={{ fontSize: format.bodyFontSize, color: "rgba(255,255,255,0.75)", marginBottom: 16 }}>
          {cv.jobTitle}
        </div>

        <CreativeSideSection title="Contact" accent={accent} format={format}>
          <ContactItem icon="fa-envelope" text={cv.email} color="rgba(255,255,255,0.9)" fontSize={format.bodyFontSize - 1} />
          <ContactItem icon="fa-phone" text={cv.phone} color="rgba(255,255,255,0.9)" fontSize={format.bodyFontSize - 1} />
          <ContactItem icon="fa-map-marker-alt" text={cv.address} color="rgba(255,255,255,0.9)" fontSize={format.bodyFontSize - 1} />
          <ContactItem icon="fa-linkedin fab" text={cv.linkedin} color="rgba(255,255,255,0.9)" fontSize={format.bodyFontSize - 1} />
        </CreativeSideSection>

        {orderedSide.map(key => {
          if (key === "summary" && cv.summary) return (
            <CreativeSideSection key={key} title="Profile" accent={accent} format={format}>
              <p style={{ fontSize: format.bodyFontSize - 1, color: "rgba(255,255,255,0.85)", lineHeight: format.lineHeight, margin: 0 }}>{cv.summary}</p>
            </CreativeSideSection>
          );
          if (key === "skills" && cv.skills) return (
            <CreativeSideSection key={key} title="Skills" accent={accent} format={format}>
              <SkillList skills={cv.skills} dark format={format} accent={accent} />
            </CreativeSideSection>
          );
          if (key === "languages" && cv.languages) return (
            <CreativeSideSection key={key} title="Languages" accent={accent} format={format}>
              <p style={{ fontSize: format.bodyFontSize - 1, color: "rgba(255,255,255,0.85)", margin: 0 }}>{cv.languages}</p>
            </CreativeSideSection>
          );
          if (key === "certifications" && cv.certifications) return (
            <CreativeSideSection key={key} title="Certifications" accent={accent} format={format}>
              <p style={{ fontSize: format.bodyFontSize - 1, color: "rgba(255,255,255,0.85)", margin: 0, whiteSpace: "pre-wrap" }}>{cv.certifications}</p>
            </CreativeSideSection>
          );
          if (key === "achievements" && cv.achievements?.[0]?.title) return (
            <CreativeSideSection key={key} title="Achievements" accent={accent} format={format}>
              {cv.achievements.map((a, i) => (
                <div key={i} style={{ marginBottom: 6 }}>
                  <div style={{ fontSize: format.bodyFontSize - 1, fontWeight: "bold", color: "#fff" }}>{a.title}</div>
                  {a.date && <div style={{ fontSize: format.bodyFontSize - 2, color: "rgba(255,255,255,0.6)" }}>{a.date}</div>}
                </div>
              ))}
            </CreativeSideSection>
          );
          return null;
        })}
      </div>

      {/* MAIN */}
      <div style={{ flex: 1, padding: `${format.pagePadding}px ${format.pagePadding}px 0` }}>
        {mainSections.map(key => renderMainSection(key, cv, accent, format, theme))}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════
// ── TEMPLATE 6: CORPORATE BOLD ──
// ══════════════════════════════════════════════
export function CorporateBold({ cv, accent, format, sectionOrder, theme }) {
  return (
    <div style={{
      fontFamily: format.fontFamily,
      fontSize: format.bodyFontSize,
      color: theme.text,
      lineHeight: format.lineHeight,
      background: theme.bg,
      minHeight: "100%",
      boxSizing: "border-box",
    }}>

      {/* BOLD HEADER */}
      <div style={{ background: theme.sidebar, padding: "24px 32px", marginBottom: 0 }}>
        <div style={{
          fontSize: format.nameFontSize + 6,
          fontWeight: "900",
          fontStyle: format.nameItalic ? "italic" : "normal",
          color: "#fff",
          letterSpacing: -1,
          lineHeight: 1,
          marginBottom: 6,
        }}>
          {cv.name || "YOUR NAME"}
        </div>
        <div style={{
          fontSize: format.bodyFontSize + 2,
          color: accent,
          fontWeight: 700,
          marginBottom: 12,
          textTransform: "uppercase",
          letterSpacing: 2,
        }}>
          {cv.jobTitle}
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 18 }}>
          {cv.email && (
            <span style={{ fontSize: format.bodyFontSize - 1, color: "rgba(255,255,255,0.85)", display: "inline-flex", alignItems: "center", gap: 6 }}>
              <i className="fas fa-envelope" style={{ color: accent }}></i> {cv.email}
            </span>
          )}
          {cv.phone && (
            <span style={{ fontSize: format.bodyFontSize - 1, color: "rgba(255,255,255,0.85)", display: "inline-flex", alignItems: "center", gap: 6 }}>
              <i className="fas fa-phone" style={{ color: accent }}></i> {cv.phone}
            </span>
          )}
          {cv.address && (
            <span style={{ fontSize: format.bodyFontSize - 1, color: "rgba(255,255,255,0.85)", display: "inline-flex", alignItems: "center", gap: 6 }}>
              <i className="fas fa-map-marker-alt" style={{ color: accent }}></i> {cv.address}
            </span>
          )}
          {cv.linkedin && (
            <span style={{ fontSize: format.bodyFontSize - 1, color: "rgba(255,255,255,0.85)", display: "inline-flex", alignItems: "center", gap: 6 }}>
              <i className="fab fa-linkedin" style={{ color: accent }}></i> {cv.linkedin}
            </span>
          )}
        </div>
      </div>

      {/* ACCENT BAR */}
      <div style={{ height: 5, background: accent, marginBottom: 0 }} />

      {/* BODY */}
      <div style={{ padding: `${format.pagePadding}px`, boxSizing: "border-box" }}>
        <TwoCol
          left={
            <>
              {sectionOrder
                .filter(s => !["skills", "languages", "certifications"].includes(s))
                .map(key => renderMainSection(key, cv, accent, format, theme))}
            </>
          }
          right={
            <>
              {sectionOrder
                .filter(s => ["skills", "languages", "certifications"].includes(s))
                .map(key => renderMainSection(key, cv, accent, format, theme))}
            </>
          }
        />
      </div>

    </div>
  );
}

// ══════════════════════════════════════════════
// ── TEMPLATE 7: TRADITIONAL PROFILE ──
// (perfect for bio-data heavy CVs)
// ══════════════════════════════════════════════
export function TraditionalProfile({ cv, accent, format, sectionOrder, theme }) {
  return (
    <div style={{
      fontFamily: format.fontFamily,
      fontSize: format.bodyFontSize,
      color: theme.text,
      lineHeight: format.lineHeight,
      background: theme.bg,
      minHeight: "100%",
      padding: `0 ${format.pagePadding}px`,
      boxSizing: "border-box",
    }}>

      {/* HEADER WITH OPTIONAL PHOTO */}
      <div style={{
        display: "flex",
        gap: 18,
        alignItems: "flex-start",
        borderBottom: `2px solid ${accent}`,
        paddingTop: format.pagePadding,
        paddingBottom: 12,
        marginBottom: 14,
      }}>
        {cv.photo && (
          <img
            src={cv.photo}
            alt="profile"
            style={{
              width: 90,
              height: 110,
              objectFit: "cover",
              border: `2px solid ${accent}`,
              flexShrink: 0,
            }}
          />
        )}
        <div style={{ flex: 1 }}>
          <div style={{
            fontSize: format.nameFontSize,
            fontWeight: format.nameBold ? "bold" : "normal",
            fontStyle: format.nameItalic ? "italic" : "normal",
            color: accent,
            textTransform: "uppercase",
            letterSpacing: 1,
            marginBottom: 4,
          }}>
            {cv.name || "YOUR NAME"}
          </div>
          {cv.jobTitle && (
            <div style={{ fontSize: format.bodyFontSize + 1, color: theme.text, opacity: 0.7, marginBottom: 6 }}>
              {cv.jobTitle}
            </div>
          )}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, fontSize: format.bodyFontSize - 1, color: theme.text, opacity: 0.7 }}>
            {cv.email && (
              <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
                <i className="fas fa-envelope" style={{ color: accent }}></i> {cv.email}
              </span>
            )}
            {cv.phone && (
              <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
                <i className="fas fa-phone" style={{ color: accent }}></i> {cv.phone}
              </span>
            )}
            {cv.address && (
              <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
                <i className="fas fa-map-marker-alt" style={{ color: accent }}></i> {cv.address}
              </span>
            )}
            {cv.linkedin && (
              <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
                <i className="fab fa-linkedin" style={{ color: accent }}></i> {cv.linkedin}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* BIO DATA TABLE — prominent in this template */}
      {(cv.dateOfBirth || cv.gender || cv.maritalStatus || cv.nationality || cv.stateOfOrigin || cv.lga || cv.placeOfBirth || cv.religion || cv.nin) && (
        <div className="cv-section cv-section-keep" style={{ marginBottom: 14 }}>
          <div className="cv-section-heading" style={{
            fontSize: format.headingFontSize,
            fontWeight: format.headingBold ? "bold" : "normal",
            color: accent,
            textTransform: format.headingUppercase ? "uppercase" : "none",
            letterSpacing: 1,
            borderBottom: `1px solid ${accent}`,
            paddingBottom: 2,
            marginBottom: 8,
          }}>
            Personal Details
          </div>
          <table style={{ width: "100%", fontSize: format.bodyFontSize, borderCollapse: "collapse" }}>
            <tbody>
              {cv.dateOfBirth && (
                <tr>
                  <td style={{ padding: "3px 8px 3px 0", fontWeight: "bold", color: theme.text, opacity: 0.8, width: "30%" }}>Date of Birth:</td>
                  <td style={{ padding: "3px 0", color: theme.text }}>{formatDate(cv.dateOfBirth)}</td>
                </tr>
              )}
              {cv.placeOfBirth && (
                <tr>
                  <td style={{ padding: "3px 8px 3px 0", fontWeight: "bold", color: theme.text, opacity: 0.8 }}>Place of Birth:</td>
                  <td style={{ padding: "3px 0", color: theme.text }}>{cv.placeOfBirth}</td>
                </tr>
              )}
              {cv.gender && (
                <tr>
                  <td style={{ padding: "3px 8px 3px 0", fontWeight: "bold", color: theme.text, opacity: 0.8 }}>Gender:</td>
                  <td style={{ padding: "3px 0", color: theme.text }}>{cv.gender}</td>
                </tr>
              )}
              {cv.maritalStatus && (
                <tr>
                  <td style={{ padding: "3px 8px 3px 0", fontWeight: "bold", color: theme.text, opacity: 0.8 }}>Marital Status:</td>
                  <td style={{ padding: "3px 0", color: theme.text }}>{cv.maritalStatus}</td>
                </tr>
              )}
              {cv.nationality && (
                <tr>
                  <td style={{ padding: "3px 8px 3px 0", fontWeight: "bold", color: theme.text, opacity: 0.8 }}>Nationality:</td>
                  <td style={{ padding: "3px 0", color: theme.text }}>{cv.nationality}</td>
                </tr>
              )}
              {cv.stateOfOrigin && (
                <tr>
                  <td style={{ padding: "3px 8px 3px 0", fontWeight: "bold", color: theme.text, opacity: 0.8 }}>State of Origin:</td>
                  <td style={{ padding: "3px 0", color: theme.text }}>{cv.stateOfOrigin}</td>
                </tr>
              )}
              {cv.lga && (
                <tr>
                  <td style={{ padding: "3px 8px 3px 0", fontWeight: "bold", color: theme.text, opacity: 0.8 }}>LGA:</td>
                  <td style={{ padding: "3px 0", color: theme.text }}>{cv.lga}</td>
                </tr>
              )}
              {cv.religion && (
                <tr>
                  <td style={{ padding: "3px 8px 3px 0", fontWeight: "bold", color: theme.text, opacity: 0.8 }}>Religion:</td>
                  <td style={{ padding: "3px 0", color: theme.text }}>{cv.religion}</td>
                </tr>
              )}
              {cv.nin && (
                <tr>
                  <td style={{ padding: "3px 8px 3px 0", fontWeight: "bold", color: theme.text, opacity: 0.8 }}>NIN:</td>
                  <td style={{ padding: "3px 0", color: theme.text }}>{cv.nin}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* OTHER SECTIONS — biodata is rendered above so skip it here */}
      {sectionOrder
        .filter(s => s !== "biodata")
        .map(key => renderMainSection(key, cv, accent, format, theme))}

    </div>
  );
}