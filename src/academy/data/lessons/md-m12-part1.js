/**
 * MOBILE APP DEVELOPMENT · MODULE 12 · FORMS AND PERSISTENT DATA (part 1)
 *
 * Curriculum 12.1 – 12.5: inputs and selection controls, required fields,
 * email, password, number and date validation, keyboard types and secure
 * entry, and form submission with error messages.
 *
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 */

import { expoLab } from "./md-helpers.js";

export const SECTION_ID = "md-s12-forms-storage";
export const MODULE = "md-m12-forms-storage";

export const titled = (title) => `import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "${title}" }} />
    </Stack>
  );
}
`;

/* ── 12.1 · Controls ─────────────────────────────────────────────────── */
const SELECT = `import { useState } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";

type Props<T extends string> = { label: string; value: T; options: T[]; onChange: (value: T) => void };

/** React Native has no built-in dropdown: this one opens a list in a modal sheet. */
export function Select<T extends string>({ label, value, options, onChange }: Props<T>) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Pressable accessibilityRole="button" accessibilityHint="Opens a list of choices" onPress={() => setOpen(true)} style={styles.field}>
        <Text>
          {label}: {value}
        </Text>
      </Pressable>
      <Modal visible={open} transparent animationType="slide" onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)} />
        <View style={styles.sheet}>
          {options.map((o) => (
            <Pressable
              key={o}
              accessibilityRole="radio"
              accessibilityState={{ checked: o === value }}
              onPress={() => {
                onChange(o);
                setOpen(false);
              }}
              style={styles.option}
            >
              <Text>{o}</Text>
            </Pressable>
          ))}
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  field: { minHeight: 48, justifyContent: "center", borderWidth: 1, borderColor: "#cbd5e1", borderRadius: 10, paddingHorizontal: 12 },
  backdrop: { flex: 1, backgroundColor: "rgba(15,23,42,0.4)" },
  sheet: { backgroundColor: "#fff", paddingBottom: 32, borderTopLeftRadius: 16, borderTopRightRadius: 16 },
  option: { minHeight: 52, justifyContent: "center", paddingHorizontal: 20 },
});
`;
const DELIVERY_START = `import { StyleSheet, Switch, Text, TextInput, View, Pressable } from "react-native";
import { Select } from "@/components/Select";

const METHODS = ["Standard", "Express"] as const;
const STATES = ["Lagos", "Abuja", "Kano", "Rivers"];

export default function Delivery() {
  return (
    <View style={styles.page}>
      <TextInput placeholder="Full name" style={styles.input} />

      <View accessibilityRole="radiogroup" style={styles.row}>
        {METHODS.map((m) => (
          <Pressable key={m} accessibilityRole="radio" style={styles.segment}>
            <Text>{m}</Text>
          </Pressable>
        ))}
      </View>

      <Select label="State" value="Lagos" options={STATES} onChange={() => {}} />

      <View style={styles.row}>
        <Text style={{ flex: 1 }}>Gift wrap</Text>
        <Switch accessibilityLabel="Gift wrap" />
      </View>

      <Text testID="summary"></Text>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { padding: 20, gap: 14 },
  input: { minHeight: 48, borderWidth: 1, borderColor: "#cbd5e1", borderRadius: 10, paddingHorizontal: 12 },
  row: { flexDirection: "row", alignItems: "center", gap: 8 },
  segment: { flex: 1, minHeight: 44, justifyContent: "center", alignItems: "center", borderRadius: 10, borderWidth: 1, borderColor: "#cbd5e1" },
});
`;
const DELIVERY_MODEL = `import { useState } from "react";
import { StyleSheet, Switch, Text, TextInput, View, Pressable } from "react-native";
import { Select } from "@/components/Select";

const METHODS = ["Standard", "Express"] as const;
type Method = (typeof METHODS)[number];
const STATES = ["Lagos", "Abuja", "Kano", "Rivers"];

export default function Delivery() {
  const [name, setName] = useState("");
  const [method, setMethod] = useState<Method>("Standard");
  const [state, setState] = useState("Lagos");
  const [giftWrap, setGiftWrap] = useState(false);

  return (
    <View style={styles.page}>
      <TextInput placeholder="Full name" value={name} onChangeText={setName} style={styles.input} />

      <View accessibilityRole="radiogroup" style={styles.row}>
        {METHODS.map((m) => (
          <Pressable
            key={m}
            accessibilityRole="radio"
            accessibilityState={{ checked: m === method }}
            onPress={() => setMethod(m)}
            style={[styles.segment, m === method && styles.selected]}
          >
            <Text>{m}</Text>
          </Pressable>
        ))}
      </View>

      <Select label="State" value={state} options={STATES} onChange={setState} />

      <View style={styles.row}>
        <Text style={{ flex: 1 }}>Gift wrap</Text>
        <Switch accessibilityLabel="Gift wrap" value={giftWrap} onValueChange={setGiftWrap} />
      </View>

      <Text testID="summary">
        {method} to {state} for {name.trim() || "…"}
        {giftWrap ? " · gift wrapped" : ""}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { padding: 20, gap: 14 },
  input: { minHeight: 48, borderWidth: 1, borderColor: "#cbd5e1", borderRadius: 10, paddingHorizontal: 12 },
  row: { flexDirection: "row", alignItems: "center", gap: 8 },
  segment: { flex: 1, minHeight: 44, justifyContent: "center", alignItems: "center", borderRadius: 10, borderWidth: 1, borderColor: "#cbd5e1" },
  selected: { borderColor: "#0f766e", backgroundColor: "#ccfbf1" },
});
`;

