/**
 * ACADEMY MEDIA MANIFEST
 * ──────────────────────────────────────────────────────────────────────────
 * Every image the Academy uses is registered here — one place, so artwork can
 * be swapped without touching a component.
 *
 * HOW TO ADD AN IMAGE
 *   1. Drop the file into  src/academy/assets/
 *   2. Uncomment the matching import below and point it at the file
 *   3. Set the value in ACADEMY_MEDIA to the imported variable
 *
 * Until a slot is filled the page renders a labelled placeholder at the exact
 * aspect ratio listed, so the layout will not move when the real image lands.
 *
 * SLOTS AND WHAT THEY NEED
 *   hero          1200 × 1000  · 6:5   · a student learning on a laptop.
 *                                        Subject on the LEFT half — floating
 *                                        UI cards overlap the right edge.
 *   courseVisual   900 ×  640  · 7:5   · Excel / Power BI / Python artwork,
 *                                        sits on a deep indigo panel so a
 *                                        transparent PNG works best.
 *   certificate   1200 ×  850  · 7:5   · your certificate design. Shown in the
 *                                        Certification section of the landing
 *                                        page. Landscape works best.
 *   method         900 ×  760  · 7:6   · optional. A screenshot of a lesson
 *                                        broken into atoms.
 */

import heroImage from "./assets/academy-hero.jpg";
import courseVisual from "./assets/course-visual.jpg";
import certificateImage from "./assets/certificateImage.jpg";
// import methodImage from "./assets/method.png";

export const ACADEMY_MEDIA = {
  hero: heroImage,
  courseVisual: courseVisual,
  certificate: certificateImage,
  method: null, // methodImage,
};

export default ACADEMY_MEDIA;
