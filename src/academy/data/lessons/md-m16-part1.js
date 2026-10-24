/**
 * MOBILE APP DEVELOPMENT · MODULE 16 · ACCESSING MOBILE DEVICE CAPABILITIES (part 1)
 *
 * Curriculum 16.1 – 16.9: the camera and gallery, image compression and
 * uploads, location and GPS, maps, push notifications, local notifications,
 * documents and files, sharing, and the clipboard.
 *
 * The practice phone simulates each capability with the real module's API,
 * its permission prompts (iOS and Android wording) and its error messages.
 *
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 */

import { appJson, expoLab } from "./md-helpers.js";

export const SECTION_ID = "md-s16-device";
export const MODULE = "md-m16-device";

export const titled = (title) => `import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "${title}" }} />
    </Stack>
  );
}
`;
const BTN = `{ minHeight: 48, justifyContent: "center", alignItems: "center", borderRadius: 12, borderWidth: 1, borderColor: "#cbd5e1" }`;

/* ── 16.1 · Camera and gallery ───────────────────────────────────────── */
const CAMERA_START = `import { CameraView, useCameraPermissions } from "expo-camera";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { useRef, useState } from "react";
import { Pressable, Text, View } from "react-native";

export default function ReportPhoto() {
  const [photo, setPhoto] = useState<string | null>(null);
  // Build the screen: ask for the camera, take a photo, or choose one.
  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text>Photograph the problem</Text>
    </View>
  );
}
`;
const CAMERA_MODEL = `import { CameraView, useCameraPermissions } from "expo-camera";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { useRef, useState } from "react";
import { Pressable, Text, View } from "react-native";

export default function ReportPhoto() {
  const [permission, requestPermission] = useCameraPermissions();
  const camera = useRef<CameraView>(null);
  const [photo, setPhoto] = useState<string | null>(null);

  async function takePhoto() {
    const shot = await camera.current?.takePictureAsync({ quality: 0.7 });
    if (shot) setPhoto(shot.uri);
  }

  async function chooseFromLibrary() {
    // The system photo picker needs no permission.
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ["images"], quality: 0.7 });
    if (!result.canceled) setPhoto(result.assets[0].uri);
  }

  if (photo) {
    return (
      <View style={{ flex: 1, padding: 16, gap: 12 }}>
        <Image source={{ uri: photo }} style={{ width: "100%", aspectRatio: 4 / 3, borderRadius: 12 }} accessibilityLabel="Photo preview" />
        <Pressable accessibilityRole="button" onPress={() => setPhoto(null)} style={${BTN}}><Text>Retake</Text></Pressable>
      </View>
    );
  }

  // Permission is still loading.
  if (!permission) return null;

  return (
    <View style={{ flex: 1, padding: 16, gap: 12 }}>
      {permission.granted ? (
        <>
          <CameraView ref={camera} style={{ flex: 1, borderRadius: 12 }} facing="back" />
          <Pressable accessibilityRole="button" onPress={takePhoto} style={${BTN}}><Text>Take photo</Text></Pressable>
        </>
      ) : (
        <>
          <Text>Kobo needs the camera to photograph your report.</Text>
          <Pressable accessibilityRole="button" onPress={requestPermission} style={${BTN}}><Text>Allow camera</Text></Pressable>
        </>
      )}
      <Pressable accessibilityRole="button" onPress={chooseFromLibrary} style={${BTN}}><Text>Choose from library</Text></Pressable>
    </View>
  );
}
`;
const CAMERA_APP_JSON_PLUGIN = [["expo-camera", { cameraPermission: "Allow Kobo to use your camera to photograph reports." }]];

/* ── 16.2 · Compression ──────────────────────────────────────────────── */
const COMPRESS_SERVER = `import { createServer } from "practice-server";

const app = createServer();

app.post("/reports/photo", (req, res) => {
  const file = req.files[0];
  if (!file) return res.status(400).json({ message: "No photo received" });
  // Mobile data is precious: photos over 1 MB are refused.
  if (file.size > 1024 * 1024) return res.status(413).json({ message: "That photo is too large (" + (file.size / 1048576).toFixed(1) + " MB)" });
  res.status(201).json({ url: file.url, width: file.width, height: file.height, size: file.size });
});

export default app;
`;
const PREPARE_START = `import { ImageManipulator, SaveFormat } from "expo-image-manipulator";

export type Prepared = { uri: string; width: number; height: number };

const MAX_SIDE = 1280;

/** Resizes a photo so its longest side is at most MAX_SIDE, and saves it as a JPEG at quality 0.7. */
export async function prepareForUpload(photo: { uri: string; width: number; height: number }): Promise<Prepared> {
  return photo;
}
`;
const PREPARE_MODEL = `import { ImageManipulator, SaveFormat } from "expo-image-manipulator";

export type Prepared = { uri: string; width: number; height: number };

const MAX_SIDE = 1280;

/** Resizes a photo so its longest side is at most MAX_SIDE, and saves it as a JPEG at quality 0.7. */
export async function prepareForUpload(photo: { uri: string; width: number; height: number }): Promise<Prepared> {
  const context = ImageManipulator.manipulate(photo.uri);
  // Resize the longer side; the other follows, keeping the shape.
  if (Math.max(photo.width, photo.height) > MAX_SIDE) {
    context.resize(photo.width >= photo.height ? { width: MAX_SIDE } : { height: MAX_SIDE });
  }
  const image = await context.renderAsync();
  const saved = await image.saveAsync({ compress: 0.7, format: SaveFormat.JPEG });
  return { uri: saved.uri, width: saved.width, height: saved.height };
}
`;
const COMPRESS_SCREEN = `import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { prepareForUpload } from "@/media/prepare";

export default function Upload() {
  const [status, setStatus] = useState("");
  async function pickAndUpload() {
    const picked = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ["images"] });
    if (picked.canceled) return;
    const a = picked.assets[0];
    const ready = await prepareForUpload({ uri: a.uri, width: a.width, height: a.height });
    const form = new FormData();
    form.append("photo", { uri: ready.uri, name: "report.jpg", type: "image/jpeg" } as unknown as Blob);
    const response = await fetch("https://api.example.com/reports/photo", { method: "POST", body: form });
    const data = await response.json();
    setStatus(response.ok ? "Uploaded " + data.width + "×" + data.height : data.message);
  }
  return (
    <View style={{ padding: 20, gap: 12 }}>
      <Pressable accessibilityRole="button" onPress={pickAndUpload} style={${BTN}}><Text>Upload a photo</Text></Pressable>
      <Text testID="status">{status}</Text>
    </View>
  );
}
`;

