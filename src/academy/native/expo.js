/**
 * EXPO MODULES ON THE PRACTICE PHONE: APP AND SYSTEM
 *
 * Expo's own modules have native code, so in the practice runtime each one is
 * re-implemented against the practice phone, with the real module's names,
 * argument shapes, result shapes and (where it matters to a learner) its
 * real error and warning messages. The labs' model answers are type-checked
 * against the real packages' TypeScript definitions (Expo SDK 58), so code
 * that works here is code that compiles against the real thing.
 *
 * Hardware (camera, location, notifications...) is in hardware.js; storage
 * (AsyncStorage, SecureStore, SQLite) in storage.js.
 */

import { createElement, forwardRef, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Text, View } from "react-native-web";
import { Image as RNImage } from "./rn.js";
import { useStatusBarEntry } from "./rn.js";
import { Linking, linkingState } from "./rnInternal.js";
import { device, emit, on, screen, ui } from "./phone.js";

const cfg = () => device.app.config || {};
const tick = (ms = 0) => new Promise((r) => setTimeout(r, ms));

/* ── expo-constants ──────────────────────────────────────────────────── */
export const ExecutionEnvironment = { Bare: "bare", Standalone: "standalone", StoreClient: "storeClient" };
export const AppOwnership = { Expo: "expo" };
export const Constants = {
  get expoConfig() {
    return { sdkVersion: "58.0.0", platforms: ["ios", "android"], ...cfg() };
  },
  get manifest2() {
    return null;
  },
  get executionEnvironment() {
    return device.build === "expo-go" ? "storeClient" : "standalone";
  },
  get appOwnership() {
    return device.build === "expo-go" ? "expo" : null;
  },
  get easConfig() {
    const id = cfg().extra?.eas?.projectId;
    return id ? { projectId: id } : null;
  },
  get isDevice() {
    return true;
  },
  get deviceName() {
    return device.phone.model;
  },
  get statusBarHeight() {
    return screen().insets.top;
  },
  get expoVersion() {
    return device.build === "expo-go" ? "58.0.0" : null;
  },
  get linkingUri() {
    return createURL("");
  },
  get platform() {
    return device.os === "ios" ? { ios: { model: device.phone.model, systemVersion: device.phone.osVersion, userInterfaceIdiom: "handset" } } : { android: { versionCode: cfg().android?.versionCode ?? 1 } };
  },
  systemFonts: ["System"],
  sessionId: "practice-session",
  debugMode: true,
  getWebViewUserAgentAsync: async () => "Mozilla/5.0 (Practice Phone)",
};

/* ── expo-linking ────────────────────────────────────────────────────── */
/** In Expo Go a link reaches the project through Expo Go's own exp:// URL. */
export function createURL(path = "", { scheme, queryParams = {}, isTripleSlashed = false } = {}) {
  const clean = String(path).replace(/^\/+/, "");
  const qs = Object.keys(queryParams).length ? "?" + new URLSearchParams(queryParams).toString() : "";
  if (device.build === "expo-go" && !scheme) return `exp://192.168.1.20:8081/--/${clean}${qs}`;
  const s = scheme || device.app.scheme || "myapp";
  return `${s}:${isTripleSlashed ? "///" : "//"}${clean}${qs}`;
}

