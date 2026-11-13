// ── FIELD SUGGESTIONS ──
// The builder's "suggest" buttons. The server builds the prompt from the
// field name and a few facts, and counts each call against the user's daily
// allowance (src/cv-builder/utils/aiQuota.js), so nobody can use it as a free
// AI service or run through our tokens.
import { auth } from "../../firebase";
import { cvApi } from "./cvAccess";

/**
 * Hobbies have no suggestion on purpose: people write their own.
 * @param {"summary"|"skills"|"languages"|"responsibilities"|"certifications"} kind
 * @param {{jobTitle?: string, role?: string, company?: string, skills?: string, experience?: string, education?: string}} context
 * @returns {Promise<string>}
 */
export async function suggestField(kind, context = {}) {
  const user = auth.currentUser;
  if (!user) throw new Error("Please sign in to use suggestions.");
  const { status, data } = await cvApi("write", user, { kind, context });
  if (status === 200 && data.success) return data.text || "";
  throw new Error(data.error || `Server error (${status})`);
}