/* ── 12.2 · Required fields ──────────────────────────────────────────── */
const REQUIRED_START = `import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

export default function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [done, setDone] = useState("");

  function submit() {
    setDone("Account created for " + name);
  }

  return (
    <View style={styles.page}>
      <TextInput placeholder="Name" value={name} onChangeText={setName} style={styles.input} />
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={styles.input} />
      <TextInput placeholder="Password" value={password} onChangeText={setPassword} style={styles.input} />
      <Pressable accessibilityRole="button" onPress={submit} style={styles.button}>
        <Text style={styles.buttonText}>Create account</Text>
      </Pressable>
      {done ? <Text>{done}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  page: { padding: 20, gap: 8 },
  input: { minHeight: 48, borderWidth: 1, borderColor: "#cbd5e1", borderRadius: 10, paddingHorizontal: 12 },
  error: { color: "#b91c1c", marginBottom: 4 },
  button: { marginTop: 8, minHeight: 48, borderRadius: 12, backgroundColor: "#0f766e", justifyContent: "center", alignItems: "center" },
  buttonText: { color: "#fff", fontWeight: "700" },
});
`;
const REQUIRED_MODEL = `import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

type Values = { name: string; email: string; password: string };
type Errors = Partial<Record<keyof Values, string>>;

function validate(values: Values): Errors {
  const errors: Errors = {};
  if (!values.name.trim()) errors.name = "Name is required";
  if (!values.email.trim()) errors.email = "Email is required";
  if (!values.password) errors.password = "Password is required";
  return errors;
}

export default function SignUp() {
  const [values, setValues] = useState<Values>({ name: "", email: "", password: "" });
  const [submitted, setSubmitted] = useState(false);
  const [done, setDone] = useState("");

  // Errors are derived from the values, and shown once the user has tried to submit.
  const errors = submitted ? validate(values) : {};
  const set = (field: keyof Values) => (text: string) => setValues((v) => ({ ...v, [field]: text }));

  function submit() {
    setSubmitted(true);
    if (Object.keys(validate(values)).length > 0) return;
    setDone("Account created for " + values.name.trim());
  }

  return (
    <View style={styles.page}>
      <TextInput placeholder="Name" value={values.name} onChangeText={set("name")} style={styles.input} />
      {errors.name ? <Text style={styles.error}>{errors.name}</Text> : null}
      <TextInput placeholder="Email" value={values.email} onChangeText={set("email")} style={styles.input} />
      {errors.email ? <Text style={styles.error}>{errors.email}</Text> : null}
      <TextInput placeholder="Password" value={values.password} onChangeText={set("password")} style={styles.input} />
      {errors.password ? <Text style={styles.error}>{errors.password}</Text> : null}
      <Pressable accessibilityRole="button" onPress={submit} style={styles.button}>
        <Text style={styles.buttonText}>Create account</Text>
      </Pressable>
      {done ? <Text>{done}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  page: { padding: 20, gap: 8 },
  input: { minHeight: 48, borderWidth: 1, borderColor: "#cbd5e1", borderRadius: 10, paddingHorizontal: 12 },
  error: { color: "#b91c1c", marginBottom: 4 },
  button: { marginTop: 8, minHeight: 48, borderRadius: 12, backgroundColor: "#0f766e", justifyContent: "center", alignItems: "center" },
  buttonText: { color: "#fff", fontWeight: "700" },
});
`;

