/**
 * `react-native` AS THE LEARNER'S CODE SEES IT
 *
 * Everything from rnInternal.js (react-native-web with the phone's Linking,
 * BackHandler, Appearance, Keyboard and Alert), plus what makes the code
 * behave as it does on the phone it runs on:
 *
 *   · Platform.OS is "ios" or "android", so Platform.select and platform
 *     files behave as on a device;
 *   · PixelRatio, StatusBar, SafeAreaView, KeyboardAvoidingView, Share,
 *     Vibration, ToastAndroid, ActionSheetIOS, PermissionsAndroid and
 *     AccessibilityInfo talk to the practice phone;
 *   · Image shows photos the phone's camera and gallery produced.
 *
 * The exported names follow React Native 0.88's public API (Expo SDK 58):
 * InteractionManager and the Touchable root export were removed there, so
 * they are not here either.
 */

import { forwardRef, useEffect, useRef, useState, useSyncExternalStore } from "react";
import * as Base from "./rnInternal.js";
import { device, emit, on, permission, requestPermission, screen, ui, previewOf, drawChromeLater } from "./phone.js";

const RNW = Base;

/* ── Platform ────────────────────────────────────────────────────────── */
export const Platform = {
  get OS() {
    return device.os;
  },
  get Version() {
    return device.os === "ios" ? device.phone.osVersion : device.phone.apiLevel;
  },
  get isPad() {
    return false;
  },
  isTV: false,
  isVision: false,
  isTesting: false,
  get constants() {
    return device.os === "ios"
      ? { systemName: "iOS", osVersion: device.phone.osVersion, interfaceIdiom: "phone", isTesting: false, reactNativeVersion: { major: 0, minor: 88, patch: 0 } }
      : { Version: device.phone.apiLevel, Release: device.phone.osVersion, Model: device.phone.model, Brand: device.phone.brand, Manufacturer: device.phone.manufacturer, isTesting: false, reactNativeVersion: { major: 0, minor: 88, patch: 0 } };
  },
  select(spec) {
    if (!spec) return undefined;
    if (device.os in spec) return spec[device.os];
    if ("native" in spec) return spec.native;
    return spec.default;
  },
};

export const PixelRatio = {
  get: () => device.phone.scale,
  getFontScale: () => device.accessibility.fontScale,
  getPixelSizeForLayoutSize: (size) => Math.round(size * device.phone.scale),
  roundToNearestPixel: (size) => Math.round(size * device.phone.scale) / device.phone.scale,
};

/* ── Images: photos taken or picked on the phone ─────────────────────── */
function resolveSource(source) {
  if (!source) return source;
  if (Array.isArray(source)) return source.map(resolveSource);
  if (typeof source === "string") return { uri: previewOf(source) };
  if (typeof source === "object" && source.uri) return { ...source, uri: previewOf(source.uri) };
  return source;
}
export const Image = forwardRef(function Image(props, ref) {
  return <RNW.Image {...props} ref={ref} source={resolveSource(props.source)} />;
});
Object.assign(Image, {
  getSize: (uri, ok) => RNW.Image.getSize(previewOf(uri), ok),
  prefetch: (uri) => RNW.Image.prefetch(previewOf(uri)),
  resolveAssetSource: (s) => resolveSource(s),
});
export const ImageBackground = forwardRef(function ImageBackground(props, ref) {
  return <RNW.ImageBackground {...props} ref={ref} source={resolveSource(props.source)} />;
});

