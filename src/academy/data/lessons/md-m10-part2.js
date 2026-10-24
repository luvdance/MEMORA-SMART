/**
 * MOBILE APP DEVELOPMENT · MODULE 10 · CODEBASE STRUCTURE AND MAINTAINABILITY (part 2)
 *
 * Curriculum 10.9 – 10.P: dependency management, reading documentation
 * and debugging unfamiliar libraries, Git branches, commits and pull
 * requests, and the module practical (a task manager).
 *
 * Every terminal shows what the command REALLY printed: see
 * scripts/mdRecord.mjs, which writes md-transcripts.js.
 *
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 */

import { expoLab } from "./md-helpers.js";
import { MODULE, SECTION_ID } from "./md-m10-part1.js";
import T from "./md-transcripts.js";

const APP = "~/projects/my-first-app $";

/* ── 10.10 · Reading documentation and debugging ─────────────────────── */
const REMEMBER_START = `import * as SecureStore from "expo-secure-store";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";

// What the server sent back after signing in (JSON.parse gives it the type any).
const session = JSON.parse('{ "token": "tok_8f2a91", "user": "ada" }');

export default function Account() {
  const [status, setStatus] = useState("");

  async function remember() {
    await SecureStore.setItemAsync("kobo session", session);
    setStatus("Saved");
  }

  async function restore() {
    const raw = await SecureStore.getItemAsync("kobo session");
    setStatus(raw ? "Signed in as " + JSON.parse(raw).user : "Nothing saved");
  }

  return (
    <View style={{ padding: 20, gap: 12 }}>
      <Pressable accessibilityRole="button" onPress={remember} style={{ minHeight: 48, justifyContent: "center" }}>
        <Text>Remember me</Text>
      </Pressable>
      <Pressable accessibilityRole="button" onPress={restore} style={{ minHeight: 48, justifyContent: "center" }}>
        <Text>Restore session</Text>
      </Pressable>
      <Text>{status}</Text>
    </View>
  );
}
`;
const REMEMBER_MODEL = `import * as SecureStore from "expo-secure-store";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";

// What the server sent back after signing in (JSON.parse gives it the type any).
const session = JSON.parse('{ "token": "tok_8f2a91", "user": "ada" }');

// Keys may only contain letters, digits, ".", "-" and "_"; values must be strings.
const KEY = "kobo_session";

export default function Account() {
  const [status, setStatus] = useState("");

  async function remember() {
    try {
      await SecureStore.setItemAsync(KEY, JSON.stringify(session));
      setStatus("Saved");
    } catch (e) {
      setStatus("Couldn't save: " + (e as Error).message);
    }
  }

  async function restore() {
    try {
      const raw = await SecureStore.getItemAsync(KEY);
      setStatus(raw ? "Signed in as " + JSON.parse(raw).user : "Nothing saved");
    } catch (e) {
      setStatus("Couldn't restore: " + (e as Error).message);
    }
  }

  return (
    <View style={{ padding: 20, gap: 12 }}>
      <Pressable accessibilityRole="button" onPress={remember} style={{ minHeight: 48, justifyContent: "center" }}>
        <Text>Remember me</Text>
      </Pressable>
      <Pressable accessibilityRole="button" onPress={restore} style={{ minHeight: 48, justifyContent: "center" }}>
        <Text>Restore session</Text>
      </Pressable>
      <Text>{status}</Text>
    </View>
  );
}
`;

/* ── 10.P · The practical ────────────────────────────────────────────── */
const P_TYPES = `export type Task = { id: string; title: string; done: boolean };
`;
const p_server = (tasks) => `import { createServer } from "practice-server";

const app = createServer();
const tasks = ${tasks};

app.get("/tasks", (req, res) => res.json(tasks));

app.get("/tasks/:id", (req, res) => {
  const task = tasks.find((t) => t.id === req.params.id);
  if (!task) return res.status(404).json({ message: "Task not found" });
  res.json(task);
});

app.patch("/tasks/:id", (req, res) => {
  const task = tasks.find((t) => t.id === req.params.id);
  if (!task) return res.status(404).json({ message: "Task not found" });
  if (typeof req.body?.done === "boolean") task.done = req.body.done;
  res.json(task);
});

export default app;
`;
const P_SERVER = p_server(`[
  { id: "1", title: "Order fabric", done: false },
  { id: "2", title: "Call the tailor", done: true },
  { id: "3", title: "Book a fitting", done: false },
]`);
const P_SERVER_ALL_DONE = p_server(`[
  { id: "1", title: "Order fabric", done: true },
  { id: "2", title: "Call the tailor", done: true },
]`);

