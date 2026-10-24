/**
 * `react-native` AS THE BUNDLED LIBRARIES SEE IT
 *
 * Expo Router, React Navigation, react-native-screens and the other real
 * libraries in the practice runtime import "react-native". The bundler points
 * that at this file: react-native-web (which is how Expo itself runs React
 * Native code on the web), with the parts of a phone the web does not have
 * replaced by the practice phone's own: Linking (deep links), BackHandler
 * (the Android back button), Appearance and useColorScheme (the phone's
 * theme), Keyboard, Alert and the native-module registries some libraries
 * probe for.
 *
 * Platform.OS stays "web" HERE, so the libraries take their web code paths.
 * The learner's code sees the phone's OS instead (rn.js).
 */

import * as RNW from "react-native-web";
import { useSyncExternalStore } from "react";
import { device, emit, on, ui, screen } from "./phone.js";

export * from "react-native-web";

/* ── Native-module registries: present, empty, as in a host without them ── */
export const TurboModuleRegistry = { get: () => null, getEnforcing: () => null };
export const NativeModules = RNW.NativeModules || {};
export const requireNativeComponent = () => RNW.View;
export const codegenNativeComponent = () => RNW.View;
export const codegenNativeCommands = () => ({});
export const UIManager = { ...(RNW.UIManager || {}), getViewManagerConfig: () => null, hasViewManagerConfig: () => false };

/* ── Linking: the phone's URL handling ───────────────────────────────── */
const urlListeners = new Set();
export const linkingState = { initialURL: null };

const schemeOf = (url) => (String(url).match(/^([a-z][a-z0-9+.-]*):/i) || [])[1]?.toLowerCase() || "";

/** Is this https URL one of the app's universal links / Android App Links? */
function claimsUrl(url) {
  const cfg = device.app.config || {};
  let host = "";
  try {
    host = new URL(url).host;
  } catch {
    return false;
  }
  const ios = (cfg.ios?.associatedDomains || []).some((d) => d.replace(/^applinks:/, "") === host);
  const android = (cfg.android?.intentFilters || []).some(
    (f) => f.autoVerify && (f.data || []).some((d) => d.host === host && /^https?$/.test(d.scheme || "https"))
  );
  return device.os === "ios" ? ios : android;
}

/** Deliver a URL to the running app, as the OS does when a link opens it. */
export function deliverURL(url) {
  setTimeout(() => {
    for (const fn of [...urlListeners]) fn({ url });
  }, 0);
}

export const Linking = {
  addEventListener(type, handler) {
    if (type !== "url") return { remove() {} };
    urlListeners.add(handler);
    return { remove: () => urlListeners.delete(handler) };
  },
  removeEventListener(type, handler) {
    urlListeners.delete(handler);
  },
  async getInitialURL() {
    return linkingState.initialURL;
  },
  async canOpenURL(url) {
    const s = schemeOf(url);
    return ["http", "https", "tel", "mailto", "sms", "geo", "maps"].includes(s) || s === device.app.scheme || s === "exp";
  },
  async openURL(url) {
    const s = schemeOf(url);
    device.log.opened.push(String(url));
    emit("opened", { url: String(url) });
    if (s === device.app.scheme || (/^https?$/.test(s) && claimsUrl(url))) {
      deliverURL(String(url));
      return true;
    }
    if (s === "http" || s === "https") {
      ui.toast(`Opened in ${device.os === "ios" ? "Safari" : "Chrome"}: ${url}`);
      return true;
    }
    const apps = { tel: "Phone", mailto: "Mail", sms: "Messages", geo: "Maps", maps: "Maps" };
    if (apps[s]) {
      ui.toast(`Opening ${apps[s]}…`);
      return true;
    }
    throw new Error(`Unable to open URL: ${url}. No app on this phone can open it.`);
  },
  async openSettings() {
    device.log.opened.push("app-settings:");
    emit("opened", { url: "app-settings:" });
    return openSettingsSheet();
  },
  async sendIntent(action) {
    device.log.opened.push(`intent:${action}`);
  },
  async getInitialURLAsync() {
    return linkingState.initialURL;
  },
};