/* ── 12.3 · Validation rules with Zod ────────────────────────────────── */
const ZOD_START = `import { z } from "zod";

export type SignupValues = { email: string; password: string; birthDate: string; budget: string };

// Write the rules here.
export const signupSchema = z.object({});

/** The first error message for each field that is wrong; {} when everything is valid. */
export function validateSignup(values: SignupValues): Partial<Record<keyof SignupValues, string>> {
  return {};
}
`;
const ZOD_MODEL = `import { z } from "zod";

export type SignupValues = { email: string; password: string; birthDate: string; budget: string };

const yearsSince = (iso: string) => {
  const born = new Date(iso + "T00:00:00Z");
  const now = new Date();
  let years = now.getUTCFullYear() - born.getUTCFullYear();
  const beforeBirthday = now.getUTCMonth() < born.getUTCMonth() || (now.getUTCMonth() === born.getUTCMonth() && now.getUTCDate() < born.getUTCDate());
  return beforeBirthday ? years - 1 : years;
};

export const signupSchema = z.object({
  email: z.string().trim().pipe(z.email("Enter a valid email address")),
  password: z
    .string()
    .min(8, "Use at least 8 characters")
    .regex(/[0-9]/, "Include at least one number"),
  birthDate: z
    .iso.date("Use the format YYYY-MM-DD")
    .refine((d) => new Date(d + "T00:00:00Z") < new Date(), "Your date of birth must be in the past")
    .refine((d) => yearsSince(d) >= 13, "You must be at least 13"),
  budget: z
    .string()
    .trim()
    .regex(/^\\d+(\\.\\d{1,2})?$/, "Enter an amount such as 25000 or 2500.50")
    .transform(Number)
    .pipe(z.number().positive("The budget must be more than 0").max(10_000_000, "That is more than ₦10,000,000")),
});

export function validateSignup(values: SignupValues): Partial<Record<keyof SignupValues, string>> {
  const result = signupSchema.safeParse(values);
  if (result.success) return {};
  const errors: Partial<Record<keyof SignupValues, string>> = {};
  for (const issue of result.error.issues) {
    const field = issue.path[0] as keyof SignupValues;
    if (!errors[field]) errors[field] = issue.message;
  }
  return errors;
}
`;
const ZOD_SCREEN = `import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { validateSignup, type SignupValues } from "@/validation/signup";

const FIELDS: { key: keyof SignupValues; placeholder: string }[] = [
  { key: "email", placeholder: "Email" },
  { key: "password", placeholder: "Password" },
  { key: "birthDate", placeholder: "Date of birth (YYYY-MM-DD)" },
  { key: "budget", placeholder: "Monthly budget (₦)" },
];

export default function SignUp() {
  const [values, setValues] = useState<SignupValues>({ email: "", password: "", birthDate: "", budget: "" });
  const [submitted, setSubmitted] = useState(false);
  const errors = submitted ? validateSignup(values) : {};
  const ok = submitted && Object.keys(errors).length === 0;
  return (
    <View style={{ padding: 20, gap: 8 }}>
      {FIELDS.map((f) => (
        <View key={f.key}>
          <TextInput placeholder={f.placeholder} value={values[f.key]} onChangeText={(t) => setValues((v) => ({ ...v, [f.key]: t }))} style={{ minHeight: 48, borderWidth: 1, borderColor: "#cbd5e1", borderRadius: 10, paddingHorizontal: 12 }} />
          {errors[f.key] ? <Text style={{ color: "#b91c1c" }}>{errors[f.key]}</Text> : null}
        </View>
      ))}
      <Pressable accessibilityRole="button" onPress={() => setSubmitted(true)} style={{ minHeight: 48, justifyContent: "center" }}>
        <Text>Create account</Text>
      </Pressable>
      {ok ? <Text>All good</Text> : null}
    </View>
  );
}
`;

