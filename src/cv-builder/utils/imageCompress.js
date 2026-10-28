// ── PHOTO COMPRESSION ──
// Profile photos are stored inline as data URLs inside the CV document.
// Firestore caps a single string at ~1MB (a nested one fails with "invalid
// nested entity"), and a raw phone photo is several MB, so every photo is
// downscaled before it reaches state or the database. Templates show the
// photo at ~130px, so 600px on the long side stays sharp in print.

const MAX_SIDE = 600;
const QUALITY = 0.85;
// Data URLs below this size are left untouched.
const SAFE_LENGTH = 300 * 1024;

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Could not read image"));
    img.src = src;
  });
}

export async function compressImage(src, { maxSide = MAX_SIDE, quality = QUALITY } = {}) {
  const img = await loadImage(src);
  const scale = Math.min(1, maxSide / Math.max(img.naturalWidth, img.naturalHeight));
  const w = Math.max(1, Math.round(img.naturalWidth * scale));
  const h = Math.max(1, Math.round(img.naturalHeight * scale));
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  // JPEG has no alpha channel: paint white first so transparent PNGs don't turn black
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, w, h);
  ctx.drawImage(img, 0, 0, w, h);
  return canvas.toDataURL("image/jpeg", quality);
}

export function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (ev) => resolve(ev.target.result);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

// Shrinks a stored photo only when it is an oversized data URL; anything else
// (empty, a remote URL, an already small image) is returned as-is.
export async function shrinkPhoto(photo) {
  if (typeof photo !== "string" || !photo.startsWith("data:image/") || photo.length <= SAFE_LENGTH) {
    return photo;
  }
  try {
    return await compressImage(photo);
  } catch {
    return photo;
  }
}
