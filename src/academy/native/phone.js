/**
 * THE PRACTICE PHONE
 *
 * The Mobile App Development course is practised on a simulated phone that
 * runs the learner's real Expo project (see labRuntimeEntry.js). This module
 * is the phone itself: its screen size and safe areas, its status bar and
 * keyboard, its system dialogs (permission prompts, Alert), sheets (photo
 * picker, share sheet, in-app browser), notification banners and splash
 * screen, and the state a real device keeps for an app: granted
 * permissions, stored data, scheduled notifications, the clipboard.
 *
 * It is plain DOM, drawn above the app in a layer of its own, so nothing the
 * app renders can break it and every check can read it.
 *
 * The phone is a SIMULATION and says so: an Android phone and an iPhone are
 * modelled closely enough to practise the behaviour an app must handle
 * (safe areas, a keyboard that covers inputs, a permission the user denies,
 * a notification tapped while the app is closed), but it is not a real
 * device, and every lesson that depends on one says to try it on your phone.
 */

/* ── The two phones ──────────────────────────────────────────────────── */
export const PHONES = {
  ios: {
    os: "ios",
    model: "iPhone 16",
    brand: "Apple",
    manufacturer: "Apple",
    osName: "iOS",
    osVersion: "27.0",
    apiLevel: null,
    width: 393,
    height: 852,
    scale: 3,
    insets: { top: 59, bottom: 34, left: 0, right: 0 },
    landscapeInsets: { top: 0, bottom: 21, left: 59, right: 59 },
    keyboard: 336,
    time: "9:41",
  },
  android: {
    os: "android",
    model: "Pixel 9",
    brand: "google",
    manufacturer: "Google",
    osName: "Android",
    osVersion: "16",
    apiLevel: 36,
    width: 412,
    height: 915,
    scale: 2.625,
    insets: { top: 32, bottom: 24, left: 0, right: 0 },
    landscapeInsets: { top: 0, bottom: 24, left: 32, right: 0 },
    keyboard: 300,
    time: "12:30",
  },
};

/** The screen a lab runs on, at an orientation. */
export function screenFor(os = "ios", orientation = "portrait") {
  const p = PHONES[os] || PHONES.ios;
  const land = orientation === "landscape";
  return {
    width: land ? p.height : p.width,
    height: land ? p.width : p.height,
    insets: { ...(land ? p.landscapeInsets : p.insets) },
  };
}

/* ── Device state ────────────────────────────────────────────────────── */
const listeners = new Map();
export function on(event, fn) {
  if (!listeners.has(event)) listeners.set(event, new Set());
  listeners.get(event).add(fn);
  return () => listeners.get(event)?.delete(fn);
}
export function emit(event, payload) {
  for (const fn of [...(listeners.get(event) || [])]) {
    try {
      fn(payload);
    } catch (err) {
      console.error(err);
    }
  }
}

export const device = {
  os: "ios",
  phone: PHONES.ios,
  orientation: "portrait",
  scheme: "light",
  online: true,
  locale: "en-NG",
  timeZone: "Africa/Lagos",
  /** "expo-go", "development" or "production": what kind of app is running. */
  build: "expo-go",
  location: { latitude: 6.5244, longitude: 3.3792, accuracy: 12, altitude: 41 },
  address: { street: "Broad Street", streetNumber: "12", city: "Lagos", district: "Lagos Island", region: "Lagos", postalCode: "102273", country: "Nigeria", isoCountryCode: "NG", name: "12 Broad Street" },
  biometrics: { hardware: true, enrolled: true, type: "face" },
  accessibility: { screenReader: false, reduceMotion: false, boldText: false, fontScale: 1 },
  updates: { available: false, message: "" },
  /** permission name -> { status, canAskAgain, denials } */
  permissions: {},
  statusBar: { style: "auto", hidden: false },
  appState: "active",
  keyboardHeight: 0,
  app: { name: "My App", slug: "my-app", scheme: "myapp", config: {} },
  log: {
    haptics: [],
    shares: [],
    browser: [],
    vibrations: [],
    toasts: [],
    announcements: [],
    opened: [],
    clipboard: [],
    alerts: [],
  },
  clipboard: { text: "", image: null },
};

