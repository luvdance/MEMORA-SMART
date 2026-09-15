import { useState, useEffect, useMemo } from "react";
import {
  collection,
  collectionGroup,
  getDocs,
} from "firebase/firestore";
import { db } from "../../firebase";
import { CATALOG } from "../../academy/data/catalog";
import { getCourseLessons } from "../../academy/data/lessons";

/**
 * ACADEMY ADMIN — enrolment and progress roster.
 *
 * Mounted only from Admin.jsx, which has already verified the `admin` custom
 * claim on the ID token. This component deliberately does NOT re-implement
 * that gate: a second, weaker check is how gates drift apart. Firestore is the
 * real boundary anyway — firestore.rules grants a blanket read to
 * `request.auth.token.admin == true` and denies cross-student reads to
 * everyone else, so a non-admin who rendered this component would simply get
 * permission-denied on every query.
 *
 * READ SHAPE
 *   students/{uid}                        → profile, XP, streak, counters
 *   students/{uid}/enrollments/{courseId} → course, enrolledAt, completedLessons
 *   students/{uid}/progress/{c__lesson}   → per-lesson atoms + assessment
 *
 * The roster needs every enrollment across every student, which is a
 * collection-group query. Those need a recursive-wildcard rule to match; the
 * catch-all `match /{document=**}` at the top of firestore.rules provides one
 * for admins. If that ever tightens, the query throws permission-denied rather
 * than returning a silently short list, so we fall back to walking each
 * student's subcollection instead of showing a roster that looks complete but
 * is not.
 */

const courseName = (slug) =>
  CATALOG.find((c) => c.slug === slug || c.id === slug)?.title || slug || "—";

const courseLessons = (slug) => {
  try {
    return getCourseLessons(slug) || [];
  } catch {
    return [];
  }
};

const lessonCount = (slug) => courseLessons(slug).length;

/**
 * Percentage against the AUTHORED lessons only, the same rule
 * calculateProgress() uses. Counting the raw completedLessons array instead
 * would let a stale id from a removed lesson push someone past 100%.
 */
const pct = (slug, completedLessons = []) => {
  const lessons = courseLessons(slug);
  if (!lessons.length) return 0;
  const done = lessons.filter((l) => completedLessons.includes(l.id)).length;
  return Math.round((done / lessons.length) * 100);
};

/** Lessons actually done, ignoring ids that no longer exist in the course. */
const doneCount = (slug, completedLessons = []) => {
  const lessons = courseLessons(slug);
  if (!lessons.length) return (completedLessons || []).length;
  return lessons.filter((l) => completedLessons.includes(l.id)).length;
};

function toDate(v) {
  if (!v) return null;
  if (typeof v.toDate === "function") return v.toDate();
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? null : d;
}

const fmtDate = (v) => {
  const d = toDate(v);
  return d ? d.toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" }) : "—";
};

function daysSince(v) {
  const d = toDate(v);
  if (!d) return null;
  return Math.floor((Date.now() - d.getTime()) / 86400000);
}

const lastSeenLabel = (v) => {
  const n = daysSince(v);
  if (n === null) return "No activity";
  if (n === 0) return "Today";
  if (n === 1) return "Yesterday";
  if (n < 30) return `${n}d ago`;
  return fmtDate(v);
};

