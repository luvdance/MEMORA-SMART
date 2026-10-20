import { request } from "./client.js";

export function login(email, password) {
  return request("/api/login", { method: "POST", body: { email, password } });
}