export function configure(config = {}) {
  const os = config.os === "android" ? "android" : "ios";
  device.os = os;
  device.phone = PHONES[os];
  device.orientation = config.orientation === "landscape" ? "landscape" : "portrait";
  device.scheme = config.scheme === "dark" ? "dark" : "light";
  device.online = config.online !== false;
  device.locale = config.locale || "en-NG";
  device.timeZone = config.timeZone || "Africa/Lagos";
  device.build = config.build || "expo-go";
  if (config.location) device.location = { ...device.location, ...config.location };
  if (config.address) device.address = { ...device.address, ...config.address };
  if (config.biometrics) device.biometrics = { ...device.biometrics, ...config.biometrics };
  if (config.accessibility) device.accessibility = { ...device.accessibility, ...config.accessibility };
  if (config.updates) device.updates = { ...device.updates, ...config.updates };
  for (const [name, value] of Object.entries(config.permissions || {})) {
    const status = typeof value === "string" ? value : value.status;
    device.permissions[name] = {
      status,
      canAskAgain: typeof value === "object" && "canAskAgain" in value ? value.canAskAgain : status !== "denied" || os === "android",
      denials: status === "denied" ? 1 : 0,
    };
  }
}

export const screen = () => screenFor(device.os, device.orientation);

/**
 * The world's clock. A check can move it forward ("an hour later") so that
 * access tokens expire on the practice server and scheduled notifications
 * fall due, without waiting an hour.
 */
export const clock = {
  offset: 0,
  now: () => Date.now() + clock.offset,
};

/* ── Permissions ─────────────────────────────────────────────────────── */
export function permission(name) {
  const p = device.permissions[name] || { status: "undetermined", canAskAgain: true, denials: 0 };
  return {
    status: p.status,
    granted: p.status === "granted",
    canAskAgain: p.canAskAgain,
    expires: "never",
  };
}

const PROMPTS = {
  camera: {
    ios: (app) => [`“${app}” Would Like to Access the Camera`, "camera"],
    android: (app) => [`Allow ${app} to take pictures and record video?`],
  },
  microphone: {
    ios: (app) => [`“${app}” Would Like to Access the Microphone`, "microphone"],
    android: (app) => [`Allow ${app} to record audio?`],
  },
  mediaLibrary: {
    ios: (app) => [`“${app}” Would Like Full Access to Your Photo Library`, "photos"],
    android: (app) => [`Allow ${app} to access photos and videos on this device?`],
  },
  location: {
    ios: (app) => [`Allow “${app}” to use your location?`, "location"],
    android: (app) => [`Allow ${app} to access this device's location?`],
  },
  backgroundLocation: {
    ios: (app) => [`Allow “${app}” to also use your location even when you are not using the app?`, "location"],
    android: (app) => [`Allow ${app} to access this device's location all the time?`],
  },
  notifications: {
    ios: (app) => [`“${app}” Would Like to Send You Notifications`, "notifications"],
    android: (app) => [`Allow ${app} to send you notifications?`],
  },
  contacts: {
    ios: (app) => [`“${app}” Would Like to Access Your Contacts`, "contacts"],
    android: (app) => [`Allow ${app} to access your contacts?`],
  },
};

/**
 * The usage description an iOS prompt shows, read from app.json the way a
 * build writes it into Info.plist: a config plugin's permission option, or
 * ios.infoPlist directly. Without one, a real build would be rejected.
 */
