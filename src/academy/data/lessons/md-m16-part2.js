/**
 * MOBILE APP DEVELOPMENT · MODULE 16 · ACCESSING MOBILE DEVICE CAPABILITIES (part 2)
 *
 * Curriculum 16.10 – 16.P: haptic feedback, biometric authentication,
 * permission denial and restricted access, background tasks and their
 * limits, battery, network and privacy, and the module practical.
 *
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 */

import { appJson, expoLab } from "./md-helpers.js";
import { MODULE, SECTION_ID, titled } from "./md-m16-part1.js";

const BTN = `{ minHeight: 48, justifyContent: "center", alignItems: "center", borderRadius: 12, borderWidth: 1, borderColor: "#cbd5e1" }`;

/* ── 16.10 · Haptics ─────────────────────────────────────────────────── */
const HAPTICS_START = `import * as Haptics from "expo-haptics";

let enabled = true;
/** The user's "Vibration" setting. */
export const setHapticsEnabled = (on: boolean) => {
  enabled = on;
};

/** Feedback for the moments that matter. Each does nothing when the user has turned vibration off. */
export const feedback = {
  /** A small change of choice (a stepper, a picker). */
  selection: async () => {},
  /** Something completed (a payment went through). */
  success: async () => {},
  /** Something failed. */
  error: async () => {},
};
`;
const HAPTICS_MODEL = `import * as Haptics from "expo-haptics";

let enabled = true;
/** The user's "Vibration" setting. */
export const setHapticsEnabled = (on: boolean) => {
  enabled = on;
};

/** Feedback for the moments that matter. Each does nothing when the user has turned vibration off. */
export const feedback = {
  /** A small change of choice (a stepper, a picker). */
  selection: async () => {
    if (enabled) await Haptics.selectionAsync();
  },
  /** Something completed (a payment went through). */
  success: async () => {
    if (enabled) await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  },
  /** Something failed. */
  error: async () => {
    if (enabled) await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
  },
};
`;
const HAPTICS_SCREEN = `import { useState } from "react";
import { Pressable, Switch, Text, View } from "react-native";
import { feedback, setHapticsEnabled } from "@/feedback/haptics";

export default function Pay() {
  const [qty, setQty] = useState(1);
  const [vibration, setVibration] = useState(true);
  const [result, setResult] = useState("");
  const pay = async (works: boolean) => {
    setResult(works ? "Payment successful" : "Card declined");
    await (works ? feedback.success() : feedback.error());
  };
  return (
    <View style={{ padding: 20, gap: 12 }}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
        <Pressable accessibilityRole="button" accessibilityLabel="More" onPress={() => { setQty((q) => q + 1); feedback.selection(); }} style={{ width: 48, height: 48, justifyContent: "center", alignItems: "center" }}><Text>+</Text></Pressable>
        <Text>Qty {qty}</Text>
      </View>
      <Pressable accessibilityRole="button" onPress={() => pay(true)} style={${BTN}}><Text>Pay with saved card</Text></Pressable>
      <Pressable accessibilityRole="button" onPress={() => pay(false)} style={${BTN}}><Text>Pay with expired card</Text></Pressable>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Text style={{ flex: 1 }}>Vibration</Text>
        <Switch accessibilityLabel="Vibration" value={vibration} onValueChange={(v) => { setVibration(v); setHapticsEnabled(v); }} />
      </View>
      <Text>{result}</Text>
    </View>
  );
}
`;

/* ── 16.11 · Biometrics ──────────────────────────────────────────────── */
const BIO_START = `import * as LocalAuthentication from "expo-local-authentication";
import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";

const PIN = "2468";

export default function Balance() {
  const [visible, setVisible] = useState(false);
  async function reveal() {
    setVisible(true);
  }
  return (
    <View style={{ padding: 20, gap: 12 }}>
      <Text testID="balance" style={{ fontSize: 28 }}>{visible ? "₦245,300" : "₦ • • • • •"}</Text>
      {!visible ? <Pressable accessibilityRole="button" onPress={reveal} style={${BTN}}><Text>Show balance</Text></Pressable> : null}
    </View>
  );
}
`;
const BIO_MODEL = `import * as LocalAuthentication from "expo-local-authentication";
import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";

const PIN = "2468";

export default function Balance() {
  const [visible, setVisible] = useState(false);
  const [askPin, setAskPin] = useState(false);
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");

  async function reveal() {
    setError("");
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    const enrolled = hasHardware && (await LocalAuthentication.isEnrolledAsync());
    // No Face ID / fingerprint set up: fall back to the app's own PIN.
    if (!enrolled) {
      setAskPin(true);
      return;
    }
    const result = await LocalAuthentication.authenticateAsync({ promptMessage: "Show your balance", cancelLabel: "Cancel" });
    if (result.success) setVisible(true);
    else if (result.error !== "user_cancel") setAskPin(true);
  }

  function checkPin() {
    if (pin === PIN) {
      setVisible(true);
      setAskPin(false);
    } else setError("That PIN is wrong");
  }

  return (
    <View style={{ padding: 20, gap: 12 }}>
      <Text testID="balance" style={{ fontSize: 28 }}>{visible ? "₦245,300" : "₦ • • • • •"}</Text>
      {!visible && !askPin ? <Pressable accessibilityRole="button" onPress={reveal} style={${BTN}}><Text>Show balance</Text></Pressable> : null}
      {askPin && !visible ? (
        <View style={{ gap: 8 }}>
          <TextInput placeholder="Enter your PIN" value={pin} onChangeText={setPin} keyboardType="number-pad" secureTextEntry maxLength={4} style={{ minHeight: 48, borderWidth: 1, borderColor: "#cbd5e1", borderRadius: 10, paddingHorizontal: 12 }} />
          <Pressable accessibilityRole="button" onPress={checkPin} style={${BTN}}><Text>Unlock</Text></Pressable>
          {error ? <Text accessibilityRole="alert">{error}</Text> : null}
        </View>
      ) : null}
    </View>
  );
}
`;
const BIO_PLUGIN = [["expo-local-authentication", { faceIDPermission: "Allow Kobo to use Face ID to protect your balance." }]];