/** The app's page in the phone's Settings, where the user can change a permission. */
export function openSettingsSheet() {
  const names = Object.keys(device.permissions);
  return ui.sheet({
    kind: "settings",
    title: `Settings › ${device.app.name}`,
    render(sheet, close) {
      if (!names.length) {
        const p = document.createElement("p");
        p.textContent = "This app has not asked for any permissions yet.";
        sheet.appendChild(p);
      }
      for (const name of names) {
        const row = document.createElement("button");
        row.type = "button";
        row.className = "ph-row";
        const on = device.permissions[name].status === "granted";
        row.textContent = `${name}: ${on ? "Allowed" : "Not allowed"} — tap to ${on ? "turn off" : "allow"}`;
        row.setAttribute("data-button", `toggle ${name}`);
        row.addEventListener("click", () => {
          const p = device.permissions[name];
          device.permissions[name] = { status: p.status === "granted" ? "denied" : "granted", canAskAgain: false, denials: p.denials };
          emit("permissions", { name });
          close(true);
        });
        sheet.appendChild(row);
      }
    },
  });
}

/* ── BackHandler: the Android back button and gesture ────────────────── */
const backListeners = [];
export const BackHandler = {
  addEventListener(type, handler) {
    if (type !== "hardwareBackPress") return { remove() {} };
    backListeners.push(handler);
    return {
      remove: () => {
        const i = backListeners.lastIndexOf(handler);
        if (i >= 0) backListeners.splice(i, 1);
      },
    };
  },
  removeEventListener(type, handler) {
    const i = backListeners.lastIndexOf(handler);
    if (i >= 0) backListeners.splice(i, 1);
  },
  exitApp() {
    emit("exit", null);
  },
};

/** The user pressed Back. Newest listener first; if none handles it, the app closes. */
export function pressBack() {
  for (let i = backListeners.length - 1; i >= 0; i--) {
    try {
      if (backListeners[i]() === true) return true;
    } catch (err) {
      console.error(err);
    }
  }
  BackHandler.exitApp();
  return false;
}

/* ── Appearance: the phone's light or dark theme ─────────────────────── */
let override = null;
const effectiveScheme = () => {
  const style = device.app.config?.userInterfaceStyle;
  if (override) return override;
  if (style === "light" || style === "dark") return style;
  return device.scheme;
};
export const Appearance = {
  getColorScheme: () => effectiveScheme(),
  setColorScheme(scheme) {
    override = scheme === "light" || scheme === "dark" ? scheme : null;
    emit("scheme", null);
  },
  addChangeListener(fn) {
    const off = on("scheme", () => fn({ colorScheme: effectiveScheme() }));
    return { remove: off };
  },
};
export function useColorScheme() {
  return useSyncExternalStore((cb) => on("scheme", cb), effectiveScheme, effectiveScheme);
}

/* ── Keyboard ────────────────────────────────────────────────────────── */
const keyboardEvents = { keyboardWillShow: "show", keyboardDidShow: "show", keyboardWillHide: "hide", keyboardDidHide: "hide" };
export const Keyboard = {
  addListener(name, fn) {
    const want = keyboardEvents[name];
    if (!want) return { remove() {} };
    const off = on("keyboard", ({ height }) => {
      if ((height > 0) !== (want === "show")) return;
      const { height: h, width } = screen();
      fn({ endCoordinates: { height, width, screenX: 0, screenY: h - height }, duration: 250, easing: "keyboard" });
    });
    return { remove: off };
  },
  dismiss() {
    const active = document.activeElement;
    if (active && /^(INPUT|TEXTAREA)$/.test(active.tagName)) active.blur();
    ui.keyboard(false);
  },
  isVisible: () => device.keyboardHeight > 0,
  metrics: () => (device.keyboardHeight > 0 ? { height: device.keyboardHeight, width: screen().width, screenX: 0, screenY: screen().height - device.keyboardHeight } : undefined),
  removeAllListeners() {},
  scheduleLayoutAnimation() {},
};

/* ── Alert: a native dialog, never the browser's ─────────────────────── */
export const Alert = {
  alert(title, message, buttons, options = {}) {
    const list = buttons && buttons.length ? buttons.slice(0, device.os === "android" ? 3 : 10) : [{ text: "OK" }];
    ui.dialog({
      kind: "alert",
      title: title == null ? "" : String(title),
      message: message == null ? "" : String(message),
      buttons: list.map((b, i) => ({ text: b.text ?? "OK", style: b.style, value: i })),
    }).then((i) => {
      const b = list[i];
      if (b && typeof b.onPress === "function") b.onPress();
      else if (i == null && options.onDismiss) options.onDismiss();
    });
  },
  prompt(title, message, callbackOrButtons) {
    if (device.os !== "ios") {
      console.warn("Alert.prompt is only available on iOS.");
      return;
    }
    Alert.alert(title, message, typeof callbackOrButtons === "function" ? [{ text: "Cancel", style: "cancel" }, { text: "OK", onPress: () => callbackOrButtons("") }] : callbackOrButtons);
  },
};
