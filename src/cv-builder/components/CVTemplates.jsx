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

// ── CERTIFICATION HELPERS ──

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
        style={{ fontSize: fontSize - 1, width: 12, textAlign: "center" }}
      ></i>
      <span>{text}</span>
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
          <ContactItem icon="fa-globe" text={cv.website} color="rgba(255,255,255,0.9)" fontSize={format.bodyFontSize - 1} />
          <ContactItem icon="fa-github fab" text={cv.github} color="rgba(255,255,255,0.9)" fontSize={format.bodyFontSize - 1} />
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
          if (key === "certifications" && hasCertifications(cv)) {
            const certs = normalizeCertifications(cv.certifications);
            return (
              <CreativeSideSection key={key} title="Certifications" accent={accent} format={format}>
                {certs.map((c, i) => (
                  <div key={i} style={{ marginBottom: 6 }}>
                    <div style={{ fontSize: format.bodyFontSize - 1, fontWeight: "bold", color: "#fff", lineHeight: 1.3 }}>
                      {c.name}
                    </div>
                    {c.issuer && (
                      <div style={{ fontSize: format.bodyFontSize - 2, color: "rgba(255,255,255,0.7)" }}>{c.issuer}</div>
                    )}
                    {(c.issueDate || c.noExpiry || c.expiryDate) && (
                      <div style={{ fontSize: format.bodyFontSize - 2, color: "rgba(255,255,255,0.6)" }}>
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

      {sectionOrder
        .filter(s => s !== "biodata")
        .map(key => renderMainSection(key, cv, accent, format, theme))}

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
              <span style={{ fontSize, lineHeight, color, opacity: 0.85 }}>{cleaned}</span>
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

  const sideKeys = ["skills", "languages", "certifications", "hobbies"];
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

  const sideKeys = ["skills", "languages", "certifications", "hobbies"];
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

  const sideKeys = ["skills", "languages", "certifications", "hobbies"];
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

// ══════════════════════════════════════════════
// ── TEMPLATE 11: BOLD STATEMENT (high-contrast, fearless) ──
// ══════════════════════════════════════════════
function BoldSection({ num, title, accent, format, children, keepTogether = false }) {
  return (
    <div className={keepTogether ? "cv-section cv-section-keep" : "cv-section"} style={{ marginBottom: 22 }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 10 }}>
        <span style={{ fontSize: format.headingFontSize + 10, fontWeight: 900, color: accent, opacity: 0.18, lineHeight: 1 }}>
          {num}
        </span>
        <span style={{
          fontSize: format.headingFontSize + 1,
          fontWeight: 800,
          textTransform: "uppercase",
          letterSpacing: 1.5,
          color: "#111",
        }}>
          {title}
        </span>
      </div>
      {children}
    </div>
  );
}

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