/* ── 16.12 · Permission denial ───────────────────────────────────────── */
const DENY_START = `import { Camera, CameraView } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { Linking, Pressable, Text, View } from "react-native";

export default function Scan() {
  const [stage, setStage] = useState<"start" | "camera" | "photo">("start");

  async function startScan() {
    const { granted } = await Camera.requestCameraPermissionsAsync();
    if (granted) setStage("camera");
  }

  if (stage === "camera") return <CameraView style={{ flex: 1 }} />;
  if (stage === "photo") return <Text style={{ padding: 20 }}>Receipt photo chosen</Text>;
  return (
    <View style={{ padding: 20, gap: 12 }}>
      <Pressable accessibilityRole="button" onPress={startScan} style={${BTN}}><Text>Scan a receipt</Text></Pressable>
    </View>
  );
}
`;
const DENY_MODEL = `import { Camera, CameraView } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { useEffect, useState } from "react";
import { AppState, Linking, Pressable, Text, View } from "react-native";

type Stage = "start" | "explain" | "blocked" | "camera" | "photo";

export default function Scan() {
  const [stage, setStage] = useState<Stage>("start");

  async function startScan() {
    const current = await Camera.getCameraPermissionsAsync();
    if (current.granted) return setStage("camera");
    // Asked before and refused for good: only Settings can change it now.
    if (!current.canAskAgain) return setStage("blocked");
    // Explain first, then show the system prompt.
    setStage("explain");
  }

  async function askNow() {
    const result = await Camera.requestCameraPermissionsAsync();
    setStage(result.granted ? "camera" : result.canAskAgain ? "start" : "blocked");
  }

  async function choosePhoto() {
    const r = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ["images"] });
    if (!r.canceled) setStage("photo");
  }

  // Coming back from Settings: check again.
  useEffect(() => {
    const sub = AppState.addEventListener("change", async (state) => {
      if (state === "active" && stage === "blocked" && (await Camera.getCameraPermissionsAsync()).granted) setStage("camera");
    });
    return () => sub.remove();
  }, [stage]);

  if (stage === "camera") return <CameraView style={{ flex: 1 }} />;
  if (stage === "photo") return <Text style={{ padding: 20 }}>Receipt photo chosen</Text>;

  return (
    <View style={{ padding: 20, gap: 12 }}>
      {stage === "explain" ? (
        <>
          <Text>Kobo uses the camera only to scan receipts. Nothing is recorded.</Text>
          <Pressable accessibilityRole="button" onPress={askNow} style={${BTN}}><Text>Continue</Text></Pressable>
        </>
      ) : stage === "blocked" ? (
        <>
          <Text>Camera access is off for Kobo. You can turn it on in Settings.</Text>
          <Pressable accessibilityRole="button" onPress={() => Linking.openSettings()} style={${BTN}}><Text>Open Settings</Text></Pressable>
        </>
      ) : (
        <Pressable accessibilityRole="button" onPress={startScan} style={${BTN}}><Text>Scan a receipt</Text></Pressable>
      )}
      {/* The feature still works without the camera. */}
      <Pressable accessibilityRole="button" onPress={choosePhoto} style={${BTN}}><Text>Choose a photo instead</Text></Pressable>
    </View>
  );
}
`;