/* ── 16.3 · Location ─────────────────────────────────────────────────── */
const LOCATION_START = `import * as Location from "expo-location";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";

export default function WhereAmI() {
  const [place, setPlace] = useState("");
  return (
    <View style={{ padding: 20, gap: 12 }}>
      <Pressable accessibilityRole="button" style={${BTN}}><Text>Use my location</Text></Pressable>
      <Text testID="place">{place}</Text>
    </View>
  );
}
`;
const LOCATION_MODEL = `import * as Location from "expo-location";
import { useEffect, useRef, useState } from "react";
import { Pressable, Text, View } from "react-native";

const round = (n: number) => n.toFixed(4);

export default function WhereAmI() {
  const [place, setPlace] = useState("");
  const [position, setPosition] = useState("");
  const [tracking, setTracking] = useState(false);
  const watcher = useRef<Location.LocationSubscription | null>(null);

  async function ensurePermission() {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setPlace("Location is off for Kobo. You can still type your area.");
      return false;
    }
    return true;
  }

  async function useMyLocation() {
    if (!(await ensurePermission())) return;
    // Balanced accuracy is enough for an address, and kinder to the battery than High.
    const here = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
    setPosition(round(here.coords.latitude) + ", " + round(here.coords.longitude));
    const [address] = await Location.reverseGeocodeAsync(here.coords);
    setPlace(address ? address.name + ", " + address.city : "Unknown place");
  }

  async function toggleTracking() {
    if (tracking) {
      watcher.current?.remove();
      watcher.current = null;
      setTracking(false);
      return;
    }
    if (!(await ensurePermission())) return;
    watcher.current = await Location.watchPositionAsync({ accuracy: Location.Accuracy.Balanced, distanceInterval: 20 }, (loc) =>
      setPosition(round(loc.coords.latitude) + ", " + round(loc.coords.longitude))
    );
    setTracking(true);
  }

  // Stop watching when the screen closes.
  useEffect(() => () => watcher.current?.remove(), []);

  return (
    <View style={{ padding: 20, gap: 12 }}>
      <Pressable accessibilityRole="button" onPress={useMyLocation} style={${BTN}}><Text>Use my location</Text></Pressable>
      <Pressable accessibilityRole="button" onPress={toggleTracking} style={${BTN}}><Text>{tracking ? "Stop tracking" : "Track my route"}</Text></Pressable>
      <Text testID="place">{place}</Text>
      <Text testID="position">{position}</Text>
    </View>
  );
}
`;

/* ── 16.4 · Maps ─────────────────────────────────────────────────────── */
const SHOPS = `export type Shop = { id: string; name: string; latitude: number; longitude: number };

export const SHOPS: Shop[] = [
  { id: "1", name: "Kobo Yaba", latitude: 6.5095, longitude: 3.3711 },
  { id: "2", name: "Kobo Marina", latitude: 6.4500, longitude: 3.3950 },
  { id: "3", name: "Kobo Ikeja", latitude: 6.6018, longitude: 3.3515 },
];
`;
const GEO_START = `/** Distance in kilometres between two points on Earth (the haversine formula). */
export function distanceKm(a: { latitude: number; longitude: number }, b: { latitude: number; longitude: number }): number {
  return 0;
}
`;
const GEO_MODEL = `const EARTH_RADIUS_KM = 6371;
const rad = (deg: number) => (deg * Math.PI) / 180;

/** Distance in kilometres between two points on Earth (the haversine formula). */
export function distanceKm(a: { latitude: number; longitude: number }, b: { latitude: number; longitude: number }): number {
  const dLat = rad(b.latitude - a.latitude);
  const dLon = rad(b.longitude - a.longitude);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.latitude)) * Math.cos(rad(b.latitude)) * Math.sin(dLon / 2) ** 2;
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(h));
}
`;
const MAP_START = `import * as Location from "expo-location";
import { useState } from "react";
import { Text, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { SHOPS } from "@/data/shops";
import { distanceKm } from "@/utils/geo";

export default function Shops() {
  return (
    <View style={{ flex: 1 }}>
      <Text style={{ padding: 16 }}>Find a shop</Text>
    </View>
  );
}
`;
const MAP_MODEL = `import * as Location from "expo-location";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { SHOPS, type Shop } from "@/data/shops";
import { distanceKm } from "@/utils/geo";

export default function Shops() {
  const [nearest, setNearest] = useState<{ shop: Shop; km: number } | null>(null);
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;
      const { coords } = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      const ranked = SHOPS.map((shop) => ({ shop, km: distanceKm(coords, shop) })).sort((a, b) => a.km - b.km);
      setNearest(ranked[0]);
    })();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={{ flex: 1 }}
        showsUserLocation
        initialRegion={{ latitude: 6.52, longitude: 3.375, latitudeDelta: 0.25, longitudeDelta: 0.25 }}
      >
        {SHOPS.map((s) => (
          <Marker key={s.id} testID="shop" coordinate={{ latitude: s.latitude, longitude: s.longitude }} title={s.name} onPress={() => setSelected(s.name)} />
        ))}
      </MapView>
      <View style={{ padding: 16, gap: 4 }}>
        {nearest ? <Text testID="nearest">Nearest: {nearest.shop.name} · {nearest.km.toFixed(1)} km</Text> : <Text>Allow location to find your nearest shop.</Text>}
        {selected ? <Text testID="selected">Selected: {selected}</Text> : null}
      </View>
    </View>
  );
}
`;

