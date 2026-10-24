/**
 * EXPO MODULES ON THE PRACTICE PHONE: DEVICE HARDWARE
 *
 * Camera, photo library, image manipulation, files, location and maps,
 * notifications (local and push), documents, sharing, biometrics and
 * background tasks, each with the real module's API and result shapes. The
 * phone asks the user for permission exactly when the real one would, a
 * refusal is remembered as it is on iOS and Android, and photos have real
 * dimensions and file sizes, so compressing one really makes it smaller.
 */

import { createElement, forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from "react";
import { Pressable, Text, View } from "react-native-web";
import {
  DOCUMENTS, GALLERY, device, emit, jpegSize, mediaByUri, on, permission, previewOf, registerMedia, requestPermission, stores, ui,
} from "./phone.js";
import { deliverURL } from "./rnInternal.js";

const tick = (ms = 0) => new Promise((r) => setTimeout(r, ms));
const PermissionStatus = { GRANTED: "granted", DENIED: "denied", UNDETERMINED: "undetermined" };
const coded = (code, message) => Object.assign(new Error(message), { code });

/** The [status, request, get] hook every Expo permission module offers. */
function permissionHook(name) {
  return function usePermission(options = {}) {
    const [status, setStatus] = useState(null);
    useEffect(() => {
      let live = true;
      const read = () => live && setStatus(permission(name));
      if (options.get !== false) setTimeout(read, 0);
      if (options.request) requestPermission(name).then(read);
      const off = on("permissions", read);
      return () => {
        live = false;
        off();
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const request = useCallback(async () => {
      const r = await requestPermission(name);
      setStatus(r);
      return r;
    }, []);
    const get = useCallback(async () => {
      const r = permission(name);
      setStatus(r);
      return r;
    }, []);
    return [status, request, get];
  };
}

/* ── Photo assets as the picker and camera return them ───────────────── */
function asset(media, { quality = 1, base64 = false, exif = false, crop = null } = {}) {
  const width = crop ? crop.width : media.width;
  const height = crop ? crop.height : media.height;
  const out = crop || quality < 1 ? registerMedia({ width, height, label: media.fileName.replace(/\..*$/, ""), quality, fileName: media.fileName }) : media;
  return {
    assetId: String(media.id),
    uri: out.uri,
    width,
    height,
    type: "image",
    fileName: media.fileName,
    fileSize: jpegSize(width, height, quality),
    mimeType: "image/jpeg",
    exif: exif ? { Orientation: 1, Make: device.phone.manufacturer, Model: device.phone.model } : null,
    base64: base64 ? "/9j/4AAQSkZJRgABAQAAAQABAAD" : null,
    duration: null,
  };
}

function cropTo(media, aspect) {
  if (!aspect) return null;
  const [aw, ah] = aspect;
  const scale = Math.min(media.width / aw, media.height / ah);
  return { width: Math.round(aw * scale), height: Math.round(ah * scale) };
}

async function pickFromGallery(options = {}) {
  const multiple = Boolean(options.allowsMultipleSelection);
  const limit = options.selectionLimit || 0;
  const chosen = await ui.sheet({
    kind: "photo-picker",
    title: device.os === "ios" ? "Photos" : "Select photos",
    render(sheet, close) {
      const grid = document.createElement("div");
      grid.className = "ph-grid";
      const picked = [];
      GALLERY.forEach((m, i) => {
        const b = document.createElement("button");
        b.type = "button";
        b.style.backgroundImage = `url("${m.preview}")`;
        b.setAttribute("aria-label", `Photo ${i + 1}, ${m.width} by ${m.height}`);
        b.setAttribute("data-button", `photo ${i + 1}`);
        b.addEventListener("click", () => {
          if (!multiple) return close([i]);
          const at = picked.indexOf(i);
          if (at >= 0) picked.splice(at, 1);
          else if (!limit || picked.length < limit) picked.push(i);
          b.style.outline = picked.includes(i) ? "3px solid #007aff" : "";
        });
        grid.appendChild(b);
      });
      sheet.appendChild(grid);
      if (multiple) {
        const add = document.createElement("button");
        add.type = "button";
        add.className = "ph-cancel";
        add.textContent = "Add";
        add.setAttribute("data-button", "Add");
        add.addEventListener("click", () => close(picked.slice()));
        sheet.appendChild(add);
      }
    },
  });
  if (!chosen || !chosen.length) return { canceled: true, assets: null };
  return {
    canceled: false,
    assets: chosen.map((i) => {
      const m = GALLERY[i];
      return asset(m, { quality: options.quality ?? 1, base64: options.base64, exif: options.exif, crop: options.allowsEditing ? cropTo(m, options.aspect) : null });
    }),
  };
}

function newPhoto(facing = "back") {
  const ios = device.os === "ios";
  const front = facing === "front";
  return registerMedia({
    width: front ? 3088 : ios ? 4032 : 4000,
    height: front ? 2316 : ios ? 3024 : 3000,
    label: front ? "Selfie" : "Camera",
    from: "#334155",
    to: "#0f172a",
    fileName: `IMG_${5000 + Math.floor(Math.random() * 900)}.JPG`,
  });
}

/* ── expo-image-picker ───────────────────────────────────────────────── */
export const ImagePicker = {
  MediaTypeOptions: { All: "All", Images: "Images", Videos: "Videos", Livephotos: "Livephotos" },
  CameraType: { back: "back", front: "front" },
  UIImagePickerPresentationStyle: { FULL_SCREEN: "fullScreen", PAGE_SHEET: "pageSheet", FORM_SHEET: "formSheet", AUTOMATIC: "automatic" },
  PermissionStatus,
  // Picking from the library uses the system photo picker, which needs no permission.
  launchImageLibraryAsync: (options) => pickFromGallery(options),
  async launchCameraAsync(options = {}) {
    if (!permission("camera").granted) throw coded("ERR_MISSING_CAMERA_PERMISSION", "Missing camera or camera roll permission");
    const shot = await ui.sheet({
      kind: "camera",
      title: "Camera",
      render(sheet, close) {
        const view = document.createElement("div");
        view.style.cssText = "height:260px;border-radius:10px;background:linear-gradient(135deg,#334155,#0f172a);display:flex;align-items:center;justify-content:center;color:#fff";
        view.textContent = `${options.cameraType === "front" ? "Front" : "Back"} camera`;
        sheet.appendChild(view);
        const shutter = document.createElement("button");
        shutter.type = "button";
        shutter.className = "ph-cancel";
        shutter.textContent = "Take photo";
        shutter.setAttribute("data-button", "Take photo");
        shutter.addEventListener("click", () => close(true));
        sheet.appendChild(shutter);
      },
    });
    if (!shot) return { canceled: true, assets: null };
    const m = newPhoto(options.cameraType);
    return { canceled: false, assets: [asset(m, { quality: options.quality ?? 1, base64: options.base64, exif: options.exif, crop: options.allowsEditing ? cropTo(m, options.aspect) : null })] };
  },
  requestMediaLibraryPermissionsAsync: () => requestPermission("mediaLibrary"),
  getMediaLibraryPermissionsAsync: async () => permission("mediaLibrary"),
  requestCameraPermissionsAsync: () => requestPermission("camera"),
  getCameraPermissionsAsync: async () => permission("camera"),
  useMediaLibraryPermissions: permissionHook("mediaLibrary"),
  useCameraPermissions: permissionHook("camera"),
  getPendingResultAsync: async () => [],
};

/* ── expo-camera ─────────────────────────────────────────────────────── */
const cameras = new Set();
export const CameraView = forwardRef(function CameraView(props, ref) {
  const { facing = "back", style, children, onCameraReady, onBarcodeScanned, barcodeScannerSettings, onMountError } = props;
  const granted = permission("camera").granted;
  const self = useRef(props);
  self.current = props;
  useEffect(() => {
    if (!granted) {
      onMountError?.({ message: "Camera permissions are not granted." });
      return undefined;
    }
    const entry = { get props() { return self.current; } };
    cameras.add(entry);
    const t = setTimeout(() => onCameraReady?.(), 50);
    return () => {
      clearTimeout(t);
      cameras.delete(entry);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [granted]);
  useImperativeHandle(ref, () => ({
    async takePictureAsync(options = {}) {
      if (!permission("camera").granted) throw coded("ERR_CAMERA_NOT_READY", "Camera is not ready yet. Wait for 'onCameraReady' callback");
      await tick(120);
      const m = newPhoto(facing);
      const q = options.quality ?? 1;
      const shot = q < 1 ? registerMedia({ width: m.width, height: m.height, label: "Camera", from: "#334155", to: "#0f172a", quality: q, fileName: m.fileName }) : m;
      emit("camera", { kind: "photo" });
      return { uri: shot.uri, width: m.width, height: m.height, format: "jpg", base64: options.base64 ? "/9j/4AAQSkZJRgABAQAAAQABAAD" : undefined, exif: options.exif ? { Orientation: 1 } : undefined };
    },
    async getAvailablePictureSizesAsync() {
      return ["4032x3024", "1920x1080", "1280x720"];
    },
    pausePreview: async () => {},
    resumePreview: async () => {},
    recordAsync: async () => ({ uri: "file:///var/mobile/Media/VID_0001.MOV" }),
    stopRecording() {},
    toggleRecordingAsync: async () => {},
  }), [facing]);
  return createElement(
    View,
    { style: [{ backgroundColor: "#0b0b0c", overflow: "hidden" }, style], dataSet: { camera: granted ? facing : "no-permission", scanning: onBarcodeScanned ? (barcodeScannerSettings?.barcodeTypes || ["qr"]).join(",") : "" } },
    granted
      ? createElement(View, { style: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, alignItems: "center", justifyContent: "center", backgroundColor: "#1f2937" } }, createElement(Text, { style: { color: "#94a3b8", fontSize: 13 } }, `${facing === "front" ? "Front" : "Back"} camera (practice phone)`))
      : null,
    children
  );
});
/** A check (or the toolbar) points the camera at a barcode. */
export function scanBarcode(data, type = "qr") {
  for (const c of cameras) {
    const p = c.props;
    if (p.onBarcodeScanned) {
      p.onBarcodeScanned({ type, data: String(data), raw: String(data), bounds: { origin: { x: 100, y: 300 }, size: { width: 180, height: 180 } }, cornerPoints: [] });
      return true;
    }
  }
  return false;
}
export const Camera = {
  CameraView,
  useCameraPermissions: permissionHook("camera"),
  useMicrophonePermissions: permissionHook("microphone"),
  requestCameraPermissionsAsync: () => requestPermission("camera"),
  getCameraPermissionsAsync: async () => permission("camera"),
  requestMicrophonePermissionsAsync: () => requestPermission("microphone"),
  getMicrophonePermissionsAsync: async () => permission("microphone"),
  scanFromURLAsync: async () => [],
  PermissionStatus,
};

/* ── expo-image-manipulator ──────────────────────────────────────────── */
export const SaveFormat = { JPEG: "jpeg", PNG: "png", WEBP: "webp" };
export const FlipType = { Vertical: "vertical", Horizontal: "horizontal" };
function source(uri) {
  const m = mediaByUri(uri);
  if (!m) throw new Error(`Could not load the image at ${uri}`);
  return m;
}
class ImageRef {
  constructor(media, width, height) {
    this.media = media;
    this.width = width;
    this.height = height;
  }
  async saveAsync({ compress = 1, format = "jpeg", base64 = false } = {}) {
    const out = registerMedia({ width: this.width, height: this.height, label: this.media.fileName.replace(/\..*$/, ""), quality: format === "png" ? 1 : compress, fileName: this.media.fileName.replace(/\.\w+$/, `.${format === "jpeg" ? "jpg" : format}`), mimeType: `image/${format}` });
    if (format === "png") out.fileSize = this.width * this.height * 2;
    return { uri: out.uri, width: this.width, height: this.height, base64: base64 ? "iVBORw0KGgo" : undefined };
  }
  release() {}
}
class ImageManipulatorContext {
  constructor(uri) {
    this.media = source(uri);
    this.reset();
  }
  reset() {
    this.w = this.media.width;
    this.h = this.media.height;
    return this;
  }
  resize({ width, height } = {}) {
    if (width && height) [this.w, this.h] = [Math.round(width), Math.round(height)];
    else if (width) [this.w, this.h] = [Math.round(width), Math.round((width * this.h) / this.w)];
    else if (height) [this.w, this.h] = [Math.round((height * this.w) / this.h), Math.round(height)];
    return this;
  }
  rotate(degrees) {
    if (Math.abs(degrees) % 180 === 90) [this.w, this.h] = [this.h, this.w];
    return this;
  }
  flip() {
    return this;
  }
  crop({ width, height }) {
    [this.w, this.h] = [Math.round(width), Math.round(height)];
    return this;
  }
  extent({ width, height }) {
    [this.w, this.h] = [Math.round(width), Math.round(height)];
    return this;
  }
  async renderAsync() {
    await tick(30);
    return new ImageRef(this.media, this.w, this.h);
  }
  release() {}
}
export const ImageManipulator = {
  manipulate: (uri) => new ImageManipulatorContext(uri),
};
export async function manipulateAsync(uri, actions = [], saveOptions = {}) {
  const ctx = new ImageManipulatorContext(uri);
  for (const a of actions) {
    if (a.resize) ctx.resize(a.resize);
    if (a.rotate) ctx.rotate(a.rotate);
    if (a.crop) ctx.crop(a.crop);
    if (a.flip) ctx.flip(a.flip);
  }
  return (await ctx.renderAsync()).saveAsync(saveOptions);
}
export function useImageManipulator(uri) {
  return new ImageManipulatorContext(uri);
}

/* ── expo-file-system (the File / Directory / Paths API) ─────────────── */
const join = (...parts) => parts.map((p) => String(p?.uri ?? p)).join("/").replace(/(^|[^:/])\/{2,}/g, "$1/");
export class File {
  constructor(...uris) {
    this.uri = join(...uris);
  }
  get name() {
    return this.uri.split("/").pop();
  }
  get extension() {
    const n = this.name;
    return n.includes(".") ? `.${n.split(".").pop()}` : "";
  }
  get exists() {
    return Boolean(mediaByUri(this.uri) || stores.files.has(this.uri) || DOCUMENTS.some((d) => d.uri === this.uri));
  }
  get size() {
    const m = mediaByUri(this.uri);
    if (m) return m.fileSize;
    const d = DOCUMENTS.find((x) => x.uri === this.uri);
    if (d) return d.size;
    return stores.files.has(this.uri) ? new TextEncoder().encode(stores.files.get(this.uri)).length : 0;
  }
  get type() {
    return mediaByUri(this.uri)?.mimeType || DOCUMENTS.find((x) => x.uri === this.uri)?.mimeType || "text/plain";
  }
  get md5() {
    return null;
  }
  async text() {
    return this.textSync();
  }
  textSync() {
    const d = DOCUMENTS.find((x) => x.uri === this.uri);
    if (d) return d.text ?? "";
    if (!stores.files.has(this.uri)) throw new Error(`File '${this.uri}' does not exist`);
    return stores.files.get(this.uri);
  }
  async base64() {
    return btoa(unescape(encodeURIComponent(this.textSync())));
  }
  async write(content) {
    this.writeSync(content);
  }
  writeSync(content) {
    stores.files.set(this.uri, String(content));
  }
  create() {
    if (!stores.files.has(this.uri)) stores.files.set(this.uri, "");
  }
  delete() {
    stores.files.delete(this.uri);
  }
  copy(dest) {
    stores.files.set(dest instanceof Directory ? join(dest.uri, this.name) : dest.uri, this.textSync());
  }
  move(dest) {
    this.copy(dest);
    this.delete();
    this.uri = dest instanceof Directory ? join(dest.uri, this.name) : dest.uri;
  }
  info() {
    return { exists: this.exists, size: this.size, uri: this.uri };
  }
}
export class Directory {
  constructor(...uris) {
    this.uri = join(...uris).replace(/\/?$/, "/");
  }
  get name() {
    return this.uri.replace(/\/$/, "").split("/").pop();
  }
  get exists() {
    return true;
  }
  create() {}
  delete() {
    for (const k of [...stores.files.keys()]) if (k.startsWith(this.uri)) stores.files.delete(k);
  }
  list() {
    return [...stores.files.keys()].filter((k) => k.startsWith(this.uri) && !k.slice(this.uri.length).includes("/")).map((k) => new File(k));
  }
}
const appDir = () => `file:///data/user/0/${device.app.slug || "app"}`;
export const Paths = {
  get document() {
    return new Directory(`${appDir()}/files/`);
  },
  get cache() {
    return new Directory(`${appDir()}/cache/`);
  },
  join: (...parts) => join(...parts),
  get totalDiskSpace() {
    return 128 * 1024 ** 3;
  },
  get availableDiskSpace() {
    return 41 * 1024 ** 3;
  },
};

/* ── expo-location ───────────────────────────────────────────────────── */
export const Accuracy = { Lowest: 1, Low: 2, Balanced: 3, High: 4, Highest: 5, BestForNavigation: 6 };
const watchers = new Set();
let lastKnown = null;
function position(accuracy) {
  const l = device.location;
  const spread = { 1: 3000, 2: 1000, 3: 100, 4: 10, 5: 5, 6: 5 }[accuracy || 3] ?? 100;
  lastKnown = {
    coords: { latitude: l.latitude, longitude: l.longitude, altitude: l.altitude ?? 41, accuracy: Math.max(l.accuracy ?? 12, Math.min(spread, 65)), altitudeAccuracy: 3, heading: l.heading ?? 0, speed: l.speed ?? 0 },
    timestamp: Date.now(),
    mocked: false,
  };
  return lastKnown;
}
export function moveTo(update) {
  device.location = { ...device.location, ...update };
  for (const w of watchers) w(position(w.accuracy));
}
const needLocation = () => {
  if (!permission("location").granted) throw coded("E_LOCATION_UNAUTHORIZED", "Not authorized to use location services");
  if (device.locationServices === false) throw coded("E_LOCATION_SERVICES_DISABLED", "Location services are disabled");
};
export const Location = {
  Accuracy,
  PermissionStatus,
  ActivityType: { Other: 1, AutomotiveNavigation: 2, Fitness: 3, OtherNavigation: 4, Airborne: 5 },
  requestForegroundPermissionsAsync: () => requestPermission("location"),
  getForegroundPermissionsAsync: async () => permission("location"),
  async requestBackgroundPermissionsAsync() {
    if (!permission("location").granted) return { ...permission("backgroundLocation"), status: "denied", granted: false };
    return requestPermission("backgroundLocation");
  },
  getBackgroundPermissionsAsync: async () => permission("backgroundLocation"),
  useForegroundPermissions: permissionHook("location"),
  useBackgroundPermissions: permissionHook("backgroundLocation"),
  hasServicesEnabledAsync: async () => device.locationServices !== false,
  getProviderStatusAsync: async () => ({ locationServicesEnabled: device.locationServices !== false, gpsAvailable: true, networkAvailable: device.online, passiveAvailable: true, backgroundModeEnabled: false }),
  enableNetworkProviderAsync: async () => {},
  async getCurrentPositionAsync(options = {}) {
    needLocation();
    // A real GPS fix takes a moment: long enough that a screen needs a loading state.
    await tick(400);
    return position(options.accuracy);
  },
  async getLastKnownPositionAsync() {
    needLocation();
    return lastKnown;
  },
  async watchPositionAsync(options = {}, callback) {
    needLocation();
    const w = (p) => callback(p);
    w.accuracy = options.accuracy;
    watchers.add(w);
    setTimeout(() => watchers.has(w) && w(position(options.accuracy)), 300);
    return { remove: () => watchers.delete(w) };
  },
  async watchHeadingAsync(callback) {
    setTimeout(() => callback({ trueHeading: 90, magHeading: 92, accuracy: 3 }), 100);
    return { remove() {} };
  },
  async reverseGeocodeAsync() {
    await tick(120);
    if (!device.online) throw coded("E_NO_GEOCODER", "Geocoding needs a network connection on this device");
    return [{ ...device.address, subregion: device.address.district, timezone: device.timeZone, formattedAddress: `${device.address.streetNumber} ${device.address.street}, ${device.address.city}, ${device.address.country}` }];
  },
  async geocodeAsync() {
    await tick(120);
    return [{ latitude: device.location.latitude, longitude: device.location.longitude, accuracy: 50 }];
  },
  startLocationUpdatesAsync: async (task) => {
    if (!permission("backgroundLocation").granted) throw coded("E_LOCATION_BACKGROUND_UNAUTHORIZED", "Not authorized to use background location services");
    backgroundRegistry.location.add(task);
  },
  stopLocationUpdatesAsync: async (task) => backgroundRegistry.location.delete(task),
  hasStartedLocationUpdatesAsync: async (task) => backgroundRegistry.location.has(task),
  startGeofencingAsync: async () => {},
  stopGeofencingAsync: async () => {},
  hasStartedGeofencingAsync: async () => false,
  isBackgroundLocationAvailableAsync: async () => true,
  installWebGeolocationPolyfill: () => {},
};

/* ── react-native-maps ───────────────────────────────────────────────── */
function project(region, size, coord) {
  const x = (coord.longitude - (region.longitude - region.longitudeDelta / 2)) / region.longitudeDelta;
  const y = ((region.latitude + region.latitudeDelta / 2) - coord.latitude) / region.latitudeDelta;
  return { left: x * size.width, top: y * size.height, inside: x >= 0 && x <= 1 && y >= 0 && y <= 1 };
}
export const MapView = forwardRef(function MapView(props, ref) {
  const { initialRegion, region: controlled, style, children, onRegionChangeComplete, onPress, showsUserLocation, provider } = props;
  const [own, setOwn] = useState(initialRegion || { latitude: device.location.latitude, longitude: device.location.longitude, latitudeDelta: 0.05, longitudeDelta: 0.05 });
  const region = controlled || own;
  const [size, setSize] = useState({ width: 0, height: 0 });
  const node = useRef(null);
  useEffect(() => {
    if (node.current?.style) {
      node.current.style.backgroundImage = "linear-gradient(0deg, rgba(255,255,255,.35) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.35) 1px, transparent 1px)";
      node.current.style.backgroundSize = "40px 40px";
    }
    // onLayout can be late (or never come in a background tab): measure once on mount too.
    const r = node.current?.getBoundingClientRect?.();
    if (r && r.width && r.height) setSize((s) => (s.width ? s : { width: r.width, height: r.height }));
  }, []);
  const move = (r) => {
    setOwn(r);
    setTimeout(() => onRegionChangeComplete?.(r, { isGesture: false }), 0);
  };
  useImperativeHandle(ref, () => ({
    animateToRegion: (r) => move(r),
    animateCamera: (c) => c.center && move({ ...region, ...c.center }),
    fitToCoordinates(coords = []) {
      if (!coords.length) return;
      const lats = coords.map((c) => c.latitude);
      const lngs = coords.map((c) => c.longitude);
      move({ latitude: (Math.min(...lats) + Math.max(...lats)) / 2, longitude: (Math.min(...lngs) + Math.max(...lngs)) / 2, latitudeDelta: Math.max(0.01, (Math.max(...lats) - Math.min(...lats)) * 1.4), longitudeDelta: Math.max(0.01, (Math.max(...lngs) - Math.min(...lngs)) * 1.4) });
    },
    getCamera: async () => ({ center: { latitude: region.latitude, longitude: region.longitude }, zoom: 14, heading: 0, pitch: 0 }),
    // move() only calls setOwn and the callback prop; region is what changes the handle.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [region]);
  const ctx = { region, size };
  const kids = [].concat(children || []).flat(Infinity).filter(Boolean).map((k, i) => (k && k.type ? createElement(k.type, { ...k.props, key: k.key ?? i, __map: ctx }) : k));
  const user = showsUserLocation && permission("location").granted && size.width ? project(region, size, device.location) : null;
  return createElement(
    View,
    {
      ref: (n) => (node.current = n),
      style: [{ backgroundColor: "#cfe3d2", overflow: "hidden" }, style],
      onLayout: (e) => setSize({ width: e.nativeEvent.layout.width, height: e.nativeEvent.layout.height }),
      dataSet: { map: provider || "default", center: `${region.latitude.toFixed(4)},${region.longitude.toFixed(4)}` },
      accessibilityLabel: "Map",
      onClick: onPress ? () => onPress({ nativeEvent: { coordinate: { latitude: region.latitude, longitude: region.longitude } } }) : undefined,
    },
    size.width ? kids : null,
    user && user.inside ? createElement(View, { dataSet: { userLocation: "1" }, style: { position: "absolute", left: user.left - 8, top: user.top - 8, width: 16, height: 16, borderRadius: 8, backgroundColor: "#2563eb", borderWidth: 3, borderColor: "#fff" } }) : null
  );
});
export function Marker({ coordinate, title, description, onPress, pinColor = "#dc2626", children, __map, testID }) {
  const [open, setOpen] = useState(false);
  if (!__map || !__map.size.width || !coordinate) return null;
  const at = project(__map.region, __map.size, coordinate);
  if (!at.inside) return null;
  return createElement(
    View,
    { style: { position: "absolute", left: at.left - 12, top: at.top - 30, alignItems: "center" }, testID },
    open && (title || description)
      ? createElement(View, { style: { position: "absolute", bottom: 34, minWidth: 140, padding: 8, borderRadius: 8, backgroundColor: "#fff" }, dataSet: { callout: title || "" } }, title ? createElement(Text, { style: { fontWeight: "600" } }, title) : null, description ? createElement(Text, { style: { fontSize: 12 } }, description) : null)
      : null,
    createElement(
      Pressable,
      {
        accessibilityRole: "button",
        accessibilityLabel: title || "Map marker",
        dataSet: { marker: title || "" },
        onPress: (e) => {
          setOpen((v) => !v);
          onPress?.({ nativeEvent: { coordinate, id: title } , stopPropagation() { e?.stopPropagation?.(); } });
        },
        style: { width: 24, height: 30, alignItems: "center", justifyContent: "flex-end" },
      },
      children || createElement(Text, { style: { fontSize: 22, color: pinColor, lineHeight: 26 } }, "📍")
    )
  );
}
export const Callout = ({ children }) => createElement(View, null, children);
export const Polyline = () => null;
export const Polygon = () => null;
export const Circle = () => null;
export const PROVIDER_GOOGLE = "google";
export const PROVIDER_DEFAULT = null;

/* ── expo-notifications ──────────────────────────────────────────────── */
export const DEFAULT_ACTION_IDENTIFIER = "expo.modules.notifications.actions.DEFAULT";
export const SchedulableTriggerInputTypes = { CALENDAR: "calendar", DAILY: "daily", WEEKLY: "weekly", MONTHLY: "monthly", YEARLY: "yearly", DATE: "date", TIME_INTERVAL: "timeInterval" };
export const AndroidImportance = { UNKNOWN: 0, UNSPECIFIED: 1, NONE: 2, MIN: 3, LOW: 4, DEFAULT: 5, HIGH: 6, MAX: 7 };
export const notifications = {
  handler: null,
  scheduled: [],
  presented: [],
  delivered: [],
  channels: {},
  badge: 0,
  lastResponse: null,
  received: new Set(),
  responses: new Set(),
  dropped: new Set(),
  tokens: { expo: null },
};

function nextFire(trigger) {
  const now = Date.now();
  if (trigger === null) return now;
  if (trigger === undefined) throw new TypeError("Encountered an `undefined` notification trigger. If you want to trigger the notification immediately, pass in an explicit `null` value.");
  if (!trigger.type && !trigger.channelId) {
    throw new TypeError("The `trigger` object you provided is invalid. It needs to contain a `type` or `channelId` entry. Refer to the documentation to update your code: https://docs.expo.dev/versions/latest/sdk/notifications/#notificationtriggerinput");
  }
  switch (trigger.type) {
    case "timeInterval":
      if (typeof trigger.seconds !== "number") throw new TypeError("The seconds parameter should be a number");
      return now + trigger.seconds * 1000;
    case "date":
      return new Date(trigger.date).getTime();
    case "daily": {
      const d = new Date(now);
      d.setHours(trigger.hour, trigger.minute, 0, 0);
      if (d.getTime() <= now) d.setDate(d.getDate() + 1);
      return d.getTime();
    }
    default:
      return now + 24 * 3600 * 1000;
  }
}

function makeNotification(request) {
  return { date: Date.now(), request };
}

/** Deliver a notification, as the OS does: shown, and reported to the app if it is open. */
export async function deliver(request, { remote = false } = {}) {
  const notification = makeNotification(request);
  if (!permission("notifications").granted) {
    // Without permission the system shows nothing, and the app hears nothing.
    for (const fn of notifications.dropped) fn();
    return null;
  }
  let show = true;
  if (device.appState === "active") {
    if (notifications.handler) {
      try {
        const behavior = await notifications.handler.handleNotification(notification);
        show = Boolean(behavior?.shouldShowBanner ?? behavior?.shouldShowAlert ?? false);
        if (behavior?.shouldSetBadge && request.content.badge != null) notifications.badge = request.content.badge;
        notifications.handler.handleSuccess?.(request.identifier);
      } catch (err) {
        notifications.handler.handleError?.(request.identifier, err);
      }
    }
    for (const fn of [...notifications.received]) fn(notification);
  }
  notifications.delivered.push({ ...notification, shown: show, remote });
  notifications.presented.push(notification);
  emit("notification", notification);
  if (show) ui.banner(notification, () => respond(notification));
  return notification;
}

/** The user tapped a notification: the app comes to the front and is told. */
export function respond(notification, actionIdentifier = DEFAULT_ACTION_IDENTIFIER) {
  const response = { notification, actionIdentifier };
  notifications.lastResponse = response;
  notifications.presented = notifications.presented.filter((n) => n.request.identifier !== notification.request.identifier);
  if (device.appState !== "active") {
    device.appState = "active";
    emit("appstate", null);
  }
  emit("notification-response", response);
  for (const fn of [...notifications.responses]) fn(response);
  const url = notification.request.content.data?.url;
  if (typeof url === "string" && notifications.routeUrls) deliverURL(url);
  return response;
}

const timers = new Map();
function arm(entry) {
  const delay = entry.fireAt - Date.now();
  if (delay > 10 * 60 * 1000) return;
  timers.set(entry.request.identifier, setTimeout(() => fire(entry.request.identifier), Math.max(0, delay)));
}
function fire(id) {
  const i = notifications.scheduled.findIndex((s) => s.request.identifier === id);
  if (i < 0) return;
  const entry = notifications.scheduled[i];
  clearTimeout(timers.get(id));
  timers.delete(id);
  const repeats = entry.request.trigger && entry.request.trigger.repeats;
  if (repeats && entry.request.trigger.type === "timeInterval") {
    entry.fireAt = Date.now() + entry.request.trigger.seconds * 1000;
    arm(entry);
  } else if (entry.request.trigger && ["daily", "weekly", "monthly", "yearly", "calendar"].includes(entry.request.trigger.type)) {
    entry.fireAt += 24 * 3600 * 1000;
  } else {
    notifications.scheduled.splice(i, 1);
  }
  deliver(entry.request);
}
/** Move the phone's clock forward: every notification due by then is delivered now. */
export function advanceClock(seconds) {
  const until = Date.now() + seconds * 1000;
  for (const entry of [...notifications.scheduled].sort((a, b) => a.fireAt - b.fireAt)) {
    if (entry.fireAt <= until) fire(entry.request.identifier);
  }
}

let idSeq = 0;
const sub = (set, fn) => (set.add(fn), { remove: () => set.delete(fn) });
const expoToken = () => `ExponentPushToken[${btoa(`${device.app.slug || "app"}-${device.os}`).replace(/[^A-Za-z0-9]/g, "").slice(0, 22)}]`;

export const Notifications = {
  DEFAULT_ACTION_IDENTIFIER,
  SchedulableTriggerInputTypes,
  AndroidImportance,
  AndroidNotificationVisibility: { UNKNOWN: 0, PUBLIC: 1, PRIVATE: 2, SECRET: 3 },
  IosAuthorizationStatus: { NOT_DETERMINED: 0, DENIED: 1, AUTHORIZED: 2, PROVISIONAL: 3, EPHEMERAL: 4 },
  PermissionStatus,
  setNotificationHandler(handler) {
    notifications.handler = handler;
  },
  async getPermissionsAsync() {
    const p = permission("notifications");
    return { ...p, ios: device.os === "ios" ? { status: p.granted ? 2 : p.status === "denied" ? 1 : 0, allowsAlert: p.granted, allowsBadge: p.granted, allowsSound: p.granted } : undefined };
  },
  async requestPermissionsAsync() {
    const p = await requestPermission("notifications");
    return { ...p, ios: device.os === "ios" ? { status: p.granted ? 2 : 1, allowsAlert: p.granted, allowsBadge: p.granted, allowsSound: p.granted } : undefined };
  },
  async scheduleNotificationAsync({ identifier, content = {}, trigger }) {
    const fireAt = nextFire(trigger);
    const request = { identifier: identifier || `n-${++idSeq}`, content: { title: null, subtitle: null, body: null, data: {}, sound: null, badge: null, ...content }, trigger: trigger === null ? null : { ...trigger } };
    if (trigger === null) {
      setTimeout(() => deliver(request), 0);
    } else {
      const entry = { request, fireAt };
      notifications.scheduled.push(entry);
      arm(entry);
    }
    emit("notifications-scheduled", null);
    return request.identifier;
  },
  async cancelScheduledNotificationAsync(id) {
    clearTimeout(timers.get(id));
    timers.delete(id);
    notifications.scheduled = notifications.scheduled.filter((s) => s.request.identifier !== id);
    emit("notifications-scheduled", null);
  },
  async cancelAllScheduledNotificationsAsync() {
    for (const t of timers.values()) clearTimeout(t);
    timers.clear();
    notifications.scheduled = [];
    emit("notifications-scheduled", null);
  },
  async getAllScheduledNotificationsAsync() {
    return notifications.scheduled.map((s) => ({ ...s.request }));
  },
  async getNextTriggerDateAsync(trigger) {
    return nextFire(trigger);
  },
  async getPresentedNotificationsAsync() {
    return notifications.presented.slice();
  },
  async dismissNotificationAsync(id) {
    notifications.presented = notifications.presented.filter((n) => n.request.identifier !== id);
  },
  async dismissAllNotificationsAsync() {
    notifications.presented = [];
  },
  async setBadgeCountAsync(n) {
    notifications.badge = n;
    return true;
  },
  async getBadgeCountAsync() {
    return notifications.badge;
  },
  async setNotificationChannelAsync(id, channel) {
    if (device.os !== "android") return null;
    notifications.channels[id] = { id, ...channel };
    return notifications.channels[id];
  },
  async getNotificationChannelsAsync() {
    return device.os === "android" ? Object.values(notifications.channels) : [];
  },
  async getNotificationChannelAsync(id) {
    return notifications.channels[id] || null;
  },
  async deleteNotificationChannelAsync(id) {
    delete notifications.channels[id];
  },
  setNotificationCategoryAsync: async (id, actions) => ({ identifier: id, actions }),
  getNotificationCategoriesAsync: async () => [],
  addNotificationReceivedListener: (fn) => sub(notifications.received, fn),
  addNotificationResponseReceivedListener: (fn) => sub(notifications.responses, fn),
  addNotificationsDroppedListener: (fn) => sub(notifications.dropped, fn),
  addPushTokenListener: () => ({ remove() {} }),
  removeNotificationSubscription: (s) => s?.remove?.(),
  getLastNotificationResponse: () => notifications.lastResponse,
  getLastNotificationResponseAsync: async () => notifications.lastResponse,
  clearLastNotificationResponse: () => {
    notifications.lastResponse = null;
  },
  clearLastNotificationResponseAsync: async () => {
    notifications.lastResponse = null;
  },
  useLastNotificationResponse() {
    const [r, setR] = useState(notifications.lastResponse);
    useEffect(() => on("notification-response", (resp) => setR(resp)), []);
    return r;
  },
  async getExpoPushTokenAsync(options = {}) {
    if (device.build === "expo-go" && device.os === "android") {
      throw new Error("expo-notifications: Android Push notifications (remote notifications) functionality provided by expo-notifications was removed from Expo Go with the release of SDK 53. Use a development build instead of Expo Go. Learn more at https://docs.expo.dev/develop/development-builds/introduction/.");
    }
    const projectId = options.projectId || device.app.config?.extra?.eas?.projectId;
    if (!projectId) {
      throw coded("ERR_NOTIFICATIONS_NO_EXPERIENCE_ID", `No "projectId" found. If "projectId" can't be inferred from the manifest (for instance, in bare workflow), you have to pass it in yourself.`);
    }
    if (!device.online) throw coded("ERR_NOTIFICATIONS_NETWORK_ERROR", "Error encountered while fetching Expo token: TypeError: Network request failed.");
    await tick(150);
    notifications.tokens.expo = expoToken();
    return { type: "expo", data: notifications.tokens.expo };
  },
  async getDevicePushTokenAsync() {
    return device.os === "ios" ? { type: "ios", data: "a1b2c3d4e5f60718293a4b5c6d7e8f90a1b2c3d4e5f60718293a4b5c6d7e8f90" } : { type: "android", data: "fcm:APA91bH-practice-device-token" };
  },
  registerTaskAsync: async () => {},
  unregisterTaskAsync: async () => {},
};

/** A push message from a server, through Expo's push service, to this phone. */
export function receivePush({ to, title, body, data, badge, sound }) {
  if (!notifications.tokens.expo || to !== notifications.tokens.expo) return { status: "error", message: `"${to}" is not a registered push notification recipient`, details: { error: "DeviceNotRegistered" } };
  const id = `push-${++idSeq}`;
  setTimeout(() => deliver({ identifier: id, content: { title: title ?? null, subtitle: null, body: body ?? null, data: data || {}, badge: badge ?? null, sound: sound ?? null }, trigger: { type: "push" } }, { remote: true }), 200);
  return { status: "ok", id };
}

/* ── expo-document-picker ────────────────────────────────────────────── */
const typeMatches = (mime, want) => {
  const list = [].concat(want || "*/*");
  return list.some((w) => w === "*/*" || w === mime || (w.endsWith("/*") && mime.startsWith(w.slice(0, -1))));
};
export const DocumentPicker = {
  async getDocumentAsync(options = {}) {
    const docs = DOCUMENTS.filter((d) => typeMatches(d.mimeType, options.type));
    const chosen = await ui.sheet({
      kind: "document-picker",
      title: device.os === "ios" ? "Files" : "Recent files",
      render(sheet, close) {
        if (!docs.length) {
          const p = document.createElement("p");
          p.textContent = "No files of this type on the phone.";
          sheet.appendChild(p);
        }
        for (const d of docs) {
          const b = document.createElement("button");
          b.type = "button";
          b.className = "ph-row";
          b.textContent = `${d.name} · ${Math.round(d.size / 1024)} KB`;
          b.setAttribute("data-button", d.name);
          b.addEventListener("click", () => close(d));
          sheet.appendChild(b);
        }
      },
    });
    if (!chosen) return { canceled: true, assets: null };
    return { canceled: false, assets: [{ name: chosen.name, uri: chosen.uri, size: chosen.size, mimeType: chosen.mimeType, lastModified: 1760000000000 }] };
  },
};

/* ── expo-sharing ────────────────────────────────────────────────────── */
export const Sharing = {
  isAvailableAsync: async () => true,
  async shareAsync(url, options = {}) {
    const to = await ui.sheet({
      kind: "share",
      title: options.dialogTitle || "Share",
      render(sheet, close) {
        for (const t of ["Messages", "WhatsApp", "Mail", "Save to Files"]) {
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
    device.log.shares.push({ url, mimeType: options.mimeType, to });
    emit("share", null);
  },
  getSharedPayloads: () => [],
  getResolvedSharedPayloadsAsync: async () => [],
  clearSharedPayloads: () => {},
  useIncomingShare: () => ({ sharedPayloads: [], resolvedSharedPayloads: [], clearSharedPayloads() {}, isResolving: false, error: null, refreshSharePayloads() {} }),
};

/* ── expo-local-authentication ───────────────────────────────────────── */
export const AuthenticationType = { FINGERPRINT: 1, FACIAL_RECOGNITION: 2, IRIS: 3 };
export const SecurityLevel = { NONE: 0, SECRET: 1, BIOMETRIC_WEAK: 2, BIOMETRIC_STRONG: 3 };
export const LocalAuthentication = {
  AuthenticationType,
  SecurityLevel,
  hasHardwareAsync: async () => device.biometrics.hardware,
  isEnrolledAsync: async () => device.biometrics.hardware && device.biometrics.enrolled,
  supportedAuthenticationTypesAsync: async () => (device.biometrics.hardware ? [device.biometrics.type === "fingerprint" ? 1 : 2] : []),
  getEnrolledLevelAsync: async () => (device.biometrics.enrolled ? 3 : 1),
  async authenticateAsync({ promptMessage } = {}) {
    if (!device.biometrics.hardware) return { success: false, error: "not_available" };
    if (!device.biometrics.enrolled) return { success: false, error: "not_enrolled" };
    const r = await ui.biometric({ prompt: promptMessage, type: device.biometrics.type });
    if (r === "success") return { success: true, authenticationType: device.biometrics.type === "fingerprint" ? 1 : 2 };
    if (r === "cancel") return { success: false, error: "user_cancel" };
    return { success: false, error: "authentication_failed" };
  },
  cancelAuthenticate: async () => {},
};

/* ── expo-task-manager and expo-background-task ──────────────────────── */
export const backgroundRegistry = { tasks: new Map(), registered: new Map(), location: new Set() };
export const TaskManager = {
  defineTask(name, executor) {
    backgroundRegistry.tasks.set(name, executor);
  },
  isTaskDefined: (name) => backgroundRegistry.tasks.has(name),
  isTaskRegisteredAsync: async (name) => backgroundRegistry.registered.has(name),
  getTaskOptionsAsync: async (name) => backgroundRegistry.registered.get(name) || null,
  getRegisteredTasksAsync: async () => [...backgroundRegistry.registered.entries()].map(([taskName, options]) => ({ taskName, taskType: "background", options })),
  unregisterTaskAsync: async (name) => backgroundRegistry.registered.delete(name),
  unregisterAllTasksAsync: async () => backgroundRegistry.registered.clear(),
  isAvailableAsync: async () => true,
};
export const BackgroundTaskStatus = { Restricted: 1, Available: 2 };
export const BackgroundTaskResult = { Success: 1, Failed: 2 };
/** The OS decides to run the app's background work (a check can make it happen now). */
export async function runBackgroundTasks() {
  const results = [];
  for (const name of backgroundRegistry.registered.keys()) {
    const fn = backgroundRegistry.tasks.get(name);
    if (!fn) continue;
    try {
      results.push(await fn({ data: null, error: null, executionInfo: { taskName: name, eventId: String(Date.now()) } }));
    } catch (err) {
      results.push(BackgroundTaskResult.Failed);
      console.error(err);
    }
  }
  emit("background-tasks", results);
  return results;
}
export const BackgroundTask = {
  BackgroundTaskStatus,
  BackgroundTaskResult,
  getStatusAsync: async () => BackgroundTaskStatus.Available,
  async registerTaskAsync(name, options = {}) {
    if (!backgroundRegistry.tasks.has(name)) throw new Error(`Task '${name}' is not defined. You must define a task using TaskManager.defineTask before registering.`);
    backgroundRegistry.registered.set(name, { minimumInterval: Math.max(15, options.minimumInterval ?? 15) });
  },
  unregisterTaskAsync: async (name) => backgroundRegistry.registered.delete(name),
  triggerTaskWorkerForTestingAsync: async () => (await runBackgroundTasks(), true),
  addExpirationListener: () => ({ remove() {} }),
};

export { previewOf };