function usageDescription(name) {
  const cfg = device.app.config || {};
  const plist = cfg.ios?.infoPlist || {};
  const plugin = (id, key) => {
    for (const p of cfg.plugins || []) if (Array.isArray(p) && p[0] === id && p[1]?.[key]) return p[1][key];
    return null;
  };
  const table = {
    camera: plugin("expo-camera", "cameraPermission") || plugin("expo-image-picker", "cameraPermission") || plist.NSCameraUsageDescription,
    microphone: plugin("expo-camera", "microphonePermission") || plist.NSMicrophoneUsageDescription,
    mediaLibrary: plugin("expo-image-picker", "photosPermission") || plist.NSPhotoLibraryUsageDescription,
    location: plugin("expo-location", "locationWhenInUsePermission") || plist.NSLocationWhenInUseUsageDescription,
    backgroundLocation: plugin("expo-location", "locationAlwaysAndWhenInUsePermission") || plist.NSLocationAlwaysAndWhenInUseUsageDescription,
    notifications: "Notifications may include alerts, sounds and icon badges. These can be configured in Settings.",
    contacts: plist.NSContactsUsageDescription,
  };
  return table[name] || "";
}

/** Ask for a permission: answer at once if decided, otherwise show the system prompt. */
export async function requestPermission(name) {
  const current = device.permissions[name];
  if (current && (current.status === "granted" || !current.canAskAgain)) return permission(name);
  const app = device.app.name;
  const [title] = (PROMPTS[name] || PROMPTS.camera)[device.os](app);
  const ios = device.os === "ios";
  const buttons = ios
    ? [{ text: "Don’t Allow", value: "denied" }, { text: "Allow", value: "granted", preferred: true }]
    : name === "notifications" || name === "contacts"
      ? [{ text: "Allow", value: "granted" }, { text: "Don’t allow", value: "denied" }]
      : [{ text: "While using the app", value: "granted" }, { text: "Only this time", value: "granted" }, { text: "Don’t allow", value: "denied" }];
  const answer = await ui.dialog({ kind: "permission", permission: name, title, message: ios ? usageDescription(name) : "", buttons, vertical: !ios });
  const denials = (current?.denials || 0) + (answer === "denied" ? 1 : 0);
  device.permissions[name] = {
    status: answer === "denied" ? "denied" : "granted",
    // iOS asks once. Android asks again after one refusal, then stops.
    canAskAgain: answer === "denied" ? !ios && denials < 2 : true,
    denials,
  };
  emit("permissions", { name });
  return permission(name);
}

/* ── Storage that survives an app restart ────────────────────────────── */
export const stores = {
  async: new Map(),
  secure: new Map(),
  kv: new Map(),
  sqlite: new Map(),
  files: new Map(),
};

export function seedStores(seed = {}) {
  for (const [k, v] of Object.entries(seed.async || {})) stores.async.set(k, typeof v === "string" ? v : JSON.stringify(v));
  for (const [k, v] of Object.entries(seed.secure || {})) stores.secure.set(k, String(v));
  for (const [k, v] of Object.entries(seed.kv || {})) stores.kv.set(k, typeof v === "string" ? v : JSON.stringify(v));
}

/** "Delete the app": everything it stored goes. */
export function clearStores() {
  stores.async.clear();
  stores.secure.clear();
  stores.kv.clear();
  for (const db of stores.sqlite.values()) {
    try {
      db.close();
    } catch {
      /* already closed */
    }
  }
  stores.sqlite.clear();
  stores.files.clear();
}

/* ── Sample media: photos with real dimensions and file sizes ───────────── */
function picture(width, height, label, from, to) {
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">` +
    `<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${from}"/><stop offset="1" stop-color="${to}"/></linearGradient></defs>` +
    `<rect width="100%" height="100%" fill="url(#g)"/>` +
    `<text x="50%" y="50%" fill="#ffffff" font-family="Arial, sans-serif" font-size="${Math.round(Math.min(width, height) / 8)}" text-anchor="middle" dominant-baseline="middle">${label}</text></svg>`;
  return "data:image/svg+xml," + encodeURIComponent(svg);
}

/**
 * A JPEG's size is roughly proportional to its pixel count and quality. The
 * phone uses the same rule everywhere, so compressing or resizing a photo
 * makes its fileSize smaller by a believable, repeatable amount.
 */
export const jpegSize = (width, height, quality = 1) => Math.round(width * height * (0.12 + 0.28 * quality));

