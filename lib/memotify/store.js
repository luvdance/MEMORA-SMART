/**
 * Where Memotify's server code gets its database and its caller. SERVER ONLY.
 *
 * Production uses the CV app's Firebase Admin setup. selfTest.mjs and the local
 * dev server (vite.config.js) swap in an in-memory stand-in through
 * useTestBackend. api/memotify.js never calls it, so a deployed function has
 * no route to the fake identity.
 */
import { db as adminDb, verifyCaller, adminStatus } from "../cv/admin.js";
import { claudeInterviewer } from "./interview.js";
import { scoreCv, optimizeCv } from "../cv/ai.js";
import { writeCoverLetter, checkCoverLetter } from "../cv/writing.js";

let backend = null;

export function useTestBackend(next) {
  backend = next;
}

export const store = () => (backend ? backend.db : adminDb());
export const whoIs = (req) => (backend ? backend.identify(req) : verifyCaller(req));
export const interviewer = () => backend?.interviewer || claudeInterviewer;
export const cvAi = () => backend?.cvAi || { scoreCv, optimizeCv, writeCoverLetter, checkCoverLetter };
export const storeStatus = () => (backend ? { ok: true } : adminStatus());
