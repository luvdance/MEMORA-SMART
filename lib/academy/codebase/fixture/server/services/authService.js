import { createHmac, scryptSync, timingSafeEqual } from "node:crypto";
import { findUserByEmail } from "../db/index.js";
import { config } from "../config.js";

const TOKEN_LIFETIME_MS = 7 * 24 * 60 * 60 * 1000; // one week

export function hashPassword(password, salt) {
  return scryptSync(password, salt, 32).toString("hex");
}

export function verifyPassword(password, user) {
  const attempt = Buffer.from(hashPassword(password, user.salt), "hex");
  const stored = Buffer.from(user.passwordHash, "hex");
  return attempt.length === stored.length && timingSafeEqual(attempt, stored);
}

function sign(payload) {
  return createHmac("sha256", config.sessionSecret).update(payload).digest("hex");
}

// A token is "userId.issuedAt.signature". Only the server knows the secret,
// so only the server can produce a signature that verifies.
export function signToken(userId, issuedAt = Date.now()) {
  const payload = `${userId}.${issuedAt}`;
  return `${payload}.${sign(payload)}`;
}

export function verifyToken(token) {
  const [userId, issuedAt, signature] = String(token).split(".");
  if (!userId || !issuedAt || !signature) return null;
  const expected = sign(`${userId}.${issuedAt}`);
  if (signature.length !== expected.length) return null;
  if (!timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return null;
  if (Date.now() - Number(issuedAt) > TOKEN_LIFETIME_MS) return null;
  return userId;
}

export async function authenticate(email, password) {
  const user = await findUserByEmail(email.trim().toLowerCase());
  if (!user || !verifyPassword(password, user)) return null;
  return {
    token: signToken(user.id),
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
  };
}
