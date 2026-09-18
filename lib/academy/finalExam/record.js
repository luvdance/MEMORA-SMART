/**
 * EXAM RESULTS AND CERTIFICATES — SERVER-SIDE PERSISTENCE
 *
 * SERVER ONLY. Uses the Firebase Admin SDK.
 *
 * WHY THIS IS NOT IN academyService.js WITH EVERYTHING ELSE
 * Lesson progress is written by the signed-in client, and the rules constrain
 * only the SHAPE of those writes, not their honesty. That is a documented,
 * accepted trade-off for practice scores — and it is NOT acceptable for a
 * certificate, which is a claim made to an employer. A client that can write
 * its own pass can mint its own certificate.
 *
 * So exam attempts and certificates are written HERE, by the server, after the
 * server has both graded the paper and verified who the candidate is from
 * their Firebase ID token. firestore.rules denies client writes to both
 * collections, which makes this module the only way a record can appear.
 *
 * The service account already exists in this project — api/paystack-webhook.js
 * and api/requery-payment.js have used it in production since before the
 * Academy shipped. (The older comments in academyService.js and
 * firestore.rules claiming no service account is configured predate those
 * endpoints and are wrong; they are corrected in place.)
 *
 * DEGRADES HONESTLY. With no credentials configured — a local dev machine,
 * say — nothing here throws the request away. It reports that the attempt was
 * graded but not recorded, so a developer sees the exam work end to end and
 * a candidate is never shown a certificate that was not actually stored.
 */

import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";
import { BLUEPRINT } from "./blueprint.js";

let ready = null;

/**
 * Initialise the Admin SDK once per warm serverless instance.
 * Returns false when credentials are absent rather than throwing, so the exam
 * still functions in an environment without them.
 */
function admin() {
  if (ready !== null) return ready;

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;

  if (!projectId || !clientEmail || !privateKey) {
    ready = false;
    return ready;
  }

  try {
    if (!getApps().length) {
      initializeApp({
        credential: cert({
          projectId,
          clientEmail,
          // Vercel stores the key with literal \n sequences.
          privateKey: privateKey.replace(/\\n/g, "\n"),
        }),
      });
    }
    ready = true;
  } catch {
    ready = false;
  }
  return ready;
}

export function isRecordingAvailable() {
  return admin();
}

/**
 * Establish who the candidate is from their Firebase ID token.
 *
 * The uid is NEVER taken from the request body. A body-supplied uid would let
 * anyone write a pass into anyone else's record, which is the whole attack
 * this function exists to prevent.
 *
 * @returns {Promise<{uid: string, email: string|null, name: string|null}|null>}
 */
export async function identify(authorizationHeader) {
  if (!admin()) return null;
  const raw = String(authorizationHeader || "");
  const match = /^Bearer\s+(.+)$/i.exec(raw.trim());
  if (!match) return null;

  try {
    const decoded = await getAuth().verifyIdToken(match[1]);
    return {
      uid: decoded.uid,
      email: decoded.email || null,
      name: decoded.name || null,
    };
  } catch {
    // An expired or forged token is indistinguishable from no token here, and
    // both mean the same thing: do not write anything.
    return null;
  }
}

/** Zero-padded sequence, e.g. MST-CERT-2026-000042. */
function certificateId(year, sequence) {
  return `MST-CERT-${year}-${String(sequence).padStart(6, "0")}`;
}

/**
 * Issue a certificate, or return the one this student already holds.
 *
 * Uniqueness of the certificate number does not rest on the counter being
 * honest — it rests on `certificates/{id}` being CREATED inside a
 * transaction. Document creation is atomic on the key, so two candidates
 * passing in the same second cannot both claim the same number: the second
 * transaction sees the document exists and takes the next one. This is the
 * same guarantee the Memora ID uses, for the same reason.
 */