const MEDIA = [];
export function registerMedia({ width, height, label, from = "#0f766e", to = "#1e3a8a", quality = 1, fileName, mimeType = "image/jpeg", type = "image" }) {
  const id = MEDIA.length + 1;
  const uri = `file:///var/mobile/Media/${String(id).padStart(4, "0")}-${fileName || "IMG.jpg"}`;
  const item = { id, uri, preview: picture(Math.min(width, 1200), Math.round((Math.min(width, 1200) * height) / width), label, from, to), width, height, fileSize: jpegSize(width, height, quality), fileName: fileName || `IMG_${4000 + id}.JPG`, mimeType, type };
  MEDIA.push(item);
  return item;
}
export const mediaByUri = (uri) => MEDIA.find((m) => m.uri === uri) || null;
/** Other places a picture can live: an upload on the practice server's storage, say. */
export const extraPreviews = new Map();
export const previewOf = (uri) => mediaByUri(uri)?.preview || extraPreviews.get(uri) || uri;

export const GALLERY = [
  registerMedia({ width: 4032, height: 3024, label: "Market", from: "#b45309", to: "#be123c", fileName: "IMG_4101.JPG" }),
  registerMedia({ width: 3024, height: 4032, label: "Portrait", from: "#7c3aed", to: "#db2777", fileName: "IMG_4102.JPG" }),
  registerMedia({ width: 4032, height: 3024, label: "Road", from: "#166534", to: "#65a30d", fileName: "IMG_4103.JPG" }),
  registerMedia({ width: 1080, height: 1080, label: "Square", from: "#0369a1", to: "#0f766e", fileName: "IMG_4104.JPG" }),
];

export const DOCUMENTS = [
  { name: "receipt-march.pdf", mimeType: "application/pdf", size: 184320, uri: "file:///storage/Documents/receipt-march.pdf" },
  { name: "site-photo-notes.txt", mimeType: "text/plain", size: 1240, uri: "file:///storage/Documents/site-photo-notes.txt", text: "Gate 2 is blocked. Water pooling near the drainage." },
  { name: "budget.csv", mimeType: "text/csv", size: 2048, uri: "file:///storage/Documents/budget.csv", text: "item,amount\nRent,150000\nTransport,25000\n" },
];