const P_MODEL = {
  "src/constants/theme.ts": `export const colors = {
  primary: "#0f766e",
  text: "#0f172a",
  muted: "#64748b",
  border: "#e2e8f0",
  onPrimary: "#ffffff",
};

export const spacing = { sm: 8, md: 16, lg: 24 };
`,
  "src/services/api.ts": `const API_URL = "https://api.example.com";

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

type Options = { method?: "GET" | "POST" | "PATCH" | "DELETE"; body?: unknown };

export async function request<T>(path: string, { method = "GET", body }: Options = {}): Promise<T> {
  const response = await fetch(API_URL + path, {
    method,
    headers: { Accept: "application/json", "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const data = await response.json().catch(() => null);
  if (!response.ok) throw new ApiError(response.status, data?.message ?? "Request failed (" + response.status + ")");
  return data as T;
}
`,
  "src/services/tasks.ts": `import { request } from "@/services/api";
import type { Task } from "@/types/task";

export const getTasks = () => request<Task[]>("/tasks");

export const getTask = (id: string) => request<Task>("/tasks/" + id);

export const updateTask = (id: string, changes: Partial<Pick<Task, "title" | "done">>) =>
  request<Task>("/tasks/" + id, { method: "PATCH", body: changes });
`,
  "src/hooks/useTasks.ts": `import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { getTasks } from "@/services/tasks";
import type { Task } from "@/types/task";

/** The tasks, fetched again each time the screen comes into focus. */
export function useTasks() {
  const [tasks, setTasks] = useState<Task[] | null>(null);
  const [error, setError] = useState("");

  useFocusEffect(
    useCallback(() => {
      let active = true;
      getTasks().then(
        (list) => {
          if (active) {
            setTasks(list);
            setError("");
          }
        },
        (e: Error) => {
          if (active) setError(e.message);
        }
      );
      return () => {
        active = false;
      };
    }, [])
  );

  return { tasks, error };
}
`,
  "src/components/EmptyState.tsx": `import { StyleSheet, Text, View } from "react-native";
import { colors, spacing } from "@/constants/theme";

export function EmptyState({ title, message }: { title: string; message: string }) {
  return (
    <View style={styles.box}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: { flex: 1, alignItems: "center", justifyContent: "center", padding: spacing.lg, gap: spacing.sm },
  title: { fontSize: 20, fontWeight: "700", color: colors.text },
  message: { fontSize: 15, color: colors.muted, textAlign: "center" },
});
`,
  "src/components/TaskRow.tsx": `import { Link } from "expo-router";
import { StyleSheet } from "react-native";
import { colors, spacing } from "@/constants/theme";
import type { Task } from "@/types/task";

export function TaskRow({ task }: { task: Task }) {
  return (
    <Link href={"/task/" + task.id} testID="task" style={styles.row}>
      {task.title}
    </Link>
  );
}

const styles = StyleSheet.create({
  row: { padding: spacing.md, fontSize: 16, color: colors.text, borderBottomWidth: 1, borderColor: colors.border },
});
`,
  "src/components/TaskList.tsx": `import { ActivityIndicator, FlatList, Text } from "react-native";
import { EmptyState } from "@/components/EmptyState";
import { TaskRow } from "@/components/TaskRow";
import { useTasks } from "@/hooks/useTasks";

type Props = { done: boolean; emptyTitle: string; emptyMessage: string };

/** One list for both tabs: the open tasks, or the finished ones. */
export function TaskList({ done, emptyTitle, emptyMessage }: Props) {
  const { tasks, error } = useTasks();
  if (error) return <Text style={{ padding: 24 }}>{error}</Text>;
  if (!tasks) return <ActivityIndicator style={{ marginTop: 40 }} />;
  const shown = tasks.filter((t) => t.done === done);
  if (shown.length === 0) return <EmptyState title={emptyTitle} message={emptyMessage} />;
  return <FlatList data={shown} keyExtractor={(t) => t.id} renderItem={({ item }) => <TaskRow task={item} />} />;
}
`,
  "src/app/_layout.tsx": `import { Stack } from "expo-router";

export const unstable_settings = { anchor: "(tabs)" };

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="task/[id]" options={{ title: "Task" }} />
    </Stack>
  );
}
`,
  "src/app/(tabs)/_layout.tsx": `import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="index" options={{ title: "To do" }} />
      <Tabs.Screen name="done" options={{ title: "Done" }} />
    </Tabs>
  );
}
`,
  "src/app/(tabs)/index.tsx": `import { TaskList } from "@/components/TaskList";

export default function ToDo() {
  return <TaskList done={false} emptyTitle="Nothing to do" emptyMessage="Every task is finished." />;
}
`,
  "src/app/(tabs)/done.tsx": `import { TaskList } from "@/components/TaskList";

export default function Done() {
  return <TaskList done emptyTitle="Nothing done yet" emptyMessage="Finished tasks appear here." />;
}
`,
  "src/app/task/[id].tsx": `import { router, Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import { colors, spacing } from "@/constants/theme";
import { getTask, updateTask } from "@/services/tasks";
import type { Task } from "@/types/task";

export default function TaskDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [task, setTask] = useState<Task | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getTask(id).then(setTask, (e: Error) => setError(e.message));
  }, [id]);

  async function toggle() {
    if (!task) return;
    try {
      await updateTask(task.id, { done: !task.done });
      router.back();
    } catch (e) {
      setError((e as Error).message);
    }
  }

  if (error) return <Text style={styles.page}>{error}</Text>;
  if (!task) return <ActivityIndicator style={{ marginTop: 40 }} />;
  return (
    <View style={styles.page}>
      <Stack.Screen options={{ title: task.title }} />
      <Text style={styles.title}>{task.title}</Text>
      <Text style={styles.status}>Status: {task.done ? "finished" : "to do"}</Text>
      <Pressable accessibilityRole="button" onPress={toggle} style={styles.button}>
        <Text style={styles.buttonText}>{task.done ? "Mark as not done" : "Mark as done"}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { padding: spacing.lg, gap: spacing.sm },
  title: { fontSize: 22, fontWeight: "700", color: colors.text },
  status: { color: colors.muted },
  button: { marginTop: spacing.md, minHeight: 48, borderRadius: 12, backgroundColor: colors.primary, justifyContent: "center", alignItems: "center" },
  buttonText: { color: colors.onPrimary, fontWeight: "700" },
});
`,
};

