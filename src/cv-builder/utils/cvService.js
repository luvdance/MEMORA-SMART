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
      updatedAt: serverTimestamp(),
      createdAt: serverTimestamp(),
    },
    { merge: true }
  );
  return id;
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