export function parse(url) {
  const text = String(url);
  const scheme = (text.match(/^([a-z][a-z0-9+.-]*):/i) || [])[1] || null;
  let hostname = null;
  let path = null;
  let queryParams = {};
  const q = text.indexOf("?");
  if (q >= 0) queryParams = Object.fromEntries(new URLSearchParams(text.slice(q + 1).split("#")[0]));
  const body = (q >= 0 ? text.slice(0, q) : text).replace(/^[a-z][a-z0-9+.-]*:\/\//i, "");
  if (body.includes("/--/")) {
    hostname = body.split("/")[0];
    path = body.split("/--/")[1] || null;
  } else if (/^https?$/i.test(scheme || "")) {
    const [host, ...rest] = body.split("/");
    hostname = host;
    path = rest.join("/") || null;
  } else {
    const parts = body.split("/").filter((p, i) => p || i > 0);
    hostname = parts[0] || null;
    path = parts.slice(1).join("/") || null;
  }
  return { scheme, hostname, path, queryParams };
}

let lastURL = null;
Linking.addEventListener("url", ({ url }) => {
  lastURL = url;
  emit("linking-url", null);
});
export function useURL() {
  return useSyncExternalStore((cb) => on("linking-url", cb), () => lastURL ?? linkingState.initialURL, () => null);
}
export const ExpoLinking = {
  createURL,
  parse,
  useURL,
  useLinkingURL: useURL,
  // What a launched app's linking URL is: the link that opened it, or its own scheme's root.
  getLinkingURL: () => lastURL ?? linkingState.initialURL ?? `${device.app.scheme || "myapp"}://`,
  addEventListener: Linking.addEventListener,
  openURL: Linking.openURL,
  canOpenURL: Linking.canOpenURL,
  openSettings: Linking.openSettings,
  getInitialURL: Linking.getInitialURL,
  sendIntent: Linking.sendIntent,
  parseInitialURLAsync: async () => parse((await Linking.getInitialURL()) || createURL("")),
  resolveScheme: () => device.app.scheme,
  hasCustomScheme: () => Boolean(device.app.scheme),
  collectManifestSchemes: () => [].concat(cfg().scheme || []),
  hasConstantsManifest: () => true,
};

/* ── expo-status-bar ─────────────────────────────────────────────────── */
export function StatusBar({ style = "auto", hidden = false }) {
  useStatusBarEntry(style, hidden);
  return null;
}
export const ExpoStatusBar = {
  StatusBar,
  setStatusBarStyle(style) {
    device.statusBar = { ...device.statusBar, style };
    ui.drawChrome();
  },
  setStatusBarHidden(hidden) {
    device.statusBar = { ...device.statusBar, hidden };
    ui.drawChrome();
  },
  setStatusBarBackgroundColor() {},
  setStatusBarNetworkActivityIndicatorVisible() {},
  setStatusBarTranslucent() {},
};

/* ── expo-splash-screen ──────────────────────────────────────────────── */
export const splash = { prevented: false, visible: false, hiddenAt: null };
export function splashConfig() {
  const plugin = (cfg().plugins || []).find((p) => Array.isArray(p) && p[0] === "expo-splash-screen");
  return plugin ? plugin[1] || {} : cfg().splash || null;
}
export const SplashScreen = {
  async preventAutoHideAsync() {
    splash.prevented = true;
    return true;
  },
  async hideAsync() {
    SplashScreen.hide();
  },
  hide() {
    if (!splash.visible) return;
    splash.visible = false;
    splash.hiddenAt = Date.now();
    ui.splash(null);
    emit("splash", null);
  },
  setOptions() {},
};

/* ── expo-font ───────────────────────────────────────────────────────── */
const loadedFonts = new Set();
export const Font = {
  async loadAsync(map) {
    await tick(20);
    for (const name of typeof map === "string" ? [map] : Object.keys(map || {})) loadedFonts.add(name);
  },
  isLoaded: (name) => loadedFonts.has(name),
  isLoading: () => false,
  getLoadedFonts: () => [...loadedFonts],
  unloadAllAsync: async () => loadedFonts.clear(),
  unloadAsync: async (name) => loadedFonts.delete(name),
  useFonts(map) {
    const names = Object.keys(map || {});
    const [loaded, setLoaded] = useState(() => names.every((n) => loadedFonts.has(n)));
    useEffect(() => {
      let live = true;
      Font.loadAsync(map).then(() => live && setLoaded(true));
      return () => {
        live = false;
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return [loaded, null];
  },
  FontDisplay: { AUTO: "auto", SWAP: "swap", BLOCK: "block", FALLBACK: "fallback", OPTIONAL: "optional" },
};

/* ── @expo/vector-icons and expo-symbols ─────────────────────────────────
 * The practice phone has no icon fonts, so each icon is drawn with a
 * stand-in glyph (the real icon set on your phone). The icon's NAME is kept
 * on the element, so checks and screen readers can see which one it is. */
const GLYPHS = {
  home: "⌂", house: "⌂", settings: "⚙", cog: "⚙", gear: "⚙", person: "👤", user: "👤", account: "👤", people: "👥",
  search: "🔍", magnify: "🔍", add: "+", plus: "+", remove: "−", minus: "−", trash: "🗑", delete: "🗑",
  checkmark: "✓", check: "✓", done: "✓", close: "✕", x: "✕", camera: "📷", image: "🖼", images: "🖼", photo: "🖼",
  location: "📍", pin: "📍", "map-marker": "📍", map: "🗺", notifications: "🔔", bell: "🔔", heart: "♥", star: "★",
  "chevron-back": "‹", "chevron-left": "‹", "chevron-forward": "›", "chevron-right": "›", "chevron-down": "⌄", "chevron-up": "⌃",
  "arrow-back": "←", "arrow-left": "←", "arrow-forward": "→", "arrow-right": "→", menu: "☰", list: "☰", reorder: "☰",
  calendar: "📅", cart: "🛒", "shopping-cart": "🛒", mail: "✉", email: "✉", "lock-closed": "🔒", lock: "🔒", "lock-open": "🔓",
  eye: "👁", "eye-off": "🚫", wallet: "👛", cash: "💵", money: "💵", card: "💳", "credit-card": "💳", "pie-chart": "◔", "stats-chart": "📊", "bar-chart": "📊",
  "cloud-upload": "⇪", upload: "⇪", download: "⇩", "cloud-download": "⇩", refresh: "↻", reload: "↻", share: "⇧", "share-social": "⇧", copy: "⧉",
  create: "✎", pencil: "✎", edit: "✎", filter: "⏷", funnel: "⏷", time: "🕒", clock: "🕒", "alert-circle": "⚠", warning: "⚠", alert: "⚠",
  "information-circle": "ℹ", info: "ℹ", "log-out": "⇥", logout: "⇥", "log-in": "⇤", moon: "☾", sunny: "☀", sun: "☀", wifi: "📶",
  call: "📞", phone: "📞", chatbubble: "💬", chat: "💬", document: "📄", "document-text": "📄", file: "📄", folder: "📁",
  "finger-print": "☝", fingerprint: "☝", "scan": "⌗", qrcode: "⌗", "qr-code": "⌗", play: "▶", pause: "⏸", mic: "🎤", "musical-notes": "♪",
  globe: "🌐", language: "🌐", flag: "⚑", bookmark: "🔖", gift: "🎁", pricetag: "🏷", tag: "🏷", "help-circle": "?", help: "?",
  "ellipsis-horizontal": "⋯", "dots-horizontal": "⋯", more: "⋯", grid: "▦", apps: "▦", flash: "⚡", sparkles: "✨", trophy: "🏆", school: "🎓",
};
export function glyphFor(name) {
  const base = String(name || "").replace(/-(outline|sharp|circle|circle-outline|o)$/g, "").replace(/^(ios|md)-/, "");
  return GLYPHS[name] || GLYPHS[base] || GLYPHS[base.split("-")[0]] || "●";
}
function makeIconSet(family) {
  const Icon = forwardRef(function Icon({ name, size = 12, color, style, accessibilityLabel, ...rest }, ref) {
    return createElement(
      Text,
      {
        ...rest,
        ref,
        accessible: Boolean(accessibilityLabel),
        accessibilityLabel,
        "aria-hidden": accessibilityLabel ? undefined : true,
        dataSet: { icon: String(name), iconFamily: family },
        style: [{ fontSize: size, lineHeight: size * 1.15, color, textAlign: "center", minWidth: size }, style],
      },
      glyphFor(name)
    );
  });
  Icon.displayName = family;
  Icon.glyphMap = new Proxy({}, { get: (t, k) => (typeof k === "string" ? 1 : undefined), has: () => true });
  Icon.Button = function IconButton({ name, children, onPress, ...rest }) {
    return createElement(View, { role: "button", onClick: onPress, style: { flexDirection: "row", alignItems: "center", gap: 6 } }, createElement(Icon, { name, ...rest }), children ? createElement(Text, null, children) : null);
  };
  Icon.loadFont = async () => {};
  Icon.hasIcon = () => true;
  Icon.getRawGlyphMap = () => ({});
  Icon.getFontFamily = () => family;
  return Icon;
}
const FAMILIES = ["Ionicons", "MaterialIcons", "MaterialCommunityIcons", "FontAwesome", "FontAwesome5", "FontAwesome6", "Feather", "AntDesign", "Entypo", "EvilIcons", "Octicons", "SimpleLineIcons", "Foundation", "Zocial", "Fontisto"];
export const VectorIcons = Object.fromEntries(FAMILIES.map((f) => [f, makeIconSet(f)]));
VectorIcons.createIconSet = (map, family) => makeIconSet(family || "Custom");

export function SymbolView({ name, size = 24, tintColor, style, fallback }) {
  const n = typeof name === "object" ? name[device.os] || name.web || Object.values(name)[0] : name;
  if (!n && fallback) return fallback;
  return createElement(Text, { "aria-hidden": true, dataSet: { icon: String(n), iconFamily: "SF Symbols" }, style: [{ fontSize: size, color: tintColor, lineHeight: size * 1.15 }, style] }, glyphFor(String(n).split(".")[0]));
}

/* ── expo-image ──────────────────────────────────────────────────────── */
const FIT = { cover: "cover", contain: "contain", fill: "stretch", none: "center", "scale-down": "contain" };
export const ExpoImage = forwardRef(function ExpoImage(props, ref) {
  // placeholder and transition are visual niceties of expo-image; the phone shows the image directly.
  const { source, contentFit = "cover", alt, accessibilityLabel, style, ...rest } = props;
  delete rest.placeholder;
  delete rest.transition;
  const src = typeof source === "string" ? { uri: source } : source;
  return <RNImage {...rest} ref={ref} source={src} resizeMode={FIT[contentFit] || "cover"} accessibilityLabel={accessibilityLabel || alt} style={style} />;
});
ExpoImage.prefetch = async () => true;
ExpoImage.clearMemoryCache = async () => true;
ExpoImage.clearDiskCache = async () => true;

/* ── expo-linear-gradient ────────────────────────────────────────────── */
export const LinearGradient = forwardRef(function LinearGradient({ colors = [], start, end, locations, style, children, ...rest }, ref) {
  const node = useRef(null);
  const s = Array.isArray(start) ? { x: start[0], y: start[1] } : start || { x: 0.5, y: 0 };
  const e = Array.isArray(end) ? { x: end[0], y: end[1] } : end || { x: 0.5, y: 1 };
  const angle = Math.round(((Math.atan2(e.x - s.x, -(e.y - s.y)) * 180) / Math.PI + 360) % 360);
  const stops = colors.map((c, i) => (locations && locations[i] != null ? `${c} ${Math.round(locations[i] * 100)}%` : c)).join(", ");
  useEffect(() => {
    if (node.current?.style) node.current.style.backgroundImage = colors.length > 1 ? `linear-gradient(${angle}deg, ${stops})` : "";
  });
  const setRef = (n) => {
    node.current = n;
    if (typeof ref === "function") ref(n);
    else if (ref) ref.current = n;
  };
  return (
    <View {...rest} ref={setRef} dataSet={{ gradient: colors.join(",") }} style={[colors.length === 1 ? { backgroundColor: colors[0] } : null, style]}>
      {children}
    </View>
  );
});

/* ── expo-haptics ────────────────────────────────────────────────────── */
export const ImpactFeedbackStyle = { Light: "light", Medium: "medium", Heavy: "heavy", Soft: "soft", Rigid: "rigid" };
export const NotificationFeedbackType = { Success: "success", Warning: "warning", Error: "error" };
export const AndroidHaptics = { Confirm: "confirm", Reject: "reject", Gesture_Start: "gesture-start", Gesture_End: "gesture-end", Toggle_On: "toggle-on", Toggle_Off: "toggle-off", Clock_Tick: "clock-tick", Context_Click: "context-click", Keyboard_Press: "keyboard-press", Long_Press: "long-press", Virtual_Key: "virtual-key" };
function buzz(kind) {
  device.log.haptics.push(kind);
  emit("haptic", { kind });
}
export const Haptics = {
  ImpactFeedbackStyle,
  NotificationFeedbackType,
  AndroidHaptics,
  impactAsync: async (style = "medium") => buzz(`impact:${style}`),
  notificationAsync: async (type = "success") => buzz(`notification:${type}`),
  selectionAsync: async () => buzz("selection"),
  performAndroidHapticsAsync: async (type) => buzz(`android:${type}`),
};

/* ── expo-clipboard ──────────────────────────────────────────────────── */
const clipListeners = new Set();
function setClip(text) {
  device.clipboard.text = String(text);
  device.log.clipboard.push(String(text));
  for (const fn of clipListeners) fn({ contentTypes: ["plain-text"] });
}
export const Clipboard = {
  ContentType: { PLAIN_TEXT: "plain-text", HTML: "html", IMAGE: "image", URL: "url" },
  StringFormat: { PLAIN_TEXT: "plainText", HTML: "html" },
  setStringAsync: async (text) => (setClip(text), true),
  setString: (text) => setClip(text),
  getStringAsync: async () => device.clipboard.text,
  hasStringAsync: async () => device.clipboard.text.length > 0,
  setUrlAsync: async (url) => setClip(url),
  getUrlAsync: async () => (/^https?:/.test(device.clipboard.text) ? device.clipboard.text : null),
  hasUrlAsync: async () => /^https?:/.test(device.clipboard.text),
  setImageAsync: async (b64) => {
    device.clipboard.image = b64;
  },
  getImageAsync: async () => (device.clipboard.image ? { data: device.clipboard.image, size: { width: 1, height: 1 } } : null),
  hasImageAsync: async () => Boolean(device.clipboard.image),
  addClipboardListener: (fn) => (clipListeners.add(fn), { remove: () => clipListeners.delete(fn) }),
  removeClipboardListener: (sub) => sub?.remove?.(),
  isPasteButtonAvailable: false,
};

/* ── expo-device and expo-application ────────────────────────────────── */
export const DeviceType = { UNKNOWN: 0, PHONE: 1, TABLET: 2, DESKTOP: 3, TV: 4 };
export const Device = {
  DeviceType,
  get isDevice() {
    return true;
  },
  get brand() {
    return device.phone.brand;
  },
  get manufacturer() {
    return device.phone.manufacturer;
  },
  get modelName() {
    return device.phone.model;
  },
  get modelId() {
    return device.os === "ios" ? "iPhone17,3" : null;
  },
  get designName() {
    return device.os === "android" ? "tokay" : null;
  },
  get productName() {
    return device.os === "android" ? "tokay" : null;
  },
  get deviceName() {
    return device.os === "ios" ? "iPhone" : device.phone.model;
  },
  get deviceType() {
    return DeviceType.PHONE;
  },
  get deviceYearClass() {
    return 2024;
  },
  get totalMemory() {
    return 8 * 1024 ** 3;
  },
  get osName() {
    return device.phone.osName;
  },
  get osVersion() {
    return device.phone.osVersion;
  },
  get osBuildId() {
    return device.os === "ios" ? "24A335" : "BP2A.250605.031";
  },
  get platformApiLevel() {
    return device.phone.apiLevel;
  },
  get supportedCpuArchitectures() {
    return ["arm64-v8a"];
  },
  getDeviceTypeAsync: async () => DeviceType.PHONE,
  getUptimeAsync: async () => 3600000,
  getMaxMemoryAsync: async () => 512 * 1024 ** 2,
  isRootedExperimentalAsync: async () => false,
  isSideLoadingEnabledAsync: async () => false,
  getPlatformFeaturesAsync: async () => [],
  hasPlatformFeatureAsync: async () => false,
};

/** Inside Expo Go, the app's identity is Expo Go's own; a real build has the app's. */
export const Application = {
  get applicationName() {
    return device.build === "expo-go" ? "Expo Go" : cfg().name || device.app.name;
  },
  get applicationId() {
    if (device.build === "expo-go") return "host.exp.Exponent";
    return device.os === "ios" ? cfg().ios?.bundleIdentifier ?? null : cfg().android?.package ?? null;
  },
  get nativeApplicationVersion() {
    return device.build === "expo-go" ? "58.0.0" : cfg().version || "1.0.0";
  },
  get nativeBuildVersion() {
    if (device.build === "expo-go") return "1";
    return device.os === "ios" ? String(cfg().ios?.buildNumber ?? "1") : String(cfg().android?.versionCode ?? 1);
  },
  ApplicationReleaseType: { UNKNOWN: 0, SIMULATOR: 1, ENTERPRISE: 2, DEVELOPMENT: 3, AD_HOC: 4, APP_STORE: 5 },
  getInstallationTimeAsync: async () => new Date("2026-10-01T09:00:00Z"),
  getLastUpdateTimeAsync: async () => new Date("2026-10-01T09:00:00Z"),
  getAndroidId: () => (device.os === "android" ? "a1b2c3d4e5f60718" : null),
  getIosIdForVendorAsync: async () => (device.os === "ios" ? "8F3C2D41-6A0B-4E0F-9B56-7E3C4A1D2B90" : null),
  getIosApplicationReleaseTypeAsync: async () => 3,
  getIosPushNotificationServiceEnvironmentAsync: async () => "development",
  getInstallReferrerAsync: async () => "utm_source=google-play&utm_medium=organic",
};

/* ── expo-localization ───────────────────────────────────────────────── */
const CURRENCY = { NG: "NGN", US: "USD", GB: "GBP", FR: "EUR", DE: "EUR", ES: "EUR", IT: "EUR", KE: "KES", GH: "GHS", ZA: "ZAR", IN: "INR", CA: "CAD", JP: "JPY", BR: "BRL", EG: "EGP", SA: "SAR", AE: "AED" };
function localeInfo(tag) {
  const [languageCode, ...rest] = tag.split("-");
  const regionCode = rest.find((p) => /^[A-Z]{2}$/.test(p)) || null;
  const currencyCode = CURRENCY[regionCode] || null;
  const parts = new Intl.NumberFormat(tag, currencyCode ? { style: "currency", currency: currencyCode } : {}).formatToParts(12345.6);
  const sym = parts.find((p) => p.type === "currency")?.value || null;
  return {
    languageTag: tag,
    languageCode,
    languageScriptCode: null,
    regionCode,
    languageRegionCode: regionCode,
    currencyCode,
    currencySymbol: sym,
    languageCurrencyCode: currencyCode,
    languageCurrencySymbol: sym,
    decimalSeparator: parts.find((p) => p.type === "decimal")?.value || ".",
    digitGroupingSeparator: parts.find((p) => p.type === "group")?.value || ",",
    textDirection: ["ar", "he", "fa", "ur"].includes(languageCode) ? "rtl" : "ltr",
    measurementSystem: regionCode === "US" ? "us" : regionCode === "GB" ? "uk" : "metric",
    temperatureUnit: regionCode === "US" ? "fahrenheit" : "celsius",
  };
}
export const Localization = {
  getLocales: () => [localeInfo(device.locale)],
  getCalendars: () => [{ calendar: "gregory", timeZone: device.timeZone, uses24hourClock: !/^en-(US|NG|GB)$/.test(device.locale), firstWeekday: device.locale.endsWith("US") ? 1 : 2 }],
  useLocales: () => Localization.getLocales(),
  useCalendars: () => Localization.getCalendars(),
  addLocaleListener: () => ({ remove() {} }),
  addCalendarListener: () => ({ remove() {} }),
  removeSubscription: () => {},
};

/* ── expo-web-browser: in-app browser and sign-in / checkout sessions ─── */
export const WebBrowserResultType = { CANCEL: "cancel", DISMISS: "dismiss", OPENED: "opened", LOCKED: "locked" };
export const pageHandlers = { list: [] };
function pageFor(url) {
  for (const p of pageHandlers.list) {
    const m = p.match(url);
    if (m) return p.render(m, url);
  }
  return null;
}
export const WebBrowser = {
  WebBrowserResultType,
  async openBrowserAsync(url) {
    device.log.browser.push(String(url));
    emit("browser", null);
    const shown = ui.browser({ url: String(url) });
    if (device.os === "android") return { type: "opened" };
    await shown;
    return { type: "cancel" };
  },
  /**
   * A sign-in or hosted-checkout page. The page (from the lab's practice
   * server, or a generic sign-in page) ends by redirecting to redirectUrl,
   * which hands the result back to the app, as a real auth session does.
   */
  async openAuthSessionAsync(url, redirectUrl) {
    device.log.browser.push(String(url));
    emit("browser", null);
    const page = pageFor(String(url)) || {
      title: "Sign in",
      body: "This is a sign-in page from another service. On a real phone you would sign in here.",
      buttons: [{ label: "Continue", redirect: `${redirectUrl}${String(redirectUrl).includes("?") ? "&" : "?"}code=practice-auth-code` }],
    };
    const result = await ui.browser({
      url: String(url),
      kind: "auth",
      render(main, close) {
        const h = document.createElement("h3");
        h.textContent = page.title;
        main.appendChild(h);
        const p = document.createElement("p");
        p.textContent = page.body;
        main.appendChild(p);
        page.buttons.forEach((b, i) => {
          const btn = document.createElement("button");
          btn.type = "button";
          btn.textContent = b.label;
          btn.setAttribute("data-button", b.label);
          if (i > 0) btn.className = "alt";
          // A page button can do something on the server's side (run) before redirecting.
          btn.addEventListener("click", async () => {
            try {
              await b.run?.();
            } catch (err) {
              console.error(err);
            }
            close(b.redirect);
          });
          main.appendChild(btn);
        });
      },
    });
    if (!result) return { type: "cancel" };
    return { type: "success", url: result };
  },
  dismissBrowser: async () => ({ type: "dismiss" }),
  dismissAuthSession: () => {},
  maybeCompleteAuthSession: () => ({ type: "failed", message: "Not supported on this platform" }),
  warmUpAsync: async () => ({}),
  coolDownAsync: async () => ({}),
  mayInitWithUrlAsync: async () => ({}),
  getCustomTabsSupportingBrowsersAsync: async () => ({ browserPackages: ["com.android.chrome"], defaultBrowserPackage: "com.android.chrome", servicePackages: [], preferredBrowserPackage: "com.android.chrome" }),
  WebBrowserPresentationStyle: { FULL_SCREEN: "fullScreen", PAGE_SHEET: "pageSheet", FORM_SHEET: "formSheet", AUTOMATIC: "automatic", OVER_FULL_SCREEN: "overFullScreen", OVER_CURRENT_CONTEXT: "overCurrentContext", POPOVER: "popover" },
};

/* ── expo-updates: over-the-air updates ─────────────────────────────── */
export const updatesState = { updateId: null, applied: null, fetched: null };
const updatesEnabled = () => device.build === "production";
function runtimeVersion() {
  const rv = cfg().runtimeVersion;
  if (typeof rv === "string") return rv;
  if (rv && rv.policy === "appVersion") return cfg().version || "1.0.0";
  if (rv && rv.policy) return `${rv.policy}:${cfg().version || "1.0.0"}`;
  return cfg().version || "1.0.0";
}
// expo-updates' own messages: its JavaScript API only works in a release build.
const MANUAL =
  "To test usage of the expo-updates JS API in your app, make a release build with `npx expo run:ios --configuration Release` or `npx expo run:android --variant Release`.";
const notInGo = (fn) => {
  const what = { checkForUpdateAsync: "check for updates", fetchUpdateAsync: "fetch updates" }[fn];
  const err = new Error(what ? `You cannot ${what} in development mode. ${MANUAL}` : `You cannot use the Updates module in development mode in a production app. ${MANUAL}`);
  err.code = "ERR_UPDATES_DISABLED";
  return err;
};
export const Updates = {
  get isEnabled() {
    return updatesEnabled();
  },
  get channel() {
    return updatesEnabled() ? device.updates.channel || "production" : null;
  },
  get runtimeVersion() {
    return updatesEnabled() ? runtimeVersion() : null;
  },
  get updateId() {
    return updatesEnabled() ? updatesState.updateId || "embedded-0001" : null;
  },
  get isEmbeddedLaunch() {
    return !updatesState.applied;
  },
  get createdAt() {
    return updatesEnabled() ? new Date("2026-10-01T09:00:00Z") : null;
  },
  isEmergencyLaunch: false,
  checkAutomatically: "ON_LOAD",
  async checkForUpdateAsync() {
    if (!updatesEnabled()) throw notInGo("checkForUpdateAsync");
    await tick(150);
    const available = device.updates.available && !updatesState.applied;
    return available
      ? { isAvailable: true, manifest: { id: "ota-0002", runtimeVersion: runtimeVersion(), extra: { message: device.updates.message } }, isRollBackToEmbedded: false }
      : { isAvailable: false, isRollBackToEmbedded: false, reason: "updateRejectedBySelectionPolicy" };
  },
  async fetchUpdateAsync() {
    if (!updatesEnabled()) throw notInGo("fetchUpdateAsync");
    await tick(150);
    updatesState.fetched = device.updates.available ? "ota-0002" : null;
    return { isNew: Boolean(updatesState.fetched), manifest: updatesState.fetched ? { id: "ota-0002" } : undefined, isRollBackToEmbedded: false };
  },
  async reloadAsync() {
    if (!updatesEnabled()) throw notInGo("reloadAsync");
    if (updatesState.fetched) {
      updatesState.applied = updatesState.fetched;
      updatesState.updateId = updatesState.fetched;
    }
    emit("reload", null);
  },
  useUpdates() {
    const [, force] = useState(0);
    useEffect(() => on("updates", () => force((n) => n + 1)), []);
    return {
      currentlyRunning: { updateId: Updates.updateId, channel: Updates.channel, runtimeVersion: Updates.runtimeVersion, isEmbeddedLaunch: Updates.isEmbeddedLaunch, isEmergencyLaunch: false },
      isUpdateAvailable: updatesEnabled() && device.updates.available && !updatesState.applied,
      isUpdatePending: Boolean(updatesState.fetched && !updatesState.applied),
      isChecking: false,
      isDownloading: false,
      availableUpdate: device.updates.available ? { updateId: "ota-0002" } : undefined,
    };
  },
  addUpdatesStateChangeListener: () => ({ remove() {} }),
  readLogEntriesAsync: async () => [],
  clearLogEntriesAsync: async () => {},
};

/* ── expo-crypto (no secure context needed) ──────────────────────────── */
/** SHA-256 of a string (UTF-8) or of bytes, as hex. */
function sha256Hex(text) {
  const bytes = typeof text === "string" ? new TextEncoder().encode(text) : text;
  const K = new Uint32Array([0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5, 0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174, 0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da, 0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967, 0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85, 0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070, 0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3, 0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2]);
  const H = new Uint32Array([0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19]);
  const len = bytes.length;
  const padded = new Uint8Array(((len + 9 + 63) >> 6) << 6);
  padded.set(bytes);
  padded[len] = 0x80;
  const bits = len * 8;
  const view = new DataView(padded.buffer);
  view.setUint32(padded.length - 4, bits >>> 0);
  view.setUint32(padded.length - 8, Math.floor(bits / 2 ** 32));
  const W = new Uint32Array(64);
  const rotr = (x, n) => (x >>> n) | (x << (32 - n));
  for (let off = 0; off < padded.length; off += 64) {
    for (let i = 0; i < 16; i++) W[i] = view.getUint32(off + i * 4);
    for (let i = 16; i < 64; i++) {
      const s0 = rotr(W[i - 15], 7) ^ rotr(W[i - 15], 18) ^ (W[i - 15] >>> 3);
      const s1 = rotr(W[i - 2], 17) ^ rotr(W[i - 2], 19) ^ (W[i - 2] >>> 10);
      W[i] = (W[i - 16] + s0 + W[i - 7] + s1) >>> 0;
    }
    let [a, b, c, d, e, f, g, h] = H;
    for (let i = 0; i < 64; i++) {
      const t1 = (h + (rotr(e, 6) ^ rotr(e, 11) ^ rotr(e, 25)) + ((e & f) ^ (~e & g)) + K[i] + W[i]) >>> 0;
      const t2 = ((rotr(a, 2) ^ rotr(a, 13) ^ rotr(a, 22)) + ((a & b) ^ (a & c) ^ (b & c))) >>> 0;
      h = g;
      g = f;
      f = e;
      e = (d + t1) >>> 0;
      d = c;
      c = b;
      b = a;
      a = (t1 + t2) >>> 0;
    }
    H[0] += a; H[1] += b; H[2] += c; H[3] += d; H[4] += e; H[5] += f; H[6] += g; H[7] += h;
  }
  return [...H].map((x) => x.toString(16).padStart(8, "0")).join("");
}
export { sha256Hex };
function randomBytes(n) {
  const out = new Uint8Array(n);
  crypto.getRandomValues(out);
  return out;
}
export const ExpoCrypto = {
  CryptoDigestAlgorithm: { SHA1: "SHA-1", SHA256: "SHA-256", SHA384: "SHA-384", SHA512: "SHA-512", MD2: "MD2", MD4: "MD4", MD5: "MD5" },
  CryptoEncoding: { HEX: "hex", BASE64: "base64" },
  randomUUID() {
    const b = randomBytes(16);
    b[6] = (b[6] & 0x0f) | 0x40;
    b[8] = (b[8] & 0x3f) | 0x80;
    const h = [...b].map((x) => x.toString(16).padStart(2, "0")).join("");
    return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`;
  },
  getRandomBytes: randomBytes,
  getRandomBytesAsync: async (n) => randomBytes(n),
  getRandomValues: (arr) => crypto.getRandomValues(arr),
  async digestStringAsync(algorithm, data, options = {}) {
    if (algorithm !== "SHA-256") throw new Error(`The practice phone supports SHA-256 only (asked for ${algorithm}).`);
    const hex = sha256Hex(String(data));
    if (options.encoding === "base64") return btoa(hex.match(/../g).map((x) => String.fromCharCode(parseInt(x, 16))).join(""));
    return hex;
  },
};

/* ── Network state: @react-native-community/netinfo and expo-network ─── */
function netState() {
  const online = device.online;
  return {
    type: online ? "wifi" : "none",
    isConnected: online,
    isInternetReachable: online,
    isWifiEnabled: true,
    details: online ? { isConnectionExpensive: false, ssid: null, bssid: null, strength: 80, ipAddress: "192.168.1.20", subnet: "255.255.255.0", frequency: 5180, linkSpeed: 433 } : null,
  };
}
export const NetInfoStateType = { unknown: "unknown", none: "none", cellular: "cellular", wifi: "wifi", bluetooth: "bluetooth", ethernet: "ethernet", wimax: "wimax", vpn: "vpn", other: "other" };
export const NetInfo = {
  fetch: async () => netState(),
  refresh: async () => netState(),
  addEventListener(fn) {
    setTimeout(() => fn(netState()), 0);
    return on("network", () => fn(netState()));
  },
  configure() {},
  useNetInfo() {
    const snap = useSyncExternalStore((cb) => on("network", cb), () => device.online);
    return { ...netState(), isConnected: snap, isInternetReachable: snap };
  },
  NetInfoStateType,
};
export const NetworkStateType = { UNKNOWN: "UNKNOWN", NONE: "NONE", CELLULAR: "CELLULAR", WIFI: "WIFI", BLUETOOTH: "BLUETOOTH", ETHERNET: "ETHERNET", WIMAX: "WIMAX", VPN: "VPN", OTHER: "OTHER" };
const expoNet = () => ({ type: device.online ? "WIFI" : "NONE", isConnected: device.online, isInternetReachable: device.online });
export const ExpoNetwork = {
  NetworkStateType,
  getNetworkStateAsync: async () => expoNet(),
  getIpAddressAsync: async () => "192.168.1.20",
  isAirplaneModeEnabledAsync: async () => !device.online,
  addNetworkStateListener: (fn) => ({ remove: on("network", () => fn(expoNet())) }),
  useNetworkState() {
    useSyncExternalStore((cb) => on("network", cb), () => device.online);
    return expoNet();
  },
};