/* ── StatusBar ───────────────────────────────────────────────────────── */
const barStack = [];
function applyBar() {
  const top = barStack[barStack.length - 1];
  device.statusBar = top ? { style: top.style || "auto", hidden: Boolean(top.hidden) } : { style: "auto", hidden: false };
  drawChromeLater();
}
export function useStatusBarEntry(style, hidden) {
  useEffect(() => {
    const entry = { style, hidden };
    barStack.push(entry);
    applyBar();
    return () => {
      const i = barStack.indexOf(entry);
      if (i >= 0) barStack.splice(i, 1);
      applyBar();
    };
  }, [style, hidden]);
}
function CoreStatusBar({ barStyle = "default", hidden = false }) {
  useStatusBarEntry(barStyle === "default" ? "auto" : barStyle, hidden);
  return null;
}
export const StatusBar = Object.assign(CoreStatusBar, {
  setBarStyle(style) {
    barStack.push({ style: style === "default" ? "auto" : style, hidden: device.statusBar.hidden });
    applyBar();
  },
  setHidden(hidden) {
    barStack.push({ style: device.statusBar.style, hidden });
    applyBar();
  },
  setBackgroundColor() {},
  setTranslucent() {},
  pushStackEntry: (p) => (barStack.push({ style: p.barStyle, hidden: p.hidden }), applyBar(), p),
  popStackEntry: () => (barStack.pop(), applyBar()),
  get currentHeight() {
    return device.os === "android" ? screen().insets.top : undefined;
  },
});

/* ── Safe areas, the core way (iOS only, as on a device) ──────────────── */
export const SafeAreaView = forwardRef(function SafeAreaView({ style, ...rest }, ref) {
  const insets = useSyncExternalStore((cb) => on("screen", cb), () => JSON.stringify(screen().insets));
  const i = JSON.parse(insets);
  const pad = device.os === "ios" ? { paddingTop: i.top, paddingBottom: i.bottom, paddingLeft: i.left, paddingRight: i.right } : null;
  return <RNW.View {...rest} ref={ref} style={[{ flex: 1 }, style, pad]} />;
});

/* ── KeyboardAvoidingView: moves content out of the keyboard's way ──── */
export const KeyboardAvoidingView = forwardRef(function KeyboardAvoidingView(
  { behavior, enabled = true, keyboardVerticalOffset = 0, style, contentContainerStyle, children, ...rest },
  ref
) {
  const box = useRef(null);
  const applied = useRef(false);
  // { shift, height }: how far the view reaches under the keyboard, and its height without it.
  const [avoid, setAvoid] = useState({ shift: 0, height: 0 });
  const shift = avoid.shift;
  useEffect(() => {
    const update = () => {
      const node = box.current;
      if (!node || !enabled || !device.keyboardHeight || !node.getBoundingClientRect) {
        applied.current = false;
        setAvoid({ shift: 0, height: 0 });
        return;
      }
      // Measure once, without our own adjustment (as React Native measures its frame).
      if (applied.current) return;
      const rect = node.getBoundingClientRect();
      // React Native's own rule: how far the view's bottom reaches below the keyboard's top.
      const keyboardY = screen().height - device.keyboardHeight - keyboardVerticalOffset;
      applied.current = true;
      setAvoid({ shift: Math.max(rect.bottom - keyboardY, 0), height: rect.height });
    };
    update();
    return on("keyboard", update);
  }, [enabled, keyboardVerticalOffset]);
  const setRef = (node) => {
    box.current = node;
    if (typeof ref === "function") ref(node);
    else if (ref) ref.current = node;
  };
  const extra = !behavior || !shift ? null : behavior === "padding" ? { paddingBottom: shift } : behavior === "height" ? { height: avoid.height - shift, flex: 0 } : null;
  if (behavior === "position") {
    return (
      <RNW.View {...rest} ref={setRef} style={style}>
        <RNW.View style={[contentContainerStyle, shift ? { bottom: shift } : null]}>{children}</RNW.View>
      </RNW.View>
    );
  }
  return (
    <RNW.View {...rest} ref={setRef} style={[style, extra]}>
      {children}
    </RNW.View>
  );
});