/* ── 16.5 · Push notifications ───────────────────────────────────────── */
const PUSH_SERVER = `import { createServer } from "practice-server";

const app = createServer();
const devices = []; // Expo push tokens for this user's phones

app.post("/devices", (req, res) => {
  const token = req.body?.token;
  if (!/^ExponentPushToken\\[.+\\]$/.test(String(token))) return res.status(400).json({ message: "Not an Expo push token" });
  if (!devices.includes(token)) devices.push(token);
  res.status(201).json({ ok: true });
});

// When the order ships, the SERVER sends the push, through Expo's push service.
app.post("/orders/42/ship", async (req, res) => {
  const messages = devices.map((to) => ({ to, title: "Your order has shipped", body: "Order #42 is on its way", data: { url: "/orders/42" } }));
  if (messages.length) {
    await fetch("https://exp.host/--/api/v2/push/send", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(messages) });
  }
  res.json({ notified: messages.length });
});

app.get("/debug/devices", (req, res) => res.json(devices));

export default app;
`;
const PUSH_START = `import Constants from "expo-constants";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

/**
 * Asks to send notifications and registers this phone with our server.
 * Returns the Expo push token, or null if the user said no.
 */
export async function registerForPush(): Promise<string | null> {
  return null;
}
`;
const PUSH_MODEL = `import Constants from "expo-constants";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

/**
 * Asks to send notifications and registers this phone with our server.
 * Returns the Expo push token, or null if the user said no.
 */
export async function registerForPush(): Promise<string | null> {
  // Android 8+ needs a channel before notifications can appear (and before the permission prompt on Android 13+).
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", { name: "Orders", importance: Notifications.AndroidImportance.HIGH });
  }

  let { status } = await Notifications.getPermissionsAsync();
  if (status !== "granted") ({ status } = await Notifications.requestPermissionsAsync());
  if (status !== "granted") return null;

  // The token identifies this app on this phone for Expo's push service.
  const projectId = Constants.expoConfig?.extra?.eas?.projectId;
  const { data: token } = await Notifications.getExpoPushTokenAsync({ projectId });

  await fetch("https://api.example.com/devices", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token }),
  });
  return token;
}
`;
const PUSH_SCREEN = `import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { registerForPush } from "@/notifications/register";

export default function Settings() {
  const [status, setStatus] = useState("");
  return (
    <View style={{ padding: 20, gap: 12 }}>
      <Text>Get told when your order ships.</Text>
      <Pressable accessibilityRole="button" onPress={async () => setStatus((await registerForPush()) ? "Notifications on" : "Notifications are off. You can turn them on in Settings.")} style={${BTN}}>
        <Text>Turn on notifications</Text>
      </Pressable>
      <Pressable accessibilityRole="button" onPress={() => fetch("https://api.example.com/orders/42/ship", { method: "POST" })} style={${BTN}}>
        <Text>(Shop staff) Ship order #42</Text>
      </Pressable>
      <Text testID="status">{status}</Text>
    </View>
  );
}
`;

/* ── 16.6 · Local notifications ──────────────────────────────────────── */
const REMIND_START = `import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";

const KEY = "rent_reminder_id";

/** Schedules (or re-schedules) a daily reminder at hour:minute. Only one ever exists. */
export async function setDailyReminder(hour: number, minute: number): Promise<void> {}

/** Cancels the daily reminder, if there is one. */
export async function cancelDailyReminder(): Promise<void> {}

/** A one-off reminder in the given number of seconds. */
export async function remindIn(seconds: number, title: string): Promise<void> {}
`;
const REMIND_MODEL = `import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";

const KEY = "rent_reminder_id";

/** Schedules (or re-schedules) a daily reminder at hour:minute. Only one ever exists. */
export async function setDailyReminder(hour: number, minute: number): Promise<void> {
  // Cancel the old one first, or every change would add another daily reminder.
  await cancelDailyReminder();
  const id = await Notifications.scheduleNotificationAsync({
    content: { title: "Rent savings", body: "Put something aside for rent today." },
    trigger: { type: Notifications.SchedulableTriggerInputTypes.DAILY, hour, minute },
  });
  await AsyncStorage.setItem(KEY, id);
}

/** Cancels the daily reminder, if there is one. */
export async function cancelDailyReminder(): Promise<void> {
  const id = await AsyncStorage.getItem(KEY);
  if (id) await Notifications.cancelScheduledNotificationAsync(id);
  await AsyncStorage.removeItem(KEY);
}

/** A one-off reminder in the given number of seconds. */
export async function remindIn(seconds: number, title: string): Promise<void> {
  await Notifications.scheduleNotificationAsync({
    content: { title },
    trigger: { type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL, seconds },
  });
}
`;
const REMIND_SCREEN = `import * as Notifications from "expo-notifications";
import { Pressable, Text, View } from "react-native";
import { cancelDailyReminder, remindIn, setDailyReminder } from "@/notifications/reminders";

export default function Reminders() {
  const ask = async () => (await Notifications.requestPermissionsAsync()).status === "granted";
  return (
    <View style={{ padding: 20, gap: 10 }}>
      <Pressable accessibilityRole="button" onPress={async () => (await ask()) && setDailyReminder(9, 0)} style={${BTN}}><Text>Remind me daily at 9:00</Text></Pressable>
      <Pressable accessibilityRole="button" onPress={async () => (await ask()) && setDailyReminder(18, 30)} style={${BTN}}><Text>Change to 18:30</Text></Pressable>
      <Pressable accessibilityRole="button" onPress={cancelDailyReminder} style={${BTN}}><Text>Stop daily reminders</Text></Pressable>
      <Pressable accessibilityRole="button" onPress={async () => (await ask()) && remindIn(3600, "Your delivery arrives soon")} style={${BTN}}><Text>Remind me in an hour</Text></Pressable>
    </View>
  );
}
`;

/* ── 16.7 · Documents ────────────────────────────────────────────────── */
const DOC_START = `import * as DocumentPicker from "expo-document-picker";
import { File } from "expo-file-system";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";

/** Reads a CSV of "item,amount" lines (with a header row) and totals the amounts. */
export function totalOf(csv: string): number {
  return 0;
}

export default function ImportBudget() {
  const [result, setResult] = useState("");
  async function importFile() {}
  return (
    <View style={{ padding: 20, gap: 12 }}>
      <Pressable accessibilityRole="button" onPress={importFile} style={${BTN}}><Text>Import a budget (CSV)</Text></Pressable>
      <Text testID="result">{result}</Text>
    </View>
  );
}
`;
const DOC_MODEL = `import * as DocumentPicker from "expo-document-picker";
import { File } from "expo-file-system";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";

/** Reads a CSV of "item,amount" lines (with a header row) and totals the amounts. */
export function totalOf(csv: string): number {
  return csv
    .trim()
    .split(/\\r?\\n/)
    .slice(1)
    .map((line) => Number(line.split(",")[1]))
    .filter((n) => Number.isFinite(n))
    .reduce((sum, n) => sum + n, 0);
}

export default function ImportBudget() {
  const [result, setResult] = useState("");
  async function importFile() {
    const picked = await DocumentPicker.getDocumentAsync({ type: ["text/csv", "text/comma-separated-values"], copyToCacheDirectory: true });
    if (picked.canceled) return;
    const doc = picked.assets[0];
    if (!doc.name.toLowerCase().endsWith(".csv")) {
      setResult("Please choose a .csv file");
      return;
    }
    // expo-file-system's File reads the copy in the app's cache.
    const text = await new File(doc.uri).text();
    setResult(doc.name + ": total ₦" + totalOf(text).toLocaleString("en-NG"));
  }
  return (
    <View style={{ padding: 20, gap: 12 }}>
      <Pressable accessibilityRole="button" onPress={importFile} style={${BTN}}><Text>Import a budget (CSV)</Text></Pressable>
      <Text testID="result">{result}</Text>
    </View>
  );
}
`;