/* ── 16.13 · Background tasks ────────────────────────────────────────── */
const BG_SERVER = `import { createServer } from "practice-server";

const app = createServer();
const reports = [];

app.post("/reports", (req, res) => {
  reports.push(req.body);
  res.status(201).json({ ok: true });
});
app.get("/reports", (req, res) => res.json(reports));

export default app;
`;
const BG_OUTBOX = `import AsyncStorage from "@react-native-async-storage/async-storage";

export type Pending = { id: string; text: string };

export async function pending(): Promise<Pending[]> {
  return JSON.parse((await AsyncStorage.getItem("outbox")) || "[]");
}

export async function addPending(text: string) {
  await AsyncStorage.setItem("outbox", JSON.stringify([...(await pending()), { id: Date.now().toString(36), text }]));
}

/** Sends everything in the outbox; returns how many were sent. Throws when offline. */
export async function flush(): Promise<number> {
  const items = await pending();
  for (const item of items) {
    const r = await fetch("https://api.example.com/reports", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(item) });
    if (!r.ok) throw new Error("Upload failed");
  }
  await AsyncStorage.setItem("outbox", "[]");
  return items.length;
}
`;
const BG_TASK_START = `import * as BackgroundTask from "expo-background-task";
import * as TaskManager from "expo-task-manager";
import { flush } from "@/reports/outbox";

export const SYNC_TASK = "report-sync";

// 1. Define the task here, at the top level of this file (not inside a component).

/** 2. Register it to run about once an hour. */
export async function registerSync() {}
`;
const BG_TASK_MODEL = `import * as BackgroundTask from "expo-background-task";
import * as TaskManager from "expo-task-manager";
import { flush } from "@/reports/outbox";

export const SYNC_TASK = "report-sync";

// 1. Defined at the top level: when the OS wakes the app in the background,
//    no screen is mounted, but this file's code runs and the task is found.
TaskManager.defineTask(SYNC_TASK, async () => {
  try {
    await flush();
    return BackgroundTask.BackgroundTaskResult.Success;
  } catch {
    // Offline or failed: the outbox keeps the reports for next time.
    return BackgroundTask.BackgroundTaskResult.Failed;
  }
});

/** 2. Register it to run about once an hour. */
export async function registerSync() {
  const status = await BackgroundTask.getStatusAsync();
  if (status === BackgroundTask.BackgroundTaskStatus.Restricted) return;
  // minimumInterval is in minutes; the OS decides the actual time (15 minutes at the soonest).
  await BackgroundTask.registerTaskAsync(SYNC_TASK, { minimumInterval: 60 });
}
`;
const BG_LAYOUT = `import { Stack } from "expo-router";
import { useEffect } from "react";
// Importing the file defines the task (it must be imported where the app starts).
import { registerSync } from "@/tasks/sync";

export default function RootLayout() {
  useEffect(() => {
    registerSync();
  }, []);
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Reports" }} />
    </Stack>
  );
}
`;
const BG_SCREEN = `import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { addPending } from "@/reports/outbox";

export default function Reports() {
  const [text, setText] = useState("");
  const [saved, setSaved] = useState("");
  return (
    <View style={{ padding: 20, gap: 12 }}>
      <TextInput placeholder="Describe the problem" value={text} onChangeText={setText} style={{ minHeight: 48, borderWidth: 1, borderColor: "#cbd5e1", borderRadius: 10, paddingHorizontal: 12 }} />
      <Pressable accessibilityRole="button" onPress={async () => { await addPending(text); setText(""); setSaved("Saved. It will be sent automatically."); }} style={${BTN}}><Text>Save report</Text></Pressable>
      <Text>{saved}</Text>
    </View>
  );
}
`;