async function issueCertificate(db, candidate, result) {
  const year = new Date().getUTCFullYear();
  const holderRef = db.doc(`students/${candidate.uid}`);
  const counterRef = db.doc("counters/certificateId");

  // If they already hold one, the exam does not mint a second.
  const existing = await db
    .collection("certificates")
    .where("uid", "==", candidate.uid)
    .where("courseId", "==", BLUEPRINT.courseId)
    .limit(1)
    .get();
  if (!existing.empty) {
    const doc = existing.docs[0];
    return { id: doc.id, ...doc.data(), reissued: true };
  }

  for (let attempt = 0; attempt < 8; attempt += 1) {
    const next = await db.runTransaction(async (tx) => {
      const counterSnap = await tx.get(counterRef);
      const last = counterSnap.exists ? counterSnap.data().last || 0 : 0;
      const sequence = last + 1;
      const id = certificateId(year, sequence);
      const certRef = db.doc(`certificates/${id}`);

      const clash = await tx.get(certRef);
      if (clash.exists) {
        // Someone took this number; move the counter on and retry.
        tx.set(counterRef, { last: sequence }, { merge: true });
        return null;
      }

      const holderSnap = await tx.get(holderRef);
      const holder = holderSnap.exists ? holderSnap.data() : {};

      const payload = {
        uid: candidate.uid,
        // WHICH COURSE. Stored three ways on purpose: the id is what code
        // matches on, the slug is what a URL uses, and the title is what the
        // printed certificate says. A certificate that outlives a course
        // rename must still read correctly, so the title is snapshotted here
        // rather than looked up at render time.
        courseId: BLUEPRINT.courseId,
        courseSlug: BLUEPRINT.courseId,
        courseCode: BLUEPRINT.courseCode,
        courseTitle: BLUEPRINT.courseTitle,
        examId: BLUEPRINT.id,
        examVersion: BLUEPRINT.version,
        name: BLUEPRINT.certificate.name,
        issuer: BLUEPRINT.certificate.issuer,
        covers: BLUEPRINT.certificate.covers,
        // Snapshot the identity at issue time: a certificate must still read
        // correctly if the student later changes their display name.
        holderName: holder.displayName || candidate.name || null,
        holderEmail: holder.email || candidate.email || null,
        memoraId: holder.memoraId || null,
        score: result.score,
        domainScores: result.domains.map((d) => ({ id: d.id, score: d.score })),
        seed: result.seed,
        issuedAt: FieldValue.serverTimestamp(),
        revoked: false,
      };

      tx.set(certRef, payload);
      tx.set(counterRef, { last: sequence }, { merge: true });
      return { id, sequence };
    });

    if (next) {
      return {
        id: next.id,
        name: BLUEPRINT.certificate.name,
        issuer: BLUEPRINT.certificate.issuer,
        covers: BLUEPRINT.certificate.covers,
        score: result.score,
        reissued: false,
      };
    }
  }

  throw new Error("Could not allocate a certificate number");
}

/**
 * Record one graded attempt, and issue a certificate if it was a pass.
 *
 * Every attempt is stored, pass or fail, because an exam with no history is an
 * exam somebody can grind silently. The attempt document is keyed by its seed,
 * which makes the write idempotent: submitting the same paper twice updates
 * one record rather than inflating the count.
 *
 * @returns {Promise<{recorded: boolean, reason?: string, attempts?: number,
 *                    certificate?: object}>}
 */
export async function recordAttempt(candidate, result) {
  if (!admin()) return { recorded: false, reason: "no-credentials" };
  if (!candidate?.uid) return { recorded: false, reason: "not-identified" };

  const db = getFirestore();
  const attemptRef = db.doc(
    `students/${candidate.uid}/examAttempts/${BLUEPRINT.id}__${result.seed}`
  );

  const already = await attemptRef.get();

  await attemptRef.set(
    {
      uid: candidate.uid,
      examId: BLUEPRINT.id,
      examVersion: BLUEPRINT.version,
      courseId: BLUEPRINT.courseId,
      seed: result.seed,
      score: result.score,
      passed: result.passed,
      verdict: result.verdict,
      correctCount: result.correctCount,
      total: result.total,
      answered: result.answered,
      domains: result.domains.map((d) => ({
        id: d.id,
        score: d.score,
        correct: d.correct,
        total: d.total,
        met: d.met,
      })),
      missedSkills: result.missedSkills.slice(0, 12),
      review: result.review,
      // Keep the first submission time; a resubmission of the same paper is
      // the same attempt.
      submittedAt: already.exists
        ? already.data().submittedAt
        : FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    },
    { merge: true }
  );

  // A running summary on the student record, so the profile page does not have
  // to read every attempt to show a best score.
  const summaryRef = db.doc(`students/${candidate.uid}`);
  const attemptsSnap = await db
    .collection(`students/${candidate.uid}/examAttempts`)
    .where("examId", "==", BLUEPRINT.id)
    .get();

  const scores = attemptsSnap.docs.map((d) => d.data().score || 0);
  const best = scores.length ? Math.max(...scores) : result.score;
  const passedEver = attemptsSnap.docs.some((d) => d.data().passed === true);

  await summaryRef.set(
    {
      finalExam: {
        examId: BLUEPRINT.id,
        attempts: attemptsSnap.size,
        bestScore: best,
        lastScore: result.score,
        passed: passedEver,
        lastAttemptAt: FieldValue.serverTimestamp(),
      },
    },
    { merge: true }
  );

  let certificate;
  if (result.passed) {
    try {
      certificate = await issueCertificate(db, candidate, result);
    } catch (err) {
      // A pass that could not be certified must not look like a fail. Report
      // it and let the candidate contact support with their attempt on record.
      return {
        recorded: true,
        attempts: attemptsSnap.size,
        certificateError: err.message,
      };
    }
  }

  return { recorded: true, attempts: attemptsSnap.size, certificate };
}

export default { recordAttempt, identify, isRecordingAvailable };