/* ── 16.8 · Sharing ──────────────────────────────────────────────────── */
const SHARE_START = `import * as Sharing from "expo-sharing";
import { Pressable, Share, Text, View } from "react-native";

const RECEIPT_PDF = "file:///storage/Documents/receipt-march.pdf";

export default function Receipt() {
  async function shareLink() {}
  async function shareFile() {}
  return (
    <View style={{ padding: 20, gap: 12 }}>
      <Text>Order #42 · ₦18,000</Text>
      <Pressable accessibilityRole="button" onPress={shareLink} style={${BTN}}><Text>Share order link</Text></Pressable>
      <Pressable accessibilityRole="button" onPress={shareFile} style={${BTN}}><Text>Share receipt (PDF)</Text></Pressable>
    </View>
  );
}
`;
const SHARE_MODEL = `import * as Sharing from "expo-sharing";
import { Alert, Pressable, Share, Text, View } from "react-native";

const RECEIPT_PDF = "file:///storage/Documents/receipt-march.pdf";

export default function Receipt() {
  async function shareLink() {
    // Text and links: React Native's Share opens the system share sheet.
    await Share.share({ message: "My Kobo order #42 is on its way: https://kobo.example/orders/42", title: "Order #42" });
  }
  async function shareFile() {
    // Files: expo-sharing shares the file itself (the user picks the app).
    if (!(await Sharing.isAvailableAsync())) {
      Alert.alert("Sharing isn't available on this device");
      return;
    }
    await Sharing.shareAsync(RECEIPT_PDF, { mimeType: "application/pdf", dialogTitle: "Share receipt", UTI: "com.adobe.pdf" });
  }
  return (
    <View style={{ padding: 20, gap: 12 }}>
      <Text>Order #42 · ₦18,000</Text>
      <Pressable accessibilityRole="button" onPress={shareLink} style={${BTN}}><Text>Share order link</Text></Pressable>
      <Pressable accessibilityRole="button" onPress={shareFile} style={${BTN}}><Text>Share receipt (PDF)</Text></Pressable>
    </View>
  );
}
`;

/* ── 16.9 · Clipboard ────────────────────────────────────────────────── */
const CLIP_START = `import * as Clipboard from "expo-clipboard";
import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";

const CODE = "ADA-K7Q2";

export default function Invite() {
  const [entered, setEntered] = useState("");
  return (
    <View style={{ padding: 20, gap: 12 }}>
      <Text>Your invite code: {CODE}</Text>
      <Pressable accessibilityRole="button" style={${BTN}}><Text>Copy code</Text></Pressable>
      <TextInput placeholder="Friend's code" value={entered} onChangeText={setEntered} autoCapitalize="characters" style={{ minHeight: 48, borderWidth: 1, borderColor: "#cbd5e1", borderRadius: 10, paddingHorizontal: 12 }} />
      <Pressable accessibilityRole="button" style={${BTN}}><Text>Paste</Text></Pressable>
    </View>
  );
}
`;
const CLIP_MODEL = `import * as Clipboard from "expo-clipboard";
import { useEffect, useState } from "react";
import { AccessibilityInfo, Pressable, Text, TextInput, View } from "react-native";

const CODE = "ADA-K7Q2";

export default function Invite() {
  const [entered, setEntered] = useState("");
  const [copied, setCopied] = useState(false);

  async function copy() {
    await Clipboard.setStringAsync(CODE);
    setCopied(true);
    // Tell screen-reader users too: the label change alone isn't announced.
    AccessibilityInfo.announceForAccessibility("Code copied");
  }

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(t);
  }, [copied]);

  async function paste() {
    // Read the clipboard only when the user asks: iOS shows a paste prompt, and reading it uninvited is a privacy issue.
    const text = await Clipboard.getStringAsync();
    setEntered(text.trim().toUpperCase());
  }

  return (
    <View style={{ padding: 20, gap: 12 }}>
      <Text>Your invite code: {CODE}</Text>
      <Pressable accessibilityRole="button" onPress={copy} style={${BTN}}><Text>{copied ? "Copied" : "Copy code"}</Text></Pressable>
      <TextInput placeholder="Friend's code" value={entered} onChangeText={setEntered} autoCapitalize="characters" style={{ minHeight: 48, borderWidth: 1, borderColor: "#cbd5e1", borderRadius: 10, paddingHorizontal: 12 }} />
      <Pressable accessibilityRole="button" onPress={paste} style={${BTN}}><Text>Paste</Text></Pressable>
    </View>
  );
}
`;