/* ── 16.P · The practical ────────────────────────────────────────────── */
const P_SERVER = `import { createServer } from "practice-server";

// The council's reports backend, complete.
const app = createServer();
const reports = [];
const devices = [];

app.post("/devices", (req, res) => {
  if (req.body?.token && !devices.includes(req.body.token)) devices.push(req.body.token);
  res.status(201).json({ ok: true });
});

// POST /reports, multipart: photo (file), description, latitude, longitude, address
app.post("/reports", (req, res) => {
  const f = req.body?.fields || {};
  const photo = (req.files || [])[0];
  if (!photo) return res.status(400).json({ message: "Add a photo of the problem" });
  if (photo.size > 1024 * 1024) return res.status(413).json({ message: "That photo is too large" });
  if (!String(f.description || "").trim()) return res.status(400).json({ message: "Describe the problem" });
  const report = {
    id: String(reports.length + 1),
    description: String(f.description).trim(),
    latitude: f.latitude ? Number(f.latitude) : null,
    longitude: f.longitude ? Number(f.longitude) : null,
    address: f.address || null,
    photoUrl: photo.url,
    photoWidth: photo.width,
    status: "Received",
  };
  reports.unshift(report);
  res.status(201).json(report);
});

app.get("/reports", (req, res) => res.json(reports));
app.get("/reports/:id", (req, res) => {
  const r = reports.find((x) => x.id === req.params.id);
  return r ? res.json(r) : res.status(404).json({ message: "Report not found" });
});

// The council's staff mark a report fixed: everyone registered is told.
app.post("/reports/:id/resolve", async (req, res) => {
  const r = reports.find((x) => x.id === req.params.id);
  if (!r) return res.status(404).json({ message: "Report not found" });
  r.status = "Fixed";
  const messages = devices.map((to) => ({ to, title: "Your report was fixed", body: r.description, data: { url: "/reports/" + r.id } }));
  if (messages.length) await fetch("https://exp.host/--/api/v2/push/send", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(messages) });
  res.json(r);
});

export default app;
`;
const P_MODEL = {
  "src/media/prepare.ts": `import { ImageManipulator, SaveFormat } from "expo-image-manipulator";

export async function prepareForUpload(photo: { uri: string; width: number; height: number }) {
  const context = ImageManipulator.manipulate(photo.uri);
  if (Math.max(photo.width, photo.height) > 1280) context.resize(photo.width >= photo.height ? { width: 1280 } : { height: 1280 });
  const saved = await (await context.renderAsync()).saveAsync({ compress: 0.7, format: SaveFormat.JPEG });
  return { uri: saved.uri, width: saved.width, height: saved.height };
}
`,
  "src/notifications/register.ts": `import Constants from "expo-constants";
import * as Notifications from "expo-notifications";
import { router } from "expo-router";
import { Platform } from "react-native";

export async function registerForPush() {
  if (Platform.OS === "android") await Notifications.setNotificationChannelAsync("default", { name: "Reports", importance: Notifications.AndroidImportance.HIGH });
  let { status } = await Notifications.getPermissionsAsync();
  if (status !== "granted") ({ status } = await Notifications.requestPermissionsAsync());
  if (status !== "granted") return null;
  const { data: token } = await Notifications.getExpoPushTokenAsync({ projectId: Constants.expoConfig?.extra?.eas?.projectId });
  await fetch("https://api.example.com/devices", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ token }) });
  return token;
}

/** Opens the report a tapped notification points to. */
export function listenForTaps() {
  const open = (n: Notifications.Notification) => {
    const url = n.request.content.data?.url;
    if (typeof url === "string") router.push(url as never);
  };
  const last = Notifications.getLastNotificationResponse();
  if (last?.notification) open(last.notification);
  return Notifications.addNotificationResponseReceivedListener((r) => open(r.notification));
}
`,
  "src/app/_layout.tsx": `import { Stack } from "expo-router";
import { useEffect } from "react";
import { listenForTaps, registerForPush } from "@/notifications/register";

export default function RootLayout() {
  useEffect(() => {
    registerForPush();
    const sub = listenForTaps();
    return () => sub.remove();
  }, []);
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "My reports" }} />
      <Stack.Screen name="new" options={{ title: "New report", presentation: "modal" }} />
      <Stack.Screen name="reports/[id]" options={{ title: "Report" }} />
    </Stack>
  );
}
`,
  "src/app/index.tsx": `import { Link, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { ScrollView, Text } from "react-native";

type Report = { id: string; description: string; status: string; address: string | null };

export default function Reports() {
  const [reports, setReports] = useState<Report[]>([]);
  useFocusEffect(
    useCallback(() => {
      fetch("https://api.example.com/reports").then((r) => r.json()).then(setReports);
    }, [])
  );
  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 8 }}>
      <Link href="/new" style={{ padding: 14, textAlign: "center", backgroundColor: "#0f766e", color: "#fff", borderRadius: 12 }}>New report</Link>
      {reports.length === 0 ? <Text>No reports yet</Text> : null}
      {reports.map((r) => (
        <Link key={r.id} href={{ pathname: "/reports/[id]", params: { id: r.id } }} testID="report" style={{ paddingVertical: 12 }}>
          {r.description} · {r.status}
        </Link>
      ))}
    </ScrollView>
  );
}
`,
  "src/app/new.tsx": `import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { router } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, Text, TextInput } from "react-native";
import { prepareForUpload } from "@/media/prepare";

type Photo = { uri: string; width: number; height: number };
type Place = { latitude: number; longitude: number; address: string };

export default function NewReport() {
  const [photo, setPhoto] = useState<Photo | null>(null);
  const [place, setPlace] = useState<Place | null>(null);
  const [locationNote, setLocationNote] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);

  async function addPhoto(source: "camera" | "library") {
    if (source === "camera") {
      const { granted } = await ImagePicker.requestCameraPermissionsAsync();
      if (!granted) return setError("Camera access is off. Choose a photo instead, or turn it on in Settings.");
    }
    const options: ImagePicker.ImagePickerOptions = { mediaTypes: ["images"] };
    const r = source === "camera" ? await ImagePicker.launchCameraAsync(options) : await ImagePicker.launchImageLibraryAsync(options);
    if (!r.canceled) setPhoto({ uri: r.assets[0].uri, width: r.assets[0].width, height: r.assets[0].height });
  }

  async function addLocation() {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") return setLocationNote("Location is off. Describe where it is instead.");
    const { coords } = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
    const [a] = await Location.reverseGeocodeAsync(coords);
    setPlace({ latitude: coords.latitude, longitude: coords.longitude, address: a ? a.name + ", " + a.city : "" });
  }

  async function submit() {
    if (sending) return;
    setError("");
    if (!photo) return setError("Add a photo of the problem");
    if (!description.trim()) return setError("Describe the problem");
    setSending(true);
    try {
      const ready = await prepareForUpload(photo);
      const form = new FormData();
      form.append("photo", { uri: ready.uri, name: "report.jpg", type: "image/jpeg" } as unknown as Blob);
      form.append("description", description.trim());
      if (place) {
        form.append("latitude", String(place.latitude));
        form.append("longitude", String(place.longitude));
        form.append("address", place.address);
      }
      const response = await fetch("https://api.example.com/reports", { method: "POST", body: form });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      router.back();
    } catch (e) {
      setError(e instanceof TypeError ? "You're offline. Try again when you have signal." : (e as Error).message);
    } finally {
      setSending(false);
    }
  }

  const button = { minHeight: 48, justifyContent: "center", alignItems: "center", borderRadius: 12, borderWidth: 1, borderColor: "#cbd5e1" } as const;
  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 10 }}>
      {photo ? <Image source={{ uri: photo.uri }} style={{ width: "100%", aspectRatio: 4 / 3, borderRadius: 12 }} accessibilityLabel="Report photo" /> : null}
      <Pressable accessibilityRole="button" onPress={() => addPhoto("camera")} style={button}><Text>Take a photo</Text></Pressable>
      <Pressable accessibilityRole="button" onPress={() => addPhoto("library")} style={button}><Text>Choose a photo</Text></Pressable>
      <Pressable accessibilityRole="button" onPress={addLocation} style={button}><Text>Use my location</Text></Pressable>
      {place ? <Text testID="address">{place.address}</Text> : null}
      {locationNote ? <Text>{locationNote}</Text> : null}
      <TextInput placeholder="Describe the problem" value={description} onChangeText={setDescription} style={{ minHeight: 48, borderWidth: 1, borderColor: "#cbd5e1", borderRadius: 10, paddingHorizontal: 12 }} />
      {error ? <Text accessibilityRole="alert">{error}</Text> : null}
      <Pressable accessibilityRole="button" disabled={sending} onPress={submit} style={{ ...button, backgroundColor: "#0f766e" }}><Text style={{ color: "#fff" }}>{sending ? "Sending…" : "Send report"}</Text></Pressable>
    </ScrollView>
  );
}
`,
  "src/app/reports/[id].tsx": `import { Image } from "expo-image";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";

type Report = { description: string; status: string; address: string | null; photoUrl: string };

export default function ReportScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [report, setReport] = useState<Report | null>(null);
  useEffect(() => {
    fetch("https://api.example.com/reports/" + id).then((r) => r.json()).then(setReport);
  }, [id]);
  if (!report) return <Text style={{ padding: 20 }}>Loading…</Text>;
  return (
    <View style={{ padding: 20, gap: 8 }}>
      <Image source={{ uri: report.photoUrl }} style={{ width: "100%", aspectRatio: 4 / 3, borderRadius: 12 }} accessibilityLabel="Report photo" />
      <Text style={{ fontSize: 18 }}>{report.description}</Text>
      <Text>{report.address ?? "No location"}</Text>
      <Text testID="status">Status: {report.status}</Text>
    </View>
  );
}
`,
};