/* ── Share, Vibration, toasts and action sheets ──────────────────────── */
export const Share = {
  sharedAction: "sharedAction",
  dismissedAction: "dismissedAction",
  async share(content = {}, options = {}) {
    if (!content.message && !content.url) throw new Error("At least one of message or url is required");
    const targets = ["Messages", "WhatsApp", "Mail", "Copy"];
    const choice = await ui.sheet({
      kind: "share",
      title: content.title || options.dialogTitle || "Share",
      render(sheet, close) {
        const p = document.createElement("p");
        p.textContent = [content.message, content.url].filter(Boolean).join(" ");
        p.style.cssText = "font-size:14px;color:#444;margin:0 0 10px";
        sheet.appendChild(p);
        for (const t of targets) {
          const b = document.createElement("button");
          b.type = "button";
          b.className = "ph-row";
          b.textContent = t;
          b.setAttribute("data-button", t);
          b.addEventListener("click", () => close(t));
          sheet.appendChild(b);
        }
      },
    });
    device.log.shares.push({ ...content, to: choice });
    emit("share", null);
    if (!choice) return { action: "dismissedAction" };
    if (choice === "Copy") device.clipboard.text = [content.message, content.url].filter(Boolean).join(" ");
    return { action: "sharedAction", activityType: choice };
  },
};

export const Vibration = {
  vibrate(pattern = 400) {
    device.log.vibrations.push(pattern);
    emit("haptic", { kind: "vibrate" });
  },
  cancel() {},
};

export const ToastAndroid = {
  SHORT: 0,
  LONG: 1,
  TOP: 0,
  BOTTOM: 1,
  CENTER: 2,
  show(message, duration) {
    if (device.os !== "android") {
      console.warn("ToastAndroid is not supported on this platform.");
      return;
    }
    ui.toast(String(message), duration === 1);
  },
  showWithGravity(message, duration) {
    ToastAndroid.show(message, duration);
  },
  showWithGravityAndOffset(message, duration) {
    ToastAndroid.show(message, duration);
  },
};

export const ActionSheetIOS = {
  showActionSheetWithOptions({ options = [], cancelButtonIndex, title }, callback) {
    if (device.os !== "ios") throw new Error("ActionSheetIOS is only available on iOS.");
    ui.sheet({
      kind: "actionsheet",
      title: title || "",
      render(sheet, close) {
        options.forEach((text, i) => {
          if (i === cancelButtonIndex) return;
          const b = document.createElement("button");
          b.type = "button";
          b.className = "ph-row";
          b.textContent = text;
          b.setAttribute("data-button", text);
          b.addEventListener("click", () => close(i));
          sheet.appendChild(b);
        });
      },
    }).then((i) => callback(i == null ? (cancelButtonIndex ?? options.length - 1) : i));
  },
  showShareActionSheetWithOptions(options, failure, success) {
    Share.share({ message: options.message, url: options.url }).then((r) => success?.(r.action === "sharedAction", r.activityType));
  },
  dismissActionSheet() {},
};

/* ── Android runtime permissions, mapped onto the phone's permission store ── */
const ANDROID_PERMS = {
  "android.permission.CAMERA": "camera",
  "android.permission.RECORD_AUDIO": "microphone",
  "android.permission.ACCESS_FINE_LOCATION": "location",
  "android.permission.ACCESS_COARSE_LOCATION": "location",
  "android.permission.ACCESS_BACKGROUND_LOCATION": "backgroundLocation",
  "android.permission.POST_NOTIFICATIONS": "notifications",
  "android.permission.READ_MEDIA_IMAGES": "mediaLibrary",
  "android.permission.READ_CONTACTS": "contacts",
};
const PERMISSIONS = Object.fromEntries(Object.keys(ANDROID_PERMS).map((p) => [p.split(".").pop(), p]));
export const PermissionsAndroid = {
  PERMISSIONS,
  RESULTS: { GRANTED: "granted", DENIED: "denied", NEVER_ASK_AGAIN: "never_ask_again" },
  async check(p) {
    return permission(ANDROID_PERMS[p] || p).granted;
  },
  async request(p) {
    if (device.os !== "android") return "denied";
    const r = await requestPermission(ANDROID_PERMS[p] || p);
    return r.granted ? "granted" : r.canAskAgain ? "denied" : "never_ask_again";
  },
  async requestMultiple(list) {
    const out = {};
    for (const p of list) out[p] = await PermissionsAndroid.request(p);
    return out;
  },
};