/* ── 12.4 · Keyboards and secure entry ───────────────────────────────── */
const KEYBOARD_START = `import { useState } from "react";
import { StyleSheet, TextInput, View } from "react-native";

export default function Pay() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState("");

  return (
    <View style={styles.page}>
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={styles.input} />
      <TextInput placeholder="Password" value={password} onChangeText={setPassword} style={styles.input} />
      <TextInput placeholder="Phone number" value={phone} onChangeText={setPhone} style={styles.input} />
      <TextInput placeholder="Amount (₦)" value={amount} onChangeText={setAmount} style={styles.input} />
    </View>
  );
}

const styles = StyleSheet.create({
  page: { padding: 20, gap: 10 },
  input: { minHeight: 48, borderWidth: 1, borderColor: "#cbd5e1", borderRadius: 10, paddingHorizontal: 12 },
});
`;
const KEYBOARD_MODEL = `import { useRef, useState } from "react";
import { StyleSheet, TextInput, View, type TextInputInstance } from "react-native";

export default function Pay() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState("");
  const passwordRef = useRef<TextInputInstance>(null);
  const phoneRef = useRef<TextInputInstance>(null);
  const amountRef = useRef<TextInputInstance>(null);

  return (
    <View style={styles.page}>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        autoComplete="email"
        textContentType="emailAddress"
        returnKeyType="next"
        onSubmitEditing={() => passwordRef.current?.focus()}
        style={styles.input}
      />
      <TextInput
        ref={passwordRef}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoCapitalize="none"
        autoComplete="current-password"
        textContentType="password"
        returnKeyType="next"
        onSubmitEditing={() => phoneRef.current?.focus()}
        style={styles.input}
      />
      <TextInput
        ref={phoneRef}
        placeholder="Phone number"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
        autoComplete="tel"
        textContentType="telephoneNumber"
        returnKeyType="next"
        onSubmitEditing={() => amountRef.current?.focus()}
        style={styles.input}
      />
      <TextInput
        ref={amountRef}
        placeholder="Amount (₦)"
        value={amount}
        onChangeText={setAmount}
        keyboardType="decimal-pad"
        returnKeyType="done"
        style={styles.input}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  page: { padding: 20, gap: 10 },
  input: { minHeight: 48, borderWidth: 1, borderColor: "#cbd5e1", borderRadius: 10, paddingHorizontal: 12 },
});
`;

/* ── 12.5 · Submission ───────────────────────────────────────────────── */
const LOGIN_SERVER = `import { createServer } from "practice-server";

const app = createServer();

app.post(
  "/auth/login",
  (req, res) => {
    const { email, password } = req.body || {};
    if (email === "ada@example.com" && password === "kobo1234") return res.json({ name: "Ada" });
    res.status(401).json({ message: "Wrong email or password" });
  },
  { delay: 600 }
);

export default app;
`;
const LOGIN_START = `import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState<string | null>(null);

  async function submit() {
    const response = await fetch("https://api.example.com/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    setUser(data.name);
  }

  if (user) return <Text style={styles.page}>Welcome back, {user}</Text>;

  return (
    <View style={styles.page}>
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" style={styles.input} />
      <TextInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry style={styles.input} />
      <Pressable accessibilityRole="button" onPress={submit} style={styles.button}>
        <Text style={styles.buttonText}>Sign in</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { padding: 20, gap: 10 },
  input: { minHeight: 48, borderWidth: 1, borderColor: "#cbd5e1", borderRadius: 10, paddingHorizontal: 12 },
  error: { color: "#b91c1c" },
  button: { minHeight: 48, borderRadius: 12, backgroundColor: "#0f766e", justifyContent: "center", alignItems: "center" },
  buttonText: { color: "#fff", fontWeight: "700" },
});
`;
const LOGIN_MODEL = `import { useState } from "react";
import { ActivityIndicator, Keyboard, Pressable, StyleSheet, Text, TextInput, View } from "react-native";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function submit() {
    if (submitting) return;
    Keyboard.dismiss();
    setError("");
    setSubmitting(true);
    try {
      const response = await fetch("https://api.example.com/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message ?? "Something went wrong. Please try again.");
      setUser(data.name);
    } catch (e) {
      setError(e instanceof TypeError ? "No internet connection. Check it and try again." : (e as Error).message);
    } finally {
      setSubmitting(false);
    }
  }

  if (user) return <Text style={styles.page}>Welcome back, {user}</Text>;

  return (
    <View style={styles.page}>
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" style={styles.input} />
      <TextInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry onSubmitEditing={submit} style={styles.input} />
      {error ? (
        <Text accessibilityRole="alert" style={styles.error}>
          {error}
        </Text>
      ) : null}
      <Pressable accessibilityRole="button" accessibilityState={{ busy: submitting, disabled: submitting }} disabled={submitting} onPress={submit} style={[styles.button, submitting && { opacity: 0.6 }]}>
        {submitting ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Sign in</Text>}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { padding: 20, gap: 10 },
  input: { minHeight: 48, borderWidth: 1, borderColor: "#cbd5e1", borderRadius: 10, paddingHorizontal: 12 },
  error: { color: "#b91c1c" },
  button: { minHeight: 48, borderRadius: 12, backgroundColor: "#0f766e", justifyContent: "center", alignItems: "center" },
  buttonText: { color: "#fff", fontWeight: "700" },
});
`;