export const PART2 = [
  /* ═══════════════ LESSON 102 · 16.10 – 16.11 ═══════════════ */
  {
    id: "md-l102-haptics-biometrics",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 5,
    covers: ["16.10", "16.11"],
    title: "Haptic Feedback and Biometric Authentication",
    subtitle: "Feeling the app respond, and unlocking with a face or a finger",
    estimatedMinutes: 50,
    intro: "Two small touches that make an app feel native: a gentle tap when something happens, and Face ID or a fingerprint where a password would be a chore.",
    atoms: [
      {
        id: "a-md-haptics",
        title: "Haptic feedback",
        explain:
          "expo-haptics gives three kinds of feedback: selectionAsync() (a light tick for changing a choice: steppers, pickers, toggles), impactAsync(ImpactFeedbackStyle.Light / Medium / Heavy) (something physical: a card snapping into place), and notificationAsync(NotificationFeedbackType.Success / Warning / Error) (an outcome: payment done, payment failed). Use them SPARINGLY, for moments that matter, and always paired with something visible (haptics alone are invisible to many users and absent on many devices). Respect the user: offer a setting to turn them off (and iOS's own system setting already silences them). Put them behind one small module, so the setting is honoured everywhere.",
        webLab: expoLab({
          name: "Kobo",
          layout: titled("Checkout"),
          task:
            "Write the feedback module in src/feedback/haptics.ts: selection() uses selectionAsync, success() and error() use notificationAsync with Success and Error; none of them does anything once setHapticsEnabled(false) has been called. The screen already calls them.",
          files: { "src/feedback/haptics.ts": HAPTICS_START, "src/app/index.tsx": HAPTICS_SCREEN },
          readOnly: ["src/app/index.tsx"],
          solution: { "src/feedback/haptics.ts": HAPTICS_MODEL },
          tests: [
            { label: "Each moment gets the right feel", check: "await press({ role: 'button', name: 'More' }); await press('Pay with saved card'); await press('Pay with expired card'); await wait(100); return haptics().join() === 'selection,notification:success,notification:error';", fail: "selectionAsync, notificationAsync(Success), notificationAsync(Error)." },
            { label: "Turning vibration off silences everything", check: "await toggle({ label: 'Vibration' }); const before = haptics().length; await press({ role: 'button', name: 'More' }); await press('Pay with saved card'); await wait(100); return haptics().length === before && has('Payment successful');", fail: "if (enabled) … in each function." },
          ],
          hint: "Haptics.NotificationFeedbackType.Success and .Error.",
          successMessage: "Feedback that feels native, and that the user controls.",
        }),
      },
      {
        id: "a-md-biometrics",
        title: "Biometric authentication where appropriate",
        explain:
          "expo-local-authentication: hasHardwareAsync() and isEnrolledAsync() tell you whether Face ID, Touch ID or a fingerprint is available and set up; authenticateAsync({ promptMessage }) shows the system prompt and returns { success } or an error (\"user_cancel\", \"authentication_failed\", \"not_enrolled\", \"lockout\"). Your app never sees the face or fingerprint: the OS only says yes or no. Use it to UNLOCK something the user already has (showing a balance, approving a payment, reopening a signed-in app), not as the account's only proof: biometrics prove the person holding the phone, so always keep a FALLBACK (a PIN or password) for phones without it, for when it fails, and for accessibility. On iOS, Face ID needs a reason in app.json (the plugin's faceIDPermission); without it, the app crashes in a build.",
        webLab: expoLab({
          name: "Kobo",
          layout: titled("Wallet"),
          editable: ["app.json"],
          task:
            "\"Show balance\": if the phone has biometrics set up, authenticateAsync with promptMessage \"Show your balance\"; on success show the balance; if the user cancels, keep it hidden; if biometrics aren't available or fail, show \"Enter your PIN\" (number pad, hidden, 4 digits) with \"Unlock\" (the PIN is 2468; a wrong one shows \"That PIN is wrong\"). In app.json add the expo-local-authentication plugin with faceIDPermission \"Allow Kobo to use Face ID to protect your balance.\".",
          files: { "src/app/index.tsx": BIO_START },
          solution: { "src/app/index.tsx": BIO_MODEL, "app.json": appJson("Kobo", { plugins: BIO_PLUGIN }) },
          tests: [
            { label: "Face ID unlocks the balance", check: "await press('Show balance'); await biometric('match'); await waitFor(() => find({ testID: 'balance' }).textContent === '₦245,300', 3000); return true;", fail: "authenticateAsync({ promptMessage: \"Show your balance\" }) → if success, show it." },
            { label: "Cancelling keeps it hidden", check: "await restart(); await waitFor(() => has('Show balance'), 3000); await press('Show balance'); await biometric('cancel'); await wait(300); return find({ testID: 'balance' }).textContent !== '₦245,300' && has('Show balance');", fail: "Do nothing on user_cancel." },
            { label: "Without biometrics, the PIN is the fallback", device: { biometrics: { enrolled: false } }, check: "await press('Show balance'); await waitFor(() => exists({ placeholder: 'Enter your PIN' }), 3000); await typeInto('Enter your PIN', '1111'); await press('Unlock'); const wrong = has('That PIN is wrong'); await typeInto('Enter your PIN', '2468'); await press('Unlock'); return wrong && find({ testID: 'balance' }).textContent === '₦245,300' && find({ placeholder: 'Enter your PIN' }) === null;", fail: "isEnrolledAsync() false → ask for the PIN." },
            { label: "app.json gives the Face ID reason", check: "const p = (config().plugins || []).find((x) => (Array.isArray(x) ? x[0] : x) === 'expo-local-authentication'); return Array.isArray(p) && p[1].faceIDPermission === 'Allow Kobo to use Face ID to protect your balance.';", fail: "[\"expo-local-authentication\", { faceIDPermission: \"…\" }]" },
          ],
          hint: "result.error === \"user_cancel\" means the user chose not to; anything else, offer the PIN.",
          successMessage: "Biometrics for convenience, a PIN for everyone, and the reason iOS requires.",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════ LESSON 103 · 16.12 – 16.14 ═══════════════ */
  {
    id: "md-l103-permissions-background",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 6,
    covers: ["16.12", "16.13", "16.14"],
    title: "Permissions, Background Work and Responsible Use",
    subtitle: "When users say no, when the app isn't open, and what it all costs",
    estimatedMinutes: 60,
    intro: "Every capability in this module can be refused, limited by the OS, or used too much. Handling that well is what separates a trusted app from an uninstalled one.",
    atoms: [
      {
        id: "a-md-permission-denial",
        title: "Handling permission denial and restricted access",
        explain:
          "Each permission has a STATUS (undetermined, granted, denied) and canAskAgain. Rules that keep users' trust: ask in CONTEXT (when they tap the feature), after a short explanation of why (a \"pre-prompt\" in your own UI); if they say no and canAskAgain is still true, you may ask again later; once it's false (iOS after the first refusal; Android after two, or \"Don't ask again\"), the system prompt won't appear: explain how to turn it on and offer Linking.openSettings(). Check again when the app returns to the foreground (AppState \"active\"), since they may have changed it in Settings. And DEGRADE GRACEFULLY: offer another way (choose a photo instead of scanning, type an address instead of GPS). Access can also be RESTRICTED by parental controls or company policies: treat it like a refusal. Never block the whole app over one permission.",
        webLab: expoLab({
          name: "Kobo",
          layout: titled("Scan"),
          device: { permissions: { camera: "undetermined" } },
          task:
            "Make \"Scan a receipt\" respect the camera permission: if already granted, open the camera; if it can still be asked, first show \"Kobo uses the camera only to scan receipts. Nothing is recorded.\" with \"Continue\", which shows the system prompt; if it's refused for good (canAskAgain false), show \"Camera access is off for Kobo. You can turn it on in Settings.\" and \"Open Settings\" (Linking.openSettings), and when the app comes back to the foreground with access now granted, open the camera. Always offer \"Choose a photo instead\".",
          files: { "src/app/index.tsx": DENY_START },
          solution: { "src/app/index.tsx": DENY_MODEL },
          tests: [
            { label: "The app explains before the system asks", check: "await press('Scan a receipt'); await waitFor(() => hasText('only to scan receipts'), 2000); const noPromptYet = !dialog(); await press('Continue'); await allow(); await waitFor(() => exists({ label: 'Map' }) || !!document.querySelector('[data-camera=back]'), 3000); return noPromptYet && !!document.querySelector('[data-camera=back]');", fail: "Show the explanation first; request on Continue." },
            { label: "Refused for good: Settings, and a way around", device: { permissions: { camera: { status: "denied", canAskAgain: false } } }, check: "await press('Scan a receipt'); await waitFor(() => hasText('Camera access is off'), 2000); await press('Open Settings'); await wait(200); const wasOpened = opened().includes('app-settings:'); await cancel(); await press('Choose a photo instead'); await pickPhoto(1); await waitFor(() => has('Receipt photo chosen'), 3000); return wasOpened;", fail: "canAskAgain false → Linking.openSettings(); the library still works." },
            { label: "Coming back from Settings with access opens the camera", device: { permissions: { camera: { status: "denied", canAskAgain: false } } }, check: "await restart(); await waitFor(() => has('Scan a receipt'), 3000); await press('Scan a receipt'); await waitFor(() => hasText('Camera access is off'), 2000); await background(); await setPermission('camera', 'granted'); await foreground(); await waitFor(() => !!document.querySelector('[data-camera=back]'), 3000); return true;", fail: "AppState \"change\" to \"active\": check again." },
          ],
          hint: "Camera.getCameraPermissionsAsync() tells you granted and canAskAgain without prompting.",
          successMessage: "Permissions asked politely, refusals respected, and the feature still works.",
        }),
      },
      {
        id: "a-md-background-tasks",
        title: "Background tasks and their platform limitations",
        explain:
          "When the user leaves your app, the OS suspends it within seconds to save battery; you can't simply keep running. Options, from most to least common: let the SERVER do the work and send a push (best for anything time-sensitive); finish quick work when the app returns (AppState \"active\"); or schedule DEFERRABLE work with expo-background-task: define the task with TaskManager.defineTask at the TOP LEVEL of a file imported at start-up (when the OS wakes your app there is no screen, only that code), then BackgroundTask.registerTaskAsync(name, { minimumInterval }) in minutes. The OS DECIDES when it runs (Android's WorkManager, iOS's BGTaskScheduler): at least 15 minutes apart, maybe much later, maybe not while the battery is low, and on iOS not at all after the user swipes the app away. Use it for \"sync when you can\", never for exact timing. Background location and audio are separate, heavily reviewed capabilities.",
        webLab: expoLab({
          name: "Kobo Reports",
          layout: BG_LAYOUT,
          task:
            "In src/tasks/sync.ts: define the \"report-sync\" task at the top level, sending the outbox with flush() and returning BackgroundTaskResult.Success, or Failed if flush throws; and write registerSync(), registering it with a minimumInterval of 60 minutes unless background tasks are Restricted. The root layout already imports the file and calls registerSync().",
          files: { "src/tasks/sync.ts": BG_TASK_START, "src/reports/outbox.ts": BG_OUTBOX, "src/app/index.tsx": BG_SCREEN, "server/index.js": BG_SERVER },
          readOnly: ["src/reports/outbox.ts", "src/app/index.tsx", "server/index.js", "src/app/_layout.tsx"],
          solution: { "src/tasks/sync.ts": BG_TASK_MODEL },
          tests: [
            { label: "The task is registered when the app starts", check: "await wait(300); return registeredTasks().includes('report-sync');", fail: "TaskManager.defineTask at the top level, then BackgroundTask.registerTaskAsync(\"report-sync\", { minimumInterval: 60 })." },
            { label: "When the OS runs it, saved reports are sent", check: "await typeInto('Describe the problem', 'Broken streetlight'); await press('Save report'); await wait(200); const results = await runBackgroundTasks(); const sent = await (await fetch('https://api.example.com/reports')).json(); return results.join() === '1' && sent.length === 1 && sent[0].text === 'Broken streetlight';", fail: "flush(), then return BackgroundTaskResult.Success (1)." },
            { label: "Offline, the task reports failure and keeps the reports", check: "await typeInto('Describe the problem', 'Blocked drain'); await press('Save report'); await setOnline(false); const results = await runBackgroundTasks(); await setOnline(true); return results.join() === '2' && JSON.parse(asyncStore().outbox).length === 1;", fail: "catch → BackgroundTaskResult.Failed (2)." },
          ],
          hint: "The task's function returns a BackgroundTaskResult.",
          successMessage: "Work that happens when the OS allows, without losing anything when it can't.",
        }),
      },
      {
        id: "a-md-battery-privacy",
        title: "Understanding battery, network, and privacy implications",
        explain:
          "Every capability has a COST to the user. BATTERY: GPS (High accuracy, continuous watching), the camera, constant network polling and background work drain it fastest; prefer Balanced accuracy, distance filters, push over polling, and batching. NETWORK: mobile data is expensive in many countries; compress images, cache, avoid autoplaying video on cellular (expo-network or NetInfo tell you the connection type), and respect Android's Data Saver. PRIVACY: collect only what the feature needs (approximate location if a city is enough), explain each permission honestly, never sell or leak data, let users delete it, and declare everything you collect: Apple's privacy \"nutrition labels\" and privacy manifests, and Google Play's Data safety form (Module 20) must match what the app really does, including third-party SDKs. Regulations such as Nigeria's NDPA and the EU's GDPR apply to apps too.",
        decision: {
          scenario: "A delivery app wants to show customers where their rider is. The first version tracks every user's location continuously in the background with High accuracy, \"in case it's useful later\", and uploads it every 10 seconds.",
          question: "What is the responsible design?",
          options: [
            { id: "a", text: "Track only riders, only during a delivery, with Balanced accuracy and a distance filter; customers share location only when they choose; declare it all in the store privacy forms", why: "Collect the minimum, for the feature that needs it, for as long as it's needed: less battery, less data, fewer permissions to justify to the stores and to users." },
            { id: "b", text: "Keep tracking everyone but upload every minute instead", whyWrong: "Still collects location nobody needs, drains batteries, and needs background location permission that stores will question." },
            { id: "c", text: "Track everyone but don't mention it in the privacy policy", whyWrong: "Undeclared collection gets apps removed from both stores and breaks data-protection law." },
            { id: "d", text: "Ask customers for background location when the app first opens", whyWrong: "Asking for the most sensitive permission with no context is the fastest way to be refused, and to fail review." },
          ],
          correct: "a",
          aftermath: "The least data, the least often, for the clearest reason: good for batteries, data plans, privacy and store review alike.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════ LESSON 104 · 16.P ═══════════════ */
  {
    id: "md-l104-m16-project",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 7,
    covers: ["16.P"],
    title: "Practical: A Field-Reporting App",
    subtitle: "Photos, locations, uploads and notifications in one app",
    estimatedMinutes: 150,
    intro: "Citizens report potholes, broken lights and blocked drains; the council fixes them and tells them so. The backend is ready; build the app.",
    atoms: [
      {
        id: "a-md-m16-project",
        title: "Build the field-reporting app",
        explain:
          "server/index.js accepts reports as multipart uploads (photo, description, latitude, longitude, address; photos up to 1 MB), lists them, and sends a push to registered phones when staff mark one fixed, with data.url pointing at the report.",
        webLab: expoLab({
          name: "Kobo Reports",
          layout: null,
          app: { extra: { eas: { projectId: "1b3c9e70-4f2a-4d6b-9a8e-2f6c0d1e5a77" } } },
          device: { build: "development" },
          task:
            "Build: a root Stack (index \"My reports\", new as a modal, reports/[id]) that registers for push at start-up (sending the token to POST /devices) and opens data.url when a notification is tapped. index lists reports as \"<description> · <status>\" links (testID \"report\") with a \"New report\" link and \"No reports yet\". new: \"Take a photo\" (asking camera permission) and \"Choose a photo\", \"Use my location\" (address shown, testID \"address\"; if refused, \"Location is off. Describe where it is instead.\"), a \"Describe the problem\" input, and \"Send report\": photo and description required (\"Add a photo of the problem\", \"Describe the problem\"), the photo resized to at most 1280 pixels and compressed before uploading, then back to the list. reports/[id] shows the photo, description, address and \"Status: <status>\" (testID \"status\").",
          files: {
            "src/app/_layout.tsx": "// The root layout.\n",
            "src/app/index.tsx": "// My reports.\n",
            "src/app/new.tsx": "// A new report.\n",
            "src/app/reports/[id].tsx": "// One report.\n",
            "src/media/prepare.ts": "",
            "src/notifications/register.ts": "",
            "server/index.js": P_SERVER,
          },
          readOnly: ["server/index.js"],
          revealSolution: false,
          solution: P_MODEL,
          tests: [
            { label: "A report needs a photo and a description", check: "await allow(); await waitFor(() => has('No reports yet'), 3000); await press('New report'); await waitFor(() => has('Send report'), 3000); await press('Send report'); await wait(200); const a = has('Add a photo of the problem'); await press('Choose a photo'); await pickPhoto(1); await press('Send report'); await wait(200); return a && has('Describe the problem') && !serverRequests().some((r) => r.path === '/reports' && r.method === 'POST');", fail: "Check both before uploading." },
            { label: "A full report is sent with its location and a compressed photo", check: "await typeInto('Describe the problem', 'Pothole on Broad Street'); await press('Use my location'); await allow(); await waitFor(() => exists({ testID: 'address' }), 3000); await press('Send report'); await waitFor(() => path() === '/', 4000); await waitFor(() => has('Pothole on Broad Street · Received'), 3000); const r = serverRequests().find((x) => x.path === '/reports' && x.method === 'POST'); return r.body.fields.address === '12 Broad Street, Lagos' && Number(r.body.fields.latitude) === 6.5244 && r.body.files[0].width === 1280;", fail: "Append photo, description, latitude, longitude and address; prepareForUpload first." },
            { label: "Staff fixing it sends a push that opens the report", check: "await waitFor(() => findAll({ testID: 'report' }).length === 1, 3000); await fetch('https://api.example.com/reports/1/resolve', { method: 'POST' }); await waitFor(() => notifications().some((n) => n.title === 'Your report was fixed'), 3000); await tapNotification(); await waitFor(() => path() === '/reports/1', 3000); await waitFor(() => exists({ testID: 'status' }), 3000); return find({ testID: 'status' }).textContent === 'Status: Fixed';", fail: "Register the token at start-up; on tap, router.push(data.url)." },
            { label: "Refusing location doesn't block the report", device: { build: "development", permissions: { location: "undetermined", notifications: "granted" } }, check: "await waitFor(() => has('New report'), 3000); await press('New report'); await waitFor(() => has('Use my location'), 3000); await press('Use my location'); await deny(); await waitFor(() => hasText('Location is off'), 3000); await press('Choose a photo'); await pickPhoto(2); await typeInto('Describe the problem', 'Blocked drain near the market'); await press('Send report'); await waitFor(() => path() === '/', 4000); return true;", fail: "Without location, send the report anyway." },
          ],
          hint: "Reuse prepareForUpload (Lesson 98) and the push code (Lesson 100).",
          successMessage: "An app that uses the camera, location, uploads and push together, and still works when any of them is refused.",
        }),
      },
    ],
    task: {
      title: "Module 16 practical: device features in your own app",
      intro: "Apply this module to the app you are building, on real phones.",
      prompts: [
        "Add the device features your app needs, and only those; write down each permission and the reason you will show the user.",
        "Test every refusal path: deny each permission once, then permanently, and check the app still works.",
        "Set up push notifications in a development build on a real Android phone and iPhone (EAS sets up the credentials), and send one from your server.",
        "Measure: check your app's battery use in the phone's settings after an hour, and the size of every upload.",
        "Mastery checkpoint: for each capability you use, explain when you ask for it, what happens if it's refused, and what it costs in battery, data and privacy.",
      ],
      closing: "Next: Module 17, production-level functionality.",
    },
    requirements: { read: true, video: false, assessment: true },
  },
];