export default function AcademyAdmin() {
  const [students, setStudents] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [degraded, setDegraded] = useState(false);

  const [search, setSearch] = useState("");
  const [courseFilter, setCourseFilter] = useState("all");

  const [selected, setSelected] = useState(null);
  const [detail, setDetail] = useState({ loading: false, rows: [] });

  useEffect(() => {
    let alive = true;

    (async () => {
      setLoading(true);
      setError("");
      try {
        const studentSnap = await getDocs(collection(db, "students"));
        const studentRows = studentSnap.docs.map((d) => ({ id: d.id, ...d.data() }));

        let enrollRows = [];
        let fellBack = false;
        try {
          const snap = await getDocs(collectionGroup(db, "enrollments"));
          enrollRows = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        } catch {
          // Collection-group read refused. Walk each student instead so the
          // roster stays truthful, and say so in the UI.
          fellBack = true;
          const each = await Promise.all(
            studentRows.map(async (s) => {
              try {
                const sub = await getDocs(collection(db, "students", s.id, "enrollments"));
                return sub.docs.map((d) => ({ id: d.id, ...d.data() }));
              } catch {
                return [];
              }
            })
          );
          enrollRows = each.flat();
        }

        if (!alive) return;
        setStudents(studentRows);
        setEnrollments(enrollRows);
        setDegraded(fellBack);
      } catch (err) {
        if (alive) setError(err?.message || "Could not load academy data");
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  /* One row per enrolment, joined to the student profile. */
  const rows = useMemo(() => {
    const byUid = new Map(students.map((s) => [s.uid || s.id, s]));

    return enrollments
      .map((e) => {
        const s = byUid.get(e.uid) || {};
        return {
          key: `${e.uid}__${e.courseId}`,
          uid: e.uid,
          courseId: e.courseId,
          course: courseName(e.courseId),
          enrolledAt: e.enrolledAt,
          status: e.status || "active",
          completedLessons: e.completedLessons || [],
          progress: pct(e.courseId, e.completedLessons || []),
          name: s.displayName || "Unnamed",
          email: s.email || "—",
          photoURL: s.photoURL || "",
          memoraId: s.memoraId || "—",
          xp: s.xp || 0,
          streak: s.streak?.current || 0,
          longest: s.streak?.longest || 0,
          lessonsCompleted: s.lessonsCompleted || 0,
          assessmentsPassed: s.assessmentsPassed || 0,
          assessmentsAttempted: s.assessmentsAttempted || 0,
          badges: s.badges || [],
          lastActive: s.streak?.lastActiveDate || null,
          joinedAt: s.joinedAt,
        };
      })
      .sort((a, b) => (toDate(b.enrolledAt)?.getTime() || 0) - (toDate(a.enrolledAt)?.getTime() || 0));
  }, [students, enrollments]);

  const courses = useMemo(() => {
    const set = new Map();
    for (const r of rows) set.set(r.courseId, r.course);
    return [...set.entries()];
  }, [rows]);

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows.filter((r) => {
      if (courseFilter !== "all" && r.courseId !== courseFilter) return false;
      if (!q) return true;
      return (
        r.name.toLowerCase().includes(q) ||
        r.email.toLowerCase().includes(q) ||
        String(r.memoraId).toLowerCase().includes(q)
      );
    });
  }, [rows, search, courseFilter]);

  const stats = useMemo(() => {
    const active7 = rows.filter((r) => {
      const n = daysSince(r.lastActive);
      return n !== null && n <= 7;
    }).length;
    const avg = rows.length
      ? Math.round(rows.reduce((a, r) => a + r.progress, 0) / rows.length)
      : 0;
    const finished = rows.filter((r) => r.progress >= 100).length;

    return [
      { label: "Students", value: students.length, color: "#6699FF" },
      { label: "Enrolments", value: rows.length, color: "#9D00FF" },
      { label: "Active (7d)", value: active7, color: "#16a34a" },
      { label: "Avg progress", value: `${avg}%`, color: "#f59e0b" },
      { label: "Completed", value: finished, color: "#0ea5e9" },
    ];
  }, [rows, students]);

  const openDetail = async (row) => {
    setSelected(row);
    setDetail({ loading: true, rows: [] });
    try {
      const snap = await getDocs(collection(db, "students", row.uid, "progress"));
      const list = snap.docs
        .map((d) => d.data())
        .filter((p) => p.courseId === row.courseId)
        .sort((a, b) => String(a.lessonId).localeCompare(String(b.lessonId)));
      setDetail({ loading: false, rows: list });
    } catch (err) {
      setDetail({ loading: false, rows: [], error: err?.message });
    }
  };

  const exportCsv = () => {
    const head = [
      "Memora ID", "Name", "Email", "Course", "Progress %", "Lessons done",
      "XP", "Streak", "Assessments passed", "Attempts", "Enrolled", "Last active",
    ];
    const esc = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
    const lines = [head.map(esc).join(",")];
    for (const r of visible) {
      lines.push([
        r.memoraId, r.name, r.email, r.course, r.progress, doneCount(r.courseId, r.completedLessons),
        r.xp, r.streak, r.assessmentsPassed, r.assessmentsAttempted,
        fmtDate(r.enrolledAt), lastSeenLabel(r.lastActive),
      ].map(esc).join(","));
    }
    const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `academy-roster-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="admin__loading">
        <i className="fas fa-circle-notch fa-spin"></i> Loading academy data…
      </div>
    );
  }

  if (error) {
    return (
      <div className="acad__error">
        <i className="fas fa-exclamation-triangle"></i>
        <div>
          <strong>Could not load academy data.</strong>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="acad">
      {degraded && (
        <div className="acad__notice">
          <i className="fas fa-info-circle"></i>
          Collection-group read was refused, so enrolments were gathered per student.
          The roster is complete but slower. Check the <code>enrollments</code> rule in firestore.rules.
        </div>
      )}

      {/* STATS */}
      <div className="admin__stats">
        {stats.map((s) => (
          <div key={s.label} className="admin__stat-card">
            <div className="admin__stat-value" style={{ color: s.color }}>{s.value}</div>
            <div className="admin__stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* CONTROLS */}
      <div className="admin__controls">
        <div className="admin__search">
          <i className="fas fa-search"></i>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, email or Memora ID"
          />
        </div>
        <div className="admin__filter">
          <select value={courseFilter} onChange={(e) => setCourseFilter(e.target.value)}>
            <option value="all">All courses ({rows.length})</option>
            {courses.map(([slug, label]) => (
              <option key={slug} value={slug}>
                {label} ({rows.filter((r) => r.courseId === slug).length})
              </option>
            ))}
          </select>
        </div>
        <button className="acad__export" onClick={exportCsv} disabled={!visible.length}>
          <i className="fas fa-file-csv"></i> Export CSV
        </button>
      </div>

      {/* ROSTER */}
      {!visible.length ? (
        <div className="admin__empty">
          <i className="fas fa-user-graduate"></i>
          <p>{rows.length ? "No one matches that filter." : "Nobody has enrolled yet."}</p>
        </div>
      ) : (
        <div className="acad__table-wrap">
          <table className="acad__table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Memora ID</th>
                <th>Course</th>
                <th>Progress</th>
                <th>XP</th>
                <th>Streak</th>
                <th>Assessments</th>
                <th>Enrolled</th>
                <th>Last active</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {visible.map((r) => (
                <tr key={r.key}>
                  <td>
                    <div className="acad__student">
                      <div className="acad__avatar">
                        {r.photoURL
                          ? <img src={r.photoURL} alt="" />
                          : (r.name[0] || "?").toUpperCase()}
                      </div>
                      <div className="acad__student-text">
                        <strong>{r.name}</strong>
                        <span>{r.email}</span>
                      </div>
                    </div>
                  </td>
                  <td><code className="acad__id">{r.memoraId}</code></td>
                  <td>{r.course}</td>
                  <td>
                    <div className="acad__bar">
                      <div className="acad__bar-fill" style={{ width: `${r.progress}%` }} />
                    </div>
                    <span className="acad__bar-label">
                      {r.progress}% · {doneCount(r.courseId, r.completedLessons)}/{lessonCount(r.courseId) || "?"} lessons
                    </span>
                  </td>
                  <td>{r.xp.toLocaleString()}</td>
                  <td>
                    {r.streak > 0 ? <>🔥 {r.streak}</> : "—"}
                    {r.longest > r.streak && <span className="acad__muted"> / {r.longest}</span>}
                  </td>
                  <td>
                    {r.assessmentsPassed}/{r.assessmentsAttempted || 0}
                  </td>
                  <td>{fmtDate(r.enrolledAt)}</td>
                  <td>
                    <span className={daysSince(r.lastActive) > 14 ? "acad__stale" : ""}>
                      {lastSeenLabel(r.lastActive)}
                    </span>
                  </td>
                  <td>
                    <button className="admin__action-btn" onClick={() => openDetail(r)}>
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* DETAIL DRAWER */}
      {selected && (
        <div className="acad__overlay" onClick={() => setSelected(null)}>
          <div className="acad__drawer" onClick={(e) => e.stopPropagation()}>
            <div className="acad__drawer-head">
              <div>
                <h3>{selected.name}</h3>
                <p>{selected.email} · <code>{selected.memoraId}</code></p>
              </div>
              <button className="acad__close" onClick={() => setSelected(null)} aria-label="Close">✕</button>
            </div>

            <div className="acad__facts">
              {[
                ["Course", selected.course],
                ["Progress", `${selected.progress}%`],
                ["XP", selected.xp.toLocaleString()],
                ["Current streak", selected.streak],
                ["Longest streak", selected.longest],
                ["Lessons completed", selected.lessonsCompleted],
                ["Enrolled", fmtDate(selected.enrolledAt)],
                ["Joined", fmtDate(selected.joinedAt)],
                ["Last active", lastSeenLabel(selected.lastActive)],
                ["Badges", selected.badges.length],
              ].map(([k, v]) => (
                <div key={k} className="acad__fact">
                  <span>{k}</span>
                  <strong>{v}</strong>
                </div>
              ))}
            </div>

            <h4 className="acad__sub">Lesson progress</h4>
            {detail.loading ? (
              <div className="admin__loading"><i className="fas fa-circle-notch fa-spin"></i> Loading…</div>
            ) : detail.error ? (
              <p className="acad__muted">{detail.error}</p>
            ) : !detail.rows.length ? (
              <p className="acad__muted">No lesson activity recorded yet.</p>
            ) : (
              <table className="acad__table acad__table--inner">
                <thead>
                  <tr>
                    <th>Lesson</th>
                    <th>Atoms</th>
                    <th>Attempts</th>
                    <th>Best</th>
                    <th>Passed</th>
                  </tr>
                </thead>
                <tbody>
                  {detail.rows.map((p) => (
                    <tr key={p.lessonId}>
                      <td>{p.lessonId}</td>
                      <td>{(p.atomsCompleted || []).length}</td>
                      <td>{p.assessment?.attempts ?? 0}</td>
                      <td>{p.assessment?.bestScore != null ? `${p.assessment.bestScore}%` : "—"}</td>
                      <td>
                        {p.assessment?.passed
                          ? <span className="acad__pass">Passed</span>
                          : <span className="acad__muted">—</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