export const PART1 = [
  /* ═══════════════ LESSON 98 · 16.1 – 16.2 ═══════════════ */
  {
    id: "md-l98-camera-images",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 1,
    covers: ["16.1", "16.2"],
    title: "The Camera, the Gallery and Image Uploads",
    subtitle: "Taking and choosing photos, and making them small enough to send",
    estimatedMinutes: 55,
    intro: "This module is about what makes a phone more than a screen: its camera, location, notifications and sensors. Each comes with a permission, a battery cost and a privacy responsibility.",
    atoms: [
      {
        id: "a-md-camera",
        title: "Camera and gallery access",
        explain:
          "Two ways in. To CHOOSE an existing photo, expo-image-picker's launchImageLibraryAsync opens the system photo picker, which needs no permission (the user picks; your app sees only what they chose). To TAKE a photo inside your screen, expo-camera's CameraView shows a live preview and ref.takePictureAsync({ quality }) captures; it needs camera permission: useCameraPermissions() returns [permission, requestPermission], where permission is null while loading. Ask at the moment it's needed, after saying why. On iOS the system prompt shows your reason from app.json (the expo-camera plugin's cameraPermission, i.e. NSCameraUsageDescription), and App Review rejects vague reasons; Android shows its own wording. Permission changes only take effect in a new development or store build, not in Expo Go.",
        webLab: expoLab({
          name: "Kobo Reports",
          layout: titled("Report photo"),
          editable: ["app.json"],
          task:
            "Build the photo screen: with useCameraPermissions, show \"Kobo needs the camera to photograph your report.\" and an \"Allow camera\" button until granted, then a CameraView with \"Take photo\" (takePictureAsync with quality 0.7); always offer \"Choose from library\" (images only); after either, show the photo (accessibilityLabel \"Photo preview\") with \"Retake\". In app.json, add the expo-camera plugin with cameraPermission \"Allow Kobo to use your camera to photograph reports.\".",
          files: { "src/app/index.tsx": CAMERA_START },
          solution: { "src/app/index.tsx": CAMERA_MODEL, "app.json": appJson("Kobo Reports", { plugins: CAMERA_APP_JSON_PLUGIN }) },
          tests: [
            { label: "Permission is asked with a reason, then the camera takes a photo", check: "await waitFor(() => has('Allow camera'), 3000); const why = has('Kobo needs the camera to photograph your report.'); await press('Allow camera'); await allow(); await waitFor(() => has('Take photo'), 3000); await press('Take photo'); await waitFor(() => exists({ label: 'Photo preview' }), 3000); return why;", fail: "requestPermission from useCameraPermissions; ref.takePictureAsync({ quality: 0.7 })." },
            { label: "Retake goes back; the library works too", check: "await waitFor(() => has('Retake'), 3000); await press('Retake'); await waitFor(() => has('Choose from library'), 3000); await press('Choose from library'); await pickPhoto(3); await waitFor(() => exists({ label: 'Photo preview' }), 3000); return true;", fail: "launchImageLibraryAsync({ mediaTypes: [\"images\"] }), then show it." },
            { label: "Choosing from the library needs no permission", device: { permissions: { camera: "denied" } }, check: "await waitFor(() => has('Choose from library'), 3000); await press('Choose from library'); await pickPhoto(1); await waitFor(() => exists({ label: 'Photo preview' }), 3000); return true;", fail: "Keep the library button visible without camera permission." },
            { label: "app.json explains why the camera is needed", check: "const p = (config().plugins || []).find((x) => (Array.isArray(x) ? x[0] : x) === 'expo-camera'); return Array.isArray(p) && p[1].cameraPermission === 'Allow Kobo to use your camera to photograph reports.';", fail: "plugins: [[\"expo-camera\", { cameraPermission: \"…\" }]]" },
          ],
          hint: "permission is null while loading: render nothing until it isn't.",
          successMessage: "Photos taken in the app, or chosen from the library, with permission asked at the right moment.",
        }),
      },
      {
        id: "a-md-image-compress",
        title: "Image selection, compression, and uploads",
        explain:
          "A modern phone photo is 4000 × 3000 pixels and 3–6 MB: slow and expensive to upload on mobile data, and far bigger than any screen needs. Before uploading, RESIZE and COMPRESS with expo-image-manipulator: ImageManipulator.manipulate(uri), .resize({ width }) on the longer side (the other side follows, keeping the shape), await .renderAsync(), then .saveAsync({ compress: 0.7, format: SaveFormat.JPEG }) for a new file. 1280–2048 pixels on the long side and quality 0.6–0.8 look the same on a phone at a tenth of the size. (The picker's own quality option helps on iOS only.) Upload the new file's uri as multipart/form-data (Module 13), and let the server enforce a limit too.",
        webLab: expoLab({
          name: "Kobo Reports",
          layout: titled("Upload"),
          task:
            "The server refuses photos over 1 MB. Write prepareForUpload in src/media/prepare.ts: resize so the LONGER side is at most 1280 pixels (keeping the shape; don't enlarge small photos), then save as a JPEG at compress 0.7, returning the new uri, width and height.",
          files: { "src/media/prepare.ts": PREPARE_START, "src/app/index.tsx": COMPRESS_SCREEN, "server/index.js": COMPRESS_SERVER },
          readOnly: ["src/app/index.tsx", "server/index.js"],
          solution: { "src/media/prepare.ts": PREPARE_MODEL },
          tests: [
            { label: "A landscape photo uploads at 1280 wide", check: "await press('Upload a photo'); await pickPhoto(1); await waitFor(() => hasText('Uploaded'), 3000); return find({ testID: 'status' }).textContent === 'Uploaded 1280×960';", fail: "resize({ width: 1280 }) when width is the longer side." },
            { label: "A portrait photo is limited by its height", check: "await press('Upload a photo'); await pickPhoto(2); await waitFor(() => hasText('Uploaded 960'), 3000); return find({ testID: 'status' }).textContent === 'Uploaded 960×1280';", fail: "resize({ height: 1280 }) when height is the longer side." },
            { label: "Small photos aren't enlarged, and everything is compressed", check: "const { prepareForUpload } = load('src/media/prepare.ts'); const small = await prepareForUpload({ uri: 'file:///var/mobile/Media/0004-IMG_4104.JPG', width: 1080, height: 1080 }); const c = code('src/media/prepare.ts'); return small.width === 1080 && small.height === 1080 && small.uri !== 'file:///var/mobile/Media/0004-IMG_4104.JPG' && /compress:\\s*0\\.7/.test(c);", fail: "Only resize when the longest side is over 1280; always saveAsync({ compress: 0.7 })." },
          ],
          hint: "manipulate(uri) → resize → renderAsync() → saveAsync({ compress, format }).",
          successMessage: "Photos a tenth of the size, with no visible difference on a phone.",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════ LESSON 99 · 16.3 – 16.4 ═══════════════ */
  {
    id: "md-l99-location-maps",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 2,
    covers: ["16.3", "16.4"],
    title: "Location and Maps",
    subtitle: "Where the user is, and what's near them",
    estimatedMinutes: 55,
    intro: "Location turns an app into a guide: the nearest shop, the delivery's route, a report's exact spot. It is also one of the most sensitive things a phone knows.",
    atoms: [
      {
        id: "a-md-location",
        title: "Location permissions and GPS",
        explain:
          "expo-location: requestForegroundPermissionsAsync() first (Android also lets users grant only APPROXIMATE location; iOS can too), then getCurrentPositionAsync({ accuracy }) for one reading or watchPositionAsync(options, callback) for updates, which returns a subscription you must remove() when done. Choose the LOWEST accuracy that works: Balanced (about 100 m, Wi-Fi and cell towers) is enough for an address and far kinder to the battery than High (GPS); use distanceInterval so updates come only after real movement. reverseGeocodeAsync(coords) turns coordinates into an address. Background location (requestBackgroundPermissionsAsync) is heavily restricted and reviewed by both stores: only ask if your core feature needs it. And if the user says no, the app must still work: let them type their area.",
        webLab: expoLab({
          name: "Kobo",
          layout: titled("Where am I?"),
          task:
            "Write the screen: \"Use my location\" asks for foreground permission, reads the position with Balanced accuracy, shows it rounded to 4 decimals (testID \"position\": \"6.5244, 3.3792\") and the address from reverseGeocodeAsync (testID \"place\": \"<name>, <city>\"); if permission is refused show \"Location is off for Kobo. You can still type your area.\". \"Track my route\" starts watchPositionAsync (Balanced, distanceInterval 20), updating the position, and becomes \"Stop tracking\", which removes the subscription (also removed when the screen closes).",
          files: { "src/app/index.tsx": LOCATION_START },
          solution: { "src/app/index.tsx": LOCATION_MODEL },
          tests: [
            { label: "The position and address are shown", check: "await press('Use my location'); await allow(); await waitFor(() => hasText('Lagos'), 3000); return find({ testID: 'place' }).textContent === '12 Broad Street, Lagos' && find({ testID: 'position' }).textContent === '6.5244, 3.3792';", fail: "getCurrentPositionAsync, then reverseGeocodeAsync(coords)." },
            { label: "Tracking follows movement, and stops when asked", check: "await press('Track my route'); await waitFor(() => has('Stop tracking'), 3000); await setLocation(6.5300, 3.3800); await waitFor(() => find({ testID: 'position' }).textContent === '6.5300, 3.3800', 3000); await press('Stop tracking'); await setLocation(6.6000, 3.3500); await wait(300); return find({ testID: 'position' }).textContent === '6.5300, 3.3800';", fail: "Keep the subscription from watchPositionAsync; remove() it to stop." },
            { label: "Refusing location still leaves a way forward", device: { permissions: { location: "undetermined" } }, check: "await press('Use my location'); await deny(); await waitFor(() => hasText('Location is off'), 3000); return find({ testID: 'place' }).textContent === 'Location is off for Kobo. You can still type your area.';", fail: "Check the status and say what the user can do instead." },
            { label: "Battery-friendly accuracy", check: "const c = code('src/app/index.tsx'); return c.includes('Accuracy.Balanced') && !c.includes('Accuracy.Highest') && /distanceInterval/.test(c);", fail: "Accuracy.Balanced and a distanceInterval." },
          ],
          hint: "Location.LocationSubscription is the type of what watchPositionAsync returns.",
          successMessage: "Location used carefully: asked for, battery-aware, and optional.",
        }),
      },
      {
        id: "a-md-maps",
        title: "Maps and location-based features",
        explain:
          "react-native-maps draws native maps (Apple Maps on iOS, Google Maps on Android; Google Maps on Android needs an API key in app.json for builds; Expo Go includes one for development). MapView takes an initialRegion (centre plus latitudeDelta/longitudeDelta, the zoom) and children: Marker (coordinate, title, onPress), Polyline, Polygon, Circle; showsUserLocation shows the blue dot once location permission is granted. Many location features are simple maths: the HAVERSINE formula gives the distance between two coordinates over the Earth's curve, enough to find and sort the nearest places. For anything with many points, ask the server (a spatial query such as PostGIS's ST_DWithin) rather than downloading everything.",
        webLab: expoLab({
          name: "Kobo",
          layout: titled("Shops"),
          task:
            "Write distanceKm in src/utils/geo.ts with the haversine formula (Earth radius 6371 km). Then the screen: a MapView (showsUserLocation) with a Marker for each shop (testID \"shop\", title the shop's name, tapping it shows \"Selected: <name>\"), and once location is allowed, \"Nearest: <name> · <km to 1 decimal> km\" (testID \"nearest\").",
          files: { "src/utils/geo.ts": GEO_START, "src/app/index.tsx": MAP_START, "src/data/shops.ts": SHOPS },
          readOnly: ["src/data/shops.ts"],
          solution: { "src/utils/geo.ts": GEO_MODEL, "src/app/index.tsx": MAP_MODEL },
          tests: [
            { label: "distanceKm is right", check: "const { distanceKm } = load('src/utils/geo.ts'); const lagosAbuja = distanceKm({ latitude: 6.5244, longitude: 3.3792 }, { latitude: 9.0765, longitude: 7.3986 }); const same = distanceKm({ latitude: 6.5, longitude: 3.3 }, { latitude: 6.5, longitude: 3.3 }); return Math.abs(lagosAbuja - 524.7) < 2 && same === 0;", fail: "2 × 6371 × asin(√(sin²(Δφ/2) + cos φ1 · cos φ2 · sin²(Δλ/2)))" },
            { label: "Every shop is on the map, and tapping one selects it", check: "await allow(); await waitFor(() => findAll({ testID: 'shop' }).length === 3, 3000); await press({ role: 'button', name: 'Kobo Ikeja' }); return has('Selected: Kobo Ikeja');", fail: "<Marker testID=\"shop\" title={s.name} onPress={…} /> for each shop." },
            { label: "The nearest shop is found", check: "await waitFor(() => exists({ testID: 'nearest' }), 3000); return find({ testID: 'nearest' }).textContent === 'Nearest: Kobo Yaba · 1.9 km';", fail: "Sort SHOPS by distanceKm from the current position." },
          ],
          hint: "Convert degrees to radians before using Math.sin and Math.cos.",
          successMessage: "A map of shops, and the nearest one worked out from where the user stands.",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════ LESSON 100 · 16.5 – 16.6 ═══════════════ */
  {
    id: "md-l100-notifications",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 3,
    covers: ["16.5", "16.6"],
    title: "Push and Local Notifications",
    subtitle: "Messages from your server, and reminders set on the phone",
    estimatedMinutes: 60,
    intro: "A notification is the one way an app can reach someone who isn't looking at it. Used well, it brings them back; overused, it gets the app uninstalled.",
    atoms: [
      {
        id: "a-md-push",
        title: "Push notifications",
        explain:
          "PUSH notifications are sent by your SERVER through the platforms' services (Apple Push Notification service and Firebase Cloud Messaging); Expo's push service sends to both with one token type. In the app: on Android create a notification CHANNEL first (users control channels separately); ask permission (Android 13+ and iOS both ask) at a meaningful moment, explaining the benefit; get the token with Notifications.getExpoPushTokenAsync({ projectId }) (the EAS project id from app.json's extra.eas.projectId); and send it to your server, which stores it per user and device. The server POSTs { to, title, body, data } to https://exp.host/--/api/v2/push/send (and later checks the receipts for invalid tokens). Push needs a development or store build: Expo Go on Android no longer supports it, and iOS needs your Apple push credentials, which EAS sets up. Tapping one is handled as in Module 9.",
        webLab: expoLab({
          name: "Kobo",
          layout: titled("Notifications"),
          app: { extra: { eas: { projectId: "1b3c9e70-4f2a-4d6b-9a8e-2f6c0d1e5a77" } } },
          device: { build: "development", os: "android" },
          task:
            "Write registerForPush in src/notifications/register.ts: on Android create the \"default\" channel (name \"Orders\", HIGH importance) first; check, then if needed request, notification permission (return null if not granted); get the Expo push token with the projectId from Constants.expoConfig.extra.eas.projectId; POST { token } to https://api.example.com/devices; return the token. The server then sends a push when the order ships. This phone is an Android development build.",
          files: { "src/notifications/register.ts": PUSH_START, "src/app/index.tsx": PUSH_SCREEN, "server/index.js": PUSH_SERVER },
          readOnly: ["src/app/index.tsx", "server/index.js"],
          solution: { "src/notifications/register.ts": PUSH_MODEL },
          tests: [
            { label: "The phone registers its token with the server", check: "await press('Turn on notifications'); await allow(); await waitFor(() => has('Notifications on'), 3000); const devices = await (await fetch('https://api.example.com/debug/devices')).json(); return devices.length === 1 && devices[0] === pushToken();", fail: "getExpoPushTokenAsync({ projectId }), then POST it." },
            { label: "Android gets a channel first", check: "const ch = channels(); return ch.length >= 1 && ch.some((c) => c.id === 'default' && c.name === 'Orders');", fail: "setNotificationChannelAsync(\"default\", { name: \"Orders\", importance: HIGH })" },
            { label: "When the order ships, the push arrives", check: "await press('(Shop staff) Ship order #42'); await waitFor(() => notifications().some((n) => n.title === 'Your order has shipped'), 3000); return notifications().find((n) => n.title === 'Your order has shipped').remote === true;", fail: "Registered tokens receive the server's push." },
            { label: "Saying no is respected", device: { build: "development", os: "android", permissions: { notifications: "undetermined" } }, check: "await press('Turn on notifications'); await deny(); await waitFor(() => hasText('Notifications are off'), 3000); return (await (await fetch('https://api.example.com/debug/devices')).json()).length === 0;", fail: "Return null without a token when permission isn't granted." },
          ],
          hint: "let { status } = await getPermissionsAsync(); request only if it isn't granted.",
          successMessage: "A phone that registers for push, and a server that can reach it.",
        }),
      },
      {
        id: "a-md-local-notifications",
        title: "Local notifications and reminders",
        explain:
          "LOCAL notifications are scheduled by the app itself, with no server: reminders, timers, a daily nudge. Notifications.scheduleNotificationAsync({ content, trigger }) returns an id; triggers include TIME_INTERVAL (seconds from now), DATE (a moment), DAILY (hour, minute), WEEKLY and CALENDAR. They still need notification permission. Keep their ids (AsyncStorage) so you can cancelScheduledNotificationAsync(id) or replace them: re-scheduling without cancelling is the classic bug that sends the same reminder three times a day. getAllScheduledNotificationsAsync() lists what's pending. Android limits how many can be scheduled and may delay exact times to save battery; iOS keeps at most 64 pending. Let users choose the time, and turn reminders off easily.",
        webLab: expoLab({
          name: "Kobo",
          layout: titled("Reminders"),
          device: { permissions: { notifications: "granted" } },
          task:
            "Write src/notifications/reminders.ts: setDailyReminder(hour, minute) cancels any existing daily reminder, schedules a DAILY one (title \"Rent savings\", body \"Put something aside for rent today.\") and saves its id in AsyncStorage (key \"rent_reminder_id\"); cancelDailyReminder() cancels it and forgets the id; remindIn(seconds, title) schedules a one-off TIME_INTERVAL reminder.",
          files: { "src/notifications/reminders.ts": REMIND_START, "src/app/index.tsx": REMIND_SCREEN },
          readOnly: ["src/app/index.tsx"],
          solution: { "src/notifications/reminders.ts": REMIND_MODEL },
          tests: [
            { label: "A daily reminder is scheduled at 9:00", check: "await press('Remind me daily at 9:00'); await wait(300); const s = scheduled().filter((x) => x.title === 'Rent savings'); return s.length === 1 && s[0].trigger.type === 'daily' && s[0].trigger.hour === 9 && s[0].trigger.minute === 0 && asyncStore().rent_reminder_id === s[0].id;", fail: "scheduleNotificationAsync with a DAILY trigger, and save the id." },
            { label: "Changing the time replaces it, rather than adding another", check: "await press('Change to 18:30'); await wait(300); const s = scheduled().filter((x) => x.title === 'Rent savings'); return s.length === 1 && s[0].trigger.hour === 18 && s[0].trigger.minute === 30;", fail: "cancelDailyReminder() before scheduling the new one." },
            { label: "Stopping cancels it", check: "await press('Stop daily reminders'); await wait(300); return scheduled().filter((x) => x.title === 'Rent savings').length === 0 && !('rent_reminder_id' in asyncStore());", fail: "cancelScheduledNotificationAsync(id), then removeItem." },
            { label: "A one-off reminder fires on time", check: "await press('Remind me in an hour'); await wait(200); await advance(3601); await waitFor(() => notifications().some((n) => n.title === 'Your delivery arrives soon'), 3000); return true;", fail: "A TIME_INTERVAL trigger with seconds." },
          ],
          hint: "Notifications.SchedulableTriggerInputTypes.DAILY and .TIME_INTERVAL.",
          successMessage: "Reminders that fire on time, change cleanly and never multiply.",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════ LESSON 101 · 16.7 – 16.9 ═══════════════ */
  {
    id: "md-l101-files-share-clipboard",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 4,
    covers: ["16.7", "16.8", "16.9"],
    title: "Files, Sharing and the Clipboard",
    subtitle: "Getting documents in, sending things out, and copying with care",
    estimatedMinutes: 55,
    intro: "Apps don't live alone: they import files, share receipts and links, and copy codes. The system provides the doors; your app should use them politely.",
    atoms: [
      {
        id: "a-md-documents",
        title: "Document and file selection",
        explain:
          "expo-document-picker's getDocumentAsync({ type, copyToCacheDirectory: true }) opens the system file picker (Files on iOS, the document picker on Android) with optional MIME types such as \"application/pdf\" or \"text/csv\", and returns { canceled, assets: [{ uri, name, mimeType, size }] }. Read or move the file with expo-file-system: new File(uri).text() reads text, .bytes() binary, and Paths.document and Paths.cache are the app's own folders (documents are kept; the cache can be cleared by the system). Always handle cancelling, check the type and size yourself (pickers' filters are hints, and some Android pickers ignore them), and parse defensively: real files have blank lines, headers and odd values.",
        webLab: expoLab({
          name: "Kobo",
          layout: titled("Import"),
          task:
            "Write totalOf(csv) (skip the header row; sum the second column, ignoring lines that aren't numbers) and the import: pick a CSV with getDocumentAsync (types \"text/csv\" and \"text/comma-separated-values\", copied to the cache), do nothing if cancelled, refuse files whose name doesn't end in .csv (\"Please choose a .csv file\"), read it with File and show \"<name>: total ₦<amount>\".",
          files: { "src/app/index.tsx": DOC_START },
          solution: { "src/app/index.tsx": DOC_MODEL },
          tests: [
            { label: "totalOf skips the header and bad lines", check: "const { totalOf } = load('src/app/index.tsx'); return totalOf('item,amount\\nRent,150000\\nTransport,25000\\n') === 175000 && totalOf('item,amount\\r\\nA,10\\r\\n\\r\\nB,oops\\r\\nC,5') === 15;", fail: "split lines, slice(1), Number(second column), filter finite." },
            { label: "A CSV is imported and totalled", check: "await press('Import a budget (CSV)'); await pickDocument('budget.csv'); await waitFor(() => hasText('total'), 3000); return find({ testID: 'result' }).textContent === 'budget.csv: total ₦175,000';", fail: "new File(doc.uri).text(), then totalOf." },
            { label: "Only CSV files are offered and accepted, and cancelling does nothing", check: "await restart(); await waitFor(() => has('Import a budget (CSV)'), 3000); await press('Import a budget (CSV)'); await cancel(); await wait(200); const c = code('src/app/index.tsx'); return (find({ testID: 'result' })?.textContent ?? '') === '' && c.includes('text/csv') && /\\.csv/.test(c);", fail: "type: [\"text/csv\", …], check the name ends in .csv, and if (picked.canceled) return;" },
          ],
          hint: "Export totalOf so it can be tested by itself.",
          successMessage: "Files in, checked and parsed defensively.",
        }),
      },
      {
        id: "a-md-sharing",
        title: "Sharing content from the app",
        explain:
          "Use the system SHARE SHEET, so users can send things to whatever apps they have (WhatsApp, Mail, Messages, Drive) without your app integrating each. React Native's Share.share({ message, url, title }) shares text and links (on iOS url is shared separately; on Android include the link in message). expo-sharing's Sharing.shareAsync(fileUri, { mimeType, dialogTitle, UTI }) shares a FILE such as a PDF receipt or a photo; check Sharing.isAvailableAsync() first. Share links that open your app (universal/app links, Module 17) so the receiver lands in the right place. Never share private data without the user choosing to.",
        webLab: expoLab({
          name: "Kobo",
          layout: titled("Receipt"),
          task:
            "\"Share order link\" shares the message \"My Kobo order #42 is on its way: https://kobo.example/orders/42\" (title \"Order #42\") with React Native's Share. \"Share receipt (PDF)\" checks Sharing.isAvailableAsync() and shares the PDF file with expo-sharing (mimeType \"application/pdf\", dialogTitle \"Share receipt\").",
          files: { "src/app/index.tsx": SHARE_START },
          solution: { "src/app/index.tsx": SHARE_MODEL },
          tests: [
            { label: "The link is shared through the system share sheet", check: "await press('Share order link'); await tap('WhatsApp'); await wait(200); const s = shares().pop(); return !!s && (s.message || '').includes('https://kobo.example/orders/42');", fail: "Share.share({ message, title })" },
            { label: "The PDF file itself is shared", check: "await press('Share receipt (PDF)'); await tap('Mail'); await wait(200); const s = shares().pop(); return s.url === 'file:///storage/Documents/receipt-march.pdf' && s.mimeType === 'application/pdf' && s.to === 'Mail';", fail: "Sharing.shareAsync(uri, { mimeType: \"application/pdf\" })" },
            { label: "Availability is checked", check: "return code('src/app/index.tsx').includes('isAvailableAsync');", fail: "if (!(await Sharing.isAvailableAsync())) …" },
          ],
          hint: "Share is from react-native; Sharing is expo-sharing.",
          successMessage: "Links and files sent anywhere the user likes, through the system's own sheet.",
        }),
      },
      {
        id: "a-md-clipboard",
        title: "Clipboard access",
        explain:
          "expo-clipboard: Clipboard.setStringAsync(text) to copy, getStringAsync() to read. COPYING should always give feedback: change the button to \"Copied\" for a moment and announce it for screen readers (AccessibilityInfo.announceForAccessibility). READING is a privacy matter: the clipboard may hold passwords or private messages, iOS shows a paste prompt (or banner) when an app reads it, and both stores frown on reading it uninvited. So read only when the user taps Paste (or use TextInput's own paste menu, which needs no code). Offer \"copy\" for things people copy often: codes, account numbers, addresses, links.",
        webLab: expoLab({
          name: "Kobo",
          layout: titled("Invite friends"),
          task:
            "\"Copy code\" copies ADA-K7Q2 with expo-clipboard, changes its label to \"Copied\" for 2 seconds and announces \"Code copied\" for screen readers. \"Paste\" (and only Paste: never on its own) reads the clipboard into the friend's code field, trimmed and in capitals.",
          files: { "src/app/index.tsx": CLIP_START },
          solution: { "src/app/index.tsx": CLIP_MODEL },
          tests: [
            { label: "Copying copies, with visible and spoken feedback", check: "await press('Copy code'); await wait(150); const ok = clipboard() === 'ADA-K7Q2' && has('Copied') && announcements().some((a) => String(a).includes('Code copied')); await wait(2200); return ok && has('Copy code');", fail: "setStringAsync, a 2-second \"Copied\" label, and announceForAccessibility." },
            { label: "Paste fills the field", check: "await press('Copy code'); await press('Paste'); await wait(150); return inputValue({ placeholder: \"Friend's code\" }) === 'ADA-K7Q2';", fail: "getStringAsync() when Paste is pressed." },
            { label: "The clipboard is only read when asked", check: "const c = code('src/app/index.tsx'); const reads = (c.match(/getStringAsync/g) || []).length; const inEffect = /useEffect\\([^)]*getStringAsync/s.test(c); return reads === 1 && !inEffect;", fail: "Read it in the Paste handler only." },
          ],
          hint: "A useEffect with setTimeout can reset the label; clear the timer in its clean-up.",
          successMessage: "Copying with feedback, pasting only on request.",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },
];
