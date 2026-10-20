import { readJson, sendJson } from "../http.js";
import { authenticate } from "../services/authService.js";

export async function login(req, res) {
  const { email, password } = await readJson(req);
  if (!email || !password) {
    return sendJson(res, 400, { error: "Email and password are required" });
  }
  const session = await authenticate(email, password);
  if (!session) return sendJson(res, 401, { error: "Invalid email or password" });
  sendJson(res, 200, session);
}

export async function me(req, res) {
  sendJson(res, 200, { user: req.user });
}
