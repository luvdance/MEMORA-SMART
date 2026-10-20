import { sendJson } from "../http.js";
import { verifyToken } from "../services/authService.js";
import { findUserById } from "../db/index.js";

// Wraps a handler so it only runs for a signed-in user, available as req.user.
export function requireAuth(handler) {
  return async (req, res, ...params) => {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;
    const userId = token && verifyToken(token);
    const user = userId && (await findUserById(userId));
    if (!user) return sendJson(res, 401, { error: "Sign in required" });
    req.user = { id: user.id, name: user.name, email: user.email, role: user.role };
    return handler(req, res, ...params);
  };
}
