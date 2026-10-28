import { db } from "../../firebase";
import {
  doc,
  setDoc,
  getDoc,
  deleteDoc,
  serverTimestamp,
  collection,
  query,
  where,
  getDocs,
  orderBy,
  limit,
} from "firebase/firestore";

// ── GENERATE RANDOM ID ──
function generateId() {
  return (
    Math.random().toString(36).substring(2, 10) +
    Math.random().toString(36).substring(2, 10)
  );
}

// ── SAVE OR UPDATE A CV ──
export async function saveCV({
  cvId,
  userId,
  cvData,
  template,
  accent,
  format,
  sectionOrder,
  theme,           // ← ADDED
  title,
}) {
  const id = cvId || generateId();
  const ref = doc(db, "cvs", id);
  await setDoc(
    ref,
    {
      ownerId: userId,
      title: title || "My CV",
      template,
      accent,
      format: format || {},
      sectionOrder: sectionOrder || [],
      theme: theme || {},
      data: cvData,
      isPublic: true,
      lastEditedBy: "owner",
      updatedAt: serverTimestamp(),
      // Only on first save — re-saving must not reset the creation date.
      ...(cvId ? {} : { createdAt: serverTimestamp() }),
    },
    { merge: true }
  );
  return id;
}

// ── ADMIN: SAVE A USER'S CV ──
// Writes straight to the owner's document (admins pass the Firestore rules via
// the `admin` custom claim). ownerId is kept, so the change shows up on the
// user's side the next time they open the CV, or live if it's already open.
export async function adminSaveCV({ cvId, ownerId, cvData, template, accent, format, sectionOrder, theme, title, note }) {
  await setDoc(
    doc(db, "cvs", cvId),
    {
      ownerId,
      title: title || "My CV",
      template,
      accent,
      format: format || {},
      sectionOrder: sectionOrder || [],
      theme: theme || {},
      data: cvData,
      lastEditedBy: "admin",
      adminEditedAt: serverTimestamp(),
      adminNote: note || "",
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}

// ── ADMIN: LIST RECENT CVs ACROSS ALL USERS ──
export async function getAllCVs(max = 300) {
  const q = query(collection(db, "cvs"), orderBy("updatedAt", "desc"), limit(max));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

// ── LOAD A CV BY ID ──
export async function loadCV(cvId) {
  const ref = doc(db, "cvs", cvId);
  const snap = await getDoc(ref);
  if (snap.exists()) {
    return { id: snap.id, ...snap.data() };
  }
  return null;
}

// ── GET ALL CVs BY USER ──
export async function getUserCVs(userId) {
  const q = query(
    collection(db, "cvs"),
    where("ownerId", "==", userId),
    orderBy("updatedAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

// ── DELETE A CV ──
export async function deleteCV(cvId) {
  await deleteDoc(doc(db, "cvs", cvId));
}