/* ── The phone's own interface ───────────────────────────────────────── */
const CSS = `
#__phone{position:fixed;inset:0;pointer-events:none;z-index:2147483000;font-family:-apple-system,"SF Pro Text",Roboto,"Segoe UI",Arial,sans-serif}
#__phone *{box-sizing:border-box}
#__phone .ph-status{position:absolute;left:0;right:0;top:0;display:flex;align-items:center;justify-content:space-between;padding:0 28px;font-size:15px;font-weight:600;letter-spacing:.2px}
#__phone .ph-status.android{padding:0 18px;font-size:13px;font-weight:500}
#__phone .ph-status .ph-island{position:absolute;left:50%;top:11px;width:124px;height:36px;margin-left:-62px;border-radius:20px;background:#000}
#__phone .ph-status .ph-camera{position:absolute;left:50%;top:9px;width:14px;height:14px;margin-left:-7px;border-radius:50%;background:#000}
#__phone .ph-home{position:absolute;left:50%;bottom:8px;width:134px;height:5px;margin-left:-67px;border-radius:3px}
#__phone .ph-navbar{position:absolute;left:50%;bottom:9px;width:108px;height:4px;margin-left:-54px;border-radius:2px}
#__phone .ph-scrim{position:absolute;inset:0;background:rgba(0,0,0,.42);pointer-events:auto;display:flex;align-items:center;justify-content:center}
#__phone .ph-dialog{pointer-events:auto;background:#f2f2f7;color:#000;width:270px;border-radius:14px;text-align:center;overflow:hidden}
#__phone .ph-dialog h2{margin:0;padding:19px 16px 2px;font-size:17px;font-weight:600;line-height:1.3}
#__phone .ph-dialog p{margin:0;padding:2px 16px 18px;font-size:13px;line-height:1.35}
#__phone .ph-dialog .ph-btns{display:flex;border-top:.5px solid #c6c6c8}
#__phone .ph-dialog .ph-btns.vertical{flex-direction:column}
#__phone .ph-dialog button{flex:1;min-height:44px;border:0;background:none;font:inherit;font-size:17px;color:#007aff;cursor:pointer}
#__phone .ph-dialog .ph-btns button+button{border-left:.5px solid #c6c6c8}
#__phone .ph-dialog .ph-btns.vertical button+button{border-left:0;border-top:.5px solid #c6c6c8}
#__phone .ph-dialog button.preferred,#__phone .ph-dialog button.cancel{font-weight:600}
#__phone .ph-dialog button.destructive{color:#ff3b30}
#__phone.android .ph-dialog{background:#fff;width:312px;border-radius:28px;text-align:left;padding:8px 0 8px}
#__phone.android .ph-dialog h2{padding:18px 24px 8px;font-size:22px;font-weight:400}
#__phone.android .ph-dialog p{padding:0 24px 16px;font-size:14px;color:#49454f}
#__phone.android .ph-dialog .ph-btns{border:0;justify-content:flex-end;padding:0 16px;gap:4px}
#__phone.android .ph-dialog .ph-btns button{flex:0 0 auto;border:0;padding:0 12px;font-size:14px;font-weight:500;color:#6750a4}
#__phone.android .ph-dialog .ph-btns.vertical{padding:0 16px 8px;gap:8px}
#__phone.android .ph-dialog .ph-btns.vertical button{background:#e8def8;border-radius:20px;color:#1d192b}
#__phone .ph-sheet{position:absolute;left:0;right:0;bottom:0;pointer-events:auto;background:#fff;color:#111;border-radius:14px 14px 0 0;max-height:78%;overflow:auto;padding:12px 16px 40px;box-shadow:0 -8px 30px rgba(0,0,0,.25)}
#__phone .ph-sheet h2{margin:4px 0 12px;font-size:17px;font-weight:600;text-align:center}
#__phone .ph-sheet .ph-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:3px}
#__phone .ph-sheet .ph-grid button{aspect-ratio:1;border:0;padding:0;background-size:cover;background-position:center;cursor:pointer}
#__phone .ph-sheet .ph-row{display:flex;align-items:center;gap:12px;width:100%;min-height:48px;border:0;border-bottom:1px solid #eee;background:none;font:inherit;font-size:16px;text-align:left;cursor:pointer;padding:6px 4px}
#__phone .ph-sheet .ph-cancel{display:block;width:100%;min-height:48px;margin-top:12px;border:0;border-radius:12px;background:#eef0f4;font:inherit;font-size:16px;font-weight:600;color:#007aff;cursor:pointer}
#__phone .ph-browser{position:absolute;inset:0;pointer-events:auto;background:#fff;display:flex;flex-direction:column}
#__phone .ph-browser header{display:flex;align-items:center;gap:8px;padding:8px 12px;border-bottom:1px solid #ddd;font-size:13px}
#__phone .ph-browser header button{min-height:40px;border:0;background:none;color:#007aff;font:inherit;font-size:16px;cursor:pointer}
#__phone .ph-browser header span{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:#555;text-align:center}
#__phone .ph-browser main{flex:1;padding:20px;font-size:15px;line-height:1.5;overflow:auto}
#__phone .ph-browser main button{display:block;width:100%;min-height:48px;margin:10px 0;border:0;border-radius:10px;background:#0f766e;color:#fff;font:inherit;font-size:16px;cursor:pointer}
#__phone .ph-browser main button.alt{background:#eef0f4;color:#111}
#__phone .ph-banner{position:absolute;left:8px;right:8px;pointer-events:auto;background:rgba(245,245,247,.97);color:#000;border-radius:18px;padding:12px 14px;box-shadow:0 6px 24px rgba(0,0,0,.2);cursor:pointer;display:flex;gap:10px;align-items:flex-start}
#__phone .ph-banner .ph-appicon{flex:0 0 38px;height:38px;border-radius:9px;background:linear-gradient(135deg,#0f766e,#1d4ed8);color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700}
#__phone .ph-banner b{display:block;font-size:15px}
#__phone .ph-banner small{display:block;font-size:12px;color:#666}
#__phone .ph-banner p{margin:2px 0 0;font-size:14px;line-height:1.3}
#__phone .ph-toast{position:absolute;left:50%;bottom:90px;transform:translateX(-50%);background:#323232;color:#fff;border-radius:20px;padding:10px 18px;font-size:14px;max-width:80%;text-align:center}
#__phone .ph-keyboard{position:absolute;left:0;right:0;bottom:0;background:#d1d3d9;display:grid;align-content:center;justify-items:center;color:#555;font-size:13px;border-top:1px solid #b8bac0}
#__phone .ph-keyboard .ph-keys{display:grid;grid-template-columns:repeat(10,1fr);gap:6px;width:94%}
#__phone .ph-keyboard .ph-keys span{height:40px;border-radius:6px;background:#fff;box-shadow:0 1px 0 #898a8d;display:flex;align-items:center;justify-content:center;color:#111;font-size:18px}
#__phone .ph-splash{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;pointer-events:auto}
#__phone .ph-splash div{width:96px;height:96px;border-radius:22px;background:rgba(255,255,255,.25);display:flex;align-items:center;justify-content:center;color:#fff;font-size:40px;font-weight:700}
#__phone .ph-bio{pointer-events:auto;background:rgba(30,30,32,.95);color:#fff;width:260px;border-radius:20px;padding:22px;text-align:center}
#__phone .ph-bio .ph-glyph{font-size:44px}
#__phone .ph-bio p{margin:8px 0 14px;font-size:15px}
#__phone .ph-bio button{display:block;width:100%;min-height:42px;margin-top:6px;border:0;border-radius:10px;background:#3a3a3c;color:#fff;font:inherit;cursor:pointer}
#__phone .ph-camera-view{position:absolute;inset:0;background:#111}
`;

