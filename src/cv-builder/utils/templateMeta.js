// ── TEMPLATE METADATA ──
// One place for the facts about each template that other parts of the app
// depend on. Indexes match TEMPLATES in constants.js and the component list in
// CVPreview.jsx. Pure data: the server imports this file too (lib/cv), so it
// must not import React or Firebase.

// Sections each two-column template places in its side column. Reordering
// moves a section within its own column, so the reorder panel uses this to
// show users which column a section lives in. Templates import these arrays,
// so the panel and the rendered page cannot drift apart.
export const SIDEBAR_SECTIONS = {
  0: ["skills", "languages", "certifications"],                          // Classic Pro
  2: ["skills", "languages", "certifications"],                          // Executive Plus
  4: ["languages", "certifications"],                                    // Creative Side
  5: ["skills", "languages", "certifications"],                          // Corporate Bold
  7: ["skills", "languages", "certifications", "hobbies"],               // Editorial Modern
  8: ["skills", "languages", "certifications", "hobbies"],               // Modern Timeline
  9: ["skills", "languages", "certifications", "hobbies"],               // Compact Pro
  13: ["education", "skills", "languages", "certifications", "references", "hobbies"], // Signature Edge
  14: ["skills", "languages", "certifications", "hobbies", "references", "education"], // Dark Geo
};

export function sidebarSectionsFor(template) {
  return SIDEBAR_SECTIONS[template] || [];
}

// Templates that render the profile photo (passport). The form shows the
// photo upload for exactly these.
export const PHOTO_TEMPLATES = [2, 4, 6, 8, 11, 13, 14];

export function templateUsesPhoto(template) {
  return PHOTO_TEMPLATES.includes(template);
}

// Premium-only templates: Executive Plus, Editorial Modern, Modern Timeline,
// Horizon, Signature Edge, Dark Geo. Free users can preview and edit them but
// need a paid plan to download. Change the list here; the builder, paywall and
// server-side download check all read it.
export const PREMIUM_TEMPLATES = [2, 7, 8, 11, 13, 14];

export function isPremiumTemplate(template) {
  return PREMIUM_TEMPLATES.includes(template);
}
