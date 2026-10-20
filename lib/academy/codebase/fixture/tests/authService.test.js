import { test } from "node:test";
import assert from "node:assert/strict";

process.env.SESSION_SECRET ??= "test-secret";
const { hashPassword, verifyPassword, signToken, verifyToken } = await import("../server/services/authService.js");

const user = { salt: "4f1c9a", passwordHash: hashPassword("market-day-2026", "4f1c9a") };

test("the right password verifies", () => {
  assert.equal(verifyPassword("market-day-2026", user), true);
});

test("a wrong password does not", () => {
  assert.equal(verifyPassword("market-day-2025", user), false);
});

test("a signed token verifies back to its user", () => {
  assert.equal(verifyToken(signToken("u_1001")), "u_1001");
});

test("a tampered token is rejected", () => {
  const token = signToken("u_1001").replace("u_1001", "u_1002");
  assert.equal(verifyToken(token), null);
});