let layer = null;
function root() {
  if (layer && layer.isConnected) return layer;
  if (!document.getElementById("__phone-css")) {
    const style = document.createElement("style");
    style.id = "__phone-css";
    style.textContent = CSS;
    (document.head || document.documentElement).appendChild(style);
  }
  layer = document.createElement("div");
  layer.id = "__phone";
  layer.setAttribute("data-phone", device.os);
  document.body.appendChild(layer);
  return layer;
}

function el(tag, props = {}, children = []) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(props)) {
    if (k === "style") Object.assign(node.style, v);
    else if (k.startsWith("on")) node.addEventListener(k.slice(2).toLowerCase(), v);
    else if (k === "text") node.textContent = v;
    else node.setAttribute(k, v);
  }
  for (const c of [].concat(children)) if (c) node.appendChild(typeof c === "string" ? document.createTextNode(c) : c);
  return node;
}

/** The colour of the status bar text: what the app asked for, or the opposite of the theme. */
export function statusBarStyle() {
  const s = device.statusBar.style;
  if (s === "light" || s === "light-content") return "light";
  if (s === "dark" || s === "dark-content") return "dark";
  const auto = device.scheme === "dark" ? "light" : "dark";
  return s === "inverted" ? (auto === "light" ? "dark" : "light") : auto;
}

function drawChrome() {
  const host = root();
  host.className = device.os;
  host.querySelectorAll(".ph-status,.ph-home,.ph-navbar").forEach((n) => n.remove());
  const { insets } = screen();
  const color = statusBarStyle() === "light" ? "#fff" : "#000";
  if (!device.statusBar.hidden && insets.top > 0) {
    const ios = device.os === "ios";
    const bar = el("div", { class: `ph-status ${device.os}`, "data-status-bar": statusBarStyle(), style: { height: `${insets.top}px`, color } }, [
      el("span", { text: device.phone.time }),
      ios ? el("i", { class: "ph-island" }) : el("i", { class: "ph-camera" }),
      el("span", { text: ios ? "▂▄▆ ᯤ ▭" : "▼ ◢ ▮" }),
    ]);
    host.appendChild(bar);
  }
  if (device.os === "ios" && device.orientation === "portrait") host.appendChild(el("i", { class: "ph-home", style: { background: color } }));
  if (device.os === "android") host.appendChild(el("i", { class: "ph-navbar", style: { background: color, opacity: 0.6 } }));
}

