// Date helper
import { SIDEBAR_SECTIONS } from "../utils/templateMeta";
import { ensureCvFonts } from "../utils/cvFonts";

// Wherever a CV renders, its fonts are the shipped files the PDF uses too.
ensureCvFonts();

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

// ── CERTIFICATION HELPERS ──

// Personal details (biodata) as [label, value] pairs, empty ones dropped.
function bioRows(cv) {
  return [
    ["Date of Birth", formatDate(cv.dateOfBirth)], ["Place of Birth", cv.placeOfBirth],
    ["Gender", cv.gender], ["Marital Status", cv.maritalStatus],
    ["Nationality", cv.nationality], ["State of Origin", cv.stateOfOrigin],
    ["LGA", cv.lga], ["Religion", cv.religion], ["NIN", cv.nin],
  ].filter(([, v]) => v);
}

function hasCertifications(cv) {
  if (!cv.certifications) return false;
  if (typeof cv.certifications === "string") return cv.certifications.trim().length > 0;
  if (Array.isArray(cv.certifications)) return cv.certifications.some(c => c && c.name);
  return false;
}

function normalizeCertifications(certifications) {
  if (!certifications) return [];

  if (typeof certifications === "string") {
    return certifications
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
  }

  if (Array.isArray(certifications)) {
    return certifications.filter(c => c && c.name);
  }

  return [];
}

function CertificationItem({ cert, fontSize, lineHeight, color, accent, compact = false }) {
  const s = fontSize;
  return (
    <div className="cv-item" style={{ marginBottom: compact ? 6 : 8 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 8, flexWrap: "wrap" }}>
        <b style={{ fontSize: s, color }}>{cert.name}</b>
        {(cert.issueDate || cert.expiryDate || cert.noExpiry) && (
          <span style={{ fontSize: s - 1, color, opacity: 0.6 }}>
            {cert.issueDate}
            {cert.issueDate && (cert.expiryDate || cert.noExpiry) && " – "}
            {cert.noExpiry ? "No Expiry" : cert.expiryDate}
          </span>
        )}
      </div>
      {cert.issuer && (
        <div style={{ fontSize: s - 1, color: accent, marginTop: 1 }}>{cert.issuer}</div>
      )}
      {cert.credentialId && (
        <div style={{ fontSize: s - 2, color, opacity: 0.55, marginTop: 1 }}>
          ID: {cert.credentialId}
        </div>
      )}
      {cert.credentialUrl && (
        <div style={{ fontSize: s - 2, color: accent, opacity: 0.85, marginTop: 1, wordBreak: "break-all" }}>
          {cert.credentialUrl}
        </div>
      )}
    </div>
  );
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
        style={{ fontSize: fontSize - 1, width: 12, textAlign: "center", flexShrink: 0 }}
      ></i>
      {/* Long emails/URLs wrap inside narrow sidebars instead of overflowing:
          preferably after "@" or "/", mid-word only as a last resort. */}
      <span style={{ minWidth: 0, overflowWrap: "anywhere", textAlign: "left" }}>
        {String(text).split(/(?<=[@/])/).map((part, i) => (
          <span key={i}>{i > 0 && <wbr />}{part}</span>
        ))}
      </span>
    </p>
  );
}