const ROUTE_FILES = ["src/app/_layout.tsx", "src/app/(tabs)/_layout.tsx", "src/app/(tabs)/index.tsx", "src/app/(tabs)/done.tsx", "src/app/task/[id].tsx"];

export const PART2 = [
  /* ═══════════════ LESSON 60 · 10.9 – 10.10 ═══════════════ */
  {
    id: "md-l60-deps-docs",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 5,
    covers: ["10.9", "10.10"],
    title: "Dependencies, Documentation and Debugging",
    subtitle: "Choosing packages carefully, and fixing problems in code you didn't write",
    estimatedMinutes: 50,
    intro: "Most of your app is other people's code. Knowing how to choose it, keep it compatible, read its documentation and debug it is a core professional skill.",
    atoms: [
      {
        id: "a-md-dependencies",
        title: "Understanding dependency management",
        explain:
          "Every package you add is code you now depend on: it adds size, can break on upgrade, and can carry security problems. Before adding one, check it on npm and GitHub: is it maintained (recent releases, issues answered), widely used, and, for anything native, does it support Expo? The React Native Directory (reactnative.directory) shows each library's Expo Go, Android and iOS support. In an Expo project, the SDK fixes the versions of React, React Native and Expo's own modules that work together. So install with npx expo install, and check the project with npx expo install --check (or npx expo-doctor) instead of trusting npm outdated, which lists the newest versions on npm whether or not your SDK supports them. Upgrade the SDK as a planned step (npx expo install expo@^59 --fix, then follow the upgrade guide), on a branch, not package by package. Remove packages you no longer use with npm uninstall.",
        terminalExercise: {
          prompt: APP,
          intro: "Recorded in the course's Expo SDK 58 project, my-first-app.",
          goal: "Check that every package in the project is at the version its Expo SDK expects.",
          commands: {
            "npm outdated": T.deps["npm outdated"],
            "npx expo install --check": T.deps["npx expo install --check"],
            "npm ls react": T.deps["npm ls react"],
          },
          available: ["npm outdated", "npx expo install --check", "npm ls react"],
          accept: ["npx expo install --check"],
          near: [
            { command: "npm outdated", why: "That compares against the newest versions on npm, which your SDK may not support. Ask Expo instead: npx expo install --check." },
            { command: "npm ls react", why: "That shows which packages depend on React and the version installed. To check every package against the SDK, use npx expo install --check." },
          ],
          hint: "Expo's install command has a --check option.",
          success: "Expo compared every package with the versions SDK 58 expects. Run it after adding packages and before every build.",
        },
      },
      {
        id: "a-md-docs-debugging",
        title: "Reading documentation and debugging unfamiliar libraries",
        explain:
          "When a library misbehaves: (1) READ THE WHOLE ERROR. It usually names the rule you broke. (2) Go to the library's own documentation for YOUR version (Expo's docs have a version picker at the top) and read the function's reference: its parameters, return value and \"Note\" boxes. Expo's SecureStore page says: keys \"must not be empty and contain only alphanumeric characters, ., - and _\", and values must be strings (JSON.stringify objects). (3) Reproduce the problem in the smallest piece of code you can. (4) Search the library's GitHub issues with the exact error text; then the changelog, if it broke after an upgrade. (5) Use the debugger: press j in the npx expo start terminal to open React Native DevTools, set breakpoints and inspect values, rather than guessing. Finally, an error that can happen in production (storage, network) should be caught and shown, not left to crash.",
        webLab: expoLab({
          name: "Kobo",
          layout: `import { Stack } from "expo-router";\n\nexport default function RootLayout() {\n  return (\n    <Stack>\n      <Stack.Screen name="index" options={{ title: "Account" }} />\n    </Stack>\n  );\n}\n`,
          task:
            "\"Remember me\" does nothing, and the console shows an error. Press it, read the error in the logs, check the rule in the explanation (quoted from Expo's SecureStore documentation), and fix the code. You will meet a second error after the first: fix that too. Then wrap both functions' work in try/catch, so a storage failure shows \"Couldn't save: …\" instead of failing silently.",
          files: { "src/app/index.tsx": REMEMBER_START },
          solution: { "src/app/index.tsx": REMEMBER_MODEL },
          tests: [
            { label: "Remember me saves the session", check: "await waitFor(() => has('Remember me'), 2000); await press('Remember me'); await waitFor(() => has('Saved'), 2000); const stored = Object.values(secureStore()); return stored.length === 1 && JSON.parse(stored[0]).user === 'ada';", fail: "A key with only letters, digits, \".\", \"-\" and \"_\", and JSON.stringify(session) as the value." },
            { label: "It survives a restart", check: "await restart(); await waitFor(() => has('Restore session'), 2000); await press('Restore session'); await waitFor(() => has('Signed in as ada'), 2000); return true;", fail: "getItemAsync must use the same key as setItemAsync." },
            { label: "Failures are caught and shown", check: "const c = code('src/app/index.tsx'); return (c.match(/catch\\s*\\(/g) || []).length >= 2 && c.includes(\"Couldn't save\");", fail: "try { … } catch (e) { setStatus(\"Couldn't save: \" + (e as Error).message); } in both functions." },
          ],
          hint: "One constant for the key, used by both functions, avoids the next bug too.",
          successMessage: "You read the error, checked the documentation and fixed it, which is how most bugs in unfamiliar libraries get solved.",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════ LESSON 61 · 10.11 ═══════════════ */
  {
    id: "md-l61-git-flow",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 6,
    covers: ["10.11"],
    title: "Git Branches, Commits and Pull Requests",
    subtitle: "How teams change one codebase without stepping on each other",
    estimatedMinutes: 45,
    intro: "In Module 2 you committed straight to main. Teams work on branches, and every change is reviewed in a pull request before it reaches main.",
    atoms: [
      {
        id: "a-md-git-flow",
        title: "Using Git branches, commits, and pull requests",
        explain:
          "A BRANCH is a separate line of commits. Keep main always working, and start each feature or fix on its own branch: git switch -c feature/task-filters. Commit small steps there with messages in the imperative (\"Add task filters\"); git log --oneline shows them on top of main's history. To share it, git push -u origin feature/task-filters, then open a PULL REQUEST (PR) on GitHub: it shows the diff, lets teammates review and comment line by line, and runs automatic checks (tests, lint, type-checks; Module 18). After approval it is MERGED into main and the branch deleted. Alone, you can merge locally: git switch main, git merge feature/task-filters (a \"fast-forward\" when main has not moved), git branch -d feature/task-filters. Pull often (git pull) so your branch does not drift far from main; if Git reports a MERGE CONFLICT, open the files, choose between the marked versions, then git add and git commit. Never commit secrets, node_modules or builds; the template's .gitignore already excludes the last two.",
        terminalExercise: {
          prompt: APP,
          intro: "Recorded in the same project: first the expo-haptics change was committed on main, then src/utils/filters.ts was written.",
          goal: "Work on a branch: create feature/task-filters, commit the new src/utils/filters.ts on it with the message \"Add task filters\", then merge it into main.",
          commands: {
            "git switch -c feature/task-filters": T.branch["git switch -c feature/task-filters"],
            "git status --short": T.branch["git status --short"],
            "git add src/utils/filters.ts": T.branch["git add src/utils/filters.ts"],
            'git commit -m "Add task filters"': T.branch['git commit -m "Add task filters"'],
            "git log --oneline": T.branch["git log --oneline"],
            "git switch main": T.branch["git switch main"],
            "git merge feature/task-filters": T.branch["git merge feature/task-filters"],
            "git branch -d feature/task-filters": T.branch["git branch -d feature/task-filters"],
          },
          available: [
            "git switch -c feature/task-filters",
            "git status --short",
            "git add src/utils/filters.ts",
            'git commit -m "Add task filters"',
            "git log --oneline",
            "git switch main",
            "git merge feature/task-filters",
            "git branch -d feature/task-filters",
          ],
          accept: ["git merge feature/task-filters"],
          near: [
            { command: "git switch -c feature/task-filters", why: "You are on the new branch. Stage and commit the file, then switch back to main and merge." },
            { command: 'git commit -m "Add task filters"', why: "Committed on the branch. Now git switch main and git merge feature/task-filters." },
            { command: "git switch main", why: "Back on main, which does not have the commit yet. Merge the branch in." },
          ],
          hint: "switch -c, add, commit, switch main, merge.",
          success: "main now has the feature's commit. On a team, this merge happens on GitHub, after the pull request is reviewed.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════ LESSON 62 · 10.P ═══════════════ */
  {
    id: "md-l62-m10-project",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 7,
    covers: ["10.P"],
    title: "Practical: A Maintainable Task Manager",
    subtitle: "Tabs, details, a server, reusable components and a clean structure",
    estimatedMinutes: 120,
    intro: "Build a complete small app the way a team would want to find it.",
    atoms: [
      {
        id: "a-md-m10-project",
        title: "Build the task manager",
        explain:
          "The server (server/index.js) and the Task type are given. Everything else is yours, organised as this module taught: route files that only compose, services for the server, a hook for loading, shared components and theme constants. Grading checks both the behaviour and the structure.",
        webLab: expoLab({
          name: "Tasks",
          layout: null,
          task:
            "Build it. Structure: src/services/api.ts (request + ApiError) and src/services/tasks.ts (getTasks, getTask, updateTask(id, changes) with PATCH); src/hooks/useTasks.ts (loads the tasks each time a screen gains focus, with useFocusEffect); src/components/ EmptyState, TaskRow (a link to /task/<id>, testID \"task\") and TaskList (shared by both tabs); src/constants/theme.ts. Screens: a root Stack (anchor \"(tabs)\") with the (tabs) group and task/[id]; tabs \"To do\" (index) and \"Done\" (done), with empty states \"Nothing to do\" and \"Nothing done yet\"; the task screen shows the task's title as its header title, \"Mark as done\" (or \"Mark as not done\"), which saves and goes back, and the server's message (\"Task not found\") for an unknown id.",
          files: {
            "src/app/_layout.tsx": "// The root Stack.\n",
            "src/app/(tabs)/_layout.tsx": "// The tabs.\n",
            "src/app/(tabs)/index.tsx": "// To do.\n",
            "src/app/(tabs)/done.tsx": "// Done.\n",
            "src/app/task/[id].tsx": "// One task.\n",
            "src/services/api.ts": "",
            "src/services/tasks.ts": "",
            "src/hooks/useTasks.ts": "",
            "src/components/EmptyState.tsx": "",
            "src/components/TaskRow.tsx": "",
            "src/components/TaskList.tsx": "",
            "src/constants/theme.ts": "",
            "src/types/task.ts": P_TYPES,
            "server/index.js": P_SERVER,
          },
          readOnly: ["src/types/task.ts", "server/index.js"],
          revealSolution: false,
          solution: P_MODEL,
          tests: [
            { label: "To do lists the open tasks", check: "await waitFor(() => has('Order fabric'), 3000); return has('Book a fitting') && !has('Call the tailor') && findAll({ testID: 'task' }).length === 2;", fail: "TaskList with done={false}, rows from TaskRow." },
            { label: "Done lists the finished ones", check: "await press('Done'); await waitFor(() => has('Call the tailor'), 3000); return path() === '/done';", fail: "A \"done\" tab showing tasks with done: true." },
            { label: "An unknown task shows the server's message", check: "await navigate('/task/99'); await waitFor(() => has('Task not found'), 3000); return true;", fail: "Catch getTask's ApiError and show its message." },
            { label: "Marking a task done saves it and moves it to Done", check: "await restart(); await waitFor(() => has('Order fabric'), 3000); await press('Order fabric'); await waitFor(() => screenTitle() === 'Order fabric', 3000); const at = path() === '/task/1'; await press('Mark as done'); await waitFor(() => path() === '/', 3000); await waitFor(() => !has('Order fabric'), 3000); const patch = serverRequests().find((r) => r.method === 'PATCH'); await press('Done'); await waitFor(() => has('Order fabric'), 3000); return at && !!patch && patch.path === '/tasks/1' && patch.body.done === true;", fail: "updateTask(id, { done: true }), router.back(), and lists that reload on focus." },
            { label: "With nothing left to do, To do shows its empty state", swap: { "server/index.js": P_SERVER_ALL_DONE }, check: "await waitFor(() => has('Nothing to do'), 3000); return true;", fail: "<EmptyState title=\"Nothing to do\" … /> when the filtered list is empty." },
            { label: "The structure: thin routes, services, a hook and shared components", check: `const routes = ${JSON.stringify(ROUTE_FILES)}; const thin = routes.every((f) => !code(f).includes('fetch(') && !/#[0-9a-f]{3,6}/i.test(code(f))); const s = load('src/services/tasks.ts'); const c = ['EmptyState', 'TaskRow', 'TaskList'].every((n) => typeof load('src/components/' + n + '.tsx')[n] === 'function'); return thin && typeof s.updateTask === 'function' && typeof load('src/hooks/useTasks.ts').useTasks === 'function' && c && code('src/hooks/useTasks.ts').includes('useFocusEffect') && typeof load('src/constants/theme.ts').colors === 'object';`, fail: "No fetch or hex colours in src/app; services, hooks, components and theme as listed." },
          ],
          hint: "Build from the bottom up: api.ts, tasks.ts, the hook, the components, then the screens.",
          successMessage: "A small app with a big-app structure. Every later module builds on this layout.",
        }),
      },
    ],
    task: {
      title: "Module 10 practical: a codebase someone else can work on",
      intro: "Apply this module to your own app.",
      prompts: [
        "Reorganise your app into src/app (routes only), components, hooks, services, utils, constants and types.",
        "Move every fetch into one request() function and per-resource services; move magic values into constants and per-build settings into .env.",
        "Export an ErrorBoundary from your root layout.",
        "Run npx expo install --check and npx expo-doctor, and fix what they report.",
        "Make each of these changes on its own branch, push it, and open a pull request on GitHub with a description of what changed and how you tested it.",
        "Mastery checkpoint: ask a friend to find where a given piece of your app lives, and to change it in one place, without your help.",
      ],
      closing: "Next: Module 11, managing application state.",
    },
    requirements: { read: true, video: false, assessment: true },
  },
];