/** Redraw the status bar once, after the current render settles. */
let chromeTimer = null;
export function drawChromeLater() {
  if (chromeTimer) return;
  chromeTimer = setTimeout(() => {
    chromeTimer = null;
    if (document.body) drawChrome();
    emit("statusbar", null);
  }, 0);
}

/* Modal surfaces: one at a time, queued, each resolving a promise. */
const queue = [];
let current = null;
function present(build) {
  return new Promise((resolve) => {
    queue.push({ build, resolve });
    if (!current) next();
  });
}
function next() {
  current = queue.shift() || null;
  if (!current) return;
  const host = root();
  const close = (value) => {
    node.remove();
    const done = current;
    current = null;
    done.resolve(value);
    emit("ui", null);
    next();
  };
  const node = current.build(close);
  node.setAttribute("data-phone-modal", node.getAttribute("data-phone-modal") || "1");
  host.appendChild(node);
  emit("ui", null);
}

export const ui = {
  root,
  drawChrome,
  /** A system dialog (Alert or permission). Resolves with the chosen button's value. */
  dialog({ kind = "alert", title, message, buttons, vertical = false, permission: perm }) {
    device.log.alerts.push({ kind, title, message, buttons: buttons.map((b) => b.text) });
    return present((close) =>
      el("div", { class: "ph-scrim", "data-phone-modal": "dialog", "data-kind": kind, ...(perm ? { "data-permission": perm } : {}) }, [
        el("div", { class: "ph-dialog", role: "alertdialog", "aria-label": title || "" }, [
          title ? el("h2", { text: title }) : null,
          message ? el("p", { text: message }) : null,
          el(
            "div",
            { class: `ph-btns ${vertical || buttons.length > 2 ? "vertical" : ""}` },
            buttons.map((b, i) =>
              el("button", {
                type: "button",
                class: [b.style || "", b.preferred ? "preferred" : ""].join(" ").trim(),
                text: device.os === "android" && kind === "alert" ? String(b.text).toUpperCase() : b.text,
                "data-button": b.text,
                onClick: () => close(b.value !== undefined ? b.value : i),
              })
            )
          ),
        ]),
      ])
    );
  },
  /** A bottom sheet: the photo picker, the document picker, the share sheet. */
  sheet({ kind, title, render }) {
    return present((close) => {
      const sheet = el("div", { class: "ph-sheet", role: "dialog", "aria-label": title || kind }, [title ? el("h2", { text: title }) : null]);
      render(sheet, close);
      sheet.appendChild(el("button", { class: "ph-cancel", type: "button", text: "Cancel", "data-button": "Cancel", onClick: () => close(null) }));
      return el("div", { class: "ph-scrim", style: { alignItems: "flex-end" }, "data-phone-modal": "sheet", "data-kind": kind }, [sheet]);
    });
  },
  /** An in-app browser (WebBrowser, or a hosted checkout/sign-in page). */
  browser({ url, kind = "browser", render }) {
    return present((close) => {
      const main = el("main");
      if (render) render(main, close);
      else main.appendChild(el("p", { text: `This page would load ${url} in the phone's browser. The practice phone has no internet, so its contents are not shown.` }));
      return el("div", { class: "ph-browser", "data-phone-modal": "browser", "data-kind": kind, "data-url": url }, [
        el("header", { style: { paddingTop: `${screen().insets.top}px` } }, [
          el("button", { type: "button", text: "Done", "data-button": "Done", onClick: () => close(null) }),
          el("span", { text: url }),
          el("i", { style: { width: "44px" } }),
        ]),
        main,
      ]);
    });
  },
  biometric({ prompt, type }) {
    return present((close) =>
      el("div", { class: "ph-scrim", "data-phone-modal": "biometric" }, [
        el("div", { class: "ph-bio", role: "alertdialog", "aria-label": prompt }, [
          el("div", { class: "ph-glyph", text: type === "fingerprint" ? "◉" : "☺" }),
          el("p", { text: prompt || (type === "fingerprint" ? "Touch the fingerprint sensor" : "Face ID") }),
          el("button", { type: "button", text: "Simulate a match", "data-button": "match", onClick: () => close("success") }),
          el("button", { type: "button", text: "Simulate no match", "data-button": "fail", onClick: () => close("fail") }),
          el("button", { type: "button", text: "Cancel", "data-button": "Cancel", onClick: () => close("cancel") }),
        ]),
      ])
    );
  },
  banner(notification, onTap) {
    const host = root();
    const c = notification.request.content;
    const node = el(
      "div",
      { class: "ph-banner", role: "alert", "data-phone-banner": notification.request.identifier, style: { top: `${screen().insets.top + 4}px` }, onClick: () => { node.remove(); onTap(); } },
      [
        el("span", { class: "ph-appicon", text: (device.app.name || "A")[0] }),
        el("span", {}, [el("small", { text: `${device.app.name.toUpperCase()} · now` }), el("b", { text: c.title || "" }), c.body ? el("p", { text: c.body }) : null]),
      ]
    );
    host.appendChild(node);
    setTimeout(() => node.remove(), 5000);
    emit("ui", null);
  },
  toast(text, long) {
    device.log.toasts.push(text);
    const node = el("div", { class: "ph-toast", role: "status", text });
    root().appendChild(node);
    setTimeout(() => node.remove(), long ? 3500 : 2000);
  },
  /** The simulated on-screen keyboard: it covers the bottom of the screen, as a real one does. */
  keyboard(show, kind = "default") {
    const host = root();
    host.querySelector(".ph-keyboard")?.remove();
    const height = show ? device.phone.keyboard : 0;
    if (show) {
      const digits = /numeric|number|decimal|phone|tel/.test(kind);
      const keys = digits ? "1234567890".split("") : "qwertyuiopasdfghjklzxcvbnm".split("");
      host.appendChild(
        el("div", { class: "ph-keyboard", "data-keyboard": kind, style: { height: `${height}px` }, "aria-hidden": "true" }, [
          el("div", { class: "ph-keys" }, keys.map((k) => el("span", { text: k }))),
          el("div", { text: digits ? "number pad" : kind === "email-address" || kind === "email" ? "keyboard · @ and . keys" : "keyboard" }),
        ])
      );
    }
    if (device.keyboardHeight !== height) {
      device.keyboardHeight = height;
      emit("keyboard", { height });
    }
  },
  splash(config) {
    const host = root();
    host.querySelector(".ph-splash")?.remove();
    if (!config) return;
    host.appendChild(
      el("div", { class: "ph-splash", "data-phone-splash": "1", style: { background: config.backgroundColor || "#ffffff" } }, [
        el("div", { text: (device.app.name || "A")[0], style: { background: "rgba(0,0,0,.18)" } }),
      ])
    );
  },
  camera(node) {
    return node;
  },
  /** What a check can see of the phone's own interface. */
  modal() {
    const node = root().querySelector("[data-phone-modal]:last-of-type") || root().querySelector("[data-phone-modal]");
    if (!node) return null;
    return {
      type: node.getAttribute("data-phone-modal"),
      kind: node.getAttribute("data-kind") || "",
      permission: node.getAttribute("data-permission") || "",
      url: node.getAttribute("data-url") || "",
      title: node.querySelector("h2")?.textContent || node.querySelector("[role=alertdialog]")?.getAttribute("aria-label") || "",
      message: node.querySelector(".ph-dialog p")?.textContent || "",
      buttons: [...node.querySelectorAll("button")].map((b) => b.getAttribute("data-button") || b.textContent),
      node,
    };
  },
  /** Press a button in whatever the phone is showing. */
  tap(label) {
    const m = ui.modal();
    if (!m) return false;
    const want = String(label).toLowerCase();
    const button = [...m.node.querySelectorAll("button")].find(
      (b) => (b.getAttribute("data-button") || "").toLowerCase() === want || b.textContent.trim().toLowerCase() === want
    );
    if (!button) return false;
    button.click();
    return true;
  },
};