// ── BULLET LIST HELPER ──
function BulletList({ text, fontSize, lineHeight, color }) {
  if (!text) return null;

  const lines = text.split("\n").map(l => l.trim()).filter(Boolean);
  const bulletLines = lines.filter(l => /^[-*•]\s*/.test(l));

  // If most lines look like bullets, render as a real list
  if (bulletLines.length >= Math.max(1, lines.length - 1)) {
    return (
    <ul style={{
      margin: "4px 0 0",
      paddingLeft: 18,
      listStyleType: "disc",
    }}>
      {lines.map((line, i) => {
        const cleaned = line.replace(/^[-*•]\s*/, "");
        return (
          <li
            key={i}
            style={{
              fontSize,
              lineHeight,
              color,
              opacity: 0.88,
              marginBottom: 3,
              paddingLeft: 2,
              textAlign: "justify",
            }}
          >
            {cleaned}
          </li>
        );
      })}
    </ul>
  );
}

  // Fallback: plain paragraph (no bullet formatting detected)
  return (
    <p style={{
      whiteSpace: "pre-wrap",
      fontSize,
      lineHeight,
      color,
      opacity: 0.88,
      margin: "4px 0 0",
    }}>
      {text}
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
        <div key={i} className="cv-item" style={{ marginBottom: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <b style={{ fontSize: s + 0.5, color: tc }}>{e.role}</b>
            <span style={{ fontSize: s - 1, color: tc, opacity: 0.6 }}>
              {e.start} – {e.current ? "Present" : e.end}
            </span>
          </div>
          <div style={{ color: accent, fontSize: s, fontWeight: 600, marginBottom: 2 }}>{e.company}</div>
          <BulletList text={e.responsibilities} fontSize={s} lineHeight={lh} color={tc} />
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
                  <div style={{ marginTop: 3, fontSize: s - 1, color: accent, wordBreak: "break-all" }}>
                    {"🔗 "}
                    {pub.url.length > 50 ? pub.url.substring(0, 50) + "..." : pub.url}
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

    case "certifications": {
      if (!hasCertifications(cv)) return null;
      const certs = normalizeCertifications(cv.certifications);
      return (
        <Section key={key} title="Certifications" accent={accent} format={format} keepTogether>
          {certs.map((c, i) => (
            <CertificationItem
              key={i}
              cert={c}
              fontSize={s}
              lineHeight={lh}
              color={tc}
              accent={accent}
            />
          ))}
        </Section>
      );
    }

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
                <b style={{ fontSize: s + 0.5, color: tc }}>{e.role}</b>
                <span style={{ fontSize: s - 1, color: tc, opacity: 0.55 }}>
                  {e.start} – {e.current ? "Present" : e.end}
                </span>
              </div>
              <div style={{ fontSize: s - 1, color: accent, marginBottom: 2 }}>{e.company}</div>
              <BulletList text={e.responsibilities} fontSize={s} lineHeight={lh} color={tc} />
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
            return (
              <div key={i} className="cv-item" style={{ marginBottom: 8, paddingLeft: 10, borderLeft: `2px solid ${accent}` }}>
                <b style={{ fontSize: s, color: tc }}>{pub.title}</b>
                {pub.journal && <div style={{ fontSize: s - 1, color: tc, opacity: 0.65, fontStyle: "italic" }}>{pub.journal}</div>}
                {pub.date && <div style={{ fontSize: s - 1, color: tc, opacity: 0.5 }}>{pub.date}</div>}
                {pub.url && (
                  <div style={{ fontSize: s - 1, color: accent, wordBreak: "break-all" }}>
                    {"🔗 "}
                    {pub.url.length > 45 ? pub.url.substring(0, 45) + "..." : pub.url}
                  </div>
                )}
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

    case "certifications": {
      if (!hasCertifications(cv)) return null;
      const certs = normalizeCertifications(cv.certifications);
      return (
        <MinimalSection key={key} title="Certifications" format={format} theme={theme} keepTogether>
          {certs.map((c, i) => (
            <div key={i} className="cv-item" style={{ marginBottom: 6, paddingLeft: 10, borderLeft: `2px solid ${accent}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
                <b style={{ fontSize: s, color: tc }}>{c.name}</b>
                {(c.issueDate || c.expiryDate || c.noExpiry) && (
                  <span style={{ fontSize: s - 1, color: tc, opacity: 0.55 }}>
                    {c.issueDate}
                    {c.issueDate && (c.expiryDate || c.noExpiry) && " – "}
                    {c.noExpiry ? "No Expiry" : c.expiryDate}
                  </span>
                )}
              </div>
              {c.issuer && (
                <div style={{ fontSize: s - 1, color: accent }}>{c.issuer}</div>
              )}
              {c.credentialId && (
                <div style={{ fontSize: s - 2, color: tc, opacity: 0.5 }}>ID: {c.credentialId}</div>
              )}
              {c.credentialUrl && (
                <div style={{ fontSize: s - 2, color: accent, opacity: 0.85, wordBreak: "break-all" }}>
                  {c.credentialUrl}
                </div>
              )}
            </div>
          ))}
        </MinimalSection>
      );
    }

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
const SIDE_SECTIONS = SIDEBAR_SECTIONS[2];

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
    case "certifications": {
      if (!hasCertifications(cv)) return null;
      const certs = normalizeCertifications(cv.certifications);
      return (
        <SideSection key={key} title="Certifications" format={format}>
          {certs.map((c, i) => (
            <div key={i} style={{ marginBottom: 6 }}>
              <div style={{ fontSize: s - 1, fontWeight: "bold", color: "#e2e8f0", lineHeight: 1.3 }}>
                {c.name}
              </div>
              {c.issuer && (
                <div style={{ fontSize: s - 2, color: "#94a3b8", marginTop: 1 }}>{c.issuer}</div>
              )}
              {(c.issueDate || c.noExpiry || c.expiryDate) && (
                <div style={{ fontSize: s - 2, color: "#94a3b8", opacity: 0.85 }}>
                  {c.issueDate}
                  {c.issueDate && (c.expiryDate || c.noExpiry) && " – "}
                  {c.noExpiry ? "No Expiry" : c.expiryDate}
                </div>
              )}
            </div>
          ))}
        </SideSection>
      );
    }
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
  const rightSections = SIDEBAR_SECTIONS[0];

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
          {cv.website && (
            <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
              <i className="fas fa-globe" style={{ color: accent, fontSize: format.bodyFontSize - 2 }}></i>
              {cv.website}
            </span>
          )}
          {cv.github && (
            <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
              <i className="fab fa-github" style={{ color: accent, fontSize: format.bodyFontSize - 2 }}></i>
              {cv.github}
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

          {cv.website && (
            <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
              <i className="fas fa-globe"></i> {cv.website}
            </span>
          )}
          {cv.github && (
            <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
              <i className="fab fa-github"></i> {cv.github}
            </span>
          )}
        </div>
      </div>
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
          <ContactItem icon="fa-globe" text={cv.website} color="#e2e8f0" fontSize={format.bodyFontSize - 1} />
          <ContactItem icon="fa-github fab" text={cv.github} color="#e2e8f0" fontSize={format.bodyFontSize - 1} />
        </SideSection>

        {sideSections.map(key => renderSideSection(key, cv, format))}
      </div>

      <div style={{ flex: 1, padding: `${format.pagePadding}px` }}>
        <div>
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
          {cv.website && (
            <span style={{ fontSize: format.bodyFontSize - 1, color: theme.text, opacity: 0.7, display: "inline-flex", alignItems: "center", gap: 5 }}>
              <i className="fas fa-globe" style={{ color: accent, fontSize: format.bodyFontSize - 2 }}></i> {cv.website}
            </span>
          )}
          {cv.github && (
            <span style={{ fontSize: format.bodyFontSize - 1, color: theme.text, opacity: 0.7, display: "inline-flex", alignItems: "center", gap: 5 }}>
              <i className="fab fa-github" style={{ color: accent, fontSize: format.bodyFontSize - 2 }}></i> {cv.github}
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
  const sideKeys = SIDEBAR_SECTIONS[4];
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
      <div style={{ width: 200, background: accent, color: "#fff", padding: `${Math.max(format.pagePadding, 36)}px ${format.pagePadding}px`, flexShrink: 0 }}>
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
          <ContactItem icon="fa-globe" text={cv.website} color="rgba(255,255,255,0.9)" fontSize={format.bodyFontSize - 1} />
          <ContactItem icon="fa-github fab" text={cv.github} color="rgba(255,255,255,0.9)" fontSize={format.bodyFontSize - 1} />
        </CreativeSideSection>

        {/* Sidebar holds only short, scannable facts. Profile, skills and
            achievements read better at full width in the main column. */}
        {orderedSide.map(key => {
          if (key === "languages" && cv.languages) return (
            <CreativeSideSection key={key} title="Languages" accent={accent} format={format}>
              <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                {cv.languages.split(/[,\n]+/).map(l => l.trim()).filter(Boolean).map((l, i) => (
                  <span key={i} style={{ fontSize: format.bodyFontSize - 1, color: "rgba(255,255,255,0.9)", lineHeight: 1.35, textAlign: "left" }}>
                    {l}
                  </span>
                ))}
              </div>
            </CreativeSideSection>
          );
          if (key === "certifications" && hasCertifications(cv)) {
            const certs = normalizeCertifications(cv.certifications);
            return (
              <CreativeSideSection key={key} title="Certifications" accent={accent} format={format}>
                {certs.map((c, i) => (
                  <div key={i} style={{ marginBottom: 7 }}>
                    <div style={{ fontSize: format.bodyFontSize - 1, fontWeight: "bold", color: "#fff", lineHeight: 1.3, overflowWrap: "anywhere" }}>
                      {c.name}
                    </div>
                    {c.issuer && (
                      <div style={{ fontSize: format.bodyFontSize - 2, color: "rgba(255,255,255,0.75)" }}>{c.issuer}</div>
                    )}
                    {(c.issueDate || c.noExpiry || c.expiryDate) && (
                      <div style={{ fontSize: format.bodyFontSize - 2, color: "rgba(255,255,255,0.65)" }}>
                        {c.issueDate}
                        {c.issueDate && (c.expiryDate || c.noExpiry) && " – "}
                        {c.noExpiry ? "No Expiry" : c.expiryDate}
                      </div>
                    )}
                  </div>
                ))}
              </CreativeSideSection>
            );
          }
          return null;
        })}
      </div>

      {/* Vertical padding repeats on every printed page (box-decoration-break in
          the print/PDF engines), so text never runs to the page edge. */}
      <div style={{ flex: 1, padding: `${Math.max(format.pagePadding, 36)}px ${format.pagePadding}px` }}>
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
          {cv.website && (
            <span style={{ fontSize: format.bodyFontSize - 1, color: "rgba(255,255,255,0.85)", display: "inline-flex", alignItems: "center", gap: 6 }}>
              <i className="fas fa-globe" style={{ color: accent }}></i> {cv.website}
            </span>
          )}
          {cv.github && (
            <span style={{ fontSize: format.bodyFontSize - 1, color: "rgba(255,255,255,0.85)", display: "inline-flex", alignItems: "center", gap: 6 }}>
              <i className="fab fa-github" style={{ color: accent }}></i> {cv.github}
            </span>
          )}
        </div>
      </div>

      <div style={{ height: 5, background: accent, marginBottom: 0 }} />

      <div style={{ padding: `${format.pagePadding}px`, boxSizing: "border-box" }}>
        <TwoCol
          left={
            <>
              {sectionOrder
                .filter(s => !SIDEBAR_SECTIONS[5].includes(s))
                .map(key => renderMainSection(key, cv, accent, format, theme))}
            </>
          }
          right={
            <>
              {sectionOrder
                .filter(s => SIDEBAR_SECTIONS[5].includes(s))
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
// ══════════════════════════════════════════════
export function TraditionalProfile({ cv, accent, format, sectionOrder, theme }) {
  // Personal Details render where the user puts them in Section Order.
  const bioBlock = (cv.dateOfBirth || cv.gender || cv.maritalStatus || cv.nationality || cv.stateOfOrigin || cv.lga || cv.placeOfBirth || cv.religion || cv.nin) ? (
        <div key="biodata" className="cv-section cv-section-keep" style={{ marginBottom: 14 }}>
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
      ) : null;

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
            {cv.website && (
              <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
                <i className="fas fa-globe" style={{ color: accent }}></i> {cv.website}
              </span>
            )}
            {cv.github && (
              <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
                <i className="fab fa-github" style={{ color: accent }}></i> {cv.github}
              </span>
            )}
          </div>
        </div>
      </div>

      {sectionOrder.map(key => (key === "biodata" ? bioBlock : renderMainSection(key, cv, accent, format, theme)))}

    </div>
  );
}

// ══════════════════════════════════════════════
// ── TEMPLATE 8: EDITORIAL MODERN ──
// ══════════════════════════════════════════════
function FineBullets({ text, fontSize, lineHeight, color, accent }) {
  if (!text) return null;
  const lines = text.split("\n").map(l => l.trim()).filter(Boolean);
  const bulletLines = lines.filter(l => /^[-*•]\s*/.test(l));

  if (bulletLines.length >= Math.max(1, lines.length - 1)) {
    return (
    <div style={{ marginTop: 5 }}>
      {lines.map((line, i) => {
        const cleaned = line.replace(/^[-*•]\s*/, "");
        return (
          <div key={i} style={{ display: "flex", gap: 8, marginBottom: 4 }}>
            <span style={{ color: accent, fontSize: fontSize - 1, lineHeight: lineHeight, flexShrink: 0, fontWeight: 700 }}>
              ▸
            </span>
            <span style={{ fontSize, lineHeight, color, opacity: 0.85, textAlign: "justify" }}>{cleaned}</span>
          </div>
        );
      })}
    </div>
  );
}

  return (
    <p style={{ whiteSpace: "pre-wrap", fontSize, lineHeight, color, opacity: 0.85, margin: "4px 0 0" }}>
      {text}
    </p>
  );
}

function EditorialSection({ title, accent, format, theme, children, keepTogether = false }) {
  return (
    <div className={keepTogether ? "cv-section cv-section-keep" : "cv-section"} style={{ marginBottom: 18 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
        <span style={{ width: 5, height: 5, background: accent, flexShrink: 0 }} />
        <div
          className="cv-section-heading"
          style={{
            fontSize: format.headingFontSize,
            fontWeight: format.headingBold ? 700 : 400,
            fontStyle: format.headingItalic ? "italic" : "normal",
            textTransform: format.headingUppercase ? "uppercase" : "none",
            letterSpacing: 2.5,
            color: theme.text,
            opacity: 0.55,
          }}
        >
          {title}
        </div>
      </div>
      {children}
    </div>
  );
}

export function EditorialModern({ cv, accent, format, sectionOrder, theme }) {
  const s = format.bodyFontSize;
  const lh = format.lineHeight;
  const tc = theme.text;

  const sideKeys = SIDEBAR_SECTIONS[7];
  const mainSections = sectionOrder.filter(k => !sideKeys.includes(k));
  const sideSections = sectionOrder.filter(k => sideKeys.includes(k));

  const renderEditorial = (key) => {
    switch (key) {
      case "biodata": {
        const has = cv.dateOfBirth || cv.gender || cv.maritalStatus || cv.nationality || cv.stateOfOrigin || cv.lga || cv.placeOfBirth || cv.religion || cv.nin;
        if (!has) return null;
        return (
          <EditorialSection key={key} title="Personal Details" accent={accent} format={format} theme={theme} keepTogether>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px 16px" }}>
              {[
                ["Date of Birth", formatDate(cv.dateOfBirth)], ["Place of Birth", cv.placeOfBirth],
                ["Gender", cv.gender], ["Marital Status", cv.maritalStatus],
                ["Nationality", cv.nationality], ["State of Origin", cv.stateOfOrigin],
                ["LGA", cv.lga], ["Religion", cv.religion], ["NIN", cv.nin],
              ].filter(([, v]) => v).map(([label, val]) => (
                <div key={label} style={{ fontSize: s - 0.5 }}>
                  <span style={{ fontWeight: 700, color: tc, opacity: 0.75 }}>{label}: </span>
                  <span style={{ color: tc, opacity: 0.65 }}>{val}</span>
                </div>
              ))}
            </div>
          </EditorialSection>
        );
      }
      case "summary":
        return cv.summary ? (
          <EditorialSection key={key} title="Profile" accent={accent} format={format} theme={theme} keepTogether>
            <p style={{ fontSize: s + 0.5, lineHeight: lh + 0.1, color: tc, margin: 0, fontStyle: "italic", opacity: 0.85 }}>
              {cv.summary}
            </p>
          </EditorialSection>
        ) : null;
      case "objective":
        return cv.objective ? (
          <EditorialSection key={key} title="Objective" accent={accent} format={format} theme={theme} keepTogether>
            <p style={{ fontSize: s, lineHeight: lh, color: tc, margin: 0, opacity: 0.85 }}>{cv.objective}</p>
          </EditorialSection>
        ) : null;
      case "experience":
        return cv.experience[0]?.company ? (
          <EditorialSection key={key} title="Experience" accent={accent} format={format} theme={theme}>
            {cv.experience.map((e, i) => (
              <div key={i} className="cv-item" style={{ marginBottom: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <b style={{ fontSize: s + 1, color: tc }}>{e.role}</b>
                  <span style={{ fontSize: s - 1.5, color: tc, opacity: 0.5, fontStyle: "italic" }}>
                    {e.start} – {e.current ? "Present" : e.end}
                  </span>
                </div>
                <div style={{ color: accent, fontSize: s, fontWeight: 600, marginBottom: 2 }}>{e.company}</div>
                <FineBullets text={e.responsibilities} fontSize={s} lineHeight={lh} color={tc} accent={accent} />
              </div>
            ))}
          </EditorialSection>
        ) : null;
      case "education":
        return cv.education[0]?.school ? (
          <EditorialSection key={key} title="Education" accent={accent} format={format} theme={theme}>
            {cv.education.map((e, i) => (
              <div key={i} className="cv-item" style={{ marginBottom: 10 }}>
                <b style={{ fontSize: s, color: tc }}>{e.degree} {e.field && `in ${e.field}`}</b>
                <div style={{ fontSize: s - 1, color: tc, opacity: 0.65 }}>
                  {e.school} <span style={{ opacity: 0.6 }}>· {e.start} – {e.end}</span>
                </div>
              </div>
            ))}
          </EditorialSection>
        ) : null;
      case "achievements":
        return cv.achievements?.[0]?.title ? (
          <EditorialSection key={key} title="Achievements" accent={accent} format={format} theme={theme}>
            {cv.achievements.map((a, i) => (
              <div key={i} className="cv-item" style={{ marginBottom: 8 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <b style={{ fontSize: s, color: tc }}>{a.title}</b>
                  <span style={{ fontSize: s - 1.5, color: tc, opacity: 0.5, fontStyle: "italic" }}>{a.date}</span>
                </div>
                {a.description && <div style={{ fontSize: s - 1, color: tc, opacity: 0.75, marginTop: 2 }}>{a.description}</div>}
              </div>
            ))}
          </EditorialSection>
        ) : null;
      case "volunteer":
        return cv.volunteer?.[0]?.organization ? (
          <EditorialSection key={key} title="Volunteer Work" accent={accent} format={format} theme={theme}>
            {cv.volunteer.map((v, i) => (
              <div key={i} className="cv-item" style={{ marginBottom: 8 }}>
                <b style={{ fontSize: s, color: tc }}>{v.role}</b>
                <div style={{ fontSize: s - 1, color: accent }}>{v.organization}</div>
                {v.description && <div style={{ fontSize: s - 1, color: tc, opacity: 0.75, marginTop: 2 }}>{v.description}</div>}
              </div>
            ))}
          </EditorialSection>
        ) : null;
      case "publications":
        return cv.publications?.[0]?.title ? (
          <EditorialSection key={key} title="Publications" accent={accent} format={format} theme={theme}>
            {cv.publications.map((pub, i) => (
              <div key={i} className="cv-item" style={{ marginBottom: 8 }}>
                <b style={{ fontSize: s, color: tc }}>{pub.title}</b>
                {pub.journal && <div style={{ fontSize: s - 1, color: tc, opacity: 0.65, fontStyle: "italic" }}>{pub.journal}</div>}
              </div>
            ))}
          </EditorialSection>
        ) : null;
      case "references":
        return cv.references?.[0]?.name ? (
          <EditorialSection key={key} title="References" accent={accent} format={format} theme={theme} keepTogether>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
              {cv.references.map((r, i) => (
                <div key={i} style={{ minWidth: 160 }}>
                  <b style={{ fontSize: s, color: tc }}>{r.name}</b>
                  <div style={{ fontSize: s - 1, color: tc, opacity: 0.65 }}>{r.title}{r.company && ` — ${r.company}`}</div>
                </div>
              ))}
            </div>
          </EditorialSection>
        ) : null;
      default:
        return null;
    }
  };

  const renderEditorialSide = (key) => {
    switch (key) {
      case "skills":
        return cv.skills ? (
          <EditorialSection key={key} title="Skills" accent={accent} format={format} theme={theme} keepTogether>
            <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              {cv.skills.split(/[,\n]+/).map(s2 => s2.trim()).filter(Boolean).map((skill, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ width: 4, height: 4, borderRadius: "50%", background: accent, flexShrink: 0 }} />
                  <span style={{ fontSize: s - 1, color: tc, opacity: 0.85 }}>{skill}</span>
                </div>
              ))}
            </div>
          </EditorialSection>
        ) : null;
      case "languages":
        return cv.languages ? (
          <EditorialSection key={key} title="Languages" accent={accent} format={format} theme={theme} keepTogether>
            <p style={{ fontSize: s - 1, color: tc, opacity: 0.85, margin: 0, lineHeight: lh }}>{cv.languages}</p>
          </EditorialSection>
        ) : null;
      case "certifications": {
        if (!hasCertifications(cv)) return null;
        const certs = normalizeCertifications(cv.certifications);
        return (
          <EditorialSection key={key} title="Certifications" accent={accent} format={format} theme={theme} keepTogether>
            {certs.map((c, i) => (
              <div key={i} style={{ marginBottom: 8 }}>
                <div style={{ fontSize: s - 1, fontWeight: 700, color: tc }}>{c.name}</div>
                {c.issuer && <div style={{ fontSize: s - 1.5, color: accent }}>{c.issuer}</div>}
              </div>
            ))}
          </EditorialSection>
        );
      }
      case "hobbies":
        return cv.hobbies ? (
          <EditorialSection key={key} title="Interests" accent={accent} format={format} theme={theme} keepTogether>
            <p style={{ fontSize: s - 1, color: tc, opacity: 0.85, margin: 0, lineHeight: lh }}>{cv.hobbies}</p>
          </EditorialSection>
        ) : null;
      default:
        return null;
    }
  };

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
      {/* HEADER */}
      <div style={{ padding: `${format.pagePadding + 8}px ${format.pagePadding}px 0` }}>
        <div style={{
          fontSize: format.nameFontSize + 4,
          fontWeight: format.nameBold ? 800 : 400,
          fontStyle: format.nameItalic ? "italic" : "normal",
          color: tc,
          letterSpacing: -0.5,
          lineHeight: 1.05,
        }}>
          {cv.name || "Your Name"}
        </div>
        <div style={{ fontSize: format.bodyFontSize + 2, color: accent, fontWeight: 600, marginTop: 4, letterSpacing: 1 }}>
          {(cv.jobTitle || "").toUpperCase()}
        </div>
        <div style={{
          display: "flex", flexWrap: "wrap", gap: 16, marginTop: 12,
          fontSize: format.bodyFontSize - 1.5, color: tc, opacity: 0.6,
        }}>
          {cv.email && <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}><i className="fas fa-envelope" style={{ color: accent, fontSize: "0.85em" }}></i>{cv.email}</span>}
          {cv.phone && <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}><i className="fas fa-phone" style={{ color: accent, fontSize: "0.85em" }}></i>{cv.phone}</span>}
          {cv.address && <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}><i className="fas fa-map-marker-alt" style={{ color: accent, fontSize: "0.85em" }}></i>{cv.address}</span>}
          {cv.linkedin && <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}><i className="fab fa-linkedin" style={{ color: accent, fontSize: "0.85em" }}></i>{cv.linkedin}</span>}
          {cv.website && <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}><i className="fas fa-globe" style={{ color: accent, fontSize: "0.85em" }}></i>{cv.website}</span>}
          {cv.github && <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}><i className="fab fa-github" style={{ color: accent, fontSize: "0.85em" }}></i>{cv.github}</span>}
        </div>
        <div style={{ height: 1, background: tc, opacity: 0.12, marginTop: 16 }} />
      </div>

      {/* BODY — asymmetric two col */}
      <div style={{ display: "flex", gap: 28, padding: `20px ${format.pagePadding}px ${format.pagePadding}px` }}>
        <div style={{ flex: 2.4 }}>
          {mainSections.map(renderEditorial)}
        </div>
        <div style={{ flex: 1, borderLeft: `1px solid ${tc}1f`, paddingLeft: 24 }}>
          {sideSections.map(renderEditorialSide)}
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════
// ── TEMPLATE 9: MODERN TIMELINE ──
// ══════════════════════════════════════════════
function TimelineSection({ title, accent, format, theme, children, keepTogether = false }) {
  return (
    <div className={keepTogether ? "cv-section cv-section-keep" : "cv-section"} style={{ marginBottom: 16 }}>
      <div
        className="cv-section-heading"
        style={{
          fontSize: format.headingFontSize,
          fontWeight: format.headingBold ? 700 : 400,
          textTransform: format.headingUppercase ? "uppercase" : "none",
          letterSpacing: 1.5,
          color: "#fff",
          background: accent,
          display: "inline-block",
          padding: "4px 12px",
          borderRadius: 6,
          marginBottom: 10,
        }}
      >
        {title}
      </div>
      {children}
    </div>
  );
}

function TimelinePills({ skills, accent }) {
  const list = skills.split(/[,\n]+/).map(s => s.trim()).filter(Boolean);
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
      {list.map((s, i) => (
        <span key={i} style={{
          background: `${accent}14`,
          color: accent,
          border: `1.3px solid ${accent}55`,
          borderRadius: 20,
          padding: "4px 12px",
          fontSize: "0.78em",
          fontWeight: 600,
        }}>
          {s}
        </span>
      ))}
    </div>
  );
}

export function ModernTimeline({ cv, accent, format, sectionOrder, theme }) {
  const s = format.bodyFontSize;
  const lh = format.lineHeight;
  const tc = theme.text;

  const sideKeys = SIDEBAR_SECTIONS[8];
  const mainSections = sectionOrder.filter(k => !sideKeys.includes(k));
  const sideSections = sectionOrder.filter(k => sideKeys.includes(k));

  return (
    <div style={{
      fontFamily: format.fontFamily,
      fontSize: format.bodyFontSize,
      color: tc,
      lineHeight: format.lineHeight,
      background: theme.bg,
      minHeight: "100%",
      padding: `0 ${format.pagePadding}px`,
      boxSizing: "border-box",
    }}>
      {/* HEADER */}
      <div style={{
        paddingTop: format.pagePadding,
        paddingBottom: 18,
        display: "flex",
        alignItems: "center",
        gap: 18,
      }}>
        {cv.photo && (
          <img src={cv.photo} alt="profile" style={{
            width: 76, height: 76, borderRadius: "50%", objectFit: "cover",
            border: `3px solid ${accent}`, flexShrink: 0,
          }} />
        )}
        <div>
          <div style={{
            fontSize: format.nameFontSize,
            fontWeight: format.nameBold ? 800 : 400,
            fontStyle: format.nameItalic ? "italic" : "normal",
            color: tc,
          }}>
            {cv.name || "Your Name"}
          </div>
          <div style={{
            display: "inline-block", marginTop: 4,
            background: `${accent}16`, color: accent,
            fontSize: format.bodyFontSize, fontWeight: 700,
            padding: "3px 12px", borderRadius: 20,
          }}>
            {cv.jobTitle}
          </div>
        </div>
      </div>

      <div style={{
        display: "flex", flexWrap: "wrap", gap: 14, marginBottom: 18,
        fontSize: format.bodyFontSize - 1, color: tc, opacity: 0.65,
        borderTop: `1px solid ${tc}14`, borderBottom: `1px solid ${tc}14`, padding: "10px 0",
      }}>
        {cv.email && <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}><i className="fas fa-envelope" style={{ color: accent }}></i>{cv.email}</span>}
        {cv.phone && <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}><i className="fas fa-phone" style={{ color: accent }}></i>{cv.phone}</span>}
        {cv.address && <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}><i className="fas fa-map-marker-alt" style={{ color: accent }}></i>{cv.address}</span>}
        {cv.linkedin && <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}><i className="fab fa-linkedin" style={{ color: accent }}></i>{cv.linkedin}</span>}
        {cv.website && <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}><i className="fas fa-globe" style={{ color: accent }}></i>{cv.website}</span>}
        {cv.github && <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}><i className="fab fa-github" style={{ color: accent }}></i>{cv.github}</span>}
      </div>

      <div style={{ display: "flex", gap: 26 }}>
        {/* MAIN */}
        <div style={{ flex: 2.2 }}>
          {mainSections.map(key => {
            if (key === "biodata" && bioRows(cv).length) return (
              <TimelineSection key={key} title="Personal Details" accent={accent} format={format} theme={theme} keepTogether>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px 16px" }}>
                  {bioRows(cv).map(([label, val]) => (
                    <div key={label} style={{ fontSize: s - 0.5 }}>
                      <span style={{ fontWeight: 700, opacity: 0.75 }}>{label}: </span>
                      <span style={{ opacity: 0.7 }}>{val}</span>
                    </div>
                  ))}
                </div>
              </TimelineSection>
            );
            if (key === "summary" && cv.summary) return (
              <TimelineSection key={key} title="Profile" accent={accent} format={format} theme={theme} keepTogether>
                <p style={{ fontSize: s, lineHeight: lh, margin: 0, opacity: 0.85 }}>{cv.summary}</p>
              </TimelineSection>
            );
            if (key === "objective" && cv.objective) return (
              <TimelineSection key={key} title="Objective" accent={accent} format={format} theme={theme} keepTogether>
                <p style={{ fontSize: s, lineHeight: lh, margin: 0, opacity: 0.85 }}>{cv.objective}</p>
              </TimelineSection>
            );
            if (key === "experience" && cv.experience[0]?.company) return (
              <TimelineSection key={key} title="Experience" accent={accent} format={format} theme={theme}>
                <div style={{ position: "relative", paddingLeft: 4 }}>
                  <div style={{ position: "absolute", left: 5, top: 4, bottom: 4, width: 2, background: `${accent}30` }} />
                  {cv.experience.map((e, i) => (
                    <div key={i} style={{ position: "relative", paddingLeft: 22, marginBottom: 16 }} className="cv-item">
                      <div style={{
                        position: "absolute", left: 0, top: 4, width: 11, height: 11,
                        borderRadius: "50%", background: accent, border: `2.5px solid ${theme.bg}`,
                        boxShadow: `0 0 0 2px ${accent}40`,
                      }} />
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                        <b style={{ fontSize: s + 0.5, color: tc }}>{e.role}</b>
                        <span style={{ fontSize: s - 1.5, color: accent, fontWeight: 600 }}>
                          {e.start} – {e.current ? "Present" : e.end}
                        </span>
                      </div>
                      <div style={{ fontSize: s - 0.5, color: tc, opacity: 0.6, marginBottom: 3 }}>{e.company}</div>
                      <FineBullets text={e.responsibilities} fontSize={s - 0.5} lineHeight={lh} color={tc} accent={accent} />
                    </div>
                  ))}
                </div>
              </TimelineSection>
            );
            if (key === "education" && cv.education[0]?.school) return (
              <TimelineSection key={key} title="Education" accent={accent} format={format} theme={theme}>
                {cv.education.map((e, i) => (
                  <div key={i} className="cv-item" style={{ marginBottom: 10 }}>
                    <b style={{ fontSize: s, color: tc }}>{e.degree} {e.field && `in ${e.field}`}</b>
                    <div style={{ fontSize: s - 1, color: tc, opacity: 0.65 }}>{e.school} · {e.start} – {e.end}</div>
                  </div>
                ))}
              </TimelineSection>
            );
            if (key === "achievements" && cv.achievements?.[0]?.title) return (
              <TimelineSection key={key} title="Achievements" accent={accent} format={format} theme={theme}>
                {cv.achievements.map((a, i) => (
                  <div key={i} className="cv-item" style={{ marginBottom: 8 }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <b style={{ fontSize: s, color: tc }}>{a.title}</b>
                      <span style={{ fontSize: s - 1.5, color: accent }}>{a.date}</span>
                    </div>
                    {a.description && <div style={{ fontSize: s - 1, opacity: 0.75, marginTop: 2 }}>{a.description}</div>}
                  </div>
                ))}
              </TimelineSection>
            );
            if (key === "volunteer" && cv.volunteer?.[0]?.organization) return (
              <TimelineSection key={key} title="Volunteer" accent={accent} format={format} theme={theme}>
                {cv.volunteer.map((v, i) => (
                  <div key={i} className="cv-item" style={{ marginBottom: 8 }}>
                    <b style={{ fontSize: s, color: tc }}>{v.role}</b>
                    <div style={{ fontSize: s - 1, color: accent }}>{v.organization}</div>
                  </div>
                ))}
              </TimelineSection>
            );
            if (key === "publications" && cv.publications?.[0]?.title) return (
              <TimelineSection key={key} title="Publications" accent={accent} format={format} theme={theme}>
                {cv.publications.map((pub, i) => (
                  <div key={i} className="cv-item" style={{ marginBottom: 8 }}>
                    <b style={{ fontSize: s, color: tc }}>{pub.title}</b>
                  </div>
                ))}
              </TimelineSection>
            );
            if (key === "references" && cv.references?.[0]?.name) return (
              <TimelineSection key={key} title="References" accent={accent} format={format} theme={theme} keepTogether>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
                  {cv.references.map((r, i) => (
                    <div key={i} style={{ minWidth: 160 }}>
                      <b style={{ fontSize: s, color: tc }}>{r.name}</b>
                      <div style={{ fontSize: s - 1, opacity: 0.65 }}>{r.title}</div>
                    </div>
                  ))}
                </div>
              </TimelineSection>
            );
            return null;
          })}
        </div>

        {/* SIDE */}
        <div style={{ flex: 1 }}>
          {sideSections.map(key => {
            if (key === "skills" && cv.skills) return (
              <TimelineSection key={key} title="Skills" accent={accent} format={format} theme={theme} keepTogether>
                <TimelinePills skills={cv.skills} accent={accent} />
              </TimelineSection>
            );
            if (key === "languages" && cv.languages) return (
              <TimelineSection key={key} title="Languages" accent={accent} format={format} theme={theme} keepTogether>
                <p style={{ fontSize: s - 1, margin: 0, opacity: 0.85 }}>{cv.languages}</p>
              </TimelineSection>
            );
            if (key === "certifications" && hasCertifications(cv)) {
              const certs = normalizeCertifications(cv.certifications);
              return (
                <TimelineSection key={key} title="Certifications" accent={accent} format={format} theme={theme} keepTogether>
                  {certs.map((c, i) => (
                    <div key={i} style={{ marginBottom: 8 }}>
                      <div style={{ fontSize: s - 1, fontWeight: 700 }}>{c.name}</div>
                      {c.issuer && <div style={{ fontSize: s - 1.5, color: accent }}>{c.issuer}</div>}
                    </div>
                  ))}
                </TimelineSection>
              );
            }
            if (key === "hobbies" && cv.hobbies) return (
              <TimelineSection key={key} title="Interests" accent={accent} format={format} theme={theme} keepTogether>
                <p style={{ fontSize: s - 1, margin: 0, opacity: 0.85 }}>{cv.hobbies}</p>
              </TimelineSection>
            );
            return null;
          })}
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════
// ── TEMPLATE 10: COMPACT PRO (high-density, senior CVs) ──
// ══════════════════════════════════════════════
function CompactLabel({ children, accent }) {
  return (
    <div style={{
      fontSize: "0.68rem",
      fontWeight: 800,
      textTransform: "uppercase",
      letterSpacing: 1.2,
      color: accent,
      marginBottom: 4,
      paddingBottom: 3,
      borderBottom: `1.5px solid ${accent}40`,
    }}>
      {children}
    </div>
  );
}

export function CompactPro({ cv, accent, format, sectionOrder, theme }) {
  const s = Math.min(format.bodyFontSize, 10.5); // cap size — density is the point
  const lh = Math.min(format.lineHeight, 1.32);
  const tc = theme.text;

  const sideKeys = SIDEBAR_SECTIONS[9];
  const mainSections = sectionOrder.filter(k => !sideKeys.includes(k));
  const sideSections = sectionOrder.filter(k => sideKeys.includes(k));

  const renderMain = (key) => {
    switch (key) {
      case "biodata": {
        const has = cv.dateOfBirth || cv.gender || cv.maritalStatus || cv.nationality || cv.stateOfOrigin || cv.lga || cv.placeOfBirth || cv.religion || cv.nin;
        if (!has) return null;
        return (
          <div key={key} style={{ marginBottom: 10 }} className="cv-section-keep">
            <CompactLabel accent={accent}>Personal Details</CompactLabel>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1px 12px", fontSize: s - 0.5 }}>
              {[["DOB", formatDate(cv.dateOfBirth)], ["Gender", cv.gender], ["Marital", cv.maritalStatus], ["Nationality", cv.nationality], ["State", cv.stateOfOrigin], ["LGA", cv.lga], ["Religion", cv.religion], ["NIN", cv.nin]]
                .filter(([, v]) => v).map(([l, v]) => (
                  <div key={l} style={{ color: tc, opacity: 0.75 }}><b style={{ opacity: 0.6 }}>{l}:</b> {v}</div>
                ))}
            </div>
          </div>
        );
      }
      case "summary":
        return cv.summary ? (
          <div key={key} style={{ marginBottom: 10 }} className="cv-section-keep">
            <CompactLabel accent={accent}>Profile</CompactLabel>
            <p style={{ fontSize: s, lineHeight: lh, margin: 0, color: tc }}>{cv.summary}</p>
          </div>
        ) : null;
      case "objective":
        return cv.objective ? (
          <div key={key} style={{ marginBottom: 10 }} className="cv-section-keep">
            <CompactLabel accent={accent}>Objective</CompactLabel>
            <p style={{ fontSize: s, lineHeight: lh, margin: 0, color: tc }}>{cv.objective}</p>
          </div>
        ) : null;
      case "experience":
        return cv.experience[0]?.company ? (
          <div key={key} style={{ marginBottom: 10 }}>
            <CompactLabel accent={accent}>Experience</CompactLabel>
            {cv.experience.map((e, i) => (
              <div key={i} className="cv-item" style={{ marginBottom: 8 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <b style={{ fontSize: s + 0.5, color: tc }}>{e.role}</b>
                  <span style={{ fontSize: s - 1.5, color: accent, fontWeight: 700, whiteSpace: "nowrap", marginLeft: 8 }}>
                    {e.start}–{e.current ? "Now" : e.end}
                  </span>
                </div>
                <div style={{ fontSize: s - 0.5, color: tc, opacity: 0.65, marginBottom: 2 }}>{e.company}</div>
                <BulletList text={e.responsibilities} fontSize={s - 0.5} lineHeight={lh} color={tc} />
              </div>
            ))}
          </div>
        ) : null;
      case "education":
        return cv.education[0]?.school ? (
          <div key={key} style={{ marginBottom: 10 }}>
            <CompactLabel accent={accent}>Education</CompactLabel>
            {cv.education.map((e, i) => (
              <div key={i} style={{ marginBottom: 4, fontSize: s - 0.5 }}>
                <b style={{ color: tc }}>{e.degree} {e.field && `– ${e.field}`}</b>
                <span style={{ color: tc, opacity: 0.6 }}> · {e.school} · {e.start}–{e.end}</span>
              </div>
            ))}
          </div>
        ) : null;
      case "achievements":
        return cv.achievements?.[0]?.title ? (
          <div key={key} style={{ marginBottom: 10 }}>
            <CompactLabel accent={accent}>Achievements</CompactLabel>
            {cv.achievements.map((a, i) => (
              <div key={i} style={{ marginBottom: 4, fontSize: s - 0.5 }}>
                <b style={{ color: tc }}>{a.title}</b>
                {a.date && <span style={{ color: accent, fontWeight: 700 }}> · {a.date}</span>}
                {a.description && <div style={{ color: tc, opacity: 0.7 }}>{a.description}</div>}
              </div>
            ))}
          </div>
        ) : null;
      case "volunteer":
        return cv.volunteer?.[0]?.organization ? (
          <div key={key} style={{ marginBottom: 10 }}>
            <CompactLabel accent={accent}>Volunteer Work</CompactLabel>
            {cv.volunteer.map((v, i) => (
              <div key={i} style={{ marginBottom: 4, fontSize: s - 0.5 }}>
                <b style={{ color: tc }}>{v.role}</b> <span style={{ color: accent }}>· {v.organization}</span>
              </div>
            ))}
          </div>
        ) : null;
      case "publications":
        return cv.publications?.[0]?.title ? (
          <div key={key} style={{ marginBottom: 10 }}>
            <CompactLabel accent={accent}>Publications</CompactLabel>
            {cv.publications.map((p, i) => (
              <div key={i} style={{ marginBottom: 3, fontSize: s - 0.5, color: tc }}>{p.title}</div>
            ))}
          </div>
        ) : null;
      case "references":
        return cv.references?.[0]?.name ? (
          <div key={key} style={{ marginBottom: 10 }} className="cv-section-keep">
            <CompactLabel accent={accent}>References</CompactLabel>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12, fontSize: s - 0.5 }}>
              {cv.references.map((r, i) => (
                <div key={i}><b style={{ color: tc }}>{r.name}</b> <span style={{ color: tc, opacity: 0.6 }}>– {r.title}</span></div>
              ))}
            </div>
          </div>
        ) : null;
      default: return null;
    }
  };

  const renderSide = (key) => {
    switch (key) {
      case "skills":
        return cv.skills ? (
          <div key={key} style={{ marginBottom: 10 }} className="cv-section-keep">
            <CompactLabel accent={accent}>Skills</CompactLabel>
            <p style={{ fontSize: s - 0.5, lineHeight: 1.5, margin: 0, color: tc }}>
              {cv.skills.split(/[,\n]+/).map(x => x.trim()).filter(Boolean).join("  •  ")}
            </p>
          </div>
        ) : null;
      case "languages":
        return cv.languages ? (
          <div key={key} style={{ marginBottom: 10 }} className="cv-section-keep">
            <CompactLabel accent={accent}>Languages</CompactLabel>
            <p style={{ fontSize: s - 0.5, margin: 0, color: tc }}>{cv.languages}</p>
          </div>
        ) : null;
      case "certifications": {
        if (!hasCertifications(cv)) return null;
        const certs = normalizeCertifications(cv.certifications);
        return (
          <div key={key} style={{ marginBottom: 10 }} className="cv-section-keep">
            <CompactLabel accent={accent}>Certifications</CompactLabel>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px 10px" }}>
              {certs.map((c, i) => (
                <div key={i} style={{ fontSize: s - 1, color: tc }}>
                  <b style={{ display: "block" }}>{c.name}</b>
                  {c.issuer && <span style={{ opacity: 0.6 }}>{c.issuer}</span>}
                </div>
              ))}
            </div>
          </div>
        );
      }
      case "hobbies":
        return cv.hobbies ? (
          <div key={key} style={{ marginBottom: 10 }} className="cv-section-keep">
            <CompactLabel accent={accent}>Interests</CompactLabel>
            <p style={{ fontSize: s - 0.5, margin: 0, color: tc }}>{cv.hobbies}</p>
          </div>
        ) : null;
      default: return null;
    }
  };

  return (
    <div style={{
      fontFamily: format.fontFamily,
      fontSize: s,
      color: tc,
      lineHeight: lh,
      background: theme.bg,
      minHeight: "100%",
      boxSizing: "border-box",
    }}>
      {/* SLIM HEADER */}
      <div style={{
        display: "flex",
        alignItems: "baseline",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: 8,
        padding: `${format.pagePadding - 6}px ${format.pagePadding}px 8px`,
        borderBottom: `2.5px solid ${accent}`,
      }}>
        <div>
          <span style={{ fontSize: format.nameFontSize - 4, fontWeight: 800, color: tc }}>{cv.name || "Your Name"}</span>
          <span style={{ fontSize: s, color: accent, fontWeight: 700, marginLeft: 10 }}>{cv.jobTitle}</span>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, fontSize: s - 1.5, color: tc, opacity: 0.65 }}>
          {cv.email && <span>{cv.email}</span>}
          {cv.phone && <span>{cv.phone}</span>}
          {cv.address && <span>{cv.address}</span>}
          {cv.linkedin && <span>{cv.linkedin}</span>}
          {cv.website && <span>{cv.website}</span>}
          {cv.github && <span>{cv.github}</span>}
        </div>
      </div>

      {/* DENSE TWO-COL BODY */}
      <div style={{ display: "flex", gap: 22, padding: `12px ${format.pagePadding}px ${format.pagePadding}px` }}>
        <div style={{ flex: 1.85 }}>{mainSections.map(renderMain)}</div>
        <div style={{ flex: 1, borderLeft: `1px solid ${tc}1a`, paddingLeft: 18 }}>{sideSections.map(renderSide)}</div>
      </div>
    </div>
  );
}


//new template
// ══════════════════════════════════════════════
// ── TEMPLATE 11 (REBUILT): BOLD STATEMENT — single column, no sidebar ──
// ══════════════════════════════════════════════
function BoldRule({ accent }) {
  return <div style={{ height: 4, width: 64, background: accent, marginBottom: 18 }} />;
}

function BoldSection({ num, title, accent, format, theme, children, keepTogether = false }) {
  return (
    <div className={keepTogether ? "cv-section cv-section-keep" : "cv-section"} style={{ marginBottom: 24 }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 10 }}>
        <span style={{
          fontSize: format.headingFontSize + 8,
          fontWeight: 900,
          color: accent,
          opacity: 0.22,
          lineHeight: 1,
          fontVariantNumeric: "tabular-nums",
        }}>
          {num}
        </span>
        <span style={{
          fontSize: format.headingFontSize + 2,
          fontWeight: 800,
          textTransform: "uppercase",
          letterSpacing: 2,
          color: theme.text,
        }}>
          {title}
        </span>
      </div>
      {children}
    </div>
  );
}

export function BoldStatement({ cv, accent, format, sectionOrder, theme }) {
  const s = format.bodyFontSize;
  const lh = format.lineHeight;
  const tc = theme.text;
  let n = 0;
  const nextNum = () => String(++n).padStart(2, "0");

  const renderSection = (key) => {
    switch (key) {
      case "biodata": {
        const has = cv.dateOfBirth || cv.gender || cv.maritalStatus || cv.nationality || cv.stateOfOrigin || cv.lga || cv.placeOfBirth || cv.religion || cv.nin;
        if (!has) return null;
        return (
          <BoldSection key={key} num={nextNum()} title="Personal Details" accent={accent} format={format} theme={theme} keepTogether>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5px 20px", fontSize: s }}>
              {[["Date of Birth", formatDate(cv.dateOfBirth)], ["Gender", cv.gender], ["Marital Status", cv.maritalStatus], ["Nationality", cv.nationality], ["State of Origin", cv.stateOfOrigin], ["LGA", cv.lga], ["Religion", cv.religion], ["NIN", cv.nin]]
                .filter(([, v]) => v).map(([l, v]) => (
                  <div key={l} style={{ color: tc }}><b style={{ opacity: 0.55 }}>{l}: </b>{v}</div>
                ))}
            </div>
          </BoldSection>
        );
      }
      case "summary":
        return cv.summary ? (
          <BoldSection key={key} num={nextNum()} title="Profile" accent={accent} format={format} theme={theme} keepTogether>
            <p style={{ fontSize: s + 1.5, lineHeight: lh + 0.2, margin: 0, color: tc, fontWeight: 450 }}>{cv.summary}</p>
          </BoldSection>
        ) : null;
      case "objective":
        return cv.objective ? (
          <BoldSection key={key} num={nextNum()} title="Objective" accent={accent} format={format} theme={theme} keepTogether>
            <p style={{ fontSize: s, lineHeight: lh, margin: 0, color: tc }}>{cv.objective}</p>
          </BoldSection>
        ) : null;
      case "experience":
        return cv.experience[0]?.company ? (
          <BoldSection key={key} num={nextNum()} title="Experience" accent={accent} format={format} theme={theme}>
            {cv.experience.map((e, i) => (
              <div key={i} className="cv-item" style={{ marginBottom: 18 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: 8 }}>
                  <b style={{ fontSize: s + 2, color: tc }}>{e.role}</b>
                  <span style={{ fontSize: s - 1, color: accent, fontWeight: 800, whiteSpace: "nowrap" }}>
                    {e.start} — {e.current ? "Present" : e.end}
                  </span>
                </div>
                <div style={{ fontSize: s + 0.5, color: tc, opacity: 0.6, fontWeight: 600, marginBottom: 5 }}>{e.company}</div>
                <BulletList text={e.responsibilities} fontSize={s} lineHeight={lh} color={tc} accent={accent} />
              </div>
            ))}
          </BoldSection>
        ) : null;
      case "education":
        return cv.education[0]?.school ? (
          <BoldSection key={key} num={nextNum()} title="Education" accent={accent} format={format} theme={theme}>
            {cv.education.map((e, i) => (
              <div key={i} style={{ marginBottom: 10 }}>
                <b style={{ fontSize: s + 1, color: tc }}>{e.degree} {e.field && `in ${e.field}`}</b>
                <div style={{ fontSize: s, opacity: 0.6, marginTop: 1 }}>{e.school} · {e.start}–{e.end}</div>
              </div>
            ))}
          </BoldSection>
        ) : null;
      case "skills":
        return cv.skills ? (
          <BoldSection key={key} num={nextNum()} title="Skills" accent={accent} format={format} theme={theme} keepTogether>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {cv.skills.split(/[,\n]+/).map(x => x.trim()).filter(Boolean).map((sk, i) => (
                <span key={i} style={{
                  border: `1.5px solid ${accent}`,
                  color: tc,
                  fontWeight: 700,
                  fontSize: s - 0.5,
                  padding: "5px 12px",
                  borderRadius: 4,
                }}>
                  {sk}
                </span>
              ))}
            </div>
          </BoldSection>
        ) : null;
      case "languages":
        return cv.languages ? (
          <BoldSection key={key} num={nextNum()} title="Languages" accent={accent} format={format} theme={theme} keepTogether>
            <p style={{ fontSize: s, margin: 0, color: tc }}>{cv.languages}</p>
          </BoldSection>
        ) : null;
      case "certifications": {
        if (!hasCertifications(cv)) return null;
        const certs = normalizeCertifications(cv.certifications);
        return (
          <BoldSection key={key} num={nextNum()} title="Certifications" accent={accent} format={format} theme={theme} keepTogether>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px 20px" }}>
              {certs.map((c, i) => (
                <div key={i}>
                  <b style={{ fontSize: s, color: tc }}>{c.name}</b>
                  {c.issuer && <div style={{ fontSize: s - 1, color: accent, fontWeight: 700 }}>{c.issuer}</div>}
                </div>
              ))}
            </div>
          </BoldSection>
        );
      }
      case "achievements":
        return cv.achievements?.[0]?.title ? (
          <BoldSection key={key} num={nextNum()} title="Achievements" accent={accent} format={format} theme={theme}>
            {cv.achievements.map((a, i) => (
              <div key={i} style={{ marginBottom: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <b style={{ fontSize: s, color: tc }}>{a.title}</b>
                  <span style={{ fontSize: s - 1, color: accent, fontWeight: 700 }}>{a.date}</span>
                </div>
                {a.description && <div style={{ fontSize: s - 0.5, opacity: 0.7, marginTop: 2 }}>{a.description}</div>}
              </div>
            ))}
          </BoldSection>
        ) : null;
      case "volunteer":
        return cv.volunteer?.[0]?.organization ? (
          <BoldSection key={key} num={nextNum()} title="Volunteer" accent={accent} format={format} theme={theme}>
            {cv.volunteer.map((v, i) => (
              <div key={i} style={{ marginBottom: 8 }}>
                <b style={{ color: tc }}>{v.role}</b> <span style={{ color: accent, fontWeight: 700 }}>· {v.organization}</span>
              </div>
            ))}
          </BoldSection>
        ) : null;
      case "publications":
        return cv.publications?.[0]?.title ? (
          <BoldSection key={key} num={nextNum()} title="Publications" accent={accent} format={format} theme={theme}>
            {cv.publications.map((p, i) => <div key={i} style={{ marginBottom: 6, color: tc }}>{p.title}</div>)}
          </BoldSection>
        ) : null;
      case "hobbies":
        return cv.hobbies ? (
          <BoldSection key={key} num={nextNum()} title="Interests" accent={accent} format={format} theme={theme} keepTogether>
            <p style={{ fontSize: s, margin: 0, color: tc }}>{cv.hobbies}</p>
          </BoldSection>
        ) : null;
      case "references":
        return cv.references?.[0]?.name ? (
          <BoldSection key={key} num={nextNum()} title="References" accent={accent} format={format} theme={theme} keepTogether>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 18 }}>
              {cv.references.map((r, i) => (
                <div key={i}><b style={{ color: tc }}>{r.name}</b> <span style={{ opacity: 0.6 }}>– {r.title}</span></div>
              ))}
            </div>
          </BoldSection>
        ) : null;
      default: return null;
    }
  };

  return (
    <div style={{
      fontFamily: format.fontFamily,
      fontSize: s,
      color: tc,
      lineHeight: lh,
      background: theme.bg,
      minHeight: "100%",
      boxSizing: "border-box",
      padding: `${format.pagePadding + 10}px ${format.pagePadding + 6}px`,
    }}>
      {/* BOLD HEADER — name dominates, no photo, no sidebar */}
      <div style={{ marginBottom: 8 }}>
        <div style={{
          fontSize: format.nameFontSize + 10,
          fontWeight: 900,
          letterSpacing: -1,
          lineHeight: 0.98,
          color: tc,
        }}>
          {cv.name || "Your Name"}
        </div>
        <div style={{
          fontSize: format.bodyFontSize + 3,
          fontWeight: 700,
          color: accent,
          marginTop: 6,
          textTransform: "uppercase",
          letterSpacing: 1,
        }}>
          {cv.jobTitle}
        </div>
      </div>

      <BoldRule accent={accent} />

      <div style={{
        display: "flex", flexWrap: "wrap", gap: 16, marginBottom: 26,
        fontSize: s - 0.5, color: tc, opacity: 0.7,
      }}>
        {cv.email && <span>{cv.email}</span>}
        {cv.phone && <span>{cv.phone}</span>}
        {cv.address && <span>{cv.address}</span>}
        {cv.linkedin && <span>{cv.linkedin}</span>}
        {cv.website && <span>{cv.website}</span>}
        {cv.github && <span>{cv.github}</span>}
      </div>

      {sectionOrder.map(renderSection)}
    </div>
  );
}

// ══════════════════════════════════════════════
// ── TEMPLATE 12: HORIZON (full-width banner header) ──
// ══════════════════════════════════════════════
export function Horizon({ cv, accent, format, sectionOrder, theme }) {
  const s = format.bodyFontSize;
  const lh = format.lineHeight;
  const tc = theme.text;
  const p = format.pagePadding;

  const renderSection = (key) => {
    switch (key) {
      case "biodata": {
        const has = cv.dateOfBirth || cv.gender || cv.maritalStatus ||
          cv.nationality || cv.stateOfOrigin || cv.lga ||
          cv.placeOfBirth || cv.religion || cv.nin;
        if (!has) return null;
        return (
          <div key={key} style={{ marginBottom: 16 }} className="cv-section-keep">
            <HorizonLabel title="Personal Details" accent={accent} format={format} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3px 20px", fontSize: s - 0.5 }}>
              {[
                ["Date of Birth", formatDate(cv.dateOfBirth)],
                ["Place of Birth", cv.placeOfBirth],
                ["Gender", cv.gender],
                ["Marital Status", cv.maritalStatus],
                ["Nationality", cv.nationality],
                ["State of Origin", cv.stateOfOrigin],
                ["LGA", cv.lga],
                ["Religion", cv.religion],
                ["NIN", cv.nin],
              ].filter(([, v]) => v).map(([l, v]) => (
                <div key={l} style={{ color: tc }}>
                  <b style={{ opacity: 0.55 }}>{l}: </b>{v}
                </div>
              ))}
            </div>
          </div>
        );
      }
      case "summary":
        return cv.summary ? (
          <div key={key} style={{ marginBottom: 16 }} className="cv-section-keep">
            <HorizonLabel title="Professional Summary" accent={accent} format={format} />
            <p style={{ fontSize: s, lineHeight: lh, margin: 0, color: tc, textAlign: "justify" }}>{cv.summary}</p>
          </div>
        ) : null;
      case "objective":
        return cv.objective ? (
          <div key={key} style={{ marginBottom: 16 }} className="cv-section-keep">
            <HorizonLabel title="Career Objective" accent={accent} format={format} />
            <p style={{ fontSize: s, lineHeight: lh, margin: 0, color: tc, textAlign: "justify" }}>{cv.objective}</p>
          </div>
        ) : null;
      case "experience":
        return cv.experience[0]?.company ? (
          <div key={key} style={{ marginBottom: 16 }}>
            <HorizonLabel title="Work Experience" accent={accent} format={format} />
            {cv.experience.map((e, i) => (
              <div key={i} className="cv-item" style={{ marginBottom: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 4 }}>
                  <b style={{ fontSize: s + 1, color: tc }}>{e.role}</b>
                  <span style={{
                    fontSize: s - 1.5,
                    background: `${accent}18`,
                    color: accent,
                    fontWeight: 800,
                    padding: "3px 10px",
                    borderRadius: 4,
                    whiteSpace: "nowrap",
                  }}>
                    {e.start} – {e.current ? "Present" : e.end}
                  </span>
                </div>
                <div style={{ fontSize: s, color: accent, fontWeight: 700, marginBottom: 4 }}>{e.company}</div>
                <BulletList text={e.responsibilities} fontSize={s} lineHeight={lh} color={tc} />
              </div>
            ))}
          </div>
        ) : null;
      case "education":
        return cv.education[0]?.school ? (
          <div key={key} style={{ marginBottom: 16 }}>
            <HorizonLabel title="Education" accent={accent} format={format} />
            {cv.education.map((e, i) => (
              <div key={i} style={{ marginBottom: 8 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap" }}>
                  <b style={{ fontSize: s + 0.5, color: tc }}>{e.degree} {e.field && `in ${e.field}`}</b>
                  <span style={{ fontSize: s - 1.5, color: accent, fontWeight: 700 }}>{e.start}–{e.end}</span>
                </div>
                <div style={{ fontSize: s - 0.5, color: tc, opacity: 0.65 }}>{e.school}</div>
              </div>
            ))}
          </div>
        ) : null;
      case "skills":
        return cv.skills ? (
          <div key={key} style={{ marginBottom: 16 }} className="cv-section-keep">
            <HorizonLabel title="Skills" accent={accent} format={format} />
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {cv.skills.split(/[,\n]+/).map(x => x.trim()).filter(Boolean).map((sk, i) => (
                <span key={i} style={{
                  background: `${accent}14`,
                  color: tc,
                  border: `1px solid ${accent}40`,
                  fontSize: s - 1,
                  fontWeight: 600,
                  padding: "4px 11px",
                  borderRadius: 20,
                }}>
                  {sk}
                </span>
              ))}
            </div>
          </div>
        ) : null;
      case "languages":
        return cv.languages ? (
          <div key={key} style={{ marginBottom: 16 }} className="cv-section-keep">
            <HorizonLabel title="Languages" accent={accent} format={format} />
            <p style={{ fontSize: s, margin: 0, color: tc }}>{cv.languages}</p>
          </div>
        ) : null;
      case "certifications": {
        if (!hasCertifications(cv)) return null;
        const certs = normalizeCertifications(cv.certifications);
        return (
          <div key={key} style={{ marginBottom: 16 }} className="cv-section-keep">
            <HorizonLabel title="Certifications" accent={accent} format={format} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px 20px" }}>
              {certs.map((c, i) => (
                <div key={i}>
                  <b style={{ fontSize: s - 0.5, color: tc, display: "block" }}>{c.name}</b>
                  {c.issuer && <span style={{ fontSize: s - 1.5, color: accent, fontWeight: 700 }}>{c.issuer}</span>}
                </div>
              ))}
            </div>
          </div>
        );
      }
      case "achievements":
        return cv.achievements?.[0]?.title ? (
          <div key={key} style={{ marginBottom: 16 }}>
            <HorizonLabel title="Achievements" accent={accent} format={format} />
            {cv.achievements.map((a, i) => (
              <div key={i} style={{ marginBottom: 8 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <b style={{ fontSize: s, color: tc }}>{a.title}</b>
                  <span style={{ fontSize: s - 1.5, color: accent, fontWeight: 700 }}>{a.date}</span>
                </div>
                {a.description && <p style={{ fontSize: s - 0.5, margin: "2px 0 0", opacity: 0.75, textAlign: "justify" }}>{a.description}</p>}
              </div>
            ))}
          </div>
        ) : null;
      case "hobbies":
        return cv.hobbies ? (
          <div key={key} style={{ marginBottom: 16 }} className="cv-section-keep">
            <HorizonLabel title="Interests" accent={accent} format={format} />
            <p style={{ fontSize: s, margin: 0, color: tc }}>{cv.hobbies}</p>
          </div>
        ) : null;
      case "volunteer":
        return cv.volunteer?.[0]?.organization ? (
          <div key={key} style={{ marginBottom: 16 }}>
            <HorizonLabel title="Volunteer Work" accent={accent} format={format} />
            {cv.volunteer.map((v, i) => (
              <div key={i} style={{ marginBottom: 6 }}>
                <b style={{ color: tc }}>{v.role}</b>
                <span style={{ color: accent, fontWeight: 700 }}> · {v.organization}</span>
                {v.description && <p style={{ fontSize: s - 0.5, margin: "2px 0 0", opacity: 0.75 }}>{v.description}</p>}
              </div>
            ))}
          </div>
        ) : null;
      case "publications":
        return cv.publications?.[0]?.title ? (
          <div key={key} style={{ marginBottom: 16 }}>
            <HorizonLabel title="Publications" accent={accent} format={format} />
            {cv.publications.map((p, i) => (
              <div key={i} style={{ marginBottom: 6, color: tc }}>{p.title}</div>
            ))}
          </div>
        ) : null;
      case "references":
        return cv.references?.[0]?.name ? (
          <div key={key} style={{ marginBottom: 16 }} className="cv-section-keep">
            <HorizonLabel title="References" accent={accent} format={format} />
            <div style={{ display: "flex", flexWrap: "wrap", gap: 20 }}>
              {cv.references.map((r, i) => (
                <div key={i}>
                  <b style={{ color: tc }}>{r.name}</b>
                  <div style={{ fontSize: s - 1, opacity: 0.65 }}>{r.title}{r.company && ` — ${r.company}`}</div>
                </div>
              ))}
            </div>
          </div>
        ) : null;
      default:
        return null;
    }
  };

  return (
    <div style={{
      fontFamily: format.fontFamily,
      fontSize: s,
      color: tc,
      lineHeight: lh,
      background: theme.bg,
      minHeight: "100%",
      boxSizing: "border-box",
    }}>
      {/* FULL-WIDTH BANNER HEADER */}
      <div style={{
        background: `linear-gradient(135deg, ${accent}, ${accent}cc)`,
        padding: `${p + 10}px ${p}px ${p + 6}px`,
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Decorative geometric accent shapes in the banner */}
        <div style={{
          position: "absolute",
          top: -20,
          right: -20,
          width: 120,
          height: 120,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.07)",
        }} />
        <div style={{
          position: "absolute",
          bottom: -30,
          right: 60,
          width: 80,
          height: 80,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.05)",
        }} />

        <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 20 }}>
          {cv.photo && (
            <img
              src={cv.photo}
              alt="profile"
              style={{
                width: 76,
                height: 76,
                borderRadius: "50%",
                objectFit: "cover",
                border: "3px solid rgba(255,255,255,0.6)",
                flexShrink: 0,
              }}
            />
          )}
          <div style={{ flex: 1 }}>
            <div style={{
              fontSize: format.nameFontSize + 2,
              fontWeight: format.nameBold ? 900 : 400,
              fontStyle: format.nameItalic ? "italic" : "normal",
              color: "#fff",
              lineHeight: 1.1,
              marginBottom: 4,
            }}>
              {cv.name || "Your Name"}
            </div>
            <div style={{
              fontSize: s + 2,
              fontWeight: 600,
              color: "rgba(255,255,255,0.82)",
              marginBottom: 12,
              letterSpacing: 0.3,
            }}>
              {cv.jobTitle}
            </div>
            <div style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "4px 16px",
              fontSize: s - 1.5,
              color: "rgba(255,255,255,0.75)",
            }}>
              {cv.email && (
                <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                  <i className="fas fa-envelope" style={{ fontSize: s - 2 }}></i> {cv.email}
                </span>
              )}
              {cv.phone && (
                <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                  <i className="fas fa-phone" style={{ fontSize: s - 2 }}></i> {cv.phone}
                </span>
              )}
              {cv.address && (
                <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                  <i className="fas fa-map-marker-alt" style={{ fontSize: s - 2 }}></i> {cv.address}
                </span>
              )}
              {cv.linkedin && (
                <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                  <i className="fab fa-linkedin" style={{ fontSize: s - 2 }}></i> {cv.linkedin}
                </span>
              )}
              {cv.website && (
                <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                  <i className="fas fa-globe" style={{ fontSize: s - 2 }}></i> {cv.website}
                </span>
              )}
              {cv.github && (
                <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                  <i className="fab fa-github" style={{ fontSize: s - 2 }}></i> {cv.github}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* BODY */}
      <div style={{ padding: `${p}px ${p}px` }}>
        {sectionOrder.map(renderSection)}
      </div>
    </div>
  );
}

function HorizonLabel({ title, accent, format }) {
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      gap: 10,
      marginBottom: 8,
    }}>
      <div style={{
        width: 28,
        height: 3,
        background: accent,
        borderRadius: 2,
        flexShrink: 0,
      }} />
      <div style={{
        fontSize: format.headingFontSize,
        fontWeight: format.headingBold ? 800 : 400,
        textTransform: format.headingUppercase ? "uppercase" : "none",
        letterSpacing: 1.5,
        color: "#111",
      }}>
        {title}
      </div>
      <div style={{
        flex: 1,
        height: 1,
        background: "#e5e7eb",
      }} />
    </div>
  );
}

// ══════════════════════════════════════════════
// ── TEMPLATE 13: REFINED (two-tone name, border system) ──
// ══════════════════════════════════════════════
function RefinedLabel({ title, accent, format }) {
  return (
    <div style={{
      display: "flex",
      alignItems: "stretch",
      gap: 12,
      marginBottom: 10,
    }}>
      <div style={{
        width: 4,
        background: accent,
        borderRadius: 2,
        flexShrink: 0,
        alignSelf: "stretch",
        minHeight: 18,
      }} />
      <div style={{
        fontSize: format.headingFontSize,
        fontWeight: format.headingBold ? 800 : 400,
        textTransform: format.headingUppercase ? "uppercase" : "none",
        letterSpacing: 2,
        color: "#111",
        paddingTop: 1,
      }}>
        {title}
      </div>
    </div>
  );
}

export function Refined({ cv, accent, format, sectionOrder, theme }) {
  const s = format.bodyFontSize;
  const lh = format.lineHeight;
  const tc = theme.text;
  const p = format.pagePadding;

  // Split the name into first + rest for two-tone treatment
  const nameParts = (cv.name || "Your Name").trim().split(" ");
  const firstName = nameParts[0];
  const restOfName = nameParts.slice(1).join(" ");

  const renderSection = (key) => {
    switch (key) {
      case "biodata": {
        const has = cv.dateOfBirth || cv.gender || cv.maritalStatus ||
          cv.nationality || cv.stateOfOrigin || cv.lga ||
          cv.placeOfBirth || cv.religion || cv.nin;
        if (!has) return null;
        return (
          <div key={key} style={{ marginBottom: 18 }} className="cv-section-keep">
            <RefinedLabel title="Personal Details" accent={accent} format={format} />
            <div style={{ paddingLeft: 16, display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px 20px", fontSize: s - 0.5 }}>
              {[
                ["Date of Birth", formatDate(cv.dateOfBirth)],
                ["Place of Birth", cv.placeOfBirth],
                ["Gender", cv.gender],
                ["Marital Status", cv.maritalStatus],
                ["Nationality", cv.nationality],
                ["State of Origin", cv.stateOfOrigin],
                ["LGA", cv.lga],
                ["Religion", cv.religion],
                ["NIN", cv.nin],
              ].filter(([, v]) => v).map(([l, v]) => (
                <div key={l} style={{ color: tc }}>
                  <b style={{ color: accent }}>{l}: </b>{v}
                </div>
              ))}
            </div>
          </div>
        );
      }
      case "summary":
        return cv.summary ? (
          <div key={key} style={{ marginBottom: 18 }} className="cv-section-keep">
            <RefinedLabel title="Profile" accent={accent} format={format} />
            <p style={{
              fontSize: s,
              lineHeight: lh,
              margin: "0 0 0 16px",
              color: tc,
              textAlign: "justify",
            }}>
              {cv.summary}
            </p>
          </div>
        ) : null;
      case "objective":
        return cv.objective ? (
          <div key={key} style={{ marginBottom: 18 }} className="cv-section-keep">
            <RefinedLabel title="Objective" accent={accent} format={format} />
            <p style={{ fontSize: s, lineHeight: lh, margin: "0 0 0 16px", color: tc, textAlign: "justify" }}>
              {cv.objective}
            </p>
          </div>
        ) : null;
      case "experience":
        return cv.experience[0]?.company ? (
          <div key={key} style={{ marginBottom: 18 }}>
            <RefinedLabel title="Work Experience" accent={accent} format={format} />
            <div style={{ paddingLeft: 16 }}>
              {cv.experience.map((e, i) => (
                <div key={i} className="cv-item" style={{ marginBottom: 14, position: "relative" }}>
                  <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "baseline",
                    flexWrap: "wrap",
                    gap: 8,
                  }}>
                    <b style={{ fontSize: s + 1.5, color: tc, fontWeight: 800 }}>{e.role}</b>
                    <span style={{
                      fontSize: s - 1,
                      color: tc,
                      opacity: 0.55,
                      fontStyle: "italic",
                      whiteSpace: "nowrap",
                    }}>
                      {e.start} – {e.current ? "Present" : e.end}
                    </span>
                  </div>
                  <div style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    marginBottom: 5,
                  }}>
                    <div style={{ width: 16, height: 1.5, background: accent }} />
                    <span style={{ fontSize: s - 0.5, color: accent, fontWeight: 700 }}>{e.company}</span>
                  </div>
                  <BulletList text={e.responsibilities} fontSize={s} lineHeight={lh} color={tc} />
                </div>
              ))}
            </div>
          </div>
        ) : null;
      case "education":
        return cv.education[0]?.school ? (
          <div key={key} style={{ marginBottom: 18 }}>
            <RefinedLabel title="Education" accent={accent} format={format} />
            <div style={{ paddingLeft: 16 }}>
              {cv.education.map((e, i) => (
                <div key={i} style={{ marginBottom: 8 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 4 }}>
                    <b style={{ fontSize: s + 0.5, color: tc }}>{e.degree} {e.field && `in ${e.field}`}</b>
                    <span style={{ fontSize: s - 1.5, color: tc, opacity: 0.55, fontStyle: "italic" }}>{e.start}–{e.end}</span>
                  </div>
                  <div style={{ fontSize: s - 0.5, color: tc, opacity: 0.7 }}>{e.school}</div>
                </div>
              ))}
            </div>
          </div>
        ) : null;
      case "skills":
        return cv.skills ? (
          <div key={key} style={{ marginBottom: 18 }} className="cv-section-keep">
            <RefinedLabel title="Skills" accent={accent} format={format} />
            <div style={{ paddingLeft: 16, display: "flex", flexWrap: "wrap", gap: 6 }}>
              {cv.skills.split(/[,\n]+/).map(x => x.trim()).filter(Boolean).map((sk, i) => (
                <span key={i} style={{
                  fontSize: s - 0.5,
                  color: tc,
                  fontWeight: 600,
                  padding: "4px 0",
                  paddingRight: 12,
                  borderRight: i % 3 !== 2 ? `1px solid ${accent}50` : "none",
                  paddingLeft: i % 3 !== 0 ? 12 : 0,
                }}>
                  {sk}
                </span>
              ))}
            </div>
          </div>
        ) : null;
      case "languages":
        return cv.languages ? (
          <div key={key} style={{ marginBottom: 18 }} className="cv-section-keep">
            <RefinedLabel title="Languages" accent={accent} format={format} />
            <p style={{ fontSize: s, margin: "0 0 0 16px", color: tc }}>{cv.languages}</p>
          </div>
        ) : null;
      case "certifications": {
        if (!hasCertifications(cv)) return null;
        const certs = normalizeCertifications(cv.certifications);
        return (
          <div key={key} style={{ marginBottom: 18 }} className="cv-section-keep">
            <RefinedLabel title="Certifications" accent={accent} format={format} />
            <div style={{ paddingLeft: 16, display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 20px" }}>
              {certs.map((c, i) => (
                <div key={i}>
                  <b style={{ fontSize: s - 0.5, color: tc, display: "block" }}>{c.name}</b>
                  {c.issuer && <span style={{ fontSize: s - 1.5, color: accent, fontWeight: 700 }}>{c.issuer}</span>}
                </div>
              ))}
            </div>
          </div>
        );
      }
      case "achievements":
        return cv.achievements?.[0]?.title ? (
          <div key={key} style={{ marginBottom: 18 }}>
            <RefinedLabel title="Achievements" accent={accent} format={format} />
            <div style={{ paddingLeft: 16 }}>
              {cv.achievements.map((a, i) => (
                <div key={i} style={{ marginBottom: 8 }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <b style={{ fontSize: s, color: tc }}>{a.title}</b>
                    <span style={{ fontSize: s - 1.5, color: accent, fontWeight: 700 }}>{a.date}</span>
                  </div>
                  {a.description && (
                    <p style={{ fontSize: s - 0.5, margin: "2px 0 0", opacity: 0.75, textAlign: "justify" }}>{a.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : null;
      case "hobbies":
        return cv.hobbies ? (
          <div key={key} style={{ marginBottom: 18 }} className="cv-section-keep">
            <RefinedLabel title="Interests" accent={accent} format={format} />
            <p style={{ fontSize: s, margin: "0 0 0 16px", color: tc }}>{cv.hobbies}</p>
          </div>
        ) : null;
      case "volunteer":
        return cv.volunteer?.[0]?.organization ? (
          <div key={key} style={{ marginBottom: 18 }}>
            <RefinedLabel title="Volunteer" accent={accent} format={format} />
            <div style={{ paddingLeft: 16 }}>
              {cv.volunteer.map((v, i) => (
                <div key={i} style={{ marginBottom: 6 }}>
                  <b style={{ color: tc }}>{v.role}</b>
                  <span style={{ color: accent, fontWeight: 700 }}> · {v.organization}</span>
                </div>
              ))}
            </div>
          </div>
        ) : null;
      case "publications":
        return cv.publications?.[0]?.title ? (
          <div key={key} style={{ marginBottom: 18 }}>
            <RefinedLabel title="Publications" accent={accent} format={format} />
            <div style={{ paddingLeft: 16 }}>
              {cv.publications.map((p, i) => (
                <div key={i} style={{ marginBottom: 5, color: tc }}>{p.title}</div>
              ))}
            </div>
          </div>
        ) : null;
      case "references":
        return cv.references?.[0]?.name ? (
          <div key={key} style={{ marginBottom: 18 }} className="cv-section-keep">
            <RefinedLabel title="References" accent={accent} format={format} />
            <div style={{ paddingLeft: 16, display: "flex", flexWrap: "wrap", gap: 20 }}>
              {cv.references.map((r, i) => (
                <div key={i}>
                  <b style={{ color: tc }}>{r.name}</b>
                  <div style={{ fontSize: s - 1, opacity: 0.65 }}>{r.title}{r.company && ` — ${r.company}`}</div>
                </div>
              ))}
            </div>
          </div>
        ) : null;
      default:
        return null;
    }
  };

  return (
    <div style={{
      fontFamily: format.fontFamily,
      fontSize: s,
      color: tc,
      lineHeight: lh,
      background: theme.bg,
      minHeight: "100%",
      boxSizing: "border-box",
      padding: `${p + 8}px ${p}px`,
    }}>
      {/* TWO-TONE NAME HEADER */}
      <div style={{ marginBottom: 6 }}>
        <div style={{ lineHeight: 1.05, marginBottom: 6 }}>
          <span style={{
            fontSize: format.nameFontSize + 6,
            fontWeight: 300,
            color: tc,
            letterSpacing: -0.5,
          }}>
            {firstName}{" "}
          </span>
          <span style={{
            fontSize: format.nameFontSize + 6,
            fontWeight: 900,
            color: tc,
            letterSpacing: -0.5,
          }}>
            {restOfName}
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
          <div style={{ width: 40, height: 3, background: accent, borderRadius: 2 }} />
          <span style={{
            fontSize: s + 1.5,
            fontWeight: 600,
            color: accent,
            letterSpacing: 0.5,
          }}>
            {cv.jobTitle}
          </span>
        </div>

        <div style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "4px 18px",
          fontSize: s - 1,
          color: tc,
          opacity: 0.65,
          paddingBottom: 14,
          borderBottom: `1px solid #e5e7eb`,
          marginBottom: 20,
        }}>
          {cv.email && (
            <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
              <i className="fas fa-envelope" style={{ color: accent, fontSize: s - 2 }}></i> {cv.email}
            </span>
          )}
          {cv.phone && (
            <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
              <i className="fas fa-phone" style={{ color: accent, fontSize: s - 2 }}></i> {cv.phone}
            </span>
          )}
          {cv.address && (
            <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
              <i className="fas fa-map-marker-alt" style={{ color: accent, fontSize: s - 2 }}></i> {cv.address}
            </span>
          )}
          {cv.linkedin && (
            <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
              <i className="fab fa-linkedin" style={{ color: accent, fontSize: s - 2 }}></i> {cv.linkedin}
            </span>
          )}
          {cv.website && (
            <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
              <i className="fas fa-globe" style={{ color: accent, fontSize: s - 2 }}></i> {cv.website}
            </span>
          )}
          {cv.github && (
            <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
              <i className="fab fa-github" style={{ color: accent, fontSize: s - 2 }}></i> {cv.github}
            </span>
          )}
        </div>
      </div>

      {sectionOrder.map(renderSection)}
    </div>
  );
}

// ══════════════════════════════════════════════
// ── TEMPLATE 14: SIGNATURE EDGE (accurate rebuild) ──
// ══════════════════════════════════════════════
function EdgeLabel({ title, accent, format }) {
  return (
    <div style={{ marginBottom: 7 }}>
      <span style={{
        fontSize: format.headingFontSize - 0.5,
        fontWeight: 900,
        textTransform: "uppercase",
        letterSpacing: 1.8,
        color: "#111",
      }}>
        {title}
      </span>
      <span style={{
        fontSize: format.headingFontSize - 0.5,
        fontWeight: 900,
        color: accent,
      }}>_</span>
    </div>
  );
}

function ContactBadge({ icon, text, accent, fab = false, s }) {
  if (!text) return null;
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 7, marginBottom: 5 }}>
      <div style={{
        width: 18,
        height: 18,
        borderRadius: "50%",
        background: accent,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        marginTop: 1,
      }}>
        <i className={`${fab ? "fab" : "fas"} fa-${icon}`} style={{ color: "#fff", fontSize: "0.45rem" }}></i>
      </div>
      <span style={{ fontSize: s - 1.5, color: "#444", lineHeight: 1.3, wordBreak: "break-all" }}>{text}</span>
    </div>
  );
}

function EdgeStars({ value = 4, max = 5, accent }) {
  return (
    <div style={{ display: "flex", gap: 2, marginTop: 1 }}>
      {Array.from({ length: max }).map((_, i) => (
        <span key={i} style={{ fontSize: "0.5rem", color: i < value ? accent : "#e0e0e0" }}>★</span>
      ))}
    </div>
  );
}

export function SignatureEdge({ cv, accent, format, sectionOrder, theme }) {
  const s = Math.min(format.bodyFontSize, 10.5);
  const lh = Math.min(format.lineHeight, 1.35);
  const tc = "#1a1a1a";

  const nameParts = (cv.name || "Your Name").trim().split(" ");
  const firstName = nameParts[0];
  const lastName = nameParts.slice(1).join(" ");

  // Deterministic skill levels
  const getLevel = (i) => [5, 4, 5, 3, 4, 5, 4, 3][i % 8];

  // Strict section control — keeps template on one page
  // Everything not in the sidebar goes in the main column (incl. Personal Details).
  const SIDE_KEYS = SIDEBAR_SECTIONS[13];

  const mainSections = sectionOrder.filter(k => !SIDE_KEYS.includes(k));
  const sideSections = sectionOrder.filter(k => SIDE_KEYS.includes(k));

  const renderMain = (key) => {
    switch (key) {
      case "biodata":
        return bioRows(cv).length ? (
          <div key={key} style={{ marginBottom: 13 }} className="cv-section-keep">
            <EdgeLabel title="Personal Details" accent={accent} format={format} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3px 14px" }}>
              {bioRows(cv).map(([label, val]) => (
                <div key={label} style={{ fontSize: s - 0.5, color: tc }}>
                  <b>{label}: </b><span style={{ color: "#555" }}>{val}</span>
                </div>
              ))}
            </div>
          </div>
        ) : null;
      case "summary":
        return cv.summary ? (
          <div key={key} style={{ marginBottom: 13 }} className="cv-section-keep">
            <EdgeLabel title="Profile" accent={accent} format={format} />
            <p style={{ fontSize: s, lineHeight: lh, margin: 0, color: tc, textAlign: "justify" }}>{cv.summary}</p>
          </div>
        ) : null;
      case "objective":
        return cv.objective ? (
          <div key={key} style={{ marginBottom: 13 }} className="cv-section-keep">
            <EdgeLabel title="Objective" accent={accent} format={format} />
            <p style={{ fontSize: s, lineHeight: lh, margin: 0, color: tc, textAlign: "justify" }}>{cv.objective}</p>
          </div>
        ) : null;
      case "experience":
        return cv.experience[0]?.company ? (
          <div key={key} style={{ marginBottom: 13 }}>
            <EdgeLabel title="Job Experience" accent={accent} format={format} />
            {cv.experience.map((e, i) => (
              <div key={i} className="cv-item" style={{ marginBottom: 11 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap" }}>
                  <b style={{ fontSize: s + 0.5, color: tc }}>{e.role}</b>
                  <span style={{ fontSize: s - 2, color: "#888", fontStyle: "italic" }}>
                    {e.start} – {e.current ? "Present" : e.end}
                  </span>
                </div>
                <div style={{ fontSize: s - 0.5, color: accent, fontWeight: 700, marginBottom: 3 }}>{e.company}</div>
                <div style={{ paddingLeft: 8, borderLeft: `2px solid ${accent}40` }}>
                  <BulletList text={e.responsibilities} fontSize={s - 0.5} lineHeight={lh} color={tc} />
                </div>
              </div>
            ))}
          </div>
        ) : null;
      case "achievements":
        return cv.achievements?.[0]?.title ? (
          <div key={key} style={{ marginBottom: 13 }}>
            <EdgeLabel title="Achievements" accent={accent} format={format} />
            {cv.achievements.map((a, i) => (
              <div key={i} style={{ marginBottom: 6 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <b style={{ fontSize: s, color: tc }}>{a.title}</b>
                  <span style={{ fontSize: s - 2, color: accent, fontWeight: 700 }}>{a.date}</span>
                </div>
                {a.description && <p style={{ fontSize: s - 0.5, margin: "2px 0 0", opacity: 0.7, textAlign: "justify" }}>{a.description}</p>}
              </div>
            ))}
          </div>
        ) : null;
      case "volunteer":
        return cv.volunteer?.[0]?.organization ? (
          <div key={key} style={{ marginBottom: 13 }}>
            <EdgeLabel title="Volunteer" accent={accent} format={format} />
            {cv.volunteer.map((v, i) => (
              <div key={i} style={{ marginBottom: 5 }}>
                <b style={{ color: tc }}>{v.role}</b>
                <span style={{ color: accent }}> · {v.organization}</span>
              </div>
            ))}
          </div>
        ) : null;
      case "publications":
        return cv.publications?.[0]?.title ? (
          <div key={key} style={{ marginBottom: 13 }}>
            <EdgeLabel title="Publications" accent={accent} format={format} />
            {cv.publications.map((p, i) => (
              <div key={i} style={{ marginBottom: 4, color: tc }}>{p.title}</div>
            ))}
          </div>
        ) : null;
      default: return null;
    }
  };

  const renderSide = (key) => {
    switch (key) {
      case "education":
        return cv.education[0]?.school ? (
          <div key={key} style={{ marginBottom: 12 }}>
            <EdgeLabel title="Education" accent={accent} format={format} />
            {cv.education.map((e, i) => (
              <div key={i} style={{ marginBottom: 7 }}>
                <b style={{ fontSize: s - 0.5, color: tc, display: "block", lineHeight: 1.2 }}>
                  {e.degree} {e.field && `in ${e.field}`}
                </b>
                <div style={{ fontSize: s - 1, color: "#777" }}>{e.school}</div>
                <div style={{ fontSize: s - 1.5, color: accent, fontWeight: 700 }}>{e.start}–{e.end}</div>
              </div>
            ))}
          </div>
        ) : null;
      case "skills":
        return cv.skills ? (
          <div key={key} style={{ marginBottom: 12 }} className="cv-section-keep">
            <EdgeLabel title="Skills" accent={accent} format={format} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5px 6px" }}>
              {cv.skills.split(/[,\n]+/).map(x => x.trim()).filter(Boolean).map((sk, i) => (
                <div key={i}>
                  <div style={{ fontSize: s - 1.5, color: tc, lineHeight: 1.2 }}>{sk}</div>
                  <EdgeStars value={getLevel(i)} accent={accent} />
                </div>
              ))}
            </div>
          </div>
        ) : null;
      case "languages":
        return cv.languages ? (
          <div key={key} style={{ marginBottom: 12 }} className="cv-section-keep">
            <EdgeLabel title="Languages" accent={accent} format={format} />
            <p style={{ fontSize: s - 1, margin: 0, color: tc, lineHeight: lh }}>{cv.languages}</p>
          </div>
        ) : null;
      case "certifications": {
        if (!hasCertifications(cv)) return null;
        const certs = normalizeCertifications(cv.certifications);
        return (
          <div key={key} style={{ marginBottom: 12 }} className="cv-section-keep">
            <EdgeLabel title="Certifications" accent={accent} format={format} />
            {certs.map((c, i) => (
              <div key={i} style={{ marginBottom: 5 }}>
                <b style={{ fontSize: s - 1, color: tc }}>{c.name}</b>
                {c.issuer && <div style={{ fontSize: s - 1.5, color: accent }}>{c.issuer}</div>}
              </div>
            ))}
          </div>
        );
      }
      case "references":
        return cv.references?.[0]?.name ? (
          <div key={key} style={{ marginBottom: 12 }} className="cv-section-keep">
            <EdgeLabel title="Reference" accent={accent} format={format} />
            {cv.references.map((r, i) => (
              <div key={i} style={{ marginBottom: 7 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <div style={{ width: 5, height: 5, background: accent, borderRadius: "50%", flexShrink: 0 }} />
                  <b style={{ fontSize: s - 0.5, color: tc }}>{r.name}</b>
                </div>
                <div style={{ fontSize: s - 1.5, color: "#777", paddingLeft: 10 }}>{r.title}</div>
                {r.company && <div style={{ fontSize: s - 1.5, color: accent, paddingLeft: 10 }}>{r.company}</div>}
                {r.email && <div style={{ fontSize: s - 1.5, color: "#777", paddingLeft: 10 }}>{r.email}</div>}
                {r.phone && <div style={{ fontSize: s - 1.5, color: "#777", paddingLeft: 10 }}>{r.phone}</div>}
              </div>
            ))}
          </div>
        ) : null;
      case "hobbies":
        return cv.hobbies ? (
          <div key={key} style={{ marginBottom: 12 }} className="cv-section-keep">
            <EdgeLabel title="Interests" accent={accent} format={format} />
            <div style={{ display: "flex", flexWrap: "wrap", gap: "3px 10px" }}>
              {cv.hobbies.split(/[,\n]+/).map(h => h.trim()).filter(Boolean).map((h, i) => (
                <span key={i} style={{
                  display: "inline-flex", alignItems: "center", gap: 4,
                  fontSize: s - 1, color: tc,
                }}>
                  <span style={{
                    width: 5, height: 5, background: accent,
                    borderRadius: "50%", flexShrink: 0, display: "inline-block",
                  }} />
                  {h}
                </span>
              ))}
            </div>
          </div>
        ) : null;
      default: return null;
    }
  };

  const SIDEBAR_WIDTH = 190;
  const STRIP_WIDTH = 8;
  const PHOTO_SIZE = SIDEBAR_WIDTH - 16; // nearly full sidebar width

  return (
    <div style={{
      fontFamily: format.fontFamily,
      fontSize: s,
      color: tc,
      lineHeight: lh,
      background: "#fff",
      minHeight: "100%",
      boxSizing: "border-box",
      display: "flex",
    }}>
      {/* FAR LEFT ACCENT STRIP */}
      <div style={{
        width: STRIP_WIDTH,
        background: accent,
        flexShrink: 0,
        minHeight: "100%",
      }} />

      {/* SIDEBAR */}
      <div style={{
        width: SIDEBAR_WIDTH,
        background: "#fff",
        borderRight: "1px solid #eeeeee",
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
      }}>
        {/* PHOTO — rectangular, power-clipped, full sidebar width */}
        <div style={{
          width: "100%",
          height: PHOTO_SIZE,
          overflow: "hidden",
          flexShrink: 0,
          background: `${accent}22`,
          position: "relative",
        }}>
          {cv.photo ? (
            <img
              src={cv.photo}
              alt="profile"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center top",
                display: "block",
              }}
            />
          ) : (
            <div style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: `${accent}15`,
            }}>
              <i className="fas fa-user" style={{ fontSize: "3rem", color: accent, opacity: 0.3 }}></i>
            </div>
          )}
          {/* Accent overlay bar at bottom of photo */}
          <div style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 4,
            background: accent,
          }} />
        </div>

        {/* Sidebar content */}
        <div style={{ padding: "14px 12px 14px 10px", flex: 1 }}>
          {/* Contact */}
          <div style={{ marginBottom: 12 }}>
            <EdgeLabel title="Contact" accent={accent} format={format} />
            <ContactBadge icon="map-marker-alt" text={cv.address} accent={accent} s={s} />
            <ContactBadge icon="phone" text={cv.phone} accent={accent} s={s} />
            <ContactBadge icon="envelope" text={cv.email} accent={accent} s={s} />
            <ContactBadge icon="globe" text={cv.website} accent={accent} s={s} />
            <ContactBadge icon="linkedin" text={cv.linkedin} accent={accent} fab s={s} />
            <ContactBadge icon="github" text={cv.github} accent={accent} fab s={s} />
          </div>

          {sideSections.map(renderSide)}
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div style={{ flex: 1, padding: "20px 20px 20px 16px" }}>
        {/* TWO-TONE NAME */}
        <div style={{
          marginBottom: 12,
          paddingBottom: 10,
          borderBottom: `1.5px solid #eee`,
        }}>
          <div style={{ textTransform: "uppercase", lineHeight: 1.0, marginBottom: 4 }}>
            <span style={{
              display: "block",
              fontSize: format.nameFontSize + 6,
              fontWeight: 300,
              color: tc,
              letterSpacing: 4,
            }}>
              {firstName}
            </span>
            <span style={{
              display: "block",
              fontSize: format.nameFontSize + 6,
              fontWeight: 900,
              color: tc,
              letterSpacing: 4,
            }}>
              {lastName || firstName}
            </span>
          </div>
          <div style={{
            fontSize: s + 0.5,
            color: "#888",
            fontWeight: 400,
            textTransform: "uppercase",
            letterSpacing: 1.5,
          }}>
            {cv.jobTitle}
          </div>
        </div>

        {mainSections.map(renderMain)}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════
// ── TEMPLATE 15: DARK GEO ──
// ══════════════════════════════════════════════
function GeoLabel({ title, accent, format, dark = false }) {
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      gap: 8,
      marginBottom: 10,
    }}>
      {/* Diamond marker */}
      <div style={{
        width: 12,
        height: 12,
        background: accent,
        transform: "rotate(45deg)",
        flexShrink: 0,
      }} />
      <span style={{
        fontSize: format.headingFontSize,
        fontWeight: format.headingBold ? 800 : 400,
        textTransform: format.headingUppercase ? "uppercase" : "none",
        letterSpacing: 1.5,
        color: dark ? "rgba(255,255,255,0.9)" : "#111",
      }}>
        {title}
      </span>
    </div>
  );
}

function GeoSkillBar({ skill, accent }) {
  const level = Math.floor(Math.random() * 3) + 3;
  const pct = (level / 5) * 100;
  return (
    <div style={{ marginBottom: 6 }}>
      <div style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.8)", marginBottom: 3 }}>{skill}</div>
      <div style={{ height: 4, background: "rgba(255,255,255,0.12)", borderRadius: 2, overflow: "hidden" }}>
        <div style={{ width: `${pct}%`, height: "100%", background: accent, borderRadius: 2 }} />
      </div>
    </div>
  );
}

export function DarkGeo({ cv, accent, format, sectionOrder, theme }) {
  const s = format.bodyFontSize;
  const lh = format.lineHeight;
  const tc = theme.text;
  const p = format.pagePadding;

  const sideKeys = SIDEBAR_SECTIONS[14];
  const mainSections = sectionOrder.filter(k => !sideKeys.includes(k));
  const sideSections = sectionOrder.filter(k => sideKeys.includes(k));

  const renderMain = (key) => {
    switch (key) {
      case "biodata": {
        const has = cv.dateOfBirth || cv.gender || cv.maritalStatus || cv.nationality || cv.stateOfOrigin || cv.lga || cv.placeOfBirth || cv.religion || cv.nin;
        if (!has) return null;
        return (
          <div key={key} style={{ marginBottom: 18 }} className="cv-section-keep">
            <GeoLabel title="Personal Details" accent={accent} format={format} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3px 16px", fontSize: s - 0.5 }}>
              {[["Date of Birth", formatDate(cv.dateOfBirth)], ["Gender", cv.gender], ["Marital Status", cv.maritalStatus], ["Nationality", cv.nationality], ["State of Origin", cv.stateOfOrigin], ["LGA", cv.lga], ["Religion", cv.religion], ["NIN", cv.nin]]
                .filter(([, v]) => v).map(([l, v]) => (
                  <div key={l} style={{ color: tc }}><b style={{ opacity: 0.55 }}>{l}: </b>{v}</div>
                ))}
            </div>
          </div>
        );
      }
      case "summary":
        return cv.summary ? (
          <div key={key} style={{ marginBottom: 18 }} className="cv-section-keep">
            <GeoLabel title="About Me" accent={accent} format={format} />
            <p style={{ fontSize: s, lineHeight: lh, margin: 0, color: tc, textAlign: "justify" }}>{cv.summary}</p>
          </div>
        ) : null;
      case "objective":
        return cv.objective ? (
          <div key={key} style={{ marginBottom: 18 }} className="cv-section-keep">
            <GeoLabel title="Objective" accent={accent} format={format} />
            <p style={{ fontSize: s, lineHeight: lh, margin: 0, color: tc, textAlign: "justify" }}>{cv.objective}</p>
          </div>
        ) : null;
      case "experience":
        return cv.experience[0]?.company ? (
          <div key={key} style={{ marginBottom: 18 }}>
            <GeoLabel title="Job Experience" accent={accent} format={format} />
            {cv.experience.map((e, i) => (
              <div key={i} className="cv-item" style={{ marginBottom: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: 4 }}>
                  <b style={{ fontSize: s + 1, color: tc }}>{e.role}</b>
                  <span style={{ fontSize: s - 1.5, color: "#fff", background: accent, padding: "2px 8px", borderRadius: 2, fontWeight: 700, whiteSpace: "nowrap" }}>
                    {e.start} – {e.current ? "Present" : e.end}
                  </span>
                </div>
                <div style={{ fontSize: s - 0.5, color: accent, fontWeight: 700, marginBottom: 4 }}>{e.company}</div>
                <BulletList text={e.responsibilities} fontSize={s - 0.5} lineHeight={lh} color={tc} />
              </div>
            ))}
          </div>
        ) : null;
      case "achievements":
        return cv.achievements?.[0]?.title ? (
          <div key={key} style={{ marginBottom: 18 }}>
            <GeoLabel title="Achievements" accent={accent} format={format} />
            {cv.achievements.map((a, i) => (
              <div key={i} style={{ marginBottom: 8 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <b style={{ color: tc }}>{a.title}</b>
                  <span style={{ fontSize: s - 1.5, color: accent, fontWeight: 700 }}>{a.date}</span>
                </div>
                {a.description && <p style={{ fontSize: s - 0.5, margin: "2px 0 0", opacity: 0.7, textAlign: "justify" }}>{a.description}</p>}
              </div>
            ))}
          </div>
        ) : null;
      case "volunteer":
        return cv.volunteer?.[0]?.organization ? (
          <div key={key} style={{ marginBottom: 18 }}>
            <GeoLabel title="Volunteer" accent={accent} format={format} />
            {cv.volunteer.map((v, i) => (
              <div key={i} style={{ marginBottom: 6 }}>
                <b style={{ color: tc }}>{v.role}</b>
                <span style={{ color: accent }}> · {v.organization}</span>
              </div>
            ))}
          </div>
        ) : null;
      case "publications":
        return cv.publications?.[0]?.title ? (
          <div key={key} style={{ marginBottom: 18 }}>
            <GeoLabel title="Publications" accent={accent} format={format} />
            {cv.publications.map((p, i) => (
              <div key={i} style={{ marginBottom: 6, color: tc }}>{p.title}</div>
            ))}
          </div>
        ) : null;
      default: return null;
    }
  };

  const renderSide = (key) => {
    switch (key) {
      case "education":
        return cv.education[0]?.school ? (
          <div key={key} style={{ marginBottom: 18 }}>
            <GeoLabel title="Education" accent={accent} format={format} dark />
            {cv.education.map((e, i) => (
              <div key={i} style={{ marginBottom: 8 }}>
                <b style={{ fontSize: s - 0.5, color: "#fff", display: "block" }}>{e.degree} {e.field && `in ${e.field}`}</b>
                <div style={{ fontSize: s - 1, color: "rgba(255,255,255,0.65)" }}>{e.school}</div>
                <div style={{ fontSize: s - 1.5, color: accent, fontWeight: 700 }}>{e.start}–{e.end}</div>
              </div>
            ))}
          </div>
        ) : null;
      case "skills":
        return cv.skills ? (
          <div key={key} style={{ marginBottom: 18 }} className="cv-section-keep">
            <GeoLabel title="Skills" accent={accent} format={format} dark />
            {cv.skills.split(/[,\n]+/).map(x => x.trim()).filter(Boolean).map((sk, i) => (
              <GeoSkillBar key={i} skill={sk} accent={accent} />
            ))}
          </div>
        ) : null;
      case "languages":
        return cv.languages ? (
          <div key={key} style={{ marginBottom: 18 }} className="cv-section-keep">
            <GeoLabel title="Languages" accent={accent} format={format} dark />
            <p style={{ fontSize: s - 0.5, margin: 0, color: "rgba(255,255,255,0.8)" }}>{cv.languages}</p>
          </div>
        ) : null;
      case "certifications": {
        if (!hasCertifications(cv)) return null;
        const certs = normalizeCertifications(cv.certifications);
        return (
          <div key={key} style={{ marginBottom: 18 }} className="cv-section-keep">
            <GeoLabel title="Certifications" accent={accent} format={format} dark />
            {certs.map((c, i) => (
              <div key={i} style={{ marginBottom: 6 }}>
                <b style={{ fontSize: s - 0.5, color: "#fff" }}>{c.name}</b>
                {c.issuer && <div style={{ fontSize: s - 1.5, color: accent }}>{c.issuer}</div>}
              </div>
            ))}
          </div>
        );
      }
      case "references":
        return cv.references?.[0]?.name ? (
          <div key={key} style={{ marginBottom: 18 }} className="cv-section-keep">
            <GeoLabel title="References" accent={accent} format={format} dark />
            {cv.references.map((r, i) => (
              <div key={i} style={{ marginBottom: 8 }}>
                <b style={{ fontSize: s - 0.5, color: "#fff", display: "block" }}>{r.name}</b>
                <div style={{ fontSize: s - 1, color: "rgba(255,255,255,0.65)" }}>{r.title}</div>
                {r.company && <div style={{ fontSize: s - 1, color: accent }}>{r.company}</div>}
              </div>
            ))}
          </div>
        ) : null;
      case "hobbies":
        return cv.hobbies ? (
          <div key={key} style={{ marginBottom: 18 }} className="cv-section-keep">
            <GeoLabel title="Interests" accent={accent} format={format} dark />
            <p style={{ fontSize: s - 0.5, margin: 0, color: "rgba(255,255,255,0.8)" }}>{cv.hobbies}</p>
          </div>
        ) : null;
      default: return null;
    }
  };

  return (
    <div style={{
      fontFamily: format.fontFamily,
      fontSize: s,
      color: tc,
      lineHeight: lh,
      background: theme.bg,
      minHeight: "100%",
      boxSizing: "border-box",
      display: "flex",
    }}>
      {/* DARK SIDEBAR */}
      <div style={{
        width: 220,
        background: "#1e2124",
        padding: `${p}px ${p - 4}px`,
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        position: "relative",
      }}>
        {/* Geometric accent shape top-right of sidebar */}
        <div style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: 0,
          height: 0,
          borderStyle: "solid",
          borderWidth: `0 60px 60px 0`,
          borderColor: `transparent ${accent} transparent transparent`,
        }} />

        {/* Photo */}
        {cv.photo ? (
          <div style={{
            width: 90,
            height: 90,
            borderRadius: "50%",
            overflow: "hidden",
            border: `3px solid ${accent}`,
            marginBottom: 14,
            flexShrink: 0,
          }}>
            <img src={cv.photo} alt="profile" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
        ) : (
          <div style={{
            width: 90,
            height: 90,
            borderRadius: "50%",
            background: `${accent}22`,
            border: `3px solid ${accent}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 14,
            flexShrink: 0,
          }}>
            <i className="fas fa-user" style={{ fontSize: "2rem", color: accent, opacity: 0.5 }}></i>
          </div>
        )}

        {/* Contact */}
        <div style={{ marginBottom: 18 }}>
          <GeoLabel title="Contact Me" accent={accent} format={format} dark />
          <div style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: s - 1 }}>
            {cv.phone && <span style={{ display: "flex", alignItems: "center", gap: 6, color: "rgba(255,255,255,0.75)" }}><i className="fas fa-phone" style={{ color: accent, fontSize: s - 2, width: 12 }}></i>{cv.phone}</span>}
            {cv.email && <span style={{ display: "flex", alignItems: "flex-start", gap: 6, color: "rgba(255,255,255,0.75)", wordBreak: "break-all" }}><i className="fas fa-envelope" style={{ color: accent, fontSize: s - 2, marginTop: 1, flexShrink: 0, width: 12 }}></i>{cv.email}</span>}
            {cv.address && <span style={{ display: "flex", alignItems: "flex-start", gap: 6, color: "rgba(255,255,255,0.75)" }}><i className="fas fa-map-marker-alt" style={{ color: accent, fontSize: s - 2, marginTop: 1, flexShrink: 0, width: 12 }}></i>{cv.address}</span>}
            {cv.linkedin && <span style={{ display: "flex", alignItems: "center", gap: 6, color: "rgba(255,255,255,0.75)", wordBreak: "break-all" }}><i className="fab fa-linkedin" style={{ color: accent, fontSize: s - 2, width: 12 }}></i>{cv.linkedin}</span>}
            {cv.website && <span style={{ display: "flex", alignItems: "center", gap: 6, color: "rgba(255,255,255,0.75)", wordBreak: "break-all" }}><i className="fas fa-globe" style={{ color: accent, fontSize: s - 2, width: 12 }}></i>{cv.website}</span>}
            {cv.github && <span style={{ display: "flex", alignItems: "center", gap: 6, color: "rgba(255,255,255,0.75)", wordBreak: "break-all" }}><i className="fab fa-github" style={{ color: accent, fontSize: s - 2, width: 12 }}></i>{cv.github}</span>}
          </div>
        </div>

        {sideSections.map(renderSide)}
      </div>

      {/* MAIN CONTENT */}
      <div style={{ flex: 1, padding: `${p}px ${p}px` }}>
        {/* NAME HEADER */}
        <div style={{ marginBottom: 20, paddingBottom: 14, borderBottom: `3px solid ${accent}` }}>
          <div style={{ lineHeight: 1.1, marginBottom: 6 }}>
            <span style={{ fontSize: format.nameFontSize + 4, fontWeight: 900, color: "#1e2124", display: "block" }}>
              {cv.name || "Your Name"}
            </span>
          </div>
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            fontSize: s + 1,
            color: "#555",
            fontWeight: 500,
          }}>
            <div style={{ width: 12, height: 3, background: accent, borderRadius: 2 }} />
            {cv.jobTitle}
          </div>
        </div>

        {mainSections.map(renderMain)}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════
// ── TEMPLATE 16: SUMMIT ──
// ══════════════════════════════════════════════
// Rounded tinted sidebar card, two-tone name and a drawn backdrop: a gradient
// corner behind the sidebar, faint rising chevrons top right and a sun,
// layered mountains and a flag at the foot of the page. The decorations are
// absolutely positioned SVG, so they print exactly as previewed.

function isDarkColor(hex) {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex || "");
  if (!m) return false;
  const n = parseInt(m[1], 16);
  const lum = (0.299 * (n >> 16) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255)) / 255;
  return lum < 0.45;
}

function SummitLabel({ title, icon, accent, format, ink, rule = true }) {
  return (
    <div className="cv-section-heading" style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 9 }}>
      <span style={{
        width: 24, height: 24, borderRadius: 7, flexShrink: 0,
        background: `${accent}1f`, color: accent,
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        fontSize: 11,
      }}>
        <i className={`fas fa-${icon}`}></i>
      </span>
      <span style={{
        fontSize: format.headingFontSize,
        fontWeight: format.headingBold ? 800 : 500,
        textTransform: format.headingUppercase ? "uppercase" : "none",
        letterSpacing: format.headingUppercase ? 1.6 : 0.2,
        color: ink,
        whiteSpace: "nowrap",
      }}>
        {title}
      </span>
      {rule && <span style={{ flex: 1, height: 1, background: `${accent}40`, minWidth: 12 }} />}
    </div>
  );
}

function SummitSideLabel({ title, icon, accent, ink }) {
  return (
    <div className="cv-section-heading" style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 7 }}>
      <i className={`fas fa-${icon}`} style={{ color: accent, fontSize: 10, width: 12, textAlign: "center" }}></i>
      <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: 2.4, textTransform: "uppercase", color: ink }}>
        {title}
      </span>
    </div>
  );
}

function SummitBackdrop({ accent, ink }) {
  return (
    <>
      {/* Gradient corner behind the sidebar card */}
      <svg width="300" height="300" viewBox="0 0 300 300" aria-hidden="true"
        style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none" }}>
        <defs>
          <linearGradient id="summitCorner" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor={accent} stopOpacity="0.95" />
            <stop offset="0.55" stopColor={accent} stopOpacity="0.35" />
            <stop offset="1" stopColor={accent} stopOpacity="0" />
          </linearGradient>
        </defs>
        <polygon points="0,0 300,0 0,300" fill="url(#summitCorner)" />
        <polygon points="0,0 170,0 0,170" fill={ink} fillOpacity="0.18" />
      </svg>

      {/* Rising chevrons, top right: the climb to the summit. Solid and
          faint, fading toward the bottom. */}
      <svg width="90" height="112" viewBox="-3 -3 118 146" aria-hidden="true"
        style={{ position: "absolute", top: 16, right: 30, pointerEvents: "none" }}>
        {[0.085, 0.06, 0.038].map((o, i) => (
          // Group opacity keeps fill and rounded stroke one flat tint.
          <g key={i} opacity={o} transform={`translate(0 ${i * 30})`}>
            <polygon points="0,56 56,0 112,56 112,80 56,24 0,80"
              fill={accent} stroke={accent} strokeWidth="5" strokeLinejoin="round" />
          </g>
        ))}
      </svg>

      {/* Sun, mountains and flag at the foot of the page */}
      <svg width="360" height="146" viewBox="0 0 420 170" preserveAspectRatio="xMaxYMax meet" aria-hidden="true"
        style={{ position: "absolute", right: 0, bottom: 0, pointerEvents: "none" }}>
        <circle cx="258" cy="50" r="28" fill={accent} fillOpacity="0.14" />
        <circle cx="258" cy="50" r="18" fill={accent} fillOpacity="0.22" />
        <polygon points="40,170 170,72 250,130 330,58 420,120 420,170" fill={accent} fillOpacity="0.10" />
        <polygon points="130,170 250,92 300,128 360,84 420,126 420,170" fill={accent} fillOpacity="0.20" />
        <polygon points="230,170 330,62 420,150 420,170" fill={accent} fillOpacity="0.42" />
        <polygon points="330,62 311,83 322,80 330,88 339,79 350,84" fill="#ffffff" fillOpacity="0.75" />
        <line x1="330" y1="62" x2="330" y2="26" stroke={ink} strokeWidth="2" strokeLinecap="round" />
        <polygon points="331,27 352,33 331,40" fill={accent} />
      </svg>
    </>
  );
}

export function Summit({ cv, accent, format, sectionOrder, theme }) {
  const s = format.bodyFontSize;
  const lh = format.lineHeight;
  const dark = isDarkColor(theme.bg);
  const ink = dark ? "#f3f6fb" : "#14213d";
  const tc = dark ? theme.text : "#3b4557";
  const muted = dark ? "rgba(255,255,255,0.6)" : "#7a8496";
  // Georgia is the builder default; this design is drawn for a geometric sans.
  const font = format.fontFamily === "Georgia, serif"
    ? "'Inter', 'Manrope', 'Helvetica Neue', Arial, sans-serif"
    : format.fontFamily;

  const nameParts = (cv.name || "Your Name").trim().split(/\s+/);
  const firstName = nameParts.length > 1 ? nameParts.slice(0, -1).join(" ") : nameParts[0];
  const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : "";

  const sideKeys = SIDEBAR_SECTIONS[15];
  const mainSections = sectionOrder.filter(k => !sideKeys.includes(k));
  const sideSections = sectionOrder.filter(k => sideKeys.includes(k));

  const label = (title, icon) => <SummitLabel title={title} icon={icon} accent={accent} format={format} ink={ink} />;
  const dates = (a, b) => [a, b].filter(Boolean).join(" – ");
  const block = { marginBottom: 16 };

  const renderMain = (key) => {
    switch (key) {
      case "summary":
        return cv.summary ? (
          <div key={key} className="cv-section-keep" style={{
            ...block,
            display: "flex", gap: 12, alignItems: "flex-start",
            background: `${accent}12`, borderRadius: 14, padding: "12px 14px",
          }}>
            <span style={{
              width: 30, height: 30, borderRadius: "50%", flexShrink: 0,
              background: accent, color: "#fff",
              display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 12,
            }}>
              <i className="fas fa-user"></i>
            </span>
            <div style={{ flex: 1 }}>
              <div style={{
                fontSize: format.headingFontSize - 1, fontWeight: format.headingBold ? 800 : 500,
                textTransform: format.headingUppercase ? "uppercase" : "none",
                letterSpacing: format.headingUppercase ? 1.6 : 0.2, color: ink, marginBottom: 3,
              }}>
                Profile
              </div>
              <p style={{ fontSize: s, lineHeight: lh, margin: 0, color: tc, textAlign: "justify" }}>{cv.summary}</p>
            </div>
          </div>
        ) : null;
      case "biodata": {
        const rows = bioRows(cv);
        return rows.length ? (
          <div key={key} style={block} className="cv-section-keep">
            {label("Personal Details", "id-card")}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3px 16px", paddingLeft: 33 }}>
              {rows.map(([l, v]) => (
                <div key={l} style={{ fontSize: s - 0.5, color: tc }}>
                  <span style={{ color: ink, fontWeight: 600 }}>{l}: </span>{v}
                </div>
              ))}
            </div>
          </div>
        ) : null;
      }
      case "experience":
        return cv.experience[0]?.company ? (
          <div key={key} style={block}>
            {label("Work Experience", "briefcase")}
            {cv.experience.map((e, i) => (
              <div key={i} className="cv-item" style={{ marginBottom: 11, paddingLeft: 33, position: "relative" }}>
                <span style={{
                  position: "absolute", left: 9, top: 5, width: 7, height: 7, borderRadius: "50%",
                  background: theme.bg, border: `2px solid ${accent}`,
                }} />
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 8, flexWrap: "wrap" }}>
                  <b style={{ fontSize: s + 1, color: ink }}>{e.role}</b>
                  <span style={{ fontSize: s - 1.5, color: muted, fontWeight: 600, whiteSpace: "nowrap" }}>
                    {dates(e.start, e.current ? "Present" : e.end)}
                  </span>
                </div>
                <div style={{ fontSize: s - 0.5, color: accent, fontWeight: 700 }}>
                  {e.company}{e.location ? <span style={{ color: muted, fontWeight: 500 }}> · {e.location}</span> : null}
                </div>
                <BulletList text={e.responsibilities} fontSize={s - 0.5} lineHeight={lh} color={tc} />
              </div>
            ))}
          </div>
        ) : null;
      case "education":
        return cv.education[0]?.school ? (
          <div key={key} style={block}>
            {label("Education", "graduation-cap")}
            {cv.education.map((e, i) => (
              <div key={i} className="cv-item" style={{ marginBottom: 8, paddingLeft: 33 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 8, flexWrap: "wrap" }}>
                  <b style={{ fontSize: s + 0.5, color: ink }}>{e.degree}{e.field ? ` in ${e.field}` : ""}</b>
                  <span style={{ fontSize: s - 1.5, color: muted, fontWeight: 600, whiteSpace: "nowrap" }}>{dates(e.start, e.end)}</span>
                </div>
                <div style={{ fontSize: s - 0.5, color: accent, fontWeight: 600 }}>{e.school}</div>
                {e.grade && <div style={{ fontSize: s - 1, color: tc }}>{e.grade}</div>}
              </div>
            ))}
          </div>
        ) : null;
      case "achievements":
        return cv.achievements?.[0]?.title ? (
          <div key={key} style={block}>
            {label("Achievements", "trophy")}
            {cv.achievements.map((a, i) => (
              <div key={i} className="cv-item" style={{ marginBottom: 7, paddingLeft: 33 }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                  <b style={{ fontSize: s, color: ink }}>{a.title}</b>
                  <span style={{ fontSize: s - 1.5, color: muted, fontWeight: 600, whiteSpace: "nowrap" }}>{a.date}</span>
                </div>
                {a.description && <p style={{ fontSize: s - 0.5, lineHeight: lh, margin: "2px 0 0", color: tc, textAlign: "justify" }}>{a.description}</p>}
              </div>
            ))}
          </div>
        ) : null;
      case "volunteer":
        return cv.volunteer?.[0]?.organization ? (
          <div key={key} style={block}>
            {label("Volunteer", "hands-helping")}
            {cv.volunteer.map((v, i) => (
              <div key={i} className="cv-item" style={{ marginBottom: 7, paddingLeft: 33 }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 8, flexWrap: "wrap" }}>
                  <span><b style={{ color: ink }}>{v.role}</b><span style={{ color: accent, fontWeight: 600 }}> · {v.organization}</span></span>
                  <span style={{ fontSize: s - 1.5, color: muted, fontWeight: 600, whiteSpace: "nowrap" }}>{dates(v.start, v.end)}</span>
                </div>
                {v.description && <p style={{ fontSize: s - 0.5, lineHeight: lh, margin: "2px 0 0", color: tc, textAlign: "justify" }}>{v.description}</p>}
              </div>
            ))}
          </div>
        ) : null;
      case "publications":
        return cv.publications?.[0]?.title ? (
          <div key={key} style={block}>
            {label("Publications", "book-open")}
            {cv.publications.map((p, i) => (
              <div key={i} className="cv-item" style={{ marginBottom: 6, paddingLeft: 33, fontSize: s - 0.5, color: tc }}>
                <b style={{ color: ink }}>{p.title}</b>
                {(p.journal || p.date) && <span style={{ color: muted }}> · {[p.journal, p.date].filter(Boolean).join(", ")}</span>}
              </div>
            ))}
          </div>
        ) : null;
      case "certifications": {
        if (!hasCertifications(cv)) return null;
        return (
          <div key={key} style={block} className="cv-section-keep">
            {label("Certifications", "certificate")}
            <div style={{ paddingLeft: 33 }}>
              {normalizeCertifications(cv.certifications).map((c, i) => (
                <CertificationItem key={i} cert={c} fontSize={s - 0.5} lineHeight={lh} color={tc} accent={accent} />
              ))}
            </div>
          </div>
        );
      }
      case "references":
        return cv.references?.[0]?.name ? (
          <div key={key} style={block} className="cv-section-keep">
            {label("References", "user-friends")}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 16px", paddingLeft: 33 }}>
              {cv.references.map((r, i) => (
                <div key={i} style={{ fontSize: s - 1 }}>
                  <b style={{ fontSize: s - 0.5, color: ink, display: "block" }}>{r.name}</b>
                  {(r.title || r.company) && <div style={{ color: accent, fontWeight: 600 }}>{[r.title, r.company].filter(Boolean).join(", ")}</div>}
                  {r.email && <div style={{ color: tc }}>{r.email}</div>}
                  {r.phone && <div style={{ color: tc }}>{r.phone}</div>}
                </div>
              ))}
            </div>
          </div>
        ) : null;
      default: return null;
    }
  };

  const sideInk = ink;
  const dotted = (text) => text.split(/[,\n]+/).map(x => x.trim()).filter(Boolean);

  const renderSide = (key) => {
    switch (key) {
      case "skills":
        return cv.skills ? (
          <div key={key} style={{ marginBottom: 16 }} className="cv-section-keep">
            <SummitSideLabel title="Skills" icon="bolt" accent={accent} ink={sideInk} />
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {dotted(cv.skills).map((sk, i) => (
                <div key={i} style={{ display: "flex", alignItems: "baseline", gap: 7, fontSize: s - 1, color: tc, lineHeight: 1.35 }}>
                  <span style={{ width: 5, height: 5, borderRadius: "50%", background: accent, flexShrink: 0, transform: "translateY(-1px)" }} />
                  {sk}
                </div>
              ))}
            </div>
          </div>
        ) : null;
      case "languages":
        return cv.languages ? (
          <div key={key} style={{ marginBottom: 16 }} className="cv-section-keep">
            <SummitSideLabel title="Languages" icon="language" accent={accent} ink={sideInk} />
            <div style={{ fontSize: s - 1, color: tc, lineHeight: 1.5 }}>
              {dotted(cv.languages).map((l, i) => (
                <span key={i}>{i > 0 && <span style={{ color: accent, fontWeight: 800 }}> · </span>}{l}</span>
              ))}
            </div>
          </div>
        ) : null;
      case "hobbies":
        return cv.hobbies ? (
          <div key={key} style={{ marginBottom: 16 }} className="cv-section-keep">
            <SummitSideLabel title="Interests" icon="heart" accent={accent} ink={sideInk} />
            <div style={{ fontSize: s - 1, color: tc, lineHeight: 1.5 }}>
              {dotted(cv.hobbies).map((h, i) => (
                <span key={i}>{i > 0 && <span style={{ color: accent, fontWeight: 800 }}> · </span>}{h}</span>
              ))}
            </div>
          </div>
        ) : null;
      default: return null;
    }
  };

  const contacts = [
    ["phone", cv.phone],
    ["envelope", cv.email],
    ["map-marker-alt", cv.address],
    ["globe", cv.website],
    ["linkedin-in", cv.linkedin, true],
    ["github", cv.github, true],
  ].filter(([, v]) => v);

  return (
    <div style={{
      fontFamily: font,
      fontSize: s,
      color: tc,
      lineHeight: lh,
      background: theme.bg,
      minHeight: "100%",
      boxSizing: "border-box",
      display: "flex",
      position: "relative",
      overflow: "hidden",
    }}>
      <SummitBackdrop accent={accent} ink={ink} />

      {/* SIDEBAR CARD */}
      <div style={{
        width: 214,
        flexShrink: 0,
        margin: "26px 0 26px 26px",
        padding: "22px 16px 20px",
        borderRadius: 20,
        background: dark ? "rgba(255,255,255,0.06)" : "#f3f6fb",
        border: `1px solid ${dark ? "rgba(255,255,255,0.08)" : `${accent}1a`}`,
        position: "relative",
        zIndex: 1,
        boxSizing: "border-box",
      }}>
        {/* Photo with offset backdrop */}
        <div style={{ position: "relative", width: 138, height: 156, margin: "0 auto 18px" }}>
          <div style={{
            position: "absolute", inset: 0, transform: "translate(8px, 8px)",
            borderRadius: 18, background: `${accent}38`,
          }} />
          <div style={{
            position: "relative", width: "100%", height: "100%", borderRadius: 18,
            overflow: "hidden", background: `${accent}1f`, border: "3px solid #fff", boxSizing: "border-box",
          }}>
            {cv.photo ? (
              <img src={cv.photo} alt="profile" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top", display: "block" }} />
            ) : (
              <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <i className="fas fa-user" style={{ fontSize: "2.6rem", color: accent, opacity: 0.45 }}></i>
              </div>
            )}
          </div>
        </div>

        {contacts.length > 0 && (
          <div style={{ marginBottom: 16 }}>
            <SummitSideLabel title="Contact" icon="address-book" accent={accent} ink={sideInk} />
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {contacts.map(([icon, text, fab]) => (
                <div key={icon} style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: s - 1.5, color: tc, lineHeight: 1.35, overflowWrap: "anywhere" }}>
                  <span style={{
                    width: 18, height: 18, borderRadius: "50%", flexShrink: 0,
                    background: accent, color: "#fff", fontSize: 8,
                    display: "inline-flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <i className={`${fab ? "fab" : "fas"} fa-${icon}`}></i>
                  </span>
                  <span style={{ paddingTop: 1 }}>{text}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {sideSections.map(renderSide)}
      </div>

      {/* MAIN */}
      <div style={{ flex: 1, minWidth: 0, padding: "40px 34px 120px 26px", position: "relative", zIndex: 1 }}>
        <div style={{ marginBottom: 18 }}>
          {cv.jobTitle && (
            <div style={{ fontSize: s - 0.5, fontWeight: 700, letterSpacing: 3.2, textTransform: "uppercase", color: accent, marginBottom: 6 }}>
              {cv.jobTitle}
            </div>
          )}
          <div style={{ fontSize: format.nameFontSize + 8, fontWeight: 800, lineHeight: 1.05, letterSpacing: -0.5 }}>
            <span style={{ color: ink }}>{firstName}</span>
            {lastName && <span style={{ color: accent }}> {lastName}</span>}
          </div>
          <div style={{ display: "flex", gap: 5, marginTop: 10 }}>
            <span style={{ width: 34, height: 4, borderRadius: 2, background: accent }} />
            <span style={{ width: 10, height: 4, borderRadius: 2, background: `${accent}66` }} />
          </div>
        </div>

        {mainSections.map(renderMain)}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════
// ── TEMPLATE 17: VANTAGE ──
// ══════════════════════════════════════════════
// Stone side panel with a shaped portrait over soft blobs, a very large
// two-tone name, a capsule "window" onto a mountain and a timeline. Compact
// sections that sit next to each other share a two-column block.

// Text and level from an entry like "Igbo (Native)".
const VANTAGE_LEVELS = {
  native: 100, mother: 100, bilingual: 100, fluent: 85, proficient: 80, advanced: 75, professional: 75,
  intermediate: 55, conversational: 45, basic: 30, beginner: 25, elementary: 25,
};

function parseLanguage(entry) {
  const m = /^(.+?)\s*[(:–-]\s*([^)]+?)\)?$/.exec(entry);
  const label = m ? m[2].trim() : "";
  const pct = VANTAGE_LEVELS[label.toLowerCase().split(/\s+/)[0]];
  return pct ? { name: m[1].trim(), label, pct } : { name: entry };
}

function VantageSideLabel({ title, ink, accent }) {
  return (
    <div className="cv-section-heading" style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
      <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2.2, textTransform: "uppercase", color: ink, whiteSpace: "nowrap" }}>{title}</span>
      <span style={{ flex: 1, height: 1, background: `${accent}80`, minWidth: 10 }} />
    </div>
  );
}

function VantageLabel({ title, format, ink, accent }) {
  return (
    <div className="cv-section-heading" style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 11 }}>
      <span style={{
        fontSize: format.headingFontSize - 1,
        fontWeight: format.headingBold ? 700 : 500,
        textTransform: format.headingUppercase ? "uppercase" : "none",
        letterSpacing: format.headingUppercase ? 3 : 0.4,
        color: ink,
        whiteSpace: "nowrap",
      }}>
        {title}
      </span>
      <span style={{ flex: 1, height: 1, background: `${accent}99`, minWidth: 12 }} />
    </div>
  );
}

// Portrait outline: an arch for the head that widens into the shoulder, cut
// by the panel's diagonal. Drawn in SVG so the edge stays sharp in the PDF.
const VANTAGE_PHOTO_CLIP = "M0 278 L0 250 C30 238 44 205 44 170 C44 110 72 58 130 58 C185 58 215 100 215 150 L215 230 C235 245 252 265 252 295 L252 340 Q252 364 226 359 Z";

function VantageHero({ cv, accent, ink }) {
  return (
    <svg width="268" height="372" viewBox="0 0 268 372" aria-hidden="true"
      style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none" }}>
      <defs>
        <clipPath id="vantagePhoto"><path d={VANTAGE_PHOTO_CLIP} /></clipPath>
      </defs>
      <path d="M0 66 C34 50 74 52 104 72 L104 210 L0 240 Z" fill="#ffffff" fillOpacity="0.32" />
      <path d="M122 72 C150 54 214 48 236 66 C254 84 242 132 216 168 C190 198 150 192 130 150 Z" fill={accent} fillOpacity="0.38" />
      <path d="M0 118 C30 112 54 140 52 176 C50 216 20 242 0 252 Z" fill={ink} />
      <path d={VANTAGE_PHOTO_CLIP} fill={ink} />
      {cv.photo ? (
        <image href={cv.photo} x="0" y="58" width="252" height="306" preserveAspectRatio="xMidYMin slice" clipPath="url(#vantagePhoto)" />
      ) : (
        <g clipPath="url(#vantagePhoto)">
          <rect x="0" y="58" width="252" height="306" fill={accent} fillOpacity="0.55" />
          <circle cx="130" cy="150" r="42" fill="#ffffff" fillOpacity="0.6" />
          <ellipse cx="130" cy="290" rx="90" ry="84" fill="#ffffff" fillOpacity="0.6" />
        </g>
      )}
    </svg>
  );
}

function VantageWindow({ ink, accent }) {
  return (
    <svg width="112" height="190" viewBox="0 0 112 190" aria-hidden="true" style={{ flexShrink: 0, overflow: "visible" }}>
      <defs>
        <clipPath id="vantageWindow"><rect x="0" y="0" width="74" height="172" rx="37" /></clipPath>
        <linearGradient id="vantageSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#4f6684" />
          <stop offset="0.55" stopColor="#a9b2bd" />
          <stop offset="0.8" stopColor="#d8c4b4" />
        </linearGradient>
      </defs>
      <g clipPath="url(#vantageWindow)">
        <rect width="74" height="172" fill="url(#vantageSky)" />
        <polygon points="-6,112 22,84 42,72 58,84 84,100 84,150 -6,150" fill="#8b93a5" />
        <polygon points="42,72 34,84 40,82 44,92 50,84 58,84" fill="#f1ece6" />
        <polygon points="42,72 58,84 84,100 84,130 60,112 50,92" fill="#5d6780" />
        <path d="M-6 132 C14 112 34 118 46 128 C60 138 72 130 84 124 L84 176 L-6 176 Z" fill={ink} />
      </g>
      <circle cx="74" cy="150" r="38" fill="none" stroke={accent} strokeOpacity="0.5" strokeWidth="0.8" />
    </svg>
  );
}

export function Vantage({ cv, accent, format, sectionOrder, theme }) {
  const s = format.bodyFontSize;
  const lh = format.lineHeight;
  const dark = isDarkColor(theme.bg);
  const ink = dark ? "#f3f6fb" : "#14191f";
  const tc = dark ? theme.text : "#3c4552";
  const muted = dark ? "rgba(255,255,255,0.6)" : "#6d7683";
  const panel = dark ? "linear-gradient(180deg, #262a40, #1f2235)" : "linear-gradient(180deg, #e4e1da, #ebe8e2 55%, #e2dfd8)";
  // Georgia is the builder default; this design is drawn for a geometric sans.
  const font = format.fontFamily === "Georgia, serif"
    ? "'Inter', 'Manrope', 'Helvetica Neue', Arial, sans-serif"
    : format.fontFamily;

  const nameParts = (cv.name || "Your Name").trim().split(/\s+/);
  const firstName = nameParts.length > 1 ? nameParts.slice(0, -1).join(" ") : nameParts[0];
  const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : "";
  // The name is the design: as large as the room beside the window allows.
  const longest = Math.max(firstName.length, lastName.length, 1);
  const nameSize = Math.min(format.nameFontSize + 28, Math.floor(352 / (longest * 0.62)));

  const sideKeys = SIDEBAR_SECTIONS[16];
  const mainKeys = sectionOrder.filter(k => !sideKeys.includes(k));
  const sideSections = sectionOrder.filter(k => sideKeys.includes(k));
  // A summary placed first reads as the intro under the name.
  const introSummary = mainKeys[0] === "summary" ? cv.summary : "";

  const label = (title) => <VantageLabel title={title} format={format} ink={ink} accent={accent} />;
  const dates = (a, b) => [a, b].filter(Boolean).join(" – ");
  const block = { marginBottom: 16 };
  const iconRow = (icon, key, children) => (
    <div key={key} className="cv-item" style={{ display: "flex", gap: 10, marginBottom: 9 }}>
      <i className={`fas fa-${icon}`} style={{ fontSize: 13, color: ink, width: 16, textAlign: "center", marginTop: 2, flexShrink: 0 }}></i>
      <div style={{ flex: 1, minWidth: 0, textAlign: "left" }}>{children}</div>
    </div>
  );
  const small = { fontSize: s - 1, color: muted, textAlign: "left" };

  const renderMain = (key) => {
    switch (key) {
      case "summary":
        return cv.summary && !introSummary ? (
          <div key={key} style={block} className="cv-section-keep">
            {label("Profile")}
            <p style={{ fontSize: s, lineHeight: lh, margin: 0, color: tc }}>{cv.summary}</p>
          </div>
        ) : null;
      case "experience":
        return cv.experience[0]?.company ? (
          <div key={key} style={block}>
            {label("Work Experience")}
            {cv.experience.map((e, i) => (
              <div key={i} className="cv-item" style={{
                position: "relative",
                marginLeft: 3,
                paddingLeft: 24,
                paddingBottom: i === cv.experience.length - 1 ? 2 : 13,
                borderLeft: `1px solid ${dark ? "rgba(255,255,255,0.3)" : "#7c8592"}`,
              }}>
                <span style={{ position: "absolute", left: -4, top: 6, width: 7, height: 7, borderRadius: "50%", background: ink }} />
                <div style={{ fontSize: s + 1.5, fontWeight: 600, color: ink }}>{e.role}</div>
                <div style={{ fontSize: s - 0.5, color: muted, marginBottom: 2 }}>
                  {e.company}
                  {(e.start || e.end || e.current) && <span> &nbsp;•&nbsp; {dates(e.start, e.current ? "Present" : e.end)}</span>}
                </div>
                <BulletList text={e.responsibilities} fontSize={s - 0.5} lineHeight={lh} color={tc} />
              </div>
            ))}
          </div>
        ) : null;
      case "biodata": {
        const rows = bioRows(cv);
        return rows.length ? (
          <div key={key} style={block} className="cv-section-keep">
            {label("Personal Details")}
            {rows.map(([l, v]) => (
              <div key={l} style={{ fontSize: s - 0.5, color: tc, marginBottom: 2 }}>
                <span style={{ color: ink, fontWeight: 600 }}>{l}: </span>{v}
              </div>
            ))}
          </div>
        ) : null;
      }
      case "education":
        return cv.education[0]?.school ? (
          <div key={key} style={block}>
            {label("Education")}
            {cv.education.map((e, i) => iconRow("graduation-cap", i, (
              <>
                <div style={{ fontSize: s + 0.5, fontWeight: 600, color: ink }}>{e.degree}{e.field ? ` in ${e.field}` : ""}</div>
                <div style={small}>{e.school}{(e.start || e.end) && <span> &nbsp;•&nbsp; {dates(e.start, e.end)}</span>}</div>
              </>
            )))}
          </div>
        ) : null;
      case "certifications":
        return hasCertifications(cv) ? (
          <div key={key} style={block}>
            {label("Certifications")}
            {normalizeCertifications(cv.certifications).map((c, i) => iconRow("award", i, (
              <>
                <div style={{ fontSize: s, fontWeight: 600, color: ink }}>{c.name}</div>
                <div style={small}>{c.issuer}{c.issueDate && <span> &nbsp;•&nbsp; {c.issueDate}</span>}</div>
              </>
            )))}
          </div>
        ) : null;
      case "achievements":
        return cv.achievements?.[0]?.title ? (
          <div key={key} style={block}>
            {label("Achievements")}
            {cv.achievements.map((a, i) => iconRow("chevron-circle-right", i, (
              <>
                <div style={{ fontSize: s, fontWeight: 600, color: ink, textAlign: "left" }}>{a.title}</div>
                {a.date && <div style={small}>{a.date}</div>}
                {a.description && <div style={small}>{a.description}</div>}
              </>
            )))}
          </div>
        ) : null;
      case "volunteer":
        return cv.volunteer?.[0]?.organization ? (
          <div key={key} style={block}>
            {label("Volunteer")}
            {cv.volunteer.map((v, i) => iconRow("hands-helping", i, (
              <>
                <div style={{ fontSize: s, fontWeight: 600, color: ink }}>{v.role}</div>
                <div style={small}>{v.organization}{(v.start || v.end) && <span> &nbsp;•&nbsp; {dates(v.start, v.end)}</span>}</div>
                {v.description && <div style={small}>{v.description}</div>}
              </>
            )))}
          </div>
        ) : null;
      case "publications":
        return cv.publications?.[0]?.title ? (
          <div key={key} style={block}>
            {label("Publications")}
            {cv.publications.map((p, i) => iconRow("book-open", i, (
              <>
                <div style={{ fontSize: s, fontWeight: 600, color: ink }}>{p.title}</div>
                {(p.journal || p.date) && <div style={small}>{[p.journal, p.date].filter(Boolean).join(" • ")}</div>}
              </>
            )))}
          </div>
        ) : null;
      case "references":
        return cv.references?.[0]?.name ? (
          <div key={key} style={block}>
            {label("References")}
            {cv.references.map((r, i) => iconRow("user", i, (
              <>
                <div style={{ fontSize: s, fontWeight: 600, color: ink }}>{r.name}</div>
                {(r.title || r.company) && <div style={small}>{[r.title, r.company].filter(Boolean).join(", ")}</div>}
                {(r.email || r.phone) && <div style={small}>{[r.email, r.phone].filter(Boolean).join(" • ")}</div>}
              </>
            )))}
          </div>
        ) : null;
      default: return null;
    }
  };

  // Keep the chosen order; neighbouring compact sections fill two columns,
  // reading left, right, left, right.
  const rendered = mainKeys.map(k => ({ k, node: renderMain(k) })).filter(x => x.node);
  const blocks = [];
  rendered.forEach((item) => {
    const last = blocks[blocks.length - 1];
    if (item.k === "experience" || item.k === "summary") blocks.push({ wide: item });
    else if (last?.run) last.run.push(item);
    else blocks.push({ run: [item] });
  });

  const dotted = (text) => text.split(/[,\n]+/).map(x => x.trim()).filter(Boolean);

  const renderSide = (key) => {
    switch (key) {
      case "skills":
        return cv.skills ? (
          <div key={key} style={{ marginBottom: 18 }} className="cv-section-keep">
            <VantageSideLabel title="Skills" ink={ink} accent={accent} />
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 5px" }}>
              {dotted(cv.skills).map((sk, i) => (
                <span key={i} style={{
                  fontSize: s - 1.5, color: tc, lineHeight: 1.3, padding: "3px 9px", borderRadius: 999,
                  border: `1px solid ${dark ? "rgba(255,255,255,0.3)" : "#a8a59e"}`,
                }}>{sk}</span>
              ))}
            </div>
          </div>
        ) : null;
      case "languages":
        return cv.languages ? (
          <div key={key} style={{ marginBottom: 18 }} className="cv-section-keep">
            <VantageSideLabel title="Languages" ink={ink} accent={accent} />
            {dotted(cv.languages).map(parseLanguage).map((l, i) => (
              <div key={i} style={{ marginBottom: 7 }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 8, fontSize: s - 1.5, color: tc }}>
                  <span>{l.name}</span><span>{l.label}</span>
                </div>
                {l.pct && (
                  <div style={{ height: 4, borderRadius: 2, marginTop: 3, background: dark ? "rgba(255,255,255,0.18)" : "#cbc8c1" }}>
                    <div style={{ width: `${l.pct}%`, height: "100%", borderRadius: 2, background: ink }} />
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : null;
      case "hobbies":
        return cv.hobbies ? (
          <div key={key} style={{ marginBottom: 18 }} className="cv-section-keep">
            <VantageSideLabel title="Interests" ink={ink} accent={accent} />
            <div style={{ fontSize: s - 1, color: tc, lineHeight: 1.5 }}>{dotted(cv.hobbies).join(" • ")}</div>
          </div>
        ) : null;
      default: return null;
    }
  };

  const contacts = [
    ["fas", "envelope", cv.email],
    ["fas", "phone", cv.phone],
    ["fas", "map-marker-alt", cv.address],
    ["fab", "linkedin", cv.linkedin],
    ["fas", "globe", cv.website],
    ["fab", "github", cv.github],
  ].filter(([, , v]) => v);

  return (
    <div style={{
      fontFamily: font,
      fontSize: s,
      color: tc,
      lineHeight: lh,
      background: theme.bg,
      minHeight: "100%",
      boxSizing: "border-box",
      display: "flex",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* SIDE PANEL */}
      <div style={{
        width: 268,
        flexShrink: 0,
        boxSizing: "border-box",
        padding: "352px 24px 96px 30px",
        background: panel,
        position: "relative",
      }}>
        <VantageHero cv={cv} accent={accent} ink={ink === "#14191f" ? ink : "#14171f"} />

        {contacts.length > 0 && (
          <div style={{ marginBottom: 18, position: "relative" }}>
            <VantageSideLabel title="Contact" ink={ink} accent={accent} />
            <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
              {contacts.map(([set, icon, text]) => (
                <div key={icon} style={{ display: "flex", alignItems: "flex-start", gap: 11, fontSize: s - 1.5, color: tc, lineHeight: 1.35, overflowWrap: "anywhere" }}>
                  <i className={`${set} fa-${icon}`} style={{ fontSize: 11, color: ink, width: 14, textAlign: "center", flexShrink: 0, marginTop: 1 }}></i>
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {sideSections.map(renderSide)}

        {/* Dark facets in the panel's foot */}
        <svg width="148" height="92" viewBox="0 0 148 92" aria-hidden="true"
          style={{ position: "absolute", right: 0, bottom: 0, pointerEvents: "none" }}>
          <polygon points="0,92 148,0 148,92" fill={dark ? "#0f1120" : "#14191f"} />
          <polygon points="56,92 148,40 148,92" fill={accent} fillOpacity="0.16" />
        </svg>
      </div>

      {/* MAIN */}
      <div style={{ flex: 1, minWidth: 0, padding: "48px 30px 36px 36px" }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 20 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            {cv.jobTitle && (
              <div style={{ fontSize: s - 1.5, fontWeight: 500, letterSpacing: 3.6, textTransform: "uppercase", color: ink, marginBottom: 14 }}>
                {cv.jobTitle}
              </div>
            )}
            <div style={{ fontSize: nameSize, fontWeight: 800, lineHeight: 0.98, letterSpacing: -1 }}>
              <div style={{ color: ink }}>{firstName}</div>
              {lastName && <div style={{ color: accent }}>{lastName}</div>}
            </div>
            {introSummary && (
              <p style={{ fontSize: s + 0.5, lineHeight: lh, margin: "14px 0 0", color: tc }}>{introSummary}</p>
            )}
          </div>
          <VantageWindow ink={dark ? "#0f1120" : ink} accent={accent} />
        </div>

        {blocks.map((b, i) => {
          if (b.wide) return b.wide.node;
          if (b.run.length === 1) return b.run[0].node;
          return (
            <div key={i} style={{ display: "flex", gap: 20 }}>
              {[0, 1].map((col) => (
                <div key={col} style={{
                  flex: 1, minWidth: 0,
                  paddingLeft: col ? 20 : 0,
                  borderLeft: col ? `1px solid ${dark ? "rgba(255,255,255,0.25)" : "#b9bdc4"}` : "none",
                }}>
                  {b.run.filter((_, n) => n % 2 === col).map(x => x.node)}
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}