const attr = (placeholder, name) => `find({ placeholder: '${placeholder}' }).getAttribute('${name}')`;

export const PART1 = [
  /* ═══════════════ LESSON 70 · 12.1 ═══════════════ */
  {
    id: "md-l70-form-controls",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 1,
    covers: ["12.1"],
    title: "Text Inputs, Choices, Switches and Dropdowns",
    subtitle: "The controls every form is made of",
    estimatedMinutes: 45,
    intro: "Forms are where users give your app information: delivery addresses, sign-ups, payments. They should be quick to fill in with a thumb.",
    atoms: [
      {
        id: "a-md-form-controls",
        title: "Text inputs, dropdowns, switches, and selection controls",
        explain:
          "React Native gives you TextInput (value + onChangeText) and Switch (value + onValueChange), both used as CONTROLLED components: state holds the value, and the control shows it. For one choice out of a few, use a SEGMENTED control or radio buttons: Pressables with accessibilityRole=\"radio\" and accessibilityState={{ checked }}, inside a View with accessibilityRole=\"radiogroup\". For one choice out of many (a state, a country), there is no built-in dropdown: open a list in a Modal or bottom sheet (as the Select component here does), or use the community packages @react-native-picker/picker or @react-native-community/datetimepicker, which show each platform's native picker. Make every control at least 44–48 points tall, and label each one.",
        webLab: expoLab({
          name: "Kobo",
          layout: titled("Delivery"),
          task:
            "Wire the delivery form up with state: the name input, the Standard/Express choice (radio buttons that show which is checked), the State dropdown (the Select component is given) and the Gift wrap switch. The summary line should read like \"Express to Abuja for Ada · gift wrapped\" (\"…\" until a name is typed, and no gift-wrap part when the switch is off).",
          files: { "src/app/index.tsx": DELIVERY_START, "src/components/Select.tsx": SELECT },
          readOnly: ["src/components/Select.tsx"],
          solution: { "src/app/index.tsx": DELIVERY_MODEL },
          tests: [
            { label: "The summary starts with the defaults", check: "return find({ testID: 'summary' }).textContent === 'Standard to Lagos for …';", fail: "Standard and Lagos by default, and \"…\" with no name." },
            { label: "Every control changes the summary", check: "await typeInto('Full name', 'Ada'); await press({ role: 'radio', name: 'Express' }); await press('State: Lagos'); await waitFor(() => exists({ role: 'radio', name: 'Abuja' }), 2000); await press({ role: 'radio', name: 'Abuja' }); await toggle({ label: 'Gift wrap' }); return find({ testID: 'summary' }).textContent === 'Express to Abuja for Ada · gift wrapped';", fail: "Controlled inputs: value + onChangeText, accessibilityState, onChange, value + onValueChange." },
            { label: "The choices say which one is checked", check: "await press({ role: 'radio', name: 'Express' }); return find({ role: 'radio', name: 'Express' }).getAttribute('aria-checked') === 'true' && find({ role: 'radio', name: 'Standard' }).getAttribute('aria-checked') === 'false';", fail: "accessibilityState={{ checked: m === method }}" },
          ],
          hint: "Four useState calls, then value and a change handler on each control.",
          successMessage: "Every control controlled by state, so the summary can never disagree with the form.",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════ LESSON 71 · 12.2 – 12.3 ═══════════════ */
  {
    id: "md-l71-validation",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 2,
    covers: ["12.2", "12.3"],
    title: "Required Fields and Validation Rules",
    subtitle: "Catching mistakes before they reach the server, and explaining them clearly",
    estimatedMinutes: 55,
    intro: "Good validation tells users exactly what to fix, next to the field, at the right moment.",
    atoms: [
      {
        id: "a-md-required",
        title: "Required fields and input validation",
        explain:
          "VALIDATION checks input before it is used. Make validate(values) a pure function returning an errors object ({ email: \"Email is required\" }); an empty object means valid. Show each message right under its field, in words that say how to fix it. Timing matters: don't shout at people before they have typed; show errors once they try to submit (or leave a field), then update them live as they fix things, which happens naturally when errors are DERIVED from the values. Trim text before checking it (\"  \" is not a name). Validation on the phone is for the user's convenience; the server must check everything again, because requests can be sent without your app.",
        webLab: expoLab({
          name: "Kobo",
          layout: titled("Sign up"),
          task:
            "Make all three fields required. Pressing \"Create account\" with a field empty (or only spaces) shows \"Name is required\", \"Email is required\" or \"Password is required\" under it and creates nothing; once shown, an error disappears as soon as its field is filled; with everything filled, show \"Account created for <name>\".",
          files: { "src/app/index.tsx": REQUIRED_START },
          solution: { "src/app/index.tsx": REQUIRED_MODEL },
          tests: [
            { label: "No errors before the first attempt", check: "return !hasText('is required');", fail: "Show errors only after a submit attempt." },
            { label: "Submitting empty shows every error and creates nothing", check: "await typeInto('Name', '   '); await press('Create account'); return has('Name is required') && has('Email is required') && has('Password is required') && !hasText('Account created');", fail: "Check each trimmed value and stop if there are errors." },
            { label: "Errors clear as the fields are filled", check: "await restart(); await waitFor(() => has('Create account'), 2000); await press('Create account'); await typeInto('Email', 'ada@example.com'); return !has('Email is required') && has('Name is required');", fail: "Derive the errors from the current values after submitting." },
            { label: "A complete form succeeds", check: "await restart(); await waitFor(() => has('Create account'), 2000); await typeInto('Name', ' Ada '); await typeInto('Email', 'ada@example.com'); await typeInto('Password', 'kobo1234'); await press('Create account'); return has('Account created for Ada') && !hasText('is required');", fail: "Trim the name in the success message." },
          ],
          hint: "One validate function, called while rendering once submitted is true, and again in submit.",
          successMessage: "Clear messages, at the right time, in the right place.",
        }),
      },
      {
        id: "a-md-validation-rules",
        title: "Email, password, number, and date validation",
        explain:
          "Writing every rule by hand gets long; a SCHEMA library such as ZOD describes them declaratively and gives TypeScript types for free. z.email(\"…\") checks an address's shape (the only real proof is a confirmation e-mail). Passwords: a minimum length (8+) matters most; a required digit is a common extra. Numbers arrive from a TextInput as STRINGS: check the format first (digits, at most two decimals), then convert and check the range. Dates typed as text: z.iso.date() checks the YYYY-MM-DD format and that it is a real day, then .refine() adds rules such as \"in the past\" and \"at least 13 years ago\". schema.safeParse(values) returns { success, data } or { success: false, error }, whose issues each have a path (the field) and a message. (A native date picker avoids format errors entirely; validate anyway.)",
        webLab: expoLab({
          name: "Kobo",
          layout: titled("Sign up"),
          task:
            "In src/validation/signup.ts, write signupSchema with Zod and validateSignup(values), returning the first message for each wrong field. Rules: email a valid address (spaces around it are fine) → \"Enter a valid email address\"; password at least 8 characters → \"Use at least 8 characters\", with a digit → \"Include at least one number\"; birthDate in YYYY-MM-DD → \"Use the format YYYY-MM-DD\", in the past → \"Your date of birth must be in the past\", at least 13 years ago → \"You must be at least 13\"; budget digits with up to 2 decimals → \"Enter an amount such as 25000 or 2500.50\", more than 0 → \"The budget must be more than 0\", at most 10,000,000 → \"That is more than ₦10,000,000\".",
          files: { "src/validation/signup.ts": ZOD_START, "src/app/index.tsx": ZOD_SCREEN },
          readOnly: ["src/app/index.tsx"],
          solution: { "src/validation/signup.ts": ZOD_MODEL },
          tests: [
            { label: "Valid values pass", check: "const { validateSignup } = load('src/validation/signup.ts'); return Object.keys(validateSignup({ email: ' ada@example.com ', password: 'kobo1234', birthDate: '1998-05-14', budget: '2500.50' })).length === 0;", fail: "Trim the email before checking it." },
            { label: "Email and password rules", check: "const { validateSignup } = load('src/validation/signup.ts'); const base = { email: 'ada@example.com', password: 'kobo1234', birthDate: '1998-05-14', budget: '25000' }; return validateSignup({ ...base, email: 'ada@' }).email === 'Enter a valid email address' && validateSignup({ ...base, password: 'kobo1' }).password === 'Use at least 8 characters' && validateSignup({ ...base, password: 'koboshop' }).password === 'Include at least one number';", fail: "z.email(…), .min(8, …), .regex(/[0-9]/, …)" },
            { label: "Date rules", check: "const { validateSignup } = load('src/validation/signup.ts'); const base = { email: 'ada@example.com', password: 'kobo1234', birthDate: '1998-05-14', budget: '25000' }; const y = new Date().getFullYear(); return validateSignup({ ...base, birthDate: '14/05/1998' }).birthDate === 'Use the format YYYY-MM-DD' && validateSignup({ ...base, birthDate: '1998-02-30' }).birthDate === 'Use the format YYYY-MM-DD' && validateSignup({ ...base, birthDate: (y + 1) + '-01-01' }).birthDate === 'Your date of birth must be in the past' && validateSignup({ ...base, birthDate: (y - 5) + '-01-01' }).birthDate === 'You must be at least 13';", fail: "z.iso.date(…).refine(past, …).refine(13 years, …)" },
            { label: "Number rules", check: "const { validateSignup } = load('src/validation/signup.ts'); const base = { email: 'ada@example.com', password: 'kobo1234', birthDate: '1998-05-14', budget: '25000' }; return validateSignup({ ...base, budget: '25k' }).budget === 'Enter an amount such as 25000 or 2500.50' && validateSignup({ ...base, budget: '1.234' }).budget === 'Enter an amount such as 25000 or 2500.50' && validateSignup({ ...base, budget: '0' }).budget === 'The budget must be more than 0' && validateSignup({ ...base, budget: '20000000' }).budget === 'That is more than ₦10,000,000';", fail: "Check the text's format, then convert and check the range." },
            { label: "The form shows the messages", check: "await typeInto('Email', 'ada'); await press('Create account'); return has('Enter a valid email address') && has('Use at least 8 characters') && !has('All good');", fail: "validateSignup returns one message per field." },
          ],
          hint: "Strings first: z.string().trim().pipe(z.email(…)) and .regex(…).transform(Number).pipe(z.number()…).",
          successMessage: "Every rule in one schema, with a clear message for each mistake.",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════ LESSON 72 · 12.4 – 12.5 ═══════════════ */
  {
    id: "md-l72-keyboards-submit",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 3,
    covers: ["12.4", "12.5"],
    title: "Keyboards, Secure Entry and Submitting Forms",
    subtitle: "The right keyboard for each field, and a submit that behaves",
    estimatedMinutes: 50,
    intro: "On a phone, the keyboard is half the form. Choosing it well, and handling submission carefully, makes a form feel effortless.",
    atoms: [
      {
        id: "a-md-keyboards",
        title: "Handling keyboard types and secure text entry",
        explain:
          "Tell the phone what each field is for. keyboardType chooses the keyboard: \"email-address\" (with @), \"phone-pad\", \"number-pad\" (digits only) or \"decimal-pad\" (digits and a decimal point, for money). For e-mail and usernames, autoCapitalize=\"none\" and autoCorrect={false}. secureTextEntry hides a password as it is typed. autoComplete (\"email\", \"current-password\", \"new-password\", \"tel\", \"one-time-code\"; Android and iOS) and textContentType (iOS) let password managers and SMS codes fill fields in. returnKeyType sets the Return key's label (\"next\", \"done\", \"send\"); with onSubmitEditing and a ref you move to the next field: onSubmitEditing={() => passwordRef.current?.focus()}. Don't block pasting into password fields.",
        webLab: expoLab({
          name: "Kobo",
          layout: titled("Pay"),
          task:
            "Give each field the right keyboard and hints: Email (email keyboard, no capitals or autocorrect, autoComplete \"email\"), Password (hidden, autoComplete \"current-password\"), Phone number (phone keypad, autoComplete \"tel\"), Amount (decimal keypad). The Return key says \"next\" on the first three and moves to the next field, and \"done\" on the last.",
          files: { "src/app/index.tsx": KEYBOARD_START },
          solution: { "src/app/index.tsx": KEYBOARD_MODEL },
          tests: [
            { label: "Email: email keyboard, no capitals, autofill", check: `return find({ placeholder: 'Email' }).type === 'email' && ${attr("Email", "autocapitalize")} === 'none' && ${attr("Email", "autocomplete")} === 'email';`, fail: "keyboardType=\"email-address\" autoCapitalize=\"none\" autoComplete=\"email\"" },
            { label: "Password is hidden and autofills", check: `return find({ placeholder: 'Password' }).type === 'password' && ${attr("Password", "autocomplete")} === 'current-password';`, fail: "secureTextEntry autoComplete=\"current-password\"" },
            { label: "Phone and amount get keypads", check: `return find({ placeholder: 'Phone number' }).type === 'tel' && ${attr("Amount (₦)", "inputmode")} === 'decimal';`, fail: "keyboardType=\"phone-pad\" and keyboardType=\"decimal-pad\"" },
            { label: "Return moves through the fields", check: `const hints = ['Email', 'Password', 'Phone number', 'Amount (₦)'].map((p) => find({ placeholder: p }).getAttribute('enterkeyhint')); await typeInto('Email', 'ada@example.com'); await submit('Email'); const a = document.activeElement?.getAttribute('placeholder'); await submit('Password'); const b = document.activeElement?.getAttribute('placeholder'); await submit('Phone number'); const c = document.activeElement?.getAttribute('placeholder'); return hints.join() === 'next,next,next,done' && a === 'Password' && b === 'Phone number' && c === 'Amount (₦)';`, fail: "returnKeyType=\"next\" and onSubmitEditing={() => nextRef.current?.focus()}" },
          ],
          hint: "useRef<TextInputInstance>(null) (a type from react-native) for each field that receives focus, passed as ref.",
          successMessage: "The right keyboard every time, and a form you can fill without leaving the keyboard.",
        }),
      },
      {
        id: "a-md-submission",
        title: "Form submission and error messages",
        explain:
          "A good submit: (1) ignores a second tap while the first is in progress (disable the button and show a spinner; a double tap must never send two payments); (2) dismisses the keyboard (Keyboard.dismiss()) so the result is visible; (3) checks response.ok and shows the SERVER'S message for expected failures (\"Wrong email or password\"); (4) turns a network failure (fetch rejects with a TypeError, \"Network request failed\") into words a person understands; (5) always re-enables the form afterwards, in finally; (6) shows errors with accessibilityRole=\"alert\" so screen readers announce them. Let the Return key on the last field submit too (onSubmitEditing).",
        webLab: expoLab({
          name: "Kobo",
          layout: titled("Sign in"),
          task:
            "Make submission robust: ignore taps while signing in (disable the button and show an ActivityIndicator), dismiss the keyboard, show the server's message when sign-in fails (\"Wrong email or password\"), show \"No internet connection. Check it and try again.\" when offline, re-enable the button afterwards, and submit from the password field's Return key. Errors use accessibilityRole=\"alert\". The working login is ada@example.com / kobo1234.",
          files: { "src/app/index.tsx": LOGIN_START, "server/index.js": LOGIN_SERVER },
          readOnly: ["server/index.js"],
          solution: { "src/app/index.tsx": LOGIN_MODEL },
          tests: [
            { label: "A wrong password shows the server's message, and the form works again", check: "await typeInto('Email', 'ada@example.com'); await typeInto('Password', 'wrong'); await press({ role: 'button' }); await waitFor(() => has('Wrong email or password'), 3000); return exists({ role: 'alert' }) && !disabled({ role: 'button' });", fail: "if (!response.ok) throw new Error(data.message); and finally { setSubmitting(false); }" },
            { label: "Double taps send one request", check: "await restart(); await waitFor(() => has('Sign in'), 2000); await typeInto('Email', 'ada@example.com'); await typeInto('Password', 'kobo1234'); const before = serverRequests().length; await press({ role: 'button' }); await press({ role: 'button' }); await waitFor(() => has('Welcome back, Ada'), 3000); return serverRequests().length - before === 1;", fail: "Disable the button and return early while submitting." },
            { label: "Offline gets a human message", check: "await restart(); await waitFor(() => has('Sign in'), 2000); await setOnline(false); await typeInto('Email', 'ada@example.com'); await typeInto('Password', 'kobo1234'); await press({ role: 'button' }); await waitFor(() => hasText('No internet connection'), 3000); await setOnline(true); return true;", fail: "e instanceof TypeError → \"No internet connection. Check it and try again.\"" },
            { label: "Return submits, and the keyboard closes", check: "await restart(); await waitFor(() => has('Sign in'), 2000); await typeInto('Email', 'ada@example.com'); await typeInto('Password', 'kobo1234'); await submit('Password'); await waitFor(() => has('Welcome back, Ada'), 3000); return !keyboard().visible && code('src/app/index.tsx').includes('Keyboard.dismiss()');", fail: "onSubmitEditing={submit} on the password field, and Keyboard.dismiss() in submit." },
          ],
          hint: "try { … } catch (e) { … } finally { setSubmitting(false); }",
          successMessage: "A submit that can't double-send, always explains itself, and always recovers.",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },
];