/* ── Accessibility settings and announcements ────────────────────────── */
export const AccessibilityInfo = {
  isScreenReaderEnabled: async () => device.accessibility.screenReader,
  isReduceMotionEnabled: async () => device.accessibility.reduceMotion,
  isBoldTextEnabled: async () => device.accessibility.boldText,
  isGrayscaleEnabled: async () => false,
  isInvertColorsEnabled: async () => false,
  isReduceTransparencyEnabled: async () => false,
  prefersCrossFadeTransitions: async () => false,
  addEventListener(name, fn) {
    const map = { screenReaderChanged: "screenReader", reduceMotionChanged: "reduceMotion", boldTextChanged: "boldText" };
    const off = on("accessibility", () => map[name] && fn(device.accessibility[map[name]]));
    return { remove: off };
  },
  announceForAccessibility(message) {
    device.log.announcements.push(String(message));
  },
  announceForAccessibilityWithOptions(message) {
    device.log.announcements.push(String(message));
  },
  setAccessibilityFocus() {},
  getRecommendedTimeoutMillis: async (ms) => ms,
};

/* ── AppState: active, or sent to the background ─────────────────────── */
export const AppState = {
  get currentState() {
    return device.appState;
  },
  get isAvailable() {
    return true;
  },
  addEventListener(type, fn) {
    if (type !== "change") return { remove() {} };
    const off = on("appstate", () => fn(device.appState));
    return { remove: off };
  },
};

export const I18nManager = {
  isRTL: false,
  doLeftAndRightSwapInRTL: true,
  allowRTL() {},
  forceRTL() {},
  swapLeftAndRightInRTL() {},
  getConstants: () => ({ isRTL: false, doLeftAndRightSwapInRTL: true, localeIdentifier: device.locale }),
};

export const Settings = { get: () => undefined, set() {}, watchKeys: () => 0, clearWatch() {} };
export const DevSettings = {
  addMenuItem() {},
  reload() {
    emit("reload", null);
  },
};
export const LogBox = { ignoreLogs() {}, ignoreAllLogs() {}, install() {}, uninstall() {} };
export const PlatformColor = (...names) => names[names.length - 1];
export const DynamicColorIOS = ({ light, dark }) => (device.scheme === "dark" ? dark : light);

export function useAnimatedValue(initial, config) {
  const [value] = useState(() => new RNW.Animated.Value(initial, config));
  return value;
}

export const Clipboard = {
  getString: async () => device.clipboard.text,
  setString: (text) => {
    device.clipboard.text = String(text);
  },
};

/* Everything else is react-native-web's, as exported by rnInternal.js. */
export const {
  View, Text, TextInput, ScrollView, FlatList, SectionList, VirtualizedList, Pressable, Switch,
  ActivityIndicator, Modal, RefreshControl, Button, TouchableOpacity, TouchableHighlight,
  TouchableWithoutFeedback, TouchableNativeFeedback, InputAccessoryView, StyleSheet, Animated, Easing,
  Dimensions, useWindowDimensions, PanResponder, LayoutAnimation, Linking, BackHandler, Appearance,
  useColorScheme, Keyboard, Alert, NativeModules, NativeEventEmitter, DeviceEventEmitter, AppRegistry,
  UIManager, findNodeHandle, processColor, unstable_batchedUpdates, TurboModuleRegistry,
  requireNativeComponent, codegenNativeComponent, codegenNativeCommands,
} = Base;
