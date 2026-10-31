import { useCallback, useEffect, useState } from "react";
import { auth } from "../firebase";

/**
 * Local development without a Firebase account: set localStorage
 * memotifyDevUser to "uid:email" or "uid:email:admin". The whole branch is
 * removed from production builds, because import.meta.env.DEV is false there,
 * and the deployed server does not accept these tokens either way.
 */
export function devUser() {
  if (!import.meta.env.DEV) return null;
  try {
    const value = localStorage.getItem("memotifyDevUser");
    if (!value) return null;
    const [uid, email] = value.split(":");
    return { uid, email, displayName: uid, emailVerified: true, token: `dev:${value}` };
  } catch {
    return null;
  }
}

async function tokenOf() {
  const dev = devUser();
  if (dev) return dev.token;
  return auth.currentUser ? auth.currentUser.getIdToken() : null;
}

/** Every Memotify call. Throws an Error with .status and .reason. */
export async function api(action, { body, params } = {}) {
  const query = params
    ? `?${new URLSearchParams(Object.entries(params).filter(([, v]) => v !== "" && v != null))}`
    : "";
  const token = await tokenOf();

  const res = await fetch(`/api/memotify/${action}${query}`, {
    method: body ? "POST" : "GET",
    headers: {
      ...(body ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => null);
  if (!res.ok || !data) {
    const failure = new Error(data?.error || "We could not reach Memotify. Check your connection and try again.");
    failure.status = res.status;
    failure.reason = data?.reason;
    throw failure;
  }
  return data;
}

/** A streamed route: calls onEvent for each line of newline-delimited JSON. */
export async function apiStream(action, body, onEvent) {
  const token = await tokenOf();
  const res = await fetch(`/api/memotify/${action}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: JSON.stringify(body),
  });
  if (!res.ok || !res.body) {
    const data = await res.json().catch(() => null);
    const failure = new Error(data?.error || "We could not reach Memotify. Check your connection and try again.");
    failure.reason = data?.reason;
    throw failure;
  }
  const reader = res.body.pipeThrough(new TextDecoderStream()).getReader();
  let held = "";
  for (;;) {
    const { value, done } = await reader.read();
    if (done) break;
    held += value;
    const lines = held.split("\n");
    held = lines.pop();
    for (const line of lines) if (line) onEvent(JSON.parse(line));
  }
}

/** Load one route. `key` is what makes it reload; null waits. */
export function useLoad(action, params, key) {
  const [state, setState] = useState({ data: null, error: null, loading: true, ran: null });
  const [tick, setTick] = useState(0);
  const serial = JSON.stringify(key === undefined ? params ?? null : key);
  const reload = useCallback(() => setTick((n) => n + 1), []);

  useEffect(() => {
    if (key === null) return undefined;
    let alive = true;
    api(action, { params: JSON.parse(JSON.stringify(params ?? {})) })
      .then((data) => alive && setState({ data, error: null, loading: false, ran: serial }))
      .catch((error) => alive && setState((prev) => ({ ...prev, error, loading: false, ran: serial })));
    return () => {
      alive = false;
    };
    // `serial` stands in for params.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [action, serial, tick]);

  const settled = state.ran === serial;
  return { ...state, loading: !settled, reload };
}
